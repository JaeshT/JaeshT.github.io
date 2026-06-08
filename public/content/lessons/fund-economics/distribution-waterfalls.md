---
title: Distribution Waterfalls
domain: fund-economics
---

# Distribution Waterfalls

## 6. The distribution waterfall: European vs American

The **distribution waterfall** is the ordered set of rules for splitting every dollar of distribution between LPs and the GP. Two archetypes:

### 6.1 European waterfall (whole-fund / fund-as-a-whole)

Carry is computed across the **entire fund**. The GP earns **no carry until LPs have received back all contributed capital for the whole fund, plus the whole-fund preferred return**. Standard tiers:

1. **Return of capital** to LPs: 100% to LPs until they recover all capital contributed (commonly including fees and expenses called).
2. **Preferred return** to LPs: 100% to LPs until they earn the hurdle (for example 8% compounded) on contributed capital.
3. **GP catch-up:** typically 100% to the GP until the GP holds its carry percentage of profit distributed so far.
4. **Carried-interest split** on the remainder: 80% LP / 20% GP (for a 20% carry).

**Properties:** LP-protective, because winners cannot pay the GP carry while losers are still unrealized; the GP can never earn carry while the fund as a whole is underwater. The trade-off is **slower GP liquidity** (carry arrives late). Now standard for large buyout, infrastructure, secondaries, and **all** funds-of-funds. Common outside the US and increasingly inside it.

### 6.2 American waterfall (deal-by-deal)

Carry is computed **per realized deal**. Once a single investment is exited and clears its own return of capital and hurdle, the GP takes carry on **that deal**, even if other deals are still held or will lose money. Tiers mirror the European ones but apply to a single deal's capital and profit.

**Properties:** GP-favorable on timing (carry arrives early, deal by deal). The danger: the GP can be **overpaid** on early winners before later losers are realized. This is why deal-by-deal waterfalls *require* a robust **clawback** (and usually escrow). More common in US venture and some buyout; rare-to-absent in funds-of-funds.

### 6.3 LP-protective variants of the American waterfall

Pure deal-by-deal returns only the *realized* deal's capital before carry. LP-friendlier American structures add protections before any carry on a deal:

- return **all invested capital to date** (across realized deals), and/or
- return capital tied to **written-down or written-off** deals, and/or
- hold a **reserve / escrow** and apply an **interim clawback / NAV test** at each distribution.

These variants narrow the gap to the European outcome. The worked example in §8 uses the **pure** version to show the maximum divergence and the resulting clawback.

### 6.4 Prevalence (Cambridge Associates 2024)

- Waterfall type correlates with asset class: deal-by-deal was most prevalent in certain strategies, while **all funds-of-funds used whole-fund** waterfalls.
- **8% preferred is most common**; private credit tends to **7%**.
- **Carry ~20%; most funds have a clawback provision.**
- ILPA publishes **two** Model LPA versions, one built around a **whole-fund (European)** waterfall and one around a **deal-by-deal (American)** structure.

---

## 7. Worked Waterfall #1 — European (whole-fund)

**Common inputs (used in both worked examples):** 8% preferred return, compounded annually; 100% GP catch-up; 20% carried interest.

### 7.1 Scenario inputs

- LP contributed capital: **$100,000,000**, drawn at $t = 0$ (single drawdown, to isolate the waterfall math from drawdown timing).
- Holding period: **5 years**.
- Total distributions at exit ($t = 5$): **$200,000,000** (a 2.0x gross-of-carry multiple).
- Management fees and expenses are excluded here so the waterfall mechanics are clean.

### 7.2 Step-by-step

**Preferred return amount.** 8% compounded for 5 years:

$$\text{Pref factor} = (1.08)^5 - 1 = 1.4693280768 - 1 = 0.4693280768$$

$$\text{Pref} = \$100{,}000{,}000 \times 0.4693280768 = \$46{,}932{,}807.68$$

**Catch-up amount (100% catch-up, 20% carry).** $C = 0.25 \times \text{Pref}$:

$$C = 0.25 \times \$46{,}932{,}807.68 = \$11{,}733{,}201.92$$

Check: total profit at end of catch-up = Pref + C = $58,666,009.60; GP share = $11,733,201.92 / $58,666,009.60 = 20.00%.

**Remaining for the 80/20 split:**

```
Remaining = $200,000,000 − $100,000,000 (capital) − $46,932,807.68 (pref) − $11,733,201.92 (catch-up)
          = $41,333,990.40
LP 80% = $33,067,192.32 ; GP 20% = $8,266,798.08
```

### 7.3 Tier-by-tier table (this is the calculator)

| Tier | Description | Distributed this tier | To LP | To GP | Cumulative LP | Cumulative GP |
|---|---|---:|---:|---:|---:|---:|
| 1 | Return of capital | $100,000,000.00 | $100,000,000.00 | $0.00 | $100,000,000.00 | $0.00 |
| 2 | 8% preferred (5 yr, compounded) | $46,932,807.68 | $46,932,807.68 | $0.00 | $146,932,807.68 | $0.00 |
| 3 | GP catch-up (100%) | $11,733,201.92 | $0.00 | $11,733,201.92 | $146,932,807.68 | $11,733,201.92 |
| 4 | 80 / 20 split | $41,333,990.40 | $33,067,192.32 | $8,266,798.08 | $180,000,000.00 | $20,000,000.00 |
| | **Total** | **$200,000,000.00** | **$180,000,000.00** | **$20,000,000.00** | | |

