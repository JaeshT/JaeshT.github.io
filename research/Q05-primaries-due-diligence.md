# Underwriting a Primary Fund Commitment: An LP Analyst's Field Manual

*A study reference for a Primaries & Co-Investments (LP / fund-investing) internship. Built from ILPA, Cambridge Associates, Preqin/PitchBook, Bain & McKinsey, the CFA Institute, and the academic PME literature. Sources are listed at the end and cited inline as (Author/Org, year). Where credible sources disagree, the disagreement is flagged explicitly.*

---

## 0. Read this first: the uncomfortable framing

Start with the strongest argument against the entire enterprise you are about to learn, because if you cannot answer it you will underwrite badly.

**The case that primary underwriting is largely theater:** Past fund performance is a weak predictor of future fund performance in buyout. The persistence that made manager selection look skillful in early studies (Kaplan & Schoar, 2005) has substantially eroded for buyout funds since 2000 (Harris, Jenkinson, Kaplan & Stucke, 2014). A 60-page investment committee (IC) memo, six reference calls, and a regression of deal-by-deal IRRs cannot reliably distinguish the next top-quartile manager from the next median one, because the signal is thin and survivorship and backfill bias inflate the track records you are handed. On this view, most of an LP's realized edge comes not from "picking winners" but from three boring things: **access** (getting into capacity-constrained funds you have already decided are good), **terms** (paying less in fees and keeping more governance rights), and **pacing/portfolio construction** (committing steadily across vintages so you are never forced to time the market). The diligence ritual mostly screens out frauds and disasters rather than identifying alpha.

**Why you still do all of it anyway:**
1. Diligence is asymmetric insurance. It rarely finds the next outperformer, but it routinely kills the operational fraud, the strategy-drifted blow-up, and the GP whose track record is one lucky deal. Avoiding the bottom quartile is worth more than finding the top, because **dispersion in private markets is enormous**: top-quartile buyout funds from the 2015 to 2019 vintages sit around 2.3x to 2.7x net TVPI and 18 percent to 22 percent net IRR, while the median is roughly 1.6x to 1.8x and 12 percent to 14 percent, and bottom-quartile funds lose money in real terms (Cambridge Associates / Preqin data, 2025). Manager selection is the whole game precisely because the spread is so wide.
2. The thing that *does* persist is the bottom. Poor managers tend to stay poor or fail to raise again (HJKS, 2014). Diligence is very good at detecting "bottom-quartile in waiting."
3. Bad terms and bad governance compound forever. A 200 basis point fee giveaway or an American (deal-by-deal) waterfall with no real clawback is a permanent transfer of LP money to the GP regardless of skill.

**The operating mindset:** You are not trying to fall in love with a manager. You are trying to *falsify* the GP's pitch. Every claim in a PPM (private placement memorandum) is a hypothesis the GP wants you to accept. Your job is to find the version of reality in which the claim is false, and then decide whether the residual risk is acceptable at the offered terms. The default posture is skeptical, the burden of proof is on the GP, and silence in a data room is evidence, not absence of evidence.

**The current environment (2025 to 2026), which colors everything:** This is a liquidity-starved, "K-shaped" market. Global buyout deal value rebounded roughly 44 percent to about USD 904 billion in 2025 and exit value rose about 47 percent to roughly USD 717 billion, but distributions to LPs stayed stubbornly low and fundraising remained a grind (Bain Global Private Equity Report 2026). There is roughly USD 1.2 trillion of buyout dry powder, nearly a quarter of it more than four years old (Bain, 2025). DPI (cash actually returned) has overtaken IRR and TVPI as the metric LPs fixate on, because GPs are sitting on large unrealized marks they have not converted to cash, and 2018-vintage DPI of about 0.6x is running below the historical norm of about 0.8x at the same age (Bain, 2025). Continuation vehicles and GP-led secondaries have grown but still represent under 10 percent of total exit value, so they relieve but do not solve the liquidity squeeze (Bain, 2026). Translation for you: scrutinize realizations, treat NAV marks as a hypothesis, and assume re-up conversations now hinge on DPI.

---

## 1. The four-pillar due diligence framework

LP primary diligence on a fund commitment is conventionally split into four workstreams that run in parallel and must each clear independently. Failing any one can kill the deal, and in many institutions the operational and legal teams hold a formal **veto** that overrides a strong investment case.

| Pillar | Core question | Who owns it | Kill power |
|---|---|---|---|
| **Investment DD (IDD)** | "Can this team generate top-qu/above-public returns repeatably?" | Investment team / deal lead | Recommends |
| **Operational DD (ODD)** | "Can we trust this firm with our cash and our reporting?" | ODD / risk team (often independent) | Veto |
| **Legal / Terms** | "Are the LPA economics and governance acceptable and aligned?" | In-house counsel + outside fund counsel | Veto on terms |
| **ESG** | "Are there material non-financial risks, and does this meet our policy / regulatory mandate?" | ESG / responsible-investment team | Veto for mandate-bound LPs |

The IDD-versus-ODD distinction is worth memorizing as the canonical framing: IDD is the "can you make money" test, ODD is the "can we trust you with our capital" test, and both must pass independently (altSS, 2026; Dasseti). Roughly half of fund-manager failures trace to operational breakdowns rather than bad investing, which is why ODD has risen to near parity with IDD in importance since the Madoff, Bayou, Amaranth, and Weavering scandals (DiligenceVault; Wikipedia, ODD). A clean IDD does not save a fund that fails ODD.

A typical institutional timeline runs 3 to 6 months for a fund-of-funds, and 6 to 18 months for a large pension or endowment building conviction, including monitoring of the GP across one or more prior funds before committing (altSS, 2026). Much of the early work is screening: a large LP may see hundreds of PPMs a year and formally diligence a small fraction.

---

## 2. Track-record analysis (the analytical core)

This is where an analyst spends most of their time. The deliverable is usually a "track record tear-down" spreadsheet that re-derives every reported number from the underlying cash flows and deal data, because **GPs present their record the way it flatters them most**, and your job is to neutralize the spin.

### 2.1 The core return metrics, and what each one hides

| Metric | What it measures | What it hides / why it lies |
|---|---|---|
| **IRR** | Time-weighted... actually money-weighted annualized return on dated cash flows | Highly sensitive to *timing*; can be inflated by subscription lines and early small wins; assumes interim distributions are reinvested at the IRR itself, which overstates re-investment; a single early home run can lock in a high "since-inception" IRR forever |
| **MOIC** | Gross multiple: total value / invested capital (deal level, usually gross) | Ignores time entirely (3.0x in 3 years and 3.0x in 12 years look identical) and is usually quoted gross of fees |
| **TVPI** | Net multiple: (cumulative distributions + residual NAV) / paid-in capital | Includes unrealized NAV, which is the GP's own opinion of value |
| **DPI** | Realized: cumulative distributions / paid-in capital | Nothing. This is cash in your pocket. It is the metric that cannot be marked up |
| **RVPI** | Unrealized: residual NAV / paid-in capital | Pure GP mark; the part of the story most vulnerable to optimism and smoothing |
| **PME** | PE return versus what the same cash flows would have earned in a public index | Does not adjust for leverage or illiquidity risk; sensitive to which index you pick |

Identities you must know cold: **TVPI = DPI + RVPI**, and MOIC ≈ gross TVPI at the deal level. As a fund matures, a healthy fund's RVPI should fall as DPI rises (paper turning into cash). If RVPI keeps climbing while DPI stalls, the manager is marking up assets it cannot sell, which is the single most common late-cycle red flag of 2024 to 2026 (GP-Intel, 2026; Angel Investors Network, 2026).

**The IRR-versus-MOIC tension is the most-tested concept.** IRR rewards speed; MOIC rewards magnitude. A GP that flips a deal in 18 months at 1.8x posts a spectacular IRR (around 45 percent) but returns less absolute profit than a deal held seven years at 3.0x (about 17 percent IRR). LPs ultimately eat MOIC, not IRR, because you cannot spend an annualized percentage. Always read them as a pair, and distrust any track record where a gaudy IRR sits next to a mediocre MOIC, because that pattern is the fingerprint of financial engineering (early dividend recaps, subscription-line timing, quick partial sales) rather than durable value creation.

### 2.2 Gross-to-net: the spread is the fee verdict

GPs quote **gross** deal returns (before management fees, carried interest, fund expenses, and fund-level leverage cost). LPs earn **net**. The gap between them is the total cost of the relationship, and quantifying it is non-negotiable.

Typical full-life spreads for buyout: roughly **5 to 7 points of IRR** and **0.4x to 0.6x of MOIC** lost to fees and carry. A useful sanity rule is that net TVPI tends to capture on the order of 75 percent to 85 percent of gross MOIC for a successful buyout fund. If a GP shows a gross-to-net spread that is implausibly small, either the fees are unusually low (verify in the LPA) or the gross numbers exclude something they should include (fund-level leverage, expenses, broken-deal costs). If the spread is unusually large, the fee load or expense pass-throughs are abusive. **A worked gross-to-net example is in Section 11 (Example F).**

Always ask the GP for the track record presented **net of all fees, carry, and expenses, and additionally with and without the impact of subscription credit lines.** ILPA's January 2025 Performance Template made the dual sub-line disclosure a standard ask, and any institutional-quality GP should have those numbers ready (Angel Investors Network, 2026).

### 2.3 Deal-by-deal attribution and the value-creation bridge

Fund-level returns are an average that can be dominated by one or two deals. The first attribution test is concentration: **strip out the top one, two, and three deals and recompute the fund.** If a "2.4x fund" collapses to 1.3x without its single best deal, you are not underwriting a repeatable process, you are underwriting one piece of luck and the question becomes whether the GP can do it again.

The second test is the **value-creation bridge** (the "value bridge"), which decomposes equity gains into their economic sources for each deal and in aggregate. The three classic levers:

1. **EBITDA (earnings) growth** = organic revenue growth plus margin expansion. This is the only lever that reflects genuine operating skill.
2. **Multiple expansion** = selling at a higher entry/exit multiple than you bought. Often this is just buying cheap and selling into a hot market, that is, beta and timing, not skill.
3. **Deleveraging / debt paydown** = using portfolio-company cash flow to pay down acquisition debt, which mechanically grows the equity slice. This is leverage, not operations.

McKinsey found that roughly **two-thirds of total return for buyout deals entered in 2010 or later and exited by 2021 came from multiple expansion and leverage**, not operating improvement (McKinsey, 2024). With cheap debt and easy multiple expansion gone, Bain's 2026 framing is that "12 is the new 5," meaning deals now require far faster EBITDA growth to hit the same returns (Bain, 2026). **Therefore: a GP whose historical returns are mostly multiple expansion and leverage is, on the evidence, going to struggle in the current regime, and you should discount their forward case heavily.** A GP that can show a high and consistent share of returns from EBITDA growth is the one whose edge is most likely to survive. A worked value-bridge example is in Section 11 (Example E).

*Caveat the bridge itself:* the standard value bridge gives the GP full credit for the company's market and sector performance and treats debt paydown crudely, so it can overstate operating skill and misattribute the leverage effect (KPMG, 2016). Use it as a directional decomposition, not gospel.

### 2.4 Loss ratios and downside discipline

The **capital loss ratio** is the percentage of invested capital in deals realized below cost, net of any recovered proceeds, divided by total invested capital (Cambridge Associates). The related **impairment ratio** is the percentage of invested capital realized *or currently valued* below cost, so it captures unrealized write-downs too (Cambridge Associates).

