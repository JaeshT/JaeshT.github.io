# Building an LBO Model to Underwrite a Co-Investment: A Complete Study Guide

## How to read this guide and one blunt framing point before you start

You are joining an LP-side Primaries and Co-investments team, not a GP deal team. That distinction shapes everything. A GP builds an LBO model to *win and run* a deal. You build the same model to *decide whether to write a check alongside a GP who has already decided to do the deal*. Your job is substantially adversarial: you are re-underwriting someone else's thesis, usually on a compressed timeline (often two to four weeks), usually with the GP's own model in hand, and your primary value-add is catching the places where the GP's base case is really an upside case wearing a base-case label.

Here is the counterpoint you should internalize before you fall in love with co-investing: the academic evidence that co-investments are a free lunch is genuinely contested. Fang, Ivashina, and Lerner found that co-investments underperform the corresponding funds with which they co-invest, consistent with adverse selection: GPs may syndicate the deals they are least excited about. Braun, Jenkinson, and Schemmerl, using a larger sample, found no evidence of adverse selection, similar gross return distributions, and net outperformance for reasonably sized co-investment portfolios because of fee savings. Both are top-journal papers and they disagree. The practical lesson is that the modeling discipline below is not academic box-ticking. The fee savings are real and mechanical; the return edge is only real if your underwriting is good enough to avoid the lemons. The model is your screen.

The guide threads a single worked deal through every section so the numbers in Sources & Uses feed the operating build, which feeds the debt schedule, which feeds free cash flow, which feeds returns and the value bridge. All figures are computed and internally consistent. Dollar figures are in millions (USDm) unless noted.

---

## Part 0: What is an LBO and what is different about a co-investment model

A leveraged buyout is the acquisition of a company financed with a large slug of debt and a smaller slug of equity, where the debt is serviced and repaid out of the target's own cash flows, and the sponsor's equity return is amplified by that leverage. Three engines drive the equity return:

1. **EBITDA growth** (grow the earnings base, through revenue and/or margin).
2. **Multiple expansion** (sell at a higher EV/EBITDA than you paid; the least reliable engine and the one disciplined LPs refuse to underwrite to).
3. **Deleveraging / free-cash-flow generation** (use the company's cash to pay down debt, so a larger share of a roughly constant enterprise value accrues to equity at exit).

The value-creation bridge in Part 8 decomposes the realized return into exactly these buckets.

What is different when you model a co-investment specifically:

- **Fees and carry**: Co-investments are typically offered to LPs at no fee and no carry, or at materially reduced economics. This is the single biggest structural reason co-investing can beat a fund commitment: for a fund, gross 2.5x can become net ~2.0x after the 2-and-20 drag; for a no-fee co-invest, gross ≈ net. Your model should produce both a deal-level (gross) return and your LP's net return after any co-invest-vehicle costs.
- **J-curve and pacing**: Co-investments deploy capital immediately and in size, which front-loads invested capital and can improve fund-level IRR timing relative to a primary fund commitment that draws down slowly over four to five years.
- **Concentration and selection**: A single co-investment is a concentrated, single-name bet with no diversification. This is why the Braun et al. result is conditioned on holding a *portfolio* of co-investments. One bad co-invest is not diversified away.
- **You distrust the model you are given**: The GP's model is a sales document. Standard LP practice is to rebuild it independently, then sensitize the GP's assumptions downward (lower exit multiple, slower growth, higher rates) and ask whether the deal still clears your hurdle in a credible downside.

---

## Part 1: Transaction assumptions (entry multiple and purchase price)

### Concept

The model's spine is the **entry enterprise value (EV)**, almost always set as a multiple of a trailing or forward EBITDA:

`Entry EV = Entry EV/EBITDA multiple × Entry EBITDA`

EBITDA (earnings before interest, taxes, depreciation, and amortization) is the standard proxy for a buyout target's pre-financing, pre-tax cash earnings, because it is roughly capital-structure-neutral and lets buyers compare targets on operations rather than on how the prior owner financed them. The entry multiple is set by the market for comparable assets. As context for what "the market" means right now: the average North American buyout multiple rebounded to 11.9 times EBITDA in 2024, while European multiples hit a record 12.1 times EBITDA, per SPI by StepStone data in Bain's 2025 report. For this reason our worked deal uses an 11.0x entry multiple, slightly below the U.S. average for clean arithmetic.

A critical vocabulary distinction your interviewers will test:

- **Enterprise value (EV)** is the value of the whole operating business, the claim of all capital providers (debt + equity), independent of how it is financed.
- **Equity value** is what the equity owners get: `Equity value = EV − Net debt`, where `Net debt = Total debt − Cash`.

Most LBOs are negotiated and modeled on a **cash-free, debt-free (CFDF)** basis: the buyer pays for the enterprise, the seller's existing debt is repaid at close, and the seller keeps (or is paid for) the cash. We adopt CFDF for the worked example.

### Worked example: entry assumptions

| Input | Value | Note |
|---|---|---|
| Entry LTM EBITDA (Year 0) | 100.0 | last-twelve-months EBITDA at close |
| Entry revenue (Year 0) | 500.0 | implies 20.0% EBITDA margin |
| Entry EV/EBITDA multiple | 11.0x | below current U.S. average for clean math |
| **Entry enterprise value (EV)** | **1,100.0** | `= 11.0 × 100.0` |

### Excel formulas (transcribed)

Assume a clean layout: assumptions live in column B; the time series runs Year 0 in column E, Years 1 to 5 in columns F through J. Suppose `Entry_EBITDA` is in cell `B3`, `Entry_Multiple` in `B4`.

- Entry EV in `B5`: `=B3*B4`
- If you instead anchor on a forward multiple, you would reference next year's EBITDA: `=F_EBITDA*B4`.
- Implied entry equity value (used later in the bridge), in `B7`: `=B5-Entry_Net_Debt` where for a CFDF deal entry net debt equals the new debt raised, so `=B5-B_TotalDebt`.

**Cell-by-cell logic**: `B5` holds the price of the whole business. It is fed by exactly two inputs, the earnings base (`B3`) and the price the market puts on a dollar of those earnings (`B4`). Everything downstream, the debt capacity, the equity check, and the exit value, scales off this one cell, which is why sensitivity tables almost always put the entry and exit multiple on one axis.

---

## Part 2: Sources & Uses

### Concept

Sources & Uses (S&U) is the close-of-deal funding ledger. **Uses** is every dollar that must be paid at close. **Sources** is every dollar raised to pay for them. The two must equal, and the equity check is the plug:

`Sponsor equity = Total uses − Total debt raised − any other sources`

Uses typically include the purchase enterprise value (or equity purchase price plus refinanced debt), transaction fees (M&A advisory, legal), and financing fees (underwriting, original issue discount, arrangement fees on the debt). Sources are the debt tranches plus sponsor equity plus any management rollover.

How much debt? Leverage is quoted as a multiple of EBITDA. In 2024 debt ratios climbed to 4.9 times EBITDA, still well below pre-pandemic levels, per Bain's 2025 report, and the structure has shifted toward private credit: direct lending provided roughly 90% of middle-market buyout financing by the end of 2024. Bain's 2026 report frames leverage as debt divided by enterprise value at roughly 36% in 2025, down from roughly 50% a decade earlier. Our worked deal uses 5.0x total leverage, which at an 11.0x purchase multiple is about 45% debt/EV, deliberately a touch more levered than today's average to make the debt schedule mechanics worth studying.

### Worked example: Sources & Uses

**Uses**

| Use | Amount | Note |
|---|---|---|
| Purchase enterprise value | 1,100.0 | `= 11.0 × 100.0` |
| Transaction & financing fees | 35.0 | advisory + legal + financing fees/OID |
| **Total uses** | **1,135.0** | |

**Sources**

| Source | Amount | × EBITDA | Note |
|---|---|---|---|
| Term Loan B (TLB) | 400.0 | 4.0x | floating, amortizing, sweeps |
| Senior Notes | 100.0 | 1.0x | fixed, bullet (no amortization) |
| Revolver (RCF) | 0.0 | — | undrawn at close, backstop only |
| Total debt | 500.0 | 5.0x | |
| Sponsor equity (plug) | 635.0 | — | `= 1,135.0 − 500.0` |
| **Total sources** | **1,135.0** | | must equal total uses |

Note the wedge that matters for the bridge later: the *implied* entry equity value of the business is `EV − net debt = 1,100 − 500 = 600`, but the sponsor writes a **635** check because the **35** of fees is funded with equity. That 35 is a one-time friction (a guaranteed drag on returns), and the model must remember it.

### Excel formulas (transcribed)

Let `B5` = Entry EV, `B6` = Fees, `B20` = TLB, `B21` = Senior Notes, `B22` = Revolver drawn.

- Total uses in `B10`: `=B5+B6`
- Total debt in `B23`: `=SUM(B20:B22)`
- Sponsor equity (plug) in `B24`: `=B10-B23` (uses minus debt)
- Balance check in `B25`: `=(B23+B24)-B10` which must return 0; or build a guard: `=IF(ABS((B23+B24)-B10)<0.001,"OK","ERROR")`
- Leverage check in `B26`: `=B23/B3` (total debt / entry EBITDA) returns 5.0x
- Equity contribution % in `B27`: `=B24/B10`

**Cell-by-cell logic**: `B24` is the most important output on this tab. It is a residual: whatever the uses are minus whatever you could borrow, the sponsor (and your co-invest) must fund. The single biggest lever on the equity check, and therefore on MOIC, is `B23`, total debt. Increasing leverage shrinks the equity check and mechanically raises MOIC and IRR in good outcomes, while raising the risk of breaching covenants or running out of cash in bad ones. The balance check in `B25` should be live and conditionally formatted; a broken S&U is the most common silent error in a rushed co-investment model.

---

## Part 3: The operating model (revenue-to-EBITDA build)

### Concept

The operating build projects the income statement from revenue down to EBITDA over the hold (here five years). For an LBO you keep it lean: the things that move returns are the revenue growth rate, the EBITDA margin trajectory, and below EBITDA the items that turn EBITDA into cash (D&A, capex, working capital, taxes). You generally do **not** need a full three-statement model to underwrite a co-investment, but you do need every line that feeds free cash flow and taxes.

The build is usually:

`Revenue_t = Revenue_(t−1) × (1 + growth_t)`
`EBITDA_t = Revenue_t × EBITDA margin_t`

This is where you exercise LP skepticism. The reason the market now demands operational improvement, not financial engineering, is structural: Bain's 2026 report asserts that "12 is the new 5," meaning today's higher-priced, higher-rate deals demand far faster EBITDA growth than the modest ~5% annual growth that sufficed a decade ago. So when a GP hands you a model with 12% revenue growth and 400 basis points of margin expansion, your job is to ask what specifically delivers it and to model a base case at something you would defend.

### Worked example: operating assumptions and build

Assumptions: revenue grows 8.0% per year; EBITDA margin starts at 20.0% and expands 40 basis points per year to 22.0% by Year 5; D&A is 3.0% of revenue; capex is 4.0% of revenue; the increase in net working capital is 10% of the change in revenue; the cash tax rate is 25%.

| Line | Y0 | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---:|---:|---:|---:|---:|---:|
| Revenue | 500.00 | 540.00 | 583.20 | 629.86 | 680.24 | 734.66 |
| Revenue growth % | — | 8.0% | 8.0% | 8.0% | 8.0% | 8.0% |
| EBITDA margin % | 20.0% | 20.4% | 20.8% | 21.2% | 21.6% | 22.0% |
| **EBITDA** | **100.00** | **110.16** | **121.31** | **133.53** | **146.93** | **161.63** |
| D&A (3.0% rev) | — | 16.20 | 17.50 | 18.90 | 20.41 | 22.04 |
| **EBIT** | — | **93.96** | **103.81** | **114.63** | **126.53** | **139.59** |

EBITDA compounds from 100.00 to 161.63, an approximately 10.1% five-year CAGR, of which roughly three-quarters is revenue growth and one-quarter is margin expansion (decomposed precisely in Part 8).

### Excel formulas (transcribed)

Let revenue Year 0 sit in `E10`, growth assumption in `B15`, margin Year 0 in `E11`, margin step in `B16`.

- Revenue, `F10` dragged right: `=E10*(1+$B$15)`
- EBITDA margin, `F11` dragged right: `=E11+$B$16` (adds 40 bps each year)
- EBITDA, `F12`: `=F10*F11`
- D&A, `F13`: `=F10*$B$17` (3.0% of revenue)
- EBIT, `F14`: `=F12-F13`

**Cell-by-cell logic**: The dollar engine is `F10` (revenue) feeding `F12` (EBITDA) through the margin in `F11`. Note the deliberate separation: never hardcode EBITDA growth directly. Build it from revenue (`F10`) times margin (`F11`) so the bridge can later split EBITDA growth into a volume/revenue component and a margin component. D&A (`F13`) does not affect EBITDA but is essential below: it is the depreciation tax shield, which reduces cash taxes in Part 5. EBIT (`F14`) is the base for interest coverage and the starting point for the tax calculation.

---

## Part 4: The debt schedule (tranches, interest, mandatory amortization, cash sweep)

This is the analytically richest part of an LBO model and the part most often built wrong. The schedule tracks, for each tranche and each year: beginning balance, mandatory amortization, optional prepayment (the cash sweep), and ending balance, plus the interest expense that the balances generate.

### Concept: the four moving parts

1. **Tranches**: Different layers of debt with different rates, seniority, and repayment rules. Our deal has:
   - **Term Loan B (TLB)**: senior secured, floating rate (priced over SOFR), amortizes a small fixed amount each year, and is the target of the cash sweep. Typically the cheapest debt.
   - **Senior Notes**: fixed-rate, **bullet** maturity (no amortization, repaid in full at refinancing or exit), higher coupon than the TLB.
   - **Revolver (RCF)**: a credit line for liquidity, usually undrawn at close, drawn only to cover cash shortfalls. Undrawn here.

2. **Interest**: `Interest_t = rate × balance`. The balance can be the beginning balance (no circularity) or the average of beginning and ending balances (more accurate, but creates a circular reference; see below). We use **beginning-balance interest** in the hand calculation so every number is verifiable, then explain the circularity that the average-balance convention introduces.

3. **Mandatory amortization**: A contractually required repayment, conventionally 1.0% of the original TLB principal per year for a TLB (`1% × 400 = 4.0` per year here). It must be capped so the balance never goes negative.

4. **Cash-flow sweep (optional prepayment)**: The credit agreement requires that a percentage of "excess cash flow" be used to prepay the TLB. Sweeps commonly run 50% to 100% and step down as leverage falls. We use **100%**: all free cash flow remaining after mandatory amortization prepays the TLB until it is gone. The sweep is the mechanical engine of deleveraging, and deleveraging is one of the three return drivers.

### Concept: the order of operations each year

For each year you compute, in order: beginning balances → interest (Part 4) → free cash flow available for debt service (Part 5) → mandatory amortization → cash sweep → ending balances. Interest and FCF are computed before repayment because you must know how much cash the business throws off before you decide how much debt to retire.

### Worked example: the debt schedule

Interest rates: TLB 9.0% all-in, Senior Notes 10.0% fixed. Mandatory TLB amortization 4.0 per year. Sweep 100% of post-mandatory FCF. Interest computed on **beginning balances**. (The FCF figures below are derived in Part 5; they are shown here so the schedule is complete and self-checking.)

**Term Loan B schedule**

| TLB line | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---:|---:|---:|---:|---:|
| Beginning balance | 400.00 | 373.43 | 338.43 | 293.76 | 238.04 |
| Mandatory amortization | (4.00) | (4.00) | (4.00) | (4.00) | (4.00) |
| Cash sweep (optional) | (22.57) | (31.00) | (40.67) | (51.72) | (64.33) |
| **Ending balance** | **373.43** | **338.43** | **293.76** | **238.04** | **169.71** |

**Senior Notes schedule** (bullet, no amortization)

| Notes line | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---:|---:|---:|---:|---:|
| Beginning = Ending balance | 100.00 | 100.00 | 100.00 | 100.00 | 100.00 |

**Interest expense (on beginning balances)**

| Interest line | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---:|---:|---:|---:|---:|
| TLB interest (9.0% × begin) | 36.00 | 33.61 | 30.46 | 26.44 | 21.42 |
| Notes interest (10.0% × 100) | 10.00 | 10.00 | 10.00 | 10.00 | 10.00 |
| **Total cash interest** | **46.00** | **43.61** | **40.46** | **36.44** | **31.42** |

**Total debt and net debt**

| | Y0 (close) | Y5 (exit) |
|---|---:|---:|
| TLB | 400.00 | 169.71 |
| Senior Notes | 100.00 | 100.00 |
| Cash | 0.00 | 0.00 |
| **Net debt** | **500.00** | **269.71** |

Over five years the business repays 230.29 of debt (400 → 169.71 on the TLB; the bullet Notes are untouched because the sweep targets the cheapest-to-prepay senior tranche). Total cash interest falls every year as the TLB amortizes, a virtuous loop: paying down debt lowers interest, which frees more cash, which pays down more debt.

### Excel formulas (transcribed)

Let original TLB be `B20` (400), amortization rate `B28` (1.0%), TLB rate `B30` (9.0%), Notes rate `B31` (10.0%), sweep % `B32` (100%). Use column F for Year 1.

**TLB beginning balance** (`F40`): at close it equals the original draw, `=B20`; thereafter `=E_TLB_End` (prior year ending), i.e., `G40 =F44`.

**Mandatory amortization** (`F41`), capped so it cannot exceed the balance:
`=-MIN($B$20*$B$28, F40)`
The `MIN` caps the 4.0 at the remaining balance; the leading minus sign makes it a reduction.

**Cash available for the sweep** = FCF available for debt service (call it `F70`, from Part 5) less the mandatory amortization just paid. **Cash sweep** (`F42`):
`=-MIN( MAX(F70 + F41, 0) * $B$32, F40 + F41 )`
Read it inside out: `F41` is negative, so `F70 + F41` is FCF net of the mandatory payment; `MAX(...,0)` prevents a negative sweep when FCF is short; multiply by the sweep percentage; then `MIN(..., F40 + F41)` caps the sweep at the TLB balance remaining after mandatory amortization so you never overpay the tranche; the leading minus makes it a reduction.

**TLB ending balance** (`F44`): `=F40+F41+F42`

**Senior Notes**: beginning `=B21` then prior ending; ending `=begin` (no change) until a modeled refinancing.

**Interest** (beginning-balance convention):
- TLB interest (`F50`): `=F40*$B$30`
- Notes interest (`F51`): `=F_NotesBegin*$B$31`
- Total cash interest (`F52`): `=SUM(F50:F51)`

**Net debt** at any date (`F60`): `=F44 + F_NotesEnd + F_RevolverEnd - F_Cash`

**Cell-by-cell logic**: The sweep formula (`F42`) is where most rushed models break. The two caps matter independently: `MAX(...,0)` stops the model from "sweeping" negative cash (which would absurdly *increase* debt) in a weak year, and `MIN(..., F40 + F41)` stops it from prepaying more than exists. Without both caps, a downside sensitivity case can produce nonsensical negative balances or paydowns larger than the tranche, and the IRR will look fine while being garbage. Interest (`F50`) depends only on the beginning balance here, so there is no circular reference; in the next subsection we relax that.

### The circularity problem (interest on average balances)

More precise models compute interest on the **average** of beginning and ending balances:

`F50 (average-balance) =$B$30*AVERAGE(F40,F44)`

But the ending balance `F44` depends on the sweep `F42`, which depends on FCF `F70`, which depends on cash interest `F52`, which depends on the very interest you are trying to compute. Excel reports a circular reference. Three standard fixes:

1. **Enable iterative calculation**: File → Options → Formulas → Enable iterative calculation (maximum iterations ~100, maximum change ~0.001). Excel then solves the loop numerically.
2. **Use a circularity switch (a "circ breaker")**: put a 1/0 toggle in `B35` and multiply it into the interest line, wrapped in `IFERROR`:
   `=IFERROR($B$30*AVERAGE(F40,F44)*$B$35, 0)`
   When iterative calc throws a transient error or you want to "freeze" the model, flip `B35` to 0, recalc, then flip back to 1.
3. **Avoid it entirely**: use beginning-balance interest (what we did), accepting a small understatement of interest in years with heavy paydown.

For a co-investment screen built under time pressure, beginning-balance interest is the pragmatic default; switch to average-balance with a circ breaker only if precision on the interest line is material to clearing your hurdle.

---

## Part 5: The free-cash-flow build

### Concept

Free cash flow (FCF) here means **cash available for debt service**: the cash the business throws off after running itself and paying its bills, available to pay down debt or accumulate on the balance sheet. The standard buildup, starting from EBITDA so the depreciation add-back is implicit:

`FCF available = EBITDA − cash taxes − capex − increase in net working capital − cash interest`

Two subtleties:
- **Cash taxes** are computed on taxable income, which is after D&A and after interest: `Taxes = tax rate × (EBIT − cash interest)`. Because D&A and interest are deductible, both shield taxes. Starting the FCF build from EBITDA and subtracting these taxes correctly captures the D&A shield (D&A was deducted to compute the tax but is non-cash, so it is effectively added back).
- **Working capital**: growth consumes cash. As revenue rises, the company funds more receivables and inventory than it gains in payables, so an *increase* in net working capital is a *use* of cash. We model the increase as 10% of the revenue change.

### Worked example: FCF build

(Cash taxes use the beginning-balance interest from Part 4. Tax = 25% × (EBIT − cash interest).)

| FCF line | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---:|---:|---:|---:|---:|
| EBITDA | 110.16 | 121.31 | 133.53 | 146.93 | 161.63 |
| less: Cash taxes | (11.99) | (15.05) | (18.54) | (22.52) | (27.04) |
| less: Capex (4.0% rev) | (21.60) | (23.33) | (25.19) | (27.21) | (29.39) |
| less: Increase in NWC | (4.00) | (4.32) | (4.67) | (5.04) | (5.44) |
| less: Cash interest | (46.00) | (43.61) | (40.46) | (36.44) | (31.42) |
| **FCF available for debt service** | **26.57** | **35.00** | **44.67** | **55.72** | **68.33** |
| less: Mandatory amortization | (4.00) | (4.00) | (4.00) | (4.00) | (4.00) |
| **Cash available for sweep** | **22.57** | **31.00** | **40.67** | **51.72** | **64.33** |

Supporting tax detail (so the cash-tax line is auditable):

| Tax detail | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---:|---:|---:|---:|---:|
| EBIT | 93.96 | 103.81 | 114.63 | 126.53 | 139.59 |
| less: Cash interest | (46.00) | (43.61) | (40.46) | (36.44) | (31.42) |
| Pre-tax income (EBT) | 47.96 | 60.20 | 74.17 | 90.09 | 108.16 |
| Cash taxes (25%) | 11.99 | 15.05 | 18.54 | 22.52 | 27.04 |

FCF available rises sharply over the hold (26.57 → 68.33) because EBITDA grows while interest falls; this is the deleveraging flywheel.

### Excel formulas (transcribed)

Using EBITDA `F12`, EBIT `F14`, total cash interest `F52`, tax rate `B18`, capex rate `B19`, NWC rate `B33`, revenue `F10` and prior-year revenue `E10`.

- Pre-tax income (`F65`): `=F14-F52`
- Cash taxes (`F66`): `=MAX(F65,0)*$B$18` (the `MAX` prevents a negative tax, i.e., no refund, in a loss year; ignore tax-loss carryforwards in a simple screen)
- Capex (`F67`): `=F10*$B$19`
- Increase in NWC (`F68`): `=(F10-E10)*$B$33`
- FCF available for debt service (`F70`): `=F12-F66-F67-F68-F52`
- Cash available for sweep (`F71`): `=F70+F41` (recall `F41`, mandatory amortization, is stored as a negative)

**Cell-by-cell logic**: `F70` is the hinge cell of the entire model: it is the output of the operating model and the input to the debt sweep. Trace it: EBITDA (`F12`) comes from Part 3; taxes (`F66`) depend on interest (`F52`) from Part 4; the result (`F70`) flows back into the sweep (`F42`) in Part 4, which changes next year's beginning balance, which changes next year's interest. This forward-and-back linkage is exactly why the average-balance interest convention is circular. Note also that capex is a percent of revenue, so faster top-line growth is partly self-funding-constrained: growth that needs heavy capex (and working capital) converts less of its EBITDA into debt-paydown cash, which is precisely the kind of thing an LP probes in a capital-intensive co-investment.

---

## Part 6: Exit, returns (IRR and MOIC)

### Concept

At exit (here end of Year 5) you sell the business at an **exit EV/EBITDA multiple** applied to exit-year EBITDA, repay the remaining net debt, and the residual is the equity proceeds:

`Exit EV = exit multiple × exit EBITDA`
`Exit equity proceeds = Exit EV − exit net debt`

Then two return metrics:

- **MOIC (multiple of invested capital)**, also called the gross multiple or "multiple of money": `MOIC = total equity proceeds / total equity invested`. It ignores time. A 2.5x is a 2.5x whether earned in three years or ten.
- **IRR (internal rate of return)**: the annualized discount rate that sets the net present value of the equity cash flows to zero. It is time-sensitive. For a single equity outflow at close and a single inflow at exit (the typical co-investment cash-flow shape, with no interim dividends), IRR collapses to a closed form: `IRR = MOIC^(1/years) − 1`.

The disciplined-LP convention, which you should adopt as your base case: **hold the exit multiple equal to the entry multiple.** You are not paid to forecast multiple expansion, and underwriting to it is how LPs talk themselves into bad deals. Build base, downside, and upside; let the multiple vary across scenarios, not inside the base case.

### Worked example: exit and returns (base case, exit multiple = entry 11.0x)

| Exit calculation | Value | Formula |
|---|---:|---|
| Exit EBITDA (Year 5) | 161.63 | from operating build |
| Exit multiple | 11.0x | held equal to entry (base case) |
| Exit enterprise value | 1,777.89 | `= 11.0 × 161.63` |
| less: Exit net debt | (269.71) | TLB 169.71 + Notes 100.00 |
| **Exit equity proceeds** | **1,508.18** | `= 1,777.89 − 269.71` |
| Entry equity invested | 635.00 | from Sources & Uses |
| **MOIC** | **2.38x** | `= 1,508.18 / 635.00` |
| **IRR (5-year)** | **18.9%** | `= 2.3751^(1/5) − 1` |

Equity cash-flow vector (the input to `IRR`/`XIRR`):

| Date | Y0 (close) | Y1 | Y2 | Y3 | Y4 | Y5 (exit) |
|---|---:|---:|---:|---:|---:|---:|
| Equity cash flow | (635.00) | 0 | 0 | 0 | 0 | 1,508.18 |

### Exit formulas (transcribed)

Let exit EBITDA `J12`, exit multiple `B45`, exit net debt `J60`, entry equity `B24`. Put the equity flow vector across `E80:J80` (with `E80 = -B24` and `J80 = exit proceeds`).

- Exit EV (`J82`): `=J12*B45`
- Exit equity proceeds (`J83`): `=J82-J60`
- Equity flow at close (`E80`): `=-B24`
- Equity flow at exit (`J80`): `=J83`
- **MOIC** (`B90`): `=J83/B24`
- **IRR** (`B91`): `=IRR(E80:J80)`
- **IRR with actual dates** (`B92`): `=XIRR(E80:J80, E81:J81)` where `E81:J81` holds the calendar dates of each flow. `XIRR` is more correct than `IRR` when flows are not exactly annual; `IRR` assumes equal-spaced periods.
- **NPV cross-check at a 20% hurdle** (`B93`): `=E80 + NPV(0.20, F80:J80)`. Note the convention: `NPV` discounts the *future* flows in `F80:J80` back one period each and you add the undiscounted `t=0` flow (`E80`) outside the function, because Excel's `NPV` treats the first argument as occurring one period out. A negative result means the deal fails to clear a 20% hurdle.
- **The `=-NPV(...)` pattern**: practitioners sometimes store contributions as positive numbers (a capital-call schedule). To get the present value of those contributions you negate: `=-NPV(r, contributions_range)`. For example, if `K80:K85` holds positive capital calls, the PV of capital invested at rate `r` in `B94` is `=-NPV(B95, K80:K85)`. This same negation appears in PME math (Part 9): you discount or compound the call stream and the distribution stream separately, and the sign convention flips depending on whether you treat a call as a positive contribution or a negative cash flow.

**Cell-by-cell logic**: `J83` is the payoff. It is sensitive to two things you do not fully control, exit EBITDA (`J12`, the product of five years of operating assumptions) and the exit multiple (`B45`), and one thing the model controls, exit net debt (`J60`, the output of the sweep). `IRR` (`B91`) and `MOIC` (`B90`) diverge whenever the hold period changes or there are interim flows: a longer hold raises MOIC (more compounding, more deleveraging) but can *lower* IRR (the extra year dilutes the annualized rate). The sensitivity table in Part 7 makes this trade-off visible.

A note on gross versus net for your specific seat: the 18.9% / 2.38x above is the **deal-level (gross) return**. For a no-fee, no-carry co-investment, your LP's net return is essentially the same, minus only any co-invest-vehicle administrative cost. That near-equality of gross and net is the entire structural case for co-investing, and it is why your model should always show both lines explicitly even when they are close.

---

## Part 7: Sensitivity / data tables

### Concept

A returns model with point estimates is a false precision. Sensitivity tables (in Excel, **Data Tables**, found under Data → What-If Analysis → Data Table) recompute a single output cell across a grid of input values. A **two-variable data table** crosses two inputs (rows and columns) against one output. The two inputs that move LBO returns most are almost always the **entry/exit multiple** and an operating or timing variable (growth rate or hold period).

How a two-variable Data Table is wired in Excel: you put the output formula in the top-left corner cell of the grid (referencing the live model output, e.g., `=B91` for IRR), list the column-input values across the top row, list the row-input values down the left column, select the whole grid, open Data → What-If → Data Table, and set the **row input cell** to the model cell that the top-row values should overwrite and the **column input cell** to the model cell the left-column values overwrite. Excel then substitutes each pair into the live model and records the recomputed output. The formula that lands in the body of the table is `{=TABLE(row_input_cell, column_input_cell)}`, an array entered automatically; you do not type it.

### Worked example: two-variable sensitivity tables

Crossing **exit multiple** (rows) against **hold period** (columns), holding all operating assumptions at base. These cells are each computed exactly from the model (the operating and debt build are identical across exit timing; only the exit EBITDA, exit net debt, and the number of years change).

**IRR sensitivity**

| Exit multiple ↓ / Hold → | 4 years | 5 years | 6 years |
|---|---:|---:|---:|
| 10.0x | 15.5% | 16.2% | 16.1% |
| 11.0x (base) | 19.1% | **18.9%** | 18.2% |
| 12.0x | 22.4% | 21.3% | 20.1% |

**MOIC sensitivity**

| Exit multiple ↓ / Hold → | 4 years | 5 years | 6 years |
|---|---:|---:|---:|
| 10.0x | 1.78x | 2.12x | 2.45x |
| 11.0x (base) | 2.01x | **2.38x** | 2.73x |
| 12.0x | 2.24x | 2.63x | 3.00x |

Read these two tables together and the central tension of LBO returns jumps out: along any row, MOIC rises with a longer hold (more deleveraging and compounding) while IRR falls (the extra year of waiting dilutes the annualized return, because at a flat multiple the marginal year's value creation no longer keeps pace with the growing equity base). This is why GPs face pressure to exit and why Bain's 2026 report flags that average holding periods at exit have drifted toward seven years and buyout funds sit on a record $3.8 trillion in unrealized value: assets held too long quietly bleed IRR even when MOIC looks healthy. For your co-investment underwriting, present both metrics and never let a GP sell you a deal on MOIC alone.

### Excel formulas / mechanics (transcribed)

- Grid corner cell holding the live output: `=B91` (for the IRR table) or `=B90` (for MOIC).
- Body cells after running Data Table: `{=TABLE(B45,B_HoldYears)}` where `B45` is the exit-multiple input (row input cell) and `B_HoldYears` is the hold-period input (column input cell). Entered by Excel, not typed.
- A robustness guard you should add: wrap the output cells in `IFERROR` so a failed scenario (e.g., a downside case where the company cannot service debt and `IRR` returns `#NUM!`) shows a flag rather than a silent error: model-level `=IFERROR(IRR(E80:J80),"covenant breach / no solution")`.

---

## Part 8: Returns attribution / the value-creation bridge

### Concept

The value-creation bridge decomposes the total equity gain into its sources, answering "where did the money come from?" It is the single most important output for an LP, because it tells you whether the return is *earned* (operational EBITDA growth, deleveraging) or *borrowed from the market* (multiple expansion, which you cannot control and should not bank on). The three core drivers:

1. **EBITDA growth** (further splittable into revenue growth and margin expansion).
2. **Multiple expansion** (change in exit vs. entry EV/EBITDA).
3. **Debt paydown / FCF generation** (reduction in net debt over the hold).

Plus a reconciling friction: **transaction fees** (the one-time drag from Sources & Uses).

The standard formulas (one common convention, "Convention A," holding the EBITDA-growth term at the entry multiple and the multiple-change term at exit EBITDA):

`EBITDA growth contribution = (Exit EBITDA − Entry EBITDA) × Entry multiple`
`Multiple expansion contribution = (Exit multiple − Entry multiple) × Exit EBITDA`
`Debt paydown contribution = Entry net debt − Exit net debt`
`Fees / friction = − transaction fees funded by equity`

These sum to the total equity value created: `Exit equity − Entry equity invested`.

### Worked example: base-case value bridge (exit 11.0x = entry)

Total equity created `= 1,508.18 − 635.00 = 873.18`.

| Value bridge component | Amount | Calculation |
|---|---:|---|
| Entry equity invested | 635.00 | from Sources & Uses |
| + EBITDA growth | +677.89 | `= (161.63 − 100.00) × 11.0` |
| + Multiple expansion | +0.00 | `= (11.0 − 11.0) × 161.63` |
| + Debt paydown | +230.29 | `= 500.00 − 269.71` |
| − Transaction fees | (35.00) | one-time friction from S&U |
| **= Exit equity proceeds** | **1,508.18** | sums to total |
| **Total value created** | **873.18** | `= 677.89 + 0 + 230.29 − 35.00` |

The EBITDA-growth term can be split further into its operational sources:

| EBITDA-growth split | Amount | Calculation |
|---|---:|---|
| Revenue growth (at constant 20% margin) | +516.26 | `= [(734.66 × 20%) − 100.00] × 11.0 = 46.93 × 11.0` |
| Margin expansion (20% → 22%) | +161.63 | `= [734.66 × (22% − 20%)] × 11.0 = 14.69 × 11.0` |
| **Total EBITDA growth** | **+677.89** | |

So the fully decomposed base-case bridge reads: **revenue growth +516.26, margin expansion +161.63, multiple expansion +0.00, debt paydown +230.29, fees −35.00, total +873.18.** Roughly 59% of the value comes from revenue growth, 19% from margin, 26% from deleveraging, and 0% from multiple expansion, with fees a 4% drag. This is exactly the profile a disciplined LP wants to see: the return is operationally earned, not multiple-dependent. For context on why this matters, Bain's data shows that over the past decade revenue growth drove 52% of value creation in software returns and multiple expansion accounted for 42%, with margin growth a small remainder, which underscores how much of historical PE return depended on rising multiples that may not repeat.

### Illustrating the multiple-expansion line and the cross-term (upside case, exit 12.0x)

If you sell at 12.0x instead of 11.0x, exit equity becomes `(12.0 × 161.63) − 269.71 = 1,939.51 − 269.71 = 1,669.81`, a 2.63x / 21.3% return. The bridge gains a non-zero multiple line:

| Component (Convention A) | Amount |
|---|---:|
| EBITDA growth | +677.89 |
| Multiple expansion `(12−11)×161.63` | +161.63 |
| Debt paydown | +230.29 |
| Fees | (35.00) |
| **Total value created** | **+1,034.81** |
| **Exit equity** | **1,669.81** |

**Flag: practitioners disagree on the cross-term.** The product of EBITDA growth *and* multiple change (here `(161.63 − 100.00) × (12 − 11) = 61.63`) is a genuine ambiguity. Three conventions split it differently and all reconcile to the same total ΔEV of 839.51:
- **Convention A** (used above): EBITDA growth at *entry* multiple, multiple change at *exit* EBITDA. The cross-term is absorbed into the multiple line.
- **Convention B**: EBITDA growth at *exit* multiple (`61.63 × 12 = 739.51`), multiple change at *entry* EBITDA (`1 × 100 = 100`). The cross-term is absorbed into the EBITDA line.
- **Convention C**: EBITDA growth at entry multiple (`677.89`), multiple change at entry EBITDA (`100`), and a separate explicit cross/interaction term (`61.63`).

There is no "right" answer; what matters is internal consistency and disclosing your convention. When you compare your bridge to a GP's, confirm you are using the same one, or you will spuriously "disagree" by tens of millions.

### Excel formulas (transcribed)

Using entry EBITDA `B3`, exit EBITDA `J12`, entry multiple `B4`, exit multiple `B45`, entry net debt `B23`, exit net debt `J60`, fees `B6`, entry/exit revenue `E10`/`J10`, entry margin `E11`.

- EBITDA growth (Convention A) (`B100`): `=(J12-B3)*B4`
- Revenue-growth split (`B101`): `=((J10*E11)-B3)*B4`
- Margin-expansion split (`B102`): `=(J10*(J11-E11))*B4`
- Multiple expansion (Convention A) (`B103`): `=(B45-B4)*J12`
- Debt paydown (`B104`): `=B23-J60`
- Fees friction (`B105`): `=-B6`
- Total value created (`B106`): `=B100+B103+B104+B105`
- Reconciliation check (`B107`): `=(B24+B106)-J83` which must return 0 (entry equity plus value created equals exit proceeds).

**Cell-by-cell logic**: `B107` is your proof of correctness. If the bridge does not tie to `J83` (the exit proceeds computed independently in Part 6), one of the components is mis-specified, usually the fee term (forgotten) or a multiple/EBITDA mismatch in the cross-term. The bridge is not a separate calculation; it is a re-expression of the same equity proceeds, sliced by driver. That is why a non-zero `B107` means the model, not the bridge, is wrong.

---

## Glossary

| Term | Definition |
|---|---|
| **LBO (leveraged buyout)** | Acquisition financed largely with debt repaid from the target's cash flows, amplifying equity returns. |
| **Sponsor / GP (general partner)** | The PE firm that leads, structures, and manages the buyout. |
| **LP (limited partner)** | The investor that commits capital to a fund or co-invests alongside it; your seat. |
| **Co-investment** | A direct equity investment by an LP into a portfolio company, alongside the GP's fund, usually at reduced or zero fees and carry. |
| **Primaries** | Commitments to a GP's main blind-pool fund at its formation. |
| **Enterprise value (EV)** | Value of the whole operating business: the combined claim of debt and equity holders. |
| **Equity value** | EV minus net debt; what equity owners receive. |
| **EBITDA** | Earnings before interest, taxes, depreciation, amortization; a capital-structure-neutral cash-earnings proxy. |
| **EV/EBITDA multiple** | Valuation ratio; the price paid per dollar of EBITDA. Entry and exit multiples drive returns. |
| **Net debt** | Total debt minus cash. |
| **Cash-free, debt-free (CFDF)** | Deal convention where the buyer pays for the enterprise; seller's debt is repaid and cash retained/paid out. |
| **Sources & Uses** | Close-of-deal funding ledger; sources (debt + equity) must equal uses (price + fees). |
| **Term Loan B (TLB)** | Senior secured, floating-rate institutional loan; small mandatory amortization; primary cash-sweep target. |
| **Senior Notes** | Typically fixed-rate, bullet-maturity bonds; higher coupon than TLB; junior to the TLB. |
| **Revolver (RCF)** | Revolving credit facility for liquidity; usually undrawn at close. |
| **Tranche** | A distinct layer of debt with its own rate, seniority, and repayment terms. |
| **Mandatory amortization** | Contractually required scheduled debt repayment (TLB convention ≈ 1% of original principal per year). |
| **Cash-flow sweep** | Required prepayment of debt using a set percentage of excess cash flow; the engine of deleveraging. |
| **Excess cash flow (ECF)** | Cash remaining after operations, taxes, interest, capex, and mandatory amortization; the sweep base. |
| **Free cash flow (FCF)** | Here, cash available for debt service: EBITDA − cash taxes − capex − ΔNWC − cash interest. |
| **Net working capital (NWC)** | Operating current assets minus operating current liabilities; growth consumes cash as NWC rises. |
| **Capex** | Capital expenditure; cash spent on long-lived assets; a use of cash not captured in EBITDA. |
| **D&A** | Depreciation and amortization; non-cash, but creates a tax shield. |
| **Tax shield** | Reduction in cash taxes from deductible interest and D&A. |
| **MOIC** | Multiple of invested capital: total equity proceeds / equity invested; time-insensitive. |
| **IRR** | Internal rate of return: annualized discount rate setting equity-flow NPV to zero; time-sensitive. |
| **XIRR** | IRR for irregularly dated cash flows; uses actual calendar dates. |
| **Hurdle rate / preferred return** | Minimum return (e.g., 8% in funds) the LP earns before the GP shares in profits. |
| **Carried interest (carry)** | GP's profit share (commonly 20%) above the hurdle; typically waived or reduced on co-investments. |
| **J-curve** | Early negative net cash flow / NAV in a fund's life before value is realized; co-investing can mitigate it. |
| **Dry powder** | Committed but uninvested capital; buyout dry powder stood at roughly $1.3 trillion globally per Bain's 2026 report. |
| **DPI** | Distributions to paid-in capital; realized cash returned relative to capital called. |
| **Value-creation bridge** | Decomposition of equity gain into EBITDA growth, multiple expansion, and debt paydown (plus fees). |
| **Multiple expansion** | Selling at a higher EV/EBITDA than the entry multiple; market-dependent, not controllable. |
| **PME (public market equivalent)** | Benchmark comparing PE cash flows to an equivalent public-index investment. |
| **KS-PME** | The Kaplan-Schoar PME (introduced 2005), which returns a market multiple rather than an IRR; above 1.0 indicates outperformance of the index. |
| **Adverse selection** | The risk that the deals a GP syndicates to co-investors are systematically its weaker ones. |
| **Circular reference** | A formula loop (e.g., average-balance interest ↔ sweep ↔ FCF) requiring iterative calculation or a circ breaker. |
| **OID (original issue discount)** | A fee-like discount at which debt is issued below par; part of financing costs in Uses. |
| **Bullet maturity** | Debt repaid in a single lump at maturity, with no interim amortization. |
| **Covenant** | A contractual financial test (e.g., leverage or coverage ratio) the borrower must satisfy. |

---

## Flashcards (Q&A, tagged by sub-topic and difficulty)

1. **[Transaction Assumptions / Easy]** Q: What is the formula for entry enterprise value? A: Entry EV = entry EV/EBITDA multiple × entry EBITDA.

2. **[Transaction Assumptions / Easy]** Q: How do you get from enterprise value to equity value? A: Equity value = EV − net debt (net debt = total debt − cash).

3. **[Transaction Assumptions / Medium]** Q: What does "cash-free, debt-free" mean? A: The buyer pays for the enterprise; the seller repays existing debt and keeps (or is paid for) the cash, so the buyer's price reflects the operating business only.

4. **[Market Context / Medium]** Q: Roughly what entry multiple and leverage characterized recent U.S. buyouts? A: About 11.9x EV/EBITDA average entry multiple in North America (2024) and debt around 4.9x EBITDA, per Bain/StepStone data.

5. **[Sources & Uses / Easy]** Q: What is the equity plug? A: Sponsor equity = total uses − total debt raised − other sources; it balances S&U.

6. **[Sources & Uses / Medium]** Q: Why does the sponsor's equity check exceed the implied entry equity value? A: Because transaction and financing fees are funded with equity, so invested equity = (EV − net debt) + fees.

7. **[Sources & Uses / Hard]** Q: All else equal, how does raising leverage affect MOIC and risk? A: It shrinks the equity check, mechanically raising MOIC/IRR in good outcomes, while increasing covenant-breach and insolvency risk in bad ones.

8. **[Operating Build / Easy]** Q: How is each year's revenue projected? A: Revenue_t = Revenue_(t−1) × (1 + growth_t).

9. **[Operating Build / Easy]** Q: How is EBITDA derived in a lean LBO operating build? A: EBITDA_t = Revenue_t × EBITDA margin_t.

10. **[Operating Build / Medium]** Q: Why model revenue and margin separately rather than EBITDA growth directly? A: So the value-creation bridge can split EBITDA growth into a revenue-volume component and a margin-expansion component.

11. **[Operating Build / Hard]** Q: What does "12 is the new 5" mean? A: Bain's 2026 framing that today's higher prices and rates require far faster EBITDA growth (around 12%) than the ~5% that once sufficed.

12. **[Debt Schedule / Easy]** Q: What is mandatory amortization on a TLB, conventionally? A: About 1% of original principal per year, contractually required.

13. **[Debt Schedule / Easy]** Q: What is a bullet maturity? A: Debt repaid entirely at maturity with no interim amortization (e.g., senior notes).

14. **[Debt Schedule / Medium]** Q: What is a cash-flow sweep and why does it target the TLB? A: A required prepayment of a percentage of excess cash flow; it targets the TLB because that is the prepayable senior tranche and usually the cheapest to retire, accelerating deleveraging.

15. **[Debt Schedule / Medium]** Q: Why cap the cash sweep with both a MAX(...,0) and a MIN(...,balance)? A: MAX prevents a nonsensical negative sweep (which would increase debt) in weak years; MIN prevents prepaying more than the tranche balance.

16. **[Debt Schedule / Hard]** Q: Where does circularity come from and how do you handle it? A: Average-balance interest depends on the ending balance, which depends on the sweep, which depends on FCF, which depends on interest. Fix with iterative calculation, a 1/0 circ-breaker plus IFERROR, or beginning-balance interest.

17. **[Debt Schedule / Hard]** Q: Why does total interest expense fall over the hold in a healthy LBO? A: The sweep pays down the floating-rate TLB, shrinking the balance on which interest accrues; less interest frees more cash for further paydown.

18. **[FCF Build / Easy]** Q: Give the FCF-available-for-debt-service formula. A: EBITDA − cash taxes − capex − increase in NWC − cash interest.

19. **[FCF Build / Medium]** Q: How are cash taxes computed and why does interest reduce them? A: Tax = tax rate × (EBIT − cash interest); interest is tax-deductible, so it shields taxable income.

20. **[FCF Build / Medium]** Q: Why is an increase in net working capital a use of cash? A: Growth ties up cash in receivables and inventory faster than it is freed in payables, so rising NWC consumes cash.

21. **[FCF Build / Hard]** Q: Starting FCF from EBITDA, where is the D&A add-back? A: It is implicit: D&A is deducted to compute taxable income (and the tax), but because it is non-cash it is effectively added back when you start from EBITDA rather than net income.

22. **[Returns / Easy]** Q: Define MOIC. A: Total equity proceeds divided by total equity invested; ignores time.

23. **[Returns / Easy]** Q: Define IRR. A: The annualized discount rate that sets the NPV of the equity cash flows to zero; time-sensitive.

24. **[Returns / Medium]** Q: For a single equity outflow and single inflow, how do IRR and MOIC relate? A: IRR = MOIC^(1/years) − 1.

25. **[Returns / Medium]** Q: When do IRR and MOIC move in opposite directions? A: Lengthening the hold at a flat multiple raises MOIC (more compounding/deleveraging) but lowers IRR (the extra year dilutes the annualized rate).

26. **[Returns / Hard]** Q: Why should an LP report gross and net returns separately even on a no-fee co-investment? A: To make explicit that the near-equality of gross and net (only minor vehicle costs) is the structural advantage of co-investing versus a fee-laden fund commitment.

27. **[Sensitivity / Easy]** Q: What Excel feature builds a two-variable sensitivity grid? A: Data → What-If Analysis → Data Table, with a row input cell and a column input cell.

28. **[Sensitivity / Medium]** Q: Which two inputs are most commonly placed on sensitivity axes and why? A: Entry/exit multiple and an operating or timing variable (growth or hold), because they move returns the most.

29. **[Value Bridge / Easy]** Q: Name the three core value-creation drivers. A: EBITDA growth, multiple expansion, and debt paydown/FCF generation.

30. **[Value Bridge / Medium]** Q: Write the EBITDA-growth contribution formula (entry-multiple convention). A: (Exit EBITDA − Entry EBITDA) × Entry multiple.

31. **[Value Bridge / Medium]** Q: Why do disciplined LPs hold the exit multiple equal to entry in the base case? A: Multiple expansion is market-dependent and uncontrollable; underwriting to it inflates the base case and justifies bad deals.

32. **[Value Bridge / Hard]** Q: What is the cross-term problem in the bridge? A: The product of EBITDA growth and multiple change can be allocated to the EBITDA line, the multiple line, or a separate interaction term; conventions differ, so you must disclose yours.

33. **[Co-investment / Medium]** Q: What is the adverse-selection concern in co-investing? A: That GPs may offer LPs the deals they are least excited about, so the syndicated deal pool is systematically weaker.

34. **[Co-investment / Hard]** Q: How do Fang-Ivashina-Lerner and Braun-Jenkinson-Schemmerl differ on co-investment performance? A: The former found co-investments underperform the parent fund (adverse selection); the latter found no adverse selection, similar gross returns, and net outperformance for diversified portfolios due to fee savings.

35. **[PME / Medium]** Q: What does a KS-PME above 1.0 indicate? A: That the PE investment outperformed the public-market index after matching cash-flow timing.

36. **[PME / Hard]** Q: How did the buyout-PME consensus change between Kaplan-Schoar (2005) and Harris-Jenkinson-Kaplan (2014)? A: KS (2005), using Venture Economics data, found buyout investors earned slightly less than public markets (PME ≈ 0.97); HJK (2014), using cleaner Burgiss data, found consistent outperformance averaging 20% to 27% over fund life.

---

## Interview-style questions with full model answers

**1. Walk me through an LBO at a high level.** A buyer acquires a company using mostly debt and some equity. You set the purchase price as an entry multiple times EBITDA, fund it via Sources & Uses, project the operating performance, build a debt schedule where the company's free cash flow pays down debt, then at exit apply an exit multiple to grown EBITDA, repay remaining net debt, and the residual equity divided by the equity invested gives MOIC, annualized into IRR. The return comes from EBITDA growth, debt paydown, and any multiple expansion.

**2. Why does leverage increase equity returns, and what is the catch?** Leverage shrinks the equity check, so the same dollar of enterprise-value gain is spread over fewer equity dollars, amplifying MOIC and IRR. The debt also gets repaid from the company's cash, transferring enterprise value to equity over time. The catch is asymmetry: leverage magnifies losses identically, fixed interest must be paid regardless of performance, covenants can trip in a downturn, and high rates (financing yields around 8% in 2025 per Bain) shrink the cash available to delever. As an LP you stress the downside case precisely because leverage makes the left tail fatter.

**3. What is the difference between IRR and MOIC, and which would you trust more for a co-investment?** MOIC is the cash multiple, time-blind; IRR is the annualized, time-weighted rate. Neither dominates: a 1.3x in one year is a great IRR but trivial cash; a 3.0x over twelve years is a poor IRR but real wealth. For a co-investment I would look at both, but I would weight MOIC and the absolute dollars heavily because co-investments are concentrated single-name bets where a high IRR on a quick flip can mask thin absolute value, and because IRR is gameable through timing (early dividends, subscription-line financing).

**4. Build the Sources & Uses for a company bought at 11x with EBITDA of 100, 5x leverage, and 35 of fees.** Uses: purchase EV = 11 × 100 = 1,100, plus 35 fees, total 1,135. Sources: debt = 5 × 100 = 500 (say 400 TLB and 100 notes), so sponsor equity = 1,135 − 500 = 635. The check is 635, which exceeds the implied entry equity of EV minus net debt (1,100 − 500 = 600) by exactly the 35 of fees, since fees are equity-funded.

**5. How does a cash-flow sweep work and why is it valuable to equity?** The credit agreement requires that a set percentage of excess cash flow prepay the term loan each year. It is valuable because every dollar of debt retired converts, at exit, into a dollar of equity value (you owe less when you sell), and because retiring floating-rate debt lowers future interest, freeing still more cash. In our worked deal a 100% sweep takes the TLB from 400 to about 170 over five years, contributing roughly 230 of the equity gain through deleveraging alone.

**6. Where does circularity come from in an LBO model and how do you resolve it?** From computing interest on the average of beginning and ending debt balances. Ending balance depends on the sweep, the sweep depends on free cash flow, free cash flow depends on interest, and interest depends on the ending balance. The loop is circular. You resolve it by enabling iterative calculation, by inserting a 1/0 circularity switch multiplied into the interest line and wrapping it in IFERROR so you can break and rebuild the loop, or by sidestepping it with beginning-balance interest, which is the pragmatic choice for a fast screen.

**7. A GP shows you a 3.0x base case. How do you pressure-test it?** I rebuild the model independently from the operating assumptions up, then I attack the three return drivers. I hold the exit multiple equal to entry (refusing to underwrite multiple expansion), I haircut the revenue growth and margin trajectory to levels I can defend from the company's history and the GP's actual operating plan, and I raise the interest rate to a conservative forward curve. Then I check whether the deal still clears my hurdle in that base case and what the downside looks like if EBITDA is flat and the multiple contracts a turn. If the 3.0x only survives with multiple expansion and heroic growth, it is really an upside case, and I would either pass or size small.

**8. Decompose the return in our worked deal into its value drivers.** Total equity gain is 1,508 minus 635, or 873. Of that, revenue growth contributes about 516, margin expansion about 162, debt paydown about 230, multiple expansion zero (held flat), and transaction fees minus 35. So roughly 78% of the value is operational EBITDA growth, 26% is deleveraging, and none is multiple expansion, with a 4% fee drag. That is a high-quality, operationally earned return profile, which is exactly what I want to see because it does not depend on a friendly exit market.

**9. Why is the convention to hold exit multiple equal to entry, and when might you deviate?** Because multiple expansion is a market gift, not a skill, and forecasting it lets you talk yourself into overpaying. Historically a great deal of PE return came from rising multiples (Bain shows multiple expansion drove around 42% of software value creation over the past decade), which is precisely why relying on it is dangerous as multiples sit near records and rates are higher. I might deviate cautiously if there is a concrete re-rating thesis, for example a clear path from a sub-scale private multiple to a public-comparable multiple through scale or business-mix shift, and even then I would put it in the upside case, not the base.

**10. What is PME and why do LPs care?** Public market equivalent benchmarks a private investment against an equivalent-timed investment in a public index, answering whether the LP beat simply buying the S&P 500 on the same dates. LPs care because illiquidity, leverage, and fees must be justified by genuine outperformance, not just high absolute returns in a rising market. The Kaplan-Schoar variant returns a multiple where above 1.0 means outperformance. Note the literature evolved: the 2005 study found average buyout funds barely matched public markets, while the 2014 Harris-Jenkinson-Kaplan study, using cleaner data, found consistent buyout outperformance of 20% to 27% over fund life.

**11. Is co-investing a free lunch?** No. The fee and carry savings are real and mechanical, and for a no-fee co-investment gross return roughly equals net, which is the structural edge over a fund. But the return edge is contested: Fang, Ivashina, and Lerner found co-investments underperform the parent fund through adverse selection, while Braun, Jenkinson, and Schemmerl found no adverse selection and net outperformance for diversified portfolios. The reconciliation is that the fee savings only translate into net outperformance if your selection is disciplined and you build a portfolio rather than betting on one name. The model is the screen that earns the lunch.

**12. What kills an LBO?** Three things, usually in combination: an EBITDA shortfall that breaches a leverage covenant or starves the company of cash to service debt; a refinancing wall hitting in a frozen credit market so bullet debt cannot be rolled; and multiple contraction at exit that wipes out the equity even when operations held, because at high leverage a one-turn multiple drop is a large percentage of a thin equity cushion. As an LP underwriting a co-investment, the downside case exists to find out which of these the deal is most exposed to.

**13. How would a longer hold affect this deal's IRR and MOIC, and why?** At a flat exit multiple, extending from five to six years raises MOIC (from about 2.38x to 2.73x) because the company keeps growing EBITDA and paying down debt, but lowers IRR (from about 18.9% to 18.2%) because the additional year's incremental value creation no longer keeps pace with the now-larger equity base, diluting the annualized rate. This is the core reason GPs are pressured to exit and why aging, unrealized portfolios drag reported IRRs even as paper MOICs look fine.

---

## Sources

- Bain & Company, *Global Private Equity Report 2025*: North America average buyout multiple 11.9x and Europe record 12.1x EV/EBITDA (SPI by StepStone); debt ratios ~4.9x EBITDA; direct lending ~90% of middle-market financing. (Bain insight page and the report PDF; summary via Chronograph for the software value-creation split of 52% revenue / 42% multiple.)
- Bain & Company, *Global Private Equity Report 2026* ("Welcome to a New Era," "Private Equity Resurgence" press release, and Moonfare's summary): leverage ~36% debt/EV in 2025 vs ~50% in 2015; illustrative entry 14x/exit 15x for fully realized 2025 deals; "12 is the new 5"; 2025 buyout deal value $904bn (+44%); ~$3.8tn unrealized value; ~7-year holding periods; ~$1.3tn dry powder.
- Kaplan, S. N., and A. Schoar (2005), "Private Equity Performance: Returns, Persistence, and Capital Flows," *Journal of Finance* 60(4): 1791-1823. Origin of the KS-PME; found average buyout funds roughly matched or slightly trailed the S&P 500 net of fees (Venture Economics data).
- Long, A. M., and C. J. Nickels (1996), the Index Comparison Method (Long-Nickels PME), the foundational IRR-based PME.
- Harris, R. S., T. Jenkinson, and S. N. Kaplan (2014), "Private Equity Performance: What Do We Know?," *Journal of Finance* 69(5): 1851-1882. Using Burgiss data, found buyout outperformance of 20% to 27% over fund life and >3% annually, revising the earlier consensus.
- Sorensen, M., and R. Jagannathan, "The Public Market Equivalent and Private Equity Performance," providing the formal economic justification for KS-PME (log-utility CAPM / GMM).
- Gredil, Griffiths, and Stucke, work on Direct Alpha; and PME+ (Capital Dynamics / Rouvinez), refinements addressing the Long-Nickels negative-NAV "shortness" problem.
- Fang, L., V. Ivashina, and J. Lerner (2015), "The Disintermediation of Financial Markets: Direct Investing in Private Equity," *Journal of Financial Economics* 116(1): 160-178. Co-investments underperform parent funds, consistent with adverse selection.
- Braun, R., T. Jenkinson, and C. Schemmerl (2020), "Adverse Selection and the Performance of Private Equity Co-Investments," *Journal of Financial Economics* 136(1): 44-62. No evidence of adverse selection; similar gross returns; net outperformance for diversified co-investment portfolios due to lower costs.

**Flagged disagreements:** (1) The PME literature evolved materially, with Kaplan-Schoar (2005) showing buyout funds roughly matching public markets and Harris-Jenkinson-Kaplan (2014) showing clear outperformance, driven largely by data-quality differences (Venture Economics vs Burgiss). (2) The co-investment performance literature is directly contradictory: Fang-Ivashina-Lerner find adverse-selection underperformance while Braun-Jenkinson-Schemmerl find none and net outperformance for portfolios. Treat the co-investment "edge" as conditional on disciplined selection and diversification, not as a structural certainty. (3) The value-bridge cross-term has no single agreed allocation convention; disclose yours when comparing bridges.

A reminder on the non-cited mechanics: the LBO construction itself (Sources & Uses, the debt-schedule order of operations, the FCF buildup, IRR/MOIC, the Data Table mechanics) is standard financial modeling, consistent with the Wall Street Prep and Breaking Into Wall Street LBO curricula and the CFA Institute's alternative-investments material; I have stated those as established method rather than attributing specific figures to them, since the numbers in the worked example are my own internally consistent illustration, not drawn from any source.
