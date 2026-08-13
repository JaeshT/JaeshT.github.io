// Accounts and cloud sync.
//
// The app stays local-first: IndexedDB is what the screens read and write, and nothing here is on
// the critical path of a drill. Signing in adds a copy in Firestore under your user id, merged
// both ways, so a second device picks up where the first left off and clearing the browser is no
// longer the end of your progress.
//
// One document per user, holding the whole snapshot. That is well inside the 1 MiB document limit
// for a few hundred questions, and it keeps writes to one per sync instead of one per card.

import {
  applySnapshot,
  getCloudMeta,
  onLocalWrite,
  setCloudMeta,
  snapshotAll,
  type Snapshot,
} from './db';
import { mergeSnapshots, stripUndefined, toSnapshot } from './merge';
import { cloudConfigured, firebase } from './firebase';

export { cloudConfigured };

export interface CloudUser {
  uid: string;
  name: string;
  email: string;
  photo: string;
}

export interface CloudState {
  /** unconfigured: no project behind this build. loading: waiting on the first auth answer. */
  phase: 'unconfigured' | 'loading' | 'signed-out' | 'signed-in';
  user: CloudUser | null;
  syncing: boolean;
  /** Local changes that have not reached the cloud yet. */
  pending: boolean;
  lastSync: number;
  error: string;
  /** A sign-in is in flight. */
  busy: boolean;
}

let state: CloudState = {
  phase: cloudConfigured ? 'loading' : 'unconfigured',
  user: null,
  syncing: false,
  pending: false,
  lastSync: 0,
  error: '',
  busy: false,
};

const listeners = new Set<(s: CloudState) => void>();

export function cloudState(): CloudState {
  return state;
}

export function subscribeCloud(fn: (s: CloudState) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function patch(next: Partial<CloudState>) {
  state = { ...state, ...next };
  for (const fn of listeners) fn(state);
}

// ---- Sync ----

const PUSH_DELAY = 4000; // let a burst of grading settle before writing
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let inFlight: Promise<void> | null = null;

async function docRef() {
  const { db } = await firebase();
  const { doc } = await import('firebase/firestore/lite');
  return doc(db, 'users', state.user!.uid);
}

/**
 * Pull, merge, push, and write the result back locally. Safe to call at any time: the merge is
 * order independent, so two devices syncing at once converge rather than overwrite.
 */
export async function sync(): Promise<void> {
  if (state.phase !== 'signed-in' || !state.user) return;
  if (inFlight) return inFlight;
  inFlight = (async () => {
    patch({ syncing: true, error: '' });
    try {
      const { getDoc, setDoc } = await import('firebase/firestore/lite');
      const ref = await docRef();
      const local = await snapshotAll();
      const snap = await getDoc(ref);
      const remote = snap.exists() ? toSnapshot(snap.data()) : null;
      const merged = remote ? mergeSnapshots(local, remote) : { ...local, updatedAt: Date.now() };

      await setDoc(ref, stripUndefined(merged));
      if (remote) await applySnapshot(merged);

      const at = Date.now();
      await setCloudMeta({ lastSync: at, pending: false, lastUid: state.user!.uid });
      patch({ syncing: false, pending: false, lastSync: at });
    } catch (e) {
      // Offline or rules failure. The local copy is untouched and still complete, so this is a
      // retry rather than a loss; the pending flag survives a relaunch.
      await setCloudMeta({ pending: true });
      patch({ syncing: false, pending: true, error: describe(e) });
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}

function schedulePush() {
  if (state.phase !== 'signed-in') return;
  patch({ pending: true });
  setCloudMeta({ pending: true });
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void sync();
  }, PUSH_DELAY);
}

/** First sync after signing in. A different account than last time replaces rather than merges. */
async function syncAfterSignIn(uid: string) {
  const meta = await getCloudMeta();
  if (meta.lastUid && meta.lastUid !== uid) {
    patch({ syncing: true });
    try {
      const { getDoc, setDoc } = await import('firebase/firestore/lite');
      const ref = await docRef();
      const snap = await getDoc(ref);
      const remote = snap.exists() ? toSnapshot(snap.data()) : null;
      // Whatever is on this device belongs to the account that was signed in before, and that
      // account pushed its changes on the way out. Merging it into a second account would be wrong.
      const next: Snapshot = remote ?? blankSnapshot();
      await applySnapshot(next);
      if (!remote) await setDoc(ref, stripUndefined(next));
      const at = Date.now();
      await setCloudMeta({ lastUid: uid, lastSync: at, pending: false });
      patch({ syncing: false, pending: false, lastSync: at });
      return;
    } catch (e) {
      patch({ syncing: false, error: describe(e) });
      return;
    }
  }
  await setCloudMeta({ lastUid: uid });
  await sync();
}

function blankSnapshot(): Snapshot {
  return {
    v: 2,
    updatedAt: Date.now(),
    srs: {},
    attempts: {},
    progress: {
      lessonsRead: [],
      stagesCleared: {},
      xp: 0,
      streak: { count: 0, lastDay: '' },
      unlockedEarly: [],
    },
    settings: { theme: 'dark', dailyNewLimit: 20, timerSeconds: 90 },
  };
}

// ---- Auth ----

export async function initCloud(): Promise<void> {
  if (!cloudConfigured) return;
  const meta = await getCloudMeta();
  patch({ lastSync: meta.lastSync ?? 0, pending: Boolean(meta.pending) });

  try {
    const { auth } = await firebase();
    const { onAuthStateChanged, getRedirectResult } = await import('firebase/auth');

    // Only relevant where the popup could not be used and we fell back to a redirect.
    getRedirectResult(auth).catch(() => {});

    onAuthStateChanged(auth, (u) => {
      if (!u) {
        patch({ phase: 'signed-out', user: null, busy: false });
        return;
      }
      patch({
        phase: 'signed-in',
        busy: false,
        user: {
          uid: u.uid,
          name: u.displayName ?? '',
          email: u.email ?? '',
          photo: u.photoURL ?? '',
        },
      });
      void syncAfterSignIn(u.uid);
    });
  } catch (e) {
    patch({ phase: 'signed-out', error: describe(e) });
    return;
  }

  onLocalWrite(schedulePush);

  window.addEventListener('online', () => {
    if (state.pending) void sync();
  });

  // Coming back to the app is the moment another device's work is most likely to be waiting.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || state.phase !== 'signed-in') return;
    if (state.pending || Date.now() - state.lastSync > 60_000) void sync();
  });
}

