# Active exercises: a proposal

Research, a design debate, and a concrete build plan for turning tewess.com from a flashcard app
into a practice app. **Nothing here is built.** This is a document to argue with.

The seed idea was Jan's: a three-statement model with dummy numbers, a prompt saying "$10 increase
in depreciation", you edit every affected line, press Done, and the app grades how many changes you
got right. That idea survives, but not in the form it started in, and not first. This document
explains why, and proposes fourteen other things to build instead of seven variations of it.

---

## 1. What the research says

Four findings did most of the work in shaping what follows.

**Adaptive fading beats fixed fading beats pure problem-solving.** Partially-completed exercises
that progressively empty out as the learner improves outperform both a fixed schedule of hints and
being dropped straight into blank problems. This is the single most actionable result: difficulty
should be *how much of the exercise is pre-filled*, not a separately authored harder question.

**The expertise reversal effect.** Worked examples help novices and actively harm advanced
learners, who need to generate solutions themselves. So the same exercise must present differently
at easy and hard, and the app already has the tier concept to hang that on.

**Erroneous worked examples are a validated format.** "Here is a completed model, one line is
wrong, find it and diagnose it" is a real instructional technique, not a gimmick. It also happens
to be trivially gradable.

**The documented failure mode is surface-pattern memorisation.** Candidates learn "accretive =
good", then collapse when the interviewer switches financing from stock to debt, or drops a
convertible into an EV bridge. This is the exact failure that flashcards cannot detect and that
well-designed exercises can. It sets the bar: an exercise that can be passed by pattern-matching on
its own format is worthless, however satisfying it is to build.

Two more, on what the target actually is. Banks test paper LBOs for intuition in early rounds and
30/60/90-minute Excel tests later, graded on accuracy, completeness and presentation. And
accretion/dilution appears in effectively every IB interview, probed for intuition rather than
formula.

---

## 2. The debate, and where it landed

Two agents argued opposing positions. The disagreement was productive and they converged further
than expected, so the conclusions below are joint unless flagged.

**Simulation-first** argued that the transfer target is an interview room and a modelling test, so
practice should look like those: real artifacts, messy inputs, time pressure, follow-up questions.
Making exercises easy to grade doesn't remove difficulty, it relocates it to the interview.

**Feedback-first** argued that the feedback loop *is* the product. With no backend, no LLM at
runtime and no human marker, every grader is a pure function written in advance by one person who
will not be watching when it fires. One false negative — marking a right answer wrong — poisons
trust in every verdict, including the correct ones. Therefore prefer interactions where the grader
is trivially correct by construction.

### What they agreed on

1. **The primitives are the implementation layer.** Simulations are *compositions* of small
   gradable interactions, not an alternative to them. Simulation-first conceded this outright:
   "my format is not a rival to theirs, it's a presentation of theirs."

2. **Fidelity moves from the answer format to the stimulus.** This is the most useful line in the
   whole debate. Realism is bought with messy footnote extracts, distractor line items,
   mid-exercise financing switches and timers — all of which are *content*, and all of which grade
   as enums and tolerance scalars. The interview pressure lives in the prompt, not in the input
   widget.

3. **Two layers, in order.** A *drill layer* (spaced-repetition scheduled, mobile, daily, 30-90
   seconds per item) and a *lab layer* (user-initiated, desktop, timed, minutes). Drills ship
   first. The lab is gated on roughly twelve drills being live, because the authoring habit has to
   exist before the expensive artifact is attempted.

4. **Exactly one full simulation gets built**, and it is the three-statement shock grid: fixed
   rows, one shock, desktop-first, lab mode. Feedback-first conceded it is worth an engine.
   Simulation-first conceded it should not be first.

5. **Convention pinning is mandatory.** Both designs die the same death if the stem doesn't state
   its conventions. "Do operating leases belong in the EV bridge" is convention-dependent, and a
   learner marked wrong for being right is the failure both sides were trying to avoid.

### What they still disagree on

