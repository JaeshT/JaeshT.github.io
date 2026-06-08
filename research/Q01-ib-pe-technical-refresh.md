# IB / PE Technical Refresher — Interview-Grade Fundamentals
### Built for a Primaries & Co-Investments (LP / fund-investing) seat

> **How to read this.** Parts I to IV are the universal investment banking and buyout technicals that get tested in nearly every finance interview. Part V is the fund-investing layer (metrics, fees, waterfalls, PME, co-investments, secondaries) that is specific to your seat and is where LP-team interviewers actually separate candidates. The IB core gets you to "competent." Part V gets you to "right for this desk." Then come the glossary, 88 tagged flashcards, 15 long-form interview answers, the worked numerical examples (each laid out so it can be wired into a calculator), a formula appendix, and sources.
>
> A note on convention: the canonical "$10 depreciation" walkthrough below uses a **40% tax rate** because that is the version interviewers expect and it produces clean arithmetic. Real current US corporate rates are closer to 21% federal and roughly 25% to 26% combined. Where the choice of rate changes the answer, that is noted.

---

## Part I — Accounting and the Three Statements

### I.1 What the three statements are

The **income statement (IS)** measures profitability over a period. It runs from revenue down through expenses to **net income**, on an accrual basis (revenue is booked when earned, expenses when incurred, regardless of cash timing).

The **balance sheet (BS)** is a snapshot at a point in time of what a company owns and owes: **Assets = Liabilities + Shareholders' Equity**. It must balance by construction.

The **cash flow statement (CFS)** reconciles accrual net income to the actual change in cash over the period. It has three sections: **Cash Flow from Operations (CFO)**, **Cash Flow from Investing (CFI)**, and **Cash Flow from Financing (CFF)**. The bottom line is the net change in cash, which ties to the cash line on the balance sheet.

### I.2 How they link (the single most tested concept)

The statements are not three separate documents. They are one model with three views, joined at specific seams:

1. **Net income** is the bottom of the income statement. It flows to the **top of the cash flow statement** (as the starting point of CFO) and to **retained earnings** in shareholders' equity on the balance sheet.
2. The **cash flow statement explains the change in the cash line** on the balance sheet. Ending cash on the CFS equals the cash line on the new balance sheet.
3. **Non-cash items** on the income statement (depreciation, amortization, stock-based compensation, deferred taxes, write-downs) are added back in CFO because they reduced net income but did not consume cash.
4. **Changes in working capital** (receivables, inventory, payables) are captured in CFO because accrual revenue and expense rarely equal the cash that moved.
5. **Capital expenditure** flows through CFI and onto the balance sheet as PP&E; **debt issuance/repayment and equity issuance/dividends** flow through CFF and onto the balance sheet as debt and equity.

The discipline that makes the model self-checking: **every change to one statement must keep the balance sheet in balance.** If it does not balance, you made an error.

### I.3 The canonical flow-through: depreciation increases by $10 (40% tax)

This is the most frequently asked accounting question on the planet. Walk it cleanly:

- **Income statement.** Depreciation is an expense, so pre-tax income falls by $10. At a 40% tax rate, taxes fall by $4, so **net income falls by $6**.
- **Cash flow statement.** Start from net income, down $6. Add back the $10 of depreciation (non-cash), so **CFO rises by $4**. No investing or financing impact, so **cash rises by $4**.
- **Balance sheet.** On the asset side, cash is up $4 and PP&E is down $10 (the asset was depreciated), so **total assets fall by $6**. On the other side, net income down $6 reduces retained earnings, so **equity falls by $6**. Assets down $6 equals equity down $6. **It balances.**

The insight: depreciation is a **tax shield**. The non-cash charge lowers taxable income, so the company keeps $4 it would otherwise have paid in cash taxes. That is why analysts care about D&A even though it "isn't real cash."

### I.4 Working capital

**Net working capital (NWC)** in the operating sense is **current operating assets minus current operating liabilities**, typically: accounts receivable + inventory + prepaid expenses, minus accounts payable + accrued expenses. (Note: the textbook "current assets minus current liabilities" includes cash and short-term debt, which are excluded from the *operating* NWC used in cash flow and DCF work. Be precise about which definition the interviewer wants.)

The cash-flow rule, which trips people up:

- An **increase in an operating asset is a use of cash** (you shipped product and booked revenue but have not collected; or you bought inventory). Cash flow goes **down**.
- An **increase in an operating liability is a source of cash** (you received goods or services but have not paid the supplier yet). Cash flow goes **up**.

So a growing company that must fund receivables and inventory ahead of collecting can be profitable on the income statement and still starved for cash. This is why **change in NWC** is subtracted in the free cash flow build.

### I.5 D&A (depreciation and amortization)

**Depreciation** spreads the cost of tangible assets (PP&E) over their useful lives. **Amortization** does the same for definite-lived intangibles (for example acquired customer relationships or capitalized software). Both are non-cash, both reduce taxable income, both are added back in CFO. Goodwill is **not** amortized under US GAAP; it is tested for **impairment** and written down only if impaired.

### I.6 Deferred taxes

Companies keep two sets of books: one for shareholders (GAAP/IFRS) and one for the tax authority. When the two recognize income or expense in different periods, the difference creates a deferred tax item.

- A **deferred tax liability (DTL)** arises when **book tax expense exceeds cash taxes paid** now, so more tax will be owed later. The classic driver is **accelerated depreciation for tax purposes** versus straight-line for books: early on you pay less cash tax than the book expense implies, and that reverses later.
- A **deferred tax asset (DTA)** arises when you have **paid more cash tax than book expense** now, so you have a future benefit. Common drivers are **net operating loss carryforwards**, warranty reserves, and certain accruals not yet deductible.

On the cash flow statement, an **increase in a DTL is added back to CFO** (it lowered book net income via the tax line without consuming cash this period). A DTA build is a use of cash. DTAs are reduced by a **valuation allowance** when it is more likely than not the company will not generate enough future taxable income to use them.

---

## Part II — Enterprise Value vs Equity Value

### II.1 The two values and why they differ

**Equity value (market capitalization)** is the value of the business attributable to common shareholders: **diluted share count times share price**. It is what an equity buyer pays for the stock.

**Enterprise value (EV)** is the value of the **entire operating business**, independent of how it is financed. It is what a buyer effectively pays to acquire the whole company free of its existing capital structure: take out the equity holders, assume the debt, and capture the cash.

EV is **capital-structure neutral**, which is why it pairs with capital-structure-neutral metrics like revenue, EBITDA, and EBIT. Equity value pairs with after-debt, after-tax metrics like net income and levered free cash flow.

### II.2 The bridge

$$\textbf{Enterprise Value} = \text{Equity Value} + \text{Total Debt} + \text{Preferred Stock} + \text{Minority (Noncontrolling) Interest} - \text{Cash and Equivalents}$$

Rearranged: **Equity Value = EV − Net Debt − Preferred − Minority Interest**, where Net Debt = Total Debt − Cash.

Why each line:

- **Add total debt.** An acquirer must repay or refinance the target's debt, so it is part of the true cost of owning the whole business. Debt holders have a claim that sits ahead of equity.
- **Subtract cash.** Cash is a non-operating asset. The buyer effectively gets it back and could use it to pay down debt, lowering the net price. Subtracting cash also avoids double-counting, because interest income on that cash is not in EBITDA.
- **Add preferred stock.** Preferred is a financing claim senior to common equity, so it is part of the capital that funds the enterprise.
- **Add minority (noncontrolling) interest.** When a parent consolidates a subsidiary it owns only partially, the financials (and therefore EBITDA) include **100%** of that subsidiary, but equity value reflects only the parent's share. Adding minority interest makes the EV numerator consistent with the fully consolidated EBITDA denominator.

Practical notes: EV can be **negative** when a company holds more cash than its debt plus equity value (rare, but possible for distressed or cash-rich names). Use **market value of debt** in theory; in practice book value is a common proxy because most debt trades near par unless distressed.

### II.3 Treasury Stock Method (diluted shares)

Equity value uses **diluted** shares, not basic, because in-the-money options and warrants will convert and dilute existing holders. The treasury stock method (TSM) estimates the net new shares:

1. Count only **in-the-money** options and warrants (strike below current price). Out-of-the-money instruments are ignored.
2. Compute **exercise proceeds** = number of options times strike price.
3. Assume the company uses those proceeds to **repurchase shares at the current market price**: shares bought back = proceeds ÷ current price.
4. **Net new shares = options exercised − shares repurchased.** Add to basic shares.

Convertible securities are handled with the **if-converted method**, not TSM: if in the money, add the shares they convert into and remove the related interest expense from earnings.

---

## Part III — Valuation

There are three core methodologies. Each answers "what is this business worth" from a different angle, and you triangulate across them (the "football field").

### III.1 Trading comparables ("comps")

Value the target against a peer set of **publicly traded** companies using market multiples.

Process: pick comparable companies (similar industry, size, growth, margins, geography), pull their multiples, take a central tendency (usually the **median**, because it resists outliers better than the mean), and apply it to the target's metric.

Common multiples:

