// Light and dark, sharing one design language.
//
// The preference lives in settings (so it syncs with the account), but settings come from
// IndexedDB, which is async and therefore too late to stop a flash of the wrong theme on load.
// So the resolved value is mirrored into localStorage and read by a tiny script in index.html
// before the first paint. localStorage is the cache; settings remain the source of truth.

export type ThemePref = 'system' | 'light' | 'dark';
export type Theme = 'light' | 'dark';

export const THEME_KEY = 'ib-theme'; // must match the inline script in index.html

/** Older settings stored only 'light' or 'dark'; both are still valid preferences. */
export function normalisePref(value: unknown): ThemePref {
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
}

export function systemTheme(): Theme {
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

export function resolveTheme(pref: ThemePref): Theme {
  return pref === 'system' ? systemTheme() : pref;
}

/** Paint the theme: the attribute drives the CSS, color-scheme drives native form controls. */
export function applyTheme(pref: ThemePref): Theme {
  const theme = resolveTheme(pref);
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_KEY, pref);
  } catch {
    // private mode or storage full: the theme still applies for this session
  }
  // The browser chrome on iOS reads this, so it has to move with the page.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f3f0e7' : '#111823');
  return theme;
}

let stopWatching: (() => void) | null = null;

/**
 * Apply a preference and, when it is "system", keep following the OS until the preference
 * changes again. Returns the theme actually in effect.
 */
export function setThemePref(pref: ThemePref): Theme {
  stopWatching?.();
  stopWatching = null;
  const theme = applyTheme(pref);
  if (pref === 'system' && typeof matchMedia === 'function') {
    const mq = matchMedia('(prefers-color-scheme: light)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    stopWatching = () => mq.removeEventListener('change', onChange);
  }
  return theme;
}

/** What the inline script already put on the page, so the UI can render in the right state. */
export function currentPref(): ThemePref {
  try {
    return normalisePref(localStorage.getItem(THEME_KEY));
  } catch {
    return 'system';
  }
}
