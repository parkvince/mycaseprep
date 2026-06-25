export const ACCENTURE_RUBRIC = {
  firm: "accenture",
  firmFullName: "Accenture",
  format: "hybrid candidate-led and interviewer-led with group case component",
  interviewDuration: "30-60 minutes per interview",
  offerRate: "Approximately 6% of applicants — more accessible than MBB and Tier 2 firms but still selective.",

  scoringScale: {
    1: "Insufficient — Would not represent Accenture in front of a client.",
    2: "Adequate — Below the Accenture bar. Shows potential but not ready.",
    3: "Good — Meets the bar. Solid consultant material.",
    4: "Very Good — Above the bar. Strong candidate with clear consulting strengths.",
    5: "Exceptional — MBB-adjacent performance with Accenture's digital and tech edge.",
  },

  dimensions: [
    {
      key: "structuredThinking",
      label: "Structured Thinking & MECE Framework",
      weight: 20,
      accentureNote: "Accenture's first explicitly named core skill. Three unique case formats test structure differently: The Great Unknown (minimal data, you must build structure from almost nothing), The Parade of Facts (dense data, you must identify what matters), The Back of the Envelope (estimation-focused). All three demand MECE frameworks. Accenture explicitly evaluates 'forest vs. trees' thinking: can you stay at the right level of altitude instead of getting lost in irrelevant details? The 80/20 rule is central — Accenture consultants work at massive scale and must prioritize ruthlessly.",
      whatStrongLooksLike: [
        "Builds a MECE framework from almost no data (Great Unknown) without freezing",
        "In Parade of Facts cases: immediately identifies which data points matter and which are noise",
        "80/20 prioritization: explicitly states which branch is most likely to drive the answer",
        "Stays at the right altitude — doesn't get lost in irrelevant detail",
        "Adapts framework when new information arrives",
        "For digital/tech cases: structures around technology feasibility, business ROI, and change management",
      ],
      whatWeakLooksLike: [
        "Freezes when given minimal data (Great Unknown)",
        "Gets lost in all the data in Parade of Facts cases — cannot separate signal from noise",
        "No prioritization among branches — treats all equally",
        "Framework that is too high-level (no actionable branches) or too granular (lost in detail)",
      ],
      scoringCriteria: {
        1: "Cannot build a framework from ambiguous data. No MECE thinking. Gets lost in details.",
        2: "Basic structure but no 80/20 prioritization. Struggles with Great Unknown format. Misses key signals in Parade of Facts.",
        3: "Clear MECE framework. Some prioritization. Handles all three case formats adequately.",
        4: "Strong structured thinking. Immediate 80/20 prioritization. Forest vs. trees balance is excellent.",
        5: "Exceptional. Instantly builds a perfect MECE framework from minimal data. Never loses the forest for the trees.",
      },
      dealbreaker: false,
    },
    {
      key: "problemSolving",
      label: "Problem Solving & Analytical Drive",
      weight: 20,
      accentureNote: "Accenture's second explicitly named core skill. Problem solving at Accenture means hypothesis-driven analysis combined with 80/20 prioritization. Unlike McKinsey where every answer must be perfectly precise, Accenture values the ability to generate multiple angles on an ambiguous problem quickly. The Potentia interview (Accenture Strategy track) specifically tests this: no math, no correct answer — just the ability to form a genuine point of view quickly, prioritize the most important considerations, and communicate reasoning clearly.",
      whatStrongLooksLike: [
        "Forms a clear hypothesis early and uses it to guide the analysis",
        "Generates multiple angles on an ambiguous problem",
        "For Potentia-style questions: can form a genuine point of view quickly on unfamiliar topics",
        "Prioritizes the 2-3 most important drivers rather than exploring everything",
        "Root cause analysis: drills to the real cause, not just the symptom",
        "Adapts hypothesis when evidence contradicts it",
      ],
      whatWeakLooksLike: [
        "No hypothesis — explores randomly",
        "On Potentia-style questions: cannot form a view without data",
        "Explores all areas equally without prioritization",
        "Identifies symptoms but not root causes",
        "Cannot adapt when evidence points in a different direction",
      ],
      scoringCriteria: {
        1: "No problem-solving drive. Cannot form a hypothesis. Explores randomly.",
        2: "Vague hypothesis. Struggles with ambiguous prompts. No root cause identification.",
        3: "Clear hypothesis-driven approach. Identifies main root causes. Reasonable prioritization.",
        4: "Strong problem solving. Forms a view quickly on ambiguous topics. Root cause identified. Adapts well.",
        5: "Exceptional. The kind of thinker Accenture builds its reputation on — quick, hypothesis-driven, and adaptable.",
      },
      dealbreaker: false,
    },
    {
      key: "businessJudgment",
      label: "Business Judgment & Digital Awareness",
      weight: 20,
      accentureNote: "Accenture's third explicitly named core skill — and the one most uniquely shaped by the firm's identity. Accenture is the world's largest consulting firm by revenue and is synonymous with digital transformation and technology consulting. Business judgment at Accenture MUST include digital and technology awareness. Case prompts frequently involve cloud migration, AI adoption ROI, digital transformation, ERP implementations, and technology strategy. Candidates who can frame a technology decision as a business case with quantified assumptions score significantly higher than those who treat it as a purely strategic or operational problem.",
      whatStrongLooksLike: [
        "Frames technology decisions as business cases: 'The cloud migration ROI is positive if annual savings exceed €X'",
        "Connects digital transformation to specific business outcomes, not just technology capability",
        "Understands the implementation reality of technology projects: change management, adoption risk, legacy system constraints",
        "Commercial awareness across Accenture's core sectors: financial services, healthcare, technology, retail, public sector",
        "Recognizes where AI/digital can create genuine value versus where it is overhyped",
        "Practical judgment: recommends what can actually be done, not just what is theoretically optimal",
      ],
      whatWeakLooksLike: [
        "Treats digital/tech cases as generic strategy cases without technology-specific insight",
        "Cannot quantify the business impact of a technology decision",
        "No awareness of implementation risk in digital transformation projects",
        "Generic recommendations disconnected from the client's technology context",
      ],
      scoringCriteria: {
        1: "No business judgment. Cannot connect technology decisions to business outcomes.",
        2: "Generic business judgment with no digital awareness. Treats tech cases like strategy cases.",
        3: "Solid business judgment. Some digital awareness. Can frame technology decisions as business cases.",
        4: "Strong commercial and digital judgment. Quantifies technology ROI. Aware of implementation reality.",
        5: "Exceptional. Thinks exactly like an Accenture partner — commercial, digital, and pragmatic simultaneously.",
      },
      dealbreaker: false,
    },
    {
      key: "quantitative",
      label: "Quantitative Ability",
      weight: 15,
      accentureNote: "Accenture's fourth explicitly named core skill. Back of the Envelope is a unique Accenture case format that specifically tests estimation under pressure: market sizing, cost-benefit calculations, adoption rate estimates. Accenture consulting roles require working with numbers in front of clients and executives — this is explicitly non-negotiable per their own materials. The standard is not MBB-level precision but rather confident estimation with clear methodology.",
      whatStrongLooksLike: [
        "Back of the Envelope: confident estimation with stated assumptions and clear methodology",
        "Fast, accurate mental math with narration",
        "For technology cases: estimates cloud migration costs, AI implementation ROI, digital adoption rates",
        "Sanity-checks results against business reality",
        "Makes sensible assumptions when data is missing",
        "Translates every number into a business implication",
      ],
      whatWeakLooksLike: [
        "Cannot estimate without being given all the data",
        "Math errors in Back of the Envelope exercises",
        "Cannot quantify the business impact of recommendations",
        "Correct numbers but no business interpretation",
      ],
      scoringCriteria: {
        1: "Cannot perform estimation or basic calculations. Paralyzed without data.",
        2: "Limited quantitative ability. Struggles with Back of the Envelope. Some errors.",
        3: "Competent quantitative work. Handles estimation adequately. Some business interpretation.",
        4: "Strong quantitative ability. Fast, accurate estimation with methodology stated. Strong business connection.",
        5: "Exceptional. Back of the Envelope feels effortless. Every number immediately connected to a business decision.",
      },
      dealbreaker: false,
    },
    {
      key: "communicationPresence",
      label: "Communication & Executive Presence",
      weight: 15,
      accentureNote: "Accenture explicitly names both communication AND executive presence as core skills — making this dimension more demanding than at other firms where communication alone is scored. Executive presence at Accenture means: would a Fortune 500 CEO or CIO trust this person's advice? Accenture serves the largest companies in the world on their most complex transformations. The communication standard must reflect that. Executive presence is also evaluated in behavioral interviews where interviewers check: leadership, impact, and how you carry yourself under pressure.",
      whatStrongLooksLike: [
        "Conclusion-first: 'My recommendation is X because...'",
        "Executive presence: confident, calm, and authoritative without being arrogant",
        "Would feel natural presenting to a Fortune 500 CEO or CIO",
        "Concise and structured under pressure",
        "Engages the interviewer as a thought partner",
        "Handles pushback without collapsing or becoming defensive",
      ],
      whatWeakLooksLike: [
        "Cannot project confidence in front of a senior executive",
        "Buries conclusions or rambles",
        "Collapses under pushback",
        "Too casual or too stiff — cannot calibrate to the executive context",
        "Lacks the gravitas to be trusted with a major transformation project",
      ],
      scoringCriteria: {
        1: "No executive presence. Cannot project confidence. Would not be trusted by a senior client.",
        2: "Some communication skill but lacks executive presence. Buries conclusions or collapses under pressure.",
        3: "Meets the bar. Clear communication. Adequate executive presence. Would work with most clients.",
        4: "Strong communication and executive presence. Would be trusted by a Fortune 500 executive.",
        5: "Exceptional. The kind of presence that makes clients immediately trust Accenture's recommendations.",
      },
      dealbreaker: false,
    },
    {
      key: "collaboration",
      label: "Collaboration & Group Case Leadership",
      weight: 10,
      accentureNote: "Group cases are standard at Accenture (virtually absent at MBB) and explicitly scored. 4-6 candidates collaborate on a shared consulting problem. Accenture assessors evaluate two dimensions simultaneously: your individual analytical contribution AND how you work within the team. The scoring criteria: clarity of contribution (do your points advance the group's thinking?), synthesis (can you integrate others' ideas?), and leadership (can you redirect the group when off-track without dominating?). The most common failure: presenting the most ideas without building on what others said.",
      whatStrongLooksLike: [
        "Builds explicitly on others' ideas rather than just adding new points",
        "Redirects the group when discussion gets off-track",
        "Synthesizes across the group at key moments: 'The core issue we're aligning on is...'",
        "Consistent contribution throughout — not just an impressive opening",
        "Facilitates a recommendation even when the group disagrees",
        "Credits others explicitly — noted by assessors",
      ],
      whatWeakLooksLike: [
        "Presents the most ideas without building on others",
        "Says 'great point' repeatedly without substantive contribution",
        "Dominates then disengages",
        "Silent during key synthesis moments",
        "Treats the group case as a competition rather than a collaboration",
      ],
      scoringCriteria: {
        1: "Cannot collaborate. Dominates or goes silent. No synthesis contribution.",
        2: "Below bar. Either dominates without building on others or validates without contributing.",
        3: "Good collaborator. Builds on others occasionally. Contributes consistently.",
        4: "Strong group case performance. Advances group thinking. Synthesizes effectively. Credits others.",
        5: "Exceptional. The natural leader and synthesizer of the group. Assessors would immediately note this candidate.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: {
    offerThreshold: 55,
    hardFloorDimensions: [],
    hardFloorScore: 2,
    excellenceDimensionsRequired: 2,
    excellenceScore: 4,
    disqualifierScore: 1,
  },
};

export function calculateAccentureOffer(scores: Record<string, number>): {
  decision: string;
  label: string;
  description: string;
  weightedScore: number;
} {
  const dims = ACCENTURE_RUBRIC.dimensions;

  // Check disqualifiers
  const disqualifyingDim = dims.find(d => scores[d.key] <= 1);
  if (disqualifyingDim) {
    return {
      decision: "disqualified",
      label: "No Offer",
      description: `A score of 1 on ${disqualifyingDim.label} is disqualifying at Accenture. This is the highest-priority area to develop before your next interview.`,
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
      description: `Below the Accenture bar. ${belowFloor.label} must reach at least a 2. Focus on this before your next interview.`,
      weightedScore: Math.round(weightedScore),
    };
  }

  const excellentDims = dims.filter(d => scores[d.key] >= ACCENTURE_RUBRIC.offerDecision.excellenceScore).length;
  const threshold = ACCENTURE_RUBRIC.offerDecision.offerThreshold;

  if (weightedScore >= 82 && excellentDims >= 3) {
    return {
      decision: "strong_offer",
      label: "Strong Offer",
      description: "Exceptional performance. Accenture would extend a strong offer. You demonstrated the rare combination of MECE structured thinking, digital business judgment, executive presence, and collaborative group case leadership that Accenture's global transformation practice requires. Top 5% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= threshold && excellentDims >= ACCENTURE_RUBRIC.offerDecision.excellenceDimensionsRequired) {
    return {
      decision: "offer",
      label: "Offer",
      description: "Above the Accenture bar. An offer would likely be extended. You showed solid structured thinking, business judgment with digital awareness, and the executive presence Accenture looks for. Top 15-20% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= 38) {
    return {
      decision: "borderline",
      label: "Borderline — No Offer",
      description: "Close to the Accenture bar but not over it. The most common gap at this level is digital business judgment and executive presence — candidates who are analytically solid but treat technology cases like pure strategy problems or lack the gravitas for senior client interactions. Build digital transformation fluency and practice projecting executive confidence.",
      weightedScore: Math.round(weightedScore),
    };
  }

  return {
    decision: "no_offer",
    label: "No Offer",
    description: "Below the Accenture bar. Focus first on structured thinking (practice Great Unknown and Parade of Facts case formats) and digital business judgment (learn to frame technology decisions as quantified business cases). Accenture's acceptance rate is ~6% — more accessible than most firms we evaluate, and most candidates clear the bar within 8-12 targeted cases.",
    weightedScore: Math.round(weightedScore),
  };
}