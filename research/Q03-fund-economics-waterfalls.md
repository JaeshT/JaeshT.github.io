# Private Equity Fund Economics: Fees, Carry, and Distribution Waterfalls

**A study guide for a Primaries & Co-investments (LP / fund-investing) internship.**

All numbers below are worked to the cent and have been independently recomputed. Every waterfall is built so it can be rebuilt as an interactive calculator: the tier logic, the inputs, and the per-dollar splits are all explicit. Citations use short tags that map to the **Sources** section at the end. Where authoritative sources disagree, this is flagged with **[CONFLICT]**.

A note on what this guide is *not*: it does not give you a single "right" set of fund terms, because terms are negotiated and vary by strategy, manager leverage, and vintage. It gives you the standard architecture, the math, the levers, and the ranges, so you can read any LPA and reverse-engineer the economics.

---

## Contents

1. The big picture: LPs, GPs, and the fund lifecycle
2. Management fees
3. Carried interest
4. Preferred return / hurdle rate
5. GP catch-up
6. The distribution waterfall: European vs American
7. **Worked Waterfall #1 — European (whole-fund)**
8. **Worked Waterfall #2 — American (deal-by-deal) + clawback**, with European comparison
9. Sensitivity: how GP carry behaves as profit rises
10. Clawback, escrow, and the GP commitment
11. ILPA: Principles 3.0, the Model LPA, and the 2025 reporting standards
12. Performance metrics and PME (with academic lineage)
13. Key formulas (collected)
14. Glossary
15. Flashcards (34, tagged by sub-topic and difficulty)
16. Interview questions with model answers (14)
17. Calculator data model (to rebuild the worked examples)
18. Sources

---

## 1. The big picture: LPs, GPs, and the fund lifecycle

A private equity fund is a **limited partnership**. Two roles:

- **Limited Partners (LPs):** the investors (pensions, endowments, sovereign wealth funds, insurers, funds-of-funds, family offices). They supply almost all the capital. Liability is limited to their commitment. They are passive.
- **General Partner (GP):** the manager. The GP runs the fund, sources and manages deals, and earns fees plus a share of profits (carry). The GP also invests its own money alongside LPs (the **GP commitment**), historically around 1 to 2 percent of fund size, increasingly higher [rule of thumb; see §10].

LPs do not hand over cash on day one. They sign a **commitment** (for example, "$50M committed"). The GP then issues **capital calls** (drawdowns) over the **investment period** (commonly the first 5 years) as it finds deals. Money returned to LPs comes through **distributions** as portfolio companies are sold or recapitalized. The legal contract governing all of this is the **Limited Partnership Agreement (LPA)**.

**Fund lifecycle (typical 10-year fund, often with 1+1 or 2x1 extension options):**

```
Year:   0 ──── 1 ──── 2 ──── 3 ──── 4 ──── 5 ──── 6 ──── 7 ──── 8 ──── 9 ──── 10
        │  Investment period (deploy capital)  │   Harvest period (exit, distribute)
        │  fee on COMMITTED capital            │   fee STEPS DOWN, often on INVESTED cost
        Capital calls dominate                     Distributions dominate
```

**The J-curve.** Early in life, a fund's net-to-LP return is negative: fees and expenses are charged immediately, while value creation and exits take years. Net cash flow and reported value dip, then climb as winners are realized, tracing a "J." [Investopedia; Bain] This is why first-year IRRs are meaningless and why LPs judge funds against same-vintage peers.

**Gross vs net.** A *gross* return is measured at the deal or portfolio level before fund-level fees, expenses, and carry. A *net* return is what the LP actually keeps after all of those. LPs care about **net**. The gap between gross and net is precisely the subject of this guide. ILPA Principles 3.0 explicitly require carried interest to be calculated on **net** profits, factoring in fund-level expenses, not gross [ILPA 3.0; Real Deal].

---

## 2. Management fees

The management fee funds the GP's operations: salaries, rent, travel, legal, compliance, fund administration, and overhead [PipelineRoad; NVPE]. It is **not** a profit share; it is paid regardless of performance. The headline shorthand is "**2 and 20**" (2% fee, 20% carry), but every element behind it is negotiable [PE Bro].

### 2.1 The fee base: committed vs invested capital

This is the single most important fee mechanic.

- **On committed capital:** the fee is a percentage of total commitments, charged whether or not the money has been deployed. More GP-favorable, because the GP earns on undrawn capital. Historically the most common method [M&Y 2010].
- **On invested capital (or net invested cost):** the fee is a percentage of capital actually put to work (cost basis of holdings, net of realizations and write-offs). More LP-favorable, because LPs do not pay on idle commitments.

**Typical real structure:** fee on **committed** capital during the investment period, then a **step-down** to a lower rate and/or a shift to **invested cost** after the investment period ends [PE Bro; Family Capital; Alter Domus].

### 2.2 Step-downs

After the investment period, the fee almost always declines. Common forms:

1. **Rate step-down:** the percentage falls (for example, 2.0% drops by 25 bps per year, or to 1.5%). Metrick & Yasuda describe exactly this "decreasing fee schedule" pattern [M&Y 2010].
2. **Base step-down:** the base switches from committed capital to invested cost, which then shrinks as the portfolio is realized.

Either way, the dollar fee declines through the harvest years.

### 2.3 Lifetime fee drag (the math that surprises beginners)

A flat 2% on committed capital for 10 years equals **20% of commitments** consumed by fees, leaving only ~80% as investable capital, before any carry [M&Y 2010]. Because most funds step down, actual lifetime fees are lower. Metrick & Yasuda's empirical finding (238 funds, 1993 to 2006): **median lifetime management fees were ~12% of committed capital for buyout funds and ~17.75% for VC funds** [M&Y 2010]. Critically, they also found that **about two-thirds of a GP's expected total revenue comes from fixed (non-performance) components**, that is, fees rather than carry, which means the popular story that GPs "only get paid if they perform" is false for the median fund [M&Y 2010; ResearchGate summary].

### 2.4 The investable-capital problem and fee recycling

Fees reduce the cash available to invest. If $100M is committed and ~$15M is consumed by fees over the fund's life, only ~$85M can be invested unless the LPA allows **recycling** (reinvesting early proceeds or using realized capital to restore commitments). ILPA Principles 3.0 say recycling should be **capped or monitored** and should apply **only during the investment period** [ILPA 3.0; Real Deal].

### 2.5 Fee income beyond the management fee, and the management-fee offset

GPs (especially buyout GPs) can charge portfolio companies directly:

- **Transaction / deal fees:** charged on acquisitions or exits, often **1% to 2% of enterprise value** [Qapita; NVPE].
- **Monitoring fees:** ongoing "advisory" fees, often a small percentage of EBITDA or a fixed annual amount [Family Capital; Qapita].
- **Director / board fees, consulting, broken-deal cost recovery.**

Historically GPs **kept** these, effectively getting paid twice [NVPE; Qapita]. Metrick & Yasuda found these "transaction and monitoring fees" were a material, separately modeled revenue stream for buyout funds, and that about 85% of buyout agreements required GPs to share *at least some* portion with LPs, with one-third returning **all** transaction fees and ~41% using a 50/50 split [M&Y 2010].

The LP fix is the **management-fee offset**: portfolio-company fees the GP collects **reduce** the management fee LPs owe. The **offset percentage** ranges, historically 50% to 100%; an 80% offset means the GP keeps 20% of the extra income [Umbrex; PipelineRoad].

**The trend is unambiguous: 100% offset (dollar-for-dollar) is now standard in developed markets, and ILPA Principles 3.0 recommend that any portfolio-company fees charged be 100% offset against the management fee** [ILPA 3.0; CLFI; NVPE].

### 2.6 Worked management-fee example (rebuildable)

**Inputs:** $100M committed; 10-year life; 5-year investment period; 2.0% on committed during the investment period; after that, 2.0% on **net invested cost**, which winds down linearly as the portfolio is realized.

