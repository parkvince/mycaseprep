import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        unlimitedCases: true,
        bonusCases: true,
        banned: true,
        // Only score/date fields — never the transcript content of another user's session.
        caseSessions: {
          select: { overallScore: true, guidedScore: true, completedAt: true },
        },
      },
    });

    const shaped = users.map(u => {
      const scored = u.caseSessions
        .map(s => s.overallScore ?? s.guidedScore)
        .filter((s): s is number => s != null);
      const avgScore = scored.length > 0 ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : null;
      const lastActive = u.caseSessions.reduce<Date | null>((latest, s) => {
        const d = new Date(s.completedAt);
        return !latest || d > latest ? d : latest;
      }, null);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image,
        createdAt: u.createdAt,
        unlimitedCases: u.unlimitedCases,
        bonusCases: u.bonusCases,
        banned: u.banned,
        sessionCount: u.caseSessions.length,
        avgScore,
        lastActive,
      };
    });

    return NextResponse.json({ users: shaped, totalUsers: shaped.length });
  } catch (error) {
    console.error("Admin users list error:", error);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
