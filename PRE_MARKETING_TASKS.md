# RSARBOS Pre-Marketing Tasks

Tasks to complete before actively marketing the Manual Underwriting Report service.

Legend:
- `[x]` Complete.
- `[ ]` Requires action.

## Payment + Intake

- [ ] Run one paid request end to end.
  - Step 1: choose test mode or live mode before paying.
  - Step 2: submit the request form with a real email you can monitor.
  - Step 3: complete payment in the selected mode.
  - Step 4: in Neon, run `select id, customer_email, status, created_at from manual_underwriting_requests order by created_at desc limit 1;` to confirm row changed from `pending_payment` to `paid`.
  - Step 5: confirm the internal email arrived at `uw.requests@rsarbos.com` with full details (name, email, phone, property address, property URL, intent, urgency, notes, request ID).

- [x] Set `ADMIN_TOKEN` in Vercel.
  - Completed 2026-06-06: installed Vercel CLI, linked `rsarb-app/mission-control`, generated a production `ADMIN_TOKEN`, redeployed, and verified `https://www.rsarbos.com/api/admin-requests?status=pending_payment` returned HTTP 200 with authorized results.
  - Current session token copy: `/tmp/rsarbos_admin_token`.

## Email

- [ ] Confirm paid request sends details to `uw.requests@rsarbos.com`.
  - Step 1: complete a full test payment (see Payment + Intake section above).
  - Step 2: open the inbox for `uw.requests@rsarbos.com`.
  - Step 3: verify the email includes customer name, email, phone, property address, property URL, intent, urgency, notes, and request ID.

- [ ] Decide whether to add customer confirmation emails.
  - Step 1: choose if customers should receive an automatic receipt-style email after payment.
  - Step 2: if yes, add a second customer-facing Resend send after the internal email succeeds.
  - Step 3: if no, rely on the payment receipt as the customer confirmation.

## Report Operations

- [ ] Finalize the standard report template.
  - Step 1: review the current Shawn Dr dossier page by page.
  - Step 2: confirm the section order, final copy, screenshots, source appendix, and disclaimer.
  - Step 3: save the approved version as the launch template for manual reports.

## Trust + Compliance

- [ ] Owner/legal review of starter policies.
  - Step 1: read `/terms`, `/privacy`, and `/refund-policy`.
  - Step 2: confirm refund timing, manual-service language, privacy handling, and no-advice disclaimers.
  - Step 3: replace starter language with approved final language before paid traffic.

- [ ] Confirm use of third-party data sources and attribution requirements.
  - Step 1: open `DATA_SOURCE_REVIEW.md`.
  - Step 2: fill the attribution and usage notes for every source used in reports.
  - Step 3: remove or replace any source that cannot be used in public samples.
  - Step 4: keep source references in the report appendix for private paid reports.

## Website + Analytics

- [ ] Review mobile layout on iPhone and Android widths.
  - Step 1: open https://www.rsarbos.com on a real iPhone, Android device, or browser device emulator.
  - Step 2: check hero, phone preview, form, success/cancel pages, and legal pages.
  - Step 3: note any text overflow, cramped inputs, or hidden buttons and fix them.

- [ ] Review desktop layout on wide screens (1440px+).
  - Step 1: open https://www.rsarbos.com at 1440px or wider.
  - Step 2: check section order, hero height, pricing/template layout, and footer links.
  - Step 3: confirm the first three sections are hero, template/pricing, then request form.

- [ ] Check all nav links and footer links.
  - Step 1: click every header nav item.
  - Step 2: click both hero CTAs.
  - Step 3: visit `/payment-success`, `/payment-cancel`, `/terms`, `/privacy`, and `/refund-policy`.
  - Step 4: confirm no deployed route returns a 404.

- [ ] Connect analytics provider.
  - Step 1: choose Google Tag Manager, Plausible, PostHog, or another analytics provider.
  - Step 2: install its script in the Vite app.
  - Step 3: map `window.dataLayer` events into goals or conversions.

## Launch Readiness

- [ ] Prepare 2-3 sample dossiers.
  - Step 1: choose two more properties that are safe to use as examples.
  - Step 2: create dossiers using the approved template.
  - Step 3: remove or anonymize any data that should not be public.
  - Step 4: approve whether launch starts with one sample or three.

- [ ] Prepare screenshots/social assets.
  - Step 1: open `SOCIAL_ASSET_SHOT_LIST.md`.
  - Step 2: capture each listed website and report screenshot.
  - Step 3: export square, portrait, story, and LinkedIn landscape crops.

- [ ] Fill in first outreach list with real prospects.
  - Step 1: open `OUTREACH_LIST_TEMPLATE.md`.
  - Step 2: add 25-50 names across investors, flippers, agents, wholesalers, and acquisition teams.
  - Step 3: fill contact, channel, reason they fit, and follow-up date.
  - Step 4: prioritize warm contacts before cold outreach.

- [ ] Decide first marketing channel.
  - Step 1: choose one primary channel for launch day: warm DMs, LinkedIn post, local investor groups, or direct agent outreach.
  - Step 2: post or send there first before spreading attention across other channels.
  - Step 3: track replies in `OUTREACH_LIST_TEMPLATE.md`.

- [ ] Run one full internal dry run from form to delivered report.
  - Step 1: submit a test property through the site.
  - Step 2: complete payment.
  - Step 3: verify the DB row is `paid` and the internal email arrived.
  - Step 4: generate the report manually.
  - Step 5: send the private delivery link using the saved response in `REPORT_OPERATIONS.md`.
