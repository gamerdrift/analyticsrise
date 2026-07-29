import { DAILY_CHALLENGES, DailyChallenge } from '@/lib/config/challenges';

export interface UserChallengeCompletion {
  challengeId: string;
  completedAtIso: string;
  selectedOptionId: string;
  isCorrect: boolean;
  xpEarned: number;
}

const STORAGE_KEY = 'analyticsrise_challenge_history';

export class ChallengeService {
  /**
   * Return today's rotating challenge based on day-of-year index
   */
  static getTodaysChallenge(): DailyChallenge {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const index = dayOfYear % DAILY_CHALLENGES.length;
    return DAILY_CHALLENGES[index];
  }

  /**
   * Retrieve user challenge completion history
   */
  static getHistory(uid: string = 'demo-user'): UserChallengeCompletion[] {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${uid}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse challenge history:', e);
        }
      }
    }
    return [];
  }

  /**
   * Submit answer for today's challenge
   */
  static submitAnswer(
    challengeId: string,
    optionId: string,
    uid: string = 'demo-user'
  ): { isCorrect: boolean; xpEarned: number; explanation: string } {
    const challenge = DAILY_CHALLENGES.find((c) => c.id === challengeId) || this.getTodaysChallenge();
    const selectedOption = challenge.options.find((o) => o.id === optionId);
    const isCorrect = selectedOption?.isCorrect || false;
    const xpEarned = isCorrect ? challenge.xpReward : 0;

    const history = this.getHistory(uid);
    const existingIndex = history.findIndex((h) => h.challengeId === challengeId);

    const record: UserChallengeCompletion = {
      challengeId,
      completedAtIso: new Date().toISOString(),
      selectedOptionId: optionId,
      isCorrect,
      xpEarned,
    };

    if (existingIndex >= 0) {
      history[existingIndex] = record;
    } else {
      history.push(record);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(history));
    }

    return {
      isCorrect,
      xpEarned,
      explanation: challenge.explanation,
    };
  }

  /**
   * Check if today's challenge is completed
   */
  static isTodaysChallengeCompleted(uid: string = 'demo-user'): boolean {
    const challenge = this.getTodaysChallenge();
    const history = this.getHistory(uid);
    const todayStr = new Date().toDateString();
    return history.some(
      (h) => h.challengeId === challenge.id && new Date(h.completedAtIso).toDateString() === todayStr
    );
  }
}
