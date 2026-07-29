export interface StreakState {
  currentDailyStreak: number;
  longestDailyStreak: number;
  weeklyStreak: number;
  monthlyStreak: number;
  streakFreezeCount: number;
  lastLoginDateIso: string;
}

const STORAGE_KEY = 'analyticsrise_user_streak';

export class StreakService {
  /**
   * Fetch current streak state and auto-update for today
   */
  static getStreak(uid: string = 'demo-user'): StreakState {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${uid}`);
      if (saved) {
        try {
          const state: StreakState = JSON.parse(saved);
          return this.evaluateStreak(state, uid);
        } catch (e) {
          console.error('Failed to parse streak state:', e);
        }
      }
    }

    // Default starting streak state
    const initial: StreakState = {
      currentDailyStreak: 5,
      longestDailyStreak: 12,
      weeklyStreak: 3,
      monthlyStreak: 1,
      streakFreezeCount: 1,
      lastLoginDateIso: new Date().toISOString(),
    };
    return initial;
  }

  /**
   * Evaluate and record login activity for today
   */
  private static evaluateStreak(state: StreakState, uid: string): StreakState {
    const lastLogin = new Date(state.lastLoginDateIso);
    const now = new Date();

    const diffDays = Math.floor(
      (now.setHours(0, 0, 0, 0) - lastLogin.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Consecutive day login
      state.currentDailyStreak += 1;
      state.longestDailyStreak = Math.max(state.longestDailyStreak, state.currentDailyStreak);
      state.lastLoginDateIso = new Date().toISOString();
    } else if (diffDays > 1) {
      // Missed day! Check for streak freeze shield
      if (state.streakFreezeCount > 0) {
        state.streakFreezeCount -= 1; // Shield consumed!
        state.lastLoginDateIso = new Date().toISOString();
      } else {
        state.currentDailyStreak = 1; // Reset streak
        state.lastLoginDateIso = new Date().toISOString();
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(state));
    }
    return state;
  }

  /**
   * Use streak freeze to restore streak
   */
  static redeemStreakFreeze(uid: string = 'demo-user'): StreakState {
    const state = this.getStreak(uid);
    state.streakFreezeCount += 1;
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(state));
    }
    return state;
  }
}
