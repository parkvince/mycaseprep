"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { KPMG_RUBRIC, calculateKpmgOffer } from "@/lib/firmRubrics/kpmg";

const RATE_THIS = {
  structure: {
    response: "\"Here's how I'd solve this strategically,\" followed by a structure that never mentions how the client would actually implement it.",
    score: 2,
    reasoning: "A pure strategy framework missing the operational/execution half that KPMG explicitly expects.",
  },
  analytical: {
    response: "\"The real driver here is the 18% jump in distribution center costs, not the revenue side at all.\"",
    score: 4,
    reasoning: "Extracts the key insight quickly from dense data and ties it directly to the business question.",
  },
  operationalJudgment: {
    response: "\"We should merge the two divisions,\" with no mention of people, systems, or sequencing.",
    score: 1,
    reasoning: "Purely theoretical with zero execution pathway, a fundamental gap at KPMG, which lives on implementation work.",
  },
  communication: {
    response: "In a group discussion, candidate talks over two other candidates without acknowledging their points.",
    score: 1,
    reasoning: "Dominates rather than collaborates. KPMG explicitly scores group dynamics, and this is a red flag.",
  },
  valuesAlignment: {
    response: "Candidate notices the recommendation could disadvantage a vulnerable customer group and raises it even though it complicates the analysis.",
    score: 4,
    reasoning: "A concrete demonstration of Integrity, one of KPMG's five named values, shown in action rather than just claimed.",
  },
};

export default function KpmgGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={KPMG_RUBRIC}
      calculateOffer={calculateKpmgOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new3-blob-origami.png"
      blobRight="/homepage/new-blob-music.png"
    />
  );
}
