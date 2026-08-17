// IndexedDB persistence (via idb-keyval). Holds USER STATE only: SRS scheduling,
// per-question attempt history, progress, settings. Kept strictly separate from git-versioned content.
// Async + large quota: correct for hundreds of questions + attempt history (localStorage is not).

import { get, set, update, createStore } from 'idb-keyval';
import type { AvatarConfig } from './avatar';

const store = createStore('ib-prep-db', 'kv');

// ---- Change notifications ----
// Two separate channels, because they mean different things:
//   local writes  -> the cloud sync scheduler wants to know about every single one
//   remote applied -> a sync pulled something new, so open screens need to reload
// Firing one channel for both would make every graded card re-fetch the ladder mid-drill.
type Listener = () => void;
const localWriteListeners = new Set<Listener>();
const remoteAppliedListeners = new Set<Listener>();

function emitLocalWrite() {
  for (const fn of localWriteListeners) fn();
}

export function onLocalWrite(fn: Listener): () => void {
  localWriteListeners.add(fn);
  return () => localWriteListeners.delete(fn);
}

export function onRemoteApplied(fn: Listener): () => void {
  remoteAppliedListeners.add(fn);
  return () => remoteAppliedListeners.delete(fn);
}

// ---- SRS scheduling state (FSRS), keyed by question id ----
export interface SrsState {
  stability: number; // days for recall probability to fall to 90%
  difficulty: number; // 1 to 10, how hard this card is for you
  interval: number; // days scheduled at the last answer; 0 while relearning
  reps: number; // total answers
  lapses: number; // times an established card was forgotten
  due: number; // epoch ms when next due
  lastReview: number; // epoch ms
  // Written by the previous SM-2 scheduler. Present only on records not yet migrated;
  // srs.ts recognises them by the missing stability and restarts the card. See migrateLegacy.
  phase?: 'learning' | 'review' | 'relearning';
  step?: number;
  ease?: number;
}

export type SrsMap = Record<string, SrsState>;

/**
 * What happened the last time this question came up.
 *   hits/misses: how often you nailed it vs. missed it
 *   burned: you had this one right before, and then lost it
 *
 * Burned is what the Danger Zone surfaces, because a question you used to know and no longer do
 * is worth more of your attention than one you have simply never learned.
 *
 * It used to mean "you claimed to know it before the reveal, and then missed it". That claim came
 * from a commit step the drill no longer has: every question now reveals and then grades, the same
 * way in every section. Losing something you previously had is the honest surviving version of the
 * same signal, and it costs no extra tap to collect.
 */
export interface Attempt {
  hits: number;
  misses: number;
  /** Vestigial: the old pre-reveal claim. Kept so existing records and syncs stay readable. */
  confident: boolean;
  burned: boolean; // had it, then lost it. Sticky until you nail it again
  last: number; // epoch ms
}

export type AttemptMap = Record<string, Attempt>;

const SRS_KEY = 'srs';
const ATTEMPTS_KEY = 'attempts';
const PROGRESS_KEY = 'progress';
const SETTINGS_KEY = 'settings';

export async function getSrsMap(): Promise<SrsMap> {
  return (await get<SrsMap>(SRS_KEY, store)) ?? {};
}

export async function setSrsState(questionId: string, state: SrsState): Promise<void> {
  await update<SrsMap>(SRS_KEY, (prev) => ({ ...(prev ?? {}), [questionId]: state }), store);
  emitLocalWrite();
}

/**
 * One-off conversion of records written by the old SM-2 scheduler. Their ease and interval have no
 * honest translation into FSRS, so each card restarts as "met before, not solid yet" and comes back
 * straight away. Runs once: after this every record carries a stability and is left alone.
 */
export async function migrateSrsToFsrs(): Promise<number> {
  const { migrateLegacy } = await import('./srs');
  const map = await getSrsMap();
  const now = Date.now();
  let changed = 0;
  const next: SrsMap = {};
  for (const [id, state] of Object.entries(map)) {
    if (typeof state?.stability === 'number' && state.stability > 0) {
      next[id] = state;
      continue;
    }
    next[id] = migrateLegacy(state, now);
    changed++;
  }
  if (changed) {
    await set(SRS_KEY, next, store);
    emitLocalWrite();
  }
  return changed;
}

