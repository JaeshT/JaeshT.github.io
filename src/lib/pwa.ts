// Manual SW registration (injectRegister: null in vite config) so we control the update UX.
import { registerSW } from 'virtual:pwa-register';

export type UpdateHandler = () => void;

/** Registers the service worker. Calls onNeedRefresh when a new version is waiting. */
export function setupPWA(onNeedRefresh: UpdateHandler): () => void {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      onNeedRefresh();
    },
  });
  // Returns a function the UI calls to activate the waiting SW and reload.
  return () => updateSW(true);
}

/** iOS standalone (home-screen) detection: used to hide the "Add to Home Screen" hint. */
export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
