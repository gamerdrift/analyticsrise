export interface QuickStats {
  progressPercent: number;
  completedModules: number;
  streakDays: number;
  xpEarned: number;
}

export interface Achievement {
  id: string;
  name: string;
  earnedAt: string; // ISO date string
  iconUrl?: string;
}

export interface DashboardData {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  quickStats: QuickStats;
  recentActivity: string[]; // descriptions of recent actions
  achievements: Achievement[];
  recommendations: string[]; // module ids or titles
}
