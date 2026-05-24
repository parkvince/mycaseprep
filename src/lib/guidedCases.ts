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
    overview: "A mid-sized US coffee chain has seen its profit margin cut in half over two years despite growing revenue. McKinsey has been engaged to diagnose the issue and recommend a path forward.",
    clientBackground: "BrewCo operates 300 locations across the US. Revenue grew 12% from $420M to $470M over two years. Net profit margin fell from 18% to 6%. The CEO believes competition is causing the decline. The CFO believes costs are out of control. You have been asked to lead the diagnostic workstream.",
    yourRole: "You are a McKinsey associate on your first week of the engagement. The partner has asked you to lead the diagnostic and present preliminary findings by end of week.",
    startQuestionId: "g1q1",
    finalRecommendationPrompt: "The CEO asks for your single most important recommendation to present to the board next week. What do you tell him, and why?",
    sampleRecommendation: "Launch a demand-based labor scheduling program at the 100 new locations, targeting a reduction from 35% to 26% labor-to-revenue within 90 days. This single action recovers an estimated $40M in annual contribution margin and is the largest, most controllable cost lever in the diagnostic — one that new location management can begin implementing this week.",
    idealRecommendation: "BrewCo should immediately launch labor scheduling optimization at the 100 new locations running at 35% labor-to-revenue versus the 23% mature location benchmark. This recovers $35-45M annually. Simultaneously, renegotiate the top five supplier contracts representing 60% of the $43M COGS increase. These two actions together address both primary cost drivers identified in the diagnostic.",
    keyTakeaways: [
      "When revenue grows but margin falls, always separate same-store performance from total performance before drawing any conclusion",
      "Cost increases in multiple major buckets simultaneously often signal management attention problems during rapid expansion",
      "New locations are structurally less efficient and require active intervention, not passive maturation",
      "In food service, labor as a percentage of revenue is the single most controllable and high-impact margin lever",
    ],
    questions: [
      {
        id: "g1q1",
        stage: "Problem Definition",
        question: "The partner briefs you: revenue is up 12% but profit margin fell from 18% to 6% in two years. The CEO blames competition. The CFO blames costs. You have one hour before the first client meeting. What do you do?",
        context: "Your approach in this first hour will shape the entire engagement. There is no single correct answer — think about what gives you the most useful information before sitting down with the client.",
        options: [
          {
            id: "a",
            text: "Pull the last two years of P&L data and break every cost line into dollar change and percentage change, so you walk in knowing which buckets moved most.",
            nextQuestionId: "g1q2a",
            scoreImpact: 15,
            feedback: "Good instinct. You pull the P&L and immediately see COGS up $43M and labor up $32M against only $50M in revenue growth. The cost picture is clear before the meeting starts and you have data rather than hypotheses.",
          },
          {
            id: "b",
            text: "Prepare a structured framework slide showing how profit equals revenue minus costs, with each line decomposed, so the client sees you have a rigorous approach from the start.",
            nextQuestionId: "g1q2b",
            scoreImpact: 5,
            feedback: "A clean framework slide shows structure but delays data analysis. You walk in organized but without numbers. The CFO immediately asks which cost line is the problem and you have no answer yet.",
          },
          {
            id: "c",
            text: "Research BrewCo's main competitors to evaluate the CEO's competition hypothesis, since he raised it specifically and he is the client you need to bring along.",
            nextQuestionId: "g1q2c",
            scoreImpact: -5,
            feedback: "Revenue is up 12% — if competition were the primary driver, revenue would be flat or declining. The CEO's hypothesis does not fit the symptom. You walk in with context but without the cost picture that matters most here.",
          },
        ],
      },
      {
        id: "g1q2a",
        stage: "Cost Analysis",
        question: "You have the P&L. COGS is up $43M and labor is up $32M against only $50M in revenue growth. The partner asks: what single question does this data raise that we cannot yet answer from this spreadsheet alone?",
        exhibit: {
          type: "table",
          title: "BrewCo P&L Summary (2021 vs 2023)",
          data: `| Line Item   | 2021  | 2023  | Change        |
|-------------|-------|-------|---------------|
| Revenue     | $420M | $470M | +$50M (+12%)  |
| COGS        | $126M | $169M | +$43M (+34%)  |
| Labor       | $109M | $141M | +$32M (+29%)  |
| Rent        | $42M  | $56M  | +$14M (+33%)  |
| Marketing   | $17M  | $19M  | +$2M  (+12%)  |
| G&A         | $50M  | $56M  | +$6M  (+12%)  |
| Net Profit  | $76M  | $28M  | -$48M (-63%)  |`,
        },
        options: [
          {
            id: "a",
            text: "Are these cost increases spread uniformly across all 300 locations, or are they concentrated in the 100 new locations opened in the past two years?",
            nextQuestionId: "g1q3a",
            scoreImpact: 20,
            feedback: "This is the most diagnostic question in the dataset. If new locations are driving the increases, the problem is expansion-related inefficiency — very different from a systemic failure across the mature chain.",
          },
          {
            id: "b",
            text: "What happened to commodity prices for coffee and dairy over this period, since those are the inputs most likely behind the COGS increase?",
            nextQuestionId: "g1q3b",
            scoreImpact: 10,
            feedback: "Commodity investigation is valid. The client confirms coffee prices rose 18% and dairy 22% — but BrewCo COGS rose 34%. The gap between commodity inflation and total COGS growth is important and needs explaining.",
          },
          {
            id: "c",
            text: "Has BrewCo raised menu prices in line with cost inflation, and if not, how large is the gap between price increases and the cost increases showing up here?",
            nextQuestionId: "g1q3c",
            scoreImpact: 0,
            feedback: "Pricing addresses revenue, and revenue is already up 12%. The question of why costs are growing three times faster than revenue is more urgent than whether prices kept pace with inflation.",
          },
        ],
      },
      {
        id: "g1q2b",
        stage: "Cost Analysis",
        question: "You are in the client meeting with your framework slide. The CFO drops a spreadsheet on the table and says labor costs are completely out of control. The CEO pushes back and says opening 100 new locations obviously raises costs. The partner looks at you to steer the conversation. What do you do?",
        options: [
          {
            id: "a",
            text: "Ask the CFO to walk through the labor data specifically — you want to understand whether the increase is proportional to the new locations or disproportionate relative to revenue growth.",
            nextQuestionId: "g1q3a",
            scoreImpact: 15,
            feedback: "Good recovery. The CFO shares that new locations run at 35% labor-to-revenue versus 23% for mature locations. This single data point gives both executives a piece of the answer and anchors the rest of the diagnostic.",
          },
          {
            id: "b",
            text: "Side with the CEO by noting that revenue is up 12%, which suggests the business is fundamentally healthy and the cost increases are likely a temporary expansion artifact.",
            nextQuestionId: "g1q3c",
            scoreImpact: -10,
            feedback: "Siding with an executive without data is a credibility mistake. The CFO is visibly frustrated. You recover later by asking for the numbers, but you have already lost credibility with the person who holds the cost data you need.",
          },
          {
            id: "c",
            text: "Propose that both perspectives may be valid and suggest structuring the analysis into revenue drivers and cost drivers before drawing any conclusions.",
            nextQuestionId: "g1q3b",
            scoreImpact: 5,
            feedback: "Diplomatically neutral but slightly evasive. The executives wanted a steer, not a process proposal. The partner steps in to guide the conversation and you follow rather than lead the room.",
          },
        ],
      },
      {
        id: "g1q2c",
        stage: "Cost Analysis",
        question: "Your competitor research shows Starbucks and Dutch Bros raised prices 8-10% while BrewCo raised only 5%. The partner asks what this tells us about the margin problem specifically.",
        options: [
          {
            id: "a",
            text: "BrewCo underpriced relative to competitors and left margin on the table. The recommendation should focus on a 5-8% price increase to close the competitive gap and recover margin.",
            nextQuestionId: "g1q3c",
            scoreImpact: -5,
            feedback: "You found a revenue opportunity but have not diagnosed why costs grew three times faster than revenue. The CFO says pricing is not the problem — the cost reports are showing something the revenue picture is hiding.",
          },
          {
            id: "b",
            text: "This partially explains the revenue side but does not explain why COGS and labor grew 34% and 29% against only 12% revenue growth. The cost structure needs examination more urgently than pricing.",
            nextQuestionId: "g1q3a",
            scoreImpact: 10,
            feedback: "Good self-correction. You redirect to the cost question and the client shares a breakdown showing new locations are running at significantly higher cost ratios than mature ones.",
          },
          {
            id: "c",
            text: "The pricing gap confirms that competition forced BrewCo to hold prices down, which created a structural margin problem rooted in competitive market dynamics rather than internal cost management.",
            nextQuestionId: "g1q3c",
            scoreImpact: -10,
            feedback: "BrewCo revenue is up 12% and volume is growing. A company hurt by competitive pricing pressure would show flat or declining revenue, not growth. The partner asks you to revisit the core assumption before the client meeting ends.",
          },
        ],
      },
      {
        id: "g1q3a",
        stage: "Deep Dive",
        question: "Location-level data arrives. Mature locations run at 23% labor-to-revenue and 27% COGS-to-revenue. New locations run at 35% labor-to-revenue and 38% COGS-to-revenue. Average new location age is 14 months. The CEO says: give them 18 months and they will look like the rest. How do you respond to him?",
        exhibit: {
          type: "table",
          title: "Location Cohort Comparison",
          data: `| Metric                  | Mature (200) | New (100) | Benchmark |
|------------------------|--------------|-----------|-----------|
| Labor pct of revenue   | 23%          | 35%       | 24-26%    |
| COGS pct of revenue    | 27%          | 38%       | 28-30%    |
| Daily transactions     | 185          | 118       | n/a       |
| Average location age   | 4.8 years    | 14 months | n/a       |
| Contribution margin    | 18%          | 4%        | n/a       |`,
        },
        options: [
          {
            id: "a",
            text: "Labor improving with volume has some merit, but the 38% COGS ratio at new locations is structurally elevated in a way that does not self-correct with time alone. These two cost problems have different causes and need separate solutions.",
            nextQuestionId: "g1q4a",
            scoreImpact: 20,
            feedback: "Excellent nuance. You have correctly separated the two cost problems. Labor efficiency does improve with transaction volume, but COGS ratio gaps are often structural — driven by product mix or supplier terms that require active management to fix.",
          },
          {
            id: "b",
            text: "Agree with the CEO. Industry data supports an 18-24 month maturation cycle for new locations. The board should allow more time before making changes that could disrupt the expansion plan.",
            nextQuestionId: "g1q4b",
            scoreImpact: -5,
            feedback: "Maturation is real, but give it time is not a recommendation when the company is losing $48M in profit annually. The CFO needs action, not patience. The partner asks what management can actually do in the next 90 days.",
          },
          {
            id: "c",
            text: "Disagree with the CEO. New locations should meet the same cost standards as mature ones immediately. The 35% labor ratio needs to come down now through headcount reductions at the underperforming locations.",
            nextQuestionId: "g1q4c",
            scoreImpact: 5,
            feedback: "The instinct to act is right but the prescription is too blunt. Cutting headcount at locations still ramping transaction volume could hurt service quality and slow the revenue ramp that is supposed to fix the efficiency ratio.",
          },
        ],
      },
      {
        id: "g1q3b",
        stage: "Deep Dive",
        question: "Commodity data confirms coffee prices up 18% and dairy up 22%. But BrewCo COGS grew 34%. The gap between commodity inflation and total COGS growth implies about $15M in cost increases beyond what commodity prices alone explain. The CFO says that gap is the real problem. What do you look at next?",
        exhibit: {
          type: "table",
          title: "COGS Breakdown by Category",
          data: `| Category           | 2021  | 2023  | Change | Commodity Inflation |
|--------------------|-------|-------|--------|---------------------|
| Coffee and dairy   | $54M  | $89M  | +65%   | +18-22%             |
| Pastry and food    | $38M  | $52M  | +37%   | +15%                |
| Packaging          | $18M  | $22M  | +22%   | +18%                |
| Waste and spoilage | $16M  | $6M   | -63%   | n/a                 |
| Total COGS         | $126M | $169M | +34%   |                     |`,
        },
        options: [
          {
            id: "a",
            text: "Focus on coffee and dairy — it grew 65% against commodity inflation of 18-22%. Volume from new stores explains some of it, but the per-unit cost has also risen. Supplier contract terms and purchasing efficiency need to be examined.",
            nextQuestionId: "g1q4a",
            scoreImpact: 15,
            feedback: "Correct focus. The procurement team confirms that supplier contracts were renegotiated hurriedly during rapid expansion and BrewCo lost pricing leverage. Volume alone does not explain the 65% growth in this single category.",
          },
          {
            id: "b",
            text: "Highlight the waste reduction from $16M to $6M as a genuine success story and propose accelerating this program across other cost categories as the fastest path to margin recovery.",
            nextQuestionId: "g1q4b",
            scoreImpact: 0,
            feedback: "The waste program saved $10M, which is real but dwarfed by the $35M gap in coffee and dairy costs. Focusing on the one area that is working well while the larger problem persists is a misallocation of analytical attention.",
          },
          {
            id: "c",
            text: "Note that packaging at 22% growth matches inflation exactly, which validates that the procurement function is working, and conclude that coffee and dairy must therefore be a volume issue from new store openings.",
            nextQuestionId: "g1q4c",
            scoreImpact: -5,
            feedback: "Using one category at market rates to exonerate the procurement function for another category that grew three times faster than commodity prices is not rigorous logic. The CFO pushes back immediately.",
          },
        ],
      },
      {
        id: "g1q3c",
        stage: "Deep Dive",
        question: "Average ticket grew from $7.80 to $8.50 and transaction volume is up 14%. Revenue is clearly growing, but margins keep compressing. The partner says: you have been on the revenue side for a while and the CFO is getting impatient. What is your read on the cost side?",
        options: [
          {
            id: "a",
            text: "Pivot immediately to costs and request a breakdown of COGS and labor segmented by mature versus new locations so you can isolate whether this is expansion-driven or systemic.",
            nextQuestionId: "g1q3a",
            scoreImpact: 10,
            feedback: "Good course correction. You redirect to cost analysis and receive the location-level breakdown. New locations are running at significantly higher ratios and the diagnostic becomes much clearer from this point.",
          },
          {
            id: "b",
            text: "Stay on the revenue side and recommend a 7% menu price increase chain-wide to close the gap between cost growth and revenue growth without requiring operational changes.",
            nextQuestionId: "g1q4c",
            scoreImpact: -10,
            feedback: "Recommending a price increase without completing the cost diagnosis is jumping to solutions. You still do not know which costs are elevated or why. The CFO says price increases have been tried and are not moving fast enough.",
          },
          {
            id: "c",
            text: "Ask to see labor cost per transaction across all locations — if this number is rising it signals a productivity problem, and if it is flat the issue is more likely volume-driven and will improve naturally.",
            nextQuestionId: "g1q4a",
            scoreImpact: 5,
            feedback: "Good instinct. Labor cost per transaction at new locations is $3.03 versus $2.00 at mature locations — a 52% premium that is both a volume problem and a scheduling problem requiring active management.",
          },
        ],
      },
      {
        id: "g1q4a",
        stage: "Solution Design",
        question: "You know new locations have higher labor and COGS ratios and that the COGS gap is partly structural due to supplier pricing and product mix differences. The CEO asks for something he can present to the board in two weeks. What do you recommend?",
        options: [
          {
            id: "a",
            text: "Launch labor scheduling optimization at new locations targeting 28% labor-to-revenue within six months, and renegotiate the top five supplier contracts representing 60% of the coffee and dairy spend. Pause new openings until existing new locations reach mature economics.",
            nextQuestionId: "g1q5a",
            scoreImpact: 20,
            feedback: "Strong recommendation. Specific, sequenced, and addresses both cost buckets identified in the diagnostic. The partner adds that pausing openings should be framed as portfolio optimization rather than stopping growth.",
          },
          {
            id: "b",
            text: "Close the bottom 20% of new locations by contribution margin to concentrate resources on the better-performing 80% and signal operational discipline to the board and investors.",
            nextQuestionId: "g1q5b",
            scoreImpact: 5,
            feedback: "Closure is valid but drastic for locations averaging only 14 months old. The CEO asks how you know which ones will not recover with time and active management. You need a more nuanced framework than pure current performance ranking.",
          },
          {
            id: "c",
            text: "Raise prices 8% chain-wide to recover the margin gap, combined with natural new location maturation over 12-18 months to restore margins toward the 12-15% range without operational disruption.",
            nextQuestionId: "g1q5c",
            scoreImpact: -5,
            feedback: "Pricing over cost discipline is a temporary fix. COGS structurally elevated at new locations does not improve with price increases. The CFO says pricing has already been used and it is not closing the gap fast enough.",
          },
        ],
      },
      {
        id: "g1q4b",
        stage: "Solution Design",
        question: "Sixteen months have passed. Labor-to-revenue at new locations improved slightly from 35% to 32%. COGS-to-revenue at new locations is unchanged at 38%. The partner is now direct: maturation is not solving this. What specifically do you recommend now?",
        options: [
          {
            id: "a",
            text: "The labor improvement confirms maturation is partially working, but COGS not moving confirms a structural input cost problem. Recommend supplier renegotiation and a product mix audit for new locations alongside the ongoing maturation path.",
            nextQuestionId: "g1q5a",
            scoreImpact: 10,
            feedback: "Good diagnosis even if delayed. Splitting the two problems and recognizing that labor will partially self-correct while COGS will not is the key insight. The client agrees to begin the supplier audit immediately.",
          },
          {
            id: "b",
            text: "Close the conversation on maturation entirely and recommend a comprehensive 15% cost reduction program across all 300 locations to restore margins to the pre-expansion baseline.",
            nextQuestionId: "g1q5b",
            scoreImpact: 0,
            feedback: "Blunt cost reduction across all locations would damage the 200 mature locations that are already performing well. A targeted approach focused specifically on new location inefficiencies is more precise and less risky.",
          },
          {
            id: "c",
            text: "Recommend bringing in a new COO with food service operations experience who can drive efficiency improvements that the current leadership team has been unable to deliver.",
            nextQuestionId: "g1q5c",
            scoreImpact: -10,
            feedback: "A management hire recommendation without an operational diagnosis is insufficient. You have not identified what specific problems the new COO would address or how. The CEO asks what they would actually do differently.",
          },
        ],
      },
      {
        id: "g1q4c",
        stage: "Solution Design",
        question: "The engagement is at risk. The partner pulls you aside and says: we need a clear recommendation by end of week or this engagement does not extend. What is the single most important action BrewCo should take?",
        options: [
          {
            id: "a",
            text: "Labor scheduling optimization at the 100 new locations. Labor at 35% of revenue versus 23% for mature locations represents roughly $28M in recoverable annual savings and is implementable in 60-90 days.",
            nextQuestionId: "g1q5a",
            scoreImpact: 15,
            feedback: "Clear prioritization and good recovery. The partner agrees this is the right recommendation. She adds that you should have gotten here earlier, but the recommendation itself is correct and actionable for the board.",
          },
          {
            id: "b",
            text: "A comprehensive review of the expansion strategy and a presentation to the board about why opening 100 locations so quickly was the root cause of the current financial problems.",
            nextQuestionId: "g1q5b",
            scoreImpact: -5,
            feedback: "Critiquing past decisions without a forward-looking recommendation is not actionable consulting. The 100 locations are already open and operating. The question the board needs answered is what to do now.",
          },
          {
            id: "c",
            text: "A marketing investment to drive transaction volume at underperforming new locations, since higher volume will organically fix the labor efficiency ratio without requiring operational restructuring.",
            nextQuestionId: "g1q5c",
            scoreImpact: 0,
            feedback: "Driving volume is valid but the timeline to margin recovery through marketing alone is 18-24 months. The CFO needs measurable results in 90 days, not a longer-term volume growth story.",
          },
        ],
      },
      {
        id: "g1q5a",
        stage: "Implementation",
        question: "The CEO accepts the recommendation and asks how to implement labor scheduling changes without hurting customer experience at new locations still building their customer base.",
        options: [
          {
            id: "a",
            text: "Implement dynamic scheduling tied to transaction data — staff to projected demand curves rather than fixed shifts, so locations are fully staffed at peak hours and reduced during off-peak. This is a productivity improvement, not a headcount cut.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Excellent. This recommendation preserves customer experience during peaks while recovering cost during low-demand periods. It also builds a data-driven labor management culture that benefits all 300 locations long-term.",
          },
          {
            id: "b",
            text: "Reduce all new location shifts by one FTE immediately and accept slightly slower service in the near term, monitoring whether customer satisfaction scores decline materially within 60 days.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "This reduces costs but risks service quality at the exact moment when new locations are building customer loyalty. A more precise scheduling approach avoids this tradeoff entirely.",
          },
          {
            id: "c",
            text: "Freeze all new hiring at new locations and allow natural attrition over 6-12 months to reduce headcount gradually without the disruption of active workforce changes.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Attrition-based reduction is slow and imprecise. You lose employees in unpredictable patterns rather than specifically where the labor savings are needed most. Better than immediate cuts but inferior to demand-based scheduling.",
          },
        ],
      },
      {
        id: "g1q5b",
        stage: "Implementation",
        question: "You have recommended closing some underperforming new locations. The CEO asks for the specific criteria — how do you decide which locations to close versus keep?",
        options: [
          {
            id: "a",
            text: "Close any location that has been open more than 12 months and is still generating negative contribution margin, since those are definitively not improving on the maturation curve.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "12 months as a hard cutoff is cleaner than pure current performance, but misses trajectory. A location that is negative but improving rapidly may be worth keeping while a flat-but-barely-positive location in a declining market may not be.",
          },
          {
            id: "b",
            text: "Use a three-factor model combining current contribution margin, six-month performance trajectory, and local market potential. Locations that score poorly on all three dimensions are the prioritized closure candidates.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good framework. Using trajectory alongside current performance avoids closing locations that are struggling but improving. Market potential protects strategically important locations that simply need more time to build their customer base.",
          },
          {
            id: "c",
            text: "Ask franchisee operators to self-select for voluntary exits before deciding on forced closures, to reduce friction, minimize legal exposure, and preserve the broader franchisee relationship.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Voluntary exits reduce friction but create adverse selection. Operators in the best locations will not volunteer to leave, so the self-selection pool will not match your strategic closure criteria.",
          },
        ],
      },
      {
        id: "g1q5c",
        stage: "Implementation",
        question: "The engagement ends without a clear cost recommendation. The partner gives candid debrief feedback: you spent too much time on revenue. If you could redo Week 1, what would you do differently?",
        options: [
          {
            id: "a",
            text: "Request the store-level P&L segmented by new versus mature locations on Day 1 and use cost data as the anchor for the entire engagement rather than following the CEO's competitive hypothesis.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Correct reflection. Following the client hypothesis rather than the data is a common associate mistake. COGS up 34% and labor up 29% against 12% revenue growth is a clear signal that should have redirected the analysis immediately.",
          },
          {
            id: "b",
            text: "Interview more store managers in Week 1 to get a ground-level operational perspective before presenting any data-driven hypothesis to the senior leadership team.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Store manager interviews are valuable but secondary to the quantitative diagnosis. Understanding the why in the field is useful once you know where to look — starting there without a data anchor would have taken even longer to arrive at a conclusion.",
          },
          {
            id: "c",
            text: "Push the partner to align the CEO and CFO on a shared hypothesis before beginning any analysis, since their disagreement created confusion about what workstream to prioritize.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "Executive alignment matters but the core problem was analytical, not political. The CEO-CFO disagreement was actually an opportunity to bring data into the room — which requires having the data prepared first.",
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
    overview: "A private equity firm is evaluating an investment in SliceCo, a regional pizza chain. Bain has been asked to size the US restaurant pizza market before the investment committee convenes.",
    clientBackground: "SliceCo operates 240 locations in the Midwest generating $180M in annual revenue. Their average revenue per location of $750K exceeds the industry average of $620K. The PE firm wants to understand the total market size and whether a national expansion strategy is defensible before committing capital.",
    yourRole: "You are a Bain first-year associate. The partner needs a market size estimate in 45 minutes for a client call. This is your first solo market sizing exercise.",
    startQuestionId: "g2q1",
    finalRecommendationPrompt: "The PE partner asks directly: should we invest in SliceCo's national expansion? Give a one-paragraph recommendation anchored in your market sizing work.",
    sampleRecommendation: "Yes, conditionally. The US restaurant pizza market is approximately $49B annually. SliceCo holds 0.37% share with unit economics of $750K per location — 21% above the $620K industry benchmark. National expansion to 1,000 locations at $750K average would mean $750M in revenue, a 4x opportunity while still holding under 2% of the total market. The condition is validating that Midwest unit economics replicate outside the region before committing to full national scale.",
    idealRecommendation: "SliceCo is an attractive investment. The US restaurant pizza market is approximately $48-51B. SliceCo at 0.37% share with above-average unit economics has enormous expansion headroom. National scale to 1,000 locations represents $750M revenue — a 4x opportunity in a large, stable market. Geographic replication of unit economics is the critical diligence question.",
    keyTakeaways: [
      "Always triangulate market sizing from two independent approaches and reconcile material differences between them",
      "Segment before you size — restaurant pizza and frozen pizza are different markets requiring different approaches",
      "Market share framing converts a market size number into a strategic investment insight about scale and opportunity",
      "Unit economics per location are more predictive of national expansion success than total current revenue",
    ],
    questions: [
      {
        id: "g2q1",
        stage: "Structuring",
        question: "The partner puts the question to you: size the US pizza market. You have 45 minutes. Before touching any numbers, how do you structure your approach to this problem?",
        context: "The partner is watching how you frame the problem before calculating. Structuring well here saves time and prevents scope errors that are hard to correct later.",
        options: [
          {
            id: "a",
            text: "Define the market scope as restaurant and delivery pizza only — excluding frozen and retail — then commit to two approaches: top-down from population and bottom-up from restaurant supply. Triangulate between them at the end.",
            nextQuestionId: "g2q2a",
            scoreImpact: 20,
            feedback: "Strong start. Defining scope and committing to triangulation are both marks of rigorous analysis. The partner nods and asks: good, what are your specific inputs going to be for each approach?",
          },
          {
            id: "b",
            text: "Start calculating immediately using US population times estimated pizza consumption frequency times average spend, then pressure-test the result against anything you know about the industry.",
            nextQuestionId: "g2q2b",
            scoreImpact: 5,
            feedback: "Moving fast under time pressure is reasonable, but starting without defining scope risks sizing the wrong market. You produce a number quickly but the partner asks whether it includes frozen pizza and you realize you have not thought about the boundary.",
          },
          {
            id: "c",
            text: "Ask the partner what data sources are available before structuring the approach, since knowing whether you have industry reports will change which method is most efficient.",
            nextQuestionId: "g2q2c",
            scoreImpact: 0,
            feedback: "In a case interview you always assume no external data unless told otherwise. Asking for data before attempting an estimate signals low analytical independence. The partner says: assume you have nothing — estimate it from first principles.",
          },
        ],
      },
      {
        id: "g2q2a",
        stage: "Top-Down Sizing",
        question: "You have committed to a two-approach method. The partner asks you to walk through your top-down inputs before calculating. What are the three key inputs you use and why?",
        options: [
          {
            id: "a",
            text: "US population of 330M, restaurant or delivery pizza occasions per person per year estimated at 18-20 averaging all age groups, and average spend per occasion of $13-15 with the pizza-only portion representing roughly 70% of the total ticket.",
            nextQuestionId: "g2q3a",
            scoreImpact: 15,
            feedback: "Clean decomposition. All three inputs are independently estimable and the pizza-only adjustment shows careful thinking about what counts as pizza market revenue versus beverage and side revenue on the same ticket.",
          },
          {
            id: "b",
            text: "Number of US households at 127M, annual household pizza spend estimated at $480-520 per year for pizza-ordering households, and the share of households that order pizza at least monthly estimated at about 55%.",
            nextQuestionId: "g2q3b",
            scoreImpact: 10,
            feedback: "Household-level sizing also works but introduces extra complexity. Estimating household pizza-ordering penetration is harder to anchor than per-capita frequency. Not wrong, but slightly more involved than the cleaner population-based approach.",
          },
          {
            id: "c",
            text: "Number of pizza restaurants at 75,000 in the US, average annual revenue per restaurant at $600-650K, and the percentage of revenue from dine-in versus delivery to account for the channel split.",
            nextQuestionId: "g2q3c",
            scoreImpact: 5,
            feedback: "This is actually a bottom-up supply-side approach rather than top-down. Both are valid but you committed to top-down first. The partner notes the inconsistency and says: this will be your cross-check — go build the top-down first.",
          },
        ],
      },
      {
        id: "g2q2b",
        stage: "Top-Down Sizing",
        question: "You calculated quickly. Your first estimate is 330M people times 30 pizza occasions per year times $12 average spend, which gives $119B. The partner raises an eyebrow. That number seems very high. Walk me through where the error is.",
        options: [
          {
            id: "a",
            text: "The 30 occasions includes frozen pizza and retail, which are a separate market. Removing those drops to about $74B. Then adjusting for the pizza-only portion of the ticket at roughly 68% gives a final estimate closer to $50B.",
            nextQuestionId: "g2q3a",
            scoreImpact: 15,
            feedback: "Good self-correction under pressure. Walking through the adjustments clearly and arriving at a defensible $50B is solid work. The partner says: much better — now build the cross-check.",
          },
          {
            id: "b",
            text: "$119B might actually be right if you include all pizza-related spending across restaurants, delivery apps, frozen retail, school cafeterias, and corporate catering in a comprehensive definition of the total pizza market.",
            nextQuestionId: "g2q3c",
            scoreImpact: -10,
            feedback: "Defending an inflated number without questioning the inputs is a serious red flag. The US total restaurant industry is roughly $900B — pizza at $119B would mean pizza represents 13% of all restaurant spending, which is not plausible.",
          },
          {
            id: "c",
            text: "The 30 occasions per year is probably too high for the average American — revising down to 20 occasions gives $79B, which still seems elevated but is closer to something believable.",
            nextQuestionId: "g2q3b",
            scoreImpact: 5,
            feedback: "Adjusting frequency downward is a valid move but misses the scope issue — frozen pizza is still included in the estimate. Frequency adjustment partially fixes the problem without fully resolving it.",
          },
        ],
      },
      {
        id: "g2q2c",
        stage: "Top-Down Sizing",
        question: "The partner confirms no data sources — pure estimation only. You begin your top-down estimate and arrive at $85B after 10 minutes. The partner says: that is too high. Show me the working and identify the error.",
        exhibit: {
          type: "table",
          title: "Your Working (Shown to Partner)",
          data: `| Input                  | Your Estimate |
|------------------------|---------------|
| US population          | 330M          |
| Pizza occasions/year   | 35            |
| Average spend/occasion | $12           |
| Raw estimate           | $138.6B       |
| Restaurant adj x62%    | $85.9B        |`,
        },
        options: [
          {
            id: "a",
            text: "35 occasions is too high — that is more than once per week for every American including children and elderly. A realistic restaurant-specific estimate is 18-20 occasions per year for the adult population. That revision brings the estimate to roughly $50B.",
            nextQuestionId: "g2q3a",
            scoreImpact: 10,
            feedback: "Good catch on the frequency assumption. The intuition check — more than once per week for every American — immediately exposes the error. Revised to $50B puts you in the right range.",
          },
          {
            id: "b",
            text: "The 62% restaurant adjustment is too conservative. Frozen pizza represents closer to 25% of occasions rather than 38%, so raising the restaurant share to 75% gives about $104B, which seems more reasonable.",
            nextQuestionId: "g2q3c",
            scoreImpact: -5,
            feedback: "Adjusting one assumption to make the number feel more comfortable without questioning the frequency input is not rigorous. The frequency of 35 occasions is the real problem and $104B would still make pizza implausibly large as a share of total restaurant spending.",
          },
          {
            id: "c",
            text: "The $12 average spend per occasion is too low since pizza delivery orders average $25-30. Revising the spend upward would actually increase the estimate further, which suggests the framework structure itself needs to change.",
            nextQuestionId: "g2q3b",
            scoreImpact: -10,
            feedback: "Revising spend upward moves the estimate in the wrong direction — it is already too high. This compounds the error. The problem is frequency, not spend, and the next revision should address that.",
          },
        ],
      },
      {
        id: "g2q3a",
        stage: "Bottom-Up Cross-Check",
        question: "Your top-down estimate is $48-52B for restaurant pizza. The partner asks for the bottom-up cross-check. You estimate 78,000 pizza restaurants and delivery operations in the US. What average revenue per location do you apply and why?",
        options: [
          {
            id: "a",
            text: "Use a single flat average of $600K for all pizza operations without segmenting between chains and independents. 78,000 times $600K equals $46.8B, which is close enough to the top-down estimate to validate the range.",
            nextQuestionId: "g2q4b",
            scoreImpact: 10,
            feedback: "A flat average gives a number in the right range. $46.8B is close to the $48-52B top-down estimate. The partner would prefer a segmented approach but accepts this as a reasonable cross-check under time pressure.",
          },
          {
            id: "b",
            text: "Use $1M per location as the benchmark for restaurant operations generally. 78,000 times $1M equals $78B, which suggests the top-down estimate was too conservative and the real market opportunity is larger.",
            nextQuestionId: "g2q4c",
            scoreImpact: -5,
            feedback: "$1M is the average for full-service restaurants broadly, not pizza specifically. Small independent pizzerias and delivery operations bring the average well below $1M. This benchmark inflates the estimate and undermines the triangulation exercise.",
          },
          {
            id: "c",
            text: "Segment between large chain locations averaging $900K-$1M and independent pizzerias averaging $400-500K. Weighted across the mix, the blended average comes to about $620-650K. 78,000 times $635K equals $49.5B.",
            nextQuestionId: "g2q4a",
            scoreImpact: 20,
            feedback: "Excellent segmented approach. Differentiating chain versus independent unit economics is exactly right. $49.5B is very close to your $48-52B top-down, giving you strong triangulation confidence in the estimate.",
          },
        ],
      },
      {
        id: "g2q3b",
        stage: "Bottom-Up Cross-Check",
        question: "Your top-down estimate landed around $70B using household-level sizing. The bottom-up check using 78,000 locations at $620K average gives $48.4B. The two estimates are $22B apart. What does this gap tell you and how do you resolve it?",
        options: [
          {
            id: "a",
            text: "Present a range of $48-70B to reflect both estimates and let the partner decide which end is more credible given her additional context on the market.",
            nextQuestionId: "g2q4c",
            scoreImpact: 0,
            feedback: "A $22B range is too wide to be useful for an investment decision. Presenting both endpoints without diagnosing which assumption is wrong is analytically passive and does not give the partner what she needs.",
          },
          {
            id: "b",
            text: "The $22B gap means my household sizing over-counted somewhere — most likely the penetration rate or annual spend per household was too high. The supply-side estimate of $48B is grounded in more observable restaurant economics and is the more reliable anchor.",
            nextQuestionId: "g2q4a",
            scoreImpact: 15,
            feedback: "Good triangulation discipline. Recognizing that the supply-side estimate is grounded in more directly observable data — because restaurant revenue is more measurable than household survey estimates — is mature analytical thinking.",
          },
          {
            id: "c",
            text: "The higher top-down estimate is probably more accurate since consumer spending surveys tend to under-report frequency and spend, so I will use $65B as my final estimate.",
            nextQuestionId: "g2q4c",
            scoreImpact: -10,
            feedback: "Choosing the higher estimate to make the opportunity look larger is confirmation bias. The analyst's job is to follow the data to the most accurate estimate, not to select the number that makes the investment thesis most attractive.",
          },
        ],
      },
      {
        id: "g2q3c",
        stage: "Bottom-Up Cross-Check",
        question: "You have been working bottom-up all along. Your estimate is 78,000 locations times $620K average equals $48.4B. The partner asks for the top-down cross-check. You need to build a population-based estimate quickly.",
        options: [
          {
            id: "a",
            text: "330M people times 18 restaurant or delivery pizza occasions per year times $8.50 net pizza revenue per occasion equals $50.4B. That is within 4% of the $48.4B bottom-up, giving strong triangulation.",
            nextQuestionId: "g2q4a",
            scoreImpact: 10,
            feedback: "Clean top-down built quickly under pressure. $50.4B versus $48.4B is a 4% difference — excellent triangulation that validates the estimate confidently.",
          },
          {
            id: "b",
            text: "The bottom-up estimate of $48.4B is grounded in actual restaurant economics and is more reliable than any consumer survey estimate I could build quickly in the remaining time.",
            nextQuestionId: "g2q4b",
            scoreImpact: 5,
            feedback: "Bottom-up is indeed well-grounded, but declining to cross-check when the partner explicitly asks is not the right response. You should attempt the top-down even imperfectly.",
          },
          {
            id: "c",
            text: "330M times 30 occasions times $12 spend equals $119B adjusted by 60% for restaurant only, giving $71B. It does not match well, so I will use $60B as a midpoint between the two estimates.",
            nextQuestionId: "g2q4c",
            scoreImpact: -5,
            feedback: "The 30 occasions figure includes frozen pizza and is too high for restaurant-specific sizing. Taking a midpoint between a correct and an incorrect estimate is not analytically sound — it masks an input error that should be corrected.",
          },
        ],
      },
      {
        id: "g2q4a",
        stage: "Investment Implication",
        question: "Your triangulated estimate is $48-51B for the US restaurant pizza market. The partner asks: SliceCo has $180M in revenue. What does that tell us about the investment opportunity?",
        options: [
          {
            id: "a",
            text: "SliceCo's $180M represents roughly 0.37% of a $49B market. Their $750K average revenue per location is 21% above the $620K industry average. National expansion to 1,000 locations at $750K would equal $750M revenue — a 4x opportunity while holding under 2% market share.",
            nextQuestionId: "g2q5a",
            scoreImpact: 20,
            feedback: "Excellent. You converted the market size into a specific strategic insight. The unit economics comparison is particularly strong — above-average performance per location is exactly the signal PE investors want before backing a scaling strategy.",
          },
          {
            id: "b",
            text: "SliceCo is extremely small at 0.37% share in a market dominated by Domino's and Pizza Hut. Growing to meaningful national share against these incumbents will be very difficult from a regional starting point.",
            nextQuestionId: "g2q5b",
            scoreImpact: 0,
            feedback: "The competitive concern is valid context but misses the strategic framing entirely. 0.37% share in a $49B market means there is enormous expansion room without ever significantly displacing the incumbents. The framing should emphasize opportunity, not just competition.",
          },
          {
            id: "c",
            text: "At $180M and 0.37% market share, SliceCo is below the scale threshold for PE returns at national level. The PE firm should look at larger acquisition targets that already have national presence.",
            nextQuestionId: "g2q5c",
            scoreImpact: -10,
            feedback: "Small current share in a large market with above-average unit economics is precisely the PE investment thesis. This framing inverts the logic entirely and would lead to never investing in any growth company.",
          },
        ],
      },
      {
        id: "g2q4b",
        stage: "Investment Implication",
        question: "Your estimate has some uncertainty in the range. The partner says: the IC wants a single number for the deck. What do you give them and how do you handle the residual uncertainty?",
        options: [
          {
            id: "a",
            text: "Give $49B as the central estimate. Add a footnote noting the reasonable range is $46-53B depending on how delivery-only operations are counted, but commit to the central number as your best estimate.",
            nextQuestionId: "g2q5a",
            scoreImpact: 15,
            feedback: "Exactly right. A central estimate with explicit uncertainty bounds is what IC decks require. Hiding the range would be misleading; refusing to give a single number would be unhelpful. The partner says: perfect — that is how you present a range with a view.",
          },
          {
            id: "b",
            text: "Give the full range of $46-53B and let IC members choose whichever end supports their view of the investment's attractiveness and risk profile.",
            nextQuestionId: "g2q5b",
            scoreImpact: 0,
            feedback: "Presenting the range without a view is analytically passive. IC members should not be selecting the market size estimate that fits their prior belief — the analyst's job is to make the call and defend it.",
          },
          {
            id: "c",
            text: "Round up to $55B to give the investment a larger addressable market in the deck, since the uncertainty in the estimate justifies an upper-bound framing for the opportunity.",
            nextQuestionId: "g2q5c",
            scoreImpact: -15,
            feedback: "Inflating an estimate directionally to support an investment thesis is an analytical integrity failure. If discovered it destroys credibility. The partner says: never round in a direction that supports the conclusion you want to reach.",
          },
        ],
      },
      {
        id: "g2q4c",
        stage: "Investment Implication",
        question: "Your market estimate was imprecise. The partner shares that industry data shows the US restaurant pizza market is approximately $46B. You were off by about 30%. What does that tell you about your method?",
        options: [
          {
            id: "a",
            text: "The error most likely came from the frequency assumption being too high. For restaurant-specific sizing, I should anchor frequency to a concrete time period — how often does the average adult specifically order pizza from a restaurant — then convert to annual.",
            nextQuestionId: "g2q5a",
            scoreImpact: 10,
            feedback: "Good post-mortem. Identifying the specific input error and proposing a concrete calibration for next time is how analysts improve. The partner says: exactly — frequency is the hardest input to get right in consumer market sizing.",
          },
          {
            id: "b",
            text: "30% off is within acceptable range for a market sizing exercise since the purpose is to get the order of magnitude right rather than the exact number.",
            nextQuestionId: "g2q5b",
            scoreImpact: 5,
            feedback: "True that exactness is not the goal, but a 30% miss without diagnosing the specific error is a missed learning opportunity. The partner wants you to identify what went wrong, not rationalize the result as acceptable.",
          },
          {
            id: "c",
            text: "I would challenge the $46B industry figure since market definitions vary and my estimate may be capturing channels that the industry number intentionally excludes from scope.",
            nextQuestionId: "g2q5c",
            scoreImpact: -5,
            feedback: "Defending a wrong estimate by questioning the benchmark is intellectually dishonest. In a real engagement you would use the industry data. The market sizing exercise exists precisely for when you do not have it — learn from the error rather than explaining it away.",
          },
        ],
      },
      {
        id: "g2q5a",
        stage: "Final Recommendation",
        question: "The IC asks the final question: based on your market sizing, is the national expansion of SliceCo a good investment bet?",
        options: [
          {
            id: "a",
            text: "Yes, but with one condition. The $49B market and 0.37% current share with above-average unit economics support the thesis. The 4x upside to 1,000 locations is credible in this market. The condition is validating that Midwest unit economics hold outside the region before committing to full national scale.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong final answer. Conditional yes with specific evidence, quantified upside, and the critical diligence question identified. This is the IC answer that gets funded and earns follow-on work.",
          },
          {
            id: "b",
            text: "Yes. The market is large and growing, the unit economics are strong, and national expansion is clearly attractive for the PE return profile.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Directionally right but lacks the specific quantification that makes an IC recommendation compelling. Large and growing is vague — $49B at 0.37% share with a 4x upside to 2% is the specific version of that statement.",
          },
          {
            id: "c",
            text: "Maybe. There are too many unknowns about geographic replication and competitive response to make a confident directional recommendation at this stage of diligence.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Maybe is not an investment recommendation. The IC needs a view with supporting rationale. Uncertainty is real but the analyst's job is to make the best call given available data, not to withhold one out of excessive caution.",
          },
        ],
      },
      {
        id: "g2q5b",
        stage: "Final Recommendation",
        question: "The IC pushes back: you gave a qualified answer. We need a number and a clear view. What is your recommendation under pressure?",
        options: [
          {
            id: "a",
            text: "Commit to $49B as the central estimate and to an invest recommendation contingent on geography validation. The uncertainty does not change the order of magnitude of the opportunity or the quality of the unit economics signal.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good recovery. Committing to a number and a view while being transparent about residual uncertainty is exactly what IC presentations require from an analyst.",
          },
          {
            id: "b",
            text: "Recommend the IC commission additional primary research before making the investment decision since the market sizing uncertainty is too high to underwrite responsibly.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Calling for more research when the IC is ready to decide is a consulting failure. You had the tools to size this market — own the estimate and make the recommendation.",
          },
          {
            id: "c",
            text: "Ask the IC what market size would make the investment compelling and confirm whether the estimate you produced is above or below that threshold.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "Working backward from a desired conclusion to validate the analysis is the definition of biased analysis. This response would be a serious credibility failure in any professional investment context.",
          },
        ],
      },
      {
        id: "g2q5c",
        stage: "Final Recommendation",
        question: "Your sizing was imprecise and your framing of the investment implication was weak. The partner gives you one final opportunity. What should the PE firm actually do with SliceCo?",
        options: [
          {
            id: "a",
            text: "Recommend against the investment since the market sizing uncertainty makes it impossible to underwrite the expansion thesis with confidence.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Market sizing uncertainty is a normal feature of early-stage diligence. PE firms invest under imperfect information constantly. The recommendation should be driven by evidence, not by analyst confidence in a single estimate.",
          },
          {
            id: "b",
            text: "Despite imprecision in the sizing, the key directional insight is clear: SliceCo's unit economics at $750K are 21% above the industry average. That is the real signal. Recommend conditional investment with geographic unit economics validation as the primary diligence step.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Good recovery. Redirecting to the most reliable data point — unit economics — and giving a clear conditional recommendation despite sizing imprecision is the right approach. The partner says: the unit economics are the real insight here.",
          },
          {
            id: "c",
            text: "Defer to the PE partner since she has more context on the investment thesis and is better positioned to make the final call than an analyst who could not size the market accurately.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "Deferring to the partner because your analysis was imperfect is not acceptable. Every analyst operates under uncertainty. The job is to synthesize available evidence into the best possible recommendation, not to withhold a view when it is imperfect.",
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
    overview: "A regional bookstore chain has seen profit margin fall from 10% to 3% over three years while revenue remained flat. Deloitte has been asked to diagnose the issue and present recommendations before a board meeting.",
    clientBackground: "PageTurner operates 85 bookstores across the Southeast US. Revenue has been stable at $420M for three years. Net profit fell from $42M to $12.6M — a $29M decline. The CEO believes the Amazon competitive dynamic is the root cause. The CFO believes lease renewals are destroying profitability. The board convenes in one week.",
    yourRole: "You are a Deloitte consultant on your second engagement. The senior manager needs a clear diagnosis and two actionable recommendations before the board meeting.",
    startQuestionId: "g3q1",
    finalRecommendationPrompt: "What are your two most important recommendations to PageTurner's board? Be specific about expected financial impact for each.",
    sampleRecommendation: "First, exit or renegotiate the 15-20 highest-cost renewed leases — occupancy costs grew $18M representing 62% of the profit decline, driven by 38 lease renewals at nearly double prior rates. Targeting bottom-quartile locations by contribution margin could recover $12-16M annually. Second, audit the gift and café category mix added to offset declining book revenue, since the margin gap versus books explains $3-5M of the remaining profit decline.",
    idealRecommendation: "Two recommendations: (1) Exit or renegotiate the bottom 15-20 high-cost renewed locations — occupancy costs grew $18M (+47%) driven by 38 renewals at 2x prior rates. Estimated annual recovery: $14-18M. (2) Audit category mix — book revenue replaced by lower-margin gifts and café dilutes gross margin by an estimated $3-5M annually. Together these two actions address over 80% of the total $29M profit decline.",
    keyTakeaways: [
      "Flat revenue can mask major underlying shifts in cost structure and category mix that are invisible at the total level",
      "Lease renewals are a silent driver of retail margin deterioration that compounds across many locations over time",
      "Category mix changes have margin consequences that are frequently not modeled before the decision to diversify",
      "Retail diagnostics should always segment by individual location economics before drawing portfolio-level conclusions",
    ],
    questions: [
      {
        id: "g3q1",
        stage: "Problem Definition",
        question: "Revenue is flat at $420M but profit fell from $42M to $12.6M — a $29M decline over three years. The CEO blames Amazon. The CFO blames leases. You have 30 minutes before the client call. What do you prioritize?",
        options: [
          {
            id: "a",
            text: "Pull the full P&L with all cost lines for all three years and rank them by absolute dollar change to identify the largest movers before walking into the meeting.",
            nextQuestionId: "g3q2a",
            scoreImpact: 15,
            feedback: "Right instinct. The P&L breakdown shows occupancy up $18M (+47%), COGS up $8M (+3%), and labor up $4M (+6%). The occupancy increase stands out — 47% growth on a cost line for a chain with the same number of stores is immediately suspicious.",
          },
          {
            id: "b",
            text: "Research the Amazon impact on US bookstore industry revenue to evaluate the CEO's hypothesis before entering the client meeting with an outside perspective.",
            nextQuestionId: "g3q2b",
            scoreImpact: 0,
            feedback: "Amazon research gives relevant context, but revenue is flat — not declining. If Amazon were the primary driver, revenue would have fallen. You walk in with industry context but without the cost picture that matters most here.",
          },
          {
            id: "c",
            text: "Ask the senior manager for her working hypothesis since she has been on the engagement longer and her view will let you prepare more targeted questions for the call.",
            nextQuestionId: "g3q2c",
            scoreImpact: -5,
            feedback: "Asking for the answer before looking at the data is not independent thinking. The senior manager says she wants to see what you come up with first. You walk into the call with no data and no independent perspective.",
          },
        ],
      },
      {
        id: "g3q2a",
        stage: "Data Analysis",
        question: "You have the P&L. Occupancy is up $18M (+47%), COGS up $8M, labor up $4M. The CFO says it is the leases. The CEO says people are not buying books like they used to. How do you move this conversation toward a diagnosis?",
        exhibit: {
          type: "table",
          title: "PageTurner P&L Three-Year Change",
          data: `| Cost Line  | Year 1 | Year 3 | Change        |
|-----------|--------|--------|---------------|
| COGS      | $252M  | $260M  | +$8M  (+3%)   |
| Labor     | $63M   | $67M   | +$4M  (+6%)   |
| Occupancy | $38M   | $56M   | +$18M (+47%)  |
| Marketing | $8M    | $9M    | +$1M  (+12%)  |
| G&A       | $17M   | $15M   | -$2M  (-12%)  |
| Total     | $378M  | $407M  | +$29M (+8%)   |
| Revenue   | $420M  | $420M  | flat          |
| Profit    | $42M   | $13M   | -$29M         |`,
        },
        options: [
          {
            id: "a",
            text: "Ask the CFO for lease renewal data specifically — how many leases renewed and at what rate change. If 38 leases renewed at $1.1M versus $560K previously, that is $20.5M in additional annual cost and fully explains the $18M net increase.",
            nextQuestionId: "g3q3a",
            scoreImpact: 20,
            feedback: "Excellent diagnostic instinct. The lease data confirms 38 renewals at nearly double the prior rate. This is the primary driver and it is an actionable problem. The CFO is right, though the CEO's Amazon concern may explain why revenue is not growing to offset it.",
          },
          {
            id: "b",
            text: "Ask for revenue breakdown by category — if book sales are declining and being replaced by gifts and café revenue at lower margins, the CEO's concern could be showing up inside the flat total revenue number.",
            nextQuestionId: "g3q3b",
            scoreImpact: 10,
            feedback: "Category mix is a valid inquiry. The data shows book revenue fell $22M and was replaced by gift, café, and event revenue at 5-8 percentage points lower gross margin. This is a real contributor though smaller than occupancy in dollar terms.",
          },
          {
            id: "c",
            text: "Tell both executives that both factors are probably contributing and request two weeks to build a formal attribution model before drawing any conclusions to present at the board meeting.",
            nextQuestionId: "g3q3c",
            scoreImpact: -10,
            feedback: "Two weeks is not possible before a board meeting in one week. Both are contributing without quantification is not useful analysis. The senior manager steps in to redirect the conversation.",
          },
        ],
      },
      {
        id: "g3q2b",
        stage: "Data Analysis",
        question: "Your Amazon research shows the US bookstore industry fell 8% over the same three years — but PageTurner's revenue was flat. The CFO immediately says: we beat the market. The problem is costs. How do you respond?",
        options: [
          {
            id: "a",
            text: "Accept the CFO's logic and pivot to the full P&L breakdown. If revenue beat the industry trend and profits still fell dramatically, the cause must be on the cost side rather than the revenue side.",
            nextQuestionId: "g3q3a",
            scoreImpact: 10,
            feedback: "Good recovery. Updating your view and pivoting to cost analysis is the right move. You are now on the correct track even though you started with the revenue side.",
          },
          {
            id: "b",
            text: "Challenge the CFO by noting that flat revenue when the industry fell 8% could mean PageTurner added lower-margin categories to compensate, creating a hidden margin problem inside the stable total.",
            nextQuestionId: "g3q3b",
            scoreImpact: 15,
            feedback: "Excellent insight. You have connected the Amazon industry trend to a potential mix shift explanation — and you are right. PageTurner did add lower-margin categories to offset declining book sales. This is a sophisticated reading of flat revenue data.",
          },
          {
            id: "c",
            text: "Agree with the CEO and recommend an e-commerce investment to build a competing online channel since the Amazon dynamic is clearly affecting how customers buy books.",
            nextQuestionId: "g3q3c",
            scoreImpact: -10,
            feedback: "Recommending an e-commerce investment before looking at the P&L is jumping to solutions. The CFO points out that the cost reports show the measurable problem and an e-commerce platform would only add near-term costs.",
          },
        ],
      },
      {
        id: "g3q2c",
        stage: "Data Analysis",
        question: "The senior manager shares her hypothesis: probably the leases, we saw this in a retail client last year. The client call begins and the CEO opens: I want to understand why our margins are being destroyed despite strong operations. How do you begin the conversation?",
        options: [
          {
            id: "a",
            text: "Ask the client to walk through cost changes over three years, line by line, so you hear their perspective on where costs moved before sharing any external hypothesis.",
            nextQuestionId: "g3q3a",
            scoreImpact: 10,
            feedback: "Client-led cost walkthrough is a valid approach. The CFO immediately highlights the occupancy increase and the lease renewal data surfaces naturally in the conversation.",
          },
          {
            id: "b",
            text: "Lead with the lease hypothesis directly: based on our initial review we believe lease renewals may be a primary driver — can you share data on how many leases renewed and at what rate change?",
            nextQuestionId: "g3q3b",
            scoreImpact: 5,
            feedback: "Presenting a hypothesis as a question is fine. The client confirms leases are a factor, but they also reveal a category mix change that you might have missed if you only investigated the lease line.",
          },
          {
            id: "c",
            text: "Frame the engagement as a competitive response strategy since the CEO specifically raised Amazon and you want to bring him along by addressing his stated concern first.",
            nextQuestionId: "g3q3c",
            scoreImpact: -5,
            feedback: "Framing the engagement around a competitive hypothesis when the symptom is cost-driven delays the real diagnosis. The CFO checks out of the conversation visibly and the senior manager has to redirect.",
          },
        ],
      },
      {
        id: "g3q3a",
        stage: "Root Cause",
        question: "Lease data confirmed: 38 of 85 stores renewed at $1.1M average versus $560K previously. That is $540K per store times 38 stores, equaling $20.5M in additional annual cost, which explains the $18M net occupancy increase. The CEO says: we cannot renegotiate signed leases. What do you recommend?",
        options: [
          {
            id: "a",
            text: "Drive revenue growth at the high-cost stores through targeted marketing to justify the new lease rates, since higher traffic is the only way to make the economics work at the new rent levels.",
            nextQuestionId: "g3q4b",
            scoreImpact: 0,
            feedback: "Revenue growth at high-cost stores is directionally valid but slow and uncertain. At $1.1M in rent, a store needs roughly $4.4M in incremental revenue at current margins just to break even on the lease increase alone.",
          },
          {
            id: "b",
            text: "Three actions: establish board approval for any future renewal above $800K; evaluate the 38 high-cost leases by contribution margin and exit the bottom 15-20 through subletting or early termination; and explore co-tenancy options where two retailers share a location.",
            nextQuestionId: "g3q4a",
            scoreImpact: 20,
            feedback: "Excellent. Three concrete sequenced actions covering the immediate problem, the governance gap, and a creative structural option. The board will respond well to this combination of near-term fixes and governance improvements.",
          },
          {
            id: "c",
            text: "Move all future renewals to shorter 1-2 year terms instead of 5-7 year commitments to preserve flexibility going forward and prevent this situation from recurring.",
            nextQuestionId: "g3q4c",
            scoreImpact: 5,
            feedback: "Shorter lease terms is a sound governance recommendation but addresses only future renewals. The board needs both a near-term fix for the current $18M problem and a governance change — not just the governance change alone.",
          },
        ],
      },
      {
        id: "g3q3b",
        stage: "Root Cause",
        question: "Revenue breakdown reveals book revenue fell $22M and was replaced by gift, café, and event revenue. Gross margin on books is 42%. Gross margin on gifts is 34%. Gross margin on café is 28%. The CEO asks: we diversified deliberately to offset Amazon — are you saying we made a strategic mistake?",
        options: [
          {
            id: "a",
            text: "Not necessarily a mistake strategically — but the margin math was not modeled before launch. Replacing $22M of book revenue at 42% gross margin with $22M of gift and café revenue at 28-34% gross margin costs roughly $1.8-3M in gross profit annually without anyone noticing.",
            nextQuestionId: "g3q4a",
            scoreImpact: 15,
            feedback: "Nuanced and credible. You acknowledge the strategic logic while identifying the implementation gap. This is how Deloitte consultants maintain credibility while delivering difficult news to a defensive client.",
          },
          {
            id: "b",
            text: "Yes — adding lower-margin categories to compensate for volume loss is a well-documented retail death spiral. PageTurner should return to a books-only focus and compete on curation and community.",
            nextQuestionId: "g3q4b",
            scoreImpact: -5,
            feedback: "Books-only is a strategic dead end given the Amazon dynamic. The CEO is right that diversification was necessary. The category selection was the execution problem, not the direction. This recommendation would almost certainly be rejected by the board.",
          },
          {
            id: "c",
            text: "The category mix change explains $2-3M of the $29M decline and is a secondary driver. The larger driver is occupancy and we should redirect the diagnostic focus there for maximum impact.",
            nextQuestionId: "g3q3a",
            scoreImpact: 10,
            feedback: "Correctly sizing the mix shift as secondary and redirecting to the larger occupancy driver is good analytical discipline. You are now combining both hypotheses to build the complete picture for the board.",
          },
        ],
      },
      {
        id: "g3q3c",
        stage: "Root Cause",
        question: "The engagement has been unfocused. Three days before the board meeting the senior manager pulls you aside: we need a clear single finding right now. What is it?",
        options: [
          {
            id: "a",
            text: "Both Amazon and lease costs are contributing roughly equally and the board needs a dual response strategy that addresses competitive positioning and operational cost management simultaneously.",
            nextQuestionId: "g3q4b",
            scoreImpact: 0,
            feedback: "Amazon affects industry revenue and PageTurner's revenue is flat — Amazon is context, not the proximate driver of the profit decline. The P&L shows this is overwhelmingly a cost story. Dual response dilutes urgency around the actionable fix.",
          },
          {
            id: "b",
            text: "The primary finding is occupancy: 38 lease renewals at nearly double prior rates added $18M in annual costs — 62% of the total $29M decline. This is actionable because future renewals can be governed differently and some high-cost locations can be exited.",
            nextQuestionId: "g3q4a",
            scoreImpact: 10,
            feedback: "Good. Even arriving here late, clearly identifying the primary driver and quantifying its share of the total gives the board what they need. The senior manager says: that is the finding — now build the two recommendations.",
          },
          {
            id: "c",
            text: "The primary finding is that PageTurner needs an e-commerce strategy before the cost problem becomes irrelevant given the structural trajectory of the physical bookstore industry.",
            nextQuestionId: "g3q4c",
            scoreImpact: -10,
            feedback: "An e-commerce strategy recommendation arrived at through a cost diagnostic engagement shows a fundamental disconnect between the analysis and the conclusion. E-commerce will not fix $18M in annual lease cost over the next three years.",
          },
        ],
      },
      {
        id: "g3q4a",
        stage: "Recommendation",
        question: "The board meeting is tomorrow. You have the lease data and the category mix insight. The senior manager asks for two recommendations with financial impact for each. What do you present?",
        options: [
          {
            id: "a",
            text: "Recommendation one: implement lease governance requiring board approval for any renewal above $750K, plus launch e-commerce within 12 months to compete with Amazon. Recommendation two: hire a CFO with retail real estate experience.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "The lease governance policy addresses future renewals only and not the current $18M problem. E-commerce adds costs in the near term. A CFO hire is not a specific enough recommendation. The board will ask what you are doing about the existing 38 high-cost leases.",
          },
          {
            id: "b",
            text: "Recommendation one: exit or renegotiate the 15-20 bottom-quartile high-cost locations by contribution margin — estimated savings $12-16M annually. Recommendation two: audit and rationalize the gift and café category mix toward higher-margin adjacencies — estimated recovery $4-6M in gross margin.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong board presentation. Two specific recommendations each with quantified financial impact, addressing the two root causes identified in the analysis. The board approves proceeding to the implementation phase of the engagement.",
          },
          {
            id: "c",
            text: "Recommendation one: raise book prices 10% to recover the gross margin lost to category mix changes. Recommendation two: reduce all marketing spend by 30% since the category is declining and marketing ROI is likely low.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Raising book prices in a market where Amazon undercuts on price would accelerate customer loss. Cutting marketing indiscriminately without ROI analysis is not rigorous. Neither recommendation addresses the lease cost driver that represents 62% of the problem.",
          },
        ],
      },
      {
        id: "g3q4b",
        stage: "Recommendation",
        question: "The board pushes back: we cannot close stores and the diversification was deliberate. Can we not just grow our way out of this problem instead? How do you respond?",
        options: [
          {
            id: "a",
            text: "Agree with the board — closures should be last resort. Focus the recommendation on driving traffic to underperforming stores through events, community programming, and local marketing investments.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Capitulating to pushback without the quantitative counter-argument is not consulting. Community events are unlikely to generate the revenue growth needed to offset $18M in annual lease cost. The senior manager is visibly disappointed.",
          },
          {
            id: "b",
            text: "Present both options — cost action and revenue investment — with the associated financial models for each, and let the board choose which path fits their risk tolerance and long-term vision.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Presenting options without a recommendation is weak consulting. The board hired Deloitte for a view, not a menu of choices. Quantifying both paths as supporting material is useful, but you should still make a recommendation.",
          },
          {
            id: "c",
            text: "To grow out of this problem PageTurner needs to increase revenue by approximately $97M — a 23% increase at current margins — to recover the $29M profit decline. That is significant in a declining category. Cost action is faster and more controllable. Employees at closed locations can be redeployed to higher-performing stores.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Quantifying the revenue growth needed to avoid cost action is exactly the right response to this pushback. $97M in a declining category is a sobering number. The board member who asked the question sits back visibly.",
          },
        ],
      },
      {
        id: "g3q4c",
        stage: "Recommendation",
        question: "Your engagement produced an e-commerce recommendation the CFO believes misses the point. The senior manager gives you one last opportunity: build me a two-slide board summary — one slide on diagnosis, one on recommendations — that actually addresses what the P&L shows.",
        options: [
          {
            id: "a",
            text: "Slide one: $29M decline is 62% from occupancy ($18M via 38 lease renewals at 2x prior rates) and 10% from category mix shift to lower-margin gifts and café. Slide two: exit bottom-quartile high-rent locations ($12-16M recovery) and optimize category mix ($4-6M recovery).",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Strong recovery. Clear attribution on diagnosis and two quantified actionable recommendations. This is what the engagement should have produced from the beginning. The senior manager says: this is what we needed three days ago.",
          },
          {
            id: "b",
            text: "Slide one: PageTurner faces dual pressure from Amazon competition and rising operating costs that together are compressing margins. Slide two: three-pronged response including e-commerce investment, lease governance, and targeted marketing.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "The vague dual-pressure diagnosis and three-pronged response dilutes urgency. Amazon competition is context, not the proximate cause. The board will struggle to prioritize three parallel initiatives without a clear primary recommendation.",
          },
          {
            id: "c",
            text: "Slide one: revenue is flat but costs rose $29M primarily due to lease renewals and wage inflation across the portfolio. Slide two: reduce costs through headcount reduction and mandatory lease renegotiation targeting full $29M recovery.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Labor rose only $4M and is roughly in line with inflation — recommending headcount reduction based on a minor cost line creates employee relations risk without the evidence to justify it. The lease focus in recommendation two is right but the headcount element weakens the overall presentation.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE G4: BCG — GYM MARKET SIZING
  // BEGINNER — 6 NODES
  // ─────────────────────────────────────────────
  {
    id: "g4",
    title: "FitNation: US Gym Market Sizing",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "bcg",
    estimatedMinutes: 20,
    overview: "A PE firm considering an investment in FitNation, a regional gym chain, has asked BCG to size the US gym and fitness membership market before the investment committee meets.",
    clientBackground: "FitNation operates 120 gyms in Texas and Oklahoma with 280,000 members generating $168M in annual revenue. Their average membership fee is $600 per year. The PE firm wants to understand the total market, FitNation's current position, and whether a national rollout thesis is defensible.",
    yourRole: "You are a BCG associate. The partner needs a market size estimate in 45 minutes with a clear strategic implication for the PE client.",
    startQuestionId: "g4q1",
    finalRecommendationPrompt: "The PE partner asks: based on your market sizing, is FitNation worth investing in for national expansion?",
    sampleRecommendation: "Yes. The US gym and fitness membership market is approximately $32-35B annually. FitNation at $168M holds roughly 0.5% share with unit economics of $1.4M per location — significantly above the $800K industry average. National expansion to 500 locations at similar economics would represent $700M in revenue, a 4x opportunity while holding under 2% of the total market. The critical diligence question is whether Texas and Oklahoma unit economics replicate in new geographies.",
    idealRecommendation: "FitNation is an attractive investment. The US gym membership market is approximately $32-35B. At 0.5% share with above-industry-average unit economics ($1.4M per location versus $800K benchmark), FitNation has significant national expansion headroom. The primary diligence question is geographic replication of unit economics.",
    keyTakeaways: [
      "Per-capita market sizing requires anchoring two key inputs — penetration rate and average spend per member — each of which must be estimated carefully",
      "Supply-side bottom-up sizing is a valuable cross-check that grounds consumer demand estimates in observable market data",
      "Unit economics per location are more predictive of expansion success than total current revenue or market share alone",
      "Always convert a market share percentage into a specific revenue opportunity to give the investment thesis tangible scale",
    ],
    questions: [
      {
        id: "g4q1",
        stage: "Structuring",
        question: "The partner gives you the market sizing question: size the US gym and fitness membership market. You have 45 minutes and a client call at the end. Before calculating, how do you structure the approach?",
        context: "The structure you choose here determines whether your estimate will be MECE, defensible, and easy to pressure-test. Think carefully about scope and method.",
        options: [
          {
            id: "a",
            text: "Start calculating immediately using US population times gym membership penetration rate times average annual membership fee, which seems like a clean top-down approach for this type of recurring-fee market.",
            nextQuestionId: "g4q2b",
            scoreImpact: 5,
            feedback: "Moving fast is fine under time pressure, but you have not defined scope — does this include boutique fitness studios, personal trainers, and fitness apps, or only traditional gyms? The partner asks immediately and you realize you need to clarify before calculating.",
          },
          {
            id: "b",
            text: "Define scope as traditional gym and fitness memberships only — excluding fitness apps and home equipment — then use two approaches: top-down from adult population and bottom-up from facility count, triangulating at the end.",
            nextQuestionId: "g4q2a",
            scoreImpact: 20,
            feedback: "Strong structure. Defining scope precisely and committing to two approaches with triangulation is exactly right. The partner says: good — what are your specific inputs going to be?",
          },
          {
            id: "c",
            text: "Ask the partner whether boutique fitness studios like SoulCycle and CrossFit boxes should be included in the market definition before committing to a calculation approach.",
            nextQuestionId: "g4q2c",
            scoreImpact: 5,
            feedback: "Clarifying scope with the partner is reasonable, and the partner says include all fitness facility memberships. Now you need to build the estimate from a broader base than traditional gyms alone.",
          },
        ],
      },
      {
        id: "g4q2a",
        stage: "Top-Down",
        question: "You have committed to a two-approach method and defined scope as all fitness facility memberships. Walk through your top-down inputs before calculating.",
        options: [
          {
            id: "a",
            text: "US adult population of 260M, gym membership penetration estimated at 22% based on knowing that roughly one in five adults has a gym membership, and average annual membership fee of $600 reflecting the mix of budget chains at $180 and mid-market gyms at $720.",
            nextQuestionId: "g4q3a",
            scoreImpact: 15,
            feedback: "Clean inputs. The penetration anchor of roughly one in five adults is well-grounded and the weighted average fee reflects the market structure well. This gives 260M times 22% times $600 equals $34.3B.",
          },
          {
            id: "b",
            text: "US total population of 330M, a 20% overall membership rate including children even though most children do not hold individual memberships, and an average fee of $800 per year reflecting premium gym pricing.",
            nextQuestionId: "g4q3b",
            scoreImpact: 0,
            feedback: "Including children in the total population without adjusting downward inflates the addressable base. $800 overweights premium gyms — budget chains at $180 per year represent a large portion of memberships and must be included in the weighted average.",
          },
          {
            id: "c",
            text: "US adult population of 260M, a gym membership penetration of 35% based on the idea that fitness has become mainstream, and average annual fee of $600 giving 260M times 35% times $600 equals $54.6B.",
            nextQuestionId: "g4q3c",
            scoreImpact: -5,
            feedback: "35% penetration means more than one in three American adults has a gym membership. This is too high — actual penetration data is closer to 20-22%. The partner asks you to pressure-test the penetration assumption before proceeding.",
          },
        ],
      },
      {
        id: "g4q2b",
        stage: "Top-Down",
        question: "You have started calculating without defining scope. Your first estimate using 260M adults times 22% penetration times $600 fee gives $34.3B. The partner asks: what exactly is included in this number and what is excluded?",
        options: [
          {
            id: "a",
            text: "This includes traditional gym memberships and fitness studio memberships at physical facilities. It excludes fitness apps, home equipment, personal trainers outside facilities, and boutique studios I have not explicitly included.",
            nextQuestionId: "g4q3a",
            scoreImpact: 10,
            feedback: "Reasonable scope definition delivered after the fact. The partner notes that boutique studios like SoulCycle should be included since FitNation may compete for that customer. Your $34.3B estimate may be slightly conservative if boutiques add another $3-4B.",
          },
          {
            id: "b",
            text: "This includes everything fitness-related — gyms, studios, apps, home equipment, and personal training — since all of these compete for the fitness consumer dollar in a broad definition of the market.",
            nextQuestionId: "g4q3c",
            scoreImpact: -5,
            feedback: "A market this broad overstates what FitNation actually competes in. PE investors need the addressable market for a gym chain, not the total fitness economy which includes Peloton and personal trainers. The scope is too wide to be actionable.",
          },
          {
            id: "c",
            text: "This includes all fitness facility memberships at physical locations — traditional gyms, boutique studios, and fitness centers — which is the right scope for FitNation's competitive market.",
            nextQuestionId: "g4q3a",
            scoreImpact: 15,
            feedback: "Good recovery. Defining scope clearly after the calculation still gives the partner what she needs. Physical facility memberships is the right boundary for FitNation's market and your $34.3B estimate is well-grounded at this scope.",
          },
        ],
      },
      {
        id: "g4q2c",
        stage: "Top-Down",
        question: "The partner confirms: include all fitness facility memberships — traditional gyms, boutique studios, and fitness centers. Now build the top-down estimate.",
        options: [
          {
            id: "a",
            text: "260M US adults times 25% penetration for all fitness facility memberships — slightly higher than traditional gyms alone since boutiques add incremental members — times $540 blended annual fee giving roughly $35.1B.",
            nextQuestionId: "g4q3a",
            scoreImpact: 15,
            feedback: "Reasonable adjustment for the broader scope. The penetration bump to 25% accounts for boutique-only members who would not show up in traditional gym penetration data. $35.1B is a solid top-down estimate.",
          },
          {
            id: "b",
            text: "330M total US population times 22% overall penetration times $600 average fee gives $43.6B for the full fitness facility market including all membership types.",
            nextQuestionId: "g4q3b",
            scoreImpact: 5,
            feedback: "Using total population rather than adult population inflates the base since children under 18 are rarely individual gym members. The penetration rate should be applied to adults only for a more accurate estimate.",
          },
          {
            id: "c",
            text: "260M US adults times 30% penetration for the broader fitness facility market times $600 blended fee gives $46.8B, which feels right for a market that has grown rapidly post-pandemic.",
            nextQuestionId: "g4q3c",
            scoreImpact: -5,
            feedback: "30% penetration means nearly one in three adults has a fitness facility membership. This is higher than research data supports even in a post-pandemic fitness boom. The partner asks you to justify the 30% assumption specifically.",
          },
        ],
      },
      {
        id: "g4q3a",
        stage: "Bottom-Up Cross-Check",
        question: "Your top-down estimate is approximately $34-35B. Now build the bottom-up cross-check using facility count and average revenue per location.",
        options: [
          {
            id: "a",
            text: "41,000 fitness facilities in the US times a flat average of $800K per facility equals $32.8B. That is close to the top-down estimate and validates the range, though a segmented approach would be more precise.",
            nextQuestionId: "g4q4a",
            scoreImpact: 10,
            feedback: "$32.8B versus $34.3B top-down is a 4% difference — solid triangulation. Using a flat average is slightly less precise but the partner accepts it as a reasonable cross-check under time pressure.",
          },
          {
            id: "b",
            text: "Segment the 41,000 facilities: large chains like Planet Fitness and Equinox average $1.5M annually, mid-market gyms average $750K, and boutique studios average $400K. Weighted across the mix the blended average is roughly $800K. 41,000 times $800K equals $32.8B.",
            nextQuestionId: "g4q4a",
            scoreImpact: 20,
            feedback: "Excellent segmented cross-check. The weighted average of $800K is well-justified and the $32.8B result triangulates well against the $34.3B top-down. Strong analytical rigor under time pressure.",
          },
          {
            id: "c",
            text: "Use $1.2M per facility as the average since gyms are capital-intensive businesses with high fixed costs that require significant revenue to break even. 41,000 times $1.2M gives $49.2B.",
            nextQuestionId: "g4q4c",
            scoreImpact: -5,
            feedback: "$1.2M per facility is too high — it overweights large premium chains and ignores the many small studios and budget gyms. The $49.2B result is significantly above the top-down and flags a benchmark problem rather than validating the estimate.",
          },
        ],
      },
      {
        id: "g4q3b",
        stage: "Bottom-Up Cross-Check",
        question: "Your top-down estimate is around $43B using total population rather than adults. The bottom-up using 41,000 facilities at $800K average gives $32.8B — a $10B gap. How do you resolve this?",
        options: [
          {
            id: "a",
            text: "The gap suggests my top-down over-counted by using total population instead of adults. Restricting to the 260M adult population at 22% penetration gives $34.3B, which triangulates much better with the $32.8B bottom-up.",
            nextQuestionId: "g4q4a",
            scoreImpact: 15,
            feedback: "Good diagnosis. Identifying the specific input error — children in the denominator — and correcting it immediately closes the gap. The revised estimate triangulates well.",
          },
          {
            id: "b",
            text: "The $10B gap means one estimate is right and one is wrong, but I am unsure which. I will present a range of $33-43B to cover both approaches.",
            nextQuestionId: "g4q4c",
            scoreImpact: 0,
            feedback: "A $10B range is too wide to be useful. You should diagnose which input caused the gap rather than simply widening the range to cover both estimates.",
          },
          {
            id: "c",
            text: "The bottom-up at $32.8B is more reliable since it is grounded in actual facility economics. I will revise my estimate to $32-33B and present the top-down as a flawed cross-check.",
            nextQuestionId: "g4q4a",
            scoreImpact: 5,
            feedback: "Choosing the bottom-up is reasonable, but calling the top-down flawed without diagnosing the specific error is incomplete. The children-in-denominator input error should be identified and corrected to show you understand what went wrong.",
          },
        ],
      },
      {
        id: "g4q3c",
        stage: "Bottom-Up Cross-Check",
        question: "Your top-down estimate has a penetration assumption the partner is questioning. The bottom-up using 41,000 facilities at $800K gives $32.8B. The partner says: your top-down is too high. What does the bottom-up tell you about where you went wrong?",
        options: [
          {
            id: "a",
            text: "The bottom-up at $32.8B is much lower than my top-down, which means my penetration assumption of 30-35% was too high. The bottom-up suggests actual penetration is closer to 22% given the supply-side economics, and I should revise the top-down accordingly.",
            nextQuestionId: "g4q4a",
            scoreImpact: 10,
            feedback: "Good use of the cross-check. The bottom-up estimate anchors the penetration correction and brings the top-down in line. The revised estimate of approximately $32-34B is well-triangulated.",
          },
          {
            id: "b",
            text: "The bottom-up at $32.8B is based on average revenue per facility which may undercount because many premium gyms underreport revenue. My top-down is likely more accurate.",
            nextQuestionId: "g4q4c",
            scoreImpact: -10,
            feedback: "Defending a top-down with an inflated penetration assumption by questioning the bottom-up methodology is not rigorous. The penetration assumption should be the first thing revisited when the two approaches diverge significantly.",
          },
          {
            id: "c",
            text: "The gap suggests the fitness market is between $32.8B and my higher estimate. I will use $40B as a midpoint and note that both approaches have limitations.",
            nextQuestionId: "g4q4c",
            scoreImpact: -5,
            feedback: "Using a midpoint without diagnosing the input error is analytically passive. The penetration assumption is clearly too high and should be corrected directly rather than averaged away.",
          },
        ],
      },
      {
        id: "g4q4a",
        stage: "Investment Implication",
        question: "Your triangulated estimate is $32-35B for the US fitness membership market. The partner asks: FitNation has $168M in revenue from 120 locations. What does this tell us about the investment opportunity?",
        options: [
          {
            id: "a",
            text: "FitNation holds roughly 0.5% of a $33B market. Their revenue per location of $1.4M ($168M divided by 120) is well above the $800K industry average. National scale to 500 locations at $1.4M would equal $700M revenue — a 4x opportunity holding under 2% of market.",
            nextQuestionId: "g4q5a",
            scoreImpact: 20,
            feedback: "Excellent strategic framing. The unit economics comparison is the most important insight — $1.4M per location versus $800K industry average signals above-average operational quality that supports the expansion thesis.",
          },
          {
            id: "b",
            text: "FitNation is small at 0.5% share in a fragmented market with thousands of independent gyms and national chains like Planet Fitness. Growing to national scale will require significant capital and face intense competitive response.",
            nextQuestionId: "g4q5b",
            scoreImpact: 0,
            feedback: "Competitive concerns are valid context but miss the strategic framing. 0.5% of a $33B market means enormous expansion room without displacing incumbents. The framing should emphasize the opportunity scale before introducing competitive complexity.",
          },
          {
            id: "c",
            text: "FitNation's $168M revenue against a $33B market shows how fragmented this industry is. The right strategy is to be the industry consolidator and acquire independent gyms rather than building new ones organically.",
            nextQuestionId: "g4q5c",
            scoreImpact: 5,
            feedback: "Acquisition as a consolidation strategy is a valid PE thesis, but you have moved to recommending a strategy before being asked. The partner asked for the investment implication of the market sizing, not a specific capital deployment strategy.",
          },
        ],
      },
      {
        id: "g4q4c",
        stage: "Investment Implication",
        question: "Your market estimates have been imprecise throughout. The partner tells you the industry data shows the US gym and fitness membership market at approximately $34B. You were off by about 20-40% depending on which estimate you used. What is your takeaway?",
        options: [
          {
            id: "a",
            text: "My penetration assumption was the primary error — I used 30-35% when actual penetration is closer to 22%. For future cases I will anchor penetration estimates to specific reference points like Planet Fitness's customer count divided by the adult population.",
            nextQuestionId: "g4q5a",
            scoreImpact: 10,
            feedback: "Good post-mortem. Identifying the specific input error and proposing a concrete calibration method for next time is how analysts improve their market sizing skills.",
          },
          {
            id: "b",
            text: "20-40% off is within acceptable range for a first-pass market sizing exercise since the purpose is to get the order of magnitude right rather than land on a precise number.",
            nextQuestionId: "g4q5b",
            scoreImpact: 5,
            feedback: "True that exactness is not the goal, but 40% off is at the edge of acceptable and the error should be diagnosed specifically rather than rationalized as within range.",
          },
          {
            id: "c",
            text: "I would challenge the $34B industry figure since different sources define fitness memberships differently and my broader scope estimate may simply reflect a more comprehensive market definition.",
            nextQuestionId: "g4q5c",
            scoreImpact: -5,
            feedback: "Defending an imprecise estimate by questioning the benchmark is intellectually dishonest. The right response is to diagnose the input error and calibrate the approach for next time.",
          },
        ],
      },
      {
        id: "g4q5a",
        stage: "Final Recommendation",
        question: "The PE partner asks directly: based on your market sizing, should we invest in FitNation's national expansion?",
        options: [
          {
            id: "a",
            text: "Yes, with one condition. The $33B market and 0.5% current share with unit economics of $1.4M per location — 75% above the $800K industry benchmark — support the thesis strongly. The condition is validating that Texas and Oklahoma unit economics hold outside those specific regional markets.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong conditional recommendation with specific evidence, quantified unit economics comparison, and the right diligence condition identified. This is the IC answer that gets funded.",
          },
          {
            id: "b",
            text: "Probably yes, but there are too many unknowns about competitive dynamics and geographic replication to make a confident recommendation at this stage of diligence.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Probably yes with too many unknowns is not an investment recommendation. The market sizing and unit economics data are sufficient to form a conditional view. Make the call and state the condition clearly.",
          },
          {
            id: "c",
            text: "Yes — the market is large at $33B, FitNation's unit economics are strong, and the 4x revenue opportunity to 500 locations represents an attractive PE return profile worth pursuing.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Directionally right but the recommendation would be stronger with the geographic replication condition stated explicitly, since that is the primary risk that could undermine the entire expansion thesis.",
          },
        ],
      },
      {
        id: "g4q5b",
        stage: "Final Recommendation",
        question: "The IC pushes back on your conservative framing. They say: we like the unit economics story. Just tell us — invest or pass?",
        options: [
          {
            id: "a",
            text: "Invest, conditionally. The unit economics signal — $1.4M per location versus $800K benchmark — is the most reliable data point. Combined with 0.5% share in a $33B market, the thesis is well-supported. Validate geographic replication before committing full capital.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good commitment under pressure. Leading with the unit economics signal and adding the geographic validation condition is the right structure for this recommendation.",
          },
          {
            id: "b",
            text: "The IC should decide — you have provided the market context but the investment decision requires operational diligence that goes beyond what market sizing alone can support.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Deferring the recommendation to the IC when they are explicitly asking for your view is a failure. Every analyst must make a call and defend it — that is the job.",
          },
          {
            id: "c",
            text: "Pass until better data on geographic replication is available — the unit economics are attractive but the risk of regional specificity is too high to underwrite without additional diligence.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Pass on a deal with strong unit economics and a 4x revenue opportunity because geographic replication is unconfirmed is overly conservative. The right answer is conditional invest with geographic validation as the primary diligence workstream.",
          },
        ],
      },
      {
        id: "g4q5c",
        stage: "Final Recommendation",
        question: "Your market sizing was imprecise and your investment implication framing was unclear. The partner gives you one final shot: what should the PE firm do with FitNation, and why?",
        options: [
          {
            id: "a",
            text: "Invest conditionally. Despite sizing imprecision, the unit economics signal is clear and reliable: $1.4M per location versus $800K industry average is a 75% premium that signals genuine operational quality. That is the PE thesis. Validate geographic replication before deploying full capital.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Strong recovery. Redirecting to the most reliable data point — unit economics — and giving a clear conditional recommendation despite sizing imprecision is exactly the right approach.",
          },
          {
            id: "b",
            text: "Pass — the combination of imprecise market sizing and unvalidated geographic replication creates too much uncertainty to responsibly recommend the investment at this stage.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Passing on a deal with compelling unit economics because of market sizing imprecision is an overreaction. The unit economics data is reliable and the market size, even at the lower end of estimates, is large enough to support a significant national rollout.",
          },
          {
            id: "c",
            text: "Invest — the market is large enough that even if my sizing was off by 30%, there is ample room for FitNation to scale to a meaningful national business.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "The directional conclusion is right but the reasoning is weak. Just being a large market is not sufficient — the unit economics story is the real investment thesis and should be the centerpiece of the recommendation.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE G5: MCKINSEY — HOTEL PROFITABILITY
  // BEGINNER — 6 NODES
  // ─────────────────────────────────────────────
  {
    id: "g5",
    title: "SunStay Hotels: Post-Pandemic Recovery",
    type: "profitability",
    difficulty: "beginner",
    firm: "mckinsey",
    estimatedMinutes: 22,
    overview: "A mid-scale hotel chain is struggling to recover profitability three years after the pandemic. McKinsey has been engaged to identify the primary issues and recommend quick wins.",
    clientBackground: "SunStay operates 95 hotels in business travel markets — airports, downtown business districts, conference centers. Pre-pandemic RevPAR was $98. Current RevPAR is $84. Operating cost per available room per day rose from $52 to $71 over the same period. The CEO believes the problem is purely demand-side. The CFO thinks costs are structurally out of control.",
    yourRole: "You are a McKinsey associate on the hospitality and travel practice. The partner has asked you to prepare a 10-minute update for a joint CEO-CFO meeting.",
    startQuestionId: "g5q1",
    finalRecommendationPrompt: "The CEO and CFO both ask: who is right — me or the CFO — and what should we prioritize in the next 90 days?",
    sampleRecommendation: "Both have a piece of it, but the CFO's concern is more urgent. The $14 RevPAR decline accounts for 42% of the contribution margin collapse, while the $19 operating cost increase accounts for 58%. Labor and utilities — each up 50% per available room — are the largest controllable levers. In the next 90 days: launch demand-based labor scheduling at all 95 properties and deploy revenue management optimization to recover $8-10 of the $14 ADR decline through better yield management.",
    idealRecommendation: "Both are partially right, but the CFO's concern is more financially acute. The $19 cost increase per available room (58% of the contribution margin decline) is larger than the $14 RevPAR decline (42%). Costs are structural — labor and utilities rose 50% each and will not self-correct. Priority: demand-based labor scheduling (largest controllable lever) and revenue management optimization to recover ADR. Costs first, demand second.",
    keyTakeaways: [
      "In hospitality, contribution margin equals RevPAR minus operating cost per available room — always quantify both sides before taking a position",
      "Post-pandemic cost resets in labor and utilities are often structural and do not self-correct with time or demand recovery",
      "Dynamic pricing in hotels is a high-ROI quick win that many mid-scale chains systematically underutilize",
      "When a CEO and CFO disagree, the analyst's job is to quantify both perspectives and let the data determine who is more right",
    ],
    questions: [
      {
        id: "g5q1",
        stage: "Problem Definition",
        question: "The partner briefs you before the joint CEO-CFO meeting: RevPAR fell $14 and operating cost per room rose $19. CEO blames demand. CFO blames costs. You have 10 minutes to prepare. How do you frame this for the meeting?",
        context: "You need to enter the room with a clear analytical frame that does not take sides prematurely but gives you a structure to diagnose the problem in real time.",
        options: [
          {
            id: "a",
            text: "Frame it as a contribution margin problem: RevPAR minus operating cost per room equals contribution margin. Both sides have moved negatively. Quantify which side moved more before taking any position.",
            nextQuestionId: "g5q2a",
            scoreImpact: 20,
            feedback: "Correct framing. The contribution margin lens acknowledges both concerns while establishing a neutral analytical structure. The CEO and CFO will both feel heard, and the data will determine who is more right.",
          },
          {
            id: "b",
            text: "Take the CFO's side since costs are always more controllable than demand in a hotel business, and entering the room with a view avoids looking indecisive in front of both executives.",
            nextQuestionId: "g5q2b",
            scoreImpact: -5,
            feedback: "Siding with one executive before looking at the data is a credibility risk. If the analysis ultimately shows demand is the larger driver, you will have to reverse your position in the meeting. The CEO will not forget.",
          },
          {
            id: "c",
            text: "Frame it as a revenue problem since RevPAR is the primary hotel performance metric and the CEO is closer to the operations than the CFO, making his demand diagnosis more likely to be right.",
            nextQuestionId: "g5q2c",
            scoreImpact: -10,
            feedback: "Proximity to operations does not make the CEO's hypothesis more likely to be correct — it may actually mean he is anchored on operational explanations and blind to cost changes. The data should determine the frame, not the CEO's seniority.",
          },
        ],
      },
      {
        id: "g5q2a",
        stage: "Quantifying the Problem",
        question: "You enter the meeting with the contribution margin frame. The partner asks you to run the numbers live. Using the data provided, calculate the contribution margin decline and determine which side — revenue or costs — is the larger driver.",
        exhibit: {
          type: "table",
          title: "SunStay Performance Data (Pre-Pandemic vs Current)",
          data: `| Metric                             | Pre-Pandemic | Current | Change     |
|------------------------------------|--------------|---------|------------|
| RevPAR (revenue per available room)| $98          | $84     | -$14 (-14%)|
| Occupancy rate                     | 76%          | 71%     | -5pp       |
| Average daily rate (ADR)           | $129         | $118    | -$11 (-9%) |
| Operating cost per available room  | $52          | $71     | +$19 (+37%)|
| Contribution margin per room       | $46          | $13     | -$33 (-72%)|
| Annual available room nights       | 5.18M        | 5.18M   | flat       |
| Annual contribution                | $238M        | $67M    | -$171M     |`,
        },
        options: [
          {
            id: "a",
            text: "RevPAR declined $14 while operating cost rose $19. Of the $33 total contribution margin decline, costs account for $19 (58%) and revenue for $14 (42%). Both are material but the CFO's cost concern is the larger driver.",
            nextQuestionId: "g5q3a",
            scoreImpact: 20,
            feedback: "Exactly right. Precise, quantified, and balanced. The CFO is more right than the CEO but the CEO is not wrong. This framing wins credibility with both executives simultaneously.",
          },
          {
            id: "b",
            text: "The contribution margin decline is $33 per room — the revenue side is the bigger problem since RevPAR drives all hotel economics and the occupancy rate is still significantly below pre-pandemic levels.",
            nextQuestionId: "g5q3b",
            scoreImpact: 0,
            feedback: "The statement that RevPAR is the bigger problem is incorrect — costs account for 58% of the decline versus revenue at 42%. Siding with the CEO's revenue hypothesis despite the data showing costs are larger is a missed diagnosis.",
          },
          {
            id: "c",
            text: "Both sides are exactly equal contributors since the total decline of $33 is split roughly in half between the $14 revenue drop and the $19 cost increase, so neither executive is more right than the other.",
            nextQuestionId: "g5q3c",
            scoreImpact: -5,
            feedback: "$14 and $19 are not equal — costs account for 58% and revenue 42%. Describing an unequal split as equal because both are significant misrepresents the data and undercuts the value of the quantitative analysis.",
          },
        ],
      },
      {
        id: "g5q2b",
        stage: "Quantifying the Problem",
        question: "You entered the meeting siding with the CFO. The CEO immediately pushes back: look at our occupancy — it is still 5 percentage points below pre-pandemic. Demand clearly has not recovered. How do you handle this?",
        options: [
          {
            id: "a",
            text: "Acknowledge the CEO's point and run the contribution margin calculation to determine whether revenue or cost is the larger driver before taking any further position.",
            nextQuestionId: "g5q3a",
            scoreImpact: 10,
            feedback: "Good recovery. Stepping back from the premature position and running the calculation is the right move. The CEO visibly appreciates being heard before the data drives the conclusion.",
          },
          {
            id: "b",
            text: "Hold the CFO's position and say that occupancy recovery does not matter if costs rose 37% — even at full pre-pandemic occupancy the business would still be structurally less profitable.",
            nextQuestionId: "g5q3b",
            scoreImpact: 5,
            feedback: "This point is directionally valid but defensively delivered. You are now in a debate with the CEO rather than guiding both executives toward a shared understanding of the data.",
          },
          {
            id: "c",
            text: "Reverse position entirely and agree with the CEO — occupancy at 71% versus 76% pre-pandemic confirms demand has not fully recovered and that is the primary problem.",
            nextQuestionId: "g5q3c",
            scoreImpact: -10,
            feedback: "Reversing your position under client pressure without data is worse than taking neither side initially. You now have zero credibility with both executives. The partner will want a conversation after this meeting.",
          },
        ],
      },
      {
        id: "g5q2c",
        stage: "Quantifying the Problem",
        question: "You framed it as a revenue problem and the CFO immediately says: with all due respect, you have not looked at our cost reports. Operating cost per room is up 37%. That is the problem. How do you respond?",
        options: [
          {
            id: "a",
            text: "Pivot immediately and run the contribution margin calculation to quantify both sides before the meeting goes further in the wrong direction.",
            nextQuestionId: "g5q3a",
            scoreImpact: 10,
            feedback: "Good recovery. Pivoting to the data when challenged is the right move. You lose some early credibility but the calculation will give both executives a shared fact base to work from.",
          },
          {
            id: "b",
            text: "Agree that both drivers matter and suggest the team needs to build a full attribution model over the next two weeks before presenting conclusions to the board.",
            nextQuestionId: "g5q3c",
            scoreImpact: -10,
            feedback: "Calling for a two-week attribution model in the middle of a 10-minute update meeting is not useful. The executives need a view now. The data to calculate contribution margin is already in front of you.",
          },
          {
            id: "c",
            text: "Acknowledge the cost increase is significant and recalibrate the frame to contribution margin — RevPAR minus operating cost per room — to evaluate both sides with equal rigor.",
            nextQuestionId: "g5q3a",
            scoreImpact: 15,
            feedback: "Smooth recovery. Recalibrating to the contribution margin frame incorporates the CFO's concern without abandoning analytical structure. Both executives are back on board and you have regained the room.",
          },
        ],
      },
      {
        id: "g5q3a",
        stage: "Cost Decomposition",
        question: "The CFO shares the cost breakdown. Labor is up $12 per available room (+50%) and utilities are up $4 per room (+50%). Both are structural increases. The CEO asks: can we get costs back down as demand recovers?",
        exhibit: {
          type: "table",
          title: "Operating Cost Breakdown Per Available Room Per Day",
          data: `| Category   | Pre-Pandemic | Current | Change      |
|------------|--------------|---------|-------------|
| Labor      | $24          | $36     | +$12 (+50%) |
| Utilities  | $8           | $12     | +$4  (+50%) |
| Maintenance| $7           | $9      | +$2  (+29%) |
| Supplies   | $6           | $8      | +$2  (+33%) |
| Other      | $7           | $6      | -$1  (-14%) |
| Total      | $52          | $71     | +$19 (+37%) |`,
        },
        options: [
          {
            id: "a",
            text: "Labor and utilities together account for $16 of the $19 per room increase — 84% of the total cost rise. Both reflect post-pandemic resets at new permanent levels. Labor wages rarely come back down and utility costs reflect energy market changes. These are structural, not temporary.",
            nextQuestionId: "g5q4a",
            scoreImpact: 20,
            feedback: "Correct and specific. Identifying the two largest drivers and correctly labeling them as structural rather than cyclical is the key insight. The CEO now understands why demand recovery alone will not solve the problem.",
          },
          {
            id: "b",
            text: "As occupancy recovers toward 76%, the fixed cost component will spread over more room nights and cost per available room will naturally decline. Demand recovery will partially solve the cost problem over the next 12-18 months.",
            nextQuestionId: "g5q4b",
            scoreImpact: 0,
            feedback: "Operating cost per available room includes a fixed component that improves with occupancy — you are correct about that. But labor cost per available room rose regardless of occupancy because wages reset structurally higher. The distinction between fixed and variable costs matters here.",
          },
          {
            id: "c",
            text: "Maintenance and supplies together account for $4 of the $19 increase and should be the first target for cost reduction since they are more discretionary than labor or utilities.",
            nextQuestionId: "g5q4c",
            scoreImpact: -5,
            feedback: "Maintenance and supplies are only $4 of the $19 increase — 21% of the total. Focusing cost reduction efforts on the smaller, more discretionary buckets while ignoring labor at $12 of the increase is a misallocation of management attention.",
          },
        ],
      },
      {
        id: "g5q3b",
        stage: "Cost Decomposition",
        question: "You have framed this as primarily a revenue problem. The partner pulls you aside briefly and says: you have the data right in front of you — run the numbers before the CEO uses the demand narrative to avoid cost accountability. What do you do?",
        options: [
          {
            id: "a",
            text: "Return to the meeting and present the full contribution margin calculation showing costs account for 58% of the decline and revenue 42%. Acknowledge that both matter but costs are the more urgent and controllable problem.",
            nextQuestionId: "g5q4a",
            scoreImpact: 15,
            feedback: "Good recovery under partner pressure. Presenting the full calculation and rebalancing the narrative is the right move, even if late. The CFO visibly relaxes.",
          },
          {
            id: "b",
            text: "Continue with the revenue framing since the CEO is more senior and changing position mid-meeting creates confusion and undermines the credibility of the overall presentation.",
            nextQuestionId: "g5q4b",
            scoreImpact: -10,
            feedback: "Deferring to seniority over data is the wrong choice. The partner told you directly to run the numbers. Ignoring her instruction to preserve a flawed narrative is not defensible.",
          },
          {
            id: "c",
            text: "Present both drivers equally as co-primary and avoid making a call on which is larger since the executives can interpret the data themselves.",
            nextQuestionId: "g5q4c",
            scoreImpact: 0,
            feedback: "Presenting both drivers equally when the data clearly shows costs account for 58% is imprecise. Letting executives interpret the data themselves when you have already done the calculation misses the value of the analysis.",
          },
        ],
      },
      {
        id: "g5q3c",
        stage: "Cost Decomposition",
        question: "The meeting has been contentious. The partner steps in and presents the contribution margin math herself: costs account for 58% of the decline and revenue 42%. She then turns to you and asks: given this, what do you recommend we focus on first?",
        options: [
          {
            id: "a",
            text: "Focus on costs first since they are both larger and more controllable. Labor scheduling optimization addresses the $12 per room labor increase. Revenue management can recover some ADR in parallel but is a secondary priority.",
            nextQuestionId: "g5q4a",
            scoreImpact: 10,
            feedback: "Correct prioritization. Larger driver, more controllable, faster to implement — costs should come first. Acknowledging that revenue management can run in parallel shows you understand both dimensions without losing focus.",
          },
          {
            id: "b",
            text: "Focus on revenue first since demand recovery is the natural path for a hotel and driving occupancy back to 76% will automatically improve both the revenue and cost metrics simultaneously.",
            nextQuestionId: "g5q4b",
            scoreImpact: -5,
            feedback: "Demand recovery helps but wages and utilities do not decrease as occupancy improves — those costs reset structurally. Prioritizing demand over cost action leaves the larger and more controllable driver unaddressed.",
          },
          {
            id: "c",
            text: "Tackle both simultaneously through a parallel workstream approach — one team on labor scheduling and one team on revenue management — so neither driver is de-prioritized.",
            nextQuestionId: "g5q4a",
            scoreImpact: 5,
            feedback: "Parallel workstreams are common in real engagements, but the partner asked what to focus on first. Not prioritizing when asked is evasive. Labor cost is both larger and more controllable — it should lead.",
          },
        ],
      },
      {
        id: "g5q4a",
        stage: "Quick Wins",
        question: "The CEO accepts the cost-first framing and asks: what can we actually do in the next 90 days to meaningfully improve the situation on labor specifically?",
        options: [
          {
            id: "a",
            text: "Freeze all hiring across all 95 properties for the next 90 days and let natural attrition reduce headcount gradually to bring the labor cost ratio down without operational disruption.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "Attrition-based reduction is slow and imprecise. Labor cost per available room rose 50% — you need active scheduling optimization, not passive headcount reduction through attrition over an unpredictable timeline.",
          },
          {
            id: "b",
            text: "Implement demand-based scheduling tied to occupancy forecasts at all 95 properties — staff to projected demand curves rather than fixed shift patterns. This recovers cost during low-occupancy periods without harming guest experience during peak demand.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Excellent. Demand-based scheduling directly addresses the largest cost driver at scale across all 95 properties. It improves cost efficiency without cutting service quality and can be implemented within the 90-day window.",
          },
          {
            id: "c",
            text: "Reduce all property staffing levels by 15% uniformly across all roles and monitor guest satisfaction scores to determine whether the reduction is felt by customers.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Uniform 15% reductions are blunt and create equal service quality risk across all properties regardless of their occupancy levels. Demand-based scheduling is a more precise tool that avoids this tradeoff.",
          },
        ],
      },
      {
        id: "g5q4b",
        stage: "Quick Wins",
        question: "The team has decided to focus on demand recovery first. Twelve months later, occupancy recovered from 71% to 74% but costs remained at $71 per available room. The CFO says: I told you so. The partner asks you: what do you recommend now?",
        options: [
          {
            id: "a",
            text: "The demand recovery partially worked on the revenue side, but costs are still $19 per room above pre-pandemic. Now prioritize labor scheduling optimization specifically since labor at $36 per room versus $24 pre-pandemic is the single largest addressable lever.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Good recovery even if delayed. Correctly diagnosing that demand recovery worked partially but did not touch the structural cost problem leads to the right recommendation. The CFO says: finally.",
          },
          {
            id: "b",
            text: "Continue the demand recovery program — occupancy needs to get back to 76% before we can assess whether cost action is truly necessary or whether full occupancy recovery will close the gap.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Waiting for full occupancy recovery to assess cost action ignores that labor and utility costs rose structurally and do not improve with occupancy. Another year of delay will not change this fundamental fact.",
          },
          {
            id: "c",
            text: "Accept the new cost structure as permanent and focus management energy on driving RevPAR above pre-pandemic levels to generate enough revenue to offset the structural cost increases.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Driving RevPAR above pre-pandemic is a valid long-term strategy but requires a premium market position that SunStay has not established. Accepting structural costs as permanent without attempting to manage them is incomplete.",
          },
        ],
      },
      {
        id: "g5q4c",
        stage: "Quick Wins",
        question: "The CEO and CFO have reached an impasse. The partner asks you directly: what are your two specific recommendations for the next 90 days? This is your final opportunity to add value in this meeting.",
        options: [
          {
            id: "a",
            text: "Recommendation one: implement demand-based labor scheduling at all 95 properties targeting a reduction from $36 to $28 per available room — estimated annual savings of $15M. Recommendation two: deploy revenue management optimization to recover $8-10 of the $11 ADR decline through better yield management — estimated annual revenue lift of $20M.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong finish. Two specific recommendations with quantified impact, one on each side of the contribution margin equation. The meeting ends with both executives aligned on next steps.",
          },
          {
            id: "b",
            text: "Recommendation one: hire a revenue management consultant to optimize pricing. Recommendation two: commission a labor market study to understand whether wages can be reduced at all going forward.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "Recommending to hire more consultants and commission more studies is not a recommendation — it is a delay. The executives need actionable 90-day steps, not more analysis.",
          },
          {
            id: "c",
            text: "Recommendation one: close the five least profitable properties to reduce the fixed cost base. Recommendation two: rebrand SunStay as an upscale chain to justify higher ADR and offset the structural cost increases.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Closing properties and rebranding are major strategic decisions that require months of planning and board approval — not 90-day actions. The executives asked for quick wins, not a strategy overhaul.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE G6: KPMG — FAST FOOD OPERATIONS
  // BEGINNER — 6 NODES
  // ─────────────────────────────────────────────
  {
    id: "g6",
    title: "BurgerBlitz: Drive-Through Wait Time Crisis",
    type: "operations",
    difficulty: "beginner",
    firm: "kpmg",
    estimatedMinutes: 20,
    overview: "A fast food franchise operator is experiencing a surge in drive-through wait times and declining customer satisfaction. KPMG has been engaged to diagnose the operational problem and recommend fixes.",
    clientBackground: "BurgerBlitz operates 62 franchise locations in the mid-Atlantic US. Average drive-through wait time grew from 3.2 minutes to 6.8 minutes over 18 months. Customer satisfaction scores fell from 78 to 61 out of 100. Three locations received quality standards violations from the franchisor. The franchisee group hired KPMG to present findings before the annual franchisor review.",
    yourRole: "You are a KPMG consultant on the operations practice. You have visited 8 locations over two weeks and have operational data to present to the franchisee group leadership.",
    startQuestionId: "g6q1",
    finalRecommendationPrompt: "The franchisee group leader asks: what are the top three operational changes BurgerBlitz must make to recover their wait times and satisfaction scores?",
    sampleRecommendation: "Three changes in priority order: first, rationalize the menu by removing the bottom 30% of SKUs by volume — the 28 new items added in 18 months increased kitchen complexity and preparation time by 40% and must be partially reversed. Second, update the peak-hour staffing model to reflect the 23% volume increase since 2022. Third, implement a preventive maintenance schedule for fryers and grills to eliminate the 4.8 equipment downtime incidents per month that are creating peak-period bottlenecks.",
    idealRecommendation: "Three changes: (1) SKU rationalization — remove the bottom 30% of menu items by volume to recover kitchen preparation time. (2) Staffing model update — update peak-hour staffing to match the 23% volume increase since last model update. (3) Preventive equipment maintenance — shift fryers and grills from reactive to scheduled maintenance to eliminate the 4x increase in peak-hour downtime incidents. Together these address the three root causes behind the wait time doubling.",
    keyTakeaways: [
      "In food service, menu complexity is the hidden driver of speed deterioration — each new SKU adds training, inventory, and kitchen coordination overhead",
      "Staffing models must be updated as demand patterns change since a 2019 model cannot handle 2023 volumes effectively",
      "Reactive maintenance in food service creates peak-hour failures when equipment is under maximum stress and the timing is worst",
      "Customer satisfaction in fast food correlates more strongly with wait time than any other single metric",
    ],
    questions: [
      {
        id: "g6q1",
        stage: "Problem Scoping",
        question: "Wait times doubled from 3.2 to 6.8 minutes over 18 months. Before reviewing any operational data, what are the three most likely root cause categories you would investigate first?",
        context: "Your initial structure here determines whether you run an efficient diagnostic or get lost in low-impact areas. Think about what actually drives speed of service in a quick service restaurant.",
        options: [
          {
            id: "a",
            text: "Order complexity including menu size and order value, throughput capacity including staffing and equipment, and process execution including standard operating procedures and training quality.",
            nextQuestionId: "g6q2a",
            scoreImpact: 20,
            feedback: "Correct framework. These three categories are MECE and cover the full range of drive-through speed drivers. The KPMG partner nods — this is exactly how operations consultants structure food service throughput diagnostics.",
          },
          {
            id: "b",
            text: "Staff attitude and customer friendliness, physical store layout and drive-through design, and local competition drawing away the most patient customers who tolerated slower service.",
            nextQuestionId: "g6q2b",
            scoreImpact: -5,
            feedback: "Staff attitude and competition are not the most productive diagnostic categories for a wait time problem. Physical layout is relevant but secondary. The framework misses menu complexity and equipment reliability, which are the two most common drivers of fast food speed deterioration.",
          },
          {
            id: "c",
            text: "Time spent taking the order, time spent preparing food in the kitchen, and time spent at the payment and handoff window.",
            nextQuestionId: "g6q2c",
            scoreImpact: 10,
            feedback: "Process decomposition by time step is a valid approach. It is more granular than a cause category framework and works well, though it focuses on where time is spent rather than why it increased — you will need to add the causal dimension after mapping the time steps.",
          },
        ],
      },
      {
        id: "g6q2a",
        stage: "Data Analysis",
        question: "Your site visit data is in. Review the exhibit and identify the primary operational root cause of the wait time increase.",
        exhibit: {
          type: "table",
          title: "BurgerBlitz Operational Diagnostic Data",
          data: `| Metric                           | 18 Mo Ago | Current | Change    |
|---------------------------------|-----------|---------|-----------|
| Average items per order          | 3.2       | 4.1     | +28%      |
| Menu SKU count                   | 42        | 70      | +67%      |
| Kitchen preparation time (min)   | 1.8       | 3.4     | +89%      |
| Order taking time (min)          | 0.8       | 1.2     | +50%      |
| Peak staffing per location (FTE) | 8.2       | 8.0     | -2%       |
| Daily orders per location        | 380       | 467     | +23%      |
| Equipment downtime events/month  | 1.2       | 4.8     | +300%     |
| Orders containing new items      | 0%        | 38%     | +38pp     |`,
        },
        options: [
          {
            id: "a",
            text: "Staffing is the primary problem — peak FTE declined from 8.2 to 8.0 while daily orders grew 23%, creating an understaffed kitchen that slows preparation time for every order.",
            nextQuestionId: "g6q3b",
            scoreImpact: 0,
            feedback: "Staffing declined slightly and volume grew significantly — this is a contributing factor. But kitchen preparation time grew 89% while staffing fell only 2%. The 89% preparation time increase is far too large to be explained by a 2% staffing reduction alone.",
          },
          {
            id: "b",
            text: "Kitchen preparation time grew 89% — driven by menu SKU count increasing 67%, 38% of orders now containing new and less-practiced items, and equipment downtime growing 300%. Together these three factors account for the bulk of the wait time doubling.",
            nextQuestionId: "g6q3a",
            scoreImpact: 20,
            feedback: "Correct and comprehensive. Kitchen preparation time is the largest single driver of the wait time increase, and you have correctly identified the three compounding causes behind it. The KPMG partner is visibly pleased.",
          },
          {
            id: "c",
            text: "Order taking time grew 50% from 0.8 to 1.2 minutes — this upstream bottleneck slows the entire drive-through queue before food even enters preparation.",
            nextQuestionId: "g6q3c",
            scoreImpact: -5,
            feedback: "Order taking time increased 0.4 minutes. Kitchen preparation time increased 1.6 minutes. The kitchen is the four times larger problem. Focusing on the upstream bottleneck while the much larger kitchen issue goes unaddressed misallocates the diagnostic attention.",
          },
        ],
      },
      {
        id: "g6q2b",
        stage: "Data Analysis",
        question: "Your site visit data shows kitchen preparation time grew 89% from 1.8 to 3.4 minutes, menu SKUs grew from 42 to 70, and equipment downtime incidents grew 300%. The KPMG partner asks: what is the single most important insight in this data?",
        options: [
          {
            id: "a",
            text: "Equipment downtime growing 300% is the most important insight — a 4x increase in equipment failures creates unpredictable bottlenecks that management cannot schedule around, making it the most urgent fix.",
            nextQuestionId: "g6q3a",
            scoreImpact: 5,
            feedback: "Equipment downtime is important and growing rapidly, but kitchen preparation time grew 89% even on days when equipment was functioning — meaning menu complexity and staffing issues are also major contributors. Equipment is urgent but not the single most important insight.",
          },
          {
            id: "b",
            text: "Menu SKU growth from 42 to 70 is the most important insight — a 67% increase in menu complexity means staff must prepare, practice, and inventory far more combinations than before, which is the structural cause of the kitchen preparation time increase.",
            nextQuestionId: "g6q3a",
            scoreImpact: 15,
            feedback: "Strong insight. Menu complexity is the structural root cause that drives preparation time up even when equipment works and staff are available. The other factors compound it but this is the most important single lever to address.",
          },
          {
            id: "c",
            text: "Daily orders growing 23% while peak staffing fell slightly from 8.2 to 8.0 FTE is the most important insight — volume outgrew staffing capacity and everything else follows from that imbalance.",
            nextQuestionId: "g6q3b",
            scoreImpact: 0,
            feedback: "The staffing-volume gap contributes to the problem, but kitchen preparation time grew 89% against a 23% volume increase — the preparation time increase is far larger than what volume growth alone would explain. Menu complexity is the more fundamental root cause.",
          },
        ],
      },
      {
        id: "g6q2c",
        stage: "Data Analysis",
        question: "Your time-step analysis shows kitchen preparation grew from 1.8 to 3.4 minutes — accounting for most of the total wait time increase. The franchisee group leader asks: why did kitchen time almost double?",
        options: [
          {
            id: "a",
            text: "Three compounding factors: menu SKUs grew 67% from 42 to 70, meaning more complex combinations and less staff repetition per item; 38% of orders now include new items staff have less practice with; and equipment downtime grew 300%, creating kitchen bottlenecks at peak times.",
            nextQuestionId: "g6q3a",
            scoreImpact: 15,
            feedback: "Complete and causal answer. Identifying three specific compounding factors behind the preparation time increase gives the franchisee group a clear picture of what to address and in what order.",
          },
          {
            id: "b",
            text: "Daily order volume grew 23% while staffing stayed roughly flat — more work for the same number of people naturally increases preparation time per order as staff become stretched across more simultaneous orders.",
            nextQuestionId: "g6q3b",
            scoreImpact: 5,
            feedback: "Volume growing faster than staffing is a contributing factor, but it explains maybe 20% of the 89% preparation time increase. The much larger driver is menu complexity — 70 SKUs requires far more kitchen choreography than 42.",
          },
          {
            id: "c",
            text: "The 50% increase in order taking time from 0.8 to 1.2 minutes pushed everything downstream, since longer order taking means cars arrive at the kitchen window faster than it can process them, creating a queue backup.",
            nextQuestionId: "g6q3c",
            scoreImpact: -5,
            feedback: "Order taking time increase does not cause kitchen time to increase — these are sequential steps, not concurrent. Longer order taking would actually give the kitchen slightly more lead time, not less. The kitchen time increase has independent causes.",
          },
        ],
      },
      {
        id: "g6q3a",
        stage: "Solution Design",
        question: "The franchisor representative in the room pushes back: we cannot cut menu items — the new products drove a 12% revenue increase over the same 18 months. How do you respond?",
        options: [
          {
            id: "a",
            text: "Agree and drop the menu rationalization recommendation entirely. If new items drove 12% revenue growth, removing them risks reversing that gain and the financial math does not support the change.",
            nextQuestionId: "g6q4b",
            scoreImpact: -10,
            feedback: "Capitulating without quantifying the tradeoff is not consulting. You have not calculated whether the 12% revenue gain offsets the customer satisfaction loss from doubled wait times. The data may support a partial rationalization rather than full reversal.",
          },
          {
            id: "b",
            text: "The 12% revenue increase must be weighed against the customer satisfaction decline from 78 to 61. If slower service is reducing repeat visits, the net revenue impact of the new items may be neutral or negative. Partial rationalization — removing the bottom 30% by volume — preserves most revenue while recovering most of the kitchen time.",
            nextQuestionId: "g6q4a",
            scoreImpact: 20,
            feedback: "Correct and commercially sophisticated. Quantifying the tradeoff and proposing partial rather than full rationalization addresses the franchisor's concern while defending the operational recommendation. The KPMG partner looks pleased.",
          },
          {
            id: "c",
            text: "Acknowledge the revenue point and recommend keeping all new items but investing in additional kitchen equipment and more staff training to handle the increased complexity without cutting the menu.",
            nextQuestionId: "g6q4c",
            scoreImpact: 5,
            feedback: "Equipment investment and training are valid parts of the solution, but accepting full menu complexity and only managing through operations investment is more expensive than partial rationalization. The tradeoff analysis is missing.",
          },
        ],
      },
      {
        id: "g6q3b",
        stage: "Solution Design",
        question: "You have diagnosed that volume grew 23% while staffing stayed flat. The franchisee group leader says: we cannot afford to hire significantly more staff — margins are already thin. What do you recommend?",
        options: [
          {
            id: "a",
            text: "Update the scheduling model to shift existing staff hours toward peak demand periods rather than adding headcount. Many locations are likely over-staffed during slow periods and under-staffed at peak — redistributing hours can recover throughput without hiring.",
            nextQuestionId: "g6q4a",
            scoreImpact: 15,
            feedback: "Smart operational recommendation. Shifting hours rather than adding headcount addresses the staffing-volume gap cost-effectively. This also avoids the labor cost increase that would come with hiring.",
          },
          {
            id: "b",
            text: "Accept slower service as the new normal since margins are too thin to hire more staff and the customer satisfaction decline is an unfortunate but unavoidable consequence of the cost constraint.",
            nextQuestionId: "g6q4b",
            scoreImpact: -15,
            feedback: "Accepting slower service without exploring alternatives is not consulting. Several operational levers — scheduling optimization, menu rationalization, equipment maintenance — can recover throughput without additional headcount.",
          },
          {
            id: "c",
            text: "Recommend raising menu prices by 8% to generate the margin needed to fund additional staffing at peak hours, since higher labor investment is the only path to faster service.",
            nextQuestionId: "g6q4c",
            scoreImpact: -5,
            feedback: "Recommending price increases to fund operational problems that can be addressed through scheduling and menu changes is unnecessary. Price increases also risk accelerating customer attrition at a time when satisfaction scores are already declining.",
          },
        ],
      },
      {
        id: "g6q3c",
        stage: "Solution Design",
        question: "You identified order taking time as the primary driver. The franchisee leader says: we already tested a headset upgrade last year and it did not help. What else can we do?",
        options: [
          {
            id: "a",
            text: "Investigate kitchen preparation time specifically since even if order taking is optimized, the kitchen at 3.4 minutes average preparation time is the longer bottleneck that determines the overall wait time.",
            nextQuestionId: "g6q3a",
            scoreImpact: 10,
            feedback: "Good course correction. Recognizing that the kitchen is the longer constraint redirects the diagnostic to where the largest improvement opportunity actually lives.",
          },
          {
            id: "b",
            text: "Test menu boards that pre-suggest the most popular items to reduce customer decision time before reaching the speaker, which would shrink order taking time below the current 1.2 minutes.",
            nextQuestionId: "g6q4c",
            scoreImpact: 0,
            feedback: "Simplified menu boards are a valid tactic for reducing order time, but the order taking step increased from 0.8 to 1.2 minutes — a 0.4-minute gain even at best. The kitchen step is 1.6 minutes longer — four times larger. This recommendation addresses the smaller problem.",
          },
          {
            id: "c",
            text: "Implement a pre-order system via mobile app so customers can order before arriving, eliminating the speaker step entirely and collapsing order taking time to near zero.",
            nextQuestionId: "g6q4c",
            scoreImpact: -5,
            feedback: "Mobile pre-ordering is a multi-year technology investment that would not address the current crisis. Even if implemented, the kitchen preparation time of 3.4 minutes would still be the primary constraint on total wait time.",
          },
        ],
      },
      {
        id: "g6q4a",
        stage: "Recommendation",
        question: "The franchisee group leader asks for the final three recommendations to present to the franchisor. You have strong data on kitchen preparation, staffing, and equipment. What are your top three?",
        options: [
          {
            id: "a",
            text: "One: remove the bottom 30% of menu SKUs by volume to recover kitchen preparation time without reversing the revenue from the top 70%. Two: update peak-hour scheduling to match the 23% volume increase. Three: implement preventive maintenance for fryers and grills to eliminate the 4x increase in equipment downtime incidents.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong three-recommendation package. Each recommendation addresses one of the three root causes identified in the diagnostic and together they cover the full explanation for the preparation time doubling. The franchisor representative nods approvingly.",
          },
          {
            id: "b",
            text: "One: hire 2 additional FTE per location to address the volume-staffing gap. Two: replace all kitchen equipment with newer models to reduce downtime. Three: redesign the physical drive-through lane layout to reduce queue congestion.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "These recommendations are expensive, slow to implement, and miss the largest root cause — menu complexity. Hiring and equipment replacement are capital-intensive options when scheduling optimization and menu rationalization could recover most of the wait time at much lower cost.",
          },
          {
            id: "c",
            text: "One: reduce menu to 30 SKUs by cutting all items added in the past 18 months. Two: reduce operating hours by closing from 10pm to 6am when volume is lowest. Three: add a dedicated express lane for customers ordering 3 or fewer items.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "Cutting all new items risks reversing the 12% revenue gain. Reducing hours eliminates revenue without fixing the core problem. An express lane may help at the margin but does not address kitchen preparation time which is the primary constraint.",
          },
        ],
      },
      {
        id: "g6q4b",
        stage: "Recommendation",
        question: "You have been too conservative in your recommendations to avoid conflict with the franchisor. The KPMG partner pulls you aside: the franchisees hired us to give them real answers before a difficult conversation with corporate. What do you tell them?",
        options: [
          {
            id: "a",
            text: "The data is clear: menu SKUs grew 67% and kitchen preparation time grew 89% — those numbers are directly connected. The franchisees need to negotiate with corporate to remove the bottom 30% of new SKUs, update the staffing model, and implement preventive maintenance. These three actions address the documented root causes.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Strong recovery. Giving the franchisees the honest recommendation even when it creates a difficult conversation with corporate is exactly what they hired KPMG to do. The partner says: that is what good consulting looks like.",
          },
          {
            id: "b",
            text: "The franchisees should accept the current service levels since menu innovation is a strategic franchisor priority and pushing back risks damaging the franchise relationship more than the customer satisfaction decline.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "Recommending that clients accept a problem to preserve a third-party relationship is not consulting — it is people-pleasing. The franchisees are facing quality standards violations that could cost them their franchise agreements. They need honest recommendations.",
          },
          {
            id: "c",
            text: "Recommend additional investment in training and equipment at each location to handle the menu complexity, since that is more politically feasible than asking corporate to reduce the menu.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Training and equipment investment are valid components of the solution, but they are more expensive than menu rationalization and do not address the root cause as directly. The politically feasible path is not always the right consulting recommendation.",
          },
        ],
      },
      {
        id: "g6q4c",
        stage: "Recommendation",
        question: "Your recommendations have focused on the wrong drivers. The franchisor representative shares that three other franchise groups made operational improvements and reduced wait times from 6.8 back to 4.2 minutes within 90 days. They did it through menu rationalization, scheduling updates, and preventive maintenance. The franchisee leader asks: why did we not get this recommendation from you?",
        options: [
          {
            id: "a",
            text: "Acknowledge the miss directly: the diagnostic focused on order taking and staffing additions rather than the kitchen preparation root cause. For the remaining 90 days, implement the three proven interventions immediately — menu rationalization, scheduling update, preventive maintenance.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Owning the miss and pivoting to the proven solution is the professional response. The franchisee leader respects the directness and approves the revised recommendation immediately.",
          },
          {
            id: "b",
            text: "The other franchise groups may have had different root causes — the recommendations appropriate for their context may not be appropriate for BurgerBlitz's specific operational situation.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Defending a weaker recommendation by suggesting the proven solution might not apply is intellectually dishonest. The data clearly shows the same root causes — menu complexity, staffing mismatch, and equipment downtime — that the successful franchise groups addressed.",
          },
          {
            id: "c",
            text: "The 4.2-minute result is still above pre-problem levels of 3.2 minutes, suggesting those interventions are also incomplete and the full solution requires a more comprehensive operational overhaul.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Criticizing a solution that recovered 2.6 minutes of wait time against a target of recovering 3.6 minutes in order to avoid acknowledging the recommendation miss is evasive and damages credibility further.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE G7: EY — LUXURY VEHICLE MARKET SIZING
  // BEGINNER — 6 NODES
  // ─────────────────────────────────────────────
  {
    id: "g7",
    title: "VoltLux: US Luxury EV Market Sizing",
    type: "market_sizing",
    difficulty: "beginner",
    firm: "ey",
    estimatedMinutes: 20,
    overview: "An EV startup is entering the US luxury vehicle segment. EY-Parthenon has been engaged to size the US luxury vehicle market and identify the most attractive entry segment before the investor presentation.",
    clientBackground: "VoltLux is a startup with $400M in seed funding building a luxury electric sedan to compete with Tesla Model S, BMW 7-series, and Mercedes S-class. The founding team wants to understand the total US luxury vehicle market, VoltLux's realistic addressable market, and which segment to enter first.",
    yourRole: "You are an EY-Parthenon associate. The partner needs a market size estimate with a clear methodology and entry recommendation for the investor presentation tomorrow.",
    startQuestionId: "g7q1",
    finalRecommendationPrompt: "The lead investor asks: what is VoltLux's realistic addressable market, and which luxury segment should they enter first?",
    sampleRecommendation: "VoltLux's realistic addressable market is the ultra-luxury segment ($80K-$120K vehicles) at approximately $60B annually, representing 620,000 units with 31% EV penetration — the highest of any luxury tier. This segment minimizes direct competition with Tesla's high-volume Model 3/Y, aligns with VoltLux's $85-120K target price, and has the most willing early EV adopters among luxury buyers. The $400M capital base is sufficient for a focused entry targeting California, Texas, and New York, which together represent 42% of US luxury vehicle sales.",
    idealRecommendation: "VoltLux should enter the ultra-luxury segment ($80K-$120K) first. This tier has the highest EV penetration (31%), least direct Tesla competition, and price point matching VoltLux's product. At 620,000 units annually at $96K average transaction price, the total ultra-luxury market is approximately $60B. VoltLux's realistic 3-5 year target is 1-2% share — 6,200-12,400 units annually — representing $600M-$1.2B in annual revenue.",
    keyTakeaways: [
      "Market sizing in automotive requires both unit volume and dollar value since the revenue opportunity depends heavily on average transaction price across segments",
      "Defining TAM versus SAM versus SOM matters most for early-stage startups where capital is limited and focus determines survival",
      "Geographic concentration in luxury goods is high — a few states often represent 40%+ of total US luxury purchases",
      "EV penetration by segment reveals where consumer willingness to adopt already exists, which is more predictive of startup success than total segment size alone",
    ],
    questions: [
      {
        id: "g7q1",
        stage: "Market Definition",
        question: "Before sizing anything, the partner asks you to define the exact market VoltLux is competing in. What is the most useful market definition for this investor presentation?",
        context: "The definition you choose determines whether the investor sees an attractive or unattractive opportunity. It also sets the scope for all subsequent analysis.",
        options: [
          {
            id: "a",
            text: "Define all US electric vehicles since VoltLux is an EV company and investors will want to see the full EV market opportunity rather than being constrained to a luxury sub-segment.",
            nextQuestionId: "g7q2c",
            scoreImpact: -5,
            feedback: "All US EVs includes Chevy Bolts and budget EVs where VoltLux will not compete at $85-120K pricing. A market definition this broad includes competitors who are not relevant and inflates the apparent opportunity misleadingly.",
          },
          {
            id: "b",
            text: "Define the US luxury vehicle market at $60K and above, then layer in luxury EV specifically as VoltLux's primary competitive space, allowing both TAM and SAM to be shown separately.",
            nextQuestionId: "g7q2a",
            scoreImpact: 20,
            feedback: "Correct layered definition. Total luxury market sets the ceiling of the opportunity. Luxury EV specifically is VoltLux's competitive set. This allows TAM, SAM, and SOM to be shown in sequence — exactly what investors need to evaluate an early-stage vehicle startup.",
          },
          {
            id: "c",
            text: "Define the market as Tesla's current US sales since Tesla is the primary competitor VoltLux will need to displace and investors will recognize Tesla's scale as a relevant benchmark.",
            nextQuestionId: "g7q2b",
            scoreImpact: -10,
            feedback: "Tesla's sales represent Tesla's market share, not the total addressable market. Using one competitor's revenue as the market boundary systematically understates the full opportunity VoltLux is pursuing.",
          },
        ],
      },
      {
        id: "g7q2a",
        stage: "Market Sizing",
        question: "You have defined the market as US luxury vehicles at $60K and above, segmented by price tier. Use the exhibit to calculate total market size in both units and dollars.",
        exhibit: {
          type: "table",
          title: "US Luxury Vehicle Market by Segment",
          data: `| Segment           | Annual Units | Avg Transaction Price | EV Penetration |
|-------------------|-------------|----------------------|----------------|
| Luxury 60-80K     | 980,000     | $71,000              | 24%            |
| Ultra-luxury 80-120K | 620,000  | $96,000              | 31%            |
| Super-luxury 120K+| 185,000     | $168,000             | 12%            |
| Total luxury 60K+ | 1,785,000   | $85,000 avg          | 26%            |`,
        },
        options: [
          {
            id: "a",
            text: "Total luxury market: 1,785,000 units times $85,000 average equals $151.7B annually. Luxury EV specifically: 1,785,000 times 26% EV penetration equals 464,100 units times $68,000 average EV price equals approximately $32B.",
            nextQuestionId: "g7q3a",
            scoreImpact: 20,
            feedback: "Correct calculation on both levels. $152B total luxury market and $32B luxury EV market gives the investor both the ceiling and the immediately relevant competitive space. The layered presentation is exactly right.",
          },
          {
            id: "b",
            text: "Total luxury market is approximately $75B using a rough average of $42,000 per vehicle across all 1.785 million units, and the EV portion is about $20B at similar scaling.",
            nextQuestionId: "g7q3b",
            scoreImpact: -10,
            feedback: "$42,000 is far below the stated average transaction price of $85,000 for the luxury segment. Using $42,000 — which is below the $60K luxury market floor — halves the true market size and would immediately flag a calculation error in the investor presentation.",
          },
          {
            id: "c",
            text: "Total luxury market is 1.785 million units. Dollar value calculation is not necessary since investors in the auto industry evaluate markets in unit volume rather than dollar revenue.",
            nextQuestionId: "g7q3c",
            scoreImpact: -5,
            feedback: "Investors absolutely need dollar revenue — unit volume without average transaction price misses the enormous revenue difference between a 620,000-unit segment at $96K average and a 620,000-unit segment at $71K average. The revenue calculation is essential.",
          },
        ],
      },
      {
        id: "g7q2b",
        stage: "Market Sizing",
        question: "You have used Tesla's sales as the market proxy. Tesla sells approximately 380,000 vehicles in the US annually at $68,000 average. The partner says: this underestimates the market significantly. What is missing from your scope?",
        options: [
          {
            id: "a",
            text: "Non-EV luxury vehicles from BMW, Mercedes, Audi, and Lexus are missing from the scope. VoltLux will compete for buyers who might otherwise purchase an ICE luxury vehicle, not just Tesla buyers.",
            nextQuestionId: "g7q2a",
            scoreImpact: 15,
            feedback: "Correct identification of the scope gap. VoltLux's total addressable market includes luxury buyers who have not yet switched to EV — arguably the most important segment since they represent the conversion opportunity rather than share-stealing from Tesla.",
          },
          {
            id: "b",
            text: "Tesla's market share is understated since many Tesla sales are through direct channels that are not captured in traditional auto market data, so the real Tesla-equivalent market is closer to $120B.",
            nextQuestionId: "g7q3c",
            scoreImpact: -10,
            feedback: "Tesla's direct channel sales are fully captured in their reported revenue. The scope issue is not Tesla's channel but the exclusion of all non-EV luxury competitors that VoltLux will compete against for the same buyer.",
          },
          {
            id: "c",
            text: "The international luxury EV market — EU and China — is missing and should be included since VoltLux will eventually sell globally and investors will want to see the global opportunity.",
            nextQuestionId: "g7q3c",
            scoreImpact: 0,
            feedback: "International expansion is eventually relevant but VoltLux is entering the US market first with $400M in US-focused capital. The immediate investor presentation should focus on the US TAM where the launch strategy is being executed.",
          },
        ],
      },
      {
        id: "g7q2c",
        stage: "Market Sizing",
        question: "You have defined the market broadly as all US EVs. Your estimate using all EV sales in the US: approximately 1.2M vehicles times $42,000 average price equals $50B. The partner asks: how much of this $50B can VoltLux actually address with an $85-120K vehicle?",
        options: [
          {
            id: "a",
            text: "VoltLux at $85-120K competes in the luxury EV segment only — vehicles priced at $60K and above with EV powertrain. That segment is approximately 26% of all EV sales, or about $13B at luxury price points. The $50B total EV market overstates the addressable market by nearly 4x.",
            nextQuestionId: "g7q2a",
            scoreImpact: 10,
            feedback: "Good course correction. Recognizing that the broad EV definition overstates the addressable market and narrowing to luxury EV is the right move. The $13B luxury EV estimate is lower than the full calculation would show, but the directional correction is valid.",
          },
          {
            id: "b",
            text: "VoltLux can address the full $50B EV market because luxury brand positioning creates a halo that attracts buyers across price points, similar to how BMW sells vehicles from $35K to $150K.",
            nextQuestionId: "g7q3c",
            scoreImpact: -10,
            feedback: "A startup with $400M in capital cannot launch across the full price spectrum. The BMW comparison ignores that BMW took 100 years to build a halo that supports a wide range. VoltLux's SAM for the first 5 years is exclusively the luxury segment.",
          },
          {
            id: "c",
            text: "The $50B all-EV market is the right frame since investors compare EV companies to each other regardless of price segment, and the total EV market is what matters for valuation comparables.",
            nextQuestionId: "g7q3c",
            scoreImpact: -5,
            feedback: "Valuation comparables are one lens, but the business case for VoltLux needs to show a credible path to revenue in a specific market. Using the full EV market makes the opportunity look large but does not help the investor understand where VoltLux will actually sell vehicles.",
          },
        ],
      },
      {
        id: "g7q3a",
        stage: "Entry Segment",
        question: "You have sized the total luxury market at $152B and luxury EV at $32B. The partner asks: given VoltLux's $85-120K price point and $400M capital, which luxury segment should they enter first?",
        exhibit: {
          type: "table",
          title: "Luxury Segment Entry Analysis",
          data: `| Segment           | Units   | EV Penetration | Tesla Competition | Capital Needed | VoltLux Price Fit |
|-------------------|---------|----------------|-------------------|----------------|-------------------|
| Luxury 60-80K     | 980,000 | 24%            | Very high         | Very high       | Below range       |
| Ultra-luxury 80-120K| 620,000| 31%           | Moderate          | Moderate        | Perfect fit       |
| Super-luxury 120K+| 185,000 | 12%            | Low               | Low             | Above range       |`,
        },
        options: [
          {
            id: "a",
            text: "Enter the super-luxury segment above $120K since Tesla competition is lowest there and VoltLux can position as a niche ultra-premium brand where competition is less intense.",
            nextQuestionId: "g7q4c",
            scoreImpact: -5,
            feedback: "Super-luxury has only 12% EV penetration — the lowest of any segment — meaning buyers in that tier are most resistant to EVs. Entering the segment with the least EV-receptive buyers is a difficult go-to-market position for a first-time entrant.",
          },
          {
            id: "b",
            text: "Enter the ultra-luxury segment at $80-120K: highest EV penetration at 31% shows buyer receptivity, moderate Tesla competition, perfect price range alignment at $85-120K, and sufficient unit volume at 620,000 annually for a meaningful market opportunity.",
            nextQuestionId: "g7q4a",
            scoreImpact: 20,
            feedback: "Correct entry segment. All four factors — EV penetration, competition level, price fit, and volume — point to ultra-luxury as the optimal first entry. The 31% EV penetration is particularly important because it signals existing consumer openness to EVs at that price point.",
          },
          {
            id: "c",
            text: "Enter the base luxury segment at $60-80K since it has the largest volume at 980,000 units annually, giving VoltLux the largest possible customer base for a first launch.",
            nextQuestionId: "g7q4b",
            scoreImpact: -10,
            feedback: "The $60-80K segment is Tesla's core market — Model 3, Model Y, and lower Model S variants all compete here. Entering Tesla's highest-volume stronghold with $400M in capital against a company with $20B+ in automotive capital deployed is an extremely difficult competitive position.",
          },
        ],
      },
      {
        id: "g7q3b",
        stage: "Entry Segment",
        question: "Your market size calculation had an error. The partner corrects you: the total luxury market is $152B, not $75B. How does this change the strategic recommendation?",
        options: [
          {
            id: "a",
            text: "A larger total market actually strengthens the investment case — $152B shows the ceiling is higher than the $75B estimate implied. The entry segment recommendation — ultra-luxury at $80-120K with 31% EV penetration — is unchanged since the segment selection is based on competitive positioning, not total market size.",
            nextQuestionId: "g7q4a",
            scoreImpact: 15,
            feedback: "Good recovery. Acknowledging the calculation error, noting it strengthens the case rather than weakening it, and demonstrating that the entry recommendation is robust to the correction shows analytical maturity.",
          },
          {
            id: "b",
            text: "The larger market means VoltLux can afford to target a broader range of segments simultaneously since there is more revenue available than originally calculated.",
            nextQuestionId: "g7q4b",
            scoreImpact: -5,
            feedback: "Total market size does not change VoltLux's capital constraints. $400M in seed funding determines what can be launched, not the size of the total market. A larger market makes focus more important, not less, since the opportunity to diffuse resources across a bigger addressable space is greater.",
          },
          {
            id: "c",
            text: "The calculation error undermines confidence in the entire analysis. The entry segment recommendation should be deferred until the market sizing is verified by an independent source.",
            nextQuestionId: "g7q4c",
            scoreImpact: -10,
            feedback: "A calculation error in one number does not invalidate an entire analytical framework. The entry segment recommendation is based on EV penetration, competitive dynamics, and price fit — none of which change based on the dollar value of the total market.",
          },
        ],
      },
      {
        id: "g7q3c",
        stage: "Entry Segment",
        question: "Your market scope was too broad and the partner has corrected the boundary to US luxury vehicles at $60K and above. Given the segmentation data, which segment should VoltLux enter first and why?",
        options: [
          {
            id: "a",
            text: "Enter the ultra-luxury segment at $80-120K because it combines the highest EV penetration at 31%, a price range that exactly matches VoltLux's $85-120K product, and moderate rather than intense Tesla competition.",
            nextQuestionId: "g7q4a",
            scoreImpact: 15,
            feedback: "Correct entry recommendation even arriving late to the right market scope. The three-factor rationale — penetration, price fit, and competition — is exactly right.",
          },
          {
            id: "b",
            text: "Enter all three segments simultaneously with a model lineup spanning $70K to $150K so VoltLux can capture buyers across the full luxury spectrum with a single brand launch.",
            nextQuestionId: "g7q4b",
            scoreImpact: -10,
            feedback: "A three-segment simultaneous launch with $400M in capital is not feasible. A single luxury vehicle platform targeting one segment is already an aggressive use of that capital. Multi-segment launches require 3-5x more capital for product development, marketing, and service infrastructure.",
          },
          {
            id: "c",
            text: "Enter the base luxury segment at $60-80K first since it has the largest unit volume at 980,000 annually, giving VoltLux the broadest possible customer base to build from in the early years.",
            nextQuestionId: "g7q4c",
            scoreImpact: -5,
            feedback: "Volume is attractive but the $60-80K segment is Tesla's home turf with very high competitive intensity. Entering with the largest addressable market does not help if the competitive position is untenable given the capital available.",
          },
        ],
      },
      {
        id: "g7q4a",
        stage: "Investment Implication",
        question: "The investor asks: if VoltLux targets ultra-luxury and captures 2% market share in year five, what does that mean in revenue terms?",
        options: [
          {
            id: "a",
            text: "Ultra-luxury is 620,000 units annually at $96,000 average. Two percent share equals 12,400 vehicles. At $96,000 average revenue per vehicle, year five revenue would be approximately $1.19B.",
            nextQuestionId: "g7q5a",
            scoreImpact: 20,
            feedback: "Clean and correct calculation. $1.19B in year five revenue against a $400M seed round is an attractive PE return framing — roughly 3x investment in revenue in five years, with typical auto gross margins of 15-20% implying $180-240M in gross profit.",
          },
          {
            id: "b",
            text: "Two percent of the entire luxury market at $152B would be $3B in revenue, which is a more compelling investor story than a sub-segment calculation.",
            nextQuestionId: "g7q5b",
            scoreImpact: -10,
            feedback: "The 2% being discussed applies to the ultra-luxury segment VoltLux is entering, not the entire luxury market. Applying it to the full $152B would imply VoltLux sells across all luxury segments simultaneously — not the focused strategy being recommended.",
          },
          {
            id: "c",
            text: "Without knowing VoltLux's exact manufacturing capacity and distribution plans, it is premature to project year five revenue from a market share assumption.",
            nextQuestionId: "g7q5c",
            scoreImpact: -5,
            feedback: "Market share to revenue translation is a standard investor calculation that does not require knowing specific operational details. The investor asked for a directional revenue estimate based on market sizing — provide it.",
          },
        ],
      },
      {
        id: "g7q4b",
        stage: "Investment Implication",
        question: "You have recommended entering the base luxury segment against Tesla's core market. The investor asks: what is the capital efficiency of competing directly with Tesla for the same buyers at $60-80K?",
        options: [
          {
            id: "a",
            text: "Tesla has deployed over $20B in automotive capital to dominate this segment. At $400M in seed funding, VoltLux would be competing at a 50-to-1 capital disadvantage against a competitor with an established brand, manufacturing scale, and Supercharger network.",
            nextQuestionId: "g7q5a",
            scoreImpact: 10,
            feedback: "Good quantification of the competitive disadvantage. Framing it as a capital ratio comparison is compelling and honest. This argument supports pivoting the recommendation to the ultra-luxury segment where Tesla's presence is less dominant.",
          },
          {
            id: "b",
            text: "Tesla's success in this segment actually validates the consumer demand and reduces VoltLux's market development costs since buyers are already educated on luxury EVs and willing to purchase.",
            nextQuestionId: "g7q5b",
            scoreImpact: -5,
            feedback: "While Tesla's market development work does reduce consumer education costs, the competitive intensity of facing Tesla in their highest-volume segment with 50x less capital is a structural disadvantage that validation cannot overcome.",
          },
          {
            id: "c",
            text: "The capital efficiency question cannot be answered without a detailed competitive analysis of Tesla's cost structure and VoltLux's manufacturing cost assumptions.",
            nextQuestionId: "g7q5c",
            scoreImpact: -10,
            feedback: "The capital efficiency question can be framed directionally without detailed cost analysis. The 50-to-1 capital ratio is sufficient to make the competitive position clear to an investor without needing granular cost data.",
          },
        ],
      },
      {
        id: "g7q4c",
        stage: "Investment Implication",
        question: "Your market scoping and entry segment recommendations have been inconsistent. The investor looks at you directly and asks: what is VoltLux's realistic addressable market with $400M in capital in the next five years?",
        options: [
          {
            id: "a",
            text: "With $400M in capital focused on the ultra-luxury segment, VoltLux's realistic addressable market is 620,000 annual units at $96K average — approximately $60B. A credible 5-year target is 1-2% share, or 6,200-12,400 vehicles annually, representing $600M to $1.2B in revenue.",
            nextQuestionId: "g7q5a",
            scoreImpact: 10,
            feedback: "Good recovery. Anchoring to the right segment, the capital constraint, and a realistic share range gives the investor the specific answer they need. The $600M-$1.2B revenue range is specific and defensible.",
          },
          {
            id: "b",
            text: "VoltLux's realistic addressable market is the total luxury vehicle market at $152B since brand positioning and product quality will eventually attract buyers across all luxury tiers.",
            nextQuestionId: "g7q5b",
            scoreImpact: -15,
            feedback: "Eventually attracting buyers across all tiers is a long-term aspiration, not a 5-year addressable market definition. Investors evaluating a seed-stage company need a realistic near-term SAM, not a theoretical long-term TAM.",
          },
          {
            id: "c",
            text: "With $400M in capital, VoltLux cannot realistically address any segment of the luxury vehicle market at scale — the minimum capital to launch a new vehicle brand is generally estimated at $1B or more.",
            nextQuestionId: "g7q5c",
            scoreImpact: -5,
            feedback: "Several startups including Rivian, Lucid, and Fisker launched with similar or less capital through targeted segment focus and smart capital allocation. The $400M constraint narrows the viable segments but does not make entry impossible.",
          },
        ],
      },
      {
        id: "g7q5a",
        stage: "Final Recommendation",
        question: "The lead investor asks for the final recommendation: which segment, what revenue target, and what is the most important condition to validate before committing the capital?",
        options: [
          {
            id: "a",
            text: "Enter ultra-luxury at $80-120K first, targeting $600M-$1.2B in year five revenue at 1-2% share of 620,000 annual units. The most important condition to validate is that the manufacturing cost structure supports a 15%+ gross margin at scale, since that determines whether the business model is viable.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong complete recommendation. Segment, revenue target, and primary validation condition — all three elements are present and well-reasoned. The investor nods and moves to next steps.",
          },
          {
            id: "b",
            text: "Enter ultra-luxury first and target 5% share by year five, which would mean $2.88B in revenue and establish VoltLux as the clear luxury EV alternative to Tesla in that segment.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "5% share in year five is aggressive for a brand new entrant — most luxury auto startups target 1-2% in the first five years. The segment choice is right but the share target may raise credibility questions with experienced automotive investors.",
          },
          {
            id: "c",
            text: "Enter ultra-luxury first but defer the specific revenue target until after the product design and manufacturing partnership are finalized, since revenue projections without those inputs are not meaningful.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Deferring the revenue target in an investor presentation undermines the entire purpose of the market sizing exercise. Investors need a specific number to evaluate — provide one with explicit assumptions and let them stress-test it.",
          },
        ],
      },
      {
        id: "g7q5b",
        stage: "Final Recommendation",
        question: "The investor pushes back on your broad market framing: you keep referencing the full $152B luxury market but VoltLux only has $400M to launch one vehicle. Be more specific. What can this company actually do?",
        options: [
          {
            id: "a",
            text: "With $400M and one vehicle, VoltLux can realistically target the ultra-luxury segment at $80-120K, aiming for 6,000-12,000 vehicles annually by year five. That is a credible first step in a $60B segment with 31% EV penetration already established.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good recovery under investor pressure. Committing to a specific, capital-appropriate recommendation with a defensible year-five range is what the investor needed. The 31% existing EV penetration makes the demand assumption credible.",
          },
          {
            id: "b",
            text: "With $400M, VoltLux should pursue a licensing deal with an existing luxury manufacturer rather than building independently, since the capital is insufficient for a standalone launch in any meaningful segment.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "A licensing recommendation in the middle of an investor presentation for a standalone startup is a fundamental pivot that undermines the entire investment thesis. The investor is evaluating VoltLux as a standalone brand, not a technology licensor.",
          },
          {
            id: "c",
            text: "The $400M constraint means VoltLux should start in a single US metro market — California only — to reduce launch costs before considering a national rollout.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "California-first is a valid geographic phasing strategy but the investor asked what segment VoltLux can address, not just which state. The segment recommendation should lead and California-first can be noted as a launch sequencing choice.",
          },
        ],
      },
      {
        id: "g7q5c",
        stage: "Final Recommendation",
        question: "Your analysis has been imprecise throughout. The partner gives you one final opportunity to make a coherent recommendation before the investor presentation begins. What do you say?",
        options: [
          {
            id: "a",
            text: "VoltLux should enter the ultra-luxury segment at $80-120K. This segment has 620,000 annual units, 31% existing EV penetration, the best price range alignment, and moderate Tesla competition. At 1-2% year-five share, revenue would be $600M-$1.2B. The critical validation is gross margin at scale — can VoltLux manufacture at a cost that supports 15%+ gross margin at 6,000-12,000 units per year?",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Strong recovery. All the key elements are present: segment, rationale, revenue target, and primary validation condition. The partner says: that is a much better answer — lead with that in the room.",
          },
          {
            id: "b",
            text: "VoltLux should target the total US luxury vehicle market at $152B since brand building takes time and limiting to one segment now will constrain the brand's long-term positioning.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "Leading an investor presentation with a $152B TAM without a specific entry segment is not an investment recommendation — it is a TAM slide. Investors need to know where specifically the $400M will be deployed and what revenue it will generate.",
          },
          {
            id: "c",
            text: "The analysis has too many uncertainties to make a specific entry recommendation without additional consumer research and competitive intelligence on Tesla's product roadmap.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Calling for more research at the moment of the investor presentation is not acceptable. The data in front of you is sufficient to make a directional recommendation. The investor will lose confidence in both you and VoltLux if this is the final answer.",
          },
        ],
      },
    ],
  },
// ─────────────────────────────────────────────
  // CASE G8: MCKINSEY — RETAIL BANK PROFITABILITY
  // INTERMEDIATE — 9 NODES
  // ─────────────────────────────────────────────
  {
    id: "g8",
    title: "FirstBank: Branch Portfolio Optimization",
    type: "profitability",
    difficulty: "intermediate",
    firm: "mckinsey",
    estimatedMinutes: 30,
    overview: "A regional US bank has seen branch profitability decline significantly as digital banking adoption grows. McKinsey has been engaged to determine which branches to keep, close, or transform.",
    clientBackground: "FirstBank operates 280 branches across four states with $42B in total assets. Net interest margin is 2.8% against an industry average of 3.1%. Digital banking adoption grew from 34% to 67% of transactions over five years. The CEO is under pressure from activist investors to improve ROE from 7.2% to 10%+. The CFO has proposed closing 80 branches immediately. The head of retail banking has pushed back hard, arguing closures will cause customer attrition.",
    yourRole: "You are a McKinsey associate principal leading the branch optimization workstream. You have six weeks to deliver a recommendation. The board will review your findings in week seven.",
    startQuestionId: "g8q1",
    finalRecommendationPrompt: "The CEO asks: how many branches should we close, which ones, and what is the expected impact on ROE? Give me a specific answer I can defend to the activist investors.",
    sampleRecommendation: "Close 43 branches in the low-need, poor-economics quadrant — these have 88% digital adoption and negative contribution margins with no strategic rationale to keep them. Transform 110 high-need, poor-economics branches into digital-advisory hubs at $380K cost savings each. Keep the 85 high-performing branches unchanged. This program improves annual contribution by $67M, moving ROE from 7.2% to approximately 8.4%. Reaching 10% ROE additionally requires NIM improvement and overhead reduction — branch optimization alone is not sufficient.",
    idealRecommendation: "Close 43 branches (low-need, poor-economics), transform 110 into digital-advisory hubs saving $380K each annually, keep 85 high-performing branches. Net annual contribution improvement: $67M, improving ROE to approximately 8.4%. Closing the remaining 1.6pp to reach 10% ROE requires NIM improvement from 2.8% to 3.0% and corporate overhead reduction — branch action alone closes only half the gap.",
    keyTakeaways: [
      "Branch optimization is a portfolio decision requiring a two-dimensional framework — customer need for physical service and branch economics — not a single-metric ranking",
      "Customer attrition from branch closures is highly dependent on proximity to the nearest remaining branch and the specific customer mix at each location",
      "Digital advisory hub transformation preserves 92% of branch revenue at 53% of the cost — often superior to both keeping and closing",
      "Branch optimization alone rarely closes an entire ROE gap — it must be combined with asset-liability management and overhead reduction for full impact",
    ],
    questions: [
      {
        id: "g8q1",
        stage: "Framework",
        question: "The CFO wants to close 80 branches immediately based on a single ranking by current profitability. The head of retail banking says this is too blunt and will cause massive attrition. How do you structure the branch optimization decision?",
        options: [
          {
            id: "a",
            text: "Agree with the CFO that profitability ranking is the right approach — branches losing money should close and the attrition risk is overstated since most customers will migrate to digital channels anyway.",
            nextQuestionId: "g8q2b",
            scoreImpact: -5,
            feedback: "Single-metric profitability ranking ignores strategic value such as anchor branches that serve important demographics, CRA obligations in underserved communities, and the fact that some unprofitable branches serve customers who would leave the bank entirely if closed. The McKinsey framework requires two dimensions.",
          },
          {
            id: "b",
            text: "Build a two-dimensional framework: customer need for physical banking on one axis and branch economics on the other. This creates four quadrants — keep, transform, close, and monitor — and avoids the bluntness of a single-metric ranking.",
            nextQuestionId: "g8q2a",
            scoreImpact: 20,
            feedback: "This is the McKinsey framework for branch optimization. The two-dimension approach separates the customer value question from the economic question and produces a more defensible and more nuanced recommendation than pure profitability ranking.",
          },
          {
            id: "c",
            text: "Survey customers at each branch to understand whether they would leave the bank if that branch closed, then close only those branches where customers say they would stay with the bank through digital channels.",
            nextQuestionId: "g8q2c",
            scoreImpact: -5,
            feedback: "Customer surveys have well-documented bias — customers say they want to keep branches even when they rarely use them. Revealed preference from actual transaction data is far more reliable than stated preference from surveys.",
          },
        ],
      },
      {
        id: "g8q2a",
        stage: "Portfolio Analysis",
        question: "You have built the two-dimensional framework and segmented all 280 branches. Review the exhibit and identify the recommended action for each quadrant.",
        exhibit: {
          type: "table",
          title: "FirstBank Branch Portfolio Analysis",
          data: `| Quadrant                    | Count | Avg P&L    | Digital Adoption | CRA Designated |
|----------------------------|-------|------------|------------------|----------------|
| High need, good economics  | 85    | +$420K/yr  | 45%              | 12%            |
| High need, poor economics  | 110   | -$180K/yr  | 52%              | 34%            |
| Low need, good economics   | 42    | +$210K/yr  | 81%              | 4%             |
| Low need, poor economics   | 43    | -$340K/yr  | 88%              | 3%             |`,
        },
        options: [
          {
            id: "a",
            text: "Keep high-need good economics, transform high-need poor economics into digital-advisory hubs, close low-need poor economics immediately, and monitor low-need good economics for future closure as digital adoption continues rising.",
            nextQuestionId: "g8q3a",
            scoreImpact: 20,
            feedback: "Correct quadrant mapping. This approach protects branches serving customers who need physical banking, recovers cost from the high-need underperformers through transformation, closes the clear candidates, and preserves profitable low-need branches while monitoring their declining strategic value.",
          },
          {
            id: "b",
            text: "Close all branches in the two poor economics quadrants immediately — 153 branches total — since any branch losing money represents destroyed shareholder value regardless of customer need.",
            nextQuestionId: "g8q3b",
            scoreImpact: -10,
            feedback: "Closing all 110 high-need poor-economics branches without transformation would eliminate branches serving customers who cannot easily switch to digital. 34% have CRA obligations in underserved communities — closing them would trigger regulatory scrutiny and significant customer attrition.",
          },
          {
            id: "c",
            text: "Keep all high-need branches regardless of economics, and close only the 43 low-need poor-economics branches since those are the only ones with neither strategic nor financial justification for remaining open.",
            nextQuestionId: "g8q3c",
            scoreImpact: 5,
            feedback: "Closing only the 43 clear candidates is correct, but keeping all 110 high-need poor-economics branches without transformation leaves significant cost recovery on the table. Transformation rather than pure retention for that quadrant is the more complete answer.",
          },
        ],
      },
      {
        id: "g8q2b",
        stage: "Portfolio Analysis",
        question: "You have agreed to a profitability-based ranking and the top 80 closure candidates are identified. The head of retail banking shares that 38 of these 80 branches have 34% CRA designations in underserved communities. How does this change the analysis?",
        options: [
          {
            id: "a",
            text: "CRA-designated branches must be excluded from closure consideration entirely since the regulatory risk outweighs any cost savings — redesign the closure list to exclude all 38 CRA branches.",
            nextQuestionId: "g8q3b",
            scoreImpact: 5,
            feedback: "Excluding all CRA branches is overly conservative. CRA obligations can be met through other means including community development lending and mobile banking outreach. The question is whether each specific branch is the most effective way to fulfill CRA obligations.",
          },
          {
            id: "b",
            text: "CRA obligations are a constraint that changes the closure decision for some branches — each CRA-designated branch in the closure list should be individually assessed for whether the CRA obligation can be maintained without a physical branch before deciding.",
            nextQuestionId: "g8q3a",
            scoreImpact: 15,
            feedback: "Correct nuanced approach. CRA is a real constraint but not an absolute prohibition on closure. Individual assessment of whether the obligation can be maintained through other means — rather than blanket exclusion — is the more rigorous and commercially defensible position.",
          },
          {
            id: "c",
            text: "CRA designation is not a binding constraint since most banks have found ways to fulfill CRA obligations without branches — proceed with the original 80-closure plan and address CRA through increased community lending volumes.",
            nextQuestionId: "g8q3b",
            scoreImpact: -5,
            feedback: "While alternative CRA fulfillment is possible, the regulator assesses compliance at the community level and physical branch presence is weighted heavily in many markets. Proceeding without individual assessment creates regulatory risk that should not be dismissed.",
          },
        ],
      },
      {
        id: "g8q2c",
        stage: "Portfolio Analysis",
        question: "The survey results are in: 72% of customers say they would stay with FirstBank if their branch closed, and 28% say they would consider switching. The head of retail banking says: see, 28% attrition risk is huge and proves we cannot close any branches. How do you interpret this data?",
        options: [
          {
            id: "a",
            text: "The 28% stated attrition intention significantly overstates likely actual attrition — historical bank branch closure data shows actual attrition rates of 6-14% depending on proximity to the nearest remaining branch, not 28%.",
            nextQuestionId: "g8q3a",
            scoreImpact: 15,
            feedback: "Correct interpretation. Survey-stated attrition intentions are consistently 2-3x higher than actual attrition when branches close. The right analysis uses historical attrition rates from comparable branch closures, not stated preference surveys.",
          },
          {
            id: "b",
            text: "The 28% attrition risk is accurate and confirms the head of retail banking is right — FirstBank should not close any branches and should instead focus on cost reduction within the existing branch network.",
            nextQuestionId: "g8q3b",
            scoreImpact: -10,
            feedback: "Taking stated attrition intentions at face value ignores well-established survey bias. A bank that never closes branches because 28% of customers always say they might leave will never optimize its branch network.",
          },
          {
            id: "c",
            text: "The survey validates that branch closures are high-risk and suggests FirstBank should only close branches where the 28% potentially-departing customers are low-value accounts with minimal revenue impact.",
            nextQuestionId: "g8q3c",
            scoreImpact: 5,
            feedback: "Segmenting at-risk customers by revenue is a valid additional analysis, but the fundamental problem is still that the 28% figure overstates actual attrition. Historical closure data should replace survey data as the primary attrition input.",
          },
        ],
      },
      {
        id: "g8q3a",
        stage: "Transformation Model",
        question: "You have identified 110 high-need, poor-economics branches for transformation into digital-advisory hubs. Review the transformation model data and determine whether this is the right approach.",
        exhibit: {
          type: "table",
          title: "Branch Transformation Model Options",
          data: `| Model               | Staff  | Annual Cost | Revenue Retention | NPS Impact  |
|--------------------|--------|-------------|-------------------|-------------|
| Full service       | 7.8 FTE| $800K       | 100% baseline     | Baseline    |
| Digital-advisory   | 3.2 FTE| $420K       | 92%               | +8 points   |
| Micro-branch       | 2.1 FTE| $285K       | 78%               | -12 points  |
| ATM only           | 0 FTE  | $45K        | 42%               | -45 points  |`,
        },
        options: [
          {
            id: "a",
            text: "The digital-advisory model is best for the 110 high-need branches — it saves $380K per branch annually, retains 92% of revenue, and actually improves NPS by 8 points. This outperforms micro-branch and ATM-only on all dimensions except raw cost savings.",
            nextQuestionId: "g8q4a",
            scoreImpact: 20,
            feedback: "Correct analysis. Digital-advisory hubs optimize the economics-revenue-retention tradeoff. The NPS improvement is particularly notable — transforming to a relationship model improves customer satisfaction while cutting costs. This is the McKinsey recommendation.",
          },
          {
            id: "b",
            text: "The micro-branch model at $285K annual cost is better than digital-advisory at $420K — the $135K additional savings per branch times 110 branches equals $14.85M in incremental annual savings that outweigh the 14pp revenue retention difference.",
            nextQuestionId: "g8q4b",
            scoreImpact: -5,
            feedback: "The $14.85M incremental cost savings must be weighed against the 14pp revenue retention difference. 110 branches averaging $800K in revenue means 14% lower retention equals $12.3M in annual revenue loss — nearly offsetting the cost savings. Plus the -12 NPS impact creates downstream attrition risk.",
          },
          {
            id: "c",
            text: "ATM-only conversion maximizes cost savings at $755K per branch and the bank's already-high 67% digital adoption means customers have demonstrated they do not need in-person service at these locations.",
            nextQuestionId: "g8q4c",
            scoreImpact: -10,
            feedback: "ATM-only retains only 42% of revenue. For the 110 high-need branches averaging $800K revenue, 58% revenue loss equals $464K per branch. Net savings after revenue loss: $755K cost savings minus $464K revenue loss equals $291K — less than the digital-advisory model's $380K net benefit per branch, with a catastrophic NPS impact.",
          },
        ],
      },
      {
        id: "g8q3b",
        stage: "Transformation Model",
        question: "You are proceeding with a large-scale closure recommendation. The CFO asks you to quantify the revenue at risk from the closures so the board can assess the net financial impact.",
        exhibit: {
          type: "table",
          title: "Revenue Attrition Analysis by Customer Segment",
          data: `| Customer Segment         | Pct of Deposits | Historical Attrition | Revenue at Risk |
|--------------------------|----------------|----------------------|-----------------|
| Digital-first (88% dig)  | 45%            | 3%                   | Low             |
| Hybrid (50-88% dig)      | 32%            | 12%                  | Medium          |
| Branch-dependent (<50%)  | 23%            | 34%                  | High            |
| Blended average          | 100%           | 14%                  |                 |`,
        },
        options: [
          {
            id: "a",
            text: "Use the blended 14% attrition rate across all closures — this gives a single defensible number for the board presentation and avoids the complexity of branch-by-branch segmentation.",
            nextQuestionId: "g8q4b",
            scoreImpact: 0,
            feedback: "A blended rate applied uniformly misses the fact that different branches have very different customer mixes. A branch with 80% branch-dependent customers faces 34% attrition risk — applying 14% to it significantly understates the revenue at risk from that specific closure.",
          },
          {
            id: "b",
            text: "Model attrition branch-by-branch using the actual customer mix at each location and the proximity to the nearest remaining FirstBank branch, since these two factors together predict actual attrition far better than any blended average.",
            nextQuestionId: "g8q4a",
            scoreImpact: 20,
            feedback: "Correct analytical approach. Branch-level customer mix and proximity to the nearest remaining branch are the two most predictive variables for actual attrition. Historical closure data confirms attrition drops to 6% when the nearest branch is within 2 miles.",
          },
          {
            id: "c",
            text: "Use the branch-dependent attrition rate of 34% for all closed branches as a conservative upper bound, then present this worst-case scenario to the board so they understand the maximum downside.",
            nextQuestionId: "g8q4c",
            scoreImpact: -5,
            feedback: "Using 34% for all closures dramatically overstates revenue at risk for branches with high digital adoption. The worst-case approach might lead the board to reject closures that are genuinely financially sound based on an artificially inflated attrition estimate.",
          },
        ],
      },
      {
        id: "g8q3c",
        stage: "Transformation Model",
        question: "You have recommended closing only the 43 clear-candidate branches. The activist investor representative on the board says: 43 closures out of 280 branches is too timid. We need at least 100 closures to move the ROE needle. How do you respond?",
        options: [
          {
            id: "a",
            text: "Increase the closure target to 100 branches to satisfy the activist investor — the board pressure is real and a recommendation the board rejects has no value.",
            nextQuestionId: "g8q4c",
            scoreImpact: -15,
            feedback: "Changing a recommendation under investor pressure without analytical justification undermines consulting integrity. If 100 closures is not supported by the data, recommending it to satisfy an activist destroys the value of independent analysis.",
          },
          {
            id: "b",
            text: "Close 43 and transform 110 into digital-advisory hubs — the transformation program recovers $380K per branch annually on 110 branches, which is $41.8M per year. Combined with 43 closures, total contribution improvement is $67M. This addresses the ROE problem without destroying the customer relationships in the high-need segment.",
            nextQuestionId: "g8q4a",
            scoreImpact: 20,
            feedback: "Strong counter-argument. Quantifying the transformation contribution and showing the activist investor that the total program impact is larger than closure alone is the right response. $67M annual improvement is a meaningful move toward the 10% ROE target.",
          },
          {
            id: "c",
            text: "Acknowledge the activist's point and propose commissioning additional analysis on a further 30-40 branches to identify additional closure candidates that might have been missed in the initial segmentation.",
            nextQuestionId: "g8q4b",
            scoreImpact: 5,
            feedback: "Additional analysis is a reasonable bridge, but it delays the recommendation and the activist investor wants action. A more compelling response uses the data already in hand to show the full program impact including transformation.",
          },
        ],
      },
      {
        id: "g8q4a",
        stage: "ROE Impact",
        question: "The CEO asks the critical question: will this branch program get FirstBank to 10% ROE? Walk through the math.",
        exhibit: {
          type: "table",
          title: "ROE Impact Bridge Analysis",
          data: `| Initiative                          | Annual P&L Impact | Notes                       |
|------------------------------------|-------------------|-----------------------------|
| Starting ROE                        |                   | 7.2% on $4.2B equity        |
| Branch closures (43 branches)       | +$31M pre-tax     | Savings minus revenue loss  |
| Hub transformations (110 branches)  | +$36M pre-tax     | $41.8M savings minus losses |
| Total branch program                | +$67M pre-tax     |                             |
| After-tax impact ($50M)             |                   |                             |
| Pro-forma net income                |                   | $302M + $50M = $352M        |
| Pro-forma ROE                       | 8.4%              | $352M divided by $4.2B      |
| Gap to 10% target                   | 1.6pp             | Needs $67M more net income  |`,
        },
        options: [
          {
            id: "a",
            text: "Yes — the branch program fully achieves the 10% ROE target by improving contribution by $67M pre-tax and the activist investor should be satisfied with this outcome.",
            nextQuestionId: "g8q5a",
            scoreImpact: -10,
            feedback: "The numbers show ROE improving from 7.2% to 8.4% — not 10%. Telling the CEO the target is achieved when the math shows a 1.6pp gap remaining is a credibility failure that will be discovered immediately when the board reviews the analysis.",
          },
          {
            id: "b",
            text: "The branch program improves ROE from 7.2% to 8.4% — meaningful progress but 1.6pp short of the 10% target. Closing the remaining gap requires NIM improvement from 2.8% to 3.0% through better asset-liability management, and corporate overhead reduction. Branch optimization alone cannot get to 10%.",
            nextQuestionId: "g8q5a",
            scoreImpact: 20,
            feedback: "Correct and honest answer. Presenting the branch program as a necessary but insufficient step toward 10% ROE, and identifying the additional levers needed, is what the CEO needs to hear to set appropriate board expectations.",
          },
          {
            id: "c",
            text: "The branch program cannot be evaluated against ROE without a full model of all bank operations including loan growth, deposit repricing, and interest rate sensitivity — this calculation is too simplified to present to the board.",
            nextQuestionId: "g8q5b",
            scoreImpact: -5,
            feedback: "The ROE bridge provided is a standard management accounting tool appropriate for board presentations. Refusing to use it because it is not a full bank model is overly perfectionist and delays a decision that the board needs to make.",
          },
        ],
      },
      {
        id: "g8q4b",
        stage: "ROE Impact",
        question: "Your analysis shows a 14% blended attrition rate across all closures. The head of retail banking calculates that at $800K average revenue per closed branch and 14% attrition, revenue at risk is $4.8M annually across 43 closures. He says: the cost savings are not worth this revenue loss. How do you evaluate his math?",
        options: [
          {
            id: "a",
            text: "His calculation is correct — $4.8M revenue loss against $14.7M in cost savings from 43 closures gives a net improvement of $9.9M, which is still positive and confirms closures are worth pursuing despite the attrition.",
            nextQuestionId: "g8q5a",
            scoreImpact: 10,
            feedback: "Good counter-calculation. Net of attrition, closures still generate $9.9M in annual contribution improvement. The head of retail banking made an error by presenting the revenue loss without netting it against the cost savings.",
          },
          {
            id: "b",
            text: "The head of retail banking is right — $4.8M in annual revenue loss significantly erodes the closure value proposition and the program should be redesigned to focus on transformation rather than closures.",
            nextQuestionId: "g8q5b",
            scoreImpact: -5,
            feedback: "Accepting his math without netting against cost savings is incomplete. The $4.8M revenue loss must be compared against the $14.7M in cost savings ($340K average annual loss per branch times 43). Net improvement of $9.9M is still significant and supports proceeding.",
          },
          {
            id: "c",
            text: "The 14% blended attrition rate should be replaced with branch-level attrition estimates based on customer mix and proximity to remaining branches, which will likely reduce the revenue at risk estimate significantly below $4.8M.",
            nextQuestionId: "g8q5a",
            scoreImpact: 15,
            feedback: "Correct analytical improvement. Branch-level attrition modeling using customer mix and proximity data will produce a more accurate and likely lower revenue at risk estimate than the blended average. The head of retail banking may be overstating risk by using the blended rate.",
          },
        ],
      },
      {
        id: "g8q4c",
        stage: "ROE Impact",
        question: "Your recommendation has either been too aggressive or too conservative in response to various stakeholder pressures. The partner pulls you aside before the board meeting: the board needs a number — how many closures and what is the ROE impact?",
        options: [
          {
            id: "a",
            text: "43 closures and 110 hub transformations. Total annual contribution improvement of $67M pre-tax, improving ROE from 7.2% to 8.4%. Reaching 10% additionally requires NIM improvement and overhead reduction — the branch program alone closes half the gap.",
            nextQuestionId: "g8q5a",
            scoreImpact: 15,
            feedback: "Good recovery. Specific numbers, specific financial impact, and honest acknowledgment that the branch program alone is not sufficient for the full target. This is what the board needs to make a decision.",
          },
          {
            id: "b",
            text: "100 closures as the activist investor requested — ROE impact will be higher than the 43-closure program and the board is more likely to accept a recommendation that aligns with the investor's stated preference.",
            nextQuestionId: "g8q5b",
            scoreImpact: -15,
            feedback: "Recommending 100 closures to align with investor preference rather than analytical conclusion destroys the value of independent consulting. If 100 closures causes more revenue attrition than cost savings, this is a value-destructive recommendation.",
          },
          {
            id: "c",
            text: "43 closures only, targeting a $31M annual improvement and ROE moving from 7.2% to 7.9%. This is the most conservative and most defensible recommendation given the attrition uncertainty.",
            nextQuestionId: "g8q5b",
            scoreImpact: 0,
            feedback: "Presenting only the closure program without the hub transformation understates the full program impact by $36M annually. The 110 hub transformations are a core part of the recommendation and should not be omitted to achieve conservatism.",
          },
        ],
      },
      {
        id: "g8q5a",
        stage: "Board Presentation",
        question: "The board presentation is complete. The activist investor asks the final question: if 10% ROE requires additional actions beyond branch optimization, what are the other two most important levers and can management realistically achieve them?",
        options: [
          {
            id: "a",
            text: "NIM improvement from 2.8% to 3.0% through asset-liability management optimization is worth approximately $84M pre-tax at FirstBank's asset base. Corporate overhead reduction targeting $22M is the second lever. Both are achievable within 18-24 months and together with the branch program get FirstBank to approximately 10.2% ROE.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Excellent complete answer. Quantified, sequenced, and closing the loop from the initial ROE gap to the full solution. The board has everything needed to approve the program and set management targets.",
          },
          {
            id: "b",
            text: "Loan growth and increasing credit risk appetite are the fastest paths to higher ROE — taking more risk would improve returns without requiring the operational changes that branch optimization requires.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Recommending increased credit risk appetite as a primary ROE lever is unlikely to be accepted by a bank board facing activist investor pressure — it trades short-term return for long-term risk and does not address the structural efficiency problem.",
          },
          {
            id: "c",
            text: "The additional levers are complex bank management decisions that require separate workstreams to analyze properly — branch optimization should be approved first and the additional levers addressed in a follow-on engagement.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Deferring the full ROE solution to a follow-on engagement is a reasonable consulting position but undersells the analysis. The NIM and overhead levers are quantifiable from available data and the board would benefit from seeing the full path to 10% ROE today.",
          },
        ],
      },
      {
        id: "g8q5b",
        stage: "Board Presentation",
        question: "The board has concerns about the recommendation. Several directors say the analysis underweights customer attrition risk. How do you defend the analytical approach?",
        options: [
          {
            id: "a",
            text: "Historical branch closure data from comparable banks shows actual attrition of 6-14% depending on proximity to remaining branches — not the 28% survey figure or the 34% branch-dependent segment rate. The recommendation is built on observed behavior, not stated intentions.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong defense. Using historical revealed-preference data to counter the attrition concern is the right analytical move. Observed behavior from comparable closures is more reliable than any stated preference data and the board should find this compelling.",
          },
          {
            id: "b",
            text: "Acknowledge the board's concern and recommend delaying closure implementation for 12 months to gather more customer attrition data from a pilot closure of 5 branches before proceeding with the full program.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "A pilot is a reasonable risk mitigation approach, but it delays $67M in annual improvement by at least 12 months. The historical data from comparable banks is sufficient to proceed — a pilot should be proposed only if the board is not persuaded by the historical evidence.",
          },
          {
            id: "c",
            text: "Agree with the board that attrition risk is the primary uncertainty and recommend reducing the closure target from 43 to 20 branches until more data is available.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Cutting the recommendation in half under board pressure without new analytical justification undermines the value of the analysis. If the historical data supports 43 closures, that remains the right recommendation regardless of board discomfort.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE G9: BCG — STREAMING PLATFORM GROWTH
  // INTERMEDIATE — 9 NODES
  // ─────────────────────────────────────────────
  {
    id: "g9",
    title: "StreamMax: Breaking the Subscriber Plateau",
    type: "profitability",
    difficulty: "intermediate",
    firm: "bcg",
    estimatedMinutes: 28,
    overview: "A streaming platform has plateaued at 85 million subscribers and is losing ground to competitors. BCG has been engaged to develop a growth strategy.",
    clientBackground: "StreamMax is a US-based streaming service launched in 2016 with 85M subscribers globally — 62M domestic and 23M international. Annual revenue is $12.4B with a 12% EBITDA margin. They spend $8.2B on content annually. Net subscriber adds were negative 2M last quarter. Monthly churn increased from 2.1% to 3.4% over 18 months. Netflix has 238M subscribers, Disney+ has 150M, and HBO Max has 95M. The CEO has set a target of 120M subscribers within three years.",
    yourRole: "You are a BCG project leader on the media and entertainment practice. You are presenting preliminary findings to StreamMax's Chief Growth Officer after three weeks of analysis.",
    startQuestionId: "g9q1",
    finalRecommendationPrompt: "The CGO asks: what is StreamMax's path to 120M subscribers in three years, and what are the three most important strategic moves?",
    sampleRecommendation: "StreamMax can reach 120M subscribers through three moves in sequence. First, launch an ad-supported tier at $4.99/month within six months — 28M churned users cite price as their primary reason for leaving and a lower tier could re-acquire 5-8M at positive economics given ad revenue. Second, expand into India and Brazil with localized content investment — both markets represent 15-20M additional addressable subscribers at $3-6/month. Third, pivot the incremental content dollar toward unscripted and sports-adjacent programming, which delivers 81-84% retention rates at 60-75% lower cost per hour than original drama.",
    idealRecommendation: "Three moves: (1) Ad-supported tier launch — re-acquires 5-8M price-sensitive churners while attracting new lower-income subscribers. (2) India and Brazil international expansion — 15-20M additional subscribers in growing markets. (3) Content mix optimization toward unscripted and sports-adjacent content with higher retention per dollar. Combined, these three moves can add 35-40M subscribers over three years, reaching the 120M target.",
    keyTakeaways: [
      "In subscription businesses, churn reduction compounds more powerfully than new subscriber acquisition — 1pp monthly churn reduction retained over 12 months equals more than 10% new subscriber growth",
      "Ad-supported tiers are a proven mechanism to expand TAM for streaming platforms without cannibalizing the premium subscriber base significantly",
      "Content ROI varies enormously by genre — unscripted content often delivers better retention per dollar than prestige drama despite having lower cultural cachet",
      "International expansion in streaming requires genuine local content investment, not just translated versions of domestic content",
    ],
    questions: [
      {
        id: "g9q1",
        stage: "Diagnosis",
        question: "StreamMax lost net subscribers last quarter and churn rose from 2.1% to 3.4% monthly. Before developing growth strategy, you need to understand why churn is rising. How do you approach the diagnosis?",
        options: [
          {
            id: "a",
            text: "Analyze the content library versus competitors to identify gaps since streaming churn is primarily driven by content quality and library depth relative to competitive alternatives.",
            nextQuestionId: "g9q2b",
            scoreImpact: 5,
            feedback: "Content gap analysis is relevant but assumes the diagnosis before completing it. Churn can be driven by price, content, competing services, or technical experience — you need data before assuming content is the primary driver.",
          },
          {
            id: "b",
            text: "Review exit survey data from churned subscribers to identify the stated reasons for cancellation, then cross-reference with behavioral data on content consumption before cancellation to separate true causes from stated causes.",
            nextQuestionId: "g9q2a",
            scoreImpact: 20,
            feedback: "Correct diagnostic approach. Combining stated reasons with behavioral data is the most rigorous way to identify true churn drivers. Subscribers often cite one reason when the behavioral pattern points to another.",
          },
          {
            id: "c",
            text: "Benchmark StreamMax's price point against all major streaming competitors to determine whether pricing is the most obvious cause of the churn increase before investing in more complex analysis.",
            nextQuestionId: "g9q2c",
            scoreImpact: 5,
            feedback: "Pricing benchmarking is quick and useful, but as a standalone starting point it is too narrow. Price may be one of several churn drivers — going straight to price analysis before reviewing the full exit data may cause you to miss equally important factors.",
          },
        ],
      },
      {
        id: "g9q2a",
        stage: "Churn Diagnosis",
        question: "Exit survey data and behavioral analysis are in. Review the exhibit and identify the primary churn driver.",
        exhibit: {
          type: "table",
          title: "StreamMax Churn Analysis (Exit Survey n=24,000)",
          data: `| Churn Reason               | Pct Citing | Change vs 18 Mo Ago |
|---------------------------|------------|---------------------|
| Price too high             | 34%        | +18pp               |
| Not enough content I want  | 28%        | +11pp               |
| Switching to competitor    | 22%        | +8pp                |
| Password sharing concern   | 9%         | -4pp                |
| Technical issues           | 4%         | -1pp                |
| Other                      | 3%         | -32pp               |`,
        },
        options: [
          {
            id: "a",
            text: "Price sensitivity is clearly the primary driver at 34% and growing 18pp — this points directly to launching an ad-supported tier as the highest-priority intervention.",
            nextQuestionId: "g9q3a",
            scoreImpact: 15,
            feedback: "Price is the largest and fastest-growing churn reason, making an ad-supported tier the logical first response. The +18pp growth also tells you this is a worsening problem, not a stable one — urgency is real.",
          },
          {
            id: "b",
            text: "Switching to competitors at 22% is the most actionable insight since it reveals that customers are finding better alternatives — the focus should be on competitive differentiation rather than price.",
            nextQuestionId: "g9q3b",
            scoreImpact: 0,
            feedback: "Switching to competitors is a symptom, not a root cause — customers switch because of price, content gaps, or both. Treating it as a standalone driver leads to a competitive response that does not address the underlying reasons they are leaving.",
          },
          {
            id: "c",
            text: "Content gaps at 28% and growing 11pp combined with price at 34% and growing 18pp together represent 62% of churn and suggest a dual intervention is needed: both a lower-priced tier and a content library improvement.",
            nextQuestionId: "g9q3a",
            scoreImpact: 10,
            feedback: "Combining both primary drivers is analytically complete. Price is larger but content is growing quickly too. The dual framing sets up the subsequent analysis on both content strategy and pricing architecture.",
          },
        ],
      },
      {
        id: "g9q2b",
        stage: "Churn Diagnosis",
        question: "You have analyzed the content library. StreamMax's original drama catalog is 42% smaller than Netflix's. However, retention data shows StreamMax's own unscripted content has an 81% retention rate versus 68% for its original drama. The CGO says: we just need to spend more on drama. How do you respond?",
        options: [
          {
            id: "a",
            text: "The retention data directly contradicts that conclusion — unscripted at 81% versus drama at 68% means spending more on drama to close the Netflix gap would actually hurt retention per dollar spent. The content mix should shift toward unscripted, not toward more drama.",
            nextQuestionId: "g9q3b",
            scoreImpact: 15,
            feedback: "Correct reading of the data. The retention comparison is the key insight — chasing Netflix on drama with lower budgets will produce inferior results per dollar compared to investing in the content type where StreamMax already outperforms. This challenges the received wisdom in streaming.",
          },
          {
            id: "b",
            text: "Agree with the CGO — the Netflix drama gap is the most visible competitive disadvantage and closing it will require significant investment even if the per-dollar returns are lower than unscripted.",
            nextQuestionId: "g9q3c",
            scoreImpact: -10,
            feedback: "Agreeing with the CGO because drama gap is visible while ignoring the retention data is letting brand perception override financial analysis. The retention numbers clearly show where StreamMax's content investment generates the most subscriber value.",
          },
          {
            id: "c",
            text: "Suggest a balanced approach — invest equally in drama and unscripted — to address the competitive gap while also leveraging the retention advantage in unscripted content.",
            nextQuestionId: "g9q3b",
            scoreImpact: 5,
            feedback: "A balanced approach is safer politically but sub-optimal analytically. The retention data makes a clear argument for shifting the incremental dollar toward unscripted. Equal investment in drama despite lower returns represents a capital allocation inefficiency.",
          },
        ],
      },
      {
        id: "g9q2c",
        stage: "Churn Diagnosis",
        question: "Pricing benchmarking shows StreamMax at $14.99 standard tier — the same as Netflix standard. Disney+ offers $7.99 with ads. HBO Max offers $9.99 with ads. StreamMax has no ad-supported tier. The CGO says: we should raise prices to signal premium positioning. How do you evaluate this suggestion?",
        options: [
          {
            id: "a",
            text: "Raising prices when churn is already increasing and all competitors offer lower ad-supported tiers is likely to accelerate subscriber loss. Premium positioning requires product differentiation that justifies the premium — StreamMax does not have that differentiation today.",
            nextQuestionId: "g9q3a",
            scoreImpact: 15,
            feedback: "Correct assessment. Price increases work for premium positioning only when accompanied by product differentiation. Without a clear reason why StreamMax is worth more than Netflix, raising prices will accelerate the churn problem rather than reframe the value proposition.",
          },
          {
            id: "b",
            text: "Agree with the CGO — premium positioning is a valid strategy and some subscriber loss from price-sensitive customers is acceptable if it improves the perception of the StreamMax brand among high-value subscribers.",
            nextQuestionId: "g9q3c",
            scoreImpact: -10,
            feedback: "Without product differentiation to justify the premium, raising prices in a market where churn is already rising will accelerate net subscriber loss. Positioning premium pricing requires product changes first, not as a standalone lever.",
          },
          {
            id: "c",
            text: "The pricing data suggests adding a lower tier rather than raising prices — being the only major streaming service without an ad-supported option is a structural disadvantage that prevents capturing price-sensitive subscribers.",
            nextQuestionId: "g9q3a",
            scoreImpact: 10,
            feedback: "Good insight from the pricing comparison. The absence of an ad-supported tier is increasingly anomalous in the market and prevents StreamMax from competing for a large segment of potential subscribers. This sets up the ad-tier analysis.",
          },
        ],
      },
      {
        id: "g9q3a",
        stage: "Ad-Supported Tier",
        question: "You are recommending an ad-supported tier. The CFO is skeptical: our standard tier generates $14.99 per month and the ad tier would generate only $4.99 in subscription revenue. This is value destruction. How do you evaluate the ad tier economics?",
        exhibit: {
          type: "table",
          title: "Ad-Supported Tier Economics Model",
          data: `| Metric                        | Ad Tier ($4.99) | Standard Tier ($14.99) |
|------------------------------|-----------------|------------------------|
| Subscription revenue/user/mo | $4.99           | $14.99                 |
| Ad revenue/user/mo (est)     | $4.50           | $0                     |
| Total revenue/user/mo        | $9.49           | $14.99                 |
| Content cost allocation/mo   | $8.20           | $8.20                  |
| Gross profit/user/mo         | $1.29           | $6.79                  |
| Gross margin                 | 14%             | 45%                    |`,
        },
        options: [
          {
            id: "a",
            text: "The CFO is correct — 14% gross margin versus 45% for the standard tier means every ad tier subscriber generates far less value. StreamMax should not launch the ad tier.",
            nextQuestionId: "g9q4b",
            scoreImpact: -10,
            feedback: "This ignores the most important variable — incremental subscribers. A 14% gross margin on users who would otherwise not be subscribers at all is better than 0% on churned users. The comparison should be ad tier margin versus no subscriber at all, not versus the standard tier.",
          },
          {
            id: "b",
            text: "The relevant comparison is ad tier revenue versus zero revenue from churned and potential low-income subscribers who will not pay $14.99. At $9.49 blended revenue versus $0 for non-subscribers, the ad tier creates value for a segment that cannot currently access the platform.",
            nextQuestionId: "g9q4a",
            scoreImpact: 20,
            feedback: "Correct economic framing. The ad tier is not competing against the standard tier — it is competing against the absence of subscription revenue from customers who cannot afford or will not pay the standard price. $9.49 blended revenue is significantly better than $0.",
          },
          {
            id: "c",
            text: "The ad tier makes sense only if the cannibalization rate from standard tier subscribers downgrading is below 15% — the CFO should commission a conjoint analysis to measure likely downgrade rates before proceeding.",
            nextQuestionId: "g9q4b",
            scoreImpact: 5,
            feedback: "Cannibalization is a real risk and the 15% threshold framing is valid. However, deferring the decision pending additional research delays an urgently needed intervention. Netflix's experience shows cannibalization rates around 20% — the net economics still favor launching the tier.",
          },
        ],
      },
      {
        id: "g9q3b",
        stage: "Content Strategy",
        question: "You have identified that unscripted content retains subscribers at 81% versus 68% for drama at significantly lower cost. The current $8.2B content budget is 78% allocated to drama. How should StreamMax reallocate?",
        exhibit: {
          type: "table",
          title: "Content ROI by Genre",
          data: `| Genre             | Viewing Hours Pct | Retention Rate | Cost Per Hour |
|------------------|------------------|----------------|---------------|
| Original drama   | 42%              | 68%            | $8.2M         |
| Licensed content | 28%              | 54%            | $1.1M         |
| Original unscripted| 18%            | 81%            | $1.8M         |
| Sports adjacent  | 8%               | 84%            | $2.4M         |
| International    | 4%               | 77%            | $0.9M         |`,
        },
        options: [
          {
            id: "a",
            text: "Eliminate all original drama spending immediately and redirect the entire $6.4B drama budget to unscripted content — the retention data is unambiguous and drama ROI is clearly inferior.",
            nextQuestionId: "g9q4c",
            scoreImpact: -10,
            feedback: "Original drama still accounts for 42% of viewing hours and is why many subscribers joined. A sudden complete elimination would cause massive subscriber loss from drama fans before the unscripted investment generates equivalent engagement. Transition must be gradual.",
          },
          {
            id: "b",
            text: "Maintain the existing drama slate as a retention anchor but shift the incremental content investment dollar toward unscripted and sports-adjacent content, targeting a 60-40 drama-to-alternative split over three years.",
            nextQuestionId: "g9q4a",
            scoreImpact: 20,
            feedback: "Correct approach. Protecting the existing drama base that viewers already depend on while redirecting the marginal investment toward higher-retention genres is the balanced, commercially sound recommendation.",
          },
          {
            id: "c",
            text: "Propose a 50-50 split between drama and all other genres since equal investment hedges against uncertainty about whether the retention advantage of unscripted is sustainable or a temporary preference shift.",
            nextQuestionId: "g9q4b",
            scoreImpact: 5,
            feedback: "50-50 is more balanced than the current 78% drama allocation but is not fully justified by the data. The retention differential — 81% for unscripted versus 68% for drama at dramatically lower cost — argues for shifting more aggressively than 50-50.",
          },
        ],
      },
      {
        id: "g9q3c",
        stage: "Content Strategy",
        question: "StreamMax is considering increasing drama spending by $1.5B annually to close the Netflix content gap. The CGO asks: will this stop the churn? How do you evaluate this investment?",
        options: [
          {
            id: "a",
            text: "An additional $1.5B in drama would produce content that competitors can match in subsequent years — it addresses the content gap symptom without solving the underlying subscriber economics problem. The retention data suggests this capital is better deployed in unscripted.",
            nextQuestionId: "g9q4b",
            scoreImpact: 15,
            feedback: "Correct strategic insight. Drama spending arms races in streaming tend to be zero-sum — every dollar invested raises the competitive bar, not just StreamMax's position. Unscripted content is harder to replicate and delivers better retention per dollar.",
          },
          {
            id: "b",
            text: "Yes — closing the drama gap with Netflix is the most direct path to stopping churn since content quality is the primary driver of subscriber retention in the streaming category.",
            nextQuestionId: "g9q4c",
            scoreImpact: -5,
            feedback: "This assumes content quality is the primary churn driver without consulting the exit survey data. Price is the largest stated reason at 34%, and unscripted content already outperforms drama on retention metrics. The premise of this recommendation is not supported by the available data.",
          },
          {
            id: "c",
            text: "Commission audience research to determine whether StreamMax subscribers specifically want more drama before committing $1.5B — the existing retention data may not reflect current subscriber preferences.",
            nextQuestionId: "g9q4b",
            scoreImpact: 0,
            feedback: "Additional research is always tempting but $1.5B content investment decisions require acting on the best available data, not waiting for perfect information. The existing retention data is a strong signal that should influence the recommendation.",
          },
        ],
      },
      {
        id: "g9q4a",
        stage: "Growth Roadmap",
        question: "You have recommendations on pricing tier and content mix. The CGO asks: what is the subscriber growth model that gets from 85M to 120M in three years?",
        exhibit: {
          type: "table",
          title: "Subscriber Growth Initiative Model",
          data: `| Initiative              | Subscriber Impact | Investment    | Timeline  |
|------------------------|-------------------|---------------|-----------|
| Ad tier launch          | +5-8M             | $120M tech    | 6 months  |
| Churn reduction program | +8-12M retained   | $200M content | 12-18 mo  |
| India expansion         | +7-10M            | $350M content | 18-24 mo  |
| Brazil expansion        | +4-6M             | $200M content | 12-18 mo  |
| Content mix shift       | +3-5M retained    | Reallocation  | 12 months |
| Password sharing fix    | +2-3M             | $40M tech     | 6-9 mo    |`,
        },
        options: [
          {
            id: "a",
            text: "All six initiatives in parallel — the total upside is 29-44M subscribers, well above the 35M needed to reach 120M, and parallel execution maximizes speed to the target.",
            nextQuestionId: "g9q5a",
            scoreImpact: 5,
            feedback: "Running all six simultaneously risks organizational overload and execution dilution. More importantly, some initiatives are prerequisites for others — churn reduction should precede international expansion since you want a lower churn rate before entering new markets.",
          },
          {
            id: "b",
            text: "Sequence the initiatives: ad tier and password sharing in months 1-6 for quick wins, churn reduction and content mix shift in months 6-18, then India and Brazil expansion in months 12-36. Total upside: 29-44M subscribers, putting the 120M target within range.",
            nextQuestionId: "g9q5a",
            scoreImpact: 20,
            feedback: "Correct sequencing logic. Quick wins first build momentum and fund the larger investments. Churn reduction before international expansion ensures you are not pouring new subscribers into a leaky bucket. The 29-44M range validates the 120M target as achievable.",
          },
          {
            id: "c",
            text: "Focus only on India expansion since at 7-10M subscribers it has the highest single-initiative upside and emerging market growth is the fastest path to scale given US market saturation.",
            nextQuestionId: "g9q5b",
            scoreImpact: -5,
            feedback: "Single-initiative focus misses the compounding benefit of multiple smaller interventions that together deliver more than the sum of their parts. India also has the longest timeline at 18-24 months — quick wins from the ad tier and password sharing are available in 6 months.",
          },
        ],
      },
      {
        id: "g9q4b",
        stage: "Growth Roadmap",
        question: "Your content or pricing recommendation has led down a suboptimal path. The CGO asks directly: what is the fastest path to 5M incremental subscribers in the next 12 months?",
        options: [
          {
            id: "a",
            text: "The ad-supported tier is the fastest path to 5M incremental subscribers within 12 months. It targets the 28M churned users who cited price as the primary reason for leaving — even a 15-20% re-acquisition rate yields 4-6M subscribers in the first year.",
            nextQuestionId: "g9q5a",
            scoreImpact: 15,
            feedback: "Good recovery. The ad tier re-acquisition math is compelling and the 12-month timeline is achievable. Targeting churned subscribers specifically is more efficient than acquiring brand-new subscribers since they have demonstrated prior willingness to pay for the product.",
          },
          {
            id: "b",
            text: "The fastest path is a major marketing spend increase of $500M focused on subscriber acquisition in the US market, since brand awareness gaps rather than product or pricing issues are limiting growth.",
            nextQuestionId: "g9q5b",
            scoreImpact: -10,
            feedback: "StreamMax is a well-known brand in the US with 62M domestic subscribers. Awareness is not the constraint. The exit survey data clearly shows price and content gaps are driving churn — marketing spend does not address either root cause.",
          },
          {
            id: "c",
            text: "The fastest path is strategic partnerships with mobile carriers to bundle StreamMax with mobile plans and drive subscriber growth through embedded distribution.",
            nextQuestionId: "g9q5b",
            scoreImpact: 5,
            feedback: "Carrier bundling can drive subscriber growth but requires 12-18 months of negotiation and integration before meaningful volume materializes. It is slower than an ad tier launch and does not address the underlying churn problem.",
          },
        ],
      },
      {
        id: "g9q4c",
        stage: "Growth Roadmap",
        question: "Your content strategy recommendation has been too aggressive or too timid. The CGO says: I need a content strategy that I can actually sell to the board. Give me a specific recommendation with numbers.",
        options: [
          {
            id: "a",
            text: "Maintain the existing drama slate — approximately $6B — while redirecting $800M of the incremental content budget from drama expansion to unscripted and sports-adjacent content. This shifts the ratio from 78% drama to 68% drama over three years while improving expected retention rates by 3-4pp.",
            nextQuestionId: "g9q5a",
            scoreImpact: 10,
            feedback: "Good recovery. Specific dollar allocation, specific ratio shift, and quantified retention impact gives the board exactly what it needs. This is the balanced recommendation that protects the base while improving marginal ROI.",
          },
          {
            id: "b",
            text: "Recommend a comprehensive content strategy review taking six months before committing to any reallocation, since content investment decisions should not be made without audience segmentation research.",
            nextQuestionId: "g9q5b",
            scoreImpact: -10,
            feedback: "A six-month review of content strategy when the company is losing subscribers is not acceptable. The retention data already in hand is sufficient to make a directional recommendation and begin shifting the content mix.",
          },
          {
            id: "c",
            text: "Cut the total content budget from $8.2B to $6B and reallocate savings to subscriber acquisition marketing, since content costs are the primary driver of the negative EBITDA trajectory.",
            nextQuestionId: "g9q5b",
            scoreImpact: -5,
            feedback: "Cutting content investment while trying to fix a content gap and churn problem is self-defeating. The issue is content mix efficiency, not total content spend level.",
          },
        ],
      },
      {
        id: "g9q5a",
        stage: "Final Recommendation",
        question: "The CGO asks for the three-move strategy summary to take to the CEO. What are your three recommendations in priority order?",
        options: [
          {
            id: "a",
            text: "One: launch ad-supported tier within six months to re-acquire 5-8M price-sensitive churners. Two: expand into India and Brazil with localized content investment targeting 11-16M subscribers over three years. Three: shift incremental content dollars toward unscripted and sports-adjacent content to improve retention per dollar spent.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong three-move strategy. Sequenced correctly — quick win first, then growth markets, then structural improvement. Each move is specific, has a subscriber impact range, and builds on the diagnostic findings. The CGO says: that is the presentation.",
          },
          {
            id: "b",
            text: "One: increase drama content spending by $1.5B to close the Netflix gap. Two: raise prices to $17.99 to signal premium positioning. Three: launch in all emerging markets simultaneously to maximize global scale.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "All three recommendations contradict the diagnostic findings. More drama investment has lower retention ROI than unscripted. Price increases accelerate churn when price is already the top churn reason. Simultaneous multi-market launch overextends the organization.",
          },
          {
            id: "c",
            text: "One: reduce churn from 3.4% to 2.5% through service improvements and content investment. Two: add 5M subscribers through an ad tier. Three: expand internationally to add 10M more subscribers.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Directionally right but the churn reduction framing is vague — how specifically? The other two moves are clear and the sequencing is reasonable. A stronger version would specify what drives the churn reduction rather than stating the target as the action.",
          },
        ],
      },
      {
        id: "g9q5b",
        stage: "Final Recommendation",
        question: "Your recommendations have been inconsistent. The CGO gives you one final chance: the CEO asks tomorrow what the path to 120M looks like. What do you say?",
        options: [
          {
            id: "a",
            text: "The path to 120M requires 35M incremental subscribers over three years from three sources: 5-8M from an ad-supported tier re-acquiring price-sensitive churners, 11-16M from India and Brazil expansion with localized content, and 8-12M from improved retention through content mix optimization toward unscripted. Together these reach the 120M target at the midpoint.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good recovery. Clear subscriber source breakdown, specific range estimates, and the math adds up to the 120M target. The CEO can present this to the board as a credible growth roadmap.",
          },
          {
            id: "b",
            text: "The 120M target is unrealistic in three years given current churn rates — a more achievable three-year target is 105M subscribers and the CEO should reset board expectations before committing to 120M.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Telling the CGO to lower the CEO's ambition as a first move is not a growth strategy. The initiative analysis shows 29-44M subscriber upside is achievable — 120M is within range at the midpoint. Make the case for how to get there rather than why you cannot.",
          },
          {
            id: "c",
            text: "The path to 120M requires a fundamental repositioning of StreamMax as a premium service with exclusive content partnerships and a dramatically improved user experience — this is a two to three year transformation, not a series of tactical moves.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Repositioning as strategy is valid long-term thinking but not actionable for a CEO going into a board meeting about hitting a specific subscriber target in three years. The tactical roadmap — ad tier, international expansion, content mix — is the more useful near-term answer.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE G10: BAIN — RIDE-SHARING MARKET ENTRY
  // INTERMEDIATE — 9 NODES
  // ─────────────────────────────────────────────
  {
    id: "g10",
    title: "RideMax: Southeast Asia Market Entry",
    type: "market_entry",
    difficulty: "intermediate",
    firm: "bain",
    estimatedMinutes: 28,
    overview: "A US-based ride-sharing company is considering entering Southeast Asia. Bain has been engaged to assess the opportunity and recommend an entry strategy.",
    clientBackground: "RideMax operates in 40 US cities with 15% market share. They have $800M in cash available for international expansion. The SEA ride-hailing market is valued at $12B growing at 18% annually. Grab holds 65% market share across the region and Gojek holds 20%. The CEO wants to enter at least two SEA countries within 18 months.",
    yourRole: "You are a Bain project leader on the transportation and technology practice. You have eight weeks to deliver a market entry recommendation.",
    startQuestionId: "g10q1",
    finalRecommendationPrompt: "The CEO asks: which two countries should we enter first, how should we enter, and what will it cost?",
    sampleRecommendation: "Enter Vietnam and the Philippines as the first two markets. Vietnam has the most favorable competitive dynamics — Grab's share is lower than regional average and growth is fastest at 28%. The Philippines has the second-lowest Grab concentration and a large urban population in Manila. Entry mode should be organic launch rather than acquisition — the two qualified acquisition targets are priced at premiums not justified by their market positions. Total entry investment: $280M over 18 months covering licensing, driver incentives, customer acquisition, and technology localization.",
    idealRecommendation: "Enter Vietnam and the Philippines first. Vietnam has the most attractive competitive dynamics and fastest growth. Philippines has a large urban market with manageable competitive intensity. Organic entry with $280M investment over 18 months is preferred over acquisition — available targets are overpriced. Driver incentive programs and a lower commission rate than Grab are the primary acquisition levers.",
    keyTakeaways: [
      "Market entry sequencing should prioritize markets where competitive intensity is lowest and growth is highest, not just where the market is largest",
      "Entry mode decision — organic versus acquisition — depends on the availability of reasonably priced targets and the time pressure of the market opportunity",
      "In platform businesses, driver supply drives demand — acquiring drivers is as important as acquiring riders in the early market entry phase",
      "Working capital requirements for platform incentives can be 3-5x larger than technology investment in ride-sharing market entry",
    ],
    questions: [
      {
        id: "g10q1",
        stage: "Market Assessment",
        question: "The CEO wants to enter at least two SEA countries within 18 months. Before identifying which countries, how do you structure the market attractiveness assessment?",
        options: [
          {
            id: "a",
            text: "Rank countries by total market size — enter the largest markets first since scale creates the most opportunity for RideMax to build a competitive position quickly.",
            nextQuestionId: "g10q2b",
            scoreImpact: -5,
            feedback: "Market size alone ignores competitive intensity, regulatory barriers, and growth rate. The largest markets are often the most competitive — entering where Grab is strongest is not the right first move for a new entrant with $800M in capital.",
          },
          {
            id: "b",
            text: "Evaluate each market on three dimensions: market attractiveness including size and growth, competitive intensity including Grab and Gojek share and behavior, and entry feasibility including regulatory environment and RideMax's ability to win.",
            nextQuestionId: "g10q2a",
            scoreImpact: 20,
            feedback: "Correct three-dimension framework. Market attractiveness tells you if it is worth entering, competitive intensity tells you how hard it will be, and entry feasibility tells you whether RideMax specifically can win. All three are required for a sound market entry recommendation.",
          },
          {
            id: "c",
            text: "Focus exclusively on the regulatory environment since ride-sharing regulation is the primary barrier to entry in Asia and choosing markets with favorable regulations should come before any other consideration.",
            nextQuestionId: "g10q2c",
            scoreImpact: 5,
            feedback: "Regulatory environment is an important filter but should be one of several dimensions rather than the sole criterion. A market with perfect regulation but dominant Grab penetration and low growth is still unattractive.",
          },
        ],
      },
      {
        id: "g10q2a",
        stage: "Country Prioritization",
        question: "You have assessed all five major SEA markets. Review the exhibit and identify the top two entry candidates.",
        exhibit: {
          type: "table",
          title: "SEA Market Assessment Summary",
          data: `| Country     | Market Size | Growth | Grab Share | Gojek Share | Regulatory | RideMax Fit |
|------------|-------------|--------|------------|-------------|------------|-------------|
| Indonesia  | $4.8B       | 14%    | 58%        | 32%         | Moderate   | Low         |
| Thailand   | $2.1B       | 16%    | 71%        | 8%          | Favorable  | Medium      |
| Vietnam    | $1.8B       | 28%    | 52%        | 15%         | Favorable  | High        |
| Philippines| $1.4B       | 22%    | 61%        | 12%         | Moderate   | High        |
| Malaysia   | $1.2B       | 18%    | 74%        | 10%         | Favorable  | Medium      |`,
        },
        options: [
          {
            id: "a",
            text: "Indonesia and Thailand are the top two — Indonesia at $4.8B is the largest market and Thailand has favorable regulation. Size and regulatory favorability should take priority.",
            nextQuestionId: "g10q3b",
            scoreImpact: -5,
            feedback: "Indonesia has Gojek at 32% entrenched alongside Grab at 58% — a combined 90% duopoly that would leave RideMax competing for 10% of the market. Thailand has Grab at 71% — the highest in the region. These are the two most competitively hostile markets.",
          },
          {
            id: "b",
            text: "Vietnam and Philippines are the top two — Vietnam has the fastest growth at 28% and lowest Grab share at 52%, and Philippines has the second-lowest Grab concentration with high RideMax fit and 22% growth.",
            nextQuestionId: "g10q3a",
            scoreImpact: 20,
            feedback: "Correct selection. Vietnam combines fastest growth with lowest competitive intensity among the five markets. Philippines adds a second market with manageable Grab share and strong RideMax strategic fit. Together these offer the best entry conditions for a capital-constrained new entrant.",
          },
          {
            id: "c",
            text: "Thailand and Vietnam — both have favorable regulatory environments which is the primary barrier to entry, and Vietnam's growth is the highest in the region making it the clearest priority.",
            nextQuestionId: "g10q3a",
            scoreImpact: 5,
            feedback: "Vietnam is correctly identified but Thailand with Grab at 71% market share is not the right second market. The Philippines with 22% growth and lower Grab concentration is a better second choice than Thailand despite Thailand's regulatory advantage.",
          },
        ],
      },
      {
        id: "g10q2b",
        stage: "Country Prioritization",
        question: "You have ranked countries by market size. Indonesia is first at $4.8B and Thailand second at $2.1B. However, Indonesia has a combined Grab-Gojek duopoly at 90% share. The Bain partner asks: does market size justify entering a market with 90% duopoly concentration?",
        options: [
          {
            id: "a",
            text: "No — 90% duopoly concentration means RideMax enters competing for 10% of the market. The $4.8B market at 10% addressable share is effectively a $480M opportunity, smaller than Vietnam's $1.8B at 48% addressable share. Size must be adjusted for competitive addressability.",
            nextQuestionId: "g10q3a",
            scoreImpact: 15,
            feedback: "Correct adjustment. Addressable share given competitive intensity is the right metric — raw market size overstates the opportunity in highly concentrated markets. This insight reorders the priority ranking significantly.",
          },
          {
            id: "b",
            text: "Yes — large markets justify entry even with high competitive concentration because the absolute opportunity is large enough to build a viable business even as a minor player with 5% share.",
            nextQuestionId: "g10q3b",
            scoreImpact: -10,
            feedback: "5% of a market dominated by two well-capitalized incumbents is not a viable strategic position — it requires sustaining losses indefinitely without a path to competitive differentiation. Market size without competitive addressability is not sufficient justification.",
          },
          {
            id: "c",
            text: "The duopoly is actually an opportunity — when two players compete intensely against each other, a third entrant can sometimes exploit the conflict and carve out a position by serving underserved customer segments.",
            nextQuestionId: "g10q3b",
            scoreImpact: 0,
            feedback: "The third-player opportunity thesis can work in some markets but requires identifying a specific underserved segment. In Indonesia, Grab and Gojek are competing intensely across all segments — the market is fully contested, not split into exploitable niches.",
          },
        ],
      },
      {
        id: "g10q2c",
        stage: "Country Prioritization",
        question: "Your regulatory-first filter has identified Thailand, Vietnam, and Malaysia as having favorable regulatory environments. Among these three, how do you select the top two entry markets?",
        options: [
          {
            id: "a",
            text: "Among the three favorable-regulation markets, select Vietnam and Malaysia — both have growth above the SEA average and neither has Grab above 75% share.",
            nextQuestionId: "g10q3a",
            scoreImpact: 10,
            feedback: "Vietnam is the right choice and Malaysia is a reasonable second given the regulatory constraint. However, the Philippines — despite moderate regulation — has better growth and RideMax fit than Malaysia and might be worth the regulatory complexity.",
          },
          {
            id: "b",
            text: "Vietnam and Thailand — Vietnam has the highest growth at 28% and Thailand is the second-largest favorable-regulation market. Growth combined with regulatory ease makes these the most attractive pairing.",
            nextQuestionId: "g10q3b",
            scoreImpact: -5,
            feedback: "Thailand has Grab at 71% — the highest share in the favorable-regulation group. Selecting it over the Philippines despite higher competitive concentration prioritizes regulatory ease over competitive attractiveness, which is the wrong tradeoff.",
          },
          {
            id: "c",
            text: "Reassess the Philippines despite moderate regulation — its growth at 22% and high RideMax fit may outweigh the regulatory complexity, making it a better second choice than either Thailand or Malaysia.",
            nextQuestionId: "g10q3a",
            scoreImpact: 15,
            feedback: "Good course correction. The Philippines' combination of growth, competitive room, and RideMax fit may justify accepting moderate regulatory complexity. A strong growth market with manageable competition is often worth more than an easy regulatory environment with heavy incumbent dominance.",
          },
        ],
      },
      {
        id: "g10q3a",
        stage: "Entry Mode",
        question: "You have identified Vietnam and the Philippines as the priority markets. Now determine the entry mode. An investment bank has identified two acquisition targets — one in each country. Should RideMax enter via acquisition or organic launch?",
        exhibit: {
          type: "table",
          title: "Entry Mode Comparison",
          data: `| Factor             | Organic Launch           | Acquisition               |
|-------------------|--------------------------|---------------------------|
| Time to market     | 12-18 months             | 6-9 months post-close     |
| Capital required   | $280M over 18 months     | $320-380M plus integration|
| Driver network     | Build from zero          | Acquire existing network  |
| Brand              | Build from zero          | Inherit local brand       |
| Target available?  | n/a                      | Vietnam: $95M (18% share) |
|                    |                          | Philippines: $85M (11% share)|`,
        },
        options: [
          {
            id: "a",
            text: "Acquire both targets — the time savings of 6-9 months in each market is worth the additional $180-280M in acquisition cost, and inheriting an existing driver network avoids the hardest part of a platform cold-start problem.",
            nextQuestionId: "g10q4b",
            scoreImpact: 5,
            feedback: "Acquisition is faster but the valuations need scrutiny. $95M for 18% share in a $1.8B market implies a $527M total market valuation — 29x revenue for a ride-hailing company with minority market position. That premium needs to be justified before committing.",
          },
          {
            id: "b",
            text: "Organic launch is preferred. The acquisition targets have minority share positions at valuations implying 25-30x revenue multiples — too expensive relative to what they bring. An organic launch with $280M allows RideMax to build a modern driver experience and technology stack rather than inheriting legacy systems.",
            nextQuestionId: "g10q4a",
            scoreImpact: 20,
            feedback: "Correct entry mode recommendation. The acquisition valuations are not supported by the market positions on offer. Organic launch preserves capital for driver and customer incentives — which in platform businesses are the real competitive weapons during market entry.",
          },
          {
            id: "c",
            text: "Acquire the Vietnam target only since 18% market share is more strategic in a high-growth market, and organic launch in the Philippines since the 11% share Philippines acquisition does not justify the premium.",
            nextQuestionId: "g10q4a",
            scoreImpact: 10,
            feedback: "Differentiated approach is reasonable but the Vietnam valuation also looks expensive at $95M for 18% share. The core question is whether the acquired driver network and brand accelerate market position enough to justify the premium in either market.",
          },
        ],
      },
      {
        id: "g10q3b",
        stage: "Entry Mode",
        question: "You have identified markets with high competitive intensity. The CEO says: in a market dominated by Grab, we need an acquisition to get immediate scale. How do you evaluate this logic?",
        options: [
          {
            id: "a",
            text: "Acquisition only provides immediate scale if you acquire a target large enough to matter competitively. Buying a 10-18% share company in a Grab-dominated market gives you a weak starting position — the capital is better spent on driver incentives for organic launch in more favorable markets.",
            nextQuestionId: "g10q4a",
            scoreImpact: 15,
            feedback: "Correct analysis. Acquisition of a minority-share player in a Grab-dominated market does not solve the fundamental competitive problem — you still need to take share from Grab. The capital efficiency of organic launch in Vietnam and the Philippines is superior.",
          },
          {
            id: "b",
            text: "Agree with the CEO — acquisition is the only path to immediate scale and RideMax should acquire the largest available target in each priority market, even at a premium, to establish a credible competitive position quickly.",
            nextQuestionId: "g10q4b",
            scoreImpact: -5,
            feedback: "Speed-driven acquisition at any price can destroy value. The acquisitions available are minority-share positions at expensive multiples — they provide some scale but not enough to change the competitive dynamics meaningfully, and they reduce the capital available for the incentive wars that actually determine market entry outcomes.",
          },
          {
            id: "c",
            text: "Ask the CEO whether the 18-month timeline is truly fixed — if the timeline can extend to 24 months, organic launch becomes more viable and avoids the acquisition premium in competitive markets.",
            nextQuestionId: "g10q4a",
            scoreImpact: 10,
            feedback: "Timeline flexibility is worth exploring, though the CEO's 18-month target likely reflects genuine market timing pressure. More importantly, the organic versus acquisition question is primarily about capital efficiency and competitive position, not just timing.",
          },
        ],
      },
      {
        id: "g10q4a",
        stage: "Investment Sizing",
        question: "You have recommended organic entry into Vietnam and the Philippines. The CFO asks: what does $280M actually buy in terms of market entry activities, and is it enough to establish a competitive position?",
        exhibit: {
          type: "table",
          title: "Investment Allocation for Organic Entry ($280M Total)",
          data: `| Category                    | Vietnam | Philippines | Total  |
|----------------------------|---------|-------------|--------|
| Technology localization     | $25M    | $20M        | $45M   |
| Driver incentive programs   | $60M    | $50M        | $110M  |
| Customer acquisition        | $40M    | $35M        | $75M   |
| Regulatory and licensing    | $8M     | $7M         | $15M   |
| Operations setup            | $20M    | $15M        | $35M   |
| Total                       | $153M   | $127M       | $280M  |`,
        },
        options: [
          {
            id: "a",
            text: "$280M is sufficient given the market sizes — Vietnam at $1.8B and the Philippines at $1.4B are smaller markets where incentive-based entry does not require the scale of capital needed in Indonesia or Thailand.",
            nextQuestionId: "g10q5a",
            scoreImpact: 10,
            feedback: "Reasonable assessment. The smaller market sizes mean lower absolute incentive spending is needed to move the market. The allocation also correctly weights driver incentives at $110M as the largest line — in ride-sharing, driver supply is the primary competitive weapon during market entry.",
          },
          {
            id: "b",
            text: "The $110M in driver incentives is the most important line item — in a platform business, supply-side acquisition is more critical than demand-side in the early phases since rides cannot happen without drivers. This allocation reflects sound platform economics.",
            nextQuestionId: "g10q5a",
            scoreImpact: 20,
            feedback: "Excellent insight. Identifying driver incentives as the strategic center of the investment allocation demonstrates understanding of platform economics. Without driver supply, customer acquisition marketing has nothing to fulfill — supply must lead demand in two-sided platforms.",
          },
          {
            id: "c",
            text: "$280M is insufficient — Grab spent over $1B to establish its position in each major market and RideMax would need at least $500M to credibly challenge them in two markets simultaneously.",
            nextQuestionId: "g10q5b",
            scoreImpact: -5,
            feedback: "Grab's $1B+ per market was spent establishing first-mover position across all of SEA simultaneously. RideMax is entering specifically chosen smaller markets where the competitive environment is less entrenched. The per-market spend comparison is not directly applicable.",
          },
        ],
      },
      {
        id: "g10q4b",
        stage: "Investment Sizing",
        question: "You are pursuing an acquisition-led strategy. The CFO points out that the two acquisitions plus integration costs would total $400-440M — leaving only $360-400M for market operations. Is this enough for a credible post-acquisition competitive push?",
        options: [
          {
            id: "a",
            text: "The remaining $360-400M is sufficient since the acquisitions provide an existing driver network and customer base that reduces the organic incentive spending required. The effective deployment efficiency improves with the acquired assets.",
            nextQuestionId: "g10q5a",
            scoreImpact: 5,
            feedback: "This argument has some merit — acquired networks do reduce cold-start costs. However, the incentive wars required to take share from Grab still require substantial capital regardless of starting position, and $360M may be tight across two markets.",
          },
          {
            id: "b",
            text: "The capital split is too tight — $440M in acquisition plus integration costs leaves an average of $180M per market for operations. Grab can easily respond with $200-300M in counter-incentives given their capital position, which would overwhelm a $180M per market budget.",
            nextQuestionId: "g10q5b",
            scoreImpact: 15,
            feedback: "Correct competitive analysis. The capital asymmetry is the core problem with acquisition-led strategy at this capital level. Grab has more than enough capital to respond with counter-incentives that exhaust RideMax's remaining budget in each market.",
          },
          {
            id: "c",
            text: "Request an additional $200M from the board to fund both acquisitions and sufficient operational capital — the entry opportunity is compelling enough to justify additional capital deployment beyond the initial $800M budget.",
            nextQuestionId: "g10q5a",
            scoreImpact: 0,
            feedback: "Requesting additional capital is a valid option but should come after exhausting the alternatives within the existing budget. The organic entry approach in Vietnam and the Philippines accomplishes the market entry goal within $800M without requiring a board return for more capital.",
          },
        ],
      },
      {
        id: "g10q5a",
        stage: "Final Recommendation",
        question: "The CEO asks for the final recommendation: two countries, entry mode, capital plan, and timeline.",
        options: [
          {
            id: "a",
            text: "Enter Vietnam and Philippines organically. Vietnam: highest growth at 28%, lowest Grab share at 52%, high RideMax fit. Philippines: 22% growth, manageable Grab share at 61%, large urban market in Manila. Total investment $280M over 18 months with $110M prioritized toward driver incentives. Target 8-12% share in each market by month 18.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Excellent complete recommendation. Country selection justified, entry mode justified, capital allocation specific, and a market share target provides a measurable outcome for the board to evaluate performance against. The CEO says: let us build the business case.",
          },
          {
            id: "b",
            text: "Enter Indonesia and Thailand since they are the largest markets and market size is ultimately the most important determinant of long-term platform value in ride-sharing.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "This contradicts the entire market entry analysis. Indonesia has a 90% duopoly and Thailand has Grab at 71% — entering these markets with $800M would result in losses without establishing a viable competitive position.",
          },
          {
            id: "c",
            text: "Enter Vietnam first and use the results to determine whether the Philippines entry is warranted, rather than committing capital to both markets simultaneously before validating the Vietnam hypothesis.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Staged entry is more conservative and reduces risk, but the CEO's mandate is two markets within 18 months. Sequential entry means the Philippines launch would begin after Vietnam results are in — potentially pushing the second market beyond the 18-month window.",
          },
        ],
      },
      {
        id: "g10q5b",
        stage: "Final Recommendation",
        question: "Your investment sizing or country selection has had issues. The partner gives you one final opportunity before the CEO presentation. What is the correct recommendation?",
        options: [
          {
            id: "a",
            text: "Vietnam and Philippines via organic entry at $280M total investment, with driver incentives as the primary capital deployment. Vietnam first given superior growth and lower competitive intensity, Philippines second within the 18-month window.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Strong recovery. The core recommendation is correct — the right countries, the right entry mode, and the right capital allocation priority. The partner says: that is the answer, now build the supporting analysis.",
          },
          {
            id: "b",
            text: "Acknowledge to the CEO that the $800M capital budget is insufficient for a credible SEA entry and recommend deferring the expansion until RideMax can raise an additional $500M specifically for international markets.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Recommending to defer the entire international expansion because earlier analysis was flawed is an overreaction. The organic entry into Vietnam and the Philippines is achievable within $280M — well within the $800M budget. The analysis supports proceeding.",
          },
          {
            id: "c",
            text: "Recommend a partnership approach with Grab rather than independent entry — if Grab and RideMax collaborate on technology sharing and revenue split, both companies benefit more than in head-to-head competition.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Partnering with the dominant competitor you were hired to compete against is a strategic pivot that fundamentally changes the nature of the engagement. The client hired Bain to develop an independent market entry strategy, not a Grab partnership.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE G11: DELOITTE — AIRLINE OPERATIONS
  // INTERMEDIATE — 9 NODES
  // ─────────────────────────────────────────────
  {
    id: "g11",
    title: "AirCore: Maintenance Operations Turnaround",
    type: "operations",
    difficulty: "intermediate",
    firm: "deloitte",
    estimatedMinutes: 28,
    overview: "A major US airline has seen maintenance-related delays surge 34% and maintenance costs rise 28% over 18 months. Deloitte has been engaged to diagnose and fix the problem.",
    clientBackground: "AirCore operates 450 aircraft with hubs in Chicago, Dallas, and Atlanta. They have 8,400 maintenance technicians across six maintenance bases. Maintenance-related delays are costing an estimated $595M annually in reduced revenue and increased costs. On-time performance fell from 81% to 74%. The COO has engaged Deloitte to identify root causes and recommend operational improvements.",
    yourRole: "You are a Deloitte senior consultant on the operations practice. You have been on the ground at AirCore's Chicago maintenance base for two weeks conducting interviews and data analysis.",
    startQuestionId: "g11q1",
    finalRecommendationPrompt: "The COO asks: what are your top three operational changes AirCore must make to recover on-time performance, and what investment is required for each?",
    sampleRecommendation: "Three changes: First, deploy predictive maintenance using AirCore's existing ACARS sensor data — $45M investment, estimated 55-65% reduction in unplanned component failures, $180M annual savings. Second, implement demand-sensing inventory optimization for parts — $12M investment, reduces AOG events by targeting the 89% increase in parts-unavailability delays, $67M annual savings. Third, redesign technician scheduling based on aircraft rotation patterns — $8M investment, reduces overtime and improves productivity, $45M annual savings. Total investment $65M, total annual savings $292M.",
    idealRecommendation: "Three changes: (1) Predictive maintenance on ACARS data — $45M, $180M annual savings from 55-65% unplanned failure reduction. (2) Parts inventory optimization — $12M, $67M savings from AOG reduction. (3) Technician scheduling redesign — $8M, $45M savings. Combined $65M investment generates $292M in annual savings — payback under 3 months.",
    keyTakeaways: [
      "In maintenance operations, separating unplanned from planned downtime is essential — they have fundamentally different root causes and solutions",
      "Predictive maintenance using existing sensor data is often the highest-ROI intervention because the data already exists but is not being used",
      "Inventory management is frequently the hidden culprit in maintenance delays — parts availability is as critical as technician availability",
      "Implementation sequencing in operations should prioritize quick wins that fund longer-term investments rather than tackling everything simultaneously",
    ],
    questions: [
      {
        id: "g11q1",
        stage: "Problem Scoping",
        question: "Maintenance-related delays are up 34% and costs are up 28%. Before diving into data, how do you structure the maintenance diagnostic?",
        options: [
          {
            id: "a",
            text: "Structure the diagnostic around three MECE buckets: people including technician availability, skills, and scheduling; parts including inventory, procurement, and supplier reliability; and processes including maintenance planning, documentation, and quality control.",
            nextQuestionId: "g11q2a",
            scoreImpact: 20,
            feedback: "Excellent MECE framework. People, parts, and processes cover all fundamental inputs to maintenance operations and ensure no major category is missed. This is the Deloitte operations diagnostic structure for maintenance.",
          },
          {
            id: "b",
            text: "Focus immediately on the delay data since that is what is costing revenue — identify which delay categories are growing fastest and work backward to the operational root causes.",
            nextQuestionId: "g11q2b",
            scoreImpact: 10,
            feedback: "Delay categorization is a valid starting point and will reveal where the problem is concentrated. The risk is focusing on symptoms — delay categories — rather than causes, but in this case the delay data directly points to root causes well enough to be useful.",
          },
          {
            id: "c",
            text: "Interview the most senior maintenance technicians at each base since front-line operators usually know exactly what is going wrong and why, which is faster than data analysis alone.",
            nextQuestionId: "g11q2c",
            scoreImpact: 0,
            feedback: "Front-line interviews are valuable and should be part of the diagnostic, but starting with interviews before a data structure risks collecting opinions rather than evidence. The MECE framework gives interviews a structure that makes them more analytically useful.",
          },
        ],
      },
      {
        id: "g11q2a",
        stage: "Delay Analysis",
        question: "You have structured the diagnostic around people, parts, and processes. The maintenance data team provides the delay root cause breakdown. Review the exhibit and identify the primary driver.",
        exhibit: {
          type: "table",
          title: "AirCore Maintenance Delay Root Cause Analysis",
          data: `| Delay Category            | Delays (12mo) | Avg Duration | Total Hours | YoY Change |
|--------------------------|--------------|--------------|-------------|------------|
| Unplanned component fail  | 4,820        | 3.2 hrs      | 15,424      | +67%       |
| Parts not available (AOG) | 3,210        | 4.8 hrs      | 15,408      | +89%       |
| Technician not available  | 1,890        | 1.4 hrs      | 2,646       | +12%       |
| Documentation issues      | 1,420        | 1.1 hrs      | 1,562       | +8%        |
| Third-party delays        | 980          | 3.6 hrs      | 3,528       | +31%       |
| Other                     | 620          | 1.8 hrs      | 1,116       | +5%        |`,
        },
        options: [
          {
            id: "a",
            text: "Technician availability at +12% is the most controllable driver and should be addressed first through scheduling improvements since people problems are faster to fix than equipment or supply chain issues.",
            nextQuestionId: "g11q3c",
            scoreImpact: -10,
            feedback: "Technician availability represents only 2,646 delay hours and grew only 12% — it is the smallest major category and slowest-growing. Focusing on the most controllable rather than the most impactful driver is a classic prioritization error.",
          },
          {
            id: "b",
            text: "Unplanned component failures and parts unavailability together account for 76% of total delay hours and are growing 67% and 89% respectively — far faster than the 34% overall average. These two categories are the primary focus.",
            nextQuestionId: "g11q3a",
            scoreImpact: 20,
            feedback: "Correct identification. 15,424 plus 15,408 hours equals 30,832 delay hours — 76% of the total. Both categories are growing far faster than the average, pointing to a predictive maintenance failure and a supply chain breakdown as the two root causes to investigate.",
          },
          {
            id: "c",
            text: "Third-party vendor delays at +31% are the most concerning because they are outside AirCore's direct control — unlike the other categories, AirCore cannot manage vendor delays through internal operations improvements.",
            nextQuestionId: "g11q3b",
            scoreImpact: 0,
            feedback: "Third-party delays are 3,528 hours — 9% of total delay hours. While the external control challenge is real, focusing on a 9% category while the 76% primary drivers go unaddressed is a misallocation of analytical attention.",
          },
        ],
      },
      {
        id: "g11q2b",
        stage: "Delay Analysis",
        question: "The delay data shows unplanned component failures up 67% and AOG parts events up 89%. These two categories together are 76% of delay hours. The COO says: both feel like a technician shortage problem — we need to hire more people. How do you respond?",
        options: [
          {
            id: "a",
            text: "Technician headcount grew 3% over the same period while delays grew 34% — the math does not support a headcount shortage as the primary cause. Unplanned component failures suggest a predictive maintenance gap, and AOG events suggest an inventory management failure, not a headcount issue.",
            nextQuestionId: "g11q3a",
            scoreImpact: 20,
            feedback: "Strong data-driven pushback. Using the actual headcount growth data to contradict the COO's hypothesis is exactly right. The failure patterns clearly point to predictive maintenance and inventory management rather than staffing levels.",
          },
          {
            id: "b",
            text: "Agree with the COO provisionally and request 30 days to build a full workforce analysis before recommending either for or against additional hiring.",
            nextQuestionId: "g11q3b",
            scoreImpact: -5,
            feedback: "The data already available — technician availability delays at +12% while overall delays grew 34%, and headcount up 3% — is sufficient to form a view without 30 more days of workforce analysis. Provisional agreement with the COO delays a diagnosis that is already clear.",
          },
          {
            id: "c",
            text: "The COO's instinct is reasonable — staffing is always a factor in maintenance operations and a hiring plan for 200 additional technicians should be included as part of a comprehensive operations improvement program.",
            nextQuestionId: "g11q3c",
            scoreImpact: -10,
            feedback: "Recommending 200 hires based on an instinct without data support is poor consulting. If the diagnostic finds that predictive maintenance and inventory management are the primary drivers, adding headcount addresses neither root cause and wastes capital.",
          },
        ],
      },
      {
        id: "g11q2c",
        stage: "Delay Analysis",
        question: "Your technician interviews point to two recurring themes: parts are never where they need to be, and aircraft keep breaking down in ways that should have been preventable. How do you translate these qualitative signals into a structured diagnostic?",
        options: [
          {
            id: "a",
            text: "These two themes map directly to the parts and processes buckets in the MECE framework — parts unavailability is the inventory and supply chain problem, and preventable breakdowns are the predictive maintenance problem. Quantify both with the delay data to size the relative importance.",
            nextQuestionId: "g11q3a",
            scoreImpact: 15,
            feedback: "Good translation of qualitative signals to quantitative framework. The delay data will confirm that these two categories — AOG parts events and unplanned component failures — are indeed the largest delay drivers, validating the field observations.",
          },
          {
            id: "b",
            text: "Conduct more interviews with supervisors and base managers to triangulate whether the front-line technician signals are representative before investing in quantitative data analysis.",
            nextQuestionId: "g11q3b",
            scoreImpact: 0,
            feedback: "Additional interviews may be useful for understanding context, but two consistent themes from multiple technicians across bases is a strong enough signal to proceed to quantitative validation. More interviews without data analysis risks analysis paralysis.",
          },
          {
            id: "c",
            text: "Take the parts problem as the higher priority since it is operationally simpler to fix — improving parts inventory is a logistics problem while improving predictive maintenance requires technology investment that takes longer to implement.",
            nextQuestionId: "g11q3a",
            scoreImpact: 5,
            feedback: "Simplicity of fix is a valid factor in prioritization, though the primary criterion should be impact. Fortunately, the data analysis will show both are large contributors and both should be addressed — the sequencing can then account for implementation complexity.",
          },
        ],
      },
      {
        id: "g11q3a",
        stage: "Predictive Maintenance",
        question: "You investigate the unplanned component failure trend. The data shows AirCore's 450 aircraft generate 50,000 data points per flight through ACARS systems, but this data is currently used only for flight logs and fuel efficiency tracking. What does this tell you?",
        exhibit: {
          type: "table",
          title: "Component Failure Analysis by Category",
          data: `| Component     | Failures | Predictable w/Sensors | Current Monitoring   | Competitor Practice      |
|--------------|----------|----------------------|----------------------|--------------------------|
| Engine       | 820      | 78%                  | Manual inspection    | Real-time sensor monitoring|
| Avionics     | 1,240    | 62%                  | Post-flight log review| Real-time anomaly detection|
| Hydraulics   | 980      | 71%                  | Manual inspection    | Sensor monitoring        |
| Landing gear | 640      | 45%                  | Partial sensor       | Full sensor and ML       |
| Cabin systems| 1,140    | 15%                  | Reactive only        | Reactive only            |`,
        },
        options: [
          {
            id: "a",
            text: "AirCore has all the sensor data needed to predict 54% of component failures on average but is not using it for predictive maintenance. Implementing ML on existing ACARS data is a high-ROI intervention that requires no new hardware investment.",
            nextQuestionId: "g11q4a",
            scoreImpact: 20,
            feedback: "This is the key insight. The data already exists — AirCore does not need to install new sensors. The opportunity is to use existing ACARS data for predictive failure detection, which competitors already do. The marginal cost of this intervention is analytics software and data science, not hardware.",
          },
          {
            id: "b",
            text: "Cabin systems with 1,140 failures should be the primary focus since it is the largest failure category, even though only 15% are predictable with sensors.",
            nextQuestionId: "g11q4b",
            scoreImpact: -5,
            feedback: "Cabin systems have the most failures but only 15% are predictable — even perfect sensor deployment would only address 171 failures. Engines, hydraulics, and avionics with 71-78% predictability at 78% of sensors not deployed offer far more intervention leverage.",
          },
          {
            id: "c",
            text: "The data shows the industry norm is reactive maintenance for cabin systems, which validates that some level of reactive maintenance is acceptable. AirCore should focus only on engine and hydraulics where sensor monitoring is clearly superior to manual inspection.",
            nextQuestionId: "g11q4a",
            scoreImpact: 10,
            feedback: "Correctly excluding cabin systems from the predictive maintenance recommendation is right — industry norm is reactive for cabin. Engines and hydraulics are the highest-leverage targets. Avionics with 62% predictability is also worth including in the full recommendation.",
          },
        ],
      },
      {
        id: "g11q3b",
        stage: "Parts Inventory",
        question: "Third-party vendor delays and general inventory issues are your focus. You pull the parts inventory data. It shows AOG events increased from 1,700 to 3,210 per year. The average parts wait time grew from 3.1 hours to 6.2 hours. What is the root cause?",
        exhibit: {
          type: "table",
          title: "Parts Inventory Performance Metrics",
          data: `| Metric                                  | Current | 18 Mo Ago | Benchmark |
|----------------------------------------|---------|-----------|-----------|
| Parts fill rate                         | 67%     | 84%       | 92%       |
| Critical parts stocked at all 6 bases  | 34%     | 78%       | 95%       |
| Average supplier lead time (days)      | 8.2     | 4.6       | 3.8       |
| Emergency order percentage             | 31%     | 12%       | 6%        |
| Excess and obsolete inventory pct      | 28%     | 14%       | 8%        |`,
        },
        options: [
          {
            id: "a",
            text: "The root cause is three compounding factors: poor demand forecasting causing the right parts to not be stocked at the right bases, supplier lead time deterioration creating longer waits when stockouts occur, and excess obsolete inventory tying up capital that should be deployed to high-demand parts.",
            nextQuestionId: "g11q4a",
            scoreImpact: 20,
            feedback: "Complete and accurate root cause analysis. High obsolete inventory combined with low fill rate and low critical parts distribution is the classic symptoms of poor demand forecasting. The three-factor explanation covers all the data points and sets up a clear improvement roadmap.",
          },
          {
            id: "b",
            text: "The primary cause is supplier lead time deterioration from 4.6 to 8.2 days — almost doubling of external lead times is the driver of AOG events and should be addressed through supplier contract renegotiation.",
            nextQuestionId: "g11q4b",
            scoreImpact: 5,
            feedback: "Supplier lead time is a contributing factor, but the fill rate falling from 84% to 67% and critical parts at only 34% of bases points to an internal forecasting and distribution problem as the larger driver. Supplier renegotiation helps but does not address the stock positioning failure.",
          },
          {
            id: "c",
            text: "The excess and obsolete inventory at 28% is the root cause — capital tied up in wrong parts reduces purchasing power for the right parts, creating a self-reinforcing cycle of stockouts and emergency orders.",
            nextQuestionId: "g11q4a",
            scoreImpact: 10,
            feedback: "Excess inventory is a symptom and partial cause, but the deeper root is poor demand forecasting that led to ordering the wrong parts in the first place. Addressing the forecasting methodology is the more fundamental fix.",
          },
        ],
      },
      {
        id: "g11q3c",
        stage: "Technician Scheduling",
        question: "You have focused on technician availability as the primary driver. The data shows technician availability grew only 12% while overall delays grew 34%. The partner asks: how do you reconcile this discrepancy?",
        options: [
          {
            id: "a",
            text: "The discrepancy confirms that technician availability is not the primary driver of the delay increase — if it were, the growth rates would be more proportional. Redirect the diagnostic to the categories that are growing faster: unplanned component failures at +67% and AOG parts events at +89%.",
            nextQuestionId: "g11q3a",
            scoreImpact: 15,
            feedback: "Good analytical redirect. The growth rate discrepancy is the key signal — technician availability growing at one-third the rate of overall delays cannot be the primary cause. The redirect to the larger categories is the right move.",
          },
          {
            id: "b",
            text: "Technician availability growing at 12% is still a meaningful contributor in absolute terms — 2,646 delay hours is not trivial and should be addressed alongside the other categories.",
            nextQuestionId: "g11q4b",
            scoreImpact: 5,
            feedback: "True that 2,646 hours is real, but the question is prioritization. With 30,832 hours in unplanned failures and AOG events, spending equivalent management attention on the 2,646-hour technician problem is poor resource allocation.",
          },
          {
            id: "c",
            text: "The discrepancy means the technician availability data is unreliable — technicians may not be logging availability delays accurately. Commission a data quality review before drawing any conclusions.",
            nextQuestionId: "g11q4b",
            scoreImpact: -10,
            feedback: "Questioning the data quality to preserve a preferred hypothesis is not sound analysis. The most likely explanation for the discrepancy is the straightforward one: technician availability is not the primary driver. Redirect the analysis accordingly.",
          },
        ],
      },
      {
        id: "g11q4a",
        stage: "Investment Prioritization",
        question: "The COO has been given three initiatives: predictive maintenance at $45M investment, parts inventory optimization at $12M, and technician scheduling redesign at $8M. He can only fund two. Which two do you recommend and why?",
        options: [
          {
            id: "a",
            text: "Predictive maintenance and inventory optimization — they address the two largest delay categories at 76% of total delay hours. Scheduling redesign at $8M can be funded from the first year savings of the other two initiatives once they generate returns.",
            nextQuestionId: "g11q5a",
            scoreImpact: 20,
            feedback: "Correct prioritization. Address the largest problems first. The scheduling program can be self-funded from the early savings of the two larger initiatives — this sequencing is both analytically and financially sound.",
          },
          {
            id: "b",
            text: "Scheduling redesign and inventory optimization — both have faster implementation timelines than predictive maintenance and together address multiple delay categories at lower total investment of $20M.",
            nextQuestionId: "g11q5b",
            scoreImpact: -5,
            feedback: "Scheduling redesign addresses only 7% of delay hours. Prioritizing a smaller problem for implementation speed while the $45M predictive maintenance program — which addresses 38% of delay hours — sits unfunded is poor resource allocation.",
          },
          {
            id: "c",
            text: "Predictive maintenance and scheduling redesign — the combination of the largest single intervention with the most operationally complex change gives the organization the best chance of a comprehensive transformation.",
            nextQuestionId: "g11q5b",
            scoreImpact: 5,
            feedback: "Predictive maintenance is correctly prioritized but scheduling redesign over inventory optimization ignores the fact that AOG parts events are the second largest delay category at 38% of total hours. Inventory optimization has the clearer and more direct impact on the second-biggest problem.",
          },
        ],
      },
      {
        id: "g11q4b",
        stage: "Investment Prioritization",
        question: "You have been focused on secondary drivers. The partner says: our initial analysis suggests the top two delay categories — unplanned failures and AOG parts — are 76% of the problem. Do your recommended investments address these specifically?",
        options: [
          {
            id: "a",
            text: "Acknowledge the gap and redirect: predictive maintenance on ACARS data directly addresses unplanned component failures at 38% of delay hours, and inventory optimization with demand-sensing directly addresses AOG parts events at 38% of delay hours. These two investments together target 76% of the problem.",
            nextQuestionId: "g11q5a",
            scoreImpact: 15,
            feedback: "Good recovery. Correctly identifying that the two recommended investments map precisely to the two largest delay categories is the right way to defend the recommendations to the COO.",
          },
          {
            id: "b",
            text: "Maintain the current recommendations — the initiatives recommended address important operational problems even if they are not specifically targeting the highest-volume delay categories.",
            nextQuestionId: "g11q5b",
            scoreImpact: -10,
            feedback: "Defending recommendations that do not address the primary drivers after being given a clear hint from the partner is not credible consulting. The recommendation should be adjusted to target the 76% of the problem that the data identifies.",
          },
          {
            id: "c",
            text: "Request one additional week of analysis to validate whether the delay categories are correctly attributed before redirecting the investment recommendations.",
            nextQuestionId: "g11q5b",
            scoreImpact: -5,
            feedback: "More time is not needed — the delay category data is clear and the attribution is direct. Requesting more time when the answer is in front of you wastes the COO's time and delays implementation of improvements that are costing $595M annually.",
          },
        ],
      },
      {
        id: "g11q5a",
        stage: "Final Recommendation",
        question: "The COO asks for the final presentation: what are your three recommendations, what does each cost, and what is the combined financial impact?",
        options: [
          {
            id: "a",
            text: "Three recommendations: predictive maintenance on ACARS data at $45M targeting 55-65% reduction in unplanned failures saving $180M annually; parts inventory optimization at $12M targeting fill rate improvement from 67% to 90% saving $67M annually; and technician scheduling redesign at $8M saving $45M annually. Total $65M investment for $292M annual savings — payback under three months.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Excellent complete recommendation package. Three specific initiatives with specific investments, specific metrics, and specific financial impacts. The combined payback of under three months is compelling for the COO and the board. This is a Deloitte-quality operations recommendation.",
          },
          {
            id: "b",
            text: "Three recommendations: hire 500 additional technicians, replace aging aircraft with newer models with better maintenance profiles, and renegotiate all third-party maintenance contracts. These address the systemic causes of maintenance deterioration.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "None of these three recommendations address the identified root causes — predictive maintenance gaps and parts inventory failures. Hiring technicians, replacing aircraft, and renegotiating contracts are expensive, slow, and not directly connected to the 76% of delay hours coming from unplanned failures and AOG events.",
          },
          {
            id: "c",
            text: "Two recommendations since three is too many for the COO to champion simultaneously: predictive maintenance at $45M and inventory optimization at $12M. Scheduling redesign can be addressed in a follow-on phase after these two are implemented.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Reducing to two recommendations is defensible if the COO's implementation capacity is genuinely constrained. However, scheduling at $8M for $45M in annual savings is a 3.5-month payback that is hard to leave out. Three well-sequenced initiatives is manageable.",
          },
        ],
      },
      {
        id: "g11q5b",
        stage: "Final Recommendation",
        question: "Your analysis has been off-track. The partner gives you the final opportunity before the COO meeting. What is the correct three-recommendation package?",
        options: [
          {
            id: "a",
            text: "Predictive maintenance at $45M using existing ACARS sensor data — $180M annual savings. Parts inventory optimization at $12M with demand-sensing forecasting — $67M savings. Technician scheduling redesign at $8M — $45M savings. Total $65M for $292M annual savings and under-three-month payback.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good recovery. The correct package addresses the two primary delay categories directly and adds a high-ROI scheduling improvement. The financial summary is compelling and specific. The partner says: present it confidently.",
          },
          {
            id: "b",
            text: "Request a second two-week diagnostic phase before making recommendations — the analysis has been inconsistent and the COO deserves a thorough review before committing to a specific investment plan.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Requesting more time when the analysis is complete and the COO has a $595M annual problem is not acceptable. The data supports the three-recommendation package. Present it now.",
          },
          {
            id: "c",
            text: "Recommend one initiative only — predictive maintenance — since it has the highest single-initiative impact and the organization may not have the implementation capacity for multiple simultaneous programs.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Single-initiative focus is more conservative but leaves $112M in annual savings from inventory optimization and scheduling unaddressed. If the COO has implementation constraints, a phased approach — predictive maintenance first, then the others — is better than omitting them entirely.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE G12: OLIVER WYMAN — INSURANCE M&A
  // INTERMEDIATE — 9 NODES
  // ─────────────────────────────────────────────
  {
    id: "g12",
    title: "InsureCo: HealthPredict Acquisition",
    type: "merger_acquisition",
    difficulty: "intermediate",
    firm: "oliver_wyman",
    estimatedMinutes: 30,
    overview: "A top-five US health insurer is evaluating acquiring a health tech startup that uses AI to predict high-cost claimants before hospitalizations occur. Oliver Wyman has been engaged to evaluate the deal.",
    clientBackground: "InsureCo is a $45B revenue health insurer with 18M members and a medical loss ratio of 87% against an industry best-in-class of 82%. HealthPredict is a 4-year-old startup with a proprietary CAR-T adjacent AI platform that identifies members at high risk of costly hospitalization 6-12 months in advance. Phase 2 data showed 19% reduction in hospitalizations for identified high-risk members. HealthPredict has $38M ARR growing 85% annually. The seller is asking $800M.",
    yourRole: "You are an Oliver Wyman manager on the financial services practice. The InsureCo CFO is your day-to-day client. You have three weeks to deliver a go or no-go recommendation with financial analysis.",
    startQuestionId: "g12q1",
    finalRecommendationPrompt: "Should InsureCo acquire HealthPredict at $800M? What is the financial case and what are the key conditions?",
    sampleRecommendation: "Yes, with conditions. The financial case is compelling: applying HealthPredict's technology to InsureCo's 18M members generates an estimated $1.1B in annual claims savings at a realistic 35% intervention success rate, improving MLR from 87% to approximately 84.6% — worth $1.08B in annual EBITDA improvement at a 15x multiple, the deal creates over $16B in enterprise value against an $800M acquisition price. Two conditions: independent validation of the 19% hospitalization reduction at scale, and a manufacturing partnership secured before close.",
    idealRecommendation: "Acquire HealthPredict at $800M with two conditions: (1) independent clinical validation of the 19% result at InsureCo's 18M member scale; (2) earnout structure with $160M of the $800M tied to MLR improvement milestones. The $1.1B annual savings thesis makes the deal compelling even at conservative assumptions. The primary risk is technology performance at scale — proven on 2.1M members, unproven on 18M.",
    keyTakeaways: [
      "In insurance M&A, always anchor the financial analysis to the medical loss ratio — it is the single most important metric for insurers",
      "AI technology acquisitions require careful validation of whether performance at small scale will replicate at large scale",
      "Earnout structures are appropriate when there is genuine uncertainty about whether the acquired technology will perform as claimed",
      "The most important risk in health tech acquisitions is often not the technology itself but adoption by physicians and members who must change behavior for the technology to deliver its promised value",
    ],
    questions: [
      {
        id: "g12q1",
        stage: "Strategic Rationale",
        question: "InsureCo's CEO says the acquisition is motivated by wanting to become more data-driven and reduce claims costs. How do you evaluate whether this acquisition makes strategic sense before looking at price?",
        options: [
          {
            id: "a",
            text: "Evaluate three sequential questions: does HealthPredict's technology actually work at InsureCo's scale; is $800M a fair price for the value it creates; and are there build or partner alternatives that achieve the same outcome at lower cost and risk?",
            nextQuestionId: "g12q2a",
            scoreImpact: 20,
            feedback: "Correct sequential structure. Technology validation at scale is the most critical unknown. Financial valuation grounds the decision in numbers. And build or partner alternatives ensure InsureCo is not overpaying for something accessible another way. Oliver Wyman would structure the strategic rationale exactly this way.",
          },
          {
            id: "b",
            text: "Benchmark what competitors have done — if UnitedHealth and Aetna have made similar acquisitions, that validates the strategic logic and InsureCo should follow suit.",
            nextQuestionId: "g12q2b",
            scoreImpact: -5,
            feedback: "Benchmarking competitor acquisitions is useful context but is not a rigorous strategic evaluation. Competitors may have made mistakes or have different strategic positions — the analysis must stand on InsureCo-specific financial logic, not peer precedent.",
          },
          {
            id: "c",
            text: "Survey InsureCo's physicians and care managers to determine whether they would actually use the HealthPredict platform before evaluating the strategic rationale.",
            nextQuestionId: "g12q2c",
            scoreImpact: -5,
            feedback: "User adoption research is important but comes after establishing strategic and financial rationale. Doing user research before financial analysis puts the cart before the horse — and the primary risk may not be whether clinicians will use the technology but whether it works at scale.",
          },
        ],
      },
      {
        id: "g12q2a",
        stage: "Financial Analysis",
        question: "Using the InsureCo data provided, calculate the potential annual financial value of applying HealthPredict's technology to InsureCo's full member base.",
        exhibit: {
          type: "table",
          title: "InsureCo and HealthPredict Financial Data",
          data: `| Metric                                     | Value      |
|-------------------------------------------|------------|
| InsureCo annual revenue                    | $45B       |
| InsureCo medical loss ratio                | 87%        |
| InsureCo annual claims paid                | $39.15B    |
| InsureCo total members                     | 18M        |
| HealthPredict identification rate          | 15%        |
| HealthPredict hospitalization reduction    | 19%        |
| Average hospitalization cost               | $28,000    |
| Hospitalizations per 1,000 members/yr     | 85         |
| HealthPredict annual license per member   | $18        |
| Technology integration cost (one-time)    | $120M      |`,
        },
        options: [
          {
            id: "a",
            text: "Total hospitalizations: 18M times 85 per 1,000 equals 1.53M. High-risk members identified: 18M times 15% equals 2.7M — representing roughly 40% of hospitalizations or 612,000. 19% reduction equals 116,280 avoided hospitalizations. At $28,000 each equals $3.26B gross, adjusted for 35% intervention success equals approximately $1.14B net annual savings.",
            nextQuestionId: "g12q3a",
            scoreImpact: 20,
            feedback: "Correct multi-step calculation. The intervention success rate adjustment is the critical nuance — not all identified high-risk members will accept or comply with care management interventions. The $1.14B net figure is the defensible number for the financial case.",
          },
          {
            id: "b",
            text: "Apply 19% reduction to all 39.15B in annual claims, giving $7.4B in annual savings — this is HealthPredict's full potential value to InsureCo if applied universally across all members.",
            nextQuestionId: "g12q3b",
            scoreImpact: -15,
            feedback: "Applying 19% to all claims ignores that HealthPredict only identifies 15% of members as high-risk, only those members receive interventions, and only a fraction of interventions succeed. The gross potential is $7.4B but the realistic net is approximately one-seventh of that figure.",
          },
          {
            id: "c",
            text: "The financial value cannot be calculated without knowing HealthPredict's exact performance on InsureCo's specific member population, since 19% on 2.1M members may not replicate on 18M members.",
            nextQuestionId: "g12q3b",
            scoreImpact: 0,
            feedback: "This concern is valid as a risk flag, but refusing to calculate the value because of this uncertainty is not useful for the CFO. The right approach is to calculate the value under the assumption that the 19% replicates, then explicitly flag scale risk as the key sensitivity.",
          },
        ],
      },
      {
        id: "g12q2b",
        stage: "Financial Analysis",
        question: "Competitor benchmarking shows three similar acquisitions. The CFO asks: does the precedent support the $800M price for HealthPredict?",
        exhibit: {
          type: "table",
          title: "Comparable Health Tech Acquisitions",
          data: `| Company        | ARR   | Growth | EV/ARR | Notes                       |
|---------------|-------|--------|--------|-----------------------------|
| ClaimAI        | $45M  | 72%    | 18x    | AI claims processing        |
| CarePredict    | $28M  | 91%    | 24x    | Care management AI          |
| RiskScore Inc  | $62M  | 58%    | 15x    | Risk stratification         |
| WellnessAI     | $31M  | 78%    | 22x    | Preventive care AI          |
| Average        |       |        | 19.75x |                             |
| HealthPredict  | $38M  |        | 21.1x  | ($800M divided by $38M)     |`,
        },
        options: [
          {
            id: "a",
            text: "At 21.1x ARR versus a comparable average of 19.75x, HealthPredict is at a modest 7% premium to the market — justified by its 85% growth rate which is above most comparables. The price is fair.",
            nextQuestionId: "g12q3a",
            scoreImpact: 15,
            feedback: "Correct use of comparables. The 7% premium is well within the range of rounding error given the wide range in comparables, and the 85% growth rate is a legitimate justification for a modest premium. The multiple analysis supports the $800M price.",
          },
          {
            id: "b",
            text: "The comparable average of 19.75x means HealthPredict at 21.1x is overpriced — InsureCo should push the price down to $750M to align with the market average.",
            nextQuestionId: "g12q3b",
            scoreImpact: -5,
            feedback: "Mechanically applying the average multiple without adjusting for HealthPredict's above-average 85% growth rate is not rigorous valuation. CarePredict at 24x had 91% growth — HealthPredict at 85% growth deserves a premium to the 19.75x average.",
          },
          {
            id: "c",
            text: "Comparables are not useful here since HealthPredict is a unique asset with no direct precedent — the valuation should be based entirely on the NPV of the MLR improvement InsureCo expects to generate.",
            nextQuestionId: "g12q3a",
            scoreImpact: 5,
            feedback: "Strategic value analysis is the right primary lens for InsureCo, but comparable multiples are a useful market-clearing check on whether the price is reasonable relative to how similar assets have been valued. Both approaches together are stronger than either alone.",
          },
        ],
      },
      {
        id: "g12q2c",
        stage: "Financial Analysis",
        question: "Physician and care manager surveys show 71% say they would use the HealthPredict platform if it were available. The CFO asks: is this adoption rate sufficient to justify the acquisition?",
        options: [
          {
            id: "a",
            text: "71% stated adoption intention should be discounted significantly — survey-stated intent consistently overpredicts actual adoption. A more realistic working assumption is 40-50% actual adoption, and the financial case should be built on that lower figure.",
            nextQuestionId: "g12q3a",
            scoreImpact: 15,
            feedback: "Correct application of survey bias adjustment. Using 40-50% actual adoption as the working assumption builds a more conservative and defensible financial case. If the case works at 40%, it certainly works at higher adoption rates.",
          },
          {
            id: "b",
            text: "71% adoption is strong validation — this adoption rate combined with the 19% hospitalization reduction provides sufficient confidence to proceed with the acquisition at $800M.",
            nextQuestionId: "g12q3b",
            scoreImpact: -5,
            feedback: "71% stated adoption is not a sound basis for a $800M acquisition decision. Survey-stated intent consistently overpredicts behavior, and actual adoption of new clinical tools typically falls significantly below stated intent.",
          },
          {
            id: "c",
            text: "The adoption survey validates physician willingness but the key question is whether patients will comply with the recommended care management interventions after being identified as high-risk.",
            nextQuestionId: "g12q3a",
            scoreImpact: 10,
            feedback: "Good additional nuance. Physician adoption is necessary but not sufficient — patient compliance with recommended interventions is a critical additional variable. Both must be considered in building a realistic financial model.",
          },
        ],
      },
      {
        id: "g12q3a",
        stage: "Valuation",
        question: "Your financial analysis shows approximately $1.1B in annual net savings to InsureCo from the HealthPredict technology. The CFO asks: given this value, is $800M a good deal?",
        options: [
          {
            id: "a",
            text: "At $800M acquisition cost against $1.1B in year-one annual savings, the payback period is under one year and the NPV over five years is approximately $4-5B. This is an exceptionally strong financial case regardless of whether comparable multiples support the price.",
            nextQuestionId: "g12q4a",
            scoreImpact: 20,
            feedback: "Correct framing. The strategic value NPV — $1.1B annual savings discounted over five years at InsureCo's cost of capital — vastly exceeds the $800M acquisition price. For a strategic acquirer, this is the primary valuation methodology. Comparable multiples are a secondary check.",
          },
          {
            id: "b",
            text: "The $1.1B annual savings estimate is too uncertain to use as the primary valuation basis — the financial case should rely primarily on comparable transaction multiples rather than speculative future savings.",
            nextQuestionId: "g12q4b",
            scoreImpact: -5,
            feedback: "For a strategic acquirer like InsureCo, the whole rationale is the operational value creation — using only comparable multiples ignores the entire strategic rationale. Both approaches should be used, with strategic value as the primary metric.",
          },
          {
            id: "c",
            text: "$800M is expensive at 21x ARR but the $1.1B annual savings makes it compellingly cheap from a strategic value perspective. Recommend proceeding at $800M but with the earnout structure to protect against scale risk.",
            nextQuestionId: "g12q4a",
            scoreImpact: 15,
            feedback: "Good balanced conclusion. Both the multiple analysis and the strategic value analysis are considered, and the earnout recommendation addresses the primary risk. This is the Oliver Wyman recommendation.",
          },
        ],
      },
      {
        id: "g12q3b",
        stage: "Valuation",
        question: "Your financial analysis has been overly pessimistic about the value creation potential. The partner shares that a realistic calculation gives approximately $1.1B in annual savings. Given this, how do you revise your recommendation?",
        options: [
          {
            id: "a",
            text: "Revise immediately — at $1.1B in annual savings against $800M acquisition cost, the payback is under one year and the strategic case is compelling. The recommendation should be to proceed with appropriate risk mitigations rather than declining.",
            nextQuestionId: "g12q4a",
            scoreImpact: 15,
            feedback: "Good revision under partner guidance. When the financial case is this strong — sub-one-year payback — the question becomes how to manage the risks rather than whether to proceed.",
          },
          {
            id: "b",
            text: "The $1.1B estimate seems too optimistic and should be further discounted before revising the recommendation — a 50% haircut to $550M annual savings would still support the acquisition but at a lower confidence level.",
            nextQuestionId: "g12q4b",
            scoreImpact: 0,
            feedback: "Additional conservatism after the partner has shared the correct calculation is unnecessary caution. The $1.1B already incorporates a 35% intervention success rate adjustment — further haircuts would need to be justified by specific additional uncertainty, not general risk aversion.",
          },
          {
            id: "c",
            text: "Maintain the original pessimistic assessment until independent clinical validation of the 19% hospitalization reduction is completed — no revision should occur until the core clinical assumption is validated.",
            nextQuestionId: "g12q4b",
            scoreImpact: -5,
            feedback: "Independent clinical validation is a valid condition to attach to the recommendation, but it should be a condition of proceeding rather than a reason to withhold a go recommendation entirely. The financial case can be presented now with validation as a required pre-closing condition.",
          },
        ],
      },
      {
        id: "g12q4a",
        stage: "Deal Structure",
        question: "The financial case supports the acquisition. The CFO asks: given the technology scale risk — proven on 2.1M members but unproven on 18M — how should the $800M be structured?",
        options: [
          {
            id: "a",
            text: "Full $800M upfront — the financial case is so strong that holding back consideration introduces unnecessary friction with the sellers and risks losing the deal to a competing bidder.",
            nextQuestionId: "g12q5a",
            scoreImpact: -5,
            feedback: "Paying full price when there is genuine uncertainty about technology scale performance removes all downside protection for InsureCo. A compelling financial case does not eliminate the need for deal structure that protects against the most significant specific risk.",
          },
          {
            id: "b",
            text: "Structure as $640M upfront plus $160M earnout tied to MLR improvement milestones: $80M if MLR improves 1.5pp by year two and $80M if MLR improves 2.5pp by year three. This aligns seller incentives with the value driver while protecting InsureCo against scale failure.",
            nextQuestionId: "g12q5a",
            scoreImpact: 20,
            feedback: "Correct structure. The 80/20 upfront/earnout split is sufficient to close the deal while the earnout directly ties additional consideration to the specific metric — MLR improvement — that justifies the acquisition price. Oliver Wyman standard recommendation for tech acquisitions with scale uncertainty.",
          },
          {
            id: "c",
            text: "Structure as $400M upfront plus $400M contingent — maximum protection for InsureCo against scale failure while keeping the total consideration unchanged if milestones are met.",
            nextQuestionId: "g12q5b",
            scoreImpact: -5,
            feedback: "50/50 upfront/contingent is too aggressive for a deal with comparable transaction support at 21x ARR. HealthPredict's sellers would likely reject a deal where half the consideration is contingent — the risk of losing the deal is real.",
          },
        ],
      },
      {
        id: "g12q4b",
        stage: "Deal Structure",
        question: "You have been overly cautious on the financial analysis. The partner asks: assuming the financial case is sound, what is the most important risk to address in the deal structure?",
        options: [
          {
            id: "a",
            text: "Technology scale risk — HealthPredict is proven on 2.1M members but InsureCo has 18M. An earnout tied to actual MLR improvement milestones protects InsureCo if the technology performs below expectations at full scale.",
            nextQuestionId: "g12q5a",
            scoreImpact: 15,
            feedback: "Correct identification of the primary risk and the structural solution. Even after recovering the financial analysis, correctly identifying scale risk as the deal structure driver demonstrates the analytical instincts expected of an Oliver Wyman manager.",
          },
          {
            id: "b",
            text: "Physician adoption risk — if InsureCo's physicians do not use the platform, no MLR improvement will occur regardless of how well the technology performs. The deal should be conditioned on a physician adoption commitment from clinical leadership.",
            nextQuestionId: "g12q5b",
            scoreImpact: 5,
            feedback: "Physician adoption is a real risk but it is partially within InsureCo's control through clinical change management programs. Scale validation of the technology itself is the more fundamental risk since adoption programs can be designed but the technology's performance at scale cannot be guaranteed.",
          },
          {
            id: "c",
            text: "Integration complexity risk — merging a 120-person startup into a large insurer will cause key talent to leave and the technology to deteriorate. The deal should include a three-year retention package for the top 20 HealthPredict engineers.",
            nextQuestionId: "g12q5b",
            scoreImpact: 0,
            feedback: "Talent retention is a real integration risk and retention packages are appropriate, but this is a secondary operational concern. The primary deal structure risk is whether the technology performs at InsureCo scale — that is the risk the deal structure must address first.",
          },
        ],
      },
      {
        id: "g12q5a",
        stage: "Final Recommendation",
        question: "The CFO asks for the final one-paragraph go or no-go recommendation with deal structure.",
        options: [
          {
            id: "a",
            text: "Go. The $1.1B annual savings thesis at a conservative 35% intervention success rate generates a sub-one-year payback on the $800M price. Structure as $640M upfront plus $160M in MLR-improvement earnouts. The primary condition is independent clinical validation of the 19% hospitalization reduction before closing. This is the best health tech acquisition opportunity in the market at this price.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Excellent complete recommendation. Go or no-go is clear, the financial basis is stated, the deal structure is specific, and the primary condition is identified. The CFO has everything needed to take this to the board.",
          },
          {
            id: "b",
            text: "Conditional go pending a six-month pilot of the HealthPredict technology on a sample of 500,000 InsureCo members to validate the 19% result before committing $800M.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "A pilot is a conservative but reasonable alternative — it validates the technology before committing full capital. The downside is six months of delay during which a competitor could acquire HealthPredict. The earnout structure achieves similar risk protection without the timing risk.",
          },
          {
            id: "c",
            text: "No go — the technology scale risk from 2.1M to 18M members is too uncertain to justify $800M without several more years of performance data at larger scale.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Rejecting a deal with a sub-one-year payback because of scale uncertainty that can be managed through an earnout structure is overly conservative. The financial case is strong enough that risk should be managed through deal structure, not by declining the acquisition.",
          },
        ],
      },
      {
        id: "g12q5b",
        stage: "Final Recommendation",
        question: "Your recommendation has been overly cautious throughout. The partner gives you one final chance: the CFO needs a yes or no with a specific deal structure in the next five minutes. What do you say?",
        options: [
          {
            id: "a",
            text: "Yes. Acquire HealthPredict at $800M structured as $640M upfront and $160M earnout tied to MLR improvement. The $1.1B annual savings thesis supports the price at current assumptions. Primary condition: independent clinical validation before closing.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good decisive recovery. Clear go decision, specific deal structure, and the key condition stated. This is what the CFO needed and what Oliver Wyman is expected to deliver.",
          },
          {
            id: "b",
            text: "More analysis is needed — the physician adoption and technology scale questions create too much uncertainty to make a recommendation in five minutes without additional due diligence.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "Requesting more time when the partner has given you five minutes and three weeks of analysis are already complete is a failure. Oliver Wyman consultants are expected to form views under uncertainty, not defer indefinitely waiting for perfect information.",
          },
          {
            id: "c",
            text: "Yes at a lower price — counter-offer at $650M to reduce the scale risk premium, with an earnout of $150M if MLR improves as projected.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "The counter-offer is a reasonable negotiating position but the comparable analysis supports the $800M price. Recommending to negotiate down without strong analytical justification may signal weakness to the sellers and risk losing the deal at a price that is fair.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE G13: KPMG — PHARMA MARKET ENTRY
  // INTERMEDIATE — 9 NODES
  // ─────────────────────────────────────────────
  {
    id: "g13",
    title: "GeneriPharma: US Generic Drug Entry",
    type: "market_entry",
    difficulty: "intermediate",
    firm: "kpmg",
    estimatedMinutes: 28,
    overview: "A European generic pharmaceutical company wants to enter the US generic drug market. KPMG has been engaged to assess market attractiveness and recommend an entry strategy.",
    clientBackground: "GeneriPharma is a $2.8B European generic pharmaceutical company headquartered in Germany with operations across 18 European markets. They have never operated in the US. The US generic drug market is approximately $98B and growing at 8% CAGR. Several major branded drugs lose patent protection between 2025 and 2028. GeneriPharma's CEO believes there is a significant opportunity to enter during this patent cliff window.",
    yourRole: "You are a KPMG director on the financial services and pharma practice. You have six weeks to deliver a go or no-go entry recommendation with an implementation plan.",
    startQuestionId: "g13q1",
    finalRecommendationPrompt: "Should GeneriPharma enter the US generic drug market, and if yes, through what mode and targeting which therapeutic categories?",
    sampleRecommendation: "Yes. Enter the US market through acquisition of a mid-sized US generic manufacturer — organic entry would take 5-7 years due to FDA ANDA filing backlogs and is too slow to capture the 2025-2027 patent cliff. Target acquisition: SunValley Pharma at $890M, which brings $520M ARR, CNS and diabetes focus directly aligned with the Jardiance 2025 and Vyvanse patent expirations, and established PBM distribution relationships. Entry investment: $890M acquisition plus $150M integration and launch capital.",
    idealRecommendation: "Enter via acquisition of a US generic manufacturer. Organic entry is too slow for the patent cliff window. SunValley Pharma at $890M is the recommended target — CNS and diabetes focus aligns with near-term patent cliffs, established PBM relationships are the most valuable non-obvious asset. Total investment: approximately $1.04B including integration costs.",
    keyTakeaways: [
      "FDA regulatory approval — the ANDA filing process — is the primary barrier to entry in US generics and creates a 2-5 year organic entry timeline that often exceeds strategic windows",
      "PBM relationships are the critical distribution asset in US generics — they determine whether a new generic launch gets formulary placement and volume",
      "Patent cliffs create predictable, time-limited windows of above-normal profitability for first generic entrants that significantly exceed steady-state returns",
      "In regulated industries, build versus buy almost always favors acquisition when time pressure exists because regulatory approvals cannot be accelerated with capital",
    ],
    questions: [
      {
        id: "g13q1",
        stage: "Market Attractiveness",
        question: "The CEO wants to know whether the US generic drug market is attractive enough to justify entry. How do you structure the attractiveness assessment?",
        options: [
          {
            id: "a",
            text: "Analyze the market on three dimensions: overall market attractiveness including size, growth, and profitability; the specific patent cliff opportunity including which drugs, when, and how much revenue is at stake; and GeneriPharma's ability to win given their European capabilities and capital.",
            nextQuestionId: "g13q2a",
            scoreImpact: 20,
            feedback: "Correct three-dimension framework. General market attractiveness sets the baseline. The patent cliff is the specific time-sensitive opportunity. And GeneriPharma's ability to win ensures the recommendation is grounded in their specific capabilities, not just market conditions.",
          },
          {
            id: "b",
            text: "Compare the US generic market to European markets on profitability metrics to determine whether the US offers better returns than continuing to invest in European markets GeneriPharma already understands.",
            nextQuestionId: "g13q2b",
            scoreImpact: 5,
            feedback: "Comparative market analysis is relevant context but frames the decision too narrowly. The CEO is asking whether to enter the US, not whether the US is better than Europe — the two are not mutually exclusive and capital can be deployed in both simultaneously.",
          },
          {
            id: "c",
            text: "Identify the top three generic drugs losing patent protection in 2025-2028 and assess whether GeneriPharma's existing product pipeline includes these molecules, since that determines whether entry is feasible quickly.",
            nextQuestionId: "g13q2c",
            scoreImpact: 5,
            feedback: "Patent cliff analysis is important but assumes organic entry as the default mode. Acquisition of a US company with the right pipeline may be a more viable path than evaluating whether GeneriPharma's existing European pipeline applies to US patent opportunities.",
          },
        ],
      },
      {
        id: "g13q2a",
        stage: "Patent Cliff Analysis",
        question: "You have assessed market attractiveness. The US generic market is $98B growing at 8% with 42% average gross margins. Now assess the specific patent cliff opportunity.",
        exhibit: {
          type: "table",
          title: "US Patent Cliff 2025-2028 (Top Revenue Opportunities)",
          data: `| Drug       | Category       | 2024 Revenue | Patent Date | Generic Premium Yr1 |
|-----------|----------------|-------------|-------------|---------------------|
| Eliquis   | Cardiovascular | $12B        | 2026        | 40-60% above steady |
| Jardiance  | Diabetes       | $8B         | 2025        | 40-60% above steady |
| Entresto  | Cardiovascular | $6B         | 2025        | 40-60% above steady |
| Keytruda  | Oncology       | $25B        | 2028        | 40-60% above steady |
| Ozempic   | GLP-1          | $14B        | 2031        | 40-60% above steady |`,
        },
        options: [
          {
            id: "a",
            text: "The 2025-2026 window is most immediately actionable — Jardiance and Entresto together represent $14B in branded revenue losing protection within 18 months. First generic entrants capture premium margins of 40-60% above steady-state prices for 12-24 months.",
            nextQuestionId: "g13q3a",
            scoreImpact: 20,
            feedback: "Correct identification of the near-term window. Jardiance and Entresto losing patent in 2025 creates an immediate opportunity — but only for companies already in the US market or entering via acquisition before the patent expiration. Organic entry would miss this window entirely.",
          },
          {
            id: "b",
            text: "Keytruda at $25B in 2028 is the largest single opportunity and GeneriPharma should focus its entry strategy on positioning for this one drug even though the timeline is four years away.",
            nextQuestionId: "g13q3b",
            scoreImpact: -5,
            feedback: "Waiting four years for one drug creates an extremely concentrated bet on a single asset. Oncology biologics like Keytruda also have complex biosimilar manufacturing requirements that may not fit GeneriPharma's small-molecule generic capabilities.",
          },
          {
            id: "c",
            text: "Ozempic and the GLP-1 class represent the largest long-term opportunity and should be the primary entry thesis since this category will dominate generic spending in the 2030s.",
            nextQuestionId: "g13q3b",
            scoreImpact: -5,
            feedback: "Ozempic patent expiry is 2031 — seven years away. Building a US entry strategy around a 2031 patent cliff ignores the 2025-2026 window that is immediately available and would require significant capital to remain in market for seven years before the primary thesis materializes.",
          },
        ],
      },
      {
        id: "g13q2b",
        stage: "Patent Cliff Analysis",
        question: "Your European comparison shows that US generic gross margins of 42% exceed European average margins of 31%. The CEO is persuaded on attractiveness. The next question is how to enter. What are the options?",
        options: [
          {
            id: "a",
            text: "Three entry modes exist: organic entry building US operations from scratch, acquisition of an existing US generic manufacturer, and a licensing or distribution partnership with a US company. Each has different speed, capital, and risk profiles.",
            nextQuestionId: "g13q3a",
            scoreImpact: 15,
            feedback: "Correct framing of the three options. The key differentiator is speed — organic entry is slowest, acquisition is fastest, and partnerships are intermediate. For a patent cliff opportunity, speed to market is a critical variable.",
          },
          {
            id: "b",
            text: "The only viable entry mode for a company of GeneriPharma's scale is organic since acquisitions of US generic manufacturers are typically overpriced and partnerships lack strategic control.",
            nextQuestionId: "g13q3b",
            scoreImpact: -10,
            feedback: "Assuming organic entry without evaluating acquisition alternatives ignores the most important variable — the FDA ANDA approval timeline of 36-48 months makes organic entry too slow for the 2025-2026 patent cliff window. Acquisitions should be evaluated before dismissing them.",
          },
          {
            id: "c",
            text: "Focus exclusively on acquisition options since organic entry timelines exceed the patent cliff window and partnerships lack the strategic control needed for full US market participation.",
            nextQuestionId: "g13q3a",
            scoreImpact: 10,
            feedback: "Acquisition focus is directionally correct given the timeline constraint, though framing it as exclusive may be too binary. A licensing partnership could be a bridge strategy while an acquisition target is identified and closed. Evaluate all three before selecting.",
          },
        ],
      },
      {
        id: "g13q2c",
        stage: "Patent Cliff Analysis",
        question: "You have focused on GeneriPharma's existing pipeline for US patent cliff opportunities. GeneriPharma's European products are primarily cardiovascular and respiratory molecules. Jardiance and Entresto are cardiovascular — both align. How does this change the entry analysis?",
        options: [
          {
            id: "a",
            text: "Pipeline alignment with the patent cliff improves the organic entry feasibility, but the FDA ANDA timeline of 36-48 months still means GeneriPharma cannot file and receive approval before the 2025 Jardiance and Entresto expirations. Acquisition of a company with existing ANDAs on file or approved is still faster.",
            nextQuestionId: "g13q3a",
            scoreImpact: 15,
            feedback: "Correct constraint analysis. Pipeline alignment is positive but FDA approval timelines are fixed — even with the right molecules, GeneriPharma cannot get ANDA approvals faster than the 36-48 month FDA process. Acquisition bypasses this constraint.",
          },
          {
            id: "b",
            text: "Pipeline alignment confirms GeneriPharma should pursue organic entry — their cardiovascular expertise gives them a strong technical foundation and the ANDAs can be filed immediately to target the 2026 Eliquis patent expiry.",
            nextQuestionId: "g13q3b",
            scoreImpact: -5,
            feedback: "Filing ANDAs immediately still means 36-48 months before approval — missing the 2025 window for Jardiance and Entresto, and potentially the 2026 window for Eliquis. Pipeline alignment improves the organic case but does not solve the timing problem.",
          },
          {
            id: "c",
            text: "Cardiovascular pipeline alignment is the strongest possible signal to proceed with organic entry — GeneriPharma has the technical capabilities and the relevant therapeutic knowledge to compete successfully in this segment.",
            nextQuestionId: "g13q3b",
            scoreImpact: -10,
            feedback: "Technical capabilities and therapeutic knowledge are necessary but not sufficient for organic entry success in US generics. FDA regulatory approval timelines, PBM distribution relationships, and manufacturing compliance are all additional barriers that GeneriPharma lacks in the US regardless of their European capabilities.",
          },
        ],
      },
      {
        id: "g13q3a",
        stage: "Entry Mode",
        question: "The CEO wants to pursue organic entry to maintain full strategic control. You need to evaluate whether organic entry is feasible given the timing. What is your assessment?",
        exhibit: {
          type: "table",
          title: "Entry Mode Comparison: Organic vs Acquisition",
          data: `| Factor                          | Organic Entry        | Acquisition            |
|--------------------------------|----------------------|------------------------|
| Time to first US revenue       | 4-6 years            | 6-12 months post-close |
| Capital required               | $150-250M over 5 yrs | $800M-1.2B upfront     |
| FDA manufacturing compliance   | Build from zero      | Acquired and approved  |
| PBM distribution               | Build from zero      | Acquire existing       |
| Capture 2025-2026 patent cliff | No                   | Yes if closed in 2024  |`,
        },
        options: [
          {
            id: "a",
            text: "Organic entry is feasible long-term but definitively misses the 2025-2026 patent cliff window — the CEO's primary stated rationale for entering now. Acquisition is the only mode that captures the time-limited opportunity that justifies the entry investment.",
            nextQuestionId: "g13q4a",
            scoreImpact: 20,
            feedback: "Correct conclusion. The patent cliff window drives the timing, and organic entry cannot capture it. This is the core argument for acquisition that should be presented clearly to the CEO rather than softened to preserve the organic preference.",
          },
          {
            id: "b",
            text: "Recommend a hybrid approach — file organic ANDAs now for the 2028 Keytruda opportunity while simultaneously evaluating acquisitions for the nearer-term patent cliff. This preserves optionality while maintaining the organic preference.",
            nextQuestionId: "g13q4b",
            scoreImpact: 5,
            feedback: "Hybrid approach is creative but filing for Keytruda biosimilars requires complex biologic manufacturing capabilities that GeneriPharma likely does not have. The hybrid also delays the acquisition decision that is genuinely urgent given the 2025 patent expirations.",
          },
          {
            id: "c",
            text: "Support the CEO's organic preference — the 4-6 year timeline is long but GeneriPharma can build a sustainable US presence rather than paying an acquisition premium for assets that may not integrate well.",
            nextQuestionId: "g13q4b",
            scoreImpact: -10,
            feedback: "Supporting an organic preference that the data clearly shows cannot capture the primary rationale for entering — the patent cliff — is not sound consulting. The CEO's preference does not override the timeline mathematics that organic entry cannot overcome.",
          },
        ],
      },
      {
        id: "g13q3b",
        stage: "Entry Mode",
        question: "Your entry mode analysis has been suboptimal. The partner shares that organic entry definitively misses the 2025-2026 patent cliff given ANDA timelines. Given this, which acquisition target should GeneriPharma pursue?",
        exhibit: {
          type: "table",
          title: "US Generic Acquisition Targets",
          data: `| Company         | Revenue | EBITDA | Price  | Focus             | PBM Relationships |
|----------------|---------|--------|--------|-------------------|-------------------|
| MidWest Generics| $380M  | $72M   | $650M  | Cardiovascular    | Moderate          |
| SunValley Pharma| $520M  | $98M   | $890M  | CNS and diabetes  | Strong            |
| Atlantic Drug   | $290M  | $48M   | $480M  | Solid state/inject| Weak              |`,
        },
        options: [
          {
            id: "a",
            text: "SunValley Pharma at $890M — CNS and diabetes focus aligns with Jardiance 2025 and Vyvanse already off-patent, strong PBM relationships are the most valuable non-obvious asset, and $520M revenue gives GeneriPharma the critical scale needed for US market presence.",
            nextQuestionId: "g13q4a",
            scoreImpact: 15,
            feedback: "Correct target selection. The PBM relationship insight is particularly important — new generic launches need formulary placement to get volume, and PBM relationships are what determines that. SunValley's strong PBM network accelerates commercial success in a way that MidWest Generics' moderate relationships cannot.",
          },
          {
            id: "b",
            text: "Atlantic Drug at $480M — cheapest acquisition price preserves capital for organic pipeline investment after entry, and manufacturing expertise in solid state and injectables has broad applicability.",
            nextQuestionId: "g13q4b",
            scoreImpact: -10,
            feedback: "Atlantic Drug has weak PBM relationships — the most critical commercial asset for US generic market success — and limited therapeutic alignment with the patent cliff opportunities. The cheapest acquisition price is not the right selection criterion.",
          },
          {
            id: "c",
            text: "MidWest Generics at $650M — cardiovascular focus directly aligns with Eliquis and Entresto patent cliffs in 2025-2026, and the lower price preserves $240M more capital for post-acquisition investment versus SunValley.",
            nextQuestionId: "g13q4a",
            scoreImpact: 10,
            feedback: "MidWest Generics is a reasonable second choice — cardiovascular does align with the 2025-2026 cliff. SunValley is preferred because of stronger PBM relationships and broader therapeutic coverage, but MidWest is a defensible alternative if the capital preservation matters.",
          },
        ],
      },
      {
        id: "g13q4a",
        stage: "Financial Analysis",
        question: "The CEO is persuaded on acquisition entry. Now quantify the financial case for the recommended target.",
        options: [
          {
            id: "a",
            text: "SunValley at $890M plus $150M integration equals $1.04B total. Revenue upside: SunValley's $520M plus $200-300M from patent cliff generics in years one to three equals approximately $720-820M pro-forma. At 9x EBITDA on 19% margins, exit value in five years would be $1.25B-$1.45B — a 20-40% return above cost.",
            nextQuestionId: "g13q5a",
            scoreImpact: 20,
            feedback: "Solid financial modeling. The patent cliff revenue uplift is the key upside driver and the exit multiple analysis shows the financial case is strong even on conservative assumptions. The 20-40% return range is credible and defensible to the board.",
          },
          {
            id: "b",
            text: "The acquisition price of $890M is 9.1x EBITDA for SunValley, which is in line with the 8-10x range for mid-market pharma acquisitions. No detailed return model is needed since the multiple is market-standard.",
            nextQuestionId: "g13q5b",
            scoreImpact: 0,
            feedback: "Multiple comparison confirms the price is fair but does not build the investment case. The board needs to understand what return the acquisition will generate, not just whether the price is market-standard.",
          },
          {
            id: "c",
            text: "The financial case cannot be fully quantified without knowing the exact market share SunValley will capture on the Jardiance and Vyvanse generics, which requires additional market intelligence before committing $890M.",
            nextQuestionId: "g13q5b",
            scoreImpact: -5,
            feedback: "Using uncertainty about exact market share to avoid building the financial model is analytical avoidance. Industry benchmarks for first-to-market generic share provide reasonable estimates — the financial model should be built on these with explicit sensitivity assumptions.",
          },
        ],
      },
      {
        id: "g13q4b",
        stage: "Financial Analysis",
        question: "Your entry mode or target selection has been suboptimal. The partner gives you the direct guidance: recommend SunValley Pharma acquisition at $890M. Build the financial case in three minutes.",
        options: [
          {
            id: "a",
            text: "$890M plus $150M integration equals $1.04B cost. SunValley $520M revenue plus $250M patent cliff upside equals $770M pro-forma. At 9x EBITDA on 19% margins, five-year exit value of approximately $1.3B represents a 25% return on invested capital — compelling for a strategic entry.",
            nextQuestionId: "g13q5a",
            scoreImpact: 15,
            feedback: "Strong recovery. Clean financial case built quickly with reasonable assumptions. The 25% return framing gives the board a clear investment metric. The partner says: that is the number to present.",
          },
          {
            id: "b",
            text: "The financial case requires a full discounted cash flow model to be credible — a quick estimate would be misleading and the CEO deserves a rigorous analysis before committing $890M.",
            nextQuestionId: "g13q5b",
            scoreImpact: -10,
            feedback: "Refusing to build a quick estimate when the partner explicitly says three minutes is not appropriate under time pressure. Consultants are expected to build directional financial cases quickly under constraints — the full DCF can follow but a quick estimate is needed now.",
          },
          {
            id: "c",
            text: "The $890M price at 9.1x EBITDA is market-standard, which is sufficient justification for the board — no additional financial modeling is needed beyond confirming the multiple is in range.",
            nextQuestionId: "g13q5b",
            scoreImpact: 0,
            feedback: "Multiple confirmation is not a financial case — it is a sanity check. The board needs to understand the return on the investment, not just whether the price is fair relative to comparable transactions.",
          },
        ],
      },
      {
        id: "g13q5a",
        stage: "Final Recommendation",
        question: "The CEO asks for the final recommendation: go or no-go, entry mode, target, and investment.",
        options: [
          {
            id: "a",
            text: "Go. Acquire SunValley Pharma at $890M plus $150M integration for $1.04B total entry investment. SunValley's CNS and diabetes focus aligns with the Jardiance 2025 and Vyvanse patent expirations. PBM relationships are the critical commercial asset that makes this target superior. Target 25% ROIC over five years through base revenue plus patent cliff upside.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Excellent complete recommendation. Clear go decision, specific target, total investment stated, strategic rationale for target selection, key asset identified, and financial return quantified. The CEO says: prepare the board presentation.",
          },
          {
            id: "b",
            text: "Go, but negotiate the SunValley price down to $750M — the $890M ask is above the comparable multiple average and there is room to negotiate given GeneriPharma's financial position.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Price negotiation is a valid commercial consideration but SunValley at 9.1x EBITDA is within market range — aggressively negotiating below $890M risks losing the target to another buyer given the patent cliff timing pressure. The urgency argues against hard negotiating.",
          },
          {
            id: "c",
            text: "Conditional go — recommend proceeding with acquisition due diligence but not committing capital until HealthPredict's PBM relationship contracts are independently verified and the patent cliff revenue projections are audited.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Due diligence conditions are appropriate — auditing PBM contracts and revenue projections is standard pre-close verification. This is a reasonable final recommendation structure, though calling out SunValley rather than HealthPredict specifically would improve precision.",
          },
        ],
      },
      {
        id: "g13q5b",
        stage: "Final Recommendation",
        question: "Your analysis has been inconsistent. The partner gives you one final opportunity: what should GeneriPharma do?",
        options: [
          {
            id: "a",
            text: "Acquire SunValley Pharma at $890M plus $150M integration. Organic entry misses the 2025-2026 patent cliff. SunValley's CNS and diabetes focus and strong PBM relationships make it the best target. Total investment $1.04B targets 25% ROIC over five years.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good recovery. The complete recommendation is present — mode, target, investment, rationale, and return. The partner says: that is what we needed two days ago.",
          },
          {
            id: "b",
            text: "Defer the US entry decision by 12 months to allow more time for due diligence on all acquisition targets and better visibility on the competitive response to the 2025 Jardiance patent expiration.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Deferring by 12 months means the Jardiance patent expires during the delay period — the primary time-sensitive opportunity is lost. The analysis supports acting now, not deferring.",
          },
          {
            id: "c",
            text: "Enter organically with ANDA filings for the 2028 patent cliff opportunities, accepting that near-term patent cliff timing is missed but building a more sustainable US presence over time.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Organic entry for the 2028 window after spending six weeks analyzing why the 2025-2026 window justifies immediate entry is not consistent with the strategic rationale established earlier. The primary opportunity is now and requires acquisition.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // CASE G14: ACCENTURE — RETAIL DIGITAL OPS
  // INTERMEDIATE — 9 NODES
  // ─────────────────────────────────────────────
  {
    id: "g14",
    title: "RetailMax: Omnichannel Transformation",
    type: "operations",
    difficulty: "intermediate",
    firm: "accenture",
    estimatedMinutes: 28,
    overview: "A large US department store chain is losing market share to Amazon and specialty retailers. Accenture has been engaged to design and implement an omnichannel transformation.",
    clientBackground: "RetailMax operates 180 department stores across 32 states with $8.4B in annual revenue. Online revenue is 12% of total versus a 35% category average. NPS is 42 versus 68 for best-in-class. Inventory accuracy is 71% versus 94% best practice. Click-and-collect capability exists at only 16% of stores. Same-day delivery capability is zero. The CEO has set a target of 25% digital revenue within two years.",
    yourRole: "You are an Accenture senior manager on the retail technology practice. You are presenting a transformation roadmap to RetailMax's CTO and COO.",
    startQuestionId: "g14q1",
    finalRecommendationPrompt: "What is your omnichannel transformation roadmap for RetailMax, and what is the expected financial impact?",
    sampleRecommendation: "Three-phase transformation over 24 months. Phase one: deploy RFID inventory tracking across all 180 stores — $45M investment, improves inventory accuracy from 71% to 94%, foundation for all other capabilities. Phase two: roll out click-and-collect to all stores and launch same-day delivery from 50 high-density locations — $93M combined, targeting the 54% of churned customers who cite inability to get products same-day. Phase three: unified commerce platform and AI demand forecasting — $120M, completes the digital infrastructure. Total investment $258M targeting $1.2B in incremental digital revenue and reaching 23% digital mix.",
    idealRecommendation: "Three-phase transformation totaling $258M over 24 months. Phase one: RFID inventory accuracy ($45M) — foundation for everything else. Phase two: click-and-collect rollout plus same-day delivery launch ($93M) — directly addresses 54% of customers who cite fulfillment gaps. Phase three: unified commerce platform ($120M) — completes the infrastructure. Expected: $1.2B in incremental digital revenue reaching 23% digital mix — near the 25% target.",
    keyTakeaways: [
      "Inventory accuracy is the unsexy foundation of all omnichannel capability — you cannot offer same-day delivery if you do not know what is in your stores",
      "Click-and-collect has a basket size effect — BOPIS customers spend 2-3x more than pure online customers due to incremental in-store purchases during pickup",
      "Store-as-warehouse models allow retailers to compete with Amazon on delivery speed without building new distribution infrastructure",
      "Digital transformation sequencing matters — building customer-facing features on a broken inventory foundation always fails",
    ],
    questions: [
      {
        id: "g14q1",
        stage: "Root Cause",
        question: "RetailMax's digital revenue is 12% versus a 35% category average. Before designing solutions, what is the root cause of this gap?",
        options: [
          {
            id: "a",
            text: "The digital gap is primarily a technology and investment problem — RetailMax has simply not invested enough in its digital capabilities compared to pure-play e-commerce competitors who have had digital as their primary channel from day one.",
            nextQuestionId: "g14q2b",
            scoreImpact: -5,
            feedback: "Technology underinvestment is a symptom, not the root cause. The data on why customers do not shop RetailMax online — including inability to get products same-day, items shown online being unavailable in store — points to operational fulfillment and inventory problems, not simply a lack of digital features.",
          },
          {
            id: "b",
            text: "Connect the capability gap data to the customer feedback data: 54% of customers cite inability to get products same-day as a reason for not shopping online, and 48% cite items shown online not being available in store. These directly point to fulfillment capability and inventory accuracy as the root causes.",
            nextQuestionId: "g14q2a",
            scoreImpact: 20,
            feedback: "Correct causal chain. The customer feedback data connects directly to the specific capability gaps — zero same-day delivery and 71% inventory accuracy. This analysis tells you exactly what to fix rather than describing the general problem of being behind digitally.",
          },
          {
            id: "c",
            text: "The gap reflects a strategic choice to prioritize in-store experience over digital — RetailMax should consider whether closing the digital gap is actually aligned with its brand positioning as a physical retail destination.",
            nextQuestionId: "g14q2c",
            scoreImpact: -10,
            feedback: "Questioning whether closing the digital gap is the right strategy when the CEO has already set a 25% digital revenue target is not a useful framing. The engagement is to design how to close the gap, not whether to close it.",
          },
        ],
      },
      {
        id: "g14q2a",
        stage: "Business Case",
        question: "You have identified fulfillment capability and inventory accuracy as root causes. Before designing the transformation, what is the financial case for closing these gaps?",
        exhibit: {
          type: "table",
          title: "RetailMax Digital Capability vs Benchmark",
          data: `| Capability                    | RetailMax | Category Avg | Best-in-Class |
|-----------------------------|-----------|-------------|---------------|
| Online revenue share         | 12%       | 35%         | 48%           |
| Click-and-collect stores     | 16%       | 92%         | 100%          |
| Same-day delivery stores     | 0%        | 68%         | 100%          |
| Inventory accuracy           | 71%       | 88%         | 96%           |
| Mobile app rating            | 2.8/5     | 4.1/5       | 4.6/5         |
| Annual lost digital revenue  | $1.9B     |             |               |`,
        },
        options: [
          {
            id: "a",
            text: "The $1.9B in annual lost digital revenue versus category average is the primary business case driver — if RetailMax reaches 35% digital share from 12%, the incremental revenue is $1.9B at current revenue base. Even reaching 25% would add $1.1B in digital revenue annually.",
            nextQuestionId: "g14q3a",
            scoreImpact: 20,
            feedback: "Correct framing of the business case. The $1.9B lost revenue versus category average is the most compelling number for the CTO and COO — it frames the transformation investment not as a cost but as recovery of value that is currently being lost every year.",
          },
          {
            id: "b",
            text: "The primary business case is NPS improvement — going from 42 to 68 would represent a 60% improvement in customer satisfaction and is more strategically important than the digital revenue gap.",
            nextQuestionId: "g14q3b",
            scoreImpact: 0,
            feedback: "NPS improvement is a valuable outcome but NPS alone does not build a business case for a $250M+ transformation investment. Revenue impact is the primary financial metric that justifies capital allocation of this scale.",
          },
          {
            id: "c",
            text: "The mobile app rating of 2.8 versus 4.1 category average is the root cause of the digital gap and the primary business case driver — improving the app experience will unlock the majority of the digital revenue opportunity.",
            nextQuestionId: "g14q3c",
            scoreImpact: -5,
            feedback: "A better app helps conversion but if inventory accuracy is 71%, improving the app means customers can browse products online that are then unavailable when they try to purchase or pick up. The app improvement sits on top of a broken foundation.",
          },
        ],
      },
      {
        id: "g14q2b",
        stage: "Business Case",
        question: "You have framed this as a technology investment problem. The CTO says: our IT spend is already $420M annually — what specifically are we under-investing in? How do you respond?",
        options: [
          {
            id: "a",
            text: "Redirect to the customer data: 54% of customers cite fulfillment gaps and 48% cite inventory availability. These are operational infrastructure problems — inventory management systems and fulfillment capabilities — not general digital investment levels. The issue is where IT investment is directed, not how much is spent.",
            nextQuestionId: "g14q2a",
            scoreImpact: 15,
            feedback: "Good recovery. Redirecting from total IT spend to specific capability gaps grounded in customer feedback is the right analytical move. The CTO now understands that the problem is specific operational infrastructure, not overall investment levels.",
          },
          {
            id: "b",
            text: "Benchmark RetailMax's IT spend as a percentage of revenue against best-in-class digital retailers to identify the specific investment gap that explains the capability difference.",
            nextQuestionId: "g14q3b",
            scoreImpact: 0,
            feedback: "IT spend benchmarking may show RetailMax is investing similar amounts to competitors but getting worse digital outcomes — suggesting allocation rather than level is the issue. This is relevant context but does not directly answer the CTO's question about what to invest in.",
          },
          {
            id: "c",
            text: "Confirm that IT spend is sufficient and redirect to organizational capability and change management as the real barriers to digital transformation progress.",
            nextQuestionId: "g14q3c",
            scoreImpact: -5,
            feedback: "Change management is always a factor in transformation but concluding that IT spend is sufficient without reviewing the capability gaps first is premature. The customer feedback data points to specific capability investments that are clearly missing.",
          },
        ],
      },
      {
        id: "g14q2c",
        stage: "Business Case",
        question: "You have questioned whether the 25% digital target is strategically appropriate. The CEO intervenes: the 25% target is set and non-negotiable. Focus on how to get there. How do you redirect the engagement?",
        options: [
          {
            id: "a",
            text: "Acknowledge the target is set and immediately pivot to the root cause analysis — connecting the capability gap data to customer feedback to identify the specific operational investments needed to reach 25% digital revenue.",
            nextQuestionId: "g14q2a",
            scoreImpact: 10,
            feedback: "Good recovery. Accepting the strategic target and redirecting to the analytical work needed to achieve it is the right professional response. The CEO's direct intervention makes the pivot non-controversial.",
          },
          {
            id: "b",
            text: "Apologize for the strategic digression and request permission to restart the diagnostic from the beginning with a fresh focus on how to achieve the 25% target.",
            nextQuestionId: "g14q3a",
            scoreImpact: -5,
            feedback: "Restarting from the beginning is unnecessary — the analysis so far has value and the pivot can happen immediately. Excessive apology and restart signals lack of confidence and wastes the client's time.",
          },
          {
            id: "c",
            text: "Note the strategic concern for future discussion and immediately deliver the capability gap analysis connecting customer feedback to specific operational investments needed for the 25% target.",
            nextQuestionId: "g14q2a",
            scoreImpact: 15,
            feedback: "Smooth recovery. Flagging the concern briefly without dwelling on it and pivoting immediately to useful analysis is the most professional handling of this situation.",
          },
        ],
      },
      {
        id: "g14q3a",
        stage: "Transformation Roadmap",
        question: "You have established the $1.9B lost revenue opportunity. Now design the transformation roadmap. What should the sequence of investments be and why?",
        exhibit: {
          type: "table",
          title: "Transformation Initiative Options",
          data: `| Initiative                  | Investment | Revenue Benefit | Timeline  |
|----------------------------|------------|-----------------|-----------|
| RFID inventory accuracy     | $45M       | $180M/yr        | 12 months |
| Click-and-collect all stores| $28M       | $145M/yr        | 6 months  |
| Same-day delivery 50 stores | $65M       | $280M/yr        | 12 months |
| Mobile app redesign         | $38M       | $165M/yr        | 6 months  |
| Ship-from-store all stores  | $120M      | $420M/yr        | 18 months |
| Total                       | $296M      | $1,190M/yr      |           |`,
        },
        options: [
          {
            id: "a",
            text: "Sequence: RFID inventory accuracy first since it is the foundation for click-and-collect and same-day delivery; then click-and-collect and app redesign in parallel as they are both relatively fast and high-ROI; then same-day delivery once inventory is reliable; then ship-from-store last as the most complex and expensive.",
            nextQuestionId: "g14q4a",
            scoreImpact: 20,
            feedback: "Correct sequencing logic. RFID as the foundation is essential — launching click-and-collect with 71% inventory accuracy means 29% of orders fail at pickup, destroying the customer experience. The remaining sequencing correctly prioritizes by speed-to-revenue and complexity.",
          },
          {
            id: "b",
            text: "Sequence: mobile app redesign first as it is the fastest and most visible digital improvement; then click-and-collect; then RFID; then same-day delivery and ship-from-store last.",
            nextQuestionId: "g14q4b",
            scoreImpact: -10,
            feedback: "Leading with the mobile app while inventory accuracy is 71% means improving the customer's ability to browse products they then cannot reliably pick up or receive. App improvements built on broken fulfillment infrastructure produce negative customer experiences.",
          },
          {
            id: "c",
            text: "Launch all five initiatives simultaneously to maximize speed to the 25% digital revenue target — parallel implementation minimizes total transformation timeline.",
            nextQuestionId: "g14q4c",
            scoreImpact: -5,
            feedback: "Simultaneous launch of five major technology initiatives overloads implementation capacity and creates technical dependencies — ship-from-store requires RFID to work reliably. Parallel streams that ignore sequencing dependencies produce integration failures.",
          },
        ],
      },
      {
        id: "g14q3b",
        stage: "Transformation Roadmap",
        question: "You have been focused on NPS or benchmarking. The COO asks directly: what are the three most important investments for getting to 25% digital revenue and in what order?",
        options: [
          {
            id: "a",
            text: "RFID inventory accuracy first — foundation for everything; click-and-collect rollout to all 180 stores second — fastest path to digital revenue with 92% category adoption versus RetailMax's 16%; same-day delivery third — directly addresses the 54% of customers who cite inability to get products same-day.",
            nextQuestionId: "g14q4a",
            scoreImpact: 15,
            feedback: "Good recovery. The three investments are correctly identified and correctly sequenced. The rationale for each — foundation, fastest revenue, primary customer pain — gives the COO the business logic behind the prioritization.",
          },
          {
            id: "b",
            text: "Mobile app redesign first, then marketing investment to drive awareness of digital channels, then click-and-collect — these three together address the digital visibility and accessibility gaps.",
            nextQuestionId: "g14q4b",
            scoreImpact: -10,
            feedback: "Marketing investment without fixing the fulfillment foundation will drive traffic to a broken experience. This sequence ignores the inventory accuracy problem that makes digital fulfillment unreliable.",
          },
          {
            id: "c",
            text: "Ship-from-store first since it has the highest revenue benefit at $420M annually and enables both same-day delivery and buy-online-ship-from-store at scale across all 180 locations.",
            nextQuestionId: "g14q4c",
            scoreImpact: -5,
            feedback: "Ship-from-store at 71% inventory accuracy means 29% of ship-from-store orders fail because the item is not actually in the store despite showing as available. RFID accuracy must precede ship-from-store deployment.",
          },
        ],
      },
      {
        id: "g14q3c",
        stage: "Transformation Roadmap",
        question: "The COO is skeptical of the app-led approach you have suggested. He says: we redesigned the app two years ago and it did not move digital sales. What is actually different this time?",
        options: [
          {
            id: "a",
            text: "The COO is right that app redesign alone did not work. This time the transformation must lead with inventory infrastructure — RFID accuracy and fulfillment capability — so that the app has reliable inventory data to show customers. App improvements only work when the fulfillment system behind them works.",
            nextQuestionId: "g14q3a",
            scoreImpact: 15,
            feedback: "Good recovery. The COO's historical experience validates the sequencing lesson — app improvements built on broken fulfillment infrastructure fail. This time the foundation comes first. The redirect to the correct sequence is the right analytical response.",
          },
          {
            id: "b",
            text: "This time is different because the new app will use AI-powered personalization and a redesigned UX that better matches competitor digital experiences, addressing the root causes of the prior app's underperformance.",
            nextQuestionId: "g14q4b",
            scoreImpact: -10,
            feedback: "Arguing that the new app will succeed where the previous one failed, without addressing the COO's core insight that app redesigns have not worked, is not persuasive. The prior failure was likely because the fulfillment infrastructure was not fixed — not because the UX was wrong.",
          },
          {
            id: "c",
            text: "Acknowledge that app redesign alone is insufficient and propose adding a fulfillment reliability component — same-day delivery from select stores — as the differentiating addition to the prior app-led approach.",
            nextQuestionId: "g14q3a",
            scoreImpact: 10,
            feedback: "Partial recovery. Acknowledging the app-only failure and adding fulfillment is an improvement, but still misses that inventory accuracy must be the first investment — same-day delivery without RFID creates unreliable promise fulfillment.",
          },
        ],
      },
      {
        id: "g14q4a",
        stage: "Business Case",
        question: "The CTO asks: what does the full $296M transformation investment return in revenue and does it get RetailMax to the 25% digital target?",
        options: [
          {
            id: "a",
            text: "$296M investment generating $1,190M in annual revenue benefit equals a 4x first-year return and payback in under four months. Adding $1,190M to the current $1B digital revenue gives approximately $2.19B in digital revenue — 26% of the $8.4B total base, just above the 25% target.",
            nextQuestionId: "g14q5a",
            scoreImpact: 20,
            feedback: "Correct and complete financial summary. 4x first-year return with sub-4-month payback is highly compelling for a CTO budget approval. The 26% digital share confirms the 25% target is achievable with this program — giving both the CTO and CEO what they need to approve.",
          },
          {
            id: "b",
            text: "The $1,190M revenue benefit is theoretical maximum — a realistic estimate accounting for implementation delays and partial adoption would be 50-60% of this, or $595-714M, reaching 19-20% digital share rather than 25%.",
            nextQuestionId: "g14q5b",
            scoreImpact: -5,
            feedback: "Applying a 50% haircut without specific basis reduces a compelling business case unnecessarily. The $1,190M estimate already reflects realistic adoption curves from comparable retail transformations. General risk discounting without specific assumptions is not rigorous.",
          },
          {
            id: "c",
            text: "The ROI analysis cannot be completed without a detailed implementation timeline and store-by-store revenue impact model for each initiative — the aggregate numbers presented are insufficient for a CTO capital approval.",
            nextQuestionId: "g14q5b",
            scoreImpact: -10,
            feedback: "The aggregate financial summary presented is exactly what a CTO capital approval presentation requires. Demanding a store-by-store model before presenting aggregate numbers delays the business case without adding proportional analytical value.",
          },
        ],
      },
      {
        id: "g14q4b",
        stage: "Business Case",
        question: "Your transformation sequencing led with the app rather than the foundation. The COO says: we tried app-first before and it did not work. Why should we invest $296M this time? How do you recover?",
        options: [
          {
            id: "a",
            text: "The COO is right that app-first failed. The correct sequence this time is RFID inventory accuracy first — building the data foundation that makes digital fulfillment reliable. The app improvement sits on top of this foundation and works only when inventory accuracy supports it.",
            nextQuestionId: "g14q5a",
            scoreImpact: 15,
            feedback: "Good recovery. Acknowledging the prior failure, identifying the correct root cause, and presenting the right sequence gives the COO the answer he needed. He approves proceeding to the detailed plan.",
          },
          {
            id: "b",
            text: "This time is different because the $296M investment is significantly larger than prior digital investments, giving RetailMax the scale needed to achieve a real transformation rather than incremental improvements.",
            nextQuestionId: "g14q5b",
            scoreImpact: -10,
            feedback: "More money invested in the same sequence that failed before will produce the same result. The COO's concern is about the approach, not the investment level. This response misses the insight.",
          },
          {
            id: "c",
            text: "Agree with the COO's skepticism and recommend commissioning a pilot of three stores to test all five initiatives before committing to the full $296M program across all 180 locations.",
            nextQuestionId: "g14q5b",
            scoreImpact: 5,
            feedback: "A pilot is overly cautious given the urgency of the digital gap and the lost $1.9B in annual revenue. The sequence correction — leading with RFID — is the key change that addresses the prior failure. A pilot delays the answer by 12 months unnecessarily.",
          },
        ],
      },
      {
        id: "g14q4c",
        stage: "Business Case",
        question: "Your transformation sequencing ignored technical dependencies. The technology team says ship-from-store cannot work reliably at 71% inventory accuracy. How do you redesign the roadmap?",
        options: [
          {
            id: "a",
            text: "Correct the sequencing: RFID inventory accuracy in phase one, then click-and-collect and same-day delivery in phase two once inventory is reliable at 90%+, then ship-from-store and unified commerce in phase three. The $296M total investment and $1,190M revenue benefit remain the same — only the sequence changes.",
            nextQuestionId: "g14q5a",
            scoreImpact: 15,
            feedback: "Clean sequence correction. Acknowledging the dependency error and restating the correct order with the same financial case is the right move. The financial case is preserved while the implementation plan is fixed.",
          },
          {
            id: "b",
            text: "Accept the technical limitation and remove ship-from-store from the roadmap since it is the most complex and expensive initiative and the dependency makes it too risky.",
            nextQuestionId: "g14q5b",
            scoreImpact: -10,
            feedback: "Removing the highest-revenue initiative ($420M annually) from the roadmap because of a sequence error that can be fixed is an overreaction. The solution is to fix the sequence, not eliminate the initiative.",
          },
          {
            id: "c",
            text: "Propose running RFID and ship-from-store in parallel — as RFID accuracy improves from 71% toward 94%, gradually expand ship-from-store to locations where accuracy is already above 85%.",
            nextQuestionId: "g14q5a",
            scoreImpact: 10,
            feedback: "Parallel deployment with accuracy-based geographic rollout is a practical implementation approach. It is more complex to manage but allows faster time-to-revenue for ship-from-store in locations where accuracy is already adequate.",
          },
        ],
      },
      {
        id: "g14q5a",
        stage: "Final Recommendation",
        question: "The CTO asks for the transformation roadmap in three phases with investment and revenue impact for each phase.",
        options: [
          {
            id: "a",
            text: "Phase one: RFID inventory accuracy across all 180 stores — $45M, 12 months, $180M annual savings. Phase two: click-and-collect all stores plus same-day delivery at 50 stores — $93M combined, 12 months, $425M annual revenue lift. Phase three: ship-from-store and unified commerce — $158M, 18 months, $585M annual revenue. Total: $296M for $1,190M annual benefit reaching 26% digital share.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Excellent structured presentation. Three phases with specific investments, specific timelines, and specific revenue impacts for each. The total reconciles cleanly. The 26% digital share number closes the loop to the CEO's 25% target. The CTO approves proceeding to detailed project planning.",
          },
          {
            id: "b",
            text: "The transformation should be presented as a single integrated program rather than three phases since customers experience RetailMax as one brand and do not benefit from a phased approach.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Phasing is an internal implementation methodology, not a customer experience issue. The CTO asked specifically for a phased roadmap and the technical dependencies between initiatives make phasing mandatory regardless of how customers experience the brand.",
          },
          {
            id: "c",
            text: "Recommend reducing the total investment to $150M focused on the highest-ROI initiatives only — RFID and click-and-collect — to prove the model before committing the full $296M.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "A reduced first-phase investment is a reasonable capital management approach, but the business case for $296M with 4x ROI is compelling enough to justify the full program. The CEO needs to reach 25% digital share in two years — $150M may not get there in the required timeline.",
          },
        ],
      },
      {
        id: "g14q5b",
        stage: "Final Recommendation",
        question: "Your roadmap has been inconsistent. The partner gives you one final opportunity before the CTO presentation. What is the correct transformation roadmap?",
        options: [
          {
            id: "a",
            text: "Three phases: RFID accuracy first ($45M, foundation), click-and-collect and same-day delivery second ($93M, fastest revenue), ship-from-store and unified commerce third ($158M, full capability). Total $296M for $1,190M annual revenue benefit reaching 26% digital share in 24 months.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Strong recovery. The correct phases with correct sequencing, investment levels, and financial outcomes. The partner says: that is the presentation — lead with the sequence rationale and close with the 26% digital share outcome.",
          },
          {
            id: "b",
            text: "The transformation is too complex to summarize in three phases — recommend commissioning a detailed project plan before presenting to the CTO to ensure each initiative's dependencies are fully mapped.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "A three-phase roadmap is exactly the right level of abstraction for a CTO presentation. Detailed project planning comes after executive approval, not before. Refusing to present without a full project plan delays approval unnecessarily.",
          },
          {
            id: "c",
            text: "Focus only on phase one — RFID inventory accuracy at $45M — and propose returning with phases two and three after demonstrating phase one success to build confidence.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "A phase-one-only recommendation is too conservative given the urgency of the digital gap. The CTO needs to see the full roadmap to understand how phase one fits into the larger plan — approving only phase one without the full picture may result in under-funding the complete transformation.",
          },
        ],
      },
    ],
  },
  
];