import React from 'react'

export default function Tabs({ tabs, active, onChange }: any) {
  return (
    <nav className="mc-tabs">
      {tabs.map((t:any) => (
        <button key={t.id} className="tab-button" data-tab={t.id} onClick={() => onChange(t.id)} style={{fontWeight: t.id===active?700:400}}>
          {t.title}
        </button>
      ))}
    </nav>
  )
}
