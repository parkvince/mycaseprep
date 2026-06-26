import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { buildEvaluationPrompt } from "@/lib/prompts/interviewer";
import { FirmKey, Difficulty, Message } from "@/types";
import { MCKINSEY_RUBRIC, calculateMckinseyOffer } from "@/lib/firmRubrics/mckinsey";
import { BCG_RUBRIC, calculateBcgOffer } from "@/lib/firmRubrics/bcg";
import { BAIN_RUBRIC, calculateBainOffer } from "@/lib/firmRubrics/bain";
import { EY_PARTHENON_RUBRIC, calculateEyParthenonOffer } from "@/lib/firmRubrics/eyParthenon";
import { DELOITTE_RUBRIC, calculateDeloitteOffer } from "@/lib/firmRubrics/deloitte";
import { KPMG_RUBRIC, calculateKpmgOffer } from "@/lib/firmRubrics/kpmg";
import { PWC_RUBRIC, calculatePwcOffer } from "@/lib/firmRubrics/pwc";
import { ROLAND_BERGER_RUBRIC, calculateRolandBergerOffer } from "@/lib/firmRubrics/rolandBerger";
import { ACCENTURE_RUBRIC, calculateAccentureOffer } from "@/lib/firmRubrics/accenture";
import { OLIVER_WYMAN_RUBRIC, calculateOliverWymanOffer } from "@/lib/firmRubrics/oliverWyman";
import { KEARNEY_RUBRIC, calculateKearneyOffer } from "@/lib/firmRubrics/kearney";
import { LEK_RUBRIC, calculateLekOffer } from "@/lib/firmRubrics/lek";
import { MONITOR_DELOITTE_RUBRIC, calculateMonitorDeloitteOffer } from "@/lib/firmRubrics/monitorDeloitte";
import { IBM_RUBRIC, calculateIbmOffer } from "@/lib/firmRubrics/ibm";
import { HURON_RUBRIC, calculateHuronOffer } from "@/lib/firmRubrics/huron";
import { CAPITAL_ONE_RUBRIC, calculateCapitalOneOffer } from "@/lib/firmRubrics/capitalOne";

const FIRM_RUBRICS: Record<string, { dimensions: { key: string; weight: number }[] }> = {
  mckinsey: MCKINSEY_RUBRIC,
  bcg: BCG_RUBRIC,
  bain: BAIN_RUBRIC,
  ey: EY_PARTHENON_RUBRIC,
  "ey-parthenon": EY_PARTHENON_RUBRIC,
  deloitte: DELOITTE_RUBRIC,
  kpmg: KPMG_RUBRIC,
  pwc: PWC_RUBRIC,
  rolandberger: ROLAND_BERGER_RUBRIC,
  "roland-berger": ROLAND_BERGER_RUBRIC,
  accenture: ACCENTURE_RUBRIC,
  "oliver-wyman": OLIVER_WYMAN_RUBRIC,
  "oliver-wyman": OLIVER_WYMAN_RUBRIC,
  kearney: KEARNEY_RUBRIC,
  lek: LEK_RUBRIC,
  "monitor-deloitte": MONITOR_DELOITTE_RUBRIC,
  "monitor-deloitte": MONITOR_DELOITTE_RUBRIC,
  ibm: IBM_RUBRIC,
  "ibm-consulting": IBM_RUBRIC,
  huron: HURON_RUBRIC,
  capitalone: CAPITAL_ONE_RUBRIC,
  "capital-one": CAPITAL_ONE_RUBRIC,
};

