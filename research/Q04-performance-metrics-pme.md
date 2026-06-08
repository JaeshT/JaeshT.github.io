# Private Equity Performance Metrics & Benchmarking: A Study Guide for an LP / Primaries & Co-Investment Team

*Coverage: IRR (gross/net, subscription-line and NAV-lending distortion), MOIC / TVPI / DPI / RVPI / PIC, PME (Kaplan–Schoar, Long–Nickels/ICM, Direct Alpha, with mPME and PME+), benchmarking (quartiles, vintage year, data providers). Every worked number below has been computed and cross-checked. Sources are listed in §10; non-obvious claims are referenced inline by short key (e.g. [KS2005]).*

**One blunt orientation before the detail:** on an LP desk, no single number is "the answer," and the people who ask you "what was the return" expecting one number are the ones you should be most careful around. IRR, a multiple, and a market-adjusted figure (PME) each answer a *different* question, and a fund can look excellent on one and mediocre on another. The job of this material is to make you fluent enough that you can say *which* metric is being quoted, *how* it can be inflated, and *what* it is silent about.

---

## Table of Contents
1. The fund cash-flow lifecycle (the thing all metrics are computed on)
2. The multiples: PIC, DPI, RVPI, TVPI, MOIC
3. IRR: definition, math, gross vs net, and its pathologies
4. Leverage that distorts the headline: subscription lines and NAV facilities
5. Why IRR and MOIC disagree, and which to trust when
6. PME: the public-market-equivalent family (KS-PME, LN/ICM, Direct Alpha, mPME, PME+)
7. One fund, every metric: the consolidated worked example
8. Benchmarking: quartiles, vintage year, pooled vs median, and the data providers
9. Glossary
10. Flashcards (tagged by sub-topic and difficulty)
11. Interview questions with model answers
12. Formula reference sheet
13. Sources

---

## 1. The fund cash-flow lifecycle

A closed-end PE fund is a series of dated cash flows between the limited partners (LPs, the capital providers) and the general partner (GP, the manager). Almost everything in this guide is a transformation of one cash-flow stream plus one valuation:

- **Commitment**: the total an LP contractually promises. It is *not* paid up front.
- **Capital call / drawdown / contribution**: cash the GP demands from the LP to fund investments and fees. Cumulative calls = **Paid-In Capital (PIC)**.
- **Distribution**: cash (or stock) the GP returns to the LP from realizations, dividends, or recapitalizations.
- **NAV (Net Asset Value) / Residual Value**: the GP's reported fair value of the still-held portfolio at a valuation date. It is an *estimate*, not cash, and it is the soft, manipulable part of every metric that uses it.

**The J-curve.** Early in life a fund shows negative net cash flow and a paper loss: capital is called, fees are charged on committed capital, and investments are still held at cost or marked down. Net IRR and TVPI dip below their starting point, then climb as value is created and assets are exited. Plotting net value over time traces a "J." A fund three years in with a 0.9x TVPI is not necessarily a bad fund; it may be a normal one early in the curve. This is why **vintage-year, like-for-like** comparison (§8) is non-negotiable.

**A note on units.** Distributions and NAV are dollars *returned or still owed to the LP*; contributions are dollars *taken from* the LP. By convention, in an IRR cash-flow stream contributions are negative and distributions (plus terminal NAV) are positive.

---

## 2. The multiples

Multiples answer "**how many dollars came back per dollar in?**" They ignore time entirely. That is simultaneously their strength (un-gameable by timing) and their weakness (a 2.0x in 3 years and a 2.0x in 12 years look identical).

### Definitions and formulas

Let **C** = cumulative contributions (paid-in capital, PIC), **D** = cumulative distributions, **NAV** = residual value at the valuation date.

| Metric | Formula | Plain meaning |
|---|---|---|
| **PIC (Paid-In Capital)** | Σ capital calls | Total cash actually drawn from LPs to date |
| **Paid-in ratio / % called** | PIC / Commitment | How much of the commitment has been drawn |
| **DPI** (Distributions to Paid-In) | D / PIC | Realized cash multiple. The "**realization**" or "**cash-on-cash**" metric. DPI is *money you actually have*. |
| **RVPI** (Residual Value to Paid-In) | NAV / PIC | Unrealized, paper multiple. Marks the GP set. |
| **TVPI** (Total Value to Paid-In) | (D + NAV) / PIC | Total multiple. **TVPI = DPI + RVPI** by construction. |
| **MOIC** (Multiple on Invested Capital) | Total Value / Invested Capital | The multiple, most precisely used at the *deal/portfolio-company level, gross of fund fees*. |

### MOIC vs TVPI: a distinction interviewers test

People use MOIC and TVPI interchangeably and are usually understood, but the precise distinction matters on an LP desk:

- **TVPI** is a *fund-level* multiple, denominated in **paid-in capital** (which includes fees and expenses drawn from LPs), and is typically reported **net** (after fees and carry). TVPI is the LP's actual gross-of-tax wealth multiple.
- **MOIC** is most precisely a *deal-level or aggregate-portfolio* multiple, denominated in **capital invested into companies**, and is usually **gross** (before fund-level fees and carry). It measures the GP's underwriting on the assets themselves.

So **Net MOIC at the fund level ≈ TVPI**, but **gross deal MOIC > TVPI** because fund fees, carry, and uninvested-but-called capital sit between them. When a co-investment is pitched at "2.5x MOIC," ask: gross or net, and on what denominator. A co-invest with no fee and no carry (the usual selling point) converts gross MOIC into net MOIC almost one-for-one, which is the entire economic point of co-investing alongside a fund. [WSP-MOIC][Investopedia-MOIC]

### Worked multiples example

Take this fund (used throughout the guide). All figures are in millions; year 0 is the first call.

| Time (yr) | Contribution (call) | Distribution | Notes |
|---|---|---|---|
| 0 | 100 |  | |
| 1 | 50 |  | |
| 3 |  | 60 | |
| 5 |  | 100 | + terminal NAV of 40 still held |

- PIC = 100 + 50 = **150**
- D = 60 + 100 = **160**
- NAV = **40**
- **DPI = 160 / 150 = 1.067x**
- **RVPI = 40 / 150 = 0.267x**
- **TVPI = (160 + 40) / 150 = 1.333x**  (check: 1.067 + 0.267 = 1.333 ✓)

Read this as: the LP has already received 1.07x its money back in cash (DPI), and is carrying another 0.27x in unrealized marks (RVPI), for a 1.33x total on paper. The DPI is real; the RVPI is the GP's opinion.

---

## 3. IRR: definition, math, gross vs net, pathologies

### Definition

IRR (internal rate of return) is the **money-weighted, annualized** discount rate **r** that sets the net present value of all fund cash flows (treating terminal NAV as a final inflow) to zero:

```
0 = Σ_t  CF_t / (1 + r)^t
```

where CF_t < 0 for contributions, CF_t > 0 for distributions, and the final CF includes the residual NAV as if it were distributed on the valuation date. There is no closed-form solution; it is solved numerically. In PE this since-inception IRR (SI-IRR) is the GIPS-required headline return for closed-end funds. [CFA-GIPS]

Because it is money-weighted, IRR **rewards getting cash back early** and rewards calling capital late. Two funds with identical multiples can have very different IRRs purely from timing. That sensitivity is the lever every distortion in §4 pulls.

### Worked IRR example (same fund)

Net cash-flow stream:

| Time | Net CF |
|---|---|
| 0 | −100 |
| 1 | −50 |
| 3 | +60 |
| 5 | +140 (100 distribution + 40 terminal NAV) |

Solving `0 = −100 − 50/(1+r) + 60/(1+r)^3 + 140/(1+r)^5` numerically gives:

> **Fund net IRR = 7.37% per year.**

Notice the tension with the multiple: a 1.33x TVPI sounds healthy, but spread over five years with a slow back-end it is only ~7.4% annualized. The multiple and the rate tell different stories. Hold this thought for §5.

### Gross vs net IRR (and gross vs net multiples)

- **Gross IRR / gross MOIC**: computed on the fund's cash flows *to and from portfolio companies*, before management fees, fund expenses, and carried interest. It isolates the GP's investing skill.
- **Net IRR / net TVPI**: computed on the LP's actual cash flows, *after* management fees (commonly ~1.5–2.0% on committed or invested capital), fund expenses, and carried interest (commonly ~20% of profit above a ~8% preferred return / hurdle). This is what the LP earns.

