# CLAUDE.md — project memory for Claude Code

> Read this first. It's the working context for the PE Prep study app so you can continue the
> project immediately. The full conversation that built this isn't here — this file is the handoff.

## What this is
An installable, **fully-offline PWA** to prep for a Private Equity **Primaries & Co-investments**
(LP / fund-investing) internship at **Neuberger Berman**. Studied on iPhone (installed to home
screen), with a Mac for hands-on Excel. Live at **https://tewess.com**.

Stack: **Vite + Preact + TypeScript**, service worker (Workbox `injectManifest`), IndexedDB
(`idb-keyval`), tiny hash router. No backend — all user state is local.

## Commands
```bash
npm install
npm run dev        # local dev at :5173 (service worker OFF in dev)
npm run build      # tsc -b && vite build  (ALWAYS run before committing/deploying)
npm run preview    # serve built dist/ at :4173 (test offline/PWA here)
```

## Architecture / key files
- `src/app.tsx` — shell: hash router (`Router`), tab bar, Home dashboard (mastery bars + achievement
  badges), Progress/backup, offline indicator.
- `src/lib/router.ts` — hash router; paths are slash-delimited (`lesson/<id>`, `tools/waterfall`).
- `src/lib/schema.ts` — **the content contract.** All content shapes live here.
- `src/lib/content.ts` — runtime loaders (fetch from `/content/…`, cached by the SW).
- `src/lib/md.ts` — markdown + KaTeX renderer. **Important:** it auto-disambiguates `$` as
  currency vs. real math vs. code, so content authors write `$100M` currency naturally and
  `$\frac{c}{1-c}P$` math naturally. Don't "fix" currency in content — the renderer handles it.
- `src/lib/db.ts` — IndexedDB: SRS state, progress (lessonsRead, quizAttempts, xp, streak),
  settings, offline-status, export/import. `recordStudy(xp)` rolls streak + XP.
- `src/lib/srs.ts` — SM-2 spaced repetition.
- `src/lib/mastery.ts` — per-domain mastery % + achievements (pure, over index+srs+progress).
- `src/lib/waterfall.ts`, `src/lib/metrics.ts` — **pure calculator engines**, verified against the
  research worked examples. Any new tool engine goes here and must be verified the same way.
- `src/lib/offline.ts` — "Download for offline" (warms SW cache with every content file).
- `src/views/` — `learn.tsx` (lessons, quiz, interview drill, Mock Interview, shared bits),
  `cards.tsx` (deck list, SRS review, Browse grid), `glossary.tsx`, `tools.tsx` (Waterfall + PME
  calculators), `brief.tsx` (Market Briefing w/ scrollytelling), `offline.tsx`.

## Content is DATA, not code
Everything studyable lives under `public/content/` and is registered in
`public/content/index.json` (the manifest). To add content: drop files under `public/content/…`
and add manifest entries. Shapes are in `src/lib/schema.ts`.

**Manifest ID/path conventions** (keep deterministic):
- Per domain prefix: technicals=`tech`, pe-fundamentals=`pf`, fund-economics=`fe`,
  performance=`perf`, primaries=`prim`, co-investments=`coinv`, firm=`firm`, market=`market`.
- deck id `<prefix>-deck`, quiz `<prefix>-quiz`, interview set `<prefix>-interview`, lessons
  `<prefix>-<slug>`. Files: `lessons/<domain>/<slug>.md`, `flashcards/<domain>.json`,
  `quizzes/<domain>.json`, `questionbank/<domain>.json`, `glossary/<domain>.json`.
- Glossary: one file per domain, ALL listed in `index.json` `glossary.paths` (merged + de-duped).
- **Briefings** (`schema.ts` `Briefing`): narrative "read to absorb" content (stats board +
  markdown sections + talking points). Used for `market`. NO deck/quiz/SRS; excluded from mastery.

## The content pipeline (how domains get built)
Source material is in `research/` — deep-research reports `Q01`–`Q12` (see `research/README.md`).
Proven workflow:
1. Spawn a **Sonnet subagent per domain** with the exact schema + deterministic ids/paths; it reads
   one `research/Qxx…md` and writes the content files under `public/content/`. Tell it NOT to edit
   `index.json` or `src/`, and to output strictly valid JSON.
2. **You (Opus) integrate:** wire `index.json`, then verify before deploy:
   - every manifest ref resolves + ids unique,
   - each quiz question matches its type shape (mcq/numeric/free),
   - lessons render with **0 KaTeX warnings** (bundle `md.ts` with esbuild and render each lesson),
   - `npm run build` is green.

## Status — what's DONE vs LEFT
Content domains LIVE (lessons + flashcards + quiz + interview Q&A + glossary): **Q01 technicals,
Q02 pe-fundamentals, Q03 fund-economics, Q04 performance, Q05 primaries, Q07 co-investments,
Q12 firm/behavioral.** **Q11 market** is live as a **Briefing** (no deck/quiz, by design).

Interactive tools LIVE: **Distribution Waterfall** (`tools/waterfall`) and **IRR/MOIC/TVPI/KS-PME**
(`tools/pme`). Engines verified vs. research numbers.

REMAINING research reports to integrate (all in `research/`):
- **Q06 portfolio-construction-pacing** → build the **Takahashi–Alexander pacing simulator** (the
  equations are specified in the report; make a pure engine in `src/lib/`, verify, add to
  `tools.tsx` as `tools/pacing`) + content.
- **Q08 lbo-model-from-scratch** → **mini-LBO model** tool (`tools/lbo`) + content.
- **Q09 excel-mastery-mac** → content. NOTE: **keep it Windows-focused** — the user will use a
  Windows machine during the internship (deliberate; the filename says "mac" but ignore that).
- **Q10 fund-level-excel-models** → content (+ possibly ties into pacing/waterfall tools).
Engagement features already built: mastery bars, achievement badges, Mock Interview, quiz score
ring, flashcard Browse grid, and the Market Briefing scrollytelling (progress bar, count-up stats,
tappable glossary terms, tap-to-copy talking points, completion confetti).

## Deploy
- Dev branch: `claude/pe-internship-prep-program-DBiQz`. **Push to `main` → GitHub Actions
  (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages → tewess.com.**
- Flow: commit on branch → `git checkout main && git merge --ff-only <branch> && git push origin main`.
- GitHub Pages **Source must be "GitHub Actions"** (already set — do not switch to "branch").
- Custom domain `tewess.com` via `public/CNAME`; DNS is at **Squarespace** (apex A-records point to
  GitHub Pages `185.199.108–111.153`; `www` CNAME → `jaesht.github.io`). iCloud email MX/TXT/DKIM
  records must stay untouched.

## Offline
PWA precaches all content + KaTeX fonts on SW install. `registerType: 'prompt'` → a "New version —
Reload" toast on update. The **Download for offline** button (Home + Progress) re-warms the cache;
iOS evicts caches after ~7 days unused, so re-tap to re-arm. Test offline via
`npm run build && npm run preview`, then go offline.

## Conventions / gotchas
- Run `npm run build` before every commit; keep the tree type-clean (no unused vars — `tsc` is strict).
- Don't hand-transcribe large content by hand — use the subagent pipeline.
- Tool engines: pure functions, verified against the research's worked examples, before any UI.
- Currency vs math in markdown is handled centrally in `md.ts` — never escape currency in content.
