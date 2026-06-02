export interface DepartmentMetric {
  label: string
  value: string
}

export interface Department {
  id: string
  name: string
  role: string
  purpose: string
  status: 'active' | 'planned' | 'watch' | 'blocked'
  metrics: DepartmentMetric[]
  nextRecommendedTask: string
  owner: string
  axiomAgent: string
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'operations',
    name: 'Operations',
    role: 'Manual Underwriting & Lead Manufacturing',
    purpose:
      'Produce Investor Decision Dossiers and manage sourcing, filtering, underwriting, QA, and marketplace-ready upload.',
    status: 'active',
    metrics: [
      { label: 'Dossiers produced', value: '12' },
      { label: 'Gold Leads', value: '7' },
      { label: 'Avg turnaround', value: '48h' },
      { label: 'QA pass rate', value: '92%' },
    ],
    nextRecommendedTask: 'Generate 5 new underwriting requests to stabilize the pipeline.',
    owner: 'Yael Axel',
    axiomAgent: 'AXIOM-OPS',
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    role: 'Fee Splits & Payout Ledger',
    purpose:
      'Track revenue, fee splits, payouts, MRR, payment status, and transaction ledger logic.',
    status: 'active',
    metrics: [
      { label: 'Revenue collected', value: '$0' },
      { label: 'Pending payouts', value: '0' },
      { label: 'Platform fees', value: '$0' },
      { label: 'MRR progress', value: 'Planning' },
    ],
    nextRecommendedTask: 'Create the payment status ledger for UW report settlements.',
    owner: 'Yael Axel',
    axiomAgent: 'AXIOM-BIZ',
  },
  {
    id: 'sales',
    name: 'Sales & Marketing',
    role: 'Viral Content & B2B2C Growth Loops',
    purpose:
      'Manage outreach, content, referral loops, investor acquisition, agent outreach, and brand authority.',
    status: 'watch',
    metrics: [
      { label: 'Outreach sent', value: '18' },
      { label: 'Replies', value: '4' },
      { label: 'Leads generated', value: '3' },
      { label: 'Conversion rate', value: '17%' },
    ],
    nextRecommendedTask: 'Align investor outreach copy with operational intake and support channels.',
    owner: 'Yael Axel',
    axiomAgent: 'AXIOM-BIZ',
  },
  {
    id: 'hr',
    name: 'Human Resources',
    role: 'Academy Training & Decentralized Analysts',
    purpose:
      'Manage future analyst onboarding, academy training, VA support, and decentralized deal-sourcing workforce.',
    status: 'planned',
    metrics: [
      { label: 'Analysts trained', value: '0' },
      { label: 'Active analysts', value: '0' },
      { label: 'VA capacity', value: '0' },
      { label: 'Training completion', value: '0%' },
    ],
    nextRecommendedTask: 'Define the analyst onboarding syllabus for manual underwriting teams.',
    owner: 'Yael Axel',
    axiomAgent: 'AXIOM-GLOBAL',
  },
  {
    id: 'rnd',
    name: 'Research & Development',
    role: 'Tokenization Bridge & Analysis Engine',
    purpose:
      'Develop analysis logic, tokenization marketplace concepts, HBU strategy, admin dashboard features, and future automation.',
    status: 'active',
    metrics: [
      { label: 'Features shipped', value: '1' },
      { label: 'Modules defined', value: '3' },
      { label: 'Tokenization readiness', value: 'Early' },
      { label: 'Automation progress', value: 'Concept' },
    ],
    nextRecommendedTask: 'Define the first analysis module for dossier scorecards.',
    owner: 'Yael Axel',
    axiomAgent: 'AXIOM-CORE',
  },
  {
    id: 'support',
    name: 'Customer Support',
    role: 'Pipeline Follow-ups & Investor Success',
    purpose:
      'Track communication pipeline, request follow-ups, investor support, and client clarity.',
    status: 'watch',
    metrics: [
      { label: 'Open requests', value: '2' },
      { label: 'Follow-ups pending', value: '5' },
      { label: 'Response time', value: '12h' },
      { label: 'Investor satisfaction', value: 'N/A' },
    ],
    nextRecommendedTask: 'Confirm that support and intake routing are aligned with operational expectations.',
    owner: 'Yael Axel',
    axiomAgent: 'AXIOM-OPS',
  },
  {
    id: 'it',
    name: 'Information Technology',
    role: 'Database Infrastructure & Security',
    purpose:
      'Maintain Mission Control, website stack, database architecture, marketplace security, and data protection.',
    status: 'active',
    metrics: [
      { label: 'Build status', value: 'Stable' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Security tasks', value: '3' },
      { label: 'DB readiness', value: 'Alpha' },
    ],
    nextRecommendedTask: 'Validate the data flow for intake, request cards, and payment status tracking.',
    owner: 'Yael Axel',
    axiomAgent: 'AXIOM-CORE',
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    role: 'Risk Mitigation & Regulatory Standards',
    purpose:
      'Maintain disclaimers, educational-purpose boundaries, KYC readiness, tokenization compliance planning, and liability controls.',
    status: 'planned',
    metrics: [
      { label: 'Checklist progress', value: '24%' },
      { label: 'Legal docs needed', value: '3' },
      { label: 'Risk flags', value: '1' },
      { label: 'KYC readiness', value: 'Planning' },
    ],
    nextRecommendedTask: 'Document the compliance boundaries for manual underwriting and tokenization planning.',
    owner: 'Yael Axel',
    axiomAgent: 'AXIOM-GLOBAL',
  },
]
