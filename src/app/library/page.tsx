"use client";

import { useRouter } from "next/navigation";
import { useState } from "motion/react";
import { motion } from "framer-motion";
import { CaseType, Difficulty, FirmKey } from "@/types";
import { getCaseTypeLabel, getDifficultyColor } from "@/lib/utils";

interface PrebuiltCase {
  id: string;
  title: string;
  type: CaseType;
  difficulty: Difficulty;
  firm: FirmKey;
  description: string;
  estimatedMinutes: number;
}

const PREBUILT_CASES: PrebuiltCase[] = [
  {
    id: "1",
    title: "Coffee Chain Profitability Decline",
    type: "profitability",
    difficulty: "beginner",
    firm: "mckinsey",
    description: "A major coffee chain has seen profits drop 20% over the last two years despite growing revenue. Diagnose the issue.",
    estimatedMinutes: 20,
  },
  {
    id: "2",
    title: "Ride-Sharing Market Entry in Southeast Asia",
    type: "market_entry",
    difficulty: "intermediate",
    firm: "bcg",
    description: "A US-based ride-sharing company wants to expand into Southeast Asia. Should they enter, and if so, how?",
    estimatedMinutes: 25,
  },
  {
    id: "3",
    title: "Hospital System Merger Evaluation",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "ey",
    description: "Two regional hospital systems are considering a merger. Evaluate the strategic and financial rationale.",
    estimatedMinutes: 30,
  },
  {
    id: "4",
    title: "Smartphone Market Size in India",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "bain",
    description: "Estimate the total addressable market for smartphones in India for the current year.",
    estimatedMinutes: 15,
  },
  {
    id: "5",
    title: "Airline Supply Chain Optimization",
    type: "operations",
    difficulty: "intermediate",
    firm: "deloitte",
    description: "A major airline is experiencing delays and cost overruns in its maintenance operations. Identify root causes and solutions.",
    estimatedMinutes: 25,
  },
  {
    id: "6",
    title: "Luxury Fashion Brand Digital Transformation",
    type: "market_entry",
    difficulty: "advanced",
    firm: "bcg",
    description: "A heritage luxury fashion house wants to build a direct-to-consumer digital channel without diluting brand equity.",
    estimatedMinutes: 30,
  },
  {
    id: "7",
    title: "Grocery Delivery Profitability",
    type: "profitability",
    difficulty: "intermediate",
    firm: "mckinsey",
    description: "A grocery delivery startup has scaled to $500M revenue but has never turned a profit. The board wants a path to profitability.",
    estimatedMinutes: 25,
  },
  {
    id: "8",
    title: "Number of Gas Stations in the US",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "bain",
    description: "Estimate the total number of gas stations currently operating in the United States.",
    estimatedMinutes: 15,
  },
  {
    id: "9",
    title: "Private Equity Acquisition of a SaaS Company",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "lek",
    description: "A PE firm is evaluating a $2B acquisition of a mid-market SaaS company with 30% YoY growth. Build the investment thesis.",
    estimatedMinutes: 35,
  },
  {
    id: "10",
    title: "Fast Food Chain Operational Turnaround",
    type: "operations",
    difficulty: "beginner",
    firm: "kpmg",
    description: "A fast food franchise is seeing increasing customer complaints about wait times. Diagnose and fix the operational issues.",
    estimatedMinutes: 20,
  },
  {
    id: "11",
    title: "EV Manufacturer Market Entry into Europe",
    type: "market_entry",
    difficulty: "advanced",
    firm: "rolandberger",
    description: "A Chinese EV manufacturer wants to enter the European market. Assess feasibility and recommend an entry strategy.",
    estimatedMinutes: 30,
  },
  {
    id: "12",
    title: "Streaming Platform Subscriber Growth",
    type: "profitability",
    difficulty: "intermediate",
    firm: "oliver_wyman",
    description: "A streaming platform has plateaued at 80M subscribers and is losing ground to competitors. Develop a growth strategy.",
    estimatedMinutes: 25,
  },
];

const caseTypes: { label: string; value: CaseType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Market Sizing", value: "market_sizing" },
  { label: "Profitability", value: "profitability" },
  { label: "Market Entry", value: "market_entry" },
  { label: "M&A", value: "merger_acquisition" },
  { label: "Operations", value: "operations" },
];

const difficulties: { label: string; value: Difficulty | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

export default function LibraryPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<CaseType | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all");

  const filtered = PREBUILT_CASES.filter((c) => {
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter) return false;
    return true;
  });

  const handleStart = (c: PrebuiltCase) => {
    const params = new URLSearchParams({
      firm: c.firm,
      type: c.type,
      difficulty: c.difficulty,
    });
    router.push(`/case/new?${params.toString()}`);
  };

  const filterBtn = (active: boolean): React.CSSProperties => ({
    padding: "8px 16px",
    borderRadius: "20px",
    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
    background: active ? "var(--accent-glow)" : "transparent",
    color: active ? "var(--accent)" : "var(--text-secondary)",
    cursor: "pointer",
    fontSize: "13px",
    fontFamily: "DM Sans, sans-serif",
    fontWeight: 500,
    transition: "all 0.15s",
  });

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
        <button className="btn-secondary" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </button>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 48px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "clamp(24px, 3vw, 36px)", marginBottom: "8px" }}>
            Case Library
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "40px" }}>
            {PREBUILT_CASES.length} pre-built cases across all types and difficulties.
          </p>

          {/* Filters */}
          <div style={{ marginBottom: "16px" }}>
            <p style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              marginBottom: "12px",
              fontFamily: "DM Sans, sans-serif",
            }}>
              Case Type
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {caseTypes.map((t) => (
                <button
                  key={t.value}
                  style={filterBtn(typeFilter === t.value)}
                  onClick={() => setTypeFilter(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <p style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              marginBottom: "12px",
              fontFamily: "DM Sans, sans-serif",
            }}>
              Difficulty
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  style={filterBtn(difficultyFilter === d.value)}
                  onClick={() => setDifficultyFilter(d.value as Difficulty | "all")}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cases Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "16px",
          }}>
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ padding: "24px", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-elevated)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)";
                }}
                onClick={() => handleStart(c)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                  }}>
                    {getCaseTypeLabel(c.type)}
                  </span>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: getDifficultyColor(c.difficulty),
                    textTransform: "capitalize",
                  }}>
                    {c.difficulty}
                  </span>
                </div>

                <h3 style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "10px",
                  fontFamily: "DM Sans, sans-serif",
                  lineHeight: 1.4,
                }}>
                  {c.title}
                </h3>

                <p style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "16px",
                }}>
                  {c.description}
                </p>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                }}>
                  <span>{c.estimatedMinutes} min</span>
                  <span>→</span>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--text-secondary)" }}>
              No cases match your filters.
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}