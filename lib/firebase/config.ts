import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCPiZMUXl9YvLO9vxBjfGk29v0u8vYnlRI',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'analyticsrise-56655.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'analyticsrise-56655',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'analyticsrise-56655.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '315119640336',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:315119640336:web:ec48bd74939abeee320f95',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-3JL184D4K3',
};

/**
 * Initialize Firebase App
 * Prevents multiple initializations in development mode
 */
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/**
 * Firebase Services
 */
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Analytics (only initialize in production browser runtime)
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    getAnalytics(app);
  } catch (e) {
    // Suppress analytics init errors in non-browser environments
  }
}

export default app;
