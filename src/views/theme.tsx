// Theme controls: a quick toggle in the header, and the full choice under More.
//
// The preference lives in settings so it travels with the account, but it is applied through
// theme.ts, which also mirrors it to localStorage so the next launch paints correctly first time.

import { useEffect, useState } from 'preact/hooks';
import { getSettings, setSettings } from '../lib/db';
import {
  currentPref,
  normalisePref,
  resolveTheme,
  setThemePref,
  type ThemePref,
} from '../lib/theme';

/** Reads the stored preference on mount and keeps every mounted control in step. */
const listeners = new Set<(p: ThemePref) => void>();

export function useThemePref(): [ThemePref, (p: ThemePref) => void] {
  const [pref, setPref] = useState<ThemePref>(currentPref);

  useEffect(() => {
    listeners.add(setPref);
    // Settings are the source of truth, so reconcile once they load. Applying unconditionally
    // matters even when the value already matches: that call is what starts following the OS.
    getSettings().then((s) => {
      const stored = normalisePref(s.theme);
      setThemePref(stored);
      for (const fn of listeners) fn(stored);
    });
    return () => {
      listeners.delete(setPref);
    };
  }, []);

  async function choose(next: ThemePref) {
    setThemePref(next);
    for (const fn of listeners) fn(next);
    const s = await getSettings();
    await setSettings({ ...s, theme: next });
  }

  return [pref, choose];
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path
        stroke-linecap="round"
        d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M6.3 6.3 4.8 4.8M19.2 19.2l-1.5-1.5M17.7 6.3l1.5-1.5M4.8 19.2l1.5-1.5"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path
        stroke-linejoin="round"
        d="M20 13.4A8.4 8.4 0 1 1 10.6 4a6.6 6.6 0 0 0 9.4 9.4z"
      />
    </svg>
  );
}

/** Header button: flips straight to the other side, which is what a one-tap control should do. */
export function ThemeButton() {
  const [pref, choose] = useThemePref();
  const showing = resolveTheme(pref);
  const next = showing === 'dark' ? 'light' : 'dark';
  return (
    <button
      class="theme-btn"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      onClick={() => choose(next)}
    >
      {showing === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

const OPTIONS: { value: ThemePref; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

/** The full choice, including following the operating system. */
export function ThemeChoice() {
  const [pref, choose] = useThemePref();
  return (
    <div class="theme-choice">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          class={'theme-opt' + (pref === o.value ? ' on' : '')}
          aria-pressed={pref === o.value}
          onClick={() => choose(o.value)}
        >
          <span class={'theme-swatch ' + o.value} />
          {o.label}
        </button>
      ))}
    </div>
  );
}
