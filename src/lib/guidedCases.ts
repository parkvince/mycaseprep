export interface Exhibit {
  type: "table" | "chart" | "text";
  title: string;
  data: string;
}

export interface BranchOption {
  id: string;
  text: string;
  nextQuestionId: string | "end";
  scoreImpact: number; // -20 to +20
  feedback: string; // shown after selection, before next question
}

export interface BranchQuestion {
  id: string;
  stage: string;
  question: string;
  context?: string;
  exhibit?: Exhibit;
  options: BranchOption[];
}

export interface GuidedCase {
  id: string;
  title: string;
  type: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  firm: string;
  estimatedMinutes: number;
  overview: string;
  clientBackground: string;
  yourRole: string;
  questions: BranchQuestion[];
  startQuestionId: string;
  finalRecommendationPrompt: string;
  idealRecommendation: string;
  keyTakeaways: string[];
}

export const GUIDED_CASES: GuidedCase[] = [
  // ─────────────────────────────────────────────────────────────
  // CASE G1: MCKINSEY — BREWCO PROFITABILITY (BEGINNER, 6 nodes)
  // ─────────────────────────────────────────────────────────────
  {
    id: "g1",
    title: "BrewCo Profitability Crisis",
    type: "profitability",
    difficulty: "beginner",
    firm: "mckinsey",
    estimatedMinutes: 25,
    overview: "A mid-sized US coffee chain has seen its profit margin cut in half over two years despite growing revenue. McKinsey has been engaged to diagnose the issue.",
    clientBackground: "BrewCo operates 300 locations across the US. Revenue has grown 12% over two years from $420M to $470M. However, net profit margin has fallen from 18% to 6%. The CEO believes competition is the cause. The CFO thinks costs are out of control. You have been asked to lead the diagnostic workstream.",
    yourRole: "You are a McKinsey associate on your first week of the engagement. The partner has asked you to lead the diagnostic and present findings at the end of the week.",
    startQuestionId: "q1",
    finalRecommendationPrompt: "Based on the path you took through this case, give your top recommendation to BrewCo's CEO. Be specific about the single most important action in the next 90 days.",
    idealRecommendation: "BrewCo should immediately launch a labor scheduling optimization program targeting the 100 new locations that are operating at 35% labor-to-revenue vs the 23% benchmark. This single action, if executed well, recovers $35-45M in annual contribution margin — the largest and most controllable lever. Simultaneously, they should renegotiate their top 5 supplier contracts which represent 60% of the $43M COGS increase.",
    keyTakeaways: [
      "When revenue grows but margin falls, always separate same-store performance from total performance first",
      "Cost increases in two major buckets simultaneously often signal a management attention problem during rapid expansion",
      "New locations are structurally less efficient — they need active management, not just time",
      "In food service, labor as a percentage of revenue is the single most controllable margin lever",
    ],
    questions: [
      {
        id: "q1",
        stage: "Problem Definition",
        question: "The partner briefs you: 'BrewCo's profit margin fell from 18% to 6% in two years. Revenue is up 12%. The CEO blames competition. The CFO blames costs. You have one hour before the first client meeting. What is your first move?'",
        context: "You need to decide how to spend your one hour before the meeting. The approach you take here will shape the entire engagement.",
        options: [
          {
            id: "a",
            text: "Pull the last two years of P&L data and break every cost line into dollar change and percentage change. You want to know which specific cost buckets moved before you walk into the meeting.",
            nextQuestionId: "q2a",
            scoreImpact: 15,
            feedback: "Good instinct. Walking into a client meeting with the P&L breakdown gives you an immediate data anchor. You pull the numbers and see COGS up $43M (+34%) and labor up $32M (+29%) against revenue growth of only $50M (+12%). The cost picture is clear before you sit down.",
          },
          {
            id: "b",
            text: "Prepare a framework slide showing the profit tree: Revenue minus Costs equals Profit, with each branch decomposed. You want to show the client you have a structured approach before diving into data.",
            nextQuestionId: "q2b",
            scoreImpact: 5,
            feedback: "A framework slide is useful for communication but it delays data analysis. You walk in with a clean slide but no numbers. The CFO immediately asks 'which cost line is the problem?' and you don't have an answer yet. The partner gives you a look.",
          },
          {
            id: "c",
            text: "Research BrewCo's competitors — Starbucks, Dutch Bros, regional chains — to understand what competitive moves might explain margin compression.",
            nextQuestionId: "q2c",
            scoreImpact: -5,
            feedback: "Competitive research is relevant but premature. Revenue is up 12% — if competition were the primary cause, revenue would be flat or declining. The CEO's hypothesis doesn't fit the data pattern. You walk into the meeting without the cost picture and the CFO dominates the conversation.",
          },
        ],
      },
      {
        id: "q2a",
        stage: "Data Analysis",
        question: "You have the P&L breakdown. COGS is up $43M (+34%) and labor is up $32M (+29%) against $50M in revenue growth. The partner asks: 'Before we show this to the client — what's the most important question this data raises that we don't yet know the answer to?'",
        exhibit: {
          type: "table",
          title: "BrewCo P&L Summary",
          data: `| Line Item | 2021 | 2023 | Change |
|---|---|---|---|
| Revenue | $420M | $470M | +$50M (+12%) |
| COGS | $126M | $169M | +$43M (+34%) |
| Labor | $109M | $141M | +$32M (+29%) |
| Rent | $42M | $56M | +$14M (+33%) |
| Marketing | $17M | $19M | +$12M (+12%) |
| G&A | $50M | $56M | +$6M (+12%) |
| **Net Profit** | **$76M** | **$28M** | **-$48M (-63%)** |`,
        },
        options: [
          {
            id: "a",
            text: "Are these cost increases happening uniformly across all 300 locations, or are they concentrated in the 100 new locations opened in the past two years?",
            nextQuestionId: "q3a",
            scoreImpact: 20,
            feedback: "Exactly right. This is the most diagnostic question in the dataset. BrewCo expanded from 200 to 300 locations — if the new locations are driving the cost increase, the problem is expansion-related inefficiency, not a systemic issue across the whole chain.",
          },
          {
            id: "b",
            text: "What has happened to commodity prices for coffee and dairy, since those are the inputs driving COGS?",
            nextQuestionId: "q3b",
            scoreImpact: 10,
            feedback: "Commodity price investigation is a valid line of inquiry. The client shares data showing coffee bean prices rose 18% and dairy 22% — but BrewCo's COGS rose 34%. That gap is important. Something beyond commodity inflation is driving the cost increase.",
          },
          {
            id: "c",
            text: "What is BrewCo's pricing strategy — have they raised menu prices in line with cost inflation?",
            nextQuestionId: "q3c",
            scoreImpact: 0,
            feedback: "Pricing is a reasonable question but it addresses revenue, not the cost increase. The data shows revenue is up 12%, so pricing is working to some degree. The more urgent question is why costs are growing 3x faster than revenue.",
          },
        ],
      },
      {
        id: "q2b",
        stage: "Data Analysis",
        question: "The client meeting has started. The CFO drops a spreadsheet on the table: 'I can tell you exactly what the problem is — labor costs are completely out of control.' The CEO pushes back: 'That's because we opened 100 new locations. Of course costs are up.' The partner looks at you. How do you steer this conversation?",
        options: [
          {
            id: "a",
            text: "Ask the CFO to walk through the labor data specifically — you want to understand whether the labor increase is proportional to the new locations or disproportionate.",
            nextQuestionId: "q3a",
            scoreImpact: 15,
            feedback: "Good recovery. Asking the CFO to explain the data rather than taking sides is the right move. The CFO shares that new locations are running at 35% labor-to-revenue vs 23% for mature locations — a significant gap that supports both the CEO's expansion explanation and the CFO's cost concern.",
          },
          {
            id: "b",
            text: "Side with the CEO — revenue is up 12%, which suggests the business is fundamentally healthy and the costs are a temporary expansion artifact.",
            nextQuestionId: "q3c",
            scoreImpact: -10,
            feedback: "Siding with an executive without data is a credibility mistake. The CFO is visibly annoyed and the partner shoots you a warning look. You recover by asking to see the actual numbers, but you've lost some early credibility in the room.",
          },
          {
            id: "c",
            text: "Suggest that both perspectives are valid and propose structuring the analysis into revenue drivers and cost drivers before drawing conclusions.",
            nextQuestionId: "q3b",
            scoreImpact: 5,
            feedback: "Diplomatically neutral but slightly evasive. The executives wanted a steer, not a process suggestion. The partner takes over and guides the conversation to the data — you follow along but missed the opportunity to lead.",
          },
        ],
      },
      {
        id: "q2c",
        stage: "Data Analysis",
        question: "Your competitive research shows that Starbucks and Dutch Bros both raised prices 8-10% in the same period. BrewCo raised prices 5%. The partner asks: 'Interesting. So what does this tell us about the margin problem?'",
        options: [
          {
            id: "a",
            text: "It tells us BrewCo underpriced relative to the market — they left margin on the table. The primary recommendation should be a 5-8% price increase to close the gap with competitors.",
            nextQuestionId: "q3c",
            scoreImpact: -5,
            feedback: "Price increases are one lever, but they don't explain why costs grew 3x faster than revenue. You've identified a revenue opportunity but missed the cost diagnosis entirely. The CFO says 'pricing is fine — our volume is up. The problem is what we're spending.'",
          },
          {
            id: "b",
            text: "It partially explains the revenue side but doesn't explain why COGS and labor grew 34% and 29% against only 12% revenue growth. We need to look at costs, not just pricing.",
            nextQuestionId: "q3a",
            scoreImpact: 10,
            feedback: "Good self-correction. You acknowledge the pricing insight but redirect to the more urgent cost question. The partner nods. The client shares the cost breakdown and you can see that new locations are running at significantly higher cost ratios than mature ones.",
          },
          {
            id: "c",
            text: "It tells us competition forced BrewCo to underprice, which compressed the revenue side. This is fundamentally a competitive positioning problem.",
            nextQuestionId: "q3c",
            scoreImpact: -10,
            feedback: "This conclusion doesn't fit the data — BrewCo's revenue is up 12% and volume is growing. A company being hurt by competitive pricing pressure would show flat or declining revenue, not growth. The partner asks you to revisit the assumption.",
          },
        ],
      },
      {
        id: "q3a",
        stage: "Deep Dive",
        question: "You get the location-level breakdown. The 200 mature locations run at 23% labor-to-revenue and 27% COGS-to-revenue. The 100 new locations run at 35% labor-to-revenue and 38% COGS-to-revenue. Average new location age: 14 months. The CEO says: 'See? It's just the new stores maturing. Give them 18 months and they'll look like the rest.' How do you respond?",
        exhibit: {
          type: "table",
          title: "Location Cohort Comparison",
          data: `| Metric | 200 Mature Locations | 100 New Locations | Benchmark |
|---|---|---|---|
| Labor as % of revenue | 23% | 35% | 24-26% |
| COGS as % of revenue | 27% | 38% | 28-30% |
| Average daily transactions | 185 | 118 | N/A |
| Average location age | 4.8 years | 14 months | N/A |
| Contribution margin | 18% | 4% | N/A |`,
        },
        options: [
          {
            id: "a",
            text: "The CEO may be partially right on labor — new locations historically improve as transaction volume grows. But the 38% COGS ratio at new locations is structurally higher than mature ones in a way that doesn't automatically improve with time. You'd want to understand what's different about the new locations' product mix or supplier contracts.",
            nextQuestionId: "q4a",
            scoreImpact: 20,
            feedback: "Excellent nuance. You've correctly separated the two cost problems: labor efficiency does improve with volume and time, but COGS ratio gaps are often structural. The client confirms that new locations were given more menu flexibility and are running a different product mix with higher input costs.",
          },
          {
            id: "b",
            text: "Agree with the CEO — 14 months is early for a new location. Industry data suggests 18-24 months to reach mature economics. The board should give it more time before making operational changes.",
            nextQuestionId: "q4b",
            scoreImpact: -5,
            feedback: "While maturation is real, 'give it time' is not a recommendation — it's a delay. The company is losing $48M in annual profit and needs active management, not patience. The CFO pushes back hard and the partner asks you to think about what management can actually do.",
          },
          {
            id: "c",
            text: "Disagree with the CEO. New locations should be held to the same standards as mature ones immediately. The 35% labor ratio needs to come down now through staffing reductions at the new locations.",
            nextQuestionId: "q4c",
            scoreImpact: 5,
            feedback: "The instinct to act is right but the prescription is too blunt. Cutting staff at new locations that are still ramping up transaction volume could hurt customer experience and slow the ramp. The right answer is smarter scheduling, not headcount cuts.",
          },
        ],
      },
      {
        id: "q3b",
        stage: "Deep Dive",
        question: "The client shares commodity data: coffee bean prices up 18%, dairy up 22% over two years. But BrewCo's COGS grew 34%. The gap between commodity inflation and COGS growth is $15M. The CFO says: 'That gap is the real problem. We're paying more per unit than we should be.' What do you investigate next?",
        exhibit: {
          type: "table",
          title: "COGS Breakdown",
          data: `| Category | 2021 | 2023 | Change | Commodity Inflation |
|---|---|---|---|---|
| Coffee & dairy | $54M | $89M | +65% | +18-22% |
| Pastry & food | $38M | $52M | +37% | +15% |
| Packaging | $18M | $22M | +22% | +18% |
| Waste & spoilage | $16M | $6M | -63% | N/A |
| **Total COGS** | **$126M** | **$169M** | **+34%** | |`,
        },
        options: [
          {
            id: "a",
            text: "Focus on the coffee and dairy line — it grew 65% against commodity inflation of 18-22%. The volume increase from 100 new stores explains some of it, but not all. Supplier contract terms and purchasing efficiency need to be examined.",
            nextQuestionId: "q4a",
            scoreImpact: 15,
            feedback: "Correct focus. The coffee and dairy line grew 3x faster than commodity prices — volume from new stores explains some of the increase, but the per-unit cost has also risen. The procurement team confirms that supplier contracts were renegotiated during rapid expansion and BrewCo lost pricing leverage.",
          },
          {
            id: "b",
            text: "The waste reduction from $16M to $6M is actually a success story. Focus on accelerating this program across the rest of COGS — if waste can be cut this dramatically, similar reductions elsewhere could recover significant margin.",
            nextQuestionId: "q4b",
            scoreImpact: 0,
            feedback: "The waste reduction is a genuine positive, but extrapolating it as the primary strategy misreads the scale. $10M in waste savings is dwarfed by the $35M gap in coffee and dairy costs. The waste program is a good news story, not the primary lever.",
          },
          {
            id: "c",
            text: "The packaging cost increase of 22% is in line with inflation, which validates that the procurement function works. The coffee and dairy problem must be a volume issue from new store openings, not a cost management failure.",
            nextQuestionId: "q4c",
            scoreImpact: -5,
            feedback: "Packaging at market rates does not validate overall procurement effectiveness. Coffee and dairy grew 65% against 18-22% inflation — this is a significant cost management failure, not a volume artifact. The logic doesn't hold.",
          },
        ],
      },
      {
        id: "q3c",
        stage: "Deep Dive",
        question: "You're focused on the revenue and pricing side. Average ticket is $8.50 and has grown from $7.80 two years ago. Transaction volume is up 14%. But the margin is still collapsing. The partner says: 'You've been on the revenue side for a while. The CFO is getting impatient. What's your read on the cost situation?'",
        options: [
          {
            id: "a",
            text: "Pivot to costs. Ask for a breakdown of COGS and labor versus two years ago, segmented by mature vs new locations.",
            nextQuestionId: "q3a",
            scoreImpact: 10,
            feedback: "Good course correction. You redirect to the cost side and get the location-level breakdown. New locations are running at significantly higher cost ratios — the diagnosis becomes much clearer.",
          },
          {
            id: "b",
            text: "Tell the partner that pricing is the primary lever and recommend a 7% menu price increase across all locations to recover margin.",
            nextQuestionId: "q4c",
            scoreImpact: -10,
            feedback: "A 7% price increase on top of recent increases risks volume loss. More importantly, you've still not diagnosed why costs are growing so fast. The recommendation doesn't address the root cause. The CFO says 'that won't fix what I'm seeing in the cost reports.'",
          },
          {
            id: "c",
            text: "Ask to see labor cost per transaction across all locations — if this number is rising, it's a productivity problem; if it's flat, the issue is volume-driven.",
            nextQuestionId: "q4a",
            scoreImpact: 5,
            feedback: "Good analytical instinct. Labor cost per transaction at new locations is $3.03 vs $2.00 at mature locations — a 52% premium. This is both a volume problem (fewer transactions per hour) and a wage problem (new hires at higher market rates).",
          },
        ],
      },
      {
        id: "q4a",
        stage: "Solution Design",
        question: "You now know two things: new locations have significantly higher labor and COGS ratios, and the COGS gap is partly structural (supplier pricing, product mix). The CEO asks: 'So what do we actually do? I need something I can tell the board in two weeks.' What is your recommendation?",
        options: [
          {
            id: "a",
            text: "Three actions: (1) Labor scheduling optimization at new locations targeting 28% labor-to-revenue within 6 months; (2) Renegotiate top 5 supplier contracts representing 60% of coffee and dairy spend; (3) Pause new store openings until existing new locations reach mature economics.",
            nextQuestionId: "q5a",
            scoreImpact: 20,
            feedback: "Strong recommendation. Specific, sequenced, and addresses both cost buckets. The partner adds that pausing new openings needs to be framed carefully — it should be 'optimizing the existing portfolio' not 'stopping growth.' The board will respond better to that framing.",
          },
          {
            id: "b",
            text: "One focused action: close the bottom 20% of new locations by contribution margin. Concentrating resources on the 80% that are performing better will improve overall portfolio metrics quickly.",
            nextQuestionId: "q5b",
            scoreImpact: 5,
            feedback: "Closure is a valid lever but drastic for a first recommendation. New locations often have weak early economics that improve significantly — closing them at 14 months average age may write off locations that would have been profitable. The CEO asks 'how do you know which ones won't recover?'",
          },
          {
            id: "c",
            text: "Raise prices 8% chain-wide to recover the margin gap. Combined with the natural maturation of new stores over the next 12-18 months, this should restore margins to the 12-15% range.",
            nextQuestionId: "q5c",
            scoreImpact: -5,
            feedback: "Price increases without cost discipline is a temporary fix. If COGS is structurally high at new locations, raising prices doesn't fix procurement or labor scheduling. The CFO says 'we've been raising prices. It's not working fast enough.'",
          },
        ],
      },
      {
        id: "q4b",
        stage: "Solution Design",
        question: "You've been patient on the maturation thesis. 18 months have passed and the new locations are at 16 months average age. Labor-to-revenue improved slightly from 35% to 32%. COGS-to-revenue is unchanged at 38%. The partner is now more direct: 'Maturation isn't solving this. What specifically do we recommend?'",
        options: [
          {
            id: "a",
            text: "The labor improvement shows the thesis was partially right — but COGS not moving means there's a structural input cost problem at new locations. Recommend supplier contract renegotiation immediately and a product mix audit for the new location menu.",
            nextQuestionId: "q5a",
            scoreImpact: 10,
            feedback: "Good diagnosis even if delayed. Splitting the two cost problems and recognizing that labor will self-correct (partially) while COGS won't is the right insight. The client agrees to the supplier audit.",
          },
          {
            id: "b",
            text: "Close the conversation on maturation entirely. Recommend a comprehensive cost reduction program across all locations targeting 15% reduction in both labor and COGS.",
            nextQuestionId: "q5b",
            scoreImpact: 0,
            feedback: "Blunt cost reduction across all locations would damage the mature locations that are already performing well. A targeted approach focused on the new location inefficiencies is more precise and less risky.",
          },
          {
            id: "c",
            text: "Recommend hiring a new COO with food service operations experience to drive efficiency across the portfolio.",
            nextQuestionId: "q5c",
            scoreImpact: -10,
            feedback: "A management hire recommendation without the supporting operational diagnosis is not sufficient. You haven't identified what specific operational problems the new COO would fix. The CEO says 'what would they actually do differently?' and you don't have an answer.",
          },
        ],
      },
      {
        id: "q4c",
        stage: "Solution Design",
        question: "The engagement is now at risk. The client is frustrated that the diagnosis has been unfocused. The partner pulls you aside: 'We need to get to a clear recommendation by end of week or this engagement will not extend. What is the single most important thing BrewCo should do?' What do you tell her?",
        options: [
          {
            id: "a",
            text: "The single most important action is labor scheduling optimization at the 100 new locations. Labor at 35% of revenue vs 23% for mature locations represents $28M in recoverable annual savings. This is the largest, most controllable lever and can be implemented in 60-90 days.",
            nextQuestionId: "q5a",
            scoreImpact: 15,
            feedback: "Good recovery and clear prioritization. The partner agrees — this is the right answer and gives you credibility back. She adds that you should have gotten here faster, but the recommendation is correct.",
          },
          {
            id: "b",
            text: "The single most important action is a comprehensive review of the expansion strategy — BrewCo should not have opened 100 locations so quickly and the board needs to hear that.",
            nextQuestionId: "q5b",
            scoreImpact: -5,
            feedback: "Critiquing the past strategy without a forward-looking recommendation is not actionable. The locations are already open. The question is what to do now, not relitigating the expansion decision.",
          },
          {
            id: "c",
            text: "The single most important action is revenue growth — a marketing investment to drive transaction volume at the underperforming new locations will solve the labor efficiency problem organically.",
            nextQuestionId: "q5c",
            scoreImpact: 0,
            feedback: "Driving volume is a valid idea but slow and uncertain. Marketing investment at underperforming locations is expensive and the timeline to margin recovery would be 18-24 months. The CFO needs results in 90 days, not 18 months.",
          },
        ],
      },
      {
        id: "q5a",
        stage: "Implementation",
        question: "The CEO accepts your recommendation. He asks: 'On the labor scheduling — how do we actually implement this without hurting customer experience at our new stores which are still building their customer base?'",
        options: [
          {
            id: "a",
            text: "Implement dynamic scheduling tied to transaction data — staff to projected demand curves rather than fixed shifts. New locations should staff up during peak hours and reduce staff during off-peak periods. This is a labor productivity fix, not a headcount cut.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Excellent. This recommendation preserves customer experience during peaks while removing cost during low-demand periods. It also creates a data-driven culture around labor management that will benefit all 300 locations long-term.",
          },
          {
            id: "b",
            text: "Reduce all new location shifts by one FTE immediately, accept slightly slower service in the near term, and monitor whether customers notice.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "This will reduce costs but risks customer experience at the exact moment when new locations are building loyalty. A blunter approach than necessary given that dynamic scheduling exists as an alternative.",
          },
          {
            id: "c",
            text: "Freeze all new hiring at new locations and let natural attrition reduce headcount over 6-12 months.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Attrition-based reduction is slow and imprecise — you lose people in unpredictable patterns, not based on where the labor savings are needed most. Better than immediate cuts but inferior to dynamic scheduling.",
          },
        ],
      },
      {
        id: "q5b",
        stage: "Implementation",
        question: "You recommend closing the bottom 20% of new locations. The CEO asks for the criteria. 'How do we decide which 20 locations to close?' What framework do you propose?",
        options: [
          {
            id: "a",
            text: "Use a three-factor model: (1) Current contribution margin; (2) Trajectory — is it improving or flat over 6 months?; (3) Market potential — is the local market large enough to justify the location long-term? Locations that score poorly on all three are candidates for closure.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good framework. Using trajectory alongside current performance avoids closing locations that are struggling but improving. The market potential factor protects against closing strategically important locations that need more time.",
          },
          {
            id: "b",
            text: "Close the 20 locations with the lowest current revenue — simple, objective, and defensible to the board.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Low revenue alone is insufficient — a low-revenue location in a growing market may be more valuable than a slightly higher-revenue location in a declining one. This criteria would lead to some bad closures.",
          },
          {
            id: "c",
            text: "Let the franchisee operators self-select — ask if any want to exit their agreements voluntarily before deciding on forced closures.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Voluntary exits reduce friction but again create adverse selection — operators in the best locations won't volunteer, leaving you with a self-selected pool that may not match your strategic closure criteria.",
          },
        ],
      },
      {
        id: "q5c",
        stage: "Implementation",
        question: "The engagement winds down without a clear cost recommendation. The partner gives you candid feedback in the debrief: 'You spent too much time on revenue and pricing. The data pointed to costs from the beginning.' She asks you: 'If you could redo this engagement, what would you do differently in Week 1?'",
        options: [
          {
            id: "a",
            text: "Start with the P&L breakdown on Day 1, segment by new vs mature locations immediately, and use the cost data as the anchor for the entire engagement rather than following the CEO's competitive hypothesis.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Correct reflection. Following the client's hypothesis rather than the data is a common associate mistake. The data pointed to costs from the beginning — COGS up 34% and labor up 29% against 12% revenue growth is a clear signal that should have redirected the analysis immediately.",
          },
          {
            id: "b",
            text: "Interview more store managers to get ground-level perspective on why costs are rising before presenting anything to the senior team.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Store manager interviews are valuable but secondary to the quantitative diagnosis. Understanding the 'why' in the field is useful once you know where to look — but starting there without the data anchor would have taken even longer to reach the conclusion.",
          },
          {
            id: "c",
            text: "Get the partner to facilitate the CEO-CFO alignment earlier — the disagreement between them slowed the engagement.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "Executive alignment is important but the core problem was analytical, not political. The CEO-CFO disagreement was actually an opportunity to bring data into the room — you needed the data to do that, and you didn't have it prepared.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CASE G2: BAIN — PIZZA CHAIN MARKET SIZING (BEGINNER, 6 nodes)
  // ─────────────────────────────────────────────────────────────
  {
    id: "g2",
    title: "SliceCo: US Pizza Market Sizing",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "bain",
    estimatedMinutes: 20,
    overview: "A PE firm is evaluating an investment in SliceCo, a regional pizza chain. Bain has been asked to size the US pizza market before the investment committee meets.",
    clientBackground: "SliceCo operates 240 locations in the Midwest with $180M in annual revenue. The PE firm wants to understand whether a national pizza brand is worth pursuing. They need a market size estimate, a view on SliceCo's current position, and a preliminary read on expansion potential.",
    yourRole: "You are a Bain first-year associate. The partner needs a market size estimate in 45 minutes for a client call. This is your first solo sizing exercise.",
    startQuestionId: "q1",
    finalRecommendationPrompt: "The PE partner asks: 'Should we invest in SliceCo's national expansion?' Give your one-paragraph recommendation based on your market sizing work.",
    idealRecommendation: "SliceCo should be an attractive investment. The US restaurant pizza market is approximately $46-52B annually. SliceCo's $180M revenue represents 0.35-0.4% market share with strong unit economics ($750K/location vs $620K industry average). National expansion to 1,000 locations would imply $750M-$850M revenue — a 5x growth opportunity in a large, stable market. The key diligence question is whether unit economics replicate outside the Midwest.",
    keyTakeaways: [
      "Always triangulate market sizing from two independent approaches",
      "Segment the market before sizing — restaurant pizza vs frozen vs delivery are different businesses",
      "Market share framing converts a market size into a strategic insight",
      "Unit economics per location tell you more about expansion potential than total revenue",
    ],
    questions: [
      {
        id: "q1",
        stage: "Structuring",
        question: "The partner drops the question on you: 'Size the US pizza market. You have 45 minutes.' Before calculating anything, how do you structure your approach?",
        context: "The partner is watching how you frame the problem before you start calculating. This is as important as the final number.",
        options: [
          {
            id: "a",
            text: "Define the market scope first: restaurant and delivery pizza only (excluding frozen/retail), then use two approaches — top-down from population and bottom-up from restaurant supply — and triangulate between them.",
            nextQuestionId: "q2a",
            scoreImpact: 20,
            feedback: "Strong start. Defining scope (restaurant only) and committing to triangulation are both marks of a rigorous analyst. The partner nods. 'Good. What are your two approaches going to be?'",
          },
          {
            id: "b",
            text: "Start calculating immediately using US population times estimated pizza consumption frequency times average spend. Get a number first, then pressure-test it.",
            nextQuestionId: "q2b",
            scoreImpact: 5,
            feedback: "Moving fast is useful under time pressure, but starting without defining the scope risks sizing the wrong market. You get a number quickly but the partner asks 'does this include frozen pizza?' and you realize you haven't thought about it.",
          },
          {
            id: "c",
            text: "Ask the partner what data sources are available before structuring — you want to know if you can use industry reports or if this is a pure estimation exercise.",
            nextQuestionId: "q2c",
            scoreImpact: 0,
            feedback: "In a case interview, you always assume no data sources unless told otherwise. Asking for data before attempting the estimate signals low independence. The partner says 'assume you have nothing. Estimate it.'",
          },
        ],
      },
      {
        id: "q2a",
        stage: "Top-Down Approach",
        question: "You've committed to a two-approach method. Walk through your top-down calculation. The partner asks: 'What are the three inputs you need for a top-down estimate of the restaurant pizza market?'",
        options: [
          {
            id: "a",
            text: "US population (330M), frequency of pizza restaurant/delivery occasions per person per year (estimated 18-20 per year mixing all ages), and average spend per occasion ($13-15 including tip, pizza only portion ~70% of ticket).",
            nextQuestionId: "q3a",
            scoreImpact: 15,
            feedback: "Clean decomposition. Your three inputs are well-chosen and each is independently estimable. Partner: 'Good. Run the numbers.'",
          },
          {
            id: "b",
            text: "Number of US households (127M), annual household pizza spending including delivery (estimated $480-520 per year for pizza-ordering households), and percentage of households that order pizza at least monthly (about 55%).",
            nextQuestionId: "q3b",
            scoreImpact: 10,
            feedback: "Household-level sizing also works but introduces an additional complexity — you need to estimate household pizza-ordering penetration, which is harder to anchor than per-capita frequency. Not wrong, but slightly more complex than needed.",
          },
          {
            id: "c",
            text: "Number of pizza restaurants (estimated 75,000), average annual revenue per restaurant (estimated $600-650K), and the percentage of revenue from dine-in vs delivery.",
            nextQuestionId: "q3c",
            scoreImpact: 5,
            feedback: "This is actually a bottom-up approach, not top-down. Both approaches are valid but you committed to top-down first. The partner notes the inconsistency but says 'this is fine — it'll be your cross-check.'",
          },
        ],
      },
      {
        id: "q2b",
        stage: "Top-Down Approach",
        question: "You've started calculating. Your first estimate: 330M people × 30 pizza occasions per year × $12 average spend = $119B. The partner raises an eyebrow. 'That seems high. What have you included that you shouldn't have?'",
        options: [
          {
            id: "a",
            text: "The 30 occasions includes frozen pizza and grocery store pizza, which are a different market from restaurant and delivery. Excluding those (roughly 38% of occasions) brings it to about $74B. But I also need to adjust for the fact that only the pizza portion of the ticket counts — roughly 68% of spend. Final estimate closer to $50B.",
            nextQuestionId: "q3a",
            scoreImpact: 15,
            feedback: "Good self-correction under pressure. Walking through the adjustments clearly and arriving at a defensible $50B is solid work. The partner says 'much better. Now cross-check it.'",
          },
          {
            id: "b",
            text: "I think $119B might actually be right if you include all pizza-related spending — restaurants, delivery apps, frozen, school cafeterias, and corporate catering.",
            nextQuestionId: "q3c",
            scoreImpact: -10,
            feedback: "Defending an obviously inflated number without questioning the inputs is a red flag. The US total restaurant industry is ~$900B — pizza at $119B would mean pizza is 13% of all restaurant spending, which is not credible. The partner is visibly unimpressed.",
          },
          {
            id: "c",
            text: "30 occasions is probably too high for the average American. Let me revise down to 20 occasions, which gives $79B — still seems high but closer.",
            nextQuestionId: "q3b",
            scoreImpact: 5,
            feedback: "Adjusting frequency is a valid move but misses the scope issue — frozen pizza is included in your estimate. Frequency adjustment partially fixes the problem but doesn't fully address it.",
          },
        ],
      },
      {
        id: "q2c",
        stage: "Top-Down Approach",
        question: "The partner confirms no data sources. 'Pure estimation. Start talking.' You begin your top-down approach. After 10 minutes you have an estimate of $85B for the pizza market. The partner says: 'That's too high. Walk me through where you went wrong.'",
        exhibit: {
          type: "table",
          title: "Your Working",
          data: `| Input | Your Estimate |
|---|---|
| US population | 330M |
| Pizza occasions per person per year | 35 |
| Average spend per occasion | $12 |
| Raw estimate | $138.6B |
| Adjustment for restaurant only (x 0.62) | $85.9B |`,
        },
        options: [
          {
            id: "a",
            text: "35 occasions is too high — that's more than once per week for every American including infants and elderly. A more realistic estimate for restaurant/delivery occasions specifically is 18-20 per year for the adult population, with adjustment for children. Revised estimate: closer to $50B.",
            nextQuestionId: "q3a",
            scoreImpact: 10,
            feedback: "Good catch on the frequency assumption. Anchoring to 'more than once a week for everyone' is the intuition check that exposes the error. Revised to $50B is in the right range.",
          },
          {
            id: "b",
            text: "The 62% restaurant adjustment is wrong — frozen pizza represents closer to 25% of occasions, not 38%. Raising that to 75% restaurant gives about $104B which seems more reasonable.",
            nextQuestionId: "q3c",
            scoreImpact: -5,
            feedback: "Adjusting one assumption to make the number feel more comfortable, without questioning the other inputs, is not rigorous. The frequency assumption of 35 occasions is the real problem. $104B for restaurant pizza would mean pizza is 11% of all US restaurant sales — implausible.",
          },
          {
            id: "c",
            text: "The $12 average spend is too low — pizza delivery averages closer to $25-30 per order. Let me revise upward.",
            nextQuestionId: "q3b",
            scoreImpact: -10,
            feedback: "Revising the spend assumption upward makes the number even higher, which is the wrong direction. The problem is that the estimate is too large, not too small. This would move you further from the right answer.",
          },
        ],
      },
      {
        id: "q3a",
        stage: "Bottom-Up Cross-Check",
        question: "Your top-down estimate is $48-52B for restaurant pizza. Now the partner asks for your bottom-up cross-check. You estimate 78,000 pizza restaurants and delivery operations in the US. What average annual revenue per location do you use?",
        options: [
          {
            id: "a",
            text: "Segment it: large chains (Domino's, Pizza Hut locations) average around $900K-1M. Independent pizzerias average $400-500K. Weighted average across the mix: approximately $620-650K. Bottom-up estimate: 78,000 × $635K = $49.5B.",
            nextQuestionId: "q4a",
            scoreImpact: 20,
            feedback: "Excellent segmented approach. Differentiating chain vs independent unit economics is exactly right — chains operate at higher revenue per location due to brand, delivery infrastructure, and marketing. $49.5B is very close to your $48-52B top-down estimate. Strong triangulation.",
          },
          {
            id: "b",
            text: "Use a single average of $600K for all pizza restaurants without segmenting. 78,000 × $600K = $46.8B. This is close enough to the top-down estimate to validate it.",
            nextQuestionId: "q4b",
            scoreImpact: 10,
            feedback: "A single average is less precise but gives you a number in the right range. $46.8B is close enough to the $48-52B top-down to validate the estimate. The partner would prefer the segmented approach but accepts this.",
          },
          {
            id: "c",
            text: "Use $1M per location — that's the average for full-service restaurants. 78,000 × $1M = $78B, which suggests your top-down estimate was too low.",
            nextQuestionId: "q4c",
            scoreImpact: -5,
            feedback: "$1M is too high — that's the average for full-service restaurants, not pizza specifically. Pizza delivery operations and small independents bring the average down significantly. Using the wrong benchmark inflates the estimate and undermines the triangulation.",
          },
        ],
      },
      {
        id: "q3b",
        stage: "Bottom-Up Cross-Check",
        question: "Your top-down estimate landed around $70B using household-level sizing. The partner asks for the bottom-up cross-check. Your estimate: 78,000 pizza operations × average revenue = total market. What number do you get and what does the discrepancy with your top-down tell you?",
        options: [
          {
            id: "a",
            text: "78,000 × $620K average = $48.4B. That's $20B lower than my $70B top-down estimate. This suggests my household sizing over-counted — probably the penetration rate or annual spend per household was too high. I'll adjust toward $50B as the more conservative and data-anchored estimate.",
            nextQuestionId: "q4a",
            scoreImpact: 15,
            feedback: "Good triangulation discipline. Recognizing that the lower, supply-side estimate is more likely to be accurate — because restaurant revenue is more observable than household spending surveys — is mature analytical thinking.",
          },
          {
            id: "b",
            text: "78,000 × $620K = $48.4B. The discrepancy means one of my estimates is wrong — I'll present a range of $48-70B to cover both estimates.",
            nextQuestionId: "q4b",
            scoreImpact: 0,
            feedback: "Presenting a $22B range is not useful — it's so wide as to be unhelpful for investment decision-making. When estimates diverge, you need to diagnose which assumption is wrong, not just widen the range.",
          },
          {
            id: "c",
            text: "78,000 × $620K = $48.4B. My top-down was higher so I'll go with the higher estimate — more data points support a larger market being better for the investment thesis.",
            nextQuestionId: "q4c",
            scoreImpact: -10,
            feedback: "Choosing the higher estimate because it supports the investment thesis is confirmation bias. Good analysis follows the data, not the desired conclusion. The partner says 'that's not how we do analysis at Bain.'",
          },
        ],
      },
      {
        id: "q3c",
        stage: "Bottom-Up Cross-Check",
        question: "You've been working bottom-up all along using restaurant count. Your estimate: 78,000 × $620K = $48.4B. The partner asks: 'Good. Now give me the top-down to cross-check it.' You need to quickly build a population-based estimate.",
        options: [
          {
            id: "a",
            text: "330M people × 18 restaurant/delivery pizza occasions per year × $8.50 net pizza revenue per occasion (excluding beverages and non-pizza items) = $50.4B. Close to $48.4B — good triangulation.",
            nextQuestionId: "q4a",
            scoreImpact: 10,
            feedback: "Clean top-down built quickly. $50.4B vs $48.4B bottom-up — a 4% difference — is excellent triangulation. Final estimate: approximately $48-51B for US restaurant pizza.",
          },
          {
            id: "b",
            text: "I don't have time to rebuild a full top-down. The bottom-up estimate of $48.4B is sufficient — it's based on actual restaurant economics which are more reliable than consumer surveys.",
            nextQuestionId: "q4b",
            scoreImpact: 5,
            feedback: "Bottom-up is indeed more reliable in many ways, but declining to triangulate when asked is not the right answer. The partner asked for a cross-check — you should attempt it even if imperfect.",
          },
          {
            id: "c",
            text: "330M × 30 occasions × $12 average spend = $119B, adjusted by 60% for restaurant only = $71B. Doesn't match well — I'll go with $60B as a midpoint.",
            nextQuestionId: "q4c",
            scoreImpact: -5,
            feedback: "The 30 occasions figure includes frozen pizza and is too high for restaurant-specific sizing. The midpoint approach when two estimates diverge significantly is not analytically sound — it masks an input error that should be corrected.",
          },
        ],
      },
      {
        id: "q4a",
        stage: "Strategic Implication",
        question: "Your triangulated estimate is $48-51B for US restaurant pizza. The partner asks: 'SliceCo has $180M revenue. What does that tell us about the investment opportunity?'",
        options: [
          {
            id: "a",
            text: "SliceCo has 0.36-0.38% market share in a $48-51B market — they are tiny relative to the opportunity. Their 240 locations at $750K average revenue (above the $620K industry average) suggest strong unit economics. If they can maintain $750K per location at national scale, 1,000 locations = $750M revenue — roughly a 4x opportunity in a large, stable market.",
            nextQuestionId: "q5a",
            scoreImpact: 20,
            feedback: "Excellent. You've converted the market size into a strategic insight about the opportunity. The unit economics comparison ($750K vs $620K benchmark) is particularly strong — it suggests SliceCo is operationally above average, which is what PE investors want to see before scaling.",
          },
          {
            id: "b",
            text: "SliceCo is extremely small at 0.36% share — in a competitive market dominated by Domino's, Pizza Hut, and Papa John's, growing to meaningful share will be very difficult. The market might be too competitive for a regional player to expand nationally.",
            nextQuestionId: "q5b",
            scoreImpact: 0,
            feedback: "The competitive concern is valid context but misses the point of market sizing. 0.36% of a $50B market means there is enormous room to grow without taking significant share from incumbents — growing to 2% is still a $1B business. The framing should be about opportunity, not just competition.",
          },
          {
            id: "c",
            text: "SliceCo is too small to matter — at $180M they represent less than 0.4% of the market. The PE firm should look at larger acquisition targets with more scale.",
            nextQuestionId: "q5c",
            scoreImpact: -10,
            feedback: "This conclusion inverts the logic of market sizing. Small current share in a large market is an opportunity, not a disqualifier — especially combined with above-average unit economics. This framing would lead PE firms to never invest in growth companies.",
          },
        ],
      },
      {
        id: "q4b",
        stage: "Strategic Implication",
        question: "Your estimate is approximately $48-51B but you have some uncertainty about the range. The partner asks: 'The IC wants a single number to put in the deck. What do you tell them?'",
        options: [
          {
            id: "a",
            text: "$49B as the central estimate, with a note that the reasonable range is $46-53B depending on how you treat delivery-only operations. Present the single number but be transparent about the assumptions.",
            nextQuestionId: "q5a",
            scoreImpact: 15,
            feedback: "This is exactly right. A single central estimate with explicit uncertainty bounds is what IC presentations need. Hiding the range would be misleading; refusing to give a number would be unhelpful. The partner says 'perfect.'",
          },
          {
            id: "b",
            text: "Give a range: $46-53B. IC members can use whichever end supports their view of the investment.",
            nextQuestionId: "q5b",
            scoreImpact: 0,
            feedback: "Presenting a range and letting IC members pick the end that suits them is intellectually dishonest. The analyst's job is to give the best estimate, not to provide optionality for confirmation bias.",
          },
          {
            id: "c",
            text: "Round up to $55B to give the investment a larger addressable market — it makes the opportunity look more attractive.",
            nextQuestionId: "q5c",
            scoreImpact: -15,
            feedback: "Inflating a market estimate to make an investment look better is a serious analytical integrity failure. If discovered, it destroys credibility. The partner says 'never round in a direction that supports the conclusion you want to reach.'",
          },
        ],
      },
      {
        id: "q4c",
        stage: "Strategic Implication",
        question: "Your market estimate has been imprecise throughout. The partner gives you a reality check: 'Industry data shows the US restaurant pizza market is approximately $46B. How far off were you and what does that tell you about your method?'",
        options: [
          {
            id: "a",
            text: "If my estimate was $60B, I was 30% above the actual number. The error most likely came from my frequency assumption — 30 occasions per person per year was too high. For restaurant-specific sizing, 18-20 occasions is more accurate. Going forward I'd anchor frequency assumptions to time periods: once every 3 weeks for a typical adult pizza eater.",
            nextQuestionId: "q5a",
            scoreImpact: 10,
            feedback: "Good post-mortem. Identifying the specific input that caused the error and proposing a calibration for next time is how you improve. The partner says 'exactly right — frequency is the hardest input to get right in consumer market sizing.'",
          },
          {
            id: "b",
            text: "30% off is within acceptable range for a market sizing exercise. The purpose is to get the order of magnitude right, not the exact number.",
            nextQuestionId: "q5b",
            scoreImpact: 5,
            feedback: "True that exactness is not the goal, but 30% off without diagnosing why is a missed learning opportunity. The partner wants to see you identify and fix the specific input error, not rationalize the miss.",
          },
          {
            id: "c",
            text: "I'd challenge the $46B industry figure — market definitions vary and my $60B estimate may capture distribution and catering channels that the industry number excludes.",
            nextQuestionId: "q5c",
            scoreImpact: -5,
            feedback: "Defending a wrong estimate by questioning the benchmark is intellectually dishonest. In a real engagement you would use the industry data — the market sizing exercise exists precisely for situations where you don't have that data. Learn from the error, don't explain it away.",
          },
        ],
      },
      {
        id: "q5a",
        stage: "Investment Implication",
        question: "The IC asks the final question: 'Based on your market sizing, is the national expansion of SliceCo a good bet?' What do you say?",
        options: [
          {
            id: "a",
            text: "Yes, conditionally. $49B market, SliceCo at 0.37% share with above-average unit economics. A national rollout to 1,000 locations at $750K revenue would mean $750M in revenue — 4x current size while still holding less than 2% market share. The condition: PE firm must validate that Midwest unit economics replicate in new geographies before committing to full national rollout.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong final answer. Conditional yes with specific evidence, upside framing, and the critical diligence question (geographic replication). This is the IC answer that gets funded.",
          },
          {
            id: "b",
            text: "Yes. The market is large and growing and SliceCo has strong unit economics. National expansion is clearly attractive.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Directionally right but lacks the quantitative backing that makes a recommendation compelling to an IC. 'Large and growing' is vague — $49B at 0.37% current share with 4x upside to 2% share is the specific version of that statement.",
          },
          {
            id: "c",
            text: "Maybe. There are too many unknowns about whether SliceCo can compete nationally against Domino's and Pizza Hut to make a confident recommendation.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "'Maybe' is not an investment recommendation. The IC needs a view with supporting rationale. Uncertainty is real but the analyst's job is to make the best recommendation given available data, not to withhold one.",
          },
        ],
      },
      {
        id: "q5b",
        stage: "Investment Implication",
        question: "The IC pushes back on your range: 'You've given us a range and a qualified maybe. We need a number and a view. What is your recommendation?' How do you handle the pressure?",
        options: [
          {
            id: "a",
            text: "Commit to a number: $49B central estimate. And commit to a view: invest, contingent on geography validation. The uncertainty in the range doesn't change the order of magnitude of the opportunity or the unit economics quality.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good recovery under pressure. Committing to a number and a view while being transparent about residual uncertainty is exactly what IC presentations require.",
          },
          {
            id: "b",
            text: "Explain that the range reflects genuine analytical uncertainty and the IC should commission additional research before deciding.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Calling for more research when the IC is ready to decide is a consulting failure. You had the tools to size this market — own the estimate and make the recommendation.",
          },
          {
            id: "c",
            text: "Ask the IC what number would make the investment compelling and work backward from there.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "Working backward from a desired conclusion to justify the analysis is the definition of biased analysis. This would be a serious credibility failure in a real engagement.",
          },
        ],
      },
      {
        id: "q5c",
        stage: "Investment Implication",
        question: "The partner gives you direct feedback: 'Your sizing was imprecise and your framing of the implication was weak. Given that, what do you think the PE firm should actually do with SliceCo?' How do you recover?",
        options: [
          {
            id: "a",
            text: "Despite the imprecision in my sizing, the key insight is directionally clear: SliceCo's unit economics at $750K per location are above the industry average of $620K. That's the real signal. Even if the market is $40B not $60B, above-average unit economics in a fragmented market is a good PE thesis. I'd recommend a conditional investment with geography validation as the key diligence step.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Good recovery. Redirecting to the most signal-rich data point (unit economics) and giving a clear recommendation despite the sizing imprecision is the right move. The partner says 'much better — the unit economics are the real insight here.'",
          },
          {
            id: "b",
            text: "The sizing was imprecise so I'm not comfortable making an investment recommendation. The PE firm should wait for better data.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Refusing to make a recommendation because your analysis wasn't perfect is not acceptable in consulting or PE. You always have to work with imperfect data. The partner says 'that's not how we operate.'",
          },
          {
            id: "c",
            text: "I'd recommend against the investment — if I can't size the market accurately, the PE firm probably can't either, and that uncertainty is a risk.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Market sizing imprecision is a feature of early-stage diligence, not a reason to pass on an investment. PE firms invest in markets they can't perfectly size all the time. The investment decision should be based on the available evidence, not on whether the analyst's model is perfect.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CASE G3: DELOITTE — BOOKSTORE PROFITABILITY (BEGINNER, 6 nodes)
  // ─────────────────────────────────────────────────────────────
  {
    id: "g3",
    title: "PageTurner: Bookstore Margin Crisis",
    type: "profitability",
    difficulty: "beginner",
    firm: "deloitte",
    estimatedMinutes: 22,
    overview: "A regional bookstore chain has seen profit margin fall from 10% to 3% over three years while revenue stayed flat. Deloitte has been asked to diagnose the issue before a board meeting.",
    clientBackground: "PageTurner operates 85 bookstores across the Southeast US. Revenue has been stable at $420M for three years. Net profit fell from $42M to $12.6M. The CEO believes it is an Amazon competition problem. The CFO thinks lease renewals are killing them. The board meets in one week.",
    yourRole: "You are a Deloitte consultant on your second engagement. The senior manager needs a clear diagnosis and two recommendations before the board meeting.",
    startQuestionId: "q1",
    finalRecommendationPrompt: "What are your two most important recommendations to PageTurner's board? Be specific about expected financial impact.",
    idealRecommendation: "Two recommendations: (1) Renegotiate or exit the 38 locations with above-benchmark lease rates — occupancy costs grew $18M (+47%) due to lease renewals at 2x prior rates. Exit the bottom 15-20 locations by contribution margin. Estimated recovery: $14-18M annually. (2) Audit the category mix change at the new gift/café locations — lower-margin categories added to offset book sales decline are diluting overall gross margin. Optimizing the mix could recover 1.5-2pp of gross margin = $6-8M annually. Combined these two actions could recover $20-26M of the $29M profit decline.",
    keyTakeaways: [
      "Flat revenue can mask major underlying shifts — always ask what is inside the revenue number",
      "Lease renewals are a hidden driver of retail margin deterioration — they compound silently over time",
      "Category mix changes have margin consequences that are often not modeled before launch",
      "Retail diagnostics should always segment by location economics, not just total portfolio",
    ],
    questions: [
      {
        id: "q1",
        stage: "Problem Definition",
        question: "Your senior manager briefs you: 'Revenue flat at $420M, profit down from $42M to $12.6M — that's a $29M profit decline. CEO blames Amazon. CFO blames leases. You have 30 minutes before the client call. What do you want to look at first?'",
        options: [
          {
            id: "a",
            text: "Pull the full P&L with every cost line for the past three years and sort by dollar change. Find the biggest movers before the call.",
            nextQuestionId: "q2a",
            scoreImpact: 15,
            feedback: "Right instinct. The P&L breakdown arrives showing occupancy up $18M (+47%), COGS up $8M (+3%), and labor up $4M (+6%). The occupancy increase stands out immediately — 47% growth on a cost line for a chain with the same number of stores is unusual.",
          },
          {
            id: "b",
            text: "Research Amazon's impact on bookstore industry revenue over the same three years to evaluate the CEO's hypothesis before the call.",
            nextQuestionId: "q2b",
            scoreImpact: 0,
            feedback: "Amazon research is relevant context, but the problem is that revenue is flat — not declining. If Amazon were the primary cause, you'd expect revenue to have fallen. The CEO's hypothesis doesn't fit the symptom. You walk into the call with context but without the cost picture.",
          },
          {
            id: "c",
            text: "Ask the senior manager what she thinks the most likely cause is — she has been on the engagement longer and her hypothesis will save you time.",
            nextQuestionId: "q2c",
            scoreImpact: -5,
            feedback: "Asking for the answer before looking at the data is not independent thinking. The senior manager says 'I have a hypothesis but I want to see what you come up with first.' You walk into the call with nothing to show.",
          },
        ],
      },
      {
        id: "q2a",
        stage: "Data Analysis",
        question: "You have the P&L. Occupancy is up $18M (+47%), COGS up $8M, labor up $4M. The CFO says: 'I told you — it's the leases.' The CEO says: 'The leases are what they are. The real problem is that people aren't buying books like they used to.' How do you evaluate both perspectives?",
        exhibit: {
          type: "table",
          title: "PageTurner P&L — 3 Year Change",
          data: `| Cost Line | Year 1 | Year 3 | Change |
|---|---|---|---|
| COGS | $252M | $260M | +$8M (+3%) |
| Labor | $63M | $67M | +$4M (+6%) |
| Occupancy | $38M | $56M | +$18M (+47%) |
| Marketing | $8M | $9M | +$1M (+12%) |
| G&A | $17M | $15M | -$2M (-12%) |
| **Total Costs** | **$378M** | **$407M** | **+$29M (+8%)** |
| Revenue | $420M | $420M | $0 |
| **Net Profit** | **$42M** | **$13M** | **-$29M** |`,
        },
        options: [
          {
            id: "a",
            text: "Ask the CFO for the lease renewal data — specifically how many leases renewed and at what rate change. If 38 leases renewed at $560K pre-renewal and $1.1M post-renewal, that's exactly $20.5M in cost increase, which explains the $18M net (accounting for partial year effects).",
            nextQuestionId: "q3a",
            scoreImpact: 20,
            feedback: "Excellent diagnostic instinct. The lease data confirms 38 renewals at near-double the prior rate. This is the smoking gun — and it's a fixable problem. The CFO is right, but the CEO's Amazon concern may explain why revenue isn't growing to offset it.",
          },
          {
            id: "b",
            text: "Ask for revenue breakdown by category — if book sales are declining and being replaced by gift/café revenue at lower margins, the CEO's Amazon concern could be showing up in the mix even though total revenue is flat.",
            nextQuestionId: "q3b",
            scoreImpact: 10,
            feedback: "Category mix is a valid line of inquiry. The data shows book revenue fell $22M and was replaced by gift, café, and event revenue — but at a 5-8pp lower gross margin. This explains some of the COGS increase too. Good insight, though the occupancy issue is larger in dollar terms.",
          },
          {
            id: "c",
            text: "Tell both executives that both factors are likely contributing and you need two weeks to build a full attribution model before drawing conclusions.",
            nextQuestionId: "q3c",
            scoreImpact: -10,
            feedback: "Two weeks for a board meeting in one week is not possible. You need a preliminary view now. 'Both are contributing' without any quantification is not useful analysis. The senior manager steps in to fill the void.",
          },
        ],
      },
      {
        id: "q2b",
        stage: "Data Analysis",
        question: "Your Amazon research shows that US bookstore industry revenue fell 8% over the same three years — but PageTurner's revenue was flat. The CFO interrupts: 'See? We've actually beaten the market. The problem is costs, not revenue.' How do you respond?",
        options: [
          {
            id: "a",
            text: "Agree with the CFO's logic and pivot to the P&L. If revenue beat the market and still declined in profit, the issue must be on the cost side. Ask for the full cost breakdown before making any further hypotheses.",
            nextQuestionId: "q3a",
            scoreImpact: 10,
            feedback: "Good recovery. Updating your view based on the CFO's insight and pivoting to cost analysis is the right move. You're now on the right track even if you started slightly off.",
          },
          {
            id: "b",
            text: "Challenge the CFO's logic — flat revenue when the market fell 8% could mean PageTurner added lower-margin categories (gifts, café) to compensate for book sales decline. The mix shift is the hidden margin problem.",
            nextQuestionId: "q3b",
            scoreImpact: 15,
            feedback: "Excellent insight. You've connected the Amazon trend to a potential mix shift explanation — and you're right. PageTurner did add lower-margin categories to offset book sales decline. This is a sophisticated reading of flat revenue.",
          },
          {
            id: "c",
            text: "Agree with the CEO that Amazon is the real problem and recommend an e-commerce investment to build an online channel.",
            nextQuestionId: "q3c",
            scoreImpact: -10,
            feedback: "Recommending an e-commerce investment based on a preliminary hypothesis, before looking at the P&L, is jumping to solutions. The CFO points out that costs are the measurable problem and an e-commerce platform will only add costs in the near term.",
          },
        ],
      },
      {
        id: "q2c",
        stage: "Data Analysis",
        question: "The senior manager shares her hypothesis with you: 'I think it's the leases — we saw this in another retail client last year.' The client call begins. The CEO opens: 'I want to understand why our margins are being destroyed despite strong operations.' How do you begin the conversation?",
        options: [
          {
            id: "a",
            text: "Ask the client to walk you through the cost changes over three years, line by line. You want to hear their perspective on where costs have moved before sharing any hypothesis.",
            nextQuestionId: "q3a",
            scoreImpact: 10,
            feedback: "Client-led cost walkthrough is a valid approach — sometimes clients know exactly where the problem is and you're helping them organize the insight. The CFO immediately highlights the occupancy increase and the lease renewal data comes out.",
          },
          {
            id: "b",
            text: "Present the senior manager's lease hypothesis directly: 'Based on our initial review, we believe lease renewals may be a primary driver. Can you share data on lease renewals in the past three years?'",
            nextQuestionId: "q3b",
            scoreImpact: 5,
            feedback: "Presenting a hypothesis early is fine if it's framed as a question, not a conclusion. The client confirms lease renewals are a factor — but they also reveal a category mix change that you would have missed if you only investigated leases.",
          },
          {
            id: "c",
            text: "Open with the CEO's concern about Amazon and frame the engagement as a competitive response strategy.",
            nextQuestionId: "q3c",
            scoreImpact: -5,
            feedback: "Framing the engagement around a competitive hypothesis when the symptom is cost-driven delays the real diagnosis. The CFO visibly checks out of the conversation.",
          },
        ],
      },
      {
        id: "q3a",
        stage: "Root Cause",
        question: "Lease data confirmed: 38 of 85 stores renewed leases at an average of $1.1M vs $560K previously — a $540K per store increase × 38 stores = $20.5M, explaining the $18M net occupancy increase. The CEO asks: 'So what do we do? We can't renegotiate signed leases.'",
        options: [
          {
            id: "a",
            text: "There are three actions: (1) For upcoming renewals — establish a policy that no renewal above $800K/year proceeds without board sign-off; (2) For the current 38 high-cost leases — evaluate each by contribution margin and exit the bottom 15-20 through subletting or early termination negotiation; (3) Explore co-tenancy options where two retailers share a location.",
            nextQuestionId: "q4a",
            scoreImpact: 20,
            feedback: "Excellent. Three concrete, sequenced actions that address the immediate problem (exit some), the ongoing problem (policy for renewals), and a creative option (co-tenancy). The board will respond well to this specificity.",
          },
          {
            id: "b",
            text: "We need to grow revenue at the high-cost stores to justify the new lease rates. A marketing investment targeting the stores with the highest rent increases would drive traffic and improve the contribution margin.",
            nextQuestionId: "q4b",
            scoreImpact: 0,
            feedback: "Revenue growth at high-cost stores is directionally right but slow and uncertain. If a store is paying $1.1M in rent, it needs $4.4M in incremental revenue at current margins to justify it. Marketing investment alone is unlikely to close that gap in 90 days.",
          },
          {
            id: "c",
            text: "Recommend moving all new lease renewals to shorter terms (1-2 years instead of 5-7 years) to maintain flexibility. The current problem can't be fixed, but we can prevent it from getting worse.",
            nextQuestionId: "q4c",
            scoreImpact: 5,
            feedback: "Shorter lease terms is a valid future-state recommendation but doesn't address the current $18M problem. The board needs both a near-term fix and a governance change — not just the governance change.",
          },
        ],
      },
      {
        id: "q3b",
        stage: "Root Cause",
        question: "Revenue breakdown reveals: book revenue fell $22M (replaced by gift, café, event revenue). Gross margin on books: 42%. Gross margin on gifts: 34%. Gross margin on café: 28%. The CEO says: 'We diversified deliberately to offset the Amazon impact. Are you saying we made a mistake?'",
        options: [
          {
            id: "a",
            text: "Not necessarily a mistake strategically — but the margin math wasn't modeled. Replacing $22M of book revenue at 42% gross margin with $22M of gift/café revenue at 28-34% gross margin costs $1.8-3M in gross profit annually. The diversification needs margin-conscious category selection.",
            nextQuestionId: "q4a",
            scoreImpact: 15,
            feedback: "Nuanced answer. You acknowledge the strategic logic (diversification was reasonable) while identifying the implementation gap (margin wasn't modeled). This is how Deloitte consultants maintain credibility while delivering difficult news.",
          },
          {
            id: "b",
            text: "Yes — the diversification was a mistake. Adding lower-margin categories to compensate for volume loss is a retail death spiral. PageTurner should return to a books-only focus.",
            nextQuestionId: "q4b",
            scoreImpact: -5,
            feedback: "Books-only is a strategic dead end given the Amazon dynamic. The CEO is right that diversification was necessary — the execution of the category selection was the problem, not the direction. This recommendation would likely be rejected.",
          },
          {
            id: "c",
            text: "The category mix change explains $2-3M of the $29M profit decline. It is a contributing factor but not the primary driver. We should still investigate the occupancy costs which are a larger driver.",
            nextQuestionId: "q3a",
            scoreImpact: 10,
            feedback: "Correctly identifying that the mix shift is a secondary rather than primary driver and redirecting to occupancy is good analytical discipline. You're now combining both hypotheses for the full picture.",
          },
        ],
      },
      {
        id: "q3c",
        stage: "Root Cause",
        question: "The engagement has been unfocused. The senior manager pulls you aside: 'We have three days left before the board meeting. We need a clear diagnosis. What is the single most important finding?' What do you tell her?",
        options: [
          {
            id: "a",
            text: "The primary finding is occupancy: 38 lease renewals at nearly double the prior rate added $18M in annual costs — 62% of the total $29M profit decline. This is actionable because future renewals can be governed, and some high-cost locations can be exited.",
            nextQuestionId: "q4a",
            scoreImpact: 10,
            feedback: "Good. Even arriving here late, identifying the primary driver clearly and quantifying it gives the board what they need. The senior manager says 'that's the finding — now build the recommendation.'",
          },
          {
            id: "b",
            text: "The primary finding is that both Amazon competition and lease costs are contributing roughly equally to the profit decline — the board needs a dual response strategy.",
            nextQuestionId: "q4b",
            scoreImpact: 0,
            feedback: "Amazon affects revenue and PageTurner's revenue is flat — Amazon is context, not a direct driver of the profit decline. The P&L shows this is overwhelmingly a cost story. 'Dual response' dilutes the urgency of the real fix.",
          },
          {
            id: "c",
            text: "The primary finding is that PageTurner needs an e-commerce strategy to compete with Amazon before costs become irrelevant.",
            nextQuestionId: "q4c",
            scoreImpact: -10,
            feedback: "You've arrived at a competitive strategy recommendation after an engagement that was supposed to diagnose a margin problem. E-commerce won't fix $18M in lease cost in the next 3 years. The senior manager says 'that's the wrong conclusion from this data.'",
          },
        ],
      },
      {
        id: "q4a",
        stage: "Recommendation",
        question: "The board meeting is tomorrow. The senior manager asks you to prepare two recommendations with expected financial impact. You have the lease data and the category mix insight. What are your two recommendations?",
        options: [
          {
            id: "a",
            text: "Recommendation 1: Exit or renegotiate the 15-20 worst-performing high-rent stores — contribution margin analysis identifies these as the bottom quartile of the 38 renewed stores. Expected savings: $12-16M annually. Recommendation 2: Audit and rationalize the gift/café category mix — remove the lowest-margin SKUs and replace with higher-margin book adjacencies (journals, puzzles). Expected recovery: $4-6M in gross margin annually.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong board presentation. Two specific recommendations, each with quantified financial impact, addressing the two drivers identified in the analysis. The board approves proceeding to the next phase of the engagement.",
          },
          {
            id: "b",
            text: "Recommendation 1: Implement a lease governance policy — no renewal above $750K without board approval. Recommendation 2: Launch an e-commerce platform within 12 months to compete with Amazon.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "The lease governance policy is good but addresses future renewals, not the current $18M problem. The e-commerce recommendation is strategic but doesn't address the diagnosed cost issue and adds cost in the near term. The board will ask 'what about the existing 38 high-cost leases?'",
          },
          {
            id: "c",
            text: "Recommendation 1: Hire a new CFO with retail experience who can renegotiate leases more effectively. Recommendation 2: Raise book prices 10% to recover gross margin.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Management hires without operational diagnosis are weak recommendations. Raising book prices in a market where Amazon undercuts on price would accelerate the revenue decline. The board is unlikely to implement either recommendation as stated.",
          },
        ],
      },
      {
        id: "q4b",
        stage: "Recommendation",
        question: "The board pushes back on your recommendations. 'We can't close stores — we have long-term employees there. And the category diversification was deliberate. Can't we just grow our way out of this?' How do you respond?",
        options: [
          {
            id: "a",
            text: "To grow out of this problem, PageTurner would need to increase revenue by $97M (+23%) at current margins to recover the $29M in lost profit — that's significant in a market where the category is declining. Cost action is faster and more controllable. Store closures don't have to mean all employees are let go — the best employees can be redeployed to high-performing locations.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Quantifying the revenue growth needed to avoid cost action is exactly the right response to pushback. $97M in revenue growth at 30% gross margin = $29M profit. The board member who asked the question sits back — the math is sobering.",
          },
          {
            id: "b",
            text: "Agree with the board — closures are a last resort. Focus the recommendation on driving traffic to underperforming stores through events, local marketing, and community partnerships.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Capitulating to pushback without the math is not consulting. Events and community partnerships are unlikely to generate the $97M in incremental revenue needed to avoid cost action. The senior manager is visibly disappointed.",
          },
          {
            id: "c",
            text: "The board has the ultimate decision-making authority. Present both options — cost action and revenue investment — and let the board choose.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Presenting options without a recommendation is weak consulting. The board hired Deloitte for a recommendation, not a list of options. However, explicitly quantifying both paths is useful as supporting material.",
          },
        ],
      },
      {
        id: "q4c",
        stage: "Recommendation",
        question: "Your engagement has produced an e-commerce recommendation that the CFO thinks misses the point. The senior manager gives you one last chance: 'Build me a two-slide summary for the board — one slide diagnosis, one slide recommendation — that addresses what the P&L actually shows.' What goes on those two slides?",
        options: [
          {
            id: "a",
            text: "Slide 1: The $29M profit decline is 62% driven by occupancy cost increase ($18M from 38 lease renewals at 2x prior rates) and 10% from category mix shift to lower-margin gifts and café. Slide 2: Two actions — exit bottom-quartile high-rent stores (estimated recovery $12-16M) and optimize category mix to higher-margin adjacencies (estimated recovery $4-6M).",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Strong recovery. Clear diagnosis with attribution percentages, followed by two specific quantified recommendations. This is what the engagement should have produced from the beginning. The senior manager says 'this is what we needed three days ago.'",
          },
          {
            id: "b",
            text: "Slide 1: PageTurner faces a dual challenge from Amazon competition and rising operating costs. Slide 2: Three-pronged response — e-commerce investment, lease governance, and marketing programs.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "The diagnosis is vague and the three-pronged recommendation dilutes the urgency. 'Amazon competition' is context, not the proximate cause of the profit decline. The board will struggle to prioritize.",
          },
          {
            id: "c",
            text: "Slide 1: Revenue is flat but costs have risen $29M primarily due to lease renewals and wage inflation. Slide 2: Reduce costs through headcount reduction and lease renegotiation — target $29M in savings to restore full margin.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Labor is not the primary driver — it only rose $4M. Recommending headcount reduction based on a cost you didn't diagnose carefully is risky. The lease focus is right but the headcount element would create employee relations problems without the evidence to justify it.",
          },
        ],
      },
    ],
  },
];