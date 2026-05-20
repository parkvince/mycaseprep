"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { FirmKey, Difficulty, Evaluation } from "@/types";
import { formatScore, formatScoreColor, formatDuration } from "@/lib/utils";

function FeedbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  const firm = (params.get("firm") ?? "mckinsey") as FirmKey;
  const difficulty = (params.get("difficulty") ?? "intermediate") as Difficulty;
  const hintsUsed = parseInt(params.get("hintsUsed") ?? "0");
  const duration = parseInt(params.get("duration") ?? "0");
  const transcriptRaw = params.get("transcript") ?? "[]";

  const firmConfig = FIRM_CONFIGS[firm];

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "breakdown" | "ideal">("overview");

  useEffect(() => {
    const evaluate = async () => {
      try {
        const transcript = JSON.parse(decodeURIComponent(transcriptRaw));

        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firm,
            difficulty,
            hintsUsed,
            transcript,
          }),
        });

        const data = await res.json();
        setEvaluation(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    evaluate();
  }, []);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "10px 24px",
    borderRadius: "8px",
    border: "none",
    background: active ? "var(--accent)" : "transparent",
    color: active ? "white" : "var(--text-secondary)",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "DM Sans, sans-serif",
    fontWeight: 500,
    transition: "all 0.2s",
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
        padding: "20px 48px",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(10px)",
        zIndex: 100,
      }}>
        <span
          style={{ fontFamily: "Playfair Display, serif", fontSize: "22px", fontWeight: 700, cursor: "pointer" }}
          onClick={() => router.push("/dashboard")}
        >
          MyCasePrep
        </span>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn-secondary" onClick={() => router.push("/case/new")}>
            Practice Again
          </button>
          <button className="btn-primary" onClick={() => router.push("/dashboard")}>
            Dashboard
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
                Case Feedback — {firmConfig.name}
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
                fontFamily: "Playfair Display, serif",
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
        }}>
          <button style={tabStyle(activeTab === "overview")} onClick={() => setActiveTab("overview")}>Overview</button>
          <button style={tabStyle(activeTab === "breakdown")} onClick={() => setActiveTab("breakdown")}>Score Breakdown</button>
          <button style={tabStyle(activeTab === "ideal")} onClick={() => setActiveTab("ideal")}>Top 1% Answer</button>
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
              borderLeft: `3px solid ${firmConfig.color}`,
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

        <div style={{ marginTop: "48px", display: "flex", gap: "12px" }}>
          <button
            className="btn-primary glow"
            style={{ flex: 1, padding: "16px", fontSize: "15px" }}
            onClick={() => router.push("/case/new")}
          >
            Practice Another Case →
          </button>
          <button
            className="btn-secondary"
            style={{ flex: 1, padding: "16px", fontSize: "15px" }}
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
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