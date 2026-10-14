import { useEffect, useRef } from 'react'
import dossierHtml from '../../../DOSSIER_1.html?raw'

type DossierTab = 'registry' | 'verdict' | 'rent' | 'arv' | 'risk' | 'neighborhood' | 'appendix'

const DOSSIER_TABS: DossierTab[] = ['registry', 'verdict', 'rent', 'arv', 'risk', 'neighborhood', 'appendix']
const DOSSIER_PAGE_LABELS: Record<DossierTab, string> = {
  registry: 'PAGE 00 // COVER REGISTRY',
  verdict: 'PAGE 02 // EXECUTIVE VERDICT',
  rent: 'PAGE 04 // RENTAL THESIS',
  arv: 'PAGE 05 // ARV VALUE SCENARIOS',
  risk: 'PAGE 06 // RISK REGISTER',
  neighborhood: 'PAGE 07 // NEIGHBORHOOD INTEL',
  appendix: 'PAGE 09 // PRE-CLOSING APPENDIX',
}

let tailwindLoad: Promise<void> | undefined

function loadTailwind(config: string) {
  if (tailwindLoad) return tailwindLoad

  const configScript = document.createElement('script')
  configScript.textContent = `window.tailwind = window.tailwind || {};\n${config}`
  document.head.append(configScript)

  tailwindLoad = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.tailwindcss.com'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Unable to load dossier styles'))
    document.head.append(script)
  })

  return tailwindLoad
}

