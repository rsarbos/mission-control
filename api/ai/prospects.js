const DEFAULT_LOCAL_LITERT_URL = 'http://127.0.0.1:9379/v1beta/models/gemma3-1b-gpu-custom:streamGenerateContent'
function normalizeConfiguredUrl(value) {
  const trimmed = (value || '').trim()
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

const CONFIGURED_LITERT_URL = normalizeConfiguredUrl(process.env.LITERT_GENERATE_CONTENT_URL)
const LITERT_URL = CONFIGURED_LITERT_URL || DEFAULT_LOCAL_LITERT_URL
const LITERT_MODEL = 'gemma3-1b-gpu-custom'
const LITERT_STREAM_PATH = '/v1beta/models/gemma3-1b-gpu-custom:streamGenerateContent'

const RSARBOS_SYSTEM_CONTEXT = `
RSARBOS sells human-reviewed real estate underwriting dossiers.
Mission Control is revenue-first: find prospects, start conversations, convert payment, fulfill paid dossiers, deliver reports.
Do not invent revenue, evidence, payment, or financial truth.
Keep help grounded in institutional acquisition mechanics: agents, wholesalers, lenders, acquisition teams, operators needing rent thesis checks, ARV review, risk registers, source custody, and faster capital-confidence.
Answer the operator's request directly. Be concise unless the operator asks for depth.
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
  const prompt = cleanString(body.prompt || body.notes, '')
  const context = cleanContext(body.context)

  return [
    {
      role: 'system',
      content: `${RSARBOS_SYSTEM_CONTEXT}

Current Mission Control context: ${JSON.stringify(context)}

Act as a practical Mission Control operator assistant. Help with prospecting, outreach, conversion, fulfillment planning, delivery, evidence handling, and commercial learning. If the request would require facts not provided, state the missing inputs instead of inventing them.`,
    },
    {
      role: 'user',
      content: prompt || 'Suggest the highest-leverage next manual action using the current Mission Control context.',
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
      maxOutputTokens: 650,
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
  if (req.method === 'GET') {
    return res.status(200).json({
      configured: Boolean(CONFIGURED_LITERT_URL),
      targetPathOk: CONFIGURED_LITERT_URL ? CONFIGURED_LITERT_URL.endsWith(LITERT_STREAM_PATH) : false,
      productionReachableRequirement: process.env.VERCEL ? 'LITERT_GENERATE_CONTENT_URL must be an HTTPS endpoint reachable from Vercel.' : 'Local fallback uses 127.0.0.1:9379.',
    })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (process.env.VERCEL && !CONFIGURED_LITERT_URL) {
    return res.status(503).json({
      error: 'AI inference URL is not configured',
      details: 'Set LITERT_GENERATE_CONTENT_URL in Vercel to a reachable HTTPS streamGenerateContent endpoint, then redeploy.',
    })
  }

  if (process.env.VERCEL && !CONFIGURED_LITERT_URL.startsWith('https://')) {
    return res.status(503).json({
      error: 'AI inference URL is not reachable from Vercel',
      details: 'LITERT_GENERATE_CONTENT_URL must be a public HTTPS endpoint, not localhost, a blank quoted string, or another private URL.',
    })
  }

  if (CONFIGURED_LITERT_URL && !CONFIGURED_LITERT_URL.endsWith(LITERT_STREAM_PATH)) {
    return res.status(503).json({
      error: 'AI inference URL does not target the Gemma stream endpoint',
      details: `LITERT_GENERATE_CONTENT_URL must end with ${LITERT_STREAM_PATH}.`,
    })
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
        details: CONFIGURED_LITERT_URL
          ? 'Check that LITERT_GENERATE_CONTENT_URL points to a reachable streamGenerateContent endpoint.'
          : 'Check that litert is active on 127.0.0.1:9379 and exposes the Gemini generateContent API.',
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
      error: CONFIGURED_LITERT_URL
        ? 'Failed to communicate with configured inference endpoint'
        : 'Failed to communicate with local litert daemon',
      details: CONFIGURED_LITERT_URL
        ? 'Check that LITERT_GENERATE_CONTENT_URL is reachable from Vercel and serves /v1beta/models/gemma3-1b-gpu-custom:streamGenerateContent.'
        : 'Check that litert is listening on port 9379 and serving /v1beta/models/gemma3-1b-gpu-custom:streamGenerateContent.',
    })
  }
}
