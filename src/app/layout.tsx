import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyCasePrep — AI Consulting Interview Simulator",
  description:
    "Practice consulting case interviews with AI. Get firm-specific feedback from McKinsey, Bain, BCG and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}