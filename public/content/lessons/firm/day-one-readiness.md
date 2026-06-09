---
title: Day-One Readiness
domain: firm
---

## The Analyst Role: Buy-Side vs. Sell-Side

An analyst role on a Primaries & Co-Investments (PIPCO) team requires an immediate pivot from theoretical finance to structured operational execution. The daily rhythm differs dramatically from investment banking:

| Investment Banking (Sell-Side) | PIPCO Analyst (Buy-Side) |
|---|---|
| Process management for single transactions | Multi-asset portfolio monitoring across hundreds of GPs |
| Client pitch decks and CIMs | Internal IC memos, PCAP reconciliations |
| Deal execution focus | Manager selection + co-investment underwriting |
| Narrow sector depth | Macro portfolio construction perspective |

---

## Core Analyst Responsibilities

### 1. Primary Fund Evaluation and Market Mapping

Analysts perform **continuous market surveillance**. When a GP announces a new fund:

- Analyze the GP's **historical track record**: loss ratios, IRR quartile ranking, DPI by vintage
- Benchmark against **public market peers** using Cambridge Associates indices and PME
- Map the macro sector the GP targets
- Assess whether the GP's new fund size represents a style drift risk

The output is a comprehensive track-record analysis delivered to the investment committee.

### 2. Co-Investment Deal Screening and LBO Underwriting

When a GP invites NB to co-underwrite, analysts operate under **severe time constraints** to produce:

- **LBO model**: entry/exit multiples, leverage levels, IRR/MOIC returns table
- **Operating projections**: revenue growth, EBITDA margin, free cash flow conversion
- **Sensitivity analysis**: downside cases on entry multiple, revenue growth, leverage
- **Debt covenant analysis**: DSCR, leverage covenant headroom
- **IC memorandum**: executive summary, investment thesis, risks, portfolio fit

The three-phase evaluation framework:
1. **GP Evaluation** — Does the asset match the GP's proven historical competency? Check sector track record, loss ratios, and fund concentration.
2. **Asset Evaluation** — Cash flow resilience, economic moats, revenue visibility, and capital structure sustainability.
3. **Portfolio Fit** — Risk/return contribution to the commingled fund; does it breach LPA concentration limits?

### 3. Portfolio Monitoring and Quarterly Reporting

The highest-volume routine work. LPs receive **hundreds of quarterly reports** from underlying GPs. Analysts must:

- Parse GP narratives to extract **valuation updates** and EBITDA movements
- Track **debt paydown velocity** and covenant compliance
- Flag **strategy drift** (GP deviating from stated mandate)
- Input standardized data into **Burgiss** for pacing and risk analytics
- Reconcile PCAP statements against internal monitoring records

---

## The Private Markets Technology Stack

Fluency in these platforms is an absolute prerequisite for day-one readiness.

| Platform | Primary Use Case |
|---|---|
| **Burgiss (Private i)** | Institutional gold standard for LP portfolio monitoring. Tracks unfunded commitments, calculates fund-level IRRs and TVPIs, runs cash-flow pacing models. |
| **eFront (BlackRock)** | Alternative investment management software integrated with BlackRock's Aladdin platform; comprehensive fund administration and multi-asset risk modeling. |
| **Preqin** | Global fundraising database. Identifies GPs currently in the market, target fund sizes, and historical quartile performance benchmarks. |
| **PitchBook** | Direct deal intelligence. Comparable company multiples, M&A transaction histories, capitalization tables for co-investment underwriting. |
| **Cobalt LP** | Specialized LP reporting automation; executes complex waterfall calculations and generates dynamic IC visualizations. |
| **Cambridge Associates** | Private capital benchmarking indices used to calculate Public Market Equivalents (PME) against rigorously scrubbed peer data. |

**Key distinction**: PitchBook is for external deal intelligence (co-investment underwriting, comps); Burgiss is for internal portfolio administration (PCAP input, pacing, risk analytics).

---

## Reading Legal and Financial Documents

### The Limited Partnership Agreement (LPA)

The LPA is the binding corporate contract establishing rules of engagement between the GP and LPs. Key sections to isolate:

