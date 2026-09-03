// Sort items into buckets. Tap an item, tap a bucket. No dragging: on a phone, tap-then-tap beats
// drag-and-drop and grades identically.

import { useMemo, useState } from 'preact/hooks';
import type { BucketingExercise } from '../lib/schema';
import { gradeBucketing, type BucketAnswers, type GradeResult } from '../lib/grade';
import { seedOf, stableShuffle } from '../lib/shuffle';
import { Clock, useClock } from './clock';
import { Debrief } from './debrief';

export function Bucketing({ ex, onExit, onNewFigures }: { ex: BucketingExercise; onExit: () => void; onNewFigures?: () => void }) {
  const [placed, setPlaced] = useState<BucketAnswers>({});
  const [held, setHeld] = useState<string | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const limit = ex.presentation?.timerSeconds;
  const clock = useClock(limit, () => setResult((r) => r ?? gradeBucketing(ex, placed)));

  if (result) {
    return (
      <Debrief ex={ex} result={result} seconds={clock.elapsed} onExit={onExit} onNewFigures={onNewFigures}
        onRetry={() => { setResult(null); setPlaced({}); setHeld(null); clock.reset(); }} />
    );
  }

  // Authored order groups items by their bucket, which would hand over the answer.
  const shuffledItems = useMemo(() => stableShuffle(ex.items, seedOf(ex)), [ex]);
  const unplaced = shuffledItems.filter((i) => !placed[i.id]);

  function put(bucketId: string) {
    if (!held) return;
    setPlaced((p) => ({ ...p, [held]: bucketId }));
    setHeld(null);
  }

  return (
    <section class="wrap">
      <header class="ex-head">
        <button class="back" onClick={onExit}>‹ All exercises</button>
        <div class="ex-meta">
          <span class={'tier ' + ex.tier}>{ex.tier}</span>
          <Clock limit={limit} elapsed={clock.elapsed} />
        </div>
      </header>

      <h1>{ex.title}</h1>
      <p class="prompt">{ex.prompt}</p>
      {ex.scenario && <div class="scenario">{ex.scenario}</div>}
      {ex.conventions && <ul class="conventions">{ex.conventions.map((c) => <li key={c}>{c}</li>)}</ul>}

      {unplaced.length > 0 && (
        <>
          <h2>To sort</h2>
          <div class="chips">
            {unplaced.map((i) => (
              <button
                key={i.id}
                type="button"
                class={'chip' + (held === i.id ? ' held' : '')}
                onClick={() => setHeld((h) => (h === i.id ? null : i.id))}
              >
                <span class="chip-body">
                  <span class="chip-label">{i.label}</span>
                  {i.detail && <span class="chip-detail">{i.detail}</span>}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      <div class="buckets">
        {ex.buckets.map((b) => (
          <div class={'bucket' + (held ? ' armed' : '')} key={b.id} onClick={() => put(b.id)}>
            <div class="bucket-head">
              {b.label}
              {b.lenient && <span class="lenient-tag">either way is defensible</span>}
            </div>
            {ex.items.filter((i) => placed[i.id] === b.id).map((i) => (
              <button
                key={i.id}
                type="button"
                class="chip small"
                onClick={(e) => { e.stopPropagation(); setPlaced((p) => ({ ...p, [i.id]: undefined })); }}
              >
                <span class="chip-label">{i.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div class="submit-bar">
        <span class="muted">
          {held ? 'Now tap a bucket' : `${ex.items.length - unplaced.length} of ${ex.items.length} sorted`}
        </span>
        <button class="btn primary" onClick={() => setResult(gradeBucketing(ex, placed))}>Done</button>
      </div>
    </section>
  );
}