Sequencing and count. Simulation-first would build the engine early and author many simulations;
feedback-first wants twelve drills live before the first simulation. **I side with feedback-first**,
because three independent constraints point the same way: solo authoring capacity, a phone-shaped
usage pattern, and the spaced-repetition scheduler (below). When mobile, pedagogy and scheduling
all force the same decomposition, that is not a coincidence worth arguing with.

---

## 3. Two architectural decisions that shape everything

### 3.1 Sub-skill tags are the scheduled item, not exercises

The app schedules cards with FSRS. An exercise is not a card: a six-minute paper LBO touching eight
sub-skills cannot carry one stability value, because failing only the deferred-tax step would
reschedule the entire artifact.

**Every gradable step declares a sub-skill tag** — `cf-dep-addback`, `bs-cash-plug`,
`dtl-on-step-up`, `tsm-itm-test`, `sweep-ordering`. Grading emits one grade per tag touched,
derived from correctness and latency rather than a self-rating (the learner has no basis to
self-rate a six-minute attempt).

This mirrors how Duolingo's half-life regression works: recall is tracked per *item*, independent
of which exercise format tested it. The consequence here is clean. **An exercise is not a new card.
It is another way of testing cards you already have.** Nothing parallel to the existing store needs
to exist.

- Primitives carry one tag, are 30-90 seconds, and go in the normal review queue.
- Simulations carry many tags, are scheduled by the *minimum* stability across them, and launch
  from lab mode. They are never injected into the daily queue.
- A timed-out attempt emits grades for tags reached and nothing for tags unreached, so abandoning
  an exercise never creates false lapses.

### 3.2 Fade by due state, not by authored tier

This is the strongest idea the debate produced, and neither side had it going in.

Pre-fill the steps whose tags are well-retained. Empty the steps whose tags are due. Adaptive
fading stops being a difficulty parameter someone authors and becomes an *output of the retention
model*. That is what "adaptive fading beats fixed fading" actually means, mechanically.

Practically: one authored question carries a `prefill` array rather than three separately authored
tiers. Easy/medium/hard become defaults that the scheduler overrides once it knows something about
you.

---

## 4. The primitive catalogue

Eight generic interaction types, built once, authored against forever. Roughly 1,100 lines of
component code plus a shared shell. Every format in section 5 is one of these, or two composed.

| # | Primitive | Learner does | Grading rule | Mobile |
|---|---|---|---|---|
| **P1** | Ternary board | Marks each of N labelled rows `up / down / no change`, types magnitude only on flagged rows | Per-row enum equality. Rows flagged `contested` are shown, explained, and excluded from the score | Excellent |
| **P2** | Signed set assembly | Taps chips into a bucket and sets each `+` / `−` (third state where needed). Trap chips must be left out | Set comparison on `{chip → state}`. Reports included / missed / wrong-sign / trap-taken | Good, if tap-to-assign rather than drag |
| **P3** | Tolerance scalar | Types one number | `abs(answer − truth) ≤ tolerance`. Authored near-miss values map to specific diagnostics | Excellent |
| **P4** | Staged scalar chain | Types a sequence of numbers, each unlocking the next | Each step checked against truth *and* recomputed against the learner's own earlier answers. Marks the **first** broken step and stops attributing downstream errors | Excellent — a vertical stepper is native |
| **P5** | Ordering | Taps item then slot, or answers pairwise "which ranks higher" | Kendall tau distance to authored order. Authored `tier` ties cost nothing | Fine with tap-to-place |
| **P6** | Bucketing | Assigns each item to one of 2-4 named buckets | Per-item bucket equality. A deliberately forgiving middle bucket absorbs arguable cases | Good as a segmented control per row |
| **P7** | Spot-the-error | Taps the offending line in a read-only artifact, then picks the error type from a short list | Index equality plus single-choice equality. Partial credit for locating without diagnosing | Excellent |
| **P8** | Parameter sweep | Predicts a direction, then drags a slider to the breakeven point | Enum equality plus scalar within band. **Reveals the full curve after committing** | Excellent — sliders are touch-native |

Four properties make this worth the abstraction:

