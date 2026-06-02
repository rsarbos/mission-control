import React, { useState } from 'react'

interface HeaderProps {
  model: string
  selectedAgent: string
  onModelChange: (value: string) => void
  onCommand: (command: string) => void
  system: {
    mission: string
    constraint: string
    readiness: string
    phase: string
  }
}

export default function Header({ model, selectedAgent, onModelChange, onCommand, system }: HeaderProps) {
  const [cmd, setCmd] = useState('')

  return (
    <header className="mc-header">
      <div className="header-branding">
        <div className="logo-block">
          <div className="logo-placeholder">RS</div>
          <div className="branding-text">
            <p className="eyebrow">RSARBOS</p>
            <h1>Mission Control</h1>
            <p className="section-subtitle">Founder Operating System</p>
          </div>
        </div>
      </div>
      <div className="header-meta">
        <div className="mission-blocks">
          <div className="status-block mission-block">
            <p className="small-label">Current Mission</p>
            <strong>{system.mission}</strong>
          </div>
          <div className="status-block constraint-block">
            <p className="small-label">Current Constraint</p>
            <strong>{system.constraint}</strong>
          </div>
        </div>
        <div className="readiness-row">
          <span className="readiness-pill">📍 Phase: {system.phase}</span>
          <div className="readiness-meter">
            <p className="small-label">Readiness</p>
            <div className="meter-bar">
              <div className="meter-fill" style={{ width: system.readiness }}></div>
            </div>
            <span className="meter-label">{system.readiness}</span>
          </div>
        </div>
        <div className="system-chips">
          <span className="chip-small model-chip">🤖 {model}</span>
          <span className="chip-small agent-chip">⚙️ {selectedAgent}</span>
        </div>
        <div className="command-bar">
          <input
            type="text"
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && cmd.trim()) {
                onCommand(cmd)
                setCmd('')
              }
            }}
            placeholder="> review tasks"
          />
        </div>
      </div>
    </header>
  )
}
