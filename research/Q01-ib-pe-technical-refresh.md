# Q01 — IB/PE Technical Refresher

## 0. Metadata
- **Domain:** technicals
- **Last researched:** 2026-06-03
- **Scope:** Foundational IB/PE technical knowledge an incoming PE (LP / fund-investing — Primaries & Co-investments) analyst must have cold: (1) accounting & the 3-statement linkage, (2) valuation (comps, precedents, EV vs equity value), (3) DCF, (4) LBO **concepts** (returns drivers, sources & uses, candidate screening, basic return math), and (5) the canonical interview technicals.
- **Intentionally excluded:** The full, step-by-step mechanical LBO build (debt tranching, cash sweep, PIK toggles, circularity/interest schedules, full returns waterfall) — **cross-reference Q08 for the full LBO build**. This report keeps LBO *conceptual but rigorous*. Also excluded: fund-level math (LP economics, J-curve, DPI/TVPI, carry/waterfall), which belongs to the LP-specific reports.
- **Verification note:** Every formula below was cross-checked against ≥2 independent authoritative sources (Wall Street Prep, Corporate Finance Institute, Damodaran/NYU Stern, Breaking Into Wall Street / Mergers & Inquisitions, Macabacus). Sources are numbered in §9; disagreements are flagged inline.

---

## 1. Executive Summary (TL;DR)

- **The 3 statements link through 3 anchor lines:** Net income (IS) → top of the Cash Flow Statement and into Retained Earnings (BS); ending cash (CFS) → Cash line (BS); and the BS must balance (Assets = Liabilities + Equity). Master the "$10 of depreciation" flow-through and you can answer most accounting questions.
- **Accrual ≠ cash.** The IS recognizes revenue/expenses when *earned/incurred*; the CFS converts accrual net income back to cash by adding non-cash charges (D&A, SBC) and adjusting for working-capital and other timing differences.
- **Working capital is a use/source of cash:** an *increase* in a working-capital **asset** (e.g., receivables, inventory) *uses* cash; an *increase* in a working-capital **liability** (e.g., payables) *provides* cash. Growth typically ties up cash in NWC.
- **Deferred taxes** arise from timing differences between book and tax accounting (classic driver: accelerated tax depreciation vs. straight-line book depreciation), creating a **DTL** (you'll pay more tax later) or **DTA** (you'll pay less later, e.g., NOLs).
- **Enterprise Value (EV)** is capital-structure-neutral and represents the value of the **core operating business** to **all** capital providers. **Equity Value** is what's left for common shareholders. The bridge: **EV = Equity Value + Net Debt + Preferred + Minority Interest − Non-operating assets**.
- **Match the multiple to the metric:** EV-based multiples (EV/EBITDA, EV/Revenue, EV/EBIT) pair with pre-interest metrics; equity-based multiples (P/E) pair with post-interest metrics (net income/EPS). Never put net debt in the EV numerator over an equity metric or vice versa.
- **EV/EBITDA** is the M&A workhorse (capital-structure & D&A-policy neutral, proxy for cash flow). **EV/Revenue** is used for high-growth / unprofitable companies. **P/E** is simple and equity-holder-focused but distorted by leverage, D&A, and one-time items.
- **Precedent transactions** generally price **higher than trading comps** because they include a **control premium** and **synergies**; comps reflect minority/public-market "where-it-trades-today" pricing.
- **DCF in one breath:** project **unlevered FCF** for 5–10 years → discount at **WACC** → add a **terminal value** (Gordon growth or exit multiple) discounted back → sum = **Enterprise Value** → bridge to **equity value** → divide by shares for implied price.
- **Unlevered FCF = EBIT × (1 − tax) + D&A − CapEx − ΔNWC.** It's *unlevered* (pre-financing), so it's discounted at **WACC** and yields **enterprise value**. Levered FCF (FCFE) is post-interest, discounted at **cost of equity**, yields **equity value**. **Matching the cash flow to the right discount rate is the #1 DCF rule.**
- **WACC** blends after-tax cost of debt and CAPM cost of equity by market-value weights. **Cost of equity (CAPM) = Rf + β × ERP.**
- **Terminal value usually is 60–80% of DCF value** — it dominates, so the perpetuity growth rate (typically ~2–3%, ≤ long-run GDP/inflation) and exit multiple are the most scrutinized assumptions.
- **Why LBOs work (3 levers):** (1) **EBITDA growth** (revenue + margin), (2) **debt paydown / deleveraging** (FCF reduces debt, transferring enterprise value to equity), and (3) **multiple expansion** (exit at a higher multiple than entry). Returns are amplified by **leverage**.
- **A good LBO candidate** has **stable, predictable cash flows**, **low CapEx/working-capital needs**, a **defensible market position / recurring revenue**, **low existing leverage / debt capacity**, **strong management**, and **clear exit options**.
- **Two firms with identical earnings can have very different P/E** because P/E reflects **growth, risk, and capital structure**, not just current earnings — higher expected growth and lower risk command a higher multiple.

---

## 2. Core Concepts (lesson-ready, in depth)

### 2.A Accounting Fundamentals

#### The three statements and what each does
- **Income Statement (IS):** Profitability over a *period*. Revenue − COGS = Gross Profit; less operating expenses (SG&A, R&D, D&A) = **EBIT** (operating income); less net interest = pre-tax income (EBT); less taxes = **Net Income**. It is prepared on an **accrual** basis.
- **Balance Sheet (BS):** A *snapshot* at a point in time. **Assets = Liabilities + Shareholders' Equity** must always hold. Assets = what the company owns (cash, AR, inventory, PP&E, goodwill); Liabilities = what it owes (AP, accrued expenses, debt, DTLs); Equity = residual owners' claim (common stock/APIC, retained earnings, treasury stock).
- **Cash Flow Statement (CFS):** Reconciles accrual net income to the actual change in cash over the period. Three sections: **Cash Flow from Operations (CFO)**, **from Investing (CFI)**, **from Financing (CFF)**. Sum = net change in cash for the period.

#### How they link (the core mechanics)
Under the **indirect method** (used in modeling and interviews):
1. **Net income** from the bottom of the IS flows to the **top of the CFS**.
2. CFS **adds back non-cash charges** (D&A, stock-based comp, impairments, deferred taxes) and **adjusts for changes in working capital** to arrive at **CFO**.
3. **CFI** captures CapEx (outflow), acquisitions/divestitures, and purchases/sales of investments.
4. **CFF** captures debt issuance/repayment, equity issuance/buybacks, and dividends paid.
5. **Net change in cash** (CFO + CFI + CFF) updates the **Cash line on the BS** (prior cash + net change = ending cash).
6. **Net income** (less dividends) flows into **Retained Earnings** on the BS.
7. Other CFS/IS items update their corresponding BS accounts (CapEx and D&A drive **PP&E**; debt issuance/repayment drives **debt**; working-capital changes drive AR/inventory/AP, etc.).
8. Because every change is captured, the **BS balances**.

