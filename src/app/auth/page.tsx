"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
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
              onClick={() => { setTab(t); setError(""); }}
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
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                onFocus={e => (e.currentTarget.style.borderColor = "#111")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
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