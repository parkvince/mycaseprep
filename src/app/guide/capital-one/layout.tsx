import type { Metadata } from "next";

export const metadata: Metadata = { title: "Capital One Deep Dive" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
