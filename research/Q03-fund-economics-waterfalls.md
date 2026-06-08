# Q03 — Fees, Carry & Distribution Waterfalls

## 0. Metadata

- **Domain tag:** `fund-economics`
- **Researched:** 2026-06-03
- **Prepared for:** Private Equity LP / fund-investing internship (Primaries & Co-investments), Neuberger Berman.
- **Scope:** Management fees (rates, fee base over fund life, offsets, step-downs, fund-of-funds vs direct); carried interest (20% carry, vesting, clawback); hurdle / preferred return (8% pref, compounding, hard vs soft); GP catch-up (100% vs 80/20, full vs partial, the two base conventions); the four-tier distribution waterfall; European (whole-fund) vs American (deal-by-deal); clawback provisions; fee drag / gross-to-net bridge. Math-first: 7 fully worked numeric examples.
- **Cross-references:** **Q04 (Performance Metrics)** — gross vs net IRR, TVPI/DPI/RVPI, MOIC, PME. The gross-to-net bridge here (Example E) is the joint between this topic and Q04. Also relevant: J-curve, vintage year.
- **Reliability note:** All numeric mechanics in Section 4 were re-derived and cross-checked by the author against 2+ public worked examples (A Simple Model, CFI, Wall Street Prep, Allvue, Allen Latta, iCapital). WebFetch on several sources returned HTTP 403; figures below were reconstructed from search-result excerpts plus first-principles math. The single most error-prone item — the GP catch-up formula and its two base conventions — is flagged explicitly in Sections 3, 4B, 8, and 9.

---

## 1. Executive Summary (TL;DR)

- **"2 and 20" is the shorthand:** ~2% annual **management fee** plus **20% carried interest** over a **hurdle/preferred return** of typically **8%**. Large buyout funds often run **1.5–2.0%**; the bigger the fund, the lower the rate.
- **Management-fee base changes over fund life.** During the **investment period** (typically years 1–5) the fee is charged on **committed capital**. After the investment period it **steps down** — both the rate drops and/or the **base switches** to **invested capital** (cost basis of remaining deals), so the fee shrinks as the portfolio is realized.
- **Fee offsets reduce LP cost.** Transaction, monitoring, and director fees the GP collects from portfolio companies are credited back ("offset") against the management fee. **ILPA's standard is a 100% offset**; many GPs historically offered only 80%.
- **Carried interest = the GP's profit share**, almost always **20%** of profits above the return of capital and pref. Carry typically **vests** over time and is subject to **clawback**.
- **Hurdle / preferred return** is the minimum LP return (usually **8% per annum, compounded**) that must be met before the GP earns carry. Computed as a compounding rate, an IRR, or % of capital drawn — conventions vary.
- **Soft hurdle (with catch-up) vs hard hurdle:** A **soft hurdle** (PE standard) lets the GP, via a **catch-up**, earn carry on **all** profit once the hurdle is cleared. A **hard hurdle** lets the GP earn carry only on profit **above** the hurdle.
- **GP catch-up** is the tier that lets the GP "catch up" to its target carry % on total profit. A **100% catch-up** sends 100% of distributions to the GP during the catch-up tier; an **80/20** (or 50/50) **partial catch-up** shares the catch-up tier, so it takes longer.
- **The four-tier waterfall:** (1) **Return of Capital** to LPs, (2) **Preferred Return** to LPs, (3) **GP Catch-up**, (4) **Carry split** (80/20) on the residual. Cash flows down the tiers like water.
- **European = whole-fund waterfall:** GP earns no carry until LPs get **all** capital back **plus** pref across the **entire fund**. **American = deal-by-deal:** GP can earn carry as each deal exits.
- **LPs strongly prefer European** because it protects capital, defers GP carry, and makes clawback unlikely. **GPs prefer American** for early carry / cash flow. European dominates in PE globally.
- **Clawback:** if the GP is ultimately overpaid carry (common under American waterfalls when early winners pay carry but later deals lose money), the GP must **return the excess**. Often backed by **escrow/holdback (20–30% of carry)** and **personal GP guarantees**, usually capped at carry **net of taxes**.
- **Fee drag / gross-to-net:** management fees, fund expenses, and carry convert **gross** returns to **net** returns to LPs. The gross-to-net spread is typically **~3–8 percentage points of IRR** (and ~0.2x of MOIC), widening as performance improves (carry is a % of profit).
- **Fund-of-funds (FoF) charge two fee layers** — the FoF fee on top of the underlying funds' fees. FoF fees are lower (~**1% / lower carry**); carry differs by **sleeve**: **primaries lowest (often 0–5%)**, **secondaries / co-investments higher (5–10%)**.
- **Co-investments are usually offered "no fee, no carry"** to LPs — a major reason large LPs (and NB) build co-invest programs: they blend down the all-in cost of the program.
- **For the NB LP role specifically:** you analyze the GP's economics *as the LP / fund-investor*. You must reconstruct the gross-to-net bridge, sanity-check the waterfall in the LPA, and understand how primaries/secondaries/co-invest sleeves blend the program's net fee load.

---

## 2. Core Concepts (lesson-ready)

### 2.1 Management Fees

The **management fee** funds the GP's operations (salaries, rent, deal sourcing, monitoring). It is an **annual** fee, typically billed quarterly in advance.

- **Typical rate:** ~**2%** for mid-market funds and VC; **1.5–1.75%** common for large/mega buyout funds (economies of scale). Callan/industry studies show a long-run drift toward ~1.5–1.75% for large funds.
- **Fee base — the key nuance:**
  - **Investment period (≈ years 1–5):** fee charged on **committed capital** (the total LPs have promised, whether or not yet drawn). The GP is sourcing and deploying; LPs accept paying on commitments to fund the platform.
  - **Post-investment period:** the fee **steps down**. Two mechanisms, often combined:
    1. **Rate step-down** — e.g., from 2.0% by ~10–25 bps/year, or a flat drop.
    2. **Base switch** — from committed capital to **invested capital** (cost basis of deals still held), sometimes net of write-downs/realizations. As the fund harvests, the base shrinks, so the fee falls naturally.
  - This is why the **fee profile is humped/declining**, not flat across a 10-year life.