| Year | Basis | Rate | Fee |
|---|---|---|---|
| 1 | $100M committed | 2.0% | $2,000,000 |
| 2 | $100M committed | 2.0% | $2,000,000 |
| 3 | $100M committed | 2.0% | $2,000,000 |
| 4 | $100M committed | 2.0% | $2,000,000 |
| 5 | $100M committed | 2.0% | $2,000,000 |
| 6 | $85M net invested | 2.0% | $1,700,000 |
| 7 | $68M net invested | 2.0% | $1,360,000 |
| 8 | $51M net invested | 2.0% | $1,020,000 |
| 9 | $34M net invested | 2.0% | $680,000 |
| 10 | $17M net invested | 2.0% | $340,000 |
| **Total** | | | **$15,100,000** |

**Result:** lifetime fees = **$15.10M = 15.1% of committed capital**. Investable capital, absent recycling, falls to about **$84.9M**. This sits squarely in the empirical range and above Metrick & Yasuda's 12% buyout median (because this example holds the rate flat at 2.0% rather than ratcheting it down) [M&Y 2010].

**Fee-offset overlay:** suppose in Year 6 the GP collects $3M of monitoring and transaction fees from portfolio companies.
- 100% offset: Year 6 management fee is reduced from $1.70M to **$0** (offset capped at the fee; the $1.30M excess may carry forward, depending on the LPA), GP keeps $0 of the $3M as extra.
- 80% offset: fee reduced by $2.40M (floored at $0 here), GP keeps $0.60M of the $3M as extra income on top.

### 2.7 What the data say about fee levels today

- **2% is the modal/predominant management fee for buyout and growth equity; 2.5% is most common for VC** [Cambridge Associates 2024].
- **[CONFLICT / nuance]** Carta reports **mean** management fees for **2024-vintage** funds of **1.74% (buyout) and 1.93% (growth equity)**, below the 2% mode [Carta]. These reconcile: 2% remains the most common single value, but fee **compression** on large funds is pulling the *average* down. When you read "the fee is 2%," check whether that is the mode, the mean, the rate before or after step-down, and the base.

---

## 3. Carried interest

**Carried interest ("carry") is the GP's share of fund profits**, the performance fee. The market standard is **20%** of profits [Cambridge Associates 2024; Alter Domus]. It is the GP's incentive to generate returns and, for many GPs, the path to real wealth, even though it is the *minority* of expected revenue for the median fund [M&Y 2010].

### 3.1 Carry basis: committed vs invested capital

Carry is computed on profit, but the *definition* of the capital that must be returned first matters:

- **Carry basis = committed capital:** LPs must get back all committed (or contributed) capital plus pref before carry. Used by the large majority of funds: **83.2% of buyout funds and 92.1% of VC funds** in the Metrick & Yasuda sample [M&Y 2010].
- **Carry basis = investment capital:** a narrower base. Metrick & Yasuda note that, for a profitable fund and ignoring discounting, switching from a committed-capital basis to an investment-capital basis is worth roughly *the carry rate times lifetime fees* in extra carry to the GP [M&Y 2010]. This is a subtle but real GP-favorable lever.

### 3.2 Gross vs net carry

- **Net carry (LP-friendly, ILPA-preferred):** the 20% applies to profit **after** deducting management fees and fund expenses. The GP's slice is taken on LP-net returns [ILPA 3.0; V7 Labs].
- **Gross carry (GP-friendly):** the 20% applies to total profit **before** fees and expenses [V7 Labs].

ILPA 3.0 requires carry on **net** profit, with fund-level expenses factored in [ILPA 3.0; Real Deal].

### 3.3 Vesting, allocation, and tiered carry

- Carry is usually allocated among the GP's investment professionals and **vests** over time (to retain staff). ILPA holds that fee and carry economics should flow predominantly to the professionals and expenses tied to *that* fund's success [ILPA Principles].
- **Tiered / ratcheting carry:** some LPAs raise carry (for example, 20% rising to 25%) once the fund clears a higher multiple such as 3.0x, or add a second, higher hurdle with a higher carry above it [Alter Domus; CA 2024 on multiple hurdles in VC/growth].

---

## 4. Preferred return / hurdle rate

The **preferred return** (or **hurdle rate**) is the minimum annual return LPs must receive **before** the GP earns any carry [Carta; iCapital]. It is a gate.

- **Standard level: 8% per annum, usually compounded**, in buyout and most PE [Cambridge Associates 2024; iCapital; CLFI; KL Gates].
- **Private credit: typically 6% to 7%** (lower target returns) [iCapital; CA 2024].
- **VC: often no preferred return at all** [iCapital; CA 2024].

The pref is calculated on LP contributed capital and **compounds**, so it grows with the holding period. Annual compounding is the common convention; "simple" (non-compounding) pref is more GP-favorable and is one of the quiet levers GPs use to soften a headline-high hurdle [KL Gates; Crystal Funds].

### 4.1 Hard hurdle vs soft hurdle (this is where catch-up lives)

- **Soft hurdle (with catch-up):** once LPs clear the pref, a **catch-up** lets the GP collect carry on the **entire** profit including the part that funded the pref. Net effect at high returns: the GP earns its full 20% of *all* profit. The hurdle is just a *timing* gate, not a permanent giveaway. This is the **standard** structure [Lexology; Rundit].
- **Hard hurdle (no catch-up):** the GP earns carry **only on profits above the hurdle**. The pref portion is never shared. The GP's effective take is permanently below 20% of total profit. ILPA Principles 3.0 explicitly **prefer** the hard hurdle, and openly acknowledge that it means "the GP will, in fact, not receive the stated carried interest percentage" [ILPA 3.0; Lexology; Davies].

The numerical difference between these two is large and is shown in §7.4 and §9.

### 4.2 The 2025 hurdle debate **[CONFLICT / market color]**

In a weak 2025 fundraising market, some GPs advertised LP-friendly **9% to 10% hurdles** (common in infrastructure and secondaries), but advisors found the optics can reverse: pairing a high hurdle with a **gross** IRR calculation, a **full catch-up**, **simple** (not compounded) accrual, or a **delayed start date** (pref begins only after the investment period) can make the economics *more* GP-skewed than an old 8% term [Crystal Funds]. The lesson: never read the hurdle number in isolation. Read it together with the catch-up, the compounding convention, the base, and the start date.

---

## 5. GP catch-up

The **catch-up** is the tier that sits between the preferred return and the final split. After LPs get their pref, the GP receives an outsized share (often **100%**) of the next distributions until the agreed profit split (for example, 80/20) is **restored across all profit distributed so far**, including the pref [Rundit; Alter Domus].

### 5.1 Catch-up percentages

- **100% catch-up (GP-favorable, common):** the GP takes 100% of distributions in this tier until caught up. Fastest catch-up.
- **Partial catch-up (for example, 80/20 or 50/50):** the GP takes only 80% (or 50%) of the catch-up tier, LP takes the rest. Slower; LP-friendlier. ILPA's hard-hurdle preference effectively pushes toward **no** catch-up [Lexology; KL Gates uses a 60% catch-up in one illustration].

### 5.2 The catch-up formula (full 100% catch-up)

The GP catches up until its cumulative carry equals the carry rate `c` times the total profit distributed (pref + catch-up). Let `P` = preferred return already paid to LPs, and let `C` = catch-up dollars to the GP. With a 100% catch-up:

```
C = c × (P + C)
C × (1 − c) = c × P
C = c / (1 − c) × P
```

For `c = 20%`: **C = 0.25 × P.** That is, the GP catch-up equals 25% of the preferred return paid. After this tier, the GP holds exactly 20% of (pref + catch-up), and everything above splits 80/20.

