// Equity value and enterprise value — hard tier.
//
// Three things separate a candidate who has memorised the bridge from one who can build it:
// deciding a convertible's treatment from its strike rather than being told, running the treasury
// method across a ladder of tranches where only some are in the money, and knowing which awkward
// balance-sheet items belong in the bridge and which are there to be left alone.
//
// All three hide the opening values and carry a clock. The conventions pin the rules of the game
// (how a convertible is treated once you have decided which side of the strike it is on, what
// EBITDA consolidates) without telling the learner which branch to take.
//
// RANDOMISING THESE IS NOT THE SAME JOB AS RANDOMISING THE EASY ONES. Two of the three turn on a
// comparison rather than on an amount: a convertible is if-converted or not depending on where its
// conversion price sits against the share price, and an option tranche counts or is thrown away
// depending on where its strike sits. Move those two numbers independently and some variant flips
// the branch, which does not make the exercise harder — it makes it a different exercise with the
// old answer key attached. So the domains below keep the share price strictly between the two
// conversion prices, and the ladder's strikes are pinned to the price rather than drawn beside it.

import type { Exercise } from '../lib/schema';

export const EV_EQV_HARD: Exercise[] = [
  // ------------------------------------------------------------ convertibles
  {
    id: 'evq-convertible-two-bonds-hard',
    module: 'ev-eqv',
    tier: 'hard',
    kind: 'numeric',
    title: 'Two convertible bonds, one decision each',
    prompt:
      'Sabre Industrials has two convertible bonds outstanding and a term loan. Work out enterprise value. The two bonds do not get the same treatment, and deciding which gets which is the exercise.',
    conventions: [
      'A convertible that is in the money is treated on an if-converted basis: the shares it would issue join the diluted count, and the instrument itself leaves the debt side of the bridge. A convertible that is out of the money is treated as ordinary debt and issues nothing.',
      'A convertible is in the money when the share price is above its conversion price.',
      'Shares on conversion = face value / conversion price. Ignore accrued interest and any make-whole payment.',
      'Debt enters the bridge at face value, not at balance-sheet carrying value and not at market price.',
      'There are no options, warrants or RSUs outstanding.',
      'Answer in $ millions.',
    ],
    skills: ['evq-convertibles', 'evq-if-converted', 'evq-diluted-shares', 'evq-bridge'],
    estSeconds: 300,
    presentation: { showBase: false, timerSeconds: 300, includeDistractors: true },
    // The share price is the only figure that could change which bond gets which treatment, so it
    // is fenced in: every value is above bond A's conversion price and below bond B's, which are
    // both held still. A is therefore in the money on every variant and B is out of it on every
    // variant, and the decision the exercise is testing stays the decision it was written to test.
    // The band is narrower than it first needs to be for a second reason. The first two near misses
    // sit below the answer by sharesA x (price - 25) and by sharesB x (50 - price) respectively; let
    // the price fall towards the middle and those two gaps converge, at which point one diagnosis
    // fires on the other's mistake. Keeping the price in the upper part of the range holds them
    // apart by a multiple, not by a rounding.
    // The two face values are declared as a share count times a conversion price rather than as a
    // dollar amount, so the shares a bond converts into never come out as a recurring decimal.
    vars: [
      { id: 'price', label: 'share price', domain: [40, 38, 42, 36] },
      { id: 'sharesA', label: 'shares bond A converts into', domain: [20, 16, 24, 30] },
      { id: 'sharesB', label: 'shares bond B would convert into', domain: [6, 5, 8, 10] },
      { id: 'termLoan', label: 'senior term loan', domain: [250, 200, 350, 400] },
      { id: 'cash', label: 'cash', domain: [150, 100, 200, 250] },
      { id: 'basic', label: 'basic shares', domain: [100] },
      { id: 'convA', label: 'bond A conversion price', domain: [25] },
      { id: 'convB', label: 'bond B conversion price', domain: [50] },
      { id: 'discA', label: 'bond A equity component', domain: [28] },
      { id: 'discB', label: 'bond B equity component', domain: [16] },
    ],
    derived: [
      { id: 'faceA', label: 'bond A face value', expr: 'sharesA * convA' },
      { id: 'faceB', label: 'bond B face value', expr: 'sharesB * convB' },
      { id: 'carryingA', label: 'bond A carrying value', expr: 'faceA - discA' },
      { id: 'carryingB', label: 'bond B carrying value', expr: 'faceB - discB' },
      { id: 'diluted', label: 'diluted shares', expr: 'basic + sharesA' },
      { id: 'eqv', label: 'equity value', expr: 'diluted * price' },
      { id: 'netDebt', label: 'net debt', expr: 'faceB + termLoan - cash' },
      { id: 'ev', label: 'enterprise value', expr: 'eqv + netDebt' },
    ],
    givens: [
      { label: 'Share price', value: '${price|2}' },
      { label: 'Basic shares outstanding', value: '{basic|1}m' },
      { label: 'Convertible bond A — face value', value: '${faceA}m' },
      { label: 'Convertible bond A — conversion price', value: '${convA|2}' },
      { label: 'Convertible bond A — balance-sheet carrying value', value: '${carryingA}m' },
      { label: 'Convertible bond B — face value', value: '${faceB}m' },
      { label: 'Convertible bond B — conversion price', value: '${convB|2}' },
      { label: 'Convertible bond B — balance-sheet carrying value', value: '${carryingB}m' },
      { label: 'Senior term loan (face = carrying value)', value: '${termLoan}m' },
      { label: 'Cash and cash equivalents', value: '${cash}m' },
    ],
    question: 'Enterprise value',
    answer: 5200,
    answerExpr: 'ev',
    tolerance: 5,
    unit: '$m',
    nearMisses: [
      {
        value: 4900,
        valueExpr: 'basic * price + faceA + faceB + termLoan - cash',
        note: 'You treated both bonds as straight debt and never diluted the share count. Bond A converts at ${convA|2} against a ${price|2} share price: every holder converts, so those {sharesA|1}m shares exist and the ${faceA}m of debt does not.',
      },
      {
        value: 5140,
        valueExpr: '(basic + sharesA + sharesB) * price + termLoan - cash',
        note: 'You if-converted both bonds. Bond B converts at ${convB|2} into a ${price|2} stock — nobody pays ${convB|2} for something worth ${price|2}, so it issues no shares and stays in the bridge as ${faceB}m of debt.',
      },
      {
        value: 5700,
        valueExpr: 'eqv + faceA + faceB + termLoan - cash',
        note: 'You double-counted bond A: {sharesA|1}m new shares in the equity value AND its ${faceA}m face in the debt. If-converted means the bond becomes equity. It can be one or the other, never both.',
      },
      {
        value: 4700,
        valueExpr: 'eqv - faceA + faceB + termLoan - cash',
        note: 'You ran the treasury stock method over bond A: {sharesA|1}m shares less ${faceA}m / ${price|2} of buyback. The treasury method is for options, where the company receives cash it can spend. A convertible pays nothing in; the bondholder hands back the bond, which is why the debt comes out of the bridge instead.',
      },
      {
        value: 5350,
        valueExpr: 'ev + cash',
        note: 'The arithmetic on the converts is right, but you never netted the ${cash}m of cash off.',
      },
      {
        value: 5184,
        valueExpr: 'eqv + carryingB + termLoan - cash',
        note: 'You used carrying values rather than face. The ${carryingA}m and ${carryingB}m are split-accounting book values: a convertible is carved into a debt host and an equity component, so it sits below par on the balance sheet from day one. A buyer repays face.',
      },
    ],
    working: [
      'Bond A: conversion price ${convA|2} against a ${price|2} share price, so it is in the money and converts.',
      'Shares from A = {faceA} / {convA} = {sharesA|1}m. Diluted shares = {basic|1} + {sharesA|1} = {diluted|1}m.',
      'Equity value = {diluted|1} x ${price|2} = ${eqv}m.',
      'Bond B: conversion price ${convB|2} against a ${price|2} share price, so it is out of the money. It stays debt at ${faceB}m face.',
      'Net debt = {faceB} (bond B) + {termLoan} (term loan) - {cash} (cash) = ${netDebt}m. Bond A is not in this list: it became equity.',
      'Enterprise value = {eqv} + {netDebt} = ${ev}m.',
    ],
  },

  // ------------------------------------------------- laddered options and RSUs
  {
    id: 'evq-diluted-ladder-rsu-hard',
    module: 'ev-eqv',
    tier: 'hard',
    kind: 'numeric',
    title: 'A ladder of option tranches, and the RSUs',
    prompt:
      'Kestrel Software discloses its equity awards by tranche. The share price sits partway up the ladder. Work out the fully diluted share count.',
    conventions: [
      'Options are handled by the treasury stock method: the company receives the exercise proceeds and spends all of them buying its own shares back in the market at the current share price.',
      'An option is in the money when the share price is above its exercise price. Options that are not in the money are excluded from the count altogether.',
      'Assume every option tranche is fully vested and exercisable.',
      'Assume every RSU vests. RSUs carry no exercise price, so there are no proceeds for the company to reinvest.',
      'Shares outstanding are stated net of shares held in treasury.',
      'Answer in millions of shares, to two decimal places.',
    ],
    skills: ['evq-diluted-shares', 'evq-treasury-stock', 'evq-rsus', 'evq-traps'],
    estSeconds: 240,
    presentation: { showBase: false, timerSeconds: 240, includeDistractors: true },
    // The whole exercise is where the share price sits on the ladder, so the ladder is pinned to
    // the price rather than drawn beside it: two tranches struck at fixed fractions of it, one
    // struck exactly AT it, and one struck above it. That is what survives a change of price. Draw
    // four strikes independently and some variant puts the price at the top of the ladder, where
    // every tranche is in the money, nothing is excluded and the thing being tested has gone.
    // The tranche sizes stay even so that a five-eighths repurchase lands on two decimals, which
    // the answer has to, since the answer IS the share count.
    //
    // The three domains below are also trimmed to keep the six diagnostics apart, which on a
    // question answered in shares rather than dollars is a tighter fit than it looks. Two pairs
    // want watching: running the method over the out-of-the-money tranche and repurchasing at the
    // exercise price both land BELOW the answer, and so does dropping the RSUs; and adding the
    // at-the-money tranche and adding the treasury shares both land above it. Hence no RSU count
    // that a net option count can reach, and no treasury holding that equals a tranche.
    vars: [
      { id: 'price', label: 'share price', domain: [32, 40, 24, 36] },
      { id: 't1', label: 'tranche 1', domain: [6, 4, 8, 12] },
      { id: 't2', label: 'tranche 2', domain: [4, 3, 6, 5] },
      { id: 't3', label: 'tranche 3, struck at the money', domain: [5, 4, 6, 8] },
      { id: 't4', label: 'tranche 4, out of the money', domain: [3, 2, 4] },
      { id: 'rsu', label: 'restricted stock units', domain: [2.5, 3, 2, 1.75] },
      { id: 'basic', label: 'basic shares', domain: [80, 60, 100, 120] },
      { id: 'treasury', label: 'shares held in treasury', domain: [2, 1.5, 2.5, 3.5] },
    ],
    derived: [
      { id: 't1Strike', label: 'tranche 1 exercise price', expr: 'price * 3 / 8' },
      { id: 't2Strike', label: 'tranche 2 exercise price', expr: 'price * 3 / 4' },
      { id: 't3Strike', label: 'tranche 3 exercise price', expr: 'price' },
      // Struck above the price on every variant, so tranche 4 is out of the money whatever the
      // price does. It is the fourth rung of the same ladder, not a loose number drawn beside it.
      { id: 't4Strike', label: 'tranche 4 exercise price', expr: 'price + 13' },
      { id: 't1Proceeds', label: 'tranche 1 proceeds', expr: 't1 * t1Strike' },
      { id: 't2Proceeds', label: 'tranche 2 proceeds', expr: 't2 * t2Strike' },
      { id: 't3Proceeds', label: 'tranche 3 proceeds', expr: 't3 * t3Strike' },
      { id: 't1Buyback', label: 'shares repurchased, tranche 1', expr: 't1Proceeds / price' },
      { id: 't2Buyback', label: 'shares repurchased, tranche 2', expr: 't2Proceeds / price' },
      { id: 't4Buyback', label: 'the buyback tranche 4 would imply', expr: 't4 * t4Strike / price' },
      { id: 'net1', label: 'net new shares, tranche 1', expr: 't1 - t1Buyback' },
      { id: 'net2', label: 'net new shares, tranche 2', expr: 't2 - t2Buyback' },
      { id: 'diluted', label: 'fully diluted shares', expr: 'basic + net1 + net2 + rsu' },
    ],
    givens: [
      { label: 'Share price', value: '${price|2}' },
      { label: 'Basic shares outstanding', value: '{basic|1}m' },
      { label: 'Options — tranche 1', value: '{t1|1}m at ${t1Strike|2}' },
      { label: 'Options — tranche 2', value: '{t2|1}m at ${t2Strike|2}' },
      { label: 'Options — tranche 3', value: '{t3|1}m at ${t3Strike|2}' },
      { label: 'Options — tranche 4', value: '{t4|1}m at ${t4Strike|2}' },
      { label: 'Restricted stock units outstanding', value: '{rsu|1}m' },
      { label: 'Shares held in treasury', value: '{treasury|1}m' },
    ],
    question: 'Fully diluted share count',
    answer: 87.25,
    answerExpr: 'diluted',
    tolerance: 0.05,
    unit: 'm shares',
    nearMisses: [
      {
        value: 100.5,
        valueExpr: 'basic + t1 + t2 + t3 + t4 + rsu',
        note: 'You added all {t1 + t2 + t3 + t4|1}m options gross. The treasury method exists because the holder pays to exercise: that cash buys shares back, so the net new share count is always smaller than the tranche.',
      },
      {
        value: 86.03,
        valueExpr: 'diluted + t4 - t4Buyback',
        note: 'You ran the treasury method over the ${t4Strike|2} tranche too. Out of the money, the formula returns negative dilution — {t4|1}m of shares against a {t4Buyback|2}m repurchase — which would mean issuing options makes a company more valuable. Anti-dilutive tranches are dropped, not netted.',
      },
      {
        value: 84.75,
        valueExpr: 'diluted - rsu',
        note: 'You left the {rsu|1}m RSUs out. Having no exercise price is not a reason to exclude them — it is the reason all {rsu|1}m count. There are no proceeds, so there is no buyback to offset them.',
      },
      {
        value: 92.25,
        valueExpr: 'diluted + t3',
        note: 'You added the ${price|2} tranche gross. At exactly the money it makes no difference whether you exclude it or run the method on it: {t3|1}m x ${price|2} buys back exactly {t3|1}m shares, so it contributes zero either way. What it never contributes is {t3|1}m.',
      },
      {
        value: 82.5,
        valueExpr: 'basic + rsu',
        note: 'You bought the shares back at the exercise price instead of the market price. Do that and every tranche self-cancels and the method returns nothing, which should have been the tell. The company repurchases in the market, at ${price|2}.',
      },
      {
        value: 89.25,
        valueExpr: 'diluted + treasury',
        note: 'You added the {treasury|1}m treasury shares. Shares the company holds in its own name are not outstanding and nobody pays for them in an acquisition. The {basic|1}m is already net of them.',
      },
    ],
    working: [
      'Tranche 1, in the money: proceeds {t1|1} x ${t1Strike|2} = ${t1Proceeds}m, buys back {t1Proceeds} / {price} = {t1Buyback|2}m, net {net1|2}m.',
      'Tranche 2, in the money: proceeds {t2|1} x ${t2Strike|2} = ${t2Proceeds}m, buys back {t2Proceeds} / {price} = {t2Buyback|2}m, net {net2|2}m.',
      'Tranche 3, struck at the money: proceeds {t3|1} x ${price|2} = ${t3Proceeds}m buys back exactly {t3|1}m, net 0.',
      'Tranche 4, struck at ${t4Strike|2} above a ${price|2} price: out of the money, excluded.',
      'RSUs: no exercise price, so no proceeds and no buyback. All {rsu|1}m count.',
      'Diluted shares = {basic|2} + {net1|2} + {net2|2} + 0 + {rsu|2} = {diluted|2}m.',
    ],
  },

  // -------------------------------------------------------- the awkward bridge
  {
    id: 'evq-bridge-awkward-items-hard',
    module: 'ev-eqv',
    tier: 'hard',
    kind: 'bridge',
    title: 'The bridge, with the items nobody rehearses',
    prompt:
      'Meridian Group trades at an equity value of ${eqv}m. Build the bridge to enterprise value from the items below. Several of them have no business being in it, and the count is not given.',
    conventions: [
      'Enterprise value here is the value of the whole operating business, to be paired with consolidated EBITDA. That EBITDA consolidates 100% of the majority-owned subsidiary and none of the associate.',
      'Debt-like claims enter at face or balance-sheet value, not at market price.',
      'The pension deficit is taken gross, as the balance-sheet shortfall. Ignore deferred tax on it.',
      'Non-controlling interests are measured at their carrying value.',
      'Only assets that are genuinely surplus to running the business are netted off.',
      'Leases are immaterial here and are outside the scope of this bridge.',
    ],
    skills: ['evq-bridge', 'evq-nci', 'evq-associates', 'evq-pension', 'evq-cash-netting', 'evq-traps'],
    estSeconds: 360,
    presentation: { showBase: false, timerSeconds: 360, includeDistractors: true },
    // One constraint does real work here: the plan assets stay below the benefit obligation on every
    // variant, so the pension stays UNFUNDED. Let the assets overtake the obligation and the item
    // becomes a surplus, which is not a debt-like claim at all — the chip would have to move to the
    // other side of the bridge and the authored role would be wrong. Everything else is free: the
    // notes are quoted against face at any face, and payables are operating at any size. The market
    // quote on the notes is held at a fixed number of cents so the tempting wrong answer stays a
    // whole number of millions.
    vars: [
      { id: 'eqv', label: 'equity value', domain: [3200, 2600, 4000, 4800] },
      { id: 'ltDebt', label: 'senior notes, face', domain: [1400, 1100, 1800, 2000] },
      { id: 'pensionAssets', label: 'pension plan assets', domain: [680, 740, 620, 800] },
      { id: 'cash', label: 'cash', domain: [310, 250, 400, 450] },
      { id: 'nci', label: 'non-controlling interest', domain: [180, 120, 240, 300] },
      { id: 'associates', label: 'investment in associates', domain: [240, 180, 300, 360] },
      { id: 'stDebt', label: 'short-term borrowings', domain: [150] },
      { id: 'pensionObligation', label: 'benefit obligation', domain: [940] },
      { id: 'quote', label: 'market quote on the notes, cents', domain: [92] },
      { id: 'securities', label: 'marketable securities', domain: [120] },
      { id: 'restricted', label: 'restricted cash', domain: [95] },
      { id: 'payables', label: 'payables and accruals', domain: [290] },
      { id: 'revolverUndrawn', label: 'undrawn revolver', domain: [400] },
      { id: 'goodwill', label: 'goodwill', domain: [900] },
    ],
    derived: [
      { id: 'pensionDeficit', label: 'pension deficit', expr: 'pensionObligation - pensionAssets' },
      { id: 'ltMarket', label: 'notes at market', expr: 'ltDebt * quote / 100' },
      { id: 'ev', label: 'enterprise value', expr: 'eqv + stDebt + ltDebt + pensionDeficit + nci - cash - securities - associates' },
    ],
    startLabel: 'Equity value',
    startValue: 3200,
    startValueExpr: 'eqv',
    targetLabel: 'Enterprise value',
    targetValue: 4520,
    requireTotal: true,
    tolerance: 1,
    items: [
      {
        id: 'st-debt',
        label: 'Short-term borrowings and current portion of long-term debt',
        role: 'add',
        amount: 150,
        amountExpr: 'stDebt',
        detail: 'Due within twelve months.',
        explain: 'Debt is debt whatever its maturity. A buyer of the business has to repay it or refinance it, so it belongs in the bridge at full value.',
      },
      {
        id: 'lt-debt',
        label: 'Senior notes, face value',
        role: 'add',
        amount: 1400,
        amountExpr: 'ltDebt',
        detail: 'Quoted in the market at {quote} cents on the dollar.',
        explain: 'Add the ${ltDebt}m face. The {quote} quote is there to tempt you into ${ltMarket}m: the notes are repayable at par, and a bridge built on market prices would move every time credit spreads did.',
      },
      {
        id: 'pension',
        label: 'Unfunded pension obligation',
        role: 'add',
        amount: 260,
        amountExpr: 'pensionDeficit',
        detail: 'Benefit obligation of ${pensionObligation}m against plan assets of ${pensionAssets}m.',
        explain: 'The deficit of ${pensionDeficit}m is a claim on the business that has to be funded out of future cash, which makes it debt-like. Only the shortfall counts: the ${pensionObligation}m gross obligation is already met to the extent of the ${pensionAssets}m of assets sitting against it.',
      },
      {
        id: 'nci',
        label: 'Non-controlling interest',
        role: 'add',
        amount: 180,
        amountExpr: 'nci',
        detail: 'A 70%-owned distribution subsidiary, consolidated in full.',
        explain: 'The EBITDA in the denominator is 100% of that subsidiary, but the equity value only buys 70% of it. Adding the NCI puts the other 30% into the numerator so the two halves of the multiple describe the same asset.',
      },
      {
        id: 'cash',
        label: 'Cash and cash equivalents',
        role: 'subtract',
        amount: 310,
        amountExpr: 'cash',
        detail: 'Held at group treasury, unencumbered.',
        explain: 'A buyer paying for the equity gets the cash back on day one, so it comes off the price of the operating business.',
      },
      {
        id: 'securities',
        label: 'Short-term marketable securities',
        role: 'subtract',
        amount: 120,
        amountExpr: 'securities',
        detail: 'Treasury bills, saleable on demand.',
        explain: 'Cash in a different wrapper. It earns nothing that shows up in EBITDA and can be liquidated without touching the business, so it is netted off exactly like cash.',
      },
      {
        id: 'associates',
        label: 'Investment in associates, equity method',
        role: 'subtract',
        amount: 240,
        amountExpr: 'associates',
        detail: 'A 30% stake carried at book; its earnings arrive as a single line below EBIT.',
        explain: 'None of the associate is in consolidated EBITDA, so none of it should be in the enterprise value that EBITDA supports. The stake is real value the shareholders own, which is why it is subtracted rather than ignored.',
      },
      {
        id: 'restricted-cash',
        label: 'Restricted cash',
        role: 'out',
        amount: 95,
        amountExpr: 'restricted',
        detail: 'Escrowed to collateralise a surety bond; released only when the case settles.',
        explain: 'Leave it out. It is called cash, but it cannot be swept, distributed or used to repay debt, so it is not surplus to the business. Netting it off flatters enterprise value by ${restricted}m for money nobody can touch.',
      },
      {
        id: 'payables',
        label: 'Accounts payable and accrued liabilities',
        role: 'out',
        amount: 290,
        amountExpr: 'payables',
        detail: 'Ordinary trade terms, 45 days.',
        explain: 'Leave it out. Payables are operating working capital, funded and refreshed by trading, and their cost already sits inside EBITDA. Only financing claims cross the bridge.',
      },
      {
        id: 'revolver-undrawn',
        label: 'Undrawn revolver capacity',
        role: 'out',
        amount: 400,
        amountExpr: 'revolverUndrawn',
        detail: 'A ${revolverUndrawn}m committed facility, none of it drawn.',
        explain: 'Leave it out. An unused facility is an option to borrow, not borrowing. Nothing is owed and no interest is being paid. Only drawn balances are debt, and the drawn balances here are already in the two debt lines above.',
      },
      {
        id: 'goodwill',
        label: 'Goodwill',
        role: 'out',
        amount: 900,
        amountExpr: 'goodwill',
        detail: 'Arose on the acquisition of the distribution subsidiary.',
        explain: 'Leave it out. Goodwill is an accounting residue from a past purchase, already inside the consolidated business the enterprise value is measuring. Subtracting it would deduct the value of the operations from itself.',
      },
    ],
  },
] satisfies Exercise[];
