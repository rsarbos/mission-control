import React from 'react'
import rsarbosLogo from '../assets/logo.png'

export default function DossierSuccessPage() {
  return (
    <div className="public-site">
      <div className="ambient-glow" aria-hidden="true"></div>
      <nav className="public-nav" aria-label="Navigation">
        <div className="nav-inner">
          <a className="logo-wordmark" href="/">
            <img src={rsarbosLogo} alt="RSARBOS" />
          </a>
        </div>
      </nav>

      <main>
        <section className="rs-hero" style={{ padding: '120px 0 80px' }}>
          <div className="hero-content" style={{ textAlign: 'center' }}>
            <div className="hero-chip" style={{ justifyContent: 'center' }}>
              <span>✓</span> Request Received
            </div>
            <h1 style={{ textAlign: 'center' }}>
              <span className="hero-title-line">Your Dossier Is</span>
              <span className="hero-title-line red-glow">Being Generated</span>
            </h1>
            <p className="hero-subtitle" style={{ textAlign: 'center', margin: '0 auto' }}>
              Your 15-minute complimentary RSARBOS dossier is being analyzed and will be
              emailed to you within minutes.
            </p>
            <div className="hero-actions centered" style={{ justifyContent: 'center' }}>
              <a
                className="primary-action shine-action"
                href="/dossier-dashboard"
                style={{ marginRight: '12px' }}
              >
                Owner Dashboard
              </a>
              <a className="secondary-action glass-action" href="/">
                Back to Home
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <div className="content-wrap">
          <div className="footer-bottom">
            <p>© 2026 RSARBOS Next-Gen Business Technology. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
