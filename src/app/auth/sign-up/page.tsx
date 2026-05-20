import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "24px",
    }}>
      <Link href="/" style={{
        color: "var(--text-secondary)",
        fontSize: "14px",
        textDecoration: "none",
      }}>
        ← Back to home
      </Link>
      <SignUp
        appearance={{
          variables: {
            colorBackground: "#12121a",
            colorText: "#f0f0f5",
            colorPrimary: "#6366f1",
            colorInputBackground: "#1a1a26",
            colorInputText: "#f0f0f5",
          }
        }}
        routing="path"
        path="/auth/sign-up"
        signInUrl="/auth/sign-in"
      />
    </main>
  );
}