export const PWC_RUBRIC = {
  firm: "pwc",
  firmFullName: "PwC Strategy&",
  format: "candidate-led with strong behavioral component",
  interviewDuration: "25-30 minutes case, 45 minutes total",
  offerRate: "Approximately 3-5% of applicants. MBB-adjacent bar for Strategy&. More accessible than McKinsey but more demanding than standard Big 4.",

  scoringScale: {
    1: "Insufficient — Would not represent PwC/Strategy& with a client.",
    2: "Adequate — Below the PwC bar. Shows potential but not ready.",
    3: "Good — Meets the bar. Would perform competently on a PwC engagement.",
    4: "Very Good — Strong candidate. Above the bar with clear strengths.",
    5: "Exceptional — MBB-adjacent performance.",
  },

  dimensions: [
    {
      key: "structure",
      label: "Structured Reasoning & Hypothesis-Driven Thinking",
      weight: 22,
      pwcNote: "PwC Strategy& uses a candidate-led format and explicitly rewards hypothesis-driven structuring. Their proprietary 'capabilities-driven strategy' framework shapes how they think: the best structures identify what distinctive capabilities the client has or needs to build — not just generic strategic buckets. Unlike McKinsey's rigidly MECE standard, PwC rewards clear, hypothesis-led thinking that is commercially grounded. Form a clear hypothesis early and use it to guide the entire analysis.",
      whatStrongLooksLike: [
        "States a clear, testable hypothesis at the start: 'My initial view is that the client's challenge is capability-related, not market-related'",
        "Structure is organized around testing that hypothesis rather than exploring all possibilities equally",
        "For Strategy& cases: explicitly considers what distinctive capabilities the client needs to build or leverage",
        "Prioritizes branches most likely to move the answer",
        "Evolves structure cleanly when evidence contradicts the initial hypothesis",
        "Commercially grounded from the first sentence",
      ],
      whatWeakLooksLike: [
        "No hypothesis — explores all branches equally without a guiding view",
        "Generic MECE framework not adapted to the strategic context",
        "Rigid adherence to initial structure even when evidence points elsewhere",
        "Structure that is analytically correct but commercially disconnected",
      ],
      scoringCriteria: {
        1: "No structure or hypothesis. Cannot frame a strategy problem. Explores randomly.",
        2: "Basic structure but no hypothesis. Generic framework not adapted to the case.",
        3: "Clear hypothesis-led structure. Some commercial grounding. Adapts when challenged.",
        4: "Strong hypothesis-driven structure. Commercially grounded. Adapts cleanly with evidence.",
        5: "Exceptional. The capabilities-driven logic is immediately apparent. Would impress a Strategy& partner.",
      },
      dealbreaker: false,
    },
    {
      key: "quantitative",
      label: "Quantitative Analysis & Financial Logic",
      weight: 20,
      pwcNote: "PwC Strategy& explicitly emphasizes financial logic and commercial viability alongside strategic reasoning. Their prep materials highlight ROI, break-even, CAGR, and market sizing as core mathematical skills. The standard is 'structured reasoning and financial logic' — not PE-level modeling (that's EY-Parthenon), but every strategic recommendation must be grounded in whether the client can financially execute and justify it. AI implementation ROI cases are increasingly common given PwC's heavy AI investment.",
      whatStrongLooksLike: [
        "Every strategic recommendation is grounded in financial feasibility: 'This makes sense strategically only if the ROI exceeds X%'",
        "Fast, accurate mental math with clear narration of approach",
        "Break-even, ROI, CAGR, and market sizing calculations handled fluently",
        "For AI/digital cases: can frame technology implementation as a quantified business case",
        "Connects quantitative findings to strategic implications",
        "Sanity-checks results against commercial reality",
      ],
      whatWeakLooksLike: [
        "Strategic recommendations with no financial grounding",
        "Math errors that undermine the commercial viability of the recommendation",
        "Cannot connect numbers to strategic implications",
        "Unfamiliar with basic financial metrics (ROI, break-even, CAGR)",
      ],
      scoringCriteria: {
        1: "Cannot perform financial calculations or connect numbers to strategic implications.",
        2: "Some financial analysis but not grounded in commercial viability. Errors present.",
        3: "Solid quantitative work. Financial feasibility checked. Basic ROI/break-even handled correctly.",
        4: "Strong financial logic. Every recommendation grounded in financial viability. Fast and accurate.",
        5: "Exceptional. The financial logic is inseparable from the strategic logic. Would satisfy a Strategy& partner.",
      },
      dealbreaker: false,
    },
    {
      key: "strategicJudgment",
      label: "Strategic & Commercial Judgment",
      weight: 23,
      pwcNote: "This is the core Strategy& dimension. Strategy& was built from Booz & Company's 'capabilities-driven strategy' approach — the firm genuinely believes competitive advantage comes from building distinctive capabilities, not from generic strategic positioning. The best candidates identify WHAT capabilities the client needs to win, WHETHER they currently have them, and HOW to build or acquire them. Compared to EY-Parthenon (which focuses on investment attractiveness) and Deloitte (which focuses on implementation), Strategy& focuses on long-term strategic alignment and differentiation.",
      whatStrongLooksLike: [
        "Identifies the 2-3 capabilities that would actually determine whether the strategy succeeds",
        "Distinguishes between market tailwinds (external) and distinctive capabilities (internal)",
        "Asks: 'Does the client have the right to win in this market given their current capabilities?'",
        "Long-term orientation: considers 3-5 year strategic implications, not just next quarter",
        "Cross-sector awareness: shows knowledge of industry dynamics (energy, healthcare, technology, industrials, public sector)",
        "Recommendation is both strategically sound AND commercially viable",
      ],
      whatWeakLooksLike: [
        "Confuses market attractiveness with client competitive advantage",
        "No consideration of the client's distinctive capabilities or gaps",
        "Short-term tactical thinking disguised as strategy",
        "Generic recommendations that apply to any company in any industry",
        "Commercially unviable strategy that sounds good in theory",
      ],
      scoringCriteria: {
        1: "No strategic judgment. Generic answers. Cannot identify what would actually determine success.",
        2: "Some strategic thinking but misses the capabilities dimension. Tactics disguised as strategy.",
        3: "Solid strategic judgment. Identifies main drivers. Some capabilities awareness.",
        4: "Strong strategic insight. Capabilities-driven thinking. Long-term orientation. Commercially viable.",
        5: "Exceptional. Thinks exactly like a Strategy& partner. Capabilities-driven, long-term, and commercially precise.",
      },
      dealbreaker: false,
    },
    {
      key: "communication",
      label: "Communication & Structured Delivery",
      weight: 18,
      pwcNote: "PwC Strategy& communication standard: clear, structured, and commercially grounded. PwC serves a wide range of clients across sectors including energy, healthcare, industrials, and public sector — communication must be adaptable to different client contexts. Written case and group case components in final rounds test different communication skills: slide-based communication (written case) and collaborative discussion facilitation (group case). In the live case, hypothesis-led communication that mirrors how Strategy& consultants actually work with clients is the ideal.",
      whatStrongLooksLike: [
        "Conclusion-first: 'My recommendation is X because it leverages the client's core capabilities in Y'",
        "Hypothesis-led communication throughout: consistently ties back to the initial view",
        "Adapts language to the industry context — does not use generic consulting jargon",
        "Concise and structured under pressure",
        "For group cases: contributes substantively while building on others' ideas",
        "Natural delivery — not rehearsed",
      ],
      whatWeakLooksLike: [
        "Builds to the conclusion rather than leading with it",
        "Generic consulting language disconnected from the specific case context",
        "Cannot synthesize complex findings into a clear recommendation",
        "In group settings: either dominates or goes silent",
      ],
      scoringCriteria: {
        1: "Cannot communicate analysis clearly. Interviewer cannot follow the strategic logic.",
        2: "Communicates but buries conclusions. Generic language. Struggles in group dynamics.",
        3: "Clear structured delivery. Mostly conclusion-first. Adapts reasonably to context.",
        4: "Strong. Hypothesis-led communication throughout. Clear and commercially grounded. Good in groups.",
        5: "Exceptional. The delivery itself reflects how Strategy& consultants communicate with clients.",
      },
      dealbreaker: false,
    },
    {
      key: "behavioralFit",
      label: "Behavioral Fit & Genuine Motivation",
      weight: 17,
      pwcNote: "This is PwC's most unique evaluative dimension and the one most candidates underestimate. PwC/Strategy& behavioral fit can ELIMINATE you even with strong case performance — it is an explicit gate, not just a secondary consideration. PwC interviewers are specifically checking two things: (1) Do you genuinely want to work at PwC/Strategy& specifically, or are you just using it as an MBB backup? (2) Do you fit PwC's values of inclusion, integrity, and long-term societal impact? Generic 'why consulting' answers that don't specifically reference PwC or Strategy& score poorly here.",
      whatStrongLooksLike: [
        "Demonstrates genuine knowledge of Strategy& specifically: references capabilities-driven strategy, named sectors, or recent Strategy& work",
        "Articulates why PwC/Strategy& specifically — not just 'because you're a top firm'",
        "Stories show leadership, teamwork, and navigating complexity under pressure",
        "Connects personal values to PwC's stated values (inclusion, integrity, societal impact)",
        "Shows intellectual curiosity about the specific industries Strategy& focuses on",
        "Asks thoughtful questions that show genuine interest, not just performance",
      ],
      whatWeakLooksLike: [
        "Generic 'why consulting' answer with no PwC-specific content",
        "Obvious MBB backup mentality — would clearly prefer McKinsey/BCG/Bain",
        "Cannot articulate what makes Strategy& different from other firms",
        "Stories are generic without PwC values connection",
        "No genuine curiosity about the firm or its work",
      ],
      scoringCriteria: {
        1: "Clear MBB backup mentality. No genuine interest in PwC/Strategy&. Automatic flag for elimination.",
        2: "Generic motivation. Shows interest in consulting generally but not PwC/Strategy& specifically.",
        3: "Reasonable PwC fit. Shows some firm-specific knowledge. Adequate values connection.",
        4: "Strong behavioral fit. Genuinely motivated by PwC/Strategy&. Firm-specific knowledge evident. Values aligned.",
        5: "Exceptional. The interviewer has no doubt this candidate wants to work at Strategy& specifically and would thrive in the culture.",
      },
      dealbreaker: true,
    },
  ],

  offerDecision: {
    offerThreshold: 62,
    hardFloorDimensions: ["behavioralFit"],
    hardFloorScore: 2,
    excellenceDimensionsRequired: 2,
    excellenceScore: 4,
    disqualifierScore: 1,
  },
};

