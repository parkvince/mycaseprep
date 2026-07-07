import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s · MyCasePrep",
    default: "Case Interview Guide",
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
