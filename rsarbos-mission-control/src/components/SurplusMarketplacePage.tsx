import { useEffect, useMemo, useState } from 'react'
import rsarbosLogo from '../assets/logo.png'
import '../styles/surplus-marketplace.css'

const MARKETPLACE_ROWS = [
  {
    id: 'ME-7M7',
    owner: 'Garah Johnson',
    county: 'Bexar',
    state: 'TX',
    amount: '$31,280.64',
    source: 'Skip trace active',
    status: 'Owner match',
    review: 'Source reviewed',
    eligibility: 'High',
  },
  {
    id: 'P30-TEER-PO2',
    owner: 'Dead Claim — Estate of Miller',
    county: 'Riverside',
    state: 'CA',
    amount: '$89,450.00',
    source: 'Double verified',
    status: 'Estate review',
    review: 'Estate review needed',
    eligibility: 'Medium',
  },
  {
    id: 'QM-5C42',
    owner: 'Commercial Strip Parcel',
    county: 'Orange',
    state: 'FL',
    amount: '$542,190.20',
    source: 'Court filing ready',
    status: 'Claim verified',
    review: 'Claim documentation ready',
    eligibility: 'High',
  },
  {
    id: 'P18-D49',
    owner: 'Residential Estate of Harris',
    county: 'Lubbock',
    state: 'TX',
    amount: '$114,800.00',
    source: 'Need claimant trace',
    status: 'Awaiting proof',
    review: 'Claimant trace needed',
    eligibility: 'Medium',
  },
  {
    id: 'P02-5F4',
    owner: 'Robert McVay Trust',
    county: 'Suffolk',
    state: 'NY',
    amount: '$42,500.00',
    source: 'Title verified',
    status: 'Active inquiry',
    review: 'Title reviewed',
    eligibility: 'Medium',
  },
  {
    id: 'A3-9T28',
    owner: 'Automotive Recovery Routing',
    county: 'King',
    state: 'WA',
    amount: '$18,700.00',
    source: 'Webhook ingest',
    status: 'Data minted',
    review: 'Source review needed',
    eligibility: 'High',
  },
]

const KEY_STATS = [
  { label: 'Sample records', value: '06', tagline: 'demo opportunity set' },
  { label: 'Jurisdictions', value: '05', tagline: 'sample states represented' },
  { label: 'Review statuses', value: '06', tagline: 'record-level review notes' },
  { label: 'Data status', value: 'Demo', tagline: 'not a live opportunity feed' },
]