If the catch-up is **partial** at rate `g` (GP's share of the catch-up tier, for example `g = 0.80`):

```
C = (c / (g − c)) × P     [GP's catch-up dollars]
```
and the catch-up tier itself distributes `C / g` in total (GP gets `C`, LP gets the rest).

---

## 6. The distribution waterfall: European vs American

The **distribution waterfall** is the ordered set of rules for splitting every dollar of distribution between LPs and the GP. Two archetypes:

### 6.1 European waterfall (whole-fund / fund-as-a-whole)

Carry is computed across the **entire fund**. The GP earns **no carry until LPs have received back all contributed capital for the whole fund, plus the whole-fund preferred return** [Mayer Brown on ILPA Model LPA; Alter Domus]. Standard tiers:

1. **Return of capital** to LPs: 100% to LPs until they recover all capital contributed (commonly including fees and expenses called).
2. **Preferred return** to LPs: 100% to LPs until they earn the hurdle (for example 8% compounded) on contributed capital.
3. **GP catch-up:** typically 100% to the GP until the GP holds its carry percentage of profit distributed so far.
4. **Carried-interest split** on the remainder: 80% LP / 20% GP (for a 20% carry).

**Properties:** LP-protective, because winners cannot pay the GP carry while losers are still unrealized; the GP can never earn carry while the fund as a whole is underwater [Alter Domus]. The trade-off is **slower GP liquidity** (carry arrives late). Now standard for large buyout, infrastructure, secondaries, and **all** funds-of-funds [Alter Domus; CA 2024]. Common outside the US and increasingly inside it.

### 6.2 American waterfall (deal-by-deal)

Carry is computed **per realized deal**. Once a single investment is exited and clears its own return of capital and hurdle, the GP takes carry on **that deal**, even if other deals are still held or will lose money [Alter Domus; AnalystPrep]. Tiers mirror the European ones but apply to a single deal's capital and profit.

**Properties:** GP-favorable on timing (carry arrives early, deal by deal). The danger: the GP can be **overpaid** on early winners before later losers are realized. This is why deal-by-deal waterfalls *require* a robust **clawback** (and usually escrow). More common in US venture and some buyout; rare-to-absent in funds-of-funds [CA 2024: "no funds-of-funds in 2022 used a deal-by-deal structure"; Alter Domus].

### 6.3 LP-protective variants of the American waterfall

Pure deal-by-deal returns only the *realized* deal's capital before carry. LP-friendlier American structures add protections before any carry on a deal:
- return **all invested capital to date** (across realized deals), and/or
- return capital tied to **written-down or written-off** deals, and/or
- hold a **reserve / escrow** and apply an **interim clawback / NAV test** at each distribution.

These variants narrow the gap to the European outcome. The worked example in §8 uses the **pure** version to show the maximum divergence and the resulting clawback.

### 6.4 Prevalence (Cambridge Associates 2024)

- Waterfall type correlates with asset class: deal-by-deal was most prevalent in certain strategies, while **all funds-of-funds used whole-fund** waterfalls [CA 2024].
- **8% preferred is most common**; private credit tends to **7%** [CA 2024].
- **Carry ~20%; most funds have a clawback provision** [CA 2024].
- ILPA publishes **two** Model LPA versions, one built around a **whole-fund (European)** waterfall and one around a **deal-by-deal (American)** structure, signaling both remain market practice [V7 Labs].

---

## 7. Worked Waterfall #1 — European (whole-fund)

**Common inputs (used in both worked examples):** 8% preferred return, compounded annually; 100% GP catch-up; 20% carried interest.

### 7.1 Scenario inputs

- LP contributed capital: **$100,000,000**, drawn at t = 0 (single drawdown, to isolate the waterfall math from drawdown timing).
- Holding period: **5 years**.
- Total distributions at exit (t = 5): **$200,000,000** (a 2.0x gross-of-carry multiple).
- Management fees and expenses are excluded here so the waterfall mechanics are clean. (In reality, fees are called as capital and either increase the capital that must be returned or are netted; see §2 and §17.)

### 7.2 Step-by-step

**Preferred return amount.** 8% compounded for 5 years:

```
Pref factor = (1.08)^5 − 1 = 1.4693280768 − 1 = 0.4693280768
Pref = $100,000,000 × 0.4693280768 = $46,932,807.68
```

**Catch-up amount (100% catch-up, 20% carry).** C = 0.25 × Pref:

```
C = 0.25 × $46,932,807.68 = $11,733,201.92
Check: total profit at end of catch-up = Pref + C = $58,666,009.60
       GP share = $11,733,201.92 / $58,666,009.60 = 20.00% ✓
```

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

The catch-up nearly **doubles** the GP's carry here ($20.0M vs $10.6M). This is the concrete reason GPs fight for a catch-up and ILPA fights against it [ILPA 3.0; Lexology].

---

## 8. Worked Waterfall #2 — American (deal-by-deal) + clawback

**Same common inputs:** 8% pref compounded, 100% catch-up, 20% carry. Now the fund makes **two** deals.

### 8.1 Scenario inputs

- Total committed: **$100,000,000**, split $50M to Deal A and $50M to Deal B, both funded at t = 0 (simplifying assumption so the European comparison is clean; flagged below).
- **Deal A:** exits at **t = 3** for **$150,000,000** (a 3.0x winner).
- **Deal B:** exits at **t = 5** for **$20,000,000** (a loss; 0.4x).
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
- GP = **$14,000,000** ; LP = **$156,000,000**. Total still $170,000,000. ✓

### 8.4 The same cash flows under a European waterfall

Under whole-fund rules, the entire $100M of capital must be returned before any carry, and carry is always 20% of *cumulative whole-fund profit*.

**At t = 3, the fund distributes $150M (whole-fund waterfall):**

```
Return ALL fund capital: $100,000,000 to LP
Pref on $100M for 3 yr = $100,000,000 × 0.259712 = $25,971,200.00 to LP
Remaining = $150,000,000 − $100,000,000 − $25,971,200 = $24,028,800.00
Catch-up C = 0.25 × $25,971,200 = $6,492,800.00 to GP
Remaining after catch-up = $17,536,000.00 → 80/20 → LP $14,028,800 ; GP $3,507,200
GP @ t=3 = $6,492,800 + $3,507,200 = $10,000,000.00   (= 20% of the $50M profit so far ✓)
LP @ t=3 = $140,000,000.00
```

**At t = 5, the fund distributes $20M:** all capital is already returned, so no more pref accrues; the $20M is pure profit and splits 80/20.

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

**Key insight:** with a perfectly functioning clawback, the American GP ends up at the **same** economics as the European GP (20% of true net profit). The differences are **timing** (American front-loads carry) and **risk** (the clawback may be uncollectable if the GP has already distributed and spent the money, or if carry recipients have left). That counterparty risk is exactly why LPs demand escrow, joint-and-several GP guarantees, and interim NAV tests on deal-by-deal funds (§10). The European waterfall avoids the problem structurally by netting across the whole fund.

**Flagged simplification:** the clean European reconciliation above assumes all $100M was drawn at t = 0. If Deal B's $50M were called *after* Deal A's t = 3 exit, the whole-fund return-of-capital test at t = 3 would only require $50M back, and the European GP could also receive early carry, narrowing (though not eliminating) the structural protection. Real funds draw capital deal by deal; the LPA specifies whether the return-of-capital tier covers only-drawn or total-committed capital. This is the kind of clause to read carefully.

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
Above Kink 2, **GP carry = 20% × total profit** exactly. Below Kink 1, GP carry = 0. Between them, the GP earns the marginal dollar at 100%.

This three-regime piecewise function is the core engine of any waterfall calculator. For a **hard hurdle**, delete the catch-up regime: GP carry = 0 up to profit of $46,932,807.68, then 20% of every dollar *above* that, forever (so GP carry = 0.20 × (profit − $46,932,807.68) once positive).

---

## 10. Clawback, escrow, and the GP commitment

### 10.1 Clawback (GP giveback)

A **clawback** obligates the GP to **return** carry it was paid if, at the end of the fund, it received **more than its contractual share** of total net profit [Scalex; CA 2024]. It exists primarily to fix the over-distribution problem of deal-by-deal waterfalls (§8). It is computed at fund wind-up (a **final** clawback), and sometimes at interim checkpoints (an **interim** clawback or true-up).

**ILPA Principles 3.0 position on clawback:**
- Clawback should be calculated **gross of taxes** the GP's carry recipients paid (a reversion to ILPA's 2009 stance, reversing 2.0). This means individual carry recipients can be out of pocket for taxes already paid that are not recoverable after they return the carry, which is why GPs push back hard on it [ILPA 3.0; Dechert; Lexology].
- ILPA's logic: the prior net-of-tax formulation let GPs assume artificially high tax rates, shrinking the clawback they owed [Dechert].

