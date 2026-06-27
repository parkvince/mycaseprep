"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CaseType, Difficulty } from "@/types";
import { getCaseTypeLabel } from "@/lib/utils";
import { GUIDED_CASES } from "@/lib/guidedCases";
import { ArrowLeft, Clock, ChevronRight, CheckCircle2, Circle } from "lucide-react";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

const CASE_TYPES: { label: string; value: CaseType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Market sizing", value: "market_sizing" },
  { label: "Profitability", value: "profitability" },
  { label: "Market entry", value: "market_entry" },
  { label: "M&A", value: "merger_acquisition" },
  { label: "Operations", value: "operations" },
];

const DIFF_FILTERS: { label: string; value: Difficulty | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

function difficultyBadge(d: Difficulty): React.CSSProperties {
  const base: React.CSSProperties = {
    fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.6rem",
    borderRadius: "9999px", textTransform: "capitalize", fontFamily: FONT,
  };
  if (d === "beginner") return { ...base, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" };
  if (d === "intermediate") return { ...base, background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" };
  return { ...base, background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" };
}

function scoreColor(score: number): string {
  if (score >= 75) return "#15803d";
  if (score >= 50) return "#b45309";
  return "#b91c1c";
}

export default function LibraryPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<CaseType | "all">("all");
  const [diffFilter, setDiffFilter] = useState<Difficulty | "all">("all");
  const [sessionMap, setSessionMap] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/sessions/list")
      .then(r => r.json())
      .then(({ sessions }) => {
        // Build a map of caseTitle -> best overallScore
        const map: Record<string, number> = {};
        for (const s of sessions ?? []) {
          if (s.caseTitle && s.overallScore != null) {
            if (map[s.caseTitle] == null || s.overallScore > map[s.caseTitle]) {
              map[s.caseTitle] = s.overallScore;
            }
          }
        }
        setSessionMap(map);
      })
      .catch(() => {});
  }, []);

  const filtered = GUIDED_CASES.filter(c => {
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (diffFilter !== "all" && c.difficulty !== diffFilter) return false;
    return true;
  });

  const filterPill = (active: boolean): React.CSSProperties => ({
    padding: "0.35rem 0.9rem",
    borderRadius: "9999px",
    border: `1.5px solid ${active ? "var(--hp-primary)" : "var(--hp-border)"}`,
    background: active ? "var(--hp-primary)" : "white",
    color: active ? "white" : "var(--hp-soft-foreground)",
    fontSize: "0.8rem", fontWeight: 600,
    cursor: "pointer", fontFamily: FONT, transition: "all 0.15s",
  });

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

      {/* Nav */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.875rem 2.5rem",
        background: "oklch(0.97 0.03 290 / 0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--hp-border)",
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => router.back()}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", cursor: "pointer", color: "var(--hp-soft-foreground)", fontSize: "0.875rem", fontFamily: FONT, fontWeight: 500, padding: "0.3rem 0.5rem", borderRadius: "6px", transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--hp-foreground)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--hp-soft-foreground)")}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span style={{ width: "1px", height: "18px", background: "var(--hp-border)", display: "block" }} />
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--hp-foreground)" }}>Case library</span>
        </div>
        <span style={{ fontSize: "0.8rem", color: "var(--hp-soft-foreground)" }}>
          {filtered.length} of {GUIDED_CASES.length} cases
        </span>
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--hp-foreground)", margin: 0 }}>
            Guided cases
          </h1>
          <p style={{ marginTop: "0.4rem", fontSize: "0.9rem", color: "var(--hp-soft-foreground)" }}>
            {GUIDED_CASES.length} fully structured cases with exhibits, hints, and model answers
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)", padding: "1.1rem 1.4rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hp-soft-foreground)", marginBottom: "0.55rem" }}>Type</div>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {CASE_TYPES.map(t => (
                <button key={t.value} style={filterPill(typeFilter === t.value)} onClick={() => setTypeFilter(t.value)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hp-soft-foreground)", marginBottom: "0.55rem" }}>Difficulty</div>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {DIFF_FILTERS.map(d => (
                <button key={d.value} style={filterPill(diffFilter === d.value)} onClick={() => setDiffFilter(d.value as any)}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--hp-soft-foreground)", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)" }}>
            No cases match your filters
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "0.875rem" }}>
            {filtered.map((c, i) => {
              const bestScore = sessionMap[c.title];
              const completed = bestScore != null;

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.35) }}
                  onClick={() => router.push(`/case/guided?id=${c.id}`)}
                  style={{
                    background: "white",
                    borderRadius: "14px",
                    border: `1px solid ${completed ? "oklch(0.88 0.06 285)" : "var(--hp-border)"}`,
                    padding: "1.25rem 1.4rem",
                    cursor: "pointer",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                  whileHover={{ boxShadow: "0 4px 16px oklch(0.4 0.05 280 / 10%)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--hp-primary)"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = completed ? "oklch(0.88 0.06 285)" : "var(--hp-border)"}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--hp-soft-foreground)" }}>
                      {getCaseTypeLabel(c.type)}
                    </span>
                    <span style={difficultyBadge(c.difficulty)}>{c.difficulty}</span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: "0.925rem", fontWeight: 600, color: "var(--hp-foreground)", lineHeight: 1.45, fontFamily: FONT, margin: 0 }}>
                    {c.title}
                  </h3>

                  {/* Bottom row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--hp-soft-foreground)" }}>
                        <Clock size={11} />
                        {c.estimatedMinutes} min
                      </div>
                      {completed ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: scoreColor(bestScore), fontWeight: 600 }}>
                          <CheckCircle2 size={12} />
                          score {bestScore}
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--hp-soft-foreground)" }}>
                          <Circle size={12} />
                          not started
                        </div>
                      )}
                    </div>
                    <ChevronRight size={15} style={{ color: "var(--hp-primary)", flexShrink: 0 }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}