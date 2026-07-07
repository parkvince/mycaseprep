"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingBlob from "@/components/FloatingBlob";
import { MCKINSEY_RUBRIC, calculateMckinseyOffer } from "@/lib/firmRubrics/mckinsey";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

/** The rubric source data uses em dashes throughout; normalize them for display. */
function clean(text: string): string {
  return text.replace(/\s*—\s*/g, " - ");
}

const PREP_TIPS: Record<string, string[]> = {
  structure: [
    "Lead with a hypothesis-driven framework tailored to the specific case, not a memorized template.",
    "Keep every branch MECE: no overlapping buckets, no gaps.",
    "State the structure out loud before diving into any single branch.",
  ],
  quantitative: [
    "Narrate your setup before you calculate. McKinsey grades the logic, not just the final number.",
    "Sanity-check anything that looks too clean or too extreme.",
    "Drill mental math so basic arithmetic never slows down your thinking mid-case.",
  ],
  businessJudgment: [
    "Go past the obvious driver and ask what the second-order implication is.",
    "Tie every insight back to a decision the client would actually make.",
  ],
  communication: [
    "Answer-first, then support: state your conclusion before your reasoning.",
    "Signpost explicitly, e.g. \"there are three factors here\", so the interviewer can follow with no effort.",
  ],
  hypothesisManagement: [
    "Form a hypothesis in the first couple of minutes and say it out loud.",
    "Update it visibly when new data contradicts it. Don't quietly abandon it.",
  ],
  synthesis: [
    "Give one clear recommendation, not three hedged options.",
    "Name the biggest risk and how you'd de-risk it.",
    "Tie the recommendation back to the original objective.",
  ],
};

/** One illustrative candidate response per dimension, for the "rate this answer" drill. */
const RATE_THIS: Record<string, { response: string; score: number; reasoning: string }> = {
  structure: {
    response: "\"I'd break this into three areas: revenue, costs, and market factors. Let's start with revenue and look at pricing and volume.\"",
    score: 2,
    reasoning: "Generic buckets with no adaptation to this specific case, and \"market factors\" overlaps with both revenue and costs. Not MECE.",
  },
  quantitative: {
    response: "\"If volume is 10,000 units at $50 average price, revenue is $500,000. Cost per unit is $30, so profit per unit is $20, total profit $200,000. That's a 40% margin, which is plausible for this industry.\"",
    score: 4,
    reasoning: "Clean setup, narrated clearly, and sanity-checked at the end. Not a 5 since it doesn't surface a non-obvious insight beyond the arithmetic.",
  },
  businessJudgment: {
    response: "\"Revenue is down because of the price cut. We should just raise prices back up.\"",
    score: 2,
    reasoning: "Surface-level. Doesn't ask why the price was cut in the first place, or what raising it back up would do to volume or competitors.",
  },
  communication: {
    response: "\"So there's a lot going on here, costs went up a bit, and revenue is kind of flat, and there might be some seasonality, but I think if you look at everything together the main issue is probably cost, but it's hard to say.\"",
    score: 2,
    reasoning: "The conclusion is buried at the end of a run-on sentence with no signposting. An interviewer has to work to find the point.",
  },
  hypothesisManagement: {
    response: "\"My hypothesis is that the profit decline is driven by rising input costs, not falling demand. Let's test that by looking at the cost data first.\"",
    score: 4,
    reasoning: "A clear, upfront hypothesis that directly guides the next analytical step. Not a 5 without seeing it survive, or get updated by, contradicting data.",
  },
  synthesis: {
    response: "\"So overall, I'd say maybe consider looking at costs, though revenue could also be a factor. Hard to say for sure without more data.\"",
    score: 1,
    reasoning: "No recommendation at all, just a shrug. Heavily hedged with nothing for the client to act on.",
  },
};

const SHORT_LABELS: Record<string, string> = {
  structure: "Structure",
  quantitative: "Quant",
  businessJudgment: "Judgment",
  communication: "Communication",
  hypothesisManagement: "Hypothesis",
  synthesis: "Synthesis",
};

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
          <p style={{ fontSize: "0.8rem", color: "var(--hp-foreground)", lineHeight: 1.5, margin: 0 }}>{clean(desc)}</p>
        </div>
      ))}
    </div>
  );
}

