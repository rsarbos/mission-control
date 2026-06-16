import { useEffect, useRef, useState, type PointerEvent } from "react";
import "./decision-manifest.css";

export type EvidenceState = "verified" | "reviewed" | "open" | "conflict";

export interface DecisionManifestCheck {
  label: string;
  state: EvidenceState;
}

export interface DecisionManifestData {
  eyebrow: string;
  propertyAddress: string;
  market: string;
  propertyType: string;
  caseReference: string;
  marketValueRange: string;
  acquisitionCondition: string;
  reviewStatus: string;
  checks: DecisionManifestCheck[];
  buildId: string;
  sourceCount: number;
}

export interface DecisionManifestProps {
  data?: Partial<DecisionManifestData>;
  mode?: "hero" | "expanded";
  className?: string;
  interactive?: boolean;
  showSampleLabel?: boolean;
}

const DEFAULT_DATA: DecisionManifestData = {
  eyebrow: "Sample decision manifest",
  propertyAddress: "1314 Shawn Dr #1",
  market: "San Jose, CA 95118",
  propertyType: "Condo · 2 BD / 1 BA",
  caseReference: "SHAWN-DR-01",
  marketValueRange: "$500K–$550K",
  acquisitionCondition: "Proceed only if rent + HOA evidence verify",
  reviewStatus: "Human-reviewed",
  checks: [
    { label: "Identity locked", state: "verified" },
    { label: "Sale comps reviewed", state: "reviewed" },
    { label: "Rent thesis disputed", state: "conflict" },
    { label: "HOA package open", state: "open" },
  ],
  buildId: "RSB-SHAWN-01-V1",
  sourceCount: 14,
};

function statusLabel(state: EvidenceState) {
  if (state === "verified") return "Verified";
  if (state === "reviewed") return "Reviewed";
  if (state === "conflict") return "Conflict";
  return "Open";
}

export function DecisionManifest({
  data,
  mode = "hero",
  className = "",
  interactive = true,
  showSampleLabel = true,
}: DecisionManifestProps) {
  const manifest = { ...DEFAULT_DATA, ...data };
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(mode === "expanded");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches && shellRef.current) {
      shellRef.current.style.setProperty("--rsdm-rx", "-5deg");
      shellRef.current.style.setProperty("--rsdm-ry", "8deg");
    }
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || !shellRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = shellRef.current.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;
    const ry = (px - 0.5) * 12;
    const rx = (0.5 - py) * 9 - 6;

    shellRef.current.style.setProperty("--rsdm-rx", `${rx.toFixed(2)}deg`);
    shellRef.current.style.setProperty("--rsdm-ry", `${ry.toFixed(2)}deg`);
    shellRef.current.style.setProperty("--rsdm-light-x", `${Math.round(px * 100)}%`);
    shellRef.current.style.setProperty("--rsdm-light-y", `${Math.round(py * 100)}%`);
  }

  function resetTilt() {
    if (!shellRef.current) return;
    shellRef.current.style.setProperty("--rsdm-rx", "-8deg");
    shellRef.current.style.setProperty("--rsdm-ry", "12deg");
    shellRef.current.style.setProperty("--rsdm-light-x", "72%");
    shellRef.current.style.setProperty("--rsdm-light-y", "24%");
  }

  return (
    <div
      ref={shellRef}
      className={`rsdm-shell rsdm-shell--${mode} ${expanded ? "is-expanded" : ""} ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      aria-label="Illustrative RSARBOS decision manifest"
    >
      <div className="rsdm-ambient" aria-hidden="true" />
      <div className="rsdm-stage">
        <div className="rsdm-plate">
          <div className="rsdm-grid" aria-hidden="true" />
          <div className="rsdm-scan" aria-hidden="true" />

          <div className="rsdm-topbar rsdm-layer rsdm-layer--5">
            <div className="rsdm-topbar-copy">
              <span className="rsdm-live-dot" aria-hidden="true" />
              <span>{manifest.eyebrow}</span>
            </div>
            <span className="rsdm-review-badge">{manifest.reviewStatus}</span>
          </div>

          <section className="rsdm-property rsdm-layer rsdm-layer--2">
            <div className="rsdm-property-visual" aria-hidden="true">
              <svg viewBox="0 0 180 140" role="presentation">
                <defs>
                  <linearGradient id="rsdmHouse" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#7db3ff" stopOpacity="0.78" />
                    <stop offset="1" stopColor="#e84c59" stopOpacity="0.56" />
                  </linearGradient>
                </defs>
                <path d="M25 72 90 24l65 48v45H25Z" fill="none" stroke="url(#rsdmHouse)" strokeWidth="2.4" />
                <path d="M44 117V71h92v46M68 117V84h42v33M124 83h12M124 94h12" fill="none" stroke="#8aa3c7" strokeOpacity="0.72" strokeWidth="2" />
                <path d="M14 121h150" stroke="#5c7399" strokeOpacity="0.36" />
                <circle cx="143" cy="42" r="18" fill="#3a76f0" fillOpacity="0.1" stroke="#3a76f0" strokeOpacity="0.24" />
              </svg>
              <span>{manifest.propertyType}</span>
            </div>

            <div className="rsdm-property-copy">
              <p className="rsdm-kicker">Property case</p>
              <h3>{manifest.propertyAddress}</h3>
              <p className="rsdm-market">{manifest.market}</p>
              <div className="rsdm-tags">
                <span>Case {manifest.caseReference}</span>
                {showSampleLabel && <span className="rsdm-tag-sample">Illustrative sample</span>}
              </div>
            </div>
          </section>

          <div className="rsdm-comparison rsdm-layer rsdm-layer--3">
            <section className="rsdm-metric rsdm-metric--neutral">
              <p>Current value view</p>
              <strong>{manifest.marketValueRange}</strong>
              <span>Direct comparable range</span>
            </section>

            <section className="rsdm-metric rsdm-metric--decision">
              <p>Acquisition condition</p>
              <strong>Conditional pursue</strong>
              <span>{manifest.acquisitionCondition}</span>
            </section>
          </div>

          <section className="rsdm-diligence rsdm-layer rsdm-layer--4">
            <div className="rsdm-diligence-heading">
              <div>
                <p>Decision readiness</p>
                <strong>{manifest.checks.filter((check) => check.state === "verified" || check.state === "reviewed").length} of {manifest.checks.length} critical checks cleared</strong>
              </div>
              <span>{manifest.sourceCount} sources</span>
            </div>
            <div className="rsdm-progress" aria-hidden="true">
              <span style={{ width: `${Math.max(25, (manifest.checks.filter((check) => check.state === "verified" || check.state === "reviewed").length / manifest.checks.length) * 100)}%` }} />
            </div>
            <div className="rsdm-checks">
              {manifest.checks.map((check) => (
                <div className={`rsdm-check rsdm-check--${check.state}`} key={check.label}>
                  <span aria-hidden="true" />
                  <div>
                    <b>{check.label}</b>
                    <small>{statusLabel(check.state)}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rsdm-audit rsdm-layer rsdm-layer--6">
            <p>Audit trail</p>
            <strong>Sources, assumptions, calculations and verdict preserved by build.</strong>
            <div>
              <span>{manifest.buildId}</span>
              <span className="rsdm-integrity"><i /> Integrity recorded</span>
            </div>
          </aside>
        </div>
      </div>

      {mode === "expanded" && (
        <button
          type="button"
          className="rsdm-expand-control"
          onClick={() => setExpanded((current) => !current)}
          aria-pressed={expanded}
        >
          {expanded ? "Collapse decision layers" : "Inspect decision layers"}
        </button>
      )}
    </div>
  );
}