The **gross-to-net drag** is the cost of being an LP. Magnitudes vary by fund economics and performance, but a several-hundred-basis-point gap on IRR and a few tenths of a turn on MOIC are typical for traditional 2-and-20-style funds. The drag is precisely why fee-light, carry-light structures (co-investments, certain separately managed accounts) are attractive: they shrink the wedge between the GP's gross result and the LP's net result. **On an LP/primaries desk, "the return" almost always means net.** When a GP leads with gross, that is a tell.

### IRR's pathologies (know these cold)

1. **Timing-gameable.** Early distributions, late capital calls (see subscription lines, §4), and quick partial exits all lift IRR without creating a dollar more of total value.
2. **The reinvestment issue.** IRR describes the fund's own cash flows; it is *not* the compound return an LP's whole portfolio earns unless interim distributions are redeployed at the same IRR. A 40% fund IRR does not mean the LP compounded at 40%; the cash came back and had to be reinvested somewhere, usually at a lower rate. **MIRR** (modified IRR) addresses this by assuming an explicit, separate reinvestment rate, but MIRR is rarely the industry headline.
3. **Not additive.** You cannot average IRRs across funds or pool them by adding. To aggregate, you must combine the underlying cash flows and re-solve (this is what a "pooled IRR" does, §8).
4. **Multiple or no real solution.** With more than one sign change in the cash-flow stream (e.g., a late recall), the polynomial can have multiple IRRs or none. Rare in vanilla funds, but it happens with recallable distributions and recycling.
5. **Silent on scale and on the market.** IRR says nothing about how much money was made (that is the multiple) or whether you beat the alternative of just buying the index (that is PME, §6).

---

## 4. Leverage that distorts the headline: subscription lines and NAV facilities

This is the most important practical section for an LP desk, and the area where you can add value in week one by asking the right question. Two distinct fund-level borrowings flatter the headline metrics in two distinct ways. Both are legal, both are disclosed (increasingly), and both can be defensible. The risk is that they are read as skill when they are leverage.

### 4a. Subscription lines (capital-call lines, "sub lines")

**Mechanism.** A revolving credit facility secured by the LPs' *uncalled commitments*. The GP draws on the bank line to fund an investment *today*, and calls LP capital *later* (weeks to, in aggressive cases, around a year) to repay the line. The LP's cash is therefore "at work" for a shorter time.

**Effect on metrics.** Because IRR is money-weighted and time-sensitive, **shortening the period LP capital is outstanding mechanically raises IRR**, while the **total multiple (TVPI/MOIC) is essentially unchanged**, and is in fact *slightly reduced* by the interest cost the fund pays on the line.

**Worked subscription-line example.** A single deal: invest 100, exit at 2.0x.

| Scenario | LP cash flows | MOIC | IRR |
|---|---|---|---|
| **Base** (no line): capital called day 1, exit year 4 | −100 @ t0, +200 @ t4 | 2.00x | **18.92%** |
| **Sub line, no interest**: call delayed 1 year, same exit | −100 @ t1, +200 @ t4 | 2.00x | **25.99%** |
| **Sub line, with ~7% interest** (≈7 cost on 100 for 1yr) | −100 @ t1, +193 @ t4 | 1.93x | **24.50%** |

Delaying the LP's capital by one year lifts IRR by **~7 points** (18.9% → 26.0%) with *identical* total value, and even after the interest drag it is still **~5.6 points higher** (18.9% → 24.5%) while the **multiple falls** (2.00x → 1.93x). That divergence (IRR up, multiple flat or down) is the fingerprint of subscription-line usage.

**Why it matters to you.** A fund showing a high IRR but only an average TVPI, especially early in life, may be running a large, long-dated sub line. The IRR is then partly a financing artifact, not investing skill. Sub-line interest is a real cost borne by LPs and is a permanent drag on the multiple.

**Governance.** ILPA issued guidance in **2017** and follow-on guidance in **June 2020** recommending that GPs disclose, among other items, **net IRR both with and without the subscription facility**, plus the facility's size, balance, days outstanding, and the methodology used, beginning with the period ending 30 June 2020. [ILPA-SubLines][Ropes2020] The "IRR with and without the line" disclosure exists precisely because the market concluded the line inflates the headline. Always ask for the **un-levered (without-facility) IRR**; it is the cleaner read on the GP.

### 4b. NAV facilities (NAV loans)

**Mechanism.** A loan secured by the *fund's portfolio assets* (its NAV), typically used later in life when exits are slow. Proceeds fund follow-ons, refinance asset debt, or (the controversial use) **fund distributions to LPs**.

**Effect on metrics.** A NAV-loan-funded distribution **raises DPI and IRR immediately** by handing LPs cash sooner, while **total value (TVPI) is roughly unchanged before costs** because the distributed cash is offset by new fund-level debt (a reduction in net NAV). After interest, TVPI is *reduced*. And the distribution is frequently **recallable**, so the LP cannot treat it as permanent realized value. [Callan-NAV][MayerBrown-NAV][CFA-NAV]

**Worked NAV-loan example.** A mid-life fund, paid-in 100, distributed 20 so far, NAV 100.

| Stage | Distributions | Net NAV | DPI | TVPI |
|---|---|---|---|---|
| Before loan | 20 | 100 | 0.20x | 1.20x |
| After 30 NAV loan, distributed | 50 | 70 (100 − 30 debt) | **0.50x** | **1.20x** (pre-interest) |

DPI leaps from **0.20x to 0.50x** with zero value created; the cash came from leverage. TVPI is unchanged before interest and *falls* after it. ILPA published **NAV-facility guidance in 2024** for the same reason it addressed sub lines: early, debt-funded distributions can flatter DPI and IRR ahead of a GP's next fundraise. [CFA-NAV][GLI-NAV]

**The phrase to internalize: "quality of DPI."** Not all DPI is equal. DPI from genuine exits is real, permanent liquidity. DPI from a recallable NAV-loan distribution is borrowed, reversible, and carries an interest cost. Part of an LP analyst's job is to **decompose reported DPI into realized-exit cash vs financing-driven cash**.

> **Summary of the distortion logic:** Sub lines move *when LP capital goes in* (later) → inflate IRR, leave multiple ~flat. NAV loans move *when cash comes out* (earlier) → inflate IRR and DPI, leave TVPI ~flat. Both shrink, never expand, the multiple once interest is counted. **The multiple is the harder number to fake; the IRR is the easier one.**

---

## 5. Why IRR and MOIC disagree, and which to trust when

They disagree because **they measure different things**: IRR is an annualized *rate* (time matters enormously), MOIC/TVPI is an absolute *multiple* (time is ignored). The disagreement is information, not error.

**The canonical disagreements:**

| Pattern | What it usually means |
|---|---|
| **High IRR, low multiple** | Fast money: quick flips, early partial exits, dividend recaps, or **subscription-line usage**. Capital was efficient but didn't compound into a big multiple. Common in funds that returned cash early then stalled. |
| **Low IRR, high multiple** | Slow money: a long hold that eventually paid a big multiple, or capital that sat called-but-uninvested for years. Great absolute value, mediocre annualized rate. |
| **High both** | Genuinely strong, *and* worth checking the cash-flow timeline for sub-line/NAV-loan flattering. |
| **Low both** | Bad fund, or a healthy fund still on the early left side of the J-curve. Vintage context decides which. |

**Which to trust:**

- **Neither in isolation.** The professional answer to "IRR or MOIC?" is "both, plus DPI for realized cash, plus PME for the market-adjusted read." If forced to pick one as least manipulable, the **multiple (TVPI/MOIC)** is harder to game by timing, but it is blind to time and to the cost of capital. The **IRR** captures speed but is the number leverage inflates.
- **Trust DPI over RVPI-heavy TVPI** when the fund is mature. A 2.5x TVPI that is 0.4x DPI and 2.1x RVPI is almost entirely unrealized marks, an opinion, not a track record. A 2.5x that is 2.3x DPI is mostly cash in hand.
- **Trust IRR less when the fund is young or levered at the fund level.** Early IRRs are noisy and most exposed to sub-line distortion. Multiples are more stable early.
- **Use PME to settle "was it actually good?"** A 14% IRR is excellent against a 6% public market and poor against a 20% one. Only PME tells you which world you were in.