- **Fee offsets / fee sharing:** GPs may earn **transaction fees, monitoring fees, and director fees** from portfolio companies. ILPA's view: these are LP money and should be **100% offset** against the management fee. Historically many GPs kept a share (e.g., 80% offset / 20% retained). Offsets directly **reduce** the cash management fee.
- **Management-fee offset vs. waiver:** distinct from a **management fee waiver** (a tax-driven mechanism where the GP waives fees in exchange for a priority profit interest — separate topic).
- **Fund-of-funds management fee:** the FoF charges its **own** management fee **on top of** the underlying funds' fees (the "double layer" / "fee-on-fee"). FoF fees are lower than direct funds — industry averages around **~0.7–1.0%** — precisely because LPs are already paying the underlying GPs. (See 2.8.)

### 2.2 Carried Interest (Carry)

**Carried interest** is the GP's **share of fund profits**, the performance-based pay that aligns GP and LP. Standard is **20%** of profits (after return of capital and pref). Mega-funds occasionally negotiate higher (e.g., 25–30%) for top performers; FoF/co-invest sleeves are often lower (0–12.5%).

- **It is a share of *profit*, not of *gross proceeds***. The first dollars back go to LPs (capital + pref).
- **Vesting:** the GP team's carry typically vests over time (e.g., over 5 years, sometimes with a cliff) to retain professionals; unvested carry of departing partners may be forfeited or reallocated ("good leaver / bad leaver" terms).
- **GP commitment:** the GP also invests its own money in the fund (commonly **1–5%** of commitments) — "skin in the game" — separate from carry.
- **Tax angle:** carry is often taxed as **capital gains** (long-term) rather than ordinary income in the US, a recurring policy debate; the **3-year holding requirement** applies post-2017 TCJA. (Awareness-level for the role.)
- **Clawback** (2.7) is the backstop that ensures the GP never keeps more than its bargained share.

### 2.3 Hurdle Rate / Preferred Return

The **preferred return ("pref") / hurdle rate** is the minimum **compound annual return** LPs must receive on their contributed capital before the GP shares in profits. **8%** is the long-standing PE standard.

- **Compounding:** the pref **accrues and compounds** (usually annually) on outstanding LP capital. It is cumulative across the fund's life. Goodwin's fund-terms data: ~50% of funds compute the hurdle as a **compounding rate**, ~38% as an **IRR**, ~12% as a simple **% of amounts drawn/committed**.
- **Hard hurdle vs soft hurdle (critical distinction):**
  - **Hard hurdle:** GP earns carry **only on the profit above** the hurdle. No catch-up. (More LP-favorable; common in credit/real assets, rarer in PE buyout.)
  - **Soft hurdle (PE standard):** once the hurdle is met, a **catch-up** lets the GP earn carry on **all** profit (back to dollar one), not just the excess. Economically, with a full catch-up the pref is a *timing/gating* mechanism, not a permanent giveaway — if the fund does well, the GP ends up with its full 20% of all profit.
- **No hurdle at all:** some VC funds have **no pref** (and no catch-up) — GP just takes 20% of all profit.

### 2.4 GP Catch-up

The **catch-up** is tier 3 of the waterfall. It exists to reconcile the soft hurdle: after LPs receive 100% of the pref, the **catch-up** gives the GP a run of distributions so that, looking across the pref + catch-up, the GP ends up with its target carry % of that profit.

- **100% catch-up (most common in buyout):** during the catch-up tier, **100% of distributions go to the GP** until the GP's cumulative carry equals its target % of profits. Fast catch-up.
- **Partial / split catch-up (e.g., 80/20 or 50/50):** distributions in the catch-up tier are **shared** (e.g., 50% LP / 50% GP) until the GP reaches its target. The catch-up takes **longer** (more total profit must be distributed before the GP is "caught up"). More LP-favorable.
- **Full vs partial catch-up:** a **full** catch-up brings the GP all the way to 20% of *all* profit. A **capped/partial** catch-up may only bring the GP partway, so the GP's effective carry on total profit ends up **below** 20%.
- **The two base conventions (a classic source of error — see 2.4.1):** does "20%" mean 20% of *total* profit (pref + catch-up + residual), or 20% of the *LP's* profit? This changes the catch-up amount. The **total-profit** convention is the most common.

#### 2.4.1 Why the catch-up formula has a "gross-up"

If the GP wants 20% of total profit and the LP has already taken the pref as the "first 80%," then in the catch-up tier the GP must take an amount such that GP carry = 20% of (pref + catch-up). Solving gives the **gross-up factor** `carry / (1 − carry)`:

> **GP catch-up amount = Preferred return × [ carry / (1 − carry) ]** (100% catch-up, total-profit convention)

With 20% carry: `0.20 / 0.80 = 0.25`, so **GP catch-up = 25% × pref**. (Worked in 4B.)

### 2.5 The Four-Tier Distribution Waterfall

Cash returned by the fund flows through ordered "tiers" (buckets); each fills before the next receives anything:

1. **Tier 1 — Return of Capital (ROC):** 100% to LPs until they have received back **all contributed capital** (often including capital used for fees/expenses, depending on LPA).
2. **Tier 2 — Preferred Return:** 100% to LPs until they have received the **accrued pref** (e.g., 8% compounded) on their capital.
3. **Tier 3 — GP Catch-up:** distributions to the GP (100% in a full catch-up) until the GP has "caught up" to its **target carry %** of profit.
4. **Tier 4 — Carry Split / Residual:** all remaining distributions split per the carry — typically **80% LP / 20% GP**.

### 2.6 European (Whole-Fund) vs American (Deal-by-Deal)

|  | **European (whole-fund / fund-as-a-whole)** | **American (deal-by-deal)** |
|---|---|---|
| Carry timing | GP earns **no carry** until LPs recover **all** capital + pref across the **entire fund** | GP can earn carry as **each deal** exits and clears its own ROC + pref |
| Capital protection | High — full fund must be in the money | Lower — early winners pay carry before losers resolve |
| Clawback risk | Low (rarely triggered) | High (often triggered) |
| GP cash flow | Later | Earlier |
| Who prefers it | **LPs** | **GPs** (esp. emerging managers) |
| Prevalence | Dominant globally in PE | More common historically in US/VC, real estate |

**Why LPs prefer European:** their capital and pref are protected fund-wide before the GP profits; minimizes the need for (and reliance on) clawback enforcement. **ILPA's model LPA uses a whole-fund (European) waterfall** as the LP-protective default.

