export const KEARNEY_RUBRIC = {
  firm: "kearney",
  firmFullName: "Kearney",
  format: "hybrid interviewer-led and candidate-led",
  interviewDuration: "30-40 minutes per case",
  offerRate: "Approximately 2% of applicants. Operations and supply chain specialist with MBB-adjacent rigor.",

  dimensions: [
    {
      key: "structure",
      label: "Structured Thinking & Problem Framing",
      weight: 22,
      kearneyNote: "Kearney uses a hybrid format - the interviewer will guide some elements but you must also show initiative when the reins are handed to you. This requires adaptability: excelling at answering structured questions AND demonstrating candidate-led initiative. Kearney's heritage in operations and supply chain means cases frequently involve manufacturing process improvement, procurement optimization, or supply chain restructuring - your structure must reflect operational logic alongside strategic reasoning.",
      scoringCriteria: {
        1: "No structure. Cannot frame an operations or supply chain problem.",
        2: "Generic strategy framework with no operational dimension. Not adapted to the case.",
        3: "Clear structure. Handles both interviewer-guided and candidate-led transitions.",
        4: "Strong structure. Adapts between guided and independent segments. Operational logic embedded.",
        5: "Exceptional. Perfectly adapted hybrid performance. Operational and strategic depth simultaneously.",
      },
      dealbreaker: false,
    },
    {
      key: "operationalExcellence",
      label: "Operational Excellence & Implementation Thinking",
      weight: 25,
      kearneyNote: "Kearney's most distinctive dimension. Founded as a procurement and operations consultancy, Kearney's signature is operational depth - supply chain mastery, procurement optimization, manufacturing efficiency, and process improvement. Candidates who deliver pure strategy without operational execution detail miss the Kearney standard. Their evaluation 'particularly emphasizes practical implementation thinking: strategy without execution is merely theory.' This means your recommendations must include HOW to execute, not just WHAT to do.",
      whatStrongLooksLike: [
        "Recommendations include operational execution pathway, not just strategic direction",
        "For supply chain cases: structures around procurement, logistics, inventory, and supplier relationships",
        "For manufacturing cases: addresses process efficiency, capacity utilization, and cost structure",
        "Identifies implementation sequencing: 'First we stabilize X, then improve Y, then optimize Z'",
        "Operational detail: specific process steps, not just high-level buckets",
        "Feasibility awareness: knows what can realistically be done in what timeframe",
      ],
      whatWeakLooksLike: [
        "Recommendation is purely strategic with no operational execution pathway",
        "No supply chain or operations vocabulary when the case involves them",
        "Implementation naively assumes everything will work as planned",
        "Cannot prioritize between operational improvement levers",
      ],
      scoringCriteria: {
        1: "No operational thinking. Recommendation is purely theoretical.",
        2: "Some operational awareness but misses execution specifics. Cannot sequence implementation.",
        3: "Solid operational judgment. Identifies key execution steps. Reasonable implementation awareness.",
        4: "Strong operational excellence. Implementation pathway is specific and sequenced. Supply chain fluency evident.",
        5: "Exceptional. The recommendation includes operational depth that would immediately resonate with a manufacturing or logistics client.",
      },
      dealbreaker: false,
    },
    {
      key: "quantitative",
      label: "Quantitative Analysis & Data-Driven Reasoning",
      weight: 20,
      kearneyNote: "Kearney values 'balanced analysis: quantitative precision matters, but so does qualitative judgment.' Cases frequently involve cost-benefit analysis of operational improvements, procurement savings calculations, and supply chain efficiency metrics. Unlike pure strategy firms where quant is about financial modeling, Kearney's quant dimension often involves operations metrics: throughput, utilization rates, unit costs, and savings from process improvement.",
      scoringCriteria: {
        1: "Cannot perform operational cost-benefit calculations. No quantitative grounding.",
        2: "Some quantitative ability but cannot handle operations-specific metrics.",
        3: "Solid. Handles standard cost-benefit and savings calculations. Reasonable operations math.",
        4: "Strong. Fast, accurate, narrated. Handles operations metrics fluently.",
        5: "Exceptional. Every operational recommendation is quantified and grounded in realistic assumptions.",
      },
      dealbreaker: false,
    },
    {
      key: "collaboration",
      label: "Collaborative Leadership & Teamwork",
      weight: 18,
      kearneyNote: "Kearney's evaluation 'particularly emphasizes collaborative leadership: how effectively you navigate team dynamics to achieve results. Kearney consultants rarely work in isolation.' This is evaluated in behavioral questions and in the case itself. The key question: do you engage with the interviewer as a thought partner, or do you treat them as an audience? Kearney's collaborative culture means the best candidates make the interviewer feel like a team member.",
      scoringCriteria: {
        1: "No collaboration. Solo performance. Does not engage with interviewer as thought partner.",
        2: "Minimal collaboration. Adequate in behavioral questions but treats case as solo exercise.",
        3: "Good collaborative instinct. Engages with interviewer. Behavioral questions show teamwork.",
        4: "Strong collaborative leader. Treats interviewer as thought partner. Clear team leadership examples.",
        5: "Exceptional. The collaboration feels natural and genuine. Kearney team would immediately want this person.",
      },
      dealbreaker: false,
    },
    {
      key: "communication",
      label: "Communication & Practical Clarity",
      weight: 15,
      kearneyNote: "Kearney's communication standard: practical clarity over consulting polish. Kearney clients are often operational leaders - plant managers, procurement directors, COOs - who want clear, actionable communication, not strategy jargon. The best Kearney candidates speak in plain language about complex operations topics. Recommendations should sound like something you could tell a plant manager over coffee.",
      scoringCriteria: {
        1: "Cannot communicate analysis clearly. Operational topics become jargon-heavy and confusing.",
        2: "Communicates but uses overly abstract language for operational topics.",
        3: "Clear enough. Practical language. Operational leaders could follow the logic.",
        4: "Strong practical communicator. Accessible language. Conclusion-first.",
        5: "Exceptional. A plant manager or COO would immediately trust and act on this recommendation.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: { offerThreshold: 63, hardFloorDimensions: [], hardFloorScore: 2, excellenceDimensionsRequired: 2, excellenceScore: 4, disqualifierScore: 1 },
};

export function calculateKearneyOffer(scores: Record<string, number>): { decision: string; label: string; description: string; weightedScore: number; } {
  const dims = KEARNEY_RUBRIC.dimensions;
  const disq = dims.find(d => scores[d.key] <= 1);
  if (disq) return { decision: "disqualified", label: "No Offer", description: `A score of 1 on ${disq.label} is disqualifying at Kearney.`, weightedScore: 0 };

  let w = 0;
  for (const d of dims) w += (((scores[d.key] ?? 1) - 1) / 4) * 100 * d.weight / 100;

  const floor = dims.find(d => scores[d.key] < 2);
  if (floor) return { decision: "no_offer", label: "No Offer", description: `${floor.label} must reach at least a 2 before Kearney will extend an offer.`, weightedScore: Math.round(w) };

  const exc = dims.filter(d => scores[d.key] >= 4).length;
  if (w >= 83 && exc >= 3) return { decision: "strong_offer", label: "Strong Offer", description: "Exceptional. Kearney would extend a strong offer. You demonstrated the rare combination of operational depth, structured thinking, and collaborative instinct that Kearney's culture is built on. Top 5% of interview-stage candidates.", weightedScore: Math.round(w) };
  if (w >= 63 && exc >= 2) return { decision: "offer", label: "Offer", description: "Above the Kearney bar. An offer would likely be extended. You showed operational excellence thinking, practical implementation focus, and collaborative leadership. Top 10-15% of candidates.", weightedScore: Math.round(w) };
  if (w >= 46) return { decision: "borderline", label: "Borderline - No Offer", description: "Close to the Kearney bar. The most common gap: operational execution depth - candidates who deliver good strategy but miss the 'how do we actually do this' dimension. Add implementation sequencing and supply chain specifics to every recommendation.", weightedScore: Math.round(w) };
  return { decision: "no_offer", label: "No Offer", description: "Below the Kearney bar. Focus on operational excellence - Kearney's signature. Every recommendation needs an execution pathway, not just a strategic direction. Most candidates clear the Kearney bar within 10-15 cases of targeted preparation.", weightedScore: Math.round(w) };
}