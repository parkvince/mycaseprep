"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { FIRM_CONFIGS } from "@/lib/prompts/firms";
import { FirmKey, Difficulty } from "@/types";
import Navbar from "@/components/Navbar";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [targetFirm, setTargetFirm] = useState<FirmKey>("mckinsey");
  const [targetRole, setTargetRole] = useState("Consultant");
  const [defaultDifficulty, setDefaultDifficulty] = useState<Difficulty>("intermediate");
  const [defaultPersonality, setDefaultPersonality] = useState<"strict" | "friendly">("strict");
  const [interviewTimeline, setInterviewTimeline] = useState("3-6 months");
  const [saved, setSaved] = useState(false);

  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

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

  useEffect(() => {
    if (session?.user) {
      setProfileName(session.user.name ?? "");
      setProfileImage(session.user.image ?? null);
    }
  }, [session]);

  const handleSave = () => {
    localStorage.setItem("mycaseprep_settings", JSON.stringify({
      targetFirm, targetRole, defaultDifficulty, defaultPersonality, interviewTimeline,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500000) {
      setProfileError("Image must be under 500KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async () => {
    setProfileError("");
    setProfileSaving(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, image: profileImage }),
      });
      const data = await res.json();
      if (!res.ok) { setProfileError(data.error); return; }
      await update({ name: data.name, image: data.image });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch {
      setProfileError("Something went wrong.");
    } finally {
      setProfileSaving(false);
    }
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
      <Navbar variant="settings" />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 48px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

          <h1 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 400, marginBottom: "8px", letterSpacing: "-0.01em" }}>
            Settings
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginBottom: "56px" }}>
            Customize your profile and practice preferences.
          </p>

          {/* Profile Section */}
          <div style={{ marginBottom: "48px" }}>
            <p style={sectionLabel}>Profile</p>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "28px", flexWrap: "wrap" as const }}>
                
                {/* Avatar */}
                <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "80px", height: "80px", borderRadius: "50%",
                    overflow: "hidden", border: "2px solid var(--border)",
                    background: "var(--bg-elevated)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "28px", fontWeight: 700, color: "var(--text-secondary)",
                    flexShrink: 0,
                  }}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      profileName?.charAt(0)?.toUpperCase() ?? "?"
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary"
                    style={{ padding: "5px 12px", fontSize: "12px" }}
                  >
                    Change photo
                  </button>
                  {profileImage && (
                    <button
                      onClick={() => setProfileImage(null)}
                      style={{
                        background: "none", border: "none", fontSize: "12px",
                        color: "var(--danger)", cursor: "pointer", padding: 0,
                      }}
                    >
                      Remove
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </div>

                {/* Name + Email */}
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "6px" }}>
                      Display name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      placeholder="Your name"
                      style={{
                        width: "100%", padding: "10px 14px",
                        border: "1px solid var(--border)", borderRadius: "8px",
                        fontSize: "14px", fontFamily: "Inter, sans-serif",
                        color: "var(--text-primary)", background: "var(--bg-card)",
                        outline: "none", boxSizing: "border-box" as const,
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = "#111")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "6px" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={session?.user?.email ?? ""}
                      disabled
                      style={{
                        width: "100%", padding: "10px 14px",
                        border: "1px solid var(--border)", borderRadius: "8px",
                        fontSize: "14px", fontFamily: "Inter, sans-serif",
                        color: "var(--text-secondary)", background: "var(--bg-elevated)",
                        outline: "none", boxSizing: "border-box" as const,
                        cursor: "not-allowed",
                      }}
                    />
                    <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                      Email cannot be changed.
                    </p>
                  </div>

                  {profileError && (
                    <p style={{ fontSize: "13px", color: "var(--danger)", marginBottom: "12px" }}>{profileError}</p>
                  )}

                  <button
                    className="btn-primary"
                    style={{ padding: "10px 24px", fontSize: "14px", opacity: profileSaving ? 0.7 : 1 }}
                    onClick={handleProfileSave}
                    disabled={profileSaving}
                  >
                    {profileSaved ? "Saved!" : profileSaving ? "Saving..." : "Save profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", marginBottom: "40px" }} />

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