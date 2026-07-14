"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const TOOLTIP_WIDTH = 220;

/** A jargon word/phrase with a plain-language definition on hover/tap - for
 * beginners who've never done a case interview and don't know what "MECE" or
 * "hypothesis-driven" mean yet.
 *
 * Renders the tooltip through a portal to <body>, positioned in fixed/viewport
 * coordinates rather than as a normal absolutely-positioned child. Terms often
 * sit inside containers with overflow:hidden (e.g. an animated accordion panel)
 * - a regular absolute-positioned popup gets silently clipped there, showing
 * only a sliver of its edge instead of the tooltip. */
export default function Term({ children, define }: { children: React.ReactNode; define: string }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  const show = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setCoords({
        top: rect.top,
        left: Math.min(Math.max(rect.left + rect.width / 2, TOOLTIP_WIDTH / 2 + 8), window.innerWidth - TOOLTIP_WIDTH / 2 - 8),
      });
    }
    setOpen(true);
  };
  const hide = () => setOpen(false);

  return (
    <span
      ref={ref}
      onMouseEnter={show}
      onMouseLeave={hide}
      onClick={e => { e.stopPropagation(); if (open) hide(); else show(); }}
      style={{
        textDecoration: "underline", textDecorationStyle: "dotted",
        textDecorationColor: "var(--hp-primary)", textUnderlineOffset: "3px",
        cursor: "help", fontWeight: 600, color: "inherit",
      }}
    >
      {children}
      {open && coords && typeof document !== "undefined" && createPortal(
        <span
          style={{
            position: "fixed", top: coords.top - 10, left: coords.left, transform: "translate(-50%, -100%)",
            width: `${TOOLTIP_WIDTH}px`, background: "var(--hp-foreground, #17171c)", color: "white",
            fontSize: "0.75rem", fontWeight: 500, lineHeight: 1.5, fontFamily: FONT,
            padding: "0.6rem 0.75rem", borderRadius: "10px", boxShadow: "0 8px 24px oklch(0.4 0.05 280 / 25%)",
            zIndex: 9999, textAlign: "left", whiteSpace: "normal", pointerEvents: "none",
          }}
        >
          {define}
          <span style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid var(--hp-foreground, #17171c)" }} />
        </span>,
        document.body
      )}
    </span>
  );
}
