"use client";

import { useState } from "react";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

/** A jargon word/phrase with a plain-language definition on hover/tap — for
 * beginners who've never done a case interview and don't know what "MECE" or
 * "hypothesis-driven" mean yet. */
export default function Term({ children, define }: { children: React.ReactNode; define: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      style={{ position: "relative", display: "inline" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        style={{
          textDecoration: "underline", textDecorationStyle: "dotted",
          textDecorationColor: "var(--hp-primary)", textUnderlineOffset: "3px",
          cursor: "help", fontWeight: 600, color: "inherit",
        }}
      >
        {children}
      </span>
      {open && (
        <span
          style={{
            position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
            width: "220px", background: "var(--hp-foreground, #17171c)", color: "white",
            fontSize: "0.75rem", fontWeight: 500, lineHeight: 1.5, fontFamily: FONT,
            padding: "0.6rem 0.75rem", borderRadius: "10px", boxShadow: "0 8px 24px oklch(0.4 0.05 280 / 25%)",
            zIndex: 50, textAlign: "left", whiteSpace: "normal",
          }}
        >
          {define}
          <span style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid var(--hp-foreground, #17171c)" }} />
        </span>
      )}
    </span>
  );
}
