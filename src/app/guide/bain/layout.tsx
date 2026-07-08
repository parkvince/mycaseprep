import type { Metadata } from "next";

export const metadata: Metadata = { title: "Bain Deep Dive" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
