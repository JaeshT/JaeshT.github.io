---
title: "Valuation: Comps & Precedents"
domain: technicals
---

# Valuation: Comps & Precedents

## 1. The three core valuation methods

There are three core methodologies. Each answers "what is this business worth" from a different angle; the output is a range across all three: the **"football field."**

| Method | Source of value | Typical level |
|---|---|---|
| Trading comps | Public peers' market multiples today | Minority / public-market value |
| Precedent transactions | Multiples paid in past M&A deals | Highest (control premium + synergies) |
| DCF | Company's own projected cash flows | Wherever your assumptions land |

No single number is "the answer." You triangulate across all three and defend the range.

---

## 2. Enterprise value vs equity value: the bridge

Before computing any multiple you must be precise about what the numerator and denominator represent.

**Equity value (market capitalization)** is the value attributable to **common shareholders**: diluted share count × share price. It is what an equity buyer pays for the stock.

**Enterprise value (EV)** is the value of the **entire operating business**, independent of capital structure. It is what a buyer effectively pays to acquire the whole company free of its existing financing.

$$\text{EV} = \text{Equity Value} + \text{Total Debt} + \text{Preferred Stock} + \text{Minority Interest} - \text{Cash}$$

Equivalently: $\text{Equity Value} = \text{EV} - \text{Net Debt} - \text{Preferred} - \text{Minority Interest}$

where Net Debt = Total Debt − Cash.

**Why each line:**

- **Add total debt:** an acquirer must repay or refinance the target's debt, so it is part of the true cost. Debt holders have a claim senior to equity.
- **Subtract cash:** cash is non-operating; the buyer effectively gets it back. Subtracting cash also avoids double-counting, because interest income on that cash is not in EBITDA.
- **Add preferred stock:** a financing claim senior to common equity, part of the capital funding the enterprise.
- **Add minority (noncontrolling) interest:** when a parent consolidates a subsidiary it owns only partially, the financials (and EBITDA) include **100%** of that subsidiary, but equity value reflects only the parent's share. Adding minority interest makes EV consistent with the fully consolidated EBITDA denominator.

EV is **capital-structure neutral**, which is why it pairs with capital-structure-neutral metrics: revenue, EBITDA, EBIT. Equity value pairs with after-debt, after-tax metrics: net income (P/E), book value (P/B).

**Worked example:** share price $50.00; diluted shares 100M; total debt $2,000M; cash $500M; preferred $100M; minority interest $150M.

- Equity value = $50 × 100\text{M} = \$5{,}000\text{M}$
- EV = $5{,}000 + 2{,}000 + 100 + 150 - 500 = \$6{,}750\text{M}$

Reverse bridge: given EV $6,750M → equity value = $6{,}750 - 2{,}000 - 100 - 150 + 500 = \$5{,}000\text{M}$ → price = $5{,}000 \div 100\text{M} = \$50.00$.

---

## 3. Diluted shares and the treasury stock method

Equity value uses **diluted** shares, not basic, because in-the-money options and warrants will convert and dilute existing holders.

**Treasury Stock Method (TSM):**

1. Count only **in-the-money** options/warrants (strike below current price). Out-of-the-money instruments are ignored.
2. Compute exercise proceeds = number of options × strike price.
3. Assume the company uses those proceeds to **repurchase shares at the current market price**: shares repurchased = proceeds ÷ current price.
4. **Net new shares = options exercised − shares repurchased.** Add to basic shares.

**Worked example:** basic shares 100M; options 10M; strike $20; current price $50.

- Proceeds = $10\text{M} \times \$20 = \$200\text{M}$
- Shares repurchased = $\$200\text{M} \div \$50 = 4\text{M}$
- Net new shares = $10\text{M} - 4\text{M} = 6\text{M}$
- **Diluted shares = 106M**

Convertible securities use the **if-converted method**: if in the money, add the shares they convert into and remove the related after-tax interest expense from earnings.

---

## 4. Trading comparables ("comps")

Value the target against a peer set of **publicly traded** companies using market multiples.

