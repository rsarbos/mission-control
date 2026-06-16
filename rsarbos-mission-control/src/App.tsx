import React, { useEffect, useState } from 'react'
import ManualReportForm from './components/ManualReportForm'
import MissionControlRevenueOS from './components/MissionControlRevenueOS'
import SampleDossierPage from './components/SampleDossierPage'
import { DecisionManifestHero } from './components/about/decision-manifest'
import rsarbosLogo from './assets/logo.png'
import { getAnalyticsSnapshot, trackEvent, trackPageView } from './utils/analytics'

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

type ChannelTag = 'YouTube Creator' | 'BiggerPockets' | 'LinkedIn' | 'InvestorLift' | 'Privy'

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
  headlineRent: number
  actualCompRent: number
  yearBuilt: number
  squareFeet: number
  maximumAllowableOffer: number
  rentcastDiscrepancyFlag: string
  verdictStatus: VerdictStatus
  compileStatus: string
  paymentStatus: 'PAID' | 'PENDING' | 'UNPAID'
  assetRiskRegister: string[]
  dossierUrl: string
}

type OutreachTemplate = {
  id: string
  title: string
  target: string
  generateBody: (asset: UnderwrittenAsset) => string
}

type DailyChecklistItem = {
  id: string
  label: string
}

type AdminTab = 'pipeline' | 'content' | 'marketing'

type ContextMode = 'ghost' | 'codex'

type TerminalMessage = {
  id: string
  timestamp: string
  mode: ContextMode
  text: string
}

type OutreachPriority = {
  rank: number
  segment: string
  exampleTargets: string
  friction: string
  firstMove: string
  argumentPriority: string
  mentalMode: string
}

const VALIDATION_TARGET = 3

const OUTREACH_CONTACTS: OutreachContact[] = [
  {
    uuid: 'contact-pace-subto-004',
    name: 'Pace Morby (SubTo)',
    company: 'Creative Finance Community',
    channelTag: 'YouTube Creator',
    phone: '+15550201004',
    email: 'acquisitions@subto.com',
    socialHandle: '@pacemorby',
    socialUrl: 'https://www.instagram.com/pacemorby/',
  },
  {
    uuid: 'contact-turner-005',
    name: 'Brandon Turner',
    company: 'A Better Life / Open Door Capital',
    channelTag: 'YouTube Creator',
    phone: '+15550201005',
    email: 'deals@abetterlife.com',
    socialHandle: '@beardybrandon',
    socialUrl: 'https://www.biggerpockets.com/users/brandonatbp',
  },
  {
    uuid: 'contact-beardsley-006',
    name: 'Rob Beardsley',
    company: 'Lone Star Capital',
    channelTag: 'LinkedIn',
    phone: '+15550201006',
    email: 'rob@lscre.com',
    socialHandle: 'rob-beardsley',
    socialUrl: 'https://www.linkedin.com/in/rob-beardsley/',
  },
  {
    uuid: 'contact-bp-power-007',
    name: 'BP Power Member',
    company: 'Deal Analysis Forum',
    channelTag: 'BiggerPockets',
    phone: '+15550201007',
    email: 'investor.pro@example.com',
    socialHandle: 'Pro User',
    socialUrl: 'https://www.biggerpockets.com/forums/52',
  },
  {
    uuid: 'contact-lift-wholesale-008',
    name: 'InvestorLift Platinum',
    company: 'Dispo Desk',
    channelTag: 'InvestorLift',
    phone: '+15550201008',
    email: 'dispo.king@example.com',
    socialHandle: '@dispokings',
    socialUrl: 'https://www.investorlift.com/',
  },
  {
    uuid: 'contact-houston-dispo-009',
    name: 'Houston Dispo Pro',
    company: 'Lone Star Wholesale',
    channelTag: 'InvestorLift',
    phone: '+15550301009',
    email: 'houston.deals@example.com',
    socialHandle: '@houstonwholesale',
    socialUrl: 'https://www.investorlift.com/',
  },
]

