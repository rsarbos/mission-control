import React, { useState } from 'react'
import { trackEvent } from '../utils/analytics'

const INITIAL_FORM = {
  clientName: '',
  email: '',
  phone: '',
  propertyUrl: '',
  investmentIntent: '',
  urgency: 'standard',
  notes: '',
}

export default function ManualReportForm() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState(INITIAL_FORM)

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsProcessing(true)
    setFormError('')
    trackEvent('checkout_start', {
      source: 'manual_report_form',
      investmentIntent: form.investmentIntent,
      urgency: form.urgency,
    })

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: form.clientName,
          customerEmail: form.email,
          customerPhone: form.phone,
          propertyUrl: form.propertyUrl,
          investmentIntent: form.investmentIntent,
          urgency: form.urgency,
          notes: form.notes,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.checkoutUrl) {
        throw new Error(result.error || 'Unable to begin checkout.')
      }

      window.location.assign(result.checkoutUrl)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to begin checkout. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <form className="neo-form glass-panel" onSubmit={submitRequest}>
      <label>
        CLIENT NAME *
        <input value={form.clientName} onFocus={() => trackEvent('request_form_start')} onChange={(event) => updateField('clientName', event.target.value)} placeholder="Jane Doe / Acme Corp" required />
      </label>
      <label>
        EMAIL ADDRESS *
        <input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="jane@example.com" required />
      </label>
      <label>
        PHONE NUMBER
        <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="(555) 123-4567" />
      </label>
      <label className="full-field">
        PROPERTY URL (Zillow, Redfin, MLS, etc.) *
        <input type="url" value={form.propertyUrl} onChange={(event) => updateField('propertyUrl', event.target.value)} placeholder="https://..." required />
      </label>
      <label>
        INVESTMENT INTENT *
        <select value={form.investmentIntent} onChange={(event) => updateField('investmentIntent', event.target.value)} required>
          <option value="" disabled>
            Select strategy...
          </option>
          <option value="fix_flip">Fix & Flip</option>
          <option value="buy_hold">Buy & Hold (Rental)</option>
          <option value="wholesale">Wholesale</option>
          <option value="brrrr">BRRRR</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>
        URGENCY LEVEL
        <select value={form.urgency} onChange={(event) => updateField('urgency', event.target.value)}>
          <option value="standard">Standard (24hr post-payment)</option>
          <option value="high">High (Offer pending)</option>
        </select>
      </label>
      <label className="full-field">
        NOTES / SPECIFIC QUESTIONS
        <textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} rows={3} placeholder="Any specific concerns regarding zoning, rehab scope, or market conditions?"></textarea>
      </label>
      {formError && <p className="form-error full-field">{formError}</p>}
      <button className="primary-action shine-action full-field" type="submit" disabled={isProcessing}>
        {isProcessing ? 'OPENING SECURE CHECKOUT...' : 'REQUEST REPORT - $100'}
      </button>
    </form>
  )
}