### 10.2 Mechanisms that make clawback enforceable

- **Escrow / holdback:** a portion of each carry distribution (for example, 20% to 30%) is held in escrow until the fund is wound up, available to satisfy a clawback [CA 2024 references escrows; Mayer Brown].
- **Joint-and-several guarantees** by the individual carry recipients, so LPs can recover even if one professional has left or is insolvent.
- **Interim clawback / NAV tests:** periodic recomputation of whether the GP is ahead of schedule.
- **LP giveback:** in some structures LPs may have to return prior distributions to satisfy fund obligations (for example, indemnities); distinct from GP clawback.

### 10.3 The GP commitment (skin in the game)

The GP invests its own capital in the fund alongside LPs. Historically a rule-of-thumb **~1% of fund size**, commonly cited today as **1% to 2%**, and rising for marquee LPs and large funds (sometimes well above) [rule of thumb; ILPA encourages a *substantial* GP commitment]. ILPA Principles also state that fee and carry economics should be directed predominantly to the professionals and expenses tied to the fund's success, and discourage management-fee waivers being used as a substitute for a genuine cash GP commitment [ILPA Principles]. **[Note: I did not locate a single authoritative current survey figure for the median GP commitment; treat 1% to 2% as a rule of thumb, not a measured statistic.]**

---

## 11. ILPA: Principles 3.0, the Model LPA, and the 2025 reporting standards

**ILPA (Institutional Limited Partners Association)** is the global body representing LPs; its membership represents over **$2 trillion** of PE AUM [ILPA 3.0]. It is **not a regulator**; its outputs are voluntary best-practice standards and negotiating reference points [V7 Labs].

### 11.1 ILPA Principles 3.0 (published June 2019)

Organized around three pillars: **transparency, governance, and alignment of interests** [ILPA 3.0]. Economically relevant recommendations:

- **Waterfall:** the model returns all LP capital plus the agreed preferred return before any carry [Mayer Brown].
- **Preferred return / carry:** prefers a **hard hurdle** (carry only on profits above the pref), which it acknowledges means the GP will not receive the full stated carry percentage [Lexology; Davies].
- **Carry on net profits**, factoring in fund-level expenses [Real Deal].
- **Fee offsets:** portfolio-company fees should be **100% offset** against the management fee [ILPA 3.0; Dechert].
- **Recycling:** capped or monitored, and only during the investment period [Real Deal].
- **Clawback:** computed **gross of tax** [Dechert].
- **Expenses:** "unforeseen" and ESG-related expenses should be covered by the management fee, not charged to the fund (debated as to reasonableness) [Dechert].
- **Subscription lines of credit:** should benefit the partnership, not be used mainly to inflate IRR or accelerate carry; the pref should accrue from when capital is **actually at risk** (when the line is drawn), not when LP capital would otherwise have been called [Real Deal].

### 11.2 The ILPA Model LPA (2019/2020)

A standardized template LPA, generally **more LP-favorable** than market, in **two versions**: a **whole-fund (European)** waterfall version and a **deal-by-deal (American)** version [V7 Labs; Mayer Brown]. Notable: under the Model LPA, **75% in interest of LPs can remove the GP** for any or no reason, with **immediate termination of the management fee** on a no-cause removal notice [Mayer Brown].

### 11.3 The 2025 reporting overhaul (Quarterly Reporting Standards Initiative, QRSI)

The 2016 ILPA **Reporting Template** standardized fee, expense, and carry disclosure. In **January 2025**, ILPA released a comprehensive overhaul of three interlocking templates [Juniper Square; Citco; ILPA]:

1. **Reporting Template (v2.0):** more granular fees and expenses (internal chargebacks, external partnership expenses, subscription-line interest), structured/machine-readable (Excel/XML, **not PDF**), aligned with capital-account statements. Replaces the 2016 version starting **Q1 2026** for funds still in their investment period or commencing on/after **January 1, 2026** [Citco; ILPA; Juniper Square].
2. **Performance Template (new):** standardizes IRR, TVPI, MOIC reporting; offers **two methodologies**, **Granular** (GPs that itemize capital calls and use fund-to-investor cash flows) and **Gross-Up** (GPs that use fund-to-investment cash flows and cannot itemize). Targeted for delivery to investors around **Q1 2027** [Citco].
3. **Capital Call & Distribution Template (v2.0):** standardizes capital-call and distribution notices, aligning transaction types across all reporting so cash-flow data reconciles into the Performance Report [ILPA; KPMG].

Why it matters for an LP/co-invest team: these templates are what your firm ingests to compute net returns, fee load, and PME consistently across managers. The push to machine-readable, reconciled data is the operational backbone of LP monitoring [Juniper Square; KPMG].

---

## 12. Performance metrics and PME

LPs evaluate funds on **money multiples** and **rate of return**, then benchmark against public markets via **PME**.

### 12.1 Core multiples and IRR

Let **PIC** = paid-in capital (capital actually called), **NAV** = residual value of unrealized holdings, **D** = cumulative distributions.

- **DPI (Distributions to Paid-In) = D / PIC.** The "realized" multiple, the cash actually returned per dollar called. DPI is what LPs ultimately get; an LP saying "show me DPI" is asking for real money, not marks.
- **RVPI (Residual Value to Paid-In) = NAV / PIC.** The unrealized multiple (paper value still in the ground).
- **TVPI (Total Value to Paid-In) = DPI + RVPI = (D + NAV) / PIC.** The total gross multiple of money (often called the gross MOM at the fund level).
- **MOIC (Multiple on Invested Capital) = total value / invested capital.** Used at the deal level; at the fund level it is close to TVPI but the base can differ (invested cost vs paid-in).
- **PIC ratio / called ratio = PIC / committed.** How much of the commitment has been drawn.
- **IRR (Internal Rate of Return):** the discount rate that sets the NPV of all fund cash flows (calls negative, distributions and ending NAV positive) to zero. It is **money-weighted** and therefore sensitive to timing. Because IRR rewards early cash, **subscription lines** can flatter it without improving the multiple, which is why ILPA pushes pref accrual from when capital is at risk [Real Deal].

```
DPI  = Cumulative distributions / Paid-in capital
RVPI = Residual NAV / Paid-in capital
TVPI = DPI + RVPI
0 = Σ_t  CF_t / (1 + IRR)^t        (CF includes ending NAV as a terminal inflow)
```

A fund can have a high IRR but low DPI (early paper marks, little realized cash) or a high TVPI but mediocre IRR (great multiple realized slowly). Read them together.

### 12.2 Why PME exists

IRR and TVPI tell you the fund's absolute return but not whether you beat the **public market** you could have bought instead, at the same cash-flow timing. **PME (Public Market Equivalent)** answers: "What if I had put each capital call into a public index and sold the index on each distribution date?" [Moonfare; Carta]. It is the **opportunity-cost / acid test** of going private and illiquid [TSG].

### 12.3 The PME family (academic lineage)

