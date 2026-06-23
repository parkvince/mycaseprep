"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDuration, formatScoreColor } from "@/lib/utils";
import Navbar from "@/components/Navbar";

interface SessionRecord {
  id: string;
  type: string;
  firm: string;
  difficulty: string;
  caseTitle: string;
  duration: number;
  hintsUsed: number;
  overallScore: number | null;
  guidedScore: number | null;
  completedAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/sessions/list");
        const data = await res.json();
        setSessions(data.sessions ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const avgScore = sessions.length > 0
    ? Math.round(
        sessions
          .filter(s => s.overallScore !== null || s.guidedScore !== null)
          .reduce((acc, s) => acc + (s.overallScore ?? s.guidedScore ?? 0), 0) /
        sessions.filter(s => s.overallScore !== null || s.guidedScore !== null).length
      )
    : null;

  const firmCounts = sessions.reduce((acc, s) => {
    acc[s.firm] = (acc[s.firm] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topFirm = Object.entries(firmCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
     <Navbar />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 48px" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "48px" }}
        >
          <h1 style={{
            fontSize: "clamp(26px, 3vw, 38px)",
            fontWeight: 400,
            marginBottom: "8px",
            letterSpacing: "-0.01em",
          }}>
            Session History
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            All your past practice sessions.
          </p>
        </motion.div>

        {/* Stats row */}
        {sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            {[
              { label: "Total Sessions", value: sessions.length },
              { label: "Average Score", value: avgScore ?? "—" },
              { label: "Most Practiced", value: topFirm ? topFirm.charAt(0).toUpperCase() + topFirm.slice(1) : "—" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card"
                style={{ padding: "24px 28px" }}
              >
                <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "Cormorant, serif" }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-secondary)" }}>
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "80px 0",
              border: "1px dashed var(--border)",
              borderRadius: "12px",
            }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginBottom: "16px" }}>
                No sessions yet. Complete a case to see your history here.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button className="btn-primary" style={{ padding: "9px 20px" }} onClick={() => router.push("/dashboard")}>
                  Start AI Case
                </button>
                <button className="btn-secondary" style={{ padding: "9px 20px" }} onClick={() => router.push("/library")}>
                  Browse Guided Cases
                </button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Case", "Type", "Firm", "Difficulty", "Score", "Duration", "Date"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 20px",
                          textAlign: "left",
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--text-secondary)",
                          fontFamily: "DM Sans, sans-serif",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, i) => {
                    const score = session.overallScore ?? session.guidedScore;
                    const scoreColor = score !== null ? formatScoreColor(score) : "var(--text-secondary)";
                    return (
                      <tr
                        key={session.id}
                        style={{
                          borderBottom: i < sessions.length - 1 ? "1px solid var(--border)" : "none",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "16px 20px", fontSize: "14px", fontWeight: 500, maxWidth: "200px" }}>
                          <span style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}>
                            {session.caseTitle}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: "20px",
                            border: "1px solid var(--border)",
                            color: "var(--text-secondary)",
                            textTransform: "capitalize",
                          }}>
                            {session.type}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", fontSize: "14px", textTransform: "capitalize" }}>
                          {session.firm}
                        </td>
                        <td style={{ padding: "16px 20px", fontSize: "14px", textTransform: "capitalize" }}>
                          {session.difficulty}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          {score !== null ? (
                            <span style={{ fontSize: "15px", fontWeight: 700, color: scoreColor }}>
                              {score}
                            </span>
                          ) : (
                            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "16px 20px", fontSize: "14px", color: "var(--text-secondary)" }}>
                          {formatDuration(session.duration)}
                        </td>
                        <td style={{ padding: "16px 20px", fontSize: "13px", color: "var(--text-secondary)" }}>
                          {new Date(session.completedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}