Why it matters: returns are driven as much by *not losing* as by winning. Two GPs can post the same TVPI, one through a few moonshots offsetting many losses (high loss ratio, high dispersion) and one through broad-based base hits (low loss ratio). For a buyout LP relying on consistency, the low-loss-ratio manager is usually preferable because the outcome is more repeatable and less dependent on hitting the next moonshot.

Benchmarks (Cambridge Associates, deals 1990 to 2016): US buyout and growth equity realized capital loss ratios cluster in roughly the low double digits, often cited around the 10 percent range, while venture capital loss ratios are far higher because the VC model expects many zeros offset by a few outsized winners. A buyout GP with a 25 percent-plus loss ratio is running a riskier, more VC-like book than the strategy label suggests, and you should price that.

*Watch the gaming angle:* because the loss ratio counts only realizations below cost, a GP can suppress the reported figure by holding losers at cost on the books rather than crystallizing the loss, or by exiting marginal deals at exactly break-even to avoid a sub-1.0x realization (academic work documents this "loss avoidance" behavior around the 1.0x threshold; UNC IPC, 2024). Cross-check the loss ratio against the distribution of deal MOICs and against unrealized marks.

### 2.5 Realized versus unrealized, and the NAV mark problem

Split every track record into **realized** (cash done, irreversible) and **unrealized** (NAV, an opinion). The realized record is evidence; the unrealized record is a forecast dressed as a number.

How GPs flatter unrealized value, and how you counter it:
- **Stale or sticky marks.** GPs are slow to write down in falling markets ("NAV smoothing" / return smoothing), which artificially lowers reported volatility and props up TVPI. Check whether marks moved at all through 2022 to 2023, when public comparables fell hard. Marks that did not move are a flag.
- **Held above cost with no validating event.** Be skeptical of large markups not supported by a financing round, a third-party transaction, or genuine EBITDA growth. Ask for the valuation methodology and inputs (comparable multiples, discount rates) deal by deal.
- **Marking to the last round.** In venture and growth, companies are often held at the last primary round price, which can be 12 to 24 months stale and was set by an investor with different incentives.
- **The RVPI-DPI relationship.** A mature fund (say year 8-plus) that is still mostly RVPI has a realization problem, a valuation problem, or both.

The defensive move is to **haircut unrealized NAV** in your own model (LPs commonly stress RVPI down by 10 percent to 40 percent depending on asset type and mark vintage) and re-underwrite the fund on the haircut numbers. If the deal only works at full marks, it does not work.

### 2.6 DPI by vintage, and "what good looks like"

DPI must always be read against the fund's **vintage year** and strategy, never in the abstract, because a 0.3x DPI is excellent for a year-3 fund and alarming for a year-9 fund. The J-curve means early DPI is near zero by construction.

Rule-of-thumb DPI pacing for buyout (benchmark to Cambridge Associates / Preqin quartiles for the exact vintage and strategy):

| Fund age | Typical (median) buyout DPI | Read |
|---|---|---|
| Year 3 | ~0.0x to 0.3x | J-curve, normal |
| Year 5 | ~0.3x to 0.6x | Building |
| Year 7 | ~0.6x to 1.0x | A fund below ~0.5x here raises questions |
| Year 8 | ~1.0x+ | LPs expect ~1.5x at top quartile |
| Year 10 to 12 (maturity) | ~1.5x to 2.0x | Full-cycle top-quartile funds end above ~2.0x |

(Sources: GP-Intel 2026; Value Add VC 2025; pipelineroad 2026, citing Cambridge Associates 2025. Median US buyout DPI for the 2012 to 2015 vintages sat around 1.4x to 1.7x as of Q3 2024.) Note that 2025-to-2026 distributions are running *below* these historical norms across the board because the exit market stalled, so judge a current fund against its peer vintage cohort, not against a pre-2022 idealized curve.

"What good looks like" on the full scorecard, buyout, mature vintage:

| Metric | Median | Top quartile | "Good" signal |
|---|---|---|---|
| Net IRR | 12% to 14% | 18% to 22% | Consistent, not lumpy |
| Net TVPI | 1.6x to 1.8x | 2.3x to 2.7x | Backed by DPI, not just NAV |
| Net DPI (mature) | ~1.4x to 1.7x | 2.0x+ | The metric that matters most now |
| KS-PME vs S&P 500 | ~1.0x to 1.1x | 1.2x+ | Beating public markets net of fees |
| Capital loss ratio | ~10% range (buyout) | Lower | Few zeros; downside discipline |

### 2.7 Consistency, persistence, and the truth about quartiles

GPs love to claim "top-quartile" status. Treat the claim as a marketing artifact until verified, because:
- **Quartile is dataset- and vintage-dependent.** A fund can be top quartile in one provider's universe and second quartile in another. Always pin the GP to a named benchmark, a specific vintage, and a specific strategy. Do not let a 2016 fund be compared against a 2019 benchmark (Angel Investors Network, 2026).
- **Persistence has weakened.** The early evidence (Kaplan & Schoar, 2005) showed strong return persistence, which made manager selection look like a durable skill. Later work using cleaner data (Harris, Jenkinson, Kaplan & Stucke, 2014, "Has Persistence Persisted in Private Equity?") found that **post-2000 buyout persistence is much weaker**: a GP's prior-fund quartile is a poor predictor of the next fund's quartile. **What persists more reliably is the bottom:** poor performers tend to stay poor or fail to raise a successor. Venture capital retains stronger persistence than buyout. *(Flag: the precise persistence coefficients vary by study and dataset; the robust, widely accepted direction is "weakened buyout persistence, stronger VC persistence, sticky bottom." Verify exact figures against the source paper before quoting them.)*

The practical implication: "they were top quartile in Fund III" is weak evidence about Fund VI. Stronger evidence is a *coherent, repeatable process* that explains the returns (sourcing edge, sector specialization, an operating playbook applied consistently), plus a low loss ratio across vintages, plus realizations (DPI) rather than marks. Cambridge Associates' own line is that consistently being top quartile is exceedingly rare and most managers drift in and out of the rankings over time (cited via Equitybee, 2025).

### 2.8 PME: did they actually beat the alternative?

An LP could always have bought a public index instead. PME (public market equivalent) answers "did the GP beat that alternative, using the GP's own cash-flow timing?" It is the honest benchmark because it neutralizes the timing games that flatter IRR.

The PME family (know the lineage, it is a common interview question):
- **Long-Nickels PME / ICM** (Long & Nickels, 1996): the original. Uses fund cash flows to build a hypothetical index investment (contributions buy the index, distributions sell it) and computes a hypothetical IRR to compare against the fund IRR. Weakness: a fund with large early distributions can drive the hypothetical index position negative ("shorting the index"), producing nonsensical results (Carta; Moonfare).
- **PME+** (Rouvinez / Capital Dynamics, 2003): scales distributions to keep the hypothetical NAV from going negative, fixing the Long-Nickels flaw.
- **mPME** (Cambridge Associates, 2013): a modified variant treating the fund as a notional public vehicle.
- **KS-PME** (Kaplan & Schoar, 2005): the most widely cited. Returns a **ratio (a wealth multiple), not an IRR**: discount/compound both the distributions and contributions at the index's actual return path and divide. **Above 1.0 means the fund beat the index; below 1.0 means it lost to it.** A KS-PME of 1.18 means LPs ended with 18 percent more wealth than the same dollars invested in the index at the same times.
- **Direct Alpha** (Gredil, Griffiths & Stucke, ~2014): the most rigorous and most recent. Essentially an annualized KS-PME, expressed as an alpha (percent per year), derived from the IRR of index-discounted cash flows.

There is **no single industry-standard PME method**, and the index choice matters as much as the method: benchmark a large-cap buyout fund to the S&P 500, a small-cap fund to the Russell 2000, and a growth/tech fund to the Nasdaq, or you will mis-measure alpha (Nasdaq/eVestment, 2023). Worked KS-PME and Direct Alpha examples are in Section 11 (Example D).

**Flag: the academic verdict on whether PE beats public markets is genuinely contested, and the answer depends on the dataset, the fee treatment, and the era.**
- Kaplan & Schoar (2005), using Venture Economics data, found average buyout funds roughly *matched or slightly underperformed* the S&P 500 net of fees (KS-PME around 0.97).
- Harris, Jenkinson & Kaplan (2014, Journal of Finance), using cleaner Burgiss data from 200-plus LPs, found buyout funds *outperformed* the S&P 500 by roughly **20 percent to 27 percent over a fund's life and more than 3 percent per year** for most vintages since 1984. They attribute part of the difference to data-quality problems in Venture Economics.
- Phalippou & Gottschalg (2009) and Ludovic Phalippou's later work argue much PE outperformance disappears once you correct for risk, fees, and the way IRR and the "money multiple" are reported, and that net-of-fee buyout returns have often been close to a leveraged small-cap index. *(Flag: I am recalling Phalippou's magnitudes from the literature, not from a freshly retrieved source in this session; treat the specific figures as needing verification, though the existence of the pessimistic camp is well established.)*

The honest takeaway for an analyst: PE *as an asset class* has probably beaten public markets net of fees in buyout over long horizons, but the margin is debated, is concentrated in top managers, and is not guaranteed going forward. This is exactly why manager selection, not asset-class beta, is the LP's job.

---

## 3. Team assessment

You are underwriting people who will control your capital for a decade-plus with limited ability to fire them. Track record is the team's *past*; this section is about whether that team is intact, motivated, and aligned for the *future* fund.

**Attribution to individuals.** A firm's track record was generated by specific partners on specific deals. Map every meaningful deal to the partner(s) who sourced, led, and sat on the board. Then ask: are those people still here, still doing the work, and committed to this fund? A common trap is the **spin-out attribution dispute**: a partner leaves a brand-name firm, claims credit for the deals that built that firm's record, and the old firm disputes it. Get the attribution in writing from independent sources (co-investors, references) where you can.

**Key-person risk.** Identify the handful of individuals without whom the strategy does not work. Concentration is the risk: if one founding partner generated most of the alpha and holds most of the economics, the franchise is that one person, and the LPA's key-person clause (Section 5) is your only protection. A team where alpha and economics are broadly distributed across a bench is more durable.

**Turnover.** Track partner and senior-investor departures over the last 5 to 10 years. Some turnover is healthy (under-performers managed out); a pattern of unexplained senior departures, especially of rising stars or anyone who left mid-fund, is a serious flag. Always ask departed partners for a reference call, and treat a GP's reluctance to facilitate one as informative.

**Succession and ownership.** Many founder-led firms have unresolved succession. Ask who owns the management company, how carry is split across the team and across generations, whether next-generation partners have a real economic and ownership path, and what happens when the founder steps back. A 65-year-old founder raising a 12-year fund with no succession plan and 90 percent of the carry is a structural problem regardless of the track record (V7 Labs / LP DD analysis, 2026).

**Alignment.** The clearest alignment signal is the **GP commitment**: how much of their own money the partners put into the fund, and crucially *how* (cash is real skin in the game; a management-fee waiver is not, because it is just foregone fee, and ILPA explicitly prefers cash, Section 5). Market is roughly **1 percent to 3 percent of fund size**; first-time managers often go higher to signal conviction. But the *distribution within the partnership* matters as much as the total: if one partner funds 90 percent of the GP commit and the team funds 10 percent, the non-founders are weakly retained (V7 Labs, 2026). Look also at carry vesting (does it cliff or vest over the fund life, and does it claw back if a partner leaves?), and at whether partners have meaningful personal net worth tied up versus being paid out already.

**Culture and behavioral flags.** Reference calls and on-sites surface things numbers cannot: lavish lifestyle spending out of step with fund economics, a fear-based culture that bleeds talent, a founder who cannot name a deal they got wrong, or a team that cannot articulate its process without reading slides. These are soft signals, but bottom-quartile and blow-up funds are over-represented in the soft-signal tail.

