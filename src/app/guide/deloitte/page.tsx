"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { DELOITTE_RUBRIC, calculateDeloitteOffer } from "@/lib/firmRubrics/deloitte";

const RATE_THIS = {
  structure: {
    response: "\"Let's split this into the core business drivers and the technology enablement side.\"",
    score: 4,
    reasoning: "Organized, adapted to the case's digital transformation angle, and clearly prioritized, exactly Deloitte's practical-over-perfect standard.",
  },
  analytical: {
    response: "\"I can't really proceed without that information,\" when told two data points are missing.",
    score: 1,
    reasoning: "Paralyzed by missing data instead of making a sensible assumption and moving forward.",
  },
  businessAcumen: {
    response: "\"Strategically this makes sense, but I'm concerned the organization doesn't have the operational capability to execute it yet.\"",
    score: 4,
    reasoning: "Grounds the strategic idea in real-world execution risk, exactly the practical judgment Deloitte rewards over pure strategic elegance.",
  },
  communication: {
    response: "Candidate explains reasoning clearly but takes a long time getting to the actual finding.",
    score: 2,
    reasoning: "Too verbose. Buries the conclusion instead of leading with it.",
  },
  coachability: {
    response: "Interviewer points out an error; candidate says \"You're right, I overcounted there, let me recalculate,\" and moves on smoothly.",
    score: 4,
    reasoning: "Textbook coachable response - acknowledges the mistake openly and adapts without becoming defensive or collapsing.",
  },
};

export default function DeloitteGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={DELOITTE_RUBRIC}
      calculateOffer={calculateDeloitteOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new2-blob-gardening.png"
      blobRight="/homepage/new2-blob-sandcastle.png"
    />
  );
}
