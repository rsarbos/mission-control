# RSARBOS Pre-Marketing Tasks

Tasks to complete before actively marketing the Manual Underwriting Report service.

Legend:

- `[x]` Verified or created locally.
- `[ ]` Requires owner action, live credentials, external dashboard access, or a business decision.

## Payment + Intake

- [ ] Create Stripe live product for `Manual Underwriting Report`.
  - Step 1: open Stripe Dashboard -> Product catalog -> Add product.
  - Step 2: name it `Manual Underwriting Report`.
  - Step 3: create a one-time price of `$100.00 USD`.
  - Step 4: leave fulfillment manual; the app creates Checkout Sessions with the same price details.
- [ ] Set Vercel env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_SITE_URL`.
  - Step 1: open Vercel -> RSARBOS project -> Settings -> Environment Variables.
  - Step 2: add `STRIPE_SECRET_KEY` from Stripe Developers -> API keys.
  - Step 3: add `STRIPE_WEBHOOK_SECRET` after creating the webhook endpoint.
  - Step 4: set `VITE_SITE_URL=https://www.rsarbos.com`.
  - Step 5: redeploy after saving env vars.
- [ ] Create Stripe webhook for `https://www.rsarbos.com/api/stripe-webhook`.
  - Step 1: open Stripe Dashboard -> Developers -> Webhooks.
  - Step 2: create endpoint `https://www.rsarbos.com/api/stripe-webhook`.
  - Step 3: copy the signing secret into Vercel as `STRIPE_WEBHOOK_SECRET`.
- [ ] Confirm webhook listens to `checkout.session.completed`.
  - Step 1: edit the Stripe webhook endpoint.
  - Step 2: select only `checkout.session.completed` for launch.
  - Step 3: send a test event and confirm Stripe shows a 2xx response.
- [ ] Run one test payment end to end.
  - Step 1: deploy with test `STRIPE_SECRET_KEY`, `DATABASE_URL`, `RESEND_API_KEY`, `EMAIL_TO`, and `EMAIL_FROM`.
  - Step 2: submit the request form with a real email you can monitor.
  - Step 3: pay with Stripe test card `4242 4242 4242 4242`.
  - Step 4: confirm the DB row changes from `pending_payment` to `paid`.
  - Step 5: confirm the internal email arrives at `uw.requests@rsarbos.com`.
- [x] Confirm abandoned checkout remains `pending_payment`.
  - Verified: `stripe-webhook.js` only updates status on `checkout.session.completed`; cancel/expired/abandoned sessions do not change status.
- [x] Confirm success page does not mark requests paid.
  - Verified: frontend success page only displays confirmation copy; payment status is changed only in the Stripe webhook.
- [x] Implement secure checkout creation endpoint.
  - Completed: `/api/create-checkout-session.js` stores the DB request first, then creates Stripe Checkout with `requestId` metadata.

## Database

- [ ] Create Neon Postgres project.
  - Step 1: create a Neon project for RSARBOS production.
  - Step 2: create or select the production branch.
  - Step 3: copy the pooled Postgres connection string.
  - Step 4: keep the password private and paste it only into Vercel env vars.
- [ ] Set `DATABASE_URL` in Vercel.
  - Step 1: add the Neon pooled connection string as `DATABASE_URL`.
  - Step 2: redeploy the site.
  - Step 3: submit one test request so the table auto-creates.
- [ ] Verify `manual_underwriting_requests` table is created in live DB.
  - Step 1: after a test form submission, open Neon SQL Editor.
  - Step 2: run `select id, customer_email, status, created_at from manual_underwriting_requests order by created_at desc limit 5;`.
  - Step 3: confirm the newest row exists with `pending_payment` before payment.
- [x] Add table creation logic for `manual_underwriting_requests`.
  - Completed: `api/_lib/db.js` creates the table if it does not exist.
- [x] Confirm submitted form data persists before payment.
  - Verified in code: `create-checkout-session.js` inserts full form data before Stripe Checkout is created.
- [x] Add a simple admin/read workflow for pending and paid requests.
  - Completed: `/api/admin-requests.js` lists requests with Bearer `ADMIN_TOKEN`, with optional `?status=pending_payment`.
- [ ] Set `ADMIN_TOKEN` in Vercel.
  - Step 1: generate a long random token locally with a password manager or `openssl rand -hex 32`.
  - Step 2: add it to Vercel as `ADMIN_TOKEN`.
  - Step 3: after deploy, call `/api/admin-requests?status=pending_payment` with `Authorization: Bearer YOUR_TOKEN`.

## Email

- [ ] Create or confirm Resend account.
  - Step 1: log in to Resend.
  - Step 2: create or select the RSARBOS workspace.
  - Step 3: create an API key with send access.
- [ ] Verify sending domain.
  - Step 1: add `rsarbos.com` or a subdomain like `mail.rsarbos.com` in Resend.
  - Step 2: add the required DNS records wherever the domain DNS is managed.
  - Step 3: wait for Resend to mark the domain verified.
- [ ] Set `RESEND_API_KEY`, `EMAIL_TO`, and `EMAIL_FROM` in Vercel.
  - Step 1: add `RESEND_API_KEY` from Resend.
  - Step 2: set `EMAIL_TO=uw.requests@rsarbos.com`.
  - Step 3: set `EMAIL_FROM` to a verified sender, for example `RSARBOS Intake <intake@rsarbos.com>`.
  - Step 4: redeploy.
- [x] Implement paid webhook email delivery to `uw.requests@rsarbos.com`.
  - Completed: `api/_lib/email.js` sends the request details through Resend after confirmed payment.
