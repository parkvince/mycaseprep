"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FloatingBlob from "@/components/FloatingBlob";
import TermsModal from "@/components/TermsModal";
import { SUPPORT_EMAIL } from "@/lib/support";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain a special character";
  return null;
}

function getPasswordStrength(pw: string) {
  if (!pw) return null;
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[a-z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  const passed = checks.filter(Boolean).length;
  if (passed <= 2) return { label: "Weak", color: "#dc2626", width: "33%" };
  if (passed <= 4) return { label: "Medium", color: "#d97706", width: "66%" };
  return { label: "Strong", color: "#16a34a", width: "100%" };
}

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // Open the Create-account tab when arrived at via a "get started / sign up" CTA.
  useEffect(() => {
    const mode = new URLSearchParams(window.location.search).get("mode");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (mode === "signup") setTab("signup");
  }, []);

  const strength = tab === "signup" ? getPasswordStrength(password) : null;
  const emailInvalid = emailTouched && email.length > 0 && !isValidEmail(email);

  const handleSubmit = async () => {
    setError("");
    setEmailTouched(true);
    if (!email || !password) { setError("Please fill in all fields"); return; }
    if (!isValidEmail(email)) { setError("Please enter a valid email address"); return; }

    if (tab === "signup") {
      if (!name) { setError("Please enter your name"); return; }
      const pwError = validatePassword(password);
      if (pwError) { setError(pwError); return; }
      if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    }

    setLoading(true);
    try {
      if (tab === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); setLoading(false); return; }
      }

      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) { setError("Invalid email or password"); setLoading(false); return; }
      router.push("/");
    } catch {
      setError("Something went wrong. Try again");
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.65rem 1rem", borderRadius: "10px",
    border: "1px solid var(--hp-border)", background: "var(--hp-bg)",
    color: "var(--hp-foreground)", fontSize: "0.9rem", fontFamily: FONT,
    fontWeight: 500, outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.8rem", fontWeight: 600,
    color: "var(--hp-soft-foreground)", marginBottom: "0.4rem",
    fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em",
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
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem",
      position: "relative", zIndex: 0,
    }}>

      <FloatingBlob src="/homepage/new2-blob-paperplane.png" alt="" size={170} top="3%" left="12%" duration={7} rotate={-5} />
      <FloatingBlob src="/homepage/new2-blob-tricycle.png" alt="" size={190} top="4%" right="9%" duration={6.5} delay={0.6} rotate={5} />
      <FloatingBlob src="/homepage/new3-blob-birthday.png" alt="" size={160} top="26%" left="4%" duration={7.5} delay={0.2} rotate={-6} />
      <FloatingBlob src="/homepage/new3-blob-kite.png" alt="" size={190} top="32%" right="19%" duration={8} delay={0.9} rotate={4} />
      <FloatingBlob src="/homepage/new3-blob-pinwheel.png" alt="" size={160} bottom="30%" left="18%" duration={7} delay={0.4} rotate={-4} />
      <FloatingBlob src="/homepage/new3-blob-stargazing.png" alt="" size={170} bottom="24%" right="4%" duration={6.5} delay={1.1} rotate={6} />

      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        onClick={() => router.push("/")}
        style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.02em", color: "var(--hp-foreground)", marginBottom: "2rem", cursor: "pointer", fontFamily: FONT }}
      >
        <img src="/newlogomcp.png" alt="" style={{ width: "28px", height: "28px", flexShrink: 0 }} />
        <span style={{ position: "relative", top: "-1px" }}>mycaseprep</span>
      </motion.div>

      {/* Value context so this isn't a bare login wall — tells a first-time visitor
          what they get, matching the "free" promise from the homepage. */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}
        style={{ width: "100%", maxWidth: "420px", marginBottom: "1rem", textAlign: "center" }}
      >
        <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--hp-foreground)", letterSpacing: "-0.01em", marginBottom: "0.5rem" }}>
          {tab === "signup" ? "Create your free account" : "Welcome back"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.4rem 0.9rem", fontSize: "0.78rem", color: "var(--hp-soft-foreground)" }}>
          {["2 AI interviews / 12h — free", "16 firm-specific rubrics", "Instant scorecards"].map(t => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>{t}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ width: "100%", maxWidth: "420px", background: "white", borderRadius: "20px", border: "1px solid var(--hp-border)", boxShadow: "var(--hp-shadow-card)", overflow: "hidden" }}
      >
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--hp-border)" }}>
          {(["signin", "signup"] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); setPassword(""); setConfirmPassword(""); setEmailTouched(false); }}
              style={{
                flex: 1, padding: "1rem", background: "none", border: "none",
                borderBottom: tab === t ? "2px solid var(--hp-primary)" : "2px solid transparent",
                marginBottom: "-1px",
                fontSize: "0.875rem", fontWeight: tab === t ? 700 : 500,
                color: tab === t ? "var(--hp-primary)" : "var(--hp-soft-foreground)",
                cursor: "pointer", transition: "all 0.15s", fontFamily: FONT,
              }}
            >
              {t === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <div style={{ padding: "1.75rem" }}>

          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              gap: "0.6rem", padding: "0.7rem 1rem",
              background: "white", border: "1px solid var(--hp-border)",
              borderRadius: "10px", fontSize: "0.9rem", fontWeight: 600,
              color: "var(--hp-foreground)", cursor: "pointer", fontFamily: FONT,
              marginBottom: "1.25rem", transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--hp-bg)")}
            onMouseLeave={e => (e.currentTarget.style.background = "white")}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.583c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.583 9 3.583z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--hp-border)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--hp-soft-foreground)", whiteSpace: "nowrap" }}>or continue with email</span>
            <div style={{ flex: 1, height: "1px", background: "var(--hp-border)" }} />
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.25rem" }}>
            <AnimatePresence>
              {tab === "signup" && (
                <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <label style={labelStyle}>Full name</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--hp-primary)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--hp-border)")}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="you@example.com"
                style={{ ...inputStyle, borderColor: emailInvalid ? "#dc2626" : "var(--hp-border)" }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--hp-primary)")}
              />
              {emailInvalid && (
                <p style={{ fontSize: "0.72rem", color: "#dc2626", marginTop: "3px", fontWeight: 500 }}>
                  Please enter a valid email address
                </p>
              )}
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--hp-primary)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--hp-border)")}
              />
              {strength && (
                <div style={{ marginTop: "0.5rem" }}>
                  <div style={{ height: "3px", background: "var(--hp-border)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: "2px", transition: "width 0.3s, background 0.3s" }} />
                  </div>
                  <p style={{ fontSize: "0.72rem", color: strength.color, marginTop: "3px", fontWeight: 600 }}>{strength.label} password</p>
                </div>
              )}
              {tab === "signin" && (
                <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
                  <span
                    onClick={() => setShowForgot(true)}
                    style={{ fontSize: "0.78rem", color: "var(--hp-primary)", fontWeight: 600, cursor: "pointer" }}
                  >
                    Forgot password?
                  </span>
                </div>
              )}
              {tab === "signup" && (
                <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "3px" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--hp-soft-foreground)", fontWeight: 600, marginBottom: "2px" }}>Your password needs:</div>
                  {[
                    { label: "At least 8 characters", ok: password.length >= 8 },
                    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
                    { label: "Lowercase letter", ok: /[a-z]/.test(password) },
                    { label: "Number", ok: /[0-9]/.test(password) },
                    { label: "Special character", ok: /[^A-Za-z0-9]/.test(password) },
                  ].map(({ label, ok }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "0.72rem", color: ok ? "#16a34a" : "var(--hp-soft-foreground)", fontWeight: 700 }}>{ok ? "✓" : "○"}</span>
                      <span style={{ fontSize: "0.72rem", color: ok ? "#16a34a" : "var(--hp-soft-foreground)" }}>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <AnimatePresence>
              {tab === "signup" && (
                <motion.div key="confirm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <label style={labelStyle}>Confirm password</label>
                  <input
                    type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                    style={{ ...inputStyle, borderColor: confirmPassword && confirmPassword !== password ? "#dc2626" : "var(--hp-border)" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--hp-primary)")}
                    onBlur={e => (e.currentTarget.style.borderColor = confirmPassword && confirmPassword !== password ? "#dc2626" : "var(--hp-border)")}
                  />
                  {confirmPassword && confirmPassword !== password && (
                    <p style={{ fontSize: "0.72rem", color: "#dc2626", marginTop: "3px" }}>Passwords do not match</p>
                  )}
                  {confirmPassword && confirmPassword === password && (
                    <p style={{ fontSize: "0.72rem", color: "#16a34a", marginTop: "3px" }}>Passwords match</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "0.6rem 0.875rem", marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.8rem", color: "#dc2626", margin: 0, fontWeight: 500 }}>{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", height: "46px", borderRadius: "10px", border: "none",
              background: "var(--hp-primary)", color: "white",
              fontSize: "0.9rem", fontWeight: 700, fontFamily: FONT,
              cursor: loading ? "default" : "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 3px 0 oklch(0.4 0.16 285)",
              transition: "opacity 0.15s", opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Please wait..." : tab === "signin" ? "Sign in" : "Create account"}
          </button>

          <p style={{ fontSize: "0.8rem", color: "var(--hp-soft-foreground)", textAlign: "center", marginTop: "1.25rem" }}>
            {tab === "signin" ? "No account? " : "Already have one? "}
            <span
              onClick={() => { setTab(tab === "signin" ? "signup" : "signin"); setError(""); setEmailTouched(false); }}
              style={{ color: "var(--hp-primary)", fontWeight: 600, cursor: "pointer" }}
            >
              {tab === "signin" ? "Sign up free" : "Sign in"}
            </span>
          </p>
        </div>
      </motion.div>

      <p style={{ fontSize: "0.75rem", color: "var(--hp-soft-foreground)", marginTop: "1.5rem", textAlign: "center" }}>
        By continuing, you agree to our{" "}
        <span onClick={() => setShowTerms(true)} style={{ color: "var(--hp-primary)", fontWeight: 600, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px" }}>terms</span>
        {" "}and{" "}
        <span onClick={() => setShowTerms(true)} style={{ color: "var(--hp-primary)", fontWeight: 600, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px" }}>privacy policy</span>.
      </p>

      <AnimatePresence>
        {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showForgot && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowForgot(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "white", borderRadius: "18px", maxWidth: "420px", width: "100%", padding: "1.75rem", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", fontFamily: FONT }}
            >
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--hp-foreground)", margin: "0 0 0.5rem" }}>Reset your password</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--hp-soft-foreground)", lineHeight: 1.65, margin: "0 0 1rem" }}>
                If you signed up with Google, just use <strong>Continue with Google</strong> — no password needed.
                Otherwise, email us from your account address and we&apos;ll help you reset it.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=Password%20reset%20request`}
                  style={{ height: "44px", borderRadius: "10px", background: "var(--hp-primary)", color: "white", fontSize: "0.88rem", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 0 oklch(0.4 0.16 285)" }}
                >
                  Email support
                </a>
                <button
                  onClick={() => setShowForgot(false)}
                  style={{ height: "42px", borderRadius: "10px", border: "1px solid var(--hp-border-strong)", background: "white", color: "var(--hp-foreground)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT }}
                >
                  Back to sign in
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}