"use client";

import { signOut } from "next-auth/react";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

export default function BannedPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "oklch(0.985 0.005 285)", fontFamily: FONT, padding: "0 1.5rem" }}>
      <div style={{ maxWidth: "420px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--hp-foreground)", margin: 0 }}>
          This account has been suspended
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--hp-soft-foreground)", lineHeight: 1.7, margin: 0 }}>
          If you think this is a mistake,{" "}
          <a href="/feedback" style={{ color: "var(--hp-primary)", fontWeight: 600, textDecoration: "none" }}>reach out to support</a>{" "}
          to get it sorted out.
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{ marginTop: "0.5rem", height: "44px", padding: "0 1.5rem", borderRadius: "10px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.85rem", fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}
        >
          Sign out
        </button>
      </div>
    </main>
  );
}
