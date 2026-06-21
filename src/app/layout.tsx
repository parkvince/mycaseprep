import type { Metadata } from "next";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyCP - AI Case Practice",
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
      <body suppressHydrationWarning>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}