import React, { useState } from 'react'
import { trackEvent } from '../utils/analytics'

const INITIAL_FORM = {
  agentName: '',
  agentEmail: '',
  agentPhone: '',
  propertyAddress: '',
  propertyUrl: '',
  brokerage: '',
  mlsId: '',
  investmentIntent: '',
}

type SubmitState = 'idle' | 'processing' | 'success' | 'error'

export default function DossierRequestForm() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [formError, setFormError] = useState('')
  const [requestId, setRequestId] = useState('')
  const [form, setForm] = useState(INITIAL_FORM)

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsProcessing(true)
    setSubmitState('processing')
    setFormError('')
    trackEvent('free_dossier_request_start', {
      hasPropertyUrl: Boolean(form.propertyUrl),
      investmentIntent: form.investmentIntent,
    })

    try {
      const response = await fetch('/api/dossier-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_name: form.agentName,
          agent_email: form.agentEmail,
          agent_phone: form.agentPhone,
          property_address: form.propertyAddress,
          property_url: form.propertyUrl,
          brokerage: form.brokerage,
          mls_id: form.mlsId,
          source_channel: 'Website',
          investment_intent: form.investmentIntent,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Unable to submit dossier request.')
      }

      setRequestId(result.requestId || '')
      trackEvent('free_dossier_request_success', { requestId: result.requestId })
      setSubmitState('success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit request. Please try again.'
      setFormError(message)
      setSubmitState('error')
      trackEvent('free_dossier_request_error', { error: message })
    } finally {
      setIsProcessing(false)
    }
  }

  if (submitState === 'processing') {
    return (
      <div className="dossier-processing-state glass-panel">
        <div className="processing-spinner" aria-hidden="true">
          <div className="spinner-ring"></div>
        </div>
        <h3>RSARBOS Underwriter analyzing</h3>
        <p className="processing-subtext">
          Analyzing cap rates, HOA drag, and local comps for your property...
        </p>
        <p className="processing-subtext small">
          Your 15-minute complimentary dossier will be generated and sent to your email within minutes.
        </p>
      </div>
    )
  }

  if (submitState === 'success') {
    return (
      <div className="dossier-success-state glass-panel">
        <div className="success-icon" aria-hidden="true">✓</div>
        <h3>Your complimentary dossier is being generated</h3>
        <p className="success-message">
          Your 15-minute RSARBOS dossier for the property has been received and is being processed.
          It will be sent to <strong>{form.agentEmail}</strong> shortly.
        </p>
        {requestId && (
          <p className="request-id">
            Request ID: <code>{requestId}</code>
          </p>
        )}
        <p className="success-subtext">
          The dossier includes a property verdict, rent vs. market comparison, acquisition basis
          gap analysis, and quick risk flags. If it reveals significant upside, you'll see a
          one-tap upgrade to the full $300 investor dossier inside the email.
        </p>
      </div>
    )
  }

  return (
    <form className="neo-form glass-panel dossier-request-form" onSubmit={submitRequest}>
      <div className="form-row">
        <label>
          PROPERTY ADDRESS *
          <input
            value={form.propertyAddress}
            onChange={(e) => updateField('propertyAddress', e.target.value)}
            placeholder="123 Main St, San Francisco, CA 94105"
            required
          />
        </label>
        <label>
          PROPERTY URL (Zillow, Redfin, MLS, etc.)
          <input
            type="url"
            value={form.propertyUrl}
            onChange={(e) => updateField('propertyUrl', e.target.value)}
            placeholder="https://..."
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          AGENT NAME *
          <input
            value={form.agentName}
            onChange={(e) => updateField('agentName', e.target.value)}
            placeholder="Jane Doe"
            required
          />
        </label>
        <label>
          EMAIL ADDRESS *
          <input
            type="email"
            value={form.agentEmail}
            onChange={(e) => updateField('agentEmail', e.target.value)}
            placeholder="jane@example.com"
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          PHONE NUMBER *
          <input
            type="tel"
            value={form.agentPhone}
            onChange={(e) => updateField('agentPhone', e.target.value)}
            placeholder="(555) 123-4567"
            required
          />
        </label>
        <label>
          BROKERAGE / COMPANY
          <input
            value={form.brokerage}
            onChange={(e) => updateField('brokerage', e.target.value)}
            placeholder="ABC Realty"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          MLS ID
          <input
            value={form.mlsId}
            onChange={(e) => updateField('mlsId', e.target.value)}
            placeholder="MLS123456 (optional)"
          />
        </label>
        <label>
          INVESTMENT INTENT
          <select
            value={form.investmentIntent}
            onChange={(e) => updateField('investmentIntent', e.target.value)}
          >
            <option value="">Select strategy...</option>
            <option value="fix_flip">Fix & Flip</option>
            <option value="buy_hold">Buy & Hold (Rental)</option>
            <option value="wholesale">Wholesale</option>
            <option value="brrrr">BRRRR</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      {formError && <p className="form-error full-field">{formError}</p>}

      <button
        className="primary-action shine-action full-field"
        type="submit"
        disabled={isProcessing}
      >
        {isProcessing ? 'REQUESTING DOSSIER...' : 'REQUEST COMPLIMENTARY DOSSIER (15 min)'}
      </button>

      <p className="form-disclaimer">
        No payment required. Your 15-minute dossier arrives in minutes. If it surfaces real
        value, you can upgrade to the full $300 investor dossier with one click.
      </p>
    </form>
  )
}
