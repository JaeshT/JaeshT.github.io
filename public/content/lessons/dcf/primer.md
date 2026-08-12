---
title: DCF & WACC
domain: technicals
---

# DCF & WACC

## 1. Overview

The **discounted cash flow (DCF)** values a business on its own projected cash flows, discounted to present value. It is the most theoretically grounded valuation method and also the most assumption-sensitive: small changes in WACC or growth rate produce large swings in value, which is why interviewers probe every assumption.

The standard approach is an **unlevered DCF** that values the enterprise:

1. Build unlevered free cash flow (UFCF) for an explicit forecast period (typically 5-10 years)
2. Estimate a terminal value (TV) for all cash flows beyond the forecast
3. Discount both at WACC to get enterprise value (EV)
4. Bridge from EV to equity value

---

## 2. Unlevered free cash flow (UFCF)

**UFCF** (also called Free Cash Flow to the Firm, FCFF) is the cash available to **all** capital providers: debt and equity: before financing costs:

$$\text{UFCF} = \underbrace{\text{EBIT} \times (1-t)}_{\text{NOPAT}} + \text{D\&A} - \text{Capex} - \Delta\text{NWC}$$

where $\Delta\text{NWC}$ = change in net working capital (an **increase** in NWC is a **use** of cash, subtracted).

**Why "unlevered"?** UFCF is computed **before interest**, so it ignores the capital structure. It represents the operating business's cash generation as if it were entirely equity-financed. Discounting UFCF at WACC yields **enterprise value**: the value to all capital providers.

**Contrast with levered FCF (FCFE):** levered FCF subtracts interest and mandatory debt repayment. It represents cash available to **equity holders only** and is discounted at the **cost of equity** to yield **equity value directly.** The unlevered approach is the convention in most valuation work.

---

## 3. WACC. Weighted Average Cost of Capital

WACC is the blended required return across all of the company's capital, weighted by market values:

$$\text{WACC} = \frac{E}{V} K_e + \frac{D}{V} K_d (1-t)$$

where:
- $E/V$ = market-value weight of equity
- $D/V$ = market-value weight of debt
- $K_e$ = cost of equity
- $K_d$ = pre-tax cost of debt
- $t$ = corporate tax rate
- $(1-t)$ term: interest is tax-deductible, so the effective cost to the firm is the after-tax rate

**Use market-value weights, not book-value weights.** Book values are historical; the market determines the current opportunity cost of capital.

### 3.1 Cost of equity. CAPM

$$K_e = R_f + \beta \times \text{ERP}$$

- $R_f$ = **risk-free rate**: typically the 10-year government bond yield
- $\beta$ = **beta**: the stock's systematic risk relative to the market (market = 1.0)
- **ERP (equity risk premium)**: the expected market return over the risk-free rate; practitioners commonly use 4-6%

**For private companies:** no public beta is available. Take comparable public company betas, **unlever** them to remove the effect of each comp's capital structure, take the median unlevered beta, then **relever** to the target's own capital structure:

$$\beta_{\text{unlevered}} = \frac{\beta_{\text{levered}}}{1 + (1-t)(D/E)} \qquad \beta_{\text{relevered}} = \beta_{\text{unlevered}} \times \left[1 + (1-t)(D/E)_{\text{target}}\right]$$

### 3.2 Worked WACC

Inputs: $R_f = 4.5\%$; ERP $= 5.5\%$; $\beta = 1.0$; pre-tax $K_d = 6.667\%$; $t = 25\%$; equity weight $80\%$; debt weight $20\%$.

$$K_e = 4.5\% + 1.0 \times 5.5\% = 10.0\%$$

$$K_d(1-t) = 6.667\% \times 0.75 = 5.0\%$$

$$\text{WACC} = 0.80 \times 10.0\% + 0.20 \times 5.0\% = 8.0\% + 1.0\% = \mathbf{9.0\%}$$

---

## 4. Terminal value

The explicit forecast covers 5-10 years. Everything after is captured in the **terminal value (TV)**, which often drives **60-80% of total DCF value**: making TV assumptions the single most important (and most scrutinized) inputs.

### 4.1 Gordon Growth Model (perpetuity growth)

$$\text{TV} = \frac{\text{UFCF}_n \times (1+g)}{\text{WACC} - g}$$

- $g$ = perpetual growth rate; must be **below WACC** or the formula produces a negative/infinite value
- $g$ is conventionally capped at long-run GDP/inflation (roughly **2-3%**); a company cannot outgrow the economy forever

### 4.2 Exit (terminal) multiple

$$\text{TV} = \text{Terminal-year EBITDA} \times \text{Exit EV/EBITDA multiple}$$

The exit multiple is typically informed by current trading comps: you are essentially saying "the business will be sold for whatever a peer would trade for today."

### 4.3 Cross-check between methods

**Always cross-check:** back out the **implied perpetual growth rate** from your exit multiple TV, and the **implied exit multiple** from your Gordon growth TV. If they diverge wildly, at least one assumption is wrong. Consistency between the two methods gives you confidence in the TV.

---

## 5. Mid-year convention

