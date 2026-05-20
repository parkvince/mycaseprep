"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { CaseType, Difficulty, FirmKey } from "@/types";

const caseTypes: { label: string; value: CaseType }[] = [
  { label: "Market Sizing", value: "market_sizing" },
  { label: "Profitability", value: "profitability" },
  { label: "Market Entry", value: "market_entry" },
  { label: "M&A", value: "merger_acquisition" },
  { label: "Operations", value: "operations" },
  { label: "Random", value: "random" },
];

const difficulties: { label: string; value: Difficulty; desc: string }[] = [
  { label: "Beginner", value: "beginner", desc: "Clear structure, straightforward data" },
  { label: "Intermediate", value: "intermediate", desc: "Ambiguous prompts, complex analysis" },
  { label: "Advanced", value: "advanced", desc: "Partner-level rigor, high ambiguity" },
];

export default function DashboardPage() {
  const router = useRouter();

  const firmEntries = Object.entries(FIRM_CONFIGS) as [FirmKey, typeof FIRM_CONFIGS[FirmKey]][];

  const handleStart = (
    firm: FirmKey,
    type: CaseType,
    difficulty: Difficulty
  ) => {
    const params = new URLSearchParams({ firm, type, difficulty });
    router.push(`/case/new?${params.toString()}`);
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    marginBottom: "16px",
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
            onClick={() => router.push("/")}
          >
            Home
          </button>
          <button
            className="btn-secondary"
            style={{ padding: "7px 16px" }}
            onClick={() => router.push("/library")}
          >
            Case Library
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "56px" }}
        >
          <h1 style={{
            fontSize: "clamp(26px, 3vw, 38px)",
            fontWeight: 400,
            marginBottom: "8px",
            letterSpacing: "-0.01em",
          }}>
            Start a Case
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            Select a firm, case type, and difficulty to begin your simulation.
          </p>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ marginBottom: "56px" }}
        >
          <div
            className="card"
            style={{
              padding: "28px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "all 0.15s",
              borderColor: "#111111",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "var(--bg-elevated)"}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)"}
            onClick={() => handleStart("mckinsey", "random", "intermediate")}
          >
            <div>
              <div style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: "6px",
              }}>
                Quick Start
              </div>
              <h2 style={{
                fontSize: "20px",
                fontWeight: 400,
                fontFamily: "Cormorant, serif",
                marginBottom: "4px",
              }}>
                Random Case
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                Jump straight in. Random firm, random case type, intermediate difficulty.
              </p>
            </div>
            <span style={{ fontSize: "20px", color: "var(--text-secondary)" }}>→</span>
          </div>
        </motion.div>

        {/* Firm Selection */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: "48px" }}
        >
          <p style={sectionLabel}>Select Firm</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "8px",
          }}>
            {firmEntries.map(([key, config]) => (
              <div
                key={key}
                className="card"
                style={{
                  padding: "14px 18px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-elevated)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#111111";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                }}
                onClick={() => handleStart(key, "random", "intermediate")}
              >
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "3px" }}>
                  {config.name}
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  textTransform: "capitalize",
                }}>
                  {config.style.split(",")[0].trim().replace(/^\w/, c => c.toUpperCase())}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Case Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ marginBottom: "48px" }}
        >
          <p style={sectionLabel}>Case Type</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
          }}>
            {caseTypes.map((type) => (
              <div
                key={type.value}
                className="card"
                style={{
                  padding: "14px 18px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textAlign: "center",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-elevated)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#111111";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                }}
                onClick={() => handleStart("mckinsey", type.value, "intermediate")}
              >
                <div style={{ fontSize: "13px", fontWeight: 600 }}>
                  {type.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Difficulty Selection */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p style={sectionLabel}>Difficulty</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
          }}>
            {difficulties.map((d) => (
              <div
                key={d.value}
                className="card"
                style={{
                  padding: "20px 24px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-elevated)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#111111";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                }}
                onClick={() => handleStart("mckinsey", "random", d.value)}
              >
                <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                  {d.label}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {d.desc}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}