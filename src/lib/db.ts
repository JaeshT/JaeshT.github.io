// IndexedDB persistence (via idb-keyval). Holds USER STATE only: SRS scheduling,
// progress, settings. Kept strictly separate from git-versioned content.
// Async + large quota — correct for hundreds of cards + attempt history (localStorage is not).

import { get, set, update, createStore } from 'idb-keyval';

const store = createStore('pe-prep-db', 'kv');

// ---- SRS scheduling state (SM-2), keyed by card id ----
export interface SrsState {
  ease: number; // ease factor, starts 2.5, floor 1.3
  interval: number; // days until next review
  reps: number; // consecutive successful reps
  due: number; // epoch ms when next due
  lastReview: number; // epoch ms
}

export type SrsMap = Record<string, SrsState>;

const SRS_KEY = 'srs';
const PROGRESS_KEY = 'progress';
const SETTINGS_KEY = 'settings';

export async function getSrsMap(): Promise<SrsMap> {
  return (await get<SrsMap>(SRS_KEY, store)) ?? {};
}

export async function setSrsState(cardId: string, state: SrsState): Promise<void> {
  await update<SrsMap>(
    SRS_KEY,
    (prev) => ({ ...(prev ?? {}), [cardId]: state }),
    store,
  );
}

// ---- Progress (lessons read, quiz attempts, questions graded, XP/streak) ----
export interface Progress {
  lessonsRead: string[];
  quizAttempts: { quizId: string; score: number; total: number; at: number }[];
  questionsGraded: Record<string, 'got-it' | 'review'>;
  xp: number;
  streak: { count: number; lastDay: string }; // lastDay = YYYY-MM-DD
}

const EMPTY_PROGRESS: Progress = {
  lessonsRead: [],
  quizAttempts: [],
  questionsGraded: {},
  xp: 0,
  streak: { count: 0, lastDay: '' },
};

export async function getProgress(): Promise<Progress> {
  return (await get<Progress>(PROGRESS_KEY, store)) ?? EMPTY_PROGRESS;
}

export async function updateProgress(fn: (p: Progress) => Progress): Promise<Progress> {
  let next = EMPTY_PROGRESS;
  await update<Progress>(
    PROGRESS_KEY,
    (prev) => {
      next = fn(prev ?? EMPTY_PROGRESS);
      return next;
    },
    store,
  );
  return next;
}

// ---- Settings ----
export interface Settings {
  theme: 'dark' | 'light';
  dailyNewCardLimit: number;
}

const DEFAULT_SETTINGS: Settings = { theme: 'dark', dailyNewCardLimit: 20 };

export async function getSettings(): Promise<Settings> {
  return (await get<Settings>(SETTINGS_KEY, store)) ?? DEFAULT_SETTINGS;
}

export async function setSettings(s: Settings): Promise<void> {
  await set(SETTINGS_KEY, s, store);
}

// ---- Export / Import (backup against iOS ~7-day cache eviction; Mac<->iPhone sync) ----
export async function exportAll(): Promise<string> {
  const [srs, progress, settings] = await Promise.all([
    get(SRS_KEY, store),
    get(PROGRESS_KEY, store),
    get(SETTINGS_KEY, store),
  ]);
  return JSON.stringify({ v: 1, srs, progress, settings }, null, 2);
}

export async function importAll(json: string): Promise<void> {
  const data = JSON.parse(json);
  if (data.srs) await set(SRS_KEY, data.srs, store);
  if (data.progress) await set(PROGRESS_KEY, data.progress, store);
  if (data.settings) await set(SETTINGS_KEY, data.settings, store);
}
