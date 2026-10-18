import { useEffect, useState } from 'react'
import rsarbosLogo from '../assets/logo.png'
import '../styles/apex-asset-recovery.css'

const PLATFORM_METRICS = [
  { label: 'Discovered pool', value: '$14.2M+', detail: 'Total verified excess dockets', accent: 'teal' },
  { label: 'Skip accuracy', value: '98.4%', detail: 'Heir line & active phone match', accent: 'cyan' },
  { label: 'Unlock speed', value: '<30s', detail: 'Stripe webhook instant decrypt', accent: 'amber' },
  { label: 'Active monitoring', value: '3,143', detail: 'US counties & court jurisdictions', accent: 'teal' },
] as const

const OPPORTUNITY_ROWS: Array<[string, string, string, string, string, string]> = [
  ['TX-ALVARADO-0421', '$184,920', 'Evidence verified', 'Public sale notice + county processor dossier', 'Jurisdiction reviewed', 'Queue outreach packet'],
  ['NY-SUFFOLK-1188', '$246,780', 'Owner match pending', 'Chain-of-title extract + claimant notice', 'County review in progress', 'Request claimant validation'],
  ['CA-RIVERSIDE-1932', '$132,640', 'Source confirmed', 'Recorded drought-sale archive + notice of funding', 'Qualification check passed', 'Prepare investor packet'],
  ['FL-ORANGE-0817', '$297,500', 'Claimant not linked', 'Tax sale summary + owner lookup', 'Eligibility review open', 'Request additional records'],
]

const TIER_CARDS: Array<{ name: string; blurb: string; features: string[] }> = [
  {
    name: 'Discovery',
    blurb: 'Browse structured public-record signals and county-level opportunity summaries.',
    features: ['Opportunity pool visibility', 'State + county filters', 'Evidence status labels', 'Manual research exports'],
  },
  {
    name: 'Research',
    blurb: 'Expand into supporting records and review source integrity before outreach.',
    features: ['Document packet access', 'Evidence lineage review', 'Priority routing queues', 'Saved research workbooks'],
  },
  {
    name: 'Professional',
    blurb: 'Operational tooling for investigators, asset recovery teams, and ordered intake.',
    features: ['Advanced field filters', 'Exportable findings', 'Workflow notes + tasks', 'Team sharing controls'],
  },
  {
    name: 'Enterprise / API',
    blurb: 'Programmatic access for integrated operations, monitoring, and custom data feeds.',
    features: ['Webhook ingest', 'REST data access', 'Monitoring coverage reports', 'Scoped API keys and audit logs'],
  },
]

const TRUST_ITEMS = [
  'Traceable public-record sources and docket lineage.',
  'Verifiable supporting evidence before a record is marked qualified.',
  'Jurisdiction-aware review for filing and state-specific procedures.',
  'Explicit verification status rather than assumed recoverability.',
  'Reproducible research with source references and review notes.',
  'Transparent limitations in any record that remains unqualified.',
]