---

## 4. Strategy, edge, and strategy drift

**Articulate the edge in one sentence, then try to break it.** A real edge is a repeatable, defensible reason this team earns above-market returns that others cannot easily copy. Categories of plausible edge: proprietary sourcing (off-market deals via a network others lack), genuine sector specialization (operating expertise that wins auctions and improves companies), an operating-partner playbook that demonstrably lifts EBITDA, a structural advantage (scale, captive financing, a platform), or a size niche (lower-middle-market deals too small for mega-funds and too complex for amateurs). Categories of *fake* edge: "we have great relationships," "we are disciplined," "we buy good companies at fair prices." Everyone says these; they are table stakes, not edge.

**Test the edge against the track record.** If the claimed edge is operational value creation, the value bridge (Section 2.3) should show returns driven by EBITDA growth, not multiple expansion and leverage. If the claim is proprietary sourcing, what share of deals were genuinely off-market versus won in a banked auction? If the edge does not show up in the historical attribution, it is a story, not an edge.

**Strategy drift and style drift are among the highest-yield red flags.** Drift is when a GP departs from the strategy that built its record:
- **Size drift / AUM bloat.** A GP that raised USD 500 million for Fund III and is raising USD 2 billion for Fund IV is now playing a different game: bigger deals, more competition, more efficient pricing, and an edge built in the lower-middle market that may not translate. Returns frequently compress as funds scale. A 3x-to-4x step-up in fund size is a flag by itself.
- **Strategy drift.** A control-buyout shop suddenly doing minority growth deals, a domestic manager going international, a generalist suddenly raising a "thematic AI fund." Each move takes the team outside the circle of competence that generated the record.
- **Style drift.** Creeping up the leverage curve, paying higher entry multiples, doing larger or earlier-stage deals than the historical book.

Drift matters because **the track record you are underwriting was generated by the old strategy.** When the strategy changes, the track record's predictive value drops toward zero, and you are effectively backing a first-time fund with a misleading historical halo. The LPA defenses are a tight strategy/mandate clause and concentration limits (Section 5).

---

## 5. Fund terms and the LPA review (with ILPA alignment)

The Limited Partnership Agreement (LPA) is the contract that governs the fund for its life, typically 80 to 150 pages, supplemented by side letters that grant bespoke rights to individual LPs. Legal/terms diligence reads it against three lenses that map to the three **ILPA Principles 3.0** pillars (ILPA, 2019): **alignment of interest, governance, and transparency.** ILPA Principles 3.0 is voluntary best-practice guidance, not law, but it is the reference grammar of LP-GP negotiation, and "ILPA-aligned" is shorthand for LP-friendly.

### 5.1 Economic terms

**Management fee.** Pays the firm's operating costs regardless of performance. Market is roughly **1.5 percent to 2.0 percent** for buyout, with 2.0 percent historically predominant and 2.5 percent more common in venture (Cambridge Associates, 2024 fund-terms study). Recent vintages have compressed: 2024-vintage mean fees were about **1.74 percent for buyout and 1.93 percent for growth equity** (Carta). Three things to check beyond the headline rate:
- **Fee base.** Charged on *committed* capital during the investment period (standard) and then *invested* capital or *net invested* cost after, which is the **step-down**. A fee that stays on committed capital for the whole fund life is GP-friendly and a flag.
- **Step-down.** Confirm the fee drops at the end of the investment period (commonly to a lower rate and/or a smaller base). Absence of a step-down is a flag.
- **Fee offset.** Transaction fees, monitoring fees, and director fees the GP collects from portfolio companies should offset the management fee. ILPA recommends a **100 percent offset.** Anything less than 100 percent means LPs are paying twice and the GP keeps the difference. Check the offset percentage and what counts as offsettable.

**Carried interest (carry).** The GP's profit share, market **20 percent.** The mechanics matter more than the rate:
- **Hurdle / preferred return.** The minimum LP return before the GP earns carry, market **8 percent** in buyout (lower, 6 percent to 7 percent, in credit; venture often has *no* hurdle) (iCapital, 2024). A **hard hurdle** means carry applies only to returns above the hurdle; a **soft hurdle** (more common) means once the hurdle is cleared, the catch-up lets the GP earn carry on *all* profits including the hurdle portion.
- **Catch-up.** After the hurdle, the GP "catches up" to its full carry share. A **100 percent catch-up** (GP-friendly, market) sends 100 percent of distributions to the GP until it has 20 percent of all profit; an 80 percent catch-up is more LP-friendly. Worked example in Section 11 (Example B).
- **Waterfall type, the single most important economic governance term.** A **European (whole-fund / fund-as-a-whole) waterfall** pays carry only after the LPs have received back *all* contributed capital plus the preferred return across the entire fund. This is strongly LP-friendly and is the institutional default. An **American (deal-by-deal) waterfall** pays carry as each deal exits, before the whole fund has returned capital, which front-loads cash to the GP and creates clawback risk. American waterfalls are acceptable only with strong protections (below).
- **Clawback.** If the GP is overpaid carry early (common under American waterfalls when later deals lose money), the clawback forces it to return the excess. Test the *quality* of the clawback, not just its existence: Is it backed by an **escrow** holdback of carry? Is it computed **net of taxes** the GP paid (LP-unfriendly) or gross? Is the GP's obligation **joint and several** across the partners, or merely several (so you cannot collect from a departed or bankrupt partner)? A weak or unfunded clawback under an American waterfall is a serious flag.
- **Recycling.** The right to re-invest early distributions/returned capital rather than distribute them, so more than 100 percent of commitments gets put to work. Reasonable in moderation (commonly capped, e.g., limited to the investment period and to a percentage of commitments); abusive if uncapped, because it extends fee duration and LP exposure.

### 5.2 Structural and governance terms

- **Fund term and extensions.** Typically 10 years plus two 1-year extensions. Watch for long or GP-controlled extensions, which keep fees running on aging assets ("zombie funds").
- **Investment period.** Usually about 5 years; new platform investments stop after it ends.
- **GP commitment.** Market 1 percent to 3 percent; ILPA wants it *substantial* and *in cash*, not funded by waiving fees or via a special financing facility (ILPA, 2019).
- **Key-person provision.** Names the principals on whom the strategy depends. A trigger (death, disability, departure, or failure to devote substantially all business time to the fund) usually **suspends the investment period** automatically, halting new capital deployment until LPs consent to resume, typically within a 90-to-180-day cure window during which the GP can propose a fix (replacement key person, restructuring) subject to LPAC or LP supermajority consent (lecocq associate, 2025; apers.app, 2026). Check that the key-person definition covers the *full* set of people who matter, not just the founder, and negotiate to expand it if it is too narrow (V7 Labs, 2026).
- **GP removal.** Two flavors. **For cause** (fraud, gross negligence, willful misconduct, material LPA breach, key felony) can remove the GP and often strip or reduce its carry. **No-fault divorce** lets LPs remove the GP or terminate the fund *without proving wrongdoing*, by supermajority vote. This is the real deterrent because it does not require litigation. **Threshold ranges by source and is a point of genuine disagreement:** the ILPA-referenced standard is often cited as **75 percent in interest** (V7 Labs, 2026); other practitioners cite **66.7 percent to 75 percent** (Ebadat) or **75 percent to 85 percent** (lecocq associate, 2025); GP-drafted LPAs push it to 80 percent-plus, which in a diversified LP base is near-impossible to organize and therefore toothless. *(Flag: a secondary source claimed roughly 18 percent of funds saw no-fault divorce exercised in 2025; this contradicts the strong consensus that no-fault removal is "almost never used," so treat that 18 percent figure as unreliable absent a primary source.)*
- **LPAC (LP Advisory Committee).** A subset of the largest LPs that approves conflicts, valuation methodology questions, related-party transactions, and certain waivers, *without* directing day-to-day investing. ILPA wants it to be a representative cross-section of investors with clearly defined roles. Securing an LPAC seat is itself a diligence and monitoring tool.
- **Exculpation and indemnification.** ILPA's stated minimum carve-out is that the GP should *not* be exculpated/indemnified for gross negligence, fraud, willful misconduct, or LPA breach (ILPA, 2019; Hirschler). A standard-of-care drop to mere "negligence" or sweeping indemnities is a flag.
- **Subscription lines of credit.** Short-term fund-level borrowing that delays calling LP capital. It boosts IRR (Section 2 and Example C) without improving MOIC, and costs interest. ILPA recommends the preferred return accrue **from the date the facility is drawn, not the date capital is finally called from LPs**, so the GP cannot use the line to manufacture a lower hurdle hand-off (ILPA, 2019; Hirschler). Check the cap on facility size, the maximum outstanding days, and whether returns are disclosed gross and net of the line.
- **Co-investment allocation.** How co-invest opportunities are offered, and whether allocation is fair or used to reward favored LPs. A "co-investment right subject to GP sole discretion" is not actually a right (V7 Labs, 2026).
- **Conflicts: cross-fund investments, GP-led secondaries, continuation funds.** ILPA 3.0 specifically expanded guidance here because these are conflict-laden. Cross-fund investments (a new fund buying from or propping up an old fund) and GP-led secondaries / continuation vehicles (moving an asset from an old fund into a new vehicle the same GP manages) can be legitimate liquidity tools or self-dealing that bails out a struggling prior fund at LP expense. Demand LPAC approval, independent fairness opinions, and a genuine LP option to cash out or roll.
- **MFN (most-favored-nation) and side letters.** After final close, LPs are usually offered the chance to elect more favorable terms granted to other LPs of equal or smaller commitment size. Read the side-letter MFN tiering; the best terms often sit behind a commitment-size threshold.

ILPA also publishes a **Model LPA** and the **ILPA Reporting Template** (standardized quarterly fee, expense, and performance reporting). Alignment with these is a positive transparency signal.

---

## 6. Operational due diligence (ODD) in depth

ODD is the "can we trust you with our capital and your reporting" workstream, and in many shops the ODD team can **veto** a commitment regardless of how good the investment case looks (Dasseti). The discipline matured after operational frauds and blow-ups (Madoff's fake administrator and auditor, Bayou's fabricated returns, Amaranth's risk failure, Weavering's fake counterparty), and roughly half of manager failures are operational rather than investment-driven (DiligenceVault).

What ODD actually inspects:

- **Fund administration.** Is there an independent, reputable third-party fund administrator, or does the GP self-administer? Self-administration (the GP both manages money and keeps the books and strikes the NAV) was the structural enabler of multiple frauds and is a major flag for anything but the smallest, most transparent managers.
- **Valuation governance.** Who values the portfolio, how often, using what methodology, and with what independent check (third-party valuation provider, auditor sign-off, LPAC review)? A GP that marks its own book with no independent validation controls your reported TVPI.
- **Audit.** Annual audit by a credible firm (Big Four or a recognized specialist), with **clean (unqualified) opinions** and no auditor changes that lack a clean explanation. A qualified opinion or a quietly switched auditor is a serious flag.
- **Compliance and regulatory.** Registration status (SEC-registered investment adviser in the US, Form ADV on file), a real Chief Compliance Officer, a compliance manual, code of ethics, personal-trading policy, and clean regulatory history (run the GP and principals through enforcement and litigation databases).
- **Cybersecurity and technology.** SOC 1 / SOC 2 reports from the firm and its key providers, penetration-testing cadence, incident history, and controls against wire fraud and business-email-compromise (a leading vector for stolen capital calls).
- **Business continuity and disaster recovery (BCP/DR).** Documented and tested plans.
- **Service-provider quality.** Administrator, auditor, fund counsel, prime broker/custodian, banks. Quality of the surrounding ecosystem is a proxy for institutional readiness.
- **Insurance.** Adequate D&O (directors and officers), E&O / professional indemnity, cyber, and crime/fidelity coverage.
- **Segregation of duties and internal controls.** Whoever executes trades/deals should not also be the one who values them and reconciles the cash. Front office (deal/portfolio), middle office (reconciliation/risk), and back office (fund accounting/valuation) should be separated, and cash movements should require dual authorization.
- **Cash controls.** How capital calls and distributions move, who can authorize wires, and how the LP verifies wiring instructions (callback procedures), given the prevalence of fraudulent payment-instruction attacks.

