# DOSSIER PROCESSING — STATE

- Current Mission: Automated lead-to-revenue funnel (free 15-min dossier → $300 full dossier)
- Current Phase: Revenue automation deployment
- Current Constraint: Hermes Agent webhook integration
- Highest Lever Task: Configure Hermes webhook listener and tunnel for automated dossier generation
- Next Recommended Task: Set HERMES_WEBHOOK_URL in Vercel env, start Hermes webhook listener, verify end-to-end flow

# DOSSIER PROCESSING — TASKS

## Founder Tasks
- Set HERMES_WEBHOOK_URL and HERMES_WEBHOOK_SECRET in Vercel environment — open
- Set ADMIN_TOKEN in Vercel environment — open
- Configure Stripe webhook endpoint in Stripe dashboard — open
- Verify free dossier form submission works end-to-end — open
- Verify $300 full dossier upgrade checkout works end-to-end — open

## Agent Tasks
- Listen for Hermes webhook POSTs from Vercel (HMAC-verified) — open
- Process free dossier requests: analyze property → generate 15-min dossier → POST to /api/dossier-delivered — open
- Process full dossier requests: after $300 payment → generate exhaustive dossier → POST to /api/full-dossier-delivered — open
- Poll /api/admin-dossiers as fallback when webhook is unreachable — open

## Blockers
- Hermes Agent webhook URL must be publicly reachable (ngrok/cloudflared tunnel)
