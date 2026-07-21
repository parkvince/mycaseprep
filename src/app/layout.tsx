import type { Metadata } from "next";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";

export const metadata: Metadata = {
  title: {
    template: "%s · MyCasePrep",
    default: "MyCasePrep · AI Case Interview Practice",
  },
  description: "Practice consulting case interviews with AI. Get firm-specific feedback from McKinsey, Bain, BCG and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {/* Lets keyboard and screen-reader users jump past the nav on every page
            instead of tabbing through it repeatedly (WCAG 2.4.1). Visually hidden
            until it receives focus. */}
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <SessionWrapper>
          <div id="main-content">{children}</div>
        </SessionWrapper>
      </body>
    </html>
  );
}