| Method | Originators (year) | Output | Mechanic | Known weakness |
|---|---|---|---|---|
| **Long-Nickels PME (ICM, Index Comparison Method)** | Long & Nickels (1996) | An **IRR** of a hypothetical index investment | Calls "buy" the index, distributions "sell" it; terminal value = index position; compare PE IRR to this IRR | Large distributions in a falling market can drive the synthetic index position **negative**, so the IRR fails to compute [Moonfare; Reyes/TSG] |
| **PME+** | Rouvinez (2003); Capital Dynamics | An **IRR** | Scales distributions so the synthetic terminal NAV matches the fund's NAV, fixing LN's negative-value problem; introduces a cash-flow mismatch as a trade-off | Adjusts cash flows, so it is an approximation [Allvue] |
| **Kaplan-Schoar PME (KS-PME)** | Kaplan & Schoar (2005), *Journal of Finance* | A **ratio (multiple)** | Future-value (or present-value) every distribution and contribution at the index's return; KS-PME = FV(distributions + ending NAV) / FV(contributions). **>1 means PE beat the index; <1 means it lagged** | Gives no annualized rate by itself [Allvue; ABC of PME; Grokipedia] |
| **mPME (modified PME)** | Cambridge Associates (2013) | A public-equivalent return | Builds a synthetic public portfolio that mirrors the private fund's NAV path | Vendor-specific [Kushim; TSG] |
| **Direct Alpha** | Gredil, Griffiths & Stucke (2014) | An **annualized alpha (IRR)** | Compounds each cash flow by the index to the valuation date, then solves for the IRR of those index-adjusted flows; this *is* the annualized KS-PME and is the only method giving the **exact** rate of out/underperformance | Still depends on choosing the right index and ignores risk differences [Allvue; Direct Alpha paper] |

**Relationships to remember:** Direct Alpha is to KS-PME as IRR is to the money multiple. KS-PME and Direct Alpha both compound at the index and avoid Long-Nickels' negative-NAV failure [Direct Alpha paper; Allvue].

**Universal caveat:** no PME adjusts for **risk** (leverage, illiquidity, sector concentration). A higher synthetic-index IRR may reflect risk, not manager skill, and there is **no standardized illiquidity premium**; each LP sets its own [Allvue; Moonfare].

### 12.4 KS-PME, worked in miniature

```
Contributions:  C1 = $100 at date 0 ; index grows ×1.5 to valuation date → FV = $150
Distributions:  D1 = $80 at a later date ; index grows ×1.2 from then → FV = $96
Ending NAV:     $120 at valuation date → FV = $120
KS-PME = FV(distributions + ending NAV) / FV(contributions)
       = ($96 + $120) / $150 = $216 / $150 = 1.44  → PE beat the index (>1)
```
(Illustrative figures, not from a specific fund; method per Kaplan-Schoar 2005 and the *ABC of PME*.)

---

## 13. Key formulas (collected)

```
Management fee (committed)      = rate × committed capital
Management fee (invested)       = rate × net invested cost (declines with realizations)
Lifetime fee (flat, no stepdown)= rate × committed × fund years
Preferred return (compounded)   = contributed capital × ((1 + h)^t − 1)
Preferred return (simple)       = contributed capital × h × t
GP catch-up (100% catch-up)     = (c / (1 − c)) × preferred paid       [= 0.25 × pref when c=20%]
GP catch-up (partial, GP share g)= (c / (g − c)) × preferred paid      [tier total = catchup / g]
Carry above catch-up            = c × (distributions above catch-up tier)
GP carry, full catch-up, profit above kink2 = c × total profit
GP carry, hard hurdle           = c × max(0, total profit − preferred)
Clawback                        = carry paid − c × total net fund profit   (if positive)
DPI  = cumulative distributions / paid-in capital
RVPI = residual NAV / paid-in capital
TVPI = DPI + RVPI = (distributions + NAV) / paid-in capital
PIC ratio = paid-in capital / committed capital
IRR: solve 0 = Σ CF_t / (1+IRR)^t , CF includes terminal NAV
KS-PME = FV_index(distributions + ending NAV) / FV_index(contributions)
Direct Alpha = IRR of index-compounded cash flows (annualized KS-PME)
```
Where `h` = hurdle rate, `t` = years, `c` = carry rate, `g` = GP share of the catch-up tier.

---

## 14. Glossary

| Term | Definition |
|---|---|
| **Limited Partner (LP)** | Passive investor supplying most fund capital; liability limited to commitment. |
| **General Partner (GP)** | The fund manager; earns fees and carry; invests a GP commitment. |
| **Limited Partnership Agreement (LPA)** | The governing contract setting fees, waterfall, hurdle, governance. |
| **Commitment** | Capital an LP contractually agrees to provide over the fund's life. |
| **Capital call / drawdown** | A GP request for LPs to wire a portion of their commitment. |
| **Distribution** | Cash (or stock) returned to LPs from realizations. |
| **Committed capital** | Total LP commitments; a common fee and carry base. |
| **Invested / paid-in capital (PIC)** | Capital actually called and deployed. |
| **Investment period** | Window (commonly ~5 yrs) during which new investments are made; fees often higher and on committed capital. |
| **Harvest period** | Later years focused on exits and distributions; fees usually step down. |
| **Management fee** | Recurring fee (often 2%) funding GP operations; performance-independent. |
| **Step-down** | Post-investment-period reduction in fee rate and/or shift of base to invested cost. |
| **Fee offset (management-fee offset)** | Portfolio-company fees reduce the management fee LPs owe; 100% offset is now standard. |
| **Transaction / monitoring / director fees** | Fees a GP charges portfolio companies (~1-2% EV; % of EBITDA); subject to offset. |
| **Recycling** | Reinvesting early proceeds to offset fee drag and reach full deployment; ILPA: capped, investment-period only. |
| **Carried interest (carry)** | GP's profit share, standard 20%. |
| **Carry basis** | Whether all committed or only invested capital must be returned before carry. |
| **Gross vs net carry** | Carry on profit before vs after fees and expenses; ILPA requires net. |
| **Preferred return / hurdle rate** | Minimum LP return before GP earns carry; standard 8% compounded in PE, 6-7% private credit, often none in VC. |
| **Hard hurdle** | Carry only on profit above the hurdle; no catch-up; GP take < stated %. |
| **Soft hurdle** | Hurdle plus catch-up; GP eventually earns its full carry % on all profit. |
| **GP catch-up** | Tier where the GP takes an outsized share (often 100%) until the agreed split is restored on all profit. |
| **Distribution waterfall** | Ordered rules splitting each distributed dollar between LP and GP. |
| **European / whole-fund waterfall** | Carry only after all fund capital + whole-fund pref returned; LP-protective. |
| **American / deal-by-deal waterfall** | Carry per realized deal; GP-favorable on timing; needs clawback. |
| **Clawback (GP giveback)** | GP returns excess carry so its final take = contractual % of true net profit. |
| **Escrow / holdback** | Carry held back to secure a future clawback. |
| **GP commitment** | GP's own capital in the fund (~1-2% rule of thumb), the "skin in the game." |
| **J-curve** | Early negative net returns from fees and early markdowns before exits turn returns positive. |
| **NAV** | Net asset value; the residual value of unrealized holdings. |
| **DPI / RVPI / TVPI** | Realized multiple / unrealized multiple / total multiple of paid-in capital. |
| **MOIC** | Multiple on invested capital (deal level). |
| **IRR** | Money-weighted internal rate of return; timing-sensitive. |
| **PME** | Public Market Equivalent; benchmarks PE cash flows against a public index. |
| **KS-PME** | Kaplan-Schoar PME; a ratio, >1 means PE beat the index. |
| **Direct Alpha** | Annualized KS-PME; exact rate of out/underperformance vs an index. |
| **ILPA** | Institutional Limited Partners Association; LP best-practice body (not a regulator). |
| **Subscription line** | Short-term fund credit facility; can inflate IRR; ILPA limits its use. |
| **Vintage year** | The year a fund starts investing; the basis for peer benchmarking. |

