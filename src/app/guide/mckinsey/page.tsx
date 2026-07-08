"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { MCKINSEY_RUBRIC, calculateMckinseyOffer } from "@/lib/firmRubrics/mckinsey";

const RATE_THIS = {
  structure: {
    response: "\"I'd break this into three areas: revenue, costs, and market factors. Let's start with revenue and look at pricing and volume.\"",
    score: 2,
    reasoning: "Generic buckets with no adaptation to this specific case, and \"market factors\" overlaps with both revenue and costs. Not MECE.",
  },
  quantitative: {
    response: "\"If volume is 10,000 units at $50 average price, revenue is $500,000. Cost per unit is $30, so profit per unit is $20, total profit $200,000. That's a 40% margin, which is plausible for this industry.\"",
    score: 4,
    reasoning: "Clean setup, narrated clearly, and sanity-checked at the end. Not a 5 since it doesn't surface a non-obvious insight beyond the arithmetic.",
  },
  businessJudgment: {
    response: "\"Revenue is down because of the price cut. We should just raise prices back up.\"",
    score: 2,
    reasoning: "Surface-level. Doesn't ask why the price was cut in the first place, or what raising it back up would do to volume or competitors.",
  },
  communication: {
    response: "\"So there's a lot going on here, costs went up a bit, and revenue is kind of flat, and there might be some seasonality, but I think if you look at everything together the main issue is probably cost, but it's hard to say.\"",
    score: 2,
    reasoning: "The conclusion is buried at the end of a run-on sentence with no signposting. An interviewer has to work to find the point.",
  },
  hypothesisManagement: {
    response: "\"My hypothesis is that the profit decline is driven by rising input costs, not falling demand. Let's test that by looking at the cost data first.\"",
    score: 4,
    reasoning: "A clear, upfront hypothesis that directly guides the next analytical step. Not a 5 without seeing it survive, or get updated by, contradicting data.",
  },
  synthesis: {
    response: "\"So overall, I'd say maybe consider looking at costs, though revenue could also be a factor. Hard to say for sure without more data.\"",
    score: 1,
    reasoning: "No recommendation at all, just a shrug. Heavily hedged with nothing for the client to act on.",
  },
};

export default function McKinseyGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={MCKINSEY_RUBRIC}
      calculateOffer={calculateMckinseyOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new3-blob-puzzle.png"
      blobRight="/homepage/new3-blob-reading.png"
    />
  );
}
