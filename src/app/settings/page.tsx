"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { LogOut, User, Briefcase, Sliders, Mic } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingBlob from "@/components/FloatingBlob";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

const FIRMS = [
  "McKinsey & Company", "Bain & Company", "Boston Consulting Group",
  "EY-Parthenon", "Deloitte", "KPMG", "PwC Strategy&",
  "Roland Berger", "Accenture", "Oliver Wyman", "Kearney",
  "L.E.K. Consulting", "Monitor Deloitte", "IBM Consulting",
  "Capital One", "Huron Consulting",
];

const ROLES = [
  "Business Analyst", "Summer Analyst", "Associate",
  "Consultant", "Senior Consultant", "MBA Associate",
];

const TIMELINES = [
  "Less than 1 month", "1–3 months", "3–6 months", "6+ months",
];

const DIFFICULTIES = [
  { value: "beginner", label: "Beginner", desc: "Clear structure, straightforward data" },
  { value: "intermediate", label: "Intermediate", desc: "Ambiguous prompts, complex analysis" },
  { value: "advanced", label: "Advanced", desc: "Partner-level rigor, high ambiguity" },
];

const STYLES = [
  { value: "strict", label: "Strict", desc: "Senior partner. High bar, minimal hand-holding." },
  { value: "friendly", label: "Friendly", desc: "Friendly associate. Rigorous but encouraging." },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--hp-soft-foreground)", marginBottom: "0.5rem", fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {children}
    </div>
  );
}

function StyledSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", padding: "0.65rem 1rem", borderRadius: "10px",
        border: "1px solid var(--hp-border)", background: "var(--hp-bg)",
        color: "var(--hp-foreground)", fontSize: "0.9rem", fontFamily: FONT,
        fontWeight: 500, cursor: "pointer", outline: "none", appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23777' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", paddingRight: "2.5rem",
      }}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function ToggleGroup({ options, value, onChange }: { options: { value: string; label: string; desc: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.85rem 1.1rem", borderRadius: "10px",
            border: `1.5px solid ${value === o.value ? "var(--hp-primary)" : "var(--hp-border)"}`,
            background: value === o.value ? "var(--hp-primary-soft)" : "var(--hp-bg)",
            cursor: "pointer", fontFamily: FONT, transition: "all 0.15s",
            textAlign: "left", width: "100%",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: value === o.value ? "var(--hp-primary)" : "var(--hp-foreground)" }}>{o.label}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--hp-soft-foreground)", marginTop: "2px" }}>{o.desc}</div>
          </div>
          <div style={{
            width: "18px", height: "18px", borderRadius: "50%",
            border: `2px solid ${value === o.value ? "var(--hp-primary)" : "var(--hp-border)"}`,
            background: value === o.value ? "var(--hp-primary)" : "transparent",
            flexShrink: 0, display: "grid", placeItems: "center",
          }}>
            {value === o.value && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white" }} />}
          </div>
        </button>
      ))}
    </div>
  );
}

