"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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

interface UsageStatus {
  allowed: boolean;
  casesUsed: number;
  casesRemaining: number;
  resetsAt: string | null;
}

export default function DashboardPage() {
  const router = useRouter();

  const [selectedFirm, setSelectedFirm] = useState<FirmKey>("mckinsey");
  const [selectedType, setSelectedType] = useState<CaseType>("random");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("intermediate");
  const [selectedMode, setSelectedMode] = useState<Mode | "live">("text");
  const [personality, setPersonality] = useState<"strict" | "friendly">("strict");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<UsageStatus | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);

  const firmEntries = Object.entries(FIRM_CONFIGS) as [FirmKey, typeof FIRM_CONFIGS[FirmKey]][];

  useEffect(() => {
    const checkUsage = async () => {
      try {
        const res = await fetch("/api/usage/check");
        const data = await res.json();
        setUsage(data);
      } catch (err) {
        console.error(err);
      } finally {
        setUsageLoading(false);
      }
    };
    checkUsage();
  }, []);

  const formatResetsAt = (resetsAt: string) => {
    const diff = new Date(resetsAt).getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleStart = async () => {
    if (!usage?.allowed) return;
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

      if (!res.ok) {
        const text = await res.text();
        console.error("API error:", res.status, text);
        setLoading(false);
        return;
      }

      const caseData = await res.json();

      // Increment usage counter as soon as case is generated
      await fetch("/api/usage/increment", { method: "POST" });

      sessionStorage.setItem("caseData", JSON.stringify({
        firm: selectedFirm,
        type: selectedType,
        difficulty: selectedDifficulty,
        mode: selectedMode,
        personality,
        title: caseData.title,
        prompt: caseData.prompt,
        context: caseData.context ?? "",
      }));

      // Refresh usage state
      const usageRes = await fetch("/api/usage/check");
      const usageData = await usageRes.json();
      setUsage(usageData);

      const route = selectedMode === "live"
        ? `/case/interview`
        : `/case/session`;

      router.push(route);
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
          suppressHydrationWarning
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
            onClick={() => router.push("/history")}
          >
            History
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

        {/* Usage banner */}
        {!usageLoading && usage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginBottom: "32px",
              padding: "16px 20px",
              borderRadius: "10px",
              border: `1px solid ${usage.allowed ? "var(--border)" : "#fca5a5"}`,
              background: usage.allowed ? "var(--bg-card)" : "#fff5f5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{
                fontSize: "13px",
                fontWeight: 600,
                color: usage.allowed ? "var(--text-primary)" : "#dc2626",
                marginBottom: "2px",
              }}>
                {usage.allowed
                  ? `${usage.casesRemaining} AI case${usage.casesRemaining !== 1 ? "s" : ""} remaining this window`
                  : "AI case limit reached for this window"}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {usage.allowed
                  ? `${usage.casesUsed} of 2 used · resets every 12 hours`
                  : usage.resetsAt
                    ? `Resets in ${formatResetsAt(usage.resetsAt)} · Try a guided case in the meantime`
                    : "Resets every 12 hours"}
              </div>
            </div>
            {!usage.allowed && (
              <button
                className="btn-primary"
                style={{ padding: "8px 18px", fontSize: "13px", flexShrink: 0 }}
                onClick={() => router.push("/library")}
              >
                Browse Guided Cases →
              </button>
            )}
            {usage.allowed && (
              <div style={{ display: "flex", gap: "6px" }}>
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: i < usage.casesUsed ? "var(--text-secondary)" : "#111111",
                      border: "1px solid #111111",
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Firm */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ marginBottom: "40px", opacity: usage?.allowed === false ? 0.4 : 1, pointerEvents: usage?.allowed === false ? "none" : "auto" }}
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
          style={{ marginBottom: "40px", opacity: usage?.allowed === false ? 0.4 : 1, pointerEvents: usage?.allowed === false ? "none" : "auto" }}
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
          style={{ marginBottom: "40px", opacity: usage?.allowed === false ? 0.4 : 1, pointerEvents: usage?.allowed === false ? "none" : "auto" }}
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
          style={{ marginBottom: "40px", opacity: usage?.allowed === false ? 0.4 : 1, pointerEvents: usage?.allowed === false ? "none" : "auto" }}
        >
          <p style={sectionLabel}>Mode</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {[
              { value: "text", label: "Text", desc: "Type your answers" },
              { value: "voice", label: "Voice", desc: "Speak your answers aloud" },
              { value: "live", label: "Live Interview", desc: "Video call with AI interviewer" },
            ].map((m) => (
              <div
                key={m.value}
                style={{
                  ...optionCard(selectedMode === m.value),
                  ...(m.value === "live" ? {
                    borderColor: selectedMode === "live" ? "#111111" : "var(--border)",
                    background: selectedMode === "live" ? "#111111" : "var(--bg-card)",
                    color: selectedMode === "live" ? "#ffffff" : "var(--text-primary)",
                  } : {})
                }}
                onClick={() => setSelectedMode(m.value as Mode | "live")}
              >
                <div style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "3px",
                  color: selectedMode === m.value && m.value === "live" ? "#ffffff" : "inherit",
                }}>
                  {m.label}
                </div>
                <div style={{
                  fontSize: "12px",
                  color: selectedMode === m.value && m.value === "live"
                    ? "rgba(255,255,255,0.6)"
                    : "var(--text-secondary)",
                }}>
                  {m.desc}
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
          style={{ marginBottom: "48px", opacity: usage?.allowed === false ? 0.4 : 1, pointerEvents: usage?.allowed === false ? "none" : "auto" }}
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
          {usage?.allowed === false ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "15px",
                  opacity: 0.4,
                  cursor: "not-allowed",
                }}
                disabled
              >
                No AI Cases Remaining
              </button>
              <button
                className="btn-secondary"
                style={{ width: "100%", padding: "16px", fontSize: "15px" }}
                onClick={() => router.push("/library")}
              >
                Browse Guided Cases Instead →
              </button>
            </div>
          ) : (
            <button
              className="btn-primary"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "15px",
                opacity: loading ? 0.7 : 1,
              }}
              onClick={handleStart}
              disabled={loading || usageLoading}
            >
              {loading ? "Generating your case..." : "Start Simulation →"}
            </button>
          )}
        </motion.div>

      </div>
    </main>
  );
} 



//