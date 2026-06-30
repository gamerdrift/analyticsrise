export interface QuickStats {
  progressPercent: number;
  completedModules: number;
  streakDays: number;
  xpEarned: number;
}

export interface ActivityItem {
  timestamp: string;
  type: 'success' | 'info' | 'xp';
  message: string;
}

export interface Achievement {
  id: string;
  name: string;
  earnedAt: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface DashboardData {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  quickStats: QuickStats;
  recentActivity: ActivityItem[];
  achievements: Achievement[];
  recommendations: Recommendation[];
}
