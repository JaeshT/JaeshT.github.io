---
title: Track-Record Analysis
domain: primaries
---

## Overview

Track-record analysis is where an analyst spends most of their time. The deliverable is a "track record tear-down" that re-derives every reported number from the underlying cash flows and deal data, because **GPs present their record the way it flatters them most**. Your job is to neutralize the spin.

---

## Gross vs. net returns

GPs quote **gross** deal returns — before management fees, carried interest, fund expenses, and fund-level leverage cost. LPs earn **net**. The gap between them is the total cost of the relationship, and quantifying it is non-negotiable.

**Typical full-life spreads for buyout:**
- Roughly **5–7 points of IRR** lost to fees and carry
- Roughly **0.4x–0.6x of MOIC** lost to fees and carry
- Net TVPI tends to capture about **75%–85% of gross MOIC** for a successful buyout fund

**Worked example (stylized):**
A fund invests $100M and returns $250M gross (gross MOIC 2.50x, gross profit $150M).
- Management fees over fund life: $15M total
- Value after fees, before carry: $250M − $15M = $235M; profit subject to carry ≈ $135M
- Carry at 20%: $0.20 × $135M = $27M
- Net to LP = $235M − $27M = **$208M**; Net MOIC = $208M / $100M = **2.08x**
- Gross-to-net spread = 2.50x − 2.08x = **0.42x** (LP captured 83% of gross result)

A spread much larger than 0.4x–0.6x signals a heavy fee/expense load; a much smaller spread means fees are unusually low (verify in the LPA) or the gross numbers exclude costs they should include.

