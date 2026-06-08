# Private Equity Fund Mechanics: An LP-Side Study Guide

**Audience:** Incoming intern on a Primaries & Co-investments (fund-investing / LP) team.
**Purpose:** A rigorous, self-contained reference covering how a closed-end PE fund works end to end, with worked numbers, flashcards, interview questions, formulas, and sourced claims.

A blunt orientation before the mechanics, because it shapes everything an LP-side team does: net of fees and carry, the *average* private equity fund has historically delivered returns roughly in line with public equities, not dramatically above them. The original Kaplan and Schoar (2005) study found the average US buyout fund produced a public-market-equivalent of about 0.97 against the S&P 500, meaning it slightly *trailed* the index net of fees [1][6]. Later work using cleaner data (Harris, Jenkinson and Kaplan) found buyout funds did outperform, by roughly 3%+ per year [2]. Both can be true depending on dataset and vintage, and the disagreement is itself a core lesson (see Section 12). The practical implication: the entire economic case for an LP allocating to PE rests on **manager selection and access**, because the dispersion between top-quartile and bottom-quartile funds is enormous. Top-quartile buyout funds in the Kaplan-Schoar framework showed KS-PMEs well above 1.2 while bottom-quartile funds fell below 0.7 [8]. Your job on a primaries team is, in essence, to find the funds on the right tail and avoid the left one. Keep that in mind as you read.

---

## How to use this document

- **Sections 1 to 11** are concept explanations. Read them in order the first time.
- **Section 12** flags where authoritative sources disagree.
- **Section 13** is the glossary (every key term).
- **Section 14** is 32 flashcards, tagged `[sub-topic | difficulty]`.
- **Section 15** is 12 interview-style questions with full model answers.
- **Section 16** is the formula sheet.
- **Section 17** contains six fully worked numerical examples with every number shown, built so each can be turned into an interactive calculator. The Section 17.1 J-curve model is the spine; later examples reuse its numbers.
- **Section 18** lists sources.

---

## 1. The big picture: what PE is and who is who

A private equity fund is a **pooled, privately raised, closed-end investment vehicle** that buys equity (and sometimes debt) stakes in companies or assets that are not publicly traded, holds them for several years while trying to increase their value, and then sells them and returns the proceeds to investors. "Closed-end" means the pool is raised once, has a fixed life (commonly around ten years), and does not let investors redeem on demand the way a mutual fund or hedge fund might. Capital goes in, gets locked up, gets invested, and comes back as the underlying assets are sold.

There are two sides to every fund.

**The General Partner (GP)** is the manager. The GP raises the fund, sources and executes deals, sits on portfolio-company boards, drives value creation, decides when to sell, and reports to investors. The GP has unlimited liability for the partnership in the classic structure (which is why the actual GP is itself a shielded entity, see Section 2) and makes all investment decisions. The GP is compensated through a management fee and a share of profits called carried interest (Section 3).

**The Limited Partners (LPs)** are the investors who supply the bulk of the capital. On an LP-side team like yours, the LP is your employer or your client. LPs are typically pension funds, sovereign wealth funds, insurance companies, endowments, foundations, family offices, funds-of-funds, and increasingly private-wealth and retail channels. LPs are passive by law: they commit capital and receive returns, but they cannot direct individual investment decisions without risking their limited-liability protection. ILPA (the Institutional Limited Partners Association) is the trade body that represents LPs and publishes the dominant best-practice standards for fund terms, governance, and reporting [44][46].

**The LP-side mandate, in three flavors.** A "Primaries & Co-investments" team does fund investing rather than direct deal-doing. The three building blocks of an LP private-markets program are:

- **Primaries:** committing to a GP's new fund at its formation (a "primary commitment"). You are buying a blind pool: you underwrite the manager, strategy, and terms, not specific assets, because the assets are not yet known.
- **Secondaries:** buying *existing* fund interests from other LPs, or backing GP-led restructurings, in the secondary market (Section 9.6). Bought at a point in the fund's life when assets are partly known.
- **Co-investments:** investing directly alongside a GP in a single deal, usually fee-free or reduced-fee, on top of your fund commitment. Co-invest blends LP economics (low cost) with direct exposure (concentration).

---

## 2. Fund structure and legal architecture

The "fund" people refer to casually is actually a small cluster of legal entities. Understanding the cluster matters because fees, carry, liability, and control are split across them.

**The fund itself** is almost always a **limited partnership** (LP), frequently domiciled in Delaware, the Cayman Islands, Luxembourg, or similar. A limited partnership has exactly two classes of partner: one general partner with management control and unlimited liability, and many limited partners with passive roles and liability capped at their committed capital. The LP structure is used because it is **tax-transparent** (the partnership itself is not taxed; gains and income flow through to the partners, avoiding a layer of entity-level tax) and it cleanly separates control from liability.

**The General Partner entity** is a separate legal vehicle (often itself an LLC) that *is* the general partner of the fund. It is deliberately a thin entity so that the unlimited liability of the GP role does not reach the management firm's principals personally. This entity is the formal recipient of carried interest.

**The Management Company** is the operating business: the brand you recognize (Blackstone, KKR, EQT, and so on). It employs the investment professionals, pays salaries and rent, and receives the management fee, which it uses to fund operations. One management company typically manages many funds across many vintages simultaneously.

**The Limited Partnership Agreement (LPA)** is the governing contract. It is the single most important document in an LP's life because it dictates economics and rights: the management fee rate and base, the carried-interest percentage, the hurdle/preferred return, the waterfall, the fund term and extension options, the investment period length, recycling provisions, the GP commitment, key-person provisions, clawback, what expenses can be charged to the fund, the LPAC's composition, removal rights, and conflict-of-interest rules. ILPA Principles 3.0 (2019) is the reference document for what "market" and "fair" look like across all of these terms [43][46].

Two adjacent governance objects:

- **Side letters:** bilateral agreements between the GP and individual LPs granting bespoke terms (fee discounts, "most favored nation" clauses, co-invest rights, excuse rights, reporting customization). Large or early LPs negotiate the strongest side letters.
- **LPAC (Limited Partner Advisory Committee):** a committee of selected LPs that reviews conflicts of interest, valuations, and certain GP decisions. It is an oversight body, not an investment committee; it cannot direct deals. ILPA Principles 3.0 added significant guidance on LPAC operation [47].

A simple text schematic of the flows:

```
        Management fee  +----------------------+
       <----------------|  Management Company  |
       |                |  (employs the team)  |
       |                +----------+-----------+
       |                           | controls
   +---+---------+      carried    |
   |     FUND    |<---- interest --+---------+
   | (Limited    |                | GP Entity |  <-- unlimited-liability role,
   | Partnership)|---- controls -->+----------+      thin shield entity
   +---+---------+
       ^   |
 commit|   | capital calls / distributions
 ments |   v
   +---+---------------------------+
   |   Limited Partners (LPs):     |
   |   pensions, SWFs, endowments, |
   |   funds-of-funds, your team   |
   +-------------------------------+
            |  invests in
            v
   Portfolio companies / assets
```

---

## 3. Economics: how everyone gets paid

This is "2 and 20," but the details are where the money actually moves.

**Management fee.** An annual fee paid by the fund to the management company to cover operating costs. The canonical headline is **2% per year**, though in practice the average is somewhat lower, around 1.7% to 2.0%, and large or anchor LPs negotiate discounts [35]. Two subtleties matter enormously for an LP:

1. **The fee base changes over the fund's life.** During the investment period the fee is usually charged on **committed capital** (you pay on money you have not yet put to work). After the investment period it typically **steps down** to a lower rate and/or shifts to a base of **invested cost** (net of realizations) or net asset value, so the fee shrinks as the portfolio is harvested [38].
2. **Fee offsets.** GPs often charge portfolio companies transaction, monitoring, and director fees. ILPA's standard, now widely adopted, is that 100% of such fees offset (reduce) the management fee paid by LPs [35][38]. Older funds offset only a portion, which was a quiet transfer of value from LPs to GPs.

**Carried interest ("carry").** The GP's share of profits, canonically **20%** [36][37]. This is the GP's real upside and the reason the talent stays. The classic asymmetry: a GP that commits, say, 2% of a $1bn fund ($20m) can earn carry on the entire $1bn of LP capital, so a fund that returns 2x can hand the GP a multiple of its own stake [39]. Carry is what aligns the GP with the LP, and it is also where most GP-LP conflicts live.

**Preferred return / hurdle rate.** Before the GP earns any carry, LPs usually must first receive their capital back plus a minimum compounded annual return, conventionally **8%** [35][37][40]. Below the hurdle, the GP earns no carry. The hurdle is an IRR-style compounding threshold on LP contributions, not a simple multiple.

**Catch-up.** After the hurdle is satisfied, a **catch-up** provision lets the GP receive an outsized share (often 100%) of the next distributions until the GP has captured its target carry percentage of *total profits above return of capital*. With a 100% catch-up to 20% carry, the catch-up dollar amount equals one quarter of the preferred return paid (the algebra is in Section 16 and worked in Section 17.3). After catch-up, distributions split at the carry ratio (e.g., 80% LP / 20% GP).

**The distribution waterfall.** The ordered rules for splitting cash. Two archetypes:

