"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { EY_PARTHENON_RUBRIC, calculateEyParthenonOffer } from "@/lib/firmRubrics/eyParthenon";

const RATE_THIS = {
  problemSolving: {
    response: "\"What would you like me to look at first?\"",
    score: 1,
    reasoning: "Waits for direction instead of driving the case independently. EY-Parthenon is candidate-led, like BCG or Bain.",
  },
  quantitative: {
    response: "\"EBITDA margin is 22%, and if we're paying a 12x multiple that seems high for a business growing at only 3% a year.\"",
    score: 4,
    reasoning: "Correctly reads P&L-level metrics and sanity-checks the multiple against growth. Strong financial fluency.",
  },
  strategicJudgment: {
    response: "\"It depends on a lot of factors, it's really hard to say if this is a good investment without a lot more information.\"",
    score: 1,
    reasoning: "The classic EY-Parthenon failure pattern — refuses to take an investment position at all.",
  },
  communication: {
    response: "Candidate delivers findings clearly but takes several minutes to build up to the actual recommendation.",
    score: 2,
    reasoning: "Buries the recommendation in a long build-up, not the executive-ready, conclusion-first delivery a PE partner or CFO would expect.",
  },
  recommendation: {
    response: "\"I'd need a lot more diligence before I could say whether to invest or not.\"",
    score: 1,
    reasoning: "Refuses to commit to a position — the single most common EY-Parthenon failure pattern.",
  },
};

export default function EyParthenonGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={EY_PARTHENON_RUBRIC}
      calculateOffer={calculateEyParthenonOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new2-blob-watermelon.png"
      blobRight="/homepage/new2-blob-camera.png"
    />
  );
}