---

## 15. Flashcards (34)

Tagged `Sub-topic` / `Difficulty`. Cover the answer and recall it.

| # | Sub-topic | Diff | Question | Model answer |
|---|---|---|---|---|
| 1 | Structure | Easy | Who supplies most of a PE fund's capital, and what is their liability? | LPs supply almost all capital; liability is limited to their committed amount. |
| 2 | Structure | Easy | What does the GP do, and how is it paid? | Manages the fund (sourcing, deals, exits); paid a management fee plus carried interest, and invests a GP commitment. |
| 3 | Structure | Medium | What is the difference between committed and paid-in capital? | Committed is what the LP agreed to provide; paid-in is what has actually been called and funded. |
| 4 | Structure | Medium | What is the J-curve and why does it happen? | The early dip in net returns from fees and early markdowns before exits; returns climb later as winners are realized. |
| 5 | Fees | Easy | What does "2 and 20" mean? | 2% annual management fee, 20% carried interest. Both are negotiable defaults, not laws. |
| 6 | Fees | Medium | Committed-capital vs invested-capital fee base: which favors whom? | Committed favors the GP (paid on undrawn capital); invested favors LPs (paid only on deployed capital). |
| 7 | Fees | Medium | Describe a typical fee step-down. | Fee on committed capital during the investment period, then a lower rate and/or a switch to invested cost in the harvest years. |
| 8 | Fees | Hard | Roughly what share of committed capital do lifetime fees consume, per Metrick & Yasuda? | Median ~12% for buyout and ~17.75% for VC funds (1993-2006 sample). A flat 2% for 10 yrs would be 20%. |
| 9 | Fees | Hard | Per Metrick & Yasuda, what share of expected GP revenue is fixed (fee-like) vs performance-based? | About two-thirds is fixed (fees), undercutting the "only paid if they perform" narrative. |
| 10 | Fees | Medium | What is a management-fee offset and what is the current standard? | Portfolio-company fees reduce the management fee LPs owe; 100% (dollar-for-dollar) offset is now standard, and ILPA recommends it. |
| 11 | Fees | Easy | Name three fees a GP may charge portfolio companies. | Transaction/deal fees, monitoring fees, director/board fees (also advisory/consulting). |
| 12 | Fees | Hard | What is recycling and what does ILPA say about it? | Reinvesting early proceeds to offset fee drag; ILPA: capped or monitored, investment-period only. |
| 13 | Carry | Easy | What is carried interest and the standard rate? | The GP's share of profits; standard 20%. |
| 14 | Carry | Medium | Gross vs net carry, and ILPA's view? | Gross = on profit before fees/expenses; net = after. ILPA requires net. |
| 15 | Carry | Hard | How much extra is an investment-capital carry basis worth to a GP vs committed-capital, approximately? | Per M&Y, roughly the carry rate times lifetime fees (ignoring discounting), for a profitable fund. |
| 16 | Hurdle | Easy | What is a preferred return / hurdle and the standard level? | Minimum LP return before GP carry; ~8% compounded in PE (6-7% private credit; often none in VC). |
| 17 | Hurdle | Medium | Hard hurdle vs soft hurdle? | Hard: carry only on profit above the hurdle (no catch-up). Soft: hurdle plus catch-up, so GP eventually earns full carry % on all profit. |
| 18 | Hurdle | Hard | Which does ILPA prefer and what does it concede? | The hard hurdle; ILPA concedes it means the GP will not actually receive the full stated carry percentage. |
| 19 | Hurdle | Medium | Name three ways a GP can make a high headline hurdle less LP-friendly. | Use gross IRR, simple (not compounded) accrual, full catch-up, or delay the pref start date to after the investment period. |
| 20 | Catch-up | Medium | What does a 100% GP catch-up achieve at high returns? | It restores the GP to its full carry % of all profit, including the pref portion; the hurdle becomes a timing gate only. |
| 21 | Catch-up | Hard | For a 20% carry and 100% catch-up, what is the catch-up dollar amount relative to the pref paid? | 0.25 × pref (since C = c/(1−c) × pref = 0.20/0.80 × pref). |
| 22 | Catch-up | Hard | On $100M, 5-yr, 8% pref, where do the two carry kink points fall (Example 1)? | Kink 1 at $46,932,807.68 profit (pref paid, carry begins); Kink 2 at $58,666,009.60 (catch-up complete, GP at 20% of all profit). |
| 23 | Waterfall | Easy | List the four European waterfall tiers in order. | Return of capital, preferred return, GP catch-up, 80/20 split. |
| 24 | Waterfall | Medium | European vs American in one sentence each. | European: no carry until all fund capital + whole-fund pref returned. American: carry per realized deal once that deal clears its own hurdle. |
| 25 | Waterfall | Medium | Which is more LP-friendly and why? | European; winners cannot pay GP carry while losers are unrealized, so the GP never earns carry while the fund is underwater. |
| 26 | Waterfall | Hard | In Example 1 ($100M→$200M), what does the GP receive and what % of profit is it? | $20,000,000, exactly 20% of the $100,000,000 profit (full catch-up). |
| 27 | Waterfall | Hard | Same inputs but a hard hurdle (no catch-up): GP carry? | $10,613,438.46, about 10.6% of profit, roughly half. |
| 28 | Clawback | Medium | What is a clawback and why does deal-by-deal need it? | GP returns excess carry at wind-up; deal-by-deal can overpay the GP on early winners before later losers realize. |
| 29 | Clawback | Hard | In Example 2, how much clawback and why? | $6,000,000: GP banked $20M on Deal A, but 20% of true $70M fund profit is $14M. |
| 30 | Clawback | Hard | Post-clawback, how do American and European economics compare in Example 2? | Identical end split (GP $14M / LP $156M); they differ only in timing and clawback (counterparty) risk. |
| 31 | Clawback | Medium | What is ILPA's clawback tax stance in 3.0? | Compute clawback gross of taxes; reverts to the 2009 position, disliked by GPs. |
| 32 | ILPA | Easy | What is ILPA and is it a regulator? | The Institutional Limited Partners Association, an LP best-practice body; not a regulator. |
| 33 | Metrics | Medium | Define DPI, RVPI, TVPI. | DPI = distributions/paid-in (realized); RVPI = NAV/paid-in (unrealized); TVPI = DPI + RVPI (total multiple). |
| 34 | PME | Hard | What does a KS-PME above 1.0 mean, and how does Direct Alpha relate to it? | KS-PME > 1 means PE beat the public index; Direct Alpha is the annualized version of KS-PME (the IRR of index-compounded cash flows). |

---

## 16. Interview questions with model answers (14)

**Q1. Walk me through a standard European distribution waterfall.**
Four tiers. First, return of capital: 100% to LPs until all contributed capital is back. Second, preferred return: 100% to LPs until they earn the hurdle, typically 8% compounded, on that capital. Third, GP catch-up: typically 100% to the GP until the GP holds its carry percentage (for example 20%) of all profit distributed so far, including the pref. Fourth, the residual splits 80/20. The defining feature is that it is computed across the whole fund, so no carry is paid until the entire fund's capital and pref are covered.

**Q2. How does a deal-by-deal (American) waterfall differ, and why do LPs worry about it?**
The same tiers apply, but per realized deal rather than across the whole fund. The GP takes carry as each deal exits and clears its own return of capital and hurdle. LPs worry because early winners can pay the GP carry before later losers are realized, so the GP can be overpaid relative to true fund profit. That risk is managed with a clawback, escrow, and sometimes interim NAV tests.

