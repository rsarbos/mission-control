import React, { useEffect, useState, useCallback } from 'react'
import { trackEvent } from '../utils/analytics'

type Verdict = 'WORTH_PURSUING' | 'WALKAWAY' | 'REVIEW_REQUIRED'

type ProofInsight = {
  id: string
  property: string
  address: string
  agent: string
  brokerage: string
  headline: string
  detail: string
  valueGap: string
  capRate: string
  verdict: Verdict
  zillowUrl: string
}

const PROOF_INSIGHTS: ProofInsight[] = [
  {
    id: 'ken-nguyen',
    property: '44 Moon Dance',
    address: 'Milpitas, CA 95035',
    agent: 'Kenneth Nguyen',
    brokerage: 'Compass',
    headline: '14.2% value gap in your Milpitas listings',
    detail: 'The comparable unit — 845 Fire Walk (identical 3BD/2.5BA/1,353 sqft) — shows Rent Zestimate of $4,197/mo. At 5.0% market cap rate, income supports ~$937K — a $148K gap below asking.',
    valueGap: '-$148K',
    capRate: '4.3% vs 5.0% market',
    verdict: 'WALKAWAY',
    zillowUrl: 'https://www.zillow.com/homedetails/44-Moon-Dance-Milpitas-CA-95035/',
  },
  {
    id: 'tod-montgomery',
    property: '720 Clementina St',
    address: 'San Francisco, CA 94103',
    agent: 'Todd Montgomery',
    brokerage: 'Compass',
    headline: '26.2% rent gap in your SOMA listings',
    detail: 'Income supports ~$2.8M at 3.5% market cap rate — a $988K premium above $3,788K asking. Rent doesn\'t justify the price at current market cap rates.',
    valueGap: '+$988K',
    capRate: '2.6% vs 3.5% market',
    verdict: 'WALKAWAY',
    zillowUrl: 'https://www.zillow.com/homedetails/720-Clementina-St-San-Francisco-CA-94103/316008400_zpid/',
  },
  {
    id: 'stephen-schulman',
    property: '7807 Breen Ave',
    address: 'Los Angeles, CA 90045',
    agent: 'Stephen Schulman',
    brokerage: 'Keller Williams',
    headline: 'ADU value ambiguity — $377K unpriced',
    detail: 'The 380 sqft ADU rents at ~$2,200/mo (~$377K value at 7% cap). Zestimate-to-asking doesn\'t reflect this — institutional underwriting resolves whether the ADU is included or not.',
    valueGap: '~$377K ADU',
    capRate: '7% implied for ADU',
    verdict: 'REVIEW_REQUIRED',
    zillowUrl: 'https://www.zillow.com/homedetails/7807-Breen-Ave-Los-Angeles-CA-90045/2075305745_zpid/',
  },
  {
    id: 'diana-patrick',
    property: '3226 Brant St',
    address: 'San Diego, CA 92103',
    agent: 'Diana Patrick',
    brokerage: 'Pacific Sotheby\'s',
    headline: '17.3% Mills Act equity gap in your 92103 listing',
    detail: 'Combined rent + Mills Act tax savings = $184,560/year. At 3.5% cap, income supports ~$5.27M — a $778K gap below $4,495K asking.',
    valueGap: '-$778K',
    capRate: '3.5% market',
    verdict: 'WORTH_PURSUING',
    zillowUrl: 'https://www.zillow.com/homedetails/3226-Brant-St-San-Diego-CA-92103/16971755_zpid/',
  },
  {
    id: 'colleen-cotter',
    property: '33 Precita Ave',
    address: 'San Francisco, CA 94110',
    agent: 'Colleen Cotter',
    brokerage: 'Coldwell Banker',
    headline: '17.3% mixed-use gap in your 94110 listing',
    detail: 'Combined rent: $7,400/mo ($88,800/year). At 6% cap rate for SF mixed-use, income supports ~$1.48M — a $255K gap above $1,225K asking.',
    valueGap: '-$255K',
    capRate: '6% mixed-use',
    verdict: 'WORTH_PURSUING',
    zillowUrl: 'https://www.zillow.com/homedetails/33-Precita-Ave-San-Francisco-CA-94110/194487499_zpid/',
  },
  {
    id: 'james-hurley',
    property: '1138 Taylor St',
    address: 'San Francisco, CA 94108',
    agent: 'James Hurley',
    brokerage: 'Vanguard',
    headline: '21.8% rent gap in your Nob Hill TIC',
    detail: 'At 3.5% market cap for SF TICs, income supports ~$3.87M — a $1.08M premium above asking. Rent doesn\'t justify the price at current market cap rates.',
    valueGap: '+$1.08M',
    capRate: '2.75% vs 3.5% market',
    verdict: 'WALKAWAY',
    zillowUrl: 'https://www.zillow.com/homedetails/1138-Taylor-St-San-Francisco-CA-94108/2037045836_zpid/',
  },
]

