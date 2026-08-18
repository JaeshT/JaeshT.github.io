// The gate. Everything an agent claims to have finished has to get past this first.
//
// Run it yourself with `npm run verify`. It also runs automatically from the TaskCompleted
// hook in .claude/settings.json, where a non-zero exit blocks the task from being marked done
// and hands the output back to whoever tried. That is the point: completion is earned here,
// not asserted in a chat message.
//
// Three checks, cheapest first:
//   1. types     tsc over the whole project
//   2. scheduler FSRS invariants, so the spaced repetition maths cannot silently rot
//   3. content   every question bank parses and holds together
//
// Deliberately NOT a full `vite build`: this needs to be fast enough to run on every task.
// `npm run verify:full` adds the build for when you are about to deploy.

import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FULL = process.argv.includes('--full');

let failures = 0;
const failed = [];

function check(name, fn) {
  try {
    fn();
    process.stdout.write(`  ok   ${name}\n`);
  } catch (err) {
    failures++;
    failed.push(`${name}: ${err.message}`);
    process.stdout.write(`  FAIL ${name}\n         ${err.message}\n`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function close(a, b, tol, msg) {
  assert(Math.abs(a - b) <= tol, `${msg} (got ${a}, wanted ${b} +/- ${tol})`);
}

function section(title) {
  process.stdout.write(`\n${title}\n`);
}

// ---------------------------------------------------------------- 1. types

section('types');
check('tsc has no errors', () => {
  try {
    execFileSync('npx', ['tsc', '-b', '--noEmit'], { cwd: ROOT, stdio: 'pipe' });
  } catch (err) {
    const out = `${err.stdout ?? ''}${err.stderr ?? ''}`.trim();
    throw new Error(out.split('\n').slice(0, 12).join('\n         ') || 'tsc failed');
  }
});

// ------------------------------------------------------------ 2. scheduler

// srs.ts is TypeScript, so bundle it to plain JS before importing. Its only import is a
// `import type`, which esbuild erases, so nothing else gets pulled in.
section('scheduler (FSRS)');

const cacheDir = join(ROOT, 'node_modules', '.cache', 'verify');
if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
const bundlePath = join(cacheDir, 'srs.mjs');

let srs;
try {
  const esbuild = await import('esbuild');
  await esbuild.build({
    entryPoints: [join(ROOT, 'src', 'lib', 'srs.ts')],
    outfile: bundlePath,
    format: 'esm',
    bundle: true,
    logLevel: 'silent',
  });
  srs = await import(`${pathToFileURL(bundlePath).href}?v=${Date.now()}`);
} catch (err) {
  failures++;
  failed.push(`could not load srs.ts: ${err.message}`);
  process.stdout.write(`  FAIL could not load srs.ts\n         ${err.message}\n`);
}

if (srs) {
  const {
    retrievability,
    intervalFor,
    review,
    previewIntervals,
    migrateLegacy,
    formatDelay,
    isDue,
    isNew,
    phaseOf,
    freshState,
    GRADES,
    DESIRED_RETENTION,
    RELEARN_DELAY,
    INTERVAL_MODIFIER,
    LEARNING_STEPS,
  } = srs;

  const DAY = 24 * 60 * 60 * 1000;
  const NOW = Date.UTC(2026, 0, 1);

  // The defining property of the model. If this drifts, every interval in the app is wrong.
  check('recall is exactly 90% when elapsed days equal stability', () => {
    for (const s of [0.5, 1, 3, 15, 100, 900]) {
      close(retrievability(s, s), 0.9, 1e-9, `stability ${s}`);
    }
  });

  check('recall starts at 1 and decays monotonically', () => {
    close(retrievability(0, 5), 1, 1e-12, 'day 0');
    let prev = Infinity;
    for (const d of [0, 1, 2, 5, 10, 50, 500]) {
      const r = retrievability(d, 5);
      assert(r < prev, `recall did not fall between days (at day ${d})`);
      assert(r > 0 && r <= 1, `recall out of range at day ${d}: ${r}`);
      prev = r;
    }
  });

  check('interval equals stability at 90% retention, the defining FSRS property', () => {
    // Passed explicitly, because the deck's own target is deliberately stricter than 0.9.
    for (const s of [2, 10, 40, 365]) {
      close(intervalFor(s, 0.9), s, 1e-6, `stability ${s}`);
    }
  });

  check(`scheduled intervals are exactly ${INTERVAL_MODIFIER}x the stock FSRS ones`, () => {
    for (const s of [2, 10, 40, 365]) {
      close(intervalFor(s), INTERVAL_MODIFIER * s, 1e-6, `stability ${s}`);
    }
  });

  check('a higher retention target shortens the interval', () => {
    assert(intervalFor(100, 0.97) < intervalFor(100, 0.9), 'stricter target was not shorter');
    assert(intervalFor(100, 0.8) > intervalFor(100, 0.9), 'looser target was not longer');
  });

  check('a card met for the first time follows the learning steps', () => {
    const want = { again: '10m', hard: '1h', good: '1d', easy: '3d' };
    const got = previewIntervals(undefined, NOW);
    for (const g of GRADES) {
      assert(got[g] === want[g], `first ${g} should be ${want[g]}, got ${got[g]}`);
      close(review(undefined, g, NOW).due - NOW, LEARNING_STEPS[g], 1, `${g} due`);
    }
  });

  check('learning steps get longer with the grade, and Again is the shortest', () => {
    let prev = 0;
    for (const g of GRADES) {
      assert(LEARNING_STEPS[g] > prev, `${g} is not longer than the grade below it`);
      prev = LEARNING_STEPS[g];
    }
  });

  check('sub-day steps stay under a day, as Anki advises for FSRS', () => {
    // Anki's manual: (re)learning steps of a day or more stop FSRS scheduling properly.
    assert(LEARNING_STEPS.again < DAY, 'Again must stay inside the session');
    assert(LEARNING_STEPS.hard < DAY, 'Hard must stay under a day on first exposure');
  });

  check('after the first answer the schedule is dynamic, not another fixed step', () => {
    let s = review(undefined, 'good', NOW);
    const seen = new Set();
    let t = s.due;
    for (let i = 0; i < 4; i++) {
      const before = s.stability;
      s = review(s, 'good', t);
      assert(s.stability > before, 'stability should grow on a successful recall');
      seen.add(s.interval);
      t = s.due;
    }
    assert(seen.size === 4, `intervals repeated instead of growing: ${[...seen].join(', ')}`);
  });

  check('new card graded again comes back inside the session', () => {
    const s = review(undefined, 'again', NOW);
    assert(s.interval === 0, `interval should be 0 while relearning, got ${s.interval}`);
    assert(s.due === NOW + RELEARN_DELAY, 'due should be one relearn delay away');
    assert(s.lapses === 1, `lapses should be 1, got ${s.lapses}`);
  });

  check('stability growth is ordered hard < good < easy', () => {
    const seed = review(undefined, 'good', NOW);
    const later = NOW + 10 * DAY;
    const hard = review(seed, 'hard', later);
    const good = review(seed, 'good', later);
    const easy = review(seed, 'easy', later);
    assert(hard.stability < good.stability, 'hard did not grow slower than good');
    assert(good.stability < easy.stability, 'good did not grow slower than easy');
  });

  check('a lapse never raises stability', () => {
    let s = review(undefined, 'easy', NOW);
    for (let i = 1; i <= 6; i++) s = review(s, 'good', NOW + i * 30 * DAY);
    const before = s.stability;
    const after = review(s, 'again', NOW + 7 * 30 * DAY);
    assert(after.stability <= before, `stability rose on a lapse: ${before} -> ${after.stability}`);
    assert(after.lapses === s.lapses + 1, 'lapse counter did not advance');
  });

  check('difficulty and stability stay in range over 800 random grades', () => {
    let rng = 12345;
    const rand = () => ((rng = (rng * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    let s = freshState(NOW);
    let t = NOW;
    for (let i = 0; i < 800; i++) {
      const grade = GRADES[Math.floor(rand() * GRADES.length)];
      t += Math.floor(rand() * 40) * DAY;
      s = review(s, grade, t);
      assert(s.difficulty >= 1 && s.difficulty <= 10, `difficulty escaped: ${s.difficulty} at ${i}`);
      assert(s.stability > 0 && Number.isFinite(s.stability), `stability broke: ${s.stability} at ${i}`);
      assert(Number.isFinite(s.due) && s.due >= t, `due went backwards at ${i}`);
    }
  });

  check('reps count every answer', () => {
    let s = review(undefined, 'good', NOW);
    for (let i = 1; i <= 5; i++) s = review(s, 'good', NOW + i * DAY);
    assert(s.reps === 6, `expected 6 reps, got ${s.reps}`);
  });

  // This is what every one of the user's pre-FSRS cards went through. If it changes,
  // a future migration could quietly reset real progress.
  check('legacy SM-2 records migrate to met-before-not-solid, due now', () => {
    const legacy = { reps: 4, lapses: 1, ease: 2.5, interval: 12, due: NOW - DAY, lastReview: NOW - 5 * DAY };
    const m = migrateLegacy(legacy, NOW);
    close(m.stability, 1.18385, 1e-9, 'stability should be the FSRS "hard" seed');
    assert(m.due === NOW, 'a migrated card should be due immediately');
    assert(m.reps === 4 && m.lapses === 1, 'migration must preserve history');
    assert(m.ease === undefined, 'the SM-2 ease should not survive migration');
  });

  check('migration is idempotent for already-migrated records', () => {
    const once = migrateLegacy({ reps: 2, lapses: 0, lastReview: NOW }, NOW);
    const twice = review(once, 'good', NOW + DAY);
    assert(twice.stability > 0, 'a migrated card should schedule normally afterwards');
  });

  check('previewIntervals labels all four buttons', () => {
    const p = previewIntervals(undefined, NOW);
    for (const g of GRADES) {
      assert(typeof p[g] === 'string' && p[g].length > 0, `no label for ${g}`);
    }
    assert(p.again.endsWith('m'), `again should be minutes away, got ${p.again}`);
  });

  check('formatDelay reads sensibly at each boundary', () => {
    assert(formatDelay(30 * 1000) === '<1m', formatDelay(30 * 1000));
    assert(formatDelay(10 * 60 * 1000) === '10m', formatDelay(10 * 60 * 1000));
    assert(formatDelay(3 * 60 * 60 * 1000) === '3h', formatDelay(3 * 60 * 60 * 1000));
    assert(formatDelay(5 * DAY) === '5d', formatDelay(5 * DAY));
    assert(formatDelay(90 * DAY).endsWith('mo'), formatDelay(90 * DAY));
    assert(formatDelay(800 * DAY).endsWith('y'), formatDelay(800 * DAY));
  });

  check('new, due and phase agree with each other', () => {
    assert(isNew(undefined) && isDue(undefined, NOW), 'an unseen card is new and due');
    assert(phaseOf(undefined, NOW) === 'new', 'unseen card should be phase new');
    const good = review(undefined, 'good', NOW);
    assert(!isNew(good), 'a graded card is no longer new');
    assert(!isDue(good, NOW), 'a card just graded good is not due yet');
    assert(isDue(good, good.due + 1), 'a card should be due once its time passes');
    assert(phaseOf(good, NOW) === 'review', 'a card with a multi-day interval is in review');
    const lapsed = review(good, 'again', NOW + DAY);
    assert(phaseOf(lapsed, NOW + DAY) === 'learning', 'a lapsed card is relearning');
  });

  check('desired retention is derived from the interval modifier', () => {
    // The two must never be set independently: retention IS the modifier, expressed the way Anki
    // exposes it. Anything between 0.8 and 0.95 is sane per Anki's manual.
    const expected = Math.pow(1 + INTERVAL_MODIFIER * (Math.pow(0.9, -2) - 1), -0.5);
    close(DESIRED_RETENTION, expected, 1e-12, 'retention no longer follows the modifier');
    assert(
      DESIRED_RETENTION > 0.8 && DESIRED_RETENTION < 0.95,
      `desired retention ${DESIRED_RETENTION} is outside the sane 0.80-0.95 band`,
    );
  });
}

// -------------------------------------------------------------- 3. content

section('content');

const contentDir = join(ROOT, 'public', 'content');
const VALID_TIERS = new Set(['easy', 'medium', 'hard']);
let index;
let banks = [];

check('index.json parses', () => {
  index = JSON.parse(readFileSync(join(contentDir, 'index.json'), 'utf8'));
  assert(Array.isArray(index.modules), 'index.modules must be an array');
  assert(index.modules.length > 0, 'index has no modules');
});

check('every module bank referenced by the index exists', () => {
  const missing = [];
  for (const m of index?.modules ?? []) {
    if (!m.bank) continue; // a module with no bank is a deliberate "soon" placeholder
    if (!existsSync(join(contentDir, m.bank))) missing.push(`${m.id} -> ${m.bank}`);
  }
  assert(missing.length === 0, `missing bank files: ${missing.join(', ')}`);
});

check('every bank file parses', () => {
  const dir = join(contentDir, 'modules');
  const bad = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    try {
      const bank = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      assert(Array.isArray(bank.questions), `${f}: questions must be an array`);
      banks.push({ file: f, bank });
    } catch (err) {
      bad.push(`${f}: ${err.message}`);
    }
  }
  assert(bad.length === 0, bad.join('; '));
});

check('question ids are unique across every bank', () => {
  const seen = new Map();
  const dupes = [];
  for (const { file, bank } of banks) {
    for (const q of bank.questions) {
      if (seen.has(q.id)) dupes.push(`${q.id} in both ${seen.get(q.id)} and ${file}`);
      else seen.set(q.id, file);
    }
  }
  // Ids key the SRS map. A duplicate silently merges two cards' scheduling history.
  assert(dupes.length === 0, dupes.slice(0, 5).join('; '));
});

check('every question has a valid tier, a prompt and an answer', () => {
  const bad = [];
  for (const { file, bank } of banks) {
    for (const q of bank.questions) {
      if (!q.id) bad.push(`${file}: a question has no id`);
      else if (!VALID_TIERS.has(q.tier)) bad.push(`${q.id}: bad tier ${JSON.stringify(q.tier)}`);
      else if (!q.prompt?.trim()) bad.push(`${q.id}: empty prompt`);
      else if (!q.answer?.trim()) bad.push(`${q.id}: empty answer`);
    }
  }
  assert(bad.length === 0, `${bad.length} problem(s): ${bad.slice(0, 5).join('; ')}`);
});

check('every tier of every built module has at least one question', () => {
  const thin = [];
  for (const { file, bank } of banks) {
    for (const tier of VALID_TIERS) {
      const n = bank.questions.filter((q) => q.tier === tier).length;
      if (n === 0) thin.push(`${file} has no ${tier} questions`);
    }
  }
  // A tier with nothing in it renders as a stage you can enter but never clear.
  assert(thin.length === 0, thin.join('; '));
});

check('multiple-choice answers point at a real choice', () => {
  const bad = [];
  for (const { bank } of banks) {
    for (const q of bank.questions) {
      if (q.check?.type !== 'mcq') continue;
      const n = q.check.choices?.length ?? 0;
      if (n < 2) bad.push(`${q.id}: needs at least two choices`);
      else if (!(q.check.answerIndex >= 0 && q.check.answerIndex < n)) {
        bad.push(`${q.id}: answerIndex ${q.check.answerIndex} outside 0..${n - 1}`);
      }
    }
  }
  assert(bad.length === 0, bad.slice(0, 5).join('; '));
});

check('numeric answers are real numbers', () => {
  const bad = [];
  for (const { bank } of banks) {
    for (const q of bank.questions) {
      if (q.check?.type !== 'numeric') continue;
      if (!Number.isFinite(q.check.answer)) bad.push(`${q.id}: answer is not a number`);
      if (q.check.tolerance !== undefined && !(q.check.tolerance >= 0)) {
        bad.push(`${q.id}: negative tolerance`);
      }
    }
  }
  assert(bad.length === 0, bad.slice(0, 5).join('; '));
});

// ------------------------------------------------------- 4. one card system

// The drill and review drifted apart once before: the drill asked you to commit before the reveal
// and then grade again after it, while review simply flipped and graded. These pin the two to the
// same interaction so they cannot separate again without someone deciding to.

section('one card system');

/** Comments explain what was removed and why, so only real code should be searched for it. */
function code(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

const drillSrc = code(readFileSync(join(ROOT, 'src', 'views', 'drill.tsx'), 'utf8'));
const reviewSrc = code(readFileSync(join(ROOT, 'src', 'views', 'review.tsx'), 'utf8'));
const uiSrc = readFileSync(join(ROOT, 'src', 'views', 'ui.tsx'), 'utf8');
const cssSrc = readFileSync(join(ROOT, 'src', 'styles.css'), 'utf8');

check('the drill has no pre-reveal commit step', () => {
  for (const dead of ['I know this', 'Not sure', 'commit-row']) {
    assert(!drillSrc.includes(dead), `drill.tsx still references "${dead}"`);
  }
});

check('nothing grades on anything but the four buttons', () => {
  for (const dead of ['Nailed it', 'Missed it', 'selfgrade', 'ankiGrading']) {
    assert(!drillSrc.includes(dead), `drill.tsx still references "${dead}"`);
  }
});

check('both drill and review grade through the shared GradeButtons', () => {
  assert(uiSrc.includes('export function GradeButtons'), 'GradeButtons is not in ui.tsx');
  for (const [name, src] of [['drill', drillSrc], ['review', reviewSrc]]) {
    assert(src.includes('<GradeButtons'), `${name}.tsx does not render GradeButtons`);
  }
});

check('GradeButtons is keyed by question in both', () => {
  // It holds a one-shot guard against double-firing. Unkeyed, Preact reuses the instance between
  // cards, the guard stays tripped, and the next card ignores its first press.
  assert(uiSrc.includes('const fired = useRef(false)'), 'GradeButtons no longer holds a fired guard');
  for (const [name, src] of [['drill', drillSrc], ['review', reviewSrc]]) {
    assert(/<GradeButtons\s+key=/.test(src), `${name}.tsx renders GradeButtons without a key`);
  }
});

check('both drill and review flip on space and grade on 1-4', () => {
  for (const [name, src] of [['drill', drillSrc], ['review', reviewSrc]]) {
    assert(src.includes("e.key === ' '"), `${name}.tsx has no space-to-flip handler`);
    assert(
      src.includes("['1', '2', '3', '4']"),
      `${name}.tsx does not grade on the number keys`,
    );
    assert(
      src.includes('/^(BUTTON|INPUT|TEXTAREA|SELECT)$/'),
      `${name}.tsx would let a keypress on a button also flip the card`,
    );
  }
});

check('the grade row is not flush against the answer above it', () => {
  // Without a top margin these buttons sat against the answer box and read as overlapping it.
  const rule = cssSrc.match(/^\.grade-row \{[^}]*\}/m);
  assert(rule, '.grade-row rule not found');
  assert(/margin-top:\s*(?!0)/.test(rule[0]), '.grade-row has no top margin');
});

check('.grade-row is laid out in exactly one place', () => {
  // It was declared twice with different values, so which one applied depended on file order and
  // the margin fix could be silently undone by editing the wrong copy. Later single-property
  // theme refinements like `.grade { box-shadow: … }` are fine; a second layout rule is not.
  const n = (cssSrc.match(/^\.grade-row(?=[\s{])/gm) ?? []).length;
  assert(n === 1, `.grade-row is declared ${n} times; the copies disagreed and shadowed`);
});

check('a drill entered from the climb goes back to the climb', () => {
  assert(drillSrc.includes('lastLadderView'), 'drill.tsx does not consult the remembered view');
  const appSrc = readFileSync(join(ROOT, 'src', 'app.tsx'), 'utf8');
  assert(appSrc.includes('rememberLadderView'), 'app.tsx never records which ladder view you are on');
  assert(
    !/\['path',\s*'module',\s*'lesson',\s*'drill'\]/.test(appSrc),
    'app.tsx still pins module/lesson/drill to the path tab',
  );
});

// ----------------------------------------------------------------- 5. build

if (FULL) {
  section('build');
  check('vite build succeeds', () => {
    // Node 18 has no global `crypto`, which the service-worker/terser step needs. Same flag
    // CLAUDE.md tells a human to prefix builds with; applied here so the gate matches reality.
    const major = Number(process.versions.node.split('.')[0]);
    const env = { ...process.env };
    if (major < 20) {
      env.NODE_OPTIONS = `${env.NODE_OPTIONS ?? ''} --experimental-global-webcrypto`.trim();
    }
    try {
      execFileSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'pipe', env });
    } catch (err) {
      const out = `${err.stdout ?? ''}${err.stderr ?? ''}`.trim();
      throw new Error(out.split('\n').slice(-12).join('\n         ') || 'build failed');
    }
  });
}

// ---------------------------------------------------------------- verdict

if (failures > 0) {
  process.stdout.write(`\n${failures} check(s) failed:\n`);
  for (const f of failed) process.stdout.write(`  - ${f}\n`);
  process.stdout.write('\nNot done. Fix these, then run `npm run verify` again.\n');
  process.exit(1);
}

process.stdout.write(`\nAll checks passed${FULL ? ' (including build)' : ''}.\n`);
