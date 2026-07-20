export type FirmKey =
  | "mckinsey"
  | "bain"
  | "bcg"
  | "ey"
  | "deloitte"
  | "kpmg"
  | "pwc"
  | "rolandberger"
  | "accenture"
  | "oliver-wyman"
  | "kearney"
  | "lek"
  | "monitor-deloitte"
  | "ibm"
  | "capital-one"
  | "huron";

export type CaseType =
  | "market_sizing"
  | "profitability"
  | "market_entry"
  | "merger_acquisition"
  | "operations"
  | "random";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Mode = "voice" | "text";

export type InterviewerPersonality = "strict" | "friendly";

export type SessionStatus = "in_progress" | "completed";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ScoreBreakdown {
  structure: number;
  problemSolving: number;
  quantitative: number;
  communication: number;
  creativity: number;
}

/** A feedback point anchored to something the candidate actually said, so the
 * advice is specific rather than generic. `instead` is only used for weaknesses. */
export interface EvidencePoint {
  point: string;
  quote: string;
  instead?: string;
}

export interface Evaluation {
  overallScore: number;
  breakdown: ScoreBreakdown;
  whatWentWell: string[];
  areasToImprove: string[];
  topCandidateResponse: string;
  firmSpecificNote: string;
  percentileEstimate: number;
  offerDecision?: {
  decision: string;
  label: string;
  description: string;
  weightedScore: number;
};
dimensionFeedback?: Record<string, string>;
/** Evidence-backed versions of the two lists above. Optional so older stored
 * evaluations (and any model response that omits them) still render. */
strengthsDetailed?: EvidencePoint[];
improvementsDetailed?: EvidencePoint[];
/** One or two sentences on how the candidate managed their time. */
pacingNote?: string;
}


export interface CaseSession {
  id: string;
  firmMode: FirmKey;
  mode: Mode;
  difficulty: Difficulty;
  transcript: Message[];
  hintsUsed: number;
  status: SessionStatus;
  evaluation?: Evaluation;
}

export interface FirmConfig {
  name: string;
  style: string;
  tone: string;
  evaluationWeights: ScoreBreakdown;
  feedbackTone: string;
  color: string;
}