> The three "anchor" links to memorize: **(a) NI → CFS top & → Retained Earnings; (b) ending cash from CFS → BS Cash; (c) BS balances because every cash and non-cash change is reflected.**

#### Cash vs. accrual accounting
- **Accrual:** Recognize revenue when **earned** and expenses when **incurred**, regardless of when cash moves (matching principle). This is GAAP/IFRS for most companies. Example: a credit sale books revenue and a receivable now; cash arrives later.
- **Cash basis:** Recognize only when cash actually changes hands. Simpler, but distorts performance timing. The CFS exists precisely to translate accrual results into cash reality.

#### Working capital mechanics
- **Operating (net) working capital** ≈ (current operating assets) − (current operating liabilities), typically **AR + Inventory + Prepaids − AP − Accrued expenses − Deferred revenue**. (Cash and short-term debt are usually excluded because they're financing, not operating.)
- **Cash-flow sign convention (critical):**
  - **↑ in a current asset** (AR, inventory) = **use of cash** (negative CFO adjustment) — cash is tied up.
  - **↓ in a current asset** = **source of cash**.
  - **↑ in a current liability** (AP, accruals, deferred revenue) = **source of cash** (positive CFO adjustment) — you're holding others' cash.
  - **↓ in a current liability** = **use of cash**.
- **Intuition:** Growing companies usually have a **net investment in working capital** (more AR/inventory than AP), which consumes cash. Negative working-capital businesses (e.g., subscription/prepaid, some retail) are **funded by customers/suppliers** and generate cash as they grow.

#### Deferred taxes
- Arise from **temporary timing differences** between **book** income (GAAP) and **taxable** income (tax code).
- **Deferred Tax Liability (DTL):** Book income > taxable income now → you pay *less* cash tax now but *more* later. Classic cause: **accelerated depreciation for tax** vs. **straight-line for book** — in early years tax depreciation is higher, taxable income lower, cash taxes lower; the DTL builds, then **reverses** as the asset ages.
- **Deferred Tax Asset (DTA):** Book income < taxable income now (you pay *more* now, less later) → future benefit. Classic causes: **net operating loss (NOL) carryforwards**, warranty/bad-debt reserves, deferred revenue taxed before booked.
- On the CFS, an **increase in DTL is a non-cash add-back** (cash taxes were lower than book taxes); a decrease is a subtraction.

---

### 2.B Valuation

#### The three primary methodologies
1. **Trading Comparables ("comps"):** Value the company off the **current trading multiples** of similar **public** companies. Reflects *minority, public-market* pricing as of today. Pros: market-based, current, simple. Cons: no two companies are identical; markets can be mispriced; reflects no control premium.
2. **Precedent Transactions ("deal comps"):** Value off multiples **paid in past M&A deals** for similar companies. Reflects *control* value. Pros: based on real prices buyers actually paid, includes **control premium and synergies**. Cons: data can be stale/incomplete, deal-specific dynamics, synergies inflate multiples → **precedents usually yield higher values than trading comps.**
3. **Discounted Cash Flow (DCF):** Intrinsic value from projected cash flows (see §2.C). Pros: fundamentals-driven, not dependent on the market. Cons: highly sensitive to assumptions (WACC, growth, terminal value).
- **Football field:** A horizontal bar chart overlaying the **valuation ranges** from each methodology (52-week trading range, comps, precedents, DCF, LBO analysis) so you can triangulate a value range. (LBO analysis typically sets a "floor" — the price a financial sponsor could pay and still hit its return hurdle.)

#### Choosing the multiple
- **Match numerator to denominator by claim:**
  - **EV-based** multiples use a **capital-structure-neutral, pre-interest** denominator: **EV/EBITDA, EV/EBIT, EV/Revenue, EV/(EBITDA − CapEx), EV/FCF.**
  - **Equity-based** multiples use a **post-interest** denominator available to equity: **P/E (Price/EPS), P/B, P/FCFE.**
  - **Rule:** never divide EV by a metric that has had interest deducted (like net income), and never divide equity value by a pre-interest metric (like EBITDA). It must be apples-to-apples on *who has a claim*.
- **When each is appropriate:**
  - **EV/EBITDA** — the default M&A multiple. Neutral to capital structure (pre-interest) and D&A policy (pre-D&A); a reasonable proxy for operating cash flow. Best for capital-intensive, mature, profitable companies; allows comparison across firms with different leverage. *Weakness:* ignores CapEx and working-capital intensity differences.
  - **EV/EBIT** — like EV/EBITDA but captures D&A, so it's better when **CapEx/D&A intensity differs** materially across the comp set.
  - **EV/Revenue** — for **high-growth or unprofitable** companies (negative EBITDA/EPS make other multiples meaningless), early-stage tech/SaaS, or where margins are converging. *Weakness:* ignores profitability entirely.
  - **P/E** — simple and equity-holder-focused; common for banks/financials (where capital structure *is* the business and net interest income matters). *Weakness:* distorted by leverage, D&A policy, non-operating items, and one-time charges. Meaningless for negative earnings.

#### Enterprise Value vs. Equity Value (and the full bridge)
- **Equity Value (market cap):** value attributable to **common shareholders** = share price × fully diluted shares (use the **treasury stock method** for options/warrants).
- **Enterprise Value:** value of the **core operating business**, independent of how it's financed; the value to **all** providers of capital (debt, preferred, minority, common).
- **The bridge:**

  **EV = Equity Value + Total Debt + Preferred Stock + Minority (Non-Controlling) Interest − Cash & Cash Equivalents − Other Non-Operating Assets**

  (Total debt − cash = **net debt**, so EV = Equity Value + **Net Debt** + Preferred + Minority Interest − other non-operating assets.)

  Rearranged: **Equity Value = EV − Net Debt − Preferred − Minority Interest + Non-operating assets.**

- **Why each item:**
  - **+ Debt:** an acquirer must repay/assume it; it's a claim ahead of equity.
  - **− Cash:** cash is a non-operating asset; an acquirer effectively gets it back / nets it against the purchase price (hence net debt).
  - **+ Preferred stock:** senior claim with debt-like, fixed dividends and liquidation preference → treated like debt.
  - **+ Minority/Non-controlling interest:** when a parent **consolidates** a subsidiary it owns >50% of, the IS/EBITDA include **100%** of the sub. To keep the multiple consistent (EV numerator must reflect 100% of what EBITDA covers), add back the portion of the sub the parent doesn't own.
  - **− Non-operating assets** (e.g., equity investments/associates, NOLs, certain securities): they generate income/value not captured in core operating EBITDA, so strip them out of EV.

---

### 2.C Discounted Cash Flow (DCF)

#### Step-by-step (unlevered DCF — the standard)
1. **Project unlevered free cash flow (FCFF)** for an explicit horizon (usually 5–10 years).
2. **Determine WACC** (the blended required return of all capital providers).
3. **Discount each year's FCF** to present value using WACC (optionally with the **mid-year convention**).
4. **Estimate terminal value** (Gordon growth or exit multiple) and **discount it back**.
5. **Sum PVs of FCF + PV of terminal value = Enterprise Value.**
6. **Bridge EV → Equity Value** (subtract net debt, preferred, minority interest; add non-operating assets).
7. **Divide by fully diluted shares** → implied share price.
8. **Sensitize** (data tables) the output to WACC, growth/exit multiple.

#### Unlevered Free Cash Flow (FCFF)
**FCFF = EBIT × (1 − tax rate) + D&A − CapEx − Increase in Net Working Capital**

- Start from **EBIT** (pre-interest) → tax-effect it (**NOPAT** = EBIT×(1−t)) so the cash flow is *unlevered* (independent of capital structure).
- **Add back D&A** (non-cash).
- **Subtract CapEx** (real cash investment) and **subtract the increase in NWC** (cash tied up in the business). (Damodaran's equivalent compact form: FCFF = EBIT(1−t) − (CapEx − D&A) − ΔWC.)
- Because FCFF is the cash available to **all** investors, it is discounted at **WACC** and produces **enterprise value**. (Contrast: **FCFE / levered FCF** subtracts interest and net debt repayments, is discounted at **cost of equity**, and produces **equity value** directly.)

#### WACC and CAPM
**WACC = (E/V)·Re + (D/V)·Rd·(1 − t) + (P/V)·Rp**
- E, D, P = market values of equity, debt, preferred; V = E + D + P; weights are **market-value** based (target/optimal capital structure for forward-looking analysis).
- **Re = Cost of equity via CAPM:** **Re = Rf + β × (Rm − Rf)**, where (Rm − Rf) is the **equity risk premium (ERP)**.
  - **Rf** = risk-free rate (typically the 10-/20-year US Treasury yield).
  - **β** = levered beta = sensitivity of the stock's returns to the market. For private/segment valuation, **unlever** comparable betas and **relever** at the target's capital structure (Hamada: βL = βU·[1 + (1 − t)·D/E]).
  - **ERP** ≈ historical/implied equity premium (commonly ~4.5–6%; Damodaran publishes implied ERP).
- **Rd = pre-tax cost of debt** (yield on the company's debt / credit-spread-implied rate); **multiply by (1 − t)** because interest is tax-deductible (the **tax shield**).

#### Terminal Value (two methods)
- **Gordon Growth / Perpetuity Growth:** **TV = FCFₙ × (1 + g) / (WACC − g)**, where FCFₙ is final-year FCF and **g** is the perpetual growth rate. Constraint: **g must be modest** — at or below long-run GDP/inflation (commonly ~2–3%); g ≥ WACC breaks the formula (implies infinite value).
- **Exit Multiple:** **TV = Terminal-year EBITDA × Exit Multiple**, where the exit multiple comes from comps/precedents. More common in banking/LBO contexts because it ties to market reality.
- **Sanity check:** Always compute the **implied** perpetuity growth from the exit-multiple TV (and vice versa) to confirm both are reasonable. **TV is typically 60–80% of total DCF value**, so this assumption dominates.
- **Discount the TV back** using the **same period count as the final explicit year** (n, or n − 0.5 with mid-year convention).

#### Discounting & the mid-year convention
- **PV of a year-t cash flow = CFₜ / (1 + WACC)ᵗ.**
- **Mid-year convention:** assumes cash flows arrive **mid-year** (more realistic than year-end), so discount periods become **0.5, 1.5, 2.5, …** instead of 1, 2, 3, …. This **raises** present values (cash received sooner). For terminal value: with Gordon growth, the TV is discounted at the mid-year period (n − 0.5); with an exit multiple, treatment varies — many practitioners discount the exit-multiple TV at the **full** period n (since the multiple reflects a year-end sale). *(Sources note this exit-multiple nuance is a judgment call; flag in §8.)*

#### Sensitivity tables
- Two-variable **data tables** flex the most uncertain inputs — most often **WACC vs. terminal growth rate** (Gordon) or **WACC vs. exit multiple** — producing a grid/range of implied values that feeds the football field.

---

### 2.D LBO Basics (conceptual but rigorous)

> Full mechanical build is in **Q08**. Here: the economics, why returns happen, sources & uses, the return math, and candidate screening.

#### Why LBOs work — the three return levers
A financial sponsor buys a company using a mix of **debt** (typically 50–70%+ of the purchase price historically) and **equity**, then aims to sell in ~3–7 years at a higher equity value. Equity value is created by three levers:
1. **EBITDA growth** — grow revenue and expand margins (operational improvements). Often the **largest** contributor.
2. **Debt paydown / deleveraging** — use the company's FCF to pay down debt. Since **EV ≈ constant** at constant multiples, **every $1 of debt repaid converts to ~$1 of additional equity value** (equity = EV − net debt). This is why stable, cash-generative businesses are prized.
3. **Multiple expansion** — exit at a **higher EV/EBITDA multiple** than entry (e.g., buy at 8.0x, sell at 10.0x). Hard to control/underwrite; conservative sponsors assume **flat or contracting** multiples.
- **Leverage amplifies returns:** by funding most of the purchase with debt, the sponsor commits less equity, so a given dollar of equity-value creation is a larger *percentage* return. (It also amplifies downside risk.)

#### Sources & Uses
- **Uses (where money goes):** purchase the equity (purchase enterprise value), refinance/repay existing debt, pay transaction & financing fees, fund minimum cash.
- **Sources (where money comes from):** new **debt** (senior secured term loans/revolver first, then subordinated/high-yield/mezzanine), the sponsor's **equity** contribution (the plug/largest equity source), plus sometimes management rollover equity and excess cash on the balance sheet.
- **Sources must equal Uses.** The sponsor's required **equity = total uses − total debt raised − other sources.**

#### Basic return math
- **MOIC (Multiple of Invested Capital) = Exit Equity Value / Initial Equity Invested.**
- **IRR** = annualized return; for a single in/out cash flow: **IRR = MOIC^(1/n) − 1**, where n = holding-period years. (Rules of thumb: **2.0x over 3 yrs ≈ 26% IRR; 2.0x over 5 yrs ≈ 15%; 3.0x over 5 yrs ≈ 25%.**)
- **Exit equity value = Exit EBITDA × Exit multiple − Net debt at exit.**

#### What makes a good LBO candidate
- **Stable, predictable cash flows** (the #1 criterion — debt service is non-negotiable).
- **Recurring revenue / strong customer retention** (contracts, subscriptions) → predictability and debt capacity.
- **Low CapEx and low working-capital intensity** → more FCF available to service/pay down debt.
- **Defensible market position / moat**, non-cyclical demand, leading or consolidatable position.
- **Low existing leverage** (room to add debt) and a **strong, undervalued or improvable** asset.
- **Strong management team** able to execute the value-creation plan.
- **Clear, multiple exit options** (strategic sale, secondary buyout, IPO) and identifiable operational/financial upside.

---

## 3. Key Formulas & Definitions

| # | Formula | Definition of terms |
|---|---------|---------------------|
| F1 | **Assets = Liabilities + Shareholders' Equity** | The fundamental balance-sheet identity; must always hold. |
| F2 | **Ending Cash = Beginning Cash + CFO + CFI + CFF** | CFS reconciles to the BS cash line. |
| F3 | **Net Working Capital (operating) = (AR + Inventory + Prepaids) − (AP + Accruals + Deferred Rev.)** | Operating items only; excludes cash and debt. |
| F4 | **EBIT = Revenue − COGS − OpEx (incl. D&A)** | Operating income; pre-interest, pre-tax. |
| F5 | **EBITDA = EBIT + D&A** | Earnings before interest, taxes, depreciation & amortization; cash-flow proxy. |
| F6 | **NOPAT = EBIT × (1 − tax rate)** | Net operating profit after tax (unlevered after-tax operating profit). |
| F7 | **Unlevered FCF (FCFF) = EBIT×(1−t) + D&A − CapEx − ΔNWC** | Cash to *all* capital providers; discounted at WACC. |
| F8 | **Levered FCF (FCFE) = Net Income + D&A − CapEx − ΔNWC + Net Borrowing** | Cash to *equity* holders only; discounted at cost of equity. |
| F9 | **WACC = (E/V)·Re + (D/V)·Rd·(1−t) + (P/V)·Rp** | Blended after-tax required return; V = E+D+P (market values). |
| F10 | **Cost of Equity (CAPM): Re = Rf + β × (Rm − Rf)** | Rf = risk-free rate; β = levered beta; (Rm−Rf) = equity risk premium (ERP). |
| F11 | **After-tax Cost of Debt = Rd × (1 − t)** | Interest is tax-deductible → tax shield. |
| F12 | **Hamada (relever beta): βL = βU × [1 + (1 − t)·(D/E)]** | Adjust unlevered beta for target capital structure. |
| F13 | **PV = CFₜ / (1 + WACC)ᵗ** | Present value of a future cash flow (t = full-year period). |
| F14 | **Mid-year discount period = t − 0.5** | Assumes mid-year cash receipt; raises PV. |
| F15 | **TV (Gordon Growth) = FCFₙ × (1 + g) / (WACC − g)** | Perpetuity TV; g = perpetual growth (≤ long-run GDP). |
| F16 | **TV (Exit Multiple) = Terminal EBITDA × Exit Multiple** | Market-based TV. |
| F17 | **Enterprise Value (DCF) = Σ PV(FCFₜ) + PV(TV)** | Sum of discounted FCFs and terminal value. |
| F18 | **EV = Equity Value + Net Debt + Preferred + Minority Interest − Non-operating Assets** | The EV↔equity bridge. |
| F19 | **Net Debt = Total Debt − Cash & Equivalents** | Can be negative (net cash). |
| F20 | **Equity Value = Share Price × Fully Diluted Shares** | Use treasury stock method for options/warrants. |
| F21 | **EV/EBITDA, EV/EBIT, EV/Revenue** | EV-based (pre-interest) multiples. |
| F22 | **P/E = Share Price / EPS = Equity Value / Net Income** | Equity-based (post-interest) multiple. |
| F23 | **DTL ≈ (Book PP&E − Tax PP&E) × tax rate** | Deferred tax liability from depreciation timing differences. |
| F24 | **MOIC = Exit Equity Value / Equity Invested** | Multiple of invested capital. |
| F25 | **IRR (single flow) = MOIC^(1/n) − 1** | Annualized return over n years. |
| F26 | **Exit Equity Value = Exit EBITDA × Exit Multiple − Exit Net Debt** | LBO exit equity. |
| F27 | **Sources = Uses** | LBO funding identity; Sponsor Equity = Uses − Debt − Other sources. |
| F28 | **Treasury Stock Method dilution = Options − (Proceeds / Share Price)** | Net new shares from in-the-money options. |

---

## 4. Worked Examples (with real numbers)

### Example 1 — Statement linkage: $10 of depreciation flows through (assume 40% tax)
A $10 increase in depreciation expense (a non-cash charge):
- **Income Statement:** Pre-tax income falls by $10. At a 40% tax rate, taxes fall by $4, so **net income falls by $6**.
- **Cash Flow Statement:** Start with net income **−$6**; **add back** the $10 non-cash depreciation → **CFO rises by +$4** (this is the cash tax savings, i.e., the depreciation tax shield = $10 × 40%). No CFI/CFF impact → **cash increases by $4**.
- **Balance Sheet:**
  - Assets: **Cash +$4**; **PP&E −$10** (depreciated). Net assets = **−$6**.
  - Liabilities & Equity: Retained earnings falls by net income of **−$6**.
  - **Both sides fall by $6 → BS balances.** ✔

### Example 2 — Inventory write-down of $20 (assume 40% tax)
A company writes down obsolete inventory by $20:
- **IS:** Recognize a $20 expense (in COGS/impairment). Pre-tax income −$20; taxes −$8; **net income −$12**.
- **CFS:** NI −$12; the write-down is **non-cash**, so add it back +$20 (often shown as a non-cash charge or via the inventory working-capital line) → **CFO +$8** (the cash tax savings = $20 × 40%). **Cash +$8.**
- **BS:** Cash +$8, Inventory −$20 → assets −$12; Retained earnings −$12 → **balances.** ✔
- *Note:* an inventory write-down has the same shape as depreciation — a non-cash expense whose only cash effect is the tax shield.

### Example 3 — EV → Equity Value bridge
Given: EV = **$1,000**; Total Debt = **$400**; Cash = **$50**; Preferred = **$30**; Minority Interest = **$20**; Non-operating equity investments = **$10**.
- Net Debt = 400 − 50 = **$350**.
- **Equity Value = EV − Net Debt − Preferred − Minority Interest + Non-operating assets**
  = 1,000 − 350 − 30 − 20 + 10 = **$610**.
- If fully diluted shares = 61.0, **implied share price = $610 / 61.0 = $10.00.**

### Example 4 — Mini-DCF (5-year, exit-multiple terminal value)
Assumptions: Year-1 FCFF = **$100**, growing **10%/yr**; **WACC = 10%**; terminal-year (Year 5) EBITDA = **$200**; exit multiple = **8.0x**; year-end discounting; net debt = **$300**; shares = 50.

| Year | FCFF | Discount factor (1.10^t) | PV |
|------|------|--------------------------|----|
| 1 | 100.0 | 1.100 | 90.9 |
| 2 | 110.0 | 1.210 | 90.9 |
| 3 | 121.0 | 1.331 | 90.9 |
| 4 | 133.1 | 1.464 | 90.9 |
| 5 | 146.4 | 1.611 | 90.9 |

- **Sum of PV(FCF) ≈ $454.6** (each year ≈ $90.9 because growth 10% ≈ discount 10%).
- **Terminal Value = 200 × 8.0 = $1,600**; PV = 1,600 / 1.611 = **$993.2**.
- **Enterprise Value = 454.6 + 993.2 = $1,447.8.**
- **Equity Value = 1,447.8 − 300 = $1,147.8** → **implied price = 1,147.8 / 50 = $22.96.**
- **TV as % of EV = 993.2 / 1,447.8 ≈ 69%** — within the typical 60–80% range.

### Example 5 — Terminal value: Gordon growth vs. mid-year, and a sanity check
Using the same model, Year-5 FCFF = $146.4, **g = 3%**, WACC = 10%:
- **TV (Gordon) = 146.4 × (1.03) / (0.10 − 0.03) = 150.8 / 0.07 = $2,154.**
- PV (year-end, t=5) = 2,154 / 1.611 = **$1,337.**
- **Mid-year convention** discounts at t = 4.5: 1.10^4.5 = 1.5362 → PV = 2,154 / 1.5362 = **$1,402** (higher, because cash arrives sooner).
- **Cross-check the exit multiple of 8.0x:** the Gordon TV of $2,154 implies EV/EBITDA = 2,154 / 200 = **10.8x** — *higher* than the 8.0x exit multiple, signaling the 3% perpetuity growth is relatively generous versus the market exit multiple. This is exactly the reasonableness check analysts run.

### Example 6 — Simple LBO returns (the return-math core)
Entry: buy a company at **8.0x** Year-0 EBITDA of **$100** → **Entry EV = $800.** Funded with **$500 debt** and **$300 sponsor equity** (assume entry net debt = the $500 raised). Hold **5 years**.
Over the hold: EBITDA grows to **$140** (≈7%/yr); FCF pays down **$200** of debt (ending net debt **$300**); exit at the **same 8.0x** multiple.
- **Exit EV = 140 × 8.0 = $1,120.**
- **Exit Equity = 1,120 − 300 = $820.**
- **MOIC = 820 / 300 = 2.73x.**
- **IRR = 2.73^(1/5) − 1 = 22.3%.**
- **Attribution (intuition):** with a flat multiple, the entire gain came from **EBITDA growth ($40 × 8.0 = $320 of EV)** and **debt paydown ($200 → +$200 equity)**. If instead the exit multiple expanded to 9.0x: Exit EV = 140×9 = 1,260; Exit Equity = 960; MOIC = 3.20x; IRR ≈ 26.2% — the extra ~0.47x / ~4 pts of IRR is **multiple expansion**.

---

## 5. Glossary Terms

| Term | Definition |
|------|------------|
| Accrual accounting | Recognizing revenue when earned and expenses when incurred, regardless of cash timing (matching principle). |
| Cash accounting | Recognizing transactions only when cash actually changes hands. |
| Income statement | Period statement of profitability (Revenue → Net Income). |
| Balance sheet | Point-in-time snapshot; Assets = Liabilities + Equity. |
| Cash flow statement | Reconciles accrual net income to the change in cash via CFO, CFI, CFF. |
| CFO / CFI / CFF | Cash from Operations / Investing / Financing — the three CFS sections. |
| Net income | Bottom-line accrual profit; flows to CFS top and retained earnings. |
| Retained earnings | Cumulative net income less dividends, in equity on the BS. |
| Working capital | Operating current assets minus operating current liabilities. |
| ΔNWC | Change in net working capital; an increase uses cash. |
| D&A | Depreciation & amortization; non-cash expense added back on the CFS. |
| Stock-based compensation (SBC) | Non-cash equity comp; added back in CFO (and an EPS-dilution consideration). |
| Deferred tax liability (DTL) | Future tax owed from book income exceeding taxable income now (e.g., accelerated tax depreciation). |
| Deferred tax asset (DTA) | Future tax benefit from paying more tax now than book (e.g., NOLs). |
| NOL | Net operating loss; carryforward that shelters future taxable income (creates a DTA). |
| EBIT | Operating income; earnings before interest and taxes. |
| EBITDA | EBIT + D&A; common cash-flow proxy and valuation denominator. |
| NOPAT | EBIT × (1 − tax); unlevered after-tax operating profit. |
| Enterprise value (EV) | Value of the core operating business to all capital providers. |
| Equity value | Value attributable to common shareholders (market cap). |
| Net debt | Total debt minus cash & equivalents; can be negative (net cash). |
| Minority (non-controlling) interest | Portion of a consolidated subsidiary not owned by the parent; added in the EV bridge. |
| Preferred stock | Senior, debt-like equity with fixed dividends/liquidation preference; added in the EV bridge. |
| Treasury stock method | Method to count net dilution from in-the-money options/warrants. |
| Trading comparables | Valuation from current public-market trading multiples of peers. |
| Precedent transactions | Valuation from multiples paid in past M&A deals; includes control premium. |
| Control premium | Extra paid to acquire control of a company (above trading value). |
| Football field | Chart overlaying valuation ranges from each methodology. |
| EV/EBITDA | Capital-structure-neutral M&A workhorse multiple. |
| EV/Revenue | Sales multiple for high-growth/unprofitable companies. |
| P/E ratio | Price ÷ EPS; equity-based multiple sensitive to leverage and growth. |
| DCF | Discounted cash flow; intrinsic valuation from discounted future cash flows. |
| FCFF / Unlevered FCF | Cash to all capital providers; discounted at WACC → EV. |
| FCFE / Levered FCF | Cash to equity holders; discounted at cost of equity → equity value. |
| WACC | Weighted average cost of capital; blended after-tax required return. |
| CAPM | Capital Asset Pricing Model; Re = Rf + β·ERP. |
| Beta (β) | Sensitivity of a stock's returns to the market (systematic risk). |
| Equity risk premium (ERP) | Excess return over the risk-free rate required to hold equities. |
| Terminal value (TV) | Value of cash flows beyond the explicit forecast (Gordon or exit multiple). |
| Gordon growth model | TV = FCFₙ(1+g)/(WACC−g); perpetuity-growth method. |
| Exit multiple method | TV = terminal EBITDA × market multiple. |
| Mid-year convention | Discounting as if cash flows arrive mid-year (periods 0.5, 1.5, …). |
| Sensitivity / data table | Grid flexing key inputs (WACC, g, exit multiple) to show a value range. |
| LBO | Leveraged buyout; acquisition funded largely with debt. |
| Deleveraging | Using FCF to pay down acquisition debt, converting EV to equity value. |
| Multiple expansion | Exiting at a higher valuation multiple than entry. |
| Sources & Uses | LBO funding table; Sources (debt/equity) must equal Uses (purchase/fees). |
| MOIC | Multiple of invested capital = exit equity / equity invested. |
| IRR | Internal rate of return; annualized return on invested capital. |

---

## 6. Flashcard-worthy Q&A (front/back)

1. **Q:** The three financial statements? **A:** Income statement, balance sheet, cash flow statement.
2. **Q:** Balance sheet identity? **A:** Assets = Liabilities + Shareholders' Equity.
3. **Q:** Where does net income appear besides the IS? **A:** Top of the CFS and (less dividends) in retained earnings on the BS.
4. **Q:** Which statement reconciles accrual profit to cash? **A:** The cash flow statement.
5. **Q:** An increase in accounts receivable does what to cash? **A:** Uses cash (negative CFO adjustment).
6. **Q:** An increase in accounts payable does what to cash? **A:** Provides cash (positive CFO adjustment).
7. **Q:** What creates a deferred tax liability? **A:** Book income > taxable income now (classically, accelerated tax depreciation vs. straight-line book).
8. **Q:** Unlevered FCF formula? **A:** EBIT×(1−t) + D&A − CapEx − ΔNWC.
9. **Q:** What discount rate pairs with unlevered FCF? **A:** WACC (yields enterprise value).
10. **Q:** What discount rate pairs with levered FCF (FCFE)? **A:** Cost of equity (yields equity value).
11. **Q:** WACC formula? **A:** (E/V)·Re + (D/V)·Rd·(1−t) + (P/V)·Rp.
12. **Q:** CAPM cost of equity? **A:** Re = Rf + β × (Rm − Rf).
13. **Q:** Why multiply cost of debt by (1−t)? **A:** Interest is tax-deductible (tax shield).
14. **Q:** Gordon growth terminal value? **A:** TV = FCFₙ(1+g)/(WACC−g).
15. **Q:** Exit-multiple terminal value? **A:** TV = terminal EBITDA × exit multiple.
16. **Q:** Typical TV share of total DCF value? **A:** ~60–80%.
17. **Q:** Mid-year convention discount periods? **A:** 0.5, 1.5, 2.5, … (raises PVs).
18. **Q:** EV → equity bridge? **A:** Equity = EV − net debt − preferred − minority interest + non-operating assets.
19. **Q:** Why add minority interest to EV? **A:** Consolidated EBITDA includes 100% of the sub; the numerator must match.
20. **Q:** Why subtract cash in EV? **A:** Cash is non-operating; an acquirer nets it against the price.
21. **Q:** When use EV/Revenue? **A:** High-growth or unprofitable companies (negative EBITDA/EPS).
22. **Q:** Why is EV/EBITDA preferred over P/E for M&A? **A:** Neutral to capital structure and D&A policy; better cross-company comparability.
23. **Q:** Why do precedents usually exceed trading comps? **A:** They include a control premium and synergies.
24. **Q:** The three LBO return levers? **A:** EBITDA growth, debt paydown (deleveraging), multiple expansion.
25. **Q:** MOIC formula? **A:** Exit equity value / equity invested.
26. **Q:** Single-flow IRR from MOIC? **A:** IRR = MOIC^(1/n) − 1.
27. **Q:** #1 trait of a good LBO candidate? **A:** Stable, predictable free cash flow.
28. **Q:** Why does deleveraging create equity value? **A:** At constant EV, every $1 of debt repaid becomes ~$1 of equity (equity = EV − net debt).
29. **Q:** Pair EV with which earnings metrics? **A:** Pre-interest (EBITDA, EBIT, revenue) — never net income.
30. **Q:** Why can two firms with equal earnings have different P/E? **A:** Differences in expected growth, risk, and capital structure.

---

## 7. Interview Questions & Model Answers

**1. Walk me through the three statements and how they link.**
"The income statement shows profitability over a period, ending in net income. The balance sheet is a point-in-time snapshot where assets equal liabilities plus equity. The cash flow statement reconciles accrual net income to actual cash. They link three ways: net income flows from the IS to the top of the CFS and, less dividends, into retained earnings on the BS; the CFS adds back non-cash items like D&A and adjusts for working-capital changes to get cash from operations, then layers in investing and financing to produce the net change in cash, which updates the cash line on the BS; and because every change — cash and non-cash — is captured, the balance sheet balances."

**2. Walk me through a DCF.**
"You project unlevered free cash flow — EBIT times one minus the tax rate, plus D&A, minus CapEx, minus the increase in working capital — for five to ten years. You discount those at WACC, the blended after-tax cost of all capital. You add a terminal value, either Gordon growth — final-year FCF times one plus g over WACC minus g — or an exit multiple on terminal EBITDA, and discount that back too. Summing the discounted cash flows and terminal value gives enterprise value. You then subtract net debt, preferred, and minority interest to get equity value, and divide by diluted shares for an implied price."

**3. Why discount unlevered FCF at WACC and not cost of equity?**
"Unlevered FCF is the cash available to all capital providers before any financing — it's capital-structure-neutral — so the appropriate discount rate is the blended return of all providers, WACC. The result is enterprise value. If you used levered FCF, which is after interest and net borrowing and belongs only to equity, you'd discount at the cost of equity and get equity value directly. The cardinal sin is mismatching — e.g., discounting net income at WACC."

**4. EV vs. equity value — what's the difference and the bridge?**
"Equity value is what belongs to common shareholders — market cap. Enterprise value is the value of the core operating business to all capital providers and is capital-structure-neutral. To bridge: EV equals equity value plus net debt plus preferred plus minority interest, minus non-operating assets. You add debt and preferred because they're claims senior to equity; you subtract cash because it's non-operating; you add minority interest because consolidated financials include 100% of a subsidiary the parent doesn't fully own."

**5. Why might two companies with the same earnings have different P/E?**
"P/E reflects more than current earnings — it prices in expected growth, risk, and capital structure. The company with higher expected earnings growth or lower perceived risk will command a higher P/E because investors pay more for those future earnings. Differences in leverage also matter: a more levered firm is riskier for the same earnings, which can compress its multiple. And P/E ignores debt and cash, so two firms with identical P/E can carry very different financial risk."

**6. Which valuation multiple would you use and when?**
"EV/EBITDA is the default for M&A because it's neutral to capital structure and depreciation policy and proxies cash flow. I'd use EV/EBIT when CapEx/D&A intensity differs across peers. EV/Revenue for high-growth or unprofitable companies where EBITDA and earnings are negative or not meaningful. P/E for equity-holder perspective and for financials, while remembering it's distorted by leverage and one-time items."

**7. Trading comps vs. precedent transactions — which is higher and why?**
"Precedent transactions usually produce higher values because they reflect prices actual acquirers paid, which include a control premium and expected synergies. Trading comps reflect where peers trade in the public market today on a minority basis, with no control premium. I'd triangulate both on a football field, recognizing precedent data can be stale and deal-specific."

**8. What are the two terminal value methods and their pitfalls?**
"Gordon growth — final-year FCF times one plus g over WACC minus g — where g must be modest, at or below long-run GDP, and below WACC. Exit multiple — terminal EBITDA times a market multiple from comps. The pitfall is that terminal value is often 60–80% of total value, so the result is hugely sensitive to g or the exit multiple; you should always cross-check one method against the other's implied assumption."

**9. What is the mid-year convention and why use it?**
"It assumes cash flows arrive mid-year rather than at year-end, so discount periods become 0.5, 1.5, 2.5 and so on. Because cash is received sooner on average, present values rise, giving a slightly higher and more realistic valuation."

**10. What makes a good LBO candidate?**
"First and foremost, stable and predictable free cash flow, because debt service is fixed. Then recurring revenue, low CapEx and working-capital needs so cash is free to pay down debt, a defensible market position, low existing leverage so there's debt capacity, strong management to execute the plan, and clear exit options. Bonus is identifiable operational upside or undervaluation."

**11. Why do LBO returns work — what drives them?**
"Three levers. EBITDA growth through revenue and margin improvement, which is often the biggest driver. Debt paydown — using FCF to reduce debt, which at a constant enterprise value converts directly into equity value. And multiple expansion — exiting at a higher multiple than entry, though conservative underwriting assumes flat or lower. Leverage amplifies all of this because the sponsor invests less equity, so each dollar of value creation is a larger percentage return."

**12. How does $10 of depreciation flow through the statements (40% tax)?**
"On the IS, pre-tax income falls $10, taxes fall $4, net income falls $6. On the CFS, you start with net income down $6 and add back the $10 non-cash depreciation, so cash from operations rises $4 — that's the tax shield. On the BS, cash is up $4 and PP&E is down $10, so assets fall $6; retained earnings falls $6 from lower net income; both sides drop $6 and it balances."

**13. A company buys $100 of inventory with cash — what happens? (bonus)**
"No income statement impact yet — it's a balance-sheet swap: inventory up $100, cash down $100, assets unchanged. On the CFS, the working-capital increase in inventory is a $100 use of cash in operations. The IS only sees it later, as COGS, when the inventory is sold."

---

## 8. Common Pitfalls & Nuances

- **Mismatching cash flow and discount rate.** Unlevered FCF → WACC → EV; levered FCF → cost of equity → equity value. Discounting net income at WACC is the classic error.
- **Terminal value dominance.** TV is typically 60–80% of total value. A 50 bps change in g or a half-turn change in exit multiple swings the answer materially. Always cross-check Gordon-implied multiple vs. exit-multiple-implied growth.
- **Perpetuity growth too high.** g must be ≤ long-run GDP/inflation (commonly 2–3%) and strictly < WACC; otherwise the formula explodes.
- **Mid-year convention on the exit-multiple TV.** Sources disagree: some discount the exit-multiple TV at the full final period (n) because a multiple implies a year-end sale, while the Gordon TV is discounted at n−0.5. Be ready to state your assumption. *(Flagged — practitioner judgment.)*
- **Negative net debt (net cash).** When cash > debt, net debt is negative, so EV < equity value. Don't drop the sign.
- **EV/equity multiple mismatch.** Never compute EV/Net Income or P/EBITDA — match pre-interest metrics to EV and post-interest metrics to equity value.
- **Forgetting minority interest / preferred in the bridge.** Omitting them understates EV (or overstates equity value when going the other way).
- **Stock-based compensation.** It's a non-cash expense added back in CFO, but it's a real economic cost — best practice is to treat it as a cash expense or fully account for the resulting share dilution, not to "free add-back" it into EBITDA.
- **Diluted share count.** Use the treasury stock method for in-the-money options/warrants; ignoring dilution overstates per-share value.
- **Mid-cycle / normalized metrics in comps.** Use LTM and forward multiples; normalize for one-time items, and be careful comparing companies at different points in their cycle.
- **Book vs. market weights in WACC.** Use market-value (or target) weights, not book values, and a forward-looking capital structure.
- **Double-counting non-operating items.** If you value an equity investment separately (added in the bridge), don't also capture its income in EBITDA used for the core multiple.
- **EBITDA ≠ cash flow.** EBITDA ignores CapEx, working capital, and taxes; capital-intensive businesses can have strong EBITDA but weak FCF — a key LBO screening nuance.
- **Working-capital sign errors.** Increase in an asset = use of cash; increase in a liability = source of cash. Reversing these is a frequent mistake.
- **Confusing EBITDA growth vs. multiple expansion in LBO attribution.** Hold the multiple flat to isolate operational value creation; only the delta from a higher exit multiple is "multiple expansion."

---

## 9. Sources

1. **Wall Street Prep — "How Are the Three Financial Statements Linked?"** https://www.wallstreetprep.com/knowledge/how-are-the-financial-statements-linked/ — Authoritative IB training provider; canonical linkage explanation. (Page blocked full fetch; corroborated via search snippet + source 2.)
2. **Wall Street Prep — "Walk Me Through the Three Financial Statements."** https://www.wallstreetprep.com/knowledge/please-walk-me-through-the-three-financial-statements/ — Standard interview-answer framing. Reliable.
3. **Wall Street Prep — "Walk Me Through a DCF."** https://www.wallstreetprep.com/knowledge/walk-me-through-dcf/ — DCF steps, FCFF, WACC matching, terminal value. Highly reliable.
4. **Wall Street Prep — "Terminal Value (DCF)."** https://www.wallstreetprep.com/knowledge/terminal-value/ — Gordon growth and exit-multiple formulas; TV as % of value. Reliable.
5. **Wall Street Prep — "WACC Guide."** https://www.wallstreetprep.com/knowledge/wacc/ — WACC and CAPM components. Reliable.
6. **Wall Street Prep — "Mid-Year Convention (DCF)."** https://www.wallstreetprep.com/knowledge/mid-year-convention/ — Mid-year discount periods 0.5/1.5/2.5. Reliable.
7. **Wall Street Prep — "Equity Value to Enterprise Value Bridge."** https://www.wallstreetprep.com/knowledge/equity-value-to-enterprise-value-bridge/ — Full EV↔equity bridge. Reliable.
8. **Wall Street Prep — "Enterprise Value (TEV)."** https://www.wallstreetprep.com/knowledge/enterprise-value/ — EV definition and components. Reliable.
9. **Wall Street Prep — "Deferred Tax Liability (DTL)."** https://www.wallstreetprep.com/knowledge/deferred-tax-liability-dtl/ — DTL from depreciation timing; DTL ≈ ΔPP&E × tax. Reliable.
10. **Wall Street Prep — "Common Errors in DCF Models."** https://www.wallstreetprep.com/knowledge/common-errors-in-dcf-models/ — TV >75% flag, FCF/discount-rate mismatch. Reliable.
11. **Wall Street Prep — "LBO Candidate Characteristics."** https://www.wallstreetprep.com/knowledge/lbo-candidate-characteristics/ — Good-candidate traits. Reliable.
12. **Wall Street Prep — "Deleveraging."** https://www.wallstreetprep.com/knowledge/deleveraging/ — Debt paydown as a return lever. Reliable.
13. **Wall Street Prep — "LBO Returns Attribution Analysis."** https://www.wallstreetprep.com/knowledge/lbo-returns-attribution-analysis-value-creation/ — Three return levers. Reliable.
14. **Wall Street Prep — "Precedent Transaction Analysis."** https://www.wallstreetprep.com/knowledge/precedent-transaction-analysis/ — Control premium vs. trading comps. Reliable.
15. **Corporate Finance Institute — "WACC Formula, Definition and Uses."** https://corporatefinanceinstitute.com/resources/valuation/what-is-wacc-formula/ — WACC/CAPM corroboration. Reliable.
16. **Corporate Finance Institute — "Minority Interest in Enterprise Value Calculation."** https://corporatefinanceinstitute.com/resources/valuation/minority-interest-in-enterprise-value-calculation/ — Why minority interest enters EV. Reliable.
17. **Corporate Finance Institute — "Deferred Tax Liability (or Asset)."** https://corporatefinanceinstitute.com/resources/accounting/deferred-tax-liability-asset/ — Book vs. tax depreciation; DTL/DTA. Reliable.
18. **Corporate Finance Institute — "LBO Returns Attribution."** https://corporatefinanceinstitute.com/resources/valuation/lbo-returns-attribution/ — Equity-value drivers. Reliable. (Full fetch blocked; corroborated via search + sources 13, 19.)
19. **Corporate Finance Institute — "Transaction Multiples."** https://corporatefinanceinstitute.com/resources/valuation/transaction-multiples/ — When each multiple applies. Reliable.
20. **Corporate Finance Institute — "What Makes a Good LBO Candidate?"** https://corporatefinanceinstitute.com/resources/valuation/good-lbo-candidate/ — Candidate screening. Reliable.
21. **Aswath Damodaran (NYU Stern) — "The Free Cashflow to Firm Model."** https://pages.stern.nyu.edu/~adamodar/pdfiles/eqnotes/fcff.pdf — Primary academic source for FCFF = EBIT(1−t) − (CapEx − Depr) − ΔWC and firm valuation. Highly authoritative. (PDF blocked full fetch; formula corroborated via search snippet + source 22.)
22. **Aswath Damodaran (NYU Stern) — "Earnings and Cash Flows: A Primer on Free Cash Flows."** https://pages.stern.nyu.edu/~adamodar/pdfiles/blog/FreeCF.pdf — FCFF/FCFE distinction. Highly authoritative.
23. **Breaking Into Wall Street / Mergers & Inquisitions — "Mid-Year Convention DCF and Mid-Year Discounting."** https://breakingintowallstreet.com/kb/discounted-cash-flow-analysis-dcf/mid-year-convention-dcf/ — Mid-year and exit-multiple TV nuance. Reliable.
24. **Breaking Into Wall Street — "Net Operating Losses & Deferred Tax Assets Tutorial."** https://breakingintowallstreet.com/kb/accounting/net-operating-losses/ — DTA/NOL mechanics. Reliable.
25. **Macabacus — "Enterprise and Equity Values."** https://macabacus.com/valuation/dcf-enterprise-equity-values — EV/equity in DCF context. Reliable.
26. **Street of Walls — "Discounted Cash Flow Analysis."** https://www.streetofwalls.com/finance-training-courses/investment-banking-technical-training/discounted-cash-flow-analysis/ — DCF technical training corroboration. Reliable.
27. **Street of Walls — "Key Characteristics of an LBO Candidate."** https://www.streetofwalls.com/articles/private-equity/learn-the-basics/lbo-candidate/ — Candidate traits corroboration. Reliable.
28. **IB Interview Questions — "The Equity Value to Enterprise Value Bridge."** https://ibinterviewquestions.com/guides/valuation-investment-banking/equity-value-to-enterprise-value-bridge — Bridge corroboration. Reasonably reliable (secondary).

**Disagreements / uncertainties flagged:**
- **Mid-year convention on exit-multiple terminal value** (§2.C, §8): sources differ on whether to discount it at period n vs. n−0.5 — treated as a stated assumption. (Sources 6, 23.)
- **LBO return-lever attribution percentages** (EBITDA growth ~40–60%, debt paydown ~20–30%, multiple expansion ~10–30%) are *typical ranges* cited in training content, not fixed rules; they vary widely by deal. (Sources 13, 18.)
- **ERP magnitude** (~4.5–6%) and exact perpetuity-growth ceilings are conventions, not universal constants; Damodaran's implied ERP fluctuates. (Sources 5, 21.)
