const { Resend } = require('resend')

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function requestEmailHtml(request) {
  const rows = [
    ['Request ID', request.id],
    ['Customer name', request.customer_name],
    ['Customer email', request.customer_email],
    ['Customer phone', request.customer_phone || 'Not provided'],
    ['Property address', request.property_address],
    ['Property URL', request.property_url],
    ['Investment intent', request.investment_intent || 'Not provided'],
    ['Urgency', request.urgency || 'Not provided'],
    ['Stripe Checkout Session', request.stripe_checkout_session_id || 'Not available'],
    ['Stripe Payment Intent', request.stripe_payment_intent_id || 'Not available'],
    ['Paid at', request.paid_at || 'Not available'],
  ]

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5">
      <h1 style="margin:0 0 16px;color:#0A0F1C">Manual Underwriting Report Request</h1>
      <p style="margin:0 0 18px">Payment has been confirmed. Begin manual underwriting review.</p>
      <table style="border-collapse:collapse;width:100%;max-width:760px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="border:1px solid #E5E7EB;background:#F9FAFB;padding:10px;font-weight:700;width:210px">${escapeHtml(label)}</td>
                <td style="border:1px solid #E5E7EB;padding:10px">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join('')}
      </table>
      <h2 style="margin:22px 0 8px;color:#0A0F1C;font-size:18px">Notes / Specific Questions</h2>
      <div style="white-space:pre-wrap;border:1px solid #E5E7EB;background:#F9FAFB;padding:12px;max-width:760px">${escapeHtml(request.notes || 'None provided')}</div>
    </div>
  `
}

async function sendRequestEmail(request) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required')
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const to = process.env.EMAIL_TO || 'uw.requests@rsarbos.com'
  const from = process.env.EMAIL_FROM || 'RSARBOS Intake <onboarding@resend.dev>'
  const subject = `Paid Manual Underwriting Request: ${request.property_address}`

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html: requestEmailHtml(request),
    replyTo: request.customer_email,
  })

  if (error) {
    throw new Error(`Resend email failed: ${error.message}`)
  }

  return data
}

module.exports = {
  sendRequestEmail,
}
