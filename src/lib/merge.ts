// Merging two snapshots of the same account, one local and one from the cloud.
//
// Sync pushes whole snapshots rather than deltas, so the merge has to be safe to run in any order
// and any number of times: same inputs, same output, and never a step backwards. Counters take the
// max, sets take the union, and anything that is genuinely a "latest state" (an SRS schedule, a
// settings object) is resolved by whichever side wrote it last.
//
// The self-healing property that makes this enough without transactions: a device never drops its
// own local state, so if two devices push at once and one write lands on top of the other, the
// losing device restores the difference on its next push.

import type { Attempt, AttemptMap, Progress, Settings, Snapshot, SrsMap } from './db';
import type { SrsState } from './db';

export function mergeSnapshots(local: Snapshot, remote: Snapshot): Snapshot {
  return {
    v: 2,
    updatedAt: Date.now(),
    srs: mergeSrs(local.srs, remote.srs),
    attempts: mergeAttempts(local.attempts, remote.attempts),
    progress: mergeProgress(local.progress, remote.progress),
    settings: mergeSettings(local.settings, remote.settings),
  };
}

/** A card's schedule is a single state, so the later review wins outright. */
function mergeSrs(a: SrsMap, b: SrsMap): SrsMap {
  const out: SrsMap = { ...a };
  for (const [id, r] of Object.entries(b)) {
    const cur = out[id];
    out[id] = cur ? laterSrs(cur, r) : r;
  }
  return out;
}

function laterSrs(a: SrsState, b: SrsState): SrsState {
  if ((b.lastReview ?? 0) !== (a.lastReview ?? 0)) return (b.lastReview ?? 0) > (a.lastReview ?? 0) ? b : a;
  return (b.reps ?? 0) > (a.reps ?? 0) ? b : a;
}

/**
 * Attempt counts are tallies, so they take the max rather than the later value: answering the same
 * question on two devices should not lose one of the answers. The burned flag comes from whichever
 * side answered last, since it describes the most recent outcome.
 */
function mergeAttempts(a: AttemptMap, b: AttemptMap): AttemptMap {
  const out: AttemptMap = { ...a };
  for (const [id, r] of Object.entries(b)) {
    const cur = out[id];
    if (!cur) {
      out[id] = r;
      continue;
    }
    const later: Attempt = (r.last ?? 0) >= (cur.last ?? 0) ? r : cur;
    out[id] = {
      hits: Math.max(cur.hits, r.hits),
      misses: Math.max(cur.misses, r.misses),
      confident: later.confident,
      burned: later.burned,
      last: Math.max(cur.last ?? 0, r.last ?? 0),
    };
  }
  return out;
}

function mergeProgress(a: Progress, b: Progress): Progress {
  const stagesCleared: Record<string, number> = { ...a.stagesCleared };
  for (const [k, t] of Object.entries(b.stagesCleared ?? {})) {
    // Keep the earliest clear: that is when you actually earned it.
    stagesCleared[k] = stagesCleared[k] ? Math.min(stagesCleared[k], t) : t;
  }
  return {
    lessonsRead: union(a.lessonsRead, b.lessonsRead),
    stagesCleared,
    xp: Math.max(a.xp ?? 0, b.xp ?? 0),
    streak: laterStreak(a.streak, b.streak),
    introSeen: Boolean(a.introSeen || b.introSeen),
    unlockedEarly: union(a.unlockedEarly, b.unlockedEarly),
    climbSeen: Math.max(a.climbSeen ?? -1, b.climbSeen ?? -1),
  };
}

/** Streaks are dated, so the more recent day wins; on the same day keep the longer count. */
function laterStreak(a: Progress['streak'], b: Progress['streak']): Progress['streak'] {
  const ad = a?.lastDay ?? '';
  const bd = b?.lastDay ?? '';
  if (ad === bd) return { count: Math.max(a?.count ?? 0, b?.count ?? 0), lastDay: ad };
  return bd > ad ? b : a;
}

/** Settings are one object: merging fields across devices produces combinations nobody chose. */
function mergeSettings(a: Settings, b: Settings): Settings {
  return (b.updatedAt ?? 0) > (a.updatedAt ?? 0) ? b : a;
}

function union(a: string[] | undefined, b: string[] | undefined): string[] {
  return Array.from(new Set([...(a ?? []), ...(b ?? [])]));
}

/** Firestore rejects undefined, and our optional fields are full of it. */
export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) return value.map(stripUndefined) as unknown as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) out[k] = stripUndefined(v);
    }
    return out as T;
  }
  return value;
}

/** A cloud document is untrusted input: fill in anything missing rather than trusting the shape. */
export function toSnapshot(raw: unknown): Snapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Partial<Snapshot>;
  const progress = (d.progress ?? {}) as Partial<Progress>;
  return {
    v: 2,
    updatedAt: typeof d.updatedAt === 'number' ? d.updatedAt : 0,
    srs: (d.srs ?? {}) as SrsMap,
    attempts: (d.attempts ?? {}) as AttemptMap,
    progress: {
      lessonsRead: progress.lessonsRead ?? [],
      stagesCleared: progress.stagesCleared ?? {},
      xp: progress.xp ?? 0,
      streak: progress.streak ?? { count: 0, lastDay: '' },
      introSeen: progress.introSeen,
      unlockedEarly: progress.unlockedEarly ?? [],
      climbSeen: progress.climbSeen,
    },
    settings: (d.settings ?? {}) as Settings,
  };
}
