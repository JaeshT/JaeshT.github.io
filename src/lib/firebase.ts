// Firebase bootstrap. Accounts are OPTIONAL: with no config the app behaves exactly as it always
// has, everything in IndexedDB on the device. With config, signing in syncs that same state.
//
// The SDK is loaded through dynamic imports so it lands in its own chunk and never costs anything
// on first paint. Only types are imported at the top level, and those disappear at compile time.
//
// These values are not secrets. A Firebase web config is public in every client that ships it;
// what protects the data is the Firestore rules (each user can only touch their own document) and
// the authorised-domain list on the project.

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore/lite';

const env = import.meta.env;

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
};

/** Whether this build has a project behind it. Everything account-shaped checks this first. */
export const cloudConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
);

export interface FirebaseHandles {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

let handles: Promise<FirebaseHandles> | null = null;

export function firebase(): Promise<FirebaseHandles> {
  if (!cloudConfigured) return Promise.reject(new Error('Firebase is not configured for this build'));
  if (!handles) {
    handles = (async () => {
      const [{ initializeApp }, { getAuth, setPersistence, browserLocalPersistence }, { getFirestore }] =
        await Promise.all([
          import('firebase/app'),
          import('firebase/auth'),
          import('firebase/firestore/lite'),
        ]);
      const app = initializeApp(config as Required<typeof config>);
      const auth = getAuth(app);
      // Survive a reload and an app relaunch; without this a PWA asks you to sign in every time.
      await setPersistence(auth, browserLocalPersistence).catch(() => {});
      return { app, auth, db: getFirestore(app) };
    })();
  }
  return handles;
}
