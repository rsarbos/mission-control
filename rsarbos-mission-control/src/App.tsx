import React, { useEffect, useState } from 'react'
import { TABS } from './data/mission-control-data'
import { FOUNDER_TASKS, FounderTask } from './data/founder-tasks'
import { AXIOM_AGENTS } from './data/axiom-agents'
import { SYSTEM_STATE } from './data/system-state'
import { DEPARTMENTS } from './data/departments'

import Header from './components/Header'
import Tabs from './components/Tabs'
import TaskBoard from './components/TaskBoard'
import CommandPane from './components/CommandPane'
import SystemRuntime from './components/SystemRuntime'
import DepartmentGrid from './components/DepartmentGrid'
import OperationsSnapshot from './components/OperationsSnapshot'
import OrgMap from './components/OrgMap'

export default function App() {
  const [activeTab, setActiveTab] = useState<string>(() => localStorage.getItem('mc_activeTab') || TABS[0].id)
  const [model, setModel] = useState<string>(() => localStorage.getItem('mc_model') || SYSTEM_STATE.modelAdapter || 'Codex')
  const [selectedAgent, setSelectedAgent] = useState<string>(() => localStorage.getItem('mc_axiom_agent') || 'AXIOM-GLOBAL')
  const [tasks, setTasks] = useState<FounderTask[]>(() => {
    try {
      const raw = localStorage.getItem('mc_founder_tasks')
      return raw ? JSON.parse(raw) : FOUNDER_TASKS
    } catch {
      return FOUNDER_TASKS
    }
  })
  const [commandHistory, setCommandHistory] = useState<Array<{ cmd: string; response: string; timestamp: number }>>(() => {
    try {
      const raw = localStorage.getItem('mc_command_history')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('mc_activeTab', activeTab)
  }, [activeTab])

  useEffect(() => {
    localStorage.setItem('mc_model', model)
  }, [model])

  useEffect(() => {
    localStorage.setItem('mc_axiom_agent', selectedAgent)
  }, [selectedAgent])

  useEffect(() => {
    localStorage.setItem('mc_founder_tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('mc_command_history', JSON.stringify(commandHistory))
  }, [commandHistory])

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: t.status === 'done' ? 'open' : 'done' } : t)))
  }

  function handleCommand(raw: string) {
    const command = raw.trim()
    const lc = command.toLowerCase()
    let response = ''

    if (lc === 'review tasks') {
      response = TABS.map((t) => `${t.title}: ${t.nextRecommendedTask}`).join('\n')
    } else if (lc === 'next task') {
      const tab = TABS.find((t) => t.id === activeTab)
      response = tab ? `${tab.title}: ${tab.nextRecommendedTask}` : 'No active tab selected.'
    } else if (lc === 'founder tasks') {
      const tabTasks = tasks.filter((t) => t.tab === activeTab)
      response = tabTasks.length > 0 ? tabTasks.map((t) => `- ${t.title} (${t.status})`).join('\n') : 'No founder tasks found for this tab.'
    } else if (lc === 'run audit') {
      const completedCount = tasks.filter((t) => t.status === 'done').length
      response = `Audit: ${completedCount}/${tasks.length} tasks complete. Command history contains ${commandHistory.length} entries.`
    } else if (lc === 'summarize state') {
      const tab = TABS.find((t) => t.id === activeTab)
      response = tab
        ? `${tab.title} — ${tab.currentState}. Next: ${tab.nextRecommendedTask}`
        : 'No active tab state available.'
    } else if (lc.startsWith('switch agent')) {
      const agent = command.split(' ').slice(2).join(' ')
      if (agent.toUpperCase().startsWith('AXIOM-')) {
        setSelectedAgent(agent.toUpperCase())
        response = `AXIOM agent set to ${agent.toUpperCase()}`
      } else {
        setModel(agent)
        response = `Model set to ${agent}`
      }
    } else if (lc.startsWith('create file')) {
      const path = command.split(' ').slice(2).join(' ')
      response = `Mock file created: ${path || '(no path provided)'}`
    } else if (lc.startsWith('update state')) {
      response = 'Mock state update recorded.'
    } else {
      response = `Unknown command: ${command}. Use review tasks, next task, founder tasks, run audit, summarize state, switch agent <name>, create file <path>, update state <key>=<value>.`
    }

    setCommandHistory((prev) => [...prev, { cmd: command, response, timestamp: Date.now() }])
    return response
  }

  const operationsDepartments = DEPARTMENTS.filter((dept) => ['operations', 'finance', 'support', 'legal'].includes(dept.id))
  const currentTab = TABS.find((t) => t.id === activeTab)

  return (
    <div className="mc-shell">
      <Header
        model={model}
        selectedAgent={selectedAgent}
        onModelChange={setModel}
        onCommand={handleCommand}
        system={SYSTEM_STATE}
      />
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      <main className="mc-main">
        <div className="main-column">
          <section className="card overview-card">
            <div className="overview-header">
              <div>
                <p className="eyebrow">Mission overview</p>
                <h2>{currentTab?.title}</h2>
                <p className="section-subtitle">{currentTab?.currentState}</p>
              </div>
              <div className="overview-pill">{currentTab?.title} status</div>
            </div>
            <div className="overview-grid">
              <div className="status-panel">
                <p className="small-label">What is the mission?</p>
                <strong>{SYSTEM_STATE.mission}</strong>
              </div>
              <div className="status-panel">
                <p className="small-label">What is the bottleneck?</p>
                <strong>{SYSTEM_STATE.constraint}</strong>
              </div>
              <div className="status-panel">
                <p className="small-label">What should happen next?</p>
                <strong>{currentTab?.nextRecommendedTask}</strong>
              </div>
            </div>
          </section>

          <div className="card section-card">
            <h3>Founder's task board</h3>
            <TaskBoard tasks={tasks.filter((t) => t.tab === activeTab)} onToggle={toggleTask} />
          </div>

          {activeTab === 'operations' && <OperationsSnapshot departments={operationsDepartments} />}

          {activeTab === 'axiom' && (
            <>
              <OrgMap />
              <DepartmentGrid departments={DEPARTMENTS} />
            </>
          )}
        </div>
        <aside className="side-column">
          <div className="card axiom-agent-card">
            <p className="eyebrow">Active AXIOM Agent</p>
            <h3>{selectedAgent}</h3>
            <p className="muted">Command layer for mission orchestration and departmental coordination.</p>
          </div>
          <CommandPane
            model={model}
            selectedAgent={selectedAgent}
            activeTab={activeTab}
            tasks={tasks}
            onModelChange={setModel}
            onSelectedAgentChange={setSelectedAgent}
            onCommand={handleCommand}
            history={commandHistory}
          />
          <SystemRuntime />
        </aside>
      </main>
    </div>
  )
}
