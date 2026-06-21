import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    const usageRecord = await prisma.dailyUsage.findUnique({ where: { userId } });

    if (!usageRecord) {
      await prisma.dailyUsage.create({
        data: { userId, casesUsed: 1, windowStart: now },
      });
    } else {
      const windowEnd = new Date(usageRecord.windowStart.getTime() + 12 * 60 * 60 * 1000);
      const windowExpired = now > windowEnd;

      if (windowExpired) {
        await prisma.dailyUsage.update({
          where: { userId },
          data: { casesUsed: 1, windowStart: now },
        });
      } else {
        await prisma.dailyUsage.update({
          where: { userId },
          data: { casesUsed: { increment: 1 } },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Usage increment error:", error);
    return NextResponse.json({ error: "Failed to increment usage" }, { status: 500 });
  }
}