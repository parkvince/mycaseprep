import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { synthesizeSpeech } from "@/lib/ai/tts";

const MAX_TEXT_LENGTH = 2000;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.banned) {
      return NextResponse.json({ error: "Account suspended" }, { status: 403 });
    }

    const { text, gender } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: "Text too long" }, { status: 400 });
    }

    const wav = await synthesizeSpeech(text, gender === "male" ? "male" : "female");
    if (!wav) {
      return NextResponse.json({ error: "TTS unavailable" }, { status: 503 });
    }

    return new NextResponse(new Uint8Array(wav), {
      status: 200,
      headers: { "Content-Type": "audio/wav", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "TTS request failed" }, { status: 500 });
  }
}
