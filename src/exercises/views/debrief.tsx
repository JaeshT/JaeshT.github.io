// The debrief. Where the learning actually happens, so it gets more care than the exercise itself.
//
// Three rules, all inherited from the design debate:
//   - name the FIRST broken row, not the last. Downstream damage from one upstream slip is not
//     eight separate lessons.
//   - say what a 'consistent' verdict means in words, because "half marks" is otherwise baffling.
//   - show the lines that should NOT have moved, since over-editing is a real and invisible tell.

import { useEffect } from 'preact/hooks';
import type { Exercise } from '../lib/schema';
import { fmt, type GradeResult, type RowResult, type Verdict } from '../lib/grade';
import { recordAttempt, SOLVED_AT } from '../lib/progress';
import { variationOf } from '../lib/variant';

const VERDICT_LABEL: Record<Verdict, string> = {
  correct: 'Correct',
  consistent: 'Followed from your own number',
  missed: 'Missed',
  'false-positive': 'Should not have moved',
  wrong: 'Wrong',
  given: 'Given',
  computed: 'Calculated for you',
};

export function Debrief({
  ex, result, seconds, onExit, onRetry, onNewFigures,
}: {
  ex: Exercise;
  result: GradeResult;
  seconds: number;
  onExit: () => void;
  onRetry: () => void;
  /** Absent when there is nothing to vary. Present, it hands back a fresh set of figures. */
  onNewFigures?: () => void;
}) {
  const first = result.rows.find((r) => r.firstBreak);
  const wrongOnes = result.rows.filter(
    (r) => r.verdict !== 'correct' && r.verdict !== 'given' && r.verdict !== 'computed',
  );
  const mins = Math.floor(seconds / 60);
  const solved = result.score >= SOLVED_AT;
  const variation = variationOf(ex);
  const canVary = onNewFigures !== undefined && variation !== 'none';

  // Recorded here rather than in each of the six views: one call site cannot drift out of step with
  // the others, and this component already holds both the exercise and the score. Mounted once per
  // attempt, since a retry unmounts it.
  useEffect(() => { recordAttempt(ex.id, ex.variant ?? 0, result.score); }, []);

  return (
    <section class="wrap">
      <header class="ex-head">
        <button class="back" onClick={onExit}>‹ All exercises</button>
      </header>

      <div class={'score-card ' + band(result.score)}>
        <div class="score">{result.score}%</div>
        <div class="score-sub">
          {result.counts.correct} correct
          {result.counts.consistent > 0 && `, ${result.counts.consistent} half credit`}
          {result.counts.missed > 0 && `, ${result.counts.missed} missed`}
          {result.counts['false-positive'] > 0 && `, ${result.counts['false-positive']} over-edited`}
          {' · '}{mins > 0 ? `${mins}m ` : ''}{seconds % 60}s
        </div>
      </div>

      {first && (
        <div class="first-break">
          <div class="fb-head">Start here: {first.label}</div>
          <div class="fb-body">
            {first.verdict === 'missed'
              ? 'You left this line alone, and it moves.'
              : first.verdict === 'false-positive'
                ? 'You changed this line, and it does not move.'
                : `You put ${fmt(first.entered ?? 0)}, and it should be ${fmt(first.expected)}.`}
            {first.explain && <> {first.explain}</>}
          </div>
          <div class="fb-note">
            Everything below this line may have been thrown off by it, so fix this one first.
          </div>
        </div>
      )}

      {result.balance && (
        <div class={'balance-strip ' + (result.balance.balances && !result.balance.balancesAtWrongTotal ? 'ok' : 'off')}>
          {!result.balance.balances
            ? `Your balance sheet is out by ${fmt(result.balance.assets - result.balance.liabilitiesEquity)}.`
            : result.balance.balancesAtWrongTotal
              ? `Balances, but at ${fmt(result.balance.assets)} rather than ${fmt(result.balance.expectedTotal)}.`
              : `Your balance sheet balances at ${fmt(result.balance.assets)}.`}
        </div>
      )}

      {result.notes.map((n) => <p class="note" key={n}>{n}</p>)}

      {wrongOnes.length > 0 && (
        <>
          <h2>What to look at</h2>
          <div class="results">
            {wrongOnes.map((r) => <ResultRow key={r.rowId} r={r} />)}
          </div>
        </>
      )}

      <h2>Every line</h2>
      <div class="results all">
        {result.rows.map((r) => <ResultRow key={r.rowId} r={r} compact />)}
      </div>

      {result.skillOutcomes.length > 0 && (
        <>
          <h2>By sub-skill</h2>
          <p class="muted small">
            These are the units a spaced-repetition scheduler would consume. Nothing schedules them
            yet — they are here so you can see the seam.
          </p>
          <div class="skills">
            {result.skillOutcomes.map((s) => (
              <div class="skill" key={s.skill}>
                <code>{s.skill}</code>
                <span class={s.correct === s.total ? 'ok' : 'off'}>{s.correct}/{s.total}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div class="submit-bar">
        <button class="btn ghost" onClick={onExit}>Back</button>
        {solved && canVary
          ? <>
              <button class="btn ghost" onClick={onRetry}>Same again</button>
              <button class="btn primary" onClick={onNewFigures}>
                {variation === 'figures' ? 'Try with different figures' : 'Try in a different order'}
              </button>
            </>
          : <button class="btn primary" onClick={onRetry}>Try again</button>}
      </div>
      <p class="muted small">
        {ex.title}
        {ex.variant ? (variation === 'figures' ? ' · different figures from the original' : ' · reordered from the original') : ''}
      </p>
    </section>
  );
}

function ResultRow({ r, compact }: { r: RowResult; compact?: boolean }) {
  return (
    <div class={'res ' + r.verdict}>
      <div class="res-top">
        <span class="res-label">{r.label}</span>
        <span class="res-verdict">{VERDICT_LABEL[r.verdict]}</span>
      </div>
      {r.verdict === 'computed' ? (
        <div class="res-nums">model worked this out as <strong>{fmt(r.entered ?? 0)}</strong>{Math.abs((r.entered ?? 0) - r.expected) > 1e-6 && <> · a correct attempt lands on {fmt(r.expected)}</>}</div>
      ) : r.verdict !== 'given' && (
        <div class="res-nums">
          {r.verdict === 'missed'
            ? <>left alone · should be <strong>{fmt(r.expected)}</strong></>
            : r.verdict === 'false-positive'
              ? <>you put {fmt(r.entered ?? 0)} · it does not move</>
              : <>you put {fmt(r.entered ?? 0)} · answer <strong>{fmt(r.expected)}</strong></>}
        </div>
      )}
      {r.verdict === 'consistent' && (
        <div class="res-note">
          That is exactly what your own earlier numbers imply ({fmt(r.impliedByTheirs ?? 0)}), so the
          method was right and the input was not. Half credit.
        </div>
      )}
      {!compact && r.explain && <div class="res-explain">{r.explain}</div>}
    </div>
  );
}

function band(score: number): string {
  return score >= 90 ? 'great' : score >= 70 ? 'ok' : 'poor';
}
