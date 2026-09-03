// One number. The format that cannot be eliminated your way to, which is why it carries the hard
// tiers: recognition is easier than production, and typing a number is production.

import { useState } from 'preact/hooks';
import type { NumericExercise } from '../lib/schema';
import { gradeNumeric, type GradeResult } from '../lib/grade';
import { Clock, useClock } from './clock';
import { Debrief } from './debrief';

export function Numeric({ ex, onExit, onNewFigures }: { ex: NumericExercise; onExit: () => void; onNewFigures?: () => void }) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<GradeResult | null>(null);
  const limit = ex.presentation?.timerSeconds;
  const clock = useClock(limit, () => setResult((r) => r ?? gradeNumeric(ex, { value: undefined })));

  if (result) {
    return (
      <Debrief
        ex={ex} result={result} seconds={clock.elapsed}
        onExit={onExit} onNewFigures={onNewFigures}
        onRetry={() => { setResult(null); setValue(''); clock.reset(); }}
      />
    );
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

      <table class="givens">
        <tbody>
          {ex.givens.map((g) => (
            <tr key={g.label}>
              <td class="lbl">{g.label}</td>
              <td class="num">{g.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div class="total-ask big">
        <label>{ex.question}</label>
        <input
          class="cell"
          inputMode="decimal"
          placeholder="your answer"
          value={value}
          onInput={(e) => setValue((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        />
        {ex.unit && <span class="unit">{ex.unit}</span>}
      </div>

      <div class="submit-bar">
        <span class="muted small">Work it out before you type.</span>
        <button class="btn primary" onClick={submit}>Done</button>
      </div>
    </section>
  );

  function submit() {
    const n = Number(value.replace(/,/g, '').replace(/^\((.*)\)$/, '-$1'));
    setResult(gradeNumeric(ex, { value: value === '' || Number.isNaN(n) ? undefined : n }));
  }
}
