import React, { useEffect, useMemo, useRef, useState } from 'react'
import rsarbosLogo from '../assets/logo.png'

type Metric = {
  label: string
  value: string
  detail?: string
  tone?: 'green' | 'blue' | 'amber' | 'red' | 'purple'
}

type DetailRow = {
  label: string
  value: string
  tone?: 'green' | 'blue' | 'amber' | 'red'
}

type Signal = {
  text: string
  tone: 'green' | 'amber' | 'red' | 'blue'
}

type CalculatorInputs = {
  price: number
  downPct: number
  rate: number
  rent: number
  hoa: number
  taxRate: number
  insurance: number
  vacancyPct: number
}

const pages = [
  'Cover',
  'Decision Map',
  'Executive Decision',
  'Asset + Market',
  'Rental Thesis',
  'Value + ARV',
  'Strategy + Risk',
  'Neighborhood Intel',
  'Calculator',
  'Sources',
] as const

const coverMetrics: Metric[] = [
  { label: 'List Price', value: '$500K' },
  { label: 'Est. Rent/mo', value: '$4,410', tone: 'green' },
  { label: 'Est. Value', value: '$515K', tone: 'blue' },
  { label: 'HOA / mo', value: '$534', tone: 'amber' },
]

const coverStats: Metric[] = [
  { label: 'Property Type', value: 'Condo', detail: 'Downstairs unit, 810 sqft' },
  { label: 'Year Built', value: '1970', detail: 'Systems inspection advised' },
  { label: 'DOM Trend', value: '8 days', detail: '95118 median (fast market)', tone: 'blue' },
  { label: 'MLS ID', value: 'ML82047088', detail: 'Active listing' },
]

const decisionMap = [
  ['Executive Decision', '02', 'Verdict, best-fit buyer profile, and the one question that decides the deal.'],
  ['Asset + Market Context', '03', 'Property profile, neighborhood scores, school ratings, crime data, and buyer pool.'],
  ['Rental Thesis', '04', 'RentCast estimate, nearby rental comps, rent realism test, and cash-flow calculator.'],
  ['Value + ARV', '05', 'Current value, light-renovation ARV, moderate upside, and flip caution.'],
  ['Strategy + Risk', '06', 'Best buyer profiles, risk register, walkaway triggers, and diligence checklist.'],
  ['Neighborhood Intelligence', '07', 'Walk Score, school ratings, crime index, and market velocity for 95118.'],
  ['Cash-Flow Calculator', '08', 'Interactive model: input your down payment, rate, rent, and see monthly cash flow instantly.'],
  ['Source Appendix', '09', 'RentCast, Redfin, AVM/ARV notes, and due diligence action items.'],
]

const executiveStats: Metric[] = [
  { label: 'Verdict', value: 'Worth Pursuing', detail: 'Subject to HOA + rent proof', tone: 'green' },
  { label: 'Best Buyer', value: 'Investor / First-Timer', detail: 'Entry-price angle', tone: 'blue' },
  { label: 'Main Question', value: 'Rent Realism', detail: 'Can $4.4K/mo verify?', tone: 'amber' },
]

const attentionSignals: Signal[] = [
  { tone: 'green', text: '$500K list price is a rare lower-ticket entry into San Jose 95118, where median home prices exceed $1.5M.' },
  { tone: 'green', text: 'RentCast estimate of $4,410/mo creates a compelling rental headline if it holds under scrutiny.' },
  { tone: 'green', text: 'Direct Shawn Dr comps support a current value range of $500K-$550K, limiting immediate downside.' },
  { tone: 'green', text: '95118 DOM is 8 days -- fast-moving market reduces holding-period risk.' },
]

const cautionSignals: Signal[] = [
  { tone: 'amber', text: 'HOA fee at $534/mo materially affects cash flow and investor appetite.' },
  { tone: 'amber', text: 'RentCast subject attributes appear incomplete; rent must be manually verified against true 2BD/1BA condo comps.' },
  { tone: 'amber', text: 'Major renovations may be constrained by HOA rules, CC&Rs, and special assessment risk.' },
  { tone: 'amber', text: '1970 build requires systems inspection (plumbing, electrical, HVAC, windows).' },
]

const propertyRows: DetailRow[] = [
  { label: 'Address', value: '1314 Shawn Dr #1' },
  { label: 'Location', value: 'San Jose, CA 95118' },
  { label: 'Property Type', value: 'Condo / Downstairs Unit' },
  { label: 'Beds / Baths', value: '2 BD / 1 BA' },
  { label: 'Living Area', value: '~ 810 sqft' },
  { label: 'Year Built', value: '1970' },
  { label: 'HOA', value: '$534/mo', tone: 'amber' },
  { label: 'MLS ID', value: 'ML82047088' },
]

