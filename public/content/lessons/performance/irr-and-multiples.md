---
title: IRR & Money Multiples
domain: performance
---

# IRR & Money Multiples

## 1. The cash-flow lifecycle

A closed-end PE fund is a series of dated cash flows between LPs and the GP. Almost every performance metric is a transformation of one cash-flow stream plus one valuation.

- **Commitment** — total capital an LP contractually promises; not paid up front.
- **Capital call / drawdown / contribution** — cash the GP demands from LPs to fund investments and fees. Cumulative calls = **Paid-In Capital (PIC)**.
- **Distribution** — cash (or stock) returned to LPs from realizations, dividends, or recapitalizations.
- **NAV (Net Asset Value) / Residual Value** — the GP's reported fair value of the still-held portfolio. It is an *estimate*, not cash, and is the soft, manipulable component of every metric that uses it.

**The J-curve.** Early in a fund's life, net cash flow is negative and TVPI dips below par: capital is called, fees are charged, and investments are still held at cost or marked down. Net IRR and TVPI recover as value is created and assets are exited. A fund three years in with a 0.9x TVPI is not necessarily a bad fund; it may be a normal one still on the left side of the J. This is why **vintage-year, like-for-like** comparison is non-negotiable.

---

## 2. The multiples

Multiples answer *"how many dollars came back per dollar in?"* They ignore time entirely — simultaneously their strength (un-gameable by timing) and their weakness (a 2.0x in 3 years and a 2.0x in 12 years look identical).

Let **C** = cumulative contributions (PIC), **D** = cumulative distributions, **NAV** = residual value.

| Metric | Formula | Plain meaning |
|---|---|---|
| **PIC** | $\sum \text{capital calls}$ | Total cash actually drawn from LPs |
| **PIC ratio / % called** | $\text{PIC} / \text{Commitment}$ | How much of the commitment has been drawn |
| **DPI** | $D / \text{PIC}$ | Realized cash multiple ("cash-on-cash") — money you actually have |
| **RVPI** | $\text{NAV} / \text{PIC}$ | Unrealized, paper multiple — the GP's marks |
| **TVPI** | $(D + \text{NAV}) / \text{PIC}$ | Total value multiple; **TVPI = DPI + RVPI** by construction |
| **MOIC** | $\text{Total Value} / \text{Invested Capital}$ | Most precisely deal-level and gross of fund fees |

$$\text{DPI} = \frac{D}{\text{PIC}} \qquad \text{RVPI} = \frac{\text{NAV}}{\text{PIC}} \qquad \text{TVPI} = \text{DPI} + \text{RVPI}$$

### MOIC vs TVPI — the distinction interviewers test

- **TVPI** is a *fund-level* multiple denominated in **paid-in capital** (which includes fees and expenses drawn from LPs), and is typically reported **net** (after fees and carry). It is the LP's actual gross-of-tax wealth multiple.
- **MOIC** is most precisely a *deal-level* multiple denominated in **capital invested into companies**, and is usually **gross** (before fund-level fees and carry). It measures the GP's underwriting on the assets themselves.

So **Net MOIC at the fund level ≈ TVPI**, but **gross deal MOIC > TVPI** because fund fees, carry, and uninvested-but-called capital sit between them. A co-investment with no fee and no carry converts gross MOIC into net MOIC almost one-for-one — which is the entire economic point of co-investing alongside a fund.

### Worked multiples example

Fund cash flows (all figures in millions; year 0 is the first call):

| Time (yr) | Contribution | Distribution | Notes |
|---|---|---|---|
| 0 | 100 | — | |
| 1 | 50 | — | |
| 3 | — | 60 | |
| 5 | — | 100 | Terminal NAV of 40 still held |

- PIC = 100 + 50 = **150**
- D = 60 + 100 = **160**
- NAV = **40**

$$\text{DPI} = \frac{160}{150} = 1.067x$$

$$\text{RVPI} = \frac{40}{150} = 0.267x$$

