"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { CaseType, Difficulty, FirmKey, Mode } from "@/types";
import Navbar from "@/components/Navbar";
import { ArrowRight } from "lucide-react";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

const CASE_TYPES: { label: string; value: CaseType }[] = [
  { label: "Market sizing", value: "market_sizing" },
  { label: "Profitability", value: "profitability" },
  { label: "Market entry", value: "market_entry" },
  { label: "M&A", value: "merger_acquisition" },
  { label: "Operations", value: "operations" },
  { label: "Random", value: "random" },
];

const DIFFICULTIES: { label: string; value: Difficulty; desc: string }[] = [
  { label: "Beginner", value: "beginner", desc: "Clear structure, straightforward data" },
  { label: "Intermediate", value: "intermediate", desc: "Ambiguous prompts, complex analysis" },
  { label: "Advanced", value: "advanced", desc: "Partner-level rigor, high ambiguity" },
];

const MODES = [
  { value: "text", label: "Text", desc: "Type your answers" },
  { value: "voice", label: "Voice", desc: "Speak your answers aloud" },
  { value: "live", label: "Live interview", desc: "Video call with AI interviewer" },
];

const STYLES = [
  { value: "strict", label: "Strict", desc: "Senior partner. High bar, minimal hand-holding." },
  { value: "friendly", label: "Friendly", desc: "Friendly associate. Rigorous but encouraging." },
];

interface UsageStatus {
  allowed: boolean;
  casesUsed: number;
  casesRemaining: number;
  resetsAt: string | null;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hp-soft-foreground)", marginBottom: "0.75rem", fontFamily: FONT }}>
      {children}
    </div>
  );
}

function OptionCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.9rem 1.1rem",
        borderRadius: "12px",
        border: `1.5px solid ${selected ? "var(--hp-primary)" : "var(--hp-border)"}`,
        background: selected ? "var(--hp-primary-soft)" : "white",
        cursor: "pointer",
        transition: "all 0.15s",
        textAlign: "left",
        fontFamily: FONT,
        width: "100%",
      }}
    >
      {children}
    </button>
  );
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
    fetch("/api/usage/check")
      .then(r => r.json())
      .then(setUsage)
      .catch(() => {})
      .finally(() => setUsageLoading(false));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("mycaseprep_settings");
    if (stored) {
      const s = JSON.parse(stored);
      if (s.targetFirm) setSelectedFirm(s.targetFirm);
      if (s.defaultDifficulty) setSelectedDifficulty(s.defaultDifficulty);
      if (s.defaultPersonality) setPersonality(s.defaultPersonality);
    }
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
        body: JSON.stringify({ firm: selectedFirm, type: selectedType, difficulty: selectedDifficulty }),
      });
      if (!res.ok) { setLoading(false); return; }
      const caseData = await res.json();
      sessionStorage.setItem("caseData", JSON.stringify({
        firm: selectedFirm, type: selectedType, difficulty: selectedDifficulty,
        mode: selectedMode, personality,
        title: caseData.title, prompt: caseData.prompt, context: caseData.context ?? "",
      }));
      const usageRes = await fetch("/api/usage/check");
      setUsage(await usageRes.json());
      router.push(selectedMode === "live" ? "/case/interview" : "/case/session");
    } catch {
      setLoading(false);
    }
  };

  const blocked = usage?.allowed === false;

  return (
    <div style={{
      minHeight: "100vh", fontFamily: FONT,
      background: "var(--hp-bg)",
      backgroundImage: [
        "radial-gradient(at 8% 12%, var(--hp-lavender) 0px, transparent 45%)",
        "radial-gradient(at 92% 10%, var(--hp-peach) 0px, transparent 45%)",
        "radial-gradient(at 85% 92%, var(--hp-mint) 0px, transparent 50%)",
        "radial-gradient(at 10% 92%, var(--hp-sky) 0px, transparent 45%)",
      ].join(", "),
      backgroundAttachment: "fixed",
    }}>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--hp-foreground)", margin: 0 }}>
            Start a case
          </h1>
          <p style={{ marginTop: "0.4rem", fontSize: "0.9rem", color: "var(--hp-soft-foreground)" }}>
            Configure your simulation and start practicing
          </p>
        </motion.div>

        {/* Usage banner */}
        {!usageLoading && usage && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}
            style={{
              marginBottom: "1.5rem", padding: "1rem 1.25rem",
              borderRadius: "12px",
              border: `1px solid ${blocked ? "#fecaca" : "var(--hp-border)"}`,
              background: blocked ? "#fef2f2" : "white",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem",
            }}>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: blocked ? "#dc2626" : "var(--hp-foreground)", marginBottom: "2px" }}>
                {blocked ? "AI case limit reached for this window" : `${usage.casesRemaining} AI case${usage.casesRemaining !== 1 ? "s" : ""} remaining this window`}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--hp-soft-foreground)" }}>
                {blocked
                  ? usage.resetsAt ? `Resets in ${formatResetsAt(usage.resetsAt)} · Try a guided case in the meantime` : "Resets every 12 hours"
                  : `${usage.casesUsed} of 2 used · resets every 12 hours`
                }
              </div>
            </div>
            {blocked ? (
              <button
                onClick={() => router.push("/library")}
                style={{ height: "36px", padding: "0 1rem", borderRadius: "9999px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT, flexShrink: 0 }}
              >
                Browse guided cases
              </button>
            ) : (
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                {[0, 1].map(i => (
                  <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: i < usage.casesUsed ? "var(--hp-border-strong)" : "var(--hp-primary)", border: `1px solid ${i < usage.casesUsed ? "var(--hp-border-strong)" : "var(--hp-primary)"}` }} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", opacity: blocked ? 0.45 : 1, pointerEvents: blocked ? "none" : "auto", transition: "opacity 0.2s" }}>

          {/* Firm */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
            style={{ background: "white", borderRadius: "16px", border: "1px solid var(--hp-border)", padding: "1.4rem 1.5rem" }}>
            <SectionLabel>Firm</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "0.5rem" }}>
              {firmEntries.map(([key, config]) => (
                <OptionCard key={key} selected={selectedFirm === key} onClick={() => setSelectedFirm(key)}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: selectedFirm === key ? "var(--hp-primary)" : "var(--hp-foreground)", marginBottom: "2px" }}>
                    {config.name}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--hp-soft-foreground)" }}>
                    {config.style.split(",")[0].trim()}
                  </div>
                </OptionCard>
              ))}
            </div>
          </motion.div>

          {/* Case type */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}
            style={{ background: "white", borderRadius: "16px", border: "1px solid var(--hp-border)", padding: "1.4rem 1.5rem" }}>
            <SectionLabel>Case type</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {CASE_TYPES.map(t => (
                <OptionCard key={t.value} selected={selectedType === t.value} onClick={() => setSelectedType(t.value)}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: selectedType === t.value ? "var(--hp-primary)" : "var(--hp-foreground)", textAlign: "center" }}>
                    {t.label}
                  </div>
                </OptionCard>
              ))}
            </div>
          </motion.div>

          {/* Difficulty */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            style={{ background: "white", borderRadius: "16px", border: "1px solid var(--hp-border)", padding: "1.4rem 1.5rem" }}>
            <SectionLabel>Difficulty</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {DIFFICULTIES.map(d => (
                <OptionCard key={d.value} selected={selectedDifficulty === d.value} onClick={() => setSelectedDifficulty(d.value)}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: selectedDifficulty === d.value ? "var(--hp-primary)" : "var(--hp-foreground)", marginBottom: "3px" }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--hp-soft-foreground)" }}>{d.desc}</div>
                </OptionCard>
              ))}
            </div>
          </motion.div>

          {/* Mode */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ background: "white", borderRadius: "16px", border: "1px solid var(--hp-border)", padding: "1.4rem 1.5rem" }}>
            <SectionLabel>Mode</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {MODES.map(m => (
                <OptionCard key={m.value} selected={selectedMode === m.value} onClick={() => setSelectedMode(m.value as Mode | "live")}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: selectedMode === m.value ? "var(--hp-primary)" : "var(--hp-foreground)", marginBottom: "3px" }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--hp-soft-foreground)" }}>{m.desc}</div>
                </OptionCard>
              ))}
            </div>
          </motion.div>

          {/* Interviewer style */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            style={{ background: "white", borderRadius: "16px", border: "1px solid var(--hp-border)", padding: "1.4rem 1.5rem" }}>
            <SectionLabel>Interviewer style</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
              {STYLES.map(s => (
                <OptionCard key={s.value} selected={personality === s.value} onClick={() => setPersonality(s.value as "strict" | "friendly")}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: personality === s.value ? "var(--hp-primary)" : "var(--hp-foreground)", marginBottom: "3px" }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--hp-soft-foreground)" }}>{s.desc}</div>
                </OptionCard>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Start button */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} style={{ marginTop: "1.5rem" }}>
          {blocked ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button disabled style={{ width: "100%", height: "52px", borderRadius: "12px", border: "none", background: "var(--hp-border)", color: "var(--hp-soft-foreground)", fontSize: "1rem", fontWeight: 600, fontFamily: FONT, cursor: "not-allowed" }}>
                No AI cases remaining
              </button>
              <button
                onClick={() => router.push("/library")}
                style={{ width: "100%", height: "52px", borderRadius: "12px", border: "1px solid var(--hp-border-strong)", background: "white", color: "var(--hp-foreground)", fontSize: "1rem", fontWeight: 600, fontFamily: FONT, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                Browse guided cases instead <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleStart}
              disabled={loading || usageLoading}
              style={{
                width: "100%", height: "52px", borderRadius: "12px", border: "none",
                background: "var(--hp-primary)", color: "white",
                fontSize: "1rem", fontWeight: 700, fontFamily: FONT,
                cursor: loading || usageLoading ? "default" : "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                opacity: loading || usageLoading ? 0.7 : 1,
                boxShadow: "0 3px 0 oklch(0.4 0.16 285)",
                transition: "opacity 0.15s",
              }}
            >
              {loading ? "Generating your case..." : <>Start simulation <ArrowRight size={17} /></>}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}