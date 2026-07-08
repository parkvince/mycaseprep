"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { ACCENTURE_RUBRIC, calculateAccentureOffer } from "@/lib/firmRubrics/accenture";

const RATE_THIS = {
  structuredThinking: {
    response: "Given almost no data (a \"Great Unknown\" case): \"I really don't know where to start without more information.\"",
    score: 1,
    reasoning: "Freezes on ambiguity instead of building a MECE framework from first principles, the exact failure mode the Great Unknown format is designed to surface.",
  },
  problemSolving: {
    response: "On a Potentia-style question with no data: \"My instinct is X, because of Y and Z, I'd want to check that against real data.\"",
    score: 4,
    reasoning: "Forms a genuine point of view quickly on an ambiguous topic, exactly what the no-math Potentia interview is testing for.",
  },
  businessJudgment: {
    response: "Candidate discusses a cloud migration decision purely in terms of \"modernizing the technology stack\" with no cost or ROI framing.",
    score: 2,
    reasoning: "Treats a digital transformation case like generic strategy, missing the technology-as-business-case framing Accenture explicitly wants.",
  },
  quantitative: {
    response: "On a Back of the Envelope estimation question: \"Let's say a 5% adoption rate in year one, given similar rollouts...\"",
    score: 4,
    reasoning: "Confident estimation with stated methodology, exactly the Back of the Envelope standard.",
  },
  communicationPresence: {
    response: "Candidate answers correctly but mumbles and hedges throughout, never projecting confidence.",
    score: 2,
    reasoning: "Lacks the executive presence Accenture explicitly screens for. A Fortune 500 CIO would not walk away trusting this recommendation.",
  },
  collaboration: {
    response: "In the group case, candidate says \"Great point!\" repeatedly but never adds a new idea or builds on what's been said.",
    score: 2,
    reasoning: "The most common Accenture group-case failure pattern: validating without substantively contributing.",
  },
};

export default function AccentureGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={ACCENTURE_RUBRIC}
      calculateOffer={calculateAccentureOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new3-blob-stargazing.png"
      blobRight="/homepage/new-blob-computer.png"
    />
  );
}
