const crypto = require('crypto')
const Stripe = require('stripe')
const { ensureSchema, query } = require('./_lib/db')

const FULL_DOSSER_PRICE_CENTS = 30000
const FULL_DOSSIER_NAME = 'Full Investor Dossier'

function getBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return req.body
}

function requireString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} is required`)
  }
  return value.trim()
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is required')
    }

    await ensureSchema()

    const body = getBody(req)
    const requestId = requireString(body.request_id || body.requestId, 'request_id')

    // Look up the dossier request
    const result = await query('SELECT * FROM dossier_requests WHERE id = $1', [requestId])
    const request = result.rows[0]

    if (!request) {
      return res.status(404).json({ error: 'Dossier request not found' })
    }

    if (request.dossier_type !== 'full' && request.stripe_payment_intent_id) {
      return res.status(409).json({ error: 'Full dossier checkout already created for this request' })
    }

    const siteUrl = process.env.SITE_URL || 'http://localhost:5173'

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
    })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: request.agent_email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: FULL_DOSSER_PRICE_CENTS,
            product_data: {
              name: FULL_DOSSIER_NAME,
              description:
                'Full RSARBOS investor dossier: comprehensive financial model, Highest & Best Use strategy, 15-slide presentation deck, 24-hour turnaround, secure private delivery.',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        requestId: request.id,
        dossierType: 'full',
      },
      payment_intent_data: {
        metadata: {
          requestId: request.id,
          dossierType: 'full',
        },
      },
      success_url: `${siteUrl}/payment-success?requestId=${encodeURIComponent(request.id)}&dossierType=full&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/payment-cancel?requestId=${encodeURIComponent(request.id)}`,
    })

    // Update the dossier request with checkout info
    await query(
      `
        UPDATE dossier_requests
        SET stripe_checkout_session_id = $1,
            stripe_payment_intent_id = $2,
            status = 'checkout_created',
            upgraded_at = NOW(),
            updated_at = NOW()
        WHERE id = $3
      `,
      [session.id, '', request.id],
    )

    return res.status(200).json({
      checkoutUrl: session.url,
      requestId: request.id,
    })
  } catch (error) {
    console.error('create-full-dossier-checkout failed', error)
    return res.status(500).json({
      error: error.message || 'Unable to create checkout session',
    })
  }
}
