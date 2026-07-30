"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GUIDED_CASES } from "@/lib/guidedCases";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, ChevronRight, BookOpen, MousePointerClick, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingBlob from "@/components/FloatingBlob";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

// Shared page shell: the same pastel gradient wash + floating blobs the rest of
// the app uses, so the guided player stops feeling like a stiff survey form.
const inner: React.CSSProperties = {
  maxWidth: "680px", margin: "0 auto", padding: "1.5rem 1.5rem 6rem",
  boxSizing: "border-box", width: "100%", position: "relative", zIndex: 1,
};

const card: React.CSSProperties = {
  background: "white", borderRadius: "18px", border: "1px solid var(--hp-border)",
  boxShadow: "var(--hp-shadow-card)", padding: "1.5rem 1.75rem",
  boxSizing: "border-box", width: "100%",
};

const sectionLabel: React.CSSProperties = {
  fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
  letterSpacing: "0.1em", color: "var(--hp-soft-foreground)",
  marginBottom: "0.6rem", fontFamily: FONT,
};

function Shell({ children, progressPct }: { children: React.ReactNode; progressPct?: number }) {
  return (
    <div style={{
      minHeight: "100vh", width: "100%", fontFamily: FONT, color: "var(--hp-foreground)",
      background: "var(--hp-bg)",
      backgroundImage: [
        "radial-gradient(at 8% 12%, var(--hp-lavender) 0px, transparent 45%)",
        "radial-gradient(at 92% 10%, var(--hp-peach) 0px, transparent 45%)",
        "radial-gradient(at 85% 92%, var(--hp-mint) 0px, transparent 50%)",
        "radial-gradient(at 10% 92%, var(--hp-sky) 0px, transparent 45%)",
      ].join(", "),
      backgroundAttachment: "fixed",
      position: "relative", zIndex: 0, overflowX: "hidden",
    }}>
      <FloatingBlob src="/homepage/new3-blob-meditating.png" alt="" size={140} top="12%" left="3%" duration={7} rotate={-5} />
      <FloatingBlob src="/homepage/new3-blob-planting.png" alt="" size={130} bottom="16%" right="3%" duration={7.5} delay={0.6} rotate={5} />
      <FloatingBlob src="/homepage/new3-blob-juggling.png" alt="" size={120} bottom="4%" left="5%" duration={6.5} delay={1} rotate={-4} />

      <Navbar />
      {progressPct != null && (
        <div style={{ height: "4px", background: "color-mix(in oklab, var(--hp-primary) 12%, transparent)", position: "relative", zIndex: 1 }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4 }}
            style={{ height: "100%", background: "var(--hp-primary)", borderRadius: "0 3px 3px 0" }} />
        </div>
      )}
      <div style={inner}>{children}</div>
    </div>
  );
}

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
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [stage]);

  useEffect(() => {
    document.title = `${currentCase?.title ?? "Guided Case"} · MyCasePrep`;
  }, [currentCase?.title]);

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

  const handleStart = () => {
    startTimeRef.current = Date.now();
    trackEvent("case_started", {
      case_source: "guided",
      firm: currentCase.firm,
      case_type: currentCase.type,
      difficulty: currentCase.difficulty,
      practice_mode: "guided",
    });
    setCurrentQuestionId(currentCase.startQuestionId);
    setStage("question");
  };
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
    const duration = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;
    trackEvent("case_completed", {
      case_source: "guided",
      firm: currentCase.firm,
      case_type: currentCase.type,
      difficulty: currentCase.difficulty,
      practice_mode: "guided",
      duration_seconds: duration,
      hints_used: 0,
      score,
      decisions: questionCount,
    });
    try {
      await fetch("/api/sessions/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "guided", caseType: currentCase.type, firm: currentCase.firm, difficulty: currentCase.difficulty,
          caseTitle: currentCase.title, duration,
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

  // ── INTRO ──
  if (stage === "intro") {
    return (
      <Shell>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--hp-soft-foreground)", marginBottom: "1.5rem" }}>
            <button type="button" onClick={() => router.push("/library")}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "inherit", font: "inherit", fontFamily: FONT, textDecoration: "underline", textUnderlineOffset: "2px" }}>
              Library
            </button>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page" style={{ color: "var(--hp-foreground)", fontWeight: 500 }}>{currentCase.title}</span>
          </nav>

          {/* Hero */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.1rem", marginBottom: "1.5rem" }}>
            <img src="/homepage/new3-blob-reading.png" alt="" style={{ width: "88px", height: "auto", flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "9999px", background: "var(--hp-primary-soft)", color: "var(--hp-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Guided</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--hp-soft-foreground)", textTransform: "capitalize" }}>{currentCase.difficulty} · {currentCase.estimatedMinutes} min</span>
              </div>
              <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--hp-foreground)", margin: 0, lineHeight: 1.15 }}>
                {currentCase.title}
              </h1>
            </div>
          </div>

          <p style={{ fontSize: "0.95rem", color: "var(--hp-soft-foreground)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            {currentCase.overview}
          </p>

          {/* How this works - beginner-friendly explainer */}
          <div style={{ ...card, marginBottom: "1rem", background: "var(--hp-primary-soft)", border: "1px solid color-mix(in oklab, var(--hp-primary) 20%, transparent)", boxShadow: "none" }}>
            <div style={{ ...sectionLabel, color: "var(--hp-primary)" }}>How this works</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {[
                { icon: <BookOpen size={16} />, text: "Read each situation - you play the consultant on the case." },
                { icon: <MousePointerClick size={16} />, text: "Pick the move a strong candidate would make. There's no time pressure." },
                { icon: <MessageCircle size={16} />, text: "Get instant feedback after every choice, then write a final recommendation." },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "9999px", background: "white", color: "var(--hp-primary)", display: "grid", placeItems: "center", flexShrink: 0, boxShadow: "0 1px 3px oklch(0.4 0.05 280 / 12%)" }}>{step.icon}</div>
                  <p style={{ fontSize: "0.86rem", lineHeight: 1.6, margin: 0, color: "var(--hp-foreground)", paddingTop: "3px" }}>{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...card, marginBottom: "1rem" }}>
            <div style={sectionLabel}>Client background</div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "var(--hp-foreground)", margin: 0 }}>{currentCase.clientBackground}</p>
          </div>

          <div style={{ ...card, marginBottom: "1.5rem" }}>
            <div style={sectionLabel}>Your role</div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "var(--hp-foreground)", margin: 0 }}>{currentCase.yourRole}</p>
          </div>

          <button onClick={handleStart}
            style={{ width: "100%", height: "54px", borderRadius: "14px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "1rem", fontWeight: 700, fontFamily: FONT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 3px 0 oklch(0.4 0.16 285)", boxSizing: "border-box" }}>
            Start the case <ArrowRight size={17} />
          </button>
          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--hp-soft-foreground)", marginTop: "0.75rem" }}>
            Guided cases are always free and unlimited - take your time.
          </p>
        </motion.div>
      </Shell>
    );
  }

  // ── QUESTION ──
  if (stage === "question" && currentQuestion) {
    const progressPct = Math.min((questionCount / totalQuestions) * 100, 95);

    return (
      <Shell progressPct={progressPct}>
        <motion.div key={currentQuestionId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--hp-primary)" }}>
              {currentQuestion.stage}
            </div>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--hp-soft-foreground)" }}>
              Decision {questionCount + 1}
            </div>
          </div>

          <div style={{ ...card, marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "clamp(1.05rem, 2vw, 1.3rem)", fontWeight: 700, lineHeight: 1.5, letterSpacing: "-0.01em", color: "var(--hp-foreground)", margin: currentQuestion.context ? "0 0 1rem" : 0 }}>
              {currentQuestion.question}
            </h2>

            {currentQuestion.context && (
              <p style={{ fontSize: "0.875rem", color: "var(--hp-soft-foreground)", lineHeight: 1.7, margin: 0 }}>
                {currentQuestion.context}
              </p>
            )}
          </div>

          {currentQuestion.exhibit && (
            <div style={{ ...card, marginBottom: "1.25rem", overflowX: "auto" }}>
              <div style={sectionLabel}>Exhibit: {currentQuestion.exhibit.title}</div>
              <pre style={{ fontSize: "0.8rem", lineHeight: 1.65, color: "var(--hp-foreground)", fontFamily: "'Courier New', monospace", whiteSpace: "pre", margin: 0 }}>
                {currentQuestion.exhibit.data}
              </pre>
            </div>
          )}

          {!showFeedback && (
            <p style={{ fontSize: "0.78rem", color: "var(--hp-soft-foreground)", marginBottom: "0.75rem" }}>
              Choose the option a strong candidate would pick - you&apos;ll see why after you submit.
            </p>
          )}

          <div role="radiogroup" aria-label={`Answer options for: ${currentQuestion.question}`}
            style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
            {currentQuestion.options.map((option, oi) => {
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
              const letter = String.fromCharCode(65 + oi);
              return (
                // A real <button> with radio semantics: previously this was a
                // clickable <div>, which meant keyboard and screen-reader users
                // could not answer a case at all (WCAG 2.1.1).
                <motion.button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={showFeedback && !isSelected}
                  onClick={() => handleSelectOption(option.id)}
                  whileHover={!showFeedback ? { y: -2 } : undefined}
                  style={{ display: "block", width: "100%", textAlign: "left", font: "inherit", fontFamily: FONT, padding: "1rem 1.1rem", borderRadius: "14px", border: `1.5px solid ${borderColor}`, background: bg, cursor: showFeedback ? "default" : "pointer", transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s", boxShadow: isSelected ? "0 4px 14px oklch(0.4 0.05 280 / 8%)" : "var(--hp-shadow-card)", boxSizing: "border-box" }}
                >
                  <span style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span aria-hidden="true" style={{ width: "26px", height: "26px", borderRadius: "9999px", flexShrink: 0, display: "grid", placeItems: "center", fontSize: "0.78rem", fontWeight: 700, marginTop: "1px",
                      background: isSelected ? borderColor : "var(--hp-primary-soft)",
                      color: isSelected ? "white" : "var(--hp-primary)",
                      transition: "all 0.15s" }}>
                      {showFeedback && isSelected && option.scoreImpact > 0 ? "✓" : showFeedback && isSelected && option.scoreImpact < 0 ? "✕" : letter}
                    </span>
                    <span style={{ fontSize: "0.9rem", lineHeight: 1.6, margin: 0, color: "var(--hp-foreground)", paddingTop: "3px" }}>{option.text}</span>
                  </span>
                  <AnimatePresence>
                    {showFeedback && isSelected && (
                      <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        style={{ display: "block", marginTop: "0.875rem", paddingTop: "0.875rem", borderTop: `1px solid ${borderColor}`, fontSize: "0.85rem", lineHeight: 1.65, color: option.scoreImpact > 10 ? "#15803d" : option.scoreImpact > 0 ? "#b45309" : option.scoreImpact < 0 ? "#b91c1c" : "var(--hp-soft-foreground)" }}>
                        {option.feedback}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {!showFeedback ? (
            <button onClick={handleSubmitAnswer} disabled={!selectedOptionId}
              style={{ width: "100%", height: "50px", borderRadius: "14px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.9rem", fontWeight: 700, fontFamily: FONT, cursor: selectedOptionId ? "pointer" : "not-allowed", opacity: selectedOptionId ? 1 : 0.4, boxShadow: selectedOptionId ? "0 3px 0 oklch(0.4 0.16 285)" : "none", transition: "opacity 0.15s", boxSizing: "border-box" }}>
              Lock in answer
            </button>
          ) : (
            <button onClick={handleNext}
              style={{ width: "100%", height: "50px", borderRadius: "14px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.9rem", fontWeight: 700, fontFamily: FONT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 3px 0 oklch(0.4 0.16 285)", boxSizing: "border-box" }}>
              {selectedOption?.nextQuestionId === "end" ? "Continue to final recommendation" : "Next decision"} <ArrowRight size={16} />
            </button>
          )}
        </motion.div>
      </Shell>
    );
  }

  // ── FINAL ──
  if (stage === "final") {
    const ready = finalAnswer.trim().length >= 40;
    return (
      <Shell>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <img src="/homepage/new-blob-writing.png" alt="" style={{ width: "80px", height: "auto", flexShrink: 0 }} />
            <div>
              <h2 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 0.25rem" }}>
                Your final recommendation
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--hp-soft-foreground)", lineHeight: 1.6, margin: 0 }}>
                Wrap it up like you would for the client.
              </p>
            </div>
          </div>

          <div style={{ ...card, marginBottom: "1rem" }}>
            <div style={sectionLabel}>The prompt</div>
            <p style={{ fontSize: "0.9rem", color: "var(--hp-foreground)", lineHeight: 1.7, margin: 0 }}>
              {currentCase.finalRecommendationPrompt}
            </p>
          </div>

          {/* Beginner scaffold */}
          <div style={{ padding: "0.8rem 1.1rem", borderRadius: "12px", background: "var(--hp-primary-soft)", fontSize: "0.8rem", color: "var(--hp-foreground)", lineHeight: 1.6, marginBottom: "1rem" }}>
            A strong answer leads with the <strong>recommendation</strong>, backs it with your <strong>key reasons</strong>, names the main <strong>risk</strong>, and ends with a concrete <strong>next step</strong>.
          </div>

          <textarea
            value={finalAnswer}
            onChange={e => setFinalAnswer(e.target.value)}
            placeholder="Lead with your recommendation, then your reasoning, the biggest risk, and a next step..."
            style={{
              display: "block", width: "100%", minHeight: "200px",
              background: "white", border: "1px solid var(--hp-border)", borderRadius: "14px",
              padding: "1.1rem 1.25rem", color: "var(--hp-foreground)", fontSize: "0.9rem",
              fontFamily: FONT, resize: "vertical", outline: "none", lineHeight: 1.75,
              marginBottom: "0.75rem", boxSizing: "border-box", transition: "border-color 0.15s",
              boxShadow: "var(--hp-shadow-card)",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--hp-primary)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--hp-border)")}
          />
          <div style={{ fontSize: "0.78rem", color: ready ? "#15803d" : "var(--hp-soft-foreground)", marginBottom: "1.25rem", fontWeight: 500 }}>
            {ready ? "Ready to submit" : `${40 - finalAnswer.trim().length} more characters to go`}
          </div>
          <button
            onClick={handleSubmitFinal}
            disabled={!ready || saving}
            style={{ display: "flex", width: "100%", height: "54px", borderRadius: "14px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "1rem", fontWeight: 700, fontFamily: FONT, cursor: ready && !saving ? "pointer" : "not-allowed", opacity: ready && !saving ? 1 : 0.45, boxShadow: "0 3px 0 oklch(0.4 0.16 285)", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxSizing: "border-box" }}>
            {saving ? "Saving..." : <> See how you did <ArrowRight size={17} /></>}
          </button>
        </motion.div>
      </Shell>
    );
  }

  // ── COMPLETE ──
  if (stage === "complete") {
    const color = scoreColor(score);
    const label = scoreLabel(score);

    return (
      <Shell>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Celebratory score card */}
          <div style={{ ...card, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <img src="/homepage/new3-blob-birthday.png" alt="" style={{ width: "84px", height: "auto", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hp-soft-foreground)", marginBottom: "2px" }}>Case complete</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
                <span style={{ fontSize: "3rem", fontWeight: 800, color, lineHeight: 1, letterSpacing: "-0.04em" }}>{score}</span>
                <span style={{ fontSize: "1rem", color, fontWeight: 700 }}>{label}</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--hp-soft-foreground)", marginTop: "0.35rem" }}>
                {questionCount} decisions · saved to your history
              </div>
            </div>
          </div>

          <div style={{ ...card, marginBottom: "1rem" }}>
            <div style={{ ...sectionLabel, color: "#15803d" }}>Ideal recommendation</div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--hp-foreground)", margin: 0 }}>{currentCase.idealRecommendation}</p>
          </div>

          <div style={{ ...card, marginBottom: "1rem" }}>
            <div style={sectionLabel}>Your recommendation</div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--hp-soft-foreground)", margin: 0, whiteSpace: "pre-wrap" }}>{finalAnswer}</p>
          </div>

          <div style={{ ...card, marginBottom: "1.5rem" }}>
            <div style={sectionLabel}>Key takeaways</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
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

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/library")}
              style={{ flex: 1, minWidth: "160px", height: "50px", borderRadius: "14px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.9rem", fontWeight: 700, fontFamily: FONT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 3px 0 oklch(0.4 0.16 285)" }}>
              Try another case <ArrowRight size={16} />
            </button>
            <button onClick={() => router.push("/history")}
              style={{ flex: 1, minWidth: "160px", height: "50px", borderRadius: "14px", border: "1px solid var(--hp-border-strong)", background: "white", color: "var(--hp-foreground)", fontSize: "0.9rem", fontWeight: 600, fontFamily: FONT, cursor: "pointer" }}>
              View history
            </button>
          </div>
        </motion.div>
      </Shell>
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
