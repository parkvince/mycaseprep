"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { CaseType, Difficulty, FirmKey, Mode } from "@/types";
import Navbar from "@/components/Navbar";
import FloatingBlob from "@/components/FloatingBlob";
import { ArrowRight, BookOpen, X } from "lucide-react";
import { pickRandomInterviewer } from "@/lib/interviewers";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

const FIRM_SHORT_NAMES: Record<string, string> = {
  mckinsey: "McKinsey", bain: "Bain", bcg: "BCG", ey: "EY-Parthenon",
  deloitte: "Deloitte", kpmg: "KPMG", pwc: "PwC Strategy&",
  rolandberger: "Roland Berger", accenture: "Accenture",
  "oliver-wyman": "Oliver Wyman", kearney: "Kearney", lek: "L.E.K.",
  "monitor-deloitte": "Monitor Deloitte", ibm: "IBM Consulting",
  "capital-one": "Capital One", huron: "Huron",
};

const CASE_TYPES: { label: string; value: CaseType; desc: string }[] = [
  { label: "Market sizing", value: "market_sizing", desc: "Estimate a number — \"how many pianos are tuned in NYC?\"" },
  { label: "Profitability", value: "profitability", desc: "A company's profit dropped — find out why and fix it" },
  { label: "Market entry", value: "market_entry", desc: "Should this company enter a new market? Make the call" },
  { label: "M&A", value: "merger_acquisition", desc: "Should this company buy, or merge with, another one?" },
  { label: "Operations", value: "operations", desc: "Something in the business is inefficient — improve it" },
  { label: "Random", value: "random", desc: "Surprise me — good for well-rounded practice" },
];

const DIFFICULTIES: { label: string; value: Difficulty; desc: string; recommended?: boolean }[] = [
  { label: "Beginner", value: "beginner", desc: "Clear structure, straightforward data", recommended: true },
  { label: "Intermediate", value: "intermediate", desc: "Ambiguous prompts, complex analysis" },
  { label: "Advanced", value: "advanced", desc: "Partner-level rigor, high ambiguity" },
];

const MODES = [
  { value: "text", label: "Text", desc: "Type your answers — no time pressure to think", recommended: true },
  { value: "voice", label: "Voice", desc: "Speak your answers aloud, AI replies in text" },
  { value: "live", label: "Live interview", desc: "Full video call with a talking AI interviewer" },
];

const STYLES = [
  { value: "strict", label: "Strict", desc: "Senior partner. High bar, minimal hand-holding." },
  { value: "friendly", label: "Friendly", desc: "Friendly associate. Rigorous but encouraging." },
];

interface UsageStatus {
  allowed: boolean;
  unlimited?: boolean;
  casesUsed: number;
  casesRemaining: number | null;
  resetsAt: string | null;
}

function SectionLabel({ children, required, filled }: { children: React.ReactNode; required?: boolean; filled?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hp-soft-foreground)", fontFamily: FONT }}>
        {children}
      </div>
      {required && !filled && (
        <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--hp-primary)", fontFamily: FONT }}>
          required
        </span>
      )}
      {filled && (
        <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#15803d", fontFamily: FONT }}>
          ✓
        </span>
      )}
    </div>
  );
}

function RecommendedTag() {
  return (
    <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "#15803d", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "9999px", padding: "0.1rem 0.45rem", flexShrink: 0 }}>
      Good for starting out
    </span>
  );
}

function OptionCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.9rem 1.1rem", borderRadius: "12px",
        border: `1.5px solid ${selected ? "var(--hp-primary)" : "var(--hp-border)"}`,
        background: selected ? "var(--hp-primary-soft)" : "white",
        cursor: "pointer", transition: "all 0.15s",
        textAlign: "left", fontFamily: FONT, width: "100%",
      }}
    >
      {children}
    </button>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  const [selectedFirm, setSelectedFirm] = useState<FirmKey | null>(null);
  const [selectedType, setSelectedType] = useState<CaseType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedMode, setSelectedMode] = useState<Mode | "live" | null>(null);
  const [personality, setPersonality] = useState<"strict" | "friendly" | null>(null);
  const [loading, setLoading] = useState(false);
  const [genError, setGenError] = useState(false);
  const [usage, setUsage] = useState<UsageStatus | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);
  const [showGuideBanner, setShowGuideBanner] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!localStorage.getItem("mycaseprep_guide_visited")) setShowGuideBanner(true);
  }, []);

  const dismissGuideBanner = () => {
    localStorage.setItem("mycaseprep_guide_visited", "1");
    setShowGuideBanner(false);
  };

  const firmEntries = Object.entries(FIRM_CONFIGS) as [FirmKey, typeof FIRM_CONFIGS[FirmKey]][];

  const allSelected = selectedFirm && selectedType && selectedDifficulty && selectedMode && personality;

  const missingItems = [
    !selectedFirm && "a firm",
    !selectedType && "a case type",
    !selectedDifficulty && "a difficulty",
    !selectedMode && "a mode",
    !personality && "an interviewer style",
  ].filter(Boolean);

  useEffect(() => {
    fetch("/api/usage/check")
      .then(r => r.json())
      .then(setUsage)
      .catch(() => {})
      .finally(() => setUsageLoading(false));
  }, []);

  const formatResetsAt = (resetsAt: string) => {
    const diff = new Date(resetsAt).getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleStart = async () => {
    if (!usage?.allowed || !allSelected) return;
    setLoading(true);
    setGenError(false);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    try {
      const res = await fetch("/api/case/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firm: selectedFirm, type: selectedType, difficulty: selectedDifficulty }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("case generation failed");
      const caseData = await res.json();
      sessionStorage.setItem("caseData", JSON.stringify({
        firm: selectedFirm, type: selectedType, difficulty: selectedDifficulty,
        mode: selectedMode, personality,
        title: caseData.title, prompt: caseData.prompt, context: caseData.context ?? "",
        aiProvider: caseData.provider ?? null,
        // Picked here so every mode (live/voice/text) shows the same person for
        // this case — face, name, and TTS voice all stay consistent.
        interviewer: pickRandomInterviewer(),
      }));
      // The case is already generated and saved at this point — refreshing the
      // displayed usage count is a nice-to-have, not a gate. A blip here must
      // never strand the user on a case they already paid API cost to generate.
      router.push(selectedMode === "live" ? "/case/interview" : "/case/session");
      fetch("/api/usage/check").then(r => r.json()).then(setUsage).catch(() => {});
    } catch (err) {
      clearTimeout(timeoutId);
      console.error(err);
      setGenError(true);
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
      position: "relative", zIndex: 0,
    }}>
      <FloatingBlob src="/homepage/new-blob-computer.png" alt="" size={190} top="4%" left="3%" duration={7} rotate={-6} />
      <FloatingBlob src="/homepage/new-blob-writing.png" alt="" size={160} top="14%" right="10%" duration={7.5} delay={0.3} rotate={6} />
      <FloatingBlob src="/homepage/new-blob-dancing.png" alt="" size={150} top="26%" left="9%" duration={6.5} delay={0.6} rotate={-5} />
      <FloatingBlob src="/homepage/new-blob-bubbles.png" alt="" size={170} top="38%" right="1%" duration={8} delay={1} rotate={5} />
      <FloatingBlob src="/homepage/new-blob-gaming.png" alt="" size={160} top="50%" left="2%" duration={7} delay={0.4} rotate={-4} />
      <FloatingBlob src="/homepage/new3-blob-thumbsup.png" alt="" size={150} bottom="28%" right="9%" duration={6.5} delay={0.8} rotate={4} />
      <FloatingBlob src="/homepage/new3-blob-juggling.png" alt="" size={180} bottom="14%" left="8%" duration={8.5} delay={0.2} rotate={-6} />
      <FloatingBlob src="/homepage/new3-blob-skateboarding.png" alt="" size={160} bottom="2%" right="4%" duration={7} delay={1.2} rotate={5} />

      <Navbar />

      <style>{`
        @media (max-width: 560px) {
          .hp-dash-grid-3 { grid-template-columns: 1fr !important; }
          .hp-dash-grid-2 { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 561px) and (max-width: 720px) {
          .hp-dash-grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--hp-foreground)", margin: 0 }}>
            Start a case
          </h1>
          <p style={{ marginTop: "0.4rem", fontSize: "0.9rem", color: "var(--hp-soft-foreground)" }}>
            Configure your simulation and start practicing
          </p>
        </motion.div>

        {/* New-to-case-interviews banner */}
        {showGuideBanner && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: "1.5rem", padding: "1rem 1.25rem", borderRadius: "12px", border: "1px solid var(--hp-primary)", background: "var(--hp-primary-soft)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "9999px", background: "var(--hp-primary)", color: "white", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <BookOpen size={16} />
              </div>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--hp-foreground)" }}>New to case interviews?</div>
                <div style={{ fontSize: "0.78rem", color: "var(--hp-soft-foreground)" }}>The guide walks through the framework and what graders look for — takes about 2 minutes.</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
              <button onClick={() => { dismissGuideBanner(); router.push("/guide"); }} style={{ height: "34px", padding: "0 1rem", borderRadius: "9999px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
                Take the guide
              </button>
              <button onClick={dismissGuideBanner} aria-label="Dismiss" style={{ width: "30px", height: "30px", borderRadius: "9999px", border: "none", background: "transparent", color: "var(--hp-soft-foreground)", cursor: "pointer", display: "grid", placeItems: "center" }}>
                <X size={15} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Usage banner */}
        {!usageLoading && usage && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}
            style={{
              marginBottom: "1.5rem", padding: "1rem 1.25rem", borderRadius: "12px",
              border: `1px solid ${blocked ? "#fecaca" : "var(--hp-border)"}`,
              background: blocked ? "#fef2f2" : "white",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem",
            }}>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: blocked ? "#dc2626" : "var(--hp-foreground)", marginBottom: "2px" }}>
                {usage.unlimited ? "Unlimited AI cases" : blocked ? "AI case limit reached for this window" : `${usage.casesRemaining} AI case${usage.casesRemaining !== 1 ? "s" : ""} remaining this window`}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--hp-soft-foreground)" }}>
                {usage.unlimited
                  ? "No limit on this account"
                  : blocked
                  ? usage.resetsAt ? `Resets in ${formatResetsAt(usage.resetsAt)} · try a guided case in the meantime` : "Resets every 12 hours"
                  : `${usage.casesUsed} of ${usage.casesUsed + (usage.casesRemaining ?? 0)} used · resets every 12 hours`}
              </div>
            </div>
            {usage.unlimited ? null : blocked ? (
              <button onClick={() => router.push("/library")} style={{ height: "36px", padding: "0 1rem", borderRadius: "9999px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT, flexShrink: 0 }}>
                Browse guided cases
              </button>
            ) : (
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                {Array.from({ length: usage.casesUsed + (usage.casesRemaining ?? 0) }).map((_, i) => (
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
            <SectionLabel required filled={!!selectedFirm}>Firm</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.5rem" }}>
              {firmEntries.map(([key, config]) => (
                <OptionCard key={key} selected={selectedFirm === key} onClick={() => setSelectedFirm(key)}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: selectedFirm === key ? "var(--hp-primary)" : "var(--hp-foreground)", marginBottom: "2px" }}>
                    {FIRM_SHORT_NAMES[key] ?? config.name}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--hp-soft-foreground)" }}>
                    {config.style.split(",")[0].trim()}
                  </div>
                </OptionCard>
              ))}
            </div>
          </motion.div>

          {/* Case type */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}
            style={{ background: "white", borderRadius: "16px", border: "1px solid var(--hp-border)", padding: "1.4rem 1.5rem" }}>
            <SectionLabel required filled={!!selectedType}>Case type</SectionLabel>
            <div className="hp-dash-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {CASE_TYPES.map(t => (
                <OptionCard key={t.value} selected={selectedType === t.value} onClick={() => setSelectedType(t.value)}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: selectedType === t.value ? "var(--hp-primary)" : "var(--hp-foreground)", marginBottom: "3px" }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--hp-soft-foreground)", lineHeight: 1.4 }}>{t.desc}</div>
                </OptionCard>
              ))}
            </div>
          </motion.div>

          {/* Difficulty */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            style={{ background: "white", borderRadius: "16px", border: "1px solid var(--hp-border)", padding: "1.4rem 1.5rem" }}>
            <SectionLabel required filled={!!selectedDifficulty}>Difficulty</SectionLabel>
            <div className="hp-dash-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {DIFFICULTIES.map(d => (
                <OptionCard key={d.value} selected={selectedDifficulty === d.value} onClick={() => setSelectedDifficulty(d.value)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "3px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: selectedDifficulty === d.value ? "var(--hp-primary)" : "var(--hp-foreground)" }}>{d.label}</span>
                    {d.recommended && <RecommendedTag />}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--hp-soft-foreground)" }}>{d.desc}</div>
                </OptionCard>
              ))}
            </div>
          </motion.div>

          {/* Mode */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ background: "white", borderRadius: "16px", border: "1px solid var(--hp-border)", padding: "1.4rem 1.5rem" }}>
            <SectionLabel required filled={!!selectedMode}>Mode</SectionLabel>
            <div className="hp-dash-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {MODES.map(m => (
                <OptionCard key={m.value} selected={selectedMode === m.value} onClick={() => setSelectedMode(m.value as Mode | "live")}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "3px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: selectedMode === m.value ? "var(--hp-primary)" : "var(--hp-foreground)" }}>{m.label}</span>
                    {m.recommended && <RecommendedTag />}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--hp-soft-foreground)" }}>{m.desc}</div>
                </OptionCard>
              ))}
            </div>
          </motion.div>

          {/* Interviewer style */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            style={{ background: "white", borderRadius: "16px", border: "1px solid var(--hp-border)", padding: "1.4rem 1.5rem" }}>
            <SectionLabel required filled={!!personality}>Interviewer style</SectionLabel>
            <div className="hp-dash-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
              {STYLES.map(s => (
                <OptionCard key={s.value} selected={personality === s.value} onClick={() => setPersonality(s.value as "strict" | "friendly")}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: personality === s.value ? "var(--hp-primary)" : "var(--hp-foreground)", marginBottom: "3px" }}>{s.label}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--hp-soft-foreground)" }}>{s.desc}</div>
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
              <button onClick={() => router.push("/library")} style={{ width: "100%", height: "52px", borderRadius: "12px", border: "1px solid var(--hp-border-strong)", background: "white", color: "var(--hp-foreground)", fontSize: "1rem", fontWeight: 600, fontFamily: FONT, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                Browse guided cases instead <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Missing items hint */}
              {!allSelected && (
                <div style={{ fontSize: "0.8rem", color: "var(--hp-soft-foreground)", textAlign: "center", fontFamily: FONT }}>
                  Still need to select: {missingItems.join(", ")}
                </div>
              )}
              {genError && (
                <div style={{ fontSize: "0.8rem", color: "#dc2626", textAlign: "center", fontFamily: FONT }}>
                  Couldn&apos;t generate that case — likely a temporary connection issue. Try again.
                </div>
              )}
              <button
                onClick={handleStart}
                disabled={!allSelected || loading || usageLoading}
                style={{
                  width: "100%", height: "52px", borderRadius: "12px", border: "none",
                  background: allSelected ? "var(--hp-primary)" : "var(--hp-border)",
                  color: allSelected ? "white" : "var(--hp-soft-foreground)",
                  fontSize: "1rem", fontWeight: 700, fontFamily: FONT,
                  cursor: allSelected && !loading ? "pointer" : "not-allowed",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: allSelected ? "0 3px 0 oklch(0.4 0.16 285)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {loading ? "Generating your case..." : allSelected ? <> Start simulation <ArrowRight size={17} /></> : "Select all options to continue"}
              </button>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}