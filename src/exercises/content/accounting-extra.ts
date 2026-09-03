import type { Exercise } from '../lib/schema';

/** Authored content. See /tmp/AUTHORING_BRIEF.md for the rules the gate enforces. */
//
// Six exercises across four formats. The two grids reuse the base model from accounting.ts —
// revenue 1,000 down to net income 150, a balance sheet that foots at 1,250 — so a learner
// working through the module meets the same company each time and only has to hold the shock in
// their head. Both grids balance before and after, at every value in their shock domain.

export const ACCOUNTING_EXTRA: Exercise[] = [
  // ------------------------------------------------------------------ easy
  {
    id: 'accx-board-deferred-revenue',
    module: 'accounting',
    tier: 'easy',
    kind: 'ternary-board',
    title: 'Cash upfront for a service not yet delivered',
    prompt:
      'On 31 December a customer pays you ${fee} in cash for a twelve-month support contract that starts in January. Nothing has been delivered yet. Mark which way each line moves on the day the money arrives.',
    conventions: [
      'The contract has not started, so no part of the fee has been earned.',
      'Ignore any tax effect.',
    ],
    skills: ['deferred-revenue', 'is-recognition', 'cfs-nwc', 'accrual-vs-cash'],
    estSeconds: 75,
    // The fee is the only free number. Which lines move is the lesson and none of it depends on
    // the size of the cheque, so the domain can be wide; multiples of 12 keep the monthly release
    // to revenue a whole number, which is the one figure downstream of the fee.
    vars: [{ id: 'fee', label: 'upfront fee', domain: [120, 60, 180, 240] }],
    derived: [{ id: 'monthly', label: 'released to revenue each month', expr: 'fee / 12' }],
    presentation: { showBase: true },
    rows: [
      {
        id: 'cash',
        label: 'Cash',
        direction: 'up',
        explain: 'The money is in the bank the day it arrives. Cash never waits for the accounting.',
      },
      {
        id: 'deferred-revenue',
        label: 'Deferred revenue',
        direction: 'up',
        explain:
          'The other side of the cash. You owe the customer a year of service, and that obligation is a liability until you deliver it.',
      },
      {
        id: 'revenue',
        label: 'Revenue',
        direction: 'none',
        explain:
          'Revenue is recognised when the service is delivered, not when the cash is collected. In January you start releasing ${monthly} a month into revenue.',
      },
      {
        id: 'ar',
        label: 'Accounts receivable',
        direction: 'none',
        explain: 'They paid in cash, so there is nothing left to collect. A receivable is the opposite case: earned but not yet paid.',
      },
      {
        id: 'net-income',
        label: 'Net income',
        direction: 'none',
        explain: 'No revenue and no expense have been recognised, so nothing reaches the bottom line.',
      },
      {
        id: 'cfo',
        label: 'Cash from operations',
        direction: 'up',
        explain:
          'The ${fee} shows up as an increase in deferred revenue inside the working capital section. Net income is flat and operating cash is up ${fee}, which is the gap between profit and cash in one line.',
      },
      {
        id: 'total-assets',
        label: 'Total assets',
        direction: 'up',
        explain: 'Cash is up ${fee} and no other asset moved.',
      },
      {
        id: 'total-liabilities',
        label: 'Total liabilities',
        direction: 'up',
        explain: 'Deferred revenue is up ${fee}, which is what keeps the balance sheet balanced.',
      },
      {
        id: 'retained-earnings',
        label: 'Retained earnings',
        direction: 'none',
        explain: 'Retained earnings only move with net income or dividends, and neither has happened.',
      },
      {
        id: 'total-equity',
        label: 'Total equity',
        direction: 'none',
        explain:
          'Getting paid early makes you no richer. The whole increase in assets is matched by a liability, so equity is untouched.',
      },
    ],
  },

  {
    id: 'accx-numeric-accrual-net-income',
    module: 'accounting',
    tier: 'easy',
    kind: 'numeric',
    title: 'Net income on the accrual basis',
    prompt:
      'A services business closes its first year. Work out net income on the accrual basis from the lines below. Two of the figures are about cash rather than earnings.',
    conventions: [
      'Accrual accounting: revenue is recognised when the service is delivered, not when it is collected.',
      'The tax rate applies to pre-tax income, and there is no interest expense.',
    ],
    skills: ['accrual-vs-cash', 'is-recognition', 'is-tax-effect'],
    estSeconds: 90,
    // What was delivered and what was collected are the two numbers the lesson turns on, so both
    // move. Collected stays below delivered at every combination — the stem's receivable has to
    // stay a receivable — and stays above the 350 of costs, so the cash-basis near miss remains a
    // positive number rather than a loss the exercise never mentions. Costs and the tax rate are
    // named but do not move: the point is accrual against cash, not arithmetic stamina.
    vars: [
      { id: 'delivered', label: 'services delivered and invoiced', domain: [500, 600, 450, 700] },
      { id: 'collected', label: 'cash collected', domain: [400, 430, 370, 440] },
    ],
    derived: [
      { id: 'opex', label: 'operating expenses', expr: '300' },
      { id: 'dep', label: 'depreciation', expr: '50' },
      { id: 'receivable', label: 'closing receivable', expr: 'delivered - collected' },
      { id: 'pretax', label: 'pre-tax income', expr: 'delivered - opex - dep' },
      { id: 'tax', label: 'tax', expr: 'pretax * 0.4' },
      { id: 'netIncome', label: 'net income', expr: 'pretax - tax' },
    ],
    presentation: { showBase: true },
    givens: [
      { label: 'Services delivered and invoiced', value: '${delivered}' },
      { label: 'Cash collected from customers', value: '${collected}' },
      { label: 'Operating expenses incurred and paid', value: '${opex}' },
      { label: 'Depreciation', value: '${dep}' },
      { label: 'Tax rate', value: '40%' },
    ],
    question: 'What is net income for the year?',
    answer: 90,
    answerExpr: 'netIncome',
    tolerance: 0.5,
    nearMisses: [
      {
        value: 30,
        valueExpr: '(collected - opex - dep) * 0.6',
        note:
          'You used the ${collected} collected instead of the ${delivered} delivered. Cash collected is a balance sheet event: the missing ${receivable} is a receivable, and it was already earned.',
      },
      {
        value: 120,
        valueExpr: '(delivered - opex) * 0.6',
        note: 'You dropped depreciation. It is a real expense on the income statement even though no cash moves.',
      },
      {
        value: 150,
        valueExpr: 'pretax',
        note: 'That is pre-tax income. Take 40% off it.',
      },
      {
        value: 100,
        valueExpr: 'receivable',
        note:
          'That is the receivable, not the profit. It is the difference between what you earned and what you collected.',
      },
    ],
    working: [
      'Revenue is what you delivered: ${delivered}.',
      'Pre-tax income = {delivered} - {opex} - {dep} = ${pretax}.',
      'Tax at 40% is ${tax}, so net income is ${netIncome}.',
      'Cash and profit are not the same number here: ${receivable} of that revenue is still sitting in receivables, and the ${dep} of depreciation never moved any cash at all.',
    ],
  },

  // ---------------------------------------------------------------- medium
  {
    id: 'accx-grid-sbc-20',
    module: 'accounting',
    tier: 'medium',
    kind: 'statement-grid',
    title: 'Stock-based compensation charged',
    prompt:
      'The company grants stock to its staff and books a ${shock} stock-based compensation charge for the year. No shares have been sold and no cash has left the business. Work it through all three statements.',
    conventions: [
      'Tax rate is 40%, the company is profitable, and the charge is deductible in full this year.',
      'Expenses are shown as negative numbers.',
      'The credit side of the charge goes to common stock and additional paid-in capital. Ignore any share count or dilution effect.',
    ],
    taxRate: 0.4,
    // Multiples of 5 keep the 40% tax effect whole.
    shock: { label: 'stock-based compensation charge', value: 20, domain: [20, 10, 30, 40] },
    derived: [
      { id: 'taxSaved', label: 'tax saved', expr: 'shock * 0.4' },
      { id: 'afterTax', label: 'after-tax cost', expr: 'shock * 0.6' },
    ],
    skills: [
      'is-sbc',
      'is-tax-effect',
      'cfs-noncash-addback',
      'bs-paid-in-capital',
      'bs-retained-earnings',
      'bs-cash-plug',
    ],
    estSeconds: 270,
    presentation: { showBase: true, includeDistractors: true },
    rows: [
      // --- income statement
      { id: 'revenue', label: 'Revenue', statement: 'is', base: 1000, delta: 0, explain: 'Paying people in stock does not sell anything.' },
      { id: 'cogs', label: 'Cost of goods sold', statement: 'is', base: -400, delta: 0 },
      { id: 'sga', label: 'SG&A', statement: 'is', base: -200, delta: 0, explain: 'The charge is broken out on its own line below, so SG&A itself does not move. In a real filing it would be buried inside this line.' },
      {
        id: 'sbc', label: 'Stock-based compensation', statement: 'is', base: 0, delta: -20, perShock: -1, skills: ['is-sbc'],
        explain: 'The shock. Stock-based compensation is an expense: the staff were paid, and the fact that they were paid in paper rather than cash does not make the cost disappear.',
      },
      { id: 'depreciation', label: 'Depreciation', statement: 'is', base: -100, delta: 0, explain: 'Nothing was bought or written off. This line is a distractor.' },
      {
        id: 'ebit', computed: true, label: 'EBIT', statement: 'is', base: 300, delta: -20, emphasis: 'subtotal',
        derive: { parents: [{ row: 'revenue', sign: 1 }, { row: 'cogs', sign: 1 }, { row: 'sga', sign: 1 }, { row: 'sbc', sign: 1 }, { row: 'depreciation', sign: 1 }] },
        explain: 'Operating income takes the full ${shock}, before tax relief.',
      },
      { id: 'interest', label: 'Interest expense', statement: 'is', base: -50, delta: 0, explain: 'Issuing stock is not borrowing. Interest is untouched.' },
      {
        id: 'pretax', computed: true, label: 'Pre-tax income', statement: 'is', base: 250, delta: -20, emphasis: 'subtotal',
        derive: { parents: [{ row: 'ebit', sign: 1 }, { row: 'interest', sign: 1 }] },
      },
      {
        id: 'tax', label: 'Taxes', statement: 'is', base: -100, delta: 8, perShock: 0.4, skills: ['is-tax-effect'],
        derive: { parents: [{ row: 'pretax', sign: 1 }], times: -0.4 },
        explain: '40% of the ${shock} charge, so ${taxSaved} less tax. This is the only line on which the transaction moves any cash at all.',
      },
      {
        id: 'net-income', computed: true, label: 'Net income', statement: 'is', base: 150, delta: -12, emphasis: 'total',
        derive: { parents: [{ row: 'pretax', sign: 1 }, { row: 'tax', sign: 1 }] },
        explain: 'Down ${afterTax}: the ${shock} charge net of ${taxSaved} of tax saved.',
      },

      // --- cash flow statement
      {
        id: 'cf-net-income', computed: true, label: 'Net income', statement: 'cfs', section: 'Operating', base: 150, delta: -12,
        derive: { parents: [{ row: 'net-income', sign: 1 }] },
      },
      { id: 'cf-depreciation', label: 'Add back: depreciation', statement: 'cfs', section: 'Operating', base: 100, delta: 0, explain: 'Depreciation did not change. Another distractor.' },
      {
        id: 'cf-sbc', label: 'Add back: stock-based compensation', statement: 'cfs', section: 'Operating', base: 0, delta: 20, perShock: 1, skills: ['cfs-noncash-addback'],
        explain: 'No cash left the business, so the whole ${shock} comes back. Treating this add-back as free money is the mistake the line is famous for: the cost is real, it is just paid in shares.',
      },
      { id: 'cf-nwc', label: 'Change in working capital', statement: 'cfs', section: 'Operating', base: 0, delta: 0, explain: 'No receivable, payable or inventory moved.' },
      {
        id: 'cfo', computed: true, label: 'Cash from operations', statement: 'cfs', section: 'Operating', base: 250, delta: 8, emphasis: 'subtotal',
        derive: { parents: [{ row: 'cf-net-income', sign: 1 }, { row: 'cf-depreciation', sign: 1 }, { row: 'cf-sbc', sign: 1 }, { row: 'cf-nwc', sign: 1 }] },
        explain: 'Up ${taxSaved}, which is exactly the tax saved. Net income fell ${afterTax} and ${shock} came straight back.',
      },
      { id: 'capex', label: 'Capital expenditure', statement: 'cfs', section: 'Investing', base: -150, delta: 0 },
      { id: 'cff', label: 'Cash from financing', statement: 'cfs', section: 'Financing', base: 0, delta: 0, explain: 'Stock issued to staff as compensation is not a financing inflow. Nobody handed the company any money.' },
      {
        id: 'net-change-cash', computed: true, label: 'Net change in cash', statement: 'cfs', base: 100, delta: 8, emphasis: 'subtotal',
        derive: { parents: [{ row: 'cfo', sign: 1 }, { row: 'capex', sign: 1 }, { row: 'cff', sign: 1 }] },
      },
      { id: 'cf-beginning-cash', label: 'Cash at start of year', statement: 'cfs', base: 100, delta: 0, explain: 'Last year closed here.' },
      {
        id: 'cf-ending-cash', computed: true, label: 'Cash at end of year', statement: 'cfs', base: 200, delta: 8, emphasis: 'total',
        derive: { parents: [{ row: 'net-change-cash', sign: 1 }, { row: 'cf-beginning-cash', sign: 1 }] },
      },

      // --- balance sheet
      {
        id: 'cash', computed: true, label: 'Cash', statement: 'bs', section: 'Assets', base: 200, delta: 8, skills: ['bs-cash-plug'],
        derive: { parents: [{ row: 'cf-ending-cash', sign: 1 }] },
        explain: 'Carried across from the bottom of the cash flow statement.',
      },
      { id: 'ar', label: 'Accounts receivable', statement: 'bs', section: 'Assets', base: 150, delta: 0 },
      { id: 'inventory', label: 'Inventory', statement: 'bs', section: 'Assets', base: 100, delta: 0 },
      { id: 'ppe', label: 'PP&E, net', statement: 'bs', section: 'Assets', base: 800, delta: 0, explain: 'Compensation of any kind stays off the asset side.' },
      {
        id: 'total-assets', computed: true, label: 'Total assets', statement: 'bs', section: 'Assets', base: 1250, delta: 8, emphasis: 'total',
        derive: { parents: [{ row: 'cash', sign: 1 }, { row: 'ar', sign: 1 }, { row: 'inventory', sign: 1 }, { row: 'ppe', sign: 1 }] },
        explain: 'Up ${taxSaved}, all of it cash the tax authority did not take.',
      },
      { id: 'ap', label: 'Accounts payable', statement: 'bs', section: 'Liabilities & equity', base: 100, delta: 0 },
      { id: 'debt', label: 'Debt', statement: 'bs', section: 'Liabilities & equity', base: 500, delta: 0 },
      {
        id: 'common-stock', label: 'Common stock & APIC', statement: 'bs', section: 'Liabilities & equity', base: 300, delta: 20, perShock: 1, skills: ['bs-paid-in-capital'],
        explain: 'The credit side of the charge. The expense is settled in shares, so paid-in capital rises by the full ${shock} before tax. This is the line candidates forget, and without it the balance sheet is out by ${shock}.',
      },
      {
        id: 'retained-earnings', computed: true, label: 'Retained earnings', statement: 'bs', section: 'Liabilities & equity', base: 350, delta: -12,
        derive: { parents: [{ row: 'net-income', sign: 1 }], offset: 200 },
        explain: 'Opening $200 plus this year’s net income, so it falls by the ${afterTax} net charge.',
      },
      {
        id: 'total-le', computed: true, label: 'Total liabilities & equity', statement: 'bs', section: 'Liabilities & equity', base: 1250, delta: 8, emphasis: 'total',
        derive: { parents: [{ row: 'ap', sign: 1 }, { row: 'debt', sign: 1 }, { row: 'common-stock', sign: 1 }, { row: 'retained-earnings', sign: 1 }] },
        explain: 'Up ${taxSaved}: paid-in capital +${shock} against retained earnings -${afterTax}. Equity has shuffled within itself and grown by the tax saving.',
      },
    ],
    balance: {
      assets: ['cash', 'ar', 'inventory', 'ppe'],
      liabilitiesEquity: ['ap', 'debt', 'common-stock', 'retained-earnings'],
    },
  },

  {
    id: 'accx-bridge-ni-to-cfo',
    module: 'accounting',
    tier: 'medium',
    kind: 'bridge',
    title: 'Net income to cash from operations',
    prompt:
      'Build this year’s cash from operations from net income using the indirect method. Some of the items on the tray belong somewhere else on the cash flow statement. Leave those in the tray, and give the closing figure.',
    conventions: [
      'Indirect method, starting from net income.',
      'A source of cash is an addition and a use of cash is a subtraction.',
      'Every working capital movement shown is operating. Nothing here is an investing or financing balance in disguise except where the item says so.',
    ],
    skills: ['cfs-indirect-method', 'cfs-nwc', 'cfs-noncash-addback', 'accrual-vs-cash'],
    estSeconds: 240,
    // The five amounts that carry the bridge. The three traps (capex, dividends, the disposal
    // proceeds) and the small accruals keep their authored sizes: what they are worth is not what
    // is being tested, and the closing figure moves on every variant regardless. Every value is a
    // whole number and cash from operations stays comfortably positive across the whole grid, so
    // the exercise never quietly becomes a different one.
    vars: [
      { id: 'ni', label: 'net income', domain: [120, 100, 150, 90] },
      { id: 'da', label: 'depreciation and amortisation', domain: [60, 45, 80, 30] },
      { id: 'arDecrease', label: 'decrease in receivables', domain: [25, 40, 15, 35] },
      { id: 'inventoryIncrease', label: 'increase in inventory', domain: [20, 30, 10, 45] },
      { id: 'deferredRevenue', label: 'increase in deferred revenue', domain: [15, 25, 10, 30] },
    ],
    presentation: { includeDistractors: true },
    startLabel: 'Net income',
    startValue: 120,
    startValueExpr: 'ni',
    targetLabel: 'Cash from operations',
    // Re-derived from the start value and the items on every variant. The authored figure below is
    // what that comes to at the defaults, and the gate holds the two together.
    targetValue: 230,
    requireTotal: true,
    tolerance: 0.5,
    items: [
      {
        id: 'da', label: 'Depreciation and amortisation', role: 'add', amount: 60, amountExpr: 'da', detail: 'note 6',
        explain: 'The standard non-cash charge. It reduced net income and moved no cash, so it comes back in full.',
      },
      {
        id: 'bad-debt', label: 'Increase in the allowance for doubtful accounts', role: 'add', amount: 5, detail: 'charged to SG&A',
        explain:
          'The provision is an expense that no cash has yet answered for. The customer has not paid and may never pay, but nothing has left the bank, so the charge is added back.',
      },
      {
        id: 'loss-disposal', label: 'Loss on disposal of a delivery van', role: 'add', amount: 8,
        explain:
          'The loss is the book value written off less what the van fetched. No cash moved through this line, and the cash that did move belongs in investing, so the loss is reversed out of operating.',
      },
      {
        id: 'ar-decrease', label: 'Decrease in accounts receivable', role: 'add', amount: 25, amountExpr: 'arDecrease', detail: 'a large customer settled its balance',
        explain:
          'Revenue was recognised in an earlier period and the cash arrived in this one. Collecting a receivable turns a balance sheet asset into cash without touching the income statement.',
      },
      {
        id: 'inventory-increase', label: 'Increase in inventory', role: 'subtract', amount: 20, amountExpr: 'inventoryIncrease', detail: 'stock built ahead of a launch',
        explain: 'You paid for goods you have not sold. Cash is out and no expense has been recognised, so it is a use of cash.',
      },
      {
        id: 'ap-increase', label: 'Increase in accounts payable', role: 'add', amount: 12,
        explain: 'You took the goods and have not paid for them yet. Stretching your suppliers is a source of cash, though not one you can repeat forever.',
      },
      {
        id: 'deferred-revenue', label: 'Increase in deferred revenue', role: 'add', amount: 15, amountExpr: 'deferredRevenue', detail: 'annual contracts billed upfront',
        explain: 'Customers paid ahead of delivery. The cash is in and the revenue is not, so operating cash runs ahead of profit.',
      },
      {
        id: 'prepaid-increase', label: 'Increase in prepaid expenses', role: 'subtract', amount: 4, detail: 'next year’s insurance premium',
        explain: 'You have paid for something you have not consumed. Cash is out, the expense is not yet on the income statement, so it is a use of cash.',
      },
      {
        id: 'accrued-expenses', label: 'Increase in accrued expenses', role: 'add', amount: 9, detail: 'staff bonus declared, paid in March',
        explain: 'The expense is in net income and the cash has not gone yet. The mirror image of a prepaid.',
      },
      {
        id: 'capex', label: 'Purchase of equipment', role: 'out', amount: 45,
        explain:
          'Investing, not operating. This is the item that makes cash from operations look better than the business is: leave it out here, then subtract it when you get to free cash flow.',
      },
      {
        id: 'dividends', label: 'Dividends paid', role: 'out', amount: 30,
        explain: 'Financing. A dividend is a distribution of profit, not a cost of earning it, so it never touches operating cash flow.',
      },
      {
        id: 'disposal-proceeds', label: 'Cash received for the delivery van', role: 'out', amount: 40,
        explain:
          'Investing. The trap is to see the loss added back above and reach for the proceeds as well. The loss belongs in operating because it was a non-cash charge; the money belongs in investing.',
      },
    ],
  },

  // ------------------------------------------------------------------ hard
  {
    id: 'accx-grid-asset-sale',
    module: 'accounting',
    tier: 'hard',
    kind: 'statement-grid',
    title: 'A machine sold above book value',
    prompt:
      'You sell a machine for cash at 150% of its net book value of ${shock}, so ${proceeds} comes in and a ${gain} gain is booked. Work it through all three statements.',
    conventions: [
      'Tax rate is {taxPct}% and the gain is taxed this year at that rate.',
      'The gain is reported inside operating income.',
      'No depreciation is charged on the machine in the year of sale, and it is not replaced.',
      'Expenses are shown as negative numbers.',
    ],
    taxRate: 0.4,
    // The shock is the net book value. Proceeds are 1.5x it and the gain is 0.5x it, so every line
    // scales cleanly and the 40% tax on the gain stays whole for any multiple of 10.
    shock: { label: 'net book value of the machine sold', value: 40, domain: [40, 20, 60, 80] },
    derived: [
      // The rate is named rather than typed into the prose because the default book value is also
      // 40: a bare "40%" in a stem is otherwise indistinguishable from a shock that failed to move.
      { id: 'taxPct', label: 'tax rate, per cent', expr: '40' },
      { id: 'proceeds', label: 'sale proceeds', expr: 'shock * 1.5' },
      { id: 'gain', label: 'gain on sale', expr: 'shock * 0.5' },
      { id: 'taxOnGain', label: 'tax on the gain', expr: 'shock * 0.2' },
      { id: 'afterTaxGain', label: 'after-tax gain', expr: 'shock * 0.3' },
      { id: 'cashUp', label: 'increase in cash', expr: 'shock * 1.3' },
    ],
    skills: [
      'is-gain-on-sale',
      'is-tax-effect',
      'cfs-gain-reversal',
      'cfs-investing',
      'bs-ppe',
      'bs-cash-plug',
    ],
    estSeconds: 330,
    presentation: { showBase: false, includeDistractors: true, timerSeconds: 330 },
    rows: [
      // --- income statement
      { id: 'revenue', label: 'Revenue', statement: 'is', base: 1000, delta: 0, explain: 'Selling a fixed asset is not a sale of goods. The proceeds never go through the top line.' },
      { id: 'cogs', label: 'Cost of goods sold', statement: 'is', base: -400, delta: 0 },
      { id: 'sga', label: 'SG&A', statement: 'is', base: -200, delta: 0 },
      { id: 'depreciation', label: 'Depreciation', statement: 'is', base: -100, delta: 0, explain: 'By convention no depreciation is charged on the machine in its year of sale, and nothing was bought to replace it. A distractor.' },
      {
        id: 'gain', label: 'Gain on sale of assets', statement: 'is', base: 0, delta: 20, perShock: 0.5, skills: ['is-gain-on-sale'],
        explain: 'Proceeds of ${proceeds} less the ${shock} you still carried the machine at. Only the ${gain} gain is income; the other ${shock} is your own asset coming back to you.',
      },
      {
        id: 'ebit', computed: true, label: 'EBIT', statement: 'is', base: 300, delta: 20, emphasis: 'subtotal',
        derive: { parents: [{ row: 'revenue', sign: 1 }, { row: 'cogs', sign: 1 }, { row: 'sga', sign: 1 }, { row: 'depreciation', sign: 1 }, { row: 'gain', sign: 1 }] },
      },
      { id: 'interest', label: 'Interest expense', statement: 'is', base: -50, delta: 0, explain: 'No debt was repaid with the proceeds, so interest is unchanged.' },
      {
        id: 'pretax', computed: true, label: 'Pre-tax income', statement: 'is', base: 250, delta: 20, emphasis: 'subtotal',
        derive: { parents: [{ row: 'ebit', sign: 1 }, { row: 'interest', sign: 1 }] },
      },
      {
        id: 'tax', label: 'Taxes', statement: 'is', base: -100, delta: -8, perShock: -0.2, skills: ['is-tax-effect'],
        derive: { parents: [{ row: 'pretax', sign: 1 }], times: -0.4 },
        explain: '{taxPct}% of the ${gain} gain, so ${taxOnGain} more tax. Note the direction: this is the one transaction on the module where tax goes up.',
      },
      {
        id: 'net-income', computed: true, label: 'Net income', statement: 'is', base: 150, delta: 12, emphasis: 'total',
        derive: { parents: [{ row: 'pretax', sign: 1 }, { row: 'tax', sign: 1 }] },
        explain: 'Up ${afterTaxGain}: the ${gain} gain net of ${taxOnGain} of tax.',
      },

      // --- cash flow statement
      {
        id: 'cf-net-income', computed: true, label: 'Net income', statement: 'cfs', section: 'Operating', base: 150, delta: 12,
        derive: { parents: [{ row: 'net-income', sign: 1 }] },
      },
      { id: 'cf-depreciation', label: 'Add back: depreciation', statement: 'cfs', section: 'Operating', base: 100, delta: 0, explain: 'Unchanged, because no depreciation was charged on the machine this year.' },
      {
        id: 'cf-gain', label: 'Less: gain on sale of assets', statement: 'cfs', section: 'Operating', base: 0, delta: -20, perShock: -0.5, skills: ['cfs-gain-reversal'],
        explain:
          'The buried step. The gain is in net income at the top of this statement, but the cash it relates to is investing cash, and all ${proceeds} of it is about to be shown down there. Leave the gain in operating and you count ${gain} of the same money twice, so it is stripped out here.',
      },
      { id: 'cf-nwc', label: 'Change in working capital', statement: 'cfs', section: 'Operating', base: 0, delta: 0, explain: 'A machine is not working capital. No receivable, payable or inventory moved.' },
      {
        id: 'cfo', computed: true, label: 'Cash from operations', statement: 'cfs', section: 'Operating', base: 250, delta: -8, emphasis: 'subtotal',
        derive: { parents: [{ row: 'cf-net-income', sign: 1 }, { row: 'cf-depreciation', sign: 1 }, { row: 'cf-gain', sign: 1 }, { row: 'cf-nwc', sign: 1 }] },
        explain: 'Operating cash falls ${taxOnGain}. All you did in operations was pay tax on a gain you earned elsewhere.',
      },
      { id: 'capex', label: 'Capital expenditure', statement: 'cfs', section: 'Investing', base: -150, delta: 0, explain: 'The machine is not being replaced, so the capex programme is unchanged.' },
      {
        id: 'cf-proceeds', label: 'Proceeds from sale of assets', statement: 'cfs', section: 'Investing', base: 0, delta: 60, perShock: 1.5, skills: ['cfs-investing'],
        explain: 'The full ${proceeds} of cash, not the ${gain} gain. Investing shows what actually came through the door.',
      },
      { id: 'cff', label: 'Cash from financing', statement: 'cfs', section: 'Financing', base: 0, delta: 0 },
      {
        id: 'net-change-cash', computed: true, label: 'Net change in cash', statement: 'cfs', base: 100, delta: 52, emphasis: 'subtotal',
        derive: { parents: [{ row: 'cfo', sign: 1 }, { row: 'capex', sign: 1 }, { row: 'cff', sign: 1 }, { row: 'cf-proceeds', sign: 1 }] },
        explain: 'Up ${cashUp}: the ${proceeds} that came in, less the ${taxOnGain} of tax on the gain.',
      },
      { id: 'cf-beginning-cash', label: 'Cash at start of year', statement: 'cfs', base: 100, delta: 0 },
      {
        id: 'cf-ending-cash', computed: true, label: 'Cash at end of year', statement: 'cfs', base: 200, delta: 52, emphasis: 'total',
        derive: { parents: [{ row: 'net-change-cash', sign: 1 }, { row: 'cf-beginning-cash', sign: 1 }] },
      },

      // --- balance sheet
      {
        id: 'cash', computed: true, label: 'Cash', statement: 'bs', section: 'Assets', base: 200, delta: 52, skills: ['bs-cash-plug'],
        derive: { parents: [{ row: 'cf-ending-cash', sign: 1 }] },
      },
      { id: 'ar', label: 'Accounts receivable', statement: 'bs', section: 'Assets', base: 150, delta: 0, explain: 'The buyer paid cash. Nothing is owed to you.' },
      { id: 'inventory', label: 'Inventory', statement: 'bs', section: 'Assets', base: 100, delta: 0 },
      {
        id: 'ppe', label: 'PP&E, net', statement: 'bs', section: 'Assets', base: 800, delta: -40, perShock: -1, skills: ['bs-ppe'],
        explain: 'PP&E comes off at book value, ${shock}, not at the ${proceeds} you sold it for. The extra ${gain} was never on your balance sheet, which is precisely why it is a gain.',
      },
      {
        id: 'total-assets', computed: true, label: 'Total assets', statement: 'bs', section: 'Assets', base: 1250, delta: 12, emphasis: 'total',
        derive: { parents: [{ row: 'cash', sign: 1 }, { row: 'ar', sign: 1 }, { row: 'inventory', sign: 1 }, { row: 'ppe', sign: 1 }] },
        explain: 'Up ${afterTaxGain}: cash up ${cashUp} against PP&E down ${shock}. That ${afterTaxGain} is the after-tax gain, and it is the only thing that made you richer.',
      },
      { id: 'ap', label: 'Accounts payable', statement: 'bs', section: 'Liabilities & equity', base: 100, delta: 0 },
      { id: 'debt', label: 'Debt', statement: 'bs', section: 'Liabilities & equity', base: 500, delta: 0, explain: 'The proceeds are sitting in cash. Nobody said they were used to pay anything down.' },
      { id: 'common-stock', label: 'Common stock', statement: 'bs', section: 'Liabilities & equity', base: 300, delta: 0 },
      {
        id: 'retained-earnings', computed: true, label: 'Retained earnings', statement: 'bs', section: 'Liabilities & equity', base: 350, delta: 12,
        derive: { parents: [{ row: 'net-income', sign: 1 }], offset: 200 },
      },
      {
        id: 'total-le', computed: true, label: 'Total liabilities & equity', statement: 'bs', section: 'Liabilities & equity', base: 1250, delta: 12, emphasis: 'total',
        derive: { parents: [{ row: 'ap', sign: 1 }, { row: 'debt', sign: 1 }, { row: 'common-stock', sign: 1 }, { row: 'retained-earnings', sign: 1 }] },
      },
    ],
    balance: {
      assets: ['cash', 'ar', 'inventory', 'ppe'],
      liabilitiesEquity: ['ap', 'debt', 'common-stock', 'retained-earnings'],
    },
  },

  {
    id: 'accx-numeric-capitalise-vs-expense',
    module: 'accounting',
    tier: 'hard',
    kind: 'numeric',
    title: 'Capitalising software spend: the cash flow effect',
    prompt:
      'The finance director wants to capitalise this year’s software development spend instead of expensing it, and says it will not change the cash position. Work out what it does to cash from operations in year one.',
    conventions: [
      'Compare the same year under the two policies: expense the spend in full, or capitalise it and amortise it.',
      'Tax is {taxPct}% of pre-tax income and all of it is paid in cash this year. No deferred tax.',
      'Amortisation runs for a full year in year one. There is no half-year convention.',
      'Capitalised spend is shown as capital expenditure in the investing section.',
    ],
    skills: ['capitalise-vs-expense', 'cfs-classification', 'is-tax-effect', 'accrual-vs-cash'],
    estSeconds: 300,
    // The spend and the amortisation period drive every figure in the exercise, so both move; the
    // spend goes first because it changes all six near misses at once. Every spend divides by
    // every period, and the surviving expense is always a multiple of 5, so the 40% cash tax lands
    // whole at all twelve combinations. The rate itself is named rather than typed into the prose:
    // the default amortisation charge is also 40, and a bare "40%" in a stem would be
    // indistinguishable from a figure that failed to move. Revenue and the dividend are
    // distractors — neither belongs in the answer — so they keep their authored values.
    vars: [
      { id: 'spend', label: 'software development spend', domain: [200, 300, 400, 100] },
      { id: 'years', label: 'amortisation period', domain: [5, 4, 2] },
    ],
    derived: [
      { id: 'taxPct', label: 'tax rate, per cent', expr: '40' },
      { id: 'amort', label: 'year-one amortisation', expr: 'spend / years' },
      { id: 'expenseDiff', label: 'pre-tax income difference', expr: 'spend - amort' },
      { id: 'taxDiff', label: 'extra cash tax', expr: 'expenseDiff * 0.4' },
      { id: 'cfoDiff', label: 'cash from operations difference', expr: 'spend - taxDiff' },
    ],
    presentation: { showBase: false, includeDistractors: true, timerSeconds: 300 },
    givens: [
      { label: 'Software development spend, paid in cash', value: '${spend}' },
      { label: 'Amortisation period if capitalised', value: '{years} years, straight line' },
      { label: 'Revenue for the year', value: '$900' },
      { label: 'Dividends paid during the year', value: '$25' },
      { label: 'Tax rate', value: '{taxPct}%' },
    ],
    question: 'How much higher is year-one cash from operations if the spend is capitalised rather than expensed?',
    answer: 136,
    answerExpr: 'cfoDiff',
    tolerance: 0.5,
    nearMisses: [
      {
        value: 200,
        valueExpr: 'spend',
        note:
          'You moved the whole spend out of operating and stopped there. Capitalising also raises pre-tax income by ${expenseDiff}, and the ${taxDiff} of extra tax is paid out of operating cash.',
      },
      {
        value: 96,
        valueExpr: 'expenseDiff * 0.6',
        note: 'That is the year-one net income difference, ${expenseDiff} pre-tax after {taxPct}% tax. The question asks about cash from operations, where the spend itself has also moved.',
      },
      {
        value: 160,
        valueExpr: 'expenseDiff',
        note: 'That is the pre-tax income difference: ${spend} of expense replaced by ${amort} of amortisation. Cash from operations is struck after cash tax.',
      },
      {
        value: 120,
        valueExpr: 'spend * 0.6',
        note: 'You taxed the full ${spend}. Only ${expenseDiff} of expense actually disappears from the income statement, because ${amort} of it comes back as amortisation.',
      },
      {
        value: -64,
        valueExpr: '0 - taxDiff',
        note:
          'That is the free cash flow difference, which is the honest answer to the finance director. It is also the point: operating cash flow rises ${cfoDiff} while ${spend} of capex appears below it.',
      },
      {
        value: 64,
        valueExpr: 'taxDiff',
        note: 'That is the extra cash tax on its own. The spend leaving the operating section is worth another ${spend}.',
      },
    ],
    working: [
      'Expensed: the ${spend} sits in operating costs, so all of it is inside cash from operations.',
      'Capitalised: the ${spend} becomes capex in investing, and only ${amort} of amortisation touches the income statement. That ${amort} is non-cash and is added straight back.',
      'Pre-tax income is therefore ${expenseDiff} higher, and cash tax is ${taxDiff} higher.',
      'Cash from operations: +{spend} - {taxDiff} = +${cfoDiff}.',
      'Free cash flow is ${taxDiff} lower, exactly the extra tax. The policy moves cash between lines on the statement; it does not create any.',
    ],
  },
] satisfies Exercise[];
