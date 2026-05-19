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

    const evaluation = JSON.parse(text.replace(/```json|```/g, "").trim());

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate session" },
      { status: 500 }
    );
  }
}