import React, { useEffect, useState } from 'react'
import ManualReportForm from './components/ManualReportForm'
import rsarbosLogo from './assets/logo.png'
import { trackEvent } from './utils/analytics'

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

type ChannelTag = 'YouTube Creator' | 'BiggerPockets' | 'FB Wholesaler' | 'InvestorLift' | 'Privy'

type OutreachContact = {
  uuid: string
  name: string
  company: string
  channelTag: ChannelTag
  phone: string
  email: string
  socialHandle: string
  socialUrl: string
}

type VerdictStatus = 'WORTH_PURSUING' | 'WALKAWAY' | 'REVIEW_REQUIRED'

type UnderwrittenAsset = {
  uuid: string
  address: string
  sourcedByContactUuid: string
  listPrice: number
  yearBuilt: number
  squareFeet: number
  maximumAllowableOffer: number
  rentcastDiscrepancyFlag: string
  verdictStatus: VerdictStatus
  compileStatus: string
  paymentStatus: 'PAID' | 'PENDING' | 'UNPAID'
  assetRiskRegister: string[]
}

type OutreachTemplate = {
  id: string
  title: string
  target: string
  body: string
}

type DailyChecklistItem = {
  id: string
  label: string
}

type AdminTab = 'pipeline' | 'content'

type ContextMode = 'ghost' | 'codex'

type TerminalMessage = {
  id: string
  timestamp: string
  mode: ContextMode
  text: string
}

const VALIDATION_TARGET = 3

const OUTREACH_CONTACTS: OutreachContact[] = [
  {
    uuid: 'contact-yt-acq-001',
    name: 'Acquisition Lead',
    company: 'YouTube Fund Operator',
    channelTag: 'YouTube Creator',
    phone: '+15550101001',
    email: 'acquisitions@example.com',
    socialHandle: '@fundoperator',
    socialUrl: 'https://www.youtube.com/',
  },
  {
    uuid: 'contact-bp-analyst-002',
    name: 'First-Time Investor',
    company: 'BiggerPockets Lead Analysis',
    channelTag: 'BiggerPockets',
    phone: '+15550101002',
    email: 'bp.investor@example.com',
    socialHandle: 'BP profile',
    socialUrl: 'https://www.biggerpockets.com/',
  },
  {
    uuid: 'contact-wholesale-003',
    name: 'High-Volume Wholesaler',
    company: 'InvestorLift / Privy Network',
    channelTag: 'InvestorLift',
    phone: '+15550101003',
    email: 'deals@example.com',
    socialHandle: '@dealflowdesk',
    socialUrl: 'https://www.investorlift.com/',
  },
]

const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    id: 'deal-filter',
    title: 'Deal Filter Angle',
    target: 'YouTube funds / acquisition leads',
    body:
      'I built a compact underwriting dossier that pressure-tests the rent story, comps, MAO, and walkaway risks before your team spends time on the deal. Send me one property link and I will return a decision-ready verdict your acquisition team can audit.',
  },
  {
    id: 'first-timer',
    title: 'Nervous First-Timer Safeguard',
    target: 'BiggerPockets lead analysis forums',
    body:
      'Before you submit an offer, I can turn the listing into a plain-English underwriting verdict: what works, what breaks, what rent assumptions are risky, and what questions to ask before money moves.',
  },
  {
    id: 'wholesaler',
    title: 'Lazy High-Volume Wholesaler Pipeline',
    target: 'InvestorLift / Privy communities',
    body:
      'If your buyer list is asking for cleaner numbers, send the property link and I will package the rent reality, risk register, MAO, and verdict into a shareable dossier. It gives serious buyers a faster reason to reply.',
  },
]

