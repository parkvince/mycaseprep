export const EY_PARTHENON_RUBRIC = {
  firm: "ey-parthenon",
  firmFullName: "EY-Parthenon",
  format: "candidate-led",
  interviewDuration: "25-35 minutes",
  offerRate: "Approximately 1-2% of applicants. MBB-adjacent bar — not standard Big 4.",

  scoringScale: {
    1: "Insufficient — Would not be placed in front of a client.",
    2: "Adequate — Below the EY-Parthenon bar. Shows potential but not ready.",
    3: "Good — Meets the bar. Would represent EY-Parthenon competently.",
    4: "Very Good — Strong candidate. Above the bar.",
    5: "Exceptional — McKinsey/BCG-level performance.",
  },

  dimensions: [
    {
      key: "problemSolving",
      label: "Problem Solving Approach & Structure",
      weight: 25,
      eypNote: "EY-Parthenon's official prep guide lists this as Dimension 1. Because EY-Parthenon uses a candidate-led format, you must drive the analysis independently. Their prep guide explicitly states: identify and understand issues, ask clarifying questions, structure the problem, develop and prioritize recommendations. PE/investment cases dominate — your structure must reflect commercial diligence logic, not just generic consulting frameworks.",
      whatStrongLooksLike: [
        "Drives the case independently without waiting for interviewer prompts",
        "For PE/investment cases: structures around market attractiveness, competitive position, financial performance, and value creation",
        "For market entry cases: structures around market size, competitive dynamics, client capabilities, and entry economics",
        "Asks clarifying questions that show commercial awareness, not just comprehension",
        "Prioritizes the most likely drivers rather than exploring everything equally",
        "Evolves the structure as new data arrives",
      ],
      whatWeakLooksLike: [
        "Waits for the interviewer to direct the analysis",
        "Uses a textbook framework without adapting to the PE/investment context",
        "Explores all branches equally without prioritization",
        "Asks clarifying questions that are generic rather than commercially grounded",
      ],
      scoringCriteria: {
        1: "No structure. Waits for direction. Cannot frame a PE/investment problem.",
        2: "Partial structure. Relies on interviewer for major steps. Framework not adapted to investment context.",
        3: "Clear structure. Drives most of the case. Some adaptation to PE/investment logic.",
        4: "Strong, bespoke structure. Full ownership. PE/commercial logic clearly embedded.",
        5: "Exceptional. Structure is precisely tailored to the investment decision. Drives flawlessly.",
      },
      dealbreaker: false,
    },
    {
      key: "quantitative",
      label: "Numerical & Financial Skills",
      weight: 28,
      eypNote: "EY-Parthenon's official prep guide lists numerical skills as Dimension 2 and explicitly requires 'financial literacy — strong understanding of P&L and Balance Sheet.' This is the most distinctly EY-Parthenon dimension. Because of the PE heritage, candidates are expected to handle EBITDA, revenue multiples, margin math, and investment returns more fluently than at McKinsey or BCG. Their guide adds: 'We do not require complex analysis requiring unnecessary technical knowledge' — the bar is financial fluency, not investment banking modeling.",
      whatStrongLooksLike: [
        "Reads P&L and Balance Sheet with ease — knows what the numbers mean commercially",
        "Handles PE math: EBITDA margins, revenue multiples, investment returns, unit economics",
        "Fast, accurate mental math with clear narration",
        "Sanity-checks results against commercial reality: 'A 15x EBITDA multiple for a declining business seems high...'",
        "Makes sensible assumptions and states them clearly",
        "Triangulates numbers across sources to identify the real insight",
      ],
      whatWeakLooksLike: [
        "Cannot read a P&L or identify which line items matter for the investment decision",
        "Unfamiliar with EBITDA, margins, or investment multiples",
        "Math errors that cascade into wrong commercial conclusions",
        "Cannot translate numbers into investment implications",
      ],
      scoringCriteria: {
        1: "Cannot handle basic financial statements or PE math. Multiple errors. No commercial interpretation.",
        2: "Limited financial literacy. Struggles with P&L or EBITDA math. Some errors. Weak interpretation.",
        3: "Competent financial literacy. Handles P&L and basic PE math correctly. Some commercial interpretation.",
        4: "Strong financial fluency. PE math handled fluently. Every number connected to an investment implication.",
        5: "Exceptional. Reads financials like an investor. Instantly identifies the commercially relevant numbers. Fluent across all PE/transaction math.",
      },
      dealbreaker: true,
    },
    {
      key: "strategicJudgment",
      label: "Strategic & Investment Judgment",
      weight: 22,
      eypNote: "This is EY-Parthenon's most distinctive dimension relative to other Big 4 firms. Because the firm does PE commercial diligence and transaction advisory, candidates must think like investors — not just consultants. The key question: would you invest in this business? That requires making a judgment call with incomplete information, acknowledging risks explicitly, and taking a clear position. EY-Parthenon interviewers explicitly note that candidates who hedge every answer with 'it depends' without committing to a view are the most common failure pattern.",
      whatStrongLooksLike: [
        "Takes a clear investment position with incomplete information: 'My view is this is an attractive investment because...'",
        "Identifies the 2-3 key value drivers that determine whether the investment thesis holds",
        "Distinguishes between market-level tailwinds and company-specific competitive advantages",
        "Identifies the critical risk that could kill the investment and proposes how to diligence it",
        "Thinks about value creation post-acquisition, not just acquisition attractiveness",
        "Commercial awareness: knows what a realistic EBITDA multiple looks like for this sector",
      ],
      whatWeakLooksLike: [
        "Endless 'it depends' without committing to a view",
        "Cannot identify the 2-3 things that actually determine the investment outcome",
        "Confuses market growth with company competitive advantage",
        "No commercial awareness: cannot sanity-check valuation assumptions",
        "Recommendation that does not follow from the analysis",
      ],
      scoringCriteria: {
        1: "Cannot form an investment view. All answers are 'it depends.' No commercial instinct.",
        2: "Vague investment perspective. Cannot identify key value drivers. Hedges everything.",
        3: "Clear view on the investment. Identifies main value drivers. Some commercial awareness.",
        4: "Strong investment judgment. Identifies the key driver and critical risk. Commercial awareness is solid.",
        5: "Exceptional investor mindset. Cuts through to the 2-3 things that matter. Would hold their own in a PE partner meeting.",
      },
      dealbreaker: false,
    },
    {
      key: "communication",
      label: "Communication & Client Readiness",
      weight: 15,
      eypNote: "EY-Parthenon's internal standard for communication is explicitly: 'Would I feel comfortable placing you in front of a client?' This is a slightly higher commercial bar than pure analytical clarity. EY-Parthenon clients include PE partners, CFOs, and board members — communication must be executive-ready. The firm also has strong collaborative culture ('smart, nice, and driven') — communication should be confident but never arrogant.",
      whatStrongLooksLike: [
        "Executive-ready delivery: conclusion first, then logic, then implications",
        "Would feel natural presenting to a PE partner or CFO",
        "Confident but not arrogant: acknowledges uncertainty without hedging everything",
        "Concise: respects the client's time",
        "Handles pushback professionally: 'That's a fair point — let me reconsider the assumption on...'",
        "Natural, genuine delivery — not rehearsed",
      ],
      whatWeakLooksLike: [
        "Would need significant coaching before being placed with a client",
        "Buries conclusions or delivers them with excessive hedging",
        "Defensive when challenged",
        "Too verbose: buries the investment thesis in a wall of analysis",
        "Robotic or rehearsed delivery",
      ],
      scoringCriteria: {
        1: "Would not be placed in front of a client. Cannot communicate analysis clearly.",
        2: "Would need significant development before client exposure. Buries conclusions. Defensive.",
        3: "Client-ready with coaching. Clear enough. Some areas to polish.",
        4: "Client-ready now. Executive delivery. Confident, concise, composed under pushback.",
        5: "Exceptional. Would impress a PE partner or CFO. Natural, precise, and commercially authoritative.",
      },
      dealbreaker: false,
    },
    {
      key: "recommendation",
      label: "Recommendation Commitment & Decisiveness",
      weight: 10,
      eypNote: "EY-Parthenon explicitly identifies candidates who fail to commit to a recommendation as the most common failure pattern. This is linked to their PE heritage — in a real commercial diligence, the PE partner needs a clear answer: invest or don't invest. An EY-Parthenon consultant who says 'it's too early to tell' or hedges the final recommendation is not useful to the client. Decisiveness with appropriate caveats is the standard.",
      whatStrongLooksLike: [
        "Clear, committed recommendation stated in the first sentence of the conclusion",
        "Specific: invest/don't invest, enter/don't enter, with a clear rationale",
        "Acknowledges the 1-2 key risks that could change the recommendation",
        "Proposes next steps for diligence if uncertainty remains",
        "Holds the recommendation under pushback unless presented with genuinely new evidence",
      ],
      whatWeakLooksLike: [
        "Refuses to commit: 'I would need more data before making a recommendation'",
        "Recommendation is so hedged it has no meaning",
        "Abandons recommendation immediately under the slightest pushback",
        "Recommendation contradicts the analysis presented",
      ],
      scoringCriteria: {
        1: "No recommendation. Refuses to commit. Cannot take a position.",
        2: "Vague or heavily hedged recommendation. Not actionable. Abandons position under pushback.",
        3: "Clear recommendation with basic rationale. Holds under moderate pushback.",
        4: "Strong, specific, committed recommendation. Risks acknowledged. Holds under pushback unless shown new evidence.",
        5: "Exceptional. Investment-grade recommendation. Precise, specific, and defensible. Would satisfy a PE partner.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: {
    offerThreshold: 65,
    hardFloorDimensions: ["quantitative"],
    hardFloorScore: 3,
    excellenceDimensionsRequired: 2,
    excellenceScore: 4,
    disqualifierScore: 1,
  },
};

export function calculateEyParthenonOffer(scores: Record<string, number>): {
  decision: string;
  label: string;
  description: string;
  weightedScore: number;
} {
  const dims = EY_PARTHENON_RUBRIC.dimensions;

  // Check disqualifiers
  for (const dim of dims) {
    if (dim.dealbreaker && scores[dim.key] <= 1) {
      return {
        decision: "disqualified",
        label: "No Offer",
        description: "Automatically disqualified. Financial literacy is non-negotiable at EY-Parthenon given their PE and transaction advisory heritage. A score of 1 on quantitative means you could not handle the financial analysis that EY-Parthenon clients require. This is the highest-priority area to develop.",
        weightedScore: 0,
      };
    }
  }

  // Calculate weighted score
  let weightedScore = 0;
  for (const dim of dims) {
    const score = scores[dim.key] ?? 1;
    const normalized = ((score - 1) / 4) * 100;
    weightedScore += (normalized * dim.weight) / 100;
  }

  // Hard floor on quantitative
  if (scores["quantitative"] < EY_PARTHENON_RUBRIC.offerDecision.hardFloorScore) {
    return {
      decision: "no_offer",
      label: "No Offer",
      description: "Below the EY-Parthenon bar. Quantitative and financial skills must reach at least a 3 — EY-Parthenon's PE and transaction advisory work requires financial fluency. Strengthen your P&L literacy, EBITDA math, and investment return calculations before your next interview.",
      weightedScore: Math.round(weightedScore),
    };
  }

  // Recommendation check — EY-Parthenon specific
  if (scores["recommendation"] <= 1) {
    return {
      decision: "no_offer",
      label: "No Offer",
      description: "Below the EY-Parthenon bar. Failing to commit to a recommendation is the most common failure pattern at EY-Parthenon. PE partners and CFOs need a clear answer — not 'it depends.' Practice making decisive recommendations with appropriate caveats.",
      weightedScore: Math.round(weightedScore),
    };
  }

  const excellentDims = dims.filter(d => scores[d.key] >= EY_PARTHENON_RUBRIC.offerDecision.excellenceScore).length;
  const threshold = EY_PARTHENON_RUBRIC.offerDecision.offerThreshold;

  if (weightedScore >= 85 && excellentDims >= 3) {
    return {
      decision: "strong_offer",
      label: "Strong Offer",
      description: "Exceptional performance. EY-Parthenon would extend a strong offer. You demonstrated MBB-level analytical rigor, PE financial fluency, and the decisive investment judgment that EY-Parthenon's clients require. Top 5% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= threshold && excellentDims >= EY_PARTHENON_RUBRIC.offerDecision.excellenceDimensionsRequired) {
    return {
      decision: "offer",
      label: "Offer",
      description: "Above the EY-Parthenon bar. An offer would likely be extended. You showed the structured thinking, financial literacy, and investment decisiveness that EY-Parthenon values. Top 10-15% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= 50) {
    return {
      decision: "borderline",
      label: "Borderline — No Offer",
      description: "Close to the EY-Parthenon bar. The most common gap at this level is investment judgment and recommendation commitment — candidates who are analytically solid but hedge their final position. Practice making clear investment calls with appropriate caveats rather than deferring to more data.",
      weightedScore: Math.round(weightedScore),
    };
  }

  return {
    decision: "no_offer",
    label: "No Offer",
    description: "Below the EY-Parthenon bar. Focus first on financial literacy (P&L, EBITDA, investment math) and practice making committed investment recommendations. EY-Parthenon's bar is MBB-adjacent — most candidates need 12-20 cases before consistently clearing it.",
    weightedScore: Math.round(weightedScore),
  };
}