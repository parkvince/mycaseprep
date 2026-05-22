"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GUIDED_CASES, GuidedCase, CaseQuestion } from "@/lib/guidedCases";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { FirmKey } from "@/types";

function GuidedCaseInner() {
  const router = useRouter();
  const params = useSearchParams();
  const caseId = params.get("id") ?? "g1";

  const currentCase = GUIDED_CASES.find(c => c.id === caseId);

  const [stage, setStage] = useState<"intro" | "question" | "feedback" | "final" | "complete">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean; selectedId: string }[]>([]);
  const [finalAnswer, setFinalAnswer] = useState("");

  if (!currentCase) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Case not found.</p>
      </main>
    );
  }

  const firmConfig = FIRM_CONFIGS[currentCase.firm as FirmKey];
  const currentQuestion = currentCase.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentCase.questions.length - 1;

  const handleSelectOption = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOption(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;
    const option = currentQuestion.options?.find(o => o.id === selectedOption);
    if (!option) return;

    setShowFeedback(true);
    if (option.correct) {
      setScore(s => s + 20);
    }
    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      correct: option.correct,
      selectedId: selectedOption,
    }]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setStage("final");
    } else {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setStage("question");
    }
  };

  const handleSubmitFinal = () => {
    setStage("complete");
  };

  const correctAnswers = answers.filter(a => a.correct).length;
  const finalScore = Math.round((correctAnswers / currentCase.questions.length) * 100);

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

  if (stage === "intro") {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
        <nav style={navStyle}>
          <span
            style={{ fontFamily: "Cormorant, serif", fontSize: "22px", fontWeight: 500, cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            MyCasePrep
          </span>
          <button className="btn-secondary" style={{ padding: "7px 16px" }} onClick={() => router.push("/library")}>
            Back to Library
          </button>
        </nav>

        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 48px" }}>
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
              textTransform: "uppercase",
            }}>
              {firmConfig.name} · Guided Case · {currentCase.difficulty}
            </div>

            <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, marginBottom: "16px", letterSpacing: "-0.01em" }}>
              {currentCase.title}
            </h1>

            <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "40px" }}>
              {currentCase.overview}
            </p>

            <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "16px", fontFamily: "Inter, sans-serif" }}>
                Client Background
              </h3>
              <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--text-primary)" }}>
                {currentCase.clientBackground}
              </p>
            </div>

            <div className="card" style={{ padding: "32px", marginBottom: "40px", borderLeft: `3px solid #111111` }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "12px", fontFamily: "Inter, sans-serif" }}>
                Your Role
              </h3>
              <p style={{ fontSize: "15px", lineHeight: 1.75 }}>
                {currentCase.yourRole}
              </p>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "32px", padding: "20px 24px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "Cormorant, serif" }}>{currentCase.questions.length}</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Questions</div>
              </div>
              <div style={{ width: "1px", height: "40px", background: "var(--border)" }} />
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "Cormorant, serif" }}>{currentCase.estimatedMinutes}</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Minutes</div>
              </div>
              <div style={{ width: "1px", height: "40px", background: "var(--border)" }} />
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "Cormorant, serif", textTransform: "capitalize" }}>{currentCase.difficulty}</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Difficulty</div>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: "100%", padding: "16px", fontSize: "15px" }}
              onClick={() => setStage("question")}
            >
              Begin Case →
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  if (stage === "question" || stage === "feedback") {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
        <nav style={navStyle}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: "22px", fontWeight: 500 }}>
            MyCasePrep
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              Question {currentQuestionIndex + 1} of {currentCase.questions.length}
            </span>
            <div style={{ width: "120px", height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                width: `${((currentQuestionIndex + 1) / currentCase.questions.length) * 100}%`,
                height: "100%",
                background: "#111111",
                borderRadius: "2px",
                transition: "width 0.3s",
              }} />
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "48px 48px" }}>
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              marginBottom: "8px",
            }}>
              Stage: {currentQuestion.stage}
            </div>

            <h2 style={{
              fontSize: "clamp(18px, 2.5vw, 24px)",
              fontWeight: 400,
              marginBottom: "32px",
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
            }}>
              {currentQuestion.question}
            </h2>

            {/* Exhibit */}
            {currentQuestion.exhibit && (
              <div className="card" style={{ padding: "28px", marginBottom: "32px" }}>
                <div style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  marginBottom: "16px",
                }}>
                  Exhibit: {currentQuestion.exhibit.title}
                </div>
                <pre style={{
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "var(--text-primary)",
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "pre-wrap",
                  overflowX: "auto",
                }}>
                  {currentQuestion.exhibit.data}
                </pre>
              </div>
            )}

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              {currentQuestion.options?.map((option) => {
                const isSelected = selectedOption === option.id;
                const isCorrect = option.correct;
                const showResult = showFeedback;

                let borderColor = "var(--border)";
                let background = "var(--bg-card)";
                let textColor = "var(--text-primary)";

                if (showResult) {
                  if (isCorrect) {
                    borderColor = "var(--success)";
                    background = "rgba(34,197,94,0.05)";
                  } else if (isSelected && !isCorrect) {
                    borderColor = "var(--danger)";
                    background = "rgba(220,38,38,0.05)";
                  }
                } else if (isSelected) {
                  borderColor = "#111111";
                  background = "var(--bg-elevated)";
                }

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    style={{
                      padding: "20px 24px",
                      borderRadius: "8px",
                      border: `1px solid ${borderColor}`,
                      background,
                      color: textColor,
                      cursor: showFeedback ? "default" : "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <div style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: `2px solid ${isSelected || (showResult && isCorrect) ? borderColor : "var(--border)"}`,
                        background: isSelected || (showResult && isCorrect) ? borderColor : "transparent",
                        flexShrink: 0,
                        marginTop: "2px",
                      }} />
                      <p style={{ fontSize: "15px", lineHeight: 1.6 }}>{option.text}</p>
                    </div>

                    {/* Explanation */}
                    <AnimatePresence>
                      {showFeedback && (isSelected || isCorrect) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          style={{
                            marginTop: "16px",
                            paddingTop: "16px",
                            borderTop: "1px solid var(--border)",
                            fontSize: "14px",
                            lineHeight: 1.65,
                            color: isCorrect ? "var(--success)" : "var(--danger)",
                          }}
                        >
                          {option.explanation}
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
                style={{ width: "100%", padding: "14px", fontSize: "15px", opacity: selectedOption ? 1 : 0.5 }}
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
              >
                Submit Answer
              </button>
            ) : (
              <button
                className="btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "15px" }}
                onClick={handleNext}
              >
                {isLastQuestion ? "Continue to Final Recommendation →" : "Next Question →"}
              </button>
            )}
          </motion.div>
        </div>
      </main>
    );
  }

  if (stage === "final") {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
        <nav style={navStyle}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: "22px", fontWeight: 500 }}>MyCasePrep</span>
        </nav>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 48px" }}>
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
                minHeight: "200px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "20px",
                color: "var(--text-primary)",
                fontSize: "15px",
                fontFamily: "Inter, sans-serif",
                resize: "vertical",
                outline: "none",
                lineHeight: 1.7,
                marginBottom: "24px",
              }}
            />
            <button
              className="btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: "15px", opacity: finalAnswer.trim().length > 50 ? 1 : 0.5 }}
              onClick={handleSubmitFinal}
              disabled={finalAnswer.trim().length < 50}
            >
              See Results & Ideal Answer →
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  if (stage === "complete") {
    const scoreColor = finalScore >= 80 ? "var(--success)" : finalScore >= 60 ? "var(--warning)" : "var(--danger)";
    const scoreLabel = finalScore >= 80 ? "Strong" : finalScore >= 60 ? "Developing" : "Needs Work";

    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
        <nav style={navStyle}>
          <span
            style={{ fontFamily: "Cormorant, serif", fontSize: "22px", fontWeight: 500, cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            MyCasePrep
          </span>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="btn-secondary" style={{ padding: "7px 16px" }} onClick={() => router.push("/library")}>
              Back to Library
            </button>
            <button className="btn-primary" style={{ padding: "7px 16px" }} onClick={() => router.push("/dashboard")}>
              Practice More
            </button>
          </div>
        </nav>

        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 48px" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

            {/* Score */}
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <div style={{ fontSize: "72px", fontWeight: 700, color: scoreColor, fontFamily: "Cormorant, serif", lineHeight: 1 }}>
                {finalScore}
              </div>
              <div style={{ fontSize: "16px", color: scoreColor, marginTop: "8px", fontWeight: 600 }}>{scoreLabel}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
                {correctAnswers} of {currentCase.questions.length} questions correct
              </div>
            </div>

            {/* Ideal Recommendation */}
            <div className="card" style={{ padding: "32px", marginBottom: "32px" }}>
              <h3 style={{
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: "16px",
                fontFamily: "Inter, sans-serif",
              }}>
                Ideal Recommendation
              </h3>
              <p style={{ fontSize: "15px", lineHeight: 1.8 }}>
                {currentCase.idealRecommendation}
              </p>
            </div>

            {/* Your Recommendation */}
            <div className="card" style={{ padding: "32px", marginBottom: "32px", borderLeft: "3px solid var(--border)" }}>
              <h3 style={{
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: "16px",
                fontFamily: "Inter, sans-serif",
              }}>
                Your Recommendation
              </h3>
              <p style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--text-secondary)" }}>
                {finalAnswer}
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="card" style={{ padding: "32px", marginBottom: "40px" }}>
              <h3 style={{
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: "20px",
                fontFamily: "Inter, sans-serif",
              }}>
                Key Takeaways
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                      marginTop: "2px",
                    }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: "14px", lineHeight: 1.65 }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className="btn-primary"
                style={{ flex: 1, padding: "14px", fontSize: "15px" }}
                onClick={() => router.push("/library")}
              >
                Try Another Case →
              </button>
              <button
                className="btn-secondary"
                style={{ flex: 1, padding: "14px", fontSize: "15px" }}
                onClick={() => router.push("/dashboard")}
              >
                AI Interview Mode
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
}