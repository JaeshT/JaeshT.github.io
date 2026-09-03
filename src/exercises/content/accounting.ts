// Accounting exercises.
//
// Authored in TypeScript rather than JSON on purpose: `satisfies Exercise[]` gives author-time
// checking, which is the cheapest possible place to catch a content error. tewess.com serves its
// content as JSON from public/content so it can be updated without a rebuild; moving these across
// is mechanical, because the types here are the same shape and scripts/verify.mjs already validates
// them the way a runtime loader would.
//
// The base model below is shared by both grid exercises and balances at 1,250 before any shock.

import type { Exercise } from '../lib/schema';

export const ACCOUNTING: Exercise[] = [
  // ------------------------------------------------------------------ easy
  {
    id: 'acc-ripple-inventory-credit',
    module: 'accounting',
    tier: 'easy',
    kind: 'ternary-board',
    title: 'Inventory bought on credit',
    prompt: 'You buy ${amount} of inventory from a supplier and pay for it in 60 days. Mark which way each line moves, right now, at the moment of purchase.',
    conventions: ['Nothing has been sold yet.', 'Ignore any tax effect.'],
    skills: ['bs-working-capital', 'cfs-nwc', 'is-recognition'],
    estSeconds: 60,
    // Nothing about the direction of any line depends on the size of the purchase, which is what
    // makes this one safe to vary freely: the lesson is which lines move, and the number is only
    // there to stop the answer being a memory of last time.
    vars: [{ id: 'amount', label: 'purchase', domain: [50, 30, 80, 120] }],
    // Easy stays clean: direction only, no magnitudes, no clock, no traps in the wording.
    presentation: { showBase: true },
    rows: [
      { id: 'inventory', label: 'Inventory', direction: 'up', explain: 'You now hold ${amount} more inventory.' },
      { id: 'ap', label: 'Accounts payable', direction: 'up', explain: 'You owe the supplier ${amount} until you pay.' },
      { id: 'cash', label: 'Cash', direction: 'none', explain: 'No cash has moved yet. That is the whole point of buying on credit.' },
      { id: 'revenue', label: 'Revenue', direction: 'none', explain: 'Buying stock is not a sale. Revenue moves when you sell it.' },
      { id: 'cogs', label: 'Cost of goods sold', direction: 'none', explain: 'COGS is recognised when the inventory is sold, not when it is bought.' },
      { id: 'net-income', label: 'Net income', direction: 'none', explain: 'Nothing has hit the income statement, so net income is untouched.' },
      { id: 'total-assets', label: 'Total assets', direction: 'up', explain: 'Inventory is up ${amount} and cash is flat, so assets rise ${amount}.' },
      { id: 'total-liabilities', label: 'Total liabilities', direction: 'up', explain: 'Payables are up ${amount}, which is what keeps the balance sheet balanced.' },
      { id: 'retained-earnings', label: 'Retained earnings', direction: 'none', explain: 'Retained earnings only move with net income or dividends.' },
    ],
  },

  // ---------------------------------------------------------------- medium
  {
    id: 'acc-grid-depreciation',
    module: 'accounting',
    tier: 'medium',
    kind: 'statement-grid',
    // The title carries no figure, so the card reads the same whichever variant is waiting behind
    // it. The stem carries the figure, because that is where you actually need it.
    title: 'Depreciation rises',
    prompt: 'Depreciation increases by ${shock}. Work the change through all three statements and leave every line that does not move exactly where it is.',
    conventions: [
      'Tax rate is 40% and the company is profitable, so it gets the full shield.',
      'Expenses are shown as negative numbers.',
      'Nothing else about the business changes.',
    ],
    taxRate: 0.4,
    // Every moving line scales with this number, so randomising it later is a one-line change.
    // Multiples of 5 keep the 40% tax effect a whole number.
    shock: { label: 'depreciation increase', value: 10, domain: [10, 5, 15, 20, 25] },
    derived: [
      { id: 'taxSaved', label: 'tax saved', expr: 'shock * 0.4' },
      { id: 'afterTax', label: 'after-tax cost', expr: 'shock * 0.6' },
    ],
    skills: ['is-depreciation', 'is-tax-effect', 'cfs-dep-addback', 'bs-ppe', 'bs-retained-earnings', 'bs-cash-plug'],
    estSeconds: 240,
    presentation: { showBase: true, includeDistractors: true },
    rows: [
      // --- income statement
      { id: 'revenue', label: 'Revenue', statement: 'is', base: 1000, delta: 0, explain: 'A depreciation change does not touch the top line.' },
      { id: 'cogs', label: 'Cost of goods sold', statement: 'is', base: -400, delta: 0 },
      { id: 'sga', label: 'SG&A', statement: 'is', base: -200, delta: 0 },
      { id: 'depreciation', label: 'Depreciation', statement: 'is', base: -100, delta: -10, perShock: -1, skills: ['is-depreciation'], explain: 'The shock itself: a ${shock} larger expense, so the line goes from (100) to ({100 + shock}).' },
      {
        id: 'ebit', computed: true, label: 'EBIT', statement: 'is', base: 300, delta: -10, emphasis: 'subtotal',
        derive: { parents: [{ row: 'revenue', sign: 1 }, { row: 'cogs', sign: 1 }, { row: 'sga', sign: 1 }, { row: 'depreciation', sign: 1 }] },
        explain: 'Operating income falls by the full ${shock}, before any tax relief.',
      },
      { id: 'interest', label: 'Interest expense', statement: 'is', base: -50, delta: 0, explain: 'Depreciation is not a financing item, so interest is untouched.' },
      {
        id: 'pretax', computed: true, label: 'Pre-tax income', statement: 'is', base: 250, delta: -10, emphasis: 'subtotal',
        derive: { parents: [{ row: 'ebit', sign: 1 }, { row: 'interest', sign: 1 }] },
      },
      {
        id: 'tax', label: 'Taxes', statement: 'is', base: -100, delta: 4, perShock: 0.4, skills: ['is-tax-effect'],
        derive: { parents: [{ row: 'pretax', sign: 1 }], times: -0.4 },
        explain: 'You pay ${taxSaved} less tax: 40% of the extra ${shock} of expense. This is the whole reason cash goes up.',
      },
      {
        id: 'net-income', computed: true, label: 'Net income', statement: 'is', base: 150, delta: -6, emphasis: 'total',
        derive: { parents: [{ row: 'pretax', sign: 1 }, { row: 'tax', sign: 1 }] },
        explain: 'Down ${afterTax}, being the ${shock} expense net of ${taxSaved} of tax saved.',
      },

      // --- cash flow statement
      {
        id: 'cf-net-income', computed: true, label: 'Net income', statement: 'cfs', section: 'Operating', base: 150, delta: -6,
        derive: { parents: [{ row: 'net-income', sign: 1 }] },
        explain: 'The cash flow statement starts from the same net income you just calculated.',
      },
      { id: 'cf-depreciation', label: 'Add back: depreciation', statement: 'cfs', section: 'Operating', base: 100, delta: 10, perShock: 1, skills: ['cfs-dep-addback'], explain: 'Depreciation never moved any cash, so all ${shock} comes straight back.' },
      { id: 'cf-nwc', label: 'Change in working capital', statement: 'cfs', section: 'Operating', base: 0, delta: 0, explain: 'No receivable, payable or inventory has moved.' },
      {
        id: 'cfo', computed: true, label: 'Cash from operations', statement: 'cfs', section: 'Operating', base: 250, delta: 4, emphasis: 'subtotal',
        derive: { parents: [{ row: 'cf-net-income', sign: 1 }, { row: 'cf-depreciation', sign: 1 }, { row: 'cf-nwc', sign: 1 }] },
        explain: 'Up ${taxSaved}. Net income fell ${afterTax} but you added back ${shock} that never left the business.',
      },
      { id: 'capex', label: 'Capital expenditure', statement: 'cfs', section: 'Investing', base: -150, delta: 0, explain: 'Depreciating an asset faster does not make you buy more of them.' },
      { id: 'cff', label: 'Cash from financing', statement: 'cfs', section: 'Financing', base: 0, delta: 0 },
      {
        id: 'net-change-cash', computed: true, label: 'Net change in cash', statement: 'cfs', base: 100, delta: 4, emphasis: 'subtotal',
        derive: { parents: [{ row: 'cfo', sign: 1 }, { row: 'capex', sign: 1 }, { row: 'cff', sign: 1 }] },
      },
      { id: 'cf-beginning-cash', label: 'Cash at start of year', statement: 'cfs', base: 100, delta: 0, explain: 'Last year closed here. This year cannot change it.' },
      {
        id: 'cf-ending-cash', computed: true, label: 'Cash at end of year', statement: 'cfs', base: 200, delta: 4, emphasis: 'total',
        derive: { parents: [{ row: 'net-change-cash', sign: 1 }, { row: 'cf-beginning-cash', sign: 1 }] },
        explain: 'This is the number that has to appear on the balance sheet. If the two disagree, the model is broken.',
      },

      // --- balance sheet
      {
        id: 'cash', computed: true, label: 'Cash', statement: 'bs', section: 'Assets', base: 200, delta: 4, skills: ['bs-cash-plug'],
        derive: { parents: [{ row: 'cf-ending-cash', sign: 1 }] },
        explain: 'Carried straight across from the bottom of the cash flow statement.',
      },
      { id: 'ar', label: 'Accounts receivable', statement: 'bs', section: 'Assets', base: 150, delta: 0 },
      { id: 'inventory', label: 'Inventory', statement: 'bs', section: 'Assets', base: 100, delta: 0 },
      { id: 'ppe', label: 'PP&E, net', statement: 'bs', section: 'Assets', base: 800, delta: -10, perShock: -1, skills: ['bs-ppe'], explain: 'The extra ${shock} of depreciation comes off the carrying value of the assets.' },
      {
        id: 'total-assets', computed: true, label: 'Total assets', statement: 'bs', section: 'Assets', base: 1250, delta: -6, emphasis: 'total',
        derive: { parents: [{ row: 'cash', sign: 1 }, { row: 'ar', sign: 1 }, { row: 'inventory', sign: 1 }, { row: 'ppe', sign: 1 }] },
        explain: 'Down ${afterTax}: cash up ${taxSaved} against PP&E down ${shock}.',
      },
      { id: 'ap', label: 'Accounts payable', statement: 'bs', section: 'Liabilities & equity', base: 100, delta: 0 },
      { id: 'debt', label: 'Debt', statement: 'bs', section: 'Liabilities & equity', base: 500, delta: 0 },
      { id: 'common-stock', label: 'Common stock', statement: 'bs', section: 'Liabilities & equity', base: 300, delta: 0 },
      {
        id: 'retained-earnings', computed: true, label: 'Retained earnings', statement: 'bs', section: 'Liabilities & equity', base: 350, delta: -6,
        derive: { parents: [{ row: 'net-income', sign: 1 }], offset: 200 },
        explain: 'Opening retained earnings of $200 plus this year\'s net income. Net income fell ${afterTax}, so this does too, and that is what keeps the balance sheet balanced.',
      },
      {
        id: 'total-le', computed: true, label: 'Total liabilities & equity', statement: 'bs', section: 'Liabilities & equity', base: 1250, delta: -6, emphasis: 'total',
        derive: { parents: [{ row: 'ap', sign: 1 }, { row: 'debt', sign: 1 }, { row: 'common-stock', sign: 1 }, { row: 'retained-earnings', sign: 1 }] },
      },
    ],
    balance: {
      assets: ['cash', 'ar', 'inventory', 'ppe'],
      liabilitiesEquity: ['ap', 'debt', 'common-stock', 'retained-earnings'],
    },
  },

  // ------------------------------------------------------------------ hard
  {
    id: 'acc-grid-inventory-writedown',
    module: 'accounting',
    tier: 'hard',
    kind: 'statement-grid',
    title: 'Inventory written down',
    prompt: 'Year-end stock count finds that ${shock} of inventory is obsolete and will never sell. Management writes it off. Work it through all three statements.',
    conventions: [
      'Tax rate is 40% and the write-down is deductible this year.',
      'The write-down runs through cost of goods sold.',
      'Expenses are shown as negative numbers.',
    ],
    taxRate: 0.4,
    shock: { label: 'write-down', value: 50, domain: [50, 25, 40, 75] },
    derived: [
      { id: 'taxSaved', label: 'tax saved', expr: 'shock * 0.4' },
      { id: 'afterTax', label: 'after-tax cost', expr: 'shock * 0.6' },
    ],
    skills: ['is-writedown', 'is-tax-effect', 'cfs-noncash-addback', 'bs-working-capital', 'bs-cash-plug'],
    estSeconds: 300,
    // Hard drops the scaffolding and adds a clock. The opening values are hidden: in an interview
    // nobody reads you the balance sheet twice.
    presentation: { showBase: false, includeDistractors: true, timerSeconds: 300 },
    rows: [
      { id: 'revenue', label: 'Revenue', statement: 'is', base: 1000, delta: 0, explain: 'Writing off stock you never sold does not touch revenue.' },
      { id: 'cogs', label: 'Cost of goods sold', statement: 'is', base: -400, delta: -50, perShock: -1, skills: ['is-writedown'], explain: 'The write-down runs through COGS, so the line goes from (400) to ({400 + shock}).' },
      { id: 'sga', label: 'SG&A', statement: 'is', base: -200, delta: 0 },
      { id: 'depreciation', label: 'Depreciation', statement: 'is', base: -100, delta: 0, explain: 'Inventory is not depreciated. This line is a distractor.' },
      {
        id: 'ebit', computed: true, label: 'EBIT', statement: 'is', base: 300, delta: -50, emphasis: 'subtotal',
        derive: { parents: [{ row: 'revenue', sign: 1 }, { row: 'cogs', sign: 1 }, { row: 'sga', sign: 1 }, { row: 'depreciation', sign: 1 }] },
      },
      { id: 'interest', label: 'Interest expense', statement: 'is', base: -50, delta: 0 },
      {
        id: 'pretax', computed: true, label: 'Pre-tax income', statement: 'is', base: 250, delta: -50, emphasis: 'subtotal',
        derive: { parents: [{ row: 'ebit', sign: 1 }, { row: 'interest', sign: 1 }] },
      },
      {
        id: 'tax', label: 'Taxes', statement: 'is', base: -100, delta: 20, perShock: 0.4, skills: ['is-tax-effect'],
        derive: { parents: [{ row: 'pretax', sign: 1 }], times: -0.4 },
        explain: '40% of ${shock} saved, so ${taxSaved} less tax paid.',
      },
      {
        id: 'net-income', computed: true, label: 'Net income', statement: 'is', base: 150, delta: -30, emphasis: 'total',
        derive: { parents: [{ row: 'pretax', sign: 1 }, { row: 'tax', sign: 1 }] },
        explain: 'Down ${afterTax}: the ${shock} write-down net of ${taxSaved} of tax saved.',
      },

      { id: 'cf-net-income', computed: true, label: 'Net income', statement: 'cfs', section: 'Operating', base: 150, delta: -30, derive: { parents: [{ row: 'net-income', sign: 1 }] } },
      { id: 'cf-depreciation', label: 'Add back: depreciation', statement: 'cfs', section: 'Operating', base: 100, delta: 0, explain: 'Depreciation itself did not change. Another distractor.' },
      {
        id: 'cf-writedown', label: 'Add back: inventory write-down', statement: 'cfs', section: 'Operating', base: 0, delta: 50, perShock: 1, skills: ['cfs-noncash-addback'],
        explain: 'The line most candidates miss. No cash left the building: you wrote off stock you had already paid for, so all ${shock} is added back.',
      },
      { id: 'cf-nwc', label: 'Change in working capital', statement: 'cfs', section: 'Operating', base: 0, delta: 0, explain: 'The inventory fall is captured by the add-back above. Counting it here too would double-count it.' },
      {
        id: 'cfo', computed: true, label: 'Cash from operations', statement: 'cfs', section: 'Operating', base: 250, delta: 20, emphasis: 'subtotal',
        derive: { parents: [{ row: 'cf-net-income', sign: 1 }, { row: 'cf-depreciation', sign: 1 }, { row: 'cf-writedown', sign: 1 }, { row: 'cf-nwc', sign: 1 }] },
        explain: 'Cash goes UP by ${taxSaved}. Nothing left the business and the taxman took less. This is the counterintuitive part.',
      },
      { id: 'capex', label: 'Capital expenditure', statement: 'cfs', section: 'Investing', base: -150, delta: 0 },
      { id: 'cff', label: 'Cash from financing', statement: 'cfs', section: 'Financing', base: 0, delta: 0 },
      {
        id: 'net-change-cash', computed: true, label: 'Net change in cash', statement: 'cfs', base: 100, delta: 20, emphasis: 'subtotal',
        derive: { parents: [{ row: 'cfo', sign: 1 }, { row: 'capex', sign: 1 }, { row: 'cff', sign: 1 }] },
      },
      { id: 'cf-beginning-cash', label: 'Cash at start of year', statement: 'cfs', base: 100, delta: 0, explain: 'Unaffected by anything that happens this year.' },
      {
        id: 'cf-ending-cash', computed: true, label: 'Cash at end of year', statement: 'cfs', base: 200, delta: 20, emphasis: 'total',
        derive: { parents: [{ row: 'net-change-cash', sign: 1 }, { row: 'cf-beginning-cash', sign: 1 }] },
        explain: 'Has to tie to the cash line on the balance sheet.',
      },

      { id: 'cash', computed: true, label: 'Cash', statement: 'bs', section: 'Assets', base: 200, delta: 20, skills: ['bs-cash-plug'], derive: { parents: [{ row: 'cf-ending-cash', sign: 1 }] }, explain: 'Carried across from the cash flow statement.' },
      { id: 'ar', label: 'Accounts receivable', statement: 'bs', section: 'Assets', base: 150, delta: 0 },
      { id: 'inventory', label: 'Inventory', statement: 'bs', section: 'Assets', base: 100, delta: -50, perShock: -1, skills: ['bs-working-capital'], explain: 'The stock is gone, so it comes off the balance sheet at cost.' },
      { id: 'ppe', label: 'PP&E, net', statement: 'bs', section: 'Assets', base: 800, delta: 0 },
      {
        id: 'total-assets', computed: true, label: 'Total assets', statement: 'bs', section: 'Assets', base: 1250, delta: -30, emphasis: 'total',
        derive: { parents: [{ row: 'cash', sign: 1 }, { row: 'ar', sign: 1 }, { row: 'inventory', sign: 1 }, { row: 'ppe', sign: 1 }] },
      },
      { id: 'ap', label: 'Accounts payable', statement: 'bs', section: 'Liabilities & equity', base: 100, delta: 0, explain: 'You still owe the supplier. Writing stock off does not cancel the bill.' },
      { id: 'debt', label: 'Debt', statement: 'bs', section: 'Liabilities & equity', base: 500, delta: 0 },
      { id: 'common-stock', label: 'Common stock', statement: 'bs', section: 'Liabilities & equity', base: 300, delta: 0 },
      {
        id: 'retained-earnings', computed: true, label: 'Retained earnings', statement: 'bs', section: 'Liabilities & equity', base: 350, delta: -30,
        derive: { parents: [{ row: 'net-income', sign: 1 }], offset: 200 },
        explain: 'Opening $200 plus net income.',
      },
      {
        id: 'total-le', computed: true, label: 'Total liabilities & equity', statement: 'bs', section: 'Liabilities & equity', base: 1250, delta: -30, emphasis: 'total',
        derive: { parents: [{ row: 'ap', sign: 1 }, { row: 'debt', sign: 1 }, { row: 'common-stock', sign: 1 }, { row: 'retained-earnings', sign: 1 }] },
      },
    ],
    balance: {
      assets: ['cash', 'ar', 'inventory', 'ppe'],
      liabilitiesEquity: ['ap', 'debt', 'common-stock', 'retained-earnings'],
    },
  },
] satisfies Exercise[];
