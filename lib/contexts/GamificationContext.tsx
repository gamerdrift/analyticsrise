'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BADGE_CATALOG, Badge, gamificationService } from '@/lib/services/gamificationService';

export interface GamificationContextType {
  xp: number;
  level: number;
  streak: number;
  badges: Badge[];
  addXp: (amount: number, reason?: string) => void;
  unlockBadge: (badgeId: string) => void;
  recentRewardNotification: { title: string; xp: number } | null;
  clearNotification: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(1450);
  const [streak, setStreak] = useState(7);
  const [badges, setBadges] = useState<Badge[]>(BADGE_CATALOG);
  const [recentRewardNotification, setRecentRewardNotification] = useState<{ title: string; xp: number } | null>(null);

  const level = gamificationService.calculateLevel(xp);

  const addXp = (amount: number, reason: string = 'Lab Completion') => {
    setXp((prev) => prev + amount);
    setRecentRewardNotification({ title: reason, xp: amount });
  };

  const unlockBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) =>
        b.id === badgeId ? { ...b, unlocked: true, unlockedAt: new Date().toISOString().split('T')[0] } : b
      )
    );
  };

  const clearNotification = () => setRecentRewardNotification(null);

  return (
    <GamificationContext.Provider
      value={{
        xp,
        level,
        streak,
        badges,
        addXp,
        unlockBadge,
        recentRewardNotification,
        clearNotification,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    // Fallback safe state if used outside provider
    return {
      xp: 1450,
      level: 4,
      streak: 7,
      badges: BADGE_CATALOG,
      addXp: () => {},
      unlockBadge: () => {},
      recentRewardNotification: null,
      clearNotification: () => {},
    };
  }
  return context;
}
