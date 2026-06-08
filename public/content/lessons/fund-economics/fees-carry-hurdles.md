---
title: Fees, Carry & Hurdles
domain: fund-economics
---

# Fees, Carry & Hurdles

## 1. The big picture: LPs, GPs, and the fund lifecycle

A private equity fund is a **limited partnership** with two roles:

- **Limited Partners (LPs):** the investors (pensions, endowments, sovereign wealth funds, insurers, funds-of-funds, family offices). They supply almost all the capital, their liability is limited to their commitment, and they are passive.
- **General Partner (GP):** the manager. The GP runs the fund, sources and manages deals, and earns fees plus a share of profits (carry). The GP also invests its own money alongside LPs (the **GP commitment**), historically around 1 to 2 percent of fund size.

LPs do not hand over cash on day one. They sign a **commitment** (for example, "$50M committed"). The GP then issues **capital calls** (drawdowns) over the **investment period** (commonly the first 5 years) as it finds deals. Money returned to LPs comes through **distributions** as portfolio companies are sold or recapitalized. The governing contract is the **Limited Partnership Agreement (LPA)**.

**Typical fund lifecycle (10-year fund, often with 1+1 or 2x1 extensions):**

```
Year:   0 ──── 1 ──── 2 ──── 3 ──── 4 ──── 5 ──── 6 ──── 7 ──── 8 ──── 9 ──── 10
        │  Investment period (deploy capital)  │   Harvest period (exit, distribute)
        │  fee on COMMITTED capital            │   fee STEPS DOWN, often on INVESTED cost
        Capital calls dominate                     Distributions dominate
```

**The J-curve.** Early in life, a fund's net-to-LP return is negative: fees and expenses are charged immediately, while value creation and exits take years. Net cash flow and reported value dip, then climb as winners are realized, tracing a "J." This is why first-year IRRs are meaningless and why LPs judge funds against same-vintage peers.

**Gross vs net.** A *gross* return is measured at the deal or portfolio level before fund-level fees, expenses, and carry. A *net* return is what the LP actually keeps after all of those. LPs care about **net**. The gap between gross and net is precisely the subject of this guide. ILPA Principles 3.0 require carried interest to be calculated on **net** profits, factoring in fund-level expenses.

---

## 2. Management fees

The management fee funds the GP's operations: salaries, rent, travel, legal, compliance, fund administration, and overhead. It is **not** a profit share; it is paid regardless of performance. The headline shorthand is "**2 and 20**" (2% fee, 20% carry), but every element behind it is negotiable.

### 2.1 The fee base: committed vs invested capital

This is the single most important fee mechanic.

- **On committed capital:** the fee is a percentage of total commitments, charged whether or not the money has been deployed. More GP-favorable, because the GP earns on undrawn capital. Historically the most common method.
- **On invested capital (or net invested cost):** the fee is a percentage of capital actually put to work (cost basis of holdings, net of realizations and write-offs). More LP-favorable, because LPs do not pay on idle commitments.

**Typical real structure:** fee on **committed** capital during the investment period, then a **step-down** to a lower rate and/or a shift to **invested cost** after the investment period ends.

### 2.2 Step-downs

After the investment period, the fee almost always declines. Common forms:

1. **Rate step-down:** the percentage falls (for example, 2.0% drops by 25 bps per year, or to 1.5%).
2. **Base step-down:** the base switches from committed capital to invested cost, which then shrinks as the portfolio is realized.

Either way, the dollar fee declines through the harvest years.

### 2.3 Lifetime fee drag

A flat 2% on committed capital for 10 years equals **20% of commitments** consumed by fees, leaving only ~80% as investable capital, before any carry. Because most funds step down, actual lifetime fees are lower. Metrick & Yasuda's empirical finding (238 funds, 1993 to 2006): **median lifetime management fees were ~12% of committed capital for buyout funds and ~17.75% for VC funds**. They also found that **about two-thirds of a GP's expected total revenue comes from fixed (non-performance) components** (fees rather than carry), which means the popular story that GPs "only get paid if they perform" is false for the median fund.

