import React, { useEffect } from 'react'

// Core underwriting parameters
const CORE_PARAMS = {
  purchasePrice: 470000,
  downPct: 20,
  interestRate: 6.75,
  hoaFee: 534,
  taxRate: 1.15,
  insurance: 120,
  vacancyMaintPct: 10,
}

// Rental comp data
const RENT_COMP_ROWS = [
  ['1343 Scossa Ave Apt 1', '$2,900', '$3.58', '0.09 mi', '2BD / 1BA — 810sf'],
  ['4494 Silva Ave', '$4,600', '$3.51', '0.15 mi', '3BD / 2BA — 1,312sf'],
  ['4992 Corbin Ave', '$4,550', '$3.23', '0.21 mi', '4BD / 2BA — 1,408sf'],
  ['1312 Kipling Ct', '$4,600', '$3.70', '0.22 mi', '3BD / 2BA — 1,242sf'],
  ['5028 Trenary Way', '$4,200', '$3.41', '0.27 mi', '3BD / 2BA — 1,232sf'],
]

// Risk table data
const RISK_TABLE_ROWS = [
  ['HOA Special Assessment & Reserves', 'CRITICAL IMPACT', 'Mandatory reserve study audit prior to escrow clearance'],
  ['Estimated Rent Overstatement', 'CRITICAL IMPACT', 'Scale down calculations to $2,900/mo condo floor'],
  ['Submarket Rate Sensitivity', 'MODERATE IMPACT', 'Stress-test operations at 7.5% loan terms'],
  ['Pre-1978 Plumbing & System Wear', 'MODERATE IMPACT', 'Deploy thermal plumbing scopes on inspection day'],
]

// Walkaway triggers
const WALKAWAY_TRIGGERS = [
  'HOA reserves score below the 60% mark',
  'Escrow documents indicate pending litigation',
  'Intended physical systems replacements require direct board consensus',
  'Physical plant system structural damage exceeds $25,000 on inspection',
]

// Neighborhood data
const NEIGHBORHOOD_METRICS = [
  { label: 'Walkability Index', value: '58%', desc: 'Somewhat Walkable' },
  { label: 'Transit Capability', value: '28%', desc: 'Minimal Options' },
  { label: 'Bicycle Compatibility', value: '64%', desc: 'Bikeable' },
]
const SCHOOL_RATINGS = [
  { level: 'Elementary', name: 'Allen at Steinbeck', rating: '5/10' },
  { level: 'Middle', name: 'Castillero Middle', rating: '6/10' },
  { level: 'High School', name: 'Pioneer High', rating: '6.4/10' },
]
const CORE_CITATIONS = [
  'MLS REGISTRY: ML82047088',
  'RENTCAST API-CORE-V2',
  'GEOPORTAL WALKABILITY IDX',
  'GREATSCHOOLS DIRECT REGISTRY',
  'MUNICIPAL DEED ARCHIVE APN 569-43-077',
]

const CHECKLIST_ITEMS = [
  'Retrieve complete HOA litigation files from listing broker',
  'Verify individual gas/water meter status and sub-meters',
  'Submit local condo leasing cap disclosure request',
  'Deploy physical sewer line video-scope team',
]

// Tab labels
const TAB_INFO = [
  { id: 'registry', number: '01', title: 'Asset Registry Cover', subtitle: 'Primary parameters & identifiers' },
  { id: 'verdict', number: '02', title: 'Executive Verdict', subtitle: 'Acquisition viability & catalysts' },
  { id: 'rent', number: '03', title: 'Rent Thesis & Comps', subtitle: 'Verified lease records & comps' },
  { id: 'arv', number: '04', title: 'ARV & Capital Map', subtitle: 'Value-add paths & direct comps' },
  { id: 'risk', number: '05', title: 'Risk & Strategy Register', subtitle: 'Walkaway triggers & fit metrics' },
  { id: 'neighborhood', number: '06', title: 'Neighborhood Vital Signs', subtitle: 'Walkability & school indexes' },
  { id: 'appendix', number: '07', title: 'Source Index & Checklist', subtitle: 'Verification steps & registries' },
]

const PAGE_LABELS: Record<string, string> = {
  registry: 'PAGE 00 // COVER REGISTRY',
  verdict: 'PAGE 02 // EXECUTIVE VERDICT',
  rent: 'PAGE 04 // RENTAL THESIS',
  arv: 'PAGE 05 // ARV VALUE SCENARIOS',
  risk: 'PAGE 06 // RISK REGISTER',
  neighborhood: 'PAGE 07 // NEIGHBORHOOD INTEL',
  appendix: 'PAGE 09 // PRE-CLOSING APPENDIX',
}

const TAB_COLORS: Record<string, string> = {
  registry: '#0066cc',
  verdict: '#e02424',
  rent: '#00875a',
  arv: '#0066cc',
  risk: '#e02424',
  neighborhood: '#0066cc',
  appendix: '#0066cc',
}

// Arv data
const DIRECT_BLOCK_COMPS = [
  { name: '1314 Shawn Dr #2 (903 sf)', value: '$585,000' },
  { name: '1314 Shawn Dr #3 (903 sf)', value: '$511,500' },
  { name: '1314 Shawn Dr #4 (798 sf)', value: '$488,100' },
  { name: '1322 Shawn Dr #3 (903 sf)', value: '$538,000' },
]

