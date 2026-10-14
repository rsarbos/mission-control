import './editorial-system.css'

type MemoSection = {
  id: string
  label: string
  eyebrow: string
  title: string
  deck: string
  anchor: string
  accent: 'verification' | 'risk' | 'neutral'
}

type MetadataItem = {
  label: string
  value: string
  tone?: 'verification' | 'risk'
}

const MEMORANDUM_SECTIONS: MemoSection[] = [
  {
    id: 'cover',
    label: 'Cover',
    eyebrow: 'Decision Memorandum',
    title: 'Institutional property decision shell.',
    deck: 'A constitutional editorial prototype for transforming a property link into a reviewable acquisition memorandum.',
    anchor: 'Decision OS',
    accent: 'neutral',
  },
  {
    id: 'executive-verdict',
    label: 'Executive Verdict',
    eyebrow: 'Verdict',
    title: 'One screen. One conclusion. Visible uncertainty.',
    deck: 'The verdict area states what the record supports, what remains unresolved, and what should trigger a pause.',
    anchor: 'Review Required',
    accent: 'risk',
  },
  {
    id: 'financial-thesis',
    label: 'Financial Thesis',
    eyebrow: 'Financial Logic',
    title: 'The economics are legible before the details are read.',
    deck: 'Large-format thesis blocks reserve the center of the page for the primary financial argument and its source confidence.',
    anchor: 'Source Backed',
    accent: 'verification',
  },
  {
    id: 'rental-thesis',
    label: 'Rental Thesis',
    eyebrow: 'Income Evidence',
    title: 'Rent confidence is separated from rent optimism.',
    deck: 'The rental page frames supported ranges, contradictory claims, and open checks without collapsing into a spreadsheet.',
    anchor: 'Confidence 72',
    accent: 'verification',
  },
  {
    id: 'value-arv',
    label: 'Value & ARV',
    eyebrow: 'Value Range',
    title: 'ARV is presented as a defended range, not a magic number.',
    deck: 'The visual hierarchy keeps the range visible from across the room while letting evidence live one layer below.',
    anchor: 'Range Model',
    accent: 'neutral',
  },
  {
    id: 'risk-register',
    label: 'Risk Register',
    eyebrow: 'Risk',
    title: 'Every unresolved risk earns visible space.',
    deck: 'Risk rows are sober, compressed, and ranked by decision impact rather than decorative severity badges.',
    anchor: '3 Contradictions',
    accent: 'risk',
  },
  {
    id: 'neighborhood',
    label: 'Neighborhood',
    eyebrow: 'Market Context',
    title: 'Neighborhood context supports the decision without becoming travel copy.',
    deck: 'This page creates room for institutional market notes, comparable context, and location-sensitive diligence.',
    anchor: 'Context Layer',
    accent: 'neutral',
  },
  {
    id: 'calculator',
    label: 'Calculator',
    eyebrow: 'Scenario Surface',
    title: 'Calculator outputs become editorial evidence.',
    deck: 'The calculator is represented as a controlled scenario module, ready for future formulas without implementing them now.',
    anchor: 'Scenario Draft',
    accent: 'verification',
  },
  {
    id: 'evidence-vault',
    label: 'Evidence Vault',
    eyebrow: 'Sources',
    title: 'Evidence is organized like institutional workpaper support.',
    deck: 'Source chips, evidence links, and modal placeholders establish the future review pattern without fetching data.',
    anchor: '18 Items',
    accent: 'verification',
  },
  {
    id: 'appendices',
    label: 'Appendices',
    eyebrow: 'Appendices',
    title: 'The document closes with audit structure, not filler.',
    deck: 'Appendices hold assumptions, version notes, and unresolved diligence so the decision record remains inspectable.',
    anchor: 'Version 0.1',
    accent: 'neutral',
  },
]

const METADATA_ITEMS: MetadataItem[] = [
  { label: 'Decision Status', value: 'Review Required', tone: 'risk' },
  { label: 'Confidence', value: '72%', tone: 'verification' },
  { label: 'Evidence Count', value: '18', tone: 'verification' },
  { label: 'Contradictions', value: '3', tone: 'risk' },
  { label: 'Version', value: '0.1 Prototype' },
  { label: 'Generated Date', value: 'June 25, 2026' },
  { label: 'Analyst', value: 'RSARBOS Editorial' },
  { label: 'Freshness', value: 'Draft shell only' },
]

function PageHeader({ section }: { section: MemoSection }) {
  return (
    <header className="esp-page-header">
      <p>{section.eyebrow}</p>
      <h2>{section.title}</h2>
      <span>{section.label}</span>
    </header>
  )
}

