---
title: Public Market Equivalent (PME)
domain: performance
---

# Public Market Equivalent (PME)

## 1. Why PME exists

IRR and multiples are **absolute**. They never answer the question an LP's investment committee actually cares about: *did committing to this illiquid, fee-heavy, risky fund beat the boring alternative of putting the same cash, on the same dates, into a public index?*

PME answers exactly that. It replays the fund's actual cash-flow timing against a public benchmark (S&P 500 total return, MSCI World, a sector index, etc.) and asks whether the private fund did better. An LP's real alternative to a fund is a liquid index, so a 14% IRR is only impressive if the index didn't do better over the same period.

**Two families:**

- **Wealth-ratio / alpha family** (theory-grounded): **KS-PME** and **Direct Alpha**. These discount/compound cash flows *by the index itself* and produce either a ratio (KS-PME) or an annualized excess return (Direct Alpha).
- **Heuristic / replicating-portfolio family**: **Long–Nickels (ICM)**, **PME+**, **mPME**. These build a synthetic portfolio that buys and sells the index in step with the fund's cash flows, then compare. Intuitive but have mechanical failure modes.

---

## 2. Common fund and index inputs used throughout

All worked examples use **one consistent fund and one consistent index path** so the methods can be compared directly.

| Time (yr) | Index level | Fund cash flow |
|---|---|---|
| 0 | 100 | $-100$ (call) |
| 1 | 110 | $-50$ (call) |
| 3 | 130 | $+60$ (distribution) |
| 5 | 150 | $+100$ (distribution) $+$ $40$ (terminal NAV) |

Index total return = $150 / 100 = 1.5\text{x}$ over 5 years = **8.45%/yr** annualized. The fund IRR was **7.37%/yr**. Every PME method below confirms modest underperformance of roughly **−1%/yr** — the same conclusion in three different units.

---

## 3. Kaplan–Schoar PME (KS-PME) — the wealth ratio

**Concept.** Imagine investing every fund contribution into the index instead, and "funding" every distribution by selling index. KS-PME is the ratio of the index-discounted value of what you got back (distributions + remaining NAV) to the index-discounted value of what you put in. It is a **wealth multiple net of the market**.

**Formula.** With terminal index level $I_T$:

$$\text{KS-PME} = \frac{\displaystyle\sum_t D_t \cdot \frac{I_T}{I_t} + \text{NAV}_T}{\displaystyle\sum_t C_t \cdot \frac{I_T}{I_t}}$$

**Interpretation:**

| KS-PME | Meaning |
|---|---|
| $> 1$ | Fund beat the index — LP ended with more wealth |
| $= 1$ | Matched the index |
| $< 1$ | Underperformed the index |
| $1.20$ | LP ended with **20% more wealth** than an identically-timed index investment |

**Worked KS-PME.** Compound each flow to $t = 5$ using the index ($I_T = 150$):

| Flow | Amount | Index at date ($I_t$) | Factor $I_T / I_t$ | Index-adjusted value |
|---|---|---|---|---|
| Call $t_0$ | 100 | 100 | 1.5000 | 150.00 |
| Call $t_1$ | 50 | 110 | 1.3636 | 68.18 |
| **Σ contributions** | | | | **218.18** |
| Dist $t_3$ | 60 | 130 | 1.1538 | 69.23 |
| Dist $t_5$ | 100 | 150 | 1.0000 | 100.00 |
| NAV $t_5$ | 40 | 150 | 1.0000 | 40.00 |
| **Σ distributions + NAV** | | | | **209.23** |

$$\text{KS-PME} = \frac{209.23}{218.18} = 0.959$$

Below 1.0 → the fund returned ~4% *less* terminal wealth than simply buying the index on the same dates. Modest underperformance, consistent with the 7.37% IRR vs 8.45% index.

**Pros:** theoretically clean, simple, dominant academic standard since 2005. **Cons:** it is a *ratio*, not annualized — a 1.10 over 3 years and a 1.10 over 12 years look identical; still relies on reported terminal NAV for unrealized funds.

---

