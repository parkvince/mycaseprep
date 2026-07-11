import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminAuth";
import { isAdminEmail } from "@/lib/admin";

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/admin/users/[id]">) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await ctx.params;
    const target = await prisma.user.findUnique({ where: { id }, select: { email: true } });
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (isAdminEmail(target.email)) {
      return NextResponse.json({ error: "Can't modify the admin account" }, { status: 400 });
    }

    const body = await req.json();
    const data: { unlimitedCases?: boolean; bonusCases?: number; banned?: boolean } = {};
    if (typeof body.unlimitedCases === "boolean") data.unlimitedCases = body.unlimitedCases;
    if (typeof body.bonusCases === "number" && Number.isFinite(body.bonusCases)) {
      data.bonusCases = Math.max(0, Math.floor(body.bonusCases));
    }
    if (typeof body.banned === "boolean") data.banned = body.banned;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await prisma.user.update({ where: { id }, data });
    return NextResponse.json({
      id: updated.id,
      unlimitedCases: updated.unlimitedCases,
      bonusCases: updated.bonusCases,
      banned: updated.banned,
    });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/admin/users/[id]">) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await ctx.params;
    const target = await prisma.user.findUnique({ where: { id }, select: { email: true } });
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (isAdminEmail(target.email)) {
      return NextResponse.json({ error: "Can't delete the admin account" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.caseSession.deleteMany({ where: { userId: id } }),
      prisma.dailyUsage.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
