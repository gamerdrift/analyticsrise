export interface MonthlyUsage {
  aiMentorQueries: number;
  simulatorHoursUsed: number;
  resumeScans: number;
  interviewSessions: number;
  portfolioExports: number;
  certificateDownloads: number;
  jobApplications: number;
  lastResetIso: string;
}

const USAGE_STORAGE_KEY = 'analyticsrise_monthly_usage';

export class UsageTracker {
  /**
   * Fetch current monthly usage state
   */
  static getUsage(uid: string = 'demo-user'): MonthlyUsage {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${USAGE_STORAGE_KEY}_${uid}`);
      if (saved) {
        try {
          const usage: MonthlyUsage = JSON.parse(saved);

          // Auto Reset check if billing cycle / month changed
          const lastReset = new Date(usage.lastResetIso);
          const now = new Date();
          if (
            now.getMonth() !== lastReset.getMonth() ||
            now.getFullYear() !== lastReset.getFullYear()
          ) {
            return this.resetUsage(uid);
          }

          return usage;
        } catch (e) {
          console.error('Failed to parse usage data:', e);
        }
      }
    }

    return {
      aiMentorQueries: 2,
      simulatorHoursUsed: 1.5,
      resumeScans: 1,
      interviewSessions: 0,
      portfolioExports: 0,
      certificateDownloads: 0,
      jobApplications: 2,
      lastResetIso: new Date().toISOString(),
    };
  }

  /**
   * Increment usage counter for a specific key
   */
  static recordUsage(
    key: keyof Omit<MonthlyUsage, 'lastResetIso'>,
    amount: number = 1,
    uid: string = 'demo-user'
  ): MonthlyUsage {
    const current = this.getUsage(uid);
    current[key] += amount;

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${USAGE_STORAGE_KEY}_${uid}`, JSON.stringify(current));
    }
    return current;
  }

  /**
   * Reset monthly usage counters
   */
  static resetUsage(uid: string = 'demo-user'): MonthlyUsage {
    const fresh: MonthlyUsage = {
      aiMentorQueries: 0,
      simulatorHoursUsed: 0,
      resumeScans: 0,
      interviewSessions: 0,
      portfolioExports: 0,
      certificateDownloads: 0,
      jobApplications: 0,
      lastResetIso: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${USAGE_STORAGE_KEY}_${uid}`, JSON.stringify(fresh));
    }
    return fresh;
  }
}
