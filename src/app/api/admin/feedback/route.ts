// FEEDBACK-FEATURE: admin-only list of feedback/support submissions. Powers the
// "Feedback" view on the admin page.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: [{ resolved: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        email: true,
        category: true,
        message: true,
        resolved: true,
        createdAt: true,
        userId: true,
      },
    });

    return NextResponse.json({ feedback, totalOpen: feedback.filter(f => !f.resolved).length });
  } catch (error) {
    console.error("Admin feedback list error:", error);
    return NextResponse.json({ error: "Failed to load feedback" }, { status: 500 });
  }
}