const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    id: 'red-pill-rent',
    title: 'The "Red Pill" Rent Hook',
    target: 'High-Volume Wholesalers / Acquisition',
    generateBody: (asset) => 
      `The listing for ${asset.address} claims $${asset.headlineRent.toLocaleString()} in rent. My report found the actual comp-ceiling is $${asset.actualCompRent.toLocaleString()}. I packaged the full risk-register and ARV thesis here: https://rsarbos.com${asset.dossierUrl}. No strings, just wanted to show you the spread before your team spends time on it.`,
  },
  {
    id: 'stale-deal-rescue',
    title: 'Stale Deal Rescue',
    target: 'Wholesalers with 10+ DOM',
    generateBody: (asset) => 
      `I noticed your deal at ${asset.address} has been on InvestorLift for ${asset.yearBuilt} days. In this market, that usually means a 'Trust Gap' on the foundation or ARV. I underwrote the 'Truth' spread here: https://rsarbos.com${asset.dossierUrl}. Might help you move it to a buyer who is on the fence.`,
  },
  {
    id: 'risk-first',
    title: 'Risk Register Angle',
    target: 'Institutional / Skeptical Buyers',
    generateBody: (asset) => 
      `Underwrote ${asset.address} and found a specific risk ([${asset.assetRiskRegister[0]}]) that doesn't show up on Zillow. Full dossier with comps and walkaway triggers here: https://rsarbos.com${asset.dossierUrl}. Worth a look before you run numbers.`,
  },
]

const UNDERWRITTEN_ASSETS: UnderwrittenAsset[] = [
  {
    uuid: 'asset-houston-77045',
    address: 'Houston, TX 77045 (InvestorLift ID: HOU-77045)',
    sourcedByContactUuid: 'contact-houston-dispo-009',
    listPrice: 138000,
    headlineRent: 1800,
    actualCompRent: 1650,
    yearBuilt: 11, // Using yearBuilt as DOM for this specific UI hack
    squareFeet: 1400,
    maximumAllowableOffer: 125000,
    rentcastDiscrepancyFlag: '$1,800 pro-forma vs $1,650 Section 8 ceiling',
    verdictStatus: 'WORTH_PURSUING',
    compileStatus: 'Dossier Ready - Stale Deal Rescue Hook active',
    paymentStatus: 'PAID',
    assetRiskRegister: [
      'Foundation shift risk common in 77045 clay soil.',
      'Wholesaler ARV ($280k) assumes premium finish; RSARBOS supports $255k.',
      'Previous buyer fallout noted in listing history.',
    ],
    dossierUrl: '/sample-dossier-1314shawndr', // Temporarily using sample until Houston is built
  },
  {
    uuid: 'asset-1314-shawn-dr',
    address: '1314 Shawn Dr #1, San Jose, CA 95118',
    sourcedByContactUuid: 'contact-lift-wholesale-008',
    listPrice: 500000,
    headlineRent: 4410,
    actualCompRent: 2900,
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
    dossierUrl: DOSSIER_PREVIEW_URL,
  },
]

function DossierCarousel() {
  const [index, setIndex] = useState(0)
  const paidAssets = UNDERWRITTEN_ASSETS.filter(a => a.paymentStatus === 'PAID')

  const next = () => setIndex((i) => (i + 1) % paidAssets.length)
  const prev = () => setIndex((i) => (i - 1 + paidAssets.length) % paidAssets.length)

  const active = paidAssets[index]

  return (
    <section className="mc-admin-card dossier-carousel">
      <div className="mc-section-head">
        <div>
          <p className="mc-admin-kicker">Visual Evidence</p>
          <h2>Dossier Showcase</h2>
        </div>
        <div className="carousel-nav">
          <button type="button" className="mc-mini-action" onClick={prev}>←</button>
          <span>{index + 1} / {paidAssets.length}</span>
          <button type="button" className="mc-mini-action" onClick={next}>→</button>
        </div>
      </div>
      <div className="carousel-content glass-panel">
        <div className="carousel-preview">
           <div style={{ marginBottom: '12px' }}>
             <VerdictBadge status={active.verdictStatus} />
           </div>
           <h3>{active.address}</h3>
           <p className="red-text" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
             Rent Gap: -${active.headlineRent - active.actualCompRent}/mo
           </p>
           <div className="risk-pill-list" style={{ margin: '16px 0' }}>
             {active.assetRiskRegister.map((r, i) => <span key={i} className="risk-pill">{r}</span>)}
           </div>
           <a href={active.dossierUrl} target="_blank" rel="noreferrer" className="primary-action red-action">OPEN FULL DOSSIER</a>
        </div>
      </div>
    </section>
  )
}

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

const SOCIAL_ASSET_SHOTS: DailyChecklistItem[] = [
  { id: 'shot-hero', label: 'Hero: Turning complex data into conclusions 100% auditable' },
  { id: 'shot-source-ticker', label: 'Source ticker: Zillow / Redfin / Realtor.com / Homes.com / MLS / RSARBOS Dossier' },
  { id: 'shot-mobile-preview', label: 'Mobile dossier preview with red glow' },
  { id: 'shot-pricing', label: 'Pricing card next to sample dossier preview' },
  { id: 'shot-request-mobile', label: 'Request form above the fold on mobile' },
  { id: 'shot-cover', label: 'Report cover page with property images' },
  { id: 'shot-exec', label: 'Executive Decision page' },
  { id: 'shot-risk', label: 'Strategy + Risk page' },
  { id: 'shot-calculator', label: 'Cash-Flow Calculator page' },
  { id: 'shot-sources', label: 'Source Appendix page' },
]

