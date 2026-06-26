"use client";

export function Squiggle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 14" className={className} style={{ width: "100%", ...style }} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M2 7 Q 12 -2, 22 7 T 42 7 T 62 7 T 82 7 T 102 7 T 118 7" />
    </svg>
  );
}

export function Star({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ width: "1.5rem", height: "1.5rem", ...style }} fill="currentColor">
      <path d="M12 2l1.7 6.8L20 10l-5.5 4 2 6.8L12 17l-4.5 3.8 2-6.8L4 10l6.3-1.2z" />
    </svg>
  );
}

export function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ width: "1.25rem", height: "1.25rem", ...style }} fill="currentColor">
      <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
    </svg>
  );
}

export function Arrow({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 64 40" className={className} style={{ width: "4rem", height: "2.5rem", ...style }} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 28 C 14 8, 32 4, 56 14" />
      <path d="M56 14 L 48 10 M56 14 L 52 22" />
    </svg>
  );
}

export function Dots({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 20" className={className} style={{ width: "3rem", height: "1rem", ...style }} fill="currentColor">
      <circle cx="6" cy="10" r="3" />
      <circle cx="20" cy="10" r="3" />
      <circle cx="34" cy="10" r="3" />
      <circle cx="48" cy="10" r="3" />
    </svg>
  );
}

export function Underline({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 14" className={className} style={{ width: "100%", ...style }} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M4 10 Q 50 2, 100 8 T 196 6" />
    </svg>
  );
}

export function Loop({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 40" className={className} style={{ width: "5rem", height: "2.5rem", ...style }} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M4 32 Q 20 4, 40 20 T 76 16" />
    </svg>
  );
}