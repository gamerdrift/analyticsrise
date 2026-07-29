import { ACHIEVEMENTS, AchievementBadge } from '@/lib/config/achievements';

export interface UserUnlockedAchievement {
  achievementId: string;
  unlockedAtIso: string;
}

const STORAGE_KEY = 'analyticsrise_user_achievements';

export class AchievementService {
  /**
   * Get list of unlocked achievement IDs
   */
  static getUnlocked(uid: string = 'demo-user'): UserUnlockedAchievement[] {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${uid}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse user achievements:', e);
        }
      }
    }
    // Demo Default Unlocked Badges
    return [
      { achievementId: 'ach_first_lesson', unlockedAtIso: '2026-07-28T10:00:00Z' },
      { achievementId: 'ach_ai_scholar', unlockedAtIso: '2026-07-29T12:00:00Z' },
    ];
  }

  /**
   * Unlock an achievement for user
   */
  static unlock(achievementId: string, uid: string = 'demo-user'): AchievementBadge | null {
    const unlocked = this.getUnlocked(uid);
    if (unlocked.some((u) => u.achievementId === achievementId)) {
      return null; // Already unlocked
    }

    const badge = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!badge) return null;

    unlocked.push({
      achievementId,
      unlockedAtIso: new Date().toISOString(),
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(unlocked));
    }
    return badge;
  }

  /**
   * Get total unlocked count vs total count
   */
  static getStats(uid: string = 'demo-user') {
    const unlocked = this.getUnlocked(uid);
    const totalXp = unlocked.reduce((acc, curr) => {
      const b = ACHIEVEMENTS.find((a) => a.id === curr.achievementId);
      return acc + (b ? b.xpValue : 0);
    }, 0);

    return {
      unlockedCount: unlocked.length,
      totalCount: ACHIEVEMENTS.length,
      percentage: Math.round((unlocked.length / ACHIEVEMENTS.length) * 100),
      totalAchievementXp: totalXp,
    };
  }
}
