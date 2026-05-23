export interface Exhibit {
  type: "table" | "chart" | "text";
  title: string;
  data: string;
}

export interface BranchOption {
  id: string;
  text: string;
  nextQuestionId: string | "end";
  scoreImpact: number;
  feedback: string;
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
  sampleRecommendation: string;
  idealRecommendation: string;
  keyTakeaways: string[];
}

export const GUIDED_CASES: GuidedCase[] = [

  // ─────────────────────────────────────────────
  // CASE G1: MCKINSEY — BREWCO PROFITABILITY
  // BEGINNER — 6 NODES
  // ─────────────────────────────────────────────
  {
    id: "g1",
    title: "BrewCo Profitability Crisis",
    type: "profitability",
    difficulty: "beginner",
    firm: "mckinsey",
    estimatedMinutes: 25,
    overview: "A mid-sized US coffee chain has seen its profit margin cut in half over two years despite growing revenue. McKinsey has been engaged to diagnose the issue.",
    clientBackground: "BrewCo operates 300 locations across the US. Revenue has grown 12% over two years from $420M to $470M. Net profit margin has fallen from 18% to 6%. The CEO believes competition is the primary cause. The CFO believes costs are out of control. You have been asked to lead the diagnostic workstream.",
    yourRole: "You are a McKinsey associate on your first week of the engagement. The partner has asked you to lead the diagnostic and present preliminary findings by end of week.",
    startQuestionId: "g1q1",
    finalRecommendationPrompt: "The CEO asks for your single most important recommendation. What do you tell him?",
    sampleRecommendation: "Launch a labor scheduling optimization program at the 100 new locations immediately, targeting a reduction from 35% to 26% labor-to-revenue within 90 days through demand-based shift scheduling. This single action recovers an estimated $40M in annual contribution margin and addresses the largest, most controllable cost driver identified in the diagnostic.",
    idealRecommendation: "BrewCo should immediately launch a labor scheduling optimization program targeting the 100 new locations that are operating at 35% labor-to-revenue vs the 23% benchmark. This single action, if executed well, recovers $35-45M in annual contribution margin — the largest and most controllable lever. Simultaneously, they should renegotiate their top 5 supplier contracts which represent 60% of the $43M COGS increase.",
    keyTakeaways: [
      "When revenue grows but margin falls, always separate same-store performance from total performance first",
      "Cost increases in two major buckets simultaneously often signal a management attention problem during rapid expansion",
      "New locations are structurally less efficient and need active management, not just time",
      "In food service, labor as a percentage of revenue is the single most controllable margin lever",
    ],
    questions: [
      {
        id: "g1q1",
        stage: "Problem Definition",
        question: "The partner briefs you before the first client meeting: revenue is up 12% but profit margin fell from 18% to 6% in two years. The CEO blames competition. The CFO blames costs. You have one hour. What do you do first?",
        context: "How you spend this hour will shape the entire engagement. Choose carefully.",
        options: [
          {
            id: "a",
            text: "Pull the last two years of P&L data and break every cost line into dollar change and percentage change. You want to know which specific buckets moved most before walking into the meeting.",
            nextQuestionId: "g1q2a",
            scoreImpact: 15,
            feedback: "Good instinct. You pull the P&L and see COGS up $43M (+34%) and labor up $32M (+29%) against only $50M in revenue growth (+12%). The cost picture is clear before the meeting starts.",
          },
          {
            id: "b",
            text: "Prepare a structured framework slide showing Profit equals Revenue minus Costs, with each branch decomposed into sub-drivers. You want to demonstrate a structured approach before touching the data.",
            nextQuestionId: "g1q2b",
            scoreImpact: 5,
            feedback: "A framework is useful for communication but delays data analysis. You walk in with a clean slide but no numbers. The CFO immediately asks which cost line is the problem and you cannot answer.",
          },
          {
            id: "c",
            text: "Research BrewCo's main competitors to understand what competitive moves might explain the margin compression, since the CEO specifically raised competition as the cause.",
            nextQuestionId: "g1q2c",
            scoreImpact: -5,
            feedback: "Revenue is up 12% — if competition were the primary cause, revenue would be flat or declining. The CEO's hypothesis does not fit the symptom pattern. You walk in without the cost picture.",
          },
        ],
      },
      {
        id: "g1q2a",
        stage: "Data Analysis",
        question: "You have the P&L. COGS is up $43M and labor is up $32M against only $50M in revenue growth. The partner asks: what is the single most important question this data raises that we do not yet know the answer to?",
        exhibit: {
          type: "table",
          title: "BrewCo P&L Summary (2021 vs 2023)",
          data: `| Line Item       | 2021  | 2023  | Change        |
|----------------|-------|-------|---------------|
| Revenue        | $420M | $470M | +$50M (+12%)  |
| COGS           | $126M | $169M | +$43M (+34%)  |
| Labor          | $109M | $141M | +$32M (+29%)  |
| Rent           | $42M  | $56M  | +$14M (+33%)  |
| Marketing      | $17M  | $19M  | +$2M (+12%)   |
| G&A            | $50M  | $56M  | +$6M (+12%)   |
| Net Profit     | $76M  | $28M  | -$48M (-63%)  |`,
        },
        options: [
          {
            id: "a",
            text: "Are these cost increases uniform across all 300 locations, or are they concentrated in the 100 new locations opened in the past two years?",
            nextQuestionId: "g1q3a",
            scoreImpact: 20,
            feedback: "This is the most diagnostic question. BrewCo expanded from 200 to 300 locations — if new locations are driving the cost increase, the problem is expansion-related inefficiency, not a systemic failure across the whole chain.",
          },
          {
            id: "b",
            text: "What has happened to commodity prices for coffee and dairy, since those inputs are most likely driving the COGS increase?",
            nextQuestionId: "g1q3b",
            scoreImpact: 10,
            feedback: "Commodity investigation is valid. The client shares data showing coffee bean prices rose 18% and dairy 22% — but BrewCo COGS rose 34%. That gap is important and needs explaining beyond commodity inflation alone.",
          },
          {
            id: "c",
            text: "Has BrewCo raised menu prices in line with cost inflation, and if not, what is the gap between price increases and cost increases?",
            nextQuestionId: "g1q3c",
            scoreImpact: 0,
            feedback: "Pricing addresses the revenue side. Revenue is already up 12%, so pricing is working to some degree. The more urgent question is why costs are growing nearly three times faster than revenue.",
          },
        ],
      },
      {
        id: "g1q2b",
        stage: "Data Analysis",
        question: "You are in the client meeting with your framework slide. The CFO drops a spreadsheet on the table: labor costs are completely out of control. The CEO pushes back: we opened 100 new locations, of course costs are up. The partner looks at you. How do you steer this?",
        options: [
          {
            id: "a",
            text: "Ask the CFO to walk through the labor data specifically — you want to know whether the increase is proportional to new locations or disproportionate relative to revenue growth.",
            nextQuestionId: "g1q3a",
            scoreImpact: 15,
            feedback: "Good recovery. The CFO shares that new locations are running at 35% labor-to-revenue versus 23% for mature locations — a significant gap that gives both executives a piece of the answer.",
          },
          {
            id: "b",
            text: "Side with the CEO — revenue is up 12%, which suggests the business is fundamentally healthy and the cost increases are a temporary expansion artifact that will normalize.",
            nextQuestionId: "g1q3c",
            scoreImpact: -10,
            feedback: "Siding with an executive without data is a credibility mistake. The CFO is visibly frustrated. You recover by asking for the numbers, but you have lost early credibility in the room.",
          },
          {
            id: "c",
            text: "Propose structuring the analysis into revenue and cost drivers before drawing conclusions, noting that both perspectives could be valid and need quantification.",
            nextQuestionId: "g1q3b",
            scoreImpact: 5,
            feedback: "Diplomatically neutral but slightly evasive. The executives wanted a steer, not a process suggestion. The partner takes over and you follow rather than lead.",
          },
        ],
      },
      {
        id: "g1q2c",
        stage: "Data Analysis",
        question: "Your competitive research shows that Starbucks and Dutch Bros both raised prices 8-10% over the same period. BrewCo raised prices 5%. The partner asks: what does this tell us about the margin problem?",
        options: [
          {
            id: "a",
            text: "It tells us BrewCo underpriced relative to the market, leaving margin on the table. The primary recommendation should be a price increase to close the gap with competitors.",
            nextQuestionId: "g1q3c",
            scoreImpact: -5,
            feedback: "You have identified a revenue opportunity but have not diagnosed why costs grew three times faster than revenue. The CFO says pricing is not the problem — the cost reports are the problem.",
          },
          {
            id: "b",
            text: "It partially explains the revenue side but does not explain why COGS and labor grew 34% and 29% against only 12% revenue growth. The cost structure needs investigation more urgently.",
            nextQuestionId: "g1q3a",
            scoreImpact: 10,
            feedback: "Good self-correction. You redirect to the cost question and the client shares a breakdown showing new locations are running at significantly higher cost ratios than mature ones.",
          },
          {
            id: "c",
            text: "It confirms that competition forced BrewCo to underprice, which compressed the revenue side and created a structural margin problem rooted in competitive dynamics.",
            nextQuestionId: "g1q3c",
            scoreImpact: -10,
            feedback: "BrewCo revenue is up 12% and volume is growing. A company hurt by competitive pricing pressure would show flat or declining revenue, not growth. The partner asks you to revisit the core assumption.",
          },
        ],
      },
      {
        id: "g1q3a",
        stage: "Deep Dive",
        question: "You receive the location-level breakdown. The 200 mature locations run at 23% labor-to-revenue and 27% COGS-to-revenue. The 100 new locations run at 35% labor-to-revenue and 38% COGS-to-revenue. Average new location age is 14 months. The CEO says: give them 18 months and they will look like the rest. How do you respond?",
        exhibit: {
          type: "table",
          title: "Location Cohort Comparison",
          data: `| Metric                    | Mature (200) | New (100) | Benchmark |
|--------------------------|--------------|-----------|-----------|
| Labor as % of revenue    | 23%          | 35%       | 24-26%    |
| COGS as % of revenue     | 27%          | 38%       | 28-30%    |
| Daily transactions       | 185          | 118       | n/a       |
| Avg location age         | 4.8 years    | 14 months | n/a       |
| Contribution margin      | 18%          | 4%        | n/a       |`,
        },
        options: [
          {
            id: "a",
            text: "Labor improving with volume and time has some merit — but the 38% COGS ratio at new locations is structurally higher than mature ones in a way that does not automatically self-correct. Those two problems have different causes and different solutions.",
            nextQuestionId: "g1q4a",
            scoreImpact: 20,
            feedback: "Excellent nuance. You have correctly separated the two cost problems. Labor efficiency improves with transaction volume, but COGS ratio gaps are often structural — driven by product mix differences or supplier terms. The client confirms new locations have a different menu mix with higher input costs.",
          },
          {
            id: "b",
            text: "Agree with the CEO — 14 months is early for a new location. Industry data supports an 18-24 month maturation cycle. The board should give it more time before making operational changes.",
            nextQuestionId: "g1q4b",
            scoreImpact: -5,
            feedback: "Maturation is real, but give it time is not a recommendation — it is a delay. The company is losing $48M in annual profit and the CFO needs action. The partner asks what management can actually do now.",
          },
          {
            id: "c",
            text: "Disagree with the CEO. New locations should be held to the same cost standards as mature ones immediately. The 35% labor ratio needs to come down through staffing reductions at the underperforming locations.",
            nextQuestionId: "g1q4c",
            scoreImpact: 5,
            feedback: "The instinct to act is right but the prescription is too blunt. Cutting staff at locations still ramping transaction volume could hurt service quality and slow the natural improvement. Smarter scheduling is a more precise lever than headcount cuts.",
          },
        ],
      },
      {
        id: "g1q3b",
        stage: "Deep Dive",
        question: "The client shares commodity data. Coffee bean prices are up 18% and dairy up 22% over two years. BrewCo COGS grew 34%. The gap between commodity inflation and COGS growth is roughly $15M. The CFO says: that gap is the real problem. What do you investigate next?",
        exhibit: {
          type: "table",
          title: "COGS Breakdown by Category",
          data: `| Category          | 2021  | 2023  | Change | Commodity Inflation |
|-------------------|-------|-------|--------|---------------------|
| Coffee and dairy  | $54M  | $89M  | +65%   | +18-22%             |
| Pastry and food   | $38M  | $52M  | +37%   | +15%                |
| Packaging         | $18M  | $22M  | +22%   | +18%                |
| Waste and spoilage| $16M  | $6M   | -63%   | n/a                 |
| Total COGS        | $126M | $169M | +34%   |                     |`,
        },
        options: [
          {
            id: "a",
            text: "Focus on coffee and dairy — it grew 65% against commodity inflation of only 18-22%. Volume from 100 new stores explains some increase, but the per-unit cost has also risen. Supplier contract terms and purchasing efficiency need examination.",
            nextQuestionId: "g1q4a",
            scoreImpact: 15,
            feedback: "Correct focus. The procurement team confirms that supplier contracts were renegotiated hurriedly during rapid expansion and BrewCo lost pricing leverage. The volume increase alone does not explain the 65% growth.",
          },
          {
            id: "b",
            text: "The waste reduction from $16M to $6M is a genuine success story. Accelerating this program across other cost categories could be the fastest path to margin recovery.",
            nextQuestionId: "g1q4b",
            scoreImpact: 0,
            feedback: "The waste reduction saves $10M annually which is meaningful, but it is dwarfed by the $35M gap in coffee and dairy costs. Focusing on the success story while the larger problem persists is a misallocation of attention.",
          },
          {
            id: "c",
            text: "Packaging at 22% growth is exactly in line with inflation, which confirms the procurement function is working well overall. Coffee and dairy must be a volume issue from new store openings, not a cost management failure.",
            nextQuestionId: "g1q4c",
            scoreImpact: -5,
            feedback: "Packaging at market rates does not validate overall procurement effectiveness. Coffee and dairy grew 65% against 18-22% commodity inflation — this is a significant cost management failure. The logic of using one category to excuse another does not hold.",
          },
        ],
      },
      {
        id: "g1q3c",
        stage: "Deep Dive",
        question: "You have been focused on the revenue and pricing side. Average ticket grew from $7.80 to $8.50 and transaction volume is up 14%. But margins keep falling. The partner says: you have been on revenue for a while and the CFO is getting impatient. What is your read on the cost situation?",
        options: [
          {
            id: "a",
            text: "Pivot to costs immediately. Ask for a breakdown of COGS and labor changes segmented by mature versus new locations so you can isolate whether this is an expansion problem or a systemic one.",
            nextQuestionId: "g1q3a",
            scoreImpact: 10,
            feedback: "Good course correction. You redirect to cost analysis and receive the location-level breakdown. New locations are running at significantly higher cost ratios and the diagnosis becomes much clearer from here.",
          },
          {
            id: "b",
            text: "Tell the partner that pricing is the primary lever and recommend a 7% menu price increase across all locations to close the gap between costs and revenue.",
            nextQuestionId: "g1q4c",
            scoreImpact: -10,
            feedback: "A 7% price increase has not been grounded in a cost diagnosis. You still do not know which costs are elevated or why. The CFO says that price increases are not working fast enough and the cost reports show the real problem.",
          },
          {
            id: "c",
            text: "Ask to see labor cost per transaction across all locations. If this number is rising, it indicates a productivity problem. If it is flat, the issue is likely volume-driven and will self-correct.",
            nextQuestionId: "g1q4a",
            scoreImpact: 5,
            feedback: "Good analytical instinct. Labor cost per transaction at new locations is $3.03 versus $2.00 at mature locations — a 52% premium. This is both a volume problem and a scheduling problem that requires active management.",
          },
        ],
      },
      {
        id: "g1q4a",
        stage: "Solution Design",
        question: "You now know that new locations have significantly higher labor and COGS ratios, and the COGS gap is partly structural due to supplier pricing and product mix differences. The CEO asks for something he can present to the board in two weeks. What do you recommend?",
        options: [
          {
            id: "a",
            text: "Three actions in sequence: launch labor scheduling optimization at new locations targeting 28% labor-to-revenue within six months; renegotiate the top five supplier contracts representing 60% of coffee and dairy spend; and pause new store openings until existing new locations reach mature economics.",
            nextQuestionId: "g1q5a",
            scoreImpact: 20,
            feedback: "Strong recommendation. Specific, sequenced, and addresses both cost buckets. The partner notes that pausing new openings should be framed as optimizing the existing portfolio rather than stopping growth to go over better with the board.",
          },
          {
            id: "b",
            text: "One focused action: close the bottom 20% of new locations by contribution margin. Concentrating resources on the better-performing 80% will improve overall portfolio metrics quickly and signal operational discipline to the board.",
            nextQuestionId: "g1q5b",
            scoreImpact: 5,
            feedback: "Closure is a valid lever but drastic for a first recommendation at an average location age of 14 months. The CEO asks: how do you know which ones will not recover? You need a more nuanced answer.",
          },
          {
            id: "c",
            text: "Raise prices 8% chain-wide to recover the margin gap. Combined with natural maturation of new stores over the next 12-18 months, this should restore margins toward the 12-15% range without requiring operational disruption.",
            nextQuestionId: "g1q5c",
            scoreImpact: -5,
            feedback: "Price increases without cost discipline is a temporary fix at best. If COGS is structurally elevated at new locations, raising prices does not address procurement or labor scheduling. The CFO says pricing has been tried and it is not enough.",
          },
        ],
      },
      {
        id: "g1q4b",
        stage: "Solution Design",
        question: "You have been patient on the maturation thesis. Sixteen months have now passed. Labor-to-revenue at new locations improved slightly from 35% to 32%. COGS-to-revenue at new locations is unchanged at 38%. The partner is now direct: maturation is not solving this. What specifically do you recommend?",
        options: [
          {
            id: "a",
            text: "The labor improvement shows maturation is working partially, but COGS not moving confirms a structural input cost problem. Recommend supplier contract renegotiation immediately and a product mix audit for the new location menu alongside the maturation path.",
            nextQuestionId: "g1q5a",
            scoreImpact: 10,
            feedback: "Good diagnosis even if delayed. Splitting the two cost problems and recognizing that labor will self-correct partially while COGS will not is the right insight. The client agrees to the supplier audit.",
          },
          {
            id: "b",
            text: "Close the conversation on maturation entirely. Recommend a comprehensive 15% cost reduction program across all 300 locations to restore margins to the pre-expansion baseline.",
            nextQuestionId: "g1q5b",
            scoreImpact: 0,
            feedback: "Blunt cost reduction across all locations would damage the 200 mature locations that are already performing well. A targeted approach focused specifically on new location inefficiencies is more precise and less operationally risky.",
          },
          {
            id: "c",
            text: "Recommend hiring a new COO with food service operations experience who can drive efficiency improvements across the portfolio more effectively than the current leadership team.",
            nextQuestionId: "g1q5c",
            scoreImpact: -10,
            feedback: "A management hire recommendation without an operational diagnosis is not sufficient. You have not identified what specific problems the new COO would fix or how. The CEO asks what they would actually do differently.",
          },
        ],
      },
      {
        id: "g1q4c",
        stage: "Solution Design",
        question: "The engagement is at risk of going off track. The partner pulls you aside: we need a clear recommendation by end of week or this engagement will not extend. What is the single most important thing BrewCo should do?",
        options: [
          {
            id: "a",
            text: "Labor scheduling optimization at the 100 new locations. Labor at 35% of revenue versus 23% for mature locations represents approximately $28M in recoverable annual savings. This is the largest, most controllable lever and can be implemented in 60-90 days.",
            nextQuestionId: "g1q5a",
            scoreImpact: 15,
            feedback: "Good recovery and clear prioritization. The partner agrees this is the right recommendation and says you should have arrived here faster, but the recommendation is correct and actionable.",
          },
          {
            id: "b",
            text: "A comprehensive review of the expansion strategy — BrewCo should not have opened 100 locations so quickly and the board needs to hear that from an independent advisor.",
            nextQuestionId: "g1q5b",
            scoreImpact: -5,
            feedback: "Critiquing past decisions without a forward-looking recommendation is not actionable. The 100 locations are already open. The question is what to do now, not whether the expansion was wise.",
          },
          {
            id: "c",
            text: "Revenue growth through a marketing investment at underperforming new locations. Driving transaction volume will solve the labor efficiency problem organically without requiring operational restructuring.",
            nextQuestionId: "g1q5c",
            scoreImpact: 0,
            feedback: "Driving volume is valid but slow and uncertain. Marketing investment at underperforming locations is expensive and the timeline to margin recovery would be 18-24 months. The CFO needs results in 90 days.",
          },
        ],
      },
      {
        id: "g1q5a",
        stage: "Implementation",
        question: "The CEO accepts your recommendation. He asks how to implement labor scheduling at new stores without hurting customer experience at locations still building their customer base.",
        options: [
          {
            id: "a",
            text: "Implement dynamic scheduling tied to transaction data — staff to projected demand curves rather than fixed shifts. New locations should staff up during peak hours and reduce during off-peak periods. This is a productivity fix, not a headcount cut.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Excellent. This recommendation preserves customer experience during peaks while removing cost during low-demand periods. It also creates a data-driven culture around labor management that will benefit all 300 locations long-term.",
          },
          {
            id: "b",
            text: "Reduce all new location shifts by one FTE immediately, accept slightly slower service in the near term, and monitor whether customer satisfaction scores change materially.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "This reduces costs but risks customer experience at the exact moment when new locations are building loyalty. Dynamic scheduling exists as a more precise alternative that avoids this tradeoff.",
          },
          {
            id: "c",
            text: "Freeze all new hiring at new locations and allow natural attrition to reduce headcount over the next 6-12 months to avoid the operational complexity of restructuring shifts.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Attrition-based reduction is slow and imprecise. You lose people in unpredictable patterns rather than where the labor savings are most needed. Better than immediate cuts but inferior to dynamic scheduling.",
          },
        ],
      },
      {
        id: "g1q5b",
        stage: "Implementation",
        question: "You have recommended closing some new locations. The CEO asks for the criteria — how do you decide which locations to close?",
        options: [
          {
            id: "a",
            text: "Use a three-factor model: current contribution margin, trajectory over the past six months (improving or flat), and local market potential. Locations scoring poorly on all three are the closure candidates.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good framework. Using trajectory alongside current performance avoids closing locations that are struggling but improving. Market potential protects strategically important locations that simply need more time.",
          },
          {
            id: "b",
            text: "Close the 20 locations with the lowest current revenue — this is objective, defensible to the board, and avoids complex multi-factor judgments.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Low revenue alone is insufficient. A low-revenue location in a growing market may be more valuable than a slightly higher-revenue location in a declining area. This criterion would produce some strategically poor closures.",
          },
          {
            id: "c",
            text: "Ask franchisee operators to self-select for voluntary exits before deciding on forced closures, to reduce friction and legal exposure.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Voluntary exits reduce friction but create adverse selection. Operators in the best locations will not volunteer, leaving you with a self-selected pool that does not match your strategic closure criteria.",
          },
        ],
      },
      {
        id: "g1q5c",
        stage: "Implementation",
        question: "The engagement winds down without a clear cost recommendation. The partner gives you candid debrief feedback: you spent too much time on revenue and pricing. If you could redo this engagement, what would you do differently in Week 1?",
        options: [
          {
            id: "a",
            text: "Start with the P&L breakdown on Day 1, segment by new versus mature locations immediately, and use cost data as the anchor for the entire engagement rather than following the CEO's competitive hypothesis.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Correct reflection. Following the client hypothesis rather than the data is a common associate mistake. COGS up 34% and labor up 29% against 12% revenue growth is a clear signal that should have redirected the analysis from the first day.",
          },
          {
            id: "b",
            text: "Interview more store managers to get a ground-level perspective on why costs are rising before presenting anything to the senior leadership team.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Store manager interviews are valuable but secondary to the quantitative diagnosis. Understanding the why in the field is useful once you know where to look, but starting there without data would have taken even longer to reach a conclusion.",
          },
          {
            id: "c",
            text: "Get the partner to facilitate CEO-CFO alignment earlier in the engagement since their disagreement slowed down progress and created confusion about what to prioritize.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "Executive alignment is important but the core problem was analytical, not political. The CEO-CFO disagreement was actually an opportunity to bring data into the room. You needed the data first and did not have it prepared.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE G2: BAIN — PIZZA MARKET SIZING
  // BEGINNER — 6 NODES
  // ─────────────────────────────────────────────
  {
    id: "g2",
    title: "SliceCo: US Pizza Market Sizing",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "bain",
    estimatedMinutes: 20,
    overview: "A PE firm is evaluating an investment in SliceCo, a regional pizza chain. Bain has been asked to size the US restaurant pizza market before the investment committee meets.",
    clientBackground: "SliceCo operates 240 locations in the Midwest with $180M in annual revenue and above-average unit economics. The PE firm wants to understand whether a national pizza brand is worth pursuing before committing capital to the expansion.",
    yourRole: "You are a Bain first-year associate. The partner needs a market size estimate in 45 minutes for a client call. This is your first solo sizing exercise.",
    startQuestionId: "g2q1",
    finalRecommendationPrompt: "The PE partner asks: should we invest in SliceCo's national expansion? Give a one-paragraph recommendation anchored in your market sizing.",
    sampleRecommendation: "Yes. The US restaurant pizza market is approximately $48-51B annually. SliceCo at $180M revenue holds roughly 0.37% market share with unit economics of $750K per location — 21% above the industry average of $620K. National expansion to 1,000 locations would represent $750M in revenue, a 4x opportunity while still holding under 2% market share. The key diligence condition is validating that Midwest unit economics replicate in new geographies before committing to a full national rollout.",
    idealRecommendation: "SliceCo is an attractive investment in a large, stable market. The US restaurant pizza market is approximately $48-51B. SliceCo's 0.37% share with above-average unit economics ($750K vs $620K benchmark) suggests room to scale. National expansion to 1,000 locations at $750K per location would mean $750M revenue — a 4x opportunity while still holding under 2% market share.",
    keyTakeaways: [
      "Always triangulate market sizing from two independent approaches and reconcile the difference",
      "Segment the market before sizing — restaurant pizza and frozen pizza are different businesses",
      "Market share framing converts a market size number into a strategic investment insight",
      "Unit economics per location tell you more about expansion potential than total revenue",
    ],
    questions: [
      {
        id: "g2q1",
        stage: "Structuring",
        question: "The partner drops the question on you: size the US pizza market. You have 45 minutes. Before calculating anything, how do you structure your approach?",
        context: "The partner is watching how you frame the problem. This is as important as the final number.",
        options: [
          {
            id: "a",
            text: "Define scope first — restaurant and delivery pizza only, excluding frozen and retail — then commit to two approaches: top-down from population and bottom-up from restaurant supply, and triangulate between them at the end.",
            nextQuestionId: "g2q2a",
            scoreImpact: 20,
            feedback: "Strong start. Defining scope and committing to triangulation are both marks of a rigorous analyst. The partner says: good, what are your two approaches going to be?",
          },
          {
            id: "b",
            text: "Start calculating immediately using US population times estimated pizza consumption frequency times average spend. Get a number fast, then pressure-test it against anything you know.",
            nextQuestionId: "g2q2b",
            scoreImpact: 5,
            feedback: "Moving fast is useful under time pressure but starting without defining scope risks sizing the wrong market. You get a number quickly but the partner asks whether this includes frozen pizza and you realize you have not thought about it.",
          },
          {
            id: "c",
            text: "Ask the partner what data sources are available before structuring — you want to know if you can reference industry reports or if this is a pure estimation exercise with no external anchors.",
            nextQuestionId: "g2q2c",
            scoreImpact: 0,
            feedback: "In a case interview you always assume no external data sources unless told otherwise. Asking for data before attempting an estimate signals low independence. The partner says: assume you have nothing. Estimate it.",
          },
        ],
      },
      {
        id: "g2q2a",
        stage: "Top-Down",
        question: "You have committed to a two-approach method. The partner asks: what are the three inputs you need for a top-down estimate of the US restaurant pizza market?",
        options: [
          {
            id: "a",
            text: "US population of 330M, frequency of restaurant or delivery pizza occasions per person per year estimated at 18-20 mixing all ages, and average spend per occasion of $13-15 with the pizza-only portion representing about 70% of the total ticket.",
            nextQuestionId: "g2q3a",
            scoreImpact: 15,
            feedback: "Clean decomposition. All three inputs are independently estimable and the pizza-only adjustment shows careful thinking about what actually counts as pizza market revenue.",
          },
          {
            id: "b",
            text: "Number of US households at 127M, annual household pizza spending estimated at $480-520 per year for households that order pizza, and the percentage of households that order pizza at least monthly estimated at about 55%.",
            nextQuestionId: "g2q3b",
            scoreImpact: 10,
            feedback: "Household-level sizing also works but introduces an extra complexity — you need to estimate household pizza-ordering penetration which is harder to anchor than per-capita frequency. Not wrong, but slightly more involved than needed.",
          },
          {
            id: "c",
            text: "Number of pizza restaurants estimated at 75,000, average annual revenue per restaurant estimated at $600-650K, and the percentage of revenue from dine-in versus delivery to confirm the split matters for total market sizing.",
            nextQuestionId: "g2q3c",
            scoreImpact: 5,
            feedback: "This is a bottom-up supply-side approach rather than top-down. Both are valid but you committed to top-down first. The partner notes the inconsistency and says: this is fine — it will be your cross-check.",
          },
        ],
      },
      {
        id: "g2q2b",
        stage: "Top-Down",
        question: "You started calculating quickly. Your first estimate: 330M people times 30 pizza occasions per year times $12 average spend equals $119B. The partner raises an eyebrow. That seems high. What have you included that you should not have?",
        options: [
          {
            id: "a",
            text: "The 30 occasions includes frozen pizza and grocery store pizza, which are a different market from restaurant and delivery. Removing those brings it to around $74B. Adjusting further for the fact that only the pizza portion of the ticket counts — roughly 68% — brings it closer to $50B.",
            nextQuestionId: "g2q3a",
            scoreImpact: 15,
            feedback: "Good self-correction under pressure. Walking through the adjustments clearly and arriving at a defensible $50B is solid work. The partner says: much better. Now cross-check it.",
          },
          {
            id: "b",
            text: "$119B might actually be right if you include all pizza-related spending across restaurants, delivery apps, frozen retail, school cafeterias, and corporate catering in the full definition of the market.",
            nextQuestionId: "g2q3c",
            scoreImpact: -10,
            feedback: "Defending an inflated number without questioning the inputs is a red flag. The US total restaurant industry is roughly $900B — pizza at $119B would mean pizza is 13% of all restaurant spending, which is not plausible. The partner is visibly unimpressed.",
          },
          {
            id: "c",
            text: "The 30 occasions per year is probably too high for the average American. Revising down to 20 occasions gives $79B — still seems high but closer to what feels reasonable intuitively.",
            nextQuestionId: "g2q3b",
            scoreImpact: 5,
            feedback: "Adjusting frequency downward is a valid move but misses the scope issue — frozen pizza is still included in the estimate. Frequency adjustment partially fixes the problem but does not fully resolve it.",
          },
        ],
      },
      {
        id: "g2q2c",
        stage: "Top-Down",
        question: "The partner confirms no data sources. Pure estimation only. You begin your top-down. After 10 minutes you have an estimate of $85B. The partner says: that is too high. Walk me through where you went wrong.",
        exhibit: {
          type: "table",
          title: "Your Working (Shown to Partner)",
          data: `| Input               | Your Estimate          |
|---------------------|------------------------|
| US population       | 330M                   |
| Pizza occasions/yr  | 35                     |
| Avg spend/occasion  | $12                    |
| Raw estimate        | $138.6B                |
| Restaurant adj x62% | $85.9B                 |`,
        },
        options: [
          {
            id: "a",
            text: "35 occasions is too high — that is more than once per week for every American including children and elderly. A realistic restaurant or delivery estimate for the adult population is 18-20 per year. That revision brings the estimate to roughly $50B.",
            nextQuestionId: "g2q3a",
            scoreImpact: 10,
            feedback: "Good catch on the frequency assumption. Anchoring to more than once a week for everyone is the intuition check that exposes the error. Revised to $50B is in the right range.",
          },
          {
            id: "b",
            text: "The 62% restaurant adjustment is too conservative — frozen pizza represents closer to 25% of occasions, not 38%. Raising the restaurant share to 75% gives about $104B which seems more defensible.",
            nextQuestionId: "g2q3c",
            scoreImpact: -5,
            feedback: "Adjusting one assumption to make the number feel more comfortable without questioning the frequency input is not rigorous. The frequency of 35 occasions is the real problem. At $104B, pizza would be over 11% of all US restaurant sales, which is not plausible.",
          },
          {
            id: "c",
            text: "The $12 average spend per occasion is too low — pizza delivery orders typically average $25-30. Revising the spend upward would actually increase the estimate further, suggesting the framework itself is wrong.",
            nextQuestionId: "g2q3b",
            scoreImpact: -10,
            feedback: "Revising spend upward moves the number in the wrong direction — the estimate is already too high. This would compound the error rather than correct it. The problem is frequency, not spend.",
          },
        ],
      },
      {
        id: "g2q3a",
        stage: "Cross-Check",
        question: "Your top-down estimate is $48-52B for restaurant pizza. The partner asks for your bottom-up cross-check. You estimate 78,000 pizza restaurants and delivery operations in the US. What average annual revenue per location do you use?",
        options: [
          {
            id: "a",
            text: "Segment the estimate — large chain locations like Domino's and Pizza Hut average $900K-$1M annually while independent pizzerias average $400-500K. A weighted average across the mix comes to approximately $620-650K. Bottom-up total: 78,000 times $635K equals $49.5B.",
            nextQuestionId: "g2q4a",
            scoreImpact: 20,
            feedback: "Excellent segmented approach. Differentiating chain versus independent unit economics is exactly right. $49.5B is very close to the $48-52B top-down estimate. Strong triangulation that validates your number.",
          },
          {
            id: "b",
            text: "Use a single average of $600K for all pizza restaurants without segmenting between chains and independents. 78,000 times $600K equals $46.8B — close enough to the top-down estimate to validate it.",
            nextQuestionId: "g2q4b",
            scoreImpact: 10,
            feedback: "A single average is less precise but gives you a number in the right range. $46.8B is close to the $48-52B top-down. The partner would prefer a segmented approach but accepts this as a valid cross-check.",
          },
          {
            id: "c",
            text: "Use $1M per location as the average for restaurant operations. 78,000 times $1M equals $78B, which suggests the top-down estimate was too conservative and the real market is larger.",
            nextQuestionId: "g2q4c",
            scoreImpact: -5,
            feedback: "$1M is too high — that is the average for full-service restaurants generally, not pizza specifically. Pizza delivery operations and small independents bring the average down significantly. This inflates the estimate and undermines the triangulation.",
          },
        ],
      },
      {
        id: "g2q3b",
        stage: "Cross-Check",
        question: "Your top-down estimate landed around $70B using household-level sizing. The partner asks for the bottom-up cross-check. Your estimate using 78,000 locations at $620K average gives $48.4B. What does the discrepancy tell you?",
        options: [
          {
            id: "a",
            text: "The $22B gap suggests my household sizing over-counted somewhere — probably the penetration rate or annual spend per household was too high. The supply-side estimate of $48B is more grounded in observable restaurant economics. I would revise toward $48-51B as the more reliable range.",
            nextQuestionId: "g2q4a",
            scoreImpact: 15,
            feedback: "Good triangulation discipline. Recognizing that the lower supply-side estimate is more grounded in observable data — because restaurant revenue is more measurable than household survey estimates — is mature analytical thinking.",
          },
          {
            id: "b",
            text: "The $22B discrepancy means one estimate is wrong but I am not sure which one. I will present a range of $48-70B to cover both and let the partner decide which end is more credible.",
            nextQuestionId: "g2q4b",
            scoreImpact: 0,
            feedback: "A $22B range is not useful — it is so wide as to be unhelpful for investment decisions. When two estimates diverge materially you need to diagnose which assumption is wrong, not simply widen the range.",
          },
          {
            id: "c",
            text: "The higher top-down estimate is probably right — more data points support a larger market and a bigger market makes the investment thesis more compelling for the PE firm.",
            nextQuestionId: "g2q4c",
            scoreImpact: -10,
            feedback: "Choosing the higher estimate because it supports the investment thesis is confirmation bias. The analyst's job is to follow the data to the most accurate estimate, not to produce a number that supports a desired conclusion.",
          },
        ],
      },
      {
        id: "g2q3c",
        stage: "Cross-Check",
        question: "You have been working bottom-up all along. Your estimate: 78,000 locations times $620K average equals $48.4B. The partner asks for the top-down to cross-check it. You need to quickly build a population-based estimate.",
        options: [
          {
            id: "a",
            text: "330M people times 18 restaurant or delivery pizza occasions per year times $8.50 net pizza revenue per occasion excluding beverages and sides equals $50.4B. That is very close to the $48.4B bottom-up — good triangulation confirming the estimate.",
            nextQuestionId: "g2q4a",
            scoreImpact: 10,
            feedback: "Clean top-down built quickly. $50.4B versus $48.4B is a 4% difference — excellent triangulation. Final estimate: approximately $48-51B for US restaurant pizza.",
          },
          {
            id: "b",
            text: "I do not have time to build a rigorous top-down in the remaining minutes. The bottom-up estimate of $48.4B based on actual restaurant economics is more reliable than consumer survey estimates anyway.",
            nextQuestionId: "g2q4b",
            scoreImpact: 5,
            feedback: "Bottom-up is indeed grounded, but declining to triangulate when the partner explicitly asked for a cross-check is not the right response. You should attempt it even imperfectly.",
          },
          {
            id: "c",
            text: "330M times 30 occasions times $12 average spend equals $119B, adjusted by 60% for restaurant only equals $71B. This does not match the $48.4B well, so I will use a midpoint of $60B as the final estimate.",
            nextQuestionId: "g2q4c",
            scoreImpact: -5,
            feedback: "The 30 occasions figure includes frozen pizza and is too high for restaurant-specific sizing. Using a midpoint when two estimates diverge significantly masks an input error that should be corrected rather than averaged away.",
          },
        ],
      },
      {
        id: "g2q4a",
        stage: "Investment Implication",
        question: "Your triangulated estimate is $48-51B. The partner asks: SliceCo has $180M in revenue. What does that tell us about the investment opportunity?",
        options: [
          {
            id: "a",
            text: "SliceCo has 0.37% market share in a $49B market. Their $750K average revenue per location is 21% above the $620K industry average, which signals above-average unit economics. If they maintain $750K at national scale, 1,000 locations would equal $750M revenue — roughly a 4x opportunity while still holding under 2% market share.",
            nextQuestionId: "g2q5a",
            scoreImpact: 20,
            feedback: "Excellent. You have converted the market size into a strategic insight. The unit economics comparison is particularly strong — above-average performance per location is exactly what PE investors want to see before backing a scaling strategy.",
          },
          {
            id: "b",
            text: "SliceCo is extremely small at 0.37% share in a market dominated by Domino's, Pizza Hut, and Papa John's. Growing to meaningful national share against these incumbents will be extremely difficult for a regional operator.",
            nextQuestionId: "g2q5b",
            scoreImpact: 0,
            feedback: "The competitive concern is valid context but misses the strategic framing. 0.37% of a $50B market means there is enormous room to grow without taking significant share from incumbents. Growing from 0.37% to 2% is still a $1B business in a large market.",
          },
          {
            id: "c",
            text: "SliceCo is too small to matter at the national level. At $180M they are below the scale threshold for meaningful PE returns. The PE firm should look at larger acquisition targets with more established national presence.",
            nextQuestionId: "g2q5c",
            scoreImpact: -10,
            feedback: "This conclusion inverts the logic of market sizing entirely. Small current share in a large market combined with above-average unit economics is exactly the PE investment thesis. This framing would lead to never investing in growth companies.",
          },
        ],
      },
      {
        id: "g2q4b",
        stage: "Investment Implication",
        question: "Your estimate has some uncertainty in the range. The partner asks: the IC wants a single number for the deck. What do you give them?",
        options: [
          {
            id: "a",
            text: "$49B as the central estimate with a note that the reasonable range is $46-53B depending on how delivery-only operations are counted. Provide the single number but be transparent about the assumption sensitivity.",
            nextQuestionId: "g2q5a",
            scoreImpact: 15,
            feedback: "Exactly right. A single central estimate with explicit uncertainty bounds is what IC presentations require. Hiding the range would be misleading; refusing to give a number would be unhelpful. The partner says: perfect.",
          },
          {
            id: "b",
            text: "Give the range of $46-53B and let IC members use whichever end supports their view of the investment attractiveness and risk profile.",
            nextQuestionId: "g2q5b",
            scoreImpact: 0,
            feedback: "Presenting a range and letting IC members pick the end that supports their prior view is analytically passive. The analyst's job is to give the best estimate and defend it, not to provide optionality for confirmation bias.",
          },
          {
            id: "c",
            text: "Round up to $55B to give the investment a larger addressable market — the uncertainty in the estimate justifies a conservative upper bound for the opportunity framing.",
            nextQuestionId: "g2q5c",
            scoreImpact: -15,
            feedback: "Inflating a market estimate to make an investment look more attractive is an analytical integrity failure. If discovered it destroys credibility. The partner says: never round in a direction that supports the conclusion you want to reach.",
          },
        ],
      },
      {
        id: "g2q4c",
        stage: "Investment Implication",
        question: "Your market estimate has been imprecise. The partner shares that industry data shows the US restaurant pizza market is approximately $46B. How far off were you and what does that tell you about your method?",
        options: [
          {
            id: "a",
            text: "If my estimate was $60B, I was about 30% above the actual number. The error most likely came from the frequency assumption — 30 occasions per person per year was too high for restaurant-specific sizing. For future cases I would anchor frequency to a concrete time period: how often does the average adult order pizza from a restaurant, then convert to annual.",
            nextQuestionId: "g2q5a",
            scoreImpact: 10,
            feedback: "Good post-mortem. Identifying the specific input that caused the error and proposing a concrete calibration for next time is how analysts improve. The partner says: exactly right — frequency is the hardest input to get right in consumer market sizing.",
          },
          {
            id: "b",
            text: "30% off is within acceptable range for a market sizing exercise. The purpose is to get the order of magnitude right, not the exact number, and $60B versus $46B is the same order of magnitude.",
            nextQuestionId: "g2q5b",
            scoreImpact: 5,
            feedback: "True that exactness is not the goal, but 30% off without diagnosing why is a missed learning opportunity. The partner wants to see you identify and fix the specific input error, not rationalize the miss as acceptable.",
          },
          {
            id: "c",
            text: "I would challenge the $46B industry figure — market definitions vary significantly and my $60B estimate may capture distribution and catering channels that the industry benchmark excludes from its scope.",
            nextQuestionId: "g2q5c",
            scoreImpact: -5,
            feedback: "Defending a wrong estimate by questioning the benchmark is intellectually dishonest. In a real engagement you would use the industry data. The market sizing exercise exists for situations where you do not have that data. Learn from the error rather than explaining it away.",
          },
        ],
      },
      {
        id: "g2q5a",
        stage: "Final View",
        question: "The IC asks the final question: based on your market sizing, is the national expansion of SliceCo a good bet?",
        options: [
          {
            id: "a",
            text: "Yes, conditionally. The $49B market and SliceCo's 0.37% share with above-average unit economics support the thesis. National rollout to 1,000 locations would mean $750M revenue — 4x current size while still under 2% share. The condition is validating that Midwest unit economics replicate in new geographies before committing to full national scale.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong final answer. Conditional yes with specific evidence, quantified upside, and the critical diligence question. This is the IC answer that gets funded and earns follow-on work.",
          },
          {
            id: "b",
            text: "Yes. The market is large and growing, SliceCo has strong unit economics, and national expansion is clearly attractive for the PE return profile given the current scale.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Directionally right but lacks the quantitative backing that makes a recommendation compelling to an IC. Large and growing is vague — $49B at 0.37% current share with a 4x upside to 2% is the specific version of that statement.",
          },
          {
            id: "c",
            text: "Maybe. There are too many unknowns about whether SliceCo can compete nationally against Domino's and Pizza Hut to make a confident directional recommendation at this stage.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Maybe is not an investment recommendation. The IC needs a view with supporting rationale. Uncertainty is real but the analyst's job is to make the best recommendation given available data, not to withhold one out of caution.",
          },
        ],
      },
      {
        id: "g2q5b",
        stage: "Final View",
        question: "The IC pushes back: you have given a range and a qualified maybe. We need a number and a view. What is your recommendation under pressure?",
        options: [
          {
            id: "a",
            text: "Commit to $49B as the central estimate and to an invest recommendation contingent on geography validation. The uncertainty in the range does not change the order of magnitude of the opportunity or the quality of the unit economics signal.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good recovery under pressure. Committing to a number and a view while being transparent about residual uncertainty is exactly what IC presentations require.",
          },
          {
            id: "b",
            text: "Explain that the range reflects genuine analytical uncertainty and recommend the IC commission additional primary research before making the investment decision.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Calling for more research when the IC is ready to decide is a consulting failure. You had the tools to size this market — own the estimate and make the recommendation.",
          },
          {
            id: "c",
            text: "Ask the IC what market size would make the investment compelling and work backward from that number to validate whether it is achievable under reasonable assumptions.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "Working backward from a desired conclusion to validate the analysis is the definition of biased analysis. This would be a serious credibility failure in any professional context.",
          },
        ],
      },
      {
        id: "g2q5c",
        stage: "Final View",
        question: "The partner gives direct feedback: your sizing was imprecise and the investment framing was weak. Given that, what should the PE firm actually do with SliceCo?",
        options: [
          {
            id: "a",
            text: "Despite imprecision in the sizing, the key directional insight is clear: SliceCo's unit economics at $750K per location are above the industry average. That is the real signal. Even if the market is $40B rather than $60B, above-average unit economics in a fragmented market is a sound PE thesis. Recommend conditional investment with geography validation as the primary diligence step.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Good recovery. Redirecting to the most signal-rich data point — unit economics — and giving a clear conditional recommendation despite sizing imprecision is the right move. The partner says: the unit economics are the real insight here.",
          },
          {
            id: "b",
            text: "The sizing was imprecise so I am not comfortable making an investment recommendation. The PE firm should engage a specialist research firm before proceeding with the investment decision.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Refusing to make a recommendation because your analysis was imperfect is not acceptable. PE firms invest under imperfect information constantly. The investment decision should be based on the available evidence, not on whether the analyst model was perfect.",
          },
          {
            id: "c",
            text: "Recommend against the investment — if the market size is difficult to pin down, the competitive dynamics and expansion risks are also likely too uncertain to underwrite.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Market sizing uncertainty is a normal feature of early-stage diligence, not a reason to pass. The investment decision should be driven by the unit economics signal and the expansion thesis, not by the analyst's confidence in a single market sizing estimate.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE G3: DELOITTE — BOOKSTORE PROFITABILITY
  // BEGINNER — 6 NODES
  // ─────────────────────────────────────────────
  {
    id: "g3",
    title: "PageTurner: Bookstore Margin Crisis",
    type: "profitability",
    difficulty: "beginner",
    firm: "deloitte",
    estimatedMinutes: 22,
    overview: "A regional bookstore chain has seen profit margin fall from 10% to 3% over three years while revenue stayed flat. Deloitte has been asked to diagnose the issue before a board meeting.",
    clientBackground: "PageTurner operates 85 bookstores across the Southeast US. Revenue has been stable at $420M for three years. Net profit fell from $42M to $12.6M — a $29M decline. The CEO believes the Amazon competitive dynamic is the root cause. The CFO believes lease renewals are killing the business. The board meets in one week.",
    yourRole: "You are a Deloitte consultant on your second engagement. The senior manager needs a clear diagnosis and two recommendations before the board meeting.",
    startQuestionId: "g3q1",
    finalRecommendationPrompt: "What are your two most important recommendations to PageTurner's board? Be specific about expected financial impact.",
    sampleRecommendation: "First, renegotiate or exit the 15-20 highest-cost renewed leases — occupancy costs grew $18M (+47%) when 38 leases renewed at nearly double prior rates, representing 62% of the total profit decline. Targeting exits at the bottom-quartile locations by contribution margin could recover $12-16M annually. Second, audit the gift and café category mix added to offset declining book revenue — the margin gap between books and these new categories explains $3-5M of the remaining decline.",
    idealRecommendation: "Two recommendations: (1) Renegotiate or exit the 38 locations with above-benchmark lease rates. Occupancy costs grew $18M (+47%) driven by lease renewals at 2x prior rates. Exit the bottom 15-20 locations by contribution margin. Estimated annual recovery: $14-18M. (2) Audit the category mix — book revenue was replaced by lower-margin gift and café revenue, diluting gross margin by an estimated $3-5M annually.",
    keyTakeaways: [
      "Flat revenue can mask major underlying shifts in category mix and cost structure",
      "Lease renewals are a hidden driver of retail margin deterioration that compounds silently",
      "Category mix changes have margin consequences that are often not modeled before launch",
      "Retail diagnostics should segment by location economics, not just total portfolio averages",
    ],
    questions: [
      {
        id: "g3q1",
        stage: "Problem Definition",
        question: "Revenue is flat at $420M but profit fell from $42M to $12.6M — a $29M decline over three years. The CEO blames Amazon. The CFO blames leases. You have 30 minutes before the client call. What do you look at first?",
        options: [
          {
            id: "a",
            text: "Pull the full P&L with every cost line for all three years and sort by dollar change. Find the largest movers before the call so you walk in with data rather than hypotheses.",
            nextQuestionId: "g3q2a",
            scoreImpact: 15,
            feedback: "Right instinct. The P&L breakdown arrives showing occupancy up $18M (+47%), COGS up $8M (+3%), and labor up $4M (+6%). The occupancy increase stands out immediately — 47% growth on a cost line for a chain with the same number of stores is unusual.",
          },
          {
            id: "b",
            text: "Research Amazon's impact on the US bookstore industry over the same three years to evaluate the CEO's hypothesis before walking into the client meeting.",
            nextQuestionId: "g3q2b",
            scoreImpact: 0,
            feedback: "Amazon research is relevant context, but revenue is flat — not declining. If Amazon were the primary cause you would expect revenue to have fallen. You walk in with industry context but without the cost picture.",
          },
          {
            id: "c",
            text: "Ask the senior manager for her hypothesis since she has been on the engagement longer and her view will save preparation time before the call.",
            nextQuestionId: "g3q2c",
            scoreImpact: -5,
            feedback: "Asking for the answer before looking at the data is not independent thinking. The senior manager says she wants to see what you come up with first. You walk into the call with nothing to show.",
          },
        ],
      },
      {
        id: "g3q2a",
        stage: "Data Analysis",
        question: "You have the P&L. Occupancy is up $18M (+47%), COGS up $8M, labor up $4M. The CFO says: I told you — it is the leases. The CEO says: leases are what they are, people just are not buying books like they used to. How do you evaluate both views?",
        exhibit: {
          type: "table",
          title: "PageTurner P&L Three-Year Change",
          data: `| Cost Line  | Year 1 | Year 3 | Change        |
|-----------|--------|--------|---------------|
| COGS      | $252M  | $260M  | +$8M (+3%)    |
| Labor     | $63M   | $67M   | +$4M (+6%)    |
| Occupancy | $38M   | $56M   | +$18M (+47%)  |
| Marketing | $8M    | $9M    | +$1M (+12%)   |
| G&A       | $17M   | $15M   | -$2M (-12%)   |
| Total     | $378M  | $407M  | +$29M (+8%)   |
| Revenue   | $420M  | $420M  | $0            |
| Net Profit| $42M   | $13M   | -$29M         |`,
        },
        options: [
          {
            id: "a",
            text: "Ask the CFO for the lease renewal data specifically — how many leases renewed and at what rate change. If 38 leases renewed at $560K pre-renewal and $1.1M post-renewal, that is $20.5M in additional annual cost which closely explains the $18M net increase.",
            nextQuestionId: "g3q3a",
            scoreImpact: 20,
            feedback: "Excellent diagnostic instinct. The lease data confirms 38 renewals at near-double the prior rate. This is the primary driver and it is a fixable problem. The CFO is right, though the CEO's Amazon concern may explain why revenue is not growing to offset it.",
          },
          {
            id: "b",
            text: "Ask for revenue breakdown by category — if book sales are declining and being replaced by gift or café revenue at lower margins, the CEO's concern could be showing up in the mix even though total revenue looks flat.",
            nextQuestionId: "g3q3b",
            scoreImpact: 10,
            feedback: "Category mix is a valid line of inquiry. The data shows book revenue fell $22M and was replaced by gift, café, and event revenue at 5-8 percentage points lower gross margin. Good insight, though occupancy is the larger driver in dollar terms.",
          },
          {
            id: "c",
            text: "Tell both executives that both factors are likely contributing and request two weeks to build a full attribution model before drawing any conclusions for the board.",
            nextQuestionId: "g3q3c",
            scoreImpact: -10,
            feedback: "Two weeks is not possible with a board meeting in one week. You need a preliminary view now. Both are contributing without any quantification is not useful analysis. The senior manager steps in to fill the gap.",
          },
        ],
      },
      {
        id: "g3q2b",
        stage: "Data Analysis",
        question: "Your Amazon research shows that US bookstore industry revenue fell 8% over the same three years — but PageTurner's revenue was flat. The CFO says: we have actually beaten the market. The problem is costs, not revenue. How do you respond?",
        options: [
          {
            id: "a",
            text: "Agree with the CFO's logic and pivot to the P&L. If revenue beat the industry decline and profits still fell dramatically, the issue must be on the cost side. Ask for the full cost breakdown before making further hypotheses.",
            nextQuestionId: "g3q3a",
            scoreImpact: 10,
            feedback: "Good recovery. Updating your view based on the CFO's insight and pivoting to cost analysis is the right move. You are now on the correct track even though you started slightly off.",
          },
          {
            id: "b",
            text: "Challenge the CFO's logic — flat revenue when the market fell 8% could mean PageTurner added lower-margin categories to compensate for book sales decline, creating a hidden margin problem inside stable total revenue.",
            nextQuestionId: "g3q3b",
            scoreImpact: 15,
            feedback: "Excellent insight. You have connected the Amazon trend to a potential mix shift explanation, and you are right. PageTurner did add lower-margin categories to offset declining book sales. This is a sophisticated reading of flat revenue data.",
          },
          {
            id: "c",
            text: "Agree with the CEO that Amazon is the real problem and recommend an e-commerce investment to build a competing online channel for PageTurner's loyal customers.",
            nextQuestionId: "g3q3c",
            scoreImpact: -10,
            feedback: "Recommending an e-commerce investment based on a preliminary hypothesis before looking at the P&L is jumping to solutions. The CFO points out that costs are the measurable problem and an e-commerce platform will only add costs in the near term.",
          },
        ],
      },
      {
        id: "g3q2c",
        stage: "Data Analysis",
        question: "The senior manager shares her hypothesis: probably the leases, we saw this in another retail client last year. The client call begins. The CEO opens: I want to understand why our margins are being destroyed despite what I consider strong operations. How do you begin?",
        options: [
          {
            id: "a",
            text: "Ask the client to walk through cost changes over three years line by line. You want to hear their perspective on where costs have moved before sharing any hypothesis from the outside.",
            nextQuestionId: "g3q3a",
            scoreImpact: 10,
            feedback: "Client-led cost walkthrough is a valid approach. The CFO immediately highlights the occupancy increase and the lease renewal data emerges naturally from the conversation.",
          },
          {
            id: "b",
            text: "Present the lease hypothesis directly: based on our initial review we believe lease renewals may be a primary driver. Can you share data on how many leases renewed in the past three years and at what rates?",
            nextQuestionId: "g3q3b",
            scoreImpact: 5,
            feedback: "Presenting a hypothesis as a question is fine. The client confirms lease renewals are a factor — but they also reveal a category mix change you might have missed if you only investigated leases.",
          },
          {
            id: "c",
            text: "Open with the CEO's concern about Amazon and frame the engagement as a competitive response strategy to help PageTurner defend its market position against digital disruption.",
            nextQuestionId: "g3q3c",
            scoreImpact: -5,
            feedback: "Framing the engagement around a competitive hypothesis when the symptom is cost-driven delays the real diagnosis. The CFO checks out of the conversation visibly.",
          },
        ],
      },
      {
        id: "g3q3a",
        stage: "Root Cause",
        question: "Lease data confirmed: 38 of 85 stores renewed leases at $1.1M average versus $560K previously — a $540K per store increase times 38 stores equals $20.5M, explaining the $18M net occupancy increase. The CEO asks: so what do we do? We cannot renegotiate signed leases.",
        options: [
          {
            id: "a",
            text: "Three actions: for upcoming renewals, establish a board-approval requirement for any lease above $800K per year; for current high-cost leases, evaluate each by contribution margin and exit the bottom 15-20 through subletting or early termination; and explore co-tenancy arrangements where two retailers share a single location.",
            nextQuestionId: "g3q4a",
            scoreImpact: 20,
            feedback: "Excellent. Three concrete sequenced actions that address the immediate problem, the ongoing governance failure, and a creative alternative. The board will respond well to this level of specificity.",
          },
          {
            id: "b",
            text: "Drive revenue growth at the high-cost stores to justify the new lease rates. A targeted marketing investment at the 38 stores with the highest rent increases could bring in the traffic needed to make the economics work.",
            nextQuestionId: "g3q4b",
            scoreImpact: 0,
            feedback: "Revenue growth at high-cost stores is directionally valid but slow and uncertain. At $1.1M in rent, a store needs roughly $4.4M in incremental revenue at current margins just to break even on the lease increase. Marketing alone is unlikely to close that gap quickly.",
          },
          {
            id: "c",
            text: "Recommend moving all future lease renewals to shorter terms of one to two years instead of five to seven years to preserve flexibility. The current problem cannot be fixed, but this prevents it from compounding.",
            nextQuestionId: "g3q4c",
            scoreImpact: 5,
            feedback: "Shorter lease terms is a valid governance recommendation but does not address the current $18M problem. The board needs both a near-term fix for existing high-cost leases and a governance change — not just the governance change alone.",
          },
        ],
      },
      {
        id: "g3q3b",
        stage: "Root Cause",
        question: "Revenue breakdown reveals that book revenue fell $22M and was replaced by gift, café, and event revenue. Gross margin on books is 42%. Gross margin on gifts is 34%. Gross margin on café is 28%. The CEO asks: we diversified deliberately to offset Amazon. Are you saying we made a mistake?",
        options: [
          {
            id: "a",
            text: "Not necessarily a strategic mistake — but the margin math was not modeled before launch. Replacing $22M of book revenue at 42% gross margin with $22M of gift and café revenue at 28-34% gross margin costs roughly $1.8-3M in gross profit annually. The diversification needs margin-conscious category selection going forward.",
            nextQuestionId: "g3q4a",
            scoreImpact: 15,
            feedback: "Nuanced and credible. You acknowledge the strategic logic while identifying the implementation gap. This is how Deloitte consultants maintain credibility while delivering difficult news to a client who is defensive about a past decision.",
          },
          {
            id: "b",
            text: "Yes — the diversification was a strategic mistake. Adding lower-margin categories to compensate for volume loss is a well-documented retail death spiral. PageTurner should return to a books-only focus and compete on depth of selection and community.",
            nextQuestionId: "g3q4b",
            scoreImpact: -5,
            feedback: "Books-only is a strategic dead end given the Amazon dynamic. The CEO is right that diversification was necessary to survive. The category selection was the problem, not the direction. This recommendation would almost certainly be rejected.",
          },
          {
            id: "c",
            text: "The category mix change explains about $2-3M of the $29M profit decline and is a secondary driver. The larger driver is still occupancy and we should redirect our diagnostic focus there.",
            nextQuestionId: "g3q3a",
            scoreImpact: 10,
            feedback: "Correctly identifying mix shift as a secondary driver and redirecting to the larger occupancy issue is good analytical discipline. You are now combining both hypotheses to build a complete picture for the board.",
          },
        ],
      },
      {
        id: "g3q3c",
        stage: "Root Cause",
        question: "The engagement has been unfocused. The senior manager pulls you aside with three days left before the board meeting: we need a clear diagnosis right now. What is the single most important finding?",
        options: [
          {
            id: "a",
            text: "The primary finding is occupancy: 38 lease renewals at nearly double prior rates added $18M in annual costs, representing 62% of the total $29M profit decline. This is actionable because future renewals can be governed differently and some high-cost locations can be exited.",
            nextQuestionId: "g3q4a",
            scoreImpact: 10,
            feedback: "Good. Even arriving here late, identifying the primary driver clearly and quantifying its share of the total problem gives the board what they need. The senior manager says: that is the finding — now build the recommendation.",
          },
          {
            id: "b",
            text: "Both Amazon competition and lease costs are contributing roughly equally to the profit decline, and the board needs a dual response strategy that addresses both simultaneously.",
            nextQuestionId: "g3q4b",
            scoreImpact: 0,
            feedback: "Amazon affects industry revenue and PageTurner's revenue is flat — Amazon is context, not a direct driver of the profit decline. The P&L shows this is overwhelmingly a cost story. A dual response dilutes urgency around the actionable fix.",
          },
          {
            id: "c",
            text: "The primary finding is that PageTurner needs an e-commerce strategy to compete with Amazon before the cost problem becomes irrelevant given structural industry decline.",
            nextQuestionId: "g3q4c",
            scoreImpact: -10,
            feedback: "You have arrived at a competitive strategy recommendation after an engagement that was supposed to diagnose a margin problem. E-commerce will not fix $18M in lease cost in the next three years. The senior manager says: that is the wrong conclusion from this data.",
          },
        ],
      },
      {
        id: "g3q4a",
        stage: "Recommendation",
        question: "The board meeting is tomorrow. The senior manager asks for two recommendations with expected financial impact. You have the lease data and the category mix insight. What do you present?",
        options: [
          {
            id: "a",
            text: "Recommendation one: exit or renegotiate the 15-20 worst-performing high-rent stores using contribution margin analysis to identify the bottom quartile of the 38 renewed locations. Expected savings: $12-16M annually. Recommendation two: audit and rationalize the gift and café category mix, removing the lowest-margin SKUs and replacing with higher-margin book adjacencies like journals and puzzles. Expected recovery: $4-6M in gross margin.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong board presentation. Two specific recommendations each with quantified financial impact, addressing both identified drivers. The board approves proceeding to the next phase of the engagement.",
          },
          {
            id: "b",
            text: "Recommendation one: implement a lease governance policy requiring board approval for any renewal above $750K. Recommendation two: launch an e-commerce platform within 12 months to compete with Amazon for online book buyers.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "The lease governance policy is good but addresses future renewals only and not the current $18M problem. The e-commerce recommendation does not address the diagnosed cost issue and adds costs in the near term. The board will ask what you are doing about the existing 38 high-cost leases.",
          },
          {
            id: "c",
            text: "Recommendation one: hire a new CFO with retail real estate experience who can renegotiate leases more aggressively. Recommendation two: raise book prices 10% to recover gross margin lost to category mix changes.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Management hires without operational diagnosis are weak recommendations. Raising book prices in a market where Amazon undercuts on price would accelerate the revenue decline. The board is unlikely to implement either recommendation.",
          },
        ],
      },
      {
        id: "g3q4b",
        stage: "Recommendation",
        question: "The board pushes back: we cannot close stores, we have long-term employees there, and the diversification was deliberate strategy. Can we not just grow our way out of this? How do you respond?",
        options: [
          {
            id: "a",
            text: "To grow out of this problem, PageTurner would need to increase revenue by approximately $97M — a 23% increase at current margins — just to recover the $29M in lost profit. That is significant in a market where the category is declining 8% annually. Cost action is faster and more controllable. Store closures also do not have to mean all employees are let go — the best performers can be redeployed to higher-performing locations.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Quantifying the revenue growth required to avoid cost action is exactly the right response to this pushback. The board member who asked the question sits back — the math is sobering and difficult to argue with.",
          },
          {
            id: "b",
            text: "Agree with the board — closures should be a last resort. Recommend redirecting focus toward driving traffic to underperforming stores through author events, local marketing, and community programming initiatives.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Capitulating to pushback without the quantitative counter-argument is not consulting. Events and community programs are unlikely to generate the $97M in incremental revenue needed. The senior manager is visibly disappointed.",
          },
          {
            id: "c",
            text: "Present both options — cost action and revenue investment — and let the board choose which path aligns with their risk tolerance and long-term vision for the business.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Presenting options without a recommendation is weak consulting. The board hired Deloitte for a recommendation, not a menu of choices. However, quantifying both paths as supporting material is useful.",
          },
        ],
      },
      {
        id: "g3q4c",
        stage: "Recommendation",
        question: "Your engagement produced an e-commerce recommendation the CFO thinks misses the point. The senior manager gives you one last chance: build a two-slide summary for the board — one slide diagnosis, one slide recommendation — that addresses what the P&L actually shows. What goes on those slides?",
        options: [
          {
            id: "a",
            text: "Slide one: the $29M profit decline is 62% driven by occupancy cost increases from 38 lease renewals at nearly double prior rates, and 10% from category mix shift toward lower-margin gifts and café. Slide two: exit the bottom-quartile high-rent locations recovering $12-16M, and optimize the category mix toward higher-margin adjacencies recovering $4-6M.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Strong recovery. Clear diagnosis with attribution percentages followed by two quantified recommendations. This is what the engagement should have produced from the beginning. The senior manager says: this is what we needed three days ago.",
          },
          {
            id: "b",
            text: "Slide one: PageTurner faces a dual challenge from Amazon competition and rising operating costs that together are compressing margins. Slide two: three-pronged response including e-commerce investment, lease governance, and marketing programs.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "The diagnosis is vague and the three-pronged recommendation dilutes urgency. Amazon competition is context, not the proximate cause of the profit decline. The board will struggle to prioritize three parallel initiatives.",
          },
          {
            id: "c",
            text: "Slide one: revenue is flat but costs have risen $29M primarily due to lease renewals and wage inflation across the portfolio. Slide two: reduce costs through headcount reduction and lease renegotiation targeting $29M in total savings.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Labor is not the primary driver — it rose only $4M and is roughly in line with inflation. Recommending headcount reduction based on a cost you did not diagnose carefully would create employee relations problems without the evidence to justify the action.",
          },
        ],
      },
    ],
  },
];