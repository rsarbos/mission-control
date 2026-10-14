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

function contactEmailHtml(message) {
  const rows = [
    ['Type', message.type],
    ['Name', message.name],
    ['Email', message.email],
    ['Phone', message.phone || 'Not provided'],
    ['Subject', message.subject],
  ]

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5">
      <h1 style="margin:0 0 16px;color:#0A0F1C">RSARBOS Contact / Support Message</h1>
      <table style="border-collapse:collapse;width:100%;max-width:760px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="border:1px solid #E5E7EB;background:#F9FAFB;padding:10px;font-weight:700;width:160px">${escapeHtml(label)}</td>
                <td style="border:1px solid #E5E7EB;padding:10px">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join('')}
      </table>
      <h2 style="margin:22px 0 8px;color:#0A0F1C;font-size:18px">Message</h2>
      <div style="white-space:pre-wrap;border:1px solid #E5E7EB;background:#F9FAFB;padding:12px;max-width:760px">${escapeHtml(message.message || 'None provided')}</div>
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

async function sendContactEmail(message) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required')
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const to = process.env.SUPPORT_EMAIL || 'uw.support@rsarbos.com'
  const from = process.env.EMAIL_FROM || 'RSARBOS Contact <onboarding@resend.dev>'
  const subjectPrefix = message.type === 'support' ? 'Support' : 'Contact'
  const subject = `RSARBOS ${subjectPrefix}: ${message.subject}`

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html: contactEmailHtml(message),
    replyTo: message.email,
  })

  if (error) {
    throw new Error(`Resend email failed: ${error.message}`)
  }

  return data
}

async function sendDossierEmail(dossierRequest, options = {}) {
  const { Resend } = require('resend')
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required')
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const to = dossierRequest.agent_email
  const from = process.env.EMAIL_FROM || 'RSARBOS Intake <onboarding@resend.dev>'

  const { subject, html } = options.isFullDossier
    ? fullDossierEmailHtml(dossierRequest)
    : freeDossierEmailHtml(dossierRequest)

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    replyTo: 'uw.support@rsarbos.com',
  })

  if (error) {
    throw new Error(`Resend email failed: ${error.message}`)
  }
  return data
}

function freeDossierEmailHtml(d) {
  return `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.6">
      <h1 style="margin:0 0 16px;color:#0A0F1C">Your Complimentary 15-Minute RSARBOS Dossier</h1>
      <p style="margin:0 0 18px">Hi ${escapeHtml(d.agent_name)},</p>
      <p>Your underwriting dossier for <strong>${escapeHtml(d.property_address)}</strong> is ready.</p>
      ${d.dossier_file_ref ? `<p style="margin:0 0 18px"><a href="${escapeHtml(d.dossier_file_ref)}" style="color:#1E5BFF;font-weight:800">View your complimentary dossier →</a></p>` : ''}
      <div style="border:1px solid #E5E7EB;border-radius:8px;background:#F9FAFB;padding:18px;margin:22px 0">
        <p style="margin:0 0 8px;font-weight:800">What's included:</p>
        <ul style="margin:0;padding-left:20px">
          <li>Property identity and key specs</li>
          <li>Rent vs. market comparison (headline rent, actual comp rent)</li>
          <li>Acquisition basis vs. assessed value gap</li>
          <li>Quick risk flags (HOA, zoning, title)</li>
          <li>Verdict: Worth Pursuing / Walkaway / Review Required</li>
        </ul>
      </div>
      <div style="border:1px solid #3B82F6;border-radius:8px;background:rgba(30,91,255,0.04);padding:18px;margin:22px 0">
        <h2 style="margin:0 0 8px;color:#1E5BFF;font-size:18px">Upgrade to Full Investor Dossier — $300</h2>
        <p style="margin:0 0 12px">Unlock the complete package: exhaustive financial model, Highest &amp; Best Use strategy, full presentation deck, 24-hour turnaround, and secure private delivery.</p>
        <a href="${escapeHtml(d.upgrade_url || process.env.SITE_URL || 'https://www.rsarbos.com')}/dossier-checkout?requestId=${escapeHtml(d.id)}" style="color:#FFFFFF;background:#1E5BFF;border:0;padding:12px 24px;border-radius:8px;font-weight:800;text-decoration:none;display:inline-block">Upgrade to Full Dossier ($300)</a>
      </div>
      <p style="color:#6B7280;font-size:12px;margin-top:32px">RSARBOS — Turning Complex Data Into Conclusions, 100% Auditable.</p>
    </div>
  `
}