const valueRows: DetailRow[] = [
  { label: 'Current List Price', value: '$500,000' },
  { label: 'Estimated Current Value', value: '$500K-$550K', tone: 'blue' },
  { label: 'Most Likely Value', value: '~ $515K', tone: 'blue' },
  { label: 'Direct Condo Comps', value: '$500K-$548K' },
  { label: '95118 Median Home Price', value: '$1.55M' },
  { label: '95118 Median $/sf', value: '$938/sf' },
  { label: 'ZIP Sale/List Ratio', value: '102%', tone: 'green' },
  { label: 'Market Velocity (DOM)', value: '8 days', tone: 'green' },
]

const rentStats: Metric[] = [
  { label: 'RentCast Estimate', value: '$4,410', detail: 'Monthly estimate', tone: 'green' },
  { label: 'Low Estimate', value: '$3,520', detail: 'Downside case', tone: 'amber' },
  { label: 'High Estimate', value: '$5,300', detail: 'Upside case', tone: 'blue' },
  { label: 'HOA Drag', value: '$534', detail: 'Monthly fee', tone: 'red' },
]

const rentComps = [
  ['1343 Scossa Ave Apt 1', '$2,900', '$3.58', '0.09 mi', '2/1 - 810 sf'],
  ['4494 Silva Ave', '$4,600', '$3.51', '0.15 mi', '3/2 - 1,312 sf'],
  ['4992 Corbin Ave', '$4,550', '$3.23', '0.21 mi', '4/2 - 1,408 sf'],
  ['1312 Kipling Ct', '$4,600', '$3.70', '0.22 mi', '3/2 - 1,242 sf'],
  ['5028 Trenary Way', '$4,200', '$3.41', '0.27 mi', '3/2 - 1,232 sf'],
]

const rentalSignals: Signal[] = [
  { tone: 'green', text: 'Nearby 3BD/2BA SFR rents cluster around $4,200-$4,600.' },
  { tone: 'green', text: '95118 rental demand is sustained by tech commuters and San Jose State proximity.' },
  { tone: 'green', text: 'If rent verifies above $3,500, the asset becomes materially more interesting.' },
]

const rentWarnings: Signal[] = [
  { tone: 'amber', text: 'Closest 2BD/1BA 810 sf rental comp is $2,900 -- not $4,410.' },
  { tone: 'amber', text: 'Higher rent comps are larger 3-4BD single-family homes, not comparable condos.' },
  { tone: 'amber', text: 'Use $2,900, $3,500, and $4,410 scenarios before claiming cash flow. See calculator on page 08.' },
]

const saleCompRows: DetailRow[] = [
  { label: '1351 Shawn Dr #2', value: '$500K - 903 sf' },
  { label: '1322 Shawn Dr #3', value: '$548K - ~810 sf' },
  { label: '1330 Shawn Dr #1', value: '~$516K - est.' },
  { label: '92 Rancho Dr Unit B', value: '$550K - 918 sf' },
  { label: 'Current Market Value', value: '$500K-$550K', tone: 'blue' },
  { label: 'Most Likely Value', value: '~ $515K', tone: 'blue' },
]

const renovationRows: DetailRow[] = [
  { label: 'Light Cosmetic Updates', value: '$540K-$565K', tone: 'green' },
  { label: 'Moderate Renovation', value: '$575K-$620K', tone: 'blue' },
  { label: 'Full Gut Renovation', value: '$650K-$720K', tone: 'amber' },
  { label: 'Best Near-Term Path', value: 'Light / moderate refresh' },
  { label: 'Full-Gut Caveat', value: 'HOA/CC&R dependent', tone: 'amber' },
]

const arvStats: Metric[] = [
  { label: 'Current Value', value: '$500K-$550K', detail: 'Direct comp supported', tone: 'green' },
  { label: 'Light ARV', value: '$540K-$565K', detail: 'Lower risk improvement path', tone: 'amber' },
  { label: 'Full ARV', value: '$650K-$720K', detail: 'Needs heavy proof + HOA clearance', tone: 'red' },
]

