import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// NOTE: these key names must match .env / .env.example exactly.
// Vite returns `undefined` for unknown keys instead of throwing,
// so a typo here fails silently. The check below turns that into
// a loud error in development.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const REQUIRED_CONFIG_KEYS = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = REQUIRED_CONFIG_KEYS.filter((key) => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  const message = `[Firebase] Missing environment variables: ${missingKeys
    .map((key) => `VITE_FIREBASE_${key.replace(/[A-Z]/g, (c) => `_${c}`).toUpperCase()}`)
    .join(', ')}`;

  if (import.meta.env.DEV) {
    // Fail fast locally so you notice immediately.
    throw new Error(message);
  }
  // In production, log rather than throw: a bad deploy should still
  // render something you can debug, not a blank white screen.
  console.error(message);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;