const OUTREACH_PRIORITY: OutreachPriority[] = [
  {
    rank: 1,
    segment: 'Warm investor/operator contacts',
    exampleTargets: 'People who already know you, local operators, small buyer lists',
    friction: 'Lowest',
    firstMove: 'Send one dossier link and ask for a practical critique, not a sale.',
    argumentPriority: 'They already understand deal pain; lead with saved time and cleaner decision confidence.',
    mentalMode: 'They are busy, not skeptical. I am giving them a shortcut they wish they already had.',
  },
  {
    rank: 2,
    segment: 'Wholesalers with stale or hard-to-explain deals',
    exampleTargets: 'InvestorLift sellers, local dispo desks, high-volume wholesalers',
    friction: 'Low',
    firstMove: 'Use the rent-gap hook on one listed deal and show how the dossier can rescue buyer trust.',
    argumentPriority: 'Their pain is buyer hesitation; a dossier gives them proof, differentiation, and a cleaner blast.',
    mentalMode: 'They need anything that makes buyers reply faster. RSARBOS is a conversion weapon, not homework.',
  },
  {
    rank: 3,
    segment: 'New investors and BiggerPockets-style buyers',
    exampleTargets: 'BP Pro members, first-time investors, local meetup members',
    friction: 'Low-medium',
    firstMove: 'Frame the report as a final confidence check before they wire money or write an offer.',
    argumentPriority: 'Their pain is fear of overpaying; lead with walkaway triggers and cash-flow stress tests.',
    mentalMode: 'They do not need more content. They need permission to either act or walk away.',
  },
  {
    rank: 4,
    segment: 'Investor-friendly agents',
    exampleTargets: 'Buyer reps, listing agents with investor clients, local RE agents',
    friction: 'Medium',
    firstMove: 'Show how a sample dossier can help their client understand risk without the agent pretending to underwrite.',
    argumentPriority: 'Their pain is client trust and faster decisions; lead with decision support and professionalism.',
    mentalMode: 'They want to look sharper without taking liability. RSARBOS makes them look prepared.',
  },
  {
    rank: 5,
    segment: 'Creators and mentors',
    exampleTargets: 'Pace Morby, Brandon Turner, YouTube real estate educators',
    friction: 'High',
    firstMove: 'Send a striking discrepancy as content fuel, not a vendor pitch.',
    argumentPriority: 'Their pain is fresh proof and teachable moments; lead with a red-pill rent or risk gap.',
    mentalMode: 'They need sharp examples for their audience. I am handing them a story with receipts.',
  },
  {
    rank: 6,
    segment: 'Institutional underwriters',
    exampleTargets: 'Rob Beardsley, fund analysts, multifamily operators',
    friction: 'Highest',
    firstMove: 'Lead with auditability and risk-register structure, not speed or hype.',
    argumentPriority: 'Their pain is model trust; lead with traceability, assumptions, and source conflicts.',
    mentalMode: 'They will not be impressed by claims. They respect disciplined evidence and clean assumptions.',
  },
]

const CROP_FORMATS = ['Square 1080x1080', 'Portrait 1080x1350', 'Story/Reel 1080x1920', 'LinkedIn 1200x627']

const GHOST_HELPERS = ['Outreach scripts', 'Value proposition frameworks', 'Closing scripts']
const CODEX_HELPERS = ['Strict JSON intake schemas', 'Neon Postgres table mapping', 'NATS transport event contracts']

function PublicWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoLeftClicks, setLogoLeftClicks] = useState(0)
  const audienceBannerItems = ['BUILT FOR:', ...AUDIENCE_BANNER_ITEMS, 'BUILT FOR:', ...AUDIENCE_BANNER_ITEMS]

  useEffect(() => {
    function keepDossierPreviewReachable(event: MessageEvent) {
      if (event.data?.type !== 'rsarbos:dossier-nav') return

      window.setTimeout(() => {
        const frame = Array.from(document.querySelectorAll<HTMLElement>('.a4-dossier-frame, .mobile-dossier-frame'))
          .find((candidate) => candidate.getBoundingClientRect().height > 0)
        const nav = document.querySelector<HTMLElement>('.public-nav')
        if (!frame || !nav) return

        const navOffset = nav.getBoundingClientRect().height + 18
        const frameTop = frame.getBoundingClientRect().top
        if (frameTop < navOffset) {
          window.scrollBy({ top: frameTop - navOffset, behavior: 'smooth' })
        }
      }, 80)
    }

    window.addEventListener('message', keepDossierPreviewReachable)
    return () => window.removeEventListener('message', keepDossierPreviewReachable)
  }, [])

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
            <a className="nav-about" href="/about-us">ABOUT US</a>
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
            <a href="/about-us">About Us</a>
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
          <div className="content-wrap sample-preview-column">
            <div className="sample-preview-copy centered-copy">
              <p className="red-kicker"><span></span>Example Report</p>
              <h2>SAMPLE DOSSIER</h2>
              <p>See the exact decision format before you request underwriting.</p>
            </div>
            <div className="a4-dossier-frame" aria-label="A4 preview of RSARBOS investment dossier">
              <iframe src={DOSSIER_PREVIEW_URL} title="RSARBOS Investment Dossier A4 preview" loading="lazy" tabIndex={-1}></iframe>
            </div>
            <div className="sample-preview-column">
              <div className="mobile-dossier-frame" aria-label="Mobile preview of RSARBOS investment dossier">
                <div className="phone-speaker" aria-hidden="true"></div>
                <iframe src={DOSSIER_PREVIEW_URL} title="RSARBOS Investment Dossier mobile preview" loading="lazy" tabIndex={-1}></iframe>
              </div>
            </div>
          </div>
        </section>

        <section className="pricing-section" id="pricing">
          <div className="content-wrap pricing-layout">
            <div className="pricing-column">
              <p className="red-kicker"><span></span>Launch Offer</p>
              <h2>CLEAR PRICING</h2>
              <p>No hidden fees. Flat rate intelligence for actionable decisions.</p>
            </div>
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
              <p className="service-disclaimer">
                Decision support only. Not legal, tax, lending, inspection, appraisal, or financial advice.
              </p>
              <a className="primary-action red-action" href="#request">INITIATE REQUEST</a>
            </article>
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
              <a href="/about-us">About Us</a>
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

