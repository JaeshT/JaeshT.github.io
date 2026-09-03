// Rank items. Move up / move down buttons rather than drag handles: reordering by dragging on a
// touchscreen is fiddly and inaccurate, and the grading is identical either way.

import { useState } from 'preact/hooks';
import type { OrderingExercise } from '../lib/schema';
import { gradeOrdering, type GradeResult } from '../lib/grade';
import { seedOf, stableShuffle } from '../lib/shuffle';
import { Clock, useClock } from './clock';
import { Debrief } from './debrief';

export function Ordering({ ex, onExit, onNewFigures }: { ex: OrderingExercise; onExit: () => void; onNewFigures?: () => void }) {
  const [order, setOrder] = useState<string[]>(() => stableShuffle(ex.items.map((i) => i.id), seedOf(ex)));
  const [result, setResult] = useState<GradeResult | null>(null);
  const limit = ex.presentation?.timerSeconds;
  const clock = useClock(limit, () => setResult((r) => r ?? gradeOrdering(ex, { order })));

  if (result) {
    return (
      <Debrief ex={ex} result={result} seconds={clock.elapsed} onExit={onExit} onNewFigures={onNewFigures}
        onRetry={() => { setResult(null); setOrder(stableShuffle(ex.items.map((i) => i.id), seedOf(ex))); clock.reset(); }} />
    );
  }

  function move(idx: number, by: number) {
    setOrder((o) => {
      const next = [...o];
      const to = idx + by;
      if (to < 0 || to >= next.length) return o;
      [next[idx], next[to]] = [next[to], next[idx]];
      return next;
    });
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
      {ex.conventions && <ul class="conventions">{ex.conventions.map((c) => <li key={c}>{c}</li>)}</ul>}

      <div class="rank-edge">{ex.topLabel}</div>
      <div class="ranked">
        {order.map((id, idx) => {
          const item = ex.items.find((i) => i.id === id)!;
          return (
            <div class="rank-row" key={id}>
              <span class="rank-n">{idx + 1}</span>
              <span class="chip-body">
                <span class="chip-label">{item.label}</span>
                {item.detail && <span class="chip-detail">{item.detail}</span>}
              </span>
              <span class="rank-btns">
                <button type="button" disabled={idx === 0} onClick={() => move(idx, -1)} aria-label="Move up">↑</button>
                <button type="button" disabled={idx === order.length - 1} onClick={() => move(idx, 1)} aria-label="Move down">↓</button>
              </span>
            </div>
          );
        })}
      </div>
      <div class="rank-edge">{ex.bottomLabel}</div>

      <div class="submit-bar">
        <span class="muted small">Ties are fine: items of equal rank cost nothing either way.</span>
        <button class="btn primary" onClick={() => setResult(gradeOrdering(ex, { order }))}>Done</button>
      </div>
    </section>
  );
}