For a first-time or small manager, the most common ODD failure modes are no independent administrator, weak or no compliance function, thin insurance, and a founder controlling every function with no segregation. These can sometimes be remediated as a condition of commitment ("we will commit if you appoint an independent administrator before close").

---

## 7. ESG diligence

ESG (environmental, social, governance) diligence assesses material non-financial risk and, for many institutional LPs, satisfies a policy or regulatory mandate. The ILPA DDQ's ESG section is built on the **PRI (Principles for Responsible Investment) Limited Partners' Private Equity Responsible Investment DDQ** (ILPA, 2021). What you assess:
- A real, board-level **ESG policy**, not a marketing PDF.
- **Integration into the investment process**: is ESG screened pre-investment and managed through ownership, with named accountability, or is it bolted on?
- **Monitoring and KPIs** at the portfolio-company level, with data you can actually receive.
- **Reporting** to LPs, and incident reporting (the obligation to disclose material ESG incidents, which ILPA 3.0 elevated).
- **Regulatory fit**, especially the EU **SFDR** (Sustainable Finance Disclosure Regulation) Article 6/8/9 classification for European mandates.
- **DEI (diversity, equity, and inclusion)** data, using the ILPA Diversity Metrics Template (added 2018, enhanced 2021; a DEI Monitoring Questionnaire was added in 2023).

**Flag a real divergence by region and the political climate.** ESG is not applied uniformly, and the gap has widened. European LPs and SFDR-bound investors push hard on ESG and treat it as a gating mandate. In the US, "ESG" has become politically contested: several US public pension systems and red-state mandates have pulled back from explicit ESG screening, while other US institutions continue to integrate it under risk-management framing rather than the "ESG" label. The practical consequence for you: ESG can be a hard veto, a soft preference, or a near-non-factor depending on which LP you work for, so calibrate to your institution's actual policy rather than assuming a universal standard.

---

## 8. The Due Diligence Questionnaire (DDQ)

The DDQ is the structured information request an LP sends a GP (or that a GP pre-fills and includes in the data room). The **ILPA DDQ** is the industry standard, created to stop every LP from sending a slightly different bespoke questionnaire and forcing GPs to answer the same questions hundreds of ways. Lineage: first published 2013, updated 2016 (aligned to the ILPA Reporting Template), 2018 (added a DEI section), and the current **DDQ 2.0 in 2021** (expanded ESG via the PRI DDQ, enhanced DEI and a Diversity Metrics Template) (ILPA, 2021). A 2023 DEI Monitoring Questionnaire was added for ongoing monitoring.

A modern PE DDQ runs on the order of 250 questions across roughly 21 categories, and a typical fundraising GP now answers 150-plus DDQs a year (altSS, 2026; AutoRFP.ai). *(These volume figures come from service-provider commentary, not ILPA itself; treat them as indicative.)* The DDQ is *necessary but not sufficient*: it is the GP's self-report, so it frames your verification work rather than replacing it. ILPA itself states that no LP should treat the DDQ as a substitute for its own determination of what it needs (ILPA, 2021).

Broad areas the DDQ covers: firm overview and history; ownership and the management company; team and bios; the specific fund's strategy, terms, and structure; the investment and decision process; the track record and prior funds; portfolio construction and risk; valuation policy; fees and expenses; conflicts of interest; legal, regulatory and compliance; operations, administration, and service providers; technology and cybersecurity; business continuity; insurance; references; ESG; and DEI.

The DD question checklist in Section 13 is the analyst-facing distillation of what the DDQ and your follow-up work should actually nail down.

---

## 9. The investment committee (IC) memo

The IC memo is the document that recommends (or declines) the commitment to your firm's investment committee. It is simultaneously a decision document, a record of the diligence performed, and the thing that will be re-read in five years when the fund disappoints and someone asks "what did we know?" Write it to be falsifiable: state the thesis, then state honestly what would have to be true for it to fail.

**Principles of a good IC memo:** lead with the recommendation and the two or three things the whole decision hinges on; quantify everything you can; separate fact (cash flows, terms) from opinion (your view of the edge); give the bear case real space rather than a token paragraph; and make the risks concrete with mitigants and residual-risk judgments rather than a generic risk list.

### Sample IC-memo outline for a primary commitment

1. **Recommendation and summary.** Proposed commitment amount and as a percentage of fund and of the LP's portfolio; the fund (name, target/hard cap, strategy, geography, vintage); the one-paragraph thesis; the two or three key reasons to do it and the two or three key risks; conditions to commit (e.g., LPAC seat, fee MFN, independent administrator).
2. **Firm and GP overview.** History, ownership of the management company, AUM, prior funds and their status, office footprint, regulatory standing.
3. **Team.** Key partners and bios, individual deal attribution, key-person identification, turnover history, succession and ownership economics, GP commitment amount and *how funded* and its distribution across partners.
4. **Strategy and edge.** The strategy in one sentence; the claimed edge and the evidence for it; target deal size, sectors, geographies, ownership stance (control vs minority), use of leverage; how this fund differs from prior funds (drift check).
5. **Market opportunity.** The opportunity set, competitive dynamics, why now, key macro and sector risks.
6. **Track-record analysis.** Net IRR / TVPI / DPI / RVPI by fund and vintage versus named benchmarks; gross-to-net spread; deal-by-deal MOIC distribution; top-deal concentration test (fund ex-top-1/2/3 deals); value-creation bridge (EBITDA growth vs multiple vs leverage); loss ratio; realized vs unrealized split; PME vs the appropriate index; realization pacing.
7. **Terms summary and ILPA alignment.** Management fee/base/step-down, offset percentage, carry, hurdle, catch-up, waterfall type, clawback quality, GP commitment, key-person and removal provisions, term/extensions, recycling, sub-line policy, LPAC, fees-and-expenses notes; a column flagging each term as LP-favorable, market, or GP-favorable.
8. **Operational due diligence summary.** Administrator, auditor and opinion history, valuation governance, compliance/regulatory standing, cyber/SOC reports, BCP, insurance, segregation of duties, any findings and required remediations; ODD conclusion (pass / conditional / fail).
9. **ESG / responsible investment.** Policy, integration, reporting, SFDR classification if relevant, DEI metrics, any incidents.
10. **Portfolio fit and pacing.** How the commitment fits the LP's strategy, geography, and vintage diversification; pacing/commitment plan; concentration to this GP and strategy; the denominator-effect / liquidity context.
11. **Risks and mitigants.** Each material risk, its mitigant, and the residual risk you are accepting. The bear case.
12. **References and verification.** Reference calls done (named and blind), site visits, third-party reports commissioned, and what they showed.
13. **Recommendation, proposed size, and conditions.** Restated cleanly.
14. **Appendices.** Full track-record tables, cash-flow detail, fee model, the LPA term sheet redline, the DDQ.

---

## 10. Red flags that kill a deal

A practical taxonomy. One flag rarely kills a deal on its own; a cluster does, and certain flags (fraud indicators, failed ODD) are independently fatal.

**Track-record and performance flags**
- Returns concentrated in one or two deals (fund collapses when you strip the top deals).
- High IRR next to mediocre MOIC (financial engineering / sub-line games rather than value creation).
- RVPI rising while DPI stalls in a mature fund (cannot convert marks to cash).
- Marks that did not move through the 2022 to 2023 public drawdown (NAV smoothing).
- "Top quartile" claims that do not survive a named-benchmark, same-vintage check.
- A loss ratio far above the strategy norm (riskier book than the label implies).
- Persistently below-cohort DPI for the fund's age.

**Team and alignment flags**
- Unexplained senior departures, especially mid-fund or of key performers.
- Unresolved succession; founder holds most carry with no next-generation path.
- Small GP commitment, or GP commitment funded by fee waiver rather than cash.
- Key-person definition too narrow to cover the people who actually matter.
- Spin-out attribution the old firm disputes.
- Behavioral flags: a founder who cannot name a mistake; lifestyle out of step with economics.

**Strategy flags**
- Strategy, size, or style drift; a 3x-plus fund-size step-up.
- A "thematic" pivot outside the circle of competence.
- An edge that is a slogan ("we buy good companies") with no attribution support.
- First-time fund with no clean, independent attribution to back the pitch.

**Terms flags**
- American (deal-by-deal) waterfall with a weak, unfunded, or net-of-tax clawback.
- No fee step-down; fee on committed capital for the whole life.
- Fee offset below 100 percent.
- No-fault removal threshold set so high (80 percent-plus) it is toothless.
- Sweeping indemnification / standard of care below gross negligence.
- Uncapped recycling; long GP-controlled term extensions (zombie-fund risk).
- Conflict provisions that permit cross-fund deals or GP-led secondaries without LPAC approval and a fairness opinion.

**Operational and integrity flags (often independently fatal)**
- No independent third-party administrator; GP self-administers and self-values.
- Qualified audit opinion, or an unexplained auditor change.
- Regulatory enforcement, undisclosed litigation, or principals with integrity issues.
- Weak or absent compliance function; thin insurance.
- No segregation of duties; one person controls deals, valuation, and cash.
- Slow, incomplete, or evasive data room; reluctance to facilitate reference calls.
- Inability to produce clean cash-flow-level track-record data.

---

## 11. Key formulas (written explicitly)

All multiples are unitless ("x"); IRR and PME-derived alphas are annualized percentages.

**Paid-in / called capital:** the capital LPs have actually wired in response to capital calls (the denominator for the multiples below), which is usually less than committed capital.

**DPI (Distributions to Paid-In):**
> DPI = (Cumulative distributions to LPs) / (Cumulative paid-in capital)

**RVPI (Residual Value to Paid-In):**
> RVPI = (Residual fund NAV attributable to LPs) / (Cumulative paid-in capital)

**TVPI (Total Value to Paid-In), also "investment multiple":**
> TVPI = (Cumulative distributions + Residual NAV) / Cumulative paid-in capital = DPI + RVPI

**MOIC (Multiple on Invested Capital), usually gross at the deal level:**
> MOIC = (Total value of investment, realized + unrealized) / Invested capital

**IRR (Internal Rate of Return):** the discount rate r that sets the net present value of all dated cash flows to zero:
> 0 = Σ [ CF(t) / (1 + r)^t ]  , summed over all cash-flow dates t (contributions negative, distributions positive, final NAV treated as a terminal inflow)

**Capital loss ratio:**
> Loss ratio = (Capital in deals realized below cost − recovered proceeds) / Total invested capital

**Impairment ratio (includes unrealized write-downs):**
> Impairment ratio = (Invested capital realized OR currently valued below cost) / Total invested capital

**Distribution waterfall (European / whole-fund), in order:**
> Tier 1 Return of capital: LPs receive 100% of contributed capital
> Tier 2 Preferred return: LPs receive the hurdle (e.g., 8% compounded) on contributed capital
> Tier 3 GP catch-up: GP receives up to the catch-up % of distributions until GP has [carry %] of total profit distributed
> Tier 4 Carried interest split: remaining profit split [1 − carry %] to LP / [carry %] to GP (e.g., 80/20)

