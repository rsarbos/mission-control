import { useEffect, useState } from 'react'
import rsarbosLogo from '../assets/logo.png'
import '../styles/surplus-marketplace.css'

type SurplusListing = {
  id: string
  title: string
  county: string
  state: string
  propertyType: string
  area: string
  reportedSurplus: string
  minimumSurplus: number
  price: number
  status: 'discovered'
}

const LISTINGS: SurplusListing[] = [
  { id: 'PASCO-001', title: 'High-Value Individual Owner Lead', county: 'Pasco County', state: 'FL', propertyType: 'Single-family home', area: 'Port Richey', reportedSurplus: '$100,000+', minimumSurplus: 100000, price: 10940, status: 'discovered' },
  { id: 'PASCO-002', title: 'Named Individual Owner Lead', county: 'Pasco County', state: 'FL', propertyType: 'Mobile home', area: 'Hudson', reportedSurplus: '$70,000–$80,000', minimumSurplus: 70000, price: 7060, status: 'discovered' },
  { id: 'PASCO-003', title: 'Estate Lead — Named Representative', county: 'Pasco County', state: 'FL', propertyType: 'Single-family home', area: 'Zephyrhills', reportedSurplus: '$25,000–$30,000', minimumSurplus: 25000, price: 2890, status: 'discovered' },
  { id: 'PASCO-004', title: 'Vacant Land — Named Owner', county: 'Pasco County', state: 'FL', propertyType: 'Vacant land', area: 'Moon Lake', reportedSurplus: '$25,000–$30,000', minimumSurplus: 25000, price: 2610, status: 'discovered' },
  { id: 'PASCO-005', title: 'Joint Ownership Lead', county: 'Pasco County', state: 'FL', propertyType: 'Residential', area: 'New Port Richey', reportedSurplus: '$20,000–$25,000', minimumSurplus: 20000, price: 2380, status: 'discovered' },
  { id: 'PASCO-006', title: 'Named Individual Owner Lead', county: 'Pasco County', state: 'FL', propertyType: 'Residential', area: 'Pasco County', reportedSurplus: '$15,000–$20,000', minimumSurplus: 15000, price: 1760, status: 'discovered' },
  { id: 'PASCO-007', title: 'Named Individual Owner Lead', county: 'Pasco County', state: 'FL', propertyType: 'Residential', area: 'Hudson', reportedSurplus: '$15,000–$18,000', minimumSurplus: 15000, price: 1680, status: 'discovered' },
  { id: 'PASCO-008', title: 'Named Individual Owner Lead', county: 'Pasco County', state: 'FL', propertyType: 'Residential', area: 'Port Richey', reportedSurplus: '$15,000–$18,000', minimumSurplus: 15000, price: 1660, status: 'discovered' },
  { id: 'PASCO-009', title: 'Entity / Association Lead', county: 'Pasco County', state: 'FL', propertyType: 'Condominium', area: 'New Port Richey', reportedSurplus: '$12,000–$15,000', minimumSurplus: 12000, price: 1410, status: 'discovered' },
  { id: 'PASCO-010', title: 'Named Individual Owner Lead', county: 'Pasco County', state: 'FL', propertyType: 'Vacant land', area: 'Moon Lake', reportedSurplus: '$12,000–$15,000', minimumSurplus: 12000, price: 1315, status: 'discovered' },
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const AMOUNT_FILTERS = [
  { value: 'all', label: 'Any reported amount', matches: () => true },
  { value: '100000', label: '$100,000+', matches: (amount: number) => amount >= 100000 },
  { value: '50000', label: '$50,000–$99,999', matches: (amount: number) => amount >= 50000 && amount < 100000 },
  { value: '20000', label: '$20,000–$49,999', matches: (amount: number) => amount >= 20000 && amount < 50000 },
  { value: '10000', label: '$10,000–$19,999', matches: (amount: number) => amount >= 10000 && amount < 20000 },
] as const

export default function SurplusMarketplacePage() {
  const [search, setSearch] = useState('')
  const [county, setCounty] = useState('all')
  const [state, setState] = useState('all')
  const [amountFilter, setAmountFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const query = search.trim().toLowerCase()
  const selectedAmount = AMOUNT_FILTERS.find((filter) => filter.value === amountFilter) ?? AMOUNT_FILTERS[0]
  const filteredListings = LISTINGS.filter((listing) => {
    const matchesQuery = !query || [
      listing.id,
      listing.title,
      listing.propertyType,
      listing.area,
    ].some((value) => value.toLowerCase().includes(query))
    const matchesCounty = county === 'all' || listing.county === county
    const matchesState = state === 'all' || listing.state === state
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter

    return matchesQuery
      && matchesCounty
      && matchesState
      && matchesStatus
      && selectedAmount.matches(listing.minimumSurplus)
  })

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'RSARBOS | Surplus Funds Dossier Marketplace'

    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div className="public-site surplus-marketplace-page">
      <div className="ambient-glow" aria-hidden="true" />

      <header className="surplus-marketplace-header">
        <nav className="surplus-marketplace-nav" aria-label="Primary navigation">
          <a className="surplus-marketplace-brand" href="/" aria-label="RSARBOS home">
            <img src={rsarbosLogo} alt="RSARBOS" />
          </a>
          <div className="surplus-marketplace-links">
            <a href="#marketplace">Marketplace</a>
            <a href="#how-it-works">How It Works</a>
            <a href="/contact">Contact</a>
          </div>
        </nav>
      </header>

      <main className="surplus-marketplace-main">
        <section className="surplus-marketplace-hero">
          <p className="surplus-marketplace-eyebrow">RSARBOS · SURPLUS FUNDS RESEARCH</p>
          <h1>Surplus Funds Intelligence &amp; Dossier Marketplace</h1>
          <p className="surplus-marketplace-lede">
            Research-backed surplus-fund opportunities, organized into traceable dossiers for professional review.
          </p>
          <div className="surplus-marketplace-actions">
            <a className="surplus-marketplace-primary" href="#marketplace">Explore Available Dossiers</a>
            <a className="surplus-marketplace-secondary" href="#how-it-works">How It Works</a>
          </div>
        </section>

        <section
          className="surplus-marketplace-inventory"
          id="marketplace"
          aria-labelledby="surplus-marketplace-heading"
        >
          <div className="surplus-marketplace-section-heading">
            <div>
              <p className="surplus-marketplace-eyebrow">PASCO COUNTY · FLORIDA</p>
              <h2 id="surplus-marketplace-heading">Available dossier leads</h2>
              <p className="surplus-marketplace-subheading">
                Seller-supplied estimates and access prices. Case references, source files, and record dates were not supplied for public display.
              </p>
            </div>
            <span className="surplus-marketplace-count" aria-live="polite">
              {filteredListings.length} of {LISTINGS.length} listings
            </span>
          </div>

          <form className="surplus-marketplace-filters" onSubmit={(event) => event.preventDefault()}>
            <label className="surplus-marketplace-search">
              <span>Search listings</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Record ID, property type, or area"
              />
            </label>
            <label>
              <span>State</span>
              <select value={state} onChange={(event) => setState(event.target.value)}>
                <option value="all">All states</option>
                <option value="FL">Florida</option>
              </select>
            </label>
            <label>
              <span>County</span>
              <select value={county} onChange={(event) => setCounty(event.target.value)}>
                <option value="all">All counties</option>
                <option value="Pasco County">Pasco County</option>
              </select>
            </label>
            <label>
              <span>Reported surplus</span>
              <select value={amountFilter} onChange={(event) => setAmountFilter(event.target.value)}>
                {AMOUNT_FILTERS.map((filter) => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Dossier status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All statuses</option>
                <option value="discovered">Discovered · review pending</option>
              </select>
            </label>
          </form>

          {filteredListings.length > 0 ? (
            <div className="surplus-marketplace-grid">
            {filteredListings.map((listing) => (
              <article className="surplus-marketplace-card" key={listing.id}>
                <div className="surplus-marketplace-card-head">
                  <span className="surplus-marketplace-record-id">{listing.id}</span>
                  <span className="surplus-marketplace-status">Discovered · review pending</span>
                </div>
                <h3>{listing.title}</h3>
                <dl className="surplus-marketplace-details">
                  <div>
                    <dt>County / State</dt>
                    <dd>{listing.county}, {listing.state}</dd>
                  </div>
                  <div>
                    <dt>Area</dt>
                    <dd>{listing.area}</dd>
                  </div>
                  <div>
                    <dt>Property type</dt>
                    <dd>{listing.propertyType}</dd>
                  </div>
                  <div>
                    <dt>Reported surplus</dt>
                    <dd className="surplus-marketplace-amount">{listing.reportedSurplus}</dd>
                  </div>
                  <div className="surplus-marketplace-price-row">
                    <dt>Access price</dt>
                    <dd>{currency.format(listing.price)}</dd>
                  </div>
                </dl>
                <p className="surplus-marketplace-source-note">
                  Seller reports official Clerk-record sourcing. Source documents are not available for pre-purchase review.
                </p>
                <button className="surplus-marketplace-purchase" type="button" disabled>
                  Stripe checkout setup pending
                </button>
              </article>
            ))}
            </div>
          ) : (
            <p className="surplus-marketplace-empty-results" role="status">
              No listings match these filters. Try changing your search or selection.
            </p>
          )}

          <p className="surplus-marketplace-checkout-note" role="status">
            Online checkout and post-payment record delivery are not configured yet. No payment can be made from this page.
            <a href="/contact"> Contact RSARBOS about access.</a>
          </p>
          <p className="surplus-marketplace-disclaimer">
            These are seller-described leads, not legal determinations of ownership, entitlement, eligibility, or recoverability.
            Reported surplus amounts may change and must be independently confirmed with the relevant Clerk and applicable Florida procedures.
          </p>
        </section>

        <section
          className="surplus-marketplace-how"
          id="how-it-works"
          aria-labelledby="surplus-marketplace-how-heading"
        >
          <div className="surplus-marketplace-section-heading">
            <div>
              <p className="surplus-marketplace-eyebrow">PROCESS</p>
              <h2 id="surplus-marketplace-how-heading">How it works</h2>
            </div>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <h3>Discover an opportunity</h3>
                <p>Review the seller-provided listing information and its stated research status.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Review its source-backed dossier</h3>
                <p>When available, examine source references, supporting records, and unresolved questions.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Purchase access and continue your research</h3>
                <p>Checkout and secure delivery will be enabled after the payment and fulfillment workflow is configured.</p>
              </div>
            </li>
          </ol>
        </section>
      </main>

      <footer className="public-footer surplus-marketplace-footer">
        <div className="content-wrap">
          <div className="footer-bottom">
            <p>© 2026 RSARBOS Next-Gen Business Technology. All rights reserved.</p>
            <nav aria-label="Legal">
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
              <a href="/refund-policy">Refunds</a>
              <a href="/contact">Contact</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
