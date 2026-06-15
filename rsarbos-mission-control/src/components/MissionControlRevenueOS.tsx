import React, { useMemo, useState } from 'react'
import {
  BUYER_SEGMENTS,
  CHANNELS,
  DOSSIER_SECTIONS,
  EMPTY_STORE,
  EVIDENCE_STATUSES,
  PAYMENT_STATES,
  PIPELINE_STAGES,
  WORKFLOW_STAGES,
  type Approval,
  type BuyerSegment,
  type Campaign,
  type Channel,
  type ClientFeedback,
  type Delivery,
  type DossierBuild,
  type DossierSection,
  type EvidenceItem,
  type FulfillmentCost,
  type MessageVariant,
  type MissionControlStore,
  type Order,
  type PipelineStage,
  type Prospect,
  canDeliverBuild,
  calculateEffectiveHourlyContribution,
  calculateGrossContribution,
  createId,
  createInitialWorkflow,
  groupConversion,
  isApprovalComplete,
  signalForCount,
  summarizeMissionControl,
  today,
} from '../data/mission-control-domain'
import rsarbosLogo from '../assets/logo.png'

const STORE_KEY = 'rsarbos_mission_control_revenue_os_v1'

type RevenueTab = 'command' | 'outreach' | 'orders' | 'evidence' | 'learning' | 'axiom'

const EMPTY_PROSPECT: Prospect = {
  id: '',
  contactName: '',
  buyerSegment: 'Wholesalers',
  role: '',
  company: '',
  email: '',
  phone: '',
  socialProfile: '',
  market: '',
  sourceChannel: 'Warm Network',
  propertyLink: '',
  campaignId: '',
  messageVariantId: '',
  stage: 'Identified',
  firstContactDate: '',
  mostRecentContactDate: '',
  nextFollowUpDate: '',
  responseStatus: '',
  objection: '',
  quotedPrice: '',
  packageOffered: 'Manual Underwriting Dossier',
  outcome: '',
  notes: '',
  linkedOrderId: '',
}

const EMPTY_CAMPAIGN: Campaign = {
  id: '',
  name: '',
  targetSegment: 'Wholesalers',
  channel: 'Warm Network',
  offer: '',
  packageName: 'Manual Underwriting Dossier',
  price: 100,
  messageBody: '',
  launchedAt: today(),
  qualitativeFeedback: '',
}

const EMPTY_MESSAGE: MessageVariant = {
  id: '',
  campaignId: '',
  name: '',
  body: '',
  offer: '',
  packageName: 'Manual Underwriting Dossier',
  price: 100,
}

const EMPTY_ORDER: Order = {
  id: '',
  prospectId: '',
  client: '',
  propertyLink: '',
  propertyAddress: '',
  contactInfo: '',
  buyerMandate: '',
  selectedPackage: 'Manual Underwriting Dossier',
  quotedPrice: 100,
  paymentStatus: 'Not Requested',
  paymentReference: '',
  intakeTimestamp: today(),
  promisedTurnaroundHours: 24,
  requestedDeliveryDate: '',
  actualDeliveryDate: '',
  priority: 'Standard',
  assignedOperator: '',
  specialInstructions: '',
  linkedSourceFiles: '',
  linkedDossierBuildId: '',
  campaignId: '',
  workflow: createInitialWorkflow(),
}

function readStore(): MissionControlStore {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return EMPTY_STORE
    return { ...EMPTY_STORE, ...JSON.parse(raw) }
  } catch {
    return EMPTY_STORE
  }
}

