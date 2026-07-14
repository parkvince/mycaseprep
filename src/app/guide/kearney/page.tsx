"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { KEARNEY_RUBRIC, calculateKearneyOffer } from "@/lib/firmRubrics/kearney";

const RATE_THIS = {
  structure: {
    response: "Handed a supply chain case, candidate immediately proposes a framework covering procurement, logistics, inventory, and supplier relationships, adapting as the interviewer redirects.",
    score: 4,
    reasoning: "Strong hybrid performance - shows operational logic and adapts fluidly between guided and independent segments.",
  },
  operationalExcellence: {
    response: "\"We should just consolidate suppliers to save costs,\" with no sequencing or feasibility discussion.",
    score: 2,
    reasoning: "Misses execution specifics entirely. Kearney explicitly wants a \"how do we actually do this\" pathway, not just the strategic direction.",
  },
  quantitative: {
    response: "Candidate calculates the savings from a process improvement but can't connect it to what that means for the plant's overall cost structure.",
    score: 2,
    reasoning: "The number is there but not translated into the operational business implication Kearney is looking for.",
  },
  collaboration: {
    response: "Candidate treats the case as a solo presentation, never checking in with the interviewer as a thought partner.",
    score: 2,
    reasoning: "Kearney's collaborative-leadership dimension explicitly wants the interviewer engaged as a team member, not an audience.",
  },
  communication: {
    response: "Candidate explains a supply chain recommendation using heavy consulting jargon a plant manager wouldn't recognize.",
    score: 2,
    reasoning: "Kearney wants practical clarity - plain language a COO or plant manager could act on, not consulting-speak.",
  },
};

export default function KearneyGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={KEARNEY_RUBRIC}
      calculateOffer={calculateKearneyOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new3-blob-planting.png"
      blobRight="/homepage/new3-blob-watering.png"
    />
  );
}