**GP catch-up amount (for a 100% catch-up to a carry rate c, given LP profit P already paid as preferred return):**
> Catch-up X solves  X = c × (P + X)  ⇒  X = (c × P) / (1 − c)
> Example with c = 20% and P = 20:  X = (0.20 × 20) / 0.80 = 5

**Value-creation bridge (equity value created), with subscripts 0 = entry, 1 = exit:**
> EV (enterprise value) = EBITDA × EV/EBITDA multiple
> EBITDA-growth contribution = (EBITDA_1 − EBITDA_0) × multiple_0
> Multiple-expansion contribution = (multiple_1 − multiple_0) × EBITDA_1
> Deleveraging contribution = Net debt_0 − Net debt_1
> Equity value created = EBITDA-growth + Multiple-expansion + Deleveraging
> (Check: EBITDA-growth + Multiple-expansion = EV_1 − EV_0)

**KS-PME (Kaplan-Schoar wealth multiple), discounting/compounding by the public index path:**
> KS-PME = [ Σ Distribution(t) / Index(t) ] / [ Σ Contribution(t) / Index(t) ]
> equivalently, compounding all flows to the end date at the index return:
> KS-PME = (FV of all distributions grown at the index) / (FV of all contributions grown at the index)
> KS-PME > 1 ⇒ fund beat the index; < 1 ⇒ fund lost to the index

**Direct Alpha (annualized over n years, single-flow simplification):**
> Direct Alpha ≈ (KS-PME)^(1/n) − 1
> (In general, Direct Alpha is the IRR of the index-discounted cash flows; the formula above holds exactly only for a single contribution and single distribution.)

**Subscription-line effect (intuition, not a closed form):** a sub line delays the dated contribution CF(t), shrinking the exponent t in the IRR equation for the LP's actual cash, which raises IRR while leaving total dollars (MOIC/TVPI) essentially unchanged except for the interest cost, which slightly *reduces* the multiple.

---

## 12. Worked numerical examples (step by step)

Each example is self-contained and built from clean numbers so it can be turned into a calculator. Round at the end, not mid-calculation.

### Example A. The multiples, from raw fund data
A buyout fund: committed capital 100, paid-in (called) 90, cumulative distributions 60, residual NAV 80 (all in millions).
- DPI = 60 / 90 = **0.667x**
- RVPI = 80 / 90 = **0.889x**
- TVPI = (60 + 80) / 90 = 140 / 90 = **1.556x**
- Check identity: DPI + RVPI = 0.667 + 0.889 = **1.556x** = TVPI ✓
- Read: only two-thirds of paid-in capital has come back as cash; more than half of the reported total value (the 80 of NAV out of 140) is still an unrealized GP mark. If this is a year-9 fund, the low DPI and high RVPI is a realization/valuation flag.

### Example B. European distribution waterfall (8% pref, 100% catch-up, 20% carry)
LPs contribute 100. The fund returns 180 in total to be distributed. Assume the cumulative 8% preferred return owed works out to 20.
- **Tier 1 Return of capital:** LPs get 100. Remaining = 180 − 100 = 80.
- **Tier 2 Preferred return:** LPs get 20. Remaining = 80 − 20 = 60. (Profit distributed so far: 20, all to LP.)
- **Tier 3 GP catch-up (100% catch-up to 20% carry):** X = (0.20 × 20) / (1 − 0.20) = 4 / 0.8 = **5**. GP gets 5. Now total profit distributed = 25, of which GP has 5 = exactly 20% ✓. Remaining = 60 − 5 = 55.
- **Tier 4 80/20 split:** LP gets 0.80 × 55 = 44; GP gets 0.20 × 55 = 11.
- **Totals:** LP = 100 + 20 + 44 = **164**; GP carry = 5 + 11 = **16**.
- **Check:** total profit = 180 − 100 = 80; GP carry / profit = 16 / 80 = **20%** ✓ (the 100% catch-up makes the GP whole to its full 20% of *all* profit, which is why a 100% catch-up is GP-friendly).

### Example C. Subscription line inflates IRR but not MOIC
Base case (no sub line): LP wires 100 at t = 0; fund returns 200 at t = 5.
- IRR: 100 → 200 over 5 years ⇒ (200/100)^(1/5) − 1 = 2^0.2 − 1 = 1.1487 − 1 = **14.87%**. MOIC = **2.00x**.

Sub-line case: the fund draws a credit line at t = 0 and delays the capital call from the LP to t = 1 (one-year delay); distribution still 200 at t = 5. Ignore interest first.
- LP cash flows: −100 at t = 1, +200 at t = 5 ⇒ effective holding 4 years.
- IRR: (200/100)^(1/4) − 1 = 2^0.25 − 1 = 1.1892 − 1 = **18.92%**. MOIC = **2.00x** (unchanged).
- Now add interest cost of, say, 4 on the facility, reducing the distribution to 196: MOIC = 196/100 = **1.96x** (slightly lower), but IRR is still far above the base 14.87%.
- **Lesson:** the sub line lifted reported IRR by about **4 percentage points** while *reducing* the multiple. This is why you demand returns both with and without sub-line impact, and why you trust MOIC/DPI over IRR when judging real value creation.

### Example D. KS-PME and Direct Alpha (single-flow simplification)
Contribution 100 at t = 0; distribution 200 at t = 5. The public index (e.g., S&P 500 total return) rose 50% over the 5 years (index grew 1.0 → 1.5).
- Compound the contribution at the index to t = 5: 100 × 1.5 = 150.
- The distribution is already at t = 5: 200.
- KS-PME = 200 / 150 = **1.33** ⇒ the fund delivered 33% more wealth than the same dollars in the index ⇒ outperformance.
- Direct Alpha ≈ (1.33)^(1/5) − 1 = 1.0586 − 1 = **5.86% per year** of annualized outperformance.
- Sanity check vs raw returns: fund IRR = 2^0.2 − 1 = 14.87%; index IRR over the period = 1.5^0.2 − 1 = 8.45%; the gap of about 6.4 points is close to (and reconciles with) the 5.86% Direct Alpha once compounding conventions are applied.

### Example E. Value-creation bridge for one deal
Entry: EBITDA 50, entry multiple 10x ⇒ EV 500; net debt 300 ⇒ equity 200.
Exit (year 5): EBITDA 80, exit multiple 11x ⇒ EV 880; net debt paid down to 150 ⇒ equity 730.
- Equity MOIC = 730 / 200 = **3.65x**.
- EBITDA-growth contribution = (80 − 50) × 10 = **300**.
- Multiple-expansion contribution = (11 − 10) × 80 = **80**.
- Check EV change: 300 + 80 = 380 = (880 − 500) ✓.
- Deleveraging contribution = 300 − 150 = **150**.
- Total equity value created = 300 + 80 + 150 = **530** = (730 − 200) ✓.
- Attribution of the 530: EBITDA growth 300/530 = **57%**; multiple expansion 80/530 = **15%**; deleveraging 150/530 = **28%**.
- Read: a healthy mix, majority from operating growth. Contrast with a deal where 60%-plus came from multiple expansion and leverage, which would be a "borrowed-and-rode-the-market" return that is unlikely to repeat in the current regime.

### Example F. Gross-to-net spread (stylized)
A fund invests 100 and returns 250 gross (gross MOIC **2.50x**, gross profit 150).
- Management fees over the fund life: assume 15 total (stylized, roughly 1.5% with step-downs over the life).
- Value after fees, before carry = 250 − 15 = 235; profit subject to carry ≈ 135.
- Carry at 20% (assume hurdle cleared and fully caught up) = 0.20 × 135 = 27.
- Net to LP = 235 − 27 = **208**. Net MOIC = 208 / 100 = **2.08x**.
- Gross-to-net multiple spread = 2.50 − 2.08 = **0.42x**; the LP captured 208/250 = **83%** of the gross result.
- Read: an ~0.4x multiple give-up is typical for a successful buyout fund. A much larger give-up signals a heavy fee/expense load worth interrogating; a much smaller one means the fees are unusually low (verify) or the "gross" excluded costs it should include.

---

## 13. Due diligence question checklist (analyst-facing)

Use this to drive verification beyond the GP's self-reported DDQ. Grouped by pillar.

**Firm, team, alignment**
- Who owns the management company, and how is equity and carry split across partners and generations?
- Map each material deal to the partner(s) who sourced/led it. Who is still here?
- What is the senior-departure history over 5 to 10 years, and why did each person leave?
- Who are the named key persons, and does the definition cover everyone who actually matters?
- What is the succession plan, and does the next generation have real economics and ownership?
- What is the GP commitment, as a percent of fund, funded in cash or by fee waiver, and how is it split across partners?
- How does carry vest, and does it claw back if a partner leaves?

**Strategy and edge**
- State the edge in one sentence. What is the evidence it is real and repeatable?
- How does this fund differ from prior funds in size, sector, geography, stage, ownership stance, and leverage (drift check)?
- What share of historical deals were genuinely proprietary versus won in auctions?
- Does the value-creation bridge show operating growth or mostly multiple expansion and leverage?

**Track record (demand cash-flow-level data)**
- Provide net IRR / TVPI / DPI / RVPI by fund and vintage, against a named benchmark for the exact vintage and strategy.
- Provide the track record net of all fees/carry/expenses, and separately with and without subscription-line impact.
- Provide deal-by-deal gross and net MOIC and IRR, entry/exit dates, EBITDA and multiples at entry and exit, and leverage.
- What does the fund look like excluding the top 1, 2, and 3 deals?
- What is the realized capital loss ratio, and the impairment ratio including unrealized?
- Split realized versus unrealized value; for unrealized, give the valuation methodology and inputs deal by deal.
- How did marks move through 2022 to 2023?
- Provide PME versus the appropriate index and the index used.

**Terms / LPA**
- Management fee rate, base, and step-down; offset percentage on transaction/monitoring/director fees.
- Carry rate, hurdle (hard or soft), catch-up percentage, and waterfall type (European or American).
- If American: clawback mechanics, escrow, net-of-tax or gross, joint-and-several or several.
- Recycling cap; fund term and extension control; key-person triggers and cure; GP-removal thresholds (for cause and no-fault).
- Sub-line cap, max outstanding days, and preferred-return accrual date.
- LPAC composition and powers; conflict provisions (cross-fund, GP-led secondaries, co-invest allocation); MFN tiering.

**Operational**
- Independent third-party administrator? Independent valuation check?
- Auditor name, opinion history, any auditor changes; clean unqualified opinions?
- Regulatory registration and history; any enforcement or litigation?
- Compliance function, CCO, manual, code of ethics; SOC 1/SOC 2 reports; cyber and BCP testing.
- Insurance coverage (D&O, E&O, cyber, crime); segregation of front/middle/back office; cash-control and wire-callback procedures.

**ESG**
- Board-level ESG policy; integration into the process with named accountability; portfolio KPIs and reporting.
- SFDR classification if relevant; incident-reporting obligation; DEI metrics via the ILPA template.

**Verification (outside the GP)**
- On-list and off-list reference calls (co-investors, former employees, portfolio CEOs, departed partners).
- Site visit; background checks on principals; third-party ODD/background reports where warranted.

---

## 14. Glossary

