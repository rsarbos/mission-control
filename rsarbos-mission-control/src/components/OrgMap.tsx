import React from 'react'

const mapNodes = [
  { label: 'Founder', role: 'Yael Axel' },
  { label: 'AXIOM-GLOBAL', role: 'Cross-Domain Orchestration' },
  { label: 'AXIOM-CORE', role: 'Infrastructure & Logic' },
  { label: 'AXIOM-OPS', role: 'Manual Underwriting Operations' },
  { label: 'AXIOM-WEB', role: 'Website & Lead Capture' },
  { label: 'AXIOM-BIZ', role: 'Revenue & Growth' },
]

export default function OrgMap() {
  return (
    <section className="org-map card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">RSARBOS Organizational Intelligence</p>
          <h3>Command map</h3>
        </div>
      </div>
      <div className="org-layers">
        <div className="org-node founder">Founder</div>
        <div className="org-node global">AXIOM-GLOBAL</div>
        <div className="org-row">
          <div className="org-node">AXIOM-CORE</div>
          <div className="org-node">AXIOM-OPS</div>
          <div className="org-node">AXIOM-WEB</div>
          <div className="org-node">AXIOM-BIZ</div>
        </div>
      </div>
      <div className="org-copy">
        <p className="muted">Founder → AXIOM-GLOBAL → domain agents. These nodes represent the intelligence layers coordinating the departments beneath Mission Control.</p>
      </div>
    </section>
  )
}