### 2.7 Clawback Provisions

A **clawback** (a.k.a. GP giveback) requires the GP to **return excess carry** if, at the end of the fund, it received more than its bargained share — i.e., if the GP's cumulative carry exceeds 20% of total fund profit, or if LPs failed to receive their full capital + pref. Most relevant under **American** waterfalls.

- **Trigger:** typically tested at **fund wind-down** (sometimes interim). If `cumulative GP carry > 20% × total lifetime profit` (or LPs short of capital+pref), the GP repays the difference.
- **Enforcement protections LPs negotiate:**
  - **Escrow / holdback:** a portion of each carry distribution (commonly **20–30%**, sometimes up to 50%) held back until the clawback risk clears.
  - **Personal guarantees** from GP principals (several/joint).
  - **Interim true-ups.**
- **Net-of-tax cap:** clawback is usually **capped at carry received net of taxes** the GP paid on it (the GP shouldn't repay money it already paid to the IRS). Tax gross-up / distribution provisions handle this.
- European waterfalls largely **pre-empt** clawback because carry is only paid once the whole fund is in the money.

### 2.8 Fee Drag / Net-to-Gross & Fund-of-Funds Layering

- **Gross return** = portfolio performance before fees/carry. **Net return** = what the LP actually keeps after **management fees + fund expenses + carry**.
- **Fee drag** = the gap. Typical **gross-to-net IRR spread ≈ 3–8 percentage points**; on a multiple basis, net MOIC commonly lands **~10–20% below gross** (~0.2x), and the gap **widens with stronger performance** because carry scales with profit.
- **Components of the bridge:** (1) management fees, (2) fund/organizational/partnership expenses, (3) carried interest. (Transaction/monitoring fees should be offset back to LPs.)
- **Fund-of-funds double layer:** an LP in a FoF pays the **FoF's** fee + carry **and** indirectly the **underlying funds'** fees + carry. This compounds fee drag, which is the core critique of FoF — hard to beat direct exposure net-of-fees on cost alone (the value-add must come from access, selection, and diversification).
- **Carry differs by FoF sleeve** (directly relevant to the NB role):
  - **Primaries** sleeve: **lowest carry**, often **0% or ~5%** (LP is already paying the underlying GP's 20%).
  - **Secondaries** and **Co-investments** sleeves: **higher**, ~**5–10%** (more active value-add, the FoF is doing underwriting/structuring).
  - **Direct co-investments** offered by GPs to their LPs are frequently **no fee, no carry** — which is why building a co-invest program blends down the LP's all-in cost.

---

## 3. Key Formulas & Definitions

Let:
- `C` = LP contributed/committed capital
- `r` = preferred return (hurdle) rate, e.g., 0.08
- `t` = time in years
- `c` = carry rate, e.g., 0.20
- `D` = total distributions; `P` = total profit = D − C (when all capital returned)

**(1) Management fee (investment period):**
`Fee_t = rate × Committed Capital`

**(2) Management fee (post-investment period, base switch):**
`Fee_t = rate' × Invested Capital_t` (Invested Capital = cost basis of deals still held; rate' ≤ rate)

**(3) Management fee net of offset:**
`Net Fee = Gross Fee − (offset% × portfolio-company fees received)` — ILPA standard offset% = 100%

**(4) Preferred return — compounding accrual (single tranche of capital, simplified):**
`Pref balance at time t = C × [(1 + r)^t − 1]`
(In practice computed cumulatively on each contribution/distribution date; an IRR-based hurdle uses the dated cash flows.)

**(5) GP catch-up amount — 100% catch-up, total-profit convention (the standard):**
`Catch-up_GP = Pref × [ c / (1 − c) ]`
With c = 0.20 → `Catch-up_GP = Pref × 0.25`.
*Derivation:* the GP wants `c` of (Pref + Catch-up). Set `Catch-up = c × (Pref + Catch-up)` → `Catch-up(1 − c) = c × Pref` → `Catch-up = Pref × c/(1−c)`. ✔

**(5b) Catch-up under LP-profit convention (less common):**
GP target = `c × LP profit` rather than `c × total profit`; produces a different (smaller) catch-up. **Always confirm which the LPA uses.**

**(6) Partial / split catch-up (GP gets share `g` of catch-up tier, e.g., g = 0.50):**
The catch-up tier runs until cumulative GP carry = `c × (Pref + total catch-up tier)`. Total catch-up tier distributions `X` solve `g·X = c·(Pref + X)` → `X = c·Pref / (g − c)`; GP portion = `g·X`. (For g=1 this reduces to formula (5): GP = c·Pref/(1−c). For g=0.5, c=0.2: GP gets `0.5·X` where `X = 0.2·Pref/0.3`.)

**(7) Carry split / residual (Tier 4):**
`LP residual = (1 − c) × Residual; GP residual = c × Residual`
where `Residual = total profit − Pref − Catch-up tier already distributed`.

**(8) Clawback amount (whole-fund test at wind-down):**
`Clawback = max(0, Cumulative GP carry received − c × Total lifetime profit)`
(net-of-tax cap applies: GP repays the lesser of this and after-tax carry retained)

**(9) Gross-to-net bridge (multiple form, conceptual):**
`Net Distributions to LP = Gross proceeds − Mgmt fees − Fund expenses − GP carry`
`Net MOIC = Net Distributions to LP / LP capital contributed`
`Fee drag (IRR) = Gross IRR − Net IRR`

**(10) Effective GP carry on total profit (check):**
`GP total $ / Total profit` should ≈ `c` when a **full** catch-up is present (and the fund is above the hurdle).

---

## 4. WORKED EXAMPLES (centerpiece — all numbers shown)

> Convention used throughout unless stated: **8% pref**, **20% carry**, **100% catch-up**, **total-profit** catch-up convention, **European** waterfall. Pref shown as a simplified single-period accrual where noted so the arithmetic is clean for quizzing; real funds use dated cash-flow IRR/compounding.

---

### Example A — Full 4-tier European waterfall (clean, large profit)

**Setup.** Fund draws **$100M** of LP capital (assume single drawdown for clarity). At exit the fund distributes **$160M** total. Pref = 8%, accrued = **$8M** (simplified single period). Carry = 20%, 100% catch-up.

**Total profit** = $160M − $100M = **$60M**.

| Tier | Mechanic | LP gets | GP gets | Cumulative distributed |
|---|---|---|---|---|
| 1. Return of Capital | 100% to LP until $100M back | $100M | $0 | $100M |
| 2. Preferred Return | 8% on capital = $8M to LP | $8M | $0 | $108M |
| 3. GP Catch-up (100%) | GP = Pref × 0.20/0.80 = $8M × 0.25 = **$2M** | $0 | $2M | $110M |
| 4. Residual (80/20) | Residual = $160M − $110M = **$50M**; 80/20 | $40M | $10M | $160M |
| **Total** |  | **$148M** | **$12M** | **$160M** |

**Checks.**
- GP total = $2M (catch-up) + $10M (residual) = **$12M**. Total profit = $60M. **$12M / $60M = 20.0%** ✔ — the full catch-up delivered exactly 20% of *total* profit to the GP.
- LP total = $100M + $8M + $40M = **$148M**; LP profit = $48M = 80% of $60M ✔.
- LP net MOIC = $148M / $100M = **1.48x**.

---

### Example B — Catch-up mechanics: 100% vs 80/20 (50/50) partial catch-up

**Setup.** Same fund: $100M capital, $8M pref accrued, 20% carry. We isolate the catch-up tier and assume there is plenty of profit so the catch-up fully completes, then compare.

**(i) 100% catch-up.**
- GP catch-up = Pref × c/(1−c) = $8M × 0.20/0.80 = **$2.0M**, paid 100% to GP.
- After catch-up, GP has $2M and LP has $8M (pref). Check: $2M / ($2M + $8M) = **20%** of pref+catch-up ✔. Residual then splits 80/20.

**(ii) 80/20 catch-up (GP gets 20% of the catch-up tier — i.e., a *slow* catch-up).**
- Using formula (6) with g = 0.20: but note if g = c the GP can *never* catch up (denominator g − c = 0). So an "80/20 catch-up" in this sense is degenerate — it's just the normal 80/20 split with **no real catch-up** and the GP keeps only 20% of profit *above* the pref (a de-facto hard hurdle). This is exactly why "no catch-up" hurts the GP.

**(ii′) 50/50 partial catch-up (the realistic LP-friendly version).** g = 0.50:
- Catch-up tier total `X = c·Pref/(g − c) = 0.20 × $8M / (0.50 − 0.20) = $1.6M / 0.30 = $5.333M`.
- GP portion = 0.50 × $5.333M = **$2.667M**; LP portion = **$2.667M**.
- Wait — check the target: GP wants 20% of (Pref + catch-up tier) = 0.20 × ($8M + $5.333M) = 0.20 × $13.333M = **$2.667M** ✔. Consistent.
- **Interpretation:** the 50/50 catch-up requires **$5.33M** of distributions to run through the catch-up tier (vs $2.0M for 100% catch-up) and the LP receives $2.667M of it. The GP reaches the same 20%-of-pref+catchup target, but it took more distributions and the LP got paid alongside — slower, more LP-favorable. Beyond the catch-up the residual splits 80/20 either way.

**Takeaway for interviews:** the **catch-up speed** (100% vs split) does **not** change the *final* GP carry % if the fund earns enough to complete a full catch-up plus residual — it changes **timing** and the **breakeven profit** needed before the GP reaches full 20%. (At lower profit levels, a partial/capped catch-up leaves the GP below 20%.)

---

### Example C — American (deal-by-deal) waterfall that triggers a clawback

**Setup.** $100M fund, two equal deals of $50M each. 8% pref (simplified to $4M per deal = 8% of $50M), 20% carry, 100% catch-up, **American** (carry paid per deal as realized).

**Deal 1 (early winner): exits for $90M.**
- Profit = $90M − $50M = $40M.
- ROC to LP: $50M. Pref to LP: $4M. Catch-up to GP: $4M × 0.25 = **$1.0M**. Residual = $90M − $50M − $4M − $1M = $35M → 80/20 = $28M LP / **$7.0M GP**.
- **GP carry from Deal 1 = $1.0M + $7.0M = $8.0M** (= 20% of $40M profit ✔). GP takes this cash now.

**Deal 2 (later loser): exits for $30M.**
- Loss: $30M − $50M = **−$20M**. LP gets the $30M back (still $20M short of capital on this deal). GP earns **$0** carry.

**Whole-fund reality at wind-down:**
- Total distributed = $90M + $30M = $120M. Total capital = $100M. **Total fund profit = $20M.**
- GP *should* have earned 20% × $20M = **$4.0M**.
- GP *actually received* **$8.0M** (all from Deal 1).
- **Clawback = $8.0M − $4.0M = $4.0M** the GP must return.
- Also note LPs only got $120M − $8M(GP) = $112M, i.e., $12M of profit; after clawback LPs get $116M → $16M profit = 80% of $20M ✔.

**Lesson:** the American waterfall paid the GP carry on the winner *before* the loser resolved, overpaying by $4M — exactly the scenario clawback (and escrow) exists to fix. A **European** waterfall would have tested the whole $100M + pref first and paid the GP only $4M, no clawback needed.

---

### Example D — Management-fee schedule over a 10-year fund life

**Setup.** $500M committed capital. Investment period = years 1–5. **2.0%** on committed during the investment period. Post-investment period: **base switches to invested capital** AND rate steps down to **1.75%**. Assume invested (cost) capital still held declines as deals are realized.

| Year | Phase | Fee base | Rate | Fee base ($M) | Mgmt fee ($M) |
|---|---|---|---|---|---|
| 1 | Investment | Committed | 2.00% | 500 | 10.00 |
| 2 | Investment | Committed | 2.00% | 500 | 10.00 |
| 3 | Investment | Committed | 2.00% | 500 | 10.00 |
| 4 | Investment | Committed | 2.00% | 500 | 10.00 |
| 5 | Investment | Committed | 2.00% | 500 | 10.00 |
| 6 | Harvest | Invested cost | 1.75% | 450 | 7.875 |
| 7 | Harvest | Invested cost | 1.75% | 380 | 6.650 |
| 8 | Harvest | Invested cost | 1.75% | 300 | 5.250 |
| 9 | Harvest | Invested cost | 1.75% | 200 | 3.500 |
| 10 | Harvest | Invested cost | 1.75% | 100 | 1.750 |
| **Total** |  |  |  |  | **74.675** |

- **Lifetime management fees ≈ $74.7M** on $500M committed = **~14.9% of commitments** over 10 years (≈ 1.49%/yr average — note the *effective* annual rate is well below the headline 2% because of the step-down + shrinking base).
- **Effect of offsets:** if the GP collected, say, $5M of monitoring/transaction fees over the life and applies a 100% ILPA offset, lifetime net fees fall to **~$69.7M**.
- **Quiz hook:** Year-1 fee = 2% × $500M = **$10M**; Year-8 fee = 1.75% × $300M invested = **$5.25M**. The decline is driven by *both* the rate step-down and the base switch.

---

### Example E — Gross-to-net return bridge

**Setup.** $500M fund. Over its life it generates **gross proceeds of $1,000M** on $500M invested → **Gross MOIC = 2.00x**. Costs: lifetime management fees $75M (from Ex. D, rounded), fund/org expenses $15M, and carry. 8% pref, 20% carry, 100% catch-up, European.

**Step 1 — Capital effectively at work / profit before carry.**
- Gross profit before fees = $1,000M − $500M = $500M.
- Less management fees $75M and expenses $15M = **$410M** profit available before carry. Net proceeds before carry = $500M capital + $410M = $910M.

**Step 2 — Waterfall on the $910M (European).**
- ROC: $500M to LP. Cumulative $500M.
- Pref (illustratively $90M ≈ 8% compounded over the life on drawn capital): $90M to LP. Cumulative $590M.
- GP catch-up (100%) = $90M × 0.25 = **$22.5M** to GP. Cumulative $612.5M.
- Residual = $910M − $612.5M = $297.5M → 80/20 = **$238.0M LP / $59.5M GP**.
- **GP carry total = $22.5M + $59.5M = $82.0M.** Check vs 20% of profit-after-fees ($410M): 20% × $410M = **$82.0M** ✔.

**Step 3 — Net to LP.**
- LP receives $500M + $90M + $238.0M = **$828.0M**.
- (Equivalently: $910M total net-of-fee proceeds − $82M carry = $828M ✔.)

**Bridge / drag:**
| Line | $M | MOIC |
|---|---|---|
| Gross proceeds | 1,000.0 | 2.00x gross |
| − Management fees | (75.0) |  |
| − Fund expenses | (15.0) |  |
| − Carried interest | (82.0) |  |
| **Net to LP** | **828.0** | **1.656x net** |

- **Fee/carry drag on multiple ≈ 2.00x − 1.656x = 0.344x** (about 17% of gross — within the typical 10–20% range).
- If gross IRR were ~18%, a drag of ~4–6 points would put **net IRR ≈ 12–14%** — illustrating the typical 3–8 point spread.

---

### Example F — Simple clawback computation (European fund, interim overpay)

**Setup.** A European fund made an **interim** carry distribution after strong early realizations, then later marks/losses reduce lifetime profit. Lifetime: capital $200M, total distributions $260M → **total profit $60M**. The GP had received **$16M** of carry on interim distributions (when projected profit looked like $80M → 20% = $16M).

- Correct lifetime carry = 20% × $60M = **$12M.**
- **Clawback = $16M − $12M = $4.0M** returned by the GP.
- If the GP paid 25% tax on the $16M carry ($4M tax), the **net-of-tax cap** allows the GP to repay at most $12M of after-tax retained carry; here the $4M clawback is well within that cap, so the GP repays the full **$4.0M**.
- Had a **20% escrow/holdback** been in place, $3.2M (20% × $16M) would already be sitting in escrow, covering most of the $4M without needing a cash call on the GP principals.

---

### Quick cross-check table (full-catch-up funds always net to 20% of profit)

| Example | Total profit | GP carry $ | GP % of profit | LP net MOIC |
|---|---|---|---|---|
| A | $60M | $12M | 20.0% | 1.48x |
| C (post-clawback) | $20M | $4M | 20.0% | 1.16x |
| E | $410M (after fees) | $82M | 20.0% | 1.656x |

---

## 5. Glossary

| Term | Definition |
|---|---|
| Management fee | Annual fee (often ~1.5–2%) paid to the GP to run the fund; billed on committed then invested capital. |
| Committed capital | Total LPs have legally pledged to a fund, drawn or not. |
| Invested capital (cost basis) | Cost of portfolio still held; common post-investment-period fee base. |
| Investment period | Initial ~3–5 years when the GP deploys capital; fee usually on committed capital. |
| Step-down | Post-investment-period reduction in fee rate and/or switch of fee base. |
| Fee offset (offset percentage) | Credit of portfolio-company fees (transaction/monitoring/director) against the management fee; ILPA standard = 100%. |
| Management fee waiver | Tax-driven waiver of fees in exchange for a priority profit interest (distinct from offset). |
| Carried interest (carry) | GP's share of fund profits, typically 20%. |
| Hurdle rate / preferred return (pref) | Minimum LP compound return (typically 8%) before GP earns carry. |
| Hard hurdle | GP earns carry only on profit above the hurdle (no catch-up). |
| Soft hurdle | Once hurdle met, GP earns carry on all profit via catch-up (PE standard). |
| GP catch-up | Tier where the GP receives a run of distributions to reach its target carry % of profit. |
| 100% catch-up | Catch-up tier sends 100% of distributions to GP until caught up. |
| Partial / split catch-up | Catch-up tier shares distributions (e.g., 50/50) — slower, LP-favorable. |
| Full catch-up | Brings GP to its full carry % of total profit. |
| Catch-up gross-up factor | `c/(1−c)`; multiplies pref to get the 100%-catch-up GP amount (0.25 for 20% carry). |
| Distribution waterfall | Ordered rules allocating fund cash between LPs and GP. |
| Return of capital (ROC) | Tier 1: LPs get their invested capital back first. |
| Residual / carry split | Tier 4: remaining profit split (e.g., 80/20). |
| European waterfall | Whole-fund: no carry until LPs get all capital + pref fund-wide. |
| American waterfall | Deal-by-deal: GP can earn carry as each deal exits. |
| Clawback / GP giveback | GP returns excess carry if ultimately overpaid relative to bargained share. |
| Escrow / holdback | Portion of carry (~20–30%) retained to secure clawback obligations. |
| Net-of-tax cap | Clawback limited to carry net of taxes the GP already paid. |
| GP commitment | GP's own capital in the fund (commonly 1–5% of commitments). |
| Vesting | Schedule over which GP team members earn their carry. |
| Gross return (IRR/MOIC) | Performance before fees and carry. |
| Net return (IRR/MOIC) | Return to LPs after fees, expenses, and carry. |
| Fee drag | Reduction from gross to net return due to fees/carry (~3–8 pts IRR). |
| Fund-of-funds (FoF) | Fund investing in other funds; charges its own fee/carry on top (double layer). |
| Sleeve | A strategy bucket within a program (primaries, secondaries, co-investments) with its own economics. |
| Primaries | Commitments to new/blind-pool funds at first close — lowest FoF carry (often 0–5%). |
| Co-investment | LP invests directly in a deal alongside a GP, usually no fee / no carry. |
| Secondaries | Purchases of existing fund interests (LP-led) or GP-led continuation deals. |
| MOIC | Multiple on Invested Capital = total value ÷ invested. |
| TVPI / DPI / RVPI | Total Value / Distributions / Residual Value to Paid-In (see Q04). |
| Two and twenty | Shorthand for 2% management fee + 20% carry. |
| Compounding pref | Pref accrues on prior unpaid pref (cumulative), most common method. |

---

## 6. Flashcard-worthy Q&A

1. **Q:** What does "2 and 20" mean? **A:** ~2% annual management fee + 20% carried interest.
2. **Q:** What is the fee base during the investment period? **A:** Committed capital.
3. **Q:** What is the fee base after the investment period (typically)? **A:** Invested capital (cost basis), often at a stepped-down rate.
4. **Q:** What is a fee offset and ILPA's standard? **A:** Crediting portfolio-company fees against the management fee; ILPA = 100% offset.
5. **Q:** Typical carry percentage? **A:** 20% of profits.
6. **Q:** Typical preferred return? **A:** 8% per annum, usually compounding.
7. **Q:** Hard vs soft hurdle? **A:** Hard = carry only on profit above hurdle; soft = carry on all profit once hurdle met (via catch-up).
8. **Q:** Name the four waterfall tiers in order. **A:** Return of capital → preferred return → GP catch-up → carry split.
9. **Q:** What is the 100% catch-up GP amount formula? **A:** Pref × c/(1−c); for 20% carry = Pref × 0.25.
10. **Q:** For an $8M pref and 20% carry, what's the 100% catch-up to the GP? **A:** $2.0M.
11. **Q:** What does the catch-up "catch up" to? **A:** The GP's target % (e.g., 20%) of *total* profit (pref + catch-up + residual), under the standard convention.
12. **Q:** European waterfall — when does the GP get carry? **A:** Only after LPs receive all capital + pref across the entire fund.
13. **Q:** American waterfall — when does the GP get carry? **A:** Deal-by-deal, as each investment exits and clears its ROC + pref.
14. **Q:** Which do LPs prefer and why? **A:** European — capital protection, deferred GP carry, minimal clawback risk.
15. **Q:** What triggers a clawback? **A:** GP ultimately received carry exceeding its bargained share (e.g., >20% of lifetime profit) or LPs didn't get full capital+pref.
16. **Q:** Under which waterfall is clawback most likely? **A:** American (deal-by-deal).
17. **Q:** What secures clawback obligations? **A:** Escrow/holdback (~20–30% of carry) and GP personal guarantees; capped net of tax.
18. **Q:** Gross vs net return? **A:** Gross = before fees/carry; net = what the LP keeps after fees, expenses, carry.
19. **Q:** Typical gross-to-net IRR spread? **A:** ~3–8 percentage points (drag widens with stronger performance).
20. **Q:** Why are FoF fees criticized? **A:** Double layer — FoF fee/carry on top of underlying funds' fees/carry.
21. **Q:** FoF carry by sleeve? **A:** Primaries lowest (often 0–5%); secondaries/co-investments higher (5–10%).
22. **Q:** How are LP co-investments typically priced? **A:** Often no management fee, no carry — blends down program cost.
23. **Q:** Does a partial catch-up change the GP's final carry %? **A:** No (if profit is high enough to complete it) — only the timing/breakeven; at low profit it can leave the GP below 20%.
24. **Q:** What is the GP commitment? **A:** GP's own capital in the fund (≈1–5%), separate from carry.

---

## 7. Interview Questions & Model Answers

1. **"Walk me through a distribution waterfall."**
   *Cash returns flow through four ordered tiers. First, return of capital — LPs get 100% of distributions until they've recovered all contributed capital. Second, preferred return — LPs receive their accrued pref, typically 8% compounded. Third, GP catch-up — in a 100% catch-up the GP receives 100% of distributions until it has caught up to its target carry, e.g., 20% of total profit; with 20% carry and an $8M pref that's $8M × 0.25 = $2M. Fourth, the residual splits 80/20. I'd verify by checking the GP ends with 20% of total profit.*

2. **"European vs American waterfall — what's the difference and which do LPs prefer?"**
   *European is whole-fund: no GP carry until LPs recover all capital plus pref across the entire fund. American is deal-by-deal: the GP earns carry as each deal exits. LPs prefer European — it protects capital, defers GP carry, and almost eliminates clawback risk. GPs like American for earlier cash flow. European dominates PE and is ILPA's model default.*

3. **"What is a catch-up and why does it exist?"**
   *It's the tier that reconciles a soft hurdle. The pref is paid 100% to LPs first; the catch-up then gives the GP a run of distributions so that, across pref + catch-up, the GP holds its target carry % of that profit — so the GP ultimately earns 20% of all profit, not just profit above 8%. Formula for a 100% catch-up: pref × c/(1−c).*

4. **"Show me the catch-up math for an 8% pref and 20% carry."**
   *Catch-up = pref × 0.20/0.80 = pref × 0.25. On an $8M pref, the GP gets $2M in the catch-up tier; then 80/20 on the residual. Check: $2M / ($2M+$8M) = 20%.*

5. **"How does a clawback work and when does it trigger?"**
   *At wind-down (or interim), if the GP's cumulative carry exceeds 20% of lifetime profit — or LPs are short of capital+pref — the GP repays the excess. It's most common under American waterfalls where early winners pay carry before later losers resolve. It's secured by escrow/holdbacks and GP guarantees and capped net of tax.*

6. **"Why does the management-fee base change over the fund's life?"**
   *During the investment period the fee is on committed capital to fund deployment; afterward it steps down — lower rate and/or a switch to invested capital — because the GP shifts from deploying to monitoring/harvesting and the base shrinks as deals exit. Net effect: a declining fee profile.*

7. **"What's a fee offset and what's ILPA's position?"**
   *Portfolio-company fees the GP collects (transaction, monitoring, director) are credited against the management fee. ILPA's standard is a 100% offset so those economics flow back to LPs.*

8. **"Walk me through a gross-to-net bridge."**
   *Start with gross proceeds; subtract management fees, fund expenses, and carried interest to get net distributions to LPs. The spread is fee drag — typically 3–8 points of IRR and ~10–20% of the multiple, widening with performance because carry scales with profit. As an LP analyst, I'd rebuild this from the LPA to validate the GP's net numbers.*

9. **"A fund-of-funds invests in primaries, secondaries, and co-investments — how do the economics differ across sleeves?"**
   *There's a double fee layer at the FoF level. To keep that reasonable, carry differs by sleeve: primaries carry is lowest, often 0–5%, since the LP already pays the underlying GP; secondaries and co-investments carry more, ~5–10%, reflecting active underwriting. Direct GP co-invests offered to LPs are usually no-fee/no-carry, which blends the program cost down.*

10. **"Hard vs soft hurdle — which is more GP-favorable?"**
   *Soft hurdle is more GP-favorable: with a catch-up the GP earns carry on all profit once 8% is cleared. A hard hurdle limits carry to profit above 8% with no catch-up — better for LPs. PE typically uses soft hurdles with a full catch-up.*

11. **"If a fund returns 1.5x gross, roughly what's the net multiple?"**
   *Depends on fees/carry, but net typically lands ~10–20% below gross, so maybe ~1.3–1.35x net. Profit is $0.5 per $1; management fees plus 20% carry on profit take a meaningful chunk. I'd reconstruct the waterfall to be precise.*

12. **"Does a 50/50 catch-up change the GP's ultimate take?"**
   *Not the final percentage if the fund earns enough to complete the catch-up plus residual — the GP still reaches 20% of total profit. It changes timing: more distributions must run through the catch-up tier and LPs get paid alongside, so it's more LP-friendly and raises the profit threshold at which the GP hits a full 20%.*

13. **"As an LP, what waterfall and fee terms would you push for?"**
   *Whole-fund (European) waterfall, 8% compounding pref, 100% fee offset, fee step-down with a base switch to invested capital, escrow/holdback on carry with a net-of-tax clawback and GP guarantees, and clear management-fee step-downs. These align with ILPA principles and protect LP capital.*

---

## 8. Common Pitfalls & Nuances

- **Catch-up base convention.** The most common mistake. "20% catch-up" usually means 20% of **total** profit (pref + catch-up + residual), giving `catch-up = pref × c/(1−c)`. Some agreements compute it as 20% of the **LP's** profit, which yields a different number. **Always read the LPA.** (Flagged in Sources.)
- **Calling the residual split "the catch-up."** The catch-up (Tier 3, often 100% to GP) is distinct from the Tier 4 residual 80/20 split. They're sometimes conflated in loose explainers.
- **"80/20 catch-up" ambiguity.** If "80/20 catch-up" means the GP gets only 20% of the catch-up tier (g = c), the GP can never catch up — it's effectively *no* catch-up / a hard hurdle. People often mean a 50/50 *partial* catch-up. Clarify.
- **Pref on committed vs contributed capital.** Pref usually accrues on **contributed (drawn)** capital and unreturned amounts, not full commitments — be precise.
- **Compounding vs IRR vs simple hurdle.** Three different computations; ~50% compounding, ~38% IRR, ~12% simple. They give different pref balances.
- **Fee base confusion.** Don't assume a flat 2% for 10 years. Step-downs + base switch make the *effective* lifetime rate well below the headline (Ex. D: ~1.49%/yr).
- **Forgetting offsets.** Headline management fee overstates LP cost if a 100% offset applies and the GP collects portfolio-company fees.
- **Clawback timing & net-of-tax cap.** Clawback is usually tested at wind-down (or interim true-ups), and the GP repays at most carry **net of taxes** already paid — so LPs may not be made fully whole without escrow.
- **European ≠ no clawback ever.** Interim distributions in a European fund can still over-distribute carry if later marks fall — hence escrow even in whole-fund structures (Ex. F).
- **Gross-to-net widens with performance.** Because carry is a % of profit, better gross returns produce a *larger* (not smaller) gross-to-net gap.
- **FoF double-counting.** When quoting a FoF's net return, remember LPs bear *both* layers; the FoF's own carry by sleeve materially affects all-in cost.
- **Co-investment "free" isn't entirely free.** No fee/no carry direct co-invests still carry adverse-selection and concentration risk; "fee-free" refers to explicit economics only.

---

## 9. Sources

1. **Corporate Finance Institute — Distribution Waterfall** — https://corporatefinanceinstitute.com/resources/equities/distribution-waterfall/ — four-tier structure, definitions. Reliable educational reference. (WebFetch 403; used as search-excerpt.)
2. **Moonfare — Distribution Waterfalls Explained** — https://www.moonfare.com/glossary/distribution-waterfall — tiers, LP/GP mechanics. Reliable practitioner explainer.
3. **A Simple Model — Private Equity Catch-Up Calculation** — https://www.asimplemodel.com/insights/private-equity-catch-up-calculation — catch-up gross-up `pref/(1−carry)×carry` ($80/(1−0.20))×0.20 = $20). Strong worked-math source. (403 on fetch; formula confirmed via excerpt + first-principles.)
4. **A Simple Model — Distribution Waterfall / Carried Interest for a $500M Fund** — https://www.asimplemodel.com/insights/distribution-waterfall ; https://www.asimplemodel.com/insights/carried-interest-for-a-500m-private-equity-fund — modeling walkthroughs. Reliable.
5. **Allvue Systems — American vs European Waterfall** — https://www.allvuesystems.com/resources/american-vs-european-waterfall/ — European vs American mechanics, clawback. Reliable industry software vendor.
6. **iCapital — Understanding Private Market Fund Distribution Waterfalls** — https://icapital.com/insights/private-equity/understanding-private-market-fund-distribution-waterfalls/ — tiers, catch-up. Reliable.
7. **Allen Latta — LP Corner: Carried Interest, Preferred Return and GP Catchup** — http://www.allenlatta.com/allens-blog/lp-corner-fund-terms-carried-interest-preferred-return-and-gp-catchup — LP-perspective catch-up math. Highly reliable LP-focused source.
8. **Umbrex — GP Catch-Up** — https://umbrex.com/resources/private-equity-glossary/gp-catch-up/ — 100% vs partial catch-up. Reliable glossary.
9. **Rundit — Comprehensive Guide to Catch-Up Period** — https://rundit.com/blog/a-comprehensive-guide-to-catch-up-period-in-private-equity/ — catch-up worked examples. Practitioner blog.
10. **Wikipedia — Distribution waterfall** — https://en.wikipedia.org/wiki/Distribution_waterfall — documents the **two catch-up base conventions** (proportion of LP profit vs proportion of total profit). Useful for the convention flag below.
11. **Goodwin — How Different Funds Approach Hurdle Rate Calculations** — https://www.goodwinlaw.com/en/insights/publications/2024/01/insights-otherindustries-pif-how-different-funds-approach-hurdle-rate-calculations — hurdle method split (50% compounding / 38% IRR / 12% drawn). Highly reliable (law firm + fund-terms database).
12. **Carta — Hurdle Rate; Management Fees; Carried Interest** — https://carta.com/learn/private-funds/management/carried-interest/hurdle-rate/ ; https://carta.com/learn/private-funds/management/management-fees/ — fee bases, step-downs, hurdle. Reliable.
13. **ILPA Principles 3.0** — https://ilpa.org/wp-content/uploads/2019/06/ILPA-Principles-3.0_2019.pdf — 100% fee offset standard, whole-fund waterfall preference, escrow guidance. Authoritative (LP standard-setter).
14. **ILPA Reporting Template Guidance (Jan 2025)** — https://ilpa.org/wp-content/uploads/2025/01/ILPA-Reporting-Template-v.-2.0-Suggested-Guidance.pdf — fee/offset/rebate disclosure categories (effective 2026). Authoritative.
15. **Duane Morris — PE Fund Distribution Waterfalls; Clawbacks and Investor Givebacks** — https://www.duanemorris.com/site/static/private_equity_fund_distribution_waterfalls.pdf ; https://www.duanemorris.com/site/static/private_equity_funds_clawbacks_and_investor_givebacks.pdf — legal mechanics of waterfall + clawback, net-of-tax cap, escrow. Highly reliable (law firm). (403 on fetch.)
16. **Ropes & Gray — Navigating the Private Equity Waterfall** — https://www.ropesgray.com/en/insights/viewpoints/102lxav/dont-slip-navigating-the-private-equity-waterfall — waterfall nuances. Highly reliable (law firm).
17. **Wall Street Prep — Distribution Waterfall; Fund of Funds** — https://www.wallstreetprep.com/knowledge/distribution-waterfall/ ; https://www.wallstreetprep.com/knowledge/fund-of-funds-fof/ — worked examples, FoF double-layer. Reliable training provider.
18. **Callan — 2024 Private Equity Fees and Terms Study** — https://www.callan.com/blog/2024-private-equity-fees/ — current fee/term benchmarks. Reliable institutional consultant.
19. **Meketa — Private Markets Fees Primer** — https://meketa.com/wp-content/uploads/2012/10/Private-Markets-Fees-Primer-FINAL.pdf — fee structures, FoF layering. Reliable consultant.
20. **PrivateEquityBro — FoF Fees; Fee Structure; Waterfall** — https://privateequitybro.com/funds-of-funds-fof-insights-into-management-fees/ ; https://privateequitybro.com/private-equity-fee-structure/ — carry-by-sleeve (primaries 0–5%, secondaries/co-invest 5–10%). Practitioner blog; corroborated by FoF sources.
21. **Cambridge Associates — Six Things to Know About Co-investments** — https://www.cambridgeassociates.com/insight/six-things-to-know-about-co-investments/ — no-fee/no-carry co-invest norms. Highly reliable consultant.
22. **AJG — The Case for PE Co-Investment Funds** — https://www.ajg.com/.../the-case-for-private-equity-co-investment-funds.pdf — co-investment-fund fees (~1.0% mgmt, 10–12.5% carry, 8% hurdle). Reliable.
23. **AnalystPrep — CFA L1: Investment & Compensation Structures** — https://analystprep.com/cfa-level-1-exam/alternative-investments/investment-and-compensation-structures-in-alternative-investments/ — exam-grade definitions (hurdle, catch-up, clawback, high-water mark). Reliable curriculum aligned.
24. **Transacted — Gross IRR vs Net IRR; Linnovate; ValueBridge** — https://www.transacted.io/gross-irr-vs-net-irr ; https://linnovatepartners.com/private-equity-performance-metrics-you-need-to-know/ — gross-to-net spread (~3–8 pts), net MOIC ~10–20% below gross. Reliable.
25. **Neuberger Berman press / NB CrossRoads / NB Private Markets Access Fund** — https://www.nb.com/ (various releases) ; https://www.tenderofferfunds.com/fund-launch-nb-crossroads-private-markets-vii/ — NB's primaries/co-invest/secondaries allocation (~55–75% primaries) and $125B+ private-markets scale. Reliable (issuer/primary).

### Convention disagreements flagged
- **Catch-up base (Source 10 vs most explainers):** the GP's catch-up target can be defined as a % of **total** profit (standard; used in all Section 4 examples) **or** as a % of the **LP's** profit. They produce different catch-up amounts. Confirm in each LPA. The math in this report uses the **total-profit** convention and notes the gross-up factor `c/(1−c)`.
- **"80/20 catch-up" terminology:** can mean a *slow* 50/50-type partial catch-up, or be misused to mean "no catch-up." If the GP's share of the catch-up tier equals the carry rate, no catch-up is mathematically possible (Example B(ii)).
- **Hurdle computation method (Source 11):** compounding vs IRR vs % drawn — materially different pref balances; ~50/38/12 split.

---

*End of Q03 reference report.*
