import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { buildCaseGeneratorPrompt } from "@/lib/prompts/interviewer";
import { FirmKey, Difficulty } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { type, difficulty, firm } = await req.json();

    const prompt = buildCaseGeneratorPrompt(
      type,
      difficulty as Difficulty,
      firm as FirmKey
    );

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "{}";

    const caseData = JSON.parse(text.replace(/```json|```/g, "").trim());

    return NextResponse.json(caseData);
  } catch (error) {
    console.error("Case generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate case" },
      { status: 500 }
    );
  }
}