import React, { useMemo, useState } from 'react'

type CoPilotContext = {
  totalProspects: number
  replies: number
  paymentPending: number
  paidOrders: number
  dossiersInFulfillment: number
  deliveredDossiers: number
  primaryOrder: string
  bottleneck: string
}

function splitResponse(content: string) {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.length ? lines : []
}

export default function AiPipelineCoPilot({ context }: { context: CoPilotContext }) {
  const [prompt, setPrompt] = useState('')
  const [responseLines, setResponseLines] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'online' | 'offline'>('idle')
  const [terminalAlert, setTerminalAlert] = useState('')

  const pipelineFacts = useMemo(() => [
    `${context.totalProspects} prospects`,
    `${context.replies} replies`,
    `${context.paymentPending} payment pending`,
    `${context.dossiersInFulfillment} in fulfillment`,
  ], [context])

  async function askGemma() {
    setStatus('loading')
    setTerminalAlert('')
    setResponseLines([])

    try {
      const response = await fetch('/api/ai/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context,
          temperature: 0.3,
        }),
      })
      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.details || data.error || `Proxy returned ${response.status}`)
      }

      const content = data.choices?.[0]?.message?.content
      const nextLines = typeof content === 'string' ? splitResponse(content) : []
      setResponseLines(nextLines.length ? nextLines : ['Gemma returned an empty response.'])
      setStatus('online')
    } catch (error) {
      setStatus('offline')
      setTerminalAlert(error instanceof Error ? error.message : 'Local proxy bridge structural error.')
      setResponseLines([
        'AI inference endpoint is unavailable.',
        'Local dev requires litert on port 9379.',
        'Production requires LITERT_GENERATE_CONTENT_URL to point at a reachable HTTPS endpoint.',
      ])
    }
  }

  return (
    <aside className="ai-copilot-panel" aria-label="AI Pipeline Co-Pilot">
      <div className="ai-copilot-head">
        <div>
          <p className="mc-admin-kicker">AI Pipeline Co-Pilot</p>
          <h2>Gemma dialog</h2>
        </div>
        <div className={`ai-connection ${status === 'offline' ? 'offline' : ''}`}>
          <span aria-hidden="true"></span>
          <strong>{status === 'offline' ? 'Offline' : status === 'loading' ? 'Thinking' : 'litert'}</strong>
        </div>
      </div>

      <label className="ai-notes-field">
        <span>Ask Gemma</span>
        <textarea
          value={prompt}
          placeholder="Tell Gemma what you want: find buyers, draft an outreach angle, plan the next fulfillment step, summarize the bottleneck..."
          onChange={(event) => setPrompt(event.target.value)}
          rows={7}
        />
      </label>

      <div className="ai-fact-strip" aria-label="Current Mission Control context">
        {pipelineFacts.map((fact) => <span key={fact}>{fact}</span>)}
      </div>

      <button type="button" className="ai-generate-button" onClick={askGemma} disabled={status === 'loading'}>
        {status === 'loading' ? 'Thinking...' : 'Ask Gemma'}
      </button>

      {terminalAlert && (
        <div className="ai-terminal-alert" role="alert">
          <span>$ litert bridge</span>
          <code>{terminalAlert}</code>
        </div>
      )}

      <div className="ai-response-stream">
        {(responseLines.length ? responseLines : ['Gemma is waiting for an operator prompt.']).map((line, index) => (
          <article key={`${index}-${line}`}>
            <p>{line}</p>
          </article>
        ))}
      </div>

      <p className="ai-copilot-footnote">
        Requests are routed through `/api/ai/prospects`; the browser never calls port 9379 directly.
      </p>
    </aside>
  )
}
