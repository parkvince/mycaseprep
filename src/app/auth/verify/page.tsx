"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = params.get("token");
    const email = params.get("email");
    if (!token || !email) { setStatus("error"); return; }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email }),
    })
      .then(r => r.json())
      .then(async data => {
        if (data.success) {
          setStatus("success");
          setTimeout(() => router.push("/auth"), 2500);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FONT, background: "var(--hp-bg)",
      backgroundImage: [
        "radial-gradient(at 8% 12%, var(--hp-lavender) 0px, transparent 45%)",
        "radial-gradient(at 92% 10%, var(--hp-peach) 0px, transparent 45%)",
      ].join(", "),
    }}>
      <div style={{ background: "white", borderRadius: "20px", border: "1px solid var(--hp-border)", padding: "2.5rem", maxWidth: "400px", width: "100%", textAlign: "center", boxShadow: "var(--hp-shadow-card)" }}>
        {status === "loading" && (
          <>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
            <h2 style={{ fontWeight: 700, color: "var(--hp-foreground)", margin: "0 0 0.5rem" }}>Verifying your email...</h2>
          </>
        )}
        {status === "success" && (
          <>
            <div style={{ width: "56px", height: "56px", borderRadius: "9999px", background: "#f0fdf4", display: "grid", placeItems: "center", margin: "0 auto 1rem" }}>
              <span style={{ fontSize: "1.5rem" }}>✓</span>
            </div>
            <h2 style={{ fontWeight: 700, color: "var(--hp-foreground)", margin: "0 0 0.5rem" }}>Email verified</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--hp-soft-foreground)" }}>Redirecting you to sign in...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✕</div>
            <h2 style={{ fontWeight: 700, color: "var(--hp-foreground)", margin: "0 0 0.5rem" }}>Link expired or invalid</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--hp-soft-foreground)", marginBottom: "1.5rem" }}>Try signing up again to get a new link.</p>
            <button onClick={() => router.push("/auth")} style={{ height: "40px", padding: "0 1.5rem", borderRadius: "9999px", border: "none", background: "var(--hp-primary)", color: "white", fontWeight: 600, fontFamily: FONT, cursor: "pointer" }}>
              Back to sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}