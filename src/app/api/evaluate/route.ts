import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { buildEvaluationPrompt } from "@/lib/prompts/interviewer";
import { FirmKey, Difficulty, Message } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { firm, transcript, hintsUsed, difficulty } = await req.json();

    const prompt = buildEvaluationPrompt(
      firm as FirmKey,
      transcript as Message[],
      hintsUsed,
      difficulty as Difficulty
    );

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "{}";

    let evaluation;
    try {
      evaluation = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      // If parsing fails return a safe default
      evaluation = {
        overallScore: 50,
        breakdown: {
          structure: 50,
          problemSolving: 50,
          quantitative: 50,
          communication: 50,
          creativity: 50,
        },
        whatWentWell: ["Unable to parse evaluation. Please try again."],
        areasToImprove: ["Unable to parse evaluation. Please try again."],
        topCandidateResponse: "Unable to generate ideal response.",
        firmSpecificNote: "Unable to generate firm note.",
        percentileEstimate: 50,
      };
    }

    // Safety check — ensure all fields exist
    evaluation.whatWentWell = evaluation.whatWentWell ?? [];
    evaluation.areasToImprove = evaluation.areasToImprove ?? [];
    evaluation.breakdown = evaluation.breakdown ?? {
      structure: 50,
      problemSolving: 50,
      quantitative: 50,
      communication: 50,
      creativity: 50,
    };
    evaluation.topCandidateResponse = evaluation.topCandidateResponse ?? "";
    evaluation.firmSpecificNote = evaluation.firmSpecificNote ?? "";
    evaluation.percentileEstimate = evaluation.percentileEstimate ?? 50;
    evaluation.overallScore = evaluation.overallScore ?? 50;

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      {
        overallScore: 50,
        breakdown: {
          structure: 50,
          problemSolving: 50,
          quantitative: 50,
          communication: 50,
          creativity: 50,
        },
        whatWentWell: ["Session completed."],
        areasToImprove: ["Add your Anthropic API key to enable full evaluation."],
        topCandidateResponse: "Add your Anthropic API key to see the ideal response.",
        firmSpecificNote: "Add your Anthropic API key to see firm-specific feedback.",
        percentileEstimate: 50,
      },
      { status: 200 }
    );
  }
}