export function calculatePwcOffer(scores: Record<string, number>): {
  decision: string;
  label: string;
  description: string;
  weightedScore: number;
} {
  const dims = PWC_RUBRIC.dimensions;

  // Behavioral fit is an explicit eliminator at PwC
  if (scores["behavioralFit"] <= 1) {
    return {
      decision: "disqualified",
      label: "No Offer",
      description: "Automatically disqualified. PwC's behavioral fit interview can eliminate candidates regardless of case performance. A score of 1 signals a clear MBB backup mentality or lack of genuine interest in Strategy& specifically. Before your next PwC interview, deeply research Strategy&'s capabilities-driven approach and articulate specifically why you want to work there — not just at consulting generally.",
      weightedScore: 0,
    };
  }

  // Check other disqualifiers
  const disqualifyingDim = dims.find(d => !d.dealbreaker && scores[d.key] <= 1);
  if (disqualifyingDim) {
    return {
      decision: "disqualified",
      label: "No Offer",
      description: `A score of 1 on ${disqualifyingDim.label} is disqualifying at PwC Strategy&. This is the highest-priority area to develop.`,
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

  // Behavioral fit hard floor
  if (scores["behavioralFit"] < PWC_RUBRIC.offerDecision.hardFloorScore) {
    return {
      decision: "no_offer",
      label: "No Offer",
      description: "Below the PwC bar. Behavioral fit must reach at least a 2 — PwC specifically screens for genuine motivation to join Strategy& rather than using it as an MBB backup. Research Strategy&'s capabilities-driven approach, named sectors, and recent work before your next interview.",
      weightedScore: Math.round(weightedScore),
    };
  }

  const excellentDims = dims.filter(d => scores[d.key] >= PWC_RUBRIC.offerDecision.excellenceScore).length;
  const threshold = PWC_RUBRIC.offerDecision.offerThreshold;

  if (weightedScore >= 84 && excellentDims >= 3) {
    return {
      decision: "strong_offer",
      label: "Strong Offer",
      description: "Exceptional performance. PwC Strategy& would extend a strong offer. You demonstrated the rare combination of capabilities-driven strategic thinking, financial rigor, and genuine motivation to join Strategy& specifically. Top 5% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= threshold && excellentDims >= PWC_RUBRIC.offerDecision.excellenceDimensionsRequired) {
    return {
      decision: "offer",
      label: "Offer",
      description: "Above the PwC Strategy& bar. An offer would likely be extended. You showed hypothesis-driven thinking, commercial viability focus, and genuine motivation to join Strategy& specifically. Top 10-15% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= 47) {
    return {
      decision: "borderline",
      label: "Borderline — No Offer",
      description: "Close to the PwC bar but not over it. The most common gap at this level is behavioral fit and strategic judgment — candidates who are analytically solid but seem to view PwC as an MBB backup, or who deliver structured but generic recommendations without the capabilities-driven lens. Deepen your knowledge of Strategy& specifically before your next interview.",
      weightedScore: Math.round(weightedScore),
    };
  }

  return {
    decision: "no_offer",
    label: "No Offer",
    description: "Below the PwC Strategy& bar. Focus first on behavioral fit (genuine PwC motivation is an explicit gate) and strategic judgment (practice capabilities-driven thinking). Strategy&'s bar is more accessible than MBB — most candidates clear it within 10-15 cases of targeted preparation combined with firm-specific research.",
    weightedScore: Math.round(weightedScore),
  };
}