# HANDOFF

Last updated 2026-09-03.

Where the project stands, for a session with no history. This file does not repeat what the
other four documents already say. It tells you which of them to read, what is true across all of
them, and what has happened recently.

---

# Part 1: the standing picture

## Read these, in this order

| File | Answers |
|---|---|
| `CLAUDE.md` | The start-of-session protocol, the stack, the two-axis model, deploy, gotchas. Loaded every session. |
| `IB-PIVOT.md` | What was built and why, module by module. The long history. |
| `goals.json` | What is left, in priority order, with acceptance criteria. The durable goal state. |
| `progress.md` | What happened last session, including what failed. Newest at the top. |
| This file | The cross-cutting picture, and anything the four above do not cover. |

Follow the protocol in `CLAUDE.md`: goals, progress, `npm run verify`, then take the highest
priority goal whose status is `failing`, one at a time.

## There are now two products in this repo

**The flashcard app.** The original and the live one. Modules, tiers, the ladder, the climb,
FSRS scheduling, accounts and sync. Everything under `src/lib`, `src/views` and `public/content`.
This is what tewess.com serves. `IB-PIVOT.md` documents it.

**The exercise engine.** Interactive practice rather than recall: you type into a three statement
model, assemble a bridge, sort items, rank them. It lives entirely under `src/exercises` and
nothing in the flashcard app imports it, or is imported by it. It arrived on 2026-09-03 from a
separate testbed repo and is described below because no other document covers it.

Keeping them apart was deliberate. Both have a `schema.ts` and the two describe different things.
A flashcard and a three statement grid have nothing in common, so folding them together to save a
directory would cost more than it saves.

## Deploy state, and the trap in it

`origin/main` is what publishes tewess.com. The local branch is `ib-prep`, and it is currently
**one commit ahead of `origin/main`**. That commit is the exercise engine merge.

So: the flashcard app is live and current. **The exercise engine is committed but not deployed**,
and nothing routes to it even locally. Both facts are intended. Deploy only when Jan asks.

`IB-PIVOT.md` opens by saying "Nothing here is deployed, `main` is untouched, so tewess.com still
serves the old PE site". **That line is stale.** It was true on 2026-08-11 and has not been true
since roughly 2026-08-12. `origin/main` carries the IB app. Trust `CLAUDE.md` and git over that
sentence, and consider correcting it if you are editing that file anyway.

## The exercise engine, in enough detail to work on it

45 exercises, 9 in each of accounting, ev-eqv, valuation, dcf and ma. Six interaction formats:
numeric 15, ternary board 8, bridge 8, statement grid 5, bucketing 5, ordering 4. LBO and capital
markets have none.

```
src/exercises/
  lib/       schema, vars, variant, model, grade, fade, shuffle, progress
  views/     grid, board, bridge, numeric, bucketing, ordering, debrief, clock
  content/   one file per module, registered in content/index.ts
  exercises-home.tsx, exercises.css, README.md
scripts/verify-exercises.mjs
```

`src/exercises/README.md` is the design document for the engine and is worth reading before
changing anything in `lib/`.

**The idea that shapes everything: figures change once you have solved an exercise.** Variant 0 is
always the exercise exactly as authored, so a first encounter is what a human wrote and checked.
Solve it and the next attempt draws new numbers. The whole difficulty is that everything downstream
has to move with them: the answer key, the near miss diagnostics, the worked solution and every
sentence of prose that quotes a figure. A variant with a stale answer key is worse than no variant,
because it marks a correct learner wrong.

The contract that keeps that honest: authors write the literal number AND an expression saying how
it is built, and the gate evaluates the expression at the defaults and fails the build if the two
disagree. Prose interpolates `{expr}`. Expressions go through a small parser, never `eval`.

**Two seams to the rest of the app**, both named in the header of `exercises-home.tsx`:
`lib/progress.ts` is a localStorage stand-in for the real store, and `lib/fade.ts` is where FSRS
retention would eventually decide how much of an exercise arrives pre-filled. Neither is wired.

**Wiring it to a route is a product decision, not a tidy-up.** When it happens, `exercises.css`
defines its own `:root` token block that duplicates the one in `styles.css`, and that block has to
go at that point.

## Two gates, one command

