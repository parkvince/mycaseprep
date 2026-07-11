"use client";

import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDuration } from "@/lib/utils";
import { ArrowLeft, Clock, BarChart2, Briefcase, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingBlob from "@/components/FloatingBlob";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

interface SessionRecord {
  id: string;
  type: string;
  caseType: string | null;
  firm: string;
  difficulty: string;
  caseTitle: string;
  duration: number;
  hintsUsed: number;
  overallScore: number | null;
  guidedScore: number | null;
  completedAt: string;
}

function scoreColor(score: number): string {
  if (score >= 75) return "#15803d";
  if (score >= 50) return "#b45309";
  return "#b91c1c";
}

function scoreBg(score: number): string {
  if (score >= 75) return "#f0fdf4";
  if (score >= 50) return "#fffbeb";
  return "#fef2f2";
}

function difficultyBadge(d: string): React.CSSProperties {
  const base: React.CSSProperties = {
    fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.6rem",
    borderRadius: "9999px", textTransform: "capitalize", fontFamily: FONT,
  };
  if (d === "beginner") return { ...base, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" };
  if (d === "intermediate") return { ...base, background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" };
  return { ...base, background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" };
}

function firmLabel(f: string): string {
  const map: Record<string, string> = {
    mckinsey: "McKinsey", bain: "Bain", bcg: "BCG", ey: "EY-Parthenon",
    deloitte: "Deloitte", kpmg: "KPMG", pwc: "PwC", rolandberger: "Roland Berger",
    accenture: "Accenture", "oliver-wyman": "Oliver Wyman", kearney: "Kearney",
    lek: "L.E.K.", "monitor-deloitte": "Monitor Deloitte", ibm: "IBM",
    "capital-one": "Capital One", huron: "Huron",
  };
  return map[f] ?? f.charAt(0).toUpperCase() + f.slice(1);
}

function typeLabel(t: string): string {
  const map: Record<string, string> = {
    profitability: "Profitability", market_sizing: "Market sizing",
    market_entry: "Market entry", merger_acquisition: "M&A",
    operations: "Operations", random: "Random",
  };
  return map[t] ?? t;
}

const FIRMS = [
  { label: "All firms", value: "all" },
  { label: "McKinsey", value: "mckinsey" },
  { label: "Bain", value: "bain" },
  { label: "BCG", value: "bcg" },
  { label: "EY-Parthenon", value: "ey" },
  { label: "Deloitte", value: "deloitte" },
  { label: "KPMG", value: "kpmg" },
  { label: "PwC", value: "pwc" },
  { label: "Roland Berger", value: "rolandberger" },
  { label: "Accenture", value: "accenture" },
  { label: "Oliver Wyman", value: "oliver-wyman" },
  { label: "Kearney", value: "kearney" },
  { label: "L.E.K.", value: "lek" },
  { label: "Monitor Deloitte", value: "monitor-deloitte" },
  { label: "IBM", value: "ibm" },
  { label: "Capital One", value: "capital-one" },
  { label: "Huron", value: "huron" },
];

const TYPES = [
  { label: "All types", value: "all" },
  { label: "Profitability", value: "profitability" },
  { label: "Market sizing", value: "market_sizing" },
  { label: "Market entry", value: "market_entry" },
  { label: "M&A", value: "merger_acquisition" },
  { label: "Operations", value: "operations" },
];

const SESSION_KINDS = [
  { label: "All", value: "all" },
  { label: "Guided", value: "guided" },
  { label: "AI", value: "ai" },
];

const DIFFICULTIES = [
  { label: "All", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

function ScoreTrend({ sessions }: { sessions: SessionRecord[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const points = sessions
    .filter(s => s.overallScore != null || s.guidedScore != null)
    .map(s => ({ date: s.completedAt, score: (s.overallScore ?? s.guidedScore) as number }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (points.length < 2) return null;

  const W = 640, H = 160, PAD_X = 14, PAD_Y = 22;
  const n = points.length;
  const xFor = (i: number) => PAD_X + (i / (n - 1)) * (W - PAD_X * 2);
  const yFor = (score: number) => H - PAD_Y - (score / 100) * (H - PAD_Y * 2);
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i).toFixed(1)} ${yFor(p.score).toFixed(1)}`).join(" ");

  const first = points[0].score;
  const last = points[points.length - 1].score;
  const delta = last - first;
  const deltaColor = delta > 0 ? "#15803d" : delta < 0 ? "#b91c1c" : "var(--hp-soft-foreground)";

  const handlePointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let closest = 0, closestDist = Infinity;
    points.forEach((_, i) => {
      const dist = Math.abs(xFor(i) - x);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    setHoverIdx(closest);
  };

  const hovered = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
      style={{ background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)", padding: "1.25rem 1.4rem", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hp-soft-foreground)" }}>
            Score over time
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--hp-soft-foreground)", marginTop: "2px" }}>
            Across your {n} scored sessions
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.9rem", fontWeight: 800, color: deltaColor }}>
          {delta > 0 ? <TrendingUp size={16} /> : delta < 0 ? <TrendingDown size={16} /> : <Minus size={16} />}
          {delta > 0 ? `+${delta}` : delta} since your first session
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", height: "auto", display: "block", cursor: "crosshair" }}
          onPointerMove={handlePointer}
          onPointerLeave={() => setHoverIdx(null)}
        >
          {[0, 50, 100].map(v => (
            <Fragment key={v}>
              <line x1={PAD_X} x2={W - PAD_X} y1={yFor(v)} y2={yFor(v)} stroke="var(--hp-border)" strokeWidth={1} />
              <text x={PAD_X} y={yFor(v) - 4} fontSize="9" fill="var(--hp-soft-foreground)">{v}</text>
            </Fragment>
          ))}

          {hoverIdx !== null && (
            <line x1={xFor(hoverIdx)} x2={xFor(hoverIdx)} y1={PAD_Y} y2={H - PAD_Y} stroke="var(--hp-border-strong)" strokeWidth={1} />
          )}

          <path d={linePath} fill="none" stroke="var(--hp-primary)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, i) => (
            <circle
              key={i} cx={xFor(i)} cy={yFor(p.score)} r={hoverIdx === i ? 6 : 5}
              fill="var(--hp-primary)" stroke="white" strokeWidth={2}
            />
          ))}
        </svg>

        {hovered && hoverIdx !== null && (
          <div style={{
            position: "absolute",
            left: `${(xFor(hoverIdx) / W) * 100}%`,
            top: `${(yFor(hovered.score) / H) * 100}%`,
            transform: hoverIdx < n / 2 ? "translate(8px, -130%)" : "translate(-108%, -130%)",
            background: "var(--hp-foreground)", color: "white", borderRadius: "8px",
            padding: "0.35rem 0.6rem", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap",
            pointerEvents: "none", boxShadow: "0 4px 12px oklch(0.4 0.05 280 / 20%)",
          }}>
            {new Date(hovered.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {hovered.score}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [firmFilter, setFirmFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState("all");
  const [diffFilter, setDiffFilter] = useState("all");

  useEffect(() => {
    fetch("/api/sessions/list")
      .then(r => r.json())
      .then(d => setSessions(d.sessions ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = sessions.filter(s => {
    if (firmFilter !== "all" && s.firm !== firmFilter) return false;
    if (typeFilter !== "all" && s.caseType !== typeFilter) return false;
    if (diffFilter !== "all" && s.difficulty !== diffFilter) return false;
    if (kindFilter === "guided" && s.type !== "guided") return false;
    if (kindFilter === "ai" && s.type === "guided") return false;
    return true;
  });

  // Stats from all sessions (not filtered)
  const scored = sessions.filter(s => s.overallScore != null || s.guidedScore != null);
  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((acc, s) => acc + (s.overallScore ?? s.guidedScore ?? 0), 0) / scored.length)
    : null;
  const firmCounts = sessions.reduce((acc, s) => {
    acc[s.firm] = (acc[s.firm] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topFirm = Object.entries(firmCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const totalMinutes = Math.round(sessions.reduce((acc, s) => acc + (s.duration ?? 0), 0) / 60);

  // Only show firms that actually appear in sessions
  const activeFirms = FIRMS.filter(f => f.value === "all" || sessions.some(s => s.firm === f.value));

  const filterPill = (active: boolean): React.CSSProperties => ({
    padding: "0.3rem 0.8rem",
    borderRadius: "9999px",
    border: `1.5px solid ${active ? "var(--hp-primary)" : "var(--hp-border)"}`,
    background: active ? "var(--hp-primary)" : "white",
    color: active ? "white" : "var(--hp-soft-foreground)",
    fontSize: "0.78rem", fontWeight: 600,
    cursor: "pointer", fontFamily: FONT, transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
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
      position: "relative", zIndex: 0,
    }}>

      <FloatingBlob src="/homepage/new2-blob-sleep.png" alt="" size={160} top="4%" left="3%" duration={7} rotate={-5} />
      <FloatingBlob src="/homepage/new3-blob-meditating.png" alt="" size={170} top="16%" right="9%" duration={6.5} delay={0.6} rotate={5} />
      <FloatingBlob src="/homepage/new3-blob-planting.png" alt="" size={160} top="34%" left="8%" duration={7.5} delay={1.1} rotate={-6} />
      <FloatingBlob src="/homepage/new3-blob-watering.png" alt="" size={150} top="50%" right="2%" duration={8} delay={0.3} rotate={4} />
      <FloatingBlob src="/homepage/new3-blob-fishing.png" alt="" size={170} bottom="32%" left="2%" duration={7} delay={0.8} rotate={-4} />
      <FloatingBlob src="/homepage/new3-blob-swimming.png" alt="" size={160} bottom="16%" right="8%" duration={6.5} delay={0.2} rotate={6} />
      <FloatingBlob src="/homepage/new2-blob-teddy.png" alt="" size={150} bottom="2%" left="5%" duration={8} delay={1} rotate={-5} />

      {/* Nav */}
      <Navbar />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--hp-foreground)", margin: 0 }}>
            Session history
          </h1>
          <p style={{ marginTop: "0.4rem", fontSize: "0.9rem", color: "var(--hp-soft-foreground)" }}>
            All your past practice sessions
          </p>
        </motion.div>

        {/* Stats */}
        {sessions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.875rem", marginBottom: "1.5rem" }}>
            {[
              { icon: <BarChart2 size={16} />, label: "Total sessions", value: sessions.length },
              { icon: <BarChart2 size={16} />, label: "Average score", value: avgScore != null ? avgScore : "—" },
              { icon: <Briefcase size={16} />, label: "Most practiced", value: topFirm ? firmLabel(topFirm) : "—" },
              { icon: <Clock size={16} />, label: "Total time", value: totalMinutes > 0 ? `${totalMinutes} min` : "—" },
            ].map(stat => (
              <div key={stat.label} style={{ background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)", padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--hp-soft-foreground)" }}>
                  <span style={{ color: "var(--hp-primary)" }}>{stat.icon}</span>
                  {stat.label}
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--hp-foreground)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Progress trend */}
        <ScoreTrend sessions={sessions} />

        {/* Filters */}
        {sessions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            style={{ background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)", padding: "1.1rem 1.4rem", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>

            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hp-soft-foreground)", marginBottom: "0.5rem" }}>Session type</div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {SESSION_KINDS.map(k => (
                  <button key={k.value} style={filterPill(kindFilter === k.value)} onClick={() => setKindFilter(k.value)}>
                    {k.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hp-soft-foreground)", marginBottom: "0.5rem" }}>Firm</div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {activeFirms.map(f => (
                  <button key={f.value} style={filterPill(firmFilter === f.value)} onClick={() => setFirmFilter(f.value)}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hp-soft-foreground)", marginBottom: "0.5rem" }}>Case type</div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {TYPES.map(t => (
                  <button key={t.value} style={filterPill(typeFilter === t.value)} onClick={() => setTypeFilter(t.value)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hp-soft-foreground)", marginBottom: "0.5rem" }}>Difficulty</div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {DIFFICULTIES.map(d => (
                  <button key={d.value} style={filterPill(diffFilter === d.value)} onClick={() => setDiffFilter(d.value)}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Sessions list */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "5rem", color: "var(--hp-soft-foreground)", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)" }}>
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)" }}>
              <p style={{ color: "var(--hp-soft-foreground)", fontSize: "0.95rem", marginBottom: "1.25rem" }}>
                No sessions yet. Complete a case to see your history here.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button
                  onClick={() => router.push("/dashboard")}
                  style={{ height: "38px", padding: "0 1.25rem", borderRadius: "9999px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT }}
                >
                  Start a case
                </button>
                <button
                  onClick={() => router.push("/library")}
                  style={{ height: "38px", padding: "0 1.25rem", borderRadius: "9999px", border: "1px solid var(--hp-border-strong)", background: "white", color: "var(--hp-foreground)", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT }}
                >
                  Browse library
                </button>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--hp-soft-foreground)", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)" }}>
              No sessions match your filters
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {filtered.map((s, i) => {
                const score = s.overallScore ?? s.guidedScore;
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.025, 0.3) }}
                    style={{
                      background: "white", borderRadius: "14px",
                      border: "1px solid var(--hp-border)", padding: "1.1rem 1.4rem",
                      display: "flex", alignItems: "center", gap: "1rem",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "var(--hp-primary)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px oklch(0.4 0.05 280 / 8%)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "var(--hp-border)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Score badge */}
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "12px", flexShrink: 0,
                      background: score != null ? scoreBg(score) : "var(--hp-primary-soft)",
                      display: "grid", placeItems: "center",
                    }}>
                      <span style={{ fontSize: "1rem", fontWeight: 800, color: score != null ? scoreColor(score) : "var(--hp-primary)", lineHeight: 1 }}>
                        {score != null ? score : "—"}
                      </span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--hp-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {s.caseTitle}
                      </div>
                      <div style={{ marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--hp-soft-foreground)", fontWeight: 500 }}>
                          {firmLabel(s.firm)}
                        </span>
                        <span style={{ color: "var(--hp-border)" }}>·</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--hp-soft-foreground)" }}>
                          {s.caseType ? typeLabel(s.caseType) : "General practice"}
                        </span>
                        {s.type === "guided" && (
                          <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.15rem 0.55rem", borderRadius: "9999px", background: "var(--hp-primary-soft)", color: "var(--hp-primary)" }}>
                            Guided
                          </span>
                        )}
                        <span style={{ color: "var(--hp-border)" }}>·</span>
                        <span style={difficultyBadge(s.difficulty)}>{s.difficulty}</span>
                      </div>
                    </div>

                    {/* Right */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--hp-soft-foreground)" }}>
                        {new Date(s.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--hp-soft-foreground)" }}>
                        <Clock size={11} />
                        {formatDuration(s.duration)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}