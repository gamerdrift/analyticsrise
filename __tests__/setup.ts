import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
}));

// Mock environment variables
const env = process.env as any;
env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-key';
env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-bucket.appspot.com';
env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789';
env.NEXT_PUBLIC_FIREBASE_APP_ID = 'test-app-id';
