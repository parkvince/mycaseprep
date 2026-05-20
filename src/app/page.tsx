"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser, UserButton } from "@clerk/nextjs";

const firms = [
  "McKinsey", "Bain", "BCG",
  "EY-Parthenon", "Deloitte", "KPMG",
  "PwC Strategy&", "Roland Berger", "Accenture",
  "Oliver Wyman", "Kearney", "L.E.K.",
  "Monitor Deloitte", "IBM Consulting", "Huron",
];

const features = [
  {
    number: "01",
    title: "Firm-Specific Feedback",
    desc: "Get graded exactly how McKinsey, Bain, and BCG would evaluate you. Each firm has its own rubric and feedback style.",
  },
  {
    number: "02",
    title: "AI Interviewer",
    desc: "A realistic AI interviewer that never gives away answers. It pushes back, asks follow-ups, and holds a high bar.",
  },
  {
    number: "03",
    title: "Detailed Scorecard",
    desc: "Structure, quantitative accuracy, communication — each dimension scored, explained, and benchmarked.",
  },
  {
    number: "04",
    title: "Voice + Text Modes",
    desc: "Practice speaking out loud or typing your answers. Both modes simulate real interview conditions.",
  },
  {
    number: "05",
    title: "Top 1% Answers",
    desc: "After each case, see exactly what the best candidates would have said differently.",
  },
  {
    number: "06",
    title: "Performance Tracking",
    desc: "Track your improvement across every session. Identify your weak spots before your real interview.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>

      {/* Navbar */}
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
          style={{
            fontFamily: "Cormorant, serif",
            fontSize: "22px",
            fontWeight: 500,
            color: "#111111",
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          MyCasePrep
        </span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {isSignedIn ? (
            <>
              <span style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
              }}>
                {user.firstName ?? user.emailAddresses[0].emailAddress}
              </span>
              <button
                className="btn-primary"
                style={{ padding: "7px 16px" }}
                onClick={() => router.push("/dashboard")}
              >
                Start a Case
              </button>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <button
                className="btn-secondary"
                style={{ padding: "7px 16px" }}
                onClick={() => router.push("/auth/sign-in")}
              >
                Sign in
              </button>
              <button
                className="btn-primary"
                style={{ padding: "7px 16px" }}
                onClick={() => router.push("/auth/sign-up")}
              >
                Get started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "100px 48px 80px",
        textAlign: "center",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{
            fontSize: "clamp(40px, 6vw, 68px)",
            lineHeight: 1.08,
            fontWeight: 400,
            marginBottom: "24px",
            letterSpacing: "-0.02em",
          }}>
            Ace your consulting
            <br />
            case interview.
          </h1>
          <p style={{
            fontSize: "17px",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            marginBottom: "36px",
            maxWidth: "480px",
            margin: "0 auto 36px",
          }}>
            Practice with a realistic AI interviewer. Get firm-specific scoring from MBB, Big 4, and 10+ leading consulting firms.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            {isSignedIn ? (
              <button
                className="btn-primary"
                style={{ fontSize: "15px", padding: "11px 28px" }}
                onClick={() => router.push("/dashboard")}
              >
                Start practicing →
              </button>
            ) : (
              <button
                className="btn-primary"
                style={{ fontSize: "15px", padding: "11px 28px" }}
                onClick={() => router.push("/auth/sign-up")}
              >
                Get started free
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Firms ticker */}
      <section style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "16px 0",
        overflow: "hidden",
        position: "relative",
      }}>
        <style>{`
          @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-track {
            display: flex;
            width: max-content;
            animation: ticker 28s linear infinite;
          }
          .ticker-track:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="ticker-track">
          {[...firms, ...firms].map((firm, i) => (
            <span key={i} style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              fontWeight: 500,
              padding: "0 32px",
              whiteSpace: "nowrap",
              borderRight: "1px solid var(--border)",
            }}>
              {firm}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "96px 48px",
      }}>
        <h2 style={{
          fontSize: "clamp(26px, 3vw, 38px)",
          fontWeight: 400,
          textAlign: "center",
          marginBottom: "64px",
          letterSpacing: "-0.01em",
        }}>
          Everything you need to get the offer.
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1px",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          overflow: "hidden",
        }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                padding: "32px",
                background: "var(--bg)",
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                letterSpacing: "0.08em",
                marginBottom: "16px",
              }}>
                {f.number}
              </div>
              <h3 style={{
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "8px",
                fontFamily: "Inter, sans-serif",
                letterSpacing: "-0.01em",
              }}>
                {f.title}
              </h3>
              <p style={{
                color: "var(--text-secondary)",
                fontSize: "14px",
                lineHeight: 1.6,
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        borderTop: "1px solid var(--border)",
        padding: "96px 48px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontSize: "clamp(26px, 3vw, 38px)",
          fontWeight: 400,
          marginBottom: "16px",
          letterSpacing: "-0.01em",
        }}>
          Ready to start practicing?
        </h2>
        <p style={{
          color: "var(--text-secondary)",
          marginBottom: "32px",
          fontSize: "16px",
        }}>
          Free to use. No credit card required.
        </p>
        <button
          className="btn-primary"
          style={{ fontSize: "15px", padding: "11px 28px" }}
          onClick={() => router.push(isSignedIn ? "/dashboard" : "/auth/sign-up")}
        >
          {isSignedIn ? "Start practicing →" : "Get started free"}
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "24px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "var(--text-secondary)",
        fontSize: "13px",
      }}>
        <span style={{ fontFamily: "Instrument Serif, serif", fontSize: "16px", color: "var(--text-primary)" }}>
          MyCasePrep
        </span>
        <span>Built by Vince Park · 2025</span>
      </footer>
    </main>
  );
}