$$\text{TVPI} = \frac{160 + 40}{150} = \frac{200}{150} = 1.333x \quad (\text{check: } 1.067 + 0.267 = 1.333 \ \checkmark)$$

The LP has already received **1.07x** its money back in cash (DPI), and is carrying another **0.27x** in unrealized marks (RVPI), for a **1.33x** total on paper. The DPI is real; the RVPI is the GP's opinion.

---

## 3. IRR — definition, math, gross vs net, pathologies

### Definition

IRR (internal rate of return) is the **money-weighted, annualized** discount rate $r$ that sets the net present value of all fund cash flows to zero:

$$0 = \sum_t \frac{CF_t}{(1 + r)^t}$$

where $CF_t < 0$ for contributions and $CF_t > 0$ for distributions, with terminal NAV treated as a final inflow on the valuation date. There is no closed-form solution; it is solved numerically. The since-inception IRR (SI-IRR) is the GIPS-required headline return for closed-end funds.

Because it is money-weighted, IRR **rewards getting cash back early** and rewards calling capital late. That sensitivity is the lever every distortion mechanism pulls.

### Worked IRR example (same fund)

| Time | Net CF |
|---|---|
| 0 | $-100$ |
| 1 | $-50$ |
| 3 | $+60$ |
| 5 | $+140$ ($100$ distribution $+$ $40$ terminal NAV) |

Solving $0 = -100 - \dfrac{50}{(1+r)^1} + \dfrac{60}{(1+r)^3} + \dfrac{140}{(1+r)^5}$ numerically gives:

> **Fund net IRR = 7.37% per year.**

Notice the tension with the multiple: a 1.33x TVPI sounds healthy, but spread over five years with a slow back-end it is only ~7.4% annualized. The multiple and the rate tell different stories.

### Gross vs net IRR

- **Gross IRR / gross MOIC** — computed on the fund's cash flows *to and from portfolio companies*, before management fees, fund expenses, and carried interest. Isolates the GP's investing skill.
- **Net IRR / net TVPI** — computed on the LP's actual cash flows, *after* management fees (commonly ~1.5–2.0%), fund expenses, and carried interest (commonly ~20% above an ~8% hurdle). This is what the LP earns.

The **gross-to-net drag** is the cost of being an LP. A several-hundred-basis-point gap on IRR and a few tenths of a turn on MOIC are typical for traditional 2-and-20 funds. Fee-light structures (co-investments, SMAs) shrink this wedge. **On an LP/primaries desk, "the return" almost always means net.** When a GP leads with gross, that is a tell.

### IRR's pathologies

1. **Timing-gameable.** Early distributions, late capital calls (subscription lines), and quick partial exits all lift IRR without creating a dollar more of total value.
2. **The reinvestment issue.** IRR is only the LP's realized compound return if interim distributions are reinvested at the IRR itself. A 40% fund IRR does not mean the LP compounded at 40%. **MIRR** (modified IRR) addresses this by assuming an explicit reinvestment rate, but it is rarely the industry headline.
3. **Not additive.** You cannot average IRRs across funds. To aggregate, you must combine the underlying cash flows and re-solve (a "pooled IRR").
4. **Multiple or no real solution.** With more than one sign change in the cash-flow stream (e.g., recallable distributions, recycling), the polynomial can have multiple real IRRs or none.
5. **Silent on scale and on the market.** IRR says nothing about how much money was made (that is the multiple) or whether the index was beaten (that is PME).

---

## 4. Leverage that distorts the headline

### 4a. Subscription lines (capital-call lines, "sub lines")

**Mechanism.** A revolving credit facility secured by the LPs' *uncalled commitments*. The GP draws on the bank line to fund an investment today, and calls LP capital later (weeks to, in aggressive cases, around a year) to repay the line.

**Effect.** Because IRR is time-sensitive, **shortening the period LP capital is outstanding mechanically raises IRR**, while **TVPI/MOIC is essentially unchanged** and slightly *reduced* by the line's interest cost.

**Worked subscription-line example.** A single deal: invest 100, exit at 2.0x.

