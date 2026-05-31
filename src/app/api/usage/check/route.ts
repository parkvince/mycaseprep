import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const CASE_LIMIT = 2;
const WINDOW_HOURS = 12;

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: "",
      },
      include: { usage: true },
    });

    if (!user.usage) {
      return NextResponse.json({
        allowed: true,
        casesUsed: 0,
        casesRemaining: CASE_LIMIT,
        windowStart: null,
        resetsAt: null,
      });
    }

    const now = new Date();
    const windowStart = new Date(user.usage.windowStart);
    const windowEnd = new Date(windowStart.getTime() + WINDOW_HOURS * 60 * 60 * 1000);
    const windowExpired = now > windowEnd;

    if (windowExpired) {
      await prisma.usage.update({
        where: { userId: user.id },
        data: {
          casesUsed: 0,
          windowStart: now,
        },
      });
      return NextResponse.json({
        allowed: true,
        casesUsed: 0,
        casesRemaining: CASE_LIMIT,
        windowStart: now,
        resetsAt: new Date(now.getTime() + WINDOW_HOURS * 60 * 60 * 1000),
      });
    }

    const casesUsed = user.usage.casesUsed;
    const allowed = casesUsed < CASE_LIMIT;

    return NextResponse.json({
      allowed,
      casesUsed,
      casesRemaining: Math.max(0, CASE_LIMIT - casesUsed),
      windowStart: windowStart,
      resetsAt: windowEnd,
    });
  } catch (error) {
    console.error("Usage check error:", error);
    return NextResponse.json({ error: "Failed to check usage" }, { status: 500 });
  }
}