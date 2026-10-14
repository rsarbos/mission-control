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
    await ensureSchema()

    const body = getBody(req)
    const propertyAddress = requireString(body.property_address, 'Property address')
    const agentName = requireString(body.agent_name, 'Agent name')
    const agentEmail = requireString(body.agent_email, 'Agent email')

    const requestId = crypto.randomUUID()
    const now = new Date().toISOString()

    const payload = {
      request_id: requestId,
      agent_name: agentName,
      agent_email: agentEmail,
      agent_phone: typeof body.agent_phone === 'string' ? body.agent_phone.trim() : '',
      property_address: propertyAddress,
      property_url: typeof body.property_url === 'string' ? body.property_url.trim() : '',
      brokerage: typeof body.brokerage === 'string' ? body.brokerage.trim() : '',
      mls_id: typeof body.mls_id === 'string' ? body.mls_id.trim() : '',
      source_channel: typeof body.source_channel === 'string' ? body.source_channel.trim() : 'Website',
      investment_intent: typeof body.investment_intent === 'string' ? body.investment_intent.trim() : '',
      received_at: now,
    }

    // Store the request
    await query(
      `
        INSERT INTO dossier_requests (
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
          hermes_payload,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'requested', 'free', $11, NOW(), NOW())
      `,
      [
        requestId,
        payload.agent_name,
        payload.agent_email,
        payload.agent_phone,
        payload.property_address,
        payload.property_url,
        payload.brokerage,
        payload.mls_id,
        payload.source_channel,
        payload.investment_intent,
        payload,
      ],
    )

    // Trigger Hermes webhook (non-blocking — if it fails, request stays in DB for polling)
    const hermesResult = await triggerWebhook(payload).catch((err) => {
      console.error(`Hermes webhook for request ${requestId} failed:`, err.message)
      return { sent: false, error: err.message }
    })

    if (hermesResult && hermesResult.sent) {
      await query(
        `UPDATE dossier_requests SET hermes_task_id = $1, status = 'hermes_queued', updated_at = NOW() WHERE id = $2`,
        [hermesResult.task_id || requestId, requestId],
      )
    }

    // Send admin notification
    const { sendAdminNotification } = require('./_lib/email')
    if (sendAdminNotification) {
      sendAdminNotification({
        type: 'free_dossier_request',
        ...payload,
      }).catch((err) => console.error('Admin notification failed:', err.message))
    }

    return res.status(200).json({
      success: true,
      requestId,
      status: 'received',
      message: 'Your complimentary 15-minute dossier request has been received. It is being processed and will be sent to your email shortly.',
    })
  } catch (error) {
    console.error('dossier-request failed', error)
    return res.status(400).json({
      error: error.message || 'Unable to process dossier request',
    })
  }
}
