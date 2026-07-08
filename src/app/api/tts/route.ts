import { NextRequest, NextResponse } from "next/server";
import { synthesizeSpeech } from "@/lib/ai/tts";

export async function POST(req: NextRequest) {
  try {
    const { text, gender } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
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
