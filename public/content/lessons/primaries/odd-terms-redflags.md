---
title: Operational DD, Terms & Red Flags
domain: primaries
---

## Operational due diligence (ODD)

ODD is the "can we trust you with our capital and reporting" workstream, and in many institutions the ODD team holds a **formal veto** over any commitment regardless of how good the investment case looks. The discipline matured after operational frauds: Madoff (fake administrator and auditor), Bayou (fabricated returns), Amaranth (risk failure), and Weavering (fake counterparty). Roughly half of manager failures are operational rather than investment-driven.

The IDD vs. ODD distinction is canonical: IDD is "can you make money," ODD is "can we trust you with our capital" — and both must pass independently. A clean investment case does not save a fund that fails ODD.

### What ODD inspects

**Fund administration.** Is there an independent, reputable third-party fund administrator — or does the GP self-administer? Self-administration (GP both manages money and keeps the books and strikes the NAV) was the structural enabler of multiple frauds and is a **major flag** for anything but the smallest, most transparent managers.

**Valuation governance.** Who values the portfolio, how often, using what methodology, and with what independent check (third-party valuation provider, auditor sign-off, LPAC review)? A GP that marks its own book with no independent validation controls your reported TVPI.

**Audit.** Annual audit by a credible firm (Big Four or a recognized specialist), with **clean (unqualified) opinions** and no auditor changes that lack a clean explanation. A qualified opinion or a quietly switched auditor is a serious flag.

**Compliance and regulatory.** SEC-registered investment adviser status (Form ADV on file), a real Chief Compliance Officer, a compliance manual, code of ethics, personal-trading policy, and clean regulatory history. Run the GP and principals through enforcement and litigation databases.

**Cybersecurity and technology.** SOC 1 / SOC 2 reports from the firm and its key providers, penetration-testing cadence, incident history, and controls against wire fraud and business-email-compromise (a leading vector for stolen capital calls).

**Business continuity and disaster recovery (BCP/DR).** Documented and tested plans.

**Service-provider quality.** Administrator, auditor, fund counsel, prime broker/custodian, banks. Quality of the surrounding ecosystem is a proxy for institutional readiness.

**Insurance.** Adequate D&O (directors and officers), E&O/professional indemnity, cyber, and crime/fidelity coverage.

**Segregation of duties and internal controls.** Front office (deal/portfolio), middle office (reconciliation/risk), and back office (fund accounting/valuation) should be separated. Cash movements should require dual authorization. Whoever executes deals should not be the same person who values them and reconciles the cash.

**Cash controls.** How capital calls and distributions move, who can authorize wires, and how the LP verifies wiring instructions (callback procedures), given the prevalence of fraudulent payment-instruction attacks.

### Common ODD failure modes for first-time/small managers
- No independent administrator; GP self-administers and self-values
- Weak or absent compliance function
- Thin or missing insurance coverage
- Founder controlling every function with no segregation of duties

These can sometimes be remediated as a condition of commitment ("we will commit if you appoint an independent administrator before close").

---

## Fund terms and the LPA review

The Limited Partnership Agreement (LPA) governs the fund for its life (typically 80–150 pages), supplemented by side letters granting bespoke rights to individual LPs. Legal/terms diligence reads the LPA against the three **ILPA Principles 3.0** pillars (ILPA, 2019): **alignment of interest, governance, and transparency.**

ILPA Principles 3.0 is voluntary best-practice guidance, not law, but it is the reference grammar of LP-GP negotiation. "ILPA-aligned" is shorthand for LP-friendly.

### Economic terms

**Management fee.** Pays the firm's operating costs regardless of performance. Market is roughly 1.5%–2.0% for buyout (2024-vintage mean: ~1.74% for buyout, ~1.93% for growth equity). Three things to check beyond the headline rate:

- **Fee base.** Charged on *committed* capital during the investment period (standard), then *invested* capital or *net invested cost* after — the **step-down.** A fee that stays on committed capital for the whole fund life is GP-friendly and a flag.
- **Step-down.** Confirm the fee drops at the end of the investment period (commonly to a lower rate and/or a smaller base). Absence of a step-down is a flag.
- **Fee offset.** Transaction fees, monitoring fees, and director fees the GP collects from portfolio companies should offset the management fee. **ILPA recommends 100% offset.** Anything less means LPs are paying twice and the GP keeps the difference.

**Carried interest (carry).** The GP's profit share, market **20%.** The mechanics matter more than the rate:

