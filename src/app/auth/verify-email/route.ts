import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { token, email } = await req.json();
  if (!token || !email) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const record = await prisma.verificationToken.findFirst({ where: { identifier: email } });
  if (!record || record.token !== token) return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  if (record.expires < new Date()) return NextResponse.json({ error: "Token expired" }, { status: 400 });

  await prisma.user.update({ where: { email }, data: { emailVerified: new Date() } });
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  return NextResponse.json({ success: true });
}