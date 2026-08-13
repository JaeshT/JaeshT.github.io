// The Climb: a vertical run of floating islands, one per stage, with a character who hops up
// one island every time you clear a stage. Islands are ordered easy first across every module,
// then medium, then hard, so the climb matches the way the ladder actually unlocks.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { navigate } from '../lib/router';
import { updateProgress } from '../lib/db';
import { TIERS, TIER_LABEL } from '../lib/schema';
import { nextStage, type ModuleState, type Stage } from '../lib/curriculum';
import { useLadder } from '../lib/useLadder';
import { progressionFor } from '../lib/levels';
import { Loading, LoadError, ViewToggle } from './ui';

const ROW = 148; // vertical pitch between islands, px
const BASE = 96; // height of the ground strip at the bottom, px
const LEFT = 27; // horizontal position of odd islands, % of width
const RIGHT = 73; // horizontal position of even islands, % of width

interface Island {
  stage: Stage;
  module: ModuleState;
  index: number;
  x: number; // % from the left
  y: number; // px from the bottom of the strip
}

function buildIslands(modules: ModuleState[]): Island[] {
  const out: Island[] = [];
  for (const tier of TIERS) {
    for (const m of modules) {
      // Core and fit both climb. Sector desks are electives and sit off the main route.
      if (!m.ready || m.ref.track === 'sector') continue;
      const stage = m.stages.find((s) => s.tier === tier);
      if (!stage || stage.total === 0) continue;
      const index = out.length;
      out.push({ stage, module: m, index, x: index % 2 === 0 ? LEFT : RIGHT, y: BASE + index * ROW });
    }
  }
  return out;
}

