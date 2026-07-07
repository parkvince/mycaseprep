import type { Metadata } from "next";

export const metadata: Metadata = { title: "McKinsey Deep Dive" };

export default function McKinseyGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
