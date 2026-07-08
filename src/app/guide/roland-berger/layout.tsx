import type { Metadata } from "next";

export const metadata: Metadata = { title: "Roland Berger Deep Dive" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
