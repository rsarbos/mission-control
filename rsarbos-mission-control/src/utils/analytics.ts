type AnalyticsEvent = {
  event: string
  [key: string]: unknown
}

declare global {
  interface Window {
    dataLayer?: AnalyticsEvent[]
  }
}

export function trackEvent(event: string, properties: Record<string, unknown> = {}) {
  const payload = { event, ...properties }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
}
