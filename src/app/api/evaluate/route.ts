import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { buildEvaluationPrompt } from "@/lib/prompts/interviewer";
import { FirmKey, Difficulty, Message } from "@/types";
import { MCKINSEY_RUBRIC, calculateMckinseyOffer } from "@/lib/firmRubrics/mckinsey";
import { BCG_RUBRIC, calculateBcgOffer } from "@/lib/firmRubrics/bcg";
import { BAIN_RUBRIC, calculateBainOffer } from "@/lib/firmRubrics/bain";
import { EY_PARTHENON_RUBRIC, calculateEyParthenonOffer } from "@/lib/firmRubrics/eyParthenon";
import { DELOITTE_RUBRIC, calculateDeloitteOffer } from "@/lib/firmRubrics/deloitte";
import { KPMG_RUBRIC, calculateKpmgOffer } from "@/lib/firmRubrics/kpmg";
import { PWC_RUBRIC, calculatePwcOffer } from "@/lib/firmRubrics/pwc";
import { ROLAND_BERGER_RUBRIC, calculateRolandBergerOffer } from "@/lib/firmRubrics/rolandBerger";
import { ACCENTURE_RUBRIC, calculateAccentureOffer } from "@/lib/firmRubrics/accenture";

function buildFirmRubricContext(firm: FirmKey): string {
  if (firm === "mckinsey") {
    const dims = MCKINSEY_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using McKinsey's ACTUAL Problem-Solving Interview rubric.
MCKINSEY-SPECIFIC RULES:
1. Score structure FIRST and most harshly. Generic frameworks without case adaptation = 2 at most.
2. Evaluate whether responses were: (a) structured, (b) hypothesis-driven, (c) bottom-line first.
3. Score quantitative SEPARATELY from judgment.
4. A vague recommendation is a 2 on synthesis even if the rest was strong.
5. The McKinsey bar is EXCEPTIONALLY HIGH. A 3 means "meets the bar." Do NOT inflate scores.
6. If the candidate gave minimal or no responses, most dimensions should be 1-2.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, quantitative, businessJudgment, communication, hypothesisManagement, synthesis
Each score must be an INTEGER between 1 and 5.`;
  }

  if (firm === "bcg") {
    const dims = BCG_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using BCG's ACTUAL case interview rubric.
BCG-SPECIFIC RULES:
1. BCG is CANDIDATE-LED. Did the candidate DRIVE the case independently without waiting for prompts?
2. Creativity is a UNIQUE BCG dimension. Using textbook frameworks without original thinking = 2 at most on creativity.
3. Quantitative includes EXHIBIT ANALYSIS — can they extract the non-obvious insight from a chart?
4. Communication at BCG is collaborative — do they treat it as a dialogue or a solo performance?
5. BCG's bar is VERY HIGH. Most candidates score 2s on their first 15-20 cases. Do NOT inflate scores.
6. If the candidate waited for prompts rather than driving, candidateLed must be 1 or 2.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: candidateLed, structure, quantitative, creativity, communication
Each score must be an INTEGER between 1 and 5.`;
  }

  if (firm === "bain") {
    const dims = BAIN_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using Bain's ACTUAL case interview rubric.
BAIN-SPECIFIC RULES:
1. "ANSWER FIRST" is Bain's core principle. Did the candidate state a clear hypothesis immediately? If not, answerFirst cannot exceed 2.
2. Communication and composure are weighted HIGHER at Bain than at McKinsey or BCG.
3. Cultural fit ("Bainie factor") is an explicit scoring dimension. Were they collaborative, humble, and genuine?
4. Bain's structure standard is more flexible than McKinsey's — organized and clear matters more than perfect MECE.
5. If the candidate was defensive under pushback rather than curious, communication cannot exceed 2.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: answerFirst, structure, quantitative, communication, culturalFit, synthesis
Each score must be an INTEGER between 1 and 5.`;
  }

  if (firm === "ey") {
    const dims = EY_PARTHENON_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using EY-Parthenon's ACTUAL case interview rubric.
EY-PARTHENON-SPECIFIC RULES:
1. This is NOT standard Big 4 — EY-Parthenon is MBB-level difficulty. Do not inflate scores.
2. PE/investment judgment is a core dimension. Did the candidate think like an investor, not just a consultant?
3. Financial literacy is explicit — P&L, EBITDA, investment multiples. Score quantitative harshly if these are missing.
4. The most common EY-Parthenon failure: refusing to commit to a recommendation. If the candidate hedged their final answer, recommendation cannot exceed 2.
5. Candidate-led format — did they drive the case or wait for prompts?
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: problemSolving, quantitative, strategicJudgment, communication, recommendation
Each score must be an INTEGER between 1 and 5.`;
  }

  if (firm === "deloitte") {
    const dims = DELOITTE_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using Deloitte's ACTUAL case interview rubric.
DELOITTE-SPECIFIC RULES:
1. Deloitte explicitly names 5 dimensions: structured thinking, analytical ability, business acumen, communication, and professional demeanor/coachability.
2. Coachability is unique to Deloitte — score it harshly if the candidate was defensive under pushback or showed no intellectual curiosity.
3. Business acumen must reflect PRACTICAL judgment, not just theoretical strategy. Implementation awareness matters.
4. The communication standard: "clear, concise, and persuasive — can you walk someone through your logic under pressure?"
5. AI/digital transformation awareness is a plus given Deloitte's strategic focus.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, analytical, businessAcumen, communication, coachability
Each score must be an INTEGER between 1 and 5.`;
  }

  if (firm === "kpmg") {
    const dims = KPMG_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using KPMG's ACTUAL case interview rubric.
KPMG-SPECIFIC RULES:
1. KPMG cases are HYBRID — strategy AND operations/implementation. A recommendation missing the execution dimension is incomplete.
2. Values alignment is an EXPLICIT KPMG scoring dimension tied to: Integrity, Excellence, Courage, Together, For Better.
3. Operational judgment is weighted equally with structure. Did they address "how do we do this" alongside "what should we do"?
4. Professional mindset matters: were responses prudent, ethical, and client-aware?
5. If the candidate's recommendation had no implementation pathway, operationalJudgment cannot exceed 2.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, analytical, operationalJudgment, communication, valuesAlignment
Each score must be an INTEGER between 1 and 5.`;
  }

  if (firm === "pwc") {
    const dims = PWC_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using PwC Strategy&'s ACTUAL case interview rubric.
PWC STRATEGY&-SPECIFIC RULES:
1. Behavioral fit is an EXPLICIT ELIMINATOR at PwC — can disqualify regardless of case performance. Did the candidate show genuine motivation for Strategy& specifically?
2. Strategy& uses a capabilities-driven approach. Did the candidate identify what distinctive capabilities the client needs? Generic recommendations score below a 3.
3. Financial viability must accompany every strategic recommendation.
4. Hypothesis-driven structure is the expectation. No hypothesis = no score above 2 on structure.
5. "Long-term strategic alignment" not "short-term commercial upside" distinguishes Strategy& from EY-Parthenon.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, quantitative, strategicJudgment, communication, behavioralFit
Each score must be an INTEGER between 1 and 5.`;
  }

  if (firm === "rolandberger") {
    const dims = ROLAND_BERGER_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using Roland Berger's ACTUAL case interview rubric.
ROLAND BERGER-SPECIFIC RULES:
1. Roland Berger explicitly names four scoring dimensions: structure, execution, synthesis, entrepreneurial presence.
2. EXECUTION is critical: being passive is as costly as being structurally wrong. Did the candidate drive the analysis?
3. Roland Berger's synthesis format: root cause → recommendation → quantified impact. No number = incomplete.
4. Entrepreneurial presence: did the candidate spot opportunities, take initiative, and deliver pragmatic solutions?
5. Cases skew toward European industrial, automotive, and manufacturing contexts. Industry awareness is a plus.
6. Collaboration scores group case behavior — did they lead when needed and credit others?
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, execution, synthesis, entrepreneurialMindset, collaboration
Each score must be an INTEGER between 1 and 5.`;
  }

  if (firm === "accenture") {
    const dims = ACCENTURE_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using Accenture's ACTUAL case interview rubric.
ACCENTURE-SPECIFIC RULES:
1. Accenture explicitly names six core skills: structured thinking, problem solving, business judgment, quantitative ability, communication, and executive presence.
2. DIGITAL AWARENESS is embedded in business judgment — candidates who treat technology cases like pure strategy problems score below a 3.
3. Three unique case formats: Great Unknown (minimal data), Parade of Facts (dense data), Back of the Envelope (estimation).
4. Executive presence is an EXPLICIT dimension — would a Fortune 500 CEO trust this person?
5. Group case collaboration is scored — did the candidate advance the group's thinking?
6. 80/20 prioritization and forest vs. trees thinking are explicitly valued.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structuredThinking, problemSolving, businessJudgment, quantitative, communicationPresence, collaboration
Each score must be an INTEGER between 1 and 5.`;
  }

  return "";
}

function getFirmJsonSpec(firm: FirmKey): string {
  if (firm === "mckinsey") return `{
  "overallScore": <number 0-100>,
  "breakdown": { "structure": <1-5>, "quantitative": <1-5>, "businessJudgment": <1-5>, "communication": <1-5>, "hypothesisManagement": <1-5>, "synthesis": <1-5> },
  "whatWentWell": [<string>], "areasToImprove": [<string>],
  "topCandidateResponse": <string>, "firmSpecificNote": <string>, "percentileEstimate": <number 0-100>,
  "dimensionFeedback": { "structure": <string>, "quantitative": <string>, "businessJudgment": <string>, "communication": <string>, "hypothesisManagement": <string>, "synthesis": <string> }
}`;
  if (firm === "bcg") return `{
  "overallScore": <number 0-100>,
  "breakdown": { "candidateLed": <1-5>, "structure": <1-5>, "quantitative": <1-5>, "creativity": <1-5>, "communication": <1-5> },
  "whatWentWell": [<string>], "areasToImprove": [<string>],
  "topCandidateResponse": <string>, "firmSpecificNote": <string>, "percentileEstimate": <number 0-100>,
  "dimensionFeedback": { "candidateLed": <string>, "structure": <string>, "quantitative": <string>, "creativity": <string>, "communication": <string> }
}`;
  if (firm === "bain") return `{
  "overallScore": <number 0-100>,
  "breakdown": { "answerFirst": <1-5>, "structure": <1-5>, "quantitative": <1-5>, "communication": <1-5>, "culturalFit": <1-5>, "synthesis": <1-5> },
  "whatWentWell": [<string>], "areasToImprove": [<string>],
  "topCandidateResponse": <string>, "firmSpecificNote": <string>, "percentileEstimate": <number 0-100>,
  "dimensionFeedback": { "answerFirst": <string>, "structure": <string>, "quantitative": <string>, "communication": <string>, "culturalFit": <string>, "synthesis": <string> }
}`;
  if (firm === "ey") return `{
  "overallScore": <number 0-100>,
  "breakdown": { "problemSolving": <1-5>, "quantitative": <1-5>, "strategicJudgment": <1-5>, "communication": <1-5>, "recommendation": <1-5> },
  "whatWentWell": [<string>], "areasToImprove": [<string>],
  "topCandidateResponse": <string>, "firmSpecificNote": <string>, "percentileEstimate": <number 0-100>,
  "dimensionFeedback": { "problemSolving": <string>, "quantitative": <string>, "strategicJudgment": <string>, "communication": <string>, "recommendation": <string> }
}`;
  if (firm === "deloitte") return `{
  "overallScore": <number 0-100>,
  "breakdown": { "structure": <1-5>, "analytical": <1-5>, "businessAcumen": <1-5>, "communication": <1-5>, "coachability": <1-5> },
  "whatWentWell": [<string>], "areasToImprove": [<string>],
  "topCandidateResponse": <string>, "firmSpecificNote": <string>, "percentileEstimate": <number 0-100>,
  "dimensionFeedback": { "structure": <string>, "analytical": <string>, "businessAcumen": <string>, "communication": <string>, "coachability": <string> }
}`;
  if (firm === "kpmg") return `{
  "overallScore": <number 0-100>,
  "breakdown": { "structure": <1-5>, "analytical": <1-5>, "operationalJudgment": <1-5>, "communication": <1-5>, "valuesAlignment": <1-5> },
  "whatWentWell": [<string>], "areasToImprove": [<string>],
  "topCandidateResponse": <string>, "firmSpecificNote": <string>, "percentileEstimate": <number 0-100>,
  "dimensionFeedback": { "structure": <string>, "analytical": <string>, "operationalJudgment": <string>, "communication": <string>, "valuesAlignment": <string> }
}`;
  if (firm === "pwc") return `{
  "overallScore": <number 0-100>,
  "breakdown": { "structure": <1-5>, "quantitative": <1-5>, "strategicJudgment": <1-5>, "communication": <1-5>, "behavioralFit": <1-5> },
  "whatWentWell": [<string>], "areasToImprove": [<string>],
  "topCandidateResponse": <string>, "firmSpecificNote": <string>, "percentileEstimate": <number 0-100>,
  "dimensionFeedback": { "structure": <string>, "quantitative": <string>, "strategicJudgment": <string>, "communication": <string>, "behavioralFit": <string> }
}`;
  if (firm === "rolandberger") return `{
  "overallScore": <number 0-100>,
  "breakdown": { "structure": <1-5>, "execution": <1-5>, "synthesis": <1-5>, "entrepreneurialMindset": <1-5>, "collaboration": <1-5> },
  "whatWentWell": [<string>], "areasToImprove": [<string>],
  "topCandidateResponse": <string>, "firmSpecificNote": <string>, "percentileEstimate": <number 0-100>,
  "dimensionFeedback": { "structure": <string>, "execution": <string>, "synthesis": <string>, "entrepreneurialMindset": <string>, "collaboration": <string> }
}`;
  if (firm === "accenture") return `{
  "overallScore": <number 0-100>,
  "breakdown": { "structuredThinking": <1-5>, "problemSolving": <1-5>, "businessJudgment": <1-5>, "quantitative": <1-5>, "communicationPresence": <1-5>, "collaboration": <1-5> },
  "whatWentWell": [<string>], "areasToImprove": [<string>],
  "topCandidateResponse": <string>, "firmSpecificNote": <string>, "percentileEstimate": <number 0-100>,
  "dimensionFeedback": { "structuredThinking": <string>, "problemSolving": <string>, "businessJudgment": <string>, "quantitative": <string>, "communicationPresence": <string>, "collaboration": <string> }
}`;
  return `{
  "overallScore": <number 0-100>,
  "breakdown": { "structure": <number 0-100>, "problemSolving": <number 0-100>, "quantitative": <number 0-100>, "communication": <number 0-100>, "creativity": <number 0-100> },
  "whatWentWell": [<string>], "areasToImprove": [<string>],
  "topCandidateResponse": <string>, "firmSpecificNote": <string>, "percentileEstimate": <number 0-100>
}`;
}

const FIRM_RUBRICS: Record<string, { dimensions: { key: string; weight: number }[] }> = {
  mckinsey: MCKINSEY_RUBRIC,
  bcg: BCG_RUBRIC,
  bain: BAIN_RUBRIC,
  "ey-parthenon": EY_PARTHENON_RUBRIC,
  deloitte: DELOITTE_RUBRIC,
  kpmg: KPMG_RUBRIC,
  pwc: PWC_RUBRIC,
  "roland-berger": ROLAND_BERGER_RUBRIC,
  accenture: ACCENTURE_RUBRIC,
};

function calculateOfferDecision(firm: FirmKey, breakdown: Record<string, number>) {
  if (firm === "mckinsey") return calculateMckinseyOffer(breakdown);
  if (firm === "bcg") return calculateBcgOffer(breakdown);
  if (firm === "bain") return calculateBainOffer(breakdown);
  if (firm === "ey") return calculateEyParthenonOffer(breakdown);
  if (firm === "deloitte") return calculateDeloitteOffer(breakdown);
  if (firm === "kpmg") return calculateKpmgOffer(breakdown);
  if (firm === "pwc") return calculatePwcOffer(breakdown);
  if (firm === "rolandberger") return calculateRolandBergerOffer(breakdown);
  if (firm === "accenture") return calculateAccentureOffer(breakdown);
  return null;
}

function recalcWeightedScore(firm: FirmKey, breakdown: Record<string, number>): number {
  const rubric = FIRM_RUBRICS[firm];
  if (!rubric) return 50;
  let weighted = 0;
  for (const d of rubric.dimensions) {
    const score = breakdown[d.key] ?? 1;
    const normalized = ((score - 1) / 4) * 100;
    weighted += (normalized * d.weight) / 100;
  }
  return Math.round(weighted);
}

function getDefaultBreakdown(firm: FirmKey) {
  const rubric = FIRM_RUBRICS[firm];
  if (rubric) {
    return Object.fromEntries(rubric.dimensions.map(d => [d.key, 1]));
  }
  return { structure: 50, problemSolving: 50, quantitative: 50, communication: 50, creativity: 50 };
}

function getDefaultEvaluation(firm: FirmKey) {
  return {
    overallScore: 50,
    breakdown: getDefaultBreakdown(firm),
    whatWentWell: ["Session completed."],
    areasToImprove: ["Unable to generate full evaluation."],
    topCandidateResponse: "Unable to generate ideal response.",
    firmSpecificNote: "Unable to generate firm note.",
    percentileEstimate: 50,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { firm, transcript, hintsUsed, difficulty } = await req.json();

    const basePrompt = buildEvaluationPrompt(
      firm as FirmKey,
      transcript as Message[],
      hintsUsed,
      difficulty as Difficulty
    );

    const firmContext = buildFirmRubricContext(firm as FirmKey);
    const jsonSpec = getFirmJsonSpec(firm as FirmKey);
    const hasFirmRubric = !!FIRM_RUBRICS[firm];

    const fullPrompt = firmContext
      ? `${firmContext}\n\n${basePrompt}\n\nReturn ONLY valid JSON in this exact format:\n${jsonSpec}`
      : `${basePrompt}\n\nReturn ONLY valid JSON in this exact format:\n${jsonSpec}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: fullPrompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";

    let evaluation: any;
    try {
      evaluation = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      evaluation = getDefaultEvaluation(firm as FirmKey);
    }

    // Calculate offer decision and recalculate weighted score for firms with rubrics
    if (hasFirmRubric && evaluation.breakdown) {
      const offerResult = calculateOfferDecision(firm as FirmKey, evaluation.breakdown);
      if (offerResult) evaluation.offerDecision = offerResult;
      evaluation.overallScore = recalcWeightedScore(firm as FirmKey, evaluation.breakdown);
    }

    // Safety defaults
    evaluation.whatWentWell = evaluation.whatWentWell ?? [];
    evaluation.areasToImprove = evaluation.areasToImprove ?? [];
    evaluation.breakdown = evaluation.breakdown ?? getDefaultBreakdown(firm as FirmKey);
    evaluation.topCandidateResponse = evaluation.topCandidateResponse ?? "";
    evaluation.firmSpecificNote = evaluation.firmSpecificNote ?? "";
    evaluation.percentileEstimate = evaluation.percentileEstimate ?? 50;
    evaluation.overallScore = evaluation.overallScore ?? 50;

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(getDefaultEvaluation("mckinsey" as FirmKey), { status: 200 });
  }
}