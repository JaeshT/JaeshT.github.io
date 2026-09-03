// The exercise gate: nothing is "done" until this passes.
//
// Moved in from the ib-exercises testbed, where it was written. It sits beside verify.mjs rather
// than inside it because the two check different things and fail for different reasons: that one
// covers the flashcard app and its scheduler, this one covers the exercise engine and its content.
// verify.mjs runs this at the end, so the completion hook still covers both with one command.
//
// Content correctness is the whole ballgame here. A grid whose authored deltas do not balance, or
// whose derivations disagree with its own deltas, would mark a correct learner wrong — the one
// failure that destroys trust in every other verdict. So the checks below re-derive every exercise
// from its own declarations and refuse to accept the author's word for anything.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
const failed = [];

function check(name, fn) {
  try { fn(); process.stdout.write(`  ok   ${name}\n`); }
  catch (err) { failures++; failed.push(`${name}: ${err.message}`); process.stdout.write(`  FAIL ${name}\n         ${err.message}\n`); }
}
const assert = (c, m) => { if (!c) throw new Error(m); };
const near = (a, b) => Math.abs(a - b) < 1e-6;
const round2 = (n) => Math.round(n * 100) / 100;
const section = (t) => process.stdout.write(`\n${t}\n`);

// ---- types ----
section('types');
check('tsc has no errors', () => {
  try { execFileSync('npx', ['tsc', '-b', '--noEmit'], { cwd: ROOT, stdio: 'pipe' }); }
  catch (err) {
    const out = `${err.stdout ?? ''}${err.stderr ?? ''}`.trim();
    throw new Error(out.split('\n').slice(0, 10).join('\n         ') || 'tsc failed');
  }
});

// ---- bundle content + grader so we can execute them ----
const cacheDir = join(ROOT, 'node_modules', '.cache', 'verify-exercises');
if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });

let mod;
try {
  const esbuild = await import('esbuild');
  const entry = join(cacheDir, 'entry.ts');
  const { writeFileSync } = await import('node:fs');
  writeFileSync(entry, `
export { EXERCISES } from ${JSON.stringify(join(ROOT, 'src/exercises/content/index.ts'))};
export * from ${JSON.stringify(join(ROOT, 'src/exercises/lib/grade.ts'))};
export * from ${JSON.stringify(join(ROOT, 'src/exercises/lib/fade.ts'))};
export * from ${JSON.stringify(join(ROOT, 'src/exercises/lib/model.ts'))};
export * from ${JSON.stringify(join(ROOT, 'src/exercises/lib/shuffle.ts'))};
export * from ${JSON.stringify(join(ROOT, 'src/exercises/lib/vars.ts'))};
export * from ${JSON.stringify(join(ROOT, 'src/exercises/lib/variant.ts'))};
`);
  await esbuild.build({ entryPoints: [entry], outfile: join(cacheDir, 'bundle.mjs'), format: 'esm', bundle: true, logLevel: 'silent' });
  mod = await import(`${pathToFileURL(join(cacheDir, 'bundle.mjs')).href}?v=${Date.now()}`);
} catch (err) {
  failures++; failed.push(`could not load content: ${err.message}`);
  process.stdout.write(`  FAIL could not load content\n         ${err.message}\n`);
}