**Q3. A $100M fund returns $200M over 5 years. 8% compounded pref, 100% catch-up, 20% carry, European. Split it.**
Pref = $100M × (1.08^5 − 1) = $46,932,807.68. Catch-up = 0.25 × pref = $11,733,201.92. Residual = $200M − $100M − $46.93M − $11.73M = $41,333,990.40, split 80/20 (LP $33,067,192.32 / GP $8,266,798.08). Totals: LP $180M, GP $20M. The GP ends with exactly 20% of the $100M profit because the full catch-up neutralizes the hurdle at this return level.

**Q4. Same fund, but a hard hurdle with no catch-up. What changes?**
The GP loses the catch-up tier. After capital and pref to LPs, the residual ($53,067,192.32) splits 80/20, so the GP gets $10,613,438.46, about 10.6% of profit rather than 20%. The hard hurdle roughly halves GP carry here, which is why GPs resist it and ILPA favors it.

**Q5. When does the hurdle actually cost the GP money?**
Only when profit is low. With a full catch-up, the hurdle just delays carry; above the catch-up completion point the GP earns its full 20% of all profit. The hurdle only permanently reduces GP carry under a hard hurdle, or when total profit never exceeds the catch-up completion point. In Example 1 the GP earns zero carry until profit exceeds $46.93M.

**Q6. Explain a clawback with a number.**
Take a two-deal deal-by-deal fund: $50M into a winner that returns $150M at year 3, $50M into a loser that returns $20M at year 5. On the winner alone the GP banks $20M carry. But true fund profit is only $70M, so the GP's correct share is 20% × $70M = $14M. The clawback is $6M, which the GP must return at wind-up. A properly functioning clawback leaves the GP at the same $14M a European waterfall would have produced.

**Q7. If the clawback fixes everything, why do LPs still prefer European?**
Two reasons. Timing: the American GP holds LP money in the interim, a time-value cost to LPs. Risk: the clawback may be uncollectable if carry has been distributed to individuals who have left or spent it, or if it is computed gross of tax leaving recipients short. European avoids the problem structurally rather than relying on a future recovery.

**Q8. Management fee on committed vs invested capital, and where does each appear in a fund's life?**
Committed-capital fees are charged on the full commitment regardless of deployment, common during the investment period and GP-favorable. Invested-capital (or net invested cost) fees are charged only on deployed capital, LP-favorable, and common after the investment period as part of a step-down. The base shift plus a rate cut is the standard step-down.

**Q9. What are fee offsets and what is current market practice?**
GPs can charge portfolio companies transaction, monitoring, and director fees. To avoid double-charging, LPs require those fees to offset the management fee. The standard has moved from partial (often 80%) to 100% dollar-for-dollar offset in developed markets, consistent with ILPA Principles 3.0.

**Q10. Why is the gap between gross and net returns so important on an LP team?**
LPs only keep net returns. The gap is everything in this guide: management fees (median ~12% of commitments for buyout per Metrick & Yasuda), expenses, and 20% carry. Two funds with identical gross returns can deliver very different net returns depending on fee base, step-downs, offsets, waterfall type, and catch-up. Diligence is about modeling net, not gross.

**Q11. How do DPI, TVPI, and IRR differ, and which would you trust most?**
DPI is realized cash returned per dollar called; TVPI adds unrealized NAV; IRR is the money-weighted, timing-sensitive rate. Early in a fund, IRR and TVPI rest on unrealized marks and can be flattered (for example by subscription lines). DPI is hardest to manipulate because it is actual cash, so a mature fund's DPI is the most trustworthy single number, though you read all three together and against vintage peers.

**Q12. What is PME and which method would you use?**
PME benchmarks a fund's cash flows against investing the same timing in a public index, capturing the opportunity cost of going private. Long-Nickels gives an index IRR but can fail when distributions hit a falling market. Kaplan-Schoar gives a clean ratio, above 1 means outperformance. Direct Alpha annualizes KS-PME into an exact alpha. I would report KS-PME plus Direct Alpha, and flag that none adjusts for risk or illiquidity and that the index choice drives the result.

**Q13. What is ILPA and how do its 2025 reporting templates affect your work?**
ILPA is the LP best-practice body, not a regulator. In January 2025 it overhauled three templates: the Reporting Template v2.0 (granular, machine-readable fees and expenses), a new Performance Template (standardized IRR/TVPI/MOIC, with Granular and Gross-Up methods), and a Capital Call & Distribution Template. For an LP team this standardizes and reconciles the data we ingest to compute net returns, fee load, and PME consistently across managers, replacing inconsistent PDFs.

**Q14. A GP markets a 9% hurdle as LP-friendly. What do you check before believing it?**
Whether it is computed on gross or net IRR, whether it compounds or is simple, whether there is a full catch-up that neutralizes it, and when it starts accruing (at first call, or only after the investment period, and whether a subscription line delays capital being at risk). A 9% hurdle with gross IRR, simple accrual, a full catch-up, and a delayed start can be more GP-favorable than a plain 8% term.

---

## 17. Calculator data model (to rebuild the worked examples)

A waterfall engine needs:

```
INPUTS
  committed_capital
  contributions: [(date, amount)]          # capital calls
  distributions: [(date, amount)]          # gross proceeds events
  hurdle_rate                              # e.g., 0.08
  compounding: "annual" | "simple"
  carry_rate                               # e.g., 0.20
  catchup_share                            # 1.00 (full) ... 0 (none / hard hurdle)
  waterfall_type: "european" | "deal_by_deal"
  carry_basis: "committed" | "invested"
  return_of_capital_scope: "drawn" | "committed"   # which capital tier 1 returns
  (deal_by_deal only) deals: [{cost, contributions, distributions}]
  clawback: true/false ; escrow_pct

TIER ENGINE (per distribution event, in order)
  1. Return of capital   -> LP until cumulative LP capital returned = target capital
  2. Preferred return    -> LP until accrued pref paid; pref accrues on unreturned capital
        pref_accrued = capital_outstanding * ((1+h)^t - 1)  [annual]  or  * h * t  [simple]
  3. GP catch-up         -> GP gets catchup_share of tier until GP = carry_rate * (pref_paid + gp_catch)
        full (share=1):    C = carry/(1-carry) * pref_paid
        partial (share=g): C = carry/(g-carry) * pref_paid ; tier total = C/g
  4. Residual split      -> LP (1-carry), GP carry

DEAL-BY-DEAL: run tiers 1-4 per deal on that deal's cost/pref/proceeds.
END-OF-FUND CLAWBACK:
  true_gp = carry_rate * max(0, total_distributions - total_contributions)
  clawback = max(0, gp_carry_paid - true_gp)

OUTPUTS (per tier and cumulative): amount, to_LP, to_GP, cum_LP, cum_GP
  plus DPI, RVPI, TVPI, IRR, and (optional) KS-PME / Direct Alpha against an index series.
```

The verified test cases your engine must reproduce:
- European, $100M → $200M, 5 yr: tier amounts $100,000,000 / $46,932,807.68 / $11,733,201.92 / $41,333,990.40; totals LP $180,000,000, GP $20,000,000.
- European hard hurdle (catchup_share = 0): GP $10,613,438.46, LP $189,386,561.54.
- Deal-by-deal two-deal: GP $20,000,000 pre-clawback, clawback $6,000,000, post-clawback GP $14,000,000 / LP $156,000,000.
- Low-return $100M → $130M, 5 yr: GP $0 (hurdle binds; pref of $46.93M exceeds $30M profit).

---

## 18. Sources

Authoritative sources are preferred. Tags map to the inline references above. Access dates: mid-2026; URLs may move.

