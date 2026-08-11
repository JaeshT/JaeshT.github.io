# IB pivot — resume here

Status as of **2026-08-11**. Branch: **`ib-prep`** (cut from `claude/pe-internship-prep-program-DBiQz`).
This branch is a **work in progress and does not build yet** — that is expected, see "Resume" below.

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
   and the LP-only tools (`lib/waterfall.ts`, `lib/metrics.ts`, `views/tools.tsx`, `views/brief.tsx`).
   The `technicals` content is deliberately kept — it is the seed for the new modules.
3. **`src/lib/schema.ts`** rewritten — `Module` / `Tier` / `Sector`, and one unified `Question`
   (prompt, say-out-loud `answer`, `deepDive`, must-hit `keyPoints`, optional auto-gradeable `check`).
   One bank per module replaces the old parallel flashcards/questionbank/quizzes files.
4. **`src/lib/db.ts`** rewritten — new IndexedDB store `ib-prep-db` (clean slate; old PE progress is
   left alone in the old store), per-question `Attempt` records with a `burned` flag (confident, then
   missed) that drives the Danger Zone.
5. **`src/lib/curriculum.ts`** written — ladder construction, lock/clear rules, readiness score with
   decay, `nextStage`, `dangerZone`, `dueQuestions`.

## Resume — next steps, in order

1. **Make it compile.** These still import the old schema and are the reason `npm run build` fails:
   - `src/lib/domains.ts` and `src/lib/mastery.ts` → delete, replaced by `curriculum.ts`.
   - `src/lib/content.ts` → new loaders (`loadIndex`, `loadBank`, `loadLesson`, `loadGlossaries`).
   - `src/lib/offline.ts` → walk the new manifest shape.
   - `src/views/cards.tsx`, `src/views/learn.tsx` → replaced by `views/path.tsx` (ladder map, module,
     stage) and `views/drill.tsx` (drill runner); keep `glossary.tsx` and `offline.tsx`.
   - `src/app.tsx` → new routes (`path`, `module/<id>`, `drill/<module>/<tier>`, `review`, `danger`),
     new nav, Home = ladder + readiness ring, and the PE branding removed.
2. **New `public/content/index.json`** — the curriculum manifest (all modules listed so the map shows
   the whole journey; modules without a `bank` render as "not built yet").
3. **Accounting module content** — `public/content/modules/accounting.json`, tiered easy/medium/hard.
   Seed easy from the 21 accounting-tagged cards in `public/content/flashcards/technicals.json` and
   the accounting items in `questionbank/technicals.json` + `quizzes/technicals.json`; write medium
   and hard fresh from the two guides, each with `keyPoints`.
4. **Rebrand** — `index.html`, PWA manifest in `vite.config.ts`, `scripts/gen-icons.mjs` (the icon is
   currently a PE "J-curve"), `README.md`, `CLAUDE.md`.
5. `npm run build` green, then decide about merging to `main` (that is what deploys tewess.com).

## Then (agreed but not started)

The "not boring" layer, roughly in value order:
**Impact Engine** (tap the line items that move when D&A rises $10 — a rules engine generating
infinite three-statement questions) · **paper-LBO speedrun** (timed, staged, graded on speed and
accuracy) · **branching follow-up trees** (survive five follow-ups) · **out-loud mode** (timer,
self-grade against `keyPoints`) · **accretive-or-dilutive in 8 seconds** · **Danger Zone** (wired in
the data model already) · **readiness score with decay** · **sector desks** · **multiple-validity
drill** · **three-minute daily drill**.