function DocumentFooter() {
  return (
    <footer className="esp-document-footer">
      <span>RSARBOS Editorial System Prototype</span>
      <span>Shell only</span>
    </footer>
  )
}

function CoverShowcase() {
  return (
    <section className="esp-showcase esp-cover-showcase" aria-label="Cover page identity">
      <div className="esp-cover-title">
        <span>Decision Memorandum</span>
        <strong>Placeholder Property Identity</strong>
      </div>
      <dl className="esp-cover-meta">
        <div>
          <dt>Case ID</dt>
          <dd>RS-0000</dd>
        </div>
        <div>
          <dt>Market</dt>
          <dd>Placeholder Metro</dd>
        </div>
        <div>
          <dt>Use</dt>
          <dd>Acquisition Review</dd>
        </div>
      </dl>
    </section>
  )
}

function ExecutiveVerdictShowcase() {
  return (
    <section className="esp-showcase esp-verdict-showcase" aria-label="Executive verdict composition">
      <div className="esp-verdict-dominant">
        <span>Verdict</span>
        <strong>Review Required</strong>
        <b>72% confidence</b>
      </div>
      <div className="esp-verdict-reasons">
        {['Rent evidence supports a narrower range than the listing claim.', 'ARV thesis requires conservative treatment until condition is verified.', 'Liquidity appears viable, but buyer depth is not yet proven.'].map((reason) => (
          <p key={reason}>{reason}</p>
        ))}
        <aside>
          <span>Critical Condition</span>
          <strong>Do not proceed without rent proof and condition confirmation.</strong>
        </aside>
      </div>
    </section>
  )
}

function FinancialThesisShowcase() {
  return (
    <section className="esp-showcase esp-financial-showcase" aria-label="Financial thesis acquisition range">
      <div className="esp-range-scale">
        <span className="esp-zone esp-zone-risk">Downside</span>
        <span className="esp-zone esp-zone-fair">Fair Value Range</span>
        <span className="esp-zone esp-zone-upside">Upside</span>
        <i className="esp-target-marker"><b>Target</b></i>
      </div>
      <div className="esp-range-values">
        <div>
          <span>Acquisition Floor</span>
          <strong>$000k</strong>
        </div>
        <div>
          <span>Target Price</span>
          <strong>$000k</strong>
        </div>
        <div>
          <span>Fair Ceiling</span>
          <strong>$000k</strong>
        </div>
      </div>
    </section>
  )
}

function RentalThesisShowcase() {
  return (
    <section className="esp-showcase esp-rental-showcase" aria-label="Rental thesis confidence split">
      <div className="esp-rent-split">
        <article>
          <span>Verified Rent</span>
          <strong>$0,000</strong>
          <i></i>
        </article>
        <article>
          <span>Optimistic Rent</span>
          <strong>$0,000</strong>
          <i></i>
        </article>
      </div>
      <div className="esp-comp-stack">
        {['Comp A', 'Comp B', 'Comp C', 'Comp D'].map((comp, index) => (
          <div key={comp}>
            <span>{comp}</span>
            <i style={{ width: `${58 + index * 9}%` }}></i>
            <b>${(2100 + index * 140).toLocaleString()}</b>
          </div>
        ))}
      </div>
    </section>
  )
}

function ValueArvShowcase() {
  return (
    <section className="esp-showcase esp-arv-showcase" aria-label="ARV range model">
      <div className="esp-arv-model">
        {[
          ['As-Is Value', '$000k', 'Current evidence floor'],
          ['Conservative ARV', '$000k', 'Defensible resale case'],
          ['Aggressive ARV', '$000k', 'Requires premium execution'],
        ].map(([label, value, note]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{note}</p>
          </article>
        ))}
      </div>
      <div className="esp-improvement-path">
        <span>Recommended Improvement Path</span>
        <strong>Repair scope first, finish premium second, resale thesis last.</strong>
      </div>
    </section>
  )
}

function RiskRegisterShowcase() {
  return (
    <section className="esp-showcase esp-risk-showcase" aria-label="Risk register bars">
      <div className="esp-contradiction-count">
        <span>Contradictions</span>
        <strong>03</strong>
      </div>
      <div className="esp-risk-bars">
        {[
          ['HOA', 76],
          ['Rent Proof', 88],
          ['Condition', 64],
          ['Liquidity', 42],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <i style={{ width: `${value}%` }}></i>
            <b>{value}</b>
          </div>
        ))}
      </div>
    </section>
  )
}

