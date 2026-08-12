---
title: Accounting & the 3 Statements
domain: technicals
---

# Accounting & the 3 Statements

## 1. What the three statements are

The **income statement (IS)** measures profitability over a period. It runs from revenue down through expenses to **net income**, on an **accrual basis**: revenue is booked when earned and expenses when incurred, regardless of cash timing.

The **balance sheet (BS)** is a snapshot at a point in time of what a company owns and owes:

$$\text{Assets} = \text{Liabilities} + \text{Shareholders' Equity}$$

It must balance by construction. Every transaction that changes one side must change the other by the same amount.

The **cash flow statement (CFS)** reconciles accrual net income to the actual change in cash over the period. It has three sections:

- **CFO. Cash Flow from Operations:** starts at net income, adds back non-cash charges, adjusts for working capital changes.
- **CFI. Cash Flow from Investing:** capital expenditure, acquisitions, asset disposals.
- **CFF. Cash Flow from Financing:** debt issuance and repayment, equity issuance, dividends.

The bottom line of the CFS is the net change in cash, which ties to the cash line on the balance sheet.

---

## 2. How the statements link

The three statements are not independent documents: they are one model with three views, joined at specific seams.

1. **Net income** flows from the bottom of the IS → to the top of the CFS (starting point of CFO) → and into **retained earnings** within shareholders' equity on the BS.
2. The **net change in cash** on the CFS equals the change in the BS cash line. Ending cash on the CFS equals cash on the new balance sheet.
3. **Non-cash items** (depreciation, amortization, stock-based compensation, deferred taxes, write-downs) are added back in CFO because they reduced net income without consuming cash.
4. **Changes in working capital** are captured in CFO because accrual revenue and expense rarely equal the cash that moved in the period.
5. **Capital expenditure** flows through CFI and onto the balance sheet as PP&E. Debt and equity activity flows through CFF and onto the BS as debt and equity.

The discipline that makes the model self-checking: **every change to one statement must keep the balance sheet in balance.** If it does not, there is an error.

---

## 3. The canonical flow-through: depreciation increases by $10

This is the most frequently asked accounting question in finance interviews. The example uses a **40% tax rate** because interviewers expect it and it produces clean arithmetic (current US combined corporate rates are closer to 25-26%, which changes the numbers but not the logic).

**Income statement:**
- Depreciation is an expense → pre-tax income falls $10
- Taxes fall by $4 (40% × $10)
- **Net income falls $6**

**Cash flow statement:**
- Start at net income: $-6$
- Add back depreciation (non-cash): $+10$
- **CFO rises $4; cash rises $4**

**Balance sheet:**
- Cash: $+4$
- PP&E: $-10$ (asset was depreciated)
- **Total assets: $-6$**
- Retained earnings: $-6$ (net income down $6$)
- **Equity: $-6$**

Balance check: assets $-6$ = equity $-6$. **It balances.**

| Statement | Line | Change |
|---|---|---|
| Income statement | Pre-tax income | $-10$ |
| | Taxes (40%) | $-4$ |
| | **Net income** | **$-6$** |
| Cash flow | Net income | $-6$ |
| | + Depreciation (add-back) | $+10$ |
| | **Net change in cash (CFO)** | **$+4$** |
| Balance sheet | Cash | $+4$ |
| | PP&E | $-10$ |
| | **Total assets** | **$-6$** |
| | Retained earnings (equity) | $-6$ |

**The insight: the tax shield:** depreciation lowers taxable income so the company keeps $4 that it would otherwise have paid in cash taxes. That is why analysts care about D&A even though it is "not real cash." The general formula:

$$\Delta\text{Net income} = -\text{Dep} \times (1-t) \qquad \Delta\text{Cash} = +\text{Dep} \times t \qquad \Delta\text{PP\&E} = -\text{Dep}$$

---

## 4. Other common flow-through scenarios

**Inventory purchase with cash ($10):**
- IS: no impact (inventory is capitalized, not expensed until sold)
- CFS: inventory up $10 is a use of cash → CFO and cash down $10
- BS: inventory +$10, cash $-10$ → total assets unchanged. Balances.

**Goodwill impairment ($100, no tax benefit since non-deductible):**
- IS: $100 expense → net income $-100$
- CFS: net income $-100$, add back $100$ non-cash impairment → cash unchanged
- BS: goodwill $-100$, retained earnings $-100$ → assets $-100$ = equity $-100$. Balances.

**Inventory write-down ($10, 25% tax rate):**
- IS: pre-tax $-10$, taxes $-2.5$, net income $-7.5$
- CFS: net income $-7.5$, add back $10$ non-cash write-down → CFO and cash $+2.5$
- BS: inventory $-10$, cash $+2.5$ → assets $-7.5$; retained earnings $-7.5$ → equity $-7.5$. Balances.

---

## 5. Working capital

**Net working capital (NWC)** in the operating sense:

$$\text{NWC} = (\text{AR} + \text{Inventory} + \text{Prepaids}) - (\text{AP} + \text{Accrued liabilities})$$

Note: the textbook definition (current assets minus current liabilities) includes cash and short-term debt. The **operating NWC** used in cash flow analysis and DCF work excludes both. Confirm which definition the interviewer wants.

**The cash-flow rule (trips people up):**

- **Increase in an operating asset → use of cash.** You shipped product and booked revenue but have not collected (AR up), or you bought inventory. Cash goes **down**.
- **Increase in an operating liability → source of cash.** You received goods or services but have not yet paid the supplier (AP up). Cash goes **up**.

A growing company that must fund receivables and inventory ahead of collecting can be profitable on the IS and still starved for cash. This is why $\Delta\text{NWC}$ is subtracted in the free cash flow build.

**Example: sale on credit ($15 revenue, $10 COGS, already held in inventory):**
- IS: revenue +$15$, COGS $-10$, pre-tax income +$5$ (ignoring tax)
- CFS: net income +$5$ (approximately), AR up $15$ (use of cash), inventory down $10$ (source) → CFO = $5 - 15 + 10 = 0$. Cash unchanged until AR is collected.
- BS: AR +$15$, inventory $-10$, cash flat → assets +$5$; retained earnings +$5$ → equity +$5$. Balances.

---

## 6. D&A (depreciation and amortization)

**Depreciation** spreads the cost of tangible assets (PP&E) over their useful lives. **Amortization** does the same for definite-lived intangibles: acquired customer relationships, capitalized software, patents. Both are:

- **Non-cash** (no cash consumed in the period)
- **Reduce taxable income** (tax shield)
- **Added back in CFO**

**Goodwill** is not amortized under US GAAP. It is tested for **impairment** annually (or when a triggering event occurs) and written down only if the carrying value exceeds the implied fair value. A goodwill impairment hits net income but not cash (added back in CFO).

---

## 7. Deferred taxes

Companies keep two sets of books: one for shareholders (GAAP/IFRS) and one for the tax authority. When the two recognize income or expense in **different periods**, the difference creates a deferred tax item.

**Deferred tax liability (DTL):** book tax expense exceeds cash taxes paid now, so more tax will be owed later.
- Classic driver: **accelerated depreciation for tax, straight-line for books.** Early years: tax depreciation is larger, so taxable income is lower and less cash tax is owed now. That difference reverses later.
- On the CFS: an **increase in a DTL is added back in CFO** (book expense > cash taxes paid, so net income understated cash).

**Deferred tax asset (DTA):** cash taxes paid exceed book tax expense now, creating a future benefit.
- Common drivers: **net operating loss (NOL) carryforwards**, warranty reserves, certain accruals not yet deductible for tax.
- A DTA build is a **use of cash** in CFO.
- DTAs are reduced by a **valuation allowance** when it is more likely than not the company will not generate enough future taxable income to use them.

---

## 8. Cash vs accrual accounting

| | Accrual | Cash basis |
|---|---|---|
| Revenue recognition | When earned | When cash received |
| Expense recognition | When incurred | When cash paid |
| Who uses it | Public companies (GAAP/IFRS) | Small businesses, some tax filings |

Accrual accounting produces smoother earnings but can diverge significantly from cash flow. The CFS is the bridge that reconciles accrual net income to actual cash movement. This is why analysts stress-test earnings quality by comparing net income to operating cash flow: a persistent gap can signal aggressive revenue recognition or deteriorating working capital management.