export default function ApexAssetRecoveryPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'RSARBOS | Surplus Funds Intelligence'

    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div className="public-site apex-recovery-page">
      <div className="ambient-glow" aria-hidden="true" />

      <nav className="apex-nav" aria-label="Primary navigation">
        <div className="apex-nav-inner">
          <div className="apex-brand-lockup" aria-label="RSARBOS brand">
            <img src={rsarbosLogo} alt="RSARBOS" className="apex-logo" />
            <div className="apex-brand-copy">
              <div className="apex-brand-row">
                <span>RS</span>
                <span>ARBOS</span>
              </div>
              <div className="apex-brand-meta">
                <span>INTELLIGENCE</span>
                <span className="apex-online-status">TERMINAL ONLINE</span>
                <span>3,143 COUNTIES</span>
              </div>
            </div>
          </div>

          <div className="apex-desktop-menu" aria-label="Main menu">
            <a href="#opportunities">Opportunities</a>
            <a href="#data-engine">Data Engine</a>
            <a href="#tiered-paywall">Tiered Paywall</a>
            <a href="#documentation">Documentation</a>
            <a href="#api">API &amp; Webhooks</a>
          </div>

          <div className="apex-nav-cta">
            <a href="/contact" className="apex-mini-button">Request API Key</a>
            <a href="/contact" className="apex-mini-button apex-mini-button-accent">Enterprise Sign In</a>
          </div>

          <button
            className="mobile-menu-button"
            type="button"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {isMenuOpen && (
          <div className="mobile-menu">
            <a href="#opportunities" onClick={() => setIsMenuOpen(false)}>Opportunities</a>
            <a href="#data-engine" onClick={() => setIsMenuOpen(false)}>Data Engine</a>
            <a href="#tiered-paywall" onClick={() => setIsMenuOpen(false)}>Tiered Paywall</a>
            <a href="#documentation" onClick={() => setIsMenuOpen(false)}>Documentation</a>
            <a href="#api" onClick={() => setIsMenuOpen(false)}>API &amp; Webhooks</a>
            <a href="/contact" onClick={() => setIsMenuOpen(false)}>Request API Key</a>
          </div>
        )}
      </nav>

      <div className="apex-status-strip">
        <span>RSARBOS DATA INTELLIGENCE // SURPLUS FUNDS</span>
        <span className="apex-status-feed">FEED: DOCKET-INGEST // 3/143 COUNTIES ACTIVE</span>
      </div>

      <main className="apex-platform-shell">
        <section className="apex-hero" id="data-engine">
          <div className="apex-hero-copy">
            <h1>Institutional Surplus Funds Intelligence &amp; Lead Marketplace</h1>
            <p>
              Automate skip-tracing, court audit scraping, and programmatic paywall infrastructure for surplus asset recovery
              operators across all 50 US states. Monopolize overage dockets before claims expire.
            </p>

            <div className="apex-hero-actions">
              <a href="#opportunities" className="apex-primary-action">Explore Live Pool ($1.4M+)</a>
              <a href="/contact" className="apex-secondary-action">Connect CRM / Webhook API</a>
            </div>

            <div className="apex-compliance-note">
              <span className="apex-note-icon" aria-hidden="true" />
              256-bit escrow vault
            </div>
          </div>

          <aside className="apex-summary-panel" aria-label="Opportunity pool summary">
            <div className="apex-summary-head">
              <span>DOCKET VELOCITY INDEX</span>
              <span className="apex-summary-trend">+18.4% WOW</span>
            </div>
            <div className="apex-summary-value">$1,482,910</div>

            <div className="apex-summary-chart" aria-hidden="true">
              <svg viewBox="0 0 320 90" preserveAspectRatio="none">
                <path d="M0 72 L28 68 L52 62 L84 66 L110 54 L128 48 L156 56 L185 50 L220 42 L252 30 L280 22 L320 14 L320 90 L0 90 Z" className="chart-fill" />
                <path d="M0 72 L28 68 L52 62 L84 66 L110 54 L128 48 L156 56 L185 50 L220 42 L252 30 L280 22 L320 14" className="chart-line" />
              </svg>
            </div>

            <div className="apex-summary-grid">
              <div>
                <label>Avg. Surplus Yield</label>
                <strong>$38,420</strong>
              </div>
              <div>
                <label>Avg. 33% Commission</label>
                <strong>$12,678</strong>
              </div>
            </div>
          </aside>
        </section>

        <section className="apex-metrics-strip" aria-label="Platform metrics">
          {PLATFORM_METRICS.map((metric) => (
            <article key={metric.label} className={`apex-metric metric-${metric.accent}`}>
              <label>{metric.label}</label>
              <strong>{metric.value}</strong>
              <span>{metric.detail}</span>
            </article>
          ))}
        </section>

        <section className="apex-opportunity-table" id="opportunities" aria-labelledby="opportunity-preview-heading">
          <div className="apex-section-head">
            <div>
              <p className="apex-kicker">Opportunity preview</p>
              <h2 id="opportunity-preview-heading">Discover, review, and qualify public-record surplus signals.</h2>
            </div>
            <div className="apex-filter-row" aria-label="Opportunity filters">
              <button type="button">State</button>
              <button type="button">County</button>
              <button type="button">Qualification</button>
            </div>
          </div>

          <div className="apex-table-wrap">
            <div className="apex-table-header">
              <span>Record</span>
              <span>Surplus</span>
              <span>Evidence</span>
              <span>Review</span>
              <span>Next action</span>
            </div>

            {OPPORTUNITY_ROWS.map(([id, amount, status, evidence, review, action]) => (
              <article key={id} className="apex-table-row">
                <div className="apex-table-cell apex-record-cell">
                  <strong>{id}</strong>
                  <small>Bexar, TX</small>
                </div>
                <div className="apex-table-cell">
                  <strong>{amount}</strong>
                  <span>{status}</span>
                </div>
                <div className="apex-table-cell">
                  <span>{evidence}</span>
                </div>
                <div className="apex-table-cell">
                  <span>{review}</span>
                </div>
                <div className="apex-table-cell apex-action-cell">
                  <button type="button">{action}</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="apex-tier-section" id="tiered-paywall">
          <div className="apex-section-head apex-section-head-tight">
            <div>
              <p className="apex-kicker">Tiered paywall</p>
              <h2>Choose the access level that matches your workflow.</h2>
            </div>
          </div>

          <div className="apex-tier-grid">
            {TIER_CARDS.map(({ name, blurb, features }) => (
              <article key={name} className="apex-tier-card">
                <span className="apex-tier-name">{name}</span>
                <p>{blurb}</p>
                <ul>
                  {features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <span className="apex-tier-note">Access model pending product release</span>
              </article>
            ))}
          </div>
        </section>

        <section className="apex-trust-section" id="documentation">
          <div className="apex-trust-copy">
            <p className="apex-kicker">Evidence &amp; trust</p>
            <h2>Built for traceable, reviewable intelligence.</h2>
            <p>
              RSARBOS prioritizes source accountability, jurisdiction-aware review, and transparent limitations so a
              discovered record is never mistaken for a confirmed recovery claim.
            </p>
          </div>

          <ul className="apex-trust-list">
            {TRUST_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
