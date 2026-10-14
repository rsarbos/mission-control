const crypto = require('crypto')

const HERMES_SIGNATURE_HEADER = 'x-rsarbos-signature'

/**
 * Triggers a webhook to the Hermes Agent with a dossier request payload.
 *
 * If HERMES_WEBHOOK_URL is set, POSTs the payload to that endpoint with a
 * timestamped HMAC signature so the Hermes side can verify authenticity.
 *
 * If HERMES_WEBHOOK_URL is not set, returns { sent: false } — the caller
 * should keep the request in 'requested' status so a polling cron job
 * can pick it up.
 */
async function triggerWebhook(payload) {
  const webhookUrl = process.env.HERMES_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('HERMES_WEBHOOK_URL is not set — Hermes webhook skipped')
    return { sent: false, error: 'HERMES_WEBHOOK_URL not configured' }
  }

  const webhookSecret = process.env.HERMES_WEBHOOK_SECRET || ''

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const bodyToSign = JSON.stringify(payload)
  const signature = crypto
    .createHmac('sha256', webhookSecret || payload.request_id)
    .update(`${timestamp}.${bodyToSign}`)
    .digest('hex')

const fetch = globalThis.fetch

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [HERMES_SIGNATURE_HEADER]: signature,
        'x-rsarbos-timestamp': timestamp,
      },
      body: JSON.stringify({ ...payload, timestamp }),
      timeout: 10000,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'unknown error')
      throw new Error(`Hermes webhook returned ${response.status}: ${errorText}`)
    }

    const result = await response.json().catch(() => ({}))
    return {
      sent: true,
      task_id: result.task_id || result.request_id || payload.request_id,
      response: result,
    }
  } catch (error) {
    console.error('Hermes webhook POST failed:', error.message)
    return { sent: false, error: error.message }
  }
}

module.exports = {
  triggerWebhook,
  HERMES_SIGNATURE_HEADER,
}
