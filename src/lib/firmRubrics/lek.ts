export const LEK_RUBRIC = {
  firm: "lek",
  firmFullName: "L.E.K. Consulting",
  format: "candidate-led with written case component",
  interviewDuration: "30 minutes per verbal case, 60 minutes written case",
  offerRate: "Approximately 2-3% of applicants. Tier 2 with MBB-adjacent rigor, particularly in life sciences and PE.",

  dimensions: [
    {
      key: "structure",
      label: "Structured Reasoning & Hypothesis-Driven Analysis",
      weight: 20,
      lekNote: "L.E.K. uses a candidate-led format. Their culture explicitly values 'evidence over opinion' - your structure must be built to generate and test specific hypotheses, not to explore possibilities generically. L.E.K.'s deep life sciences and PE due diligence heritage means cases frequently involve biopharma market sizing, MedTech competitive positioning, or commercial due diligence for PE. Your structure should reflect sector logic. Market sizing is extremely common at L.E.K. - often a standalone case - and requires a dedicated logical approach.",
      scoringCriteria: {
        1: "No structure. Cannot build a hypothesis-driven framework.",
        2: "Generic framework not adapted to life sciences or PE context. No hypothesis.",
        3: "Clear hypothesis-led structure. Handles market sizing cases well. Some sector adaptation.",
        4: "Strong. Hypothesis-driven, sector-specific. Market sizing logic is tight and well-narrated.",
        5: "Exceptional. The structure reflects genuine life sciences or PE analytical depth.",
      },
      dealbreaker: false,
    },
    {
      key: "quantitative",
      label: "Quantitative Rigor & Data-Driven Reasoning",
      weight: 25,
      lekNote: "L.E.K.'s most heavily weighted dimension. Their pre-screen includes a GMAT-style numerical reasoning test that functions as an eliminatory gate. Market sizing cases at L.E.K. are highly quantitative - candidates must work through multi-layer calculations with stated assumptions and clean methodology. PE due diligence cases require financial math fluency: revenue multiples, EBITDA margins, market penetration rates, and TAM/SAM calculations. 'Evidence over opinion' means every claim must be backed by a number.",
      scoringCriteria: {
        1: "Cannot perform market sizing calculations or financial due diligence math.",
        2: "Some quantitative ability but calculation errors. Cannot handle PE financial math.",
        3: "Solid. Market sizing methodology is sound. Financial calculations mostly correct.",
        4: "Strong. Fast, accurate, narrated. Handles life sciences and PE math fluently.",
        5: "Exceptional. The quantitative precision would satisfy an L.E.K. partner on a PE due diligence engagement.",
      },
      dealbreaker: true,
    },
    {
      key: "evidenceReasoning",
      label: "Evidence-Based Reasoning & Analytical Depth",
      weight: 22,
      lekNote: "L.E.K.'s explicit cultural value: 'evidence over opinion.' This means every recommendation must be grounded in data, and every assumption must be stated and justified. Unlike firms where judgment and intuition can compensate for data gaps, L.E.K. expects candidates to explicitly identify what evidence they have, what they're assuming, and what additional data would change their recommendation. Written case specifically tests this: can you build a data-driven narrative from a complex exhibit package?",
      scoringCriteria: {
        1: "Recommendations are opinion-based with no data grounding.",
        2: "Some evidence but with gaps. Assumptions unstated. Cannot distinguish fact from inference.",
        3: "Evidence-grounded analysis. Assumptions stated. Identifies key data gaps.",
        4: "Strong. Every recommendation explicitly tied to evidence. Assumptions stated and justified.",
        5: "Exceptional. The evidence-based rigor would satisfy an L.E.K. life sciences or PE partner.",
      },
      dealbreaker: false,
    },
    {
      key: "writtenCase",
      label: "Written Case Synthesis & Slide Communication",
      weight: 18,
      lekNote: "L.E.K.'s written case is a major final-round component: 60 minutes to analyze a 40-50 page slide packet, create an 8-10 slide deck, and present findings to the interviewer. This tests slide-based communication, data synthesis under time pressure, and the ability to build a coherent data-driven narrative from financial exhibits. L.E.K. clients in life sciences and PE expect precise, evidence-backed slide communication - not just verbal fluency.",
      scoringCriteria: {
        1: "Cannot synthesize a 40-50 page exhibit package into a coherent recommendation.",
        2: "Basic synthesis. Summarizes exhibits rather than building a narrative. Slide quality poor.",
        3: "Adequate. Recommendation stated. Main evidence used. Slides are followable.",
        4: "Strong. Recommendation-first. Evidence synthesized across exhibits. Slides are tight.",
        5: "Exceptional. The written case output mirrors the quality of an L.E.K. client deliverable.",
      },
      dealbreaker: false,
    },
    {
      key: "communication",
      label: "Communication & Intellectual Engagement",
      weight: 15,
      lekNote: "L.E.K.'s collaborative, non-hierarchical culture is reflected in how they evaluate communication. 'The culture of L.E.K. is very open, supportive, and non-hierarchical.' They want candidates who think out loud, engage intellectually with the problem, and communicate with the confidence of someone who has thought carefully about the evidence.",
      scoringCriteria: {
        1: "Cannot communicate analytical reasoning clearly.",
        2: "Communicates but buries evidence or lacks intellectual engagement with the problem.",
        3: "Clear communication. Evidence-grounded delivery. Intellectually engaged.",
        4: "Strong. Conclusion-first, evidence-backed, intellectually engaged.",
        5: "Exceptional. Would fit naturally into L.E.K.'s non-hierarchical, evidence-driven culture.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: { offerThreshold: 64, hardFloorDimensions: ["quantitative"], hardFloorScore: 3, excellenceDimensionsRequired: 2, excellenceScore: 4, disqualifierScore: 1 },
};

export function calculateLekOffer(scores: Record<string, number>): { decision: string; label: string; description: string; weightedScore: number; } {
  const dims = LEK_RUBRIC.dimensions;
  for (const d of dims) { if ((d as any).dealbreaker && scores[d.key] <= 1) return { decision: "disqualified", label: "No Offer", description: "Automatically disqualified. Quantitative rigor is L.E.K.'s primary gate - their pre-screen numerical test exists specifically to eliminate candidates without it. This is the highest-priority area to develop.", weightedScore: 0 }; }

  const other = dims.find(d => !(d as any).dealbreaker && scores[d.key] <= 1);
  if (other) return { decision: "disqualified", label: "No Offer", description: `A score of 1 on ${other.label} is disqualifying at L.E.K.`, weightedScore: 0 };

  let w = 0;
  for (const d of dims) w += (((scores[d.key] ?? 1) - 1) / 4) * 100 * d.weight / 100;

  if (scores["quantitative"] < 3) return { decision: "no_offer", label: "No Offer", description: "Below the L.E.K. bar. Quantitative rigor and market sizing math must reach at least a 3. L.E.K.'s evidence-over-opinion culture means every claim needs a number behind it.", weightedScore: Math.round(w) };

  const exc = dims.filter(d => scores[d.key] >= 4).length;
  if (w >= 84 && exc >= 3) return { decision: "strong_offer", label: "Strong Offer", description: "Exceptional. L.E.K. would extend a strong offer. The quantitative rigor, evidence-based reasoning, and written case quality are all at the level L.E.K. expects from candidates who go on to work on life sciences and PE due diligence mandates. Top 5% of candidates.", weightedScore: Math.round(w) };
  if (w >= 64 && exc >= 2) return { decision: "offer", label: "Offer", description: "Above the L.E.K. bar. An offer would likely be extended. You showed the quantitative precision, evidence-driven reasoning, and written case synthesis that L.E.K.'s culture demands. Top 10-15% of candidates.", weightedScore: Math.round(w) };
  if (w >= 47) return { decision: "borderline", label: "Borderline - No Offer", description: "Close to the L.E.K. bar. The most common gap: written case synthesis and evidence grounding. Practice building recommendation-first narratives from dense exhibit packages. Market sizing methodology also needs to be sharper.", weightedScore: Math.round(w) };
  return { decision: "no_offer", label: "No Offer", description: "Below the L.E.K. bar. Focus on quantitative rigor and written case synthesis. L.E.K.'s evidence-over-opinion culture means every recommendation must be data-backed. Most candidates need 12-18 cases to consistently meet this standard.", weightedScore: Math.round(w) };
}