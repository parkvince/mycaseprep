import type { Metadata } from "next";

export const metadata: Metadata = { title: "Case Practice" };

export default function CaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