- **EV-based** (capital-structure neutral, paired with EV in numerator): EV/Revenue, EV/EBITDA, EV/EBIT.
- **Equity-based** (paired with equity value): P/E (price/earnings), P/B, and for financials, P/TBV.

**EV/EBITDA** is the workhorse because it strips out capital structure (interest), tax regime, and non-cash D&A, allowing cleaner cross-company comparison. **P/E** is distorted by leverage and tax differences, but it is still standard for banks and insurers where capital structure is the business.

Comps reflect **where the market prices peers today**, so they move with sentiment and tend to be a "minority/public market" value (no control premium).

### III.2 Precedent transactions ("precedents," "deal comps")

Same idea, but the multiples come from **prices paid in past M&A deals** for comparable targets. Because acquirers pay a **control premium** (the right to control the company and capture synergies), precedent transaction multiples are **usually higher** than trading comps. They are also dated (a 2021 deal reflects 2021 financing conditions, not today's), so recency and comparability of deal environment matter. Synergy expectations and strategic versus financial buyer dynamics further inflate or distort them.

### III.3 Discounted Cash Flow (DCF)

The DCF values a business on its own projected cash flows, discounted to present value. It is the most theoretically grounded method and the most assumption-sensitive.

The standard **unlevered DCF** values the enterprise:

**Step 1 — Build Unlevered Free Cash Flow (UFCF), also called Free Cash Flow to the Firm:**

$$\text{UFCF} = \underbrace{\text{EBIT} \times (1 - \text{tax rate})}_{\text{NOPAT}} + \text{D\&A} - \text{Capex} - \Delta\text{Net Working Capital}$$

UFCF is "unlevered" because it is computed **before** interest, so it represents cash available to **all** capital providers (debt and equity). That is why it is discounted at WACC and yields **enterprise value**. (Levered FCF subtracts interest and mandatory debt repayment, is discounted at the cost of equity, and yields **equity value** directly. Unlevered is the convention for valuation.)

**Step 2 — Discount at WACC (Weighted Average Cost of Capital):**

$$\text{WACC} = \frac{E}{V}\,K_e + \frac{D}{V}\,K_d\,(1 - t)$$

where $E/V$ and $D/V$ are the market-value weights of equity and debt, $K_d$ is the pre-tax cost of debt (after-tax because interest is tax-deductible, the "tax shield"), and the cost of equity $K_e$ comes from **CAPM**:

$$K_e = R_f + \beta \times (\text{Equity Risk Premium})$$

$R_f$ is the risk-free rate (typically the 10-year government bond yield), $\beta$ measures the stock's systematic risk relative to the market, and the ERP is the expected market return over the risk-free rate. For private companies you **unlever and relever beta** to the target's capital structure using comparable public betas.

**Step 3 — Terminal Value (TV).** The explicit forecast is usually 5 to 10 years; the TV captures everything after. Two methods:

- **Gordon Growth (perpetuity growth):**
$$\text{TV} = \frac{\text{UFCF}_{n} \times (1 + g)}{\text{WACC} - g}$$
where $g$ is the perpetual growth rate, kept at or below long-run GDP/inflation (commonly 2% to 3%). It must be below WACC or the formula breaks.

- **Exit (terminal) multiple:**
$$\text{TV} = \text{Terminal-year metric} \times \text{Exit multiple} \quad (\text{usually EV/EBITDA})$$

Sanity check: back out the **implied growth rate** from your exit multiple, and the **implied multiple** from your Gordon growth rate. If they disagree wildly, an assumption is off. The TV often drives **60% to 80%** of total DCF value, which is exactly why the DCF is fragile.

**Step 4 — Mid-Year Convention.** The naive DCF assumes each year's cash arrives in a lump at year-end (discount periods 1, 2, 3...). In reality cash flows in throughout the year, so the **mid-year convention** discounts each year's UFCF at periods **0.5, 1.5, 2.5...**, raising value modestly because cash is received sooner on average. (Treatment of the terminal value under mid-year is a genuine point of disagreement among practitioners; see the worked example.)

**Step 5 — From EV to equity.** Discount UFCFs and TV at WACC, sum to get **enterprise value**, then run the EV-to-equity bridge (subtract net debt, preferred, minority interest) and divide by diluted shares for an **implied share price**.

### III.4 How the methods compare

Precedent transactions usually give the **highest** values (control premium and synergies), trading comps a **public-market** value, and the DCF sits wherever your assumptions put it (often the widest range). No single number is "the answer"; the output is a range you defend.

---

## Part IV — Leveraged Buyout (LBO) Basics

### IV.1 Why PE uses leverage

A leveraged buyout acquires a company using a large slug of **debt** plus a smaller slug of **sponsor equity**. Leverage works for three reasons:

1. **Equity is the most expensive capital; debt is cheaper.** Funding more of the purchase with debt and less with equity, holding the asset's return fixed, **amplifies the return on the equity** (financial leverage). A smaller equity check against the same dollar of value creation is a higher percentage return.
2. **The debt is serviced and repaid by the target's own cash flow.** Over the hold, free cash flow pays down principal, converting enterprise value into equity value (**deleveraging**). The sponsor's equity grows as the lender's claim shrinks.
3. **Interest is tax-deductible**, creating a tax shield that improves cash available to equity.

The trade-off: leverage cuts both ways. It magnifies losses as well as gains, and high fixed debt service raises the risk of distress if cash flow disappoints. The ideal LBO target has **stable, predictable cash flows, low capex needs, a defensible market position, and room to improve operations or pay down debt.**

### IV.2 Sources and Uses

Every LBO begins with a sources-and-uses table that must balance.

- **Uses** (where the money goes): purchase of equity (or enterprise value), refinancing/repayment of existing debt, transaction fees (advisory, financing), and any cash needed on the balance sheet at close.
- **Sources** (where the money comes from): new debt (term loans, high-yield bonds, mezzanine), sponsor equity, management rollover equity, and excess cash on the target's balance sheet.

**Total sources must equal total uses.** The sponsor equity is the **plug**: it is whatever is left after debt and other sources cover the uses.

### IV.3 The levers of return

LBO equity value is created through three levers (and you should be able to attribute returns across them):

1. **EBITDA growth** — grow the operating profit through revenue growth and margin expansion. (Bain's 2026 framing, "12 is the new 5," makes the point that with cheaper debt and easy multiple expansion gone, organic EBITDA growth has to do far more of the work than it did historically. See Part V.7.)
2. **Multiple expansion (or contraction)** — sell at a higher EV/EBITDA than you bought. Hard to count on; in a high-entry-multiple environment this lever is often flat or negative.
3. **Debt paydown (deleveraging)** — use free cash flow to repay debt, transferring value from lenders to equity.

A fourth source, **dividend recapitalization**, returns cash to the sponsor mid-hold by raising new debt to fund a distribution, pulling forward returns without selling the asset.

### IV.4 Returns: IRR and MOIC

- **MOIC (Multiple on Invested Capital)**, also "multiple of money," = total equity proceeds ÷ equity invested. A pure cash-on-cash multiple, **ignoring time**.
- **IRR (Internal Rate of Return)** = the annualized, time-weighted discount rate that sets the net present value of the equity cash flows to zero. Time-sensitive.

Useful rules of thumb for a single bullet investment: roughly **2.0x over 5 years is about a 15% IRR; 3.0x over 5 years is about a 25% IRR**. Two deals can have the same MOIC and very different IRRs depending on holding period.

### IV.5 The paper LBO

The "paper LBO" is a mental-math exercise done without Excel: given entry EBITDA, entry multiple, leverage, a growth assumption, a debt-paydown assumption, and an exit multiple, compute exit equity value, MOIC, and approximate IRR. The full worked version with numbers is in Part VI.5.

---

## Part V — The Fund-Investing Layer (LP / Primaries & Co-Investments)

This is the material a generic IB guide omits and your interviewers will probe. Master it.

### V.1 Fund structure and cash mechanics

A private equity fund is a **limited partnership**. The **General Partner (GP)** is the manager who sources, executes, and exits deals. The **Limited Partners (LPs)** are the investors (pensions, endowments, sovereign wealth funds, insurers, funds of funds) who provide the capital and have limited liability.

- **Commitment.** An LP pledges a fixed amount (for example $100M). This is *not* wired up front.
- **Capital call (drawdown).** The GP "calls" capital from LPs as it needs cash for investments and fees, over the multi-year **investment period** (typically the first 5 years).
- **Paid-in capital (PIC), also "contributed capital."** The cumulative amount actually called and funded to date. PIC ≤ commitment.
- **Distributions.** Cash (or occasionally stock, "in-kind") returned to LPs as the GP exits or recapitalizes investments.
- A typical fund life is around **10 years** (often 5 years investing, 5 years harvesting), commonly extendable. **Vintage year** is the year the fund begins investing and is the unit of benchmarking, because macro conditions at entry dominate outcomes.

### V.2 The J-curve

Early in a fund's life, LP returns are **negative**: capital is being called and **management fees are charged on committed capital before any value is realized**, while investments are too young to be marked up or exited. As portfolio companies mature and exits begin, cumulative cash flow turns up. Plotted over time, the LP's net cash position traces the letter **J**. The bulk of returns arrives in years 5 to 8 plus, when companies are sold (Wall Street Prep; Carta). Strategies that flatten the J-curve (secondaries and co-investments) are central to your team's mandate (see V.6).

### V.3 Performance metrics (know cold, with limitations)

**Multiples (money-weighted, time-insensitive):** all use **paid-in capital** in the denominator, the institutional standard per ILPA, Cambridge Associates, Preqin, and PitchBook (Apers; Ryan O'Connell CFA).

$$\text{DPI} = \frac{\text{Cumulative Distributions}}{\text{Paid-In Capital}} \qquad \text{("realized," cash actually returned)}$$

$$\text{RVPI} = \frac{\text{Residual NAV}}{\text{Paid-In Capital}} \qquad \text{("unrealized," paper marks still in the fund)}$$

$$\text{TVPI} = \frac{\text{Distributions} + \text{Residual NAV}}{\text{Paid-In Capital}} = \text{DPI} + \text{RVPI}$$

- **DPI** is real cash in the LP's pocket; it cannot be inflated by optimistic marks. An ILPA survey reported that **74% of institutional LPs now rank DPI as their primary re-up criterion** ahead of IRR and TVPI, reflecting a multi-year liquidity drought (reported by Angel Investors Network citing ILPA). DPI can, however, be flattered by NAV-loan-funded distributions, which return cash without underlying value creation; ILPA pushback cut that practice sharply in late 2023 (Apers).
- **RVPI** is the soft, GP-marked part of TVPI. A 2.1x TVPI that is mostly DPI is a very different risk profile from a 2.1x TVPI that is mostly RVPI still on the books (Angel Investors Network).
- **TVPI** is the total scorecard but mixes hard cash and soft marks.

**IRR (time-weighted... actually money-weighted, annualized):**

- **Gross IRR** is before fund-level fees and carry (measures the GP's deal selection).
- **Net IRR** is after all fees, expenses, and carry; this is the LP's actual return and the ILPA-reported figure. The **gross-to-net spread is the fee drag** (Linnovate).

**The limitations you must be able to articulate:**

- IRR is **sensitive to timing and to early distributions**, and can be **gamed** by using a subscription/NAV credit line to delay calling LP capital (which shortens the period capital is "at risk" and inflates IRR without improving MOIC).
- IRR assumes **interim cash flows are reinvested at the IRR**, which is usually unrealistic.
- A high IRR on a fast, early flip can mask a low MOIC; a high MOIC over a long hold can mask a mediocre IRR. **Always look at IRR and a multiple together.**
- All NAV-based metrics depend on **GP marks** (fair value under ASC 820 / IFRS 13), which carry real discretion, especially when public comps compress.

### V.4 Fees and the distribution waterfall

The classic economic deal is **"2 and 20"**: roughly a **2% annual management fee** (often on committed capital during the investment period, then on invested/net cost after) plus **20% carried interest** (the GP's share of profits), subject to a **hurdle**. Large funds have compressed fees somewhat; performance fees commonly run 20% and occasionally higher (Origin Investments).

The **distribution waterfall** sets the order in which proceeds are split. The standard four tiers:

1. **Return of capital.** LPs get back 100% of paid-in capital first.
2. **Preferred return (hurdle).** LPs receive a minimum annualized return, **commonly 8%** (industry range roughly 7% to 9%), before the GP shares in profits (Allvue; Carta; Origin Investments). A **hard hurdle** pays GP carry only on profits above the hurdle; a **soft hurdle** lets the GP, once the hurdle is cleared, earn carry on all profits including the hurdle amount via the catch-up.
3. **GP catch-up.** The GP receives a large share (often **100%**) of the next distributions until it has earned its target carry percentage (for example 20%) of **all** profit above return of capital, "catching up" for the preferred it let the LPs take first.
4. **Carried interest split.** Remaining profits split per the carry, typically **80% LP / 20% GP**.

**European (whole-fund) vs American (deal-by-deal) waterfall** — the single most important structural distinction for LP protection:

- **European / whole-fund:** the GP earns **no carry until LPs have received back all paid-in capital plus the preferred return across the entire fund.** More LP-friendly, low clawback risk, standard for large institutional buyout funds (Carta; Alter Domus).
- **American / deal-by-deal:** the GP can take carry on each profitable exit before the whole fund has returned LP capital. More GP-friendly (earlier liquidity for the GP), but it creates **clawback risk** and is usually paired with carry **escrow (often 25% to 30% held back)** and personal guarantees (Alter Domus; Angel Investors Network).

**Clawback.** A provision requiring the GP to **return previously distributed carry** if, at wind-down, the GP took more than its entitled share (most relevant under American waterfalls). It is only as good as the GP's ability to pay it back, so LP-side diligence checks the escrow and the principals' balance sheet (Origin Investments).

### V.5 Public Market Equivalent (PME): benchmarking against public stocks

PME answers the question every LP allocator must answer: **did this illiquid, fee-heavy fund beat what I could have earned by simply buying a public index with the same cash-flow timing?** It builds a synthetic public investment that "buys" the index when the fund calls capital and "sells" it when the fund distributes, preserving timing and magnitude.

It is a **family** of methods, not one formula (Carta; Grokipedia):

- **Long-Nickels PME (LN-PME), the Index Comparison Method (ICM)** — Long and Nickels, 1996. The foundational method. It computes a synthetic public-market NAV from the fund's cash flows and returns an **IRR** you compare to the fund's IRR. Its weakness: with strong fund performance the synthetic short position can drive the public NAV negative, breaking the IRR (the "shortness issue," affecting roughly 5% to 6% of funds) (Esinli; TSG Performance).
- **Kaplan-Schoar PME (KS-PME)** — Kaplan and Schoar, "Private Equity Performance," 2005. Returns a **ratio (a market multiple)** rather than an IRR: the future value of distributions (including terminal NAV) over the future value of contributions, each grown at the index return. **> 1.0 means the fund beat the index; < 1.0 means it lagged.** It avoids the negative-NAV breakdown and is the most widely accepted method (Allvue; Carta). Sorensen and Jagannathan (2013) gave it a formal theoretical justification: the KS-PME is a valid economic performance measure under log-utility, robust to the risk and timing of the cash flows.
- **PME+ and mPME** — refinements that scale distributions to avoid the negative-NAV problem while still producing an IRR.
- **Direct Alpha** — the most recent method; uses the KS-PME discounting logic but solves for the exact annualized rate of out- or under-performance (an IRR of the excess), rather than an approximation (Allvue).

**The catch you should flag:** PME results are **highly sensitive to index choice**; a mismatched benchmark can distort the read by 20% to 30% (Esinli). PME also does not risk-adjust for leverage or illiquidity. (Note also that Bain itself reports its headline PME comparisons using **Long-Nickels**, per its 2026 report notes, while much of the academic and practitioner world prefers KS-PME, so the "standard" method genuinely varies by who is publishing.)

### V.6 Co-investments (your team's core product)

A **co-investment** is a direct investment into a specific portfolio company made **alongside** a lead GP, outside the main fund. Mechanics and why LPs want them:

- **Typically no management fee and no carry** ("no-fee, no-carry"), or sharply reduced economics. This is the headline attraction: it **averages down the blended fee load** of the LP's private-markets program (Russell Investments; Neuberger Berman; Wikipedia).
- **Capital is deployed fast.** Because a co-investment funds a single, identified deal, close to **100% of the committed amount is called up front**, with no undeployed-capital drag. Combined with the fee savings, this **flattens and shortens the J-curve**; BlackRock has estimated a modest co-investment allocation can pull the J-curve forward by **12 to 18 months** (Russell Investments; Petiole).
- **Higher net return potential** for the same underlying deal, purely from paying less to the GP (Neuberger Berman).
- **Selection and control** over individual deals, which lets the LP tilt sector and risk exposure deliberately.

The trade-offs and risks you should name: co-investments are usually **passive and non-controlling** (the lead GP runs the deal), they are **single-asset and concentrated** (no fund diversification), they demand **fast diligence on tight timelines**, and they carry **adverse-selection risk** (you must judge whether the GP is sharing its best deals or offloading the ones it could not fit, or that it is least sure of). GPs offer co-investment primarily to their **largest and most strategic LPs as an inducement to commit to the next primary fund** (Wikipedia), which is exactly why a "Primaries & Co-investments" team sits together: the primary commitment is the ticket to co-invest dealflow.

### V.7 Secondaries, GP-leds, and current market context

- **Secondaries.** The buying and selling of existing LP fund interests (LP-led) or GP-initiated restructurings (GP-led). Secondary interests are **more mature** (the J-curve is largely behind them and the portfolio is visible), so they return capital faster and price at a discount or premium to NAV (Russell Investments).
- **GP-led secondaries / continuation vehicles (CVs).** A GP moves one or more assets out of an aging fund into a new vehicle, giving existing LPs the choice to cash out or roll, and bringing in new capital. A growing source of DPI in a slow-exit market, but it raises **conflict-of-interest** questions (the GP sets the price on both sides) that ILPA has issued guidance on.
- **NAV loans.** Fund-level borrowing against the whole portfolio. Used to fund follow-ons or, controversially, to fund distributions; the latter **inflates reported DPI without value creation** and drew ILPA pushback that cut its distribution use sharply in late 2023 (Apers).

**Current market context (Bain Global Private Equity Report 2026, released February 2026; figures are time-sensitive):**

- Global buyout deal value rose **44% to roughly $904 billion in 2025**, the second-highest on record, but the recovery was narrow and "K-shaped" (Bain; CFO.com).
- LBO **borrowing costs are in the 8% to 9% range** and **leverage ratios are around 30% to 40% of enterprise value (about 36% in 2025 versus roughly 50% in 2015)** (Bain).
- North American purchase multiples are in record territory (a Bain illustrative US example uses roughly **14.0x entry** in 2025 versus 10.0x in 2015; the 2025 report cited a North American average near **11.9x EV/EBITDA**; Asia-Pacific deal multiples rose to **13.4x**) (Bain).
- Bain's thesis, **"12 is the new 5":** in the golden 2010s a typical deal needed only about **5% annual EBITDA growth** to hit a 2.5x MOIC and roughly 20% IRR over a five-year hold; today, with leverage and multiple-expansion tailwinds gone, deals need closer to **12% annual EBITDA growth** for comparable returns (Bain).
- A liquidity overhang persists: buyout funds hold a record **$3.8 trillion in unrealized value**, holding periods have drifted toward **seven years**, and **distributions as a share of NAV are near 14%**, a level last seen in the financial crisis. This is precisely why LPs now privilege **DPI** (Bain; Moonfare).

---

## Part VI — Worked Numerical Examples (calculator-ready)

Each example lists **inputs**, the **formula path**, and the **outputs**, so it can be parameterized directly.

### VI.1 Depreciation +$10 flow-through (tax 40%)

| Statement | Line | Change |
|---|---|---|
| Income statement | Pre-tax income | −$10 |
| | Taxes (40%) | −$4 |
| | **Net income** | **−$6** |
| Cash flow | Net income | −$6 |
| | + Depreciation (add back) | +$10 |
| | **Net change in cash (CFO)** | **+$4** |
| Balance sheet | Cash | +$4 |
| | PP&E | −$10 |
| | **Total assets** | **−$6** |
| | Retained earnings (equity) | −$6 |

Balance check: assets −$6 = equity −$6. **Balances.**
General formula: ΔNet income = −Dep × (1 − t); ΔCash = +Dep × t; ΔPP&E = −Dep.

### VI.2 EV-to-equity bridge

**Inputs:** share price $50.00; diluted shares 100M; total debt $2,000M; cash $500M; preferred stock $100M; minority interest $150M.

- Equity value = 50 × 100 = **$5,000M**
- EV = 5,000 + 2,000 + 100 + 150 − 500 = **$6,750M**

Reverse: given EV $6,750M, Equity value = 6,750 − 2,000 − 100 − 150 + 500 = $5,000M; ÷ 100M shares = **$50.00**.

### VI.3 Treasury Stock Method

**Inputs:** basic shares 100M; options outstanding 10M; strike $20.00; current price $50.00 (options are in the money).

- Exercise proceeds = 10M × $20 = $200M
- Shares repurchased = $200M ÷ $50 = 4M
- Net new shares = 10M − 4M = 6M
- **Diluted shares = 100M + 6M = 106M**

### VI.4 Full DCF (with WACC build, both TV methods, mid-year)

**WACC inputs:** risk-free 4.5%; ERP 5.5%; beta 1.0 → $K_e$ = 4.5% + 1.0 × 5.5% = **10.0%**. Pre-tax cost of debt 6.667%; tax 25% → after-tax $K_d$ = 5.0%. Weights: equity 80%, debt 20%.

$$\text{WACC} = 0.80 \times 10.0\% + 0.20 \times 5.0\% = 8.0\% + 1.0\% = \mathbf{9.0\%}$$

**UFCF inputs:** Year-1 UFCF = $130.0M, growing 5% per year; Year-5 EBITDA = $280M; exit multiple 8.0x; perpetual growth $g$ = 2.5%; net debt $400M.

| Year | UFCF | DF @ 9% (year-end) | PV (year-end) | DF @ 9% (mid-year) | PV (mid-year) |
|---|---|---|---|---|---|
| 1 | 130.00 | 0.9174 | 119.26 | 0.9578 | 124.52 |
| 2 | 136.50 | 0.8417 | 114.89 | 0.8787 | 119.95 |
| 3 | 143.33 | 0.7722 | 110.68 | 0.8062 | 115.55 |
| 4 | 150.49 | 0.7084 | 106.61 | 0.7396 | 111.31 |
| 5 | 158.02 | 0.6499 | 102.70 | 0.6785 | 107.22 |
| **Sum PV(UFCF)** | | | **554.14** | | **578.55** |

**Terminal value:**
- Gordon: TV = 158.02 × (1.025) ÷ (0.09 − 0.025) = 161.97 ÷ 0.065 = **$2,491.8M**. PV (year-end, ÷1.09^5) = 2,491.8 × 0.6499 = **$1,619.4M**.
- Exit multiple: TV = 8.0 × 280 = **$2,240.0M**. PV (year-end) = 2,240 × 0.6499 = **$1,455.8M**.

**Enterprise and equity value (year-end discounting):**
- EV (Gordon) = 554.14 + 1,619.4 = **$2,173.6M**; Equity = 2,173.6 − 400 = **$1,773.6M**.
- EV (exit multiple) = 554.14 + 1,455.8 = **$2,009.9M**; Equity = 2,009.9 − 400 = **$1,609.9M**.

**Mid-year impact (explicit FCFs):** PV of the five UFCFs rises from $554.1M to $578.6M, a 4.4% increase, simply because cash is received half a year sooner on average.

**Flagged disagreement (sources differ):** how to discount the **terminal value** under the mid-year convention is genuinely contested. One common approach discounts the Gordon TV at the same mid-year period as the final explicit cash flow (t = 4.5), because the perpetuity cash flows are themselves assumed to arrive mid-year. Another discounts an **exit-multiple** TV at the full t = 5.0, because an exit multiple represents a point-in-time sale value at the end of Year 5, not a stream of mid-year flows. Both are defensible; pick one, state it, and apply it consistently. The explicit-FCF mid-year treatment (periods 0.5, 1.5, ...) is not contested.

### VI.5 Paper LBO (entry to exit, with return attribution)

**Inputs:** entry EBITDA $100M; entry multiple 8.0x; financing 50% debt / 50% equity; hold 5 years; EBITDA grows 10% per year; exit multiple 8.0x (flat); free cash flow available for debt paydown averages $40M per year.

**Entry (sources and uses):**
- Entry EV = 8.0 × 100 = **$800M**
- Debt = 50% × 800 = $400M; **sponsor equity = $400M** (the plug)

**Operating path:**
- Year-5 EBITDA = 100 × (1.10)^5 = 100 × 1.6105 = **$161.05M**
- Cumulative debt paydown = 5 × $40M = $200M → **exit net debt = 400 − 200 = $200M**

**Exit:**
- Exit EV = 8.0 × 161.05 = **$1,288.4M**
- Exit equity value = 1,288.4 − 200 = **$1,088.4M**

**Returns:**
- **MOIC** = 1,088.4 ÷ 400 = **2.72x**
- **IRR** ≈ 2.72^(1/5) − 1 ≈ **22.2%** (consistent with the 3x-in-5-years ≈ 25% rule of thumb)

**Return attribution (the three levers):**
- EBITDA growth: ΔEBITDA × entry multiple = (161.05 − 100) × 8.0 = **+$488.4M** of EV
- Multiple expansion: ΔMultiple × exit EBITDA = (8.0 − 8.0) × 161.05 = **$0** (flat by assumption)
- Deleveraging: debt repaid converts to equity = **+$200M**
- Check: equity gain = 1,088.4 − 400 = $688.4M = 488.4 (EV growth) + 200 (debt paydown). **Reconciles.**

### VI.6 Fund return multiples

**Inputs:** paid-in capital $100M; cumulative distributions $120M; residual NAV $80M.
- DPI = 120 ÷ 100 = **1.20x**
- RVPI = 80 ÷ 100 = **0.80x**
- TVPI = (120 + 80) ÷ 100 = **2.00x** = DPI + RVPI. **Checks.**

### VI.7 European distribution waterfall (100% catch-up)

**Inputs:** LP paid-in capital $100M; total proceeds to distribute $200M; preferred return 8% compounded over 5 years; GP catch-up 100%; carry 20%.

- **Tier 1 — Return of capital:** LPs receive **$100M**. Remaining $100M.
- **Tier 2 — Preferred return:** 100 × (1.08^5 − 1) = 100 × 0.4693 = **$46.93M** to LPs. Remaining $53.07M. (LP cumulative: $146.93M.)
- **Tier 3 — GP catch-up:** GP receives 100% until it holds 20% of (preferred + catch-up). Solve $X = 0.20 \times (46.93 + X)$ → $0.8X = 9.386$ → $X =$ **$11.73M** to GP. Remaining $41.34M.
- **Tier 4 — 80/20 split:** LP gets 80% × 41.34 = **$33.07M**; GP gets 20% × 41.34 = **$8.27M**.

**Totals:** LP = 100 + 46.93 + 33.07 = **$180.0M**; GP = 11.73 + 8.27 = **$20.0M**.
Check: total profit = $100M; GP carry = $20M = exactly 20% of profit (the catch-up trues the GP up to 20% of *all* profit); LP = capital + 80% of profit = 100 + 80 = $180M. LP + GP = $200M. **Reconciles.**

### VI.8 Trading comps to implied share price

**Inputs:** peer median EV/EBITDA 9.0x; target EBITDA $50M; target net debt $100M; shares 10M.
- Implied EV = 9.0 × 50 = **$450M**
- Implied equity value = 450 − 100 = **$350M**
- Implied share price = 350 ÷ 10 = **$35.00**

---

## Part VII — Glossary

| Term | Definition |
|---|---|
| Accrual accounting | Recognizing revenue when earned and expenses when incurred, regardless of cash timing. |
| Amortization | Spreading the cost of a definite-lived intangible asset over its useful life; non-cash. |
| Basic vs diluted shares | Basic = common shares outstanding; diluted adds the net effect of in-the-money options, warrants, and convertibles. |
| Beta (β) | A stock's systematic risk relative to the market; an input to CAPM. |
| Capital call (drawdown) | A GP's request that LPs fund a portion of their commitments. |
| CAPM | Cost of equity = risk-free rate + beta × equity risk premium. |
| Carried interest (carry) | The GP's share of fund profits, typically 20%, earned after the hurdle. |
| Catch-up | Waterfall tier where the GP takes a large share (often 100%) until it reaches its target carry on all profit above return of capital. |
| Clawback | Provision forcing the GP to return excess carry if it was overpaid relative to final fund performance. |
| Co-investment | Direct investment into a single portfolio company alongside a lead GP, usually no-fee/no-carry. |
| Commitment | The total capital an LP pledges to a fund, called over time. |
| Comparable companies ("comps") | Valuation using public peers' trading multiples. |
| Continuation vehicle (CV) | A new fund a GP forms to hold assets rolled out of an aging fund; a GP-led secondary. |
| Control premium | The extra a buyer pays to control a company; why precedents exceed trading comps. |
| Cost of debt (Kd) | Interest rate on borrowing; used after-tax in WACC because interest is deductible. |
| Cost of equity (Ke) | Required return of equity holders; estimated via CAPM. |
| Deferred tax asset / liability | Timing differences between book and tax accounting that create future tax benefits (DTA) or obligations (DTL). |
| Depreciation | Spreading the cost of tangible PP&E over its useful life; non-cash. |
| Direct Alpha | A PME method returning the exact annualized rate of out/under-performance versus an index. |
| Distribution | Cash or stock returned by a fund to its LPs. |
| Dividend recapitalization | Raising new debt at a portfolio company to fund a distribution to the sponsor. |
| DPI | Distributions to Paid-In capital; realized, cash-in-hand multiple. |
| DCF | Discounted cash flow valuation: project cash flows and discount to present value. |
| EBITDA | Earnings before interest, taxes, depreciation, and amortization; a proxy for operating cash generation. |
| Enterprise value (EV) | Value of the whole operating business, independent of capital structure. |
| Equity value (market cap) | Value attributable to common shareholders; diluted shares × price. |
| Equity risk premium (ERP) | Expected return of the market over the risk-free rate. |
| Exit multiple | The EV/EBITDA assumed at sale; used for terminal value and LBO exit. |
| Free cash flow, unlevered (UFCF / FCFF) | Cash to all capital providers: NOPAT + D&A − capex − ΔNWC; discounted at WACC. |
| Free cash flow, levered (FCFE) | Cash to equity after interest and mandatory debt repayment; discounted at cost of equity. |
| General Partner (GP) | The fund manager. |
| Gordon growth (perpetuity) | Terminal value as a growing perpetuity: FCF×(1+g)/(WACC−g). |
| Gross vs net IRR | Before vs after fees and carry; the spread is fee drag. |
| Hurdle rate (preferred return) | Minimum LP return (commonly 8%) before the GP earns carry. |
| If-converted method | Treats in-the-money convertibles as converted shares and removes related interest. |
| Internal rate of return (IRR) | Annualized discount rate setting NPV of cash flows to zero; time-sensitive. |
| J-curve | The early-life dip in fund returns from fees and undeployed capital, recovering as exits occur. |
| Leveraged buyout (LBO) | Acquisition funded largely with debt repaid by the target's cash flow. |
| Limited Partner (LP) | A fund investor with limited liability. |
| Long-Nickels PME (ICM) | The original PME, producing an IRR from a synthetic public investment. |
| Kaplan-Schoar PME | PME producing a ratio; >1 means the fund beat the index. |
| Management fee | Annual fee (commonly ~2%) on committed or invested capital. |
| Mid-year convention | Discounting cash flows at 0.5, 1.5, 2.5... to reflect intra-year receipt. |
| Minority (noncontrolling) interest | The portion of a consolidated subsidiary not owned by the parent; added in the EV bridge. |
| MOIC | Multiple on invested capital; total proceeds ÷ invested; ignores time. |
| NAV | Net asset value; the GP's fair-value mark of remaining holdings. |
| NAV loan | Fund-level borrowing against the whole portfolio. |
| Net debt | Total debt minus cash and equivalents. |
| Net working capital (NWC) | Operating current assets minus operating current liabilities. |
| NOPAT | Net operating profit after tax: EBIT × (1 − tax rate). |
| Paid-in capital (PIC) | Cumulative capital actually called and funded. |
| PME | Public Market Equivalent; benchmarks a fund against a public index using its cash-flow timing. |
| Precedent transactions | Valuation using multiples paid in past M&A deals. |
| Preferred stock | A financing claim senior to common equity; added in the EV bridge. |
| Quartile (top-quartile) | Performance ranking against a vintage-and-strategy peer set. |
| RVPI | Residual value to Paid-In; the unrealized, GP-marked portion. |
| Secondaries | Buying/selling existing fund interests (LP-led or GP-led). |
| Sources and uses | The LBO funding table; total sources must equal total uses. |
| Stock-based compensation (SBC) | Non-cash equity compensation; added back in CFO. |
| Terminal value (TV) | Value of cash flows beyond the explicit forecast; via Gordon growth or exit multiple. |
| Treasury stock method (TSM) | Estimating diluted shares by assuming option proceeds repurchase shares at market. |
| TVPI | Total value to Paid-In = DPI + RVPI; total scorecard. |
| Vintage year | The year a fund starts investing; the unit of benchmarking. |
| WACC | Weighted average cost of capital; the blended required return used to discount UFCF. |
| Waterfall (American vs European) | Profit-split order; deal-by-deal (American) vs whole-fund (European). |
| Working capital change (ΔNWC) | Period change in NWC; an increase uses cash and is subtracted in FCF. |

---

## Part VIII — Flashcards (88, tagged by sub-topic and difficulty)

> Format: **Q[# · Sub-topic · Difficulty]** question — **A:** concise model answer.

**Accounting**

**Q1 · Accounting · Easy** — What are the three financial statements and what does each measure? **A:** Income statement (profitability over a period, accrual basis), balance sheet (assets, liabilities, equity at a point in time), cash flow statement (reconciles net income to the change in cash).

**Q2 · Accounting · Easy** — State the balance sheet equation. **A:** Assets = Liabilities + Shareholders' Equity.

**Q3 · Accounting · Easy** — What are the three sections of the cash flow statement? **A:** Operating (CFO), investing (CFI), financing (CFF).

**Q4 · Accounting · Medium** — How does net income connect the three statements? **A:** It is the bottom of the IS, the top of the CFS (start of CFO), and flows into retained earnings within equity on the BS.

**Q5 · Accounting · Medium** — How does the cash flow statement connect to the balance sheet? **A:** The CFS bottom line (net change in cash) equals the change in the BS cash line; ending cash ties out.

**Q6 · Accounting · Medium** — If depreciation rises $10 at a 40% tax rate, what happens to net income? **A:** Pre-tax income −$10, taxes −$4, net income −$6.

**Q7 · Accounting · Medium** — In that case, what happens to cash? **A:** CFO = −6 net income + 10 add-back = +$4; cash rises $4.

**Q8 · Accounting · Hard** — In that case, show the balance sheet balances. **A:** Cash +4, PP&E −10 → assets −6; retained earnings −6 → equity −6. Balances.

**Q9 · Accounting · Easy** — Why is depreciation added back in CFO? **A:** It reduced net income but consumed no cash this period.

**Q10 · Accounting · Medium** — Why does depreciation matter if it isn't cash? **A:** It is a tax shield: it lowers taxable income, so the company keeps cash it would otherwise pay in taxes.

**Q11 · Accounting · Medium** — Define operating net working capital. **A:** Operating current assets (AR, inventory, prepaids) minus operating current liabilities (AP, accrued expenses); excludes cash and debt.

**Q12 · Accounting · Medium** — Why is an increase in accounts receivable a use of cash? **A:** Revenue was booked but not yet collected, so accrual income overstates cash received.

**Q13 · Accounting · Medium** — Why is an increase in accounts payable a source of cash? **A:** You received goods/services but have not paid, conserving cash.

**Q14 · Accounting · Hard** — Can a profitable company run out of cash? **A:** Yes; rapid growth that funds rising receivables and inventory ahead of collection drains cash despite positive net income.

**Q15 · Accounting · Easy** — Difference between depreciation and amortization? **A:** Depreciation is for tangible PP&E; amortization is for definite-lived intangibles. Both non-cash.

**Q16 · Accounting · Medium** — Is goodwill amortized under US GAAP? **A:** No; it is tested for impairment and written down only if impaired.

**Q17 · Accounting · Hard** — What creates a deferred tax liability? **A:** Book tax expense exceeding cash taxes now (for example accelerated tax depreciation vs straight-line book), reversing later.

**Q18 · Accounting · Hard** — What creates a deferred tax asset? **A:** Paying more cash tax than book expense now (for example NOL carryforwards, reserves), a future benefit.

**Q19 · Accounting · Hard** — How does a $10 increase in a DTL affect the CFS? **A:** Added back in CFO; it lowered book net income via the tax line without using cash.

**Q20 · Accounting · Medium** — A company sells inventory it paid $10 cash for, for $15 on credit. Walk the immediate cash impact. **A:** No cash collected yet (AR +15), inventory −10; net income +5 (gross), but cash unchanged until AR is collected.

**Q21 · Accounting · Hard** — A company writes down inventory by $10 (tax 25%). Net income and cash effect? **A:** Pre-tax −10, taxes −2.5, net income −7.5; CFS adds back the 10 non-cash write-down, so CFO and cash +2.5.

**Enterprise & Equity Value**

**Q22 · EV · Easy** — Define enterprise value in one sentence. **A:** The value of the entire operating business, independent of capital structure.

**Q23 · EV · Easy** — Define equity value. **A:** Value to common shareholders: diluted shares × price.

**Q24 · EV · Medium** — Write the EV bridge. **A:** EV = Equity value + Debt + Preferred + Minority interest − Cash.

**Q25 · EV · Medium** — Why add debt? **A:** A buyer must repay/assume it; debt holders' claim is part of the cost of the whole business.

**Q26 · EV · Medium** — Why subtract cash? **A:** Cash is non-operating, can offset the purchase price, and its interest income is not in EBITDA.

**Q27 · EV · Hard** — Why add minority interest? **A:** Consolidated EBITDA includes 100% of a partly-owned subsidiary, but equity value reflects only the parent's share; adding MI makes numerator and denominator consistent.

**Q28 · EV · Medium** — Why add preferred stock? **A:** It is a financing claim senior to common equity, part of the capital funding the enterprise.

**Q29 · EV · Hard** — Can enterprise value be negative? **A:** Yes, when cash exceeds debt plus equity value; rare, seen in distressed or extremely cash-rich firms.

**Q30 · EV · Medium** — Which multiples pair with EV vs equity value? **A:** EV pairs with revenue/EBITDA/EBIT; equity value pairs with net income (P/E), book value (P/B).

**Q31 · EV · Hard** — If a company issues $100 of stock to buy $100 of equipment, what happens to EV? **A:** Equity value +100, but cash unchanged and debt unchanged; EV is roughly flat (the new equity is offset by the operating asset acquired, not a financing change to net debt).

**Q32 · TSM · Medium** — Walk through the treasury stock method. **A:** For in-the-money options: proceeds = options × strike; shares bought back = proceeds ÷ price; net new shares = options − buyback; add to basic shares.

**Q33 · TSM · Easy** — Are out-of-the-money options dilutive under TSM? **A:** No; only in-the-money instruments are included.

**Q34 · TSM · Medium** — 10M options, $20 strike, $50 price: net new shares? **A:** Proceeds $200M; buyback 4M; net new = 6M.

**Q35 · TSM · Hard** — How are convertible bonds treated for diluted shares? **A:** If-converted method: if in the money, add converted shares and add back the after-tax interest expense.

**Valuation**

**Q36 · Valuation · Easy** — Name the three core valuation methods. **A:** Trading comps, precedent transactions, DCF.

**Q37 · Valuation · Medium** — Why is EV/EBITDA preferred to P/E for cross-company comparison? **A:** It is neutral to capital structure, tax regime, and non-cash D&A.

**Q38 · Valuation · Medium** — Why do you usually use the median multiple in comps, not the mean? **A:** The median resists distortion from outliers.

**Q39 · Valuation · Medium** — Which typically gives higher values, precedents or trading comps, and why? **A:** Precedents, because buyers pay a control premium and for synergies.

**Q40 · Valuation · Medium** — What is a control premium? **A:** The extra paid to acquire control of a company versus its public trading price.

**Q41 · Valuation · Easy** — When is P/E the right multiple? **A:** For banks and insurers, where capital structure is the business, and broadly for equity-holder comparisons.

**Q42 · Valuation · Medium** — Walk through building unlevered free cash flow. **A:** EBIT × (1 − tax) = NOPAT; + D&A; − capex; − change in NWC.

**Q43 · Valuation · Medium** — Why is UFCF discounted at WACC, not cost of equity? **A:** It is pre-interest cash to all capital providers, so it must be discounted at the blended cost of all capital.

**Q44 · Valuation · Hard** — What does discounting UFCF at WACC give you, and how do you reach equity value? **A:** Enterprise value; then subtract net debt, preferred, and minority interest and divide by diluted shares.

**Q45 · Valuation · Medium** — Write the WACC formula. **A:** WACC = (E/V)Ke + (D/V)Kd(1 − t).

**Q46 · Valuation · Medium** — Why use after-tax cost of debt in WACC? **A:** Interest is tax-deductible, so the effective cost is lower by the tax shield.

**Q47 · Valuation · Medium** — Write CAPM for cost of equity. **A:** Ke = risk-free rate + beta × equity risk premium.

**Q48 · Valuation · Hard** — How do you get beta for a private company? **A:** Take comparable public betas, unlever them, and relever to the target's capital structure.

**Q49 · Valuation · Medium** — State the Gordon growth terminal value formula. **A:** TV = FCF_n × (1 + g) ÷ (WACC − g).

**Q50 · Valuation · Medium** — State the exit-multiple terminal value formula. **A:** TV = terminal-year EBITDA × exit EV/EBITDA multiple.

**Q51 · Valuation · Hard** — What should the perpetual growth rate be capped at and why? **A:** At or below long-run GDP/inflation (about 2% to 3%); nothing can outgrow the economy forever, and g must be below WACC.

**Q52 · Valuation · Hard** — Roughly what share of DCF value sits in terminal value, and why does that matter? **A:** Often 60% to 80%; it makes the DCF highly sensitive to terminal assumptions.

**Q53 · Valuation · Medium** — What is the mid-year convention and its effect? **A:** Discounting at 0.5, 1.5, 2.5... to reflect intra-year cash receipt; it modestly raises value.

**Q54 · Valuation · Hard** — Name one cross-check between the two terminal value methods. **A:** Back out the implied growth rate from the exit multiple and the implied multiple from the growth rate; large discrepancies flag an error.

**Q55 · Valuation · Medium** — Why might two firms with identical financials be valued differently? **A:** Differences in growth, margins, risk, capital structure, market sentiment, and peer-set or deal-environment context.

**Q56 · Valuation · Hard** — How does raising the discount rate affect a DCF, all else equal? **A:** Lowers present value of all future cash flows and terminal value, reducing the valuation.

**LBO**

**Q57 · LBO · Easy** — What is a leveraged buyout? **A:** Acquiring a company mostly with debt that the target's own cash flow repays.

**Q58 · LBO · Medium** — Why does leverage raise equity returns? **A:** A smaller equity check against the same value creation lifts the percentage return; cheaper debt replaces costly equity.

**Q59 · LBO · Hard** — Name the three levers of LBO value creation. **A:** EBITDA growth, multiple expansion, and debt paydown (deleveraging).

**Q60 · LBO · Medium** — What makes a good LBO candidate? **A:** Stable predictable cash flows, low capex, defensible position, room to improve operations or repay debt.

**Q61 · LBO · Medium** — What goes in sources and uses? **A:** Uses: equity/EV purchase, debt refinancing, fees, cash to balance sheet. Sources: new debt, sponsor equity, rollover, excess cash. They must equal.

**Q62 · LBO · Medium** — What is the equity in a sources-and-uses table? **A:** The plug: total uses minus all non-equity sources.

**Q63 · LBO · Easy** — Define MOIC. **A:** Total equity proceeds ÷ equity invested; a cash-on-cash multiple ignoring time.

**Q64 · LBO · Easy** — Define IRR. **A:** The annualized discount rate setting NPV of equity cash flows to zero; time-sensitive.

**Q65 · LBO · Medium** — Rule of thumb: 3x over 5 years is roughly what IRR? **A:** About 25%. (2x in 5 years is about 15%.)

**Q66 · LBO · Medium** — What is a dividend recapitalization? **A:** Raising new debt at a portfolio company to pay the sponsor a distribution, pulling returns forward without a sale.

**Q67 · LBO · Hard** — In a paper LBO with flat multiple, where do returns come from? **A:** EBITDA growth and debt paydown only; multiple expansion contributes zero.

**Q68 · LBO · Hard** — Why has the leverage lever weakened recently? **A:** Borrowing costs near 8% to 9% and leverage down to roughly 30% to 40% of EV from about 50% a decade ago, so debt does less of the work (Bain 2026).

**Q69 · LBO · Hard** — What does Bain mean by "12 is the new 5"? **A:** Deals now need roughly 12% annual EBITDA growth, versus about 5% historically, to hit similar returns without leverage and multiple-expansion tailwinds (Bain 2026).

**Q70 · LBO · Medium** — Why is interest deductibility relevant to an LBO? **A:** It shields income from tax, improving cash available to service debt and equity.

**Fund-Investing / LP**

**Q71 · Fund · Easy** — Who are the GP and the LPs? **A:** GP is the manager who runs the fund and deals; LPs are the investors who commit capital with limited liability.

**Q72 · Fund · Easy** — Difference between commitment and paid-in capital? **A:** Commitment is pledged; paid-in is what has actually been called and funded.

**Q73 · Fund · Medium** — What is the J-curve and what causes it? **A:** Early negative net returns from fees and undeployed capital before exits; it recovers as investments mature and are realized.

**Q74 · Fund · Medium** — Define DPI, RVPI, TVPI. **A:** DPI = distributions ÷ paid-in (realized); RVPI = residual NAV ÷ paid-in (unrealized); TVPI = DPI + RVPI.

**Q75 · Fund · Medium** — Why do LPs increasingly prioritize DPI over IRR? **A:** DPI is real cash returned and cannot be inflated by marks; a multi-year liquidity drought has made distributions paramount (an ILPA survey put DPI as the top re-up criterion for ~74% of LPs).

**Q76 · Fund · Hard** — How can a GP inflate IRR without improving MOIC? **A:** Use a subscription/NAV credit line to delay calling LP capital, shortening the period capital is at risk.

**Q77 · Fund · Medium** — Gross vs net IRR? **A:** Gross is before fund fees and carry; net is after, the LP's actual return; the spread is fee drag.

**Q78 · Fund · Medium** — What is "2 and 20"? **A:** Roughly a 2% annual management fee plus 20% carried interest, the latter subject to a hurdle.

**Q79 · Fund · Medium** — What is a hurdle / preferred return and a typical level? **A:** The minimum LP return (commonly about 8%) the fund must clear before the GP earns carry.

**Q80 · Fund · Hard** — Explain the GP catch-up. **A:** After LPs receive the preferred, the GP takes a large share (often 100%) until it holds its target carry (for example 20%) of all profit above return of capital.

**Q81 · Fund · Hard** — European vs American waterfall? **A:** European (whole-fund): no GP carry until all LP capital plus preferred is returned across the fund; LP-friendly. American (deal-by-deal): GP takes carry per profitable exit; GP-friendly with clawback risk.

**Q82 · Fund · Medium** — What is a clawback? **A:** A requirement that the GP repay excess carry if it was overpaid relative to final fund performance; most relevant under American waterfalls.

**Q83 · Fund · Hard** — What is PME and what question does it answer? **A:** Public Market Equivalent; it asks whether the fund beat a public index bought and sold on the fund's cash-flow timing.

**Q84 · Fund · Hard** — KS-PME vs Long-Nickels PME? **A:** KS-PME (2005) returns a ratio (>1 = outperformance) and avoids negative-NAV breakdown; Long-Nickels (1996) returns an IRR via a synthetic public NAV but can break when fund performance is strong.

**Q85 · Fund · Hard** — One key limitation of PME? **A:** It is highly sensitive to index choice (a mismatch can distort the result 20% to 30%) and does not risk-adjust.

**Q86 · Fund · Medium** — Why are co-investments attractive to LPs? **A:** Usually no-fee/no-carry, capital deployed fast (~100% up front), flatter/shorter J-curve, higher net return on the same deal, and selective exposure.

**Q87 · Fund · Hard** — Name two risks of co-investing. **A:** Concentration/single-asset risk and adverse selection (the GP may share its weaker deals); plus tight diligence timelines and passive, non-controlling positions.

**Q88 · Fund · Medium** — Why do "primaries" and "co-investments" sit on one team? **A:** GPs offer co-invest dealflow chiefly to their largest primary-fund LPs as an inducement to commit; the primary relationship is the gateway to co-investment.

---

## Part IX — Interview-Style Questions (full model answers)

**1. Walk me through the three financial statements.**
The income statement shows profitability over a period on an accrual basis, from revenue down to net income. The balance sheet is a point-in-time snapshot where assets equal liabilities plus equity. The cash flow statement reconciles accrual net income to the actual change in cash across operating, investing, and financing activities. They link: net income flows from the bottom of the IS to the top of the CFS and into retained earnings on the BS; the CFS explains the change in the BS cash line; non-cash charges and working-capital changes adjust net income to arrive at cash; capex, debt, and equity activity tie the CFS to the asset and capital lines of the BS. The model is self-checking because every change must keep the balance sheet in balance.

**2. If depreciation increases by $10 (40% tax), walk me through the statements.**
On the income statement, pre-tax income falls $10, taxes fall $4, net income falls $6. On the cash flow statement, I start at net income down $6, add back the $10 non-cash depreciation, so operating cash flow rises $4 and cash rises $4. On the balance sheet, cash is up $4 and PP&E is down $10, so assets fall $6; net income down $6 reduces retained earnings, so equity falls $6. Assets down $6 equals equity down $6, so it balances. The takeaway is the tax shield: the company keeps $4 of cash it would otherwise pay in taxes.

**3. A company buys $10 of inventory with cash. Walk me through the statements.**
No income statement impact yet, because nothing has been sold (inventory is capitalized, not expensed). On the cash flow statement, inventory rises $10, which is a use of cash, so operating cash flow and cash fall $10. On the balance sheet, inventory is up $10 and cash is down $10, so total assets are unchanged and it balances. The expense hits later through cost of goods sold when the inventory is sold.

**4. Walk me through the enterprise-value-to-equity bridge and justify each line.**
Enterprise value equals equity value plus debt plus preferred stock plus minority interest minus cash. I add debt because a buyer must repay or assume it. I subtract cash because it is non-operating, can reduce the net purchase price, and its interest income is excluded from EBITDA. I add preferred because it is a financing claim senior to common. I add minority interest because consolidated EBITDA includes all of a partly-owned subsidiary while equity value includes only the parent's share, so I align the numerator with the denominator. Enterprise value is capital-structure neutral, which is why it pairs with revenue, EBITDA, and EBIT.

**5. Walk me through a DCF.**
I project unlevered free cash flow for five to ten years as NOPAT plus D&A minus capex minus the change in net working capital. I discount those flows at WACC, which blends the after-tax cost of debt and the CAPM cost of equity at market-value weights. I add a terminal value, either via Gordon growth, last-year FCF times one plus g over WACC minus g, or via an exit EV/EBITDA multiple, and I cross-check the two. I discount the terminal value back and sum it with the explicit flows to get enterprise value, often using the mid-year convention. Finally I bridge from enterprise to equity value by subtracting net debt, preferred, and minority interest, then divide by diluted shares for an implied price. The biggest sensitivities are WACC and the terminal value, which usually drives most of the total.

**6. Why might two companies with identical current financials trade at different valuations?**
Valuation reflects the future, not just the present. Differences in expected growth, margin trajectory, returns on capital, business and financial risk, capital structure, quality and predictability of cash flows, management, and the comparability of the peer set all move the multiple. Market sentiment and liquidity matter too. Two identical income statements can imply very different enterprise values once you account for where each business is going and how certain that path is.

**7. Why does a leveraged buyout generate returns, and how does leverage help?**
Three levers: growing EBITDA, expanding the exit multiple, and paying down debt. Leverage amplifies equity returns because the sponsor funds a smaller share of the purchase with expensive equity and a larger share with cheaper, tax-deductible debt; the target's own cash flow then repays that debt over the hold, converting enterprise value into equity value. The same dollar of value creation against a smaller equity base is a higher percentage return. The risk is symmetric: leverage magnifies losses and raises distress risk, so the ideal target has stable, predictable cash flows and low capex.

**8. Walk me through a paper LBO.**
Take entry EBITDA of $100M at an 8.0x multiple, so entry enterprise value is $800M, funded half with debt ($400M) and half with sponsor equity ($400M). Over a five-year hold EBITDA grows 10% a year to about $161M, and free cash flow pays down roughly $200M of debt, leaving $200M. At a flat 8.0x exit, enterprise value is about $1,288M and equity value is $1,088M after the remaining debt. That is a 2.72x MOIC and roughly a 22% IRR. Attribution: EBITDA growth added about $488M of enterprise value, multiple expansion added zero because the multiple was flat, and $200M of debt paydown converted to equity; $488M plus $200M equals the $688M equity gain.

**9. As an LP, what metrics do you use to judge a fund, and what are their limits?**
I look at IRR and a multiple together, net of fees. TVPI is the total scorecard and equals DPI plus RVPI; DPI is realized cash and RVPI is GP-marked paper value. I weight DPI heavily because it cannot be inflated by optimistic marks, and most LPs now treat it as the primary re-up criterion given the liquidity environment. IRR is time-sensitive but can be gamed with credit lines that delay capital calls and assumes reinvestment at the IRR. NAV-based metrics depend on the GP's fair-value judgment. So I triangulate IRR, MOIC/TVPI, and DPI, then benchmark against the right vintage and strategy and run a PME against public markets.

**10. Explain the distribution waterfall and what protects LPs.**
Proceeds flow in tiers: first return of capital to LPs, then a preferred return around 8%, then a GP catch-up where the GP takes a large share until it reaches its carry on all profit above capital, then an 80/20 split of the rest. LP protection comes from the structure. A European whole-fund waterfall pays the GP no carry until all LP capital and preferred are returned across the entire fund, which is the strongest protection. An American deal-by-deal waterfall pays the GP earlier and relies on a clawback, carry escrow of roughly a quarter to a third, and sometimes personal guarantees to claw back any overpayment if later deals disappoint.

**11. What is PME and why do LPs care?**
PME compares a fund to what an LP would have earned investing the same cash flows, on the same dates, in a public index. It is the honest opportunity-cost test for an illiquid, fee-heavy asset class. The Kaplan-Schoar method returns a ratio above or below one; the Long-Nickels method returns an IRR you compare to the fund's. LPs care because beating a fund's own IRR target is meaningless if a cheap index would have done better. The main caveats are sensitivity to the chosen index, which can swing the result materially, and that PME does not adjust for the extra leverage and illiquidity risk private equity carries.

**12. Why are co-investments attractive, and what would worry you about a specific co-invest?**
They are usually no-fee and no-carry, so the LP keeps more of the same deal's return; capital deploys fast because nearly all of it funds one identified company, which flattens and shortens the J-curve by roughly a year to a year and a half; and the LP can choose deals to shape its exposure. What would worry me is adverse selection: I would test whether the GP is sharing a genuinely strong deal or syndicating the piece it is least comfortable holding. I would also flag the concentration of a single asset, the compressed diligence window, and that I am a passive, non-controlling holder dependent on the lead GP's execution.

**13. EV/EBITDA versus P/E: when and why?**
EV/EBITDA is the default for comparing operating businesses because it is neutral to capital structure, tax regime, and non-cash D&A, so two companies with different leverage are comparable. P/E uses equity value and net income, which are distorted by leverage and taxes, but it is the right lens for banks and insurers, where capital structure is the business, and for quick equity-holder comparisons. I would not compare a heavily levered firm to an unlevered one on P/E; I would use EV/EBITDA.

**14. Precedent transactions versus trading comps: which is higher and why?**
Precedents are usually higher. Trading comps reflect where public peers trade today on a minority basis, with no control. Precedents reflect prices actually paid in deals, which include a control premium and often the value of expected synergies, so the multiples are richer. The offsetting issue is that precedents are dated: a deal struck under cheaper financing and frothier conditions overstates what a buyer would pay now, so I weight recency and the comparability of the deal environment.

**15. A company takes a $100 non-cash goodwill impairment (tax effect ignored, as impairments are often non-deductible). Walk the statements.**
On the income statement, the $100 impairment is an expense, so pre-tax income and net income fall $100 (no tax benefit if non-deductible). On the cash flow statement, I start at net income down $100 and add back the $100 non-cash impairment, so operating cash flow and cash are unchanged. On the balance sheet, goodwill falls $100 on the asset side and net income down $100 reduces retained earnings, so equity falls $100; assets down $100 equals equity down $100 and it balances. The point: impairments hit earnings and equity but not cash.

---

## Part X — Formula Appendix

- Balance sheet identity: **Assets = Liabilities + Shareholders' Equity**
- Depreciation flow-through (rate t): **ΔNet income = −Dep × (1 − t); ΔCash = +Dep × t; ΔPP&E = −Dep**
- Net working capital (operating): **NWC = (AR + Inventory + Prepaids) − (AP + Accrued liabilities)**
- Enterprise value: **EV = Equity Value + Debt + Preferred + Minority Interest − Cash**
- Equity value: **Equity Value = Diluted Shares × Share Price**
- Treasury stock method: **Net new shares = Options − (Options × Strike) / Current Price** (in-the-money only)
- Unlevered FCF: **UFCF = EBIT × (1 − t) + D&A − Capex − ΔNWC**
- WACC: **WACC = (E/V)·Ke + (D/V)·Kd·(1 − t)**
- CAPM: **Ke = Rf + β × ERP**
- Gordon growth TV: **TV = UFCFₙ × (1 + g) / (WACC − g)**
- Exit multiple TV: **TV = Terminal EBITDA × Exit EV/EBITDA**
- Present value: **PV = CFₜ / (1 + r)ᵗ**; mid-year uses **t = 0.5, 1.5, 2.5, ...**
- MOIC: **MOIC = Total Equity Proceeds / Equity Invested**
- IRR (single flow approximation): **IRR ≈ MOIC^(1/years) − 1**
- DPI = **Distributions / Paid-In**; RVPI = **NAV / Paid-In**; TVPI = **(Distributions + NAV) / Paid-In = DPI + RVPI**
- KS-PME = **FV(Distributions + terminal NAV, grown at index) / FV(Contributions, grown at index)**; >1 = outperformance
- LBO exit equity = **(Exit EBITDA × Exit Multiple) − Exit Net Debt**
- LBO return attribution: **Equity gain = (ΔEBITDA × entry multiple) + (ΔMultiple × exit EBITDA) + Debt paydown**

---

## Part XI — Sources

Core mechanics in Parts I to IV are standard finance/accounting fundamentals (the categories map to the Breaking Into Wall Street / Mergers & Inquisitions "400 Investment Banking Interview Questions" and Wall Street Prep curricula). Citations below cover the non-obvious, empirical, and methodological claims.

**Fund metrics and economics**
- ILPA reporting conventions and DPI/RVPI/TVPI definitions: Apers, "TVPI, DPI, and RVPI" (apers.app); Ryan O'Connell, CFA, PE Returns Calculator; Linnovate Partners, PE/VC performance metrics guide.
- DPI primacy (≈74% of LPs rank DPI as primary re-up criterion; NAV-loan caution): Angel Investors Network, "TVPI in Private Equity" (citing an ILPA survey); Apers.
- J-curve mechanics: Wall Street Prep, "J-Curve"; Carta, "J-Curve."

**Fees and waterfalls**
- 2-and-20, hurdle ~8% (7% to 9%), catch-up, clawback, American vs European: Allvue Systems, "American vs. European Waterfall" and "Understanding PE Waterfalls"; Carta, "Hurdle Rate"; Alter Domus, "How PE Waterfalls Work"; Origin Investments, "Waterfalls, Clawbacks & Catch-Up Clauses"; Angel Investors Network, "Preferred Return & Hurdle Rate."

**PME methodology**
- Kaplan, S. and Schoar, A. (2005), "Private Equity Performance: Returns, Persistence, and Capital Flows," *Journal of Finance*. Long, A. and Nickels, C. (1996), "A Private Investment Benchmark" (the Index Comparison Method). Sorensen, M. and Jagannathan, R. (2013), "The Public Market Equivalent and Private Equity Performance," SSRN (formal justification of KS-PME). Method comparisons and index-sensitivity: Allvue, "Understanding PME Benchmarking"; Carta, "PME"; Esinli Capital, "PME"; TSG Performance / J. Reyes, "PME Benchmarking Methods and Analysis."

**Co-investments and secondaries**
- No-fee/no-carry, ~100% upfront deployment, J-curve reduction of 12 to 18 months (BlackRock estimate), adverse-selection and access dynamics: Russell Investments, "The J-curve in private equity—and how to potentially beat it"; Petiole, "The J-Curve... and How To Beat It"; Neuberger Berman, "Evergreen Private Equity Investing"; Wikipedia, "Equity co-investment."

**Current market data**
- Bain & Company, *Global Private Equity Report 2026* (Feb 2026): leverage 30% to 40% of EV (~36% in 2025 vs ~50% in 2015), borrowing costs 8% to 9%, "12 is the new 5," ~$3.8T unrealized value, holding periods ~7 years, distributions/NAV ~14%, illustrative entry ~14.0x in 2025. Bain press release (Feb 23, 2026); "Welcome to a New Era"; CFO.com summary; Moonfare, "five takeaways from Bain's PE Outlook." Bain *Asia-Pacific PE Report 2026*: APAC deal multiples 13.4x. Bain *Global PE Report 2025*: North American average ~11.9x EV/EBITDA (SPI by StepStone).

**Definitions (general anchors):** Investopedia and CFA Institute curriculum for standard term definitions; Wall Street Prep and Macabacus for modeling conventions.

**Flagged disagreements:**
1. **Terminal value under the mid-year convention** (Part VI.4): practitioners differ on whether to discount the TV at t = 4.5 or t = 5.0; both are used. The explicit-FCF mid-year treatment is not contested.
2. **"Standard" PME method**: KS-PME dominates academic and much practitioner usage, but Bain reports its headline PME comparisons using Long-Nickels (ICM), so the convention varies by publisher.
3. **Tax rate in flow-through questions**: the interview-standard 40% is used here; current US combined rates are closer to 21% federal / ~25% to 26% combined, which changes the arithmetic though not the logic.
4. **Net working capital definition**: the cash-flow/DCF "operating NWC" excludes cash and short-term debt, whereas the textbook "current assets minus current liabilities" includes them; confirm which the interviewer means.
