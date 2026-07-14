import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Three-tier fallback chain: Groq (free) -> Gemini (free) -> Claude (paid, safety
// net). Groq and Gemini are both called through their OpenAI-compatible endpoints
// so they share one code path; Claude uses the native Anthropic SDK since its
// Messages API isn't OpenAI-compatible.

export type ProviderName = "groq" | "gemini" | "claude";

export const PROVIDER_ORDER: ProviderName[] = ["groq", "gemini", "claude"];

const groqClient = process.env.GROQ_API_KEY
  ? new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" })
  : null;

const geminiClient = process.env.GEMINI_API_KEY
  ? new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    })
  : null;

const anthropicClient = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const MODEL_BY_PROVIDER: Record<ProviderName, string> = {
  groq: "llama-3.3-70b-versatile",
  gemini: "gemini-2.5-flash",
  claude: "claude-sonnet-4-5",
};

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CallChatCompletionOptions {
  messages: ChatMessage[];
  maxTokens: number;
  temperature?: number;
  jsonMode?: boolean;
  /** From a prior response in the same session - try this provider first. */
  preferredProvider?: ProviderName | null;
}

export interface CallChatCompletionResult {
  text: string;
  provider: ProviderName;
}

async function callOpenAICompatible(
  client: OpenAI,
  provider: "groq" | "gemini",
  opts: CallChatCompletionOptions
): Promise<string> {
  const completion = await client.chat.completions.create({
    model: MODEL_BY_PROVIDER[provider],
    messages: opts.messages,
    max_tokens: opts.maxTokens,
    temperature: opts.temperature ?? 0.7,
    ...(opts.jsonMode ? { response_format: { type: "json_object" as const } } : {}),
  });
  return completion.choices[0]?.message?.content ?? "";
}

async function callClaude(opts: CallChatCompletionOptions): Promise<string> {
  if (!anthropicClient) throw new Error("ANTHROPIC_API_KEY not configured");
  const systemMsg = opts.messages.find((m) => m.role === "system");
  const rest = opts.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const response = await anthropicClient.messages.create({
    model: MODEL_BY_PROVIDER.claude,
    max_tokens: opts.maxTokens,
    temperature: opts.temperature ?? 0.7,
    ...(systemMsg ? { system: systemMsg.content } : {}),
    messages: rest,
  });
  return response.content[0]?.type === "text" ? response.content[0].text : "";
}

const PROVIDER_TIMEOUT_MS = 12000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); }
    );
  });
}

async function callProvider(provider: ProviderName, opts: CallChatCompletionOptions): Promise<string> {
  if (provider === "groq") {
    if (!groqClient) throw new Error("GROQ_API_KEY not configured");
    return callOpenAICompatible(groqClient, "groq", opts);
  }
  if (provider === "gemini") {
    if (!geminiClient) throw new Error("GEMINI_API_KEY not configured");
    return callOpenAICompatible(geminiClient, "gemini", opts);
  }
  return callClaude(opts);
}

/**
 * Tries the preferred provider first (if one was already established for this
 * session), then cascades through the rest of the chain in order. Throws only
 * if every configured provider fails - an unconfigured provider (missing API
 * key) is treated the same as a failure and skipped.
 */
export async function callChatCompletion(opts: CallChatCompletionOptions): Promise<CallChatCompletionResult> {
  const order = opts.preferredProvider
    ? [opts.preferredProvider, ...PROVIDER_ORDER.filter((p) => p !== opts.preferredProvider)]
    : PROVIDER_ORDER;

  const errors: string[] = [];
  for (const provider of order) {
    try {
      const text = await withTimeout(callProvider(provider, opts), PROVIDER_TIMEOUT_MS, provider);
      if (text && text.trim().length > 0) {
        return { text, provider };
      }
      errors.push(`${provider}: empty response`);
    } catch (err) {
      errors.push(`${provider}: ${err instanceof Error ? err.message : String(err)}`);
      console.error(`[ai-fallback] ${provider} failed, trying next provider:`, err);
    }
  }

  throw new Error(`All AI providers failed or are unconfigured: ${errors.join(" | ")}`);
}

/** Strips markdown fences and extracts the first balanced {...} block. */
export function extractJson(text: string): any {
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    if (start === -1) throw new Error("No JSON object found in model output");
    let depth = 0;
    for (let i = start; i < cleaned.length; i++) {
      if (cleaned[i] === "{") depth++;
      if (cleaned[i] === "}") {
        depth--;
        if (depth === 0) return JSON.parse(cleaned.slice(start, i + 1));
      }
    }
    throw new Error("Unbalanced JSON in model output");
  }
}
