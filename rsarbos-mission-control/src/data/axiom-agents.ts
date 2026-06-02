export interface AxiomAgent {
  id: string;
  name: string;
  purpose: string;
  constitution: string[];
}

export const AXIOM_AGENTS: AxiomAgent[] = [
  {
    id: 'axiom-core',
    name: 'AXIOM-CORE',
    purpose:
      'Owns architecture, infrastructure, replayability, deterministic logic, parser mesh, consensus engine, and DPIS.',
    constitution: ['Infrastructure First', 'Governance First', 'Replay First', 'Truth First', 'AI Last'],
  },
  {
    id: 'axiom-ops',
    name: 'AXIOM-OPS',
    purpose:
      'Owns manual underwriting operations, requests, payments, report production, QA, client delivery, and fulfillment workflow.',
    constitution: [
      'Every report deliverable',
      'Every decision traceable',
      'Every valuation explainable',
      'Every client request fulfilled with dignity and precision',
    ],
  },
  {
    id: 'axiom-web',
    name: 'AXIOM-WEB',
    purpose:
      'Owns website performance, forms, traffic, lead capture, conversion, support routing, and public-facing trust.',
    constitution: ['Every visitor measured', 'Every lead captured', 'Every bottleneck exposed', 'Every message aligned with RSARBOS truth'],
  },
  {
    id: 'axiom-biz',
    name: 'AXIOM-BIZ',
    purpose:
      'Owns revenue, sales, monetization, outreach, partnerships, pricing, investor narrative, and growth.',
    constitution: ['Revenue funds autonomy', 'Autonomy funds development', 'Development funds leverage', 'Leverage funds the mission'],
  },
  {
    id: 'axiom-global',
    name: 'AXIOM-GLOBAL',
    purpose: 'Cross-domain coordination and founder operating clarity.',
    constitution: ['Identify the bottleneck', 'Protect founder focus', 'Convert ambiguity into tasks', 'Convert tasks into operational progress'],
  },
];
