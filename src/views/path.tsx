// The Path: the curriculum ladder and the detail screen for one module.
// Every rung shows three tier pips: easy, medium, hard, and you climb them in order.

import { lastLadderView, navigate } from '../lib/router';
import { updateProgress } from '../lib/db';
import { TIERS, TIER_LABEL, type Tier } from '../lib/schema';
import { stageKey, type ModuleState, type Stage } from '../lib/curriculum';
import { useLadder } from '../lib/useLadder';
import { Loading, LoadError, BackLink, Empty, ViewToggle } from './ui';

const TRACK_HEADING: Record<string, string> = {
  core: 'Core ladder',
  fit: 'Fit & story',
  sector: 'Sector desks',
};

export function Path() {
  const { data, error } = useLadder();
  if (error) return <LoadError title="Path" />;
  if (!data) return <Loading />;

  const tracks: ('core' | 'fit' | 'sector')[] = ['core', 'fit', 'sector'];

  return (
    <section>
      <div class="path-head">
        <h1>The path</h1>
        <ViewToggle active="path" />
      </div>
      <p class="muted">
        Every question sits in a module and a tier. Clear <strong>easy</strong> to open{' '}
        <strong>medium</strong>, clear medium to open <strong>hard</strong>, and finishing a
        module's easy tier also opens the next module. The <strong>Climb</strong> tab shows these
        same stages as a map.
      </p>

      {tracks.map((track) => {
        const mods = data.modules.filter((m) => m.ref.track === track);
        if (mods.length === 0) return null;
        return (
          <div key={track} class="track">
            <h2 class="section-h">{TRACK_HEADING[track]}</h2>
            {mods.map((m) => (
              <ModuleRow key={m.ref.id} m={m} />
            ))}
          </div>
        );
      })}
    </section>
  );
}

function ModuleRow({ m }: { m: ModuleState }) {
  const pct = Math.round(m.strength * 100);
  return (
    <button
      class={'rung' + (m.ready ? '' : ' unbuilt') + (m.status === 'cleared' ? ' cleared' : '')}
      onClick={() => m.ready && navigate(`module/${m.ref.id}`)}
      disabled={!m.ready}
    >
      <span class="rung-icon">{m.ref.icon}</span>
      <span class="rung-body">
        <span class="rung-title">
          {m.ref.short}
          {!m.ready && <span class="pill">soon</span>}
        </span>
        {m.ready ? (
          <span class="pips">
            {m.stages.map((s) => (
              <span key={s.tier} class={'pip ' + s.tier + ' ' + s.status} title={`${TIER_LABEL[s.tier]}: ${s.status}`}>
                {s.status === 'cleared' ? '✓' : s.status === 'locked' ? '🔒' : `${s.nailed}/${s.total}`}
              </span>
            ))}
          </span>
        ) : (
          <span class="muted small">{m.ref.blurb}</span>
        )}
      </span>
      {m.ready && <span class="rung-pct muted small">{pct}%</span>}
    </button>
  );
}

export function ModuleView({ id }: { id: string }) {
  const { data, error, reload } = useLadder();
  if (error) return <LoadError title="Module" back="path" />;
  if (!data) return <Loading />;

  const m = data.modules.find((x) => x.ref.id === id);
  if (!m) return <Empty title="Module" note="That module doesn't exist." back="path" />;

  return (
    <section>
      <BackLink
        to={lastLadderView()}
        label={lastLadderView() === 'climb' ? 'Climb' : 'Path'}
      />
      <h1>
        {m.ref.icon} {m.ref.title}
      </h1>
      <p class="muted">{m.ref.blurb}</p>

      {(m.ref.lessons ?? []).length > 0 && (
        <>
          <h2 class="section-h">Primers</h2>
          <ul class="list">
            {(m.ref.lessons ?? []).map((l) => (
              <li key={l.id} onClick={() => navigate(`lesson/${l.id}`)}>
                <span>📖 {l.title}</span>
                <span class="row-meta">
                  {data.progress.lessonsRead.includes(l.id) && <span class="pill ok">read</span>}
                  {l.estMinutes ? <span class="muted small">{l.estMinutes}m</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 class="section-h">Stages</h2>
      {m.stages.map((s) => (
        <StageCard key={s.tier} stage={s} moduleId={m.ref.id} prevTier={prevTierOf(s.tier)} onUnlock={reload} />
      ))}
    </section>
  );
}

function prevTierOf(t: Tier): Tier | null {
  const i = TIERS.indexOf(t);
  return i > 0 ? TIERS[i - 1] : null;
}

function StageCard({
  stage,
  moduleId,
  prevTier,
  onUnlock,
}: {
  stage: Stage;
  moduleId: string;
  prevTier: Tier | null;
  onUnlock: () => void;
}) {
  const pct = stage.total ? Math.round((stage.nailed / stage.total) * 100) : 0;

  async function openAnyway() {
    const key = stageKey(moduleId, stage.tier);
    await updateProgress((p) => ({
      ...p,
      unlockedEarly: p.unlockedEarly.includes(key) ? p.unlockedEarly : [...p.unlockedEarly, key],
    }));
    onUnlock();
  }

  if (stage.total === 0) {
    return (
      <div class="stage-card empty">
        <div class="stage-top">
          <span class={'tier-badge ' + stage.tier}>{TIER_LABEL[stage.tier]}</span>
          <span class="muted small">not written yet</span>
        </div>
      </div>
    );
  }

  return (
    <div class={'stage-card ' + stage.status}>
      <div class="stage-top">
        <span class={'tier-badge ' + stage.tier}>{TIER_LABEL[stage.tier]}</span>
        <span class="muted small">
          {stage.nailed}/{stage.total} nailed
          {stage.status === 'cleared' ? ' · cleared ✓' : ''}
          {stage.earnedEarly && stage.status !== 'cleared' ? ' · opened early' : ''}
        </span>
      </div>
      <div class="bar">
        <div class="bar-fill" style={{ width: pct + '%' }} />
      </div>
      {stage.status === 'locked' ? (
        <div class="stage-locked">
          <span class="muted small">
            🔒 Clear {prevTier ? TIER_LABEL[prevTier].toLowerCase() : 'the previous module'} first.
          </span>
          <button class="btn btn-ghost small" onClick={openAnyway}>
            Open anyway
          </button>
        </div>
      ) : (
        <button class="btn btn-primary" onClick={() => navigate(`drill/${moduleId}/${stage.tier}`)}>
          {stage.nailed === 0 ? 'Start' : stage.status === 'cleared' ? 'Run it again' : 'Continue'} →
        </button>
      )}
    </div>
  );
}