function CardSection({ icon, title, delay, children }: { icon: React.ReactNode; title: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      style={{ background: "white", borderRadius: "20px", border: "1px solid var(--hp-border)", boxShadow: "var(--hp-shadow-card)", overflow: "hidden" }}
    >
      <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--hp-border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--hp-primary-soft)", color: "var(--hp-primary)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--hp-foreground)", fontFamily: FONT }}>{title}</span>
      </div>
      <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const user = session?.user;
  const fileRef = useRef<HTMLInputElement>(null);

  const [profileImage, setProfileImage] = useState<string>("");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [targetFirm, setTargetFirm] = useState("McKinsey & Company");
  const [targetRole, setTargetRole] = useState("Business Analyst");
  const [timeline, setTimeline] = useState("1–3 months");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [interviewerStyle, setInterviewerStyle] = useState("strict");

  useEffect(() => {
    const stored = localStorage.getItem("mycaseprep_settings");
    if (stored) {
      const s = JSON.parse(stored);
      if (s.targetFirm) setTargetFirm(s.targetFirm);
      if (s.targetRole) setTargetRole(s.targetRole);
      if (s.timeline) setTimeline(s.timeline);
      if (s.difficulty) setDifficulty(s.difficulty);
      if (s.interviewerStyle) setInterviewerStyle(s.interviewerStyle);
    }
    if (user?.image) setProfileImage(user.image);
    if (user?.name) setDisplayName(user.name);
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 128;
        let w = img.width, h = img.height;
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else { w = Math.round(w * MAX / h); h = MAX; }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        setProfileImage(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = event.target!.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    localStorage.setItem("mycaseprep_settings", JSON.stringify({ targetFirm, targetRole, timeline, difficulty, interviewerStyle }));
    try {
      await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName, image: profileImage }),
      });
      await update({ name: displayName, image: profileImage });
    } catch {}
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
      <FloatingBlob src="/homepage/new2-blob-camera.png" alt="" size={170} top="4%" left="4%" duration={7} rotate={-6} />
      <FloatingBlob src="/homepage/new2-blob-gardening.png" alt="" size={180} top="16%" right="14%" duration={8} delay={0.5} rotate={5} />
      <FloatingBlob src="/homepage/new3-blob-drumming.png" alt="" size={150} top="34%" left="13%" duration={6.5} delay={1} rotate={-4} />
      <FloatingBlob src="/homepage/new3-blob-origami.png" alt="" size={160} top="50%" right="3%" duration={7.5} delay={0.3} rotate={6} />
      <FloatingBlob src="/homepage/new2-blob-painting.png" alt="" size={170} bottom="32%" left="3%" duration={7} delay={0.8} rotate={-5} />
      <FloatingBlob src="/homepage/new3-blob-napping.png" alt="" size={150} bottom="15%" right="13%" duration={6.5} delay={0.2} rotate={4} />
      <FloatingBlob src="/homepage/new2-blob-watermelon.png" alt="" size={160} bottom="2%" left="5%" duration={8} delay={1.1} rotate={-6} />

      <Navbar />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 2rem 5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "0.5rem" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--hp-foreground)", margin: 0 }}>
            Settings
          </h1>
          <p style={{ marginTop: "0.4rem", fontSize: "0.9rem", color: "var(--hp-soft-foreground)" }}>
            Manage your profile and practice preferences
          </p>
        </motion.div>

        {/* Profile */}
        <CardSection icon={<User size={16} />} title="Profile" delay={0.04}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "9999px", overflow: "hidden", border: "3px solid var(--hp-primary)", background: "var(--hp-primary-soft)" }}>
                {profileImage
                  ? <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontWeight: 700, fontSize: "1.5rem", color: "var(--hp-primary)" }}>
                      {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
                    </div>
                }
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                style={{ position: "absolute", bottom: 0, right: 0, width: "24px", height: "24px", borderRadius: "9999px", background: "var(--hp-primary)", color: "white", border: "2px solid white", cursor: "pointer", display: "grid", placeItems: "center", fontSize: "0.65rem" }}
              >
                +
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--hp-foreground)" }}>{user?.name || "Your name"}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--hp-soft-foreground)", marginTop: "2px" }}>{user?.email}</div>
              <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button onClick={() => fileRef.current?.click()} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--hp-primary)", fontWeight: 600, fontFamily: FONT, padding: 0 }}>
                  Change photo
                </button>
                {profileImage && <>
                  <span style={{ color: "var(--hp-border)" }}>·</span>
                  <button onClick={() => setProfileImage("")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--hp-soft-foreground)", fontFamily: FONT, padding: 0 }}>Remove</button>
                </>}
              </div>
            </div>
          </div>

          <div>
            <Label>Display name</Label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name"
              style={{ width: "100%", padding: "0.65rem 1rem", borderRadius: "10px", border: "1px solid var(--hp-border)", background: "var(--hp-bg)", color: "var(--hp-foreground)", fontSize: "0.9rem", fontFamily: FONT, fontWeight: 500, outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--hp-primary)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--hp-border)")}
            />
          </div>

          <div>
            <Label>Email</Label>
            <input
              value={user?.email ?? ""}
              disabled
              style={{ width: "100%", padding: "0.65rem 1rem", borderRadius: "10px", border: "1px solid var(--hp-border)", background: "var(--hp-bg)", color: "var(--hp-soft-foreground)", fontSize: "0.9rem", fontFamily: FONT, fontWeight: 500, outline: "none", boxSizing: "border-box", cursor: "not-allowed", opacity: 0.7 }}
            />
            <div style={{ fontSize: "0.75rem", color: "var(--hp-soft-foreground)", marginTop: "4px" }}>Email cannot be changed</div>
          </div>
        </CardSection>

        {/* Practice preferences */}
        <CardSection icon={<Briefcase size={16} />} title="Practice preferences" delay={0.08}>
          <div>
            <Label>Firm to prep for</Label>
            <StyledSelect value={targetFirm} onChange={setTargetFirm} options={FIRMS} />
          </div>
          <div>
            <Label>Your role</Label>
            <StyledSelect value={targetRole} onChange={setTargetRole} options={ROLES} />
          </div>
          <div>
            <Label>How soon is your interview</Label>
            <StyledSelect value={timeline} onChange={setTimeline} options={TIMELINES} />
          </div>
        </CardSection>

        {/* Difficulty */}
        <CardSection icon={<Sliders size={16} />} title="Default difficulty" delay={0.12}>
          <ToggleGroup options={DIFFICULTIES} value={difficulty} onChange={setDifficulty} />
        </CardSection>

        {/* Interviewer style */}
        <CardSection icon={<Mic size={16} />} title="Default interviewer style" delay={0.16}>
          <ToggleGroup options={STYLES} value={interviewerStyle} onChange={setInterviewerStyle} />
        </CardSection>

        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: "white", borderRadius: "20px", border: "1px solid var(--hp-border)", boxShadow: "var(--hp-shadow-card)", overflow: "hidden" }}
        >
          <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--hp-border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fef2f2", color: "#dc2626", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <LogOut size={16} />
            </div>
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--hp-foreground)", fontFamily: FONT }}>Account</span>
          </div>
          <div style={{ padding: "1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--hp-foreground)" }}>Sign out</div>
              <div style={{ fontSize: "0.8rem", color: "var(--hp-soft-foreground)", marginTop: "2px" }}>Sign out of your MyCasePrep account</div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{ height: "36px", padding: "0 1.1rem", borderRadius: "9999px", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: "0.4rem", transition: "background 0.15s", flexShrink: 0, whiteSpace: "nowrap" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#fee2e2")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fef2f2")}
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </motion.div>

        {/* Save button */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%", height: "52px", borderRadius: "12px", border: "none",
              background: saved ? "#16a34a" : "var(--hp-primary)",
              color: "white", fontSize: "1rem", fontWeight: 700,
              cursor: saving ? "default" : "pointer", fontFamily: FONT,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 3px 0 oklch(0.4 0.16 285)",
              transition: "background 0.2s, opacity 0.15s",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saved ? "Saved ✓" : saving ? "Saving..." : "Save changes"}
          </button>
        </motion.div>

      </div>
    </div>
  );
}