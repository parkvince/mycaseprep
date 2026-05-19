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
    const params = new URLSearchParams({
      firm,
      type,
      difficulty,
    });
    router.push(`/case/new?${params.toString()}`);
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      {/* Navbar */}
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
        <span style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "22px",
          fontWeight: 700,
        }}>
          MyCasePrep
        </span>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <button
            className="btn-secondary"
            onClick={() => router.push("/library")}
          >
            Case Library
          </button>
          <button
            className="btn-secondary"
            onClick={() => router.push("/settings")}
          >
            Settings
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 48px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "60px" }}
        >
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", marginBottom: "12px" }}>
            Start a Case
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
            Select a firm, case type, and difficulty to begin your simulation.
          </p>
        </motion.div>

        {/* Quick Start — Random Case */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: "60px" }}
        >
          <div
            className="card glow"
            style={{
              padding: "32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderColor: "var(--accent)",
              cursor: "pointer",
            }}
            onClick={() => handleStart("mckinsey", "random", "intermediate")}
          >
            <div>
              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "var(--accent)",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}>
                Quick Start
              </div>
              <h2 style={{
                fontSize: "22px",
                fontFamily: "Playfair Display, serif",
                marginBottom: "8px",
              }}>
                Random Case
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                Jump straight in. Random firm, random case type, intermediate difficulty.
              </p>
            </div>
            <div style={{
              fontSize: "32px",
              color: "var(--accent)",
              fontFamily: "Playfair Display, serif",
            }}>
              →
            </div>
          </div>
        </motion.div>

        {/* Firm Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: "48px" }}
        >
          <h2 style={{
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            marginBottom: "20px",
            fontFamily: "DM Sans, sans-serif",
          }}>
            Select Firm
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "12px",
          }}>
            {firmEntries.map(([key, config]) => (
              <div
                key={key}
                className="card"
                style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderLeft: `3px solid ${config.color}`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = config.color;
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-elevated)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)";
                }}
                onClick={() => handleStart(key, "random", "intermediate")}
              >
                <div style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}>
                  {config.name}
                </div>
                <div style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                }}>
                  {config.style.split(",")[0]}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Case Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: "48px" }}
        >
          <h2 style={{
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            marginBottom: "20px",
            fontFamily: "DM Sans, sans-serif",
          }}>
            Case Type
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "12px",
          }}>
            {caseTypes.map((type) => (
              <div
                key={type.value}
                className="card"
                style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLDivElement).style.color = "var(--accent)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLDivElement).style.color = "var(--text-primary)";
                }}
                onClick={() => handleStart("mckinsey", type.value, "intermediate")}
              >
                <div style={{ fontSize: "14px", fontWeight: 600 }}>
                  {type.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Difficulty Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 style={{
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            marginBottom: "20px",
            fontFamily: "DM Sans, sans-serif",
          }}>
            Difficulty
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "12px",
          }}>
            {difficulties.map((d) => (
              <div
                key={d.value}
                className="card"
                style={{
                  padding: "20px 24px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-elevated)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)";
                }}
                onClick={() => handleStart("mckinsey", "random", d.value)}
              >
                <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
                  {d.label}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
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