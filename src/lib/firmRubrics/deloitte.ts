export const DELOITTE_RUBRIC = {
  firm: "deloitte",
  firmFullName: "Deloitte Consulting",
  format: "candidate-led with hybrid elements",
  interviewDuration: "30-45 minutes case, 45-60 minutes total",
  offerRate: "Approximately 2-5% of applicants. Roughly 15-20% of interview-stage candidates. More accessible than MBB but still highly competitive.",

  scoringScale: {
    1: "Insufficient — Would not represent Deloitte with a client.",
    2: "Adequate — Below the Deloitte bar. Shows potential but not ready.",
    3: "Good — Meets the bar. Would perform competently on a Deloitte engagement.",
    4: "Very Good — Strong candidate. Above the bar with clear strengths.",
    5: "Exceptional — MBB-adjacent performance.",
  },

  dimensions: [
    {
      key: "structure",
      label: "Structured Thinking",
      weight: 22,
      deloitteNote: "Deloitte's first explicitly named dimension. Unlike McKinsey where structure must be perfectly MECE, Deloitte places more value on practical, organized thinking under pressure than on theoretical framework precision. The standard: can you organize chaos into a clear, logical story? Deloitte cases increasingly include AI, digital transformation, and technology themes — your structure should reflect comfort with these contexts alongside traditional strategy cases.",
      whatStrongLooksLike: [
        "Breaks the problem into clear, logical components immediately",
        "Adapts structure to the specific case type (profitability vs. market entry vs. digital transformation)",
        "Prioritizes the branches most likely to drive the answer",
        "Adjusts the structure as new information arrives",
        "For technology/AI cases: structures around feasibility, value creation, and implementation risk",
        "Does not need to be perfectly MECE — organized and clear is the standard",
      ],
      whatWeakLooksLike: [
        "No structure: jumps directly into random analysis",
        "Rigid adherence to a textbook framework that does not fit the case",
        "Cannot adapt when the interviewer redirects",
        "Structure that is theoretically MECE but practically unhelpful",
        "No prioritization among branches",
      ],
      scoringCriteria: {
        1: "No structure whatsoever. Analysis is disorganized and impossible to follow.",
        2: "Basic structure but not adapted to the case. No prioritization. Rigid.",
        3: "Clear, organized structure. Reasonably adapted to the case. Some prioritization.",
        4: "Strong bespoke structure. Well-prioritized. Evolves appropriately with new information.",
        5: "Exceptional. Structure that would immediately orient a client. Perfectly adapted and prioritized.",
      },
      dealbreaker: false,
    },
    {
      key: "analytical",
      label: "Analytical Ability",
      weight: 20,
      deloitteNote: "Deloitte's second explicitly named dimension. Deloitte cases are often exhibit-heavy with data tables, charts, and revenue/cost breakdowns. The standard is not perfection — it is comfort with data-driven decision making. Deloitte interviewers explicitly value the ability to separate signal from noise and make a business call with confidence. AI and digital transformation cases may include technology metrics (user acquisition costs, churn rates, platform economics) alongside traditional financial metrics.",
      whatStrongLooksLike: [
        "Reads charts and tables quickly and extracts the insight, not just the number",
        "Performs accurate mental math with clear narration",
        "Separates signal from noise in dense exhibit packages",
        "Makes sensible assumptions when data is missing",
        "Connects quantitative findings to business implications",
        "Comfortable with both traditional financial metrics and technology/digital KPIs",
      ],
      whatWeakLooksLike: [
        "Reads only the headline number from an exhibit without the insight",
        "Math errors that cascade into wrong conclusions",
        "Cannot work with incomplete data — paralyzed by missing information",
        "Right number but no business interpretation",
      ],
      scoringCriteria: {
        1: "Cannot interpret data or perform basic calculations. Paralyzed by missing information.",
        2: "Some data interpretation but misses key insights. Math errors present. Limited business connection.",
        3: "Solid analytical work. Reads exhibits adequately. Correct math. Some business interpretation.",
        4: "Strong analytical skills. Extracts non-obvious insights. Fast and accurate. Strong business connection.",
        5: "Exceptional. Immediately cuts to what matters in dense data. Every number tied to a business decision.",
      },
      dealbreaker: false,
    },
    {
      key: "businessAcumen",
      label: "Business Acumen & Practical Judgment",
      weight: 22,
      deloitteNote: "Deloitte's third explicitly named dimension, and the one that most distinguishes strong from average performers. Deloitte places more value on practical, real-world business judgment than on strategic elegance. The question: do your insights make sense in a real business context? Deloitte works across consulting, technology, financial advisory, and risk — business acumen must span strategy AND implementation. Interviewers want candidates who think like operators, not just strategists. AI, cloud, and digital transformation awareness are increasingly relevant given Deloitte's $3B AI investment commitment.",
      whatStrongLooksLike: [
        "Grounds every insight in real business constraints — not just theoretical strategy",
        "Considers implementation: 'This strategy makes sense, but the organization capability gap is the real risk'",
        "Comfortable across industries: understands P&L dynamics in different business models",
        "Shows awareness of current business themes: AI integration, digital transformation, supply chain resilience",
        "Makes the trade-off explicit: 'Option A has higher upside but higher execution risk than Option B'",
        "Treats it like a real client problem, not a textbook exercise",
      ],
      whatWeakLooksLike: [
        "Theoretically correct but ignores implementation reality",
        "Applies the same generic insights to every case regardless of industry",
        "No awareness of current business context (AI, digital transformation)",
        "Recommendations that would obviously not work in the real world",
        "Cannot evaluate trade-offs between strategic options",
      ],
      scoringCriteria: {
        1: "No real business judgment. Theoretically framed with no connection to how businesses actually operate.",
        2: "Some business context but mostly generic. Cannot evaluate real-world trade-offs.",
        3: "Solid business judgment. Grounded in reality. Aware of implementation constraints.",
        4: "Strong commercial and operational judgment. Considers trade-offs explicitly. Current business awareness.",
        5: "Exceptional. Thinks like an operator AND a strategist. The recommendation would actually work.",
      },
      dealbreaker: false,
    },
    {
      key: "communication",
      label: "Communication Skills",
      weight: 20,
      deloitteNote: "Deloitte's fourth explicitly named dimension. The communication standard at Deloitte is: clear, concise, and persuasive — can you walk someone through your logic under pressure? Deloitte serves a broader client base than MBB, including government, healthcare, and technology clients who expect accessible communication alongside analytical depth. The delivery style should feel natural and collaborative, not rehearsed or overly polished.",
      whatStrongLooksLike: [
        "Conclusion-first delivery: 'The key finding here is X, because...'",
        "Concise: says what needs to be said and stops",
        "Adapts communication style to the interviewer's cues",
        "Thinks out loud in an organized way",
        "Genuinely collaborative: treats it as a problem-solving dialogue",
        "Natural delivery — not recited from a script",
      ],
      whatWeakLooksLike: [
        "Buries conclusions at the end of long explanations",
        "Too verbose: exhausts the interviewer before getting to the point",
        "Robotic or rehearsed delivery",
        "Cannot explain reasoning clearly under pressure",
        "Goes silent without narrating thought process",
      ],
      scoringCriteria: {
        1: "Cannot communicate analysis clearly. Interviewer cannot follow the logic.",
        2: "Communicates but buries conclusions. Too verbose. Feels rehearsed.",
        3: "Clear enough. Mostly conclusion-first. Natural enough to follow.",
        4: "Strong communicator. Concise, conclusion-first, collaborative. Adapts to feedback.",
        5: "Exceptional. The clearest person the interviewer has interviewed this cycle. Natural, precise, and persuasive.",
      },
      dealbreaker: false,
    },
    {
      key: "coachability",
      label: "Coachability & Professional Demeanor",
      weight: 16,
      deloitteNote: "Deloitte's fifth explicitly named dimension — 'professional demeanor' — and the one most unique to Deloitte among Big 4 firms. Coachability is one of the most important traits Deloitte evaluates. Deloitte interviewers are asking two questions: (1) Would I put this person in front of a client? (2) Would I want this person on my team for 6 months? The coachability standard: when the interviewer pushes back on an idea, do you adapt thoughtfully rather than double down defensively or collapse entirely? This dimension also captures intellectual humility, genuine curiosity, and the collaborative 'Deloitte' team culture.",
      whatStrongLooksLike: [
        "Receives pushback and responds with curiosity: 'That's a fair point — let me reconsider the assumption on market size'",
        "Acknowledges when they've made an error openly: 'You're right, I overcounted there — let me recalibrate'",
        "Asks questions that show genuine curiosity about the business problem",
        "Polished but not stiff: professional without being robotic",
        "Would feel natural with a Deloitte client — calm, confident, approachable",
        "Shows genuine interest in the problem rather than just performing",
      ],
      whatWeakLooksLike: [
        "Defends wrong answers under pushback rather than reconsidering",
        "Collapses entirely when challenged — abandons correct positions",
        "Arrogant or dismissive of interviewer hints",
        "Too stiff or formal — feels like a performance rather than a conversation",
        "No genuine curiosity: treats the case as a test to pass rather than a problem to solve",
      ],
      scoringCriteria: {
        1: "Would not put in front of a client. Defensive, arrogant, or collapses under pushback.",
        2: "Some coachability but needs development. Either too defensive or too quick to abandon positions.",
        3: "Good professional demeanor. Receives feedback well. Collaborative enough.",
        4: "Strong coachability. Responds to pushback thoughtfully. Would represent Deloitte well with clients.",
        5: "Exceptional. The kind of person Deloitte would be proud to staff on a CEO engagement. Calm, confident, curious, and genuinely collaborative.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: {
    offerThreshold: 60,
    hardFloorDimensions: [],
    hardFloorScore: 2,
    excellenceDimensionsRequired: 2,
    excellenceScore: 4,
    disqualifierScore: 1,
  },
};

export function calculateDeloitteOffer(scores: Record<string, number>): {
  decision: string;
  label: string;
  description: string;
  weightedScore: number;
} {
  const dims = DELOITTE_RUBRIC.dimensions;

  // Check for any disqualifying 1s
  const disqualifyingDim = dims.find(d => scores[d.key] <= 1);
  if (disqualifyingDim) {
    return {
      decision: "disqualified",
      label: "No Offer",
      description: `A score of 1 on ${disqualifyingDim.label} is disqualifying at Deloitte. This is the highest-priority area to develop before your next interview.`,
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

  // Check minimum floor — all dimensions must be at least 2
  const belowFloor = dims.find(d => scores[d.key] < 2);
  if (belowFloor) {
    return {
      decision: "no_offer",
      label: "No Offer",
      description: `Below the Deloitte bar. ${belowFloor.label} must reach at least a 2. Focus on closing this gap before your next interview.`,
      weightedScore: Math.round(weightedScore),
    };
  }

  const excellentDims = dims.filter(d => scores[d.key] >= DELOITTE_RUBRIC.offerDecision.excellenceScore).length;
  const threshold = DELOITTE_RUBRIC.offerDecision.offerThreshold;

  if (weightedScore >= 85 && excellentDims >= 3) {
    return {
      decision: "strong_offer",
      label: "Strong Offer",
      description: "Exceptional performance. Deloitte would extend a strong offer. You demonstrated MBB-adjacent analytical rigor alongside the coachability and practical business judgment that Deloitte uniquely values. Top 5% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= threshold && excellentDims >= DELOITTE_RUBRIC.offerDecision.excellenceDimensionsRequired) {
    return {
      decision: "offer",
      label: "Offer",
      description: "Above the Deloitte bar. An offer would likely be extended. You showed the structured thinking, practical business judgment, and coachability that Deloitte looks for. Top 15-20% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= 45) {
    return {
      decision: "borderline",
      label: "Borderline — No Offer",
      description: "Close to the Deloitte bar but not over it. The most common gap at this level is coachability and business acumen — candidates who are technically competent but feel transactional or too theoretical. Deloitte wants someone who thinks like an operator and would feel natural in front of a client. Practice adapting to pushback constructively.",
      weightedScore: Math.round(weightedScore),
    };
  }

  return {
    decision: "no_offer",
    label: "No Offer",
    description: "Below the Deloitte bar. Focus first on structured thinking and coachability — these are Deloitte's most distinctive dimensions. Deloitte's bar is more accessible than MBB, and most candidates clear it within 10-15 cases of deliberate practice.",
    weightedScore: Math.round(weightedScore),
  };
}