function NeighborhoodShowcase() {
  return (
    <section className="esp-showcase esp-neighborhood-showcase" aria-label="Neighborhood contextual score grid">
      {[
        ['Schools', 'B-', 'Pending source review'],
        ['Walkability', '64', 'Moderate convenience'],
        ['Commute', '41m', 'Market-dependent'],
        ['Safety', 'Review', 'Needs source conflict check'],
        ['Demand', 'High', 'Buyer depth placeholder'],
      ].map(([label, score, note]) => (
        <article key={label}>
          <span>{label}</span>
          <strong>{score}</strong>
          <p>{note}</p>
        </article>
      ))}
    </section>
  )
}

function CalculatorShowcase() {
  return (
    <section className="esp-showcase esp-calculator-showcase" aria-label="Scenario comparison calculator">
      {[
        ['Conservative', '-$000', '0.0%'],
        ['Base', '$000', '0.0%'],
        ['Optimistic', '$000', '0.0%'],
      ].map(([scenario, cashFlow, coc]) => (
        <article key={scenario}>
          <span>{scenario}</span>
          <strong>{cashFlow}</strong>
          <p>Monthly cash flow</p>
          <b>{coc} CoC</b>
        </article>
      ))}
    </section>
  )
}

function EvidenceVaultShowcase() {
  return (
    <section className="esp-showcase esp-vault-showcase" aria-label="Evidence category source cards">
      {[
        ['EV-001', 'Listing Record', 'Verified'],
        ['EV-002', 'Rent Comparable', 'Pending'],
        ['EV-003', 'ARV Support', 'Verified'],
        ['EV-004', 'Source Conflict', 'Contradiction'],
      ].map(([id, label, status]) => (
        <button className={`esp-source-card esp-status-${status.toLowerCase()}`} type="button" key={id}>
          <span>{id}</span>
          <strong>{label}</strong>
          <b>{status}</b>
        </button>
      ))}
    </section>
  )
}

function AppendixShowcase() {
  return (
    <section className="esp-showcase esp-appendix-showcase" aria-label="Case integrity summary">
      {[
        ['Version', '0.1'],
        ['Source Count', '18'],
        ['Traceability', 'Mapped'],
        ['Reproducibility', 'Draft'],
      ].map(([label, value]) => (
        <article key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
      <p>Appendix shell preserves the future audit trail without introducing real source material.</p>
    </section>
  )
}

function SectionShowcase({ section }: { section: MemoSection }) {
  switch (section.id) {
    case 'cover':
      return <CoverShowcase />
    case 'executive-verdict':
      return <ExecutiveVerdictShowcase />
    case 'financial-thesis':
      return <FinancialThesisShowcase />
    case 'rental-thesis':
      return <RentalThesisShowcase />
    case 'value-arv':
      return <ValueArvShowcase />
    case 'risk-register':
      return <RiskRegisterShowcase />
    case 'neighborhood':
      return <NeighborhoodShowcase />
    case 'calculator':
      return <CalculatorShowcase />
    case 'evidence-vault':
      return <EvidenceVaultShowcase />
    case 'appendices':
      return <AppendixShowcase />
    default:
      return null
  }
}

function MemorandumPage({ section, index }: { section: MemoSection; index: number }) {
  return (
    <article className={`esp-memo-page esp-page-${section.accent}`} id={section.id}>
      <PageHeader section={section} />
      <div className="esp-page-body">
        <div className="esp-dominant-anchor">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{section.anchor}</strong>
        </div>
        <p>{section.deck}</p>
      </div>
      <SectionShowcase section={section} />
      <DocumentFooter />
    </article>
  )
}

function MetadataRail() {
  return (
    <aside className="esp-metadata-rail" aria-label="Institutional metadata rail">
      <div className="esp-rail-heading">
        <span>Metadata</span>
        <strong>Institutional Control</strong>
      </div>
      <dl>
        {METADATA_ITEMS.map((item) => (
          <div className={item.tone ? `esp-meta-item esp-${item.tone}` : 'esp-meta-item'} key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

function EditorialNavigation() {
  return (
    <aside className="esp-left-nav" aria-label="Memorandum navigation">
      <a className="esp-wordmark" href="/">
        RSARBOS
      </a>
      <nav>
        {MEMORANDUM_SECTIONS.map((section, index) => (
          <a href={`#${section.id}`} key={section.id}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {section.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default function EditorialSystemPrototype() {
  return (
    <main className="editorial-system-prototype">
      <EditorialNavigation />
      <section className="esp-memorandum" aria-label="Interactive memorandum preview">
        {MEMORANDUM_SECTIONS.map((section, index) => (
          <MemorandumPage section={section} index={index} key={section.id} />
        ))}
      </section>
      <MetadataRail />
    </main>
  )
}