- **European / whole-of-fund waterfall:** carry is paid only after LPs have received back *all* contributions across the *entire fund* plus the preferred return. GP-friendly carry comes late. This is more LP-protective and is the ILPA-preferred default [43].
- **American / deal-by-deal waterfall:** carry is computed and paid on each *individual* realized deal as it exits, so the GP collects carry earlier. This is GP-friendlier and creates more clawback risk, because early winners can pay carry that later losers should have offset [35].

**Clawback.** A provision forcing the GP to return previously paid carry if, at the end of the fund, the GP was overpaid relative to the agreed split (most relevant under American waterfalls). To make clawbacks collectible, LPAs often escrow a portion of each carry payment and require repayment, commonly within 90 days of final liquidation [35].

**GP commitment.** The GP invests its own money into the fund alongside LPs, to put "skin in the game." The historical convention was **1% of fund size** [41][42], and many references still quote roughly 1% to 2% [37]. In practice the figure has trended upward, and larger or institutional LPs increasingly push for more meaningful GP commitments. Treat "around 1% to 5%, commonly cited near 1% to 2%, and rising" as the honest range, and note that sources genuinely vary (Section 12). ILPA Principles 3.0 treats a substantial GP commitment, ideally in cash rather than waived fees, as a core alignment mechanism [43].

---

## 4. The closed-end fund lifecycle

A closed-end fund moves through four overlapping phases across roughly a ten-year life (plus extensions).

**Phase 1, Fundraising (roughly 12 to 24 months).** The GP markets the fund, negotiates the LPA, and signs up LPs. The fund holds a **first close** once enough commitments are secured to begin investing; it can then start calling capital and doing deals. It continues admitting LPs at subsequent closes until the **final close**, after which no new LPs join. Later-closing LPs typically pay an "equalization" interest charge to compensate first-close LPs, so that all LPs are treated as if they had been in since the first close.

**Phase 2, Investment period / commitment period (roughly the first 4 to 6 years, commonly 5).** The GP sources and makes new platform investments. The fund calls capital from LPs as deals close. Management fees during this phase are charged on committed capital. This is the period during which a fund builds its portfolio; after it ends, the GP generally cannot make *new* platform investments, only follow-ons and add-ons to existing ones.

**Phase 3, Holding and value creation.** Overlapping with and following the investment period, the GP works the portfolio: operational improvements, add-on acquisitions ("buy-and-build"), margin expansion, leadership changes, and balance-sheet optimization. Bain's data underline that value creation has shifted toward operational earnings growth rather than leverage and multiple expansion: over the past decade in software, revenue growth drove 52% of value creation and multiple expansion 42%, with margin growth a small remainder [18].

**Phase 4, Harvesting / wind-down (back half of the fund, years 5 to 10+).** The GP exits investments via sale to a strategic buyer, sale to another sponsor (a "secondary buyout"), IPO, dividend recapitalization, or sale into a continuation vehicle (Section 9.6). Proceeds are distributed to LPs. As assets are sold, the fund winds down. Funds usually have **extension options**, commonly two one-year extensions at the GP's or LPAC's discretion, pushing the practical life to twelve years or beyond. When the last asset is sold, the fund liquidates and any clawback is settled.

A text timeline (one realistic shape):

```
Year:    0    1    2    3    4    5    6    7    8    9    10   11   12
         |----Fundraising----|
         |--- Investment / commitment period ---|
                        |------- Holding & value creation -------|
                                  |------------ Harvesting / exits ------------|
                                                                  |- extensions->|
Calls:   high during yrs 1-5; fee-only calls thereafter
Dist'ns: near zero early; ramp from ~yr 4-5; peak yrs 6-9
```

---

## 5. Cash-flow mechanics and the core capital definitions

This vocabulary is tested constantly and is the daily language of an LP-side analyst.

**Commitment.** The maximum amount an LP contractually agrees to provide to the fund. It is a promise, not a transfer. An LP committing $50m has not paid $50m; it has agreed to fund up to $50m when called.

**Capital call (drawdown / takedown).** When the GP needs cash for an investment, fees, or expenses, it issues a **capital call notice** to LPs, who must wire their pro-rata share within a short window (commonly 10 business days). Failure to fund a call is a serious default with steep penalties (forfeiture of interest, forced sale at a discount). ILPA publishes a standardized capital-call-and-distribution template that GPs increasingly use [48].

**Distribution.** Cash (or occasionally securities, "in-kind") returned to LPs as the fund realizes investments. The distribution notice specifies the source (return of capital, gain, income) and the waterfall treatment.

**The three capital measures you must never confuse:**

- **Committed capital:** the promised maximum.
- **Called / paid-in / contributed capital (PIC):** the cumulative cash actually drawn from LPs to date. Includes amounts used for investments, fees, and expenses.
- **Invested capital:** the subset of paid-in capital actually deployed into portfolio assets (paid-in minus the portion consumed by fees and expenses, and minus undeployed reserves).

So the chain is: **Committed ≥ Paid-in ≥ Invested.** Fees and expenses sit in the gap between paid-in and invested, which is exactly why net returns lag gross returns.

**Unfunded commitment:** Committed minus Paid-in. The amount an LP could still be called for.

**Dry powder:** committed-but-uncalled capital available to invest, measured across a fund or the whole industry. It is the war chest. As of the 2026 Bain report, global *buyout* dry powder stood at roughly **$1.3 trillion**, much of it "aging" (held four years or more), which pressures GPs to deploy [19][22]. Note the figure moves: Bain's mid-2025 read was about $1.2 trillion with roughly a quarter aged four years or more [25]. (Caution: "dry powder" sometimes denotes total industry uncalled capital and sometimes just buyout; always check the scope.)

**Recycling (reinvestment / recallable distributions):** a provision letting the GP reinvest early realization proceeds (or recall distributed capital) rather than permanently distribute them, so the fund can put more than the headline commitment to work. Recycling is usually capped (often at 100% of committed capital), time-limited (typically within the investment period or first few years), and tracked separately, with fees charged only once on recycled amounts per ILPA practice; reinvestment beyond the window generally needs LP consent [35]. Recycling can lift a fund's invested capital above its committed capital, which boosts potential multiples but can also raise paid-in above commitment (worked in Section 17.5).

**Vintage year:** the year a fund makes its first investment or first draws capital for investment (Bain and Preqin define vintage as the first year of investment/drawdown) [20]. Vintage is the single most important comparability axis in PE: you benchmark a fund only against other funds of the *same* vintage, because macro conditions, entry multiples, and exit windows dominate returns. A great manager in a bad vintage can trail a mediocre manager in a great vintage.

---

## 6. The J-curve

**Definition.** The J-curve is the characteristic shape of a PE fund's cumulative net cash flow (or interim net return / interim IRR) plotted over time: it dips negative in the early years, bottoms out, then climbs back through zero and into positive territory, tracing the letter J.

**Why early returns are negative.** Three forces, in order of importance:

1. **Cash timing.** In the early years the LP is funding capital calls (cash out) while almost nothing is coming back, because investments take years to mature and exit. Cumulative net cash flow is therefore deeply negative before any distributions arrive.
2. **Fee and expense drag.** Management fees are charged from day one on committed capital, and organizational/setup expenses hit early. So the fund's net asset value starts *below* paid-in capital. An LP that has paid in $10m but whose holdings are marked at $10m of cost still shows a loss once $0.2m of fees are accounted for.
3. **Conservative early marks.** Investments are typically held at or near cost initially, and accounting standards plus prudence mean write-ups lag real value creation while write-downs of losers can come quickly. So reported NAV understates eventual value in the early years.

**How it reverses.** As the portfolio matures, three things flip the curve upward: investments are written up toward fair value as performance becomes visible; the GP begins exiting assets, producing distributions (cash in); and the fee base shrinks after the investment period. Distributions in the harvesting years drive cumulative net cash flow back above zero and then to the final positive gain. A well-managed fund that uses early exits to fund later calls, or a secondary purchase made later in a fund's life, can shorten or skip the J-curve entirely (one reason LPs use secondaries, Section 9.6).

A fully worked J-curve with numbers, including the cumulative-cash-flow table and the interim-TVPI path, is in **Section 17.1**. The honest framing for interviews: a meaningful chunk of the early "loss" is a fee and accounting artifact, not destroyed value. The cash-flow component, by contrast, is real opportunity cost.

---

## 7. Performance metrics

LPs evaluate funds on **two dimensions that must always be read together: a multiple (how much) and a rate (how fast).** Each metric answers a different question, and each can mislead alone.

**MOIC (Multiple on Invested Capital) / Gross multiple.** Total value (realized plus unrealized) divided by capital invested. Answers "how many times my money." Ignores time entirely: a 2.0x in three years and a 2.0x in twelve years look identical, though the first is far better.

**TVPI (Total Value to Paid-In).** The headline *net* multiple to the LP: (cumulative distributions + current NAV) / paid-in capital. TVPI = DPI + RVPI. This is the most-cited net multiple. Like MOIC, it ignores timing.

**DPI (Distributions to Paid-In), the "realization multiple."** Cumulative distributions / paid-in. This is *cash actually returned*, immune to NAV marks. In the current low-liquidity environment, DPI has become the metric LPs scrutinize most, captured by the industry phrase "DPI is the new IRR."