- [ ] Confirm paid webhook sends request details to `uw.requests@rsarbos.com`.
  - Step 1: complete the Stripe test payment flow.
  - Step 2: open the inbox for `uw.requests@rsarbos.com`.
  - Step 3: verify the email includes customer name, email, phone, property address, property URL, intent, urgency, notes, and request ID.
- [ ] Decide whether to add customer confirmation emails.
  - Step 1: choose whether customers should receive an automatic receipt-style confirmation after payment.
  - Step 2: if yes, add a second Resend send in the webhook after the internal email succeeds.
  - Step 3: keep Stripe as the payment receipt source either way.

## Report Operations

- [x] Create an operations checklist for manual reports.
  - Completed: `REPORT_OPERATIONS.md` includes analyst checklist, delivery process, turnaround rules, and saved responses.
- [ ] Finalize the standard report template.
  - Step 1: review the current Shawn Dr dossier page by page.
  - Step 2: confirm the section order, final copy, screenshots, source appendix, and disclaimer.
  - Step 3: save the approved version as the launch template for manual reports.
- [x] Define the manual analyst checklist.
  - Completed: see `REPORT_OPERATIONS.md`.
- [x] Define report delivery format and private-link process.
  - Completed: see `REPORT_OPERATIONS.md`.
- [x] Create turnaround-time rules for standard and urgent requests.
  - Completed: see `REPORT_OPERATIONS.md`.
- [x] Create a saved response for incomplete or unclear submissions.
  - Completed: see `REPORT_OPERATIONS.md`.

## Trust + Compliance

- [x] Add starter terms of service page.
  - Completed: `/terms`.
- [x] Add starter privacy policy page.
  - Completed: `/privacy`.
- [x] Add starter payment/refund policy page.
  - Completed: `/refund-policy`.
- [x] Add disclaimer that reports are decision-support, not financial/legal advice.
  - Completed: included in `/terms` and report delivery response.
- [ ] Owner/legal review of starter policies.
  - Step 1: read `/terms`, `/privacy`, and `/refund-policy`.
  - Step 2: confirm refund timing, manual-service language, privacy handling, and no-advice disclaimers.
  - Step 3: replace starter language with approved final language before paid traffic.
- [ ] Confirm use of third-party data sources and attribution requirements.
  - Step 1: open `DATA_SOURCE_REVIEW.md`.
  - Step 2: fill the attribution and usage notes for every source used in reports.
  - Step 3: remove or replace any source that cannot be used in public samples.
  - Step 4: keep source references in the report appendix for private paid reports.
- [x] Create data-source review worksheet.
  - Completed: `DATA_SOURCE_REVIEW.md` lists the launch sources to review before public marketing.

## Website + Analytics

- [ ] Review mobile layout on iPhone and Android widths.
  - Step 1: open the deployed preview on a real iPhone, Android device, or browser device emulator.
  - Step 2: check hero, phone preview, form, success/cancel pages, and legal pages.
  - Step 3: note any text overflow, cramped inputs, or hidden buttons.
- [ ] Review desktop layout on wide screens.
  - Step 1: open the deployed preview at 1440px or wider.
  - Step 2: check section order, hero height, pricing/template layout, and footer links.
  - Step 3: confirm the first three sections are hero, template/pricing, then request form.
- [x] Add analytics for hero CTA, request form start, checkout start, checkout success.
  - Completed: `trackEvent` pushes `hero_cta_click`, `request_form_start`, `checkout_start`, `checkout_success_page_view`, and `checkout_cancel_page_view` to `window.dataLayer`.
- [ ] Connect analytics provider.
  - Step 1: choose Google Tag Manager, Plausible, PostHog, or another analytics provider.
  - Step 2: install its script in the Vite app.
  - Step 3: map `window.dataLayer` events into goals or conversions.
- [x] Add conversion recovery workflow for `pending_payment` leads.
  - Completed: pending requests remain in DB, `/api/admin-requests` can list them, and `REPORT_OPERATIONS.md` includes a payment recovery response.
- [ ] Check all nav links and footer links in deployed environment.
  - Step 1: click every header nav item.
  - Step 2: click both hero CTAs.
  - Step 3: visit `/success`, `/cancel`, `/terms`, `/privacy`, and `/refund-policy`.
  - Step 4: confirm no deployed route returns a 404.

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
- [ ] Create first outreach list.
  - Step 1: open `OUTREACH_LIST_TEMPLATE.md`.
  - Step 2: add 25-50 names across investors, flippers, agents, wholesalers, and acquisition teams.
  - Step 3: fill contact, channel, reason they fit, and follow-up date.
  - Step 4: start with warm contacts before cold outreach.
- [x] Create first outreach list template.
  - Completed: `OUTREACH_LIST_TEMPLATE.md` is ready to fill with launch prospects.
- [x] Create social asset shot list.
  - Completed: `SOCIAL_ASSET_SHOT_LIST.md` lists the launch screenshots, crops, and first post angle.
- [x] Write short sales message for investors/flippers/acquisition teams.
  - Completed: see `MARKETING_STARTER.md`.
- [ ] Decide first marketing channel.
  - Step 1: choose one primary channel for tomorrow morning: warm DMs, LinkedIn post, local investor groups, or direct agent outreach.
  - Step 2: post or send there first before spreading attention across other channels.
  - Step 3: track replies in `OUTREACH_LIST_TEMPLATE.md`.
- [ ] Run one full internal dry run from property link to delivered report.
  - Step 1: after Stripe/Neon/Resend env vars are live, submit a test property through the site.
  - Step 2: complete payment.
  - Step 3: verify the DB row is `paid` and the email arrived.
  - Step 4: generate the report.
  - Step 5: send the private delivery link using the saved response in `REPORT_OPERATIONS.md`.
