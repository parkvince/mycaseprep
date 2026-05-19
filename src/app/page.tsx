"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const firms = [
  "McKinsey", "Bain", "BCG",
  "EY-Parthenon", "Deloitte", "KPMG",
  "PwC Strategy&", "Roland Berger", "Accenture",
  "Oliver Wyman", "Kearney", "L.E.K.",
  "Monitor Deloitte", "IBM Consulting", "Huron",
];

const features = [
  {
    icon: "01",
    title: "Firm-Specific Feedback",
    desc: "Get graded exactly how McKinsey, Bain, and BCG would evaluate you. Each firm has its own rubric and feedback style.",
  },
  {
    icon: "02",
    title: "AI Interviewer",
    desc: "A realistic AI interviewer that never gives away answers. It pushes back, asks follow-ups, and holds a high bar.",
  },
  {
    icon: "03",
    title: "Detailed Scorecard",
    desc: "Structure, quantitative accuracy, communication — each dimension scored, explained, and benchmarked.",
  },
  {
    icon: "04",
    title: "Voice + Text Modes",
    desc: "Practice speaking out loud or typing your answers. Both modes simulate real interview conditions.",
  },
  {
    icon: "05",
    title: "Top 1% Answers",
    desc: "After each case, see exactly what the best candidates would have said differently.",
  },
  {
    icon: "06",
    title: "Performance Dashboard",
    desc: "Track your improvement across every session. Identify your weak spots before your real interview.",
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 48px",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          background: "rgba(10,10,15,0.95)",
          backdropFilter: "blur(10px)",
          zIndex: 100,
        }}
      >
        <span
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          MyCasePrep
        </span>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn-secondary"
            onClick={() => router.push("/auth/sign-in")}
          >
            Sign In
          </button>
          <button
            className="btn-primary"
            onClick={() => router.push("/auth/sign-up")}
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "120px 48px 80px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              display: "inline-block",
              background: "var(--accent-glow)",
              border: "1px solid var(--accent)",
              borderRadius: "20px",
              padding: "6px 16px",
              fontSize: "13px",
              color: "var(--accent)",
              marginBottom: "24px",
              fontWeight: 500,
            }}
          >
            AI-Powered Case Interview Practice
          </div>
          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1.1,
              marginBottom: "24px",
              fontWeight: 700,
            }}
          >
            Crack Your Consulting
            <br />
            <span style={{ color: "var(--accent)" }}>Case Interview.</span>
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              marginBottom: "40px",
              maxWidth: "560px",
              margin: "0 auto 40px",
            }}
          >
            Practice with a realistic AI interviewer. Get firm-specific scoring from MBB, Big
            4, and 10+ leading consulting firms. Know exactly where you stand.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <button
              className="btn-primary glow"
              style={{ fontSize: "16px", padding: "14px 32px" }}
              onClick={() => router.push("/auth/sign-up")}
            >
              Start Practicing Free →
            </button>
            <button
              className="btn-secondary"
              style={{ fontSize: "16px", padding: "14px 32px" }}
              onClick={() => router.push("/dashboard")}
            >
              View Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Firms ticker */}
      <section
        style={{
          padding: "40px 48px",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "center",
          gap: "48px",
          flexWrap: "wrap",
        }}
      >
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            alignSelf: "center",
          }}
        >

        </p>
        {firms.map((firm) => (
          <span
            key={firm}
            style={{
              color: "var(--text-secondary)",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            {firm}
          </span>
        ))}
      </section>

      {/* Features */}
      <section
        style={{
          padding: "100px 48px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "clamp(28px, 4vw, 42px)",
            marginBottom: "64px",
          }}
        >
          Everything you need to{" "}
          <span style={{ color: "var(--accent)" }}>get the offer.</span>
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ padding: "32px" }}
            >
              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: "0.1em",
                marginBottom: "16px",
                fontFamily: "DM Sans, sans-serif",
              }}>
              {f.icon}
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  marginBottom: "8px",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 600,
                }}
              >
                {f.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "100px 48px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", marginBottom: "16px" }}>
          Ready to start?
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "40px",
            fontSize: "17px",
          }}
        >
          Free to use. No credit card required.
        </p>
        <button
          className="btn-primary glow"
          style={{ fontSize: "16px", padding: "14px 32px" }}
          onClick={() => router.push("/auth/sign-up")}
        >
          Start Practicing Free →
        </button>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "32px",
          borderTop: "1px solid var(--border)",
          color: "var(--text-secondary)",
          fontSize: "14px",
        }}
      >
        Built by Vince Park · MyCasePrep © 2025
      </footer>
    </main>
  );
}