function money(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'No evidence yet'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function numeric(value: number | '' | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function numberField(value: string): number | '' {
  if (value.trim() === '') return ''
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : ''
}

function joinSections(sections: DossierSection[]) {
  return sections.length ? sections.join(', ') : 'No sections recorded'
}

export default function MissionControlRevenueOS() {
  const [store, setStore] = useState<MissionControlStore>(() => readStore())
  const [activeTab, setActiveTab] = useState<RevenueTab>('command')
  const [prospectDraft, setProspectDraft] = useState<Prospect>(EMPTY_PROSPECT)
  const [campaignDraft, setCampaignDraft] = useState<Campaign>(EMPTY_CAMPAIGN)
  const [messageDraft, setMessageDraft] = useState<MessageVariant>(EMPTY_MESSAGE)
  const [orderDraft, setOrderDraft] = useState<Order>(EMPTY_ORDER)
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [filterSegment, setFilterSegment] = useState<BuyerSegment | 'All'>('All')
  const [filterChannel, setFilterChannel] = useState<Channel | 'All'>('All')

  function commit(next: MissionControlStore) {
    setStore(next)
    localStorage.setItem(STORE_KEY, JSON.stringify(next))
  }

  const summary = useMemo(() => summarizeMissionControl(store), [store])
  const filteredProspects = store.prospects.filter((prospect) => {
    return (filterSegment === 'All' || prospect.buyerSegment === filterSegment)
      && (filterChannel === 'All' || prospect.sourceChannel === filterChannel)
  })
  const selectedOrder = store.orders.find((order) => order.id === selectedOrderId) || store.orders[0]
  const segmentSummary = groupConversion([...BUYER_SEGMENTS], store.prospects, store.orders, (prospect) => prospect.buyerSegment)
  const channelSummary = groupConversion([...CHANNELS], store.prospects, store.orders, (prospect) => prospect.sourceChannel)

  function saveProspect(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const id = prospectDraft.id || createId('prospect')
    const nextProspect = { ...prospectDraft, id }
    commit({
      ...store,
      prospects: [...store.prospects.filter((item) => item.id !== id), nextProspect],
    })
    setProspectDraft(EMPTY_PROSPECT)
  }

  function saveCampaign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const id = campaignDraft.id || createId('campaign')
    commit({
      ...store,
      campaigns: [...store.campaigns.filter((item) => item.id !== id), { ...campaignDraft, id }],
    })
    setCampaignDraft(EMPTY_CAMPAIGN)
  }

  function saveMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const id = messageDraft.id || createId('message')
    commit({
      ...store,
      messageVariants: [...store.messageVariants.filter((item) => item.id !== id), { ...messageDraft, id }],
    })
    setMessageDraft(EMPTY_MESSAGE)
  }

  function saveOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const id = orderDraft.id || createId('order')
    const workflow = orderDraft.workflow.length ? orderDraft.workflow : createInitialWorkflow(orderDraft.assignedOperator)
    const nextOrder = { ...orderDraft, id, workflow }
    const nextProspects = store.prospects.map((prospect) => (
      prospect.id === nextOrder.prospectId
        ? { ...prospect, linkedOrderId: id, stage: nextOrder.paymentStatus === 'Paid' ? 'Won' as PipelineStage : 'Payment Pending' as PipelineStage }
        : prospect
    ))
    commit({
      ...store,
      prospects: nextProspects,
      orders: [...store.orders.filter((item) => item.id !== id), nextOrder],
    })
    setSelectedOrderId(id)
    setOrderDraft(EMPTY_ORDER)
  }

  function updateOrder(order: Order) {
    commit({
      ...store,
      orders: store.orders.map((item) => (item.id === order.id ? order : item)),
    })
  }

  function addEvidence() {
    if (!selectedOrder) return
    const evidence: EvidenceItem = {
      id: createId('evidence'),
      orderId: selectedOrder.id,
      sourceName: 'New evidence source',
      sourceType: 'Listing / source file',
      sourceUrl: '',
      retrievedAt: today(),
      effectiveDate: '',
      associatedFields: '',
      dossierModules: ['Evidence Appendix'],
      verificationStatus: 'Unreviewed',
      confidenceGrade: 'Unknown',
      conflicts: '',
      analystNotes: '',
      missingRequirements: '',
    }
    commit({ ...store, evidenceItems: [...store.evidenceItems, evidence] })
  }

  function addBuild() {
    if (!selectedOrder) return
    const build: DossierBuild = {
      id: createId('build'),
      orderId: selectedOrder.id,
      propertyAddress: selectedOrder.propertyAddress,
      version: `v${store.dossierBuilds.filter((item) => item.orderId === selectedOrder.id).length + 1}`,
      createdAt: today(),
      creator: selectedOrder.assignedOperator,
      status: 'Draft',
      inputSnapshotRef: '',
      evidenceSnapshotRef: '',
      calculationVersion: 'Manual phase; Core calculation version not attached',
      renderedArtifactRef: '',
      approvalId: '',
      supersededBy: '',
      deliveryStatus: 'Not Delivered',
    }
    commit({ ...store, dossierBuilds: [...store.dossierBuilds, build] })
  }

  function addApproval(buildId: string) {
    if (!selectedOrder) return
    const approval: Approval = {
      id: createId('approval'),
      orderId: selectedOrder.id,
      buildId,
      propertyIdentityReviewed: false,
      materialSourcesAttached: false,
      materialAssumptionsDisclosed: false,
      calculationsReviewed: false,
      missingEvidenceDisclosed: false,
      contradictionsResolvedOrSurfaced: false,
      clientCopyReviewed: false,
      paymentConfirmedOrException: selectedOrder.paymentStatus === 'Paid',
      correctBuildSelected: false,
      deliveryRecipientConfirmed: false,
      exceptionNote: '',
      approvedBy: '',
      approvedAt: '',
    }
    commit({ ...store, approvals: [...store.approvals.filter((item) => item.buildId !== buildId), approval] })
  }

  function addDelivery(buildId: string) {
    if (!selectedOrder || !canDeliverBuild(store, buildId)) return
    const delivery: Delivery = {
      id: createId('delivery'),
      orderId: selectedOrder.id,
      buildId,
      recipient: selectedOrder.client,
      deliveryEmail: selectedOrder.contactInfo,
      reportLinkOrFile: '',
      deliveryDate: today(),
      deliveredBy: selectedOrder.assignedOperator,
      clientConfirmation: '',
      requestedRevisions: '',
      revisionStatus: 'None requested',
      finalClosure: '',
    }
    commit({
      ...store,
      deliveries: [...store.deliveries, delivery],
      dossierBuilds: store.dossierBuilds.map((build) => build.id === buildId ? { ...build, deliveryStatus: 'Delivered', status: 'Delivered' } : build),
      orders: store.orders.map((order) => order.id === selectedOrder.id ? { ...order, actualDeliveryDate: today() } : order),
    })
  }

  function addCost() {
    if (!selectedOrder) return
    const cost: FulfillmentCost = {
      id: createId('cost'),
      orderId: selectedOrder.id,
      salePrice: selectedOrder.quotedPrice,
      paymentProcessingFee: '',
      dataProviderCosts: '',
      contractorOrAnalystCost: '',
      laborHours: '',
      revisionHours: '',
      deliveryHours: '',
      otherDirectCosts: '',
      estimateOrActual: 'Estimate',
    }
    commit({ ...store, fulfillmentCosts: [...store.fulfillmentCosts, cost] })
  }

  function addFeedback() {
    if (!selectedOrder) return
    const feedback: ClientFeedback = {
      id: createId('feedback'),
      orderId: selectedOrder.id,
      whyBought: '',
      mostValuableSections: [],
      leastValuableSections: [],
      influencedPurchaseSections: [],
      influencedAcquisitionSections: [],
      actedOnProperty: 'Unknown',
      changedStrategy: 'Unknown',
      requestedMissingInfo: '',
      satisfaction: '',
      likelyToPurchaseAgain: '',
      nextLikelyPurchaseDate: '',
      referralPotential: '',
      testimonialPermission: false,
      repeatOrderId: '',
    }
    commit({ ...store, clientFeedback: [...store.clientFeedback, feedback] })
  }

  return (
    <div className="revenue-os-shell">
      <header className="revenue-os-header">
        <a className="mc-admin-logo" href="/"><img src={rsarbosLogo} alt="RSARBOS" /></a>
        <div>
          <p className="mc-admin-kicker">Revenue-First Manual Underwriting Phase</p>
          <h1>Mission Control</h1>
          <p>Founder operating surface for outreach, paid dossier fulfillment, commercial learning, and Core-ready evidence custody.</p>
        </div>
        <div className="truth-state">
          <strong>{summary.paidOrders === 0 ? 'No paid sale recorded' : `${summary.paidOrders} paid order${summary.paidOrders === 1 ? '' : 's'}`}</strong>
          <span>Only confirmed payment can create Paid state.</span>
        </div>
      </header>

      <nav className="revenue-tabs" aria-label="Mission Control operating areas">
        {[
          ['command', 'Revenue Command'],
          ['outreach', 'Outreach'],
          ['orders', 'Orders + Fulfillment'],
          ['evidence', 'Evidence + Release'],
          ['learning', 'Commercial Learning'],
          ['axiom', 'AXIOM Status'],
        ].map(([id, label]) => (
          <button key={id} type="button" className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id as RevenueTab)}>
            {label}
          </button>
        ))}
      </nav>

      {activeTab === 'command' && (
        <main className="revenue-grid">
          <section className="ops-panel span-2">
            <PanelHead kicker="Revenue Command Center" title="What needs attention now" />
            <div className="metric-grid">
              <Metric label="Total prospects" value={summary.totalProspects} />
              <Metric label="Contacted" value={summary.contactedProspects} />
              <Metric label="Replies" value={summary.replies} />
              <Metric label="Qualified" value={summary.qualifiedOpportunities} />
              <Metric label="Payment pending" value={summary.paymentPending} />
              <Metric label="Paid orders" value={summary.paidOrders} />
              <Metric label="In fulfillment" value={summary.dossiersInFulfillment} />
              <Metric label="Delivered" value={summary.deliveredDossiers} />
              <Metric label="Repeat customers" value={summary.repeatCustomers} />
              <Metric label="Revenue collected" value={money(summary.revenueCollected)} />
              <Metric label="Outstanding revenue" value={money(summary.outstandingRevenue)} />
              <Metric label="Avg sales cycle" value={summary.averageSalesCycleDays === null ? 'No evidence yet' : `${summary.averageSalesCycleDays.toFixed(1)} days`} />
              <Metric label="Avg turnaround" value={summary.averageTurnaroundDays === null ? 'No evidence yet' : `${summary.averageTurnaroundDays.toFixed(1)} days`} />
              <Metric label="Avg fulfillment cost" value={money(summary.averageFulfillmentCost)} />
              <Metric label="Gross contribution" value={money(summary.averageGrossContribution)} />
            </div>
            {summary.paidOrders === 0 && (
              <div className="honest-empty">
                No paid sale is recorded in Mission Control yet. Start by adding prospects, logging outreach, creating an intake, and moving payment from Pending Payment to Paid only after confirmation.
              </div>
            )}
          </section>
          <section className="ops-panel">
            <PanelHead kicker="Daily workflow" title="Founder queue" />
            <ActionList
              items={[
                [`${store.prospects.filter((p) => p.stage === 'Ready to Contact' || p.stage === 'Identified').length} prospects to contact`, 'Add or work the outreach list.'],
                [`${store.prospects.filter((p) => p.stage === 'Follow-Up Due').length} follow-ups due`, 'Record the next interaction and objection.'],
                [`${store.prospects.filter((p) => p.stage === 'Replied').length} replies to qualify`, 'Separate curiosity from qualified buying intent.'],
                [`${store.prospects.filter((p) => p.stage === 'Payment Pending').length} waiting on payment`, 'Recover checkout manually; do not delete pending payment records.'],
                [`${store.orders.filter((o) => o.paymentStatus === 'Paid' && !o.actualDeliveryDate).length} paid dossier builds active`, 'Move fulfillment stages and attach evidence.'],
              ]}
            />
          </section>
          <SummaryTable title="Conversion by segment" rows={segmentSummary} />
          <SummaryTable title="Conversion by channel" rows={channelSummary} />
        </main>
      )}

      {activeTab === 'outreach' && (
        <main className="revenue-grid">
          <section className="ops-panel">
            <PanelHead kicker="Fast manual creation" title="Add prospect" />
            <form className="ops-form" onSubmit={saveProspect}>
              <Text value={prospectDraft.contactName} label="Contact or company name *" onChange={(contactName) => setProspectDraft({ ...prospectDraft, contactName })} required />
              <Select value={prospectDraft.buyerSegment} label="Buyer segment" options={BUYER_SEGMENTS} onChange={(buyerSegment) => setProspectDraft({ ...prospectDraft, buyerSegment: buyerSegment as BuyerSegment })} />
              <Text value={prospectDraft.role} label="Role" onChange={(role) => setProspectDraft({ ...prospectDraft, role })} />
              <Text value={prospectDraft.company} label="Company" onChange={(company) => setProspectDraft({ ...prospectDraft, company })} />
              <Text value={prospectDraft.email} label="Email" onChange={(email) => setProspectDraft({ ...prospectDraft, email })} />
              <Text value={prospectDraft.phone} label="Phone" onChange={(phone) => setProspectDraft({ ...prospectDraft, phone })} />
              <Text value={prospectDraft.socialProfile} label="Social profile" onChange={(socialProfile) => setProspectDraft({ ...prospectDraft, socialProfile })} />
              <Text value={prospectDraft.market} label="Market / geography" onChange={(market) => setProspectDraft({ ...prospectDraft, market })} />
              <Select value={prospectDraft.sourceChannel} label="Source channel" options={CHANNELS} onChange={(sourceChannel) => setProspectDraft({ ...prospectDraft, sourceChannel: sourceChannel as Channel })} />
              <Text value={prospectDraft.propertyLink} label="Associated property / listing" onChange={(propertyLink) => setProspectDraft({ ...prospectDraft, propertyLink })} />
              <Select value={prospectDraft.stage} label="Pipeline stage" options={PIPELINE_STAGES} onChange={(stage) => setProspectDraft({ ...prospectDraft, stage: stage as PipelineStage })} />
              <DateInput value={prospectDraft.nextFollowUpDate} label="Next follow-up" onChange={(nextFollowUpDate) => setProspectDraft({ ...prospectDraft, nextFollowUpDate })} />
              <Text value={String(prospectDraft.quotedPrice)} label="Quoted price" onChange={(value) => setProspectDraft({ ...prospectDraft, quotedPrice: numberField(value) })} />
              <Text value={prospectDraft.packageOffered} label="Package offered" onChange={(packageOffered) => setProspectDraft({ ...prospectDraft, packageOffered })} />
              <Textarea value={prospectDraft.objection} label="Objection / hesitation" onChange={(objection) => setProspectDraft({ ...prospectDraft, objection })} />
              <Textarea value={prospectDraft.notes} label="Notes" onChange={(notes) => setProspectDraft({ ...prospectDraft, notes })} />
              <button className="primary-action red-action full-field" type="submit">Save prospect</button>
            </form>
          </section>
          <section className="ops-panel">
            <PanelHead kicker="Messaging experiments" title="Campaign and variant" />
            <form className="ops-form compact-form" onSubmit={saveCampaign}>
              <Text value={campaignDraft.name} label="Campaign name *" onChange={(name) => setCampaignDraft({ ...campaignDraft, name })} required />
              <Select value={campaignDraft.targetSegment} label="Target segment" options={BUYER_SEGMENTS} onChange={(targetSegment) => setCampaignDraft({ ...campaignDraft, targetSegment: targetSegment as BuyerSegment })} />
              <Select value={campaignDraft.channel} label="Channel" options={CHANNELS} onChange={(channel) => setCampaignDraft({ ...campaignDraft, channel: channel as Channel })} />
              <Text value={campaignDraft.offer} label="Offer" onChange={(offer) => setCampaignDraft({ ...campaignDraft, offer })} />
              <Text value={String(campaignDraft.price)} label="Price" onChange={(value) => setCampaignDraft({ ...campaignDraft, price: numberField(value) })} />
              <Textarea value={campaignDraft.messageBody} label="Message body or reference" onChange={(messageBody) => setCampaignDraft({ ...campaignDraft, messageBody })} />
              <button className="mc-mini-action red-action full-field" type="submit">Save campaign</button>
            </form>
            <form className="ops-form compact-form" onSubmit={saveMessage}>
              <Select value={messageDraft.campaignId} label="Campaign" options={['', ...store.campaigns.map((campaign) => campaign.id)]} onChange={(campaignId) => setMessageDraft({ ...messageDraft, campaignId })} />
              <Text value={messageDraft.name} label="Variant name *" onChange={(name) => setMessageDraft({ ...messageDraft, name })} required />
              <Textarea value={messageDraft.body} label="Variant message" onChange={(body) => setMessageDraft({ ...messageDraft, body })} />
              <button className="mc-mini-action full-field" type="submit">Save message variant</button>
            </form>
          </section>
          <section className="ops-panel span-2">
            <PanelHead kicker="Pipeline" title="Prospects and next actions" />
            <div className="filter-row">
              <Select value={filterSegment} label="Segment filter" options={['All', ...BUYER_SEGMENTS]} onChange={(value) => setFilterSegment(value as BuyerSegment | 'All')} />
              <Select value={filterChannel} label="Channel filter" options={['All', ...CHANNELS]} onChange={(value) => setFilterChannel(value as Channel | 'All')} />
            </div>
            <Table
              headers={['Name', 'Segment', 'Channel', 'Stage', 'Follow-up', 'Price', 'Objection']}
              rows={filteredProspects.map((prospect) => [
                prospect.contactName,
                prospect.buyerSegment,
                prospect.sourceChannel,
                prospect.stage,
                prospect.nextFollowUpDate || 'Not scheduled',
                prospect.quotedPrice === '' ? 'No quote' : money(prospect.quotedPrice),
                prospect.objection || 'None recorded',
              ])}
              empty="No prospects recorded. Add the first outreach target to begin the revenue workflow."
            />
          </section>
        </main>
      )}

      {activeTab === 'orders' && (
        <main className="revenue-grid">
          <section className="ops-panel">
            <PanelHead kicker="Intake and orders" title="Create unified order" />
            <form className="ops-form" onSubmit={saveOrder}>
              <Select value={orderDraft.prospectId} label="Linked prospect" options={['', ...store.prospects.map((prospect) => prospect.id)]} onChange={(prospectId) => {
                const prospect = store.prospects.find((item) => item.id === prospectId)
                setOrderDraft({
                  ...orderDraft,
                  prospectId,
                  client: prospect?.contactName || orderDraft.client,
                  contactInfo: prospect?.email || orderDraft.contactInfo,
                  propertyLink: prospect?.propertyLink || orderDraft.propertyLink,
                  campaignId: prospect?.campaignId || orderDraft.campaignId,
                })
              }} />
              <Text value={orderDraft.client} label="Client *" onChange={(client) => setOrderDraft({ ...orderDraft, client })} required />
              <Text value={orderDraft.propertyAddress} label="Property address *" onChange={(propertyAddress) => setOrderDraft({ ...orderDraft, propertyAddress })} required />
              <Text value={orderDraft.propertyLink} label="Property link" onChange={(propertyLink) => setOrderDraft({ ...orderDraft, propertyLink })} />
              <Textarea value={orderDraft.buyerMandate} label="Buyer mandate / strategy" onChange={(buyerMandate) => setOrderDraft({ ...orderDraft, buyerMandate })} />
              <Text value={String(orderDraft.quotedPrice)} label="Quoted price" onChange={(value) => setOrderDraft({ ...orderDraft, quotedPrice: numberField(value) })} />
              <Select value={orderDraft.paymentStatus} label="Payment status" options={PAYMENT_STATES} onChange={(paymentStatus) => setOrderDraft({ ...orderDraft, paymentStatus: paymentStatus as Order['paymentStatus'] })} />
              <Text value={orderDraft.paymentReference} label="Payment reference" onChange={(paymentReference) => setOrderDraft({ ...orderDraft, paymentReference })} />
              <Text value={String(orderDraft.promisedTurnaroundHours)} label="Promised turnaround hours" onChange={(value) => setOrderDraft({ ...orderDraft, promisedTurnaroundHours: numberField(value) })} />
              <DateInput value={orderDraft.requestedDeliveryDate} label="Requested delivery date" onChange={(requestedDeliveryDate) => setOrderDraft({ ...orderDraft, requestedDeliveryDate })} />
              <Text value={orderDraft.assignedOperator} label="Assigned operator" onChange={(assignedOperator) => setOrderDraft({ ...orderDraft, assignedOperator })} />
              <Textarea value={orderDraft.specialInstructions} label="Special instructions" onChange={(specialInstructions) => setOrderDraft({ ...orderDraft, specialInstructions })} />
              <button className="primary-action red-action full-field" type="submit">Save order</button>
            </form>
          </section>
          <section className="ops-panel">
            <PanelHead kicker="Active dossiers" title="Fulfillment workflow" />
            <Select value={selectedOrder?.id || ''} label="Selected order" options={['', ...store.orders.map((order) => order.id)]} onChange={setSelectedOrderId} />
            {selectedOrder ? (
              <div className="stage-stack">
                {selectedOrder.workflow.map((stage, index) => (
                  <article key={stage.stage} className="stage-row">
                    <strong>{index + 1}. {stage.stage}</strong>
                    <input value={stage.owner} placeholder="Owner" onChange={(event) => {
                      const workflow = selectedOrder.workflow.map((item) => item.stage === stage.stage ? { ...item, owner: event.target.value } : item)
                      updateOrder({ ...selectedOrder, workflow })
                    }} />
                    <input value={stage.nextAction} placeholder="Required next action" onChange={(event) => {
                      const workflow = selectedOrder.workflow.map((item) => item.stage === stage.stage ? { ...item, nextAction: event.target.value } : item)
                      updateOrder({ ...selectedOrder, workflow })
                    }} />
                    <input value={stage.blockers} placeholder="Blockers / missing evidence" onChange={(event) => {
                      const workflow = selectedOrder.workflow.map((item) => item.stage === stage.stage ? { ...item, blockers: event.target.value } : item)
                      updateOrder({ ...selectedOrder, workflow })
                    }} />
                    <button type="button" className="mc-mini-action" onClick={() => {
                      const workflow = selectedOrder.workflow.map((item, stageIndex) => {
                        if (stageIndex === index) return { ...item, completedAt: item.completedAt ? '' : today() }
                        if (stageIndex === index + 1 && !item.enteredAt) return { ...item, enteredAt: today() }
                        return item
                      })
                      updateOrder({ ...selectedOrder, workflow })
                    }}>{stage.completedAt ? 'Reopen stage' : 'Complete stage'}</button>
                  </article>
                ))}
              </div>
            ) : <div className="honest-empty">Create an order to begin fulfillment tracking.</div>}
          </section>
          <section className="ops-panel span-2">
            <PanelHead kicker="Order ledger" title="Payment, delivery, and build history" />
            <Table
              headers={['Client', 'Property', 'Payment', 'Price', 'Requested', 'Delivered', 'Linked build']}
              rows={store.orders.map((order) => [
                order.client,
                order.propertyAddress,
                order.paymentStatus,
                order.quotedPrice === '' ? 'No quote' : money(order.quotedPrice),
                order.requestedDeliveryDate || 'Not requested',
                order.actualDeliveryDate || 'Not delivered',
                order.linkedDossierBuildId || 'None',
              ])}
              empty="No orders yet. Convert a prospect into an intake/order when there is a real request."
            />
          </section>
        </main>
      )}

      {activeTab === 'evidence' && (
        <main className="revenue-grid">
          <section className="ops-panel">
            <PanelHead kicker="Evidence review" title="Operator custody surface" />
            <Select value={selectedOrder?.id || ''} label="Selected order" options={['', ...store.orders.map((order) => order.id)]} onChange={setSelectedOrderId} />
            <button type="button" className="primary-action red-action" onClick={addEvidence} disabled={!selectedOrder}>Add evidence item</button>
            <div className="stage-stack">
              {store.evidenceItems.filter((item) => item.orderId === selectedOrder?.id).map((item) => (
                <article key={item.id} className="evidence-row">
                  <Text value={item.sourceName} label="Source name" onChange={(sourceName) => commit({ ...store, evidenceItems: store.evidenceItems.map((e) => e.id === item.id ? { ...e, sourceName } : e) })} />
                  <Text value={item.sourceUrl} label="URL / file reference" onChange={(sourceUrl) => commit({ ...store, evidenceItems: store.evidenceItems.map((e) => e.id === item.id ? { ...e, sourceUrl } : e) })} />
                  <Select value={item.verificationStatus} label="Verification" options={EVIDENCE_STATUSES} onChange={(verificationStatus) => commit({ ...store, evidenceItems: store.evidenceItems.map((e) => e.id === item.id ? { ...e, verificationStatus: verificationStatus as EvidenceItem['verificationStatus'] } : e) })} />
                  <Textarea value={item.conflicts} label="Conflicts" onChange={(conflicts) => commit({ ...store, evidenceItems: store.evidenceItems.map((e) => e.id === item.id ? { ...e, conflicts } : e) })} />
                  <Textarea value={item.missingRequirements} label="Missing evidence requirements" onChange={(missingRequirements) => commit({ ...store, evidenceItems: store.evidenceItems.map((e) => e.id === item.id ? { ...e, missingRequirements } : e) })} />
                </article>
              ))}
            </div>
          </section>
          <section className="ops-panel">
            <PanelHead kicker="Approval and release" title="Prevent accidental delivery" />
            <button type="button" className="primary-action red-action" onClick={addBuild} disabled={!selectedOrder}>Create dossier build</button>
            <div className="stage-stack">
              {store.dossierBuilds.filter((build) => build.orderId === selectedOrder?.id).map((build) => {
                const approval = store.approvals.find((item) => item.buildId === build.id)
                return (
                  <article key={build.id} className="build-card">
                    <strong>{build.version} · {build.status}</strong>
                    <span>{build.propertyAddress || 'Property pending'}</span>
                    <input value={build.renderedArtifactRef} placeholder="Rendered artifact reference" onChange={(event) => commit({ ...store, dossierBuilds: store.dossierBuilds.map((item) => item.id === build.id ? { ...item, renderedArtifactRef: event.target.value } : item) })} />
                    {!approval && <button type="button" className="mc-mini-action" onClick={() => addApproval(build.id)}>Start approval checklist</button>}
                    {approval && (
                      <ApprovalChecklist approval={approval} onChange={(next) => commit({ ...store, approvals: store.approvals.map((item) => item.id === next.id ? next : item) })} />
                    )}
                    <button type="button" className="mc-mini-action red-action" disabled={!canDeliverBuild(store, build.id)} onClick={() => addDelivery(build.id)}>
                      {canDeliverBuild(store, build.id) ? 'Record delivery' : 'Delivery locked until approved'}
                    </button>
                  </article>
                )
              })}
            </div>
          </section>
        </main>
      )}

      {activeTab === 'learning' && (
        <main className="revenue-grid">
          <section className="ops-panel">
            <PanelHead kicker="Fulfillment economics" title="Real cost per order" />
            <Select value={selectedOrder?.id || ''} label="Selected order" options={['', ...store.orders.map((order) => order.id)]} onChange={setSelectedOrderId} />
            <button type="button" className="primary-action red-action" onClick={addCost} disabled={!selectedOrder}>Add cost record</button>
            {store.fulfillmentCosts.filter((cost) => cost.orderId === selectedOrder?.id).map((cost) => (
              <article key={cost.id} className="economics-card">
                <Text value={String(cost.salePrice)} label="Sale price" onChange={(value) => commit({ ...store, fulfillmentCosts: store.fulfillmentCosts.map((item) => item.id === cost.id ? { ...item, salePrice: numberField(value) } : item) })} />
                <Text value={String(cost.paymentProcessingFee)} label="Processing fee" onChange={(value) => commit({ ...store, fulfillmentCosts: store.fulfillmentCosts.map((item) => item.id === cost.id ? { ...item, paymentProcessingFee: numberField(value) } : item) })} />
                <Text value={String(cost.dataProviderCosts)} label="Data-provider costs" onChange={(value) => commit({ ...store, fulfillmentCosts: store.fulfillmentCosts.map((item) => item.id === cost.id ? { ...item, dataProviderCosts: numberField(value) } : item) })} />
                <Text value={String(cost.contractorOrAnalystCost)} label="Analyst / contractor cost" onChange={(value) => commit({ ...store, fulfillmentCosts: store.fulfillmentCosts.map((item) => item.id === cost.id ? { ...item, contractorOrAnalystCost: numberField(value) } : item) })} />
                <Text value={String(cost.laborHours)} label="Labor hours" onChange={(value) => commit({ ...store, fulfillmentCosts: store.fulfillmentCosts.map((item) => item.id === cost.id ? { ...item, laborHours: numberField(value) } : item) })} />
                <Metric label="Gross contribution" value={money(calculateGrossContribution(cost))} />
                <Metric label="Effective hourly contribution" value={calculateEffectiveHourlyContribution(cost) === null ? 'No hours yet' : money(calculateEffectiveHourlyContribution(cost))} />
              </article>
            ))}
          </section>
          <section className="ops-panel">
            <PanelHead kicker="Post-delivery learning" title="What sold and what mattered" />
            <button type="button" className="primary-action red-action" onClick={addFeedback} disabled={!selectedOrder}>Add feedback record</button>
            {store.clientFeedback.filter((feedback) => feedback.orderId === selectedOrder?.id).map((feedback) => (
              <article key={feedback.id} className="feedback-card">
                <Textarea value={feedback.whyBought} label="Why customer bought" onChange={(whyBought) => commit({ ...store, clientFeedback: store.clientFeedback.map((item) => item.id === feedback.id ? { ...item, whyBought } : item) })} />
                <SectionPicker label="Most valuable sections" values={feedback.mostValuableSections} onChange={(mostValuableSections) => commit({ ...store, clientFeedback: store.clientFeedback.map((item) => item.id === feedback.id ? { ...item, mostValuableSections } : item) })} />
                <SectionPicker label="Influenced purchase decision" values={feedback.influencedPurchaseSections} onChange={(influencedPurchaseSections) => commit({ ...store, clientFeedback: store.clientFeedback.map((item) => item.id === feedback.id ? { ...item, influencedPurchaseSections } : item) })} />
                <SectionPicker label="Influenced property acquisition decision" values={feedback.influencedAcquisitionSections} onChange={(influencedAcquisitionSections) => commit({ ...store, clientFeedback: store.clientFeedback.map((item) => item.id === feedback.id ? { ...item, influencedAcquisitionSections } : item) })} />
                <Select value={feedback.likelyToPurchaseAgain} label="Likely to purchase again" options={['', 'No', 'Maybe', 'Yes']} onChange={(likelyToPurchaseAgain) => commit({ ...store, clientFeedback: store.clientFeedback.map((item) => item.id === feedback.id ? { ...item, likelyToPurchaseAgain: likelyToPurchaseAgain as ClientFeedback['likelyToPurchaseAgain'] } : item) })} />
                <Text value={feedback.repeatOrderId} label="Repeat order link" onChange={(repeatOrderId) => commit({ ...store, clientFeedback: store.clientFeedback.map((item) => item.id === feedback.id ? { ...item, repeatOrderId } : item) })} />
              </article>
            ))}
          </section>
          <section className="ops-panel span-2">
            <PanelHead kicker="Commercial evidence" title="Learning outputs" />
            <div className="learning-grid">
              <Learning label="Which buyer segment purchases first" value={firstPaidSegment(store) || 'No Evidence Yet'} />
              <Learning label="Which message causes action" value={messageSignal(store)} />
              <Learning label="Which channel produces customers" value={firstPaidChannel(store) || 'No Evidence Yet'} />
              <Learning label="Willingness to pay" value={summary.paidOrders ? money(numeric(summary.revenueCollected) / summary.paidOrders) : 'No Evidence Yet'} />
              <Learning label="Sales-cycle length" value={summary.averageSalesCycleDays === null ? 'No Evidence Yet' : `${summary.averageSalesCycleDays.toFixed(1)} days · ${signalForCount(summary.paidOrders)}`} />
              <Learning label="Turnaround time required" value={summary.averageTurnaroundDays === null ? 'No Evidence Yet' : `${summary.averageTurnaroundDays.toFixed(1)} days`} />
              <Learning label="Sections influencing purchase" value={sectionFrequency(store.clientFeedback.flatMap((item) => item.influencedPurchaseSections))} />
              <Learning label="Sections influencing acquisition" value={sectionFrequency(store.clientFeedback.flatMap((item) => item.influencedAcquisitionSections))} />
              <Learning label="Fulfillment economics" value={summary.averageGrossContribution === null ? 'No Evidence Yet' : money(summary.averageGrossContribution)} />
              <Learning label="Repeat-purchase behavior" value={summary.repeatCustomers ? `${summary.repeatCustomers} repeat link(s)` : 'No Evidence Yet'} />
            </div>
          </section>
        </main>
      )}

      {activeTab === 'axiom' && (
        <main className="revenue-grid">
          <section className="ops-panel span-2">
            <PanelHead kicker="AXIOM execution stewardship" title="Repository and scope health" />
            <div className="axiom-grid">
              <Metric label="Current business phase" value="Revenue-first, human-assisted underwriting" />
              <Metric label="Constitutional acknowledgment" value="Required reading order documented" />
              <Metric label="Core boundary" value="Mission Control records operations; Core owns deterministic financial truth" />
              <Metric label="Paid sale truth state" value={summary.paidOrders === 0 ? 'No paid sale recorded' : `${summary.paidOrders} paid`} />
              <Metric label="Active blockers" value={openBlockers(store)} />
              <Metric label="Unapproved builds" value={store.dossierBuilds.filter((build) => !canDeliverBuild(store, build.id)).length} />
            </div>
            <div className="guardrail-box">
              AXIOM may surface reading requirements, build/test status, deferred-feature discipline, unresolved placeholders, and workflow blockers. It does not calculate financial truth, invent evidence, or approve dossiers.
            </div>
          </section>
        </main>
      )}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return <article className="metric-tile"><span>{label}</span><strong>{value}</strong></article>
}

