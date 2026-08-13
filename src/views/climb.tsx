// The Climb: the curriculum drawn as a mountain route.
//
// A module is a LEVEL and its three tiers are its SUBLEVELS, so the route runs
// accounting easy, medium, hard, then on to the next module. That matches the gating in
// curriculum.ts, where finishing a module's hard tier is what opens the next module.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { navigate } from '../lib/router';
import { getSettings, updateProgress } from '../lib/db';
import { TIERS, TIER_LABEL } from '../lib/schema';
import { nextStage, stageKey, type ModuleState, type Stage } from '../lib/curriculum';
import { useLadder } from '../lib/useLadder';
import { progressionFor } from '../lib/levels';
import { DEFAULT_AVATAR, nextGear, type AvatarConfig } from '../lib/avatar';
import { Climber } from './avatar';
import { Loading, LoadError, ViewToggle } from './ui';

const ROW = 140; // vertical pitch between sublevels, px
const BAND_GAP = 74; // extra space between one module and the next
const BASE = 96; // ground strip height, px
const LEFT = 28;
const RIGHT = 72;

interface Island {
  stage: Stage;
  module: ModuleState;
  index: number;
  tierIndex: number; // 0,1,2 within its module
  x: number;
  y: number;
}

interface Band {
  module: ModuleState;
  level: number;
  y: number; // marker position
  islands: Island[];
}

function buildRoute(modules: ModuleState[]): { islands: Island[]; bands: Band[] } {
  const islands: Island[] = [];
  const bands: Band[] = [];
  let y = BASE;
  let level = 0;

  for (const m of modules) {
    // Core and fit both climb. Sector desks are electives and sit off the main route.
    if (!m.ready || m.ref.track === 'sector') continue;
    const stages = TIERS.map((t) => m.stages.find((s) => s.tier === t)).filter(
      (s): s is Stage => !!s && s.total > 0,
    );
    if (stages.length === 0) continue;

    level += 1;
    const bandIslands: Island[] = [];
    const markerY = y - 34;
    stages.forEach((stage, tierIndex) => {
      const index = islands.length;
      const isl: Island = {
        stage,
        module: m,
        index,
        tierIndex,
        x: index % 2 === 0 ? LEFT : RIGHT,
        y,
      };
      islands.push(isl);
      bandIslands.push(isl);
      y += ROW;
    });
    bands.push({ module: m, level, y: markerY, islands: bandIslands });
    y += BAND_GAP;
  }
  return { islands, bands };
}

