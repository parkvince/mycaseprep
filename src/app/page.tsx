"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, History, Settings, HelpCircle, MessageSquare, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Sparkle, Star } from "@/components/ui/doodle";

const FEATURES = [
  {
    img: "/homepage/blob-lavender.png",
    title: "Firm-Specific Feedback",
    copy: "Graded the way McKinsey, Bain, and BCG actually evaluate candidates. Each firm has its own rubric.",
  },
  {
    img: "/homepage/blob-peach.png",
    title: "Realistic Interviewer",
    copy: "An interviewer that never gives away answers. It pushes back, asks follow-ups, and holds a high bar.",
  },
  {
    img: "/homepage/blob-mint.png",
    title: "Detailed Scorecard",
    copy: "Structure, quantitative accuracy, communication. Each dimension scored and benchmarked against top candidates.",
  },
  {
    img: "/homepage/blob-voice.png",
    title: "Voice + Text",
    copy: "Practice speaking out loud or typing your answers. Both modes replicate real interview conditions.",
  },
  {
    img: "/homepage/blob-pink.png",
    title: "Model Answers",
    copy: "After each case, see exactly what the strongest candidates would have said differently.",
  },
  {
    img: "/homepage/blob-yellow.png",
    title: "Performance Tracking",
    copy: "Every session is saved. Track your score over time and see where you keep losing points.",
  },
];

