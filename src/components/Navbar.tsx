"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LibraryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const StartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const SignOutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
}

function NavButton({ icon, label, onClick, primary }: NavButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          border: primary ? "none" : "1px solid var(--border)",
          background: primary ? "#111111" : "transparent",
          color: primary ? "#ffffff" : "var(--text-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.15s",
          ...(hovered && !primary ? { background: "var(--bg-card)", color: "var(--text-primary)" } : {}),
        }}
      >
        {icon}
      </button>
      {hovered && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#111111",
          color: "#ffffff",
          fontSize: "11px",
          fontWeight: 500,
          padding: "4px 8px",
          borderRadius: "5px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 200,
          fontFamily: "Inter, sans-serif",
        }}>
          {label}
          <div style={{
            position: "absolute",
            top: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "8px",
            height: "8px",
            background: "#111111",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }} />
        </div>
      )}
    </div>
  );
}

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

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <NavButton icon={<LibraryIcon />} label="Library" onClick={() => router.push("/library")} />
        <NavButton icon={<HistoryIcon />} label="History" onClick={() => router.push("/history")} />
        <NavButton icon={<SettingsIcon />} label="Settings" onClick={() => router.push("/settings")} />
        {variant === "settings" ? (
          <NavButton icon={<SignOutIcon />} label="Sign out" onClick={() => signOut({ callbackUrl: "/" })} />
        ) : (
          <NavButton icon={<StartIcon />} label="Start a Case" onClick={() => router.push("/dashboard")} primary />
        )}
      </div>
    </nav>
  );
}