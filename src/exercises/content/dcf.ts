// DCF: build the cash flow, pick the discount rate, and know what the answer is actually made of.
//
// Two things separate a candidate who can run a DCF from one who has only seen one. The first is
// knowing which line items belong in unlevered free cash flow, which changes with where you start:
// from EBIT you subtract taxes on EBIT and interest never appears; from net income you have to add
// interest back, net of tax, because net income is already after both the interest and the tax
// deduction it created. Two bridges here start from different lines for exactly that reason.
//
// The second is knowing that most of the answer is the terminal value, so a 25bp change in the
// growth rate moves the share price more than a year of the forecast does. The hard tier is built
// around that: value per share off a perpetuity, then the same perpetuity read back as an exit
// multiple and checked against where comps trade.
//
// Every exercise pins its tax basis and its discounting convention, because both are convention
// calls and a right answer marked wrong on a convention the learner never saw is worse than no
// exercise at all.

import type { Exercise } from '../lib/schema';

export const DCF: Exercise[] = [
  // ================================================================== easy
  {
    id: 'dcf-bridge-ebit-to-ufcf-easy',
    module: 'dcf',
    tier: 'easy',
    kind: 'bridge',
    title: 'EBIT to unlevered free cash flow',
    prompt:
      'Halden Components expects EBIT of ${ebit}m next year. Build unlevered free cash flow from it. Two of the chips below have no place in an unlevered cash flow at all, and leaving those in the tray is part of the answer.',
    conventions: [
      'Unlevered free cash flow = EBIT, less cash taxes on EBIT, plus D&A, less capital expenditure, less the increase in net working capital.',
      'The marginal cash tax rate is 25%, and cash taxes equal book taxes: no NOLs, no deferred tax movements.',
      'Taxes are calculated on EBIT, as though the company carried no debt.',
      'There is no stock-based compensation and no non-operating income.',
      'All amounts in $m.',
    ],
    skills: ['dcf-ufcf-build', 'dcf-tax-on-ebit', 'dcf-interest-exclusion'],
    estSeconds: 150,
    // EBIT leads, because it is the number the whole bridge is measured against. Every value is a
    // multiple of 4, so cash tax at 25% stays a whole number, and the three subtracted items stay
    // small enough against it that unlevered free cash flow never goes negative — a negative UFCF
    // is a perfectly real thing but a different exercise from this one.
    vars: [
      { id: 'ebit', label: 'EBIT', domain: [500, 600, 440, 720] },
      { id: 'dna', label: 'D&A', domain: [80, 100, 70, 120] },
      { id: 'capex', label: 'capital expenditure', domain: [60, 90, 45, 110] },
      { id: 'nwc', label: 'increase in net working capital', domain: [20, 35, 15, 40] },
    ],
    derived: [
      { id: 'taxPct', label: 'tax rate, in percent', expr: '25' },
      { id: 'taxOnEbit', label: 'cash taxes on EBIT', expr: 'ebit * 0.25' },
    ],
    startLabel: 'EBIT',
    startValue: 500,
    startValueExpr: 'ebit',
    targetLabel: 'Unlevered free cash flow',
    targetValue: 375,
    items: [
      {
        id: 'tax-on-ebit', label: 'Cash taxes on EBIT', role: 'subtract', amount: 125, amountExpr: 'taxOnEbit',
        explain: 'Tax is a real cash cost, so it comes out. It is charged on EBIT rather than on pre-tax income because an unlevered cash flow is what the business would generate with no debt, and a company with no debt gets no interest deduction. {taxPct}% of {ebit} is {taxOnEbit}.',
      },
      {
        id: 'interest', label: 'Interest expense on the term loan', role: 'out', amount: 40,
        explain: 'The item that defines the word unlevered. Interest is the cost of the financing, and financing costs are handled in the discount rate: the WACC already carries the cost of debt and the tax shield on it. Put interest in the cash flow as well and you have charged for the debt twice, and the answer is no longer an enterprise value.',
      },
      {
        id: 'dna', label: 'Depreciation and amortisation', role: 'add', amount: 80, amountExpr: 'dna',
        explain: 'A charge against EBIT that never leaves the bank account, so it is added back. It is not free of consequence: it lowered EBIT, which is why the tax bill above is smaller than it would otherwise be. That is the tax shield, and it is why you subtract tax first and add D&A back second.',
      },
      {
        id: 'capex', label: 'Capital expenditure', role: 'subtract', amount: 60, amountExpr: 'capex',
        explain: 'Cash out of the door to keep the business running and growing, and it never touches EBIT. This is the line the D&A add-back is paired with: one is the accounting for the spend, the other is the spend.',
      },
      {
        id: 'debt-repay', label: 'Mandatory debt repayment', role: 'out', amount: 50,
        explain: 'A financing flow, not an operating one. Unlevered free cash flow is the cash the business produces before anyone decides who gets it. Repaying principal is one of the decisions about who gets it, so it sits below this line.',
      },
      {
        id: 'nwc', label: 'Increase in net working capital', role: 'subtract', amount: 20, amountExpr: 'nwc',
        explain: 'Receivables and inventory going up means revenue booked that has not been collected, or cash tied up in goods on a shelf. Growth funded out of the business. An increase in net working capital is a use of cash, so it is subtracted.',
      },
    ],
  },

  {
    id: 'dcf-numeric-wacc-easy',
    module: 'dcf',
    tier: 'easy',
    kind: 'numeric',
    title: 'Work out the WACC',
    prompt: 'Brightwell Materials. Calculate the weighted average cost of capital from the figures below.',
    conventions: [
      'WACC = E/(D+E) x cost of equity + D/(D+E) x cost of debt x (1 - tax rate).',
      'Weights are market values: equity at market capitalisation, debt at face value.',
      'The cost of debt given is the pre-tax rate the company borrows at today.',
      'There is no preferred stock and no non-controlling interest.',
      'Answer as a percentage, to one decimal place.',
    ],
    skills: ['dcf-wacc', 'dcf-cost-of-debt', 'dcf-capital-structure'],
    estSeconds: 120,
    // Total capital is held at 1,000 and the split is what moves, so the weights are always clean
    // tenths. Letting both sides move independently produces weights like 63.6%, and a WACC quoted
    // to one decimal place then sits outside its own tolerance — the app marking a correct answer
    // wrong on its own rounding convention.
    vars: [
      // 500 is deliberately absent. At a 50/50 structure the weighted average IS the simple
      // average, so the "you took a simple average" near miss becomes the right answer and the
      // exercise stops testing the thing it was written to test.
      { id: 'eqv', label: 'equity value', domain: [600, 700, 800, 750] },
      { id: 'ke', label: 'cost of equity', domain: [12, 14, 11, 15] },
      { id: 'kd', label: 'pre-tax cost of debt', domain: [6, 8, 5, 7] },
    ],
    derived: [
      { id: 'cap', label: 'total capital', expr: '1000' },
      { id: 'debt', label: 'debt', expr: 'cap - eqv' },
      { id: 'we', label: 'equity weight', expr: 'eqv / cap' },
      { id: 'wd', label: 'debt weight', expr: 'debt / cap' },
      { id: 'kdAfter', label: 'after-tax cost of debt', expr: 'kd * 0.75' },
      { id: 'wacc', label: 'WACC', expr: 'we * ke + wd * kdAfter' },
    ],
    givens: [
      { label: 'Equity value (market capitalisation)', value: '${eqv}m' },
      { label: 'Debt (face value)', value: '${debt}m' },
      { label: 'Cost of equity', value: '{ke|1}%' },
      { label: 'Pre-tax cost of debt', value: '{kd|1}%' },
      { label: 'Marginal tax rate', value: '25%' },
    ],
    question: 'WACC, in %',
    answer: 9.0,
    answerExpr: 'wacc',
    // A tenth of a point, because the exercise asks for one decimal place and half that would put
    // a correctly rounded answer outside the tolerance on some of the weights.
    tolerance: 0.1,
    unit: '%',
    nearMisses: [
      { value: 9.6, valueExpr: 'we * ke + wd * kd', note: 'You used the pre-tax cost of debt. Interest is deductible, so the company only bears {kd|1}% x (1 - 25%) = {kdAfter|1}% of it. The tax shield lives in the discount rate, which is exactly why it must not also live in the cash flow.' },
      { value: 8.25, valueExpr: '(ke + kdAfter) / 2', note: 'That is the simple average of {ke|1}% and {kdAfter|1}%. The weights are the shares of the capital structure, {we * 100}% equity and {wd * 100}% debt, not one half each.' },
      { value: 7.5, valueExpr: 'wd * ke + we * kdAfter', note: 'The weights are the wrong way round: you put {wd * 100}% on equity and {we * 100}% on debt. Equity is ${eqv}m of the ${cap}m of capital.' },
    ],
    working: [
      'After-tax cost of debt = {kd|1}% x (1 - 25%) = {kdAfter|1}%.',
      'Weights: equity {eqv} / {cap} = {we * 100}%, debt {debt} / {cap} = {wd * 100}%.',
      'WACC = {we|2} x {ke|1}% + {wd|2} x {kdAfter|1}% = {we * ke|2}% + {wd * kdAfter|2}% = {wacc|1}%.',
      'Sense check: the answer has to sit between the cost of debt and the cost of equity, closer to whichever one funds more of the business.',
    ],
  },

  {
    id: 'dcf-board-what-moves-value-easy',
    module: 'dcf',
    tier: 'easy',
    kind: 'ternary-board',
    title: 'Which way does the DCF move?',
    prompt:
      'A finished five-year DCF of Marden Foods sits in front of you. Take each change on its own, from the same starting model every time, and mark which way the enterprise value it produces moves.',
    conventions: [
      'Value here means the enterprise value the DCF produces: the present value of unlevered free cash flow, plus the present value of the terminal value.',
      'Each change is independent and everything else, including the WACC, is held constant unless the line itself changes it.',
      'The terminal value is a perpetuity growth calculation unless the line says otherwise.',
      'Year-end discounting unless the line says otherwise.',
    ],
    skills: ['dcf-sensitivity', 'dcf-terminal-value', 'dcf-interest-exclusion', 'dcf-mid-year'],
    estSeconds: 200,
    taxRate: 0.25,
    // Only the cash amounts move. The rate pairs — growth 2.0 to 2.5, WACC 9.0 to 9.5, tax 21 to
    // 25, the exit multiple 8.0x to 9.0x — are left alone deliberately: each is a direction stated
    // as a pair, and the lesson is the sign of the change, not its size. Varying them would add
    // noise and a way for a domain value to invert a direction that is authored, not computed.
    vars: [
      { id: 'repay', label: 'debt repaid out of cash', domain: [100, 150, 80, 200] },
      { id: 'capexUp', label: 'extra maintenance capex', domain: [15, 25, 10, 30] },
      { id: 'special', label: 'special dividend', domain: [50, 80, 40, 120] },
      { id: 'depUp', label: 'extra depreciation', domain: [10, 20, 8, 24] },
    ],
    derived: [{ id: 'depShield', label: 'tax saved on the extra depreciation', expr: 'depUp * 0.25' }],
    rows: [
      {
        id: 'growth-up', label: 'The long-term growth rate in the terminal value goes from 2.0% to 2.5%', direction: 'up',
        explain: 'The denominator of the perpetuity is WACC less g, so a higher g makes it smaller and the terminal value bigger. On a typical model 25bp of growth is worth several percent of the equity value, which is why this assumption gets more scrutiny than any single forecast year.',
      },
      {
        id: 'wacc-up', label: 'The WACC goes from 9.0% to 9.5%', direction: 'down',
        explain: 'Every cash flow is discounted harder, and the terminal value hardest of all because it is furthest out and because WACC also sits in its denominator. The two effects push the same way.',
      },
      {
        id: 'debt-repay', label: 'The company uses ${repay}m of cash to repay ${repay}m of debt', direction: 'none',
        explain: 'Unlevered free cash flow contains no interest and no principal, so nothing in the numerator changes, and the WACC is held at the target capital structure. Enterprise value is unmoved. Equity value is a different question: net debt falls by nothing here, because the cash went with it.',
      },
      {
        id: 'capex-up', label: 'Maintenance capex is ${capexUp}m higher every year, with EBITDA unchanged', direction: 'down',
        explain: 'Capex is a straight cash outflow in unlevered free cash flow, and no tax relief comes back in the same year because EBITDA and therefore the tax base are unchanged. Cash flow falls by the full ${capexUp}m each year.',
      },
      {
        id: 'mid-year', label: 'The model switches from year-end to mid-year discounting', direction: 'up',
        explain: 'Mid-year assumes cash arrives evenly through the year rather than in a lump on 31 December, so every flow is discounted for half a year less. Less discounting, higher value. It is worth roughly half a year of the discount rate, so about 4-5% on a 9% WACC.',
      },
      {
        id: 'refinance', label: 'The company refinances the term loan at a lower coupon, with the target capital structure unchanged', direction: 'none',
        explain: 'Cheaper interest never reaches an unlevered cash flow. It would reach the WACC through the cost of debt, but the conventions hold the discount rate constant, so the enterprise value the model produces does not move. This is the same lesson as the interest chip in the bridge, seen from the other end.',
      },
      {
        id: 'nwc-up', label: 'Customers are given 30 more days to pay, so receivables build every year', direction: 'down',
        explain: 'A bigger investment in working capital every year is cash the business never gets to keep. Revenue and EBITDA are untouched, which is the point: this is the classic case of profit that never turns into cash.',
      },
      {
        id: 'exit-multiple', label: 'The terminal exit multiple assumption goes from 8.0x to 9.0x EBITDA', direction: 'up',
        explain: 'The terminal value is a multiple of the same terminal EBITDA, so a full turn more is a bigger number to discount back. On most models the terminal value is 60-80% of the total, so a turn on the exit multiple moves the answer far more than a turn of revenue growth in year 3.',
      },
      {
        id: 'share-issue', label: '20m new shares are issued at market and the proceeds sit in cash', direction: 'none',
        explain: 'Nothing about the operations changed, so the discounted cash flows do not change. More shares and more cash change the equity value and the per-share number, both of which sit on the far side of the bridge from the enterprise value this model produces.',
      },
      {
        id: 'tax-up', label: 'The marginal cash tax rate rises from 21% to 25%', direction: 'down',
        explain: 'Unlevered free cash flow is taxed on EBIT, so every year of the forecast and the terminal value shrink. In real life a higher tax rate also lowers the after-tax cost of debt and so the WACC, but that is second order and the conventions here hold the discount rate fixed.',
      },
      {
        id: 'dividend', label: 'A ${special}m special dividend is paid out of cash', direction: 'none',
        explain: 'A distribution decision, taken after the business has produced its cash. The operating forecast is identical, so the present value of unlevered free cash flow is identical. It changes what the equity is worth, not what the business is worth.',
      },
      {
        id: 'depreciation-up', label: 'Depreciation is ${depUp}m higher every year, with EBITDA, capex and working capital unchanged', direction: 'up',
        explain: 'EBIT falls ${depUp}m, so cash taxes fall ${depShield}m at 25%, and the ${depUp}m itself is added straight back because it is non-cash. Net effect is ${depShield}m more cash a year. The whole move is the tax shield.',
      },
    ],
  },

  // ================================================================ medium
  {
    id: 'dcf-bridge-ni-to-ufcf-medium',
    module: 'dcf',
    tier: 'medium',
    kind: 'bridge',
    title: 'Net income to unlevered free cash flow',
    prompt:
      'Kestrel Instruments reported net income of ${ni}m. You are building unlevered free cash flow from the bottom of the income statement rather than from EBIT, which changes what belongs. Assemble the bridge and give the number. Three chips do not belong in it.',
    conventions: [
      'Unlevered free cash flow is the cash the business generates before any financing: it is what net income would have been if the company had no debt, adjusted back to cash.',
      'The marginal book tax rate is 25%. Net income is already after interest and after the tax deduction that the interest created.',
      'Cash taxes are lower than book taxes because the company is using an NOL carryforward. The difference is the deferred tax expense sitting inside the tax line.',
      'Stock-based compensation is treated as a non-cash add-back here. Note that this is a convention, not a law: plenty of practitioners argue it is a real economic cost and leave it in.',
      'There is no non-operating income and no minority interest.',
      'All amounts in $m.',
    ],
    skills: ['dcf-ufcf-build', 'dcf-interest-exclusion', 'dcf-tax-effect', 'dcf-cash-taxes', 'dcf-nol'],
    estSeconds: 300,
    presentation: { includeDistractors: true, timerSeconds: 300 },
    // Net income is a multiple of 30 and interest a multiple of 4, which keeps two things whole at
    // once: the after-tax interest add-back, and the implied EBIT the debrief quotes — net income
    // grossed back up at 25% is only a round number if net income divides by three.
    vars: [
      { id: 'ni', label: 'net income', domain: [210, 270, 180, 300] },
      { id: 'interest', label: 'interest expense', domain: [40, 60, 32, 80] },
      { id: 'dna', label: 'D&A', domain: [90, 120, 75, 140] },
      { id: 'capex', label: 'capital expenditure', domain: [70, 100, 55, 120] },
      { id: 'nwc', label: 'increase in net working capital', domain: [25, 40, 20, 50] },
      { id: 'deferredTax', label: 'deferred tax expense', domain: [15, 25, 10, 30] },
      { id: 'sbc', label: 'stock-based compensation', domain: [20, 30, 45, 35] },
    ],
    derived: [
      { id: 'taxPct', label: 'tax rate, in percent', expr: '25' },
      { id: 'interestAfterTax', label: 'interest, net of tax', expr: 'interest * 0.75' },
      { id: 'interestShield', label: 'tax saved by the interest deduction', expr: 'interest * 0.25' },
      { id: 'nopat', label: 'NOPAT', expr: 'ni + interestAfterTax' },
      { id: 'ebit', label: 'implied EBIT', expr: 'nopat / 0.75' },
    ],
    startLabel: 'Net income',
    startValue: 210,
    startValueExpr: 'ni',
    targetLabel: 'Unlevered free cash flow',
    targetValue: 270,
    requireTotal: true,
    tolerance: 1,
    items: [
      {
        id: 'interest-after-tax', label: 'Interest expense, net of tax', role: 'add', amount: 30, amountExpr: 'interestAfterTax',
        detail: 'interest expense of ${interest}m at a {taxPct}% tax rate',
        explain: 'Net income is after interest, and unlevered cash flow must be before it, so it goes back in. The add-back is {interest} x (1 - {taxPct}%) = {interestAfterTax}, not {interest}, because the deduction also cut the tax bill by {interestShield}. Add {interestAfterTax} to net income of {ni} and you have NOPAT of {nopat}, which is the same place EBIT x (1 - t) would have taken you: EBIT here is {ebit}.',
      },
      {
        id: 'debt-repay', label: 'Mandatory debt repayment', role: 'out', amount: 60,
        explain: 'Principal is a financing flow. It belongs in levered free cash flow, which measures what is left for the shareholders, and nowhere near an unlevered number. This is the second half of the same distinction as the interest chip.',
      },
      {
        id: 'dna', label: 'Depreciation and amortisation', role: 'add', amount: 90, amountExpr: 'dna',
        explain: 'Non-cash, already charged above net income, so it comes back. Unchanged whichever line you start from.',
      },
      {
        id: 'capex', label: 'Capital expenditure', role: 'subtract', amount: 70, amountExpr: 'capex',
        explain: 'Cash spent, never charged against net income except through the D&A you just added back.',
      },
      {
        id: 'interest-pretax', label: 'Interest expense, gross', role: 'out', amount: 40, amountExpr: 'interest',
        explain: 'The trap. Interest does have to be added back when you start from net income, but at {interestAfterTax} rather than {interest}. Adding the gross figure hands the company back the tax the deduction saved it, overstating cash flow by {interestShield} and quietly assuming a tax shield that the WACC is already counting.',
      },
      {
        id: 'deferred-tax', label: 'Deferred tax expense', role: 'add', amount: 15, amountExpr: 'deferredTax',
        detail: 'the book/cash tax difference from using the NOL',
        explain: 'The tax charge inside net income is the book number. Cash taxes are ${deferredTax}m lower because the NOL is sheltering income, so adding the deferred portion back converts a book tax charge into the cash one. A DCF discounts cash, so cash taxes are the ones that belong.',
      },
      {
        id: 'nwc', label: 'Increase in net working capital', role: 'subtract', amount: 25, amountExpr: 'nwc',
        explain: 'Cash tied up in receivables and inventory. Profit that has not become cash, so it comes out.',
      },
      {
        id: 'dividend', label: 'Dividends paid to common shareholders', role: 'out', amount: 25,
        explain: 'A distribution of cash the business has already produced. It sits below every free cash flow measure, unlevered or levered, because both are struck before the owners decide what to take out.',
      },
      {
        id: 'sbc', label: 'Stock-based compensation', role: 'add', amount: 20, amountExpr: 'sbc',
        explain: 'No cash leaves the company in the year it is expensed, so under the convention pinned above it is added back like D&A. Be ready to defend it: the cost is real, it is paid in dilution rather than cash, and a careful model reflects that in the share count instead.',
        contested: true,
      },
    ],
  },

  {
    id: 'dcf-numeric-relever-beta-medium',
    module: 'dcf',
    tier: 'medium',
    kind: 'numeric',
    title: 'Unlever, relever, then CAPM',
    prompt:
      'You are valuing a private target and taking its beta from a single listed comparable. The two businesses do the same thing but are financed differently. Work out the cost of equity you should use for the target. Not everything below is needed.',
    conventions: [
      'Unlevered beta = levered beta / (1 + (1 - tax rate) x D/E). Relever with the same formula in reverse, at the target capital structure.',
      'Use net debt in the D/E ratio, and market value of equity.',
      'Both companies face the same 40% marginal tax rate.',
      'Cost of equity = risk-free rate + beta x equity risk premium. No size or country premium.',
      'Answer as a percentage, to one decimal place.',
    ],
    skills: ['dcf-capm', 'dcf-beta-unlever', 'dcf-beta-relever', 'dcf-cost-of-equity'],
    estSeconds: 300,
    presentation: { includeDistractors: true, timerSeconds: 300 },
    // Only the comparable's beta and the risk-free rate move. Both capital structures are held:
    // the whole lesson is that the SAME assets carry different equity risk at different leverage,
    // and a domain that moved the structures too would blur which of the two effects did the work.
    // Every beta is a multiple of 0.13, so unlevering by 1.30 lands on a round number every time.
    vars: [
      { id: 'betaL', label: "comparable's levered beta", domain: [1.3, 1.43, 1.17, 1.56] },
      { id: 'rf', label: 'risk-free rate', domain: [3, 4, 2.5] },
    ],
    derived: [
      { id: 'erp', label: 'equity risk premium', expr: '5' },
      { id: 'kd', label: 'target pre-tax cost of debt', expr: '6' },
      { id: 'compDE', label: "comparable's debt/equity", expr: '0.5' },
      { id: 'bu', label: 'unlevered beta', expr: 'betaL / (1 + 0.6 * compDE)' },
      { id: 'bl', label: 'relevered beta', expr: 'bu * (1 + 0.6 * 1)' },
      { id: 'ke', label: "target's cost of equity", expr: 'rf + bl * erp' },
    ],
    givens: [
      { label: 'Comparable: levered (equity) beta', value: '{betaL|2}' },
      { label: 'Comparable: market capitalisation', value: '$800m' },
      { label: 'Comparable: net debt', value: '$400m' },
      { label: 'Comparable: dividend yield', value: '2.4%' },
      { label: 'Target: capital structure', value: '50% debt / 50% equity' },
      { label: 'Target: pre-tax cost of debt', value: '{kd|1}%' },
      { label: 'Marginal tax rate (both)', value: '40%' },
      { label: 'Risk-free rate', value: '{rf|1}%' },
      { label: 'Equity risk premium', value: '{erp|1}%' },
    ],
    question: "Target's cost of equity, in %",
    answer: 11.0,
    answerExpr: 'ke',
    tolerance: 0.05,
    unit: '%',
    nearMisses: [
      { value: 9.5, valueExpr: 'rf + betaL * erp', note: 'You put the comparable\'s levered beta of {betaL|2} straight into CAPM. That beta carries the comparable\'s leverage, not the target\'s. The target is financed 50/50 against the comparable\'s 33/67, so it is the riskier equity and cannot share a beta with it.' },
      { value: 8.0, valueExpr: 'rf + bu * erp', note: 'You stopped at the unlevered beta of {bu|2}. Unlevered beta is the risk of the assets, an intermediate step. The equity you are pricing is levered, so it has to be relevered to the target capital structure first.' },
      { value: 13.0, valueExpr: 'rf + bu * 2 * erp', note: 'You relevered without the (1 - t) factor: {bu|2} x (1 + 1.0) = {bu * 2|2}. The tax deduction on interest means leverage adds less risk to the equity than the raw D/E suggests, and the (1 - 40%) term is what carries that.' },
      { value: 7.3, valueExpr: '0.5 * ke + 0.5 * kd * 0.6', note: 'That is the WACC, not the cost of equity: 0.5 x {ke|1}% + 0.5 x {kd|1}% x (1 - 40%). The question asks for the return equity holders require, which is the input to the WACC rather than the output.' },
    ],
    working: [
      "Comparable D/E = 400 / 800 = {compDE|2}.",
      'Unlevered beta = {betaL|2} / (1 + 0.6 x {compDE|2}) = {betaL|2} / 1.30 = {bu|2}.',
      'Target D/E = 50 / 50 = 1.00. Relevered beta = {bu|2} x (1 + 0.6 x 1.00) = {bl|2}.',
      'Cost of equity = {rf|1}% + {bl|2} x {erp|1}% = {ke|1}%.',
      'The dividend yield and the cost of debt are there to be left alone: neither enters CAPM.',
    ],
  },

  {
    id: 'dcf-order-discount-rates-medium',
    module: 'dcf',
    tier: 'medium',
    kind: 'ordering',
    title: 'Rank the rates',
    prompt:
      'Ferrow Logistics is financed 25% debt and 75% equity at market values. It borrows at {kd|1}% pre-tax, its tax rate is 25%, and its cost of equity as financed today is {ke|1}%. Put the six rates below in order, smallest first. You can rank them on reasoning alone, and the numbers are there if you want to check yourself.',
    conventions: [
      'All rates are annual and pre-inflation-adjustment, on the same market-value capital structure unless the item says otherwise.',
      'Relevering uses the Hamada relationship: cost of equity = unlevered cost of equity + (unlevered cost of equity - cost of debt) x (1 - t) x D/E.',
      'The cost of debt is assumed not to rise with leverage. In practice it would, which only widens the gaps at the bottom of the list.',
      'Equity is riskier than debt at this company, as it is at almost every company that is not close to distress.',
    ],
    skills: ['dcf-wacc', 'dcf-cost-of-equity', 'dcf-cost-of-debt', 'dcf-capital-structure'],
    estSeconds: 240,
    presentation: { timerSeconds: 240 },
    // Only the cost of equity moves, and the capital structure and cost of debt are held. That is
    // what makes the ranking safe: with kd fixed at 8 and equity never cheaper than 11, the chain
    // after-tax debt < debt < WACC < unlevered equity < levered equity < equity at 50% debt holds
    // at every value in the domain. A variant that reordered the list would be a different
    // exercise wearing this one's answer key.
    vars: [{ id: 'ke', label: 'cost of equity as financed today', domain: [12, 14, 13, 11] }],
    derived: [
      { id: 'kd', label: 'pre-tax cost of debt', expr: '8' },
      { id: 'kdAfter', label: 'after-tax cost of debt', expr: 'kd * 0.75' },
      { id: 'wacc', label: 'WACC at 25/75', expr: '0.75 * ke + 0.25 * kdAfter' },
      { id: 'ku', label: 'unlevered cost of equity', expr: '(ke + 0.25 * kd) / 1.25' },
      { id: 'keLev', label: 'cost of equity at 50% debt', expr: 'ku + (ku - kd) * 0.75' },
    ],
    topLabel: 'Lowest rate',
    bottomLabel: 'Highest rate',
    items: [
      {
        id: 'kd-after-tax', label: 'After-tax cost of debt', detail: '{kd|1}% x (1 - 25%)', rank: 1,
        explain: 'The cheapest money in the capital structure, and cheaper still because the interest is deductible: {kdAfter|1}%. This is the rate that goes into the WACC, never the {kd|1}%.',
      },
      {
        id: 'kd-pretax', label: 'Pre-tax cost of debt (the coupon)', detail: 'what the lender actually charges', rank: 2,
        explain: '{kd|1}%. Above the after-tax rate by exactly the value of the tax shield, and still below everything equity-related because lenders are paid first and hold the collateral.',
      },
      {
        id: 'wacc', label: 'WACC', detail: 'at the current 25/75 structure', rank: 3,
        explain: '0.75 x {ke|1}% + 0.25 x {kdAfter|1}% = {wacc|2}%. A blend, so it must sit between the after-tax cost of debt and the cost of equity. If your WACC ever comes out above your cost of equity, you have made an arithmetic error.',
      },
      {
        id: 'ku', label: 'Unlevered cost of equity', detail: 'the return on the assets, as if the company had no debt', rank: 4,
        explain: '{ku|2}%. It is the risk of the business itself, stripped of financing. It sits above the WACC because the WACC is lowered by the tax shield on the debt, and below the levered cost of equity because that one carries the financial risk on top of the business risk.',
      },
      {
        id: 'ke-current', label: 'Cost of equity as financed today', detail: '25% debt', rank: 5,
        explain: '{ke|1}%. Business risk plus the financial risk that the 25% of debt adds. Equity is the residual claim, so it prices last and highest of everything the company has issued.',
      },
      {
        id: 'ke-levered-up', label: 'Cost of equity if the company moved to 50% debt', detail: 'same assets, more leverage', rank: 6,
        explain: '{ku|2}% + ({ku|2}% - {kd|1}%) x 0.75 x 1.0 = {keLev|2}%. Same business, same assets, riskier equity, because a larger fixed claim now sits in front of the shareholders. This is why relevering matters: the beta of the equity is a function of how the company is financed, not only of what it does.',
      },
    ],
  },

  // ================================================================== hard
  {
    id: 'dcf-numeric-value-per-share-hard',
    module: 'dcf',
    tier: 'hard',
    kind: 'numeric',
    title: 'From the forecast to the share price',
    prompt:
      'Alder Marine. The five-year forecast is finished and discounted. Take it through the terminal value and the bridge, and give the implied value per share. Some of the figures below are not needed.',
    conventions: [
      'Unlevered DCF: discount unlevered free cash flow at the WACC to get enterprise value, then bridge to equity value.',
      'Year-end discounting throughout. The valuation date is the start of year 1, so year 5 cash flow is discounted five years.',
      'The terminal value is a Gordon growth perpetuity struck at the end of year 5, on the year 5 cash flow grown one year.',
      'Net debt is total debt less all cash, and all cash is unrestricted.',
      'The share count given is already diluted. All amounts in $m except the answer.',
    ],
    skills: ['dcf-terminal-value', 'dcf-gordon-growth', 'dcf-discounting', 'dcf-equity-bridge', 'dcf-per-share'],
    estSeconds: 360,
    presentation: { showBase: false, timerSeconds: 360 },
    // Growth is always well below the WACC, so the perpetuity never explodes, and the terminal
    // value stays between about 60% and 80% of enterprise value at every combination — which is
    // the range the exercise's own closing observation depends on being true.
    vars: [
      { id: 'fcf5', label: 'year 5 unlevered free cash flow', domain: [120, 150, 100, 180] },
      { id: 'pvFcf', label: 'PV of years 1-5', domain: [400, 500, 350, 600] },
      { id: 'wacc', label: 'WACC, in percent', domain: [10, 11, 9] },
      { id: 'g', label: 'long-term growth, in percent', domain: [2, 2.5, 1.5] },
      { id: 'netDebt', label: 'net debt', domain: [350, 400, 300, 500] },
      { id: 'shares', label: 'diluted shares', domain: [50, 60, 40, 75] },
    ],
    derived: [
      { id: 'bookEquity', label: 'book value of equity (a distractor)', expr: '600' },
      { id: 'ebitda5', label: 'year 5 EBITDA (a distractor)', expr: '200' },
      { id: 'disc', label: 'five years of discounting', expr: 'pow(1 + wacc / 100, 5)' },
      { id: 'tv', label: 'terminal value at the end of year 5', expr: 'fcf5 * (1 + g / 100) / ((wacc - g) / 100)' },
      { id: 'pvTv', label: 'PV of the terminal value', expr: 'tv / disc' },
      { id: 'ev', label: 'enterprise value', expr: 'pvFcf + pvTv' },
      { id: 'eqvVal', label: 'equity value', expr: 'ev - netDebt' },
      { id: 'perShare', label: 'value per share', expr: 'eqvVal / shares' },
    ],
    givens: [
      { label: 'PV of unlevered FCF, years 1-5, at the WACC', value: '${pvFcf}m' },
      { label: 'Year 5 unlevered free cash flow', value: '${fcf5}m' },
      { label: 'Year 5 EBITDA', value: '${ebitda5}m' },
      { label: 'WACC', value: '{wacc|1}%' },
      { label: 'Long-term growth rate beyond year 5', value: '{g|1}%' },
      { label: 'Net debt at the valuation date', value: '${netDebt}m' },
      { label: 'Book value of equity', value: '${bookEquity}m' },
      { label: 'Diluted shares outstanding', value: '{shares|1}m' },
      { label: '{(100 + wacc) / 100|2}^5, if you want it', value: '{disc|4}' },
    ],
    question: 'Implied equity value per share, in $',
    answer: 20.0,
    answerExpr: 'perShare',
    tolerance: 0.1,
    unit: ' per share',
    nearMisses: [
      { value: 18.27, valueExpr: '(pvFcf + tv / (disc * (1 + wacc / 100)) - netDebt) / shares', note: 'You discounted the terminal value six years instead of five. It is struck at the end of year 5, on the same date as the year 5 cash flow, so it comes back the same five years. Growing the cash flow one year forward is not the same as pushing the value one year further out.' },
      { value: 19.63, valueExpr: '(pvFcf + fcf5 / ((wacc - g) / 100) / disc - netDebt) / shares', note: 'You capitalised ${fcf5}m rather than ${fcf5}m x {1 + g / 100|2}. The perpetuity formula values a stream starting the year after the valuation date, so the numerator is next year\'s cash flow, not this year\'s.' },
      { value: 27.0, valueExpr: 'ev / shares', note: 'That is enterprise value per share, which is not a thing anyone buys. A DCF of unlevered cash flow gives you the whole business; the equity is what is left after the lenders are paid, so net debt of ${netDebt}m comes off first.' },
      { value: 20.93, valueExpr: '(pvFcf + pvTv * pow(1 + wacc / 100, 0.5) - netDebt) / shares', note: 'You applied a mid-year factor to the terminal value when the conventions specify year-end. Mid-year is defensible and adds roughly half a year of discounting back, but pick one convention and hold it across the forecast and the terminal value.' },
    ],
    working: [
      'Terminal value at end of year 5 = {fcf5} x {1 + g / 100|2} / ({wacc|1}% - {g|1}%) = {fcf5 * (1 + g / 100)|1} / {(wacc - g) / 100|3} = ${tv|0}m.',
      'PV of the terminal value = {tv|0} / {disc|4} = ${pvTv|0}m.',
      'Enterprise value = {pvFcf} + {pvTv|0} = ${ev|0}m.',
      'The terminal value is {pvTv|0} / {ev|0} = {pvTv / ev * 100|0}% of the answer. That is normal, and it is the reason the growth rate and the WACC get more scrutiny than any single forecast year: a 25bp move in either is worth more than rebuilding the revenue build.',
      'Equity value = {ev|0} - {netDebt} = ${eqvVal|0}m. Per share = {eqvVal|0} / {shares|1} = ${perShare|2}.',
    ],
  },

  {
    id: 'dcf-numeric-implied-exit-multiple-hard',
    module: 'dcf',
    tier: 'hard',
    kind: 'numeric',
    title: 'What multiple did your growth rate just assume?',
    prompt:
      'Sable Packaging, valued on a perpetuity growth terminal value. Before you sign off on the growth rate, read it back as a multiple: what EV/EBITDA is the terminal value implying at the exit? Comparable packaging companies currently trade at {compLow|1}x to {compHigh|1}x forward EBITDA.',
    conventions: [
      'The terminal value is a Gordon growth perpetuity struck at the end of year 5, on the year 5 unlevered cash flow grown one year.',
      'The implied multiple is the terminal value at the exit date over terminal-year EBITDA. Both sit at the end of year 5, so neither is discounted.',
      'EV/EBITDA, not EV/EBIT. Year-end discounting elsewhere in the model.',
      'Answer in turns, to two decimal places.',
    ],
    skills: ['dcf-terminal-value', 'dcf-exit-multiple', 'dcf-gordon-growth', 'dcf-sanity-check'],
    estSeconds: 300,
    presentation: { showBase: false, timerSeconds: 300 },
    // EBITDA is held and the cash flow moves, so the implied multiple stays in a band a packaging
    // buyer would recognise — roughly 7x to 11x. The comps range is derived as a fraction of that
    // multiple rather than fixed, because the whole point of the exercise is that the answer lands
    // ABOVE where the sector trades; a fixed range would stop being true on half the variants and
    // the closing lesson would quietly invert.
    vars: [
      { id: 'fcf5', label: 'year 5 unlevered free cash flow', domain: [160, 200, 140, 180] },
      { id: 'wacc', label: 'WACC, in percent', domain: [10, 11, 9] },
      { id: 'g', label: 'long-term growth, in percent', domain: [2, 2.5, 1.5] },
      { id: 'dna5', label: 'year 5 D&A', domain: [60, 75, 50, 90] },
    ],
    derived: [
      { id: 'ebitda5', label: 'year 5 EBITDA', expr: '250' },
      { id: 'netDebt', label: 'net debt (a distractor)', expr: '400' },
      { id: 'ebit5', label: 'year 5 EBIT', expr: 'ebitda5 - dna5' },
      { id: 'disc', label: 'five years of discounting', expr: 'pow(1 + wacc / 100, 5)' },
      { id: 'tv', label: 'terminal value', expr: 'fcf5 * (1 + g / 100) / ((wacc - g) / 100)' },
      { id: 'mult', label: 'implied exit multiple', expr: 'tv / ebitda5' },
      { id: 'compLow', label: 'bottom of the comps range', expr: 'round(mult * 0.8, 1)' },
      { id: 'compHigh', label: 'top of the comps range', expr: 'round(mult * 0.92, 1)' },
    ],
    givens: [
      { label: 'Year 5 unlevered free cash flow', value: '${fcf5}m' },
      { label: 'Year 5 EBITDA', value: '${ebitda5}m' },
      { label: 'Year 5 D&A', value: '${dna5}m' },
      { label: 'WACC', value: '{wacc|1}%' },
      { label: 'Long-term growth rate', value: '{g|1}%' },
      { label: 'Net debt', value: '${netDebt}m' },
      { label: '{(100 + wacc) / 100|2}^5, if you want it', value: '{disc|4}' },
    ],
    question: 'Implied terminal EV/EBITDA multiple, in turns',
    answer: 8.16,
    answerExpr: 'mult',
    tolerance: 0.05,
    unit: 'x',
    nearMisses: [
      { value: 8.0, valueExpr: 'fcf5 / ((wacc - g) / 100) / ebitda5', note: 'You capitalised ${fcf5}m rather than ${fcf5}m x {1 + g / 100|2}. Small in isolation, but it is the same slip that costs you the terminal value itself, and here it is the difference between a multiple that is near the comps and one that is clearly above them.' },
      { value: 10.74, valueExpr: 'tv / ebit5', note: 'You divided by EBIT of ${ebit5}m. The comps are quoted on EBITDA, and a multiple is only a sanity check if the denominator matches the one the market uses.' },
      { value: 5.07, valueExpr: 'tv / disc / ebitda5', note: 'You divided the present value of the terminal value by EBITDA. The multiple has to be struck on the exit date: a buyer in year 5 pays year 5 money for year 5 EBITDA. Discounting one side and not the other mixes two dates.' },
    ],
    working: [
      'Terminal value = {fcf5} x {1 + g / 100|2} / ({wacc|1}% - {g|1}%) = {fcf5 * (1 + g / 100)|1} / {(wacc - g) / 100|3} = ${tv|0}m.',
      'Implied multiple = {tv|0} / {ebitda5} = {mult|2}x.',
      'Comps trade at {compLow|1}x to {compHigh|1}x, so a {g|1}% growth rate is quietly assuming the business exits above where the sector trades today. Either the growth rate is generous, the WACC is too low, or year 5 cash flow is flattered by capex that has been allowed to drift below D&A.',
      'This is the check that keeps the two terminal value methods honest: perpetuity growth reads back as a multiple, and an exit multiple reads back as a growth rate. Quote both in an interview.',
      'Note what the formula does as g approaches the WACC: the denominator goes to zero and the value to infinity. g must be below the WACC, and in practice below long-run nominal GDP growth, or you are assuming the company eventually becomes the economy.',
    ],
  },

  {
    id: 'dcf-bucket-fcf-membership-hard',
    module: 'dcf',
    tier: 'hard',
    kind: 'bucketing',
    title: 'Unlevered, levered, or neither',
    prompt:
      'Sort each item by which free cash flow it belongs in when you build the forecast. The middle bucket is the forgiving one: it is for things that belong in the levered measure and only the levered measure.',
    scenario:
      'Thorne Industrial: a term loan with a 1% annual amortisation, an undrawn revolver, ${cash}m of cash on the balance sheet, and a ${nol}m NOL carryforward that shelters tax in years 1 to 3. You are building both an unlevered forecast for the DCF and a levered one for the credit committee.',
    conventions: [
      'Unlevered free cash flow = EBIT, less cash taxes on EBIT, plus non-cash charges, less capex, less the increase in net working capital. No interest, no principal, no non-operating income.',
      'Levered free cash flow here is cash flow to equity: after cash interest, after mandatory debt repayment, and after net borrowing.',
      'Every item that belongs in the unlevered measure also belongs in the levered one. The middle bucket is for items that belong ONLY in the levered one.',
      'Cash taxes are modelled inside the forecast, so the NOL is used in the projection rather than valued separately and added to enterprise value.',
      'Stock and flow are different things: a balance at a point in time is not a cash flow.',
    ],
    skills: ['dcf-ufcf-build', 'dcf-lfcf-build', 'dcf-interest-exclusion', 'dcf-cash-taxes', 'dcf-nol'],
    estSeconds: 360,
    presentation: { showBase: false, timerSeconds: 360 },
    // Which bucket each item belongs in is a matter of what KIND of flow it is, so no amount here
    // can change an answer. They vary anyway: a sorting exercise you have already done is still a
    // memory test, and moving the figures is what stops the scenario reading as the same page.
    vars: [
      { id: 'cash', label: 'cash balance', domain: [120, 200, 90, 300] },
      { id: 'nol', label: 'NOL carryforward', domain: [200, 300, 150, 400] },
      { id: 'dividend', label: 'dividend', domain: [40, 60, 30, 75] },
      { id: 'revolver', label: 'revolver draw', domain: [50, 80, 35, 100] },
      { id: 'buyback', label: 'share repurchase', domain: [75, 120, 50, 150] },
    ],
    buckets: [
      { id: 'unlevered', label: 'In unlevered free cash flow' },
      { id: 'levered', label: 'Only in levered free cash flow', lenient: true },
      { id: 'neither', label: 'In neither' },
    ],
    items: [
      {
        id: 'tax-on-ebit', label: 'Cash taxes calculated on EBIT', bucket: 'unlevered',
        explain: 'Tax on EBIT is the unlevered tax line: it deliberately ignores the interest deduction, because the WACC is already paying for that through the after-tax cost of debt.',
      },
      {
        id: 'interest-after-tax', label: 'Cash interest on the term loan, net of tax', bucket: 'levered',
        explain: 'The line that defines the difference. Unlevered means before financing costs; levered is what is left for equity after the lenders have been paid.',
      },
      {
        id: 'dividend', label: 'The ${dividend}m dividend paid to common shareholders', bucket: 'neither',
        explain: 'Levered free cash flow is the cash available TO equity, measured before equity decides what to do with it. A dividend is that decision, so it sits below both measures.',
      },
      {
        id: 'dna', label: 'Depreciation and amortisation', bucket: 'unlevered',
        explain: 'Non-cash, so it is added back in both builds. It still matters in cash terms because it reduces the tax base.',
      },
      {
        id: 'mandatory-amort', label: 'The 1% annual mandatory amortisation', bucket: 'levered',
        explain: 'Principal repayment is a financing flow. It never touches an unlevered number and it is exactly what the credit committee wants to see the levered number cover.',
      },
      {
        id: 'cash-balance', label: 'The ${cash}m cash balance itself', bucket: 'neither',
        explain: 'A stock, not a flow. Cash sits in the bridge from enterprise value to equity value. Only the income it earns shows up in a cash flow forecast, and only in the levered one.',
      },
      {
        id: 'nwc', label: 'The increase in receivables and inventory', bucket: 'unlevered',
        explain: 'Operating cash tied up in the business, in both measures. Growth consumes working capital, which is why a fast-growing profitable company can still be cash hungry.',
      },
      {
        id: 'revolver-draw', label: 'A ${revolver}m revolver draw to fund the seasonal working capital swing', bucket: 'levered',
        explain: 'Net borrowing is part of the levered measure, because cash flow to equity is struck after what the lenders put in as well as after what they take out. An unlevered cash flow ignores where the money came from entirely.',
      },
      {
        id: 'equity-issue', label: 'Proceeds from issuing new shares to fund an acquisition', bucket: 'neither',
        explain: 'The near-miss against the revolver draw, and the reason to be precise about what levered free cash flow measures. New debt is in it because cash flow to equity is after net borrowing. New equity is not: money put in by shareholders is not cash generated for shareholders.',
      },
      {
        id: 'capex', label: 'Capital expenditure', bucket: 'unlevered',
        explain: 'Cash spent to run and grow the business, in both measures. If capex sits below D&A for every forecast year, the model is quietly assuming the asset base shrinks.',
      },
      {
        id: 'interest-income', label: 'Interest income earned on the ${cash}m cash balance', bucket: 'levered',
        explain: 'Non-operating income, so it is stripped out of an unlevered forecast: the DCF values the operations, and the cash itself is added back in the bridge. It sits in net income, so it is in the levered measure.',
      },
      {
        id: 'buyback', label: 'A ${buyback}m share repurchase', bucket: 'neither',
        explain: 'The same argument as the dividend, in a different wrapper. It is a distribution out of cash the business has already produced, not a step in producing it.',
      },
      {
        id: 'nol', label: 'The NOL carryforward sheltering tax in years 1 to 3', bucket: 'unlevered',
        explain: 'Under the convention pinned above the NOL lowers cash taxes inside the forecast, so it lifts unlevered free cash flow in those years. The alternative treatment is to tax at the full rate and add the present value of the NOL as a separate bridge item, and mixing the two counts it twice.',
      },
    ],
  },
];