- **Every grader is provably correct.** Enum equality, set comparison, permutation distance,
  `abs(diff) < tol`. No code path marks a right answer wrong unless the *content* is wrong, and
  content errors are visible while authoring because the author states the answer rather than
  deriving it from a simulated engine.
- **Authoring cost is bounded and knowable.** A P1 board is about 15 minutes, a P3 with good
  near-misses about 10. Twenty exercises is an evening, and you know that in advance.
- **Fading falls out for free.** Each primitive has a natural granular fade axis. You cannot fade a
  monolith.
- **They compose.** The M&A financing switch is P8 + P3. The paper LBO is P4 with a timer.

---

## 5. Proposals by module

Ordered by how well the module suits active practice. **Suitability** is called out per module,
since Jan asked for it, and it varies a lot.

### 5.1 Accounting — suitability: highest

Deterministic cascades with one right answer. The best-suited module in the app.

**Ripple** (P1, + magnitude on flagged rows). A shock is stated in words. A roster of 8-14 named
line items; mark each up / down / no change, type magnitude on the flagged ones. This is the seed
idea with the ungradable part removed: same cascade reasoning, a tenth of the grading risk.
- *Easy*: 6 rows, direction only, single-step shock (inventory bought on credit).
- *Medium*: 12 rows, magnitude on four, tax involved.
- *Hard*: two composed shocks, plus **the roster is hidden** and replaced by selection from a
  padded list containing lines that do not move. At hard this becomes P2, because handing over the
  roster is itself a hint — no interviewer enumerates the affected lines.
- Score `no change` rows and **penalise false positives**. Over-editing is a genuine novice tell.
- A ternary board needs at least 8 rows including real no-change rows, or elimination pays.

**Broken linkage** (P7). A completed, correct-looking three-statement extract, read-only, with
exactly one line wrong. Tap it, then diagnose from four options.
- *Easy*: a sign flip in the cash flow statement.
- *Medium*: a plausible wrong linkage (deferred revenue treated as a receivable).
- *Hard*: everything ties and balances, and the error is conceptual (capitalising what should be
  expensed), so it cannot be found by arithmetic.

**Lab: the shock grid.** The one full simulation. Fixed rows, one shock, magnitude entry, no free
grid. Each cell is a P3, each row a P1, the whole a P4. Desktop only.

### 5.2 M&A — suitability: highest

The most-tested topic in IB interviews, and the arithmetic is deterministic.

**The financing switch** (P8 + P3, sequential and irrevocable). The standout format of the whole
debate. A deal is stated; you call direction and magnitude. Then the interviewer changes one
variable at a time — all debt at 6%, then half cash, then a convertible, then the target's P/E
crosses over. **You cannot revise earlier answers.** A running consistency score flags when your
answers imply contradictory beliefs about the cost of each currency.
- This attacks the documented "accretive = good" collapse directly, and it is the single best
  mobile format proposed: one tap, one number, next turn.
- *Easy*: direction only, yield-comparison hint visible. *Medium*: magnitude too. *Hard*: synergies
  phased over three years, foregone interest, a stub period.

**Accretion dial** (P8). Find the *breakeven* — drag the financing mix or the interest rate to the
point where EPS impact flips sign. The payoff is the reveal: after committing, the app draws the
whole curve you were sampling.
- *Hard*: the deal flips twice, and you must identify both crossover points.

**PPA waterfall** (P4). Equity purchase price → asset write-up → DTL → goodwill as the plug, each
step unlocking the next, with error carry-forward.
- *Hard*: existing goodwill on the target's books must be written off first. The step everyone
  forgets.

### 5.3 LBO — suitability: high

**Paper LBO speedrun** (P4, timed). Six sequential single-number inputs in the real order: entry
TEV → sources & uses → EBITDA build → cash flow → debt paydown → exit → MoM/IRR. Error carried
forward, so one early slip doesn't zero the attempt. Time recorded and shown against a target and
against your own previous attempts, but not graded.
- This *is* the real screening artifact, unchanged. It is also the highest-status exercise in the
  app: the thing that makes it feel like preparation rather than revision.
