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
  | "oliver_wyman"
  | "at_kearney"
  | "lek"
  | "monitor_deloitte"
  | "ibm_consulting"
  | "strategy_and"
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

