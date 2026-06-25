import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { buildEvaluationPrompt } from "@/lib/prompts/interviewer";
import { FirmKey, Difficulty, Message } from "@/types";
import { MCKINSEY_RUBRIC, calculateMckinseyOffer } from "@/lib/firmRubrics/mckinsey";

function buildFirmRubricContext(firm: FirmKey): string {
  if (firm === "mckinsey") {
    const dims = MCKINSEY_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");

    return `
You are evaluating this candidate using McKinsey's ACTUAL Problem-Solving Interview rubric.

MCKINSEY-SPECIFIC SCORING RULES (follow these strictly):
1. Score structure FIRST and most harshly. McKinsey cases are won or lost on structure. Generic frameworks without case adaptation = 2 at most.
2. McKinsey format is interviewer-led. Evaluate whether responses to each prompt were: (a) structured, (b) hypothesis-driven, (c) bottom-line first.
3. Score quantitative SEPARATELY from judgment. Independent skills.
4. A vague or hedged recommendation is a 2 on synthesis even if the rest was strong.
5. Communication at McKinsey means CONCISE and PRECISE. Verbose answers with buried conclusions = 3 at best.
6. A score of 1 on structure or quantitative is disqualifying. Be honest.
7. The McKinsey bar is EXCEPTIONALLY HIGH. A 3 means "meets the bar." Most candidates in their first 20 cases score mostly 2s. Do NOT inflate scores.
8. If the candidate gave minimal or no responses, most dimensions should be 1-2.

SCORING DIMENSIONS AND CRITERIA:
${dims}

IMPORTANT: You must return scores for these EXACT keys:
- structure (weight 28%)
- quantitative (weight 22%)  
- businessJudgment (weight 18%)
- communication (weight 17%)
- hypothesisManagement (weight 10%)
- synthesis (weight 5%)

Each score must be an INTEGER between 1 and 5.
`;
  }
  return "";
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

    const isMckinsey = firm === "mckinsey";

    const mckinseyJsonSpec = isMckinsey ? `
{
  "overallScore": <number 0-100>,
  "breakdown": {
    "structure": <1-5>,
    "quantitative": <1-5>,
    "businessJudgment": <1-5>,
    "communication": <1-5>,
    "hypothesisManagement": <1-5>,
    "synthesis": <1-5>
  },
  "whatWentWell": [<string>, ...],
  "areasToImprove": [<string>, ...],
  "topCandidateResponse": <string>,
  "firmSpecificNote": <string>,
  "percentileEstimate": <number 0-100>,
  "dimensionFeedback": {
    "structure": <string — specific feedback>,
    "quantitative": <string>,
    "businessJudgment": <string>,
    "communication": <string>,
    "hypothesisManagement": <string>,
    "synthesis": <string>
  }
}` : `
{
  "overallScore": <number 0-100>,
  "breakdown": {
    "structure": <number 0-100>,
    "problemSolving": <number 0-100>,
    "quantitative": <number 0-100>,
    "communication": <number 0-100>,
    "creativity": <number 0-100>
  },
  "whatWentWell": [<string>, ...],
  "areasToImprove": [<string>, ...],
  "topCandidateResponse": <string>,
  "firmSpecificNote": <string>,
  "percentileEstimate": <number 0-100>
}`;

    const fullPrompt = firmContext
      ? `${firmContext}\n\n${basePrompt}\n\nReturn ONLY valid JSON in this exact format:\n${mckinseyJsonSpec}`
      : `${basePrompt}\n\nReturn ONLY valid JSON in this exact format:\n${mckinseyJsonSpec}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: fullPrompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";

    let evaluation;
    try {
      evaluation = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      evaluation = getDefaultEvaluation(isMckinsey);
    }

    // For McKinsey: calculate offer decision from dimension scores
    if (isMckinsey && evaluation.breakdown) {
      const offerResult = calculateMckinseyOffer({
        structure: evaluation.breakdown.structure ?? 1,
        quantitative: evaluation.breakdown.quantitative ?? 1,
        businessJudgment: evaluation.breakdown.businessJudgment ?? 1,
        communication: evaluation.breakdown.communication ?? 1,
        hypothesisManagement: evaluation.breakdown.hypothesisManagement ?? 1,
        synthesis: evaluation.breakdown.synthesis ?? 1,
      });

      evaluation.offerDecision = offerResult;

      // Recalculate overallScore from weighted dimensions for McKinsey
      const dims = MCKINSEY_RUBRIC.dimensions;
      let weighted = 0;
      for (const d of dims) {
        const score = evaluation.breakdown[d.key] ?? 1;
        const normalized = ((score - 1) / 4) * 100;
        weighted += (normalized * d.weight) / 100;
      }
      evaluation.overallScore = Math.round(weighted);
    }

    // Safety defaults
    evaluation.whatWentWell = evaluation.whatWentWell ?? [];
    evaluation.areasToImprove = evaluation.areasToImprove ?? [];
    evaluation.breakdown = evaluation.breakdown ?? getDefaultBreakdown(isMckinsey);
    evaluation.topCandidateResponse = evaluation.topCandidateResponse ?? "";
    evaluation.firmSpecificNote = evaluation.firmSpecificNote ?? "";
    evaluation.percentileEstimate = evaluation.percentileEstimate ?? 50;
    evaluation.overallScore = evaluation.overallScore ?? 50;

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(getDefaultEvaluation(false), { status: 200 });
  }
}

function getDefaultBreakdown(isMckinsey: boolean) {
  if (isMckinsey) {
    return { structure: 1, quantitative: 1, businessJudgment: 1, communication: 1, hypothesisManagement: 1, synthesis: 1 };
  }
  return { structure: 50, problemSolving: 50, quantitative: 50, communication: 50, creativity: 50 };
}

function getDefaultEvaluation(isMckinsey: boolean) {
  return {
    overallScore: 50,
    breakdown: getDefaultBreakdown(isMckinsey),
    whatWentWell: ["Session completed."],
    areasToImprove: ["Unable to generate full evaluation."],
    topCandidateResponse: "Unable to generate ideal response.",
    firmSpecificNote: "Unable to generate firm note.",
    percentileEstimate: 50,
  };
}