- **Hurdle / preferred return.** The minimum LP return before the GP earns carry. Market is **8%** in buyout (lower, 6%–7%, in credit; venture often has no hurdle). A **hard hurdle** means carry applies only to returns above the hurdle; a **soft hurdle** means once the hurdle is cleared, the catch-up lets the GP earn carry on all profits including the hurdle portion.
- **Catch-up.** After the hurdle, the GP catches up to its full carry share. A **100% catch-up** (GP-friendly, market) sends 100% of distributions to the GP until it has 20% of all profit; an 80% catch-up is more LP-friendly.

  Catch-up formula (100% catch-up, carry rate $c$, LP preferred return already paid $P$):
  $$X = \frac{c \times P}{1 - c}$$
  Example: $c = 20\%$, $P = \$20\text{M}$: $X = (0.20 \times 20) / 0.80 = \$5\text{M}$

- **Waterfall type — the single most important economic governance term:**
  - **European (whole-fund) waterfall:** Carry paid only after LPs have received back *all* contributed capital plus the preferred return across the *entire fund.* LP-friendly; the institutional default.
  - **American (deal-by-deal) waterfall:** Carry paid as each deal exits, before the whole fund is whole. GP-friendly; front-loads cash to the GP; creates clawback risk.

- **Clawback.** If the GP is overpaid carry early (common under American waterfalls), the clawback forces it to return the excess. Three quality tests: Is it backed by an **escrow** holdback of carry? Is it computed **gross** (not net of taxes the GP paid)? Is the GP's obligation **joint and several** across partners (not merely several, which lets you collect from each partner only up to their individual share)?

- **Recycling.** The right to re-invest early distributions. Reasonable in moderation; abusive if uncapped, because it extends fee duration and LP exposure.

### European waterfall example

LPs contribute $100M. The fund returns $180M total. Cumulative 8% preferred return: $20M.

- Tier 1 — Return of capital: LPs get $100M. Remaining = $80M.
- Tier 2 — Preferred return: LPs get $20M. Remaining = $60M. (Profit distributed so far: $20M, all to LP.)
- Tier 3 — GP catch-up (100% to 20% carry): $X = (0.20 \times 20) / 0.80 = \$5\text{M}$. GP gets $5M. Total profit distributed = $25M, GP has $5M = exactly 20%. Remaining = $55M.
- Tier 4 — 80/20 split: LP gets $44M; GP gets $11M.
- **Totals:** LP = $164M; GP carry = $16M.
- Check: GP carry / total profit = $16M / $80M = **20%** ✓

### Structural and governance terms

**Fund term and extensions.** Typically 10 years + two 1-year extensions. Long or GP-controlled extensions keep fees running on aging assets ("zombie funds").

**GP commitment.** Market 1%–3%; ILPA wants it *substantial* and *in cash*, not funded by waiving fees or via a special financing facility.

**Key-person provision.** Names the principals on whom the strategy depends. A trigger (death, disability, departure, or failure to devote substantially all business time to the fund) usually **suspends the investment period** automatically, halting new capital deployment until LPs consent to resume (typically within a 90–180-day cure window). Check that the definition covers the *full* set of people who matter, not just the founder.

**GP removal:**
- **For cause:** Fraud, gross negligence, willful misconduct, material LPA breach, key felony. Can remove the GP and often strip/reduce its carry.
- **No-fault divorce:** LPs remove the GP/terminate the fund *without proving wrongdoing*, by supermajority vote. This is the real deterrent because it requires no litigation. Threshold ranges: ILPA standard often cited as 75% in interest; practitioners cite 66.7%–85%. GP-drafted LPAs push to 80%+, which in a diversified LP base is near-impossible to organize.

**LPAC (LP Advisory Committee).** A subset of the largest LPs that approves conflicts, valuation methodology questions, related-party transactions, and certain waivers — without directing day-to-day investing. Securing an LPAC seat is itself a diligence and monitoring tool.

**Exculpation and indemnification.** ILPA's stated minimum: the GP should *not* be exculpated/indemnified for gross negligence, fraud, willful misconduct, or LPA breach. A standard-of-care drop to mere "negligence" or sweeping indemnities is a flag.

**Subscription lines of credit.** Short-term fund-level borrowing that delays LP capital calls. Boosts IRR without improving MOIC; costs interest. ILPA recommends the preferred return accrue **from the date the facility is drawn, not the date capital is finally called from LPs**, so the GP cannot use the line to manufacture an easier hurdle. Check: cap on facility size, maximum outstanding days, and whether returns are disclosed gross and net of the line.

**Co-investment allocation.** How co-invest opportunities are offered. A "co-investment right subject to GP sole discretion" is not actually a right.

**Conflicts: cross-fund investments, GP-led secondaries, continuation vehicles.** Cross-fund investments (a new fund buying from an old fund) and GP-led secondaries (moving an asset from an old fund into a new vehicle the same GP manages) can be legitimate liquidity tools or self-dealing that bails out a struggling prior fund at LP expense. Demand LPAC approval, independent fairness opinions, and a genuine LP option to cash out or roll.

