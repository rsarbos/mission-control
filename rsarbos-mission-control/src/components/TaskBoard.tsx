import React from 'react'
import { FounderTask } from '../data/founder-tasks'

export default function TaskBoard({ tasks, onToggle }: { tasks: FounderTask[]; onToggle: (id: string) => void }) {
  return (
    <div className="task-board">
      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t.id} className="task-row">
            <label>
              <input type="checkbox" checked={t.status==='done'} onChange={()=>onToggle(t.id)} />
              <span className={t.status==='done' ? 'task-title task-title-done' : 'task-title'}>{t.title}</span>
              <span className="task-owner">{t.owner}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