const strategyRows = [
  ['Buy-and-hold rental', '8/10', 'Strong if rent verifies above conservative case and HOA has no hidden assessment risk.', 'green'],
  ['First-time investor entry', '8/10', 'Clear low-ticket San Jose entry narrative with professional decision support.', 'green'],
  ['Light renovation resale', '6/10', 'Potential upside if acquired well and updated cleanly, but margin is not massive.', 'blue'],
  ['Full flip / gut renovation', '4/10', 'Possible, but too dependent on HOA rules, construction budget, and upper comp validation.', 'amber'],
  ['Passive cash-flow buyer', '5/10', 'Only works if debt, HOA, insurance, vacancy, and rent scenario pencil clearly.', 'amber'],
]

const riskRows = [
  ['HOA fee / special assessment risk', 'High', 'Review HOA financials, reserves, minutes, special assessments, litigation, insurance coverage.', 'red'],
  ['Rent estimate overstatement', 'Medium', 'Verify against true 2BD/1BA condo rentals, not larger SFR comps.', 'amber'],
  ['Renovation restrictions', 'Medium', 'Review CC&Rs and HOA approval process before relying on rehab upside.', 'amber'],
  ['1970 build systems', 'Medium', 'Inspect plumbing, electrical, HVAC, moisture, windows, and interior condition.', 'amber'],
  ['Interest rate sensitivity', 'Medium', 'Model 6.5% and 7.5% rates in calculator. At 7.5%, cash flow turns negative on conservative rent.', 'amber'],
  ['Exit buyer pool', 'Known', 'Price and finish for first-time buyers/investors, not luxury resale.', 'blue'],
]

const neighborhoodGroups = [
  {
    title: 'Walk Score & Transit',
    metrics: [
      ['Walk Score', '56', 56, 'amber', 'Somewhat Walkable -- errands possible on foot, but a car is needed for most daily trips.'],
      ['Transit Score', '42', 42, 'amber', 'Some Transit -- limited bus routes nearby; car-dependent for most commutes.'],
      ['Bike Score', '68', 68, 'green', 'Bikeable -- flat terrain, some bike lanes. VTA Light Rail accessible within 1.5 mi.'],
    ],
  },
  {
    title: 'School Ratings (GreatSchools)',
    metrics: [
      ['Elementary', '5/10', 50, 'amber', 'Allen at Steinbeck (K-5) -- average performance, below district median.'],
      ['Middle', '6/10', 60, 'blue', 'Castillero Middle -- slightly above average, strong arts program.'],
      ['High School', '6.4/10', 64, 'blue', 'Pioneer High / Gunderson -- mixed ratings. Family buyers may prioritize school choice.'],
    ],
  },
  {
    title: 'Crime & Safety Index',
    metrics: [
      ['Violent Crime', 'Low', 25, 'green', 'Well below national average. 95118 is among the safer San Jose ZIPs.'],
      ['Property Crime', 'Moderate', 55, 'amber', 'Vehicle break-ins and package theft are the primary concerns. Typical for urban-suburban fringe.'],
      ['Overall Safety', 'B+', 72, 'green', 'Safer than 65% of U.S. neighborhoods. Good for rental tenant retention.'],
    ],
  },
  {
    title: 'Market Velocity & Trends',
    metrics: [
      ['95118 Median DOM', '8 days', 16, 'blue', 'Extremely fast market. Listings go pending in under two weeks on average.'],
      ['Sale/List Ratio', '102%', 100, 'green', 'Properties sell at or above list. Expect competition and minimal negotiation room.'],
      ['Price Trend (YoY)', '+3.2%', 55, 'green', 'Modest appreciation. Not a boom market, but stable equity growth.'],
    ],
  },
]

const sources = [
  ['Listing', 'Redfin / MLS Listing Data', 'Address, list price ($500,000), MLS reference ML82047088, property profile, HOA fee ($534/mo), size (~810 sqft), year built (1970), and public listing context. Sourced June 3, 2026.'],
  ['Rent', 'RentCast Rental Report', 'Estimated monthly rent of $4,410, low/high range of $3,520-$5,300, and nearby rental comps within 1 mile. Report dated May 30, 2026. RentCast aggregates publicly available online listing data.'],
  ['Comps', 'AVM / ARV Analysis', 'Direct Shawn Dr comps (1351, 1322, 1330), nearby condo comps (92 Rancho Dr), current value range $500K-$550K, and renovation scenarios based on local contractor pricing and permit data.'],
  ['Neighborhood', 'Walk Score, School, Crime Data', 'Walk Score 56, Transit Score 42, Bike Score 68. School ratings from GreatSchools.org (Allen at Steinbeck 5/10, Castillero 6/10, Pioneer/Gunderson ~6.4/10). Crime index from AreaVibes and NeighborhoodScout, June 2026.'],
  ['Market', 'DOM & Market Trends', '95118 median DOM 8 days, sale/list ratio 102%, YoY price trend +3.2% from Redfin Market Insights and local MLS data, May-June 2026.'],
  ['Risk', 'Due Diligence Items', 'HOA docs, reserves, rental restrictions, special assessments, inspection, CC&Rs, renovation approvals, and rent verification. California requires 10% minimum HOA reserves per Davis-Stirling Act; verify actual reserve study.'],
]

