const { ensureSchema, query } = require('./_lib/db')
const { sendDossierEmail, sendAdminNotification } = require('./_lib/email')

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

/**
 * Called by the Hermes Agent when the free 15-minute dossier has been generated.
 *
 * Body:
 *   request_id      — the dossier_requests.id
 *   dossier_url     — public URL to the generated free dossier file (PDF or HTML)
 *   dossier_file_ref — internal file reference (optional)
 *
 * Flow:
 *   1. Look up the dossier request
 *   2. Update status to 'dossier_generated'
 *   3. Send the complimentary dossier email to the agent (includes $300 upgrade CTA)
 *   4. Send admin notification
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await ensureSchema()
    const body = getBody(req)
    const requestId = requireString(body.request_id || body.requestId, 'request_id')
    const dossierUrl = requireString(body.dossier_url || body.dossierUrl, 'dossier_url')

    const result = await query('SELECT * FROM dossier_requests WHERE id = $1', [requestId])
    const request = result.rows[0]

    if (!request) {
      return res.status(404).json({ error: 'Dossier request not found' })
    }

    if (request.status === 'dossier_generated' || request.status === 'delivered') {
      return res.status(409).json({ error: 'Free dossier already delivered for this request' })
    }

    await query(
      `
        UPDATE dossier_requests
        SET status = 'dossier_generated',
            dossier_file_ref = $1,
            dossier_delivered_at = NOW(),
            updated_at = NOW()
        WHERE id = $2
      `,
      [dossierUrl, requestId],
    )

    const updatedRequest = { ...request, dossier_file_ref: dossierUrl, status: 'dossier_generated' }

    // Send the complimentary dossier email to the agent
    await sendDossierEmail(updatedRequest)

    // Update email_sent_at
    await query(
      `UPDATE dossier_requests SET email_sent_at = NOW(), status = 'delivered', updated_at = NOW() WHERE id = $1`,
      [requestId],
    )

    // Notify admin
    sendAdminNotification({
      type: 'free_dossier_delivered',
      request_id: requestId,
      agent_name: request.agent_name,
      agent_email: request.agent_email,
      property_address: request.property_address,
    }).catch((err) => console.error('Admin notification (free dossier delivered) failed:', err.message))

    return res.status(200).json({
      success: true,
      requestId,
      status: 'delivered',
      dossier_url: dossierUrl,
    })
  } catch (error) {
    console.error('dossier-delivered failed', error)
    return res.status(500).json({ error: error.message || 'Unable to record dossier delivery' })
  }
}
