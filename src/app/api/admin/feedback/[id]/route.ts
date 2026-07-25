// FEEDBACK-FEATURE: admin-only per-item actions on a feedback submission -
// mark resolved / reopen (PATCH) and dismiss (DELETE).
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminAuth";
import { logAdminAction } from "@/lib/audit";

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/admin/feedback/[id]">) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    if (typeof body.resolved !== "boolean") {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: { resolved: body.resolved },
    });

    await logAdminAction({ adminEmail: admin.user?.email ?? "unknown", action: body.resolved ? "feedback.resolve" : "feedback.reopen", targetType: "feedback", targetId: id, targetLabel: updated.email, detail: updated.category });

    return NextResponse.json({ id: updated.id, resolved: updated.resolved });
  } catch (error) {
    console.error("Admin feedback update error:", error);
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/admin/feedback/[id]">) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await ctx.params;
    const deleted = await prisma.feedback.delete({ where: { id } });

    await logAdminAction({ adminEmail: admin.user?.email ?? "unknown", action: "feedback.delete", targetType: "feedback", targetId: id, targetLabel: deleted.email, detail: deleted.category });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin feedback delete error:", error);
    return NextResponse.json({ error: "Failed to delete feedback" }, { status: 500 });
  }
}