const UNDERWRITTEN_ASSETS: UnderwrittenAsset[] = [
  {
    uuid: 'asset-1314-shawn-dr',
    address: '1314 Shawn Dr #1, San Jose, CA 95118',
    sourcedByContactUuid: 'contact-wholesale-003',
    listPrice: 500000,
    yearBuilt: 1970,
    squareFeet: 810,
    maximumAllowableOffer: 455000,
    rentcastDiscrepancyFlag: '$4,410 headline rent vs $2,900 closest 2BD/1BA comp',
    verdictStatus: 'REVIEW_REQUIRED',
    compileStatus: 'Manual dossier compiled - rent thesis needs verification',
    paymentStatus: 'PAID',
    assetRiskRegister: [
      'HOA fee materially affects monthly cash flow.',
      'RentCast attributes require manual 2BD/1BA comp validation.',
      '1970 systems inspection required before offer confidence.',
    ],
  },
  {
    uuid: 'asset-seed-002',
    address: 'Inbound property link pending',
    sourcedByContactUuid: 'contact-yt-acq-001',
    listPrice: 0,
    yearBuilt: 0,
    squareFeet: 0,
    maximumAllowableOffer: 0,
    rentcastDiscrepancyFlag: 'Awaiting listing and rent source comparison',
    verdictStatus: 'REVIEW_REQUIRED',
    compileStatus: 'Intake slot open',
    paymentStatus: 'PENDING',
    assetRiskRegister: ['Asset data not hydrated.', 'Comp set not assigned.', 'Risk register awaiting first pass.'],
  },
]

const VIDEO_TEMPLATE: DailyChecklistItem[] = [
  { id: 'video-hook', label: '0:00-0:30 | The Hook (Contrast listing price vs. RentCast discrepancy)' },
  { id: 'video-discovery', label: '0:30-2:00 | The Discovery (Screen recording Redfin days-on-market filter)' },
  { id: 'video-engine-input', label: '2:00-4:00 | The Engine Input (Populate deterministic data fields)' },
  { id: 'video-dossier-deep-dive', label: '4:00-6:30 | The Dossier Deep-Dive (Highlight Risk Register & Walkaway Triggers)' },
  { id: 'video-execution-verdict', label: '6:30-9:30 | The Execution Verdict & Conversion CTA' },
]

const DAILY_CHECKLIST: DailyChecklistItem[] = [
  { id: 'record-screen-walkthrough', label: 'Record Screen Walkthrough' },
  { id: 'export-final-pdf', label: 'Export Validated PDF Dossier' },
  { id: 'distribute-wholesaler-network', label: 'Distribute to Active Partner List' },
  { id: 'post-daily-video', label: 'Push Daily Video Clip' },
]