**RVPI (Residual Value to Paid-In).** NAV / paid-in. The unrealized, still-on-paper portion. High RVPI with low DPI means the fund's reported value is mostly unsold marks the GP controls.

**IRR (Internal Rate of Return).** The discount rate that sets the net present value of all the fund's cash flows (calls negative, distributions positive, plus terminal NAV) to zero. It captures timing, which the multiples do not. Its weaknesses are serious and routinely exploited:

- **Path and timing sensitivity:** an early home-run exit can lock in a high IRR that is nearly impossible to dislodge even if the rest of the fund is mediocre.
- **Subscription credit lines:** GPs increasingly use fund-level borrowing to delay capital calls. Because the LP's money goes in later, the *IRR* rises while the *MOIC/TVPI barely moves*. This is the single most important "gaming" mechanism an LP-side analyst must control for, which is why sophisticated LPs ask for IRR computed *without* subscription-line effects and weight MOIC and DPI heavily.

**Vintage-year benchmarking and quartiles.** Because absolute IRR is meaningless without context, LPs rank funds against same-vintage peers and report **quartile** standing (top-quartile, second, third, bottom). Cambridge Associates, Preqin, PitchBook, and Burgiss/MSCI maintain the benchmark datasets. The dispersion is the point: manager selection, not asset-class beta, is where LP returns are won or lost [8].

**PME (Public Market Equivalent): the opportunity-cost test.** Multiples and IRR tell you the fund's absolute result; PME asks the question an LP should care about most: *would I have done better putting the same cash, on the same dates, into a public index?* The PME family:

- **Long-Nickels ICM/PME (1996):** the first PME. Mirror every contribution as a hypothetical *purchase* of the index and every distribution as a *sale*, keeping the timing and size identical. The resulting hypothetical index portfolio's IRR ("PME IRR") is compared to the fund's actual IRR; the spread is the over/underperformance. Its known flaw: a strongly outperforming fund forces the mirror portfolio into a large negative (short) NAV in later years, which can break the math [9][10].
- **PME+ (Rouvinez / Capital Dynamics, 2003) and mPME (Cambridge Associates, 2013):** extensions that scale the mirrored cash flows to avoid the negative-NAV problem of Long-Nickels [17].
- **KS-PME (Kaplan-Schoar, 2005):** the most-cited variant. It is a *ratio*: discount (or future-value) all distributions plus final NAV at the index's realized total return, divide by all contributions discounted the same way. **KS-PME > 1 means the fund beat the index; < 1 means it lost to the index, net of fees** [3][8]. A KS-PME of 1.18 means LPs ended with 18% more than the index would have produced on the same cash-flow schedule [8]. It has a rigorous theoretical foundation: Sorensen and Jagannathan (2015) showed it is a valid risk-adjusted measure under log-utility and a market-return assumption [5].
- **Direct Alpha (Gredil, Griffiths and Stucke, 2014):** the most theoretically precise. It compounds each fund cash flow forward at the index return and then solves for the IRR of the index-adjusted flows, yielding a precise *annualized* excess return ("alpha") rather than a single multiple. The authors show earlier PME methods are heuristic or contain approximation error, while Direct Alpha derives the exact per-period excess return [12][14][17].

A KS-PME computation with numbers is in **Section 17.6**.

---

## 8. Concepts specific to running an LP program

These are the day-job concepts your team lives in, beyond single-fund mechanics.

**Commitment pacing.** Because committed capital is called slowly and unpredictably, an LP that wants, say, $1bn *invested* in PE cannot simply commit $1bn. It must build a pacing model that commits across multiple vintages so that, as old funds distribute and new ones call, the *net invested* exposure trends toward target. Pacing is the core quantitative task of a primaries team.

**Over-commitment.** Because not all committed capital is called at once and distributions recycle back, LPs deliberately commit *more* than their target allocation, relying on the gap between commitments and calls. This works until distributions stall, at which point over-commitment becomes a liquidity problem (precisely the squeeze of 2022 to 2024).

**The denominator effect.** PE is reported as a percentage of an LP's total portfolio. When public markets fall sharply, the public (liquid) part of the portfolio shrinks while illiquid PE NAVs are marked down slowly, so PE's *percentage* of the portfolio mechanically rises above the policy target even though the LP did nothing. This forces some LPs to stop committing or to sell on the secondary market to rebalance, and it was a major driver of the 2022 to 2025 secondaries boom [28].

**The liquidity squeeze / DPI problem (current as of 2026).** From 2022 through much of 2025, exits were depressed, distributions collapsed, and LPs received far less cash back than their pacing models assumed, while still facing calls from newer funds. Bain's 2026 report describes a partial recovery, with 2025 global buyout deal value up 44% to $904bn and buyout-backed exit value up 47% to $717bn (the second-best exit year ever), led by the $56.6bn take-private of Electronic Arts, yet notes the exit rebound has not yet cleared the backlog and dry powder remains near $1.3 trillion [19][20][24]. This backdrop is why secondaries and continuation vehicles have become structural rather than niche.

**Fund-of-funds (FoF) versus direct fund investing.** A fund-of-funds is an LP vehicle that commits to many underlying PE funds on behalf of *its* investors. Advantages: diversification, access to hard-to-reach managers, and outsourced selection for smaller LPs. The decisive disadvantage: a **second layer of fees and carry** stacked on top of the underlying funds' fees, which compounds the fee drag and is hard to justify unless the FoF's selection skill is exceptional or it provides access an LP could not get directly. Larger LPs build in-house primaries teams (like the one you are joining) precisely to capture exposure *without* the FoF fee layer. "Direct" in the LP context usually means investing straight into funds (and co-investing into deals), as opposed to going through a FoF.

**Co-investment, in one paragraph.** A GP doing a deal too large for its fund alone offers LPs the chance to invest extra capital directly into that single company, typically with **no management fee and no carry** ("no fee, no carry"). For the LP this lowers blended cost and increases exposure to a deal the GP already chose; for the GP it provides extra equity and deepens the LP relationship. The trade-offs: concentration (you are now exposed to one company, not a diversified pool), adverse selection risk (is the GP sharing its best deals or only the ones it cannot fully fund?), and the need to underwrite quickly on the GP's timeline.

---

## 9. The main PE strategy types

These differ on **what they buy, how much leverage they use, where returns come from, and the risk/return profile.** This is standard interview territory.

