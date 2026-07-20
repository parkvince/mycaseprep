import { FIRM_CONFIGS } from "./firms";
import { FirmKey, Difficulty, Message } from "@/types";

export function buildInterviewerSystemPrompt(
  firm: FirmKey,
  casePrompt: string,
  difficulty: Difficulty,
  hintsUsed: number,
  personality: "strict" | "friendly"
): string {
  const config = FIRM_CONFIGS[firm];

  const personalityGuide =
    personality === "strict"
      ? "You are a demanding senior partner. You push back hard on vague answers. You do not hand-hold."
      : "You are a friendly associate. You are rigorous but encouraging. You give small nudges when the candidate is stuck.";

  const difficultyGuide =
    difficulty === "advanced"
      ? "This is an advanced case. Expect sharp, precise, hypothesis-driven answers. Push back on anything vague."
      : difficulty === "beginner"
      ? "This is a beginner case. Be patient. Guide gently without giving answers away."
      : "This is an intermediate case. Hold a high bar but be constructive.";

  // Real interviews escalate. Beginners get one gentle challenge so they learn the
  // shape of a pushback; advanced candidates get a genuine rapid-fire stress test.
  const pushbackCount =
    difficulty === "advanced"
      ? "FOUR separate times"
      : difficulty === "beginner"
      ? "TWICE"
      : "THREE separate times";

  return `You are a ${config.name} case interviewer.

PERSONALITY: ${personalityGuide}
STYLE: ${config.style}
TONE: ${config.tone}
DIFFICULTY: ${difficultyGuide}

THE CASE:
${casePrompt}

STRICT RULES:
1. You are ONLY the interviewer. Never solve the case for the candidate.
2. NEVER respond until the candidate has finished and submitted their answer.
3. Ask ONE follow-up question or prompt at a time. Never multiple questions.
4. If the candidate is lost, give a minimal nudge - never the answer.
5. Follow this interview flow in order:
   - Stage 1: Present the case prompt
   - Stage 2: Answer clarifying questions (max 3)
   - Stage 3: Ask candidate to present their framework
   - Stage 4: Drive analysis (ask for data interpretation, math, insights)
   - Stage 5: Ask for final recommendation
   - Stage 6 (STRESS TEST): After they give the recommendation, do NOT end yet. Push back ${pushbackCount}, one challenge per message, ESCALATING in difficulty. Draw from these kinds of challenge, and do not repeat the same kind twice:
     a) Attack the key assumption: "What if [their most load-bearing assumption] is wrong?"
     b) Disagree outright: "I don't buy that. Defend it." - then judge whether they cave or hold their ground with reasoning.
     c) Pivot the scenario: introduce a new fact that changes the picture (a new competitor, a regulatory change, the data being wrong) and make them recalculate or adapt.
     d) Force a trade-off: "You can only do ONE of your recommendations. Which, and why?"
     e) Zoom out: "What would make you change your mind entirely?"
     Keep each challenge to one or two sentences. Reward candidates who hold a well-reasoned position; do not reward caving to pressure without new evidence, and do not reward stubbornness in the face of a genuinely good counter-argument. AFTER the final challenge, briefly acknowledge and conclude the interview.
6. The candidate has used ${hintsUsed} hint(s). Note this privately.
7. Keep ALL your responses under 120 words.
8. Never break character. You are a real ${config.name} interviewer.`;
}

export function buildEvaluationPrompt(
  firm: FirmKey,
  transcript: Message[],
  hintsUsed: number,
  difficulty: Difficulty
): string {
  const config = FIRM_CONFIGS[firm];

  const transcriptText = transcript
    .map((t) => `${t.role.toUpperCase()}: ${t.content}`)
    .join("\n\n");

  return `You are a senior ${config.name} partner evaluating a case interview.

EVALUATION WEIGHTS:
- Structure/MECE: ${config.evaluationWeights.structure}%
- Problem-solving: ${config.evaluationWeights.problemSolving}%
- Quantitative accuracy: ${config.evaluationWeights.quantitative}%
- Communication: ${config.evaluationWeights.communication}%
- Creativity/insight: ${config.evaluationWeights.creativity}%

DIFFICULTY: ${difficulty}
HINTS USED: ${hintsUsed} (deduct 3 points per hint from final score)

FULL TRANSCRIPT:
${transcriptText}

Return ONLY a valid JSON object with this exact structure, no markdown, no explanation:
{
  "overallScore": <0-100 integer>,
  "breakdown": {
    "structure": <0-100>,
    "problemSolving": <0-100>,
    "quantitative": <0-100>,
    "communication": <0-100>,
    "creativity": <0-100>
  },
  "whatWentWell": ["<specific observation>", "<specific observation>", "<specific observation>"],
  "areasToImprove": ["<specific observation>", "<specific observation>", "<specific observation>"],
  "topCandidateResponse": "<what a top 1% ${config.name} candidate would have said differently>",
  "firmSpecificNote": "<one observation specific to ${config.name} culture and expectations>",
  "percentileEstimate": <0-100 integer>
}`;
}

export function buildCaseGeneratorPrompt(
  type: string,
  difficulty: Difficulty,
  firm: FirmKey
): string {
  return `Generate a realistic consulting case interview prompt for ${FIRM_CONFIGS[firm].name}.

Case type: ${type}
Difficulty: ${difficulty}

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "title": "<short case title>",
  "prompt": "<the full case prompt as the interviewer would present it, 3-5 sentences>",
  "context": "<additional background data the interviewer can share if asked, 2-3 sentences>",
  "keyInsights": ["<what a great candidate would identify>", "<insight 2>", "<insight 3>"]
}`;
}