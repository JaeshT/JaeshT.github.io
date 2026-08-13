import { defineConfig, loadEnv } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

// Apex custom domain (tewess.com), served at root → base '/'.
export default defineConfig(({ mode }) => {
  // Accounts are optional. A build with no Firebase config still emits the SDK chunk, since the
  // dynamic import is in the source either way, but it will never be fetched, so keep it out of
  // the offline pack rather than making people download 400 KB they cannot use.
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const accountsOn = Boolean(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID);

  return {
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
          globPatterns: ['**/*.{js,css,html,svg,png,ico,json,md,webmanifest,woff,woff2,ttf}'],
          // .xlsx handled at runtime (CacheFirst): don't bloat the precache.
          globIgnores: ['**/content/excel/files/**', ...(accountsOn ? [] : ['**/assets/firebase-*.js'])],
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
      rollupOptions: {
        output: {
          // One predictably named chunk for the SDK, so the precache rule above can find it.
          manualChunks(id: string) {
            if (/node_modules\/(@firebase|firebase)\//.test(id)) return 'firebase';
            return undefined;
          },
        },
      },
    },
  };
});
