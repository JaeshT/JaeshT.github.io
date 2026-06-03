// Tiny hash router (GitHub Pages-safe, no server rewrites, trivial offline fallback).
import { useEffect, useState } from 'preact/hooks';

export function currentRoute(): string {
  const h = window.location.hash.replace(/^#\/?/, '');
  return h || 'home';
}

export function navigate(route: string): void {
  window.location.hash = '/' + route;
}

export function useRoute(): string {
  const [route, setRoute] = useState(currentRoute());
  useEffect(() => {
    const onHash = () => {
      setRoute(currentRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}
