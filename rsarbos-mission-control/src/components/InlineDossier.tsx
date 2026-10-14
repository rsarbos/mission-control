import { useEffect, useRef } from 'react'
import dossierHtml from '../../../DOSSIER_1.html?raw'

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
    const root = rootRef.current
    if (!root) return

    const parsed = new DOMParser().parseFromString(dossierHtml, 'text/html')
    const body = parsed.body
    root.className = `inline-dossier ${body.className}`

    const section = body.querySelector('section')
    if (!section) {
      throw new Error('The dossier preview section is missing')
    }
    root.innerHTML = section.outerHTML

    const dossierStyles = parsed.head.querySelector('style')
    if (dossierStyles) {
      const style = document.createElement('style')
      style.textContent = dossierStyles.textContent
        ?.replace(':root {', '.inline-dossier {')
        .replace('.scan-active::after', '.inline-dossier .scan-active::after')
        .replace('.hairline-border {', '.inline-dossier .hairline-border {')
        .replace('.paper-hairline-border {', '.inline-dossier .paper-hairline-border {')
        .replace('.radial-glow {', '.inline-dossier .radial-glow {')
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
      const interactionCode = Array.from(body.querySelectorAll('script:not([src])'))
        .map((script) => script.textContent ?? '')
        .find((script) => script.includes('function switchTab'))
      if (!interactionCode) {
        throw new Error('The dossier interactions are missing')
      }

      const script = document.createElement('script')
      script.textContent = interactionCode
      document.body.append(script)
      root.dataset.ready = 'true'
    }).catch((error: unknown) => {
      console.error('Failed to initialize the inline dossier', error)
    })

    return () => {
      disposed = true
    }
  }, [])

  return <div className="inline-dossier-mount" ref={rootRef} />
}
