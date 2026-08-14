import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

const mockAuthInstance = {
  currentUser: null,
  signOut: jest.fn(),
};

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => mockAuthInstance),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

const mockFirestoreInstance = {};

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => mockFirestoreInstance),
  collection: jest.fn(),
  doc: jest.fn((_db, col, id) => ({ _path: `${col}/${id}` })),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false, data: () => null })),
  getDocs: jest.fn(() => Promise.resolve({ empty: true, forEach: jest.fn() })),
  onSnapshot: jest.fn((_ref, onNext) => {
    onNext({ exists: () => false, data: () => null });
    return jest.fn(); // unsubscribe
  }),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

const mockFunctionsInstance = {};

jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn(() => mockFunctionsInstance),
  httpsCallable: jest.fn(),
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
env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'rzp_test_mock_123456';