| Term | Definition |
|---|---|
| **LP (Limited Partner)** | The investor in the fund (pension, endowment, sovereign wealth fund, insurer, fund-of-funds, family office). Limited liability, no day-to-day control. |
| **GP (General Partner)** | The manager that runs the fund, makes investment decisions, and earns fees and carry. |
| **Primary commitment** | An LP investing in a fund at its formation, committing capital to be called over time, as opposed to buying an existing stake (a secondary) or investing directly in a company (co-investment / direct). |
| **LPA (Limited Partnership Agreement)** | The governing legal contract of the fund covering economics, governance, and obligations. |
| **PPM (Private Placement Memorandum)** | The GP's marketing/offering document describing the fund, strategy, team, and track record. |
| **Side letter** | A bilateral agreement granting a specific LP bespoke rights beyond the LPA (e.g., MFN, fee discount, reporting, LPAC seat). |
| **Committed capital** | The total an LP has agreed to invest over the fund's life. |
| **Paid-in / called capital** | The portion of commitment actually wired to the fund via capital calls; the denominator for DPI/TVPI/RVPI. |
| **Capital call (drawdown)** | The GP's request that LPs fund part of their commitment for an investment or expense. |
| **Distribution** | Cash (or stock) the fund returns to LPs from realizations. |
| **Vintage year** | The year a fund begins investing (or holds its first close); the basis for peer benchmarking. |
| **J-curve** | The early-life dip in fund returns/NAV as fees and costs hit before investments appreciate, followed by an upward curve as value is realized. |
| **DPI** | Distributions to Paid-In: cash returned per dollar called. The realized, un-markable metric. |
| **RVPI** | Residual Value to Paid-In: unrealized NAV per dollar called. A GP mark. |
| **TVPI** | Total Value to Paid-In: (distributions + NAV) per dollar called = DPI + RVPI. The net multiple. |
| **MOIC** | Multiple on Invested Capital: total value / invested capital, usually gross at the deal level. |
| **IRR** | Internal Rate of Return: the annualized money-weighted return that zeroes the NPV of dated cash flows. Timing-sensitive. |
| **Gross return** | Deal-level return before management fees, carry, and fund expenses. |
| **Net return** | LP return after all fees, carry, and expenses. What the LP actually earns. |
| **PME (Public Market Equivalent)** | A family of methods comparing PE returns to what the same cash flows would have earned in a public index. |
| **KS-PME** | Kaplan-Schoar PME: a wealth-multiple ratio; above 1.0 beats the index, below 1.0 loses to it. |
| **Long-Nickels PME / ICM** | The original 1996 PME; builds a hypothetical index investment and compares hypothetical IRR to fund IRR; can break when distributions drive the index position negative. |
| **PME+ / mPME** | Variants (Capital Dynamics 2003; Cambridge Associates 2013) that fix the negative-NAV problem in Long-Nickels. |
| **Direct Alpha** | A rigorous PME variant expressing outperformance as an annualized alpha (essentially annualized KS-PME). |
| **Capital loss ratio** | Percent of invested capital in deals realized below cost, net of recoveries, over total invested capital. |
| **Impairment ratio** | Percent of invested capital realized or currently valued below cost; includes unrealized write-downs. |
| **Value-creation bridge (value bridge)** | Decomposition of equity gains into EBITDA growth, multiple expansion, and deleveraging. |
| **Multiple expansion** | Selling at a higher EV/EBITDA multiple than entry; often beta/timing rather than skill. |
| **EBITDA** | Earnings before interest, taxes, depreciation, and amortization; the common proxy for operating profit in buyout. |
| **Deleveraging** | Paying down acquisition debt with portfolio-company cash flow, growing the equity slice. |
| **Management fee** | Annual fee (roughly 1.5% to 2.0% buyout) on committed then invested capital, covering operating costs. |
| **Step-down** | The reduction in management fee base/rate after the investment period ends. |
| **Fee offset** | Reduction of the management fee by transaction/monitoring/director fees the GP collects from portfolio companies; ILPA wants 100%. |
| **Carried interest (carry)** | The GP's profit share, market 20%, earned above the hurdle. |
| **Hurdle / preferred return** | The minimum LP return (market 8% buyout) before the GP earns carry. Hard vs soft. |
| **Catch-up** | The waterfall tier where the GP catches up to its full carry share after the hurdle; 100% catch-up is GP-friendly. |
| **Distribution waterfall** | The order in which proceeds are split between LPs and GP. |
| **European (whole-fund) waterfall** | Carry paid only after all capital plus pref is returned across the entire fund; LP-friendly; the institutional default. |
| **American (deal-by-deal) waterfall** | Carry paid as each deal exits; GP-friendly; requires strong clawback. |
| **Clawback** | The GP's obligation to return carry it was overpaid; quality depends on escrow, tax treatment, and joint-and-several liability. |
| **Recycling** | Re-investing early distributions/returned capital so more than 100% of commitments is deployed. |
| **GP commitment** | The GP's own capital in the fund (1% to 3% market); ILPA wants it substantial and in cash. |
| **Key-person provision** | LPA clause that suspends the investment period if named principals leave or stop devoting time, until LPs consent to continue. |
| **GP removal: for cause** | Removal for fraud, gross negligence, willful misconduct, or material LPA breach; can strip carry. |
| **No-fault divorce** | LP right to remove the GP/terminate the fund without proving fault, by supermajority (commonly 66.7% to 85%; ILPA standard often cited as 75%). |
| **LPAC (LP Advisory Committee)** | A committee of large LPs that approves conflicts, valuation questions, and waivers, without directing investments. |
| **Subscription line of credit** | Short-term fund-level borrowing that delays capital calls; inflates IRR without improving MOIC. |
| **Continuation vehicle / GP-led secondary** | A transaction moving an asset from an old fund into a new vehicle the same GP manages; a liquidity tool with conflict risk. |
| **NAV (Net Asset Value)** | The GP's reported fair value of fund holdings; the basis for RVPI. |
| **NAV smoothing / return smoothing** | Slow or sticky marking that understates volatility and props up reported value. |
| **Investment DD (IDD)** | Diligence on strategy, team, and returns: "can you make money." |
| **Operational DD (ODD)** | Diligence on administration, valuation, compliance, cyber, controls: "can we trust you with our capital." |
| **DDQ** | Due Diligence Questionnaire; the standardized information request, with the ILPA DDQ 2.0 (2021) as the industry template. |
| **ILPA** | Institutional Limited Partners Association; publisher of the Principles, DDQ, Model LPA, and Reporting Template. |
| **ILPA Principles 3.0** | 2019 best-practice guidance built on alignment of interest, governance, and transparency. |
| **SOC 1 / SOC 2** | Service Organization Control reports on a provider's financial-reporting and security/availability controls. |
| **SFDR** | EU Sustainable Finance Disclosure Regulation; classifies funds Article 6/8/9 by sustainability characteristics. |
| **Dry powder** | Committed but uninvested capital available to GPs. |
| **Denominator effect** | When public-portfolio declines raise private holdings' share of a total portfolio above target, constraining new commitments. |
| **Pacing / commitment plan** | Committing steadily across vintages to diversify timing and maintain target exposure. |
| **Persistence** | The tendency for a GP's relative performance to repeat across funds; strong historically, weakened for buyout post-2000. |
| **Quartile** | The performance ranking of a fund within its vintage/strategy peer set; dataset-dependent. |

---

## 15. Flashcards (Q to A, tagged by sub-topic and difficulty)

| # | Question | Model answer | Sub-topic | Difficulty |
|---|---|---|---|---|
| 1 | What is the identity linking TVPI, DPI, and RVPI? | TVPI = DPI + RVPI. Total value per dollar in equals realized cash plus unrealized NAV per dollar in. | Metrics | Easy |
| 2 | Which return metric cannot be marked up by the GP, and why does it dominate LP focus in 2025 to 2026? | DPI, because it counts only cash actually distributed. Exits stalled, so GPs sit on large unrealized marks, making realized cash the credible signal. | Metrics | Easy |
| 3 | A fund shows 25% IRR but only 1.4x MOIC. What does that pattern suggest? | Fast, modest-magnitude returns or timing effects (early partial exits, dividend recaps, subscription-line use); high IRR with low multiple is the fingerprint of financial engineering rather than durable value. | Track record | Medium |
| 4 | Why does a subscription line raise IRR but not MOIC? | It delays the LP capital call, shortening the period the LP's cash is at work, which raises the time-weighted IRR; total dollars returned are unchanged except for the interest cost, which slightly lowers the multiple. | Terms/Metrics | Medium |
| 5 | Define the capital loss ratio and give a rough buyout benchmark. | Percent of invested capital in deals realized below cost, net of recoveries, over total invested capital. US buyout clusters around the low-double-digit (roughly 10%) range; VC is far higher. | Track record | Medium |
| 6 | Name the three levers of the value-creation bridge and which signals real skill. | EBITDA growth (operating skill), multiple expansion (mostly beta/timing), and deleveraging (leverage). EBITDA growth is the skill signal. | Attribution | Medium |
| 7 | What did McKinsey find about the sources of buyout return for deals entered 2010+ and exited by 2021? | Roughly two-thirds of total return came from multiple expansion and leverage, not operating improvement. | Attribution | Medium |
| 8 | Differentiate a European from an American distribution waterfall. | European (whole-fund): carry only after all capital plus pref is returned across the fund, LP-friendly, the default. American (deal-by-deal): carry as each deal exits, GP-friendly, needs a strong clawback. | Terms | Easy |
| 9 | What three features determine whether a clawback is actually protective? | Whether it is escrow-backed, computed gross rather than net of the GP's taxes, and joint-and-several across partners rather than several. | Terms | Hard |
| 10 | What is the difference between a hard and a soft hurdle? | Hard hurdle: carry applies only to returns above the hurdle. Soft hurdle: once cleared, the catch-up lets the GP earn carry on all profits including the hurdle portion. | Terms | Medium |
| 11 | Compute the GP catch-up for a 100% catch-up, 20% carry, where LPs have received 20 of preferred return. | X = (0.20 × 20) / (1 − 0.20) = 5. | Terms | Hard |
| 12 | Why does ILPA prefer the GP commitment funded in cash rather than via fee waiver? | Cash is real personal capital at risk (alignment); a fee waiver is merely foregone fee, which is not skin in the game. | Alignment | Easy |
| 13 | What does a key-person trigger typically do, and what lifts it? | It suspends the investment period (no new deployment) when named principals leave or stop devoting time; LP or LPAC supermajority consent (often within a 90 to 180 day cure window) lifts it. | Governance | Medium |
| 14 | Why is a no-fault divorce clause a deterrent even though it is almost never used? | Because removal requires no proof of wrongdoing and no litigation, a GP that knows a supermajority of LPs can terminate it behaves more cooperatively on fees, conflicts, and disclosure. | Governance | Medium |
| 15 | What no-fault removal threshold do sources cite, and where do they disagree? | Commonly 66.7% to 85% in interest; ILPA standard often cited as 75%. GP-drafted LPAs push to 80%+, which is effectively toothless in a diversified LP base. | Terms | Hard |
| 16 | State the three ILPA Principles 3.0 pillars. | Alignment of interest, governance, and transparency. | ILPA | Easy |
| 17 | What is the ILPA-recommended fee offset percentage and why? | 100%, so transaction/monitoring/director fees the GP collects reduce the management fee dollar-for-dollar; less than 100% means LPs effectively pay twice. | Terms | Medium |
| 18 | Distinguish IDD from ODD in one line each. | IDD: can you generate returns (strategy, team, track record). ODD: can we trust you with our capital (administration, valuation, compliance, cyber, controls). | DD framework | Easy |
| 19 | Why can the ODD team veto a commitment the investment team loves? | Roughly half of manager failures are operational (fraud, valuation, controls) rather than investment-driven; a clean investment case does not survive a failed ODD. | ODD | Medium |
| 20 | Name two structural ODD red flags that enabled historical frauds. | No independent third-party administrator (GP self-administers and self-values) and no segregation of duties (one person controls deals, valuation, and cash). Madoff and Bayou are canonical cautionary tales. | ODD | Medium |
| 21 | What is a KS-PME of 1.18 telling you? | LPs ended with about 18% more wealth than the same cash flows invested in the chosen public index at the same times; the fund beat the index net of fees. | PME | Medium |
| 22 | Why does index choice matter as much as PME method? | Because alpha is measured against the chosen benchmark; a large-cap fund should be measured against the S&P 500, a small-cap fund against the Russell 2000, a tech/growth fund against the Nasdaq, or the alpha is mis-stated. | PME | Hard |
| 23 | Summarize the Kaplan-Schoar 2005 versus Harris-Jenkinson-Kaplan 2014 disagreement. | KS (2005, Venture Economics data) found average buyout roughly matched the S&P 500 net of fees (PME ~0.97). HJK (2014, Burgiss data) found buyout outperformed by ~20% to 27% over a fund's life. Cleaner data raised the estimate. | PME | Hard |
| 24 | What is the modern evidence on buyout performance persistence? | It has weakened since 2000: prior-fund quartile is a poor predictor of the next fund's quartile for buyout. What persists more reliably is the bottom (poor performers stay poor or fail to raise). VC persistence is stronger. | Persistence | Hard |
| 25 | How should "top-quartile" claims be verified? | Pin the GP to a named benchmark, the exact vintage, and the exact strategy; do not allow a fund to be compared against a different-vintage benchmark. | Track record | Easy |
| 26 | What is strategy/size drift and why does it gut the value of a track record? | Departing from the strategy that built the record (bigger funds, new sectors/geographies, higher leverage). The historical returns were generated by the old strategy, so they barely predict the new one; you are effectively backing a first-time fund with a misleading halo. | Strategy | Medium |
| 27 | What does it mean if a fund's 2.4x TVPI falls to 1.3x after removing its single best deal? | The record is concentrated in one outcome rather than a repeatable process; you are underwriting luck, and must judge whether the GP can repeat it. | Attribution | Medium |
| 28 | What does it signal if a GP's marks did not move through the 2022 to 2023 public drawdown? | NAV smoothing: sticky marks that understate volatility and prop up TVPI/RVPI; haircut the unrealized value and re-underwrite. | NAV | Medium |
| 29 | Roughly what gross-to-net spread is typical for a successful buyout fund? | About 5 to 7 points of IRR and 0.4x to 0.6x of MOIC; net TVPI captures roughly 75% to 85% of gross MOIC. | Fees | Medium |
| 30 | What is the J-curve and why does early DPI look bad? | Early in a fund's life fees and costs hit before investments appreciate or exit, so NAV and DPI dip first and rise later; near-zero year-3 DPI is normal. | Metrics | Easy |
| 31 | What DPI would worry you for a year-7 buyout fund, and what is a healthy mature target? | Below roughly 0.5x at year 7 raises questions; mature (year 10 to 12) top-quartile funds end above ~2.0x, with ~1.5x+ expected by year 8. Always benchmark to the same vintage cohort. | Metrics | Medium |
| 32 | What is the ILPA recommendation on subscription-line preferred-return accrual? | The preferred return should accrue from the date the credit facility is drawn, not the later date capital is called from LPs, so the line cannot be used to hand the GP an easier hurdle. | Terms | Hard |
| 33 | Why is the GP commitment's distribution across partners as important as its size? | If one partner funds most of the commitment and holds most of the carry, the rest of the team is weakly retained and key-person risk is concentrated regardless of the headline percentage. | Alignment | Medium |
| 34 | Why are continuation vehicles / GP-led secondaries conflict-laden, and what protections do LPs demand? | The same GP sits on both sides (selling from the old fund, buying into the new vehicle), so price can favor the GP. LPs demand LPAC approval, an independent fairness opinion, and a genuine option to cash out or roll. | Governance | Hard |
| 35 | In the current market, why discount a GP whose returns came mostly from multiple expansion and leverage? | Cheap debt and easy multiple expansion are gone; Bain frames it as "12 is the new 5," meaning deals now require far faster EBITDA growth, so a beta-and-leverage track record is unlikely to repeat. | Market context | Medium |

