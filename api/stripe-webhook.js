const Stripe = require('stripe')
const { ensureSchema, query } = require('./_lib/db')
const { sendRequestEmail } = require('./_lib/email')

async function readRawBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

async function getRequestById(requestId) {
  const result = await query('SELECT * FROM manual_underwriting_requests WHERE id = $1', [requestId])
  return result.rows[0]
}

async function markPaid(session) {
  const requestId = session.metadata && session.metadata.requestId
  if (!requestId) {
    throw new Error('Missing requestId metadata on Checkout Session')
  }

  await query(
    `
      UPDATE manual_underwriting_requests
      SET
        status = 'paid',
        stripe_checkout_session_id = COALESCE(stripe_checkout_session_id, $1),
        stripe_payment_intent_id = $2,
        paid_at = COALESCE(paid_at, NOW()),
        updated_at = NOW()
      WHERE id = $3
    `,
    [session.id, typeof session.payment_intent === 'string' ? session.payment_intent : '', requestId],
  )

  return getRequestById(requestId)
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

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is required')
    }

    await ensureSchema()

    const rawBody = await readRawBody(req)
    const signature = req.headers['stripe-signature']
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
    })
    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const request = await markPaid(session)

      if (request && !request.email_sent_at) {
        await sendRequestEmail(request)
        await query('UPDATE manual_underwriting_requests SET email_sent_at = NOW(), updated_at = NOW() WHERE id = $1', [request.id])
      }
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('stripe-webhook failed', error)
    return res.status(400).json({ error: error.message || 'Webhook error' })
  }
}
