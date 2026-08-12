/// <reference lib="webworker" />
// Custom service worker (Workbox injectManifest). Strategy:
//  - precache app shell + content (self.__WB_MANIFEST, injected at build)
//  - StaleWhileRevalidate for content JSON/MD
//  - CacheFirst for .xlsx practice files (large, immutable; pinned once downloaded)
//  - navigation fallback to index.html (SPA offline)

import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare const self: ServiceWorkerGlobalScope;

// Injected at build time by vite-plugin-pwa.
precacheAndRoute(self.__WB_MANIFEST);

// Content files (lessons/decks/quizzes/glossary): fast offline, refresh in background.
registerRoute(
  ({ url }) =>
    url.pathname.startsWith('/content/') &&
    /\.(json|md)$/.test(url.pathname) &&
    !url.pathname.includes('/content/excel/files/'),
  new StaleWhileRevalidate({ cacheName: 'content-v1' }),
);

// .xlsx practice files: pin once fetched (pre-warmed via the "Download for offline" button).
registerRoute(
  ({ url }) => url.pathname.includes('/content/excel/files/'),
  new CacheFirst({
    cacheName: 'xlsx-files-v1',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 365 * 24 * 60 * 60 }),
    ],
  }),
);

// SPA navigation fallback: serve precached index.html offline.
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));

// Update flow: app sends SKIP_WAITING when the user taps the "reload to update" toast.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
