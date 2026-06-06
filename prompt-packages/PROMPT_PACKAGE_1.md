# PROMPT PACKAGE #1 — RSARBOS Mission Control v2

Objective
Create a polished static dashboard scaffold and a clear agent prompt package for Codex/agents to build RSARBOS Mission Control v2. Produce repo-ready artifacts, typed local state, design tokens, and a runnable-local starter path (static/Vite) for future extension.

Repo name
`rsarbos-mission-control`

Commit
`feat: initialize RSARBOS Mission Control v2`

High-level requirements
- Private internal dashboard for founder operations (not a public marketing site).
- Five primary tabs: CORE, OPERATIONS, WEBSITE, REVENUE, AXIOM.
- Each tab displays: Current State, Next Recommended Task, Founder Tasks, Axiom Constitution, Axiom Agent Version, Active Files/Documents, Operational Metrics.
- AXIOM agent variants for each domain: AXIOM-CORE, AXIOM-OPS, AXIOM-WEB, AXIOM-BIZ, AXIOM-GLOBAL.
- Global header, model dropdown (adapter-ready), and founder command bar that accepts mock commands.
- Visual system: futuristic minimal luxury (design tokens provided).
- Local typed data files centralize state: `mission-control-data.ts`, `axiom-agents.ts`, `founder-tasks.ts`, `system-state.ts`.

Design tokens (use in CSS variables)
```
--rsarbos-bg: #F7F8FA;
--rsarbos-surface: #FFFFFF;
--rsarbos-navy: #07111F;
--rsarbos-blue: #2F80ED;
--rsarbos-red: #FF4D4D;
--rsarbos-silver: #D9DEE7;
--rsarbos-muted: #6B7280;
--rsarbos-border: #E5E7EB;
```

Global header
- RSARBOS logo (uploaded) + title “Mission Control”.
- System status pill.
- Model/Agent dropdown with placeholder adapters: Codex, GPT-5, Claude, Qwen, DeepSeek, Nemotron, Ollama Local, Manual Mode.
- Founder command bar (single-line prompt) that handles select mock commands.

Supported mock commands (founder command bar)
- `review tasks` — return next recommended task for each tab.
- `next task` — return next recommended task for the current tab.
- `founder tasks` — show founder-priority tasks across tabs.
- `run audit` — produce a short audit summary of state completeness.
- `summarize state` — return a compact system-state summary.
- `switch agent <AGENT>` — update model dropdown selection.
- `create file <path>` — mock-create a file entry in Active Files.
- `update state <TAB> <KEY>=<VALUE>` — mock-update centralized state.

Initial next recommended tasks (seed data)
- CORE: Create canonical Mission Control state schema and bind each tab to its own `STATE.md`, `TASKS.md`, and `CONSTITUTION.md`.
- OPERATIONS: Verify website form routes requests to `uw.requests@rsarbos.com` and creates a visible request card in Mission Control.
- WEBSITE: Confirm website intake form, support email, and payment confirmation copy align with manual underwriting workflow.
- REVENUE: Create first revenue tracker for manual UW reports priced at $100 per report, with payment and delivery status.
- AXIOM: Deploy public website, verify intake flow, publish outreach, capture first paid manual underwriting request.

File structure to create (scaffold)
```
/rsarbos-mission-control
  /src
    /app
    /components
      /layout
      /tabs
      /cards
      /axiom
      /charts
    /data
      mission-control-data.ts
      axiom-agents.ts
      founder-tasks.ts
      system-state.ts
    /lib
      axiom-router.ts
      model-adapter.ts
      task-engine.ts
    /styles
      globals.css
    index.html
    main.ts
  /ops
    /core
      CONSTITUTION.md
      STATE.md
      TASKS.md
    /operations
      CONSTITUTION.md
      STATE.md
      TASKS.md
    /website
      CONSTITUTION.md
      STATE.md
      TASKS.md
    /revenue
      CONSTITUTION.md
      STATE.md
      TASKS.md
    /axiom
      CONSTITUTION.md
      STATE.md
      TASKS.md
  README.md
  package.json (optional starter)
```

Coding and behavior constraints
- Build a polished static dashboard with local state only. No backend required.
- Use typed data files for central state. UI reads state from these files (module imports / mock adapters).
- The model dropdown and command bar should be adapter-ready (UI-only placeholders). No API keys or live wiring.
- Task cards are editable-ready (inline editing UX, persisting only to in-memory state).
- Tabs switch smoothly and reflect their own next recommended task.

Design and visuals
- Prioritize whitespace, clean typography, rounded premium cards, subtle shadows, and smooth transitions.
- Use the provided logo as visual anchor and to derive the accent colors.

Deliverables for Prompt Package #1
1. A Markdown prompt package (this file) capturing all requirements and acceptance criteria.
2. Typed local state files with seed data: `mission-control-data.ts`, `axiom-agents.ts`, `founder-tasks.ts`, `system-state.ts`.
3. Minimal static UI skeleton: `index.html`, `main.ts` (or `main.js`), `globals.css`, and lightweight components to render tabs, header, command bar, and task cards.
4. `README.md` with run instructions and the commit name.

Run instructions (recommended starter using Vite)
```
npm init vite@latest rsarbos-mission-control -- --template vanilla-ts
cd rsarbos-mission-control
npm install
npm run dev
```
Note: a full Vite scaffold is optional; the static skeleton will run with a simple local static server if desired.

Acceptance criteria (Definition of Done)
- The repo contains the scaffolded files and typed state.
- The dashboard runs locally (static or via Vite) and renders five tabs.
- Each tab shows current state and next recommended task from typed data.
- Founder tasks are visible and editable in-memory.
- The AXIOM command bar accepts mock commands and returns mock responses.
- The model dropdown exists and can be toggled in the UI.
- Visual style follows the luxury minimal direction and uses provided design tokens.

Instructions for Codex / Agent
- Use the typed state files as the single source of truth for initial rendering.
- Implement the header, model dropdown, and command bar with placeholder adapters.
- Keep interactions client-side; persist edits only to in-memory JS/TS state.
- Focus on strong visual polish and clear tab architecture.
- Create `STATE.md`, `TASKS.md`, and `CONSTITUTION.md` stubs for each ops domain (use AXIOM_CONSTITUTION.md as parent).
- Commit changes with the specified commit name.
