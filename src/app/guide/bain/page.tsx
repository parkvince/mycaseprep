"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { BAIN_RUBRIC, calculateBainOffer } from "@/lib/firmRubrics/bain";

const RATE_THIS = {
  answerFirst: {
    response: "\"Let me walk through the data first, and I'll share my view at the end.\"",
    score: 1,
    reasoning: "The exact opposite of Answer First. Bain wants the hypothesis stated up front, not saved for the end.",
  },
  structure: {
    response: "\"I'll focus here first since it's most likely the driver, even though I know I'm skipping a few smaller branches.\"",
    score: 4,
    reasoning: "Not perfectly MECE, but confidently prioritized and CEO-friendly — exactly what Bain rewards over mechanical completeness.",
  },
  quantitative: {
    response: "\"This deal is priced at 6x EBITDA, which given typical multiples in this sector feels low, that's worth flagging.\"",
    score: 4,
    reasoning: "Fast, correctly framed as a PE-style multiple, and immediately interpreted in business terms.",
  },
  communication: {
    response: "Interviewer pushes back on an assumption; candidate immediately says \"You're right, scratch that,\" and drops the whole line of reasoning.",
    score: 1,
    reasoning: "Collapses under pushback rather than engaging with the challenge, the opposite of the composed, evidence-based response Bain wants.",
  },
  culturalFit: {
    response: "Candidate dismisses a hint from the interviewer with \"No, I think my way is right,\" and moves on without engaging further.",
    score: 1,
    reasoning: "Arrogant and dismissive — a direct mismatch with Bain's \"smart, nice, get things done\" culture.",
  },
  synthesis: {
    response: "\"They should probably think about improving profitability somehow going forward.\"",
    score: 1,
    reasoning: "Vague and theoretical. Bain's \"results, not reports\" culture wants something the client could act on by next week.",
  },
};

export default function BainGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={BAIN_RUBRIC}
      calculateOffer={calculateBainOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new2-blob-teddy.png"
      blobRight="/homepage/new-blob-gaming.png"
    />
  );
}
