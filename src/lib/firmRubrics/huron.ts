export const HURON_RUBRIC = {
  firm: "huron",
  firmFullName: "Huron Consulting",
  format: "interviewer-led",
  interviewDuration: "30-45 minutes",
  offerRate: "More accessible than MBB and most Tier 2 firms. Glassdoor difficulty rating 3.03/5. Strong offer rate for well-prepared candidates.",

  dimensions: [
    {
      key: "analyticalThinking",
      label: "Analytical Thinking & Problem Setup",
      weight: 22,
      huronNote: "Huron uses an INTERVIEWER-LED format - unlike BCG, Bain, or most Tier 2 firms, the interviewer guides which areas to explore. Your job is to respond clearly and logically to each prompt, not to independently drive the case. Huron's interviewers 'do not care so much about the right numbers - they care about how you would go about setting up the analysis.' Cases draw heavily from Huron's real client engagements in healthcare (hospitals, health systems), higher education (enrollment, cost), and life sciences.",
      scoringCriteria: {
        1: "Cannot set up a logical analysis framework when prompted.",
        2: "Basic analytical setup but misses key drivers in healthcare or education context.",
        3: "Solid analytical setup. Responds well to interviewer prompts. Healthcare/education logic evident.",
        4: "Strong. Logical, structured responses. Healthcare and education business model awareness.",
        5: "Exceptional. Analysis setup would immediately orient a hospital CFO or university president.",
      },
      dealbreaker: false,
    },
    {
      key: "industryKnowledge",
      label: "Healthcare & Education Industry Knowledge",
      weight: 23,
      huronNote: "Huron's most distinctive dimension. Healthcare makes up roughly half of Huron's revenue, and cases frequently involve hospital operations, physician group finances, health system strategy, and revenue cycle management. Key concepts: how hospitals get paid (fee-for-service vs. value-based), what 'length of stay' means financially, revenue cycle metrics, and clinical vs. non-clinical cost drivers. For education cases: enrollment management, administrative cost reduction, and online program strategy. Candidates without this context consistently underperform against those who understand the operational dynamics.",
      whatStrongLooksLike: [
        "For hospital cases: understands operating margin, payer mix, contract labor costs, length of stay",
        "For health system cases: understands value-based care, network strategy, and merger logic",
        "For university cases: understands enrollment funnel, net tuition revenue, and administrative cost drivers",
        "For life sciences cases: understands regulatory pathway, market access, and commercialization economics",
        "Asks clarifying questions that reveal sector knowledge, not just generic curiosity",
      ],
      scoringCriteria: {
        1: "No healthcare or education industry knowledge. Generic business analysis only.",
        2: "Basic business knowledge but no sector-specific fluency. Missing key metrics and dynamics.",
        3: "Adequate sector knowledge. Understands main healthcare or education business models.",
        4: "Strong sector fluency. Engages confidently with hospital operations or university management.",
        5: "Exceptional. The candidate would be immediately credible in front of a hospital CEO or university CFO.",
      },
      dealbreaker: false,
    },
    {
      key: "quantitative",
      label: "Quantitative Analysis & Business Math",
      weight: 20,
      huronNote: "Huron cases involve straightforward but sector-specific math: hospital cost-per-case analysis, revenue per patient day, enrollment yield calculations, and contract labor premium calculations. Huron sometimes allows calculators. The interviewer cares more about analytical setup than arithmetic perfection - but you must connect the numbers to the healthcare or education business implication.",
      scoringCriteria: {
        1: "Cannot perform sector-specific calculations when prompted.",
        2: "Some quantitative ability but cannot connect numbers to healthcare or education implications.",
        3: "Solid. Handles sector-specific math correctly. Connects to business implications.",
        4: "Strong. Fast, accurate, well-narrated. Healthcare or education metrics interpreted correctly.",
        5: "Exceptional. The quantitative analysis would provide actionable insight for a hospital CFO.",
      },
      dealbreaker: false,
    },
    {
      key: "communication",
      label: "Communication & Client Engagement",
      weight: 20,
      huronNote: "Huron clients are often healthcare executives (hospital CEOs, CFOs, CNOs) and university presidents - leaders who need clear, practical communication. 'Huron values consultants who can keep clients engaged and informed even when under pressure.' Communication at Huron must be accessible to non-consulting executives without oversimplifying the analysis.",
      scoringCriteria: {
        1: "Cannot communicate analysis to a healthcare or university executive audience.",
        2: "Adequate but too abstract. Healthcare executives would struggle to follow.",
        3: "Clear. Practical language. Healthcare or education executives could follow and act on it.",
        4: "Strong. Would be trusted by a hospital CEO or university president.",
        5: "Exceptional. The communication would genuinely help a healthcare or education leader make a better decision.",
      },
      dealbreaker: false,
    },
    {
      key: "impactOrientation",
      label: "Impact Orientation & Practical Recommendations",
      weight: 15,
      huronNote: "Huron explicitly evaluates 'impact orientation: showing drive, confidence, and focus on real-world outcomes.' Recommendations must be actionable and specific. Huron's performance improvement heritage means they want consultants who can identify concrete actions that will move the needle - not just strategic frameworks.",
      scoringCriteria: {
        1: "Recommendations are theoretical with no real-world action path.",
        2: "Some recommendations but vague. Cannot identify specific actions.",
        3: "Clear, actionable recommendations. Impact estimated.",
        4: "Strong. Specific, sequenced, and impact-quantified recommendations.",
        5: "Exceptional. The recommendations are immediately implementable by a Huron client team.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: { offerThreshold: 55, hardFloorDimensions: [], hardFloorScore: 2, excellenceDimensionsRequired: 2, excellenceScore: 4, disqualifierScore: 1 },
};

export function calculateHuronOffer(scores: Record<string, number>): { decision: string; label: string; description: string; weightedScore: number; } {
  const dims = HURON_RUBRIC.dimensions;
  const disq = dims.find(d => scores[d.key] <= 1);
  if (disq) return { decision: "disqualified", label: "No Offer", description: `A score of 1 on ${disq.label} is disqualifying at Huron.`, weightedScore: 0 };

  let w = 0;
  for (const d of dims) w += (((scores[d.key] ?? 1) - 1) / 4) * 100 * d.weight / 100;

  const floor = dims.find(d => scores[d.key] < 2);
  if (floor) return { decision: "no_offer", label: "No Offer", description: `${floor.label} must reach at least a 2 at Huron.`, weightedScore: Math.round(w) };

  const exc = dims.filter(d => scores[d.key] >= 4).length;
  if (w >= 78 && exc >= 3) return { decision: "strong_offer", label: "Strong Offer", description: "Exceptional. Huron would extend a strong offer. You demonstrated genuine healthcare and education industry knowledge, practical impact-oriented recommendations, and client-ready communication. Top 5% of candidates.", weightedScore: Math.round(w) };
  if (w >= 55 && exc >= 2) return { decision: "offer", label: "Offer", description: "Above the Huron bar. An offer would likely be extended. You showed solid sector knowledge, analytical rigor, and the practical recommendation quality Huron's clients need. Top 15-20% of candidates.", weightedScore: Math.round(w) };
  if (w >= 38) return { decision: "borderline", label: "Borderline - No Offer", description: "Close to the Huron bar. The most common gap: healthcare and education industry knowledge. Generic business analysis without sector context consistently underperforms at Huron. Study hospital operations, health system economics, and university enrollment management before your next interview.", weightedScore: Math.round(w) };
  return { decision: "no_offer", label: "No Offer", description: "Below the Huron bar. Focus first on healthcare and education industry knowledge - Huron's most distinctive requirement. Then practice the interviewer-led format (responding to directed prompts, not driving independently). Huron's bar is more accessible than MBB - most candidates clear it within 6-10 targeted cases.", weightedScore: Math.round(w) };
}