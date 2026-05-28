import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      type,
      firm,
      difficulty,
      caseTitle,
      duration,
      hintsUsed,
      overallScore,
      transcript,
      guidedScore,
    } = body;

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: "",
      },
    });

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        type,
        firm,
        difficulty,
        caseTitle,
        duration,
        hintsUsed: hintsUsed ?? 0,
        overallScore: overallScore ?? null,
        transcript: transcript ?? null,
        guidedScore: guidedScore ?? null,
      },
    });

    return NextResponse.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Save session error:", error);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}