// src/context/LearningContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for user learning data
export interface LearningStats {
  completedMissions: number;
  xp: number;
  weakSkills: string[];
  strongSkills: string[];
  timeSpentMinutes: number;
  streakDays: number;
}

export interface LearningContextValue {
  stats: LearningStats;
  updateStats: (partial: Partial<LearningStats>) => void;
}

const defaultStats: LearningStats = {
  completedMissions: 0,
  xp: 0,
  weakSkills: [],
  strongSkills: [],
  timeSpentMinutes: 0,
  streakDays: 0,
};

const LearningContext = createContext<LearningContextValue | undefined>(undefined);

export const LearningProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<LearningStats>(defaultStats);

  const updateStats = (partial: Partial<LearningStats>) => {
    setStats((prev) => ({ ...prev, ...partial }));
  };

  return (
    <LearningContext.Provider value={{ stats, updateStats }}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const ctx = useContext(LearningContext);
  if (!ctx) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return ctx;
};
