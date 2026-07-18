import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Self-service data export (GDPR/CCPA-style access right). Returns everything this
// account holds about itself as a downloadable JSON file — profile, usage, and the
// full transcript of every practice session.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        unlimitedCases: true,
        bonusCases: true,
        caseSessions: {
          orderBy: { completedAt: "desc" },
          select: {
            id: true,
            type: true,
            caseType: true,
            firm: true,
            difficulty: true,
            caseTitle: true,
            duration: true,
            hintsUsed: true,
            overallScore: true,
            guidedScore: true,
            transcript: true,
            completedAt: true,
          },
        },
        dailyUsage: { select: { casesUsed: true, windowStart: true } },
      },
    });

    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const payload = {
      exportedAt: new Date().toISOString(),
      account: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        unlimitedCases: user.unlimitedCases,
        bonusCases: user.bonusCases,
      },
      usage: user.dailyUsage,
      sessions: user.caseSessions,
    };

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="mycaseprep-data-export.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Data export error:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