### 2.4 The investable-capital problem and fee recycling

Fees reduce the cash available to invest. If $100M is committed and ~$15M is consumed by fees over the fund's life, only ~$85M can be invested unless the LPA allows **recycling** (reinvesting early proceeds or using realized capital to restore commitments). ILPA Principles 3.0 say recycling should be **capped or monitored** and should apply **only during the investment period**.

### 2.5 Fee income beyond the management fee, and the management-fee offset

GPs (especially buyout GPs) can charge portfolio companies directly:

- **Transaction / deal fees:** charged on acquisitions or exits, often **1% to 2% of enterprise value**.
- **Monitoring fees:** ongoing "advisory" fees, often a small percentage of EBITDA or a fixed annual amount.
- **Director / board fees, consulting, broken-deal cost recovery.**

Historically GPs **kept** these, effectively getting paid twice. The LP fix is the **management-fee offset**: portfolio-company fees the GP collects **reduce** the management fee LPs owe. The **offset percentage** ranges historically from 50% to 100%; an 80% offset means the GP keeps 20% of the extra income.

**The trend is unambiguous: 100% offset (dollar-for-dollar) is now standard in developed markets, and ILPA Principles 3.0 recommend that any portfolio-company fees charged be 100% offset against the management fee.**

### 2.6 Worked management-fee example

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

**Result:** lifetime fees = **$15.10M = 15.1% of committed capital**. Investable capital, absent recycling, falls to about **$84.9M**.

**Fee-offset overlay:** suppose in Year 6 the GP collects $3M of monitoring and transaction fees from portfolio companies.

- **100% offset:** Year 6 management fee is reduced from $1.70M to **$0** (offset capped at the fee; the $1.30M excess may carry forward, depending on the LPA), GP keeps $0 of the $3M as extra.
- **80% offset:** fee reduced by $2.40M (floored at $0 here), GP keeps $0.60M of the $3M as extra income on top.

### 2.7 Fee levels today

- **2% is the modal management fee for buyout and growth equity; 2.5% is most common for VC** (Cambridge Associates 2024).
- **[Nuance]** Carta reports *mean* management fees for 2024-vintage funds of **1.74% (buyout) and 1.93% (growth equity)**, below the 2% mode. These reconcile: 2% remains the most common single value, but fee compression on large funds pulls the average down. When you read "the fee is 2%," check whether that is the mode, the mean, the rate before or after step-down, and the base.

---

## 3. Carried interest

**Carried interest ("carry") is the GP's share of fund profits**, the performance fee. The market standard is **20%** of profits. It is the GP's incentive to generate returns, even though it is the *minority* of expected revenue for the median fund.

### 3.1 Carry basis: committed vs invested capital

Carry is computed on profit, but the *definition* of the capital that must be returned first matters:

- **Carry basis = committed capital:** LPs must get back all committed (or contributed) capital plus pref before carry. Used by the large majority of funds: **83.2% of buyout funds and 92.1% of VC funds** in the Metrick & Yasuda sample.
- **Carry basis = investment capital:** a narrower base. Switching from a committed-capital basis to an investment-capital basis is worth roughly *the carry rate times lifetime fees* in extra carry to the GP (for a profitable fund, ignoring discounting). A subtle but real GP-favorable lever.

### 3.2 Gross vs net carry

- **Net carry (LP-friendly, ILPA-preferred):** the 20% applies to profit **after** deducting management fees and fund expenses.
- **Gross carry (GP-friendly):** the 20% applies to total profit **before** fees and expenses.

ILPA 3.0 requires carry on **net** profit, with fund-level expenses factored in.

### 3.3 Vesting, allocation, and tiered carry

