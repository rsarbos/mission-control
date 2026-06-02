import React from 'react'

export default function Tabs({ tabs, active, onChange }: any) {
  return (
    <nav className="mc-tabs">
      {tabs.map((t:any) => (
        <button
          key={t.id}
          className={`tab-button ${t.id === active ? 'active' : ''}`}
          data-tab={t.id}
          onClick={() => onChange(t.id)}
          aria-selected={t.id === active}
          role="tab"
        >
          {t.title}
        </button>
      ))}
    </nav>
  )
}
