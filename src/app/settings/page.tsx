"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { FirmKey, Difficulty } from "@/types";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";

export default function SettingsPage() {
  const router = useRouter();

  const [targetFirm, setTargetFirm] = useState<FirmKey>("mckinsey");
  const [targetRole, setTargetRole] = useState("Consultant");
  const [defaultDifficulty, setDefaultDifficulty] = useState<Difficulty>("intermediate");
  const [defaultPersonality, setDefaultPersonality] = useState<"strict" | "friendly">("strict");
  const [saved, setSaved] = useState(false);

  const firmEntries = Object.entries(FIRM_CONFIGS) as [FirmKey, typeof FIRM_CONFIGS[FirmKey]][];

  const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];

  const roles = [
    "Consultant",
    "Senior Consultant",
    "Associate",
    "Business Analyst",
    "Summer Analyst",
    "MBA Associate",
  ];

  const handleSave = () => {
    localStorage.setItem("settings", JSON.stringify({
      targetFirm,
      targetRole,
      defaultDifficulty,
      defaultPersonality,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
    padding: "12px 16px",
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

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 48px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "clamp(24px, 3vw, 36px)", marginBottom: "8px" }}>
            Settings
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "48px" }}>
            Customize your practice preferences.
          </p>

          {/* Target Firm */}
          <div style={{ marginBottom: "40px" }}>
            <p style={sectionLabel}>Target Firm</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
              {firmEntries.map(([key, config]) => (
                <div
                  key={key}
                  style={optionCard(targetFirm === key, config.color)}
                  onClick={() => setTargetFirm(key)}
                >
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{config.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Role */}
          <div style={{ marginBottom: "40px" }}>
            <p style={sectionLabel}>Target Role</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
              {roles.map((role) => (
                <div
                  key={role}
                  style={optionCard(targetRole === role)}
                  onClick={() => setTargetRole(role)}
                >
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Default Difficulty */}
          <div style={{ marginBottom: "40px" }}>
            <p style={sectionLabel}>Default Difficulty</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {difficulties.map((d) => (
                <div
                  key={d}
                  style={optionCard(defaultDifficulty === d)}
                  onClick={() => setDefaultDifficulty(d)}
                >
                  <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "capitalize" }}>{d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Default Interviewer Style */}
          <div style={{ marginBottom: "48px" }}>
            <p style={sectionLabel}>Default Interviewer Style</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {(["strict", "friendly"] as const).map((p) => (
                <div
                  key={p}
                  style={optionCard(defaultPersonality === p)}
                  onClick={() => setDefaultPersonality(p)}
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
            style={{ width: "100%", padding: "16px", fontSize: "15px" }}
            onClick={handleSave}
          >
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </motion.div>
      </div>
    </main>
  );
}