if (mod) {
  const { EXERCISES, gradeGrid, gradeTernary, gradeBridge, gradeNumeric, gradeBucketing, gradeOrdering, stableShuffle, resolvePrefill, evaluate, evaluateTruth, withShock,
          variantOf, variationOf, figureCount, normaliseVariant, defaultScope, scopeFor, bridgeTotal, evalExpr } = mod;
  const grids = EXERCISES.filter((e) => e.kind === 'statement-grid');
  const boards = EXERCISES.filter((e) => e.kind === 'ternary-board');
  const bridges = EXERCISES.filter((e) => e.kind === 'bridge');
  const buckets = EXERCISES.filter((e) => e.kind === 'bucketing');
  const orderings = EXERCISES.filter((e) => e.kind === 'ordering');
  const numerics = EXERCISES.filter((e) => e.kind === 'numeric');
  const withRows = EXERCISES.filter((e) => Array.isArray(e.rows));

  section('content integrity');

  check('exercise ids are unique', () => {
    const seen = new Set(); const dupes = [];
    for (const e of EXERCISES) { if (seen.has(e.id)) dupes.push(e.id); seen.add(e.id); }
    assert(dupes.length === 0, dupes.join(', '));
  });

  check('every exercise declares at least one sub-skill', () => {
    // Sub-skills are the unit a scheduler will consume. An exercise without them can never be
    // scheduled, so this is the seam being kept honest rather than a style rule.
    const bad = EXERCISES.filter((e) => !e.skills || e.skills.length === 0).map((e) => e.id);
    assert(bad.length === 0, bad.join(', '));
  });

  check('row ids are unique within each exercise', () => {
    const bad = [];
    for (const e of withRows) {
      const seen = new Set();
      for (const r of e.rows) { if (seen.has(r.id)) bad.push(`${e.id}/${r.id}`); seen.add(r.id); }
    }
    assert(bad.length === 0, bad.join(', '));
  });

  section('grids: the maths must hold');

  check('every declared derivation agrees with the authored deltas', () => {
    // The author states both the answer (base + delta) and how the row is derived. If those two
    // disagree, error carry-forward would mark a correct learner wrong. This is the check that
    // makes authoring safe.
    const bad = [];
    for (const e of grids) {
      const byId = new Map(e.rows.map((r) => [r.id, r]));
      for (const row of e.rows) {
        if (!row.derive) continue;
        let total = 0;
        for (const p of row.derive.parents) {
          const parent = byId.get(p.row);
          if (!parent) { bad.push(`${e.id}/${row.id}: unknown parent ${p.row}`); continue; }
          total += p.sign * (parent.base + parent.delta);
        }
        if (row.derive.times !== undefined) total *= row.derive.times;
        if (row.derive.offset !== undefined) total += row.derive.offset;
        const stated = row.base + row.delta;
        if (!near(total, stated)) bad.push(`${e.id}/${row.id}: derives to ${total} but is authored as ${stated}`);
      }
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('derivations also hold BEFORE the shock', () => {
    // The opening model has to be internally consistent too, or the "before" column is a fiction.
    const bad = [];
    for (const e of grids) {
      const byId = new Map(e.rows.map((r) => [r.id, r]));
      for (const row of e.rows) {
        if (!row.derive) continue;
        let total = 0;
        for (const p of row.derive.parents) total += p.sign * (byId.get(p.row)?.base ?? 0);
        if (row.derive.times !== undefined) total *= row.derive.times;
        if (row.derive.offset !== undefined) total += row.derive.offset;
        if (!near(total, row.base)) bad.push(`${e.id}/${row.id}: opening derives to ${total}, authored ${row.base}`);
      }
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('parents are declared above their children', () => {
    // Authored order is dependency order, which is what lets the grader name the FIRST broken row
    // without doing a topological sort at runtime.
    const bad = [];
    for (const e of grids) {
      const index = new Map(e.rows.map((r, i) => [r.id, i]));
      for (const row of e.rows) {
        for (const p of row.derive?.parents ?? []) {
          if ((index.get(p.row) ?? -1) > index.get(row.id)) bad.push(`${e.id}/${row.id} depends on ${p.row} below it`);
        }
      }
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('the balance sheet balances before AND after the shock', () => {
    const bad = [];
    for (const e of grids) {
      if (!e.balance) continue;
      const byId = new Map(e.rows.map((r) => [r.id, r]));
      const sum = (ids, after) => ids.reduce((n, id) => {
        const r = byId.get(id); if (!r) { bad.push(`${e.id}: unknown balance row ${id}`); return n; }
        return n + r.base + (after ? r.delta : 0);
      }, 0);
      if (!near(sum(e.balance.assets, false), sum(e.balance.liabilitiesEquity, false))) {
        bad.push(`${e.id}: opening balance sheet is out by ${sum(e.balance.assets, false) - sum(e.balance.liabilitiesEquity, false)}`);
      }
      if (!near(sum(e.balance.assets, true), sum(e.balance.liabilitiesEquity, true))) {
        bad.push(`${e.id}: post-shock balance sheet is out by ${sum(e.balance.assets, true) - sum(e.balance.liabilitiesEquity, true)}`);
      }
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('every grid has rows that must NOT move', () => {
    // Without unchanged rows there is nothing to punish over-editing, and the exercise degrades
    // into "change everything you can see".
    const bad = grids.filter((e) => e.rows.filter((r) => r.delta === 0).length < 3).map((e) => e.id);
    assert(bad.length === 0, `too few no-change rows: ${bad.join(', ')}`);
  });

  check('every row that moves explains itself somewhere', () => {
    const bad = [];
    for (const e of grids) {
      for (const r of e.rows) {
        if (r.delta !== 0 && !r.explain && !r.derive) bad.push(`${e.id}/${r.id}`);
      }
    }
    assert(bad.length === 0, `moving rows with no explanation and no derivation: ${bad.join(', ')}`);
  });

  section('the live model');

  check('every computed row declares how it is derived', () => {
    const bad = [];
    for (const e of grids) for (const r of e.rows) {
      if (r.computed && !r.derive) bad.push(`${e.id}/${r.id}`);
    }
    assert(bad.length === 0, `computed with nothing to compute from: ${bad.join(', ')}`);
  });

  check('a computed row never depends on a row below it', () => {
    // The model evaluates top to bottom in one pass. A backward reference would silently read zero.
    const bad = [];
    for (const e of grids) {
      const index = new Map(e.rows.map((r, i) => [r.id, i]));
      for (const r of e.rows) {
        if (!r.computed) continue;
        for (const p of r.derive.parents) {
          if (index.get(p.row) > index.get(r.id)) bad.push(`${e.id}/${r.id} <- ${p.row}`);
        }
      }
    }
    assert(bad.length === 0, bad.join(', '));
  });

  check('the opening model evaluates to the authored opening values', () => {
    // If a computed subtotal disagrees with its authored base, the "before" column is a fiction.
    const bad = [];
    for (const e of grids) {
      const live = evaluate(e, {});
      for (const r of e.rows) {
        if (!near(live[r.id], r.base)) bad.push(`${e.id}/${r.id}: model says ${live[r.id]}, authored ${r.base}`);
      }
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('a correct set of inputs drives every subtotal to its authored answer', () => {
    // The learner types only the input rows; everything else has to fall out. If it does not, the
    // model and the answer key disagree and somebody is going to be marked wrong unfairly.
    const bad = [];
    for (const e of grids) {
      const truth = evaluateTruth(e);
      for (const r of e.rows) {
        if (!near(truth[r.id], r.base + r.delta)) {
          bad.push(`${e.id}/${r.id}: model gives ${truth[r.id]}, answer key says ${r.base + r.delta}`);
        }
      }
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('computed rows are never scored', () => {
    for (const e of grids) {
      const answers = Object.fromEntries(e.rows.filter((r) => !r.computed).map((r) => [r.id, r.base + r.delta]));
      const res = gradeGrid(e, answers, new Set());
      const computedRows = e.rows.filter((r) => r.computed).length;
      assert(res.counts.computed === computedRows, `${e.id}: expected ${computedRows} computed, got ${res.counts.computed}`);
    }
  });

  section('the randomisation seam');

  check('every perShock coefficient agrees with the authored delta', () => {
    const bad = [];
    for (const e of grids) {
      if (!e.shock) continue;
      for (const r of e.rows) {
        if (r.perShock === undefined) continue;
        const implied = r.perShock * e.shock.value;
        if (!near(implied, r.delta)) bad.push(`${e.id}/${r.id}: ${r.perShock} x ${e.shock.value} = ${implied}, authored delta ${r.delta}`);
      }
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('every moving row in a shocked exercise scales with the shock', () => {
    // A moving row without a coefficient would stay frozen when the number is randomised later,
    // silently breaking the answer key. Catch it now, while it is one line to fix.
    const bad = [];
    for (const e of grids) {
      if (!e.shock) continue;
      for (const r of e.rows) {
        if (r.delta !== 0 && !r.computed && r.perShock === undefined) bad.push(`${e.id}/${r.id}`);
      }
    }
    assert(bad.length === 0, `moving rows with no perShock: ${bad.join(', ')}`);
  });

  check('re-drawing the shock keeps every exercise internally consistent', () => {
    // The actual proof that randomisation will work: run each exercise at every value in its
    // domain and check the balance sheet still balances and the model still agrees with the key.
    const bad = [];
    for (const e of grids) {
      if (!e.shock?.domain) continue;
      for (const v of e.shock.domain) {
        const shocked = withShock(e, v);
        const truth = evaluateTruth(shocked);
        for (const r of shocked.rows) {
          if (!near(truth[r.id], r.base + r.delta)) bad.push(`${e.id}@${v}/${r.id}`);
        }
        if (shocked.balance) {
          const a = shocked.balance.assets.reduce((n, id) => n + truth[id], 0);
          const le = shocked.balance.liabilitiesEquity.reduce((n, id) => n + truth[id], 0);
          if (!near(a, le)) bad.push(`${e.id}@${v}: out by ${a - le}`);
        }
      }
    }
    assert(bad.length === 0, `broken at other shock values: ${bad.slice(0, 6).join(', ')}`);
  });

  check('shock domains keep the tax effect a whole number', () => {
    const bad = [];
    for (const e of grids) {
      if (!e.shock?.domain) continue;
      for (const v of e.shock.domain) {
        const t = v * e.taxRate;
        if (Math.abs(t - Math.round(t)) > 1e-9) bad.push(`${e.id}: ${v} x ${e.taxRate} = ${t}`);
      }
    }
    assert(bad.length === 0, `awkward numbers a learner would have to do by hand: ${bad.join(', ')}`);
  });

  section('boards');

  check('every module has content at all three tiers once authored', () => {
    // A tier with nothing in it renders as a stage you can enter but never clear.
    const byModule = {};
    for (const e of EXERCISES) (byModule[e.module] ??= new Set()).add(e.tier);
    // A module with nothing in it is work not started, which is fine. A module with one or two
    // tiers is a half-built stage a learner can enter and never clear, which is not.
    const bad = Object.entries(byModule).filter(([, t]) => t.size > 0 && t.size < 3).map(([m, t]) => `${m} has only ${[...t].join('/')}`);
    assert(bad.length === 0, bad.join('; '));
  });

  check('boards have at least 8 rows including real no-change rows', () => {
    // Fewer than that and elimination pays: a learner can score well by spotting the pattern of the
    // format rather than knowing the accounting.
    const bad = [];
    for (const e of boards) {
      if (e.rows.length < 8) bad.push(`${e.id}: only ${e.rows.length} rows`);
      const still = e.rows.filter((r) => r.direction === 'none').length;
      if (still < 2) bad.push(`${e.id}: only ${still} no-change rows`);
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('a board cannot be gamed by answering the same thing everywhere', () => {
    // Its lesson is often that most lines stay put, which makes 'no change' down the whole list a
    // tempting strategy. It must score zero, and so must any other single-answer sweep.
    for (const e of boards) {
      for (const guess of ['none', 'up', 'down']) {
        const answers = Object.fromEntries(e.rows.map((r) => [r.id, { direction: guess }]));
        const res = gradeTernary(e, answers);
        assert(res.score === 0, `${e.id}: answering '${guess}' everywhere scored ${res.score}`);
      }
    }
  });

  check('boards do not give the answer away by grouping', () => {
    // Board rows keep their authored order, because they follow a real reading order down the
    // statements. That means a long run of rows sharing a direction leaks the key positionally:
    // a learner can score by spotting the shape of the list. Trays are shuffled instead; boards
    // have to be interleaved by the author.
    const bad = [];
    for (const e of boards) {
      let run = 1;
      for (let i = 1; i < e.rows.length; i++) {
        run = e.rows[i].direction === e.rows[i - 1].direction ? run + 1 : 1;
        if (run > 4) { bad.push(`${e.id}: ${run} rows in a row are all '${e.rows[i].direction}'`); break; }
      }
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('shuffled trays actually change the authored order', () => {
    // Guards the shuffle itself: a seed that happened to be identity would silently do nothing.
    const trays = [...bridges, ...buckets].filter((e) => (e.items?.length ?? 0) >= 5);
    const unchanged = trays.filter((e) => {
      const ids = e.items.map((i) => i.id);
      return stableShuffle(ids, e.id).join() === ids.join();
    }).map((e) => e.id);
    assert(unchanged.length === 0, `shuffle is a no-op for: ${unchanged.join(', ')}`);
  });

  check('every board row explains itself', () => {
    const bad = [];
    for (const e of boards) for (const r of e.rows) if (!r.explain) bad.push(`${e.id}/${r.id}`);
    assert(bad.length === 0, bad.join(', '));
  });

  section('grader behaviour');

  check('a perfect attempt scores 100 on every exercise', () => {
    // Dispatch on kind. This check originally assumed every non-grid exercise had `rows` and
    // graded it as a board, which threw the moment the bridge and numeric formats existed.
    for (const e of EXERCISES) {
      let res;
      if (e.kind === 'statement-grid') {
        const answers = Object.fromEntries(e.rows.filter((r) => !r.computed).map((r) => [r.id, r.base + r.delta]));
        res = gradeGrid(e, answers, new Set());
        assert(!res.balance || res.balance.balances, `${e.id}: perfect attempt does not balance`);
      } else if (e.kind === 'ternary-board') {
        res = gradeTernary(e, Object.fromEntries(e.rows.map((r) => [r.id, { direction: r.direction, magnitude: r.magnitude }])));
      } else if (e.kind === 'bridge') {
        const picks = {};
        for (const i of e.items) if (i.role !== 'out') picks[i.id] = i.role;
        res = gradeBridge(e, { picks, total: e.targetValue });
      } else if (e.kind === 'bucketing') {
        res = gradeBucketing(e, Object.fromEntries(e.items.map((i) => [i.id, i.bucket])));
      } else if (e.kind === 'ordering') {
        res = gradeOrdering(e, { order: [...e.items].sort((a, b) => a.rank - b.rank).map((i) => i.id) });
      } else {
        res = gradeNumeric(e, { value: e.answer });
      }
      assert(res.score === 100, `${e.id}: scored ${res.score}, counts ${JSON.stringify(res.counts)}`);
    }
  });

  check('touching nothing scores zero, not a pass mark', () => {
    // With subtotals calculated for you, most rows are "leave this alone". Scoring every row
    // equally would hand a learner who does nothing a comfortable pass.
    for (const e of grids) {
      const res = gradeGrid(e, {}, new Set());
      const shouldMove = e.rows.filter((r) => r.delta !== 0 && !r.computed).length;
      assert(res.counts.missed === shouldMove, `${e.id}: expected ${shouldMove} missed, got ${res.counts.missed}`);
      assert(res.counts['false-positive'] === 0, `${e.id}: doing nothing cannot be a false positive`);
      assert(res.score === 0, `${e.id}: doing nothing scored ${res.score}`);
    }
  });

  check('one spurious edit costs exactly one find', () => {
    for (const e of grids) {
      const perfect = Object.fromEntries(e.rows.filter((r) => !r.computed).map((r) => [r.id, r.base + r.delta]));
      const movers = e.rows.filter((r) => r.delta !== 0 && !r.computed).length;
      const still = e.rows.find((r) => r.delta === 0 && !r.computed);
      const res = gradeGrid(e, { ...perfect, [still.id]: still.base + 1 }, new Set());
      const expected = Math.round(((movers - 1) / movers) * 100);
      assert(res.score === expected, `${e.id}: expected ${expected}, got ${res.score}`);
    }
  });

  check('changing a line that should not move is caught', () => {
    for (const e of grids) {
      const still = e.rows.find((r) => r.delta === 0);
      const res = gradeGrid(e, { [still.id]: still.base + 1 }, new Set());
      const row = res.rows.find((r) => r.rowId === still.id);
      assert(row.verdict === 'false-positive', `${e.id}/${still.id}: got ${row.verdict}`);
    }
  });

  check('error carry-forward gives half credit on an input row', () => {
    // Subtotals are computed and never marked, so carry-forward now lives on input rows that
    // derive from others. Tax is the case that matters: get depreciation wrong, then work the tax
    // out correctly from your own pre-tax number, and the method deserves credit.
    const e = grids.find((g) => g.id === 'acc-grid-depreciation');
    const inputs = Object.fromEntries(e.rows.filter((r) => !r.computed).map((r) => [r.id, r.base + r.delta]));
    inputs['depreciation'] = -105;                 // half the shock: wrong
    const live = evaluate(e, { ...inputs, tax: undefined });
    inputs['tax'] = round2(-0.4 * live['pretax']); // but taxed correctly off their own pre-tax
    const res = gradeGrid(e, inputs, new Set());
    const tax = res.rows.find((r) => r.rowId === 'tax');
    assert(tax.verdict === 'consistent', `tax should be 'consistent', got '${tax.verdict}'`);
    assert(res.rows.find((r) => r.rowId === 'depreciation').verdict === 'wrong', 'the upstream slip should still be wrong');
  });

  check('submitting the untouched sheet scores zero', () => {
    // The after column arrives pre-filled, so "did nothing" sends a full set of values. It must
    // not earn credit for agreeing with itself.
    for (const e of grids) {
      const seeded = Object.fromEntries(e.rows.filter((r) => !r.computed).map((r) => [r.id, r.base]));
      const res = gradeGrid(e, seeded, new Set());
      assert(res.score === 0, `${e.id}: pressing Done immediately scored ${res.score}`);
      assert(res.counts.consistent === 0, `${e.id}: doing nothing earned ${res.counts.consistent} half credits`);
    }
  });

  check('only the earliest broken row is flagged as the first break', () => {
    const e = grids[0];
    const res = gradeGrid(e, {}, new Set());
    const flagged = res.rows.filter((r) => r.firstBreak);
    assert(flagged.length === 1, `expected exactly 1 first break, got ${flagged.length}`);
    const firstBad = res.rows.findIndex((r) => ['wrong', 'missed', 'false-positive'].includes(r.verdict));
    assert(res.rows[firstBad].firstBreak === true, 'the flag is not on the earliest broken row');
  });

  check('pre-filled rows are given, not scored', () => {
    const e = grids[0];
    const given = new Set([e.rows[0].id, e.rows[1].id]);
    const answers = Object.fromEntries(e.rows.map((r) => [r.id, r.base + r.delta]));
    const res = gradeGrid(e, answers, given);
    assert(res.counts.given === 2, `expected 2 given, got ${res.counts.given}`);
    assert(res.score === 100, 'giving rows away should not change a perfect score');
  });

  check('grading emits one outcome per sub-skill', () => {
    const e = grids[0];
    const answers = Object.fromEntries(e.rows.map((r) => [r.id, r.base + r.delta]));
    const res = gradeGrid(e, answers, new Set());
    assert(res.skillOutcomes.length > 0, 'no sub-skill outcomes emitted');
    for (const s of res.skillOutcomes) assert(s.total > 0 && s.correct <= s.total, `bad roll-up for ${s.skill}`);
  });

  check('contested board rows are excluded from the score', () => {
    const e = boards[0];
    const withContested = { ...e, rows: e.rows.map((r, i) => (i === 0 ? { ...r, contested: true } : r)) };
    const answers = Object.fromEntries(e.rows.map((r) => [r.id, { direction: r.direction, magnitude: r.magnitude }]));
    const res = gradeTernary(withContested, answers);
    assert(res.counts.given === 1, `expected the contested row to be given, counts ${JSON.stringify(res.counts)}`);
    assert(res.score === 100, 'excluding a contested row should not change a perfect score');
  });

  section('the fade seam');

  check('nothing reads prefillAt except fade.ts', () => {
    // The whole point of the seam: when adaptive fading is wired to retention data, exactly one
    // function changes. A view reading the authored field directly would silently bypass it.
    const offenders = [];
    const walk = (dir) => {
      for (const f of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, f.name);
        if (f.isDirectory()) { walk(p); continue; }
        if (!/\.(ts|tsx)$/.test(f.name)) continue;
        if (p.endsWith(join('lib', 'fade.ts')) || p.endsWith(join('lib', 'schema.ts'))) continue;
        // Strip comments first: a comment explaining the rule is not a breach of it.
        const code = readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
        if (code.includes('prefillAt')) offenders.push(p.replace(ROOT + '/', ''));
      }
    };
    walk(join(ROOT, 'src', 'exercises'));
    assert(offenders.length === 0, `read prefillAt directly instead of calling resolvePrefill(): ${offenders.join(', ')}`);
  });

  check('resolvePrefill honours its overrides', () => {
    const e = grids[0];
    assert(resolvePrefill(e.rows, { tier: e.tier, override: 'all' }).size === e.rows.length, 'override all failed');
    assert(resolvePrefill(e.rows, { tier: e.tier, override: 'none' }).size === 0, 'override none failed');
  });

  check('hard tier hands nothing over', () => {
    for (const e of grids.filter((g) => g.tier === 'hard')) {
      assert(resolvePrefill(e.rows, { tier: 'hard' }).size === 0, `${e.id} pre-fills rows at hard`);
    }
  });

  section('fidelity rises with tier');

  check('easy exercises carry no timer and no distractor framing', () => {
    for (const e of EXERCISES.filter((x) => x.tier === 'easy')) {
      assert(!e.presentation?.timerSeconds, `${e.id} puts a clock on an easy exercise`);
      assert(!e.presentation?.includeDistractors, `${e.id} adds distractors at easy`);
    }
  });

  check('hard exercises hide the opening values', () => {
    for (const e of EXERCISES.filter((x) => x.tier === 'hard')) {
      assert(e.presentation?.showBase === false, `${e.id} still shows opening values at hard`);
    }
  });

  section('bridges and numerics');

  check('every bridge carries traps', () => {
    // Knowing what does NOT belong is most of the skill. A bridge where every item belongs is a
    // checklist, not a test.
    const bad = bridges.filter((e) => e.items.filter((i) => i.role === 'out').length < 1).map((e) => e.id);
    assert(bad.length === 0, `no trap items: ${bad.join(', ')}`);
  });

  check('every bridge item explains itself', () => {
    const bad = [];
    for (const e of bridges) for (const i of e.items) if (!i.explain) bad.push(`${e.id}/${i.id}`);
    assert(bad.length === 0, bad.join(', '));
  });

  check('bridge item ids are unique', () => {
    const bad = [];
    for (const e of bridges) {
      const seen = new Set();
      for (const i of e.items) { if (seen.has(i.id)) bad.push(`${e.id}/${i.id}`); seen.add(i.id); }
    }
    assert(bad.length === 0, bad.join(', '));
  });

  check('a bridge that asks for a total actually adds up to it', () => {
    // If the authored amounts do not reach the authored answer, a learner who assembles it
    // perfectly is told they are wrong.
    const bad = [];
    for (const e of bridges) {
      if (!e.requireTotal) continue;
      let n = e.startValue;
      for (const i of e.items) {
        if (i.role === 'add') n += i.amount ?? 0;
        if (i.role === 'subtract') n -= i.amount ?? 0;
      }
      if (!near(n, e.targetValue)) bad.push(`${e.id}: items sum to ${n}, target says ${e.targetValue}`);
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('a perfect bridge scores 100 and an empty one does not', () => {
    for (const e of bridges) {
      const picks = {};
      for (const i of e.items) if (i.role !== 'out') picks[i.id] = i.role;
      const perfect = gradeBridge(e, { picks, total: e.targetValue });
      assert(perfect.score === 100, `${e.id}: perfect scored ${perfect.score}`);
      const empty = gradeBridge(e, { picks: {} });
      // Leaving every trap in the tray is "correct" per item, so scoring items equally would hand
      // a learner who assembles nothing a third of the marks.
      assert(empty.score === 0, `${e.id}: assembling nothing scored ${empty.score}`);
    }
  });

  check('every numeric has a tolerance that is not absurd', () => {
    const bad = [];
    for (const e of numerics) {
      const tol = e.tolerance ?? Math.max(0.01, Math.abs(e.answer) * 0.005);
      if (tol > Math.abs(e.answer) * 0.1) bad.push(`${e.id}: tolerance ${tol} against answer ${e.answer}`);
    }
    assert(bad.length === 0, `tolerance so wide the question is not testing anything: ${bad.join(', ')}`);
  });

  check('numeric near-misses are actually wrong', () => {
    // A near-miss inside the tolerance would be marked correct, so the diagnostic would never fire.
    const bad = [];
    for (const e of numerics) {
      const tol = e.tolerance ?? Math.max(0.01, Math.abs(e.answer) * 0.005);
      for (const nm of e.nearMisses ?? []) {
        if (Math.abs(nm.value - e.answer) <= tol) bad.push(`${e.id}: near-miss ${nm.value} is within tolerance of ${e.answer}`);
      }
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('a correct numeric answer scores 100, a wrong one scores 0', () => {
    for (const e of numerics) {
      assert(gradeNumeric(e, { value: e.answer }).score === 100, `${e.id}: correct answer did not score 100`);
      assert(gradeNumeric(e, { value: e.answer + Math.abs(e.answer || 1) }).score === 0, `${e.id}: a wrong answer scored above zero`);
    }
  });

  check('a declared timer is actually shown', () => {
    // A timer that no view reads is fidelity on paper only, and the tier stops meaning anything.
    // Every format now goes through views/clock.tsx; this fails if one stops.
    const views = ['grid', 'board', 'bridge', 'numeric'];
    const missing = views.filter((v) => !readFileSync(join(ROOT, 'src', 'exercises', 'views', `${v}.tsx`), 'utf8').includes('useClock'));
    assert(missing.length === 0, `views that ignore a declared timer: ${missing.join(', ')}`);
  });

  check('contested items are excluded from the score everywhere they appear', () => {
    // The flag has to mean the same thing in every format, or an author will reasonably assume it
    // works and quietly have their arguable item graded.
    for (const e of bridges) {
      if (!e.items.some((i) => i.contested)) continue;
      const picks = {};
      for (const i of e.items) if (i.role !== 'out' && !i.contested) picks[i.id] = i.role;
      assert(gradeBridge(e, { picks, total: e.targetValue }).score === 100, `${e.id}: contested item is being scored`);
    }
    for (const e of buckets) {
      if (!e.items.some((i) => i.contested)) continue;
      const put = {};
      for (const i of e.items) if (!i.contested) put[i.id] = i.bucket;
      assert(gradeBucketing(e, put).score === 100, `${e.id}: contested item is being scored`);
    }
  });

  check('every bucketing exercise names a real bucket for every item', () => {
    const bad = [];
    for (const e of buckets) {
      const ids = new Set(e.buckets.map((b) => b.id));
      for (const i of e.items) if (!ids.has(i.bucket)) bad.push(`${e.id}/${i.id} -> ${i.bucket}`);
    }
    assert(bad.length === 0, `items sorted into buckets that do not exist: ${bad.join(', ')}`);
  });

  check('every bucketing exercise uses all of its buckets', () => {
    // A bucket nothing belongs in is a decoy that teaches nothing and inflates the score.
    const bad = [];
    for (const e of buckets) {
      const used = new Set(e.items.map((i) => i.bucket));
      for (const b of e.buckets) if (!used.has(b.id)) bad.push(`${e.id}/${b.id}`);
    }
    assert(bad.length === 0, `empty buckets: ${bad.join(', ')}`);
  });

  check('sorting everything into one bucket cannot pass', () => {
    for (const e of buckets) {
      for (const b of e.buckets) {
        const res = gradeBucketing(e, Object.fromEntries(e.items.map((i) => [i.id, b.id])));
        assert(res.score < 70, `${e.id}: putting everything in '${b.id}' scored ${res.score}`);
      }
    }
  });

  check('ordering exercises are not already solved when opened', () => {
    // The view shuffles deterministically, so a bad seed could hand over the answer.
    const bad = [];
    for (const e of orderings) {
      const correct = [...e.items].sort((a, b) => a.rank - b.rank).map((i) => i.id);
      assert(gradeOrdering(e, { order: correct }).score === 100, `${e.id}: correct order did not score 100`);
      const reversed = [...correct].reverse();
      if (gradeOrdering(e, { order: reversed }).score > 30) bad.push(`${e.id} scores ${gradeOrdering(e, { order: reversed }).score} reversed`);
    }
    assert(bad.length === 0, `reversing the order should be near-zero: ${bad.join(', ')}`);
  });

  check('ordering exercises have enough items to be worth ranking', () => {
    const bad = orderings.filter((e) => e.items.length < 4).map((e) => e.id);
    assert(bad.length === 0, `too few items to rank: ${bad.join(', ')}`);
  });

  // ---- variants ----
  //
  // The promise the app makes is that a second attempt has different numbers AND a correct answer
  // key. The second half is the one that can silently break, and it breaks in the direction that
  // destroys trust: marking a right answer wrong. So every check below runs against several
  // variants, not just the authored one.
  section('variants');

  const TRY = [0, 1, 2, 3, 4, 5, 6, 7];
  const PROSE_SKIP = new Set(['id', 'kind', 'module', 'tier', 'statement', 'bucket', 'emphasis', 'row', 'skills', 'prefillAt', 'unit', 'fixedFigures']);

  function walk(node, key, onNum, onStr) {
    if (typeof node === 'number') return onNum(node, key);
    if (typeof node === 'string') { if (!key || (!PROSE_SKIP.has(key) && !key.endsWith('Expr'))) onStr(node, key); return; }
    if (Array.isArray(node)) { for (const n of node) walk(n, key, onNum, onStr); return; }
    if (node && typeof node === 'object') { for (const [k, v] of Object.entries(node)) walk(v, k, onNum, onStr); }
  }
  // `variant` is bookkeeping the runtime stamps on, not a figure anyone reasons with.
  const numbersOf = (e) => { const out = []; walk(e, undefined, (n, k) => { if (k !== 'variant') out.push(k + '=' + n); }, () => {}); return out; };
  const proseOf = (e) => { const out = []; walk(e, undefined, () => {}, (s) => out.push(s)); return out; };

  /** A perfect attempt, whatever the format. One definition, used by every check below. */
  function perfectOf(e) {
    if (e.kind === 'statement-grid') return gradeGrid(e, Object.fromEntries(e.rows.filter((r) => !r.computed).map((r) => [r.id, r.base + r.delta])), new Set());
    if (e.kind === 'ternary-board') return gradeTernary(e, Object.fromEntries(e.rows.map((r) => [r.id, { direction: r.direction, magnitude: r.magnitude }])));
    if (e.kind === 'bridge') {
      const picks = {};
      for (const i of e.items) if (i.role !== 'out') picks[i.id] = i.role;
      return gradeBridge(e, { picks, total: e.targetValue });
    }
    if (e.kind === 'bucketing') return gradeBucketing(e, Object.fromEntries(e.items.map((i) => [i.id, i.bucket])));
    if (e.kind === 'ordering') return gradeOrdering(e, { order: [...e.items].sort((a, b) => a.rank - b.rank).map((i) => i.id) });
    return gradeNumeric(e, { value: e.answer });
  }

  check('variant 0 keeps every authored figure', () => {
    // A first encounter has to be the problem a human wrote, read and checked. Variant 0 runs the
    // same pipeline as every other variant, so this compares its output number by number against
    // the source file — which also catches an authored subtotal that disagrees with its own model.
    const bad = [];
    for (const e of EXERCISES) {
      const was = numbersOf(e);
      const now = numbersOf(variantOf(e, 0));
      const i = was.findIndex((x, k) => x !== now[k]);
      if (i >= 0 || was.length !== now.length) bad.push(e.id + ': ' + (was[i] ?? '(missing)') + ' became ' + (now[i] ?? '(missing)'));
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('no stem still shows its own placeholder', () => {
    // interp() leaves an expression it cannot evaluate exactly as written, so a mistyped var name
    // surfaces as literal braces on screen rather than as a crash. Catch it here instead.
    const bad = [];
    for (const e of EXERCISES) {
      for (const n of TRY) {
        for (const s of proseOf(variantOf(e, n))) {
          const m = s.match(/\{[^{}]{1,40}\}/);
          if (m) { bad.push(e.id + ' v' + n + ': ' + m[0]); break; }
        }
      }
    }
    assert(bad.length === 0, bad.slice(0, 6).join('; '));
  });

  check('every domain leads with the authored default and repeats nothing', () => {
    // If the first value is not the authored one, variant 0 is not the authored exercise and every
    // literal in the file is being checked against the wrong scope.
    const bad = [];
    for (const e of EXERCISES) {
      for (const v of e.vars ?? []) {
        if (v.domain.length === 0) bad.push(e.id + '/' + v.id + ': empty domain');
        if (new Set(v.domain).size !== v.domain.length) bad.push(e.id + '/' + v.id + ': repeated values');
      }
      if (e.kind === 'statement-grid' && e.shock && e.shock.domain && e.shock.domain.length) {
        if (e.shock.domain[0] !== e.shock.value) bad.push(e.id + ': shock domain leads with ' + e.shock.domain[0] + ', authored value is ' + e.shock.value);
        if (new Set(e.shock.domain).size !== e.shock.domain.length) bad.push(e.id + ': repeated shock values');
      }
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('authored numbers agree with their own expressions', () => {
    // The same contract the grid already has between delta and perShock: the literal stays, the
    // relationship is declared beside it, and disagreement is a build failure rather than a learner
    // being marked wrong.
    const bad = [];
    for (const e of EXERCISES) {
      let scope;
      try { scope = defaultScope(e); } catch (err) { bad.push(e.id + ': ' + err.message); continue; }
      const cmp = (label, expr, literal) => {
        if (expr === undefined) return;
        let got;
        try { got = evalExpr(expr, scope); } catch (err) { bad.push(e.id + '/' + label + ': ' + err.message); return; }
        if (!near(round2(got), round2(literal))) bad.push(e.id + '/' + label + ': "' + expr + '" gives ' + round2(got) + ', authored ' + literal);
      };
      if (e.kind === 'numeric') {
        cmp('answer', e.answerExpr, e.answer);
        for (const m of e.nearMisses ?? []) cmp('near miss ' + m.value, m.valueExpr, m.value);
      } else if (e.kind === 'bridge') {
        cmp('startValue', e.startValueExpr, e.startValue);
        for (const i of e.items) cmp('item ' + i.id, i.amountExpr, i.amount ?? 0);
      } else if (e.kind === 'ternary-board') {
        for (const r of e.rows) cmp('row ' + r.id, r.magnitudeExpr, r.magnitude ?? 0);
      } else if (e.kind === 'statement-grid') {
        for (const r of e.rows) {
          if (r.computed) continue;   // subtotals are re-derived from the model, never authored
          cmp('row ' + r.id + ' base', r.baseExpr, r.base);
          cmp('row ' + r.id + ' delta', r.deltaExpr, r.delta);
        }
      }
    }
    assert(bad.length === 0, bad.join('; '));
  });

  // Eight variants is enough to catch a systematic mistake and nowhere near enough to catch a
  // collision that only happens at one corner of the domain. An author sweeping their own content
  // by hand found two such pairs that this gate walked straight past. Numeric checks are cheap —
  // no grading, just arithmetic — so they get a wide deterministic spread instead: a stride that is
  // coprime with almost any domain size, so the sample walks the whole space rather than one edge.
  const SWEEP = (e) => {
    const c = figureCount(e);
    const n = Math.min(c, 3000);
    const out = [];
    for (let i = 0; i < n; i++) out.push((i * 7919) % c);
    return out;
  };

  check('no near miss collides with the answer on any variant', () => {
    // The dangerous direction, and the reason this is checked per variant rather than once. A near
    // miss that lands ON the answer means the learner who makes exactly that mistake types the
    // right number and is told they are correct — the exercise quietly stops testing the thing it
    // was written to test. Two near misses colliding is milder: the wrong diagnosis wins.
    const bad = [];
    for (const e of numerics) {
      for (const n of SWEEP(e)) {
        const v = variantOf(e, n);
        const tol = v.tolerance ?? Math.max(0.01, Math.abs(v.answer) * 0.005);
        for (const m of v.nearMisses ?? []) {
          if (Math.abs(m.value - v.answer) <= tol) bad.push(e.id + ' v' + n + ': near miss ' + m.value + ' is the answer');
        }
      }
    }
    assert(bad.length === 0, bad.slice(0, 6).join('; '));
  });

  check('a number two mistakes share is diagnosed as both', () => {
    // Two different slips can genuinely produce the same figure. The app cannot know which one a
    // learner made, so it must not pick one and state it as fact — it names both and lets them
    // recognise their own. Checked here because the alternative failed silently and plausibly.
    const e = numerics.find((x) => (x.nearMisses ?? []).length >= 2);
    const tol = e.tolerance ?? 0.05;
    const res = gradeNumeric(e, { value: e.nearMisses[0].value });
    assert(res.notes.includes(e.nearMisses[0].note), 'the matching near miss was not reported');
    const twin = { ...e, nearMisses: [e.nearMisses[0], { ...e.nearMisses[1], value: e.nearMisses[0].value }] };
    const both = gradeNumeric(twin, { value: e.nearMisses[0].value });
    assert(both.notes.includes(twin.nearMisses[0].note) && both.notes.includes(twin.nearMisses[1].note),
      'a value two near misses share reported only one of them');
    assert(both.notes.some((n) => n.includes('Two different mistakes')), 'the debrief did not say the diagnosis is ambiguous');
    assert(tol > 0, 'tolerance sanity');
  });

  check('a numeric exercise with vars explains every near miss in terms of them', () => {
    // A near miss diagnoses one specific slip. Left at its authored value on new figures it does
    // not merely fail to fire, it fires on a different mistake and says something untrue.
    const bad = [];
    for (const e of numerics) {
      if (figureCount(e) <= 1) continue;
      for (const m of e.nearMisses ?? []) if (m.valueExpr === undefined) bad.push(e.id + ': ' + m.value);
    }
    assert(bad.length === 0, 'near misses with no declared relationship: ' + bad.join(', '));
  });

  check('a bridge target is always its own start plus its own items', () => {
    const bad = [];
    for (const e of bridges) {
      for (const n of TRY) {
        const v = variantOf(e, n);
        if (!near(v.targetValue, bridgeTotal(v))) bad.push(e.id + ' v' + n + ': says ' + v.targetValue + ', assembles to ' + bridgeTotal(v));
      }
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('every variant is arithmetically clean', () => {
    // Money is written to two decimals. A variant producing 12.344999999999999 is a bug in the
    // expression layer, and it would appear on screen exactly like that.
    const bad = [];
    for (const e of EXERCISES) {
      for (const n of TRY) {
        let v;
        try { v = variantOf(e, n); } catch (err) { bad.push(e.id + ' v' + n + ': ' + err.message); continue; }
        for (const entry of numbersOf(v)) {
          const val = Number(entry.split('=')[1]);
          if (!Number.isFinite(val)) { bad.push(e.id + ' v' + n + ': ' + entry + ' is not finite'); break; }
          if (!near(val, round2(val))) { bad.push(e.id + ' v' + n + ': ' + entry + ' has more than two decimals'); break; }
        }
      }
    }
    assert(bad.length === 0, bad.slice(0, 6).join('; '));
  });

  check('a perfect attempt scores 100 on every variant', () => {
    const bad = [];
    for (const e of EXERCISES) {
      for (const n of TRY) {
        const v = variantOf(e, n);
        const res = perfectOf(v);
        if (res.score !== 100) bad.push(e.id + ' v' + n + ': ' + res.score);
        if (v.kind === 'statement-grid' && res.balance && !res.balance.balances) bad.push(e.id + ' v' + n + ': does not balance');
      }
    }
    assert(bad.length === 0, bad.slice(0, 6).join('; '));
  });

  check('no variant can be gamed by one lazy answer', () => {
    // The check that caught a board scoring 56% for saying 'no change' to everything. New figures
    // must not open a new way to score without knowing anything.
    const bad = [];
    for (const e of EXERCISES) {
      for (const n of TRY) {
        const v = variantOf(e, n);
        if (v.kind === 'statement-grid') {
          const res = gradeGrid(v, {}, new Set());
          if (res.score !== 0) bad.push(e.id + ' v' + n + ': doing nothing scored ' + res.score);
        } else if (v.kind === 'ternary-board') {
          for (const guess of ['none', 'up', 'down']) {
            const res = gradeTernary(v, Object.fromEntries(v.rows.map((r) => [r.id, { direction: guess }])));
            if (res.score !== 0) bad.push(e.id + ' v' + n + ": '" + guess + "' everywhere scored " + res.score);
          }
        } else if (v.kind === 'bridge') {
          const res = gradeBridge(v, { picks: {} });
          if (res.score !== 0) bad.push(e.id + ' v' + n + ': assembling nothing scored ' + res.score);
        }
      }
    }
    assert(bad.length === 0, bad.slice(0, 6).join('; '));
  });

  check('a board direction never flips underneath its own magnitude', () => {
    // Direction is authored; magnitude is computed. A magnitude that crosses zero on some variant
    // means the authored direction is now wrong, and the learner is marked against a lie.
    const bad = [];
    for (const e of boards) {
      for (const n of TRY) {
        for (const r of variantOf(e, n).rows) {
          if (r.magnitudeExpr && !(r.magnitude > 0)) bad.push(e.id + ' v' + n + '/' + r.id + ': magnitude ' + r.magnitude);
        }
      }
    }
    assert(bad.length === 0, bad.join('; '));
  });

  check('a variant really does change the figures', () => {
    // Guards the whole feature against a domain that varies nothing reachable: declare a var, use
    // it nowhere, and every variant is the authored exercise wearing a different index.
    const bad = [];
    for (const e of EXERCISES) {
      if (figureCount(e) <= 1) continue;
      const stateOf = (x) => numbersOf(x).join('|') + '//' + proseOf(x).join('|');
      const base = stateOf(variantOf(e, 0));
      const changed = TRY.filter((n) => n > 0).some((n) => stateOf(variantOf(e, n)) !== base);
      if (!changed) bad.push(e.id);
    }
    assert(bad.length === 0, 'declares a domain but nothing downstream moves: ' + bad.join(', '));
  });

  check('no authored figure survives into a variant', () => {
    // The failure this exists for: the model runs at the new number and one sentence in the stem
    // still quotes the old one. Every figure in prose has to arrive through interpolation.
    const bad = [];
    for (const e of EXERCISES) {
      if (figureCount(e) <= 1) continue;
      const base = defaultScope(e);
      const seen = new Set();
      for (const n of TRY) {
        if (n === 0) continue;
        const now = scopeFor(e, n);
        const prose = proseOf(variantOf(e, n)).join('   ');
        const live = new Set(Object.values(now));
        for (const [name, was] of Object.entries(base)) {
          if (Math.abs(was) < 10) continue;                                   // small integers are everywhere in prose
          if (now[name] === was) continue;                                    // this one did not move on this variant
          if (live.has(was)) continue;                                        // some other named value equals it here
          if (Object.values(base).filter((x) => x === was).length > 1) continue; // ambiguous: two names share the value
          // Both renderings: prose written by hand says 1,530 and interpolation now produces the
          // same, but an author may have typed either.
          const forms = [String(was), was.toLocaleString('en-US')];
          const pattern = new RegExp('(?<![\\d.,])(' + [...new Set(forms)].map((f) => f.replace('.', '\\.')).join('|') + ')(?![\\d.,])');
          const key = e.id + ': prose still quotes ' + name + ' = ' + was;
          if (pattern.test(prose) && !seen.has(key)) { seen.add(key); bad.push(key); }
        }
      }
    }
    assert(bad.length === 0, bad.slice(0, 6).join('; '));
  });

  check('every exercise says how a re-attempt differs', () => {
    // An exercise carrying numbers and no vars hands back an identical problem forever. That is
    // sometimes the right call, but it has to be a call, written down, rather than an omission the
    // gate cannot tell apart from running out of time.
    const bad = [];
    for (const e of EXERCISES) {
      if (figureCount(e) > 1 || e.fixedFigures) continue;
      if (proseOf(e).some((s) => /\d/.test(s))) bad.push(e.id);
    }
    assert(bad.length === 0, 'carries figures but neither varies them nor says why not: ' + bad.join(', '));
  });

  check('every exercise pins its conventions', () => {
    // Without this the app can mark a right answer wrong on a convention the learner never saw.
    const bad = EXERCISES.filter((e) => !e.conventions || e.conventions.length === 0).map((e) => e.id);
    assert(bad.length === 0, bad.join(', '));
  });
}

if (failures > 0) {
  process.stdout.write(`\n${failures} check(s) failed:\n`);
  for (const f of failed) process.stdout.write(`  - ${f}\n`);
  process.stdout.write('\nNot done.\n');
  process.exit(1);
}
process.stdout.write('\nAll checks passed.\n');
