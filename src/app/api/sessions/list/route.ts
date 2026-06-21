import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ sessions: [] });
    }

    const sessions = await prisma.caseSession.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("List sessions error:", error);
    return NextResponse.json({ sessions: [] });
  }
}