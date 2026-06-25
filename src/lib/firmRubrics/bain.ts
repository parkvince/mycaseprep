export const BAIN_RUBRIC = {
  firm: "bain",
  firmFullName: "Bain & Company",
  format: "candidate-led with collaborative interviewer",
  interviewDuration: "25-35 minutes per case",
  offerRate: "Approximately 1% of all applicants. Roughly 10-12% of interview-stage candidates.",

  scoringScale: {
    1: "Insufficient — Below minimum standard. Would not be effective with Bain clients.",
    2: "Adequate — Below the Bain hiring bar. Shows potential but not ready.",
    3: "Good — Meets the Bain bar. Would represent the firm well.",
    4: "Very Good — Strong Bainie. Above the bar with clear strengths.",
    5: "Exceptional — The kind of candidate Bain builds teams around.",
  },

  dimensions: [
    {
      key: "answerFirst",
      label: "Answer First & Hypothesis-Driven Thinking",
      weight: 22,
      bainNote: "Bain's defining cultural principle is 'Answer First.' This is not optional at Bain — it is the core of how Bain consultants communicate with clients. From the first moment of the case, Bain wants to hear your initial hypothesis stated clearly and confidently. Candidates who build slowly to a conclusion, or who explore without a stated point of view, score poorly on this dimension regardless of how good their eventual answer is.",
      whatStrongLooksLike: [
        "States an initial hypothesis within the first 2 minutes: 'My hypothesis is that the profit decline is driven by cost structure, not revenue, because...'",
        "For yes/no cases: gives a clear directional answer upfront — 'My initial read is yes, they should enter'",
        "Uses the hypothesis to guide the entire analysis: every question asked ties back to proving or disproving it",
        "Updates the hypothesis explicitly when data contradicts it: 'This data actually challenges my initial view — let me revise'",
        "Conclusion at the end mirrors or extends the opening hypothesis",
      ],
      whatWeakLooksLike: [
        "Explores data without stating a hypothesis — 'let me look at revenues first...' without a point of view",
        "Builds to the answer: presents findings before conclusion",
        "Never commits to a view — answers are perpetually 'it depends'",
        "Hypothesis is so vague it is unfalsifiable: 'There might be cost or revenue issues'",
      ],
      scoringCriteria: {
        1: "No hypothesis at any point. Explores randomly. Cannot state a clear view on the case.",
        2: "Vague or absent hypothesis. Does not use it to guide the analysis. Builds slowly to conclusion.",
        3: "Clear initial hypothesis. Uses it to guide most of the analysis. Updates appropriately.",
        4: "Strong Answer First delivery. Hypothesis is specific and directional. Guides every step. Updates explicitly.",
        5: "Exceptional. Hypothesis is precise, confident, and correct in direction. The whole case flows from it. Every update is explicitly reasoned.",
      },
      dealbreaker: false,
    },
    {
      key: "structure",
      label: "Structured Thinking & Problem Decomposition",
      weight: 18,
      bainNote: "Bain's structure standard is somewhat more flexible than McKinsey's. Bain cares that your thinking is organized and clear — but they care less about perfect MECE than McKinsey does. A slightly incomplete structure delivered with confidence and clear prioritization will score higher at Bain than a perfectly MECE structure delivered mechanically. The 'Bainie' standard: would this structure help a client CEO understand the problem?",
      whatStrongLooksLike: [
        "Clear logical decomposition of the problem",
        "Explicit prioritization: 'I'll start here because this is most likely to be the driver'",
        "Structure evolves as evidence comes in — not rigidly followed",
        "Makes the complex simple: CEO-friendly framing",
        "Acknowledges what the structure does not cover and why that is acceptable",
      ],
      whatWeakLooksLike: [
        "Disorganized thinking: jumps between topics",
        "Rigid adherence to initial structure even when evidence points elsewhere",
        "Structure that is theoretically MECE but practically useless for this case",
        "No sense of prioritization within the structure",
      ],
      scoringCriteria: {
        1: "No structure. Thinking is disorganized and the interviewer cannot follow the logic.",
        2: "Basic structure but no prioritization. Rigid. Not adapted to the case.",
        3: "Clear structure with some prioritization. Mostly followed. Minor gaps.",
        4: "Strong structure with clear prioritization and case adaptation. CEO-friendly.",
        5: "Exceptional. Perfect balance of rigor and practicality. A client CEO would immediately understand the approach.",
      },
      dealbreaker: false,
    },
    {
      key: "quantitative",
      label: "Quantitative & Financial Analysis",
      weight: 18,
      bainNote: "Bain's quantitative standard reflects their private equity heritage. PE/financial cases appear more frequently at Bain than at McKinsey or BCG — expect valuations, EBITDA multiples, IRR calculations, and margin analysis. 'Quick math' is a direct quote from Bain's interview prep page. Speed and accuracy both matter, but the business interpretation of the result is equally important.",
      whatStrongLooksLike: [
        "Fast, accurate mental math with methodology stated upfront",
        "Handles PE-style calculations: EBITDA multiples, valuations, returns",
        "Interprets every number in business context: 'That's a 6x EBITDA multiple, which is below market for this sector'",
        "Makes sensible assumptions and states them clearly",
        "Sanity-checks results against business reality",
      ],
      whatWeakLooksLike: [
        "Slow calculations that consume disproportionate time",
        "Math errors that cascade into wrong conclusions",
        "Cannot handle PE/financial math (EBITDA, multiples, IRR)",
        "Right number but no business interpretation",
        "Assumptions that are obviously unrealistic with no acknowledgment",
      ],
      scoringCriteria: {
        1: "Cannot set up basic calculations. Multiple errors. No business interpretation.",
        2: "Some math errors. Slow. Missing financial case fluency. Limited interpretation.",
        3: "Correct on most calculations. Adequate speed. Basic business interpretation.",
        4: "Fast, accurate, narrated. Handles financial cases well. Strong business interpretation.",
        5: "Exceptional speed and precision. Financial case fluency. Every number connected to a business implication.",
      },
      dealbreaker: false,
    },
    {
      key: "communication",
      label: "Communication & Composure",
      weight: 22,
      bainNote: "Communication is weighted higher at Bain than at McKinsey or BCG. Bain's published interview guidance explicitly emphasizes making 'sensible assumptions, doing quick math, and building constructively on others' ideas' — the third element is communication. Bain interviewers care deeply about whether you would be effective in a real client conversation with a CEO. The 'Bainie' communication style: confident but not arrogant, direct but collaborative, composed under pressure.",
      whatStrongLooksLike: [
        "Answer First delivery: conclusion stated first, then supporting logic",
        "Composed under pushback: 'That's a fair challenge — let me think through that'",
        "Collaborative rather than performative: treats it as a dialogue, not a presentation",
        "Concise: respects the interviewer's time",
        "Confident enough to maintain a position when pushed, flexible enough to update when shown new evidence",
        "Natural, conversational delivery — not rehearsed",
      ],
      whatWeakLooksLike: [
        "Builds to the answer rather than leading with it",
        "Defensive under pushback: doubles down without engaging with the challenge",
        "Collapses under pressure: immediately abandons position when challenged",
        "Robotic or rehearsed delivery that feels like a recitation",
        "Verbose: buries the conclusion in a wall of words",
        "Passive hedging: 'I guess maybe it could possibly be...'",
      ],
      scoringCriteria: {
        1: "Cannot communicate clearly under pressure. Collapses when challenged. Interviewer cannot follow the logic.",
        2: "Communicates but buries conclusions. Defensive or collapses under pushback. Feels rehearsed.",
        3: "Clear, generally bottom-line first. Holds position reasonably under pressure. Natural enough.",
        4: "Strong Answer First delivery. Composed and collaborative under pushback. Would work with a client CEO.",
        5: "Exceptional. The interview feels like a real conversation with a senior consultant. Perfect composure. Confident, direct, and genuinely collaborative.",
      },
      dealbreaker: true,
    },
    {
      key: "culturalFit",
      label: "Cultural Fit & The Bainie Factor",
      weight: 15,
      bainNote: "This dimension is unique to Bain in the MBB context. Bain explicitly screens for cultural fit as part of the case process — not just in the PEI. Bain wants 'smart, nice, and get things done.' The 'nice' part is real: Bain interviewers notice whether they would want to work with you on a long engagement. Intellectual arrogance, a competitive rather than collaborative style, or a lack of genuine enthusiasm for the problem will score poorly here even with technically correct answers.",
      whatStrongLooksLike: [
        "Genuine intellectual curiosity about the case problem",
        "Treats the interviewer as a thought partner, not an evaluator to impress",
        "Acknowledges mistakes or gaps openly: 'I should have caught that earlier'",
        "Shows humility when wrong, confidence when right",
        "Energy and enthusiasm that are genuine, not performed",
        "Asks thoughtful questions that show real interest in the problem",
      ],
      whatWeakLooksLike: [
        "Intellectual arrogance: dismisses interviewer hints",
        "Performs rather than collaborates: treats it as a solo presentation",
        "Generic enthusiasm that applies to any firm",
        "Does not acknowledge mistakes or course-corrections",
        "Cold or transactional energy — optimizing for the offer rather than engaging with the problem",
      ],
      scoringCriteria: {
        1: "Would not fit the Bain culture. Arrogant, transactional, or disengaged.",
        2: "Adequate but would not stand out as a Bainie. Generic. Slightly cold.",
        3: "Good cultural fit. Collaborative and genuine. Would work well in a Bain team.",
        4: "Strong Bainie energy. Genuine curiosity, humility, and collaborative instinct.",
        5: "Exceptional. The interviewer would actively advocate for this candidate in the debrief. Smart, nice, and clearly gets things done.",
      },
      dealbreaker: false,
    },
    {
      key: "synthesis",
      label: "Synthesis & Actionable Recommendation",
      weight: 5,
      bainNote: "Bain's 'results, not reports' culture means the final recommendation must be actionable and specific. Bain interviewers dislike abstract or theoretical conclusions — they want to know exactly what the client should do next week. The recommendation should connect back to the hypothesis stated at the beginning of the case.",
      whatStrongLooksLike: [
        "Answer First: recommendation stated in the first sentence",
        "Specific and actionable: tells the client what to do this quarter",
        "Connects back to opening hypothesis: 'As I hypothesized at the start...'",
        "Acknowledges key risks and suggests how to manage them",
        "Proposes concrete next steps",
      ],
      whatWeakLooksLike: [
        "Vague or hedged: 'They should consider possibly exploring...'",
        "Theoretical rather than actionable: 'The company needs to improve profitability'",
        "Does not connect back to the opening hypothesis",
        "Rushed because time ran out",
      ],
      scoringCriteria: {
        1: "No recommendation or completely disconnected from the analysis.",
        2: "Vague recommendation. No specifics. Not actionable. Heavily hedged.",
        3: "Clear recommendation with basic rationale. Actionable but missing specifics or risks.",
        4: "Strong, specific, actionable recommendation. Connects to hypothesis. Risks acknowledged.",
        5: "Exceptional. Quantified. Connects opening hypothesis to closing recommendation. Next steps are concrete and sequenced.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: {
    offerThreshold: 68,
    hardFloorDimensions: ["communication"],
    hardFloorScore: 3,
    excellenceDimensionsRequired: 2,
    excellenceScore: 4,
    disqualifierScore: 1,
  },
};

export function calculateBainOffer(scores: Record<string, number>): {
  decision: string;
  label: string;
  description: string;
  weightedScore: number;
} {
  const dims = BAIN_RUBRIC.dimensions;

  // Check disqualifiers
  for (const dim of dims) {
    if (dim.dealbreaker && scores[dim.key] <= 1) {
      return {
        decision: "disqualified",
        label: "No Offer",
        description: "Automatically disqualified. Communication is Bain's most client-facing skill — a score of 1 means you would not be effective in a client conversation. This is the highest-priority area to develop before your next Bain interview.",
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

  // Communication hard floor
  if (scores["communication"] < BAIN_RUBRIC.offerDecision.hardFloorScore) {
    return {
      decision: "no_offer",
      label: "No Offer",
      description: "Below the Bain bar. Communication must reach at least a 3 — Bain will not hire someone who cannot represent them in front of a client CEO. Focus on Answer First delivery and composure under pushback before your next case.",
      weightedScore: Math.round(weightedScore),
    };
  }

  // Cultural fit check — Bain-specific minimum
  if (scores["culturalFit"] <= 1) {
    return {
      decision: "no_offer",
      label: "No Offer",
      description: "Below the Bain bar. Cultural fit is explicitly evaluated at Bain and a score of 1 signals a fundamental mismatch with Bain's collaborative, humble culture. Bain wants 'smart, nice, and get things done' — all three matter equally.",
      weightedScore: Math.round(weightedScore),
    };
  }

  const excellentDims = dims.filter(d => scores[d.key] >= BAIN_RUBRIC.offerDecision.excellenceScore).length;
  const threshold = BAIN_RUBRIC.offerDecision.offerThreshold;

  if (weightedScore >= 86 && excellentDims >= 3) {
    return {
      decision: "strong_offer",
      label: "Strong Offer",
      description: "Exceptional performance. Bain would extend a strong offer and likely fast-track you. You demonstrated everything Bain looks for: Answer First thinking, composure under pressure, quantitative fluency, and the genuine collaborative energy that defines the Bainie culture. Top 5% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= threshold && excellentDims >= BAIN_RUBRIC.offerDecision.excellenceDimensionsRequired) {
    return {
      decision: "offer",
      label: "Offer",
      description: "Above the Bain hiring bar. An offer would likely be extended. You showed the Answer First thinking, composure, and collaborative instinct that Bain values. Top 10-12% of interview-stage candidates.",
      weightedScore: Math.round(weightedScore),
    };
  }

  if (weightedScore >= 55) {
    return {
      decision: "borderline",
      label: "Borderline — No Offer",
      description: "Close to the Bain bar but not over it. The most common gap at this level is communication and the Bainie factor — candidates who are analytically solid but feel transactional or rehearsed. Bain's interviewers decide based partly on 'would I want this person on my team for 6 months?' Work on genuine collaborative energy and Answer First delivery.",
      weightedScore: Math.round(weightedScore),
    };
  }

  return {
    decision: "no_offer",
    label: "No Offer",
    description: "Below the Bain hiring bar. Focus first on Answer First communication and composure under pressure — these are Bain's most weighted dimensions. Most candidates need 15-20 cases before consistently meeting the Bain standard. The good news: Bain's bar on structure is more forgiving than McKinsey's, so improvement tends to come faster here.",
    weightedScore: Math.round(weightedScore),
  };
}