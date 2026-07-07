"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { FirmKey, Difficulty, Evaluation } from "@/types";
import { formatScore, formatScoreColor, formatDuration } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ArrowRight, Clock } from "lucide-react";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

const FIRM_SHORT: Record<string, string> = {
  mckinsey: "McKinsey", bain: "Bain", bcg: "BCG", ey: "EY-Parthenon",
  deloitte: "Deloitte", kpmg: "KPMG", pwc: "PwC", rolandberger: "Roland Berger",
  accenture: "Accenture", "oliver-wyman": "Oliver Wyman", kearney: "Kearney",
  lek: "L.E.K.", "monitor-deloitte": "Monitor Deloitte", ibm: "IBM",
  "capital-one": "Capital One", huron: "Huron",
};

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string | Date;
}

function scoreColor5(s: number) {
  if (s >= 4.5) return "#15803d";
  if (s >= 3.5) return "#65a30d";
  if (s >= 2.5) return "#d97706";
  if (s >= 1.5) return "#ea580c";
  return "#dc2626";
}

function scoreLabel5(s: number) {
  if (s >= 5) return "Exceptional";
  if (s >= 4) return "Very good";
  if (s >= 3) return "Good";
  if (s >= 2) return "Adequate";
  return "Insufficient";
}

function offerColor(d: string) {
  if (d === "strong_offer" || d === "offer") return "#15803d";
  if (d === "borderline") return "#d97706";
  return "#dc2626";
}

function offerBg(d: string) {
  if (d === "strong_offer" || d === "offer") return "#f0fdf4";
  if (d === "borderline") return "#fffbeb";
  return "#fef2f2";
}

function offerBorder(d: string) {
  if (d === "strong_offer" || d === "offer") return "#bbf7d0";
  if (d === "borderline") return "#fde68a";
  return "#fecaca";
}

