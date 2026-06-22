"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { FirmKey, Difficulty, Evaluation } from "@/types";
import { formatScore, formatScoreColor, formatDuration } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string | Date;
}

function FeedbackInner() {
  const router = useRouter();

  const [firm, setFirm] = useState<FirmKey>("mckinsey");
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [transcriptRaw, setTranscriptRaw] = useState("[]");
  const [caseTitle, setCaseTitle] = useState("Case Interview");
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
    } else {
      setLoading(false);
    }
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (!dataLoaded || transcriptRaw === "[]") return;
    const evaluate = async () => {
      try {
        const t = JSON.parse(transcriptRaw);
        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firm, difficulty, hintsUsed, transcript: t }),
        });
        const data = await res.json();
        setEvaluation(data);

        await fetch("/api/sessions/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "ai",
            firm,
            difficulty,
            caseTitle,
            duration,
            hintsUsed,
            overallScore: data.overallScore,
            transcript: t,
          }),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    evaluate();
  }, [dataLoaded, transcriptRaw, firm, difficulty, hintsUsed, caseTitle, duration]);

  const firmConfig = FIRM_CONFIGS[firm];

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: active ? "var(--accent)" : "transparent",
    color: active ? "white" : "var(--text-secondary)",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "DM Sans, sans-serif",
    fontWeight: 500,
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  });

  if (loading) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "2px solid var(--border)",
          borderTop: "2px solid var(--accent)",
          animation: "spin 1s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
          Evaluating your performance...
        </p>
        <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
          Applying {firmConfig.name} grading rubric
        </p>
      </main>
    );
  }

  if (!evaluation) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <p style={{ color: "var(--text-secondary)" }}>Failed to load evaluation. Please try again.</p>
      </main>
    );
  }

  const scoreColor = formatScoreColor(evaluation.overallScore);

  const breakdownItems = [
    { label: "Structure", key: "structure" },
    { label: "Problem Solving", key: "problemSolving" },
    { label: "Quantitative", key: "quantitative" },
    { label: "Communication", key: "communication" },
    { label: "Creativity", key: "creativity" },
  ] as const;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 48px",
        height: "60px",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        background: "rgba(255,255,255,0.98)",
        zIndex: 100,
      }}>
        <span
          style={{ fontFamily: "Cormorant, serif", fontSize: "22px", fontWeight: 500, color: "#111111", cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          MyCasePrep
        </span>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn-secondary" style={{ padding: "7px 16px" }} onClick={() => router.push("/dashboard")}>
            Practice Again
          </button>
          <button className="btn-primary" style={{ padding: "7px 16px" }} onClick={() => router.push("/history")}>
            View History
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 48px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "48px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: "8px",
              }}>
                Case Feedback · {firmConfig.name}
              </div>
              <h1 style={{ fontSize: "clamp(24px, 3vw, 36px)", marginBottom: "8px" }}>
                Your Scorecard
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                {formatDuration(duration)} · {hintsUsed} hint{hintsUsed !== 1 ? "s" : ""} used · {difficulty} difficulty
              </p>
            </div>

            <div style={{
              textAlign: "center",
              padding: "24px 32px",
              borderRadius: "12px",
              border: `2px solid ${scoreColor}`,
              background: "var(--bg-card)",
            }}>
              <div style={{
                fontSize: "52px",
                fontWeight: 700,
                color: scoreColor,
                fontFamily: "Cormorant, serif",
                lineHeight: 1,
              }}>
                {evaluation.overallScore}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>
                {formatScore(evaluation.overallScore)}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Top {100 - evaluation.percentileEstimate}%
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: "4px",
          marginBottom: "32px",
          background: "var(--bg-card)",
          padding: "4px",
          borderRadius: "10px",
          border: "1px solid var(--border)",
          width: "fit-content",
          flexWrap: "wrap",
        }}>
          <button style={tabStyle(activeTab === "overview")} onClick={() => setActiveTab("overview")}>Overview</button>
          <button style={tabStyle(activeTab === "breakdown")} onClick={() => setActiveTab("breakdown")}>Score Breakdown</button>
          <button style={tabStyle(activeTab === "ideal")} onClick={() => setActiveTab("ideal")}>Top 1% Answer</button>
          {transcript.length > 0 && (
            <button style={tabStyle(activeTab === "transcript")} onClick={() => setActiveTab("transcript")}>Transcript</button>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div className="card" style={{ padding: "28px" }}>
              <h3 style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--success)",
                marginBottom: "16px",
                fontFamily: "DM Sans, sans-serif",
              }}>
                What Went Well
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {evaluation.whatWentWell.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--success)",
                      marginTop: "8px",
                      flexShrink: 0,
                    }} />
                    <p style={{ fontSize: "15px", lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <h3 style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--warning)",
                marginBottom: "16px",
                fontFamily: "DM Sans, sans-serif",
              }}>
                Areas to Improve
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {evaluation.areasToImprove.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--warning)",
                      marginTop: "8px",
                      flexShrink: 0,
                    }} />
                    <p style={{ fontSize: "15px", lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{
              padding: "28px",
            }}>
              <h3 style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: "12px",
                fontFamily: "DM Sans, sans-serif",
              }}>
                {firmConfig.name} Note
              </h3>
              <p style={{ fontSize: "15px", lineHeight: 1.7 }}>{evaluation.firmSpecificNote}</p>
            </div>
          </motion.div>
        )}

        {/* Breakdown Tab */}
        {activeTab === "breakdown" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {breakdownItems.map((item) => {
              const score = evaluation.breakdown[item.key];
              const color = formatScoreColor(score);
              const weight = firmConfig.evaluationWeights[item.key];
              return (
                <div key={item.key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div>
                      <span style={{ fontSize: "15px", fontWeight: 600 }}>{item.label}</span>
                      <span style={{ marginLeft: "10px", fontSize: "11px", color: "var(--text-secondary)" }}>
                        {weight}% weight
                      </span>
                    </div>
                    <span style={{ fontSize: "15px", fontWeight: 700, color }}>{score}</span>
                  </div>
                  <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      style={{ height: "100%", background: color, borderRadius: "3px" }}
                    />
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Ideal Answer Tab */}
        {activeTab === "ideal" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ padding: "32px" }}
          >
            <h3 style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "20px",
              fontFamily: "DM Sans, sans-serif",
            }}>
              What a Top 1% Candidate Would Say
            </h3>
            <p style={{ fontSize: "15px", lineHeight: 1.8 }}>
              {evaluation.topCandidateResponse}
            </p>
          </motion.div>
        )}

        {/* Transcript Tab */}
        {activeTab === "transcript" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div style={{
              padding: "14px 18px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "13px",
              color: "var(--text-secondary)",
            }}>
              {transcript.length} messages · {formatDuration(duration)} session
            </div>

            {transcript.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  {msg.role === "assistant" && (
                    <div style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: firmConfig.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "white",
                      flexShrink: 0,
                    }}>
                      {firmConfig.name.charAt(0)}
                    </div>
                  )}
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}>
                    {msg.role === "user" ? "You" : firmConfig.name}
                  </span>
                </div>

                <div style={{
                  maxWidth: "720px",
                  padding: "16px 20px",
                  borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                  background: msg.role === "user" ? "#111111" : "var(--bg-card)",
                  border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  color: msg.role === "user" ? "#ffffff" : "var(--text-primary)",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        <div style={{ marginTop: "48px", display: "flex", gap: "12px" }}>
          <button
            className="btn-primary glow"
            style={{ flex: 1, padding: "16px", fontSize: "15px" }}
            onClick={() => router.push("/dashboard")}
          >
            Practice Another Case →
          </button>
          <button
            className="btn-secondary"
            style={{ flex: 1, padding: "16px", fontSize: "15px" }}
            onClick={() => router.push("/history")}
          >
            View History
          </button>
        </div>
      </div>
    </main>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense>
      <FeedbackInner />
    </Suspense>
  );
}


