"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { ROLAND_BERGER_RUBRIC, calculateRolandBergerOffer } from "@/lib/firmRubrics/rolandBerger";

const RATE_THIS = {
  structure: {
    response: "Candidate applies a generic market entry framework to an automotive Tier 1 supplier case with no mention of OEM relationships or value chain dynamics.",
    score: 2,
    reasoning: "Generic framework with no industry adaptation. RB expects European industrial/automotive context embedded in the structure itself.",
  },
  execution: {
    response: "Candidate waits for the interviewer to specify exactly which calculation to run next.",
    score: 1,
    reasoning: "Completely passive. RB's execution dimension explicitly punishes waiting for direction as much as being wrong.",
  },
  synthesis: {
    response: "\"Costs are up, so we should cut costs.\" No root cause, no number attached.",
    score: 1,
    reasoning: "Skips RB's explicit root cause → recommendation → quantified impact format entirely, with no quantified impact at all.",
  },
  entrepreneurialMindset: {
    response: "Candidate solves the case correctly but only responds to exactly what's asked, never proposing next steps unprompted.",
    score: 2,
    reasoning: "Solid analytically but shows no initiative or opportunity-spotting. The entrepreneurial instinct RB explicitly screens for is absent.",
  },
  collaboration: {
    response: "In the group case, candidate proposes a strong structure in the first two minutes, then says almost nothing for the rest of the discussion.",
    score: 2,
    reasoning: "An impressive opening followed by disengagement is explicitly flagged as a red flag in RB's own scoring guidance.",
  },
};

export default function RolandBergerGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={ROLAND_BERGER_RUBRIC}
      calculateOffer={calculateRolandBergerOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new-blob-dancing.png"
      blobRight="/homepage/new3-blob-skateboarding.png"
    />
  );
}
