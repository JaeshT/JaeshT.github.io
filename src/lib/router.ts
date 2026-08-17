// Tiny hash router (GitHub Pages-safe, no server rewrites, trivial offline fallback).
// Routes are slash-delimited paths, e.g. "lesson/fe-waterfalls" or "tools/waterfall".
import { useEffect, useState } from 'preact/hooks';

export function currentPath(): string {
  const h = window.location.hash.replace(/^#\/?/, '');
  return h || 'home';
}

export function navigate(path: string): void {
  window.location.hash = '/' + path;
}

/** Full current path (e.g. "lesson/fe-waterfalls"). */
export function useRoute(): string {
  const [path, setPath] = useState(currentPath());
  useEffect(() => {
    const onHash = () => {
      setPath(currentPath());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return path;
}

/** Split a path into segments: "lesson/fe-x" -> ["lesson", "fe-x"]. */
export function segments(path: string): string[] {
  return path.split('/').filter(Boolean);
}

// ---- which ladder view you came from ----
//
// The path and the climb show the same stages, but they reach a drill differently: the path goes
// through the module page, the climb opens the drill directly. Without remembering which one you
// were on, a drill started from the climb sends you "back" to the module page and from there to
// the path, so you end up in a section you were never in. Session-scoped, because it describes
// this visit rather than a preference worth keeping.

export type LadderView = 'path' | 'climb';
const LADDER_KEY = 'ib-ladder-view';

export function rememberLadderView(view: LadderView): void {
  try {
    sessionStorage.setItem(LADDER_KEY, view);
  } catch {
    // Private browsing can refuse storage. Falling back to the default is fine.
  }
}

export function lastLadderView(): LadderView {
  try {
    return sessionStorage.getItem(LADDER_KEY) === 'climb' ? 'climb' : 'path';
  } catch {
    return 'path';
  }
}
