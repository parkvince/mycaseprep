"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface NavbarProps {
  variant?: "default" | "settings";
}

export default function Navbar({ variant = "default" }: NavbarProps) {
  const router = useRouter();

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 48px",
      height: "60px",
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      background: "rgba(255,255,255,0.98)",
      backdropFilter: "blur(8px)",
      zIndex: 100,
    }}>
      <span
        style={{ fontFamily: "Cormorant, serif", fontSize: "22px", fontWeight: 500, color: "#111111", cursor: "pointer" }}
        onClick={() => router.push("/")}
      >
        MyCasePrep
      </span>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button className="btn-secondary" style={{ padding: "7px 16px" }} onClick={() => router.push("/settings")}>
          Settings
        </button>
        <button className="btn-secondary" style={{ padding: "7px 16px" }} onClick={() => router.push("/library")}>
          Library
        </button>
        <button className="btn-secondary" style={{ padding: "7px 16px" }} onClick={() => router.push("/history")}>
          History
        </button>
        {variant === "settings" ? (
          <button className="btn-secondary" style={{ padding: "7px 16px" }} onClick={() => signOut({ callbackUrl: "/" })}>
            Sign out
          </button>
        ) : (
          <button className="btn-primary" style={{ padding: "7px 16px" }} onClick={() => router.push("/dashboard")}>
            Start a Case
          </button>
        )}
      </div>
    </nav>
  );
}