# ib-exercises

A standalone testbed for the interactive exercise engine described in `pe-prep/EXERCISES.md`.
Separate from tewess.com on purpose: the point is to get the formats and the grading right in
isolation, without a ladder, accounts, spaced repetition or a service worker in the way.

```bash
npm install
npm run dev       # http://localhost:5200
npm run verify    # the gate: types, content maths, grader behaviour
npm run build
```

## What is here

Three exercises, deliberately spanning both formats and all three tiers:

| Exercise | Tier | Format | The point |
|---|---|---|---|
| Inventory bought on credit | easy | direction board | Cascade reasoning with no typing. Clean, no traps, no clock. |
| Depreciation rises by $10 | medium | **full model** | The real artifact: three statements, every line editable. |
| Inventory written down by $50 | hard | **full model** | Opening values hidden, 5-minute clock, distractor rows, and a counterintuitive answer (cash goes up). |

## The three decisions worth knowing

**1. Full grid is the flagship, the board is the easy-tier format.** They are not rivals. The grid
is the thing you cannot do on a flashcard; the board tests the same reasoning in 60 seconds when
you are on a phone.

**2. Fidelity rises with tier, and only with tier.** Easy is clean and scaffolded: round numbers,
tax rate stated, opening values shown, live balance check, nothing trying to catch you out. Medium
adds distractor rows. Hard hides the opening values and puts a clock on it. `scaffoldDefaults()` in
`src/lib/fade.ts` holds that policy in one place, and the gate fails if an easy exercise grows a
timer.

**3. Fade-by-due-state is a seam, not a feature.** Every prefill decision goes through
`resolvePrefill()`. Today it returns the authored default. When retention data exists, the adaptive
branch (commented, in `fade.ts`) turns on and nothing else moves. A check in `verify.mjs` fails the
build if any view reads `prefillAt` directly and bypasses it.

## How grading works

`src/lib/grade.ts`. Pure functions, no DOM, no storage.

- **Six verdicts**: correct, consistent, missed, false-positive, wrong, given.
- **Error carry-forward.** A row can declare `derive` — its parents and their signs. A wrong answer
  is re-checked against the learner's *own* upstream numbers. Get pre-tax wrong, then compute net
  income correctly from it, and you get half credit with an explanation, not a zero. This is what a
  fair human marker does.
- **First break only.** The earliest genuinely wrong row is flagged. One upstream slip is one
  lesson, not eight.
- **Over-editing is scored.** Changing a line that does not move is a `false-positive`. It is a real
  novice tell and most quiz formats cannot see it.
- **Balancing is necessary, not sufficient.** An untouched balance sheet balances at last year's
  numbers. That is reported as balancing *at the wrong total*, not as a pass.
- **No iteration, ever.** Derivations are forward-only, one pass. There is deliberately no way to
  express circularity (interest on average debt, a cash sweep, a solving plug). If an exercise needs
  one, the author states it as a given. That restriction is what keeps this ~250 lines instead of a
  hand-rolled accounting engine.

## Why the content is TypeScript

`satisfies Exercise[]` gives author-time checking, which is the cheapest place to catch a content
error. tewess.com serves JSON from `public/content` so it can update without a rebuild; moving
across is mechanical, because the types are the same shape and `verify.mjs` already validates them
the way a runtime loader would.

## The gate

`npm run verify` — 27 checks. The ones that matter most re-derive every exercise from its own
declarations rather than trusting the author:

- every declared derivation agrees with the authored deltas, **before and after** the shock
- the balance sheet balances before and after
- parents are declared above their children, so authored order is dependency order
- a perfect attempt scores 100 on every exercise
- carry-forward gives half credit, including when a propagated error lands back on the opening value
- an untouched balance sheet is not reported as a pass
- easy exercises carry no timer and no distractors; hard exercises hide the opening values
- every exercise pins its conventions

It caught three real bugs while this was being built: two wrong linkages (cash and retained
earnings both omitted their opening balance) and a grader ordering flaw that scored correct
propagation as a miss.

## Merging into tewess.com later

`src/lib/` is written to move across unchanged. The work at that point:

1. Move `schema.ts`, `grade.ts`, `fade.ts` into `pe-prep/src/lib/`.
2. Convert `src/content/*.ts` to JSON under `public/content/exercises/`.
3. Point `resolvePrefill()` at FSRS stability, which turns adaptive fading on.
4. Hand `GradeResult.skillOutcomes` to the scheduler. Sub-skill tags are already emitted per row.
5. Decide the queue question: exercises are longer than cards, so they likely belong in a separate
   "lab" entry point rather than injected into daily review.

## Known gaps

- Five modules are authored: accounting, equity value & enterprise value, valuation, DCF and M&A.
  LBO and capital markets are designed in `EXERCISES.md`, not built.