| Scenario | LP cash flows | MOIC | IRR |
|---|---|---|---|
| **Base** (no line): called day 1, exit yr 4 | $-100$ @ $t_0$, $+200$ @ $t_4$ | 2.00x | **18.92%** |
| **Sub line, no interest**: call delayed 1 yr, same exit | $-100$ @ $t_1$, $+200$ @ $t_4$ | 2.00x | **25.99%** |
| **Sub line, with ~7% interest** (~7 cost on 100 for 1 yr) | $-100$ @ $t_1$, $+193$ @ $t_4$ | 1.93x | **24.50%** |

Delaying LP capital by one year lifts IRR by **~7 points** (18.9% → 26.0%) with *identical* total value. Even after interest drag the IRR is still **~5.6 points higher** (18.9% → 24.5%) while the **multiple falls** (2.00x → 1.93x). That divergence — IRR up, multiple flat or down — is the fingerprint of subscription-line usage.

**ILPA guidance.** ILPA's **June 2020** guidance requires GPs to disclose **net IRR both with and without the subscription facility**, plus the facility's size, balance, days outstanding, and methodology. Always ask for the **un-levered (without-facility) IRR**; it is the cleaner read on the GP.

### 4b. NAV facilities (NAV loans)

**Mechanism.** A loan secured by the *fund's portfolio assets* (its NAV), typically used later in life when exits are slow. Proceeds may fund follow-ons, refinance asset debt, or — the controversial use — **fund distributions to LPs**.

**Effect.** A NAV-loan-funded distribution **raises DPI and IRR immediately** while **TVPI is roughly unchanged** before costs (distributed cash offset by new fund-level debt). After interest, TVPI *falls*. The distribution is frequently **recallable**.

**Worked NAV-loan example.** Mid-life fund: PIC 100, distributions 20, NAV 100.

| Stage | Distributions | Net NAV | DPI | TVPI |
|---|---|---|---|---|
| Before loan | 20 | 100 | 0.20x | 1.20x |
| After 30 NAV loan, distributed | 50 | 70 (100 − 30 debt) | **0.50x** | **1.20x** (pre-interest) |

DPI leaps from **0.20x to 0.50x** with zero value created. ILPA published **NAV-facility guidance in 2024** for this reason. **"Quality of DPI"**: not all DPI is equal. DPI from genuine exits is real, permanent. DPI from a recallable NAV-loan distribution is borrowed, reversible, and interest-bearing.

> **Summary:** Sub lines move *when LP capital goes in* (later) → inflate IRR, leave multiple ~flat. NAV loans move *when cash comes out* (earlier) → inflate IRR and DPI, leave TVPI ~flat. Both shrink, never expand, the multiple once interest is counted. **The multiple is the harder number to fake; IRR is the easier one.**

---

## 5. IRR vs MOIC tension — which to trust when

They disagree because **they measure different things**: IRR is an annualized *rate* (time matters enormously), MOIC/TVPI is an absolute *multiple* (time is ignored). The disagreement is information, not error.

| Pattern | What it usually means |
|---|---|
| **High IRR, low multiple** | Fast money: quick flips, early exits, dividend recaps, or subscription-line usage |
| **Low IRR, high multiple** | Slow money: long hold that paid a big multiple, or capital that sat called-but-uninvested |
| **High both** | Genuinely strong — worth verifying the cash-flow timeline for financing effects |
| **Low both** | Bad fund, or a healthy fund still on the J-curve (vintage context decides) |

**Which to trust:**

- **Neither in isolation.** Use net IRR, TVPI, DPI, *and* PME together. Any large gap between two of them is a question to investigate.
- **Trust DPI over RVPI-heavy TVPI** when the fund is mature. A 2.5x TVPI that is 0.4x DPI and 2.1x RVPI is almost entirely unrealized marks — an opinion, not a track record.
- **Trust IRR less when the fund is young or levered.** Early IRRs are noisy and most exposed to sub-line distortion.
- **Use PME to settle "was it actually good?"** A 14% IRR is excellent against a 6% public market and poor against a 20% one. Only PME tells you which world you were in.
