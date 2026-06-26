"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, BookOpen, Play, Settings } from "lucide-react";
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

function NavIconBtn({
  icon,
  label,
  onClick,
  primary,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
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
          border: primary ? "none" : "1px solid var(--hp-border)",
          background: primary ? "var(--hp-primary)" : "transparent",
          color: primary ? "var(--hp-primary-foreground)" : "var(--hp-soft-foreground)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.15s",
          ...(hovered && !primary ? { background: "var(--hp-primary-soft)", color: "var(--hp-foreground)" } : {}),
        }}
      >
        {icon}
      </button>
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--hp-foreground)",
            color: "white",
            fontSize: "11px",
            fontWeight: 500,
            padding: "4px 8px",
            borderRadius: "5px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 200,
            fontFamily: "inherit",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user;
  const cta = user ? "/dashboard" : "/auth";

  return (
    <div
      style={{
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
      }}
    >
      {/* Nav — full width */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--hp-border)",
          background: "white",
          padding: "0.875rem 2rem",
          boxSizing: "border-box",
        }}
      >
        <div
          onClick={() => router.push("/")}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
        >
          <div
            style={{
              width: "2.25rem",
              height: "2.25rem",
              display: "grid",
              placeItems: "center",
              borderRadius: "0.75rem",
              background: "var(--hp-primary)",
              color: "var(--hp-primary-foreground)",
            }}
          >
            <Sparkles size={20} />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.1rem",
              letterSpacing: "-0.02em",
              color: "var(--hp-foreground)",
            }}
          >
            mycaseprep
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {!loading && (
            user ? (
              <>
                <NavIconBtn icon={<Clock size={17} />} label="History" onClick={() => router.push("/history")} />
                <NavIconBtn icon={<BookOpen size={17} />} label="Library" onClick={() => router.push("/library")} />
                <NavIconBtn icon={<Play size={17} />} label="Start a Case" onClick={() => router.push("/dashboard")} primary />
                <NavIconBtn icon={<Settings size={17} />} label="Settings" onClick={() => router.push("/settings")} />
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/auth")}
                  style={{
                    height: "36px",
                    padding: "0 1rem",
                    borderRadius: "9999px",
                    border: "1px solid var(--hp-border-strong)",
                    background: "white",
                    color: "var(--hp-foreground)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Sign in
                </button>
                <button
                  className="hp-btn-primary hp-btn-sm"
                  onClick={() => router.push("/auth")}
                  style={{ fontFamily: "inherit" }}
                >
                  Get started
                </button>
              </>
            )
          )}
        </div>
      </header>

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        <style>{`
          .hp-hero-grid {
            display: grid;
            gap: 2.5rem;
            padding: 3rem 2.5rem 5rem;
          }
          @media (min-width: 1024px) {
            .hp-hero-grid {
              grid-template-columns: 1fr 1fr;
              align-items: center;
              padding-top: 4rem;
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

            <h1
              style={{
                marginTop: "1.25rem",
                fontSize: "clamp(2.75rem, 6vw, 5.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontWeight: 700,
                color: "var(--hp-foreground)",
              }}
            >
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
                {user ? "Open dashboard" : "Start practicing"}
                <ArrowRight size={18} />
              </button>
              <a
                href="#features"
                className="hp-btn-secondary hp-btn-lg"
                style={{ textDecoration: "none", fontFamily: "inherit" }}
              >
                See features
              </a>
            </motion.div>
          </div>

          {/* Hero illustration */}
          <div style={{ position: "relative" }}>
            <motion.div
              aria-hidden
              style={{
                position: "absolute",
                inset: "2.5rem",
                zIndex: 0,
                background: "var(--hp-lavender)",
                opacity: 0.65,
              }}
              animate={{
                borderRadius: [
                  "60% 40% 50% 50% / 50% 60% 40% 50%",
                  "40% 60% 60% 40% / 60% 30% 70% 40%",
                  "60% 40% 50% 50% / 50% 60% 40% 50%",
                ],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              src="/homepage/hero-3d.png"
              alt=""
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                maxWidth: "32rem",
                margin: "0 auto",
                display: "block",
              }}
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
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 3rem)",
                  letterSpacing: "-0.02em",
                  fontWeight: 700,
                  color: "var(--hp-foreground)",
                }}
              >
                Built for{" "}
                <span style={{ color: "var(--hp-primary)" }}>serious prep.</span>
              </h2>
            </div>
          </Reveal>

          <div className="hp-features-grid" style={{ marginTop: "3.5rem" }}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <div
                  className="hp-surface-card"
                  style={{ position: "relative", padding: "1.75rem", height: "100%", boxSizing: "border-box" }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-1rem",
                      right: "-1rem",
                      width: "2.5rem",
                      height: "2.5rem",
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "9999px",
                      background: "var(--hp-primary)",
                      color: "var(--hp-primary-foreground)",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      boxShadow: "var(--hp-shadow-pop)",
                      fontFamily: "inherit",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <motion.img
                    src={f.img}
                    alt=""
                    loading="lazy"
                    style={{
                      display: "block",
                      margin: "0 auto",
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                  />
                  <h3
                    style={{
                      marginTop: "1rem",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      color: "var(--hp-foreground)",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--hp-soft-foreground)",
                      lineHeight: 1.65,
                    }}
                  >
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
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "1.5rem",
                background: "var(--hp-primary)",
                padding: "4rem 2rem",
                textAlign: "center",
              }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  left: "-2rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "oklch(0.99 0.005 95 / 20%)",
                }}
                animate={{ y: ["-50%", "calc(-50% - 10px)", "-50%"] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <Star style={{ width: "5rem", height: "5rem" }} />
              </motion.div>
              <motion.div
                style={{
                  position: "absolute",
                  right: "-1rem",
                  top: "2rem",
                  color: "oklch(0.99 0.005 95 / 20%)",
                }}
                animate={{ rotate: [0, 12, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkle style={{ width: "3rem", height: "3rem" }} />
              </motion.div>

              <h2
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 3rem)",
                  letterSpacing: "-0.02em",
                  fontWeight: 700,
                  color: "var(--hp-primary-foreground)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Ready to ace your next case?
              </h2>
              <p
                style={{
                  margin: "0.75rem auto 0",
                  maxWidth: "28rem",
                  color: "oklch(0.99 0.005 95 / 80%)",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Pick a firm. Pick a case. Start talking. We&apos;ll do the interviewing.
              </p>
              <div style={{ marginTop: "1.75rem", position: "relative", zIndex: 1 }}>
                <button
                  className="hp-btn-secondary hp-btn-lg"
                  onClick={() => router.push(cta)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "inherit" }}
                >
                  {user ? "Open dashboard" : "Start practicing"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid var(--hp-border)",
            padding: "1.5rem 2.5rem",
            textAlign: "center",
            fontSize: "0.75rem",
            color: "var(--hp-soft-foreground)",
          }}
        >
          made by vince park · mycaseprep · {new Date().getFullYear()}
        </footer>

      </div>
    </div>
  );
}