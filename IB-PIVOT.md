# IB pivot — resume here

Status as of **2026-08-11**. Branch: **`ib-prep`** (cut from `claude/pe-internship-prep-program-DBiQz`).
Step 1 of the resume list is **done**: the app compiles, runs, and the ladder works end to end.

Nothing here is deployed. `main` is untouched, so **tewess.com still serves the old PE site** until we
deliberately merge and push.

---

## What we're building

The PE (LP / fund-investing) prep app becomes an **investment banking technicals** prep app for
full-time IB recruiting. Same PWA shell, new content model.

Two organising axes:

1. **Module** — a rung on the curriculum ladder: Accounting → EV/Equity Value → Valuation → DCF →
   M&A → LBO → Capital Markets, plus a `fit` track (always open) and `sector` desks (TMT, FIG,
   Healthcare, Industrials, O&G, Restructuring, …).
2. **Tier** — easy / medium / hard *inside* each module. You clear a tier to open the next one.

Gating (in `src/lib/curriculum.ts`, already written):
- A module's **easy** opens when the previous core module's **easy** is cleared → you naturally sweep
  the easy questions across the whole ladder first, then medium, then hard.
- **medium** opens on clearing **easy**; **hard** opens on clearing **medium**.
- Sector desks open once every core **easy** is cleared. The `fit` track is never locked.
- Any stage can be force-opened; the map records that it was opened early rather than earned.
- A stage is cleared at **80%** of its questions nailed at least once.

### Content sources
`~/Library/CloudStorage/OneDrive-LondonSchoolofEconomics/Employment/Prep/`
- `400-Questions-IB-Interview-Guide-2025.pdf` — 207pp, ~410 numbered Q&As, generalist + 17 sectors.
- `The Red Book_WSP (3).pdf` — 285pp, deeper, layered follow-ups, worked examples, 10 sector modules.
- `Restructuring-Guide-_-Questions-and-Answers.pdf` — 15pp, ~39 Qs, bolt-on module.

Both big guides are **copyrighted commercial products** and the site is public. Content must be
**synthesised and rewritten in our own words with our own numbers** — never pasted.

---

## Done so far

1. **PE material archived** to `~/pe-prep-archive/pe-prep-snapshot-2026-08-11/` — a full working-tree
   snapshot (all PE content, the `research/` Q01–Q12 reports, and the deleted source files). Outside
   the repo, so it is never deployed.
2. **Purged from the repo**: `research/`, all `primaries` / `co-investments` / `fund-economics` /
   `pe-fundamentals` / `performance` / `firm` (Neuberger) / `market` content, the market briefing,
   and the LP-only tools (waterfall, PME). The `technicals` content was kept as the seed.
3. **New data model** — `schema.ts` (Module / Tier / Sector + one unified `Question`), `db.ts`
   (store `ib-prep-db`, per-question attempts with the `burned` flag), `curriculum.ts` (all gating,
   readiness with decay, danger zone, due queue), `useLadder.ts`.
4. **New UI** — `views/path.tsx` (ladder map + stage cards + "Open anyway"), `views/drill.tsx`
   (commit → reveal → key-point self-grade → nailed/missed), `views/lesson.tsx`, `views/ui.tsx`;
   `app.tsx` rebuilt around readiness / next-up / due / danger zone.
5. **Content seeded** — the surviving technicals material was converted into five module banks:
   accounting 29, ev-eqv 18, valuation 14, dcf 18, lbo 18 = **97 questions**, with hand-written
   `keyPoints` on the walkthroughs. The manifest lists all 14 modules, including unwritten ones.
6. **Rebranded** — title, PWA manifest, icons (three ascending bars), 404, README, CLAUDE.md.
7. **Verified** — `npm run build` green; ran the ladder in a browser: clearing Accounting · Easy
   cleared the stage, opened Accounting · Medium and EV/Equity Value · Easy, and left the rest locked.
8. **Accounting module written in full** — 70 questions from the 400 Questions guide and the Red
   Book, tiered 25/25/20, every answer as scannable bullets, `keyPoints` on all 27 walkthroughs.
   House style, applied everywhere from here: answers are bullets, not paragraphs.

## Resume — next steps, in order

1. **Deepen the content, module by module, from the guides.** `accounting` is **done** — 70
   questions (25 easy / 25 medium / 20 hard) written from both guides, bulleted answers, key points
   on every walkthrough. Use it as the template for the rest. Still thin and lopsided: `ev-eqv` (18),
   `valuation` (14, no hard tier), `dcf` (18, no easy tier), `lbo` (18). Target ~25/25/20 each.
2. **Write the missing modules**: `ma` (M&A + accretion/dilution), `markets` (debt, LevFin, ECM,
   market view), `fit` (story, behavioural, deal discussion).
3. **Sector desks** — restructuring first (there is a dedicated 15pp guide), then TMT, FIG,
   healthcare, industrials, oil & gas.
4. **Then the interactive layer** (below).
5. **Deploy** when a first pass of content is in: merge `ib-prep` → `main`, which is what publishes
   tewess.com. Until then the old PE site stays up.

## Then (agreed but not started)

The "not boring" layer, roughly in value order:
**Impact Engine** (tap the line items that move when D&A rises $10 — a rules engine generating
infinite three-statement questions) · **paper-LBO speedrun** (timed, staged, graded on speed and
accuracy) · **branching follow-up trees** (survive five follow-ups) · **accretive-or-dilutive in
8 seconds** · **out-loud mode with recording** · **multiple-validity drill** · **three-minute daily
drill**. The commit/timer, key-point self-grade, Danger Zone and decaying readiness score are
already live.