export default function SurplusMarketplacePage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [jurisdictionFilter, setJurisdictionFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()

    return MARKETPLACE_ROWS.filter((item) => {
      const matchesSearch = !query || [
        item.id,
        item.owner,
        item.county,
        item.state,
        item.amount,
        item.source,
        item.status,
        item.review,
      ].some((value) => value.toLowerCase().includes(query))
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesJurisdiction = jurisdictionFilter === 'all' || item.state === jurisdictionFilter
      const matchesPriority = priorityFilter === 'all' || item.eligibility.toLowerCase() === priorityFilter

      return matchesSearch && matchesStatus && matchesJurisdiction && matchesPriority
    })
  }, [jurisdictionFilter, priorityFilter, search, statusFilter])

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'RSARBOS | Marketplace'

    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div className="marketplace-subpage public-site">
      <div className="ambient-glow" aria-hidden="true" />

      <header className="marketplace-header">
        <nav className="marketplace-nav" aria-label="Marketplace primary navigation">
          <div className="marketplace-brand" aria-label="RSARBOS marketplace brand">
            <img src={rsarbosLogo} alt="RSARBOS" className="marketplace-logo" />
            <div className="marketplace-brand-copy">
              <span className="marketplace-brand-row">RS ARBOS</span>
              <span className="marketplace-brand-subtitle">// INTELLIGENCE</span>
            </div>
          </div>

          <div className="marketplace-menu">
            <a href="#opportunities">Opportunities</a>
            <a href="#data-engine">Data Engine</a>
            <a href="#tiered-paywall">Access tiers</a>
            <a href="#documentation">Documentation</a>
            <a href="#api">API &amp; Webhooks</a>
          </div>

          <div className="marketplace-actions">
            <a href="/contact" className="marketplace-action muted">Request API access</a>
            <a href="/contact" className="marketplace-action accent">Contact enterprise</a>
          </div>
        </nav>
      </header>

      <main className="marketplace-shell">
        <div className="marketplace-demo-notice" role="note">
          <strong>Sample marketplace</strong>
          <span>Illustrative records only. This is not a live or verified opportunity feed.</span>
        </div>

        <section className="marketplace-topline">
          <div className="marketplace-pill-group">
            <a className="marketplace-pill active" href="#opportunities">Marketplace</a>
            <a className="marketplace-pill" href="#data-engine">Data Engine</a>
            <a className="marketplace-pill" href="#tiered-paywall">Access tiers</a>
            <a className="marketplace-pill" href="#documentation">Documentation</a>
          </div>

          <div className="marketplace-top-actions">
            <a href="/contact">Request API access</a>
            <a href="/contact" className="top-accent">Contact enterprise</a>
          </div>
        </section>

        <section className="marketplace-metrics" aria-label="Key metrics">
          {KEY_STATS.map((stat) => (
            <article key={stat.label} className="marketplace-stat-card">
              <span className="marketplace-stat-label">{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.tagline}</small>
            </article>
          ))}
        </section>

        <section className="marketplace-filter-bar" id="data-engine" aria-label="Opportunity search and filters">
          <div className="marketplace-filter-row">
            <label className="marketplace-search-label" htmlFor="marketplace-search">Search sample records</label>
            <input
              id="marketplace-search"
              className="marketplace-search-box"
              type="search"
              placeholder="Owner, record ID, state, county, or source"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="marketplace-filter-actions">
            <label>
              <span>Status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All statuses</option>
                {[...new Set(MARKETPLACE_ROWS.map((item) => item.status))].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Jurisdiction</span>
              <select value={jurisdictionFilter} onChange={(event) => setJurisdictionFilter(event.target.value)}>
                <option value="all">All states</option>
                {[...new Set(MARKETPLACE_ROWS.map((item) => item.state))].sort().map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Priority</span>
              <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
                <option value="all">All priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>
            </label>
          </div>
        </section>

        <section className="marketplace-board" id="opportunities">
          <div className="marketplace-board-intro">
            <p>Opportunities</p>
            <div className="board-badges">
              <span>Sample data</span>
              <span>Review status shown</span>
              <span>Not for reliance</span>
            </div>
          </div>

          <div className="marketplace-grid">
            {filteredRows.map((item) => (
              <article key={item.id} className="marketplace-card">
                <div className="marketplace-card-header">
                  <div>
                    <span className="card-tag">{item.id}</span>
                    <span className="card-state">{item.state}</span>
                  </div>
                  <span className="card-review">{item.eligibility} priority</span>
                </div>

                <div className="marketplace-card-body">
                  <div className="card-main-line">
                    <h3>{item.owner}</h3>
                    <span>{item.county}</span>
                  </div>

                  <div className="card-amount-block">
                    <span className="card-label">Illustrative amount</span>
                    <strong>{item.amount}</strong>
                    <small>{item.source}</small>
                  </div>

                  <div className="card-meta-grid">
                    <div>
                      <span>Status</span>
                      <strong>{item.status}</strong>
                    </div>
                    <div>
                      <span>Eligibility</span>
                      <strong>{item.eligibility}</strong>
                    </div>
                  </div>
                </div>

                <div className="marketplace-card-footer">
                  <a className="marketplace-primary" href="/contact">Request record access</a>
                </div>
              </article>
            ))}
          </div>
          {filteredRows.length === 0 && (
            <p className="marketplace-empty-state" role="status">No sample records match those search and filter settings.</p>
          )}
          <p className="marketplace-results-count" aria-live="polite">
            Showing {filteredRows.length} of {MARKETPLACE_ROWS.length} sample records
          </p>
        </section>

        <section className="marketplace-info-grid" id="tiered-paywall">
          <article>
            <p className="marketplace-section-kicker">Access tiers</p>
            <h2>Review the data before requesting access.</h2>
            <p>Access terms, record availability, and any fees are confirmed directly with RSARBOS.</p>
            <a href="/contact">Discuss access options</a>
          </article>
          <article id="documentation">
            <p className="marketplace-section-kicker">Documentation</p>
            <h2>Evidence status is not a recovery guarantee.</h2>
            <p>Sample labels illustrate a review workflow. They do not establish ownership, eligibility, or recoverability.</p>
          </article>
          <article id="api">
            <p className="marketplace-section-kicker">API &amp; webhooks</p>
            <h2>Talk with us about data access.</h2>
            <p>API keys and webhook availability are not provisioned through this demo.</p>
            <a href="/contact">Contact the team</a>
          </article>
        </section>
      </main>
    </div>
  )
}
