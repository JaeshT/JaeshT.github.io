# PE Prep — Primaries & Co-investments study app

An installable, **fully-offline** study app (PWA) to prepare for a private equity
**Primaries & Co-investments** (LP / fund-investing) internship at Neuberger Berman.
Built to study on iPhone (with a Mac for hands-on Excel), even with no connectivity.

> Full design & curriculum: see the approved plan. Deep-research reports go in [`research/`](research/).

## Status

- **Phase 0 — offline shell: ✅ done.** Vite + Preact + TS, installable PWA, service-worker
  precaching, IndexedDB persistence, hash router, iOS install hint, update toast, GitHub Actions deploy.
- Phase 1–4 (flashcards/SRS, lessons, quizzes, interactive tools, simulator) are built on top once
  the deep-research content lands in `research/`.

## Develop

```bash
npm install
npm run dev        # local dev (service worker disabled in dev)
npm run build      # type-check + production build to dist/
npm run preview    # serve the built dist/ locally (test offline/PWA here)
node scripts/gen-icons.mjs   # regenerate the J-curve app icons
```

To test offline behavior: `npm run build && npm run preview`, open the URL, then go offline.

## Structure

```
src/
  app.tsx            app shell: hash router, tab bar, update toast, install hint
  main.tsx           entry
  sw.ts              service worker (Workbox injectManifest): precache + runtime caching
  lib/
    schema.ts        TypeScript types for all content (the content contract)
    content.ts       runtime loader for the content manifest + files
    db.ts            IndexedDB (idb-keyval): SRS state, progress, settings, export/import
    srs.ts           SM-2 spaced-repetition scheduling
    router.ts        tiny hash router
    pwa.ts           service-worker registration + iOS detection
public/
  manifest.webmanifest, CNAME, 404.html, icons/
  content/
    index.json       master manifest — lists every lesson/deck/quiz/glossary/excel item
    lessons/ flashcards/ questionbank/ quizzes/ glossary/ excel/
```

## Adding content

Content is **data, not code**. To add a study item: drop a file under `public/content/…`
and add one entry to `public/content/index.json`. Shapes are defined in `src/lib/schema.ts`.
User progress (IndexedDB) is kept separate from content (git) on purpose.

## Deploy (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and deploys `dist/`.
**One-time setup:** in the repo, Settings → Pages → *Build and deployment* → Source = **GitHub Actions**.
The custom domain (`tewess.com`) is preserved via `public/CNAME`. HTTPS must be enabled
(required for service workers).

## iPhone install & offline notes

- Open the site in Safari → Share → **Add to Home Screen** (iOS has no install prompt).
- **Open the app once on WiFi before travelling** — iOS evicts PWA caches after ~7 days unused.
- Use **More → Progress & backup → Export** to back up your progress and to sync Mac ↔ iPhone
  (there is no server; everything is local).
