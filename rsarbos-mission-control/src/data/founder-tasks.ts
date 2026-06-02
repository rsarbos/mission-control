export interface FounderTask {
  id: string;
  title: string;
  tab: string;
  owner: string;
  status: 'open' | 'in-progress' | 'done';
}

export const FOUNDER_TASKS: FounderTask[] = [
  { id: 'f1', title: 'Define canonical state schema', tab: 'core', owner: 'Yael Axel', status: 'open' },
  { id: 'f2', title: 'Confirm onboarding flow', tab: 'operations', owner: 'Yael Axel', status: 'open' },
  { id: 'f3', title: 'Audit copy alignment', tab: 'website', owner: 'Yael Axel', status: 'open' },
];
