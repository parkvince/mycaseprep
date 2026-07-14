"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingBlob from "@/components/FloatingBlob";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

const DEFAULT_SCORING_SCALE: Record<number, string> = {
  1: "Insufficient - Does not display basic command of the skill. Almost always disqualifying.",
  2: "Adequate - Below the hiring bar. Shows basics but not at the required level.",
  3: "Good - Meets the bar. Solid with minor areas for improvement.",
  4: "Very Good - Above the bar. Strong, differentiated performance.",
  5: "Exceptional - Rare. Partner-level clarity, precision, and insight.",
};

/** Safety net: normalize any em dash (—) that sneaks into data for display. */
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

function scoreColors(decision: string) {
  if (decision === "strong_offer" || decision === "offer") return { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" };
  if (decision === "borderline") return { color: "#b45309", bg: "#fffbeb", border: "#fde68a" };
  return { color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" };
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}
      style={{ background: "white", borderRadius: "20px", border: "1px solid var(--hp-border)", boxShadow: "var(--hp-shadow-card)", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      {children}
    </motion.div>
  );
}

function ScoreLadder({ criteria }: { criteria: Record<number, string> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      {Object.entries(criteria).reverse().map(([score, desc]) => (
        <div key={score} style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start", padding: "0.6rem 0.75rem", borderRadius: "10px", background: "var(--hp-bg)" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--hp-soft-foreground)", flexShrink: 0, minWidth: "14px" }}>{score}</span>
          <p style={{ fontSize: "0.8rem", color: "var(--hp-foreground)", lineHeight: 1.5, margin: 0 }}>{clean(desc as string)}</p>
        </div>
      ))}
    </div>
  );
}

interface RateThisEntry { response: string; score: number; reasoning: string }

function RateThisAnswer({ response, score, reasoning }: RateThisEntry) {
  const [guess, setGuess] = useState<number | null>(null);
  return (
    <div style={{ borderTop: "1px solid var(--hp-border)", paddingTop: "1.1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--hp-primary)" }}>
        Rate this answer
      </div>
      <p style={{ fontSize: "0.85rem", color: "var(--hp-foreground)", lineHeight: 1.6, margin: 0, background: "var(--hp-primary-soft)", borderRadius: "10px", padding: "0.85rem 1rem" }}>
        {response}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.8rem", color: "var(--hp-soft-foreground)" }}>What score does this get?</span>
        {[1, 2, 3, 4, 5].map(n => {
          const isGuess = guess === n;
          const revealed = guess !== null;
          const isActual = n === score;
          let bg = "white", border = "var(--hp-border)", color = "var(--hp-foreground)";
          if (revealed && isActual) { bg = "#f0fdf4"; border = "#16a34a"; color = "#15803d"; }
          else if (revealed && isGuess && !isActual) { bg = "#fef2f2"; border = "#dc2626"; color = "#b91c1c"; }
          return (
            <button
              key={n}
              onClick={() => setGuess(n)}
              disabled={revealed}
              style={{ width: "32px", height: "32px", borderRadius: "9999px", border: `1.5px solid ${border}`, background: bg, color, fontWeight: 700, fontSize: "0.85rem", cursor: revealed ? "default" : "pointer", fontFamily: FONT }}
            >
              {n}
            </button>
          );
        })}
      </div>
      {guess !== null && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: "0.82rem", color: guess === score ? "#15803d" : "var(--hp-soft-foreground)", lineHeight: 1.6, margin: 0 }}>
          <strong>{guess === score ? "Exactly right." : `Actually a ${score}.`}</strong> {reasoning}
        </motion.p>
      )}
    </div>
  );
}

interface FirmGuideTemplateProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rubric: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calculateOffer: (scores: Record<string, number>) => { decision: string; label: string; description: string; weightedScore: number };
  rateThis: Record<string, RateThisEntry>;
  blobLeft: string;
  blobRight: string;
}

