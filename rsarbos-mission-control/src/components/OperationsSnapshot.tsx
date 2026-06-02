import React from 'react'
import { Department } from '../data/departments'

interface Props {
  departments: Department[]
}

export default function OperationsSnapshot({ departments }: Props) {
  return (
    <section className="operations-snapshot card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Operations Departments Snapshot</p>
          <h3>Pulse overview</h3>
        </div>
      </div>
      <div className="snapshot-grid">
        {departments.map((dept) => (
          <div key={dept.id} className="snapshot-card">
            <div className="snapshot-top">
              <h4>{dept.name}</h4>
              <span className={`status-badge status-${dept.status}`}>{dept.status}</span>
            </div>
            <p className="muted small-label">Constraint</p>
            <p>{dept.nextRecommendedTask}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
