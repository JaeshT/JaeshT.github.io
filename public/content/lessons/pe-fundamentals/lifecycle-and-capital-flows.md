---
title: Fund Lifecycle & Capital Flows
domain: pe-fundamentals
---

## The Closed-End Fund: A Fixed Life

A closed-end PE fund moves through **four overlapping phases** across roughly a **ten-year life** (plus extensions). Understanding these phases — and the capital flows within each — is the daily language of an LP-side analyst.

The **10+2 structure** is the market convention: a ten-year base term with two one-year extension options at the GP's or LPAC's discretion. Practical lives frequently reach **eleven to twelve years**, and some assets take longer.

---

## The Four Phases

### Phase 1: Fundraising (~12–24 months)

The GP markets the fund, negotiates the LPA with prospective LPs, and signs up investors.

**Key milestones:**
- **First close:** The fund reaches sufficient commitments to begin investing. The GP can start calling capital and doing deals from this point. New LPs may still join.
- **Final close:** The point after which no new LPs are admitted. Late-closing LPs typically pay **equalization interest** — a charge compensating first-close LPs so all LPs are treated as if invested from the first close.

### Phase 2: Investment Period / Commitment Period (~years 1–5, commonly 5 years)

The GP **sources and makes new platform investments**. Capital is called from LPs as deals close. Management fees during this phase are charged on **committed capital** (you pay on money not yet deployed).

After the investment period ends:
- The GP generally **cannot make new platform investments**, only follow-on investments and add-ons to existing portfolio companies
- The fee base typically steps down (lower rate and/or shifts to invested cost or NAV)

### Phase 3: Holding and Value Creation (overlapping with and following Phase 2)

The GP **works the portfolio**: operational improvements, add-on acquisitions ("buy-and-build"), margin expansion, leadership changes, and balance-sheet optimization.

Over the past decade in software buyouts:
- Revenue growth drove ~52% of value creation
- Multiple expansion contributed ~42%
- Margin growth was a small remainder

This shift toward operational value creation (vs. leverage and multiple expansion) is the defining theme of modern PE.

### Phase 4: Harvesting / Wind-Down (years 5–10+)

The GP **exits investments** and distributes proceeds to LPs. Exit routes include:
- Sale to a strategic buyer
- Sale to another sponsor ("secondary buyout")
- IPO
- Dividend recapitalization
- Sale into a continuation vehicle

As assets are sold, the fund winds down. When the last asset is liquidated, any **clawback** is settled and the fund terminates.

---

## Lifecycle Timeline

```
Year:    0    1    2    3    4    5    6    7    8    9    10   11   12
         |----Fundraising----|
         |--- Investment / commitment period ---|
                        |------- Holding & value creation -------|
                                  |------------ Harvesting / exits ------------|
                                                                  |- extensions->|

Capital calls:   High during years 1–5 (investments + fees); fee-only calls thereafter
Distributions:   Near zero early; ramping from ~year 4–5; peaking years 6–9
```

---

## Core Capital Definitions

These three measures are tested constantly and must never be confused:

### The Capital Hierarchy

$$\text{Committed Capital} \geq \text{Paid-in (Called) Capital} \geq \text{Invested Capital}$$

| Term | Definition | What Lives in the Gap |
|---|---|---|
| **Committed capital** | The maximum amount an LP contractually agrees to provide; a promise, not yet a transfer | — |
| **Paid-in / called / contributed capital (PIC)** | Cumulative cash actually drawn from LPs to date; includes amounts for investments, fees, and expenses | Fees & expenses between PIC and invested |
| **Invested capital** | The subset of paid-in capital actually deployed into portfolio assets | Fees & expenses between paid-in and invested |

**Why the gaps matter:** Fees and expenses sit in the gap between paid-in and invested capital — this is exactly why **net returns lag gross returns**. A fund earning 2.0× gross on its investments might only deliver 1.48× net to the LP after the drag of management fees and carried interest.

### Unfunded Commitment

$$\text{Unfunded Commitment} = \text{Committed} - \text{Paid-in}$$

The amount an LP can still be called for. Managing unfunded commitments is a core liquidity-planning task for LP programs.

---

## Capital Calls

When the GP needs cash for an investment, fees, or expenses, it issues a **capital call notice** (also called a drawdown or takedown). LPs must wire their **pro-rata share** of the call within a short window — commonly **10 business days**.

