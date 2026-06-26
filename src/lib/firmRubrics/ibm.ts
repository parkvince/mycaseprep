export const IBM_RUBRIC = {
  firm: "ibm",
  firmFullName: "IBM Consulting",
  format: "candidate-led with technology lens",
  interviewDuration: "30-45 minutes",
  offerRate: "More accessible than Tier 2 strategy firms. IBM is the largest consulting organization by headcount globally.",

  dimensions: [
    {
      key: "structure",
      label: "Structured Thinking & Problem Framing",
      weight: 20,
      ibmNote: "IBM Consulting cases always carry a technology layer — even a growth or profitability case will incorporate cloud strategy, AI implementation costs, or ERP integration constraints. Your structure must address BOTH the business problem AND the technology dimension. IBM has three distinct divisions with different case content: IBM iX (design/experience), Strategy & Transformation (finance/operations), and Technology Consulting (delivery/implementation). Know which track you're interviewing for.",
      scoringCriteria: {
        1: "No structure. Cannot frame a technology + business hybrid problem.",
        2: "Pure strategy structure with no technology dimension.",
        3: "Clear structure. Addresses both business and technology dimensions.",
        4: "Strong. Business-first with technology fully integrated. Division-specific logic embedded.",
        5: "Exceptional. The structure reflects the exact way IBM Consulting frames technology transformation problems.",
      },
      dealbreaker: false,
    },
    {
      key: "technologyBusinessJudgment",
      label: "Technology + Business Judgment",
      weight: 25,
      ibmNote: "IBM's most distinctive dimension. Every IBM case has a technology layer: cloud migration ROI, AI adoption roadmap, ERP modernization business case, or digital transformation prioritization. The key skill: start with the business problem and bring technology in as a solution, not the other way around. 'The strongest candidates were the ones who started with the business problem and brought technology in as a way to solve it, not the other way around.'",
      whatStrongLooksLike: [
        "Frames technology decisions as business cases: 'The cloud migration ROI is positive if annual savings exceed $X within Y years'",
        "For AI cases: distinguishes between genuine value creation and AI hype",
        "For ERP cases: connects system implementation to business process improvement and cost savings",
        "For IBM iX cases: frames customer experience improvements in terms of business metrics",
        "Understands the implementation reality: change management, adoption risk, integration constraints",
      ],
      scoringCriteria: {
        1: "No technology-business integration. Cannot connect tech decisions to business outcomes.",
        2: "Either pure tech (no business case) or pure business (no tech dimension).",
        3: "Solid integration. Technology grounded in business case. Some implementation awareness.",
        4: "Strong. Business-first technology thinking. ROI quantified. Implementation risks acknowledged.",
        5: "Exceptional. The technology-business integration is seamless and would satisfy an IBM partner and client CIO simultaneously.",
      },
      dealbreaker: false,
    },
    {
      key: "quantitative",
      label: "Quantitative Analysis",
      weight: 20,
      ibmNote: "IBM cases are quantitative but less intensely so than MBB. Focus areas: technology ROI calculations, cost-benefit of cloud migration vs. on-premise, AI implementation cost curves, and standard profitability math. IBM's 2025 Business Transformation revenue growth signals emphasis on quantified transformation business cases.",
      scoringCriteria: {
        1: "Cannot perform technology cost-benefit calculations.",
        2: "Some quantitative ability but cannot handle technology ROI math.",
        3: "Solid. Technology and standard business math handled correctly.",
        4: "Strong. Technology ROI quantified. Business impact clearly stated.",
        5: "Exceptional. Every technology recommendation backed by a business case with numbers.",
      },
      dealbreaker: false,
    },
    {
      key: "communication",
      label: "Communication & Client Readiness",
      weight: 20,
      ibmNote: "IBM serves some of the world's largest organizations. Communication must be executive-ready for a CIO, CFO, or COO audience. IBM's scale ($21B revenue, 160,000 consultants) means clear, structured communication across diverse teams is essential.",
      scoringCriteria: {
        1: "Cannot communicate analysis to an executive audience.",
        2: "Adequate but not executive-ready. Buries technology findings.",
        3: "Clear. Executive-appropriate. Conclusion-first.",
        4: "Strong. Would be trusted in a CIO or CFO presentation.",
        5: "Exceptional. Natural executive presence in a technology transformation context.",
      },
      dealbreaker: false,
    },
    {
      key: "collaboration",
      label: "Collaboration & Team Orientation",
      weight: 15,
      ibmNote: "IBM's scale requires strong collaborative instincts. IBM Consulting teams are large and cross-functional — technology specialists, business consultants, and client teams all need to work together. Candidates who demonstrate collaborative problem-solving, active listening, and team facilitation instincts fit IBM's culture well.",
      scoringCriteria: {
        1: "No collaborative instinct. Solo approach. Cannot work in cross-functional teams.",
        2: "Adequate alone but shows no team-orientation.",
        3: "Good collaborative instinct. Treats interviewer as thought partner.",
        4: "Strong collaboration. Cross-functional team experience evident. Natural partner.",
        5: "Exceptional. The kind of collaborative leader IBM builds its largest transformation teams around.",
      },
      dealbreaker: false,
    },
  ],

  offerDecision: { offerThreshold: 55, hardFloorDimensions: [], hardFloorScore: 2, excellenceDimensionsRequired: 2, excellenceScore: 4, disqualifierScore: 1 },
};

export function calculateIbmOffer(scores: Record<string, number>): { decision: string; label: string; description: string; weightedScore: number; } {
  const dims = IBM_RUBRIC.dimensions;
  const disq = dims.find(d => scores[d.key] <= 1);
  if (disq) return { decision: "disqualified", label: "No Offer", description: `A score of 1 on ${disq.label} is disqualifying at IBM Consulting.`, weightedScore: 0 };

  let w = 0;
  for (const d of dims) w += (((scores[d.key] ?? 1) - 1) / 4) * 100 * d.weight / 100;

  const floor = dims.find(d => scores[d.key] < 2);
  if (floor) return { decision: "no_offer", label: "No Offer", description: `${floor.label} must reach at least a 2 at IBM Consulting.`, weightedScore: Math.round(w) };

  const exc = dims.filter(d => scores[d.key] >= 4).length;
  if (w >= 80 && exc >= 3) return { decision: "strong_offer", label: "Strong Offer", description: "Exceptional. IBM Consulting would extend a strong offer. You demonstrated the rare combination of business-first technology thinking, quantified transformation cases, and collaborative instinct that IBM's scale requires. Top 5% of candidates.", weightedScore: Math.round(w) };
  if (w >= 55 && exc >= 2) return { decision: "offer", label: "Offer", description: "Above the IBM bar. An offer would likely be extended. You showed solid technology-business judgment, executive communication, and collaborative orientation. Top 15-20% of candidates.", weightedScore: Math.round(w) };
  if (w >= 38) return { decision: "borderline", label: "Borderline — No Offer", description: "Close to the IBM bar. The most common gap: technology-business integration. Candidates who treat IBM cases like pure strategy miss the technology dimension that IBM clients always need. Practice framing technology decisions as quantified business cases.", weightedScore: Math.round(w) };
  return { decision: "no_offer", label: "No Offer", description: "Below the IBM bar. Focus on technology-business judgment — IBM's most distinctive dimension. Learn to frame cloud, AI, and ERP decisions as business cases with ROI. IBM's bar is more accessible than MBB — most candidates clear it within 8-12 targeted cases.", weightedScore: Math.round(w) };
}