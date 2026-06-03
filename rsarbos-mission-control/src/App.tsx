import React, { useEffect, useState } from 'react'
import { TABS } from './data/mission-control-data'
import { FOUNDER_TASKS, FounderTask } from './data/founder-tasks'
import { AXIOM_AGENTS } from './data/axiom-agents'
import { SYSTEM_STATE } from './data/system-state'
import { DEPARTMENTS } from './data/departments'

import Header from './components/Header'
import Tabs from './components/Tabs'
import TaskBoard from './components/TaskBoard'
import CommandPane from './components/CommandPane'
import SystemRuntime from './components/SystemRuntime'
import DepartmentGrid from './components/DepartmentGrid'
import OperationsSnapshot from './components/OperationsSnapshot'
import OrgMap from './components/OrgMap'
import underwritingHero from './assets/underwriting-dossier-hero.png'

const WEBSITE_READINESS_ITEMS = [
  {
    label: 'Intake routing',
    value: SYSTEM_STATE.emails.uwRequests,
    status: 'Ready for staging submit',
  },
  {
    label: 'Support routing',
    value: SYSTEM_STATE.emails.support,
    status: 'Ownership check pending',
  },
  {
    label: 'Payment confirmation',
    value: 'Manual settlement ledger',
    status: 'Dry run pending',
  },
  {
    label: 'Funnel tracking',
    value: 'start / submit / confirmation',
    status: 'Events specified',
  },
]

const REQUEST_EMAIL = 'uw.requests@rsarbos.com'
const SUPPORT_EMAIL = 'uw.support@rsarbos.com'
const PAYMENT_LINK = '[PAYMENT_LINK_PENDING]'
const MISSION_CONTROL_PASSWORD = import.meta.env.VITE_MISSION_CONTROL_PASSWORD || 'rsarbos-founder'

const SERVICES = [
  'Property review',
  'Comparable analysis',
  'ARV thesis',
  'Risk notes',
  'Pricing context',
  'Deal confidence summary',
  'Final underwriting dossier',
]

