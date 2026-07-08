"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { OLIVER_WYMAN_RUBRIC, calculateOliverWymanOffer } from "@/lib/firmRubrics/oliverWyman";

const RATE_THIS = {
  structure: {
    response: "Candidate applies a generic profitability framework to an insurance pricing case with no mention of underwriting or claims.",
    score: 2,
    reasoning: "No financial-services-specific adaptation. OW expects the structure to reflect real sector logic: pricing, distribution, claims, underwriting.",
  },
  financialServicesKnowledge: {
    response: "Interviewer mentions \"combined ratio\" and candidate asks what that means.",
    score: 1,
    reasoning: "A core insurance metric a credible OW candidate should already know. Signals no sector fluency at all.",
  },
  quantitative: {
    response: "Candidate correctly calculates ROE but doesn't explain the method along the way, just gives the final number.",
    score: 3,
    reasoning: "Solid math, correct answer, but skips narrating the approach, which OW interviewers explicitly weigh alongside precision.",
  },
  communication: {
    response: "In the conversational interview portion, candidate gives short, generic answers with no follow-up questions.",
    score: 2,
    reasoning: "Misses OW's explicit Curiosity value. A strong candidate would engage more intellectually and ask thoughtful follow-ups.",
  },
  writtenCase: {
    response: "Candidate summarizes every exhibit in the packet one by one rather than building toward a single recommendation.",
    score: 2,
    reasoning: "Summary instead of synthesis. The written case tests whether you can build one coherent narrative, not report on each slide separately.",
  },
};

export default function OliverWymanGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={OLIVER_WYMAN_RUBRIC}
      calculateOffer={calculateOliverWymanOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new3-blob-baking.png"
      blobRight="/homepage/new-blob-bubbles.png"
    />
  );
}
