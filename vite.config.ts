import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

// Apex custom domain (tewess.com), served at root → base '/'.
export default defineConfig({
  base: '/',
  plugins: [
    preact(),
    VitePWA({
      // Custom service worker (src/sw.ts) so we control caching for content + .xlsx.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      // "prompt": never silently swap chunks mid-session (white-screens iOS). We show a reload toast.
      registerType: 'prompt',
      injectRegister: null, // we register manually in src/lib/pwa.ts
      manifest: false, // we ship our own public/manifest.webmanifest + iOS meta tags
      injectManifest: {
        // Precache app shell + content JSON + markdown so first offline launch has everything.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json,md,webmanifest}'],
        // .xlsx handled at runtime (CacheFirst) — don't bloat the precache.
        globIgnores: ['**/content/excel/files/**'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      devOptions: {
        enabled: false, // SW off in dev to avoid stale-cache headaches while building
        type: 'module',
      },
    }),
  ],
  build: {
    target: 'es2022',
    sourcemap: false,
  },
});
