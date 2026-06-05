import React, { useEffect, useRef, useState } from 'react'
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
import rsarbosLogo from './assets/logo.png'

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
const DOSSIER_PREVIEW_URL = '/dossier/RSARBOS_Investment_Dossier_1314_Shawn_Dr.html'

const DELIVERABLES = [
  ['Property Review', 'Deep dive into physical characteristics and zoning constraints.', false],
  ['Comparable Analysis', 'Granular assessment of hyper-local recent sales and active competition.', false],
  ['ARV Thesis', 'Defensible After Repair Value projection based on market reality.', false],
  ['Risk Notes & Pricing Context', 'Identification of potential pitfalls and strategic entry pricing analysis.', true],
] as const

const PILLARS = [
  ['FIRST-TIME INVESTORS', 'key', 'Understand the numbers, risks, rent thesis, and next diligence steps before writing an offer.'],
  ['FLIPPERS & OPERATORS', 'hammer', 'Pressure-test ARV, rehab assumptions, comps, exit strategy, and deal-killing constraints.'],
  ['ACQUISITION TEAMS', 'target', 'Give sourcing teams a consistent decision layer for comparing opportunities quickly.'],
  ['CAPITAL PARTNERS', 'capital', 'Package property logic into a clean dossier that lenders, partners, and stakeholders can review.'],
] as const

function PublicWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const modalRef = useRef<HTMLDialogElement | null>(null)
  const [form, setForm] = useState({
    clientName: '',
    email: '',
    propertyAddress: '',
    propertyUrl: '',
    investmentIntent: '',
    urgency: 'standard',
    notes: '',
  })

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsProcessing(true)

    window.setTimeout(() => {
      setIsProcessing(false)
      setForm({
        clientName: '',
        email: '',
        propertyAddress: '',
        propertyUrl: '',
        investmentIntent: '',
        urgency: 'standard',
        notes: '',
      })
      modalRef.current?.showModal()
    }, 800)
  }

  function closeModalOnBackdrop(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === modalRef.current) {
      modalRef.current?.close()
    }
  }

  return (
    <div className="public-site">
      <div className="ambient-glow" aria-hidden="true"></div>
      <nav className="public-nav" aria-label="Primary navigation">
        <div className="nav-inner">
          <a className="logo-wordmark" href="#home" onClick={() => setIsMenuOpen(false)}>
            <img src={rsarbosLogo} alt="RSARBOS" />
          </a>
          <div className="desktop-menu">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href="#sample">Sample Reports</a>
            <a className="nav-cta" href="#request">REQUEST REPORT</a>
            <a href="/mission-control">Mission Control</a>
          </div>
          <button className="mobile-menu-button" type="button" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {isMenuOpen && (
          <div className="mobile-menu">
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <a href="#sample" onClick={() => setIsMenuOpen(false)}>Sample Reports</a>
            <a href="#request" onClick={() => setIsMenuOpen(false)}>Request Report</a>
            <a href="/mission-control">Mission Control</a>
          </div>
        )}
      </nav>

      <main>
        <section className="rs-hero" id="home">
          <div className="hero-content">
            <div className="hero-chip"><span></span>Building the New Era of Real Estate Tech</div>
            <h1>
              VALUATION. <span className="blue-glow">SIMPLIFIED.</span>
              <br />
              DECISIONS. <span className="red-glow">EMPOWERED.</span>
            </h1>
            <p>
              RSARBOS transforms complex property data into clear, decision-grade underwriting intelligence. Built for founders,
              investors, and institutions who demand truth first.
            </p>
            <div className="hero-actions centered">
              <a className="primary-action shine-action" href="#request">START UNDERWRITING</a>
              <a className="secondary-action glass-action" href="#services">VIEW DELIVERABLES</a>
            </div>
          </div>
          <div className="hero-lines" aria-hidden="true">
            <svg viewBox="0 0 1000 300" preserveAspectRatio="none">
              <path d="M0,150 C200,50 300,250 500,150 C700,50 800,250 1000,150" />
              <path className="red-line" d="M0,150 C250,250 350,50 500,150 C650,250 750,50 1000,150" />
            </svg>
          </div>
        </section>

        <section className="about-band" id="about">
          <div className="content-wrap">
            <div className="section-intro centered-copy">
              <h2>THE INTELLIGENCE LAYER</h2>
              <p>
                RSARBOS turns property information into decision leverage for first-time investors, flippers,
                acquisition teams, and any group that needs a clearer underwriting document before committing capital.
              </p>
            </div>
            <div className="pillar-grid">
              {PILLARS.map(([title, icon, copy]) => (
                <article className="glass-panel pillar-card" key={title}>
                  <div className="pillar-icon" aria-hidden="true">
                    {icon === 'key' && (
                      <svg viewBox="0 0 24 24">
                        <circle cx="8" cy="8" r="3.2" />
                        <path d="M10.4 10.4 21 21M15 15l2.6-2.6M17.5 17.5l2.4-2.4" />
                      </svg>
                    )}
                    {icon === 'hammer' && (
                      <svg viewBox="0 0 24 24">
                        <path d="M14 5 19 10M12 7l5 5M4 20l8.5-8.5M13 4l7 7-2 2-7-7z" />
                      </svg>
                    )}
                    {icon === 'target' && (
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="8" />
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                      </svg>
                    )}
                    {icon === 'capital' && (
                      <svg viewBox="0 0 24 24">
                        <path d="M4 19h16M6 19V9l6-4 6 4v10M9 19v-6M15 19v-6M5 9h14" />
                      </svg>
                    )}
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="content-wrap split-feature">
            <div>
              <p className="red-kicker"><span></span>Deliverables</p>
              <h2>MANUAL UNDERWRITING</h2>
              <p>
                We don't just aggregate data; we synthesize it. Our manual underwriting process provides a comprehensive
                dossier designed to give you absolute confidence in your real estate investment decisions.
              </p>
              <ul className="deliverable-list">
                {DELIVERABLES.map(([title, copy, alert]) => (
                  <li key={title}>
                    <span className={alert ? 'alert-check' : 'check-icon'}>{alert ? '!' : '✓'}</span>
                    <div>
                      <strong>{title}</strong>
                      <span>{copy}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="dossier-preview glass-panel">
              <div className="browser-bar"><i></i><i></i><i></i><span>RSARBOS_DOSSIER_V1.2</span></div>
              <div className="dashboard-mock">
                <div className="score-row">
                  <div><span>DEAL CONFIDENCE SCORE</span><strong className="score">97.6<small>%</small></strong></div>
                  <div><span>PROJECTED ARV</span><strong>$1.24M</strong></div>
                </div>
                <div className="mock-graph">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline points="0,80 20,70 40,85 60,40 80,50 100,20" />
                    <circle cx="100" cy="20" r="3" />
                  </svg>
                  <div></div>
                </div>
                <span className="mock-line short"></span>
                <span className="mock-line"></span>
                <span className="mock-line medium"></span>
              </div>
            </div>
          </div>
        </section>

        <div className="content-wrap"><div className="section-divider"></div></div>

        <section className="core-section">
          <div className="content-wrap core-grid">
            <div>
              <p className="red-kicker"><span></span>The Underwriting Core</p>
              <h2>HUMAN-VERIFIED NOW. AUTOMATED NEXT.</h2>
              <p>
                RSARBOS is delivering analyst-led underwriting reports now while building the automated underwriting core
                behind the platform. Each manual report validates the scoring logic, risk checks, comp standards, and decision
                framework that will power automation.
              </p>
            </div>
            <div className="core-steps">
              <article className="glass-panel"><span>01</span><strong>Manual Reports</strong><p>Human-reviewed property dossiers delivered today.</p></article>
              <article className="glass-panel"><span>02</span><strong>Logic Validation</strong><p>Every report sharpens our scoring, risk, comps, and ARV framework.</p></article>
              <article className="glass-panel"><span>03</span><strong>Automated Core</strong><p>The validated framework becomes the automated underwriting engine.</p></article>
            </div>
          </div>
        </section>

        <section className="sample-section" id="sample">
          <div className="content-wrap sample-grid">
            <div className="pricing-column" id="pricing">
              <p className="red-kicker"><span></span>Launch Offer</p>
              <h2>CLEAR PRICING</h2>
              <p>No hidden fees. Flat rate intelligence for actionable decisions.</p>
              <article className="pricing-card glass-panel">
                <div className="pricing-rule"></div>
                <h3>MANUAL UNDERWRITING</h3>
                <p className="price">$100 <span>/ report</span></p>
                <ul>
                  <li>Complete Final Underwriting Dossier</li>
                  <li>Deal Confidence Summary</li>
                  <li>Delivered within 24 hours of payment</li>
                  <li>Secure private delivery link</li>
                </ul>
                <a className="primary-action red-action" href="#request">INITIATE REQUEST</a>
              </article>
            </div>
            <div className="mobile-dossier-frame" aria-label="Mobile preview of RSARBOS investment dossier">
              <div className="phone-speaker" aria-hidden="true"></div>
              <iframe src={DOSSIER_PREVIEW_URL} title="RSARBOS Investment Dossier mobile preview" loading="lazy"></iframe>
            </div>
          </div>
        </section>

        <section className="request-section" id="request">
          <div className="form-wrap">
            <div className="section-intro centered-copy">
              <h2>REQUEST UNDERWRITING</h2>
              <p>Submit your property details to intake. Our analysts will begin formulation.</p>
            </div>
            <form className="neo-form glass-panel" onSubmit={submitRequest}>
              <label>CLIENT NAME *<input value={form.clientName} onChange={(event) => updateField('clientName', event.target.value)} placeholder="Jane Doe / Acme Corp" required /></label>
              <label>EMAIL ADDRESS *<input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="jane@example.com" required /></label>
              <label className="full-field">PROPERTY ADDRESS *<input value={form.propertyAddress} onChange={(event) => updateField('propertyAddress', event.target.value)} placeholder="1234 Main St, City, State, ZIP" required /></label>
              <label className="full-field">PROPERTY URL (Zillow, Redfin, MLS, etc.) *<input type="url" value={form.propertyUrl} onChange={(event) => updateField('propertyUrl', event.target.value)} placeholder="https://..." required /></label>
              <label>
                INVESTMENT INTENT *
                <select value={form.investmentIntent} onChange={(event) => updateField('investmentIntent', event.target.value)} required>
                  <option value="" disabled>Select strategy...</option>
                  <option value="fix_flip">Fix & Flip</option>
                  <option value="buy_hold">Buy & Hold (Rental)</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="brrrr">BRRRR</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                URGENCY LEVEL
                <select value={form.urgency} onChange={(event) => updateField('urgency', event.target.value)}>
                  <option value="standard">Standard (24hr post-payment)</option>
                  <option value="high">High (Offer pending)</option>
                </select>
              </label>
              <label className="full-field">NOTES / SPECIFIC QUESTIONS<textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} rows={3} placeholder="Any specific concerns regarding zoning, rehab scope, or market conditions?"></textarea></label>
              <button className="primary-action shine-action full-field" type="submit" disabled={isProcessing}>
                {isProcessing ? 'PROCESSING...' : 'SUBMIT TO INTAKE QUEUE'}
              </button>
            </form>
          </div>
        </section>

        <dialog className="payment-modal" ref={modalRef} onClick={closeModalOnBackdrop}>
          <div className="modal-panel glass-panel">
            <button className="modal-close" type="button" onClick={() => modalRef.current?.close()} aria-label="Close payment confirmation">×</button>
            <div className="modal-icon">✓</div>
            <h3>REQUEST RECEIVED</h3>
            <div className="modal-copy">
              <p>Your property details have been prepared for intake.</p>
              <p><strong>Payment confirmation is required to begin the manual underwriting report.</strong></p>
              <p>Once payment is confirmed, RSARBOS begins review and delivers the completed package by private link.</p>
            </div>
            <button className="primary-action light-action" type="button" onClick={() => window.alert(`Proceeding to payment gateway...\n\nPlaceholder: ${PAYMENT_LINK}`)}>
              PROCEED TO SECURE PAYMENT
            </button>
            <p className="payment-placeholder">{PAYMENT_LINK}</p>
          </div>
        </dialog>
      </main>

      <footer className="public-footer">
        <div className="content-wrap">
          <div className="footer-top">
            <div>
              <a className="logo-wordmark footer-logo" href="#home"><img src={rsarbosLogo} alt="RSARBOS" /></a>
              <p>BUILDING THE INTELLIGENCE LAYER FOR THE NEXT ECONOMY.</p>
            </div>
            <div className="footer-contact">
              <div><span>CONTACT / INTAKE:</span><a href={`mailto:${REQUEST_EMAIL}`}>{REQUEST_EMAIL}</a></div>
              <div><span>SUPPORT:</span><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 RSARBOS Next-Gen Business Technology. All rights reserved.</p>
            <div><span>SYSTEM: ONLINE</span><span className="online-dot">■</span></div>
          </div>
        </div>
      </footer>
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
