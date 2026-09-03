// Equity value and enterprise value: the core material.
//
// The bridge is the natural shape for this module, so two of the six are bridges. The rest are the
// formats that punish the two failure modes this topic actually has: a direction board for "which
// events move enterprise value" (the answer is usually none, and that is the lesson), and typed
// numbers for the two calculations candidates get wrong under pressure.
//
// Every exercise pins its lease treatment and its cash netting, because both are convention calls
// and a bridge marked against the wrong convention is worse than no bridge at all.
//
// RANDOMISATION. This module is the easy case for it: share price, share count, debt and cash are
// independent inputs and every other figure falls out of them, so the vars below are the actual
// free numbers and everything else is `derived`. Two things are NOT free, and the domains are
// chosen to protect them: an option strike has to stay below the share price or the treasury stock
// method stops applying, and the buyback board's directions only hold because one var funds both
// the debt raised and the stock bought back.

import type { Exercise } from '../lib/schema';

export const EV_EQV_CORE: Exercise[] = [
  // ================================================================== easy
  {
    id: 'evq-bridge-eqv-to-ev-easy',
    module: 'ev-eqv',
    tier: 'easy',
    kind: 'bridge',
    title: 'Equity value to enterprise value',
    prompt:
      'Northwind Foods has a market capitalisation of ${eqv}m. Build the bridge from equity value to enterprise value. Some of the items below do not belong in it, and leaving those in the tray is part of the answer.',
    conventions: [
      'Enterprise value = equity value + debt + preferred stock + non-controlling interests, less cash.',
      'All of the cash is unrestricted and available to the business.',
      'Debt is taken at face value.',
      'The company has no leases, no equity-method stakes and no convertible securities.',
      'All amounts in $m.',
    ],
    skills: ['ev-bridge', 'ev-net-debt', 'ev-nci', 'ev-preferred', 'ev-concept'],
    estSeconds: 120,
    // Nothing here decides WHICH way an item goes: debt is debt at any size and cash is cash at any
    // size, so these three move freely. Cash stays below total debt so the stem's "less cash" never
    // turns the bridge into a net-cash one, which would make the lesson read backwards.
    vars: [
      { id: 'eqv', label: 'market capitalisation', domain: [1200, 900, 1500, 1800] },
      { id: 'ltDebt', label: 'long-term debt', domain: [300, 250, 400, 450] },
      { id: 'cash', label: 'cash', domain: [150, 100, 200, 250] },
      // Named so prose and the bridge can refer to them; single-valued, so they are not dimensions.
      { id: 'stDebt', label: 'short-term borrowings', domain: [100] },
      { id: 'preferred', label: 'preferred stock', domain: [60] },
      { id: 'nci', label: 'non-controlling interests', domain: [40] },
    ],
    derived: [
      { id: 'debt', label: 'total debt', expr: 'stDebt + ltDebt' },
      { id: 'ev', label: 'enterprise value', expr: 'eqv + debt + preferred + nci - cash' },
    ],
    startLabel: 'Equity value (market capitalisation)',
    startValue: 1200,
    startValueExpr: 'eqv',
    targetLabel: 'Enterprise value',
    targetValue: 1550,
    items: [
      {
        id: 'st-debt', label: 'Short-term borrowings', role: 'add', amount: 100, amountExpr: 'stDebt',
        explain: 'A buyer has to repay it or refinance it on day one, so it is part of what the whole business costs.',
      },
      {
        id: 'lt-debt', label: 'Long-term debt', role: 'add', amount: 300, amountExpr: 'ltDebt',
        explain: 'Same claim, longer maturity. Enterprise value is the price of the business to every capital provider, not only to the shareholders.',
      },
      {
        id: 'preferred', label: 'Preferred stock', role: 'add', amount: 60, amountExpr: 'preferred',
        explain: 'Preferred ranks ahead of the common and has to be satisfied before the common sees anything. Treat it as debt-like and add it.',
      },
      {
        id: 'nci', label: 'Non-controlling interests', role: 'add', amount: 40, amountExpr: 'nci',
        explain: 'Consolidated EBITDA includes 100% of a subsidiary the parent does not fully own. Adding the NCI puts the matching claim in the numerator, so the multiple covers the same business top and bottom.',
      },
      {
        id: 'cash', label: 'Cash and cash equivalents', role: 'subtract', amount: 150, amountExpr: 'cash',
        explain: 'Cash is not part of the operating business, and a buyer gets it back the moment the deal closes. Pay ${ev}m for the business and ${cash}m of that comes straight back out of the till.',
      },
      {
        id: 'ar', label: 'Accounts receivable', role: 'out', amount: 90,
        explain: 'An operating asset, already inside the business being bought and already reflected in EBITDA. Adding it counts the same thing twice.',
      },
      {
        id: 'prepaid', label: 'Prepaid expenses', role: 'out', amount: 25,
        explain: 'Another operating current asset. It is not a claim on the business and it is not cash, so it has no place in the bridge.',
      },
      {
        id: 'book-equity', label: "Shareholders' equity (book value)", role: 'out', amount: 700,
        explain: 'Book equity is an accounting balance. The bridge starts from market capitalisation, which is what the equity actually costs today.',
      },
    ],
  },

  {
    id: 'evq-board-what-moves-ev-easy',
    module: 'ev-eqv',
    tier: 'easy',
    kind: 'ternary-board',
    title: 'Which of these move enterprise value?',
    prompt:
      'Take each event on its own, from the same starting balance sheet every time. Mark which way enterprise value moves at the moment it happens.',
    conventions: [
      'Enterprise value = equity value + net debt, with cash netted against debt.',
      'Each event is independent. Judge it on its own, immediately.',
      'The market value of the operating business changes only where the event says it does.',
      'The company has no preferred stock, no non-controlling interests and no leases.',
    ],
    skills: ['ev-concept', 'ev-net-debt', 'ev-cash-netting'],
    estSeconds: 150,
    // Nine independent events, so nine independent numbers. Not one of the directions depends on
    // the size of its own event — cash crossing into an operating asset raises enterprise value
    // whether it is $25m or $90m — which is exactly why the amounts can move freely here. No
    // magnitude is asked for, so there is nothing that could cross zero underneath a direction.
    vars: [
      { id: 'debtIssue', label: 'debt issued and held in cash', domain: [100, 150, 80, 120] },
      { id: 'inventorySpend', label: 'cash spent on inventory', domain: [40, 60, 25, 50] },
      { id: 'debtRepay', label: 'debt repaid out of cash', domain: [50, 30, 75, 60] },
      { id: 'capexSpend', label: 'cash spent on a production line', domain: [60, 45, 90, 80] },
      { id: 'dividendPaid', label: 'cash dividend', domain: [30, 20, 45, 55] },
      { id: 'warnPct', label: 'share price fall on the warning', domain: [8, 5, 12, 15] },
      { id: 'equityRaise', label: 'equity raised and held in cash', domain: [200, 150, 300, 250] },
      { id: 'warehouseCost', label: 'debt-funded warehouse', domain: [120, 90, 160, 220] },
      { id: 'buybackSize', label: 'buyback', domain: [80, 65, 110, 140] },
    ],
    rows: [
      {
        id: 'issue-debt', label: 'Issues ${debtIssue}m of debt and leaves the proceeds in cash', direction: 'none',
        explain: 'Debt up ${debtIssue}m, cash up ${debtIssue}m, net debt unchanged. The business a buyer would acquire is the same business it was this morning.',
      },
      {
        id: 'inventory', label: 'Spends ${inventorySpend}m of cash on inventory', direction: 'up',
        explain: 'The one most people get wrong. Cash sits outside the operating business and inventory sits inside it, so ${inventorySpend}m has crossed the fence. Equity value is unchanged and net debt is ${inventorySpend}m higher, so enterprise value rises ${inventorySpend}m.',
      },
      {
        id: 'repay-debt', label: 'Repays ${debtRepay}m of debt out of cash', direction: 'none',
        explain: 'Debt down ${debtRepay}m and cash down ${debtRepay}m. Only net debt matters here, and it has not moved.',
      },
      {
        id: 'capex', label: 'Spends ${capexSpend}m of cash on a new production line', direction: 'up',
        explain: 'The same move as the inventory: non-operating cash becomes an operating asset. This is what subtracting cash is for.',
      },
      {
        id: 'dividend', label: 'Pays a ${dividendPaid}m cash dividend', direction: 'none',
        explain: 'Cash falls ${dividendPaid}m so net debt rises ${dividendPaid}m, and the shares go ex-dividend so equity value falls ${dividendPaid}m. The two sides of the bridge cancel.',
      },
      {
        id: 'profit-warning', label: 'Warns on profits and the share price falls {warnPct}%', direction: 'down',
        explain: 'The value of the operating business itself has fallen. Equity value drops with nothing on the other side to offset it.',
      },
      {
        id: 'issue-equity', label: 'Raises ${equityRaise}m by issuing new shares, held in cash', direction: 'none',
        explain: 'Market capitalisation up ${equityRaise}m against ${equityRaise}m more cash to net off. Nothing about the operating business changed, which is exactly why enterprise value did not.',
      },
      {
        id: 'debt-funded-asset', label: 'Borrows ${warehouseCost}m and buys a warehouse with it', direction: 'up',
        explain: 'Debt up ${warehouseCost}m with no cash left to net against it, so net debt rises by the full amount while equity value is unchanged. The business now contains a warehouse it did not own before.',
      },
      {
        id: 'buyback', label: 'Buys back ${buybackSize}m of its own shares for cash', direction: 'none',
        explain: 'Market capitalisation down ${buybackSize}m, net debt up ${buybackSize}m. A buyback moves value between the two sides of the bridge without taking anything out of the business.',
      },
    ],
  },

  {
    id: 'evq-numeric-ev-basic-easy',
    module: 'ev-eqv',
    tier: 'easy',
    kind: 'numeric',
    title: 'Enterprise value from the tape',
    prompt: 'Fairwater Logistics. Work enterprise value out from the figures below.',
    conventions: [
      'Enterprise value = equity value + total debt + preferred stock + non-controlling interests, less cash.',
      'All of the cash is unrestricted.',
      'Debt at face value, preferred at redemption value.',
      'The share count given is already diluted, so no treasury stock method is needed.',
      'The company has no leases, equity-method stakes or convertible securities.',
    ],
    skills: ['ev-concept', 'ev-net-debt', 'ev-nci', 'ev-preferred'],
    estSeconds: 120,
    // Price and share count are chosen so equity value lands on a whole number at every pairing,
    // and cash stays below total debt so the company never quietly goes net cash — the stem calls
    // this a bridge over debt, and a negative net debt would be a different exercise.
    vars: [
      { id: 'price', label: 'share price', domain: [20, 25, 16, 32] },
      { id: 'shares', label: 'diluted shares', domain: [100, 80, 125, 150] },
      { id: 'cash', label: 'cash', domain: [150, 100, 200, 250] },
      { id: 'ltDebt', label: 'long-term debt', domain: [380, 300, 500, 250] },
      { id: 'stDebt', label: 'short-term borrowings', domain: [120] },
      { id: 'preferred', label: 'preferred stock', domain: [50] },
      { id: 'nci', label: 'non-controlling interests', domain: [40] },
    ],
    derived: [
      { id: 'eqv', label: 'equity value', expr: 'price * shares' },
      { id: 'debt', label: 'total debt', expr: 'stDebt + ltDebt' },
      { id: 'netDebt', label: 'net debt', expr: 'debt - cash' },
      { id: 'ev', label: 'enterprise value', expr: 'eqv + netDebt + preferred + nci' },
    ],
    givens: [
      { label: 'Share price', value: '${price|2}' },
      { label: 'Diluted shares outstanding', value: '{shares|1}m' },
      { label: 'Short-term borrowings', value: '${stDebt}m' },
      { label: 'Long-term debt', value: '${ltDebt}m' },
      { label: 'Cash and equivalents', value: '${cash}m' },
      { label: 'Preferred stock (redemption value)', value: '${preferred}m' },
      { label: 'Non-controlling interests', value: '${nci}m' },
    ],
    question: 'Enterprise value, in $m',
    answer: 2440,
    answerExpr: 'ev',
    tolerance: 1,
    unit: 'm',
    nearMisses: [
      { value: 2590, valueExpr: 'eqv + debt + preferred + nci', note: 'You added the debt, the preferred and the NCI but never took the cash off. Cash is not part of the operating business and the buyer gets it back at closing, so it comes out.' },
      { value: 2740, valueExpr: 'eqv + debt + preferred + nci + cash', note: 'You added the cash instead of subtracting it. Cash is the one item that makes enterprise value smaller than the sum of the claims on the business.' },
      { value: 2350, valueExpr: 'eqv + netDebt', note: 'You bridged with debt and cash only. Preferred stock and the non-controlling interest are claims a buyer still has to satisfy, so both go in.' },
      { value: 2000, valueExpr: 'eqv', note: 'That is equity value. The question asks what the whole business costs, not what the common stock costs.' },
    ],
    working: [
      'Equity value = ${price|2} x {shares|1}m = ${eqv}m.',
      'Net debt = {stDebt} + {ltDebt} - {cash} = ${netDebt}m.',
      'Enterprise value = {eqv} + {netDebt} + {preferred} + {nci} = ${ev}m.',
    ],
  },

  // ================================================================ medium
  {
    id: 'evq-bridge-footnotes-medium',
    module: 'ev-eqv',
    tier: 'medium',
    kind: 'bridge',
    title: 'Bridge it from the footnotes',
    prompt:
      'Calder Industrial, year end. The stock closed at ${price|2} with {shares|1}m diluted shares outstanding, so equity value is ${eqv}m. The chips below come off the balance sheet and the notes, and several of them are there because they appear in the notes rather than because they belong in the bridge. Read the footnote on each one before you decide. Assemble enterprise value and give the number.',
    conventions: [
      'US GAAP, ASC 842: operating lease rent is still an operating expense, so EBITDA is already after rent and the operating lease liability is NOT treated as debt. Finance leases are. (Under IFRS 16, where rent is stripped out of EBITDA, the operating lease liability would go in.)',
      'Cash and cash-like short-term investments are netted against debt. Restricted cash is not: it is unavailable to the business.',
      'Debt is taken at face value, not at carrying value.',
      'Preferred stock is debt-like and taken at redemption value.',
      'The equity-method stake is non-operating: its earnings sit below EBIT and outside EBITDA.',
      'The share count is already diluted, so no option maths is needed here.',
      'All amounts in $m.',
    ],
    skills: ['ev-bridge', 'ev-net-debt', 'ev-leases', 'ev-associates', 'ev-restricted-cash', 'ev-nci', 'ev-preferred'],
    estSeconds: 360,
    presentation: { includeDistractors: true, timerSeconds: 360 },
    // What this exercise teaches is which note belongs in the bridge, and none of that turns on the
    // size of any one line: face beats carrying value at any face, restricted cash is unavailable at
    // any amount. So the six drivers move and the treatments do not. The traps that carry a stated
    // relationship keep it: undrawn capacity is the facility less what is drawn, and the carrying
    // value stays below face by the unamortised issuance costs.
    vars: [
      { id: 'price', label: 'closing share price', domain: [28, 32, 24, 35] },
      { id: 'shares', label: 'diluted shares', domain: [150, 120, 200, 175] },
      { id: 'ltFace', label: 'long-term notes, face', domain: [1050, 900, 1200, 1400] },
      { id: 'cash', label: 'unrestricted cash', domain: [300, 250, 400, 350] },
      { id: 'nci', label: 'non-controlling interests', domain: [90, 60, 120, 150] },
      { id: 'restricted', label: 'restricted cash', domain: [45, 30, 60, 75] },
      // Fixed, and named so that every figure in a footnote arrives through the same channel.
      { id: 'revolverDrawn', label: 'revolver drawn', domain: [150] },
      { id: 'facility', label: 'committed facility', domain: [400] },
      { id: 'issuanceCosts', label: 'unamortised issuance costs', domain: [18] },
      { id: 'financeLease', label: 'finance lease obligations', domain: [120] },
      { id: 'opLease', label: 'operating lease liability', domain: [380] },
      { id: 'opRent', label: 'operating lease rent in opex', domain: [62] },
      { id: 'prefShares', label: 'preferred shares', domain: [8] },
      { id: 'prefPrice', label: 'preferred redemption value', domain: [25] },
      { id: 'stInvest', label: 'short-term investments', domain: [120] },
      { id: 'associate', label: 'investment in associates', domain: [160] },
      { id: 'associateIncome', label: 'income from associates', domain: [14] },
      { id: 'prepaid', label: 'prepaid expenses', domain: [30] },
    ],
    derived: [
      { id: 'eqv', label: 'equity value', expr: 'price * shares' },
      { id: 'undrawn', label: 'undrawn capacity', expr: 'facility - revolverDrawn' },
      { id: 'ltCarrying', label: 'notes at carrying value', expr: 'ltFace - issuanceCosts' },
      { id: 'cashTotal', label: 'cash on the balance sheet', expr: 'cash + restricted' },
      { id: 'preferred', label: 'preferred stock', expr: 'prefShares * prefPrice' },
      { id: 'ev', label: 'enterprise value', expr: 'eqv + revolverDrawn + ltFace + financeLease + preferred + nci - cash - stInvest - associate' },
    ],
    startLabel: 'Equity value ({shares|1}m x ${price|2})',
    startValue: 4200,
    startValueExpr: 'eqv',
    targetLabel: 'Enterprise value',
    targetValue: 5230,
    requireTotal: true,
    tolerance: 1,
    items: [
      {
        id: 'revolver-drawn', label: 'Revolver drawn', role: 'add', amount: 150, amountExpr: 'revolverDrawn',
        detail: 'Note 11: ${revolverDrawn}m drawn at year end under a ${facility}m committed facility.',
        explain: 'The drawn balance is money owed, so it is debt.',
      },
      {
        id: 'revolver-undrawn', label: 'Undrawn revolver capacity', role: 'out', amount: 250, amountExpr: 'undrawn',
        detail: 'Note 11: ${facility}m facility less ${revolverDrawn}m drawn.',
        explain: 'Borrowing capacity is not borrowing. Nothing is owed until it is drawn, and a buyer inherits the option rather than the obligation.',
      },
      {
        id: 'lt-debt', label: 'Long-term notes', role: 'add', amount: 1050, amountExpr: 'ltFace',
        detail: 'Note 11: ${ltFace}m face, carried at ${ltCarrying}m net of unamortised issuance costs.',
        explain: 'Use the ${ltFace}m face value. What a buyer has to repay is the amount owed, not the amount left on the balance sheet after an accounting adjustment. The ${ltCarrying}m is there to see whether you read the note.',
      },
      {
        id: 'finance-lease', label: 'Finance lease obligations', role: 'add', amount: 120, amountExpr: 'financeLease',
        detail: 'Note 8: finance leases ${financeLease}m. Interest and amortisation on these are reported below EBITDA.',
        explain: 'The cost of these leases has already been pushed below EBITDA, so the denominator of an EV/EBITDA multiple never carried it. The obligation therefore has to sit in the numerator, like any other borrowing.',
      },
      {
        id: 'operating-lease', label: 'Operating lease liability', role: 'out', amount: 380, amountExpr: 'opLease',
        detail: 'Note 8: operating leases ${opLease}m, with ${opRent}m of rent charged within operating expenses.',
        explain: 'Under ASC 842 the rent stays in operating expenses, so EBITDA is already after it. Add the liability as well and the leases are counted twice: once as a cost in the denominator, once as a claim in the numerator. The treatment flips under IFRS 16, which is why the convention has to be stated before the question is fair.',
      },
      {
        id: 'preferred', label: 'Preferred stock', role: 'add', amount: 200, amountExpr: 'preferred',
        detail: 'Note 14: {prefShares|1}m preferred shares, ${prefPrice|2} redemption value each, no conversion feature.',
        explain: '{prefShares|1}m x ${prefPrice|2} = ${preferred}m ranking ahead of the common. Debt-like, so it goes in.',
      },
      {
        id: 'nci', label: 'Non-controlling interests', role: 'add', amount: 90, amountExpr: 'nci',
        detail: 'The group consolidates an 80%-owned distribution subsidiary; the 20% it does not own is carried at ${nci}m.',
        explain: 'Consolidated EBITDA includes 100% of that subsidiary while the parent owns 80% of it. Adding the NCI puts the missing claim back into the numerator so that enterprise value and EBITDA describe the same business.',
      },
      {
        id: 'cash', label: 'Cash and cash equivalents', role: 'subtract', amount: 300, amountExpr: 'cash',
        detail: 'Balance sheet: ${cashTotal}m of cash and equivalents, of which ${restricted}m is restricted (note 3).',
        explain: 'Only the ${cash}m that is genuinely available comes off. The restricted portion is a separate chip and stays in the tray.',
      },
      {
        id: 'restricted-cash', label: 'Restricted cash', role: 'out', amount: 45, amountExpr: 'restricted',
        detail: 'Note 3: ${restricted}m pledged as collateral under a long-term supply contract, unavailable until 2029.',
        explain: 'A buyer cannot use it to pay down debt, so under the convention stated it is not cash for this purpose. Netting it off would understate enterprise value by ${restricted}m.',
      },
      {
        id: 'short-term-investments', label: 'Short-term investments', role: 'subtract', amount: 120, amountExpr: 'stInvest',
        detail: 'Note 4: ${stInvest}m of Treasury bills maturing inside three months.',
        explain: 'Cash-like and non-operating. It generates nothing inside EBITDA, so it comes off exactly as cash does.',
      },
      {
        id: 'associate', label: 'Investment in associates', role: 'subtract', amount: 160, amountExpr: 'associate',
        detail: 'Note 6: 30% of Halden Ltd, equity method, carried at ${associate}m. The ${associateIncome}m of income from it is reported below EBIT.',
        explain: 'The associate contributes nothing to EBITDA, so its value must not sit in enterprise value either. Take it out like cash. Leave it in and you are charging a buyer for an asset the denominator never counted.',
      },
      {
        id: 'prepaid', label: 'Prepaid expenses', role: 'out', amount: 30, amountExpr: 'prepaid',
        detail: 'Balance sheet: prepaid insurance and software licences, ${prepaid}m.',
        explain: 'An operating current asset. It is neither a claim on the business nor cash, and it is already inside what the buyer is paying for.',
      },
    ],
  },

  {
    id: 'evq-board-debt-funded-buyback-medium',
    module: 'ev-eqv',
    tier: 'medium',
    kind: 'ternary-board',
    title: 'Debt-funded buyback: what actually moves',
    prompt:
      'Marden plc has no debt and no cash. It issues ${debtRaised}m of debt at {rate}% and spends every dollar buying its own stock back at ${price|2}. Nothing about the operating business changes. Mark which way each line moves, and give the size of the move where it is asked for.',
    conventions: [
      'Before the deal: {shares0|1}m shares at ${price|2}, EBITDA ${ebitda}m, D&A ${da}m, no interest expense, tax {taxPct}%, net income ${ni0}m.',
      'The debt is drawn and the buyback executed the same day, at ${price|2} a share.',
      'The share price stays at ${price|2}: the market values the operating business exactly as it did before.',
      'Interest is a full year of ${debtRaised}m at {rate}%. Ignore any part-year effect.',
      'Multiples are computed on the same figures before and after.',
      'Magnitudes in $m, except the share count, which is in millions of shares.',
    ],
    taxRate: 0.25,
    skills: ['ev-multiples', 'ev-concept', 'ev-net-debt', 'ev-capital-structure'],
    estSeconds: 300,
    presentation: { includeDistractors: true, timerSeconds: 300 },
    // Three directions here are conditional, so the domains are not free.
    //   cash 'none'  — one var funds both legs. The debt raised IS the buyback, so the two cancel by
    //                  construction and no pairing of values can pull them apart.
    //   eps 'up'     — accretive only while the earnings yield beats the after-tax cost of the debt,
    //                  which for this model is rate x price < 200. The worst pairing is 6% at
    //                  a $25.00 price: 6.0% against 4.5%, still accretive with room to spare.
    //   pe 'down'    — follows from eps rising, so it is safe for the same reason.
    // Cleanliness: debt is a multiple of 100 so a whole-percent coupon gives whole-dollar interest,
    // which keeps the after-tax hit to net income at two decimals; every price divides the buyback
    // into a share count that lands on two decimals too.
    vars: [
      { id: 'debtRaised', label: 'debt raised and spent on stock', domain: [200, 300, 400] },
      { id: 'price', label: 'share price', domain: [20, 25, 12.5, 10] },
      { id: 'rate', label: 'coupon, %', domain: [5, 4, 6] },
      { id: 'shares0', label: 'shares before', domain: [100] },
      { id: 'ebitda', label: 'EBITDA', domain: [250] },
      { id: 'da', label: 'D&A', domain: [50] },
      { id: 'taxPct', label: 'tax rate, %', domain: [25] },
    ],
    derived: [
      { id: 'ebit', label: 'EBIT', expr: 'ebitda - da' },
      { id: 'ni0', label: 'net income before', expr: 'ebit * (1 - taxPct / 100)' },
      { id: 'interestExp', label: 'interest expense', expr: 'debtRaised * rate / 100' },
      { id: 'niFall', label: 'fall in net income', expr: 'interestExp * (1 - taxPct / 100)' },
      { id: 'ni1', label: 'net income after', expr: 'ni0 - niFall' },
      { id: 'sharesBought', label: 'shares retired', expr: 'debtRaised / price' },
      { id: 'shares1', label: 'shares after', expr: 'shares0 - sharesBought' },
      { id: 'eps0', label: 'EPS before', expr: 'ni0 / shares0' },
      { id: 'eps1', label: 'EPS after', expr: 'ni1 / shares1' },
      { id: 'mktCap0', label: 'market capitalisation before', expr: 'shares0 * price' },
      { id: 'mktCap1', label: 'market capitalisation after', expr: 'shares1 * price' },
      // Net debt is nil before the deal, so enterprise value starts at market capitalisation and,
      // as the board says, ends there too.
      { id: 'ev', label: 'enterprise value', expr: 'mktCap0' },
      { id: 'evEbitda', label: 'EV / EBITDA', expr: 'ev / ebitda' },
      { id: 'pe0', label: 'P/E before', expr: 'price / eps0' },
      { id: 'pe1', label: 'P/E after', expr: 'price / eps1' },
      { id: 'evNi0', label: 'EV / net income before', expr: 'ev / ni0' },
      { id: 'evNi1', label: 'EV / net income after', expr: 'ev / ni1' },
      { id: 'niFallPct', label: 'fall in net income, %', expr: 'niFall / ni0 * 100' },
      { id: 'sharesFallPct', label: 'fall in the share count, %', expr: 'sharesBought / shares0 * 100' },
      { id: 'earningsYield', label: 'earnings yield, %', expr: 'eps0 / price * 100' },
      { id: 'afterTaxCost', label: 'after-tax cost of debt, %', expr: 'rate * (1 - taxPct / 100)' },
    ],
    rows: [
      {
        id: 'ebitda', label: 'EBITDA', direction: 'none',
        explain: 'Capital structure does not touch operating profit. That is the whole reason EBITDA is the figure paired with enterprise value.',
      },
      {
        id: 'ebit', label: 'EBIT', direction: 'none',
        explain: 'Also untouched. Interest sits below it, which is what makes both lines comparable across companies financed differently.',
      },
      {
        id: 'cash', label: 'Cash', direction: 'none',
        explain: '${debtRaised}m in from the lenders, ${debtRaised}m straight out to the selling shareholders, on the same day.',
      },
      {
        id: 'interest', label: 'Interest expense', direction: 'up', magnitude: 10, magnitudeExpr: 'interestExp', requireMagnitude: true,
        explain: '${debtRaised}m at {rate}% is ${interestExp}m a year, where there was none before.',
      },
      {
        id: 'net-income', label: 'Net income', direction: 'down', magnitude: 7.5, magnitudeExpr: 'niFall', requireMagnitude: true,
        explain: '${interestExp}m of interest less {taxPct}% tax relief leaves ${niFall}m less profit: {ni0|1} falls to {ni1|1}.',
      },
      {
        id: 'shares', label: 'Diluted share count', direction: 'down', magnitude: 10, magnitudeExpr: 'sharesBought', requireMagnitude: true,
        explain: '${debtRaised}m at ${price|2} retires {sharesBought|1}m shares, taking the count from {shares0|1}m to {shares1|1}m.',
      },
      {
        id: 'eps', label: 'Earnings per share', direction: 'up',
        explain: 'Net income falls {niFallPct}% while the share count falls {sharesFallPct}%, so EPS rises: {ni1|1} / {shares1|1} = ${eps1|2} against ${eps0|2}. The deal is accretive because the earnings yield of {earningsYield}% is above the after-tax cost of the debt of {afterTaxCost}%.',
      },
      {
        id: 'market-cap', label: 'Market capitalisation', direction: 'down', magnitude: 200, magnitudeExpr: 'debtRaised',
        explain: '{shares1|1}m shares at ${price|2} is ${mktCap1}m against ${mktCap0}m. The equity is smaller because part of it has been bought in.',
      },
      {
        id: 'net-debt', label: 'Net debt', direction: 'up', magnitude: 200, magnitudeExpr: 'debtRaised', requireMagnitude: true,
        explain: '${debtRaised}m of debt with no cash left against it, so net debt is the full ${debtRaised}m.',
      },
      {
        id: 'ev', label: 'Enterprise value', direction: 'none',
        explain: 'Equity value down ${debtRaised}m, net debt up ${debtRaised}m. The business is worth what it was worth this morning. All that changed is who holds a claim on it, and this is why an acquirer looks at enterprise value rather than market capitalisation.',
      },
      {
        id: 'ev-ebitda', label: 'EV / EBITDA', direction: 'none',
        explain: '${ev}m over ${ebitda}m is {evEbitda|1}x before and {evEbitda|1}x after. Numerator and denominator both ignore capital structure, which is what makes the multiple comparable across companies that are financed differently.',
      },
      {
        id: 'pe', label: 'P / E', direction: 'down',
        explain: '${price|2} over ${eps1|2} is {pe1|1}x, against {pe0|1}x before. Identical business, different multiple: P/E is a levered measure, so it reports the balance sheet as much as the business.',
      },
      {
        id: 'ev-net-income', label: 'EV / net income, worked out mechanically', direction: 'up',
        explain: '{evNi0|1}x becomes {evNi1|1}x. It moves although nothing about the business did, because the numerator is the claim of every capital provider while the denominator is what is left after the lenders have been paid. The two do not describe the same thing, which is why the multiple is malformed and nobody quotes it.',
      },
    ],
  },

  {
    id: 'evq-numeric-treasury-stock-medium',
    module: 'ev-eqv',
    tier: 'medium',
    kind: 'numeric',
    title: 'Diluted equity value, the treasury stock way',
    prompt:
      'Ardley Software. The equity footnote and the balance sheet give you the following. Work out diluted equity value. Not everything on the list is needed.',
    conventions: [
      'Treasury stock method: the proceeds from exercise are assumed to buy shares back in the market, at the current market price.',
      'Only in-the-money awards count, together with their proceeds.',
      'Restricted stock units carry no exercise price and produce no proceeds, so they add in full.',
      'Ignore any tax benefit on exercise.',
      'There are no convertible securities.',
      'Answer in $m.',
    ],
    skills: ['ev-treasury-method', 'ev-diluted-shares', 'ev-equity-value'],
    estSeconds: 240,
    presentation: { includeDistractors: true, timerSeconds: 240 },
    // Two constraints shape these domains, and the second one is easy to miss.
    //   In the money. Every strike is below every price, so the awards are exercisable on all of
    //   them. Let the two ranges overlap and some variant hands the learner an out-of-the-money
    //   grant, at which point the treasury stock method does not apply at all and the exercise is
    //   quietly teaching something else.
    //   Two of the near misses must not meet. Leaving the RSUs out lands on equity value less
    //   rsu x price; repurchasing at the strike instead of the market lands on equity value less
    //   the NET option shares x price. Those two are the same number whenever the net option
    //   count equals the RSU count, and then one diagnosis fires on the other's mistake — a
    //   learner is told they forgot the RSUs when what they did was buy back at the wrong price.
    //   The RSU counts below are chosen to sit in the gaps of every net option count these
    //   pairings can produce.
    // The pairings also keep the repurchase on a whole number of hundredths of a share rather than
    // a recurring decimal, which is what lets the worked answer add up on screen.
    vars: [
      { id: 'price', label: 'share price', domain: [40, 50, 100] },
      { id: 'strike', label: 'weighted average exercise price', domain: [25, 20, 10] },
      { id: 'optShares', label: 'options outstanding', domain: [4, 6, 8] },
      { id: 'basic', label: 'basic shares', domain: [50, 40, 60, 80] },
      { id: 'rsu', label: 'restricted stock units', domain: [1, 2.5, 3.5] },
      // Distractors. They are on the list to be left alone, so they stay put.
      { id: 'cash', label: 'cash', domain: [180] },
      { id: 'debt', label: 'total debt', domain: [600] },
    ],
    derived: [
      { id: 'proceeds', label: 'exercise proceeds', expr: 'optShares * strike' },
      { id: 'buyback', label: 'shares repurchased', expr: 'proceeds / price' },
      { id: 'netOptions', label: 'net new shares from options', expr: 'optShares - buyback' },
      { id: 'diluted', label: 'diluted shares', expr: 'basic + netOptions + rsu' },
      { id: 'eqv', label: 'diluted equity value', expr: 'diluted * price' },
    ],
    givens: [
      { label: 'Share price (yesterday’s close)', value: '${price|2}' },
      { label: 'Basic shares outstanding', value: '{basic|1}m' },
      { label: 'Employee options (note 15)', value: '{optShares|1}m outstanding, all vested, weighted average exercise price ${strike|2}' },
      { label: 'Restricted stock units (note 15)', value: '{rsu|1}m outstanding, no exercise price' },
      { label: 'Cash and equivalents', value: '${cash}m' },
      { label: 'Total debt', value: '${debt}m' },
    ],
    question: 'Diluted equity value, in $m',
    answer: 2100,
    answerExpr: 'eqv',
    tolerance: 1,
    unit: 'm',
    nearMisses: [
      { value: 2200, valueExpr: '(basic + optShares + rsu) * price', note: 'You added all {optShares + rsu|1}m of the option and RSU shares and forgot the buyback. The treasury stock method assumes the ${proceeds}m of exercise proceeds is spent repurchasing {buyback}m shares at ${price|2}.' },
      { value: 2060, valueExpr: 'eqv - rsu * price', note: 'The options are right and the RSUs are missing. RSUs have no exercise price, so there are no proceeds and no repurchase: all {rsu|1}m add in full.' },
      { value: 2040, valueExpr: '(basic + rsu) * price', note: 'You repurchased the shares at the ${strike|2} strike rather than at the market price. The company buys back in the market: ${proceeds}m / ${price|2} = {buyback}m shares, not {optShares|1}m.' },
      { value: 2000, valueExpr: 'basic * price', note: 'You used basic shares. Equity value is a diluted number, and with the stock at ${price|2} against a ${strike|2} strike those option shares are coming.' },
      { value: 2520, valueExpr: 'eqv + debt - cash', note: 'That is enterprise value. The cash and debt lines are there to be left alone: the question stops at equity value.' },
    ],
    working: [
      'The options are in the money: ${price|2} against a ${strike|2} strike, so all {optShares|1}m count.',
      'Proceeds = {optShares|1}m x ${strike|2} = ${proceeds}m, which buys back ${proceeds}m / ${price|2} = {buyback}m shares.',
      'Net new shares from the options = {optShares|1} - {buyback} = {netOptions}m. The RSUs add {rsu|1}m in full.',
      'Diluted shares = {basic|1} + {netOptions} + {rsu|1} = {diluted}m, so equity value = {diluted}m x ${price|2} = ${eqv}m.',
    ],
  },
] satisfies Exercise[];
