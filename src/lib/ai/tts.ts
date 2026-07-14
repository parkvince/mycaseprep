// Text-to-speech via Gemini's native TTS models, reusing the same GEMINI_API_KEY
// already configured for the text fallback chain - no separate signup needed.
// Returns null (rather than throwing) whenever TTS isn't usable, so callers can
// fall back to the browser's built-in speechSynthesis without special-casing errors.

const TTS_MODEL = "gemini-2.5-flash-preview-tts";

const VOICE_BY_GENDER: Record<"male" | "female", string> = {
  male: "Charon",
  female: "Kore",
};

/** Wraps raw PCM samples in a standard 44-byte WAV header so browsers can play them. */
function pcmToWav(pcm: Buffer, sampleRate: number, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcm.length;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcm]);
}

const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 12000;
// Rate limits (429) and transient server errors (5xx) are worth a quick retry - 
// a mid-interview quota blip shouldn't be the reason the voice suddenly changes.
const RETRYABLE_STATUS = (status: number) => status === 429 || status >= 500;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function synthesizeSpeech(text: string, gender: "male" | "female"): Promise<Buffer | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent`,
        {
          method: "POST",
          headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_BY_GENDER[gender] } } },
            },
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (!res.ok) {
        if (RETRYABLE_STATUS(res.status) && attempt < MAX_ATTEMPTS) {
          await sleep(400 * attempt);
          continue;
        }
        return null;
      }

      const json = await res.json();
      const part = json.candidates?.[0]?.content?.parts?.[0];
      const base64 = part?.inlineData?.data;
      const mimeType: string | undefined = part?.inlineData?.mimeType;
      if (!base64 || !mimeType) return null;

      const rateMatch = mimeType.match(/rate=(\d+)/);
      const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
      const pcm = Buffer.from(base64, "base64");
      return pcmToWav(pcm, sampleRate);
    } catch {
      clearTimeout(timeoutId);
      // Network blip or timeout - retry the same way as a transient server error.
      if (attempt < MAX_ATTEMPTS) {
        await sleep(400 * attempt);
        continue;
      }
      return null;
    }
  }
  return null;
}
