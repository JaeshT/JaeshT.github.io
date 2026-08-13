// The climber figure and its customiser. Everything is inline SVG so it works offline.

import {
  ACCENTS,
  DEFAULT_AVATAR,
  HAIRSTYLES,
  HAIR_COLOURS,
  SKINS,
  gearFor,
  nextGear,
  type AvatarConfig,
} from '../lib/avatar';
import { getSettings, setSettings } from '../lib/db';
import { useEffect, useState } from 'preact/hooks';
import { RANKS, progressionFor } from '../lib/levels';

export function Climber({
  config = DEFAULT_AVATAR,
  level = 1,
  size = 44,
}: {
  config?: AvatarConfig;
  level?: number;
  size?: number;
}) {
  const skin = SKINS[config.skin] ?? SKINS[0];
  const hairColour = HAIR_COLOURS[config.hairColour] ?? HAIR_COLOURS[0];
  const accent = ACCENTS[config.accent] ?? ACCENTS[0];
  const g = gearFor(level);
  const suit = g.jacket ? '#2b3242' : '#c8ced9';

  return (
    <svg class="climber-svg" width={size} height={size * 1.16} viewBox="0 0 40 46" aria-hidden="true">
      {g.briefcase && (
        <g class="gear-briefcase">
          <rect x="30" y="30" width="10" height="8" rx="1.5" fill="#5a4630" />
          <rect x="33.5" y="28.5" width="3" height="2" rx="1" fill="none" stroke="#5a4630" stroke-width="1.2" />
        </g>
      )}

      {/* body */}
      <path d="M9 40 V28 a11 11 0 0 1 22 0 v12 z" fill={suit} />
      {g.jacket && (
        <>
          <path d="M9 40 V28 a11 11 0 0 1 5 -8 l6 8 -6 12 z" fill="#212836" />
          <path d="M31 40 V28 a11 11 0 0 0 -5 -8 l-6 8 6 12 z" fill="#212836" />
        </>
      )}
      {!g.jacket && <path d="M14 21 l6 7 6 -7" fill="none" stroke="#aab2c0" stroke-width="1.2" />}

      {g.lanyard && !g.tie && (
        <>
          <path d="M15 21 L20 30 L25 21" fill="none" stroke={accent} stroke-width="1.6" />
          <rect x="17.5" y="29" width="5" height="6" rx="1" fill="#eef2f8" stroke={accent} stroke-width="0.8" />
        </>
      )}
      {g.tie && <path d="M20 27 l-2.6 3 2.6 7.5 2.6 -7.5 z" fill={accent} />}
      {g.pocketSquare && <rect x="24.5" y="30" width="4" height="2.4" rx="0.6" fill={accent} />}

      {/* head */}
      <circle cx="20" cy="16.5" r="10.5" fill={skin} />

      {/* hair */}
      {config.hair === 1 && <path d="M9.6 14 a10.5 10.5 0 0 1 20.8 0 q-4 -5 -10.4 -5 t-10.4 5 z" fill={hairColour} />}
      {config.hair === 2 && <path d="M9.6 14 a10.5 10.5 0 0 1 20.8 0 q-3 -6 -12 -4 q-5 1 -8.8 4 z" fill={hairColour} />}
      {config.hair === 3 && (
        <g fill={hairColour}>
          <circle cx="13" cy="9.5" r="4" /><circle cx="20" cy="7.5" r="4.4" /><circle cx="27" cy="9.5" r="4" />
        </g>
      )}
      {config.hair === 4 && (
        <g fill={hairColour}>
          <path d="M9.6 14 a10.5 10.5 0 0 1 20.8 0 q-4 -5 -10.4 -5 t-10.4 5 z" />
          <circle cx="20" cy="4" r="3.6" />
        </g>
      )}
      {config.hair === 5 && (
        <g fill={hairColour}>
          <path d="M9.6 14 a10.5 10.5 0 0 1 20.8 0 q-4 -5 -10.4 -5 t-10.4 5 z" />
          <path d="M9.5 13 q-1.5 9 0.5 14 l4 0 q-3 -7 -1.5 -14 z" />
          <path d="M30.5 13 q1.5 9 -0.5 14 l-4 0 q3 -7 1.5 -14 z" />
        </g>
      )}

      {/* face */}
      <circle cx="16.2" cy="16.5" r="1.7" fill="#21262f" />
      <circle cx="23.8" cy="16.5" r="1.7" fill="#21262f" />
      <path d="M16.6 21 q3.4 2.8 6.8 0" fill="none" stroke="#21262f" stroke-width="1.4" stroke-linecap="round" />

      {g.glasses && (
        <g fill="none" stroke="#21262f" stroke-width="1.1" opacity="0.85">
          <circle cx="16.2" cy="16.4" r="3.4" /><circle cx="23.8" cy="16.4" r="3.4" />
          <path d="M19.6 16.4 h0.8" />
        </g>
      )}
      {g.crown && (
        <path d="M12.5 5.5 l2.5 3 2.5 -4 2.5 4 2.5 -4 2.5 4 2.5 -3 -1 5 h-13 z" fill="#ffd166" stroke="#c9a227" stroke-width="0.7" />
      )}
      {g.coffee && (
        <g class="gear-coffee">
          <rect x="0.5" y="29" width="7" height="9" rx="1.2" fill="#f2f3f5" />
          <rect x="0.5" y="29" width="7" height="2.6" rx="1.2" fill="#8a5a36" />
        </g>
      )}
    </svg>
  );
}

