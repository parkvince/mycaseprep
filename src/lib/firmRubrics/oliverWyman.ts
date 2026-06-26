export const OLIVER_WYMAN_RUBRIC = {
  firm: "oliver-wyman",
  firmFullName: "Oliver Wyman",
  format: "candidate-led with written case component",
  interviewDuration: "30-45 minutes per case",
  offerRate: "Approximately 1-3% of applicants. Vault Top 10 prestige, comparable to MBB selectivity.",

  dimensions: [
    {
      key: "structure",
      label: "Structured Thinking & Framework Design",
      weight: 23,
      owNote: "Oliver Wyman uses a fully candidate-led format identical to BCG and Bain. You must drive the entire case independently. OW's financial services heritage means cases frequently involve regulatory capital, revenue strategy, insurance pricing, or digital banking — your structure must reflect sector-specific logic, not generic frameworks. OW explicitly evaluates whether your framework reflects genuine understanding of the business problem.",
      whatStrongLooksLike: [
        "Builds a MECE structure independently from the first minute",
        "For financial services cases: structures around revenue levers, cost structure, risk/capital, and regulatory constraints",
        "For insurance cases: structures around pricing, distribution, claims, and underwriting",
        "For digital banking cases: structures around customer acquisition, unit economics, and technology feasibility",
        "Prioritizes branches based on sector context",
        "Adapts cleanly when evidence redirects the analysis",
      ],
      whatWeakLooksLike: [
        "Generic profitability/market entry framework without financial services context",
        "Waits for interviewer direction",
        "Structure that could apply to any industry regardless of the case",
        "No prioritization among branches",
      ],
      scoringCriteria: {
        1: "No structure. Cannot frame a financial services problem. Waits for direction.",
        2: "Generic framework not adapted to the financial services context. No prioritization. Partially passive.",
        3: "Clear candidate-led structure. Some sector adaptation. Reasonable prioritization.",
        4: "Strong, sector-specific structure. Fully independent. Adapts well with new information.",
        5: "Exceptional. The structure immediately signals deep familiarity with financial services business logic.",
      },
      dealbreaker: false,
    },
    {
      key: "financialServicesKnowledge",
      label: "Financial Services & Sector Expertise",
      weight: 22,
      owNote: "Oliver Wyman's most distinctive dimension — no other Tier 2 firm matches OW's financial services depth. Their cases frequently involve banking capital allocation, insurance pricing dynamics, asset management strategy, and fintech disruption. Candidates who demonstrate genuine sector fluency — not just generic business knowledge — score significantly higher. OW's three core values (Courage, Curiosity, Passion) are reflected in how they evaluate intellectual engagement with the sector.",
      whatStrongLooksLike: [
        "For banking cases: understands net interest margins, regulatory capital requirements, credit risk dynamics",
        "For insurance cases: understands combined ratios, underwriting cycles, claims reserves",
        "For asset management cases: understands fee compression, AUM dynamics, distribution economics",
        "For fintech cases: understands unit economics, customer acquisition costs, payment economics",
        "Shows genuine intellectual curiosity about the financial services sector",
        "Asks questions that demonstrate sector awareness, not just general business curiosity",
      ],
      whatWeakLooksLike: [
        "Treats a banking case like a generic profitability case with no financial services knowledge",
        "Cannot explain what net interest margin, combined ratio, or AUM mean",
        "No genuine curiosity about the sector — just going through framework motions",
      ],
      scoringCriteria: {
        1: "No financial services knowledge. Cannot engage with sector-specific case content.",
        2: "Basic business knowledge but no financial services fluency. Generic analysis.",
        3: "Adequate sector knowledge. Understands main financial services business models.",
        4: "Strong financial services fluency. Engages confidently with sector-specific metrics and dynamics.",
        5: "Exceptional. The candidate would be credible in front of an OW financial services client on day one.",
      },
      dealbreaker: false,
    },
    {
      key: "quantitative",
      label: "Analytical Execution & Quantitative Rigor",
      weight: 22,
      owNote: "OW's written case (final round) tests quantitative rigor explicitly — candidates receive a 30-minute deck of financial data and must analyze it independently before presenting. Even in verbal cases, OW places high emphasis on quantitative precision. Financial services cases frequently involve complex multi-step calculations: ROE analysis, break-even modeling, revenue per customer math, insurance loss ratios. OW interviewers care about methodology as much as the answer.",
      whatStrongLooksLike: [
        "States approach before calculating: 'I'll analyze this as net revenue minus loss ratio...'",
        "For written case: quickly identifies which data in the deck is relevant and which is noise",
        "Handles financial calculations fluently: ROE, margins, break-even, loss ratios",
        "Narrates methodology clearly so the interviewer can follow",
        "Sanity-checks against sector benchmarks: 'A 15% ROE for a retail bank is above average...'",
      ],
      whatWeakLooksLike: [
        "Math errors that undermine the financial analysis",
        "Cannot handle sector-specific financial calculations",
        "In written case: reads all the data rather than identifying what matters",
        "Right numbers but no sector-specific business interpretation",
      ],
      scoringCriteria: {
        1: "Cannot perform financial calculations or engage with sector-specific data.",
        2: "Some quantitative ability but errors present. Missing financial services calculation fluency.",
        3: "Solid quantitative work. Handles standard financial calculations correctly.",
        4: "Strong. Fast, accurate, narrated math with sector-specific interpretation.",
        5: "Exceptional. Written case and verbal case math are both handled with consulting-level precision.",
      },
      dealbreaker: true,
    },
    {
      key: "communication",
      label: "Communication & Conversational Interview",
      weight: 18,
      owNote: "OW uses 'conversational interviews' alongside case interviews — a format unique to the firm. This is a behavioral + intellectual discussion that evaluates how you engage in professional dialogue. OW's Curiosity value is directly tested here: do you ask thoughtful follow-up questions? Do you engage with intellectual depth on topics outside your direct experience? Communication at OW must be both analytically precise and genuinely engaging.",
      whatStrongLooksLike: [
        "Conclusion-first delivery: 'My recommendation is X because...'",
        "In conversational interview: genuinely curious intellectual engagement, not performance",
        "Asks follow-up questions that show real interest in the business problem",
        "Holds position under pushback with evidence: 'The data suggests X because...'",
        "Natural and confident, not rehearsed",
      ],
      whatWeakLooksLike: [
        "Buries conclusions or goes silent without narrating thought process",
        "In conversational interview: generic answers with no intellectual engagement",
        "Cannot engage with topics outside the immediate case prompt",
        "Defensive under pushback",
      ],
      scoringCriteria: {
        1: "Cannot communicate analysis clearly. Conversational interview feels scripted or evasive.",
        2: "Communicates but buries conclusions. Conversational interview is generic.",
        3: "Clear delivery. Adequate conversational engagement. Holds position reasonably.",
        4: "Strong. Conclusion-first, intellectually engaged. Conversational interview shows genuine curiosity.",
        5: "Exceptional. The interviewer wants to keep talking. Courage, Curiosity, and Passion are all evident.",
      },
      dealbreaker: false,
    },
    {
      key: "writtenCase",
      label: "Written Case Quality & Synthesis",
      weight: 15,
      owNote: "Oliver Wyman's final round includes a written case: candidates receive a financial services data package, analyze it independently for ~30 minutes, then present findings to the interviewer. This tests slide-based communication, data synthesis under time pressure, and the ability to build a coherent narrative from financial data. The written case is often the final gate — candidates who pass verbal cases but struggle with written synthesis do not get offers.",
      whatStrongLooksLike: [
        "Reads the questions before diving into the data — focuses only on relevant exhibits",
        "Recommendation stated in one sentence before presenting evidence",
        "Synthesizes across multiple data sources rather than summarizing each exhibit separately",
        "Handles the financial data with sector fluency",
        "Presents crisply in the time available — does not try to cover everything",
      ],
      whatWeakLooksLike: [
        "Reads all data before identifying what questions need to be answered",
        "Summary of exhibits rather than synthesis into a recommendation",
        "Recommendation buried at the end rather than leading",
        "Cannot finish within the time limit",
      ],
      scoringCriteria: {
        1: "Cannot synthesize financial data into a coherent recommendation.",
        2: "Basic synthesis but summarizes rather than integrates. Recommendation unclear.",
        3: "Adequate written case. Recommendation stated. Main data points used.",
        4: "Strong. Recommendation-first. Well-synthesized across exhibits. Delivered crisply.",
        5: "Exceptional. The written case output looks like something a senior OW consultant would hand to a client.",
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

export function calculateOliverWymanOffer(scores: Record<string, number>): {
  decision: string; label: string; description: string; weightedScore: number;
} {
  const dims = OLIVER_WYMAN_RUBRIC.dimensions;

  for (const dim of dims) {
    if ((dim as any).dealbreaker && scores[dim.key] <= 1) {
      return { decision: "disqualified", label: "No Offer", description: "Automatically disqualified. Quantitative rigor is non-negotiable at Oliver Wyman given the financial services case intensity. Focus on financial calculations and written case synthesis before your next OW interview.", weightedScore: 0 };
    }
  }

  const other = dims.find(d => !(d as any).dealbreaker && scores[d.key] <= 1);
  if (other) return { decision: "disqualified", label: "No Offer", description: `A score of 1 on ${other.label} is disqualifying at Oliver Wyman.`, weightedScore: 0 };

  let weightedScore = 0;
  for (const d of dims) { const s = scores[d.key] ?? 1; weightedScore += (((s - 1) / 4) * 100 * d.weight) / 100; }

  if (scores["quantitative"] < 3) return { decision: "no_offer", label: "No Offer", description: "Below the OW bar. Quantitative and written case rigor must reach at least a 3. Financial services cases at OW require fluency with sector-specific calculations and data synthesis.", weightedScore: Math.round(weightedScore) };

  const exc = dims.filter(d => scores[d.key] >= 4).length;
  if (weightedScore >= 84 && exc >= 3) return { decision: "strong_offer", label: "Strong Offer", description: "Exceptional performance. Oliver Wyman would extend a strong offer. You demonstrated MBB-level case rigor, genuine financial services sector fluency, and the intellectual curiosity that OW's culture is built on. Top 5% of interview-stage candidates.", weightedScore: Math.round(weightedScore) };
  if (weightedScore >= 65 && exc >= 2) return { decision: "offer", label: "Offer", description: "Above the Oliver Wyman bar. An offer would likely be extended. You showed sector-specific analytical depth and the conversational engagement that OW's Courage, Curiosity, Passion values demand. Top 10-15% of interview-stage candidates.", weightedScore: Math.round(weightedScore) };
  if (weightedScore >= 48) return { decision: "borderline", label: "Borderline — No Offer", description: "Close to the OW bar. The most common gap: financial services sector knowledge and written case synthesis. Deepen your familiarity with banking, insurance, and capital markets business models before your next interview.", weightedScore: Math.round(weightedScore) };
  return { decision: "no_offer", label: "No Offer", description: "Below the Oliver Wyman bar. Focus on financial services sector knowledge and written case synthesis. OW's 1-3% offer rate reflects MBB-adjacent rigor — most candidates need 12-20 cases before consistently clearing the bar.", weightedScore: Math.round(weightedScore) };
}