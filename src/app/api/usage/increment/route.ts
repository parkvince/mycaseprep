import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
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

    const now = new Date();

    if (!user.usage) {
      await prisma.usage.create({
        data: {
          userId: user.id,
          casesUsed: 1,
          windowStart: now,
        },
      });
    } else {
      const windowStart = new Date(user.usage.windowStart);
      const windowEnd = new Date(windowStart.getTime() + 12 * 60 * 60 * 1000);
      const windowExpired = now > windowEnd;

      if (windowExpired) {
        await prisma.usage.update({
          where: { userId: user.id },
          data: {
            casesUsed: 1,
            windowStart: now,
          },
        });
      } else {
        await prisma.usage.update({
          where: { userId: user.id },
          data: {
            casesUsed: { increment: 1 },
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Usage increment error:", error);
    return NextResponse.json({ error: "Failed to increment usage" }, { status: 500 });
  }
}