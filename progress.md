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
