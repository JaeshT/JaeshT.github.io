// Bridge builder. Tap an item to bring it in, tap again to flip its sign, tap once more to send it
// back to the tray. No dragging: drag-and-drop on a phone with a thumb is miserable, and tapping
// grades identically.

import { useMemo, useState } from 'preact/hooks';
import type { BridgeExercise } from '../lib/schema';
import { fmt, gradeBridge, type BridgeAnswers, type GradeResult } from '../lib/grade';
import { seedOf, stableShuffle } from '../lib/shuffle';
import { Clock, useClock } from './clock';
import { Debrief } from './debrief';

type Pick = 'add' | 'subtract' | undefined;
const NEXT: Record<string, Pick> = { undefined: 'add', add: 'subtract', subtract: undefined };

export function Bridge({ ex, onExit, onNewFigures }: { ex: BridgeExercise; onExit: () => void; onNewFigures?: () => void }) {
  const [picks, setPicks] = useState<Record<string, Pick>>({});
  const [total, setTotal] = useState<string>('');
  const [result, setResult] = useState<GradeResult | null>(null);
  // Authored order groups items by answer. Shuffle so the tray does not give the key away.
  const items = useMemo(() => stableShuffle(ex.items, seedOf(ex)), [ex]);
  const limit = ex.presentation?.timerSeconds;
  const clock = useClock(limit, () => setResult((r) => r ?? gradeBridge(ex, { picks: picks as BridgeAnswers['picks'] })));

  // A running total of what the learner has actually assembled, so the bridge behaves like a
  // calculation rather than a checklist. It never says whether they are right.
  const running = useMemo(() => {
    let n = ex.startValue;
    for (const item of ex.items) {
      const p = picks[item.id];
      if (!p || item.amount === undefined) continue;
      n += p === 'add' ? item.amount : -item.amount;
    }
    return n;
  }, [picks, ex]);

  if (result) {
    return (
      <Debrief
        ex={ex} result={result} seconds={clock.elapsed}
        onExit={onExit} onNewFigures={onNewFigures}
        onRetry={() => { setResult(null); setPicks({}); setTotal(''); clock.reset(); }}
      />
    );
  }

  const chosen = ex.items.filter((i) => picks[i.id]);
  const hasAmounts = ex.items.some((i) => i.amount !== undefined);

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

      <div class="bridge-ends">
        <div><span class="muted small">{ex.startLabel}</span><strong>{fmt(ex.startValue)}</strong></div>
        <span class="arrow">→</span>
        <div><span class="muted small">{ex.targetLabel}</span><strong>{hasAmounts ? fmt(running) : '?'}</strong></div>
      </div>

      <p class="muted small">Tap once to add, again to subtract, again to put it back. Leave out anything that does not belong.</p>

      <div class="chips">
        {items.map((item) => {
          const p = picks[item.id];
          return (
            <button
              key={item.id}
              type="button"
              class={'chip' + (p ? ' on ' + p : '')}
              // Read the current pick from inside the updater, not from `p` in the render closure.
              // Two taps in quick succession both saw the same stale value and both set 'add', so
              // the cycle skipped subtract entirely.
              onClick={() => setPicks((s) => ({ ...s, [item.id]: NEXT[String(s[item.id])] }))}
            >
              <span class="chip-sign">{p === 'add' ? '+' : p === 'subtract' ? '−' : '·'}</span>
              <span class="chip-body">
                <span class="chip-label">{item.label}</span>
                {item.detail && <span class="chip-detail">{item.detail}</span>}
              </span>
              {item.amount !== undefined && <span class="chip-amt">{fmt(item.amount)}</span>}
            </button>
          );
        })}
      </div>

      {ex.requireTotal && (
        <div class="total-ask">
          <label>{ex.targetLabel}</label>
          <input
            class="cell"
            inputMode="decimal"
            placeholder="your answer"
            value={total}
            onInput={(e) => setTotal((e.target as HTMLInputElement).value)}
          />
        </div>
      )}

      <div class="submit-bar">
        <span class="muted">{chosen.length} item{chosen.length === 1 ? '' : 's'} in the bridge</span>
        <button
          class="btn primary"
          onClick={() => {
            const n = Number(total.replace(/,/g, ''));
            setResult(gradeBridge(ex, { picks: picks as BridgeAnswers['picks'], total: total === '' || Number.isNaN(n) ? undefined : n }));
          }}
        >
          Done
        </button>
      </div>
    </section>
  );
}