**The single most useful habit:** look at all of {net IRR, TVPI, DPI, RVPI, PME} together, plus the cash-flow timeline, before forming a view. A fund that scores well on every one of those *and* survives a look at the dated cash flows is genuinely strong. Any large gap between two of them is a question to ask, not a number to average away.

---

## 6. PME: the public-market-equivalent family

### Why PME exists

IRR and multiples are **absolute**. They never answer the question an LP's investment committee actually cares about: *did committing to this illiquid, fee-heavy, risky fund beat the boring alternative of putting the same cash, on the same dates, into a public index?* PME answers exactly that. It replays the fund's actual cash-flow timing against a public benchmark (S&P 500 total return, MSCI World, a sector index, etc.) and asks whether the private fund did better. [KS2005][GGS2014][CFA-PME]

There are two families:

- **Wealth-ratio / alpha family** (theory-grounded): **KS-PME** and **Direct Alpha**. These start from the idea of discounting/compounding cash flows *by the index itself* and produce either a ratio (KS-PME) or an annualized excess return (Direct Alpha).
- **Heuristic / replicating-portfolio family**: **Long–Nickels (ICM)**, **PME+**, **mPME**. These build a synthetic portfolio that buys and sells the index in step with the fund's cash flows, then compare. They are intuitive but have mechanical failure modes. [PME-Wiki][CapDyn-PME]

We use **one consistent fund and one consistent index path** so the methods can be compared directly. The fund is the example from §2–3. The index (think S&P 500 total return) is observed at each cash-flow date:

| Time (yr) | Index level | Fund cash flow |
|---|---|---|
| 0 | 100 | −100 (call) |
| 1 | 110 | −50 (call) |
| 3 | 130 | +60 (dist) |
| 5 | 150 | +100 (dist) + 40 (terminal NAV) |

Index total return = 150/100 = **1.5x over 5 years = 8.45%/yr** annualized. The fund IRR was 7.37%/yr. So we *expect* the fund to look like a modest underperformer, and every PME method below confirms it at roughly **−1%/yr**. That mutual agreement is the point: when computed correctly on the same inputs, the methods tell the same story.

### 6a. Kaplan–Schoar PME (KS-PME): the wealth ratio

**Concept.** Imagine investing every fund contribution into the index instead, and "funding" every distribution by selling index. KS-PME is the ratio of the index-discounted value of what you got back (distributions + remaining NAV) to the index-discounted value of what you put in. It is a **wealth multiple net of the market**. [KS2005]

**Formula.** Discount (or equivalently compound, since the common index factor cancels) every cash flow by the index level. With terminal index level I_T:

```
            Σ_t  D_t · (I_T / I_t)   +   NAV_T
KS-PME  =  ─────────────────────────────────────
                  Σ_t  C_t · (I_T / I_t)
```

- **KS-PME > 1** → the fund beat the index (you ended with more wealth than the index strategy).
- **= 1** → matched the index.
- **< 1** → underperformed.
- A KS-PME of **1.20** means the LP ended with **20% more wealth** than an identically-timed index investment. [NBER-w17874]

**Worked KS-PME.** Compound each flow to t=5 using the index (I_T = 150):

| Flow | Amount | Index at date | Factor I_T/I_t | Index-adjusted value |
|---|---|---|---|---|
| Call t0 | 100 | 100 | 1.5000 | 150.00 |
| Call t1 | 50 | 110 | 1.3636 | 68.18 |
| **Σ contributions** | | | | **218.18** |
| Dist t3 | 60 | 130 | 1.1538 | 69.23 |
| Dist t5 | 100 | 150 | 1.0000 | 100.00 |
| NAV t5 | 40 | 150 | 1.0000 | 40.00 |
| **Σ distributions + NAV** | | | | **209.23** |

> **KS-PME = 209.23 / 218.18 = 0.959.** Below 1.0 → the fund returned ~4% *less* terminal wealth than simply buying the index on the same dates. Modest underperformance, consistent with the 7.37% IRR vs 8.45% index.

**Pros:** theoretically clean (it is the ratio of index-discounted values, robust to the timing and to GP NAV manipulation in the sense that it market-adjusts), simple, and the dominant academic standard since 2005. **Cons:** it is a *ratio*, not annualized, so a 1.10 over 3 years and a 1.10 over 12 years look identical; it does not by itself give a "return per year"; and like all NAV-using metrics it still leans on the reported terminal NAV for unrealized funds. [KS2005][CFA-PME]

### 6b. Long–Nickels / Index Comparison Method (ICM): the original heuristic

**Concept (1996, the first PME).** Build a *synthetic public investment*: every time the fund calls capital, buy that dollar amount of the index; every time the fund distributes, sell that dollar amount of the index. The synthetic portfolio's value grows and shrinks with the index. At the end, you have a **synthetic terminal NAV**. Then compute the IRR of a stream made of the fund's *actual* contributions and distributions but with the *synthetic* terminal value substituted for the fund's NAV. That "**PME IRR**" is the rate the index would have delivered on this cash-flow schedule. Compare it to the fund's actual IRR; the gap is the **IRR spread**. [PME-Wiki][CFA-PME]

**Worked LN/ICM.** Track the synthetic portfolio in index "shares" (units), buying/selling at each date's index level:

| Time | Action | Amount | Shares Δ (amt / index) | Share balance |
|---|---|---|---|---|
| 0 | buy | 100 | +1.000000 | 1.000000 |
| 1 | buy | 50 | +0.454545 | 1.454545 |
| 3 | sell | 60 | −0.461538 | 0.993007 |
| 5 | sell | 100 | −0.666667 | 0.326340 |