## 4. Long–Nickels / Index Comparison Method (ICM)

**Concept (1996 — the first PME).** Build a *synthetic public investment*: every time the fund calls capital, buy that dollar amount of the index; every time the fund distributes, sell that dollar amount of the index. At the end, you have a **synthetic terminal NAV**. Then compute the IRR of a stream made of the fund's actual contributions and distributions but with the *synthetic* terminal value substituted for the fund's NAV. That **PME IRR** is the rate the index would have delivered on this schedule. The gap between it and the fund's actual IRR is the **IRR spread**.

**Worked LN/ICM.** Track the synthetic portfolio in index "shares" (units):

| Time | Action | Amount | Shares Δ (amt / index) | Share balance |
|---|---|---|---|---|
| 0 | buy | 100 | $+1.000000$ | 1.000000 |
| 1 | buy | 50 | $+0.454545$ | 1.454545 |
| 3 | sell | 60 | $-0.461538$ | 0.993007 |
| 5 | sell | 100 | $-0.666667$ | 0.326340 |

Synthetic terminal NAV = $0.326340 \times 150 = \mathbf{48.95}$ (vs the fund's actual NAV of 40 — the index held more value because the fund underperformed).

LN-PME IRR solves: $0 = -100 - \dfrac{50}{(1+r)^1} + \dfrac{60}{(1+r)^3} + \dfrac{148.95}{(1+r)^5}$ where 148.95 = 100 actual distribution + 48.95 synthetic terminal value.

> **LN-PME IRR = 8.49%/yr.** Fund IRR was 7.37%/yr → **IRR spread = −1.12%/yr.** Negative spread = underperformance.

**Pros:** intuitive ("here's what the index would have returned on your money"), produces a familiar IRR-style number. **Critical flaw — the "shortness problem":** if the fund massively *outperforms*, large early distributions imply "selling" more index than the synthetic portfolio holds, driving the synthetic NAV **negative** and making the PME IRR **incalculable or nonsensical**. This is not a corner case; strong funds break LN-PME routinely.

---

## 5. Direct Alpha — the annualized excess return

**Concept.** Take every cash flow, **compound it forward to the terminal date using the index's return**, then compute the **IRR of that index-adjusted stream** (including the actual final NAV). Because the index movement has been "divided out," the resulting IRR *is* the pure annualized return *in excess of the index* — the alpha.

**Formula.** Direct Alpha is the rate $\alpha$ solving:

$$0 = \sum_t \left[ CF_t \cdot \frac{I_T}{I_t} \right] \cdot (1 + \alpha)^{T - t}$$

Equivalently: scale each flow by $I_T / I_t$ (its index-future-value), keep it at its original date, and take the IRR. $\alpha > 0$ = outperformance; $\alpha < 0$ = underperformance.

**Worked Direct Alpha.** Index-adjust each flow to $t = 5$ (same $I_T/I_t$ factors as KS-PME):

| Time | Original CF | $\times (I_T / I_t)$ | Index-adjusted CF |
|---|---|---|---|
| 0 | $-100$ | 1.5000 | $-150.00$ |
| 1 | $-50$ | 1.3636 | $-68.18$ |
| 3 | $+60$ | 1.1538 | $+69.23$ |
| 5 | $+140$ ($100$ dist $+$ $40$ NAV) | 1.0000 | $+140.00$ |

IRR of $\{-150.00 \text{ @0},\; -68.18 \text{ @1},\; +69.23 \text{ @3},\; +140.00 \text{ @5}\}$:

> **Direct Alpha = −1.03%/yr.** The fund underperformed the index by ~1.0% annualized.

The three theory-grounded readings now agree: **KS-PME 0.959** (wealth ratio below 1), **Direct Alpha −1.03%/yr**, and the **LN spread −1.12%/yr**, all against an index that annualized 8.45% vs a fund IRR of 7.37%.

**Pros:** a true annualized excess return, free of the LN shortness problem, well-founded in theory, and directly comparable across funds and to public alphas — the right number to put in an asset-allocation model. **Cons:** less intuitive to lay committees than "the index would have made X%."

---

## 6. mPME and PME+ — fixing the Long–Nickels flaw

Both exist for one reason: **the original LN method blows up on strong outperformers**, and practitioners needed a replicating-portfolio PME that is always computable.

- **Cambridge Associates mPME (modified PME).** Like LN, capital calls buy the index and distributions sell it, but each distribution sells the **same *proportion*** of the synthetic portfolio's value as the private fund distributed of its own value — not a fixed dollar amount. By construction the synthetic NAV stays positive and can never go short. CA reports the difference between the fund's return and the mPME return as **"Value-Add"** in basis points.

- **PME+ (Rouvinez / Capital Dynamics, 2003).** Scales all distributions by a single factor **lambda ($\lambda$)** chosen so the synthetic public NAV exactly equals the private NAV at the end, guaranteeing a positive, non-short terminal value. Then computes an IRR on the $\lambda$-scaled flows.

If asked *"what's wrong with LN-PME and how is it fixed,"* the answer is: the shortness/negative-NAV problem, fixed by mPME (proportional selling) or PME+ (lambda-scaling).

---

## 7. PME method comparison

| Method | Output | Family | Key strength | Key weakness |
|---|---|---|---|---|
| **KS-PME** | Ratio ($> 1$ = beat market) | Wealth ratio | Theoretically clean; academic standard since 2005 | Not annualized; 1.10 over 3 yrs looks same as 1.10 over 12 |
| **Direct Alpha** | Annualized excess return (%) | Alpha | True annualized alpha; no shortness problem; allocation-ready | Less intuitive to lay audiences |
| **Long–Nickels / ICM** | PME IRR + spread vs fund IRR | Heuristic | Intuitive; IRR-style number | **Breaks (negative synthetic NAV) on strong outperformers** |
| **mPME (Cambridge)** | Return + "Value-Add" (bps) | Heuristic | Always computable; fixes LN shortness | Proprietary; CA-specific |
| **PME+ (Capital Dynamics)** | PME IRR | Heuristic | Always computable; matches final NAV | Distorts individual distribution amounts via $\lambda$ |

**Shared limitations of all PME methods:**
1. They depend on the **reported terminal NAV** for unrealized funds — a stale or aggressive mark flatters every one of them.
2. They **market-adjust but do not risk-adjust**: they assume beta = 1 to the chosen index and ignore PE's leverage, illiquidity, and small-cap tilt. Choosing the right benchmark index matters as much as the method.

---

## 8. Consolidated worked example — one fund, every metric

**Inputs.** Calls: 100 @ yr 0, 50 @ yr 1. Distributions: 60 @ yr 3, 100 @ yr 5. Terminal NAV: 40 @ yr 5. Index: 100 → 110 → 130 → 150 at yrs 0/1/3/5.

| Metric | Value | One-line read |
|---|---|---|
| PIC | 150 | total drawn from LP |
| DPI | 1.067x | cash already returned per dollar in |
| RVPI | 0.267x | unrealized marks per dollar in |
| **TVPI** | **1.333x** | total value per dollar in (= DPI + RVPI) |
| **Net IRR** | **7.37%/yr** | money-weighted annualized return |
| Index annualized | 8.45%/yr | the passive alternative |
| **KS-PME** | **0.959** | ended with ~4% less wealth than the index |
| **Direct Alpha** | **−1.03%/yr** | annualized underperformance vs index |
| **LN-PME IRR** | **8.49%/yr** | what the index would have returned on this schedule |
| **IRR spread (LN)** | **−1.12%/yr** | fund IRR minus LN-PME IRR |

**The LP analyst synthesis:** *"This fund returned 1.33x net (1.07x realized, 0.27x unrealized) at a 7.4% net IRR over five years. On a market-adjusted basis it modestly underperformed an index that compounded at 8.4%: KS-PME 0.96, Direct Alpha −1.0%/yr. The shortfall is small and consistent across PME methods. Before concluding, I'd confirm the 0.27x RVPI mark is supportable and check whether any sub-line or NAV-facility activity is propping the IRR."*