**Final split: LP = $180,000,000 (90.0%), GP = $20,000,000 (10.0% of total proceeds, but exactly 20.0% of the $100,000,000 profit).**

### 7.4 The punchline of the catch-up

With a **full 100% catch-up**, once profits comfortably exceed the catch-up completion point, the GP earns **exactly 20% of total profit**, as if the hurdle did not exist. The hurdle only bites when profit is small. Contrast the **hard hurdle (no catch-up)** on identical inputs:

```
Hard hurdle, no catch-up:
LP gets capital ($100M) + pref ($46,932,807.68); remaining $53,067,192.32 splits 80/20
GP = 0.20 × $53,067,192.32 = $10,613,438.46
LP = $189,386,561.54
GP effective take = 10.6% of profit, not 20%.
```

The catch-up nearly **doubles** the GP's carry here ($20.0M vs $10.6M). This is the concrete reason GPs fight for a catch-up and ILPA fights against it.

---

## 8. Worked Waterfall #2 — American (deal-by-deal) + clawback

**Same common inputs:** 8% pref compounded, 100% catch-up, 20% carry. Now the fund makes **two** deals.

### 8.1 Scenario inputs

- Total committed: **$100,000,000**, split $50M to Deal A and $50M to Deal B, both funded at $t = 0$ (simplifying assumption so the European comparison is clean).
- **Deal A:** exits at $t = 3$ for **$150,000,000** (a 3.0x winner).
- **Deal B:** exits at $t = 5$ for **$20,000,000** (a loss; 0.4x).
- Total distributions = $170,000,000. Total profit = **$70,000,000**.

### 8.2 American (pure deal-by-deal): carry on each deal as it exits

**Deal A (3-year hold, $50M cost, $150M proceeds):**

```
Pref = $50,000,000 × ((1.08)^3 − 1) = $50,000,000 × 0.259712 = $12,985,600.00
Catch-up C = 0.25 × $12,985,600.00 = $3,246,400.00
Remaining = $150,000,000 − $50,000,000 − $12,985,600 − $3,246,400 = $83,768,000.00
LP 80% = $67,014,400.00 ; GP 20% = $16,753,600.00
```

| Tier (Deal A) | Distributed | To LP | To GP |
|---|---:|---:|---:|
| 1 Return of Deal A capital | $50,000,000.00 | $50,000,000.00 | $0.00 |
| 2 8% pref (3 yr) on $50M | $12,985,600.00 | $12,985,600.00 | $0.00 |
| 3 GP catch-up (100%) | $3,246,400.00 | $0.00 | $3,246,400.00 |
| 4 80 / 20 split | $83,768,000.00 | $67,014,400.00 | $16,753,600.00 |
| **Deal A total** | **$150,000,000.00** | **$130,000,000.00** | **$20,000,000.00** |

GP carry banked from Deal A alone: **$20,000,000.00**.

**Deal B (5-year hold, $50M cost, $20M proceeds):** a loss. All $20M is return of capital; there is no profit, so **no carry**. LP = $20,000,000; GP = $0.

**Fund totals before clawback:** LP = $130M + $20M = **$150,000,000**; GP = **$20,000,000**.

### 8.3 The clawback

The GP collected **$20M** of carry. But the fund's *true* total profit is only **$70M**, so the GP's correct entitlement is:

```
True carry = 20% × $70,000,000 = $14,000,000.00
Clawback owed by GP = $20,000,000 − $14,000,000 = $6,000,000.00
```

**Post-clawback:** GP returns $6M to LPs.

- GP = **$14,000,000** ; LP = **$156,000,000**. Total still $170,000,000.

### 8.4 The same cash flows under a European waterfall

Under whole-fund rules, the entire $100M of capital must be returned before any carry, and carry is always 20% of *cumulative whole-fund profit*.

**At $t = 3$, the fund distributes $150M (whole-fund waterfall):**

```
Return ALL fund capital: $100,000,000 to LP
Pref on $100M for 3 yr = $100,000,000 × 0.259712 = $25,971,200.00 to LP
Remaining = $150,000,000 − $100,000,000 − $25,971,200 = $24,028,800.00
Catch-up C = 0.25 × $25,971,200 = $6,492,800.00 to GP
Remaining after catch-up = $17,536,000.00 → 80/20 → LP $14,028,800 ; GP $3,507,200
GP @ t=3 = $6,492,800 + $3,507,200 = $10,000,000.00   (= 20% of the $50M profit so far)
LP @ t=3 = $140,000,000.00
```

**At $t = 5$, the fund distributes $20M:** all capital is already returned, so no more pref accrues; the $20M is pure profit and splits 80/20.

```
GP @ t=5 = $4,000,000.00 ; LP @ t=5 = $16,000,000.00
```