The naive DCF assumes each year's cash arrives in a lump at year-end (discount periods 1, 2, 3, ...). In reality cash flows in throughout the year, so the **mid-year convention** discounts each year's UFCF at **periods 0.5, 1.5, 2.5, ...**

This raises value modestly because cash is treated as received half a year sooner on average.

**Treatment of terminal value under mid-year is contested:**
- Some practitioners discount Gordon TV at period 4.5 (same as the last explicit cash flow period), treating the perpetuity as mid-year flows.
- Others discount an exit-multiple TV at the full period 5.0, since the exit represents a point-in-time sale at year-end.
- Both are defensible. Pick one approach, state it, and apply it consistently.

---

## 6. Fully worked mini-DCF

**Inputs:** Year-1 UFCF = $130.0M, growing 5% per year; Year-5 EBITDA = $280M; exit multiple 8.0×; Gordon growth $g = 2.5\%$; WACC = 9.0% (from Section 3.2 above); net debt = $400M.

**Step 1. Explicit cash flows:**

| Year | UFCF ($M) | Discount factor (year-end) | PV year-end ($M) | Discount factor (mid-year) | PV mid-year ($M) |
|---|---|---|---|---|---|
| 1 | 130.00 | 0.9174 | 119.26 | 0.9578 | 124.52 |
| 2 | 136.50 | 0.8417 | 114.89 | 0.8787 | 119.95 |
| 3 | 143.33 | 0.7722 | 110.68 | 0.8062 | 115.55 |
| 4 | 150.49 | 0.7084 | 106.61 | 0.7396 | 111.31 |
| 5 | 158.02 | 0.6499 | 102.70 | 0.6785 | 107.22 |
| **Sum PV(UFCF)** | | | **554.14** | | **578.55** |

**Step 2. Terminal values:**

*Gordon Growth:*
$$\text{TV} = \frac{158.02 \times 1.025}{0.09 - 0.025} = \frac{161.97}{0.065} = \$2{,}491.8\text{M}$$
$$\text{PV(TV)} = 2{,}491.8 \times 0.6499 = \$1{,}619.4\text{M} \quad \text{(year-end discounting, } \div 1.09^5\text{)}$$

*Exit Multiple:*
$$\text{TV} = 8.0 \times \$280\text{M} = \$2{,}240.0\text{M}$$
$$\text{PV(TV)} = 2{,}240.0 \times 0.6499 = \$1{,}455.8\text{M}$$

**Step 3. Enterprise and equity value:**

| Method | PV(UFCF) | PV(TV) | EV | Net Debt | **Equity Value** |
|---|---|---|---|---|---|
| Gordon Growth | 554.14 | 1,619.4 | **2,173.6** | 400 | **1,773.6** |
| Exit Multiple | 554.14 | 1,455.8 | **2,009.9** | 400 | **1,609.9** |

**Mid-year impact on explicit FCFs:** PV of the five UFCFs rises from $554.1M to $578.6M, a 4.4% increase, because cash is received on average half a year sooner.

---

## 7. From EV to equity value (and per-share price)

1. Start with EV from the DCF
2. **Subtract net debt** (total debt minus cash)
3. **Subtract preferred stock** (senior to common)
4. **Subtract minority interest** (you are buying 100% of the consolidated entity's EV but only your share of the equity)
5. **Divide by diluted shares** for implied share price

$$\text{Implied Share Price} = \frac{\text{EV} - \text{Net Debt} - \text{Preferred} - \text{Minority Interest}}{\text{Diluted Shares}}$$

---

## 8. Sensitivity analysis

A DCF without sensitivity tables is incomplete. The key sensitivities:

- **WACC vs perpetual growth rate (g):** the classic 5×5 or 7×7 sensitivity table shows how equity value changes across a range of each. This reveals the "safe zone" and the scenarios where the stock is clearly over/undervalued.
- **WACC vs exit multiple:** similar table for the exit-multiple TV method.
- **Revenue growth and margin:** how sensitive is EV to the top-line assumption?

Because TV often represents 60-80% of EV, a 0.5% change in $g$ or 0.5× change in exit multiple can move equity value by 15-25%. Always show this to the reader.

---

## 9. Common mistakes in DCF

| Mistake | Why it matters |
|---|---|
| Using book-value weights in WACC | Overstates or understates cost of capital |
| Setting $g >$ WACC | Perpetuity formula breaks; implies infinite value |
| Setting $g$ above long-run GDP | Nothing can outgrow the economy forever |
| Not cross-checking TV methods | Inconsistent assumptions go undetected |
| Forgetting the EV-to-equity bridge | DCF gives EV; equity value needs the bridge |
| Mid-year on explicit FCFs only | Inconsistency between FCF and TV discounting |
| Single-point output with no sensitivity | Hides the enormous uncertainty in the TV |
| Circular WACC (debt levels change as company deleverages) | True in an LBO; use an iterative or APV approach |
| Using levered beta without relevering | Understates cost of equity for highly levered companies |
| Inconsistent tax rates | WACC tax shield and UFCF tax should use the same rate |