const VERDICT_LABELS: Record<Verdict, string> = {
  WORTH_PURSUING: 'Worth Pursuing',
  WALKAWAY: 'Walkaway',
  REVIEW_REQUIRED: 'Review Required',
}

const VERDICT_COLORS: Record<Verdict, 'status-green' | 'status-red' | 'status-amber'> = {
  WORTH_PURSUING: 'status-green',
  WALKAWAY: 'status-red',
  REVIEW_REQUIRED: 'status-amber',
}

export default function ProofCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % PROOF_INSIGHTS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isHovered])

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % PROOF_INSIGHTS.length)
    trackEvent('carousel_next', { index: activeIndex })
  }, [activeIndex])

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + PROOF_INSIGHTS.length) % PROOF_INSIGHTS.length)
    trackEvent('carousel_prev', { index: activeIndex })
  }, [activeIndex])

  const insight = PROOF_INSIGHTS[activeIndex]
  const verdictLabel = VERDICT_LABELS[insight.verdict]
  const verdictColor = VERDICT_COLORS[insight.verdict]

  return (
    <section className="proof-carousel-section" aria-label="RSARBOS underwriting insights">
      <div className="content-wrap">
        <div className="section-intro centered-copy">
          <p className="red-kicker"><span></span>Real Proof</p>
          <h2>UNDERWRITING INSIGHTS FROM LIVE PROPERTY DEALS</h2>
          <p>
            See the actual value gaps, cap rate discrepancies, and risk flags our
            underwriting engine uncovers — across <strong>{PROOF_INSIGHTS.length} recent analyst
            reviews</strong>.
          </p>
        </div>

        <div
          className="proof-carousel"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            className="carousel-nav carousel-nav-prev"
            type="button"
            aria-label="Previous insight"
            onClick={goPrev}
          >
            ‹
          </button>

          <div className="carousel-track">
            {PROOF_INSIGHTS.map((item, i) => (
              <article
                key={item.id}
                className={`proof-card ${i === activeIndex ? 'active' : ''} ${
                  i === activeIndex ? verdictColor : ''
                }`}
                aria-hidden={i !== activeIndex}
              >
                <div className="proof-card-header">
                  <div className="proof-property">
                    <strong className="proof-property-name">{item.property}</strong>
                    <span className="proof-address">{item.address}</span>
                  </div>
                  <div className="proof-agent">
                    <span className="proof-agent-name">{item.agent}</span>
                    <span className="proof-brokerage">{item.brokerage}</span>
                  </div>
                </div>

                <div className="proof-content">
                  <h3 className="proof-headline">{item.headline}</h3>
                  <p className="proof-detail">{item.detail}</p>

                  <div className="proof-metrics">
                    <div className="proof-metric">
                      <span className="metric-label">Value Gap</span>
                      <span className="metric-value">{item.valueGap}</span>
                    </div>
                    <div className="proof-metric">
                      <span className="metric-label">Cap Rate</span>
                      <span className="metric-value">{item.capRate}</span>
                    </div>
                  </div>
                </div>

                <div className="proof-card-footer">
                  <span className={`verdict-badge ${verdictColor}`}>
                    {verdictLabel}
                  </span>
                  <a
                    href={item.zillowUrl}
                    className="proof-source-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('proof_link_click', { property: item.property })}
                  >
                    View Listing →
                  </a>
                </div>
              </article>
            ))}
          </div>

          <button
            className="carousel-nav carousel-nav-next"
            type="button"
            aria-label="Next insight"
            onClick={goNext}
          >
            ›
          </button>
        </div>

        <div className="carousel-dots">
          {PROOF_INSIGHTS.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`dot ${i === activeIndex ? 'active' : ''}`}
              aria-label={`Go to insight ${i + 1}`}
              onClick={() => {
                setActiveIndex(i)
                trackEvent('carousel_dot_click', { index: i })
              }}
            />
          ))}
        </div>

        <div className="carousel-cta">
          <a
            className="primary-action shine-action"
            href="#free-dossier"
            onClick={() => trackEvent('carousel_cta_click', { source: 'proof_insights' })}
          >
            Analyze My Property
          </a>
          <span className="cta-note">Free 15-minute dossier — no payment required</span>
        </div>
      </div>
    </section>
  )
}