/** Pick appearance. Gear is not pickable, so the panel says what unlocks next instead. */
export function AvatarCustomiser() {
  const [cfg, setCfg] = useState<AvatarConfig | null>(null);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    (async () => {
      const [s, { getProgress }] = await Promise.all([getSettings(), import('../lib/db')]);
      setCfg(s.avatar ?? DEFAULT_AVATAR);
      setXp((await getProgress()).xp);
    })();
  }, []);

  if (!cfg) return null;
  const prog = progressionFor(xp);
  const level = prog.rank.level;

  async function update(patch: Partial<AvatarConfig>) {
    const next = { ...cfg!, ...patch };
    setCfg(next);
    const s = await getSettings();
    await setSettings({ ...s, avatar: next });
  }

  const rows: { label: string; options: string[]; key: keyof AvatarConfig; swatch: boolean }[] = [
    { label: 'Skin', options: SKINS, key: 'skin', swatch: true },
    { label: 'Hair', options: HAIRSTYLES, key: 'hair', swatch: false },
    { label: 'Hair colour', options: HAIR_COLOURS, key: 'hairColour', swatch: true },
    { label: 'Accent', options: ACCENTS, key: 'accent', swatch: true },
  ];

  return (
    <div class="customiser">
      <div class="customiser-preview">
        <Climber config={cfg} level={level} size={96} />
        <div>
          <div class="rank-title">{prog.rank.title}</div>
          <div class="muted small">Level {level} of {RANKS.length}</div>
          <div class="muted small gear-next">
            {nextGear(level) ? `Next rank unlocks: ${nextGear(level)}` : 'All gear unlocked'}
          </div>
        </div>
      </div>

      {rows.map((row) => (
        <div key={row.key} class="customiser-row">
          <div class="muted small">{row.label}</div>
          <div class="chips">
            {row.options.map((opt, i) => (
              <button
                key={i}
                class={'swatch' + (cfg[row.key] === i ? ' on' : '') + (row.swatch ? '' : ' text')}
                style={row.swatch ? { background: opt } : undefined}
                onClick={() => update({ [row.key]: i } as Partial<AvatarConfig>)}
                title={row.swatch ? row.label : opt}
              >
                {row.swatch ? '' : opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div class="gear-list">
        {RANKS.map((r) => (
          <div key={r.level} class={'gear-row' + (level >= r.level ? ' have' : '')}>
            <span class="gear-lvl">{r.level}</span>
            <span>{r.title}</span>
            <span class="muted small">{nextGear(r.level - 1) ?? 'Starting kit'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
