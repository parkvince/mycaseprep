"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { BCG_RUBRIC, calculateBcgOffer } from "@/lib/firmRubrics/bcg";

const RATE_THIS = {
  candidateLed: {
    response: "\"Okay, so what should I look at first?\"",
    score: 1,
    reasoning: "Completely passive — waited for the interviewer's prompt instead of proposing where to start and why. BCG's candidate-led format punishes this immediately.",
  },
  structure: {
    response: "\"I'll use the classic profitability framework: revenue minus costs, broken into the usual sub-drivers.\"",
    score: 2,
    reasoning: "A textbook framework applied without adapting it to this specific client or industry, exactly what BCG interviewers notice immediately.",
  },
  quantitative: {
    response: "Looking at the chart: \"Market share grew from 10% to 15% over three years.\"",
    score: 2,
    reasoning: "Reads only the headline number. Doesn't ask what's driving the growth or whether it's outpacing the market overall, leaving the non-obvious insight on the table.",
  },
  creativity: {
    response: "\"To grow revenue we could raise prices, expand into new markets, or launch new products.\"",
    score: 1,
    reasoning: "A completely generic brainstorm that could apply to any company. Nothing here is original or non-obvious.",
  },
  communication: {
    response: "Candidate delivers a long monologue without pausing, then asks \"Does that make sense?\" at the very end.",
    score: 2,
    reasoning: "One-directional delivery with no invitation for dialogue until the very end. BCG wants a thought partner, not a lecture.",
  },
};

export default function BcgGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={BCG_RUBRIC}
      calculateOffer={calculateBcgOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new3-blob-juggling.png"
      blobRight="/homepage/new2-blob-tricycle.png"
    />
  );
}
