const crypto = require('crypto')
const { ensureSchema, query } = require('./_lib/db')
const { triggerWebhook } = require('./_lib/hermes')

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

/**
 * Standalone endpoint: manually trigger the Hermes webhook for a given request ID.
 * Can be called by the owner dashboard or a cron job to retry a failed webhook.
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await ensureSchema()
    const body = getBody(req)
    const requestId = body.request_id || body.requestId

    if (!requestId) {
      return res.status(400).json({ error: 'request_id is required' })
    }

    // Fetch the dossier request
    const result = await query('SELECT * FROM dossier_requests WHERE id = $1', [requestId])
    const request = result.rows[0]

    if (!request) {
      return res.status(404).json({ error: 'Dossier request not found' })
    }

    // Re-trigger the Hermes webhook
    const payload = {
      request_id: request.id,
      agent_name: request.agent_name,
      agent_email: request.agent_email,
      agent_phone: request.agent_phone,
      property_address: request.property_address,
      property_url: request.property_url,
      brokerage: request.brokerage,
      mls_id: request.mls_id,
      source_channel: request.source_channel,
      investment_intent: request.investment_intent,
      retry: true,
      received_at: new Date().toISOString(),
    }

    const hermesResult = await triggerWebhook(payload)

    if (hermesResult.sent) {
      await query(
        `UPDATE dossier_requests SET hermes_task_id = $1, status = 'hermes_queued', updated_at = NOW() WHERE id = $2`,
        [hermesResult.task_id || requestId, requestId],
      )
    }

    return res.status(200).json({
      success: hermesResult.sent,
      requestId,
      hermesResult,
      ...(hermesResult.error ? { error: hermesResult.error } : {}),
    })
  } catch (error) {
    console.error('notify-hermes failed', error)
    return res.status(500).json({ error: error.message || 'Unable to notify Hermes' })
  }
}