**Failure to fund a call is a serious default** with steep penalties:
- Forfeiture of fund interest
- Forced sale of LP's interest at a significant discount
- Loss of distributions on forfeited interest

ILPA publishes a standardized capital-call-and-distribution template that GPs increasingly use to ensure consistent, transparent notices.

---

## Distributions

Cash (or occasionally securities, "in-kind") returned to LPs as the fund realizes investments. Distribution notices specify:
- The source (return of capital, gain, or income)
- The waterfall treatment

Under a **European (whole-of-fund) waterfall**, the distribution sequence is:
1. Return of LP contributed capital (all of it, across the whole fund)
2. Payment of the preferred return (hurdle rate, commonly 8% compounded)
3. GP catch-up
4. Remaining profit split at the carry ratio (e.g., 80% LP / 20% GP)

---

## Dry Powder

**Dry powder** = committed-but-uncalled capital available to invest, measured per fund or industry-wide.

As of Bain's 2026 report, global **buyout** dry powder stood at roughly **$1.3 trillion**, much of it "aging" (held four years or more). This aging overhang pressures GPs to deploy capital and is a key market dynamic.

*Note: "Dry powder" sometimes refers to total industry uncalled capital and sometimes just buyout; always check the scope when citing a figure.*

---

## Recycling (Reinvestment)

**Recycling** is a provision letting the GP reinvest early realization proceeds (or recall distributed capital) rather than permanently distributing them, so the fund can put more than its headline commitment to work.

**Key terms:**
- Usually **capped** at ~100% of committed capital
- Typically **time-limited** to the investment period or first few years
- Per ILPA practice, the management fee is charged only **once** on recycled amounts
- Reinvestment after the window generally needs LP consent

**Effect:** Recycling can lift invested capital above committed capital — boosting potential multiples but also increasing LP exposure beyond the headline commitment, which matters for pacing and liquidity planning.

**Example (Fund with $100m committed):**
- Year 2: an investment costing $10m exits for $14m
- GP distributes the $4m gain but retains and reinvests the $10m cost
- Total capital deployed into assets becomes $110m (even though LPs only committed $100m)
- If that extra $10m also returns 2.0×, it generates an additional $20m of gross realizations

---

## The Vintage Year

**Vintage year** = the year a fund first invests or first draws capital for investment. This is the **single most important comparability axis** in PE benchmarking.

Why vintage dominates: macro conditions, entry multiples, and exit windows are all vintage-specific and dominate fund returns. A great manager in a bad vintage can trail a mediocre manager in a great vintage. Funds are always benchmarked **only against same-vintage peers**.

---

## The J-Curve

The **J-curve** is the characteristic shape of a PE fund's **cumulative net cash flow** (or interim net return / interim IRR) plotted over time: it **dips negative** in the early years, bottoms out, then **climbs back through zero** and into positive territory — tracing the letter J.

### Why Early Returns Are Negative

Three forces, in order of importance:

1. **Cash timing:** In the early years, the LP is funding capital calls (cash out) while almost nothing is coming back, because investments take years to mature and exit. Cumulative net cash flow is deeply negative before any distributions arrive.

2. **Fee and expense drag:** Management fees are charged from day one on committed capital, and organizational/setup expenses hit early. NAV starts below paid-in capital. An LP that has paid in $10m but whose holdings are marked at cost still shows a "loss" once $0.2m of fees are accounted for.

3. **Conservative early marks:** Investments are typically held at or near cost initially, while write-downs of losers can come quickly. Reported NAV understates eventual value in the early years.

### How the J-Curve Reverses

Three things flip the curve upward:
1. Investments are **written up** toward fair value as performance becomes visible
2. The GP begins **exiting assets**, producing distributions (cash in)
3. The **fee base shrinks** after the investment period (step-down to invested cost or NAV)

Distributions in the harvesting years drive cumulative net cash flow back above zero and then to the final positive gain.

### The Honest Framing

A meaningful chunk of the early "loss" is a **fee and accounting artifact**, not destroyed value. The cash-flow component — the opportunity cost of capital being committed and deployed — is genuinely real. This distinction explains why secondaries, which buy seasoned assets, can skip or shorten the J-curve.

---

## Worked J-Curve: Fund Alpha