**European fund totals:** GP = $10M + $4M = **$14,000,000** ; LP = $140M + $16M = **$156,000,000**.

### 8.5 The comparison (memorize this)

| | American (deal-by-deal), pre-clawback | American, post-clawback | European (whole-fund) |
|---|---:|---:|---:|
| GP carry | $20,000,000 | $14,000,000 | $14,000,000 |
| LP proceeds | $150,000,000 | $156,000,000 | $156,000,000 |
| Carry timing | $20M at t = 3 | $20M at t=3, give back $6M after t=5 | $10M at t=3, $4M at t=5 |
| Clawback needed? | — | **Yes, $6M** | **No** |

**Key insight:** with a perfectly functioning clawback, the American GP ends up at the **same** economics as the European GP (20% of true net profit). The differences are **timing** (American front-loads carry) and **risk** (the clawback may be uncollectable if the GP has already distributed and spent the money, or if carry recipients have left). That counterparty risk is exactly why LPs demand escrow, joint-and-several GP guarantees, and interim NAV tests on deal-by-deal funds. The European waterfall avoids the problem structurally by netting across the whole fund.

**Flagged simplification:** the clean European reconciliation above assumes all $100M was drawn at $t = 0$. If Deal B's $50M were called *after* Deal A's $t = 3$ exit, the whole-fund return-of-capital test at $t = 3$ would only require $50M back, and the European GP could also receive early carry, narrowing (though not eliminating) the structural protection. Real funds draw capital deal by deal; the LPA specifies whether the return-of-capital tier covers only-drawn or total-committed capital.

---

## 9. Sensitivity: how GP carry behaves as profit rises

Using Worked Example #1 inputs ($100M, 5-year hold, 8% pref, 100% catch-up, 20% carry), the GP's carry as a function of **total profit** (= total distributions − $100M capital) has three regimes with two kink points:

| Total profit | Regime | GP carry |
|---|---|---|
| $0 to $46,932,807.68 | Below/at pref: GP earns nothing | $0 |
| $46,932,807.68 to $58,666,009.60 | Catch-up: GP takes 100% of marginal dollar | rises from $0 to $11,733,201.92 |
| above $58,666,009.60 | Full 80/20 split | $11,733,201.92 + 20% of (profit − $58,666,009.60), which equals exactly **20% of total profit** |

**Kink 1 = $46,932,807.68** (pref fully paid; GP carry begins).
**Kink 2 = $58,666,009.60** (catch-up complete; GP at 20% of all profit).

Above Kink 2, $\text{GP carry} = 0.20 \times \text{total profit}$ exactly. Below Kink 1, GP carry = 0. Between them, the GP earns the marginal dollar at 100%.

This three-regime piecewise function is the core engine of any waterfall calculator. For a **hard hurdle**, delete the catch-up regime: GP carry = 0 up to profit of $46,932,807.68, then 20% of every dollar *above* that, forever, so $\text{GP carry} = 0.20 \times (\text{profit} - \$46{,}932{,}807.68)$ once positive.

---

## 10. Clawback, escrow, and the GP commitment

### 10.1 Clawback (GP giveback)

A **clawback** obligates the GP to **return** carry it was paid if, at the end of the fund, it received **more than its contractual share** of total net profit. It exists primarily to fix the over-distribution problem of deal-by-deal waterfalls. It is computed at fund wind-up (a **final** clawback), and sometimes at interim checkpoints (an **interim** clawback or true-up):

$$\text{Clawback} = \max\!\left(0,\; \text{carry paid} - c\times\text{total net fund profit}\right)$$

**ILPA Principles 3.0 position on clawback:**

- Clawback should be calculated **gross of taxes** the GP's carry recipients paid (a reversion to ILPA's 2009 stance, reversing 2.0). This means individual carry recipients can be out of pocket for taxes already paid that are not recoverable after they return the carry, which is why GPs push back hard on it.
- ILPA's logic: the prior net-of-tax formulation let GPs assume artificially high tax rates, shrinking the clawback they owed.

### 10.2 Mechanisms that make clawback enforceable

- **Escrow / holdback:** a portion of each carry distribution (for example, 20% to 30%) is held in escrow until the fund is wound up, available to satisfy a clawback.
- **Joint-and-several guarantees** by the individual carry recipients, so LPs can recover even if one professional has left or is insolvent.
- **Interim clawback / NAV tests:** periodic recomputation of whether the GP is ahead of schedule.
- **LP giveback:** in some structures LPs may have to return prior distributions to satisfy fund obligations (for example, indemnities); distinct from GP clawback.

### 10.3 The GP commitment (skin in the game)

The GP invests its own capital in the fund alongside LPs. Historically a rule-of-thumb **~1% of fund size**, commonly cited today as **1% to 2%**, and rising for marquee LPs and large funds. ILPA Principles also state that fee and carry economics should be directed predominantly to the professionals and expenses tied to the fund's success, and discourage management-fee waivers being used as a substitute for a genuine cash GP commitment. (Note: 1% to 2% is a rule of thumb, not a measured statistic.)