---

## 16. Interview-style questions with model answers

These are the kind of questions a Primaries & Co-Investments team asks an intern candidate. The model answers are written the way you should actually speak: lead with the point, then support it.

**Q1. Walk me through how you would underwrite a primary fund commitment.**
Four parallel workstreams that each must clear: investment DD (strategy, edge, team, and a rebuilt-from-cash-flows track record), operational DD (administrator, valuation governance, audit, compliance, cyber, controls), legal and terms (the LPA economics and governance versus ILPA norms), and ESG. I rebuild the track record myself rather than trusting the GP's deck: net IRR/TVPI/DPI/RVPI by vintage against the right benchmark, gross-to-net spread, deal-by-deal attribution including a top-deal-concentration test and a value-creation bridge, loss ratio, realized versus unrealized, and a PME against the appropriate index. In parallel I assess the team for key-person risk, turnover, succession, and alignment, and I test the strategy for drift. I verify outside the GP with reference calls and a site visit. It all lands in an IC memo that leads with the recommendation, the two or three things the decision hinges on, the bear case, and the conditions to commit. The mindset is that I am trying to falsify the GP's pitch, not fall in love with it.

**Q2. A GP shows a 28% net IRR but a 1.5x net TVPI. Are you impressed?**
No, I am suspicious. A 28% IRR alongside a 1.5x multiple usually means the returns are fast and small rather than large, which points to financial engineering: early dividend recaps, quick partial flips, or subscription-line timing that compresses the LP's capital-at-work window. I would ask for returns with and without subscription-line impact, look at the deal-by-deal hold periods, and weight the multiple over the IRR, because LPs ultimately consume MOIC, not an annualized percentage. A high IRR on a low multiple is rarely a sign of durable value creation.

**Q3. Why has DPI become the metric everyone talks about, and what are its limits?**
Because the exit market stalled from 2022, GPs are sitting on large unrealized marks they cannot convert to cash, and 2018-vintage DPI is running around 0.6x versus a historical norm near 0.8x. DPI is the only metric that cannot be marked up, so it is the credible signal of real liquidity, and re-up decisions now hinge on it. Its limit is that it is path- and age-dependent: a low DPI is fine for a young fund in the J-curve and alarming for a mature one, so it only means something against the same vintage cohort. And on its own DPI ignores remaining upside in the portfolio, which is why I read it next to TVPI and RVPI.

**Q4. How do you decompose a buyout return, and what do you want to see?**
With a value-creation bridge: EBITDA growth, multiple expansion, and deleveraging. EBITDA growth splits further into revenue growth and margin expansion and is the only lever that reflects operating skill. Multiple expansion is usually beta and timing. Deleveraging is leverage. I want a track record dominated by EBITDA growth, because McKinsey showed about two-thirds of buyout return for deals entered after 2010 and exited by 2021 came from multiple expansion and leverage, and that tailwind is gone. A GP that can show durable operating value creation is far more likely to repeat in the current regime than one that bought cheap, levered up, and rode the market.

**Q5. Explain the distribution waterfall and why European versus American matters.**
The waterfall is the order in which proceeds split between LPs and the GP: return of capital, then the preferred return (hurdle, typically 8%), then the GP catch-up, then the carry split (typically 80/20). The European, whole-fund waterfall pays carry only after the LPs have gotten back all their capital plus the pref across the entire fund, so the LP is protected and it is the institutional default. The American, deal-by-deal waterfall pays carry as each deal exits, before the whole fund is whole, which front-loads cash to the GP and creates the risk that early carry was overpaid if later deals lose money. American is acceptable only with a strong clawback that is escrow-backed, computed gross of the GP's taxes, and joint-and-several across partners.

**Q6. What is a subscription line of credit and how does it distort performance?**
It is short-term fund-level borrowing collateralized by LPs' uncalled commitments, used to fund deals and expenses so the GP can delay calling LP capital. Because IRR is time-sensitive, delaying the call shortens the period the LP's cash is deployed and mechanically lifts the IRR, while the multiple barely changes except for the interest cost, which slightly reduces it. So it flatters IRR without creating value. I ask for returns both with and without the line, and ILPA recommends the preferred return accrue from the facility draw date rather than the later call date so the line cannot manufacture an easier hurdle.

**Q7. Walk me through the PME methods and tell me which you would use.**
PME asks whether the GP beat a public index using the GP's own cash-flow timing. The lineage: Long-Nickels (1996) builds a hypothetical index investment and compares a hypothetical IRR, but breaks when large distributions drive the index position negative. PME+ and mPME fix that. Kaplan-Schoar (2005) returns a wealth-multiple ratio where above 1.0 means outperformance, which is intuitive and widely used. Direct Alpha is the most rigorous and expresses outperformance as an annualized alpha, essentially annualized KS-PME. I would lead with KS-PME for communication and Direct Alpha for rigor, and I would stress that the index choice matters as much as the method, so I match the index to the fund's size and style.

**Q8. The academic literature disagrees on whether PE beats public markets. Reconcile it.**
The disagreement is real and turns on data, fees, and era. Kaplan-Schoar in 2005, using Venture Economics data, found average buyout roughly matched the S&P 500 net of fees. Harris, Jenkinson, and Kaplan in 2014, using cleaner Burgiss data sourced from over 200 LPs, found buyout outperformed by roughly 20% to 27% over a fund's life and more than 3% a year for most vintages since 1984, attributing part of the gap to data-quality problems in the older dataset. Phalippou and others argue much of the apparent outperformance shrinks once you adjust for risk and how returns are reported. My read: buyout has probably beaten public markets net of fees over long horizons, but the margin is debated, concentrated in top managers, and not guaranteed forward, which is exactly why manager selection is the LP's job rather than just buying the asset-class beta.

**Q9. What would make you walk away from a fund?**
Independently fatal items first: a failed ODD such as no independent administrator with the GP self-valuing, a qualified audit or an unexplained auditor switch, or regulatory or integrity problems with the principals. Then clusters: a track record that collapses when you strip the top one or two deals, high IRR next to a mediocre multiple, rising RVPI with stalled DPI in a mature fund, and marks that never moved through 2022 to 2023. On the people side, unexplained senior departures, unresolved succession with the founder holding most of the carry, and a thin or fee-waiver GP commitment. On terms, an American waterfall with a weak clawback, no fee step-down, sub-100% fee offset, or a toothless 80%-plus no-fault threshold. And strategy drift, especially a 3x-plus fund-size step-up.

**Q10. How do you assess a first-time fund with no firm-level track record?**
The hard part is attribution: the partners have a record from a prior firm, but credit is contestable. I try to get clean, independent attribution of which deals each principal sourced, led, and sat on, verified through co-investors and references rather than the GP's own slides, and I expect the old firm may dispute it. I weight process and edge more heavily because I cannot lean on a firm track record, and I look for a larger GP commitment as a conviction signal. Operationally, first-time funds usually have gaps (no independent administrator, thin compliance, weak insurance) that I can sometimes require them to fix as conditions to commit. The terms should be at least market and ideally LP-favorable to compensate for the higher uncertainty.

**Q11. A GP raised 500 million for Fund III and is raising 2 billion for Fund IV. Reaction?**
A 4x step-up is a major drift flag. The edge that produced the Fund III record was built at a deal size and competitive intensity that a 2 billion fund cannot replicate: bigger targets, more efficient auctions, and a different competitive set, so the historical returns lose predictive power. I would interrogate whether the team, sourcing, and operating model actually scale, whether returns in Fund III already showed compression as deals got bigger, and whether the firm is raising to maximize fee income rather than because the opportunity set genuinely grew. I would also tighten the strategy and concentration clauses in the LPA. The step-up does not kill the deal by itself, but it shifts the burden heavily onto the GP to prove the edge travels.

