"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, ChevronDown, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingBlob from "@/components/FloatingBlob";
import Term from "@/components/Term";

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
const FIRMS: { label: string; slug: string; rubric: any }[] = [
  { label: "McKinsey & Company", slug: "mckinsey", rubric: MCKINSEY_RUBRIC },
  { label: "BCG", slug: "bcg", rubric: BCG_RUBRIC },
  { label: "Bain & Company", slug: "bain", rubric: BAIN_RUBRIC },
  { label: "EY-Parthenon", slug: "ey-parthenon", rubric: EY_PARTHENON_RUBRIC },
  { label: "Deloitte", slug: "deloitte", rubric: DELOITTE_RUBRIC },
  { label: "KPMG", slug: "kpmg", rubric: KPMG_RUBRIC },
  { label: "PwC Strategy&", slug: "pwc", rubric: PWC_RUBRIC },
  { label: "Roland Berger", slug: "roland-berger", rubric: ROLAND_BERGER_RUBRIC },
  { label: "Accenture", slug: "accenture", rubric: ACCENTURE_RUBRIC },
  { label: "Oliver Wyman", slug: "oliver-wyman", rubric: OLIVER_WYMAN_RUBRIC },
  { label: "Kearney", slug: "kearney", rubric: KEARNEY_RUBRIC },
  { label: "L.E.K. Consulting", slug: "lek", rubric: LEK_RUBRIC },
  { label: "Monitor Deloitte", slug: "monitor-deloitte", rubric: MONITOR_DELOITTE_RUBRIC },
  { label: "IBM Consulting", slug: "ibm", rubric: IBM_RUBRIC },
  { label: "Huron Consulting", slug: "huron", rubric: HURON_RUBRIC },
  { label: "Capital One", slug: "capital-one", rubric: CAPITAL_ONE_RUBRIC },
];

const FRAMEWORK = [
  {
    title: "Clarify",
    blurb: "Make sure you're solving the right problem before you solve anything.",
    tips: [
      "Restate the objective in your own words and confirm it out loud.",
      "Ask 1-2 sharp clarifying questions, not a long list of them.",
      "Confirm the timeframe, the client's goal, and how success is measured.",
    ],
  },
  {
    title: "Structure",
    blurb: "Build a framework that's actually shaped like this case, not a memorized template.",
    tips: [
      "Keep it MECE: no overlaps, no gaps in the buckets you lay out.",
      "Say your structure out loud before you dive into any single branch.",
      "Form an early hypothesis about which branch matters most, and start there.",
    ],
  },
  {
    title: "Analyze",
    blurb: "This is where most of the real work, and most of the scoring, happens.",
    tips: [
      "Narrate your math as you go: state the setup before you calculate.",
      "Sanity-check results that seem too high, too low, or too convenient.",
      "Pull business insight out of the numbers, don't just report them.",
    ],
  },
  {
    title: "Synthesize",
    blurb: "Land the plane. A great analysis with a weak ending still reads as weak.",
    tips: [
      "Lead with the bottom line, then back it up, not the other way around.",
      "Give a specific recommendation, not a hedge.",
      "Name the key risk and a sensible next step.",
    ],
  },
];

const CHECKLIST = [
  "Clarify the objective before you structure anything.",
  "Build a MECE, case-specific framework, not a generic template.",
  "Say your hypothesis out loud, and update it as new data comes in.",
  "Narrate your math as you go instead of going quiet and calculating.",
  "Lead with the bottom line, then support it.",
  "Always close with a recommendation, a risk, and a next step.",
];

