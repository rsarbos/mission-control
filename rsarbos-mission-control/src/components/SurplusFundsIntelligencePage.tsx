import { useEffect } from 'react'
import rsarbosLogo from '../assets/logo.png'
import '../styles/surplus-funds.css'

type OpportunityRecord = {
  id: string
  county: string
  state: string
  amount: string
  status: string
  evidence: string
  review: string
  nextAction: string
}

const SUMMARY_METRICS = [
  { label: 'Discovered pool', value: '$14.2M+', detail: 'Total verified excess dockets', accent: 'teal' },
  { label: 'Skip accuracy', value: '98.4%', detail: 'Heir line & active phone match', accent: 'cyan' },
  { label: 'Unlock speed', value: '<30s', detail: 'Stripe webhook instant decrypt', accent: 'amber' },
  { label: 'Active monitoring', value: '3,143', detail: 'US counties & court jurisdictions', accent: 'teal' },
] as const

const OPPORTUNITIES: OpportunityRecord[] = [
  {
    id: 'TX-ALVARADO-0421',
    county: 'Bexar',
    state: 'TX',
    amount: '$184,920',
    status: 'Evidence verified',
    evidence: 'Recorded sale docket / claimant notice',
    review: 'Jurisdiction reviewed',
    nextAction: 'Queue outreach package',
  },
  {
    id: 'NY-SUFFOLK-1188',
    county: 'Suffolk',
    state: 'NY',
    amount: '$246,780',
    status: 'Owner match pending',
    evidence: 'Public notice + chain-of-title extract',
    review: 'County review in progress',
    nextAction: 'Request claimant validation',
  },
  {
    id: 'CA-RIVERSIDE-1932',
    county: 'Riverside',
    state: 'CA',
    amount: '$132,640',
    status: 'Source confirmed',
    evidence: 'Tax sale record + hearing notice',
    review: 'Qualification check passed',
    nextAction: 'Prepare investor packet',
  },
  {
    id: 'FL-ORANGE-0817',
    county: 'Orange',
    state: 'FL',
    amount: '$297,500',
    status: 'Claimant not linked',
    evidence: 'Sale summary + owner lookup',
    review: 'Eligibility review open',
    nextAction: 'Request additional records',
  },
]

const TIERS = [
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
] as const

const TRUST_ITEMS = [
  'Traceable public-record sources and docket lineage.',
  'Verifiable supporting evidence before a record is marked qualified.',
  'Jurisdiction-aware review for filing and state-specific procedures.',
  'Explicit verification status rather than assumed recoverability.',
  'Reproducible research with source references and review notes.',
  'Transparent limitations in any record that remains unqualified.',
] as const

