// The direction board: the fast format. Mark which way each line moves, nothing else.
//
// This is the easy-tier counterpart to the full grid, not a replacement for it. It tests the same
// cascade reasoning with a fraction of the typing, which is what makes it survive a phone.

import { useState } from 'preact/hooks';
import type { Direction, TernaryBoardExercise } from '../lib/schema';
import { gradeTernary, type GradeResult, type TernaryAnswers } from '../lib/grade';
import { Clock, useClock } from './clock';
import { Debrief } from './debrief';

const CHOICES: { key: Direction; label: string }[] = [
  { key: 'up', label: 'Up' },
  { key: 'down', label: 'Down' },
  { key: 'none', label: 'No change' },
];

export function TernaryBoard({ ex, onExit, onNewFigures }: { ex: TernaryBoardExercise; onExit: () => void; onNewFigures?: () => void }) {
  const [answers, setAnswers] = useState<TernaryAnswers>({});
  const [result, setResult] = useState<GradeResult | null>(null);
  const limit = ex.presentation?.timerSeconds;
  const clock = useClock(limit, () => setResult((r) => r ?? gradeTernary(ex, answers)));

  if (result) {
    return (
      <Debrief
        ex={ex}
        result={result}
        seconds={clock.elapsed}
        onExit={onExit} onNewFigures={onNewFigures}
        onRetry={() => { setResult(null); setAnswers({}); clock.reset(); }}
      />
    );
  }

  const answered = Object.values(answers).filter((a) => a.direction).length;

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

      <div class="board">
        {ex.rows.map((row) => (
          <div class="board-row" key={row.id}>
            <div class="board-label">{row.label}</div>
            <div class="seg">
              {CHOICES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  class={'seg-btn' + (answers[row.id]?.direction === c.key ? ' on ' + c.key : '')}
                  onClick={() =>
                    setAnswers((a) => ({ ...a, [row.id]: { ...a[row.id], direction: c.key } }))
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
            {row.requireMagnitude && answers[row.id]?.direction && answers[row.id]?.direction !== 'none' && (
              <input
                class="cell mag"
                inputMode="decimal"
                placeholder="by how much?"
                value={answers[row.id]?.magnitude ?? ''}
                onInput={(e) => {
                  const n = Number((e.target as HTMLInputElement).value);
                  setAnswers((a) => ({ ...a, [row.id]: { ...a[row.id], magnitude: Number.isNaN(n) ? undefined : n } }));
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div class="submit-bar">
        <span class="muted">{answered} of {ex.rows.length} answered</span>
        <button class="btn primary" onClick={() => setResult(gradeTernary(ex, answers))}>Done</button>
      </div>
    </section>
  );
}