**Q12. What is the GP commitment, what is market, and what do you look for beyond the headline number?**
It is the GP's own money in the fund, market roughly 1% to 3% of fund size, and ILPA wants it substantial and funded in cash rather than by waiving fees. Beyond the percentage, I look at how it is funded (cash is real skin in the game, a fee waiver is not) and how it is distributed across the partnership, because if one founder funds most of it and holds most of the carry, the rest of the team is weakly retained and key-person risk is concentrated. I also check carry vesting and whether it claws back if a partner leaves, since that is what actually retains the next generation.

**Q13. Why does an LP run a pacing model, and what is the denominator effect?**
A pacing model commits a steady amount across vintages so the LP maintains target private-markets exposure without trying to time the market, smoothing through good and bad entry years and managing the timing of calls and distributions. The denominator effect is the related liquidity trap: when public markets fall, the public side of the total portfolio shrinks, so illiquid private holdings rise as a share of the whole and can breach the target allocation, which forces the LP to slow or stop new commitments exactly when vintages are often attractive. That is why pacing discipline and liquidity planning, not just manager selection, are core to the LP job.

---

## 17. Where sources disagree (consolidated)

1. **Does PE beat public markets?** Kaplan & Schoar (2005, Venture Economics data) found average buyout roughly matched the S&P 500 net of fees (KS-PME ~0.97). Harris, Jenkinson & Kaplan (2014, Burgiss data) found buyout outperformed by ~20% to 27% over a fund's life and >3% per year. Phalippou & Gottschalg (2009) and Phalippou's later work argue risk- and fee-adjusted outperformance is much smaller or absent. The discrepancy is driven by dataset quality, fee treatment, era, and risk adjustment. *(Phalippou magnitudes recalled from the literature, not re-verified in this session.)*
2. **No-fault removal threshold.** ILPA standard cited as 75% in interest (V7 Labs); Ebadat cites 66.7% to 75%; lecocq associate cites 75% to 85%. GP-drafted LPAs push to 80%+.
3. **Frequency of no-fault divorce use.** One secondary source (V7 Labs blog) claimed ~18% of funds saw no-fault divorce exercised in 2025, which contradicts the strong consensus (including elsewhere in the same source family and lecocq associate) that no-fault removal is "almost never used." Treat the 18% figure as unreliable absent a primary source.
4. **PME "standard" method.** There is no single industry-standard PME; practitioners variously favor KS-PME (communication), Direct Alpha (rigor), or PME+/mPME (technical fixes). Index choice is contested and material.
5. **DDQ volume figures** (e.g., ~250 questions / ~21 categories / 150+ DDQs per GP per year) come from service-provider commentary (altSS, AutoRFP.ai), not ILPA, and should be treated as indicative.
6. **Persistence magnitudes** vary by study and dataset; the robust direction (weakened buyout persistence, stronger VC persistence, sticky bottom) is widely accepted, but exact coefficients should be taken from the source papers.

---

## 18. Sources

Primary and authoritative sources are listed first within each cluster. URLs are provided for offline retrieval; figures should be re-verified against the primary documents before being quoted in any live memo.

**ILPA (standards and best practice)**
- ILPA, "ILPA Principles 3.0: Fostering Transparency, Governance and Alignment of Interests" (2019). https://ilpa.org/wp-content/uploads/2019/06/ILPA-Principles-3.0_2019.pdf
- ILPA, "Due Diligence Questionnaire 2.0" (updated November 2021). https://ilpa.org/wp-content/uploads/2021/11/ILPA-DDQ-2.0.pdf ; overview: https://ilpa.org/industry-guidance/templates-standards-model-documents/due-diligence-questionnaire-and-diversity-metrics-template/
- Dechert, "Third Time Lucky? The ILPA Principles 3.0" (2019). https://www.dechert.com/knowledge/onpoint/2019/10/third-time-lucky--the-ilpa-principles-3-0.html
- Hirschler, "ILPA Releases ILPA Principles 3.0" (2019), on exculpation carve-outs and subscription-line preferred-return accrual. https://www.hirschlerlaw.com/newsroom-publications-1307
- Torys LLP, "Overview of ILPA Principles 3.0 and Model LPA" (2020). https://www.torys.com/en/our-latest-thinking/publications/2020/03/overview-of-ilpa-principles-3-0-and-model-lpa

**Benchmarks, fund terms, and market context**
- Cambridge Associates, "Private Investment Fund Terms: Fees and Distribution Waterfalls" (Aug 2024). https://publishedresearch.cambridgeassociates.com/wp-content/uploads/2024/08/2024-08-Private-Investment-Fund-Terms-Fees-and-Distribution-Waterfalls-1.pdf
- Cambridge Associates, "Growth Equity: Turns Out, It's All About the Growth" (loss-ratio definitions and ranges). https://www.cambridgeassociates.com/insight/growth-equity-turns-out-its-all-about-the-growth/
- Bain & Company, "Global Private Equity Report 2026" and "2025" (dealmaking, exits, DPI, dry powder, '12 is the new 5'). https://www.bain.com/insights/topics/global-private-equity-report/ ; midyear 2025: https://www.bain.com/insights/private-equity-midyear-report-2025/
- CFO.com summary of Bain 2026 (2025 buyout deal value +44% to ~$904bn; exit value +47% to ~$717bn; continuation/secondaries <10% of exits). https://www.cfo.com/news/bain-global-private-equity-report-finds-liquidity-pressure-rising-as-capital-cycles-grow/813053/
- McKinsey, "Bridging private equity's value creation gap" (two-thirds of buyout return from multiples + leverage, 2010+ deals). https://www.mckinsey.com/industries/private-capital/our-insights/bridging-private-equitys-value-creation-gap
- iCapital, "An Explanation of Private Market Fund Fees" (hurdle, catch-up, waterfall). https://icapital.com/insights/private-equity/an-explanation-of-private-market-fund-fees/
- Carta, "Management Fees" (2024-vintage mean fees: buyout 1.74%, growth equity 1.93%). https://carta.com/learn/private-funds/management/management-fees/
- Benchmark ranges (top-quartile buyout 2.3x-2.7x TVPI, 18%-22% IRR; median 1.6x-1.8x, 12%-14%; DPI pacing): Value Add VC (2025) https://valueaddvc.com/blog/private-equity-fund-performance-irr-tvpi-and-dpi-benchmarks-vs-vc ; GP Intel (2026) https://www.gp-intel.com/blog/dpi-private-equity ; pipelineroad (2026, citing Cambridge Associates 2025) https://pipelineroad.com/blog/private-equity-returns-statistics ; Angel Investors Network (2026, ILPA Jan-2025 sub-line disclosure) https://angelinvestorsnetwork.com/alternative-investments/tvpi-private-equity-metric-explained

**PME and academic performance literature**
- Harris, Jenkinson & Kaplan, "Private Equity Performance: What Do We Know?", Journal of Finance 69(5), 2014 (buyout outperformance 20%-27% over fund life; Burgiss data). https://onlinelibrary.wiley.com/doi/10.1111/jofi.12154 ; NBER w17874: https://www.nber.org/papers/w17874
- Kaplan & Schoar, "Private Equity Performance: Returns, Persistence, and Capital Flows", Journal of Finance, 2005 (original KS-PME; ~0.97 average buyout net of fees).
- CFA Institute Enterprising Investor, "Evaluating Private Equity Performance: PME vs. Direct Alpha" (2014). https://blogs.cfainstitute.org/investor/2014/07/23/evaluating-private-equity-performance-pme-vs-direct-alpha/
- Carta, "Public Market Equivalent (PME)" (Long-Nickels negative-NAV problem, KS-PME). https://carta.com/learn/private-funds/management/fund-performance/pme/
- Moonfare, "What is the Public Market Equivalent (PME)?" (lineage: Long-Nickels/ICM, PME+, mPME, KS-PME, Direct Alpha). https://www.moonfare.com/glossary/public-market-equivalent-pme
- Nasdaq / eVestment, "Assessing Alpha with PME Analysis" (index-selection sensitivity). https://www.nasdaq.com/articles/evestment/private-markets-insights/assessing-alpha-in-private-equity-returns-with-public-market-equivalent-analysis
- Direct Alpha methodology overview (Gredil, Griffiths & Stucke; mPME by Cambridge Associates 2013; PME+ by Rouvinez/Capital Dynamics 2003). https://directalphamethod.info/

**ODD, LPA terms, key-person/removal, loss ratio**
- Wikipedia, "Operational due diligence (alternative investments)" (Amaranth, Bayou cautionary tales; legal review, service-provider controls). https://en.wikipedia.org/wiki/Operational_due_diligence_(alternative_investments)
- DiligenceVault, "Quantifying the Value of Operational Due Diligence" (ODD scope; JP Morgan survey). https://diligencevault.com/quantifying-the-value-of-operational-due-diligence/
- Dasseti, "Operational Due Diligence on External Fund Managers" (front/middle/back-office segregation; ODD veto power). https://www.dasseti.com/insights/operational-due-diligence-on-external-fund-managers-is-it-that-important
- altSS, "LP Due Diligence Checklist 2026" (IDD vs ODD framing; ~50% of closures operational; timelines; DDQ volume). https://altss.com/blog/lp-due-diligence-checklist-2026
- PitchBook, "No-fault divorce clauses mean LP and GP breakups just got easier" (2025). https://pitchbook.com/news/articles/private-equity-fund-terms-lp-shift-us
- lecocq associate, "Key Person Provisions" and "GP Removal: For Cause vs. Without Cause" (2025) (cure windows; 75%-85% thresholds). https://www.lecocqassociate.com/publications/2-key-person-provisions... ; https://www.lecocqassociate.com/publications/3-gp-removal-for-cause-vs-without-cause---understanding-the-differences
- V7 Labs, "Limited Partnership Agreement: LPA in Private Equity Guide" and "LP Due Diligence on GPs" (2026) (ILPA 75% standard; GP-commit distribution; key-person breadth). https://www.v7labs.com/blog/lpa-private-equity ; https://www.v7labs.com/blog/lp-due-diligence-gp-evaluation
- Ebadat, "GP/LP Negotiations" (66.7%-75% removal threshold; concentration limits). https://www.ebadatlaw.com/insights-strategies/gplp-negotiations-key-terms-lps-push-back-on-and-how-to-handle-them
- Moonfare, "Monitoring and Optimising Private Equity Portfolio" (loss-ratio definition; MOIC/TVPI). https://www.moonfare.com/pe-masterclass/optimising-pe-porftolio
- KPMG, "Evaluating private equity's performance" (value-bridge caveats; IRR pitfalls). https://assets.kpmg.com/content/dam/kpmg/pdf/2016/06/evaluating-private-equitys-performance.pdf
- UNC Institute for Private Capital, "Loss Avoidance in Private Equity" (2024) (behavior around the 1.0x threshold). https://uncipc.org/wp-content/uploads/2024/02/LossAvoidance_Feb-1-2024.pdf
- Hamilton Lane and CEPRES private-markets glossaries (term definitions). https://www.hamiltonlane.com/en-us/education/private-markets-common-terms ; https://cepres.com/private-equity-glossary

**General reference / definitions**
- Investopedia and CFA Institute curriculum for baseline definitions of IRR, MOIC, TVPI, DPI, RVPI, J-curve, and waterfall mechanics (definitional cross-checks).

---

*End of manual. Treat every benchmark number as a point estimate from a moving market: re-pull the current Cambridge Associates / Preqin / PitchBook quartiles for the exact vintage and strategy before you put a figure in a live IC memo, and re-read the actual LPA rather than relying on "market" generalizations, because the specific drafting is what binds.*
