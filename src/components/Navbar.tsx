"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, History, Settings, HelpCircle, MessageSquare } from "lucide-react";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

function ProfileDropdown({ user, onClose }: { user: { name?: string | null; email?: string | null; image?: string | null }; onClose: () => void }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const item = (icon: React.ReactNode, label: string, onClick: () => void, danger?: boolean) => (
    <button onClick={onClick}
      style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 1rem", background: "none", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: FONT, fontSize: "0.875rem", fontWeight: 500, color: danger ? "#dc2626" : "var(--hp-foreground)", textAlign: "left", transition: "background 0.1s" }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--hp-primary-soft)")}
      onMouseLeave={e => (e.currentTarget.style.background = "none")}
    >
      <span style={{ color: danger ? "#dc2626" : "var(--hp-soft-foreground)", flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  );

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: "240px", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)", boxShadow: "0 8px 32px oklch(0.4 0.05 280 / 14%)", overflow: "hidden", zIndex: 300 }}
        >
          <div style={{ padding: "1rem 1rem 0.75rem", borderBottom: "1px solid var(--hp-border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {user.image
              ? <img src={user.image} alt="" style={{ width: 40, height: 40, borderRadius: "9999px", objectFit: "cover", flexShrink: 0 }} />
              : <div style={{ width: 40, height: 40, borderRadius: "9999px", background: "var(--hp-primary)", color: "white", display: "grid", placeItems: "center", fontWeight: 700, flexShrink: 0, fontFamily: FONT }}>{(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}</div>
            }
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--hp-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name ?? "User"}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--hp-soft-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
            </div>
          </div>
          <div style={{ padding: "0.5rem" }}>
            {item(<History size={16} />, "History", () => { router.push("/history"); onClose(); })}
            {item(<Settings size={16} />, "Settings", () => { router.push("/settings"); onClose(); })}
          </div>
          <div style={{ borderTop: "1px solid var(--hp-border)", padding: "0.5rem" }}>
            {item(<HelpCircle size={16} />, "Help", () => {})}
            {item(<MessageSquare size={16} />, "Send feedback", () => {})}
          </div>
          <div style={{ borderTop: "1px solid var(--hp-border)", padding: "0.5rem" }}>
            {item(
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
              "Sign out", () => { signOut({ callbackUrl: "/" }); onClose(); }, true
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  const loading = status === "loading";
  const [profileOpen, setProfileOpen] = useState(false);

  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 180], ["oklch(0.97 0.03 290 / 0)", "oklch(0.97 0.03 290 / 0.92)"]);
  const navBlur = useTransform(scrollY, [0, 180], ["blur(0px)", "blur(16px)"]);
  const navBorderOpacity = useTransform(scrollY, [0, 180], [0, 1]);

  const BTN_H = "38px";

  const textLink: React.CSSProperties = {
    background: "none", border: "none",
    fontSize: "0.875rem", fontWeight: 500,
    color: "var(--hp-soft-foreground)", cursor: "pointer",
    padding: "0 0.5rem", fontFamily: FONT,
    display: "inline-flex", alignItems: "center",
    height: BTN_H, lineHeight: "1", transition: "color 0.15s",
  };

  return (
    <>
      <motion.header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.875rem 2.5rem",
          backgroundColor: navBg,
          backdropFilter: navBlur,
          boxSizing: "border-box",
          fontFamily: FONT,
        }}
      >
        <motion.div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "var(--hp-border)", opacity: navBorderOpacity }} />

        <span
          onClick={() => router.push("/")}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.02em", color: "var(--hp-foreground)", cursor: "pointer", flexShrink: 0, fontFamily: FONT }}
        >
          <img src="/newlogomcp.png" alt="" style={{ width: "26px", height: "26px", flexShrink: 0 }} />
          <span style={{ position: "relative", top: "-1px" }}>mycaseprep</span>
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button style={textLink} onClick={() => router.push("/")}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--hp-foreground)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--hp-soft-foreground)")}>
            Home
          </button>

          <button style={textLink} onClick={() => router.push("/library")}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--hp-foreground)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--hp-soft-foreground)")}>
            Library
          </button>

          <button style={{ ...textLink, marginRight: "0.25rem" }} onClick={() => router.push("/guide")}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--hp-foreground)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--hp-soft-foreground)")}>
            Guide
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            style={{
              height: BTN_H, padding: "0 1.25rem",
              borderRadius: "9999px", border: "none",
              background: "var(--hp-primary)", color: "var(--hp-primary-foreground)",
              fontSize: "0.875rem", fontWeight: 600,
              cursor: "pointer", fontFamily: FONT,
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              boxShadow: "0 2px 0 oklch(0.4 0.16 285)",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Start practicing
            <ArrowRight size={15} />
          </button>

          {!loading && user && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProfileOpen(o => !o)}
                style={{ width: BTN_H, height: BTN_H, borderRadius: "9999px", border: "2px solid var(--hp-primary)", padding: 0, cursor: "pointer", background: "var(--hp-primary)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {user.image
                  ? <img src={user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  : <span style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", fontFamily: FONT }}>{(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}</span>
                }
              </button>
              {profileOpen && <ProfileDropdown user={user} onClose={() => setProfileOpen(false)} />}
            </div>
          )}
        </div>
      </motion.header>

      {/* Spacer so content isn't hidden behind fixed nav */}
      <div style={{ height: "64px" }} />
    </>
  );
}