- What persists is which exercises you have solved, in localStorage, because that is what decides
  which figures you get next. An attempt in progress does not: reload mid-exercise and it is gone.
- Mobile: the grid works down to about 560px but a three-statement model on a 375px screen is
  genuinely tight. This is the open design question, and the reason the direction board exists.
- The debrief shows sub-skill outcomes but nothing consumes them yet.

---

## The numbers change once you have solved it

The second attempt at a problem you have already worked through is recall, not reasoning. You
remember that net income fell 30 and cash rose 20; the exercise has stopped teaching. So a solved
exercise comes back with different figures.

The hard part is never drawing a new number. It is that everything downstream has to move with it —
the answer key, the near-miss diagnostics, the worked solution, and every sentence of prose that
quotes a figure. **A variant with a stale answer key is worse than no variant at all**, because it
marks a correct learner wrong, and one unjust verdict poisons every other verdict the app gives.

### The contract

Authors declare the free numbers and the relationships, and the literals stay put beside them:

```ts
vars: [{ id: 'amount', label: 'purchase', domain: [50, 30, 80, 120] }],
derived: [{ id: 'taxSaved', expr: 'shock * 0.4' }],
...
answer: 90,
answerExpr: '(delivered - opex - dep) * (1 - taxRate)',
```

- `domain[0]` is the authored default, so **variant 0 is the problem a human wrote and checked**.
- Every authored number that varies carries an `*Expr` twin. The gate evaluates it at the defaults
  and fails the build if it does not reproduce the literal. This is exactly the contract `delta` and
  `perShock` already had on grid rows, generalised to every format.
- Prose interpolates `{expr}`, with `{price|2}` forcing decimals where `$12.70` matters.
  Prompts, conventions, givens, questions, working, explains, item labels and details all go
  through it.
- Statement grids keep using `withShock`, which was already proved against real content. A grid's
  shock is simply the first dimension of its variant index.

Expressions are read by a 150-line parser in `src/lib/vars.ts`, not by `eval`. Numbers, names, the
four operators, parentheses and four functions. Content is data, and data that can execute is not
data.

### What varies, and what the app promises

Variant 0 goes through the same pipeline as every other variant rather than short-circuiting,
because prose carries figures too, and a second code path for the authored case is a second thing to
keep true. Indices above 0 cycle through the remaining assignments and **never return to 0**: once
you have solved the authored figures, handing them back is the failure this exists to prevent.

Bucketing and ordering have no figures to change. Their re-attempt reshuffles the tray instead, and
the app says "try in a different order" rather than promising numbers it cannot deliver. An exercise
whose numbers are genuinely incidental declares `fixedFigures` with the reason, so "this one cannot
vary" is a decision on the record rather than an omission the gate cannot tell apart from forgetting.

### What the gate guarantees

Fourteen checks, each run across eight variants:

- `variant 0 keeps every authored figure` — number by number against the source file, which also
  catches an authored subtotal that disagrees with its own model
- `authored numbers agree with their own expressions` — the literal and the relationship cannot drift
- `a perfect attempt scores 100 on every variant`, and the balance sheet still balances
- `no variant can be gamed by one lazy answer` — new figures must not open a new way to score
  without knowing anything
- `a board direction never flips underneath its own magnitude` — direction is authored, magnitude is
  computed, and a magnitude crossing zero would mark a learner against a lie
- `no authored figure survives into a variant` — the stem cannot still quote a number the model has
  moved on from
- `no stem still shows its own placeholder` — a mistyped var name renders as literal braces rather
  than crashing, so it is caught here instead of on screen
- `every exercise says how a re-attempt differs` — vars, or a written reason

The last one has a coincidence guard worth knowing about. At a depreciation shock of 25 the tax
saved is 10, which is also the authored shock, and the sentence quoting "$10" is correct. Flagging
it would teach an author to work around the gate rather than fix the content, so anything the
variant genuinely produces is allowed. That is also why `derived` names are preferred to inline
arithmetic in prose: naming a value puts it in scope, which is how the gate tells a correct figure
apart from a stale one.

### Known limitation

Grid coefficients are linear in one number. That covers the accounting shocks well — a depreciation
change moves six lines, all proportionally — but an exercise whose answer is affine rather than
linear cannot be expressed that way. One author hit exactly that on the asset-sale exercise and
reframed it as "sold at 150% of net book value", which is linear and survives its whole domain. That
reframing is the pattern to follow. Everything outside the grid uses full expressions and has no
such limit.

## Scoring, and why it is shaped this way

Both the grid and the bridge score over **the things that should move, less a penalty for things you
moved that should not**. The obvious alternative — score every row equally — is quietly broken once
subtotals are calculated for you: a grid can have four moving lines and thirteen that stay put, so a
learner who touches nothing scores 76% for doing nothing. Under the current rule, doing nothing
scores zero, finding everything scores 100, and each spurious edit costs one find.