const defaultInputs: CalculatorInputs = {
  price: 500000,
  downPct: 20,
  rate: 6.75,
  rent: 3500,
  hoa: 534,
  taxRate: 1.15,
  insurance: 120,
  vacancyPct: 10,
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

function calculate(inputs: CalculatorInputs, rent = inputs.rent) {
  const down = inputs.price * (inputs.downPct / 100)
  const loan = inputs.price - down
  const monthlyRate = inputs.rate / 100 / 12
  const months = 360
  const payment = loan > 0
    ? (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    : 0
  const tax = (inputs.price * (inputs.taxRate / 100)) / 12
  const vacancy = rent * (inputs.vacancyPct / 100)
  const opEx = payment + inputs.hoa + tax + inputs.insurance + vacancy
  const cash = rent - opEx
  const noi = (rent * 12) - ((inputs.hoa + tax + inputs.insurance + vacancy) * 12)
  const cap = inputs.price > 0 ? noi / inputs.price : 0
  const coc = down > 0 ? (cash * 12) / down : 0

  return { loan, payment, opEx, cash, cap, coc }
}

function ToneText({ tone, children }: { tone?: string; children: React.ReactNode }) {
  return <span className={tone ? `sample-tone-${tone}` : undefined}>{children}</span>
}

function SectionHeader({ title, page }: { title: string; page: string }) {
  return (
    <div className="sample-page-header">
      <div className="sample-page-brand">
        <img src={rsarbosLogo} alt="RSARBOS" />
        <span>RSARBOS Investment Dossier</span>
      </div>
      <span>{title}</span>
      <span>{page} / 09</span>
    </div>
  )
}

function StatGrid({ items, columns = 3 }: { items: Metric[]; columns?: 3 | 4 }) {
  return (
    <div className={`sample-stat-grid cols-${columns}`}>
      {items.map((item) => (
        <article className="sample-stat" key={`${item.label}-${item.value}`}>
          <span>{item.label}</span>
          <strong><ToneText tone={item.tone}>{item.value}</ToneText></strong>
          {item.detail && <p>{item.detail}</p>}
        </article>
      ))}
    </div>
  )
}

function RowCard({ title, rows }: { title: string; rows: DetailRow[] }) {
  return (
    <article className="sample-card">
      <h3>{title}</h3>
      <div className="sample-rows">
        {rows.map((row) => (
          <div className="sample-row" key={`${title}-${row.label}`}>
            <span>{row.label}</span>
            <strong><ToneText tone={row.tone}>{row.value}</ToneText></strong>
          </div>
        ))}
      </div>
    </article>
  )
}

function SignalList({ title, tone, signals }: { title: string; tone: string; signals: Signal[] }) {
  return (
    <article className={`sample-card sample-card-${tone}`}>
      <h3><ToneText tone={tone}>{title}</ToneText></h3>
      <div className="sample-signals">
        {signals.map((signal) => (
          <p key={signal.text}>
            <span className={`sample-dot sample-dot-${signal.tone}`}>{signal.tone === 'green' ? '✓' : '!'}</span>
            {signal.text}
          </p>
        ))}
      </div>
    </article>
  )
}

function Note({ children, tone = 'blue' }: { children: React.ReactNode; tone?: 'blue' | 'red' | 'amber' }) {
  return <div className={`sample-note-block sample-note-${tone}`}>{children}</div>
}

function SampleDossierPage() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([])
  const [activePage, setActivePage] = useState(0)
  const [inputs, setInputs] = useState(defaultInputs)
  const calculation = useMemo(() => calculate(inputs), [inputs])
  const scenarios = useMemo(() => [
    ['Conservative ($2,900)', calculate(inputs, 2900)],
    ['Base Case ($3,500)', calculate(inputs, 3500)],
    ['RentCast ($4,410)', calculate(inputs, 4410)],
  ] as const, [inputs])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.38) {
          const index = sectionRefs.current.indexOf(entry.target as HTMLElement)
          if (index >= 0) setActivePage(index)
        }
      })
    }, { threshold: [0.38, 0.6] })

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  function goTo(index: number) {
    const nextIndex = Math.max(0, Math.min(pages.length - 1, index))
    setActivePage(nextIndex)
    sectionRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function updateInput(key: keyof CalculatorInputs, value: string) {
    const nextValue = Number(value)
    setInputs((current) => ({ ...current, [key]: Number.isFinite(nextValue) ? nextValue : 0 }))
  }

  return (
    <div className="sample-dossier-page">
      <nav className="sample-dossier-toolbar" aria-label="Dossier navigation">
        <button type="button" onClick={() => goTo(activePage - 1)} aria-label="Previous dossier section">← Prev</button>
        <span>{activePage + 1} / {pages.length} · {pages[activePage]}</span>
        <button type="button" onClick={() => goTo(activePage + 1)} aria-label="Next dossier section">Next →</button>
        <button type="button" className="sample-toolbar-primary" onClick={() => window.print()}>Print / Save PDF</button>
      </nav>

      <main className="sample-dossier-deck">
        <section className="sample-page sample-cover" ref={(node) => { sectionRefs.current[0] = node }}>
          <div className="sample-cover-media">
            <img className="sample-cover-main" src="/dossier/property-front.png" alt="1314 Shawn Dr property front" />
            <div>
              <img src="/dossier/property-street.png" alt="1314 Shawn Dr street view" />
              <img src="/dossier/property-map.png" alt="1314 Shawn Dr map view" />
            </div>
            <div className="sample-cover-copy">
              <span>Investment Dossier</span>
              <h1>1314 Shawn Dr #1</h1>
              <p>San Jose, CA 95118 · Prepared June 3, 2026</p>
            </div>
          </div>

          <div className="sample-page-body">
            <StatGrid items={coverMetrics} columns={4} />
            <article className="sample-card sample-card-navy">
              <p className="sample-kicker">Executive Summary</p>
              <h2>A disciplined entry point into San Jose with a rental thesis that demands verification.</h2>
              <p>At $500K, this 2BD/1BA condo offers one of the lowest-ticket entry points in 95118. The RentCast estimate of $4,410/mo creates an attractive headline, but the deal only works if rent, HOA rules, and renovation constraints verify. This dossier provides the data, the calculator, and the risk register to make that decision in under 15 minutes.</p>
            </article>
            <StatGrid items={coverStats} columns={4} />
            <Note><b>Valid through:</b> June 10, 2026. Market conditions, interest rates, and listing status can change. This dossier is a starting point, not a substitute for inspection, appraisal, or professional advice.</Note>
          </div>
          <footer>RSARBOS · 1314 Shawn Dr #1 · San Jose, CA 95118 <span>Confidential · For client review only</span></footer>
        </section>

        <section className="sample-page" ref={(node) => { sectionRefs.current[1] = node }}>
          <SectionHeader title="Decision Map" page="01" />
          <div className="sample-page-body">
            <h2 className="sample-section-title">From opportunity to proof: what this dossier covers.</h2>
            <p className="sample-copy">Each section builds on the last. Start with the verdict, then drill into rent, value, risk, and the exact steps to verify before writing an offer.</p>
            <div className="sample-map-grid">
              {decisionMap.map(([title, page, description], index) => (
                <button type="button" className="sample-map-card" key={title} onClick={() => goTo(index + 2)}>
                  <strong>{title}</strong>
                  <span>{page}</span>
                  <p>{description}</p>
                </button>
              ))}
            </div>
            <article className="sample-card sample-card-blue">
              <h3><ToneText tone="blue">How to use this dossier</ToneText></h3>
              <p>Read pages 02 and 03 first for the verdict. If the deal still interests you, spend 10 minutes on the rental thesis (04) and calculator (08) with your actual loan terms. Use the risk register (06) as your inspection and offer checklist.</p>
            </article>
          </div>
          <footer>Conclusion → Analysis → Evidence <span>Confidential · For client review only</span></footer>
        </section>

        <section className="sample-page" ref={(node) => { sectionRefs.current[2] = node }}>
          <SectionHeader title="Executive Decision" page="02" />
          <div className="sample-page-body">
            <h2 className="sample-section-title">Should this deal move forward?</h2>
            <StatGrid items={executiveStats} />
            <div className="sample-grid-two">
              <SignalList title="Why it deserves attention" tone="green" signals={attentionSignals} />
              <SignalList title="Why it is not automatic" tone="amber" signals={cautionSignals} />
            </div>
            <article className="sample-card">
              <h3>Investor-facing summary</h3>
              <p><b>This is a decision engine, not a guarantee.</b> The deal has a real rental hook, a low San Jose entry point, and multiple exit paths. The opportunity is attractive only if the rent thesis, HOA economics, and renovation rules verify. Do not proceed on the RentCast headline alone.</p>
            </article>
          </div>
          <footer>Primary decision page <span>Answer first, proof later</span></footer>
        </section>

        <section className="sample-page" ref={(node) => { sectionRefs.current[3] = node }}>
          <SectionHeader title="Asset + Market Context" page="03" />
          <div className="sample-page-body">
            <h2 className="sample-section-title">What is the asset, and how does it sit in the market?</h2>
            <div className="sample-grid-two">
              <RowCard title="Property Profile" rows={propertyRows} />
              <RowCard title="Value Context" rows={valueRows} />
            </div>
            <div className="sample-grid-two">
              <article className="sample-card sample-card-blue">
                <h3><ToneText tone="blue">Why buyers stop scrolling</ToneText></h3>
                <p>The headline is simple: a roughly $500K San Jose entry point in a ZIP where broader home prices are far higher. That contrast creates immediate curiosity for first-time investors and buyers priced out of traditional SFR inventory. With 8-day median DOM, properties here do not sit.</p>
              </article>
              <article className="sample-card sample-card-amber">
                <h3><ToneText tone="amber">Why the market may hesitate</ToneText></h3>
                <p>The HOA fee, condo restrictions, 1970 build, and renovation limitations can narrow the investor pool. The deal needs to be sold as a disciplined entry-price/rent thesis, not as a guaranteed flip. School ratings in the immediate vicinity are mixed; buyers with children may look elsewhere.</p>
              </article>
            </div>
          </div>
          <footer>Asset + market context <span>Condo-specific risk matters as much as purchase price</span></footer>
        </section>

        <section className="sample-page" ref={(node) => { sectionRefs.current[4] = node }}>
          <SectionHeader title="Rental Thesis" page="04" />
          <div className="sample-page-body">
            <h2 className="sample-section-title">Can this $500K San Jose asset really rent near $4.4K?</h2>
            <StatGrid items={rentStats} columns={4} />
            <div className="sample-rent-table">
              <strong>Rental Comp</strong><strong>Rent</strong><strong>$/sf</strong><strong>Dist.</strong><strong>Layout</strong>
              {rentComps.flat().map((cell, index) => <span key={`${cell}-${index}`}>{cell}</span>)}
            </div>
            <div className="sample-grid-two">
              <SignalList title="Strong rental signal" tone="green" signals={rentalSignals} />
              <SignalList title="Rent realism warning" tone="amber" signals={rentWarnings} />
            </div>
            <Note tone="amber"><b>Stress-test before you trust:</b> Run the $2.9K, $3.5K, and $4.4K rent scenarios in the cash-flow calculator (page 08) with your actual loan terms. If only the $4.4K case works, the deal is speculation, not investment.</Note>
          </div>
          <footer>Rental thesis <span>High headline value, but rent mix needs manual verification</span></footer>
        </section>

        <section className="sample-page" ref={(node) => { sectionRefs.current[5] = node }}>
          <SectionHeader title="Value + ARV" page="05" />
          <div className="sample-page-body">
            <h2 className="sample-section-title">What is it worth today, and what could it be worth after updates?</h2>
            <div className="sample-grid-two">
              <RowCard title="Direct Sale Comp View" rows={saleCompRows} />
              <RowCard title="Renovation Scenario View" rows={renovationRows} />
            </div>
            <StatGrid items={arvStats} />
            <div className="sample-grid-two">
              <article className="sample-card sample-card-blue">
                <h3><ToneText tone="blue">Best thesis</ToneText></h3>
                <p>Buy near fair value, verify rent, perform light or moderate updates, then choose between stabilized rental or cleaner resale positioning. The 8-day DOM in 95118 means exit liquidity is strong if priced correctly.</p>
              </article>
              <article className="sample-card sample-card-amber">
                <h3><ToneText tone="amber">What not to oversell</ToneText></h3>
                <p>Do not present the $650K-$720K full-gut ARV as base case. In a condo/HOA asset, aggressive renovation upside depends on rules, budgets, buyer demand, and comp support. The safer bet is light cosmetic work that improves rentability and resale appeal without board approval.</p>
              </article>
            </div>
          </div>
          <footer>Value + ARV <span>ARV range should be scenario-based, not one magic number</span></footer>
        </section>

        <section className="sample-page" ref={(node) => { sectionRefs.current[6] = node }}>
          <SectionHeader title="Strategy + Risk" page="06" />
          <div className="sample-page-body">
            <h2 className="sample-section-title">Which strategy fits, and what could kill it?</h2>
            <div className="sample-score-table">
              <strong>Strategy</strong><strong>Fit</strong><strong>Reason</strong>
              {strategyRows.map(([strategy, fit, reason, tone]) => (
                <React.Fragment key={strategy}>
                  <span>{strategy}</span><b className={`sample-tone-${tone}`}>{fit}</b><span>{reason}</span>
                </React.Fragment>
              ))}
            </div>
            <div className="sample-score-table">
              <strong>Risk</strong><strong>Severity</strong><strong>Clearance Path</strong>
              {riskRows.map(([risk, severity, path, tone]) => (
                <React.Fragment key={risk}>
                  <span>{risk}</span><b className={`sample-tone-${tone}`}>{severity}</b><span>{path}</span>
                </React.Fragment>
              ))}
            </div>
            <Note tone="red"><b>Walkaway triggers:</b> Walk away if: (1) HOA reserves are underfunded or a special assessment is pending; (2) true 2BD/1BA condo rent is below $3,200; (3) CC&Rs prohibit rentals or cap them below your needs; (4) inspection reveals &gt;$25K in deferred maintenance; (5) your lender requires 25% down and the deal still does not cash-flow at $3,500 rent.</Note>
          </div>
          <footer>Strategy + risk register <span>The deal lives or dies in HOA + rent verification</span></footer>
        </section>

        <section className="sample-page" ref={(node) => { sectionRefs.current[7] = node }}>
          <SectionHeader title="Neighborhood Intelligence" page="07" />
          <div className="sample-page-body">
            <h2 className="sample-section-title">Walkability, schools, safety, and market velocity.</h2>
            <div className="sample-grid-two">
              {neighborhoodGroups.map((group) => (
                <article className="sample-card" key={group.title}>
                  <h3>{group.title}</h3>
                  <div className="sample-metric-list">
                    {group.metrics.map(([label, value, width, tone, description]) => (
                      <div className="sample-metric-item" key={`${group.title}-${label}`}>
                        <div>
                          <span>{label}</span>
                          <b className={`sample-tone-${tone}`}>{value}</b>
                        </div>
                        <div className="sample-meter"><span className={`sample-meter-${tone}`} style={{ width: `${width}%` }}></span></div>
                        <p>{description}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <Note><b>Neighborhood takeaway:</b> 95118 is a safe, moderately walkable, family-oriented area with average schools and fast-moving inventory. It attracts first-time buyers and investors, not luxury buyers. The safety profile supports rental tenant retention, but school ratings may limit family-tenant demand.</Note>
          </div>
          <footer>Neighborhood intelligence <span>Data sourced June 2026</span></footer>
        </section>

        <section className="sample-page" ref={(node) => { sectionRefs.current[8] = node }}>
          <SectionHeader title="Cash-Flow Calculator" page="08" />
          <div className="sample-page-body">
            <h2 className="sample-section-title">Model your numbers. See your cash flow in real time.</h2>
            <p className="sample-copy">Adjust purchase price, down payment, interest rate, and rent. The calculator updates instantly. Use this to test the three rent scenarios before you write an offer.</p>
            <div className="sample-calculator-grid">
              {[
                ['Purchase Price ($)', 'price', 1],
                ['Down Payment (%)', 'downPct', 1],
                ['Interest Rate (%)', 'rate', 0.125],
                ['Monthly Rent ($)', 'rent', 1],
                ['HOA Fee ($/mo)', 'hoa', 1],
                ['Property Tax Rate (%)', 'taxRate', 0.01],
                ['Insurance ($/mo)', 'insurance', 1],
                ['Vacancy + Repairs (%)', 'vacancyPct', 1],
              ].map(([label, key, step]) => (
                <label key={key as string}>
                  {label}
                  <input
                    type="number"
                    step={step as number}
                    value={inputs[key as keyof CalculatorInputs]}
                    onChange={(event) => updateInput(key as keyof CalculatorInputs, event.target.value)}
                  />
                </label>
              ))}
            </div>
            <div className="sample-rent-buttons">
              <button type="button" onClick={() => setInputs((current) => ({ ...current, rent: 2900 }))}>$2,900 (conservative)</button>
              <button type="button" onClick={() => setInputs((current) => ({ ...current, rent: 3500 }))}>$3,500 (base case)</button>
              <button type="button" onClick={() => setInputs((current) => ({ ...current, rent: 4410 }))}>$4,410 (RentCast)</button>
            </div>
            <div className="sample-calc-results">
              <div><span>Loan Amount</span><strong>{money(calculation.loan)}</strong></div>
              <div><span>Monthly Mortgage (P&I)</span><strong>{money(calculation.payment)}</strong></div>
              <div><span>Total Monthly OpEx</span><strong>{money(calculation.opEx)}</strong></div>
              <div><span>Net Monthly Cash Flow</span><strong className={calculation.cash >= 0 ? 'sample-tone-green' : 'sample-tone-red'}>{calculation.cash >= 0 ? '+' : ''}{money(calculation.cash)}</strong></div>
              <div><span>Cap Rate</span><strong>{pct(calculation.cap)}</strong></div>
              <div><span>Cash-on-Cash Return</span><strong className={calculation.coc >= 0 ? 'sample-tone-green' : 'sample-tone-red'}>{calculation.coc >= 0 ? '+' : ''}{pct(calculation.coc)}</strong></div>
            </div>
            <div className="sample-scenario-grid">
              {scenarios.map(([title, result]) => (
                <article className="sample-scenario" key={title}>
                  <h3>{title}</h3>
                  <p><span>Monthly cash flow</span><strong className={result.cash >= 0 ? 'sample-tone-green' : 'sample-tone-red'}>{result.cash >= 0 ? '+' : ''}{money(result.cash)}</strong></p>
                  <p><span>Cap rate</span><strong>{pct(result.cap)}</strong></p>
                  <p><span>Cash-on-cash</span><strong className={result.coc >= 0 ? 'sample-tone-green' : 'sample-tone-red'}>{result.coc >= 0 ? '+' : ''}{pct(result.coc)}</strong></p>
                </article>
              ))}
            </div>
            <Note><b>Calculator note:</b> Default assumes 20% down, 6.75% rate, 1.15% property tax, $120/mo insurance, 10% vacancy/repair reserve, and $534 HOA. Adjust to your actual lender terms. At 25% down and 6.5% rate, the base-case cash flow improves to approximately -$85/mo. The deal only cash-flows positively at the RentCast rent or with significantly lower financing costs.</Note>
          </div>
          <footer>Cash-flow calculator <span>Input your numbers -- not ours</span></footer>
        </section>

        <section className="sample-page" ref={(node) => { sectionRefs.current[9] = node }}>
          <SectionHeader title="Sources + Next Move" page="09" />
          <div className="sample-page-body">
            <h2 className="sample-section-title">Source appendix and action checklist.</h2>
            <div className="sample-grid-two sample-source-layout">
              <div className="sample-source-list">
                {sources.map(([tag, title, description]) => (
                  <article className="sample-source-card" key={tag}>
                    <span>{tag}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </article>
                ))}
              </div>
              <article className="sample-card sample-card-navy sample-next-move">
                <p className="sample-kicker">Recommended next move</p>
                <h2>Verify the HOA and rent math before recommending an offer.</h2>
                <p><b>Step 1:</b> Request HOA financials, reserve study, and CC&Rs. Confirm no pending special assessment and rental caps do not block your strategy.</p>
                <p><b>Step 2:</b> Verify rent with 3+ true 2BD/1BA condo comps in 95118. Do not rely on SFR comps or RentCast headline alone.</p>
                <p><b>Step 3:</b> Run this property through the calculator with your actual lender terms. If base-case rent does not yield positive cash flow at your rate, the deal is appreciation speculation.</p>
                <p><b>Step 4:</b> Schedule inspection focused on 1970-era systems: plumbing (galvanized?), electrical panel, HVAC age, window condition, and moisture intrusion.</p>
              </article>
            </div>
            <StatGrid
              items={[
                { label: 'Rent Stress Test', value: '$2.9K / $3.5K / $4.4K', detail: 'Must run before offer', tone: 'green' },
                { label: 'HOA Review', value: 'Critical', detail: 'Fees, reserves, rules', tone: 'red' },
                { label: 'Inspection Focus', value: '1970 Systems', detail: 'Plumbing, electrical, HVAC', tone: 'amber' },
              ]}
            />
          </div>
          <footer>Source Appendix <span>Full decision chain preserved</span></footer>
        </section>
      </main>
    </div>
  )
}

export default SampleDossierPage
