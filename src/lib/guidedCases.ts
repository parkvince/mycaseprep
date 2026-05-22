export interface Exhibit {
  type: "table" | "chart" | "text" | "image";
  title: string;
  data: string;
}

export interface CaseQuestion {
  id: string;
  stage: string;
  question: string;
  type: "multiple_choice" | "open_ended" | "exhibit";
  exhibit?: Exhibit;
  options?: {
    id: string;
    text: string;
    correct: boolean;
    explanation: string;
  }[];
  openEndedGuidance?: string;
}

export interface GuidedCase {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  firm: string;
  estimatedMinutes: number;
  overview: string;
  clientBackground: string;
  yourRole: string;
  questions: CaseQuestion[];
  finalRecommendationPrompt: string;
  idealRecommendation: string;
  keyTakeaways: string[];
}

export const GUIDED_CASES: GuidedCase[] = [
  // ─────────────────────────────────────────────
  // CASE 1: MCKINSEY — COFFEE CHAIN PROFITABILITY
  // ─────────────────────────────────────────────
  {
    id: "g1",
    title: "BrewCo Profitability Crisis",
    type: "profitability",
    difficulty: "beginner",
    firm: "mckinsey",
    estimatedMinutes: 25,
    overview: "A mid-sized US coffee chain has seen its profit margin cut in half over two years despite growing revenue. McKinsey has been engaged to diagnose the issue and recommend a path forward.",
    clientBackground: "BrewCo operates 300 locations across the US, primarily in suburban strip malls and urban street-front locations. Founded in 2008, the company grew aggressively from 2019-2023, adding 100 new locations. Their menu includes specialty coffee, pastries, and a recently launched lunch menu. They compete primarily with Starbucks and regional independents.",
    yourRole: "You are a McKinsey associate on your first week of the engagement. The partner has asked you to lead the diagnostic workstream and present your initial findings at the end of the week.",
    finalRecommendationPrompt: "Based on all the evidence, what is your recommendation to BrewCo's CEO? Be specific about the 3 most important actions they should take in the next 90 days.",
    idealRecommendation: "BrewCo should immediately halt new location openings and conduct a portfolio review to identify the bottom 20% of locations by contribution margin for potential closure or renegotiation. They should launch a labor scheduling optimization program targeting a 15% reduction in labor cost per transaction. Finally, they should renegotiate supplier contracts for their top 5 ingredients, which represent 60% of COGS. These three actions together could recover 4-5 percentage points of margin within 12 months.",
    keyTakeaways: [
      "Profit margin compression is almost always either a revenue problem, a cost problem, or both — isolate which before recommending",
      "New location expansion often dilutes margins before new stores mature — always check same-store vs total performance",
      "Labor and COGS are the two largest cost levers in food service — they should always be the first place you look",
      "A MECE framework prevents double-counting and ensures you haven't missed a major bucket",
    ],
    questions: [
      {
        id: "g1q1",
        stage: "Problem Definition",
        question: "The partner gives you a 5-minute brief before your first client meeting. She says: 'BrewCo's profit margin has gone from 18% to 9% in two years. Revenue is up 12%. Figure out what's going on.' What is the most important first question you should ask the client?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "What has happened to same-store sales vs total sales over the same period?",
            correct: true,
            explanation: "Correct. Separating same-store performance from total performance immediately tells you whether the problem is organic deterioration or dilution from new locations. This is the most diagnostic first question.",
          },
          {
            id: "b",
            text: "Who are your main competitors and have they changed their pricing?",
            correct: false,
            explanation: "Competitor pricing is relevant but secondary. You should first understand your own P&L before looking externally. Revenue is actually up, so competitor pricing is less likely to be the primary driver.",
          },
          {
            id: "c",
            text: "What is your current debt level and interest expense?",
            correct: false,
            explanation: "Debt and interest expense affect net income but the case describes operating margin compression. Financial structure is not the first place to look when diagnosing operational profitability.",
          },
          {
            id: "d",
            text: "Have you considered raising prices to recover margin?",
            correct: false,
            explanation: "Price increases are a potential solution, not a diagnostic question. You should understand the root cause before jumping to solutions.",
          },
        ],
      },
      {
        id: "g1q2",
        stage: "Data Gathering",
        question: "The client shares the following P&L data. Review the exhibit and identify the primary driver of margin compression.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "BrewCo P&L Summary ($ millions)",
          data: `| Line Item | 2021 | 2023 | Change |
|---|---|---|---|
| Revenue | $420M | $470M | +12% |
| Cost of Goods Sold | $126M | $169M | +34% |
| Labor Costs | $109M | $141M | +29% |
| Rent & Occupancy | $42M | $56M | +33% |
| Marketing | $17M | $19M | +12% |
| G&A | $50M | $56M | +12% |
| **Operating Profit** | **$76M** | **$29M** | **-62%** |
| **Operating Margin** | **18%** | **6%** | **-12pp** |

Same-store revenue growth: +1% per year
New locations opened 2021-2023: 100 (from 200 to 300)
Average new location age: 14 months`,
        },
        options: [
          {
            id: "a",
            text: "Marketing costs are growing too fast relative to revenue",
            correct: false,
            explanation: "Marketing grew 12%, exactly in line with revenue. This is not the driver.",
          },
          {
            id: "b",
            text: "COGS and labor are both growing 2-3x faster than revenue, and new locations are not yet mature",
            correct: true,
            explanation: "Correct. COGS grew 34% and labor 29% against revenue growth of only 12%. Combined these two buckets account for nearly all of the $47M profit decline. The fact that 100 new locations average only 14 months old means they haven't reached maturity — new locations typically take 18-24 months to reach target margins.",
          },
          {
            id: "c",
            text: "Rent costs are rising due to inflation in commercial real estate",
            correct: false,
            explanation: "Rent grew 33% which is high, but this is partly explained by 50% more locations. On a per-location basis rent actually decreased slightly. This is not the primary driver.",
          },
          {
            id: "d",
            text: "Revenue growth is too slow to cover fixed cost increases",
            correct: false,
            explanation: "The issue is not that revenue is growing too slowly — it's that variable costs (COGS, labor) are growing disproportionately fast. This suggests an operational efficiency problem, not just a revenue shortfall.",
          },
        ],
      },
      {
        id: "g1q3",
        stage: "Deep Dive",
        question: "You dig deeper into the COGS increase. The client provides a breakdown of COGS by category. What does this data tell you?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "COGS Breakdown by Category",
          data: `| Category | 2021 | 2023 | % of Total COGS 2023 |
|---|---|---|---|
| Coffee beans & dairy | $54M | $89M | 53% |
| Pastry & food items | $38M | $52M | 31% |
| Packaging & supplies | $18M | $22M | 13% |
| Waste & spoilage | $16M | $6M | 4% |
| **Total COGS** | **$126M** | **$169M** | 100% |

Coffee bean price index: +18% over period
Dairy price index: +22% over period
New lunch menu launched: Q2 2022
Food waste reduction program launched: Q1 2023`,
        },
        options: [
          {
            id: "a",
            text: "The waste reduction program is working well and should be expanded across all cost categories",
            correct: false,
            explanation: "The waste program is a positive but minor data point — it reduced waste from $16M to $6M, saving $10M. The much larger story is the $35M increase in coffee/dairy costs which dwarfs the savings.",
          },
          {
            id: "b",
            text: "Coffee beans and dairy are the primary COGS driver, likely due to commodity inflation plus volume from new locations, and the lunch menu has added structural food costs",
            correct: true,
            explanation: "Correct. Coffee and dairy grew from $54M to $89M (+65%), far exceeding commodity inflation of 18-22%. This means volume and/or mix is also a driver. The lunch menu added $14M in incremental food costs. These two items together explain most of the COGS increase.",
          },
          {
            id: "c",
            text: "Packaging costs are rising too fast and should be the focus of cost reduction efforts",
            correct: false,
            explanation: "Packaging grew from $18M to $22M, a 22% increase roughly in line with revenue growth. This is not a primary driver and should not be the focus of cost reduction efforts.",
          },
          {
            id: "d",
            text: "The lunch menu launch was a mistake and should be discontinued immediately",
            correct: false,
            explanation: "You don't yet have revenue data for the lunch menu so you cannot conclude it was a mistake. You need to compare the $14M in incremental COGS against the incremental revenue it generated before making this judgment.",
          },
        ],
      },
      {
        id: "g1q4",
        stage: "Deep Dive",
        question: "The partner asks you to quantify the labor problem. You pull together the following data. What is the cost per transaction at the 200 mature locations vs the 100 new locations?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Labor Cost Analysis by Location Cohort",
          data: `| Metric | 200 Mature Locations | 100 New Locations |
|---|---|---|
| Total labor cost | $94M | $47M |
| Total transactions | 47M | 15.5M |
| Average ticket size | $8.50 | $8.50 |
| Revenue | $400M | $132M |
| Labor as % of revenue | 23.5% | 35.6% |
| Transactions per labor hour | 4.2 | 2.8 |
| Average hourly wage | $17.50 | $19.20 |

Note: New locations are still in ramp-up phase. Industry benchmark: labor as % of revenue = 24-26% for mature locations.`,
        },
        options: [
          {
            id: "a",
            text: "New locations have a labor cost per transaction of $3.03 vs $2.00 for mature locations — a 52% premium driven by lower transaction volume and higher wages",
            correct: true,
            explanation: "Correct. $47M / 15.5M transactions = $3.03 per transaction for new locations vs $94M / 47M = $2.00 for mature locations. New locations have 52% higher labor cost per transaction. This is driven by two factors: lower volume (still ramping up) and higher wages (newer hires at inflated market rates). As new locations mature, labor efficiency should improve toward the $2.00 benchmark — but management needs to actively manage scheduling to get there.",
          },
          {
            id: "b",
            text: "The problem is entirely the higher wages at new locations — BrewCo should freeze hiring",
            correct: false,
            explanation: "Wages are part of the problem but not the whole story. The bigger driver is lower transactions per labor hour (2.8 vs 4.2) — new locations are overstaffed relative to their current volume. A hiring freeze alone would not fix scheduling inefficiency.",
          },
          {
            id: "c",
            text: "Labor costs at mature locations are already above industry benchmark so they are the primary problem",
            correct: false,
            explanation: "Mature locations are at 23.5% of revenue, actually within the 24-26% industry benchmark. The problem is at new locations at 35.6% — nearly 10 percentage points above benchmark.",
          },
          {
            id: "d",
            text: "There is no labor problem — the difference is explained entirely by ramp-up and will resolve itself",
            correct: false,
            explanation: "While some improvement will happen naturally as new locations mature, 'waiting it out' is not a sufficient management strategy. Active scheduling optimization and wage management are needed to accelerate the improvement.",
          },
        ],
      },
      {
        id: "g1q5",
        stage: "Synthesis",
        question: "You now have enough data to build a comprehensive picture of BrewCo's margin problem. Which of the following best summarizes the root cause in a way you would present to the CEO?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "BrewCo's margin compression is driven by three compounding factors: commodity inflation in coffee and dairy (+$35M), immature new location labor inefficiency (+$22M above benchmark), and incremental food costs from the lunch menu (+$14M) — together representing $71M in excess costs against only $50M in incremental revenue from expansion.",
            correct: true,
            explanation: "Correct. This answer is specific, quantified, and MECE. It isolates the three drivers, puts dollar amounts on each, and frames the issue as a cost-revenue mismatch — which is exactly how a McKinsey partner would want it presented to a CEO.",
          },
          {
            id: "b",
            text: "BrewCo expanded too fast and should have grown more slowly.",
            correct: false,
            explanation: "This is a conclusion without supporting structure. It does not identify the specific mechanisms of margin compression, is not quantified, and does not distinguish between fixable problems (labor efficiency) and strategic decisions (expansion pace).",
          },
          {
            id: "c",
            text: "The main problem is commodity inflation which is outside BrewCo's control, so the CEO should focus on revenue growth to dilute the fixed cost base.",
            correct: false,
            explanation: "Commodity inflation is only one of three drivers and focusing only on revenue growth ignores the larger and more controllable labor efficiency issue. This framing would not be accepted at McKinsey.",
          },
          {
            id: "d",
            text: "BrewCo needs to close underperforming locations and raise prices.",
            correct: false,
            explanation: "These may be valid actions but jumping to solutions before completing diagnosis is a classic case interview mistake. The CEO question asks for root cause, not recommendations.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE 2: BCG — CLIMATE STRATEGY
  // ─────────────────────────────────────────────
  {
    id: "g2",
    title: "GreenCo Climate Strategy",
    type: "market_entry",
    difficulty: "intermediate",
    firm: "bcg",
    estimatedMinutes: 30,
    overview: "A global consumer goods company wants to set a science-based emissions reduction target and needs BCG to build the business case and identify the right initiatives to achieve it.",
    clientBackground: "GreenCo is a $12B global personal care company (hair care, skin care, cosmetics) operating in 45 countries. They have 8 manufacturing plants, 3 major distribution centers, and a supply chain spanning 400+ direct suppliers. Their current Scope 1 and 2 emissions are 890,000 tonnes CO2e per year. Scope 3 emissions (supply chain) are estimated at 4.2M tonnes CO2e. Two of their three largest competitors have not yet announced climate targets.",
    yourRole: "You are a BCG project leader on the sustainability practice. The client's Chief Sustainability Officer is your primary contact. You have 4 weeks to deliver a recommendation to the CEO and Board.",
    finalRecommendationPrompt: "The CEO asks you: should we commit to a 1.5°C science-based target, and if so, what are the three most important initiatives we should fund? Please be specific about costs, timeline, and expected emissions reductions.",
    idealRecommendation: "Yes, GreenCo should commit to a 1.5°C science-based target for three reasons: consumer demand is shifting rapidly (86% consider environmental impact in purchasing, willingness to pay doubled 2015-2020), first-mover advantage vs competitors, and regulatory inevitability in EU and California markets. The three priority initiatives should be: (1) Renewable energy transition for all 8 plants — $180M capex, 7-year payback, reduces Scope 1+2 by 65%; (2) Supplier sustainability program targeting top 50 suppliers representing 70% of Scope 3 — $45M over 3 years, reduces Scope 3 by 30%; (3) Packaging redesign to eliminate virgin plastic — $90M R&D and tooling, pays back through premium pricing and regulatory compliance savings.",
    keyTakeaways: [
      "Always build both the commercial case AND the environmental case — sustainability initiatives must be financially viable",
      "Scope 3 emissions (supply chain) are typically 5-10x larger than Scope 1+2 for consumer goods companies — they cannot be ignored",
      "First-mover advantage in sustainability is real but time-limited — competitors will follow",
      "Consumer willingness to pay for sustainability is growing rapidly but varies significantly by market and product category",
    ],
    questions: [
      {
        id: "g2q1",
        stage: "Problem Definition",
        question: "The CEO says: 'I want to do the right thing for the planet, but I also need to justify this to my Board. What's the business case for setting a science-based target?' What is the most compelling framing for the Board?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "It's the right thing to do morally and our employees will appreciate it",
            correct: false,
            explanation: "Employee sentiment matters but is not sufficient to justify a major capital commitment to a Board. This framing lacks financial rigor.",
          },
          {
            id: "b",
            text: "Setting a science-based target positions GreenCo to capture growing consumer demand for sustainable products, creates first-mover advantage over competitors, and mitigates regulatory risk in key markets — all of which protect and grow long-term shareholder value",
            correct: true,
            explanation: "Correct. This framing addresses the Board's primary concern — shareholder value — through three distinct mechanisms: revenue upside (consumer demand), competitive positioning (first-mover), and risk mitigation (regulatory). This is exactly how BCG would frame a sustainability business case.",
          },
          {
            id: "c",
            text: "Our competitors will eventually do it so we might as well be first",
            correct: false,
            explanation: "While the first-mover argument is valid, leading with 'everyone will do it' undersells the proactive commercial opportunity and sounds reactive rather than strategic.",
          },
          {
            id: "d",
            text: "The cost of not acting will exceed the cost of acting within 10 years due to carbon taxes",
            correct: false,
            explanation: "Carbon tax risk is one element of the business case but leading with a single risk factor is less compelling than a comprehensive strategic framing. Also, carbon tax projections are uncertain.",
          },
        ],
      },
      {
        id: "g2q2",
        stage: "Market Analysis",
        question: "BCG's consumer research team shares the following data on consumer attitudes toward sustainability. What is the single most important insight for GreenCo's business case?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Consumer Sustainability Attitudes Survey (n=12,000 across 8 markets)",
          data: `| Statement | 2015 | 2020 | Change |
|---|---|---|---|
| "I consider environmental impact when purchasing personal care products" | 70% | 86% | +16pp |
| "I prefer products with demonstrated environmental benefits" | 47% | 58% | +11pp |
| "I am willing to pay more for environmentally friendly products" | 22% | 44% | +22pp |
| "I have switched brands due to environmental concerns" | 8% | 31% | +23pp |
| "I actively research a brand's sustainability practices" | 12% | 38% | +26pp |

Premium willing to pay (among those willing to pay more):
- 1-5% premium: 41% of respondents
- 6-10% premium: 35% of respondents  
- 11-20% premium: 18% of respondents
- 20%+ premium: 6% of respondents

Markets with strongest sustainability preference: Germany (92%), Netherlands (89%), UK (84%), France (82%)
Markets with weakest: India (61%), Brazil (58%), Indonesia (54%)`,
        },
        options: [
          {
            id: "a",
            text: "86% of consumers consider environmental impact — this is a large addressable market",
            correct: false,
            explanation: "86% is notable but the more important insight is the trend and the willingness to pay data. Consideration does not equal purchase behavior.",
          },
          {
            id: "b",
            text: "The willingness to pay a premium doubled from 22% to 44% in 5 years, and 31% have already switched brands — this represents real, quantifiable revenue risk and opportunity",
            correct: true,
            explanation: "Correct. Willingness to pay is the metric that directly connects consumer sentiment to revenue. Doubling in 5 years is a powerful trend. The 31% brand switching figure is even more striking — it means GreenCo is already potentially losing customers to more sustainable competitors. This is the insight that moves Boards to action.",
          },
          {
            id: "c",
            text: "European markets care most about sustainability so GreenCo should focus their efforts there first",
            correct: false,
            explanation: "European market prioritization may be a valid tactical recommendation but it misses the strategic point — global consumer trends are moving in the same direction across all markets, just at different speeds.",
          },
          {
            id: "d",
            text: "Most consumers will only pay a 1-10% premium so the revenue upside is limited",
            correct: false,
            explanation: "A 1-10% premium on a $12B revenue base is $120-240M in incremental annual revenue — this is not 'limited.' Also, this ignores the brand switching and customer retention dimension entirely.",
          },
        ],
      },
      {
        id: "g2q3",
        stage: "Emissions Analysis",
        question: "The sustainability team shares GreenCo's emissions breakdown. Based on this data, where should GreenCo focus most of its emissions reduction efforts?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "GreenCo Emissions Profile (tonnes CO2e/year)",
          data: `| Scope | Category | Emissions | % of Total |
|---|---|---|---|
| Scope 1 | Direct (manufacturing fuel) | 320,000 | 6.3% |
| Scope 2 | Purchased electricity | 570,000 | 11.1% |
| Scope 3 | Purchased goods & services | 2,100,000 | 41.0% |
| Scope 3 | Use of sold products | 890,000 | 17.4% |
| Scope 3 | End-of-life treatment | 440,000 | 8.6% |
| Scope 3 | Upstream transportation | 380,000 | 7.4% |
| Scope 3 | Business travel | 95,000 | 1.9% |
| Scope 3 | Employee commuting | 62,000 | 1.2% |
| Scope 3 | Other | 253,000 | 4.9% |
| **Total** | | **5,110,000** | 100% |

Abatement cost estimates:
- Renewable energy (Scope 2): $28/tonne CO2e
- Manufacturing electrification (Scope 1): $45/tonne CO2e  
- Supplier sustainability programs (Scope 3 purchased goods): $62/tonne CO2e
- Product reformulation (Scope 3 use of products): $85/tonne CO2e
- Packaging redesign (Scope 3 end-of-life): $71/tonne CO2e`,
        },
        options: [
          {
            id: "a",
            text: "Focus on Scope 1 and 2 first because GreenCo has direct control over them",
            correct: false,
            explanation: "Control is one consideration but Scope 1+2 represent only 17.4% of total emissions. Focusing only on what you directly control and ignoring 82% of your footprint would not be accepted as a credible science-based target.",
          },
          {
            id: "b",
            text: "Scope 3 purchased goods (41% of total) should be the primary focus, supplemented by renewable energy transition (cheapest abatement at $28/tonne) for near-term wins",
            correct: true,
            explanation: "Correct. Scope 3 purchased goods represent 41% of total emissions — the largest single category. However, since supplier programs cost $62/tonne, GreenCo should sequence the work: start with cheap abatement (renewable energy at $28/tonne) for quick wins and credibility, then tackle the larger but harder Scope 3 challenge. This two-speed approach is exactly how BCG would structure the roadmap.",
          },
          {
            id: "c",
            text: "Business travel and commuting should be addressed first as they are easy wins",
            correct: false,
            explanation: "Business travel and commuting together represent only 3.1% of total emissions. Focusing on them first would be a distraction from the material emissions categories.",
          },
          {
            id: "d",
            text: "Product reformulation is most important because it addresses how consumers use the products",
            correct: false,
            explanation: "Use of sold products is significant (17.4%) and product reformulation is important long-term. However, at $85/tonne it is the most expensive abatement option and should not be the starting point when cheaper options exist.",
          },
        ],
      },
      {
        id: "g2q4",
        stage: "Initiative Prioritization",
        question: "BCG has identified 5 potential initiatives. Based on cost, emissions impact, and strategic value, which portfolio should GreenCo recommend to the Board?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Sustainability Initiative Evaluation Matrix",
          data: `| Initiative | Capex Required | Annual Emissions Reduction | Abatement Cost | Payback Period | Strategic Value |
|---|---|---|---|---|---|
| A: Renewable energy PPAs for all plants | $180M | 570,000 tCO2e | $28/t | 7 years | High — credible quick win |
| B: Supplier sustainability program (top 50) | $45M over 3 yrs | 630,000 tCO2e | $62/t | N/A (cost center) | Very High — 41% of footprint |
| C: Packaging redesign (eliminate virgin plastic) | $90M | 200,000 tCO2e | $71/t | 5 years (via premium pricing) | High — consumer visible |
| D: Fleet electrification (delivery vehicles) | $35M | 85,000 tCO2e | $41/t | 9 years | Medium |
| E: Product reformulation (water reduction) | $120M | 890,000 tCO2e | $85/t | 12 years | Very High — largest Scope 3 |

Budget constraint: Board has pre-approved up to $400M total capital for sustainability over 5 years
Science-based target requirement: Must reduce total emissions 50% by 2030 (from 5.1M to 2.55M tCO2e)
Current year: 2024`,
        },
        options: [
          {
            id: "a",
            text: "Initiatives A, B, and C — total cost $315M, total reduction 1.4M tCO2e, achieves 27% of total emissions — within budget and the most strategic portfolio",
            correct: true,
            explanation: "Correct. A+B+C costs $315M (within $400M budget), reduces emissions by 1.4M tCO2e, and selects the initiatives with the best combination of cost efficiency, strategic value, and consumer visibility. Initiative A is the cheapest per tonne, B tackles the largest emissions category, and C is consumer-visible and has a 5-year payback. This portfolio reduces total emissions by 27%, putting GreenCo well on track toward the 50% target when combined with ongoing operational improvements.",
          },
          {
            id: "b",
            text: "All 5 initiatives — maximum emissions reduction is always the right answer",
            correct: false,
            explanation: "All 5 initiatives would cost $470M, exceeding the $400M budget. Recommending an out-of-budget solution without addressing the constraint would not be accepted by the Board.",
          },
          {
            id: "c",
            text: "Initiative E only — it has the largest emissions reduction so it should be prioritized above all others",
            correct: false,
            explanation: "Initiative E has the highest abatement cost ($85/tonne), longest payback (12 years), and addresses only one emissions category. A single-initiative approach is too concentrated and ignores the cheaper, faster wins available.",
          },
          {
            id: "d",
            text: "Initiatives A and D — focus only on what GreenCo directly controls",
            correct: false,
            explanation: "A+D only reduces emissions by 655,000 tCO2e and ignores the largest emissions category (Scope 3 purchased goods). This portfolio would not meet the science-based target requirement.",
          },
        ],
      },
      {
        id: "g2q5",
        stage: "Risks and Implementation",
        question: "The CFO pushes back: 'Initiative B (Supplier Program) has no direct financial return — it's a pure cost. How do you justify $45M with no payback?' What is the strongest response?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "You're right, we should remove Initiative B from the recommendation",
            correct: false,
            explanation: "Backing down from a sound recommendation under CFO pressure is a classic consulting mistake. Initiative B addresses 41% of GreenCo's total emissions — removing it would make the science-based target impossible to achieve.",
          },
          {
            id: "b",
            text: "The supplier program has three indirect financial benefits that do not show up as direct ROI: (1) it protects $840M in EU revenue at risk from upcoming supply chain due diligence regulations, (2) it qualifies GreenCo for green bond financing at 40bps lower cost on $500M of upcoming debt, and (3) it builds supplier loyalty reducing supply disruption risk worth an estimated $120M in avoided costs over 5 years",
            correct: true,
            explanation: "Correct. This response quantifies the indirect financial benefits of the supplier program and frames them in CFO language (revenue protection, financing cost, risk avoidance). This is how BCG handles CFO pushback — don't retreat, reframe with numbers. The three benefits together exceed the $45M cost multiple times over.",
          },
          {
            id: "c",
            text: "Sustainability investments should not always be evaluated on traditional ROI — this is a strategic investment",
            correct: false,
            explanation: "While philosophically true, telling a CFO to ignore ROI is unlikely to be persuasive. A strong consultant finds ways to quantify strategic value rather than asking stakeholders to abandon their frameworks.",
          },
          {
            id: "d",
            text: "Our competitors will do this eventually so we need to stay ahead",
            correct: false,
            explanation: "Competitive pressure is a valid point but it does not answer the CFO's specific question about financial justification. This is a deflection, not an answer.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE 3: BAIN — RIDE SHARING MARKET SIZING
  // ─────────────────────────────────────────────
  {
    id: "g3",
    title: "RideMax US Market Sizing",
    type: "market_sizing",
    difficulty: "intermediate",
    firm: "bain",
    estimatedMinutes: 25,
    overview: "A private equity firm is considering investing in RideMax, a new ride-sharing startup. Before committing capital, they want Bain to size the US ride-sharing market and assess what share RideMax could realistically capture.",
    clientBackground: "RideMax is a 2-year-old ride-sharing startup operating in 3 US cities (Austin, Denver, Nashville). They currently process 45,000 rides per day across these markets. Their technology differentiator is a proprietary matching algorithm that reduces driver wait times by 23% compared to Uber. They are seeking $200M in Series B funding to expand to 15 additional cities.",
    yourRole: "You are a Bain associate on the PE diligence team. The partner needs a market sizing and market share analysis by end of day to inform the investment committee's decision.",
    finalRecommendationPrompt: "Based on your market sizing and competitive analysis, what total addressable market can RideMax realistically capture in 5 years, and does this justify the $200M investment at a $1.2B valuation?",
    idealRecommendation: "The US ride-sharing market represents approximately 35M rides per day, or ~$95B in annual gross bookings. RideMax's realistic 5-year target market is the 18 cities they plan to enter, representing approximately 8M rides per day. With their technology advantage and assuming aggressive but achievable execution, a 12-15% market share in target cities is plausible, representing $3-4B in annual gross bookings. At a 20% take rate this implies $600-800M in annual revenue by Year 5. The $1.2B valuation represents 1.5-2x Year 5 revenue, which is reasonable for a high-growth platform business. The investment is justified IF management can demonstrate operational efficiency in their current markets and a credible plan to reach unit economics positive within 24 months of launch in each new city.",
    keyTakeaways: [
      "Market sizing should always be triangulated from at least two angles (top-down and bottom-up)",
      "TAM vs SAM vs SOM — investors care most about the Serviceable Obtainable Market, not the total market",
      "Platform businesses are valued on revenue multiples and growth rate, not traditional PE metrics",
      "Technology differentiation only sustains competitive advantage if it is defensible — always probe for barriers to replication",
    ],
    questions: [
      {
        id: "g3q1",
        stage: "Structuring the Problem",
        question: "Before sizing the market, the partner asks you to clarify what exactly you are sizing. Which market definition is most useful for the investment decision?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Total US transportation market including cars, trains, buses, and taxis",
            correct: false,
            explanation: "This is too broad. RideMax does not compete with trains or buses in a meaningful way. A TAM this large would be misleading to the investment committee.",
          },
          {
            id: "b",
            text: "US ride-hailing market (app-based on-demand rides) — RideMax's direct competitive space",
            correct: true,
            explanation: "Correct. The investment committee needs to understand the competitive pool RideMax is fighting for, not the theoretical maximum. The ride-hailing market (Uber, Lyft, and competitors) is the right scope. You can note adjacencies (corporate travel, delivery) as future expansion opportunities.",
          },
          {
            id: "c",
            text: "Global ride-hailing market including China, India, and Southeast Asia",
            correct: false,
            explanation: "RideMax is currently US-only and the investment is for US expansion. The global market is irrelevant for a near-term investment decision and would inflate the TAM misleadingly.",
          },
          {
            id: "d",
            text: "The 18 cities RideMax plans to enter specifically",
            correct: false,
            explanation: "This is the SAM/SOM, not the TAM. You need the full market size first, then apply addressability filters. Sizing only the target cities would skip an important analytical step.",
          },
        ],
      },
      {
        id: "g3q2",
        stage: "Top-Down Sizing",
        question: "Using a top-down approach, estimate the total US ride-hailing market size in daily rides. Show your work using the following population data.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "US Population & Ride-Hailing Data",
          data: `| Segment | Population | Ride-Hailing Eligible (18-70, smartphone) | % Who Use Ride-Hailing Monthly | Avg Rides/Month |
|---|---|---|---|---|
| Major metros (top 20 cities) | 65M | 52M | 45% | 6 |
| Mid-size cities (pop 500K-2M) | 78M | 58M | 28% | 4 |
| Small cities & suburbs | 120M | 82M | 12% | 2 |
| Rural | 67M | 35M | 3% | 1 |
| **Total US** | **330M** | **227M** | | |

Additional context:
- US total population: 330M
- Smartphone penetration ages 18-70: ~82%
- Uber US market share: ~68%
- Lyft US market share: ~29%
- All others: ~3%
- Average ride fare: $18
- Platform take rate: ~25% (gross revenue / gross bookings)`,
        },
        options: [
          {
            id: "a",
            text: "Approximately 15M rides per day",
            correct: false,
            explanation: "Check your math. Using the data: Major metros: 52M x 45% x 6/30 = 4.68M/day. Mid-size: 58M x 28% x 4/30 = 2.17M/day. Small cities: 82M x 12% x 2/30 = 0.66M/day. Rural: 35M x 3% x 1/30 = 0.035M/day. Total ≈ 7.5M/day. 15M is approximately double the correct answer.",
          },
          {
            id: "b",
            text: "Approximately 35M rides per day",
            correct: false,
            explanation: "35M/day is too high. This would imply 10.5B rides annually, which exceeds all public estimates for the US market (~3-4B annually). Check your monthly-to-daily conversion and penetration rates.",
          },
          {
            id: "c",
            text: "Approximately 7.5M rides per day, or roughly $50B in annual gross bookings",
            correct: true,
            explanation: "Correct. Major metros: 52M x 45% x 6/30 = 4.68M/day. Mid-size: 58M x 28% x 4/30 = 2.17M/day. Small cities: 82M x 12% x 2/30 = 0.66M/day. Rural: 35M x 3% x 1/30 = 0.035M/day. Total ≈ 7.55M rides/day. Annual: 7.55M x 365 = 2.76B rides. At $18/ride = $49.7B gross bookings. This aligns well with industry estimates of ~$50B for the US ride-hailing market.",
          },
          {
            id: "d",
            text: "Approximately 2M rides per day — the market is smaller than people think",
            correct: false,
            explanation: "2M/day would imply only 730M annual rides in the US, which is far below actual market size. Uber alone reports approximately 2B rides per year in North America.",
          },
        ],
      },
      {
        id: "g3q3",
        stage: "Competitive Analysis",
        question: "RideMax claims their matching algorithm gives them a sustainable competitive advantage. How would you evaluate whether this advantage is durable?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Ask RideMax's engineers to explain how the algorithm works in technical detail",
            correct: false,
            explanation: "Technical explanation is not the same as competitive durability. Even if you understand how it works, you need to assess whether Uber or Lyft can replicate it.",
          },
          {
            id: "b",
            text: "Assess four dimensions: (1) Is the algorithm patented? (2) How long would it take Uber to replicate with their engineering resources? (3) Does the advantage compound with scale (network effects)? (4) Have drivers and riders actually demonstrated preference for RideMax based on this feature?",
            correct: true,
            explanation: "Correct. Competitive advantage durability requires assessing IP protection, replication cost/time, scalability, and — most importantly — whether real market participants actually value the differentiation. Bain would structure this as a 2x2 (strength of advantage x durability of advantage) and push hard on whether Uber's 5,000-person engineering team could replicate a 23% improvement in matching within 12-18 months.",
          },
          {
            id: "c",
            text: "RideMax has been operating for 2 years so the advantage must be durable or Uber would have copied it already",
            correct: false,
            explanation: "This is a logical fallacy. Uber may not have noticed a startup operating in 3 mid-sized cities yet. Two years of operation in small markets does not prove durability against a well-resourced incumbent that turns its attention to the threat.",
          },
          {
            id: "d",
            text: "The advantage is in the algorithm so it is inherently difficult to copy",
            correct: false,
            explanation: "Algorithms are generally not patentable in a meaningful way and can be reverse-engineered or independently developed. 'It's in the algorithm' is not a durability argument without more specifics.",
          },
        ],
      },
      {
        id: "g3q4",
        stage: "Unit Economics",
        question: "RideMax shares their unit economics from current markets. What does this data tell you about investment readiness?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "RideMax Unit Economics — Current 3-City Average",
          data: `| Metric | RideMax (Current) | Industry Benchmark |
|---|---|---|
| Gross bookings per ride | $16.80 | $18.00 |
| Platform take rate | 22% | 25% |
| Net revenue per ride | $3.70 | $4.50 |
| Driver incentives per ride | $1.20 | $0.80 |
| Customer acquisition cost (CAC) | $28 | $18 |
| Average rides before churn | 14 | 22 |
| Contribution margin per ride | $1.40 | $2.60 |
| Customer lifetime value (LTV) | $19.60 | $57.20 |
| LTV/CAC ratio | 0.70x | 3.2x |

Notes:
- Cities operational: Austin (18 months), Denver (12 months), Nashville (8 months)
- RideMax has not yet reached profitability in any market
- Driver incentives include sign-on bonuses and guaranteed minimums still in place`,
        },
        options: [
          {
            id: "a",
            text: "The unit economics are fine — the company is early stage so losses are expected",
            correct: false,
            explanation: "An LTV/CAC ratio of 0.70x means RideMax is destroying value on every customer acquired — they spend $28 to acquire a customer who generates only $19.60 in lifetime value. This is not simply 'early stage losses' — it indicates a fundamental unit economics problem that must be addressed before scaling.",
          },
          {
            id: "b",
            text: "The LTV/CAC ratio of 0.70x is a serious red flag — RideMax is destroying value on every customer. Before recommending the $200M investment, management must show a credible path to 2x+ LTV/CAC through improved retention and reduced CAC",
            correct: true,
            explanation: "Correct. An LTV/CAC below 1.0x means the business model is currently value-destructive. The benchmarks show mature ride-sharing economics at 3.2x. RideMax is far below this. The key levers are: reducing driver incentives as markets mature (currently 50% above benchmark), improving retention (14 vs 22 average rides before churn), and reducing CAC through organic growth as brand awareness builds. Bain would recommend tying investment tranches to hitting 1.5x LTV/CAC milestones.",
          },
          {
            id: "c",
            text: "The lower price point ($16.80 vs $18) is a smart competitive strategy to win market share",
            correct: false,
            explanation: "Lower prices may help with acquisition but they directly compress contribution margins. With already-negative unit economics, price discounting is the wrong lever to pull. The data shows retention (14 vs 22 rides) is a bigger issue than price.",
          },
          {
            id: "d",
            text: "Driver incentives are too high and should be cut immediately to improve unit economics",
            correct: false,
            explanation: "Cutting driver incentives too quickly in early markets could cause driver supply to collapse, destroying the service quality. This is a nuanced operational decision that requires market-by-market analysis, not a blanket cut.",
          },
        ],
      },
      {
        id: "g3q5",
        stage: "Investment Recommendation",
        question: "The PE partner asks: 'Bottom line — is this a good investment at $1.2B valuation?' Which response demonstrates the strongest analytical judgment?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Yes — the market is large ($50B), the technology is differentiated, and ride-sharing is a proven business model",
            correct: false,
            explanation: "This is a qualitative answer that ignores the fundamental unit economics problem. Recommending a $200M investment without addressing the 0.70x LTV/CAC ratio would be analytically irresponsible.",
          },
          {
            id: "b",
            text: "No — the unit economics are negative and the company should not receive more capital until they are fixed",
            correct: false,
            explanation: "This is too absolute. Many successful tech companies had negative unit economics early and fixed them at scale. The question is whether a credible path to positive unit economics exists, not whether the current snapshot is positive.",
          },
          {
            id: "c",
            text: "Conditionally yes — the market opportunity and technology differentiation are real, but the $200M should be structured as tranched investment with milestone gates tied to: LTV/CAC reaching 1.5x in current markets, CAC declining to $22 in new market launches, and contribution margin per ride reaching $2.00 within 18 months of each new city launch",
            correct: true,
            explanation: "Correct. This is the Bain answer — it acknowledges the opportunity while protecting the investor through structured milestones. Tranched investment with unit economics milestones is standard PE practice for early-stage platforms with unproven unit economics. It aligns management incentives with value creation and limits downside if the business model cannot be fixed.",
          },
          {
            id: "d",
            text: "We need more data before making a recommendation",
            correct: false,
            explanation: "'Need more data' is almost never an acceptable final answer in a case interview or real consulting engagement. You have been given sufficient data to form a conditional view. The job is to make a recommendation with appropriate caveats, not to defer.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 4: OLIVER WYMAN — INSURANCE M&A
  // ─────────────────────────────────────────────
  {
    id: "g4",
    title: "InsureCo Acquisition of HealthTech Startup",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "oliver_wyman",
    estimatedMinutes: 35,
    overview: "A top-5 US health insurance company is considering acquiring a health tech startup that uses AI to predict high-cost claimants. Oliver Wyman has been engaged to evaluate the deal.",
    clientBackground: "InsureCo is a $45B revenue health insurer with 18M members. Their medical loss ratio (MLR) is 87%, compared to an industry best-in-class of 82%. HealthPredict is a 4-year-old startup with 120 employees that uses machine learning to identify members at high risk of costly hospitalizations 6-12 months before the event, enabling proactive care management interventions. HealthPredict currently has contracts with 3 regional insurers covering 2.1M members. Their technology has demonstrated a 19% reduction in hospitalizations for identified high-risk members.",
    yourRole: "You are an Oliver Wyman senior associate on the financial services practice. The InsureCo CFO is your day-to-day client. You have 3 weeks to deliver a go/no-go recommendation with financial analysis.",
    finalRecommendationPrompt: "Should InsureCo acquire HealthPredict at the proposed valuation of $800M? What are the key value drivers and risks?",
    idealRecommendation: "InsureCo should acquire HealthPredict at $800M, which represents fair value given the potential MLR improvement. The core value thesis: applying HealthPredict's technology to InsureCo's 18M members at 15% identification rate and 19% hospitalization reduction generates $1.1B in annual claims savings, improving MLR by 2.4 percentage points from 87% to 84.6% — worth approximately $1.08B in annual EBITDA improvement. At a 15x EBITDA multiple, this creates $16B in enterprise value against an $800M acquisition price. Key risks: technology performance at scale (proven on 2.1M members, needs validation on 18M), physician and member adoption, and regulatory scrutiny of AI in healthcare. Recommend proceeding with $800M acquisition, structured with $640M upfront and $160M in earnout tied to MLR improvement milestones over 3 years.",
    keyTakeaways: [
      "In insurance M&A, always anchor the financial analysis on the medical loss ratio — it is the single most important metric",
      "AI/ML technology acquisitions require careful validation of whether performance at small scale replicates at large scale",
      "Earnout structures are appropriate when there is uncertainty about whether the acquired technology will perform as claimed",
      "Regulatory risk in healthcare M&A is significant — always include it as a key consideration",
    ],
    questions: [
      {
        id: "g4q1",
        stage: "Strategic Rationale",
        question: "InsureCo's CEO says the acquisition is strategically motivated by wanting to 'become more data-driven.' What is the most rigorous way to evaluate whether this acquisition makes strategic sense?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Assess whether InsureCo can build the same capability organically for less than $800M",
            correct: false,
            explanation: "Build vs buy is one dimension but not sufficient on its own. You also need to assess time-to-value (building takes 3-5 years vs instant with acquisition) and execution risk (InsureCo may not have the AI talent to build this internally).",
          },
          {
            id: "b",
            text: "Evaluate three questions: (1) Does HealthPredict's technology actually work at InsureCo's scale? (2) Is $800M a fair price for the value it creates? (3) Are there build/partner alternatives that achieve the same outcome at lower cost/risk?",
            correct: true,
            explanation: "Correct. Oliver Wyman would structure the strategic rationale evaluation around these three questions. Technology validation at scale is the most critical unknown. Financial valuation grounds the discussion in numbers. And build/partner alternatives ensure you are not overpaying for something accessible through other means.",
          },
          {
            id: "c",
            text: "Check whether competitors have made similar acquisitions",
            correct: false,
            explanation: "Competitor benchmarking is useful context but is not a rigorous evaluation framework. Competitors may have made mistakes or have different strategic positions.",
          },
          {
            id: "d",
            text: "Survey InsureCo's physicians and care managers to see if they would use the technology",
            correct: false,
            explanation: "User adoption is an important implementation consideration but it comes after you establish strategic and financial rationale. Doing user research before financial analysis puts the cart before the horse.",
          },
        ],
      },
      {
        id: "g4q2",
        stage: "Financial Analysis",
        question: "Using the following data, calculate the potential annual financial value of applying HealthPredict's technology to InsureCo's full member base.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "InsureCo & HealthPredict Financial Data",
          data: `| Metric | Value |
|---|---|
| InsureCo annual revenue | $45B |
| InsureCo medical loss ratio (MLR) | 87% |
| InsureCo annual claims paid | $39.15B |
| InsureCo total members | 18M |
| Average annual claims per member | $2,175 |
| HealthPredict identification rate (% of members flagged as high-risk) | 15% |
| HealthPredict hospitalization reduction for identified members | 19% |
| Average cost of a hospitalization | $28,000 |
| Hospitalizations per 1,000 members annually (industry avg) | 85 |
| HealthPredict annual license cost per member (current pricing) | $18 |
| Technology integration and implementation cost (one-time) | $120M |`,
        },
        options: [
          {
            id: "a",
            text: "Annual value: approximately $650M in claims savings",
            correct: false,
            explanation: "Check your calculation. High-risk members: 18M x 15% = 2.7M members. Hospitalizations among high-risk (assuming 3x average rate): 2.7M x 255/1000 = 688,500 hospitalizations. 19% reduction = 130,815 avoided hospitalizations. At $28,000 each = $3.66B. That's too high — the 3x multiplier is incorrect without specific data. Using the base rate: 18M x 85/1000 = 1.53M total hospitalizations. High-risk share: 15% of members but representing ~40% of hospitalizations = 612,000. 19% reduction = 116,280 avoided hospitalizations x $28,000 = $3.26B. $650M is too low.",
          },
          {
            id: "b",
            text: "Annual value: approximately $1.1B in claims savings, improving MLR by approximately 2.4 percentage points",
            correct: true,
            explanation: "Correct approach: InsureCo has 18M x 85/1000 = 1.53M annual hospitalizations. High-risk members (15% of total = 2.7M) typically account for a disproportionate share — approximately 40% of hospitalizations based on industry data = 612,000 hospitalizations. HealthPredict reduces these by 19% = 116,280 avoided hospitalizations x $28,000 = $3.26B gross savings. However, only a subset will be successfully intervened — assume 35% intervention success rate = $1.14B net savings. MLR improvement: $1.14B / $45B revenue = 2.53 percentage points. Minus $18 license cost per member ($324M) = net $816M. This validates the ~$1.1B range.",
          },
          {
            id: "c",
            text: "Annual value: approximately $3.5B — this makes the $800M acquisition a clear no-brainer",
            correct: false,
            explanation: "Gross hospitalization savings of $3B+ are mathematically possible but ignore intervention success rates, implementation costs, and the fact that not all identified high-risk patients will participate in care management programs. Always apply realistic conversion rates to theoretical savings.",
          },
          {
            id: "d",
            text: "The financial value cannot be calculated without knowing InsureCo's specific hospitalization rate for high-risk members",
            correct: false,
            explanation: "You have enough data to make a reasonable estimate using industry averages and the data provided. 'Cannot calculate' is not acceptable — make explicit assumptions and calculate.",
          },
        ],
      },
      {
        id: "g4q3",
        stage: "Valuation",
        question: "HealthPredict is asking for $800M. How would you assess whether this is a fair price?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "HealthPredict Financial & Comparable Data",
          data: `| HealthPredict Metric | Value |
|---|---|
| Annual recurring revenue (ARR) | $38M |
| ARR growth rate | 85% YoY |
| Gross margin | 72% |
| EBITDA | -$12M (investing in growth) |
| Members covered | 2.1M |
| Revenue per member | $18/year |
| Implied valuation multiple (on ARR) | 21x ARR |

Comparable Transactions (Health IT M&A, last 3 years):
| Company | ARR at Acquisition | Multiple | Notes |
|---|---|---|---|
| ClaimAI (acquired by UnitedHealth) | $45M | 18x | AI claims processing |
| CarePredict (acquired by Aetna) | $28M | 24x | Care management AI |
| RiskScore Inc (acquired by Humana) | $62M | 15x | Risk stratification |
| WellnessAI (acquired by CVS) | $31M | 22x | Preventive care AI |
| Average comparable | | 19.75x | |`,
        },
        options: [
          {
            id: "a",
            text: "At 21x ARR, HealthPredict is overpriced relative to the 19.75x comparable average — InsureCo should negotiate down to $750M",
            correct: false,
            explanation: "21x vs 19.75x is a small premium easily justified by HealthPredict's 85% ARR growth rate (faster than most comparables) and strategic value to InsureCo specifically. Mechanically anchoring to a comparable average without adjusting for growth rate is not rigorous valuation.",
          },
          {
            id: "b",
            text: "The $800M price is fair. At 21x ARR it is a modest premium to comparables justified by 85% growth. More importantly, the strategic value to InsureCo ($1.1B+ in annual claims savings) creates a value-to-price ratio of approximately 14x — making this financially compelling regardless of market comparables",
            correct: true,
            explanation: "Correct. This answer uses two valuation methods: (1) comparable transaction multiples — 21x is reasonable given 85% growth and aligns with 19.75x average; (2) synergy-based intrinsic value — $1.1B annual savings x 10-15x multiple = $11-16B in value created against $800M price. The strategic value framing is most relevant for a strategic acquirer like InsureCo and should be the primary valuation anchor.",
          },
          {
            id: "c",
            text: "HealthPredict is not profitable so it should not be valued above 5x revenue",
            correct: false,
            explanation: "High-growth SaaS and health tech companies are routinely valued at 15-25x ARR regardless of current profitability. EBITDA-based valuation is not appropriate for early-stage, high-growth businesses where growth investment is intentional and temporary.",
          },
          {
            id: "d",
            text: "We need a full DCF model before concluding on valuation",
            correct: false,
            explanation: "While a DCF is useful, in M&A diligence with limited time, comparable transaction multiples combined with strategic value analysis is sufficient to form a recommendation. 'Need a DCF' without being able to directionally assess the deal is not a strong answer.",
          },
        ],
      },
      {
        id: "g4q4",
        stage: "Risk Assessment",
        question: "What are the three most critical risks in this acquisition that must be addressed before the Board approves the deal?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Technology performance at scale, physician adoption, and key person retention",
            correct: false,
            explanation: "These are all valid risks but physician adoption and key person retention are implementation risks — important but secondary to the three most fundamental risks that could invalidate the deal thesis entirely.",
          },
          {
            id: "b",
            text: "Technology scale risk (proven on 2.1M, unproven on 18M), regulatory/HIPAA risk (AI in healthcare is under increasing scrutiny), and integration execution risk (culture clash between a 120-person startup and a large insurer)",
            correct: true,
            explanation: "Correct. These three risks are deal-level risks that could invalidate the $800M investment thesis. Scale risk: if the algorithm's 19% effectiveness degrades at 18M members, the entire financial model falls apart. Regulatory risk: CMS and state regulators are actively scrutinizing AI use in insurance coverage decisions. Integration risk: acquiring a startup into a large bureaucratic insurer has a poor historical track record — culture, speed, and talent retention are all at risk.",
          },
          {
            id: "c",
            text: "Competition from other health tech companies, data privacy concerns, and customer churn",
            correct: false,
            explanation: "Competition and data privacy are valid ongoing business risks but they are not deal-specific risks that the Board needs to resolve before approving the acquisition. Customer churn refers to insurer clients of HealthPredict — this is a valid concern but lower priority than the three fundamental deal risks.",
          },
          {
            id: "d",
            text: "The startup may be overvalued and the founders may leave after acquisition",
            correct: false,
            explanation: "Valuation risk is already addressed in the financial analysis and the comparable transaction work suggests $800M is fair. Founder retention is important but can be managed through equity lockups and earnouts — it is not a deal-stopper.",
          },
        ],
      },
      {
        id: "g4q5",
        stage: "Deal Structure",
        question: "Given the technology scale risk, how would you recommend structuring the $800M purchase price?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Full $800M upfront — the technology is proven and paying in full secures the deal and retains founders",
            correct: false,
            explanation: "Paying full price upfront when there is meaningful uncertainty about technology performance at scale removes all downside protection for InsureCo. This would not be recommended by Oliver Wyman.",
          },
          {
            id: "b",
            text: "$640M upfront (80%) with $160M earnout tied to MLR improvement milestones: $80M if MLR improves by 1.5pp in Year 2, additional $80M if MLR improves by 2.5pp in Year 3",
            correct: true,
            explanation: "Correct. An 80/20 upfront/earnout structure is appropriate here. The upfront payment is sufficient to close the deal and retain founders. The earnout directly ties the remaining consideration to the specific value driver — MLR improvement — that justifies the acquisition price. Milestone-based earnouts are the standard Oliver Wyman recommendation when technology performance is the key uncertainty.",
          },
          {
            id: "c",
            text: "$400M upfront (50%) with $400M in earnout — maximum protection for InsureCo",
            correct: false,
            explanation: "A 50/50 structure is too aggressive for a deal with comparably-supported valuation. HealthPredict's founders would likely reject a deal where half the consideration is contingent, and it signals low conviction to the market.",
          },
          {
            id: "d",
            text: "Stock-for-stock acquisition — no cash consideration, align incentives through equity",
            correct: false,
            explanation: "A health tech startup with 85% growth would not accept stock in a slow-growing insurance company in lieu of cash. This deal structure would not be viable.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 5: DELOITTE — AIRLINE OPERATIONS
  // ─────────────────────────────────────────────
  {
    id: "g5",
    title: "AirCore Maintenance Operations Turnaround",
    type: "operations",
    difficulty: "intermediate",
    firm: "deloitte",
    estimatedMinutes: 30,
    overview: "A major US airline has seen maintenance-related delays surge 34% and maintenance costs rise 28% over 18 months. Deloitte has been engaged to diagnose and fix the problem.",
    clientBackground: "AirCore operates 450 aircraft with hubs in Chicago, Dallas, and Atlanta. They have 8,400 maintenance technicians across 6 maintenance bases. The airline industry operates on razor-thin margins — a 1% increase in on-time performance is worth approximately $85M annually in reduced costs and increased revenue. AirCore's on-time performance has fallen from 81% to 74% over the past 18 months, costing an estimated $595M annually.",
    yourRole: "You are a Deloitte senior consultant on the operations practice. You have been on the ground at AirCore's Chicago maintenance base for two weeks conducting interviews and data analysis.",
    finalRecommendationPrompt: "What are the top three operational changes AirCore must make to recover their on-time performance and reduce maintenance costs? What timeline and investment is required?",
    idealRecommendation: "AirCore should implement three changes: (1) Predictive maintenance program using existing aircraft sensor data — $45M investment, 18-month implementation, estimated $180M annual savings from reduced unplanned maintenance events; (2) Parts inventory optimization using demand-sensing algorithms — $12M investment, 6-month implementation, $67M annual savings from reduced AOG (aircraft on ground) events and inventory carrying costs; (3) Technician scheduling redesign based on aircraft rotation patterns — $8M investment, 3-month implementation, $45M annual savings from reduced overtime and improved productivity. Total investment $65M, total annual savings $292M, payback under 3 months.",
    keyTakeaways: [
      "In operations cases, always separate unplanned from planned downtime — they have very different root causes and solutions",
      "Inventory management is often the hidden culprit in maintenance delays — parts availability is as important as technician availability",
      "Technician scheduling in 24/7 operations is highly complex — small inefficiencies compound across thousands of shifts",
      "Implementation sequencing matters — quick wins build credibility while longer-term programs are being built",
    ],
    questions: [
      {
        id: "g5q1",
        stage: "Problem Definition",
        question: "Before diving into data, how would you structure your diagnosis of AirCore's maintenance problem?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Interview the CEO and COO to understand their perspective on what's causing the delays",
            correct: false,
            explanation: "Executive interviews are useful but should not be the first step. Executives often have opinions about symptoms, not root causes. You need a structured diagnostic framework first.",
          },
          {
            id: "b",
            text: "Structure the problem into three buckets: People (technician availability, skills, scheduling), Parts (inventory, procurement, supplier reliability), and Processes (maintenance planning, documentation, quality control) — then gather data against each bucket",
            correct: true,
            explanation: "Correct. This MECE framework covers the three fundamental inputs to maintenance operations. Deloitte operations consultants typically use a People/Parts/Processes framework for maintenance diagnostics. It ensures you don't miss a major category and allows you to prioritize data collection efficiently.",
          },
          {
            id: "c",
            text: "Focus immediately on the cost increase since that is the CFO's primary concern",
            correct: false,
            explanation: "Cost and delays are likely symptoms of the same underlying problems. Focusing only on cost without understanding the operational drivers will lead to superficial recommendations like headcount cuts that may worsen the delay problem.",
          },
          {
            id: "d",
            text: "Benchmark AirCore against United and Delta to see where the gaps are",
            correct: false,
            explanation: "Benchmarking is useful but it tells you where you are relative to peers, not why you are there. You need root cause analysis first, then benchmarking to validate the size of the opportunity.",
          },
        ],
      },
      {
        id: "g5q2",
        stage: "Data Analysis",
        question: "Your team pulls the following data on maintenance delay causes. What is your primary insight?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "AirCore Maintenance Delay Root Cause Analysis",
          data: `| Delay Category | # Delays (Last 12 months) | Avg Delay Duration | Total Delay Hours | % of Total | YoY Change |
|---|---|---|---|---|---|
| Unplanned component failure | 4,820 | 3.2 hrs | 15,424 | 38% | +67% |
| Parts not available (AOG) | 3,210 | 4.8 hrs | 15,408 | 38% | +89% |
| Technician not available | 1,890 | 1.4 hrs | 2,646 | 7% | +12% |
| Documentation/paperwork | 1,420 | 1.1 hrs | 1,562 | 4% | +8% |
| Third-party vendor delays | 980 | 3.6 hrs | 3,528 | 9% | +31% |
| Other | 620 | 1.8 hrs | 1,116 | 3% | +5% |
| **Total** | **12,940** | | **40,084** | 100% | **+34%** |

Parts inventory data:
- AOG events increased from 1,700 to 3,210 (+89%)
- Average parts wait time: 6.2 hours (up from 3.1 hours)
- Parts fill rate: 67% (down from 84%)
- Supplier on-time delivery: 71% (down from 88%)`,
        },
        options: [
          {
            id: "a",
            text: "Technician availability is the biggest problem and AirCore should hire more maintenance staff",
            correct: false,
            explanation: "Technician availability represents only 7% of total delay hours and grew only 12% YoY — it is the smallest major category and the slowest growing. Hiring more technicians would address the wrong problem.",
          },
          {
            id: "b",
            text: "Unplanned component failures and parts availability together represent 76% of delay hours and both are growing rapidly — the root cause is likely inadequate predictive maintenance and parts supply chain breakdown",
            correct: true,
            explanation: "Correct. These two categories together account for 76% of all delay hours and are growing 67% and 89% respectively — far faster than the overall 34% increase. This points to two distinct but related problems: (1) AirCore is not predicting component failures early enough, leading to unplanned events; (2) when failures do occur, the parts are not available, compounding the delay. This is a classic predictive maintenance + inventory management problem.",
          },
          {
            id: "c",
            text: "Third-party vendor delays are the hidden problem because they are outside AirCore's control",
            correct: false,
            explanation: "Third-party vendor delays represent 9% of delay hours — significant but not primary. Also, vendor performance is partially within AirCore's control through better contract management, dual-sourcing, and SLA enforcement.",
          },
          {
            id: "d",
            text: "The documentation problem should be fixed first because it is an easy win",
            correct: false,
            explanation: "Documentation represents only 4% of delay hours. Fixing it first would be prioritizing effort on a low-impact area while the two major problems (76% of delays) continue unchecked.",
          },
        ],
      },
      {
        id: "g5q3",
        stage: "Root Cause — Predictive Maintenance",
        question: "You investigate the unplanned component failure trend. What does the following data reveal?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Component Failure Analysis",
          data: `| Component Category | Failures (12mo) | % Predictable with Sensor Data | Current Monitoring Status | Competitor Practice |
|---|---|---|---|---|
| Engine components | 820 | 78% | Manual inspection only | Real-time sensor monitoring |
| Landing gear | 640 | 45% | Sensor monitoring (partial) | Full sensor + ML prediction |
| Avionics | 1,240 | 62% | Log review post-flight | Real-time anomaly detection |
| Hydraulics | 980 | 71% | Manual inspection only | Sensor monitoring |
| Cabin systems | 1,140 | 15% | Reactive only | Reactive only (industry norm) |
| **Total** | **4,820** | **54% avg** | | |

AirCore sensor data availability:
- All 450 aircraft have ACARS systems generating ~50,000 data points per flight
- Current usage of ACARS data: maintenance logs and fuel efficiency only
- Estimated cost to implement ML predictive maintenance: $45M
- Estimated reduction in unplanned failures if implemented: 55-65%`,
        },
        options: [
          {
            id: "a",
            text: "AirCore should focus on cabin systems since they have the most failures",
            correct: false,
            explanation: "Cabin systems have 1,140 failures but only 15% are predictable — the industry norm is also reactive. This is not where the highest leverage intervention lies.",
          },
          {
            id: "b",
            text: "AirCore already has the sensor data needed for predictive maintenance on 54% of failures but is not using it — implementing ML on existing ACARS data is the highest-leverage intervention",
            correct: true,
            explanation: "Correct. This is a classic 'data you already have but aren't using' insight. AirCore generates 50,000 data points per flight per aircraft but uses ACARS data only for logs and fuel. Competitors are using the same type of data for real-time failure prediction. At $45M investment with 55-65% failure reduction, the ROI is exceptional — potentially $180M+ in annual savings against $45M cost.",
          },
          {
            id: "c",
            text: "AirCore should outsource all maintenance to a third party to reduce operational complexity",
            correct: false,
            explanation: "Maintenance outsourcing is a major strategic decision with significant labor relations, quality control, and cost implications. It is not a diagnostic finding from this data and would be a massive scope expansion without evidence it would help.",
          },
          {
            id: "d",
            text: "The problem is that AirCore's mechanics are not skilled enough to prevent component failures",
            correct: false,
            explanation: "There is no data suggesting technician skill is the issue. The failure patterns correlate with monitoring gaps, not skill gaps — the same failure rates occur on components where competitors use sensors, suggesting the problem is information availability, not execution.",
          },
        ],
      },
      {
        id: "g5q4",
        stage: "Root Cause — Parts Inventory",
        question: "You dig into the AOG (aircraft on ground) parts problem. What does this data tell you about the root cause?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Parts Inventory Analysis",
          data: `| Metric | Current | 18 Months Ago | Industry Benchmark |
|---|---|---|---|
| Parts fill rate | 67% | 84% | 92% |
| Inventory turns per year | 3.2x | 4.8x | 5.5x |
| Excess/obsolete inventory (% of total) | 28% | 14% | 8% |
| Emergency/expedited orders (% of total orders) | 31% | 12% | 6% |
| Top 20 parts (by AOG frequency) stocked at all 6 bases | 34% | 78% | 95% |
| Average supplier lead time (days) | 8.2 | 4.6 | 3.8 |
| Number of active suppliers | 847 | 612 | ~400 (benchmark) |
| Inventory carrying cost | $142M | $96M | |

Parts demand forecasting method: 
- Current: 24-month historical average
- Industry best practice: ML demand sensing with aircraft age/utilization weighting`,
        },
        options: [
          {
            id: "a",
            text: "AirCore has too many suppliers and should consolidate to reduce complexity",
            correct: false,
            explanation: "Supplier consolidation is a valid lever but it addresses only one symptom. The data shows multiple interconnected problems — supplier lead time, forecasting accuracy, and inventory positioning — that require a more comprehensive solution.",
          },
          {
            id: "b",
            text: "AirCore's inventory problem has three root causes: poor demand forecasting (using simple historical average vs ML), poor inventory positioning (only 34% of critical parts stocked at all bases vs 95% benchmark), and supplier lead time deterioration (8.2 vs 3.8 days benchmark) — together causing AOG events to nearly double",
            correct: true,
            explanation: "Correct. This answer correctly identifies three distinct but interconnected root causes. The forecasting problem means AirCore is ordering the wrong parts in the wrong quantities. The positioning problem means even when parts are in inventory they may be at the wrong base. The supplier lead time problem means when parts run out, emergency orders take twice as long as the benchmark. All three must be addressed together.",
          },
          {
            id: "c",
            text: "AirCore should increase inventory levels across all parts to ensure availability",
            correct: false,
            explanation: "Indiscriminate inventory increase would worsen the already high carrying cost ($142M) and excess inventory problem (28% vs 8% benchmark). The solution is smarter inventory, not more inventory.",
          },
          {
            id: "d",
            text: "The 28% excess/obsolete inventory suggests AirCore is buying too many parts — they should reduce procurement",
            correct: false,
            explanation: "High excess inventory and high AOG rates coexisting indicates a distribution/forecasting problem, not an overall volume problem. AirCore has too many of the wrong parts and not enough of the right parts in the right places.",
          },
        ],
      },
      {
        id: "g5q5",
        stage: "Recommendation",
        question: "The COO asks: 'If I can only fund two of your recommendations, which two should I pick and why?' You have three options: predictive maintenance ($45M, 18 months, $180M savings), inventory optimization ($12M, 6 months, $67M savings), and technician scheduling ($8M, 3 months, $45M savings). Which two do you recommend?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Predictive maintenance and inventory optimization — they address the two largest delay categories (38% each) and together solve 76% of the delay problem",
            correct: true,
            explanation: "Correct. These two initiatives address the root causes of 76% of delay hours (the two 38% buckets). Their combined savings of $247M against $57M investment represents a 4.3x return. Technician scheduling ($8M, $45M savings) is also attractive but the COO asked for two and these two address the largest problems. The scheduling initiative can be funded from the first year savings of the other two.",
          },
          {
            id: "b",
            text: "Technician scheduling and inventory optimization — they are faster to implement and have the best near-term ROI",
            correct: false,
            explanation: "While scheduling and inventory have faster implementation timelines, they do not address unplanned component failures (38% of delays). This leaves the largest and fastest-growing delay category completely unaddressed.",
          },
          {
            id: "c",
            text: "All three should be funded — $65M is a small investment for $292M in savings",
            correct: false,
            explanation: "The COO specifically said 'only two' — not responding to the constraint is a listening failure. In a real engagement, you must answer the question asked, not the question you wish was asked.",
          },
          {
            id: "d",
            text: "Predictive maintenance alone — it has the highest absolute savings so it should be the sole focus",
            correct: false,
            explanation: "Predictive maintenance alone takes 18 months to implement. The inventory problem (also 38% of delays) can be fixed in 6 months for $12M. Ignoring a high-ROI, fast-payback initiative to focus on one thing when two were requested is not optimal.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 6: LEK — PE ACQUISITION OF SAAS
  // ─────────────────────────────────────────────
  {
    id: "g6",
    title: "Apex Capital: SaaS Acquisition Diligence",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "lek",
    estimatedMinutes: 35,
    overview: "A private equity firm is evaluating a $2.1B acquisition of CloudSuite, a mid-market HR SaaS company. L.E.K. has been engaged to conduct commercial and financial diligence.",
    clientBackground: "CloudSuite provides HR software (payroll, benefits, performance management) to mid-market companies (500-5,000 employees) in the US. They have 1,850 customers, $185M ARR, 118% net revenue retention, and 34% YoY growth. They are currently loss-making with -$22M EBITDA as they invest aggressively in S&M. The seller is the founding team who want liquidity. Apex Capital is proposing a $2.1B acquisition (11.4x ARR).",
    yourRole: "You are an L.E.K. manager on the financial services and technology practice. You have 3 weeks to deliver a go/no-go recommendation with full financial model to Apex Capital's investment committee.",
    finalRecommendationPrompt: "Should Apex Capital proceed with the $2.1B acquisition of CloudSuite? What is your base case and bear case IRR, and what are the key value creation levers?",
    idealRecommendation: "Apex should proceed. Base case IRR: 24% over 5 years. CloudSuite's 118% NRR is exceptional and validates strong product-market fit. The TAM ($14B) is large and growing, the company holds only 1.3% market share with clear expansion headroom. Key value creation levers: S&M efficiency improvement (currently spending $0.78 to acquire $1 of ARR vs $0.45 benchmark) could add $40M EBITDA/year; pricing optimization (currently $100/employee/year vs $135 benchmark) could add $45M ARR without churn risk given high switching costs; international expansion (currently 0% non-US revenue) represents $4-6B incremental TAM. Bear case (growth slows to 18%, margins don't improve): IRR of 14% — still above Apex's 12% hurdle rate. Key risk: competitive pressure from Workday and ADP entering the mid-market.",
    keyTakeaways: [
      "Net revenue retention above 100% is the single most important metric for SaaS quality — it means existing customers are growing revenue without any new customer adds",
      "CAC payback period and LTV/CAC ratio are the two most important unit economics metrics for SaaS",
      "PE value creation in SaaS typically comes from three levers: S&M efficiency, pricing optimization, and geographic expansion",
      "Always model a bear case alongside base case — investors need to know the floor, not just the ceiling",
    ],
    questions: [
      {
        id: "g6q1",
        stage: "Business Quality Assessment",
        question: "The investment committee asks you to give a one-paragraph assessment of CloudSuite's business quality before looking at valuation. What are the two or three metrics that most determine your view?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Revenue growth (34% YoY) and total ARR ($185M) — these show the company is scaling well",
            correct: false,
            explanation: "Revenue growth and ARR size are important but they are surface metrics. They don't tell you about the quality of growth (is it sustainable?), unit economics (is it profitable to acquire customers?), or retention (are customers staying?).",
          },
          {
            id: "b",
            text: "Net Revenue Retention (118%) and CAC payback period — NRR proves existing customers are growing revenue organically, and CAC payback determines how efficiently growth capital is being deployed",
            correct: true,
            explanation: "Correct. L.E.K. and PE firms focus on these two metrics above all others for SaaS quality. 118% NRR means existing customers are expanding at 18% per year net of churn — this is exceptional and means the business can grow even without winning new customers. CAC payback tells you how long it takes to recover customer acquisition cost — the faster the better. Together these two metrics tell you whether the business is fundamentally sound.",
          },
          {
            id: "c",
            text: "EBITDA margin (-12%) and cash burn — profitability is the most important metric for any business",
            correct: false,
            explanation: "For high-growth SaaS companies being evaluated for PE acquisition, current EBITDA is often intentionally negative due to growth investment. The question is whether unit economics support eventual profitability, not whether the company is currently profitable.",
          },
          {
            id: "d",
            text: "Number of customers (1,850) and average contract value — customer count shows market penetration",
            correct: false,
            explanation: "Customer count alone doesn't tell you about customer quality, concentration risk, or whether customers are happy. ACV matters but without NRR you don't know if customers are growing or churning.",
          },
        ],
      },
      {
        id: "g6q2",
        stage: "Unit Economics",
        question: "L.E.K. has built the following unit economics analysis. What is the most important finding?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "CloudSuite Unit Economics Analysis",
          data: `| Metric | CloudSuite | SaaS Benchmark (Rule of 40+) |
|---|---|---|
| ARR Growth Rate | 34% | >25% |
| Net Revenue Retention | 118% | >110% |
| Gross Margin | 72% | >70% |
| S&M as % of Revenue | 48% | 30-35% |
| CAC (fully loaded) | $145,000 | $85,000 |
| Average ACV | $100,000 | $120,000 |
| CAC Payback Period | 17 months | 12 months |
| LTV (at 118% NRR, 5% gross churn) | $2.1M | N/A |
| LTV/CAC | 14.5x | >5x |
| Rule of 40 Score | 22 (34% growth + -12% EBITDA) | >40 |

Customer concentration:
- Top 10 customers: 8% of ARR
- Top 50 customers: 31% of ARR
- Average customer tenure: 4.2 years
- Gross churn rate: 5.2% annually`,
        },
        options: [
          {
            id: "a",
            text: "The Rule of 40 score of 22 is below the 40 benchmark — this is a disqualifying weakness",
            correct: false,
            explanation: "Rule of 40 is a useful heuristic but not a hard cutoff. A 34% growth company with improving margins is more attractive than a 20% growth company with 20% EBITDA margins, even if both score 40. The 22 score reflects intentional growth investment, not structural inefficiency.",
          },
          {
            id: "b",
            text: "S&M efficiency is the primary weakness — CloudSuite spends $0.48 in S&M per dollar of revenue vs $0.32 benchmark, and CAC payback of 17 months vs 12 months benchmark represents the main value creation opportunity for Apex",
            correct: true,
            explanation: "Correct. The LTV/CAC of 14.5x is outstanding and the NRR of 118% confirms exceptional product-market fit. The weakness — and therefore the PE value creation opportunity — is S&M efficiency. CloudSuite is overspending to acquire customers relative to benchmark. Apex can create value by improving S&M productivity (better targeting, improved conversion, reduced CAC) while maintaining the excellent NRR. This is a common and well-understood PE value creation lever in SaaS.",
          },
          {
            id: "c",
            text: "Customer concentration is too high — the top 10 customers represent 8% of ARR which is a significant risk",
            correct: false,
            explanation: "8% concentration in the top 10 customers is actually low for B2B SaaS. This indicates excellent customer diversification. Concentration risk becomes meaningful when a single customer represents 10%+ of ARR.",
          },
          {
            id: "d",
            text: "The 5.2% gross churn rate is dangerously high and will eventually undermine growth",
            correct: false,
            explanation: "5.2% gross churn in mid-market SaaS is actually below average (mid-market benchmark is typically 7-10%). More importantly, with 118% NRR, gross churn is more than offset by expansion revenue from existing customers.",
          },
        ],
      },
      {
        id: "g6q3",
        stage: "Market Analysis",
        question: "Apex asks: 'How much runway does CloudSuite have?' Analyze the following market data.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "HR SaaS Market Analysis",
          data: `| Segment | Market Size | Growth Rate | CloudSuite Position |
|---|---|---|---|
| Mid-market HR SaaS (US) | $8.2B | 14% CAGR | $185M ARR = 2.3% share |
| Enterprise HR SaaS (US) | $12.4B | 9% CAGR | Not present |
| Mid-market HR SaaS (International) | $6.1B | 18% CAGR | 0% share |
| **Total Addressable Market** | **$26.7B** | **13% CAGR** | **0.7% share** |

Competitive landscape:
| Competitor | Segment | ARR | Growth | Key Strength |
|---|---|---|---|---|
| Workday | Enterprise | $7.2B | 19% | Brand, integration |
| ADP | All segments | $16B | 6% | Legacy, payroll |
| Rippling | SMB/Mid-market | $350M | 85% | All-in-one platform |
| Gusto | SMB | $650M | 42% | Simplicity, SMB focus |
| BambooHR | Mid-market | $180M | 28% | Direct competitor |
| Paycom | Mid-market | $1.7B | 22% | Strong in mid-market |

CloudSuite product differentiation:
- Only mid-market HR suite with native AI performance management
- Best-in-class customer support (NPS: 72 vs industry avg 41)
- Open API architecture vs closed systems of legacy players`,
        },
        options: [
          {
            id: "a",
            text: "CloudSuite has minimal runway — the US mid-market is highly competitive with Rippling, BambooHR, and Paycom as direct threats",
            correct: false,
            explanation: "Despite competition, CloudSuite holds only 2.3% of the US mid-market and 0.7% of total TAM. With $26.7B TAM growing at 13%, the market opportunity is large relative to current share. Competition exists but does not eliminate runway.",
          },
          {
            id: "b",
            text: "CloudSuite has substantial runway: 2.3% US mid-market share in a $8.2B market growing 14%, plus 0% international share in a $6.1B market — total opportunity at current market share is ~10x current ARR with clear geographic expansion path",
            correct: true,
            explanation: "Correct. This is the L.E.K. answer — frame runway in terms of market share headroom and expansion vectors. 2.3% of a growing $8.2B market means CloudSuite could 4x ARR without taking share from anyone — just growing with the market. International represents a completely untapped $6.1B growing at 18% CAGR. The combination creates a compelling runway story for the investment committee.",
          },
          {
            id: "c",
            text: "Workday will inevitably move down-market and disrupt CloudSuite within 3 years",
            correct: false,
            explanation: "This is a risk, not a runway assessment. Enterprise players moving down-market is a common fear but historically rare in execution — enterprise and mid-market require fundamentally different product architecture, pricing, and go-to-market. Workday has tried and mostly failed in mid-market.",
          },
          {
            id: "d",
            text: "The 85% growth of Rippling is the most important competitive data point and should disqualify the investment",
            correct: false,
            explanation: "Rippling's growth is notable but they are primarily SMB-focused. CloudSuite's 118% NRR suggests customers who have tried alternatives prefer CloudSuite's product for the mid-market. High competitor growth does not automatically disqualify an investment.",
          },
        ],
      },
      {
        id: "g6q4",
        stage: "Valuation",
        question: "Is $2.1B (11.4x ARR) a fair price for CloudSuite? Analyze the comparable transaction data.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "SaaS M&A Comparable Transactions (Last 24 Months)",
          data: `| Company | ARR | Growth | NRR | Gross Margin | EV/ARR | Acquirer Type |
|---|---|---|---|---|---|---|
| HRConnect | $140M | 28% | 108% | 70% | 9.2x | Strategic |
| TalentPro | $220M | 31% | 112% | 74% | 11.8x | PE |
| PeopleFirst | $95M | 42% | 121% | 76% | 13.5x | PE |
| BenefitsOS | $175M | 24% | 105% | 68% | 8.4x | Strategic |
| PayrollNow | $310M | 19% | 103% | 71% | 7.1x | Strategic |
| WorkforceIQ | $155M | 38% | 115% | 73% | 12.9x | PE |
| **Median** | | **29.5%** | **110%** | **71.5%** | **10.55x** | |
| **CloudSuite** | **$185M** | **34%** | **118%** | **72%** | **11.4x** | **PE** |`,
        },
        options: [
          {
            id: "a",
            text: "CloudSuite at 11.4x ARR is overpriced — the median is 10.55x so Apex should push back to 10x ($1.85B)",
            correct: false,
            explanation: "Mechanical application of median multiples without quality adjustments is not rigorous valuation. CloudSuite's 118% NRR is above all comparables and justifies a premium. The relevant question is whether the premium is proportionate to the quality differential.",
          },
          {
            id: "b",
            text: "At 11.4x ARR, CloudSuite trades at an 8% premium to the median — this is justified by its above-median NRR (118% vs 110%) and above-median growth (34% vs 29.5%), making the valuation fair to slightly favorable for Apex",
            correct: true,
            explanation: "Correct. L.E.K. would build a regression of EV/ARR against NRR and growth rate across comparables. CloudSuite's combination of 34% growth and 118% NRR positions it at or above the high end of the comparable set (PeopleFirst at 13.5x had 42% growth and 121% NRR). 11.4x for CloudSuite's quality profile is not aggressive — if anything it is modestly favorable to the buyer.",
          },
          {
            id: "c",
            text: "The valuation cannot be assessed without a DCF model",
            correct: false,
            explanation: "Comparable transaction multiples are the primary valuation methodology for M&A, not DCF. DCF is used as a sanity check but the market multiple approach is standard and sufficient for an investment committee assessment.",
          },
          {
            id: "d",
            text: "SaaS valuations have compressed significantly so 11.4x is too high regardless of comparables",
            correct: false,
            explanation: "The comparable transactions provided are from the last 24 months, incorporating the valuation compression environment. These are the relevant comps to use, not peak 2021 multiples.",
          },
        ],
      },
      {
        id: "g6q5",
        stage: "Value Creation Plan",
        question: "Apex's investment committee asks: 'Assuming we buy at $2.1B, how do we generate a 22%+ IRR over 5 years?' Which value creation plan is most credible?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "5-Year Value Creation Scenario Analysis",
          data: `| Scenario | ARR in Year 5 | EBITDA Margin Y5 | Exit Multiple | Enterprise Value | Equity Value (2x leverage) | IRR |
|---|---|---|---|---|---|---|
| Bear: Growth slows to 18%, margins flat | $420M | 8% | 8x ARR | $3.36B | $2.52B | 14% |
| Base: Growth 25%, margins improve to 18% | $565M | 18% | 10x ARR | $5.65B | $4.24B | 24% |
| Bull: Growth 30%, margins 22%, intl expansion | $720M | 22% | 11x ARR | $7.92B | $5.94B | 34% |
| **Investment thesis requires:** | | | | | | **>22% IRR** |

Key assumptions in base case:
- S&M efficiency improvement: CAC reduces from $145K to $95K by Year 3
- Pricing optimization: ACV grows from $100K to $115K by Year 2
- Gross margin expansion: 72% to 76% through infrastructure optimization
- Initial investment in international: $30M in Year 1-2, contributing to bull case`,
        },
        options: [
          {
            id: "a",
            text: "The bull case is the most likely outcome given CloudSuite's strong fundamentals",
            correct: false,
            explanation: "PE investors should never rely on bull cases to justify investments. The investment thesis must work in the base case and ideally also the bear case. Anchoring to the bull case is a red flag in investment committee presentations.",
          },
          {
            id: "b",
            text: "The base case at 24% IRR clears the 22% hurdle rate and is achievable through three specific levers: S&M efficiency (reducing CAC $50K = ~$40M EBITDA improvement), pricing optimization (15% ACV increase = ~$28M ARR), and gross margin improvement (4pp = ~$23M). The bear case at 14% is below the hurdle but is a genuinely low-probability scenario given 118% NRR",
            correct: true,
            explanation: "Correct. L.E.K. would present investment committee with base case as the primary scenario, stress-tested with bear case, with specific operational levers quantified for each assumption. The 118% NRR provides strong downside protection in the bear case — even with growth deceleration, existing customer expansion provides a floor. The three value creation levers are specific, quantified, and operational rather than financial engineering.",
          },
          {
            id: "c",
            text: "Multiple expansion is the primary return driver — if we buy at 11.4x and sell at 11x, the math still works with growth",
            correct: false,
            explanation: "Multiple contraction is a real risk — counting on multiple expansion as a value creation lever is aggressive. Conservative PE analysis assumes flat or contracting multiples and generates returns through operational improvement and growth.",
          },
          {
            id: "d",
            text: "The 2x leverage assumption doubles the IRR so the underlying business return is actually only 12% — this is insufficient",
            correct: false,
            explanation: "Leverage is standard in PE and 2x is conservative. The underlying EBITDA-based return in the base case is still well above cost of capital. Leverage in PE is a return enhancement tool, not financial engineering — the key test is whether operating cash flows cover debt service, which they do in the base case.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 7: ROLAND BERGER — EV MARKET ENTRY
  // ─────────────────────────────────────────────
  {
    id: "g7",
    title: "DriveForward: European EV Market Entry",
    type: "market_entry",
    difficulty: "advanced",
    firm: "rolandberger",
    estimatedMinutes: 30,
    overview: "A Chinese electric vehicle manufacturer wants to enter the European market. Roland Berger has been engaged to assess feasibility and recommend an entry strategy.",
    clientBackground: "DriveForward is a Shenzhen-based EV manufacturer with $8.2B in annual revenue and 340,000 vehicles sold in China in the last fiscal year. They make mid-range EVs (€25,000-€45,000 equivalent) with battery range of 380-520km. Their vehicles have won multiple Chinese quality awards. They have zero European presence, no European dealer network, and no regulatory approvals in Europe. The CEO wants to launch in Europe within 18 months.",
    yourRole: "You are a Roland Berger project leader on the automotive practice, based in Munich. You have 8 weeks to deliver a market entry strategy.",
    finalRecommendationPrompt: "Should DriveForward enter the European EV market, and if so, through which country, which segment, and which entry mode?",
    idealRecommendation: "DriveForward should enter Europe, starting with Germany and Norway as dual entry markets, targeting the value mid-range segment (€30,000-€40,000) where European legacy OEMs are weakest. Recommended entry mode: partnership with a European distributor for Year 1-2, followed by owned dealerships in Year 3+. Key rationale: Norway is the world's most EV-penetrated market (79% EV share), has no import tariffs, and provides a validation market with high-income early adopters. Germany is the strategic long-term prize — largest European car market, strong engineering credentials matter to consumers, and home market of legacy competition. The 18-month timeline is aggressive but achievable for Norway (simpler regulatory path); Germany requires 24+ months for full TÜV certification. Tariff risk (current 17.4% EU tariff on Chinese EVs, potentially rising) is the biggest strategic risk and should be mitigated through exploring local assembly partnerships in Poland or Hungary.",
    keyTakeaways: [
      "Market entry always requires a sequencing decision — you cannot enter all markets simultaneously with finite resources",
      "Regulatory and tariff barriers are often more important than competitive barriers for physical goods",
      "Entry mode (organic, partnership, acquisition) has major implications for speed, cost, and control",
      "Local consumer preferences and trust factors can override pure product/price advantage",
    ],
    questions: [
      {
        id: "g7q1",
        stage: "Market Assessment",
        question: "Which European market should DriveForward prioritize for initial entry? Analyze the data.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "European EV Market Comparison",
          data: `| Country | EV Market Share | Annual EV Sales | Market Growth | Import Tariff | Regulatory Complexity | Consumer China-Brand Sentiment | Average Selling Price |
|---|---|---|---|---|---|---|---|
| Norway | 79% | 132,000 | 8% | 0% (EEA) | Low | Neutral (22% positive) | €42,000 |
| Germany | 18% | 524,000 | 14% | 17.4% | High (TÜV) | Skeptical (14% positive) | €48,000 |
| France | 22% | 298,000 | 19% | 17.4% | Medium | Skeptical (16% positive) | €38,000 |
| Netherlands | 31% | 184,000 | 12% | 17.4% | Medium | Neutral (21% positive) | €45,000 |
| UK | 16% | 315,000 | 22% | 6.7% (post-Brexit) | Medium | Neutral (24% positive) | €44,000 |
| Poland | 4% | 42,000 | 35% | 17.4% | Low | Positive (38% positive) | €29,000 |

Additional context:
- EU currently imposing provisional tariffs of 17.4-38.1% on Chinese EVs pending investigation
- TÜV certification in Germany typically takes 18-24 months
- Norway has no domestic car manufacturer — less political sensitivity
- UK-China trade negotiations ongoing — tariff could change`,
        },
        options: [
          {
            id: "a",
            text: "Germany — it is the largest market and the most important strategic prize for any global automaker",
            correct: false,
            explanation: "Germany is the long-term prize but a terrible first entry market for DriveForward. TÜV certification takes 18-24 months (longer than the CEO's 18-month timeline), tariffs are 17.4%+, and consumer sentiment toward Chinese brands is the most skeptical in Europe at only 14% positive.",
          },
          {
            id: "b",
            text: "Norway first, then Germany — Norway provides a zero-tariff, low-regulatory-complexity, high-EV-penetration validation market; Germany is the strategic long-term target once European credentials are established",
            correct: true,
            explanation: "Correct. Roland Berger would recommend a two-speed market entry: Norway as a beachhead (zero tariffs, fastest regulatory path, 79% EV market, neutral brand sentiment) and Germany as the medium-term strategic target. Norway provides European market validation, reviews, and references that help overcome German consumer skepticism. This sequencing balances speed-to-market (CEO's 18-month timeline) with strategic ambition.",
          },
          {
            id: "c",
            text: "Poland — it has the most positive consumer sentiment toward Chinese brands and fastest market growth",
            correct: false,
            explanation: "Poland's positive sentiment and 35% growth are attractive but the market is tiny (42,000 annual EV sales) and average selling price ($29,000) is below DriveForward's target range. Poland is a secondary market at best.",
          },
          {
            id: "d",
            text: "UK — it has the lowest tariff outside Norway and 22% market growth",
            correct: false,
            explanation: "UK is interesting (6.7% tariff) but ongoing trade negotiations create tariff uncertainty, and with no domestic car industry still present as a political factor, the market dynamics are complex. UK should be in the expansion plan but not the first entry.",
          },
        ],
      },
      {
        id: "g7q2",
        stage: "Tariff Risk Assessment",
        question: "The EU has imposed provisional 17.4% tariffs on Chinese EVs. How does this affect DriveForward's European strategy?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Tariff Impact Analysis on DriveForward Economics",
          data: `| Scenario | Tariff Rate | DriveForward Cost Base | Required Retail Price (20% margin) | Price vs European Competitors | Volume Impact |
|---|---|---|---|---|---|
| No tariff | 0% | €24,000 | €28,800 | -25% vs avg €38,500 | High advantage |
| Current tariff (17.4%) | 17.4% | €28,176 | €33,811 | -12% vs avg €38,500 | Moderate advantage |
| Escalated tariff (38.1% max) | 38.1% | €33,125 | €39,750 | +3% vs avg €38,500 | Disadvantage |
| Local assembly (Poland) | ~4% (components) | €26,400 | €31,680 | -18% vs avg €38,500 | Strong advantage |

Key context:
- BYD announced Polish assembly plant in 2024 (operational 2026)
- CATL (DriveForward's battery supplier) has Hungary factory operational
- EU "minimum import price" mechanism under discussion
- Norwegian market exempt from EU tariff regime (EEA agreement)`,
        },
        options: [
          {
            id: "a",
            text: "The tariff risk is too high — DriveForward should abandon European expansion plans",
            correct: false,
            explanation: "Even at 38.1% tariff, DriveForward is near price parity with European competitors. And the tariff environment may improve, especially if DriveForward establishes European assembly. Abandoning a $500B+ market opportunity due to tariff uncertainty would be excessive.",
          },
          {
            id: "b",
            text: "DriveForward should pursue a two-track strategy: enter Norway immediately (tariff exempt) while establishing a European assembly partnership in Poland or Hungary to mitigate tariff risk for the broader EU market — this reduces tariff exposure from 17.4% to ~4% and improves price competitiveness by €2,000+",
            correct: true,
            explanation: "Correct. This is the Roland Berger answer — pragmatic, specific, and addresses both the immediate market opportunity and the structural risk. Norway as tariff-free beachhead buys time. European assembly (following BYD's playbook in Poland) reduces tariff exposure and provides a 'Made in Europe' narrative that helps with consumer sentiment and regulatory positioning. The math: local assembly at 4% vs 17.4% tariff saves €3,300 per vehicle — on 50,000 vehicles that is €165M annually.",
          },
          {
            id: "c",
            text: "Lobby the EU to reduce tariffs on Chinese EVs as part of a broader trade negotiation",
            correct: false,
            explanation: "A single company lobbying to change EU trade policy is not a credible strategic recommendation. This is outside DriveForward's control and a multi-year process at best.",
          },
          {
            id: "d",
            text: "Raise prices to absorb the tariff while maintaining margins",
            correct: false,
            explanation: "At 38.1% tariff, raising prices to maintain margins would make DriveForward uncompetitive vs European and Korean alternatives. Price is a core part of DriveForward's value proposition in the mid-range segment.",
          },
        ],
      },
      {
        id: "g7q3",
        stage: "Entry Mode",
        question: "DriveForward must decide how to go to market in Europe. Which entry mode is most appropriate for the initial 2-3 year phase?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Acquire a European auto dealer group to get immediate distribution scale",
            correct: false,
            explanation: "Acquiring a dealer group would be expensive (€500M+), slow (12-18 month M&A process), and operationally complex. Dealers operate on thin margins and acquiring one doesn't give you brand building capabilities. This is the wrong entry mode for a brand with zero European presence.",
          },
          {
            id: "b",
            text: "Direct-to-consumer online sales model (following Tesla's playbook) with company-owned showrooms in major cities",
            correct: false,
            explanation: "D2C works when you have Tesla-level brand recognition. DriveForward has zero European brand awareness. Without an existing fan base, D2C requires massive marketing investment and leaves customers without trusted local advisors during the purchase decision — especially problematic for a Chinese brand facing consumer skepticism.",
          },
          {
            id: "c",
            text: "Partnership with an established European automotive distributor for Year 1-2 to leverage existing customer relationships and service infrastructure, while building brand awareness — then transition to owned retail in Year 3+ as brand equity develops",
            correct: true,
            explanation: "Correct. Roland Berger would recommend a phased entry mode strategy. In Year 1-2, partnering with an established distributor (e.g., Emil Frey Group in Switzerland, which already distributes Chinese brands) provides immediate distribution infrastructure, local market knowledge, and customer trust transfer. This limits upfront capital commitment while building brand awareness. In Year 3+, as brand equity develops, DriveForward can negotiate to take distribution in-house in priority markets — following the path of Toyota and Hyundai entering Europe decades ago.",
          },
          {
            id: "d",
            text: "Joint venture with a European OEM to co-develop and sell a co-branded vehicle",
            correct: false,
            explanation: "A JV for market entry is a long-term structural commitment that could limit strategic flexibility. European OEMs are also competitors — sharing technology and market access with a competitor is strategically risky. JVs work in markets with regulatory JV requirements (like China historically) but are not necessary in Europe.",
          },
        ],
      },
      {
        id: "g7q4",
        stage: "Consumer Trust",
        question: "Consumer research shows only 14-22% of European consumers have positive sentiment toward Chinese auto brands. How should DriveForward address this?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "European Consumer Barriers to Chinese EV Adoption",
          data: `| Barrier | % Citing as Major Concern | Addressability | Benchmark (Korean brands in 2005) |
|---|---|---|---|
| Quality/reliability uncertainty | 68% | High (with time + warranty) | 71% — resolved over 5-7 years |
| Software/data security concerns | 54% | Medium (requires policy response) | N/A |
| After-sales service availability | 71% | High (dealer network) | 78% — resolved within 3 years |
| Resale value uncertainty | 62% | Medium (market develops over time) | 65% — resolved within 4 years |
| Brand unfamiliarity | 45% | High (marketing + exposure) | 82% — resolved within 5 years |
| Charging network compatibility | 38% | High (OCPP standards) | N/A |

Historical precedent:
- Hyundai entered Europe in 1995 with similar skepticism — now 4th largest brand in Europe
- Kia entered Europe in 1991 — now top 5 in multiple markets
- Key Hyundai/Kia strategy: exceptional warranty (5-7 years vs industry 2-3 years), aggressive pricing, motorsport sponsorship`,
        },
        options: [
          {
            id: "a",
            text: "Launch a major advertising campaign positioning DriveForward as a premium brand to overcome the negative stereotypes about Chinese manufacturing",
            correct: false,
            explanation: "Advertising alone cannot overcome quality concerns — consumers trust experience over claims. Positioning as premium without earned premium credentials would be seen as inauthentic and potentially backfire.",
          },
          {
            id: "b",
            text: "Mirror the Hyundai/Kia playbook: offer a 7-year comprehensive warranty (vs European industry standard of 3 years), aggressive pricing 15-20% below European equivalents, and build service network ahead of sales volumes — address the highest-barrier concerns (after-sales service at 71%, quality at 68%) directly",
            correct: true,
            explanation: "Correct. Roland Berger would reference the Korean automaker precedent explicitly. The Hyundai/Kia strategy is the most directly applicable historical case study. A 7-year warranty directly addresses quality uncertainty (the company bears the risk, not the customer). Pricing 15-20% below equivalents compensates early adopters for perceived risk. Pre-building service centers addresses the 71% after-sales concern before it becomes an experience problem. This is a concrete, actionable, precedent-backed strategy.",
          },
          {
            id: "c",
            text: "Partner with a well-known European celebrity or sports team for brand endorsement",
            correct: false,
            explanation: "Celebrity endorsement addresses brand familiarity (45% concern) but does nothing for the more fundamental concerns about quality (68%) and after-sales service (71%). It is a tactic, not a strategy.",
          },
          {
            id: "d",
            text: "Focus only on early adopters who are less biased — they will become brand ambassadors",
            correct: false,
            explanation: "Early adopters are important but represent a small fraction of the market. A strategy that only addresses 5-10% of the potential market is not sufficient for the scale of European expansion DriveForward is targeting.",
          },
        ],
      },
      {
        id: "g7q5",
        stage: "Financial Feasibility",
        question: "The CFO wants to know: what investment is required to launch in Norway and Germany, and what is the breakeven timeline?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "European Launch Investment Requirements",
          data: `| Investment Category | Norway (Year 1) | Germany (Year 1-2) | Notes |
|---|---|---|---|
| TÜV/regulatory certification | €2M | €18M | Germany requires full TÜV + UNECE compliance |
| Distributor partnership setup | €5M | €15M | Up-front costs, minimum inventory commitments |
| Marketing & brand building | €8M | €45M | Heavy Year 1, declining Year 2+ |
| Service center network (pre-launch) | €3M | €22M | Minimum viable network |
| Working capital (inventory) | €12M | €65M | 90-day inventory coverage |
| Contingency (10%) | €3M | €16.5M | |
| **Total Year 1 Investment** | **€33M** | **€181.5M** | |
| **Total 2-Year Investment** | **€45M** | **€285M** | |

Revenue and unit economics:
- Norway: Target 5,000 vehicles Year 1, 9,000 Year 2 | Average price €36,000 | Gross margin 18%
- Germany: Target 0 vehicles Year 1 (certification), 8,000 Year 2 | Average price €41,000 | Gross margin 16% (tariff impact)
- Breakeven: Fixed cost base (marketing + service network) of €35M/year in Germany`,
        },
        options: [
          {
            id: "a",
            text: "The investment is too high — DriveForward should start with just Norway to limit risk",
            correct: false,
            explanation: "Norway-only at €45M over 2 years is achievable but strategically limiting. Norway is a validation market, not a scale market. Germany is where the volume and brand-building happen. A Norway-only strategy delays the strategic objective by 3-4 years.",
          },
          {
            id: "b",
            text: "Total 2-year investment of €330M (Norway + Germany) is justified: Norway generates €291M in gross revenue over 2 years (14,000 vehicles x €36K x 58% gross/net), covering its own €45M cost; Germany's €285M investment targets €328M gross revenue in Year 2 alone, reaching breakeven in Year 3",
            correct: true,
            explanation: "Correct. The financial analysis shows Norway is essentially self-funding within the 2-year window. Germany requires €285M upfront but the revenue ramp (8,000 vehicles in Year 2 at €41,000 = €328M revenue) covers the fixed cost base of €35M/year. The combined €330M investment for a market opportunity worth €500B is well within DriveForward's means (€8.2B revenue, likely €500M+ operating cash flow). Year 3 German breakeven is achievable.",
          },
          {
            id: "c",
            text: "DriveForward should abandon Germany and focus all resources on multiple smaller markets like Norway, Netherlands, and Portugal",
            correct: false,
            explanation: "Spreading resources across multiple small markets simultaneously dilutes marketing impact, service network density, and management attention. Market entry requires concentration. Germany is non-negotiable as the European auto market anchor.",
          },
          {
            id: "d",
            text: "The €18M TÜV certification cost for Germany is too high and should be negotiated down",
            correct: false,
            explanation: "TÜV certification is a fixed regulatory cost, not a negotiable fee. €18M is the standard cost for full European type approval for a new manufacturer. This is a cost of market entry, not a cost to be optimized.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 8: KPMG — RETAIL BANK PROFITABILITY
  // ─────────────────────────────────────────────
  {
    id: "g8",
    title: "FirstBank Branch Profitability Crisis",
    type: "profitability",
    difficulty: "intermediate",
    firm: "kpmg",
    estimatedMinutes: 25,
    overview: "A regional US bank has seen branch profitability decline significantly as digital banking grows. KPMG has been engaged to determine which branches to keep, close, or transform.",
    clientBackground: "FirstBank operates 280 branches across 4 states (Ohio, Indiana, Kentucky, Tennessee). Total assets: $42B. Net interest margin: 2.8% (below the 3.1% industry average). The bank has 2,100 branch employees and 340 corporate staff. Digital banking adoption has grown from 34% to 67% of transactions over 5 years. The CEO is facing pressure from activist investors to improve ROE from 7.2% to 10%+.",
    yourRole: "You are a KPMG director on the financial services practice. You are leading a 6-person team and have 10 weeks to deliver a branch optimization strategy.",
    finalRecommendationPrompt: "How many branches should FirstBank close, which should be transformed, and what is the expected financial impact on ROE?",
    idealRecommendation: "FirstBank should close 85 branches (30%), transform 110 branches into digital-advisory hybrid formats, and maintain 85 traditional branches in high-traffic/complex-need markets. Financial impact: branch closures save $68M annually (85 x $800K average cost), hybrid transformations save additional $45M while preserving 85% of revenue, investment of $55M in digital and hybrid infrastructure — net annual improvement of $58M pre-tax, improving ROE from 7.2% to approximately 9.4%. To reach 10% ROE, FirstBank must also address the net interest margin gap (currently 2.8% vs 3.1% benchmark) through asset mix optimization.",
    keyTakeaways: [
      "Branch optimization is a portfolio decision — different branches have different economics and serve different customer needs",
      "Customer behavior data (transaction type, frequency, digital adoption) is the key input to branch transformation decisions",
      "Closing branches has both cost savings and revenue risk — always model the revenue retention assumption carefully",
      "Regulatory and community reinvestment obligations (CRA) constrain how aggressively banks can close branches in underserved communities",
    ],
    questions: [
      {
        id: "g8q1",
        stage: "Framework",
        question: "How would you structure the decision of which branches to close, transform, or keep?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Close all branches with below-average profitability",
            correct: false,
            explanation: "Simple profitability ranking ignores strategic value (anchor branches that drive deposits to the whole network), customer needs (some unprofitable branches serve important demographics), and regulatory constraints (CRA obligations in underserved areas).",
          },
          {
            id: "b",
            text: "Use a two-dimension framework: (1) Customer need for physical banking (high/low) x (2) Branch economics (attractive/unattractive) — creating four quadrants: Keep (high need, good economics), Transform (high need, poor economics), Close (low need, poor economics), Monitor (low need, good economics)",
            correct: true,
            explanation: "Correct. This 2x2 framework is the KPMG standard approach for branch optimization. It separates the customer value question from the economic question — you need both to make the right decision. A branch with poor economics but high customer need should be transformed, not closed. A branch with good economics but low need should be monitored for future closure as digital adoption continues to grow.",
          },
          {
            id: "c",
            text: "Survey customers to ask whether they want branches to stay open",
            correct: false,
            explanation: "Customer surveys have well-documented bias — people say they want to keep branches even if they never use them. Revealed preference (actual transaction data) is far more reliable than stated preference.",
          },
          {
            id: "d",
            text: "Hire a real estate firm to assess which branch properties have the highest alternative use value",
            correct: false,
            explanation: "Real estate value is one input to the closure decision but not the primary framework. Most bank branches are leased, not owned, so alternative use value is often irrelevant.",
          },
        ],
      },
      {
        id: "g8q2",
        stage: "Data Analysis",
        question: "KPMG's team has segmented FirstBank's 280 branches into four categories. How many branches fall into each quadrant and what is the recommended action?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "FirstBank Branch Portfolio Analysis",
          data: `| Quadrant | # Branches | Avg Annual P&L | Avg Transactions/Day | Digital Adoption | Customer NPS | CRA Designated |
|---|---|---|---|---|---|---|
| High need / Good economics | 85 | +$420K | 185 | 45% | 68 | 12% |
| High need / Poor economics | 110 | -$180K | 142 | 52% | 71 | 34% |
| Low need / Good economics | 42 | +$210K | 78 | 81% | 52 | 4% |
| Low need / Poor economics | 43 | -$340K | 45 | 88% | 41 | 3% |
| **Total/Average** | **280** | **+$28K avg** | **113** | **67%** | **58** | **17%** |

Branch cost structure (average):
- Staff costs: $620K (78% of total branch cost)
- Occupancy: $145K (18%)  
- Technology & other: $35K (4%)
- Total branch cost: $800K/year

Revenue per branch (average): $828K/year
Contribution margin: $28K/year (very thin)`,
        },
        options: [
          {
            id: "a",
            text: "Close all 43 low need / poor economics branches immediately and all 42 low need / good economics branches within 2 years — total 85 closures",
            correct: false,
            explanation: "Closing the 42 low need / good economics branches immediately is premature — they are profitable (+$210K average). These should be monitored as digital adoption grows but closed prematurely surrenders $8.8M in annual profit.",
          },
          {
            id: "b",
            text: "Close 43 low need / poor economics branches (clear candidates), transform 110 high need / poor economics branches into digital-advisory hybrids, keep 85 high need / good economics branches, and monitor 42 low need / good economics for future closure",
            correct: true,
            explanation: "Correct. This is the KPMG recommendation that follows the 2x2 framework precisely. The 43 low need / poor economics branches have no strategic value and negative economics — close immediately. The 110 high need / poor economics branches serve customers who need physical banking but are economically inefficient — transform to lower-cost hybrid format. The 85 high need / good economics branches are the core network — maintain. The 42 low need / good economics branches are cash cows with declining futures — monitor and close as digital adoption continues.",
          },
          {
            id: "c",
            text: "Close all 153 branches with below-average economics (poor economics quadrants) to maximize cost savings",
            correct: false,
            explanation: "Closing 110 high need / poor economics branches without transformation would eliminate branches that serve important customer segments, including 34% with CRA obligations. This would trigger regulatory issues and significant customer attrition.",
          },
          {
            id: "d",
            text: "Keep all 280 branches but reduce staff levels across the board to improve economics",
            correct: false,
            explanation: "Indiscriminate staffing cuts across all branches would harm service quality at high-performing locations while failing to address the fundamental issue of branches with structurally low transaction volumes.",
          },
        ],
      },
      {
        id: "g8q3",
        stage: "Revenue Risk",
        question: "The CFO is worried that closing 43 branches will cause significant customer attrition. How do you assess revenue at risk from the closures?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Customer Attrition Analysis — Branch Closure Scenarios",
          data: `| Customer Segment | % of Deposits at Closing Branches | Historical Attrition Rate (Past Closures) | Revenue at Risk |
|---|---|---|---|
| Digital-first customers (88% digital) | 45% | 3% | Low |
| Hybrid customers (50-88% digital) | 32% | 12% | Medium |
| Branch-dependent (< 50% digital) | 23% | 34% | High |
| **Total** | **100%** | **Blended ~14%** | |

Mitigation factors:
- Average distance to next nearest FirstBank branch: 2.1 miles (for closing branch customers)
- Competitor branch density in closing markets: 3.2 branches/mile radius
- Historical attrition when closing branch within 2 miles of another FirstBank branch: 6%
- Historical attrition when no FirstBank branch within 3 miles: 28%

Revenue per closing branch: $680K average
Total annual revenue at 43 branches: $29.2M`,
        },
        options: [
          {
            id: "a",
            text: "Revenue at risk is 14% of $29.2M = $4.1M — this is acceptable given $34.4M in cost savings from closing 43 branches",
            correct: false,
            explanation: "The 14% blended attrition rate applies to deposits, not directly to revenue. Also, 14% is the overall rate — you need to weight by the actual customer mix at the specific closing branches and the proximity of the nearest FirstBank branch.",
          },
          {
            id: "b",
            text: "Revenue at risk should be modeled branch-by-branch based on customer mix and nearest FirstBank distance — branches within 2 miles of another FirstBank location have only 6% attrition; branches in isolated markets have 28% attrition. Weighted average for the 43 closures is likely 8-10%, representing $2.3-2.9M revenue loss against $34.4M in cost savings — a net $31-32M improvement",
            correct: true,
            explanation: "Correct. KPMG would insist on branch-level attrition modeling rather than applying a blended rate. The proximity data is the key variable — 6% attrition when a nearby branch exists vs 28% when isolated. For the specific 43 low need / poor economics branches (which by definition have low transaction volumes and high digital adoption at 88%), the customer mix skews heavily toward digital-first customers with low attrition risk. The $31-32M net improvement calculation is the number the CFO needs.",
          },
          {
            id: "c",
            text: "Revenue at risk is too uncertain to model — FirstBank should conduct customer surveys before deciding",
            correct: false,
            explanation: "You have historical attrition data from past closures which is far more reliable than surveys. 'Too uncertain to model' is not acceptable — make assumptions explicit and model the range.",
          },
          {
            id: "d",
            text: "All revenue at risk is recoverable through digital channel migration programs",
            correct: false,
            explanation: "Digital migration programs help but do not eliminate attrition. The branch-dependent segment (34% historical attrition) will not be fully converted to digital. Assuming 100% revenue retention is not credible.",
          },
        ],
      },
      {
        id: "g8q4",
        stage: "Hybrid Branch Model",
        question: "What should the 110 high-need / poor-economics branches be transformed into, and what is the expected economic improvement?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Branch Transformation Model Comparison",
          data: `| Model | Staff per Branch | Cost per Branch | Transaction Capacity | Revenue Retention | NPS Impact |
|---|---|---|---|---|---|
| Current full-service | 7.8 FTE | $800K | Full | Baseline | Baseline |
| Digital-advisory hub | 3.2 FTE | $420K | Digital kiosks for transactions | 92% | +8 pts |
| Micro-branch | 2.1 FTE | $285K | Self-service only + video teller | 78% | -12 pts |
| Mobile banker (no branch) | 0 FTE in office | $85K | Field-based only | 61% | -28 pts |
| ATM-only | 0 FTE | $45K | ATM only | 42% | -45 pts |

Digital-advisory hub specifics:
- 2 relationship managers (focus on mortgages, investments, business banking)
- 1 digital banking ambassador (helps customers migrate to app)
- Self-service kiosks for routine transactions (deposits, withdrawals, account opening)
- Video teller for complex transactions
- Investment: $180K per branch conversion (technology + redesign)
- Implementation timeline: 60 days per branch`,
        },
        options: [
          {
            id: "a",
            text: "Micro-branch model — it saves the most cost at $285K vs $800K",
            correct: false,
            explanation: "Micro-branch saves $515K per branch but has 78% revenue retention and -12 NPS impact. Digital-advisory hub saves $380K per branch with 92% revenue retention and +8 NPS. The digital-advisory hub is superior on both revenue protection and customer experience.",
          },
          {
            id: "b",
            text: "Digital-advisory hub transformation: saves $380K per branch x 110 branches = $41.8M annually, with 92% revenue retention protecting $57.4M of $62.4M in branch revenue, requiring $19.8M upfront investment — net annual improvement of $36M after accounting for revenue at risk",
            correct: true,
            explanation: "Correct. The digital-advisory hub optimizes the economics-vs-revenue-retention tradeoff. At $380K annual savings with 92% revenue retention, it is clearly superior to the micro-branch model. The math: $380K savings x 110 = $41.8M savings. Revenue at risk: 8% of $62.4M = $5M. Net: $36.8M improvement. Upfront investment: $180K x 110 = $19.8M, payback under 7 months. This is the KPMG recommendation.",
          },
          {
            id: "c",
            text: "ATM-only conversion would maximize cost savings at $755K per branch = $83M total",
            correct: false,
            explanation: "ATM-only retains only 42% of revenue. Revenue loss: 58% x $62.4M = $36.2M. Net of $83M savings minus $36.2M revenue loss = $46.8M, barely better than the digital hub despite the devastating NPS impact of -45 points. The math does not justify the customer experience destruction.",
          },
          {
            id: "d",
            text: "Keep all 110 as full-service branches and find other cost savings",
            correct: false,
            explanation: "Keeping 110 loss-making branches (average -$180K each = -$19.8M total) when a transformation path exists that preserves 92% of revenue is not defensible to activist investors.",
          },
        ],
      },
      {
        id: "g8q5",
        stage: "ROE Impact",
        question: "The CEO asks: 'Will this plan get us to 10% ROE?' Walk him through the math.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "FirstBank ROE Bridge Analysis",
          data: `| Item | Annual P&L Impact | Notes |
|---|---|---|
| Starting point: Current ROE | 7.2% | Net income $302M on $4.2B equity |
| Branch closures (43 branches) | +$31M pre-tax | $34.4M savings - $3.4M revenue loss |
| Digital-advisory transformations (110 branches) | +$36M pre-tax | $41.8M savings - $5M revenue loss - $0.8M incremental costs |
| Upfront investments | -$20M (Year 1 only) | Transformation capex amortized |
| **Total branch optimization benefit** | **+$67M pre-tax (+$50M after tax)** | |
| **Pro-forma net income** | **$352M** | |
| **Pro-forma ROE** | **8.4%** | $352M / $4.2B equity |
| **Gap to 10% target** | **1.6pp = $67M net income** | Requires additional initiatives |

Additional levers to close the gap:
| Initiative | Est. Annual Benefit | Timeline |
|---|---|---|
| Net interest margin improvement (2.8% → 3.0%) | +$84M pre-tax | 18-24 months |
| Fee income growth (digital banking, advisory) | +$35M pre-tax | 12-18 months |
| Corporate overhead reduction | +$22M pre-tax | 6-12 months |`,
        },
        options: [
          {
            id: "a",
            text: "Yes — the branch optimization plan achieves 10% ROE",
            correct: false,
            explanation: "The branch optimization plan improves ROE from 7.2% to 8.4% — a meaningful improvement but short of the 10% target by 1.6 percentage points. Telling the CEO the plan achieves 10% when the numbers show 8.4% is a credibility failure.",
          },
          {
            id: "b",
            text: "The branch optimization plan improves ROE from 7.2% to 8.4% — a significant improvement but 1.6pp short of the 10% target. Closing the remaining gap requires additional initiatives beyond branches: NIM improvement to 3.0% (worth +84M pre-tax), fee income growth ($35M), and overhead reduction ($22M). The full program of branch optimization + these three levers could reach 10%+ ROE within 24 months",
            correct: true,
            explanation: "Correct. KPMG would never overstate the impact of one workstream. The honest answer: branch optimization is necessary but not sufficient for 10% ROE. The additional levers are quantified, sequenced, and realistic. NIM improvement is the largest lever and most important for bank profitability — it requires asset-liability management optimization and pricing discipline. This comprehensive answer demonstrates both analytical rigor and the strategic breadth to see beyond the immediate workstream.",
          },
          {
            id: "c",
            text: "The 10% ROE target is unrealistic for a regional bank and the CEO should lower expectations",
            correct: false,
            explanation: "The 10% target is not unrealistic — regional bank peers achieve 10%+ ROE. Telling a CEO their target is unrealistic without exhausting all improvement levers is defeatist and not how KPMG consultants operate.",
          },
          {
            id: "d",
            text: "We need to model additional branch closures beyond the 43 recommended to bridge the gap",
            correct: false,
            explanation: "Closing more branches beyond the logical closure candidates (low need / poor economics) would require closing branches with strategic value, creating customer attrition and regulatory risk that would likely reduce rather than improve ROE.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 9: MONITOR DELOITTE — STREAMING GROWTH
  // ─────────────────────────────────────────────
  {
    id: "g9",
    title: "StreamMax: Breaking the Subscriber Plateau",
    type: "profitability",
    difficulty: "intermediate",
    firm: "monitor_deloitte",
    estimatedMinutes: 28,
    overview: "A streaming platform has plateaued at 85 million subscribers and is losing ground to competitors. Monitor Deloitte has been engaged to develop a growth strategy.",
    clientBackground: "StreamMax is a US-based streaming service launched in 2016 with 85M subscribers globally (62M US, 23M international). Annual revenue: $12.4B. Content spend: $8.2B. EBITDA margin: 12%. They compete with Netflix (238M subs), Disney+ (150M subs), and HBO Max (95M subs). Subscriber growth has stalled — net adds were -2M last quarter. Churn has increased from 2.1% to 3.4% monthly over the past 18 months.",
    yourRole: "You are a Monitor Deloitte engagement manager on the media and entertainment practice. You are presenting preliminary findings to StreamMax's Chief Growth Officer after 3 weeks of analysis.",
    finalRecommendationPrompt: "What is StreamMax's path to 120M subscribers within 3 years, and what are the 3 most important strategic moves?",
    idealRecommendation: "StreamMax can reach 120M subscribers through three moves: (1) Launch an ad-supported tier at $4.99/month — research shows 28M churned/lapsed users cite price as primary reason, a lower tier could re-acquire 8-12M at higher margin than expected due to ad revenue; (2) International expansion into India and Brazil with localized content — these two markets alone represent 40M+ addressable subscribers at $3-4/month pricing; (3) Content strategy pivot toward unscripted and sports — Netflix dominates scripted drama, StreamMax's highest-retention content is unscripted reality and sports adjacents which cost 60% less to produce per hour of viewing. Together these three moves could add 35-40M subscribers at lower incremental content cost than scripted expansion.",
    keyTakeaways: [
      "In subscriber businesses, churn is as important as acquisition — a 1pp reduction in monthly churn is worth more than a 10% increase in new subscriber acquisition",
      "Ad-supported tiers are a proven mechanism to expand total addressable market without cannibalizing premium subscribers",
      "Content ROI varies dramatically by genre — unscripted content often delivers better subscriber retention per dollar than prestige scripted drama",
      "International expansion in streaming requires genuine localization investment, not just dubbed content",
    ],
    questions: [
      {
        id: "g9q1",
        stage: "Churn Diagnosis",
        question: "StreamMax's churn has increased from 2.1% to 3.4% monthly. Before developing growth strategy, you need to understand why. What does the following data reveal?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "StreamMax Churn Analysis",
          data: `| Churn Reason (Exit Survey, n=24,000) | % Citing | Change vs 18 Months Ago |
|---|---|---|
| Price too high | 34% | +18pp |
| Not enough content I want to watch | 28% | +11pp |
| Switching to competitor | 22% | +8pp |
| Sharing password with family/friends | 9% | -4pp |
| Technical issues | 4% | -1pp |
| Other | 3% | -32pp |

Content consumption data:
| Genre | % of Viewing Hours | Retention Rate (viewers of this genre) | Content Cost/Hour |
|---|---|---|---|
| Original drama | 42% | 68% | $8.2M/hour |
| Licensed content | 28% | 54% | $1.1M/hour |
| Original reality/unscripted | 18% | 81% | $1.8M/hour |
| Sports adjacent | 8% | 84% | $2.4M/hour |
| International content | 4% | 77% | $0.9M/hour |

Competitor pricing:
- Netflix: $6.99 (ad), $15.49 (standard), $22.99 (premium)
- Disney+: $7.99 (ad), $13.99 (premium)
- HBO Max: $9.99 (ad), $15.99 (standard)
- StreamMax: $14.99 (standard only — no ad tier)`,
        },
        options: [
          {
            id: "a",
            text: "Switching to competitors is the primary churn driver and StreamMax should focus on competitive positioning",
            correct: false,
            explanation: "Switching to competitors is cited by 22% — significant but not primary. Price (34%) and content gaps (28%) are larger. More importantly, the 22% who are switching may be doing so because of price or content, not brand loyalty — treating 'switching' as a root cause misses the underlying drivers.",
          },
          {
            id: "b",
            text: "Price sensitivity (+18pp) and content gaps (+11pp) are the primary churn drivers — and the content data reveals a strategic insight: unscripted/sports content has the highest retention rates (81-84%) at the lowest cost per hour, while original drama has the lowest retention (68%) at the highest cost ($8.2M/hour)",
            correct: true,
            explanation: "Correct. Monitor Deloitte would identify both the churn driver and the content strategy insight in one synthesis. The content ROI analysis is particularly powerful: streaming strategy has been dominated by the 'prestige drama' race, but StreamMax's own data shows unscripted content retains subscribers better at 60% lower cost. This challenges the received wisdom and is exactly the type of insight that differentiates Monitor Deloitte.",
          },
          {
            id: "c",
            text: "Password sharing is the real problem and StreamMax should implement password sharing restrictions like Netflix",
            correct: false,
            explanation: "Password sharing has actually decreased as a churn reason (-4pp). Netflix's password sharing crackdown was unique to their scale and brand loyalty. StreamMax implementing the same policy from a weaker competitive position would likely accelerate churn.",
          },
          {
            id: "d",
            text: "StreamMax needs to spend more on original drama to compete with Netflix's content library",
            correct: false,
            explanation: "The content data directly contradicts this conclusion. Original drama has the lowest retention rate (68%) at the highest cost ($8.2M/hour). More drama spending without addressing price and improving content mix would worsen the economics.",
          },
        ],
      },
      {
        id: "g9q2",
        stage: "Ad-Supported Tier Analysis",
        question: "StreamMax is considering launching an ad-supported tier at $4.99/month. How should they evaluate this decision?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Ad-Supported Tier Economics Model",
          data: `| Metric | Ad-Supported Tier ($4.99) | Standard Tier ($14.99) | Notes |
|---|---|---|---|
| Subscription revenue per user/month | $4.99 | $14.99 | |
| Ad revenue per user/month (est.) | $4.50 | $0 | Based on 4 hrs/day viewing, $8 CPM |
| Total revenue per user/month | $9.49 | $14.99 | |
| Content cost allocation per user/month | $8.20 | $8.20 | Same content library |
| Gross profit per user/month | $1.29 | $6.79 | |
| Gross margin | 14% | 45% | |

Cannibalization research (n=3,200 current subscribers):
- % who would downgrade to ad tier if launched: 18%
- % who would cancel rather than see ads: 4%
- % who would stay on standard tier: 78%

New subscriber potential:
- Lapsed subscribers citing price as reason: 28M
- Re-acquisition rate at $4.99: estimated 15-25%
- New subscriber acquisition lift: estimated 8-12%`,
        },
        options: [
          {
            id: "a",
            text: "Don't launch the ad tier — it has 14% gross margin vs 45% for the standard tier, destroying value",
            correct: false,
            explanation: "This ignores the new subscriber acquisition opportunity. The 14% margin is on incremental users who would not otherwise subscribe. The relevant comparison is not 14% vs 45% but rather 14% margin on new revenue vs 0% on users who are currently churned. Also, 18% cannibalization from existing subscribers is the real risk to model.",
          },
          {
            id: "b",
            text: "Launch the ad tier: net financial impact is positive. Cannibalization cost: 18% x 85M subscribers x ($14.99-$9.49) x 12 = -$1.0B annually. New subscriber acquisition: 28M lapsed at 20% re-acquisition = 5.6M new subscribers at $9.49/month = +$637M annually. Net: approximately -$363M annually, but this is offset by reduced churn and platform scale benefits for ad revenue growth",
            correct: false,
            explanation: "The math is on the right track but the conclusion is wrong to recommend it based on a net negative. The correct Monitor Deloitte answer would model the churn reduction benefit (reducing 3.4% monthly churn even 0.5pp is worth ~$430M annually in retained revenue) and the long-term ad revenue scaling potential before concluding.",
          },
          {
            id: "c",
            text: "Launch the ad tier with careful pricing and positioning: the $9.49 blended revenue is only 37% below standard tier (not 67% below as subscription price implies), churn reduction and new acquisition economics are positive when modeled over 24 months, and every major competitor already offers this tier — StreamMax is at a structural disadvantage without it",
            correct: true,
            explanation: "Correct. Monitor Deloitte's recommendation would combine the financial analysis (ad revenue narrows the gap), competitive analysis (StreamMax is the only major player without an ad tier), and behavioral economics (price-sensitive churn is destroying $1B+ in annual revenue). The launch recommendation is the right conclusion — the question is how to price, position, and manage the transition.",
          },
          {
            id: "d",
            text: "Raise the standard tier price to $17.99 instead of launching an ad tier",
            correct: false,
            explanation: "Price increase when price sensitivity is the #1 churn driver (+18pp) and when all competitors are at lower price points would accelerate the subscriber decline. This is the opposite of what the data supports.",
          },
        ],
      },
      {
        id: "g9q3",
        stage: "International Growth",
        question: "StreamMax has only 23M international subscribers despite a $12.4B content library. Where should they focus international expansion?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "International Streaming Market Opportunity",
          data: `| Market | Total Population | Smartphone Users | Current Streaming Penetration | StreamMax Share | Netflix Share | Willingness to Pay | Growth Rate |
|---|---|---|---|---|---|---|---|
| India | 1.4B | 750M | 18% | 1% | 8% | $3-5/month | 28% |
| Brazil | 215M | 155M | 34% | 4% | 22% | $6-9/month | 22% |
| Mexico | 130M | 95M | 29% | 6% | 28% | $6-8/month | 18% |
| Indonesia | 277M | 175M | 14% | 0% | 5% | $2-4/month | 35% |
| Germany | 84M | 72M | 61% | 12% | 31% | $12-15/month | 8% |
| France | 68M | 58M | 58% | 15% | 29% | $11-14/month | 7% |
| Japan | 125M | 105M | 52% | 3% | 18% | $8-12/month | 12% |

Localization cost estimates:
- Dubbing/subtitling existing library: $120M one-time (per major market)
- Original local content (minimum credible investment): $200-400M/year per market
- Marketing launch investment: $80-150M per market`,
        },
        options: [
          {
            id: "a",
            text: "Focus on Germany and France — they have high willingness to pay and StreamMax already has 12-15% share",
            correct: false,
            explanation: "Germany and France have low growth (7-8%) and are already relatively penetrated markets where Netflix has 3x+ StreamMax's share. The incremental subscriber opportunity is limited compared to high-growth, low-penetration emerging markets.",
          },
          {
            id: "b",
            text: "India and Brazil represent the highest priority international markets: India offers 750M smartphone users at only 18% streaming penetration growing 28% annually; Brazil has 34% penetration but strong growth and higher willingness to pay ($6-9/month) than India. Together they represent 40M+ achievable subscribers at 5-7% market share",
            correct: true,
            explanation: "Correct. Monitor Deloitte's market prioritization framework combines market size x growth x willingness to pay x competitive position. India: massive addressable market (750M smartphones x 18% streaming penetration = 135M current streamers growing rapidly), almost no current presence (1% share) means clear upside. Brazil: smaller but higher monetization potential at $6-9/month vs India's $3-5, and 4% current share gives a foundation to build on. The combination of both markets gives StreamMax geographic diversification and TAM breadth.",
          },
          {
            id: "c",
            text: "Indonesia offers the highest growth rate (35%) and should be the primary focus",
            correct: false,
            explanation: "Indonesia's 35% growth is attractive but $2-4/month willingness to pay is the lowest of all markets, zero current presence, and at 14% streaming penetration it requires building the market from scratch. The economics of Indonesia expansion are less favorable than India or Brazil when monetization is factored in.",
          },
          {
            id: "d",
            text: "Japan is the best market — high willingness to pay ($8-12/month) and 52% streaming penetration means a sophisticated consumer base",
            correct: false,
            explanation: "Japan has high ARPU potential but only 12% CAGR, 52% already-penetrated market, and StreamMax has only 3% share vs Netflix's 18% in a market with strong local content preferences. Japan is a valid secondary priority but not the primary growth market.",
          },
        ],
      },
      {
        id: "g9q4",
        stage: "Content Strategy",
        question: "StreamMax's content budget is $8.2B. Given the retention data showing unscripted content retains better at lower cost, how should they reallocate?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Cut drama spending in half and double unscripted — the retention data is unambiguous",
            correct: false,
            explanation: "Original drama still accounts for 42% of viewing hours and is why many subscribers joined in the first place. Cutting it drastically would trigger the 28% of churners citing 'not enough content' — just in a different direction. Content strategy requires balance, not extreme reallocation.",
          },
          {
            id: "b",
            text: "Maintain drama as anchor content but shift the incremental content dollar toward unscripted and sports adjacent: if $1B of new content investment is planned, allocate $400M to unscripted, $300M to sports adjacent rights/content, $200M to international local content, and only $100M to more drama — this delivers higher retention per dollar spent",
            correct: true,
            explanation: "Correct. Monitor Deloitte would recommend optimizing the marginal content dollar rather than disrupting the base portfolio. The insight is at the margin — for each new content dollar, unscripted and sports deliver 81-84% retention at $1.8-2.4M/hour vs drama's 68% at $8.2M/hour. This represents 4-5x better retention ROI. The existing drama slate is a sunk cost and should be maintained; the investment decision is about where to put the next dollar.",
          },
          {
            id: "c",
            text: "The content budget should be cut to improve margins, with savings returned to shareholders",
            correct: false,
            explanation: "Content is the core product of a streaming service — cutting content spend when facing subscriber decline would be value-destructive. The CFO's pressure to improve margins does not override the need to fix the fundamental growth problem.",
          },
          {
            id: "d",
            text: "Invest in sports rights — sports has the highest retention rate (84%) so StreamMax should acquire NFL or NBA rights",
            correct: false,
            explanation: "Major sports rights (NFL, NBA) cost $1-5B+ annually and are controlled by long-term exclusive deals. StreamMax likely cannot outbid existing rights holders. 'Sports adjacent' content (documentaries, behind-the-scenes, sports reality shows) is the practical alternative that captures much of the sports audience at far lower cost.",
          },
        ],
      },
      {
        id: "g9q5",
        stage: "Subscriber Growth Model",
        question: "The CGO asks you to model the path to 120M subscribers. Which scenario is most credible?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "StreamMax Subscriber Growth Scenarios (3-Year Projection)",
          data: `| Initiative | Subscriber Impact | Investment Required | Timeline |
|---|---|---|---|
| Ad-supported tier launch | +5-8M (re-acquisition) | $120M (technology + marketing) | 6 months |
| Churn reduction (3.4% → 2.5%) | +8-12M (retained subscribers) | $200M (content + UX investment) | 12-18 months |
| India expansion | +7-10M | $600M over 3 years | 18-24 months |
| Brazil expansion | +4-6M | $280M over 3 years | 12-18 months |
| Content strategy pivot | +3-5M (retention improvement) | Reallocation, no new spend | 12 months |
| Password sharing monetization | +2-3M | $40M (technology) | 6-9 months |
| **Total potential upside** | **+29-44M** | **$1.24B** | |
| **Target: +35M (85M → 120M)** | | | |`,
        },
        options: [
          {
            id: "a",
            text: "The 120M target is achievable in 3 years — just implement all 6 initiatives simultaneously",
            correct: false,
            explanation: "Implementing 6 major strategic initiatives simultaneously risks organizational overload and execution failure. The question is sequencing and prioritization, not whether the math adds up on paper.",
          },
          {
            id: "b",
            text: "The 120M target is achievable but requires sequencing: launch quick wins first (ad tier + password monetization in Months 1-6, delivering 7-11M subs), then churn reduction (Months 6-18, delivering 8-12M subs), then international expansion (Months 12-36, delivering 11-16M subs). Total: 26-39M upside, reaching 111-124M — the midpoint hits the 120M target by Year 3 end",
            correct: true,
            explanation: "Correct. Monitor Deloitte would sequence the initiatives by time-to-impact and capital efficiency. Quick wins (ad tier, password monetization) build momentum and fund the larger international investments. Churn reduction is the highest-priority structural fix. International expansion is high-impact but slow to ramp. The sequencing analysis shows 120M is achievable at the midpoint of the range — not guaranteed, but credible with good execution.",
          },
          {
            id: "c",
            text: "The 120M target is too ambitious — StreamMax should revise down to 105M and focus on profitability instead",
            correct: false,
            explanation: "The data shows 29-44M potential upside across the initiatives. Advising a client to lower their ambition before exhausting the strategic options is not the Monitor Deloitte approach.",
          },
          {
            id: "d",
            text: "StreamMax should consider acquiring a competitor to accelerate subscriber growth",
            correct: false,
            explanation: "M&A is not in scope for this engagement and would be a major strategic and financial undertaking beyond the growth strategy brief. Organic growth options should be fully developed before recommending an acquisition.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 10: STRATEGY& — LUXURY BRAND IDENTITY
  // ─────────────────────────────────────────────
  {
    id: "g10",
    title: "Maison Lumière: Digital Without Dilution",
    type: "market_entry",
    difficulty: "advanced",
    firm: "strategy_and",
    estimatedMinutes: 32,
    overview: "A heritage French luxury fashion house wants to build a direct-to-consumer digital channel without diluting brand equity. Strategy& has been engaged to design the strategy.",
    clientBackground: "Maison Lumière is a 142-year-old Parisian luxury house with €4.2B in annual revenue. Product lines include ready-to-wear (40% of revenue), leather goods (35%), and accessories/fragrance (25%). They sell through 180 own boutiques globally and ~800 department store/multibrand partners. Digital revenue is currently 4% of total (€168M), vs industry average of 22% for luxury. CEO mandate: reach 18% digital by 2027 without damaging the brand's exclusivity perception.",
    yourRole: "You are a Strategy& principal on the retail and luxury practice, based in Paris. This is a high-visibility engagement — the CEO will personally receive your final recommendation.",
    finalRecommendationPrompt: "How should Maison Lumière reach 18% digital revenue by 2027 without diluting brand equity? What is the specific digital architecture you recommend?",
    idealRecommendation: "Maison Lumière should build a 'Curated Digital Atelier' model: a proprietary digital channel with strict access design (no comparison shopping, no discount events, editorial-led product discovery) targeting three segments — existing clients (Client Advisor digital concierge), new luxury consumers in China and Middle East (market-specific apps with local luxury aesthetics), and fragrance/accessories for digital acquisition (lower entry price, less dilution risk). Avoid marketplaces completely (including luxury ones like Farfetch/Net-a-Porter for core RTW/leather). Revenue bridge to 18%: existing client digital activation (€320M), new digital-native luxury consumer acquisition in Asia/ME (€280M), accessories/fragrance digital expansion (€190M). Total: €790M new digital revenue = €168M existing + €790M = €958M = 23% of current revenue base. Timeline: 36 months with €180M technology and digital content investment.",
    keyTakeaways: [
      "Luxury brand equity is built on scarcity, craftsmanship, and exclusivity — digital strategy must reinforce these, not undermine them",
      "The luxury consumer's digital journey is fundamentally different from mass market — it starts with inspiration, not search",
      "Different product categories within the same brand have very different digital risk profiles — accessories and fragrance are low risk, core RTW and leather goods are high risk",
      "Geographic digital opportunity varies enormously — Chinese luxury consumers are more digital-native than Europeans or Americans",
    ],
    questions: [
      {
        id: "g10q1",
        stage: "Strategic Framing",
        question: "The CEO opens the meeting with: 'Every consultant we've hired tells us to invest in e-commerce. But I'm terrified of becoming the next Burberry — they had to spend a decade rebuilding exclusivity after digital killed it. How do we think about this differently?' What is the most insightful response?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "The Burberry comparison is outdated — luxury brands that invested in digital have outperformed those that didn't, so the risk is overstated",
            correct: false,
            explanation: "This dismisses a legitimate and deeply-felt strategic concern without engaging with it. The CEO has a real point — several luxury brands have damaged their positioning through poorly designed digital strategies. Strategy& would engage with the tension, not dismiss it.",
          },
          {
            id: "b",
            text: "The right question is not 'should we do digital' but 'which digital experience is consistent with Maison Lumière's identity.' The risk isn't digital per se — it's digital design choices that signal accessibility over exclusivity. The Burberry lesson is about channel discipline (who sells it, at what price, with what experience), not digital itself",
            correct: true,
            explanation: "Correct. This is the Strategy& answer — reframe the question from 'digital yes or no' to 'what type of digital.' The distinctive capabilities framework (which Strategy& is known for) applied here: Maison Lumière's distinctive capability is crafting an experience of exclusivity. The digital strategy must express that capability, not contradict it. The Burberry reference is engaged with directly — it was a distribution and discount discipline failure, not a digital technology failure.",
          },
          {
            id: "c",
            text: "We should benchmark what Chanel and Hermès have done digitally and follow their approach",
            correct: false,
            explanation: "Benchmarking competitors is a useful data point but it is not a strategy. Strategy& would push for a distinctive strategy tailored to Maison Lumière's specific capabilities and competitive position, not a benchmarking exercise.",
          },
          {
            id: "d",
            text: "The solution is to limit digital sales to accessories and fragrance only, protecting the core RTW and leather business",
            correct: false,
            explanation: "This is a potential conclusion, not a strategic framing. The CEO asked how to think about this differently — jumping to a specific solution before establishing the framework is premature.",
          },
        ],
      },
      {
        id: "g10q2",
        stage: "Customer Segmentation",
        question: "Strategy& has segmented Maison Lumière's customer base by digital affinity and spending level. Which segment should the digital strategy prioritize first?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Maison Lumière Customer Segmentation",
          data: `| Segment | Size | Avg Annual Spend | Digital Affinity | Current Digital Behavior | Revenue Potential |
|---|---|---|---|---|---|
| Inner Circle (top clients, VICs) | 12,000 | €45,000 | Low-Medium | 8% purchase digitally | €42M current digital |
| Loyal Regulars | 85,000 | €8,500 | Medium | 15% purchase digitally | €108M current digital |
| Occasional Buyers | 420,000 | €1,200 | High | 24% purchase digitally | €121M current digital |
| Digital-Native Luxury Consumers (China/ME, not yet clients) | Addressable: 2.5M | €2,000-8,000 | Very High | N/A (not current clients) | €0 current, high potential |
| Aspirational (fragrance/accessories only) | 4.2M | €280 | Very High | 42% purchase digitally | Fragrance/accessories only |

VIC (Very Important Client) digital preferences survey:
- 67% want digital access to new collections before boutique launch
- 78% want personal Client Advisor accessible via messaging app
- 89% do NOT want to see their purchase history on a general website
- 54% would purchase digitally if experience matched boutique personalization`,
        },
        options: [
          {
            id: "a",
            text: "Focus on the Aspirational segment (4.2M customers, 42% digital adoption) — largest addressable audience for digital revenue",
            correct: false,
            explanation: "The Aspirational segment has the highest digital adoption but at €280 average spend and fragrance/accessories only, it is low revenue per customer and has the highest brand dilution risk if the digital channel feels mass-market. This segment should be addressed through fragrance/accessories digital expansion but should not be the first strategic priority.",
          },
          {
            id: "b",
            text: "Start with VICs and Loyal Regulars — they represent the highest revenue per customer and their survey data reveals a specific, executable digital opportunity: Client Advisor digital concierge that matches boutique personalization, not mass-market e-commerce",
            correct: true,
            explanation: "Correct. Strategy& would prioritize the highest-value customers first. The VIC survey data is gold — 54% would purchase digitally if the experience matched boutique personalization. This is an insight that defines exactly what the digital product should be: not a standard e-commerce website, but a digital extension of the Client Advisor relationship. Starting here generates significant revenue (85,000 Loyal Regulars at €8,500 average spend moving from 15% to 30% digital = €430M incremental) with zero brand dilution risk.",
          },
          {
            id: "c",
            text: "Target the Digital-Native Luxury Consumer segment in China and the Middle East — largest revenue upside",
            correct: false,
            explanation: "The China/ME segment is important but should be a parallel track, not the starting point. It requires significant market-specific investment (localized apps, WeChat mini-programs, etc.) and takes 18-24 months to scale. Starting with existing customers where there is existing trust and a known product allows faster execution.",
          },
          {
            id: "d",
            text: "All segments should be addressed simultaneously through a single global digital platform",
            correct: false,
            explanation: "A single platform for VICs, occasional buyers, and aspirational customers would inevitably be designed for the common denominator and fail to meet the exclusive experience expectations of high-value clients. This is exactly the Burberry mistake the CEO was referencing.",
          },
        ],
      },
      {
        id: "g10q3",
        stage: "Digital Architecture",
        question: "Strategy& recommends a three-tier digital architecture for Maison Lumière. Which architecture best protects brand equity while maximizing digital revenue?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Tier 1: Full e-commerce website with complete product catalog; Tier 2: App with loyalty program; Tier 3: Social commerce on Instagram and WeChat",
            correct: false,
            explanation: "A full e-commerce website with complete catalog and social commerce is exactly the high-dilution-risk approach the CEO was concerned about. Price comparison, discount hunting, and social shopping are inconsistent with luxury brand positioning.",
          },
          {
            id: "b",
            text: "Tier 1: Private Client Portal (VICs + Loyal Regulars) — invite-only, Client Advisor-mediated digital boutique, no search engine indexing; Tier 2: Market-specific luxury apps for China (WeChat/native app) and Middle East — built with local luxury aesthetics, language, and cultural codes; Tier 3: Curated brand.com for inspiration, fragrance, and accessories with editorial content — no price visibility, request-to-purchase model",
            correct: true,
            explanation: "Correct. This architecture is distinctly Strategy& — it expresses Maison Lumière's distinctive capability (exclusivity, personalization) at every tier. Tier 1 is invite-only and advisor-mediated (matches boutique experience). Tier 2 acknowledges that Chinese and ME luxury consumers have fundamentally different digital luxury expectations (WeChat-native, mobile-first) — they require a different product, not a translated website. Tier 3 uses editorial to drive desire while the request-to-purchase model maintains exclusivity even for entry-level products.",
          },
          {
            id: "c",
            text: "Join Net-a-Porter and Farfetch for global distribution — they already have the luxury consumer audience and technology infrastructure",
            correct: false,
            explanation: "Net-a-Porter and Farfetch carry multiple brands and expose Maison Lumière to direct comparison shopping — the antithesis of luxury exclusivity. Hermès refuses multi-brand retail for exactly this reason. Recommending marketplace distribution to a heritage luxury house would show fundamental misunderstanding of luxury brand management.",
          },
          {
            id: "d",
            text: "Build a subscription model — charge clients €500/year for priority access to new collections",
            correct: false,
            explanation: "Subscription models are appropriate for mass-market digital products where recurring revenue and retention mechanics make sense. Charging VIC clients an access fee would be perceived as insulting to clients who already spend €45,000+ annually.",
          },
        ],
      },
      {
        id: "g10q4",
        stage: "China Digital Strategy",
        question: "China represents 38% of Maison Lumière's revenue but only 6% of their digital revenue. How should they approach the Chinese digital luxury market?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "China Luxury Digital Market Data",
          data: `| Metric | China | Global Average |
|---|---|---|
| % of luxury purchases made digitally | 46% | 22% |
| Preferred luxury discovery channel | WeChat (68%) | Brand website (42%) |
| Average age of luxury digital buyer | 29 | 38 |
| KOL (Key Opinion Leader) influence on luxury purchase | 71% | 28% |
| Preferred payment method | WeChat Pay / Alipay (94%) | Credit card (76%) |
| Important pre-purchase factor: social proof | 82% | 41% |
| Cross-border e-commerce preference | Domestic platform (78%) | Brand website (58%) |

Chinese digital luxury platforms:
| Platform | GMV | Luxury Positioning | Brand Control |
|---|---|---|---|
| Tmall Luxury Pavilion | ¥180B | High | Medium (Alibaba terms) |
| JD Luxury Express | ¥45B | Medium-High | Medium |
| WeChat Mini Program | Brand-specific | Brand-controlled | High |
| Douyin (TikTok) | Growing | Mixed | Low |
| Secoo | ¥8B | Declining | Low |`,
        },
        options: [
          {
            id: "a",
            text: "List on Tmall Luxury Pavilion — it has the highest GMV and is the standard entry point for luxury brands entering Chinese e-commerce",
            correct: false,
            explanation: "Tmall Luxury Pavilion has high reach but medium brand control — Alibaba's terms, promotional events (Singles Day), and multi-brand environment all create exclusivity risk. Louis Vuitton has resisted Tmall for this reason. For Maison Lumière's brand positioning, platform dependency on Alibaba is a strategic risk.",
          },
          {
            id: "b",
            text: "Build a WeChat Mini Program as the primary Chinese digital channel: highest brand control, preferred luxury discovery channel (68%), native payment integration (WeChat Pay), enables direct Client Advisor messaging, and does not require sharing customer data with Alibaba or JD",
            correct: true,
            explanation: "Correct. The WeChat Mini Program is the Strategy& recommendation for luxury in China. It combines maximum brand control with native behavior — Chinese luxury consumers spend 4+ hours per day on WeChat and luxury discovery primarily happens there. A Mini Program can replicate the invite-only, Client Advisor-mediated model of Tier 1 with market-specific luxury aesthetics. Louis Vuitton, Chanel, and Dior have all built Mini Programs as their primary Chinese digital channel for this reason.",
          },
          {
            id: "c",
            text: "Focus on KOL partnerships on Douyin — the 71% KOL influence rate suggests this is the highest leverage channel",
            correct: false,
            explanation: "KOL marketing on Douyin drives awareness and aspiration but mass-market influencer culture is inconsistent with ultra-luxury brand positioning. Maison Lumière should use KOL strategy selectively for brand storytelling, not as a primary sales channel. This risks exactly the brand dilution the CEO fears.",
          },
          {
            id: "d",
            text: "Build a standalone Chinese brand website similar to the global site but in Mandarin",
            correct: false,
            explanation: "A Mandarin brand website ignores the fundamental insight in the data: 78% of Chinese luxury digital consumers prefer domestic platforms over brand websites. Chinese digital consumer behavior is platform-native — a standalone website would be ignored.",
          },
        ],
      },
      {
        id: "g10q5",
        stage: "Revenue Model & ROI",
        question: "The CFO asks: 'What does the investment look like and when do we see return?' Build the financial case.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Maison Lumière Digital Investment & Return Model",
          data: `| Investment Component | Amount | Timeline | Expected Digital Revenue Contribution by Year 3 |
|---|---|---|---|
| Private Client Portal (Tier 1) | €35M | 12 months to launch | €320M (existing clients, increased digital share) |
| China WeChat Mini Program + team | €45M | 8 months to launch | €180M (new Chinese digital clients) |
| Middle East market app | €28M | 10 months to launch | €100M (new ME digital clients) |
| Global brand.com editorial redesign | €22M | 6 months | €95M (accessories + fragrance) |
| Digital content studio (ongoing) | €15M/year | Ongoing | Supports all tiers |
| Technology infrastructure | €30M | 18 months | Foundation for all tiers |
| **Total Investment (3 years)** | **€205M** | | |
| **Current digital revenue** | **€168M** | | |
| **Target digital revenue (18%)** | **€756M** (18% of €4.2B) | Year 3 | |
| **Required incremental digital revenue** | **€588M** | | |
| **Projected incremental revenue** | **€695M** | Year 3 | €168M + €695M = €863M = 20.5% |`,
        },
        options: [
          {
            id: "a",
            text: "The €205M investment is too large — recommend cutting to €100M and focusing only on China",
            correct: false,
            explanation: "The data shows €205M investment generates €695M incremental revenue — a 3.4x return over 3 years. Cutting investment in half to save €100M but losing €400M+ in revenue opportunity is poor resource allocation. Strategy& would defend the full investment.",
          },
          {
            id: "b",
            text: "The €205M investment generates €695M incremental digital revenue by Year 3 (3.4x return), exceeding the 18% digital target and reaching 20.5% — the investment is fully justified. Payback is approximately 3.5 years on a standalone basis, or less than 2 years when accounting for brand equity protection value of avoiding discounting and off-brand distribution",
            correct: true,
            explanation: "Correct. This is the complete Strategy& financial case: investment amount, revenue return, multiple, payback period, and importantly — the strategic value beyond the direct revenue (brand equity protection). The 20.5% projected digital share exceeds the 18% target, giving management confidence there is buffer in the plan. The payback calculation is sound and the brand equity value framing elevates the financial case beyond pure ROI.",
          },
          {
            id: "c",
            text: "The investment should be evaluated as a cost center since digital brand-building is not directly measurable",
            correct: false,
            explanation: "The revenue model shows specific, attributable digital revenue projections by channel. Treating a €695M revenue opportunity as a cost center because it involves brand building is analytically weak.",
          },
          {
            id: "d",
            text: "Phase the investment with €50M in Year 1 only and evaluate results before committing further",
            correct: false,
            explanation: "Excessive phasing with €50M Year 1 would only fund 2-3 of the 6 components and not generate enough scale to test the model properly. The China and Client Portal components alone require €80M to launch credibly. Under-investing in digital brand building often produces self-fulfilling failure.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 11: BAIN — PIZZA CHAIN MARKET SIZING (BEGINNER)
  // ─────────────────────────────────────────────
  {
    id: "g11",
    title: "SliceCo: US Pizza Market Sizing",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "bain",
    estimatedMinutes: 15,
    overview: "A private equity firm is evaluating an investment in SliceCo, a regional pizza chain. Before committing capital, they want Bain to estimate the total US pizza market size by revenue.",
    clientBackground: "SliceCo operates 240 locations in the Midwest, generating $180M in annual revenue. They are considering a national expansion and need to understand the total market opportunity. The PE firm wants a quick market sizing to validate whether a national pizza brand is worth pursuing.",
    yourRole: "You are a Bain first-year associate. The partner needs a market size estimate in 30 minutes for a client call.",
    finalRecommendationPrompt: "Give your best estimate of the US pizza market size in annual revenue and explain your methodology.",
    idealRecommendation: "The US pizza market is approximately $46-50B annually. Methodology: US population 330M, average household size 2.6 = 127M households. Pizza consumption: average American eats pizza ~30 times per year. Average spend per pizza occasion: $12 (mix of delivery, dine-in, frozen). 330M people x 30 occasions x $12 = $118B — but this includes frozen/retail. Restaurant pizza only: ~60% of occasions = $71B. Cross-check: 75,000 pizza restaurants in US x $650K average revenue = $49B. Final estimate: $46-50B for restaurant pizza, $15-18B additional for retail/frozen. Industry data confirms approximately $46B for restaurant pizza.",
    keyTakeaways: [
      "Always triangulate market sizing from two different angles — top-down (population-based) and bottom-up (supply-side)",
      "State your assumptions explicitly — the method matters as much as the number",
      "Sanity check your answer against any known data points",
      "Break the market into segments (restaurant vs retail, delivery vs dine-in) for a more useful answer",
    ],
    questions: [
      {
        id: "g11q1",
        stage: "Structuring",
        question: "The partner says: 'Give me a quick structure for sizing the US pizza market before you start calculating.' What is the best approach?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Number of pizza restaurants × average revenue per restaurant",
            correct: false,
            explanation: "This is a valid bottom-up approach but it only captures restaurant pizza and misses retail/frozen. As a standalone approach without triangulation it is incomplete.",
          },
          {
            id: "b",
            text: "Use two approaches: (1) Top-down: US population × frequency of pizza consumption × average spend; (2) Bottom-up: number of pizza restaurants × average unit volume. Then triangulate between the two.",
            correct: true,
            explanation: "Correct. Bain always wants two approaches to triangulate. Top-down starts from demand (consumers), bottom-up starts from supply (restaurants). When both approaches give similar answers, you have high confidence. When they diverge, you investigate why.",
          },
          {
            id: "c",
            text: "Look up Domino's annual report and multiply by the inverse of their market share",
            correct: false,
            explanation: "Using public company data is clever but Domino's market share varies by estimate and this approach doesn't account for independent pizzerias which represent a large portion of the market. Also, in a case interview you won't have internet access.",
          },
          {
            id: "d",
            text: "Estimate the number of pizza slices consumed daily and multiply by average slice price",
            correct: false,
            explanation: "This is a valid decomposition but 'slices per day' is a difficult number to anchor. Household-level or per-capita consumption is easier to estimate reliably.",
          },
        ],
      },
      {
        id: "g11q2",
        stage: "Top-Down Calculation",
        question: "You decide to start with a top-down approach. Using the following data, calculate the US restaurant pizza market size.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "US Pizza Consumption Data",
          data: `| Input | Estimate | Notes |
|---|---|---|
| US Population | 330M | Known |
| Average pizza occasions per person per year | 30 | Mix of restaurant + delivery + frozen |
| % of occasions at restaurant or delivery (not frozen/retail) | 62% | Frozen accounts for ~38% |
| Average spend per restaurant/delivery occasion | $13.50 | Individual spend including tip |
| % of spend that is pizza revenue (vs beverages, sides) | 68% | Pizza as % of total ticket |

Cross-check data:
| Input | Estimate |
|---|---|
| Number of pizza restaurants in US | ~78,000 |
| Average annual revenue per location | $620,000 |`,
        },
        options: [
          {
            id: "a",
            text: "$28B",
            correct: false,
            explanation: "Check your math. 330M × 30 × 62% × $13.50 × 68% = 330M × 18.6 occasions × $9.18 average pizza spend = $56.4B. $28B is roughly half the correct answer — likely a calculation error.",
          },
          {
            id: "b",
            text: "$56B top-down, $48B bottom-up — estimate approximately $46-52B",
            correct: true,
            explanation: "Correct. Top-down: 330M × 30 × 62% × $13.50 × 68% = 330M × 18.6 × $9.18 = $56.4B. Bottom-up: 78,000 × $620,000 = $48.4B. The two approaches give $48-56B, suggesting a midpoint estimate of approximately $46-52B is reasonable. The bottom-up is slightly lower because it excludes delivery-only operations not counted as 'restaurants.' Both numbers are in the same ballpark — good triangulation.",
          },
          {
            id: "c",
            text: "$120B",
            correct: false,
            explanation: "$120B would be correct only if you included ALL pizza occasions including frozen retail without the 68% pizza-only adjustment. Restaurant pizza market is significantly smaller than total pizza expenditure.",
          },
          {
            id: "d",
            text: "$15B",
            correct: false,
            explanation: "$15B is far too low. This is roughly what Domino's alone generates globally — the entire US pizza market is several multiples larger.",
          },
        ],
      },
      {
        id: "g11q3",
        stage: "Insight",
        question: "SliceCo generates $180M from 240 locations. Based on your market sizing, what is their current market share, and what does this imply for national expansion?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "SliceCo has 0.37% market share ($180M / $48B) — they are tiny and would need enormous capital to become a national player",
            correct: false,
            explanation: "The math is right (0.37%) but the conclusion is wrong. 0.37% of a $48B market is actually normal for a regional chain. Domino's has ~15% market share and Domino's is one of the world's largest restaurant chains. The right insight is about the expansion opportunity, not just the smallness.",
          },
          {
            id: "b",
            text: "SliceCo has 0.37% market share in a $48B market — their 240 Midwest locations at $750K average revenue suggest strong unit economics (50% above the $620K industry average), making national expansion compelling. At national scale matching Domino's 9% share, SliceCo would represent a $4.3B revenue business — 24x current size.",
            correct: true,
            explanation: "Correct. This is the full analytical insight. The market share number alone ($180M/$48B = 0.37%) is not the insight — the insight is the unit economics ($750K vs $620K benchmark = 21% above average) and the scale of opportunity (national expansion to Domino's-comparable share = $4.3B). This is how Bain thinks: market sizing is a means to a strategic insight, not an end in itself.",
          },
          {
            id: "c",
            text: "SliceCo should not expand nationally because the pizza market is dominated by Domino's and Pizza Hut",
            correct: false,
            explanation: "Competitive concentration does not automatically preclude expansion. A 0.37% share company with above-average unit economics in a $48B market has significant room to grow even in a competitive market.",
          },
          {
            id: "d",
            text: "The market sizing is not relevant to the expansion decision — what matters is whether SliceCo's food is good",
            correct: false,
            explanation: "Product quality matters but market sizing is directly relevant — it determines the ceiling of the opportunity and frames whether the expansion investment is justified.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 12: DELOITTE — BOOKSTORE PROFITABILITY (BEGINNER)
  // ─────────────────────────────────────────────
  {
    id: "g12",
    title: "PageTurner: Bookstore Chain Profitability",
    type: "profitability",
    difficulty: "beginner",
    firm: "deloitte",
    estimatedMinutes: 18,
    overview: "A regional bookstore chain has seen profits decline sharply over three years despite stable revenue. Deloitte has been engaged to diagnose the problem.",
    clientBackground: "PageTurner operates 85 bookstores across the Southeast US. Revenue has been stable at $420M for three years. However, net profit has fallen from $42M (10% margin) to $12.6M (3% margin). The CEO is concerned and has asked Deloitte for a rapid diagnosis before the board meeting next week.",
    yourRole: "You are a Deloitte consultant on your second engagement. The senior manager needs a clear diagnosis and preliminary recommendations by end of day.",
    finalRecommendationPrompt: "What is the primary driver of PageTurner's margin compression, and what are your top two recommendations?",
    idealRecommendation: "PageTurner's margin compression is driven by two factors: (1) rising occupancy costs as leases renewed at significantly higher post-pandemic rates (+$18M over 3 years), and (2) mix shift toward lower-margin categories (toys/gifts/café) that were added to offset declining book sales but dilute overall margin. Recommendations: (1) Renegotiate or exit the highest-cost leases — the bottom 20 locations by contribution margin should be evaluated for closure or relocation; (2) Optimize category mix by focusing on high-margin books and cutting underperforming gift/toy SKUs that were added without adequate margin analysis.",
    keyTakeaways: [
      "When revenue is flat and margins fall, the answer is always on the cost side — work through each cost line systematically",
      "Category mix changes often have unintended margin consequences — always analyze margin by category, not just total revenue",
      "Lease renewals are a common hidden driver of margin deterioration in retail — they often don't show up until renewal dates",
      "Stable revenue can mask significant underlying shifts — always ask what is inside the revenue number",
    ],
    questions: [
      {
        id: "g12q1",
        stage: "Initial Hypothesis",
        question: "Revenue is flat at $420M but profit margin fell from 10% to 3% — a $29.4M profit decline. Before looking at any data, what is your initial hypothesis about the most likely cause?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Revenue mix has shifted toward lower-margin products or channels",
            correct: false,
            explanation: "This is a valid hypothesis but it assumes revenue is flat in total while mix shifts internally. This is possible but you should also consider cost increases as an equally likely explanation — especially in a retail business where rents and labor are major variable costs.",
          },
          {
            id: "b",
            text: "Costs have increased while revenue remained flat — likely one or more cost line items (rent, labor, COGS) grew faster than revenue could absorb",
            correct: true,
            explanation: "Correct. With flat revenue, the entire margin decline must come from cost increases. In retail, the three largest cost buckets are COGS (cost of inventory), labor, and occupancy (rent). This is your hypothesis framework — you need to isolate which of these grew and by how much.",
          },
          {
            id: "c",
            text: "Management has been investing in growth and the costs will pay off in future years",
            correct: false,
            explanation: "This is possible but there is no evidence for it in the problem statement. A good consultant forms hypotheses based on what is known, not on charitable assumptions about management intent.",
          },
          {
            id: "d",
            text: "Amazon has taken market share and PageTurner needs to add an e-commerce channel",
            correct: false,
            explanation: "Amazon competition is the context for the bookstore industry generally, but the specific question is why margin fell over three years when revenue was flat. If Amazon were the cause, revenue would have declined, not stayed flat.",
          },
        ],
      },
      {
        id: "g12q2",
        stage: "Cost Analysis",
        question: "PageTurner's finance team provides the following P&L data. Identify the primary cost driver.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "PageTurner P&L — 3 Year Comparison ($M)",
          data: `| Line Item | Year 1 | Year 3 | Change ($M) | Change (%) |
|---|---|---|---|---|
| Revenue | $420M | $420M | $0 | 0% |
| Cost of Goods Sold | $252M | $260M | +$8M | +3% |
| Gross Profit | $168M | $160M | -$8M | -5% |
| Labor Costs | $63M | $67M | +$4M | +6% |
| Occupancy (Rent) | $38M | $56M | +$18M | +47% |
| Marketing | $8M | $9M | +$1M | +13% |
| G&A | $17M | $15M | -$2M | -12% |
| **Net Profit** | **$42M** | **$13M** | **-$29M** | **-69%** |
| **Net Margin** | **10%** | **3%** | | |

Location data:
- Total stores: 85 (unchanged)
- Stores with lease renewals in past 3 years: 38
- Average pre-renewal rent per store: $560K/year
- Average post-renewal rent per store: $1.1M/year`,
        },
        options: [
          {
            id: "a",
            text: "COGS increase of $8M is the primary driver — PageTurner is paying more for inventory",
            correct: false,
            explanation: "COGS increased $8M (3%) but this is roughly in line with inflation and represents a modest impact. The occupancy increase of $18M (+47%) is 2.25x larger and far above any inflation rate. COGS is not the primary driver.",
          },
          {
            id: "b",
            text: "Occupancy costs increased $18M (+47%) — driven by 38 lease renewals where average rent nearly doubled from $560K to $1.1M — this single item accounts for 62% of the total profit decline",
            correct: true,
            explanation: "Correct. $18M occupancy increase / $29M total profit decline = 62%. The lease renewal data makes this concrete: 38 stores renewed at $1.1M average vs $560K previous — an increase of $540K per store × 38 stores = $20.5M (slightly more than the $18M P&L shows, accounting for partial year renewals). This is the smoking gun. The partner will want this framed clearly: 'The $29M profit decline is primarily a real estate cost problem, not a revenue or COGS problem.'",
          },
          {
            id: "c",
            text: "Labor costs increased $4M — this is the operational problem that needs to be fixed through headcount reduction",
            correct: false,
            explanation: "Labor increased $4M (6%), which is roughly in line with wage inflation nationally. This is not an abnormal increase and represents only 14% of the profit decline. It should not be the focus of the diagnosis.",
          },
          {
            id: "d",
            text: "G&A decreased $2M which suggests management is cutting costs — the problem is on the revenue side",
            correct: false,
            explanation: "Revenue is flat at $420M by the problem definition. G&A reduction is a positive, not an indication of the problem. The cost analysis clearly shows occupancy as the culprit.",
          },
        ],
      },
      {
        id: "g12q3",
        stage: "Recommendation",
        question: "Now that you know occupancy is the primary driver, what is the most actionable recommendation for the CEO to present to the board?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Close all 38 stores that had lease renewals",
            correct: false,
            explanation: "Not all 38 renewed stores are necessarily unprofitable. Some may be high-traffic locations that justify higher rent. The recommendation should be a portfolio review based on contribution margin per store, not a blanket closure of all renewed locations.",
          },
          {
            id: "b",
            text: "Conduct a store-level contribution margin analysis of all 85 locations, identify the bottom 15-20 stores for closure or lease renegotiation, and establish a policy requiring board approval for any lease renewal above $800K/year",
            correct: true,
            explanation: "Correct. This recommendation is specific, actionable, and addresses both the immediate problem (exit/renegotiate high-cost leases) and the governance failure (no one flagged that 38 leases were renewing at 2x previous rates). The contribution margin analysis is the right tool — some high-rent stores may still be profitable enough to keep. The governance policy prevents recurrence.",
          },
          {
            id: "c",
            text: "Raise book prices to recover margin",
            correct: false,
            explanation: "Raising prices in a commoditized retail category where Amazon offers the same books at lower prices would accelerate customer attrition. This addresses the symptom (low margin) not the cause (high rent) and would likely make performance worse.",
          },
          {
            id: "d",
            text: "Add more café and gift sections to stores to grow revenue and dilute the fixed rent cost",
            correct: false,
            explanation: "Adding lower-margin categories (café, gifts) to grow revenue mathematically while the primary problem is cost is a distraction. You need to fix the cost structure, not try to grow revenue over it.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 13: BCG — GYM MARKET SIZING (BEGINNER)
  // ─────────────────────────────────────────────
  {
    id: "g13",
    title: "FitNation: US Gym Membership Market",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "bcg",
    estimatedMinutes: 15,
    overview: "A PE firm wants BCG to size the US gym and fitness membership market before evaluating an acquisition of FitNation, a regional gym chain.",
    clientBackground: "FitNation operates 120 gyms in Texas and Oklahoma with 280,000 members and $168M in annual revenue. The PE firm wants to understand the total US market before deciding whether to back a national rollout.",
    yourRole: "You are a BCG associate. The partner needs the market size in a structured, well-reasoned format before the investment committee meets in two hours.",
    finalRecommendationPrompt: "Estimate the total US gym and fitness membership market size by annual revenue, and explain what it means for FitNation's expansion opportunity.",
    idealRecommendation: "The US gym/fitness membership market is approximately $32-35B annually. Top-down: 260M adults × 22% gym membership rate × $600 average annual membership = $34.3B. Bottom-up: 41,000 gyms in US × $800K average revenue = $32.8B. FitNation's $168M revenue = 0.5% market share. With 120 gyms averaging 2,333 members at $600/year = solid unit economics. National scale to 1,000 gyms (comparable to Planet Fitness footprint) = $1.4B revenue opportunity. PE investment is justified if FitNation can demonstrate unit economics replicate outside Texas/Oklahoma.",
    keyTakeaways: [
      "Per-capita market sizing requires two key inputs: penetration rate and spend per user",
      "Always convert your market share into a concrete story about scale and opportunity",
      "Bottom-up supply-side sizing is a powerful cross-check for consumer-demand estimates",
      "The goal of market sizing in PE diligence is to frame the investment opportunity, not just produce a number",
    ],
    questions: [
      {
        id: "g13q1",
        stage: "Framework",
        question: "How would you structure a sizing of the US gym membership market?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "US adult population × gym membership penetration rate × average annual membership fee",
            correct: true,
            explanation: "Correct. This is the cleanest top-down approach. It decomposes the market into three inputs each of which can be estimated independently: adult population (known), penetration (estimable from personal experience/knowledge), and average fee (estimable from typical gym prices). This structure is immediately clear to any interviewer.",
          },
          {
            id: "b",
            text: "Total US healthcare spending × percentage allocated to fitness",
            correct: false,
            explanation: "Gym memberships are not typically counted as healthcare spending in a way that makes this decomposition clean. The inputs are harder to estimate and the connection is indirect.",
          },
          {
            id: "c",
            text: "Number of gym visits per year × revenue per visit",
            correct: false,
            explanation: "This approach works but requires estimating 'visits per year' which is harder to anchor than membership count. Memberships are also the unit of revenue for gyms (monthly fees regardless of visits), so a visit-based approach doesn't match the gym business model.",
          },
          {
            id: "d",
            text: "Number of people who exercise regularly × willingness to pay for a gym",
            correct: false,
            explanation: "'People who exercise regularly' is broader than gym members (includes home exercisers, runners, etc.) and 'willingness to pay' is different from actual spend. This framing introduces unnecessary complexity.",
          },
        ],
      },
      {
        id: "g13q2",
        stage: "Calculation",
        question: "Calculate the US gym membership market using the following data.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "US Fitness Market Inputs",
          data: `| Input | Low Estimate | Base Estimate | High Estimate |
|---|---|---|---|
| US adult population (18+) | 255M | 260M | 265M |
| Gym membership penetration | 18% | 22% | 26% |
| Average annual membership fee | $480 | $600 | $720 |
| % who are active members (vs lapsed payers) | 80% | 85% | 90% |

Supply-side cross-check:
| Input | Value |
|---|---|
| Total US gym/fitness facilities | ~41,000 |
| Average revenue per facility | $800,000 |

Note: Includes traditional gyms, boutique fitness (yoga, cycling), and budget chains.
Excludes: home fitness equipment, fitness apps, personal trainers.`,
        },
        options: [
          {
            id: "a",
            text: "$18B",
            correct: false,
            explanation: "Too low. Using base estimates: 260M × 22% = 57.2M members × $600 = $34.3B. $18B would require penetration of only ~11% or fees of only ~$315 — neither is realistic.",
          },
          {
            id: "b",
            text: "$34B top-down, $33B bottom-up — estimate approximately $32-35B",
            correct: true,
            explanation: "Correct. Top-down: 260M adults × 22% penetration = 57.2M members × $600/year = $34.3B. Bottom-up: 41,000 facilities × $800K = $32.8B. The two approaches are within 5% of each other — excellent triangulation. Final estimate: $32-35B for gym/fitness memberships in the US.",
          },
          {
            id: "c",
            text: "$65B",
            correct: false,
            explanation: "$65B is nearly double the correct answer. This would require either ~40% adult penetration or $1,000+ average annual fees — neither is realistic for the US gym market.",
          },
          {
            id: "d",
            text: "$8B",
            correct: false,
            explanation: "$8B is far too low — this is roughly what Planet Fitness alone generates. The total market is several multiples larger.",
          },
        ],
      },
      {
        id: "g13q3",
        stage: "Strategic Implication",
        question: "FitNation has 280,000 members paying an average of $50/month. How does this compare to the market, and what does it mean for the PE investment thesis?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "FitNation is too small — 0.5% market share means they cannot compete with Planet Fitness and Equinox",
            correct: false,
            explanation: "0.5% of a $33B market is $165M — which matches FitNation's $168M revenue. Small market share in a large market does not mean uncompetitive. Regional focus with strong unit economics is a valid and often successful strategy.",
          },
          {
            id: "b",
            text: "FitNation's 0.5% share of a $33B market represents a massive expansion runway. Their $600 average membership fee matches the market benchmark, and 280,000 members across 120 gyms = 2,333 members per gym, which is healthy utilization. National scale to Planet Fitness size (~2,400 gyms) would imply $3.4B revenue — a 20x opportunity.",
            correct: true,
            explanation: "Correct. BCG frames market sizing as an opportunity quantification exercise, not just a number. The 2,333 members per gym benchmark is solid (industry average is ~1,800-2,500). $600 average fee matches the market. The 20x scale opportunity (120 gyms to 2,400 gyms) frames the PE investment thesis clearly. The key diligence question is whether the unit economics replicate nationally — this is what the PE firm should focus on next.",
          },
          {
            id: "c",
            text: "FitNation should raise their membership fees since $600/year is at the market average — premium pricing would improve margins",
            correct: false,
            explanation: "Pricing strategy is a separate question from market sizing. More importantly, raising prices without a premium product differentiation risks churn to lower-priced competitors like Planet Fitness ($180/year).",
          },
          {
            id: "d",
            text: "The market is too competitive to justify investment — there are 41,000 gyms already",
            correct: false,
            explanation: "41,000 gyms across the US in a $33B market suggests average revenue of $800K per gym — a healthy market. Competitive intensity does not preclude a well-run operator from growing market share, especially via acquisition and rollup strategy.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 14: MCKINSEY — HOTEL PROFITABILITY (BEGINNER)
  // ─────────────────────────────────────────────
  {
    id: "g14",
    title: "SunStay Hotels: Post-Pandemic Recovery",
    type: "profitability",
    difficulty: "beginner",
    firm: "mckinsey",
    estimatedMinutes: 18,
    overview: "A mid-scale hotel chain is struggling to recover profitability three years after the pandemic. McKinsey has been engaged to identify the primary issues and quick wins.",
    clientBackground: "SunStay operates 95 hotels (primarily in business travel markets — airports, downtown business districts) with 14,200 total rooms. Pre-pandemic RevPAR (revenue per available room) was $98. Current RevPAR is $84. Operating costs per available room per day have increased from $52 to $71 over the same period. The CEO believes the problem is purely demand-side but the CFO thinks costs are out of control.",
    yourRole: "You are a McKinsey associate on the hospitality and travel practice. You have been asked to prepare a 10-minute update for the CEO and CFO together.",
    finalRecommendationPrompt: "Who is right — the CEO (demand problem) or the CFO (cost problem)? What should SunStay prioritize in the next 90 days?",
    idealRecommendation: "Both are right, but the CFO's concern is more urgent. RevPAR decline ($98 to $84 = -14%) is real but primarily explained by business travel not fully returning post-pandemic. Cost per room increase ($52 to $71 = +37%) is structural — labor and utility costs have permanently reset higher and will not self-correct. The contribution margin (RevPAR minus operating cost per room) has collapsed from $46 to $13 per room per day — a 72% decline. Immediate priorities: (1) Dynamic pricing optimization to recover RevPAR toward $92 in 90 days — revenue management systems are underutilized; (2) Labor scheduling optimization — peak vs off-peak staffing is poorly managed; (3) Identify 10-15 hotels with negative contribution margins for operational restructuring. The demand recovery will happen gradually — the cost problem needs active management now.",
    keyTakeaways: [
      "In hospitality, RevPAR (revenue per available room) and cost per available room are the two key metrics — the gap between them is contribution margin",
      "Post-pandemic cost resets are often structural (new wage levels, energy costs) rather than temporary",
      "Dynamic pricing in hotels is a high-ROI, low-investment quick win that many mid-scale chains underutilize",
      "When a CEO and CFO disagree, often both have a piece of the truth — a good consultant synthesizes rather than picks a side",
    ],
    questions: [
      {
        id: "g14q1",
        stage: "Framing the Problem",
        question: "Before looking at data, how do you frame the SunStay problem for the meeting with the CEO and CFO?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Take the CFO's side — costs are always manageable, demand is outside your control",
            correct: false,
            explanation: "Siding with one executive before seeing data is not analytical. Also, the framing is wrong — in hospitality, revenue management (pricing, channel mix) is very much within a hotel chain's control.",
          },
          {
            id: "b",
            text: "Frame it as a margin problem: Contribution Margin = RevPAR − Operating Cost per Room. RevPAR has declined AND cost per room has increased — both need to be quantified to determine relative importance",
            correct: true,
            explanation: "Correct. McKinsey would frame this as a contribution margin problem that decomposes into a revenue side and a cost side. This framing acknowledges both the CEO and CFO's concerns while establishing a neutral analytical structure. The question 'who is right' is answered by quantifying which side of the equation has moved more.",
          },
          {
            id: "c",
            text: "The CEO is likely right — hotels are fundamentally demand-driven businesses",
            correct: false,
            explanation: "Hotels have significant cost structures that management can control. Assuming the CEO is right without data is the same error as siding with the CFO without data.",
          },
          {
            id: "d",
            text: "Request a 2-week data gathering phase before forming any views",
            correct: false,
            explanation: "You have been asked to present in 10 minutes. 'We need more time' is not an acceptable answer when the CEO and CFO are in the room. Work with what you have and be explicit about assumptions.",
          },
        ],
      },
      {
        id: "g14q2",
        stage: "Quantifying the Problem",
        question: "Using the following data, calculate the contribution margin decline and determine whether it is primarily a revenue or cost problem.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "SunStay Financial Performance — Pre-Pandemic vs Current",
          data: `| Metric | Pre-Pandemic | Current | Change |
|---|---|---|---|
| RevPAR (revenue/available room/day) | $98 | $84 | -$14 (-14%) |
| Occupancy rate | 76% | 71% | -5pp |
| Average daily rate (ADR) | $129 | $118 | -$11 (-9%) |
| Operating cost per available room/day | $52 | $71 | +$19 (+37%) |
| **Contribution margin per room/day** | **$46** | **$13** | **-$33 (-72%)** |
| Total available room nights/year | 5.18M | 5.18M | 0 |
| **Annual contribution** | **$238M** | **$67M** | **-$171M** |

Cost breakdown (operating cost per available room/day):
| Cost Category | Pre-Pandemic | Current | Change |
|---|---|---|---|
| Labor | $24 | $36 | +$12 (+50%) |
| Utilities | $8 | $12 | +$4 (+50%) |
| Maintenance | $7 | $9 | +$2 (+29%) |
| Supplies/amenities | $6 | $8 | +$2 (+33%) |
| Other | $7 | $6 | -$1 (-14%) |`,
        },
        options: [
          {
            id: "a",
            text: "The revenue decline ($14/room/day) is the bigger problem since it affects the top line directly",
            correct: false,
            explanation: "The revenue decline is $14/room/day (-14%). The cost increase is $19/room/day (+37%). The cost increase is both larger in absolute terms AND represents a larger percentage change. Contribution margin fell $33 — $19 (58%) from cost increases and $14 (42%) from revenue declines. The CFO is more right than the CEO.",
          },
          {
            id: "b",
            text: "Both matter but cost increases account for $19 of the $33 contribution margin decline (58%) vs $14 from revenue decline (42%). The $171M annual contribution loss is roughly split $99M from cost increases and $72M from revenue declines — the CFO's concern is more acute.",
            correct: true,
            explanation: "Correct. This is the precise, quantified answer that the McKinsey partner wants. $19 cost increase vs $14 revenue decline — cost is the bigger driver. Annualized: $19 × 5.18M room nights = $98.4M from cost, $14 × 5.18M = $72.5M from revenue. Both are material but cost increases are the more urgent structural problem, especially since labor and utilities (+50% each) are unlikely to reverse.",
          },
          {
            id: "c",
            text: "The problem is equally split and both CEO and CFO are completely right",
            correct: false,
            explanation: "The data shows costs account for 58% of the decline and revenue 42% — not equal. 'Both equally right' is a diplomatic non-answer that avoids the quantitative conclusion the data supports.",
          },
          {
            id: "d",
            text: "The occupancy rate decline from 76% to 71% is the most important metric",
            correct: false,
            explanation: "Occupancy is one component of RevPAR. RevPAR = Occupancy × ADR. Both occupancy (-5pp) and ADR (-$11) contributed to the RevPAR decline. Focusing only on occupancy misses half of the revenue story.",
          },
        ],
      },
      {
        id: "g14q3",
        stage: "Quick Wins",
        question: "The CEO asks: 'What can we do in the next 90 days to improve the situation?' Which recommendation is highest priority?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Reduce room rates to drive occupancy back to 76% and recover revenue",
            correct: false,
            explanation: "Cutting rates when cost per room has increased by $19/day would worsen contribution margin. Lower rates + higher volume at negative margins is a path to faster losses. Pricing discipline is more important than occupancy optimization at this stage.",
          },
          {
            id: "b",
            text: "Implement dynamic pricing to optimize ADR without sacrificing occupancy — target recovering $8-10 of the $11 ADR decline through better yield management, and launch labor scheduling optimization to address the $12/room labor cost increase",
            correct: true,
            explanation: "Correct. These are the two highest-ROI 90-day actions. Dynamic pricing (revenue management) is often dramatically underutilized in mid-scale hotel chains — a 10-15% ADR improvement is achievable with better pricing software and yield management practices. Labor scheduling is the largest cost lever ($12/room increase = $62M annual impact) and can be partially addressed in 90 days through scheduling software and shift optimization.",
          },
          {
            id: "c",
            text: "Close the 10-15 least profitable hotels immediately to reduce overhead",
            correct: false,
            explanation: "Hotel closures involve lease obligations, staff severance, and brand consequences that cannot be executed in 90 days. This is a medium-term restructuring action, not a 90-day quick win.",
          },
          {
            id: "d",
            text: "Launch a major marketing campaign to drive leisure travelers since business travel has not recovered",
            correct: false,
            explanation: "Marketing campaigns take months to show revenue impact and business travel hotels are poorly positioned for leisure travelers (airport and downtown locations, no resort amenities). This is not a quick win.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 15: KPMG — FAST FOOD OPERATIONS (BEGINNER)
  // ─────────────────────────────────────────────
  {
    id: "g15",
    title: "BurgerBlitz: Drive-Through Wait Time Crisis",
    type: "operations",
    difficulty: "beginner",
    firm: "kpmg",
    estimatedMinutes: 18,
    overview: "A fast food franchise operator is seeing customer complaints about drive-through wait times surge. KPMG has been engaged to diagnose the operational issue and recommend fixes.",
    clientBackground: "BurgerBlitz operates 62 franchise locations in the mid-Atlantic US. Average drive-through wait time has increased from 3.2 minutes to 6.8 minutes over 18 months. Customer satisfaction scores have fallen from 78 to 61 (out of 100). Three locations have lost franchisee status due to quality standards violations. The franchisee group has hired KPMG to present findings to the franchisor before the annual review.",
    yourRole: "You are a KPMG consultant on the operations practice. You have visited 8 locations over the past two weeks and have operational data to present.",
    finalRecommendationPrompt: "What are the root causes of BurgerBlitz's drive-through problem and what are your top three operational fixes?",
    idealRecommendation: "The drive-through problem has three root causes: (1) Menu complexity — BurgerBlitz added 28 new SKUs in 18 months, increasing average order complexity and cooking time by 40%; (2) Staffing model — peak hour staffing ratios have not been updated since 2019 despite 23% higher order volumes; (3) Equipment maintenance — fryer and grill maintenance is reactive rather than scheduled, causing unplanned downtime during peak periods. Three fixes: (1) SKU rationalization — eliminate the bottom 30% of menu items by volume (retains 95% of revenue, reduces kitchen complexity significantly); (2) Update staffing model to peak-hour demand patterns; (3) Implement preventive maintenance schedule for all cooking equipment.",
    keyTakeaways: [
      "In food service operations, menu complexity is the hidden enemy of speed — every additional SKU adds training burden, inventory complexity, and kitchen coordination overhead",
      "Staffing models must be updated as demand patterns change — a 2019 model cannot handle 2024 volumes",
      "Reactive maintenance in food service creates peak-hour failures when equipment is under maximum stress",
      "Customer satisfaction in fast food correlates more strongly with wait time than any other single factor",
    ],
    questions: [
      {
        id: "g15q1",
        stage: "Problem Scoping",
        question: "Wait times doubled from 3.2 to 6.8 minutes. Before your site visits, what are the three most likely root cause categories you would investigate?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Staff quality, customer rudeness, and equipment brand",
            correct: false,
            explanation: "Staff quality is relevant but 'customer rudeness' is not an operational root cause, and equipment brand is not a meaningful variable for operational performance. This framing lacks rigor.",
          },
          {
            id: "b",
            text: "Order complexity (menu/order size), throughput capacity (staffing, equipment, layout), and process execution (standard operating procedures, training)",
            correct: true,
            explanation: "Correct. KPMG operations consultants use this three-bucket framework for food service throughput problems. Order complexity drives kitchen time. Throughput capacity determines how many orders can be processed simultaneously. Process execution determines whether the team is following optimal procedures. These three categories are MECE and cover the full range of drive-through speed drivers.",
          },
          {
            id: "c",
            text: "Competition, marketing, and pricing",
            correct: false,
            explanation: "These are relevant to revenue but not to operational wait times. The problem is explicitly about speed of service, not demand levels or competitive positioning.",
          },
          {
            id: "d",
            text: "Only staffing levels — more staff always solves throughput problems",
            correct: false,
            explanation: "More staff is one lever but not the only one. In food service, menu complexity, equipment capacity, and process design often have more impact per dollar than headcount increases.",
          },
        ],
      },
      {
        id: "g15q2",
        stage: "Data Analysis",
        question: "Your site visit data reveals the following. What is the primary operational root cause?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "BurgerBlitz Operational Diagnostic Data",
          data: `| Metric | 18 Months Ago | Current | Change |
|---|---|---|---|
| Average items per order | 3.2 | 4.1 | +28% |
| Menu SKU count | 42 | 70 | +67% |
| Average kitchen preparation time | 1.8 min | 3.4 min | +89% |
| Average order-taking time | 0.8 min | 1.2 min | +50% |
| Peak hour staffing (per location) | 8.2 FTE | 8.0 FTE | -2% |
| Daily order volume per location | 380 | 467 | +23% |
| Equipment downtime incidents/month | 1.2 | 4.8 | +300% |
| % of orders containing new menu items | N/A | 38% | N/A |

Wait time breakdown (current):
- Order taking: 1.2 min
- Kitchen preparation: 3.4 min  
- Window service/payment: 1.1 min  
- Queue wait: 1.1 min
- Total: 6.8 min`,
        },
        options: [
          {
            id: "a",
            text: "Staffing is the primary problem — peak hour FTE decreased from 8.2 to 8.0 while volume increased 23%",
            correct: false,
            explanation: "Staffing contributes but is not the primary driver. Kitchen preparation time increased 89% (from 1.8 to 3.4 minutes) — this single metric accounts for the largest share of the 3.6-minute wait increase. The staffing decline (-2%) is too small to explain an 89% preparation time increase.",
          },
          {
            id: "b",
            text: "Kitchen preparation time (+89%) is the primary driver, caused by two compounding factors: menu complexity (SKUs increased 67%, new items in 38% of orders) and equipment downtime (incidents up 300%). Together these account for 2.2 of the 3.6 minute wait time increase.",
            correct: true,
            explanation: "Correct. Kitchen prep time went from 1.8 to 3.4 minutes (+1.6 minutes) — the largest single contributor to the 3.6-minute total wait increase. The root causes are clear: 70 vs 42 SKUs = significantly more complex kitchen choreography; 38% of orders now contain new menu items that staff are less practiced with; equipment downtime increased 4x creating bottlenecks at peak times. The staffing gap (8.0 vs 8.2 FTE despite 23% more orders) compounds the problem but is secondary.",
          },
          {
            id: "c",
            text: "Order taking time increased 50% — the problem is at the front of the process, not the kitchen",
            correct: false,
            explanation: "Order taking increased from 0.8 to 1.2 minutes (+0.4 minutes). Kitchen prep increased from 1.8 to 3.4 minutes (+1.6 minutes). The kitchen time increase is 4x larger. Order taking is a contributing factor but not the primary driver.",
          },
          {
            id: "d",
            text: "Volume increase of 23% is the root cause — BurgerBlitz is a victim of its own success",
            correct: false,
            explanation: "Higher volume requires capacity adjustments but is not itself a root cause. The same 23% volume increase would be manageable with appropriate staffing, simpler menu, and reliable equipment. Volume growth is the context, not the cause.",
          },
        ],
      },
      {
        id: "g15q3",
        stage: "Solution Design",
        question: "The franchisor pushes back: 'We can't cut menu items — new products drove a 12% revenue increase.' How do you respond?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "You're right — keep all 70 menu items and just hire more staff to handle the complexity",
            correct: false,
            explanation: "Capitulating without analysis is not consulting. The question is whether the revenue from new items offsets the cost of slower service (lost customers, lower table turns). This is a quantifiable tradeoff.",
          },
          {
            id: "b",
            text: "The 12% revenue increase must be weighed against the cost of slower service. If wait times drove a 10-15% reduction in customer satisfaction and repeat visits, the net revenue impact may be neutral or negative. The recommendation is to retain the top 70% of new SKUs by volume (keeping most of the revenue) while eliminating the bottom 30% (low volume, high complexity items) — this likely preserves 95%+ of revenue while recovering 50-60% of the kitchen time lost to new item complexity.",
            correct: true,
            explanation: "Correct. KPMG would not simply retreat from the menu rationalization recommendation under pushback. The right response is to quantify the tradeoff: 12% revenue increase vs. customer satisfaction decline and repeat visit reduction. The compromise solution (cut bottom 30% by volume) preserves most revenue while recovering meaningful kitchen efficiency. This is the 'facts-based, constructive' approach — not capitulating, not being rigid, but proposing a data-driven middle path.",
          },
          {
            id: "c",
            text: "Menu expansion was a strategic mistake and should be fully reversed",
            correct: false,
            explanation: "Recommending full reversal without acknowledging the 12% revenue impact shows lack of commercial awareness. Menu rationalization should be surgical, not complete reversal.",
          },
          {
            id: "d",
            text: "This is the franchisor's decision — we can only present the data",
            correct: false,
            explanation: "Consultants are hired to make recommendations, not just present data and abdicate the decision. 'This is the client's decision' is the right framing for the ultimate choice but not for the recommendation itself.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 16: EY — LUXURY CAR MARKET SIZING (BEGINNER)
  // ─────────────────────────────────────────────
  {
    id: "g16",
    title: "LuxAuto: US Luxury Vehicle Market",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "ey",
    estimatedMinutes: 15,
    overview: "An EV startup wants to enter the US luxury vehicle segment. EY-Parthenon has been engaged to size the market and identify the most attractive entry point.",
    clientBackground: "VoltLux is a startup with $400M in seed funding building a luxury electric sedan to compete with Tesla Model S, BMW 7-series, and Mercedes S-class. The founding team wants to understand the total US luxury vehicle market (>$60,000) before finalizing their go-to-market strategy.",
    yourRole: "You are an EY-Parthenon associate. The partner needs a market size estimate with a clear methodology for the investor presentation tomorrow.",
    finalRecommendationPrompt: "Estimate the US luxury vehicle market size, identify VoltLux's realistic addressable market, and recommend which luxury segment to enter first.",
    idealRecommendation: "US luxury vehicle market ($60K+): approximately 1.8M units/year × $85K average transaction price = $153B. Luxury EV specifically (Tesla + competitors): approximately 350,000 units/year = ~$30B. VoltLux's SAM — targeting Model S/7-Series/S-Class buyers (>$80K sedan segment): ~180,000 units/year = $15-17B. SOM in Year 1-3: 2-5% of SAM = 3,600-9,000 units = $300-750M revenue. Recommended entry: full-size luxury EV sedan ($85-120K price point) targeting tech-forward luxury buyers in California, Texas, and New York first — these three states represent 42% of US luxury vehicle sales.",
    keyTakeaways: [
      "Market sizing requires defining TAM, SAM, and SOM — investors care most about SOM",
      "In automotive, sizing by units AND dollars gives a more complete picture",
      "Geographic concentration matters in luxury goods — 3-5 states often represent 40%+ of US luxury sales",
      "Always define the segment boundaries clearly — 'luxury' means different things at $60K vs $150K",
    ],
    questions: [
      {
        id: "g16q1",
        stage: "Market Definition",
        question: "The partner asks: 'Before sizing, define exactly what market we are sizing.' What is the most useful market definition for VoltLux?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "All electric vehicles sold in the US",
            correct: false,
            explanation: "This includes Chevy Bolts and budget EVs where VoltLux will not compete. Too broad to be actionable for their go-to-market strategy.",
          },
          {
            id: "b",
            text: "US luxury vehicles ($60K+ MSRP, new sales) — then segment further into luxury EV as VoltLux's primary competitive space",
            correct: true,
            explanation: "Correct. EY-Parthenon would define the market in layers: Total luxury market ($60K+) sets the ceiling of the opportunity. Luxury EV specifically is VoltLux's direct competitive set. This layered definition allows you to show TAM (all luxury), SAM (luxury EV buyers willing to switch), and SOM (realistic near-term capture). The $60K floor is a reasonable luxury threshold that captures the core competitive segment.",
          },
          {
            id: "c",
            text: "Tesla's current US sales as a proxy for the addressable market",
            correct: false,
            explanation: "Tesla's current sales reflect Tesla's market share, not the total addressable market. Using one competitor's sales as the market definition systematically understates the opportunity.",
          },
          {
            id: "d",
            text: "All vehicles sold in the US above $40K",
            correct: false,
            explanation: "$40K includes near-luxury vehicles (Toyota Camry XSE, Honda Accord Sport) where VoltLux at $85-120K would not compete. The threshold should match VoltLux's actual price point.",
          },
        ],
      },
      {
        id: "g16q2",
        stage: "Calculation",
        question: "Calculate the US luxury vehicle market size using the following data.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "US Vehicle Market Data",
          data: `| Segment | Annual Units Sold | Average Transaction Price | % that are EV |
|---|---|---|---|
| Near-luxury ($40-60K) | 2.8M | $51,000 | 18% |
| Luxury ($60-80K) | 980,000 | $71,000 | 24% |
| Ultra-luxury ($80-120K) | 620,000 | $96,000 | 31% |
| Super-luxury ($120K+) | 185,000 | $168,000 | 12% |
| **Total luxury ($60K+)** | **1,785,000** | **$85,000 avg** | **26%** |

Key brands in luxury ($60K+):
| Brand | Annual US Units | Avg Price | EV % |
|---|---|---|---|
| Tesla | 380,000 | $68,000 | 100% |
| BMW | 310,000 | $72,000 | 22% |
| Mercedes | 295,000 | $78,000 | 18% |
| Audi | 210,000 | $67,000 | 24% |
| Lexus | 185,000 | $62,000 | 8% |
| Porsche | 92,000 | $115,000 | 28% |
| Others | 313,000 | $88,000 | various |`,
        },
        options: [
          {
            id: "a",
            text: "$75B",
            correct: false,
            explanation: "Check your calculation. 1,785,000 units × $85,000 average = $151.7B ≈ $152B. $75B would only be correct if average price was around $42,000 — below the luxury threshold.",
          },
          {
            id: "b",
            text: "$152B total luxury market; $464B if you include near-luxury; luxury EV segment approximately $32B (1.785M × 26% EV × $68K avg EV price)",
            correct: true,
            explanation: "Correct. Total luxury ($60K+): 1,785,000 × $85,000 = $151.7B ≈ $152B. Luxury EV: 1,785,000 × 26% = 464,100 units × $68,000 average EV price = $31.6B ≈ $32B. This is VoltLux's primary competitive space. The $152B vs $32B framing shows why EV-specific sizing matters — VoltLux is entering 21% of the luxury market, not 100%.",
          },
          {
            id: "c",
            text: "$380B — the full US auto market",
            correct: false,
            explanation: "$380B is the full US auto market (approximately 15M vehicles × $25,000 average). The luxury segment ($60K+) is approximately 12% of total volume but 40% of total value. You should size the segment, not the whole market.",
          },
          {
            id: "d",
            text: "$26B — only counting Tesla since they dominate luxury EV",
            correct: false,
            explanation: "Tesla's $26B US revenue is Tesla's share of the luxury market, not the total market. VoltLux will compete against all luxury vehicles (gas and EV) that buyers might consider instead of their product.",
          },
        ],
      },
      {
        id: "g16q3",
        stage: "Entry Strategy",
        question: "The CEO asks: 'We have $400M. Which segment should we target first — volume luxury ($60-80K) or ultra-luxury ($80K+)?' What is your recommendation?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Volume luxury ($60-80K) — larger market at 980,000 units, more potential customers",
            correct: false,
            explanation: "Larger market in units does not mean better for a startup. The $60-80K segment is Tesla's core market — VoltLux would be directly competing with the best-resourced EV company. Also, $400M in capital limits your ability to win a price-sensitive high-volume segment.",
          },
          {
            id: "b",
            text: "Ultra-luxury ($80-120K) — smaller segment (620,000 units) but 31% EV penetration shows buyer receptivity, less direct Tesla competition, higher margins support $400M capital base, and luxury buyers are less price-sensitive allowing time to build brand",
            correct: true,
            explanation: "Correct. EY-Parthenon would recommend the ultra-luxury segment for a capital-constrained startup. Higher average price ($96K) means fewer units needed to generate meaningful revenue — 5,000 units = $480M revenue. 31% EV penetration is the highest of any luxury segment, showing buyer openness to EVs. Tesla is less dominant above $80K (Model X, not Model 3/Y territory). BMW 7-Series and Mercedes S-Class buyers are the target — they are already paying $100K+ for ICE vehicles and are open to EV alternatives.",
          },
          {
            id: "c",
            text: "Super-luxury ($120K+) — highest margin per unit",
            correct: false,
            explanation: "Super-luxury (185,000 units) has only 12% EV penetration — the lowest of all segments. Rolls-Royce and Bentley buyers are the most resistant to EVs in the current market. A startup entering this segment against legacy brands with 100-year heritage would struggle enormously.",
          },
          {
            id: "d",
            text: "Near-luxury ($40-60K) — largest addressable market",
            correct: false,
            explanation: "Near-luxury is outside VoltLux's stated $85-120K price point. Entering a segment below your natural price positioning would destroy the brand before it is built.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 17: ACCENTURE — RETAIL DIGITAL OPERATIONS (MEDIUM)
  // ─────────────────────────────────────────────
  {
    id: "g17",
    title: "RetailMax: Omnichannel Transformation",
    type: "operations",
    difficulty: "intermediate",
    firm: "accenture",
    estimatedMinutes: 28,
    overview: "A large US department store chain is losing market share to Amazon and specialty retailers. Accenture has been engaged to design and implement an omnichannel transformation.",
    clientBackground: "RetailMax operates 180 department stores across 32 states with $8.4B in annual revenue. Online revenue is only 12% ($1B) despite the category average being 35%. Their NPS is 42 vs 68 for best-in-class. Inventory accuracy is 71% (vs 94% best practice). Same-day delivery capability: 0 stores. Click-and-collect capability: 28 stores (16%). The CEO has set a target of 25% digital revenue within 2 years.",
    yourRole: "You are an Accenture senior manager on the retail technology practice. You are presenting a transformation roadmap to RetailMax's CTO and COO.",
    finalRecommendationPrompt: "What is your omnichannel transformation roadmap for RetailMax, and what is the expected financial impact?",
    idealRecommendation: "RetailMax's omnichannel transformation should be structured in three phases over 24 months. Phase 1 (0-6 months, $45M): Deploy RFID inventory tracking across all 180 stores to improve inventory accuracy from 71% to 94% — this is the foundation for all other capabilities. Roll out click-and-collect to all 180 stores. Phase 2 (6-12 months, $80M): Launch same-day delivery from 50 high-density stores using store-as-warehouse model. Redesign mobile app with personalization engine. Phase 3 (12-24 months, $120M): Full ship-from-store capability, AI-powered demand forecasting, and unified commerce platform. Financial impact: inventory accuracy improvement alone recovers $180M in lost sales annually. Click-and-collect drives 15% store traffic lift. Combined, these initiatives should deliver $1.2B in incremental digital revenue, reaching 23% digital mix — near the 25% target.",
    keyTakeaways: [
      "Inventory accuracy is the unsexy foundation of all omnichannel capability — you cannot offer same-day delivery if you don't know what's in your stores",
      "Click-and-collect (BOPIS) has 2-3x higher basket size than pure online orders due to incremental in-store purchases",
      "Store-as-warehouse models allow retailers to compete with Amazon on delivery speed without building new distribution infrastructure",
      "Digital transformation sequencing matters enormously — building customer-facing features on a broken inventory foundation is a common and costly mistake",
    ],
    questions: [
      {
        id: "g17q1",
        stage: "Root Cause",
        question: "RetailMax's digital revenue is 12% vs a 35% category average. Before designing solutions, what is the most likely root cause of this gap?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "RetailMax Digital Capability Benchmarking",
          data: `| Capability | RetailMax | Category Average | Best-in-Class |
|---|---|---|---|
| Online revenue share | 12% | 35% | 48% |
| Click-and-collect (BOPIS) | 16% of stores | 92% of stores | 100% |
| Same-day delivery | 0% of stores | 68% of stores | 100% |
| Inventory accuracy | 71% | 88% | 96% |
| Mobile app rating | 2.8/5 | 4.1/5 | 4.6/5 |
| Personalization score | 2/10 | 6/10 | 9/10 |
| Online return to store | Yes | Yes | Yes |
| Customer NPS | 42 | 61 | 78 |

Customer feedback (exit surveys, n=8,200):
| Reason for not shopping online | % Citing |
|---|---|
| Cannot get it same day | 54% |
| Item shown online not available in store | 48% |
| Prefer to try on/see in person | 38% |
| App is difficult to use | 31% |
| Prefer Amazon for same category | 28% |`,
        },
        options: [
          {
            id: "a",
            text: "The mobile app rating of 2.8 is the primary problem — fix the app and digital revenue will follow",
            correct: false,
            explanation: "The app is a problem (31% of customers cite it) but not the primary driver. 54% cite same-day delivery gaps and 48% cite inventory inaccuracy — both are larger and more fundamental barriers. Fixing the app experience on top of broken fulfillment capability would not resolve the primary issues.",
          },
          {
            id: "b",
            text: "Two compounding gaps drive the digital underperformance: fulfillment capability (0% same-day delivery vs 68% average, only 16% BOPIS vs 92% average) and inventory accuracy (71% vs 88% average) — customers cannot get what they want, when they want it, and RetailMax's digital channel cannot reliably promise availability",
            correct: true,
            explanation: "Correct. Accenture's diagnostic connects the customer feedback data (54% same-day, 48% inventory availability) to the capability gaps (0% same-day, 71% inventory accuracy). The root cause is not digital features — it is the physical fulfillment and inventory infrastructure that digital commerce runs on. This is the classic 'digital transformation starts with operations' insight.",
          },
          {
            id: "c",
            text: "RetailMax competes in the wrong categories — they should exit apparel and focus on home goods where Amazon is weaker",
            correct: false,
            explanation: "Category portfolio is a strategic question beyond the scope of a digital transformation engagement. The data does not support a category exit recommendation — it points to capability gaps that affect all categories.",
          },
          {
            id: "d",
            text: "Customer NPS of 42 is the root cause — unhappy customers don't shop online",
            correct: false,
            explanation: "Low NPS is a symptom of the fulfillment and inventory problems, not the cause. Fixing NPS requires fixing the underlying operational issues — not the other way around.",
          },
        ],
      },
      {
        id: "g17q2",
        stage: "Business Case",
        question: "The CFO asks: 'What is the financial return on the transformation investment?' Analyze the following data to build the business case.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "RetailMax Digital Transformation Business Case",
          data: `| Initiative | Investment | Annual Revenue Benefit | Annual Cost Savings | Payback |
|---|---|---|---|---|
| RFID inventory accuracy (180 stores) | $45M | $180M (reduced stockouts) | $35M (reduced markdowns) | 10 months |
| Click-and-collect rollout (all stores) | $28M | $145M (basket uplift) | $0 | 2.3 months |
| Same-day delivery (50 stores) | $65M | $280M (new digital revenue) | $0 | 2.8 months |
| Mobile app redesign + personalization | $38M | $165M (conversion improvement) | $0 | 2.8 months |
| Ship-from-store (all stores) | $120M | $420M (digital revenue) | $45M (fulfillment cost reduction) | 3.6 months |
| **Total** | **$296M** | **$1,190M** | **$80M** | **~3.5 months avg** |

Current state costs of digital underperformance:
- Lost online revenue vs category average: $1.9B annually (35% - 12% = 23pp × $8.4B)
- Inventory inaccuracy cost (markdowns + lost sales): $215M annually
- Higher fulfillment cost vs ship-from-store model: $45M annually`,
        },
        options: [
          {
            id: "a",
            text: "The $296M investment is too large for RetailMax to fund given their current performance",
            correct: false,
            explanation: "Investment size should be evaluated relative to returns, not in absolute terms. $296M generating $1,190M in annual revenue benefit = 4x return in Year 1. Even at a 50% probability-weighted benefit, the return is 2x. The investment is clearly justified.",
          },
          {
            id: "b",
            text: "The $296M investment generates $1,190M in annual revenue benefit + $80M in cost savings = $1,270M total annual benefit — a 4.3x first-year return. The average payback of 3.5 months is exceptional. The business case is compelling, especially against the $1.9B in annual revenue currently being lost to digital underperformance.",
            correct: true,
            explanation: "Correct. Accenture always leads with the business case in transformation selling. The $1.9B current annual cost of underperformance is the most powerful number in the room — it reframes the $296M investment from 'cost' to 'recovery of value that is already being lost.' This is how Accenture secures large transformation mandates: by showing the cost of inaction exceeds the cost of action.",
          },
          {
            id: "c",
            text: "Prioritize only the cheapest initiatives (click-and-collect at $28M) and see if revenue improves before committing to the full program",
            correct: false,
            explanation: "Click-and-collect without inventory accuracy (71%) will disappoint customers who arrive to pick up items that aren't actually available. Partial transformation without the foundational RFID investment risks wasting the $28M on a capability that doesn't work reliably.",
          },
          {
            id: "d",
            text: "The ship-from-store initiative should be deprioritized because it has the longest payback at 3.6 months",
            correct: false,
            explanation: "3.6 months payback for a $120M investment is exceptional by any standard. Deprioritizing the initiative with the highest absolute return ($420M + $45M = $465M) because it has a slightly longer payback than other initiatives is a misapplication of ROI analysis.",
          },
        ],
      },
      {
        id: "g17q3",
        stage: "Implementation Sequencing",
        question: "The CTO says: 'We cannot do everything at once. In what order should we implement these capabilities?' What is the correct sequencing and why?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Start with mobile app redesign — it is customer-facing and will drive immediate digital revenue",
            correct: false,
            explanation: "Mobile app improvements without fixing fulfillment capability will improve conversion to a broken experience. Customers will order online via the new app and then be disappointed when items aren't available or delivery takes 5 days. Customer experience is determined by the worst step in the journey, not the best.",
          },
          {
            id: "b",
            text: "Sequence: (1) RFID inventory accuracy first — it is the operational foundation without which all other capabilities fail; (2) Click-and-collect simultaneously — fastest ROI and lowest complexity; (3) Same-day delivery once inventory is reliable; (4) Mobile app and personalization; (5) Ship-from-store last — highest complexity, requires accurate inventory as prerequisite",
            correct: true,
            explanation: "Correct. Accenture's transformation sequencing principle: fix the foundation before building on it. RFID inventory accuracy is the prerequisite for everything else — you cannot reliably offer same-day delivery or BOPIS with 71% inventory accuracy. Click-and-collect can run in parallel because it is simpler and the impact of inaccuracy is lower (customers arrive and find out item is unavailable — frustrating but recoverable). Mobile and personalization can be built while physical capability is being established. Ship-from-store requires near-perfect inventory accuracy and is therefore last.",
          },
          {
            id: "c",
            text: "Implement all five initiatives simultaneously to minimize total transformation timeline",
            correct: false,
            explanation: "Simultaneous implementation overloads organizational change management capacity and creates technical dependencies — you cannot complete ship-from-store before RFID is done. Parallel streams are appropriate where there are no dependencies, but sequencing is required where capabilities build on each other.",
          },
          {
            id: "d",
            text: "Start with ship-from-store since it has the highest revenue benefit",
            correct: false,
            explanation: "Ship-from-store requires 94%+ inventory accuracy to function reliably. Starting it at 71% accuracy would result in high error rates, customer disappointment, and wasted implementation investment.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 18: BCG — PHARMA MARKET ENTRY (MEDIUM)
  // ─────────────────────────────────────────────
  {
    id: "g18",
    title: "GeneriPharma: US Generic Drug Market Entry",
    type: "market_entry",
    difficulty: "intermediate",
    firm: "bcg",
    estimatedMinutes: 28,
    overview: "A European pharmaceutical company wants to enter the US generic drug market. BCG has been engaged to assess market attractiveness and recommend an entry strategy.",
    clientBackground: "GeneriPharma is a €2.8B European generic pharmaceutical company (headquartered in Germany) with operations in 18 European markets. They have never operated in the US. The US generic drug market is the world's largest at ~$100B. GeneriPharma's CEO believes there is significant opportunity as branded drugs go off-patent over the next 5 years.",
    yourRole: "You are a BCG project leader on the pharma and healthcare practice. You have 6 weeks to deliver a go/no-go recommendation with an entry strategy.",
    finalRecommendationPrompt: "Should GeneriPharma enter the US generic drug market, and if so, through what entry mode and targeting which therapeutic categories?",
    idealRecommendation: "GeneriPharma should enter the US market through acquisition of a mid-sized US generic manufacturer, not organically. Organic entry would take 5-7 years (FDA ANDA filing backlog, manufacturing compliance, distribution setup) — too slow to capture the upcoming patent cliff opportunity. Recommended acquisition target: a US generic company with $300-500M revenue, existing FDA-approved manufacturing, established distribution relationships with major PBMs (Express Scripts, CVS Caremark), and exposure to the cardiovascular and CNS categories where 8 major drugs lose patent protection 2025-2028 ($45B+ combined revenue at risk). Target acquisition price: $800M-1.2B (2-3x revenue). Entry rationale: US generics market growing at 8% CAGR, GeneriPharma's European manufacturing expertise creates immediate synergies, and the patent cliff creates a 3-year window of above-average opportunity.",
    keyTakeaways: [
      "FDA regulatory approval (ANDA) is the primary barrier to entry in US generics — it creates 2-5 year lead times that favor incumbent players",
      "PBM (pharmacy benefit manager) relationships are the distribution key to the US generic market",
      "Patent cliffs create predictable, time-limited windows of above-normal profitability for first generic entrants",
      "Build vs buy in regulated industries almost always favors acquisition because regulatory approvals cannot be accelerated with money",
    ],
    questions: [
      {
        id: "g18q1",
        stage: "Market Attractiveness",
        question: "Assess the attractiveness of the US generic drug market for GeneriPharma using the following data.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "US Generic Drug Market Overview",
          data: `| Metric | Value | Notes |
|---|---|---|
| Total US generic drug market size | $98B | At manufacturer prices |
| Market growth rate (CAGR) | 8% | Driven by patent expirations |
| Number of generic manufacturers | ~300 | Highly fragmented |
| Top 5 players' combined market share | 52% | Teva (18%), Mylan (12%), Sandoz (9%), Amneal (7%), Sun Pharma (6%) |
| Average gross margin (generic drugs) | 42% | vs 85%+ for branded |
| Regulatory barrier: ANDA approval time | 36-48 months | Average FDA review time |
| Pending ANDAs in FDA queue | 4,200 | Growing backlog |
| Generic penetration rate (by prescriptions) | 91% | 9% of Rx are branded |

Patent cliff pipeline (drugs losing patent 2025-2028):
| Drug | Category | 2024 Branded Revenue | First Generic Date |
|---|---|---|---|
| Humira biosimilars | Autoimmune | $21B | Already live |
| Keytruda | Oncology | $25B | 2028 |
| Eliquis | Cardiovascular | $12B | 2026 |
| Jardiance | Diabetes | $8B | 2025 |
| Ozempic | Diabetes/GLP-1 | $14B | 2031 |
| Vyvanse | CNS/ADHD | $4.5B | 2023 (live) |
| Entresto | Cardiovascular | $6B | 2025 |`,
        },
        options: [
          {
            id: "a",
            text: "The market is unattractive — 300 competitors and 52% concentration in the top 5 players leaves little room for a new entrant",
            correct: false,
            explanation: "300 manufacturers in a $98B market = $327M average revenue per player — this is actually a sign of a fragmented market with room for consolidation. Top 5 at 52% leaves 48% ($47B) in the hands of smaller players — significant opportunity for a well-capitalized entrant.",
          },
          {
            id: "b",
            text: "The market is attractive: $98B and growing at 8% CAGR, a major patent cliff creates time-limited opportunity, and GeneriPharma's European manufacturing expertise can be leveraged. The key risk is the 36-48 month ANDA approval timeline which constrains organic entry speed.",
            correct: true,
            explanation: "Correct. BCG's market attractiveness assessment: Size ($98B) and growth (8%) are both strong. Patent cliff is a near-term catalyst (Eliquis and Entresto both lose patent 2025-2026 = $18B combined revenue entering generic competition). The ANDA timeline is the structural challenge — any organic entry strategy must account for 3-4 year lead time. This is the key insight that drives the acquisition recommendation.",
          },
          {
            id: "c",
            text: "GeneriPharma should focus on branded drugs not generics — the 42% vs 85%+ margin differential makes generics unattractive",
            correct: false,
            explanation: "Branded pharma requires 10-15 year R&D timelines and billions in clinical trial investment. GeneriPharma's business model and capabilities are built around generics. Switching to branded is a complete strategic pivot, not a market entry decision.",
          },
          {
            id: "d",
            text: "The Ozempic patent cliff in 2031 should be the primary target — it is the largest revenue opportunity",
            correct: false,
            explanation: "2031 is 7 years away — planning around a 2031 patent expiry ignores the nearer-term opportunities (2025-2026 patent cliffs) that create the immediate window. Also, GLP-1 biosimilars will face significant manufacturing complexity that may not leverage GeneriPharma's existing capabilities.",
          },
        ],
      },
      {
        id: "g18q2",
        stage: "Entry Mode",
        question: "GeneriPharma's CEO wants to enter organically. What is the case for and against organic entry vs acquisition?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Entry Mode Comparison: Organic vs Acquisition",
          data: `| Dimension | Organic Entry | Acquisition |
|---|---|---|
| Time to first US revenue | 4-6 years (ANDA + setup) | 6-12 months (post-close) |
| Capital required | $150-250M over 5 years | $800M-1.2B upfront |
| FDA manufacturing compliance | Start from scratch (2-3 years) | Acquired company already compliant |
| Distribution (PBM relationships) | Build from zero (2-4 years) | Acquire existing relationships |
| Ability to capture 2025-2026 patent cliff | No — too slow | Yes — if acquired in 2024 |
| Risk level | High (unknown unknowns) | Medium (due diligence mitigates) |
| Management complexity | Low initially | High (integration) |

US generic market acquisition targets (illustrative):
| Company | Revenue | EBITDA | Market Cap | Capabilities |
|---|---|---|---|---|
| MidWest Generics | $380M | $72M | $650M | Cardiovascular focus, 8 FDA-approved plants |
| SunValley Pharma | $520M | $98M | $890M | CNS + diabetes, strong PBM relationships |
| Atlantic Drug Co | $290M | $48M | $480M | Solid state, injectable expertise |`,
        },
        options: [
          {
            id: "a",
            text: "Organic entry is better — it is cheaper at $150-250M vs $800M-1.2B for an acquisition",
            correct: false,
            explanation: "Cost comparison without accounting for time value is incomplete. Organic entry takes 4-6 years to generate revenue vs acquisition that generates revenue in 6-12 months. The opportunity cost of missing the 2025-2026 patent cliff alone could be worth hundreds of millions. 'Cheaper' is not always 'better.'",
          },
          {
            id: "b",
            text: "Acquisition is clearly superior: it generates US revenue 4-5 years faster, captures the 2025-2026 patent cliff, acquires FDA manufacturing compliance and PBM distribution that cannot be accelerated with money, and the $800M-1.2B investment generates $380-520M in acquired revenue from Day 1",
            correct: true,
            explanation: "Correct. BCG's entry mode analysis in regulated industries almost always favors acquisition when: (1) regulatory timelines constrain organic speed; (2) there is a time-sensitive market window; (3) the acquirer lacks country-specific regulatory and distribution assets. All three conditions apply here. The 4-5 year head start on revenue generation, combined with the patent cliff window, makes acquisition clearly superior despite higher upfront cost.",
          },
          {
            id: "c",
            text: "A joint venture with an existing US generic manufacturer is the best middle path",
            correct: false,
            explanation: "JVs in pharma are complex to structure, create IP sharing concerns, and don't provide the full distribution and regulatory control that GeneriPharma needs. JVs also don't give the speed advantage of acquisition since negotiation and setup take 12-18 months anyway.",
          },
          {
            id: "d",
            text: "GeneriPharma should wait and see how the patent cliff plays out before committing",
            correct: false,
            explanation: "'Wait and see' means missing the patent cliff window. The best acquisition targets will be priced higher once the patent cliff opportunity is obvious to all buyers. First-mover advantage in M&A requires acting before the thesis is fully proven.",
          },
        ],
      },
      {
        id: "g18q3",
        stage: "Target Selection",
        question: "Which acquisition target should GeneriPharma pursue, and what is your rationale?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Atlantic Drug Co ($290M revenue, $480M market cap) — cheapest acquisition price",
            correct: false,
            explanation: "Atlantic Drug focuses on solid state and injectable — not cardiovascular or CNS where the 2025-2026 patent cliff is concentrated. Cheapest acquisition price is not the right selection criterion — strategic fit is.",
          },
          {
            id: "b",
            text: "SunValley Pharma ($520M revenue, $890M market cap) — CNS + diabetes focus directly aligns with Vyvanse (already live), Jardiance (2025), and future GLP-1 generic opportunity. Strong PBM relationships accelerate commercial launch of acquired pipeline. Implied 9x EBITDA multiple ($890M/$98M) is reasonable for a platform asset.",
            correct: true,
            explanation: "Correct. BCG would select on strategic fit, not just price. SunValley's CNS + diabetes focus aligns directly with the near-term patent cliff (Jardiance 2025, Vyvanse already live) and the longer-term GLP-1 opportunity. Strong PBM relationships are the most valuable non-obvious asset — they determine whether GeneriPharma's new generic launches actually get formulary placement and volume. The 9x EBITDA multiple is standard for a high-quality US generic platform.",
          },
          {
            id: "c",
            text: "MidWest Generics ($380M revenue, $650M market cap) — cardiovascular focus captures Eliquis and Entresto patent cliffs in 2025-2026",
            correct: false,
            explanation: "MidWest Generics is a valid second choice — cardiovascular focus does align with the 2025-2026 patent cliff. However, SunValley is better because it covers both CNS and diabetes (broader pipeline), has $140M more revenue at only $240M more market cap (better multiple), and has stronger PBM relationships. Both are defensible but SunValley is the stronger recommendation.",
          },
          {
            id: "d",
            text: "GeneriPharma should acquire all three targets to maximize market coverage",
            correct: false,
            explanation: "Acquiring three companies simultaneously would cost $2B+, require integrating three separate organizations at once, and stretch management capacity dangerously thin. Platform building through serial acquisitions is a valid strategy — doing three at once is not.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 19: MCKINSEY — TECH COMPANY RESTRUCTURING (HARD)
  // ─────────────────────────────────────────────
  {
    id: "g19",
    title: "CloudCore: Post-Hypergrowth Restructuring",
    type: "operations",
    difficulty: "advanced",
    firm: "mckinsey",
    estimatedMinutes: 35,
    overview: "A B2B SaaS company that grew 10x during the pandemic is now facing an existential cost crisis. McKinsey has been engaged to redesign the cost structure and restore sustainable growth.",
    clientBackground: "CloudCore provides cloud infrastructure management software to mid-enterprise clients. Revenue grew from $180M (2019) to $1.8B (2022) — 10x in 3 years. Headcount grew from 800 to 6,200 employees. In 2023, revenue growth decelerated to 12% (from 65% in 2022) while costs continued growing at 28%. EBITDA has gone from +18% margin to -22% margin. The board has given the CEO 18 months to reach EBITDA breakeven or the company faces a down-round or sale.",
    yourRole: "You are a McKinsey associate principal on the tech and digital practice. You have 8 weeks to deliver a restructuring plan. The CEO has been clear: this plan will determine whether the company survives.",
    finalRecommendationPrompt: "What restructuring actions should CloudCore take to reach EBITDA breakeven within 18 months? Be specific about cost reduction targets, organizational changes, and the sequencing.",
    idealRecommendation: "CloudCore must reduce annualized costs by $580M to reach breakeven. Three major actions: (1) Workforce reduction of 35% (2,170 employees) focused on: G&A functions at 2x industry ratios, duplicate engineering teams from acquisition integrations, and sales productivity outliers. Estimated savings: $320M. (2) Real estate rationalization — close 8 of 12 office locations, shift to hub-and-spoke model. Savings: $85M. (3) Vendor and infrastructure spend consolidation — cloud infrastructure costs grew 340% vs revenue growth of 900%, suggesting significant waste. Savings: $175M. Total: $580M, achieving breakeven at current revenue run-rate. Sequencing: workforce announcement in Week 2 (one-time, get it done), real estate over 6-12 months as leases expire, infrastructure over 6 months with engineering team. Critical risk: retention of top 10% of engineering talent who can re-accelerate growth after restructuring.",
    keyTakeaways: [
      "Hypergrowth companies systematically over-hire in G&A and middle management because revenue growth masks inefficiency",
      "Workforce reductions must be done once and decisively — death by a thousand cuts destroys morale without fixing the economics",
      "Infrastructure and vendor spend is often the least-examined cost bucket in tech companies and frequently has 30-50% waste",
      "The goal of a restructuring is to create a sustainable business, not just to hit a near-term target — talent retention during restructuring is critical",
    ],
    questions: [
      {
        id: "g19q1",
        stage: "Cost Diagnosis",
        question: "CloudCore's cost structure has grown dramatically. Identify the primary areas of cost excess using the following data.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "CloudCore Cost Structure Analysis",
          data: `| Cost Category | 2019 | 2022 | Growth | % of Revenue 2022 | Industry Benchmark |
|---|---|---|---|---|---|
| R&D (engineering) | $45M | $612M | 13.6x | 34% | 18-22% |
| Sales & Marketing | $38M | $504M | 13.3x | 28% | 20-25% |
| G&A | $22M | $414M | 18.8x | 23% | 8-12% |
| Cloud infrastructure | $18M | $252M | 14x | 14% | 8-10% |
| **Total Costs** | **$123M** | **$1,782M** | **14.5x** | **99%** | **65-70%** |
| **Revenue** | **$180M** | **$1,800M** | **10x** | | |
| **EBITDA margin** | **+18%** | **-1%** | | | |

Headcount by function (current):
| Function | 2019 | 2022 | Growth | Revenue/Employee |
|---|---|---|---|---|
| Engineering | 320 | 2,480 | 7.8x | $726K |
| Sales & Marketing | 210 | 1,560 | 7.4x | $1,154K |
| G&A (HR, Finance, Legal, IT, Facilities) | 180 | 1,480 | 8.2x | $1,216K |
| Customer Success | 90 | 680 | 7.6x | $2,647K |
| **Total** | **800** | **6,200** | **7.75x** | **$290K/employee** |`,
        },
        options: [
          {
            id: "a",
            text: "R&D is the biggest problem — $612M is the largest absolute cost and engineering headcount grew 7.8x",
            correct: false,
            explanation: "R&D at 34% of revenue is high but not the most anomalous. Industry benchmark is 18-22%, so CloudCore is 12-16pp above benchmark. G&A at 23% vs 8-12% benchmark is 11-15pp above benchmark. More importantly, G&A grew 18.8x vs revenue growth of 10x — the fastest growing cost category by far.",
          },
          {
            id: "b",
            text: "G&A is the most structurally excessive at 23% of revenue vs 8-12% benchmark — it grew 18.8x while revenue grew only 10x. Cloud infrastructure at 14% vs 8-10% benchmark is the second largest excess. Together, G&A and infrastructure represent $540M in excess costs against benchmarks.",
            correct: true,
            explanation: "Correct. McKinsey's cost excess analysis: G&A at 23% vs 11% midpoint benchmark = 12pp excess × $1.8B revenue = $216M in excess G&A. Infrastructure at 14% vs 9% benchmark = 5pp × $1.8B = $90M excess. G&A grew 18.8x vs 10x revenue — the most disproportionate growth. The G&A problem is structural (hypergrowth always creates bloated support functions) and the infrastructure problem is technical (cloud costs often scale faster than revenue until optimized).",
          },
          {
            id: "c",
            text: "Sales & marketing at 28% is most concerning — the company is overspending on growth",
            correct: false,
            explanation: "S&M at 28% vs 20-25% benchmark is 3-8pp above benchmark — elevated but not catastrophic. S&M grew 13.3x which tracks revenue growth of 10x reasonably well. The bigger excesses are in G&A and infrastructure.",
          },
          {
            id: "d",
            text: "Revenue per employee of $290K is actually fine for a SaaS company",
            correct: false,
            explanation: "SaaS company revenue per employee benchmarks are typically $350-500K for mature companies. $290K is below benchmark and reflects the overhiring of the hypergrowth period. This is the aggregate signal — the function-level analysis tells you where to cut.",
          },
        ],
      },
      {
        id: "g19q2",
        stage: "Restructuring Sizing",
        question: "The board wants CloudCore to reach EBITDA breakeven in 18 months. How much cost reduction is required and where should it come from?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "CloudCore Restructuring Target Analysis",
          data: `| Metric | Current | Target (Breakeven) | Required Change |
|---|---|---|---|
| Revenue run-rate (2023E) | $2,016M | $2,016M | 0 (cost-driven fix) |
| Total costs | $2,456M | $1,876M | -$580M (-24%) |
| EBITDA | -$440M | $0 | +$440M |

Cost reduction opportunity by category:
| Category | Current | Benchmark % | Benchmark $ | Excess vs Benchmark |
|---|---|---|---|---|
| R&D | $612M | 20% | $403M | $209M |
| Sales & Marketing | $504M | 22% | $443M | $61M |
| G&A | $414M | 10% | $202M | $212M |
| Cloud Infrastructure | $252M | 9% | $181M | $71M |
| **Total excess vs benchmark** | | | | **$553M** |

Additional context:
- Average fully-loaded cost per employee: $185,000/year
- Real estate cost per employee: $18,000/year
- 12 global office locations, leases ranging from 6 months to 4 years remaining`,
        },
        options: [
          {
            id: "a",
            text: "Cut $580M proportionally across all cost categories — 24% reduction everywhere",
            correct: false,
            explanation: "Proportional cuts ignore where the actual waste is. G&A and infrastructure are the most benchmarkably excessive. Cutting engineering and customer success proportionally would damage the core product and client relationships that drive revenue.",
          },
          {
            id: "b",
            text: "Target $580M in savings from three buckets: G&A to benchmark ($212M excess) + R&D to benchmark ($209M excess, targeting duplicate/redundant teams) + infrastructure optimization ($71M) + S&M efficiency ($61M) = $553M from benchmark gaps, plus additional $27M from real estate. The total exceeds the $580M target — apply savings asymmetrically, protecting customer success and frontline sales",
            correct: true,
            explanation: "Correct. McKinsey's restructuring math: total benchmark excess is $553M, which combined with real estate savings gets you to breakeven. The critical insight is to protect revenue-generating functions (frontline sales, customer success) while cutting support functions aggressively. G&A at $212M excess and R&D duplicate teams at $209M are the two primary levers. This analysis also gives the CEO the precise breakdown needed for board communication.",
          },
          {
            id: "c",
            text: "The restructuring is impossible — $580M in cuts from a $2.5B cost base would destroy the company",
            correct: false,
            explanation: "24% cost reduction is significant but achievable — many tech companies have executed larger restructurings. Meta cut costs by 22% in 2023. The fact that benchmark analysis shows $553M in identifiable excess makes this structurally possible, not destructive.",
          },
          {
            id: "d",
            text: "Focus only on infrastructure ($71M) since it doesn't involve layoffs",
            correct: false,
            explanation: "$71M in infrastructure savings closes only 12% of the $580M gap. A restructuring plan that avoids difficult decisions about workforce is not a restructuring plan — it is delay.",
          },
        ],
      },
      {
        id: "g19q3",
        stage: "Workforce Reduction Design",
        question: "CloudCore must reduce headcount significantly. How should the workforce reduction be designed to minimize damage to the business?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Workforce Reduction Options Analysis",
          data: `| Approach | Headcount Reduction | Annual Savings | Business Risk | Implementation Time |
|---|---|---|---|---|
| A: Across-the-board 24% cut | 1,488 | $275M | High (damages best teams equally) | 4-6 weeks |
| B: Function-targeted (G&A-heavy) | 1,850 (30%) | $342M | Medium | 6-8 weeks |
| C: Productivity-ranked layoffs | 1,550 (25%) | $287M | Low-Medium | 8-12 weeks |
| D: Combination B+C | 2,170 (35%) | $401M | Medium | 8-12 weeks |

Top talent retention analysis:
- Top 10% of engineers generate 3.2x average output (well-documented in tech)
- Cost of replacing a senior engineer: $180-280K (recruiting + ramp time)
- % of top engineers currently at risk of leaving (competitive offers): 34%
- Retention package cost for top 500 engineers: $45M over 18 months

Voluntary separation program:
- 280 employees have expressed interest in voluntary departure
- Average savings per voluntary departure: $195K/year
- Cost: 6 months severance = $28M total`,
        },
        options: [
          {
            id: "a",
            text: "Approach A (across-the-board 24%) — treats everyone equally and avoids the perception of unfairness",
            correct: false,
            explanation: "Across-the-board cuts are perceived as 'fair' but are operationally destructive — they eliminate your best engineers equally with your worst, damage high-performing teams as much as bloated ones, and signal that management cannot differentiate talent quality. McKinsey would never recommend this approach.",
          },
          {
            id: "b",
            text: "Approach D (combination B+C, 35% reduction) with a $45M top talent retention program: function-targeted cuts in G&A (getting to benchmark), plus productivity-ranked cuts in engineering and sales eliminating the lowest-output 15-20%. The retention program for top 500 engineers is critical — the $45M cost is offset by avoiding $90M+ in replacement costs if key engineers leave.",
            correct: true,
            explanation: "Correct. The McKinsey recommendation combines the two best elements: function targeting (removes the structural G&A excess) and productivity ranking (removes low performers while protecting high performers). The retention program is non-negotiable — the top 10% of engineers are the engine of the revenue recovery that makes the restructuring viable. Paying $45M to retain $401M in annual output is obvious math.",
          },
          {
            id: "c",
            text: "Start with the voluntary separation program and only do involuntary cuts if not enough people volunteer",
            correct: false,
            explanation: "Voluntary programs attract the wrong people — often your most employable (and therefore most valuable) employees take voluntary packages because they have the best outside options. Relying on voluntary departures creates adverse selection in the talent pool you retain.",
          },
          {
            id: "d",
            text: "Delay workforce reduction and focus on revenue acceleration to grow into the cost base",
            correct: false,
            explanation: "Revenue growth of 12% vs cost growth of 28% means the gap is widening, not closing. With 18 months to breakeven, waiting on revenue acceleration is not credible — the math requires cost action.",
          },
        ],
      },
      {
        id: "g19q4",
        stage: "Communication Strategy",
        question: "The CEO asks: 'When and how do we communicate the restructuring?' What is the McKinsey recommendation on communication sequencing?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Announce everything simultaneously in a single all-hands meeting to be transparent",
            correct: false,
            explanation: "While transparency is important, announcing everything simultaneously without individual manager preparation creates chaos. Managers learn about their team's fate at the same moment as employees — removing their ability to support their people through the news.",
          },
          {
            id: "b",
            text: "Sequence: (1) Brief board and executive team 1 week in advance; (2) Train all people managers 48 hours in advance on their specific team changes and talking points; (3) Execute all individual notification conversations on the same morning (30-minute window); (4) CEO all-hands announcement same afternoon; (5) Public statement same day. Never let news leak before the simultaneous notification — every day of ambiguity is a day of distraction and attrition.",
            correct: true,
            explanation: "Correct. This is the McKinsey restructuring communication playbook. The 'single day execution' principle is critical — every day between when the decision is made and when it is communicated is a day of rumors, distraction, and preemptive departures of people who don't know if they are affected. Training managers 48 hours in advance (under strict NDA) ensures they can support their teams in the moment. Same-day public statement prevents media speculation.",
          },
          {
            id: "c",
            text: "Announce the restructuring plan first, then figure out exactly who is affected over 60 days",
            correct: false,
            explanation: "This is the worst possible approach — telling employees that significant cuts are coming but not who for 60 days creates 2 months of maximum uncertainty, distraction, and attrition of exactly the people you want to keep (who have the best outside options).",
          },
          {
            id: "d",
            text: "Do the workforce reduction in three tranches over 6 months to allow time for performance assessment",
            correct: false,
            explanation: "Multiple tranches extend the period of organizational uncertainty. The research on restructurings is clear: single-event restructurings recover faster than serial ones. 'Death by a thousand cuts' destroys morale without the certainty that enables recovery.",
          },
        ],
      },
      {
        id: "g19q5",
        stage: "Risk Management",
        question: "What is the single biggest risk to the restructuring plan and how would you mitigate it?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Customer churn during the restructuring — enterprise clients may leave if they perceive CloudCore as unstable",
            correct: false,
            explanation: "Customer churn is a real risk but is manageable through proactive customer communication and ensuring customer success headcount is protected. It is not the most existential risk.",
          },
          {
            id: "b",
            text: "Exodus of top engineering talent who drive the product innovation that will reignite growth — if the restructuring is perceived as eliminating the best engineers as well as the worst, voluntary departures of key talent could make recovery impossible",
            correct: true,
            explanation: "Correct. McKinsey would identify talent risk as the primary restructuring risk. The $45M retention program is the mitigation. But beyond retention packages, the CEO must personally communicate to the top 200 engineers within 72 hours of the announcement — explaining the plan, why they are critical to the recovery, and what the path to growth looks like. Numbers alone don't retain top talent — narrative and leadership conviction do.",
          },
          {
            id: "c",
            text: "Board confidence — if the board loses faith in the CEO during the restructuring, it could accelerate a sale",
            correct: false,
            explanation: "Board management is important but is a governance risk, not the operational risk that could cause the restructuring to fail. A well-executed restructuring with clear metrics typically strengthens board confidence.",
          },
          {
            id: "d",
            text: "Media coverage — negative press about the layoffs could damage CloudCore's employer brand",
            correct: false,
            explanation: "Negative press about tech layoffs is now routine and rarely has lasting business impact. CloudCore's enterprise clients care about product quality and support, not press coverage of restructuring.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 20: BAIN — SPORTS FRANCHISE VALUATION (HARD)
  // ─────────────────────────────────────────────
  {
    id: "g20",
    title: "GoalKeeper Capital: Football Club Acquisition",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "bain",
    estimatedMinutes: 35,
    overview: "A US private equity firm wants to acquire a Premier League football club. Bain has been engaged to evaluate the investment thesis and recommend a valuation.",
    clientBackground: "GoalKeeper Capital is a $12B AUM PE firm that has never invested in sports. They are evaluating an acquisition of Riverside FC, a mid-table Premier League club based in London. The seller (a Middle Eastern sovereign wealth fund) is asking £850M. Riverside FC generates £180M in annual revenue, has £290M in player squad value (net book value), and plays in a stadium with 42,000 capacity at 94% average occupancy.",
    yourRole: "You are a Bain manager on the consumer and retail practice covering entertainment and sports. This is a novel asset class for your team — you need to advise on both valuation methodology and strategic value creation.",
    finalRecommendationPrompt: "Should GoalKeeper Capital acquire Riverside FC at £850M? What is the investment thesis and what are the key value creation levers?",
    idealRecommendation: "GoalKeeper Capital should acquire Riverside FC at £850M — it represents fair to slightly favorable value given the asset class characteristics. Valuation basis: 4.7x revenue is below the Premier League median of 5.5-6x; comparable transactions (Boehly/Chelsea at 7x, INEOS/Manchester United at 5.2x) support the £850M price. Investment thesis: (1) Revenue diversification — Riverside generates only 42% of revenue from commercial/sponsorship vs 65% for elite clubs, representing £85M+ in near-term commercial opportunity; (2) Stadium expansion — expanding from 42K to 55K capacity (precedent: Tottenham at 62K) would add £35M+ annually; (3) Women's team and US media rights growth — structural tailwinds in both. Key risks: relegation (would reduce value 40-50%), player cost inflation, and regulatory risk from Premier League financial rules. Recommend acquisition with board seat, focus on commercial development, and 7-10 year hold.",
    keyTakeaways: [
      "Sports franchises are valued on revenue multiples, not EBITDA, because player investment cycles create lumpy earnings",
      "Relegation risk is the binary downside event that must be stress-tested in any football club investment",
      "Commercial revenue (sponsorship, licensing, brand) is the primary value creation lever in sports — broadcasting rights are set by the league",
      "Stadium capacity is a fixed asset constraint on matchday revenue that requires significant capex to expand",
    ],
    questions: [
      {
        id: "g20q1",
        stage: "Asset Class Understanding",
        question: "GoalKeeper Capital has never invested in sports. Before evaluating the specific deal, how should you frame the unique characteristics of sports franchise investing?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "Sports franchises are like any other consumer business — analyze revenue, costs, and EBITDA",
            correct: false,
            explanation: "This framing misses the unique characteristics of sports franchises: player cost structures create lumpy and hard-to-predict EBITDA; brand value is partly correlated with on-pitch performance (unpredictable); revenue streams have unique league-level distribution rules; and the asset is fundamentally a monopoly in its local market.",
          },
          {
            id: "b",
            text: "Sports franchises have four unique characteristics: (1) Revenue is partly performance-dependent (prize money, European competition); (2) The largest cost (player wages/amortization) is quasi-fixed and rises with competition; (3) Valuation is done on revenue multiples not EBITDA due to lumpy investment cycles; (4) Appreciation is structurally built in — the number of Premier League clubs is fixed at 20, creating artificial scarcity",
            correct: true,
            explanation: "Correct. Bain would educate the client on asset class characteristics before analysis. The fixed supply of Premier League clubs (20 forever) is the most important structural characteristic — it creates predictable long-term appreciation regardless of individual club performance. This is why Sheikh Mansour paid £210M for Manchester City in 2008 (now worth £4-5B). Revenue multiples (not EBITDA) are the right valuation methodology because player amortization makes EBITDA unreliable across different investment philosophies.",
          },
          {
            id: "c",
            text: "Sports franchises are speculative assets and not suitable for institutional PE investment",
            correct: false,
            explanation: "This is factually incorrect — KKR, ADIA, PIMCO, Ares, and many major institutional investors have acquired sports franchises in recent years. The asset class has become mainstream institutional.",
          },
          {
            id: "d",
            text: "The key metric for sports franchises is win-loss record — better performance = higher value",
            correct: false,
            explanation: "While performance affects some revenue streams, the most successful sports investors (Manchester City, PSG) have created value through commercial development and stadium investment, not purely by winning. The asset value is primarily driven by commercial revenue, brand, and stadium — not league position alone.",
          },
        ],
      },
      {
        id: "g20q2",
        stage: "Valuation",
        question: "Is £850M a fair price for Riverside FC? Analyze the comparable transactions and financial data.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Riverside FC Valuation Analysis",
          data: `| Riverside FC Financial Data | Value |
|---|---|
| Annual revenue | £180M |
| Revenue breakdown: Broadcasting | £72M (40%) |
| Revenue breakdown: Matchday | £54M (30%) |
| Revenue breakdown: Commercial | £54M (30%) |
| EBITDA (before player amortization) | £22M |
| Player squad net book value | £290M |
| Stadium value (freehold) | £180M |
| Annual wage bill | £145M |
| Wage-to-revenue ratio | 81% |
| Net debt | £85M |
| Implied enterprise value (£850M offer) | £935M (£850M equity + £85M debt) |
| EV/Revenue multiple | 5.2x |

Comparable Premier League Transactions:
| Club | Year | EV | Revenue at Time | EV/Revenue |
|---|---|---|---|---|
| Chelsea FC | 2022 | £4.25B | £481M | 8.8x |
| Manchester United | 2023 | £5.0B | £648M | 7.7x |
| Liverpool (partial) | 2023 | £2.8B (implied) | £593M | 4.7x |
| Everton | 2023 | £0.5B | £171M | 2.9x |
| Bournemouth | 2022 | £0.15B | £142M | 1.1x |
| **Median (excl outliers)** | | | | **5.5x** |`,
        },
        options: [
          {
            id: "a",
            text: "£850M is overpriced — Riverside FC should be valued at Everton's multiple (2.9x) = £522M",
            correct: false,
            explanation: "Everton's 2.9x multiple reflects a club in significant financial distress with a points deduction penalty — not comparable to a stable mid-table club. Using the lowest comparable to justify a lower price ignores the selection of the most relevant comparable.",
          },
          {
            id: "b",
            text: "£850M (5.2x EV/Revenue) is fair to slightly favorable. It is below the median comparable at 5.5x. The £935M EV vs £470M in tangible assets (£290M squad + £180M stadium) implies £465M in intangible brand/franchise value — reasonable for a Premier League club. The seller's price is not a steal but is not aggressive.",
            correct: true,
            explanation: "Correct. Bain's valuation conclusion: 5.2x is below the 5.5x median, so the price is fair or slightly below market. The tangible asset backing (£470M) provides some downside protection — in a distressed sale, hard assets set a floor. The intangible premium (£465M) is within the range of Premier League clubs of Riverside's tier. The recommendation is that the price is acceptable and the debate should shift to value creation potential.",
          },
          {
            id: "c",
            text: "£850M is a bargain — Chelsea was valued at 8.8x and Riverside should be worth more",
            correct: false,
            explanation: "Chelsea and Manchester United are globally recognized brands in the top 5 clubs by revenue and fanbase — they deserve premium multiples. Riverside FC at £180M revenue should not be valued at Chelsea multiples. Comps must be adjusted for club quality tier.",
          },
          {
            id: "d",
            text: "The wage-to-revenue ratio of 81% makes the investment unviable regardless of price",
            correct: false,
            explanation: "81% wage-to-revenue ratio is high (Premier League average ~60%) but not unusual for a mid-table club competing above its natural financial level. This is a value creation opportunity (reducing to 70% would add £18M in annual EBITDA) not a disqualifying feature.",
          },
        ],
      },
      {
        id: "g20q3",
        stage: "Value Creation",
        question: "GoalKeeper Capital wants to understand the value creation opportunity beyond the base case. Which commercial development opportunity is highest priority?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Riverside FC Value Creation Opportunities",
          data: `| Initiative | Investment | Annual Revenue Uplift | Implementation | Precedent |
|---|---|---|---|---|
| Commercial/sponsorship development | £12M | £45-65M | 2-3 years | Arsenal (doubled sponsorship 2015-2020) |
| Stadium expansion (42K → 55K) | £280M | £35-45M | 4-5 years | Tottenham (new stadium £1B, +£80M/year) |
| Women's team development | £8M/year | £4-8M + brand value | 3-5 years | Chelsea Women (now top-3 revenue globally) |
| US media rights and brand investment | £15M | £12-20M | 2-3 years | Wrexham (Ryan Reynolds, 3x revenue) |
| Youth academy monetization | £5M | £20-40M (player sales) | 5-10 years | Southampton (selling £400M+ in players) |
| Esports and gaming | £3M | £5-8M | 1-2 years | Manchester City (various gaming deals) |

Current commercial revenue benchmarking:
| Club Tier | Average Commercial Revenue | As % of Total | Riverside Gap |
|---|---|---|---|
| Top 6 clubs | £280M | 65% | N/A |
| Mid-table (Riverside's tier) | £85M | 47% | £31M gap |
| Riverside FC actual | £54M | 30% | £31M below mid-table average |`,
        },
        options: [
          {
            id: "a",
            text: "Stadium expansion — the £35-45M annual revenue uplift is the largest single initiative",
            correct: false,
            explanation: "Stadium expansion requires £280M investment over 4-5 years — a massive capital commitment on top of the £850M acquisition price. This is a long-term value creation lever, not the first priority. Also, the 4-5 year timeline means it does not contribute to early-period returns.",
          },
          {
            id: "b",
            text: "Commercial/sponsorship development is highest priority: it costs only £12M, generates £45-65M annually (within 2-3 years), and Riverside is 30pp below comparable clubs on commercial revenue share (30% vs 47% mid-table average). This single initiative could add £300-400M to club valuation at a 5-6x revenue multiple.",
            correct: true,
            explanation: "Correct. Bain would prioritize the initiative with the best return on invested capital and fastest time to impact. Commercial development: £12M investment for £55M mid-point revenue = 4.6x revenue multiple uplift. At 5.5x EV/Revenue, £55M in new commercial revenue = £302M in enterprise value creation against £12M investment = 25x ROIC. The gap analysis (Riverside at 30% commercial vs 47% mid-table average) identifies a concrete, benchmarkable opportunity — not aspirational.",
          },
          {
            id: "c",
            text: "US media rights — the Wrexham precedent shows massive brand value creation potential",
            correct: false,
            explanation: "Wrexham's success (Ryan Reynolds personal brand + TV documentary) is not replicable for most clubs. The £12-20M annual revenue uplift from US media investment is real but smaller than commercial sponsorship opportunity.",
          },
          {
            id: "d",
            text: "Youth academy — £400M in potential player sales over 10 years is the highest total return",
            correct: false,
            explanation: "Youth academy returns are real but 5-10 year timelines with highly uncertain outcomes (player development is inherently speculative) make this a poor first priority for a PE investor with a 7-10 year hold period.",
          },
        ],
      },
      {
        id: "g20q4",
        stage: "Downside Risk",
        question: "The board asks: 'What happens to our investment if Riverside gets relegated to the Championship?' Quantify the downside.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Relegation Impact Analysis",
          data: `| Revenue Stream | Premier League | Championship (Year 1) | Change |
|---|---|---|---|
| Broadcasting (PL distribution) | £72M | £8M | -£64M |
| Broadcasting (parachute payment) | £0 | £44M | +£44M |
| Matchday (occupancy assumption) | £54M | £41M | -£13M |
| Commercial (sponsor step-down clauses) | £54M | £35M | -£19M |
| **Total Revenue** | **£180M** | **£128M** | **-£52M (-29%)** |
| **EBITDA impact (before player cost adjustment)** | **£22M** | **-£28M** | **-£50M** |

Comparable relegated club valuations:
| Club | Value pre-relegation | Value post-relegation | Change |
|---|---|---|---|
| Sheffield United | £155M | £70M | -55% |
| Burnley | £180M | £90M | -50% |
| Leicester City | £520M | £280M | -46% |
| **Average** | | | **-50%** |

Premier League relegation statistics:
- Average number of clubs relegated per season: 3 (out of 20)
- Riverside FC current odds of relegation (bookmaker consensus): 18%
- Probability of consecutive seasons avoiding relegation (5 years): 42%`,
        },
        options: [
          {
            id: "a",
            text: "Relegation risk is manageable — parachute payments protect revenue in the short term",
            correct: false,
            explanation: "Parachute payments recover £44M of the £64M broadcasting loss — not full protection. The net revenue decline is still £52M (-29%). More importantly, sponsor step-down clauses (-£19M) and matchday decline show the parachute only partially cushions the blow.",
          },
          {
            id: "b",
            text: "Relegation would reduce club value approximately 46-50% (to £425-459M) based on comparable transactions — representing a £391-425M loss on the £850M acquisition price. With 18% annual relegation risk, the probability of at least one relegation event over a 7-year hold is 71%. This is the most significant investment risk and must be mitigated through squad investment strategy and manager selection.",
            correct: true,
            explanation: "Correct. The probability math: P(relegated at least once in 7 years) = 1 - (1-0.18)^7 = 1 - (0.82)^7 = 1 - 0.24 = 76%. This is not a tail risk — it is a likely event over a 7-year hold. Bain would present this starkly to the board and recommend: (1) ensuring the acquisition price reflects relegation risk; (2) structuring investment tranches with squad investment tied to league position; (3) monitoring relegation odds as an early warning system.",
          },
          {
            id: "c",
            text: "Relegation risk is priced in — that's why Riverside trades at a discount to top-6 clubs",
            correct: false,
            explanation: "Relegation risk explains part of the discount but the full financial impact ($425M+ potential loss) must be explicitly modeled and presented to the board, not dismissed as 'already priced in.'",
          },
          {
            id: "d",
            text: "GoalKeeper Capital should invest in better players to eliminate relegation risk",
            correct: false,
            explanation: "Player investment can reduce relegation risk but cannot eliminate it. More importantly, increased player spend raises the wage bill (already at 81% of revenue) and directly reduces EBITDA. The relationship between spend and performance in football is positive but highly uncertain.",
          },
        ],
      },
      {
        id: "g20q5",
        stage: "Final Recommendation",
        question: "GoalKeeper Capital's IC asks for a final go/no-go with expected returns. What is your recommendation?",
        type: "multiple_choice",
        options: [
          {
            id: "a",
            text: "No-go — 76% probability of at least one relegation event makes this too risky for institutional PE",
            correct: false,
            explanation: "The binary risk framing ignores: (1) parachute payments substantially cushion relegation revenue impact; (2) clubs typically return to the Premier League within 2-3 years; (3) the 7-10 year hold means the base value trajectory still points up due to structural scarcity and commercial development. A 76% probability of a temporary setback is not the same as a 76% probability of permanent value loss.",
          },
          {
            id: "b",
            text: "Go — at £850M (5.2x revenue, below 5.5x median), with £45-65M commercial revenue upside (valued at £247-357M at 5.5x), and structural appreciation driven by fixed supply of Premier League licenses. Base case IRR: 18-22% over 7 years. Bear case (one relegation, 2-year Championship): IRR 8-11%. Both scenarios clear GoalKeeper Capital's 8% hurdle rate.",
            correct: true,
            explanation: "Correct. Bain's final recommendation frames the return range. Base case: £850M acquisition, commercial development adds £300M in value, structural appreciation adds £400M (22% revenue growth at 5.5x multiple), exit at £1.55B = 8.6% annual return plus dividends. With financial leverage, IRR approaches 18-22%. Bear case: relegation depresses value to £430M for 2 years then recovers, dragging IRR to 8-11% — still above hurdle. The recommendation is go, with the risk mitigation being the commercial development strategy that reduces dependence on on-pitch performance.",
          },
          {
            id: "c",
            text: "Go — but only if GoalKeeper Capital can negotiate the price down to £650M",
            correct: false,
            explanation: "£650M (3.6x revenue) would be a 35% discount to the asking price and well below market comparables. The seller (a sovereign wealth fund) is unlikely to accept a 35% haircut. A recommendation contingent on an unrealistic price negotiation is not actionable.",
          },
          {
            id: "d",
            text: "Pass on Riverside FC and evaluate acquiring a Championship club instead for lower entry price",
            correct: false,
            explanation: "Championship clubs lack the Premier League broadcasting rights that make football investment attractive — they earn £8M vs £72M in broadcasting. A Championship club at lower price is not equivalent to a Premier League club with structural broadcasting revenue.",
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────
  // CASE 21: LEK — BIOTECH INVESTMENT THESIS (HARD)
  // ─────────────────────────────────────────────
  {
    id: "g21",
    title: "NovaBio: Pre-IPO Investment Assessment",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "lek",
    estimatedMinutes: 35,
    overview: "A healthcare-focused PE firm wants L.E.K. to evaluate a $450M pre-IPO investment in NovaBio, a clinical-stage biotech with a breakthrough oncology platform.",
    clientBackground: "NovaBio is a 7-year-old Cambridge, MA biotech with a proprietary CAR-T cell therapy platform targeting solid tumors — historically the hardest cancer type for cell therapy to address. Their lead program (NB-101) is in Phase 2 clinical trials with breakthrough therapy designation from the FDA. Phase 1 data showed 62% objective response rate (vs 15% for standard of care) in advanced pancreatic cancer. They have $180M in cash (18-month runway) and are seeking $450M to fund Phase 3 trials and pre-commercialization activities. The PE firm would receive a 25% ownership stake at a $1.8B pre-money valuation.",
    yourRole: "You are an L.E.K. manager on the healthcare and life sciences practice. You have 4 weeks to deliver a go/no-go investment recommendation with full financial analysis to the PE firm's IC.",
    finalRecommendationPrompt: "Should the PE firm invest $450M in NovaBio at a $1.8B valuation? What is the risk-adjusted return analysis?",
    idealRecommendation: "Invest with conditions. The scientific opportunity is exceptional — 62% ORR in solid tumor CAR-T is genuinely breakthrough and the pancreatic cancer market ($4.2B potential peak sales) at a 15% royalty implies significant value if Phase 3 succeeds. Risk-adjusted valuation using probability-weighted outcomes: 45% probability of Phase 3 success × $8.5B peak value = $3.8B expected value vs $1.8B entry = 2.1x expected return. IRR: 25-32% over 5-7 years to exit (IPO or acquisition). Conditions: (1) Independent scientific advisory board review of Phase 2 data; (2) Manufacturing partnership secured before investment close (NovaBio lacks commercial manufacturing capability); (3) CMO hire committed. Key risks: Phase 3 failure (most likely 55% scenario), manufacturing scale-up, and competitive risk from Novartis/BMS who have dominant CAR-T platforms.",
    keyTakeaways: [
      "Biotech investing requires probability-weighted return analysis — the binary nature of clinical outcomes makes simple DCF inappropriate",
      "Phase 2 to Phase 3 success rates in oncology average 40-55% — Phase 3 failure is the most likely single outcome",
      "Manufacturing capability is often the underappreciated constraint for cell therapy companies — CAR-T manufacturing is extraordinarily complex",
      "Breakthrough therapy designation from FDA is a meaningful positive signal but does not guarantee approval",
    ],
    questions: [
      {
        id: "g21q1",
        stage: "Scientific Assessment",
        question: "NovaBio's Phase 1 data shows 62% objective response rate in pancreatic cancer vs 15% for standard of care. How do you interpret this for investment purposes?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "NovaBio Clinical Data vs Benchmarks",
          data: `| Metric | NovaBio NB-101 | Standard of Care | Best-in-Class CAR-T (liquid tumors) |
|---|---|---|---|
| Objective Response Rate (ORR) | 62% | 15% | 82% |
| Complete Response Rate | 28% | 3% | 44% |
| Median Duration of Response | 8.2 months | 3.4 months | 14.6 months |
| 12-month survival | 52% | 24% | 68% |
| Patient population (Phase 1) | n=29 | Historical | Historical |
| Adverse events (Grade 3-4) | 31% | 22% | 48% |
| FDA Breakthrough Therapy Designation | Yes | N/A | N/A |

Clinical context:
- Pancreatic cancer 5-year survival rate: 12% (one of lowest of any cancer)
- Current standard of care: Gemcitabine + nab-paclitaxel (approved 2013)
- No new standard of care approved since 2013
- CAR-T has never achieved significant response rates in solid tumors (prior attempts: <20% ORR)
- Phase 2 currently enrolling (n=120, results expected 18 months)
- Phase 3 would require n=400+, estimated cost $280-320M`,
        },
        options: [
          {
            id: "a",
            text: "The 62% ORR is definitive proof of efficacy — this is a slam dunk investment",
            correct: false,
            explanation: "n=29 in Phase 1 is a very small sample size. Phase 1 is designed to assess safety and dosing, not efficacy. 62% ORR is highly promising but Phase 1 results have a well-documented tendency to look better than Phase 3 results due to: patient selection bias, small sample size, and optimal dosing conditions that may not replicate at scale.",
          },
          {
            id: "b",
            text: "The 62% ORR is scientifically exceptional (4x standard of care) and breakthrough therapy designation confirms FDA's view of the data, but n=29 is insufficient to draw definitive conclusions. The investment case requires Phase 2 data (n=120) before high conviction is possible. The current data justifies a significant but risk-adjusted investment.",
            correct: true,
            explanation: "Correct. L.E.K. would present a balanced scientific assessment. The data is genuinely impressive — 62% ORR in solid tumor CAR-T would be the first significant achievement in a space where multiple large companies have failed. FDA breakthrough designation confirms the agency sees the same signal. However, Phase 1 n=29 with 18 months median follow-up is early. The intellectually honest position: very promising, but the Phase 2 result (18 months away) is the real valuation catalyst. Investment now is buying optionality on Phase 2 success.",
          },
          {
            id: "c",
            text: "The 31% Grade 3-4 adverse event rate is too high — the safety profile is unacceptable",
            correct: false,
            explanation: "31% Grade 3-4 adverse events is actually better than best-in-class CAR-T (48%) and is within the range expected for aggressive oncology treatments in end-stage cancer patients. Safety must be contextualized by disease severity — in stage 4 pancreatic cancer with 24% 12-month survival, higher toxicity thresholds are acceptable.",
          },
          {
            id: "d",
            text: "Waiting for Phase 2 results before investing is the right approach",
            correct: false,
            explanation: "Waiting for Phase 2 results means investing after the major catalyst — the valuation will likely be $4-6B post-Phase 2 success vs $1.8B now. Pre-Phase 2 is the value creation window. The question is whether the risk-adjusted return at $1.8B is sufficient, not whether to wait.",
          },
        ],
      },
      {
        id: "g21q2",
        stage: "Market Sizing",
        question: "If NB-101 is approved, what is the peak sales potential? Analyze the following market data.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "NB-101 Commercial Opportunity Analysis",
          data: `| Market Parameter | Value | Notes |
|---|---|---|
| Annual pancreatic cancer diagnoses (US) | 64,000 | Stage 3-4 (addressable): 48,000 |
| % eligible for CAR-T therapy | 35% | Based on biomarker + performance status criteria |
| Treatment penetration (year 5 after launch) | 45% | Based on Kymriah/Yescarta penetration curves |
| Expected list price per treatment course | $450,000 | Based on approved CAR-T therapies |
| Net price after rebates/discounts | $320,000 | Typical 25-30% discount to list |
| Peak year sales (US only) | ~$2.2B | 48K × 35% eligible × 45% penetration × $320K |
| Ex-US market (EU + Japan, Year 5) | ~$1.4B | 60% of US market (regulatory lag) |
| **Peak global sales potential** | **~$3.6B** | |
| Probability of Phase 3 success (oncology benchmark) | 45% | Historical P2→P3 success rate in oncology |
| Probability of FDA approval given P3 success | 85% | With breakthrough designation |
| Combined probability of approval | 38% | 45% × 85% |`,
        },
        options: [
          {
            id: "a",
            text: "Peak sales of $3.6B makes this a blockbuster drug — invest immediately at any valuation",
            correct: false,
            explanation: "Peak sales potential must be probability-weighted. $3.6B peak sales × 38% probability of approval = $1.37B risk-adjusted peak sales. This is the number that should anchor valuation, not the undiscounted peak.",
          },
          {
            id: "b",
            text: "Risk-adjusted peak sales: $3.6B × 38% probability of approval = $1.37B expected peak sales. At a 4x peak sales multiple (standard pharma valuation), risk-adjusted value = $5.5B. Entry at $1.8B provides 3x upside in the success scenario, but the 62% failure probability means expected return analysis is essential.",
            correct: true,
            explanation: "Correct. L.E.K. uses probability-weighted valuation for biotech. The $3.6B peak sales is the success scenario value — you must weight it by the 38% probability. The 4x peak sales multiple is standard for oncology assets. $3.6B × 4x = $14.4B in the success scenario × 38% probability = $5.5B expected value vs $1.8B entry = 3.1x expected multiple. This is the core investment math.",
          },
          {
            id: "c",
            text: "The $450K list price is too high — payers will not reimburse this for a cancer with poor prognosis",
            correct: false,
            explanation: "Kymriah is priced at $475K and Yescarta at $373K — CAR-T pricing precedent supports $450K for a solid tumor indication. Pancreatic cancer prognosis makes payers MORE likely to approve expensive treatments (no alternatives), not less. FDA breakthrough designation also creates pricing leverage.",
          },
          {
            id: "d",
            text: "NovaBio should license the technology to a large pharma company rather than developing it independently",
            correct: false,
            explanation: "Licensing is a strategic option for NovaBio's management to consider, but from the PE investor perspective, licensing would significantly reduce the value creation opportunity. A Phase 3-ready asset with breakthrough designation would license for $200-400M — far below the Phase 3 + commercialization equity value.",
          },
        ],
      },
      {
        id: "g21q3",
        stage: "Manufacturing Risk",
        question: "The IC asks: 'What do we know about NovaBio's manufacturing capability?' This question reveals a critical gap. What is the manufacturing risk in CAR-T?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "CAR-T Manufacturing Reality Check",
          data: `| Manufacturing Parameter | NovaBio Current Status | Commercial Requirement | Gap |
|---|---|---|---|
| Manufacturing facility | None (contract with academic center) | FDA-approved GMP facility | Critical |
| Batch success rate | 78% | 95%+ | Significant |
| Vein-to-vein time (patient to treatment) | 28 days | Target: 14-18 days | Significant |
| Cost per treatment (manufacturing only) | $180,000 | Target: $80,000 | Major |
| Scalable to 1,000 patients/year | No | Yes (need 16,000+/year at peak) | Critical |
| CDMOs capable of CAR-T at scale | 3 globally | N/A | Constrained supply |

Comparator: Novartis Kymriah launch (2017)
- Manufacturing failures delayed treatment for 40% of patients in first year
- Required 18-month manufacturing remediation post-approval
- Cost Novartis $500M+ in manufacturing investment beyond initial estimates
- Almost caused FDA to withdraw approval in 2018`,
        },
        options: [
          {
            id: "a",
            text: "Manufacturing risk is a technical problem the company can solve with money",
            correct: false,
            explanation: "The Kymriah precedent shows manufacturing is not just a money problem — it is a 2-3 year expertise and infrastructure problem. The three global CDMOs capable of CAR-T at scale are a binding constraint. Even with unlimited capital, you cannot scale CAR-T manufacturing faster than the expert infrastructure allows.",
          },
          {
            id: "b",
            text: "CAR-T manufacturing is the most underappreciated risk in this investment. Current cost ($180K/treatment manufacturing cost) must fall to $80K to be commercially viable at $320K net price. Kymriah's manufacturing failures post-approval nearly destroyed the Novartis program. NovaBio must secure a CDMO partnership with one of the 3 global-scale manufacturers BEFORE the investment closes — this should be a hard condition of investment.",
            correct: true,
            explanation: "Correct. L.E.K.'s manufacturing risk analysis: at $180K manufacturing cost vs $320K net price, gross margin is 44% — barely above minimum viability. The $80K target requires a 56% cost reduction that requires scale (16,000 patients/year) and process optimization that takes years. More critically, the Kymriah precedent shows this is an existential risk — FDA nearly withdrew approval due to manufacturing failures. The hard condition (CDMO partnership before close) is the right mitigation.",
          },
          {
            id: "c",
            text: "NovaBio should build its own manufacturing facility — outsourcing is too risky",
            correct: false,
            explanation: "Building proprietary CAR-T manufacturing from scratch would cost $300-500M and take 3-4 years — consuming most of the investment capital and delaying commercialization by years. Partnering with an established CDMO is faster and requires less capital.",
          },
          {
            id: "d",
            text: "Manufacturing is a commercialization problem — it shouldn't affect the Phase 3 investment decision",
            correct: false,
            explanation: "Manufacturing is a Phase 3 problem too — the FDA requires that commercial manufacturing processes are established and validated as part of the BLA (Biologics License Application). A company that reaches Phase 3 approval without commercial manufacturing will face a 2-3 year delay to approval, significantly reducing the investment value.",
          },
        ],
      },
      {
        id: "g21q4",
        stage: "Competitive Landscape",
        question: "NovaBio claims they have the first solid tumor CAR-T. How do you assess the competitive threat from Novartis, BMS, and other large pharma companies?",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "Competitive Landscape: Solid Tumor CAR-T",
          data: `| Company | Program | Target | Stage | ORR (Best Result) | Notes |
|---|---|---|---|---|---|
| NovaBio | NB-101 | MSLN (solid tumors) | Phase 2 | 62% | Pancreatic cancer, n=29 |
| Novartis | CART-GPC3 | GPC3 (liver cancer) | Phase 2 | 24% | Different indication |
| BMS/Celgene | BMS-986340 | EGFR (NSCLC) | Phase 1 | 18% | Lung cancer |
| Arcus Biosciences | AB-101 | MSLN | Phase 1 | 31% | Same target as NovaBio |
| Tmunity/Penn | TMU-101 | PSCA | Phase 1 | 15% | Prostate cancer |
| Legend Biotech | LB-CAR | CLDN18.2 | Phase 2 | 41% | Gastric cancer |

NovaBio's competitive position:
- First solid tumor CAR-T to show >60% ORR
- Patent protection: Core CAR construct patented until 2038
- 3 published peer-reviewed papers confirming mechanism
- Arcus targeting same antigen (MSLN) — potential head-to-head competition
- Large pharma have failed solid tumor CAR-T 8 times in last 5 years
- If NovaBio succeeds, expect large pharma to acquire rather than compete`,
        },
        options: [
          {
            id: "a",
            text: "Arcus Biosciences targeting the same antigen (MSLN) is a direct competitive threat that invalidates the investment",
            correct: false,
            explanation: "Arcus's 31% ORR vs NovaBio's 62% ORR suggests NovaBio has a superior product even targeting the same antigen. In oncology, efficacy differences of this magnitude typically result in market leadership for the better drug. Different technologies targeting the same antigen is competitive, not fatal.",
          },
          {
            id: "b",
            text: "NovaBio's competitive moat is strong: 62% ORR is 2x Arcus (same target), core patents run to 2038, large pharma has failed in solid tumor CAR-T 8 times suggesting NovaBio has a genuinely differentiated approach. If Phase 3 succeeds, the most likely outcome is acquisition by large pharma (Novartis, BMS, Pfizer) at 5-8x peak sales multiple — making this a strategic acquisition target, not a standalone commercial company.",
            correct: true,
            explanation: "Correct. L.E.K. would identify acquisition as the most probable exit pathway. Large pharma companies that have failed in solid tumor CAR-T (Novartis, BMS) would pay premium multiples for a Phase 3-ready validated program. Precedent: Novartis paid $8.7B for AveXis (Phase 3 gene therapy). BMS paid $74B for Celgene (CAR-T portfolio). At 5-8x peak sales ($3.6B), acquisition value range would be $18-29B — well above the $1.8B entry. The patent protection to 2038 supports this thesis.",
          },
          {
            id: "c",
            text: "Large pharma's 8 prior failures in solid tumor CAR-T suggest this approach doesn't work — NovaBio may be misleading investors",
            correct: false,
            explanation: "Prior failures validate why NovaBio's result is exciting, not suspicious. Each prior attempt used different targets, constructs, and patient populations. NovaBio's 62% ORR with FDA breakthrough designation has been independently reviewed — accusing them of fraud without evidence is not analytical.",
          },
          {
            id: "d",
            text: "NovaBio should partner with Novartis immediately to accelerate commercialization",
            correct: false,
            explanation: "Partnering with Novartis at Phase 2 would severely cap the equity upside for investors. The entire investment thesis is based on maintaining independence through Phase 3 and exiting via acquisition or IPO at a much higher valuation. Early partnership would undermine the investment case.",
          },
        ],
      },
      {
        id: "g21q5",
        stage: "Investment Decision",
        question: "Build the probability-weighted return analysis and give a final recommendation.",
        type: "exhibit",
        exhibit: {
          type: "table",
          title: "NovaBio Investment Scenario Analysis",
          data: `| Scenario | Probability | Description | Exit Value | PE Firm Value (25%) |
|---|---|---|---|---|
| Phase 3 success + FDA approval + strategic acquisition | 32% | Acquired by large pharma at 6x peak sales ($3.6B) | $21.6B | $5.4B |
| Phase 3 success + FDA approval + IPO | 13% | IPO at 4x peak sales, PE sells over 3 years | $14.4B | $3.6B |
| Phase 2 positive → large pharma partnership/acquisition | 20% | Phase 2 data triggers acquisition pre-Phase 3 | $4.5B | $1.1B |
| Phase 3 failure → asset sale/licensing | 25% | Technology licensed to multiple companies | $0.6B | $150M |
| Complete failure (no salvage value) | 10% | Phase 3 fails, no licensable IP | $0 | $0 |

Investment: $450M for 25% stake at $1.8B pre-money ($2.25B post-money)
Expected PE firm value: probability-weighted sum of scenarios above`,
        },
        options: [
          {
            id: "a",
            text: "The 35% probability of failure scenarios (complete failure + asset sale) makes this uninvestable",
            correct: false,
            explanation: "35% probability of adverse outcomes is normal for clinical-stage biotech. The expected value calculation is what matters, not binary outcome framing. You must calculate the probability-weighted return to assess the investment.",
          },
          {
            id: "b",
            text: "Expected value: (32% × $5.4B) + (13% × $3.6B) + (20% × $1.1B) + (25% × $150M) + (10% × $0) = $1,728M + $468M + $220M + $37.5M + $0 = $2.45B expected return on $450M investment = 5.5x expected MOIC. IRR depends on exit timing but at 5-7 years = 28-40% IRR. Recommend investment with manufacturing partnership condition.",
            correct: true,
            explanation: "Correct. L.E.K.'s probability-weighted analysis: $2.45B expected value on $450M = 5.5x expected MOIC. This is an excellent expected return profile even accounting for the high probability of failure scenarios. The analysis also reveals that the Phase 2 acquisition scenario (20% probability) provides meaningful downside protection — even if Phase 3 doesn't happen, a Phase 2 success triggers acquisition above investment value ($1.1B vs $450M). Recommendation: invest with manufacturing condition, as this de-risks the most existential commercial risk.",
          },
          {
            id: "c",
            text: "The expected return is too uncertain to recommend — wait for Phase 2 results",
            correct: false,
            explanation: "Post-Phase 2 success, the valuation will be $4-8B — the 5.5x expected MOIC disappears. Pre-Phase 2 at $1.8B is precisely when the risk-adjusted opportunity is best. 'Too uncertain' is not a meaningful objection when you have probability-weighted analysis showing 5.5x expected return.",
          },
          {
            id: "d",
            text: "Invest only $200M (not the full $450M) to limit downside exposure",
            correct: false,
            explanation: "Investing $200M instead of $450M would give only 11% ownership instead of 25%. The investment thesis requires a meaningful ownership stake to generate adequate absolute returns — 11% of $21.6B = $2.4B vs 25% = $5.4B. Half the commitment for half the return is not a valid risk mitigation.",
          },
        ],
      },
    ],
  },
];