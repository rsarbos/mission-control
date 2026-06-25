# Project Folder and File Structure

This document outlines the current top-level structure of the Mission Control project.

```
/home/mr0/Documents/Mission Control/
├── .agents/                         # Local agent metadata
├── .codex/                          # Local Codex metadata
├── .vercel/                         # Vercel project binding
├── api/                             # Root Vercel serverless routes
├── axiom/                           # Cross-domain doctrine and brand documents
├── docs/
│   ├── mission-control/             # Mission Control implementation history
│   ├── operations/                  # Manual fulfillment and payment flow docs
│   ├── revenue/                     # Outreach, marketing, and asset planning docs
│   └── website/                     # Launch-readiness and public website docs
├── ops/                             # Domain constitutions, state, and task files
├── prompt-packages/                 # Reusable prompt packages
├── references/                      # Source screenshots and supporting assets
├── rsarbos-mission-control/         # Vite/React public website and private UI
├── AGENTS_REQUIRED_READING.md       # Root entrypoint for agent orientation
├── package.json                     # Root scripts and deployment package metadata
├── package-lock.json                # Root dependency lockfile
└── vercel.json                      # Vercel routing/build configuration
```

Root files are reserved for repository entrypoints, deployment configuration, package metadata, and the required agent orientation document. Supporting documentation should live under `docs/`, `ops/`, `axiom/`, `prompt-packages/`, or `references/`.