- *Hard*: multiple contraction on exit, plus a management option pool diluting sponsor returns.

**Sources & uses balancer** (constraint puzzle). Allocate the capital stack against live constraints
— max total leverage, min equity cheque, revolver undrawn at close. Constraints go red in real
time. Several structures pass, which is correct behaviour rather than a grading failure; the
debrief shows your IRR against the best feasible structure.
- *Hard*: a cap makes the naive structure infeasible, and you have to discover the deal doesn't
  fund at the asking price.

### 5.4 EV / Equity value — suitability: high

**Bridge builder** (P2). Start at market cap. A tray of chips — some belong, some are traps
(prepaid expenses, an equity-method stake, restricted cash). Tap each in and set its sign.
- *Easy*: 5 chips, no traps. *Medium*: 9 chips, amounts extracted from footnote text, two traps.
  *Hard*: a convertible with a stated strike against a live price, so the chip has a third state
  ("as debt" / "as shares"), plus NCI and associates both present.
- What distinguishes a candidate is knowing what *doesn't* belong, so trap chips are the feature.

**Treasury method under a moving price** (P3, with a slider). Drag the share price; tranches light
up as they cross strikes. Report diluted share count at three prices.
- Near-miss diagnostics carry the teaching: "you added all option shares — you forgot the buyback."
- *Hard*: tranches plus RSUs plus a convertible where if-converted beats TSM.

### 5.5 DCF — suitability: high

**Assemble the FCF** (P2). Chips — D&A, capex, ΔNWC, taxes, interest, stock comp, mandatory
amortisation — into add / subtract / exclude. **The starting line varies per question** (EBIT one
time, net income the next), which changes the correct chip set. That variation is the point.
- *Hard*: build levered FCF with the same chips, where the traps invert, then answer which discount
  rate pairs with it. Catches the classic mismatch.

**Reverse DCF** (P8). Given a live share price, solve for the implied assumption. Move growth,
margin and WACC until the model output hits the market price, then answer whether that is
plausible.
- Deliberately many valid solutions — any parameter set inside tolerance passes. Trains the
  intuition that terminal value dominates.

**Sensitivity direction** (P1 over a grid). Don't compute values; mark each cell higher or lower
than the anchor. Monotonicity is mathematically guaranteed, so the author cannot get it wrong.
- *Hard*: one corner has `g` approaching WACC and must be flagged "breaks down", testing whether
  you understand the formula's boundary rather than its slope.
- **Mobile casualty**: a 3×3 grid degrades to corners-only on a phone.

### 5.6 Valuation — suitability: medium

Judgement-heavy, so grading must be deliberately forgiving. The trick is a middle bucket that
absorbs arguable cases.

**Method triage** (P6). A one-paragraph situation; drag each method into `primary / supporting /
inapplicable`. Because "supporting" absorbs the genuinely contestable calls, primary and
inapplicable can carry the load and stay defensible.
- *Hard*: the paragraph contains one fact that flips a method's bucket (a cyclical trough making
  trailing multiples misleading), and you must also identify *which* fact drove your call.

**Multiple mismatch** (P7 variant). Eight multiples, some malformed (`Equity Value / EBITDA`,
`EV / Net Income`). Flag every invalid one and pick the fix. The rule — capital-structure
consistency between numerator and denominator — is binary, so grading is exact.
- *Hard*: all eight are well-formed, and you rank them by suitability for a stated company, graded
  as an ordering with partial credit.

**Comp set curation.** Twelve candidates with one-line descriptions and dirty financials. Include
or exclude each with a reason tag, then adjust two multiples for calendarisation and non-recurring
items.
- Graded on precision/recall against a defensible reference set rather than exact match. Excluding
  a borderline name is not wrong; excluding the obvious pure-play is.

### 5.7 Markets — suitability: lowest, and it dates

Much of this module is opinion, and the interesting items are the contested ones. It also goes
stale fastest: a rates question authored today reads oddly in a year. Author it last, and expect to
revisit it.

