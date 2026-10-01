import React, { useEffect, useState } from 'react'
import { trackEvent } from '../utils/analytics'

const DOSSIER_STATUS_LABELS: Record<string, string> = {
  requested: 'New Request',
  hermes_queued: 'Processing (Hermes)',
  dossier_generated: 'Dossier Ready',
  delivered: 'Delivered (Free)',
  checkout_created: 'Checkout Created',
  paid: 'Paid',
  full_dossier_delivered: 'Full Dossier Delivered',
  upgraded: 'Upgraded',
}

const DOSSIER_STATUS_COLORS: Record<string, string> = {
  requested: 'status-amber',
  hermes_queued: 'status-blue',
  dossier_generated: 'status-green',
  delivered: 'status-green',
  checkout_created: 'status-blue',
  paid: 'status-green',
  full_dossier_delivered: 'status-green',
  upgraded: 'status-blue',
}

type DossierRequest = {
  id: string
  agent_name: string
  agent_email: string
  agent_phone: string
  property_address: string
  property_url: string
  brokerage: string
  mls_id: string
  source_channel: string
  investment_intent: string
  status: string
  dossier_type: string
  hermes_task_id: string
  dossier_file_ref: string
  dossier_delivered_at: string
  stripe_checkout_session_id: string
  paid_at: string
  full_dossier_file_ref: string
  full_dossier_delivered_at: string
  upgraded_at: string
  email_sent_at: string
  admin_notes: string
  created_at: string
  updated_at: string
}

const STATUS_FILTERS = ['All', 'requested', 'hermes_queued', 'delivered', 'checkout_created', 'paid', 'full_dossier_delivered']

