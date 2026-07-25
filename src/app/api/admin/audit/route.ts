// AUDIT-LOG: admin-only, read-only feed of the AdminAuditLog trail. Powers the
// "Activity" view on the admin page. Capped so the response stays bounded.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const entries = await prisma.adminAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      select: {
        id: true,
        adminEmail: true,
        action: true,
        targetType: true,
        targetLabel: true,
        detail: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Admin audit list error:", error);
    return NextResponse.json({ error: "Failed to load activity" }, { status: 500 });
  }
}
