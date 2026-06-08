---
title: Benchmarking & Pitfalls
domain: performance
---

# Benchmarking & Pitfalls

## 1. Why benchmarking is non-negotiable

A standalone return is meaningless. The question is always *relative to comparable funds and to the public market.* This section covers peer benchmarking (providers) and the IRR/multiple pitfalls that distort it.

---

## 2. Vintage-year benchmarking

A fund is compared only to **other funds of the same vintage year, same strategy, same geography**. The vintage controls for the macro and market environment a fund was born into: a 2007 buyout fund and a 2010 buyout fund faced utterly different worlds, and comparing them is malpractice.

**Vintage year definition is not standardized** — and this is a genuine cross-provider inconsistency to flag in diligence. It is variously defined as the year of the fund's:

- **First capital call / drawdown**, or
- **First close**, or
- **Final close**

A fund near a year boundary can land in different vintages (and therefore different peer sets and quartiles) at different providers. Always confirm which definition a benchmark uses before ranking a fund against it.

---

## 3. Quartiles

Within a vintage-and-strategy cohort, funds are ranked by a chosen metric (usually net IRR *or* net TVPI — and the two can rank a fund differently). The cohort is cut into four equal groups:

- **Top quartile** — best 25%. Being "top quartile" means at or above the 25th-percentile boundary.
- **Median** — the 50th percentile; the line between 2nd and 3rd quartiles.
- **Bottom-quartile boundary** — the 75th-percentile line; below it is the worst 25%.

**The trap interviewers set:** a fund can be **top-quartile by IRR but second-quartile by TVPI** (or vice versa) within the *same* cohort, because the two metrics rank differently. A fast, sub-line-flattered, modest-multiple fund ranks high on IRR and lower on multiple. *"Top quartile" is meaningless unless you specify by which metric, in which provider's dataset, for which vintage and strategy.* GPs naturally quote whichever quartile flatters them.

---

## 4. Pooled vs average vs median IRR

Three different "the cohort returned X%" numbers exist and they are not interchangeable:

| Measure | Construction | Characteristic |
|---|---|---|
| **Pooled IRR** | Aggregate all funds' cash flows into one stream; solve a single IRR | **Capital-weighted**: big funds dominate; Cambridge's official benchmark figure |
| **Average (mean) IRR** | Arithmetic mean of individual fund IRRs | Equal-weighted; distorted upward by a few large winners (PE returns are right-skewed) |
| **Median IRR** | Middle fund by IRR | Equal-weighted; robust to outliers; usually *lower* than pooled/mean |

For a right-skewed asset class: **report median for the typical LP experience; pooled for the asset-weighted experience; and never average IRRs casually** — IRRs are not additive (§3 in the IRR lesson).

---

## 5. The data providers

The four major commercial private-capital datasets differ primarily in **how they source data**, which drives coverage and bias. Academic work (Harris–Jenkinson–Kaplan) finds that average returns and PMEs across Burgiss, Cambridge, and Preqin are broadly *consistent*, suggesting the biases do not overturn conclusions about PE performance overall. The older Venture Economics / Thomson dataset is the documented exception: it materially *understated* buyout performance because GPs stopped updating NAVs after the relationship lapsed.

| Provider | Primary data source | Coverage strength | Known / alleged bias |
|---|---|---|---|
| **Cambridge Associates** | Fund financial statements and GP/advisory-client relationships | Buyout, VC, growth, credit, real assets; long history | Possible tilt toward **GPs raising new funds** (who skew successful) per academic work |
| **Burgiss → MSCI Private Capital** | **LP-reported**: complete cash-flow histories from LPs' own books | Data back to 1978; survivorship-bias-free within reporting LPs; ~13,000+ funds / ~$15tn at MSCI acquisition (Oct 2023) | Possible selected sample of LPs, but complete *within* each reporting LP |
| **Preqin** | Public filings + FOIA requests to public pensions + voluntary LP/GP submissions | Very broad fund universe; named/identifiable funds; strong for fundraising data | May miss high performers with no public-pension LP |
| **PitchBook** | FOIA + direct LP/GP requests; strongest deal-level database | Deal, company, and fund data | Similar FOIA-driven gaps to Preqin on fund-performance side |

**Practical takeaways for the LP desk:**
- **Burgiss/MSCI** = the cleanest cash-flow data (LP-sourced, survivorship-free), best for rigorous PME and persistence work.
- **Cambridge** = the most-quoted consultant benchmark; watch the possible successful-GP tilt.
- **Preqin** = broadest map and best fundraising intel; weakest where top funds hide from FOIA.
- **PitchBook** = go-to for deal-level diligence and company comps.
- A GP can almost always find *one* provider, *one* metric, *one* vintage definition, and *one* quartile cut under which it is "top quartile." Your job is to pin down all four and pick the like-for-like comparison the GP would least prefer.

---

## 6. Pitfalls — know these cold

### 6a. IRR manipulation via credit lines

Sub-line usage (§4 in the IRR lesson) mechanically inflates IRR without improving the multiple. A fund with a high IRR and only an average TVPI — especially early in life — may be running a large, long-dated sub line. The fingerprint: **IRR up, multiple flat or slightly down** (because of line interest). ILPA's 2020 guidance requires disclosure of IRR with *and* without the facility.

### 6b. NAV-loan-funded distributions

Debt-funded distributions boost DPI and IRR ahead of a fundraise with no actual value creation. DPI from recallable NAV-loan proceeds is not the same as DPI from genuine exits. **Decompose DPI into realized-exit cash vs financing-driven cash** before drawing conclusions.

### 6c. Vintage comparison error

Comparing a 2007 vintage fund to a 2012 vintage fund confounds skill with the macro environment (entry multiples, leverage availability, exit windows). Always benchmark within vintage. Compounding the problem: vintage is defined inconsistently across providers, so a near-boundary fund may appear in different cohorts depending on which database you use.

### 6d. J-curve effects

Early in a fund's life, net IRR and TVPI will typically be negative or below 1.0x. This is the normal J-curve — fees charged before exits, investments still at cost. A fund three years old with a 0.9x TVPI may be a perfectly normal fund, not a bad one. Penalizing early-vintage funds for being young is a systematic error.

### 6e. Stale NAVs

All metrics that include NAV — TVPI, RVPI, KS-PME, Direct Alpha — depend on the **GP's reported fair value** of the unrealized portfolio. Stale or aggressively marked NAVs flatter TVPI and all PME methods simultaneously. For mature funds, weight **DPI** more heavily than RVPI-heavy TVPI. For live funds, scrutinize the valuation methodology and look for recent third-party validation.

### 6f. Metric-shopping and provider-shopping

GPs naturally quote the metric (IRR vs TVPI), the provider, the vintage definition, and the quartile cut that flatters them most. The analyst's job is to:
1. Confirm which metric is being quoted (gross vs net, IRR vs TVPI/DPI).
2. Pin down the vintage definition used.
3. Check the same fund's quartile in at least two providers.
4. Look at the PME alongside the IRR.

---

## 7. Market context (verify before quoting)

Recent industry reporting (Bain & Company, CFA Institute) documented that the post-2022 environment squeezed exits and distributions: distributions as a share of NAV fell to roughly decade lows, buyout fundraising fell about 23% in 2024 versus the prior year, and average fundraising timelines stretched toward ~19 months. This backdrop drove the surge in NAV facilities and continuation funds. Treat any specific figure as a point-in-time data point and re-confirm current numbers before citing.