**ILPA (primary):**
- [ILPA 3.0] ILPA Principles 3.0: Fostering Transparency, Governance and Alignment (June 2019). https://ilpa.org/wp-content/uploads/2019/06/ILPA-Principles-3.0_2019.pdf
- [ILPA Principles] ILPA Private Equity Principles (earlier). https://ilpa.org/wp-content/uploads/2015/08/ILPA-Private-Equity-Principles1.pdf
- [ILPA] ILPA Reporting Template v2.0 hub (released Jan 2025). https://ilpa.org/industry-guidance/templates-standards-model-documents/ilpa-templates-hub/ilpa-reporting-template/
- ILPA Reporting Template v2.0 Suggested Guidance (Jan 2025). https://ilpa.org/wp-content/uploads/2025/01/ILPA-Reporting-Template-v.-2.0-Suggested-Guidance.pdf
- ILPA Capital Call & Distribution Template v2.0. https://ilpa.org/industry-guidance/templates-standards-model-documents/ilpa-templates-hub/ilpa-capital-call-distribution-template/

**ILPA 3.0 / Model LPA commentary (law firms and advisers):**
- [Lexology] "ILPA Principles 3.0: Back to the Future?" https://www.lexology.com/library/detail.aspx?g=3a17eff8-0285-42e7-a610-eaaf178daf35
- [Davies] same title. https://www.dwpv.com/en/Insights/Publications/2019/ILPA-Principles-3-0
- [Dechert] "Third Time Lucky? The ILPA Principles 3.0." https://www.dechert.com/knowledge/onpoint/2019/10/third-time-lucky--the-ilpa-principles-3-0.html
- [Real Deal] BCLP, ILPA Principles 3.0 overview. https://therealdeal.com/sponsored/bryan-cave-leighton-paisner/unprecedented-expectations-around-transparency-ilpa-principles-3-0-reflect-an-evolving-and-diverse-private-equity-funds-industry/
- [Mayer Brown] "Analysis of the ILPA Model Fund Agreement." https://www.mayerbrown.com/-/media/files/perspectives-events/publications/2020/05/ilpa-model-fund-agreement_v2.pdf
- [V7 Labs] "Limited Partnership Agreement: LPA in Private Equity Guide" (notes two ILPA Model LPA versions; net vs gross carry). https://www.v7labs.com/blog/lpa-private-equity

**Reporting-standards practitioners:**
- [Juniper Square] "A GP's Guide to the New ILPA Reporting Standards." https://www.junipersquare.com/blog/new-ilpa-reporting-standards
- [Citco] "ILPA Reporting and New Performance Template." https://www.citco.com/insights/ilpa-reporting-and-new-performance-template
- [KPMG] "ILPA 2026: preparing new LP and GP standard." https://kpmg.com/lu/en/blogs/home/posts/2025/11/ilpa-2026-preparing-new-lp-and-gp-standard-in-private-market-reporting.html

**Academic / data:**
- [M&Y 2010] Metrick, A. & Yasuda, A., "The Economics of Private Equity Funds," Review of Financial Studies 23(6), 2010, 2303-2341. https://academic.oup.com/rfs/article-abstract/23/6/2303/1569783 (working-paper PDFs: Stanford mirror https://web.stanford.edu/~piazzesi/Reading/MetrickYasuda2010.pdf ; Yale ICF https://depot.som.yale.edu/icf/papers/fileuploads/2690/original/2010_ICF_WPS_The_Economics_of_Private_Equity_Funds_-_Metrick.pdf)
- [Cambridge Associates 2024] "Private Investment Fund Terms: Fees and Distribution Waterfalls" (Aug 2024). https://publishedresearch.cambridgeassociates.com/wp-content/uploads/2024/08/2024-08-Private-Investment-Fund-Terms-Fees-and-Distribution-Waterfalls-1.pdf

**PME literature:**
- Long, A.M. III & Nickels, C.J. (1996), "A Private Investment Benchmark" (Index Comparison Method).
- Rouvinez, C. (2003), "Private Equity Benchmarking with PME+," Venture Capital Journal.
- Kaplan, S. & Schoar, A. (2005), "Private Equity Performance: Returns, Persistence, and Capital Flows," Journal of Finance 60(4), 1791-1823.
- Gredil, O., Griffiths, B. & Stucke, R. (2014), "Benchmarking Private Equity: The Direct Alpha Method." https://allocatortraining.com/wp-content/uploads/2023/06/Benchmarking-PE-Direct-Alpha-Method.pdf
- Cambridge Associates (2013), mPME methodology.
- [ABC of PME] Landmark Partners, "An ABC of PME." https://www.secondariesinvestor.com/wp-content/uploads/sites/3/2014/03/An-ABC-of-PME-Landmark-Partners.pdf
- [Allvue] "What Does PME Stand For?" https://www.allvuesystems.com/resources/understanding-pme-benchmarking/
- [Moonfare] PME glossary. https://www.moonfare.com/glossary/public-market-equivalent-pme
- [Carta PME] https://carta.com/learn/private-funds/management/fund-performance/pme/
- [Kushim] PME & Direct Alpha. https://blog.kushim.vc/advanced-fund-performance-methods-pme-direct-alpha/
- [TSG] Reyes, "PME methods and analysis." https://tsgperformance.com/wp-content/uploads/2023/04/PME-Benchmarking-methods-analysis-2016-11-01.pdf

**Practitioner / definitional (fees, hurdle, waterfall, offsets):**
- [Carta] Management fees and carried interest guides. https://carta.com/learn/private-funds/management/management-fees/ ; https://carta.com/learn/private-funds/management/carried-interest/
- [iCapital] "An Explanation of Private Market Fund Fees." https://icapital.com/insights/private-equity/an-explanation-of-private-market-fund-fees/
- [Alter Domus] "How Private Equity Waterfalls Work." https://alterdomus.com/insight/private-equity-waterfall/
- [Umbrex] "Management Fee Offsets." https://umbrex.com/resources/private-equity-glossary/management-fee-offsets/
- [PipelineRoad] "Management Fee" glossary. https://pipelineroad.com/glossary/management-fee
- [NVPE] "Two and Twenty Explained." https://www.notveryprivateequity.com/two-and-twenty/
- [CLFI] "How Are Private Equity Fees Structured?" https://clfi.co.uk/resources/how-private-equity-fees-structured/
- [Qapita] "Understanding Fund Management Fees." https://www.qapita.com/blog/understanding-fund-management-fees-guide
- [Family Capital] "PE fees and waterfalls on direct deals." https://www.famcap.com/2018/10/private-equity-fees-and-waterfalls-on-direct-deals/
- [PE Bro] "Private Equity Fee Structure." https://privateequitybro.com/private-equity-fee-structure/
- [Crystal Funds] "Hurdle Rate, Preferred Return, and Catch-Up..." (2025 market color). https://www.crystalfunds.com/insights/hurdle-rate-preferred-return-catch-up-fine-print-reshaping-private-equity-economics
- [KL Gates] "Negotiating Private Equity Fund Terms." https://files.klgates.com/files/171269_negotiating_private_equity_fund_terms.pdf
- [Rundit] "Catch-Up Period in Private Equity." https://rundit.com/blog/a-comprehensive-guide-to-catch-up-period-in-private-equity/
- [AnalystPrep] CFA L2, PE fund structures and deal-by-deal carry. https://analystprep.com/study-notes/cfa-level-2/private-equity-fund-structures-terms-valuation-and-due-diligence/
- [Scalex] "Navigating Private Equity Fees." https://www.scalex-invest.com/blog/navigating-private-equity-fees-carried-interest-and-management-fees-explained

**Conflicts and caveats flagged in text:**
- Fee level: 2% is the mode (Cambridge Associates 2024) but the mean for 2024-vintage buyout/growth is ~1.74%/1.93% (Carta), reflecting fee compression. [§2.7]
- 2025 hurdle marketing can be more GP-favorable than it looks depending on gross/net, simple/compound, catch-up, and start date. (Crystal Funds) [§4.2]
- GP commitment "1% to 2%" is a rule of thumb; no single authoritative current median was located here. [§10.3]
- All worked numbers were independently recomputed; the cited practitioner pages are for terminology and ranges, not for the specific arithmetic in §7-§9, which is original to this guide.
