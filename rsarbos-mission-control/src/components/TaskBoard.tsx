import React from 'react'
import { FounderTask } from '../data/founder-tasks'

export default function TaskBoard({ tasks, onToggle }: { tasks: FounderTask[]; onToggle: (id: string) => void }) {
  return (
    <div className="card">
      <h3>Founder Tasks</h3>
      <ul>
        {tasks.map((t) => (
          <li key={t.id} style={{marginBottom:8}}>
            <label style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="checkbox" checked={t.status==='done'} onChange={()=>onToggle(t.id)} />
              <span style={{textDecoration:t.status==='done'?'line-through':'none'}}>{t.title}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