**Inputs:**
- Committed capital: $100m
- Investment period: years 1–5
- Management fee: $2m/year (2% of committed), years 1–10; total fees = $20m
- Investment deployment: $80m total drawn years 1–4 ($25m, $25m, $20m, $10m)
- Gross result: 2.0× on investments = $160m realizations, received years 5–10
- Waterfall: European, 8% preferred, 100% catch-up, 20% carry; preferred accrued = $22m

### Capital Calls by Year

| Year | Investment | Fee | Total Call |
|---|---|---|---|
| 1 | $25m | $2m | $27m |
| 2 | $25m | $2m | $27m |
| 3 | $20m | $2m | $22m |
| 4 | $10m | $2m | $12m |
| 5–10 | $0m | $2m | $2m each |
| **Total** | **$80m** | **$20m** | **$100m** |

Total called equals committed. The entire $100m commitment is drawn over the fund's life.

### Distributions Under the European Waterfall

LP receives all distributions until return of capital ($100m) + preferred ($22m) = $122m:
- Years 5–8: realizations of $20m + $30m + $30m + $30m = $110m all go to LP
- Year 9 realization $30m: first $12m gets LP to $122m; then catch-up ($5.5m to GP), then 80/20 split of remaining $12.5m ($10m LP, $2.5m GP)
- Year 10 realization $20m: split 80/20 → $16m LP, $4m GP

| Year | Realization | To LP | To GP |
|---|---|---|---|
| 5 | $20m | $20m | $0 |
| 6 | $30m | $30m | $0 |
| 7 | $30m | $30m | $0 |
| 8 | $30m | $30m | $0 |
| 9 | $30m | $22m | $8m |
| 10 | $20m | $16m | $4m |
| **Total** | **$160m** | **$148m** | **$12m** |

GP carry $12m = 20% of total profit ($160m − $100m = $80m). ✓

### LP Net Cash Flow and the J-Curve

| Year | Call (−) | Distribution (+) | Net CF | Cumulative Net CF |
|---|---|---|---|---|
| 1 | −$27m | $0 | −$27m | −$27m |
| 2 | −$27m | $0 | −$27m | −$54m |
| 3 | −$22m | $0 | −$22m | −$76m |
| 4 | −$12m | $0 | −$12m | **−$88m (trough)** |
| 5 | −$2m | $20m | +$18m | −$70m |
| 6 | −$2m | $30m | +$28m | −$42m |
| 7 | −$2m | $30m | +$28m | −$14m |
| 8 | −$2m | $30m | +$28m | **+$14m (crosses zero)** |
| 9 | −$2m | $22m | +$20m | +$34m |
| 10 | −$2m | $16m | +$14m | **+$48m (final)** |

- **Trough:** −$88m at year 4 (maximum J-curve dip)
- **Zero-crossing:** between years 7 and 8
- **Final gain:** +$48m

### Fund Alpha — Headline Metrics

$$\text{Net TVPI} = \frac{\$148m}{\$100m} = 1.48\times$$

$$\text{Net IRR} \approx 9\%$$

$$\text{Gross MOIC on investments} = \frac{\$160m}{\$80m} = 2.0\times$$

**The key lesson:** the fund earned 2.0× gross on its deals but only **1.48× net** for the LP, at a net IRR barely above the 8% hurdle. The $80m of gross profit was reduced by $20m of fees and $12m of carry. That fee-and-carry drag — turning 2.0× into 1.48× — is the most important number for an LP to internalize.

---

## Commitment Pacing

Because committed capital is called slowly and unpredictably, an LP targeting a specific **invested** exposure in PE cannot simply commit that amount once. It must build a **pacing model** committing across multiple vintages so that, as old funds distribute and new ones call, the net invested exposure trends toward its target allocation.

**Over-commitment:** Because not all committed capital is called at once and distributions recycle back, LPs deliberately **commit more than their target allocation**, relying on the timing gap. This works until distributions slow — at which point over-commitment becomes a liquidity problem (the squeeze of 2022–2024).

**The denominator effect:** When public markets fall sharply, PE's *percentage* of an LP's total portfolio mechanically rises above target (the liquid portion shrinks quickly; PE NAVs are marked down slowly). This can force LPs to pause new commitments or sell in the secondary market to rebalance — a major driver of record secondary volumes from 2022 onward.
