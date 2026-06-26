export const MONITOR_DELOITTE_RUBRIC = {
  firm: "monitor-deloitte",
  firmFullName: "Monitor Deloitte",
  format: "candidate-led — treat as BCG/Bain prep, not standard Deloitte",
  interviewDuration: "30-45 minutes per case",
  offerRate: "Approximately 3-4% of applicants. Pure strategy arm of Deloitte. Competes directly with MBB and EY-Parthenon for strategy mandates.",

  dimensions: [
    {
      key: "strategicStructure",
      label: "Strategic Structure & CEO-Level Point of View",
      weight: 25,
      mdNote: "Monitor Deloitte's most critical dimension. 'Your recommendation needs a clear CEO-level point of view, not a balanced list of pros and cons.' This distinguishes Monitor Deloitte prep from standard Deloitte: Monitor expects you to take a clear position from the outset and build the case for it, not explore all sides equally. Cases focus on market entry, corporate strategy, growth, and M&A — the same work MBB firms do. Treat this like BCG or Bain prep, not Big 4.",
      whatStrongLooksLike: [
        "Opens with a clear hypothesis and point of view: 'My initial view is they should enter the market because...'",
        "Structures the case to prove or disprove that point of view, not to explore all possibilities",
        "For market entry: makes a directional call early and builds the evidence for it",
        "For M&A: states whether the deal has strategic logic upfront before diving into due diligence",
        "CEO-level synthesis: the recommendation is something a CEO could immediately act on",
      ],
      whatWeakLooksLike: [
        "Balanced pros and cons list with no clear point of view",
        "Explores all strategic options equally without prioritization",
        "Recommendation hedged with 'it depends' without committing to a direction",
        "Standard Deloitte S&O prep applied to a pure strategy case",
      ],
      scoringCriteria: {
        1: "No point of view. Balanced exploration with no directional recommendation.",
        2: "Vague hypothesis. Explores too broadly. Recommendation is hedged.",
        3: "Clear hypothesis and point of view. CEO-level recommendation stated.",
        4: "Strong. Hypothesis-driven from the start. CEO point of view throughout. Clear strategic logic.",
        5: "Exceptional. Would satisfy a Monitor Deloitte partner AND the CEO client. Precise, committed, and defensible.",
      },
      dealbreaker: false,
    },
    {
      key: "strategyDepth",
      label: "Strategy Depth & Analytical Insight",
      weight: 23,
      mdNote: "Monitor Deloitte does MBB-equivalent strategy work — market entry, corporate strategy, M&A, and competitive positioning. The analytical depth must match. 'Don't under-prepare for case rigor' is their explicit warning. Office specializations matter: Boston leans life sciences/healthcare, NYC focuses on financial services, Chicago on innovation strategy, SF on technology/digital. Cases are often built from real client engagements, so industry context matters.",
      scoringCriteria: {
        1: "No strategic depth. Analysis is generic and surface-level.",
        2: "Basic strategic analysis. Missing the second-order insights that distinguish Monitor from standard Big 4.",
        3: "Solid strategy depth. Identifies key strategic drivers. Reasonable analytical insight.",
        4: "Strong. Goes beyond the obvious. Identifies the 2-3 factors that actually determine strategic success.",
        5: "Exceptional. MBB-level analytical depth. The insight would add genuine value in a CEO strategy discussion.",
      },
      dealbreaker: false,
    },
    {
      key: "quantitative",
      label: "Quantitative Analysis & Financial Logic",
      weight: 20,
      mdNote: "Monitor Deloitte strategy cases are quant-intensive — market sizing, financial feasibility, M&A valuation logic, and competitive economics. 'Round numbers ruthlessly' and 'write your recommendation in one sentence before presenting' are their explicit tips. Financial feasibility must accompany every strategic recommendation.",
      scoringCriteria: {
        1: "Cannot perform financial calculations or market sizing.",
        2: "Some quantitative analysis but missing financial feasibility grounding.",
        3: "Solid. Market sizing and financial logic handled correctly.",
        4: "Strong. Fast, accurate, narrated. Financial feasibility embedded in recommendation.",
        5: "Exceptional. The financial logic is inseparable from the strategic logic.",
      },
      dealbreaker: false,
    },
    {
      key: "communication",
      label: "Communication & Delivery Under Pressure",
      weight: 17,
      mdNote: "'Defend your reasoning under pressure: when the interviewer pushes back, do not immediately cave. Restate your logic, point to the data, and explain why your conclusion still holds.' Monitor Deloitte specifically tests composure under pushback — a partner will challenge your recommendation. The standard: hold your position with evidence, not stubbornness.",
      scoringCriteria: {
        1: "Collapses under pushback. Cannot defend position. Buries conclusions.",
        2: "Defends position poorly. Either caves immediately or doubles down without engaging.",
        3: "Clear communication. Holds position reasonably under pushback.",
        4: "Strong. Confident under pressure. Points to data when challenged. Adjusts when new evidence is valid.",
        5: "Exceptional. The composure of a senior consultant in a partner review.",
      },
      dealbreaker: false,
    },
    {
      key: "writtenCase",
      label: "Written Case & Strategic Synthesis",
      weight: 15,
      mdNote: "Monitor Deloitte uses written case interviews in some regional processes — 30-50 page slide packet, 30-60 minutes of prep, then a presentation to a Partner. 'Stay calm if you do not finish — the goal is not to answer everything, it is to answer the most important things well.' This dimension scores the ability to prioritize the strategic questions that matter most and build a CEO-level recommendation from the data.",
      scoringCriteria: {
        1: "Cannot build a strategic recommendation from a dense slide packet.",
        2: "Basic synthesis. Summarizes rather than builds a strategic narrative.",
        3: "Adequate. Strategic recommendation stated. Key data used.",
        4: "Strong. Recommendation-first. Strategic narrative built from exhibits. Well-prioritized.",
        5: "Exceptional. The written case output reflects genuine strategy consulting quality.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: { offerThreshold: 64, hardFloorDimensions: [], hardFloorScore: 2, excellenceDimensionsRequired: 2, excellenceScore: 4, disqualifierScore: 1 },
};

export function calculateMonitorDeloitteOffer(scores: Record<string, number>): { decision: string; label: string; description: string; weightedScore: number; } {
  const dims = MONITOR_DELOITTE_RUBRIC.dimensions;
  const disq = dims.find(d => scores[d.key] <= 1);
  if (disq) return { decision: "disqualified", label: "No Offer", description: `A score of 1 on ${disq.label} is disqualifying at Monitor Deloitte.`, weightedScore: 0 };

  let w = 0;
  for (const d of dims) w += (((scores[d.key] ?? 1) - 1) / 4) * 100 * d.weight / 100;

  const floor = dims.find(d => scores[d.key] < 2);
  if (floor) return { decision: "no_offer", label: "No Offer", description: `${floor.label} must reach at least a 2.`, weightedScore: Math.round(w) };

  const exc = dims.filter(d => scores[d.key] >= 4).length;
  if (w >= 83 && exc >= 3) return { decision: "strong_offer", label: "Strong Offer", description: "Exceptional. Monitor Deloitte would extend a strong offer. You demonstrated MBB-level strategic depth, CEO-level point of view, and the composure under pressure that Monitor's strategy partners look for. Top 5% of candidates.", weightedScore: Math.round(w) };
  if (w >= 64 && exc >= 2) return { decision: "offer", label: "Offer", description: "Above the Monitor Deloitte bar. An offer would likely be extended. You showed clear strategic hypothesis, analytical depth, and the ability to hold a position under pressure. Top 10-15% of candidates.", weightedScore: Math.round(w) };
  if (w >= 47) return { decision: "borderline", label: "Borderline — No Offer", description: "Close to the Monitor bar. The most common gap: strategic point of view. Candidates who explore all options equally without committing to a CEO-level recommendation fall short here. Practice leading with your recommendation from minute one.", weightedScore: Math.round(w) };
  return { decision: "no_offer", label: "No Offer", description: "Below the Monitor Deloitte bar. The biggest mistake: treating this like a standard Deloitte S&O interview. Monitor requires MBB-level case prep. Focus on CEO-level point of view and strategic depth. Most candidates need 12-18 cases to meet this standard.", weightedScore: Math.round(w) };
}