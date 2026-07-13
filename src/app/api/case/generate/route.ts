import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUsageStatus } from "@/lib/usage";
import { callChatCompletion, extractJson } from "@/lib/ai/providers";
import { buildCaseGeneratorPrompt } from "@/lib/prompts/interviewer";
import { FirmKey, Difficulty } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.banned) {
      return NextResponse.json({ error: "Account suspended" }, { status: 403 });
    }

    const usage = await getUsageStatus(session.user.id);
    if (!usage.allowed) {
      return NextResponse.json({ error: "AI case limit reached for this window" }, { status: 429 });
    }

    const { type, difficulty, firm } = await req.json();

    const prompt = buildCaseGeneratorPrompt(type, difficulty as Difficulty, firm as FirmKey);

    const { text, provider } = await callChatCompletion({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 1000,
      jsonMode: true,
    });

    const caseData = extractJson(text);

    return NextResponse.json({ ...caseData, provider });
  } catch (error) {
    console.error("Case generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate case" },
      { status: 500 }
    );
  }
}
