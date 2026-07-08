"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { LEK_RUBRIC, calculateLekOffer } from "@/lib/firmRubrics/lek";

const RATE_THIS = {
  structure: {
    response: "On a market sizing case, candidate jumps straight to a number without laying out the logical build-up first.",
    score: 2,
    reasoning: "No hypothesis-driven structure. L.E.K.'s market sizing standard requires a clear, logical build before the estimate.",
  },
  quantitative: {
    response: "Candidate miscalculates a TAM estimate by mixing up annual and monthly figures, and the error isn't caught.",
    score: 1,
    reasoning: "A calculation error that undermines the whole estimate. L.E.K.'s heavily-weighted quant gate has zero tolerance for this.",
  },
  evidenceReasoning: {
    response: "\"I think the market will grow because it feels like a growing space,\" with no data cited.",
    score: 1,
    reasoning: "Pure opinion with no evidence, the direct opposite of L.E.K.'s \"evidence over opinion\" culture.",
  },
  writtenCase: {
    response: "Candidate's slide summarizes each exhibit separately without a clear one-line recommendation up top.",
    score: 2,
    reasoning: "Reads like a data dump rather than an L.E.K.-style client deliverable, which should lead with the recommendation.",
  },
  communication: {
    response: "Candidate presents findings hesitantly, unsure of their own conclusion.",
    score: 2,
    reasoning: "Lacks the intellectual confidence L.E.K.'s open, evidence-driven culture expects once the analysis is done.",
  },
};

export default function LekGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={LEK_RUBRIC}
      calculateOffer={calculateLekOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new3-blob-spaghetti.png"
      blobRight="/homepage/new3-blob-pinwheel.png"
    />
  );
}
