type AnalyticsEvent = {
  event: string
  timestamp?: string
  [key: string]: unknown
}

type PlausibleOptions = {
  props?: Record<string, unknown>
  callback?: (result: unknown) => void
  interactive?: boolean
}

type PlausibleFunction = {
  (event: string, options?: PlausibleOptions): void
  q?: [string, PlausibleOptions | undefined][]
}

declare global {
  interface Window {
    dataLayer?: AnalyticsEvent[]
    plausible?: PlausibleFunction
  }
}

const ANALYTICS_EVENTS_KEY = 'rsarbos_analytics_events'
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN || ''
const PLAUSIBLE_SCRIPT_SRC = import.meta.env.VITE_PLAUSIBLE_SCRIPT_SRC || 'https://plausible.io/js/script.js'

function persistEvent(event: AnalyticsEvent) {
  try {
    const raw = localStorage.getItem(ANALYTICS_EVENTS_KEY)
    const events = raw ? JSON.parse(raw) as AnalyticsEvent[] : []
    localStorage.setItem(ANALYTICS_EVENTS_KEY, JSON.stringify([event, ...events].slice(0, 80)))
  } catch {
    // Local telemetry is best-effort only; provider delivery still runs.
  }
}

export function initializeAnalytics() {
  window.dataLayer = window.dataLayer || []

  if (!PLAUSIBLE_DOMAIN || document.querySelector('script[data-rsarbos-analytics="plausible"]')) {
    return
  }

  window.plausible = window.plausible || function plausibleProxy(event: string, options?: PlausibleOptions) {
    const queue = window.plausible?.q || []
    queue.push([event, options])
    if (window.plausible) {
      window.plausible.q = queue
    }
  }

  const script = document.createElement('script')
  script.defer = true
  script.dataset.domain = PLAUSIBLE_DOMAIN
  script.dataset.rsarbosAnalytics = 'plausible'
  script.src = PLAUSIBLE_SCRIPT_SRC
  document.head.appendChild(script)
}

export function trackEvent(event: string, properties: Record<string, unknown> = {}) {
  const payload = { event, timestamp: new Date().toISOString(), ...properties }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
  persistEvent(payload)

  if (window.plausible) {
    window.plausible(event, { props: properties })
  }
}

export function trackPageView(path: string) {
  trackEvent('page_view', { path })
}

export function getAnalyticsSnapshot() {
  let localEvents: AnalyticsEvent[] = []
  try {
    const raw = localStorage.getItem(ANALYTICS_EVENTS_KEY)
    localEvents = raw ? JSON.parse(raw) : []
  } catch {
    localEvents = []
  }

  return {
    provider: 'Plausible Analytics',
    configured: Boolean(PLAUSIBLE_DOMAIN),
    domain: PLAUSIBLE_DOMAIN || 'Set VITE_PLAUSIBLE_DOMAIN',
    script: PLAUSIBLE_SCRIPT_SRC,
    dashboardUrl: PLAUSIBLE_DOMAIN ? `https://plausible.io/${PLAUSIBLE_DOMAIN}` : '',
    localEvents,
  }
}