export async function getAttempts(): Promise<AttemptMap> {
  return (await get<AttemptMap>(ATTEMPTS_KEY, store)) ?? {};
}

export const EMPTY_ATTEMPT: Attempt = { hits: 0, misses: 0, confident: false, burned: false, last: 0 };

/** Record one graded answer. */
export async function recordAttempt(questionId: string, hit: boolean): Promise<AttemptMap> {
  let next: AttemptMap = {};
  await update<AttemptMap>(
    ATTEMPTS_KEY,
    (prev) => {
      const map = { ...(prev ?? {}) };
      const cur = map[questionId] ?? EMPTY_ATTEMPT;
      map[questionId] = {
        hits: cur.hits + (hit ? 1 : 0),
        misses: cur.misses + (hit ? 0 : 1),
        confident: cur.confident,
        // Missing something you had right before is what burns it. Nailing it again puts it out.
        burned: hit ? false : cur.burned || cur.hits > 0,
        last: Date.now(),
      };
      next = map;
      return map;
    },
    store,
  );
  emitLocalWrite();
  return next;
}

// ---- Progress (lessons read, stage clears, XP/streak) ----
export interface Progress {
  lessonsRead: string[];
  /** Stage keys ("accounting:easy") you have cleared, with when. */
  stagesCleared: Record<string, number>;
  xp: number;
  streak: { count: number; lastDay: string }; // lastDay = YYYY-MM-DD
  /** The home explainer is shown once; after that it is behind the info button. */
  introSeen?: boolean;
  /** Stages you chose to open early rather than earn. Kept so the map can be honest about it. */
  unlockedEarly: string[];
  /** Highest island the climber has already been shown standing on, so hops animate once. */
  climbSeen?: number;
}

const EMPTY_PROGRESS: Progress = {
  lessonsRead: [],
  stagesCleared: {},
  xp: 0,
  streak: { count: 0, lastDay: '' },
  unlockedEarly: [],
};

export async function getProgress(): Promise<Progress> {
  const p = await get<Progress>(PROGRESS_KEY, store);
  return p ? { ...EMPTY_PROGRESS, ...p } : EMPTY_PROGRESS;
}

export async function updateProgress(fn: (p: Progress) => Progress): Promise<Progress> {
  let next = EMPTY_PROGRESS;
  await update<Progress>(
    PROGRESS_KEY,
    (prev) => {
      next = fn(prev ? { ...EMPTY_PROGRESS, ...prev } : EMPTY_PROGRESS);
      return next;
    },
    store,
  );
  emitLocalWrite();
  return next;
}

// ---- Settings ----
export interface Settings {
  /** 'system' follows the OS. Older records hold 'dark' or 'light', which stay valid. */
  theme: 'system' | 'dark' | 'light';
  dailyNewLimit: number;
  timerSeconds: number; // out-loud answer timer; 0 = off
  avatar?: AvatarConfig; // chosen appearance; gear is earned by rank, not stored here
  /** When these settings were last changed. Sync keeps whichever device edited them last. */
  updatedAt?: number;
}

const DEFAULT_SETTINGS: Settings = { theme: 'system', dailyNewLimit: 20, timerSeconds: 90 };

export async function getSettings(): Promise<Settings> {
  const s = await get<Settings>(SETTINGS_KEY, store);
  return s ? { ...DEFAULT_SETTINGS, ...s } : DEFAULT_SETTINGS;
}

export async function setSettings(s: Settings): Promise<void> {
  await set(SETTINGS_KEY, { ...s, updatedAt: Date.now() }, store);
  emitLocalWrite();
}

// ---- Snapshots: the whole of a user's state in one object ----
// Used by export/import, and by cloud sync as the unit that gets merged and pushed.
export interface Snapshot {
  v: 2;
  updatedAt: number;
  srs: SrsMap;
  attempts: AttemptMap;
  progress: Progress;
  settings: Settings;
}

