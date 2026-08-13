# IB Technicals — interview prep app

An installable, **fully-offline** study app (PWA) for **investment banking technical interviews**.
Built to study on an iPhone, on the tube, with no connectivity. Live at **https://tewess.com**.

Not a flashcard app. Questions are organised as a **ladder** you climb: every module has an
**easy / medium / hard** tier, and you clear one to open the next. Each question makes you commit
("I know this" / "Not sure") *before* the reveal, then self-grade against the must-hit points an
interviewer is actually listening for. Claim you know one and then miss it and it lands in the
**Danger Zone** — the list worth studying above all others.

## Develop

```bash
npm install
npm run dev        # local dev at :5173 (service worker disabled in dev)
npm run build      # tsc -b && vite build  — run before every commit
npm run preview    # serve the built app at :4173 (test offline/PWA here)
```

**Node 20+.** CI uses Node 20. On Node 18 the service-worker build step needs
`NODE_OPTIONS=--experimental-global-webcrypto`.

## Layout

```
public/content/          all study material — data, not code
  index.json             the curriculum manifest: every module, in ladder order
  modules/<id>.json      one question bank per module (all three tiers in one file)
  lessons/<id>/*.md      primers (markdown + KaTeX)
  glossary/*.json        merged, de-duplicated across files
src/lib/                 schema, content loaders, curriculum gating, SRS, IndexedDB, markdown
src/lib/cloud.ts         optional Google sign-in and Firestore sync (see ACCOUNTS.md)
src/views/               path (ladder), drill (the study loop), lesson, glossary, offline
```

Content is git-versioned and cached. **User state lives in IndexedDB on the device.** Signing in
adds a synced copy under your account so a second device picks up where the first left off; with
no Firebase config in the build there is no sign-in and nothing leaves the device either way.
Export/import from Progress works in both cases. Setup: [`ACCOUNTS.md`](ACCOUNTS.md).

## Adding content

Drop a bank at `public/content/modules/<id>.json` and point the module's `bank` field at it in
`index.json`. Shapes are in [`src/lib/schema.ts`](src/lib/schema.ts). A module with no `bank` shows
on the ladder as "soon" and gates nothing.

## Deploy

Push to `main` → GitHub Actions builds and deploys to GitHub Pages → tewess.com. Development happens
on `ib-prep`; see [`IB-PIVOT.md`](IB-PIVOT.md) for where the rebuild stands.
