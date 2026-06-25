export const BCG_RUBRIC = {
  firm: "bcg",
  firmFullName: "Boston Consulting Group",
  format: "candidate-led",
  interviewDuration: "40-45 minutes",
  offerRate: "Approximately 1% of all applicants. Roughly 10-15% of interview-stage candidates.",

  scoringScale: {
    1: "Insufficient — Does not display basic command of the skill.",
    2: "Adequate — Below the BCG hiring bar. Shows basics but not at the required level.",
    3: "Good — Meets the bar. Solid performance with minor gaps.",
    4: "Very Good — Above the bar. Strong, differentiated performance.",
    5: "Exceptional — Rare. The kind of thinking that gets you a fast-track offer.",
  },

  dimensions: [
    {
      key: "candidateLed",
      label: "Case Leadership & Independent Drive",
      weight: 23,
      bcgNote: "This is the most distinctly BCG dimension. Unlike McKinsey where the interviewer leads, BCG expects YOU to drive the entire case. Did you frame the problem, decide where to go next, ask for the right data proactively, and maintain the analytical thread without being guided? BCG interviewers will go silent and wait — candidates who freeze or wait for direction fail this dimension immediately.",
      whatStrongLooksLike: [
        "Takes ownership from minute one: frames the problem before the interviewer finishes speaking",
        "Decides which branches to explore and states why: 'I want to start with demand-side because...'",
        "Asks for specific data with explicit analytical rationale",
        "Proactively summarizes and suggests next steps after each section",
        "Adapts fluidly when the interviewer introduces new data or redirects",
        "Never waits for the interviewer to tell them what to do next",
      ],
      whatWeakLooksLike: [
        "Waits for the interviewer to prompt the next step",
        "Asks for data without explaining why they need it",
        "Loses the thread when the interviewer pushes back",
        "Runs through a framework mechanically without showing analytical judgment about priorities",
      ],
      scoringCriteria: {
        1: "Completely passive. Waits for every prompt. Cannot drive the case at all.",
        2: "Partially drives the case but relies on interviewer direction for major transitions. No clear ownership.",
        3: "Drives most of the case. Occasional pauses waiting for direction. Generally independent.",
        4: "Fully drives the case. Clear ownership throughout. Proactively summarizes and sets next steps.",
        5: "Exceptional independence. Never needs a prompt. The conversation flows like a real client engagement.",
      },
      dealbreaker: true,
    },
    {
      key: "structure",
      label: "Problem Structuring",
      weight: 20,
      bcgNote: "BCG evaluates structure differently from McKinsey. At BCG, structure must be ORIGINAL and bespoke to the case. Using a memorized framework from a prep book is a significant negative signal at BCG. The interviewer will notice immediately if your profitability structure for a healthcare case looks identical to your market entry structure from 10 minutes ago.",
      whatStrongLooksLike: [
        "Custom structure built from first principles, not from a prep guide",
        "Evolves the structure as new information arrives — not rigid",
        "Makes explicit tradeoffs: 'I'm prioritizing this branch because it's more likely to be the driver'",
        "MECE but not formulaically so",
        "Shows creative angles the interviewer hasn't heard from the previous 20 candidates",
      ],
      whatWeakLooksLike: [
        "Copy-paste framework from a prep book (issue trees, 4Cs, etc.) without case adaptation",
        "Rigid adherence to initial structure even when data suggests a different direction",
        "Structure that mirrors the problem statement rather than decomposing it",
        "Generic buckets (revenues/costs) without the next level of specificity",
      ],
      scoringCriteria: {
        1: "No structure. Jumps directly into analysis or recites a textbook framework verbatim.",
        2: "Memorized framework applied without adaptation. BCG interviewers will recognize this immediately.",
        3: "Reasonable structure with some case adaptation. Minor rigidity.",
        4: "Original, case-specific structure. Evolves appropriately. MECE without being mechanical.",
        5: "Exceptional creative structure. Angles the interviewer hasn't considered. Perfect adaptation to this specific case.",
      },
      dealbreaker: false,
    },
    {
      key: "quantitative",
      label: "Analytical & Quantitative Skills",
      weight: 22,
      bcgNote: "BCG cases are exhibit-heavy. The quantitative dimension at BCG is as much about data interpretation as arithmetic. BCG explicitly names this as 'numerical skills' on their careers page — and the emphasis is on extracting the NON-OBVIOUS insight from a chart, not just reading the obvious number. Mental math accuracy matters but is secondary to analytical interpretation.",
      whatStrongLooksLike: [
        "Reads an exhibit and immediately identifies the non-obvious insight, not just the headline number",
        "States approach before calculating",
        "Fast, accurate mental math with narration",
        "Triangulates data across exhibits to build a composite picture",
        "Sanity-checks results: 'That would imply 40% market share — is that realistic?'",
        "Identifies what data is missing and why it matters",
      ],
      whatWeakLooksLike: [
        "Only reads the obvious data point in an exhibit",
        "Math errors that cascade into wrong conclusions",
        "Cannot identify what a number means for the business",
        "Reads exhibits slowly or superficially",
        "Cannot triangulate across multiple data sources",
      ],
      scoringCriteria: {
        1: "Cannot set up calculations or read exhibits accurately. Multiple conceptual errors.",
        2: "Reads exhibits at surface level. Some math errors. Missing business interpretation.",
        3: "Solid quantitative work. Reads exhibits adequately. Correct math with some interpretation.",
        4: "Strong exhibit analysis. Extracts non-obvious insights. Fast, accurate, well-narrated math.",
        5: "Exceptional. Spots patterns across exhibits others would miss. Every number connects to a business implication.",
      },
      dealbreaker: true,
    },
    {
      key: "creativity",
      label: "Creativity & Original Thinking",
      weight: 18,
      bcgNote: "This is BCG's most distinctive scoring dimension — it does not exist in the same form at McKinsey. BCG explicitly values 'generating original, non-obvious insights and solutions instead of relying on textbook frameworks.' BCG interviewers are actively looking for candidates who say something they haven't heard before. If your answer sounds like it came from a prep guide, you will not score above a 3 here regardless of technical accuracy.",
      whatStrongLooksLike: [
        "Proposes a solution or angle the interviewer genuinely hasn't heard in recent sessions",
        "Makes cross-industry connections: 'This is similar to how airlines used dynamic pricing...'",
        "Challenges an assumption in the case prompt when it seems wrong",
        "Offers a genuinely differentiated recommendation rather than the textbook answer",
        "Finds the second-order implication that most candidates miss",
        "Generates multiple unconventional hypotheses before settling on the most likely one",
      ],
      whatWeakLooksLike: [
        "Every answer sounds like it came from a case prep book",
        "Cannot think beyond the framework laid out at the start",
        "Technically correct but boring — solves the math without adding strategic value",
        "Brainstorming list is generic (e.g. 'reduce costs, increase revenue, enter new markets')",
      ],
      scoringCriteria: {
        1: "No original thinking. Entirely framework-recitation. Every insight is generic.",
        2: "Mostly textbook. One or two slightly adapted ideas but nothing genuinely original.",
        3: "Some original angles. Steps beyond the obvious occasionally. Competent but not memorable.",
        4: "Genuinely original thinking. At least one insight the interviewer found surprising. Cross-domain connections.",
        5: "Exceptional creativity. The interviewer will remember this candidate. Unconventional angles that are also analytically grounded.",
      },
      dealbreaker: false,
    },
    {
      key: "communication",
      label: "Communication Style",
      weight: 17,
      bcgNote: "BCG explicitly names communication style as one of three scored criteria on their careers page. At BCG the communication standard is slightly more conversational than McKinsey — they want a thought partner, not a presenter. The ideal BCG communication style is collaborative: you think out loud, invite the interviewer into the analysis, and show intellectual curiosity through your questions.",
      whatStrongLooksLike: [
        "Thinks out loud in a structured way: narrates the analytical process",
        "Invites dialogue: 'Does that logic seem right to you?'",
        "Bottom-line first but with genuine intellectual engagement",
        "Responds to pushback with curiosity, not defensiveness: 'That's a fair challenge — let me reconsider...'",
        "Shows enthusiasm for the problem without being performative",
        "Concise but not robotic",
      ],
      whatWeakLooksLike: [
        "Robotic delivery: recites analysis without engagement",
        "Defensive when pushed back on",
        "Goes silent without narrating thought process",
        "Either too brief (no narration of reasoning) or too verbose (buries the insight)",
        "Performs rather than collaborates",
      ],
      scoringCriteria: {
        1: "Cannot communicate analysis clearly. Interviewer cannot follow the logic.",
        2: "Clear enough but one-directional. No collaboration. Buries conclusions.",
        3: "Communicates clearly. Some collaboration. Generally followable.",
        4: "Excellent thought partner. Bottom-line first. Collaborative, curious, responsive to pushback.",
        5: "Exceptional. The conversation feels like working with a colleague. Intellectual enthusiasm is genuine and contagious.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: {
    offerThreshold: 70,
    hardFloorDimensions: ["candidateLed", "quantitative"],
    hardFloorScore: 3,
    creativityMinimum: 3,
    excellenceDimensionsRequired: 2,
    excellenceScore: 4,
    disqualifierScore: 1,
  },
};

export function calculateBcgOffer(scores: Record<string, number>): {
  decision: string;
  label: string;
  description: string;
  weightedScore: number;
} {
  const dims = BCG_RUBRIC.dimensions;

  // Check disqualifiers
  for (const dim of dims) {
    if (dim.dealbreaker && scores[dim.key] <= 1) {
      return {
        decision: "disqualified",
        label: "No Offer",
        description: `Automatically disqualified. A score of 1 on ${dim.label} is disqualifying at BCG. ${dim.key === "candidateLed" ? "BCG's candidate-led format requires you to drive the case independently. This is the single most important thing to practice before your next BCG interview." : "Analytical and quantitative skills are a core BCG requirement — this is the priority to fix."}`,
        weightedScore: 0,
      };
    }
  }

  // Creativity minimum check — BCG-specific
  if (scores["creativity"] <= 1) {
    return {
      decision: "no_offer",
      label: "No Offer",
      description: "BCG will not extend an offer when creativity scores at 1. Relying entirely on textbook frameworks is a fundamental mismatch with BCG's culture. BCG wants original thinkers — practice generating non-obvious insights and cross-domain connections.",
      weightedScore: 0,
    };
  }

  // Calculate weighted score
  let weightedScore = 0;
  for (const dim of dims) {
    const score = scores[dim.key] ?? 1;
    const normalized = ((score - 1) / 4) * 100;
    weightedScore += (normalized * dim.weight) / 100;
  }

  // Hard floors
  for (const dimKey of BCG_RUBRIC.offerDecision.hardFloorDimensions) {
    if (scores[dimKey] < BCG_RUBRIC.offerDecision.hardFloorScore) {
      return {
        decision: "no_offer",
        label: "No Offer",
        description: `Below the BCG bar. ${dimKey === "candidateLed" ? "You must be able to drive the case independently — BCG interviewers will not guide you. This is the most critical gap to close before your next BCG interview." : "Quantitative and exhibit analysis must reach at least a 3. BCG cases are data-heavy and this is non-negotiable."}`,
        weightedScore: Math.round(weightedScore),
      };
    }
  }

  const excellentDims = dims.filter(d => scores[d.key] >= BCG_RUBRIC.offerDecision.excellenceScore).length;
  const threshold = BCG_RUBRIC.offerDecision.offerThreshold;

  if (weightedScore >= 88 && excellentDims >= 3) {
    return {
      decision: "strong_offer",
      label: "Strong Offer",
      description: "Exceptional performance across all dimensions including the critical creativity dimension. BCG would extend a strong offer. You are performing in the top 5% of interview-stage candidates — the kind of original thinking BCG actively recruits for.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= threshold && excellentDims >= BCG_RUBRIC.offerDecision.excellenceDimensionsRequired) {
    return {
      decision: "offer",
      label: "Offer",
      description: "Above the BCG hiring bar. An offer would likely be extended. You demonstrated the independent case leadership and original thinking that BCG values. Top 10-15% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= 58) {
    return {
      decision: "borderline",
      label: "Borderline — No Offer",
      description: "Close to the BCG bar but not over it. The foundation is there. The most common gap at this level is creativity — candidates who are technically strong but analytically predictable. Push your thinking beyond the first obvious answer.",
      weightedScore: Math.round(weightedScore),
    };
  }

  return {
    decision: "no_offer",
    label: "No Offer",
    description: "Below the BCG hiring bar. The most important thing to work on: practice driving cases completely independently without any prompting. Then focus on generating original insights beyond textbook frameworks. Most candidates take 15-25 cases before consistently clearing the BCG bar.",
    weightedScore: Math.round(weightedScore),
  };
}