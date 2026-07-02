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
    sampleRecommendation: "Launch a demand-based labor scheduling program at the 100 new locations, targeting a reduction from 35% to 26% labor-to-revenue within 90 days. This single action recovers an estimated $40M in annual contribution margin and is the largest, most controllable cost lever in the diagnostic, one that new location management can begin implementing this week.",
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
        context: "Your approach in this first hour will shape the entire engagement. There is no single correct answer, think about what gives you the most useful information before sitting down with the client.",
        options: [
          {
            id: "a",
            text: "Pull the last two years of P&L data and break every line into dollar and percentage change.",
            nextQuestionId: "g1q2a",
            scoreImpact: 15,
            feedback: "Good instinct. You pull the P&L and immediately see COGS up $43M and labor up $32M against only $50M in revenue growth. The cost picture is clear before the meeting starts and you have data rather than hypotheses.",
          },
          {
            id: "b",
            text: "Build a structured profit-equals-revenue-minus-costs framework slide with every line decomposed, so the client sees a rigorous approach from minute one and understands how you intend to work through the problem over the coming weeks.",
            nextQuestionId: "g1q2b",
            scoreImpact: 5,
            feedback: "A clean framework slide shows structure but delays data analysis. You walk in organized but without numbers. The CFO immediately asks which cost line is the problem and you have no answer yet.",
          },
          {
            id: "c",
            text: "Spend the hour researching competitor pricing and store openings, since the CEO raised competition and he's the client you most need on side.",
            nextQuestionId: "g1q2c",
            scoreImpact: -5,
            feedback: "Revenue is up 12%. If competition were the primary driver, revenue would be flat or declining. The CEO's hypothesis does not fit the symptom. You walk in with context but without the cost picture that matters most here.",
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
            text: "Are these increases spread evenly across all 300 stores, or concentrated in the 100 opened in the last two years?",
            nextQuestionId: "g1q3a",
            scoreImpact: 20,
            feedback: "This is the most diagnostic question in the dataset. If new locations are driving the increases, the problem is expansion-related inefficiency, very different from a systemic failure across the mature chain.",
          },
          {
            id: "b",
            text: "What happened to coffee and dairy commodity prices over this period? Those inputs are the most obvious candidate behind a COGS jump this size.",
            nextQuestionId: "g1q3b",
            scoreImpact: 10,
            feedback: "Commodity investigation is valid. The client confirms coffee prices rose 18% and dairy 22%, but BrewCo COGS rose 34%. The gap between commodity inflation and total COGS growth is important and needs explaining.",
          },
          {
            id: "c",
            text: "Have menu prices kept pace with cost inflation, and if there's a gap, how big is it relative to what we're seeing on this P&L?",
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
            text: "Ask the CFO to walk the room through the labor numbers, specifically whether the increase is proportional to new-store growth or running ahead of revenue growth.",
            nextQuestionId: "g1q3a",
            scoreImpact: 15,
            feedback: "Good recovery. The CFO shares that new locations run at 35% labor-to-revenue versus 23% for mature locations. This single data point gives both executives a piece of the answer and anchors the rest of the diagnostic.",
          },
          {
            id: "b",
            text: "Back the CEO's read of the situation, noting 12% revenue growth signals underlying business health and framing the cost run-up as a temporary byproduct of the expansion phase that will normalize once the new units mature.",
            nextQuestionId: "g1q3c",
            scoreImpact: -10,
            feedback: "Siding with an executive without data is a credibility mistake. The CFO is visibly frustrated. You recover later by asking for the numbers, but you have already lost credibility with the person who holds the cost data you need.",
          },
          {
            id: "c",
            text: "Suggest both views may have merit and propose splitting the analysis into revenue drivers and cost drivers before concluding anything.",
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
            text: "BrewCo left pricing on the table versus peers. Recommend a 5-8% price increase to close the gap and rebuild margin.",
            nextQuestionId: "g1q3c",
            scoreImpact: -5,
            feedback: "You found a revenue opportunity but have not diagnosed why costs grew three times faster than revenue. The CFO says pricing is not the problem, the cost reports are showing something the revenue picture is hiding.",
          },
          {
            id: "b",
            text: "It partly explains the revenue side, but it doesn't explain why COGS and labor grew 34% and 29% against 12% revenue growth. The cost structure needs a harder look than pricing does.",
            nextQuestionId: "g1q3a",
            scoreImpact: 10,
            feedback: "Good self-correction. You redirect to the cost question and the client shares a breakdown showing new locations are running at significantly higher cost ratios than mature ones.",
          },
          {
            id: "c",
            text: "This confirms competitors forced BrewCo to hold the line on price, which created a structural margin squeeze rooted in the competitive market rather than in anything internal to how the business is being run.",
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
            text: "Labor easing with volume, sure, that's plausible. But a 38% COGS ratio isn't the kind of thing that fixes itself just by waiting. Two different problems, two different fixes.",
            nextQuestionId: "g1q4a",
            scoreImpact: 20,
            feedback: "Excellent nuance. You have correctly separated the two cost problems. Labor efficiency does improve with transaction volume, but COGS ratio gaps are often structural, driven by product mix or supplier terms that require active management to fix.",
          },
          {
            id: "b",
            text: "Side with the CEO. Published industry benchmarks put new-unit maturation at 18-24 months, so the board should hold off on intervention until that window plays out.",
            nextQuestionId: "g1q4b",
            scoreImpact: -5,
            feedback: "Maturation is real, but give it time is not a recommendation when the company is losing $48M in profit annually. The CFO needs action, not patience. The partner asks what management can actually do in the next 90 days.",
          },
          {
            id: "c",
            text: "Push back hard. New locations should hit mature-location cost standards now, not in 18 months, starting with headcount cuts at the 35%-labor sites.",
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
            text: "Coffee and dairy grew 65% against 18-22% commodity inflation, that gap deserves a hard look at supplier terms and purchasing efficiency, not just volume from new stores.",
            nextQuestionId: "g1q4a",
            scoreImpact: 15,
            feedback: "Correct focus. The procurement team confirms that supplier contracts were renegotiated hurriedly during rapid expansion and BrewCo lost pricing leverage. Volume alone does not explain the 65% growth in this single category.",
          },
          {
            id: "b",
            text: "Highlight the waste reduction from $16M to $6M as a genuine win worth celebrating, and recommend rolling that same program out across every other cost category as the fastest route to margin recovery.",
            nextQuestionId: "g1q4b",
            scoreImpact: 0,
            feedback: "The waste program saved $10M, which is real but dwarfed by the $35M gap in coffee and dairy costs. Focusing on the one area that is working well while the larger problem persists is a misallocation of analytical attention.",
          },
          {
            id: "c",
            text: "Packaging grew 22%, right in line with inflation, which proves procurement is doing its job, so coffee and dairy must just be a volume effect from the new stores.",
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
            text: "Switch to costs now. Pull COGS and labor split mature versus new locations so we can tell expansion effect from something systemic.",
            nextQuestionId: "g1q3a",
            scoreImpact: 10,
            feedback: "Good course correction. You redirect to cost analysis and receive the location-level breakdown. New locations are running at significantly higher ratios and the diagnostic becomes much clearer from this point.",
          },
          {
            id: "b",
            text: "Stay with revenue and recommend a 7% chain-wide price increase to close the gap between cost growth and revenue growth, avoiding the need for any operational changes at the store level.",
            nextQuestionId: "g1q4c",
            scoreImpact: -10,
            feedback: "Recommending a price increase without completing the cost diagnosis is jumping to solutions. You still do not know which costs are elevated or why. The CFO says price increases have been tried and are not moving fast enough.",
          },
          {
            id: "c",
            text: "Ask for labor cost per transaction chain-wide. Rising means a productivity issue, flat means it's mostly volume and should ease on its own.",
            nextQuestionId: "g1q4a",
            scoreImpact: 5,
            feedback: "Good instinct. Labor cost per transaction at new locations is $3.03 versus $2.00 at mature locations, a 52% premium that is both a volume problem and a scheduling problem requiring active management.",
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
            text: "Launch labor scheduling optimization at new locations, target 28% labor-to-revenue within six months, renegotiate the top five supplier contracts covering 60% of coffee and dairy spend, and pause new openings until the current cohort reaches mature economics.",
            nextQuestionId: "g1q5a",
            scoreImpact: 20,
            feedback: "Strong recommendation. Specific, sequenced, and addresses both cost buckets identified in the diagnostic. The partner adds that pausing openings should be framed as portfolio optimization rather than stopping growth.",
          },
          {
            id: "b",
            text: "Close the bottom 20% of new locations by contribution margin, freeing up capital and management focus for the stronger 80%.",
            nextQuestionId: "g1q5b",
            scoreImpact: 5,
            feedback: "Closure is valid but drastic for locations averaging only 14 months old. The CEO asks how you know which ones will not recover with time and active management. You need a more nuanced framework than pure current performance ranking.",
          },
          {
            id: "c",
            text: "Raise chain-wide prices 8% to recover the margin gap outright, pairing it with the natural 12-18 month maturation curve already underway at new locations to bring margins back toward 12-15% without touching store operations.",
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
            text: "Labor easing to 32% shows maturation is doing some of the work, but COGS stuck at 38% points to a structural input-cost problem. Recommend supplier renegotiation and a product mix audit at new locations, running alongside the maturation path already in motion.",
            nextQuestionId: "g1q5a",
            scoreImpact: 10,
            feedback: "Good diagnosis even if delayed. Splitting the two problems and recognizing that labor will partially self-correct while COGS will not is the key insight. The client agrees to begin the supplier audit immediately.",
          },
          {
            id: "b",
            text: "Drop maturation as an explanation and recommend a flat 15% cost reduction across all 300 locations to get margins back to the pre-expansion baseline.",
            nextQuestionId: "g1q5b",
            scoreImpact: 0,
            feedback: "Blunt cost reduction across all locations would damage the 200 mature locations that are already performing well. A targeted approach focused specifically on new location inefficiencies is more precise and less risky.",
          },
          {
            id: "c",
            text: "Recommend the board bring in a new COO with food-service operations experience, since existing leadership hasn't been able to move these ratios.",
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
            text: "Labor scheduling optimization at the 100 new locations. The gap between 35% and 23% labor-to-revenue represents roughly $28M in recoverable annual savings, implementable in 60-90 days.",
            nextQuestionId: "g1q5a",
            scoreImpact: 15,
            feedback: "Clear prioritization and good recovery. The partner agrees this is the right recommendation. She adds that you should have gotten here earlier, but the recommendation itself is correct and actionable for the board.",
          },
          {
            id: "b",
            text: "A full review of the expansion strategy for the board, focused on why opening 100 stores this fast was the root cause of the current financial trouble.",
            nextQuestionId: "g1q5b",
            scoreImpact: -5,
            feedback: "Critiquing past decisions without a forward-looking recommendation is not actionable consulting. The 100 locations are already open and operating. The question the board needs answered is what to do now.",
          },
          {
            id: "c",
            text: "Fund a marketing push aimed at underperforming new locations. Higher transaction volume should fix the labor efficiency ratio on its own without touching store operations.",
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
            text: "Tie scheduling to actual transaction data, staffing follows projected demand curves instead of fixed shifts, so locations run full crews at peak and lighter crews off-peak. It's a productivity fix, not a headcount cut.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Excellent. This recommendation preserves customer experience during peaks while recovering cost during low-demand periods. It also builds a data-driven labor management culture that benefits all 300 locations long-term.",
          },
          {
            id: "b",
            text: "Cut one FTE per shift at new locations immediately and track customer satisfaction scores over the next 60 days to see whether service quality takes a visible hit.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "This reduces costs but risks service quality at the exact moment when new locations are building customer loyalty. A more precise scheduling approach avoids this tradeoff entirely.",
          },
          {
            id: "c",
            text: "Freeze hiring at new locations and let attrition bring headcount down gradually over 6-12 months.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Attrition-based reduction is slow and imprecise. You lose employees in unpredictable patterns rather than specifically where the labor savings are needed most. Better than immediate cuts but inferior to demand-based scheduling.",
          },
        ],
      },
      {
        id: "g1q5b",
        stage: "Implementation",
        question: "You have recommended closing some underperforming new locations. The CEO asks for the specific criteria, how do you decide which locations to close versus keep?",
        options: [
          {
            id: "a",
            text: "Close anything open more than 12 months that's still running negative contribution margin. Past that point, it isn't improving.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "12 months as a hard cutoff is cleaner than pure current performance, but misses trajectory. A location that is negative but improving rapidly may be worth keeping while a flat-but-barely-positive location in a declining market may not be.",
          },
          {
            id: "b",
            text: "Score every location on three factors, current contribution margin, six-month trajectory, and local market potential, and prioritize closure candidates that score poorly across all three, not just on current performance.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good framework. Using trajectory alongside current performance avoids closing locations that are struggling but improving. Market potential protects strategically important locations that simply need more time to build their customer base.",
          },
          {
            id: "c",
            text: "Offer franchisee operators a voluntary-exit window before any forced closures, to keep things low-friction and protect the broader franchisee relationship.",
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
            text: "Pull store-level P&L split new versus mature on Day 1 and let the cost data anchor the engagement instead of chasing the CEO's competitive hypothesis first.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Correct reflection. Following the client hypothesis rather than the data is a common associate mistake. COGS up 34% and labor up 29% against 12% revenue growth is a clear signal that should have redirected the analysis immediately.",
          },
          {
            id: "b",
            text: "Spend Week 1 interviewing more store managers to get a ground-level operational read before bringing any data-driven hypothesis to senior leadership.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Store manager interviews are valuable but secondary to the quantitative diagnosis. Understanding the why in the field is useful once you know where to look, starting there without a data anchor would have taken even longer to arrive at a conclusion.",
          },
          {
            id: "c",
            text: "Push the partner to get the CEO and CFO aligned on one shared hypothesis before any analysis starts, since their disagreement was what stalled the workstream.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "Executive alignment matters but the core problem was analytical, not political. The CEO-CFO disagreement was actually an opportunity to bring data into the room, which requires having the data prepared first.",
          },
        ],
      },
    ],
  },


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
    sampleRecommendation: "Yes, conditionally. The US restaurant pizza market is approximately $49B annually. SliceCo holds 0.37% share with unit economics of $750K per location, 21% above the $620K industry benchmark. National expansion to 1,000 locations at $750K average would mean $750M in revenue, a 4x opportunity while still holding under 2% of the total market. The condition is validating that Midwest unit economics replicate outside the region before committing to full national scale.",
    idealRecommendation: "SliceCo is an attractive investment. The US restaurant pizza market is approximately $48-51B. SliceCo at 0.37% share with above-average unit economics has enormous expansion headroom. National scale to 1,000 locations represents $750M revenue, a 4x opportunity in a large, stable market. Geographic replication of unit economics is the critical diligence question.",
    keyTakeaways: [
      "Always triangulate market sizing from two independent approaches and reconcile material differences between them",
      "Segment before you size, restaurant pizza and frozen pizza are different markets requiring different approaches",
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
            text: "Scope it to restaurant and delivery pizza only, no frozen, no retail. Then run two approaches, top-down from population and bottom-up from restaurant supply, and triangulate at the end.",
            nextQuestionId: "g2q2a",
            scoreImpact: 20,
            feedback: "Strong start. Defining scope and committing to triangulation are both marks of rigorous analysis. The partner nods and asks: good, what are your specific inputs going to be for each approach?",
          },
          {
            id: "b",
            text: "Just start running numbers, US population times pizza consumption frequency times average spend, and sanity-check whatever comes out against what you know about the industry.",
            nextQuestionId: "g2q2b",
            scoreImpact: 5,
            feedback: "Moving fast under time pressure is reasonable, but starting without defining scope risks sizing the wrong market. You produce a number quickly but the partner asks whether it includes frozen pizza and you realize you have not thought about the boundary.",
          },
          {
            id: "c",
            text: "Check with the partner first on what industry data or reports might already be available, since that would change which method makes the most sense to run.",
            nextQuestionId: "g2q2c",
            scoreImpact: 0,
            feedback: "In a case interview you always assume no external data unless told otherwise. Asking for data before attempting an estimate signals low analytical independence. The partner says: assume you have nothing, estimate it from first principles.",
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
            text: "US population at 330M, restaurant or delivery pizza occasions per person at 18-20 per year, and average spend per occasion of $13-15 with the pizza-only share at roughly 70%, netting out drinks and sides.",
            nextQuestionId: "g2q3a",
            scoreImpact: 15,
            feedback: "Clean decomposition. All three inputs are independently estimable and the pizza-only adjustment shows careful thinking about what counts as pizza market revenue versus beverage and side revenue on the same ticket.",
          },
          {
            id: "b",
            text: "US households at 127M, annual household pizza spend of $480-520 for pizza-ordering households, and the share of households ordering pizza at least monthly at around 55%.",
            nextQuestionId: "g2q3b",
            scoreImpact: 10,
            feedback: "Household-level sizing also works but introduces extra complexity. Estimating household pizza-ordering penetration is harder to anchor than per-capita frequency. Not wrong, but slightly more involved than the cleaner population-based approach.",
          },
          {
            id: "c",
            text: "75,000 pizza restaurants nationally split between national chains, regional players, and independents, with average annual revenue per restaurant of $600-650K depending on format, plus the dine-in versus delivery and carryout channel mix to sanity-check total volume.",
            nextQuestionId: "g2q3c",
            scoreImpact: 5,
            feedback: "This is actually a bottom-up supply-side approach rather than top-down. Both are valid but you committed to top-down first. The partner notes the inconsistency and says: this will be your cross-check. Go build the top-down first.",
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
            text: "30 occasions counts frozen and retail pizza too, a separate market. Stripping that out drops it to roughly $74B, and adjusting for the pizza-only share of the ticket at about 68% lands closer to $50B.",
            nextQuestionId: "g2q3a",
            scoreImpact: 15,
            feedback: "Good self-correction under pressure. Walking through the adjustments clearly and arriving at a defensible $50B is solid work. The partner says: much better. Now build the cross-check.",
          },
          {
            id: "b",
            text: "$119B could actually hold up if you define the pizza market broadly enough to include restaurants, delivery apps, frozen retail, school cafeteria pizza, corporate catering, and even ballpark and stadium concession sales as one comprehensive category.",
            nextQuestionId: "g2q3c",
            scoreImpact: -10,
            feedback: "Defending an inflated number without questioning the inputs is a serious red flag. The US total restaurant industry is roughly $900B, pizza at $119B would mean pizza represents 13% of all restaurant spending, which is not plausible.",
          },
          {
            id: "c",
            text: "30 occasions a year is probably high for the average American. Dropping it to 20 gives $79B, still on the high side but more believable.",
            nextQuestionId: "g2q3b",
            scoreImpact: 5,
            feedback: "Adjusting frequency downward is a valid move but misses the scope issue, frozen pizza is still included in the estimate. Frequency adjustment partially fixes the problem without fully resolving it.",
          },
        ],
      },
      {
        id: "g2q2c",
        stage: "Top-Down Sizing",
        question: "The partner confirms no data sources, pure estimation only. You begin your top-down estimate and arrive at $85B after 10 minutes. The partner says: that is too high. Show me the working and identify the error.",
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
            text: "35 occasions is more than once a week for every American, kids and seniors included. A realistic restaurant-only figure is 18-20 occasions a year for the adult population, bringing this to roughly $50B.",
            nextQuestionId: "g2q3a",
            scoreImpact: 10,
            feedback: "Good catch on the frequency assumption. The intuition check, more than once per week for every American, immediately exposes the error. Revised to $50B puts you in the right range.",
          },
          {
            id: "b",
            text: "62% for the restaurant adjustment is probably too conservative given delivery growth. Frozen pizza is closer to 25% of total occasions, not 38%, so pushing restaurant share up to 75% gives about $104B, which feels more in line with recent channel trends.",
            nextQuestionId: "g2q3c",
            scoreImpact: -5,
            feedback: "Adjusting one assumption to make the number feel more comfortable without questioning the frequency input is not rigorous. The frequency of 35 occasions is the real problem and $104B would still make pizza implausibly large as a share of total restaurant spending.",
          },
          {
            id: "c",
            text: "$12 average spend is too low, delivery orders alone average $25-30. Pushing spend up would raise the estimate further, which tells me the whole framework needs restructuring, not just this one input.",
            nextQuestionId: "g2q3b",
            scoreImpact: -10,
            feedback: "Revising spend upward moves the estimate in the wrong direction, it is already too high. This compounds the error. The problem is frequency, not spend, and the next revision should address that.",
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
            text: "Apply one flat average, $600K, across all pizza operations without splitting chains from independents. 78,000 times $600K is $46.8B, close enough to the top-down to call it validated.",
            nextQuestionId: "g2q4b",
            scoreImpact: 10,
            feedback: "A flat average gives a number in the right range. $46.8B is close to the $48-52B top-down estimate. The partner would prefer a segmented approach but accepts this as a reasonable cross-check under time pressure.",
          },
          {
            id: "b",
            text: "Use $1M per location as a general restaurant benchmark. 78,000 times $1M is $78B, suggesting the top-down number was actually too conservative and the real opportunity is bigger.",
            nextQuestionId: "g2q4c",
            scoreImpact: -5,
            feedback: "$1M is the average for full-service restaurants broadly, not pizza specifically. Small independent pizzerias and delivery operations bring the average well below $1M. This benchmark inflates the estimate and undermines the triangulation exercise.",
          },
          {
            id: "c",
            text: "Split it: large chains at $900K-$1M, independents at $400-500K. Weighted for the actual mix, that blends to about $620-650K. 78,000 times $635K is $49.5B.",
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
            text: "Give the partner a $48-70B range and let her weigh which end fits better given what she knows about the market.",
            nextQuestionId: "g2q4c",
            scoreImpact: 0,
            feedback: "A $22B range is too wide to be useful for an investment decision. Presenting both endpoints without diagnosing which assumption is wrong is analytically passive and does not give the partner what she needs.",
          },
          {
            id: "b",
            text: "A $22B gap this size means the household sizing over-counted somewhere, likely penetration rate or annual spend per household ran too high. The supply-side estimate is grounded in more observable restaurant economics, so that's the more trustworthy anchor.",
            nextQuestionId: "g2q4a",
            scoreImpact: 15,
            feedback: "Good triangulation discipline. Recognizing that the supply-side estimate is grounded in more directly observable data. Because restaurant revenue is more measurable than household survey estimates, is mature analytical thinking.",
          },
          {
            id: "c",
            text: "The higher top-down number is probably closer to reality since consumer spending surveys tend to under-report frequency and spend. Going with $65B as the final figure.",
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
            text: "330M people, 18 restaurant or delivery pizza occasions a year, $8.50 net pizza revenue per occasion. That's $50.4B, within 4% of the $48.4B bottom-up.",
            nextQuestionId: "g2q4a",
            scoreImpact: 10,
            feedback: "Clean top-down built quickly under pressure. $50.4B versus $48.4B is a 4% difference, excellent triangulation that validates the estimate confidently.",
          },
          {
            id: "b",
            text: "The bottom-up number, grounded in actual restaurant economics, is already more reliable than anything I could build from a quick population estimate in the time left.",
            nextQuestionId: "g2q4b",
            scoreImpact: 5,
            feedback: "Bottom-up is indeed well-grounded, but declining to cross-check when the partner explicitly asks is not the right response. You should attempt the top-down even imperfectly.",
          },
          {
            id: "c",
            text: "330M times 30 occasions times $12 spend is $119B, adjusted 60% for restaurant-only gives $71B. That doesn't line up well, so split the difference and call it $60B.",
            nextQuestionId: "g2q4c",
            scoreImpact: -5,
            feedback: "The 30 occasions figure includes frozen pizza and is too high for restaurant-specific sizing. Taking a midpoint between a correct and an incorrect estimate is not analytically sound, it masks an input error that should be corrected.",
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
            text: "That's roughly 0.37% of a $49B market. Their $750K average revenue per location runs 21% above the $620K industry average. Scaling to 1,000 locations at that same $750K would put revenue at $750M, a 4x jump while still under 2% share.",
            nextQuestionId: "g2q5a",
            scoreImpact: 20,
            feedback: "Excellent. You converted the market size into a specific strategic insight. The unit economics comparison is particularly strong, above-average performance per location is exactly the signal PE investors want before backing a scaling strategy.",
          },
          {
            id: "b",
            text: "SliceCo is tiny, 0.37% share in a market Domino's and Pizza Hut dominate. Getting to meaningful national share against those incumbents from a regional base is going to be an uphill fight.",
            nextQuestionId: "g2q5b",
            scoreImpact: 0,
            feedback: "The competitive concern is valid context but misses the strategic framing entirely. 0.37% share in a $49B market means there is enormous expansion room without ever significantly displacing the incumbents. The framing should emphasize opportunity, not just competition.",
          },
          {
            id: "c",
            text: "At $180M and 0.37% share, SliceCo just isn't at the scale PE typically wants for a national play. The firm should look at bigger targets that already have national footprint.",
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
            text: "$49B as the central estimate, with a footnote flagging a $46-53B range depending on how delivery-only operations get counted. Commit to $49B as the headline number.",
            nextQuestionId: "g2q5a",
            scoreImpact: 15,
            feedback: "Exactly right. A central estimate with explicit uncertainty bounds is what IC decks require. Hiding the range would be misleading; refusing to give a single number would be unhelpful. The partner says: perfect, that is how you present a range with a view.",
          },
          {
            id: "b",
            text: "Give the full $46-53B range and let IC members pick whichever end matches their own read on the deal's risk and attractiveness.",
            nextQuestionId: "g2q5b",
            scoreImpact: 0,
            feedback: "Presenting the range without a view is analytically passive. IC members should not be selecting the market size estimate that fits their prior belief, the analyst's job is to make the call and defend it.",
          },
          {
            id: "c",
            text: "Round up to $55B so the deck shows a bigger addressable market and a more compelling multiple on invested capital, the uncertainty band gives enough room to justify leaning toward the upper bound.",
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
            text: "The error likely traces to frequency being set too high. For restaurant-specific sizing, anchor frequency to something concrete, like how often an adult actually orders restaurant pizza, then annualize.",
            nextQuestionId: "g2q5a",
            scoreImpact: 10,
            feedback: "Good post-mortem. Identifying the specific input error and proposing a concrete calibration for next time is how analysts improve. The partner says: exactly, frequency is the hardest input to get right in consumer market sizing.",
          },
          {
            id: "b",
            text: "30% off is within the acceptable range for this kind of exercise, the goal is order of magnitude, not precision.",
            nextQuestionId: "g2q5b",
            scoreImpact: 5,
            feedback: "True that exactness is not the goal, but a 30% miss without diagnosing the specific error is a missed learning opportunity. The partner wants you to identify what went wrong, not rationalize the result as acceptable.",
          },
          {
            id: "c",
            text: "I'd push back on the $46B figure itself, market definitions vary across research firms and trade associations, and my estimate may just be capturing adjacent channels, like stadium and workplace catering, that the industry number was scoped to exclude.",
            nextQuestionId: "g2q5c",
            scoreImpact: -5,
            feedback: "Defending a wrong estimate by questioning the benchmark is intellectually dishonest. In a real engagement you would use the industry data. The market sizing exercise exists precisely for when you do not have it. Learn from the error rather than explaining it away.",
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
            text: "Yes, with one condition. The $49B market and 0.37% current share with above-average unit economics support the thesis. Scaling to 1,000 locations at a 4x revenue multiple is credible here. The condition is confirming Midwest unit economics hold up outside the region before going to full national scale.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong final answer. Conditional yes with specific evidence, quantified upside, and the critical diligence question identified. This is the IC answer that gets funded and earns follow-on work.",
          },
          {
            id: "b",
            text: "Yes. Big market, strong unit economics, this is clearly a good fit for a national expansion play from a PE return standpoint.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Directionally right but lacks the specific quantification that makes an IC recommendation compelling. Large and growing is vague, $49B at 0.37% share with a 4x upside to 2% is the specific version of that statement.",
          },
          {
            id: "c",
            text: "Maybe, there's too much still unknown about geographic replication and competitive response to give a confident view at this stage of diligence.",
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
            text: "$49B as the central estimate, invest recommendation contingent on geography validation. The uncertainty doesn't change the order of magnitude of the opportunity or the strength of the unit economics.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good recovery. Committing to a number and a view while being transparent about residual uncertainty is exactly what IC presentations require from an analyst.",
          },
          {
            id: "b",
            text: "Recommend the IC hold off and commission additional primary research first, the sizing uncertainty is too high to underwrite responsibly right now.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Calling for more research when the IC is ready to decide is a consulting failure. You had the tools to size this market. Own the estimate and make the recommendation.",
          },
          {
            id: "c",
            text: "Ask the IC what market size figure would make this deal compelling to them, then quietly check whether your $49B estimate lands above or below that internal bar before presenting it back as your own independently derived conclusion.",
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
            text: "Recommend against it, the sizing uncertainty makes it too hard to underwrite the expansion thesis with any real confidence.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Market sizing uncertainty is a normal feature of early-stage diligence. PE firms invest under imperfect information constantly. The recommendation should be driven by evidence, not by analyst confidence in a single estimate.",
          },
          {
            id: "b",
            text: "Sizing aside, the real signal is unit economics: $750K per location is 21% above the industry average. Recommend conditional investment, with geography validation as the first diligence step.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Good recovery. Redirecting to the most reliable data point, unit economics, and giving a clear conditional recommendation despite sizing imprecision is the right approach. The partner says: the unit economics are the real insight here.",
          },
          {
            id: "c",
            text: "Leave the call to the PE partner, she has more context on the thesis, more experience with regional retail rollouts, and is simply better placed to decide than an analyst whose own market sizing missed the mark by a wide margin.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "Deferring to the partner because your analysis was imperfect is not acceptable. Every analyst operates under uncertainty. The job is to synthesize available evidence into the best possible recommendation, not to withhold a view when it is imperfect.",
          },
        ],
      },
    ],
  },

  {
    id: "g3",
    title: "PageTurner: Bookstore Margin Crisis",
    type: "profitability",
    difficulty: "beginner",
    firm: "deloitte",
    estimatedMinutes: 22,
    overview: "A regional bookstore chain has seen profit margin fall from 10% to 3% over three years while revenue remained flat. Deloitte has been asked to diagnose the issue and present recommendations before a board meeting.",
    clientBackground: "PageTurner operates 85 bookstores across the Southeast US. Revenue has been stable at $420M for three years. Net profit fell from $42M to $12.6M, a $29M decline. The CEO believes the Amazon competitive dynamic is the root cause. The CFO believes lease renewals are destroying profitability. The board convenes in one week.",
    yourRole: "You are a Deloitte consultant on your second engagement. The senior manager needs a clear diagnosis and two actionable recommendations before the board meeting.",
    startQuestionId: "g3q1",
    finalRecommendationPrompt: "What are your two most important recommendations to PageTurner's board? Be specific about expected financial impact for each.",
    sampleRecommendation: "First, exit or renegotiate the 15-20 highest-cost renewed leases, occupancy costs grew $18M representing 62% of the profit decline, driven by 38 lease renewals at nearly double prior rates. Targeting bottom-quartile locations by contribution margin could recover $12-16M annually. Second, audit the gift and café category mix added to offset declining book revenue, since the margin gap versus books explains $3-5M of the remaining profit decline.",
    idealRecommendation: "Two recommendations: (1) Exit or renegotiate the bottom 15-20 high-cost renewed locations, occupancy costs grew $18M (+47%) driven by 38 renewals at 2x prior rates. Estimated annual recovery: $14-18M. (2) Audit category mix, book revenue replaced by lower-margin gifts and café dilutes gross margin by an estimated $3-5M annually. Together these two actions address over 80% of the total $29M profit decline.",
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
        question: "Revenue is flat at $420M but profit fell from $42M to $12.6M, a $29M decline over three years. The CEO blames Amazon. The CFO blames leases. You have 30 minutes before the client call. What do you prioritize?",
        options: [
          {
            id: "a",
            text: "Pull the full three-year P&L and rank every cost line by dollar change before the meeting.",
            nextQuestionId: "g3q2a",
            scoreImpact: 15,
            feedback: "Right instinct. The P&L breakdown shows occupancy up $18M (+47%), COGS up $8M (+3%), and labor up $4M (+6%). The occupancy increase stands out, 47% growth on a cost line for a chain with the same number of stores is immediately suspicious.",
          },
          {
            id: "b",
            text: "Research Amazon's impact on the US bookstore industry's revenue trends so you have outside context on the CEO's hypothesis walking into the meeting.",
            nextQuestionId: "g3q2b",
            scoreImpact: 0,
            feedback: "Amazon research gives relevant context, but revenue is flat, not declining. If Amazon were the primary driver, revenue would have fallen. You walk in with industry context but without the cost picture that matters most here.",
          },
          {
            id: "c",
            text: "Ask the senior manager what her working hypothesis is first, since she's been on this longer and it'll help you ask sharper questions on the call.",
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
            text: "Ask the CFO for lease renewal specifics, how many renewed and at what rate. If 38 leases renewed at $1.1M versus $560K before, that's $20.5M in added annual cost, which alone covers the $18M occupancy increase.",
            nextQuestionId: "g3q3a",
            scoreImpact: 20,
            feedback: "Excellent diagnostic instinct. The lease data confirms 38 renewals at nearly double the prior rate. This is the primary driver and it is an actionable problem. The CFO is right, though the CEO's Amazon concern may explain why revenue is not growing to offset it.",
          },
          {
            id: "b",
            text: "Ask for a revenue breakdown by category. If book sales are declining and being backfilled by lower-margin gift and café revenue, the CEO's Amazon concern might be hiding inside a flat top line.",
            nextQuestionId: "g3q3b",
            scoreImpact: 10,
            feedback: "Category mix is a valid inquiry. The data shows book revenue fell $22M and was replaced by gift, café, and event revenue at 5-8 percentage points lower gross margin. This is a real contributor though smaller than occupancy in dollar terms.",
          },
          {
            id: "c",
            text: "Tell both executives both factors are probably contributing and ask for two weeks to build a formal attribution model before the board meeting.",
            nextQuestionId: "g3q3c",
            scoreImpact: -10,
            feedback: "Two weeks is not possible before a board meeting in one week. Both are contributing without quantification is not useful analysis. The senior manager steps in to redirect the conversation.",
          },
        ],
      },
      {
        id: "g3q2b",
        stage: "Data Analysis",
        question: "Your Amazon research shows the US bookstore industry fell 8% over the same three years, but PageTurner's revenue was flat. The CFO immediately says: we beat the market. The problem is costs. How do you respond?",
        options: [
          {
            id: "a",
            text: "Accept the point and move straight to the P&L. If revenue beat the industry trend and profit still collapsed, the cause has to be on the cost side.",
            nextQuestionId: "g3q3a",
            scoreImpact: 10,
            feedback: "Good recovery. Updating your view and pivoting to cost analysis is the right move. You are now on the correct track even though you started with the revenue side.",
          },
          {
            id: "b",
            text: "Push back gently: flat revenue against an 8% industry decline could mean PageTurner leaned on lower-margin categories to hold the line, hiding a margin problem inside a number that looks stable.",
            nextQuestionId: "g3q3b",
            scoreImpact: 15,
            feedback: "Excellent insight. You have connected the Amazon industry trend to a potential mix shift explanation, and you are right. PageTurner did add lower-margin categories to offset declining book sales. This is a sophisticated reading of flat revenue data.",
          },
          {
            id: "c",
            text: "Side with the CEO and recommend building out a full e-commerce and omnichannel fulfillment platform to compete directly with Amazon within 18 months, since that's clearly the underlying structural pressure facing the business long-term.",
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
            text: "Ask the client to walk through three years of cost changes line by line, hearing their view first before introducing any outside hypothesis.",
            nextQuestionId: "g3q3a",
            scoreImpact: 10,
            feedback: "Client-led cost walkthrough is a valid approach. The CFO immediately highlights the occupancy increase and the lease renewal data surfaces naturally in the conversation.",
          },
          {
            id: "b",
            text: "Lead directly with the lease hypothesis: our initial view is that lease renewals may be a primary driver, can you share the renewal count and rate changes?",
            nextQuestionId: "g3q3b",
            scoreImpact: 5,
            feedback: "Presenting a hypothesis as a question is fine. The client confirms leases are a factor, but they also reveal a category mix change that you might have missed if you only investigated the lease line.",
          },
          {
            id: "c",
            text: "Frame the whole engagement around competitive response to Amazon, since that's the concern the CEO raised and you want him bought into the process from the start.",
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
            text: "Push marketing spend at the high-cost stores hard enough to justify the new rent through added traffic, since higher revenue is the only lever available once a lease is signed.",
            nextQuestionId: "g3q4b",
            scoreImpact: 0,
            feedback: "Revenue growth at high-cost stores is directionally valid but slow and uncertain. At $1.1M in rent, a store needs roughly $4.4M in incremental revenue at current margins just to break even on the lease increase alone.",
          },
          {
            id: "b",
            text: "Three moves: require board approval for any future renewal above $800K, evaluate the 38 high-cost leases by contribution margin and exit the bottom 15-20 through subletting or early termination, and explore co-tenancy arrangements where two retailers share a location.",
            nextQuestionId: "g3q4a",
            scoreImpact: 20,
            feedback: "Excellent. Three concrete sequenced actions covering the immediate problem, the governance gap, and a creative structural option. The board will respond well to this combination of near-term fixes and governance improvements.",
          },
          {
            id: "c",
            text: "Shift all future lease renewals to 1-2 year terms instead of 5-7 year commitments, so this kind of exposure doesn't build up again.",
            nextQuestionId: "g3q4c",
            scoreImpact: 5,
            feedback: "Shorter lease terms is a sound governance recommendation but addresses only future renewals. The board needs both a near-term fix for the current $18M problem and a governance change, not just the governance change alone.",
          },
        ],
      },
      {
        id: "g3q3b",
        stage: "Root Cause",
        question: "Revenue breakdown reveals book revenue fell $22M and was replaced by gift, café, and event revenue. Gross margin on books is 42%. Gross margin on gifts is 34%. Gross margin on café is 28%. The CEO asks: we diversified deliberately to offset Amazon, are you saying we made a strategic mistake?",
        options: [
          {
            id: "a",
            text: "Not necessarily a strategic mistake, but the margin math wasn't modeled before launch. Swapping $22M of 42%-margin book revenue for 28-34%-margin gift and café revenue quietly costs $1.8-3M in gross profit a year.",
            nextQuestionId: "g3q4a",
            scoreImpact: 15,
            feedback: "Nuanced and credible. You acknowledge the strategic logic while identifying the implementation gap. This is how Deloitte consultants maintain credibility while delivering difficult news to a defensive client.",
          },
          {
            id: "b",
            text: "Yes, honestly, backfilling lost volume with lower-margin categories is a well-known retail death spiral. PageTurner should go back to a books-only focus and compete on curation and community instead.",
            nextQuestionId: "g3q4b",
            scoreImpact: -5,
            feedback: "Books-only is a strategic dead end given the Amazon dynamic. The CEO is right that diversification was necessary. The category selection was the execution problem, not the direction. This recommendation would almost certainly be rejected by the board.",
          },
          {
            id: "c",
            text: "The mix shift only explains $2-3M of the $29M total decline, it's a real but secondary factor compared to the lease cost problem. Occupancy is by far the bigger driver at $18M, and that's where the diagnostic focus and board time should go first.",
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
            text: "Amazon and lease costs are both contributing about equally, the board needs a dual response covering competitive positioning and operational cost management at the same time.",
            nextQuestionId: "g3q4b",
            scoreImpact: 0,
            feedback: "Amazon affects industry revenue and PageTurner's revenue is flat, Amazon is context, not the proximate driver of the profit decline. The P&L shows this is overwhelmingly a cost story. Dual response dilutes urgency around the actionable fix.",
          },
          {
            id: "b",
            text: "The primary finding is occupancy: 38 lease renewals at nearly double prior rates added $18M in cost, 62% of the decline. It's actionable, future renewals can be governed and high-cost locations exited now.",
            nextQuestionId: "g3q4a",
            scoreImpact: 10,
            feedback: "Good. Even arriving here late, clearly identifying the primary driver and quantifying its share of the total gives the board what they need. The senior manager says: that is the finding. Now build the two recommendations.",
          },
          {
            id: "c",
            text: "The real finding is that PageTurner needs a comprehensive e-commerce and digital fulfillment strategy before the underlying cost problem becomes secondary to the broader multi-year decline of physical bookselling as a retail category nationwide.",
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
            text: "One, require board approval for any lease renewal above $750K, and launch e-commerce within 12 months to compete with Amazon. Two, hire a CFO with retail real estate background.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "The lease governance policy addresses future renewals only and not the current $18M problem. E-commerce adds costs in the near term. A CFO hire is not a specific enough recommendation. The board will ask what you are doing about the existing 38 high-cost leases.",
          },
          {
            id: "b",
            text: "One, exit or renegotiate the 15-20 bottom-quartile high-cost locations by contribution margin, roughly $12-16M in annual savings. Two, rationalize the gift and café mix toward higher-margin adjacencies, roughly $4-6M in margin recovery.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong board presentation. Two specific recommendations each with quantified financial impact, addressing the two root causes identified in the analysis. The board approves proceeding to the implementation phase of the engagement.",
          },
          {
            id: "c",
            text: "One, raise book prices 10% across the portfolio to recover margin lost to the category shift, funding a loyalty program to offset customer pushback. Two, cut marketing spend 30% across the board since print media reach is declining anyway among core readers.",
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
            text: "Agree, closures should be a last resort. Focus instead on driving traffic to the weaker stores through events, community programming, and local marketing.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Capitulating to pushback without the quantitative counter-argument is not consulting. Community events are unlikely to generate the revenue growth needed to offset $18M in annual lease cost. The senior manager is visibly disappointed.",
          },
          {
            id: "b",
            text: "Lay out both paths, cost action and revenue investment, with financial models for each, and let the board pick based on their own risk tolerance.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Presenting options without a recommendation is weak consulting. The board hired Deloitte for a view, not a menu of choices. Quantifying both paths as supporting material is useful, but you should still make a recommendation.",
          },
          {
            id: "c",
            text: "Growing out of this would take roughly $97M in added revenue, a 23% increase at current margins, to recover the $29M decline. That's a heavy lift in a shrinking category. Cost action is faster and more controllable, and staff from closed stores can be redeployed to the stronger locations.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Quantifying the revenue growth needed to avoid cost action is exactly the right response to this pushback. $97M in a declining category is a sobering number. The board member who asked the question sits back visibly.",
          },
        ],
      },
      {
        id: "g3q4c",
        stage: "Recommendation",
        question: "Your engagement produced an e-commerce recommendation the CFO believes misses the point. The senior manager gives you one last opportunity: build me a two-slide board summary, one slide on diagnosis, one on recommendations, that actually addresses what the P&L shows.",
        options: [
          {
            id: "a",
            text: "Slide one, the $29M decline breaks down as 62% occupancy ($18M via 38 lease renewals at 2x prior rates) and 10% category mix shift toward lower-margin gifts and café. Slide two, exit high-rent locations and rationalize category mix.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Strong recovery. Clear attribution on diagnosis and two quantified actionable recommendations. This is what the engagement should have produced from the beginning. The senior manager says: this is what we needed three days ago.",
          },
          {
            id: "b",
            text: "Slide one, PageTurner faces dual pressure from Amazon competition and rising operating costs squeezing margins together. Slide two, a three-pronged response: e-commerce investment, lease governance, and targeted marketing.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "The vague dual-pressure diagnosis and three-pronged response dilutes urgency. Amazon competition is context, not the proximate cause. The board will struggle to prioritize three parallel initiatives without a clear primary recommendation.",
          },
          {
            id: "c",
            text: "Slide one, revenue is flat but total costs rose $29M, driven mainly by lease renewals across the portfolio and modest wage inflation layered on top of that. Slide two, cut costs through headcount reduction and a mandatory renegotiation clause targeting recovery of the full $29M decline.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Labor rose only $4M and is roughly in line with inflation, recommending headcount reduction based on a minor cost line creates employee relations risk without the evidence to justify it. The lease focus in recommendation two is right but the headcount element weakens the overall presentation.",
          },
        ],
      },
    ],
  },

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
    sampleRecommendation: "Yes. The US gym and fitness membership market is approximately $32-35B annually. FitNation at $168M holds roughly 0.5% share with unit economics of $1.4M per location, significantly above the $800K industry average. National expansion to 500 locations at similar economics would represent $700M in revenue, a 4x opportunity while holding under 2% of the total market. The critical diligence question is whether Texas and Oklahoma unit economics replicate in new geographies.",
    idealRecommendation: "FitNation is an attractive investment. The US gym membership market is approximately $32-35B. At 0.5% share with above-industry-average unit economics ($1.4M per location versus $800K benchmark), FitNation has significant national expansion headroom. The primary diligence question is geographic replication of unit economics.",
    keyTakeaways: [
      "Per-capita market sizing requires anchoring two key inputs, penetration rate and average spend per member, each of which must be estimated carefully",
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
            text: "Just start with US population times gym membership penetration times average annual fee, that's a clean enough top-down for a recurring-fee market like this.",
            nextQuestionId: "g4q2b",
            scoreImpact: 5,
            feedback: "Moving fast is fine under time pressure, but you have not defined scope, does this include boutique fitness studios, personal trainers, and fitness apps, or only traditional gyms? The partner asks immediately and you realize you need to clarify before calculating.",
          },
          {
            id: "b",
            text: "Scope it to traditional gym and fitness memberships only, no apps, no home equipment, then run top-down from adult population and bottom-up from facility count, triangulating at the end.",
            nextQuestionId: "g4q2a",
            scoreImpact: 20,
            feedback: "Strong structure. Defining scope precisely and committing to two approaches with triangulation is exactly right. The partner says: good, what are your specific inputs going to be?",
          },
          {
            id: "c",
            text: "Ask the partner whether boutique studios like SoulCycle and CrossFit boxes should count as part of the market before you commit to a calculation approach.",
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
            text: "260M US adults, gym membership penetration at 22%, roughly one in five adults, and an average annual fee of $600 blending budget chains with mid-market gyms.",
            nextQuestionId: "g4q3a",
            scoreImpact: 15,
            feedback: "Clean inputs. The penetration anchor of roughly one in five adults is well-grounded and the weighted average fee reflects the market structure well. This gives 260M times 22% times $600 equals $34.3B.",
          },
          {
            id: "b",
            text: "330M total US population, a 20% membership rate applied across everyone including children, and an $800 average fee reflecting premium gym pricing across the board.",
            nextQuestionId: "g4q3b",
            scoreImpact: 0,
            feedback: "Including children in the total population without adjusting downward inflates the addressable base. $800 overweights premium gyms, budget chains at $180 per year represent a large portion of memberships and must be included in the weighted average.",
          },
          {
            id: "c",
            text: "260M US adults, 35% penetration since fitness has gone fully mainstream post-pandemic with home workouts pushing people back toward group classes and staffed facilities, and $600 average fee, giving 260M times 35% times $600 equals $54.6B.",
            nextQuestionId: "g4q3c",
            scoreImpact: -5,
            feedback: "35% penetration means more than one in three American adults has a gym membership. This is too high, actual penetration data is closer to 20-22%. The partner asks you to pressure-test the penetration assumption before proceeding.",
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
            text: "It covers traditional gym and fitness studio memberships at physical facilities. It leaves out apps, home equipment, personal trainers outside facilities, and boutique studios, none of which I explicitly folded in.",
            nextQuestionId: "g4q3a",
            scoreImpact: 10,
            feedback: "Reasonable scope definition delivered after the fact. The partner notes that boutique studios like SoulCycle should be included since FitNation may compete for that customer. Your $34.3B estimate may be slightly conservative if boutiques add another $3-4B.",
          },
          {
            id: "b",
            text: "It covers everything fitness-related, gyms, studios, apps, home equipment, personal training, since all of it competes for the same fitness dollar under one broad definition.",
            nextQuestionId: "g4q3c",
            scoreImpact: -5,
            feedback: "A market this broad overstates what FitNation actually competes in. PE investors need the addressable market for a gym chain, not the total fitness economy which includes Peloton and personal trainers. The scope is too wide to be actionable.",
          },
          {
            id: "c",
            text: "It covers all fitness facility memberships at physical locations, traditional gyms, boutique studios, and fitness centers, which is the relevant competitive market for FitNation.",
            nextQuestionId: "g4q3a",
            scoreImpact: 15,
            feedback: "Good recovery. Defining scope clearly after the calculation still gives the partner what she needs. Physical facility memberships is the right boundary for FitNation's market and your $34.3B estimate is well-grounded at this scope.",
          },
        ],
      },
      {
        id: "g4q2c",
        stage: "Top-Down",
        question: "The partner confirms: include all fitness facility memberships, traditional gyms, boutique studios, and fitness centers. Now build the top-down estimate.",
        options: [
          {
            id: "a",
            text: "260M US adults, 25% penetration for all fitness facility memberships, a bit higher than traditional gyms alone since boutiques bring in incremental members, times $540 blended fee, roughly $35.1B.",
            nextQuestionId: "g4q3a",
            scoreImpact: 15,
            feedback: "Reasonable adjustment for the broader scope. The penetration bump to 25% accounts for boutique-only members who would not show up in traditional gym penetration data. $35.1B is a solid top-down estimate.",
          },
          {
            id: "b",
            text: "330M total US population, 22% overall penetration, $600 average fee, giving $43.6B for the full fitness facility market across all membership types including seasonal and corporate wellness program enrollees.",
            nextQuestionId: "g4q3b",
            scoreImpact: 5,
            feedback: "Using total population rather than adult population inflates the base since children under 18 are rarely individual gym members. The penetration rate should be applied to adults only for a more accurate estimate.",
          },
          {
            id: "c",
            text: "260M US adults, 30% penetration for the broader fitness facility market, $600 blended fee, giving $46.8B, which feels right given how much the fitness category has grown since the pandemic.",
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
            text: "41,000 US fitness facilities times a flat $800K average equals $32.8B, close to the top-down estimate, though a segmented average would sharpen this further.",
            nextQuestionId: "g4q4a",
            scoreImpact: 10,
            feedback: "$32.8B versus $34.3B top-down is a 4% difference, solid triangulation. Using a flat average is slightly less precise but the partner accepts it as a reasonable cross-check under time pressure.",
          },
          {
            id: "b",
            text: "Segment the 41,000 facilities: large chains like Planet Fitness and Equinox at $1.5M average, mid-market gyms at $750K, boutique studios at $400K. Weighted for the mix, that blends to roughly $800K. 41,000 times $800K is $32.8B.",
            nextQuestionId: "g4q4a",
            scoreImpact: 20,
            feedback: "Excellent segmented cross-check. The weighted average of $800K is well-justified and the $32.8B result triangulates well against the $34.3B top-down. Strong analytical rigor under time pressure.",
          },
          {
            id: "c",
            text: "Use $1.2M per facility, gyms are capital-intensive with high fixed costs and need significant revenue to break even. 41,000 times $1.2M gives $49.2B.",
            nextQuestionId: "g4q4c",
            scoreImpact: -5,
            feedback: "$1.2M per facility is too high, it overweights large premium chains and ignores the many small studios and budget gyms. The $49.2B result is significantly above the top-down and flags a benchmark problem rather than validating the estimate.",
          },
        ],
      },
      {
        id: "g4q3b",
        stage: "Bottom-Up Cross-Check",
        question: "Your top-down estimate is around $43B using total population rather than adults. The bottom-up using 41,000 facilities at $800K average gives $32.8B, a $10B gap. How do you resolve this?",
        options: [
          {
            id: "a",
            text: "The gap points to over-counting by using total population instead of adults. Restricting to the 260M adult population at 22% penetration gives $34.3B, lining up with the $32.8B bottom-up.",
            nextQuestionId: "g4q4a",
            scoreImpact: 15,
            feedback: "Good diagnosis. Identifying the specific input error, children in the denominator, and correcting it immediately closes the gap. The revised estimate triangulates well.",
          },
          {
            id: "b",
            text: "A $10B gap this size means one number is off but I'm not sure which, so I'll present a $33-43B range covering both approaches.",
            nextQuestionId: "g4q4c",
            scoreImpact: 0,
            feedback: "A $10B range is too wide to be useful. You should diagnose which input caused the gap rather than simply widening the range to cover both estimates.",
          },
          {
            id: "c",
            text: "The bottom-up at $32.8B is grounded in real facility economics and observable revenue per location across chains, independents, and boutiques, so I'll take that as the estimate, call it $32-33B, and note the top-down population approach was flawed from the start.",
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
            text: "$32.8B is below the top-down, meaning penetration ran too high. Bottom-up suggests actual penetration closer to 22%, so the top-down should be revised down to match.",
            nextQuestionId: "g4q4a",
            scoreImpact: 10,
            feedback: "Good use of the cross-check. The bottom-up estimate anchors the penetration correction and brings the top-down in line. The revised estimate of approximately $32-34B is well-triangulated.",
          },
          {
            id: "b",
            text: "$32.8B is based on average revenue per facility, which might undercount since a lot of premium gyms and boutique studios underreport revenue to avoid drawing attention from franchisors and landlords. My top-down is probably closer to reality.",
            nextQuestionId: "g4q4c",
            scoreImpact: -10,
            feedback: "Defending a top-down with an inflated penetration assumption by questioning the bottom-up methodology is not rigorous. The penetration assumption should be the first thing revisited when the two approaches diverge significantly.",
          },
          {
            id: "c",
            text: "The market is probably somewhere between $32.8B and my higher number, so I'll call it $40B as a midpoint and flag limitations in both approaches.",
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
            text: "FitNation holds about 0.5% of a $33B market. Revenue per location, $168M over 120, is $1.4M, well above the $800K industry average. Scaling to 500 locations at that same $1.4M would put revenue at $700M, a 4x jump while still under 2% share.",
            nextQuestionId: "g4q5a",
            scoreImpact: 20,
            feedback: "Excellent strategic framing. The unit economics comparison is the most important insight, $1.4M per location versus $800K industry average signals above-average operational quality that supports the expansion thesis.",
          },
          {
            id: "b",
            text: "0.5% share in a fragmented market with thousands of independents and national chains like Planet Fitness means FitNation is small. Scaling nationally will need real capital and will draw a competitive response.",
            nextQuestionId: "g4q5b",
            scoreImpact: 0,
            feedback: "Competitive concerns are valid context but miss the strategic framing. 0.5% of a $33B market means enormous expansion room without displacing incumbents. The framing should emphasize the opportunity scale before introducing competitive complexity.",
          },
          {
            id: "c",
            text: "$168M against a $33B market shows just how fragmented this industry is. The right play is consolidation, acquiring independent gyms rather than building new locations organically.",
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
            text: "Penetration was the primary error, using 30-35% when actual is closer to 22%. I'll anchor penetration to something concrete next time, like Planet Fitness's member count over adult population.",
            nextQuestionId: "g4q5a",
            scoreImpact: 10,
            feedback: "Good post-mortem. Identifying the specific input error and proposing a concrete calibration method for next time is how analysts improve their market sizing skills.",
          },
          {
            id: "b",
            text: "20-40% off is within acceptable range for a first-pass sizing exercise done under time pressure with no external data sources available, the point of the exercise is order of magnitude, not landing on an exact figure.",
            nextQuestionId: "g4q5b",
            scoreImpact: 5,
            feedback: "True that exactness is not the goal, but 40% off is at the edge of acceptable and the error should be diagnosed specifically rather than rationalized as within range.",
          },
          {
            id: "c",
            text: "I'd challenge the $34B figure itself, different sources define fitness memberships differently, and my broader scope may just reflect a more comprehensive market definition.",
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
            text: "Yes, with one condition. The $33B market and 0.5% current share, paired with $1.4M-per-location unit economics 75% above the $800K benchmark, support the thesis strongly. The condition is confirming Texas and Oklahoma economics hold outside those specific regional markets.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong conditional recommendation with specific evidence, quantified unit economics comparison, and the right diligence condition identified. This is the IC answer that gets funded.",
          },
          {
            id: "b",
            text: "Probably yes, but there's still a lot unknown about competitive dynamics and geographic replication to give a confident recommendation at this stage of diligence.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Probably yes with too many unknowns is not an investment recommendation. The market sizing and unit economics data are sufficient to form a conditional view. Make the call and state the condition clearly.",
          },
          {
            id: "c",
            text: "Yes, it's a big $33B market, FitNation's unit economics are strong, and the 4x revenue path to 500 locations is an attractive return profile for a PE fund.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Directionally right but the recommendation would be stronger with the geographic replication condition stated explicitly, since that is the primary risk that could undermine the entire expansion thesis.",
          },
        ],
      },
      {
        id: "g4q5b",
        stage: "Final Recommendation",
        question: "The IC pushes back on your conservative framing. They say: we like the unit economics story. Just tell us, invest or pass?",
        options: [
          {
            id: "a",
            text: "Invest, conditionally. The unit economics signal is the most reliable data point here. Combined with 0.5% share in a $33B market, the thesis holds. Validate geographic replication before committing full capital.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Good commitment under pressure. Leading with the unit economics signal and adding the geographic validation condition is the right structure for this recommendation.",
          },
          {
            id: "b",
            text: "That call belongs to the IC, you've given the market context but the investment decision needs operational diligence beyond what market sizing alone can support.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Deferring the recommendation to the IC when they are explicitly asking for your view is a failure. Every analyst must make a call and defend it, that is the job.",
          },
          {
            id: "c",
            text: "Pass for now until there's better data on geographic replication, the unit economics are attractive on paper but regional specificity risk feels too high to underwrite responsibly without a more thorough round of operational diligence first.",
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
            text: "Invest conditionally. Sizing imprecision aside, the unit economics signal is clear: a real premium over the industry benchmark points to genuine operational quality. Validate geographic replication before deploying full capital.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Strong recovery. Redirecting to the most reliable data point, unit economics, and giving a clear conditional recommendation despite sizing imprecision is exactly the right approach.",
          },
          {
            id: "b",
            text: "Pass, imprecise market sizing plus unvalidated geographic replication together create too much uncertainty to responsibly recommend this investment right now.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Passing on a deal with compelling unit economics because of market sizing imprecision is an overreaction. The unit economics data is reliable and the market size, even at the lower end of estimates, is large enough to support a significant national rollout.",
          },
          {
            id: "c",
            text: "Invest, the market's large enough that even if my sizing was off by 30%, there's still plenty of headroom for FitNation to become a meaningful national business without ever threatening the position of the largest incumbent chains.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "The directional conclusion is right but the reasoning is weak. Just being a large market is not sufficient, the unit economics story is the real investment thesis and should be the centerpiece of the recommendation.",
          },
        ],
      },
    ],
  },

  {
    id: "g5",
    title: "SunStay Hotels: Post-Pandemic Recovery",
    type: "profitability",
    difficulty: "beginner",
    firm: "mckinsey",
    estimatedMinutes: 22,
    overview: "A mid-scale hotel chain is struggling to recover profitability three years after the pandemic. McKinsey has been engaged to identify the primary issues and recommend quick wins.",
    clientBackground: "SunStay operates 95 hotels in business travel markets, airports, downtown business districts, conference centers. Pre-pandemic RevPAR was $98. Current RevPAR is $84. Operating cost per available room per day rose from $52 to $71 over the same period. The CEO believes the problem is purely demand-side. The CFO thinks costs are structurally out of control.",
    yourRole: "You are a McKinsey associate on the hospitality and travel practice. The partner has asked you to prepare a 10-minute update for a joint CEO-CFO meeting.",
    startQuestionId: "g5q1",
    finalRecommendationPrompt: "The CEO and CFO both ask: who is right, me or the CFO, and what should we prioritize in the next 90 days?",
    sampleRecommendation: "Both have a piece of it, but the CFO's concern is more urgent. The $14 RevPAR decline accounts for 42% of the contribution margin collapse, while the $19 operating cost increase accounts for 58%. Labor and utilities, each up 50% per available room, are the largest controllable levers. In the next 90 days: launch demand-based labor scheduling at all 95 properties and deploy revenue management optimization to recover $8-10 of the $14 ADR decline through better yield management.",
    idealRecommendation: "Both are partially right, but the CFO's concern is more financially acute. The $19 cost increase per available room (58% of the contribution margin decline) is larger than the $14 RevPAR decline (42%). Costs are structural, labor and utilities rose 50% each and will not self-correct. Priority: demand-based labor scheduling (largest controllable lever) and revenue management optimization to recover ADR. Costs first, demand second.",
    keyTakeaways: [
      "In hospitality, contribution margin equals RevPAR minus operating cost per available room, always quantify both sides before taking a position",
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
            text: "Frame it around contribution margin, RevPAR minus operating cost per room. Both sides have moved against the business, so quantify which moved more before taking a position either way.",
            nextQuestionId: "g5q2a",
            scoreImpact: 20,
            feedback: "Correct framing. The contribution margin lens acknowledges both concerns while establishing a neutral analytical structure. The CEO and CFO will both feel heard, and the data will determine who is more right.",
          },
          {
            id: "b",
            text: "Back the CFO going in, costs are always more controllable than demand in a hotel business, and walking in with a clear position avoids looking indecisive in front of both executives.",
            nextQuestionId: "g5q2b",
            scoreImpact: -5,
            feedback: "Siding with one executive before looking at the data is a credibility risk. If the analysis ultimately shows demand is the larger driver, you will have to reverse your position in the meeting. The CEO will not forget.",
          },
          {
            id: "c",
            text: "Frame it as a revenue problem, RevPAR is the headline hotel metric and the CEO is closer to day-to-day operations, so his demand read probably carries more weight.",
            nextQuestionId: "g5q2c",
            scoreImpact: -10,
            feedback: "Proximity to operations does not make the CEO's hypothesis more likely to be correct, it may actually mean he is anchored on operational explanations and blind to cost changes. The data should determine the frame, not the CEO's seniority.",
          },
        ],
      },
      {
        id: "g5q2a",
        stage: "Quantifying the Problem",
        question: "You enter the meeting with the contribution margin frame. The partner asks you to run the numbers live. Using the data provided, calculate the contribution margin decline and determine which side, revenue or costs, is the larger driver.",
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
            text: "RevPAR down $14, operating cost up $19. Of the $33 total decline, costs are $19 (58%) and revenue $14 (42%). Both matter, but costs are the larger driver.",
            nextQuestionId: "g5q3a",
            scoreImpact: 20,
            feedback: "Exactly right. Precise, quantified, and balanced. The CFO is more right than the CEO but the CEO is not wrong. This framing wins credibility with both executives simultaneously.",
          },
          {
            id: "b",
            text: "$33 per room total decline, but revenue is the bigger issue since RevPAR drives all hotel economics and occupancy is still meaningfully below pre-pandemic levels.",
            nextQuestionId: "g5q3b",
            scoreImpact: 0,
            feedback: "The statement that RevPAR is the bigger problem is incorrect, costs account for 58% of the decline versus revenue at 42%. Siding with the CEO's revenue hypothesis despite the data showing costs are larger is a missed diagnosis.",
          },
          {
            id: "c",
            text: "It's basically a wash, $33 splits roughly evenly between the $14 revenue drop and $19 cost increase, so neither the CEO nor the CFO is more right.",
            nextQuestionId: "g5q3c",
            scoreImpact: -5,
            feedback: "$14 and $19 are not equal, costs account for 58% and revenue 42%. Describing an unequal split as equal because both are significant misrepresents the data and undercuts the value of the quantitative analysis.",
          },
        ],
      },
      {
        id: "g5q2b",
        stage: "Quantifying the Problem",
        question: "You entered the meeting siding with the CFO. The CEO immediately pushes back: look at our occupancy, it is still 5 percentage points below pre-pandemic. Demand clearly has not recovered. How do you handle this?",
        options: [
          {
            id: "a",
            text: "Acknowledge his point, then run the contribution margin math to see whether revenue or cost is actually the bigger driver before taking any further position.",
            nextQuestionId: "g5q3a",
            scoreImpact: 10,
            feedback: "Good recovery. Stepping back from the premature position and running the calculation is the right move. The CEO visibly appreciates being heard before the data drives the conclusion.",
          },
          {
            id: "b",
            text: "Hold your ground with the CFO, occupancy recovery doesn't matter if costs are up 37%, even at full pre-pandemic occupancy the business would still be structurally less profitable.",
            nextQuestionId: "g5q3b",
            scoreImpact: 5,
            feedback: "This point is directionally valid but defensively delivered. You are now in a debate with the CEO rather than guiding both executives toward a shared understanding of the data.",
          },
          {
            id: "c",
            text: "Reverse course entirely and side with the CEO, 71% versus 76% occupancy confirms demand hasn't recovered and that's the real problem.",
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
            text: "Switch gears immediately and run the contribution margin math to quantify both sides before this goes further in the wrong direction.",
            nextQuestionId: "g5q3a",
            scoreImpact: 10,
            feedback: "Good recovery. Pivoting to the data when challenged is the right move. You lose some early credibility but the calculation will give both executives a shared fact base to work from.",
          },
          {
            id: "b",
            text: "Agree both drivers matter and suggest building a full attribution model over the next two weeks, pulling in labor, utilities, and RevPAR data by property, before bringing any conclusions back to the board.",
            nextQuestionId: "g5q3c",
            scoreImpact: -10,
            feedback: "Calling for a two-week attribution model in the middle of a 10-minute update meeting is not useful. The executives need a view now. The data to calculate contribution margin is already in front of you.",
          },
          {
            id: "c",
            text: "Acknowledge the cost increase is significant and recalibrate to the contribution margin frame to weigh both sides with equal rigor.",
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
            text: "Labor and utilities together are $16 of the $19 increase, 84% of it. Both reflect permanent post-pandemic resets, wages rarely come back down and utility costs track energy markets that have shifted structurally, not temporarily.",
            nextQuestionId: "g5q4a",
            scoreImpact: 20,
            feedback: "Correct and specific. Identifying the two largest drivers and correctly labeling them as structural rather than cyclical is the key insight. The CEO now understands why demand recovery alone will not solve the problem.",
          },
          {
            id: "b",
            text: "As occupancy climbs back toward 76%, the fixed cost component spreads over more room nights and cost per available room should naturally come down. Demand recovery should partly solve this over the next 12-18 months.",
            nextQuestionId: "g5q4b",
            scoreImpact: 0,
            feedback: "Operating cost per available room includes a fixed component that improves with occupancy, you are correct about that. But labor cost per available room rose regardless of occupancy because wages reset structurally higher. The distinction between fixed and variable costs matters here.",
          },
          {
            id: "c",
            text: "Maintenance and supplies together account for $4 of the increase and should be the first cost-reduction target since they're more discretionary than labor or utilities.",
            nextQuestionId: "g5q4c",
            scoreImpact: -5,
            feedback: "Maintenance and supplies are only $4 of the $19 increase, 21% of the total. Focusing cost reduction efforts on the smaller, more discretionary buckets while ignoring labor at $12 of the increase is a misallocation of management attention.",
          },
        ],
      },
      {
        id: "g5q3b",
        stage: "Cost Decomposition",
        question: "You have framed this as primarily a revenue problem. The partner pulls you aside briefly and says: you have the data right in front of you. Run the numbers before the CEO uses the demand narrative to avoid cost accountability. What do you do?",
        options: [
          {
            id: "a",
            text: "Go back in and walk through the contribution margin math, costs are 58% of the decline, revenue 42%. Both matter, but costs are the more urgent, controllable piece.",
            nextQuestionId: "g5q4a",
            scoreImpact: 15,
            feedback: "Good recovery under partner pressure. Presenting the full calculation and rebalancing the narrative is the right move, even if late. The CFO visibly relaxes.",
          },
          {
            id: "b",
            text: "Stick with the revenue framing, the CEO outranks the CFO in the room and switching position mid-meeting in front of both executives would just confuse things and hurt your credibility going forward.",
            nextQuestionId: "g5q4b",
            scoreImpact: -10,
            feedback: "Deferring to seniority over data is the wrong choice. The partner told you directly to run the numbers. Ignoring her instruction to preserve a flawed narrative is not defensible.",
          },
          {
            id: "c",
            text: "Present revenue and costs as equally weighted drivers and avoid picking one as larger, let the executives read the numbers themselves.",
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
            text: "Costs first, they're the bigger and more controllable driver. Labor scheduling tackles the $12-per-room increase directly. Revenue management runs in parallel but is secondary.",
            nextQuestionId: "g5q4a",
            scoreImpact: 10,
            feedback: "Correct prioritization. Larger driver, more controllable, faster to implement, costs should come first. Acknowledging that revenue management can run in parallel shows you understand both dimensions without losing focus.",
          },
          {
            id: "b",
            text: "Revenue first, demand recovery is the natural path forward for a hotel chain rebuilding from the pandemic, and getting occupancy back to its pre-pandemic 76% level should lift both revenue and cost metrics per room at once.",
            nextQuestionId: "g5q4b",
            scoreImpact: -5,
            feedback: "Demand recovery helps but wages and utilities do not decrease as occupancy improves, those costs reset structurally. Prioritizing demand over cost action leaves the larger and more controllable driver unaddressed.",
          },
          {
            id: "c",
            text: "Run both in parallel, one team on labor scheduling, one on revenue management, so neither driver gets deprioritized.",
            nextQuestionId: "g5q4a",
            scoreImpact: 5,
            feedback: "Parallel workstreams are common in real engagements, but the partner asked what to focus on first. Not prioritizing when asked is evasive. Labor cost is both larger and more controllable, it should lead.",
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
            text: "Freeze all hiring across the 95 properties for 90 days and let natural attrition bring headcount down gradually without disrupting operations.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "Attrition-based reduction is slow and imprecise. Labor cost per available room rose 50%, you need active scheduling optimization, not passive headcount reduction through attrition over an unpredictable timeline.",
          },
          {
            id: "b",
            text: "Move to demand-based scheduling tied to occupancy forecasts at all 95 properties, staffing tracks projected demand instead of fixed shift patterns. Recovers cost in low-occupancy periods without touching the guest experience at peak.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Excellent. Demand-based scheduling directly addresses the largest cost driver at scale across all 95 properties. It improves cost efficiency without cutting service quality and can be implemented within the 90-day window.",
          },
          {
            id: "c",
            text: "Cut staffing levels 15% uniformly across all roles and properties, then track guest satisfaction scores to see whether customers notice.",
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
            text: "Demand recovery moved revenue some, but costs are still $19 per room above pre-pandemic. Prioritize labor scheduling now, the single largest lever still on the table.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Good recovery even if delayed. Correctly diagnosing that demand recovery worked partially but did not touch the structural cost problem leads to the right recommendation. The CFO says: finally.",
          },
          {
            id: "b",
            text: "Stay the course on demand recovery, get occupancy back to 76% first, then we'll know whether cost action is even still necessary.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Waiting for full occupancy recovery to assess cost action ignores that labor and utility costs rose structurally and do not improve with occupancy. Another year of delay will not change this fundamental fact.",
          },
          {
            id: "c",
            text: "Treat the new cost structure as permanent and put management focus entirely into pushing RevPAR above pre-pandemic levels through aggressive rate increases and premium positioning to outrun the higher costs over time.",
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
            text: "One, demand-based labor scheduling across all 95 properties, roughly $15M in annual savings. Two, revenue management optimization to recover ADR, roughly $20M in annual revenue lift.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Strong finish. Two specific recommendations with quantified impact, one on each side of the contribution margin equation. The meeting ends with both executives aligned on next steps.",
          },
          {
            id: "b",
            text: "One, bring in a revenue management consultant to optimize pricing. Two, commission a labor market study to see whether wages can be brought down at all.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "Recommending to hire more consultants and commission more studies is not a recommendation, it is a delay. The executives need actionable 90-day steps, not more analysis.",
          },
          {
            id: "c",
            text: "One, close the five least profitable properties to shrink the fixed cost base and redeploy their staff to stronger locations nearby. Two, rebrand SunStay as an upscale chain to justify a meaningfully higher ADR that offsets the structural cost increase over time.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Closing properties and rebranding are major strategic decisions that require months of planning and board approval, not 90-day actions. The executives asked for quick wins, not a strategy overhaul.",
          },
        ],
      },
    ],
  },

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
    sampleRecommendation: "Three changes in priority order: first, rationalize the menu by removing the bottom 30% of SKUs by volume, the 28 new items added in 18 months increased kitchen complexity and preparation time by 40% and must be partially reversed. Second, update the peak-hour staffing model to reflect the 23% volume increase since 2022. Third, implement a preventive maintenance schedule for fryers and grills to eliminate the 4.8 equipment downtime incidents per month that are creating peak-period bottlenecks.",
    idealRecommendation: "Three changes: (1) SKU rationalization, remove the bottom 30% of menu items by volume to recover kitchen preparation time. (2) Staffing model update, update peak-hour staffing to match the 23% volume increase since last model update. (3) Preventive equipment maintenance, shift fryers and grills from reactive to scheduled maintenance to eliminate the 4x increase in peak-hour downtime incidents. Together these address the three root causes behind the wait time doubling.",
    keyTakeaways: [
      "In food service, menu complexity is the hidden driver of speed deterioration, each new SKU adds training, inventory, and kitchen coordination overhead",
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
            text: "Order complexity, throughput capacity, and process execution.",
            nextQuestionId: "g6q2a",
            scoreImpact: 20,
            feedback: "These three buckets are MECE and cover the full range of drive-through speed drivers, menu and order size, staffing and equipment capacity, and how well the standard procedures are actually followed.",
          },
          {
            id: "b",
            text: "Staff attitude and friendliness toward customers, the physical layout of the drive-through lane, and whether local competitors are pulling away the more patient, higher-tolerance customers who used to wait it out.",
            nextQuestionId: "g6q2b",
            scoreImpact: -5,
            feedback: "Staff attitude and competition are not the most productive diagnostic categories for a wait time problem. Layout is relevant but secondary. The framework misses menu complexity and equipment reliability, the two most common drivers of fast food speed deterioration.",
          },
          {
            id: "c",
            text: "Break the process into order taking, kitchen preparation, and payment/handoff, and time each step.",
            nextQuestionId: "g6q2c",
            scoreImpact: 10,
            feedback: "Process decomposition by time step is a valid approach and more granular than a cause-category framework, but it maps where time is spent rather than why it increased. You will still need to add the causal dimension after mapping the steps.",
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
            text: "Staffing is the primary problem: peak FTE fell from 8.2 to 8.0 while daily orders grew 23%, an understaffed kitchen that's now slower on every single order it processes.",
            nextQuestionId: "g6q3b",
            scoreImpact: 0,
            feedback: "Staffing declined slightly and volume grew significantly, so this is a contributing factor, but kitchen preparation time grew 89% while staffing fell only 2%. That gap is far too large to be explained by a 2% staffing reduction alone.",
          },
          {
            id: "b",
            text: "Kitchen preparation time grew 89%. Three things moved together with it: SKU count up 67%, 38% of orders now containing new, less-practiced items, and equipment downtime up 300%. Those three compounding factors account for most of the wait time doubling.",
            nextQuestionId: "g6q3a",
            scoreImpact: 20,
            feedback: "Kitchen preparation time is the largest single driver of the wait time increase, and the three compounding causes behind it, menu complexity, item novelty, and equipment downtime, are the right ones to name.",
          },
          {
            id: "c",
            text: "Order taking grew 50%, from 0.8 to 1.2 minutes, an upstream bottleneck slowing the whole queue before food even reaches the kitchen.",
            nextQuestionId: "g6q3c",
            scoreImpact: -5,
            feedback: "Order taking time increased 0.4 minutes; kitchen preparation time increased 1.6 minutes, four times as much. Focusing on the smaller upstream bottleneck while the much larger kitchen issue goes unaddressed misallocates the diagnostic attention.",
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
            text: "Equipment downtime growing 300%, a 4x jump in failures, creates bottlenecks management cannot schedule around. That unpredictability makes it the most urgent fix.",
            nextQuestionId: "g6q3a",
            scoreImpact: 5,
            feedback: "Equipment downtime is important and growing rapidly, but kitchen preparation time grew 89% even on days when equipment was functioning fine, meaning menu complexity and staffing issues are also major contributors. Equipment is urgent but not the single most important insight.",
          },
          {
            id: "b",
            text: "Menu SKU growth from 42 to 70, a 67% jump in complexity, is the structural cause of the preparation time increase.",
            nextQuestionId: "g6q3a",
            scoreImpact: 15,
            feedback: "Menu complexity is the structural root cause that drives preparation time up even when equipment works and staff are available. The other factors compound it, but this is the most important single lever to address.",
          },
          {
            id: "c",
            text: "Daily orders grew 23% while peak staffing fell slightly from 8.2 to 8.0 FTE, and turnover among the newer hires means less experienced crews are running the line during the busiest shifts. Volume simply outgrew staffing capacity, and everything else follows from that imbalance.",
            nextQuestionId: "g6q3b",
            scoreImpact: 0,
            feedback: "The staffing-volume gap contributes to the problem, but kitchen preparation time grew 89% against a 23% volume increase, far larger than volume growth alone would explain. Menu complexity is the more fundamental root cause.",
          },
        ],
      },
      {
        id: "g6q2c",
        stage: "Data Analysis",
        question: "Your time-step analysis shows kitchen preparation grew from 1.8 to 3.4 minutes, accounting for most of the total wait time increase. The franchisee group leader asks: why did kitchen time almost double?",
        options: [
          {
            id: "a",
            text: "Three compounding factors: menu SKUs grew 67% to 70 items, meaning less staff repetition per item; 38% of orders now include new items; and equipment downtime grew 300%, creating peak bottlenecks.",
            nextQuestionId: "g6q3a",
            scoreImpact: 15,
            feedback: "Naming three specific, compounding factors behind the preparation time increase gives the franchisee group a clear picture of what to address and in what order.",
          },
          {
            id: "b",
            text: "Volume grew 23% while staffing stayed roughly flat across the same window, and turnover meant many newer hires covering peak shifts had far less repetition on high-volume items, so work spread thinner across a less experienced crew, naturally slowing preparation per order.",
            nextQuestionId: "g6q3b",
            scoreImpact: 5,
            feedback: "Volume growing faster than staffing is a contributing factor, but it explains maybe 20% of the 89% preparation time increase. The much larger driver is menu complexity, 70 SKUs requires far more kitchen choreography than 42.",
          },
          {
            id: "c",
            text: "Order taking time rose 50%, so cars are arriving at the kitchen window faster than the kitchen can process them, creating a queue backup that shows up as kitchen delay.",
            nextQuestionId: "g6q3c",
            scoreImpact: -5,
            feedback: "Order taking and kitchen prep are sequential steps, not concurrent ones. Longer order taking would give the kitchen slightly more lead time, not less. The kitchen time increase has independent causes.",
          },
        ],
      },
      {
        id: "g6q3a",
        stage: "Solution Design",
        question: "The franchisor representative in the room pushes back: we cannot cut menu items, the new products drove a 12% revenue increase over the same 18 months. How do you respond?",
        options: [
          {
            id: "a",
            text: "Agree and drop menu rationalization entirely, the revenue math doesn't support touching a 12% growth driver.",
            nextQuestionId: "g6q4b",
            scoreImpact: -10,
            feedback: "Capitulating without quantifying the tradeoff is not consulting. You have not calculated whether the 12% revenue gain offsets the customer satisfaction loss from doubled wait times. The data may support a partial rationalization rather than full reversal.",
          },
          {
            id: "b",
            text: "Weigh the 12% revenue increase against the satisfaction decline from 78 to 61. If slower service is reducing repeat visits, the net revenue impact of the new items may be neutral or negative. Removing only the bottom 30% by volume preserves most of the revenue while recovering most of the kitchen time.",
            nextQuestionId: "g6q4a",
            scoreImpact: 20,
            feedback: "Quantifying the tradeoff and proposing partial rather than full rationalization addresses the franchisor's concern while defending the operational recommendation with numbers instead of assertion.",
          },
          {
            id: "c",
            text: "Acknowledge the revenue point, keep every new item, and instead invest in extra kitchen equipment and training so the kitchen can absorb the complexity without a menu cut.",
            nextQuestionId: "g6q4c",
            scoreImpact: 5,
            feedback: "Equipment investment and training are valid parts of the solution, but accepting full menu complexity and only managing through operations investment is more expensive than partial rationalization. The tradeoff analysis is missing.",
          },
        ],
      },
      {
        id: "g6q3b",
        stage: "Solution Design",
        question: "You have diagnosed that volume grew 23% while staffing stayed flat. The franchisee group leader says: we cannot afford to hire significantly more staff, margins are already thin. What do you recommend?",
        options: [
          {
            id: "a",
            text: "Update the scheduling model to shift existing staff hours toward peak demand periods rather than adding headcount. Many locations are overstaffed in slow periods and understaffed at peak.",
            nextQuestionId: "g6q4a",
            scoreImpact: 15,
            feedback: "Shifting hours rather than adding headcount addresses the staffing-volume gap cost-effectively and avoids the labor cost increase that would come with hiring.",
          },
          {
            id: "b",
            text: "Accept the slower service as the new normal for now. Margins are already thin across all 62 locations, and the satisfaction decline is an unfortunate but seemingly unavoidable cost of the current staffing constraint until volume growth eventually justifies additional headcount.",
            nextQuestionId: "g6q4b",
            scoreImpact: -15,
            feedback: "Accepting slower service without exploring alternatives is not consulting. Several operational levers, scheduling optimization, menu rationalization, equipment maintenance, can recover throughput without additional headcount.",
          },
          {
            id: "c",
            text: "Raise menu prices 8% to fund additional peak-hour staffing, since more labor is the only real path to faster service.",
            nextQuestionId: "g6q4c",
            scoreImpact: -5,
            feedback: "Recommending price increases to fund operational problems that scheduling and menu changes can address is unnecessary, and it risks accelerating customer attrition at a time when satisfaction scores are already declining.",
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
            text: "Shift the investigation to kitchen preparation time. Even with order taking optimized, the kitchen at 3.4 minutes average is the longer bottleneck.",
            nextQuestionId: "g6q3a",
            scoreImpact: 10,
            feedback: "Recognizing that the kitchen is the longer constraint redirects the diagnostic to where the largest improvement opportunity actually lives.",
          },
          {
            id: "b",
            text: "Test menu boards that pre-suggest the most popular items, shortening customer decision time before they reach the speaker and pulling order time below the current 1.2 minutes.",
            nextQuestionId: "g6q4c",
            scoreImpact: 0,
            feedback: "Simplified menu boards are a valid tactic for reducing order time, but the order taking step only increased 0.4 minutes total, at best a small gain. The kitchen step is 1.6 minutes longer, four times larger. This recommendation addresses the smaller problem.",
          },
          {
            id: "c",
            text: "Build a mobile pre-order app so customers order before arriving, eliminating the speaker step and collapsing order taking time to near zero, while also capturing loyalty data that could inform future menu simplification decisions.",
            nextQuestionId: "g6q4c",
            scoreImpact: -5,
            feedback: "Mobile pre-ordering is a multi-year technology investment that would not address the current crisis. Even if implemented, kitchen preparation time of 3.4 minutes would still be the primary constraint on total wait time.",
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
            text: "One, remove the bottom 30% of menu SKUs by volume to recover kitchen preparation time without touching the revenue from the top 70%. Two, update peak-hour scheduling to match the 23% volume increase. Three, implement preventive maintenance for fryers and grills to eliminate the 4x increase in equipment downtime.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Each recommendation addresses one of the three root causes identified in the diagnostic, and together they cover the full explanation for the preparation time doubling.",
          },
          {
            id: "b",
            text: "One, hire 2 additional FTE per location to close the volume-staffing gap. Two, replace all kitchen equipment with newer models to cut downtime. Three, redesign the physical drive-through lane to reduce queue congestion.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "These recommendations are expensive, slow to implement, and miss the largest root cause, menu complexity. Hiring and equipment replacement are capital-intensive options when scheduling optimization and menu rationalization could recover most of the wait time at much lower cost.",
          },
          {
            id: "c",
            text: "One, reduce the menu to 30 SKUs by cutting everything added in the past 18 months. Two, close from 10pm to 6am when volume is lowest. Three, add a dedicated express lane for orders of 3 items or fewer.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "Cutting all new items risks reversing the 12% revenue gain. Reducing hours eliminates revenue without fixing the core problem. An express lane may help at the margin but does not address kitchen preparation time, the primary constraint.",
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
            text: "SKUs grew 67% and kitchen prep time grew 89%, those numbers are directly connected. Negotiate with corporate to remove the bottom 30% of new SKUs and update the staffing model.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Giving the franchisees the honest recommendation even when it creates a difficult conversation with corporate is exactly what they hired KPMG to do.",
          },
          {
            id: "b",
            text: "Tell them to accept current service levels for now. Menu innovation is a strategic franchisor priority protected in the franchise agreement, and pushing back on it risks damaging the relationship more than the satisfaction decline already has.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "Recommending that clients accept a problem to preserve a third-party relationship is not consulting, it is people-pleasing. The franchisees are facing quality standards violations that could cost them their franchise agreements. They need honest recommendations.",
          },
          {
            id: "c",
            text: "Recommend additional training and equipment investment at each location instead, since it is more politically feasible than asking corporate to shrink the menu.",
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
            text: "Acknowledge the miss directly: the diagnostic focused on order taking and staffing rather than kitchen preparation, the actual root cause. Implement the three proven interventions immediately.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Owning the miss and pivoting to the proven solution is the professional response, and it is far better received than defending a weaker answer.",
          },
          {
            id: "b",
            text: "Point out that the other franchise groups may have had somewhat different underlying root causes across their specific markets and store formats, so what worked well for their particular context may not translate cleanly to BurgerBlitz's own operational situation.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Defending a weaker recommendation by suggesting the proven solution might not apply is intellectually dishonest. The data clearly shows the same root causes, menu complexity, staffing mismatch, and equipment downtime, that the successful franchise groups addressed.",
          },
          {
            id: "c",
            text: "Note that 4.2 minutes is still above the pre-problem level of 3.2, so those interventions are themselves incomplete and a more comprehensive operational overhaul is really what's needed.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Criticizing a solution that recovered 2.6 minutes of wait time against a 3.6-minute target, in order to avoid acknowledging the recommendation miss, is evasive and damages credibility further.",
          },
        ],
      },
    ],
  },
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
    sampleRecommendation: "VoltLux's realistic addressable market is the ultra-luxury segment ($80K-$120K vehicles) at approximately $60B annually, representing 620,000 units with 31% EV penetration, the highest of any luxury tier. This segment minimizes direct competition with Tesla's high-volume Model 3/Y, aligns with VoltLux's $85-120K target price, and has the most willing early EV adopters among luxury buyers. The $400M capital base is sufficient for a focused entry targeting California, Texas, and New York, which together represent 42% of US luxury vehicle sales.",
    idealRecommendation: "VoltLux should enter the ultra-luxury segment ($80K-$120K) first. This tier has the highest EV penetration (31%), least direct Tesla competition, and price point matching VoltLux's product. At 620,000 units annually at $96K average transaction price, the total ultra-luxury market is approximately $60B. VoltLux's realistic 3-5 year target is 1-2% share, 6,200-12,400 units annually, representing $600M-$1.2B in annual revenue.",
    keyTakeaways: [
      "Market sizing in automotive requires both unit volume and dollar value since the revenue opportunity depends heavily on average transaction price across segments",
      "Defining TAM versus SAM versus SOM matters most for early-stage startups where capital is limited and focus determines survival",
      "Geographic concentration in luxury goods is high, a few states often represent 40%+ of total US luxury purchases",
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
            text: "Define the market as all US electric vehicles broadly, from budget EVs to Rivian and Tesla, since VoltLux is fundamentally an EV company and investors will want the full EV opportunity, not a narrower luxury slice.",
            nextQuestionId: "g7q2c",
            scoreImpact: -5,
            feedback: "All US EVs includes Chevy Bolts and budget EVs where VoltLux will never compete at $85-120K pricing. A market definition this broad includes irrelevant competitors and inflates the apparent opportunity misleadingly.",
          },
          {
            id: "b",
            text: "Define the US luxury vehicle market at $60K and above, then layer in luxury EV as VoltLux's competitive space, so TAM and SAM appear separately.",
            nextQuestionId: "g7q2a",
            scoreImpact: 20,
            feedback: "The total luxury market sets the ceiling of the opportunity, and luxury EV specifically is VoltLux's competitive set. This lets TAM, SAM, and SOM be shown in sequence, exactly what investors need for an early-stage vehicle startup.",
          },
          {
            id: "c",
            text: "Define the market as Tesla's current US sales, since Tesla is the competitor VoltLux will need to displace and investors will recognize the benchmark.",
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
            text: "Total luxury market: 1,785,000 units times $85,000 average equals $151.7B annually.",
            nextQuestionId: "g7q3a",
            scoreImpact: 20,
            feedback: "$152B total luxury market and $32B luxury EV market gives the investor both the ceiling and the immediately relevant competitive space, exactly the right layered presentation.",
          },
          {
            id: "b",
            text: "Roughly $75B total, using a simplified average of $42,000 per vehicle across all 1.785 million units.",
            nextQuestionId: "g7q3b",
            scoreImpact: -10,
            feedback: "$42,000 is far below the stated average transaction price of $85,000 for the luxury segment. Using a figure below the $60K luxury market floor halves the true market size and would immediately flag a calculation error in the investor presentation.",
          },
          {
            id: "c",
            text: "Total luxury market is 1.785 million units. A dollar figure isn't necessary here, auto investors evaluate markets in unit volume rather than revenue.",
            nextQuestionId: "g7q3c",
            scoreImpact: -5,
            feedback: "Investors absolutely need dollar revenue. Unit volume without average transaction price misses the enormous revenue difference between a 620,000-unit segment at $96K average and one at $71K average. The revenue calculation is essential.",
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
            text: "Non-EV luxury vehicles from BMW, Mercedes, Audi, and Lexus. VoltLux will compete for buyers who might otherwise buy an ICE luxury vehicle, not just Tesla buyers.",
            nextQuestionId: "g7q2a",
            scoreImpact: 15,
            feedback: "VoltLux's total addressable market includes luxury buyers who have not yet switched to EV, arguably the most important segment since they represent the conversion opportunity rather than share-stealing from Tesla.",
          },
          {
            id: "b",
            text: "Tesla's market share is understated because direct-channel sales aren't well captured, so the real Tesla-equivalent market is closer to $120B.",
            nextQuestionId: "g7q3c",
            scoreImpact: -10,
            feedback: "Tesla's direct channel sales are fully captured in their reported revenue. The scope issue is not Tesla's channel but the exclusion of all non-EV luxury competitors that VoltLux will compete against for the same buyer.",
          },
          {
            id: "c",
            text: "International luxury EV markets, the EU and China, should be included since VoltLux will eventually go global.",
            nextQuestionId: "g7q3c",
            scoreImpact: 0,
            feedback: "International expansion is eventually relevant, but VoltLux is entering the US market first with $400M in US-focused capital. The immediate investor presentation should focus on the US TAM where the launch strategy is being executed.",
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
            text: "VoltLux competes only in luxury EV, roughly 26% of all EV sales, about $13B, so the $50B all-EV figure overstates the addressable market by nearly 4x.",
            nextQuestionId: "g7q2a",
            scoreImpact: 10,
            feedback: "Recognizing that the broad EV definition overstates the addressable market and narrowing to luxury EV is the right move. The $13B estimate is lower than the full segment calculation would show, but the directional correction is valid.",
          },
          {
            id: "b",
            text: "VoltLux can address the full $50B, luxury brand positioning creates a halo effect pulling in buyers across every price point.",
            nextQuestionId: "g7q3c",
            scoreImpact: -10,
            feedback: "A startup with $400M in capital cannot launch across the full price spectrum. The BMW comparison ignores that BMW took 100 years to build a halo that supports a wide range. VoltLux's SAM for the first 5 years is exclusively the luxury segment.",
          },
          {
            id: "c",
            text: "The $50B all-EV figure is the right frame anyway, since investors compare EV companies to each other regardless of price segment when setting valuation comparables.",
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
            text: "Super-luxury, above $120K. Tesla competition is lowest there, letting VoltLux position as a niche ultra-premium brand.",
            nextQuestionId: "g7q4c",
            scoreImpact: -5,
            feedback: "Super-luxury has only 12% EV penetration, the lowest of any segment, meaning buyers in that tier are most resistant to EVs. Entering the segment with the least EV-receptive buyers is a difficult go-to-market position for a first-time entrant.",
          },
          {
            id: "b",
            text: "Ultra-luxury, $80-120K: highest EV penetration at 31%, moderate Tesla competition, a price range that matches VoltLux's $85-120K exactly, and 620,000 annual units.",
            nextQuestionId: "g7q4a",
            scoreImpact: 20,
            feedback: "All four factors, EV penetration, competition level, price fit, and volume, point to ultra-luxury as the optimal first entry. The 31% EV penetration is particularly important because it signals existing consumer openness to EVs at that price point.",
          },
          {
            id: "c",
            text: "Base luxury, $60-80K, it has the largest volume at 980,000 units annually.",
            nextQuestionId: "g7q4b",
            scoreImpact: -10,
            feedback: "The $60-80K segment is Tesla's core market, Model 3, Model Y, and lower Model S variants all compete here. Entering Tesla's highest-volume stronghold with $400M against a company with $20B+ in automotive capital deployed is an extremely difficult competitive position.",
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
            text: "A bigger market strengthens rather than weakens the case.",
            nextQuestionId: "g7q4a",
            scoreImpact: 15,
            feedback: "Acknowledging the calculation error, noting it strengthens the case rather than weakening it, and showing that the entry recommendation is robust to the correction demonstrates analytical maturity.",
          },
          {
            id: "b",
            text: "A bigger market means VoltLux can afford to target a broader range of segments at once, since there is simply more revenue available than originally calculated.",
            nextQuestionId: "g7q4b",
            scoreImpact: -5,
            feedback: "Total market size does not change VoltLux's capital constraints. $400M in seed funding determines what can be launched, not the size of the total market. A larger market makes focus more important, not less.",
          },
          {
            id: "c",
            text: "The calculation error undermines confidence in the whole analysis. Defer the entry segment recommendation until the sizing is independently re-verified.",
            nextQuestionId: "g7q4c",
            scoreImpact: -10,
            feedback: "A calculation error in one number does not invalidate an entire analytical framework. The entry segment recommendation is based on EV penetration, competitive dynamics, and price fit, none of which change based on the dollar value of the total market.",
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
            text: "Ultra-luxury, 80-120K, combines the highest EV penetration at 31%, a price range matching VoltLux exactly, and moderate rather than intense Tesla competition.",
            nextQuestionId: "g7q4a",
            scoreImpact: 15,
            feedback: "Correct entry recommendation even arriving late to the right market scope. The three-factor rationale, penetration, price fit, and competition, is exactly right.",
          },
          {
            id: "b",
            text: "All three segments at once, a full model lineup spanning roughly $70K to $150K in sticker price.",
            nextQuestionId: "g7q4b",
            scoreImpact: -10,
            feedback: "A three-segment simultaneous launch with $400M in capital is not feasible. A single luxury vehicle platform targeting one segment is already an aggressive use of that capital. Multi-segment launches require 3-5x more capital.",
          },
          {
            id: "c",
            text: "Base luxury, $60-80K, first, since it has the largest unit volume at 980,000 annually.",
            nextQuestionId: "g7q4c",
            scoreImpact: -5,
            feedback: "Volume is attractive, but the $60-80K segment is Tesla's home turf with very high competitive intensity. Entering with the largest addressable market does not help if the competitive position is untenable given the capital available.",
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
            text: "Ultra-luxury is 620,000 units annually at $96,000 average.",
            nextQuestionId: "g7q5a",
            scoreImpact: 20,
            feedback: "$1.19B in year five revenue against a $400M seed round is an attractive framing, roughly 3x investment in revenue in five years.",
          },
          {
            id: "b",
            text: "Apply 2% to the entire luxury market instead, $152B times 2% is $3B, a more compelling investor story.",
            nextQuestionId: "g7q5b",
            scoreImpact: -10,
            feedback: "The 2% being discussed applies to the ultra-luxury segment VoltLux is entering, not the entire luxury market. Applying it to the full $152B would imply VoltLux sells across all luxury segments simultaneously.",
          },
          {
            id: "c",
            text: "Hold off on a number, without knowing VoltLux's exact manufacturing capacity, projecting year five revenue is premature.",
            nextQuestionId: "g7q5c",
            scoreImpact: -5,
            feedback: "Market share to revenue translation is a standard investor calculation that does not require knowing specific operational details. The investor asked for a directional revenue estimate based on market sizing, provide it.",
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
            text: "Tesla has deployed over $20B in automotive capital to dominate this segment. At $400M, VoltLux would be competing at a 50-to-1 capital disadvantage.",
            nextQuestionId: "g7q5a",
            scoreImpact: 10,
            feedback: "Framing the disadvantage as a capital ratio is compelling and honest, and it supports pivoting the recommendation to the ultra-luxury segment where Tesla's presence is less dominant.",
          },
          {
            id: "b",
            text: "Tesla's success here actually validates consumer demand and lowers VoltLux's market development costs, since buyers are already educated on luxury EVs.",
            nextQuestionId: "g7q5b",
            scoreImpact: -5,
            feedback: "While Tesla's market development work does reduce consumer education costs, the competitive intensity of facing Tesla in their highest-volume segment with 50x less capital is a structural disadvantage that validation cannot overcome.",
          },
          {
            id: "c",
            text: "This can't really be answered without a detailed competitive analysis of Tesla's cost structure.",
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
            text: "Focused on ultra-luxury, VoltLux's realistic addressable market is 620,000 annual units at $96K average, about $60B, with a 1-2% five-year share target.",
            nextQuestionId: "g7q5a",
            scoreImpact: 10,
            feedback: "Anchoring to the right segment, the capital constraint, and a realistic share range gives the investor the specific answer they need. The $600M-$1.2B revenue range is specific and defensible.",
          },
          {
            id: "b",
            text: "VoltLux's realistic addressable market is the total luxury vehicle market, $152B, since brand positioning will eventually attract buyers across every luxury tier.",
            nextQuestionId: "g7q5b",
            scoreImpact: -15,
            feedback: "Eventually attracting buyers across all tiers is a long-term aspiration, not a 5-year addressable market definition. Investors evaluating a seed-stage company need a realistic near-term SAM, not a theoretical long-term TAM.",
          },
          {
            id: "c",
            text: "With $400M, VoltLux cannot realistically address any segment at scale, the minimum capital to launch a new vehicle brand is generally estimated at $1B or more.",
            nextQuestionId: "g7q5c",
            scoreImpact: -5,
            feedback: "Several startups including Rivian, Lucid, and Fisker launched with similar or less capital through targeted segment focus. The $400M constraint narrows the viable segments but does not make entry impossible.",
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
            text: "Enter ultra-luxury first, targeting $600M-$1.2B in year five revenue.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Segment, revenue target, and primary validation condition are all present and well-reasoned. The investor nods and moves to next steps.",
          },
          {
            id: "b",
            text: "Enter ultra-luxury and target 5% share by year five, that's $2.88B in revenue, a bold but defensible ambition to present.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "5% share in year five is aggressive for a brand new entrant, most luxury auto startups target 1-2% in the first five years. The segment choice is right but the share target may raise credibility questions.",
          },
          {
            id: "c",
            text: "Enter ultra-luxury first but hold off on a specific revenue target until the product design and manufacturing partnership are finalized.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Deferring the revenue target in an investor presentation undermines the entire purpose of the market sizing exercise. Investors need a specific number to evaluate, provide one with explicit assumptions.",
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
            text: "With $400M and one vehicle, VoltLux can realistically target ultra-luxury at $80-120K, aiming for 6,000-12,000 vehicles annually by year five. That's a credible first step in a $60B segment with 31% EV penetration already established.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Committing to a specific, capital-appropriate recommendation with a defensible year-five range is what the investor needed. The 31% existing EV penetration makes the demand assumption credible.",
          },
          {
            id: "b",
            text: "Pursue a licensing deal with an existing luxury manufacturer instead of building independently, $400M is insufficient for a standalone launch.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "A licensing recommendation in the middle of an investor presentation for a standalone startup is a fundamental pivot that undermines the entire investment thesis.",
          },
          {
            id: "c",
            text: "Start in a single US metro, California only, to reduce launch costs before considering a national rollout.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "California-first is a valid geographic phasing strategy, but the investor asked what segment VoltLux can address, not just which state. The segment recommendation should lead.",
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
            text: "VoltLux should enter the ultra-luxury segment at $80-120K: 620,000 annual units, 31% existing EV penetration, the best price alignment, moderate Tesla competition.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "All the key elements are present, segment, rationale, revenue target, and primary validation condition. The partner says: that is a much better answer, lead with that in the room.",
          },
          {
            id: "b",
            text: "Target the total US luxury vehicle market, $152B, since brand building takes time and limiting to one segment now will constrain the brand's long-term positioning.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "Leading an investor presentation with a $152B TAM without a specific entry segment is not an investment recommendation, it is a TAM slide.",
          },
          {
            id: "c",
            text: "Say the analysis has too many uncertainties to make a specific entry recommendation without additional consumer research.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Calling for more research at the moment of the investor presentation is not acceptable. The data in front of you is sufficient to make a directional recommendation.",
          },
        ],
      },
    ],
  },
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
    sampleRecommendation: "Close 43 branches in the low-need, poor-economics quadrant, these have 88% digital adoption and negative contribution margins with no strategic rationale to keep them. Transform 110 high-need, poor-economics branches into digital-advisory hubs at $380K cost savings each. Keep the 85 high-performing branches unchanged. This program improves annual contribution by $67M, moving ROE from 7.2% to approximately 8.4%. Reaching 10% ROE additionally requires NIM improvement and overhead reduction, branch optimization alone is not sufficient.",
    idealRecommendation: "Close 43 branches (low-need, poor-economics), transform 110 into digital-advisory hubs saving $380K each annually, keep 85 high-performing branches. Net annual contribution improvement: $67M, improving ROE to approximately 8.4%. Closing the remaining 1.6pp to reach 10% ROE requires NIM improvement from 2.8% to 3.0% and corporate overhead reduction, branch action alone closes only half the gap.",
    keyTakeaways: [
      "Branch optimization is a portfolio decision requiring a two-dimensional framework, customer need for physical service and branch economics, not a single-metric ranking",
      "Customer attrition from branch closures is highly dependent on proximity to the nearest remaining branch and the specific customer mix at each location",
      "Digital advisory hub transformation preserves 92% of branch revenue at 53% of the cost, often superior to both keeping and closing",
      "Branch optimization alone rarely closes an entire ROE gap, it must be combined with asset-liability management and overhead reduction for full impact",
    ],
    questions: [
      {
        id: "g8q1",
        stage: "Framework",
        question: "The CFO wants to close 80 branches immediately based on a single ranking by current profitability. The head of retail banking says this is too blunt and will cause massive attrition. How do you structure the branch optimization decision?",
        options: [
          {
            id: "a",
            text: "Side with the CFO, profitability ranking is the right approach, branches losing money should close, and the attrition risk is overstated since most customers will migrate to digital channels anyway.",
            nextQuestionId: "g8q2b",
            scoreImpact: -5,
            feedback: "Single-metric profitability ranking ignores strategic value such as anchor branches that serve important demographics, CRA obligations in underserved communities, and the fact that some unprofitable branches serve customers who would leave the bank entirely if closed.",
          },
          {
            id: "b",
            text: "Build a two-dimensional framework: customer need for physical banking on one axis, branch economics on the other, four quadrants, avoiding a single-metric ranking.",
            nextQuestionId: "g8q2a",
            scoreImpact: 20,
            feedback: "This two-dimension approach separates the customer value question from the economic question and produces a more defensible and more nuanced recommendation than pure profitability ranking.",
          },
          {
            id: "c",
            text: "Survey customers at each branch on whether they'd leave the bank if it closed, then close only branches where customers say they'd stay through digital channels.",
            nextQuestionId: "g8q2c",
            scoreImpact: -5,
            feedback: "Customer surveys have well-documented bias, customers say they want to keep branches even when they rarely use them. Revealed preference from actual transaction data is far more reliable than stated preference from surveys.",
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
            text: "Keep high-need good-economics, transform high-need poor-economics into digital-advisory hubs, close low-need poor-economics, monitor low-need good-economics.",
            nextQuestionId: "g8q3a",
            scoreImpact: 20,
            feedback: "This protects branches serving customers who need physical banking, recovers cost from the high-need underperformers through transformation, closes the clear candidates, and preserves profitable low-need branches while monitoring their declining strategic value.",
          },
          {
            id: "b",
            text: "Close everything in the two poor-economics quadrants immediately, 153 branches total, any branch losing money destroys shareholder value regardless of customer need.",
            nextQuestionId: "g8q3b",
            scoreImpact: -10,
            feedback: "Closing all 110 high-need poor-economics branches without transformation would eliminate branches serving customers who cannot easily switch to digital. 34% have CRA obligations in underserved communities, closing them would trigger regulatory scrutiny and significant customer attrition.",
          },
          {
            id: "c",
            text: "Keep every high-need branch regardless of economics, and close only the 43 low-need poor-economics branches, the only ones lacking either strategic or financial justification for remaining open.",
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
            text: "Exclude all CRA-designated branches from closure consideration entirely, the regulatory risk outweighs any cost savings.",
            nextQuestionId: "g8q3b",
            scoreImpact: 5,
            feedback: "Excluding all CRA branches is overly conservative. CRA obligations can be met through other means including community development lending and mobile banking outreach. The question is whether each specific branch is the most effective way to fulfill CRA obligations.",
          },
          {
            id: "b",
            text: "Treat CRA as a constraint that changes the decision for some branches.",
            nextQuestionId: "g8q3a",
            scoreImpact: 15,
            feedback: "CRA is a real constraint but not an absolute prohibition on closure. Individual assessment, rather than blanket exclusion, is the more rigorous and commercially defensible position.",
          },
          {
            id: "c",
            text: "Treat CRA designation as non-binding since most banks fulfill CRA obligations without branches anyway, proceed with the original 80-closure plan.",
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
            text: "The 28% stated intention overstates likely attrition, historical branch closures show actual rates of 6-14% depending on proximity to the nearest remaining branch.",
            nextQuestionId: "g8q3a",
            scoreImpact: 15,
            feedback: "Survey-stated attrition intentions are consistently 2-3x higher than actual attrition when branches close. The right analysis uses historical attrition rates from comparable branch closures, not stated preference surveys.",
          },
          {
            id: "b",
            text: "The 28% figure is accurate, it confirms the head of retail banking is right, FirstBank should not close any branches.",
            nextQuestionId: "g8q3b",
            scoreImpact: -10,
            feedback: "Taking stated attrition intentions at face value ignores well-established survey bias. A bank that never closes branches because 28% of customers always say they might leave will never optimize its branch network.",
          },
          {
            id: "c",
            text: "The survey confirms branch closures are high-risk, so FirstBank should only close branches where the 28% potentially-departing customers are low-value accounts with minimal revenue impact.",
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
            text: "Digital-advisory is the right model for the 110 branches: saves $380K per branch annually, retains 92% of revenue, and actually improves NPS by 8 points.",
            nextQuestionId: "g8q4a",
            scoreImpact: 20,
            feedback: "Digital-advisory hubs optimize the economics-revenue-retention tradeoff. The NPS improvement is particularly notable, transforming to a relationship model improves customer satisfaction while cutting costs.",
          },
          {
            id: "b",
            text: "Micro-branch at $285K beats digital-advisory at $420K, the $135K additional savings per branch across 110 branches outweighs the 14pp revenue retention gap.",
            nextQuestionId: "g8q4b",
            scoreImpact: -5,
            feedback: "The $14.85M incremental cost savings must be weighed against the 14pp revenue retention difference. 110 branches averaging $800K in revenue means 14% lower retention equals $12.3M in annual revenue loss, nearly offsetting the cost savings.",
          },
          {
            id: "c",
            text: "ATM-only conversion maximizes cost savings at $755K per branch, and the bank's already-high 67% digital adoption shows customers don't need in-person service.",
            nextQuestionId: "g8q4c",
            scoreImpact: -10,
            feedback: "ATM-only retains only 42% of revenue. For the 110 high-need branches averaging $800K revenue, 58% revenue loss equals $464K per branch. Net savings after revenue loss is less than the digital-advisory model's net benefit per branch, with a catastrophic NPS impact.",
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
| Branch-dependent (&lt;50%)  | 23%            | 34%                  | High            |
| Blended average          | 100%           | 14%                  |                 |`,
        },
        options: [
          {
            id: "a",
            text: "Use the blended 14% rate across all closures, one defensible number for the board that avoids the complexity of branch-by-branch segmentation.",
            nextQuestionId: "g8q4b",
            scoreImpact: 0,
            feedback: "A blended rate applied uniformly misses the fact that different branches have very different customer mixes. A branch with 80% branch-dependent customers faces 34% attrition risk, applying 14% to it significantly understates the revenue at risk.",
          },
          {
            id: "b",
            text: "Model attrition branch-by-branch using the actual customer mix at each location and proximity to the nearest remaining FirstBank branch.",
            nextQuestionId: "g8q4a",
            scoreImpact: 20,
            feedback: "Branch-level customer mix and proximity to the nearest remaining branch are the two most predictive variables for actual attrition. Historical closure data confirms attrition drops to 6% when the nearest branch is within 2 miles.",
          },
          {
            id: "c",
            text: "Apply the branch-dependent rate of 34% to all closed branches as a conservative upper bound, presenting that worst-case scenario.",
            nextQuestionId: "g8q4c",
            scoreImpact: -5,
            feedback: "Using 34% for all closures dramatically overstates revenue at risk for branches with high digital adoption. The worst-case approach might lead the board to reject closures that are genuinely financially sound.",
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
            text: "Raise the closure target to 100 to satisfy the activist, board pressure is real and a recommendation the board rejects has no value.",
            nextQuestionId: "g8q4c",
            scoreImpact: -15,
            feedback: "Changing a recommendation under investor pressure without analytical justification undermines consulting integrity. If 100 closures is not supported by the data, recommending it to satisfy an activist destroys the value of independent analysis.",
          },
          {
            id: "b",
            text: "Keep 43 closures, but also transform 110 into digital-advisory hubs, recovering $380K per branch across 110 branches for $67M total annual contribution improvement.",
            nextQuestionId: "g8q4a",
            scoreImpact: 20,
            feedback: "Quantifying the transformation contribution and showing the activist investor that the total program impact is larger than closure alone is the right response. $67M annual improvement is a meaningful move toward the 10% ROE target.",
          },
          {
            id: "c",
            text: "Acknowledge the activist's point and propose commissioning additional analysis on a further 30-40 branches to find more closure candidates.",
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
|------------------------------------|-------------------|------------------------------|
| Starting ROE                        |                   | 7.2% on $4.2B equity        |
| Branch closures (43 branches)       | +$31M pre-tax     | Savings minus revenue loss  |
| Hub transformations (110 branches)  | +$36M pre-tax     | $41.8M savings minus losses |
| Total branch program                | +$67M pre-tax     |                              |
| After-tax impact ($50M)             |                   |                              |
| Pro-forma net income                |                   | $302M + $50M = $352M        |
| Pro-forma ROE                       | 8.4%              | $352M divided by $4.2B      |
| Gap to 10% target                   | 1.6pp             | Needs $67M more net income  |`,
        },
        options: [
          {
            id: "a",
            text: "Yes, the branch program fully achieves the 10% ROE target since it improves contribution by $67M pre-tax.",
            nextQuestionId: "g8q5a",
            scoreImpact: -10,
            feedback: "The numbers show ROE improving from 7.2% to 8.4%, not 10%. Telling the CEO the target is achieved when the math shows a 1.6pp gap remaining is a credibility failure that will be discovered immediately when the board reviews the analysis.",
          },
          {
            id: "b",
            text: "The program improves ROE from 7.2% to 8.4%, meaningful progress but 1.6pp short of target. Closing the remaining gap requires NIM improvement from 2.8% to 3.0% through better asset-liability management, plus corporate overhead reduction.",
            nextQuestionId: "g8q5a",
            scoreImpact: 20,
            feedback: "Presenting the branch program as a necessary but insufficient step toward 10% ROE, and identifying the additional levers needed, is what the CEO needs to hear to set appropriate board expectations.",
          },
          {
            id: "c",
            text: "This can't be evaluated against ROE without a full model of all bank operations, the calculation as given is too simplified to present to the board.",
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
            text: "His number is right on its own terms, but net of the $14.7M in cost savings from 43 closures, the program still nets $9.9M, a positive result.",
            nextQuestionId: "g8q5a",
            scoreImpact: 10,
            feedback: "Net of attrition, closures still generate $9.9M in annual contribution improvement. The head of retail banking made an error by presenting the revenue loss without netting it against the cost savings.",
          },
          {
            id: "b",
            text: "He's right, $4.8M in annual revenue loss significantly erodes the closure value proposition, and the program should be redesigned to focus on transformation instead of closures.",
            nextQuestionId: "g8q5b",
            scoreImpact: -5,
            feedback: "Accepting his math without netting against cost savings is incomplete. The $4.8M revenue loss must be compared against the $14.7M in cost savings. Net improvement of $9.9M is still significant.",
          },
          {
            id: "c",
            text: "Replace the 14% blended rate with branch-level attrition estimates built from customer mix and proximity to remaining branches, likely reducing the revenue-at-risk estimate.",
            nextQuestionId: "g8q5a",
            scoreImpact: 15,
            feedback: "Branch-level attrition modeling using customer mix and proximity data will produce a more accurate and likely lower revenue at risk estimate than the blended average.",
          },
        ],
      },
      {
        id: "g8q4c",
        stage: "ROE Impact",
        question: "Your recommendation has either been too aggressive or too conservative in response to various stakeholder pressures. The partner pulls you aside before the board meeting: the board needs a number, how many closures and what is the ROE impact?",
        options: [
          {
            id: "a",
            text: "43 closures plus 110 hub transformations, $67M pre-tax improvement, ROE moving from 7.2% to 8.4%. Reaching 10% needs NIM improvement and overhead reduction too.",
            nextQuestionId: "g8q5a",
            scoreImpact: 15,
            feedback: "Specific numbers, specific financial impact, and honest acknowledgment that the branch program alone is not sufficient for the full target. This is what the board needs to make a decision.",
          },
          {
            id: "b",
            text: "100 closures, as the activist investor requested. ROE impact will be higher, and the board is more likely to accept a recommendation aligned with the investor's own stated preference.",
            nextQuestionId: "g8q5b",
            scoreImpact: -15,
            feedback: "Recommending 100 closures to align with investor preference rather than analytical conclusion destroys the value of independent consulting.",
          },
          {
            id: "c",
            text: "43 closures only, a $31M annual improvement moving ROE from 7.2% to 7.9%. The most conservative and most defensible recommendation given the attrition uncertainty.",
            nextQuestionId: "g8q5b",
            scoreImpact: 0,
            feedback: "Presenting only the closure program without the hub transformation understates the full program impact by $36M annually. The 110 hub transformations are a core part of the recommendation and should not be omitted.",
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
            text: "NIM improvement from 2.8% to 3.0% is worth roughly $84M pre-tax, lever one. Lever two is overhead reduction targeting $22M. Both achievable in 18-24 months, reaching approximately 10.2% ROE.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Quantified, sequenced, and closing the loop from the initial ROE gap to the full solution. The board has everything needed to approve the program.",
          },
          {
            id: "b",
            text: "Loan growth and a higher credit risk appetite are the fastest paths to higher ROE, taking on more risk improves returns without requiring harder operational changes.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Recommending increased credit risk appetite as a primary ROE lever is unlikely to be accepted by a bank board facing activist investor pressure, it trades short-term return for long-term risk.",
          },
          {
            id: "c",
            text: "The additional levers are complex bank management decisions needing their own workstreams, approve branch optimization first and address the rest in a follow-on engagement.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Deferring the full ROE solution to a follow-on engagement is a reasonable consulting position but undersells the analysis. The NIM and overhead levers are quantifiable from available data.",
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
            text: "Historical branch closure data from comparable banks shows actual attrition of 6-14% depending on proximity, not the 28% survey figure or the 34% branch-dependent rate.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Using historical revealed-preference data to counter the attrition concern is the right analytical move. Observed behavior from comparable closures is more reliable than any stated preference data.",
          },
          {
            id: "b",
            text: "Acknowledge the board's concern and propose delaying implementation 12 months to gather more attrition data from a pilot closure of 5 branches.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "A pilot is a reasonable risk mitigation approach, but it delays $67M in annual improvement by at least 12 months. The historical data from comparable banks is sufficient to proceed.",
          },
          {
            id: "c",
            text: "Agree that attrition risk is the primary uncertainty and recommend cutting the closure target from 43 to 20 branches until more data is available.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Cutting the recommendation in half under board pressure without new analytical justification undermines the value of the analysis. If the historical data supports 43 closures, that remains the right recommendation.",
          },
        ],
      },
    ],
  },
  {
    id: "g9",
    title: "StreamMax: Breaking the Subscriber Plateau",
    type: "profitability",
    difficulty: "intermediate",
    firm: "bcg",
    estimatedMinutes: 28,
    overview: "A streaming platform has plateaued at 85 million subscribers and is losing ground to competitors. BCG has been engaged to develop a growth strategy.",
    clientBackground: "StreamMax is a US-based streaming service launched in 2016 with 85M subscribers globally, 62M domestic and 23M international. Annual revenue is $12.4B with a 12% EBITDA margin. They spend $8.2B on content annually. Net subscriber adds were negative 2M last quarter. Monthly churn increased from 2.1% to 3.4% over 18 months. Netflix has 238M subscribers, Disney+ has 150M, and HBO Max has 95M. The CEO has set a target of 120M subscribers within three years.",
    yourRole: "You are a BCG project leader on the media and entertainment practice. You are presenting preliminary findings to StreamMax's Chief Growth Officer after three weeks of analysis.",
    startQuestionId: "g9q1",
    finalRecommendationPrompt: "The CGO asks: what is StreamMax's path to 120M subscribers in three years, and what are the three most important strategic moves?",
    sampleRecommendation: "StreamMax can reach 120M subscribers through three moves in sequence. First, launch an ad-supported tier at $4.99/month within six months, 28M churned users cite price as their primary reason for leaving and a lower tier could re-acquire 5-8M at positive economics given ad revenue. Second, expand into India and Brazil with localized content investment, both markets represent 15-20M additional addressable subscribers at $3-6/month. Third, pivot the incremental content dollar toward unscripted and sports-adjacent programming, which delivers 81-84% retention rates at 60-75% lower cost per hour than original drama.",
    idealRecommendation: "Three moves: (1) Ad-supported tier launch, re-acquires 5-8M price-sensitive churners while attracting new lower-income subscribers. (2) India and Brazil international expansion, 15-20M additional subscribers in growing markets. (3) Content mix optimization toward unscripted and sports-adjacent content with higher retention per dollar. Combined, these three moves can add 35-40M subscribers over three years, reaching the 120M target.",
    keyTakeaways: [
      "In subscription businesses, churn reduction compounds more powerfully than new subscriber acquisition, 1pp monthly churn reduction retained over 12 months equals more than 10% new subscriber growth",
      "Ad-supported tiers are a proven mechanism to expand TAM for streaming platforms without cannibalizing the premium subscriber base significantly",
      "Content ROI varies enormously by genre, unscripted content often delivers better retention per dollar than prestige drama despite having lower cultural cachet",
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
            text: "Compare the content library against every competitor to identify specific catalog gaps by genre and release cadence, since streaming churn is fundamentally a content depth problem.",
            nextQuestionId: "g9q2b",
            scoreImpact: 5,
            feedback: "Content gap analysis is relevant but assumes the diagnosis before completing it. Churn can be driven by price, content, competing services, or technical experience, you need data before assuming content is the primary driver.",
          },
          {
            id: "b",
            text: "Pull exit survey data from churned subscribers, then cross-reference with behavioral consumption data to separate true causes from stated causes.",
            nextQuestionId: "g9q2a",
            scoreImpact: 20,
            feedback: "Combining stated reasons with behavioral data is the most rigorous way to identify true churn drivers. Subscribers often cite one reason when the behavioral pattern points to another.",
          },
          {
            id: "c",
            text: "Benchmark StreamMax's price against every major competitor first, to check whether pricing is the obvious cause before investing in more complex analysis.",
            nextQuestionId: "g9q2c",
            scoreImpact: 5,
            feedback: "Pricing benchmarking is quick and useful, but as a standalone starting point it is too narrow. Price may be one of several churn drivers, going straight to price analysis before reviewing the full exit data may cause you to miss equally important factors.",
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
            text: "Price sensitivity is the primary driver at 34% and growing 18pp, which points directly to an ad-supported tier as the highest-priority intervention.",
            nextQuestionId: "g9q3a",
            scoreImpact: 15,
            feedback: "Price is the largest and fastest-growing churn reason, making an ad-supported tier the logical first response. The +18pp growth also tells you this is a worsening problem, not a stable one.",
          },
          {
            id: "b",
            text: "Switching to competitors at 22% is the most actionable insight, so the focus should be competitive differentiation rather than price.",
            nextQuestionId: "g9q3b",
            scoreImpact: 0,
            feedback: "Switching to competitors is a symptom, not a root cause, customers switch because of price, content gaps, or both. Treating it as a standalone driver leads to a competitive response that does not address the underlying reasons.",
          },
          {
            id: "c",
            text: "Content gaps at 28% growing 11pp, combined with price at 34% growing 18pp, together represent 62% of churn, suggesting a dual intervention: a lower-priced tier plus a content library improvement.",
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
            text: "The retention data contradicts that directly, unscripted at 81% versus drama at 68% means spending more on drama would hurt retention per dollar.",
            nextQuestionId: "g9q3b",
            scoreImpact: 15,
            feedback: "The retention comparison is the key insight, chasing Netflix on drama with lower budgets will produce inferior results per dollar compared to investing where StreamMax already outperforms.",
          },
          {
            id: "b",
            text: "Agree with the CGO, the Netflix drama gap is the most visible competitive disadvantage and closing it will require significant investment.",
            nextQuestionId: "g9q3c",
            scoreImpact: -10,
            feedback: "Agreeing with the CGO because the drama gap is visible while ignoring the retention data is letting brand perception override financial analysis.",
          },
          {
            id: "c",
            text: "Suggest a balanced approach, invest equally in drama and unscripted, addressing the competitive gap while still leveraging the retention advantage in unscripted content.",
            nextQuestionId: "g9q3b",
            scoreImpact: 5,
            feedback: "A balanced approach is safer politically but sub-optimal analytically. The retention data makes a clear argument for shifting the incremental dollar toward unscripted.",
          },
        ],
      },
      {
        id: "g9q2c",
        stage: "Churn Diagnosis",
        question: "Pricing benchmarking shows StreamMax at $14.99 standard tier, the same as Netflix standard. Disney+ offers $7.99 with ads. HBO Max offers $9.99 with ads. StreamMax has no ad-supported tier. The CGO says: we should raise prices to signal premium positioning. How do you evaluate this suggestion?",
        options: [
          {
            id: "a",
            text: "Raising prices while churn is already increasing, and while every competitor offers a cheaper ad-supported tier, is likely to accelerate subscriber loss. Premium positioning needs product differentiation, which StreamMax doesn't have today.",
            nextQuestionId: "g9q3a",
            scoreImpact: 15,
            feedback: "Price increases work for premium positioning only when accompanied by product differentiation. Without a clear reason why StreamMax is worth more than Netflix, raising prices will accelerate the churn problem.",
          },
          {
            id: "b",
            text: "Agree with the CGO, premium positioning is a valid strategy and some subscriber loss from price-sensitive customers is acceptable if it improves brand perception.",
            nextQuestionId: "g9q3c",
            scoreImpact: -10,
            feedback: "Without product differentiation to justify the premium, raising prices in a market where churn is already rising will accelerate net subscriber loss.",
          },
          {
            id: "c",
            text: "The pricing data actually argues for adding a lower tier rather than raising prices, being the only major streaming service without an ad-supported option is a structural disadvantage.",
            nextQuestionId: "g9q3a",
            scoreImpact: 10,
            feedback: "Good insight from the pricing comparison. The absence of an ad-supported tier is increasingly anomalous in the market and prevents StreamMax from competing for a large segment of potential subscribers.",
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
            text: "The CFO is correct, 14% gross margin versus 45% for standard means every ad tier subscriber generates far less value. Don't launch it.",
            nextQuestionId: "g9q4b",
            scoreImpact: -10,
            feedback: "This ignores the most important variable, incremental subscribers. A 14% gross margin on users who would otherwise not be subscribers at all is better than 0% on churned users.",
          },
          {
            id: "b",
            text: "The relevant comparison is ad tier revenue versus zero revenue from churned and low-income subscribers who won't pay $14.99. At $9.49 blended revenue versus $0, the ad tier creates value.",
            nextQuestionId: "g9q4a",
            scoreImpact: 20,
            feedback: "The ad tier is not competing against the standard tier, it is competing against the absence of subscription revenue from customers who cannot afford or will not pay the standard price.",
          },
          {
            id: "c",
            text: "The ad tier only makes sense if the cannibalization rate from standard-tier downgrades stays below 15%, the CFO should commission a full conjoint study before proceeding.",
            nextQuestionId: "g9q4b",
            scoreImpact: 5,
            feedback: "Cannibalization is a real risk and the 15% threshold framing is valid. However, deferring the decision pending additional research delays an urgently needed intervention. Netflix's experience shows cannibalization rates around 20%, the net economics still favor launching.",
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
            text: "Eliminate all original drama spending immediately, redirect the full $6.4B drama budget to unscripted, the retention data is unambiguous.",
            nextQuestionId: "g9q4c",
            scoreImpact: -10,
            feedback: "Original drama still accounts for 42% of viewing hours and is why many subscribers joined. A sudden complete elimination would cause massive subscriber loss from drama fans before the unscripted investment generates equivalent engagement.",
          },
          {
            id: "b",
            text: "Keep the existing drama slate as a retention anchor, shift the incremental content dollar toward unscripted and sports-adjacent content, targeting a 60-40 split over three years.",
            nextQuestionId: "g9q4a",
            scoreImpact: 20,
            feedback: "Protecting the existing drama base that viewers already depend on while redirecting the marginal investment toward higher-retention genres is the balanced, commercially sound recommendation.",
          },
          {
            id: "c",
            text: "Split 50-50 between drama and all other genres, equal investment hedges against the possibility that unscripted's retention edge is a temporary preference shift.",
            nextQuestionId: "g9q4b",
            scoreImpact: 5,
            feedback: "50-50 is more balanced than the current 78% drama allocation but is not fully justified by the data. The retention differential argues for shifting more aggressively than 50-50.",
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
            text: "An additional $1.5B in drama produces content competitors can match in subsequent years.",
            nextQuestionId: "g9q4b",
            scoreImpact: 15,
            feedback: "Drama spending arms races in streaming tend to be zero-sum, every dollar invested raises the competitive bar, not just StreamMax's position. Unscripted content is harder to replicate and delivers better retention per dollar.",
          },
          {
            id: "b",
            text: "Yes, closing the drama gap with Netflix is the most direct path to stopping churn, content quality is the primary driver of subscriber retention.",
            nextQuestionId: "g9q4c",
            scoreImpact: -5,
            feedback: "This assumes content quality is the primary churn driver without consulting the exit survey data. Price is the largest stated reason at 34%, and unscripted content already outperforms drama on retention metrics.",
          },
          {
            id: "c",
            text: "Commission audience research first to check whether StreamMax subscribers actually want more drama before committing $1.5B.",
            nextQuestionId: "g9q4b",
            scoreImpact: 0,
            feedback: "Additional research is always tempting but $1.5B content investment decisions require acting on the best available data, not waiting for perfect information. The existing retention data is a strong signal.",
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
            text: "Run all six initiatives in parallel, total upside is 29-44M subscribers, well above the 35M needed for 120M.",
            nextQuestionId: "g9q5a",
            scoreImpact: 5,
            feedback: "Running all six simultaneously risks organizational overload and execution dilution. More importantly, some initiatives are prerequisites for others, churn reduction should precede international expansion.",
          },
          {
            id: "b",
            text: "Sequence it: ad tier and password sharing first for quick wins, churn reduction and content mix shift next, then India and Brazil expansion.",
            nextQuestionId: "g9q5a",
            scoreImpact: 20,
            feedback: "Quick wins first build momentum and fund the larger investments. Churn reduction before international expansion ensures you are not pouring new subscribers into a leaky bucket.",
          },
          {
            id: "c",
            text: "Focus only on India expansion, at 7-10M subscribers it has the highest single-initiative upside, and emerging-market growth is the fastest path to scale.",
            nextQuestionId: "g9q5b",
            scoreImpact: -5,
            feedback: "Single-initiative focus misses the compounding benefit of multiple smaller interventions. India also has the longest timeline at 18-24 months, quick wins from the ad tier and password sharing are available in 6 months.",
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
            text: "The ad-supported tier is the fastest path, targeting the 28M churned users who cited price, even a 15-20% re-acquisition rate yields 4-6M subscribers.",
            nextQuestionId: "g9q5a",
            scoreImpact: 15,
            feedback: "The ad tier re-acquisition math is compelling and the 12-month timeline is achievable. Targeting churned subscribers specifically is more efficient than acquiring brand-new subscribers.",
          },
          {
            id: "b",
            text: "A major marketing spend increase, $500M focused entirely on US subscriber acquisition campaigns, since brand awareness gaps are the primary factor limiting growth.",
            nextQuestionId: "g9q5b",
            scoreImpact: -10,
            feedback: "StreamMax is a well-known brand in the US with 62M domestic subscribers. Awareness is not the constraint. The exit survey data clearly shows price and content gaps are driving churn.",
          },
          {
            id: "c",
            text: "Strategic partnerships with mobile carriers to bundle StreamMax with mobile plans, driving subscriber growth through embedded distribution.",
            nextQuestionId: "g9q5b",
            scoreImpact: 5,
            feedback: "Carrier bundling can drive subscriber growth but requires 12-18 months of negotiation and integration before meaningful volume materializes. It is slower than an ad tier launch.",
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
            text: "Keep the existing drama slate at roughly $6B, redirecting $800M of incremental budget to unscripted and sports-adjacent content.",
            nextQuestionId: "g9q5a",
            scoreImpact: 10,
            feedback: "Specific dollar allocation, specific ratio shift, and quantified retention impact gives the board exactly what it needs. This is the balanced recommendation that protects the base while improving marginal ROI.",
          },
          {
            id: "b",
            text: "Recommend a comprehensive content strategy review taking six months before committing to any reallocation.",
            nextQuestionId: "g9q5b",
            scoreImpact: -10,
            feedback: "A six-month review of content strategy when the company is losing subscribers is not acceptable. The retention data already in hand is sufficient to make a directional recommendation.",
          },
          {
            id: "c",
            text: "Cut the total content budget from $8.2B to $6B and redirect the savings to subscriber acquisition marketing.",
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
            text: "One, launch the ad tier within six months to re-acquire 5-8M churners. Two, expand into India and Brazil. Three, shift content dollars toward unscripted and sports-adjacent programming.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Sequenced correctly, quick win first, then growth markets, then structural improvement. Each move is specific, has a subscriber impact range, and builds on the diagnostic findings.",
          },
          {
            id: "b",
            text: "One, increase drama content spending by $1.5B to close the Netflix gap. Two, raise prices to $17.99 to signal premium positioning. Three, launch in every emerging market simultaneously.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "All three recommendations contradict the diagnostic findings. More drama investment has lower retention ROI than unscripted. Price increases accelerate churn when price is already the top churn reason.",
          },
          {
            id: "c",
            text: "One, cut churn from 3.4% to 2.5% through service improvements and content investment. Two, add 5M subscribers through an ad tier. Three, expand internationally to add 10M more.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Directionally right but the churn reduction framing is vague, how specifically? The other two moves are clear and the sequencing is reasonable.",
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
            text: "The path to 120M requires 35M incremental subscribers over three years from three sources: 5-8M from an ad-supported tier re-acquiring price-sensitive churners.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "Clear subscriber source breakdown, specific range estimates, and the math adds up to the 120M target. The CEO can present this to the board as a credible growth roadmap.",
          },
          {
            id: "b",
            text: "120M in three years is unrealistic given current churn, 105M is a more achievable target, and the CEO should reset board expectations.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Telling the CGO to lower the CEO's ambition as a first move is not a growth strategy. The initiative analysis shows 29-44M subscriber upside is achievable, 120M is within range at the midpoint.",
          },
          {
            id: "c",
            text: "The path to 120M requires a fundamental repositioning of StreamMax as a premium service with exclusive content partnerships, a two-to-three-year transformation rather than a series of tactical moves.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Repositioning as strategy is valid long-term thinking but not actionable for a CEO going into a board meeting about hitting a specific subscriber target in three years.",
          },
        ],
      },
    ],
  },
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
    sampleRecommendation: "Enter Vietnam and the Philippines as the first two markets. Vietnam has the most favorable competitive dynamics, Grab's share is lower than regional average and growth is fastest at 28%. The Philippines has the second-lowest Grab concentration and a large urban population in Manila. Entry mode should be organic launch rather than acquisition, the two qualified acquisition targets are priced at premiums not justified by their market positions. Total entry investment: $280M over 18 months covering licensing, driver incentives, customer acquisition, and technology localization.",
    idealRecommendation: "Enter Vietnam and the Philippines first. Vietnam has the most attractive competitive dynamics and fastest growth. Philippines has a large urban market with manageable competitive intensity. Organic entry with $280M investment over 18 months is preferred over acquisition, available targets are overpriced. Driver incentive programs and a lower commission rate than Grab are the primary acquisition levers.",
    keyTakeaways: [
      "Market entry sequencing should prioritize markets where competitive intensity is lowest and growth is highest, not just where the market is largest",
      "Entry mode decision, organic versus acquisition, depends on the availability of reasonably priced targets and the time pressure of the market opportunity",
      "In platform businesses, driver supply drives demand, acquiring drivers is as important as acquiring riders in the early market entry phase",
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
            text: "Rank countries by total market size and enter the largest first, scale creates the most opportunity to build a competitive position quickly.",
            nextQuestionId: "g10q2b",
            scoreImpact: -5,
            feedback: "Market size alone ignores competitive intensity, regulatory barriers, and growth rate. The largest markets are often the most competitive, entering where Grab is strongest is not the right first move for a new entrant with $800M in capital.",
          },
          {
            id: "b",
            text: "Score each market on three dimensions: market attractiveness, competitive intensity, and entry feasibility, avoiding a single-metric filter.",
            nextQuestionId: "g10q2a",
            scoreImpact: 20,
            feedback: "Market attractiveness tells you if it is worth entering, competitive intensity tells you how hard it will be, and entry feasibility tells you whether RideMax specifically can win. All three are required for a sound market entry recommendation.",
          },
          {
            id: "c",
            text: "Focus exclusively on the regulatory environment, ride-sharing regulation is the primary entry barrier in Asia, so favorable regulation should be the filter before anything else.",
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
            text: "Indonesia and Thailand, Indonesia is the largest market and Thailand has favorable regulation, size and regulatory ease should take priority.",
            nextQuestionId: "g10q3b",
            scoreImpact: -5,
            feedback: "Indonesia has Gojek at 32% entrenched alongside Grab at 58%, a combined 90% duopoly that would leave RideMax competing for 10% of the market. Thailand has Grab at 71%, the highest in the region. These are the two most competitively hostile markets.",
          },
          {
            id: "b",
            text: "Vietnam and Philippines, Vietnam has the fastest growth and lowest Grab share.",
            nextQuestionId: "g10q3a",
            scoreImpact: 20,
            feedback: "Vietnam combines fastest growth with lowest competitive intensity among the five markets. Philippines adds a second market with manageable Grab share and strong RideMax strategic fit.",
          },
          {
            id: "c",
            text: "Thailand and Vietnam, both have favorable regulatory environments, and Vietnam's growth is the region's highest, making it the clear priority.",
            nextQuestionId: "g10q3a",
            scoreImpact: 5,
            feedback: "Vietnam is correctly identified but Thailand with Grab at 71% market share is not the right second market. The Philippines with 22% growth and lower Grab concentration is a better second choice than Thailand.",
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
            text: "No. 90% duopoly concentration leaves RideMax competing for 10% of the market, effectively a $480M opportunity, smaller than Vietnam's addressable share.",
            nextQuestionId: "g10q3a",
            scoreImpact: 15,
            feedback: "Addressable share given competitive intensity is the right metric, raw market size overstates the opportunity in highly concentrated markets. This insight reorders the priority ranking significantly.",
          },
          {
            id: "b",
            text: "Yes, large markets justify entry even at high concentration, the absolute opportunity is large enough to build a viable business even as a minor player with 5% share.",
            nextQuestionId: "g10q3b",
            scoreImpact: -10,
            feedback: "5% of a market dominated by two well-capitalized incumbents is not a viable strategic position, it requires sustaining losses indefinitely without a path to competitive differentiation.",
          },
          {
            id: "c",
            text: "The duopoly is actually an opportunity, two players competing intensely against each other can let a third entrant exploit the conflict.",
            nextQuestionId: "g10q3b",
            scoreImpact: 0,
            feedback: "The third-player opportunity thesis can work in some markets but requires identifying a specific underserved segment. In Indonesia, Grab and Gojek are competing intensely across all segments, the market is fully contested.",
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
            text: "Among the three, pick Vietnam and Malaysia, both have above-average SEA growth and neither has Grab above 75% share.",
            nextQuestionId: "g10q3a",
            scoreImpact: 10,
            feedback: "Vietnam is the right choice and Malaysia is a reasonable second given the regulatory constraint. However, the Philippines, despite moderate regulation, has better growth and RideMax fit than Malaysia.",
          },
          {
            id: "b",
            text: "Vietnam and Thailand, Vietnam has the highest growth at 28% and Thailand is the second-largest favorable-regulation market.",
            nextQuestionId: "g10q3b",
            scoreImpact: -5,
            feedback: "Thailand has Grab at 71%, the highest share in the favorable-regulation group. Selecting it over the Philippines despite higher competitive concentration prioritizes regulatory ease over competitive attractiveness.",
          },
          {
            id: "c",
            text: "Reconsider the Philippines despite moderate regulation, its growth and RideMax fit may outweigh the complexity.",
            nextQuestionId: "g10q3a",
            scoreImpact: 15,
            feedback: "The Philippines' combination of growth, competitive room, and RideMax fit may justify accepting moderate regulatory complexity. A strong growth market with manageable competition is often worth more than an easy regulatory environment with heavy incumbent dominance.",
          },
        ],
      },
      {
        id: "g10q3a",
        stage: "Entry Mode",
        question: "You have identified Vietnam and the Philippines as the priority markets. Now determine the entry mode. An investment bank has identified two acquisition targets, one in each country. Should RideMax enter via acquisition or organic launch?",
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
            text: "Acquire both targets, the 6-9 months saved in each market is worth the additional $180-280M, and inheriting an existing driver network avoids the hardest part of the platform cold-start problem.",
            nextQuestionId: "g10q4b",
            scoreImpact: 5,
            feedback: "Acquisition is faster but the valuations need scrutiny. $95M for 18% share in a $1.8B market implies a $527M total market valuation, 29x revenue for a ride-hailing company with minority market position. That premium needs to be justified.",
          },
          {
            id: "b",
            text: "Organic launch is preferred, the acquisition targets sit at minority-share positions priced at 25-30x revenue, too expensive for what they bring to the table.",
            nextQuestionId: "g10q4a",
            scoreImpact: 20,
            feedback: "The acquisition valuations are not supported by the market positions on offer. Organic launch preserves capital for driver and customer incentives, which in platform businesses are the real competitive weapons during market entry.",
          },
          {
            id: "c",
            text: "Acquire the Vietnam target only, 18% share is more strategic in a high-growth market, and launch organically in the Philippines.",
            nextQuestionId: "g10q4a",
            scoreImpact: 10,
            feedback: "Differentiated approach is reasonable but the Vietnam valuation also looks expensive at $95M for 18% share. The core question is whether the acquired driver network and brand accelerate market position enough to justify the premium.",
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
            text: "Acquisition only provides immediate scale if the target is large enough to matter competitively. Buying a 10-18% share company in a Grab-dominated market leaves you in a weak starting position, that capital is better spent on driver incentives for organic launch in more favorable markets.",
            nextQuestionId: "g10q4a",
            scoreImpact: 15,
            feedback: "Acquisition of a minority-share player in a Grab-dominated market does not solve the fundamental competitive problem, you still need to take share from Grab. The capital efficiency of organic launch in Vietnam and the Philippines is superior.",
          },
          {
            id: "b",
            text: "Agree with the CEO, acquisition is the only path to immediate scale, RideMax should buy the largest available target in each priority market, even at a premium.",
            nextQuestionId: "g10q4b",
            scoreImpact: -5,
            feedback: "Speed-driven acquisition at any price can destroy value. The acquisitions available are minority-share positions at expensive multiples, and they reduce the capital available for the incentive wars that actually determine market entry outcomes.",
          },
          {
            id: "c",
            text: "Ask whether the 18-month timeline is truly fixed, if it can extend to 24 months, organic launch becomes more viable and avoids the acquisition premium.",
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
            text: "$280M is sufficient given the market sizes, Vietnam at $1.8B and the Philippines at $1.4B are smaller than Indonesia or Thailand, so incentive-based entry doesn't need that scale of capital.",
            nextQuestionId: "g10q5a",
            scoreImpact: 10,
            feedback: "The smaller market sizes mean lower absolute incentive spending is needed to move the market. The allocation also correctly weights driver incentives at $110M as the largest line, driver supply is the primary competitive weapon during market entry.",
          },
          {
            id: "b",
            text: "The $110M in driver incentives is the most important line, in a platform business.",
            nextQuestionId: "g10q5a",
            scoreImpact: 20,
            feedback: "Identifying driver incentives as the strategic center of the investment allocation demonstrates understanding of platform economics. Without driver supply, customer acquisition marketing has nothing to fulfill.",
          },
          {
            id: "c",
            text: "$280M is insufficient, Grab spent over $1B per market to establish its position and RideMax would need at least $500M to credibly challenge them in two markets simultaneously.",
            nextQuestionId: "g10q5b",
            scoreImpact: -5,
            feedback: "Grab's $1B+ per market was spent establishing first-mover position across all of SEA simultaneously. RideMax is entering specifically chosen smaller markets where the competitive environment is less entrenched.",
          },
        ],
      },
      {
        id: "g10q4b",
        stage: "Investment Sizing",
        question: "You are pursuing an acquisition-led strategy. The CFO points out that the two acquisitions plus integration costs would total $400-440M, leaving only $360-400M for market operations. Is this enough for a credible post-acquisition competitive push?",
        options: [
          {
            id: "a",
            text: "The remaining $360-400M is sufficient, the acquisitions bring an existing driver network and customer base that reduce the organic incentive spending required.",
            nextQuestionId: "g10q5a",
            scoreImpact: 5,
            feedback: "This argument has some merit, acquired networks do reduce cold-start costs. However, the incentive wars required to take share from Grab still require substantial capital regardless of starting position, and $360M may be tight across two markets.",
          },
          {
            id: "b",
            text: "The split is too tight. $440M in acquisition plus integration leaves an average of $180M per market for operations.",
            nextQuestionId: "g10q5b",
            scoreImpact: 15,
            feedback: "The capital asymmetry is the core problem with acquisition-led strategy at this capital level. Grab has more than enough capital to respond with counter-incentives that exhaust RideMax's remaining budget in each market.",
          },
          {
            id: "c",
            text: "Request an additional $200M from the board to fund both acquisitions plus sufficient operational capital.",
            nextQuestionId: "g10q5a",
            scoreImpact: 0,
            feedback: "Requesting additional capital is a valid option but should come after exhausting the alternatives within the existing budget. The organic entry approach in Vietnam and the Philippines accomplishes the market entry goal within $800M.",
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
            text: "Enter Vietnam and Philippines organically. Vietnam: highest growth, lowest Grab share. Philippines: strong growth, manageable Grab share. Total investment $280M, targeting 8-12% share by month 18.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Country selection justified, entry mode justified, capital allocation specific, and a market share target provides a measurable outcome for the board to evaluate performance against.",
          },
          {
            id: "b",
            text: "Enter Indonesia and Thailand, they're the largest markets, and market size is ultimately the most important determinant of long-term platform value in ride-sharing.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "This contradicts the entire market entry analysis. Indonesia has a 90% duopoly and Thailand has Grab at 71%, entering these markets with $800M would result in losses without establishing a viable competitive position.",
          },
          {
            id: "c",
            text: "Enter Vietnam first and use the results to determine whether the Philippines entry is warranted, rather than committing capital to both markets simultaneously.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Staged entry is more conservative and reduces risk, but the CEO's mandate is two markets within 18 months. Sequential entry means the Philippines launch would begin after Vietnam results are in, potentially pushing the second market beyond the window.",
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
            text: "Vietnam and Philippines via organic entry at $280M, driver incentives as the primary deployment. Vietnam first given superior growth, Philippines second within 18 months.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "The core recommendation is correct, the right countries, the right entry mode, and the right capital allocation priority. The partner says: that is the answer, now build the supporting analysis.",
          },
          {
            id: "b",
            text: "Tell the CEO the $800M budget is insufficient for a credible SEA entry and recommend deferring expansion until RideMax raises an additional $500M.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Recommending to defer the entire international expansion because earlier analysis was flawed is an overreaction. The organic entry into Vietnam and the Philippines is achievable within $280M, well within the $800M budget.",
          },
          {
            id: "c",
            text: "Recommend a partnership approach with Grab instead of independent entry, technology sharing and a revenue split could benefit both companies.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Partnering with the dominant competitor you were hired to compete against is a strategic pivot that fundamentally changes the nature of the engagement. The client hired Bain to develop an independent market entry strategy.",
          },
        ],
      },
    ],
  },
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
    sampleRecommendation: "Three changes: First, deploy predictive maintenance using AirCore's existing ACARS sensor data, $45M investment, estimated 55-65% reduction in unplanned component failures, $180M annual savings. Second, implement demand-sensing inventory optimization for parts, $12M investment, reduces AOG events, $67M annual savings. Third, redesign technician scheduling based on aircraft rotation patterns, $8M investment, reduces overtime and improves productivity, $45M annual savings. Total investment $65M, total annual savings $292M.",
    idealRecommendation: "Three changes: (1) Predictive maintenance on ACARS data, $45M, $180M annual savings. (2) Parts inventory optimization, $12M, $67M savings. (3) Technician scheduling redesign, $8M, $45M savings. Combined $65M investment generates $292M in annual savings, payback under 3 months.",
    keyTakeaways: [
      "In maintenance operations, separating unplanned from planned downtime is essential, they have fundamentally different root causes and solutions",
      "Predictive maintenance using existing sensor data is often the highest-ROI intervention because the data already exists but is not being used",
      "Inventory management is frequently the hidden culprit in maintenance delays, parts availability is as critical as technician availability",
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
            text: "Split the diagnostic into people, parts, and processes: technician headcount and coverage under people, inventory turns and lead times under parts.",
            nextQuestionId: "g11q2a",
            scoreImpact: 20,
            feedback: "This three-bucket split is MECE and covers every input to a maintenance operation. Structuring the diagnostic this way means no major category gets missed before you even open the delay data.",
          },
          {
            id: "b",
            text: "Pull the delay log first, since that is what is actually costing AirCore money, and trace whichever categories are rising fastest back to their operational causes.",
            nextQuestionId: "g11q2b",
            scoreImpact: 10,
            feedback: "Starting from the delay data is a reasonable entry point and it will surface where the problem concentrates. The risk is anchoring on symptoms rather than causes, but here the categories map cleanly enough to causes that this route still gets you there.",
          },
          {
            id: "c",
            text: "Skip the data pull and start with the maintenance floor, sitting down with the most senior technicians at each of the six bases first.",
            nextQuestionId: "g11q2c",
            scoreImpact: 0,
            feedback: "Floor interviews are valuable and belong in the diagnostic, but leading with them before any structure risks collecting anecdotes rather than evidence. A framework gives those same conversations somewhere to land analytically.",
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
            text: "Technician availability, up 12%, is the one lever AirCore can pull directly through scheduling changes. Start there.",
            nextQuestionId: "g11q3c",
            scoreImpact: -10,
            feedback: "That category is only 2,646 hours, the smallest of the major buckets, and it's growing at roughly a third the rate of the two largest categories. Chasing the fix that's easiest to control rather than the one that's actually driving the number is a prioritization trap.",
          },
          {
            id: "b",
            text: "Unplanned component failure and AOG parts events combine for 30,832 hours, 76% of total delay hours.",
            nextQuestionId: "g11q3a",
            scoreImpact: 20,
            feedback: "The arithmetic checks out: 15,424 plus 15,408 is 30,832, which is 76% of total delay hours, and both categories are outpacing the overall average by a wide margin. That combination points squarely at a predictive-maintenance gap and a supply chain breakdown.",
          },
          {
            id: "c",
            text: "Third-party vendor delays, up 31%, deserve the most scrutiny precisely because they sit outside AirCore's direct control.",
            nextQuestionId: "g11q3b",
            scoreImpact: 0,
            feedback: "Third-party delays account for 3,528 hours, about 9% of the total. The external-control argument has some logic to it, but spending analytical energy on a 9% category while a combined 76% goes unexamined is misallocated focus.",
          },
        ],
      },
      {
        id: "g11q2b",
        stage: "Delay Analysis",
        question: "The delay data shows unplanned component failures up 67% and AOG parts events up 89%. These two categories together are 76% of delay hours. The COO says: both feel like a technician shortage problem, we need to hire more people. How do you respond?",
        options: [
          {
            id: "a",
            text: "Point to the headcount trend: technicians grew only 3% while delays grew 34%.",
            nextQuestionId: "g11q3a",
            scoreImpact: 20,
            feedback: "Using the actual headcount data to test the COO's hypothesis, rather than just accepting or rejecting it on instinct, is the right move. The failure pattern in the data lines up with predictive maintenance and inventory, not staffing.",
          },
          {
            id: "b",
            text: "Tell the COO the instinct is worth taking seriously and ask for 30 days to build a full workforce capacity model before recommending for or against hiring.",
            nextQuestionId: "g11q3b",
            scoreImpact: -5,
            feedback: "The data already in hand, technician delays up only 12% against 34% overall and headcount up 3%, is enough to form a view. Asking for a month before saying anything just delays a conclusion that's already visible in the numbers.",
          },
          {
            id: "c",
            text: "Agree that staffing is always part of the picture in a maintenance operation and fold a 200-technician hiring plan into the broader improvement program.",
            nextQuestionId: "g11q3c",
            scoreImpact: -10,
            feedback: "Committing to 200 hires on instinct, before the diagnostic even confirms staffing is a driver, risks spending real capital on a fix that may not touch either of the two actual root causes.",
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
            text: "Map both themes onto the parts and processes buckets from the MECE framework, then pull the delay data to size which one matters more.",
            nextQuestionId: "g11q3a",
            scoreImpact: 15,
            feedback: "Translating field observations into the quantitative framework is the right move here. The delay data will confirm both are indeed the two largest categories, which validates what technicians on the floor were already telling you.",
          },
          {
            id: "b",
            text: "Before touching the numbers, go back and interview supervisors and base managers at each location to confirm the front-line technicians' view is representative.",
            nextQuestionId: "g11q3b",
            scoreImpact: 0,
            feedback: "More interviews add context, but two consistent themes surfacing independently across multiple bases is already a strong signal. Layering on more qualitative rounds before touching the quantitative data risks stalling the diagnostic.",
          },
          {
            id: "c",
            text: "Prioritize the parts problem first since it's the operationally simpler fix, inventory is a logistics exercise, whereas predictive maintenance means a technology build.",
            nextQuestionId: "g11q3a",
            scoreImpact: 5,
            feedback: "Ease of implementation is a fair secondary factor, but impact should drive the initial prioritization. As it happens the data will show both categories are large enough to warrant action.",
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
            text: "On average 54% of component failures are predictable with sensor data AirCore already collects, it just isn't used that way.",
            nextQuestionId: "g11q4a",
            scoreImpact: 20,
            feedback: "This is the crux of it. The data already exists, so there's no hardware buildout required, only analytics and data science to turn ACARS feeds into predictive failure detection.",
          },
          {
            id: "b",
            text: "Cabin systems has the highest failure count at 1,140 and should be the lead priority simply on volume, even with only 15% of those failures being sensor-predictable.",
            nextQuestionId: "g11q4b",
            scoreImpact: -5,
            feedback: "Cabin systems has the most failures, but with 15% predictability, full sensor coverage there would only catch about 171 of them. Engines and hydraulics, at 71-78% predictability, offer far more leverage per dollar invested.",
          },
          {
            id: "c",
            text: "The fact that even competitors treat cabin systems reactively confirms reactive maintenance is fine for that category. Concentrate exclusively on engine and hydraulics.",
            nextQuestionId: "g11q4a",
            scoreImpact: 10,
            feedback: "Correctly ruling out cabin systems, reactive maintenance is indeed industry norm there. Engines and hydraulics are the strongest targets, though narrowing to only those two leaves avionics, at 62% predictability, off the table when it belongs in the full recommendation.",
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
            text: "Three factors compound: demand forecasting has broken down so parts aren't at the right bases, supplier lead times have deteriorated, and rising excess inventory ties up capital.",
            nextQuestionId: "g11q4a",
            scoreImpact: 20,
            feedback: "This covers the full picture. Rising obsolete inventory alongside a falling fill rate and thin critical-parts distribution is the textbook signature of a forecasting breakdown.",
          },
          {
            id: "b",
            text: "Supplier lead time nearly doubling, from 4.6 to 8.2 days, is the headline number and the clearest driver of AOG events. Fix it through supplier contract renegotiation.",
            nextQuestionId: "g11q4b",
            scoreImpact: 5,
            feedback: "Lead time deterioration is a real contributor, but a fill rate that dropped from 84% to 67% and critical parts sitting at only 34% of bases points at an internal forecasting and distribution failure as the bigger driver.",
          },
          {
            id: "c",
            text: "Excess and obsolete inventory at 28% is the root cause, capital locked up in the wrong parts starves purchasing power for the right ones.",
            nextQuestionId: "g11q4a",
            scoreImpact: 10,
            feedback: "Excess inventory is a real symptom and a partial cause, but it's downstream of the deeper issue, poor demand forecasting that led to buying the wrong parts to begin with.",
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
            text: "That gap is the tell, if technician availability were the main driver, its growth rate would track closer to the overall figure.",
            nextQuestionId: "g11q3a",
            scoreImpact: 15,
            feedback: "The growth-rate mismatch is exactly the signal to catch here, a category rising at a third of the overall pace cannot be the primary driver. Redirecting to the faster-growing categories is the right call.",
          },
          {
            id: "b",
            text: "Even at 12% growth, technician availability still represents 2,646 real delay hours, that's not nothing, and it should stay in the mix alongside the other categories.",
            nextQuestionId: "g11q4b",
            scoreImpact: 5,
            feedback: "2,646 hours is a real number, but the question here is prioritization. Against 30,832 hours sitting in the two faster-growing categories, spending equal management bandwidth on the smaller one is a poor use of limited attention.",
          },
          {
            id: "c",
            text: "The mismatch suggests the availability data itself is unreliable, technicians may simply not be logging delays consistently. Commission a data quality audit before drawing any conclusions.",
            nextQuestionId: "g11q4b",
            scoreImpact: -10,
            feedback: "Questioning the data's integrity mainly to protect a hypothesis you'd rather keep is not sound diagnostic work. The simpler and more likely explanation is the straightforward one, technician availability isn't the main driver.",
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
            text: "Fund predictive maintenance and inventory optimization, together they hit the two categories representing 76% of delay hours.",
            nextQuestionId: "g11q5a",
            scoreImpact: 20,
            feedback: "This gets the sequencing right, tackle the largest problems first, and the self-funding logic for scheduling holds up financially as well as analytically.",
          },
          {
            id: "b",
            text: "Fund scheduling redesign and inventory optimization, both implement faster than predictive maintenance, and together they cost only $20M versus $45M for the ACARS program alone.",
            nextQuestionId: "g11q5b",
            scoreImpact: -5,
            feedback: "Scheduling only touches about 7% of delay hours. Choosing it for speed while the $45M predictive maintenance program, which addresses 38% of delay hours, goes unfunded is a poor tradeoff of dollars for pace.",
          },
          {
            id: "c",
            text: "Fund predictive maintenance and scheduling redesign, pairing the single biggest intervention with the most organizationally complex one gives the COO the broadest transformation story to tell the board.",
            nextQuestionId: "g11q5b",
            scoreImpact: 5,
            feedback: "Predictive maintenance is the right call, but picking scheduling over inventory optimization overlooks that AOG parts events are the second-largest delay category at 38% of total hours.",
          },
        ],
      },
      {
        id: "g11q4b",
        stage: "Investment Prioritization",
        question: "You have been focused on secondary drivers. The partner says: our initial analysis suggests the top two delay categories, unplanned failures and AOG parts, are 76% of the problem. Do your recommended investments address these specifically?",
        options: [
          {
            id: "a",
            text: "Redirect: predictive maintenance on ACARS data hits unplanned component failures, 38% of delay hours, and demand-sensing inventory optimization hits AOG events, the other 38%.",
            nextQuestionId: "g11q5a",
            scoreImpact: 15,
            feedback: "Correctly mapping the two recommended investments back onto the two largest delay categories is exactly how to defend the plan to the COO after this pushback.",
          },
          {
            id: "b",
            text: "Stand by the current recommendations, they address real operational problems even if they aren't precisely targeted at the two highest-volume delay categories.",
            nextQuestionId: "g11q5b",
            scoreImpact: -10,
            feedback: "Defending a plan that doesn't address the primary drivers, after the partner has all but pointed at them, isn't credible. The recommendation needs to shift toward the 76% the data identifies.",
          },
          {
            id: "c",
            text: "Ask for one more week to confirm the delay categories are correctly attributed before adjusting the investment plan.",
            nextQuestionId: "g11q5b",
            scoreImpact: -5,
            feedback: "The category data is already clear and the attribution is direct, more time isn't needed here. Asking for a week when the answer is sitting in the exhibit delays fixes to a $595M annual problem for no analytical gain.",
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
            text: "Predictive maintenance, $45M, targets 55-65% reduction in unplanned failures for $180M savings. Inventory optimization, $12M, for $67M savings.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "This is a complete package, three specific initiatives, specific costs, specific metrics, specific dollar impact. A sub-three-month combined payback is a compelling number for both the COO and the board to act on.",
          },
          {
            id: "b",
            text: "Recommend hiring 500 additional technicians, replacing older aircraft with newer models, and renegotiating every third-party maintenance contract currently in force.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "None of these three map to the confirmed root causes, predictive maintenance gaps and parts inventory failures. Hiring, fleet replacement, and contract renegotiation are all expensive, slow, and disconnected from the 76% of delay hours actually driving the number.",
          },
          {
            id: "c",
            text: "Recommend two initiatives instead of three: predictive maintenance at $45M and inventory optimization at $12M, with scheduling picked up in a later phase.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Trimming to two is defensible if implementation bandwidth is genuinely limited. But at $8M for $45M in annual savings, a 3.5-month payback, scheduling is hard to leave off.",
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
            text: "Predictive maintenance at $45M on ACARS data, $180M savings. Inventory optimization at $12M, $67M savings.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "This is the right package, it addresses the two primary delay categories directly and adds a fast-payback scheduling improvement on top. The financial summary is specific enough to present with confidence.",
          },
          {
            id: "b",
            text: "Request a second two-week diagnostic phase before committing to recommendations, the analysis has been inconsistent and the COO deserves a far more thorough pass.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Asking for more time when the analysis is already done and the COO is sitting on a $595M annual problem is not an acceptable answer. The data supports the three-part package, present it.",
          },
          {
            id: "c",
            text: "Narrow to a single initiative, predictive maintenance, since it has the biggest standalone impact and the organization may not be able to absorb multiple programs at once.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "A single-initiative focus is more conservative but leaves $112M in annual savings from inventory and scheduling on the table. If implementation capacity really is constrained, phasing the other two in later is better than dropping them entirely.",
          },
        ],
      },
    ],
  },
  {
    id: "g12",
    title: "InsureCo: HealthPredict Acquisition",
    type: "merger_acquisition",
    difficulty: "intermediate",
    firm: "oliver-wyman",
    estimatedMinutes: 30,
    overview: "A top-five US health insurer is evaluating acquiring a health tech startup that uses AI to predict high-cost claimants before hospitalizations occur. Oliver Wyman has been engaged to evaluate the deal.",
    clientBackground: "InsureCo is a $45B revenue health insurer with 18M members and a medical loss ratio of 87% against an industry best-in-class of 82%. HealthPredict is a 4-year-old startup with a proprietary CAR-T adjacent AI platform that identifies members at high risk of costly hospitalization 6-12 months in advance. Phase 2 data showed 19% reduction in hospitalizations for identified high-risk members. HealthPredict has $38M ARR growing 85% annually. The seller is asking $800M.",
    yourRole: "You are an Oliver Wyman manager on the financial services practice. The InsureCo CFO is your day-to-day client. You have three weeks to deliver a go or no-go recommendation with financial analysis.",
    startQuestionId: "g12q1",
    finalRecommendationPrompt: "Should InsureCo acquire HealthPredict at $800M? What is the financial case and what are the key conditions?",
    sampleRecommendation: "Yes, with conditions. The financial case is compelling: applying HealthPredict's technology to InsureCo's 18M members generates an estimated $1.1B in annual claims savings at a realistic 35% intervention success rate, improving MLR from 87% to approximately 84.6%. Two conditions: independent validation of the 19% hospitalization reduction at scale, and an earnout structure tied to MLR improvement milestones.",
    idealRecommendation: "Acquire HealthPredict at $800M with two conditions: (1) independent clinical validation of the 19% result at InsureCo's 18M member scale; (2) earnout structure with $160M of the $800M tied to MLR improvement milestones. The $1.1B annual savings thesis makes the deal compelling even at conservative assumptions. The primary risk is technology performance at scale, proven on 2.1M members, unproven on 18M.",
    keyTakeaways: [
      "In insurance M&A, always anchor the financial analysis to the medical loss ratio, it is the single most important metric for insurers",
      "AI technology acquisitions require careful validation of whether performance at small scale will replicate at large scale",
      "Earnout structures are appropriate when there is genuine uncertainty about whether the acquired technology will perform as claimed",
      "The most important risk in health tech acquisitions is often not the technology itself but adoption by physicians and members who must change behavior",
    ],
    questions: [
      {
        id: "g12q1",
        stage: "Strategic Rationale",
        question: "InsureCo's CEO says the acquisition is motivated by wanting to become more data-driven and reduce claims costs. How do you evaluate whether this acquisition makes strategic sense before looking at price?",
        options: [
          {
            id: "a",
            text: "Work through three questions in order: does the technology actually perform at InsureCo's scale, is $800M fair for the value it creates.",
            nextQuestionId: "g12q2a",
            scoreImpact: 20,
            feedback: "This sequencing is right. Scale validation is the biggest open question, the price analysis grounds everything in numbers, and the build-or-partner check makes sure InsureCo isn't overpaying for something it could get another way.",
          },
          {
            id: "b",
            text: "Look at what competitors have done. If UnitedHealth or Aetna have already made similar plays, that's a reasonable signal the strategic logic holds.",
            nextQuestionId: "g12q2b",
            scoreImpact: -5,
            feedback: "Competitor moves are useful context but they're not a substitute for InsureCo-specific analysis. Peers can make mistakes too, or simply occupy a different strategic position.",
          },
          {
            id: "c",
            text: "Before anything else, survey InsureCo's physicians and care managers on whether they'd actually use the HealthPredict platform day to day.",
            nextQuestionId: "g12q2c",
            scoreImpact: -5,
            feedback: "Adoption research matters, but it belongs after the strategic and financial case is framed, not before. Leading with clinician surveys puts the cart before the horse.",
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
|---------------------------------------------|------------|
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
            text: "1.53M annual hospitalizations from 18M members at 85 per 1,000. HealthPredict flags 612,000 of those as high-risk.",
            nextQuestionId: "g12q3a",
            scoreImpact: 20,
            feedback: "The intervention success rate is the piece that makes this calculation defensible, not every high-risk member identified will actually accept or complete a care management intervention.",
          },
          {
            id: "b",
            text: "Apply the 19% reduction straight across all $39.15B in claims paid annually, that gives $7.4B in annual savings, HealthPredict's full theoretical potential value if rolled out universally.",
            nextQuestionId: "g12q3b",
            scoreImpact: -15,
            feedback: "This ignores that HealthPredict only flags 15% of members as high-risk in the first place, only those members get interventions, and only a fraction of interventions succeed. $7.4B is the gross ceiling; the realistic net figure is closer to a seventh of that.",
          },
          {
            id: "c",
            text: "You can't put a number on this without knowing how HealthPredict performs specifically on InsureCo's population, 19% measured on 2.1M members may not hold at 18M.",
            nextQuestionId: "g12q3b",
            scoreImpact: 0,
            feedback: "That's a legitimate risk to flag, but refusing to model the value because of it isn't useful to the CFO. Better to calculate under the assumption the 19% holds, then call out scale risk explicitly.",
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
            text: "21.1x against a comparable average of 19.75x is roughly a 7% premium given HealthPredict's 85% growth rate, well ahead of the comparables shown. The price holds up.",
            nextQuestionId: "g12q3a",
            scoreImpact: 15,
            feedback: "A 7% premium is small relative to the spread across the comparable set, and 85% growth is a legitimate reason to pay slightly above average.",
          },
          {
            id: "b",
            text: "At 21.1x versus a 19.75x average, HealthPredict is overpriced. Push the sellers down to $750M to bring the multiple back in line with the market.",
            nextQuestionId: "g12q3b",
            scoreImpact: -5,
            feedback: "Applying the average multiple mechanically, without adjusting for HealthPredict's above-average growth, isn't rigorous. CarePredict traded at 24x on 91% growth.",
          },
          {
            id: "c",
            text: "Comparables don't really apply here, HealthPredict is a unique enough platform asset that the valuation should rest entirely on the discounted NPV of MLR improvement.",
            nextQuestionId: "g12q3a",
            scoreImpact: 5,
            feedback: "Strategic value is the right primary lens for a buyer like InsureCo, but comparable multiples are still a useful sanity check on whether the price is in line with how similar assets have traded.",
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
            text: "Discount the 71% meaningfully, survey intent overstates real behavior. A more realistic working number is 40-50% actual adoption, and the financial case should use that lower figure.",
            nextQuestionId: "g12q3a",
            scoreImpact: 15,
            feedback: "Adjusting for survey bias and using 40-50% as the working assumption produces a more conservative and more defensible financial case.",
          },
          {
            id: "b",
            text: "71% is a strong validation signal, combined with the 19% hospitalization reduction figure, it's enough confidence to move ahead at $800M.",
            nextQuestionId: "g12q3b",
            scoreImpact: -5,
            feedback: "71% stated adoption is a thin foundation for an $800M decision on its own. Survey intent consistently overstates actual behavior.",
          },
          {
            id: "c",
            text: "The survey only answers the physician-side question, the real open variable is whether patients themselves will actually comply with the resulting care management interventions.",
            nextQuestionId: "g12q3a",
            scoreImpact: 10,
            feedback: "Useful addition. Physician willingness to use the platform is necessary but not sufficient, patient compliance with the resulting care recommendations is a separate and important variable.",
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
            text: "$800M against $1.1B in year-one savings is under a one-year payback. That's a strong case on its own, independent of whether the comparable multiples happen to agree.",
            nextQuestionId: "g12q4a",
            scoreImpact: 20,
            feedback: "This is the right frame. For a strategic acquirer, discounting the $1.1B annual savings over five years at InsureCo's cost of capital, and comparing that to the $800M price, is the primary methodology.",
          },
          {
            id: "b",
            text: "The $1.1B figure is too speculative and unproven at InsureCo's full 18-million-member scale to anchor the valuation on, lean primarily on the comparable transaction multiples instead.",
            nextQuestionId: "g12q4b",
            scoreImpact: -5,
            feedback: "For a strategic buyer, the whole rationale for this deal is the operational value it creates. Relying only on comparable multiples throws out the entire strategic case.",
          },
          {
            id: "c",
            text: "At 21x ARR the price looks steep on paper, but $1.1B in annual savings makes it look cheap from a strategic standpoint. Recommend proceeding at $800M with an earnout to guard against scale risk.",
            nextQuestionId: "g12q4a",
            scoreImpact: 15,
            feedback: "This balances both lenses, the multiple and the strategic value, and pairs the recommendation with a structural safeguard against the main risk.",
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
            text: "Revise now, at $1.1B in annual savings against an $800M price, payback is under a year and the case is strong.",
            nextQuestionId: "g12q4a",
            scoreImpact: 15,
            feedback: "This is the right adjustment. With a sub-one-year payback, the conversation moves from whether to proceed to how to manage the risks along the way.",
          },
          {
            id: "b",
            text: "$1.1B still seems generous, apply a further haircut, a 50% discount to $550M annual savings would still support the deal but with less confidence.",
            nextQuestionId: "g12q4b",
            scoreImpact: 0,
            feedback: "Stacking on more conservatism after the partner has already shared the corrected figure isn't warranted. That $1.1B already bakes in a 35% intervention success discount.",
          },
          {
            id: "c",
            text: "Hold the original pessimistic recommendation until independent clinical validation of the 19% hospitalization reduction figure is complete.",
            nextQuestionId: "g12q4b",
            scoreImpact: -5,
            feedback: "Independent validation is a fair condition to attach, but it should gate closing, not gate whether you're willing to say go at all.",
          },
        ],
      },
      {
        id: "g12q4a",
        stage: "Deal Structure",
        question: "The financial case supports the acquisition. The CFO asks: given the technology scale risk, proven on 2.1M members but unproven on 18M, how should the $800M be structured?",
        options: [
          {
            id: "a",
            text: "Pay the full $800M upfront, the financial case is strong enough that holding back consideration just adds friction with the sellers.",
            nextQuestionId: "g12q5a",
            scoreImpact: -5,
            feedback: "Paying everything upfront when there's genuine uncertainty about scale performance strips out all of InsureCo's downside protection.",
          },
          {
            id: "b",
            text: "Structure it as $640M upfront plus a $160M earnout tied to MLR milestones, $80M at 1.5pp improvement by year two.",
            nextQuestionId: "g12q5a",
            scoreImpact: 20,
            feedback: "This is the right structure. An 80/20 upfront-to-earnout split is enough to keep the sellers at the table, while linking the earnout to MLR improvement directly ties additional payout to the outcome the deal is priced on.",
          },
          {
            id: "c",
            text: "Go 50/50, $400M upfront and $400M contingent on hitting milestones, maximizing InsureCo's protection against scale failure.",
            nextQuestionId: "g12q5b",
            scoreImpact: -5,
            feedback: "A 50/50 split is too aggressive given the comparable transactions support the 21x multiple. Sellers would likely balk at half the price being contingent.",
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
            text: "Technology scale risk, the platform is proven on 2.1M members and InsureCo has 18M. An earnout tied to actual MLR improvement protects InsureCo if performance falls short.",
            nextQuestionId: "g12q5a",
            scoreImpact: 15,
            feedback: "Correctly naming the primary risk and pairing it with the right structural fix, even after a shaky start on the financial analysis, shows the instincts expected at the manager level.",
          },
          {
            id: "b",
            text: "Physician adoption risk. Without physicians actually using the platform, no MLR improvement happens. Condition the deal on a physician adoption commitment.",
            nextQuestionId: "g12q5b",
            scoreImpact: 5,
            feedback: "Adoption is a real risk, but it's one InsureCo has meaningful control over through change management programs. The technology's performance at scale is the more fundamental unknown.",
          },
          {
            id: "c",
            text: "Integration risk, folding a 120-person startup into a large insurer risks losing key talent. Include a three-year retention package for the top 20 HealthPredict engineers.",
            nextQuestionId: "g12q5b",
            scoreImpact: 0,
            feedback: "Retention packages are a sensible integration safeguard, but this is a secondary concern. The deal structure needs to address technology performance at InsureCo's scale first.",
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
            text: "Go. The $1.1B annual savings thesis, built on a conservative 35% intervention success rate, produces a sub-one-year payback on the $800M price. Structure: $640M upfront.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "This is a complete recommendation, the go call is clear, the financial basis is stated, the structure is specific, and the closing condition is named.",
          },
          {
            id: "b",
            text: "Conditional go pending a six-month pilot across 500,000 InsureCo members to validate the 19% result before committing the full $800M.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "A pilot is a reasonable, conservative alternative that validates before full capital commitment. The tradeoff is six months of delay during which a competing acquirer could move first.",
          },
          {
            id: "c",
            text: "No go, the jump from 2.1M to 18M members is too large an extrapolation to justify $800M without several more years of performance data at scale.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Walking away from a sub-one-year payback because of scale risk that an earnout structure can manage is overly cautious.",
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
            text: "Yes. Acquire at $800M, $640M upfront and $160M earnout tied to MLR improvement. The $1.1B savings thesis supports the price.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "This is a decisive, complete recovery, clear go call, specific structure, and the key condition stated.",
          },
          {
            id: "b",
            text: "Say more analysis is needed, physician adoption and technology scale questions create too much uncertainty for a five-minute call.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "Asking for more time when the partner just gave you five minutes, after three weeks of analysis, is a failure to deliver.",
          },
          {
            id: "c",
            text: "Yes, but at a lower price, counter at $650M to reduce the scale-risk premium, with a $150M earnout tied to projected MLR improvement.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "A counter-offer is a fair negotiating stance, but the comparable analysis already supports $800M. Pushing to renegotiate without a strong analytical basis can read as weakness.",
          },
        ],
      },
    ],
  },
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
    sampleRecommendation: "Yes. Enter the US market through acquisition of a mid-sized US generic manufacturer, organic entry would take 5-7 years due to FDA ANDA filing backlogs and is too slow to capture the 2025-2027 patent cliff. Target acquisition: SunValley Pharma at $890M, which brings $520M ARR, CNS and diabetes focus directly aligned with the Jardiance 2025 and Vyvanse patent expirations, and established PBM distribution relationships.",
    idealRecommendation: "Enter via acquisition of a US generic manufacturer. Organic entry is too slow for the patent cliff window. SunValley Pharma at $890M is the recommended target, CNS and diabetes focus aligns with near-term patent cliffs, established PBM relationships are the most valuable non-obvious asset. Total investment: approximately $1.04B including integration costs.",
    keyTakeaways: [
      "FDA regulatory approval, the ANDA filing process, is the primary barrier to entry in US generics and creates a 2-5 year organic entry timeline that often exceeds strategic windows",
      "PBM relationships are the critical distribution asset in US generics, they determine whether a new generic launch gets formulary placement and volume",
      "Patent cliffs create predictable, time-limited windows of above-normal profitability for first generic entrants",
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
            text: "Look at it across three dimensions: baseline market attractiveness, the specific patent cliff opportunity, and GeneriPharma's own ability to win given its European capabilities.",
            nextQuestionId: "g13q2a",
            scoreImpact: 20,
            feedback: "Each layer does something different, general attractiveness sets the baseline, the patent cliff captures the specific time-sensitive opportunity, and the win-ability check grounds everything in what GeneriPharma can actually execute.",
          },
          {
            id: "b",
            text: "Compare US generic profitability head-to-head against GeneriPharma's existing European markets to see if the US genuinely offers better returns.",
            nextQuestionId: "g13q2b",
            scoreImpact: 5,
            feedback: "That comparison is useful context, but it frames the decision too narrowly, this isn't a choice between the US and Europe, capital can flow to both.",
          },
          {
            id: "c",
            text: "Start by identifying the top three drugs losing patent protection between 2025 and 2028 and check whether GeneriPharma's existing European pipeline already covers those molecules.",
            nextQuestionId: "g13q2c",
            scoreImpact: 5,
            feedback: "The patent cliff angle matters, but this assumes organic entry is the default mode. Acquiring a US company that already has the right pipeline may be a faster path.",
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
            text: "The 2025-2026 window is immediately actionable, Jardiance and Entresto alone represent $14B in branded revenue losing protection within 18 months.",
            nextQuestionId: "g13q3a",
            scoreImpact: 20,
            feedback: "This correctly identifies the near-term window. Jardiance and Entresto expiring in 2025 create an immediate opportunity, but only for a company already in the US market or entering via acquisition ahead of the expirations.",
          },
          {
            id: "b",
            text: "Keytruda at $25B in 2028 is the single largest opportunity on the board. Build the entire entry strategy around positioning for this one drug even though it's four years out.",
            nextQuestionId: "g13q3b",
            scoreImpact: -5,
            feedback: "A four-year wait for one drug concentrates the entire entry thesis on a single asset. Oncology biologics like Keytruda also carry biosimilar manufacturing requirements that likely don't match GeneriPharma's capabilities.",
          },
          {
            id: "c",
            text: "Ozempic and the GLP-1 category is the biggest long-run opportunity and should anchor the entry thesis.",
            nextQuestionId: "g13q3b",
            scoreImpact: -5,
            feedback: "Ozempic's patent doesn't expire until 2031, seven years out. Anchoring the US entry strategy on that date skips over the 2025-2026 window sitting right in front of the company.",
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
            text: "There are three ways in: build organically, acquire an existing US generic manufacturer, or set up a licensing or distribution partnership.",
            nextQuestionId: "g13q3a",
            scoreImpact: 15,
            feedback: "This is the right framing of the three paths. Speed is the key differentiator, organic is slowest, acquisition fastest, partnership somewhere in between.",
          },
          {
            id: "b",
            text: "Organic is really the only realistic path for a company GeneriPharma's size, US generic acquisitions in this therapeutic space are usually overpriced.",
            nextQuestionId: "g13q3b",
            scoreImpact: -10,
            feedback: "Ruling out acquisition without actually evaluating it skips over the single most important constraint here, FDA ANDA approval alone takes 36-48 months.",
          },
          {
            id: "c",
            text: "Focus entirely on acquisition, organic timelines blow past the patent cliff window and partnerships don't provide the control needed.",
            nextQuestionId: "g13q3a",
            scoreImpact: 10,
            feedback: "Leaning toward acquisition given the timeline is directionally right, though framing it as the only option may be too rigid.",
          },
        ],
      },
      {
        id: "g13q2c",
        stage: "Patent Cliff Analysis",
        question: "You have focused on GeneriPharma's existing pipeline for US patent cliff opportunities. GeneriPharma's European products are primarily cardiovascular and respiratory molecules. Jardiance and Entresto are cardiovascular, both align. How does this change the entry analysis?",
        options: [
          {
            id: "a",
            text: "Pipeline alignment helps somewhat, but FDA ANDA approval still takes 36-48 months.",
            nextQuestionId: "g13q3a",
            scoreImpact: 15,
            feedback: "This gets the constraint right. Pipeline overlap is a genuine positive, but FDA timelines are fixed regardless of how well the molecules match.",
          },
          {
            id: "b",
            text: "This pipeline overlap is confirmation that organic entry is the way to go, cardiovascular expertise gives GeneriPharma a strong technical base.",
            nextQuestionId: "g13q3b",
            scoreImpact: -5,
            feedback: "Filing immediately still leaves 36-48 months before approval, missing the 2025 window for Jardiance and Entresto and likely the 2026 Eliquis window too.",
          },
          {
            id: "c",
            text: "The cardiovascular alignment is a strong enough signal on its own to proceed organically.",
            nextQuestionId: "g13q3b",
            scoreImpact: -10,
            feedback: "Technical capability and therapeutic knowledge are necessary but not sufficient. FDA approval timelines, PBM distribution relationships, and US manufacturing compliance are all separate barriers.",
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
            text: "Organic entry is viable as a long-term path but flatly misses the 2025-2026 patent cliff. Acquisition is the only mode that captures the time-limited window.",
            nextQuestionId: "g13q4a",
            scoreImpact: 20,
            feedback: "This is the correct conclusion. The patent cliff is what drives timing here, and organic entry simply can't get there in time.",
          },
          {
            id: "b",
            text: "Propose a hybrid, file organic ANDAs now targeting the 2028 Keytruda opportunity while evaluating acquisitions for the nearer-term cliff in parallel.",
            nextQuestionId: "g13q4b",
            scoreImpact: 5,
            feedback: "Creative, but Keytruda-class biosimilars require complex biologic manufacturing capability GeneriPharma likely lacks. The hybrid also stalls the acquisition decision.",
          },
          {
            id: "c",
            text: "Back the CEO's organic preference, 4-6 years is a long runway but GeneriPharma builds something durable in the US.",
            nextQuestionId: "g13q4b",
            scoreImpact: -10,
            feedback: "Supporting a preference that the data clearly shows can't deliver the stated reason for entering, the patent cliff, isn't sound advice.",
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
            text: "SunValley Pharma at $890M, its CNS and diabetes focus lines up with the 2025 Jardiance expiration and off-patent Vyvanse.",
            nextQuestionId: "g13q4a",
            scoreImpact: 15,
            feedback: "This picks the right target. The PBM point matters most, new generic launches need formulary placement to actually generate volume.",
          },
          {
            id: "b",
            text: "Atlantic Drug at $480M, it's the cheapest of the three, preserving capital for pipeline investment after entry.",
            nextQuestionId: "g13q4b",
            scoreImpact: -10,
            feedback: "Atlantic Drug has weak PBM relationships, the single most important commercial asset for succeeding in US generics, and limited alignment with the patent cliff drugs in play.",
          },
          {
            id: "c",
            text: "MidWest Generics at $650M, its cardiovascular focus lines up directly with the Eliquis and Entresto expirations in 2025-2026.",
            nextQuestionId: "g13q4a",
            scoreImpact: 10,
            feedback: "A reasonable second choice, the cardiovascular alignment does line up with the 2025-2026 cliff. SunValley is still the stronger pick given its PBM network and broader therapeutic coverage.",
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
            text: "$890M plus $150M integration is $1.04B total. SunValley's $520M base plus $200-300M from patent cliff generics gets to $720-820M pro-forma. At a 9x EBITDA exit multiple, five-year exit value lands at $1.25-1.45B, a 20-40% return over cost.",
            nextQuestionId: "g13q5a",
            scoreImpact: 20,
            feedback: "Solid modeling. The patent cliff revenue uplift is the key upside driver, and the exit multiple analysis shows the case holds even under fairly conservative assumptions.",
          },
          {
            id: "b",
            text: "$890M works out to 9.1x EBITDA for SunValley, which sits comfortably in the 8-10x range typical for mid-market pharma deals. That doesn't require a detailed return model.",
            nextQuestionId: "g13q5b",
            scoreImpact: 0,
            feedback: "The multiple comparison confirms the price is fair, but it doesn't build an investment case. The board needs to see what return the deal generates.",
          },
          {
            id: "c",
            text: "The financial case can't really be finished without knowing the exact market share SunValley will capture on the Jardiance and Vyvanse generics.",
            nextQuestionId: "g13q5b",
            scoreImpact: -5,
            feedback: "Using market share uncertainty as a reason to withhold the model is avoidance. Industry benchmarks for first-to-market generic share give a reasonable starting estimate.",
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
            text: "$890M plus $150M integration is $1.04B. SunValley's $520M revenue plus roughly $250M in patent cliff upside gets to about $770M pro-forma.",
            nextQuestionId: "g13q5a",
            scoreImpact: 15,
            feedback: "This is a clean, fast case with reasonable assumptions. The 25% return figure gives the board a clear number to evaluate against.",
          },
          {
            id: "b",
            text: "A credible financial case here really needs a full discounted cash flow model, a quick back-of-envelope estimate would be misleading.",
            nextQuestionId: "g13q5b",
            scoreImpact: -10,
            feedback: "Refusing to give a quick estimate when the partner has explicitly asked for three minutes isn't the right response under time pressure.",
          },
          {
            id: "c",
            text: "$890M at 9.1x EBITDA is a market-standard multiple, that's sufficient justification for the board on its own.",
            nextQuestionId: "g13q5b",
            scoreImpact: 0,
            feedback: "Confirming the multiple is a sanity check, not a financial case. The board needs to see the expected return on the investment.",
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
            text: "Go. Acquire SunValley Pharma for $890M plus $150M integration, $1.04B total.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "This is a complete recommendation, clear go call, named target, total investment, rationale for the target, the key asset called out, and a quantified return.",
          },
          {
            id: "b",
            text: "Go, but push the SunValley price down to $750M, the $890M ask sits above the comparable multiple average.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Price negotiation is a fair commercial instinct, but SunValley at 9.1x EBITDA is already within market range. Pushing hard on price given the timing pressure risks losing the target.",
          },
          {
            id: "c",
            text: "Conditional go, proceed with due diligence but hold capital commitment until PBM relationship contracts are independently verified.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "Reasonable pre-close verification steps. This is a defensible final recommendation structure, though naming SunValley specifically rather than referencing the target generically would sharpen it.",
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
            text: "Acquire SunValley Pharma at $890M plus $150M integration. Organic entry misses the 2025-2026 patent cliff entirely.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "This is the complete recommendation, mode, target, investment, rationale, and return all present.",
          },
          {
            id: "b",
            text: "Push the US entry decision back 12 months to allow more due diligence time on the acquisition targets.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "A 12-month delay means Jardiance's patent expires during the wait itself, the primary time-sensitive opportunity disappears entirely.",
          },
          {
            id: "c",
            text: "Go organic with ANDA filings aimed at the 2028 patent cliff opportunities, accepting that the near-term window is missed.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Recommending organic entry for the 2028 window after six weeks spent building the case for acting on the 2025-2026 window contradicts the analysis that got you here.",
          },
        ],
      },
    ],
  },
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
    sampleRecommendation: "Three-phase transformation over 24 months. Phase one: deploy RFID inventory tracking across all 180 stores, $45M investment, improves inventory accuracy from 71% to 94%, foundation for all other capabilities. Phase two: roll out click-and-collect to all stores and launch same-day delivery from 50 high-density locations, $93M combined. Phase three: unified commerce platform and AI demand forecasting, $120M. Total investment $258M targeting $1.2B in incremental digital revenue.",
    idealRecommendation: "Three-phase transformation totaling $258M over 24 months. Phase one: RFID inventory accuracy ($45M), foundation for everything else. Phase two: click-and-collect rollout plus same-day delivery launch ($93M). Phase three: unified commerce platform ($120M). Expected: $1.2B in incremental digital revenue reaching 23% digital mix, near the 25% target.",
    keyTakeaways: [
      "Inventory accuracy is the unsexy foundation of all omnichannel capability, you cannot offer same-day delivery if you do not know what is in your stores",
      "Click-and-collect has a basket size effect, BOPIS customers spend 2-3x more than pure online customers due to incremental in-store purchases during pickup",
      "Store-as-warehouse models allow retailers to compete with Amazon on delivery speed without building new distribution infrastructure",
      "Digital transformation sequencing matters, building customer-facing features on a broken inventory foundation always fails",
    ],
    questions: [
      {
        id: "g14q1",
        stage: "Root Cause",
        question: "RetailMax's digital revenue is 12% versus a 35% category average. Before designing solutions, what is the root cause of this gap?",
        options: [
          {
            id: "a",
            text: "This is mainly an investment gap, RetailMax simply hasn't put enough capital into digital compared to pure-play e-commerce rivals.",
            nextQuestionId: "g14q2b",
            scoreImpact: -5,
            feedback: "Underinvestment is a symptom, not the root cause. The customer feedback data points at fulfillment and inventory operations as the actual problem, not simply a shortfall in digital spending.",
          },
          {
            id: "b",
            text: "Line up the capability gaps against the customer feedback: 54% of customers cite not being able to get products same-day.",
            nextQuestionId: "g14q2a",
            scoreImpact: 20,
            feedback: "This causal chain is correct. Tying customer feedback directly to the specific capability gaps tells you precisely what to fix instead of just describing a general digital deficit.",
          },
          {
            id: "c",
            text: "This gap may reflect a deliberate strategic choice to prioritize the in-store experience over digital.",
            nextQuestionId: "g14q2c",
            scoreImpact: -10,
            feedback: "Questioning whether to close the gap at all, when the CEO has already set a 25% digital revenue target, isn't a productive framing.",
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
            text: "The $1.9B in annual lost digital revenue against category average is the headline number. Getting from 12% to 35% digital share represents $1.9B in incremental revenue.",
            nextQuestionId: "g14q3a",
            scoreImpact: 20,
            feedback: "This frames the business case correctly. $1.9B in lost revenue relative to category peers is the number that lands with the CTO and COO.",
          },
          {
            id: "b",
            text: "The primary business case is NPS, moving from 42 to 68 matters more strategically than the digital revenue figure.",
            nextQuestionId: "g14q3b",
            scoreImpact: 0,
            feedback: "NPS improvement is a genuinely good outcome, but NPS alone doesn't justify a $250M+ capital commitment on its own.",
          },
          {
            id: "c",
            text: "The mobile app score, 2.8 versus 4.1 category average, is both the root cause and the business case driver.",
            nextQuestionId: "g14q3c",
            scoreImpact: -5,
            feedback: "A better app helps conversion, but with inventory accuracy at 71%, a better app just means more customers browsing products that turn out to be unavailable.",
          },
        ],
      },
      {
        id: "g14q2b",
        stage: "Business Case",
        question: "You have framed this as a technology investment problem. The CTO says: our IT spend is already $420M annually, what specifically are we under-investing in? How do you respond?",
        options: [
          {
            id: "a",
            text: "Point back to the customer data, 54% cite fulfillment gaps, 48% cite inventory availability problems.",
            nextQuestionId: "g14q2a",
            scoreImpact: 15,
            feedback: "Shifting from total IT spend to specific capability gaps grounded in customer feedback is the right analytical move here.",
          },
          {
            id: "b",
            text: "Benchmark RetailMax's IT spend as a percentage of revenue against best-in-class digital retailers to pin down the specific investment gap.",
            nextQuestionId: "g14q3b",
            scoreImpact: 0,
            feedback: "This benchmark might show RetailMax spends similarly to competitors but gets worse outcomes, suggesting allocation rather than level is the issue. Useful context, but doesn't directly answer the CTO's question.",
          },
          {
            id: "c",
            text: "Confirm the IT spend level is fine and redirect to organizational capability and change management as the real barriers.",
            nextQuestionId: "g14q3c",
            scoreImpact: -5,
            feedback: "Change management always factors in, but concluding IT spend is sufficient before reviewing the capability gap data is premature.",
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
            text: "Acknowledge the target is fixed and move straight into the root cause work, connecting the capability gap data to customer feedback.",
            nextQuestionId: "g14q2a",
            scoreImpact: 10,
            feedback: "This is the right recovery, accept the strategic mandate and pivot into the analysis needed to deliver it.",
          },
          {
            id: "b",
            text: "Apologize for raising the strategic question and ask permission to restart the diagnostic from scratch.",
            nextQuestionId: "g14q3a",
            scoreImpact: -5,
            feedback: "Restarting from zero isn't necessary, the work done so far still has value and the pivot can happen immediately.",
          },
          {
            id: "c",
            text: "Note the strategic concern briefly for a later conversation and move straight into the capability gap analysis connecting customer feedback to the specific investments.",
            nextQuestionId: "g14q2a",
            scoreImpact: 15,
            feedback: "This is the smoothest handling, flag it briefly without dwelling, then pivot immediately into useful analysis.",
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
            text: "Lead with RFID inventory accuracy since click-and-collect and same-day delivery both depend on it.",
            nextQuestionId: "g14q4a",
            scoreImpact: 20,
            feedback: "This sequencing logic is right. RFID as the foundation is essential, launching click-and-collect on 71% inventory accuracy means 29% of orders fail at pickup.",
          },
          {
            id: "b",
            text: "Lead with the mobile app redesign since it's the fastest and most visible digital upgrade, then click-and-collect, then RFID.",
            nextQuestionId: "g14q4b",
            scoreImpact: -10,
            feedback: "Leading with the app while inventory accuracy sits at 71% means improving customers' ability to browse products they then can't reliably pick up or receive.",
          },
          {
            id: "c",
            text: "Launch all five initiatives at once to hit the 25% digital revenue target as fast as possible.",
            nextQuestionId: "g14q4c",
            scoreImpact: -5,
            feedback: "Launching five major technology initiatives simultaneously overloads implementation capacity and ignores technical dependencies, ship-from-store needs RFID working reliably first.",
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
            text: "RFID inventory accuracy first as the foundation, click-and-collect rollout second since it's the fastest path to digital revenue, and same-day delivery third since it directly addresses the 54% of customers who cite it as the reason they don't shop online.",
            nextQuestionId: "g14q4a",
            scoreImpact: 15,
            feedback: "This correctly identifies and sequences the three investments. The reasoning for each, foundation, fastest revenue, primary customer pain point, gives the COO the logic behind the prioritization.",
          },
          {
            id: "b",
            text: "Mobile app redesign first, then a marketing push to drive digital channel awareness, then click-and-collect.",
            nextQuestionId: "g14q4b",
            scoreImpact: -10,
            feedback: "Spending on marketing before the fulfillment foundation is fixed just drives traffic into a broken experience.",
          },
          {
            id: "c",
            text: "Ship-from-store first, since it has the biggest revenue benefit at $420M annually.",
            nextQuestionId: "g14q4c",
            scoreImpact: -5,
            feedback: "At 71% inventory accuracy, ship-from-store means 29% of orders fail because the item shows as available but isn't actually in the store. RFID accuracy has to come before ship-from-store.",
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
            text: "The COO's right, app redesign alone didn't move the needle before.",
            nextQuestionId: "g14q3a",
            scoreImpact: 15,
            feedback: "This is the right recovery. The COO's prior experience validates the sequencing lesson, app upgrades on top of broken fulfillment fail.",
          },
          {
            id: "b",
            text: "This time is different because the new app will use AI-driven personalization and a redesigned UX that better matches competitor digital experiences.",
            nextQuestionId: "g14q4b",
            scoreImpact: -10,
            feedback: "Arguing the new app will succeed on UX grounds, without engaging the COO's actual point, isn't persuasive.",
          },
          {
            id: "c",
            text: "Acknowledge that app redesign alone isn't enough and propose adding a fulfillment reliability piece, same-day delivery from a handful of stores, as the differentiator.",
            nextQuestionId: "g14q3a",
            scoreImpact: 10,
            feedback: "A partial recovery. Acknowledging the app-only approach failed and adding fulfillment is an improvement, but it still misses that inventory accuracy has to be the first investment.",
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
            text: "$296M against $1,190M in annual revenue benefit is roughly a 4x first-year return.",
            nextQuestionId: "g14q5a",
            scoreImpact: 20,
            feedback: "This is a correct and complete financial summary. A 4x first-year return with under-four-month payback is a strong number, and the 26% digital share figure confirms the target is achievable.",
          },
          {
            id: "b",
            text: "The $1,190M figure is a theoretical ceiling, a more realistic estimate accounting for implementation delays would land at 50-60% of that, getting to only 19-20% digital share.",
            nextQuestionId: "g14q5b",
            scoreImpact: -5,
            feedback: "Applying a blanket 50% haircut without a specific basis unnecessarily undercuts a compelling business case. The $1,190M figure already reflects realistic adoption curves.",
          },
          {
            id: "c",
            text: "This ROI can't really be finalized without a detailed implementation timeline and store-by-store revenue impact model for each initiative.",
            nextQuestionId: "g14q5b",
            scoreImpact: -10,
            feedback: "The aggregate summary already presented is exactly what a CTO capital approval conversation needs. Demanding a store-by-store model before presenting aggregate numbers delays the business case.",
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
            text: "The COO's right that app-first didn't work. This time the sequence starts with RFID inventory accuracy.",
            nextQuestionId: "g14q5a",
            scoreImpact: 15,
            feedback: "This is the right recovery. Acknowledging the prior failure, naming the actual root cause, and presenting the correct sequence gives the COO the answer he's actually looking for.",
          },
          {
            id: "b",
            text: "This time is different mainly because $296M is a much bigger commitment than prior digital investments.",
            nextQuestionId: "g14q5b",
            scoreImpact: -10,
            feedback: "More money spent on the same sequence that failed before just produces the same result at higher cost.",
          },
          {
            id: "c",
            text: "Agree with the COO's skepticism and recommend piloting all five initiatives across three representative stores before committing to the full $296M program.",
            nextQuestionId: "g14q5b",
            scoreImpact: 5,
            feedback: "A pilot is overly cautious given the urgency of the digital gap. The real fix is the sequence correction, RFID first, a pilot just pushes the answer back.",
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
            text: "Correct the order: RFID inventory accuracy in phase one, click-and-collect and same-day delivery in phase two once accuracy clears roughly 90%.",
            nextQuestionId: "g14q5a",
            scoreImpact: 15,
            feedback: "Clean fix. Acknowledging the dependency error and restating the correct order while preserving the same financial case is the right move.",
          },
          {
            id: "b",
            text: "Accept the technical limitation and drop ship-from-store from the roadmap entirely since it's the most complex and expensive initiative.",
            nextQuestionId: "g14q5b",
            scoreImpact: -10,
            feedback: "Dropping the single highest-revenue initiative ($420M annually) over a sequencing error that's fixable is an overcorrection.",
          },
          {
            id: "c",
            text: "Run RFID and ship-from-store in parallel, as accuracy climbs from 71% toward 94%, gradually expand ship-from-store into locations where accuracy is already above 85%.",
            nextQuestionId: "g14q5a",
            scoreImpact: 10,
            feedback: "Parallel deployment with an accuracy-gated geographic rollout is a workable implementation approach.",
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
            text: "Phase one: RFID accuracy, $45M, $180M savings. Phase two: click-and-collect plus same-day delivery, $93M, $425M lift.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "This is a well-structured presentation, three phases, specific investment, timeline, and revenue impact for each, and the total reconciles cleanly against the earlier analysis.",
          },
          {
            id: "b",
            text: "Present the transformation as a single integrated program rather than three phases, since customers don't benefit from seeing it broken into stages.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Phasing is an internal implementation decision, not a customer-facing one. The CTO specifically asked for a phased roadmap.",
          },
          {
            id: "c",
            text: "Recommend trimming the investment to $150M focused only on the highest-ROI pieces, RFID and click-and-collect, to prove the model before committing to the full $296M.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "A smaller first-phase investment is a reasonable capital discipline, but the business case for the full $296M at 4x ROI is strong enough to justify the whole program.",
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
            text: "Three phases: RFID accuracy first ($45M, foundation), click-and-collect plus same-day delivery second ($93M, fastest revenue), ship-from-store and unified commerce third ($158M). $296M total for $1,190M in benefit, 26% digital share in 24 months.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "This is the correct recovery, right phases, right sequencing, right investment levels and financial outcomes.",
          },
          {
            id: "b",
            text: "This transformation is too complex to summarize into three phases, recommend commissioning a full detailed project plan before presenting anything to the CTO.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Three phases is exactly the right level of abstraction for a CTO-level presentation. Detailed project planning comes after executive approval, not before it.",
          },
          {
            id: "c",
            text: "Focus only on phase one, RFID inventory accuracy at $45M, and propose returning with phases two and three once phase one results build confidence.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "A phase-one-only pitch is too conservative given the urgency here. The CTO needs the full roadmap to see how phase one fits the larger plan.",
          },
        ],
      },
    ],
  },
  {
    id: "g15",
    title: "CloudCore: Post-Hypergrowth Restructuring",
    type: "operations",
    difficulty: "advanced",
    firm: "mckinsey",
    estimatedMinutes: 40,
    overview: "A B2B SaaS company that grew 10x during the pandemic is now facing an existential cost crisis. McKinsey has been engaged to redesign the cost structure and restore sustainable economics.",
    clientBackground: "CloudCore provides cloud infrastructure management software to mid-enterprise clients. Revenue grew from $180M in 2019 to $1.8B in 2022, a 10x increase in three years. Headcount grew from 800 to 6,200. In 2023 revenue growth decelerated to 12% while costs continued growing at 28%. EBITDA fell from positive 18% margin to negative 22%. The board has given the CEO 18 months to reach EBITDA breakeven or the company faces a down-round or forced sale.",
    yourRole: "You are a McKinsey associate principal on the tech and digital practice. You have eight weeks to deliver a restructuring plan. The CEO has said clearly that this plan will determine whether the company survives.",
    startQuestionId: "g15q1",
    finalRecommendationPrompt: "What restructuring actions should CloudCore take to reach EBITDA breakeven within 18 months? Be specific about cost reduction targets, organizational changes, and sequencing.",
    sampleRecommendation: "CloudCore must reduce annualized costs by $580M to reach breakeven. Three major actions: first, a workforce reduction of 35% targeting G&A functions running at 2x industry ratios and duplicate engineering teams from acquisition integrations, estimated savings $320M. Second, real estate rationalization closing 8 of 12 office locations, estimated savings $85M. Third, cloud infrastructure spend consolidation, estimated savings $175M. Execute the workforce announcement in week two.",
    idealRecommendation: "Three actions totaling $580M: (1) Workforce reduction of 35% focused on G&A at 2x industry ratio and duplicate engineering, $320M savings. (2) Real estate rationalization, $85M savings. (3) Infrastructure spend consolidation, $175M savings. Workforce announcement must happen once and decisively in week two. Retain the top 10% of engineers through a $45M retention program.",
    keyTakeaways: [
      "Hypergrowth companies systematically over-hire in G&A and middle management because revenue growth masks inefficiency until growth decelerates",
      "Workforce reductions must be done once and decisively, serial cuts destroy morale without fixing the economics and cause the best talent to leave preemptively",
      "Infrastructure and vendor spend is often the least-examined cost bucket in tech companies and frequently contains 30-50% waste",
      "The goal of a restructuring is to create a sustainable business not just hit a near-term target, talent retention during restructuring is as important as the cuts themselves",
    ],
    questions: [
      {
        id: "g15q1",
        stage: "Cost Diagnosis",
        question: "CloudCore must reduce costs by $580M to reach breakeven. Before identifying where to cut, how do you structure the cost diagnostic to ensure you find the right $580M rather than the easiest $580M?",
        context: "The difference between the right cuts and the easy cuts is whether the company can grow again after the restructuring.",
        options: [
          {
            id: "a",
            text: "Benchmark every cost line against what comparable SaaS companies at similar revenue scale spend.",
            nextQuestionId: "g15q2a",
            scoreImpact: 20,
            feedback: "This approach is defensible and targeted, it ensures the cuts remove genuine structural excess rather than being distributed arbitrarily.",
          },
          {
            id: "b",
            text: "Ask the CEO and leadership team which of their functions they'd rank as lowest-priority and start cutting there.",
            nextQuestionId: "g15q2b",
            scoreImpact: -10,
            feedback: "Leaders tend to protect their own turf in a restructuring, which produces cuts that are politically easy rather than economically optimal.",
          },
          {
            id: "c",
            text: "Identify whichever functions have the largest absolute headcount and cut proportionally across each one.",
            nextQuestionId: "g15q2c",
            scoreImpact: -5,
            feedback: "Cutting proportionally across the board ignores that some functions are far more over-staffed relative to benchmark than others.",
          },
        ],
      },
      {
        id: "g15q2a",
        stage: "Cost Benchmark Analysis",
        question: "The benchmark analysis is complete. Review the data and identify where the excess costs are concentrated.",
        exhibit: {
          type: "table",
          title: "CloudCore Cost Structure vs SaaS Benchmark",
          data: `| Function        | 2022 Spend | Pct Revenue | Benchmark Pct | Excess vs Bench | Headcount |
|----------------|------------|-------------|---------------|-----------------|-----------|
| R&D            | $612M      | 34%         | 18-22%        | $216M           | 2,480     |
| Sales/Mktg     | $504M      | 28%         | 20-25%        | $54M            | 1,560     |
| G&A            | $414M      | 23%         | 8-12%         | $198M           | 1,480     |
| Infrastructure | $252M      | 14%         | 8-10%         | $90M            | 0 (cloud) |
| Total costs    | $1,782M    | 99%         | 65-70%        | $558M           |           |`,
        },
        options: [
          {
            id: "a",
            text: "G&A and R&D carry the bulk of the excess.",
            nextQuestionId: "g15q3a",
            scoreImpact: 20,
            feedback: "This identifies the excess correctly and adds the right nuance. G&A has no strategic justification for sitting above benchmark.",
          },
          {
            id: "b",
            text: "Sales and marketing at $504M is the largest single spend line and should be the primary target.",
            nextQuestionId: "g15q3b",
            scoreImpact: -10,
            feedback: "Sales and marketing at 28% of revenue is only modestly above the 20-25% benchmark, a $54M excess, the smallest gap of the four categories.",
          },
          {
            id: "c",
            text: "Infrastructure at $252M should be the first target since it's pure cost with zero headcount tied to it, no layoffs required.",
            nextQuestionId: "g15q3c",
            scoreImpact: 5,
            feedback: "Infrastructure cuts are genuinely easier to execute, but the $90M opportunity only closes about 16% of the $558M total gap.",
          },
        ],
      },
      {
        id: "g15q2b",
        stage: "Cost Benchmark Analysis",
        question: "Leadership has identified marketing, events, and travel as their lowest-priority cuts. Combined savings would be approximately $45M. The CFO says: this is not enough to reach $580M in savings. What do you do?",
        options: [
          {
            id: "a",
            text: "Bring the benchmark analysis in independently: G&A at 23% against an 8-12% benchmark is $198M in structural excess leadership can't objectively see since they run those functions.",
            nextQuestionId: "g15q3a",
            scoreImpact: 15,
            feedback: "Using independent analysis to surface what internal leadership can't surface on its own is exactly the role McKinsey plays in a restructuring.",
          },
          {
            id: "b",
            text: "Take the $45M from the low-priority cuts leadership identified, and recommend additional revenue growth initiatives to close the remaining $535M gap through growth rather than cost cuts.",
            nextQuestionId: "g15q3b",
            scoreImpact: -15,
            feedback: "Revenue growth already decelerated to 12% while costs grew 28%, the growth thesis is already failing on its own.",
          },
          {
            id: "c",
            text: "Propose stretching the restructuring out over 36 months instead, allowing gradual cost reduction through natural attrition.",
            nextQuestionId: "g15q3c",
            scoreImpact: -10,
            feedback: "The board set an 18-month window, not 36. Proposing a timeline the board has already ruled out isn't a recommendation, it's avoidance.",
          },
        ],
      },
      {
        id: "g15q2c",
        stage: "Cost Benchmark Analysis",
        question: "Proportional cuts across all functions would remove 35% from each department. The engineering team lead says: cutting 35% from R&D would kill three product lines that are our future growth engines. How do you respond?",
        options: [
          {
            id: "a",
            text: "The engineering lead has a fair point. Proportional cuts are the wrong methodology here.",
            nextQuestionId: "g15q3a",
            scoreImpact: 10,
            feedback: "The engineering lead's objection inadvertently exposes the flaw in the proportional approach, and using that feedback to redirect toward benchmark-driven cuts is the right pivot.",
          },
          {
            id: "b",
            text: "Exempt R&D from cuts entirely to protect the product roadmap, and increase the reductions in sales/marketing and G&A proportionally.",
            nextQuestionId: "g15q3a",
            scoreImpact: 5,
            feedback: "Partially right, R&D shouldn't take a proportional hit. But fully exempting it without analyzing which teams are genuinely strategic versus duplicate leaves well over $100M in legitimate R&D savings on the table.",
          },
          {
            id: "c",
            text: "Keep the proportional approach in place but let R&D choose internally which 35% of projects to cut.",
            nextQuestionId: "g15q3c",
            scoreImpact: -5,
            feedback: "Letting R&D self-select creates the same problem as asking leadership at large, they're likely to cut the most junior roles rather than the structurally redundant teams.",
          },
        ],
      },
      {
        id: "g15q3a",
        stage: "Workforce Reduction Design",
        question: "G&A at $198M excess is the clearest target. The CFO asks: how do you cut $198M from G&A without destroying the administrative infrastructure the company needs to operate?",
        exhibit: {
          type: "table",
          title: "G&A Function Breakdown",
          data: `| Sub-function      | Headcount | Spend  | Benchmark HC | Excess HC | Notes                   |
|------------------|-----------|--------|-------------|-----------|-------------------------|
| HR               | 280       | $84M   | 95          | 185       | 1 HR per 22 employees   |
| Finance          | 245       | $74M   | 110         | 135       | Duplicated FP&A teams   |
| IT support       | 198       | $59M   | 145         | 53        | Pre-cloud support model |
| Legal/compliance | 165       | $50M   | 120         | 45        | Near benchmark          |
| Facilities       | 312       | $94M   | 180         | 132       | Pre-remote model        |
| Executive staff  | 280       | $53M   | 90          | 190       | Hypergrowth hiring      |
| Total G&A        | 1,480     | $414M  | 740         | 740       |                         |`,
        },
        options: [
          {
            id: "a",
            text: "HR staffed at 1 per 22 against a 1-per-50 benchmark, facilities sized for a pre-remote headcount.",
            nextQuestionId: "g15q4a",
            scoreImpact: 20,
            feedback: "This is precise and well-reasoned. Identifying the three sub-functions with the largest structural excess gives the CFO a defensible plan instead of a blunt across-the-board cut.",
          },
          {
            id: "b",
            text: "Cut every G&A sub-function down to its benchmark headcount at the same time, 740 total reductions.",
            nextQuestionId: "g15q4b",
            scoreImpact: 5,
            feedback: "Cutting everything to benchmark simultaneously is analytically tidy but operationally risky. Legal and compliance, already near benchmark, would be cut unnecessarily.",
          },
          {
            id: "c",
            text: "Concentrate on facilities at $94M and executive staff at $53M since those are the most publicly defensible cuts.",
            nextQuestionId: "g15q4c",
            scoreImpact: -5,
            feedback: "Choosing cuts based on how defensible they look publicly, rather than where the structural excess actually sits, is the wrong optimization.",
          },
        ],
      },
      {
        id: "g15q3b",
        stage: "Workforce Reduction Design",
        question: "The CEO wants to focus restructuring on revenue-adjacent functions. You need to redirect her toward the G&A excess. What is the most compelling argument?",
        options: [
          {
            id: "a",
            text: "G&A at 23% of revenue against an 8-12% benchmark means CloudCore is spending roughly $11 more in overhead for every $100 in revenue than comparable SaaS peers do.",
            nextQuestionId: "g15q4a",
            scoreImpact: 20,
            feedback: "The per-dollar framing lands well here. Expressing the G&A excess as a revenue-proportional inefficiency makes the case concrete and hard to argue against.",
          },
          {
            id: "b",
            text: "Point to peers like Salesforce and Workday running leaner G&A ratios as proof that CloudCore's overhead is bloated.",
            nextQuestionId: "g15q4a",
            scoreImpact: 10,
            feedback: "Peer comparisons are persuasive but slightly softer than the direct benchmark numbers. Both arguments land, but the percentage-based benchmark is the harder one to push back on.",
          },
          {
            id: "c",
            text: "Acknowledge the CEO's instinct to protect revenue functions and propose splitting the reduction 50-50 between G&A and sales/marketing.",
            nextQuestionId: "g15q4b",
            scoreImpact: -10,
            feedback: "Watering down the analytically correct call to match the CEO's instinct is a classic consulting misstep. Sales and marketing sits only $54M above benchmark.",
          },
        ],
      },
      {
        id: "g15q3c",
        stage: "Workforce Reduction Design",
        question: "Your restructuring approach has been suboptimal. The partner intervenes: G&A is the primary target, it is 2x industry benchmark with $198M in structural excess. Given this, design the G&A reduction program.",
        options: [
          {
            id: "a",
            text: "Target the three sub-functions with highest excess: HR from 280 to 95, facilities from 312 to 180.",
            nextQuestionId: "g15q4a",
            scoreImpact: 15,
            feedback: "This is a specific, credible recovery. Targeting the three largest sub-function excesses with actual headcount numbers gives the plan operational teeth.",
          },
          {
            id: "b",
            text: "Recommend outsourcing the entire G&A function to a business process outsourcing provider to hit benchmark cost ratios without a formal workforce reduction.",
            nextQuestionId: "g15q4c",
            scoreImpact: -5,
            feedback: "A full G&A outsourcing transition would take 18-24 months and significant transition capital, far too slow against an 18-month breakeven deadline.",
          },
          {
            id: "c",
            text: "Bring every G&A sub-function down to the industry benchmark midpoint of 10% of revenue via proportional cuts, saving approximately $234M.",
            nextQuestionId: "g15q4a",
            scoreImpact: 5,
            feedback: "Forcing every sub-function to a single benchmark ratio is overly mechanical, legal and compliance is already near benchmark and doesn't need cutting.",
          },
        ],
      },
      {
        id: "g15q4a",
        stage: "Infrastructure and Real Estate",
        question: "G&A cuts are designed. Now address infrastructure and real estate. Infrastructure at 14% of revenue versus 8-10% benchmark represents a $90M opportunity. The CTO says: our infrastructure costs are high because we are growing fast and scale discounts will come. How do you evaluate this?",
        exhibit: {
          type: "table",
          title: "CloudCore Infrastructure Spend Analysis",
          data: `| Category              | 2022 Spend | 2019 Spend | Growth | Revenue Growth |
|----------------------|------------|------------|--------|----------------|
| Compute              | $98M       | $28M       | 250%   | 900%           |
| Storage              | $62M       | $12M       | 417%   | 900%           |
| Data transfer        | $44M       | $8M        | 450%   | 900%           |
| Dev and test envs    | $48M       | $6M        | 700%   | 900%           |
| Total infrastructure | $252M      | $54M       | 367%   | 900%           |`,
        },
        options: [
          {
            id: "a",
            text: "If scale discounts were operating, every category should grow slower than the 900% revenue growth, and compute, storage, and data transfer do. Dev and test environments grew 700% against that same 900%, that's the real target.",
            nextQuestionId: "g15q5a",
            scoreImpact: 20,
            feedback: "This is a sharp disaggregation. Separating production, where scale economics are actually working, from dev and test environments is exactly the right analysis.",
          },
          {
            id: "b",
            text: "The CTO's right, every infrastructure category grew slower than the 900% revenue growth, meaning there's no infrastructure problem here to fix.",
            nextQuestionId: "g15q5b",
            scoreImpact: -10,
            feedback: "Growing slower than revenue isn't the same as being at benchmark. Infrastructure at 14% of revenue against an 8-10% benchmark still means CloudCore is spending $50M or more above comparable companies.",
          },
          {
            id: "c",
            text: "Accept the CTO's argument and pull infrastructure out of the restructuring plan entirely, letting scale discounts naturally shrink it over the next two to three years.",
            nextQuestionId: "g15q5b",
            scoreImpact: -15,
            feedback: "Accepting an argument that directly contradicts the benchmark data, without a counterpoint, isn't sound advice. CloudCore has 18 months to reach breakeven.",
          },
        ],
      },
      {
        id: "g15q4b",
        stage: "Infrastructure and Real Estate",
        question: "Your G&A analysis has been incomplete. The partner says: you have identified $135M from G&A but need $580M total. Where does the remaining $445M come from? Build the full savings bridge.",
        options: [
          {
            id: "a",
            text: "Full bridge: G&A reduction $135M, R&D duplicate team elimination $185M, infrastructure optimization $90M, real estate rationalization $85M.",
            nextQuestionId: "g15q5a",
            scoreImpact: 20,
            feedback: "This bridge is complete and balances cleanly. R&D duplicate-team elimination is the key missing piece, targeted specifically at teams created through acquisitions.",
          },
          {
            id: "b",
            text: "The remaining $445M should come from revenue growth, cost cuts alone would damage the business too much.",
            nextQuestionId: "g15q5b",
            scoreImpact: -15,
            feedback: "The board mandated cost cuts to reach breakeven, not a growth plan. With revenue growth at 12% and costs growing 28%, the gap is widening, not closing.",
          },
          {
            id: "c",
            text: "Cut an additional 35% from R&D on top of the G&A reductions to find the rest of the savings.",
            nextQuestionId: "g15q5b",
            scoreImpact: -10,
            feedback: "Cutting R&D by 35% simply because it's the biggest headcount pool would gut the product capability CloudCore needs to grow again post-restructuring.",
          },
        ],
      },
      {
        id: "g15q4c",
        stage: "Infrastructure and Real Estate",
        question: "Your restructuring design has been piecemeal. The CFO says: we need $580M in savings and a plan that is credible enough to prevent the down-round. Show me the full savings bridge in five minutes.",
        options: [
          {
            id: "a",
            text: "G&A benchmark reduction $198M, R&D duplicate team elimination $185M, infrastructure dev-environment optimization $90M, real estate consolidation $85M, sales and marketing efficiency $22M. Total: $580M, rolling out over six to twelve months.",
            nextQuestionId: "g15q5a",
            scoreImpact: 15,
            feedback: "This is a strong recovery under pressure, a complete bridge totaling exactly $580M with a clear rollout sequence.",
          },
          {
            id: "b",
            text: "$580M is too aggressive a target, a more sustainable $350M restructuring spread over 24 months would still reach breakeven eventually.",
            nextQuestionId: "g15q5b",
            scoreImpact: -10,
            feedback: "The board already set 18 months and $580M as the constraint. Proposing a different target to the CFO isn't useful advice, it's delay dressed up as caution.",
          },
          {
            id: "c",
            text: "The savings bridge needs two more weeks of analysis to properly attribute savings across workforce, infrastructure, and real estate.",
            nextQuestionId: "g15q5b",
            scoreImpact: -5,
            feedback: "Eight weeks of analysis are already done. The CFO asked for the bridge in five minutes, asking for two more weeks isn't responsive to the urgency of the moment.",
          },
        ],
      },
      {
        id: "g15q5a",
        stage: "Communication Strategy",
        question: "The CEO asks: how and when do we communicate the workforce reduction to employees, and how do we retain the top engineers we cannot afford to lose?",
        options: [
          {
            id: "a",
            text: "Execute in a single day: brief managers 48 hours ahead under NDA, deliver every notification the same morning, CEO all-hands that afternoon. Don't let news leak.",
            nextQuestionId: "g15q6a",
            scoreImpact: 20,
            feedback: "This is the standard restructuring communication approach. Single-day execution removes the ambiguity window where the most employable engineers leave preemptively.",
          },
          {
            id: "b",
            text: "Announce the restructuring plan publicly first so employees understand the strategic context, then roll out individual notifications over the following two weeks.",
            nextQuestionId: "g15q6b",
            scoreImpact: -15,
            feedback: "Telling everyone cuts are coming without saying who for two weeks maximizes uncertainty for the longest possible time, which drives exactly the kind of preemptive voluntary attrition you're trying to avoid.",
          },
          {
            id: "c",
            text: "Roll the reduction out in three tranches over six months to soften the organizational shock.",
            nextQuestionId: "g15q6b",
            scoreImpact: -10,
            feedback: "Serial tranches stretch out organizational uncertainty indefinitely. Restructuring research consistently shows single-event reductions recover faster than staged ones.",
          },
        ],
      },
      {
        id: "g15q5b",
        stage: "Communication Strategy",
        question: "Your restructuring plan has gaps. The partner gives you a direct steer: the plan needs to be $580M in savings communicated in a single announcement. What is the most dangerous execution risk and how do you mitigate it?",
        options: [
          {
            id: "a",
            text: "The biggest risk is voluntary departure of top engineering talent right after the announcement.",
            nextQuestionId: "g15q6a",
            scoreImpact: 15,
            feedback: "This correctly names the primary risk. Top engineers have immediate outside options, without proactive retention, the restructuring damages exactly the product capability CloudCore needs for recovery.",
          },
          {
            id: "b",
            text: "The biggest risk is enterprise customers perceiving CloudCore as unstable after the announcement and churning during renewal conversations.",
            nextQuestionId: "g15q6b",
            scoreImpact: 5,
            feedback: "Customer perception is a real concern, but it's manageable through proactive outreach. Engineering attrition is the more existential risk since it directly damages the product.",
          },
          {
            id: "c",
            text: "The biggest risk is negative media coverage of the layoffs damaging CloudCore's employer brand.",
            nextQuestionId: "g15q6b",
            scoreImpact: -5,
            feedback: "Tech layoff coverage has become routine and rarely leaves lasting business impact. Employer brand damage is a real but comparatively minor concern next to losing top engineering talent.",
          },
        ],
      },
      {
        id: "g15q6a",
        stage: "Post-Restructuring Growth",
        question: "The restructuring plan is complete. The board asks: after the $580M in cuts, what does the path to growth look like and how does CloudCore avoid returning to this situation in three years?",
        options: [
          {
            id: "a",
            text: "Three structural changes: a headcount-to-revenue governance framework requiring board approval any time a function exceeds its benchmark ratio; shifting engineering investment toward depth in the two core product lines with the highest net revenue retention; and a hard rule that G&A headcount can't grow faster than revenue.",
            nextQuestionId: "g15q7a",
            scoreImpact: 20,
            feedback: "These are the right structural fixes. The governance framework prevents future over-hiring, and the G&A growth cap is an automatic constraint that would have prevented the current crisis.",
          },
          {
            id: "b",
            text: "Return to aggressive hiring within 18-24 months once EBITDA breakeven is reached to re-accelerate growth.",
            nextQuestionId: "g15q7b",
            scoreImpact: -10,
            feedback: "Going straight back to aggressive hiring the moment breakeven is reached recreates the exact same problem.",
          },
          {
            id: "c",
            text: "Run a strategic review to determine whether CloudCore should pivot into a different market segment.",
            nextQuestionId: "g15q7b",
            scoreImpact: 0,
            feedback: "Treating a strategic pivot as the primary answer to a cost crisis misdiagnoses the problem. The issue is the cost structure, not the market.",
          },
        ],
      },
      {
        id: "g15q6b",
        stage: "Post-Restructuring Growth",
        question: "The restructuring communication has gaps. The partner asks: how do you protect the top engineering talent during the restructuring period to ensure CloudCore can grow after the cuts?",
        options: [
          {
            id: "a",
            text: "CloudCore's own data shows the top 10% of engineers produce roughly 3x the average output.",
            nextQuestionId: "g15q7a",
            scoreImpact: 15,
            feedback: "This is the right retention design. The 3x productivity multiplier makes the $45M spend an easy calculation.",
          },
          {
            id: "b",
            text: "Offer identical retention packages to every engineer to avoid creating hierarchy or resentment.",
            nextQuestionId: "g15q7b",
            scoreImpact: -5,
            feedback: "Identical packages across all 2,480 engineers would run north of $450M, about 78% of the entire savings target.",
          },
          {
            id: "c",
            text: "Accept that some top engineering talent will leave during any major restructuring regardless of what programs are put in place.",
            nextQuestionId: "g15q7b",
            scoreImpact: -10,
            feedback: "Treating top-talent attrition as inevitable without even attempting retention is a real strategic miss.",
          },
        ],
      },
      {
        id: "g15q7a",
        stage: "Final Recommendation",
        question: "The board asks for the complete restructuring recommendation: actions, savings, timeline, and the single biggest risk. What is your final answer?",
        options: [
          {
            id: "a",
            text: "Three actions: G&A and R&D duplicate-team reductions of 2,170 people saving $383M, infrastructure and real estate rationalization saving $175M, vendor consolidation saving $22M, $580M total. Single announcement in week two, $45M retention program for engineers.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "This is a complete recommendation, three specific actions, the exact savings figure, a clear single-day communication plan, the retention program, and the primary risk with its mitigation named.",
          },
          {
            id: "b",
            text: "The design is complete but needs four more weeks of organizational mapping before the announcement can go out.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Four more weeks extends exactly the ambiguity period that's most dangerous for voluntary attrition.",
          },
          {
            id: "c",
            text: "Present three scenarios instead of one recommendation: conservative at $350M, base at $580M, aggressive at $750M, and let the board weigh the tradeoff.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Scenario ranges are useful supporting context, but the board asked for a recommendation, not a menu. $580M is the analytically correct number.",
          },
        ],
      },
      {
        id: "g15q7b",
        stage: "Final Recommendation",
        question: "Your restructuring plan has had inconsistencies. The partner gives you one final opportunity before the board presentation. What is the complete recommendation?",
        options: [
          {
            id: "a",
            text: "Three actions totaling $580M: workforce reduction targeting G&A and R&D duplicate teams saving $383M, infrastructure and real estate optimization saving $175M.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "This is a strong recovery, the correct savings bridge, the right communication approach, the retention program, and the structural governance change that prevents recurrence.",
          },
          {
            id: "b",
            text: "Recommend delaying the announcement by 60 days to let Q3 results give a cleaner financial baseline.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "The company has 18 months to reach breakeven, and every additional day extends exactly the ambiguity window that drives voluntary attrition.",
          },
          {
            id: "c",
            text: "Recommend the board consider selling the company instead of restructuring.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "A sale process is a legitimate board-level option, but it isn't what McKinsey was engaged to deliver. The restructuring plan is the deliverable.",
          },
        ],
      },
    ],
  },
  {
    id: "g16",
    title: "GoalKeeper Capital: Football Club Acquisition",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "bain",
    estimatedMinutes: 40,
    overview: "A US private equity firm wants to acquire a Premier League football club. Bain has been engaged to evaluate the investment thesis and recommend a valuation.",
    clientBackground: "GoalKeeper Capital is a $12B AUM PE firm that has never invested in sports. They are evaluating an acquisition of Riverside FC, a mid-table Premier League club based in London. The seller is asking £850M. Riverside FC generates £180M in annual revenue, plays in a stadium with 42,000 capacity at 94% average occupancy, and has £290M in player squad net book value. The club has £85M in net debt.",
    yourRole: "You are a Bain manager on the consumer and retail practice covering entertainment and sports. This is a novel asset class for your team. You have six weeks to deliver a go or no-go recommendation with full financial analysis.",
    startQuestionId: "g16q1",
    finalRecommendationPrompt: "Should GoalKeeper Capital acquire Riverside FC at £850M? What is the investment thesis, what value creation levers exist, and what is the key risk?",
    sampleRecommendation: "Yes. Riverside FC at £850M represents fair to slightly favorable value. The EV-to-revenue multiple of 5.2x sits below the Premier League median of 5.5x. The investment thesis rests on three value creation levers: commercial revenue development adding £31M annually, stadium expansion adding £35M, and US media rights investment adding £12-20M. Key risk is relegation, probability 71% at least once in a 7-year hold.",
    idealRecommendation: "Yes at £850M (5.2x EV/Revenue, below 5.5x median). Three value creation levers: commercial development adding £31M annually, stadium expansion adding £35M, US media rights adding £15M. Combined these add £250-300M in enterprise value at 5.5x exit multiple. Primary risk is relegation, must be stress-tested and management of on-pitch performance is critical.",
    keyTakeaways: [
      "Sports franchises are valued on revenue multiples not EBITDA because player investment cycles create lumpy earnings that make EBITDA unreliable",
      "Relegation risk is the binary downside scenario that must be modeled explicitly in any football club investment, it is not a tail risk but a likely event over a long hold",
      "Commercial revenue is the primary PE value creation lever in football because broadcasting rights are set at the league level and matchday revenue is capacity-constrained",
      "Fixed supply of Premier League licenses creates structural appreciation that distinguishes football from most other PE assets",
    ],
    questions: [
      {
        id: "g16q1",
        stage: "Asset Class Education",
        question: "GoalKeeper Capital has never invested in sports. Before evaluating this specific deal, how do you educate the IC on the unique characteristics of sports franchise investing?",
        context: "The IC needs to understand why standard PE analytical frameworks apply differently to sports assets before evaluating a specific deal.",
        options: [
          {
            id: "a",
            text: "Treat it like any consumer business: pull revenue, cost, and EBITDA into a standard model and apply a multiple, with brand value bolted on as a separate line.",
            nextQuestionId: "g16q2b",
            scoreImpact: -10,
            feedback: "This carries over a consumer-goods lens that doesn't hold up here: license scarcity, performance-linked revenue, wage structures that distort EBITDA, and relegation risk all break the standard model.",
          },
          {
            id: "b",
            text: "Four things make this asset class different: a meaningful slice of revenue tracks prize money and European qualification; wages behave like quasi-fixed costs; EBITDA is distorted by player amortization.",
            nextQuestionId: "g16q2a",
            scoreImpact: 20,
            feedback: "This gives the IC the right lens. The scarcity point matters most in practice, it's why a club bought for a couple hundred million can be worth billions today regardless of any individual season's results.",
          },
          {
            id: "c",
            text: "Anchor the valuation on player asset value, transfer market pricing is externally verifiable.",
            nextQuestionId: "g16q2b",
            scoreImpact: -5,
            feedback: "Transfer values swing hard on injury, form, and age curves, and they miss what a PE buyer is really underwriting: the license, the stadium, and the commercial relationships.",
          },
        ],
      },
      {
        id: "g16q2a",
        stage: "Valuation",
        question: "The IC now understands the asset class. Is £850M a fair price for Riverside FC? Evaluate the comparable transaction data.",
        exhibit: {
          type: "table",
          title: "Premier League Comparable Transactions",
          data: `| Club             | Year | EV      | Revenue | EV/Rev | Notes                   |
|-----------------|------|---------|---------|--------|-------------------------|
| Chelsea FC       | 2022 | £4.25B  | £481M   | 8.8x   | Top-6 global brand      |
| Manchester Utd   | 2023 | £5.0B   | £648M   | 7.7x   | Top-6 global brand      |
| Liverpool (part) | 2023 | £2.8B   | £593M   | 4.7x   | Partial stake implied   |
| Everton          | 2023 | £0.5B   | £171M   | 2.9x   | Financial distress      |
| Bournemouth      | 2022 | £0.15B  | £142M   | 1.1x   | Pre-promotion price     |
| Median ex outlier|      |         |         | 5.5x   |                         |`,
        },
        options: [
          {
            id: "a",
            text: "£850M plus £85M net debt is £935M EV, or 5.2x revenue.",
            nextQuestionId: "g16q3a",
            scoreImpact: 20,
            feedback: "This is the right sequence: build EV correctly, throw out the two comparables that aren't actually comparable, and benchmark against what's left.",
          },
          {
            id: "b",
            text: "Chelsea (8.8x) and Manchester United (7.7x) set the real bar for Premier League ambition, against those global top-six brands, Riverside at 5.2x looks like a bargain.",
            nextQuestionId: "g16q3b",
            scoreImpact: -10,
            feedback: "Chelsea and United are £480M+ revenue global brands in a different tier entirely; benchmarking a £180M-revenue mid-table club against them manufactures an illusion of cheapness.",
          },
          {
            id: "c",
            text: "Everton's 2.9x is the closest revenue-scale match, so £850M looks like a meaningful overpay relative to what the market has actually paid for clubs this size.",
            nextQuestionId: "g16q3b",
            scoreImpact: -15,
            feedback: "Everton's multiple reflects a club under a points-deduction penalty and financial distress, not a normal mid-table transaction.",
          },
        ],
      },
      {
        id: "g16q2b",
        stage: "Valuation",
        question: "Your initial framework was incomplete. The partner suggests using revenue multiples and points to the comparable transaction table. The EV is £935M including debt. What is your valuation conclusion?",
        exhibit: {
          type: "table",
          title: "Riverside FC Key Financial Data",
          data: `| Metric                         | Value   | Notes                          |
|-------------------------------|---------|---------------------------------|
| Annual revenue                 | £180M   |                                |
| Revenue: Broadcasting          | £72M    | 40% of total                   |
| Revenue: Matchday              | £54M    | 30% of total                   |
| Revenue: Commercial            | £54M    | 30% of total                   |
| EBITDA before player amort     | £22M    |                                |
| Wage to revenue ratio          | 81%     | Industry avg 60%               |
| Player squad net book value    | £290M   |                                |
| Stadium value freehold         | £180M   |                                |
| Net debt                       | £85M    |                                |
| Equity offer                   | £850M   |                                |
| Implied EV                     | £935M   |                                |
| EV/Revenue                     | 5.2x    |                                |`,
        },
        options: [
          {
            id: "a",
            text: "5.2x against a 5.5x mid-table median puts this modestly below fair value.",
            nextQuestionId: "g16q3a",
            scoreImpact: 15,
            feedback: "This is the recovery that gets the full picture right, correct EV, correct benchmark, and reframing the wage ratio as an opportunity rather than a disqualifier.",
          },
          {
            id: "b",
            text: "£22M EBITDA against £935M EV is a 42x multiple. Even generously assuming EBITDA doubles within three years, you're still paying a rich forward multiple.",
            nextQuestionId: "g16q3b",
            scoreImpact: -10,
            feedback: "This reapplies the EV/EBITDA lens the case already flagged as unreliable, player amortization and investment-cycle timing make football EBITDA a poor earnings proxy in any given year.",
          },
          {
            id: "c",
            text: "£470M of tangible backing against a £935M EV leaves £465M sitting in intangibles, too rich for brand and goodwill.",
            nextQuestionId: "g16q3b",
            scoreImpact: -5,
            feedback: "The tangible/intangible split is a useful sanity check, but that £465M isn't generic goodwill, it includes the Premier League license and media rights participation, each independently quantifiable.",
          },
        ],
      },
      {
        id: "g16q3a",
        stage: "Value Creation",
        question: "GoalKeeper Capital needs to understand the value creation opportunity beyond the base case. Which commercial development opportunity should be the primary value creation thesis?",
        exhibit: {
          type: "table",
          title: "Value Creation Initiative Analysis",
          data: `| Initiative                  | Investment | Annual Uplift | Timeline  | Precedent              |
|----------------------------|------------|---------------|-----------|------------------------|
| Commercial/sponsorship dev  | £12M       | £45-65M       | 2-3 years | Arsenal doubled 2015-20|
| Stadium expansion 42k-55k  | £280M      | £35-45M       | 4-5 years | Tottenham new stadium  |
| Women's team development    | £8M/yr     | £4-8M+brand   | 3-5 years | Chelsea Women top-3    |
| US media rights investment  | £15M       | £12-20M       | 2-3 years | Wrexham 3x revenue     |
| Youth academy monetization  | £5M        | £20-40M       | 5-10 years| Southampton model      |
| Commercial benchmarking     |            |               |           |                        |
| Top-6 clubs avg commercial  | £280M/yr   | 65% of rev    |           |                        |
| Mid-table avg commercial    | £85M/yr    | 47% of rev    |           |                        |
| Riverside current           | £54M/yr    | 30% of rev    |           |                        |`,
        },
        options: [
          {
            id: "a",
            text: "Commercial development first. Riverside sits at 30% commercial versus 47% mid-table average, a £31M annual gap.",
            nextQuestionId: "g16q4a",
            scoreImpact: 20,
            feedback: "The gap-to-peer benchmark is specific and the ROIC framing is exactly how this gets pitched to an IC.",
          },
          {
            id: "b",
            text: "Stadium expansion first, £35-45M is the largest single revenue uplift on the table, and at 94% occupancy the demand to fill a bigger ground is already proven.",
            nextQuestionId: "g16q4b",
            scoreImpact: -5,
            feedback: "It's a reasonable second-phase move, but £280M of capital for a similar annual uplift to the £12M commercial program means the return on capital is far worse.",
          },
          {
            id: "c",
            text: "US media rights first, Wrexham tripled revenue and US sports media valuations are near record highs.",
            nextQuestionId: "g16q4b",
            scoreImpact: -5,
            feedback: "Wrexham's trajectory rode on a specific celebrity ownership story that isn't replicable here. The £12-20M uplift is real but smaller than the £31M commercial gap.",
          },
        ],
      },
      {
        id: "g16q3b",
        stage: "Value Creation",
        question: "Your valuation has been off. The partner corrects the methodology to revenue multiples and confirms 5.2x is below the 5.5x median. Now identify the primary value creation lever.",
        options: [
          {
            id: "a",
            text: "Commercial revenue. Closing the gap from 30% to the 47% mid-table benchmark is worth £31M a year, or £170M in enterprise value at 5.5x.",
            nextQuestionId: "g16q4a",
            scoreImpact: 15,
            feedback: "Right lever, right math, the gap-to-peer benchmark converted into enterprise value at the exit multiple is the return story the IC needs.",
          },
          {
            id: "b",
            text: "Player trading, buying undervalued talent and selling at a profit has produced 8-15% annualized returns for clubs that do it well.",
            nextQuestionId: "g16q4b",
            scoreImpact: -10,
            feedback: "That return record belongs to clubs with deep, years-long football recruitment expertise, which GoalKeeper Capital doesn't have. It's a speculative, sport-specific strategy.",
          },
          {
            id: "c",
            text: "Wage rationalization, the 81% wage-to-revenue ratio against a 60% industry norm implies roughly £37M of excess cost that renegotiated contracts should recover.",
            nextQuestionId: "g16q4b",
            scoreImpact: -5,
            feedback: "Cutting wages aggressively at a mid-table club risks losing the players keeping you in the league, and relegation costs far more than £37M in savings.",
          },
        ],
      },
      {
        id: "g16q4a",
        stage: "Relegation Risk",
        question: "The IC asks the most important risk question: what happens to our investment if Riverside FC gets relegated to the Championship? Quantify the downside scenario.",
        exhibit: {
          type: "table",
          title: "Relegation Financial Impact Analysis",
          data: `| Revenue Stream              | Premier League | Championship Yr1 | Change      |
|----------------------------|---------------|-----------------|-------------|
| Broadcasting (PL distrib)   | £72M          | £8M             | -£64M       |
| Broadcasting (parachute)    | £0M           | £44M            | +£44M       |
| Matchday                    | £54M          | £41M            | -£13M       |
| Commercial (step-down)      | £54M          | £35M            | -£19M       |
| Total revenue               | £180M         | £128M           | -£52M (-29%)|
| Comparable relegated clubs  |               |                 |             |
| Sheffield United value drop |               |                 | -55%        |
| Burnley value drop          |               |                 | -50%        |
| Leicester City value drop   |               |                 | -46%        |
| Average value decline       |               |                 | -50%        |`,
        },
        options: [
          {
            id: "a",
            text: "Comparable clubs lose 46-50% of value on relegation, so £935M EV falls to roughly £467-505M.",
            nextQuestionId: "g16q5a",
            scoreImpact: 20,
            feedback: "1 minus 0.82 to the 7th power is 71%, relegation at least once is the single most likely outcome over this hold period, not a tail event.",
          },
          {
            id: "b",
            text: "Manageable. Parachute payments cover £44M of the £64M broadcasting loss, and most relegated clubs bounce back within 2-3 seasons.",
            nextQuestionId: "g16q5b",
            scoreImpact: -5,
            feedback: "Net revenue still drops £52M even with parachute payments, and a 50% value decline isn't temporary if the fund needs to exit while the club is still in the Championship.",
          },
          {
            id: "c",
            text: "It's already in the price, the discount versus top-6 clubs at 7-8x is the market pricing in exactly this performance risk.",
            nextQuestionId: "g16q5b",
            scoreImpact: -10,
            feedback: "That discount is mostly explained by revenue scale, not relegation risk specifically. Assuming the multiple gap fully captures a 71% probability event without ever quantifying it is a gap an IC would catch immediately.",
          },
        ],
      },
      {
        id: "g16q4b",
        stage: "Relegation Risk",
        question: "Your value creation analysis has been suboptimal. The partner gives you the relegation risk data and asks: given a 71% probability of at least one relegation in a 7-year hold, is this investment still attractive?",
        options: [
          {
            id: "a",
            text: "Yes, if commercial development delivers. Closing the £31M gap to £85M commercial revenue reduces dependence on match results.",
            nextQuestionId: "g16q5a",
            scoreImpact: 15,
            feedback: "Tying the value creation thesis directly to risk mitigation is the right move, commercial growth specifically strengthens the revenue lines that hold up best through a relegation scenario.",
          },
          {
            id: "b",
            text: "No. A 71% chance of relegation at some point is not something institutional PE should underwrite, decline the deal outright.",
            nextQuestionId: "g16q5b",
            scoreImpact: -10,
            feedback: "71% is the probability of a temporary setback, not a permanent wipeout, and it's paired with a below-median entry multiple and a quantified commercial upside case.",
          },
          {
            id: "c",
            text: "The 71% figure overstates the real risk, Riverside hasn't been relegated in 22 seasons.",
            nextQuestionId: "g16q5b",
            scoreImpact: -5,
            feedback: "Past survival under different ownership doesn't predict future risk once a new owner changes squad investment behavior.",
          },
        ],
      },
      {
        id: "g16q5a",
        stage: "Return Analysis",
        question: "The IC asks for the expected IRR under base case and bear case scenarios. Build the return model.",
        exhibit: {
          type: "table",
          title: "Scenario Return Analysis",
          data: `| Scenario                         | Probability | Exit EV   | Equity Return | IRR Est   |
|---------------------------------|-------------|-----------|---------------|-----------|
| Base: PL, commercial dev, 7yr   | 45%         | £1.55B    | £1.47B        | 18-22%    |
| Bear: one relegation, recovery  | 35%         | £1.1B     | £1.02B        | 8-11%     |
| Stress: long Championship stay  | 15%         | £0.55B    | £0.47B        | -7 to -4% |
| Bull: European competition      | 5%          | £2.2B     | £2.12B        | 28-34%    |
| Probability-weighted EV         |             | £1.22B    | £1.14B        | 13-16%    |`,
        },
        options: [
          {
            id: "a",
            text: "Probability-weighted IRR of 13-16% clears the 10% hurdle, and it clears it in the base and bear cases independently.",
            nextQuestionId: "g16q6a",
            scoreImpact: 20,
            feedback: "This is the full financial case: probability-weighted return above hurdle, base and bear both independently clearing it, and a stress case framed correctly as partial loss.",
          },
          {
            id: "b",
            text: "A 15% chance of a negative-IRR outcome is disqualifying on its own, institutional PE shouldn't be underwriting scenarios where the return goes negative.",
            nextQuestionId: "g16q6b",
            scoreImpact: -10,
            feedback: "No PE investment has a zero chance of a bad outcome. A 15% probability of a negative scenario sitting inside a 13-16% probability-weighted return is well within normal PE risk tolerance.",
          },
          {
            id: "c",
            text: "Center the case on the bull scenario, 28-34% IRR on European qualification is where PE returns actually come from.",
            nextQuestionId: "g16q6b",
            scoreImpact: -5,
            feedback: "Building the investment case on a 5%-probability outcome isn't sound underwriting. The IC needs the probability-weighted 13-16%.",
          },
        ],
      },
      {
        id: "g16q5b",
        stage: "Return Analysis",
        question: "Your risk analysis has been incomplete. The partner presents the scenario return model showing 13-16% probability-weighted IRR. Given this, what is your recommendation?",
        options: [
          {
            id: "a",
            text: "Proceed. 13-16% blended IRR clears the 10% hurdle, and both base and bear cases clear it on their own. Add the commercial thesis and the fixed 20-club license cap and the structural upside justifies taking on the relegation risk.",
            nextQuestionId: "g16q6a",
            scoreImpact: 15,
            feedback: "Tying the IRR conclusion to the specific structural features gives the IC the full rationale, not just a number.",
          },
          {
            id: "b",
            text: "Pass. With relegation at 71% over the hold, the bear case is the realistic base case, and 8-11% IRR there is too thin.",
            nextQuestionId: "g16q6b",
            scoreImpact: -10,
            feedback: "The bear case still clears the hurdle at its midpoint. Passing on a deal that clears the hurdle in base, bear, and blended scenarios isn't supported by the numbers.",
          },
          {
            id: "c",
            text: "Push for £700M to build in a larger margin of safety against relegation risk, targeting a 20%+ base case IRR.",
            nextQuestionId: "g16q6a",
            scoreImpact: 5,
            feedback: "Negotiating is fair, but a 17.6% discount off the ask isn't realistic given comparable transactions support 5.5x. Something closer to £820M is a more credible ask.",
          },
        ],
      },
      {
        id: "g16q6a",
        stage: "Governance Structure",
        question: "GoalKeeper Capital wants to know how to govern the investment post-acquisition given their lack of football expertise. What governance structure do you recommend?",
        options: [
          {
            id: "a",
            text: "Three layers: a GoalKeeper Capital board seat over commercial strategy; a football advisory board including an experienced sporting director hire; and a hard line separating commercial calls.",
            nextQuestionId: "g16q7a",
            scoreImpact: 20,
            feedback: "The commercial/sporting split is the load-bearing element here. PE owners who reach into squad selection without the expertise to back it up are the ones who consistently destroy value.",
          },
          {
            id: "b",
            text: "Take full operational control, including sporting decisions, the financial discipline PE ownership brings should improve decision quality across every part of the club.",
            nextQuestionId: "g16q7b",
            scoreImpact: -15,
            feedback: "This is the single most common value-destruction pattern in PE-owned football: financially-driven squad decisions without football expertise lead to missed signings and higher relegation odds.",
          },
          {
            id: "c",
            text: "Recruit a CEO from a successful US sports franchise, someone fluent in PE-backed ownership.",
            nextQuestionId: "g16q7b",
            scoreImpact: -5,
            feedback: "US sports models don't transfer cleanly, promotion/relegation, transfer markets, and stadium ownership are all fundamentally different. A football-native CEO with commercial chops is the better fit.",
          },
        ],
      },
      {
        id: "g16q6b",
        stage: "Governance Structure",
        question: "Your risk or return analysis has led to a tentative pass or incomplete recommendation. The partner challenges you: the financial case supports proceeding. What governance structure addresses the execution risk of a first-time sports investor?",
        options: [
          {
            id: "a",
            text: "Split commercial and sporting governance cleanly: GoalKeeper Capital holds a board seat and KPI framework over commercial strategy; a football-experienced CEO.",
            nextQuestionId: "g16q7a",
            scoreImpact: 10,
            feedback: "The commercial/sporting split directly addresses the first-time-owner risk, GoalKeeper Capital's value-add is commercial and financial, not tactical or recruitment decisions.",
          },
          {
            id: "b",
            text: "Bring in an existing football ownership group as a co-investor to share governance and day-to-day operating responsibility.",
            nextQuestionId: "g16q7b",
            scoreImpact: -5,
            feedback: "Co-ownership adds governance complexity and dilutes the return. If the standalone financial case already works, bringing in an operating partner is a more expensive fix than simply hiring the right management team.",
          },
          {
            id: "c",
            text: "Embed a consulting team on-site full-time for the first two years to provide operational oversight.",
            nextQuestionId: "g16q7b",
            scoreImpact: -10,
            feedback: "A full-time embedded consulting presence isn't a governance structure, it delays building the actual leadership team the club needs.",
          },
        ],
      },
      {
        id: "g16q7a",
        stage: "Final Recommendation",
        question: "The IC asks for the final recommendation: go or no-go, rationale, key conditions, and the single most important thing GoalKeeper Capital must get right.",
        options: [
          {
            id: "a",
            text: "Go at £850M: 5.2x EV/Revenue against a 5.5x median, a commercial thesis worth £170M in enterprise value.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "This is the complete package for an IC: clear go decision, entry price, quantified value creation, IRR support, a concrete condition, and the single execution priority that determines whether the thesis actually plays out.",
          },
          {
            id: "b",
            text: "Go, but only after pushing the price to £780M, at that level base case IRR moves to roughly 21%.",
            nextQuestionId: "end",
            scoreImpact: 10,
            feedback: "The IRR uplift from £780M is real and the negotiation instinct is reasonable, but £850M already clears the hurdle comfortably, squeezing for a better price risks losing the deal.",
          },
          {
            id: "c",
            text: "Conditional go: proceed only once diligence rules out undisclosed liabilities and the incumbent manager signs a new three-year deal before close.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "The financial diligence condition is standard and sensible. Tying the deal to a manager's contract is overreach, average manager tenure is around 18 months.",
          },
        ],
      },
      {
        id: "g16q7b",
        stage: "Final Recommendation",
        question: "Your recommendation has had inconsistencies. The partner gives you one final opportunity. What should GoalKeeper Capital do with Riverside FC?",
        options: [
          {
            id: "a",
            text: "Acquire at £850M. It's priced below the 5.5x median at 5.2x, the commercial program is worth roughly £170M in enterprise value on £12M invested, and the probability-weighted IRR of 13-16% clears the hurdle. Govern with a commercial/sporting split.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "This pulls every piece together, entry price justification, quantified value creation, IRR, governance structure, and the primary risk with a real mitigation plan attached.",
          },
          {
            id: "b",
            text: "Pass, relegation exposure and thin operational expertise in European football add up to more execution risk than the expected return justifies.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "The blended IRR of 13-16% clears the hurdle, the entry multiple sits below the comparable median, and the value creation case is specific and quantified, passing here isn't supported by the numbers.",
          },
          {
            id: "c",
            text: "Hold off for six months and watch how Riverside performs in the second half of the season before committing £850M.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Waiting just shifts the price up or down depending on results, which is itself a bet on sporting outcomes rather than a way to avoid one.",
          },
        ],
      },
    ],
  },
  {
    id: "g17",
    title: "NovaBio: Pre-IPO Oncology Investment",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "lek",
    estimatedMinutes: 42,
    overview: "A healthcare-focused PE firm wants L.E.K. to evaluate a $450M pre-IPO investment in NovaBio, a clinical-stage biotech with a breakthrough oncology platform targeting solid tumors.",
    clientBackground: "NovaBio is a 7-year-old Cambridge, MA biotech with a proprietary CAR-T cell therapy platform targeting solid tumors, historically the hardest cancer type for cell therapy to address. Their lead program NB-101 is in Phase 2 with FDA Breakthrough Therapy Designation. Phase 1 data showed 62% objective response rate versus 15% for standard of care in advanced pancreatic cancer. They have $180M in cash providing 18 months of runway and are seeking $450M in exchange for 25% ownership at a $1.8B pre-money valuation.",
    yourRole: "You are an L.E.K. manager on the healthcare and life sciences practice. You have four weeks to deliver a go or no-go investment recommendation with full financial analysis.",
    startQuestionId: "g17q1",
    finalRecommendationPrompt: "Should the PE firm invest $450M in NovaBio at a $1.8B valuation? What is the risk-adjusted return, and what are the two most important conditions?",
    sampleRecommendation: "Invest with two conditions. The risk-adjusted NPV is compelling: 45% probability of Phase 3 success times $8.5B exit value equals $3.8B expected value versus $1.8B entry, a 2.1x expected return translating to 25-32% IRR over 5-7 years. Condition one: independent scientific advisory board review of Phase 2 data before close. Condition two: manufacturing partnership secured before close.",
    idealRecommendation: "Invest at $1.8B valuation with two conditions: (1) independent scientific review of Phase 2 data; (2) CDMO manufacturing partnership secured pre-close. Risk-adjusted expected return: $2.45B on $450M invested, 5.5x expected MOIC. Both base case and even the most likely failure scenario provide above-hurdle returns when probability-weighted correctly.",
    keyTakeaways: [
      "Biotech investing requires probability-weighted return analysis, the binary nature of clinical outcomes makes standard DCF inappropriate as the primary valuation method",
      "Phase 2 to Phase 3 success rates in oncology average 40-55%, Phase 3 failure is the single most likely outcome and must be central to the investment analysis",
      "CAR-T manufacturing is the most underappreciated constraint in cell therapy, manufacturing failures have derailed multiple approved products post-approval",
      "FDA Breakthrough Therapy Designation is a meaningful positive signal but does not guarantee approval or predict Phase 3 success",
    ],
    questions: [
      {
        id: "g17q1",
        stage: "Scientific Assessment",
        question: "NovaBio's Phase 1 data shows 62% objective response rate in pancreatic cancer versus 15% for standard of care. How do you interpret this for investment purposes before committing $450M?",
        context: "Phase 1 trials are designed for safety and dosing, not efficacy. Understanding what this data does and does not tell you is the critical first analytical step.",
        options: [
          {
            id: "a",
            text: "No solid-tumor CAR-T has ever cleared 20% ORR, so 62% is a real signal, and Breakthrough Designation says the FDA sees it too.",
            nextQuestionId: "g17q2a",
            scoreImpact: 20,
            feedback: "This holds together: the historical baseline makes 62% notable, the FDA designation adds independent corroboration, and pricing for the uncertainty is exactly the discipline a $450M check requires.",
          },
          {
            id: "b",
            text: "A response rate four times standard of care, backed by Breakthrough Designation, is about as strong a signal as biotech diligence produces. Commit the full $450M now, no conditions attached.",
            nextQuestionId: "g17q2b",
            scoreImpact: -15,
            feedback: "Breakthrough Designation flags promise, it doesn't certify durability at scale. A 29-patient trial routinely overstates the effect that later shows up in Phase 3. Dropping conditions to move fast gives up real downside protection.",
          },
          {
            id: "c",
            text: "A 29-patient readout can't carry a $450M decision. Wait for Phase 3.",
            nextQuestionId: "g17q2c",
            scoreImpact: -10,
            feedback: "The sample-size caution is fair, but calling the result meaningless overstates it. Waiting for Phase 3 means buying in after the valuation has already repriced for success.",
          },
        ],
      },
      {
        id: "g17q2a",
        stage: "Market Sizing",
        question: "If NB-101 is approved, what is the realistic peak commercial opportunity? Build the market sizing.",
        exhibit: {
          type: "table",
          title: "NB-101 Commercial Opportunity Inputs",
          data: `| Input                                | Value     | Notes                          |
|-------------------------------------|-----------|---------------------------------|
| Annual pancreatic cancer diagnoses  | 64,000    | US only                        |
| Stage 3-4 addressable patients      | 48,000    | 75% of total                   |
| Biomarker eligibility pct           | 35%       | Based on MSLN expression data  |
| 5-year penetration at peak          | 45%       | Kymriah/Yescarta precedent     |
| Expected net price per course       | $320,000  | After rebates from $450K list  |
| Ex-US market factor                 | 1.6x      | EU plus Japan plus other       |
| Peak US annual revenue              | $2.4B     | Calc below                     |
| Peak global annual revenue          | $3.8B     | US times 1.6x                  |
| P3 to approval success rate         | 85%       | With BTD                       |
| P2 to P3 success rate (oncology)    | 45%       | Historical benchmark           |
| Combined approval probability       | 38%       |                                 |`,
        },
        options: [
          {
            id: "a",
            text: "48,000 addressable times 35% eligibility is 16,800, times 45% penetration is 7,560 patients, times $320,000 net price is $2.42B in the US, times 1.6x ex-US factor is $3.87B global. Apply the 38% combined approval probability and peak risk-adjusted revenue is $1.47B, that is the figure to value the stake against, not the unadjusted $3.87B.",
            nextQuestionId: "g17q3a",
            scoreImpact: 20,
            feedback: "The arithmetic checks out, and more importantly the risk-adjustment step is what turns a headline number into something usable for pricing the deal.",
          },
          {
            id: "b",
            text: "Run the probability math to get $1.47B risk-adjusted, but underwrite the position off the unadjusted $3.87B, sponsors in this space typically size to the success case.",
            nextQuestionId: "g17q3b",
            scoreImpact: -5,
            feedback: "That's backwards. Probability-weighting exists precisely because most clinical-stage bets don't land, roughly 62% of assets at this stage never reach approval.",
          },
          {
            id: "c",
            text: "This market can't really be sized without knowing what share NB-101 keeps once Novartis and BMS bring competing CAR-T programs to the same indication.",
            nextQuestionId: "g17q3b",
            scoreImpact: -5,
            feedback: "There is no competing solid-tumor CAR-T on the market to share against, that absence is the entire basis for calling NB-101 a breakthrough.",
          },
        ],
      },
      {
        id: "g17q2b",
        stage: "Market Sizing",
        question: "Your unconditional view of the Phase 1 data was too optimistic. The partner corrects you: Phase 2 to Phase 3 success in oncology is only 45%. Given this, how does it change your view of the market opportunity?",
        options: [
          {
            id: "a",
            text: "45% times 85% is 38% combined odds. Apply that to $3.87B peak global and underwrite against $1.47B risk-adjusted, not the headline figure.",
            nextQuestionId: "g17q3a",
            scoreImpact: 15,
            feedback: "That's the right correction, folding the probability into the sizing itself gives you the number the valuation should actually rest on.",
          },
          {
            id: "b",
            text: "If 45% is the success rate, failure is the statistically more likely single outcome, that alone is reason enough to walk away from the position entirely.",
            nextQuestionId: "g17q3b",
            scoreImpact: -10,
            feedback: "A sub-50% probability doesn't make a deal bad by itself, what matters is expected value: probability of success times the success payoff versus the entry price.",
          },
          {
            id: "c",
            text: "A 45% hit rate effectively means this opportunity is worth close to nothing, most oncology programs at this stage fail.",
            nextQuestionId: "g17q3b",
            scoreImpact: -15,
            feedback: "Taken to its logical end, this reasoning rules out investing in any pre-Phase 3 biotech, ever. The 45% belongs inside the probability-weighting of the payoff, not as grounds for zeroing out the opportunity.",
          },
        ],
      },
      {
        id: "g17q2c",
        stage: "Market Sizing",
        question: "You recommended waiting for Phase 3 data. The partner explains: the pre-Phase 3 window is when PE return opportunity exists. Post-Phase 3 success, valuation would be $8-12B. Given this, what is the case for investing now?",
        options: [
          {
            id: "a",
            text: "Entering at $1.8B against an $8-12B post-Phase 3 outcome means buying the success case at 15-22 cents on the dollar.",
            nextQuestionId: "g17q3a",
            scoreImpact: 10,
            feedback: "That's the right reframe, a pre-Phase 3 entry is fundamentally a purchase of optionality at a discount to the value that gets unlocked on success.",
          },
          {
            id: "b",
            text: "An $8-12B post-Phase 3 valuation shows the market already expects NovaBio to succeed, so that number should anchor how we judge today's $1.8B ask.",
            nextQuestionId: "g17q3b",
            scoreImpact: -10,
            feedback: "Post-Phase 3 valuations are conditional on success having already happened, they aren't a read on the market's current expectation.",
          },
          {
            id: "c",
            text: "Even granting the pricing advantage of entering pre-Phase 3, it's more prudent to hold off until Phase 2 data lands.",
            nextQuestionId: "g17q3a",
            scoreImpact: 5,
            feedback: "Waiting for a de-risking catalyst is sound instinct in the abstract, but NovaBio's 18-month cash runway means this round closes well before Phase 2 reads out.",
          },
        ],
      },
      {
        id: "g17q3a",
        stage: "Manufacturing Risk",
        question: "The IC asks about manufacturing, a question that reveals a critical risk. What is the manufacturing situation for a CAR-T therapy and why does it matter?",
        exhibit: {
          type: "table",
          title: "NovaBio Manufacturing Readiness vs Requirements",
          data: `| Parameter                   | NovaBio Current   | Commercial Requirement | Gap          |
|----------------------------|-------------------|------------------------|--------------|
| Manufacturing facility      | Academic contract | FDA-approved GMP       | Critical     |
| Batch success rate          | 78%               | 95%+                   | Significant  |
| Vein-to-vein time           | 28 days           | Target 14-18 days      | Significant  |
| Cost per treatment (mfg)    | $180,000          | Target $80,000         | Major        |
| Annual patient capacity     | 200               | 7,500+ at peak         | Critical     |
| CDMOs at scale globally     | 3 available       | Need 1 committed       | Constrained  |`,
        },
        options: [
          {
            id: "a",
            text: "NovaBio has zero commercial manufacturing today, and only three CDMOs globally run CAR-T at scale.",
            nextQuestionId: "g17q4a",
            scoreImpact: 20,
            feedback: "This is the single most important read in the case. Treating manufacturing as existential rather than routine reflects the real precedent: Kymriah's near-withdrawal shows clinical success alone doesn't guarantee commercial delivery.",
          },
          {
            id: "b",
            text: "Manufacturing is a post-approval problem that capital solves later, scaling production is a routine step every biopharma company works through.",
            nextQuestionId: "g17q4b",
            scoreImpact: -15,
            feedback: "CAR-T manufacturing is not a routine scale-up problem, it requires patient-specific cell collection, modification, and reinfusion on tight timelines. Novartis nearly had Kymriah's approval pulled over exactly this.",
          },
          {
            id: "c",
            text: "Have NovaBio build its own GMP facility using a slice of the $450M, owning manufacturing outright removes the CDMO dependency.",
            nextQuestionId: "g17q4b",
            scoreImpact: -5,
            feedback: "A proprietary CAR-T GMP facility built from scratch runs $300-500M and takes 3-4 years, that would consume most of the investment and push commercialization years past the 18-month runway NovaBio is actually working with.",
          },
        ],
      },
      {
        id: "g17q3b",
        stage: "Manufacturing Risk",
        question: "Your probability analysis has been off. The partner says: manufacturing is the most underappreciated risk in this investment. Given the exhibit showing NovaBio has no commercial manufacturing capability, how does this change the investment recommendation?",
        options: [
          {
            id: "a",
            text: "Make a committed CDMO partnership, from one of the three global-scale CAR-T manufacturers, a pre-closing condition.",
            nextQuestionId: "g17q4a",
            scoreImpact: 15,
            feedback: "That's the right structural fix. Requiring the CDMO commitment before close is the correct response to a risk that is both specific and obtainable in advance.",
          },
          {
            id: "b",
            text: "Cut the check to $300M instead of $450M and negotiate a larger ownership stake to compensate for the added manufacturing uncertainty.",
            nextQuestionId: "g17q4b",
            scoreImpact: -5,
            feedback: "Writing a smaller check doesn't fix the manufacturing gap, it just reduces exposure to a risk that's still sitting there unresolved.",
          },
          {
            id: "c",
            text: "Treat manufacturing risk as a normal part of the biotech risk profile and fold it into the scenario analysis as one more way the deal could underperform.",
            nextQuestionId: "g17q4b",
            scoreImpact: -10,
            feedback: "Accepting a risk without requiring the mitigation that's plainly available, a CDMO commitment, isn't good practice when that mitigation is obtainable before closing.",
          },
        ],
      },
      {
        id: "g17q4a",
        stage: "Competitive Landscape",
        question: "NovaBio claims first-mover status in solid tumor CAR-T. How do you assess the competitive threat from Novartis, BMS, and Arcus Biosciences, who are also targeting CAR-T for solid tumors?",
        exhibit: {
          type: "table",
          title: "Competitive Landscape in Solid Tumor CAR-T",
          data: `| Company        | Program    | Target  | Stage   | ORR Best  | Notes                    |
|---------------|------------|---------|---------|-----------|--------------------------|
| NovaBio        | NB-101     | MSLN    | Phase 2 | 62%       | Pancreatic, n=29         |
| Novartis       | CART-GPC3  | GPC3    | Phase 2 | 24%       | Liver cancer             |
| BMS/Celgene    | BMS-986340 | EGFR    | Phase 1 | 18%       | Lung cancer              |
| Arcus Bio      | AB-101     | MSLN    | Phase 1 | 31%       | Same target as NovaBio   |
| Tmunity/Penn   | TMU-101    | PSCA    | Phase 1 | 15%       | Prostate cancer          |
| Prior failures |            |         |         | Under 20% | 8 large pharma failures  |`,
        },
        options: [
          {
            id: "a",
            text: "NovaBio and Arcus target the same antigen, MSLN, yet NovaBio's ORR is roughly double Arcus's.",
            nextQuestionId: "g17q5a",
            scoreImpact: 20,
            feedback: "This is the complete read. The same-antigen comparison against Arcus is the single most informative competitive data point available.",
          },
          {
            id: "b",
            text: "Arcus targeting the same MSLN antigen is a direct threat that could split the eventual market and cut NovaBio's peak sales by 30-50% if both programs reach approval.",
            nextQuestionId: "g17q5b",
            scoreImpact: -5,
            feedback: "Arcus is running at 31% ORR against NovaBio's 62% on the identical target and indication, an efficacy gap of that size in oncology typically produces a dominant winner, not a split market.",
          },
          {
            id: "c",
            text: "Eight large-pharma failures in solid-tumor CAR-T suggest the approach doesn't really work at scale, and NovaBio's Phase 1 result is more likely a small-trial artifact.",
            nextQuestionId: "g17q5b",
            scoreImpact: -10,
            feedback: "Those prior failures are the reason NovaBio's result stands out, not a reason to distrust it, each used different targets, constructs, and patient populations.",
          },
        ],
      },
      {
        id: "g17q4b",
        stage: "Competitive Landscape",
        question: "Your manufacturing or probability analysis has been incomplete. The partner asks: given NovaBio's 62% ORR versus Arcus's 31% on the same target, what does the competitive landscape tell you about the strength of NovaBio's IP position?",
        options: [
          {
            id: "a",
            text: "Same target, twice the response rate, that gap has to come from the construct engineering, not the antigen choice.",
            nextQuestionId: "g17q5a",
            scoreImpact: 15,
            feedback: "Correct read. Comparing two programs on the identical target isolates construct quality as the real differentiator.",
          },
          {
            id: "b",
            text: "MSLN as a target isn't proprietary to NovaBio, several companies are chasing it across various modalities, so the IP position here is considerably shakier than the headline efficacy numbers suggest.",
            nextQuestionId: "g17q5b",
            scoreImpact: -5,
            feedback: "NovaBio's patents cover the CAR construct and manufacturing process, not the MSLN antigen itself, the 62% ORR is a function of the engineered construct, which is exactly what's protected.",
          },
          {
            id: "c",
            text: "IP strength is too hard to call right now, competitor Phase 1 data across the field will mature in 18-24 months, and the decision should wait for that fuller picture.",
            nextQuestionId: "g17q5b",
            scoreImpact: -10,
            feedback: "Waiting 18-24 months for the rest of the field's Phase 1 data means missing this deal entirely, NovaBio's cash runway closes this round well before then.",
          },
        ],
      },
      {
        id: "g17q5a",
        stage: "Scenario Analysis",
        question: "Build the probability-weighted return analysis. The partner has structured five scenarios. Calculate the expected MOIC on the $450M investment.",
        exhibit: {
          type: "table",
          title: "NovaBio Investment Scenario Analysis",
          data: `| Scenario                                  | Prob | Exit EV  | PE 25% Value |
|-------------------------------------------|------|----------|--------------|
| P3 success plus acquisition by large pharma| 32% | $21.6B   | $5.4B        |
| P3 success plus IPO exit                  | 13% | $14.4B   | $3.6B        |
| Phase 2 positive triggers acqui pre-P3   | 20% | $4.5B    | $1.1B        |
| P3 failure with asset sale or licensing   | 25% | $0.6B    | $0.15B       |
| Complete failure with no salvage          | 10% | $0       | $0           |`,
        },
        options: [
          {
            id: "a",
            text: "32% times $5.4B, plus 13% times $3.6B, plus 20% times $1.1B, plus 25% times $0.15B, plus 10% times $0.",
            nextQuestionId: "g17q6a",
            scoreImpact: 20,
            feedback: "The math is right and the discipline behind it matters more than the number itself, computing full expected value across every scenario is what rigorous biotech underwriting looks like.",
          },
          {
            id: "b",
            text: "The Phase 2 acquisition path alone, 20% probability at $1.1B PE value, already returns more than the $450M invested even without full approval.",
            nextQuestionId: "g17q6a",
            scoreImpact: 10,
            feedback: "That downside-protection observation is a genuinely useful data point, but it's a supporting point, not the headline: the full probability-weighted 5.5x MOIC is the number that should lead the recommendation.",
          },
          {
            id: "c",
            text: "35% of the scenario weight sits in outcomes with little or no value, that's too much binary downside for a $450M check.",
            nextQuestionId: "g17q6b",
            scoreImpact: -15,
            feedback: "35% probability of an adverse outcome is unremarkable for biotech investing generally and doesn't override the math, that tail is already priced into the 5.5x expected MOIC.",
          },
        ],
      },
      {
        id: "g17q5b",
        stage: "Scenario Analysis",
        question: "Your competitive analysis was unclear. The partner gives you the scenario analysis directly. The expected MOIC calculation gives 5.5x on $450M. Does this support investment?",
        options: [
          {
            id: "a",
            text: "Yes. 5.5x clears standard PE thresholds of 2-3x with room to spare, and even haircutting the success scenarios by half for execution risk still lands above the hurdle. Attach the two conditions: CDMO partnership and independent scientific review.",
            nextQuestionId: "g17q6a",
            scoreImpact: 15,
            feedback: "This is the complete picture, confirming the return clears the bar even under added conservatism, and tying it to the two specific conditions that protect it.",
          },
          {
            id: "b",
            text: "The 5.5x figure leans heavily on the higher-probability acquisition scenario, and if large pharma doesn't buy post-Phase 3, the return case gets noticeably weaker.",
            nextQuestionId: "g17q6b",
            scoreImpact: -5,
            feedback: "3.6x on the IPO path by itself still clears standard PE thresholds comfortably. The acquisition and IPO scenarios combined carry 45% probability and both deliver strong returns.",
          },
          {
            id: "c",
            text: "This MOIC is only as good as the scenario probabilities behind it, and given how uncertain oncology outcomes are, the conclusion is too sensitive to the inputs to act on with confidence.",
            nextQuestionId: "g17q6b",
            scoreImpact: -10,
            feedback: "Every investment decision under uncertainty is sensitive to its inputs, that's not a reason to reject the analysis, it's a reason to stress-test it.",
          },
        ],
      },
      {
        id: "g17q6a",
        stage: "Deal Structure",
        question: "The IC is persuaded on the financial case. How should the $450M investment be structured to protect the PE firm against the key risks identified?",
        options: [
          {
            id: "a",
            text: "Standard equity, $1.8B pre-money for 25%, with two pre-closing conditions: independent scientific review and a committed CDMO partnership. Layer in a milestone tranche: $150M at signing, $150M at Phase 3 start, $150M at completion.",
            nextQuestionId: "g17q7a",
            scoreImpact: 20,
            feedback: "This structure addresses both identified risks directly through the conditions, and the tranche release protects $300M of capital against Phase 3 execution risk.",
          },
          {
            id: "b",
            text: "Structure it as a convertible note with a 20% discount to the next round, which keeps the option to increase ownership if Phase 2 reads positive.",
            nextQuestionId: "g17q7b",
            scoreImpact: -5,
            feedback: "A convertible note at this size and stage would be an unusual ask that NovaBio's management is unlikely to accept, pre-IPO PE checks at a $1.8B valuation are typically priced equity.",
          },
          {
            id: "c",
            text: "Write the full $450M upfront with no conditions or tranches, adding structure risks losing NovaBio to a competing bidder.",
            nextQuestionId: "g17q7b",
            scoreImpact: -10,
            feedback: "Paying the full amount upfront with no conditions removes all pre-closing protection against the manufacturing and scientific risks that were just identified.",
          },
        ],
      },
      {
        id: "g17q6b",
        stage: "Deal Structure",
        question: "Your probability analysis or competitive assessment has been incomplete. The partner confirms: the expected MOIC is 5.5x and the investment should proceed. What are the two most important conditions to attach?",
        options: [
          {
            id: "a",
            text: "One: independent scientific advisory board validation of the Phase 2 data before close, since the n=29 Phase 1 result needs an outside clinical read. Two: a committed CDMO manufacturing partnership from one of the three global-scale operators.",
            nextQuestionId: "g17q7a",
            scoreImpact: 15,
            feedback: "Both conditions target the two material, non-financial risks in this deal, the small clinical sample and the manufacturing gap, and both are obtainable before closing.",
          },
          {
            id: "b",
            text: "One: require NovaBio to hit a specific Phase 2 enrollment milestone before closing. Two: have the founding CEO sign a five-year retention agreement.",
            nextQuestionId: "g17q7b",
            scoreImpact: -5,
            feedback: "An enrollment milestone is too operational a condition, NovaBio controls that pace, and it could stall closing indefinitely. Neither addresses the manufacturing or scientific-validation risks.",
          },
          {
            id: "c",
            text: "One: get a major pharma company to co-invest at the same valuation as third-party validation. Two: tranche the entire $450M against Phase 3 milestones only, with no capital released until top-line data reads out.",
            nextQuestionId: "g17q7b",
            scoreImpact: -10,
            feedback: "A pharma co-investor at the same valuation pre-Phase 3 is unlikely to materialize. Withholding all capital until Phase 3 milestones would leave NovaBio unfunded well before then.",
          },
        ],
      },
      {
        id: "g17q7a",
        stage: "Final Recommendation",
        question: "The IC asks for the final recommendation: go or no-go, valuation basis, expected MOIC, and the two conditions.",
        options: [
          {
            id: "a",
            text: "Invest $450M at $1.8B pre-money for 25%. 5.5x probability-weighted MOIC, 25-32% IRR. Two conditions: independent scientific review, committed CDMO partnership. Structure: $150M at signing, $150M at Phase 3 start, $150M at completion.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Scientific rationale, financial case, deal structure, and two specific actionable conditions, all in one place, the IC has what it needs to approve this.",
          },
          {
            id: "b",
            text: "Push for $300M at a $1.2B pre-money valuation instead of $450M at $1.8B, a smaller check at a lower price that improves entry economics.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Pushing on price is a legitimate negotiating stance, but a 33% valuation cut is unlikely to be something NovaBio accepts, and the return case already clears the bar at the full $450M.",
          },
          {
            id: "c",
            text: "Pass for now and revisit once Phase 2 data is in hand, the financial case is strong, but n=29 Phase 1 data is too thin a foundation without that confirmation.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Phase 2 data won't be available before NovaBio's 18-month cash runway forces this round to close, so revisit later is effectively passing for good.",
          },
        ],
      },
      {
        id: "g17q7b",
        stage: "Final Recommendation",
        question: "Your analysis has had gaps. The partner gives you one final opportunity: the IC needs a go or no-go with two conditions in three minutes. What do you say?",
        options: [
          {
            id: "a",
            text: "Go, at $1.8B pre-money for 25%. 5.5x MOIC, 25-32% IRR. Two conditions: independent scientific review, committed CDMO partnership before close. Tranche $150M at signing, Phase 3 start, and completion.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "A strong recovery under time pressure, decision, valuation, return, both conditions, and structure, all delivered concisely enough for the IC to act on immediately.",
          },
          {
            id: "b",
            text: "The case supports investment, but committing $450M without more diligence on CDMO capacity and NovaBio's manufacturing timeline feels premature, roughly four more weeks would help.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "The partner asked for three minutes, not four weeks, and the analysis is already complete enough to answer.",
          },
          {
            id: "c",
            text: "Pass, 35% of the scenario weight sits in adverse outcomes, which is too much binary risk for institutional capital.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "Walking away from a 5.5x expected MOIC because 35% of scenarios are adverse, which is unremarkable for biotech, after eight weeks of analysis that clearly supports the deal, is the wrong call.",
          },
        ],
      },
    ],
  },
  {
    id: "g18",
    title: "MidFirst Bank: Stress Test and Capital Strategy",
    type: "profitability",
    difficulty: "advanced",
    firm: "oliver-wyman",
    estimatedMinutes: 38,
    overview: "A regional US bank is preparing for its first Federal Reserve stress test. Oliver Wyman has been engaged to help management understand the likely outcomes and develop a capital optimization strategy.",
    clientBackground: "MidFirst Bank has $78B in total assets, $62B in loans, and $8.2B in common equity tier 1 capital, a CET1 ratio of 10.5%. The bank has significant commercial real estate concentration at 34% of total loans versus a 22% peer average. Net interest margin is 3.4%. The CEO is concerned that the Fed's severe scenario will result in a capital shortfall that would restrict dividends and buybacks for two years.",
    yourRole: "You are an Oliver Wyman manager on the financial services practice. You have 10 weeks before the Fed stress test submission. The CFO is your primary client.",
    startQuestionId: "g18q1",
    finalRecommendationPrompt: "What capital strategy should MidFirst Bank adopt before the stress test submission, and what is the expected post-stress CET1 ratio under the severe scenario?",
    sampleRecommendation: "MidFirst should take three pre-submission actions. First, reduce CRE concentration from 34% to 28% through loan sales and risk transfers, improving the post-stress CET1 by 80-120 basis points. Second, optimize risk-weighted assets through portfolio restructuring, reducing RWA by approximately $1.1B, improving CET1 by 14 basis points. Third, pre-position the PPNR model to reflect the bank's actual through-the-cycle margin resilience. Expected post-stress CET1: 7.8-8.4%.",
    idealRecommendation: "Three actions: CRE concentration reduction to 28% (80-120 bps CET1 improvement), RWA optimization through portfolio restructuring (14 bps), and PPNR model pre-positioning. Expected post-stress CET1: 7.8-8.4% versus 4.5% minimum. Dividends maintainable; buybacks suspended for two years until CET1 rebuilds above 9%.",
    keyTakeaways: [
      "Stress testing is as much a management exercise as a regulatory one, the assumptions and model choices within Fed-approved ranges significantly affect outcomes",
      "CRE concentration is the single most penalized portfolio characteristic in Fed stress tests because of the 2008 experience with commercial real estate losses",
      "Pre-positioning means taking portfolio actions before the test submission date that reduce projected stressed losses, this is legitimate capital management, not manipulation",
      "The difference between passing a stress test and passing well determines whether management can return capital to shareholders",
    ],
    questions: [
      {
        id: "g18q1",
        stage: "Stress Test Framework",
        question: "The CFO asks: what exactly does the Fed stress test measure and what determines whether MidFirst passes or fails? Frame the analytical structure before looking at any numbers.",
        options: [
          {
            id: "a",
            text: "It measures whether CET1 stays above a 4.5% floor through a nine-quarter severely adverse scenario.",
            nextQuestionId: "g18q2a",
            scoreImpact: 20,
            feedback: "That's the right framework, starting capital minus stressed losses plus stressed revenues is the core equation, and recognizing MidFirst has roughly 6 points of buffer is what the rest of the analysis should build from.",
          },
          {
            id: "b",
            text: "It's mostly a qualitative check on governance and capital planning process, quantitative outcomes matter less than demonstrating the bank has solid internal controls.",
            nextQuestionId: "g18q2b",
            scoreImpact: -10,
            feedback: "The Dodd-Frank stress test is fundamentally quantitative, the CET1 ratio under the severely adverse scenario is what determines whether capital distributions get restricted.",
          },
          {
            id: "c",
            text: "It measures whether the bank stays profitable through all three stress years, any year with a net loss is an automatic fail.",
            nextQuestionId: "g18q2b",
            scoreImpact: -5,
            feedback: "Banks are expected to post losses somewhere in a severe scenario, that's the point of stress testing. What matters is whether cumulative capital erosion stays above the 4.5% CET1 floor.",
          },
        ],
      },
      {
        id: "g18q2a",
        stage: "Loss Projection",
        question: "Now estimate the stressed losses MidFirst will face. The CRE concentration at 34% of loans is the most significant risk factor. Review the exhibit and project the stressed capital position.",
        exhibit: {
          type: "table",
          title: "MidFirst Loan Portfolio Stress Loss Analysis",
          data: `| Segment            | Balance  | Pct of Loans | Stressed Loss Rate | Projected Loss |
|--------------------|----------|-------------|--------------------|-----------------|
| CRE office         | $8.4B    | 13.5%       | 12.5%              | $1,050M         |
| CRE retail         | $4.8B    | 7.7%        | 9.5%               | $456M           |
| CRE multifamily    | $7.9B    | 12.7%       | 4.5%               | $356M           |
| C&I loans          | $16.2B   | 26.1%       | 5.5%               | $891M           |
| Residential mtg    | $12.4B   | 20.0%       | 2.8%               | $347M           |
| Consumer/other     | $12.3B   | 19.8%       | 6.5%               | $800M           |
| Total loans        | $62.0B   | 100%        | 6.3% avg           | $3,900M         |`,
        },
        options: [
          {
            id: "a",
            text: "Total stressed losses land around $3.9B. Net that against $8.2B starting CET1 and stressed PPNR to get roughly 8.7% post-stress, clearing the floor but reflecting the CRE concentration premium.",
            nextQuestionId: "g18q3a",
            scoreImpact: 20,
            feedback: "The full calculation gets you to the right place, 8.7% clears the floor with real margin, but CRE office at a 12.5% loss rate is the main driver behind the elevated average.",
          },
          {
            id: "b",
            text: "$3.9B in projected losses against $8.2B of starting capital is comfortably absorbable, the bank doesn't need to do anything further here.",
            nextQuestionId: "g18q3b",
            scoreImpact: -5,
            feedback: "Concluding no action is needed without finishing the ratio calculation is premature, the real question is what CET1 ratio comes out the other end.",
          },
          {
            id: "c",
            text: "Concentrate entirely on the CRE office segment, at $1.05B the single largest loss driver, so pre-positioning should target it specifically.",
            nextQuestionId: "g18q3a",
            scoreImpact: 5,
            feedback: "CRE office is correctly flagged as the biggest single driver, but the full loss calculation across all segments still needs to be completed.",
          },
        ],
      },
      {
        id: "g18q2b",
        stage: "Loss Projection",
        question: "The partner corrects the stress test framework. The quantitative CET1 ratio determines the outcome. MidFirst starts at 10.5% CET1 and must stay above 4.5%. Given CRE concentration at 34% of loans, what is the primary risk?",
        options: [
          {
            id: "a",
            text: "CRE concentration is the primary risk, since the severe scenario assumes a 40% CRE price decline alongside 30%+ unemployment in specific markets.",
            nextQuestionId: "g18q3a",
            scoreImpact: 15,
            feedback: "That's the right diagnosis, quantifying the 34% versus 22% gap and tying it directly to the severe scenario's specific CRE assumptions is the correct way to frame this.",
          },
          {
            id: "b",
            text: "The bigger risk is the 3.4% net interest margin, which could compress sharply in a stressed rate environment.",
            nextQuestionId: "g18q3b",
            scoreImpact: -5,
            feedback: "An above-average NIM is a potential benefit in stress, not a risk, it suggests MidFirst may generate relatively more PPNR to absorb losses.",
          },
          {
            id: "c",
            text: "The real exposure is reputational: if the market perceives MidFirst as performing poorly, that could trigger deposit outflows.",
            nextQuestionId: "g18q3b",
            scoreImpact: -10,
            feedback: "Reputational fallout is a legitimate post-test concern, but it isn't the primary driver for designing a pre-positioning strategy right now.",
          },
        ],
      },
      {
        id: "g18q3a",
        stage: "Pre-Positioning Strategy",
        question: "The post-stress CET1 of 8.7% passes the minimum but the CFO wants to improve it before submission. What pre-positioning actions are available and which should be prioritized?",
        options: [
          {
            id: "a",
            text: "Prioritize CRE concentration reduction first, taking CRE from 34% to 28% through loan sales, could improve post-stress CET1 by 80-120 bps.",
            nextQuestionId: "g18q4a",
            scoreImpact: 20,
            feedback: "That's the right order of priority. CRE reduction carries the largest single impact since it cuts directly into the highest-loss segment.",
          },
          {
            id: "b",
            text: "Raise fresh equity capital before submission to push starting CET1 from 10.5% to 12%.",
            nextQuestionId: "g18q4b",
            scoreImpact: -5,
            feedback: "Raising equity specifically to pad a stress test is expensive and tends to signal weakness to the market. Reducing stressed losses through portfolio actions is far more capital-efficient.",
          },
          {
            id: "c",
            text: "Push the Fed for more favorable CRE loss assumptions, citing MidFirst's own CRE portfolio, which has outperformed sector loss rates.",
            nextQuestionId: "g18q4b",
            scoreImpact: -10,
            feedback: "Banks don't get to negotiate DFAST loss-rate assumptions, the Fed applies standardized scenarios uniformly.",
          },
        ],
      },
      {
        id: "g18q3b",
        stage: "Pre-Positioning Strategy",
        question: "The partner corrects your diagnosis and confirms CRE at 34% versus 22% peer average is the primary risk. What does this concentration mean for MidFirst's stressed loss rate relative to peers?",
        options: [
          {
            id: "a",
            text: "The concentration produces a structural loss-rate premium of roughly 100-150 bps above peer average.",
            nextQuestionId: "g18q4a",
            scoreImpact: 15,
            feedback: "That quantification is the key move here, putting a dollar figure on the concentration penalty gives the pre-positioning strategy something concrete to target.",
          },
          {
            id: "b",
            text: "CRE concentration widens the range of possible outcomes but doesn't necessarily raise expected losses, since MidFirst's book may simply be higher quality than sector-wide numbers suggest.",
            nextQuestionId: "g18q4b",
            scoreImpact: -5,
            feedback: "The Fed applies standardized loss rates by property type in the severe scenario, not bank-specific historical performance.",
          },
          {
            id: "c",
            text: "This concentration risk is already captured in MidFirst's current regulatory capital ratio.",
            nextQuestionId: "g18q4b",
            scoreImpact: -10,
            feedback: "Current regulatory capital ratios are risk-weight based, not stress-test outcomes, a bank can carry a solid current CET1 ratio while still having a concentration that creates real stress-test vulnerability.",
          },
        ],
      },
      {
        id: "g18q4a",
        stage: "CRE Reduction Strategy",
        question: "CRE concentration reduction is the priority. The CFO asks: how do we reduce CRE from 34% to 28% within the 10-week window and what is the cost?",
        exhibit: {
          type: "table",
          title: "CRE Reduction Options",
          data: `| Option              | Volume  | Timeline   | Economic Cost  | CET1 Impact   |
|--------------------|---------|------------|----------------|----------------|
| Loan sales at par  | $1.5B   | 4-6 weeks  | Minimal        | +18 bps        |
| Loan sales at disc | $2.5B   | 3-4 weeks  | 2-3% discount  | +25 bps loss   |
| Credit risk transfer| $2.0B  | 6-8 weeks  | 1.5% premium   | +22 bps        |
| Syndication out     | $1.2B   | 8-10 weeks | Relationship    | +14 bps        |
| New origination cap | ongoing | Immediate  | Revenue impact  | Long-term      |`,
        },
        options: [
          {
            id: "a",
            text: "Combine two levers: $1.5B in at-par loan sales for a quick, low-cost balance reduction, plus $2.0B in credit risk transfer to hedge the remaining large exposures without selling off the client relationships.",
            nextQuestionId: "g18q5a",
            scoreImpact: 20,
            feedback: "This combination gets the most out of the available window, at-par sales cut balances with minimal cost, and credit risk transfer hedges the exposure that's too large or relationship-sensitive to sell outright.",
          },
          {
            id: "b",
            text: "Move fast with $2.5B in discounted loan sales right away, since speed matters more here than pricing precision.",
            nextQuestionId: "g18q5b",
            scoreImpact: 5,
            feedback: "Discounted sales do hit the concentration target quickly, but a 2-3% discount on $2.5B is $50-75M in realized losses straight off current CET1.",
          },
          {
            id: "c",
            text: "Put an immediate cap on new CRE originations, it's the most operationally simple move and avoids transaction costs entirely.",
            nextQuestionId: "g18q5b",
            scoreImpact: -10,
            feedback: "An origination cap stops the concentration from growing further, but it does nothing to bring down the existing 34% within the 10-week submission window.",
          },
        ],
      },
      {
        id: "g18q4b",
        stage: "CRE Reduction Strategy",
        question: "Your analysis of CRE concentration risk was incomplete. The partner confirms that reducing CRE from 34% to 28% would improve post-stress CET1 by approximately 90 basis points. How do you execute this reduction in 10 weeks?",
        options: [
          {
            id: "a",
            text: "Run two tracks in parallel: $1.5B in immediate at-par sales into a secondary market where demand for performing CRE paper is currently solid, plus $2.0B in credit risk transfer through CLO-style structures that shift the credit risk off balance sheet.",
            nextQuestionId: "g18q5a",
            scoreImpact: 15,
            feedback: "That combination hits the concentration target within the timeline efficiently, without absorbing the economic cost that comes with forced discounted sales.",
          },
          {
            id: "b",
            text: "Sell the full $3.5B needed at whatever discount the secondary market demands to get it done inside 10 weeks.",
            nextQuestionId: "g18q5b",
            scoreImpact: -5,
            feedback: "Forced sales at whatever discount clears the market signal weakness to counterparties, and the resulting losses on $3.5B could run $70-105M.",
          },
          {
            id: "c",
            text: "Ask the Fed for a short extension on the submission timeline to allow more time to work down CRE concentration properly.",
            nextQuestionId: "g18q5b",
            scoreImpact: -15,
            feedback: "Requesting an extension for pre-positioning purposes isn't realistic, the Fed's stress test calendar is fixed, and asking for more time would itself signal to the regulator that MidFirst is struggling.",
          },
        ],
      },
      {
        id: "g18q5a",
        stage: "Capital Distribution Strategy",
        question: "Post-stress CET1 is projected at 8.6% after pre-positioning actions. The CFO asks: what capital distribution strategy, dividends and buybacks, can MidFirst maintain over the next two years?",
        exhibit: {
          type: "table",
          title: "Capital Distribution Analysis",
          data: `| Scenario                     | Post-Stress CET1 | Fed Minimum | Headroom | Distribution Capacity |
|------------------------------|-------------------|-------------|----------|------------------------|
| No pre-positioning           | 7.8%              | 4.5%        | 3.3pp    | Restricted             |
| With CRE reduction           | 8.6%              | 4.5%        | 4.1pp    | Limited                |
| Peer average                 | 9.2%              | 4.5%        | 4.7pp    | Moderate               |
| Best-in-class                | 11.4%             | 4.5%        | 6.9pp    | Full                   |
| MidFirst target (2yr)        | 9.5%              | 4.5%        | 5.0pp    | Moderate               |`,
        },
        options: [
          {
            id: "a",
            text: "At 8.6% post-stress CET1 with 4.1pp of headroom, dividends can stay in place.",
            nextQuestionId: "g18q6a",
            scoreImpact: 20,
            feedback: "That's the right split. Dividends are supportable given the headroom, and pausing buybacks is the prudent way to rebuild the ratio toward peer and target levels over two years.",
          },
          {
            id: "b",
            text: "Suspend both dividends and buybacks right away to maximize capital retention and hit the 9.5% target as fast as possible.",
            nextQuestionId: "g18q6b",
            scoreImpact: -5,
            feedback: "With 4.1pp of headroom above the floor and dividends supportable through ongoing earnings, cutting them too is more conservative than the situation calls for.",
          },
          {
            id: "c",
            text: "Keep both dividends and buybacks running at current levels, since 8.6% is well above the 4.5% minimum.",
            nextQuestionId: "g18q6b",
            scoreImpact: -10,
            feedback: "At 8.6% against a 9.2% peer average and a 9.5% internal target, continuing buybacks at full pace just delays getting to where the bank wants to be.",
          },
        ],
      },
      {
        id: "g18q5b",
        stage: "Capital Distribution Strategy",
        question: "Your CRE reduction execution was not optimal. The partner says: assume CRE reduction brings post-stress CET1 to 8.6%, 4.1pp above the minimum but below the 9.2% peer average. What capital distribution strategy does this support?",
        options: [
          {
            id: "a",
            text: "Keep dividends in place, the 4.1pp headroom plus the bank's NIM resilience supports it. Pause buybacks for two years, rebuilding CET1 to around 9.5%.",
            nextQuestionId: "g18q6a",
            scoreImpact: 15,
            feedback: "That's the right call on both fronts, dividends are supportable, and pausing buybacks is the fastest realistic path to the 9.5% target.",
          },
          {
            id: "b",
            text: "Mirror what peers are doing, if peers at 9.2% are maintaining full dividends and buybacks, MidFirst at 8.6% should scale distributions down proportionally.",
            nextQuestionId: "g18q6b",
            scoreImpact: 0,
            feedback: "Peer distribution levels are useful context, but MidFirst's 8.6% with its specific CRE concentration isn't directly comparable to peers running more diversified books.",
          },
          {
            id: "c",
            text: "Cut dividends by half and suspend buybacks entirely, the combination of below-peer CET1 and elevated CRE concentration justifies being more conservative than peers.",
            nextQuestionId: "g18q6b",
            scoreImpact: -5,
            feedback: "Cutting dividends when there's 4.1pp of headroom above the floor is more conservative than the numbers support.",
          },
        ],
      },
      {
        id: "g18q6a",
        stage: "Regulatory Communication",
        question: "The CFO asks: how do we communicate the stress test results and our capital strategy to investors, and what is the key message?",
        options: [
          {
            id: "a",
            text: "Structure it in three parts. First, get ahead of the CRE concentration story, investors already know it from the filings.",
            nextQuestionId: "g18q7a",
            scoreImpact: 20,
            feedback: "Getting ahead of the CRE story and pairing it with the pre-positioning actions already taken turns a known weakness into a management-credibility narrative.",
          },
          {
            id: "b",
            text: "Keep the CRE concentration discussion light in investor materials, drawing attention to it risks accelerating a negative reaction.",
            nextQuestionId: "g18q7b",
            scoreImpact: -10,
            feedback: "Downplaying a concentration that's already visible in public filings costs more credibility than it saves.",
          },
          {
            id: "c",
            text: "Hold off on investor communication until the official Fed results are published.",
            nextQuestionId: "g18q7b",
            scoreImpact: -5,
            feedback: "Communicating capital strategy ahead of official results, without disclosing non-public specifics, is standard practice for banks preparing for a stress test.",
          },
        ],
      },
      {
        id: "g18q6b",
        stage: "Regulatory Communication",
        question: "Your capital distribution recommendation was not optimal. The partner gives you the correct position: dividends maintained, buybacks suspended for two years. Now design the investor communication.",
        options: [
          {
            id: "a",
            text: "Open with the CRE acknowledgment and the specific pre-positioning actions already taken.",
            nextQuestionId: "g18q7a",
            scoreImpact: 15,
            feedback: "Leading with the actions taken rather than the underlying problem, and giving a specific roadmap to the target ratio, is the right way to frame this for investors.",
          },
          {
            id: "b",
            text: "Present the stress test results without commentary on the buyback decision and let investors reach their own conclusions.",
            nextQuestionId: "g18q7b",
            scoreImpact: -10,
            feedback: "A buyback suspension is a material capital-allocation decision investors need context to interpret.",
          },
          {
            id: "c",
            text: "Put out a release once results land that emphasizes passing the minimum threshold, without specifically addressing the buyback suspension.",
            nextQuestionId: "g18q7b",
            scoreImpact: -5,
            feedback: "Burying the buyback suspension instead of leading with the full capital strategy just hands analysts the pen to write their own narrative.",
          },
        ],
      },
      {
        id: "g18q7a",
        stage: "Final Recommendation",
        question: "The CFO asks for the complete recommendation: three actions, expected post-stress CET1, and the capital distribution plan.",
        options: [
          {
            id: "a",
            text: "Three actions: reduce CRE to 28% for a 90 bps CET1 gain, restructure the commercial loan book for a 14 bps RWA gain, and tighten PPNR documentation.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "Three quantified actions, a specific post-stress ratio, and a concrete two-year capital plan, the CFO has everything needed to take this to the board and to regulators.",
          },
          {
            id: "b",
            text: "Focus everything on the single biggest lever, CRE reduction, and push RWA optimization and PPNR documentation into a separate workstream after the stress test.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "CRE reduction is rightly the top priority, but RWA optimization and PPNR documentation are comparatively low-effort tracks that can run in parallel rather than being deferred.",
          },
          {
            id: "c",
            text: "Recommend raising $1B in fresh equity to lift starting CET1 from 10.5% to 11.8%, that removes the stress test concern entirely.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Equity issuance is expensive, signals weakness, and dilutes existing shareholders. The portfolio actions already available get to essentially the same outcome at a fraction of the cost.",
          },
        ],
      },
      {
        id: "g18q7b",
        stage: "Final Recommendation",
        question: "Your analysis has had several gaps. The partner gives you one final chance: the CFO needs the complete recommendation now. What do you tell him?",
        options: [
          {
            id: "a",
            text: "Three actions: bring CRE down from 34% to 28% for a 90 bps CET1 gain, restructure for a 14 bps RWA benefit, tighten PPNR documentation.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "A solid recovery, every key element is here in a tight, usable format the CFO can bring straight to the board and to regulators.",
          },
          {
            id: "b",
            text: "Ask for two more weeks to finalize the PPNR model documentation and validate the CRE loss-rate assumptions against MidFirst's own historical data.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "The CFO asked for the recommendation now, with the 10-week window nearly closed and the underlying analysis already complete.",
          },
          {
            id: "c",
            text: "The numbers show MidFirst clears the minimum threshold with or without pre-positioning, so the whole program is optional.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Calling a 90 bps CET1 improvement and the difference between restricted and unrestricted capital distributions optional undersells what's actually at stake.",
          },
        ],
      },
    ],
  },
  {
    id: "g19",
    title: "PrimePackage: CPG Portfolio Restructuring",
    type: "profitability",
    difficulty: "advanced",
    firm: "bcg",
    estimatedMinutes: 38,
    overview: "A large US consumer packaged goods company has seen its portfolio of 140 brands underperform peers for five consecutive years. BCG has been engaged to recommend a portfolio restructuring.",
    clientBackground: "PrimePackage has $18B in annual revenue across 140 brands in personal care, household products, and food. Total shareholder return over five years is 12% versus the CPG sector average of 34%. Organic revenue growth is 1.2% versus 3.8% for peers. EBITDA margin is 14% versus 19% for best-in-class. The CEO has engaged BCG under pressure from activist investors who are calling for a spin-off or sale of underperforming categories.",
    yourRole: "You are a BCG project leader on the consumer goods practice. You have 12 weeks to deliver a portfolio restructuring recommendation to the board.",
    startQuestionId: "g19q1",
    finalRecommendationPrompt: "What portfolio restructuring should PrimePackage execute, and what is the expected financial impact on organic growth, EBITDA margin, and TSR?",
    sampleRecommendation: "Three actions: divest the bottom-quartile 35 brands generating $2.4B in revenue at 6% EBITDA margin. Use proceeds to fund the top 20 brands with disproportionate marketing investment; acquire one bolt-on in the personal care premium segment; and restructure the organizational model from a category-based to a brand-based P&L structure. Expected impact: organic growth improves from 1.2% to 3.1%, EBITDA margin expands from 14% to 17.5%, TSR improves toward peer average.",
    idealRecommendation: "Divest 35 bottom-quartile brands ($2.4B revenue, 6% EBITDA), invest proceeds in top-20 brands and one premium bolt-on acquisition. Restructure to brand-based P&L. Expected: organic growth 3.1%, EBITDA 17.5%, TSR toward sector average. The conglomerate discount, estimated at 15-20%, begins to compress as portfolio clarity improves.",
    keyTakeaways: [
      "Conglomerate discounts in CPG are real and persistent, diversified portfolios of weak brands trade at lower multiples than focused portfolios of strong brands",
      "In CPG portfolio strategy, divestiture of small non-core brands often generates more TSR than acquisition, resources concentrated on fewer stronger brands outperform",
      "Marketing investment concentration is non-linear, doubling investment on a strong brand generates more than 2x the return of spreading the same investment across multiple weak brands",
      "Organizational structure follows strategy, a brand-based P&L structure creates the accountability and resource allocation discipline that a category-based structure typically obscures",
    ],
    questions: [
      {
        id: "g19q1",
        stage: "Portfolio Diagnosis",
        question: "PrimePackage's TSR of 12% versus sector average of 34% is the headline problem. Before recommending specific actions, how do you diagnose the root cause of the underperformance?",
        context: "Five years of underperformance suggests a structural issue rather than a cyclical one.",
        options: [
          {
            id: "a",
            text: "Split the 22pp TSR gap into its growth, margin, and multiple components and see which one is actually doing the damage before touching anything else.",
            nextQuestionId: "g19q2a",
            scoreImpact: 20,
            feedback: "This is the right sequencing. Decomposing TSR into growth, margin, and multiple contribution before proposing fixes ensures the recommendation targets the component that's actually driving the gap.",
          },
          {
            id: "b",
            text: "Pull marketing spend as a percent of revenue for PrimePackage and its five closest peers, run the comparison, and flag any brand below the peer median for a spend increase.",
            nextQuestionId: "g19q2b",
            scoreImpact: -5,
            feedback: "Marketing spend could be part of the story, but jumping to a single-variable benchmark before the TSR decomposition risks chasing a symptom.",
          },
          {
            id: "c",
            text: "Sit down with the three category division CEOs first and get their read on why growth has stalled before running any numbers.",
            nextQuestionId: "g19q2b",
            scoreImpact: -10,
            feedback: "Division CEOs will naturally point to factors outside their control rather than the portfolio composition and capital allocation choices that are actually driving the underperformance.",
          },
        ],
      },
      {
        id: "g19q2a",
        stage: "TSR Decomposition",
        question: "The TSR decomposition analysis is complete. Review the exhibit and identify the primary driver of the 22pp TSR underperformance.",
        exhibit: {
          type: "table",
          title: "PrimePackage TSR Decomposition vs Peers",
          data: `| Component                | PrimePackage | Peer Average | Gap    | Notes                       |
|--------------------------|-------------|--------------|--------|------------------------------|
| Revenue growth (organic) | 1.2%/yr     | 3.8%/yr      | -2.6pp | 5yr avg contribution        |
| Margin expansion         | +0.3pp/yr   | +0.8pp/yr    | -0.5pp | Slower margin improvement   |
| Multiple re-rating       | -1.2x       | +0.4x        | -1.6x  | EV/EBITDA moved from 12x-10.8x vs peers 12x-12.4x |
| TSR contribution         | 12%         | 34%          | -22pp  |                              |`,
        },
        options: [
          {
            id: "a",
            text: "Multiple compression is doing the most damage here.",
            nextQuestionId: "g19q3a",
            scoreImpact: 20,
            feedback: "This is the right read. The roughly $4B of market cap lost to multiple compression matters most because it means growth and margin fixes alone won't recover TSR.",
          },
          {
            id: "b",
            text: "The organic growth gap of 2.6pp is the main story, 1.2% growth versus 3.8% for peers means PrimePackage is losing category share.",
            nextQuestionId: "g19q3b",
            scoreImpact: 5,
            feedback: "Growth underperformance is real, but the 1.6x relative multiple compression carries more total TSR weight than the growth gap by itself.",
          },
          {
            id: "c",
            text: "Margin expansion of 0.3pp per year versus 0.8pp for peers is the biggest issue.",
            nextQuestionId: "g19q3c",
            scoreImpact: -5,
            feedback: "Margin lag is a contributor, but it's actually the smallest of the three gaps in TSR terms.",
          },
        ],
      },
      {
        id: "g19q2b",
        stage: "TSR Decomposition",
        question: "The partner shares the TSR decomposition showing multiple compression is the largest driver, PrimePackage's EV/EBITDA fell from 12x to 10.8x while peers expanded to 12.4x. What does this tell you about the root cause?",
        options: [
          {
            id: "a",
            text: "On a roughly $2.5B EBITDA base, that de-rating is worth about $4B of destroyed market cap.",
            nextQuestionId: "g19q3a",
            scoreImpact: 15,
            feedback: "This connects the dots correctly. Tying multiple compression to the conglomerate discount, and naming portfolio simplification as the fix, gets both the diagnosis and the treatment right.",
          },
          {
            id: "b",
            text: "The compression reflects investor unease about category mix specifically, too much exposure to household products, which trades at a discount to personal care.",
            nextQuestionId: "g19q3b",
            scoreImpact: 0,
            feedback: "Category mix plays some role, but the bigger driver is sheer portfolio breadth, 140 brands spread across categories creates complexity that gets penalized regardless of which categories they're in.",
          },
          {
            id: "c",
            text: "This is a sentiment issue that corrects itself once the broader CPG sector re-rates.",
            nextQuestionId: "g19q3c",
            scoreImpact: -10,
            feedback: "Peers expanded their multiples over the same five years PrimePackage's compressed, this isn't a sector-wide sentiment story.",
          },
        ],
      },
      {
        id: "g19q3a",
        stage: "Portfolio Segmentation",
        question: "Multiple compression is driven by portfolio complexity. You need to segment the 140 brands to identify which to keep, grow, fix, or divest. What segmentation framework do you use?",
        options: [
          {
            id: "a",
            text: "Two dimensions: category growth rate, and each brand's competitive position within its category. That gives four quadrants to work from.",
            nextQuestionId: "g19q4a",
            scoreImpact: 20,
            feedback: "This is the right tool. The growth-position matrix simultaneously identifies both the divestiture candidates and the brands worth doubling down on.",
          },
          {
            id: "b",
            text: "Cut it by revenue size, keep everything above $100M in annual revenue, divest everything below.",
            nextQuestionId: "g19q4b",
            scoreImpact: -5,
            feedback: "Size alone says nothing about growth rate or competitive position. Some smaller brands could sit in fast-growing categories with strong share.",
          },
          {
            id: "c",
            text: "Rank by EBITDA margin, retain anything above 18%, divest anything below 12%.",
            nextQuestionId: "g19q4c",
            scoreImpact: -5,
            feedback: "Current margin reflects current investment level as much as inherent brand strength. A strong, high-growth brand can show temporarily compressed margin.",
          },
        ],
      },
      {
        id: "g19q3b",
        stage: "Portfolio Segmentation",
        question: "Your diagnosis has been suboptimal. The partner confirms multiple compression is driven by portfolio complexity, 140 brands creating a conglomerate discount. How do you identify which 35 brands to divest?",
        options: [
          {
            id: "a",
            text: "Segment all 140 brands on category growth and relative competitive position. The low-growth, weak-position quadrant is where the divestiture candidates live.",
            nextQuestionId: "g19q4a",
            scoreImpact: 15,
            feedback: "This is the right approach. The two-dimensional matrix picks divestiture candidates on strategic grounds rather than an arbitrary size or margin cutoff.",
          },
          {
            id: "b",
            text: "Rank all 140 brands by five-year CAGR and divest the bottom 35 by growth rate.",
            nextQuestionId: "g19q4b",
            scoreImpact: 0,
            feedback: "Growth ranking gets partway there but ignores competitive position, a low-growth brand that dominates a stable category can be highly profitable and worth keeping.",
          },
          {
            id: "c",
            text: "Ask the activist investor for their divestiture list, they've clearly done homework and their list is probably close enough.",
            nextQuestionId: "g19q4c",
            scoreImpact: -15,
            feedback: "Handing the divestiture call to the activist is an abdication of the analytical work BCG was hired to do.",
          },
        ],
      },
      {
        id: "g19q3c",
        stage: "Portfolio Segmentation",
        question: "Your TSR analysis was incomplete. The partner corrects: multiple compression is the largest driver and requires portfolio simplification. To identify which brands to divest, what information do you need?",
        options: [
          {
            id: "a",
            text: "Brand-level category growth rate, relative market share against direct competitors, current EBITDA margin, and management time allocation, together enough to segment the portfolio properly.",
            nextQuestionId: "g19q4a",
            scoreImpact: 10,
            feedback: "This is the right data set. These four inputs are exactly what the growth-position matrix needs.",
          },
          {
            id: "b",
            text: "Comparable transaction multiples for each category, so you know what PrimePackage could actually get for each brand, then prioritize divesting whichever brands would fetch the highest price.",
            nextQuestionId: "g19q4b",
            scoreImpact: -5,
            feedback: "Divestiture selection should follow strategic fit, not which ones happen to fetch the best price.",
          },
          {
            id: "c",
            text: "Employee engagement scores by brand, brands with weak engagement are probably underperforming operationally.",
            nextQuestionId: "g19q4c",
            scoreImpact: -10,
            feedback: "Engagement is a downstream symptom of brand health and management attention, not an independent strategic input.",
          },
        ],
      },
      {
        id: "g19q4a",
        stage: "Divestiture Program",
        question: "The portfolio segmentation identifies 35 brands in the low-growth, weak-position quadrant generating $2.4B in revenue at 6% EBITDA margin. The CFO asks: what do we do with the divestiture proceeds?",
        exhibit: {
          type: "table",
          title: "Portfolio Segmentation Summary",
          data: `| Quadrant                       | Brand Count | Revenue | EBITDA Margin | Recommendation          |
|--------------------------------|-------------|---------|----------------|--------------------------|
| High growth, strong position   | 20          | $5.4B   | 22%            | Invest disproportionate |
| High growth, weak position     | 18          | $2.8B   | 11%            | Fix or divest           |
| Low growth, strong position    | 67          | $7.4B   | 16%            | Harvest cash            |
| Low growth, weak position      | 35          | $2.4B   | 6%             | Divest                  |
| Total                           | 140         | $18.0B  | 14% avg        |                          |`,
        },
        options: [
          {
            id: "a",
            text: "At an assumed 0.5-0.6x revenue multiple for these sub-scale brands, proceeds land around $800M-1.2B. Put roughly two-thirds behind disproportionate marketing investment for the top 20 brands, and the remaining third toward a premium bolt-on acquisition.",
            nextQuestionId: "g19q5a",
            scoreImpact: 20,
            feedback: "This is the right capital allocation split. Concentrating most of the proceeds behind the 20 existing winners is the mechanism that actually drives TSR recovery.",
          },
          {
            id: "b",
            text: "Return all divestiture proceeds to shareholders via a special dividend or an accelerated buyback.",
            nextQuestionId: "g19q5b",
            scoreImpact: -5,
            feedback: "Returning everything forgoes the chance to reinvest in the portfolio's own growth trajectory.",
          },
          {
            id: "c",
            text: "Put all the proceeds into new product development spread across the remaining 105 brands.",
            nextQuestionId: "g19q5b",
            scoreImpact: -10,
            feedback: "Spreading investment across 105 brands recreates exactly the resource-dilution problem that caused the underperformance in the first place.",
          },
        ],
      },
      {
        id: "g19q4b",
        stage: "Divestiture Program",
        question: "Your portfolio segmentation was based on revenue size alone. The partner shares that the 35 divestiture candidates are in the low-growth, weak-position quadrant. How does the capital allocation strategy change if the divested brands generate $2.4B in revenue at only 6% EBITDA margin?",
        options: [
          {
            id: "a",
            text: "The gap between 6% margin on the divested brands and 22% on the top-20 means divestiture alone pushes portfolio EBITDA margin up toward 16-17% just from mix shift.",
            nextQuestionId: "g19q5a",
            scoreImpact: 15,
            feedback: "This is the important point. Removing the 6%-margin brands lifts the portfolio average margin purely through mix, and reinvesting behind the 22%-margin brands compounds that effect.",
          },
          {
            id: "b",
            text: "Return the proceeds to shareholders, since 6% EBITDA margin on the divested brands confirms they weren't worth reinvesting in anyway.",
            nextQuestionId: "g19q5b",
            scoreImpact: -5,
            feedback: "The issue isn't the quality of the divested brands, it's where the proceeds go afterward. The top-20 brands at 22% EBITDA margin are excellent reinvestment candidates.",
          },
          {
            id: "c",
            text: "Use the proceeds to acquire brands in categories PrimePackage doesn't currently play in, further diversifying the portfolio.",
            nextQuestionId: "g19q5b",
            scoreImpact: -10,
            feedback: "More diversification just adds to the complexity that's already driving the conglomerate discount.",
          },
        ],
      },
      {
        id: "g19q4c",
        stage: "Divestiture Program",
        question: "Your portfolio analysis has been incomplete or suboptimal. The partner gives you the correct divestiture list: 35 low-growth, weak-position brands generating $2.4B at 6% EBITDA margin. What is the financial impact of the divestiture program?",
        options: [
          {
            id: "a",
            text: "Stripping out $2.4B of revenue at 6% margin leaves $15.6B at a higher blended margin, portfolio EBITDA moves from 14% to roughly 15.8% on mix alone, and the multiple should start to re-rate as complexity falls.",
            nextQuestionId: "g19q5a",
            scoreImpact: 10,
            feedback: "This is a reasonable quantification of the immediate impact. Margin lift from mix, growth lift from mix, and the beginning of multiple re-rating are all directionally correct outcomes.",
          },
          {
            id: "b",
            text: "Cutting revenue by 13% will read as a shrinking company to investors and compress the multiple further.",
            nextQuestionId: "g19q5b",
            scoreImpact: -10,
            feedback: "CPG investors have consistently rewarded portfolio-optimization divestitures of low-margin, low-growth assets as evidence of management discipline, not punished them.",
          },
          {
            id: "c",
            text: "You can't size the financial impact without brand-by-brand contribution margin data.",
            nextQuestionId: "g19q5b",
            scoreImpact: -5,
            feedback: "The quadrant-level data is enough to size the portfolio-level impact. Insisting on brand-by-brand detail just delays the recommendation.",
          },
        ],
      },
      {
        id: "g19q5a",
        stage: "Organizational Design",
        question: "The CFO asks: what organizational change does the portfolio restructuring require and why does organizational structure matter for TSR recovery?",
        options: [
          {
            id: "a",
            text: "Right now three category CEOs run P&Ls that bury individual brand performance and let strong brands invisibly subsidize weak ones.",
            nextQuestionId: "g19q6a",
            scoreImpact: 20,
            feedback: "This is the right structural read. The category P&L structure is precisely what lets the conglomerate discount persist.",
          },
          {
            id: "b",
            text: "The main organizational change is headcount, 140 brands need 140 brand teams, and cutting to 105 is a natural chance to shrink overhead proportionally.",
            nextQuestionId: "g19q6b",
            scoreImpact: -5,
            feedback: "Overhead reduction is a nice secondary benefit, but it's not the main organizational lever here.",
          },
          {
            id: "c",
            text: "Leave the organization alone during the divestiture program, leadership bandwidth should go toward executing the divestitures rather than redesigning the org chart.",
            nextQuestionId: "g19q6b",
            scoreImpact: -10,
            feedback: "Divesting without restructuring the org partly undercuts the point. If the category structure stays in place, the resource-diffusion problem just continues.",
          },
        ],
      },
      {
        id: "g19q5b",
        stage: "Organizational Design",
        question: "Your capital allocation recommendation has been suboptimal. The partner gives you the correct allocation: two-thirds to top-20 brand investment, one-third to bolt-on acquisition. Now design the organizational structure to execute this strategy.",
        options: [
          {
            id: "a",
            text: "Move from the three-category P&L structure to brand-level P&Ls.",
            nextQuestionId: "g19q6a",
            scoreImpact: 15,
            feedback: "This is the right design. Brand-based P&L creates the visibility and accountability the category structure currently hides.",
          },
          {
            id: "b",
            text: "Keep the category structure but bolt on brand-level reporting dashboards so leadership can see individual brand performance.",
            nextQuestionId: "g19q6b",
            scoreImpact: -5,
            feedback: "Dashboards give visibility but not accountability. It's the P&L structure that determines accountability, not the reporting layer on top of it.",
          },
          {
            id: "c",
            text: "Stand up a fourth structure, a separate global growth unit that manages the top-20 high-growth brands outside the three existing category divisions.",
            nextQuestionId: "g19q6b",
            scoreImpact: 0,
            feedback: "A parallel fourth unit adds organizational complexity without fixing the underlying problem for the rest of the portfolio.",
          },
        ],
      },
      {
        id: "g19q6a",
        stage: "Financial Impact",
        question: "The CEO asks: model the financial impact of the full restructuring program, what organic growth, EBITDA margin, and TSR should we target?",
        exhibit: {
          type: "table",
          title: "Restructuring Financial Impact Model",
          data: `| Metric               | Current  | Post-Divest | Post-Invest | Target Year 3 |
|-----------------------|----------|-------------|--------------|-----------------|
| Revenue               | $18.0B   | $15.6B      | $16.2B       | $17.1B         |
| Organic growth        | 1.2%     | 2.1%        | 2.8%         | 3.1%           |
| EBITDA margin         | 14.0%    | 15.8%       | 16.5%        | 17.5%          |
| EV/EBITDA multiple    | 10.8x    | 11.5x       | 12.0x        | 12.8x          |
| Implied market cap    | $27.2B   | $28.5B      | $32.3B       | $38.3B         |`,
        },
        options: [
          {
            id: "a",
            text: "Over three years, organic growth moves from 1.2% to 3.1%, EBITDA margin from 14% to 17.5%, and the multiple from 10.8x to 12.8x as the conglomerate discount unwinds. Together that's implied market cap moving from $27.2B to $38.3B, a 41% increase.",
            nextQuestionId: "g19q7a",
            scoreImpact: 20,
            feedback: "This is the complete, quantified story. The $11.1B market cap improvement is the number that will land with the activist investor and the board.",
          },
          {
            id: "b",
            text: "Revenue falling from $18B to $16.2B post-divestiture and bolt-on is the headline risk, investors could read a shrinking top line negatively.",
            nextQuestionId: "g19q7b",
            scoreImpact: -5,
            feedback: "The model already shows revenue recovering to $17.1B by year three. The $11.1B market cap gain is the story to lead with.",
          },
          {
            id: "c",
            text: "The model is too optimistic, a re-rating from 10.8x to 12.8x assumes investors respond in a way that market dynamics simply can't guarantee.",
            nextQuestionId: "g19q7b",
            scoreImpact: -5,
            feedback: "12.8x sits below where peers already are, 12.4x. This isn't an aggressive assumption, it's actually conservative relative to comparable CPG portfolio restructurings.",
          },
        ],
      },
      {
        id: "g19q6b",
        stage: "Financial Impact",
        question: "Your organizational design or capital allocation has been suboptimal. The partner gives you the financial impact model showing implied market cap growing from $27.2B to $38.3B over three years. What is the recommendation narrative?",
        options: [
          {
            id: "a",
            text: "The $11.1B increase in implied market cap, a 41% jump, from divesting the 35 brands, concentrating investment behind the top-20.",
            nextQuestionId: "g19q7a",
            scoreImpact: 15,
            feedback: "This framing is right. Positioning the plan as capital reallocation rather than cost-cutting lands better with the board and with investors.",
          },
          {
            id: "b",
            text: "Present the whole plan as a direct response to activist pressure, that gives the board political cover to approve it.",
            nextQuestionId: "g19q7b",
            scoreImpact: -10,
            feedback: "Framing a strategic recommendation as capitulation to activist pressure undercuts management's credibility and makes the company look reactive.",
          },
          {
            id: "c",
            text: "Lead with the revenue-reduction risk and acknowledge upfront that the divestiture shrinks the company before it grows again.",
            nextQuestionId: "g19q7b",
            scoreImpact: -5,
            feedback: "Leading with the risk ahead of the opportunity is a weak way to structure a board recommendation.",
          },
        ],
      },
      {
        id: "g19q7a",
        stage: "Final Recommendation",
        question: "The board asks for the complete restructuring recommendation: specific actions, financial targets, and implementation timeline.",
        options: [
          {
            id: "a",
            text: "Divest the 35 low-growth, weak-position brands within year one for roughly $1B in proceeds.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "This is a complete, specific recommendation, three actions, specific targets, and a three-year timeline.",
          },
          {
            id: "b",
            text: "Recommend the board spend the next six months running a full strategic review, including a possible outright sale or spin-off, before committing to any divestiture program.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "After 12 weeks of completed BCG analysis with a clear recommendation in hand, another six-month review just delays action.",
          },
          {
            id: "c",
            text: "Recommend accepting the activist's proposal to spin off the household products division outright.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "A division spin-off gets at the same underlying problem and could move faster, but it's a blunter instrument than the brand-based program.",
          },
        ],
      },
      {
        id: "g19q7b",
        stage: "Final Recommendation",
        question: "Your analysis has had gaps. The partner gives you one final chance before the board presentation. What is the complete recommendation?",
        options: [
          {
            id: "a",
            text: "Divest the 35 low-growth, weak-position brands within year one for roughly $1B in proceeds.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "This recovers well. All the pieces are present, divestiture program, capital allocation, organizational change, and financial targets.",
          },
          {
            id: "b",
            text: "Recommend a two-year pause to focus purely on operational execution before touching the portfolio.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Five years of underperformance already suggests operational improvement within the current structure has been tried and hasn't worked.",
          },
          {
            id: "c",
            text: "Divest all 35 candidates and return every dollar of proceeds to shareholders through buybacks.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Returning all the proceeds satisfies the near-term capital-return demand but does nothing for the organic growth underperformance driving the structural multiple discount.",
          },
        ],
      },
    ],
  },
  {
    id: "g20",
    title: "ApexLogistics: Pre-Exit Value Maximization",
    type: "merger_acquisition",
    difficulty: "advanced",
    firm: "mckinsey",
    estimatedMinutes: 40,
    overview: "A PE-backed logistics company is preparing for an exit in 18-24 months. McKinsey has been engaged to identify the value maximization actions that will command the highest exit multiple.",
    clientBackground: "ApexLogistics is a PE-backed last-mile logistics company with $1.2B in annual revenue growing at 18% and a 9% EBITDA margin. The PE sponsor acquired the company four years ago at $800M (0.67x revenue). The current market for logistics companies has strategic buyers paying 1.8-2.2x revenue for high-growth platforms with strong technology differentiation. Apex has proprietary route optimization software but customer NPS of 52 versus 68 for top logistics competitors. The sponsor wants to maximize exit value in 18-24 months.",
    yourRole: "You are a McKinsey project leader on the operations and private equity practice. You have 10 weeks to deliver an exit readiness assessment and value maximization plan.",
    startQuestionId: "g20q1",
    finalRecommendationPrompt: "What are the three highest-priority actions to maximize exit value, and what is the realistic exit multiple range at 24 months if these actions are taken?",
    sampleRecommendation: "Three priority actions: first, NPS improvement program targeting 65+ from 52 current, adds 0.2-0.3x revenue to the exit multiple. Second, technology narrative development converting the route optimization software into a documented and monetizable SaaS asset, adds 0.4x. Third, EBITDA margin expansion from 9% to 12% through automation investment, adds 0.2-0.3x. Together these should deliver an exit multiple of 2.0-2.3x revenue versus 1.6-1.8x without action.",
    idealRecommendation: "Three actions: NPS improvement to 65+ (adds 0.2-0.3x exit multiple), technology narrative development as SaaS asset (adds 0.4x), and EBITDA expansion from 9% to 12% (adds 0.2-0.3x). Total multiple expansion from 1.6-1.8x without action to 2.0-2.3x with action, worth $240-600M in incremental exit proceeds.",
    keyTakeaways: [
      "PE exit value maximization is about multiple expansion not just EBITDA improvement, the multiple determines most of the exit value in a high-growth company",
      "Technology narrative development can command a premium multiple even for companies that are operationally technology-enabled rather than pure SaaS businesses",
      "NPS is the single metric buyers scrutinize most in due diligence because it predicts future growth and churn better than any other single customer metric",
      "The most valuable exit preparation actions take 18-24 months to implement, starting the exit preparation process well before the exit window is what separates premium outcomes from average ones",
    ],
    questions: [
      {
        id: "g20q1",
        stage: "Exit Readiness Assessment",
        question: "The PE sponsor wants to maximize exit value in 18-24 months. Before recommending specific actions, how do you frame the value maximization opportunity?",
        context: "Exit value is determined by EBITDA times exit multiple plus any valuation-specific adjustments.",
        options: [
          {
            id: "a",
            text: "Rank the levers by dollar leverage: multiple expansion first.",
            nextQuestionId: "g20q2a",
            scoreImpact: 20,
            feedback: "This ordering is right. Multiple expansion has more absolute dollar leverage on a $1.2B revenue base than EBITDA improvement at a fixed multiple.",
          },
          {
            id: "b",
            text: "Put the exit prep effort into maximizing EBITDA margin, since buyers pay their multiple on EBITDA, and pushing margin from 9% to 14% over 18 months directly grows the base the multiple gets applied to.",
            nextQuestionId: "g20q2b",
            scoreImpact: -5,
            feedback: "EBITDA improvement matters, but prioritizing it ahead of multiple expansion misses the bigger prize. The gap between an 1.8x and a 2.2x revenue multiple is worth $480M.",
          },
          {
            id: "c",
            text: "Tell the sponsor to launch the exit process now rather than waiting 18-24 months, since current market conditions for logistics assets are favorable.",
            nextQuestionId: "g20q2b",
            scoreImpact: -10,
            feedback: "The sponsor specifically asked how to maximize value over an 18-24 month window, recommending an immediate exit before that value-creation work happens contradicts the engagement itself.",
          },
        ],
      },
      {
        id: "g20q2a",
        stage: "Due Diligence Risk Assessment",
        question: "You have identified multiple expansion as the primary lever. Before designing improvement programs, what are the specific factors in Apex's profile that will suppress the exit multiple if not addressed?",
        exhibit: {
          type: "table",
          title: "ApexLogistics vs Strategic Buyer Acquisition Criteria",
          data: `| Criteria                    | ApexLogistics | Buyer Threshold | Gap       |
|----------------------------|---------------|------------------|-----------|
| Revenue growth rate         | 18%           | 15%+             | Exceeds   |
| EBITDA margin               | 9%            | 12%+             | -3pp      |
| Customer NPS                | 52            | 65+              | -13 pts   |
| Customer concentration      | Top 3 = 42%   | Under 30%        | High risk |
| Technology differentiation  | Proprietary   | Documented SaaS  | Narrative |
| Geographic coverage         | 22 markets    | 30+ markets      | Below     |
| Same-day capability         | 68% of mkts   | 85%+             | -17pp     |`,
        },
        options: [
          {
            id: "a",
            text: "NPS at 52 against a 65 threshold gets flagged as churn risk; customer concentration at 42% is a covenant-level concern for acquisition financing; and EBITDA at 9% rules out plenty of financial buyers.",
            nextQuestionId: "g20q3a",
            scoreImpact: 20,
            feedback: "These are the right three to prioritize. NPS and customer concentration are the two most likely due-diligence findings to trigger a price chip.",
          },
          {
            id: "b",
            text: "Geographic coverage at 22 versus 30 markets and same-day capability at 68% versus the 85% threshold are the real gaps, since logistics strategic buyers value network density above everything else.",
            nextQuestionId: "g20q3b",
            scoreImpact: -5,
            feedback: "Network gaps are genuine, but closing them organically takes 18-plus months and heavy capital. NPS and customer concentration are both more immediately addressable.",
          },
          {
            id: "c",
            text: "Technology differentiation is the only gap that actually moves the multiple, strategic buyers pay 2.2x for tech platforms versus 1.8x for pure-play operators.",
            nextQuestionId: "g20q3a",
            scoreImpact: 5,
            feedback: "The technology narrative is a real opportunity, but it isn't the only thing that matters. NPS at 52 and customer concentration at 42% actively depress offers in due diligence too.",
          },
        ],
      },
      {
        id: "g20q2b",
        stage: "Due Diligence Risk Assessment",
        question: "The partner asks: buyers scrutinize three to five specific factors in logistics due diligence that determine the exit multiple. What are they for ApexLogistics?",
        options: [
          {
            id: "a",
            text: "In priority order: NPS as a proxy for churn and growth quality; EBITDA margin trajectory as evidence of operating leverage; customer concentration as a financing risk; technology moat.",
            nextQuestionId: "g20q3a",
            scoreImpact: 15,
            feedback: "This is the right list in the right order. NPS leading makes sense, it's the metric buyers use to model forward churn.",
          },
          {
            id: "b",
            text: "The main due diligence factor is EBITDA coverage of acquisition debt, buyers need to see that the EBITDA can service leverage at typical multiples.",
            nextQuestionId: "g20q3b",
            scoreImpact: 0,
            feedback: "Debt service coverage matters to financial buyers, but strategic acquirers like Amazon Logistics, FedEx, or UPS don't primarily underwrite these deals on debt capacity.",
          },
          {
            id: "c",
            text: "Driver retention and fleet asset age are the two factors specific to last-mile logistics that most commonly trigger buyer discounts.",
            nextQuestionId: "g20q3b",
            scoreImpact: -5,
            feedback: "Driver retention and fleet age are real operational factors, but they carry less weight on the exit multiple than NPS, EBITDA margin, and customer concentration.",
          },
        ],
      },
      {
        id: "g20q3a",
        stage: "NPS Improvement Program",
        question: "NPS at 52 versus 65 buyer threshold is a primary due diligence risk. Design the NPS improvement program. What are the specific drivers of the 13-point gap?",
        exhibit: {
          type: "table",
          title: "ApexLogistics NPS Driver Analysis",
          data: `| Driver                           | NPS Impact | Root Cause                      | Fix Complexity |
|----------------------------------|------------|----------------------------------|------------------|
| On-time delivery performance     | -6 pts     | Route optimization underused    | Medium           |
| Communication on delays          | -4 pts     | No proactive notification       | Low              |
| Claims resolution speed          | -3 pts     | Manual process, 8 day avg       | Low              |
| Driver professionalism           | -2 pts     | Training inconsistency          | Medium           |
| Technology integration quality   | +2 pts     | Proprietary app is best-in-cls  | Positive         |`,
        },
        options: [
          {
            id: "a",
            text: "Go after the highest-impact, lowest-complexity items first: proactive delay notifications, digitizing claims resolution.",
            nextQuestionId: "g20q4a",
            scoreImpact: 20,
            feedback: "This sequencing is right. Using the root-cause data to prioritize by impact-per-complexity is exactly the move, and the route optimization software already exists.",
          },
          {
            id: "b",
            text: "Hire a Chief Customer Officer right away, since sustainable NPS improvement needs cultural change that technology fixes alone can't deliver.",
            nextQuestionId: "g20q4b",
            scoreImpact: -5,
            feedback: "A CCO hire may help culture over the long run, but it doesn't touch any of the specific operational drivers the analysis identified.",
          },
          {
            id: "c",
            text: "Redesign the NPS survey methodology so the question is asked differently, if the measurement approach improves, the score could rise without needing any operational changes.",
            nextQuestionId: "g20q4b",
            scoreImpact: -15,
            feedback: "Changing the measurement methodology to move the number without touching the underlying customer experience isn't a legitimate exit prep action.",
          },
        ],
      },
      {
        id: "g20q3b",
        stage: "NPS Improvement Program",
        question: "The partner gives you the NPS driver analysis. The top three gaps are on-time delivery, delay communication, and claims resolution. What is the 18-month NPS improvement roadmap?",
        options: [
          {
            id: "a",
            text: "Months 1-3, deploy proactive delay notifications. Months 1-6, digitize claims resolution. Months 3-18, complete full route optimization deployment.",
            nextQuestionId: "g20q4a",
            scoreImpact: 15,
            feedback: "This recovers well. It's a sequenced roadmap with a clear timeline, a specific NPS impact for each initiative.",
          },
          {
            id: "b",
            text: "Focus exclusively on driver professionalism, since it's the most differentiated lever, commodity logistics operators can copy technology but exceptional professionalism builds a moat.",
            nextQuestionId: "g20q4b",
            scoreImpact: -10,
            feedback: "Driver professionalism only accounts for a 2-point NPS impact, the smallest of the five drivers.",
          },
          {
            id: "c",
            text: "Treat the 52 NPS as an industry-wide condition rather than an Apex-specific problem, and pre-position for due diligence by pointing to sector-wide NPS decline.",
            nextQuestionId: "g20q4b",
            scoreImpact: -10,
            feedback: "Buyers will push back on this immediately since they can see competitors sitting at 68 NPS.",
          },
        ],
      },
      {
        id: "g20q4a",
        stage: "Technology Narrative",
        question: "ApexLogistics has proprietary route optimization software. The exit multiple difference between a technology platform and a pure-play logistics operator is 0.4x revenue. How do you develop the technology narrative?",
        options: [
          {
            id: "a",
            text: "Document the software as a standalone asset with its own economics; build a third-party-validated dataset showing route efficiency gains.",
            nextQuestionId: "g20q5a",
            scoreImpact: 20,
            feedback: "This is a complete plan. The third-party licensing piece matters most, even $5-10M in external license revenue shifts the software from internal tool to commercial platform.",
          },
          {
            id: "b",
            text: "Bring in a technology-focused investment bank to position ApexLogistics as a technology company rather than a logistics company.",
            nextQuestionId: "g20q5b",
            scoreImpact: -5,
            feedback: "Banker positioning without commercial evidence behind the technology doesn't hold up in due diligence.",
          },
          {
            id: "c",
            text: "Rename the company to ApexTech to signal a technology-forward identity to potential acquirers.",
            nextQuestionId: "g20q5b",
            scoreImpact: -10,
            feedback: "A rename with no substance behind it is something sophisticated buyers see through immediately.",
          },
        ],
      },
      {
        id: "g20q4b",
        stage: "Technology Narrative",
        question: "The partner confirms the technology narrative is worth 0.4x in the exit multiple. How specifically does Apex convert proprietary software into a documented SaaS-adjacent asset?",
        options: [
          {
            id: "a",
            text: "Document the software's economic contribution through A/B route-cost testing against non-optimized routes.",
            nextQuestionId: "g20q5a",
            scoreImpact: 15,
            feedback: "This recovers well. A/B testing gives buyers proof of ROI, and even a small-scale external licensing pilot establishes commercial precedent.",
          },
          {
            id: "b",
            text: "File patents on the route optimization algorithm right away and lead with the patent portfolio as the primary IP asset.",
            nextQuestionId: "g20q5b",
            scoreImpact: 0,
            feedback: "Patent filing is a legitimate protective step but patents by themselves don't command a premium multiple.",
          },
          {
            id: "c",
            text: "Build a consumer-facing mobile app on top of the route optimization technology to show off direct-to-consumer capability.",
            nextQuestionId: "g20q5b",
            scoreImpact: -5,
            feedback: "A B2C app is a significant build, 12-18 months, and wouldn't generate meaningful revenue or users inside the exit window.",
          },
        ],
      },
      {
        id: "g20q5a",
        stage: "EBITDA Expansion",
        question: "EBITDA at 9% versus 12% buyer threshold is the third gap. How do you close 3pp of EBITDA margin in 18 months without compromising the growth and NPS improvement programs?",
        exhibit: {
          type: "table",
          title: "EBITDA Improvement Opportunity Analysis",
          data: `| Initiative                     | Annual Saving | Timeline  | NPS Impact  |
|--------------------------------|----------------|-----------|--------------|
| Last-mile route automation     | $28M (2.3pp)   | 12 months | Positive     |
| Sort center labor automation   | $18M (1.5pp)   | 15 months | Neutral      |
| Fuel management optimization   | $12M (1.0pp)   | 6 months  | Neutral      |
| Customer portal self-service   | $8M  (0.7pp)   | 9 months  | Positive     |
| Driver incentive restructuring | $6M  (0.5pp)   | 3 months  | Uncertain    |
| Total available                | $72M (6.0pp)   |           |              |`,
        },
        options: [
          {
            id: "a",
            text: "Take the three initiatives with neutral or positive NPS impact: fuel management, customer portal, route automation.",
            nextQuestionId: "g20q6a",
            scoreImpact: 20,
            feedback: "This is the right call. Explicitly filtering out driver incentive restructuring because of NPS risk shows you're optimizing across programs at once.",
          },
          {
            id: "b",
            text: "Run all five initiatives at once to maximize total EBITDA gain and reach 15% margin.",
            nextQuestionId: "g20q6b",
            scoreImpact: -5,
            feedback: "Driver incentive restructuring has uncertain NPS impact and shouldn't be run alongside an NPS improvement program targeting a 13-point gap closure.",
          },
          {
            id: "c",
            text: "Focus solely on fuel management optimization, at 1.0pp for just 6 months of work it has the best ROIC of anything on the list.",
            nextQuestionId: "g20q6b",
            scoreImpact: -5,
            feedback: "Fuel optimization alone only closes 1.0pp of the 3pp gap. Exiting at 10% EBITDA margin still misses the 12% buyer threshold.",
          },
        ],
      },
      {
        id: "g20q5b",
        stage: "EBITDA Expansion",
        question: "The technology narrative work has been suboptimal. The partner confirms three specific EBITDA initiatives avoid NPS risk: fuel management, customer portal, and route automation. What is the combined margin improvement?",
        options: [
          {
            id: "a",
            text: "Fuel management, customer portal, and route automation together deliver 4.0pp over 12 months, taking EBITDA margin from 9% to 13%, a point above the 12% buyer threshold.",
            nextQuestionId: "g20q6a",
            scoreImpact: 15,
            feedback: "This recovers well. It correctly identifies the three NPS-safe initiatives with specific timing and margin contribution.",
          },
          {
            id: "b",
            text: "Add driver incentive restructuring for another 0.5pp to reach 13.5% margin, the NPS risk is uncertain but the extra margin improvement is worth accepting.",
            nextQuestionId: "g20q6b",
            scoreImpact: -5,
            feedback: "Taking on uncertain NPS risk during a program specifically targeting a 13-point NPS gap closure isn't worth 0.5pp of margin.",
          },
          {
            id: "c",
            text: "Frame the 4.0pp margin gain as a pipeline of efficiency work that continues after the acquisition closes, giving the buyer additional upside.",
            nextQuestionId: "g20q6b",
            scoreImpact: -10,
            feedback: "Leaving the efficiency gains as post-close buyer upside instead of capturing them pre-exit reduces the seller's own multiple.",
          },
        ],
      },
      {
        id: "g20q6a",
        stage: "Exit Multiple Model",
        question: "The three programs are designed. Now model the exit multiple range with and without the improvement programs.",
        exhibit: {
          type: "table",
          title: "Exit Multiple Scenario Analysis",
          data: `| Scenario                         | Revenue | EBITDA % | NPS  | Tech Score | Exit Multiple | Exit Value |
|-----------------------------------|---------|----------|------|------------|-----------------|--------------|
| Do nothing, exit now              | $1.26B  | 9%       | 52   | Internal   | 1.6-1.8x rev    | $2.0-2.3B    |
| Growth only, exit at 24mo         | $1.48B  | 9%       | 52   | Internal   | 1.7-1.9x rev    | $2.5-2.8B    |
| Full program, exit at 24mo        | $1.48B  | 13%      | 65   | SaaS-adj   | 2.0-2.3x rev    | $2.96-3.4B   |
| Full program, strategic buyer     | $1.48B  | 13%      | 65   | SaaS-adj   | 2.2-2.5x rev    | $3.26-3.7B   |`,
        },
        options: [
          {
            id: "a",
            text: "The programs' value is the gap between growth-only and full program, an incremental $460-600M in exit proceeds attributable specifically to the NPS, technology.",
            nextQuestionId: "g20q7a",
            scoreImpact: 20,
            feedback: "This framing is exactly right. The $460-600M in incremental exit value is what tells the sponsor whether funding these initiatives is worth it.",
          },
          {
            id: "b",
            text: "Target the strategic buyer scenario at 2.2-2.5x directly, the whole exit preparation program should be designed specifically to attract Amazon, FedEx, or UPS.",
            nextQuestionId: "g20q7b",
            scoreImpact: 5,
            feedback: "Targeting strategic buyers is a reasonable exit strategy, but the multiple analysis should establish the base case first and present the strategic premium as upside.",
          },
          {
            id: "c",
            text: "The do-nothing, exit-now scenario at 1.6-1.8x deserves serious consideration, since 18-24 months of market risk could push the achievable multiple below even the growth-only scenario.",
            nextQuestionId: "g20q7b",
            scoreImpact: -10,
            feedback: "Market risk cuts both ways, conditions could just as easily improve over 24 months. The $460-600M of incremental value isn't dependent on market conditions.",
          },
        ],
      },
      {
        id: "g20q6b",
        stage: "Exit Multiple Model",
        question: "Your EBITDA or technology work has been suboptimal. The partner shows you the exit multiple table. The difference between growth-only and full program exit is $460-600M. How do you present this to the PE sponsor?",
        options: [
          {
            id: "a",
            text: "The $460-600M in incremental exit value from the three programs works out to roughly a 3-4x return on the approximately $150M it costs to implement them.",
            nextQuestionId: "g20q7a",
            scoreImpact: 15,
            feedback: "This recovers well. ROI framed against implementation cost is exactly what the sponsor needs to greenlight the programs.",
          },
          {
            id: "b",
            text: "The incremental exit value is inherently uncertain since multiples depend more on market conditions at exit than on company-specific metrics.",
            nextQuestionId: "g20q7b",
            scoreImpact: -10,
            feedback: "Market timing risk is real, but the company-specific improvements reduce due diligence discounts that apply regardless of market conditions.",
          },
          {
            id: "c",
            text: "Lead with the strategic buyer scenario at 2.2-2.5x as the primary exit target and build the entire program around making ApexLogistics specifically attractive to Amazon.",
            nextQuestionId: "g20q7b",
            scoreImpact: -5,
            feedback: "Designing the whole program around one specific buyer creates concentration risk in the exit process itself.",
          },
        ],
      },
      {
        id: "g20q7a",
        stage: "Final Recommendation",
        question: "The PE sponsor asks for the complete value maximization plan: three actions, expected multiple improvement, and implementation budget.",
        options: [
          {
            id: "a",
            text: "NPS to 65 via notification automation, claims digitization, and route optimization deployment, $35M, worth 0.2-0.3x.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "This is a complete and compelling plan, three specific actions with specific costs, specific multiple impacts, and a total ROI that makes the investment case clear.",
          },
          {
            id: "b",
            text: "Recommend the sponsor hire a dedicated CEO of exit preparation reporting directly to the sponsor, running the value maximization program independently of the existing operating management team.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "A separate exit-prep CEO creates organizational confusion and signals to the existing management team that they aren't trusted to execute the programs.",
          },
          {
            id: "c",
            text: "Lay out three scenarios, an aggressive full program at $150M, a moderate one at $60M, and a minimal one at $20M, and let the sponsor choose.",
            nextQuestionId: "end",
            scoreImpact: 5,
            feedback: "Scenario optionality can be a useful deliverable, but the sponsor asked for a specific recommendation. The analysis clearly supports the full $150M program.",
          },
        ],
      },
      {
        id: "g20q7b",
        stage: "Final Recommendation",
        question: "Your analysis has had gaps. The partner gives you one final chance. The PE sponsor needs a specific three-action plan with implementation budget and expected exit multiple range.",
        options: [
          {
            id: "a",
            text: "NPS to 65 at $35M for 0.2-0.3x multiple improvement, technology SaaS narrative at $15M for 0.4x, EBITDA to 13% at $100M for 0.2-0.3x.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "This is a strong recovery. All the key elements are present, three specific actions, specific costs, specific multiple impacts, and the overall ROI case.",
          },
          {
            id: "b",
            text: "Push the exit out an extra six months to 30 months, to let the full programs finish and their results compound before starting the sales process.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "The sponsor set an 18-24 month window and the programs are designed to fit within it. Recommending a delay beyond the sponsor's stated timeline needs stronger justification.",
          },
          {
            id: "c",
            text: "Recommend the sponsor run a dual-track process, IPO and strategic sale simultaneously, to maximize competitive tension.",
            nextQuestionId: "end",
            scoreImpact: 0,
            feedback: "Dual-track is a legitimate execution strategy, but it's an investment-banking-stage recommendation, not an exit-preparation one.",
          },
        ],
      },
    ],
  },
  {
    id: "g21",
    title: "PowerGrid: Utility Energy Transition Strategy",
    type: "market_entry",
    difficulty: "advanced",
    firm: "capital-one",
    estimatedMinutes: 42,
    overview: "A large US investor-owned utility is facing an existential strategic choice about how fast to transition its generation portfolio from fossil fuels to renewables. Strategy& has been engaged to develop a 10-year transition roadmap.",
    clientBackground: "PowerGrid is a $14B revenue regulated utility serving 4.2 million customers across three mid-Atlantic states. Its generation fleet is 68% coal and gas, 20% nuclear, and 12% renewable. The three state regulators have set a 2035 carbon-free requirement. Federal IRA incentives provide 30-40% tax credits on renewable investment. PowerGrid has $8.2B in rate base and generates $1.8B in annual EBITDA. The CEO faces three strategic options: fast transition targeting 2032 carbon-free, moderate transition targeting 2035, or slow transition fighting the 2035 timeline through regulatory and legal challenge.",
    yourRole: "You are a Strategy& director on the energy and utilities practice. You have 12 weeks to deliver a strategic recommendation and implementation roadmap to the board.",
    startQuestionId: "g21q1",
    finalRecommendationPrompt: "Which transition path should PowerGrid pursue, fast, moderate, or slow, and what is the 10-year financial and strategic rationale?",
    sampleRecommendation: "Pursue the fast transition path targeting 2032 carbon-free completion. Financial rationale: IRA tax credits of 30-40% on renewable investment reduce the net capital cost of the $18B renewable buildout, making the economics superior to either the moderate or slow paths. Strategic rationale: first-mover advantage in the three-state region creates a 15-20 year regulatory relationship advantage with state commissions. Risk rationale: the slow transition path faces regulatory non-compliance risk, stranded asset risk, and customer attrition to community solar.",
    idealRecommendation: "Fast transition to 2032. IRA economics improve the fast path net cost below the moderate path after tax credits. First-mover regulatory relationship advantage compounds for 15-20 years in rate cases. Slow transition is actually the highest-risk path due to stranded asset risk and regulatory conflict. The $18B investment over 10 years generates $4.2B in rate base growth and associated regulated returns at 9-10% ROE.",
    keyTakeaways: [
      "In regulated utilities, the speed of strategic transition is partly determined by regulators who set allowed returns, the utility that aligns early with regulatory intent gets better rate case outcomes for 15-20 years",
      "IRA tax credits fundamentally changed the economics of renewable investment, what was previously the most expensive transition path is now often the cheapest after federal incentives",
      "Stranded asset risk is the hidden financial risk in slow transition, coal plants that are forced to retire early create write-offs that the utility, not ratepayers, absorbs",
      "Customer attrition to community solar and distributed generation is an existential risk to the traditional utility business model that accelerates with every year of perceived slow transition",
    ],
    questions: [
      {
        id: "g21q1",
        stage: "Strategic Framework",
        question: "The CEO has presented three options: fast transition to 2032, moderate to 2035, or slow transition fighting the 2035 mandate. Before analyzing the financial case for each, how do you frame the strategic decision?",
        context: "This is not a standard strategy case, the regulatory environment, IRA incentives, and customer dynamics create non-obvious interactions between the three paths.",
        options: [
          {
            id: "a",
            text: "Score each path on four things: net cost after IRA credits, the impact on future rate case outcomes through the regulatory relationship.",
            nextQuestionId: "g21q2a",
            scoreImpact: 20,
            feedback: "This is the right structure. The non-obvious insight the board needs, that the seemingly conservative slow path is actually the riskiest one financially, only shows up when you run all four dimensions together.",
          },
          {
            id: "b",
            text: "Treat this as a straightforward capital allocation problem, run the NPV of each path based on required capital investment against the regulated returns PowerGrid can earn.",
            nextQuestionId: "g21q2b",
            scoreImpact: -5,
            feedback: "NPV is necessary but not sufficient here. In a regulated utility, capital investment isn't purely a cost, it's a rate base addition that generates a regulated return.",
          },
          {
            id: "c",
            text: "Recommend the moderate 2035 path as the default, it meets the mandate without the fast path's execution risk and skips the legal fight that comes with the slow path.",
            nextQuestionId: "g21q2b",
            scoreImpact: -10,
            feedback: "Defaulting to the middle option before any analysis has been run isn't strategic advising, it's risk aversion dressed up as a conclusion.",
          },
        ],
      },
      {
        id: "g21q2a",
        stage: "IRA Economics",
        question: "IRA tax credits of 30-40% on renewable investment are a critical input. How do they change the relative economics of the three transition paths?",
        exhibit: {
          type: "table",
          title: "Transition Path Economics with IRA Incentives",
          data: `| Path     | Gross Invest | IRA Credit | Net Invest | Rate Base Add | Reg Return | Annual Rev |
|----------|--------------|------------|-------------|-----------------|-------------|-------------|
| Fast     | $18.0B       | $6.3B      | $11.7B      | $18.0B          | 9.5%        | $1.71B      |
| Moderate | $16.2B       | $4.9B      | $11.3B      | $16.2B          | 9.5%        | $1.54B      |
| Slow     | $12.4B       | $2.8B      | $9.6B       | $12.4B          | 9.5%        | $1.18B      |`,
        },
        options: [
          {
            id: "a",
            text: "The credits flip the expected ranking. Fast's net investment is just $400M more than moderate's.",
            nextQuestionId: "g21q3a",
            scoreImpact: 20,
            feedback: "This is the single most important number in the case. IRA credits shrink the net investment gap between fast and moderate from $1.8B gross down to $400M net.",
          },
          {
            id: "b",
            text: "Slow, at $9.6B net investment, is the cheapest path and should be preferred, minimizing capital spend is the right objective for a utility trying to manage customer rate increases.",
            nextQuestionId: "g21q3b",
            scoreImpact: -10,
            feedback: "In a regulated utility, capital investment isn't a cost to minimize, it's a rate base addition that earns a regulated return. Slow's $9.6B net investment only generates $1.18B in annual regulated revenue.",
          },
          {
            id: "c",
            text: "IRA credits are roughly similar as a percentage across all three paths, so they don't change the relative ranking, moderate remains cheapest in absolute net investment terms.",
            nextQuestionId: "g21q3b",
            scoreImpact: -5,
            feedback: "The credits are not similar as a percentage, they range from 22.6% on slow up to 35% on fast, because later-stage investment qualifies for higher ITC adders.",
          },
        ],
      },
      {
        id: "g21q2b",
        stage: "IRA Economics",
        question: "The partner corrects the framework to include IRA economics. The fast path at $11.7B net investment versus the moderate path at $11.3B net is only $400M more. The fast path adds $1.8B more in rate base. How does this change the strategic recommendation?",
        options: [
          {
            id: "a",
            text: "That $400M gap buys $1.8B in extra rate base and $171M in additional annual regulated revenue, a 43% return on the incremental capital versus the 9.5% baseline.",
            nextQuestionId: "g21q3a",
            scoreImpact: 15,
            feedback: "This recovers well. The incremental-return math is the analytical core here, 43% on the marginal capital against a 9.5% baseline shows fast generates outsized returns.",
          },
          {
            id: "b",
            text: "The $400M in additional net investment on the fast path is still a meaningful sum that requires careful review of PowerGrid's balance sheet capacity and credit rating implications.",
            nextQuestionId: "g21q3b",
            scoreImpact: -5,
            feedback: "$400M against $8.2B in existing rate base and $1.8B in EBITDA is about a 4.9% rate base increase, comfortably within typical utility balance sheet capacity.",
          },
          {
            id: "c",
            text: "IRA economics favor fast, but the regulatory approval process for an accelerated transition could run 12-18 months longer than moderate's, partially offsetting the economic advantage.",
            nextQuestionId: "g21q3a",
            scoreImpact: 5,
            feedback: "Regulatory timing is worth flagging, but the three state regulators have already set the 2035 mandate and are incentivized to approve a faster transition plan.",
          },
        ],
      },
      {
        id: "g21q3a",
        stage: "Stranded Asset Risk",
        question: "The slow transition path appears conservative but carries stranded asset risk. How do you quantify this risk and why does it make slow transition actually the highest-risk option?",
        exhibit: {
          type: "table",
          title: "Fossil Fleet Stranded Asset Analysis",
          data: `| Asset              | Net Book Value | Remaining Life | Slow Path Risk        | Fast Path Risk |
|---------------------|-----------------|------------------|--------------------------|------------------|
| Coal plants (4)     | $2.8B           | 2032-2040       | High (mandate 2035)     | None (retired)   |
| Gas peakers (12)    | $1.4B           | 2030-2038       | Medium                  | Low              |
| Gas combined cycle  | $1.9B           | 2028-2036       | Medium                  | Low              |
| Nuclear (2)         | $0.8B           | 2035-2045       | None                    | None             |
| Total at risk       | $6.1B           |                  |                          |                  |`,
        },
        options: [
          {
            id: "a",
            text: "Slow leaves $4.2B of coal and gas assets directly exposed.",
            nextQuestionId: "g21q4a",
            scoreImpact: 20,
            feedback: "This is a compelling and correct quantification. The $3.4B after-tax equity exposure is the proof point that slow transition isn't conservative at all, it's the highest financial risk option on the table.",
          },
          {
            id: "b",
            text: "Stranded asset risk is manageable through regulatory advocacy for cost recovery, utilities have historically recovered stranded costs through securitization and rate base mechanisms.",
            nextQuestionId: "g21q4b",
            scoreImpact: -10,
            feedback: "That historical recovery pattern is no longer the regulatory baseline. Several state commissions have explicitly denied or capped fossil asset cost recovery when a utility keeps assets running past the retirement timeline implied by its own state's clean energy mandate.",
          },
          {
            id: "c",
            text: "Stranded asset risk is secondary, the real financial stability threat is execution risk on deploying $18B of renewable investment inside 10 years.",
            nextQuestionId: "g21q4b",
            scoreImpact: -5,
            feedback: "Execution risk on an $18B build is a legitimate operational concern, but $3.4B in potential equity write-offs is an immediate financial exposure that exists regardless of how well the buildout is executed.",
          },
        ],
      },
      {
        id: "g21q3b",
        stage: "Stranded Asset Risk",
        question: "The partner gives you the stranded asset analysis: $4.2B in coal and gas assets at risk under the slow path, creating $3.4B in after-tax equity exposure. How does this change the strategic recommendation?",
        options: [
          {
            id: "a",
            text: "That $3.4B equity exposure makes slow the financially riskiest path despite its lower headline capital spend. Combined with the IRA math showing fast only costs $400M more than moderate, fast is both cheaper on a risk-adjusted basis and economically ahead of the alternatives.",
            nextQuestionId: "g21q4a",
            scoreImpact: 15,
            feedback: "This recovers well. Connecting the stranded asset exposure to the overall risk ranking, slow is highest risk, not lowest, is the key insight that gets the board to the fast transition recommendation.",
          },
          {
            id: "b",
            text: "The stranded asset risk actually validates moderate as the best balance, it retires fossil assets by 2035 to eliminate the stranded risk without taking on the full $18B of fast path capital.",
            nextQuestionId: "g21q4b",
            scoreImpact: -5,
            feedback: "Given that fast only costs $400M more in net investment than moderate after IRA credits, and generates $171M more in annual regulated revenue, moderate's apparent cost edge is minimal.",
          },
          {
            id: "c",
            text: "Disclose the stranded asset risk to regulators as a financial constraint that limits how fast PowerGrid can move, and use it to justify regulatory support for a slower retirement timeline.",
            nextQuestionId: "g21q4b",
            scoreImpact: -10,
            feedback: "This has the causality backwards, stranded asset risk is created by slow transition, it's not a reason to adopt one.",
          },
        ],
      },
      {
        id: "g21q4a",
        stage: "Customer Retention Risk",
        question: "The fourth dimension is customer attrition risk. Community solar and distributed generation are growing rapidly in all three states. How does transition speed affect customer retention?",
        exhibit: {
          type: "table",
          title: "Customer Attrition Risk Model by Transition Path",
          data: `| Customer Segment            | Pct of Rev | Slow Path Attrition | Mod Path  | Fast Path |
|------------------------------|-------------|-------------------------|-------------|-------------|
| Large commercial/industrial  | 32%         | 8-12%                    | 4-6%        | 1-3%        |
| Small commercial             | 28%         | 5-8%                     | 3-5%        | 1-2%        |
| Residential high-income      | 18%         | 6-10%                    | 3-5%        | 1-2%        |
| Residential general          | 22%         | 2-4%                     | 1-3%        | 0-1%        |
| Revenue at risk (midpoint)   |             | $1.26B/yr               | $630M/yr    | $280M/yr    |`,
        },
        options: [
          {
            id: "a",
            text: "Slow path attrition at $1.26B a year against $280M for fast is a $980M annual gap that compounds fast.",
            nextQuestionId: "g21q5a",
            scoreImpact: 20,
            feedback: "This is the right compounding analysis. A $3.5B five-year accumulated attrition gap is larger even than the stranded asset exposure.",
          },
          {
            id: "b",
            text: "Customer attrition is a long-horizon risk that can't be pinned down precisely, since community solar economics depend on future policy and technology pricing that's inherently uncertain.",
            nextQuestionId: "g21q5b",
            scoreImpact: -10,
            feedback: "Community solar and distributed generation adoption is already happening today, this isn't a hypothetical future scenario. The attrition rates in the table reflect current customer behavior.",
          },
          {
            id: "c",
            text: "Large commercial and industrial customers at 8-12% attrition under slow should be the primary focus, since they're 32% of revenue and have the most mature alternatives already available.",
            nextQuestionId: "g21q5a",
            scoreImpact: 5,
            feedback: "C&I attrition is the single largest segment risk, that's a fair read. But the headline number the board needs is the full-portfolio $1.26B annual figure, not just the C&I slice.",
          },
        ],
      },
      {
        id: "g21q4b",
        stage: "Customer Retention Risk",
        question: "Your analysis has been incomplete. The partner shares that slow path customer attrition creates $1.26B in annual at-risk revenue versus $280M for the fast path. What does this do to the overall case for transition speed?",
        options: [
          {
            id: "a",
            text: "That $980M annual attrition gap alone makes slow financially damaging, even setting aside stranded assets or regulatory conflict entirely. Five years of that differential permanently undercuts the utility's rate base rationale, making fast transition closer to a survival strategy than simply the better economics.",
            nextQuestionId: "g21q5a",
            scoreImpact: 15,
            feedback: "This recovers well. Framing fast transition as a survival strategy rather than just the economically superior choice gives the board the sense of urgency the situation actually calls for.",
          },
          {
            id: "b",
            text: "Customer attrition on the slow path is mainly a commercial challenge, addressable through rate redesign and value-added services, so the utility doesn't need to speed up its transition just to keep customers.",
            nextQuestionId: "g21q5b",
            scoreImpact: -10,
            feedback: "Rate redesign and value-added services can't retain commercial and industrial customers who have direct access to on-site generation and community solar priced below the utility's own cost of service.",
          },
          {
            id: "c",
            text: "Use the customer attrition data with regulators to argue the 2035 mandate is too aggressive, since rate increases from a fast transition will only accelerate attrition.",
            nextQuestionId: "g21q5b",
            scoreImpact: -5,
            feedback: "The model actually shows the opposite, slow has more attrition than fast, not less. Building an argument on this data that runs the other direction would be internally inconsistent.",
          },
        ],
      },
      {
        id: "g21q5a",
        stage: "Regulatory Strategy",
        question: "The board asks: how does transition speed affect PowerGrid's regulatory relationship and rate case outcomes over the next 15-20 years?",
        options: [
          {
            id: "a",
            text: "States that have already set 2035 mandates tend to build long-term relationships that favor utilities aligned with their policy intent. A utility seen as a willing transition partner typically gets 20-50 bps of extra allowed ROE, faster case timelines, and less scrutiny on rate increases. On an $18B+ rate base, that's worth roughly $675M NPV over 15 years.",
            nextQuestionId: "g21q6a",
            scoreImpact: 20,
            feedback: "This quantification is the most sophisticated piece of the analysis. Attaching a concrete $675M NPV to an intangible-sounding strategic asset is exactly the rigor that separates strong strategic work from a generic recommendation.",
          },
          {
            id: "b",
            text: "Regulatory relationships matter but can't really be quantified reliably, the value of being a preferred utility depends on which commissioners happen to be seated.",
            nextQuestionId: "g21q6b",
            scoreImpact: -5,
            feedback: "Individual commissioners rotate, but regulatory culture and institutional memory persist across those changes. Research on utility rate cases consistently shows 15-30 bps of systematic allowed ROE advantage.",
          },
          {
            id: "c",
            text: "Regulatory strategy should sit with PowerGrid's own regulatory affairs team and outside counsel, it's outside the scope of the Strategy& energy transition engagement.",
            nextQuestionId: "g21q6b",
            scoreImpact: -10,
            feedback: "Regulatory strategy is central to the value of any transition recommendation, allowed ROE and rate case outcomes over 15-20 years are the most consequential financial variables here.",
          },
        ],
      },
      {
        id: "g21q5b",
        stage: "Regulatory Strategy",
        question: "The partner confirms that a 25 bps regulatory relationship advantage over 15 years is worth $675M NPV. How does this affect the overall financial comparison between the three paths?",
        options: [
          {
            id: "a",
            text: "Stack the regulatory relationship value on top of the IRA economics, then net out the stranded asset risk and customer attrition exposure.",
            nextQuestionId: "g21q6a",
            scoreImpact: 15,
            feedback: "This synthesis is right. Rolling all four financial components into one total advantage number gives the board a single compelling figure instead of four separate considerations.",
          },
          {
            id: "b",
            text: "The regulatory relationship advantage only holds if state commissions stay committed to clean energy policy for the full 15-20 years, and political turnover could erase it before the value is ever realized.",
            nextQuestionId: "g21q6b",
            scoreImpact: -5,
            feedback: "Political risk in energy regulation is real, but the 2035 mandates are statutory in all three states, reversing them requires legislative action, not just a new governor or a reshuffled commission.",
          },
          {
            id: "c",
            text: "The regulatory advantage actually confirms moderate as optimal, since it still aligns with the 2035 mandate while avoiding the execution risk that comes with the accelerated fast path.",
            nextQuestionId: "g21q6b",
            scoreImpact: -10,
            feedback: "The regulatory advantage is actually larger for fast than for moderate, since arriving early signals stronger strategic commitment to regulators.",
          },
        ],
      },
      {
        id: "g21q6a",
        stage: "Implementation Roadmap",
        question: "The board has accepted the fast transition recommendation. Design the high-level 10-year implementation roadmap.",
        exhibit: {
          type: "table",
          title: "Fast Transition Implementation Phases",
          data: `| Phase       | Years  | Actions                            | Capex  | Rate Base Add |
|--------------|---------|--------------------------------------|---------|-----------------|
| Foundation   | 1-3     | Solar and wind buildout phase 1     | $5.2B   | $5.2B           |
| Expansion    | 4-6     | Offshore wind, battery storage      | $7.1B   | $7.1B           |
| Completion   | 7-10    | Remaining buildout, coal retire     | $5.7B   | $5.7B           |
| Total        | 1-10    |                                       | $18.0B  | $18.0B          |`,
        },
        options: [
          {
            id: "a",
            text: "Three phases: years 1-3 build out solar and wind while keeping coal and gas running for reliability; years 4-6 add offshore wind and battery storage.",
            nextQuestionId: "g21q7a",
            scoreImpact: 20,
            feedback: "This is a complete roadmap. The parallel workstreams, regulatory, workforce, transmission, are what separate a real implementation plan from a financial model on a slide.",
          },
          {
            id: "b",
            text: "Retire coal in the first three years to demonstrate commitment to the 2032 target right away, then build replacement renewable capacity behind it in parallel.",
            nextQuestionId: "g21q7b",
            scoreImpact: -15,
            feedback: "Retiring coal before replacement capacity is actually in service risks reliability violations and potential blackouts. Build first, retire second, not the other way around.",
          },
          {
            id: "c",
            text: "Outsource the entire renewable buildout to an independent power producer through long-term power purchase agreements, avoiding the capital investment and execution risk.",
            nextQuestionId: "g21q7b",
            scoreImpact: -10,
            feedback: "PPAs don't add to the rate base, they're purchased power expense, not capital investment. Choosing PPAs over company-owned development gives up the $18B rate base addition.",
          },
        ],
      },
      {
        id: "g21q6b",
        stage: "Implementation Roadmap",
        question: "Your analysis has been inconsistent. The partner gives you the fast transition recommendation. Design the three-phase implementation in two minutes.",
        options: [
          {
            id: "a",
            text: "Phase one, years 1-3: solar and wind buildout, regulatory filing, workforce transition planning.",
            nextQuestionId: "g21q7a",
            scoreImpact: 15,
            feedback: "This is a good recovery under time pressure. Three phases with capital, timeline, and the key parallel workstreams.",
          },
          {
            id: "b",
            text: "The implementation roadmap should come from the operations and project management teams once the board approves the strategic direction.",
            nextQuestionId: "g21q7b",
            scoreImpact: -10,
            feedback: "The board asked for a recommendation and a roadmap together, the implementation plan is part of the deliverable, not separate follow-on work.",
          },
          {
            id: "c",
            text: "Deploy the full $18B simultaneously across the first five years to compress the timeline to 2028 and add extra buffer against 2035 mandate risk.",
            nextQuestionId: "g21q7b",
            scoreImpact: -5,
            feedback: "Deploying $18B in five years instead of ten roughly doubles the annual capital deployment rate, adds significant execution risk, and requires rate increases that could accelerate customer attrition.",
          },
        ],
      },
      {
        id: "g21q7a",
        stage: "Final Recommendation",
        question: "The board asks for the complete recommendation: which path, financial rationale, key risks, and board approval required.",
        options: [
          {
            id: "a",
            text: "Fast transition to 2032. IRA economics put the fast path's net cost only $400M above moderate, for a 43% incremental return.",
            nextQuestionId: "end",
            scoreImpact: 20,
            feedback: "This is a complete and compelling recommendation. Financial rationale quantified, risk rationale quantified, regulatory rationale quantified, and the specific board approvals spelled out.",
          },
          {
            id: "b",
            text: "Recommend the moderate 2035 transition, it meets the mandate without the fast path's execution risk and avoids the legal conflict that comes with fighting the timeline.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "This recommendation contradicts the analysis just built. IRA economics show fast is only $400M more in net investment than moderate, and the stranded asset and attrition risks make slow the worst path by far.",
          },
          {
            id: "c",
            text: "Present all three options to the board with equal weighting and let them choose based on their own risk tolerance.",
            nextQuestionId: "end",
            scoreImpact: -5,
            feedback: "Presenting three options with equal weighting when the analysis clearly favors one isn't a recommendation, it's a menu.",
          },
        ],
      },
      {
        id: "g21q7b",
        stage: "Final Recommendation",
        question: "Your analysis has had significant gaps. The partner gives you one final chance. The CEO and board need the complete recommendation now.",
        options: [
          {
            id: "a",
            text: "Fast transition to 2032. Fast costs only $400M more in net investment than moderate for a 43% incremental ROI.",
            nextQuestionId: "end",
            scoreImpact: 15,
            feedback: "This is a strong recovery. All the quantified rationale is present, IRA economics, stranded asset risk, customer attrition, regulatory value.",
          },
          {
            id: "b",
            text: "The analysis isn't complete enough yet to recommend with confidence, more modeling on IRA credit eligibility and stranded cost recovery precedent is needed before committing to a path.",
            nextQuestionId: "end",
            scoreImpact: -15,
            feedback: "Twelve weeks of analysis are already done. Asking for more time while the board is waiting on the final recommendation is a delivery failure at this stage.",
          },
          {
            id: "c",
            text: "Recommend slow transition with active regulatory advocacy, fighting the 2035 mandate through regulatory and legal challenge to buy time.",
            nextQuestionId: "end",
            scoreImpact: -10,
            feedback: "Slow is the worst option on every financial dimension covered, highest stranded asset risk, highest customer attrition, worst IRA economics, and the weakest regulatory relationship outcome.",
          },
        ],
      },
    ],
  },
];