export default function InlineDossier() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dossierRoot = rootRef.current
    if (!dossierRoot) return

    const parsed = new DOMParser().parseFromString(dossierHtml, 'text/html')
    const body = parsed.body
    dossierRoot.className = `inline-dossier ${body.className}`

    const section = body.querySelector('section')
    if (!section) {
      throw new Error('The dossier preview section is missing')
    }
    section.classList.remove('radial-glow')
    section.classList.add('inline-dossier-radial-glow')
    dossierRoot.innerHTML = section.outerHTML

    dossierRoot.querySelectorAll<HTMLElement>('[onclick], [oninput]').forEach((element) => {
      const rentPreset = element.getAttribute('onclick')?.match(/setPreviewRent\((\d+)\)/)
      if (rentPreset) {
        element.dataset.dossierRent = rentPreset[1]
      }
      element.removeAttribute('onclick')
      element.removeAttribute('oninput')
    })

    function updateCalculator() {
      const root = rootRef.current
      if (!root) return
      const rentSlider = root.querySelector<HTMLInputElement>('#strip-rent-slider')
      const rentLabel = root.querySelector<HTMLElement>('#slider-rent-label')
      const expensesLabel = root.querySelector<HTMLElement>('#strip-exp-val')
      const cashFlowLabel = root.querySelector<HTMLElement>('#strip-cash-val')
      const cocLabel = root.querySelector<HTMLElement>('#strip-coc-val')
      if (!rentSlider || !rentLabel || !expensesLabel || !cashFlowLabel || !cocLabel) {
        throw new Error('The dossier calculator is incomplete')
      }

      const rent = Number(rentSlider.value)
      const purchasePrice = 470000
      const downPayment = purchasePrice * 0.2
      const monthlyRate = 0.0675 / 12
      const loanAmount = purchasePrice - downPayment
      const principalAndInterest = (loanAmount * monthlyRate * (1 + monthlyRate) ** 360) / ((1 + monthlyRate) ** 360 - 1)
      const expenses = principalAndInterest + 534 + (purchasePrice * 0.0115) / 12 + 120 + rent * 0.1
      const monthlyCashFlow = rent - expenses
      const cashOnCash = (monthlyCashFlow * 12 / downPayment) * 100

      rentLabel.textContent = `$${rent.toLocaleString()}`
      expensesLabel.textContent = `$${Math.round(expenses).toLocaleString()}`
      cashFlowLabel.textContent = `${monthlyCashFlow >= 0 ? '+$' : '-$'}${Math.abs(Math.round(monthlyCashFlow)).toLocaleString()} /mo`
      cocLabel.textContent = `${cashOnCash >= 0 ? '+' : ''}${cashOnCash.toFixed(1)}%`
      cashFlowLabel.className = `font-mono text-xs md:text-sm font-bold mt-0.5 block ${monthlyCashFlow >= 0 ? 'text-[#00875a]' : 'text-[#e02424]'}`
      cocLabel.className = `font-mono text-xs md:text-sm font-bold mt-0.5 block ${cashOnCash >= 0 ? 'text-[#00875a]' : 'text-[#e02424]'}`
    }

    function switchTab(tab: DossierTab) {
      const root = rootRef.current
      if (!root) return
      root.querySelectorAll<HTMLButtonElement>('.tab-btn').forEach((button) => {
        button.setAttribute('aria-selected', 'false')
        button.className = 'tab-btn w-full flex items-center justify-between p-3.5 rounded-lg text-left border transition-all duration-300 bg-transparent border-transparent text-neutral-400 hover:text-white hover:border-neutral-800 hover:bg-neutral-900/50'
        const label = button.querySelector('span:last-child')
        if (label) label.className = 'text-[10px] text-neutral-500'
        const chevron = button.querySelector('svg')
        if (chevron) chevron.setAttribute('class', 'w-4 h-4 text-neutral-600 shrink-0')
      })

      root.querySelectorAll<HTMLElement>('.dossier-tab-content').forEach((panel) => {
        panel.style.display = 'none'
      })
      const activePanel = root.querySelector<HTMLElement>(`#panel-${tab}`)
      const activeButton = root.querySelector<HTMLButtonElement>(`#btn-${tab}`)
      if (!activePanel || !activeButton) {
        throw new Error(`The dossier tab "${tab}" is incomplete`)
      }

      activePanel.style.display = 'flex'
      activeButton.setAttribute('aria-selected', 'true')
      activeButton.className = 'tab-btn w-full flex items-center justify-between p-3.5 rounded-lg text-left border transition-all duration-300 bg-[#0066cc]/5 border-[#0066cc]/30 text-white'
      const label = activeButton.querySelector('span:last-child')
      if (label) label.className = 'text-[10px] text-neutral-400'
      const chevron = activeButton.querySelector('svg')
      if (chevron) chevron.setAttribute('class', 'w-4 h-4 text-[#0066cc] shrink-0')

      const docLabel = root.querySelector<HTMLElement>('#doc-id-label')
      if (docLabel) docLabel.textContent = DOSSIER_PAGE_LABELS[tab]

      const scanner = root.querySelector<HTMLElement>('#shimmer-scanner')
      if (scanner) {
        scanner.classList.remove('scan-active')
        void scanner.offsetWidth
        scanner.classList.add('scan-active')
      }
    }

    function handleClick(event: MouseEvent) {
      const root = rootRef.current
      if (!root) return
      if (!(event.target instanceof Element)) return
      const button = event.target.closest<HTMLButtonElement>('button')
      if (!button || !root.contains(button)) return

      const tab = button.id.startsWith('btn-') ? button.id.slice(4) : ''
      if (DOSSIER_TABS.includes(tab as DossierTab)) {
        switchTab(tab as DossierTab)
        return
      }

      const rentPreset = Number(button.dataset.dossierRent)
      if (button.dataset.dossierRent && Number.isFinite(rentPreset)) {
        const slider = root.querySelector<HTMLInputElement>('#strip-rent-slider')
        if (!slider) throw new Error('The dossier rent slider is missing')
        slider.value = String(rentPreset)
        updateCalculator()
      }
    }

    function handleInput(event: Event) {
      const root = rootRef.current
      if (!root) return
      if (event.target === root.querySelector('#strip-rent-slider')) {
        updateCalculator()
      }
    }

    dossierRoot.addEventListener('click', handleClick)
    dossierRoot.addEventListener('input', handleInput)
    updateCalculator()

    const dossierStyles = parsed.head.querySelector('style')
    if (dossierStyles) {
      const style = document.createElement('style')
      style.textContent = dossierStyles.textContent
        ?.replace(':root {', '.inline-dossier {')
        .replace('.scan-active::after', '.inline-dossier .scan-active::after')
        .replace('.hairline-border {', '.inline-dossier .hairline-border {')
        .replace('.paper-hairline-border {', '.inline-dossier .paper-hairline-border {')
        .replace('.radial-glow {', '.inline-dossier .inline-dossier-radial-glow {')
        .replace('.no-scrollbar::-webkit-scrollbar', '.inline-dossier .no-scrollbar::-webkit-scrollbar')
        .replace('.no-scrollbar {', '.inline-dossier .no-scrollbar {') ?? ''
      document.head.append(style)
    }

    for (const fontLink of Array.from(parsed.head.querySelectorAll<HTMLLinkElement>('link[rel="preconnect"], link[href*="fonts.googleapis.com"]'))) {
      if (!document.head.querySelector(`link[href="${fontLink.href}"]`)) {
        document.head.append(fontLink.cloneNode(true))
      }
    }

    const config = parsed.head.querySelector('script:not([src])')?.textContent
    if (!config) {
      throw new Error('The dossier Tailwind configuration is missing')
    }

    let disposed = false
    void loadTailwind(config).then(() => {
      if (disposed) return
      dossierRoot.dataset.ready = 'true'
    }).catch((error: unknown) => {
      console.error('Failed to initialize the inline dossier', error)
    })

    return () => {
      disposed = true
      dossierRoot.removeEventListener('click', handleClick)
      dossierRoot.removeEventListener('input', handleInput)
    }
  }, [])

  return <div className="inline-dossier-mount" ref={rootRef} />
}