**Capital structure ladder** (P5). Order instruments by seniority. Then the variants that make it
worth building: order the *same* list by cost of capital, or by expected recovery in a stated
distress scenario. These are different orders, which is the lesson.
- Kendall tau partial credit matters here, because a nearly-right mental model deserves a nearly-
  right score.
- *Hard*: collateral coverage inverts the naive answer, so seniority alone gives the wrong ranking.

**Rate shock read-through** (P1). A macro event; mark direction for 6-8 items (2s, 10s, curve
slope, IG and HY spreads, USD, a specific bond's price).
- Items where reasonable people disagree carry a `contested` flag: shown and explained, excluded
  from the score. This is how the module stays honest, and it is also its main weakness — the
  format systematically drops the most interesting items.
- *Hard*: a hawkish surprise that *flattens* the curve because growth expectations fall, plus
  identifying which of two competing mechanisms dominates.

**Financing package selection** (P6 + constraints). Given a company profile and market conditions,
assemble a package from revolver / TLB / senior notes / converts / equity, with ratings and
covenant feasibility as hard constraints and blended cost as the score.

---

## 6. How the app decides you're right

Jan asked for this explicitly, so it gets its own section.

**The design rule.** Prefer interactions whose answer space is a permutation, a set membership, a
sign, a bucket, or a scalar with a tolerance. Those graders are a handful of lines and cannot be
wrong. An answer space of "an edited grid of 40 arbitrary numbers" is a specification of accounting,
and maintaining it is a side project.

**Error carry-forward, and where it stops.** Grade each step against truth *and* recompute against
the learner's own earlier answers, then mark only the **first** broken step. This is what a fair
human marker does and what a naive grader does not. It is cheap wherever the recompute is a linear
chain. **The line is circularity**: the moment a graph has cycles (interest → average debt → cash
flow → interest) or must balance in two dimensions, you have signed up for an iteration and
convergence policy. Chains yes, balancing grids never.

**What the engine must not do.** No iteration or goal-seek, no inferring linkages the author didn't
declare, no owning tax logic, no author-written formula strings, no general "does it balance"
validation. If an exercise needs interest on average debt, the author declares it as a given.
That's roughly 200 lines, not 2,000.

**Author-time validation.** Every exercise ships with reference answers, and a build-time script
evaluates the declared graph and fails if graph and reference disagree. This is the answer to
"the author will discover the edge cases at question four" — they surface while authoring rather
than in front of a learner months later.

**Near-miss diagnostics.** For every scalar, author two to four *specific wrong values* mapped to
explanations. This is where most of the teaching happens, and it costs about five minutes per
question.

**False-positive penalties.** Score the rows that don't move and the chips that don't belong.
Over-editing is a real novice tell and an exercise that ignores it is measuring half the skill.

**Contested items.** Where reasonable people disagree, flag it, show it, explain it, exclude it
from the score. Only grade what is genuinely determinate.

**Recognition versus production.** Multiple choice and ternary toggles lean on recognition, which
is easier than production. Discipline: at hard tier, **at least 60% of scored interactions must be
typed scalar entry**, and no hard-tier item may be pure ternary or multiple-choice unless composed
with a scalar. Easy tier may run 80% recognition, which is appropriate for novices.

---

## 7. Mobile

The app is used on an iPhone, on a commute. This constraint decides more than it looks.

**Dead at 375px**: an editable 40-cell grid, drag-and-drop bridges, football-field drag bars, 3×3
sensitivity tables.

**Native to it**: the financing switch (one tap, one number, next turn), the paper LBO stepper,
sliders and parameter sweeps, the ternary board, spot-the-error, the markets feed.

Two things follow. First, **grading is independent of input affordance** — every drag primitive
re-skins to tap-item-then-tap-target, which is better on a phone anyway and grades identically.
Second, and more interesting: **mobile independently forces the same decomposition as pedagogy and
scheduling.** A statement grid on a phone has to become a vertical stepper, at which point it is a
staged chain. Three unrelated constraints arriving at the same architecture is the strongest
evidence in this document.

---

## 8. What to build, in order

**Phase 1 — three primitives, six modules covered.**

1. **P1 ternary board**, shipping accounting *Ripple*. It is the seed idea with the grading risk
   removed, it is the simplest component, and it validates the whole architecture (authoring
   format, review screen, sub-skill tags) in the cheapest possible place. Generalises straight to
   markets.
2. **P2 signed set assembly**, shipping the EV bridge and the FCF build. Two modules, one
   component, aimed at the most-tested structural relationship in the syllabus.
3. **P4 staged scalar chain**, shipping the paper LBO and the PPA waterfall. Error carry-forward is
   the feature that earns trust, and the paper LBO is a real interview artifact rather than a proxy
   for one.

**Phase 2 — P8 parameter sweep** for the M&A financing switch and reverse DCF, then **P3, P5, P6,
P7** which are small.

**Phase 3 — the lab**, gated on twelve drills being live: the three-statement shock grid,
desktop-first, and the timed sessions.

**Author roughly ten good exercises before building the eleventh format.** Seven modules times
three tiers implies forty-plus items, and ten good ones beat forty mediocre ones.

---

## 9. Risks worth holding onto

- **Authoring is the real bill, not the engine.** Every exercise needs plausible numbers, seeded
  traps and near-miss diagnostics. The components are an evening each; the content is the project.
- **One false negative costs more than ten correct grades earn.** Trust is spent globally and
  earned locally.
- **Convention drift re-enters through content even when the code is right.** "Operating leases
  belong in the bridge" is convention-dependent, and authoring discipline is exactly what erodes at
  11pm. Every P2 stem must pin its conventions.
- **Atomic drills under-test integration**, which is what the job actually is. A candidate can ace
  forty ternary boards and still freeze at a blank spreadsheet. The honest answer is that this app
  should be the drill layer and should say so, rather than pretending to be the modelling layer.
- **Markets dates fastest.** Author it last and expect to rewrite it.
- **The seed idea might simply be right.** If a full editable grid did exist and did grade cleanly,
  it would beat the Ripple board. The claim against it is a prediction about available time, not a
  fact about pedagogy. The defensible part is the *ordering*: build the cheap layer, get twelve
  exercises live, and attempt the grid once the authoring habit exists.

---

## Sources

Learning science
- [The expertise reversal effect and worked examples in tutored problem solving](https://link.springer.com/article/10.1007/s11251-009-9107-8)
- [How fading worked solution steps works: a cognitive load perspective](https://link.springer.com/article/10.1023/B:TRUC.0000021815.74806.f6)
- [Order and congruency of correct and erroneous worked examples](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9648051/)
- [The effect of worked examples on learning solution steps and knowledge transfer](https://www.tandfonline.com/doi/full/10.1080/01443410.2023.2273762)
- [A trainable spaced repetition model for language learning (Duolingo half-life regression)](https://research.duolingo.com/papers/settles.acl16.pdf)

What is actually tested
- [90-minute LBO modelling test](https://www.fe.training/free-resources/careers-in-finance/90-minute-lbo-modeling-test/)
- [LBO modelling test: example and full tutorial](https://mergersandinquisitions.com/lbo-modeling-test/)
- [Investment banking superdays](https://www.fe.training/free-resources/careers-in-finance/investment-banking-superdays/)
- [Modelling test: format, preparation, execution](https://ibinterviewquestions.com/guides/valuation-investment-banking/modeling-test-format-preparation-execution)
- [Accretion/dilution interview questions guide](https://www.finbound.org/blog/accretion-dilution-interview-questions-guide)
- [Depreciation on the three statements](https://breakingintowallstreet.com/kb/accounting/depreciation-on-the-3-financial-statements/)

Comparable products
- [RocketBlocks drills](https://www.rocketblocks.me/) — the closest analogue, for consulting
- [IB Offer](https://iboffer.com/) — AI-graded drills for finance

Mobile interaction
- [Drag-and-drop UX guidelines](https://smart-interface-design-patterns.com/articles/drag-and-drop-ux/)
- [Accessible drag and drop](https://react-spectrum.adobe.com/blog/drag-and-drop.html)
