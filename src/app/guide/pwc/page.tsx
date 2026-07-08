"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { PWC_RUBRIC, calculatePwcOffer } from "@/lib/firmRubrics/pwc";

const RATE_THIS = {
  structure: {
    response: "\"My initial view is this is a capability gap, not a market problem, let's test that first.\"",
    score: 4,
    reasoning: "A clear, testable hypothesis stated early that organizes the whole analysis, exactly Strategy&'s hypothesis-led standard.",
  },
  quantitative: {
    response: "\"The breakeven volume is about 40,000 units a year, so if this only sells 25,000, it doesn't clear the bar financially.\"",
    score: 4,
    reasoning: "Grounds the strategic question in financial feasibility, exactly what PwC Strategy& expects alongside the strategic logic.",
  },
  strategicJudgment: {
    response: "\"This looks attractive because the market is growing fast.\"",
    score: 2,
    reasoning: "Confuses an external market tailwind with the client's own distinctive capability to win, the classic Strategy& scoring gap.",
  },
  communication: {
    response: "Candidate uses generic consulting jargon (\"synergies,\" \"leverage core competencies\") without connecting it to the specific client or sector.",
    score: 2,
    reasoning: "Generic language disconnected from the case's actual industry context, rather than adapted, sector-aware delivery.",
  },
  behavioralFit: {
    response: "\"Honestly I applied here as a backup in case McKinsey doesn't work out.\"",
    score: 1,
    reasoning: "An explicit MBB-backup signal. PwC's behavioral gate can eliminate a candidate for this alone, regardless of case performance.",
  },
};

export default function PwcGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={PWC_RUBRIC}
      calculateOffer={calculatePwcOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new2-blob-painting.png"
      blobRight="/homepage/new-blob-drinking.png"
    />
  );
}
