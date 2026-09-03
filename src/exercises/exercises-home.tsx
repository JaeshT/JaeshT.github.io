// The exercise index: every format, every module, in one list.
//
// Built as a standalone testbed and moved in whole. Nothing under src/exercises/lib knows anything
// about the flashcard app — no ladder, no FSRS, no accounts — and that separation is worth keeping:
// the grading and the variant engine are the parts that must stay easy to reason about.
//
// Not yet reachable from the app. Nothing imports this, so it costs the live bundle nothing; wiring
// it to a route is a deliberate second step. The seams to the rest of tewess.com are two files:
// lib/progress.ts, which is the local-storage stand-in for the real store, and lib/fade.ts, which
// is where FSRS retention would decide how much of an exercise arrives pre-filled.

import { useState } from 'preact/hooks';
import './exercises.css';
import { EXERCISES, sorted } from './content';
import { KIND_LABEL, MODULE_LABEL, type Exercise, type Module } from './lib/schema';
import { allProgress, clearProgress, nextVariantFor } from './lib/progress';
import { variantOf, variationOf } from './lib/variant';
import { StatementGrid } from './views/grid';
import { TernaryBoard } from './views/board';
import { Bridge } from './views/bridge';
import { Numeric } from './views/numeric';
import { Bucketing } from './views/bucketing';
import { Ordering } from './views/ordering';

/** A one-line sense of how big the exercise is, in the terms each format is measured in. */
function sizeOf(e: Exercise): string {
  switch (e.kind) {
    case 'statement-grid': return `${e.rows.filter((r) => !r.computed).length} lines to check`;
    case 'ternary-board': return `${e.rows.length} calls`;
    case 'bridge': return `${e.items.length} items`;
    case 'numeric': return 'one number';
    case 'bucketing': return `${e.items.length} to sort`;
    case 'ordering': return `${e.items.length} to rank`;
  }
}

/** What a solved card offers next, in the words that are actually true of that format. */
function againLabel(e: Exercise): string {
  switch (variationOf(e)) {
    case 'figures': return 'Try with different figures';
    case 'order': return 'Try in a different order';
    default: return 'Try again';
  }
}

export function ExercisesHome() {
  // The exercise as AUTHORED, plus which attempt we are on. The variant is derived, never stored,
  // so there is exactly one definition of what attempt 3 of an exercise looks like.
  const [open, setOpen] = useState<{ base: Exercise; n: number } | null>(null);
  // Bumped on the way back, so the cards re-read what was just recorded.
  const [seen, setSeen] = useState(0);

  if (open) {
    const ex = variantOf(open.base, open.n);
    const close = () => { setOpen(null); setSeen((n) => n + 1); };
    const onNewFigures = () => setOpen((o) => (o ? { ...o, n: o.n + 1 } : o));
    // Keyed on the attempt: fresh figures must arrive with fresh state, not with the answers you
    // typed against the old ones.
    const k = `${open.base.id}#${open.n}`;
    switch (ex.kind) {
      case 'statement-grid': return <StatementGrid key={k} ex={ex} onExit={close} onNewFigures={onNewFigures} />;
      case 'ternary-board': return <TernaryBoard key={k} ex={ex} onExit={close} onNewFigures={onNewFigures} />;
      case 'bridge': return <Bridge key={k} ex={ex} onExit={close} onNewFigures={onNewFigures} />;
      case 'numeric': return <Numeric key={k} ex={ex} onExit={close} onNewFigures={onNewFigures} />;
      case 'bucketing': return <Bucketing key={k} ex={ex} onExit={close} onNewFigures={onNewFigures} />;
      case 'ordering': return <Ordering key={k} ex={ex} onExit={close} onNewFigures={onNewFigures} />;
    }
  }

  const modules = [...new Set(EXERCISES.map((e) => e.module))] as Module[];
  const progress = allProgress();
  const solvedCount = EXERCISES.filter((e) => (progress[e.id]?.solved.length ?? 0) > 0).length;

  return (
    <section class="wrap" key={seen}>
      <h1 class="home-title">Exercises</h1>
      <p class="muted">
        A testbed for the interactive formats. Grading, error carry-forward and the fade seam are
        real; scheduling and accounts are not here on purpose.
      </p>
      <p class="muted">
        Solve one and it comes back with different numbers. The answer key is rebuilt from the new
        figures rather than stored, so a second attempt is a fresh question rather than a memory test.
      </p>

      {modules.map((m) => (
        <div key={m}>
          <h2>{MODULE_LABEL[m]}</h2>
          <div class="cards">
            {sorted(EXERCISES.filter((e) => e.module === m)).map((e) => {
              const rec = progress[e.id];
              const solved = (rec?.solved.length ?? 0) > 0;
              return (
                <button
                  class={'card' + (solved ? ' solved' : '')}
                  key={e.id}
                  onClick={() => setOpen({ base: e, n: nextVariantFor(e) })}
                >
                  <div class="card-top">
                    <span class={'tier ' + e.tier}>{e.tier}</span>
                    <span class="kind">{KIND_LABEL[e.kind]}</span>
                    {solved && <span class="solved-tag">Solved · {rec!.best}%</span>}
                  </div>
                  <div class="card-title">{e.title}</div>
                  <div class="card-sub">
                    {sizeOf(e)}
                    {e.presentation?.timerSeconds ? ` · ${Math.round(e.presentation.timerSeconds / 60)} min limit` : ''}
                    {e.estSeconds ? ` · about ${Math.round(e.estSeconds / 60)} min` : ''}
                  </div>
                  {solved && <div class="card-again">{againLabel(e)} →</div>}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {solvedCount > 0 && (
        <p class="muted small reset-line">
          {solvedCount} of {EXERCISES.length} solved ·{' '}
          <button
            class="linkish"
            onClick={() => { if (confirm('Forget every score and go back to the authored figures?')) { clearProgress(); setSeen((n) => n + 1); } }}
          >
            reset progress
          </button>
        </p>
      )}
    </section>
  );
}
