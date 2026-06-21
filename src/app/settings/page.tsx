"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { FirmKey, Difficulty } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [targetFirm, setTargetFirm] = useState<FirmKey>("mckinsey");
  const [targetRole, setTargetRole] = useState("Consultant");
  const [defaultDifficulty, setDefaultDifficulty] = useState<Difficulty>("intermediate");
  const [defaultPersonality, setDefaultPersonality] = useState<"strict" | "friendly">("strict");
  const [interviewTimeline, setInterviewTimeline] = useState("3-6 months");
  const [saved, setSaved] = useState(false);

  const firmEntries = Object.entries(FIRM_CONFIGS) as [FirmKey, typeof FIRM_CONFIGS[FirmKey]][];

  useEffect(() => {
    const stored = localStorage.getItem("mycaseprep_settings");
    if (stored) {
      const s = JSON.parse(stored);
      if (s.targetFirm) setTargetFirm(s.targetFirm);
      if (s.targetRole) setTargetRole(s.targetRole);
      if (s.defaultDifficulty) setDefaultDifficulty(s.defaultDifficulty);
      if (s.defaultPersonality) setDefaultPersonality(s.defaultPersonality);
      if (s.interviewTimeline) setInterviewTimeline(s.interviewTimeline);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("mycaseprep_settings", JSON.stringify({
      targetFirm, targetRole, defaultDifficulty, defaultPersonality, interviewTimeline,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const roles = ["Business Analyst", "Summer Analyst", "Associate", "Consultant", "Senior Consultant", "MBA Associate"];
  const timelines = ["Less than 1 month", "1-3 months", "3-6 months", "6+ months"];
  const difficulties: { label: string; value: Difficulty; desc: string }[] = [
    { label: "Beginner", value: "beginner", desc: "Clear structure, straightforward data" },
    { label: "Intermediate", value: "intermediate", desc: "Ambiguous prompts, complex analysis" },
    { label: "Advanced", value: "advanced", desc: "Partner-level rigor, high ambiguity" },
  ];

  const sectionLabel: React.CSSProperties = {
    fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "var(--text-secondary)",
    marginBottom: "16px", fontFamily: "Inter, sans-serif",
  };

  const optionCard = (selected: boolean): React.CSSProperties => ({
    padding: "12px 16px", borderRadius: "8px",
    border: `1px solid ${selected ? "#111111" : "var(--border)"}`,
    background: selected ? "var(--bg-elevated)" : "var(--bg-card)",
    cursor: "pointer", transition: "all 0.15s",
  });

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 48px", height: "60px", borderBottom: "1px solid var(--border)",
        position: "sticky", top: 0, background: "rgba(255,255,255,0.98)", zIndex: 100,
      }}>
        <span
          style={{ fontFamily: "Cormorant, serif", fontSize: "22px", fontWeight: 500, color: "#111111", cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          MyCasePrep
        </span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button className="btn-secondary" style={{ padding: "7px 16px" }} onClick={() => router.push("/dashboard")}>
            Start a Case
          </button>
          <button className="btn-secondary" style={{ padding: "7px 16px" }} onClick={() => router.push("/library")}>
            Case Library
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 48px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "56px" }}>
            <div>
              <h1 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 400, marginBottom: "8px", letterSpacing: "-0.01em" }}>
                Settings
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>Customize your practice preferences.</p>
            </div>

            {session?.user && (
              <div className="card" style={{ padding: "16px 20px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>
                  {session.user.name ?? session.user.email}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{session.user.email}</p>
              </div>
            )}
          </div>

          <div style={{ marginBottom: "40px" }}>
            <p style={sectionLabel}>Target Firm</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px" }}>
              {firmEntries.map(([key, config]) => (
                <div key={key} style={optionCard(targetFirm === key)} onClick={() => setTargetFirm(key)}>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{config.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <p style={sectionLabel}>Target Role</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px" }}>
              {roles.map((role) => (
                <div key={role} style={optionCard(targetRole === role)} onClick={() => setTargetRole(role)}>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{role}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <p style={sectionLabel}>Interview Timeline</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {timelines.map((t) => (
                <div key={t} style={optionCard(interviewTimeline === t)} onClick={() => setInterviewTimeline(t)}>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{t}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <p style={sectionLabel}>Default Difficulty</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {difficulties.map((d) => (
                <div key={d.value} style={optionCard(defaultDifficulty === d.value)} onClick={() => setDefaultDifficulty(d.value)}>
                  <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "3px" }}>{d.label}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{d.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "48px" }}>
            <p style={sectionLabel}>Default Interviewer Style</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
              {(["strict", "friendly"] as const).map((p) => (
                <div key={p} style={optionCard(defaultPersonality === p)} onClick={() => setDefaultPersonality(p)}>
                  <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "capitalize", marginBottom: "3px" }}>{p}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {p === "strict" ? "Senior partner. High bar, minimal hand-holding." : "Friendly associate. Rigorous but encouraging."}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", marginBottom: "40px" }} />

          <div style={{ marginBottom: "48px" }}>
            <p style={sectionLabel}>Account</p>
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Sign out</p>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Sign out of your MyCasePrep account.</p>
                </div>
                <button
                  className="btn-secondary"
                  style={{ padding: "7px 16px" }}
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: "15px" }}
            onClick={handleSave}
          >
            {saved ? "Saved!" : "Save Settings"}
          </button>

        </motion.div>
      </div>
    </main>
  );
}