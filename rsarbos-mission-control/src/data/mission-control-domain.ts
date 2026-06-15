export const BUYER_SEGMENTS = [
  'Real Estate Agents',
  'Wholesalers',
  'First-Time Investors',
  'BRRRR Investors',
  'Fix-and-Flip Operators',
  'Buy-and-Hold Investors',
  'Lenders',
  'Acquisition Teams',
  'Developers',
  'Other',
] as const

export const CHANNELS = ['Warm Network', 'Email', 'Phone', 'LinkedIn', 'Facebook Group', 'BiggerPockets', 'InvestorLift', 'Referral', 'Website', 'Other'] as const

export const PIPELINE_STAGES = [
  'Identified',
  'Ready to Contact',
  'Contacted',
  'Follow-Up Due',
  'Replied',
  'Qualified',
  'Proposal or Sample Sent',
  'Payment Pending',
  'Won',
  'Lost',
  'Nurture',
] as const

export const PAYMENT_STATES = ['Not Requested', 'Checkout Created', 'Pending Payment', 'Paid', 'Failed', 'Refunded', 'Comped'] as const

export const WORKFLOW_STAGES = [
  'Intake Received',
  'Payment Pending',
  'Paid / Ready for Research',
  'Evidence Collection',
  'Evidence Review',
  'Analysis in Progress',
  'Draft Build',
  'Internal Review',
  'Approved',
  'Delivered',
  'Revision Requested',
  'Closed',
] as const

export const EVIDENCE_STATUSES = ['Unreviewed', 'Verified', 'Partially Verified', 'Conflicting', 'Insufficient', 'Not Applicable', 'Superseded'] as const

export const DOSSIER_SECTIONS = [
  'Executive Verdict',
  'Property Profile',
  'Sale Comparables',
  'Current Value',
  'ARV',
  'Rental Thesis',
  'Cash Flow',
  'Rehab Scope',
  'HOA Analysis',
  'HBU / Zoning',
  'Risk Register',
  'Offer Range / MAO',
  'Financing Scenarios',
  'Neighborhood Intelligence',
  'Evidence Appendix',
  'Action Checklist',
  'Other',
] as const

export type BuyerSegment = typeof BUYER_SEGMENTS[number]
export type Channel = typeof CHANNELS[number]
export type PipelineStage = typeof PIPELINE_STAGES[number]
export type PaymentState = typeof PAYMENT_STATES[number]
export type WorkflowStageName = typeof WORKFLOW_STAGES[number]
export type EvidenceStatus = typeof EVIDENCE_STATUSES[number]
export type DossierSection = typeof DOSSIER_SECTIONS[number]
export type SignalStrength = 'No Evidence Yet' | 'Early Signal' | 'Emerging Pattern' | 'Repeated Pattern' | 'Commercially Supported'

export type Prospect = {
  id: string
  contactName: string
  buyerSegment: BuyerSegment
  role: string
  company: string
  email: string
  phone: string
  socialProfile: string
  market: string
  sourceChannel: Channel
  propertyLink: string
  campaignId: string
  messageVariantId: string
  stage: PipelineStage
  firstContactDate: string
  mostRecentContactDate: string
  nextFollowUpDate: string
  responseStatus: string
  objection: string
  quotedPrice: number | ''
  packageOffered: string
  outcome: string
  notes: string
  linkedOrderId: string
}

export type Campaign = {
  id: string
  name: string
  targetSegment: BuyerSegment
  channel: Channel
  offer: string
  packageName: string
  price: number | ''
  messageBody: string
  launchedAt: string
  qualitativeFeedback: string
}

export type MessageVariant = {
  id: string
  campaignId: string
  name: string
  body: string
  offer: string
  packageName: string
  price: number | ''
}

export type OutreachActivity = {
  id: string
  prospectId: string
  date: string
  channel: Channel
  messageVariantId: string
  outcome: 'Sent' | 'Reply' | 'Qualified Interest' | 'Payment Requested' | 'Payment Received' | 'No Response'
  notes: string
}

export type Order = {
  id: string
  prospectId: string
  client: string
  propertyLink: string
  propertyAddress: string
  contactInfo: string
  buyerMandate: string
  selectedPackage: string
  quotedPrice: number | ''
  paymentStatus: PaymentState
  paymentReference: string
  intakeTimestamp: string
  promisedTurnaroundHours: number | ''
  requestedDeliveryDate: string
  actualDeliveryDate: string
  priority: 'Standard' | 'High' | 'Urgent'
  assignedOperator: string
  specialInstructions: string
  linkedSourceFiles: string
  linkedDossierBuildId: string
  campaignId: string
  workflow: WorkflowStageRecord[]
}

export type WorkflowStageRecord = {
  stage: WorkflowStageName
  owner: string
  enteredAt: string
  completedAt: string
  blockers: string
  notes: string
  nextAction: string
  linkedEvidenceIds: string[]
  linkedBuildIds: string[]
}