function PublicWebsite() {
  const [form, setForm] = useState({
    clientName: '',
    email: '',
    propertyAddress: '',
    propertyUrl: '',
    investmentIntent: '',
    urgency: 'Standard',
    notes: '',
  })

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = [
      'Manual Underwriting Request',
      '',
      `Client name: ${form.clientName}`,
      `Email: ${form.email}`,
      `Property address: ${form.propertyAddress}`,
      `Property URL: ${form.propertyUrl}`,
      `Investment intent: ${form.investmentIntent}`,
      `Urgency: ${form.urgency}`,
      '',
      'Notes / questions:',
      form.notes || 'None provided',
      '',
      'Payment confirmation language:',
      'Request received. RSARBOS will review the submitted information. Please confirm this request with payment. Within 24 hours after payment confirmation, you will receive a private link from this email with your completed underwriting package.',
      '',
      `Payment link: ${PAYMENT_LINK}`,
    ].join('\n')

    window.location.href = `mailto:${REQUEST_EMAIL}?subject=${encodeURIComponent('Manual Underwriting Request')}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="site-shell">
      <header className="site-nav">
        <a className="site-mark" href="/">
          RSARBOS
        </a>
        <nav aria-label="Public website sections">
          <a href="#services">Services</a>
          <a href="#request">Request</a>
          <a href="#pricing">Pricing</a>
          <a href="#samples">Samples</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="mission-link" href="/mission-control">
          Mission Control
        </a>
      </header>

      <main>
        <section className="site-hero" id="home">
          <img className="hero-visual" src={underwritingHero} alt="Property underwriting dossier with analysis tables and risk notes" />
          <div className="hero-copy">
            <p className="eyebrow">Manual underwriting intelligence</p>
            <h1>RSARBOS transforms property data into decision-grade underwriting intelligence.</h1>
            <p>
              We turn fragmented real estate information into an auditable underwriting package built for investor decisions,
              pricing clarity, and risk review.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#request">
                Request underwriting
              </a>
              <a className="secondary-action" href="#samples">
                View deliverable outline
              </a>
            </div>
          </div>
          <div className="hero-evidence" aria-label="RSARBOS underwriting workflow summary">
            <div>
              <span>01</span>
              <strong>Submit property details</strong>
              <p>Send the address, listing URL, investment intent, urgency, and context.</p>
            </div>
            <div>
              <span>02</span>
              <strong>Manual analyst review</strong>
              <p>RSARBOS reviews property facts, comps, pricing context, and risk signals.</p>
            </div>
            <div>
              <span>03</span>
              <strong>Private dossier delivery</strong>
              <p>A completed underwriting package is delivered by private link after payment confirmation.</p>
            </div>
          </div>
        </section>

        <section className="site-band trust-band">
          <div>
            <p className="small-label">Position</p>
            <strong>Not a listing portal. Not generic AI output. A disciplined manual underwriting service.</strong>
          </div>
          <div>
            <p className="small-label">Current offer</p>
            <strong>$100 manual underwriting report</strong>
          </div>
          <div>
            <p className="small-label">Delivery</p>
            <strong>Private completed package link within 24 hours after payment confirmation.</strong>
          </div>
        </section>

        <section className="site-section" id="services">
          <div className="section-intro">
            <p className="eyebrow">Services</p>
            <h2>Manual underwriting reports for real estate decisions.</h2>
            <p>
              RSARBOS reviews the submitted property and produces a concise dossier that helps you understand the deal,
              the assumptions, and the risk before you move forward.
            </p>
          </div>
          <div className="service-grid">
            {SERVICES.map((service) => (
              <article className="service-item" key={service}>
                <span></span>
                <strong>{service}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="site-section split-section" id="pricing">
          <div>
            <p className="eyebrow">Pricing</p>
            <h2>Simple launch pricing.</h2>
            <p>
              Manual Underwriting Report: <strong>$100/report</strong>
            </p>
            <p className="muted">
              Payment link: <code>{PAYMENT_LINK}</code>
            </p>
          </div>
          <div className="payment-note">
            <p>
              Request received. RSARBOS will review the submitted information. Please confirm this request with payment.
              Within 24 hours after payment confirmation, you will receive a private link from this email with your completed
              underwriting package.
            </p>
          </div>
        </section>

        <section className="site-section" id="request">
          <div className="section-intro">
            <p className="eyebrow">Request Underwriting</p>
            <h2>Submit a property for manual review.</h2>
            <p>
              This form opens a prepared email to <a href={`mailto:${REQUEST_EMAIL}`}>{REQUEST_EMAIL}</a>. Payment remains
              manual until the payment link is configured.
            </p>
          </div>
          <form className="request-form" onSubmit={submitRequest}>
            <label>
              Client name
              <input value={form.clientName} onChange={(event) => updateField('clientName', event.target.value)} required />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} required />
            </label>
            <label>
              Property address
              <input value={form.propertyAddress} onChange={(event) => updateField('propertyAddress', event.target.value)} required />
            </label>
            <label>
              Property URL
              <input type="url" value={form.propertyUrl} onChange={(event) => updateField('propertyUrl', event.target.value)} required />
            </label>
            <label>
              Investment intent
              <select value={form.investmentIntent} onChange={(event) => updateField('investmentIntent', event.target.value)} required>
                <option value="">Select intent</option>
                <option>Buy and hold</option>
                <option>Fix and flip</option>
                <option>Rental analysis</option>
                <option>Wholesale review</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Urgency level
              <select value={form.urgency} onChange={(event) => updateField('urgency', event.target.value)}>
                <option>Standard</option>
                <option>Urgent</option>
                <option>Deadline within 24 hours</option>
              </select>
            </label>
            <label className="full-field">
              Notes / questions
              <textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} rows={5}></textarea>
            </label>
            <button className="primary-action full-field" type="submit">
              Prepare request email
            </button>
          </form>
        </section>

        <section className="site-section split-section" id="samples">
          <div>
            <p className="eyebrow">Sample Reports</p>
            <h2>Launch-safe sample report outline.</h2>
            <p>
              Final public sample dossiers are not published yet. A sample report will demonstrate the property review,
              comparable analysis, ARV thesis, risk notes, pricing context, confidence summary, and final underwriting
              conclusion.
            </p>
          </div>
          <div className="sample-outline">
            {['Property facts', 'Comparable set', 'ARV thesis', 'Risk notes', 'Confidence summary', 'Final dossier'].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section className="site-section contact-section" id="contact">
          <p className="eyebrow">Contact</p>
          <h2>Send underwriting requests directly to RSARBOS.</h2>
          <p>
            Underwriting requests: <a href={`mailto:${REQUEST_EMAIL}`}>{REQUEST_EMAIL}</a>
          </p>
          <p>
            Intake support, if configured: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
        </section>
      </main>
    </div>
  )
}

function MissionControlGate() {
  const [password, setPassword] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(() => localStorage.getItem('mc_unlocked') === 'true')
  const [error, setError] = useState('')

  function unlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password === MISSION_CONTROL_PASSWORD) {
      localStorage.setItem('mc_unlocked', 'true')
      setIsUnlocked(true)
      setError('')
      return
    }

    setError('Password not accepted.')
  }

  if (isUnlocked) {
    return <MissionControlApp />
  }

  return (
    <main className="lock-shell">
      <section className="lock-panel">
        <p className="eyebrow">Private Operations</p>
        <h1>Mission Control</h1>
        <p>Internal founder operating system. Public visitors should use the RSARBOS underwriting website.</p>
        <form onSubmit={unlock}>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="lock-error">{error}</p>}
          <button className="primary-action" type="submit">
            Unlock
          </button>
        </form>
        <a href="/">Return to public site</a>
      </section>
    </main>
  )
}

function MissionControlApp() {
  const [activeTab, setActiveTab] = useState<string>(() => localStorage.getItem('mc_activeTab') || TABS[0].id)
  const [model, setModel] = useState<string>(() => localStorage.getItem('mc_model') || SYSTEM_STATE.modelAdapter || 'Codex')
  const [selectedAgent, setSelectedAgent] = useState<string>(() => localStorage.getItem('mc_axiom_agent') || 'AXIOM-GLOBAL')
  const [tasks, setTasks] = useState<FounderTask[]>(() => {
    try {
      const raw = localStorage.getItem('mc_founder_tasks')
      return raw ? JSON.parse(raw) : FOUNDER_TASKS
    } catch {
      return FOUNDER_TASKS
    }
  })
  const [commandHistory, setCommandHistory] = useState<Array<{ cmd: string; response: string; timestamp: number }>>(() => {
    try {
      const raw = localStorage.getItem('mc_command_history')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('mc_activeTab', activeTab)
  }, [activeTab])

  useEffect(() => {
    localStorage.setItem('mc_model', model)
  }, [model])

  useEffect(() => {
    localStorage.setItem('mc_axiom_agent', selectedAgent)
  }, [selectedAgent])

  useEffect(() => {
    localStorage.setItem('mc_founder_tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('mc_command_history', JSON.stringify(commandHistory))
  }, [commandHistory])

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: t.status === 'done' ? 'open' : 'done' } : t)))
  }

  function handleCommand(raw: string) {
    const command = raw.trim()
    const lc = command.toLowerCase()
    let response = ''

    if (lc === 'review tasks') {
      response = TABS.map((t) => `${t.title}: ${t.nextRecommendedTask}`).join('\n')
    } else if (lc === 'next task') {
      const tab = TABS.find((t) => t.id === activeTab)
      response = tab ? `${tab.title}: ${tab.nextRecommendedTask}` : 'No active tab selected.'
    } else if (lc === 'founder tasks') {
      const tabTasks = tasks.filter((t) => t.tab === activeTab)
      response = tabTasks.length > 0 ? tabTasks.map((t) => `- ${t.title} (${t.status})`).join('\n') : 'No founder tasks found for this tab.'
    } else if (lc === 'run audit') {
      const completedCount = tasks.filter((t) => t.status === 'done').length
      response = `Audit: ${completedCount}/${tasks.length} tasks complete. Command history contains ${commandHistory.length} entries.`
    } else if (lc === 'summarize state') {
      const tab = TABS.find((t) => t.id === activeTab)
      response = tab
        ? `${tab.title} — ${tab.currentState}. Next: ${tab.nextRecommendedTask}`
        : 'No active tab state available.'
    } else if (lc.startsWith('switch agent')) {
      const agent = command.split(' ').slice(2).join(' ')
      if (agent.toUpperCase().startsWith('AXIOM-')) {
        setSelectedAgent(agent.toUpperCase())
        response = `AXIOM agent set to ${agent.toUpperCase()}`
      } else {
        setModel(agent)
        response = `Model set to ${agent}`
      }
    } else if (lc.startsWith('create file')) {
      const path = command.split(' ').slice(2).join(' ')
      response = `Mock file created: ${path || '(no path provided)'}`
    } else if (lc.startsWith('update state')) {
      response = 'Mock state update recorded.'
    } else {
      response = `Unknown command: ${command}. Use review tasks, next task, founder tasks, run audit, summarize state, switch agent <name>, create file <path>, update state <key>=<value>.`
    }

    setCommandHistory((prev) => [...prev, { cmd: command, response, timestamp: Date.now() }])
    return response
  }

  const operationsDepartments = DEPARTMENTS.filter((dept) => ['operations', 'finance', 'support', 'legal'].includes(dept.id))
  const currentTab = TABS.find((t) => t.id === activeTab)

  return (
    <div className="mc-shell">
      <Header
        model={model}
        selectedAgent={selectedAgent}
        onModelChange={setModel}
        onCommand={handleCommand}
        system={SYSTEM_STATE}
      />
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      <main className="mc-main">
        <div className="main-column">
          <section className="card overview-card">
            <div className="overview-header">
              <div>
                <p className="eyebrow">Mission overview</p>
                <h2>{currentTab?.title}</h2>
                <p className="section-subtitle">Active operations for {currentTab?.title}</p>
              </div>
              <div className="overview-pill">STAGE: {currentTab?.currentState}</div>
            </div>
            <div className="overview-grid">
              <div className="status-panel">
                <p className="small-label">What is the mission?</p>
                <strong>{SYSTEM_STATE.mission}</strong>
              </div>
              <div className="status-panel">
                <p className="small-label">What is the bottleneck?</p>
                <strong>{SYSTEM_STATE.constraint}</strong>
              </div>
              <div className="status-panel">
                <p className="small-label">What should happen next?</p>
                <strong>{currentTab?.nextRecommendedTask}</strong>
              </div>
              {currentTab?.metrics &&
                Object.entries(currentTab.metrics).map(([key, value]) => (
                  <div className="status-panel" key={key}>
                    <p className="small-label">{key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</p>
                    <strong>
                      {typeof value === 'number' && key.includes('revenue') ? `$${value}` : value}
                      {typeof value === 'number' && key.includes('readiness') ? `${value}%` : ''}
                    </strong>
                  </div>
                ))}
            </div>
          </section>

          <div className="card section-card">
            <h3>Founder's task board</h3>
            <TaskBoard tasks={tasks.filter((t) => t.tab === activeTab)} onToggle={toggleTask} />
          </div>

          {activeTab === 'operations' && <OperationsSnapshot departments={operationsDepartments} />}

          {activeTab === 'website' && (
            <section className="website-readiness">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Website Readiness</p>
                  <h3>Staging verification checklist</h3>
                </div>
                <span className="readiness-score">{SYSTEM_STATE.readiness}</span>
              </div>
              <div className="readiness-checklist">
                {WEBSITE_READINESS_ITEMS.map((item) => (
                  <article className="readiness-check" key={item.label}>
                    <div>
                      <p className="small-label">{item.label}</p>
                      <strong>{item.value}</strong>
                    </div>
                    <span>{item.status}</span>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'axiom' && (
            <>
              <OrgMap />
              <DepartmentGrid departments={DEPARTMENTS} />
            </>
          )}

          {activeTab === 'dataroom' && (
            <section className="card section-card">
              <h3>Investor Data Room</h3>
              <p className="muted">This section is under construction. It will contain investor-ready documents, financial projections, and key metrics.</p>
              <p className="muted">Current state: {currentTab?.currentState}</p>
              <p className="muted">Next step: {currentTab?.nextRecommendedTask}</p>
            </section>
          )}
        </div>
        <aside className="side-column">
          <div className="card axiom-agent-card">
            <p className="eyebrow">Active AXIOM Agent</p>
            <h3>{selectedAgent}</h3>
            <p className="muted">Command layer for mission orchestration and departmental coordination.</p>
          </div>
          <CommandPane
            model={model}
            selectedAgent={selectedAgent}
            activeTab={activeTab}
            tasks={tasks}
            onModelChange={setModel}
            onSelectedAgentChange={setSelectedAgent}
            onCommand={handleCommand}
            history={commandHistory}
          />
          <SystemRuntime />
        </aside>
      </main>
    </div>
  )
}

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    function updatePath() {
      setPath(window.location.pathname)
    }

    window.addEventListener('popstate', updatePath)
    return () => window.removeEventListener('popstate', updatePath)
  }, [])

  if (path === '/mission-control') {
    return <MissionControlGate />
  }

  return <PublicWebsite />
}