function ProfileDropdown({ user, onClose }: { user: { name?: string | null; email?: string | null; image?: string | null }; onClose: () => void }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const menuItem = (icon: React.ReactNode, label: string, onClick: () => void, danger?: boolean) => (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.6rem 1rem",
        background: "none",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: danger ? "#dc2626" : "var(--hp-foreground)",
        textAlign: "left",
        transition: "background 0.1s",
      }}
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
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: "240px",
            background: "white",
            borderRadius: "14px",
            border: "1px solid var(--hp-border)",
            boxShadow: "0 8px 32px oklch(0.4 0.05 280 / 14%), 0 2px 8px oklch(0.4 0.05 280 / 8%)",
            overflow: "hidden",
            zIndex: 300,
          }}
        >
          {/* Profile header */}
          <div style={{
            padding: "1rem 1rem 0.75rem",
            borderBottom: "1px solid var(--hp-border)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}>
            {user.image ? (
              <img
                src={user.image}
                alt={user.name ?? "Profile"}
                style={{ width: "40px", height: "40px", borderRadius: "9999px", objectFit: "cover", flexShrink: 0 }}
              />
            ) : (
              <div style={{
                width: "40px", height: "40px", borderRadius: "9999px",
                background: "var(--hp-primary)", color: "white",
                display: "grid", placeItems: "center",
                fontSize: "1rem", fontWeight: 700, flexShrink: 0,
              }}>
                {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--hp-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name ?? "User"}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--hp-soft-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div style={{ padding: "0.5rem" }}>
            {menuItem(<History size={16} />, "History", () => { router.push("/history"); onClose(); })}
            {menuItem(<Settings size={16} />, "Settings", () => { router.push("/settings"); onClose(); })}
          </div>

          <div style={{ borderTop: "1px solid var(--hp-border)", padding: "0.5rem" }}>
            {menuItem(<HelpCircle size={16} />, "Help", () => {})}
            {menuItem(<MessageSquare size={16} />, "Send feedback", () => {})}
          </div>

          <div style={{ borderTop: "1px solid var(--hp-border)", padding: "0.5rem" }}>
            {menuItem(
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>,
              "Sign out",
              () => { signOut({ callbackUrl: "/" }); onClose(); },
              true
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user;
  const cta = user ? "/dashboard" : "/auth";
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinkStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "var(--hp-soft-foreground)",
    cursor: "pointer",
    padding: "0.4rem 0.75rem",
    borderRadius: "6px",
    fontFamily: "inherit",
    textDecoration: "none",
    display: "inline-block",
    transition: "color 0.15s, background 0.15s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
      background: "var(--hp-bg)",
      backgroundImage: [
        "radial-gradient(at 8% 12%, var(--hp-lavender) 0px, transparent 45%)",
        "radial-gradient(at 92% 10%, var(--hp-peach) 0px, transparent 45%)",
        "radial-gradient(at 85% 92%, var(--hp-mint) 0px, transparent 50%)",
        "radial-gradient(at 10% 92%, var(--hp-sky) 0px, transparent 45%)",
      ].join(", "),
      backgroundAttachment: "fixed",
    }}>

      {/* Nav */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2.5rem",
        boxSizing: "border-box",
      }}>
        {/* Left: logo + nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <span
            onClick={() => router.push("/")}
            style={{ fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.02em", color: "var(--hp-foreground)", cursor: "pointer" }}
          >
            mycaseprep
          </span>

          <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <button
              onClick={() => router.push("/")}
              style={navLinkStyle}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--hp-foreground)"; (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--hp-soft-foreground)"; (e.currentTarget as HTMLElement).style.background = "none"; }}
            >
              Home
            </button>
            <a
              href="#features"
              style={navLinkStyle}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--hp-foreground)"; (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--hp-soft-foreground)"; (e.currentTarget as HTMLElement).style.background = "none"; }}
            >
              Features
            </a>
          </nav>
        </div>

        {/* Right: same layout before + after login */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          {!loading && (
            <>
              {/* Library button — white outlined, same size always */}
              <button
                onClick={() => router.push(user ? "/library" : "/auth")}
                style={{
                  height: "38px",
                  padding: "0 1.1rem",
                  borderRadius: "9999px",
                  border: "1px solid var(--hp-border-strong)",
                  background: "rgba(255,255,255,0.75)",
                  color: "var(--hp-foreground)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  backdropFilter: "blur(8px)",
                  whiteSpace: "nowrap",
                }}
              >
                Library
              </button>

              {/* Primary CTA — purple, same size always */}
              <button
                className="hp-btn-primary"
                onClick={() => router.push(cta)}
                style={{
                  height: "38px",
                  padding: "0 1.25rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  fontFamily: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  whiteSpace: "nowrap",
                }}
              >
                {user ? "Start practicing" : "Get started"}
                <ArrowRight size={15} />
              </button>

              {/* Logged out: Sign in instead of avatar */}
              {!user ? (
                <button
                  onClick={() => router.push("/auth")}
                  style={{
                    height: "38px",
                    padding: "0 1.1rem",
                    borderRadius: "9999px",
                    border: "1px solid var(--hp-border-strong)",
                    background: "rgba(255,255,255,0.75)",
                    color: "var(--hp-foreground)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Sign in
                </button>
              ) : (
                /* Profile picture */
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setProfileOpen(o => !o)}
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "9999px",
                      border: "2px solid var(--hp-primary)",
                      padding: 0,
                      cursor: "pointer",
                      background: "var(--hp-primary)",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name ?? "Profile"}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <span style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", fontFamily: "inherit" }}>
                        {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </button>
                  {profileOpen && (
                    <ProfileDropdown user={user} onClose={() => setProfileOpen(false)} />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </header>

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <style>{`
          .hp-hero-grid {
            display: grid;
            gap: 2.5rem;
            padding: 2rem 2.5rem 5rem;
          }
          @media (min-width: 1024px) {
            .hp-hero-grid {
              grid-template-columns: 1fr 1fr;
              align-items: center;
              padding-top: 3rem;
              padding-bottom: 7rem;
            }
          }
          .hp-features-grid {
            display: grid;
            gap: 2rem;
            grid-template-columns: repeat(3, 1fr);
          }
          @media (max-width: 900px) {
            .hp-features-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 580px) {
            .hp-features-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        {/* Hero */}
        <section className="hp-hero-grid">
          <div style={{ position: "relative", zIndex: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="hp-chip"
            >
              <Sparkle style={{ width: "0.75rem", height: "0.75rem", color: "var(--hp-primary)" }} />
              <span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Beta</span>
            </motion.div>

            <h1 style={{
              marginTop: "1.25rem",
              fontSize: "clamp(2.75rem, 6vw, 5.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              color: "var(--hp-foreground)",
            }}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ display: "block" }}
              >
                Ace your consulting
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ display: "block", color: "var(--hp-primary)" }}
              >
                case interview.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                marginTop: "1.5rem",
                maxWidth: "28rem",
                fontSize: "1.05rem",
                color: "var(--hp-soft-foreground)",
                lineHeight: 1.65,
                fontWeight: 400,
              }}
            >
              Practice with a realistic interviewer simulation. Firm-specific scoring from MBB, Big 4, and 10+ leading consulting firms.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}
            >
              <button
                className="hp-btn-primary hp-btn-lg"
                onClick={() => router.push(cta)}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "inherit" }}
              >
                {user ? "Open dashboard" : "Get started free"}
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>

          {/* Hero illustration */}
          <div style={{ position: "relative" }}>
            <motion.div
              aria-hidden
              style={{ position: "absolute", inset: "2.5rem", zIndex: 0, background: "var(--hp-lavender)", opacity: 0.65 }}
              animate={{ borderRadius: ["60% 40% 50% 50% / 50% 60% 40% 50%", "40% 60% 60% 40% / 60% 30% 70% 40%", "60% 40% 50% 50% / 50% 60% 40% 50%"] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              src="/homepage/hero-3d.png"
              alt=""
              style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "32rem", margin: "0 auto", display: "block" }}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              style={{ position: "absolute", right: "1rem", top: "1.5rem", zIndex: 2, color: "var(--hp-primary)" }}
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star style={{ width: "2rem", height: "2rem" }} />
            </motion.div>
            <motion.div
              style={{ position: "absolute", left: "0.5rem", bottom: "2.5rem", zIndex: 2, color: "var(--hp-mint)" }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkle style={{ width: "1.75rem", height: "1.75rem" }} />
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" style={{ padding: "5rem 2.5rem" }}>
          <Reveal>
            <div style={{ maxWidth: "40rem", margin: "0 auto", textAlign: "center" }}>
              <div className="hp-chip" style={{ display: "inline-flex", marginBottom: "1rem" }}>
                <Sparkle style={{ width: "0.75rem", height: "0.75rem", color: "var(--hp-primary)" }} />
                Features
              </div>
              <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", letterSpacing: "-0.02em", fontWeight: 700, color: "var(--hp-foreground)" }}>
                Built for <span style={{ color: "var(--hp-primary)" }}>serious prep.</span>
              </h2>
            </div>
          </Reveal>

          <div className="hp-features-grid" style={{ marginTop: "3.5rem" }}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <div className="hp-surface-card" style={{ position: "relative", padding: "1.75rem", height: "100%", boxSizing: "border-box" }}>
                  <div style={{
                    position: "absolute", top: "-1rem", right: "-1rem",
                    width: "2.5rem", height: "2.5rem",
                    display: "grid", placeItems: "center",
                    borderRadius: "9999px",
                    background: "var(--hp-primary)",
                    color: "var(--hp-primary-foreground)",
                    fontWeight: 700, fontSize: "0.875rem",
                    boxShadow: "var(--hp-shadow-pop)",
                    fontFamily: "inherit",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <motion.img
                    src={f.img}
                    alt=""
                    loading="lazy"
                    style={{ display: "block", margin: "0 auto", width: "10rem", height: "10rem", objectFit: "contain" }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                  />
                  <h3 style={{ marginTop: "1rem", fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--hp-foreground)" }}>
                    {f.title}
                  </h3>
                  <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--hp-soft-foreground)", lineHeight: 1.65 }}>
                    {f.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ padding: "0 2.5rem 4rem" }}>
          <Reveal>
            <div style={{ position: "relative", overflow: "hidden", borderRadius: "1.5rem", background: "var(--hp-primary)", padding: "4rem 2rem", textAlign: "center" }}>
              <motion.div
                style={{ position: "absolute", left: "-2rem", top: "50%", transform: "translateY(-50%)", color: "oklch(0.99 0.005 95 / 20%)" }}
                animate={{ y: ["-50%", "calc(-50% - 10px)", "-50%"] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <Star style={{ width: "5rem", height: "5rem" }} />
              </motion.div>
              <motion.div
                style={{ position: "absolute", right: "-1rem", top: "2rem", color: "oklch(0.99 0.005 95 / 20%)" }}
                animate={{ rotate: [0, 12, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkle style={{ width: "3rem", height: "3rem" }} />
              </motion.div>

              <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", letterSpacing: "-0.02em", fontWeight: 700, color: "var(--hp-primary-foreground)", position: "relative", zIndex: 1 }}>
                Ready to ace your next case?
              </h2>
              <p style={{ margin: "0.75rem auto 0", maxWidth: "28rem", color: "oklch(0.99 0.005 95 / 80%)", fontSize: "1rem", lineHeight: 1.6, position: "relative", zIndex: 1 }}>
                Pick a firm. Pick a case. Start talking. We&apos;ll do the interviewing.
              </p>
              <div style={{ marginTop: "1.75rem", position: "relative", zIndex: 1 }}>
                <button
                  className="hp-btn-secondary hp-btn-lg"
                  onClick={() => router.push(cta)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "inherit" }}
                >
                  {user ? "Open dashboard" : "Start practicing free"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid var(--hp-border)", padding: "1.5rem 2.5rem", textAlign: "center", fontSize: "0.75rem", color: "var(--hp-soft-foreground)" }}>
          made with care · mycaseprep · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}