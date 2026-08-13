// One hook that assembles everything the ladder screens need: manifest + banks + user state.
// Views stay dumb; all the gating logic lives in curriculum.ts.

import { useEffect, useState } from 'preact/hooks';
import { loadAllBanks, loadIndex } from './content';
import {
  getAttempts,
  getProgress,
  getSrsMap,
  onRemoteApplied,
  type AttemptMap,
  type Progress,
  type SrsMap,
} from './db';
import { buildLadder, type ModuleState } from './curriculum';
import type { ContentIndex, QuestionBank } from './schema';

export interface LadderState {
  index: ContentIndex;
  banks: Record<string, QuestionBank>;
  modules: ModuleState[];
  attempts: AttemptMap;
  srs: SrsMap;
  progress: Progress;
}

export function useLadder(): { data: LadderState | null; error: boolean; reload: () => void } {
  const [data, setData] = useState<LadderState | null>(null);
  const [error, setError] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const index = await loadIndex();
        const [banks, attempts, srs, progress] = await Promise.all([
          loadAllBanks(index),
          getAttempts(),
          getSrsMap(),
          getProgress(),
        ]);
        if (!alive) return;
        setData({ index, banks, attempts, srs, progress, modules: buildLadder(index, banks, attempts, srs, progress) });
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [nonce]);

  // A sync that pulled something new from another device: pick it up without a page reload.
  useEffect(() => onRemoteApplied(() => setNonce((n) => n + 1)), []);

  return { data, error, reload: () => setNonce((n) => n + 1) };
}
