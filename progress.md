# Progress log

Append-only. Newest entry at the top. One entry per session that changed something.

This exists because a long-horizon task outlives any single context window. An agent picking
this up cold reads `goals.json` for *what* is left and this file for *what just happened and
what went wrong last time*. Keep entries short and factual. Record failures, not only wins —
a dead end that is written down is worth more than one that gets rediscovered.

Format:

```
## YYYY-MM-DD — one-line summary
- what changed
- verification: what was actually run, and its result
- open: anything left dangling for next time
```

---

## 2026-08-17 — Learning steps, a 30% tighter schedule, and live interval labels

- Answered first, changed second. The labels under the buttons were **already dynamic**: they are
  produced by running the real scheduler for each grade and formatting the actual due date. Nothing
  about them was hardcoded. Likewise there was **already one card store**, `srs` in IndexedDB keyed
  by question id, written by both screens through the same `setSrsState`. There were never three.
- The real problem was that FSRS's own first interval is far too slack for a card seen once: Hard
  landed at 1.18d and Easy at 15.7d. Anki solves this with sub-day learning steps before a card
  graduates, and its manual is explicit that steps should stay under a day. Added `LEARNING_STEPS`:
  a card's FIRST answer gives 10m / 1h / 1d / 3d. Every review after that is pure FSRS.
- Cards now come back 30% sooner. Expressed as `INTERVAL_MODIFIER = 0.7`, with desired retention
  DERIVED from it (0.9268) rather than set by hand, so the two cannot disagree. Retention is the
  knob Anki actually exposes; 0.80-0.95 is its stated sane band.
- Fixed a real staleness bug found while checking: the drill computed its labels from the ladder
  snapshot, frozen at page load, while review kept a live copy. A card met twice in one session
  showed pre-grade delays. The drill now holds live scheduling state like review does.
- Licence question, checked rather than assumed: Anki itself is **AGPL-3.0**, so lifting its code
  into a public site would put the whole site under AGPL. `ts-fsrs` is **MIT with no dependencies**
  and would be a legitimate swap; it implements the same FSRS-5 spec ours already follows, and ours
  is covered by 20 assertions with no dependency added to an offline-first PWA. Kept ours.
- Verification: 37 checks green including the build. In the browser, a never-seen card in the drill
  showed exactly 10m/1h/1d/3d; the same card in review after one Good and a day's ageing showed
  10m/3d/4d/8d, matching the computed progression and proving both screens read one store.
- Worth knowing: re-testing a card seconds after grading it returns identical Hard/Good/Easy
  delays. That is correct FSRS, not a bug. Recall is still ~100%, so the review carries no new
  information and stability does not move. It only shows up in artificial testing.

## 2026-08-17 — One card system across climb, path and review

- The drill and review had drifted into different interactions. The drill asked you to commit
  before the reveal ("Not sure" / "I know this") and then grade again after it, so you answered
  every question twice; and which second grade you got depended on whether every question in the
  stage had been met, so the same screen behaved differently in different stages. Review simply
  flipped and graded. Now all three run one model: prompt → flip (space, click or button) →
  Again / Hard / Good / Easy.
- Removed the commit step, the nailed-or-missed buttons and the `anki` mode flag entirely.
- **Danger zone had to be redefined.** It keyed off the pre-reveal claim, which no longer exists,
  so it would have stayed empty forever. Burned now means you had a question right before and then
  graded Again. Same spirit, no extra tap, and it needs no new data.
- Navigation: a drill opened from the climb sent you back to the module page and from there to the
  path, a section you were never in, and the tab bar lit Path the whole time you were inside the
  climb. The ladder view is now remembered for the session and drives both the back link and the
  tab. Path entry is unchanged and still goes back through the module page.
- The four grade buttons had no top margin, so in the drill they sat flush against the answer box
  and read as overlapping it. `.grade-row` was also declared twice with different values.
- Found while verifying: the drill rendered `GradeButtons` without a `key`, so Preact reused the
  instance between cards and its one-shot `fired` guard stayed tripped, swallowing the first press
  on the next card. Review had always keyed it.
- Verification: 33 checks green including the build. In the browser, confirmed both entry points
  (climb back link "Climb" + Climb tab; path back link "DCF" + Path tab), space flips, four buttons
  with live intervals, a 16px gap where there was 0, keyboard and click grading each advancing
  exactly one card, a triple click still advancing one, and review unchanged end to end.
- Note for future browser testing: the preview pane runs backgrounded (`document.hidden` true), so
  timers are throttled and fixed `setTimeout` waits sample before renders commit. That produced a
  convincing but false "every other card ignores space". Drive one action per call instead.
- Open: seeded two due cards in the local dev IndexedDB while testing review. Localhost only,
  nothing to do with the live account.

## 2026-08-17 — Orchestrator scaffolding: verification gate, goal state, progress log

- Added `scripts/verify.mjs`: 25 checks across types, the FSRS scheduler and content integrity.
  Runs in about 2 seconds. `npm run verify` (25 checks), or `npm run verify:full` (26, adds the
  vite build, ~6s). The build step sets `--experimental-global-webcrypto` itself on Node 18.
- Added `.claude/hooks/verify-gate.sh` wired to the `TaskCompleted` hook. A task cannot be
  marked complete while verification fails; the hook exits 2 and hands the failures back.
- Added `goals.json` as the durable goal state: six sector desks and four interactive-layer
  items, all starting as `failing`.
- Added this log.
- Verification: ran the gate green on a clean tree, then deliberately broke the scheduler
  (`DESIRED_RETENTION` 0.9 → 0.85) and confirmed 2 checks failed with exit 1; separately fed
  it a malformed bank file and confirmed the hook exited 2 with feedback. Both reverted, tree
  clean, gate green again.
- Open: nothing committed yet — these files are untracked, waiting on Jan.

## 2026-08-17 — FSRS scheduler and four-button grading shipped to tewess.com

- Replaced SM-2 with FSRS-5 throughout, four-button grading in drill and review.
- Fixed the card-jumping bug: the merge layer was fabricating absent optional fields, so a
  no-op sync looked like a real change and reloaded every open screen mid-drill.
- Deployed `4a27c39`; live bundle hash matched the local build.
- Verification: on tewess.com, all 24 existing cards showed as migrated with zero legacy
  records, four-button labels rendered with personalised intervals, info button present.
- Open: one test attempt on `acc-e01` from earlier debugging is still in Jan's account.