const ARV_STRATEGY_FLOW = [
  { step: '1', label: 'Current Base Target', value: '$470,000' },
  { step: '2', label: 'Minor Cosmetic Refresh', value: '$540K - $565K' },
  { step: '3', label: 'Medium Upgrade Path', value: '$575K - $620K' },
  { step: '4', label: 'Full Structural Gut', value: '$650K - $720K' },
]

type DossierTab = 'registry' | 'verdict' | 'rent' | 'arv' | 'risk' | 'neighborhood' | 'appendix'

function DossierPreview() {
  const [activeTab, setActiveTab] = React.useState<DossierTab>('registry')
  const [rentVal, setRentVal] = React.useState(3500)

  // Calculate metrics from rent
  const downPayment = CORE_PARAMS.purchasePrice * (CORE_PARAMS.downPct / 100)
  const loanAmount = CORE_PARAMS.purchasePrice - downPayment
  const r = CORE_PARAMS.interestRate / 100 / 12
  const n = 360
  const pmt = loanAmount > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0
  const taxMonthly = (CORE_PARAMS.purchasePrice * (CORE_PARAMS.taxRate / 100)) / 12
  const vacancyMonthly = rentVal * (CORE_PARAMS.vacancyMaintPct / 100)
  const totalOpEx = pmt + CORE_PARAMS.hoaFee + taxMonthly + CORE_PARAMS.insurance + vacancyMonthly
  const monthlyCashFlow = rentVal - totalOpEx
  const annualCashFlow = monthlyCashFlow * 12
  const cocYield = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0

  const switchTab = (tabId: DossierTab) => {
    setActiveTab(tabId)
    const hash = '#' + tabId
    window.history.replaceState(null, '', hash)

    // Update the doc-id-label
    const docLabel = document.getElementById('doc-id-label')
    if (docLabel && PAGE_LABELS[tabId]) {
      docLabel.textContent = PAGE_LABELS[tabId]
    }

    // Apply scanline animation
    const scanner = document.getElementById('shimmer-scanner') as HTMLElement | null
    if (scanner) {
      scanner.classList.remove('scan-active')
      void scanner.offsetWidth
      scanner.classList.add('scan-active')
    }

    // Update tab button styling
    const buttons = document.querySelectorAll('.tab-btn')
    buttons.forEach((btn) => {
      btn.setAttribute('aria-selected', 'false')
      ;(btn as HTMLElement).className = `
        tab-btn w-full flex items-center justify-between p-3.5 rounded-lg text-left border transition-all duration-300 
        bg-transparent border-transparent text-neutral-400 hover:text-white hover:border-neutral-800 hover:bg-neutral-900/50
      `
      const label = btn.querySelector('span:last-child') as HTMLElement | null
      if (label) label.className = 'text-[10px] text-neutral-500'
      const chevron = btn.querySelector('svg') as HTMLElement | null
      if (chevron) chevron.className = 'w-4 h-4 text-neutral-600 shrink-0'
    })

    const activeBtn = document.getElementById('btn-' + tabId) as HTMLElement | null
    if (activeBtn) {
      activeBtn.setAttribute('aria-selected', 'true')
      activeBtn.className = `
        tab-btn w-full flex items-center justify-between p-3.5 rounded-lg text-left border transition-all duration-300 
        bg-[#0066cc]/5 border-[#0066cc]/30 text-white
      `
      const label = activeBtn.querySelector('span:last-child') as HTMLElement | null
      if (label) label.className = 'text-[10px] text-neutral-400'
      const chevron = activeBtn.querySelector('svg') as HTMLElement | null
      if (chevron) chevron.className = `
        w-4 h-4 text-[${TAB_COLORS[tabId]}] shrink-0
      `
    }
  }

  const setPreviewRent = (val: number) => {
    setRentVal(val)
    const slider = document.getElementById('strip-rent-slider') as HTMLInputElement | null
    if (slider) {
      slider.value = val.toString()
    }
  }

  // Initialize on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as DossierTab
    const validTabs = ['registry', 'verdict', 'rent', 'arv', 'risk', 'neighborhood', 'appendix']
    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash)
    }

    // Initialize scanline
    const scanner = document.getElementById('shimmer-scanner') as HTMLElement | null
    if (scanner) {
      scanner.classList.add('scan-active')
    }

    // Set initial doc label
    const docLabel = document.getElementById('doc-id-label') as HTMLElement | null
    if (docLabel) {
      docLabel.textContent = PAGE_LABELS['registry']
    }

    // Set initial active tab styling
    const activeBtn = document.getElementById('btn-' + 'registry') as HTMLElement | null
    if (activeBtn) {
      activeBtn.setAttribute('aria-selected', 'true')
      activeBtn.className = `
        tab-btn w-full flex items-center justify-between p-3.5 rounded-lg text-left border transition-all duration-300 
        bg-[#0066cc]/5 border-[#0066cc]/30 text-white
      `
      const chevron = activeBtn.querySelector('svg') as HTMLElement | null
      if (chevron) chevron.className = `w-4 h-4 text-[#0066cc] shrink-0`
    }
  }, [])

  // Render tab panel content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'registry':
        return (
          <div className="mb-4">
            <span className="font-sans font-extrabold text-[9px] uppercase tracking-widest text-neutral-500 border-b border-neutral-900 pb-0.5">
              SECTION 01 · CONFIDENTIAL COVER PORTFOLIO
            </span>
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mt-2 gap-2">
              <h4 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900">
                1314 Shawn Dr #1, San Jose, CA 95118
              </h4>
              <span className="font-mono text-xs font-bold text-[#0066cc]">Cambrian Park Submarket</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Systematic assessment of 2BD / 1BA (810 sqft) ground-floor asset. Verified municipal archives
              record individual gas utilities and joint HOA reserves maintenance obligations.
            </p>

            <div className="border border-neutral-200 rounded p-4 bg-neutral-50/50 my-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest">
                  [ GEOPORTAL AERIAL SCHEMATIC ]
                </span>
                <span className="text-[9px] text-neutral-500 font-mono">Scale: 1:120</span>
              </div>
              <div className="relative h-32 bg-neutral-100 border border-neutral-200 rounded flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                    backgroundSize: '10px 10px',
                  }}
                />
                <div className="border-2 border-dashed border-[#0066cc]/40 w-3/4 h-5/6 relative flex items-center justify-center text-neutral-400 text-[10px] font-mono">
                  <div className="absolute top-0 left-0 w-1/2 h-full border-r border-[#0066cc]/20 flex items-center justify-center flex-col">
                    <span>BEDROOM 1</span>
                    <span className="text-[8px] text-neutral-400">12' x 11'</span>
                  </div>
                  <div className="absolute top-0 right-0 w-1/2 h-1/2 border-b border-[#0066cc]/20 flex items-center justify-center flex-col">
                    <span>KITCHEN</span>
                    <span className="text-[8px] text-neutral-400">10' x 8'</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-1/2 h-1/2 flex items-center justify-center flex-col">
                    <span>LIVING HALL</span>
                    <span className="text-[8px] text-neutral-400">14' x 12'</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 border border-neutral-300 p-2 text-center text-neutral-800 font-bold max-w-xs text-[10px] shadow">
                    <span>
                      GROUND FLOOR CONFIGURATION
                      <span className="font-mono text-[9px] font-normal text-neutral-500 block">
                        810 SF Net Living Area
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed italic border-l-2 border-[#0066cc] pl-3">
              <strong>Memorandum Validation:</strong> Live underwriting evaluation compiled through MLS database
              index matching ML82047088. High confidence verification checks on county deed APN records.
            </p>
          </div>
        )

      case 'verdict':
        return (
          <div className="mb-4">
            <div className="mb-4">
              <span className="font-sans font-extrabold text-[9px] uppercase tracking-widest text-neutral-500 border-b border-neutral-900 pb-0.5">
                SECTION 02 · HIGH CONVICTION THESIS
              </span>
              <h4 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 mt-2">
                Strategic Acquisition Verdict
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-md">
                <span className="font-sans text-[8px] font-bold text-neutral-400 uppercase tracking-wider block">
                  RECOMMENDATION
                </span>
                <span className="font-mono text-sm font-extrabold text-[#00875a] block mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00875a]" /> PURSUABLE
                </span>
                <span className="text-[9px] text-neutral-400 mt-0.5 block">
                  Conditional on HOA cash reserves audit
                </span>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-md">
                <span className="font-sans text-[8px] font-bold text-neutral-400 uppercase tracking-wider block">
                  TARGET INVESTOR PROFILE
                </span>
                <span className="font-mono text-sm font-extrabold text-neutral-800 block mt-1">
                  ENTRY ACQUISITION
                </span>
                <span className="text-[9px] text-neutral-400 mt-0.5 block">
                  High stability asset, low capital ticket
                </span>
              </div>
              <div className="p-3 bg-[#e02424]/5 border border-[#e02424]/10 rounded-md">
                <span className="font-sans text-[8px] font-bold text-neutral-400 uppercase tracking-wider block">
                  PRIMARY SENSITIVITY
                </span>
                <span className="font-mono text-sm font-extrabold text-[#e02424] block mt-1">
                  HOA & RENT PROOF
                </span>
                <span className="text-[9px] text-neutral-400 mt-0.5 block">
                  Verifying actual $2,900 condo floor
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-b border-neutral-900/10 py-5 my-5">
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00875a]" /> POSITIVE CATALYSTS
                </h5>
                <ul className="space-y-2 text-[10px] text-neutral-600 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="font-mono text-neutral-400">•</span>
                    <span>Lowest entry point in Cambrian Park (ZIP 95118) where median values exceed $1.55M.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-mono text-neutral-400">•</span>
                    <span>Baseline capital protection confirmed by adjacent comps in the $500K–$550K range.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-mono text-neutral-400">•</span>
                    <span>Hyper market velocity environment with median 8 Days on Market (DOM).</span>
                  </li>
                </ul>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-6">
                <h5 className="text-[10px] font-black uppercase tracking-wider text-[#e02424] flex items-center gap-1.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e02424]" /> CRITICAL HOLES & FRICTION
                </h5>
                <ul className="space-y-2 text-[10px] text-neutral-600 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="font-mono text-neutral-400">•</span>
                    <span>Intense HOA fee of <strong>$534/mo</strong> heavily erodes pro-forma net yield.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-mono text-neutral-400">•</span>
                    <span>Potential listing attribute mismatch across syndicators (condo vs townhome class).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-mono text-neutral-400">•</span>
                    <span>Aging 1970 physical plant systems require dedicated mechanical, plumbing & HVAC scoping.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded border border-neutral-200/50">
              <p className="text-[10.5px] leading-relaxed text-neutral-600 italic">
                <strong>Verdict Summary:</strong> The $30K price drop to $470,000 creates a premium Silicon Valley entry
                ticket. However, transaction validation demands immediate proof of actual condo lease floors ($2,900) vs.
                inflated $4,410 single-family estimates.
              </p>
            </div>
          </div>
        )

      case 'rent':
        return (
          <div className="mb-4">
            <div className="mb-4">
              <span className="font-sans font-extrabold text-[9px] uppercase tracking-widest text-neutral-500 border-b border-neutral-900 pb-0.5">
                SECTION 03 · LEASE PERFORMANCE MATRIX
              </span>
              <h4 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 mt-2">
                Rental Yield & Comps Analysis
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xl">
                Cross-referenced lease records validating real performance metrics against baseline estimates.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-left">
              <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded">
                <span className="font-sans text-[7.5px] font-bold text-neutral-400 uppercase tracking-wider block">
                  RENTCAST EST.
                </span>
                <span className="font-mono text-xs font-bold text-[#00875a] mt-0.5 block">$4,410/mo</span>
                <div className="w-full bg-neutral-200 h-1 mt-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00875a] h-full" style={{ width: '88%' }} />
                </div>
              </div>
              <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded">
                <span className="font-sans text-[7.5px] font-bold text-neutral-400 uppercase tracking-wider block">
                  STRESSED CASE
                </span>
                <span className="font-mono text-xs font-bold text-neutral-900 mt-0.5 block">$3,520/mo</span>
                <div className="w-full bg-neutral-200 h-1 mt-1.5 rounded-full overflow-hidden">
                  <div className="bg-neutral-800 h-full" style={{ width: '70%' }} />
                </div>
              </div>
              <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded">
                <span className="font-sans text-[7.5px] font-bold text-neutral-400 uppercase tracking-wider block">
                  CONDO FLOOR BASE
                </span>
                <span className="font-mono text-xs font-bold text-neutral-900 mt-0.5 block">$2,900/mo</span>
                <div className="w-full bg-neutral-200 h-1 mt-1.5 rounded-full overflow-hidden">
                  <div className="bg-neutral-500 h-full" style={{ width: '58%' }} />
                </div>
              </div>
              <div className="p-2.5 bg-[#e02424]/5 border border-[#e02424]/10 rounded">
                <span className="font-sans text-[7.5px] font-bold text-neutral-400 uppercase tracking-wider block">
                  HOA MOISTURE DRAG
                </span>
                <span className="font-mono text-xs font-bold text-[#e02424] mt-0.5 block">-$534/mo</span>
                <div className="w-full bg-[#e02424]/20 h-1 mt-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#e02424] h-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar mb-4 border-t border-b border-neutral-900/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-950">
                    <th className="py-2 text-[8px] font-black uppercase tracking-wider text-neutral-500">Identified Location</th>
                    <th className="py-2 text-[8px] font-black uppercase tracking-wider text-neutral-500 text-right">Rent</th>
                    <th className="py-2 text-[8px] font-black uppercase tracking-wider text-neutral-500 text-right">Rate/SF</th>
                    <th className="py-2 text-[8px] font-black uppercase tracking-wider text-neutral-500 text-right">Dist.</th>
                    <th className="py-2 text-[8px] font-black uppercase tracking-wider text-neutral-500">Specs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-[10px] text-neutral-600 font-sans">
                  {RENT_COMP_ROWS.map((row, i) => (
                    <tr key={i}>
                      <td className="py-1.5 font-medium text-neutral-900">{row[0]}</td>
                      <td className="py-1.5 text-right font-mono font-bold text-neutral-900">{row[1]}</td>
                      <td className="py-1.5 text-right font-mono text-neutral-500">{row[2]}</td>
                      <td className="py-1.5 text-right text-neutral-500">{row[3]}</td>
                      <td className="py-1.5 text-neutral-500 font-mono">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-start gap-2 bg-[#e02424]/5 border border-[#e02424]/10 p-2.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e02424] mt-1 shrink-0" />
              <p className="text-[9px] text-[#e02424] leading-relaxed font-mono">
                VALUABLE DISCREPANCY: The local submarket RentCast index ($4.4K) is heavily distorted by 3BD and 4BD
                single-family layouts nearby. Ground-level 2BD/1BA condos lease consistently at $2,900/mo. Model must
                adjust down.
              </p>
            </div>
          </div>
        )

      case 'arv':
        return (
          <div className="mb-4">
            <div className="mb-4">
              <span className="font-sans font-extrabold text-[9px] uppercase tracking-widest text-neutral-500 border-b border-neutral-900 pb-0.5">
                SECTION 04 · VALUE MATRICES
              </span>
              <h4 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 mt-2">
                Capital Value & Comparable Assets
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xl">
                Strategic value-add assessment trajectories from current state baseline to maximum cosmetic ARV
                potential.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-neutral-900/10 py-4 my-4 text-[10px] leading-relaxed text-neutral-600">
              <div>
                <h5 className="text-[9px] font-black uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#0066cc]" /> DIRECT BLOCK COMS (SHAWN DR)
                </h5>
                <div className="space-y-1.5 font-mono">
                  {DIRECT_BLOCK_COMPS.map((comp, i) => (
                    <div key={i} className="flex justify-between border-b border-neutral-100 pb-1">
                      <span>{comp.name}</span>
                      <span className="font-bold text-neutral-900">{comp.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-neutral-200 pt-3 md:pt-0 md:pl-4">
                <h5 className="text-[9px] font-black uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#00875a]" /> ESTIMATED ARV STRATEGY FLOW
                </h5>
                <div className="space-y-3 font-sans text-[9px]">
                  {ARV_STRATEGY_FLOW.map((item) => (
                    <div key={item.step} className="flex items-center justify-between">
                      <span className="text-neutral-500 font-mono">{item.label}</span>
                      <span className="font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span className="font-sans text-[7.5px] text-neutral-400 font-bold uppercase tracking-wider block">
                  CURRENT LIST FLOOR
                </span>
                <span className="font-mono text-xs font-extrabold text-[#0066cc] mt-0.5 block">$470,000</span>
                <span className="text-[8px] text-neutral-400">After $30K reduction</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span className="font-sans text-[7.5px] text-neutral-400 font-bold uppercase tracking-wider block">
                  OPTIMAL ARV PATH
                </span>
                <span className="font-mono text-xs font-extrabold text-[#00875a] mt-0.5 block">$555,000</span>
                <span className="text-[8px] text-neutral-400">Cosmetic non-board path</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span className="font-sans text-[7.5px] text-neutral-400 font-bold uppercase tracking-wider block">
                  AVERAGE ZIP PRICE/SF
                </span>
                <span className="font-mono text-xs font-extrabold text-neutral-900 mt-0.5 block">$938/sf</span>
                <span className="text-[8px] text-neutral-400">Silicon Valley benchmark</span>
              </div>
            </div>
          </div>
        )

      case 'risk':
        return (
          <div className="mb-4">
            <div className="mb-4">
              <span className="font-sans font-extrabold text-[9px] uppercase tracking-widest text-neutral-500 border-b border-neutral-900 pb-0.5">
                SECTION 05 · RISK REGISTRY
              </span>
              <h4 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 mt-2">
                Underwriting Risks & Walkaway Rules
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xl">
                Tactical risk mapping outlining core threat matrices and the hard operational thresholds for
                termination.
              </p>
            </div>

            <div className="overflow-x-auto no-scrollbar mb-4 border-t border-b border-neutral-900/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-950">
                    <th className="py-2 text-[8px] font-black uppercase tracking-wider text-neutral-500">Identified Threat</th>
                    <th className="py-2 text-[8px] font-black uppercase tracking-wider text-neutral-500 text-center">Threat Level</th>
                    <th className="py-2 text-[8px] font-black uppercase tracking-wider text-neutral-500">Primary Mitigation Path</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-[10px] text-neutral-600 font-sans">
                  {RISK_TABLE_ROWS.map((row, i) => {
                    const isCritical = row[1].includes('CRITICAL')
                    const isModerate = row[1].includes('MODERATE')
                    let levelClass = 'bg-[#0066cc]/5 border-[#0066cc]/15 text-[#0066cc]'
                    if (isCritical) levelClass = 'bg-[#e02424]/5 border-[#e02424]/15 text-[#e02424]'
                    if (isModerate) levelClass = 'bg-[#0066cc]/5 border-[#0066cc]/15 text-[#0066cc]'
                    return (
                      <tr key={i}>
                        <td className="py-2 font-medium text-neutral-900">{row[0]}</td>
                        <td className="py-2 text-center">
                          <span className={`font-mono text-[8px] font-bold ${levelClass} px-1.5 py-0.5 rounded`}>
                            {row[1]}
                          </span>
                        </td>
                        <td className="py-2 text-neutral-500">{row[2]}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-red-50 border border-[#e02424]/20 rounded text-[9.5px] leading-relaxed text-neutral-700">
              <span className="font-mono font-bold uppercase text-[#e02424] block tracking-wide mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e02424]" /> NON-NEGOTIABLE WALKAWAY TRIGGERS
              </span>
              Terminate immediately if: {WALKAWAY_TRIGGERS.join('; ')}
            </div>
          </div>
        )

      case 'neighborhood':
        return (
          <div className="mb-4">
            <div className="mb-4">
              <span className="font-sans font-extrabold text-[9px] uppercase tracking-widest text-neutral-500 border-b border-neutral-900 pb-0.5">
                SECTION 06 · GEOGRAPHIC VITAL SIGNS
              </span>
              <h4 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 mt-2">
                Cambrian Park Submarket Metrics
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xl">
                Detailed localized geographic variables including walkability limits, safety indices, and public
                school ratings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 border-t border-b border-neutral-900/10 py-4 text-[10px] text-neutral-600">
              <div className="space-y-4">
                <h5 className="text-[9px] font-black uppercase tracking-wider text-neutral-900 mb-2">
                  Accessibility Profiles
                </h5>
                {NEIGHBORHOOD_METRICS.map((metric, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span>{metric.label}</span>
                      <span className="font-mono font-bold text-neutral-900">
                        {metric.value}{' '}
                        <span className="text-neutral-400 text-[8px] font-normal">/ {metric.desc}</span>
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-neutral-800 h-full" style={{ width: metric.value }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t md:border-t-0 md:border-l border-neutral-200 pt-3 md:pt-0 md:pl-6">
                <h5 className="text-[9px] font-black uppercase tracking-wider text-neutral-900 mb-2">
                  School Classifications (San Jose Unified)
                </h5>
                {SCHOOL_RATINGS.map((school, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span>
                        {school.level}: {school.name}
                      </span>
                      <span className="font-mono font-bold text-neutral-900">
                        {school.rating} <span className="text-neutral-400 text-[8px] font-normal">/ 10 Rating</span>
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                      {school.level === 'High School' ? (
                        <div className="bg-[#00875a] h-full" style={{ width: '80%' }} />
                      ) : (
                        <div className="bg-neutral-500 h-full" style={{ width: '50%' }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[9.5px] text-neutral-500 leading-relaxed">
              <div>
                <span className="font-bold text-neutral-700 uppercase block mb-0.5">LOCAL CRIME RATING</span>
                Violent metrics index is extremely low; property theft indexes as moderate. Typical profile for
                high-density Silicon Valley commuter corridors.
              </div>
              <div>
                <span className="font-bold text-neutral-700 uppercase block mb-0.5">APPRECIATION INDEX</span>
                Stable annual expansion metrics of +3.2% year-over-year point to persistent long-term capital
                preservation in Cambrian Park.
              </div>
            </div>
          </div>
        )

      case 'appendix':
        return (
          <div className="mb-4">
            <div className="mb-4">
              <span className="font-sans font-extrabold text-[9px] uppercase tracking-widest text-neutral-500 border-b border-neutral-900 pb-0.5">
                SECTION 07 · DUE DILIGENCE
              </span>
              <h4 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 mt-2">
                Diligence Appendix & Sources
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xl">
                Fully cited municipal references, listing IDs, and foundational registries powering the underwriting
                report.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-neutral-900/10 py-4 my-4">
              <div>
                <h5 className="text-[9px] font-black uppercase tracking-wider text-neutral-900 mb-2">
                  Pre-Closing Verifications
                </h5>
                <div className="space-y-1.5 text-[9.5px] text-neutral-600">
                  {CHECKLIST_ITEMS.map((item, i) => (
                    <label key={i} className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={i < 2}
                        className="mt-0.5 rounded border-neutral-300 text-[#0066cc] focus:ring-[#0066cc]"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-neutral-200 pt-3 md:pt-0 md:pl-4">
                <h5 className="text-[9px] font-black uppercase tracking-wider text-neutral-900 mb-2">
                  Core Citation Mapping
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {CORE_CITATIONS.map((cite) => (
                    <span
                      key={cite}
                      className="font-mono text-[8px] bg-neutral-100 px-2 py-0.5 text-neutral-700 rounded border border-neutral-200"
                    >
                      {cite}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[9px] text-neutral-400 font-mono italic leading-relaxed">
              * The citations mapped above represent live sources queried automatically by the RSARBOS analytical model
              engine to compile structural briefings instantly.
            </p>
          </div>
        )

      default:
        return null
    }
  }

  // Format currency
  const fmt = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

  return (
    <section className="relative w-full py-16 px-4 md:px-8 overflow-hidden radial-glow">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-[#0066cc]/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900/60 border border-neutral-800 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] animate-pulse" />
            <span className="font-mono text-[10px] tracking-wider uppercase text-neutral-400">
              Institutional Underwriting Brief Preview
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            From listing link to <span className="text-[#0066cc]">decision-ready dossier.</span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            A clean underwriting brief built so agents, investors, and lenders can understand the deal without digging
            through raw listing noise. Real-world insights, verified comparisons, and integrated metrics.
          </p>
        </div>

        {/* Main Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Left Column: Navigation Tabs & Value Add Copy */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8">
            <div className="bg-neutral-900/45 backdrop-blur-md p-6 rounded-xl border border-neutral-800/80 shadow-2xl relative overflow-hidden">
              {/* Subtle glow accent */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#0066cc]/10 blur-2xl rounded-full" />

              <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
                <span>[</span> DOSSIER SECTION DIRECTORIES <span>]</span>
              </h3>

              {/* Technical Navigation Links (Tabs) */}
              <nav className="flex flex-col gap-2 relative z-10" role="tablist">
                {TAB_INFO.map((tab) => {
                  const isActive = activeTab === tab.id
                  const tabColor = TAB_COLORS[tab.id]
                  const chevronColor = isActive ? tabColor : 'neutral-600'
                  return (
                    <button
                      key={tab.id}
                      onClick={() => switchTab(tab.id as DossierTab)}
                      id={`btn-${tab.id}`}
                      className={`
                        tab-btn w-full flex items-center justify-between p-3.5 rounded-lg text-left border transition-all duration-300
                        ${
                          isActive
                            ? 'bg-[#0066cc]/5 border-[#0066cc]/30 text-white'
                            : 'bg-transparent border-transparent text-neutral-400 hover:text-white hover:border-neutral-800 hover:bg-neutral-900/50'
                        }
                      `}
                      aria-selected={isActive}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-xs ${
                            isActive ? 'text-[#0066cc]' : 'text-neutral-500'
                          }`}
                        >
                          {tab.number}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            {tab.title}
                          </span>
                          <span
                            className={`text-[10px] ${isActive ? 'text-neutral-400' : 'text-neutral-500'}`}
                          >
                            {tab.subtitle}
                          </span>
                        </div>
                      </div>
                      <svg
                        className={`w-4 h-4 text-[${chevronColor}] shrink-0`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Subtle "Proof of Value" callout card below tabs */}
            <div className="bg-neutral-900/20 p-5 rounded-lg border border-neutral-800/40 text-xs text-neutral-400 leading-relaxed">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-[#0066cc]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-bold text-neutral-300 uppercase font-mono tracking-wider text-[10px]">
                  Decision Intelligence
                </span>
              </div>
              This interactive simulator reproduces the real-world performance parameters of the 1314 Shawn Dr #1
              property. The premium dossier includes dynamic spreadsheets, zoning metrics, HOA assessment reports, and
              legal checkpoints.
            </div>
          </div>

          {/* Right Column: Simulated Institutional A4 Binder */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Outer Premium Shield Frame */}
            <div className="bg-neutral-900/45 p-2 rounded-2xl border border-neutral-800/60 shadow-2xl relative overflow-hidden backdrop-blur-md">
              {/* Sleek Glass Accent line */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#0066cc]/40 to-transparent" />

              {/* Document Screen Wrapper */}
              <div
                id="dossier-paper"
                className="relative overflow-hidden w-full bg-white text-neutral-900 rounded-xl px-4 py-8 md:p-10 shadow-inner flex flex-col justify-between transition-all duration-300 min-h-[750px]"
              >
                {/* Shimmer Scan Overlay Container */}
                <div
                  id="shimmer-scanner"
                  className="absolute inset-0 pointer-events-none z-50 rounded-xl overflow-hidden"
                />

                {/* Document Header (Institutional Layout) */}
                <div className="border-b-2 border-neutral-900 pb-3 flex justify-between items-end mb-6">
                  <div className="flex flex-col">
                    <span className="font-sans font-extrabold text-[11px] tracking-widest text-neutral-900 uppercase">
                      RSARBOS
                    </span>
                    <span className="font-sans text-[8px] font-semibold text-neutral-400 uppercase tracking-widest mt-0.5">
                      UNDERWRITING PORTFOLIO DECK
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      id="doc-id-label"
                      className="font-mono text-[9px] font-bold text-neutral-900 uppercase tracking-wider block"
                    >
                      PAGE 00 // COVER REGISTRY
                    </span>
                    <span className="font-sans text-[8px] font-semibold text-neutral-400 uppercase tracking-widest mt-0.5">
                      PORTFOLIO DECK ID: ML82047088
                    </span>
                  </div>
                </div>

                {/* Core Asset Valuation Matrix */}
                <div className="bg-neutral-50 border border-neutral-200/80 rounded-md p-4 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-full w-1.5 bg-[#0066cc]" />
                  <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">
                    [ CORE ASSET VALUATION MATRIX ]
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <span className="font-sans text-[8px] text-neutral-400 font-bold uppercase tracking-wider block">
                        ACQUISITION TARGET
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span
                          id="core-price-display"
                          className="font-sans text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight"
                        >
                          $470,000
                        </span>
                      </div>
                      <span className="text-[9px] text-neutral-500 mt-0.5 block">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e02424]" /> -$30,000 June Price Drop
                      </span>
                    </div>
                    <div className="border-l border-neutral-200 pl-4">
                      <span className="font-sans text-[8px] text-neutral-400 font-bold uppercase tracking-wider block">
                        ASSESSED MARKET VALUE
                      </span>
                      <span className="font-sans text-xl font-bold text-neutral-800 tracking-tight block mt-0.5">
                        $515,000
                      </span>
                      <span className="text-[9px] text-[#00875a] font-bold block mt-0.5">
                        9.57% Buy-Under Discount
                      </span>
                    </div>
                    <div className="border-l border-neutral-200 pl-4">
                      <span className="font-sans text-[8px] text-neutral-400 font-bold uppercase tracking-wider block">
                        UNIT ACQUISITION RATE
                      </span>
                      <span className="font-sans text-xl font-bold text-neutral-800 tracking-tight block mt-0.5">
                        $580{' '}
                        <span className="text-xs text-neutral-500 font-normal">/ SF</span>
                      </span>
                      <span className="text-[9px] text-neutral-400 block mt-0.5">vs $938/SF ZIP Average</span>
                    </div>
                    <div className="border-l border-neutral-200 pl-4">
                      <span className="font-sans text-[8px] text-neutral-400 font-bold uppercase tracking-wider block">
                        HOA FIXED MOISTURE
                      </span>
                      <span className="font-sans text-xl font-bold text-[#e02424] tracking-tight block mt-0.5">
                        $534{' '}
                        <span className="text-xs text-neutral-500 font-normal">/ mo</span>
                      </span>
                      <span className="text-[9px] text-neutral-400 block mt-0.5">
                        APN 569-43-077 Ground Condo
                      </span>
                    </div>
                  </div>

                  {/* Discount Gauge indicator */}
                  <div className="mt-3 pt-2 border-t border-neutral-200/50 flex items-center justify-between text-[10px]">
                    <span className="text-neutral-500 font-mono">
                      Zoning class: R-2 Low Density Condominium (Built 1970)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">Underwrite Margin:</span>
                      <div className="w-32 bg-neutral-200 h-1.5 rounded-full overflow-hidden flex">
                        <div className="bg-[#00875a] h-full" style={{ width: '90.4%' }} />
                      </div>
                      <span className="font-mono font-bold text-[#00875a]">+9.57% Equity</span>
                    </div>
                  </div>
                </div>

                {/* Tab Content Panels */}
                {renderTabContent()}

                {/* Document Footer */}
                <div className="border-t border-neutral-200 pt-3 flex justify-between items-center mt-6">
                  <span className="font-sans text-[8px] font-semibold text-neutral-400 uppercase tracking-widest">
                    SAN JOSE, CA · SYSTEMATIC UNDERWRITING PORTFOLIO DECK
                  </span>
                  <span className="font-mono text-[8px] text-neutral-400">
                    RSARBOS ACQUISITIONS DEEP-CORE VERIFIED
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Cash-Flow Underwriting Strip */}
            <div className="bg-neutral-900/60 p-6 rounded-xl border border-neutral-800/80 shadow-xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00875a]/30 to-transparent" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-neutral-800/60">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00875a]" />
                    Active Dossier Underwriting Module
                  </h4>
                  <p className="text-neutral-400 text-xs mt-0.5">
                    Test real-world scenarios on the fly. Watch yield indicators recalculate automatically.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewRent(2900)}
                    className="px-2.5 py-1 text-[10px] font-mono border border-[#e02424]/30 bg-[#e02424]/5 text-[#e02424] hover:bg-[#e02424]/15 rounded transition"
                  >
                    Conservative ($2.9K)
                  </button>
                  <button
                    onClick={() => setPreviewRent(3500)}
                    className="px-2.5 py-1 text-[10px] font-mono border border-[#0066cc]/30 bg-[#0066cc]/5 text-[#0066cc] hover:bg-[#0066cc]/15 rounded transition"
                  >
                    Base Case ($3.5K)
                  </button>
                  <button
                    onClick={() => setPreviewRent(4410)}
                    className="px-2.5 py-1 text-[10px] font-mono border border-[#00875a]/30 bg-[#00875a]/5 text-[#00875a] hover:bg-[#00875a]/15 rounded transition"
                  >
                    RentCast ($4.41K)
                  </button>
                </div>
              </div>

              {/* Inputs / Slider Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Rent Slider */}
                <div className="md:col-span-4 flex flex-col gap-2">
                  <div className="flex justify-between items-baseline text-xs font-mono text-neutral-400">
                    <span className="uppercase tracking-wider">Estimated Monthly Lease</span>
                    <span id="slider-rent-label" className="font-mono text-xs font-bold text-white mt-0.5 block">
                      ${rentVal.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    id="strip-rent-slider"
                    min="2500"
                    max="5000"
                    step="50"
                    value={rentVal}
                    onChange={(e) => setRentVal(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#00875a]"
                  />
                </div>

                {/* Live Yield Indicators */}
                <div className="md:col-span-8 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-neutral-950/40 rounded-lg border border-neutral-800/60">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">
                      Total Expenses
                    </span>
                    <span
                      id="strip-exp-val"
                      className="font-mono text-xs md:text-sm text-neutral-300 font-bold mt-0.5 block"
                    >
                      {fmt(totalOpEx)}
                    </span>
                  </div>
                  <div className="p-2 bg-neutral-950/40 rounded-lg border border-neutral-800/60">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">
                      Net Cash Flow
                    </span>
                    <span
                      id="strip-cash-val"
                      className={`font-mono text-xs md:text-sm font-bold mt-0.5 block ${
                        monthlyCashFlow >= 0 ? 'text-[#00875a]' : 'text-[#e02424]'
                      }`}
                    >
                      {monthlyCashFlow >= 0 ? '+' : '-'}
                      ${Math.abs(Math.round(monthlyCashFlow)).toLocaleString()} /mo
                    </span>
                  </div>
                  <div
                    id="strip-coc-card"
                    className="p-2 bg-neutral-950/40 rounded-lg border border-neutral-800/60"
                  >
                    <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">
                      Cash-on-Cash Yield
                    </span>
                    <span
                      id="strip-coc-val"
                      className={`font-mono text-xs md:text-sm font-bold mt-0.5 block ${
                        cocYield >= 0 ? 'text-[#00875a]' : 'text-[#e02424]'
                      }`}
                    >
                      {cocYield >= 0 ? '+' : ''}
                      {cocYield.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DossierPreview
