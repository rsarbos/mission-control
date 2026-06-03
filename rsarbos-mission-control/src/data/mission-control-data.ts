export interface TabState {
  id: string;
  title: string;
  currentState: string;
  nextRecommendedTask: string;
  founderTasks: Array<{ id: string; title: string; owner?: string; status: string }>;
  activeFiles: string[];
  metrics?: Record<string, any>;
}

export const TABS: TabState[] = [
  {
    id: 'core',
    title: 'CORE',
    currentState: 'Architecture draft',
    nextRecommendedTask:
      'Create canonical Mission Control state schema and bind each tab to STATE.md, TASKS.md, CONSTITUTION.md',
    founderTasks: [
      { id: 'c1', title: 'Define state schema', owner: 'Yael Axel', status: 'open' },
    ],
    activeFiles: ['ops/core/CONSTITUTION.md', 'ops/core/STATE.md'],
    metrics: { launchReadiness: 30 },
  },
  {
    id: 'operations',
    title: 'OPERATIONS',
    currentState: 'Manual underwriting flows live',
    nextRecommendedTask:
      'Verify website form routes to uw.requests@rsarbos.com and creates a request card',
    founderTasks: [
      { id: 'o1', title: 'Confirm form routing', owner: 'Yael Axel', status: 'open' },
    ],
    activeFiles: ['ops/operations/CONSTITUTION.md', 'ops/operations/STATE.md'],
    metrics: { avgTurnaroundHours: 48 },
  },
  {
    id: 'website',
    title: 'WEBSITE',
    currentState: 'Ready for staging verification',
    nextRecommendedTask:
      'Submit a staging intake request, verify inbox routing, confirm support ownership, and dry-run payment confirmation copy',
    founderTasks: [
      { id: 'w1', title: 'Submit staging intake request', owner: 'Yael Axel', status: 'open' },
      { id: 'w2', title: 'Confirm support email ownership', owner: 'Yael Axel', status: 'open' },
      { id: 'w3', title: 'Dry-run payment confirmation copy', owner: 'Yael Axel', status: 'open' },
    ],
    activeFiles: ['ops/website/CONSTITUTION.md', 'ops/website/STATE.md'],
    metrics: {
      visitorsToday: 42,
      launchReadiness: 78,
      intakeRoute: 'uw.requests@rsarbos.com',
      supportRoute: 'support@rsarbos.com',
      confirmation: 'Manual settlement ledger',
    },
  },
  {
    id: 'revenue',
    title: 'REVENUE',
    currentState: 'Manual reports monetized',
    nextRecommendedTask:
      'Create first revenue tracker for UW reports priced at $100 per report',
    founderTasks: [
      { id: 'r1', title: 'Create revenue tracker', owner: 'Yael Axel', status: 'open' },
    ],
    activeFiles: ['ops/revenue/CONSTITUTION.md', 'ops/revenue/STATE.md'],
    metrics: { revenueThisMonth: 0 },
  },
  {
    id: 'axiom',
    title: 'AXIOM',
    currentState: 'Orchestration configured',
    nextRecommendedTask:
      'Deploy public website, verify intake flow, publish outreach, capture first paid request',
    founderTasks: [
      { id: 'a1', title: 'Coordinate rollout', owner: 'Yael Axel', status: 'open' },
    ],
    activeFiles: ['axiom/AXIOM_CONSTITUTION.md', 'ops/axiom/CONSTITUTION.md'],
    metrics: { highestLeverageTask: 'Website launch' },
  },
  {
    id: 'dataroom',
    title: 'DATA ROOM',
    currentState: 'Skeleton created',
    nextRecommendedTask: 'Populate with investor-ready documents and metrics',
    founderTasks: [],
    activeFiles: [],
    metrics: {},
  },
];
