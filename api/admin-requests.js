const { ensureSchema, query } = require('./_lib/db')

function isAuthorized(req) {
  const expected = process.env.ADMIN_TOKEN
  if (!expected) {
    throw new Error('ADMIN_TOKEN is required')
  }

  const header = req.headers.authorization || ''
  return header === `Bearer ${expected}`
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    if (!isAuthorized(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    await ensureSchema()

    const status = typeof req.query.status === 'string' ? req.query.status : ''
    const limit = Math.min(Number(req.query.limit || 50), 100)
    const params = []
    let where = ''

    if (status) {
      params.push(status)
      where = 'WHERE status = $1'
    }

    params.push(limit)
    const limitParam = `$${params.length}`
    const result = await query(
      `
        SELECT
          id,
          customer_name,
          customer_email,
          customer_phone,
          property_address,
          property_url,
          investment_intent,
          urgency,
          notes,
          status,
          stripe_checkout_session_id,
          stripe_payment_intent_id,
          email_sent_at,
          created_at,
          updated_at,
          paid_at
        FROM manual_underwriting_requests
        ${where}
        ORDER BY created_at DESC
        LIMIT ${limitParam}
      `,
      params,
    )

    return res.status(200).json({ requests: result.rows })
  } catch (error) {
    console.error('admin-requests failed', error)
    return res.status(500).json({ error: error.message || 'Unable to fetch requests' })
  }
}
