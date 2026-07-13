import Link from "next/link";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

export default function NotFound() {
  return (
    <main style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: "1rem", fontFamily: FONT, padding: "0 1.5rem", textAlign: "center",
      background: "var(--hp-bg, oklch(0.985 0.005 285))",
    }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--hp-soft-foreground, #8b8b96)" }}>
        404
      </div>
      <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--hp-foreground, #17171c)", margin: 0 }}>
        This page doesn&apos;t exist
      </h1>
      <p style={{ fontSize: "0.9rem", color: "var(--hp-soft-foreground, #8b8b96)", maxWidth: "360px", margin: 0, lineHeight: 1.7 }}>
        The link might be broken, or the page may have moved.
      </p>
      <Link
        href="/"
        style={{ marginTop: "0.5rem", height: "44px", padding: "0 1.5rem", borderRadius: "10px", display: "inline-flex", alignItems: "center", background: "var(--hp-primary, #7c5cfc)", color: "white", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}
      >
        Back to home
      </Link>
    </main>
  );
}
