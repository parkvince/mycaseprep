import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#fafafa",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    }}>
      {/* Left Panel */}
      <div style={{
        background: "#111111",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "48px",
        padding: "48px",
      }}>
        <Link href="/" style={{
          fontFamily: "Cormorant, serif",
          fontSize: "22px",
          fontWeight: 500,
          color: "#ffffff",
          textDecoration: "none",
        }}>
          MyCasePrep
        </Link>

        <div>
          <p style={{
            fontFamily: "Cormorant, serif",
            fontSize: "clamp(36px, 4vw, 58px)",
            fontWeight: 400,
            color: "#ffffff",
            lineHeight: 1.15,
            marginBottom: "20px",
            letterSpacing: "-0.01em",
          }}>
            Your offer
            <br />
            starts here.
          </p>
          <p style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.6,
            maxWidth: "320px",
          }}>
            Practice with a realistic AI interviewer. Get scored like a real consulting candidate.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            "Firm-specific feedback from MBB, Big 4 and more",
            "Detailed scorecard after every case",
            "See what a top 1% candidate would say",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.4)",
                flexShrink: 0,
              }} />
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "64px 80px",
      }}>
        <p style={{
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#777777",
          marginBottom: "8px",
        }}>
          Free to start
        </p>
        <h1 style={{
          fontFamily: "Cormorant, serif",
          fontSize: "32px",
          fontWeight: 400,
          color: "#111111",
          marginBottom: "32px",
          letterSpacing: "-0.01em",
        }}>
          Create your account
        </h1>
        <div style={{ width: "100%" }}>
          <SignUp
            appearance={{
              variables: {
                colorBackground: "#fafafa",
                colorText: "#111111",
                colorPrimary: "#111111",
                colorInputBackground: "#ffffff",
                colorInputText: "#111111",
                borderRadius: "7px",
                fontFamily: "Inter, sans-serif",
              },
              elements: {
                rootBox: { width: "100%" },
                card: {
                  boxShadow: "none",
                  border: "none",
                  padding: 0,
                  background: "transparent",
                  width: "100%",
                },
                headerTitle: { display: "none" },
                headerSubtitle: { display: "none" },
                socialButtonsBlockButton: {
                  border: "1px solid #e5e5e5",
                  background: "#ffffff",
                  color: "#111111",
                  borderRadius: "7px",
                },
                formButtonPrimary: {
                  background: "#111111",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "7px",
                },
                footerActionLink: { color: "#111111" },
                footer: { display: "none" },
                badge: { display: "none" },
              }
            }}
            routing="path"
            path="/auth/sign-up"
            signInUrl="/auth/sign-in"
          />
        </div>
        <p style={{ fontSize: "13px", color: "#777777", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link href="/auth/sign-in" style={{ color: "#111111", fontWeight: 500, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}