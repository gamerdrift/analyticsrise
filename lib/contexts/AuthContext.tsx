'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { UserService } from '../services/user';
import { AuthService } from '../services/auth';
import { User as AppUser } from '../types';
import { logger } from '../utils/logger';

/**
 * Authentication Context Type Definition
 */
export interface AuthContextType {
  currentUser: any;
  userProfile: AppUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider
 * 
 * Subscribes to Firebase Authentication state changes, loads user profile data
 * from Firestore, and synchronizes JWT & role cookies for server-side Next.js route protection.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
      logger.debug('Auth state transition captured:', firebaseUser?.email || 'No Session Active');
      setCurrentUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Fetch token to populate the cookie
          const token = await firebaseUser.getIdToken();
          
          // Retrieve user details from Firestore
          let profileDoc = await UserService.getUserProfile(firebaseUser.uid);
          
          if (!profileDoc) {
            logger.warn('User profile document absent, instantiating default user profile...');
            const defaultName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Learner';
            await UserService.createUserProfile(firebaseUser.uid, firebaseUser.email || '', defaultName, 'student');
            profileDoc = await UserService.getUserProfile(firebaseUser.uid);
          }

          if (profileDoc) {
            const role = profileDoc.profile.role || 'student';
            const appUser: AppUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: profileDoc.profile.displayName,
              avatarUrl: profileDoc.profile.avatarUrl || undefined,
              role: role,
              xp: profileDoc.telemetry.xp,
              points: profileDoc.telemetry.points,
              level: profileDoc.telemetry.level,
              streak: profileDoc.telemetry.streak,
              lastActiveDate: profileDoc.telemetry.lastActiveDate,
              achievements: profileDoc.achievements || [],
              preferences: {
                theme: 'dark',
                notifications: true,
                emailUpdates: false,
                language: 'en'
              },
              createdAt: new Date(),
              updatedAt: new Date()
            };
            setUserProfile(appUser);

            // Sync auth session and user role cookies (used by Next.js edge middleware)
            document.cookie = `__session=${token}; path=/; max-age=${3600 * 24 * 7}; SameSite=Lax; Secure`;
            document.cookie = `user-role=${role}; path=/; max-age=${3600 * 24 * 7}; SameSite=Lax; Secure`;
          }
        } catch (error) {
          logger.error('Error synchronizing authenticated user profile:', error);
          // Set fallback profile to prevent UI blockage
          setUserProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Learner',
            role: 'student',
            xp: 0,
            points: 0,
            level: 1,
            streak: 0,
            lastActiveDate: new Date().toISOString().split('T')[0],
            achievements: [],
            preferences: {
              theme: 'dark',
              notifications: true,
              emailUpdates: false,
              language: 'en'
            },
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      } else {
        setUserProfile(null);
        // Clean session and role cookies on sign-out
        document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
        document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await AuthService.logout();
    } catch (e) {
      logger.error('Auth signOut request failed:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAuthenticated: !!currentUser,
        signOut: handleSignOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