**Process:**
1. Identify comparable companies (similar industry, business model, size, growth, margins, geography).
2. Calculate their multiples (typically on a last-twelve-months or next-twelve-months basis).
3. Take the **median** (not the mean: the median resists distortion from outliers).
4. Apply the median multiple to the target's metric to get an implied EV or equity value.

**Common multiples:**

| Multiple | Type | When to use |
|---|---|---|
| EV/Revenue | EV-based | Early-stage, low-margin, high-growth; sectors without reliable EBITDA |
| EV/EBITDA | EV-based | **Default workhorse** for most M&A and buyout analysis |
| EV/EBIT | EV-based | When capex differences between companies are material |
| P/E | Equity-based | Banks, insurers, financial services; quick equity comparisons |
| P/Book (P/B) | Equity-based | Banks, asset-heavy companies |
| P/TBV | Equity-based | Banks (tangible book removes intangibles) |

**Why EV/EBITDA is the workhorse:** it strips out capital structure (interest), tax regime, and non-cash D&A, allowing cleaner cross-company comparison. P/E is distorted by leverage and taxes but is standard for financials where capital structure is the business.

**Comps reflect a minority, public-market value**: no control premium is embedded. They also move with market sentiment, so a broad selloff will compress all comps regardless of individual fundamentals.

**Worked example:** peer median EV/EBITDA 9.0×; target EBITDA $50M; target net debt $100M; shares 10M.

- Implied EV = $9.0 \times \$50\text{M} = \$450\text{M}$
- Implied equity value = $\$450\text{M} - \$100\text{M} = \$350\text{M}$
- Implied share price = $\$350\text{M} \div 10\text{M} = \mathbf{\$35.00}$

---

## 5. Precedent transactions ("precedents," "deal comps")

Same idea, but multiples come from **prices paid in past M&A deals** for comparable targets.

**Why precedents are usually higher than trading comps:**
- **Control premium:** the right to control the company and run it differently is worth more than a passive public-market stake.
- **Synergies:** strategic acquirers often pay for expected synergies (cost savings, revenue cross-sell) that a standalone public company would not capture.

**Limitations and caveats:**
- **Dated:** a 2021 deal reflects 2021 financing conditions (cheap leverage, high multiples), not today's. A deal from a different rate environment can significantly overstate or understate what a buyer would pay now.
- **Deal-specific factors:** strategic vs financial buyer, competitive auction vs negotiated, unique synergies, seller desperation: all distort comparability.
- **Selection bias:** announced deals are public, but not all are. Failed deals are rarely disclosed.

When presenting precedents, always note the vintage and deal environment alongside the multiple.

---

## 6. Which multiple when: a decision framework

| Scenario | Preferred multiple | Reason |
|---|---|---|
| General M&A / LBO analysis | EV/EBITDA | Capital-structure neutral, widely accepted |
| High-capex companies (airlines, utilities) | EV/EBIT or EV/EBITDA-Capex | D&A differences are too material to ignore |
| Pre-profit growth companies | EV/Revenue or EV/Gross Profit | No reliable EBITDA |
| Banks and insurers | P/E and P/TBV | Capital structure is the business; interest income/expense is operating |
| Real estate | EV/FFO or Cap Rate | Funds from operations is the relevant cash metric |
| Quick equity-holder comparison | P/E | Simplest like-for-like for earnings per share |
| Leveraged buyout context | EV/EBITDA | Matches debt sizing (lenders think in EBITDA turns) |

---

## 7. Comparing the methods

| | Trading Comps | Precedent Transactions | DCF |
|---|---|---|---|
| Data source | Public market prices | M&A deal prices | Your own projections |
| Reflects control? | No | Yes | Depends on assumptions |
| Recency | Current | Historical (may be stale) | As current as your model |
| Subjectivity | Low (markets set price) | Medium (comparability judgment) | High (many assumptions) |
| Output range | Narrow | Narrow to medium | Wide |
| Common bias | Market sentiment | Outdated deal environment | Assumption-driven |

The art of valuation is triangulating the three methods, understanding why they diverge, and defending the range to a client, a committee, or an interviewer.
