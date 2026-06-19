const LITERT_URL = process.env.LITERT_GENERATE_CONTENT_URL || 'http://127.0.0.1:9379/v1beta/models/gemma3-1b-gpu-custom:streamGenerateContent'
const LITERT_MODEL = 'gemma3-1b-gpu-custom'

const RSARBOS_SYSTEM_CONTEXT = `
RSARBOS sells human-reviewed real estate underwriting dossiers.
Mission Control is revenue-first: find prospects, start conversations, convert payment, fulfill paid dossiers, deliver reports.
Do not invent revenue, evidence, payment, or financial truth.
Find targets aligned with institutional acquisition mechanics: agents, wholesalers, lenders, acquisition teams, operators needing rent thesis checks, ARV review, risk registers, source custody, and faster capital-confidence.
Return exactly 5 concise numbered prospects.
`.trim()

function getBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') return JSON.parse(req.body)
  return req.body
}

function cleanString(value, fallback = '') {
  return typeof value === 'string' ? value.trim().slice(0, 4000) : fallback
}

function cleanContext(value) {
  if (!value || typeof value !== 'object') return {}
  return {
    totalProspects: Number(value.totalProspects || 0),
    replies: Number(value.replies || 0),
    paymentPending: Number(value.paymentPending || 0),
    paidOrders: Number(value.paidOrders || 0),
    dossiersInFulfillment: Number(value.dossiersInFulfillment || 0),
    deliveredDossiers: Number(value.deliveredDossiers || 0),
    primaryOrder: cleanString(value.primaryOrder, 'Revenue Generation').slice(0, 120),
    bottleneck: cleanString(value.bottleneck, 'No active conversations').slice(0, 240),
  }
}

function buildMessages(body) {
  const stage = cleanString(body.stage, 'Revenue Generation').slice(0, 80)
  const notes = cleanString(body.notes, '')
  const placeholder = cleanString(body.placeholder, '')
  const context = cleanContext(body.context)

  return [
    {
      role: 'system',
      content: `${RSARBOS_SYSTEM_CONTEXT}

Current pipeline stage: ${stage}
Stage placeholder: ${placeholder || 'No placeholder provided'}
Current Mission Control context: ${JSON.stringify(context)}

Act as an elite acquisition analyst. Output exactly 5 numbered lines. Each line format: Target - why now - first manual action.`,
    },
    {
      role: 'user',
      content: notes || 'No operator notes were supplied. Generate targets using only the current pipeline stage and Mission Control context.',
    },
  ]
}

function buildGeminiPayload(body) {
  const messages = buildMessages(body)
  const systemMessage = messages.find((message) => message.role === 'system')
  const userMessage = messages.find((message) => message.role === 'user')
  const prompt = `${systemMessage?.content || RSARBOS_SYSTEM_CONTEXT}

Operator notes:
${userMessage?.content || 'Generate 5 RSARBOS-aligned prospect targets.'}`.trim()

  return {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: typeof body.temperature === 'number' ? body.temperature : 0.3,
      maxOutputTokens: 260,
    },
  }
}

function parseGeminiStream(text) {
  const parts = []
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('data:')) continue
    const payload = trimmed.slice(5).trim()
    if (!payload || payload === '[DONE]') continue
    try {
      const data = JSON.parse(payload)
      const chunk = data?.candidates?.[0]?.content?.parts
        ?.map((part) => (typeof part.text === 'string' ? part.text : ''))
        .join('')
      if (chunk) parts.push(chunk)
    } catch {
      // Ignore malformed SSE chunks and keep any valid model text.
    }
  }
  return parts.join('').trim()
}

function normalizeGeminiResponse(data) {
  const content = typeof data === 'string'
    ? parseGeminiStream(data)
    : data?.candidates?.[0]?.content?.parts
      ?.map((part) => (typeof part.text === 'string' ? part.text : ''))
      .join('')
      .trim()

  return {
    id: `litert-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: LITERT_MODEL,
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: content || '',
        },
        finish_reason: data?.candidates?.[0]?.finishReason || 'stop',
      },
    ],
    usage: data?.usageMetadata || {},
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = getBody(req)
    const controller = new AbortController()
    let timeout
    timeout = setTimeout(() => controller.abort(), 120000)

    let response
    try {
      response = await fetch(LITERT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(buildGeminiPayload(body)),
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('litert inference failed', response.status, errorText.slice(0, 500))
      return res.status(response.status).json({
        error: `Inference server returned status ${response.status}`,
        details: 'Check that litert is active on 127.0.0.1:9379 and exposes the Gemini generateContent API.',
      })
    }

    const contentType = response.headers.get('content-type') || ''
    const data = LITERT_URL.includes('streamGenerateContent') || !contentType.includes('application/json')
      ? await response.text()
      : await response.json()
    return res.status(200).json(normalizeGeminiResponse(data))
  } catch (error) {
    const offlineCodes = new Set(['ECONNREFUSED', 'ECONNRESET', 'EHOSTUNREACH', 'EPERM'])
    const offline = error && (offlineCodes.has(error.code) || error.name === 'AbortError' || offlineCodes.has(error.cause?.code))
    console.error('ai-prospects proxy failed', error)
    return res.status(offline ? 503 : 500).json({
      error: 'Failed to communicate with local litert daemon',
      details: 'Check PID 370151 / port 9379 and verify the local runner is serving /v1beta/models/gemma3-1b-gpu-custom:streamGenerateContent.',
    })
  }
}
