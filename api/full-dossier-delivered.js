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
 * Called by the Hermes Agent when the full $300 investor dossier has been generated.
 *
 * Body:
 *   request_id        — the dossier_requests.id
 *   dossier_url       — public URL to the generated full dossier file (PDF or HTML)
 *   presentation_deck_url — URL to the presentation deck (optional)
 *
 * Flow:
 *   1. Look up the dossier request
 *   2. If dossier_type !== 'full', mark it as 'full'
 *   3. Update status to 'full_dossier_delivered'
 *   4. Send the full dossier email to the agent
 *   5. Send admin notification
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

    if (request.status === 'full_dossier_delivered') {
      return res.status(409).json({ error: 'Full dossier already delivered for this request' })
    }

    await query(
      `
        UPDATE dossier_requests
        SET dossier_type = 'full',
            status = 'full_dossier_delivered',
            full_dossier_file_ref = $1,
            full_dossier_delivered_at = NOW(),
            updated_at = NOW()
        WHERE id = $2
      `,
      [dossierUrl, requestId],
    )

    const updatedRequest = {
      ...request,
      dossier_type: 'full',
      status: 'full_dossier_delivered',
      full_dossier_file_ref: dossierUrl,
      dossier_file_ref: request.dossier_file_ref || dossierUrl,
      property_address: request.property_address,
      agent_name: request.agent_name,
      agent_email: request.agent_email,
    }

    // Send the full dossier email
    await sendDossierEmail(updatedRequest, { isFullDossier: true })

    // Notify admin
    sendAdminNotification({
      type: 'full_dossier_delivered',
      request_id: requestId,
      agent_name: request.agent_name,
      agent_email: request.agent_email,
      property_address: request.property_address,
    }).catch((err) => console.error('Admin notification (full dossier delivered) failed:', err.message))

    return res.status(200).json({
      success: true,
      requestId,
      status: 'full_dossier_delivered',
      dossier_url: dossierUrl,
    })
  } catch (error) {
    console.error('full-dossier-delivered failed', error)
    return res.status(500).json({ error: error.message || 'Unable to record full dossier delivery' })
  }
}