const QUIZ = {
  prompt: "Your client is a mid-size airline. Revenue has stayed flat, but profit dropped 20% last year. What's your first move?",
  options: [
    {
      text: "Ask whether the drop is driven by costs, revenue mix, or a one-time event, then propose structuring the case around a profit framework.",
      correct: true,
      feedback: "Exactly. You confirmed what's actually driving the gap before committing to a structure, instead of guessing.",
    },
    {
      text: "Start estimating the total size of the airline market.",
      correct: false,
      feedback: "Not quite. Market sizing doesn't help you here. Profit dropped with flat revenue, meaning the story is almost certainly on the cost or mix side. That's what to clarify first.",
    },
    {
      text: "Recommend across-the-board cost cuts to restore margin.",
      correct: false,
      feedback: "Too early. You haven't looked at a single number yet. Jumping to a recommendation before any analysis is one of the fastest ways to lose an interviewer's confidence.",
    },
    {
      text: "Ask how many employees the airline has.",
      correct: false,
      feedback: "It's a fair data point eventually, but it doesn't drive your structure. Lead with a question that shapes how you'll break down the problem.",
    },
  ],
};

const OPTION_LETTERS = ["A", "B", "C", "D"];

/** Safety net: normalize any em dash (—) that sneaks into data for display. */
function clean(text: string): string {
  return text.replace(/\s*—\s*/g, " - ");
}

const GLOSSARY: { term: RegExp; define: string }[] = [
  { term: /\bMECE\b/gi, define: "Mutually Exclusive, Collectively Exhaustive - your buckets don't overlap, and together they cover the whole problem. It's the test for whether a framework is actually well-structured." },
  { term: /\bhypothesis(?:-driven|-led)?\b/gi, define: "Your best guess at the answer, formed early and tested with data - instead of gathering everything before you have an opinion." },
  { term: /\bbottom[- ]line[- ]first\b/gi, define: "Leading with your conclusion, then explaining how you got there - not building up to it at the end." },
];

/** Wraps known jargon terms in an inline hover/tap definition so a first-timer
 * isn't stuck guessing what "MECE" means mid-sentence. */
function withTerms(text: string): React.ReactNode {
  let parts: React.ReactNode[] = [text];
  GLOSSARY.forEach(({ term, define }, gi) => {
    const next: React.ReactNode[] = [];
    parts.forEach((part, pi) => {
      if (typeof part !== "string") { next.push(part); return; }
      const matches = part.match(term) ?? [];
      const pieces = part.split(term);
      pieces.forEach((piece, i) => {
        if (piece) next.push(piece);
        if (i < matches.length) next.push(<Term key={`${gi}-${pi}-${i}`} define={define}>{matches[i]}</Term>);
      });
    });
    parts = next;
  });
  return parts;
}

// Resolves internal dimension keys (e.g. "structure") to their human labels and
// joins them into a readable, grammatical list so the offer-threshold line reads
// as a complete sentence rather than a truncated list of raw keys.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatDimensionList(keys: string[], dimensions: any[]): string {
  const labels = keys.map(k => {
    const dim = dimensions.find(d => d.key === k);
    return dim ? clean(dim.label) : k;
  });
  if (labels.length <= 1) return labels[0] ?? "";
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
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

const STEP_LABELS = ["Welcome", "The framework", "Quick tips", "Try it yourself", "Your firm's rubric", "You're ready"];
const TOTAL_STEPS = STEP_LABELS.length;

