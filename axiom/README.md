# rsarbos-mission-control

This repository is organized around a single source of truth: the AXIOM Constitution.

See the root constitution: /axiom/AXIOM_CONSTITUTION.md

Domain constitutions live under `ops/` and inherit from the AXIOM Constitution.

For all future coding agents, begin with the canonical reading sequence in:

`AGENTS_REQUIRED_READING.md`

That document defines the current Mission Control/Core boundary, the revenue-first execution phase, the manual-to-Core convergence doctrine, and AXIOM's practical stewardship role.

Next steps:
- Review and adapt domain `CONSTITUTION.md` files.
- Create `STATE.md` and `TASKS.md` for each domain.
- Hand Prompt Package #1 to Codex to scaffold tasks and dashboard.


# RSARBOS

Decision Intelligence for Real Estate Underwriting.

---

## What Is RSARBOS?

RSARBOS is an AI-assisted underwriting operating system designed to transform fragmented property information into auditable, decision-grade intelligence.

The platform combines:

* Source collection
* Data normalization
* Deterministic financial calculations
* Confidence scoring
* AI-assisted analysis
* Human review

to produce transparent underwriting decisions.

---

## Core Philosophy

RSARBOS follows a constitutional architecture.

Reality is established by evidence.

Calculations are deterministic.

Artificial intelligence interprets uncertainty.

Humans remain the final authority.

---

## Repository Boot Sequence

Before making changes, every engineer or AI agent must read:

1. `AGENTS_REQUIRED_READING.md`
2. `axiom/AXIOM_CONSTITUTION.md`
3. `axiom/NORTH_STAR.md`
4. `axiom/BRAND_BOOK.md`
5. The relevant domain files under `ops/*/CONSTITUTION.md`, `ops/*/STATE.md`, and `ops/*/TASKS.md`

These documents are the constitutional source of truth.

Code is implementation.

The constitution defines intent.

---

## System Goals

The platform should:

* Archive source material
* Extract structured property data
* Detect source conflicts
* Calculate underwriting metrics
* Generate confidence scores
* Produce reviewable underwriting packets
* Support auditability and replayability

---

## Architectural Principles

### Evidence First

Every conclusion should be traceable to evidence.

### Deterministic Before Generative

Financial values should come from data and formulas.

Not from AI estimation.

### Human Authority

AI assists.

Humans decide.

### Auditability

Every decision should be explainable and reproducible.

---

## Current Phase

RSARBOS is currently operating as a manual underwriting service while constitutional infrastructure and automation systems are being developed.

The objective is to validate workflows, generate revenue, and refine decision systems before full platform scale.

---

## Repository Structure

```txt
/
├── AGENTS_REQUIRED_READING.md
├── api/
├── axiom/
├── docs/
├── ops/
├── prompt-packages/
├── references/
├── rsarbos-mission-control/
├── package.json
└── vercel.json
```

---

## Agent Rule

If you are an AI agent:

Read the constitutional documents first.

Understand the mission.

Understand the current state.

Understand the visual identity.

Then modify the codebase.

Never optimize for generic SaaS patterns.

Optimize for trust, auditability, clarity, and decision quality.

---

## RSARBOS

Confidence through evidence.
_
