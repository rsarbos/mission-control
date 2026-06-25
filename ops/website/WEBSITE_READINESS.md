# CODEX PROMPT PACKAGE — RSARBOS WEBSITE LAUNCH READINESS

You are operating inside the RSARBOS public website repository.

Your objective is not to redesign the company.

Your objective is to make the website launch-ready for manual underwriting revenue.

Mission Control has reached a useful operational baseline.

Do not continue Mission Control work unless required to preserve the public website flow.

The business priority is now:

Website Completion
→ Intake Flow
→ Payment Flow
→ Manual Underwriting Delivery
→ Revenue

## Operating Context

RSARBOS is currently launching as a manual underwriting service.

The website exists to acquire customers.

Mission Control exists to support internal operations.

The public visitor should understand:

1. What RSARBOS does.
2. Why it is trustworthy.
3. What the manual underwriting deliverable includes.
4. How to request a report.
5. How much it costs.
6. What happens after payment.
7. How they receive the completed underwriting package.

## Current Architectural Model

RSARBOS Website

├── Home
├── Services
├── Request Underwriting
├── Pricing
├── Sample Reports
├── Contact
│
└── Mission Control (Private)

```
├── Intake Queue
├── Active Requests
├── Client Status
├── Revenue
├── Investor Data Room
├── Operations
└── Constitutional State
```

## Definitions

### Home

Purpose:

* Brand narrative
* Trust
* Authority
* Clear explanation of RSARBOS

Must communicate:

RSARBOS transforms property data into decision-grade underwriting intelligence.

### Services

Purpose:

* Manual underwriting offering
* Deliverables
* Process

Must explain what the customer receives:

* Property review
* Comparable analysis
* ARV thesis
* Risk notes
* Pricing context
* Deal confidence summary
* Final underwriting dossier

### Request Underwriting

Purpose:

* Intake form
* Client submission workflow

Required intake fields:

* Client name
* Email
* Property address
* Property URL
* Investment intent
* Notes / questions
* Urgency level if already available

Submission should route toward:

[uw.requests@rsarbos.com](mailto:uw.requests@rsarbos.com)

### Pricing

Purpose:

* Service pricing
* Payment instructions

Current initial offer:

Manual Underwriting Report: $100/report

Payment confirmation language should clearly state:

"Request received. RSARBOS will review the submitted information. Please confirm this request with payment. Within 24 hours after payment confirmation, you will receive a private link from this email with your completed underwriting package."

Use placeholder payment link if the real PayPal link is not configured yet.

Do not invent final payment credentials.

Use a clearly marked placeholder:

[PAYMENT_LINK_PENDING]

### Sample Reports

Purpose:

* Example deliverables
* Demonstration dossiers
* Investor confidence

If no final sample report asset exists yet, create a launch-safe placeholder section explaining what a sample report will include.

Do not fake completed reports.

### Contact

Purpose:

* Client communication

Use:

[uw.requests@rsarbos.com](mailto:uw.requests@rsarbos.com) for underwriting requests.

If support language is needed, mention:

[uw.support@rsarbos.com](mailto:uw.support@rsarbos.com) as optional support/intake support email if configured.

Do not assume it is live unless existing repo content confirms it.

### Mission Control Private

Purpose:

* Internal business operations
* Request tracking
* Workflow management
* Revenue monitoring
* Investor readiness
* Constitutional visibility

Mission Control is not the product.

Mission Control supports the business.

The public website sells the service.

## Important Strategic Rule

Revenue generation has priority over additional Mission Control enhancements.

Do not add speculative features.

Do not build new dashboards.

Do not expand the Investor Data Room.

Do not introduce new governance layers.

Do not start architectural experiments.

Do not over-engineer the workflow.

This website phase should be faster and more practical than core platform development.

The core RSARBOS system requires high precision and deep traceability.

The website requires enough structure to launch, sell, intake requests, and support manual delivery.

Use a leaner operating flow:

1. Inspect
2. Identify blockers
3. Implement launch-critical fixes
4. Verify build
5. Document state
6. Commit and push

Do not spend excessive time planning if the implementation path is obvious.

Do not rewrite stable sections unless they block launch readiness.

## Required First Step

Before editing, inspect:

* README.md
* NORTH_STAR.md
* BRAND_BOOK.md
* AXIOM_CONSTITUTION.md or AXIOM-OPERATIONS.md if present
* STATE.md files relevant to website/revenue
* Current public website routes/components/pages
* Existing form handling
* Existing email copy
* Existing pricing/payment content

Then produce a short launch-readiness assessment:

1. What exists.
2. What is missing.
3. What blocks a visitor from becoming a paid manual underwriting customer.
4. What can be fixed immediately.