### 9.1 Buyout (Leveraged Buyout, LBO)
Acquisition of a **controlling stake** in a mature, cash-generative company, financed with a significant layer of **debt** (the "leveraged" part) on top of equity. Returns come from three levers: deleveraging (using the company's cash flow to pay down debt, so the equity slice grows), operational improvement (revenue growth and margin expansion), and multiple expansion (selling at a higher EBITDA multiple than the purchase multiple). Entry multiples are high: North American average buyout multiples reached 11.9x EBITDA and Europe a record 12.1x EBITDA in 2024, which is why operational value creation now matters more than financial engineering [18]. The dominant strategy by capital and the home of the mega-funds (Blackstone, KKR, Apollo, EQT, Advent, and so on). Buyouts represented roughly 72% of secondary-sale volume by strategy in H1 2025, reflecting how much LP capital sits in buyout [26].

### 9.2 Growth equity
**Minority** investments in companies that are already growing and often already profitable, with **little or no leverage**. Returns come almost entirely from revenue and earnings growth, not debt or financial engineering. Sits between venture (earlier, riskier, mostly pre-profit) and buyout (control, leveraged, mature). Lower loss rates than venture, lower leverage and lower target multiples than buyout.

### 9.3 Venture capital (VC)
**Minority** equity in **early-stage, high-growth** companies, no leverage. Returns follow a **power law**: most investments fail or return little, and a tiny number of huge winners drive the entire fund. Selection is about the right tail of outcomes rather than avoiding losses. Highest dispersion and longest path to liquidity of the mainstream strategies.

### 9.4 Distressed / special situations
Investing in the **debt or equity of troubled or financially stressed companies**, sometimes to control them through a restructuring ("distressed-for-control"), sometimes to trade the securities. Includes turnarounds, restructurings, and rescue financing. Often **counter-cyclical**: the best opportunities appear in downturns and credit stress. Skill set is legal, financial, and operational restructuring rather than growth.

### 9.5 Infrastructure
**Long-duration real assets** with stable, often contracted or regulated cash flows: toll roads, airports, utilities, pipelines, renewables, and increasingly digital infrastructure like data centers. Lower target returns than buyout but lower risk, very long hold periods, steady cash yield, and frequently inflation-linked revenues. The 2025 mega-exit of Aligned Data Centers at $40bn shows how infrastructure and digital have converged [20].

### 9.6 Secondaries
Buying or restructuring **existing** fund interests rather than committing to new funds. Two sub-types:

- **LP-led:** an LP sells its existing fund stakes (its commitments plus already-funded NAV) to a secondary buyer, usually at a discount or premium to NAV, to obtain liquidity or rebalance. Buyout LP stakes traded at roughly 94% of NAV in H1 2025, up from below 90% in 2022 as discounts narrowed [30].
- **GP-led / continuation vehicles (CVs):** the GP moves one or more assets out of an aging fund into a new vehicle, giving existing LPs the choice to cash out or roll over, while new secondary investors provide fresh capital and the GP keeps managing the asset. CVs let GPs hold winners longer and manufacture liquidity when exits are scarce. They also embed a structural conflict of interest, because the GP effectively sits on both sides of the trade (selling from the old fund and buying into the new), which is why ILPA added specific GP-led-secondary guidance and why pricing and process scrutiny is intense [47].

Why LPs love secondaries: shorter or absent J-curve (you buy assets already part-way to maturity), faster DPI, diversification across vintages and managers, and visibility into the underlying portfolio (you are no longer buying a blind pool). The market is now structural and enormous (see the data and the source disagreement in Section 12).

---

## 10. Where your team sits

A Primaries & Co-investments team executes three activities that map cleanly onto Sections 8 and 9: it makes **primary commitments** to new funds (underwriting managers and terms, building pacing models), it makes **co-investments** alongside GPs into single deals (low-cost, concentrated), and it interacts with the **secondaries** market both as a portfolio-management tool (selling stakes to manage liquidity and the denominator effect) and sometimes as a buyer. The intellectual core of the role is manager due diligence and portfolio construction, because, as Section 0 argued, the asset class's average net return is unremarkable and the entire prize is in selection, access, and pacing.

---

## 11. A note on candor for interviews

The strongest LP-side candidates do not parrot the "PE outperforms" line. They say something closer to: the *median* fund's net-of-fee edge over public markets is contested and modest; the dispersion across managers is huge; IRR is gameable via subscription lines and exit timing; the J-curve is partly an accounting and fee artifact; reported NAVs are GP-controlled marks that DPI cuts through; and the current era is defined by a liquidity squeeze that has made DPI, secondaries, and continuation vehicles central. Demonstrating that you know *why* manager selection is the whole game is what separates a thoughtful LP-side hire from someone who memorized "2 and 20."

---

## 12. Where authoritative sources disagree (flagged)

The user asked specifically for these flags. Four genuine disagreements matter.

1. **Does PE beat public markets, net of fees?** Kaplan and Schoar (2005), using Venture Economics data, found the average US buyout fund roughly matched or slightly trailed the S&P 500 (KS-PME ≈ 0.97) [1][6][8]. Later work by Harris, Jenkinson and Kaplan, using Burgiss data, found buyout funds outperformed public markets in most vintages, by an average of roughly 3%+ per year [2][4]. The NBER literature explicitly attributes part of the gap to a *downward bias* in the older Venture Economics data, which understated buyout returns [3]. **Resolution for an LP:** the answer is dataset- and vintage-dependent; the robust conclusion is that *average* outperformance is modest and contested, while *top-quartile* outperformance is large and real. Do not state "PE beats public markets" as settled fact.

2. **2025 total secondaries volume: roughly $226bn or $240bn?** Evercore's full-year tally was about $226bn (LP-led $120bn up 34%, GP-led $106bn up 51%) [30], while Jefferies reported the global secondary market reached **$240bn**, a 48% year-on-year increase and a record [27]. The difference reflects different deal-inclusion methodologies between the two advisors. Both agree 2025 was a record and that the market roughly doubled off the 2023 level of about $114bn [27][31]. Quote a *range* ($226bn to $240bn) and name the source.

3. **GP commitment percentage.** Older and exam-style sources quote roughly **1% of fund size** [41][42]; others quote **1% to 2%** [37]. In practice the figure has risen and varies widely by manager and LP negotiating power, with institutional LPs pushing higher. Treat it as a range ("about 1% to 5%, commonly cited near 1% to 2%, trending up") rather than a fixed number, and note ILPA's preference for a *substantial cash* commitment [43].

4. **Dry powder magnitude.** Bain's 2026 report cites roughly **$1.3 trillion** of global buyout dry powder [19][22]; its mid-2025 read was about **$1.2 trillion** with roughly a quarter aged four years or more [25]. The figure is a moving, vendor-dependent estimate (Bain uses Preqin data), and "dry powder" can mean buyout-only or all-PE depending on the source. State the date and scope whenever you cite it.

---

## 13. Glossary

| Term | Definition |
|---|---|
| General Partner (GP) | The fund manager: sources deals, makes investment decisions, drives value creation, earns the management fee and carry; holds the unlimited-liability management role (via a shielded entity). |
| Limited Partner (LP) | A passive investor that commits capital and receives returns, with liability capped at its commitment; cannot direct individual investments. |
| Management Company | The operating firm (the recognized brand) that employs the team and receives the management fee. |
| GP Entity | The thin legal vehicle that formally serves as general partner and receives carried interest. |
| Limited Partnership Agreement (LPA) | The governing contract defining all fund economics, rights, and terms. |
| Side letter | A bilateral agreement granting an individual LP bespoke terms (fee breaks, MFN, co-invest rights). |
| LPAC | Limited Partner Advisory Committee; an LP oversight body for conflicts and valuations, not an investment committee. |
| ILPA | Institutional Limited Partners Association; the LP trade body that publishes dominant best-practice standards (Principles 3.0, reporting templates). |
| Closed-end fund | A vehicle raised once, with a fixed life, that does not allow on-demand redemptions. |
| Blind pool | A fund whose specific investments are unknown at commitment; LPs underwrite the manager and strategy, not the assets. |
| Vintage year | The year a fund first invests or first draws capital for investment; the key comparability axis for benchmarking. |
| Commitment | The maximum capital an LP contractually agrees to provide. |
| Capital call (drawdown) | A GP demand for LPs to wire their pro-rata share of committed capital, typically within ~10 business days. |
| Distribution | Cash (or securities) returned to LPs as investments are realized. |
| Committed capital | The promised maximum across all LPs. |
| Paid-in / called / contributed capital (PIC) | Cumulative cash actually drawn from LPs (for investments, fees, expenses). |
| Invested capital | The portion of paid-in capital actually deployed into portfolio assets. |
| Unfunded commitment | Committed minus paid-in; the amount an LP can still be called for. |
| Dry powder | Committed-but-uncalled capital available to invest (per fund or industry-wide). |
| Management fee | Annual fee to the management company, canonically ~2%, charged on committed capital during the investment period then stepping down. |
| Fee offset | Reduction of the management fee by fees a GP charges portfolio companies; ILPA standard is 100% offset. |
| Carried interest (carry) | The GP's profit share, canonically 20%. |
| Hurdle rate / preferred return | The minimum LP return (commonly 8%) that must be met before the GP earns carry. |
| Catch-up | A provision letting the GP take an outsized share of distributions after the hurdle until it reaches its target carry of total profit. |
| Distribution waterfall | The ordered rules for splitting cash between LPs and GP. |
| European (whole-of-fund) waterfall | Carry paid only after all contributions plus preferred are returned across the whole fund; LP-protective. |
| American (deal-by-deal) waterfall | Carry paid per realized deal; GP-friendlier, higher clawback risk. |
| Clawback | A requirement that the GP return excess carry at fund end; often escrow-backed. |
| GP commitment | The GP's own capital invested in the fund for alignment; historically ~1%, range ~1% to 5%, trending up. |
| Recycling (reinvestment) | Reinvesting early proceeds (or recalling distributions) rather than distributing, usually capped at ~100% of commitments and time-limited. |
| J-curve | The shape of cumulative net cash flow / interim return: negative early, then rising to positive. |
| Investment / commitment period | The early years (commonly ~5) in which the GP makes new platform investments and fees are charged on committed capital. |
| Harvesting period | The later years in which the GP exits investments and distributes proceeds. |
| First close / final close | The point at which a fund can begin investing / the point after which no new LPs may join. |
| Equalization interest | Charge paid by late-closing LPs to compensate first-close LPs, treating all as if invested from first close. |
| NAV | Net Asset Value; the fair value of the fund's unrealized holdings. |
| MOIC | Multiple on Invested Capital; total value / capital invested; ignores time. |
| TVPI | Total Value to Paid-In; (distributions + NAV) / paid-in; the headline net multiple; equals DPI + RVPI. |
| DPI | Distributions to Paid-In; cash actually returned / paid-in; the realization multiple. |
| RVPI | Residual Value to Paid-In; NAV / paid-in; the unrealized portion. |
| IRR | Internal Rate of Return; the rate setting the NPV of all cash flows to zero; captures timing; gameable. |
| Subscription credit line | Fund-level borrowing that delays capital calls and inflates IRR with little effect on MOIC. |
| Quartile ranking | A fund's standing versus same-vintage peers (top, second, third, bottom quartile). |
| PME (Public Market Equivalent) | A family of measures comparing a fund to investing the same cash flows in a public index. |
| Long-Nickels ICM/PME | The first PME (1996); mirrors fund cash flows as index buys/sells and compares IRRs. |
| KS-PME | Kaplan-Schoar PME (2005); a ratio of index-discounted distributions+NAV to index-discounted contributions; >1 means outperformance. |
| Direct Alpha | Gredil-Griffiths-Stucke (2014); compounds flows at the index return and solves for a precise annualized excess return. |
| Primaries | Committing to a GP's new fund at formation. |
| Secondaries | Buying existing fund interests (LP-led) or backing GP restructurings (GP-led). |
| Co-investment | Investing directly alongside a GP in a single deal, usually with no fee and no carry. |
| Continuation vehicle (CV) | A new fund into which a GP moves assets from an aging fund, offering existing LPs a cash-out or roll-over choice. |
| Fund-of-funds (FoF) | A vehicle that invests across many underlying funds; adds a second fee/carry layer. |
| Denominator effect | When public-market declines mechanically raise PE's percentage of an LP's portfolio above target. |
| Over-commitment | Committing more than target allocation, relying on the gap between commitments and calls. |
| Buyout / LBO | Control acquisition of a mature company using significant debt. |
| Growth equity | Minority, low/no-leverage investment in already-growing companies. |
| Venture capital | Minority equity in early-stage, high-growth companies; power-law returns. |
| Distressed / special situations | Investing in debt or equity of troubled companies, often for control via restructuring. |
| Infrastructure | Long-duration real assets with stable, often contracted or regulated cash flows. |
| Secondary buyout | Sale of a portfolio company from one sponsor to another. |
| Dividend recapitalization | Returning cash to equity holders by adding debt to a portfolio company. |

---

## 14. Flashcards (32)

Tag format: `[sub-topic | difficulty]`

1. **Q:** What is the legal form of almost every PE fund, and why? `[structure | easy]`
   **A:** A limited partnership, because it is tax-transparent (no entity-level tax) and cleanly separates the GP's management control and unlimited liability from the LPs' passive, liability-capped role.

2. **Q:** Distinguish the GP entity from the management company. `[structure | medium]`
   **A:** The GP entity is a thin legal vehicle that formally serves as general partner and receives carry; the management company is the operating firm that employs the team and receives the management fee. Liability isolation is the reason they are separate.

3. **Q:** What document governs all fund economics and LP rights? `[structure | easy]`
   **A:** The Limited Partnership Agreement (LPA).

4. **Q:** What is ILPA and why does an LP-side analyst care? `[governance | easy]`
   **A:** The Institutional Limited Partners Association, the LP trade body. It publishes the dominant best-practice standards (Principles 3.0, reporting and capital-call templates) that define what "market" and "fair" fund terms look like.

5. **Q:** Define committed, paid-in, and invested capital and state their ordering. `[cash flows | easy]`
   **A:** Committed is the promised maximum; paid-in (called) is cash actually drawn; invested is the subset deployed into assets. Committed ≥ Paid-in ≥ Invested, with fees and expenses sitting in the gaps.

6. **Q:** What is dry powder, and roughly how large is global buyout dry powder per the 2026 Bain report? `[cash flows | medium]`
   **A:** Committed-but-uncalled capital available to invest; roughly $1.3 trillion of global buyout dry powder, much of it aging.

7. **Q:** What is a capital call and what happens if an LP fails to fund one? `[cash flows | easy]`
   **A:** A GP demand for the LP's pro-rata share of committed capital, due in a short window. Default triggers severe penalties, including forfeiture of fund interest or forced sale at a discount.

8. **Q:** Define vintage year and explain why it dominates benchmarking. `[benchmarking | medium]`
   **A:** The year a fund first invests or first draws investment capital. Macro conditions, entry multiples, and exit windows are vintage-specific and dominate returns, so funds are compared only against same-vintage peers.

9. **Q:** What does "2 and 20" mean? `[economics | easy]`
   **A:** A ~2% annual management fee plus 20% carried interest on profits.

10. **Q:** On what base is the management fee charged during versus after the investment period? `[economics | medium]`
    **A:** During the investment period, on committed capital; afterward it usually steps down in rate and/or shifts to invested cost or NAV, shrinking as assets are harvested.

11. **Q:** What is a fee offset and what is the ILPA standard? `[economics | medium]`
    **A:** Portfolio-company fees (transaction, monitoring, director) reducing the LP-paid management fee. ILPA's standard is 100% offset.

12. **Q:** What is the hurdle / preferred return and its conventional level? `[economics | easy]`
    **A:** The minimum LP return, commonly 8% compounded, that must be met before the GP earns carry.

13. **Q:** Explain the catch-up provision. `[economics | hard]`
    **A:** After the hurdle is met, the GP takes an outsized share (often 100%) of further distributions until it has captured its target carry percentage of total profit above return of capital; then distributions split at the carry ratio.

14. **Q:** Contrast the European and American waterfalls. `[economics | medium]`
    **A:** European (whole-of-fund) pays carry only after all contributions plus preferred are returned across the entire fund (LP-protective, late carry). American (deal-by-deal) pays carry per realized deal (GP-friendly, early carry, higher clawback risk).

15. **Q:** What is a clawback and how is it made collectible? `[economics | medium]`
    **A:** A requirement that the GP repay excess carry at fund end; made enforceable by escrowing part of each carry payment and requiring repayment within a set window (often 90 days of liquidation).

16. **Q:** What is the GP commitment, its conventional level, and the source disagreement? `[economics | medium]`
    **A:** The GP's own capital in the fund for alignment. Historically ~1%; sources also cite 1% to 2%; in practice it ranges to ~5% and is trending up. Quote a range, not a fixed number.

17. **Q:** Name the four phases of the closed-end lifecycle. `[lifecycle | easy]`
    **A:** Fundraising; investment/commitment period; holding and value creation; harvesting/wind-down (with extensions).

18. **Q:** Difference between first close and final close? `[lifecycle | easy]`
    **A:** First close lets the fund begin investing and calling capital; after the final close no new LPs may join.

19. **Q:** Why does the J-curve dip negative early? `[J-curve | medium]`
    **A:** Capital calls and fees flow out while distributions have not started, fees and setup costs push NAV below paid-in, and early marks are conservative (held near cost).

20. **Q:** How does the J-curve reverse? `[J-curve | medium]`
    **A:** Investments are written up toward fair value, exits begin producing distributions, and the fee base shrinks after the investment period, pushing cumulative net cash flow back above zero.

21. **Q:** Which part of the early J-curve "loss" is real and which is artifact? `[J-curve | hard]`
    **A:** The cash-flow (opportunity-cost) component is real; much of the early *reported* loss is a fee and conservative-marking accounting artifact.

22. **Q:** Define TVPI, DPI, and RVPI and the identity linking them. `[metrics | easy]`
    **A:** TVPI = (distributions + NAV)/paid-in; DPI = distributions/paid-in; RVPI = NAV/paid-in. TVPI = DPI + RVPI.

23. **Q:** Why is DPI now emphasized over IRR? `[metrics | medium]`
    **A:** DPI measures cash actually returned and is immune to GP-controlled marks; in a low-liquidity environment LPs care most about real distributions, hence "DPI is the new IRR."

24. **Q:** How do subscription credit lines distort IRR? `[metrics | hard]`
    **A:** They delay capital calls, so LP cash goes in later; IRR rises while MOIC/TVPI barely move. Sophisticated LPs request IRR computed without line effects and weight MOIC and DPI.

25. **Q:** What does KS-PME measure and how is a value above 1 interpreted? `[PME | medium]`
    **A:** It compares the fund to investing the same cash flows in a public index: it is the ratio of index-discounted distributions plus NAV to index-discounted contributions. Above 1 means the fund beat the index net of fees.

26. **Q:** What problem does Long-Nickels PME have, and how does Direct Alpha improve on the family? `[PME | hard]`
    **A:** Long-Nickels can force the mirror index portfolio into a large negative NAV when the fund strongly outperforms, breaking the comparison. Direct Alpha compounds each flow at the index return and solves for the IRR of the index-adjusted flows, giving a precise annualized excess return rather than a heuristic.

27. **Q:** Buyout returns come from which three levers? `[strategies | medium]`
    **A:** Deleveraging (debt paydown growing the equity slice), operational improvement (revenue and margin growth), and multiple expansion.

28. **Q:** How does growth equity differ from both venture and buyout? `[strategies | medium]`
    **A:** It takes minority stakes in already-growing, often profitable companies with little or no leverage; returns are growth-driven. It is later and lower-loss than venture and non-control, lower-leverage than buyout.

29. **Q:** What is a continuation vehicle and what conflict does it embed? `[secondaries | hard]`
    **A:** A new fund into which a GP moves assets from an aging fund, letting existing LPs cash out or roll over while new investors fund it. The GP sits on both sides (seller and buyer/manager), creating a pricing conflict, hence heavy ILPA guidance and process scrutiny.

30. **Q:** Why do LPs use secondaries to shorten the J-curve? `[secondaries | medium]`
    **A:** Buying interests later in a fund's life acquires assets already part-way to maturity, so distributions arrive sooner and there is less or no early negative period; it also adds diversification and portfolio visibility.

31. **Q:** Decisive disadvantage of a fund-of-funds? `[program | medium]`
    **A:** A second layer of fees and carry on top of the underlying funds, compounding fee drag; only justified by exceptional selection skill or access an LP cannot get directly.

32. **Q:** What is the denominator effect and why did it fuel secondaries in 2022 to 2025? `[program | hard]`
    **A:** When public markets fall, liquid holdings shrink while slowly-marked PE NAVs do not, so PE's percentage of the portfolio rises above target; LPs sold fund stakes on the secondary market to rebalance, helping drive record secondaries volume.

---

## 15. Interview-style questions with model answers

**1. Walk me through how a PE fund makes money for an LP, from commitment to wind-down.**
An LP signs a commitment, the maximum it will fund. The GP calls capital over the investment period to buy companies and to pay fees, so paid-in capital builds while distributions are still near zero, which produces the J-curve dip. The GP holds the assets for several years, improving them, then sells them in the harvesting years and distributes proceeds through the waterfall: first returning LP capital, then the preferred return, then a GP catch-up, then an 80/20 split of remaining profit. The LP's outcome is summarized by a net multiple (TVPI, decomposable into realized DPI and unrealized RVPI) and a net IRR. The fund winds down as the last assets are sold, with any clawback settled. The honest punchline: net of fees and carry, average returns roughly track public markets, so the LP's job is selecting top-quartile managers, where dispersion is large.

**2. Why does the J-curve happen, and is the early loss "real"?**
Three causes: cash timing (calls and fees out, no distributions in), fee and setup drag pushing NAV below paid-in, and conservative early marks held near cost. The reversal comes from write-ups, exits/distributions, and the post-investment-period fee step-down. The early *reported* loss is substantially a fee and accounting artifact; the genuinely real cost is the opportunity cost of cash being committed and called while idle or undeployed. That distinction matters because it explains why secondaries, which buy seasoned assets, can skip the J-curve.

**3. What is the difference between committed, paid-in, and invested capital, and why does the gap matter?**
Committed is the promise, paid-in is cash actually drawn, invested is what reaches portfolio assets. Committed ≥ paid-in ≥ invested. The gaps are where fees and expenses live, which is precisely why net returns lag gross returns. An LP managing a program also cares about the committed-versus-paid-in gap (unfunded commitment) for liquidity planning and pacing.

**4. Explain the European versus American waterfall and which an LP prefers.**
European pays carry only after the whole fund has returned all contributions plus preferred, so carry comes late and LPs are protected. American pays carry deal-by-deal as each exit occurs, so the GP collects sooner and the fund carries higher clawback risk if later deals disappoint. LPs prefer European; it is the ILPA-preferred default. GPs prefer American for the earlier cash and the time value to their professionals.

**5. A fund shows a 25% IRR but a 1.3x TVPI after four years. What do you think?**
The two are in tension: a 25% IRR with only a 1.3x multiple over four years suggests timing effects are flattering the rate. The most likely culprits are a subscription credit line delaying capital calls or one early exit locking in a high IRR. I would ask for IRR computed without subscription-line effects, look at DPI versus RVPI to see how much of the value is realized cash versus GP marks, and benchmark against same-vintage peers via quartiles and PME. A high IRR on a modest multiple is a flag, not a result.

**6. How would you tell whether a fund actually outperformed, beyond IRR and multiple?**
Use PME to answer the opportunity-cost question: would the same cash on the same dates have done better in a public index? KS-PME above 1 indicates net outperformance; Direct Alpha gives a precise annualized excess return. I would pair that with same-vintage quartile ranking, separate realized (DPI) from unrealized (RVPI) value, and check whether IRR was inflated by leverage at the fund level. Multiple, rate, opportunity cost, and realization are four different lenses, and a strong fund holds up on all of them.

**7. Pitch me the case for and against secondaries for an LP program.**
For: a shorter or absent J-curve because you buy seasoned assets, faster DPI, vintage and manager diversification, and visibility into the actual portfolio rather than a blind pool, often at a discount to NAV. Against: lower gross return potential than primaries (you pay for de-risking), the need for strong underwriting of NAV marks, and, for GP-led deals, a structural conflict of interest because the GP is on both sides. In the current low-distribution environment secondaries are a structural liquidity tool, not a niche, with record volume in 2025.

**8. What is a continuation vehicle and why has it become so common?**
A GP moves one or more assets from an aging fund into a new vehicle, letting existing LPs cash out or roll over while new secondary investors fund it and the GP keeps managing the assets. It has surged because the 2022 to 2025 exit drought left GPs holding maturing winners they could not easily sell, so CVs manufacture liquidity and extend ownership of good assets. The catch is the conflict: the GP both sells from the old fund and sets terms for the new one, so LPs and the LPAC scrutinize valuation, process, and the option terms offered to rolling LPs.

**9. Differentiate buyout, growth equity, and venture on leverage and return source.**
Buyout takes control of mature, cash-generative companies using significant debt; returns come from deleveraging, operational improvement, and multiple expansion. Growth equity takes minority stakes in already-growing, often profitable companies with little or no leverage; returns are almost purely growth. Venture takes minority stakes in early-stage companies with no leverage; returns follow a power law where a few huge winners carry the fund. Leverage falls from high (buyout) to none (growth, venture); loss rates rise from low (buyout) to high (venture).

**10. What is the denominator effect and how does an LP respond?**
When public markets fall, the liquid part of the portfolio shrinks immediately while illiquid PE NAVs are marked down slowly, so PE's percentage of the total portfolio mechanically rises above the policy target. The LP did nothing, yet is now overweight. Responses include pausing new commitments, adjusting the pacing model, or selling fund stakes on the LP-led secondary market to rebalance. This effect was a major driver of record secondary volumes from 2022 onward.

**11. Why is manager selection the central activity for an LP team, given the asset class returns?**
Because the *average* net-of-fee return is contested and modest (Kaplan-Schoar found the average US buyout fund roughly matched the S&P 500, while later cleaner data showed modest outperformance), but the *dispersion* between top- and bottom-quartile funds is very large. The asset-class beta is not a compelling reason to lock up capital for a decade and pay 2-and-20; the alpha from access to and selection of top-tier managers is. A primaries team's entire reason to exist is to capture that selection alpha and to pace commitments so the program stays at target exposure.

**12. What would you look at first in an LPA before recommending a primary commitment?**
The economics and alignment terms: management fee rate and base (committed versus invested, and the step-down), carry percentage and waterfall type (European preferred), hurdle and catch-up mechanics, the size and form of the GP commitment (cash preferred), fee-offset percentage (100% is market), recycling caps, key-person and GP-removal provisions, fund term and extension rights, and expense definitions. I would benchmark each against ILPA Principles 3.0 and the manager's prior funds, then weigh anything off-market against the manager's track record and access value.

---

## 16. Formula sheet

Let contributions (calls) be cash *out* of the LP and distributions be cash *in*.

- **Unfunded commitment** = Committed − Paid-in
- **Dry powder** (industry or fund) = Committed − Called (uncalled commitments available to invest)
- **DPI** = Cumulative Distributions / Paid-in Capital
- **RVPI** = NAV / Paid-in Capital
- **TVPI** = (Cumulative Distributions + NAV) / Paid-in Capital = **DPI + RVPI**
- **Gross MOIC** = (Realized Value + Unrealized Value) / Invested Capital
- **IRR**: the rate `r` solving `Σ_t CF_t / (1 + r)^t = 0`, where `CF_t` are net LP cash flows (calls negative, distributions positive, terminal NAV positive)
- **Preferred return (single contribution, simplified)** accrued threshold = `Paid-in × [(1 + h)^t − 1]`, with hurdle `h` (commonly 0.08); in practice it accrues separately on each contribution from its draw date and compounds until distribution
- **GP catch-up with a 100% catch-up to carry rate `c`**: catch-up dollars `C = [c / (1 − c)] × (preferred return paid)`. For `c = 20%`, `C = 0.25 × preferred`. (Derivation: after catch-up the GP must hold `c` of total profit `(Pref + C)`, so `C = c(Pref + C)`, giving `C = cPref/(1 − c)`.)
- **KS-PME** = `[ Σ_t Distribution_t / I_t  +  NAV_T / I_T ] / [ Σ_t Contribution_t / I_t ]`, where `I_t` is the public index level at time `t`. Equivalently, future-value every flow to the terminal date at the index return and take the ratio. **KS-PME > 1 ⇒ net outperformance vs the index; < 1 ⇒ underperformance.**
- **Long-Nickels PME IRR**: build a hypothetical index portfolio by "buying" the index on each contribution date and "selling" it on each distribution date for the same amounts; the IRR of those flows plus the terminal index portfolio value is the PME IRR, compared against the fund's actual IRR.
- **Direct Alpha**: compound each fund cash flow forward to the terminal date at the index's realized return, then compute the IRR of those index-adjusted flows; that IRR is the precise annualized excess return (alpha).

---

## 17. Worked numerical examples (every number shown)

Each example is structured for conversion into an interactive calculator: inputs are labeled, and the arithmetic is explicit. **Fund Alpha** in 17.1 is the anchor; 17.2 to 17.4 reuse its numbers.

### 17.1 The J-curve, fully worked (Fund Alpha)

**Inputs (assumptions, stated for transparency):**
- Committed capital: **$100m**
- Term: 10 years; investment period: years 1 to 5
- Management fee: **2% of committed = $2m per year**, called every year, years 1 to 10 (total $20m). (Real funds step the fee down after year 5; this simplification keeps the arithmetic transparent. A step-down variation would lower later-year calls.)
- Investment deployment: **$80m** total, drawn years 1 to 4 as $25m, $25m, $20m, $10m
- Gross result: investments return **2.0x**, i.e. **$160m** of realizations, received years 5 to 10 as $20m, $30m, $30m, $30m, $30m, $20m
- Waterfall: European, 8% preferred, 100% catch-up, 20% carry. (Preferred accrued is taken as **$22m** for this cash-flow schedule; the catch-up algebra follows Section 16.)

**Step 1, capital calls by year** (investment draw + $2m fee):

| Year | Investment call | Fee call | Total call |
|---|---|---|---|
| 1 | 25 | 2 | 27 |
| 2 | 25 | 2 | 27 |
| 3 | 20 | 2 | 22 |
| 4 | 10 | 2 | 12 |
| 5 | 0 | 2 | 2 |
| 6 | 0 | 2 | 2 |
| 7 | 0 | 2 | 2 |
| 8 | 0 | 2 | 2 |
| 9 | 0 | 2 | 2 |
| 10 | 0 | 2 | 2 |
| **Total** | **80** | **20** | **100** |

Total called equals committed ($100m). Good.

**Step 2, distributions to the LP by year.** Under the European waterfall, all distributions go to the LP until the LP has received return of capital ($100m) plus the preferred ($22m) = **$122m**; only then do the catch-up and 80/20 split apply.

Cumulative realizations reach $122m partway through year 9:
- Years 5 to 8 distributions: 20 + 30 + 30 + 30 = $110m, all to LP (cumulative LP = $110m).
- Year 9 realization $30m: first $12m takes cumulative LP to $122m (hurdle cleared). The remaining $18m enters the carry tiers.
  - Catch-up: `C = 0.25 × $22m = $5.5m` → $5.5m to GP. Remaining $12.5m splits 80/20: $10m LP, $2.5m GP.
  - Year 9 totals: LP = 12 + 10 = $22m; GP = 5.5 + 2.5 = $8m.
- Year 10 realization $20m: catch-up already complete, so split 80/20: **$16m LP, $4m GP.**

| Year | Fund realization | To LP | To GP (carry) |
|---|---|---|---|
| 5 | 20 | 20 | 0 |
| 6 | 30 | 30 | 0 |
| 7 | 30 | 30 | 0 |
| 8 | 30 | 30 | 0 |
| 9 | 30 | 22 | 8 |
| 10 | 20 | 16 | 4 |
| **Total** | **160** | **148** | **12** |

Check: GP carry $12m = 20% of total profit ($160m − $100m = $80m). Correct.

**Step 3, LP net cash flow and the J-curve.**

| Year | Call (−) | Distribution (+) | Net cash flow | Cumulative net cash flow |
|---|---|---|---|---|
| 1 | −27 | 0 | −27 | −27 |
| 2 | −27 | 0 | −27 | −54 |
| 3 | −22 | 0 | −22 | −76 |
| 4 | −12 | 0 | −12 | **−88** (trough) |
| 5 | −2 | 20 | +18 | −70 |
| 6 | −2 | 30 | +28 | −42 |
| 7 | −2 | 30 | +28 | −14 |
| 8 | −2 | 30 | +28 | **+14** (crosses zero) |
| 9 | −2 | 22 | +20 | +34 |
| 10 | −2 | 16 | +14 | **+48** (final gain) |

The cumulative net cash flow bottoms at **−$88m in year 4**, climbs as distributions arrive, **crosses zero between years 7 and 8**, and finishes at **+$48m**. That trajectory is the J-curve.

**Step 4, the headline metrics for Fund Alpha:**
- Net gain to LP = total distributions − total calls = $148m − $100m = **+$48m**
- **Net TVPI** = $148m / $100m = **1.48x** (and at liquidation DPI = 1.48x, RVPI = 0)
- **Net IRR ≈ 9%** (solving `Σ CF_t/(1+r)^t = 0` on the year-by-year net cash flows; NPV is about −$0.1m at 9% and about −$3.3m at 10%, so the IRR sits just under 9%)
- **Gross multiple on investments** = $160m / $80m = **2.0x**

**The lesson in the gap:** the fund earned 2.0x gross on its deals but only **1.48x net** for the LP, and a ~9% net IRR barely above the 8% hurdle. The $80m of gross profit was reduced by **$20m of fees** and **$12m of carry**. That fee-and-carry drag, turning 2.0x into 1.48x, is the single most important number for an LP to internalize.

### 17.2 Interim metrics mid-life (Fund Alpha at end of year 6)

NAV below is **illustrative** (NAV is a fair-value mark, not determined by the cash-flow schedule alone); the ratios show how the metrics are built.

**Inputs at end of year 6:**
- Cumulative paid-in = 27 + 27 + 22 + 12 + 2 + 2 = **$92m**
- Cumulative distributions to LP = 20 (yr 5) + 30 (yr 6) = **$50m**
- NAV of unrealized holdings (illustrative) = **$90m**

**Computation:**
- DPI = 50 / 92 = **0.54x**
- RVPI = 90 / 92 = **0.98x**
- TVPI = (50 + 90) / 92 = 140 / 92 = **1.52x** (= DPI + RVPI = 0.54 + 0.98 = 1.52, identity checks)

Reading: at this point only about half the paid-in capital has come back as cash (DPI 0.54x), and most of the reported value (RVPI 0.98x) is still unrealized GP marks. A skeptical LP weights the 0.54x of realized cash more heavily than the 1.52x of total reported value.

### 17.3 Distribution waterfall, standalone clean version (European)

**Inputs:**
- LP paid-in capital: **$100m**
- Total distributable proceeds: **$180m**
- Preferred return accrued (given): **$25m** (8% compounded; taken as precomputed)
- Catch-up: 100% to GP until GP holds 20% of profit; Carry: 20%

**Tier 1, Return of capital:** LP receives **$100m**. Remaining = 180 − 100 = $80m.

**Tier 2, Preferred return:** LP receives **$25m**. Remaining = 80 − 25 = $55m. (LP now has $125m.)

**Tier 3, GP catch-up:** `C = 0.25 × $25m = $6.25m` to GP. Check: profit so far = preferred $25m + catch-up $6.25m = $31.25m, GP share $6.25m = 20%. Remaining = 55 − 6.25 = $48.75m.

**Tier 4, 80/20 split:** LP = 0.80 × 48.75 = **$39m**; GP = 0.20 × 48.75 = **$9.75m**.

**Totals:**
- LP = 100 + 25 + 39 = **$164m**
- GP carry = 6.25 + 9.75 = **$16m**
- Check: 164 + 16 = $180m. Total profit = $80m; GP carry $16m = 20% of $80m. Correct.

### 17.4 Same proceeds, no hurdle and no catch-up (to isolate the hurdle's effect)

**Inputs:** LP paid-in $100m; proceeds $180m; 20% carry; **no preferred return, no catch-up** (a "straight" split above return of capital).

**Tier 1, Return of capital:** LP $100m. Remaining $80m.
**Tier 2, 80/20 split of all profit:** LP = 0.80 × 80 = **$64m**; GP = 0.20 × 80 = **$16m**.
**Totals:** LP = 100 + 64 = $164m; GP = $16m.

Result is identical to 17.3 ($164m LP, $16m GP). The lesson: when a fund clears its hurdle comfortably, the catch-up "gives back" to the GP exactly what the preferred "front-loaded" to the LP, so the *final* split converges to 80/20 either way. The hurdle and catch-up change *timing* and *who bears downside if the fund underperforms*, not the end split on a clear winner. The hurdle bites only when returns are low enough that the GP never fully catches up.

### 17.5 Recycling

**Inputs:**
- Committed = **$100m**, fully deployed into investments.
- Year 2: an investment that cost **$10m** is exited for **$14m**.
- Recycling permitted up to 100% of commitments, within the investment period.

**Without recycling:** the $14m is distributed. Total capital ever deployed into assets = $100m. If the whole portfolio returns 2.0x, gross realizations ≈ $200m.

**With recycling:** the GP distributes the **$4m gain** but retains/recalls the **$10m cost** and reinvests it. Total capital deployed into assets becomes **$110m** ($100m original + $10m recycled), even though LPs only ever *committed* $100m. If that extra $10m also returns 2.0x, it generates an additional **$20m** of gross realizations (a $10m incremental gain).

**Effects to flag:**
- Invested capital ($110m) now exceeds committed capital ($100m); paid-in can likewise exceed commitment if recycled amounts are re-called.
- Per ILPA practice, the management fee is charged only **once** on recycled capital, and reinvestment after the window needs LP consent. Recycling boosts potential multiples but increases the LP's deployed exposure beyond the headline commitment, which matters for pacing and liquidity.

### 17.6 KS-PME, fully worked

**Inputs (a mini single-deal fund, to isolate the mechanics):**
- Year 0: contribution (call) = **$100**
- Year 5: distribution = **$200**; final NAV = $0 (fully realized)
- Public index total return over the five years: **+50%** (index level goes from 1.00 to 1.50)

**Step 1, discount every flow at the index.** Bring flows to time 0 by dividing by the index growth from time 0 to that flow's date.
- Contribution at year 0: $100 / 1.00 = **$100**
- Distribution at year 5: $200 / 1.50 = **$133.33**

**Step 2, take the ratio.**
`KS-PME = (index-discounted distributions + NAV) / (index-discounted contributions) = 133.33 / 100 = 1.333`

**Interpretation:** KS-PME = **1.33 > 1**, so the fund **beat the index net of fees**. Equivalently and as a sanity check: $100 invested in the index for five years would have grown to $150; the fund instead returned $200; $200 / $150 = **1.333**. The LP ended with about 33% more than the public-market alternative would have produced on the same cash-flow schedule.

(For a multi-flow fund, repeat Step 1 for every call and every distribution using the index level on each date, add a final term for current NAV divided by the latest index level, then take the ratio. Direct Alpha would instead future-value each flow to year 5 at the index return and solve for the IRR of those adjusted flows to express the same outperformance as an annualized rate.)

---

## 18. Sources

Conceptual mechanics (fund structure, lifecycle, capital calls, the metric definitions) are standard and corroborated across the sources below; specific figures and the academic methods are cited inline by number.

1. Kaplan, S. and Schoar, A. (2005), "Private Equity Performance: Returns, Persistence and Capital Flows," *The Journal of Finance*. https://onlinelibrary.wiley.com/doi/10.1111/j.1540-6261.2005.00780.x
2. Alpha Architect summary of PE performance literature (buyout PME outperformance ~20% to 27% over fund life; ~3%+ per year). https://alphaarchitect.com/private-equity-performance-give-me-the-facts-man/
3. NBER Working Paper 17874, "Private Equity Performance: What Do We Know?" (PME definition; Venture Economics downward bias). https://www.nber.org/system/files/working_papers/w17874/w17874.pdf
4. Same as [2].
5. Sorensen, M. and Jagannathan, R., "The Public Market Equivalent and Private Equity Performance," *Financial Analysts Journal* (2015) (theoretical justification of KS-PME). https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2347972
6. ResearchGate record of Kaplan-Schoar (PME as superior statistic). https://www.researchgate.net/publication/5176439_Private_Equity_Performance_Returns_Persistence_and_Capital_Flows
8. O'Connell, R., CFA, "Private Equity Performance Metrics: PME, Benchmarking, and Return Pitfalls" (KS-PME ≈ 0.97 average US buyout; top-quartile >1.2, bottom <0.7; Long-Nickels description). https://ryanoconnellfinance.com/private-equity-performance-metrics/
9. Landmark Partners, "An ABC of PME" (Long-Nickels/ICM origin; Direct Alpha relationship). https://www.secondariesinvestor.com/wp-content/uploads/sites/3/2014/03/An-ABC-of-PME-Landmark-Partners.pdf
10. CFA Institute Enterprising Investor, "Evaluating Private Equity Performance: PME vs. Direct Alpha" (Long-Nickels ICM/PME and its negative-NAV issue). https://blogs.cfainstitute.org/investor/2014/07/23/evaluating-private-equity-performance-pme-vs-direct-alpha/
12. Gredil, O., Griffiths, B. and Stucke, R. (2014), "Benchmarking Private Equity: The Direct Alpha Method," SSRN 2403521. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2403521
14. Gredil, Griffiths, Stucke, "Benchmarking private equity: the direct alpha method," *Journal of Banking & Finance* (ScienceDirect). https://www.sciencedirect.com/science/article/pii/S0929119923000093
17. Direct Alpha paper PDF (PME+ by Rouvinez/Capital Dynamics 2003; mPME by Cambridge Associates 2013). https://allocatortraining.com/wp-content/uploads/2023/06/Benchmarking-PE-Direct-Alpha-Method.pdf
18. Chronograph, "Bain 2025 Private Equity Report: Key Takeaways" (buyout multiples 11.9x NA / 12.1x EU; software value-creation split). https://www.chronograph.pe/top-takeaways-from-bains-2025-private-equity-report/
19. Bain & Company / PR Newswire, "Private equity resurgence gathers steam" (2026 report: ~$1.3tn buyout dry powder; 2025 deal value +44% to $904bn; exits +47% to $717bn; EA $56.6bn record). https://www.prnewswire.com/news-releases/private-equity-resurgence-gathers-steam-as-new-era-challenges-firms-to-enhance-value-creationbain--company-global-pe-report-302693957.html
20. Bain & Company, "Private Equity Outlook 2026: Gaining Traction" (exit detail; Aligned Data Centers $40bn; Preqin vintage definition). https://www.bain.com/insights/outlook-gaining-traction-global-private-equity-report-2026/
22. Bain & Company press release (2026 report; dry powder and deal/exit figures). https://www.bain.com/about/media-center/press-releases/2026/private-equity-resurgence-gathers-steam-as-new-era-challenges-firms-to-enhance-value-creationbain--company-global-pe-report/
24. Bain Global Private Equity Report 2026 (PDF). https://www.bain.com/globalassets/noindex/2026/bain-report_global-private-equity-report-2026.pdf
25. Bain & Company, "Leaning Into the Turbulence: Private Equity Midyear Report 2025" ($1.2tn dry powder, ~25% aged 4+ years). https://www.bain.com/insights/private-equity-midyear-report-2025/
26. Chief Investment Officer, "LP-, GP-Led Secondaries Grow to Record Volumes in 2025" (H1 2025: Evercore $102bn, Jefferies $103bn; LP-led 54%; buyouts 72% of volume). https://www.ai-cio.com/news/lp-gp-led-secondaries-grow-to-record-volumes-in-2025/
27. Jefferies, "2025 Global Secondary Market Review: Another Record-Breaking Year" (full-year 2025 volume $240bn, +48%; dedicated secondary capital $327bn). https://www.jefferies.com/insights/the-big-picture/2025-global-secondary-market-review-another-record-breaking-year/
28. Torys LLP, "Secondaries in 2025: building on a record year" (2024 volume $160bn; denominator-effect context). https://www.torys.com/our-latest-thinking/torys-quarterly/q1-2025/secondaries-in-2025
30. Chief Investment Officer, "Secondaries Volume Reached Record in 2025" (Evercore full-year: LP-led $120bn +34%, GP-led $106bn +51%; $26bn in 2013, $60bn 2020, $134bn 2021; buyout stakes ~94% NAV in H1 2025). https://www.ai-cio.com/news/secondaries-volume-reached-record-in-2025-as-lps-embrace-market/
31. Secondaries Investor, "Secondaries volume hits record high of $160bn – Evercore" (2024 figure; $114bn in 2023). https://www.secondariesinvestor.com/secondaries-volume-hits-record-high-of-160bn-evercore/
35. Alter Domus, "How Private Equity Funds Are Structured" (20% carry over 8% preferred; 100% deal-fee offset; recycling up to 100% of paid-in; whole-fund vs deal-by-deal waterfall; clawback escrow ~90 days; average fee ~1.74% of committed). https://alterdomus.com/insight/private-equity-fund-structure/
36. Moonfare, "Carried Interest in Private Equity" ("2 and 20"; carry accrual; hurdle). https://www.moonfare.com/glossary/carried-interest
37. EQT, "How Private Capital Firms Make Money: Fees and Carried Interest" (~2% fee on committed; 20% carry; ~6% to 8% hurdle; GP commitment 1% to 2%). https://eqtgroup.com/thinq/equity/how-private-capital-firms-make-money-fees-and-carried-interest-explained
38. Private Equity Bro, "Private Equity Fee Structure" (fee step-down to invested cost; preferred ~8%; catch-up). https://privateequitybro.com/private-equity-fee-structure/
39. Substack, "the hidden face of funds when carry" (GP commits 1% to 2%; carry leverage example). https://braininvest0.substack.com/p/the-hidden-face-of-funds-when-carry
40. Corporate Finance Institute, "Carried Interest Explained" (hurdle ~8%; fund life 7 to 10 years; ~2% fee / ~20% carry). https://corporatefinanceinstitute.com/resources/career-map/buy-side/private-equity/carried-interest-explained
41. CFA-style waterfall notes (management fees 1.0% to 2.5% of committed; GP contribution ~1.0%; deal-by-deal vs fund-as-a-whole). https://www.slideshare.net/slideshow/private-equity-waterfall-notes/15270437
42. CalPERS, "Private Equity Cash Flow Distribution Examples" (illustrative ~2% fee for life, 20% profit share, waterfall illustration). https://www.calpers.ca.gov/docs/board-agendas/201508/invest/item09a-01.pdf
43. ILPA Principles 3.0 contents (waterfall, carry, recycling, clawback, fees, GP commitment, fund term, key person, governance, LPAC, GP-led secondaries). https://docslib.org/doc/4236156/ilpa-principles-3-0-fostering-transparency-governance-and-alignment-of-interests-for-general-and-limited-partners
44. ILPA, "ILPA Principles" overview (origin in 2009; alignment, governance, transparency). https://ilpa.org/industry-guidance/principles-best-practices/ilpa-principles/
46. ILPA Principles 3.0 (2019) PDF. https://ilpa.org/wp-content/uploads/2019/06/ILPA-Principles-3.0_2019.pdf
47. Noerr, "ILPA Principles 3.0 Released" (LPA framing; cross-fund, GP-led secondaries, LPAC guidance). https://www.noerr.com/en/insights/ilpa-principles-30-released-new-guidance-on-private-equity-fund-terms---first-experiences
48. ILPA Principles 3.0 flipbook page (capital call & distribution template, performance template, 2025 updates). https://ilpa.org/resource/ilpa-principles-3-0-flipbook/

**General definitional support** (used throughout for standard terms): Investopedia and CFA Institute curriculum material on PE fund structures, capital calls, distributions, IRR, MOIC, TVPI, DPI, RVPI, and the J-curve. These are conventional definitions and are not individually footnoted.
