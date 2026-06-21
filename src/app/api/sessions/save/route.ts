import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { type, firm, difficulty, caseTitle, duration, hintsUsed, overallScore, transcript, guidedScore } = body;

    const caseSession = await prisma.caseSession.create({
      data: {
        userId,
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

    if (type === "ai") {
      const now = new Date();
      const usageRecord = await prisma.dailyUsage.findUnique({ where: { userId } });
      if (!usageRecord) {
        await prisma.dailyUsage.create({ data: { userId, casesUsed: 1, windowStart: now } });
      } else {
        const windowEnd = new Date(usageRecord.windowStart.getTime() + 12 * 60 * 60 * 1000);
        if (now > windowEnd) {
          await prisma.dailyUsage.update({ where: { userId }, data: { casesUsed: 1, windowStart: now } });
        } else {
          await prisma.dailyUsage.update({ where: { userId }, data: { casesUsed: { increment: 1 } } });
        }
      }
    }

    return NextResponse.json({ success: true, sessionId: caseSession.id });
  } catch (error) {
    console.error("Save session error:", error);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}