export function Climb() {
  const { data, error } = useLadder();
  const [hopTo, setHopTo] = useState<number | null>(null);
  const [landed, setLanded] = useState(false);
  const scroller = useRef<HTMLDivElement | null>(null);
  const charRef = useRef<HTMLDivElement | null>(null);

  const islands = useMemo(() => (data ? buildIslands(data.modules) : []), [data]);
  const clearedCount = islands.filter((i) => i.stage.status === 'cleared').length;
  const target = clearedCount - 1; // -1 means still on the ground

  // Animate from where the character was last seen up to where it belongs now.
  useEffect(() => {
    if (!data || islands.length === 0) return;
    const seen = data.progress.climbSeen ?? -1;
    const from = Math.min(seen, target);
    setHopTo(from);
    if (from >= target) {
      setHopTo(target);
      return;
    }
    let at = from;
    const timers: number[] = [];
    while (at < target) {
      at += 1;
      const step = at;
      timers.push(
        window.setTimeout(() => {
          setHopTo(step);
          setLanded(true);
          window.setTimeout(() => setLanded(false), 420);
        }, (step - from) * 620),
      );
    }
    timers.push(
      window.setTimeout(
        () => {
          updateProgress((p) => ({ ...p, climbSeen: target }));
        },
        (target - from) * 620 + 500,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [data, islands.length, target]);

  // Keep the character in view. Driving the scroller directly is more reliable than
  // scrollIntoView, because the islands are positioned from the bottom of a very tall container.
  // Retry on animation frames until the container has actually been laid out.
  const positioned = useRef(false);
  useEffect(() => {
    if (hopTo === null || islands.length === 0) return;
    let raf = 0;
    let tries = 0;
    const run = () => {
      const sc = scroller.current;
      if (!sc || sc.scrollHeight <= sc.clientHeight) {
        if (tries++ < 30) raf = requestAnimationFrame(run);
        return;
      }
      const isl = hopTo >= 0 ? islands[Math.min(hopTo, islands.length - 1)] : null;
      const y = isl ? isl.y + 48 : 30; // distance up from the bottom of the content
      const top = Math.max(0, sc.scrollHeight - y - sc.clientHeight / 2);
      sc.scrollTo({ top, behavior: positioned.current ? 'smooth' : 'auto' });
      positioned.current = true;
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [hopTo, islands]);

  if (error) return <LoadError title="The climb" />;
  if (!data) return <Loading />;

  const prog = progressionFor(data.progress.xp);
  const height = BASE + islands.length * ROW + 150;
  const pos = hopTo ?? -1;
  const charIsland = pos >= 0 ? islands[Math.min(pos, islands.length - 1)] : null;
  // Stand on the grass beside the card rather than in front of it. The nudge is in pixels so it
  // stays the same distance on a phone and a laptop.
  const charX = charIsland ? charIsland.x : 50;
  const charOffset = charIsland ? (charIsland.index % 2 === 0 ? 72 : -72) - 22 : -22;
  const charY = charIsland ? charIsland.y + 48 : 30;
  const nextKey = nextStage(data.modules)?.key;
  const summitReached = clearedCount === islands.length && islands.length > 0;

  return (
    <section class="climb-wrap">
      <div class="climb-head">
        <ViewToggle active="climb" />
        <span class="climb-note muted small">
          Every island is one stage from the path. Clear it to move up.
        </span>
      </div>
      <div class="rank-bar">
        <div class="rank-avatar" style={{ '--rank-colour': prog.rank.colour }}>
          <Avatar colour={prog.rank.colour} />
          <span class="rank-level">{prog.rank.level}</span>
        </div>
        <div class="rank-meta">
          <div class="rank-title">{prog.rank.title}</div>
          <div class="bar thin">
            <div class="bar-fill" style={{ width: prog.pct + '%' }} />
          </div>
          <div class="muted small">
            {prog.next
              ? `${prog.intoRank} / ${prog.needed} XP to ${prog.next.title}`
              : 'Top of the ladder'}
          </div>
        </div>
        <div class="rank-count">
          <strong>{clearedCount}</strong>
          <span class="muted small">/ {islands.length} islands</span>
        </div>
      </div>

      <div class="climb-scroll" ref={scroller}>
        <div class="climb-sky" style={{ height: height + 'px' }}>
          <div class="stars" />
          <div class="cloud c1" />
          <div class="cloud c2" />
          <div class="cloud c3" />

          <div class="climb-lane" style={{ height: height + 'px' }}>
            <div class={'summit' + (summitReached ? ' reached' : '')} style={{ bottom: height - 96 + 'px' }}>
              <span class="summit-icon">{summitReached ? '🏆' : '🎯'}</span>
              <span class="summit-label">{summitReached ? 'Every island cleared' : 'The summit'}</span>
            </div>

            {islands.map((isl, n) => {
              const prev = islands[n - 1];
              return prev ? <Trail key={'t' + n} from={prev} to={isl} /> : null;
            })}

            {islands.map((isl) => (
              <IslandNode key={isl.stage.key} island={isl} isNext={isl.stage.key === nextKey} />
            ))}

            <div
              ref={charRef}
              class={'climber' + (landed ? ' landed' : '')}
              style={{ left: charX + '%', bottom: charY + 'px', marginLeft: charOffset + 'px' }}
            >
              <Avatar colour={prog.rank.colour} />
              <div class="climber-shadow" />
            </div>
          </div>

          <div class="ground">
            <span class="ground-label">Base camp</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Stepping stones between two islands, interpolated so they stay put on any screen width. */
function Trail({ from, to }: { from: Island; to: Island }) {
  const dots = [0.28, 0.5, 0.72];
  return (
    <>
      {dots.map((t, i) => (
        <span
          key={i}
          class="trail-dot"
          style={{
            left: from.x + (to.x - from.x) * t + '%',
            bottom: from.y + (to.y - from.y) * t + 34 + 'px',
          }}
        />
      ))}
    </>
  );
}

function IslandNode({ island, isNext }: { island: Island; isNext: boolean }) {
  const { stage, module: m } = island;
  const locked = stage.status === 'locked';
  const cleared = stage.status === 'cleared';
  const pct = stage.total ? Math.round((stage.nailed / stage.total) * 100) : 0;

  return (
    <button
      class={`island ${stage.tier} ${stage.status}${isNext ? ' next' : ''}`}
      style={{ left: island.x + '%', bottom: island.y + 'px' }}
      onClick={() => navigate(locked ? `module/${m.ref.id}` : `drill/${m.ref.id}/${stage.tier}`)}
    >
      <span class="island-card">
        <span class="island-icon">{locked ? '🔒' : cleared ? '🚩' : m.ref.icon}</span>
        <span class="island-name">{m.ref.short}</span>
        <span class={'island-tier ' + stage.tier}>{TIER_LABEL[stage.tier]}</span>
        {isNext && <span class="island-next">Next up</span>}
        {!locked && (
          <span class="island-progress">
            <span class="island-progress-fill" style={{ width: pct + '%' }} />
          </span>
        )}
      </span>
      <svg class="island-rock" viewBox="0 0 120 74" aria-hidden="true">
        <ellipse cx="60" cy="16" rx="52" ry="15" class="rock-top" />
        <path d="M8 16 C10 44, 30 66, 60 73 C90 66, 110 44, 112 16 Z" class="rock-body" />
        <path d="M26 30 q4 12 -2 20" class="rock-vine" />
        <path d="M92 28 q-5 14 1 22" class="rock-vine" />
      </svg>
    </button>
  );
}

/** The climber. A small figure in a tie, because the ranks are IB ranks. */
function Avatar({ colour }: { colour: string }) {
  return (
    <svg class="avatar" viewBox="0 0 40 46" aria-hidden="true">
      <ellipse cx="20" cy="43" rx="11" ry="3" class="avatar-shadow" />
      <path d="M9 40 V27 a11 11 0 0 1 22 0 v13 z" fill={colour} class="avatar-body" />
      <circle cx="20" cy="17" r="11" class="avatar-head" />
      <circle cx="16" cy="16" r="1.9" class="avatar-eye" />
      <circle cx="24" cy="16" r="1.9" class="avatar-eye" />
      <path d="M16.5 21.5 q3.5 3 7 0" class="avatar-smile" />
      <path d="M20 27 l-2.6 3 2.6 7 2.6 -7 z" class="avatar-tie" />
    </svg>
  );
}
