export const MCKINSEY_RUBRIC = {
  firm: "mckinsey",
  firmFullName: "McKinsey & Company",
  format: "interviewer-led",

  scoringScale: {
    1: "Insufficient — Does not display basic command of the skill. Almost always disqualifying.",
    2: "Adequate — Below the hiring bar. Shows basics but not at required level.",
    3: "Good — Meets the bar. Solid with minor areas for improvement.",
    4: "Very Good — Above the bar. Strong, differentiated performance.",
    5: "Exceptional — Rare. Partner-level clarity, precision, and insight.",
  },

  dimensions: [
    {
      key: "structure",
      label: "Problem Structuring & MECE Quality",
      weight: 28,
      scoringCriteria: {
        1: "No coherent structure. Jumps straight into analysis without a framework.",
        2: "Generic framework applied with no case adaptation. Overlap exists. Missing major drivers.",
        3: "Reasonable structure covering main drivers. Some adaptation. Minor gaps.",
        4: "Clear, MECE, case-specific structure. Well-organized around a hypothesis.",
        5: "Perfectly MECE, hypothesis-driven, case-specific. Shows awareness of tradeoffs between framings.",
      },
      dealbreaker: true,
    },
    {
      key: "quantitative",
      label: "Quantitative Reasoning & Data Analysis",
      weight: 22,
      scoringCriteria: {
        1: "Cannot set up basic calculations. Multiple conceptual math errors.",
        2: "Sets up some calculations but with errors. Reads exhibits at surface level only.",
        3: "Correct setup and answer on most calculations. Some business interpretation.",
        4: "Fast, accurate, well-narrated math. Extracts non-obvious exhibit insights.",
        5: "Exceptional speed and precision. Catches subtle patterns others would miss.",
      },
      dealbreaker: true,
    },
    {
      key: "businessJudgment",
      label: "Business Judgment & Insight Quality",
      weight: 18,
      scoringCriteria: {
        1: "No business insight. Restates data without analysis.",
        2: "Surface-level insights only. Identifies the obvious driver.",
        3: "Solid judgment. Identifies the primary driver and its business implication.",
        4: "Strong insight. Goes beyond the obvious. Synthesizes across data points.",
        5: "Exceptional. Non-obvious connections. Deep commercial awareness.",
      },
      dealbreaker: false,
    },
    {
      key: "communication",
      label: "Communication & Structured Delivery",
      weight: 17,
      scoringCriteria: {
        1: "Incoherent delivery. No signposting. Interviewer cannot follow the logic.",
        2: "Buries conclusions. Lacks signposting. Answers too long or too vague.",
        3: "Clear enough to follow. Some signposting. Bottom-line eventually communicated.",
        4: "Consistently bottom-line first. Well-signposted. Concise.",
        5: "Partner-ready delivery. Precise, confident, structured.",
      },
      dealbreaker: false,
    },
    {
      key: "hypothesisManagement",
      label: "Hypothesis-Driven Thinking",
      weight: 10,
      scoringCriteria: {
        1: "No hypothesis. Explores data randomly. No analytical thread.",
        2: "Vague hypothesis. Does not use it to guide the analysis.",
        3: "Clear initial hypothesis. Partially guides the analysis.",
        4: "Strong hypothesis upfront. Guides every analytical choice. Updates when contradicted.",
        5: "Every question ties back to testing the hypothesis. Clean pivots when data contradicts.",
      },
      dealbreaker: false,
    },
    {
      key: "synthesis",
      label: "Synthesis & Recommendation Quality",
      weight: 5,
      scoringCriteria: {
        1: "No recommendation or completely contradicts the data.",
        2: "Vague recommendation. No specifics. Heavily hedged.",
        3: "Clear recommendation with basic rationale. Missing specifics or risks.",
        4: "Strong, specific, actionable recommendation with risks acknowledged.",
        5: "Quantified recommendation. Anticipates objections. Connects to broader strategy.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: {
    offerThreshold: 72,
    hardFloorDimensions: ["structure", "quantitative"],
    hardFloorScore: 3,
    excellenceDimensionsRequired: 2,
    excellenceScore: 4,
    disqualifierScore: 1,
  },
};

export function calculateMckinseyOffer(scores: Record<string, number>): {
  decision: string;
  label: string;
  description: string;
  weightedScore: number;
} {
  const dims = MCKINSEY_RUBRIC.dimensions;

  // Check disqualifiers
  for (const dim of dims) {
    if (dim.dealbreaker && scores[dim.key] <= 1) {
      return {
        decision: "disqualified",
        label: "No Offer",
        description: `Automatically disqualified. A score of 1 on ${dim.label} is disqualifying at McKinsey regardless of other scores. This is the single most important area to fix before your next case.`,
        weightedScore: 0,
      };
    }
  }

  // Calculate weighted score (dimension scores are 1-5, convert to 0-100)
  let weightedScore = 0;
  for (const dim of dims) {
    const score = scores[dim.key] ?? 1;
    const normalized = ((score - 1) / 4) * 100; // 1→0, 5→100
    weightedScore += (normalized * dim.weight) / 100;
  }

  // Check hard floors
  for (const dimKey of MCKINSEY_RUBRIC.offerDecision.hardFloorDimensions) {
    if (scores[dimKey] < MCKINSEY_RUBRIC.offerDecision.hardFloorScore) {
      return {
        decision: "no_offer",
        label: "No Offer",
        description: `Below the McKinsey bar. ${dimKey === "structure" ? "Structure" : "Quantitative reasoning"} must be at least a 3 for McKinsey to consider an offer. This is the most critical gap to close.`,
        weightedScore: Math.round(weightedScore),
      };
    }
  }

  // Check excellence requirement
  const excellentDims = dims.filter(
    (d) => scores[d.key] >= MCKINSEY_RUBRIC.offerDecision.excellenceScore
  ).length;

  const threshold = MCKINSEY_RUBRIC.offerDecision.offerThreshold;

  if (weightedScore >= 88 && excellentDims >= 3) {
    return {
      decision: "strong_offer",
      label: "Strong Offer",
      description: "Exceptional performance. McKinsey would extend a strong offer. You are performing at the level of candidates who go on to become Engagement Managers. Top 5% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= threshold && excellentDims >= MCKINSEY_RUBRIC.offerDecision.excellenceDimensionsRequired) {
    return {
      decision: "offer",
      label: "Offer",
      description: "Above the McKinsey hiring bar. An offer would likely be extended. Strong performance with no critical gaps. You are in the top 10-15% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= 58) {
    return {
      decision: "borderline",
      label: "Borderline — No Offer",
      description: "Close to the McKinsey bar but not over it. An offer would not be extended at this stage. You have the foundation — targeted work on your lowest-scoring dimensions will close the gap.",
      weightedScore: Math.round(weightedScore),
    };
  }

  return {
    decision: "no_offer",
    label: "No Offer",
    description: "Below the McKinsey hiring bar. Clear gaps in one or more critical dimensions. Most candidates are here in their first 15-20 cases — this is normal. Focus on structure and quantitative first.",
    weightedScore: Math.round(weightedScore),
  };
}