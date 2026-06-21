"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character (!@#$% etc).";
  return null;
}

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }

    if (tab === "signup") {
      if (!name) { setError("Please enter your name."); return; }
      const pwError = validatePassword(password);
      if (pwError) { setError(pwError); return; }
      if (password !== confirmPassword) { setError("Passwords do not match."); return; }
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
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  const getPasswordStrength = (pw: string) => {
    if (!pw) return null;
    const checks = [
      pw.length >= 8,
      /[A-Z]/.test(pw),
      /[a-z]/.test(pw),
      /[0-9]/.test(pw),
      /[^A-Za-z0-9]/.test(pw),
    ];
    const passed = checks.filter(Boolean).length;
    if (passed <= 2) return { label: "Weak", color: "var(--danger)", width: "33%" };
    if (passed <= 4) return { label: "Medium", color: "var(--warning)", width: "66%" };
    return { label: "Strong", color: "var(--success)", width: "100%" };
  };

  const strength = tab === "signup" ? getPasswordStrength(password) : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      padding: "24px",
    }}>
      <div
        onClick={() => router.push("/")}
        style={{
          fontFamily: "Cormorant, serif",
          fontSize: "26px",
          fontWeight: 500,
          color: "var(--text-primary)",
          marginBottom: "32px",
          cursor: "pointer",
          letterSpacing: "-0.01em",
        }}
      >
        MyCasePrep
      </div>

      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07), 0 10px 40px -4px rgba(0,0,0,0.10)",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
          {(["signin", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); setPassword(""); setConfirmPassword(""); }}
              style={{
                flex: 1,
                padding: "16px",
                background: "none",
                border: "none",
                borderBottom: tab === t ? "2px solid #111" : "2px solid transparent",
                marginBottom: "-1px",
                fontSize: "14px",
                fontWeight: tab === t ? 600 : 400,
                color: tab === t ? "var(--text-primary)" : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {t === "signin" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <div style={{ padding: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
            {tab === "signup" && (
              <div>
                <label style={labelStyle}>Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "#111")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "#111")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "#111")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
              />
              {strength && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ height: "3px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: strength.width,
                      background: strength.color,
                      borderRadius: "2px",
                      transition: "width 0.3s, background 0.3s",
                    }} />
                  </div>
                  <p style={{ fontSize: "11px", color: strength.color, marginTop: "4px", fontWeight: 500 }}>
                    {strength.label} password
                  </p>
                </div>
              )}
              {tab === "signup" && (
                <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "3px" }}>
                  {[
                    { label: "At least 8 characters", ok: password.length >= 8 },
                    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
                    { label: "Lowercase letter", ok: /[a-z]/.test(password) },
                    { label: "Number", ok: /[0-9]/.test(password) },
                    { label: "Special character", ok: /[^A-Za-z0-9]/.test(password) },
                  ].map(({ label, ok }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "11px", color: ok ? "var(--success)" : "var(--text-secondary)" }}>
                        {ok ? "✓" : "○"}
                      </span>
                      <span style={{ fontSize: "11px", color: ok ? "var(--success)" : "var(--text-secondary)" }}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {tab === "signup" && (
              <div>
                <label style={labelStyle}>Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    ...inputStyle,
                    borderColor: confirmPassword && confirmPassword !== password ? "var(--danger)" : "var(--border)",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#111")}
                  onBlur={e => (e.currentTarget.style.borderColor = confirmPassword && confirmPassword !== password ? "var(--danger)" : "var(--border)")}
                />
                {confirmPassword && confirmPassword !== password && (
                  <p style={{ fontSize: "11px", color: "var(--danger)", marginTop: "4px" }}>
                    Passwords do not match.
                  </p>
                )}
                {confirmPassword && confirmPassword === password && (
                  <p style={{ fontSize: "11px", color: "var(--success)", marginTop: "4px" }}>
                    Passwords match.
                  </p>
                )}
              </div>
            )}
          </div>

          {error && (
            <p style={{ fontSize: "13px", color: "var(--danger)", marginBottom: "16px" }}>
              {error}
            </p>
          )}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: "100%", padding: "12px", fontSize: "14px", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "..." : tab === "signin" ? "Sign In" : "Create Account"}
          </button>

          <p style={{ fontSize: "13px", color: "var(--text-secondary)", textAlign: "center", marginTop: "20px" }}>
            {tab === "signin" ? "No account? " : "Already have one? "}
            <span
              onClick={() => { setTab(tab === "signin" ? "signup" : "signin"); setError(""); }}
              style={{ color: "var(--text-primary)", fontWeight: 500, cursor: "pointer", textDecoration: "underline" }}
            >
              {tab === "signin" ? "Sign up free" : "Sign in"}
            </span>
          </p>
        </div>
      </div>

      <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "24px", textAlign: "center" }}>
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--text-secondary)",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "14px",
  fontFamily: "Inter, sans-serif",
  color: "var(--text-primary)",
  background: "var(--bg-card)",
  outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
};