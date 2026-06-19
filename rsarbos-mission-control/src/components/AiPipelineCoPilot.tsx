import React, { useMemo, useState } from 'react'

type CoPilotStage = {
  name: string
  placeholder: string
}

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

const COPILOT_STAGES: CoPilotStage[] = [
  {
    name: 'Stage 1: Revenue Generation',
    placeholder: 'Target acquisition criteria...',
  },
  {
    name: 'Stage 2: Get Conversations',
    placeholder: 'Inbound response hooks or active threads...',
  },
  {
    name: 'Stage 3: First Ask / Sent by HDMS',
    placeholder: 'Asset parameters or institutional data...',
  },
]

function extractProspects(content: string) {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (!lines.length) return []

  const numbered = lines.filter((line) => /^(\d+[\).:-]|\-\s+)/.test(line))
  return (numbered.length ? numbered : lines).slice(0, 5)
}

export default function AiPipelineCoPilot({ context }: { context: CoPilotContext }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [notesByStage, setNotesByStage] = useState<Record<string, string>>({})
  const [prospects, setProspects] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'online' | 'offline'>('idle')
  const [terminalAlert, setTerminalAlert] = useState('')
  const activeStage = COPILOT_STAGES[activeIndex]
  const notes = notesByStage[activeStage.name] || ''

  const pipelineFacts = useMemo(() => [
    `${context.totalProspects} prospects`,
    `${context.replies} replies`,
    `${context.paymentPending} payment pending`,
    `${context.dossiersInFulfillment} in fulfillment`,
  ], [context])

  async function generateProspects() {
    setStatus('loading')
    setTerminalAlert('')
    setProspects([])

    try {
      const response = await fetch('/api/ai/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: activeStage.name,
          placeholder: activeStage.placeholder,
          notes,
          context,
          temperature: 0.3,
        }),
      })
      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.details || data.error || `Proxy returned ${response.status}`)
      }

      const content = data.choices?.[0]?.message?.content
      const nextProspects = typeof content === 'string' ? extractProspects(content) : []
      setProspects(nextProspects.length ? nextProspects : ['No parseable targets returned by the local model.'])
      setStatus('online')
    } catch (error) {
      setStatus('offline')
      setTerminalAlert(error instanceof Error ? error.message : 'Local proxy bridge structural error.')
      setProspects([
        'Local proxy bridge structural error.',
        'Ensure dashboard backend catches /api/ai/prospects.',
        'Verify litert is active on PID 370151 / port 9379.',
      ])
    }
  }

  return (
    <aside className="ai-copilot-panel" aria-label="AI Pipeline Co-Pilot">
      <div className="ai-copilot-head">
        <div>
          <p className="mc-admin-kicker">AI Pipeline Co-Pilot</p>
          <h2>Prospect sidecar</h2>
        </div>
        <div className={`ai-connection ${status === 'offline' ? 'offline' : ''}`}>
          <span aria-hidden="true"></span>
          <strong>{status === 'offline' ? 'Offline' : status === 'loading' ? 'Thinking' : 'litert'}</strong>
        </div>
      </div>

      <div className="ai-stage-tabs" role="tablist" aria-label="AI pipeline stages">
        {COPILOT_STAGES.map((stage, index) => (
          <button
            key={stage.name}
            type="button"
            className={activeIndex === index ? 'active' : ''}
            onClick={() => setActiveIndex(index)}
          >
            {stage.name.replace('Stage ', 'S')}
          </button>
        ))}
      </div>

      <label className="ai-notes-field">
        <span>{activeStage.name}</span>
        <textarea
          value={notes}
          placeholder={activeStage.placeholder}
          onChange={(event) => setNotesByStage({ ...notesByStage, [activeStage.name]: event.target.value })}
          rows={5}
        />
      </label>

      <div className="ai-fact-strip" aria-label="Current Mission Control context">
        {pipelineFacts.map((fact) => <span key={fact}>{fact}</span>)}
      </div>

      <button type="button" className="ai-generate-button" onClick={generateProspects} disabled={status === 'loading'}>
        {status === 'loading' ? 'Generating...' : '⚡ Generate Top 5 Prospects'}
      </button>

      {terminalAlert && (
        <div className="ai-terminal-alert" role="alert">
          <span>$ litert bridge</span>
          <code>{terminalAlert}</code>
        </div>
      )}

      <div className="ai-prospect-slots">
        {(prospects.length ? prospects : Array.from({ length: 5 }, (_, index) => `Prospect slot ${index + 1} waiting for local inference.`)).map((prospect, index) => (
          <article key={`${index}-${prospect}`}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{prospect}</p>
          </article>
        ))}
      </div>

      <p className="ai-copilot-footnote">
        Requests are routed through `/api/ai/prospects`; the browser never calls port 9379 directly.
      </p>
    </aside>
  )
}