Always ask for the track record net of **all fees, carry, and expenses**, and additionally **with and without the impact of subscription credit lines** (ILPA's January 2025 Performance Template made dual sub-line disclosure a standard ask).

---

## The core return metrics

| Metric | What it measures | What it hides |
|---|---|---|
| **IRR** | Money-weighted annualized return on dated cash flows | Sensitive to timing; inflated by subscription lines and early small wins; assumes interim distributions re-invest at the IRR itself |
| **MOIC** | Total value / invested capital (deal level, usually gross) | Ignores time entirely (3.0x in 3 years and 3.0x in 12 years look identical); usually gross |
| **TVPI** | (Distributions + NAV) / paid-in capital | Includes unrealized NAV, which is the GP's own opinion of value |
| **DPI** | Cumulative distributions / paid-in capital | Nothing — this is cash in your pocket; cannot be marked up |
| **RVPI** | Residual NAV / paid-in capital | Pure GP mark; most vulnerable to optimism and smoothing |
| **PME** | PE return vs. same cash flows in a public index | Does not adjust for leverage or illiquidity; sensitive to index choice |

**Identity you must know cold:** $\text{TVPI} = \text{DPI} + \text{RVPI}$

As a fund matures, a healthy fund's RVPI should fall as DPI rises (paper turning into cash). If RVPI keeps climbing while DPI stalls, the manager is marking up assets it cannot sell — the single most common late-cycle red flag.

**The IRR vs. MOIC tension** is the most-tested concept. IRR rewards speed; MOIC rewards magnitude. A GP that flips a deal in 18 months at 1.8x posts a spectacular ~45% IRR but returns less absolute profit than a deal held 7 years at 3.0x (~17% IRR). LPs ultimately eat MOIC, not IRR. Distrust any track record where a gaudy IRR sits next to a mediocre MOIC — that pattern is the fingerprint of financial engineering (early dividend recaps, subscription-line timing, quick partial sales) rather than durable value creation.

---

## Realized vs. unrealized: DPI vs. paper marks

Split every track record into **realized** (cash done, irreversible) and **unrealized** (NAV, an opinion). The realized record is evidence; the unrealized record is a forecast dressed as a number.

**How GPs flatter unrealized value:**

- **Stale or sticky marks.** GPs are slow to write down in falling markets ("NAV smoothing"), artificially lowering reported volatility and propping up TVPI. Check whether marks moved at all through 2022–2023, when public comparables fell hard.
- **Held above cost with no validating event.** Be skeptical of large markups not supported by a financing round, a third-party transaction, or genuine EBITDA growth.
- **Marking to the last round.** In venture and growth, companies are often held at the last primary round price, which can be 12–24 months stale.
- **The RVPI-DPI relationship.** A mature fund (year 8+) that is still mostly RVPI has a realization problem, a valuation problem, or both.

**Defensive move:** Haircut unrealized NAV in your own model. LPs commonly stress RVPI down by 10%–40% depending on asset type and mark vintage. If the deal only works at full marks, it does not work.

---

## DPI by vintage: what good looks like

DPI must always be read against the fund's **vintage year** and strategy, never in the abstract.

| Fund age | Typical (median) buyout DPI | Read |
|---|---|---|
| Year 3 | ~0.0x to 0.3x | J-curve, normal |
| Year 5 | ~0.3x to 0.6x | Building |
| Year 7 | ~0.6x to 1.0x | Below ~0.5x raises questions |
| Year 8 | ~1.0x+ | Top quartile ~1.5x |
| Year 10–12 (maturity) | ~1.5x to 2.0x | Top-quartile ends above ~2.0x |

Full scorecard benchmarks for a mature buyout vintage:

| Metric | Median | Top quartile |
|---|---|---|
| Net IRR | 12%–14% | 18%–22% |
| Net TVPI | 1.6x–1.8x | 2.3x–2.7x |
| Net DPI (mature) | ~1.4x–1.7x | 2.0x+ |
| KS-PME vs. S&P 500 | ~1.0x–1.1x | 1.2x+ |
| Capital loss ratio | ~10% range | Lower |

Note: 2025–2026 distributions are running below historical norms because the exit market stalled. Always benchmark a current fund against its peer vintage cohort.

---

## Loss ratios and downside discipline

The **capital loss ratio** is the percentage of invested capital in deals realized below cost, net of any recovered proceeds, divided by total invested capital.

$$\text{Loss ratio} = \frac{\text{Capital in deals realized below cost} - \text{recovered proceeds}}{\text{Total invested capital}}$$

The related **impairment ratio** includes unrealized write-downs: the percentage of invested capital realized *or currently valued* below cost.

**Why it matters:** Two GPs can post the same TVPI — one through a few moonshots offsetting many losses (high loss ratio), one through broad-based base hits (low loss ratio). For a buyout LP relying on consistency, the low-loss-ratio manager is preferable because the outcome is more repeatable.

**Benchmarks:** US buyout and growth equity realized capital loss ratios cluster in roughly the low double digits (often cited around 10%); VC loss ratios are far higher because the VC model expects many zeros. A buyout GP with a 25%+ loss ratio is running a riskier, more VC-like book than the strategy label suggests.

**Watch the gaming angle:** A GP can suppress the reported loss ratio by holding losers at cost rather than crystallizing the loss, or by exiting marginal deals at exactly break-even to avoid a sub-1.0x realization ("loss avoidance" around the 1.0x threshold). Cross-check the loss ratio against the distribution of deal MOICs and against unrealized marks.

---

## Deal attribution and the value-creation bridge

Fund-level returns are an average that can be dominated by one or two deals.

**Top-deal concentration test:** Strip out the top 1, 2, and 3 deals and recompute the fund. If a "2.4x fund" collapses to 1.3x without its single best deal, you are underwriting one piece of luck — not a repeatable process.

**The value-creation bridge** decomposes equity gains into three sources for each deal and in aggregate:

1. **EBITDA growth** = organic revenue growth + margin expansion. The only lever reflecting genuine operating skill.
2. **Multiple expansion** = selling at a higher EV/EBITDA multiple than entry. Often beta and timing, not skill.
3. **Deleveraging** = paying down acquisition debt with portfolio-company cash flow, mechanically growing the equity slice. This is leverage, not operations.

**Formulas:**
$$\text{EBITDA-growth contribution} = (\text{EBITDA}_1 - \text{EBITDA}_0) \times \text{multiple}_0$$
$$\text{Multiple-expansion contribution} = (\text{multiple}_1 - \text{multiple}_0) \times \text{EBITDA}_1$$
$$\text{Deleveraging contribution} = \text{Net debt}_0 - \text{Net debt}_1$$
$$\text{Equity value created} = \text{EBITDA growth} + \text{Multiple expansion} + \text{Deleveraging}$$

**Worked example:**
- Entry: EBITDA $50M, 10x multiple → EV $500M; net debt $300M → equity $200M
- Exit (year 5): EBITDA $80M, 11x multiple → EV $880M; net debt $150M → equity $730M
- Equity MOIC = $730M / $200M = **3.65x**
- EBITDA-growth contribution: ($80M − $50M) × 10 = **$300M** (57%)
- Multiple-expansion contribution: (11 − 10) × $80M = **$80M** (15%)
- Deleveraging contribution: $300M − $150M = **$150M** (28%)
- Total equity value created: $300M + $80M + $150M = **$530M** ✓

**McKinsey finding:** Roughly two-thirds of total buyout return for deals entered 2010+ and exited by 2021 came from multiple expansion and leverage, not operating improvement. With cheap debt and easy multiple expansion gone, Bain's 2026 framing is "12 is the new 5" — deals now require far faster EBITDA growth to hit the same returns.

Therefore: a GP whose historical returns are mostly multiple expansion and leverage is likely to struggle in the current regime. A GP that shows a high, consistent share of returns from EBITDA growth has an edge more likely to survive.

---

## Consistency, persistence, and the truth about quartiles

**Quartile claims are marketing artifacts until verified:**
- Quartile is dataset- and vintage-dependent. A fund can be top quartile in one provider's universe and second quartile in another.
- Always pin the GP to a named benchmark, a specific vintage, and a specific strategy. Do not let a 2016 fund be compared against a 2019 benchmark.

**What the academic evidence actually says:**
- Kaplan & Schoar (2005) showed strong return persistence, making manager selection look like a durable skill.
- Harris, Jenkinson, Kaplan & Stucke (2014) found that **post-2000 buyout persistence is much weaker** — a GP's prior-fund quartile is a poor predictor of the next fund's quartile.
- **What persists more reliably is the bottom:** poor performers tend to stay poor or fail to raise a successor.
- Venture capital retains stronger persistence than buyout.

**Practical implication:** "They were top quartile in Fund III" is weak evidence about Fund VI. Stronger evidence is a coherent, repeatable process that explains the returns, plus a low loss ratio across vintages, plus DPI (realizations) rather than marks. Cambridge Associates notes that consistently being top quartile is exceedingly rare.

---

## PME: did they actually beat the alternative?

PME (Public Market Equivalent) answers: "Did the GP beat the public index, using the GP's own cash-flow timing?" It neutralizes timing games that flatter IRR.

**The PME family:**

- **Long-Nickels PME / ICM** (1996): The original. Builds a hypothetical index investment (contributions buy the index, distributions sell it) and computes a hypothetical IRR. *Weakness:* large early distributions can drive the index position negative, producing nonsensical results.
- **PME+** (Rouvinez/Capital Dynamics, 2003): Scales distributions to keep hypothetical NAV non-negative, fixing Long-Nickels.
- **mPME** (Cambridge Associates, 2013): A modified variant treating the fund as a notional public vehicle.
- **KS-PME** (Kaplan & Schoar, 2005): Returns a **wealth-multiple ratio**. Above 1.0 means the fund beat the index; below 1.0 means it lost to it.

$$\text{KS-PME} = \frac{\sum \text{Distribution}(t) / \text{Index}(t)}{\sum \text{Contribution}(t) / \text{Index}(t)}$$

A KS-PME of 1.18 means LPs ended with 18% more wealth than the same dollars invested in the chosen public index at the same times.

- **Direct Alpha** (Gredil, Griffiths & Stucke): The most rigorous. An annualized alpha derived from the IRR of index-discounted cash flows.

$$\text{Direct Alpha} \approx (\text{KS-PME})^{1/n} - 1$$

(Exact only for a single contribution and distribution; in general it is the IRR of the index-discounted cash flows.)

**Worked example (single-flow simplification):**
- Contribution $100M at t=0; distribution $200M at t=5
- Public index rose 50% over 5 years (1.0 → 1.5)
- FV of contribution at index return: $100M × 1.5 = $150M
- KS-PME = $200M / $150M = **1.33** → the fund delivered 33% more wealth than the index
- Direct Alpha ≈ $(1.33)^{1/5} - 1$ = **5.86% per year** of annualized outperformance

**Index choice matters as much as method.** Benchmark a large-cap buyout fund to the S&P 500, a small-cap fund to the Russell 2000, and a growth/tech fund to the Nasdaq — or you will mis-measure alpha.

**The academic debate on whether PE beats public markets:**
- Kaplan & Schoar (2005, Venture Economics data): average buyout roughly matched the S&P 500 net of fees (KS-PME ~0.97).
- Harris, Jenkinson & Kaplan (2014, Burgiss data from 200+ LPs): buyout outperformed by roughly 20%–27% over a fund's life and more than 3% per year for most vintages since 1984, attributing part of the difference to data-quality problems in the older dataset.
- Phalippou & Gottschalg (2009) and Phalippou's later work argue much of the apparent outperformance shrinks once you adjust for risk, fees, and how returns are reported.

The honest takeaway: PE as an asset class has probably beaten public markets net of fees in buyout over long horizons, but the margin is debated, is concentrated in top managers, and is not guaranteed going forward. This is exactly why manager selection — not asset-class beta — is the LP's job.

---

## Survivorship and selection bias

**Survivorship bias:** The GP track records you are shown are biased toward the survivors. Managers who failed, blew up, or simply stopped raising are absent from the dataset. The performance you see therefore overstates the average LP experience.

**Backfill bias:** GPs contribute historical fund data to databases only if they choose to, and they typically choose to contribute when the record looks good. This biases reported averages upward.

**Selection bias in your own pipeline:** You see PPMs from managers who are actively raising and pitching. The worst managers are often still invisible at the pitch stage; by the time they are visible (a blowup in the press), it is too late to avoid them via sourcing — but not via thorough diligence.

**Implication:** Treat every benchmark number as a point estimate from a market where the losers are underrepresented. The true distribution is fatter in the left tail than benchmarks imply, which makes avoiding the bottom quartile even more valuable than headline statistics suggest.

---

## Vintage benchmarking

A **vintage year** is the year a fund begins investing (holds its first close). All performance comparisons must be vintage-controlled — you cannot compare a 2015 fund's returns to a 2019 benchmark.

Why vintage matters:
- Entry multiples, interest rates, economic conditions, and exit market conditions vary enormously by vintage.
- The 2006–2007 vintages bought into peak multiples right before the financial crisis; the 2009–2010 vintages bought into the trough. The same GP executing the same strategy produced very different returns.
- "We were top quartile" is only meaningful if it is top quartile **among funds of the same vintage and strategy** in a named universe (Cambridge Associates, Preqin, PitchBook, or Burgiss).

Cross-vintage consistency is the gold standard: a GP who maintains above-median performance across multiple vintages — through different macro environments — has evidence of repeatable process, not just luck. Cambridge Associates notes that consistently being top quartile is exceedingly rare; most managers drift in and out of rankings over time.
