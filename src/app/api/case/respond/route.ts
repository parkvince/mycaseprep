import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { buildInterviewerSystemPrompt } from "@/lib/prompts/interviewer";
import { FirmKey, Difficulty, Message } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const {
      firm,
      casePrompt,
      difficulty,
      transcript,
      hintsUsed,
      personality,
    } = await req.json();

    const systemPrompt = buildInterviewerSystemPrompt(
      firm as FirmKey,
      casePrompt,
      difficulty as Difficulty,
      hintsUsed,
      personality
    );

    const messages = transcript.map((t: Message) => ({
      role: t.role as "user" | "assistant",
      content: t.content,
    }));

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 300,
      system: systemPrompt,
      messages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Interviewer response error:", error);
    return NextResponse.json(
      { error: "Failed to get interviewer response" },
      { status: 500 }
    );
  }
}