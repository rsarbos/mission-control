const crypto = require('crypto')
const Stripe = require('stripe')
const { ensureSchema, query } = require('./_lib/db')

const REPORT_PRICE_CENTS = 10000
const REPORT_NAME = 'Manual Underwriting Report'

function getBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    return JSON.parse(req.body)
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
    const requestId = crypto.randomUUID()
    const customerName = requireString(body.customerName, 'Customer name')
    const customerEmail = requireString(body.customerEmail, 'Customer email')
    const propertyUrl = requireString(body.propertyUrl, 'Property URL')
    const propertyAddress = typeof body.propertyAddress === 'string' && body.propertyAddress.trim()
      ? body.propertyAddress.trim()
      : propertyUrl
    const siteUrl = process.env.SITE_URL || 'http://localhost:5173'

    await query(
      `
        INSERT INTO manual_underwriting_requests (
          id,
          customer_name,
          customer_email,
          customer_phone,
          property_address,
          property_url,
          investment_intent,
          urgency,
          notes,
          status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending_payment')
      `,
      [
        requestId,
        customerName,
        customerEmail,
        typeof body.customerPhone === 'string' ? body.customerPhone.trim() : '',
        propertyAddress,
        propertyUrl,
        typeof body.investmentIntent === 'string' ? body.investmentIntent.trim() : '',
        typeof body.urgency === 'string' ? body.urgency.trim() : '',
        typeof body.notes === 'string' ? body.notes.trim() : '',
      ],
    )

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
    })
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: REPORT_PRICE_CENTS,
            product_data: {
              name: REPORT_NAME,
              description: 'Manual property underwriting dossier delivered privately by RSARBOS.',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        requestId,
      },
      payment_intent_data: {
        metadata: {
          requestId,
        },
      },
      success_url: `${siteUrl}/payment-success?requestId=${encodeURIComponent(requestId)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/payment-cancel?requestId=${encodeURIComponent(requestId)}`,
    })

    await query(
      `
        UPDATE manual_underwriting_requests
        SET stripe_checkout_session_id = $1, updated_at = NOW()
        WHERE id = $2
      `,
      [session.id, requestId],
    )

    return res.status(200).json({
      checkoutUrl: session.url,
      requestId,
    })
  } catch (error) {
    console.error('create-checkout-session failed', error)
    return res.status(500).json({ error: error.message || 'Unable to create checkout session' })
  }
}
