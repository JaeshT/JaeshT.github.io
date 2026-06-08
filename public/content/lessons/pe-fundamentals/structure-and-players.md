---
title: Players & Fund Structure
domain: pe-fundamentals
---

## The Two Sides of Every Fund

A private equity fund is a **pooled, privately raised, closed-end investment vehicle** that buys equity (and sometimes debt) stakes in companies not publicly traded, holds them for several years while trying to increase their value, then sells them and returns proceeds to investors. "Closed-end" means the pool is raised once, has a fixed life (commonly around ten years), and does not let investors redeem on demand.

Every fund has two sides:

### The General Partner (GP)

The **General Partner** is the manager. The GP:
- Raises the fund and sources deals
- Executes investments and sits on portfolio-company boards
- Drives value creation and decides when to sell
- Reports to investors
- Has unlimited liability for the partnership (mitigated through a shielded GP entity — see below)
- Is compensated through a **management fee** and **carried interest**

### The Limited Partners (LPs)

**Limited Partners** supply the bulk of the capital. They are typically:
- Pension funds
- Sovereign wealth funds (SWFs)
- Insurance companies
- Endowments and foundations
- Family offices
- Funds-of-funds
- Increasingly, private-wealth and retail channels

LPs are **passive by law**: they commit capital and receive returns but cannot direct individual investment decisions without risking their limited-liability protection. Liability is capped at the amount of each LP's commitment.

**ILPA** (Institutional Limited Partners Association) is the trade body representing LPs. It publishes the dominant best-practice standards for fund terms, governance, and reporting, most notably **Principles 3.0** (2019).

---

## The LP-Side Mandate

An LP-side "Primaries & Co-investments" team engages with PE through three building blocks:

| Activity | Description |
|---|---|
| **Primaries** | Committing to a GP's new fund at formation. You underwrite the manager and strategy, not specific assets — it is a *blind pool*. |
| **Secondaries** | Buying existing fund interests from other LPs, or backing GP-led restructurings, in the secondary market. Assets are partly known. |
| **Co-investments** | Investing directly alongside a GP in a single deal, usually with no management fee and no carry, on top of a fund commitment. |

---

## The Legal Architecture

The "fund" is actually a small cluster of legal entities. Understanding the cluster matters because fees, carry, liability, and control are split across them.

### The Fund Vehicle

The fund itself is almost always a **limited partnership (LP)**, frequently domiciled in Delaware, the Cayman Islands, or Luxembourg. A limited partnership has exactly two classes of partner:
- One **general partner** with management control and unlimited liability
- Many **limited partners** with passive roles and liability capped at committed capital

The LP structure is used because it is **tax-transparent** (gains and income flow through to partners, avoiding entity-level tax) and cleanly separates control from liability.

### The GP Entity

A separate legal vehicle (often an LLC) that *formally* serves as the general partner of the fund. It is deliberately a thin entity so the unlimited liability of the GP role does not reach the management firm's principals personally. This entity is the formal recipient of **carried interest**.

### The Management Company

The operating business — the brand you recognize (Blackstone, KKR, EQT, etc.). It:
- Employs the investment professionals
- Pays salaries and rent
- Receives the **management fee**

One management company typically manages many funds across many vintages simultaneously.

### The Fund Structure Schematic

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

## Key Governance Documents

### The Limited Partnership Agreement (LPA)

The **LPA** is the governing contract and the single most important document in an LP's life. It dictates:
- Management fee rate and base
- Carried interest percentage
- Hurdle/preferred return and the waterfall
- Fund term and extension options
- Investment period length and recycling provisions
- GP commitment
- Key-person provisions and clawback
- Expense allocation rules
- LPAC composition and removal rights
- Conflict-of-interest rules

ILPA Principles 3.0 (2019) defines what "market" and "fair" look like across all these terms.

### Side Letters

**Side letters** are bilateral agreements between the GP and individual LPs granting bespoke terms:
- Fee discounts
- "Most favored nation" (MFN) clauses
- Co-investment rights
- Excuse rights
- Reporting customization

Large or early LPs negotiate the strongest side letters.

### LPAC (Limited Partner Advisory Committee)

A committee of **selected LPs** that reviews conflicts of interest, valuations, and certain GP decisions. Key points:
- It is an **oversight body**, not an investment committee
- It **cannot direct deals**
- ILPA Principles 3.0 added significant guidance on LPAC operation
- GPs must bring conflicts, valuation disputes, and certain waivers to the LPAC for review or approval

### Subscription Agreement

The legal document each LP signs to formally commit to the fund. It records the LP's commitment amount, representations, and eligibility (e.g., "qualified purchaser" status under US law).

### Private Placement Memorandum (PPM)

The offering document the GP provides to prospective LPs. It describes the fund strategy, team, target returns, risk factors, and proposed terms — the LP's first formal look at the investment opportunity before LPA negotiation.

---

## GP Commitment

The GP invests its own money into the fund alongside LPs to put "skin in the game." This aligns the GP's interests with LP interests.

- **Historical convention:** ~1% of fund size
- **Commonly cited range:** 1% to 2%
- **In practice:** ranges to ~5% and is trending upward as institutional LPs push for more
- **ILPA preference:** a substantial cash commitment (not waived fees), treated as a core alignment mechanism in Principles 3.0

---

## Key-Person Provisions

The LPA specifies which individuals (typically the senior investment professionals responsible for fund returns) are designated as "key persons." If a sufficient number of key persons depart or are incapacitated:
- The investment period **suspends** or **terminates** automatically
- LPs may gain the right to terminate or wind down the fund

Key-person provisions protect LPs from a manager losing the team they underwrote.

---

## Organization of a PE Firm

A typical PE firm's org structure:

| Level | Role |
|---|---|
| **Managing Partner / CEO** | Leads the firm and fund strategy |
| **Partners / Managing Directors** | Lead deals; sit on portfolio-company boards |
| **Vice Presidents / Directors** | Manage deal execution and portfolio monitoring |
| **Associates / Senior Associates** | Financial modeling, due diligence, monitoring |
| **Analysts** | Support modeling and research |
| **Operating Partners** | Industry or functional specialists helping portfolio companies |
| **Investor Relations / Capital Markets** | Manages LP relationships, fundraising, reporting |

On an LP-side primaries team, the analyst role mirrors the GP's "associate" function but focused on **manager due diligence, term negotiation, and portfolio monitoring** rather than direct deal execution.
