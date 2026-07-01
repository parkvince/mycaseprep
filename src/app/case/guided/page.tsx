"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GUIDED_CASES } from "@/lib/guidedCases";
import { ArrowRight, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

function scoreColor(s: number) {
  if (s >= 85) return "#15803d";
  if (s >= 70) return "#65a30d";
  if (s >= 55) return "#d97706";
  if (s >= 40) return "#ea580c";
  return "#dc2626";
}

function scoreLabel(s: number) {
  if (s >= 85) return "Exceptional";
  if (s >= 70) return "Strong";
  if (s >= 55) return "Competent";
  if (s >= 40) return "Developing";
  return "Needs work";
}

function GuidedCaseInner() {
  const router = useRouter();
  const params = useSearchParams();
  const caseId = params.get("id") ?? "g1";
  const currentCase = GUIDED_CASES.find(c => c.id === caseId);

  const [stage, setStage] = useState<"intro" | "question" | "final" | "complete">("intro");
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(50);
  const [questionCount, setQuestionCount] = useState(0);
  const [finalAnswer, setFinalAnswer] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [stage]);

  if (!currentCase) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
        <p style={{ color: "var(--hp-soft-foreground)" }}>Case not found.</p>
      </div>
    );
  }

  const totalQuestions = currentCase.questions.length;
  const currentQuestion = currentCase.questions.find(q => q.id === currentQuestionId);
  const selectedOption = currentQuestion?.options.find(o => o.id === selectedOptionId);

  const handleStart = () => { setCurrentQuestionId(currentCase.startQuestionId); setStage("question"); };
  const handleSelectOption = (optionId: string) => { if (!showFeedback) setSelectedOptionId(optionId); };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || !currentQuestion) return;
    const option = currentQuestion.options.find(o => o.id === selectedOptionId);
    if (!option) return;
    setScore(s => Math.max(0, Math.min(100, s + option.scoreImpact)));
    setQuestionCount(c => c + 1);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!selectedOption) return;
    if (selectedOption.nextQuestionId === "end") { setStage("final"); return; }
    const next = currentCase.questions.find(q => q.id === selectedOption.nextQuestionId);
    if (!next) { setStage("final"); return; }
    setCurrentQuestionId(selectedOption.nextQuestionId);
    setSelectedOptionId(null);
    setShowFeedback(false);
  };

  const handleSubmitFinal = async () => {
    setSaving(true);
    try {
      await fetch("/api/sessions/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "guided", firm: currentCase.firm, difficulty: currentCase.difficulty,
          caseTitle: currentCase.title, duration: questionCount * 120,
          hintsUsed: 0, guidedScore: score,
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setStage("complete");
    }
  };

  // No overflowX on wrap — let the page scroll naturally
const wrap: React.CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  fontFamily: FONT,
  background: "oklch(0.985 0.005 285)",
  color: "var(--hp-foreground)",
  overflowX: "hidden",
};

  const inner: React.CSSProperties = {
    maxWidth: "680px",
    margin: "0 auto",
    padding: "2.5rem 1.5rem 6rem",
    boxSizing: "border-box" as const,
    width: "100%",
  };

  const card: React.CSSProperties = {
    background: "white",
    borderRadius: "14px",
    border: "1px solid var(--hp-border)",
    padding: "1.5rem 1.75rem",
    boxSizing: "border-box" as const,
    width: "100%",
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const,
    letterSpacing: "0.1em", color: "var(--hp-soft-foreground)",
    marginBottom: "0.6rem", fontFamily: FONT,
  };

  // ── INTRO ──
  if (stage === "intro") {
    return (
      <div style={wrap}>
        <Navbar />
        <div style={inner}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--hp-soft-foreground)", marginBottom: "2rem" }}>
              <span style={{ cursor: "pointer" }} onClick={() => router.push("/library")}>Library</span>
              <ChevronRight size={13} />
              <span style={{ color: "var(--hp-foreground)", fontWeight: 500 }}>{currentCase.title}</span>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "9999px", background: "var(--hp-primary-soft)", color: "var(--hp-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Guided</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--hp-soft-foreground)", textTransform: "capitalize" }}>{currentCase.difficulty}</span>
              </div>
              <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--hp-foreground)", margin: 0, lineHeight: 1.15 }}>
                {currentCase.title}
              </h1>
              <p style={{ marginTop: "0.75rem", fontSize: "0.95rem", color: "var(--hp-soft-foreground)", lineHeight: 1.7 }}>
                {currentCase.overview}
              </p>
            </div>

            <div style={{ display: "flex", borderRadius: "14px", border: "1px solid var(--hp-border)", overflow: "hidden", background: "white", marginBottom: "1.25rem" }}>
              {[
                { label: "Format", value: "Branching path" },
                { label: "Duration", value: `${currentCase.estimatedMinutes} min` },
                { label: "Difficulty", value: currentCase.difficulty },
              ].map((item, i) => (
                <div key={item.label} style={{ flex: 1, padding: "1rem 1.25rem", textAlign: "center" as const, borderRight: i < 2 ? "1px solid var(--hp-border)" : "none" }}>
                  <div style={sectionLabel}>{item.label}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--hp-foreground)", textTransform: "capitalize" as const }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ ...card, marginBottom: "1rem" }}>
              <div style={sectionLabel}>Client background</div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "var(--hp-foreground)", margin: 0 }}>{currentCase.clientBackground}</p>
            </div>

            <div style={{ ...card, marginBottom: "1.5rem" }}>
              <div style={sectionLabel}>Your role</div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "var(--hp-foreground)", margin: 0 }}>{currentCase.yourRole}</p>
            </div>

            <div style={{ padding: "0.875rem 1.1rem", borderRadius: "10px", background: "var(--hp-primary-soft)", border: "1px solid color-mix(in oklab, var(--hp-primary) 20%, transparent)", fontSize: "0.82rem", color: "var(--hp-foreground)", lineHeight: 1.65, marginBottom: "1.75rem", boxSizing: "border-box" as const }}>
              Each answer routes you down a different path. Your score reflects every decision you make. Read carefully. The right answer is not always the most obvious one.
            </div>

            <button onClick={handleStart}
              style={{ width: "100%", height: "52px", borderRadius: "12px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "1rem", fontWeight: 700, fontFamily: FONT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 3px 0 oklch(0.4 0.16 285)", boxSizing: "border-box" as const }}>
              Begin case <ArrowRight size={17} />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── QUESTION ──
  if (stage === "question" && currentQuestion) {
    const progressPct = Math.min((questionCount / totalQuestions) * 100, 95);

    return (
      <div style={wrap}>
        <Navbar />
        <div style={{ height: "3px", background: "var(--hp-border)" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4 }}
            style={{ height: "100%", background: "var(--hp-primary)", borderRadius: "0 2px 2px 0" }} />
        </div>

        <div style={inner}>
          <motion.div key={currentQuestionId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--hp-soft-foreground)", marginBottom: "0.5rem" }}>
              {currentQuestion.stage}
            </div>

            <h2 style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)", fontWeight: 700, lineHeight: 1.5, letterSpacing: "-0.01em", color: "var(--hp-foreground)", marginBottom: currentQuestion.context ? "1rem" : "1.75rem" }}>
              {currentQuestion.question}
            </h2>

            {currentQuestion.context && (
              <p style={{ fontSize: "0.875rem", color: "var(--hp-soft-foreground)", lineHeight: 1.7, marginBottom: "1.5rem", padding: "0.875rem 1.1rem", background: "white", borderRadius: "10px", border: "1px solid var(--hp-border)", boxSizing: "border-box" as const }}>
                {currentQuestion.context}
              </p>
            )}

            {currentQuestion.exhibit && (
              <div style={{ ...card, marginBottom: "1.5rem", overflowX: "auto" as const }}>
                <div style={sectionLabel}>Exhibit: {currentQuestion.exhibit.title}</div>
                <pre style={{ fontSize: "0.8rem", lineHeight: 1.65, color: "var(--hp-foreground)", fontFamily: "'Courier New', monospace", whiteSpace: "pre", margin: 0 }}>
                  {currentQuestion.exhibit.data}
                </pre>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.6rem", marginBottom: "1.5rem" }}>
              {currentQuestion.options.map(option => {
                const isSelected = selectedOptionId === option.id;
                let borderColor = "var(--hp-border)";
                let bg = "white";
                if (isSelected && !showFeedback) { borderColor = "var(--hp-primary)"; bg = "var(--hp-primary-soft)"; }
                if (showFeedback && isSelected) {
                  if (option.scoreImpact > 10) { borderColor = "#16a34a"; bg = "#f0fdf4"; }
                  else if (option.scoreImpact > 0) { borderColor = "#d97706"; bg = "#fffbeb"; }
                  else if (option.scoreImpact < 0) { borderColor = "#dc2626"; bg = "#fef2f2"; }
                  else { borderColor = "var(--hp-border-strong)"; }
                }
                return (
                  <div key={option.id} onClick={() => handleSelectOption(option.id)}
                    style={{ padding: "1rem 1.25rem", borderRadius: "12px", border: `1.5px solid ${borderColor}`, background: bg, cursor: showFeedback ? "default" : "pointer", transition: "all 0.15s", boxSizing: "border-box" as const }}>
                    <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                      <div style={{ width: "17px", height: "17px", borderRadius: "50%", border: `2px solid ${isSelected ? borderColor : "var(--hp-border)"}`, background: isSelected && !showFeedback ? "var(--hp-primary)" : isSelected && showFeedback ? borderColor : "transparent", flexShrink: 0, marginTop: "3px", transition: "all 0.15s" }} />
                      <p style={{ fontSize: "0.9rem", lineHeight: 1.65, margin: 0, color: "var(--hp-foreground)" }}>{option.text}</p>
                    </div>
                    <AnimatePresence>
                      {showFeedback && isSelected && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          style={{ marginTop: "0.875rem", paddingTop: "0.875rem", borderTop: `1px solid ${borderColor}`, fontSize: "0.85rem", lineHeight: 1.65, color: option.scoreImpact > 10 ? "#15803d" : option.scoreImpact > 0 ? "#b45309" : option.scoreImpact < 0 ? "#b91c1c" : "var(--hp-soft-foreground)" }}>
                          {option.feedback}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {!showFeedback ? (
              <button onClick={handleSubmitAnswer} disabled={!selectedOptionId}
                style={{ width: "100%", height: "48px", borderRadius: "12px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.9rem", fontWeight: 700, fontFamily: FONT, cursor: selectedOptionId ? "pointer" : "not-allowed", opacity: selectedOptionId ? 1 : 0.4, boxShadow: selectedOptionId ? "0 3px 0 oklch(0.4 0.16 285)" : "none", transition: "opacity 0.15s", boxSizing: "border-box" as const }}>
                Submit answer
              </button>
            ) : (
              <button onClick={handleNext}
                style={{ width: "100%", height: "48px", borderRadius: "12px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.9rem", fontWeight: 700, fontFamily: FONT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 3px 0 oklch(0.4 0.16 285)", boxSizing: "border-box" as const }}>
                {selectedOption?.nextQuestionId === "end" ? "Continue to final recommendation" : "Next"} <ArrowRight size={16} />
              </button>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ── FINAL ──
  if (stage === "final") {
    return (
      <div style={wrap}>
        <Navbar />
        <div style={inner}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
              Final recommendation
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--hp-soft-foreground)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
              {currentCase.finalRecommendationPrompt}
            </p>
            <textarea
              value={finalAnswer}
              onChange={e => setFinalAnswer(e.target.value)}
              placeholder="Write your recommendation here. Be specific about actions, timeline, and expected impact..."
              style={{
                display: "block",
                width: "100%",
                minHeight: "200px",
                background: "white",
                border: "1px solid var(--hp-border)",
                borderRadius: "12px",
                padding: "1.1rem 1.25rem",
                color: "var(--hp-foreground)",
                fontSize: "0.9rem",
                fontFamily: FONT,
                resize: "vertical",
                outline: "none",
                lineHeight: 1.75,
                marginBottom: "0.75rem",
                boxSizing: "border-box" as const,
                transition: "border-color 0.15s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--hp-primary)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--hp-border)")}
            />
            <div style={{ fontSize: "0.78rem", color: finalAnswer.trim().length < 40 ? "var(--hp-soft-foreground)" : "#15803d", marginBottom: "1.25rem", fontWeight: 500 }}>
              {finalAnswer.trim().length < 40 ? `${40 - finalAnswer.trim().length} more characters needed` : "Ready to submit"}
            </div>
            <button
              onClick={handleSubmitFinal}
              disabled={finalAnswer.trim().length < 40 || saving}
              style={{ display: "flex", width: "100%", height: "52px", borderRadius: "12px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "1rem", fontWeight: 700, fontFamily: FONT, cursor: finalAnswer.trim().length >= 40 && !saving ? "pointer" : "not-allowed", opacity: finalAnswer.trim().length >= 40 && !saving ? 1 : 0.45, boxShadow: "0 3px 0 oklch(0.4 0.16 285)", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxSizing: "border-box" as const }}>
              {saving ? "Saving..." : <> See results <ArrowRight size={17} /></>}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── COMPLETE ──
  if (stage === "complete") {
    const color = scoreColor(score);
    const label = scoreLabel(score);

    return (
      <div style={wrap}>
        <Navbar />
        <div style={inner}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ textAlign: "center" as const, marginBottom: "2.5rem" }}>
              <div style={{ fontSize: "5rem", fontWeight: 800, color, lineHeight: 1, letterSpacing: "-0.04em" }}>{score}</div>
              <div style={{ fontSize: "1rem", color, fontWeight: 700, marginTop: "0.25rem" }}>{label}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--hp-soft-foreground)", marginTop: "0.25rem" }}>
                {questionCount} decisions · {currentCase.title}
              </div>
            </div>

            <div style={{ ...card, marginBottom: "1rem" }}>
              <div style={sectionLabel}>Ideal recommendation</div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--hp-foreground)", margin: 0 }}>{currentCase.idealRecommendation}</p>
            </div>

            <div style={{ ...card, marginBottom: "1rem" }}>
              <div style={sectionLabel}>Your recommendation</div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--hp-soft-foreground)", margin: 0 }}>{finalAnswer}</p>
            </div>

            <div style={{ ...card, marginBottom: "2rem" }}>
              <div style={sectionLabel}>Key takeaways</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.875rem" }}>
                {currentCase.keyTakeaways.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "var(--hp-primary-soft)", border: "1px solid color-mix(in oklab, var(--hp-primary) 25%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0, marginTop: "1px", color: "var(--hp-primary)" }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: "0.875rem", lineHeight: 1.7, margin: 0, color: "var(--hp-foreground)" }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => router.push("/library")}
                style={{ flex: 1, height: "48px", borderRadius: "12px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.9rem", fontWeight: 700, fontFamily: FONT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 3px 0 oklch(0.4 0.16 285)" }}>
                Try another case <ArrowRight size={16} />
              </button>
              <button onClick={() => router.push("/history")}
                style={{ flex: 1, height: "48px", borderRadius: "12px", border: "1px solid var(--hp-border-strong)", background: "white", color: "var(--hp-foreground)", fontSize: "0.9rem", fontWeight: 600, fontFamily: FONT, cursor: "pointer" }}>
                View history
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}

export default function GuidedCasePage() {
  return (
    <Suspense>
      <GuidedCaseInner />
    </Suspense>
  );
}