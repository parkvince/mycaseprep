"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { CaseType, Difficulty, FirmKey } from "@/types";
import { getCaseTypeLabel, getDifficultyColor } from "@/lib/utils";

interface PrebuiltCase {
  id: string;
  title: string;
  type: CaseType;
  difficulty: Difficulty;
  firm: FirmKey;
  estimatedMinutes: number;
}

const PREBUILT_CASES: PrebuiltCase[] = [
  {
    id: "1",
    title: "Coffee Chain Profitability Decline",
    type: "profitability",
    difficulty: "beginner",
    firm: "mckinsey",
    estimatedMinutes: 20,
  },
  {
    id: "2",
    title: "Ride-Sharing Market Entry in Southeast Asia",
    type: "market_entry",
    difficulty: "intermediate",
    firm: "bcg",
    estimatedMinutes: 25,
  },
  {
    id: "3",
    title: "Hospital System Merger Evaluation",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "ey",
    estimatedMinutes: 30,
  },
  {
    id: "4",
    title: "Smartphone Market Size in India",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "bain",
    estimatedMinutes: 15,
  },
  {
    id: "5",
    title: "Airline Supply Chain Optimization",
    type: "operations",
    difficulty: "intermediate",
    firm: "deloitte",
    estimatedMinutes: 25,
  },
  {
    id: "6",
    title: "Luxury Fashion Brand Digital Transformation",
    type: "market_entry",
    difficulty: "advanced",
    firm: "bcg",
    estimatedMinutes: 30,
  },
  {
    id: "7",
    title: "Grocery Delivery Profitability",
    type: "profitability",
    difficulty: "intermediate",
    firm: "mckinsey",
    estimatedMinutes: 25,
  },
  {
    id: "8",
    title: "Number of Gas Stations in the US",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "bain",
    estimatedMinutes: 15,
  },
  {
    id: "9",
    title: "Private Equity Acquisition of a SaaS Company",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "lek",
    estimatedMinutes: 35,
  },
  {
    id: "10",
    title: "Fast Food Chain Operational Turnaround",
    type: "operations",
    difficulty: "beginner",
    firm: "kpmg",
    estimatedMinutes: 20,
  },
  {
    id: "11",
    title: "EV Manufacturer Market Entry into Europe",
    type: "market_entry",
    difficulty: "advanced",
    firm: "rolandberger",
    estimatedMinutes: 30,
  },
  {
    id: "12",
    title: "Streaming Platform Subscriber Growth",
    type: "profitability",
    difficulty: "intermediate",
    firm: "oliver_wyman",
    estimatedMinutes: 25,
  },
  {
    id: "13",
    title: "Global Bank Cost Reduction Program",
    type: "operations",
    difficulty: "advanced",
    firm: "mckinsey",
    estimatedMinutes: 35,
  },
  {
    id: "14",
    title: "Pharmaceutical Company Market Entry into Generics",
    type: "market_entry",
    difficulty: "advanced",
    firm: "ey",
    estimatedMinutes: 30,
  },
  {
    id: "15",
    title: "Number of Uber Rides in New York City Per Day",
    type: "market_sizing",
    difficulty: "intermediate",
    firm: "bcg",
    estimatedMinutes: 20,
  },
  {
    id: "16",
    title: "Retail Bank Branch Profitability",
    type: "profitability",
    difficulty: "intermediate",
    firm: "oliver_wyman",
    estimatedMinutes: 25,
  },
  {
    id: "17",
    title: "Semiconductor Manufacturer Capacity Expansion",
    type: "operations",
    difficulty: "advanced",
    firm: "at_kearney",
    estimatedMinutes: 35,
  },
  {
    id: "18",
    title: "Sports League Media Rights Valuation",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "lek",
    estimatedMinutes: 35,
  },
  {
    id: "19",
    title: "Hotel Chain Turnaround Post-Pandemic",
    type: "profitability",
    difficulty: "intermediate",
    firm: "bain",
    estimatedMinutes: 25,
  },
  {
    id: "20",
    title: "EdTech Platform Market Entry into Southeast Asia",
    type: "market_entry",
    difficulty: "intermediate",
    firm: "bcg",
    estimatedMinutes: 25,
  },
  {
    id: "21",
    title: "Number of Wedding Photographers in the US",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "bain",
    estimatedMinutes: 15,
  },
  {
    id: "22",
    title: "Insurance Company Digital Transformation",
    type: "operations",
    difficulty: "intermediate",
    firm: "pwc",
    estimatedMinutes: 25,
  },
  {
    id: "23",
    title: "Merger of Two Regional Airlines",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "monitor_deloitte",
    estimatedMinutes: 35,
  },
  {
    id: "24",
    title: "Consumer Goods Company SKU Rationalization",
    type: "operations",
    difficulty: "intermediate",
    firm: "mckinsey",
    estimatedMinutes: 25,
  },
  {
    id: "25",
    title: "Hedge Fund Market Entry into Retail Investing",
    type: "market_entry",
    difficulty: "advanced",
    firm: "oliver_wyman",
    estimatedMinutes: 30,
  },
  {
    id: "26",
    title: "Declining Newspaper Profitability",
    type: "profitability",
    difficulty: "beginner",
    firm: "deloitte",
    estimatedMinutes: 20,
  },
  {
    id: "27",
    title: "Number of Golf Courses in the United States",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "mckinsey",
    estimatedMinutes: 15,
  },
  {
    id: "28",
    title: "University Hospital Operational Efficiency",
    type: "operations",
    difficulty: "intermediate",
    firm: "huron",
    estimatedMinutes: 25,
  },
  {
    id: "29",
    title: "Telecom Company 5G Infrastructure Rollout",
    type: "operations",
    difficulty: "advanced",
    firm: "ibm_consulting",
    estimatedMinutes: 35,
  },
  {
    id: "30",
    title: "Luxury Hotel Chain Acquisition",
    type: "merger_acquisition",
    difficulty: "intermediate",
    firm: "bain",
    estimatedMinutes: 30,
  },
  {
    id: "31",
    title: "Fast Fashion Brand Sustainability Strategy",
    type: "market_entry",
    difficulty: "intermediate",
    firm: "strategy_and",
    estimatedMinutes: 25,
  },
  {
    id: "32",
    title: "Revenue Decline at a Theme Park",
    type: "profitability",
    difficulty: "beginner",
    firm: "kpmg",
    estimatedMinutes: 20,
  },
  {
    id: "33",
    title: "Number of Commercial Flights Per Day Globally",
    type: "market_sizing",
    difficulty: "intermediate",
    firm: "bcg",
    estimatedMinutes: 20,
  },
  {
    id: "34",
    title: "Automotive OEM Electric Vehicle Strategy",
    type: "market_entry",
    difficulty: "advanced",
    firm: "rolandberger",
    estimatedMinutes: 35,
  },
  {
    id: "35",
    title: "Global Logistics Company Last-Mile Optimization",
    type: "operations",
    difficulty: "advanced",
    firm: "at_kearney",
    estimatedMinutes: 30,
  },
  {
    id: "36",
    title: "Fintech Startup Acquisition by a Major Bank",
    type: "merger_acquisition",
    difficulty: "intermediate",
    firm: "ey",
    estimatedMinutes: 30,
  },
  {
    id: "37",
    title: "Online Grocery Platform Profitability",
    type: "profitability",
    difficulty: "intermediate",
    firm: "mckinsey",
    estimatedMinutes: 25,
  },
  {
    id: "38",
    title: "Number of Electric Vehicle Charging Stations Needed in the US by 2030",
    type: "market_sizing",
    difficulty: "advanced",
    firm: "bcg",
    estimatedMinutes: 25,
  },
  {
    id: "39",
    title: "Private Equity Exit Strategy for a Portfolio Company",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "lek",
    estimatedMinutes: 35,
  },
  {
    id: "40",
    title: "Pharmaceutical Supply Chain Resilience",
    type: "operations",
    difficulty: "advanced",
    firm: "deloitte",
    estimatedMinutes: 30,
  },
  {
    id: "41",
    title: "Music Streaming Platform Profitability",
    type: "profitability",
    difficulty: "intermediate",
    firm: "bcg",
    estimatedMinutes: 25,
  },
  {
    id: "42",
    title: "Convenience Store Chain Market Expansion",
    type: "market_entry",
    difficulty: "beginner",
    firm: "bain",
    estimatedMinutes: 20,
  },
  {
    id: "43",
    title: "Number of Piano Teachers in the US",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "mckinsey",
    estimatedMinutes: 15,
  },
  {
    id: "44",
    title: "Defense Contractor Diversification into Commercial Markets",
    type: "market_entry",
    difficulty: "advanced",
    firm: "strategy_and",
    estimatedMinutes: 35,
  },
  {
    id: "45",
    title: "Regional Healthcare System Revenue Decline",
    type: "profitability",
    difficulty: "intermediate",
    firm: "huron",
    estimatedMinutes: 25,
  },
  {
    id: "46",
    title: "Merger of Two Global Accounting Firms",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "pwc",
    estimatedMinutes: 35,
  },
  {
    id: "47",
    title: "Smart Home Device Market Sizing",
    type: "market_sizing",
    difficulty: "intermediate",
    firm: "bain",
    estimatedMinutes: 20,
  },
  {
    id: "48",
    title: "Steel Manufacturer Cost Reduction",
    type: "operations",
    difficulty: "intermediate",
    firm: "rolandberger",
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
    router.push(`/dashboard?${params.toString()}`);
  };

  const filterBtn = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: "20px",
    border: `1px solid ${active ? "#111111" : "var(--border)"}`,
    background: active ? "#111111" : "transparent",
    color: active ? "#ffffff" : "var(--text-secondary)",
    cursor: "pointer",
    fontSize: "13px",
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    transition: "all 0.15s",
  });

  const sectionLabel: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    marginBottom: "12px",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      {/* Navbar */}
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
          style={{
            fontFamily: "Cormorant, serif",
            fontSize: "22px",
            fontWeight: 500,
            color: "#111111",
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          MyCasePrep
        </span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            className="btn-secondary"
            style={{ padding: "7px 16px" }}
            onClick={() => router.push("/dashboard")}
          >
            Start a Case
          </button>
          <button
            className="btn-secondary"
            style={{ padding: "7px 16px" }}
            onClick={() => router.push("/settings")}
          >
            Settings
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 48px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{
            fontSize: "clamp(26px, 3vw, 38px)",
            fontWeight: 400,
            marginBottom: "8px",
            letterSpacing: "-0.01em",
          }}>
            Case Library
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "40px", fontSize: "15px" }}>
            {PREBUILT_CASES.length} cases across all types and difficulties. Click any case to start practicing.
          </p>

          {/* Filters */}
          <div style={{ marginBottom: "16px" }}>
            <p style={sectionLabel}>Case Type</p>
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
            <p style={sectionLabel}>Difficulty</p>
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
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1px",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            overflow: "hidden",
          }}>
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  padding: "24px",
                  background: "var(--bg)",
                  borderRight: "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "var(--bg)"}
                onClick={() => handleStart(c)}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
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
                  fontSize: "15px",
                  fontWeight: 600,
                  marginBottom: "16px",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.4,
                  color: "var(--text-primary)",
                }}>
                  {c.title}
                </h3>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                }}>
                  <span>{c.estimatedMinutes} min</span>
                  <span style={{ fontSize: "14px" }}>→</span>
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