function buildFirmRubricContext(firm: FirmKey): string {
  const f = firm as string;

  if (f === "mckinsey") {
    const dims = MCKINSEY_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using McKinsey's ACTUAL Problem-Solving Interview rubric.
MCKINSEY-SPECIFIC RULES:
1. Score structure FIRST and most harshly. Generic frameworks without case adaptation = 2 at most.
2. Evaluate whether responses were: (a) structured, (b) hypothesis-driven, (c) bottom-line first.
3. Score quantitative SEPARATELY from judgment.
4. A vague recommendation is a 2 on synthesis even if the rest was strong.
5. The McKinsey bar is EXCEPTIONALLY HIGH. A 3 means "meets the bar." Do NOT inflate scores.
6. If the candidate gave minimal or no responses, most dimensions should be 1-2.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, quantitative, businessJudgment, communication, hypothesisManagement, synthesis
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "bcg") {
    const dims = BCG_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using BCG's ACTUAL case interview rubric.
BCG-SPECIFIC RULES:
1. BCG is CANDIDATE-LED. Did the candidate DRIVE the case independently without waiting for prompts?
2. Creativity is a UNIQUE BCG dimension. Using textbook frameworks without original thinking = 2 at most on creativity.
3. Quantitative includes EXHIBIT ANALYSIS — can they extract the non-obvious insight from a chart?
4. Communication at BCG is collaborative — do they treat it as a dialogue or a solo performance?
5. BCG's bar is VERY HIGH. Most candidates score 2s on their first 15-20 cases. Do NOT inflate scores.
6. If the candidate waited for prompts rather than driving, candidateLed must be 1 or 2.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: candidateLed, structure, quantitative, creativity, communication
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "bain") {
    const dims = BAIN_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using Bain's ACTUAL case interview rubric.
BAIN-SPECIFIC RULES:
1. "ANSWER FIRST" is Bain's core principle. Did the candidate state a clear hypothesis immediately? If not, answerFirst cannot exceed 2.
2. Communication and composure are weighted HIGHER at Bain than at McKinsey or BCG.
3. Cultural fit ("Bainie factor") is an explicit scoring dimension. Were they collaborative, humble, and genuine?
4. Bain's structure standard is more flexible than McKinsey's — organized and clear matters more than perfect MECE.
5. If the candidate was defensive under pushback rather than curious, communication cannot exceed 2.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: answerFirst, structure, quantitative, communication, culturalFit, synthesis
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "ey" || f === "ey-parthenon") {
    const dims = EY_PARTHENON_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using EY-Parthenon's ACTUAL case interview rubric.
EY-PARTHENON-SPECIFIC RULES:
1. This is NOT standard Big 4 — EY-Parthenon is MBB-level difficulty. Do not inflate scores.
2. PE/investment judgment is a core dimension. Did the candidate think like an investor, not just a consultant?
3. Financial literacy is explicit — P&L, EBITDA, investment multiples. Score quantitative harshly if these are missing.
4. The most common EY-Parthenon failure: refusing to commit to a recommendation. If the candidate hedged their final answer, recommendation cannot exceed 2.
5. Candidate-led format — did they drive the case or wait for prompts?
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: problemSolving, quantitative, strategicJudgment, communication, recommendation
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "deloitte") {
    const dims = DELOITTE_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using Deloitte's ACTUAL case interview rubric.
DELOITTE-SPECIFIC RULES:
1. Deloitte explicitly names 5 dimensions: structured thinking, analytical ability, business acumen, communication, and professional demeanor/coachability.
2. Coachability is unique to Deloitte — score it harshly if the candidate was defensive under pushback or showed no intellectual curiosity.
3. Business acumen must reflect PRACTICAL judgment, not just theoretical strategy. Implementation awareness matters.
4. The communication standard: "clear, concise, and persuasive — can you walk someone through your logic under pressure?"
5. AI/digital transformation awareness is a plus given Deloitte's strategic focus.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, analytical, businessAcumen, communication, coachability
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "kpmg") {
    const dims = KPMG_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using KPMG's ACTUAL case interview rubric.
KPMG-SPECIFIC RULES:
1. KPMG cases are HYBRID — strategy AND operations/implementation. A recommendation missing the execution dimension is incomplete.
2. Values alignment is an EXPLICIT KPMG scoring dimension tied to: Integrity, Excellence, Courage, Together, For Better.
3. Operational judgment is weighted equally with structure. Did they address "how do we do this" alongside "what should we do"?
4. Professional mindset matters: were responses prudent, ethical, and client-aware?
5. If the candidate's recommendation had no implementation pathway, operationalJudgment cannot exceed 2.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, analytical, operationalJudgment, communication, valuesAlignment
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "pwc") {
    const dims = PWC_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using PwC Strategy&'s ACTUAL case interview rubric.
PWC STRATEGY&-SPECIFIC RULES:
1. Behavioral fit is an EXPLICIT ELIMINATOR at PwC — can disqualify regardless of case performance. Did the candidate show genuine motivation for Strategy& specifically?
2. Strategy& uses a capabilities-driven approach. Did the candidate identify what distinctive capabilities the client needs? Generic recommendations score below a 3.
3. Financial viability must accompany every strategic recommendation.
4. Hypothesis-driven structure is the expectation. No hypothesis = no score above 2 on structure.
5. "Long-term strategic alignment" not "short-term commercial upside" distinguishes Strategy& from EY-Parthenon.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, quantitative, strategicJudgment, communication, behavioralFit
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "rolandberger" || f === "roland-berger") {
    const dims = ROLAND_BERGER_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using Roland Berger's ACTUAL case interview rubric.
ROLAND BERGER-SPECIFIC RULES:
1. Roland Berger explicitly names four scoring dimensions: structure, execution, synthesis, entrepreneurial presence.
2. EXECUTION is critical: being passive is as costly as being structurally wrong. Did the candidate drive the analysis?
3. Roland Berger's synthesis format: root cause → recommendation → quantified impact. No number = incomplete.
4. Entrepreneurial presence: did the candidate spot opportunities, take initiative, and deliver pragmatic solutions?
5. Cases skew toward European industrial, automotive, and manufacturing contexts.
6. Collaboration scores group case behavior — did they lead when needed and credit others?
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, execution, synthesis, entrepreneurialMindset, collaboration
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "accenture") {
    const dims = ACCENTURE_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating this candidate using Accenture's ACTUAL case interview rubric.
ACCENTURE-SPECIFIC RULES:
1. Accenture explicitly names six core skills: structured thinking, problem solving, business judgment, quantitative ability, communication, and executive presence.
2. DIGITAL AWARENESS is embedded in business judgment — candidates who treat technology cases like pure strategy problems score below a 3.
3. Three unique case formats: Great Unknown (minimal data), Parade of Facts (dense data), Back of the Envelope (estimation).
4. Executive presence is an EXPLICIT dimension — would a Fortune 500 CEO trust this person?
5. Group case collaboration is scored — did the candidate advance the group's thinking?
6. 80/20 prioritization and forest vs. trees thinking are explicitly valued.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structuredThinking, problemSolving, businessJudgment, quantitative, communicationPresence, collaboration
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "oliver-wyman") {
    const dims = OLIVER_WYMAN_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating using Oliver Wyman's rubric.
OW RULES:
1. Fully candidate-led. Did they drive the case independently?
2. Financial services sector knowledge is explicit — score harshly if banking/insurance fluency is missing.
3. Written case synthesis is evaluated — can they build a recommendation from financial data?
4. Three values: Courage, Curiosity, Passion — evident in how they engage intellectually.
5. 1-3% offer rate — do not inflate scores.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, financialServicesKnowledge, quantitative, communication, writtenCase
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "kearney") {
    const dims = KEARNEY_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating using Kearney's rubric.
KEARNEY RULES:
1. HYBRID format — must handle both interviewer-guided AND candidate-led segments.
2. Operational excellence is Kearney's signature. Did the recommendation include an execution pathway? If not, operationalExcellence cannot exceed 2.
3. Supply chain and operations vocabulary matters.
4. Practical implementation over pure strategy — every recommendation needs a HOW.
5. 2% offer rate — rigorous standard.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, operationalExcellence, quantitative, collaboration, communication
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "lek") {
    const dims = LEK_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating using L.E.K. Consulting's rubric.
LEK RULES:
1. Candidate-led. Evidence over opinion — every claim must be backed by data or stated assumptions.
2. Quantitative rigor is the highest-weighted dimension. Market sizing and PE math must be precise.
3. Written case synthesis — can they build a recommendation-first narrative from financial exhibits?
4. Life sciences and PE due diligence sector knowledge is a plus.
5. 2-3% offer rate — do not inflate.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, quantitative, evidenceReasoning, writtenCase, communication
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "monitor-deloitte") {
    const dims = MONITOR_DELOITTE_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating using Monitor Deloitte's rubric.
MONITOR RULES:
1. TREAT AS BCG/BAIN PREP — not standard Deloitte. Candidate-led pure strategy.
2. CEO-level point of view required — NOT balanced pros and cons. If the candidate explored all options equally without committing, strategicStructure cannot exceed 2.
3. Hold position under pushback — test composure under pressure.
4. 3-4% offer rate — MBB-adjacent rigor.
5. Do not apply standard Big 4 scoring leniency.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: strategicStructure, strategyDepth, quantitative, communication, writtenCase
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "ibm" || f === "ibm-consulting") {
    const dims = IBM_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating using IBM Consulting's rubric.
IBM RULES:
1. Every case has a TECHNOLOGY LAYER — cloud, AI, ERP, digital transformation. Missing this = below 3 on technologyBusinessJudgment.
2. Business-first technology thinking: start with the business problem, bring tech in as the solution.
3. Quantify technology ROI — cloud migration savings, AI cost curve, ERP implementation payback.
4. Three IBM divisions: iX (design/experience), Strategy & Transformation (finance/ops), Technology Consulting (delivery).
5. More accessible than Tier 2 strategy firms — but still rigorous.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: structure, technologyBusinessJudgment, quantitative, communication, collaboration
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "huron") {
    const dims = HURON_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating using Huron Consulting's rubric.
HURON RULES:
1. INTERVIEWER-LED format — candidate responds to directed prompts, does not drive independently.
2. Healthcare and education industry knowledge is explicitly scored. Missing sector fluency = below 3 on industryKnowledge.
3. Key healthcare concepts: operating margin, payer mix, contract labor, length of stay, revenue cycle.
4. Key education concepts: enrollment, net tuition revenue, administrative cost drivers.
5. Impact orientation: recommendations must be specific and actionable for a hospital CEO or university president.
6. More accessible than MBB — score appropriately, do not apply MBB-level strictness.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: analyticalThinking, industryKnowledge, quantitative, communication, impactOrientation
Each score must be an INTEGER between 1 and 5.`;
  }

  if (f === "capital-one") {
    const dims = CAPITAL_ONE_RUBRIC.dimensions.map(d =>
      `${d.label} (weight: ${d.weight}%):\n` +
      Object.entries(d.scoringCriteria).map(([k, v]) => `  Score ${k}: ${v}`).join("\n")
    ).join("\n\n");
    return `You are evaluating using Capital One's rubric.
CAPITAL ONE RULES:
1. INTERVIEWER-LED format — directed prompts, not candidate-led frameworks. Issue trees have limited value here.
2. QUANTITATIVE SKILLS are the most heavily weighted dimension. Equation translation is the key test — not just arithmetic.
3. Financial product knowledge: credit card economics (interchange, interest income, charge-off), loan math (default rates, LTV, net interest margin).
4. Calculator is allowed — precision of equation setup matters more than mental math speed.
5. ARES values scored through behavioral questions: Excellence, Do the Right Thing, Respect for Individuals, Succeed Together.
6. Post-Discover acquisition (May 2025): credit card economics appear more frequently in cases.
SCORING DIMENSIONS:\n${dims}
Return scores for these EXACT keys: logicalStructure, quantitative, businessJudgment, communication, valuesAlignment
Each score must be an INTEGER between 1 and 5.`;
  }

  return "";
}

function getFirmJsonSpec(firm: FirmKey): string {
  const f = firm as string;

  if (f === "mckinsey") return `{"overallScore":<0-100>,"breakdown":{"structure":<1-5>,"quantitative":<1-5>,"businessJudgment":<1-5>,"communication":<1-5>,"hypothesisManagement":<1-5>,"synthesis":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"structure":<string>,"quantitative":<string>,"businessJudgment":<string>,"communication":<string>,"hypothesisManagement":<string>,"synthesis":<string>}}`;

  if (f === "bcg") return `{"overallScore":<0-100>,"breakdown":{"candidateLed":<1-5>,"structure":<1-5>,"quantitative":<1-5>,"creativity":<1-5>,"communication":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"candidateLed":<string>,"structure":<string>,"quantitative":<string>,"creativity":<string>,"communication":<string>}}`;

  if (f === "bain") return `{"overallScore":<0-100>,"breakdown":{"answerFirst":<1-5>,"structure":<1-5>,"quantitative":<1-5>,"communication":<1-5>,"culturalFit":<1-5>,"synthesis":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"answerFirst":<string>,"structure":<string>,"quantitative":<string>,"communication":<string>,"culturalFit":<string>,"synthesis":<string>}}`;

  if (f === "ey" || f === "ey-parthenon") return `{"overallScore":<0-100>,"breakdown":{"problemSolving":<1-5>,"quantitative":<1-5>,"strategicJudgment":<1-5>,"communication":<1-5>,"recommendation":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"problemSolving":<string>,"quantitative":<string>,"strategicJudgment":<string>,"communication":<string>,"recommendation":<string>}}`;

  if (f === "deloitte") return `{"overallScore":<0-100>,"breakdown":{"structure":<1-5>,"analytical":<1-5>,"businessAcumen":<1-5>,"communication":<1-5>,"coachability":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"structure":<string>,"analytical":<string>,"businessAcumen":<string>,"communication":<string>,"coachability":<string>}}`;

  if (f === "kpmg") return `{"overallScore":<0-100>,"breakdown":{"structure":<1-5>,"analytical":<1-5>,"operationalJudgment":<1-5>,"communication":<1-5>,"valuesAlignment":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"structure":<string>,"analytical":<string>,"operationalJudgment":<string>,"communication":<string>,"valuesAlignment":<string>}}`;

  if (f === "pwc") return `{"overallScore":<0-100>,"breakdown":{"structure":<1-5>,"quantitative":<1-5>,"strategicJudgment":<1-5>,"communication":<1-5>,"behavioralFit":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"structure":<string>,"quantitative":<string>,"strategicJudgment":<string>,"communication":<string>,"behavioralFit":<string>}}`;

  if (f === "rolandberger" || f === "roland-berger") return `{"overallScore":<0-100>,"breakdown":{"structure":<1-5>,"execution":<1-5>,"synthesis":<1-5>,"entrepreneurialMindset":<1-5>,"collaboration":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"structure":<string>,"execution":<string>,"synthesis":<string>,"entrepreneurialMindset":<string>,"collaboration":<string>}}`;

  if (f === "accenture") return `{"overallScore":<0-100>,"breakdown":{"structuredThinking":<1-5>,"problemSolving":<1-5>,"businessJudgment":<1-5>,"quantitative":<1-5>,"communicationPresence":<1-5>,"collaboration":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"structuredThinking":<string>,"problemSolving":<string>,"businessJudgment":<string>,"quantitative":<string>,"communicationPresence":<string>,"collaboration":<string>}}`;

  if (f === "oliver-wyman") return `{"overallScore":<0-100>,"breakdown":{"structure":<1-5>,"financialServicesKnowledge":<1-5>,"quantitative":<1-5>,"communication":<1-5>,"writtenCase":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"structure":<string>,"financialServicesKnowledge":<string>,"quantitative":<string>,"communication":<string>,"writtenCase":<string>}}`;

  if (f === "kearney") return `{"overallScore":<0-100>,"breakdown":{"structure":<1-5>,"operationalExcellence":<1-5>,"quantitative":<1-5>,"collaboration":<1-5>,"communication":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"structure":<string>,"operationalExcellence":<string>,"quantitative":<string>,"collaboration":<string>,"communication":<string>}}`;

  if (f === "lek") return `{"overallScore":<0-100>,"breakdown":{"structure":<1-5>,"quantitative":<1-5>,"evidenceReasoning":<1-5>,"writtenCase":<1-5>,"communication":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"structure":<string>,"quantitative":<string>,"evidenceReasoning":<string>,"writtenCase":<string>,"communication":<string>}}`;

  if (f === "monitor-deloitte") return `{"overallScore":<0-100>,"breakdown":{"strategicStructure":<1-5>,"strategyDepth":<1-5>,"quantitative":<1-5>,"communication":<1-5>,"writtenCase":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"strategicStructure":<string>,"strategyDepth":<string>,"quantitative":<string>,"communication":<string>,"writtenCase":<string>}}`;

  if (f === "ibm" || f === "ibm-consulting") return `{"overallScore":<0-100>,"breakdown":{"structure":<1-5>,"technologyBusinessJudgment":<1-5>,"quantitative":<1-5>,"communication":<1-5>,"collaboration":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"structure":<string>,"technologyBusinessJudgment":<string>,"quantitative":<string>,"communication":<string>,"collaboration":<string>}}`;

  if (f === "huron") return `{"overallScore":<0-100>,"breakdown":{"analyticalThinking":<1-5>,"industryKnowledge":<1-5>,"quantitative":<1-5>,"communication":<1-5>,"impactOrientation":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"analyticalThinking":<string>,"industryKnowledge":<string>,"quantitative":<string>,"communication":<string>,"impactOrientation":<string>}}`;

  if (f === "capital-one") return `{"overallScore":<0-100>,"breakdown":{"logicalStructure":<1-5>,"quantitative":<1-5>,"businessJudgment":<1-5>,"communication":<1-5>,"valuesAlignment":<1-5>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>,"dimensionFeedback":{"logicalStructure":<string>,"quantitative":<string>,"businessJudgment":<string>,"communication":<string>,"valuesAlignment":<string>}}`;

  return `{"overallScore":<0-100>,"breakdown":{"structure":<0-100>,"problemSolving":<0-100>,"quantitative":<0-100>,"communication":<0-100>,"creativity":<0-100>},"whatWentWell":[<string>],"areasToImprove":[<string>],"topCandidateResponse":<string>,"firmSpecificNote":<string>,"percentileEstimate":<0-100>}`;
}

function calculateOfferDecision(firm: FirmKey, breakdown: Record<string, number>) {
  const f = firm as string;
  if (f === "mckinsey") return calculateMckinseyOffer(breakdown);
  if (f === "bcg") return calculateBcgOffer(breakdown);
  if (f === "bain") return calculateBainOffer(breakdown);
  if (f === "ey" || f === "ey-parthenon") return calculateEyParthenonOffer(breakdown);
  if (f === "deloitte") return calculateDeloitteOffer(breakdown);
  if (f === "kpmg") return calculateKpmgOffer(breakdown);
  if (f === "pwc") return calculatePwcOffer(breakdown);
  if (f === "rolandberger" || f === "roland-berger") return calculateRolandBergerOffer(breakdown);
  if (f === "accenture") return calculateAccentureOffer(breakdown);
  if (f === "oliver-wyman") return calculateOliverWymanOffer(breakdown);
  if (f === "kearney") return calculateKearneyOffer(breakdown);
  if (f === "lek") return calculateLekOffer(breakdown);
  if (f === "monitor-deloitte") return calculateMonitorDeloitteOffer(breakdown);
  if (f === "ibm" || f === "ibm-consulting") return calculateIbmOffer(breakdown);
  if (f === "huron") return calculateHuronOffer(breakdown);
  if (f === "capital-one") return calculateCapitalOneOffer(breakdown);
  return null;
}

function recalcWeightedScore(firm: FirmKey, breakdown: Record<string, number>): number {
  const rubric = FIRM_RUBRICS[firm as string];
  if (!rubric) return 50;
  let weighted = 0;
  for (const d of rubric.dimensions) {
    const score = breakdown[d.key] ?? 1;
    const normalized = ((score - 1) / 4) * 100;
    weighted += (normalized * d.weight) / 100;
  }
  return Math.round(weighted);
}

function getDefaultBreakdown(firm: FirmKey) {
  const rubric = FIRM_RUBRICS[firm as string];
  if (rubric) return Object.fromEntries(rubric.dimensions.map(d => [d.key, 1]));
  return { structure: 50, problemSolving: 50, quantitative: 50, communication: 50, creativity: 50 };
}

function getDefaultEvaluation(firm: FirmKey) {
  return {
    overallScore: 50,
    breakdown: getDefaultBreakdown(firm),
    whatWentWell: ["Session completed."],
    areasToImprove: ["Unable to generate full evaluation."],
    topCandidateResponse: "Unable to generate ideal response.",
    firmSpecificNote: "Unable to generate firm note.",
    percentileEstimate: 50,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { firm, transcript, hintsUsed, difficulty } = await req.json();

    const basePrompt = buildEvaluationPrompt(
      firm as FirmKey,
      transcript as Message[],
      hintsUsed,
      difficulty as Difficulty
    );

    const firmContext = buildFirmRubricContext(firm as FirmKey);
    const jsonSpec = getFirmJsonSpec(firm as FirmKey);
    const hasFirmRubric = !!FIRM_RUBRICS[firm as string];

    const fullPrompt = firmContext
      ? `${firmContext}\n\n${basePrompt}\n\nReturn ONLY valid JSON in this exact format:\n${jsonSpec}`
      : `${basePrompt}\n\nReturn ONLY valid JSON in this exact format:\n${jsonSpec}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: fullPrompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";

    let evaluation: any;
    try {
      evaluation = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      evaluation = getDefaultEvaluation(firm as FirmKey);
    }

    if (hasFirmRubric && evaluation.breakdown) {
      const offerResult = calculateOfferDecision(firm as FirmKey, evaluation.breakdown);
      if (offerResult) evaluation.offerDecision = offerResult;
      evaluation.overallScore = recalcWeightedScore(firm as FirmKey, evaluation.breakdown);
    }

    evaluation.whatWentWell = evaluation.whatWentWell ?? [];
    evaluation.areasToImprove = evaluation.areasToImprove ?? [];
    evaluation.breakdown = evaluation.breakdown ?? getDefaultBreakdown(firm as FirmKey);
    evaluation.topCandidateResponse = evaluation.topCandidateResponse ?? "";
    evaluation.firmSpecificNote = evaluation.firmSpecificNote ?? "";
    evaluation.percentileEstimate = evaluation.percentileEstimate ?? 50;
    evaluation.overallScore = evaluation.overallScore ?? 50;

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(getDefaultEvaluation("mckinsey" as FirmKey), { status: 200 });
  }
}