export function Climb() {
  const { data, error } = useLadder();
  const [hopTo, setHopTo] = useState<number | null>(null);
  const [landed, setLanded] = useState(false);
  const [info, setInfo] = useState<Island | null>(null);
  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getSettings().then((s) => setAvatar(s.avatar ?? DEFAULT_AVATAR));
  }, []);

  const route = useMemo(() => (data ? buildRoute(data.modules) : { islands: [], bands: [] }), [data]);
  const { islands, bands } = route;
  const clearedCount = islands.filter((i) => i.stage.status === 'cleared').length;
  // Stand on the highest island actually cleared, which is not the same as the count once a
  // stage has been opened early and cleared out of order.
  const target = islands.reduce((hi, i) => (i.stage.status === 'cleared' ? i.index : hi), -1);

  // Hop the climber up to where it belongs, one island at a time, once per newly cleared stage.
  useEffect(() => {
    if (!data || islands.length === 0) return;
    const seen = data.progress.climbSeen ?? -1;
    const from = Math.min(seen, target);
    setHopTo(from);
    if (from >= target) {
      setHopTo(target);
      return;
    }
    const timers: number[] = [];
    for (let step = from + 1; step <= target; step++) {
      const at = step;
      timers.push(
        window.setTimeout(() => {
          setHopTo(at);
          setLanded(true);
          window.setTimeout(() => setLanded(false), 420);
        }, (at - from) * 620),
      );
    }
    timers.push(
      window.setTimeout(() => {
        updateProgress((p) => ({ ...p, climbSeen: target }));
      }, (target - from) * 620 + 500),
    );
    return () => timers.forEach(clearTimeout);
  }, [data, islands.length, target]);

  // Follow the climber. Driving the scroller beats scrollIntoView here, because everything is
  // positioned from the bottom of a very tall container.
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
      const y = isl ? isl.y + 48 : 30;
      sc.scrollTo({
        top: Math.max(0, sc.scrollHeight - y - sc.clientHeight / 2),
        behavior: positioned.current ? 'smooth' : 'auto',
      });
      positioned.current = true;
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [hopTo, islands]);

  // Hide the tab bar while climbing up the map, bring it back on the way down, when the pointer
  // approaches the bottom of the window, or after a moment of stillness.
  const lastScroll = useRef(0);
  const idleTimer = useRef(0);
  const showTabs = () => document.documentElement.classList.remove('tabs-hidden');
  const onScroll = (e: Event) => {
    const sc = e.currentTarget as HTMLDivElement;
    const y = sc.scrollTop;
    if (y > lastScroll.current + 6) showTabs();
    else if (y < lastScroll.current - 6) document.documentElement.classList.add('tabs-hidden');
    lastScroll.current = y;
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(showTabs, 1800);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (window.innerHeight - e.clientY < 90) showTabs();
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.clearTimeout(idleTimer.current);
      showTabs();
    };
  }, []);

  if (error) return <LoadError title="The climb" />;
  if (!data) return <Loading />;

  const prog = progressionFor(data.progress.xp);
  const height = (islands.at(-1)?.y ?? BASE) + 210;
  const pos = hopTo ?? -1;
  const charIsland = pos >= 0 ? islands[Math.min(pos, islands.length - 1)] : null;
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
          One level per module, three sublevels each. Clear hard to unlock the next level.
        </span>
      </div>

      <div class="climb-scroll" ref={scroller} onScroll={onScroll}>
        <div class="climb-sky" style={{ height: height + 'px' }}>
          <div class="stars" />
          <div class="cloud c1" />
          <div class="cloud c2" />
          <div class="cloud c3" />

          <div class="climb-lane" style={{ height: height + 'px' }}>
            <div class={'summit' + (summitReached ? ' reached' : '')} style={{ bottom: height - 110 + 'px' }}>
              <span class="summit-icon">{summitReached ? '🏆' : '🎯'}</span>
              <span class="summit-label">{summitReached ? 'Every level cleared' : 'The summit'}</span>
            </div>

            {bands.map((b) => (
              <div key={b.module.ref.id} class={'band-marker ' + b.module.status} style={{ bottom: b.y + 'px' }}>
                <span class="band-line" />
                <span class="band-label">
                  Level {b.level} · {b.module.ref.short}
                </span>
                <span class="band-line" />
              </div>
            ))}

            {islands.map((isl, n) => {
              const prev = islands[n - 1];
              return prev ? <Trail key={'t' + n} from={prev} to={isl} /> : null;
            })}

            {islands.map((isl) => (
              <IslandNode
                key={isl.stage.key}
                island={isl}
                isNext={isl.stage.key === nextKey}
                onOpen={() => setInfo(isl)}
              />
            ))}

            <div
              class={'climber' + (landed ? ' landed' : '')}
              style={{ left: charX + '%', bottom: charY + 'px', marginLeft: charOffset + 'px' }}
            >
              <Climber config={avatar} level={prog.rank.level} size={44} />
              <div class="climber-shadow" />
            </div>
          </div>

          <div class="ground">
            <span class="ground-label">Base camp</span>
          </div>
        </div>
      </div>

      {/* Floating rank badge: always on screen, expands for the detail. */}
      <div class={'rank-float' + (badgeOpen ? ' open' : '')}>
        <button
          class="rank-float-btn"
          style={{ '--rank-colour': prog.rank.colour }}
          onClick={() => setBadgeOpen((v) => !v)}
          aria-expanded={badgeOpen}
        >
          <Climber config={avatar} level={prog.rank.level} size={38} />
          <span class="rank-float-lvl">{prog.rank.level}</span>
          <svg class="rank-ring" viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="20" class="rank-ring-bg" />
            <circle
              cx="22"
              cy="22"
              r="20"
              class="rank-ring-fill"
              style={{ stroke: prog.rank.colour, strokeDasharray: 125.6, strokeDashoffset: 125.6 * (1 - prog.pct / 100) }}
            />
          </svg>
        </button>

        {badgeOpen && (
          <div class="rank-panel">
            <div class="rank-panel-title">{prog.rank.title}</div>
            <div class="bar thin">
              <div class="bar-fill" style={{ width: prog.pct + '%' }} />
            </div>
            <div class="muted small">
              {prog.next ? `${prog.intoRank} / ${prog.needed} XP to ${prog.next.title}` : 'Top of the ladder'}
            </div>
            {prog.next && nextGear(prog.rank.level) && (
              <div class="muted small">Unlocks {nextGear(prog.rank.level)}</div>
            )}
            <div class="rank-panel-stats">
              <span>
                <strong>{clearedCount}</strong>/{islands.length} sublevels
              </span>
              <span>
                <strong>{data.progress.streak.count}</strong> day streak
              </span>
            </div>
            <button class="btn btn-ghost small" onClick={() => navigate('character')}>
              Customise climber
            </button>
          </div>
        )}
      </div>

      {info && <IslandInfo island={info} onClose={() => setInfo(null)} />}
    </section>
  );
}