- Carry is usually allocated among the GP's investment professionals and **vests** over time (to retain staff).
- **Tiered / ratcheting carry:** some LPAs raise carry (for example, 20% rising to 25%) once the fund clears a higher multiple such as 3.0x, or add a second, higher hurdle with a higher carry above it.

---

## 4. Preferred return / hurdle rate

The **preferred return** (or **hurdle rate**) is the minimum annual return LPs must receive **before** the GP earns any carry. It is a gate.

- **Standard level: 8% per annum, usually compounded**, in buyout and most PE.
- **Private credit: typically 6% to 7%** (lower target returns).
- **VC: often no preferred return at all.**

The pref is calculated on LP contributed capital and **compounds**, so it grows with the holding period. Annual compounding is the common convention; "simple" (non-compounding) pref is more GP-favorable.

The compounded preferred return is:

$$\text{Pref} = \text{contributed capital}\times\left((1+h)^{t}-1\right)$$

and the simple version is $\text{Pref} = \text{contributed capital}\times h \times t$, where $h$ is the hurdle rate and $t$ is years.

### 4.1 Hard hurdle vs soft hurdle

- **Soft hurdle (with catch-up):** once LPs clear the pref, a **catch-up** lets the GP collect carry on the **entire** profit including the part that funded the pref. Net effect at high returns: the GP earns its full 20% of *all* profit. The hurdle is just a *timing* gate, not a permanent giveaway. This is the **standard** structure.
- **Hard hurdle (no catch-up):** the GP earns carry **only on profits above the hurdle**. The pref portion is never shared. The GP's effective take is permanently below 20% of total profit. ILPA Principles 3.0 explicitly **prefer** the hard hurdle, and openly acknowledge that it means "the GP will, in fact, not receive the stated carried interest percentage."

### 4.2 The 2025 hurdle debate

In a weak 2025 fundraising market, some GPs advertised LP-friendly **9% to 10% hurdles**, but the optics can reverse: pairing a high hurdle with a **gross** IRR calculation, a **full catch-up**, **simple** (not compounded) accrual, or a **delayed start date** (pref begins only after the investment period) can make the economics *more* GP-skewed than an old 8% term. The lesson: never read the hurdle number in isolation. Read it together with the catch-up, the compounding convention, the base, and the start date.

---

## 5. GP catch-up

The **catch-up** is the tier that sits between the preferred return and the final split. After LPs get their pref, the GP receives an outsized share (often **100%**) of the next distributions until the agreed profit split (for example, 80/20) is **restored across all profit distributed so far**, including the pref.

### 5.1 Catch-up percentages

- **100% catch-up (GP-favorable, common):** the GP takes 100% of distributions in this tier until caught up. Fastest catch-up.
- **Partial catch-up (for example, 80/20 or 50/50):** the GP takes only 80% (or 50%) of the catch-up tier, LP takes the rest. Slower; LP-friendlier. ILPA's hard-hurdle preference effectively pushes toward **no** catch-up.

### 5.2 The catch-up formula (full 100% catch-up)

The GP catches up until its cumulative carry equals the carry rate $c$ times the total profit distributed (pref + catch-up). Let $P$ = preferred return already paid to LPs, and $C$ = catch-up dollars to the GP. With a 100% catch-up:

$$C = c\,(P + C)\quad\Rightarrow\quad C(1-c)=cP\quad\Rightarrow\quad C = \frac{c}{1-c}\,P$$

For $c = 20\%$: **$C = 0.25\times P$.** That is, the GP catch-up equals 25% of the preferred return paid. After this tier, the GP holds exactly 20% of (pref + catch-up), and everything above splits 80/20.

If the catch-up is **partial** at rate $g$ (GP's share of the catch-up tier, for example $g=0.80$):

$$C = \frac{c}{g-c}\,P\qquad\text{(GP's catch-up dollars)}$$

and the catch-up tier itself distributes $C/g$ in total (GP gets $C$, LP gets the rest).
