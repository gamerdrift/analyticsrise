'use client';

/**
 * Gamification Service
 * Handles XP leveling curves, daily study streak verification, badges, and achievements.
 */

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon identifier or emoji
  category: 'sql' | 'excel' | 'powerbi' | 'tableau' | 'python' | 'streak' | 'general';
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number; // 0 to 100
  unlocked: boolean;
  earnedAt?: string;
  xpReward: number;
}

export const BADGE_CATALOG: Badge[] = [
  { id: 'sql_initiate', title: 'SQL Query Novice', description: 'Run your first 10 SQL SELECT statements.', icon: 'Database', category: 'sql', xpReward: 150, unlocked: true, unlockedAt: '2026-07-20' },
  { id: 'sql_wizard', title: 'SQL Joins Master', description: 'Execute 50 complex multi-table JOIN queries.', icon: 'Terminal', category: 'sql', xpReward: 350, unlocked: true, unlockedAt: '2026-07-21' },
  { id: 'excel_ninja', title: 'Spreadsheet Architect', description: 'Build 10 financial pivot models in Excel.', icon: 'Table', category: 'excel', xpReward: 250, unlocked: false },
  { id: 'bi_pioneer', title: 'Power BI DAX Explorer', description: 'Formulate 20 dynamic DAX calculation measures.', icon: 'BarChart2', category: 'powerbi', xpReward: 400, unlocked: false },
  { id: 'tableau_master', title: 'Tableau LOD Specialist', description: 'Construct 15 Fixed & Include LOD worksheets.', icon: 'PieChart', category: 'tableau', xpReward: 400, unlocked: false },
  { id: 'python_coder', title: 'Pandas Data Wrangler', description: 'Clean and aggregate 5 real-world DataFrames.', icon: 'Code', category: 'python', xpReward: 300, unlocked: true, unlockedAt: '2026-07-22' },
  { id: 'streak_3', title: '3-Day Active Streak', description: 'Maintain daily practice for 3 consecutive days.', icon: 'Flame', category: 'streak', xpReward: 100, unlocked: true, unlockedAt: '2026-07-20' },
  { id: 'streak_7', title: '7-Day Streak Master', description: 'Maintain daily study habits for a full week.', icon: 'Zap', category: 'streak', xpReward: 250, unlocked: true, unlockedAt: '2026-07-22' },
  { id: 'cert_first', title: 'Cryptographic Ledger Cert', description: 'Earn your first SHA-256 verified certificate.', icon: 'Award', category: 'general', xpReward: 500, unlocked: true, unlockedAt: '2026-07-21' },
];

class GamificationService {
  /**
   * Calculates Level from cumulative XP
   * Formula: level = floor(sqrt(xp / 100)) + 1
   */
  public calculateLevel(xp: number): number {
    if (xp <= 0) return 1;
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  /**
   * Total XP needed to reach a specific level
   */
  public getXpForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.pow(level - 1, 2) * 100;
  }

  /**
   * Calculates XP progress towards the next level
   */
  public getLevelProgress(xp: number): { currentLevel: number; xpInLevel: number; xpNeeded: number; percent: number } {
    const currentLevel = this.calculateLevel(xp);
    const xpCurrentLevelBase = this.getXpForLevel(currentLevel);
    const xpNextLevelBase = this.getXpForLevel(currentLevel + 1);

    const xpInLevel = Math.max(0, xp - xpCurrentLevelBase);
    const xpNeeded = xpNextLevelBase - xpCurrentLevelBase;
    const percent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

    return { currentLevel, xpInLevel, xpNeeded, percent };
  }

  /**
   * Verifies if streak should be incremented or reset based on lastActiveDate (YYYY-MM-DD)
   */
  public verifyStreak(lastActiveDateStr?: string, currentStreak: number = 0): { newStreak: number; streakMaintained: boolean } {
    if (!lastActiveDateStr) {
      return { newStreak: 1, streakMaintained: true };
    }

    const today = new Date().toISOString().split('T')[0];
    if (lastActiveDateStr === today) {
      return { newStreak: currentStreak || 1, streakMaintained: true };
    }

    const lastActive = new Date(lastActiveDateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 2) {
      // Studied yesterday or within 48h
      return { newStreak: (currentStreak || 0) + 1, streakMaintained: true };
    }

    // Streak broken
    return { newStreak: 1, streakMaintained: false };
  }
}

export const gamificationService = new GamificationService();
