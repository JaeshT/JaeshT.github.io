---
title: Fund Metrics & PME
domain: fund-economics
---

# Fund Metrics & PME

## 1. Core multiples and IRR

LPs evaluate funds on **money multiples** and **rate of return**, then benchmark against public markets via **PME**.

Let **PIC** = paid-in capital (capital actually called), **NAV** = residual value of unrealized holdings, **D** = cumulative distributions.

- **DPI (Distributions to Paid-In) $= D / \text{PIC}$.** The "realized" multiple, the cash actually returned per dollar called. DPI is what LPs ultimately get; an LP saying "show me DPI" is asking for real money, not marks.
- **RVPI (Residual Value to Paid-In) $= \text{NAV} / \text{PIC}$.** The unrealized multiple (paper value still in the ground).
- **TVPI (Total Value to Paid-In) $= \text{DPI} + \text{RVPI} = (D + \text{NAV}) / \text{PIC}$.** The total gross multiple of money (often called the gross MOM at the fund level).
- **MOIC (Multiple on Invested Capital) $= \text{total value} / \text{invested capital}$.** Used at the deal level; at the fund level it is close to TVPI but the base can differ (invested cost vs paid-in).
- **PIC ratio / called ratio $= \text{PIC} / \text{committed}$.** How much of the commitment has been drawn.
- **IRR (Internal Rate of Return):** the discount rate that sets the NPV of all fund cash flows (calls negative, distributions and ending NAV positive) to zero. It is **money-weighted** and therefore sensitive to timing. Because IRR rewards early cash, **subscription lines** can flatter it without improving the multiple, which is why ILPA pushes pref accrual from when capital is at risk.

$$\text{DPI} = \frac{\text{cumulative distributions}}{\text{paid-in capital}}\qquad \text{RVPI} = \frac{\text{residual NAV}}{\text{paid-in capital}}$$

$$\text{TVPI} = \text{DPI} + \text{RVPI}\qquad 0 = \sum_t \frac{CF_t}{(1 + \text{IRR})^t}$$

where $CF$ includes ending NAV as a terminal inflow.

A fund can have a high IRR but low DPI (early paper marks, little realized cash) or a high TVPI but mediocre IRR (great multiple realized slowly). Read them together.

---

## 2. Why PME exists

IRR and TVPI tell you the fund's absolute return but not whether you beat the **public market** you could have bought instead, at the same cash-flow timing. **PME (Public Market Equivalent)** answers: "What if I had put each capital call into a public index and sold the index on each distribution date?" It is the **opportunity-cost / acid test** of going private and illiquid.

---

## 3. The PME family (academic lineage)

| Method | Originators (year) | Output | Mechanic | Known weakness |
|---|---|---|---|---|
| **Long-Nickels PME (ICM, Index Comparison Method)** | Long & Nickels (1996) | An **IRR** of a hypothetical index investment | Calls "buy" the index, distributions "sell" it; terminal value = index position; compare PE IRR to this IRR | Large distributions in a falling market can drive the synthetic index position **negative**, so the IRR fails to compute |
| **PME+** | Rouvinez (2003); Capital Dynamics | An **IRR** | Scales distributions so the synthetic terminal NAV matches the fund's NAV, fixing LN's negative-value problem; introduces a cash-flow mismatch as a trade-off | Adjusts cash flows, so it is an approximation |
| **Kaplan-Schoar PME (KS-PME)** | Kaplan & Schoar (2005), *Journal of Finance* | A **ratio (multiple)** | Future-value (or present-value) every distribution and contribution at the index's return; KS-PME = FV(distributions + ending NAV) / FV(contributions). **>1 means PE beat the index; <1 means it lagged** | Gives no annualized rate by itself |
| **mPME (modified PME)** | Cambridge Associates (2013) | A public-equivalent return | Builds a synthetic public portfolio that mirrors the private fund's NAV path | Vendor-specific |
| **Direct Alpha** | Gredil, Griffiths & Stucke (2014) | An **annualized alpha (IRR)** | Compounds each cash flow by the index to the valuation date, then solves for the IRR of those index-adjusted flows; this *is* the annualized KS-PME and is the only method giving the **exact** rate of out/underperformance | Still depends on choosing the right index and ignores risk differences |

**Relationships to remember:** Direct Alpha is to KS-PME as IRR is to the money multiple. KS-PME and Direct Alpha both compound at the index and avoid Long-Nickels' negative-NAV failure.

**Universal caveat:** no PME adjusts for **risk** (leverage, illiquidity, sector concentration). A higher synthetic-index IRR may reflect risk, not manager skill, and there is **no standardized illiquidity premium**; each LP sets its own.

---

## 4. KS-PME, worked in miniature

$$\text{KS-PME} = \frac{\text{FV}_{\text{index}}(\text{distributions} + \text{ending NAV})}{\text{FV}_{\text{index}}(\text{contributions})}$$

```
Contributions:  C1 = $100 at date 0 ; index grows ×1.5 to valuation date → FV = $150
Distributions:  D1 = $80 at a later date ; index grows ×1.2 from then → FV = $96
Ending NAV:     $120 at valuation date → FV = $120
KS-PME = FV(distributions + ending NAV) / FV(contributions)
       = ($96 + $120) / $150 = $216 / $150 = 1.44  → PE beat the index (>1)
```

(Illustrative figures, not from a specific fund; method per Kaplan-Schoar 2005 and the *ABC of PME*.)

---

## 5. ILPA and the 2025 reporting templates

**ILPA (Institutional Limited Partners Association)** is the global body representing LPs; its membership represents over **$2 trillion** of PE AUM. It is **not a regulator**; its outputs are voluntary best-practice standards and negotiating reference points.

**ILPA Principles 3.0** (published June 2019) are organized around three pillars: **transparency, governance, and alignment of interests**. Economically relevant recommendations include: return all LP capital plus the agreed preferred return before any carry; prefer a **hard hurdle**; carry on **net** profits; **100% fee offsets**; recycling capped and investment-period only; clawback computed **gross of tax**; and limits on subscription-line use so the pref accrues from when capital is actually at risk.

**The ILPA Model LPA (2019/2020)** is a standardized, generally LP-favorable template in **two versions**: a **whole-fund (European)** waterfall version and a **deal-by-deal (American)** version. Under it, 75% in interest of LPs can remove the GP for any or no reason, with immediate termination of the management fee on a no-cause removal.

**The 2025 reporting overhaul (Quarterly Reporting Standards Initiative).** In **January 2025**, ILPA released an overhaul of three interlocking templates:

1. **Reporting Template (v2.0):** more granular fees and expenses, structured and machine-readable (Excel/XML, **not PDF**), aligned with capital-account statements. Replaces the 2016 version starting **Q1 2026** for funds still in their investment period or commencing on/after January 1, 2026.
2. **Performance Template (new):** standardizes IRR, TVPI, MOIC reporting; offers **two methodologies**, **Granular** and **Gross-Up**. Targeted for delivery around Q1 2027.
3. **Capital Call & Distribution Template (v2.0):** standardizes capital-call and distribution notices so cash-flow data reconciles into the Performance Report.

Why it matters for an LP/co-invest team: these templates are what your firm ingests to compute net returns, fee load, and PME consistently across managers. The push to machine-readable, reconciled data is the operational backbone of LP monitoring.