function FeedbackInner() {
  const router = useRouter();

  const [firm, setFirm] = useState<FirmKey>("mckinsey");
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [transcriptRaw, setTranscriptRaw] = useState("[]");
  const [caseTitle, setCaseTitle] = useState("Case Interview");
  const [aiProvider, setAiProvider] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "breakdown" | "ideal" | "transcript">("overview");

  useEffect(() => {
    const raw = sessionStorage.getItem("transcriptData");
    if (raw) {
      const data = JSON.parse(raw);
      setFirm(data.firm ?? "mckinsey");
      setDifficulty(data.difficulty ?? "intermediate");
      setHintsUsed(data.hintsUsed ?? 0);
      setDuration(data.duration ?? 0);
      const t = data.transcript ?? [];
      setTranscriptRaw(JSON.stringify(t));
      setTranscript(t);
      setCaseTitle(data.caseTitle ?? "Case Interview");
      setAiProvider(data.aiProvider ?? null);
    } else {
      setLoading(false);
    }
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    document.title = `Feedback: ${caseTitle} · MyCasePrep`;
  }, [caseTitle]);

  useEffect(() => {
    if (!dataLoaded || transcriptRaw === "[]") return;
    const evaluate = async () => {
      try {
        const t = JSON.parse(transcriptRaw);
        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firm, difficulty, hintsUsed, transcript: t, preferredProvider: aiProvider }),
        });
        const data = await res.json();
        setEvaluation(data);
        await fetch("/api/sessions/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "ai", firm, difficulty, caseTitle, duration, hintsUsed, overallScore: data.overallScore, transcript: t }),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    evaluate();
  }, [dataLoaded, transcriptRaw, firm, difficulty, hintsUsed, caseTitle, duration, aiProvider]);

  const firmConfig = FIRM_CONFIGS[firm];

  const firmBreakdownItems =
    firm === "mckinsey" ? [
      { label: "Problem structuring", key: "structure", weight: 28 },
      { label: "Quantitative reasoning", key: "quantitative", weight: 22 },
      { label: "Business judgment", key: "businessJudgment", weight: 18 },
      { label: "Communication", key: "communication", weight: 17 },
      { label: "Hypothesis management", key: "hypothesisManagement", weight: 10 },
      { label: "Synthesis", key: "synthesis", weight: 5 },
    ] : firm === "bcg" ? [
      { label: "Case leadership & drive", key: "candidateLed", weight: 23 },
      { label: "Problem structuring", key: "structure", weight: 20 },
      { label: "Analytical & quant skills", key: "quantitative", weight: 22 },
      { label: "Creativity & original thinking", key: "creativity", weight: 18 },
      { label: "Communication style", key: "communication", weight: 17 },
    ] : firm === "bain" ? [
      { label: "Answer first & hypothesis", key: "answerFirst", weight: 22 },
      { label: "Structured thinking", key: "structure", weight: 18 },
      { label: "Quantitative & financial", key: "quantitative", weight: 18 },
      { label: "Communication & composure", key: "communication", weight: 22 },
      { label: "Cultural fit", key: "culturalFit", weight: 15 },
      { label: "Synthesis & recommendation", key: "synthesis", weight: 5 },
    ] : firm === "ey" ? [
      { label: "Problem solving & structure", key: "problemSolving", weight: 25 },
      { label: "Numerical & financial skills", key: "quantitative", weight: 28 },
      { label: "Strategic & investment judgment", key: "strategicJudgment", weight: 22 },
      { label: "Communication & client readiness", key: "communication", weight: 15 },
      { label: "Recommendation commitment", key: "recommendation", weight: 10 },
    ] : firm === "deloitte" ? [
      { label: "Structured thinking", key: "structure", weight: 22 },
      { label: "Analytical ability", key: "analytical", weight: 20 },
      { label: "Business acumen", key: "businessAcumen", weight: 22 },
      { label: "Communication skills", key: "communication", weight: 20 },
      { label: "Coachability & demeanor", key: "coachability", weight: 16 },
    ] : firm === "kpmg" ? [
      { label: "Structured thinking", key: "structure", weight: 22 },
      { label: "Analytical ability", key: "analytical", weight: 18 },
      { label: "Business & operational judgment", key: "operationalJudgment", weight: 22 },
      { label: "Communication & client readiness", key: "communication", weight: 18 },
      { label: "Values alignment & professional mindset", key: "valuesAlignment", weight: 20 },
    ] : firm === "pwc" ? [
      { label: "Structured reasoning & hypothesis", key: "structure", weight: 22 },
      { label: "Quantitative & financial logic", key: "quantitative", weight: 20 },
      { label: "Strategic & commercial judgment", key: "strategicJudgment", weight: 23 },
      { label: "Communication & delivery", key: "communication", weight: 18 },
      { label: "Behavioral fit & genuine motivation", key: "behavioralFit", weight: 17 },
    ] : firm === "rolandberger" ? [
      { label: "Structure & case design", key: "structure", weight: 25 },
      { label: "Analytical execution & drive", key: "execution", weight: 22 },
      { label: "Synthesis & recommendation", key: "synthesis", weight: 20 },
      { label: "Entrepreneurial mindset", key: "entrepreneurialMindset", weight: 18 },
      { label: "Collaboration & group case", key: "collaboration", weight: 15 },
    ] : firm === "accenture" ? [
      { label: "Structured thinking & MECE", key: "structuredThinking", weight: 20 },
      { label: "Problem solving & drive", key: "problemSolving", weight: 20 },
      { label: "Business judgment & digital", key: "businessJudgment", weight: 20 },
      { label: "Quantitative ability", key: "quantitative", weight: 15 },
      { label: "Communication & executive presence", key: "communicationPresence", weight: 15 },
      { label: "Collaboration", key: "collaboration", weight: 10 },
    ] : [];

  const hasFirmRubric = firmBreakdownItems.length > 0;

  const card: React.CSSProperties = {
    background: "white", borderRadius: "14px",
    border: "1px solid var(--hp-border)", padding: "1.5rem 1.75rem",
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.1em", color: "var(--hp-soft-foreground)",
    marginBottom: "0.875rem", fontFamily: FONT,
  };

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: "0.5rem 1rem", borderRadius: "8px", border: "none",
    background: active ? "var(--hp-primary)" : "transparent",
    color: active ? "white" : "var(--hp-soft-foreground)",
    cursor: "pointer", fontSize: "0.82rem", fontFamily: FONT,
    fontWeight: 600, transition: "all 0.15s", whiteSpace: "nowrap",
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "oklch(0.985 0.005 285)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.25rem", fontFamily: FONT }}>
        <motion.div
          animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid var(--hp-border)", borderTop: "2px solid var(--hp-primary)" }}
        />
        <p style={{ color: "var(--hp-foreground)", fontSize: "0.95rem", fontWeight: 600 }}>Evaluating your performance...</p>
        <p style={{ color: "var(--hp-soft-foreground)", fontSize: "0.82rem" }}>Applying {FIRM_SHORT[firm] ?? firmConfig.name} grading rubric</p>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div style={{ minHeight: "100vh", background: "oklch(0.985 0.005 285)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
        <p style={{ color: "var(--hp-soft-foreground)" }}>Failed to load evaluation. Please try again.</p>
      </div>
    );
  }

  const overallColor = formatScoreColor(evaluation.overallScore);

  return (
    <div style={{ minHeight: "100vh", background: "oklch(0.985 0.005 285)", color: "var(--hp-foreground)", fontFamily: FONT }}>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--hp-soft-foreground)", marginBottom: "0.4rem" }}>
            Case feedback · {FIRM_SHORT[firm] ?? firmConfig.name}
          </div>
          <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 0.4rem" }}>
            {caseTitle}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--hp-soft-foreground)" }}>
            <Clock size={13} />
            {formatDuration(duration)}
            <span>·</span>
            {hintsUsed} hint{hintsUsed !== 1 ? "s" : ""} used
            <span>·</span>
            <span style={{ textTransform: "capitalize" }}>{difficulty}</span>
          </div>
        </motion.div>

        {/* Score card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ ...card, marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3.5rem", fontWeight: 800, color: overallColor, lineHeight: 1, letterSpacing: "-0.04em" }}>
                {evaluation.overallScore}
              </div>
              <div style={{ fontSize: "0.8rem", color: overallColor, fontWeight: 600, marginTop: "2px" }}>
                {formatScore(evaluation.overallScore)}
              </div>
            </div>
            <div style={{ width: "1px", height: "56px", background: "var(--hp-border)" }} />
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--hp-soft-foreground)", marginBottom: "2px" }}>Percentile</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--hp-foreground)" }}>Top {100 - evaluation.percentileEstimate}%</div>
            </div>
          </div>

          {evaluation.offerDecision && (
            <div style={{ padding: "0.875rem 1.25rem", borderRadius: "12px", background: offerBg(evaluation.offerDecision.decision), border: `1px solid ${offerBorder(evaluation.offerDecision.decision)}`, minWidth: "200px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hp-soft-foreground)", marginBottom: "3px" }}>
                {FIRM_SHORT[firm] ?? firmConfig.name} decision
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: offerColor(evaluation.offerDecision.decision) }}>
                {evaluation.offerDecision.label}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--hp-soft-foreground)", marginTop: "2px" }}>
                Weighted score: {evaluation.offerDecision.weightedScore}/100
              </div>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          style={{ display: "flex", gap: "3px", marginBottom: "1.25rem", background: "white", padding: "4px", borderRadius: "10px", border: "1px solid var(--hp-border)", width: "fit-content", flexWrap: "wrap" }}>
          <button style={tabBtn(activeTab === "overview")} onClick={() => setActiveTab("overview")}>Overview</button>
          <button style={tabBtn(activeTab === "breakdown")} onClick={() => setActiveTab("breakdown")}>Score breakdown</button>
          <button style={tabBtn(activeTab === "ideal")} onClick={() => setActiveTab("ideal")}>Top 1% answer</button>
          {transcript.length > 0 && (
            <button style={tabBtn(activeTab === "transcript")} onClick={() => setActiveTab("transcript")}>Transcript</button>
          )}
        </motion.div>

        {/* Overview */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={card}>
              <div style={{ ...sectionLabel, color: "#15803d" }}>What went well</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {evaluation.whatWentWell.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a", marginTop: "8px", flexShrink: 0 }} />
                    <p style={{ fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={{ ...sectionLabel, color: "#d97706" }}>Areas to improve</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {evaluation.areasToImprove.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d97706", marginTop: "8px", flexShrink: 0 }} />
                    <p style={{ fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={sectionLabel}>{FIRM_SHORT[firm] ?? firmConfig.name} note</div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.75, margin: 0 }}>{evaluation.firmSpecificNote}</p>
            </div>

            {evaluation.offerDecision && (
              <div style={card}>
                <div style={sectionLabel}>Offer decision</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: offerColor(evaluation.offerDecision.decision), marginBottom: "0.5rem" }}>
                  {evaluation.offerDecision.label}
                </div>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.75, color: "var(--hp-soft-foreground)", margin: 0 }}>
                  {evaluation.offerDecision.description}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Breakdown */}
        {activeTab === "breakdown" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ ...card, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {hasFirmRubric ? (
              firmBreakdownItems.map(item => {
                const score = (evaluation.breakdown as any)[item.key] ?? 1;
                const color = scoreColor5(score);
                const pct = ((score - 1) / 4) * 100;
                return (
                  <div key={item.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.5rem" }}>
                      <div>
                        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--hp-foreground)" }}>{item.label}</span>
                        <span style={{ marginLeft: "0.6rem", fontSize: "0.72rem", color: "var(--hp-soft-foreground)", fontWeight: 500 }}>{item.weight}% weight</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color }}>{score}/5</span>
                        <span style={{ marginLeft: "0.5rem", fontSize: "0.72rem", color, fontWeight: 600 }}>{scoreLabel5(score)}</span>
                      </div>
                    </div>
                    <div style={{ height: "5px", background: "var(--hp-border)", borderRadius: "3px", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, delay: 0.1 }}
                        style={{ height: "100%", background: color, borderRadius: "3px" }}
                      />
                    </div>
                    {(evaluation as any).dimensionFeedback?.[item.key] && (
                      <p style={{ fontSize: "0.8rem", color: "var(--hp-soft-foreground)", marginTop: "0.5rem", lineHeight: 1.65, margin: "0.4rem 0 0" }}>
                        {(evaluation as any).dimensionFeedback[item.key]}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              [
                { label: "Structure", key: "structure" },
                { label: "Problem solving", key: "problemSolving" },
                { label: "Quantitative", key: "quantitative" },
                { label: "Communication", key: "communication" },
                { label: "Creativity", key: "creativity" },
              ].map(item => {
                const score = (evaluation.breakdown as any)[item.key] ?? 50;
                const color = formatScoreColor(score);
                const weight = (firmConfig.evaluationWeights as any)?.[item.key];
                return (
                  <div key={item.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <div>
                        <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{item.label}</span>
                        {weight && <span style={{ marginLeft: "0.6rem", fontSize: "0.72rem", color: "var(--hp-soft-foreground)" }}>{weight}% weight</span>}
                      </div>
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color }}>{score}</span>
                    </div>
                    <div style={{ height: "5px", background: "var(--hp-border)", borderRadius: "3px", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.7 }}
                        style={{ height: "100%", background: color, borderRadius: "3px" }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* Ideal answer */}
        {activeTab === "ideal" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={card}>
            <div style={sectionLabel}>What a top 1% candidate would say</div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.85, margin: 0 }}>{evaluation.topCandidateResponse}</p>
          </motion.div>
        )}

        {/* Transcript */}
        {activeTab === "transcript" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ padding: "0.75rem 1rem", background: "white", border: "1px solid var(--hp-border)", borderRadius: "10px", fontSize: "0.8rem", color: "var(--hp-soft-foreground)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Clock size={13} />
              {transcript.length} messages · {formatDuration(duration)}
            </div>

            {transcript.map((msg, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {msg.role === "assistant" && (
                    <div style={{ width: "22px", height: "22px", borderRadius: "9999px", background: "var(--hp-primary)", display: "grid", placeItems: "center", fontSize: "0.65rem", fontWeight: 700, color: "white", flexShrink: 0 }}>
                      {(FIRM_SHORT[firm] ?? firmConfig.name).charAt(0)}
                    </div>
                  )}
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--hp-soft-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {msg.role === "user" ? "You" : FIRM_SHORT[firm] ?? firmConfig.name}
                  </span>
                </div>
                <div style={{
                  maxWidth: "680px", padding: "0.875rem 1.1rem",
                  borderRadius: msg.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                  background: msg.role === "user" ? "var(--hp-primary)" : "white",
                  border: msg.role === "assistant" ? "1px solid var(--hp-border)" : "none",
                  fontSize: "0.875rem", lineHeight: 1.75, whiteSpace: "pre-wrap",
                  color: msg.role === "user" ? "white" : "var(--hp-foreground)",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Actions */}
        <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => router.push("/dashboard")}
            style={{ flex: 1, height: "48px", borderRadius: "12px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.9rem", fontWeight: 700, fontFamily: FONT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 3px 0 oklch(0.4 0.16 285)" }}
          >
            Practice another case <ArrowRight size={16} />
          </button>
          <button
            onClick={() => router.push("/history")}
            style={{ flex: 1, height: "48px", borderRadius: "12px", border: "1px solid var(--hp-border-strong)", background: "white", color: "var(--hp-foreground)", fontSize: "0.9rem", fontWeight: 600, fontFamily: FONT, cursor: "pointer" }}
          >
            View history
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense>
      <FeedbackInner />
    </Suspense>
  );
}