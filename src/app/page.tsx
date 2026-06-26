"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal, Stagger, StaggerChild } from "@/components/ui/reveal";
import { Sparkle, Arrow, Star } from "@/components/ui/doodle";

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

export default function LandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user;
  const cta = user ? "/dashboard" : "/auth";

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.3 });

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
      {/* Scroll progress bar */}
      <motion.div
        style={{
          scaleX: progress,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "var(--hp-primary)",
          transformOrigin: "left",
          zIndex: 60,
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* Nav */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--hp-border)",
            background: "oklch(1 0 0 / 80%)",
            backdropFilter: "blur(12px)",
            padding: "1rem 2rem",
          }}
        >
          <div
            onClick={() => router.push("/")}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
            </motion.div>
            <span style={{ fontWeight: 600, fontSize: "1.2rem", letterSpacing: "-0.025em", color: "var(--hp-foreground)" }}>
              mycaseprep
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {!loading && !user && (
              <button className="hp-btn-ghost hp-btn-sm" onClick={() => router.push("/auth")}>
                Log in
              </button>
            )}
            <button className="hp-btn-primary hp-btn-sm" onClick={() => router.push(cta)}>
              {user ? "Open dashboard" : "Get started"}
            </button>
          </div>
        </header>

        {/* Hero */}
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
        `}</style>

        <section className="hp-hero-grid">
          {/* Left: copy */}
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
                style={{ display: "block", fontStyle: "italic", color: "var(--hp-primary)" }}
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
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                {user ? "Open dashboard" : "Start practicing"}
                <ArrowRight size={18} />
              </button>
              <a
                href="#features"
                className="hp-btn-secondary hp-btn-lg"
                style={{ textDecoration: "none" }}
              >
                See features
              </a>
            </motion.div>

            <div style={{ position: "absolute", left: "-1rem", bottom: "-2rem" }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{ color: "var(--hp-primary)", opacity: 0.5 }}
              >
                <Arrow style={{ transform: "rotate(10deg)" }} />
              </motion.div>
            </div>
          </div>

          {/* Right: illustration */}
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
                  color: "var(--hp-foreground)",
                }}
              >
                Built for{" "}
                <span style={{ fontStyle: "italic", color: "var(--hp-primary)" }}>serious prep.</span>
              </h2>
            </div>
          </Reveal>

          <div
            style={{
              marginTop: "3.5rem",
              display: "grid",
              gap: "1.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            <Stagger>
              {FEATURES.map((f, i) => (
                <StaggerChild key={f.title}>
                  <div
                    className="hp-surface-card"
                    style={{ position: "relative", height: "100%", padding: "1.75rem" }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-1.5rem",
                        right: "-1rem",
                        width: "3rem",
                        height: "3rem",
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "0.75rem",
                        background: "var(--hp-primary)",
                        color: "var(--hp-primary-foreground)",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        boxShadow: "var(--hp-shadow-pop)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <motion.img
                      src={f.img}
                      alt=""
                      width={180}
                      height={180}
                      loading="lazy"
                      style={{
                        display: "block",
                        margin: "0 auto",
                        width: "11rem",
                        height: "11rem",
                        objectFit: "contain",
                      }}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                    />
                    <h3
                      style={{
                        marginTop: "1rem",
                        fontSize: "1.35rem",
                        fontWeight: 600,
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
                </StaggerChild>
              ))}
            </Stagger>
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
                  color: "oklch(0.99 0.005 95 / 25%)",
                }}
                animate={{ y: ["-50%", "calc(-50% - 10px)", "-50%"] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <Star style={{ width: "4rem", height: "4rem" }} />
              </motion.div>
              <motion.div
                style={{
                  position: "absolute",
                  right: "-1rem",
                  top: "2rem",
                  color: "oklch(0.99 0.005 95 / 25%)",
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
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
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
          made with care · mycaseprep · {new Date().getFullYear()}
        </footer>

      </div>
    </div>
  );
}