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

];