export default function FirmGuideTemplate({ rubric, calculateOffer, rateThis, blobLeft, blobRight }: FirmGuideTemplateProps) {
  const dims = rubric.dimensions;
  const scoringScale: Record<number, string> = rubric.scoringScale ?? DEFAULT_SCORING_SCALE;

  const MODULE_LABELS = ["Overview", ...dims.map((d: { label: string }) => d.label), "Offer simulator", "Recap"];
  const TOTAL_STEPS = MODULE_LABELS.length;

  const [step, setStep] = useState(0);
  const initialSim: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dims.forEach((d: any) => { initialSim[d.key] = 3; });
  const [simScores, setSimScores] = useState<Record<string, number>>(initialSim);

  const goNext = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  const goBack = () => setStep(s => Math.max(s - 1, 0));
  const restart = () => { setStep(0); setSimScores(initialSim); };

  const simResult = calculateOffer(simScores);
  const simColors = scoreColors(simResult.decision);

  const dimStepStart = 1;
  const offerStepIndex = 1 + dims.length;
  const recapStepIndex = offerStepIndex + 1;
  const activeDim = step >= dimStepStart && step < offerStepIndex ? dims[step - dimStepStart] : null;

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
      position: "relative", zIndex: 0,
    }}>
      <FloatingBlob src={blobLeft} alt="" size={130} top="10%" left="4%" duration={7} rotate={-4} />
      <FloatingBlob src={blobRight} alt="" size={140} bottom="8%" right="5%" duration={8} delay={0.4} rotate={4} />

      <Navbar />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 2rem 5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/guide" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 600, color: "var(--hp-soft-foreground)", textDecoration: "none", marginBottom: "0.75rem" }}>
            <ArrowLeft size={14} /> Back to the guide
          </Link>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--hp-soft-foreground)", marginBottom: "0.5rem" }}>
            MyCasePrep · Firm deep dive
          </div>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--hp-foreground)", margin: 0 }}>
            {rubric.firmFullName}
          </h1>
        </motion.div>

        {/* Module stepper */}
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.7rem" }}>
            {MODULE_LABELS.map((label: string, i: number) => (
              <Fragment key={i}>
                <button
                  onClick={() => setStep(i)}
                  title={label}
                  style={{
                    width: "28px", height: "28px", borderRadius: "9999px", cursor: "pointer", padding: 0, flexShrink: 0,
                    display: "grid", placeItems: "center", fontSize: "0.72rem", fontWeight: 700, fontFamily: FONT,
                    border: `2px solid ${i <= step ? "var(--hp-primary)" : "var(--hp-border)"}`,
                    background: i <= step ? "var(--hp-primary)" : "white",
                    color: i <= step ? "white" : "var(--hp-soft-foreground)",
                    transition: "all 0.2s",
                  }}
                >
                  {i < step ? <CheckCircle2 size={13} /> : i + 1}
                </button>
                {i < MODULE_LABELS.length - 1 && (
                  <div style={{ flex: 1, height: "2px", margin: "0 2px", background: i < step ? "var(--hp-primary)" : "var(--hp-border)", transition: "background 0.2s" }} />
                )}
              </Fragment>
            ))}
          </div>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--hp-soft-foreground)" }}>
            Module {step + 1} of {TOTAL_STEPS} · {MODULE_LABELS[step]}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <div key={step}>

            {/* Module 0: Overview */}
            {step === 0 && (
              <Card>
                <div>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.4rem", color: "var(--hp-foreground)" }}>What {rubric.firmFullName} is grading</h2>
                  <p style={{ fontSize: "0.86rem", color: "var(--hp-soft-foreground)", lineHeight: 1.6, margin: 0 }}>
                    {clean(rubric.format)}. Every dimension below has its own module: the full 1-5 rubric, how to prepare, and a quick
                    drill where you rate a sample answer yourself. After that, an offer simulator lets you plug in scores and see
                    exactly how {rubric.firmFullName}&apos;s hard floors and disqualifiers actually decide an outcome.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 700, margin: "0 0 0.6rem", color: "var(--hp-foreground)" }}>The 1-5 scale</h3>
                  <ScoreLadder criteria={scoringScale} />
                </div>
              </Card>
            )}

            {/* Modules 1..N: one per dimension */}
            {activeDim && (
              <Card>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                  <h2 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "var(--hp-foreground)" }}>{activeDim.label}</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                    {activeDim.dealbreaker && (
                      <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: "9999px", fontFamily: FONT, background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>
                        Dealbreaker
                      </span>
                    )}
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--hp-primary)", background: "var(--hp-primary-soft)", borderRadius: "9999px", padding: "0.2rem 0.55rem" }}>
                      {activeDim.weight}% of score
                    </span>
                  </div>
                </div>

                <ScoreLadder criteria={activeDim.scoringCriteria} />

                {dimensionTips(activeDim).length > 0 && (
                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--hp-primary)", marginBottom: "0.5rem" }}>
                      How to prepare
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {dimensionTips(activeDim).map((t, ti) => (
                        <li key={ti} style={{ fontSize: "0.83rem", color: "var(--hp-soft-foreground)", lineHeight: 1.55 }}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rateThis[activeDim.key] && <RateThisAnswer {...rateThis[activeDim.key]} />}
              </Card>
            )}

            {/* Offer simulator */}
            {step === offerStepIndex && (
              <Card>
                <div>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.4rem", color: "var(--hp-foreground)" }}>Offer simulator</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--hp-soft-foreground)", lineHeight: 1.6, margin: 0 }}>
                    Set a score for each dimension and see how {rubric.firmFullName}&apos;s actual offer logic reacts, including hard floors and
                    automatic disqualifiers.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {dims.map((dim: any) => (
                    <div key={dim.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--hp-foreground)" }}>{dim.label}</span>
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        {[1, 2, 3, 4, 5].map(n => {
                          const selected = simScores[dim.key] === n;
                          return (
                            <button
                              key={n}
                              onClick={() => setSimScores(s => ({ ...s, [dim.key]: n }))}
                              style={{
                                width: "30px", height: "30px", borderRadius: "9999px", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem", fontFamily: FONT,
                                border: `1.5px solid ${selected ? "var(--hp-primary)" : "var(--hp-border)"}`,
                                background: selected ? "var(--hp-primary)" : "white",
                                color: selected ? "white" : "var(--hp-soft-foreground)",
                              }}
                            >
                              {n}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <motion.div
                  key={`${simResult.decision}-${simResult.weightedScore}`}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  style={{ borderRadius: "14px", padding: "1.1rem 1.25rem", background: simColors.bg, border: `1px solid ${simColors.border}` }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.95rem", fontWeight: 800, color: simColors.color }}>{simResult.label}</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: simColors.color }}>{simResult.weightedScore}/100</span>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: simColors.color, lineHeight: 1.6, margin: 0, opacity: 0.9 }}>{simResult.description}</p>
                </motion.div>
              </Card>
            )}

            {/* Recap */}
            {step === recapStepIndex && (
              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <img src="/homepage/new3-blob-thumbsup.png" alt="" style={{ width: "84px", height: "auto", flexShrink: 0 }} />
                  <div>
                    <h2 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 0.25rem", color: "var(--hp-foreground)" }}>You know {rubric.firmFullName}&apos;s bar</h2>
                    <p style={{ fontSize: "0.86rem", color: "var(--hp-soft-foreground)", lineHeight: 1.6, margin: 0 }}>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      Weight your prep toward {dims.slice().sort((a: any, b: any) => b.weight - a.weight)[0]?.label}, it carries the most weight here, then round out every other dimension.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button onClick={restart} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "var(--hp-primary)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: FONT, padding: 0 }}>
                    <RotateCcw size={15} /> Go through it again
                  </button>
                  <Link href="/guide" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--hp-soft-foreground)", textDecoration: "none" }}>
                    Back to the main guide →
                  </Link>
                </div>
              </Card>
            )}

          </div>
        </AnimatePresence>

        {/* Nav buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
          <button
            onClick={goBack}
            disabled={step === 0}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", height: "42px", padding: "0 1.1rem", borderRadius: "9999px", border: "1px solid var(--hp-border-strong)", background: "white", color: step === 0 ? "var(--hp-border-strong)" : "var(--hp-foreground)", fontSize: "0.85rem", fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer", fontFamily: FONT }}
          >
            <ArrowLeft size={15} /> Back
          </button>
          {step < TOTAL_STEPS - 1 && (
            <button
              onClick={goNext}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", height: "42px", padding: "0 1.25rem", borderRadius: "9999px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 3px 0 oklch(0.4 0.16 285)" }}
            >
              {step === 0 ? "Let's go" : "Next"} <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