export default function GuidePage() {
  const [step, setStep] = useState(0);
  const [openStage, setOpenStage] = useState<number | null>(0);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [checklistLoaded, setChecklistLoaded] = useState(false);
  const [quizPick, setQuizPick] = useState<number | null>(null);
  const [firmIndex, setFirmIndex] = useState(0);

  // Persist checklist progress across visits - it's your own personal prep tracker.
  useEffect(() => {
    const raw = localStorage.getItem("mycaseprep_guide_checklist");
    if (raw) {
      try { setChecked(JSON.parse(raw)); } catch {}
    }
    setChecklistLoaded(true);
    // Having been here at all is enough to stop nudging from the dashboard banner.
    localStorage.setItem("mycaseprep_guide_visited", "1");
  }, []);
  useEffect(() => {
    if (!checklistLoaded) return;
    localStorage.setItem("mycaseprep_guide_checklist", JSON.stringify(checked));
  }, [checked, checklistLoaded]);

  const firm = FIRMS[firmIndex];
  const rubric = firm.rubric;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dimensions: any[] = rubric.dimensions ?? [];
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allChecked = checkedCount === CHECKLIST.length;

  const filterPill = (active: boolean): React.CSSProperties => ({
    padding: "0.35rem 0.9rem",
    borderRadius: "9999px",
    border: `1.5px solid ${active ? "var(--hp-primary)" : "var(--hp-border)"}`,
    background: active ? "var(--hp-primary)" : "white",
    color: active ? "white" : "var(--hp-soft-foreground)",
    fontSize: "0.8rem", fontWeight: 600,
    cursor: "pointer", fontFamily: FONT, transition: "all 0.15s",
  });

  const goNext = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  const goBack = () => setStep(s => Math.max(s - 1, 0));
  const restart = () => { setStep(0); setOpenStage(0); setChecked({}); setQuizPick(null); };

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
      <FloatingBlob src="/homepage/new2-blob-icecream.png" alt="" size={130} top="10%" left="4%" duration={7} rotate={-5} />
      <FloatingBlob src="/homepage/new3-blob-juggling.png" alt="" size={150} top="30%" right="5%" duration={8} delay={0.5} rotate={5} />
      <FloatingBlob src="/homepage/new2-blob-tricycle.png" alt="" size={140} bottom="20%" left="5%" duration={7.5} delay={0.3} rotate={-4} />
      <FloatingBlob src="/homepage/new3-blob-planting.png" alt="" size={130} bottom="6%" right="6%" duration={6.5} delay={0.9} rotate={4} />

      <Navbar />

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 2rem 5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--hp-soft-foreground)", marginBottom: "0.5rem" }}>
            MyCasePrep · Sample guide
          </div>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--hp-foreground)", margin: 0 }}>
            Case interview prep guide
          </h1>
        </motion.div>

        {/* Step progress */}
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.7rem" }}>
            {STEP_LABELS.map((label, i) => (
              <Fragment key={label}>
                <button
                  onClick={() => setStep(i)}
                  title={label}
                  style={{
                    width: "30px", height: "30px", borderRadius: "9999px", cursor: "pointer", padding: 0, flexShrink: 0,
                    display: "grid", placeItems: "center", fontSize: "0.78rem", fontWeight: 700, fontFamily: FONT,
                    border: `2px solid ${i <= step ? "var(--hp-primary)" : "var(--hp-border)"}`,
                    background: i <= step ? "var(--hp-primary)" : "white",
                    color: i <= step ? "white" : "var(--hp-soft-foreground)",
                    transition: "all 0.2s",
                  }}
                >
                  {i < step ? <CheckCircle2 size={15} /> : i + 1}
                </button>
                {i < STEP_LABELS.length - 1 && (
                  <div style={{ flex: 1, height: "2px", margin: "0 2px", background: i < step ? "var(--hp-primary)" : "var(--hp-border)", transition: "background 0.2s" }} />
                )}
              </Fragment>
            ))}
          </div>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--hp-soft-foreground)" }}>
            Step {step + 1} of {TOTAL_STEPS} · {STEP_LABELS[step]}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <div key={step}>
            {/* Step 0: Welcome */}
            {step === 0 && (
              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <img src="/homepage/new3-blob-thumbsup.png" alt="" style={{ width: "84px", height: "auto", flexShrink: 0 }} />
                  <div>
                    <h2 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 0.25rem", color: "var(--hp-foreground)" }}>Let's get you ready</h2>
                    <p style={{ fontSize: "0.86rem", color: "var(--hp-soft-foreground)", lineHeight: 1.6, margin: 0 }}>
                      A case interview is a structured conversation where you solve a real business problem out loud.
                      Most firms run them interviewer-led: they steer, feed you data, and grade how you think.
                    </p>
                  </div>
                </div>
                <div style={{ background: "var(--hp-primary-soft)", borderRadius: "14px", padding: "1rem 1.25rem" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--hp-primary)", marginBottom: "0.5rem" }}>
                    This guide walks through
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {STEP_LABELS.slice(1).map(label => (
                      <li key={label} style={{ fontSize: "0.85rem", color: "var(--hp-foreground)" }}>{label}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

            {/* Step 1: Framework accordion */}
            {step === 1 && (
              <Card>
                <div>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.25rem", color: "var(--hp-foreground)" }}>The four-part framework</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--hp-soft-foreground)", margin: 0 }}>Tap each stage to open it up.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {FRAMEWORK.map((stage, i) => {
                    const isOpen = openStage === i;
                    return (
                      <div key={stage.title} style={{ border: `1.5px solid ${isOpen ? "var(--hp-primary)" : "var(--hp-border)"}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.15s" }}>
                        <button
                          onClick={() => setOpenStage(isOpen ? null : i)}
                          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1.1rem", background: isOpen ? "var(--hp-primary-soft)" : "white", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ width: "24px", height: "24px", borderRadius: "9999px", background: isOpen ? "var(--hp-primary)" : "var(--hp-border)", color: isOpen ? "white" : "var(--hp-soft-foreground)", display: "grid", placeItems: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
                              {i + 1}
                            </span>
                            <div>
                              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--hp-foreground)" }}>{stage.title}</div>
                              <div style={{ fontSize: "0.76rem", color: "var(--hp-soft-foreground)" }}>{stage.blurb}</div>
                            </div>
                          </div>
                          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} style={{ color: "var(--hp-soft-foreground)", flexShrink: 0 }}>
                            <ChevronDown size={16} />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
                              <ul style={{ margin: 0, padding: "0.9rem 1.1rem 1.1rem 2.6rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                {stage.tips.map((t, ti) => (
                                  <li key={ti} style={{ fontSize: "0.82rem", color: "var(--hp-foreground)", lineHeight: 1.55 }}>{withTerms(t)}</li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Step 2: Checklist */}
            {step === 2 && (
              <Card>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "var(--hp-foreground)" }}>Quick tips</h2>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--hp-primary)" }}>{checkedCount}/{CHECKLIST.length} checked</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {CHECKLIST.map((tip, i) => {
                    const isChecked = !!checked[i];
                    return (
                      <button
                        key={i}
                        onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
                        style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", padding: "0.75rem 0.9rem", borderRadius: "10px", border: `1.5px solid ${isChecked ? "var(--hp-primary)" : "var(--hp-border)"}`, background: isChecked ? "var(--hp-primary-soft)" : "white", cursor: "pointer", textAlign: "left", fontFamily: FONT, transition: "all 0.15s" }}
                      >
                        {isChecked ? <CheckCircle2 size={18} color="var(--hp-primary)" style={{ flexShrink: 0, marginTop: "1px" }} /> : <Circle size={18} color="var(--hp-border-strong)" style={{ flexShrink: 0, marginTop: "1px" }} />}
                        <span style={{ fontSize: "0.85rem", color: "var(--hp-foreground)", lineHeight: 1.5, textDecoration: isChecked ? "line-through" : "none", opacity: isChecked ? 0.6 : 1 }}>{withTerms(tip)}</span>
                      </button>
                    );
                  })}
                </div>
                {allChecked && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "0.75rem 0.9rem" }}>
                    <CheckCircle2 size={18} color="#15803d" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "0.83rem", color: "#15803d", fontWeight: 600 }}>
                      All six checked off. This is saved, it'll still be checked next time you're back here.
                    </span>
                  </motion.div>
                )}
              </Card>
            )}

            {/* Step 3: Quiz */}
            {step === 3 && (
              <Card>
                <div>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.5rem", color: "var(--hp-foreground)" }}>Try it yourself</h2>
                  <p style={{ fontSize: "0.88rem", color: "var(--hp-foreground)", lineHeight: 1.6, margin: 0, background: "var(--hp-bg)", border: "1px solid var(--hp-border)", borderRadius: "10px", padding: "0.9rem 1.1rem" }}>
                    {QUIZ.prompt}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {QUIZ.options.map((opt, i) => {
                    const picked = quizPick === i;
                    const showState = quizPick !== null;
                    const isRight = opt.correct;
                    const borderColor = showState
                      ? (isRight ? "#16a34a" : picked ? "#dc2626" : "var(--hp-border)")
                      : "var(--hp-border)";
                    const bg = showState
                      ? (isRight ? "#f0fdf4" : picked ? "#fef2f2" : "white")
                      : "white";
                    return (
                      <div key={i}>
                        <button
                          onClick={() => setQuizPick(i)}
                          disabled={showState}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.7rem", textAlign: "left", padding: "0.8rem 1rem", borderRadius: "10px", border: `1.5px solid ${borderColor}`, background: bg, cursor: showState ? "default" : "pointer", fontFamily: FONT, fontSize: "0.85rem", color: "var(--hp-foreground)", lineHeight: 1.5, transition: "border-color 0.15s, background 0.15s" }}
                        >
                          <span style={{
                            width: "24px", height: "24px", borderRadius: "9999px", flexShrink: 0, display: "grid", placeItems: "center",
                            fontSize: "0.75rem", fontWeight: 700,
                            background: showState ? (isRight ? "#16a34a" : picked ? "#dc2626" : "var(--hp-border)") : "var(--hp-primary-soft)",
                            color: showState ? (isRight || picked ? "white" : "var(--hp-soft-foreground)") : "var(--hp-primary)",
                          }}>
                            {showState && isRight ? "✓" : showState && picked ? "✕" : OPTION_LETTERS[i]}
                          </span>
                          {opt.text}
                        </button>
                        {picked && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                            style={{ fontSize: "0.8rem", color: isRight ? "#15803d" : "#b91c1c", lineHeight: 1.55, margin: "0.4rem 0 0", padding: "0 0.25rem" }}>
                            {opt.feedback}
                          </motion.p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {quizPick !== null && (
                  <button onClick={() => setQuizPick(null)} style={{ alignSelf: "flex-start", background: "none", border: "none", color: "var(--hp-primary)", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: FONT, padding: 0 }}>
                    Try a different answer
                  </button>
                )}
              </Card>
            )}

            {/* Step 4: Firm rubric */}
            {step === 4 && (
              <Card>
                <div>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.25rem", color: "var(--hp-foreground)" }}>Your firm's rubric</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--hp-soft-foreground)", margin: 0 }}>Every firm weighs these dimensions differently. Pick one to see exactly how they grade.</p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {FIRMS.map((f, i) => (
                    <button key={f.label} style={filterPill(i === firmIndex)} onClick={() => setFirmIndex(i)}>
                      {f.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                    <div>
                      <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--hp-foreground)" }}>{rubric.firmFullName ?? firm.label}</div>
                      {rubric.format && <p style={{ fontSize: "0.8rem", color: "var(--hp-soft-foreground)", margin: "0.2rem 0 0", lineHeight: 1.6 }}>{clean(rubric.format)}</p>}
                    </div>
                    <Link href={`/guide/${firm.slug}`} style={{ flexShrink: 0, fontSize: "0.78rem", fontWeight: 700, color: "var(--hp-primary)", textDecoration: "none", whiteSpace: "nowrap" }}>
                      Full deep dive →
                    </Link>
                  </div>

                  {dimensions.map((dim, i) => {
                    const tips = dimensionTips(dim);
                    return (
                      <div key={dim.key} style={{ borderTop: i === 0 ? "none" : "1px solid var(--hp-border)", paddingTop: i === 0 ? 0 : "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.4rem" }}>
                          <span style={{ fontSize: "0.87rem", fontWeight: 700, color: "var(--hp-foreground)" }}>{clean(dim.label)}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                            {dim.dealbreaker && (
                              <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: "9999px", fontFamily: FONT, background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>
                                Dealbreaker
                              </span>
                            )}
                            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--hp-primary)", background: "var(--hp-primary-soft)", borderRadius: "9999px", padding: "0.2rem 0.55rem" }}>
                              {dim.weight}%
                            </span>
                          </div>
                        </div>
                        {tips.length > 0 && (
                          <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                            {tips.map((t, ti) => (
                              <li key={ti} style={{ fontSize: "0.8rem", color: "var(--hp-soft-foreground)", lineHeight: 1.5 }}>{withTerms(t)}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}

                  {rubric.offerDecision?.offerThreshold && (
                    <div style={{ borderTop: "1px solid var(--hp-border)", paddingTop: "1rem", fontSize: "0.76rem", color: "var(--hp-soft-foreground)" }}>
                      Offer threshold: a weighted score of {rubric.offerDecision.offerThreshold} or higher
                      {rubric.offerDecision.hardFloorDimensions?.length > 0 && (
                        <>, with a hard floor of {rubric.offerDecision.hardFloorScore} out of 5 on {formatDimensionList(rubric.offerDecision.hardFloorDimensions, dimensions)}</>
                      )}
                      .
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Step 5: Done */}
            {step === 5 && (
              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <img src="/homepage/new3-blob-birthday.png" alt="" style={{ width: "84px", height: "auto", flexShrink: 0 }} />
                  <div>
                    <h2 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 0.25rem", color: "var(--hp-foreground)" }}>You're ready to practice</h2>
                    <p style={{ fontSize: "0.86rem", color: "var(--hp-soft-foreground)", lineHeight: 1.6, margin: 0 }}>
                      Clarify, structure, analyze, synthesize. That's it, that's the whole game, over and over.
                    </p>
                  </div>
                </div>
                <div style={{ background: "var(--hp-primary-soft)", borderRadius: "14px", padding: "1rem 1.25rem" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--hp-primary)", marginBottom: "0.5rem" }}>
                    Before your next case, remember
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {CHECKLIST.map(tip => (
                      <li key={tip} style={{ fontSize: "0.85rem", color: "var(--hp-foreground)" }}>{withTerms(tip)}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
                  <Link href="/dashboard"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", height: "44px", padding: "0 1.4rem", borderRadius: "9999px", border: "none", background: "var(--hp-primary)", color: "white", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", fontFamily: FONT, boxShadow: "0 3px 0 oklch(0.4 0.16 285)" }}
                  >
                    Start practicing <ArrowRight size={16} />
                  </Link>
                  <Link href="/library"
                    style={{ display: "inline-flex", alignItems: "center", height: "44px", padding: "0 1.25rem", borderRadius: "9999px", border: "1px solid var(--hp-border-strong)", background: "white", color: "var(--hp-foreground)", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", fontFamily: FONT }}
                  >
                    Browse the library
                  </Link>
                </div>
                <button
                  onClick={restart}
                  style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "var(--hp-soft-foreground)", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: FONT, padding: 0 }}
                >
                  <RotateCcw size={14} /> Go through it again
                </button>
              </Card>
            )}

          </div>
        </AnimatePresence>

        {/* Nav buttons - sticky to the bottom of the viewport so "Next" stays in a
            fixed, predictable spot. Previously it sat in normal flow below the step
            content, so expanding an accordion pushed it down and users clicked an
            accordion where Next used to be. */}
        <div style={{ position: "sticky", bottom: 0, zIndex: 5, marginTop: "0.5rem" }}>
          {/* Frosted backdrop rather than a solid fill: the page background is a
              multi-colour pastel gradient, so any fixed colour here (it used to be
              --hp-bg cream) shows up as a mismatched band. Blur adapts to whatever
              is behind it, and the mask fades the top edge so there's no hard seam. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute", left: 0, right: 0, top: "-1.75rem", bottom: 0,
              backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
              maskImage: "linear-gradient(to top, #000 62%, transparent)",
              WebkitMaskImage: "linear-gradient(to top, #000 62%, transparent)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", gap: "0.75rem", padding: "0.75rem 0 1rem" }}>
            <button
              onClick={goBack}
              disabled={step === 0}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", height: "42px", padding: "0 1.1rem", borderRadius: "9999px", border: "1px solid var(--hp-border-strong)", background: "white", color: step === 0 ? "var(--hp-border-strong)" : "var(--hp-foreground)", fontSize: "0.85rem", fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer", fontFamily: FONT, boxShadow: "0 2px 8px oklch(0.4 0.05 280 / 10%)" }}
            >
              <ArrowLeft size={15} /> Back
            </button>
            {step < TOTAL_STEPS - 1 && (
              <button
                onClick={goNext}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", height: "42px", padding: "0 1.25rem", borderRadius: "9999px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 3px 0 oklch(0.34 0.16 285)" }}
              >
                {step === 0 ? "Let's go" : "Next"} <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
