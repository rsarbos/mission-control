import React from 'react'

export default function SystemRuntime() {
  return (
    <div className="card" style={{ fontSize: '0.85rem', backgroundColor: 'rgba(47, 128, 237, 0.02)' }}>
      <h4 style={{ marginTop: 0 }}>System Runtime</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <p style={{ margin: '4px 0', color: 'var(--rsarbos-muted)' }}>Build Mode</p>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: 'var(--rsarbos-navy)' }}>Local Static</p>
        </div>
        <div>
          <p style={{ margin: '4px 0', color: 'var(--rsarbos-muted)' }}>Persistence</p>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: 'var(--rsarbos-navy)' }}>localStorage</p>
        </div>
        <div>
          <p style={{ margin: '4px 0', color: 'var(--rsarbos-muted)' }}>Agent Mode</p>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: 'var(--rsarbos-navy)' }}>Mock Adapter</p>
        </div>
        <div>
          <p style={{ margin: '4px 0', color: 'var(--rsarbos-muted)' }}>API Status</p>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: 'var(--rsarbos-navy)' }}>Not Connected</p>
        </div>
        <div>
          <p style={{ margin: '4px 0', color: 'var(--rsarbos-muted)' }}>Codex Adapter</p>
          <p style={{ margin: '0', fontWeight: 600, color: 'var(--rsarbos-navy)' }}>Placeholder</p>
        </div>
      </div>
    </div>
  )
}