**Economic Terms**
- **Management fee**: typically 1.5%–2.0% of committed capital during the investment period, stepping down to a % of invested capital thereafter
- **Carried interest**: typically 20% over an 8% preferred return hurdle
- **Catch-Up provision**: after the LP hits the hurdle, the GP receives 100% of profits until the 80/20 LP/GP split is established

**Governance and Restrictions**
- **Concentration limits**: e.g., no more than 20% of the fund in a single asset
- **Recycling provisions**: allows rapid distributions to be redeployed rather than permanently returned to LPs
- **Key Person clause**: halts investment activity if specified senior partners depart

**Side Letters**
Bilateral agreements modifying the LPA for specific LPs. Common provisions:
- **MFN (Most Favored Nation)**: guarantees the LP receives the best fee terms offered to any other investor
- **Excuse rights**: allows the LP to opt out of specific investments violating internal mandates (e.g., tobacco, firearms)
- **Enhanced co-investment rights**: priority access to deal flow

### The Private Placement Memorandum (PPM)

The PPM (often 150+ pages) serves as both marketing narrative and legal disclosure. Analysts prioritize:

1. **Strategy vs. track record alignment**: hunt for style drift (e.g., a lower-middle-market GP raising a fund triple its historical size)
2. **Team biographies + Key Person clauses**: confirm the specific individuals who generated historical alpha are contractually bound to the new fund
3. **Alignment of interest**: GP commit percentage; fee structure incentivizes carry over AUM accumulation
4. **Red flags**: exorbitant organizational expenses, vague exit strategies, omitted prior realized losses

### The Partner's Capital Account Statement (PCAP) and the Roll-Forward

The PCAP is the definitive quarterly record of an LP's financial standing within a fund, standardized by **ILPA**. Analysts reconcile PCAP statements against internal systems. The fundamental roll-forward equation:

$$\text{Ending NAV} = \text{Beginning NAV} + \text{Capital Called} - \text{Distributions} + \text{Realized Gains} + \text{Unrealized Gains/Losses} - \text{Management Fees/Expenses}$$

A balanced PCAP reconciliation confirms the GP's accounting is accurate. Any discrepancy triggers an immediate inquiry to fund administration.

---

## Key Performance Metrics to Master

**DPI** (Distributed to Paid-In):
$$\text{DPI} = \frac{\text{Cumulative Distributions}}{\text{Cumulative Paid-In Capital}}$$

**RVPI** (Residual Value to Paid-In):
$$\text{RVPI} = \frac{\text{Current NAV}}{\text{Cumulative Paid-In Capital}}$$

**TVPI** (Total Value to Paid-In):
$$\text{TVPI} = \text{DPI} + \text{RVPI}$$

**Worked example**: LP commits $100M, calls $80M, distributes $40M, remaining NAV = $120M.
- $\text{DPI} = \frac{40}{80} = 0.50x$
- $\text{RVPI} = \frac{120}{80} = 1.50x$
- $\text{TVPI} = 0.50x + 1.50x = 2.00x$

---

## Professional Conduct: Pitfalls and Excellence

### Common Pitfalls

- **Arithmetic and formatting errors**: in an environment where a decimal misplacement alters a million-dollar projection, precision is non-negotiable. Print and physically review your models before submission.
- **Trying to impress with macro commentary**: junior analysts err by offering unprompted macroeconomic opinions instead of flawlessly executing assigned data-scrubbing tasks. Build trust through zero-defect execution first.
- **Failing to ask clarifying questions early**: ambiguity compounds over time; flag assumptions at the start of a task, not at delivery.

### Strategies for Excellence

- **Proactive extension of requests**: if asked for a GP performance pull, deliver it already cross-referenced against Cambridge Associates benchmarks with the PME calculated — before being asked.
- **Serve as an information filter**: monitor financial news and send concise, highly relevant updates to the deal team on macro shifts directly impacting existing portfolio companies.
- **Zero-defect execution on fundamentals**: earn the right to more complex modeling responsibilities by demonstrating absolute reliability on routine tasks.
- **Understand the full investment lifecycle**: knowing why each step exists (J-curve, continuation fund, PCAP reconciliation) allows you to anticipate the team's next question.
