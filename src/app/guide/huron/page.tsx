"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { HURON_RUBRIC, calculateHuronOffer } from "@/lib/firmRubrics/huron";

const RATE_THIS = {
  analyticalThinking: {
    response: "Interviewer directs candidate to analyze hospital readmission costs; candidate struggles to organize a response to the specific prompt.",
    score: 2,
    reasoning: "Huron is interviewer-led - the standard is responding clearly to directed prompts, and this response is disorganized.",
  },
  industryKnowledge: {
    response: "Candidate is asked about hospital payer mix and has no idea what that means.",
    score: 1,
    reasoning: "A core healthcare operations concept a Huron candidate should know. No sector fluency at all.",
  },
  quantitative: {
    response: "Candidate calculates cost-per-case correctly but can't say what a hospital CFO would do with that number.",
    score: 2,
    reasoning: "Right number, no connection to the healthcare business implication Huron is looking for.",
  },
  communication: {
    response: "Candidate's explanation is accurate but full of consulting jargon a hospital CEO wouldn't use day to day.",
    score: 2,
    reasoning: "Too abstract for the healthcare/education executive audience Huron actually serves.",
  },
  impactOrientation: {
    response: "\"The hospital should improve efficiency,\" with no specific action named.",
    score: 1,
    reasoning: "Entirely theoretical. Huron explicitly wants concrete, implementable actions, not a vague direction.",
  },
};

export default function HuronGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={HURON_RUBRIC}
      calculateOffer={calculateHuronOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new3-blob-napping.png"
      blobRight="/homepage/new3-blob-thumbsup.png"
    />
  );
}