export type EvidenceItem = {
  id: string
  orderId: string
  sourceName: string
  sourceType: string
  sourceUrl: string
  retrievedAt: string
  effectiveDate: string
  associatedFields: string
  dossierModules: DossierSection[]
  verificationStatus: EvidenceStatus
  confidenceGrade: 'A' | 'B' | 'C' | 'D' | 'Unknown'
  conflicts: string
  analystNotes: string
  missingRequirements: string
}

export type DossierBuild = {
  id: string
  orderId: string
  propertyAddress: string
  version: string
  createdAt: string
  creator: string
  status: 'Draft' | 'In Review' | 'Approved' | 'Delivered' | 'Superseded'
  inputSnapshotRef: string
  evidenceSnapshotRef: string
  calculationVersion: string
  renderedArtifactRef: string
  approvalId: string
  supersededBy: string
  deliveryStatus: 'Not Delivered' | 'Delivered' | 'Revision Requested' | 'Closed'
}

export type Approval = {
  id: string
  orderId: string
  buildId: string
  propertyIdentityReviewed: boolean
  materialSourcesAttached: boolean
  materialAssumptionsDisclosed: boolean
  calculationsReviewed: boolean
  missingEvidenceDisclosed: boolean
  contradictionsResolvedOrSurfaced: boolean
  clientCopyReviewed: boolean
  paymentConfirmedOrException: boolean
  correctBuildSelected: boolean
  deliveryRecipientConfirmed: boolean
  exceptionNote: string
  approvedBy: string
  approvedAt: string
}

export type Delivery = {
  id: string
  orderId: string
  buildId: string
  recipient: string
  deliveryEmail: string
  reportLinkOrFile: string
  deliveryDate: string
  deliveredBy: string
  clientConfirmation: string
  requestedRevisions: string
  revisionStatus: string
  finalClosure: string
}

export type FulfillmentCost = {
  id: string
  orderId: string
  salePrice: number | ''
  paymentProcessingFee: number | ''
  dataProviderCosts: number | ''
  contractorOrAnalystCost: number | ''
  laborHours: number | ''
  revisionHours: number | ''
  deliveryHours: number | ''
  otherDirectCosts: number | ''
  estimateOrActual: 'Estimate' | 'Actual'
}

export type ClientFeedback = {
  id: string
  orderId: string
  whyBought: string
  mostValuableSections: DossierSection[]
  leastValuableSections: DossierSection[]
  influencedPurchaseSections: DossierSection[]
  influencedAcquisitionSections: DossierSection[]
  actedOnProperty: 'Unknown' | 'Yes' | 'No'
  changedStrategy: 'Unknown' | 'Yes' | 'No'
  requestedMissingInfo: string
  satisfaction: '' | 'Low' | 'Medium' | 'High'
  likelyToPurchaseAgain: '' | 'No' | 'Maybe' | 'Yes'
  nextLikelyPurchaseDate: string
  referralPotential: '' | 'Low' | 'Medium' | 'High'
  testimonialPermission: boolean
  repeatOrderId: string
}

export type MissionControlStore = {
  prospects: Prospect[]
  campaigns: Campaign[]
  messageVariants: MessageVariant[]
  outreachActivities: OutreachActivity[]
  orders: Order[]
  evidenceItems: EvidenceItem[]
  dossierBuilds: DossierBuild[]
  approvals: Approval[]
  deliveries: Delivery[]
  fulfillmentCosts: FulfillmentCost[]
  clientFeedback: ClientFeedback[]
}

export const EMPTY_STORE: MissionControlStore = {
  prospects: [],
  campaigns: [],
  messageVariants: [],
  outreachActivities: [],
  orders: [],
  evidenceItems: [],
  dossierBuilds: [],
  approvals: [],
  deliveries: [],
  fulfillmentCosts: [],
  clientFeedback: [],
}

export function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function createInitialWorkflow(owner = ''): WorkflowStageRecord[] {
  return WORKFLOW_STAGES.map((stage, index) => ({
    stage,
    owner,
    enteredAt: index === 0 ? today() : '',
    completedAt: '',
    blockers: '',
    notes: '',
    nextAction: index === 0 ? 'Confirm intake details and payment status.' : '',
    linkedEvidenceIds: [],
    linkedBuildIds: [],
  }))
}

export function isApprovalComplete(approval: Approval) {
  return [
    approval.propertyIdentityReviewed,
    approval.materialSourcesAttached,
    approval.materialAssumptionsDisclosed,
    approval.calculationsReviewed,
    approval.missingEvidenceDisclosed,
    approval.contradictionsResolvedOrSurfaced,
    approval.clientCopyReviewed,
    approval.paymentConfirmedOrException,
    approval.correctBuildSelected,
    approval.deliveryRecipientConfirmed,
  ].every(Boolean)
}

export function canDeliverBuild(store: MissionControlStore, buildId: string) {
  const approval = store.approvals.find((item) => item.buildId === buildId)
  return Boolean(approval && isApprovalComplete(approval))
}

export function sumMoney(values: Array<number | '' | undefined>): number {
  return values.reduce<number>((total, value) => total + (typeof value === 'number' && Number.isFinite(value) ? value : 0), 0)
}