`npm run verify` runs the flashcard checks and then, as its last check, shells out to
`scripts/verify-exercises.mjs` for the exercise engine, currently 71 checks. This matters because
the `TaskCompleted` hook only ever runs `verify.mjs`, so anything not reachable from there is not
actually gated.

`npm run verify:exercises` runs the exercise gate alone.

The exercise gate's source scans are scoped to `src/exercises` rather than all of `src`. A check
written about the exercise views firing on an unrelated flashcard file is how a gate loses its
authority.

## Rules that later work must stay consistent with

- **Never weaken a check to get past the gate.** If a check is genuinely wrong, say so and leave it
  failing. This has been tested: content authors have correctly refused to edit the gate and
  reported a real bug in it instead.
- **Copyright.** The two source guides are commercial products and the site is public. Synthesise
  and rewrite in our own words with our own numbers. Never paste.
- **House style.** No em dashes, no en dashes, no curly quotes, no bold in content, no "not just X
  but Y". Answers are scannable bullets. Run the `humanizer` skill over prose. There is a scan for
  this. See `IB-PIVOT.md` item 12.
- **Question ids are permanent.** Changing one orphans that card's real scheduling history in Jan's
  account.
- **Token budget is deliberate.** Jan's global `CLAUDE.md` sets this: no standing `ultracode`, agent
  teams off by default, push work into scripts rather than agents, say what an orchestration will
  cost before starting it. Two subagents stalled completely on 2026-08-18 and the work was faster
  done directly.

## Open risks and barriers

- **The exercise engine has no home in the app.** It is 45 exercises and about 9,000 lines that
  nobody can reach. Every day it stays unrouted is a day it can drift from the flashcard app it is
  supposed to join.
- **Content coverage is lopsided.** Flashcards: see `IB-PIVOT.md` for per module counts. Exercises:
  LBO and capital markets are empty.
- **The sector desks are the top priority in `goals.json`** and none is started. Restructuring is
  first because it has a dedicated source guide.
- **`~/ib-exercises` still exists** on disk with its own 10 commit history. The merge into pe-prep
  was a copy, not a move. It is safe to delete once you are satisfied, but nothing has been deleted
  yet, and edits made there will not reach pe-prep.

---

# Part 2: recent developments

## 2026-09-03: the exercise engine moved into this repo

Copied from `~/ib-exercises` into `src/exercises` and committed as `2dfcccf`, one commit ahead of
`origin/main` and not pushed. `scripts/verify-exercises.mjs` came with it and `verify.mjs` now
chains to it. `EXERCISES.md`, the design proposal these were built from, had been sitting untracked
in this repo for weeks and is committed alongside.

Proven not to affect tewess.com: typecheck passes under `noUnusedLocals`, the build passes, and
grepping the shipped bundle for exercise content returns nothing because nothing imports it.

Outstanding: it is unreachable. Deciding where it goes in the app is the next real decision.

## 2026-08-19: M&A exercises, and grids learned to carry expressions

Nine M&A exercises, 3 per tier, the first module authored with varying figures from the start
rather than retrofitted. Grid rows gained `deltaExpr` because the older mechanism scales every line
by one coefficient and cannot express a constant term, which is exactly what goodwill is.

The gate caught two faults in that content, both the same shape, a variant where a wrong method
lands on the right answer. Funding a deal entirely with debt issues no shares, so "you forgot the
new shares" becomes correct. A deal already accretive without synergies needs zero synergy, and at
zero the pre-tax and after-tax answers are the same number.

## 2026-08-18: figures that change, across four modules

Built the variant system and converted accounting, ev-eqv, valuation and DCF to it. Same class of
bug found repeatedly and worth expecting again: at a 50/50 capital structure a weighted average
equals a simple average, so a near miss became the answer.

Two things learned about method. The gate's eight variant sample was too thin and now runs a wide
deterministic sweep on the cheap numeric checks. And two near misses sharing a value is a fact
about arithmetic rather than a defect, so the grader now names both mistakes instead of picking one
and stating it as fact.

Two of four subagents produced a single sentence in thirty minutes and were stopped. The work was
done directly and faster.

## 2026-08-17 and 2026-08-18: the flashcard app

Covered properly in `progress.md`, which is the authority for these. In short: FSRS learning steps
so a card seen once comes back in 10m/1h/1d/3d, a 30% tighter schedule expressed as one
`INTERVAL_MODIFIER`, and one card system across the climb, the path and review.
