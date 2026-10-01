# RSARBOS Lead-to-Revenue Funnel

## Overview

This document describes the automated lead-to-revenue pipeline that bridges the
rsarbos.com website (React/Vite frontend deployed on Vercel) with the local
Hermes Agent stack for underwriting automation.

The funnel has three stages:

1. **Free Complimentary Dossier** — Agent enters a property address → Hermes generates a 15-min underwriting dossier → emailed to the agent
2. **$300 Full Investor Dossier** — Agent upgrades from the free dossier → Stripe checkout → Hermes generates exhaustive dossier → emailed to the agent
3. **$100 Manual Underwriting Report** — Existing product, unchanged

## Architecture

```
┌──────────┐  1. Form Submit  ┌──────────────┐  2. DB + Webhook  ┌──────────┐
│  Agent   │ ───────────────► │  Vercel API  │ ────────────────► │  Hermes  │
│  (Web)   │                  │  (dossier-   │                    │  Agent   │
│          │ ◄──────────────── │  request.js) │ ◄───────────────  │  (Local) │
│          │  6. Dossier URL  │              │  3. Response     │          │
└──────────┘                  └──────────────┘                    └──────────┘
                                      │
                                      │ 4. Stripe Checkout ($300)
                                      ▼
                              ┌──────────────┐
                              │   Stripe     │
                              └──────────────┘
                                      │
                                      │ 5. Webhook: paid
                                      ▼
                              ┌──────────────┐
                              │  Hermes Agent │
                              │  (full dossier)│
                              └──────────────┘
```

### Flow Details

| Step | Component | Action |
|------|-----------|--------|
| 1 | `DossierRequestForm.tsx` (frontend) | Agent submits property address + contact info |
| 2 | `api/dossier-request.js` (Vercel) | Validates input, creates `dossier_requests` DB record, triggers Hermes webhook |
| 3 | `api/notify-hermes.js` (Vercel) | POSTs to `HERMES_WEBHOOK_URL` with HMAC-signed payload |
| 4 | Hermes Agent | Receives webhook, analyzes property, generates dossier |
| 5 | Hermes Agent | POSTs to `api/dossier-delivered.js` with dossier URL |
| 6 | `api/dossier-delivered.js` (Vercel) | Updates DB status, emails agent (includes $300 upgrade CTA) |
| 7 | Agent | Clicks upgrade CTA in email → `api/create-full-dossier-checkout.js` |
| 8 | Stripe | Handles $300 payment |
| 9 | `api/stripe-webhook.js` | Receives `checkout.session.completed`, triggers Hermes for full dossier |
| 10 | Hermes Agent | Generates full investor dossier |
| 11 | Hermes Agent | POSTs to `api/full-dossier-delivered.js` |
| 12 | `api/full-dossier-delivered.js` | Updates DB, emails agent the full dossier |

## Environment Variables

### API (Vercel / local dev)

```
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
EMAIL_TO=uw.requests@rsarbos.com
EMAIL_FROM=RSARBOS Intake <onboarding@resend.dev>
SITE_URL=https://www.rsarbos.com
ADMIN_TOKEN=<long-random-token>

# Hermes Agent webhook integration
HERMES_WEBHOOK_URL=https://your-tunnel.example.com/hermes-webhook
HERMES_WEBHOOK_SECRET=<long-random-secret>
```

### Frontend (Vite)

```
VITE_SITE_URL=https://www.rsarbos.com
VITE_PLAUSIBLE_DOMAIN=rsarbos.com
VITE_PLAUSIBLE_SCRIPT_SRC=https://plausible.io/js/script.js
```

## Hermes Agent Integration

### Option A: Webhook (Recommended)

When `HERMES_WEBHOOK_URL` is set, the Vercel API immediately POSTs to the
Hermes Agent whenever a new dossier request arrives. The Hermes Agent must:

1. Listen for POST requests at the configured URL
2. Verify the `x-rsarbos-signature` header (HMAC-SHA256 of `timestamp.payload`)
3. Parse the JSON payload (contains `request_id`, `agent_name`, `agent_email`,
   `property_address`, etc.)
4. Generate the dossier
5. POST the result to `/api/dossier-delivered` (or `/api/full-dossier-delivered`)

To expose the local Hermes Agent to the internet:

```bash
ngrok http 3000  # or cloudflared, or your preferred tunnel
```

Then set `HERMES_WEBHOOK_URL=https://<tunnel-id>.ngrok.io/hermes-webhook`.

### Option B: Polling (Fallback)

If `HERMES_WEBHOOK_URL` is not set, the request stays in the database with
status `requested`. A polling script can pick it up:

```bash
# One-shot poll
node ops/poll-dossier-requests.js --once

# Or set up a cron job
*/5 * * * * RSARBOS_SITE_URL=https://www.rsarbos.com ADMIN_TOKEN=... node /path/to/ops/poll-dossier-requests.js --once
```

The poller checks `/api/admin-dossiers` every 5 minutes for new requests
and triggers the Hermes Agent via local subprocess or MCP.

## Database Schema

