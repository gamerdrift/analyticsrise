import { auth } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

type FirebaseUserCredential = Awaited<ReturnType<typeof signInWithEmailAndPassword>>;

/**
 * Authentication Service
 * 
 * Exposes methods to log in, register, and sign out using Firebase Auth.
 */
export const AuthService = {
  /**
   * Log in with Email and Password
   */
  async loginWithEmail(email: string, pass: string): Promise<FirebaseUserCredential> {
    return signInWithEmailAndPassword(auth, email, pass);
  },

  /**
   * Register a new user with Email and Password
   */
  async signUpWithEmail(email: string, pass: string): Promise<FirebaseUserCredential> {
    return createUserWithEmailAndPassword(auth, email, pass);
  },

  /**
   * Log in with Google Account popup
   */
  async loginWithGoogle(): Promise<FirebaseUserCredential> {
    return signInWithPopup(auth, googleProvider);
  },

  /**
   * Log in with GitHub Account popup
   */
  async loginWithGithub(): Promise<FirebaseUserCredential> {
    return signInWithPopup(auth, githubProvider);
  },

  /**
   * Sign out the active user session
   */
  async logout(): Promise<void> {
    await signOut(auth);
  },

  /**
   * Fetch the current user ID JWT Token
   */
  async getCurrentUserToken(forceRefresh = false): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      return user.getIdToken(forceRefresh);
    }
    return null;
  }
};
export default AuthService;