function RateThisAnswer({ response, score, reasoning }: { response: string; score: number; reasoning: string }) {
  const [guess, setGuess] = useState<number | null>(null);
  return (
    <div style={{ borderTop: "1px solid var(--hp-border)", paddingTop: "1.1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--hp-primary)" }}>
        Rate this answer
      </div>
      <p style={{ fontSize: "0.85rem", color: "var(--hp-foreground)", lineHeight: 1.6, margin: 0, background: "var(--hp-primary-soft)", borderRadius: "10px", padding: "0.85rem 1rem" }}>
        {response}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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

export default function McKinseyGuidePage() {
  const rubric = MCKINSEY_RUBRIC;
  const dims = rubric.dimensions;

  const MODULE_LABELS = ["Overview", ...dims.map(d => SHORT_LABELS[d.key] ?? d.label), "Offer simulator", "Recap"];
  const TOTAL_STEPS = MODULE_LABELS.length;

  const [step, setStep] = useState(0);
  const initialSim: Record<string, number> = {};
  dims.forEach(d => { initialSim[d.key] = 3; });
  const [simScores, setSimScores] = useState<Record<string, number>>(initialSim);

  const goNext = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  const goBack = () => setStep(s => Math.max(s - 1, 0));
  const restart = () => { setStep(0); setSimScores(initialSim); };

  const simResult = calculateMckinseyOffer(simScores);
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
      <FloatingBlob src="/homepage/new3-blob-puzzle.png" alt="" size={130} top="10%" left="4%" duration={7} rotate={-4} />
      <FloatingBlob src="/homepage/new3-blob-reading.png" alt="" size={140} bottom="8%" right="5%" duration={8} delay={0.4} rotate={4} />

      <Navbar />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 2rem 5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/guide" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 600, color: "var(--hp-soft-foreground)", textDecoration: "none", marginBottom: "0.75rem" }}>
            <ArrowLeft size={14} /> Back to the guide
          </Link>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--hp-soft-foreground)", marginBottom: "0.5rem" }}>
            MyCasePrep · Firm deep dive · Prototype
          </div>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--hp-foreground)", margin: 0 }}>
            {rubric.firmFullName}
          </h1>
        </motion.div>

        {/* Module stepper */}
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.7rem" }}>
            {MODULE_LABELS.map((label, i) => (
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
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.4rem", color: "var(--hp-foreground)" }}>What McKinsey is grading</h2>
                  <p style={{ fontSize: "0.86rem", color: "var(--hp-soft-foreground)", lineHeight: 1.6, margin: 0 }}>
                    {clean(rubric.format)}. Every dimension below has its own module: the full 1-5 rubric, how to prepare, and a quick
                    drill where you rate a sample answer yourself. After that, an offer simulator lets you plug in scores and see
                    exactly how McKinsey's hard floors and disqualifiers actually decide an outcome.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 700, margin: "0 0 0.6rem", color: "var(--hp-foreground)" }}>The 1-5 scale</h3>
                  <ScoreLadder criteria={rubric.scoringScale as Record<number, string>} />
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

                <ScoreLadder criteria={activeDim.scoringCriteria as Record<number, string>} />

                {PREP_TIPS[activeDim.key] && (
                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--hp-primary)", marginBottom: "0.5rem" }}>
                      How to prepare
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {PREP_TIPS[activeDim.key].map((t, ti) => (
                        <li key={ti} style={{ fontSize: "0.83rem", color: "var(--hp-soft-foreground)", lineHeight: 1.55 }}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {RATE_THIS[activeDim.key] && <RateThisAnswer {...RATE_THIS[activeDim.key]} />}
              </Card>
            )}

            {/* Offer simulator */}
            {step === offerStepIndex && (
              <Card>
                <div>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.4rem", color: "var(--hp-foreground)" }}>Offer simulator</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--hp-soft-foreground)", lineHeight: 1.6, margin: 0 }}>
                    Set a score for each dimension and see how McKinsey's actual offer logic reacts, including hard floors and
                    automatic disqualifiers.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {dims.map(dim => (
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
                    <h2 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 0.25rem", color: "var(--hp-foreground)" }}>You know McKinsey's bar</h2>
                    <p style={{ fontSize: "0.86rem", color: "var(--hp-soft-foreground)", lineHeight: 1.6, margin: 0 }}>
                      Structure and quantitative reasoning are hard floors. Nail those first, then layer in judgment,
                      communication, hypothesis-driven thinking, and a confident synthesis.
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

        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--hp-soft-foreground)", textAlign: "center", background: "white", border: "1px solid var(--hp-border)", borderRadius: "9999px", padding: "0.4rem 0.9rem" }}>
            Prototype for one firm &middot; the plan is to build this same module format for every firm in the guide
          </span>
        </div>
      </div>
    </div>
  );
}