## Primary Implementation Objective

Make the website capable of supporting this real-world flow:

Visitor lands on RSARBOS
↓
Understands the service
↓
Sees trust/authority
↓
Reviews pricing
↓
Submits underwriting request
↓
Receives payment instructions
↓
RSARBOS receives request at [uw.requests@rsarbos.com](mailto:uw.requests@rsarbos.com)
↓
Founder/operator manually completes underwriting
↓
Client receives private completed report link

## Launch-Critical Work

Prioritize these in order:

### 1. Navigation and Page Structure

Ensure the public website clearly exposes:

* Home
* Services
* Request Underwriting
* Pricing
* Sample Reports
* Contact

If routing already exists, improve it.

If routing does not exist, implement the simplest stable structure consistent with the repo framework.

### 2. Homepage Clarity

The homepage must answer quickly:

* What is RSARBOS?
* Who is it for?
* What decision does it help with?
* What is the next action?

Primary CTA:

Request Manual Underwriting

Secondary CTA:

View Sample Report / See What You Receive

### 3. Manual Underwriting Service Section

Create or refine copy explaining:

RSARBOS provides manual underwriting intelligence for property investors, operators, and buyers who want a clearer view of price, risk, ARV, comparable context, and deal confidence before making a decision.

Avoid hype.

Avoid saying the system guarantees returns.

Use sober, trust-building language.

### 4. Request Form

Implement or refine the request form.

Required fields:

* Full name
* Email
* Property address
* Property listing URL
* Investment goal
* Notes

After submission, the user should see a confirmation message.

Preferred confirmation message:

"Request received. RSARBOS will review the information submitted. Please confirm this request with payment at [PAYMENT_LINK_PENDING]. Within 24 hours after payment confirmation, you will receive a private link from this email with your completed underwriting package. Thanks for using RSARBOS."

If backend email routing is not available yet, create a safe placeholder and document exactly what remains needed.

### 5. Pricing Section

Add or confirm:

Manual Underwriting Report — $100

Include:

* One property
* Manual review
* Comparable context
* ARV thesis
* Risk notes
* Final underwriting summary
* Delivered as private link within 24 hours after payment confirmation

Use language that makes the price feel like risk reduction, not a random fee.

### 6. Sample Reports Section

If final sample assets exist, connect them.

If not, create a placeholder explaining:

Sample reports will show:

* Property snapshot
* Value thesis
* Comparable review
* Risk flags
* Confidence summary
* Final recommendation

Do not fabricate completed sample reports.

### 7. Contact Section

Add clear contact language:

For underwriting requests:
[uw.requests@rsarbos.com](mailto:uw.requests@rsarbos.com)

For support:
[uw.support@rsarbos.com](mailto:uw.support@rsarbos.com), only if existing repo/config confirms it or mark as planned.

### 8. Mission Control Boundary

Document clearly:

Mission Control is private/internal.

The public website should not expose internal operations unless intentionally protected.

If Mission Control is currently accessible publicly, note it as a blocker or recommend a private route/access boundary.

Do not implement complex authentication unless already present and easy to preserve.

## Quality Standard

The site should feel:

* Trustworthy
* Precise
* Operational
* Clear
* Premium
* Investor-aware
* Not generic SaaS
* Not playful
* Not over-animated

The visitor should feel:

"This service can help me avoid a bad real estate decision."

Not:

"This is another AI landing page."

## Build/Verification Requirements

After implementation:

1. Run the available build/test/lint command.
2. Fix launch-blocking errors.
3. Do not chase non-blocking polish unless time remains.
4. Report unresolved issues honestly.

## Documentation Requirements

Update relevant STATE.md files.

Create or update a website handoff note if needed.

Document:

* What was changed.
* What is now launch-ready.
* What remains blocked.
* What placeholders still need real values.
* Whether payment link/email routing is live or placeholder.

## Commit Requirements

When done:

1. Stage relevant files.
2. Commit with a clear message.
3. Push if remote is configured and available.

Suggested commit message:

FEAT: Prepare RSARBOS website for manual underwriting launch

## Final Response Required

Before concluding, provide:

1. Website launch readiness score from 0–100.
2. What is ready.
3. What is blocked.
4. Exact remaining steps to accept paid manual underwriting requests.
5. Files changed.
6. Build/test result.
7. Commit hash if committed.
8. Push status.

Remember:

The goal is not a perfect website.

The goal is the shortest credible path to revenue.

Website Completion
→ Intake Flow
→ Payment Flow
→ Manual Underwriting Delivery
→ Revenue

Finish.
Verify.
Document.
Commit.
Push.