export function daysBetween(start: string, end: string) {
  if (!start || !end) return null
  const startTime = new Date(start).getTime()
  const endTime = new Date(end).getTime()
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) return null
  return Math.max(0, Math.round((endTime - startTime) / 86400000))
}

export function signalForCount(count: number): SignalStrength {
  if (count <= 0) return 'No Evidence Yet'
  if (count <= 2) return 'Early Signal'
  if (count <= 5) return 'Emerging Pattern'
  if (count <= 10) return 'Repeated Pattern'
  return 'Commercially Supported'
}

export function calculateGrossContribution(cost: FulfillmentCost) {
  const directCosts = sumMoney([
    cost.paymentProcessingFee,
    cost.dataProviderCosts,
    cost.contractorOrAnalystCost,
    cost.otherDirectCosts,
  ])
  const salePrice = typeof cost.salePrice === 'number' ? cost.salePrice : 0
  return salePrice - directCosts
}

export function calculateEffectiveHourlyContribution(cost: FulfillmentCost) {
  const hours = sumMoney([cost.laborHours, cost.revisionHours, cost.deliveryHours])
  if (!hours) return null
  return calculateGrossContribution(cost) / hours
}

export function summarizeMissionControl(store: MissionControlStore) {
  const paidOrders = store.orders.filter((order) => order.paymentStatus === 'Paid')
  const deliveredOrders = store.orders.filter((order) => Boolean(order.actualDeliveryDate))
  const salesCycles = store.prospects
    .filter((prospect) => prospect.firstContactDate && prospect.stage === 'Won')
    .map((prospect) => {
      const order = store.orders.find((item) => item.id === prospect.linkedOrderId)
      return daysBetween(prospect.firstContactDate, order?.intakeTimestamp || prospect.mostRecentContactDate)
    })
    .filter((value): value is number => typeof value === 'number')
  const turnaround = deliveredOrders
    .map((order) => daysBetween(order.intakeTimestamp, order.actualDeliveryDate))
    .filter((value): value is number => typeof value === 'number')
  const grossContributions = store.fulfillmentCosts.map(calculateGrossContribution)

  return {
    totalProspects: store.prospects.length,
    contactedProspects: store.prospects.filter((prospect) => prospect.firstContactDate || prospect.stage !== 'Identified').length,
    replies: store.prospects.filter((prospect) => ['Replied', 'Qualified', 'Proposal or Sample Sent', 'Payment Pending', 'Won'].includes(prospect.stage)).length,
    qualifiedOpportunities: store.prospects.filter((prospect) => ['Qualified', 'Proposal or Sample Sent', 'Payment Pending', 'Won'].includes(prospect.stage)).length,
    paymentPending: store.orders.filter((order) => order.paymentStatus === 'Pending Payment' || order.paymentStatus === 'Checkout Created').length,
    paidOrders: paidOrders.length,
    dossiersInFulfillment: store.orders.filter((order) => order.paymentStatus === 'Paid' && !order.actualDeliveryDate).length,
    deliveredDossiers: deliveredOrders.length,
    repeatCustomers: store.clientFeedback.filter((feedback) => Boolean(feedback.repeatOrderId)).length,
    revenueCollected: sumMoney(paidOrders.map((order) => order.quotedPrice)),
    outstandingRevenue: sumMoney(store.orders.filter((order) => order.paymentStatus !== 'Paid').map((order) => order.quotedPrice)),
    averageSalesCycleDays: average(salesCycles),
    averageTurnaroundDays: average(turnaround),
    averageFulfillmentCost: average(store.fulfillmentCosts.map((cost) => sumMoney([
      cost.paymentProcessingFee,
      cost.dataProviderCosts,
      cost.contractorOrAnalystCost,
      cost.otherDirectCosts,
    ]))),
    averageGrossContribution: average(grossContributions),
  }
}

export function groupConversion<T extends string>(items: T[], prospects: Prospect[], orders: Order[], getKey: (prospect: Prospect) => T) {
  return items.map((item) => {
    const segmentProspects = prospects.filter((prospect) => getKey(prospect) === item)
    const wonProspects = segmentProspects.filter((prospect) => prospect.stage === 'Won')
    const paidOrderIds = new Set(orders.filter((order) => order.paymentStatus === 'Paid').map((order) => order.id))
    const purchases = wonProspects.filter((prospect) => prospect.linkedOrderId && paidOrderIds.has(prospect.linkedOrderId)).length
    return {
      key: item,
      contacts: segmentProspects.length,
      replies: segmentProspects.filter((prospect) => ['Replied', 'Qualified', 'Proposal or Sample Sent', 'Payment Pending', 'Won'].includes(prospect.stage)).length,
      qualified: segmentProspects.filter((prospect) => ['Qualified', 'Proposal or Sample Sent', 'Payment Pending', 'Won'].includes(prospect.stage)).length,
      purchases,
      conversionRate: segmentProspects.length ? purchases / segmentProspects.length : 0,
      signal: signalForCount(purchases),
    }
  })
}

function average(values: number[]) {
  if (!values.length) return null
  return values.reduce((total, value) => total + value, 0) / values.length
}
