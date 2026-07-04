"use client";

import { useState } from "react";

import { MCKINSEY_RUBRIC } from "@/lib/firmRubrics/mckinsey";
import { BCG_RUBRIC } from "@/lib/firmRubrics/bcg";
import { BAIN_RUBRIC } from "@/lib/firmRubrics/bain";
import { EY_PARTHENON_RUBRIC } from "@/lib/firmRubrics/eyParthenon";
import { DELOITTE_RUBRIC } from "@/lib/firmRubrics/deloitte";
import { KPMG_RUBRIC } from "@/lib/firmRubrics/kpmg";
import { PWC_RUBRIC } from "@/lib/firmRubrics/pwc";
import { ROLAND_BERGER_RUBRIC } from "@/lib/firmRubrics/rolandBerger";
import { ACCENTURE_RUBRIC } from "@/lib/firmRubrics/accenture";
import { OLIVER_WYMAN_RUBRIC } from "@/lib/firmRubrics/oliverWyman";
import { KEARNEY_RUBRIC } from "@/lib/firmRubrics/kearney";
import { LEK_RUBRIC } from "@/lib/firmRubrics/lek";
import { MONITOR_DELOITTE_RUBRIC } from "@/lib/firmRubrics/monitorDeloitte";
import { IBM_RUBRIC } from "@/lib/firmRubrics/ibm";
import { HURON_RUBRIC } from "@/lib/firmRubrics/huron";
import { CAPITAL_ONE_RUBRIC } from "@/lib/firmRubrics/capitalOne";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FIRMS: { label: string; rubric: any }[] = [
  { label: "McKinsey & Company", rubric: MCKINSEY_RUBRIC },
  { label: "BCG", rubric: BCG_RUBRIC },
  { label: "Bain & Company", rubric: BAIN_RUBRIC },
  { label: "EY-Parthenon", rubric: EY_PARTHENON_RUBRIC },
  { label: "Deloitte", rubric: DELOITTE_RUBRIC },
  { label: "KPMG", rubric: KPMG_RUBRIC },
  { label: "PwC Strategy&", rubric: PWC_RUBRIC },
  { label: "Roland Berger", rubric: ROLAND_BERGER_RUBRIC },
  { label: "Accenture", rubric: ACCENTURE_RUBRIC },
  { label: "Oliver Wyman", rubric: OLIVER_WYMAN_RUBRIC },
  { label: "Kearney", rubric: KEARNEY_RUBRIC },
  { label: "L.E.K. Consulting", rubric: LEK_RUBRIC },
  { label: "Monitor Deloitte", rubric: MONITOR_DELOITTE_RUBRIC },
  { label: "IBM Consulting", rubric: IBM_RUBRIC },
  { label: "Huron Consulting", rubric: HURON_RUBRIC },
  { label: "Capital One", rubric: CAPITAL_ONE_RUBRIC },
];

const GENERAL_TIPS = [
  "Clarify the objective before you structure anything — restate the question in your own words and confirm it.",
  "Build a MECE, case-specific framework. A textbook framework with no adaptation reads as generic.",
  "Say your hypothesis out loud early, and update it as new data comes in instead of collecting data aimlessly.",
  "Narrate your math as you go — interviewers grade the setup and logic, not just the final number.",
  "Lead with the bottom line, then support it. Don't make the interviewer wait for your conclusion.",
  "Always close with a clear recommendation, the key risk, and a next step — even if you're unsure, commit to a view.",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dimensionTips(dim: any): string[] {
  if (Array.isArray(dim.whatStrongLooksLike) && dim.whatStrongLooksLike.length > 0) {
    return dim.whatStrongLooksLike.slice(0, 3);
  }
  if (dim.scoringCriteria) {
    const best = dim.scoringCriteria[5] ?? dim.scoringCriteria[4];
    if (best) return [best];
  }
  return [];
}

export default function GuidePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = FIRMS[activeIndex];
  const rubric = active.rubric;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dimensions: any[] = rubric.dimensions ?? [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--hp-bg, #fafafa)", fontFamily: FONT, padding: "3rem 1.5rem 6rem" }}>
      <div style={{ maxWidth: "880px", margin: "0 auto" }}>

        <div style={{ marginBottom: "0.5rem", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af" }}>
          MyCasePrep · Sample guide
        </div>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 0.5rem" }}>
          Case interview prep guide
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.6, margin: "0 0 2rem", maxWidth: "640px" }}>
          A quick-reference MVP: general case interview tips, plus the actual scoring rubric — dimensions, weights,
          and what strong performance looks like — for each firm we grade against.
        </p>

        {/* General tips */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1.5rem 1.75rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 0.9rem" }}>General tips</h2>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {GENERAL_TIPS.map((tip, i) => (
              <li key={i} style={{ fontSize: "0.88rem", color: "#374151", lineHeight: 1.6 }}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* Firm selector */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {FIRMS.map((f, i) => (
            <button
              key={f.label}
              onClick={() => setActiveIndex(i)}
              style={{
                padding: "0.4rem 0.9rem", borderRadius: "9999px",
                border: `1.5px solid ${i === activeIndex ? "#6d28d9" : "#e5e7eb"}`,
                background: i === activeIndex ? "#6d28d9" : "white",
                color: i === activeIndex ? "white" : "#374151",
                fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Firm rubric */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 0.25rem" }}>{rubric.firmFullName ?? active.label}</h2>
            {rubric.format && (
              <p style={{ fontSize: "0.82rem", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{rubric.format}</p>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {dimensions.map((dim) => {
              const tips = dimensionTips(dim);
              return (
                <div key={dim.key} style={{ borderTop: "1px solid #f0f0f0", paddingTop: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827" }}>{dim.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                      {dim.dealbreaker && (
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "9999px", padding: "0.1rem 0.5rem" }}>
                          Dealbreaker
                        </span>
                      )}
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6d28d9", background: "#f5f3ff", borderRadius: "9999px", padding: "0.1rem 0.55rem" }}>
                        {dim.weight}%
                      </span>
                    </div>
                  </div>
                  {tips.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {tips.map((t, i) => (
                        <li key={i} style={{ fontSize: "0.82rem", color: "#4b5563", lineHeight: 1.55 }}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {rubric.offerDecision?.offerThreshold && (
            <div style={{ marginTop: "0.25rem", paddingTop: "1rem", borderTop: "1px solid #f0f0f0", fontSize: "0.78rem", color: "#6b7280" }}>
              Offer threshold: weighted score ≥ {rubric.offerDecision.offerThreshold}
              {rubric.offerDecision.hardFloorDimensions?.length > 0 && (
                <> · hard floor of {rubric.offerDecision.hardFloorScore} on {rubric.offerDecision.hardFloorDimensions.join(", ")}</>
              )}
            </div>
          )}
        </div>

        <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "2rem", textAlign: "center" }}>
          This is a standalone sample page — not linked from the app.
        </p>
      </div>
    </div>
  );
}
