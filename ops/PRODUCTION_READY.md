# RSARBOS Production Readiness Checklist

## Status: 3/10 blocking items pending your action

---

## BLOCKING (can't deploy without these)

| # | Item | Status | Action |
|---|------|--------|--------|
| 1 | **Vercel authentication** | ⚠️ Pending | Run `vercel login` then `bash ops/setup-vercel-env.sh` |
| 2 | **Email credentials** | ⚠️ Pending | Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` env vars (see ops/send-outreach.py for format) |
| 3 | **Stripe keys** | ⚠️ Pending | Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Vercel env |
| 4 | **Database URL** | ⚠️ Pending | Set `DATABASE_URL` in Vercel env (SQLite local path or Postgres remote) |
| 5 | **Admin token** | ⚠️ Pending | Generate with `openssl rand -base64 32` and set as `ADMIN_TOKEN` in Vercel env |

## HIGH (recommended before launch)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6 | **HERMES_WEBHOOK_URL** | ⚠️ Pending | Tunnel (localtunnel/ngrok) for real-time webhooks. Polling fallback works without this. |
| 7 | **HERMES_WEBHOOK_SECRET** | ⚠️ Pending | HMAC secret for webhook signature verification. Script generates one. |
| 8 | **Resend API** | ⚠️ Pending | Transactional email service for dossier delivery (`RESEND_API_KEY`) |
| 9 | **Legal pages** | ⚠️ Partial | `/terms`, `/privacy`, `/refund-policy` routes exist but may need content |
| 10 | **SEO meta tags** | ⚠️ Missing | OpenGraph tags, meta descriptions, favicons not yet added |

## MEDIUM (nice to have)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 11 | **Analytics** | ⚠️ Missing | Plausible.io or Google Analytics tracking |
| 12 | **Error boundaries** | ⚠️ Missing | React error boundaries for production crash handling |
| 13 | **404 page** | ⚠️ Missing | Custom not-found page |
| 14 | **Cookie consent** | ⚠️ Missing | GDPR/privacy compliance banner |
| 15 | **Performance** | ⚠️ Partial | Image optimization, lazy loading not yet implemented |

## LOW (polish)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 16 | **Sitemap.xml** | ⚠️ Missing | Auto-generated sitemap for SEO |
| 17 | **Robots.txt** | ⚠️ Missing | Standard robots.txt |
| 18 | **Favicon** | ⚠️ Partial | Uses default, custom favicon needed |
| 19 | **Mobile testing** | ⚠️ Pending | Test on real iOS/Android devices |

---

## What's DONE ✅

- [x] Landing page cleaned up (removed $100 manual underwriting card)
- [x] Single consolidated request form (DossierRequestForm only)
- [x] Hero copy enhanced for acquisition funnel
- [x] ProofCarousel with 6 prospect insights + animations
- [x] Entrance animations on hero, pricing, carousel
- [x] OwnerDashboard at `/dossier-dashboard` with funnel tracking
- [x] Outreach templates for all 6 prospects (ops/send-outreach.py)
- [x] Webhook receiver (ops/hermes-webhook-receiver.js)
- [x] Vercel env setup script (ops/setup-vercel-env.sh)
- [x] All code committed and pushed to github.com/rsarbos/mission-control

---

## Quick Start Commands

```bash
# 1. Authenticate + set env vars
vercel login
cd /home/mr0/GHOST/mission-control
bash ops/setup-vercel-env.sh

# 2. Start dev server (local preview)
cd rsarbos-mission-control
npm run dev

# 3. Send outreach emails (after setting SMTP vars)
export SMTP_HOST=smtp.sendgrid.net
export SMTP_PORT=587
export SMTP_USER=apikey
export SMTP_PASS=your-api-key
python3 ops/send-outreach.py

# 4. Deploy
vercel --prod --force
```
