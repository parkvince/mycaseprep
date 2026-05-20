import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#ffffff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "24px",
    }}>
      <Link href="/" style={{
        color: "#777777",
        fontSize: "14px",
        textDecoration: "none",
        alignSelf: "center",
      }}>
        ← Back to home
      </Link>
      <SignIn
        appearance={{
          variables: {
            colorBackground: "#ffffff",
            colorText: "#111111",
            colorPrimary: "#111111",
            colorInputBackground: "#f9f9f9",
            colorInputText: "#111111",
            borderRadius: "7px",
            fontFamily: "Inter, sans-serif",
          },
          elements: {
            card: {
              boxShadow: "none",
              border: "1px solid #e5e5e5",
            },
            headerTitle: {
              fontFamily: "Instrument Serif, serif",
              fontWeight: 400,
            },
          }
        }}
        routing="path"
        path="/auth/sign-in"
        signUpUrl="/auth/sign-up"
      />
    </main>
  );
}