function Trail({ from, to }: { from: Island; to: Island }) {
  const dots = [0.3, 0.5, 0.7];
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

function IslandNode({
  island,
  isNext,
  onOpen,
}: {
  island: Island;
  isNext: boolean;
  onOpen: () => void;
}) {
  const { stage, module: m } = island;
  const locked = stage.status === 'locked';
  const cleared = stage.status === 'cleared';
  const pct = stage.total ? Math.round((stage.nailed / stage.total) * 100) : 0;

  return (
    <button
      class={`island ${stage.tier} ${stage.status}${isNext ? ' next' : ''}`}
      style={{ left: island.x + '%', bottom: island.y + 'px' }}
      onClick={onOpen}
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

/** Tapping an island explains it rather than navigating away. */
function IslandInfo({ island, onClose }: { island: Island; onClose: () => void }) {
  const { stage, module: m, tierIndex } = island;
  const locked = stage.status === 'locked';
  const pct = stage.total ? Math.round((stage.nailed / stage.total) * 100) : 0;
  const prevTier = tierIndex > 0 ? TIERS[TIERS.indexOf(stage.tier) - 1] : null;

  async function openAnyway() {
    const key = stageKey(m.ref.id, stage.tier);
    await updateProgress((p) => ({
      ...p,
      unlockedEarly: p.unlockedEarly.includes(key) ? p.unlockedEarly : [...p.unlockedEarly, key],
    }));
    onClose();
    navigate(`drill/${m.ref.id}/${stage.tier}`);
  }

  return (
    <div class="sheet-backdrop" onClick={onClose}>
      <div class="sheet" onClick={(e) => e.stopPropagation()}>
        <div class="sheet-head">
          <span class="sheet-icon">{m.ref.icon}</span>
          <div>
            <div class="sheet-title">{m.ref.title}</div>
            <div class="muted small">
              <span class={'tier-badge ' + stage.tier}>{TIER_LABEL[stage.tier]}</span>{' '}
              sublevel {tierIndex + 1} of 3
            </div>
          </div>
          <button class="sheet-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <p class="muted small sheet-blurb">{m.ref.blurb}</p>

        <div class="sheet-stats">
          <div>
            <strong>{stage.total}</strong>
            <span class="muted small">questions</span>
          </div>
          <div>
            <strong>{stage.nailed}</strong>
            <span class="muted small">nailed</span>
          </div>
          <div>
            <strong>{Math.round(stage.strength * 100)}%</strong>
            <span class="muted small">strength</span>
          </div>
        </div>

        <div class="bar">
          <div class="bar-fill" style={{ width: pct + '%' }} />
        </div>
        <p class="muted small">
          {stage.status === 'cleared'
            ? 'Cleared. Running it again keeps it fresh and pushes back the review dates.'
            : locked
              ? prevTier
                ? `Locked. Clear the ${TIER_LABEL[prevTier].toLowerCase()} sublevel first, or open it early.`
                : 'Locked. Finish the level below to unlock it, or open it early.'
              : `Clear ${Math.max(0, Math.ceil(stage.total * 0.8) - stage.nailed)} more to complete this sublevel.`}
        </p>

        <div class="sheet-actions">
          {locked ? (
            <button class="btn btn-ghost" onClick={openAnyway}>
              Open anyway
            </button>
          ) : (
            <button class="btn btn-primary" onClick={() => navigate(`drill/${m.ref.id}/${stage.tier}`)}>
              {stage.nailed === 0 ? 'Start' : 'Continue'} drilling
            </button>
          )}
          <button class="btn btn-ghost" onClick={() => navigate(`module/${m.ref.id}`)}>
            Level detail
          </button>
        </div>
      </div>
    </div>
  );
}