function PanelHead({ kicker, title }: { kicker: string; title: string }) {
  return <div className="panel-head"><p className="mc-admin-kicker">{kicker}</p><h2>{title}</h2></div>
}

function Text({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label>{label}<input value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label>{label}<input type="date" value={value} onChange={(event) => onChange(event.target.value)} /></label>
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="full-field">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} /></label>
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <label>{label}<select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option || 'None selected'}</option>)}</select></label>
}

function Table({ headers, rows, empty }: { headers: string[]; rows: React.ReactNode[][]; empty: string }) {
  if (!rows.length) return <div className="honest-empty">{empty}</div>
  return (
    <div className="mc-table-wrap">
      <table className="mc-table">
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

function ActionList({ items }: { items: [string, string][] }) {
  return <div className="action-list">{items.map(([title, copy]) => <article key={title}><strong>{title}</strong><span>{copy}</span></article>)}</div>
}

function SummaryTable({ title, rows }: { title: string; rows: ReturnType<typeof groupConversion> }) {
  return (
    <section className="ops-panel">
      <PanelHead kicker="Commercial signal" title={title} />
      <Table
        headers={['Group', 'Contacts', 'Replies', 'Qualified', 'Purchases', 'Signal']}
        rows={rows.filter((row) => row.contacts > 0 || row.purchases > 0).map((row) => [row.key, row.contacts, row.replies, row.qualified, row.purchases, row.signal])}
        empty="No comparable evidence yet."
      />
    </section>
  )
}

function ApprovalChecklist({ approval, onChange }: { approval: Approval; onChange: (approval: Approval) => void }) {
  const checks: Array<[keyof Approval, string]> = [
    ['propertyIdentityReviewed', 'Property identity reviewed'],
    ['materialSourcesAttached', 'Material sources attached'],
    ['materialAssumptionsDisclosed', 'Material assumptions disclosed'],
    ['calculationsReviewed', 'Calculations reviewed'],
    ['missingEvidenceDisclosed', 'Missing evidence disclosed'],
    ['contradictionsResolvedOrSurfaced', 'Contradictions resolved or surfaced'],
    ['clientCopyReviewed', 'Client-facing copy reviewed'],
    ['paymentConfirmedOrException', 'Payment confirmed or exception recorded'],
    ['correctBuildSelected', 'Correct dossier build selected'],
    ['deliveryRecipientConfirmed', 'Delivery recipient confirmed'],
  ]
  return (
    <div className="approval-checklist">
      {checks.map(([key, label]) => (
        <label key={key}>
          <input type="checkbox" checked={Boolean(approval[key])} onChange={(event) => onChange({ ...approval, [key]: event.target.checked })} />
          <span>{label}</span>
        </label>
      ))}
      <Text value={approval.approvedBy} label="Approved by" onChange={(approvedBy) => onChange({ ...approval, approvedBy, approvedAt: approvedBy ? today() : '' })} />
      <div className={isApprovalComplete(approval) ? 'release-ready' : 'release-locked'}>{isApprovalComplete(approval) ? 'Release gate clear' : 'Release gate locked'}</div>
    </div>
  )
}

function SectionPicker({ label, values, onChange }: { label: string; values: DossierSection[]; onChange: (values: DossierSection[]) => void }) {
  return (
    <fieldset className="section-picker">
      <legend>{label}</legend>
      {DOSSIER_SECTIONS.map((section) => (
        <label key={section}>
          <input
            type="checkbox"
            checked={values.includes(section)}
            onChange={(event) => onChange(event.target.checked ? [...values, section] : values.filter((item) => item !== section))}
          />
          <span>{section}</span>
        </label>
      ))}
      <p>{joinSections(values)}</p>
    </fieldset>
  )
}

function Learning({ label, value }: { label: string; value: React.ReactNode }) {
  return <article><span>{label}</span><strong>{value}</strong></article>
}

function firstPaidSegment(store: MissionControlStore) {
  const paid = store.orders.find((order) => order.paymentStatus === 'Paid')
  const prospect = store.prospects.find((item) => item.id === paid?.prospectId)
  return prospect?.buyerSegment
}

function firstPaidChannel(store: MissionControlStore) {
  const paid = store.orders.find((order) => order.paymentStatus === 'Paid')
  const prospect = store.prospects.find((item) => item.id === paid?.prospectId)
  return prospect?.sourceChannel
}

function messageSignal(store: MissionControlStore) {
  const paidOrder = store.orders.find((order) => order.paymentStatus === 'Paid')
  const prospect = store.prospects.find((item) => item.id === paidOrder?.prospectId)
  const variant = store.messageVariants.find((item) => item.id === prospect?.messageVariantId)
  return variant?.name || 'No Evidence Yet'
}

function sectionFrequency(sections: DossierSection[]) {
  if (!sections.length) return 'No Evidence Yet'
  const counts = sections.reduce<Record<string, number>>((memo, section) => ({ ...memo, [section]: (memo[section] || 0) + 1 }), {})
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([section, count]) => `${section} (${count})`).join(', ')
}

function openBlockers(store: MissionControlStore) {
  const blockers = store.orders.flatMap((order) => order.workflow.filter((stage) => stage.blockers.trim()))
  return blockers.length ? blockers.length : 'None recorded'
}
