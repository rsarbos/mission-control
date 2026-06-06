const { sendContactEmail } = require('./_lib/email')

function getBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    return JSON.parse(req.body)
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
    const body = getBody(req)
    const type = requireString(body.type, 'Message type')
    const message = {
      type: type === 'support' ? 'support' : 'contact',
      name: requireString(body.name, 'Name'),
      email: requireString(body.email, 'Email'),
      phone: typeof body.phone === 'string' ? body.phone.trim() : '',
      subject: requireString(body.subject, 'Subject'),
      message: requireString(body.message, 'Message'),
    }

    await sendContactEmail(message)
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('contact failed', error)
    return res.status(500).json({ error: error.message || 'Unable to send message' })
  }
}
