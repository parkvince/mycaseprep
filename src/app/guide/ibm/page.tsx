"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { IBM_RUBRIC, calculateIbmOffer } from "@/lib/firmRubrics/ibm";

const RATE_THIS = {
  structure: {
    response: "Candidate builds a pure business strategy framework for a cloud migration case with no technology dimension at all.",
    score: 2,
    reasoning: "Misses the technology layer that's present in every IBM case, regardless of practice area.",
  },
  technologyBusinessJudgment: {
    response: "\"We should move everything to the cloud because it's more modern,\" with no cost-benefit framing.",
    score: 1,
    reasoning: "Pure technology enthusiasm with zero business case behind it, the opposite of IBM's \"business problem first\" standard.",
  },
  quantitative: {
    response: "Candidate estimates cloud migration savings but doesn't compare it against the upfront implementation cost.",
    score: 2,
    reasoning: "Only half the ROI equation. IBM wants the full cost-benefit, not just the upside.",
  },
  communication: {
    response: "Candidate's explanation of the technology recommendation would confuse a non-technical executive.",
    score: 2,
    reasoning: "Not executive-ready for a CIO or CFO audience, which IBM's client base requires.",
  },
  collaboration: {
    response: "Candidate answers every question solo without ever referencing how a cross-functional team would divide the work.",
    score: 2,
    reasoning: "No team-orientation shown. IBM's large, cross-functional delivery teams need this instinct front and center.",
  },
};

export default function IbmGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={IBM_RUBRIC}
      calculateOffer={calculateIbmOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new3-blob-meditating.png"
      blobRight="/homepage/new3-blob-swimming.png"
    />
  );
}
