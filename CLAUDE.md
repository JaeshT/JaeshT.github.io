# CLAUDE.md — project memory for Claude Code

> Read this first, then [`IB-PIVOT.md`](IB-PIVOT.md) for what is built and what is next.

## What this is
An installable, **fully-offline PWA** for **investment banking technical interview** prep
(full-time recruiting). Studied on iPhone. Live at **https://tewess.com**.

It was originally a private-equity (LP-side) prep app; that content was archived to
`~/pe-prep-archive/` and removed. Anything still referring to primaries, co-investments, fund
economics or Neuberger Berman is a leftover and should go.

Stack: **Vite + Preact + TypeScript**, service worker (Workbox `injectManifest`), IndexedDB
(`idb-keyval`), tiny hash router. No backend — all user state is local.

## Commands
```bash
npm install
npm run dev        # local dev at :5173 (service worker OFF in dev)
npm run build      # tsc -b && vite build  (ALWAYS run before committing/deploying)
npm run preview    # serve built dist/ at :4173 (test offline/PWA here)
```
Node 20+. On Node 18, prefix builds with `NODE_OPTIONS=--experimental-global-webcrypto` (the
service-worker step needs the global `crypto`). `package.json` also pins `path-scurry`'s `lru-cache`
to 11.0.2 for the same reason — do not widen that override to all packages, Babel needs lru-cache v5.

## The model — two axes, and that's it
- **Module** — a rung on the ladder: accounting → ev-eqv → valuation → dcf → ma → lbo → markets,
  plus the always-open `fit` track and `sector` desks (TMT, FIG, healthcare, industrials, O&G, RX).
- **Tier** — `easy` / `medium` / `hard` *within* each module.

Gating lives in `src/lib/curriculum.ts` and nowhere else:
- medium opens on clearing easy; hard opens on clearing medium
- a module's entry tier opens when the previous core module's entry tier is cleared, so you sweep
  the easy questions across the ladder first and then climb
- a stage is cleared at **80%** of its questions nailed at least once
- empty tiers and unwritten modules gate nothing — they are transparent
- sector desks open once every core module is entered; `fit` is never locked
- any stage can be force-opened ("Open anyway"); it's recorded as opened early, not earned

## Architecture / key files
- `src/app.tsx` — shell, hash routes, tab bar, Home (readiness ring, next-up, due, danger zone).
- `src/lib/schema.ts` — **the content contract.** One `Question` type serves drilling, spaced
  review and auto-graded checks. Don't add parallel content types; extend this one.
- `src/lib/curriculum.ts` — pure ladder logic: stage status, readiness (with decay), danger zone,
  due queue. All gating decisions belong here, not in views.
- `src/lib/useLadder.ts` — the one hook that assembles manifest + banks + user state.
- `src/lib/db.ts` — IndexedDB (`ib-prep-db`): SRS, per-question attempts (incl. the `burned` flag),
  progress, settings, export/import.
- `src/lib/md.ts` — markdown + KaTeX. **It auto-disambiguates `$`** as currency vs. real math, so
  content authors write `$100M` and `$\frac{a}{b}$` naturally. Never escape currency in content.
- `src/views/drill.tsx` — the study loop: commit → reveal → key-point self-grade → nailed/missed.
- `src/views/path.tsx` — the ladder map and per-module stage cards.

## Content is DATA, not code
Everything studyable lives under `public/content/` and is registered in `public/content/index.json`.
One bank per module at `modules/<id>.json`, holding all three tiers. Primers are markdown under
`lessons/<module>/`. A module without a `bank` renders as "soon".

**Every question needs:** `id`, `tier`, `prompt`, `answer` (the ~60-second spoken answer).
**Walkthrough questions also need `keyPoints`** — 3–5 things an interviewer is listening for. These
drive the self-grade, so they must be things you can hear yourself say, not a summary. Add
`deepDive` for the follow-up, and `check` (mcq/numeric) when an answer is objectively gradeable.

## Content sources
`~/Library/CloudStorage/OneDrive-LondonSchoolofEconomics/Employment/Prep/`: the BIWS *400 Questions*
guide (2025), the Wall Street Prep *Red Book*, and a restructuring Q&A.

These are **copyrighted commercial guides and this site is public**. Synthesise and rewrite in our
own words with our own numbers — never paste. Merging the two guides is also better pedagogy: the
Red Book gives the layered follow-ups, the 400 Questions guide the tighter phrasing.

## Deploy
Dev branch `ib-prep`. Push to `main` → GitHub Actions → GitHub Pages → tewess.com. Pages Source must
stay "GitHub Actions". Custom domain via `public/CNAME`; DNS at Squarespace (apex A-records to
`185.199.108–111.153`, `www` CNAME → `jaesht.github.io`). iCloud email MX/TXT/DKIM must stay untouched.

## Conventions / gotchas
- Run `npm run build` before every commit; `tsc` is strict with `noUnusedLocals`/`noUnusedParameters`.
- Keep gating logic pure and in `curriculum.ts` so it stays testable.
- Don't hand-transcribe large content — script the conversions, then review.
