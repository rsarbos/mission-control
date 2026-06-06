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
import ManualReportForm from './components/ManualReportForm'
import rsarbosLogo from './assets/logo.png'
import { trackEvent } from './utils/analytics'

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

const MISSION_CONTROL_PASSWORD = import.meta.env.VITE_MISSION_CONTROL_PASSWORD || 'rsarbos-founder'
const DOSSIER_PREVIEW_URL = '/dossier/RSARBOS_Investment_Dossier_1314_Shawn_Dr.html'

const AUDIENCE_BANNER_ITEMS = [
  'INVESTORS',
  'FLIPPERS',
  'OPERATORS',
  'WHOLESALERS',
  'AGENTS',
  'ACQUISITION TEAMS',
  'CAPITAL PARTNERS',
  'DEAL SPONSORS',
  'BUYER REPS',
  'LENDERS',
] as const

function PublicWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoLeftClicks, setLogoLeftClicks] = useState(0)
  const audienceBannerItems = ['BUILT FOR:', ...AUDIENCE_BANNER_ITEMS, 'BUILT FOR:', ...AUDIENCE_BANNER_ITEMS]

  function handleLogoClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    setIsMenuOpen(false)
    setLogoLeftClicks((count) => Math.min(count + 1, 3))
    window.location.hash = 'home'
  }

  function handleLogoContextMenu(event: React.MouseEvent<HTMLAnchorElement>) {
    if (logoLeftClicks >= 3) {
      event.preventDefault()
      window.location.assign('/mission-control')
    }
  }

  return (
    <div className="public-site">
      <div className="ambient-glow" aria-hidden="true"></div>
      <nav className="public-nav" aria-label="Primary navigation">
        <div className="nav-inner">
          <a className="logo-wordmark" href="#home" onClick={handleLogoClick} onContextMenu={handleLogoContextMenu}>
            <img src={rsarbosLogo} alt="RSARBOS" />
          </a>
          <div className="desktop-menu">
            <a className="nav-cta" href="#request">REQUEST REPORT</a>
            <a className="nav-contact" href="/contact">CONTACT</a>
          </div>
          <button className="mobile-menu-button" type="button" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {isMenuOpen && (
          <div className="mobile-menu">
            <a href="#request" onClick={() => setIsMenuOpen(false)}>Request Report</a>
            <a href="/contact">Contact</a>
          </div>
        )}
      </nav>

      <main>
        <section className="rs-hero" id="home">
          <div className="hero-content">
            <div className="hero-chip"><span></span>Building the New Era of Real Estate Tech</div>
            <h1>
              <span className="hero-title-line">FROM PROPERTY LINK</span>
              <br />
              <span className="red-glow">TO DECISION-READY DOSSIER.</span>
            </h1>
            <div className="source-flow" aria-label="Supported property link sources">
              <span>Zillow</span>
              <span>Redfin</span>
              <span>Realtor.com</span>
              <span>Homes.com</span>
              <span>MLS</span>
              <strong>RSARBOS Dossier</strong>
            </div>
            <p className="hero-subtitle">
              A decision-ready underwriting dossier anyone can read — built to make the numbers, risks, and next move obvious.
            </p>
            <div className="hero-actions centered">
              <a className="primary-action shine-action" href="#request" onClick={() => trackEvent('hero_cta_click', { cta: 'start_underwriting' })}>START UNDERWRITING</a>
              <a className="secondary-action glass-action" href="/contact" onClick={() => trackEvent('hero_cta_click', { cta: 'contact' })}>CONTACT</a>
            </div>
          </div>
          <div className="hero-lines" aria-hidden="true">
            <svg viewBox="0 0 1000 300" preserveAspectRatio="none">
              <path d="M0,150 C200,50 300,250 500,150 C700,50 800,250 1000,150" />
              <path className="red-line" d="M0,150 C250,250 350,50 500,150 C650,250 750,50 1000,150" />
            </svg>
          </div>
        </section>

        <section className="audience-banner" id="built-for" aria-label="Audience segments RSARBOS supports">
          <div className="audience-banner-track">
            {audienceBannerItems.map((title, index) => (
              <span className={title === 'BUILT FOR:' ? 'audience-banner-label' : undefined} key={`${title}-${index}`}>
                {title}
              </span>
            ))}
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

        <section className="request-section request-section-early" id="request">
          <div className="form-wrap">
            <div className="section-intro centered-copy">
              <h2>REQUEST UNDERWRITING</h2>
              <p>Submit the property link and context. Your request is saved before checkout, then Stripe handles secure payment.</p>
            </div>
            <ManualReportForm />
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

      </main>

      <footer className="public-footer">
        <div className="content-wrap">
          <div className="footer-top">
            <a className="logo-wordmark footer-logo" href="#home" onClick={handleLogoClick} onContextMenu={handleLogoContextMenu}><img src={rsarbosLogo} alt="RSARBOS" /></a>
            <p>BUILDING THE INTELLIGENCE LAYER FOR THE NEXT ECONOMY.</p>
          </div>
          <div className="footer-bottom">
            <p>© 2026 RSARBOS Next-Gen Business Technology. All rights reserved.</p>
            <div className="footer-links">
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
              <a href="/refund-policy">Refunds</a>
              <a href="/contact">Contact</a>
              <span>SYSTEM: ONLINE</span>
              <span className="online-dot">■</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PaymentSuccessPage() {
  useEffect(() => {
    trackEvent('checkout_success_page_view')
  }, [])

  return (
    <main className="payment-result-shell">
      <section className="payment-result-panel glass-panel">
        <div className="modal-icon">✓</div>
        <p className="red-kicker"><span></span>Payment Received</p>
        <h1>RSARBOS received your underwriting request.</h1>
        <p>
          Your payment confirmation is being processed by Stripe. Once confirmed, RSARBOS will review your submitted property
          details and deliver the completed manual underwriting report privately by email.
        </p>
        <a className="primary-action red-action" href="/">
          Return Home
        </a>
      </section>
    </main>
  )
}

function PaymentCancelPage() {
  useEffect(() => {
    trackEvent('checkout_cancel_page_view')
  }, [])

  return (
    <main className="payment-result-shell">
      <section className="payment-result-panel glass-panel">
        <p className="red-kicker"><span></span>Checkout Not Completed</p>
        <h1>Your request was saved, but payment was not completed.</h1>
        <p>
          RSARBOS keeps pending requests so we can help customers recover abandoned checkouts or complete payment manually.
          You can return to the request form whenever you are ready.
        </p>
        <a className="primary-action red-action" href="/#request">
          Return To Request Form
        </a>
      </section>
    </main>
  )
}

function LegalPage({ type }: { type: 'terms' | 'privacy' | 'refund' }) {
  const content = {
    terms: {
      eyebrow: 'Terms',
      title: 'Terms of Service',
      sections: [
        ['Manual service', 'RSARBOS provides manual underwriting reports for decision support. Reports are prepared from submitted property information, public data, third-party sources, and analyst review.'],
        ['No professional advice', 'Reports are not legal, tax, financial, appraisal, inspection, or lending advice. Customers should verify all assumptions with qualified professionals before committing capital.'],
        ['Customer responsibility', 'Customers are responsible for submitting accurate property links, context, and questions. Incomplete or incorrect information can affect report quality and turnaround time.'],
        ['Delivery', 'Completed reports are delivered privately by email or private link after payment confirmation and review.'],
      ],
    },
    privacy: {
      eyebrow: 'Privacy',
      title: 'Privacy Policy',
      sections: [
        ['Information collected', 'RSARBOS collects submitted contact details, property details, links, notes, payment status, and operational metadata needed to complete underwriting requests.'],
        ['How information is used', 'Information is used to process payment, prepare the report, contact the customer, recover abandoned checkouts, and improve underwriting workflows.'],
        ['Service providers', 'RSARBOS may use providers such as Stripe, Neon, Resend, hosting providers, and analytics tools to operate the service.'],
        ['Data requests', 'Customers may contact RSARBOS to request corrections or deletion where legally and operationally possible.'],
      ],
    },
    refund: {
      eyebrow: 'Payments',
      title: 'Payment & Refund Policy',
      sections: [
        ['Payment timing', 'Payment is required before RSARBOS begins the manual underwriting report.'],
        ['Manual work', 'Because each report involves analyst review and custom work, refunds may be limited once work has started.'],
        ['Failed or abandoned checkout', 'If checkout is canceled or abandoned, the request remains pending and unpaid so RSARBOS can help complete payment if needed.'],
        ['Support', 'For payment questions, contact RSARBOS support with the email used on the request.'],
      ],
    },
  }[type]

  return (
    <main className="legal-shell">
      <section className="legal-panel glass-panel">
        <p className="red-kicker"><span></span>{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="legal-updated">Starter policy for launch readiness. Review before public marketing.</p>
        <div className="legal-sections">
          {content.sections.map(([heading, copy]) => (
            <article key={heading}>
              <h2>{heading}</h2>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <a className="primary-action red-action" href="/">Return Home</a>
      </section>
    </main>
  )
}

const INITIAL_CONTACT_FORM = {
  type: 'contact',
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

function ContactPage() {
  const [form, setForm] = useState(INITIAL_CONTACT_FORM)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSending(true)
    setStatus('')
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Unable to send message.')
      }

      setStatus('Message sent. RSARBOS will reply by email.')
      setForm(INITIAL_CONTACT_FORM)
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Unable to send message.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="contact-shell">
      <section className="contact-panel glass-panel">
        <div className="contact-copy">
          <a className="logo-wordmark contact-logo" href="/"><img src={rsarbosLogo} alt="RSARBOS" /></a>
          <p className="red-kicker"><span></span>Contact</p>
          <h1>Talk to RSARBOS.</h1>
          <p>
            Use this page for general questions, report help, payment support, or delivery follow-up. The message routes
            directly to the RSARBOS support inbox.
          </p>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          <label>
            MESSAGE TYPE
            <select value={form.type} onChange={(event) => updateField('type', event.target.value)}>
              <option value="contact">General contact</option>
              <option value="support">Support request</option>
            </select>
          </label>
          <label>
            NAME *
            <input value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
          </label>
          <label>
            EMAIL *
            <input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} required />
          </label>
          <label>
            PHONE
            <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
          </label>
          <label className="full-field">
            SUBJECT *
            <input value={form.subject} onChange={(event) => updateField('subject', event.target.value)} required />
          </label>
          <label className="full-field">
            MESSAGE *
            <textarea value={form.message} onChange={(event) => updateField('message', event.target.value)} rows={5} required />
          </label>
          {status && <p className="form-success full-field">{status}</p>}
          {error && <p className="form-error full-field">{error}</p>}
          <button className="primary-action red-action full-field" type="submit" disabled={isSending}>
            {isSending ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
        </form>
      </section>
    </main>
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

  if (path === '/payment-success') {
    return <PaymentSuccessPage />
  }

  if (path === '/payment-cancel') {
    return <PaymentCancelPage />
  }

  if (path === '/terms') {
    return <LegalPage type="terms" />
  }

  if (path === '/privacy') {
    return <LegalPage type="privacy" />
  }

  if (path === '/refund-policy') {
    return <LegalPage type="refund" />
  }

  if (path === '/contact') {
    return <ContactPage />
  }

  return <PublicWebsite />
}
