/// <reference types="vite/client" />

// Firebase web config, read at build time. Absent means accounts are off and the app is purely
// local, which is a supported way to run it. None of these are secrets: see src/lib/firebase.ts.
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
