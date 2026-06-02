import React, { useState } from 'react'
import { TABS } from '../data/mission-control-data'
import { FounderTask } from '../data/founder-tasks'

interface CommandHistory {
  cmd: string
  response: string
  timestamp: number
}

interface CommandPaneProps {
  model: string
  selectedAgent: string
  activeTab: string
  tasks: FounderTask[]
  history: CommandHistory[]
  onModelChange: (model: string) => void
  onSelectedAgentChange: (agent: string) => void
  onCommand: (command: string) => string
}

export default function CommandPane({ model, selectedAgent, activeTab, tasks, history, onModelChange, onSelectedAgentChange, onCommand }: CommandPaneProps) {
  const [cmd, setCmd] = useState('')

  function handleSubmit(raw: string) {
    const response = onCommand(raw)
    setCmd('')
    return response
  }

  return (
    <section className="command-pane">
      <div className="card command-card">
        <div className="command-header">
          <p className="eyebrow">Command Interface</p>
          <h3>AXIOM Control</h3>
        </div>

        <div className="command-input-wrapper">
          <input
            type="text"
            id="command"
            className="command-input-premium"
            placeholder="> review tasks"
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && cmd.trim()) {
                handleSubmit(cmd)
              }
            }}
          />
        </div>

        <div className="command-status">
          <div className="status-row">
            <span className="status-label">Model:</span>
            <span className="status-value">{model}</span>
          </div>
          <div className="status-row">
            <span className="status-label">Agent:</span>
            <span className="status-value">{selectedAgent}</span>
          </div>
        </div>

        {history.length > 0 && (
          <div className="command-history-section">
            <p className="history-label">Recent activity</p>
            <div className="command-history">
              {history.slice(-4).map((entry, idx) => (
                <div key={idx} className="history-entry">
                  <code className="history-cmd">$ {entry.cmd}</code>
                  <p className="history-response">
                    {entry.response.split('\n').slice(0, 1).join('\n')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card info-card">
        <p className="info-text">
          <strong>Model-agnostic design.</strong> Connect Codex, GPT, Claude, Qwen, DeepSeek, or Ollama through AXIOM adapters.
        </p>
      </div>
    </section>
  )
}