export default function DossierDashboard() {
  const [requests, setRequests] = useState<DossierRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [adminToken, setAdminToken] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('rsarbos_admin_token') || ''
    setAdminToken(storedToken)
    if (storedToken) {
      fetchRequests(storedToken)
    }
    // Poll every 30 seconds
    const interval = setInterval(() => {
      const token = localStorage.getItem('rsarbos_admin_token') || ''
      if (token) fetchRequests(token)
    }, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchRequests(token: string) {
    setLoading(true)
    setError('')
    try {
      const url = new URL('/api/admin-dossiers', window.location.origin)
      if (filter !== 'All') url.searchParams.set('status', filter)

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 401) {
        setError('Token expired or invalid. Re-enter your admin token.')
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      setRequests(data.requests || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch dossier requests.')
    } finally {
      setLoading(false)
    }
  }

  function refresh() {
    const token = localStorage.getItem('rsarbos_admin_token') || adminToken
    if (token) fetchRequests(token)
  }

  function saveToken() {
    if (!adminToken.trim()) return
    localStorage.setItem('rsarbos_admin_token', adminToken)
    fetchRequests(adminToken)
    trackEvent('admin_token_saved')
  }

  function clearToken() {
    localStorage.removeItem('rsarbos_admin_token')
    setAdminToken('')
    setRequests([])
  }

  function StatusBadge({ status }: { status: string }) {
    const colorClass = DOSSIER_STATUS_COLORS[status] || 'status-amber'
    const label = DOSSIER_STATUS_LABELS[status] || status
    return <span className={`status-tag ${colorClass}`}>{label}</span>
  }

  function money(val: string | null | undefined) {
    if (!val) return 'Not provided'
    return val
  }

  if (!adminToken) {
    return (
      <div className="dossier-dashboard">
        <div className="mc-admin-card" style={{ maxWidth: '480px', margin: '48px auto' }}>
          <h2>RSARBOS Owner Dashboard</h2>
          <p style={{ color: '#a1a1aa' }}>Enter your admin token to view lead pipeline status.</p>
          <div style={{ marginTop: '18px' }}>
            <input
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="ADMIN_TOKEN"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: '#f8fafc',
                fontSize: '0.9rem',
                marginBottom: '12px',
              }}
            />
            <button
              className="primary-action red-action full-field"
              onClick={saveToken}
              disabled={!adminToken.trim()}
            >
              Save &amp; Load Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dossier-dashboard mc-admin-shell">
      <header className="mc-admin-header">
        <a className="mc-admin-logo" href="/"><img src="/logo.png" alt="RSARBOS" /></a>
        <div>
          <p className="mc-admin-kicker">Dossier Lead Pipeline</p>
          <h1>Owner Dashboard</h1>
          <p style={{ color: '#a1a1aa', margin: 0 }}>
            Complimentary dossier requests → $300 full dossier conversions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span className="mc-admin-status">
            <span className="mc-live-dot"></span> LIVE
          </span>
          <button type="button" className="mc-mini-action" onClick={refresh} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button type="button" className="mc-mini-action" onClick={clearToken}>
            Change Token
          </button>
        </div>
      </header>

      <main className="mc-admin-grid">
        <main className="mc-ops-zone">
          <section className="mc-admin-card">
            <div className="mc-section-head">
              <div>
                <p className="mc-admin-kicker">Filters</p>
                <h2>Dossier Requests</h2>
              </div>
              <div className="contact-action-row">
                {STATUS_FILTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={filter === s ? 'active' : ''}
                    onClick={() => {
                      setFilter(s)
                      const token = localStorage.getItem('rsarbos_admin_token') || adminToken
                      if (token) fetchRequests(token)
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: filter === s ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                      background: filter === s ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
                      color: filter === s ? '#ffffff' : '#a1a1aa',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                    }}
                  >
                    {s === 'All' ? 'ALL' : DOSSIER_STATUS_LABELS[s] || s}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="form-error full-field">{error}</p>}

            {loading && <p style={{ color: '#a1a1aa' }}>Loading dossier requests...</p>}

            {!loading && !error && requests.length === 0 && (
              <p style={{ color: '#a1a1aa' }}>
                No dossier requests match the current filter.
              </p>
            )}

            {!loading && requests.length > 0 && (
              <div className="mc-table-wrap">
                <table className="mc-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Agent</th>
                      <th>Property</th>
                      <th>Status</th>
                      <th>Type</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <code style={{ fontSize: '0.72rem' }}>{req.id.slice(0, 8)}…</code>
                        </td>
                        <td>
                          <strong style={{ display: 'block' }}>{req.agent_name || '—'}</strong>
                          <span style={{ color: '#71717a', fontSize: '0.72rem' }}>{req.agent_email}</span>
                          {req.agent_phone && (
                            <span style={{ color: '#71717a', fontSize: '0.72rem', display: 'block' }}>
                              {req.agent_phone}
                            </span>
                          )}
                        </td>
                        <td>
                          <strong style={{ display: 'block' }}>{req.property_address}</strong>
                          {req.brokerage && (
                            <span style={{ color: '#71717a', fontSize: '0.72rem' }}>{req.brokerage}</span>
                          )}
                          {req.mls_id && (
                            <span style={{ color: '#71717a', fontSize: '0.72rem', display: 'block' }}>
                              MLS: {req.mls_id}
                            </span>
                          )}
                        </td>
                        <td>
                          <StatusBadge status={req.status} />
                          {req.hermes_task_id && (
                            <span style={{ color: '#71717a', fontSize: '0.68rem', display: 'block', marginTop: '4px' }}>
                              Hermes: {req.hermes_task_id.slice(0, 8)}…
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '999px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              background:
                                req.dossier_type === 'full'
                                  ? 'rgba(59,130,246,0.16)'
                                  : 'rgba(245,158,11,0.16)',
                              color:
                                req.dossier_type === 'full' ? '#3b82f6' : '#f59e0b',
                            }}
                          >
                            {req.dossier_type === 'full' ? 'FULL ($300)' : 'FREE (15-min)'}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: '#71717a', fontSize: '0.78rem' }}>
                            {new Date(req.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>
                        <td>
                          <div className="contact-action-row">
                            {req.dossier_file_ref && (
                              <a
                                href={req.dossier_file_ref}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                              >
                                Free Dossier
                              </a>
                            )}
                            {req.full_dossier_file_ref && (
                              <a
                                href={req.full_dossier_file_ref}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                              >
                                Full Dossier
                              </a>
                            )}
                            {req.status === 'requested' && (
                              <button
                                type="button"
                                className="mc-mini-action"
                                onClick={async () => {
                                  trackEvent('retry_hermes_webhook', { requestId: req.id })
                                  try {
                                    const token = localStorage.getItem('rsarbos_admin_token') || adminToken
                                    const resp = await fetch('/api/notify-hermes', {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                      },
                                      body: JSON.stringify({ request_id: req.id }),
                                    })
                                    const result = await resp.json()
                                    if (result.success) {
                                      fetchRequests(token)
                                    } else {
                                      alert(`Webhook retry failed: ${result.error || 'unknown'}`)
                                    }
                                  } catch (err) {
                                    alert(`Webhook retry error: ${err instanceof Error ? err.message : 'unknown'}`)
                                  }
                                }}
                              >
                                Retry Hermes
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>

        <aside className="mc-context-zone">
          <section className="mc-context-card mc-admin-card">
            <div className="mc-context-head">
              <span>Pipeline Summary</span>
            </div>
            <div style={{ display: 'grid', gap: '14px' }}>
              <div className="metric-tile">
                <span>New requests</span>
                <strong>{requests.filter((r) => r.status === 'requested').length}</strong>
              </div>
              <div className="metric-tile">
                <span>In processing</span>
                <strong>{requests.filter((r) => r.status === 'hermes_queued').length}</strong>
              </div>
              <div className="metric-tile">
                <span>Delivered (free)</span>
                <strong>{requests.filter((r) => r.status === 'delivered').length}</strong>
              </div>
              <div className="metric-tile">
                <span>Paid ($300 upgrades)</span>
                <strong>{requests.filter((r) => r.dossier_type === 'full' && r.status === 'paid').length}</strong>
              </div>
              <div className="metric-tile">
                <span>Full delivered</span>
                <strong>{requests.filter((r) => r.status === 'full_dossier_delivered').length}</strong>
              </div>
            </div>
          </section>
        </aside>
      </main>
    </div>
  )
}
