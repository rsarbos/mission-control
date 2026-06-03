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
  { id: 'f3', title: 'Submit staging intake request', tab: 'website', owner: 'Yael Axel', status: 'open' },
  { id: 'f4', title: 'Confirm support email ownership', tab: 'website', owner: 'Yael Axel', status: 'open' },
  { id: 'f5', title: 'Dry-run payment confirmation copy', tab: 'website', owner: 'Yael Axel', status: 'open' },
];
