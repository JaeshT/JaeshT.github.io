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
