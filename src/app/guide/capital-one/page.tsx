"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { CAPITAL_ONE_RUBRIC, calculateCapitalOneOffer } from "@/lib/firmRubrics/capitalOne";

const RATE_THIS = {
  logicalStructure: {
    response: "Given a specific data table and asked for the breakeven volume, candidate gets lost partway through the multi-step calculation.",
    score: 2,
    reasoning: "Capital One is interviewer-led with directed prompts. Losing the thread on a multi-step directed problem is exactly what this dimension scores.",
  },
  quantitative: {
    response: "Candidate sets up a credit card profitability calculation but forgets to account for charge-off rates entirely.",
    score: 2,
    reasoning: "Wrong equation setup. Capital One's quant dimension cares most about correctly translating the scenario into the right equation, not just doing arithmetic.",
  },
  businessJudgment: {
    response: "Candidate treats a credit card economics case like a generic retail profitability case, never mentioning interchange fees or interest income.",
    score: 1,
    reasoning: "No financial services context at all. Capital One's business judgment dimension explicitly requires consumer credit economics fluency.",
  },
  communication: {
    response: "Candidate gets the right answer but never explains the steps taken to get there.",
    score: 2,
    reasoning: "Capital One explicitly wants candidates who think aloud and make their reasoning transparent, not just state a final number.",
  },
  valuesAlignment: {
    response: "In a behavioral question about teamwork, candidate gives a generic answer with no specific example.",
    score: 2,
    reasoning: "Capital One's ARES framework is evaluated with specific follow-up probing. A generic answer with no evidence falls short.",
  },
};

export default function CapitalOneGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={CAPITAL_ONE_RUBRIC}
      calculateOffer={calculateCapitalOneOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new2-blob-icecream.png"
      blobRight="/homepage/new3-blob-drumming.png"
    />
  );
}
