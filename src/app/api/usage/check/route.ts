import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const CASE_LIMIT = 2;
const WINDOW_HOURS = 12;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { unlimitedCases: true, bonusCases: true } });
    if (user?.unlimitedCases) {
      return NextResponse.json({
        allowed: true,
        unlimited: true,
        casesUsed: 0,
        casesRemaining: null,
        windowStart: null,
        resetsAt: null,
      });
    }
    const limit = CASE_LIMIT + (user?.bonusCases ?? 0);

    const usageRecord = await prisma.dailyUsage.findUnique({ where: { userId } });

    if (!usageRecord) {
      return NextResponse.json({
        allowed: true,
        casesUsed: 0,
        casesRemaining: limit,
        windowStart: null,
        resetsAt: null,
      });
    }

    const now = new Date();
    const windowStart = new Date(usageRecord.windowStart);
    const windowEnd = new Date(windowStart.getTime() + WINDOW_HOURS * 60 * 60 * 1000);
    const windowExpired = now > windowEnd;

    if (windowExpired) {
      await prisma.dailyUsage.update({
        where: { userId },
        data: { casesUsed: 0, windowStart: now },
      });
      return NextResponse.json({
        allowed: true,
        casesUsed: 0,
        casesRemaining: limit,
        windowStart: now,
        resetsAt: new Date(now.getTime() + WINDOW_HOURS * 60 * 60 * 1000),
      });
    }

    const casesUsed = usageRecord.casesUsed;
    const allowed = casesUsed < limit;

    return NextResponse.json({
      allowed,
      casesUsed,
      casesRemaining: Math.max(0, limit - casesUsed),
      windowStart,
      resetsAt: windowEnd,
    });
  } catch (error) {
    console.error("Usage check error:", error);
    return NextResponse.json({ error: "Failed to check usage" }, { status: 500 });
  }
}