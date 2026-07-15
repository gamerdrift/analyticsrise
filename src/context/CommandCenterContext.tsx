// src/context/CommandCenterContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/firebaseConfig';

/**
 * UI state for the Command Center workspace.
 * Persisted in Firestore under users/{uid}/dashboardPreferences.
 */
export interface CommandCenterState {
  /** Sidebar collapsed (true = collapsed) */
  sidebarCollapsed: boolean;
  /** Right sidebar visibility */
  rightSidebarOpen: boolean;
  /** Quick notes typed by the user */
  quickNotes: string;
  /** Any other UI preferences */
  theme: 'light' | 'dark';
}

export interface CommandCenterContextValue {
  state: CommandCenterState;
  setState: (partial: Partial<CommandCenterState>) => void;
}

const defaultState: CommandCenterState = {
  sidebarCollapsed: false,
  rightSidebarOpen: true,
  quickNotes: '',
  theme: 'dark',
};

const CommandCenterContext = createContext<CommandCenterContextValue | undefined>(undefined);

export const CommandCenterProvider = ({ children }: { children: ReactNode }) => {
  const [state, setStateInternal] = useState<CommandCenterState>(defaultState);

  // Persist to Firestore when state changes (simple implementation)
  useEffect(() => {
    // Assume user is authenticated and uid is available via auth.currentUser
    const unsubscribe = async () => {
      const uid = (await import('firebase/auth')).getAuth().currentUser?.uid;
      if (!uid) return;
      const ref = doc(db, 'users', uid, 'dashboardPreferences', 'ui');
      await setDoc(ref, state, { merge: true });
    };
    unsubscribe();
  }, [state]);

  // Load from Firestore on mount
  useEffect(() => {
    const load = async () => {
      const uid = (await import('firebase/auth')).getAuth().currentUser?.uid;
      if (!uid) return;
      const ref = doc(db, 'users', uid, 'dashboardPreferences', 'ui');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setStateInternal({ ...defaultState, ...snap.data() } as CommandCenterState);
      }
      // Listen for realtime updates
      const unsub = onSnapshot(ref, (docSnap) => {
        if (docSnap.exists()) {
          setStateInternal({ ...defaultState, ...docSnap.data() } as CommandCenterState);
        }
      });
      return unsub;
    };
    load();
  }, []);

  const setState = (partial: Partial<CommandCenterState>) => {
    setStateInternal((prev) => ({ ...prev, ...partial }));
  };

  return (
    <CommandCenterContext.Provider value={{ state, setState }}>
      {children}
    </CommandCenterContext.Provider>
  );
};

export const useCommandCenter = () => {
  const ctx = useContext(CommandCenterContext);
  if (!ctx) {
    throw new Error('useCommandCenter must be used within CommandCenterProvider');
  }
  return ctx;
};