Synthetic terminal NAV = remaining 0.326340 shares × index 150 = **48.95** (vs the fund's actual NAV of 40, since the index held more value, i.e., the fund underperformed).

Now the LN-PME IRR solves `0 = −100 − 50/(1+r)^1 + 60/(1+r)^3 + 148.95/(1+r)^5` (where 148.95 = the 100 actual distribution + 48.95 synthetic terminal value):

> **LN-PME IRR = 8.49%/yr.** Fund IRR was 7.37%/yr → **IRR spread = −1.12%/yr.** Negative spread = underperformance. (Note 8.49% ≈ the index's own 8.45% annualized return, as it should, since the synthetic portfolio *is* the index on this schedule.)

**Pros:** intuitive, easy to explain to a committee ("here's what the index would have returned on your money"), produces a familiar IRR-style number. **Cons, and this is the famous flaw, the "shortness problem":** if the fund massively *outperforms*, the synthetic "sells" of the index implied by large early distributions can exceed the synthetic portfolio's value, driving the synthetic NAV **negative** and making the PME IRR **incalculable or nonsensical** (a negative or null terminal value). The synthetic portfolio effectively goes short the index. This is not a corner case; strong funds break LN-PME routinely. PME+ and mPME were invented specifically to fix it. [CapDyn-PME][TSG-PME]

### 6c. Direct Alpha: the annualized excess return

**Concept (Gredil, Griffiths & Stucke, 2014; published Journal of Corporate Finance 2023).** The cleanest of the family. Take every cash flow, **compound it forward to the terminal date using the index's return**, then compute the **IRR of that index-adjusted stream (including the actual final NAV)**. Because the index movement has been "divided out," the resulting IRR *is* the pure annualized return *in excess of the index*, the alpha. [GGS2014][CFA-PME]

**Formula.** Direct Alpha is the rate α solving:

```
0 = Σ_t  [ CF_t · (I_T / I_t) ] · (1 + α)^(T − t)
```

Equivalently: scale each flow by I_T/I_t (its index-future-value), keep it at its original date, and take the IRR. **α > 0** → outperformance; **α < 0** → underperformance.

**Worked Direct Alpha.** Index-adjust each flow to t=5 (the same I_T/I_t factors as KS-PME), keep dates intact:

| Time | Original CF | × (I_T / I_t) | Index-adjusted CF |
|---|---|---|---|
| 0 | −100 | 1.5000 | −150.00 |
| 1 | −50 | 1.3636 | −68.18 |
| 3 | +60 | 1.1538 | +69.23 |
| 5 | +140 (100 dist + 40 NAV) | 1.0000 | +140.00 |

IRR of {−150.00 @0, −68.18 @1, +69.23 @3, +140.00 @5}:

> **Direct Alpha = −1.03%/yr.** The fund underperformed the index by ~1.0% annualized.

Note the three theory-grounded readings now agree: **KS-PME 0.959** (a wealth ratio just below 1), **Direct Alpha −1.03%/yr**, and the **LN spread −1.12%/yr**, all against an index that annualized 8.45% vs a fund IRR of 7.37% (naive spread −1.07%). Direct Alpha is the right number to put in a portfolio-optimization or asset-allocation model because it is a clean annualized alpha; KS-PME is the right number for "how much more wealth did the manager create than the market."

**Pros:** a true annualized excess return, free of the LN shortness problem (it never goes short the index), well-founded in theory, and directly comparable across funds and to public alphas. **Cons:** less intuitive to a lay committee than LN's "the index would have made X%," and still uses terminal NAV for live funds.

### 6d. mPME and PME+ (know the names and why they exist)

- **Cambridge Associates mPME (modified PME).** CA's proprietary fix for the LN shortness problem. Like LN, capital calls buy the index and distributions sell it, but each distribution sells the **same *proportion*** of the public-equivalent's value as the private fund distributed of its own value, rather than a fixed dollar amount. By construction the synthetic NAV stays positive and can never go short, so it never breaks. CA reports the difference between the fund's return and the mPME return as "**Value-Add**" in basis points. [CA-mPME][CA-Framework]
- **PME+ (Rouvinez / Capital Dynamics, 2003).** Scales all distributions by a single factor **lambda (λ)** chosen so the synthetic public NAV exactly equals the private NAV at the end, again guaranteeing a positive, non-short terminal value. Then computes an IRR on the λ-scaled flows. [CapDyn-PME]

Both exist for one reason: **the original Long–Nickels method blows up on strong outperformers**, and practitioners needed a replicating-portfolio PME that is always computable. If asked "what's wrong with LN-PME and how is it fixed," the answer is the shortness/negative-NAV problem, fixed by mPME (proportional selling) or PME+ (lambda-scaling).

### PME method comparison

| Method | Output | Family | Key strength | Key weakness |
|---|---|---|---|---|
| **KS-PME** | Ratio (>1 = beat market) | Wealth ratio | Theoretically clean; academic standard | Not annualized; no per-year figure |
| **Direct Alpha** | Annualized excess return (%) | Alpha | True annualized alpha; no shortness problem; allocation-ready | Less intuitive to lay audiences |
| **Long–Nickels / ICM** | PME IRR + spread vs fund IRR | Heuristic | Intuitive ("what the index would have made") | **Breaks (negative/short synthetic NAV) on strong outperformers** |
| **mPME (Cambridge)** | Return + "Value-Add" (bps) | Heuristic | Always computable; fixes LN shortness | Proprietary; CA-specific |
| **PME+ (Capital Dynamics)** | PME IRR | Heuristic | Always computable; matches final NAV | Distorts individual distribution amounts via λ |

**All PME methods share two limitations:** (1) they depend on the **reported terminal NAV** for unrealized funds, so a stale or aggressive mark flatters every one of them; and (2) they market-adjust but do **not risk-adjust**: they assume a beta of 1 to the chosen index and ignore PE's leverage, illiquidity, and small-cap tilt. Choosing the *right* benchmark index (sector, size, geography) matters as much as the method.

---

## 7. One fund, every metric: the consolidated worked example

The single fund used throughout, with every metric on one page. Memorize this; it is a complete mental model.

**Inputs.** Calls: 100 @ yr0, 50 @ yr1. Distributions: 60 @ yr3, 100 @ yr5. Terminal NAV: 40 @ yr5. Index (S&P 500 TR proxy): 100 → 110 → 130 → 150 at yrs 0/1/3/5.

| Metric | Value | One-line read |
|---|---|---|
| PIC (paid-in) | 150 | total drawn from LP |
| DPI | 1.067x | cash already returned per dollar in |
| RVPI | 0.267x | unrealized marks per dollar in |
| **TVPI** | **1.333x** | total value per dollar in (= DPI + RVPI) |
| **Net IRR** | **7.37%/yr** | money-weighted annualized return |
| Index annualized | 8.45%/yr | the passive alternative |
| **KS-PME** | **0.959** | ended with ~4% less wealth than the index |
| **Direct Alpha** | **−1.03%/yr** | annualized underperformance vs index |
| **LN-PME IRR** | **8.49%/yr** | what the index would have returned on this schedule |
| **IRR spread (LN)** | **−1.12%/yr** | fund IRR minus LN-PME IRR |

**The synthesis a real LP analyst would write:** *"This fund returned 1.33x net (1.07x realized, 0.27x unrealized) at a 7.4% net IRR over five years. On a market-adjusted basis it modestly underperformed an index that compounded at 8.4%: KS-PME 0.96, Direct Alpha −1.0%/yr. The shortfall is small and consistent across PME methods. Before concluding, I'd confirm the 0.27x RVPI mark is supportable and check whether any sub-line or NAV-facility activity is propping the IRR, since a 7.4% IRR on a 1.33x multiple is unremarkable but not suspicious."* That paragraph is the deliverable the metrics exist to produce.

---

## 8. Benchmarking: quartiles, vintage year, pooled vs median, and the data providers

A standalone return is meaningless. The question is always *relative to comparable funds and to the public market.* This section covers peer benchmarking (the providers) and connects back to PME (the market benchmark).

### 8a. Vintage-year benchmarking

A fund is compared only to **other funds of the same vintage year, same strategy, same geography**. The vintage controls for the macro and market environment a fund was born into: a 2007 buyout fund and a 2010 buyout fund faced utterly different worlds, and comparing them is malpractice.

**Vintage year definition is not standardized**, and this is a genuine cross-provider inconsistency to flag: it is variously defined as the year of the fund's **first capital call/drawdown**, the year of its **first close**, or the year of its **final close**. A fund near a year boundary can land in different vintages (and therefore different peer sets and quartiles) at different providers. Always confirm which definition a benchmark uses before ranking a fund against it. [Preqin-Bench][PitchBook-Bench]

### 8b. Quartiles

Within a vintage-and-strategy cohort, funds are ranked by a chosen metric (usually net IRR *or* net TVPI, and the two can rank a fund differently). The cohort is cut into four equal groups:

- **Top quartile**: best 25%. The breakpoint between the 1st and 2nd quartile is the **25th-percentile (top-quartile) boundary**; being "top quartile" means at or above it.
- **Median**: the 50th percentile, the line between 2nd and 3rd quartiles.
- **Bottom-quartile boundary**: the 75th-percentile line; below it is the worst 25%.

**The trap interviewers set:** a fund can be **top-quartile by IRR but second-quartile by TVPI** (or vice versa) within the *same* cohort, because the two metrics rank differently: a fast, sub-line-flattered, modest-multiple fund ranks high on IRR and lower on multiple. "Top quartile" is meaningless unless you specify *by which metric, in which provider's dataset, for which vintage and strategy.* Cambridge explicitly notes that the median fund by IRR can differ from the median fund by TVPI/DPI/RVPI. [CA-Bench] GPs naturally quote whichever quartile flatters them.

### 8c. Pooled vs average vs median IRR

Three different "the cohort returned X%" numbers exist and they are not interchangeable:

- **Pooled IRR**: aggregate *all* funds' cash flows into one combined stream and solve a single IRR. This is **capital-weighted**: big funds dominate. Cambridge Associates uses a **pooled horizon IRR** (money-weighted, net of fees/expenses/carry, interim flows dated at quarter mid-points) as its official index figure. [CA-Bench]
- **Average (mean) IRR**: the simple arithmetic mean of individual fund IRRs, equal-weighted, distorted upward by a few huge winners (PE returns are highly skewed).
- **Median IRR**: the middle fund. Equal-weighted, robust to outliers, usually *lower* than the pooled/mean because of the right-skew. The median is the honest "typical fund" number; the pooled is the "typical dollar" number.

For a skewed asset class, **report median for the typical experience and pooled for the asset-weighted experience, and never average IRRs casually** (recall §3: IRRs are not additive).

### 8d. The data providers and how they differ

This is where an LP desk lives. The four major commercial private-capital datasets differ primarily in **how they source data**, which drives **what they cover** and **which biases they carry**. The differences are real but, reassuringly, academic work (Harris–Jenkinson–Kaplan and others) has found that average returns and PMEs across Burgiss, Cambridge, and Preqin are broadly *consistent*, suggesting the biases do not overturn conclusions about PE performance overall. [NBER-w17874][HJK2014] The older Venture Economics / Thomson dataset is the known exception: it materially *understated* buyout performance because GPs stopped updating NAVs after the relationship lapsed (Stucke, 2011). [NBER-w17874][Jaeckel]

| Provider | Primary data source | Coverage strength | Known/alleged bias | Notes |
|---|---|---|---|---|
| **Cambridge Associates** | Fund **financial statements** and GP/advisory-client relationships; widely cited as the consultant-grade benchmark | Buyout, VC, growth, credit, real assets; long history; quarterly benchmark books | Possible tilt toward **GPs raising new funds** (who skew successful) per academic work | Uses **pooled horizon IRR** + proprietary **mPME**. *Source disagreement: some secondary/marketing sources describe CA as "LP-reported"; authoritative academic sources treat it as fund-financial-statement / GP-sourced. Flagged.* [CA-Bench][NBER-w17874][Dakota] |
| **Burgiss → MSCI Private Capital** | **LP-reported**: complete cash-flow histories from LPs who let Burgiss aggregate; sourced from the LP's own books | Performance data back to **1978**; survivorship-bias-free within reporting LPs; underpins academic PERC dataset | Possible **selected sample of LPs**, but complete *within* each reporting LP | **MSCI completed acquisition of The Burgiss Group on 2 Oct 2023**; now branded **MSCI Private Capital**. Dataset cited at 13,000+ funds / ~$15tn cumulative at acquisition. Considered the research gold standard for cash-flow data. [MSCI-Burgiss][MSCI-Inst][NBER-VC] |
| **Preqin** | **Public filings + Freedom of Information Act (FOIA) requests** to public pensions, plus voluntary LP/GP submissions | Very broad fund universe; named/identifiable funds; strong for market-mapping and fundraising data | May **miss high performers** that have no public-pension LP (top VC funds in particular restrict disclosure) | Individual funds identifiable; publishes vintage quartiles by strategy/geography. [Preqin-Bench][SimCorp][NBER-w17874] |
| **PitchBook** | **FOIA + direct LP/GP requests**; strongest **deal-level** and company database | Deal, company, and fund data; good for sourcing and comps | Similar FOIA-driven gaps to Preqin on the fund-performance side | Best known for granular deal/company intelligence layered onto fund data. [PitchBook-Bench][SimCorp][Kenan] |

**Practical takeaways for the desk:**
- **Burgiss/MSCI** = the cleanest cash-flow data (LP-sourced, survivorship-free), best for rigorous PME and persistence work.
- **Cambridge** = the most-quoted consultant benchmark; watch the possible successful-GP tilt.
- **Preqin** = broadest map and best fundraising intel; weakest where top funds hide from FOIA.
- **PitchBook** = go-to for deal-level diligence and company comps.
- A GP can almost always find *one* provider, *one* metric, *one* vintage definition, and *one* quartile cut under which it is "top quartile." Your job is to pin down all four and pick the like-for-like comparison the GP would least prefer.

### 8e. Useful market context (slow-changing; verify the latest before quoting)

For scale and tone, recent industry reporting (Bain & Company's Global Private Equity Report and CFA Institute research) documented that the post-2022 environment squeezed exits and distributions: distributions as a share of NAV fell to roughly decade lows, buyout fundraising fell about 23% in 2024 versus the prior year, and average fundraising timelines stretched toward ~19 months. This is the backdrop that drove the surge in NAV facilities and continuation funds discussed in §4. Treat any specific figure as a point-in-time data point and re-confirm the current Bain/McKinsey/Preqin numbers before citing. [Bain2025][CFA-NAV]

---

## 9. Glossary

| Term | Definition |
|---|---|
| **Capital call / drawdown / contribution** | Cash the GP demands from LPs to fund investments and fees. |
| **Carried interest (carry)** | GP's profit share, commonly ~20% above a preferred return; the main driver of gross-to-net drag. |
| **Commitment** | Total capital an LP contractually promises to a fund. |
| **DPI (Distributions to Paid-In)** | D / PIC. Realized, cash-on-cash multiple. Permanent unless distributions are recallable. |
| **Direct Alpha** | IRR of the index-future-valued cash-flow stream; the annualized excess return over the benchmark. |
| **Distribution** | Cash or stock returned to LPs from realizations, dividends, or recaps. |
| **Gross vs net** | Before vs after management fees, fund expenses, and carried interest. LPs care about net. |
| **Hurdle / preferred return** | Minimum LP return (often ~8%) before the GP earns carry. |
| **IRR (since-inception, SI-IRR)** | Money-weighted annualized rate setting NPV of all fund cash flows (incl. terminal NAV) to zero. |
| **J-curve** | Early-life dip in net value/IRR (fees + cost marks) before value creation and exits lift it. |
| **Kaplan–Schoar PME (KS-PME)** | Index-discounted (distributions + NAV) ÷ index-discounted contributions; >1 beats the market. |
| **Long–Nickels / ICM** | First PME (1996); synthetic index portfolio buys on calls, sells on distributions; yields a PME IRR. Breaks on strong outperformers (shortness problem). |
| **MIRR (modified IRR)** | IRR variant assuming an explicit, separate reinvestment rate for interim distributions. |
| **MOIC** | Multiple on Invested Capital; most precisely deal-level and gross. Net fund MOIC ≈ TVPI. |
| **mPME (Cambridge)** | Proprietary PME selling a fixed *proportion* of the synthetic portfolio per distribution; never goes short; reports "Value-Add" in bps. |
| **NAV (Net Asset Value) / Residual Value** | GP's fair-value estimate of the unrealized portfolio; the soft, manipulable input. |
| **NAV facility / NAV loan** | Fund-level loan secured by the portfolio; debt-funded distributions inflate DPI/IRR, leave TVPI ~flat, often recallable. |
| **PIC (Paid-In Capital)** | Cumulative capital called. Denominator of DPI/RVPI/TVPI. |
| **PME (Public Market Equivalent)** | Family of methods comparing a fund to a public index on the fund's own cash-flow timing. |
| **PME+ (Capital Dynamics)** | Scales distributions by a factor λ so synthetic public NAV matches private NAV at the end; avoids shortness. |
| **Pooled IRR** | Single IRR on the combined cash flows of many funds; capital-weighted. |
| **Quartile** | Rank within a vintage/strategy cohort; top quartile = best 25%, by a *specified* metric. |
| **Recallable distribution** | A distribution the GP can claw back (e.g., to repay a NAV loan or for recycling); not permanent DPI. |
| **RVPI (Residual Value to Paid-In)** | NAV / PIC. Unrealized, paper multiple. |
| **Subscription line (capital-call line)** | Revolver secured by uncalled commitments; delays LP calls, inflating IRR while leaving the multiple ~flat. |
| **TVPI (Total Value to Paid-In)** | (D + NAV) / PIC = DPI + RVPI. Total value multiple, usually net. |
| **Value-Add (Cambridge)** | Fund return minus mPME return, in basis points. |
| **Vintage year** | The cohort year of a fund (first call / first close / final close; definition varies by provider). |

---

## 10. Flashcards

*Format: Q → A. Tagged [Sub-topic | Difficulty]. 34 cards.*

**1. [Multiples | Easy]** What does TVPI equal in terms of DPI and RVPI?
→ TVPI = DPI + RVPI. Total value per dollar paid in = realized cash multiple + unrealized mark multiple.

**2. [Multiples | Easy]** What is the denominator of DPI, RVPI, and TVPI?
→ Paid-In Capital (PIC) = cumulative capital called from LPs. Not commitment.

**3. [Multiples | Easy]** A fund has paid-in 150, distributed 160, NAV 40. Give DPI, RVPI, TVPI.
→ DPI = 160/150 = 1.067x; RVPI = 40/150 = 0.267x; TVPI = 200/150 = 1.333x.

**4. [Multiples | Medium]** Distinguish MOIC from TVPI.
→ MOIC is most precisely deal-level and gross (total value ÷ capital invested in companies). TVPI is fund-level and usually net (total value ÷ paid-in, which includes fees). Net fund MOIC ≈ TVPI; gross deal MOIC > TVPI.

**5. [Multiples | Medium]** Why prefer DPI over TVPI for a mature fund?
→ DPI is realized cash; TVPI includes RVPI, which is the GP's unrealized mark (an opinion). A mature 2.5x TVPI that is only 0.4x DPI is mostly paper.

**6. [Multiples | Hard]** Can two funds have identical TVPI but very different DPI? What does it signal?
→ Yes. Same total value, different realized/unrealized split. Higher DPI = more cash returned, lower risk that marks won't materialize; lower DPI = value still trapped in unrealized NAV.

**7. [IRR | Easy]** Define IRR in one sentence.
→ The money-weighted annualized discount rate that sets the NPV of all fund cash flows (terminal NAV treated as a final inflow) to zero.

**8. [IRR | Easy]** Is IRR time-weighted or money-weighted?
→ Money-weighted (dollar-weighted). It is highly sensitive to the timing and size of each cash flow.

**9. [IRR | Medium]** Why can't you average the IRRs of several funds?
→ IRR is non-additive; it is the root of a polynomial. To aggregate, combine the underlying cash flows and re-solve (a pooled IRR).

**10. [IRR | Medium]** What is the "reinvestment assumption" critique of IRR?
→ IRR is only the LP's realized compound return if interim distributions are reinvested at the IRR itself. They usually aren't, so a high fund IRR overstates the LP's actual portfolio compounding. MIRR addresses this with an explicit reinvestment rate.

**11. [IRR | Hard]** When can IRR have multiple solutions or none?
→ When the cash-flow stream has more than one sign change (e.g., recallable distributions, recycling, late capital calls). The NPV polynomial can then have multiple roots or no real root.

**12. [IRR | Medium]** Gross vs net IRR: what sits between them?
→ Management fees, fund expenses, and carried interest. The gap is the cost of being an LP; co-investments shrink it by carrying little/no fee and carry.

**13. [Distortion | Easy]** What is a subscription line secured by?
→ The LPs' uncalled commitments.

**14. [Distortion | Medium]** How does a subscription line affect IRR vs MOIC?
→ It delays LP capital calls, shortening the time LP cash is outstanding → IRR rises; MOIC/TVPI is ~unchanged and slightly *reduced* by the line's interest cost.

**15. [Distortion | Hard]** A deal returns 2.0x. Capital called day 1, exit yr 4 → IRR? Call delayed 1 year via sub line, exit yr 4 → IRR? MOIC in each?
→ Base: 2^(1/4)−1 = 18.9% IRR, 2.0x. Delayed: 2^(1/3)−1 = 26.0% IRR, still 2.0x. ~7 points of IRR from timing alone, zero extra value.

**16. [Distortion | Medium]** What did ILPA's 2020 guidance ask GPs to disclose about sub lines?
→ Net IRR both *with and without* the subscription facility, plus facility size, balance, days outstanding, and methodology, from the period ending 30 June 2020.

**17. [Distortion | Easy]** What is a NAV loan secured by?
→ The fund's portfolio assets (its net asset value), not the uncalled commitments.

**18. [Distortion | Medium]** How does a NAV-loan-funded distribution affect DPI, IRR, and TVPI?
→ DPI and IRR rise immediately (cash out sooner); TVPI is ~unchanged before interest (cash offset by new debt) and falls after interest. The distribution is often recallable.

**19. [Distortion | Hard]** Explain "quality of DPI."
→ DPI from genuine exits is permanent, costless cash; DPI from a recallable NAV-loan distribution is borrowed, reversible, and interest-bearing. An analyst must decompose reported DPI into realized-exit vs financing-driven cash.

**20. [Distortion | Medium]** Which is harder to game, IRR or the multiple? Why?
→ The multiple. IRR is timing-sensitive and inflated by sub lines, NAV loans, and early exits; the multiple (after interest) cannot be expanded by leverage, only reduced.

**21. [IRR vs MOIC | Medium]** A fund shows high IRR, low multiple. Likely cause?
→ Fast money: quick flips, early partial exits, dividend recaps, or subscription-line usage. Efficient capital that never compounded into a large multiple.

**22. [IRR vs MOIC | Medium]** Low IRR, high multiple: likely cause?
→ Slow money: a long, eventually-large exit, or capital that sat called-but-uninvested. Great absolute value, poor annualized rate.

**23. [IRR vs MOIC | Hard]** Asked "IRR or MOIC, which do you trust?": best answer?
→ Neither alone. Use both, plus DPI for realized cash and PME for the market-adjusted read. Any large gap between two of them is a question to investigate, not a number to average.

**24. [PME | Easy]** What question does PME answer that IRR and multiples cannot?
→ Whether committing to the illiquid fund beat putting the same cash, on the same dates, into a public index.

**25. [PME | Medium]** State the KS-PME formula and its interpretation thresholds.
→ KS-PME = [Σ D_t·(I_T/I_t) + NAV_T] / [Σ C_t·(I_T/I_t)]. >1 beat the index, =1 matched, <1 underperformed. 1.20 = 20% more terminal wealth than the index.

**26. [PME | Medium]** What does Direct Alpha output, and how is it computed?
→ An annualized excess return over the benchmark. Compound every cash flow forward to T by the index, then take the IRR of that index-adjusted stream (incl. actual final NAV). α>0 = outperformance.

**27. [PME | Hard]** What is the "shortness problem" of Long–Nickels PME and how is it fixed?
→ On strong outperformers, large distributions imply selling more index than the synthetic portfolio holds, driving synthetic NAV negative (short) and making the PME IRR incalculable. Fixed by mPME (sell a fixed *proportion* of the synthetic portfolio) or PME+ (scale distributions by λ so final synthetic NAV matches private NAV).

**28. [PME | Hard]** KS-PME = 0.96, Direct Alpha = −1.0%/yr, LN spread = −1.1%/yr. Do they agree?
→ Yes. All three say modest underperformance (~1%/yr). KS-PME is a wealth ratio, Direct Alpha an annualized rate, LN spread an IRR difference: the same conclusion in three units.

**29. [PME | Medium]** Two limitations shared by ALL PME methods?
→ (1) They rely on the reported terminal NAV for live funds (stale/aggressive marks flatter them). (2) They market-adjust but do not risk-adjust (assume beta 1; ignore PE leverage, illiquidity, size tilt).

**30. [Benchmarking | Easy]** What is a vintage year and why benchmark within it?
→ The cohort year of a fund (first call/first close/final close; varies by provider). Benchmarking within vintage controls for the macro/market environment a fund was born into.

**31. [Benchmarking | Medium]** A fund is top-quartile by IRR but second-quartile by TVPI in the same cohort. Possible? What does it suggest?
→ Yes; the two metrics rank differently. Suggests fast/early cash or sub-line-flattered IRR with only a modest multiple. "Top quartile" must specify metric, provider, vintage, and strategy.

**32. [Benchmarking | Medium]** Pooled IRR vs median IRR: which is higher and why?
→ Pooled (capital-weighted) is usually higher than median (equal-weighted middle fund) because PE returns are right-skewed; big winners pull the capital-weighted figure up. Median is the "typical fund."

**33. [Data Providers | Medium]** How do Burgiss/MSCI and Preqin differ in data sourcing?
→ Burgiss/MSCI is LP-reported (complete cash-flow histories from LPs, survivorship-free). Preqin is sourced from public filings and FOIA requests plus voluntary submissions, so it may miss top funds with no public-pension LP.

**34. [Data Providers | Hard]** Why does the same fund show different quartiles across Cambridge, Preqin, and Burgiss?
→ Different universes (different funds included), different sourcing biases, different vintage-year definitions, and different metric/weighting conventions (e.g., CA's pooled horizon IRR + mPME). A GP can pick the most flattering combination.

---

## 11. Interview questions with model answers

**Q1. Walk me through the difference between IRR and MOIC, and tell me which one you'd trust more.**
IRR is the money-weighted annualized rate that zeros the NPV of the fund's cash flows; MOIC/TVPI is the absolute multiple of value to capital, ignoring time. They diverge because IRR rewards timing (early cash, late calls) while the multiple is timing-blind. I wouldn't "trust one more" in the abstract. The multiple is harder to manipulate, so it's the more robust *single* number, but it ignores the cost of capital and time. IRR captures speed but is exactly what subscription lines and NAV loans inflate. In practice I'd look at net IRR, TVPI, DPI, and a PME together, and treat a large gap between any two (say a high IRR on a modest multiple) as a signal to inspect the cash-flow timeline for financing effects, not as something to average away.

**Q2. A GP shows you a 30% net IRR. What's the first thing you ask for?**
The matching multiple (TVPI and DPI) and the dated cash flows. A 30% IRR with a 1.4x TVPI on a young fund smells like subscription-line leverage or quick partial exits; a 30% IRR with a realized 2.5x DPI over a normal hold is real. I'd specifically ask for the **IRR without the subscription facility** (ILPA's 2020 guidance established that disclosure), and I'd ask whether any distributions were NAV-loan-funded or recallable, because that inflates both IRR and DPI without creating value.

**Q3. Explain how a subscription line inflates IRR but not the multiple, with rough numbers.**
The line lets the GP fund a deal today and call LP capital later, so LP cash is outstanding for less time. Take a deal that returns 2.0x. Called day one, exited in year four, the IRR is 2^(1/4)−1 ≈ 18.9% at a 2.0x multiple. Delay the LP call by a year via the line and exit at the same time: now it's 2^(1/3)−1 ≈ 26.0%, still 2.0x. Seven points of IRR from timing alone. The multiple is unchanged, and after the line's interest it's slightly *lower*. So a fund leaning on a long-dated line looks better on IRR and the same-or-worse on the multiple.

**Q4. What is PME and why do LPs care about it?**
PME asks whether the fund beat the public market on the fund's own cash-flow schedule, the question IRR and multiples can't answer. An LP's real alternative to a fund is a liquid index, so a 14% IRR is only impressive if the index didn't do better over the same period. PME replays the fund's calls and distributions against an index. KS-PME gives a wealth ratio (>1 beat the market); Direct Alpha gives an annualized excess return. LPs care because it's the only metric that separates manager skill from a rising tide.

**Q5. Compare Kaplan–Schoar PME and Direct Alpha.**
Both are theory-grounded and use the index to adjust the cash flows. KS-PME is a *ratio* (index-discounted distributions plus NAV over index-discounted contributions) telling you the wealth multiple relative to the market, but it isn't annualized, so a 1.10 over three years and over twelve years look the same. Direct Alpha computes the *IRR* of the index-adjusted cash-flow stream, giving a true annualized alpha that's comparable across funds and feeds cleanly into asset-allocation models. They never disagree on direction: KS-PME above 1 corresponds to positive Direct Alpha. On one test fund I'd cite, KS-PME 0.96 lined up with Direct Alpha −1.0%/yr.

**Q6. What's wrong with the original Long–Nickels PME?**
The shortness problem. LN builds a synthetic index portfolio that buys the index on every call and sells it on every distribution. If the fund strongly outperforms, its large distributions imply selling more index than the synthetic portfolio holds, so the synthetic NAV goes negative (the portfolio is effectively short the index) and the PME IRR becomes incalculable or nonsensical. It's not rare; strong funds break it. mPME fixes it by selling a fixed *proportion* of the synthetic portfolio per distribution, so the NAV can't go negative; PME+ fixes it by scaling distributions with a factor λ so the final synthetic NAV matches the private NAV.

**Q7. You have a fund at 2.5x TVPI but 0.3x DPI, eight years in. Reaction?**
Skeptical. Eight years in, a healthy fund should have realized meaningfully more than 0.3x. A 2.5x that is 2.2x unrealized is almost entirely the GP's marks, which are an opinion until proven by exits, and current markets have made exits slow. I'd scrutinize the valuation methodology, look for recent third-party validation of the marks, check for any continuation-fund or NAV-loan activity, and weight DPI and PME heavily over the TVPI. The risk is a 2.5x paper number that realizes far lower.

**Q8. How do the major data providers differ, and why does it matter?**
They differ mainly in sourcing. Burgiss (now MSCI Private Capital after MSCI completed the acquisition in October 2023) is LP-reported, giving complete, survivorship-free cash-flow histories; it's the research gold standard. Cambridge Associates draws largely from fund financial statements and GP relationships and is the most-quoted consultant benchmark, with a possible tilt toward GPs raising new funds. Preqin and PitchBook lean on FOIA requests to public pensions plus voluntary submissions, so they're broad and name funds but can miss top managers that don't have public LPs and don't disclose. It matters because a GP can find the provider, metric, vintage definition, and quartile cut that flatters it; the analyst's job is to force a like-for-like comparison. Encouragingly, academic work finds average returns and PMEs are broadly consistent across Burgiss, Cambridge, and Preqin, so the biases don't overturn big-picture conclusions.

**Q9. What's the difference between a pooled IRR and a median IRR for a vintage?**
Pooled IRR aggregates all the funds' cash flows into one stream and solves a single IRR, and it's capital-weighted, so the biggest funds dominate; Cambridge uses a pooled horizon IRR as its official figure. Median IRR is the middle fund, equal-weighted and robust to outliers. Because PE returns are heavily right-skewed, the pooled and mean numbers usually sit above the median. For "what did the typical fund do," cite the median; for "what did the typical dollar do," cite the pooled. And you never just average IRRs, because IRR isn't additive.

**Q10. Why is vintage-year benchmarking essential, and what's a subtlety in it?**
A 2007 buyout fund and a 2012 one faced different entry valuations, leverage availability, and exit windows; comparing across vintages confounds skill with the environment. The subtlety is that vintage year isn't standardized (providers variously use first capital call, first close, or final close), so a fund near a year boundary can fall into different vintages and peer sets, changing its quartile. Always confirm the vintage definition before ranking.

**Q11. A GP distributed cash this quarter and DPI jumped from 0.2x to 0.5x right before they launched a new fund. Concerned?**
Yes, I'd investigate the source. A DPI jump just before a fundraise is a classic flag for a NAV-loan-funded distribution: the GP borrows against the portfolio and distributes the proceeds, lifting DPI and IRR with no value created, sometimes with recallable distributions. ILPA issued NAV-facility guidance in 2024 for exactly this. If it's genuine exit proceeds, fine; if it's leverage, the "DPI" is borrowed, reversible, costs interest, and shouldn't be read as realized track record. I'd ask for use-of-proceeds, recallability terms, and the facility's loan-to-value.

**Q12. For a co-investment, why does MOIC matter more than for a fund commitment?**
Co-investments typically carry little or no management fee and no carry, so the gross-to-net wedge nearly disappears and gross MOIC converts almost directly into the LP's net multiple, and that fee saving is the entire economic rationale for co-investing. But the same un-diversified, single-asset exposure means I can't lean on a fund-level multiple to average out a loser; concentration risk is higher. So I'd underwrite the deal's own gross MOIC and downside carefully, model the (small) fee drag explicitly, and not assume fund-style diversification will rescue a bad single name.

**Q13. If you could see only one metric for a ten-year-old fund, which would it be?**
Net DPI, with PME a close second. At ten years a fund should be mostly realized, so DPI is the cash the LP actually has, the least manipulable and most final number, immune to the marking games that inflate RVPI-heavy TVPI. Its weakness is that it ignores the public-market alternative, which is why I'd want PME alongside it. I'd avoid relying on IRR alone here because a decade of potential sub-line and NAV-facility activity could have flattered it.

---

## 12. Formula reference sheet

```
PIC (Paid-In Capital)      = Σ capital calls
% called                   = PIC / Commitment

DPI                        = Cumulative Distributions / PIC
RVPI                       = Residual NAV / PIC
TVPI                       = (Distributions + NAV) / PIC = DPI + RVPI
MOIC (deal, gross)         = Total Value / Invested Capital ; Net fund MOIC ≈ TVPI

IRR: solve for r in        0 = Σ_t  CF_t / (1 + r)^t
   (contributions CF_t < 0 ; distributions and terminal NAV CF_t > 0)

KS-PME                     = [ Σ_t D_t·(I_T/I_t) + NAV_T ] / [ Σ_t C_t·(I_T/I_t) ]
   ( >1 outperform | =1 match | <1 underperform )

Direct Alpha: solve for α  0 = Σ_t [ CF_t·(I_T/I_t) ] · (1+α)^(T−t)
   ( = IRR of the index-future-valued cash-flow stream incl. final NAV ; α>0 outperform )

Long–Nickels / ICM:
   synthetic shares_t       buy CF_t/I_t on calls, sell CF_t/I_t on distributions
   synthetic terminal NAV   = remaining shares × I_T
   LN-PME IRR               = IRR of { actual contributions, actual distributions, synthetic terminal NAV }
   IRR spread               = Fund IRR − LN-PME IRR     ( negative = underperform )

PME+ (Capital Dynamics)    distributions × λ so synthetic public NAV = private NAV at T, then IRR
mPME (Cambridge)           each distribution sells the same % of synthetic NAV as fund distributes;
                           Value-Add (bps) = Fund return − mPME return

Subscription line          delays calls → shorter LP capital duration → IRR ↑, multiple ~flat (↓ by interest)
NAV loan distribution       cash out sooner → DPI ↑, IRR ↑, TVPI ~flat (↓ by interest); often recallable
```

**Verified worked-example values (single consistent fund; index 100→110→130→150 at yrs 0/1/3/5):**
```
Calls: 100@yr0, 50@yr1 | Distributions: 60@yr3, 100@yr5 | Terminal NAV 40@yr5
PIC 150 | DPI 1.067x | RVPI 0.267x | TVPI 1.333x
Fund net IRR        7.37%/yr
Index annualized    8.45%/yr
KS-PME              0.959   (underperform)
Direct Alpha       −1.03%/yr
LN-PME IRR          8.49%/yr  ->  IRR spread −1.12%/yr
Sub-line example: 2.0x deal | called yr0 exit yr4 -> 18.92% IRR ; call delayed 1yr -> 25.99% IRR (2.0x) ; with ~7 interest -> 24.50% IRR (1.93x)
NAV-loan example: PIC 100, dist 20, NAV 100 -> DPI 0.20x/TVPI 1.20x ; +30 NAV loan distributed -> DPI 0.50x/TVPI 1.20x (pre-interest)
```

---

## 13. Sources

Authoritative and primary sources prioritized. Definitions cross-checked against CFA Institute, ILPA, Cambridge Associates, and academic papers; secondary explainers used only for framing.

- **[KS2005]** Kaplan, S. N. & Schoar, A. (2005). "Private Equity Performance: Returns, Persistence, and Capital Flows." *Journal of Finance* 60(4), 1791–1823. DOI 10.1111/j.1540-6261.2005.00780.x. (Origin of KS-PME.)
- **[GGS2014]** Gredil, O., Griffiths, B. & Stucke, R. "Benchmarking Private Equity: The Direct Alpha Method." SSRN working paper 2403521 (2014); published in *Journal of Corporate Finance* (2023), ScienceDirect S0929119923000093.
- **[CFA-PME]** CFA Institute, Enterprising Investor: "Evaluating Private Equity Performance: PME vs. Direct Alpha" (2014). rpc.cfainstitute.org / blogs.cfainstitute.org.
- **[PME-Wiki]** "Public Market Equivalent," Wikipedia (Long–Nickels/ICM history, heuristic vs alpha families, US patent 7,058,583). Cross-checked against TSG and Capital Dynamics primary materials.
- **[CapDyn-PME]** Capital Dynamics white papers on PME+ and "the shortness issue of PME" (Rouvinez, 2003; 2015 white paper). capdyn.com.
- **[TSG-PME]** TSG / "Private equity benchmarking: Public market equivalent methods and analysis" (ICM incalculable-PME / negative terminal value illustration).
- **[CA-mPME] / [CA-Framework]** Cambridge Associates, "A Framework for Benchmarking Private Investments" (mPME definition: proportional selling, robust/non-short). cambridgeassociates.com.
- **[CA-Bench]** Cambridge Associates quarterly Index and Selected Benchmark Statistics books (pooled horizon IRR methodology; mid-period dating; median by IRR can differ from median by TVPI/DPI/RVPI).
- **[ILPA-SubLines]** ILPA, Subscription Lines of Credit guidance (2017; follow-on June 2020): disclose net IRR with and without the facility, plus facility terms. ilpa.org.
- **[Ropes2020]** Ropes & Gray / Lexology / National Law Review (June 2020) summaries of ILPA 2020 subscription-facility disclosure recommendations (quarterly and annual items; 30 June 2020 start).
- **[CFA-NAV]** CFA Institute Research & Policy Center, "Continuation Funds: Ethics in Private Markets" (2025): NAV-loan DPI/IRR effects, ILPA 2024 NAV-facility guidance, Bain 2025 context.
- **[Callan-NAV] / [MayerBrown-NAV] / [GLI-NAV]** Callan ("NAV Loans Risk," 2025), Mayer Brown ("NAV Facilities: ILPA's New Guidance," 2024), Global Legal Insights ("NAV facilities: the investor's perspective," 2026): NAV-loan use cases, DPI/IRR inflation concern, recallability, ILPA 2024 guidance.
- **[MSCI-Burgiss]** MSCI Inc. press releases: announcement (14 Aug 2023, $697m for remaining 66%, ~$913m aggregate) and completion (2 Oct 2023) of the Burgiss acquisition; dataset ~13,000+ funds / ~$15tn, data back to 1978. ir.msci.com.
- **[MSCI-Inst]** MSCI Institute, "Private assets: celebrating over a decade of academic insights" (2025): MSCI Private Capital branding; Burgiss data is LP-sourced and survivorship-bias-free; underpins PERC.
- **[NBER-w17874]** Harris, Jenkinson & Kaplan, "Private Equity Performance: What Do We Know?" (NBER w17874 / *Journal of Finance* 2014): cross-provider bias discussion (Burgiss LP-selected; CA possible new-fundraising tilt; Preqin FOIA gaps; VE understatement) and broad consistency of returns/PMEs.
- **[NBER-VC]** Harris, Jenkinson, Kaplan & Stucke, "Venture Capital Data: Opportunities and Challenges" (NBER w22500): Burgiss coverage, reporting-bias-free LP histories, backfill-bias discussion.
- **[HJK2014]** Harris, Jenkinson & Kaplan (2014) PME comparison across Burgiss/CA/Preqin/VE; buyout outperformance, average PME ~1.20 in their samples.
- **[Jaeckel]** Jäckel, C. (2021), "The ultimate guide to private equity performance": Stucke (2011) Venture Economics downward-bias finding; cross-dataset consistency.
- **[SimCorp] / [Kenan] / [Dakota]** SimCorp (FOIA-based sourcing of Preqin/PitchBook; identifiable funds), UNC Kenan Institute ("What Do Different Commercial Data Sets Tell Us About Private Equity Performance?"), Dakota provider overview (2026). *Note: Dakota describes Cambridge as "LP-reported," which conflicts with the NBER characterization of CA as fund-financial-statement/GP-sourced; the academic source is treated as authoritative and the disagreement is flagged in §8d.*
- **[Preqin-Bench] / [PitchBook-Bench]** Preqin Benchmarks methodology page (multi-source: manager reports, LPAs, FOIA) and PitchBook benchmarking documentation.
- **[CFA-GIPS]** CFA Institute, Global Investment Performance Standards (GIPS) for private market / closed-end funds: since-inception money-weighted IRR as required return.
- **[WSP-MOIC] / [Investopedia-MOIC]** Wall Street Prep and Investopedia: MOIC vs TVPI definitions and gross/net distinctions (used for plain-language definitions only).
- **[Bain2025]** Bain & Company, Global Private Equity Report 2025 (market context: distributions/NAV at lows, ~23% buyout fundraising decline in 2024, ~19-month fundraising timelines), as cited in CFA RPC research. *Re-verify current figures before quoting.*

**Flagged source disagreements:**
1. **Cambridge Associates data sourcing**: academic/NBER sources treat CA as fund-financial-statement / GP-sourced (with a possible successful-GP tilt); some secondary/marketing sources call it "LP-reported." Resolved in favor of the academic characterization; disagreement noted (§8d).
2. **Vintage-year definition**: not standardized (first call vs first close vs final close); varies by provider and shifts quartile placement (§8a).
3. **Whether NAV-loan distributions are still widely used to "game" DPI**: some 2025–2026 industry sources argue the practice is fading as GPs shift NAV proceeds toward follow-ons; critics maintain the DPI-inflation concern. Both views noted (§4b).
4. **Provider biases vs conclusions**: individual datasets carry distinct biases, yet HJK (2014) find average returns/PMEs broadly consistent across Burgiss/CA/Preqin; the old Venture Economics data is the documented exception (downward bias). Noted (§8d).

*All numeric examples in this guide were computed and cross-checked rather than recalled. Figures dependent on current market conditions (provider AUM/coverage, fundraising statistics) are point-in-time and should be re-verified against the latest provider and Bain/McKinsey/Preqin publications before being quoted in live work.*