export async function signIn(): Promise<void> {
  if (!cloudConfigured) return;
  patch({ busy: true, error: '' });
  try {
    const { auth } = await firebase();
    const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      const code = (e as { code?: string }).code ?? '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        patch({ busy: false });
        return;
      }
      // Blocked popups and installed PWAs on iOS: a redirect is the way in.
      if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
        await signInWithRedirect(auth, provider);
        return;
      }
      throw e;
    }
  } catch (e) {
    patch({ busy: false, error: describe(e) });
  }
}

export async function signOut(): Promise<void> {
  if (!cloudConfigured) return;
  patch({ busy: true });
  try {
    // Push anything outstanding first, so the next account to sign in here cannot strand it.
    if (state.pending) await sync();
    if (pushTimer) {
      clearTimeout(pushTimer);
      pushTimer = null;
    }
    const { auth } = await firebase();
    const { signOut: fbSignOut } = await import('firebase/auth');
    await fbSignOut(auth);
    patch({ phase: 'signed-out', user: null, busy: false, pending: false });
  } catch (e) {
    patch({ busy: false, error: describe(e) });
  }
}

function describe(e: unknown): string {
  const code = (e as { code?: string }).code ?? '';
  if (code === 'auth/network-request-failed' || code === 'unavailable') {
    return 'No connection. Your work is saved on this device and will sync later.';
  }
  if (code === 'permission-denied') {
    return 'The server refused that write. If it keeps happening, check the Firestore rules.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'This domain is not on the authorised list for the Firebase project.';
  }
  const raw = code ? code.replace(/^auth\//, '').replace(/-/g, ' ') : '';
  const msg = raw || (e instanceof Error ? e.message : '') || 'Something went wrong.';
  return msg.charAt(0).toUpperCase() + msg.slice(1);
}

/** "just now", "4 min ago", "yesterday" for the account screen. */
export function agoLabel(at: number): string {
  if (!at) return 'never';
  const s = Math.round((Date.now() - at) / 1000);
  if (s < 45) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  if (s < 172800) return 'yesterday';
  return `${Math.round(s / 86400)} days ago`;
}
