import type { Metadata } from "next";

export const metadata: Metadata = { title: "Huron Deep Dive" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
