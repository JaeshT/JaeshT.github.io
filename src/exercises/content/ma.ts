// M&A: what the deal does to the acquirer's own numbers.
//
// The module is built around one question asked at rising resolution. Easy asks which lines move.
// Medium asks by how much, and puts the accretion calculation in front of you twice — once as a
// bridge you assemble, once as a number you type. Hard asks the two questions a candidate is
// actually judged on: what the balance sheet looks like the morning after close, and how much
// synergy the deal needs before it stops costing the acquirer's shareholders money.
//
// Every exercise here varies its figures from the day it was written. That is not decoration: the
// accretion calculation in particular is one a candidate is expected to run cold, on numbers they
// have never seen, and an exercise that always uses the same ones trains the wrong thing.
//
// Two conventions are pinned everywhere because both are genuinely contested and both change the
// answer: goodwill is not amortised, and transaction fees are expensed at close and excluded from
// pro forma earnings.

import type { Exercise } from '../lib/schema';

export const MA: Exercise[] = [
  // ================================================================== easy
  {
    id: 'ma-board-all-cash-effects-easy',
    module: 'ma',
    tier: 'easy',
    kind: 'ternary-board',
    title: 'An all-cash deal, funded with debt',
    prompt:
      'Ardenne Group is buying Halloway Systems for ${price}m in cash, funded entirely with new debt at {rate}%. Halloway has book equity of ${tgtEquity}m, revenue of ${tgtRevenue}m and net income of ${tgtNi}m, and it runs at a lower EBITDA margin than Ardenne. Mark which way each line moves against Ardenne standalone.',
    conventions: [
      'Pro forma means the first full year after close, comparing the combined company against Ardenne on its own.',
      'The tax rate is {taxPct}% for both companies.',
      'Ardenne has no debt today and Halloway has none either, so all the interest below is new.',
      'No assets are written up at close, so the deal creates no deferred tax liability.',
      'The dividend per share is held at its current level.',
    ],
    skills: ['ma-consolidation', 'ma-goodwill', 'ma-funding-mix', 'ma-accretion'],
    estSeconds: 150,
    presentation: { showBase: true },
    // Two relationships are pinned rather than drawn, because two authored directions depend on
    // them: the target's earnings are set as a multiple of the after-tax interest, so the deal
    // always adds to net income; and its book equity as a fraction of the price, so there is always
    // goodwill rather than a bargain purchase. Both are the kind of thing that is true of most
    // deals and not all, and a variant where they failed would be marking a learner against a lie.
    vars: [
      { id: 'price', label: 'purchase price', domain: [800, 1000, 620, 1400] },
      { id: 'rate', label: 'interest rate on the new debt', domain: [6, 7, 5, 8] },
      { id: 'niCover', label: 'target earnings over the after-tax interest', domain: [1.6, 2, 1.35, 2.4] },
      { id: 'bookRatio', label: 'book equity as a percentage of the price', domain: [37.5, 30, 45] },
      { id: 'tgtRevenue', label: "the target's revenue", domain: [450, 600, 320, 900] },
    ],
    derived: [
      { id: 'taxPct', label: 'tax rate, in percent', expr: '25' },
      { id: 'interest', label: 'annual interest', expr: 'price * rate / 100' },
      { id: 'interestAfterTax', label: 'interest after tax', expr: 'interest * 0.75' },
      { id: 'tgtNi', label: "the target's net income", expr: 'round(interestAfterTax * niCover)' },
      { id: 'tgtEquity', label: "the target's book equity", expr: 'round(price * bookRatio / 100)' },
      { id: 'goodwill', label: 'goodwill created', expr: 'price - tgtEquity' },
    ],
    rows: [
      {
        id: 'goodwill', label: 'Goodwill', direction: 'up',
        explain:
          'Ardenne pays ${price}m for ${tgtEquity}m of book equity. The ${goodwill}m difference does not disappear: it is capitalised as goodwill, which is the accounting record of having paid more than the assets are carried at.',
      },
      {
        id: 'cash', label: 'Cash and equivalents', direction: 'none',
        explain:
          'The deal is funded with new debt, not out of the balance sheet. Asking how a deal was paid for before asking what it does is the habit that makes the rest of this board easy.',
      },
      {
        id: 'debt', label: 'Total debt', direction: 'up',
        explain: 'All ${price}m of it, since none of the price came from cash and none from shares.',
      },
      {
        id: 'interest-expense', label: 'Interest expense', direction: 'up',
        explain: '${interest}m a year at {rate}%, or ${interestAfterTax}m once the deduction is allowed for.',
      },
      {
        id: 'shares', label: 'Diluted share count', direction: 'none',
        explain:
          'No shares were issued. This single fact is why all-cash deals are accretive so much more often than all-stock ones: the earnings arrive and nobody new turns up to share them.',
      },
      {
        id: 'revenue', label: 'Consolidated revenue', direction: 'up',
        explain: "Halloway's ${tgtRevenue}m is consolidated in full from the day of close. Ardenne owns all of it, so all of it appears.",
      },
      {
        id: 'ebitda-margin', label: 'Pro forma EBITDA margin', direction: 'down',
        explain:
          'The combined margin is a weighted average of the two, and Halloway sits below Ardenne. Buying revenue at a lower margin dilutes the ratio even while it adds to profit — which is why a margin-dilutive deal is not automatically a bad one.',
      },
      {
        id: 'dtl', label: 'Deferred tax liability', direction: 'none',
        explain:
          'A deferred tax liability arises when assets are written up above their tax basis, because the book depreciation on the write-up is never deductible. The conventions here write nothing up, so there is none.',
      },
      {
        id: 'net-income', label: 'Pro forma net income', direction: 'up',
        explain:
          'Halloway brings ${tgtNi}m and the debt costs ${interestAfterTax}m after tax. The earnings more than cover the financing, so the bottom line rises. Reverse those two numbers and the same deal destroys earnings.',
      },
      {
        id: 'coverage', label: 'Interest coverage (EBITDA / interest)', direction: 'down',
        explain:
          'Ardenne had no interest to cover and now has ${interest}m of it. Coverage falls from unbounded to a finite number, which is the ratio a lender looks at first and the one a purely accretive deal can still ruin.',
      },
      {
        id: 'equity', label: "Total shareholders' equity", direction: 'none',
        explain:
          "Nothing was issued and nothing bought back. Halloway's own equity is eliminated against the investment on consolidation rather than added to Ardenne's — otherwise every acquisition would create equity out of nothing.",
      },
      {
        id: 'dps', label: 'Dividend per share', direction: 'none',
        explain:
          'Held by the conventions. Total dividends paid rise only if the rate or the share count does, and this deal moves neither.',
      },
    ],
  },

  {
    id: 'ma-numeric-goodwill-easy',
    module: 'ma',
    tier: 'easy',
    kind: 'numeric',
    title: 'How much goodwill does the deal create?',
    prompt:
      "Brightmoor is acquiring all of Calder Instruments' equity. Work out the goodwill that appears on the combined balance sheet at close. One of the figures below is not needed.",
    conventions: [
      'Goodwill = equity purchase price less the fair value of the identifiable net assets acquired.',
      "The target's OWN goodwill is not an identifiable asset. It is written off at close and replaced by the goodwill this deal creates.",
      'No other assets or liabilities are written up or down: every remaining book value is already fair value.',
      'All amounts in $m.',
    ],
    skills: ['ma-goodwill', 'ma-purchase-accounting', 'ma-identifiable-net-assets'],
    estSeconds: 120,
    presentation: { showBase: true },
    // The target's own goodwill never overlaps its cash balance. The two near misses that swap them
    // would otherwise land on the same number, and a learner who netted the cash off the price
    // would be told they forgot to write off the goodwill instead.
    vars: [
      { id: 'price', label: 'equity purchase price', domain: [900, 1100, 720, 1300] },
      { id: 'bookEquity', label: "the target's book equity", domain: [400, 500, 320, 600] },
      { id: 'existingGw', label: "the target's own goodwill", domain: [60, 80, 45, 100] },
      { id: 'tgtCash', label: "the target's cash", domain: [110, 150, 75, 200] },
    ],
    derived: [
      { id: 'identifiable', label: 'identifiable net assets', expr: 'bookEquity - existingGw' },
      { id: 'goodwill', label: 'goodwill created', expr: 'price - identifiable' },
    ],
    givens: [
      { label: 'Equity purchase price', value: '${price}m' },
      { label: "Target's book value of equity", value: '${bookEquity}m' },
      { label: "Goodwill already on the target's balance sheet", value: '${existingGw}m' },
      { label: "Target's cash and equivalents", value: '${tgtCash}m' },
    ],
    question: 'Goodwill created at close, in $m',
    answer: 560,
    answerExpr: 'goodwill',
    tolerance: 0.5,
    unit: 'm',
    nearMisses: [
      {
        value: 500,
        valueExpr: 'price - bookEquity',
        note: "You compared the price with book equity and stopped. Book equity includes the target's own ${existingGw}m of goodwill, which is not an identifiable asset and is written off at close. Identifiable net assets are ${identifiable}m, not ${bookEquity}m.",
      },
      {
        value: 440,
        valueExpr: 'price - bookEquity - existingGw',
        note: 'You took the old goodwill off instead of adding it back. Writing it off makes the net assets you are buying SMALLER, which makes the new goodwill larger.',
      },
      {
        value: 450,
        valueExpr: 'price - tgtCash - identifiable',
        note: "You netted the target's ${tgtCash}m of cash off the price. That turns an equity price into something closer to an enterprise value, and goodwill is struck against the equity you actually bought.",
      },
      {
        value: 340,
        valueExpr: 'identifiable',
        note: 'That is the identifiable net assets acquired — the thing goodwill is measured against, not goodwill itself.',
      },
    ],
    working: [
      "Identifiable net assets = book equity of ${bookEquity}m less the target's own goodwill of ${existingGw}m = ${identifiable}m.",
      'Goodwill created = ${price}m - ${identifiable}m = ${goodwill}m.',
      "The target's cash is already inside its book equity, so netting it off again would count it twice.",
      'Goodwill is a plug, not a valuation. It is whatever makes the entry balance, and it is the reason a balance sheet always balances after an acquisition no matter how much was overpaid.',
    ],
  },

  {
    id: 'ma-order-funding-accretion-easy',
    module: 'ma',
    tier: 'easy',
    kind: 'ordering',
    title: 'Which way of paying leaves EPS highest?',
    prompt:
      'Vellon Corp trades on a P/E of {pe|1}x and is buying a target of fixed size and fixed earnings. Only the funding changes. Rank the six structures by the pro forma EPS each produces, highest first.',
    conventions: [
      'Everything except the funding is held: same target, same earnings, same price, except where an item says otherwise.',
      'The tax rate is {taxPct}%, so debt and forgone interest income both cost their rate less {taxPct}%.',
      'Shares are issued at the market price, so the cost of stock funding is the reciprocal of the P/E: an earnings yield of {ey|2}%.',
      'Rank by pro forma EPS, not by whether the structure is a good idea. A balance sheet cannot always take the debt that ranks best here.',
      'No synergies, and no change in the target on any of the six.',
    ],
    skills: ['ma-funding-mix', 'ma-accretion', 'ma-cost-of-funding', 'ma-earnings-yield'],
    estSeconds: 180,
    // One var, and every rate derived from it as a fixed multiple of the earnings yield. That is
    // what makes the ranking safe: each structure costs a fixed fraction of the same yield, so the
    // order is a property of the arithmetic rather than of the particular numbers drawn. Drawing
    // the rates independently would let debt overtake stock, and the exercise would be teaching the
    // opposite of what it says.
    vars: [{ id: 'pe', label: "the acquirer's P/E", domain: [16, 20, 12, 25] }],
    derived: [
      { id: 'taxPct', label: 'tax rate, in percent', expr: '25' },
      { id: 'ey', label: 'earnings yield', expr: '100 / pe' },
      { id: 'cashRate', label: 'yield on the cash being spent', expr: 'round(ey * 0.32, 1)' },
      { id: 'debtLo', label: 'the cheaper debt', expr: 'round(ey * 0.8, 1)' },
      { id: 'debtHi', label: 'the dearer debt', expr: 'round(ey * 1.28, 1)' },
    ],
    topLabel: 'Highest pro forma EPS',
    bottomLabel: 'Lowest pro forma EPS',
    items: [
      {
        id: 'all-cash', label: 'All cash from the balance sheet', detail: 'the cash is earning {cashRate|1}% pre-tax', rank: 1,
        explain:
          'The cheapest funding there is, because the only cost is the interest you stop earning: {cashRate|1}% before tax, {cashRate * 0.75|2}% after. Cash on a balance sheet earns less than almost any use of it, which is why a large cash pile invites an approach.',
      },
      {
        id: 'debt-low', label: 'All new debt at {debtLo|1}%', rank: 2,
        explain:
          '{debtLo * 0.75|2}% after tax. Dearer than spending cash you already hold and cheaper than issuing equity, which is the ordering that holds for almost every investment-grade acquirer.',
      },
      {
        id: 'half-half', label: 'Half new debt at {debtLo|1}%, half new shares', rank: 3,
        explain:
          'A blend costs the blend: ({debtLo * 0.75|2}% + {ey|2}%) / 2 = {(debtLo * 0.75 + ey) / 2|2}%. It has to sit between its two components, which is the same reason a WACC sits between the cost of debt and the cost of equity.',
      },
      {
        id: 'debt-high', label: 'All new debt at {debtHi|1}%', rank: 4,
        explain:
          '{debtHi * 0.75|2}% after tax. Still below the earnings yield, so still accretive against stock — but the gap has nearly closed, and this is the rate at which the argument for paying in debt stops being obvious.',
      },
      {
        id: 'all-stock', label: 'All new shares', rank: 5,
        explain:
          'Costs the earnings yield, {ey|2}%. Every share issued hands a permanent slice of all future earnings to the seller, and a P/E of {pe|1}x means that slice is priced at {ey|2}% a year forever.',
      },
      {
        id: 'all-stock-higher', label: 'All new shares, at an offer price 10% higher', rank: 6,
        explain:
          'The same funding and 10% more of it. More shares issued against the same acquired earnings is the most dilutive structure on the page, and it is what a competitive auction does to a stock deal.',
      },
    ],
  },

  // ================================================================ medium
  {
    id: 'ma-numeric-accretion-medium',
    module: 'ma',
    tier: 'medium',
    kind: 'numeric',
    title: 'Accretive or dilutive, and by how much?',
    prompt:
      'Perrin Holdings is acquiring Latham Devices. Work out the effect on Perrin\'s earnings per share in the first full year. Some of the figures below do not enter the calculation.',
    conventions: [
      'Pro forma net income = the two companies combined, plus after-tax synergies, less the after-tax interest on the new debt.',
      'New shares are issued at the market price, and the exchange is struck on the same day.',
      'The tax rate is {taxPct}% and applies to synergies and to the interest deduction alike.',
      'No asset write-ups, so no incremental depreciation and no deferred tax.',
      'Transaction fees are expensed at close and excluded from pro forma earnings.',
      'A positive answer is accretion; a negative one is dilution.',
    ],
    skills: ['ma-accretion', 'ma-funding-mix', 'ma-synergies', 'ma-pro-forma-eps'],
    estSeconds: 300,
    presentation: { includeDistractors: true, timerSeconds: 300 },
    vars: [
      { id: 'epsA', label: "the acquirer's EPS", domain: [2, 2.4, 1.75, 3] },
      { id: 'offer', label: 'equity purchase price', domain: [1200, 1500, 900, 1800] },
      // 100 is deliberately absent: with no stock in the mix no shares are issued, and the near
      // miss written to diagnose "you forgot the new shares" lands exactly on the answer.
      { id: 'debtPct', label: 'share of the price funded with debt', domain: [50, 60, 40, 70] },
      { id: 'niT', label: "the target's net income", domain: [66, 80, 50, 96] },
      { id: 'synPreTax', label: 'pre-tax synergies', domain: [60, 80, 45, 100] },
      { id: 'rate', label: 'interest rate on the new debt', domain: [6, 7, 5, 8] },
      { id: 'sharesA', label: "the acquirer's share count", domain: [200, 240, 175, 280] },
      { id: 'priceA', label: "the acquirer's share price", domain: [30, 36, 24, 45] },
    ],
    derived: [
      { id: 'taxPct', label: 'tax rate, in percent', expr: '25' },
      { id: 'niA', label: "the acquirer's net income", expr: 'epsA * sharesA' },
      { id: 'newDebt', label: 'new debt raised', expr: 'offer * debtPct / 100' },
      { id: 'stockAmt', label: 'price funded in shares', expr: 'offer - newDebt' },
      { id: 'newShares', label: 'shares issued', expr: 'stockAmt / priceA' },
      { id: 'interest', label: 'annual interest', expr: 'newDebt * rate / 100' },
      { id: 'interestAfterTax', label: 'interest after tax', expr: 'interest * 0.75' },
      { id: 'synAfterTax', label: 'synergies after tax', expr: 'synPreTax * 0.75' },
      { id: 'pfNi', label: 'pro forma net income', expr: 'niA + niT + synAfterTax - interestAfterTax' },
      { id: 'pfShares', label: 'pro forma share count', expr: 'sharesA + newShares' },
      { id: 'pfEps', label: 'pro forma EPS', expr: 'pfNi / pfShares' },
      { id: 'accretion', label: 'accretion', expr: 'pfEps / epsA * 100 - 100' },
    ],
    givens: [
      { label: 'Perrin: net income', value: '${niA}m' },
      { label: 'Perrin: diluted shares', value: '{sharesA}m' },
      { label: 'Perrin: share price', value: '${priceA|2}' },
      { label: 'Latham: net income', value: '${niT}m' },
      { label: 'Equity purchase price', value: '${offer}m' },
      { label: 'Funded', value: '{debtPct}% new debt, {100 - debtPct}% new shares' },
      { label: 'Interest rate on the new debt', value: '{rate|1}%' },
      { label: 'Run-rate synergies, pre-tax', value: '${synPreTax}m' },
      { label: 'Transaction fees', value: '$25m, expensed at close' },
      { label: 'Tax rate', value: '{taxPct}%' },
    ],
    question: 'Accretion to Perrin EPS in year one, in percent',
    answer: 10,
    answerExpr: 'accretion',
    tolerance: 0.2,
    unit: '%',
    nearMisses: [
      {
        value: 7.95,
        valueExpr: '(niA + niT + synAfterTax - interest) / pfShares / epsA * 100 - 100',
        note: 'You charged the full ${interest}m of interest. Interest is deductible, so the earnings hit is ${interestAfterTax}m. The tax shield is the reason debt funding is as cheap as it is.',
      },
      {
        value: 21,
        valueExpr: 'pfNi / sharesA / epsA * 100 - 100',
        note: 'You added the earnings and forgot the shares. {newShares|2}m new shares were issued to pay for {100 - debtPct}% of the price, and pro forma EPS is struck over {pfShares|2}m, not {sharesA}m.',
      },
      {
        value: 13.41,
        valueExpr: '(niA + niT + synPreTax - interestAfterTax) / pfShares / epsA * 100 - 100',
        note: 'You used the synergies pre-tax. A cost saving lands in operating income and is taxed like any other profit, so only ${synAfterTax}m of the ${synPreTax}m reaches net income.',
      },
      {
        value: -0.23,
        valueExpr: '(niA + niT - interestAfterTax) / pfShares / epsA * 100 - 100',
        note: 'That is the deal without any synergies at all, and it is worth knowing: it is roughly break-even. Everything this deal delivers to Perrin shareholders comes from the ${synPreTax}m, which is exactly why an interviewer asks how confident you are in it.',
      },
    ],
    working: [
      'New debt = {debtPct}% x ${offer}m = ${newDebt}m. Interest = {rate|1}% x {newDebt} = ${interest}m, or ${interestAfterTax}m after tax.',
      'Shares issued = ${stockAmt}m / ${priceA|2} = {newShares|2}m. Pro forma shares = {sharesA} + {newShares|2} = {pfShares|2}m.',
      'Pro forma net income = {niA} + {niT} + {synAfterTax} - {interestAfterTax} = ${pfNi}m.',
      'Pro forma EPS = {pfNi} / {pfShares|2} = ${pfEps|4}, against ${epsA|2} standalone.',
      'Accretion = {pfEps|4} / {epsA|2} - 1 = {accretion|2}%.',
      'The quick check, worth doing before any of the above: an all-stock deal is accretive when the acquirer buys at a lower P/E than its own. Debt in the mix moves the crossover, but the instinct is the right one.',
    ],
  },

  {
    id: 'ma-bridge-pro-forma-ni-medium',
    module: 'ma',
    tier: 'medium',
    kind: 'bridge',
    title: 'Standalone net income to pro forma net income',
    prompt:
      "Ossory Industrial has closed its acquisition of Wray Controls. Build pro forma net income for the first full year from Ossory's standalone figure. Four of the chips do not belong in this bridge at all, and leaving them in the tray is part of the answer.",
    conventions: [
      'Pro forma net income is what the combined company would have earned had it owned the target for the full year.',
      'The tax rate is {taxPct}%. Every item below that affects earnings is shown pre-tax unless the chip says otherwise.',
      'Goodwill is NOT amortised. It is tested for impairment, and no impairment has been taken.',
      'Transaction fees are expensed at close and excluded from pro forma earnings as a one-off.',
      'All amounts in $m.',
    ],
    skills: ['ma-pro-forma-eps', 'ma-synergies', 'ma-purchase-accounting', 'ma-goodwill', 'ma-financing-vs-earnings'],
    estSeconds: 300,
    presentation: { includeDistractors: true, timerSeconds: 300 },
    vars: [
      { id: 'niA', label: "the acquirer's net income", domain: [420, 500, 350, 620] },
      { id: 'niT', label: "the target's net income", domain: [66, 80, 50, 96] },
      { id: 'synPreTax', label: 'pre-tax synergies', domain: [60, 80, 45, 100] },
      { id: 'interest', label: 'interest on the acquisition debt', domain: [36, 48, 28, 60] },
      { id: 'extraDa', label: 'incremental D&A from the write-up', domain: [20, 28, 14, 36] },
      { id: 'forgoneInterest', label: 'interest income given up', domain: [12, 16, 9, 22] },
      { id: 'gwAmort', label: 'the goodwill amortisation trap', domain: [40, 55, 30, 70] },
      { id: 'fees', label: 'transaction fees', domain: [25, 35, 18, 45] },
      { id: 'repay', label: "repayment of the target's term loan", domain: [80, 120, 60, 150] },
      { id: 'divs', label: 'dividends to the former owners', domain: [30, 45, 22, 60] },
    ],
    derived: [
      { id: 'taxPct', label: 'tax rate, in percent', expr: '25' },
      { id: 'synAfterTax', label: 'synergies after tax', expr: 'synPreTax * 0.75' },
      { id: 'interestAfterTax', label: 'interest after tax', expr: 'interest * 0.75' },
      { id: 'extraDaAfterTax', label: 'incremental D&A after tax', expr: 'extraDa * 0.75' },
      { id: 'forgoneAfterTax', label: 'forgone interest income after tax', expr: 'forgoneInterest * 0.75' },
    ],
    startLabel: 'Ossory standalone net income',
    startValue: 420,
    startValueExpr: 'niA',
    targetLabel: 'Pro forma net income',
    targetValue: 480,
    requireTotal: true,
    tolerance: 1,
    items: [
      {
        id: 'target-ni', label: "Wray's net income", role: 'add', amount: 66, amountExpr: 'niT',
        explain: 'The point of the deal. Ossory owns all of it, so all of it is consolidated.',
      },
      {
        id: 'goodwill-amort', label: 'Amortisation of the goodwill created at close', role: 'out', amount: 40, amountExpr: 'gwAmort',
        explain:
          'The trap that catches people who learned this before 2001. Goodwill is not amortised: it sits on the balance sheet until it is impaired. Amortising it here would understate pro forma earnings by ${gwAmort}m of a charge that does not exist.',
      },
      {
        id: 'synergies', label: 'Run-rate synergies, after tax', role: 'add', amount: 45, amountExpr: 'synAfterTax',
        detail: '${synPreTax}m pre-tax at {taxPct}%',
        explain:
          'A cost saving is operating profit and is taxed like any other, so ${synPreTax}m pre-tax reaches the bottom line as ${synAfterTax}m. The number is also the softest thing in this bridge, which is why a buyer discloses it and a seller quotes it.',
      },
      {
        id: 'acq-interest', label: 'Interest on the acquisition debt, after tax', role: 'subtract', amount: 27, amountExpr: 'interestAfterTax',
        detail: '${interest}m pre-tax',
        explain: 'The cost of the money that bought the earnings above. Deductible, so it lands at ${interestAfterTax}m rather than ${interest}m.',
      },
      {
        id: 'target-debt-repay', label: "Repayment of Wray's term loan principal", role: 'out', amount: 80, amountExpr: 'repay',
        explain:
          'A financing flow. Principal never touches the income statement — only the interest on it does, and that interest stopped when the loan was repaid. This chip belongs in a cash flow statement, not here.',
      },
      {
        id: 'extra-da', label: 'Incremental D&A on the asset write-up, after tax', role: 'subtract', amount: 15, amountExpr: 'extraDaAfterTax',
        detail: '${extraDa}m pre-tax',
        explain:
          'Writing the target\'s assets up to fair value creates a bigger asset to depreciate, and the extra charge is real for accounting even though nothing extra is spent. It is the reason a deal can be cash-accretive and EPS-dilutive at once.',
      },
      {
        id: 'fees', label: 'Transaction fees paid at close', role: 'out', amount: 25, amountExpr: 'fees',
        explain:
          'Expensed at close under the conventions, and excluded from pro forma earnings as a one-off. The exclusion is a convention rather than a truth: the ${fees}m left the building, and a buyer who quotes pro forma EPS without mentioning it is quoting the flattering number.',
      },
      {
        id: 'forgone-interest', label: 'Interest income given up on the cash spent, after tax', role: 'subtract', amount: 9, amountExpr: 'forgoneAfterTax',
        detail: '${forgoneInterest}m pre-tax',
        explain:
          'The cost people forget on the cash portion of a deal. Cash on deposit was earning something; once it is spent it is not. That forgone income is as real a cost of funding as a coupon.',
      },
      {
        id: 'dividends', label: "Dividends paid to Wray's former shareholders", role: 'out', amount: 30, amountExpr: 'divs',
        explain:
          'They are former shareholders. Whatever they were paid before the deal is not a charge against the combined company afterwards, and a dividend was never an expense in the first place.',
      },
    ],
  },

  {
    id: 'ma-bucket-synergies-medium',
    module: 'ma',
    tier: 'medium',
    kind: 'bucketing',
    title: 'Which of these would you actually pay for?',
    prompt:
      'Sort each item by how much weight it deserves in the price. The middle bucket is the forgiving one: it is for benefits that are real enough to show a board and too soft to fund an offer with.',
    scenario:
      'Marrow Group is buying Denby Filtration for ${offer}m, a {premium}% premium to the undisturbed price. The deal team has put ${synTotal}m of annual run-rate synergies in the model, and the price only works if roughly ${synNeeded}m of that is deliverable. The two companies overlap in three of five regions.',
    conventions: [
      'Sort by whether the benefit belongs in the price you pay, not by whether it is a nice thing to have.',
      'The outer buckets are the load-bearing ones. Anything genuinely arguable belongs in the middle, which is scored leniently.',
      '"Not a synergy" means it is not a benefit created by combining the two companies — whether or not it costs or earns money.',
      'Assume no regulatory remedy has been agreed yet.',
    ],
    skills: ['ma-synergies', 'ma-cost-vs-revenue-synergies', 'ma-deal-justification', 'ma-integration-cost'],
    estSeconds: 300,
    presentation: { timerSeconds: 300 },
    // Nothing about which bucket an item belongs in depends on a figure here, so the domains are
    // free. They move anyway: the scenario is what makes the sort feel like a judgement rather than
    // a definition, and a scenario you have read before is one you skim.
    vars: [
      { id: 'offer', label: 'offer value', domain: [1400, 1900, 950, 2600] },
      { id: 'premium', label: 'premium to undisturbed', domain: [32, 40, 25, 48] },
      { id: 'synTotal', label: 'synergies in the model', domain: [120, 160, 90, 210] },
    ],
    derived: [{ id: 'synNeeded', label: 'synergies the price needs', expr: 'round(synTotal * 0.6)' }],
    buckets: [
      { id: 'cost', label: 'Cost synergy: underwrite it' },
      { id: 'revenue', label: 'Revenue synergy: show it, do not pay for it', lenient: true },
      { id: 'none', label: 'Not a synergy at all' },
    ],
    items: [
      {
        id: 'hq', label: 'Closing the overlapping regional head office', bucket: 'cost',
        explain:
          'A named building, a known lease, a countable headcount. This is what "underwritable" means: you can put a date on it and a person\'s name against it, and the saving happens whether or not a single customer behaves as hoped.',
      },
      {
        id: 'cross-sell', label: "Selling Marrow's service contracts into Denby's installed base", bucket: 'revenue',
        explain:
          'Plausible, sometimes large, and dependent on customers doing something they have not yet done. Revenue synergies are worth showing and worth almost nothing in an offer, because the buyer takes the risk and the seller takes the cash.',
      },
      {
        id: 'retention', label: "Retention bonuses for Denby's engineering team", bucket: 'none',
        explain:
          'A cost of doing the deal, and one that runs the wrong way. It belongs in the integration budget beside the fees, not in the synergy line — netting it against savings to reach a headline number is a well-worn way of flattering a case.',
      },
      {
        id: 'procurement', label: 'Buying the same filtration media across twice the volume', bucket: 'cost',
        explain:
          'Scale on a commodity input with a known spend and a known discount curve. Second only to overlapping property as the saving a buyer will actually fund.',
      },
      {
        id: 'own-plan', label: 'The cost programme Denby had already announced and built into its own plan', bucket: 'none',
        explain:
          'Already in the standalone forecast, and therefore already in the price the seller is asking. Counting it as a synergy pays for the same saving twice, which is the single most common way a deal model overstates its case.',
      },
      {
        id: 'listing', label: "Removing Denby's listing, audit and board costs", bucket: 'cost',
        explain:
          'Certain, immediate and unglamorous. It is also the reason a take-private starts a few million ahead before anyone has integrated anything.',
      },
      {
        id: 'distributors', label: "Pushing Denby's product through Marrow's distributor network", bucket: 'revenue',
        explain:
          'The mirror image of the cross-sell, and it faces the same objection: the distributors have to want it, the product has to fit, and neither has been tested.',
      },
      {
        id: 'erp', label: 'One-off capex to merge the two ERP systems', bucket: 'none',
        explain:
          'An integration cost, and usually a larger and later one than the model assumes. It does not become a synergy by sitting next to some.',
      },
      {
        id: 'refi', label: "Refinancing Denby's debt at Marrow's lower cost of borrowing", bucket: 'none',
        explain:
          'Real money and not an operating synergy: it is a financing benefit, and it belongs in the funding case rather than the synergy case. Putting it in the EBITDA build is how a financing decision gets capitalised at an operating multiple.',
      },
      {
        id: 'pricing', label: 'Raising prices because the combined group faces one fewer competitor', bucket: 'revenue', contested: true,
        explain:
          'Sometimes the largest number in the room and never one to write down. It is a revenue synergy that also happens to be the thesis of the competition authority reviewing the deal, and no regulatory remedy has been agreed yet.',
      },
      {
        id: 'tax-domicile', label: 'A lower group tax rate from redomiciling the combined company', bucket: 'none', contested: true,
        explain:
          'It reaches earnings, so it is defensible to include somewhere — but it is not created by the two businesses operating together, and it survives only as long as the tax rules do. Serious people put it in the model and out of the synergy line.',
      },
    ],
  },

  // ================================================================== hard
  {
    id: 'ma-grid-close-balance-sheet-hard',
    module: 'ma',
    tier: 'hard',
    kind: 'statement-grid',
    title: 'The balance sheet the morning after close',
    prompt:
      "Redmayne Group's balance sheet is below, before the deal. It has agreed to buy Thorne Analytics for ${price}m: {cashPct|1}% funded from its own cash, {debtPct|1}% with new debt, and fees of ${fees}m paid in cash at close. Show what the acquisition does to each line.",
    conventions: [
      "Thorne's identifiable assets and liabilities come on at fair value: receivables ${tgtAr}m, inventory ${tgtInv}m, PP&E ${tgtPpe}m before the write-up, payables ${tgtAp}m. Thorne has no debt and no goodwill of its own.",
      "Thorne's PP&E is written up by ${writeUp}m at close. The write-up has no tax basis, so it creates a deferred tax liability at {taxPct}%.",
      'Transaction fees are expensed at close and are not deductible, so they reduce retained earnings by the full amount.',
      'Goodwill is the plug: the price less the fair value of the identifiable net assets acquired.',
      "Thorne's own equity is eliminated on consolidation and never appears.",
      'All amounts in $m. Reductions are shown as negative numbers.',
    ],
    skills: ['ma-purchase-accounting', 'ma-goodwill', 'ma-write-up', 'ma-deferred-tax', 'ma-sources-and-uses'],
    estSeconds: 420,
    presentation: { showBase: false, includeDistractors: true, timerSeconds: 420 },
    taxRate: 0.25,
    // No shock, because this exercise is not linear in one number. Goodwill is the price less a
    // quantity that does not move with it, and no coefficient expresses a constant term — which is
    // exactly the case deltaExpr was added for. The domains keep the price above the fair value of
    // what is being bought at every combination, so the plug is always goodwill and never a bargain
    // purchase; a negative plug is a real thing and a completely different exercise.
    vars: [
      { id: 'price', label: 'purchase price', domain: [800, 1000, 900, 1200] },
      { id: 'writeUp', label: 'PP&E write-up', domain: [120, 160, 80, 180] },
      { id: 'tgtAr', label: "the target's receivables", domain: [80, 100, 60, 110] },
      { id: 'tgtInv', label: "the target's inventory", domain: [60, 80, 45, 90] },
      { id: 'tgtPpe', label: "the target's PP&E", domain: [200, 260, 150, 280] },
      { id: 'tgtAp', label: "the target's payables", domain: [40, 55, 30, 70] },
    ],
    derived: [
      { id: 'taxPct', label: 'tax rate, in percent', expr: '25' },
      { id: 'cashPct', label: 'share funded from cash', expr: '37.5' },
      { id: 'debtPct', label: 'share funded with debt', expr: '62.5' },
      { id: 'cashUsed', label: 'cash spent on the price', expr: 'price * 0.375' },
      { id: 'newDebt', label: 'new debt raised', expr: 'price * 0.625' },
      { id: 'fees', label: 'transaction fees', expr: 'price * 0.025' },
      { id: 'dtl', label: 'deferred tax liability created', expr: 'writeUp * 0.25' },
      { id: 'identifiable', label: 'identifiable net assets at fair value', expr: 'tgtAr + tgtInv + tgtPpe + writeUp - tgtAp - dtl' },
      { id: 'goodwillCreated', label: 'goodwill created', expr: 'price - identifiable' },
      { id: 'cashOut', label: 'total cash out of the door', expr: 'cashUsed + fees' },
    ],
    rows: [
      {
        id: 'cash', label: 'Cash and equivalents', statement: 'bs', section: 'Assets', base: 500,
        delta: -320, deltaExpr: '-(cashUsed + fees)', skills: ['ma-sources-and-uses'],
        explain: '${cashUsed}m of the price and ${fees}m of fees, both out of the door on the same day. The fees are the part people leave out of a sources and uses.',
      },
      {
        id: 'prepaid', label: 'Prepaid expenses', statement: 'bs', section: 'Assets', base: 60, delta: 0,
        explain: 'Thorne has none and nothing about the deal touches this line. A distractor, and the sort that catches an over-editor.',
      },
      {
        id: 'other-assets', label: 'Other non-current assets', statement: 'bs', section: 'Assets', base: 80, delta: 0,
        explain: 'Nothing in the transaction touches it, and Thorne has no equivalent balance to bring across.',
      },
      {
        id: 'ar', label: 'Accounts receivable', statement: 'bs', section: 'Assets', base: 200,
        delta: 80, deltaExpr: 'tgtAr',
        explain: "Thorne's receivables come on at fair value, which for a receivable is normally the book value.",
      },
      {
        id: 'inventory', label: 'Inventory', statement: 'bs', section: 'Assets', base: 150,
        delta: 60, deltaExpr: 'tgtInv',
        explain: "Thorne's inventory, at fair value. In a real deal this is often written up too, and the step-up unwinds through cost of sales within a year or two.",
      },
      {
        id: 'ppe', label: 'PP&E, net', statement: 'bs', section: 'Assets', base: 900,
        delta: 320, deltaExpr: 'tgtPpe + writeUp', skills: ['ma-write-up'],
        explain: "Thorne's ${tgtPpe}m plus the ${writeUp}m write-up to fair value. The write-up is what creates both the deferred tax liability below and the incremental depreciation that makes the deal look worse on EPS than it is on cash.",
      },
      {
        id: 'goodwill', label: 'Goodwill', statement: 'bs', section: 'Assets', base: 100,
        delta: 410, deltaExpr: 'goodwillCreated', skills: ['ma-goodwill'],
        explain:
          'The plug: ${price}m paid against ${identifiable}m of identifiable net assets at fair value, so ${goodwillCreated}m of goodwill. Every other line on this page is a fact about Thorne; this one is a fact about the price.',
      },
      {
        id: 'total-assets', computed: true, label: 'Total assets', statement: 'bs', section: 'Assets', base: 1990, delta: 550, emphasis: 'total',
        derive: { parents: [{ row: 'cash', sign: 1 }, { row: 'prepaid', sign: 1 }, { row: 'other-assets', sign: 1 }, { row: 'ar', sign: 1 }, { row: 'inventory', sign: 1 }, { row: 'ppe', sign: 1 }, { row: 'goodwill', sign: 1 }] },
      },
      {
        id: 'ap', label: 'Accounts payable', statement: 'bs', section: 'Liabilities & equity', base: 150,
        delta: 40, deltaExpr: 'tgtAp',
        explain: "Thorne's payables come across with everything else. A liability assumed is part of what you paid, which is why it reduces the identifiable net assets and so increases goodwill.",
      },
      {
        id: 'accrued', label: 'Accrued liabilities', statement: 'bs', section: 'Liabilities & equity', base: 80, delta: 0,
        explain: "Redmayne's own accruals, unaffected. Thorne's payables are shown on their own line above rather than merged into this one.",
      },
      {
        id: 'debt', label: 'Total debt', statement: 'bs', section: 'Liabilities & equity', base: 300,
        delta: 500, deltaExpr: 'newDebt', skills: ['ma-sources-and-uses'],
        explain: '{debtPct|1}% of the price, raised at close. Thorne has none of its own to assume or repay.',
      },
      {
        id: 'dtl', label: 'Deferred tax liability', statement: 'bs', section: 'Liabilities & equity', base: 0,
        delta: 30, deltaExpr: 'dtl', skills: ['ma-deferred-tax'],
        explain:
          'The line most candidates miss. The ${writeUp}m write-up gets no tax basis, so the extra depreciation on it will never be deductible. Recognising that future tax as a liability today is what the DTL is, and it reduces the net assets acquired, which pushes goodwill up by the same ${dtl}m.',
      },
      {
        id: 'common-stock', label: 'Common stock', statement: 'bs', section: 'Liabilities & equity', base: 400, delta: 0,
        explain: 'No shares were issued: the price was funded with cash and debt. This line moves only in a deal with paper in it.',
      },
      {
        id: 'retained-earnings', label: 'Retained earnings', statement: 'bs', section: 'Liabilities & equity', base: 1060,
        delta: -20, deltaExpr: '-fees',
        explain:
          "The fees, expensed at close and not deductible, so the full ${fees}m comes off. Thorne's own retained earnings do NOT come across — its equity is eliminated against the investment, which is the entry that stops every acquisition from manufacturing equity.",
      },
      {
        id: 'total-le', computed: true, label: 'Total liabilities & equity', statement: 'bs', section: 'Liabilities & equity', base: 1990, delta: 550, emphasis: 'total',
        derive: { parents: [{ row: 'ap', sign: 1 }, { row: 'accrued', sign: 1 }, { row: 'debt', sign: 1 }, { row: 'dtl', sign: 1 }, { row: 'common-stock', sign: 1 }, { row: 'retained-earnings', sign: 1 }] },
      },
    ],
    balance: {
      assets: ['cash', 'prepaid', 'other-assets', 'ar', 'inventory', 'ppe', 'goodwill'],
      liabilitiesEquity: ['ap', 'accrued', 'debt', 'dtl', 'common-stock', 'retained-earnings'],
    },
  },

  {
    id: 'ma-numeric-breakeven-synergies-hard',
    module: 'ma',
    tier: 'hard',
    kind: 'numeric',
    title: 'How much synergy does this deal need?',
    prompt:
      'Calverton is considering an offer for Ilminster Systems. The board will not do a deal that dilutes earnings in year one. Work out the smallest pre-tax synergy that keeps pro forma EPS exactly where it is.',
    conventions: [
      'EPS-neutral means pro forma EPS equals the acquirer\'s standalone EPS to the cent.',
      'Pro forma net income = the two companies combined, plus after-tax synergies, less the after-tax interest on the new debt.',
      'The tax rate is {taxPct}%, applying to synergies and to the interest deduction alike.',
      'Shares are issued at the market price. No asset write-ups, so no incremental depreciation.',
      'Answer as the PRE-TAX synergy, in $m.',
    ],
    skills: ['ma-accretion', 'ma-breakeven-synergies', 'ma-funding-mix', 'ma-synergies'],
    estSeconds: 420,
    presentation: { showBase: false, timerSeconds: 420 },
    vars: [
      { id: 'epsA', label: "the acquirer's EPS", domain: [2, 2.5, 1.8, 3] },
      { id: 'offer', label: 'equity purchase price', domain: [1200, 1500, 950, 1800] },
      { id: 'debtPct', label: 'share funded with debt', domain: [50, 60, 40, 70] },
      { id: 'synShare', label: 'share of the gap synergies must close', domain: [40.3, 50, 32, 60] },
      { id: 'rate', label: 'interest rate on the new debt', domain: [6, 7, 5, 8] },
      { id: 'sharesA', label: "the acquirer's share count", domain: [200, 250, 175, 300] },
      { id: 'priceA', label: "the acquirer's share price", domain: [30, 36, 25, 45] },
    ],
    derived: [
      { id: 'taxPct', label: 'tax rate, in percent', expr: '25' },
      { id: 'niA', label: "the acquirer's net income", expr: 'epsA * sharesA' },
      { id: 'newDebt', label: 'new debt raised', expr: 'offer * debtPct / 100' },
      { id: 'stockAmt', label: 'price funded in shares', expr: 'offer - newDebt' },
      { id: 'newShares', label: 'shares issued', expr: 'stockAmt / priceA' },
      { id: 'interest', label: 'annual interest', expr: 'newDebt * rate / 100' },
      { id: 'interestAfterTax', label: 'interest after tax', expr: 'interest * 0.75' },
      { id: 'pfShares', label: 'pro forma share count', expr: 'sharesA + newShares' },
      { id: 'preSynGap', label: 'the hole before any synergies', expr: 'epsA * newShares + interestAfterTax' },
      { id: 'niT', label: "the target's net income", expr: 'round(preSynGap * (1 - synShare / 100))' },
      { id: 'requiredNi', label: 'net income needed to hold EPS', expr: 'epsA * pfShares' },
      { id: 'gap', label: 'the after-tax gap to close', expr: 'requiredNi - niA - niT + interestAfterTax' },
      { id: 'synPreTax', label: 'the pre-tax synergy required', expr: 'gap / 0.75' },
    ],
    givens: [
      { label: 'Calverton: EPS', value: '${epsA|2}' },
      { label: 'Calverton: diluted shares', value: '{sharesA}m' },
      { label: 'Calverton: share price', value: '${priceA|2}' },
      { label: 'Ilminster: net income', value: '${niT}m' },
      { label: 'Equity purchase price', value: '${offer}m' },
      { label: 'Funded', value: '{debtPct}% new debt at {rate|1}%, {100 - debtPct}% new shares' },
      { label: 'Tax rate', value: '{taxPct}%' },
    ],
    question: 'Minimum pre-tax synergy for EPS neutrality, in $m',
    answer: 36,
    answerExpr: 'synPreTax',
    tolerance: 0.5,
    unit: 'm',
    nearMisses: [
      {
        value: 27,
        valueExpr: 'gap',
        note: 'That is the AFTER-tax gap. The question asks what has to be delivered before tax, and only {100 - taxPct}% of a saving survives to the bottom line, so ${gap|2}m of net income needs ${synPreTax|2}m of synergy.',
      },
      {
        value: 48,
        valueExpr: '(requiredNi - niA - niT + interest) / 0.75',
        note: 'You charged the interest gross. The deduction is worth ${interest * 0.25|2}m a year, and leaving it out makes the deal look as though it needs more help than it does.',
      },
      {
        value: -17.33,
        valueExpr: '(niA - niA - niT + interestAfterTax) / 0.75',
        note: 'You held pro forma net income at the standalone figure instead of holding EPS. {newShares|2}m new shares were issued, so net income has to rise to ${requiredNi|1}m just to stand still. A negative answer should have been the tell: it says the deal is accretive with no synergies at all.',
      },
      {
        value: 89.33,
        valueExpr: '(requiredNi - niA + interestAfterTax) / 0.75',
        note: "You left out Ilminster's own ${niT}m. The synergies only have to cover the gap the target's earnings do not already close.",
      },
    ],
    working: [
      'New debt = {debtPct}% x ${offer}m = ${newDebt}m, interest ${interest}m, or ${interestAfterTax}m after tax.',
      'Shares issued = ${stockAmt}m / ${priceA|2} = {newShares|2}m, so pro forma shares are {pfShares|2}m.',
      'To hold EPS at ${epsA|2}, pro forma net income must be {epsA|2} x {pfShares|2} = ${requiredNi|1}m.',
      'Without synergies it would be {niA} + {niT} - {interestAfterTax} = ${niA + niT - interestAfterTax|1}m. The gap is ${gap|2}m after tax.',
      'Pre-tax synergy required = {gap|2} / (1 - {taxPct}%) = ${synPreTax|1}m.',
      'The number is worth quoting as a percentage of the target\'s cost base rather than in dollars. A board hears "${synPreTax|0}m of synergies" and nods; it hears "eleven per cent of their operating costs, in year one" and asks who is going to do it.',
    ],
  },

  {
    id: 'ma-board-what-makes-accretive-hard',
    module: 'ma',
    tier: 'hard',
    kind: 'ternary-board',
    title: 'What moves accretion, and what only looks like it does',
    prompt:
      'A deal model is finished and comes out mildly accretive. Take each change on its own, from the same starting model every time, and mark whether it makes the deal MORE accretive, LESS accretive, or leaves year-one accretion unchanged.',
    conventions: [
      'Accretion means pro forma EPS in year one against the acquirer\'s standalone EPS.',
      'Each change is independent, and everything else is held, including the equity purchase price unless the line changes it.',
      'The tax rate is {taxPct}%. Goodwill is not amortised.',
      'Transaction fees are expensed at close and excluded from pro forma earnings, as they were in the base model.',
      'The acquisition debt costs less after tax than the acquirer\'s earnings yield, so debt funding is the cheaper of the two throughout.',
    ],
    skills: ['ma-accretion', 'ma-funding-mix', 'ma-purchase-accounting', 'ma-goodwill', 'ma-synergies'],
    estSeconds: 360,
    presentation: { showBase: false, timerSeconds: 360, includeDistractors: true },
    // Every direction here is the sign of a derivative, and none of them depends on the size of the
    // change — only on which way it goes. That is what makes the figures free to move: doubling the
    // fees changes nothing about the fact that fees are excluded, and a bigger write-up is more
    // depreciation whether it is {writeUpRise}m or ten times that.
    vars: [
      { id: 'priceRise', label: 'rise in the acquirer share price', domain: [20, 30, 15, 40] },
      { id: 'rateRise', label: 'rise in the cost of debt, in basis points', domain: [200, 150, 300, 250] },
      { id: 'premiumOld', label: 'the original premium', domain: [25, 30, 20, 35] },
      { id: 'niRise', label: "rise in the target's earnings", domain: [20, 25, 15, 30] },
      { id: 'writeUpRise', label: 'rise in the PP&E write-up', domain: [50, 80, 40, 100] },
      { id: 'tgtRepay', label: 'debt the target repays itself', domain: [100, 150, 80, 200] },
      { id: 'synShift', label: 'share of synergies pushed into year two', domain: [50, 40, 60] },
    ],
    derived: [
      { id: 'taxPct', label: 'tax rate, in percent', expr: '25' },
      { id: 'premiumNew', label: 'the raised premium', expr: 'premiumOld + 15' },
    ],
    rows: [
      {
        id: 'share-price-up', label: "The acquirer's share price rises {priceRise}% before signing, and the deal stays all-stock", direction: 'up',
        explain:
          'The price is fixed in dollars, so a higher share price buys it with fewer shares. Fewer shares issued against the same acquired earnings is straightforwardly more accretive, and it is why a buyer with a strong stock is in a hurry and a target insists on a fixed exchange ratio.',
      },
      {
        id: 'debt-cost-up', label: 'The acquisition debt prices {rateRise}bp wider than assumed', direction: 'down',
        explain:
          'More interest, less pro forma net income, same share count. The effect is smaller than it feels because the deduction absorbs {taxPct}% of it, but it only runs one way.',
      },
      {
        id: 'fees-double', label: 'Transaction fees come in at twice the budget', direction: 'none',
        explain:
          'Excluded from pro forma earnings under the conventions, so accretion does not move at all. Note what that means: a metric can be indifferent to real money leaving the building. The cash went; the presentation did not notice.',
      },
      {
        id: 'target-earnings-up', label: "The target's earnings turn out {niRise}% higher for the same price", direction: 'up',
        explain:
          'More earnings acquired for the same consideration. Said another way, the multiple paid has fallen, and buying at a lower P/E is the whole mechanism behind accretion.',
      },
      {
        id: 'premium-up', label: 'A rival bid forces the premium from {premiumOld}% to {premiumNew}%', direction: 'down',
        explain:
          'Every dollar of extra price is funded somehow, and the funding costs something while the earnings acquired have not changed. This is the auction dynamic that turns an accretive deal into a dilutive one without anything about the target changing.',
      },
      {
        id: 'existing-goodwill', label: "The target's own balance sheet turns out to carry far more goodwill than thought", direction: 'none',
        explain:
          'It is written off at close and replaced by the goodwill this deal creates, and goodwill is not amortised. Nothing reaches the income statement, so accretion is untouched. The line exists to catch the reflex that goodwill must cost something.',
      },
      {
        id: 'funding-switch', label: 'The funding switches from all-stock to all-debt', direction: 'up',
        explain:
          'The conventions pin the after-tax cost of debt below the acquirer\'s earnings yield, so paying with the cheaper of the two raises pro forma EPS. It also raises leverage, which accretion says nothing about — the deal that maximises year-one EPS is rarely the one that maximises anything else.',
      },
      {
        id: 'write-up-bigger', label: 'The PP&E write-up at close comes in ${writeUpRise}m higher', direction: 'down',
        explain:
          'A bigger asset to depreciate, so more incremental D&A against pro forma earnings. No extra cash is spent, which is why the same deal can be cash-accretive and EPS-dilutive at once, and why a buyer will happily talk about cash EPS.',
      },
      {
        id: 'target-repays', label: 'The target repays ${tgtRepay}m of its own debt from its own cash before close, with the equity price unchanged', direction: 'none',
        explain:
          'The subtle one. Its cash falls and its debt falls by the same amount, so the equity being bought is worth what it was, the acquirer funds the same price, and the target\'s interest saving is offset by the interest income it gave up. Everything nets.',
      },
      {
        id: 'synergies-later', label: '{synShift}% of the synergies slip from year one into year two', direction: 'down',
        explain:
          'Accretion here is a year-one measure, so a synergy that arrives in year two does not appear in it. The deal is no worse in value terms and looks worse on the metric, which is a fair description of most of what phasing does.',
      },
      {
        id: 'cash-instead', label: 'The deal is funded from balance-sheet cash instead of new debt, and the cash was earning less than the debt would have cost', direction: 'up',
        explain:
          'Spending cash costs the income you stop earning on it, and that is less than a coupon. It is the cheapest funding available and the reason a large cash balance is itself a reason to be approached.',
      },
      {
        id: 'revenue-higher', label: "The target's revenue is restated higher, with net income unchanged", direction: 'none',
        explain:
          'Accretion is an earnings calculation. Revenue does not enter it anywhere, and a line that moves the top line and not the bottom one moves nothing here.',
      },
    ],
  },
];
