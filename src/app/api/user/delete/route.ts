import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";

// Self-service account deletion (GDPR/CCPA-style erasure right). Wipes the account
// and everything attached to it immediately - no email, no 30-day wait. Requires
// the caller to re-type their exact email as a confirmation, so a stray click or
// a CSRF-style POST can't nuke an account.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // The single-owner admin account can't be self-deleted - it would lock the app
    // out of its own admin surface. (An owner who really wants out does it in the DB.)
    if (isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "The admin account can't be deleted here." }, { status: 400 });
    }

    const { confirmEmail } = await req.json();
    if (typeof confirmEmail !== "string" || confirmEmail.trim().toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json({ error: "Email confirmation didn't match." }, { status: 400 });
    }

    const userId = session.user.id;
    await prisma.$transaction([
      prisma.caseSession.deleteMany({ where: { userId } }),
      prisma.dailyUsage.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
