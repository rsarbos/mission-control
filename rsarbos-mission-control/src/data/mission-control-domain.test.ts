import test from 'node:test'
import assert from 'node:assert/strict'
import {
  EMPTY_STORE,
  type Approval,
  type DossierBuild,
  type FulfillmentCost,
  type MissionControlStore,
  type Order,
  type Prospect,
  calculateEffectiveHourlyContribution,
  calculateGrossContribution,
  canDeliverBuild,
  createInitialWorkflow,
  signalForCount,
  summarizeMissionControl,
} from './mission-control-domain.ts'

test('Mission Control workflow keeps delivery locked until approval checklist is complete', () => {
  const prospect: Prospect = {
    id: 'prospect-1',
    contactName: 'Houston Dispo Operator',
    buyerSegment: 'Wholesalers',
    role: 'Dispo lead',
    company: 'Example Wholesale',
    email: 'operator@example.com',
    phone: '',
    socialProfile: '',
    market: 'Houston',
    sourceChannel: 'InvestorLift',
    propertyLink: 'https://example.com/listing',
    campaignId: 'campaign-1',
    messageVariantId: 'message-1',
    stage: 'Won',
    firstContactDate: '2026-06-01',
    mostRecentContactDate: '2026-06-03',
    nextFollowUpDate: '',
    responseStatus: 'Paid after sample',
    objection: '',
    quotedPrice: 100,
    packageOffered: 'Manual Underwriting Dossier',
    outcome: 'Converted',
    notes: '',
    linkedOrderId: 'order-1',
  }

  const order: Order = {
    id: 'order-1',
    prospectId: prospect.id,
    client: prospect.contactName,
    propertyLink: prospect.propertyLink,
    propertyAddress: '123 Test St, Houston, TX',
    contactInfo: prospect.email,
    buyerMandate: 'Wholesale buyer confidence packet',
    selectedPackage: 'Manual Underwriting Dossier',
    quotedPrice: 100,
    paymentStatus: 'Paid',
    paymentReference: 'cs_test_confirmed',
    intakeTimestamp: '2026-06-03',
    promisedTurnaroundHours: 24,
    requestedDeliveryDate: '2026-06-04',
    actualDeliveryDate: '2026-06-04',
    priority: 'Standard',
    assignedOperator: 'Founder',
    specialInstructions: '',
    linkedSourceFiles: '',
    linkedDossierBuildId: 'build-1',
    campaignId: 'campaign-1',
    workflow: createInitialWorkflow('Founder'),
  }

  const build: DossierBuild = {
    id: 'build-1',
    orderId: order.id,
    propertyAddress: order.propertyAddress,
    version: 'v1',
    createdAt: '2026-06-03',
    creator: 'Founder',
    status: 'In Review',
    inputSnapshotRef: 'snapshot-input-1',
    evidenceSnapshotRef: 'snapshot-evidence-1',
    calculationVersion: 'Manual phase; Core calculation version not attached',
    renderedArtifactRef: 'private-report-link',
    approvalId: 'approval-1',
    supersededBy: '',
    deliveryStatus: 'Not Delivered',
  }

  const incompleteApproval: Approval = {
    id: 'approval-1',
    orderId: order.id,
    buildId: build.id,
    propertyIdentityReviewed: true,
    materialSourcesAttached: true,
    materialAssumptionsDisclosed: true,
    calculationsReviewed: true,
    missingEvidenceDisclosed: true,
    contradictionsResolvedOrSurfaced: true,
    clientCopyReviewed: true,
    paymentConfirmedOrException: true,
    correctBuildSelected: true,
    deliveryRecipientConfirmed: false,
    exceptionNote: '',
    approvedBy: 'Founder',
    approvedAt: '2026-06-04',
  }

  const store: MissionControlStore = {
    ...EMPTY_STORE,
    prospects: [prospect],
    orders: [order],
    dossierBuilds: [build],
    approvals: [incompleteApproval],
  }

  assert.equal(canDeliverBuild(store, build.id), false)

  const completeStore = {
    ...store,
    approvals: [{ ...incompleteApproval, deliveryRecipientConfirmed: true }],
  }

  assert.equal(canDeliverBuild(completeStore, build.id), true)
})

test('Mission Control summaries do not invent revenue and label low sample sizes honestly', () => {
  assert.deepEqual(summarizeMissionControl(EMPTY_STORE), {
    totalProspects: 0,
    contactedProspects: 0,
    replies: 0,
    qualifiedOpportunities: 0,
    paymentPending: 0,
    paidOrders: 0,
    dossiersInFulfillment: 0,
    deliveredDossiers: 0,
    repeatCustomers: 0,
    revenueCollected: 0,
    outstandingRevenue: 0,
    averageSalesCycleDays: null,
    averageTurnaroundDays: null,
    averageFulfillmentCost: null,
    averageGrossContribution: null,
  })
  assert.equal(signalForCount(0), 'No Evidence Yet')
  assert.equal(signalForCount(1), 'Early Signal')
})

test('fulfillment economics distinguish direct costs from gross and hourly contribution', () => {
  const cost: FulfillmentCost = {
    id: 'cost-1',
    orderId: 'order-1',
    salePrice: 100,
    paymentProcessingFee: 3,
    dataProviderCosts: 12,
    contractorOrAnalystCost: 25,
    laborHours: 1.5,
    revisionHours: 0.5,
    deliveryHours: 0,
    otherDirectCosts: '',
    estimateOrActual: 'Actual',
  }

  assert.equal(calculateGrossContribution(cost), 60)
  assert.equal(calculateEffectiveHourlyContribution(cost), 30)
})
