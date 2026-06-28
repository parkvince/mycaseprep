import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

  // Delete any existing tokens for this email then create fresh
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({ data: { identifier: email, token, expires } });

  const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: "MyCasePrep <onboarding@resend.dev>",
    to: email,
    subject: "Verify your MyCasePrep account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">Verify your email</h2>
        <p style="color: #666; margin-bottom: 24px;">Click the button below to activate your MyCasePrep account.</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #7c5cfc; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
          Verify email
        </a>
        <p style="color: #999; font-size: 13px; margin-top: 24px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}