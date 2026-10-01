import React, { useEffect, useState, useCallback } from 'react'
import { trackEvent } from '../utils/analytics'

type ProspectStage =
  | 'identified'
  | 'contacted'
  | 'responded'
  | 'dossier_requested'
  | 'paid'
  | 'completed'
  | 'unreachable'

type Prospect = {
  id: string
  name: string
  brokerage: string
  email: string
  phone: string
  property: string
  address: string
  verdict: 'WORTH_PURSUING' | 'WALKAWAY' | 'REVIEW_REQUIRED'
  valueGap: string
  capRate: string
  sourceUrl: string
  stage: ProspectStage
  lastContactedAt?: string
  notes?: string
}

const PROSPECTS: Prospect[] = [
  {
    id: 't_469e0e21',
    name: 'Kenneth Nguyen',
    brokerage: 'Compass / KNR Realtor',
    email: 'kenneth.nguyen@compass.com',
    phone: '(408) 895-0123',
    property: '44 Moon Dance',
    address: 'Milpitas, CA 95035',
    verdict: 'WALKAWAY',
    valueGap: '$148K gap (14.2%)',
    capRate: '4.3% vs 5.0% market',
    sourceUrl: 'https://www.zillow.com/homedetails/44-Moon-Dance-Milpitas-CA-95035/',
    stage: 'contacted',
    lastContactedAt: '2026-10-01T12:42:00Z',
    notes: 'HOA $295/mo drag, rent realism risk at 4.3% cap — outreach prepared (send-outreach.py)',
  },
  {
    id: 't_b525bf73',
    name: 'Todd Montgomery',
    brokerage: 'Compass',
    email: 'toddmontgomery@compass.com',
    phone: '(415) 871-0055',
    property: '720 Clementina St',
    address: 'San Francisco, CA 94103',
    verdict: 'WALKAWAY',
    valueGap: '+$988K gap (26.2%)',
    capRate: '2.6% vs 3.5% market',
    sourceUrl: 'https://www.compass.com/agents/todd-montgomery/',
    stage: 'contacted',
    lastContactedAt: '2026-10-01T12:42:00Z',
    notes: 'Rent does not justify price at current market cap rates — outreach prepared',
  },
  {
    id: 't_rschulman',
    name: 'Stephen Schulman',
    brokerage: 'Keller Williams Westside Estates',
    email: 'stephen@schulmanre.com',
    phone: '(310) 322-1008',
    property: '7807 Breen Ave',
    address: 'Los Angeles, CA 90045',
    verdict: 'REVIEW_REQUIRED',
    valueGap: '~$377K ADU',
    capRate: '7% implied for ADU',
    sourceUrl: 'https://www.zillow.com/homedetails/7807-Breen-Ave-Los-Angeles-CA-90045/',
    stage: 'contacted',
    lastContactedAt: '2026-10-01T12:42:00Z',
    notes: 'ADU pricing ambiguity — institutional underwriting resolves — outreach prepared',
  },
  {
    id: 't_diana',
    name: 'Diana Patrick',
    brokerage: "Pacific Sotheby's",
    email: 'diana@dianapatrick.com',
    phone: '(858) 530-1104',
    property: '3226 Brant St',
    address: 'San Diego, CA 92103',
    verdict: 'WORTH_PURSUING',
    valueGap: '$778K gap (17.3%)',
    capRate: '3.5% market',
    sourceUrl: 'https://dianapatrick.com/',
    stage: 'contacted',
    lastContactedAt: '2026-10-01T12:42:00Z',
    notes: 'Mills Act tax savings + rent upside — strong opportunity — outreach prepared',
  },
  {
    id: 't_colleen',
    name: 'Colleen Cotter',
    brokerage: 'Coldwell Banker',
    email: 'colleen.cotter@cbcal.com',
    phone: '(415) 671-4382',
    property: '33 Precita Ave',
    address: 'San Francisco, CA 94110',
    verdict: 'WORTH_PURSUING',
    valueGap: '$255K gap (17.3%)',
    capRate: '6% mixed-use',
    sourceUrl: 'https://www.coldwellbankerhomes.com/ca/san-francisco/33-precita-ave/pid_72600863/',
    stage: 'contacted',
    lastContactedAt: '2026-10-01T12:42:00Z',
    notes: 'Mixed-use triplex — commercial tenant stability + rent upside — outreach prepared',
  },
  {
    id: 't_james',
    name: 'James B. Hurley',
    brokerage: 'Vanguard Properties',
    email: 'james.hurley@vanguards.com',
    phone: '(415) 964-2400',
    property: '1138 Taylor St',
    address: 'San Francisco, CA 94108',
    verdict: 'WALKAWAY',
    valueGap: '+$1.08M gap (21.8%)',
    capRate: '2.75% vs 3.5% market',
    sourceUrl: 'https://www.compass.com/homdetails/1138-Taylor-St-San-Francisco-CA-94108/1PY8TR_pid/',
    stage: 'contacted',
    lastContactedAt: '2026-10-01T12:42:00Z',
    notes: 'TIC ownership complexity — rent realism risk — outreach prepared',
  },
]

