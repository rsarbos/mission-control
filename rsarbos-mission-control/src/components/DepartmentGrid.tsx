import React from 'react'
import { Department } from '../data/departments'

interface Props {
  departments: Department[]
}

export default function DepartmentGrid({ departments }: Props) {
  return (
    <section className="department-grid">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Functional Departments</p>
          <h3>RSARBOS operating model</h3>
        </div>
      </div>
      <div className="grid cards-grid">
        {departments.map((dept) => (
          <article key={dept.id} className="department-card">
            <div className="department-card-header">
              <div className="department-icon">{dept.name.charAt(0)}</div>
              <div>
                <p className="eyebrow muted">{dept.role}</p>
                <h4>{dept.name}</h4>
              </div>
            </div>
            <p className="muted" style={{ margin: '12px 0 16px' }}>{dept.purpose}</p>
            <div className="metrics-row">
              {dept.metrics.map((metric) => (
                <div key={metric.label} className="metric-pill">
                  <span className="metric-label">{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
            <div className="department-card-footer">
              <div>
                <p className="small-label">AXIOM Agent</p>
                <strong>{dept.axiomAgent}</strong>
              </div>
              <div>
                <p className="small-label">Owner</p>
                <strong>{dept.owner}</strong>
              </div>
            </div>
            <div className="next-task">
              <p className="small-label">Next Recommended Task</p>
              <p>{dept.nextRecommendedTask}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
