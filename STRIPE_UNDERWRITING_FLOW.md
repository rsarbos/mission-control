# Manual Underwriting Report Stripe Flow

This repo implements the one-time `Manual Underwriting Report` purchase flow:

```txt
Form Submit
-> Save request in Postgres as pending_payment
-> Create Stripe Checkout Session with requestId metadata
-> Redirect to Stripe Checkout
-> Stripe webhook confirms payment
-> Update request status to paid
-> Email uw.requests@rsarbos.com via Resend
```

The frontend success page never marks a request as paid. The Stripe webhook is the source of truth.

## API Routes

```txt
/api/create-checkout-session.js
/api/stripe-webhook.js
```

## Database

Use Neon Postgres and set `DATABASE_URL` in Vercel. The API functions create this table automatically if it does not exist:

```sql
CREATE TABLE IF NOT EXISTS manual_underwriting_requests (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  property_address TEXT NOT NULL,
  property_url TEXT NOT NULL,
  investment_intent TEXT,
  urgency TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);
```

Recommended statuses:

```txt
pending_payment
paid
payment_failed
cancelled
fulfilled
```

## Vercel Environment Variables

Set these in the Vercel project:

```txt
STRIPE_SECRET_KEY=sk_live_or_test...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
EMAIL_TO=uw.requests@rsarbos.com
EMAIL_FROM=RSARBOS Intake <verified@yourdomain.com>
DATABASE_URL=postgresql://...
VITE_SITE_URL=https://www.rsarbos.com
```

Use Stripe test keys until the flow is verified end to end.

## Stripe Webhook

Production webhook URL:

```txt
https://www.rsarbos.com/api/stripe-webhook
```

Subscribe to:

```txt
checkout.session.completed
```

Copy the webhook signing secret from Stripe into `STRIPE_WEBHOOK_SECRET` in Vercel.

## Resend Notes

The webhook sends the internal request email only after `checkout.session.completed`.

For production, verify a sending domain in Resend and set:

```txt
EMAIL_FROM=RSARBOS Intake <intake@rsarbos.com>
```

The default `onboarding@resend.dev` is acceptable only for early testing and may have recipient restrictions.

## Local Webhook Testing

Install and log in to the Stripe CLI, then forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

If you test Vercel functions locally, run the Vercel dev server from the repo root:

```bash
vercel dev
```

Use the webhook secret printed by Stripe CLI as local `STRIPE_WEBHOOK_SECRET`.

## Important Behavior

If checkout is abandoned or canceled, the request remains stored as `pending_payment` so RSARBOS can recover the checkout or follow up manually.

Only `checkout.session.completed` updates status to `paid` and sends the internal email.