const GHOST_HELPERS = ['Outreach scripts', 'Value proposition frameworks', 'Closing scripts']
const CODEX_HELPERS = ['Strict JSON intake schemas', 'Neon Postgres table mapping', 'NATS transport event contracts']

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
            <a className="nav-sample" href="#sample">VIEW SAMPLE DOSSIER</a>
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
            <a href="#sample" onClick={() => setIsMenuOpen(false)}>View Sample Dossier</a>
            <a href="/contact">Contact</a>
          </div>
        )}
      </nav>

      <main>
        <section className="rs-hero" id="home">
          <div className="hero-content">
            <div className="hero-chip"><span></span>Building the New Era of Real Estate Tech</div>
            <h1>
              <span className="hero-title-line">TURNING COMPLEX DATA</span>
              <span className="hero-title-line">INTO CONCLUSIONS</span>
              <span className="hero-title-line red-glow">100% AUDITABLE.</span>
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
              Clear property verdicts backed by traceable numbers, risks, and next steps.
            </p>
            <div className="hero-actions centered">
              <a className="primary-action shine-action" href="#request" onClick={() => trackEvent('hero_cta_click', { cta: 'start_underwriting' })}>START UNDERWRITING</a>
              <a className="secondary-action glass-action" href="#sample" onClick={() => trackEvent('hero_cta_click', { cta: 'view_sample_dossier' })}>VIEW SAMPLE DOSSIER</a>
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
            <div className="sample-preview-column">
              <div className="sample-preview-copy">
                <p className="red-kicker"><span></span>Example Report</p>
                <h2>SAMPLE DOSSIER</h2>
                <p>See the exact decision format before you request underwriting.</p>
              </div>
              <div className="mobile-dossier-frame" aria-label="Mobile preview of RSARBOS investment dossier">
                <div className="phone-speaker" aria-hidden="true"></div>
                <iframe src={DOSSIER_PREVIEW_URL} title="RSARBOS Investment Dossier mobile preview" loading="lazy"></iframe>
              </div>
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

        <section className="core-section verdict-section">
          <div className="content-wrap core-grid">
            <div>
              <p className="red-kicker"><span></span>Workflow</p>
              <h2>HOW RSARBOS BUILDS A PROPERTY VERDICT</h2>
              <p>
                Behind every RSARBOS verdict is a repeatable underwriting workflow: clean intake, rule-based review, and a
                traceable investor conclusion.
              </p>
            </div>
            <div className="core-steps">
              <article className="glass-panel"><span>01</span><strong>Property Intake</strong><p>We organize the listing, comps, price history, condition notes, repair assumptions, rent potential, and market context into one clean underwriting picture.</p></article>
              <article className="glass-panel"><span>02</span><strong>Underwriting Logic</strong><p>We review the opportunity through consistent financial rules that separate real upside from presentation noise.</p></article>
              <article className="glass-panel"><span>03</span><strong>Investor Verdict</strong><p>We deliver a clear buy / pass / watch recommendation with the reasoning behind it, so investors can act with confidence.</p></article>
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
              <span className="footer-status-pill"><span className="online-dot">■</span>SYSTEM: ONLINE</span>
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
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('pipeline')
  const [contextMode, setContextMode] = useState<ContextMode>('ghost')
  const [selectedContact, setSelectedContact] = useState<OutreachContact | null>(null)
  const [selectedAssetUuid, setSelectedAssetUuid] = useState<string>(UNDERWRITTEN_ASSETS[0]?.uuid || '')
  const [copiedTemplateId, setCopiedTemplateId] = useState<string>('')
  const [selectedHelper, setSelectedHelper] = useState<string>(GHOST_HELPERS[0])
  const [terminalInput, setTerminalInput] = useState('')
  const [contextCopied, setContextCopied] = useState(false)
  const [terminalMessages, setTerminalMessages] = useState<TerminalMessage[]>([
    {
      id: 'boot',
      timestamp: formatUtcTimestamp(),
      mode: 'ghost',
      text: 'Context terminal ready. Select persona, asset row, and helper pack before copying payload.',
    },
  ])
  const [completedChecklist, setCompletedChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('mc_daily_content_checklist')
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem('mc_daily_content_checklist', JSON.stringify(completedChecklist))
  }, [completedChecklist])

  const paidDossierCount = UNDERWRITTEN_ASSETS.filter((asset) => asset.paymentStatus === 'PAID').length
  const bridgeProgress = Math.min((paidDossierCount / VALIDATION_TARGET) * 100, 100)
  const selectedContactAssets = selectedContact
    ? UNDERWRITTEN_ASSETS.filter((asset) => asset.sourcedByContactUuid === selectedContact.uuid)
    : []
  const selectedAsset = UNDERWRITTEN_ASSETS.find((asset) => asset.uuid === selectedAssetUuid) || UNDERWRITTEN_ASSETS[0]
  const selectedAssetContact = selectedAsset
    ? OUTREACH_CONTACTS.find((contact) => contact.uuid === selectedAsset.sourcedByContactUuid)
    : undefined
  const contextHelpers = contextMode === 'ghost' ? GHOST_HELPERS : CODEX_HELPERS
  const contextBadge = contextMode === 'ghost' ? '[MODE: OPERATIONAL STRATEGY]' : '[MODE: SYSTEM INFRASTRUCTURE]'

  function toggleChecklistItem(id: string) {
    setCompletedChecklist((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function setMode(mode: ContextMode) {
    setContextMode(mode)
    setSelectedHelper(mode === 'ghost' ? GHOST_HELPERS[0] : CODEX_HELPERS[0])
  }

  async function copyTemplate(template: OutreachTemplate) {
    const payload = selectedContact
      ? `${selectedContact.name} / ${selectedContact.company}\n\n${template.body}`
      : template.body

    try {
      await navigator.clipboard.writeText(payload)
      setCopiedTemplateId(template.id)
    } catch {
      setCopiedTemplateId('')
    }
  }

  function submitTerminalMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = terminalInput.trim()
    if (!text) return

    setTerminalMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        timestamp: formatUtcTimestamp(),
        mode: contextMode,
        text,
      },
    ])
    setTerminalInput('')
  }

  async function copyContextPayload() {
    const payload = [
      'RSARBOS MISSION CONTROL CONTEXT PAYLOAD',
      `mode=${contextMode.toUpperCase()}`,
      `mode_badge=${contextBadge}`,
      `helper_pack=${selectedHelper}`,
      `validation_progress=${paidDossierCount}/${VALIDATION_TARGET} paid dossiers`,
      selectedAsset ? `asset_uuid=${selectedAsset.uuid}` : 'asset_uuid=none',
      selectedAsset ? `property_address=${selectedAsset.address}` : 'property_address=none',
      selectedAsset ? `verdict_status=${selectedAsset.verdictStatus}` : 'verdict_status=none',
      selectedAsset ? `rental_thesis_delta=${selectedAsset.rentcastDiscrepancyFlag}` : 'rental_thesis_delta=none',
      selectedAsset ? `mao=${selectedAsset.maximumAllowableOffer}` : 'mao=none',
      selectedAssetContact ? `source_contact_uuid=${selectedAssetContact.uuid}` : 'source_contact_uuid=none',
      selectedAssetContact ? `source_contact=${selectedAssetContact.name} / ${selectedAssetContact.company}` : 'source_contact=none',
      `latest_prompt=${terminalInput || terminalMessages[terminalMessages.length - 1]?.text || 'none'}`,
      'phase_boundary=Revenue execution only. Core backend paused at Phase 2AH.',
    ].join('\n')

    await navigator.clipboard.writeText(payload)
    setContextCopied(true)
    window.setTimeout(() => setContextCopied(false), 1800)
  }

  return (
    <div className="mc-admin-shell">
      <header className="mc-admin-header">
        <a className="mc-admin-logo" href="/">
          <img src={rsarbosLogo} alt="RSARBOS" />
        </a>
        <div>
          <p className="mc-admin-kicker">Phase 4 Validation Bridge</p>
          <h1>RSARBOS Mission Control</h1>
          <p>Internal revenue execution dashboard for the first three manual customer acquisition runs.</p>
        </div>
        <div className="mc-admin-status">
          <span className="mc-live-dot" aria-hidden="true"></span>
          SYSTEM ONLINE
        </div>
      </header>

      <main className="mc-admin-grid">
        <section className="mc-ops-zone">
          <div className="mc-admin-tabs" role="tablist" aria-label="Mission Control modules">
            <button type="button" className={activeAdminTab === 'pipeline' ? 'active' : ''} onClick={() => setActiveAdminTab('pipeline')}>
              Validation Bridge
            </button>
            <button type="button" className={activeAdminTab === 'content' ? 'active' : ''} onClick={() => setActiveAdminTab('content')}>
              Content Desk
            </button>
          </div>

          {activeAdminTab === 'pipeline' && (
            <>
              <section className="mc-admin-card bridge-card">
                <div className="bridge-marquee">SYSTEM STATUS: REVENUE EXECUTION MODE -- IMMUTABLE ENGINE PAUSED AT PHASE 2AH</div>
                <div className="bridge-metrics">
                  <article>
                    <p>Validation Bridge Progress</p>
                    <strong>Current: {paidDossierCount} / Target: {VALIDATION_TARGET} Paid Dossiers</strong>
                    <div className="bridge-meter" aria-label={`Validation bridge progress ${paidDossierCount} of ${VALIDATION_TARGET}`}>
                      <span style={{ width: `${bridgeProgress}%` }}></span>
                    </div>
                  </article>
                  <article>
                    <p>Mode</p>
                    <strong>Revenue Execution</strong>
                    <span className="status-tag status-green">ACTIVE PIPELINE</span>
                  </article>
                  <article>
                    <p>Boundary</p>
                    <strong>Backend held at Phase 2AH</strong>
                    <span className="status-tag status-red">NO CORE MUTATION</span>
                  </article>
                </div>
              </section>

              <section className="mc-admin-card contacts-card">
                <div className="mc-section-head">
                  <div>
                    <p className="mc-admin-kicker">Relational Database A</p>
                    <h2>Contacts Directory</h2>
                  </div>
                  <span>Native action links enabled</span>
                </div>
                <div className="mc-table-wrap">
                  <table className="mc-table">
                    <thead>
                      <tr>
                        <th>Contact Name</th>
                        <th>Organization / Firm</th>
                        <th>Source Tag</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Social</th>
                        <th>Scripts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OUTREACH_CONTACTS.map((contact) => (
                        <tr key={contact.uuid}>
                          <td>
                            <strong>{contact.name}</strong>
                            <span>{contact.uuid}</span>
                          </td>
                          <td>{contact.company}</td>
                          <td><span className="channel-tag">{contact.channelTag}</span></td>
                          <td><a href={`tel:${contact.phone}`}>{contact.phone}</a></td>
                          <td><a href={`mailto:${contact.email}`}>{contact.email}</a></td>
                          <td><a href={contact.socialUrl} target="_blank" rel="noreferrer">{contact.socialHandle}</a></td>
                          <td>
                            <button className="mc-mini-action" type="button" onClick={() => setSelectedContact(contact)}>
                              Open
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mc-admin-card assets-card">
                <div className="mc-section-head">
                  <div>
                    <p className="mc-admin-kicker">Relational Database B</p>
                    <h2>Active Asset Ledger</h2>
                  </div>
                  <span>Assets map back to contact UUIDs</span>
                </div>
                <div className="mc-table-wrap">
                  <table className="mc-table asset-table">
                    <thead>
                      <tr>
                        <th>Property Address</th>
                        <th>Sourced From</th>
                        <th>List Price</th>
                        <th>Rental Thesis Delta</th>
                        <th>Verdict Tag</th>
                        <th>Dossier Compile Check</th>
                        <th>Schema Fields</th>
                        <th>Risk Register</th>
                      </tr>
                    </thead>
                    <tbody>
                      {UNDERWRITTEN_ASSETS.map((asset) => {
                        const contact = OUTREACH_CONTACTS.find((item) => item.uuid === asset.sourcedByContactUuid)
                        return (
                          <tr
                            key={asset.uuid}
                            className={selectedAssetUuid === asset.uuid ? 'selected-row' : ''}
                            onClick={() => setSelectedAssetUuid(asset.uuid)}
                          >
                            <td>
                              <strong>{asset.address}</strong>
                              <span>{asset.uuid}</span>
                            </td>
                            <td>
                              <span>{asset.sourcedByContactUuid}</span>
                              <strong>{contact?.name || 'Unmapped contact'}</strong>
                            </td>
                            <td>{asset.listPrice > 0 ? `$${asset.listPrice.toLocaleString()}` : 'Pending'}</td>
                            <td>{asset.rentcastDiscrepancyFlag}</td>
                            <td><VerdictBadge status={asset.verdictStatus} /></td>
                            <td>{asset.compileStatus}</td>
                            <td>
                              <div className="schema-stack">
                                <span>Year Built: {asset.yearBuilt || 'TBD'}</span>
                                <span>Sq Ft: {asset.squareFeet || 'TBD'}</span>
                                <span>MAO: {asset.maximumAllowableOffer ? `$${asset.maximumAllowableOffer.toLocaleString()}` : 'TBD'}</span>
                              </div>
                            </td>
                            <td>
                              <textarea
                                value={asset.assetRiskRegister.join('\n')}
                                aria-label={`${asset.address} asset risk register`}
                                readOnly
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activeAdminTab === 'content' && (
            <section className="mc-admin-card content-card">
              <div className="mc-section-head">
                <div>
                  <p className="mc-admin-kicker">Quick-Launch Content Asset Desk</p>
                  <h2>HOT DEAL IN 10 MIN</h2>
                </div>
                <span>Daily waitlist fuel</span>
              </div>
              <div className="content-desk-grid">
                <div className="daily-checklist">
                  {VIDEO_TEMPLATE.map((item) => (
                    <label key={item.id}>
                      <input
                        type="checkbox"
                        checked={Boolean(completedChecklist[item.id])}
                        onChange={() => toggleChecklistItem(item.id)}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
                <div className="daily-checklist">
                  {DAILY_CHECKLIST.map((item) => (
                    <label key={item.id}>
                      <input
                        type="checkbox"
                        checked={Boolean(completedChecklist[item.id])}
                        onChange={() => toggleChecklistItem(item.id)}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          )}
        </section>

        <aside className={`mc-context-zone ${contextMode}`}>
          <section className="mc-context-card">
            <div className="mc-context-head">
              <div>
                <p className="mc-admin-kicker">Integrated Context Command Box</p>
                <h2>Context Terminal</h2>
              </div>
              <span>{contextBadge}</span>
            </div>

            <div className="context-toggle" role="tablist" aria-label="Execution persona">
              <button type="button" className={contextMode === 'ghost' ? 'active' : ''} onClick={() => setMode('ghost')}>
                GHOST / AXIOM
              </button>
              <button type="button" className={contextMode === 'codex' ? 'active' : ''} onClick={() => setMode('codex')}>
                CODEX
              </button>
            </div>

            <label className="context-helper">
              Workspace Helper
              <select value={selectedHelper} onChange={(event) => setSelectedHelper(event.target.value)}>
                {contextHelpers.map((helper) => (
                  <option key={helper} value={helper}>{helper}</option>
                ))}
              </select>
            </label>

            <div className="context-selected-row">
              <p>Active database row</p>
              <strong>{selectedAsset?.address || 'No asset selected'}</strong>
              <span>{selectedAssetContact?.name || 'No source contact'} / {selectedAsset?.verdictStatus || 'NO_STATUS'}</span>
            </div>

            <div className="terminal-thread" aria-label="Context command message thread">
              {terminalMessages.map((message) => (
                <article key={message.id}>
                  <span>[{message.timestamp} UTC] {message.mode.toUpperCase()}</span>
                  <p>{message.text}</p>
                </article>
              ))}
            </div>

            <form className="terminal-input" onSubmit={submitTerminalMessage}>
              <textarea
                value={terminalInput}
                onChange={(event) => setTerminalInput(event.target.value)}
                rows={4}
                placeholder="Write prompt context, outreach objective, schema question, or next execution instruction..."
              />
              <button type="submit">Add Thread Note</button>
            </form>

            <button className="copy-context-button" type="button" onClick={copyContextPayload}>
              {contextCopied ? 'Context Payload Copied' : 'Copy Context Payload to Clipboard'}
            </button>
          </section>
        </aside>
      </main>

      {selectedContact && (
        <div className="script-modal-backdrop" role="presentation" onMouseDown={() => setSelectedContact(null)}>
          <section
            className="script-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="script-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mc-section-head">
              <div>
                <p className="mc-admin-kicker">Quick-copy scripts</p>
                <h2 id="script-modal-title">{selectedContact.name}</h2>
                <p>{selectedContact.company}</p>
              </div>
              <button className="mc-mini-action" type="button" onClick={() => setSelectedContact(null)}>
                Close
              </button>
            </div>
            <div className="contact-action-row">
              <a href={`tel:${selectedContact.phone}`}>Call</a>
              <a href={`mailto:${selectedContact.email}`}>Email</a>
              <a href={selectedContact.socialUrl} target="_blank" rel="noreferrer">Social</a>
            </div>
            {selectedContactAssets.length > 0 && (
              <div className="linked-assets">
                <p>Linked assets</p>
                {selectedContactAssets.map((asset) => (
                  <span key={asset.uuid}>{asset.address}</span>
                ))}
              </div>
            )}
            <div className="script-list">
              {OUTREACH_TEMPLATES.map((template) => (
                <article key={template.id}>
                  <div>
                    <strong>{template.title}</strong>
                    <span>{template.target}</span>
                  </div>
                  <p>{template.body}</p>
                  <button className="mc-mini-action" type="button" onClick={() => copyTemplate(template)}>
                    {copiedTemplateId === template.id ? 'Copied' : 'Copy Script'}
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

function VerdictBadge({ status }: { status: VerdictStatus }) {
  const label = status.replace(/_/g, ' ')
  const className = status === 'WORTH_PURSUING'
    ? 'status-tag status-green'
    : status === 'WALKAWAY'
      ? 'status-tag status-red'
      : 'status-tag status-amber'

  return <span className={className}>{label}</span>
}

function formatUtcTimestamp() {
  return new Date().toISOString().slice(11, 19)
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
