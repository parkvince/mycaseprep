import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { callChatCompletion, ProviderName } from "@/lib/ai/providers";
import { buildInterviewerSystemPrompt } from "@/lib/prompts/interviewer";
import { FirmKey, Difficulty, Message } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.banned) {
      return NextResponse.json({ error: "Account suspended" }, { status: 403 });
    }

    const {
      firm,
      casePrompt,
      difficulty,
      transcript,
      hintsUsed,
      personality,
      preferredProvider,
    } = await req.json();

    const systemPrompt = buildInterviewerSystemPrompt(
      firm as FirmKey,
      casePrompt,
      difficulty as Difficulty,
      hintsUsed,
      personality
    );

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...transcript.map((t: Message) => ({
        role: t.role as "user" | "assistant",
        content: t.content,
      })),
    ];

    const { text, provider } = await callChatCompletion({
      messages,
      maxTokens: 300,
      preferredProvider: (preferredProvider as ProviderName) ?? null,
    });

    return NextResponse.json({ response: text, provider });
  } catch (error) {
    console.error("Interviewer response error:", error);
    return NextResponse.json(
      { error: "Failed to get interviewer response" },
      { status: 500 }
    );
  }
}
