"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { FirmKey, CaseType, Difficulty, Mode } from "@/types";

function CaseSetupInner() {
  const router = useRouter();
  const params = useSearchParams();

  const firm = (params.get("firm") ?? "mckinsey") as FirmKey;
  const type = (params.get("type") ?? "random") as CaseType;
  const difficulty = (params.get("difficulty") ?? "intermediate") as Difficulty;

  const [selectedFirm, setSelectedFirm] = useState<FirmKey>(firm);
  const [selectedType, setSelectedType] = useState<CaseType>(type);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(difficulty);
  const [selectedMode, setSelectedMode] = useState<Mode>("text");
  const [personality, setPersonality] = useState<"strict" | "friendly">("strict");
  const [loading, setLoading] = useState(false);

  const firmEntries = Object.entries(FIRM_CONFIGS) as [FirmKey, typeof FIRM_CONFIGS[FirmKey]][];

  const caseTypes: { label: string; value: CaseType }[] = [
    { label: "Market Sizing", value: "market_sizing" },
    { label: "Profitability", value: "profitability" },
    { label: "Market Entry", value: "market_entry" },
    { label: "M&A", value: "merger_acquisition" },
    { label: "Operations", value: "operations" },
    { label: "Random", value: "random" },
  ];

  const difficulties: { label: string; value: Difficulty }[] = [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ];

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

      const searchParams = new URLSearchParams({
        firm: selectedFirm,
        type: selectedType,
        difficulty: selectedDifficulty,
        mode: selectedMode,
        personality,
        title: caseData.title,
        prompt: caseData.prompt,
        context: caseData.context ?? "",
      });

      router.push(`/case/session?${searchParams.toString()}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    marginBottom: "16px",
    fontFamily: "DM Sans, sans-serif",
  };

  const optionCard = (selected: boolean, color?: string): React.CSSProperties => ({
    padding: "14px 18px",
    borderRadius: "8px",
    border: `1px solid ${selected ? (color ?? "var(--accent)") : "var(--border)"}`,
    background: selected ? "var(--bg-elevated)" : "var(--bg-card)",
    cursor: "pointer",
    transition: "all 0.15s",
    borderLeft: color ? `3px solid ${color}` : undefined,
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

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 48px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "clamp(24px, 3vw, 36px)", marginBottom: "8px" }}>
            Configure Your Case
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "48px" }}>
            Customize your simulation before starting.
          </p>

          <div style={{ marginBottom: "40px" }}>
            <p style={sectionLabel}>Firm</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
              {firmEntries.map(([key, config]) => (
                <div
                  key={key}
                  style={optionCard(selectedFirm === key, config.color)}
                  onClick={() => setSelectedFirm(key)}
                >
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{config.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <p style={sectionLabel}>Case Type</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
              {caseTypes.map((t) => (
                <div
                  key={t.value}
                  style={optionCard(selectedType === t.value)}
                  onClick={() => setSelectedType(t.value)}
                >
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <p style={sectionLabel}>Difficulty</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {difficulties.map((d) => (
                <div
                  key={d.value}
                  style={optionCard(selectedDifficulty === d.value)}
                  onClick={() => setSelectedDifficulty(d.value)}
                >
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{d.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <p style={sectionLabel}>Mode</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {(["text", "voice"] as Mode[]).map((m) => (
                <div
                  key={m}
                  style={optionCard(selectedMode === m)}
                  onClick={() => setSelectedMode(m)}
                >
                  <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "capitalize" }}>{m} Mode</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    {m === "text" ? "Type your answers" : "Speak your answers aloud"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "48px" }}>
            <p style={sectionLabel}>Interviewer Style</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {(["strict", "friendly"] as const).map((p) => (
                <div
                  key={p}
                  style={optionCard(personality === p)}
                  onClick={() => setPersonality(p)}
                >
                  <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "capitalize" }}>{p}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    {p === "strict" ? "Senior partner. High bar, minimal hand-holding." : "Friendly associate. Rigorous but encouraging."}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="btn-primary glow"
            style={{ width: "100%", fontSize: "16px", padding: "16px", opacity: loading ? 0.7 : 1 }}
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

export default function CaseSetupPage() {
  return (
    <Suspense>
      <CaseSetupInner />
    </Suspense>
  );
}