function fullDossierEmailHtml(d) {
  return `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.6">
      <h1 style="margin:0 0 16px;color:#0A0F1C">Your Full RSARBOS Investor Dossier</h1>
      <p style="margin:0 0 18px">Hi ${escapeHtml(d.agent_name)},</p>
      <p>Your complete underwriting dossier for <strong>${escapeHtml(d.property_address)}</strong> is ready.</p>
      ${d.full_dossier_file_ref ? `<p style="margin:0 0 18px"><a href="${escapeHtml(d.full_dossier_file_ref)}" style="color:#1E5BFF;font-weight:800">Download your full dossier →</a></p>` : ''}
      <div style="border:1px solid #E5E7EB;border-radius:8px;background:#F9FAFB;padding:18px;margin:22px 0">
        <p style="margin:0 0 8px;font-weight:800">Full Dossier Contents:</p>
        <ul style="margin:0;padding-left:20px">
          <li>15-minute complimentary dossier (already delivered)</li>
          <li>Exhaustive rent-roll + ARV financial model</li>
          <li>Highest &amp; Best Use strategy breakdown</li>
          <li>Full 15-slide presentation deck</li>
          <li>Cap rate, cash-on-cash, and BRRRR refi scenarios</li>
          <li>24-hour turnaround guarantee</li>
        </ul>
      </div>
      <p style="color:#6B7280;font-size:12px;margin-top:32px">RSARBOS — Turning Complex Data Into Conclusions, 100% Auditable.</p>
    </div>
  `
}

async function sendAdminNotification(event) {
  const { Resend } = require('resend')
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required')
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const to = process.env.EMAIL_TO || 'uw.requests@rsarbos.com'
  const from = process.env.EMAIL_FROM || 'RSARBOS Intake <onboarding@resend.dev>'

  let subject, html

  if (event.type === 'free_dossier_request') {
    subject = `New Free Dossier Request: ${event.property_address}`
    html = `
      <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5">
        <h1 style="margin:0 0 16px;color:#0A0F1C">New Complimentary Dossier Request</h1>
        <table style="border-collapse:collapse;width:100%;max-width:760px">
          <tr><td style="border:1px solid #E5E7EB;background:#F9FAFB;padding:10px;font-weight:700;width:180px">Request ID</td><td style="border:1px solid #E5E7EB;padding:10px">${escapeHtml(event.request_id)}</td></tr>
          <tr><td style="border:1px solid #E5E7EB;background:#F9FAFB;padding:10px;font-weight:700">Agent Name</td><td style="border:1px solid #E5E7EB;padding:10px">${escapeHtml(event.agent_name)}</td></tr>
          <tr><td style="border:1px solid #E5E7EB;background:#F9FAFB;padding:10px;font-weight:700">Email</td><td style="border:1px solid #E5E7EB;padding:10px">${escapeHtml(event.agent_email)}</td></tr>
          <tr><td style="border:1px solid #E5E7EB;background:#F9FAFB;padding:10px;font-weight:700">Phone</td><td style="border:1px solid #E5E7EB;padding:10px">${escapeHtml(event.agent_phone || 'Not provided')}</td></tr>
          <tr><td style="border:1px solid #E5E7EB;background:#F9FAFB;padding:10px;font-weight:700">Property Address</td><td style="border:1px solid #E5E7EB;padding:10px">${escapeHtml(event.property_address)}</td></tr>
          <tr><td style="border:1px solid #E5E7EB;background:#F9FAFB;padding:10px;font-weight:700">Property URL</td><td style="border:1px solid #E5E7EB;padding:10px">${escapeHtml(event.property_url || 'Not provided')}</td></tr>
          <tr><td style="border:1px solid #E5E7EB;background:#F9FAFB;padding:10px;font-weight:700">Brokerage</td><td style="border:1px solid #E5E7EB;padding:10px">${escapeHtml(event.brokerage || 'Not provided')}</td></tr>
          <tr><td style="border:1px solid #E5E7EB;background:#F9FAFB;padding:10px;font-weight:700">MLS ID</td><td style="border:1px solid #E5E7EB;padding:10px">${escapeHtml(event.mls_id || 'Not provided')}</td></tr>
          <tr><td style="border:1px solid #E5E7EB;background:#F9FAFB;padding:10px;font-weight:700">Source</td><td style="border:1px solid #E5E7EB;padding:10px">${escapeHtml(event.source_channel || 'Website')}</td></tr>
        </table>
        <p style="margin-top:18px">Hermes webhook ${event.hermes_sent ? 'was triggered' : 'was NOT triggered (check HERMES_WEBHOOK_URL)'} for automated underwriting.</p>
      </div>
    `
  } else if (event.type === 'free_dossier_delivered') {
    subject = `Free Dossier Delivered: ${event.property_address}`
    html = `<p>The complimentary 15-minute dossier for <strong>${escapeHtml(event.property_address)}</strong> has been generated and delivered to ${escapeHtml(event.agent_email)}.</p>`
  } else if (event.type === 'full_dossier_paid') {
    subject = `Full Dossier Payment: ${event.property_address}`
    html = `<p>The full investor dossier for <strong>${escapeHtml(event.property_address)}</strong> has been paid. Hermes agent should begin full underwriting.</p>`
  } else if (event.type === 'full_dossier_delivered') {
    subject = `Full Dossier Delivered: ${event.property_address}`
    html = `<p>The full investor dossier for <strong>${escapeHtml(event.property_address)}</strong> has been delivered to ${escapeHtml(event.agent_email)}.</p>`
  }

  if (!subject || !html) return null

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    replyTo: event.agent_email,
  })

  if (error) {
    throw new Error(`Resend admin notification failed: ${error.message}`)
  }
  return data
}

module.exports = {
  sendContactEmail,
  sendRequestEmail,
  sendDossierEmail,
  sendAdminNotification,
  freeDossierEmailHtml,
  fullDossierEmailHtml,
}
