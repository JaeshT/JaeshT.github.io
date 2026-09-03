---
title: LBO Basics
domain: technicals
---

# LBO Basics

> This lesson covers the conceptual foundations and return math of a leveraged buyout. The full LBO model build (debt schedules, income statement, balance sheet, and returns waterfall in Excel) is covered in a separate module.

---

## 1. What is an LBO?

A **leveraged buyout (LBO)** is the acquisition of a company funded primarily with **debt**, with a smaller contribution of **sponsor equity** (private equity). The debt is serviced and repaid by the **target's own operating cash flows** over the holding period, typically 3-7 years.

The PE sponsor:
- Contributes a minority of the purchase price as equity (historically 30-50%)
- Borrows the rest (historically 50-70% of EV, though leverage has compressed)
- Controls the company's strategy and operations
- Aims to sell the company (or IPO it) at a higher value than the purchase price

---

## 2. Why LBOs generate equity returns: the three levers

Equity value at exit is created through three sources. **You must be able to attribute returns across all three:**

### Lever 1: EBITDA growth

$$\Delta\text{EV from growth} = \Delta\text{EBITDA} \times \text{Entry multiple}$$

Grow revenue, expand margins, or do both. Higher EBITDA at the same multiple means higher EV; since debt is roughly fixed, the incremental EV accrues to equity.

### Lever 2: Multiple expansion

$$\Delta\text{EV from multiple} = \Delta\text{Multiple} \times \text{Exit EBITDA}$$

Buy at 8× and sell at 10×: the same EBITDA is now worth more. In a strong macro/credit environment (cheap leverage, risk appetite) multiples expand widely. In today's high-multiple, higher-rate environment, this lever is far less reliable: many deals now assume flat or compressing multiples.

### Lever 3: Debt paydown (deleveraging)

$$\Delta\text{Equity from deleveraging} = \text{Debt repaid during hold}$$

Free cash flow repays debt. Each dollar of debt paid down transfers a claim from the lender to the equity holder: equity value rises by the same amount as net debt falls.

**Return attribution identity:**

$$\text{Equity gain} = (\Delta\text{EBITDA} \times \text{Entry multiple}) + (\Delta\text{Multiple} \times \text{Exit EBITDA}) + \text{Debt paydown}$$

A paper LBO with flat multiple shows this cleanly: only EBITDA growth and deleveraging contribute.

---

## 3. Why leverage amplifies equity returns

The intuition: replace expensive equity with cheaper, tax-deductible debt, and any value created accrues to a smaller equity base.

**Example (simplified):** buy a $100 business.
- All-equity: invest $100, sell for $150 → 1.5× MOIC, 50% return
- 50% leverage: invest $50 equity + $50 debt, sell for $150, repay $50 debt → receive $100 equity proceeds → **2.0× MOIC**, 100% return on equity

The same $50 of value creation produces twice the return on equity because the equity base is half the size.

**Tax shield:** interest expense is tax-deductible. A company paying $30M in annual interest at a 25% tax rate saves $7.5M in cash taxes that would otherwise go to the government. Over a 5-year hold, that is $37.5M in incremental cash available to equity or debt repayment.

**The risk:** leverage cuts both ways. If cash flows disappoint, the fixed debt service creates distress risk. This is why the ideal LBO candidate has stable, predictable cash flows.

---

## 4. Sources and uses

Every LBO begins with a **sources-and-uses table** that must balance (sources = uses).

**Uses** (where the money goes):
- Purchase price (equity value of target, often at a premium to current trading price)
- Repayment of existing debt (acquirer usually refinances)
- Transaction fees (advisory, financing, legal)
- Cash to close on balance sheet (some lenders require a minimum cash balance)

**Sources** (where the money comes from):
- New debt: senior secured (term loans), high-yield bonds, mezzanine, revolving credit facility
- Sponsor equity (the **plug**: whatever is left after all other sources)
- Management rollover equity (management reinvests their proceeds into the new structure)
- Excess cash on the target's balance sheet

**The equity check is the plug:** once you know total uses and all debt sources, the equity is whatever fills the gap.

| | Uses | | Sources |
|---|---|---|---|
| Purchase price | $800M | New debt (50%) | $400M |
| Fees | $0M | Sponsor equity | $400M |
| **Total** | **$800M** | **Total** | **$800M** |

---

## 5. Return metrics: MOIC and IRR

**MOIC (Multiple on Invested Capital):**

$$\text{MOIC} = \frac{\text{Total Equity Proceeds at Exit}}{\text{Equity Invested at Entry}}$$

A pure cash-on-cash multiple. **Ignores time.** A 3× MOIC over 3 years is far better than 3× over 10 years.

**IRR (Internal Rate of Return):**

$$\text{NPV} = 0 = -\text{Equity invested} + \frac{\text{Exit proceeds}}{(1+\text{IRR})^{\text{years}}}$$