**MFN (most-favored-nation) and side letters.** After final close, LPs are typically offered the chance to elect more favorable terms granted to other LPs of equal or smaller commitment size.

---

## ESG and DEI diligence

ESG (environmental, social, governance) diligence assesses material non-financial risk and, for many institutional LPs, satisfies a policy or regulatory mandate. The ILPA DDQ's ESG section is built on the **PRI Limited Partners' Private Equity Responsible Investment DDQ.**

**What you assess:**
- A real, board-level **ESG policy**, not a marketing PDF
- **Integration into the investment process:** ESG screened pre-investment and managed through ownership, with named accountability
- **Monitoring and KPIs** at the portfolio-company level
- **Reporting** to LPs, including incident reporting of material ESG events
- **Regulatory fit,** especially EU **SFDR** (Sustainable Finance Disclosure Regulation) Article 6/8/9 classification for European mandates
- **DEI (diversity, equity, and inclusion)** data using the ILPA Diversity Metrics Template (added 2018, enhanced 2021; DEI Monitoring Questionnaire added 2023)

**Divergence by region:** ESG is not applied uniformly. European LPs and SFDR-bound investors treat ESG as a gating mandate. In the US, "ESG" has become politically contested — several US public pension systems have pulled back from explicit ESG screening, while others continue to integrate it under risk-management framing. Calibrate to your institution's actual policy.

---

## Red flags that kill a deal

A practical taxonomy. One flag rarely kills a deal on its own; a cluster does. Certain flags — especially ODD and integrity failures — are independently fatal.

### Track-record and performance flags
- Returns concentrated in one or two deals (fund collapses when you strip the top deals)
- High IRR next to mediocre MOIC (financial engineering / sub-line games rather than value creation)
- RVPI rising while DPI stalls in a mature fund (cannot convert marks to cash)
- Marks that did not move through the 2022–2023 public drawdown (NAV smoothing)
- "Top quartile" claims that do not survive a named-benchmark, same-vintage check
- A loss ratio far above the strategy norm (riskier book than the label implies)
- Persistently below-cohort DPI for the fund's age

### Team and alignment flags
- Unexplained senior departures, especially mid-fund or of key performers
- Unresolved succession; founder holds most carry with no next-generation path
- Small GP commitment, or GP commitment funded by fee waiver rather than cash
- Key-person definition too narrow to cover the people who actually matter
- Spin-out attribution the old firm disputes
- Behavioral flags: a founder who cannot name a mistake; lifestyle out of step with economics

### Strategy flags
- Strategy, size, or style drift; a 3x+ fund-size step-up
- A "thematic" pivot outside the circle of competence
- An edge that is a slogan ("we buy good companies") with no attribution support
- First-time fund with no clean, independent attribution to back the pitch

### Terms flags
- American waterfall with a weak, unfunded, or net-of-tax clawback
- No fee step-down; fee on committed capital for the whole life
- Fee offset below 100%
- No-fault removal threshold so high (80%+) it is toothless
- Sweeping indemnification / standard of care below gross negligence
- Uncapped recycling; long GP-controlled term extensions (zombie-fund risk)
- Conflict provisions that permit cross-fund deals or GP-led secondaries without LPAC approval and a fairness opinion

### Operational and integrity flags (often independently fatal)
- No independent third-party administrator; GP self-administers and self-values
- Qualified audit opinion, or an unexplained auditor change
- Regulatory enforcement, undisclosed litigation, or principals with integrity issues
- Weak or absent compliance function; thin insurance
- No segregation of duties; one person controls deals, valuation, and cash
- Slow, incomplete, or evasive data room; reluctance to facilitate reference calls
- Inability to produce clean cash-flow-level track-record data

---

## The ILPA DDQ

The **ILPA DDQ** (Due Diligence Questionnaire) is the industry-standard structured information request an LP sends a GP. Created to stop every LP from sending a slightly different bespoke questionnaire, it was first published in 2013 and updated in 2016, 2018 (added DEI section), and the current **DDQ 2.0 in 2021** (expanded ESG via PRI DDQ, enhanced DEI, Diversity Metrics Template). A 2023 DEI Monitoring Questionnaire was added for ongoing monitoring.

A modern PE DDQ runs approximately 250 questions across roughly 21 categories. The DDQ is *necessary but not sufficient*: it is the GP's self-report, so it frames your verification work rather than replacing it. ILPA itself states that no LP should treat the DDQ as a substitute for its own determination of what it needs.

**Broad DDQ categories:** firm overview and history; ownership and management company; team and bios; fund strategy, terms, and structure; investment and decision process; track record and prior funds; portfolio construction and risk; valuation policy; fees and expenses; conflicts of interest; legal, regulatory and compliance; operations, administration, and service providers; technology and cybersecurity; business continuity; insurance; references; ESG; and DEI.
