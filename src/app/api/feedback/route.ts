// FEEDBACK-FEATURE: public endpoint backing the /feedback page. Accepts a support
// / feedback submission and stores it for the operator to read in the admin panel.
// Email is required (the submitter may be logged out) so the operator can reply.
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CATEGORIES = ["bug", "feature", "question", "other", "general"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json().catch(() => ({}));

    const message = typeof body.message === "string" ? body.message.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const category = CATEGORIES.includes(body.category) ? body.category : "general";

    if (!EMAIL_RE.test(email) || email.length > 320) {
      return NextResponse.json({ error: "Please enter a valid email so we can reply." }, { status: 400 });
    }
    if (message.length < 3) {
      return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "Message is too long (5000 characters max)." }, { status: 400 });
    }

    await prisma.feedback.create({
      data: {
        message,
        email,
        category,
        userId: session?.user?.id ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