### `dossier_requests` table

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | UUID of the request |
| agent_name | TEXT | Agent's full name |
| agent_email | TEXT | Agent's email (delivery target) |
| agent_phone | TEXT | Agent's phone number |
| property_address | TEXT | Property address |
| property_url | TEXT | Link to Zillow/Redfin/MLS |
| brokerage | TEXT | Agent's brokerage |
| mls_id | TEXT | MLS listing ID |
| source_channel | TEXT | How the lead came in (Website, etc.) |
| investment_intent | TEXT | Fix & Flip, Buy & Hold, etc. |
| status | TEXT | See status flow below |
| dossier_type | TEXT | `free` or `full` |
| hermes_task_id | TEXT | ID returned by Hermes webhook |
| hermes_payload | JSONB | Raw payload sent to Hermes |
| dossier_file_ref | TEXT | URL to the free dossier file |
| dossier_delivered_at | TIMESTAMPTZ | When free dossier was delivered |
| stripe_checkout_session_id | TEXT | Stripe checkout session for $300 |
| stripe_payment_intent_id | TEXT | Stripe payment intent for $300 |
| paid_at | TIMESTAMPTZ | When payment was confirmed |
| full_dossier_file_ref | TEXT | URL to the full dossier file |
| full_dossier_delivered_at | TIMESTAMPTZ | When full dossier was delivered |
| upgraded_at | TIMESTAMPTZ | When agent initiated $300 checkout |
| email_sent_at | TIMESTAMPTZ | When free dossier email was sent |
| admin_notes | TEXT | Owner notes |
| created_at | TIMESTAMPTZ | Request creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### Status Flow

```
┌─────────────┐  webhook →  ┌──────────────┐  Hermes generates  ┌──────────────┐  email sent  ┌──────────┐
│  requested  │ ──────────► │ hermes_queued│ ────────────────► │ dossier_     │ ───────────► │ delivered│
│             │              │              │                    │ generated    │              │ (free)   │
└─────────────┘              └──────────────┘                    └──────────────┘              └──────────┘
                                                                              │
                                                               upgrade CTA clicked
                                                                              ▼
┌─────────────────┐  Stripe webhook  ┌──────────┐  Hermes generates  ┌────────────────────┐  email sent  ┌──────────────────────┐
│ checkout_created│ ────────────────►│   paid   │ ────────────────► │ full_dossier_      │ ───────────► │ full_dossier_        │
│                 │                   │          │                    │ delivered          │              │ delivered            │
└─────────────────┘                   └──────────┘                    └────────────────────┘              └──────────────────────┘
```

## Frontend Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | PublicWebsite | Home page with hero, pricing, free dossier form, $100 manual form |
| `/dossier-dashboard` | DossierDashboard | Owner dashboard (password-protected via ADMIN_TOKEN) |
| `/dossier-success` | DossierSuccessPage | Success page after free dossier submission |
| `/payment-success` | PaymentSuccessPage | Stripe success redirect for $100/$300 |
| `/payment-cancel` | PaymentCancelPage | Stripe cancel redirect |

## API Endpoints

### Public (no auth)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/dossier-request` | Submit free 15-min dossier request |
| POST | `/api/create-full-dossier-checkout` | Create $300 Stripe checkout |
| POST | `/api/create-checkout-session` | Create $100 Stripe checkout (existing) |
| POST | `/api/contact` | Contact form (existing) |

### Hermes Callbacks (Hermes Agent → Vercel)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/dossier-delivered` | Hermes reports free dossier complete → triggers email |
| POST | `/api/full-dossier-delivered` | Hermes reports full dossier complete → triggers email |

### Webhooks

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/notify-hermes` | Manually re-trigger Hermes webhook (admin) |
| POST | `/api/stripe-webhook` | Stripe webhook (checkout.session.completed) |

### Admin (requires ADMIN_TOKEN)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin-dossiers` | List all dossier requests (with status filter) |
| GET | `/api/admin-requests` | List all manual underwriting requests (existing) |

## Email Templates

1. **Free Dossier Email** (`freeDossierEmailHtml`) — Sent to agent after Hermes generates the free dossier. Includes a prominent $300 upgrade CTA button.

2. **Full Dossier Email** (`fullDossierEmailHtml`) — Sent to agent after Hermes generates the full dossier following $300 payment.

3. **Admin Notification** (`sendAdminNotification`) — Sent to `EMAIL_TO` for new requests, deliveries, and payments.

## Owner Dashboard

The dashboard at `/dossier-dashboard` provides:

- Token-based auth (stored in localStorage)
- Table view of all dossier requests with status badges
- Pipeline summary metrics (new, processing, delivered, paid, full delivered)
- "Retry Hermes" button for stuck requests
- Auto-refresh every 30 seconds
- Status filtering (All, requested, hermes_queued, delivered, paid, etc.)

## Deployment Checklist

1. ✅ Clone repo: `git clone https://github.com/rsarbos/mission-control.git`
2. ✅ Install: `npm install`
3. ☐ Set env vars in Vercel dashboard (Database, Stripe, Resend, ADMIN_TOKEN, HERMES_WEBHOOK_URL)
4. ☐ Configure Stripe webhook endpoint to point to `https://www.rsarbos.com/api/stripe-webhook`
5. ☐ Set `STRIPE_WEBHOOK_SECRET` from Stripe dashboard
6. ☐ (Optional) Set up Hermes Agent webhook listener + ngrok tunnel
7. ☐ (Optional) Set up cron job for polling fallback
8. ☐ Deploy: `git push origin main` (or push via Vercel Git Integration)
9. ☐ Test: Submit a free dossier request at `https://www.rsarbos.com/#free-dossier`
10. ☐ Verify: Check owner dashboard at `https://www.rsarbos.com/dossier-dashboard`
