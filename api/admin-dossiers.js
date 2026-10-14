const { ensureSchema, query } = require('./_lib/db')

function isAuthorized(req) {
  const expected = process.env.ADMIN_TOKEN
  if (!expected) {
    throw new Error('ADMIN_TOKEN is required')
  }

  const header = req.headers.authorization || ''
  return header === `Bearer ${expected}`
}

/**
 * Admin API: List all dossier requests.
 *
 * Query params:
 *   status — filter by status (optional)
 *   limit  — max results, clamped to 100 (default 50)
 *
 * Returns an array of dossier request records sorted by created_at DESC.
 *
 * This powers the owner dashboard and can also be polled by the Hermes agent
 * to pick up new requests if HERMES_WEBHOOK_URL is not configured.
 */
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

    const status = typeof req.query.status === 'string' && req.query.status ? req.query.status : ''
    const limit = Math.min(Number(req.query.limit || 50), 100)
    const dossierType = typeof req.query.dossier_type === 'string' && req.query.dossier_type ? req.query.dossier_type : ''

    const params = []
    const conditions = []

    if (status) {
      params.push(status)
      conditions.push(`status = $${params.length}`)
    }
    if (dossierType) {
      params.push(dossierType)
      conditions.push(`dossier_type = $${params.length}`)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    params.push(limit)
    const limitParam = `$${params.length}`

    const result = await query(
      `
        SELECT
          id,
          agent_name,
          agent_email,
          agent_phone,
          property_address,
          property_url,
          brokerage,
          mls_id,
          source_channel,
          investment_intent,
          status,
          dossier_type,
          hermes_task_id,
          dossier_file_ref,
          dossier_delivered_at,
          stripe_checkout_session_id,
          stripe_payment_intent_id,
          paid_at,
          full_dossier_file_ref,
          full_dossier_delivered_at,
          upgraded_at,
          email_sent_at,
          admin_notes,
          created_at,
          updated_at
        FROM dossier_requests
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ${limitParam}
      `,
      params,
    )

    return res.status(200).json({ requests: result.rows })
  } catch (error) {
    console.error('admin-dossiers failed', error)
    return res.status(500).json({ error: error.message || 'Unable to fetch dossier requests' })
  }
}
