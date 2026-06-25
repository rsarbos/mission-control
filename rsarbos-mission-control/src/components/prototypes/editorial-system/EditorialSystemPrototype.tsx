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

function DecisionBanner() {
  return (
    <section className="esp-decision-banner" aria-label="Decision status">
      <div>
        <span>Decision Status</span>
        <strong>Review Required</strong>
      </div>
      <p>Prototype shell only. Placeholder data is used to test hierarchy, spacing, and editorial rhythm.</p>
    </section>
  )
}

function ConfidenceEngine() {
  return (
    <div className="esp-confidence-engine" aria-label="Confidence engine placeholder">
      <div>
        <span>Confidence Engine</span>
        <strong>72</strong>
      </div>
      <div className="esp-confidence-bars" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>
  )
}

function EvidenceChip({ label, tone = 'verification' }: { label: string; tone?: 'verification' | 'risk' }) {
  return <span className={`esp-evidence-chip esp-${tone}`}>{label}</span>
}

function EvidenceLink({ index, label }: { index: number; label: string }) {
  return (
    <button className="esp-evidence-link" type="button">
      <span>{String(index).padStart(2, '0')}</span>
      {label}
    </button>
  )
}

function RiskMatrix() {
  return (
    <div className="esp-risk-matrix" aria-label="Risk matrix placeholder">
      {['Source conflict', 'Repair scope', 'Rent ceiling', 'Exit liquidity'].map((label, index) => (
        <div className="esp-risk-row" key={label}>
          <span>{label}</span>
          <i style={{ width: `${82 - index * 14}%` }}></i>
        </div>
      ))}
    </div>
  )
}

function PageHeader({ section }: { section: MemoSection }) {
  return (
    <header className="esp-page-header">
      <p>{section.eyebrow}</p>
      <h2>{section.title}</h2>
      <span>{section.label}</span>
    </header>
  )
}

function EvidenceVault() {
  return (
    <div className="esp-evidence-vault" aria-label="Evidence vault placeholder">
      <EvidenceLink index={1} label="Listing record placeholder" />
      <EvidenceLink index={2} label="Comparable sale placeholder" />
      <EvidenceLink index={3} label="Rent source placeholder" />
      <EvidenceLink index={4} label="Analyst note placeholder" />
    </div>
  )
}

function SourceModalPlaceholder() {
  return (
    <aside className="esp-source-modal" aria-label="Source modal placeholder">
      <span>Source Modal</span>
      <strong>Reserved interaction layer</strong>
      <p>No fetching, uploads, or real source previews are implemented in Phase 1.</p>
    </aside>
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
      <div className="esp-page-system">
        <DecisionBanner />
        <ConfidenceEngine />
        <div className="esp-chip-row">
          <EvidenceChip label="Verified source" />
          <EvidenceChip label="Open diligence" tone="risk" />
          <EvidenceChip label="Analyst reviewed" />
        </div>
        <RiskMatrix />
        <EvidenceVault />
        <SourceModalPlaceholder />
      </div>
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
