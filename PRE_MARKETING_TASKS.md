# RSARBOS Pre-Marketing Tasks

Tasks to complete before actively marketing the Manual Underwriting Report service.

## Payment + Intake

- [ ] Create Stripe live product for `Manual Underwriting Report`.
- [ ] Set Vercel env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_SITE_URL`.
- [ ] Create Stripe webhook for `https://www.rsarbos.com/api/stripe-webhook`.
- [ ] Confirm webhook listens to `checkout.session.completed`.
- [ ] Run one test payment end to end.
- [ ] Confirm abandoned checkout remains `pending_payment`.
- [ ] Confirm success page does not mark requests paid.

## Database

- [ ] Create Neon Postgres project.
- [ ] Set `DATABASE_URL` in Vercel.
- [ ] Verify `manual_underwriting_requests` table is created.
- [ ] Confirm submitted form data persists before payment.
- [ ] Add a simple admin/read workflow for pending and paid requests.

## Email

- [ ] Create or confirm Resend account.
- [ ] Verify sending domain.
- [ ] Set `RESEND_API_KEY`, `EMAIL_TO`, and `EMAIL_FROM` in Vercel.
- [ ] Confirm paid webhook sends request details to `uw.requests@rsarbos.com`.
- [ ] Decide whether to add customer confirmation emails.

## Report Operations

- [ ] Finalize the standard report template.
- [ ] Define the manual analyst checklist.
- [ ] Define report delivery format and private-link process.
- [ ] Create turnaround-time rules for standard and urgent requests.
- [ ] Create a saved response for incomplete or unclear submissions.

## Trust + Compliance

- [ ] Add terms of service.
- [ ] Add privacy policy.
- [ ] Add payment/refund policy.
- [ ] Add disclaimer that reports are decision-support, not financial/legal advice.
- [ ] Confirm use of third-party data sources and attribution requirements.

## Website + Analytics

- [ ] Review mobile layout on iPhone and Android widths.
- [ ] Review desktop layout on wide screens.
- [ ] Add analytics for hero CTA, request form start, checkout start, checkout success.
- [ ] Add conversion recovery workflow for `pending_payment` leads.
- [ ] Check all nav links and footer links.

## Launch Readiness

- [ ] Prepare 2-3 sample dossiers.
- [ ] Prepare screenshots/social assets.
- [ ] Create first outreach list.
- [ ] Write short sales message for investors/flippers/acquisition teams.
- [ ] Decide first marketing channel.
- [ ] Run one full internal dry run from property link to delivered report.
