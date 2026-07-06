"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

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
  "Clarify the objective before you structure anything: restate the question in your own words and confirm it.",
  "Build a MECE, case-specific framework. A textbook framework with no adaptation reads as generic.",
  "Say your hypothesis out loud early, and update it as new data comes in instead of collecting data aimlessly.",
  "Narrate your math as you go: interviewers grade the setup and logic, not just the final number.",
  "Lead with the bottom line, then support it. Don't make the interviewer wait for your conclusion.",
  "Always close with a clear recommendation, the key risk, and a next step, even if you're unsure, and commit to a view.",
];

/** The rubric source data uses em dashes throughout; normalize them for display. */
function clean(text: string): string {
  return text.replace(/\s*—\s*/g, " - ");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dimensionTips(dim: any): string[] {
  if (Array.isArray(dim.whatStrongLooksLike) && dim.whatStrongLooksLike.length > 0) {
    return dim.whatStrongLooksLike.slice(0, 3).map(clean);
  }
  if (dim.scoringCriteria) {
    const best = dim.scoringCriteria[5] ?? dim.scoringCriteria[4];
    if (best) return [clean(best)];
  }
  return [];
}

function CardSection({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      style={{ background: "white", borderRadius: "20px", border: "1px solid var(--hp-border)", boxShadow: "var(--hp-shadow-card)", overflow: "hidden" }}
    >
      <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--hp-border)" }}>
        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--hp-foreground)", fontFamily: FONT }}>{title}</span>
      </div>
      <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function GuidePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = FIRMS[activeIndex];
  const rubric = active.rubric;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dimensions: any[] = rubric.dimensions ?? [];

  const filterPill = (active: boolean): React.CSSProperties => ({
    padding: "0.35rem 0.9rem",
    borderRadius: "9999px",
    border: `1.5px solid ${active ? "var(--hp-primary)" : "var(--hp-border)"}`,
    background: active ? "var(--hp-primary)" : "white",
    color: active ? "white" : "var(--hp-soft-foreground)",
    fontSize: "0.8rem", fontWeight: 600,
    cursor: "pointer", fontFamily: FONT, transition: "all 0.15s",
  });

  return (
    <div style={{
      minHeight: "100vh", fontFamily: FONT,
      background: "var(--hp-bg)",
      backgroundImage: [
        "radial-gradient(at 8% 12%, var(--hp-lavender) 0px, transparent 45%)",
        "radial-gradient(at 92% 10%, var(--hp-peach) 0px, transparent 45%)",
        "radial-gradient(at 85% 92%, var(--hp-mint) 0px, transparent 50%)",
        "radial-gradient(at 10% 92%, var(--hp-sky) 0px, transparent 45%)",
      ].join(", "),
      backgroundAttachment: "fixed",
    }}>
      <Navbar />

      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "0 2rem 5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "0.5rem" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--hp-soft-foreground)", marginBottom: "0.5rem" }}>
            MyCasePrep · Sample guide
          </div>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--hp-foreground)", margin: 0 }}>
            Case interview prep guide
          </h1>
          <p style={{ marginTop: "0.4rem", fontSize: "0.9rem", color: "var(--hp-soft-foreground)", lineHeight: 1.6, maxWidth: "640px" }}>
            A quick-reference MVP: general case interview tips, plus the actual scoring rubric (dimensions, weights,
            and what strong performance looks like) for each firm we grade against.
          </p>
        </motion.div>

        <CardSection title="General tips" delay={0.04}>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {GENERAL_TIPS.map((tip, i) => (
              <li key={i} style={{ fontSize: "0.88rem", color: "var(--hp-foreground)", lineHeight: 1.6 }}>{tip}</li>
            ))}
          </ul>
        </CardSection>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {FIRMS.map((f, i) => (
            <button key={f.label} style={filterPill(i === activeIndex)} onClick={() => setActiveIndex(i)}>
              {f.label}
            </button>
          ))}
        </motion.div>

        <CardSection title={rubric.firmFullName ?? active.label} delay={0.1}>
          {rubric.format && (
            <p style={{ fontSize: "0.82rem", color: "var(--hp-soft-foreground)", margin: "-0.75rem 0 0", lineHeight: 1.6 }}>
              {clean(rubric.format)}
            </p>
          )}

          {dimensions.map((dim, i) => {
            const tips = dimensionTips(dim);
            return (
              <div key={dim.key} style={{ borderTop: i === 0 ? "none" : "1px solid var(--hp-border)", paddingTop: i === 0 ? 0 : "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--hp-foreground)" }}>{clean(dim.label)}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                    {dim.dealbreaker && (
                      <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "9999px", fontFamily: FONT, background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>
                        Dealbreaker
                      </span>
                    )}
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--hp-primary)", background: "var(--hp-primary-soft)", borderRadius: "9999px", padding: "0.2rem 0.6rem" }}>
                      {dim.weight}%
                    </span>
                  </div>
                </div>
                {tips.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {tips.map((t, ti) => (
                      <li key={ti} style={{ fontSize: "0.82rem", color: "var(--hp-soft-foreground)", lineHeight: 1.55 }}>{t}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}

          {rubric.offerDecision?.offerThreshold && (
            <div style={{ borderTop: "1px solid var(--hp-border)", paddingTop: "1.25rem", fontSize: "0.78rem", color: "var(--hp-soft-foreground)" }}>
              Offer threshold: weighted score of {rubric.offerDecision.offerThreshold} or higher
              {rubric.offerDecision.hardFloorDimensions?.length > 0 && (
                <>, with a hard floor of {rubric.offerDecision.hardFloorScore} on {rubric.offerDecision.hardFloorDimensions.join(", ")}</>
              )}
            </div>
          )}
        </CardSection>

        <p style={{ fontSize: "0.75rem", color: "var(--hp-soft-foreground)", textAlign: "center", margin: "0.5rem 0 0" }}>
          This is a standalone sample page, not linked from anywhere else in the app.
        </p>
      </div>
    </div>
  );
}
