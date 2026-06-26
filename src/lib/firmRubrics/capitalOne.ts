export const CAPITAL_ONE_RUBRIC = {
  firm: "capital-one",
  firmFullName: "Capital One",
  format: "interviewer-led with heavy quantitative emphasis — calculator allowed",
  interviewDuration: "30-60 minutes per case, Power Day has 2-3 cases",
  offerRate: "Selective but more accessible than pure strategy consulting firms. Highly competitive for Business Analyst roles.",

  dimensions: [
    {
      key: "logicalStructure",
      label: "Logical & Structured Thinking",
      weight: 22,
      c1Note: "Capital One evaluates four key criteria explicitly. Logical and structured thinking is the first. Capital One's format is INTERVIEWER-LED — the interviewer controls the flow, giving you specific data and directed prompts. 'Given this table, what is the break-even volume?' — not 'structure the problem and tell me what information you need.' Strong frameworks and issue trees have limited value; precise execution of the calculation the interviewer is pointing at is what gets evaluated. Capital One was built on information-based strategy — data-driven thinking from the first moment.",
      scoringCriteria: {
        1: "Cannot organize thinking logically when given directed prompts.",
        2: "Some logical structure but gets lost in multi-step directed problems.",
        3: "Clear logical thinking. Responds well to directed prompts. Systematic approach.",
        4: "Strong. Immediately organizes each directed problem. Never loses the thread.",
        5: "Exceptional. Every directed prompt is approached with the precision of a Capital One data analyst.",
      },
      dealbreaker: false,
    },
    {
      key: "quantitative",
      label: "Quantitative Skills & Financial Math",
      weight: 30,
      c1Note: "Capital One's most heavily weighted dimension — explicitly named as 'the most heavily weighted factor' in their evaluation. Calculator is allowed. Cases are math-intensive: break-even calculations, profitability analysis, credit card economics, loan portfolio math, and financial product ROI. 'Success hinges on correctly translating the business scenario into the right equations' — not just arithmetic accuracy but conceptual translation. Credit card economics appear with increased frequency since the $35.3B Discover acquisition in May 2025.",
      whatStrongLooksLike: [
        "Correctly translates business scenario into the right equation before calculating",
        "For credit card cases: understands interchange fees, interest income, annual fee economics, charge-off rates",
        "For loan cases: understands default rates, LTV, net interest margin, credit risk economics",
        "For profitability cases: sets up the break-even equation cleanly before using the calculator",
        "States approach before calculating: 'I'll solve this as revenue per customer minus cost per customer...'",
        "Sanity-checks results: 'A 15% ROI in year 1 seems high — let me verify the assumptions'",
      ],
      whatWeakLooksLike: [
        "Cannot translate the business scenario into the right equation",
        "Calculator errors or wrong equation setup",
        "No knowledge of credit card or consumer lending economics",
        "Right answer but no narration of methodology",
      ],
      scoringCriteria: {
        1: "Cannot set up financial calculations. Equation translation fails. No financial product knowledge.",
        2: "Some quantitative ability but equation setup is wrong or financial product knowledge is absent.",
        3: "Solid. Sets up equations correctly. Basic credit card and loan economics understood.",
        4: "Strong. Fast, accurate, narrated. Financial product economics fluent. Break-even and ROI handled confidently.",
        5: "Exceptional. The quantitative precision mirrors what Capital One expects from its Business Analysts on day one.",
      },
      dealbreaker: true,
    },
    {
      key: "businessJudgment",
      label: "Business Judgment & Financial Services Context",
      weight: 23,
      c1Note: "Capital One is not a traditional bank — it was built as a data and analytics company that happens to be in financial services. Business judgment at Capital One requires understanding consumer credit economics, financial product profitability, customer segmentation logic, and operational efficiency. The Discover acquisition (May 2025) expanded Capital One's credit card portfolio significantly — credit card economics are now even more prominent in cases.",
      scoringCriteria: {
        1: "No financial services business judgment. Cannot contextualize numbers in consumer credit.",
        2: "Generic business judgment with no consumer financial services context.",
        3: "Solid judgment. Understands basic consumer credit economics and product profitability.",
        4: "Strong. Financial services business judgment connects quantitative findings to strategic implications.",
        5: "Exceptional. Business judgment reflects a genuine understanding of Capital One's data-driven competitive advantage.",
      },
      dealbreaker: false,
    },
    {
      key: "communication",
      label: "Communication & Structured Explanation",
      weight: 15,
      c1Note: "Capital One explicitly names communication as a core evaluation criterion: 'your ability to explain complex concepts clearly, structure verbal responses logically, and maintain engagement during lengthy analytical discussions. Strong candidates think aloud effectively, making their reasoning process transparent to interviewers.' In the Power Day product interview, communication extends to presenting data-driven product decisions to cross-functional stakeholders.",
      scoringCriteria: {
        1: "Cannot communicate quantitative reasoning clearly. Interviewer cannot follow the methodology.",
        2: "Communicates but buries the approach. Hard to follow multi-step calculations.",
        3: "Clear. Thinks aloud effectively. Methodology transparent.",
        4: "Strong. Narrates every calculation. Conclusions stated first. Product interview is compelling.",
        5: "Exceptional. The Capital One team would trust this analyst in front of a product or business stakeholder.",
      },
      dealbreaker: false,
    },
    {
      key: "valuesAlignment",
      label: "ARES Values Alignment",
      weight: 10,
      c1Note: "Capital One's behavioral interview evaluates the ARES framework: Excellence (high-quality work under constraint), Do the Right Thing (ethical decision-making, integrity), Respect for Individuals (inclusive collaboration, listening), and Succeed Together (cross-functional teamwork). These are scored through structured behavioral questions with follow-up probing: 'What specifically did you do?' and 'What would you have done differently?'",
      scoringCriteria: {
        1: "Values mismatch. Answers suggest poor ethics, no collaboration, or no team orientation.",
        2: "Generic values answers with no specific evidence.",
        3: "Good values alignment. Specific examples for at least 2 ARES dimensions.",
        4: "Strong. All 4 ARES values evident with specific, compelling examples.",
        5: "Exceptional. The behavioral answers would stand out in any Capital One hiring committee review.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: { offerThreshold: 58, hardFloorDimensions: ["quantitative"], hardFloorScore: 3, excellenceDimensionsRequired: 2, excellenceScore: 4, disqualifierScore: 1 },
};

export function calculateCapitalOneOffer(scores: Record<string, number>): { decision: string; label: string; description: string; weightedScore: number; } {
  const dims = CAPITAL_ONE_RUBRIC.dimensions;
  for (const d of dims) { if ((d as any).dealbreaker && scores[d.key] <= 1) return { decision: "disqualified", label: "No Offer", description: "Automatically disqualified. Quantitative skills are Capital One's most heavily weighted dimension — the company was built on data-driven decision making. A score of 1 means you cannot translate business scenarios into the right equations. This is the highest-priority area before your next Capital One interview.", weightedScore: 0 }; }

  const other = dims.find(d => !(d as any).dealbreaker && scores[d.key] <= 1);
  if (other) return { decision: "disqualified", label: "No Offer", description: `A score of 1 on ${other.label} is disqualifying at Capital One.`, weightedScore: 0 };

  let w = 0;
  for (const d of dims) w += (((scores[d.key] ?? 1) - 1) / 4) * 100 * d.weight / 100;

  if (scores["quantitative"] < 3) return { decision: "no_offer", label: "No Offer", description: "Below the Capital One bar. Quantitative skills must reach at least a 3 — equation translation and financial product math are non-negotiable. Practice break-even, profitability, and credit card economics calculations before your next Power Day.", weightedScore: Math.round(w) };

  const exc = dims.filter(d => scores[d.key] >= 4).length;
  if (w >= 81 && exc >= 3) return { decision: "strong_offer", label: "Strong Offer", description: "Exceptional. Capital One would extend a strong offer. You demonstrated the data-driven quantitative precision, financial services business judgment, and ARES values alignment that Capital One's Business Analyst program is built around. Top 5% of candidates.", weightedScore: Math.round(w) };
  if (w >= 58 && exc >= 2) return { decision: "offer", label: "Offer", description: "Above the Capital One bar. An offer would likely be extended. You showed strong equation-translation skills, financial product knowledge, and structured thinking under directed prompts. Top 15-20% of candidates.", weightedScore: Math.round(w) };
  if (w >= 40) return { decision: "borderline", label: "Borderline — No Offer", description: "Close to the Capital One bar. The most common gap: equation translation in multi-step financial problems. Candidates who can do the arithmetic but set up the wrong equation consistently fall short. Practice translating business scenarios (promotions, product changes, credit decisions) into the right mathematical framework first, then calculate.", weightedScore: Math.round(w) };
  return { decision: "no_offer", label: "No Offer", description: "Below the Capital One bar. Focus on quantitative skills — equation translation and financial product math. Study credit card economics, loan profitability, and break-even analysis. Capital One's interviewer-led format also requires practicing responses to directed prompts rather than candidate-led framework building.", weightedScore: Math.round(w) };
}