const STAGE_LABELS: Record<ProspectStage, string> = {
  identified: 'Identified',
  contacted: 'Contacted',
  responded: 'Responded',
  dossier_requested: 'Dossier Requested',
  paid: 'Paid ($300)',
  completed: 'Completed',
  unreachable: 'Unreachable',
}

const STAGE_COLORS: Record<ProspectStage, string> = {
  identified: 'status-amber',
  contacted: 'status-blue',
  responded: 'status-blue',
  dossier_requested: 'status-green',
  paid: 'status-green',
  completed: 'status-purple',
  unreachable: 'status-red',
}

const STAGE_ORDER: ProspectStage[] = [
  'identified',
  'contacted',
  'responded',
  'dossier_requested',
  'paid',
  'completed',
]

// Forecast assumptions based on real estate agent outreach benchmarks
const FORECAST_ASSUMPTIONS = {
  responseRate: 0.20,        // 20% of contacted agents respond
  dossierRate: 0.45,         // 45% of responders request a free dossier
  paidRate: 0.30,            // 30% of dossier recipients upgrade to $300
  dossierPrice: 300,
  weeklyOutreach: 6,
}

export default function OwnerDashboard() {
  const [prospects, setProspects] = useState<Prospect[]>(PROSPECTS)
  const [filterStage, setFilterStage] = useState<ProspectStage | 'all'>('all')
  const [notesInput, setNotesInput] = useState<Record<string, string>>({})

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rsarbos_prospects')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setProspects(parsed)
      } catch {}
    }
  }, [])

  // Save to localStorage whenever prospects change
  useEffect(() => {
    localStorage.setItem('rsarbos_prospects', JSON.stringify(prospects))
  }, [prospects])

  const updateStage = useCallback((id: string, stage: ProspectStage) => {
    const prospect = prospects.find((p) => p.id === id)
    setProspects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, stage, lastContactedAt: stage === 'contacted' ? new Date().toISOString() : p.lastContactedAt }
          : p
      )
    )
    trackEvent('prospect_stage_change', {
      prospectId: id,
      stage,
      valueGap: prospect?.valueGap,
    })
  }, [prospects])

  const updateNotes = useCallback((id: string) => {
    const notes = notesInput[id] || ''
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, notes } : p)))
    setNotesInput((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    trackEvent('prospect_note_updated', { prospectId: id })
  }, [notesInput])

  const filtered =
    filterStage === 'all' ? prospects : prospects.filter((p) => p.stage === filterStage)

  const isInStage = (stages: ProspectStage[], stage: ProspectStage) =>
    stages.indexOf(stage) >= 0

  // Funnel stats
  const stageCounts = STAGE_ORDER.reduce(
    (acc, stage) => {
      acc[stage] = prospects.filter((p) => p.stage === stage).length
      return acc
    },
    {} as Record<ProspectStage, number>
  )

  const contactedStages = ['contacted', 'responded', 'dossier_requested', 'paid', 'completed'] as ProspectStage[]
  const respondedStages = ['responded', 'dossier_requested', 'paid', 'completed'] as ProspectStage[]
  const dossierStages = ['dossier_requested', 'paid', 'completed'] as ProspectStage[]
  const paidStages = ['paid', 'completed'] as ProspectStage[]

  const totalContacted = prospects.filter((p) => isInStage(contactedStages, p.stage)).length
  const totalResponded = prospects.filter((p) => isInStage(respondedStages, p.stage)).length
  const totalDossier = prospects.filter((p) => isInStage(dossierStages, p.stage)).length
  const totalPaid = prospects.filter((p) => isInStage(paidStages, p.stage)).length
  const totalCompleted = prospects.filter((p) => p.stage === 'completed').length

  // Conversion rates
  const responseRate = totalContacted > 0 ? totalResponded / totalContacted : 0
  const dossierRate = totalResponded > 0 ? totalDossier / totalResponded : 0
  const paidRate = totalDossier > 0 ? totalPaid / totalDossier : 0

  // MRR and forecast
  const currentMRR = totalPaid * FORECAST_ASSUMPTIONS.dossierPrice
  const weeklyRevenue = totalPaid * FORECAST_ASSUMPTIONS.dossierPrice
  const monthlyRevenue = weeklyRevenue * 4.3

  const forecastRespond = Math.round(FORECAST_ASSUMPTIONS.weeklyOutreach * FORECAST_ASSUMPTIONS.responseRate)
  const forecastDossier = Math.round(forecastRespond * FORECAST_ASSUMPTIONS.dossierRate)
  const forecastPaid = Math.round(forecastDossier * FORECAST_ASSUMPTIONS.paidRate)
  const forecastMonthlyMRR = forecastPaid * FORECAST_ASSUMPTIONS.dossierPrice

  const funnelConversion = totalContacted > 0
    ? ((totalCompleted / totalContacted) * 100).toFixed(1)
    : '0.0'

  function StageSelect({ prospect }: { prospect: Prospect }) {
    return (
      <select
        value={prospect.stage}
        onChange={(e) => updateStage(prospect.id, e.target.value as ProspectStage)}
        className={STAGE_COLORS[prospect.stage]}
        style={{
          fontSize: '0.72rem',
          padding: '4px 8px',
          borderRadius: '6px',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.04)',
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
        {STAGE_ORDER.map((s) => (
          <option key={s} value={s}>
            {STAGE_LABELS[s]}
          </option>
        ))}
        <option value="unreachable">Unreachable</option>
      </select>
    )
  }

  function ForecastCard({ title, value, sub, color }: {
    title: string
    value: string
    sub?: string
    color?: string
  }) {
    return (
      <div className="metric-tile" style={{ borderColor: color ? `rgba(var(--rsarbos-blue-rgb), 0.3)` : undefined }}>
        <span>{title}</span>
        <strong>{value}</strong>
        {sub && <small style={{ color: 'var(--rsarbos-muted)', fontSize: '0.68rem' }}>{sub}</small>}
      </div>
    )
  }

  return (
    <div className="owner-dashboard">
      <header className="mc-admin-header">
        <a className="mc-admin-logo" href="/"><img src="/logo.png" alt="RSARBOS" /></a>
        <div>
          <p className="mc-admin-kicker">OWNER DASHBOARD</p>
          <h1>Outreach & Revenue Pipeline</h1>
          <p style={{ color: '#a1a1aa', margin: 0 }}>
            6 prospects tracked across the acquisition funnel
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span className="mc-admin-status">
            <span className="mc-live-dot"></span> LIVE
          </span>
          <button
            type="button"
            className="mc-mini-action"
            onClick={() => {
              localStorage.removeItem('rsarbos_prospects')
              setProspects(PROSPECTS)
              trackEvent('dashboard_reset')
            }}
          >
            Reset
          </button>
        </div>
      </header>

      <main className="mc-admin-grid">
        {/* Pipeline Summary */}
        <section className="mc-admin-card mc-context-zone">
          <div className="mc-context-head">
            <span>Pipeline Summary</span>
          </div>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div className="metric-tile">
              <span>Prospects in pipeline</span>
              <strong>{prospects.length}</strong>
            </div>
            <div className="metric-tile">
              <span>Reached out</span>
              <strong>{totalContacted}</strong>
              <small style={{ color: 'var(--rsarbos-muted)' }}>{((totalContacted / prospects.length) * 100).toFixed(0)}%</small>
            </div>
            <div className="metric-tile">
              <span>Responded</span>
              <strong>{totalResponded}</strong>
              <small style={{ color: 'var(--rsarbos-muted)' }}>{responseRate > 0 ? `${(responseRate * 100).toFixed(0)}% conversion` : '—'}</small>
            </div>
            <div className="metric-tile">
              <span>Dossier requests</span>
              <strong>{totalDossier}</strong>
              <small style={{ color: 'var(--rsarbos-muted)' }}>{dossierRate > 0 ? `${(dossierRate * 100).toFixed(0)}% conversion` : '—'}</small>
            </div>
            <div className="metric-tile">
              <span>Paid ($300)</span>
              <strong>{totalPaid}</strong>
            </div>
            <div className="metric-tile">
              <span>Completed sales</span>
              <strong>{totalCompleted}</strong>
            </div>
            <div className="metric-tile">
              <span>Funnel conversion</span>
              <strong>{funnelConversion}%</strong>
              <small style={{ color: 'var(--rsarbos-muted)' }}>identified → completed</small>
            </div>
          </div>
        </section>

        {/* Forecast */}
        <section className="mc-admin-card">
          <div className="mc-context-head">
            <span>Revenue Forecast</span>
          </div>
          <div style={{ display: 'grid', gap: '16px' }}>
            <ForecastCard
              title="Current MRR"
              value={`$${currentMRR.toLocaleString()}`}
              sub={`${totalPaid} paid dossiers × $300`}
            />
            <ForecastCard
              title="Monthly Run Rate"
              value={`$${monthlyRevenue.toLocaleString()}`}
              sub={`${weeklyRevenue} × 4.3 weeks`}
            />

            <div style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.06)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              marginTop: '8px',
            }}>
              <p style={{ margin: '0 0 8px', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Based on outreach activity:
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '4px 0', color: 'var(--rsarbos-muted)' }}>Weekly outreach</td>
                    <td style={{ textAlign: 'right' }}>{FORECAST_ASSUMPTIONS.weeklyOutreach} prospects</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', color: 'var(--rsarbos-muted)' }}>Response rate</td>
                    <td style={{ textAlign: 'right' }}>{Math.round(FORECAST_ASSUMPTIONS.responseRate * 100)}% → ~{forecastRespond} responses</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', color: 'var(--rsarbos-muted)' }}>Dossier request rate</td>
                    <td style={{ textAlign: 'right' }}>{Math.round(FORECAST_ASSUMPTIONS.dossierRate * 100)}% → ~{forecastDossier} requests</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', color: 'var(--rsarbos-muted)' }}>Paid conversion</td>
                    <td style={{ textAlign: 'right' }}>{Math.round(FORECAST_ASSUMPTIONS.paidRate * 100)}% → ~{forecastPaid} sales</td>
                  </tr>
                  <tr style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '8px 0', fontWeight: 700 }}>Projected monthly MRR</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#3b82f6' }}>
                      ${forecastMonthlyMRR.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--rsarbos-muted)' }}>
                At 6 prospects/week with 20% response → 45% dossier → 30% paid:
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 700 }}>
                ${forecastMonthlyMRR.toLocaleString()}/mo projected MRR from 52 new prospects/year
              </p>
            </div>
          </div>
        </section>

        {/* Funnel Visualization */}
        <section className="mc-admin-card">
          <div className="mc-context-head">
            <span>Funnel (Current Batch)</span>
          </div>
          <div style={{ display: 'grid', gap: '18px' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '140px' }}>
              {STAGE_ORDER.map((stage) => {
                const count = stageCounts[stage] || 0
                const maxCount = prospects.length
                const heightPct = maxCount > 0 ? (count / maxCount) * 100 : 0
                return (
                  <div key={stage} style={{ flex: 1, display: 'grid', gap: '6px', alignItems: 'end' }}>
                    <div style={{
                      width: '100%',
                      height: `${Math.max(heightPct, 4)}%`,
                      minHeight: '4px',
                      background: stage === 'identified' ? 'rgba(245, 158, 11, 0.3)' :
                                  stage === 'contacted' ? 'rgba(59, 130, 246, 0.3)' :
                                  stage === 'responded' ? 'rgba(59, 130, 246, 0.5)' :
                                  stage === 'dossier_requested' ? 'rgba(16, 185, 129, 0.3)' :
                                  stage === 'paid' ? 'rgba(16, 185, 129, 0.5)' :
                                  'rgba(139, 92, 246, 0.3)',
                      borderRadius: '4px 4px 0 0',
                      border: stage === 'identified' ? '1px solid rgba(245, 158, 11, 0.5)' :
                              stage === 'contacted' ? '1px solid rgba(59, 130, 246, 0.5)' :
                              stage === 'responded' ? '1px solid rgba(59, 130, 246, 0.7)' :
                              stage === 'dossier_requested' ? '1px solid rgba(16, 185, 129, 0.5)' :
                              stage === 'paid' ? '1px solid rgba(16, 185, 129, 0.7)' :
                              '1px solid rgba(139, 92, 247, 0.5)',
                    }}>
                      <span style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: '#f8fafc',
                      }}>{count}</span>
                    </div>
                    <span style={{
                      fontSize: '0.64rem',
                      color: 'var(--rsarbos-muted)',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>{STAGE_LABELS[stage].split(' ')[0]}</span>
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--rsarbos-muted)' }}>
              <span>{STAGE_LABELS.identified} → {STAGE_LABELS.completed}</span>
              <span>Overall conversion: {funnelConversion}%</span>
            </div>
          </div>
        </section>

        {/* Prospect Filter */}
        <section className="mc-admin-card mc-ops-zone">
          <div className="mc-section-head">
            <div>
              <p className="mc-admin-kicker">Prospects</p>
              <h2>Outreach Tracker</h2>
            </div>
            <div className="contact-action-row">
              <button
                type="button"
                className={filterStage === 'all' ? 'active' : ''}
                onClick={() => setFilterStage('all')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: filterStage === 'all' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                  background: filterStage === 'all' ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
                  color: filterStage === 'all' ? '#fff' : '#a1a1aa',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                ALL ({prospects.length})
              </button>
              {STAGE_ORDER.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={filterStage === s ? 'active' : ''}
                  onClick={() => setFilterStage(s)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: filterStage === s ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                    background: filterStage === s ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
                    color: filterStage === s ? '#fff' : '#a1a1aa',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  {STAGE_LABELS[s].split('(')[0].trim()} ({stageCounts[s] || 0})
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 && (
            <p style={{ color: '#a1a1aa' }}>No prospects match the current filter.</p>
          )}

          {filtered.length > 0 && (
            <div className="mc-table-wrap">
              <table className="mc-table">
                <thead>
                  <tr>
                    <th>Prospect</th>
                    <th>Property</th>
                    <th>Verdict</th>
                    <th>Value Gap</th>
                    <th>Stage</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong style={{ display: 'block' }}>{p.name}</strong>
                        <span style={{ color: '#71717a', fontSize: '0.72rem' }}>{p.brokerage}</span>
                        {p.email && (
                          <span style={{ color: '#71717a', fontSize: '0.68rem', display: 'block' }}>
                            {p.email}
                          </span>
                        )}
                      </td>
                      <td>
                        <strong style={{ display: 'block' }}>{p.property}</strong>
                        <span style={{ color: '#71717a', fontSize: '0.72rem' }}>{p.address}</span>
                      </td>
                      <td>
                        <span className={`verdict-badge ${
                          p.verdict === 'WORTH_PURSUING' ? 'status-green' :
                          p.verdict === 'WALKAWAY' ? 'status-red' : 'status-amber'
                        }`}>
                          {p.verdict === 'WORTH_PURSUING' ? 'Worth Pursuing' :
                           p.verdict === 'WALKAWAY' ? 'Walkaway' : 'Review'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>{p.valueGap}</td>
                      <td>
                        <StageSelect prospect={p} />
                        {p.lastContactedAt && (
                          <small style={{ display: 'block', color: '#71717a', marginTop: '4px' }}>
                            Last: {new Date(p.lastContactedAt).toLocaleDateString()}
                          </small>
                        )}
                      </td>
                      <td>
                        <div className="contact-action-row">
                          <a
                            href={`mailto:${p.email}?subject=RSARBOS%20Property%20Underwriting%20-%20${encodeURIComponent(p.property)}`}
                            style={{ padding: '4px 10px', fontSize: '0.68rem' }}
                            onClick={() => trackEvent('prospect_email_click', { prospectId: p.id })}
                          >
                            Email
                          </a>
                          <a
                            href={p.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ padding: '4px 10px', fontSize: '0.68rem' }}
                          >
                            Listing →
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}

          {filterStage === 'all' && filtered.some((p) => !p.notes) && (
            <p style={{ color: '#71717a', fontSize: '0.8rem', marginTop: '12px' }}>
              Tip: Click the email button to start outreach, then update the stage dropdown as prospects respond.
            </p>
          )}
        </section>
      </main>
    </div>
  )
}