The annualized, time-weighted discount rate that sets the net present value of equity cash flows to zero. **Time-sensitive.** Always look at IRR and MOIC together.

**Useful rule of thumb (single-bullet investment):**

| MOIC | Hold period | Approximate IRR |
|---|---|---|
| 2.0× | 5 years | ~15% |
| 3.0× | 5 years | ~25% |
| 2.0× | 3 years | ~26% |
| 3.0× | 7 years | ~17% |

Approximation formula: $\text{IRR} \approx \text{MOIC}^{1/\text{years}} - 1$

---

## 6. Worked paper LBO

**Inputs:** entry EBITDA $100M; entry multiple 8.0×; financing 50% debt / 50% equity; hold 5 years; EBITDA grows 10% per year; FCF available for debt paydown averages $40M/year; exit multiple 8.0× (flat).

**Entry:**
- Entry EV = $8.0 \times \$100\text{M} = \$800\text{M}$
- Debt = $50\% \times \$800\text{M} = \$400\text{M}$
- Sponsor equity = $50\% \times \$800\text{M} = \$400\text{M}$ (the plug)

**Operating path:**
- Year-5 EBITDA = $\$100\text{M} \times (1.10)^5 = \$100\text{M} \times 1.6105 = \$161.05\text{M}$
- Cumulative debt paydown = $5 \times \$40\text{M} = \$200\text{M}$
- Exit net debt = $\$400\text{M} - \$200\text{M} = \$200\text{M}$

**Exit:**
- Exit EV = $8.0 \times \$161.05\text{M} = \$1{,}288.4\text{M}$
- Exit equity value = $\$1{,}288.4\text{M} - \$200\text{M} = \$1{,}088.4\text{M}$

**Returns:**
- **MOIC** = $\$1{,}088.4\text{M} \div \$400\text{M} = \mathbf{2.72\times}$
- **IRR** $\approx 2.72^{1/5} - 1 \approx \mathbf{22.2\%}$

**Return attribution:**
- EBITDA growth: $(\$161.05 - \$100) \times 8.0 = +\$488.4\text{M}$ of EV
- Multiple expansion: $(8.0 - 8.0) \times \$161.05 = \$0$ (flat)
- Deleveraging: $+\$200\text{M}$ (debt repaid converts to equity)
- Check: equity gain = $\$1{,}088.4 - \$400 = \$688.4\text{M} = \$488.4 + \$0 + \$200$. **Reconciles.**

---

## 7. What makes a good LBO candidate

The ideal LBO target has:

1. **Stable, predictable cash flows:** high-leverage structures leave little room for cash flow shortfalls; recurring revenue, long-term contracts, and non-cyclical demand reduce risk.
2. **Low capital intensity:** minimal capex requirements means more FCF is available for debt repayment rather than reinvestment in the business.
3. **Defensible market position:** a durable competitive advantage (brand, switching costs, network effects) protects EBITDA margins against competitive pressure during the hold.
4. **Room to improve operations or margins:** PE firms need a value-creation thesis. Whether it is cost-cutting, pricing optimization, geographic expansion, or add-on acquisitions, there must be a credible EBITDA growth path.
5. **Reasonable entry multiple:** paying too high at entry makes it harder for deleveraging and EBITDA growth to generate adequate returns; multiple expansion becomes a necessity rather than a bonus.
6. **Manageable existing debt:** ideally a clean or underleveraged balance sheet that can absorb the new debt load.

**Current market context (Bain 2026):** LBO borrowing costs are in the 8-9% range and leverage ratios have compressed to roughly 30-40% of EV (vs ~50% a decade ago). Entry multiples in North America averaged near 11.9× EV/EBITDA in 2025. In this environment, Bain's "12 is the new 5" thesis applies: deals now need roughly **12% annual EBITDA growth** (versus ~5% historically) to generate comparable returns, because the leverage and multiple-expansion tailwinds of the 2010s are largely gone.

---

## 8. Dividend recapitalization

A **dividend recapitalization** (div recap) is when the PE sponsor raises **new debt** at the portfolio company and uses the proceeds to pay itself a **distribution** mid-hold: before any exit. It pulls forward returns without requiring a sale.

- Increases equity value returned earlier → improves IRR (time-sensitive)
- Does **not** improve MOIC on its own (the same proceeds come back, just sooner)
- Increases the company's leverage, potentially raising distress risk
- Viewed skeptically when done early or aggressively: it can signal the sponsor is uncertain about an exit, or is optimizing IRR at the expense of company health

---

## 9. LBO vs leveraged recapitalization

| | LBO | Leveraged recapitalization |
|---|---|---|
| Who controls company? | PE sponsor (new owner) | Existing management/shareholders |
| Ownership change? | Yes: acquired by PE | No: same shareholders |
| Purpose | Acquisition and value creation | Return cash to existing shareholders |
| Leverage added | At acquisition | Added to existing structure |
