# Accounts and sync

Sign in with Google, and your progress follows you to any device. Without it the app is still
fully usable, just tied to whichever browser you studied in.

## Why Firebase

The app is a static site on GitHub Pages with no server, and that is worth keeping. Firebase Auth
plus Firestore is the option that needs no server of our own: Google sign-in is one call, the
Firestore rules do the access control, and the free tier is far above what one person studying
for interviews will ever use. It also works the same on tewess.com as it does on localhost, so
going live is adding one domain to a list rather than moving anything.

## What is stored

One document per user at `users/{uid}`, holding the same four things IndexedDB holds: SRS
schedules, per question attempts, progress (XP, streak, stage clears) and settings. No question
text, no personal detail beyond the Google account you sign in with.

## How sync behaves

- **Local first.** Every screen reads and writes IndexedDB. Sync happens around that, so a drill
  never waits on the network and the app works offline exactly as before.
- **Merge, not overwrite.** Each sync pulls the cloud document, merges it with the local one and
  writes the result to both. Counters take the max, lists take the union, stage clears keep the
  earliest date, and card schedules keep the later review. Two devices converge instead of one
  winning.
- **Push is debounced** by four seconds, so a run of graded cards is one write rather than twenty.
- **A failed sync is not a loss.** The local copy is always complete. The pending flag is stored,
  so a failed push retries when you come back online, when you reopen the app, or when you press
  Sync now.
- **First sign-in merges** what is already on the device into the account, so nothing you did
  before signing in is thrown away.
- **Signing in as a different account replaces** the local copy with that account's data rather
  than mixing the two. Sign out pushes anything outstanding first, so the account you leave is
  complete before the next one arrives.

## Current state

Steps 1 to 7 below are **done**, on project **`ib-tech-b24eb`** ("IB tech", Spark plan): web app
registered, Google provider enabled, Firestore created in `europe-west2` (London), the rules
below published, and `tewess.com` authorised alongside `localhost`. `.env.local` holds the config
for local development. Verified by signing in and watching a drill answer reach `users/{uid}`.

**Step 8 is outstanding.** The deployed site has no config until the repository variables exist,
so a deploy today would build without sign-in. Everything else is ready.

## Turning it on

Fifteen minutes, once.

1. **Create the project.** https://console.firebase.google.com > Add project. Analytics is not
   needed.
2. **Add a web app.** Project settings > Your apps > Web (`</>`). Skip hosting. Copy the config
   object it shows you.
3. **Enable Google sign-in.** Build > Authentication > Get started > Sign-in method > Google >
   Enable. Set the support email, then Save.
4. **Create the database.** Build > Firestore Database > Create database > production mode. Pick
   the region closest to you (`europe-west2` for London).
5. **Paste the rules.** Firestore > Rules tab: replace what is there with the contents of
   `firestore.rules` in this repo, then Publish. This is what stops one account reading another.
6. **Authorise the domains.** Authentication > Settings > Authorised domains. `localhost` is there
   already. Add `tewess.com`, and `www.tewess.com` if you use it. Sign-in fails with an
   unauthorised domain error until you do.
7. **Local development.** Copy `.env.example` to `.env.local` and fill in the values from step 2.
   Restart `npm run dev`, since Vite reads env files at startup.
8. **The deployed site.** GitHub repo > Settings > Secrets and variables > Actions > Variables >
   New repository variable, one per line in `.env.example`. The deploy workflow passes them to the
   build. Push to `main` and the next deploy has sign-in.

With no values set, the build has no sign-in button and the app is local only. That is a supported
way to run it, not a broken state.

## About the keys

The Firebase web config is public. It ships inside the JavaScript bundle of every Firebase web app
ever built, and Google documents it as identifying rather than authenticating the project. What
protects the data is the rules in step 5 and the domain list in step 6. Repository variables are
used to keep the values out of the source, not because exposure would be a breach.

## Cost

The free tier allows 50,000 document reads and 20,000 writes a day. One person studying produces a
few hundred writes a day at most, so this stays free. No card is needed for the free plan.

## If sign-in fails

- `unauthorized-domain`: the domain is missing from step 6.
- `popup-blocked`: the app retries with a redirect on its own. Nothing to do.
- `api key not valid`: the env values did not reach the build. Locally, restart the dev server.
- `permission-denied` on sync: the rules from step 5 were not published.

Sign-in uses a popup and only falls back to a redirect if the popup is blocked. That order is
deliberate: the redirect flow hands off to `<project>.firebaseapp.com`, which browsers phasing out
third-party cookies can break for a site on its own domain. If the redirect path ever does start
failing on tewess.com, the fix Google documents is to serve the auth helper from a subdomain of
tewess.com rather than from firebaseapp.com.