export async function snapshotAll(): Promise<Snapshot> {
  const [srs, attempts, progress, settings] = await Promise.all([
    getSrsMap(),
    getAttempts(),
    getProgress(),
    getSettings(),
  ]);
  return { v: 2, updatedAt: Date.now(), srs, attempts, progress, settings };
}

/**
 * Write a snapshot that came from somewhere else (a sync, or an imported file) over the top of
 * local state. Returns whether anything actually changed, so callers can avoid pointless reloads.
 * Deliberately does NOT fire the local-write channel: that would bounce straight back to the cloud.
 */
/**
 * Order-independent comparison. A plain JSON.stringify would report a change whenever two objects
 * hold the same data with the keys in a different order, and a false "something changed" here
 * makes every open screen reload in the middle of a session.
 */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0));
    return '{' + entries.map(([k, v]) => JSON.stringify(k) + ':' + canonical(v)).join(',') + '}';
  }
  return JSON.stringify(value) ?? 'null';
}

export async function applySnapshot(next: Snapshot): Promise<boolean> {
  const current = await snapshotAll();
  const same =
    canonical(current.srs) === canonical(next.srs) &&
    canonical(current.attempts) === canonical(next.attempts) &&
    canonical(current.progress) === canonical(next.progress) &&
    canonical(current.settings) === canonical(next.settings);
  if (same) return false;
  await Promise.all([
    set(SRS_KEY, next.srs, store),
    set(ATTEMPTS_KEY, next.attempts, store),
    set(PROGRESS_KEY, next.progress, store),
    set(SETTINGS_KEY, next.settings, store),
  ]);
  for (const fn of remoteAppliedListeners) fn();
  return true;
}

// ---- Export / Import (backup against iOS ~7-day cache eviction; Mac<->iPhone sync) ----
export async function exportAll(): Promise<string> {
  return JSON.stringify(await snapshotAll(), null, 2);
}

export async function importAll(json: string): Promise<void> {
  const data = JSON.parse(json);
  if (data.srs) await set(SRS_KEY, data.srs, store);
  if (data.attempts) await set(ATTEMPTS_KEY, data.attempts, store);
  if (data.progress) await set(PROGRESS_KEY, data.progress, store);
  if (data.settings) await set(SETTINGS_KEY, data.settings, store);
  emitLocalWrite();
}

// ---- Cloud sync bookkeeping (which account this device last synced with, and when) ----
export interface CloudMeta {
  lastUid?: string;
  lastSync?: number;
  pending?: boolean; // local changes made since the last successful push
}
const CLOUD_KEY = 'cloudMeta';

export async function getCloudMeta(): Promise<CloudMeta> {
  return (await get<CloudMeta>(CLOUD_KEY, store)) ?? {};
}

export async function setCloudMeta(patch: Partial<CloudMeta>): Promise<CloudMeta> {
  let next: CloudMeta = {};
  await update<CloudMeta>(
    CLOUD_KEY,
    (prev) => {
      next = { ...(prev ?? {}), ...patch };
      return next;
    },
    store,
  );
  return next;
}

// ---- Offline-pack status (set by the "Download for offline" button) ----
export interface OfflineStatus {
  at: number; // epoch ms last downloaded
  count: number; // files cached
}
const OFFLINE_KEY = 'offlineReady';

export async function getOfflineStatus(): Promise<OfflineStatus | undefined> {
  return get<OfflineStatus>(OFFLINE_KEY, store);
}
export async function setOfflineStatus(s: OfflineStatus): Promise<void> {
  await set(OFFLINE_KEY, s, store);
}

// ---- Activity helpers (streak + XP), called on any study action ----
export function todayStr(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Award XP and roll the daily streak forward (consecutive days increment; a gap resets to 1). */
export async function recordStudy(xpGain = 0): Promise<Progress> {
  return updateProgress((p) => {
    const today = todayStr();
    let streak = p.streak;
    if (streak.lastDay !== today) {
      const yesterday = todayStr(new Date(Date.now() - 24 * 60 * 60 * 1000));
      streak = { count: streak.lastDay === yesterday ? streak.count + 1 : 1, lastDay: today };
    }
    return { ...p, xp: p.xp + xpGain, streak };
  });
}
