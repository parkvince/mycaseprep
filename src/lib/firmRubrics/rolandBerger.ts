export const ROLAND_BERGER_RUBRIC = {
  firm: "roland-berger",
  firmFullName: "Roland Berger",
  format: "candidate-led with group case component",
  interviewDuration: "35-40 minutes per case interview",
  offerRate: "Approximately 3-5% of applicants. Tier 2 firm with MBB-adjacent rigor, particularly in European industrial sectors.",

  scoringScale: {
    1: "Insufficient - Would not represent Roland Berger with a European industrial client.",
    2: "Adequate - Below the Roland Berger bar. Shows potential but not ready.",
    3: "Good - Meets the bar. Solid consultant material.",
    4: "Very Good - Above the bar. Strong analytical and entrepreneurial profile.",
    5: "Exceptional - MBB-level performance with Roland Berger's entrepreneurial edge.",
  },

  dimensions: [
    {
      key: "structure",
      label: "Structure & Case Design",
      weight: 25,
      rbNote: "Explicitly named as Roland Berger's first scoring dimension. Roland Berger uses a candidate-led format identical to BCG and Bain - you must drive the structure independently. What makes Roland Berger's structure standard unique: cases frequently involve European industrial, automotive, and manufacturing contexts. A generic profitability structure for an automotive Tier 1 supplier case is insufficient - you must show familiarity with value chain dynamics, OEM relationships, and industrial cost structures. 'Building good structures instead of forcing frameworks' is RB's explicit standard.",
      whatStrongLooksLike: [
        "Drives the structure independently from the first minute",
        "For automotive/industrial cases: structures around value chain, cost structure, and OEM/supplier dynamics",
        "For energy/sustainability cases: addresses both economics and regulatory/ESG dimensions",
        "Prioritizes branches based on case context - not all equally",
        "Adapts cleanly when evidence redirects the analysis",
        "Avoids forcing textbook frameworks onto industry-specific problems",
      ],
      whatWeakLooksLike: [
        "Waits for interviewer direction",
        "Applies a generic profitability or market entry framework without industry adaptation",
        "No prioritization among branches",
        "Structure that fits every case identically",
      ],
      scoringCriteria: {
        1: "No structure. Cannot frame a European industrial or automotive problem. Waits for direction.",
        2: "Generic framework applied without industry context. No prioritization. Partially passive.",
        3: "Clear candidate-led structure. Some industry adaptation. Reasonable prioritization.",
        4: "Strong bespoke structure. Industry-specific logic embedded. Fully independent. Adapts well.",
        5: "Exceptional. The structure immediately reflects Roland Berger's European industrial expertise. Perfectly adapted and independent.",
      },
      dealbreaker: false,
    },
    {
      key: "execution",
      label: "Analytical Execution & Quantitative Drive",
      weight: 22,
      rbNote: "Explicitly named as Roland Berger's second scoring dimension. 'Execution' at Roland Berger means actually driving the analysis - not just designing a good framework and waiting. RB cases involve complex multi-step calculations, particularly in automotive and industrial contexts: margin recovery analysis, volume/price decomposition, cost optimization math, EV transition economics. Mental math is described as 'non-negotiable.' Being passive is as costly as being structurally wrong.",
      whatStrongLooksLike: [
        "Drives the analysis independently - proactively requests data rather than waiting",
        "Fast, accurate mental math with narration: margin analysis, breakeven, volume/price decomposition",
        "For automotive cases: comfortable with OEM pricing dynamics, Tier 1 supplier margins, EV cost curves",
        "For industrial cases: understands capacity utilization, fixed/variable cost ratios, restructuring math",
        "Sanity-checks results against industry norms",
        "Every calculation tied to the case objective",
      ],
      whatWeakLooksLike: [
        "Passive: waits to be told what to calculate",
        "Math errors that undermine the recommendation",
        "Cannot handle multi-step industrial calculations",
        "Right numbers but no connection to business implications",
      ],
      scoringCriteria: {
        1: "Cannot drive analysis or perform industrial calculations. Completely passive.",
        2: "Partially drives analysis. Some errors. Waits for direction at key steps.",
        3: "Drives most of the analysis. Accurate on standard calculations. Some industry math fluency.",
        4: "Fully drives the analysis. Fast, accurate, well-narrated. Handles industrial/automotive math fluently.",
        5: "Exceptional. The pace and precision of a Roland Berger senior consultant. Never passive, never uncertain.",
      },
      dealbreaker: true,
    },
    {
      key: "synthesis",
      label: "Synthesis Quality & Recommendation",
      weight: 20,
      rbNote: "Explicitly named as Roland Berger's third scoring dimension. RB's specific synthesis format, confirmed by their official prep materials: root cause → recommendation → quantified impact. This three-part structure is what Roland Berger interviewers are trained to look for. Unlike McKinsey where synthesis must be bottom-line first, RB expects you to connect the diagnostic (root cause) to the recommendation and then quantify the expected impact. A recommendation without a quantified impact estimate is incomplete.",
      whatStrongLooksLike: [
        "Follows Roland Berger's synthesis format: root cause → recommendation → quantified impact",
        "Root cause is specific and tied to the case data: 'The 3.4pp margin decline is driven by raw material cost inflation of ~€45M, not volume loss'",
        "Recommendation is actionable and sequenced: 'First... Second... Third...'",
        "Quantified impact: 'This should recover 2-3 percentage points of margin within 18 months'",
        "Acknowledges key implementation risks",
        "Connects back to the case objective stated at the beginning",
      ],
      whatWeakLooksLike: [
        "No quantified impact estimate - 'we should reduce costs' without a number",
        "Recommendation disconnected from the root cause identified",
        "Vague or hedged recommendation",
        "Rushed synthesis that misses the quantification step",
      ],
      scoringCriteria: {
        1: "No synthesis or recommendation. Cannot connect analysis to an action.",
        2: "Vague recommendation. No root cause → recommendation link. No quantified impact.",
        3: "Clear recommendation with basic rationale. Some quantification. Root cause identified.",
        4: "Strong RB-format synthesis: root cause → recommendation → quantified impact. Actionable.",
        5: "Exceptional. Textbook Roland Berger synthesis. Specific, quantified, sequenced, and risk-aware.",
      },
      dealbreaker: false,
    },
    {
      key: "entrepreneurialMindset",
      label: "Entrepreneurial Mindset & Pragmatic Implementation",
      weight: 18,
      rbNote: "Roland Berger's most distinctive scoring dimension - the 'entrepreneurial presence' that separates RB candidates from those at other firms. RB was founded by an entrepreneur and remains independently owned. They explicitly state they value 'entrepreneurial spirit' and have a Gap Year Program that rotates consultants through startups. The entrepreneurial dimension at RB means: do you spot opportunities where others see only problems? Are your solutions actionable in the real world? Are you a self-starter who doesn't wait to be told what to do? This is different from BCG's creativity - at RB it is about initiative-taking AND practical implementation.",
      whatStrongLooksLike: [
        "Spots the opportunity inside the problem: 'The margin decline is painful but the EV transition creates a new revenue line if they move fast'",
        "Recommendations are pragmatic and implementable - not just theoretically optimal",
        "Shows initiative within the case: proactively suggests next steps without being asked",
        "Bridges analysis and action: 'Here's what the client should do by Q3'",
        "International perspective: shows awareness of cross-border dynamics in European industrial cases",
        "Self-starter energy: treats the case as a real problem to solve, not a test to pass",
      ],
      whatWeakLooksLike: [
        "Purely analytical without entrepreneurial insight",
        "Recommendations that are theoretically correct but practically unimplementable",
        "No initiative: only responds to what the interviewer asks",
        "No awareness of the opportunity dimension within the problem",
        "Generic consulting answers with no practical action bias",
      ],
      scoringCriteria: {
        1: "No entrepreneurial presence. Purely reactive. Solutions are theoretical with no implementation instinct.",
        2: "Adequate analytical performance but no entrepreneurial dimension. Waits for direction on next steps.",
        3: "Some entrepreneurial energy. Solutions are pragmatic. Takes some initiative.",
        4: "Strong entrepreneurial presence. Spots opportunities. Pragmatic and implementation-ready. Self-starter evident.",
        5: "Exceptional. The entrepreneurial instinct is natural and constant. Would thrive in RB's culture of initiative and independence.",
      },
      dealbreaker: false,
    },
    {
      key: "collaboration",
      label: "Collaboration & Group Case Performance",
      weight: 15,
      rbNote: "Roland Berger's final round includes a group case where 3-6 candidates collaborate on a shared business problem and present to a panel. This is an explicitly scored component - not just an add-on. RB evaluates: do you lead when needed and follow when appropriate? Do you build on others' ideas or just add new points? Do you synthesize across the group when discussion gets tangled? The scoring standard: 'Showing analytical leadership in minute 5 and then going quiet for 30 minutes is a red flag.' Consistent contribution throughout, not just an impressive opening, is what RB scores.",
      whatStrongLooksLike: [
        "Volunteers to organize the group's approach in the first 2-3 minutes",
        "Builds explicitly on others' ideas: 'Building on what X said...'",
        "Synthesizes when the group gets stuck: 'The core tension we're seeing is X vs Y - which should we prioritize?'",
        "Consistent contribution throughout - not just at the start",
        "Credits others explicitly - noticed by evaluators",
        "Balances analytical contribution with team facilitation",
      ],
      whatWeakLooksLike: [
        "Dominates early then disengages",
        "Only adds new points without building on what others said",
        "Silent during key moments of synthesis or decision-making",
        "Competitive rather than collaborative - tries to 'win' the group case",
        "No facilitation instinct when group discussion gets stuck",
      ],
      scoringCriteria: {
        1: "Cannot collaborate. Either dominates entirely or contributes nothing.",
        2: "Below the bar. Either dominates and disengages, or contributes sporadically without building on others.",
        3: "Good collaborator. Contributes consistently. Some synthesis and building on others' ideas.",
        4: "Strong group case performance. Leads when needed, follows when appropriate. Credits others. Synthesizes effectively.",
        5: "Exceptional. The natural facilitator and analytical anchor of the group. Evaluators would immediately notice.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: {
    offerThreshold: 63,
    hardFloorDimensions: ["execution"],
    hardFloorScore: 3,
    excellenceDimensionsRequired: 2,
    excellenceScore: 4,
    disqualifierScore: 1,
  },
};

export function calculateRolandBergerOffer(scores: Record<string, number>): {
  decision: string;
  label: string;
  description: string;
  weightedScore: number;
} {
  const dims = ROLAND_BERGER_RUBRIC.dimensions;

  // Check disqualifiers
  for (const dim of dims) {
    if (dim.dealbreaker && scores[dim.key] <= 1) {
      return {
        decision: "disqualified",
        label: "No Offer",
        description: "Automatically disqualified. Analytical execution is non-negotiable at Roland Berger - being passive in the analysis is as costly as being structurally wrong. A score of 1 means you waited for direction rather than driving the case. This is the most critical gap to close before your next RB interview.",
        weightedScore: 0,
      };
    }
  }

  // Check other disqualifiers
  const otherDisqualifier = dims.find(d => !d.dealbreaker && scores[d.key] <= 1);
  if (otherDisqualifier) {
    return {
      decision: "disqualified",
      label: "No Offer",
      description: `A score of 1 on ${otherDisqualifier.label} is disqualifying at Roland Berger. This is the highest-priority area to develop.`,
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

  // Hard floor on execution
  if (scores["execution"] < ROLAND_BERGER_RUBRIC.offerDecision.hardFloorScore) {
    return {
      decision: "no_offer",
      label: "No Offer",
      description: "Below the Roland Berger bar. Analytical execution must reach at least a 3 - driving the analysis independently is Roland Berger's second explicit scoring dimension. Being passive or waiting for direction is a fundamental mismatch with RB's entrepreneurial, self-starter culture.",
      weightedScore: Math.round(weightedScore),
    };
  }

  const excellentDims = dims.filter(d => scores[d.key] >= ROLAND_BERGER_RUBRIC.offerDecision.excellenceScore).length;
  const threshold = ROLAND_BERGER_RUBRIC.offerDecision.offerThreshold;

  if (weightedScore >= 85 && excellentDims >= 3) {
    return {
      decision: "strong_offer",
      label: "Strong Offer",
      description: "Exceptional performance. Roland Berger would extend a strong offer. You demonstrated the rare combination of European industrial analytical fluency, RB's three-part synthesis format, entrepreneurial initiative, and collaborative group case leadership. Top 5% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= threshold && excellentDims >= ROLAND_BERGER_RUBRIC.offerDecision.excellenceDimensionsRequired) {
    return {
      decision: "offer",
      label: "Offer",
      description: "Above the Roland Berger bar. An offer would likely be extended. You showed the structured thinking, analytical drive, and entrepreneurial presence that Roland Berger's European industrial practice requires. Top 10-15% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= 48) {
    return {
      decision: "borderline",
      label: "Borderline - No Offer",
      description: "Close to the Roland Berger bar but not over it. The most common gap at this level is entrepreneurial presence and synthesis quality - candidates who are analytically solid but deliver generic recommendations without the root cause → recommendation → quantified impact format. Practice the RB synthesis structure and add entrepreneurial initiative to every case.",
      weightedScore: Math.round(weightedScore),
    };
  }

  return {
    decision: "no_offer",
    label: "No Offer",
    description: "Below the Roland Berger bar. Focus first on analytical execution (driving the case independently) and Roland Berger's explicit synthesis format (root cause → recommendation → quantified impact). Most candidates clear the RB bar within 12-18 cases of targeted practice.",
    weightedScore: Math.round(weightedScore),
  };
}