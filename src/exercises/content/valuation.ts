import type { Exercise } from '../lib/schema';

// Valuation, unlike accounting, is mostly judgement. There is a defensible answer to "which method
// leads here" and almost never a provable one, so the weight in this module sits on the two formats
// built for that: bucketing, whose forgiving middle absorbs the genuinely arguable calls, and
// ordering, whose Kendall-tau scoring gives a nearly-right mental model a nearly-right mark.
//
// The two orderings are deliberately the same question asked twice. One ranks the standard methods
// for a healthy company in a normal market and produces the textbook ladder; the other hands over a
// company where that ladder inverts, with the numbers stated so the inversion is arithmetic rather
// than opinion. A learner who thinks the ladder is a law rather than a tendency gets the second one
// wrong, which is the point.
//
// Every exercise pins its multiple convention (EV/LTM EBITDA unless stated), its lease treatment
// and, where it matters, whether the answer is on a control or a minority basis. Those are the
// three places a correct answer gets marked wrong when the convention is left unsaid.

export const VALUATION: Exercise[] = [
  // ================================================================== easy
  {
    id: 'val-bucket-method-triage-easy',
    module: 'valuation',
    tier: 'easy',
    kind: 'bucketing',
    title: 'Which method leads here?',
    prompt:
      'Sort each approach by the weight it deserves in this particular valuation. The middle bucket is the forgiving one, so use it for the approaches you would show without leaning on.',
    scenario:
      'Ardwell Packaging plc. Listed for eleven years, revenue of ${revenue}m, EBITDA margins between {marginLo}% and {marginHi}% in every year since 2019. {peers} listed pure-play peers publish quarterly numbers. {deals} takeovers of similar businesses have closed in the last two years, all with disclosed terms. The board expects an approach and has asked what the whole company is worth. Management has given you a five-year plan.',
    conventions: [
      'You are valuing 100% of the company, on a control basis.',
      'Sort by the weight each approach deserves in THIS valuation, not by whether the method is respectable in general.',
      'The middle bucket is lenient: an approach that belongs in an outer bucket still earns half credit there.',
      'Ardwell is a single-segment going concern with no separable divisions and no distress.',
      'The peers and the precedents are close enough in size, geography and margin to be used without adjustment.',
    ],
    skills: ['val-method-selection', 'val-comps-vs-precedents', 'val-control-premium', 'val-football-field'],
    estSeconds: 180,
    // The sort turns on what KIND of company this is — listed, profitable, stable, with peers and
    // recent deals available — and no figure here changes that. They move anyway, because a triage
    // you have already done is still a memory test. The margin band stays two points wide at every
    // value, since the stability is the thing that makes a DCF appropriate, and the peer and deal
    // counts stay high enough that both remain data sets rather than anecdotes.
    vars: [
      { id: 'revenue', label: 'revenue', domain: [480, 620, 350, 900] },
      { id: 'marginLo', label: 'bottom of the EBITDA margin band', domain: [17, 21, 14] },
      { id: 'peers', label: 'listed peers', domain: [6, 8, 5, 7] },
      { id: 'deals', label: 'recent takeovers', domain: [5, 7, 6, 8] },
    ],
    derived: [{ id: 'marginHi', label: 'top of the margin band', expr: 'marginLo + 2' }],
    buckets: [
      { id: 'primary', label: 'Leads the valuation' },
      { id: 'supporting', label: 'Supporting cross-check', lenient: true },
      { id: 'na', label: 'Does not apply here' },
    ],
    items: [
      {
        id: 'trading-comps',
        label: 'Comparable companies analysis',
        detail: '{peers} listed pure-plays, current multiples',
        bucket: 'primary',
        explain:
          'The market is already pricing {peers} businesses that look like this one, today, with published earnings. That is the live opinion on what a business like Ardwell is worth, and it is the first range on the football field.',
      },
      {
        id: 'precedents',
        label: 'Precedent transactions',
        detail: '{deals} disclosed takeovers in two years',
        bucket: 'primary',
        explain:
          '{deals} recent deals is a usable data set rather than an anecdote. It answers a different question from comps: not what a share is worth, but what somebody actually paid for the whole thing, control included. This valuation is about a takeover, so that question is the relevant one.',
      },
      {
        id: 'dcf',
        label: 'Discounted cash flow',
        detail: "On management's five-year plan",
        bucket: 'primary',
        explain:
          'Stable margins and a real plan are exactly what a DCF needs. It is the only approach here that values the business on its own cash flows rather than on what the market currently pays for someone else.',
      },
      {
        id: 'lbo',
        label: 'Leveraged buyout analysis',
        bucket: 'supporting',
        explain:
          'An LBO answers what a financial sponsor could pay and still hit its return. That is a floor under the price, not a view of value. Show it on the football field, never lead with it.',
      },
      {
        id: 'premiums-paid',
        label: 'Premiums paid analysis',
        detail: 'Premium to undisturbed price in comparable deals',
        bucket: 'supporting',
        explain:
          'Useful for sense-checking the premium an offer implies, but the premium is an output of the valuation rather than an input to it. Lead with it and you are pricing the deal off the last deal.',
      },
      {
        id: 'trading-range',
        label: '52-week trading range',
        bucket: 'supporting',
        explain:
          'It says what the market has paid for a minority stake over the past year, which frames the negotiation. It carries no control premium and no view of the plan, so it sits alongside the work rather than driving it.',
      },
      {
        id: 'liquidation',
        label: 'Liquidation value',
        bucket: 'na',
        explain:
          'Liquidation asks what the assets fetch once the business stops. A profitable going concern with a five-year plan is worth considerably more than its scrap value, so the number carries no information about this decision.',
      },
      {
        id: 'p-tbv',
        label: 'Price / tangible book value',
        bucket: 'na',
        explain:
          'Price to tangible book is the multiple for a business where book value IS the earning asset, which means a bank. The book value of a packaging plant records what was paid for it years ago, not what it earns.',
      },
      {
        id: 'vc-rounds',
        label: 'Recent private funding rounds in packaging technology',
        bucket: 'na',
        explain:
          'Funding rounds price a small stake in a pre-profit start-up, usually with a liquidation preference attached that makes the headline number fiction. None of that transfers to a mature listed manufacturer.',
      },
    ],
  },

  {
    id: 'val-order-value-ladder-easy',
    module: 'valuation',
    tier: 'easy',
    kind: 'ordering',
    title: 'The value ladder',
    prompt:
      'Rank these five approaches by the value they typically produce for a healthy, profitable company in a normal market. Highest first.',
    conventions: [
      'A healthy, profitable company in a normal market: no distress, no bubble, with both peers and precedents available.',
      'Rank by the value each approach typically produces, not by how much weight it deserves.',
      'The DCF is run on a management plan with standard assumptions, not a stretch case.',
      'The DCF and precedent transactions are treated as tied at the top: which of the two comes out higher depends on the assumptions, so either order scores full marks.',
      'This ladder is a tendency, not a law. It reverses often enough that a football field is drawn as ranges rather than points.',
    ],
    skills: ['val-method-selection', 'val-control-premium', 'val-comps-vs-precedents', 'val-football-field'],
    estSeconds: 120,
    topLabel: 'Highest value',
    bottomLabel: 'Lowest value',
    items: [
      {
        id: 'dcf',
        label: 'Discounted cash flow',
        rank: 1,
        explain:
          'It values the plan rather than the present, and management plans slope upwards. It also has more levers than any other method here, which is why it can land anywhere and why nobody presents it without a sensitivity table.',
      },
      {
        id: 'precedents',
        label: 'Precedent transactions',
        rank: 1,
        explain:
          'Deal multiples include a control premium, and often a slice of the synergies the buyer expected. Comps carry neither, which is the whole reason the two ranges sit at different heights on the page.',
      },
      {
        id: 'comps',
        label: 'Comparable companies',
        rank: 3,
        explain:
          'A share price is what a small, liquid, non-controlling stake trades at. Nobody in that market is buying the right to run the company, so no premium is embedded in the multiple.',
      },
      {
        id: 'lbo',
        label: 'Leveraged buyout analysis',
        rank: 4,
        explain:
          'It solves for the most a sponsor can pay while still earning its target return, so it is a floor by construction. A strategic buyer with synergies and a lower cost of capital can normally outbid it.',
      },
      {
        id: 'liquidation',
        label: 'Liquidation value',
        rank: 5,
        explain:
          'Break-up under time pressure with no going-concern value attached. For a healthy company it sits at the bottom by a distance, which is exactly why it only appears when the company is in trouble.',
      },
    ],
  },

  {
    id: 'val-numeric-ltm-multiple-easy',
    module: 'valuation',
    tier: 'easy',
    kind: 'numeric',
    title: 'LTM EBITDA and the multiple it implies',
    prompt:
      'Corvain Industries reports on a December year end and has just published its first quarter. Work out what it trades at on a last-twelve-months basis.',
    conventions: [
      'LTM = the most recent fiscal year, plus the year-to-date stub, less the same stub a year earlier.',
      'Enterprise value is given and does not need building.',
      'EBITDA is as reported. No normalising adjustments are needed.',
      'Multiples are quoted in turns, to one decimal place.',
    ],
    skills: ['val-ltm', 'val-implied-multiple'],
    estSeconds: 120,
    // The multiple is the variable and the enterprise value is derived FROM it, not the other way
    // round. Drawing an enterprise value independently gives answers like 10.83x, and an exercise
    // that asks for one decimal place would then mark a correctly rounded answer wrong.
    // The new quarter is always larger than the one it replaces, because the whole lesson is that
    // ignoring the stubs misses growth the company has already reported.
    vars: [
      { id: 'mult', label: 'EV / LTM EBITDA', domain: [11, 12.5, 9.5, 14] },
      { id: 'fy', label: 'last full year EBITDA', domain: [400, 450, 360, 500] },
      { id: 'q1new', label: 'the new quarter', domain: [120, 140, 125, 160] },
      { id: 'q1old', label: 'the quarter it replaces', domain: [100, 110, 85, 95] },
    ],
    derived: [
      { id: 'ltm', label: 'LTM EBITDA', expr: 'fy + q1new - q1old' },
      { id: 'ev', label: 'enterprise value', expr: 'mult * ltm' },
    ],
    givens: [
      { label: 'Enterprise value', value: '${ev}m' },
      { label: 'FY2025 EBITDA (year ended 31 December 2025)', value: '${fy}m' },
      { label: 'Q1 2026 EBITDA (quarter ended 31 March 2026)', value: '${q1new}m' },
      { label: 'Q1 2025 EBITDA (quarter ended 31 March 2025)', value: '${q1old}m' },
    ],
    question: 'EV / LTM EBITDA, in turns',
    answer: 11,
    answerExpr: 'mult',
    tolerance: 0.05,
    unit: 'x',
    nearMisses: [
      {
        value: 11.55,
        valueExpr: 'ev / fy',
        note: 'You divided by the fiscal year and ignored the stubs. That is the FY2025 multiple, not the LTM multiple: it misses a quarter of growth the company has already reported.',
      },
      {
        value: 8.88,
        valueExpr: 'ev / (fy + q1new)',
        note: 'You added the new quarter but never removed the one it replaces. {fy} + {q1new} is fifteen months of EBITDA, which flatters the denominator and makes the company look several turns cheaper than it is.',
      },
      {
        value: 12.16,
        valueExpr: 'ev / (fy - q1new + q1old)',
        note: 'You subtracted the new quarter and added the old one. The stub that comes out is last year, and the stub that goes in is this year.',
      },
    ],
    working: [
      'LTM EBITDA = FY2025 of {fy}, plus the new quarter of {q1new}, less the same quarter last year of {q1old} = ${ltm}m.',
      'The subtraction is the whole trick. Adding a stub without removing the year-ago stub counts fifteen months of earnings against twelve months of enterprise value.',
      'EV / LTM EBITDA = {ev} / {ltm} = {mult|1}x.',
    ],
  },

  // ================================================================ medium
  {
    id: 'val-bucket-multiple-choice-medium',
    module: 'valuation',
    tier: 'medium',
    kind: 'bucketing',
    title: 'Which multiple, and which are broken',
    prompt:
      'Sort each multiple by what it can anchor for this company today. Two of the buckets are about judgement and one is not: a multiple whose numerator and denominator belong to different claimants is wrong regardless of the company.',
    scenario:
      'Lumen Layer, Inc. Listed subscription software. NTM revenue of ${ntmRev}m growing {growth}%, gross margin {gm}%, ARR of ${arr}m at the last quarter end, {customers} enterprise customers. LTM EBITDA is NEGATIVE ${ebitdaLoss}m and LTM net income is negative ${niLoss}m. Consensus has the company EBITDA-positive in FY2028. No debt, ${cash}m of cash, and tangible book value is close to nothing because the asset base is people and code.',
    conventions: [
      'Enterprise value = market capitalisation + debt - cash. Lumen Layer has no debt.',
      'ARR is the annualised value of subscriptions in force at the last quarter end, as reported.',
      'Sort by what each multiple can anchor TODAY, not by what will work once the company is profitable.',
      'The middle bucket is lenient: a multiple that belongs in an outer bucket still earns half credit there.',
      'The peer set is other listed subscription software companies at similar growth rates.',
    ],
    skills: ['val-multiple-selection', 'val-numerator-denominator', 'val-negative-ebitda', 'val-industry-multiples'],
    presentation: { timerSeconds: 300, includeDistractors: true },
    estSeconds: 240,
    // Both loss figures stay losses at every value, because that is what makes EV/EBITDA and P/E
    // malformed here rather than merely unflattering — a negative denominator has no reading at
    // all, and an exercise where it turned positive would be sorting a different company.
    vars: [
      { id: 'ntmRev', label: 'NTM revenue', domain: [250, 320, 180, 400] },
      { id: 'growth', label: 'revenue growth', domain: [38, 45, 30, 52] },
      { id: 'gm', label: 'gross margin', domain: [78, 82, 74] },
      { id: 'customers', label: 'enterprise customers', domain: [1900, 2400, 1400, 3100] },
      { id: 'ebitdaLoss', label: 'LTM EBITDA loss', domain: [40, 55, 30, 70] },
      { id: 'cash', label: 'cash', domain: [310, 400, 220, 500] },
    ],
    derived: [
      { id: 'arr', label: 'ARR', expr: 'round(ntmRev * 1.08)' },
      { id: 'niLoss', label: 'LTM net loss', expr: 'ebitdaLoss + 22' },
    ],
    buckets: [
      { id: 'lead', label: 'Anchor the valuation' },
      { id: 'support', label: 'Worth showing alongside', lenient: true },
      { id: 'broken', label: 'Malformed or meaningless here' },
    ],
    items: [
      {
        id: 'ev-revenue',
        label: 'EV / NTM revenue',
        bucket: 'lead',
        explain:
          'Revenue is the highest line that is still positive, and for a software business growing at {growth}% it is the line the market is actually pricing. Consistent too: enterprise value against a figure earned before any capital provider is paid.',
      },
      {
        id: 'ev-arr',
        label: 'EV / ARR',
        bucket: 'lead',
        explain:
          'ARR strips out one-off services and professional fees and prices the recurring book, which is what a subscription business is. It leads with revenue rather than behind it because the two answer slightly different questions about the same top line.',
      },
      {
        id: 'ev-gross-profit',
        label: 'EV / gross profit',
        bucket: 'lead',
        explain:
          'The honest refinement of the revenue multiple. A {gm}% gross margin and a 45% gross margin are different businesses even at the same revenue, and gross profit is the first line that says so.',
      },
      {
        id: 'ev-fwd-ebitda',
        label: 'EV / FY2028E EBITDA',
        bucket: 'support',
        explain:
          'Well formed and, in 2028, the multiple everyone will use. Today it rests on a consensus estimate three years out for a company that has never been profitable, which makes it a sense-check rather than an anchor.',
      },
      {
        id: 'ev-customer',
        label: 'EV per enterprise customer',
        bucket: 'support',
        explain:
          'The industry KPI multiple. It travels well when customers are similar in size and terrible when they are not, so it is a cross-check on the revenue multiple rather than a substitute for it.',
      },
      {
        id: 'growth-adjusted',
        label: 'EV / NTM revenue against revenue growth',
        detail: 'The peer scatter, growth on one axis and the multiple on the other',
        bucket: 'support',
        explain:
          'It answers the objection that a raw revenue multiple ignores growth. Useful in the pitch, but a two-variable regression on a dozen peers is a presentation device, not a valuation.',
      },
      {
        id: 'ev-ltm-ebitda',
        label: 'EV / LTM EBITDA',
        bucket: 'broken',
        explain:
          'The denominator is negative ${ebitdaLoss}m, so the multiple is negative. It is not merely high or unhelpful: a negative multiple has no interpretation at all, and no amount of squinting turns it into one. This is the case that forces you up the income statement to revenue or gross profit.',
      },
      {
        id: 'pe',
        label: 'P / E',
        bucket: 'broken',
        explain:
          'Same problem one line lower. Net income is negative ${niLoss}m, so the ratio is meaningless, and P/E would also be sensitive to a capital structure that has no debt in it anyway.',
      },
      {
        id: 'ev-net-income',
        label: 'EV / net income',
        bucket: 'broken',
        explain:
          'Malformed by construction, whatever the company. Enterprise value is a claim held by debt and equity together; net income is what is left for equity alone after the lenders have been paid. The numerator covers more of the business than the denominator does.',
      },
      {
        id: 'p-ebitda',
        label: 'P / EBITDA',
        bucket: 'broken',
        explain:
          'The same mismatch running the other way. Price is equity only; EBITDA is earned before interest and belongs to everybody. Two companies with identical operations and different debt loads would show different P/EBITDA multiples for no operating reason.',
      },
      {
        id: 'p-tbv',
        label: 'P / tangible book value',
        bucket: 'broken',
        explain:
          'Well formed, and pointed at the wrong industry. It works where the balance sheet is the earning asset, which means a bank. Every sector has its own denominator, EBITDAR for lease-heavy operators, EV per tonne of production for a miner, and borrowing another one is how a comp set quietly stops comparing.',
      },
    ],
  },

  {
    id: 'val-board-multiple-moves-medium',
    module: 'valuation',
    tier: 'medium',
    kind: 'ternary-board',
    title: 'What happens to the multiple?',
    prompt:
      'Brightline Industrials trades at {mult|1}x: enterprise value of ${ev}m, made up of a ${mcap}m market capitalisation and ${netDebt}m of net debt, against LTM EBITDA of ${ebitda}m. Take each event on its own, starting from those numbers every time, and mark which way the LTM EV/EBITDA multiple moves.',
    conventions: [
      'The multiple throughout is EV / LTM EBITDA. EV = market capitalisation + debt - cash.',
      'Each event is independent. Reset to EV ${ev}m and LTM EBITDA ${ebitda}m before every row.',
      'The share price does not move unless the row says it does, so what is being asked is the mechanical effect on the ratio.',
      'EBITDA is as reported unless the row says the item is adjusted out.',
      'Ignore tax and any second-order effect on the following year.',
    ],
    skills: ['val-implied-multiple', 'val-normalisation', 'val-trough-and-peak', 'val-ltm'],
    presentation: { timerSeconds: 300, includeDistractors: true },
    estSeconds: 270,
    // Every direction on this board is the sign of a ratio, so the domains have to keep each sign
    // true rather than merely keep the arithmetic finite. Two constraints do the work: the one-off
    // charge is always smaller than EBITDA, so the denominator stays positive; and the bolt-on is
    // priced at a fixed fraction of Brightline's own multiple, so buying below where you trade —
    // which is the whole reason that row de-rates — holds at every value instead of by luck.
    vars: [
      { id: 'ebitda', label: 'LTM EBITDA', domain: [100, 125, 80, 150] },
      { id: 'mcap', label: 'market capitalisation', domain: [600, 750, 500, 900] },
      { id: 'netDebt', label: 'net debt', domain: [200, 250, 150, 300] },
      { id: 'charge', label: 'the legal settlement', domain: [20, 25, 16, 30] },
      { id: 'issue', label: 'the equity issue', domain: [100, 150, 80, 200] },
      { id: 'borrow', label: 'the warehouse borrowing', domain: [200, 250, 150, 300] },
      { id: 'lossEbitda', label: 'EBITDA lost by the sold division', domain: [15, 20, 12, 25] },
      { id: 'proceeds', label: 'proceeds from the disposal', domain: [60, 80, 50, 100] },
      { id: 'depReview', label: 'extra depreciation', domain: [10, 15, 8, 20] },
      { id: 'capSw', label: 'software development capitalised', domain: [30, 40, 25, 50] },
      { id: 'goodwill', label: 'goodwill written down', domain: [250, 300, 180, 400] },
      { id: 'boltEbitda', label: "the target's EBITDA", domain: [20, 25, 15, 30] },
    ],
    derived: [
      { id: 'ev', label: 'enterprise value', expr: 'mcap + netDebt' },
      { id: 'mult', label: 'EV / LTM EBITDA', expr: 'ev / ebitda' },
      { id: 'ebitdaCharged', label: 'EBITDA after the settlement', expr: 'ebitda - charge' },
      { id: 'multCharged', label: 'the multiple after the settlement', expr: 'ev / ebitdaCharged' },
      { id: 'evBorrow', label: 'enterprise value after the borrowing', expr: 'ev + borrow' },
      { id: 'multBorrow', label: 'the multiple after the borrowing', expr: 'evBorrow / ebitda' },
      { id: 'netDebtSale', label: 'net debt after the disposal', expr: 'netDebt - proceeds' },
      { id: 'evSale', label: 'enterprise value after the disposal', expr: 'ev - proceeds' },
      { id: 'ebitdaSale', label: 'EBITDA after the disposal', expr: 'ebitda + lossEbitda' },
      { id: 'multSale', label: 'the multiple after the disposal', expr: 'evSale / ebitdaSale' },
      { id: 'ebitdaCap', label: 'EBITDA after capitalising', expr: 'ebitda + capSw' },
      { id: 'multCap', label: 'the multiple after capitalising', expr: 'ev / ebitdaCap' },
      { id: 'boltMult', label: 'the multiple paid for the target', expr: 'round(mult * 0.625, 2)' },
      { id: 'boltPrice', label: 'price paid for the target', expr: 'round(boltEbitda * boltMult)' },
      { id: 'evBolt', label: 'enterprise value after the bolt-on', expr: 'ev + boltPrice' },
      { id: 'netDebtBolt', label: 'net debt after the bolt-on', expr: 'netDebt + boltPrice' },
      { id: 'ebitdaBolt', label: 'EBITDA after the bolt-on', expr: 'ebitda + boltEbitda' },
      { id: 'multBolt', label: 'the blended multiple', expr: 'evBolt / ebitdaBolt' },
    ],
    rows: [
      {
        id: 'one-off-charge',
        label: 'A one-off ${charge}m legal settlement is charged to cost of sales, and neither Brightline nor its peers strip it out',
        direction: 'up',
        explain:
          'EBITDA falls to ${ebitdaCharged}m against an unchanged ${ev}m of enterprise value, so the multiple goes to {multCharged|1}x. The company looks more expensive for having had a bad year, which is the mechanical reason a reported multiple on an unadjusted denominator misleads.',
      },
      {
        id: 'one-off-adjusted',
        label: 'The same settlement, but both Brightline and the peer set report it as non-recurring and quote adjusted EBITDA',
        direction: 'none',
        explain:
          'Adjusted EBITDA is still ${ebitda}m and enterprise value has not moved, so the multiple is unchanged at {mult|1}x. Same event, same cash out of the door, different multiple: what the denominator has been normalised for matters as much as what it is.',
      },
      {
        id: 'trough-quarter',
        label: 'The LTM window rolls forward: a trough quarter replaces the peak quarter that drops out',
        direction: 'up',
        explain:
          'Nothing happened to the business today, but the trailing denominator shrank, so the trailing multiple rose. This is why cyclicals look most expensive at the bottom of the cycle and cheapest at the top, and why nobody values them off a trailing number alone.',
      },
      {
        id: 'equity-issue',
        label: 'Brightline issues ${issue}m of new shares and leaves the proceeds in cash',
        direction: 'none',
        explain:
          'Market capitalisation up ${issue}m, cash up ${issue}m, net debt down ${issue}m. Enterprise value is ${ev}m either way and EBITDA has not moved. Nothing changed about the operating business, which is exactly what enterprise value is built to ignore.',
      },
      {
        id: 'debt-funded-asset',
        label: 'Brightline borrows ${borrow}m and buys a warehouse with it',
        direction: 'up',
        explain:
          'Debt up ${borrow}m with no cash left to net against it, so enterprise value goes to ${evBorrow}m while this year EBITDA has not moved. {multBorrow|1}x. The warehouse may earn its keep next year, but the multiple you can compute today has risen.',
      },
      {
        id: 'sell-loss-maker',
        label: 'It sells a division that lost ${lossEbitda}m of EBITDA for ${proceeds}m in cash',
        direction: 'down',
        explain:
          'Both ends push the same way. EBITDA rises to ${ebitdaSale}m because the drag has gone, and the ${proceeds}m of cash cuts net debt to ${netDebtSale}m, so enterprise value falls to ${evSale}m. {evSale} / {ebitdaSale} = {multSale|1}x. Selling a loss-maker de-rates the multiple even though nothing about the remaining business changed.',
      },
      {
        id: 'depreciation-review',
        label: 'A review of useful lives raises the depreciation charge by ${depReview}m',
        direction: 'none',
        explain:
          'Depreciation sits below EBITDA by definition. EBIT falls, net income falls, EBITDA does not, and enterprise value has not moved. This is the whole reason EBITDA is used to compare companies with different asset ages and different depreciation policies.',
      },
      {
        id: 'capitalise-software',
        label: 'It starts capitalising ${capSw}m of software development that it used to expense',
        direction: 'down',
        explain:
          'The cost leaves the income statement above EBITDA and reappears as capex and future amortisation, so EBITDA jumps to ${ebitdaCap}m for no change in cash. {ev} / {ebitdaCap} = {multCap|1}x. A comp set where some companies capitalise development and others expense it is not comparable on EV/EBITDA until you fix it.',
      },
      {
        id: 'goodwill-writedown',
        label: 'It writes down ${goodwill}m of goodwill from an old acquisition',
        direction: 'none',
        explain:
          'A non-cash charge below EBITDA against an asset the market never believed in. EBITDA is untouched, and the share price does not move by convention here, so enterprise value is untouched too. Book equity collapses and the multiple does not notice.',
      },
      {
        id: 'bolt-on',
        label: 'It buys a competitor for ${boltPrice}m in cash, adding ${boltEbitda}m of EBITDA',
        direction: 'down',
        explain:
          'Paying ${boltPrice}m of cash lifts net debt to ${netDebtBolt}m, so enterprise value goes to ${evBolt}m, against EBITDA of ${ebitdaBolt}m: {multBolt|1}x. Buying at {boltMult|1}x when you trade at {mult|1}x pulls the blended multiple down, which is the multiples-arithmetic version of an accretive deal.',
      },
    ],
  },


  // ================================================================== hard
  {
    id: 'val-bridge-adjusted-ebitda-hard',
    module: 'valuation',
    tier: 'hard',
    kind: 'bridge',
    title: 'Reported EBITDA to adjusted EBITDA',
    prompt:
      "Vermeer Coatings is being sold and the seller's adviser has put reported EBITDA of ${reported}m in the teaser. Build the adjusted EBITDA a buyer would actually underwrite. Several of the items below do not belong in this bridge at all, and leaving those in the tray is part of the answer.",
    conventions: [
      "Adjusted EBITDA on a buyer's basis: adjust only for items that are genuinely non-recurring, non-operating, or outside the cost structure the buyer will inherit.",
      'Stock-based compensation is a real cost of employing people and is NOT added back on this basis.',
      'Adjustments are limited to the historical period. No forward-looking run-rate savings and no synergies.',
      'Reported EBITDA of ${reported}m is already stated after every item below that sits above the EBITDA line.',
      'All amounts in $m. An add-back increases adjusted EBITDA.',
    ],
    skills: ['val-normalisation', 'val-adjusted-ebitda', 'val-recurring-vs-one-off', 'val-quality-of-earnings'],
    presentation: { timerSeconds: 360, showBase: false },
    estSeconds: 300,
    startLabel: 'Reported EBITDA',
    // Every adjustment moves, including the ones that must be left in the tray: an item you have
    // learned to recognise by its size is not being recognised on its merits.
    vars: [
      { id: 'reported', label: 'reported EBITDA', domain: [84, 96, 72, 110] },
      { id: 'restructuring', label: 'restructuring', domain: [6, 9, 4, 12] },
      { id: 'ownerComp', label: 'above-market owner compensation', domain: [3, 5, 2, 4] },
      { id: 'dealFees', label: 'deal fees', domain: [2, 3, 1.5, 4] },
      { id: 'disposalGain', label: 'gain on disposal', domain: [5, 8, 3, 10] },
      { id: 'insurance', label: 'insurance recovery', domain: [2, 3, 1.5, 4] },
      { id: 'litigation', label: 'the recurring settlement', domain: [4, 6, 3, 5] },
      { id: 'sbc', label: 'stock-based compensation', domain: [4, 6, 3, 5] },
      { id: 'da', label: 'D&A', domain: [22, 28, 18, 34] },
      { id: 'interest', label: 'interest', domain: [9, 12, 7, 15] },
      { id: 'runrate', label: 'announced run-rate savings', domain: [5, 7, 4, 8] },
    ],
    startValue: 84,
    startValueExpr: 'reported',
    targetLabel: 'Adjusted EBITDA',
    targetValue: 88,
    requireTotal: true,
    tolerance: 0.5,
    items: [
      {
        id: 'restructuring',
        label: 'Restructuring and severance, Fenwick plant closure',
        detail: 'Note 8. The plant is shut and the lease has been surrendered.',
        role: 'add',
        amount: 6,
        amountExpr: 'restructuring',
        explain:
          'A closure that has happened once and cannot happen again at that site. The cost structure the buyer inherits does not contain it, so it comes back.',
      },
      {
        id: 'owner-comp',
        label: "Founder's compensation above a market rate for the role",
        detail: 'The founder draws $4.2m; a hired chief executive costs $1.2m.',
        role: 'add',
        amount: 3,
        amountExpr: 'ownerComp',
        explain:
          'A private-company classic. The buyer will replace the founder with a salaried executive, so $3m of the charge is a distribution dressed as a cost. Normalising to a market rate is a genuine adjustment, not a favour to the seller.',
      },
      {
        id: 'deal-fees',
        label: 'Advisory fees for the sale process',
        detail: 'Booked in SG&A during the period.',
        role: 'add',
        amount: 2,
        amountExpr: 'dealFees',
        explain:
          'The cost of selling the company, incurred once, by the seller, for the seller. It has nothing to do with running the business the buyer is acquiring.',
      },
      {
        id: 'disposal-gain',
        label: 'Gain on the sale of the Ardsley warehouse',
        detail: 'Credited to other operating income.',
        role: 'subtract',
        amount: 5,
        amountExpr: 'disposalGain',
        explain:
          'A one-off gain sitting inside operating income and therefore inside reported EBITDA. Adjustments run both ways: if you strip out one-off costs you must strip out one-off gains, and this is the one sellers forget.',
      },
      {
        id: 'insurance',
        label: 'Business interruption insurance recovery',
        detail: 'Credited against cost of sales after the Fenwick flood.',
        role: 'subtract',
        amount: 2,
        amountExpr: 'insurance',
        explain:
          'Real cash, and it flatters the period it landed in. There is no flood next year and no recovery next year, so it comes out of a run-rate number.',
      },
      {
        id: 'litigation',
        label: 'Product liability settlement',
        detail: 'The third settlement in three years arising from the same product line.',
        role: 'out',
        amount: 4,
        amountExpr: 'litigation',
        explain:
          'It looks like the textbook add-back and it is not. Three settlements in three years from one product line is a cost of selling that product, not an accident. Anything that recurs annually is recurring, whatever the label on the line, and a buyer who adds it back is paying a multiple for a liability.',
      },
      {
        id: 'sbc',
        label: 'Stock-based compensation',
        detail: '${sbc}m, non-cash.',
        role: 'out',
        amount: 4,
        amountExpr: 'sbc',
        explain:
          'Non-cash is not the same as free. The buyer either keeps issuing equity and dilutes itself, or replaces it with cash pay. The convention here says it stays in the cost base, and a bridge marked against the other convention would be marking the wrong question.',
      },
      {
        id: 'da',
        label: 'Depreciation and amortisation',
        detail: '${da}m.',
        role: 'out',
        amount: 22,
        amountExpr: 'da',
        explain:
          'Already excluded. EBITDA is earnings before it, so reported EBITDA of ${reported}m has never had it deducted, and adding it back would count it twice in the direction that helps the seller.',
      },
      {
        id: 'interest',
        label: 'Interest expense on the term loan',
        detail: '${interest}m.',
        role: 'out',
        amount: 9,
        amountExpr: 'interest',
        explain:
          'Below the line for the same reason. EBITDA sits above the capital structure, which is exactly why it is the metric a buyer with a different capital structure uses.',
      },
      {
        id: 'runrate',
        label: 'Run-rate savings from the headcount plan announced in February',
        detail: 'Announced after the period end. ${runrate}m annualised, nothing realised in the period.',
        role: 'out',
        amount: 5,
        amountExpr: 'runrate',
        explain:
          'A forecast, presented as history. It may well happen, and the buyer can pay for it in the price if it believes it, but it does not belong in a historical adjusted EBITDA that a multiple will be applied to.',
      },
    ],
  },

  {
    id: 'val-order-ladder-inverted-hard',
    module: 'valuation',
    tier: 'hard',
    kind: 'ordering',
    title: 'The ladder, on a company where it does not hold',
    prompt:
      'Kestrel Software, 2026. LTM revenue of ${ltmRev}m and LTM EBITDA of ${ltmEbitda}m, both as reported and needing no adjustment. Rank the six approaches below by the enterprise value each one produces for Kestrel, highest first.',
    conventions: [
      'All values are enterprise values in $m. LTM EBITDA is ${ltmEbitda}m and LTM revenue is ${ltmRev}m.',
      'Multiples quoted are EV / LTM EBITDA unless the item says otherwise.',
      'Rank by the value each approach produces here. This is NOT a ranking of how much weight each one deserves, and the two orders are not the same.',
      'Every approach produces a different number, so there are no ties.',
      'The listed peer set re-rated sharply this year. The precedent set did not, because there have been no deals since 2023 apart from the one named below.',
    ],
    skills: ['val-method-selection', 'val-control-premium', 'val-comps-vs-precedents', 'val-stale-precedents', 'val-multiple-selection'],
    presentation: { timerSeconds: 360, showBase: false },
    estSeconds: 300,
    // Only the size of the company moves. Every multiple stays exactly where it was authored,
    // because the multiples ARE the exercise: comps above precedents is the inversion, and a
    // variant that shuffled them would be a different lesson wearing this one's answer key.
    // Revenue is derived from EBITDA at a fixed 40% margin, so the EV/revenue approach keeps its
    // place at the bottom instead of floating free of the rest of the ladder.
    vars: [{ id: 'ltmEbitda', label: 'LTM EBITDA', domain: [100, 120, 80, 150] }],
    derived: [{ id: 'ltmRev', label: 'LTM revenue', expr: 'ltmEbitda * 2.5' }],
    topLabel: 'Highest value',
    bottomLabel: 'Lowest value',
    items: [
      {
        id: 'single-deal',
        label: 'The single 2026 deal in the sector: Aster Systems, taken private at 17.0x',
        rank: 1,
        explain:
          'Highest number on the page and the weakest evidence on it. 17.0 x {ltmEbitda} = ${17 * ltmEbitda}m, from one transaction, for a target growing at 40% against Kestrel at 12%. A single deal is a data point, not a data set, which is precisely why a football field shows a range from the whole precedent set rather than a point from the most flattering member of it.',
      },
      {
        id: 'comps',
        label: 'Trading comparables: peer median 15.0x',
        rank: 2,
        explain:
          '15.0 x {ltmEbitda} = ${15 * ltmEbitda}m. Comps come out above the precedent range here, which the textbook ladder says should not happen. It happens whenever the market has re-rated since the last wave of deals: the control premium in a 2022 transaction cannot rescue a multiple struck when money was expensive.',
      },
      {
        id: 'dcf',
        label: "DCF on management's plan at a 12% WACC, implying 13.0x",
        rank: 3,
        explain:
          '${13 * ltmEbitda}m. The DCF lands in the middle rather than at the top because the discount rate reflects today, not 2021. A DCF is only the highest method when the plan is aggressive or the WACC is generous, and here neither is.',
      },
      {
        id: 'precedents',
        label: 'Precedent transactions: median 11.0x across the four deals of 2022 and 2023',
        rank: 4,
        explain:
          '11.0 x {ltmEbitda} = ${11 * ltmEbitda}m, and every one of those deals carried a control premium. They still come out below where the market trades today, because they were struck in a higher-rate market and one of the four was a distressed seller. Control premium is a tendency; stale data beats it.',
      },
      {
        id: 'lbo',
        label: 'LBO: the most a sponsor can pay for a 20% IRR, 9.0x',
        rank: 5,
        explain:
          '${9 * ltmEbitda}m, and it does what an LBO always does: sets a floor. With debt this expensive a sponsor cannot compete with a strategic buyer, which is the same reason there have been no sponsor deals in the sector since 2023.',
      },
      {
        id: 'ev-revenue',
        label: 'EV / revenue: peer median 3.0x on revenue of ${ltmRev}m',
        rank: 6,
        explain:
          '${3 * ltmRev}m, the lowest number here and an artefact of the metric. The peers trade at 15.0x EBITDA and 3.0x revenue, which implies a peer EBITDA margin of 20%. Kestrel runs at 40%. Applying the peer revenue multiple prices its margin as if it were half what it is, which is the standing objection to EV/revenue whenever margins differ across the set.',
      },
    ],
  },

  {
    id: 'val-bucket-minority-stake-hard',
    module: 'valuation',
    tier: 'hard',
    kind: 'bucketing',
    title: 'A stake, not a company',
    prompt:
      'Sort each approach by what it does for this valuation. Read the terms of the stake before you sort: they decide the answer more than the sector data does.',
    scenario:
      'Vantis Group. Private, family-owned industrial distributor, founded 1974, EBITDA of ${ebitda}m. Your client has been offered {stake}% of the ordinary shares by a retiring cousin. No board seat, no observer rights, no information rights beyond the statutory accounts, no tag-along, no drag-along, no registration rights, and the articles give the family holding company a right of first refusal over any transfer. Dividends have been paid in seven of the last ten years, in amounts the board decided each time. There is no sale process; the family has said in print that it will not sell. Three listed distributors of similar size trade at {compLo}-{compHi}x EBITDA, and four whole-company takeovers in the sector cleared at {precLo}-{precHi}x.',
    conventions: [
      'Your client is buying {stake}% of the ordinary shares. There is no path to control and no agreed exit.',
      'Sort by the weight each approach carries for THIS stake, not for a sale of the whole company.',
      'The middle bucket is lenient: an approach that belongs in an outer bucket still earns half credit there.',
      'All multiples quoted are EV / LTM EBITDA.',
      'US private-company practice: a discount for lack of control and a discount for lack of marketability are separate adjustments, applied in that order.',
    ],
    skills: ['val-minority-vs-control', 'val-control-premium', 'val-method-selection', 'val-illiquidity-discount'],
    presentation: { timerSeconds: 330, showBase: false, includeDistractors: true },
    estSeconds: 270,
    // The stake stays a minority with no path to control, and the precedent range stays above the
    // trading range, because the gap between them IS the control premium the exercise is about.
    vars: [
      { id: 'ebitda', label: 'EBITDA', domain: [95, 130, 70, 160] },
      { id: 'stake', label: 'the stake on offer', domain: [12, 15, 9, 18] },
      { id: 'compLo', label: 'bottom of the trading range', domain: [8, 9, 7] },
      { id: 'precLo', label: 'bottom of the precedent range', domain: [11, 13, 12] },
    ],
    derived: [
      { id: 'compHi', label: 'top of the trading range', expr: 'compLo + 1' },
      { id: 'precHi', label: 'top of the precedent range', expr: 'precLo + 1' },
    ],
    buckets: [
      { id: 'lead', label: 'Does the work here' },
      { id: 'support', label: 'Reference point only', lenient: true },
      { id: 'no', label: 'Does not apply to this stake' },
    ],
    items: [
      {
        id: 'comps-minority',
        label: 'The three listed distributors at 8-9x EBITDA',
        bucket: 'lead',
        explain:
          'A quoted share price is what a small, non-controlling, freely tradable stake changes hands at. Two of those three adjectives already describe what your client is buying, which makes this the right starting point. The third is what the discounts below are for.',
      },
      {
        id: 'dlom',
        label: 'A discount for lack of marketability, benchmarked against restricted-stock and pre-IPO studies',
        bucket: 'lead',
        explain:
          'With a right of first refusal, no registration rights and a family that will not sell, the holder has no way out at any price of their choosing. In a stake like this the illiquidity adjustment is usually the largest single number in the analysis, and omitting it prices a locked drawer as though it were a listed share.',
      },
      {
        id: 'recent-transfers',
        label: 'Prices at which the same class of shares changed hands between family members in the last 18 months',
        bucket: 'lead',
        explain:
          "Transactions in the identical security, with identical rights and identical illiquidity, in the same company. Check they were at arm's length and not gifts dressed as sales, and they are the best evidence anyone has.",
      },
      {
        id: 'precedents-control',
        label: 'Precedent transactions: the four sector takeovers at 11-12x',
        bucket: 'support',
        explain:
          'The item most people put in the leading bucket, because the brief smells like M&A. Those buyers were paying for control: the right to change management, set the dividend, refinance, and sell. Your client gets none of it, so 11-12x bounds what the whole business might fetch one day and says almost nothing about the price of 12% of it.',
      },
      {
        id: 'dcf-pro-rata',
        label: 'A DCF of the whole business, then 12% of the resulting equity value',
        bucket: 'support',
        explain:
          "It values cash flows the holder can neither direct nor extract. Twelve per cent of an enterprise DCF is what a controlling shareholder's 12% would be worth; getting from there to a minority stake means the same two discounts, applied to a number that was never observed in a market.",
      },
      {
        id: 'ddm',
        label: 'A dividend discount model on the dividends actually paid',
        bucket: 'support',
        explain:
          'Closest in spirit to what the holder actually receives, which is why it belongs on the page. It is only a reference point because the board sets the dividend at its discretion and skipped three of the last ten years: the cash flow being discounted can be switched off by people who are not your client.',
      },
      {
        id: 'premiums-paid',
        label: 'Premiums paid analysis on the sector takeovers',
        bucket: 'no',
        explain:
          'A premium is what somebody pays to take control of a company. Nobody is taking control of anything here, and there is no undisturbed price to pay a premium over because the shares are not quoted.',
      },
      {
        id: 'control-premium-add',
        label: 'A 30% control premium applied on top of the value implied by the listed comps',
        bucket: 'no',
        explain:
          'The adjustment runs the other way. Comps are already a minority, marketable price, so what this stake needs from there is a discount for illiquidity, not a premium for control it will never have. Adding a control premium to a minority stake is the single most expensive error available in this exercise.',
      },
      {
        id: 'accretion',
        label: 'Accretion / dilution analysis of the purchase',
        bucket: 'no',
        explain:
          'A 12% holding is not consolidated. There is no EBITDA to add, no revenue line to combine and no share issuance to model: the client books an investment and, at this level of influence and information, probably carries it at fair value.',
      },
      {
        id: 'synergies',
        label: "A synergy analysis of what Vantis could save inside the client's own distribution network",
        bucket: 'no',
        explain:
          'Synergies require the ability to combine two businesses. With 12% of the shares, no board seat and a family that controls the rest, your client cannot move a single depot, let alone close one.',
      },
    ],
  },

  {
    id: 'val-numeric-calendarisation-hard',
    module: 'valuation',
    tier: 'medium',
    kind: 'numeric',
    title: 'Calendarise, then compare',
    prompt:
      'Meridian Instruments has a March year end and the peer set you are comparing it against is quoted on calendar years. Put Meridian on the same basis and work out where it trades against the peers.',
    conventions: [
      'Calendarise by weighting fiscal years by the number of months of each that fall inside the calendar year. EBITDA is assumed to accrue evenly through the year.',
      'Enterprise value = market capitalisation + total debt - cash.',
      'Peer set convention: operating lease liabilities are EXCLUDED from enterprise value and rent stays in EBITDA. Follow the peers or the comparison is not one.',
      'The share count given is already diluted.',
      'A positive answer means Meridian trades BELOW the peer median. Measure the gap against the peer median, not against Meridian.',
    ],
    skills: ['val-calendarisation', 'val-implied-multiple', 'val-discount-premium', 'val-lease-convention'],
    presentation: { timerSeconds: 300 },
    estSeconds: 240,
    // The peer multiple is derived as Meridian's own multiple plus a gap in turns, rather than
    // drawn independently. That is not a shortcut: with both sides free, some combinations put
    // Meridian ABOVE the peers, and the exercise would be asking for a discount while its answer
    // key held a premium. Fixing the gap in turns instead keeps the answer a discount at every
    // value while still making it a different number each time, and the learner does exactly the
    // same work — calendarise, build the enterprise value, divide, compare.
    // FY2026 always sits above FY2025 too, so the growth the calendarisation is supposed to pick
    // up is always there to be picked up.
    vars: [
      { id: 'price', label: 'share price', domain: [12.7, 13.4, 11.8, 14.2] },
      { id: 'fy25', label: 'FY2025 EBITDA', domain: [200, 220, 180, 240] },
      { id: 'growth', label: 'EBITDA growth into FY2026', domain: [30, 45, 20, 60] },
      // Not smaller than a turn. The answer is the gap over the peer multiple, and the near miss
      // that divides by Meridian instead is the gap over Meridian: the two differ by roughly
      // gap-squared over the product of the multiples, so at 0.6 turns against a 15x multiple they
      // land 0.15 of a point apart and the tolerance can no longer tell them apart.
      { id: 'gapTurns', label: 'the gap to the peer median, in turns', domain: [1, 1.5, 2, 2.5] },
      { id: 'shares', label: 'diluted shares', domain: [150, 180, 120] },
      { id: 'debt', label: 'total debt', domain: [450, 500, 380, 600] },
      { id: 'cash', label: 'cash', domain: [150, 200, 120, 250] },
    ],
    derived: [
      { id: 'lease', label: 'operating lease liability', expr: '400' },
      // Derived, not drawn. Two independent domains let FY2026 fall BELOW FY2025 on some
      // combinations, which inverts the growth the calendarisation exists to pick up — and at the
      // crossover the evenly split year equals the correctly weighted one, so the near miss
      // written to diagnose "you split it six and six" lands exactly on the right answer.
      { id: 'fy26', label: 'FY2026E EBITDA', expr: 'round(fy25 * (1 + growth / 100))' },
      { id: 'cy25', label: 'calendarised CY2025E EBITDA', expr: '0.25 * fy25 + 0.75 * fy26' },
      { id: 'cy25Even', label: 'the same, split evenly', expr: '0.5 * fy25 + 0.5 * fy26' },
      { id: 'ev', label: 'enterprise value', expr: 'price * shares + debt - cash' },
      { id: 'evLease', label: 'enterprise value including leases', expr: 'ev + lease' },
      { id: 'mult', label: 'EV / calendarised EBITDA', expr: 'ev / cy25' },
      { id: 'multReported', label: 'EV / FY2025 as reported', expr: 'ev / fy25' },
      { id: 'multFy26', label: 'EV / FY2026E', expr: 'ev / fy26' },
      { id: 'multEven', label: 'EV / the evenly split year', expr: 'ev / cy25Even' },
      { id: 'multLease', label: 'the multiple with leases in', expr: 'evLease / cy25' },
      { id: 'peerMult', label: 'peer median multiple', expr: 'round(mult + gapTurns, 1)' },
      { id: 'discount', label: 'discount to the peer median', expr: '(peerMult - mult) / peerMult * 100' },
    ],
    givens: [
      { label: 'Fiscal year end', value: '31 March' },
      { label: 'Share price', value: '${price|2}' },
      { label: 'Diluted shares outstanding', value: '{shares|1}m' },
      { label: 'Total debt', value: '${debt}m' },
      { label: 'Cash and equivalents', value: '${cash}m' },
      { label: 'Operating lease liability', value: '${lease}m' },
      { label: 'FY2025 EBITDA (year ended 31 March 2025, reported)', value: '${fy25}m' },
      { label: 'FY2026E EBITDA (year ending 31 March 2026)', value: '${fy26}m' },
      { label: 'Peer median CY2025E EV / EBITDA', value: '{peerMult|1}x' },
    ],
    question: "Meridian's discount to the peer median on a calendarised CY2025E basis, in percent",
    answer: 10,
    answerExpr: 'discount',
    tolerance: 0.2,
    unit: '%',
    nearMisses: [
      {
        value: 11.11,
        valueExpr: '(peerMult - mult) / mult * 100',
        note: 'You divided the {gapTurns|1}-turn gap by Meridian at {mult|1}x rather than by the {peerMult|1}x you are comparing it to. A discount is always measured against the benchmark.',
      },
      {
        value: -10.25,
        valueExpr: '(peerMult - multReported) / peerMult * 100',
        note: 'You compared the peer calendar year against Meridian as reported, giving {multReported|1}x and an apparent premium. Two companies with different year ends are not comparable until one of them is restated; that restatement is the whole exercise.',
      },
      {
        value: 15.19,
        valueExpr: '(peerMult - multFy26) / peerMult * 100',
        note: 'You used the FY2026 estimate alone, giving {multFy26|1}x. Calendar 2025 is three months of the year to March 2025 and nine months of the year to March 2026, not twelve months of the later year.',
      },
      {
        value: 4.13,
        valueExpr: '(peerMult - multEven) / peerMult * 100',
        note: 'You split the two fiscal years evenly, giving ${cy25Even}m. The weights come from how many months of each fiscal year fall inside calendar 2025: three and nine, not six and six.',
      },
      {
        value: -6.33,
        valueExpr: '(peerMult - multLease) / peerMult * 100',
        note: 'You put the ${lease}m lease liability into enterprise value, giving {multLease|1}x. The convention is only wrong if it differs from the peers, and here the peers leave leases out and rent in EBITDA. Consistency across the set beats correctness in the abstract.',
      },
    ],
    working: [
      'Calendar 2025 overlaps FY2025 (April 2024 to March 2025) for three months and FY2026 (April 2025 to March 2026) for nine.',
      'Calendarised CY2025E EBITDA = 0.25 x {fy25} + 0.75 x {fy26} = {0.25 * fy25} + {0.75 * fy26} = ${cy25}m.',
      'Enterprise value = {price|2} x {shares|1} + {debt} - {cash} = {price * shares} + {debt - cash} = ${ev}m. The lease liability stays out, matching the peers.',
      'EV / CY2025E EBITDA = {ev} / {cy25} = {mult|1}x.',
      'Discount to the peer median = ({peerMult|1} - {mult|1}) / {peerMult|1} = {discount|1}%.',
      'Whether that discount is deserved is the next question, and it is the one the interviewer actually wants: growth, margin, mix, governance, or a genuine mispricing.',
    ],
  },
];