function AboutUsPage() {
  return (
    <div className="public-site about-page">
      <div className="ambient-glow" aria-hidden="true"></div>
      <nav className="public-nav" aria-label="About navigation">
        <div className="nav-inner">
          <a className="logo-wordmark" href="/">
            <img src={rsarbosLogo} alt="RSARBOS" />
          </a>
          <div className="desktop-menu">
            <a className="nav-sample" href="/#sample">VIEW SAMPLE DOSSIER</a>
            <a className="nav-cta" href="/#request">REQUEST REPORT</a>
            <a className="nav-contact" href="/contact">CONTACT</a>
          </div>
        </div>
      </nav>

      <main className="about-main">
        <section className="about-hero">
          <div className="content-wrap about-hero-grid">
            <div className="about-hero-copy">
              <p className="red-kicker"><span></span>ABOUT RSARBOS</p>
              <h1>From a property link to a decision you can defend.</h1>
              <p>
                RSARBOS turns scattered listing data, comparable sales, rent assumptions, risks, and source evidence into
                one clear, human-reviewed acquisition dossier.
              </p>
              <p className="about-hero-statement">
                See what supports the opportunity, what could break it, and what still needs verification before capital
                moves.
              </p>
              <div className="hero-actions">
                <a className="primary-action shine-action" href="/#sample">VIEW SAMPLE DOSSIER</a>
                <a className="secondary-action glass-action" href="/#request">REQUEST A REPORT</a>
              </div>
              <p className="about-trust-note">Human-reviewed today. Structured for repeatable, governed automation.</p>
            </div>
            <div
              className="about-hero-visual"
              aria-label="Illustrative RSARBOS decision manifest showing a property case, comparable-value range, acquisition conditions, diligence checks, unresolved evidence, and preserved audit history."
            >
              <DecisionManifestHero />
            </div>
          </div>
        </section>

        <section className="about-convergence-section">
          <div className="content-wrap about-convergence-grid">
            <div className="about-section-copy">
              <p className="red-kicker"><span></span>FROM FRAGMENTS TO DOSSIER</p>
              <h2>Scattered property information becomes one decision file.</h2>
              <p>
                Listings, rent claims, comparable sales, repair notes, local context, and unresolved diligence are gathered
                into a single acquisition dossier so the decision is not trapped across tabs and screenshots.
              </p>
            </div>
            <div className="convergence-visual" aria-label="Fragmented property sources converging into one RSARBOS dossier">
              <div className="source-cluster source-cluster-left" aria-hidden="true">
                <span>Listing</span>
                <span>Comps</span>
                <span>Rent claim</span>
              </div>
              <div className="convergence-lines" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
              </div>
              <div className="dossier-core">
                <strong>RSARBOS Dossier</strong>
                <span>Evidence-backed acquisition brief</span>
                <b>Verdict + risks + next checks</b>
              </div>
              <div className="source-cluster source-cluster-right" aria-hidden="true">
                <span>Repairs</span>
                <span>Neighborhood</span>
                <span>Open diligence</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-method-section">
          <div className="content-wrap about-method-grid">
            <div className="layer-system-visual" aria-label="Five distinct RSARBOS dossier layers">
              {[
                ['Evidence', 'Listing facts, comps, sources, document trail'],
                ['Assumptions', 'Rent scenarios, repair ranges, financing inputs'],
                ['Calculations', 'Cash flow, ARV ranges, offer sensitivity'],
                ['Risks', 'Conflicts, missing documents, walkaway triggers'],
                ['Verdict', 'Buy, pass, watch, and what must verify next'],
              ].map(([label, copy], index) => (
                <article className={`layer-card layer-card-${index + 1}`} key={label}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{label}</strong>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
            <div className="about-method-copy">
              <p className="red-kicker"><span></span>BUILT FOR TRUST, NOT BLACK-BOX OUTPUTS</p>
              <h2>Every verdict should show its work.</h2>
              <p>
                RSARBOS keeps evidence, assumptions, calculations, risks, and conclusions separate. That means you can see
                not only the answer, but why it was reached&mdash;and what remains unresolved.
              </p>
              <div className="about-principles" aria-label="RSARBOS trust principles">
                <article>
                  <strong>Source lineage</strong>
                  <span>Material claims remain connected to the evidence that supports them.</span>
                </article>
                <article>
                  <strong>Declared assumptions</strong>
                  <span>Unknowns and scenario inputs are disclosed instead of hidden inside the result.</span>
                </article>
                <article>
                  <strong>Reproducible calculations</strong>
                  <span>Financial outputs are designed to come from versioned formulas, not improvised AI arithmetic.</span>
                </article>
                <article>
                  <strong>Visible conflicts</strong>
                  <span>When sources disagree, the conflict stays visible until it is reviewed.</span>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="about-workflow-section">
          <div className="content-wrap about-workflow-grid">
            <div className="about-section-copy">
              <p className="red-kicker"><span></span>HUMAN-ASSISTED TODAY</p>
              <h2>A practical workflow for investors who need a clear read now.</h2>
              <p>
                RSARBOS currently delivers human-reviewed reports through a structured service workflow. The customer sends
                the property, RSARBOS reviews the evidence, and the finished dossier comes back with the decision logic
                preserved.
              </p>
            </div>
            <div className="workflow-rail" aria-label="Current RSARBOS customer workflow">
              {[
                ['01', 'Send property', 'Submit the listing link, context, and the question you need answered.'],
                ['02', 'Analyst review', 'Evidence, comps, assumptions, and risk flags are organized manually.'],
                ['03', 'Dossier delivery', 'You receive a private acquisition dossier with next checks called out.'],
                ['04', 'Capital decision', 'Use the report to proceed, renegotiate, pause, or walk away.'],
              ].map(([step, title, copy]) => (
                <article key={step}>
                  <span>{step}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-proof-section">
          <div className="content-wrap">
            <div className="about-proof-head">
              <p className="red-kicker"><span></span>REAL DOSSIER PROOF</p>
              <h2>The output is a dossier, not a vague summary.</h2>
              <p>These close-up views use the existing sample dossier asset and show different decision surfaces.</p>
            </div>
            <div className="dossier-crop-grid" aria-label="Close-up crops from the RSARBOS sample dossier">
              {[
                ['Executive decision', `${DOSSIER_PREVIEW_URL}#p2`],
                ['Rental thesis', `${DOSSIER_PREVIEW_URL}#p4`],
                ['Cash-flow calculator', `${DOSSIER_PREVIEW_URL}#p8`],
              ].map(([title, src]) => (
                <article className="dossier-crop-card" key={title}>
                  <div className="dossier-crop-frame">
                    <iframe src={src} title={`RSARBOS sample dossier close-up: ${title}`} loading="lazy" tabIndex={-1}></iframe>
                  </div>
                  <strong>{title}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-roadmap-section">
          <div className="content-wrap about-roadmap-grid">
            <div className="about-section-copy">
              <p className="red-kicker"><span></span>AVAILABLE NOW, STRUCTURED FOR WHAT COMES NEXT</p>
              <h2>Buy the report today. Let the infrastructure mature honestly.</h2>
              <p>
                The public offer is the human-reviewed dossier. The infrastructure being built supports repeatability,
                governance, and stronger automation without presenting unfinished systems as completed approvals.
              </p>
            </div>
            <div className="today-next-visual" aria-label="Available today versus infrastructure being built">
              <article>
                <span>Available today</span>
                <strong>Manual underwriting dossier</strong>
                <p>Property link intake, analyst review, risk register, decision summary, and private delivery.</p>
              </article>
              <article>
                <span>Being built</span>
                <strong>Governed underwriting infrastructure</strong>
                <p>Structured source lineage, versioned formulas, repeatable checks, and automation with human review.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="about-closing-section">
          <div className="content-wrap about-closing-panel">
            <div>
              <h2>See the dossier. Judge the work.</h2>
              <p>Open a real sample, or send RSARBOS the property you are evaluating.</p>
            </div>
            <div className="hero-actions">
              <a className="primary-action shine-action" href="/#sample">VIEW SAMPLE DOSSIER</a>
              <a className="secondary-action glass-action" href="/#request">REQUEST A REPORT</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <div className="content-wrap">
          <div className="footer-top">
            <a className="logo-wordmark footer-logo" href="/"><img src={rsarbosLogo} alt="RSARBOS" /></a>
            <p>BUILDING THE INTELLIGENCE LAYER FOR THE NEXT ECONOMY.</p>
          </div>
          <div className="footer-bottom">
            <p>© 2026 RSARBOS Next-Gen Business Technology. All rights reserved.</p>
            <div className="footer-links">
              <a href="/">Home</a>
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
        ['Service providers', 'RSARBOS may use providers such as Stripe, Neon, Resend, Plausible Analytics, hosting providers, and analytics tools to operate the service.'],
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
    return <MissionControlRevenueOS />
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
  const [analyticsSnapshot, setAnalyticsSnapshot] = useState(() => getAnalyticsSnapshot())
  const [terminalMessages, setTerminalMessages] = useState<TerminalMessage[]>([
    {
      id: 'boot',
      timestamp: formatUtcTimestamp(),
      mode: 'ghost',
      text: 'War Room active. Asset-driven outreach ready.',
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

  useEffect(() => {
    setAnalyticsSnapshot(getAnalyticsSnapshot())
  }, [activeAdminTab])

  const paidDossierCount = UNDERWRITTEN_ASSETS.filter((asset) => asset.paymentStatus === 'PAID').length
  const bridgeProgress = Math.min((paidDossierCount / VALIDATION_TARGET) * 100, 100)
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

  async function copyScript(template: OutreachTemplate) {
    if (!selectedAsset) return
    const body = template.generateBody(selectedAsset)
    const payload = selectedAssetContact
      ? `TO: ${selectedAssetContact.name} (${selectedAssetContact.company})\n\n${body}`
      : body

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
          WAR ROOM ACTIVE
        </div>
      </header>

      <main className="mc-admin-grid">
        <section className="mc-ops-zone">
          <div className="mc-admin-tabs" role="tablist" aria-label="Mission Control modules">
            <button type="button" className={activeAdminTab === 'pipeline' ? 'active' : ''} onClick={() => setActiveAdminTab('pipeline')}>
              ASSET WAR ROOM
            </button>
            <button type="button" className={activeAdminTab === 'content' ? 'active' : ''} onClick={() => setActiveAdminTab('content')}>
              CONTENT DESK
            </button>
            <button type="button" className={activeAdminTab === 'marketing' ? 'active' : ''} onClick={() => setActiveAdminTab('marketing')}>
              MARKETING DESK
            </button>
          </div>

          {activeAdminTab === 'pipeline' && (
            <>
              <section className="mc-admin-card bridge-card">
                <div className="bridge-marquee">SYSTEM STATUS: REVENUE EXECUTION MODE -- IMMUTABLE ENGINE PAUSED AT PHASE 2AH</div>
                <div className="bridge-metrics">
                  <article>
                    <p>Validation Progress</p>
                    <strong>{paidDossierCount} / {VALIDATION_TARGET} Paid Reports</strong>
                    <div className="bridge-meter" aria-label={`Validation progress ${paidDossierCount} of ${VALIDATION_TARGET}`}>
                      <span style={{ width: `${bridgeProgress}%` }}></span>
                    </div>
                  </article>
                  <article>
                    <p>Current Objective</p>
                    <strong>"Red Pill" Prospecting</strong>
                    <span className="status-tag status-green">REVENUE LIVE</span>
                  </article>
                </div>
              </section>

              <DossierCarousel />

              <section className="mc-admin-card assets-card">
                <div className="mc-section-head">
                  <div>
                    <p className="mc-admin-kicker">Relational Database B</p>
                    <h2>Active Asset Ledger</h2>
                  </div>
                  <span>Click to build attack plan</span>
                </div>
                <div className="mc-table-wrap">
                  <table className="mc-table asset-table">
                    <thead>
                      <tr>
                        <th>Property Address</th>
                        <th>Sourced From</th>
                        <th>Rent Discrepancy</th>
                        <th>Verdict</th>
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
                              <strong>{contact?.name || 'Unmapped'}</strong>
                              <span>{asset.sourcedByContactUuid}</span>
                            </td>
                            <td className="red-text">-${(asset.headlineRent - asset.actualCompRent).toLocaleString()} gap</td>
                            <td><VerdictBadge status={asset.verdictStatus} /></td>
                            <td>
                              <div className="schema-stack">
                                <span>MAO: ${asset.maximumAllowableOffer.toLocaleString()}</span>
                                <span>Year: {asset.yearBuilt || 'TBD'}</span>
                              </div>
                            </td>
                            <td>
                              <div className="risk-pill-list">
                                {asset.assetRiskRegister.slice(0, 2).map((risk, i) => (
                                  <span key={i} className="risk-pill">{risk.slice(0, 20)}...</span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mc-admin-card contacts-card">
                <div className="mc-section-head">
                  <div>
                    <p className="mc-admin-kicker">Relational Database A</p>
                    <h2>Contacts Directory</h2>
                  </div>
                </div>
                <div className="mc-table-wrap">
                  <table className="mc-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Firm</th>
                        <th>Channel</th>
                        <th>Social</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OUTREACH_CONTACTS.map((contact) => (
                        <tr key={contact.uuid} className={selectedAssetContact?.uuid === contact.uuid ? 'highlight-row' : ''}>
                          <td><strong>{contact.name}</strong></td>
                          <td>{contact.company}</td>
                          <td><span className="channel-tag">{contact.channelTag}</span></td>
                          <td><a href={contact.socialUrl} target="_blank" rel="noreferrer">{contact.socialHandle}</a></td>
                          <td>
                            <div className="action-button-group">
                              <button className="mc-mini-action" type="button" onClick={() => setSelectedContact(contact)}>
                                Profile
                              </button>
                              <a href={`mailto:${contact.email}?subject=Underwriting Discrepancy: ${selectedAsset?.address}`} className="mc-mini-action red-action">
                                Email
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
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

          {activeAdminTab === 'marketing' && (
            <>
              <section className="mc-admin-card marketing-card">
                <div className="mc-section-head">
                  <div>
                    <p className="mc-admin-kicker">Launch Analytics</p>
                    <h2>Open Source Analytics Status</h2>
                  </div>
                  <span>{analyticsSnapshot.configured ? 'PROVIDER CONFIGURED' : 'ENV CONFIG NEEDED'}</span>
                </div>
                <div className="analytics-grid">
                  <article>
                    <p>Provider</p>
                    <strong>{analyticsSnapshot.provider}</strong>
                    <span>Chosen for a public marketing site: lightweight, open-source, goal-based, and low-friction.</span>
                  </article>
                  <article>
                    <p>Domain</p>
                    <strong>{analyticsSnapshot.domain}</strong>
                    <span>Set `VITE_PLAUSIBLE_DOMAIN=rsarbos.com` in Vercel to enable provider delivery.</span>
                  </article>
                  <article>
                    <p>Local Captured Events</p>
                    <strong>{analyticsSnapshot.localEvents.length}</strong>
                    <span>{analyticsSnapshot.dashboardUrl || 'Dashboard link appears after domain env is set.'}</span>
                  </article>
                </div>
                <div className="analytics-events">
                  {analyticsSnapshot.localEvents.slice(0, 8).map((event, index) => (
                    <div key={`${event.event}-${event.timestamp || index}`}>
                      <strong>{event.event}</strong>
                      <span>{event.timestamp || 'no timestamp'}</span>
                    </div>
                  ))}
                  {analyticsSnapshot.localEvents.length === 0 && (
                    <div>
                      <strong>No local events yet</strong>
                      <span>Visit the public site and click CTAs, then return to Mission Control.</span>
                    </div>
                  )}
                </div>
              </section>

              <section className="mc-admin-card marketing-card">
                <div className="mc-section-head">
                  <div>
                    <p className="mc-admin-kicker">Social Asset Shot List</p>
                    <h2>Capture Queue</h2>
                  </div>
                  <span>{CROP_FORMATS.join(' / ')}</span>
                </div>
                <div className="daily-checklist shot-list-grid">
                  {SOCIAL_ASSET_SHOTS.map((item) => (
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
              </section>

              <section className="mc-admin-card marketing-card">
                <div className="mc-section-head">
                  <div>
                    <p className="mc-admin-kicker">Outreach Priority</p>
                    <h2>Lowest Friction First</h2>
                  </div>
                  <span>Lead with proof, not platform language.</span>
                </div>
                <div className="mc-table-wrap">
                  <table className="mc-table outreach-priority-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Segment</th>
                        <th>Targets</th>
                        <th>First Move</th>
                        <th>Argument</th>
                        <th>Mental Mode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OUTREACH_PRIORITY.map((item) => (
                        <tr key={item.rank}>
                          <td><strong>#{item.rank}</strong><span>{item.friction}</span></td>
                          <td><strong>{item.segment}</strong></td>
                          <td>{item.exampleTargets}</td>
                          <td>{item.firstMove}</td>
                          <td>{item.argumentPriority}</td>
                          <td className="mindset-cell">{item.mentalMode}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </section>

        <aside className={`mc-context-zone ${contextMode}`}>
          <section className="mc-context-card attack-plan-card">
            <div className="mc-context-head">
              <div>
                <p className="mc-admin-kicker">Active Asset War Room</p>
                <h2>OUTREACH ATTACK PLAN</h2>
              </div>
              <span className="red-pill-badge">RED PILL READY</span>
            </div>

            <div className="asset-summary-box glass-panel">
              <p>Targeting Property:</p>
              <h3>{selectedAsset?.address}</h3>
              <div className="discrepancy-callout">
                <span className="label">Rent Gap:</span>
                <span className="value red-text">-${(selectedAsset.headlineRent - selectedAsset.actualCompRent).toLocaleString()} vs Listing</span>
              </div>
              <div className="war-room-actions">
                <a href={selectedAsset.dossierUrl} target="_blank" rel="noreferrer" className="dossier-preview-link">VIEW DOSSIER</a>
                {selectedAssetContact && (
                   <a href={`mailto:${selectedAssetContact.email}?subject=Rent Reality: ${selectedAsset.address}`} className="primary-action red-action">
                     TRIGGER OUTREACH
                   </a>
                )}
              </div>
            </div>

            <div className="script-builder">
              <p className="section-label">"Red Pill" Outreach Scripts</p>
              <div className="script-list-vertical">
                {OUTREACH_TEMPLATES.map((template) => (
                  <article key={template.id} className="script-item glass-panel">
                    <div className="script-header">
                      <strong>{template.title}</strong>
                      <span>{template.target}</span>
                    </div>
                    <p className="script-preview">{template.generateBody(selectedAsset).slice(0, 100)}...</p>
                    <button className="mc-mini-action red-action" onClick={() => copyScript(template)}>
                      {copiedTemplateId === template.id ? 'COPIED TO CLIPBOARD' : 'COPY FULL SCRIPT'}
                    </button>
                  </article>
                ))}
              </div>
            </div>

            <div className="terminal-mini">
              <div className="context-toggle">
                <button type="button" className={contextMode === 'ghost' ? 'active' : ''} onClick={() => setMode('ghost')}>GHOST</button>
                <button type="button" className={contextMode === 'codex' ? 'active' : ''} onClick={() => setMode('codex')}>CODEX</button>
              </div>
              <div className="terminal-thread-mini">
                {terminalMessages.slice(-2).map((message) => (
                  <p key={message.id}><span>[{message.timestamp}]</span> {message.text}</p>
                ))}
              </div>
              <form className="terminal-input-mini" onSubmit={submitTerminalMessage}>
                <input
                  value={terminalInput}
                  onChange={(event) => setTerminalInput(event.target.value)}
                  placeholder="System note..."
                />
              </form>
            </div>

            <button className="copy-context-button" type="button" onClick={copyContextPayload}>
              {contextCopied ? 'PAYLOAD READY' : 'COPY CONTEXT PAYLOAD'}
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
                <p className="mc-admin-kicker">Contact Profile</p>
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

  useEffect(() => {
    trackPageView(path)
  }, [path])

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

  if (path === '/about-us' || path === '/about') {
    return <AboutUsPage />
  }

  if (path === '/sample-dossier-1314shawndr') {
    return <SampleDossierPage />
  }

  return <PublicWebsite />
}
