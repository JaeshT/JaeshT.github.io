// IndexedDB persistence (via idb-keyval). Holds USER STATE only: SRS scheduling,
// per-question attempt history, progress, settings. Kept strictly separate from git-versioned content.
// Async + large quota: correct for hundreds of questions + attempt history (localStorage is not).

import { get, set, update, createStore } from 'idb-keyval';
import type { AvatarConfig } from './avatar';

const store = createStore('ib-prep-db', 'kv');

// ---- SRS scheduling state (SM-2), keyed by question id ----
export interface SrsState {
  ease: number; // ease factor, starts 2.5, floor 1.3
  interval: number; // days until next review
  reps: number; // consecutive successful reps
  due: number; // epoch ms when next due
  lastReview: number; // epoch ms
}

export type SrsMap = Record<string, SrsState>;

/**
 * What happened the last time this question came up.
 *   hits/misses: how often you nailed it vs. missed it
 *   confident: you said "I know this" BEFORE seeing the answer
 * A question you were confident about and then missed is the highest-value thing to restudy;
 * that combination is what the Danger Zone surfaces.
 */
export interface Attempt {
  hits: number;
  misses: number;
  confident: boolean;
  burned: boolean; // was confident, then missed — sticky until you nail it again
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
}

export async function getAttempts(): Promise<AttemptMap> {
  return (await get<AttemptMap>(ATTEMPTS_KEY, store)) ?? {};
}

export const EMPTY_ATTEMPT: Attempt = { hits: 0, misses: 0, confident: false, burned: false, last: 0 };

/** Record one graded answer. `confident` is what you claimed before the reveal. */
export async function recordAttempt(
  questionId: string,
  hit: boolean,
  confident: boolean,
): Promise<AttemptMap> {
  let next: AttemptMap = {};
  await update<AttemptMap>(
    ATTEMPTS_KEY,
    (prev) => {
      const map = { ...(prev ?? {}) };
      const cur = map[questionId] ?? EMPTY_ATTEMPT;
      map[questionId] = {
        hits: cur.hits + (hit ? 1 : 0),
        misses: cur.misses + (hit ? 0 : 1),
        confident,
        burned: hit ? false : cur.burned || confident,
        last: Date.now(),
      };
      next = map;
      return map;
    },
    store,
  );
  return next;
}

// ---- Progress (lessons read, stage clears, XP/streak) ----
export interface Progress {
  lessonsRead: string[];
  /** Stage keys ("accounting:easy") you have cleared, with when. */
  stagesCleared: Record<string, number>;
  xp: number;
  streak: { count: number; lastDay: string }; // lastDay = YYYY-MM-DD
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
  return next;
}

// ---- Settings ----
export interface Settings {
  theme: 'dark' | 'light';
  dailyNewLimit: number;
  timerSeconds: number; // out-loud answer timer; 0 = off
  avatar?: AvatarConfig; // chosen appearance; gear is earned by rank, not stored here
}

const DEFAULT_SETTINGS: Settings = { theme: 'dark', dailyNewLimit: 20, timerSeconds: 90 };

export async function getSettings(): Promise<Settings> {
  const s = await get<Settings>(SETTINGS_KEY, store);
  return s ? { ...DEFAULT_SETTINGS, ...s } : DEFAULT_SETTINGS;
}

export async function setSettings(s: Settings): Promise<void> {
  await set(SETTINGS_KEY, s, store);
}

// ---- Export / Import (backup against iOS ~7-day cache eviction; Mac<->iPhone sync) ----
export async function exportAll(): Promise<string> {
  const [srs, attempts, progress, settings] = await Promise.all([
    get(SRS_KEY, store),
    get(ATTEMPTS_KEY, store),
    get(PROGRESS_KEY, store),
    get(SETTINGS_KEY, store),
  ]);
  return JSON.stringify({ v: 2, srs, attempts, progress, settings }, null, 2);
}

export async function importAll(json: string): Promise<void> {
  const data = JSON.parse(json);
  if (data.srs) await set(SRS_KEY, data.srs, store);
  if (data.attempts) await set(ATTEMPTS_KEY, data.attempts, store);
  if (data.progress) await set(PROGRESS_KEY, data.progress, store);
  if (data.settings) await set(SETTINGS_KEY, data.settings, store);
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
