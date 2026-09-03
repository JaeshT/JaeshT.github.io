// The full three-statement model.
//
// Three things make this behave like a model rather than a quiz:
//   1. the three statements sit side by side, the way you would lay them out on a desk, so you can
//      see a change ripple across them. On a phone they stack and you scroll.
//   2. the "after" column starts populated with the real opening numbers. You edit them, rather
//      than filling an empty sheet, which is what you actually do in Excel.
//   3. subtotals are the model's job. EBIT, net income, total assets and the rest recalculate as
//      you type and are read-only, so what is being tested is which lines move and by how much.
//
// Every displayed value comes from evaluate() in model.ts, which is the same call the grader makes.
// The number on screen and the number being marked cannot drift apart.

import { useMemo, useState } from 'preact/hooks';
import type { GridRow, StatementGridExercise, StatementId } from '../lib/schema';
import { STATEMENT_LABEL } from '../lib/schema';
import { resolvePrefill, scaffoldDefaults } from '../lib/fade';
import { evaluate, evaluateBase, type Inputs } from '../lib/model';
import { fmt, gradeGrid, type GradeResult } from '../lib/grade';
import { Clock, useClock } from './clock';
import { Debrief } from './debrief';

const STATEMENT_ORDER: StatementId[] = ['is', 'cfs', 'bs'];

export function StatementGrid({ ex, onExit, onNewFigures }: { ex: StatementGridExercise; onExit: () => void; onNewFigures?: () => void }) {
  const scaffold = { ...scaffoldDefaults(ex.tier), ...ex.presentation };
  const prefilled = useMemo(() => resolvePrefill(ex.rows, { tier: ex.tier }), [ex]);
  const base = useMemo(() => evaluateBase(ex), [ex]);

  // The after column starts as a copy of the opening model, so the learner edits real numbers.
  const [inputs, setInputs] = useState<Inputs>(() => {
    const seed: Inputs = {};
    for (const r of ex.rows) {
      if (r.computed) continue;
      seed[r.id] = prefilled.has(r.id) ? r.base + r.delta : r.base;
    }
    return seed;
  });

  const [result, setResult] = useState<GradeResult | null>(null);
  const live = useMemo(() => evaluate(ex, inputs), [ex, inputs]);
  const limit = scaffold.timerSeconds;
  const clock = useClock(limit, () => setResult((r) => r ?? gradeGrid(ex, inputs, prefilled)));

  function set(rowId: string, raw: string) {
    setInputs((a) => {
      const next = { ...a };
      const t = raw.trim();
      if (t === '') { next[rowId] = undefined; return next; }
      // Accept 1,234 and (50), because that is how these are written on paper.
      const n = Number(t.replace(/,/g, '').replace(/^\((.*)\)$/, '-$1'));
      if (!Number.isNaN(n)) next[rowId] = n;
      return next;
    });
  }

  function reset() {
    const seed: Inputs = {};
    for (const r of ex.rows) if (!r.computed) seed[r.id] = prefilled.has(r.id) ? r.base + r.delta : r.base;
    setInputs(seed);
    setResult(null);
    clock.reset();
  }

  const balance = useMemo(() => {
    if (!ex.balance) return null;
    const a = ex.balance.assets.reduce((n, id) => n + (live[id] ?? 0), 0);
    const le = ex.balance.liabilitiesEquity.reduce((n, id) => n + (live[id] ?? 0), 0);
    return { a, le, diff: a - le };
  }, [live, ex]);

  if (result) {
    return <Debrief ex={ex} result={result} seconds={clock.elapsed} onExit={onExit} onNewFigures={onNewFigures} onRetry={reset} />;
  }

  const changed = ex.rows.filter((r) => !r.computed && !prefilled.has(r.id) && (inputs[r.id] ?? r.base) !== r.base).length;

  return (
    <section class="wrap wide">
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

      <div class="statements">
        {STATEMENT_ORDER.map((sid) => {
          const rows = ex.rows.filter((r) => r.statement === sid);
          if (rows.length === 0) return null;
          return (
            <div class="statement" key={sid}>
              <table class="model">
                <thead>
                  <tr>
                    <th class="lbl">{STATEMENT_LABEL[sid]}</th>
                    {scaffold.showBase !== false && <th class="num">Before</th>}
                    <th class="num after">After</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const newSection = row.section && row.section !== (i > 0 ? rows[i - 1].section : undefined);
                    return (
                      <>
                        {newSection && (
                          <tr class="section" key={row.id + '-sec'}>
                            <td colSpan={scaffold.showBase !== false ? 3 : 2}>{row.section}</td>
                          </tr>
                        )}
                        <Row
                          key={row.id}
                          row={row}
                          showBase={scaffold.showBase !== false}
                          baseValue={base[row.id] ?? row.base}
                          liveValue={live[row.id] ?? row.base}
                          given={prefilled.has(row.id)}
                          onChange={(v) => set(row.id, v)}
                        />
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {balance && scaffold.liveBalanceCheck && (
        <div class={'balance-strip' + (Math.abs(balance.diff) < 1e-6 ? ' ok' : ' off')}>
          {Math.abs(balance.diff) < 1e-6
            ? `Balance sheet balances at ${fmt(balance.a)}`
            : `Balance sheet out by ${fmt(balance.diff)} — assets ${fmt(balance.a)} against ${fmt(balance.le)}`}
        </div>
      )}

      <div class="submit-bar">
        <span class="muted">{changed} line{changed === 1 ? '' : 's'} changed</span>
        <div class="bar-actions">
          <button class="btn ghost" onClick={reset}>Reset</button>
          <button class="btn primary" onClick={() => setResult(gradeGrid(ex, inputs, prefilled))}>Done</button>
        </div>
      </div>
    </section>
  );
}

function Row({
  row, showBase, baseValue, liveValue, given, onChange,
}: {
  row: GridRow;
  showBase: boolean;
  baseValue: number;
  liveValue: number;
  given: boolean;
  onChange: (v: string) => void;
}) {
  const moved = Math.abs(liveValue - baseValue) > 1e-6;
  const cls = ['row', row.emphasis ?? '', given ? 'given' : '', row.computed ? 'calc' : ''].filter(Boolean).join(' ');

  return (
    <tr class={cls}>
      <td class="lbl">
        {row.label}
        {given && <span class="given-tag">given</span>}
      </td>
      {showBase && <td class="num base">{fmt(baseValue)}</td>}
      <td class="num">
        {row.computed ? (
          // Read-only and recalculated as you type, the way a spreadsheet formula would be.
          <span class={'calc-cell' + (moved ? ' moved' : '')} title="Calculated for you">
            {fmt(liveValue)}
          </span>
        ) : (
          <input
            class={'cell' + (moved ? ' edited' : '')}
            inputMode="decimal"
            disabled={given}
            value={fmtInput(liveValue)}
            onFocus={(e) => (e.target as HTMLInputElement).select()}
            onInput={(e) => onChange((e.target as HTMLInputElement).value)}
          />
        )}
      </td>
    </tr>
  );
}

/** Editable cells show a plain signed number: brackets are for reading, not for typing into. */
function fmtInput(n: number): string {
  return String(Math.round(n * 100) / 100);
}
