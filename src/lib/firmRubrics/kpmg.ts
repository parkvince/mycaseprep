export const KPMG_RUBRIC = {
  firm: "kpmg",
  firmFullName: "KPMG",
  format: "candidate-led with strong behavioral component",
  interviewDuration: "30-45 minutes case, 45-60 minutes total",
  offerRate: "Approximately 3-7% of applicants. More accessible than MBB and EY-Parthenon but still competitive.",

  scoringScale: {
    1: "Insufficient — Would not represent KPMG with a client or fit the team culture.",
    2: "Adequate — Below the KPMG bar. Shows potential but not ready.",
    3: "Good — Meets the bar. Would perform competently on a KPMG engagement.",
    4: "Very Good — Strong candidate. Above the bar with clear strengths.",
    5: "Exceptional — Among the strongest candidates this cycle.",
  },

  dimensions: [
    {
      key: "structure",
      label: "Structured Thinking & Problem Decomposition",
      weight: 22,
      kpmgNote: "KPMG uses a candidate-led format — you must drive the structure. Uniquely, KPMG cases lean operational and hybrid: expect profitability + implementation, market entry + change management, or M&A + integration planning in the same case. Your structure must account for BOTH the strategic recommendation AND the execution pathway. A structure that solves the strategy but ignores 'how do we actually do this' is incomplete at KPMG.",
      whatStrongLooksLike: [
        "Structures cover both strategic direction AND operational execution",
        "For hybrid cases: explicitly separates 'what should we do' from 'how do we do it'",
        "Prioritizes the branches most likely to drive the answer",
        "Adapts the structure as new information arrives",
        "For M&A or integration cases: covers deal rationale, integration planning, and risk",
        "For change management cases: addresses stakeholder impact and adoption",
      ],
      whatWeakLooksLike: [
        "Pure strategy framework with no operational component",
        "Rigid adherence to a textbook framework not adapted to the case",
        "No prioritization among branches",
        "Ignores implementation entirely — only addresses the strategic question",
      ],
      scoringCriteria: {
        1: "No structure. Analysis is disorganized. Cannot frame a hybrid strategy/operations problem.",
        2: "Basic structure but misses operational dimension. Rigid. Not adapted to the case.",
        3: "Clear structure covering main drivers. Some operational awareness. Reasonable prioritization.",
        4: "Strong structure covering strategy AND execution. Well-prioritized and case-adapted.",
        5: "Exceptional. Covers the full complexity of the hybrid case with crystal clarity. Interviewer would immediately use it with a client.",
      },
      dealbreaker: false,
    },
    {
      key: "analytical",
      label: "Analytical Ability & Data Interpretation",
      weight: 18,
      kpmgNote: "KPMG evaluates analytical ability but with a different emphasis than MBB: speed matters less than accuracy and professional judgment. KPMG's written case exercise (used in second rounds for many roles) specifically tests data synthesis, prioritization, and presentation quality under timed conditions. The online assessment filters for numerical reasoning and extracting key information under time pressure — not advanced math.",
      whatStrongLooksLike: [
        "Extracts the key insight from data, not just the headline number",
        "Accurate mental math with clear narration of approach",
        "Identifies what data is missing and makes sensible assumptions",
        "Prioritizes which data points actually matter for the decision",
        "For written case component: synthesizes multiple data sources into a coherent narrative",
        "Sanity-checks results against business reality",
      ],
      whatWeakLooksLike: [
        "Math errors that cascade into wrong conclusions",
        "Cannot identify what a number means for the business decision",
        "Paralyzed by missing data rather than making sensible assumptions",
        "Reads only the obvious data point without the analytical insight",
      ],
      scoringCriteria: {
        1: "Cannot perform basic calculations or extract insights from data. Paralyzed by missing information.",
        2: "Some analytical capability but with errors or surface-level data reading. Limited business connection.",
        3: "Solid analytical work. Accurate. Extracts reasonable insights. Sensible assumptions.",
        4: "Strong analytical skills. Fast, accurate, well-narrated. Prioritizes the right data. Strong business connection.",
        5: "Exceptional. Immediately identifies what matters in the data. Every number tied to the decision.",
      },
      dealbreaker: false,
    },
    {
      key: "operationalJudgment",
      label: "Business & Operational Judgment",
      weight: 22,
      kpmgNote: "This is the most distinctly KPMG dimension. Unlike MBB which rewards pure strategic insight, KPMG cases require operational and implementation awareness alongside strategic logic. KPMG serves clients on execution — post-merger integration, change management, operational improvement, digital transformation. Candidates who deliver elegant strategy without acknowledging 'how do we actually do this' miss the KPMG standard. The ideal KPMG recommendation covers what to do, how to sequence it, and what will be hard.",
      whatStrongLooksLike: [
        "Recommendations address both strategy AND execution pathway",
        "Identifies implementation risks and proposes how to manage them",
        "For integration or change management cases: addresses people, process, and technology dimensions",
        "Thinks about sequencing: 'We should start with X because it's fastest to implement and builds momentum'",
        "Commercial awareness: understands what is realistically achievable given the client's constraints",
        "Connects recommendations to measurable outcomes",
      ],
      whatWeakLooksLike: [
        "Recommendation is purely strategic with no implementation pathway",
        "No awareness of change management, stakeholder buy-in, or execution risk",
        "Recommendations that sound good in theory but would be impossible to execute",
        "Cannot prioritize between multiple strategic options on feasibility grounds",
      ],
      scoringCriteria: {
        1: "No operational awareness. Recommendation is purely theoretical with no execution pathway.",
        2: "Some business judgment but misses implementation dimension entirely. Cannot evaluate feasibility.",
        3: "Solid business judgment. Acknowledges execution complexity. Reasonable feasibility awareness.",
        4: "Strong operational judgment. Covers strategy AND execution. Identifies key risks and sequencing.",
        5: "Exceptional. The recommendation would actually work. Covers what to do, how to do it, and what will be hard.",
      },
      dealbreaker: false,
    },
    {
      key: "communication",
      label: "Communication & Client Readiness",
      weight: 18,
      kpmgNote: "KPMG's communication standard: clear, concise, and structured. KPMG serves a wide client base including government, financial services, healthcare, and technology — communication must be accessible to a non-consulting client without oversimplifying. The group case (used in some final rounds) specifically tests whether you can contribute constructively to a team discussion, summarize others' points fairly, and move a group toward consensus. Solo communication and collaborative communication are both evaluated.",
      whatStrongLooksLike: [
        "Conclusion-first: states the key finding or recommendation upfront",
        "Concise: respects the interviewer's time without being terse",
        "In group settings: listens actively, builds on others' contributions, and advances the discussion",
        "Professional but natural delivery — not rehearsed",
        "Adapts to feedback mid-case",
        "Would feel natural presenting to a CFO or government agency head",
      ],
      whatWeakLooksLike: [
        "Buries conclusions at the end of long explanations",
        "In group settings: dominates without listening or goes silent without contributing",
        "Defensive when the interviewer pushes back",
        "Too formal or robotic",
        "Cannot summarize complex findings concisely",
      ],
      scoringCriteria: {
        1: "Cannot communicate clearly. Interviewer cannot follow the logic.",
        2: "Communicates but buries conclusions. Either dominates or goes silent in groups.",
        3: "Clear enough. Mostly conclusion-first. Collaborative in group settings.",
        4: "Strong communicator. Concise, structured, and professional. Excellent in group dynamics.",
        5: "Exceptional. Would represent KPMG with any client — government, C-suite, or financial services. Natural and authoritative.",
      },
      dealbreaker: false,
    },
    {
      key: "valuesAlignment",
      label: "Values Alignment & Professional Mindset",
      weight: 20,
      kpmgNote: "This is KPMG's most unique scoring dimension. Unlike any other firm in this app, KPMG explicitly evaluates candidates against five named core values during interviews: Integrity (doing what is right even when difficult), Excellence (never stop learning and improving), Courage (think and act boldly, push back when warranted), Together (respect others, draw strength from differences), and For Better (broader impact on society). Interviewers often ask questions naming a specific value directly. Even in case interviews, the professional mindset dimension is implicit: the best KPMG answers are prudent, ethical, and client-aware — not just analytically sharp.",
      whatStrongLooksLike: [
        "Integrity: raises a hard issue in the case analysis even when it complicates the recommendation",
        "Excellence: shows continuous improvement instinct — 'what I'd want to know next is...'",
        "Courage: pushes back on an assumption in the case when it seems wrong",
        "Together: in group settings, builds on others' ideas rather than overriding them",
        "For Better: shows awareness of broader stakeholder impact of the recommendation",
        "Professional mindset: responses are prudent and client-aware, not just analytically clever",
      ],
      whatWeakLooksLike: [
        "Recommendations that ignore obvious ethical or stakeholder risks",
        "No intellectual humility: cannot acknowledge uncertainty or gaps in their analysis",
        "In group settings: competitive rather than collaborative",
        "Prioritizes 'impressive' answers over honest, client-centered ones",
        "No awareness of broader business or societal impact of recommendations",
      ],
      scoringCriteria: {
        1: "Significant values mismatch. Recommendations lack integrity or professional judgment.",
        2: "Generic professional demeanor without evident KPMG values alignment.",
        3: "Good professional mindset. Shows at least one KPMG value clearly during the case.",
        4: "Strong values alignment. Multiple KPMG values evident. Prudent, ethical, and collaborative.",
        5: "Exceptional. Every dimension of the case reflects KPMG's values. This candidate already thinks like a KPMG professional.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: {
    offerThreshold: 58,
    hardFloorDimensions: [],
    hardFloorScore: 2,
    excellenceDimensionsRequired: 2,
    excellenceScore: 4,
    disqualifierScore: 1,
  },
};

export function calculateKpmgOffer(scores: Record<string, number>): {
  decision: string;
  label: string;
  description: string;
  weightedScore: number;
} {
  const dims = KPMG_RUBRIC.dimensions;

  // Check disqualifiers
  const disqualifyingDim = dims.find(d => scores[d.key] <= 1);
  if (disqualifyingDim) {
    return {
      decision: "disqualified",
      label: "No Offer",
      description: `A score of 1 on ${disqualifyingDim.label} is disqualifying at KPMG. This is the highest-priority area to develop before your next interview.`,
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

  // Floor check
  const belowFloor = dims.find(d => scores[d.key] < 2);
  if (belowFloor) {
    return {
      decision: "no_offer",
      label: "No Offer",
      description: `Below the KPMG bar. ${belowFloor.label} must reach at least a 2. Focus on this before your next interview.`,
      weightedScore: Math.round(weightedScore),
    };
  }

  // Values alignment check — KPMG specific
  if (scores["valuesAlignment"] <= 1) {
    return {
      decision: "no_offer",
      label: "No Offer",
      description: "Below the KPMG bar. Values alignment is explicitly scored at KPMG — a score of 1 signals a fundamental mismatch with KPMG's culture of integrity, excellence, courage, collaboration, and broader impact. Review KPMG's five core values and practice connecting them to your analytical responses.",
      weightedScore: Math.round(weightedScore),
    };
  }

  const excellentDims = dims.filter(d => scores[d.key] >= KPMG_RUBRIC.offerDecision.excellenceScore).length;
  const threshold = KPMG_RUBRIC.offerDecision.offerThreshold;

  if (weightedScore >= 82 && excellentDims >= 3) {
    return {
      decision: "strong_offer",
      label: "Strong Offer",
      description: "Exceptional performance. KPMG would extend a strong offer. You demonstrated the rare combination of analytical rigor, operational judgment, and values alignment that KPMG's culture is built on. Top 5% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= threshold && excellentDims >= KPMG_RUBRIC.offerDecision.excellenceDimensionsRequired) {
    return {
      decision: "offer",
      label: "Offer",
      description: "Above the KPMG bar. An offer would likely be extended. You showed solid structured thinking, operational awareness, and KPMG values alignment. Top 15-20% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= 42) {
    return {
      decision: "borderline",
      label: "Borderline — No Offer",
      description: "Close to the KPMG bar but not over it. The most common gap at this level is operational judgment and values alignment — candidates who are analytically competent but miss the execution dimension or seem purely strategy-focused. KPMG wants people who think about 'how do we actually do this.' Practice adding implementation pathways to every recommendation.",
      weightedScore: Math.round(weightedScore),
    };
  }

  return {
    decision: "no_offer",
    label: "No Offer",
    description: "Below the KPMG bar. Focus first on operational judgment (adding execution pathways to every recommendation) and values alignment (connecting your analysis to KPMG's five core values). KPMG's bar is more accessible than MBB — most candidates clear it within 8-12 cases of targeted practice.",
    weightedScore: Math.round(weightedScore),
  };
}