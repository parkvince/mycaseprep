"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { CaseType, Difficulty, FirmKey, Mode } from "@/types";

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

  const [selectedFirm, setSelectedFirm] = useState<FirmKey>("mckinsey");
  const [selectedType, setSelectedType] = useState<CaseType>("random");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("intermediate");
  const [selectedMode, setSelectedMode] = useState<Mode>("text");
  const [personality, setPersonality] = useState<"strict" | "friendly">("strict");
  const [loading, setLoading] = useState(false);

  const firmEntries = Object.entries(FIRM_CONFIGS) as [FirmKey, typeof FIRM_CONFIGS[FirmKey]][];

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/case/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firm: selectedFirm,
          type: selectedType,
          difficulty: selectedDifficulty,
        }),
      });

      const caseData = await res.json();

      const params = new URLSearchParams({
        firm: selectedFirm,
        type: selectedType,
        difficulty: selectedDifficulty,
        mode: selectedMode,
        personality,
        title: caseData.title,
        prompt: caseData.prompt,
        context: caseData.context ?? "",
      });

      router.push(`/case/session?${params.toString()}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
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

  const optionCard = (selected: boolean): React.CSSProperties => ({
    padding: "14px 18px",
    borderRadius: "8px",
    border: `1px solid ${selected ? "#111111" : "var(--border)"}`,
    background: selected ? "var(--bg-elevated)" : "var(--bg-card)",
    cursor: "pointer",
    transition: "all 0.15s",
  });

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
            Start a Case
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            Configure your simulation and start practicing.
          </p>
        </motion.div>

        {/* Firm */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ marginBottom: "40px" }}
        >
          <p style={sectionLabel}>Firm</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "8px",
          }}>
            {firmEntries.map(([key, config]) => (
              <div
                key={key}
                style={optionCard(selectedFirm === key)}
                onClick={() => setSelectedFirm(key)}
              >
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "3px" }}>
                  {config.name}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                  {config.style.split(",")[0].trim().charAt(0).toUpperCase() + config.style.split(",")[0].trim().slice(1)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Case Type */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: "40px" }}
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
                style={{
                  ...optionCard(selectedType === type.value),
                  textAlign: "center",
                }}
                onClick={() => setSelectedType(type.value)}
              >
                <div style={{ fontSize: "13px", fontWeight: 600 }}>{type.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Difficulty */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ marginBottom: "40px" }}
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
                style={optionCard(selectedDifficulty === d.value)}
                onClick={() => setSelectedDifficulty(d.value)}
              >
                <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>{d.label}</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mode */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: "40px" }}
        >
          <p style={sectionLabel}>Mode</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
            {(["text", "voice"] as Mode[]).map((m) => (
              <div
                key={m}
                style={optionCard(selectedMode === m)}
                onClick={() => setSelectedMode(m)}
              >
                <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "capitalize", marginBottom: "3px" }}>
                  {m} Mode
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {m === "text" ? "Type your answers" : "Speak your answers aloud"}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Interviewer Style */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{ marginBottom: "48px" }}
        >
          <p style={sectionLabel}>Interviewer Style</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
            {(["strict", "friendly"] as const).map((p) => (
              <div
                key={p}
                style={optionCard(personality === p)}
                onClick={() => setPersonality(p)}
              >
                <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "capitalize", marginBottom: "3px" }}>
                  {p}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {p === "strict" ? "Senior partner. High bar, minimal hand-holding." : "Friendly associate. Rigorous but encouraging."}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className="btn-primary"
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "15px",
              opacity: loading ? 0.7 : 1,
            }}
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? "Generating your case..." : "Start Simulation →"}
          </button>
        </motion.div>

      </div>
    </main>
  );
}