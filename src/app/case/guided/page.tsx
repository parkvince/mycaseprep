"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GUIDED_CASES, BranchQuestion } from "@/lib/guidedCases";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { FirmKey } from "@/types";

function GuidedCaseInner() {
  const router = useRouter();
  const params = useSearchParams();
  const caseId = params.get("id") ?? "g1";

  const currentCase = GUIDED_CASES.find(c => c.id === caseId);

  const [stage, setStage] = useState<"intro" | "question" | "feedback" | "final" | "complete">("intro");
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(50);
  const [questionCount, setQuestionCount] = useState(0);
  const [pathTaken, setPathTaken] = useState<{ questionId: string; optionId: string; scoreImpact: number }[]>([]);
  const [finalAnswer, setFinalAnswer] = useState("");
  const [saving, setSaving] = useState(false);

  if (!currentCase) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Case not found.</p>
      </main>
    );
  }

  const totalQuestions = currentCase.questions.length;
  const firmConfig = FIRM_CONFIGS[currentCase.firm as FirmKey];

  const getCurrentQuestion = (): BranchQuestion | undefined => {
    return currentCase.questions.find(q => q.id === currentQuestionId);
  };

  const currentQuestion = getCurrentQuestion();
  const selectedOption = currentQuestion?.options.find(o => o.id === selectedOptionId);

  const handleStart = () => {
    setCurrentQuestionId(currentCase.startQuestionId);
    setStage("question");
  };

  const handleSelectOption = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || !currentQuestion) return;
    const option = currentQuestion.options.find(o => o.id === selectedOptionId);
    if (!option) return;

    const newScore = Math.max(0, Math.min(100, score + option.scoreImpact));
    setScore(newScore);
    setPathTaken(prev => [...prev, {
      questionId: currentQuestionId,
      optionId: selectedOptionId,
      scoreImpact: option.scoreImpact,
    }]);
    setQuestionCount(c => c + 1);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    if (selectedOption.nextQuestionId === "end") {
      setStage("final");
      return;
    }

    const nextQuestion = currentCase.questions.find(q => q.id === selectedOption.nextQuestionId);
    if (!nextQuestion) {
      setStage("final");
      return;
    }

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
          type: "guided",
          firm: currentCase.firm,
          difficulty: currentCase.difficulty,
          caseTitle: currentCase.title,
          duration: questionCount * 120,
          hintsUsed: 0,
          guidedScore: score,
        }),
      });
    } catch (err) {
      console.error("Failed to save session:", err);
    } finally {
      setSaving(false);
      setStage("complete");
    }
  };

  const getScoreLabel = (s: number) => {
    if (s >= 85) return "Exceptional";
    if (s >= 70) return "Strong";
    if (s >= 55) return "Competent";
    if (s >= 40) return "Developing";
    return "Needs Work";
  };

  const getScoreColor = (s: number) => {
    if (s >= 85) return "var(--success)";
    if (s >= 70) return "#84cc16";
    if (s >= 55) return "var(--warning)";
    if (s >= 40) return "#f97316";
    return "var(--danger)";
  };

  const navStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 48px",
    height: "60px",
    borderBottom: "1px solid var(--border)",
    position: "sticky" as const,
    top: 0,
    background: "rgba(255,255,255,0.98)",
    zIndex: 100,
  };

  // INTRO
  if (stage === "intro") {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)", overflowX: "hidden" }}>
        <nav style={navStyle}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: "22px", fontWeight: 500, cursor: "pointer" }} onClick={() => router.push("/")}>
            MyCasePrep
          </span>
          <button className="btn-secondary" style={{ padding: "7px 16px" }} onClick={() => router.push("/library")}>
            Back to Library
          </button>
        </nav>

        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 48px", boxSizing: "border-box" as const, width: "100%" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{
              display: "inline-block",
              padding: "4px 12px",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginBottom: "24px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
            }}>
              {firmConfig.name} · Guided Case · {currentCase.difficulty}
            </div>

            <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, marginBottom: "16px", letterSpacing: "-0.01em" }}>
              {currentCase.title}
            </h1>

            <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "40px" }}>
              {currentCase.overview}
            </p>

            <div className="card" style={{ padding: "28px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--text-secondary)", marginBottom: "14px", fontFamily: "Inter, sans-serif" }}>
                Client Background
              </h3>
              <p style={{ fontSize: "15px", lineHeight: 1.75 }}>{currentCase.clientBackground}</p>
            </div>

            <div className="card" style={{ padding: "28px", marginBottom: "40px", borderLeft: "3px solid #111111" }}>
              <h3 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--text-secondary)", marginBottom: "12px", fontFamily: "Inter, sans-serif" }}>
                Your Role
              </h3>
              <p style={{ fontSize: "15px", lineHeight: 1.75 }}>{currentCase.yourRole}</p>
            </div>

            <div style={{
              display: "flex",
              gap: "16px",
              padding: "20px 24px",
              background: "var(--bg-card)",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              marginBottom: "32px",
            }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Format</div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>Branching Path</div>
              </div>
              <div style={{ width: "1px", background: "var(--border)" }} />
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Duration</div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>{currentCase.estimatedMinutes} min</div>
              </div>
              <div style={{ width: "1px", background: "var(--border)" }} />
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Difficulty</div>
                <div style={{ fontSize: "14px", fontWeight: 600, textTransform: "capitalize" as const }}>{currentCase.difficulty}</div>
              </div>
            </div>

            <div style={{
              padding: "16px 20px",
              background: "var(--bg-card)",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              marginBottom: "32px",
              fontSize: "13px",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}>
              Each answer routes you down a different path. Your score reflects every decision you make. Read carefully — the right answer is not always the most obvious one.
            </div>

            <button className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: "15px" }} onClick={handleStart}>
              Begin Case →
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  // QUESTION
  if (stage === "question" && currentQuestion) {
    const progressPct = Math.min((questionCount / totalQuestions) * 100, 95);

    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)", overflowX: "hidden" }}>
        <nav style={navStyle}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: "22px", fontWeight: 500 }}>MyCasePrep</span>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              Question {questionCount + 1}
            </span>
            <div style={{
              fontSize: "13px",
              fontWeight: 600,
              color: getScoreColor(score),
            }}>
              Score: {score}
            </div>
          </div>
        </nav>

        {/* Progress bar */}
        <div style={{ height: "3px", background: "var(--border)", width: "100%" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
            style={{ height: "100%", background: "#111111" }}
          />
        </div>

        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 48px" }}>
          <motion.div key={currentQuestionId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

            <div style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "var(--text-secondary)",
              marginBottom: "8px",
            }}>
              {currentQuestion.stage}
            </div>

            <h2 style={{
              fontSize: "clamp(17px, 2.2vw, 22px)",
              fontWeight: 400,
              marginBottom: currentQuestion.context ? "16px" : "32px",
              lineHeight: 1.55,
              letterSpacing: "-0.01em",
            }}>
              {currentQuestion.question}
            </h2>

            {currentQuestion.context && (
              <p style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                marginBottom: "28px",
                padding: "14px 18px",
                background: "var(--bg-card)",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}>
                {currentQuestion.context}
              </p>
            )}

            {currentQuestion.exhibit && (
              <div className="card" style={{ padding: "24px", marginBottom: "28px" }}>
                <div style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  color: "var(--text-secondary)",
                  marginBottom: "14px",
                }}>
                  Exhibit: {currentQuestion.exhibit.title}
                </div>
                <pre style={{
                  fontSize: "12px",
                  lineHeight: 1.6,
                  color: "var(--text-primary)",
                  fontFamily: "'Courier New', Courier, monospace",
                  whiteSpace: "pre" as const,
                  overflowX: "auto" as const,
                  maxWidth: "100%",
                  margin: 0,
                  boxSizing: "border-box" as const,
                }}>
                  {currentQuestion.exhibit.data}
                </pre>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px", marginBottom: "28px" }}>
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOptionId === option.id;

                let borderColor = "var(--border)";
                let background = "var(--bg-card)";

                if (isSelected && !showFeedback) {
                  borderColor = "#111111";
                  background = "var(--bg-elevated)";
                }

                if (showFeedback && isSelected) {
                  if (option.scoreImpact > 10) {
                    borderColor = "var(--success)";
                    background = "rgba(34,197,94,0.04)";
                  } else if (option.scoreImpact > 0) {
                    borderColor = "var(--warning)";
                    background = "rgba(234,179,8,0.04)";
                  } else if (option.scoreImpact < 0) {
                    borderColor = "var(--danger)";
                    background = "rgba(220,38,38,0.04)";
                  } else {
                    borderColor = "var(--border)";
                  }
                }

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    style={{
                      padding: "18px 22px",
                      borderRadius: "8px",
                      border: `1px solid ${borderColor}`,
                      background,
                      cursor: showFeedback ? "default" : "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                      <div style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: `2px solid ${isSelected ? borderColor : "var(--border)"}`,
                        background: isSelected ? borderColor : "transparent",
                        flexShrink: 0,
                        marginTop: "3px",
                        transition: "all 0.15s",
                      }} />
                      <p style={{ fontSize: "15px", lineHeight: 1.65 }}>{option.text}</p>
                    </div>

                    <AnimatePresence>
                      {showFeedback && isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          style={{
                            marginTop: "14px",
                            paddingTop: "14px",
                            borderTop: "1px solid var(--border)",
                            fontSize: "14px",
                            lineHeight: 1.65,
                            color: option.scoreImpact > 10 ? "var(--success)" : option.scoreImpact > 0 ? "var(--warning)" : option.scoreImpact < 0 ? "var(--danger)" : "var(--text-secondary)",
                          }}
                        >
                          {option.feedback}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {!showFeedback ? (
              <button
                className="btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "15px", opacity: selectedOptionId ? 1 : 0.4 }}
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
              >
                Submit Answer
              </button>
            ) : (
              <button
                className="btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "15px" }}
                onClick={handleNext}
              >
                {selectedOption?.nextQuestionId === "end" ? "Continue to Final Recommendation →" : "Next →"}
              </button>
            )}
          </motion.div>
        </div>
      </main>
    );
  }

  // FINAL RECOMMENDATION
  if (stage === "final") {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)", overflowX: "hidden" }}>
        <nav style={navStyle}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: "22px", fontWeight: 500 }}>MyCasePrep</span>
        </nav>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 48px", boxSizing: "border-box" as const, width: "100%" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 400, marginBottom: "16px" }}>
              Final Recommendation
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "15px", lineHeight: 1.7 }}>
              {currentCase.finalRecommendationPrompt}
            </p>
            <textarea
              value={finalAnswer}
              onChange={e => setFinalAnswer(e.target.value)}
              placeholder="Write your recommendation here. Be specific about actions, timeline, and expected impact..."
              style={{
                width: "100%",
                minHeight: "180px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "18px",
                color: "var(--text-primary)",
                fontSize: "15px",
                fontFamily: "Inter, sans-serif",
                resize: "vertical" as const,
                outline: "none",
                lineHeight: 1.7,
                marginBottom: "24px",
              }}
            />
            <button
              className="btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: "15px", opacity: finalAnswer.trim().length > 40 ? (saving ? 0.7 : 1) : 0.4 }}
              onClick={handleSubmitFinal}
              disabled={finalAnswer.trim().length < 40 || saving}
            >
              {saving ? "Saving..." : "See Results →"}
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  // COMPLETE
  if (stage === "complete") {
    const scoreColor = getScoreColor(score);
    const scoreLabel = getScoreLabel(score);

    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)", overflowX: "hidden" }}>
        <nav style={navStyle}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: "22px", fontWeight: 500, cursor: "pointer" }} onClick={() => router.push("/")}>
            MyCasePrep
          </span>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="btn-secondary" style={{ padding: "7px 16px" }} onClick={() => router.push("/library")}>Library</button>
            <button className="btn-secondary" style={{ padding: "7px 16px" }} onClick={() => router.push("/history")}>History</button>
            <button className="btn-primary" style={{ padding: "7px 16px" }} onClick={() => router.push("/dashboard")}>Practice More</button>
          </div>
        </nav>

        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 48px" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <div style={{ fontSize: "80px", fontWeight: 700, color: scoreColor, fontFamily: "Cormorant, serif", lineHeight: 1 }}>
                {score}
              </div>
              <div style={{ fontSize: "16px", color: scoreColor, marginTop: "8px", fontWeight: 600 }}>{scoreLabel}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
                {questionCount} decisions across {questionCount} case moments
              </div>
            </div>

            <div className="card" style={{ padding: "28px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--text-secondary)", marginBottom: "16px", fontFamily: "Inter, sans-serif" }}>
                Ideal Recommendation
              </h3>
              <p style={{ fontSize: "15px", lineHeight: 1.8 }}>{currentCase.idealRecommendation}</p>
            </div>

            <div className="card" style={{ padding: "28px", marginBottom: "24px", borderLeft: "3px solid var(--border)" }}>
              <h3 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--text-secondary)", marginBottom: "16px", fontFamily: "Inter, sans-serif" }}>
                Your Recommendation
              </h3>
              <p style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--text-secondary)" }}>{finalAnswer}</p>
            </div>

            <div className="card" style={{ padding: "28px", marginBottom: "40px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--text-secondary)", marginBottom: "20px", fontFamily: "Inter, sans-serif" }}>
                Key Takeaways
              </h3>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "14px" }}>
                {currentCase.keyTakeaways.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: "1px",
                    }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: "14px", lineHeight: 1.65 }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-primary" style={{ flex: 1, padding: "14px", fontSize: "15px" }} onClick={() => router.push("/library")}>
                Try Another Case →
              </button>
              <button className="btn-secondary" style={{ flex: 1, padding: "14px", fontSize: "15px" }} onClick={() => router.push("/history")}>
                View History
              </button>
            </div>
          </motion.div>
        </div>
      </main>
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
  //
}