export default function SurplusFundsIntelligencePage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'RSARBOS | Surplus Funds Intelligence'

    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div className="surplus-page">
      <div className="surplus-bg-grid" aria-hidden="true" />

      <header className="surplus-header">
        <nav className="surplus-nav" aria-label="Primary navigation">
          <div className="surplus-brand" aria-label="RSARBOS logo and brand">
            <img src={rsarbosLogo} alt="RSARBOS" className="surplus-logo" />
            <div className="surplus-brand-copy">
              <div className="surplus-brands">
                <span className="surplus-tag">RS</span>
                <span className="surplus-tag">ARBOS</span>
              </div>
              <div className="surplus-brand-meta">
                <span className="surplus-intel">INTELLIGENCE</span>
                <span className="surplus-status-dot">TERMINAL ONLINE</span>
                <span className="surplus-voice">3,143 COUNTIES</span>
              </div>
            </div>
          </div>

          <div className="surplus-nav-links" aria-label="Main menu">
            <a href="#opportunities">Opportunities</a>
            <a href="#data-engine">Data Engine</a>
            <a href="#tiered-paywall">Tiered Paywall</a>
            <a href="#documentation">Documentation</a>
            <a href="#api">API &amp; Webhooks</a>
          </div>

          <div className="surplus-nav-cta">
            <a href="/contact" className="surplus-cta quiet">Request API Key</a>
            <a href="/contact" className="surplus-cta accent">Enterprise Sign In</a>
          </div>
        </nav>
      </header>

      <div className="surplus-identity-bar">
        <span>RSARBOS DATA INTELLIGENCE // SURPLUS FUNDS</span>
        <span className="surplus-live-indicator">DEMO FEED / SAMPLE DOCKET INDEX</span>
      </div>

      <main className="surplus-main">
        <section className="surplus-hero" id="data-engine">
          <div className="surplus-hero-copy">
            <h1>Institutional Surplus Funds Intelligence &amp; Lead Marketplace</h1>
            <p>
              Identify, evaluate, and organize potential surplus-fund recovery opportunities using structured public-record
              intelligence, jurisdiction-aware qualification, and traceable supporting evidence.
            </p>

            <div className="surplus-actions">
              <a href="#opportunities" className="surplus-primary">Explore Live Pool</a>
              <a href="/contact" className="surplus-secondary">Access Data &amp; API</a>
            </div>

            <div className="surplus-evidence-note">
              <span className="surplus-note-mark" aria-hidden="true" />
              Sample public-record monitoring environment. Records remain unqualified until verified.
            </div>
          </div>

          <aside className="surplus-summary" aria-label="Demo opportunity summary">
            <div className="surplus-summary-header">
              <span>DEMO POOL</span>
              <span className="surplus-trend-tag">+18.4% WoW</span>
            </div>

            <div className="surplus-summary-number">$1,482,910</div>

            <div className="surplus-chart" aria-hidden="true">
              <svg viewBox="0 0 320 90" preserveAspectRatio="none">
                <path d="M0 72 L28 68 L52 62 L84 66 L110 54 L128 48 L156 56 L185 50 L220 42 L252 30 L280 22 L320 14 L320 90 L0 90 Z" className="chart-fill" />
                <path d="M0 72 L28 68 L52 62 L84 66 L110 54 L128 48 L156 56 L185 50 L220 42 L252 30 L280 22 L320 14" className="chart-line" />
              </svg>
            </div>

            <div className="surplus-summary-grid">
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

        <section className="surplus-metrics" aria-label="Platform metrics">
          {SUMMARY_METRICS.map((metric) => (
            <article key={metric.label} className={`surplus-metric metric-${metric.accent}`}>
              <label>{metric.label}</label>
              <strong>{metric.value}</strong>
              <span>{metric.detail}</span>
            </article>
          ))}
        </section>

        <section className="surplus-opportunities" id="opportunities">
          <div className="surplus-section-head">
            <div>
              <p className="surplus-kicker">OPPORTUNITY PREVIEW</p>
              <h2>Discover, review, and qualify public-record surplus signals.</h2>
            </div>
            <div className="surplus-filter-row" aria-label="Filter controls">
              <button type="button">State</button>
              <button type="button">County</button>
              <button type="button">Qualification</button>
            </div>
          </div>

          <div className="surplus-record-list" role="table" aria-label="Opportunity records">
            <div className="surplus-record-header" role="row">
              <span role="columnheader">Record</span>
              <span role="columnheader">Surplus</span>
              <span role="columnheader">Evidence</span>
              <span role="columnheader">Review</span>
              <span role="columnheader">Next Action</span>
            </div>

            {OPPORTUNITIES.map((item) => (
              <article key={item.id} className="surplus-record" role="row">
                <div className="record-id" role="cell">
                  <span className="record-code">{item.id}</span>
                  <small>
                    {item.county}, {item.state}
                  </small>
                </div>
                <div className="record-amount" role="cell">
                  <strong>{item.amount}</strong>
                  <span>{item.status}</span>
                </div>
                <div className="record-source" role="cell">
                  <span>{item.evidence}</span>
                </div>
                <div className="record-review" role="cell">
                  <span>{item.review}</span>
                </div>
                <div className="record-action" role="cell">
                  <button type="button">{item.nextAction}</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="surplus-tier-section" id="tiered-paywall">
          <div className="surplus-section-head narrow">
            <div>
              <p className="surplus-kicker">TIERED PAYWALL</p>
              <h2>Choose the access level that matches your workflow.</h2>
            </div>
          </div>

          <div className="surplus-tier-grid">
            {TIERS.map((tier) => (
              <article key={tier.name} className="surplus-tier-card">
                <span className="surplus-tier-label">{tier.name}</span>
                <p>{tier.blurb}</p>
                <ul>
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <span className="surplus-tier-note">Access model pending product release</span>
              </article>
            ))}
          </div>
        </section>

        <section className="surplus-trust" id="documentation">
          <div className="surplus-trust-copy">
            <p className="surplus-kicker">EVIDENCE &amp; TRUST</p>
            <h2>Built for traceable, reviewable intelligence.</h2>
            <p>
              RSARBOS prioritizes source accountability, jurisdiction-aware review, and transparent limitations so that a
              discovered record is never mistaken for a confirmed recovery claim.
            </p>
          </div>

          <ul className="surplus-trust-list">
            {TRUST_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
