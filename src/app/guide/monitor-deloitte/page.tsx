"use client";

import FirmGuideTemplate from "@/components/FirmGuideTemplate";
import { MONITOR_DELOITTE_RUBRIC, calculateMonitorDeloitteOffer } from "@/lib/firmRubrics/monitorDeloitte";

const RATE_THIS = {
  strategicStructure: {
    response: "\"There are pros and cons on both sides of this market entry decision,\" with no directional call.",
    score: 1,
    reasoning: "A balanced pros/cons list with no CEO-level point of view, exactly what Monitor Deloitte's prep explicitly warns against.",
  },
  strategyDepth: {
    response: "Candidate identifies that a competitor is growing faster but doesn't dig into why or what it means for the client's strategy.",
    score: 2,
    reasoning: "Surface-level observation without the second-order insight that separates Monitor from standard Big 4 work.",
  },
  quantitative: {
    response: "Candidate rounds every number to the nearest exact dollar instead of rounding ruthlessly for speed.",
    score: 2,
    reasoning: "Slows the analysis down and misses Monitor's own explicit tip to round numbers ruthlessly and keep pace.",
  },
  communication: {
    response: "When challenged on an assumption, candidate immediately abandons their recommendation without addressing the substance.",
    score: 1,
    reasoning: "Caves under pushback instead of restating logic and defending the position with data, exactly what Monitor explicitly tests for.",
  },
  writtenCase: {
    response: "Candidate runs out of time trying to cover every slide in the packet instead of prioritizing the most important ones.",
    score: 2,
    reasoning: "Misses Monitor's own explicit guidance - the goal is answering the most important questions well, not everything.",
  },
};

export default function MonitorDeloitteGuidePage() {
  return (
    <FirmGuideTemplate
      rubric={MONITOR_DELOITTE_RUBRIC}
      calculateOffer={calculateMonitorDeloitteOffer}
      rateThis={RATE_THIS}
      blobLeft="/homepage/new3-blob-birthday.png"
      blobRight="/homepage/new3-blob-kite.png"
    />
  );
}
