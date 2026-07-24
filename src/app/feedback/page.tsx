// FEEDBACK-FEATURE: the shared "Help & feedback" page. Every help / support /
// email button in the app routes here (replacing the old mailto: links that
// exposed a personal address). Submissions POST to /api/feedback and show up in
// the admin panel. Works logged out — email is a required field so we can reply.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle2, Send } from "lucide-react";
import Navbar from "@/components/Navbar";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

const CATEGORIES = [
  { id: "bug", label: "Bug" },
  { id: "feature", label: "Feature request" },
  { id: "question", label: "Question" },
  { id: "other", label: "Other" },
];

export default function FeedbackPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [category, setCategory] = useState("question");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill from the signed-in account once the session resolves, but let the
  // user overwrite it (they may want replies at a different address).
  const sessionEmail = session?.user?.email ?? "";
  const effectiveEmail = email || (emailTouched ? "" : sessionEmail);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effectiveEmail.trim());
  const canSubmit = emailValid && message.trim().length >= 3 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, email: effectiveEmail.trim(), message: message.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong.");
      }
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.8rem", fontWeight: 700, color: "var(--hp-foreground)", marginBottom: "0.5rem", display: "block",
  };
  const fieldStyle: React.CSSProperties = {
    width: "100%", borderRadius: "10px", border: "1px solid var(--hp-border-strong)",
    background: "white", fontSize: "0.9rem", fontFamily: FONT, color: "var(--hp-foreground)",
    padding: "0.7rem 0.85rem", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "oklch(0.985 0.005 285)", fontFamily: FONT }}>
      <Navbar />

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
        <button
          onClick={() => router.back()}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "var(--hp-soft-foreground)", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", fontFamily: FONT, padding: "0.25rem 0", marginBottom: "1.25rem" }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.1rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--hp-foreground)", margin: 0 }}>
            Help &amp; feedback
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "var(--hp-soft-foreground)", lineHeight: 1.6 }}>
            Found a bug, have a question, or want to request a feature? Send us a note and we&apos;ll get back to you by email.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          onClick={() => router.push("/guide")}
          style={{ marginTop: "1.25rem", width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", textAlign: "left", background: "var(--hp-primary-soft)", border: "1px solid var(--hp-border)", borderRadius: "12px", padding: "0.9rem 1.1rem", cursor: "pointer", fontFamily: FONT }}
        >
          <BookOpen size={18} style={{ color: "var(--hp-primary)", flexShrink: 0 }} />
          <span>
            <span style={{ display: "block", fontWeight: 700, fontSize: "0.88rem", color: "var(--hp-foreground)" }}>Looking for how-tos?</span>
            <span style={{ display: "block", fontSize: "0.8rem", color: "var(--hp-soft-foreground)" }}>The Guide walks through the case framework and how scoring works.</span>
          </span>
        </motion.button>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: "1.5rem", background: "white", border: "1px solid var(--hp-border)", borderRadius: "16px", padding: "2.5rem 1.75rem", textAlign: "center", boxShadow: "var(--hp-shadow-card)" }}
            >
              <div style={{ width: "52px", height: "52px", borderRadius: "9999px", background: "var(--hp-mint)", display: "grid", placeItems: "center", margin: "0 auto 1rem" }}>
                <CheckCircle2 size={26} style={{ color: "oklch(0.4 0.12 165)" }} />
              </div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--hp-foreground)", margin: "0 0 0.4rem" }}>Thanks — we got your message</h2>
              <p style={{ fontSize: "0.88rem", color: "var(--hp-soft-foreground)", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
                We&apos;ll reply to <strong style={{ color: "var(--hp-foreground)" }}>{effectiveEmail.trim()}</strong> if a response is needed.
              </p>
              <button
                onClick={() => router.push("/")}
                style={{ height: "44px", padding: "0 1.5rem", borderRadius: "10px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: FONT }}
              >
                Back to home
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.08 }}
              style={{ marginTop: "1.5rem", background: "white", border: "1px solid var(--hp-border)", borderRadius: "16px", padding: "1.75rem", boxShadow: "var(--hp-shadow-card)" }}
            >
              <div style={{ marginBottom: "1.25rem" }}>
                <span style={labelStyle}>What&apos;s this about?</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {CATEGORIES.map(c => {
                    const active = category === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setCategory(c.id)}
                        style={{
                          height: "36px", padding: "0 1rem", borderRadius: "9999px",
                          border: `1.5px solid ${active ? "var(--hp-primary)" : "var(--hp-border-strong)"}`,
                          background: active ? "var(--hp-primary)" : "white",
                          color: active ? "white" : "var(--hp-soft-foreground)",
                          fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                        }}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label htmlFor="fb-email" style={labelStyle}>
                  Your email <span style={{ color: "var(--hp-primary)" }}>*</span>
                </label>
                <input
                  id="fb-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={effectiveEmail}
                  onChange={e => { setEmail(e.target.value); setEmailTouched(true); }}
                  style={{ ...fieldStyle, borderColor: emailTouched && !emailValid ? "#dc2626" : "var(--hp-border-strong)" }}
                />
                <p style={{ fontSize: "0.72rem", color: "var(--hp-soft-foreground)", margin: "0.4rem 0 0" }}>
                  Required — this is the only way we can reply to you.
                </p>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label htmlFor="fb-message" style={labelStyle}>Message</label>
                <textarea
                  id="fb-message"
                  rows={6}
                  placeholder="Tell us what's going on..."
                  value={message}
                  maxLength={5000}
                  onChange={e => setMessage(e.target.value)}
                  style={{ ...fieldStyle, resize: "vertical", minHeight: "120px", lineHeight: 1.6 }}
                />
              </div>

              {error && (
                <p style={{ fontSize: "0.8rem", color: "#dc2626", margin: "0 0 1rem", fontWeight: 600 }}>{error}</p>
              )}

              <button
                onClick={submit}
                disabled={!canSubmit}
                style={{
                  width: "100%", height: "48px", borderRadius: "12px", border: "none",
                  background: canSubmit ? "var(--hp-primary)" : "var(--hp-border-strong)",
                  color: "white", fontSize: "0.92rem", fontWeight: 700, fontFamily: FONT,
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  boxShadow: canSubmit ? "0 3px 0 oklch(0.4 0.16 285)" : "none", transition: "background 0.15s",
                }}
              >
                {submitting ? "Sending..." : <>Send <Send size={16} /></>}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
