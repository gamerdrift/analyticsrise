export interface LeaderboardEntry {
  rank: number;
  uid: string;
  name: string;
  avatarUrl: string;
  xpTotal: number;
  streakDays: number;
  certificatesEarned: number;
  badgeTitle: string;
  isCurrentUser?: boolean;
}

export class LeaderboardService {
  /**
   * Return global weekly leaderboard entries
   */
  static getWeeklyLeaderboard(currentUserXp: number = 1450): LeaderboardEntry[] {
    return [
      {
        rank: 1,
        uid: 'user_1',
        name: 'Elena Rostova',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        xpTotal: 3420,
        streakDays: 28,
        certificatesEarned: 6,
        badgeTitle: 'Grandmaster Analyst',
      },
      {
        rank: 2,
        uid: 'user_2',
        name: 'Marcus Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        xpTotal: 2980,
        streakDays: 21,
        certificatesEarned: 5,
        badgeTitle: 'SQL Specialist',
      },
      {
        rank: 3,
        uid: 'user_3',
        name: 'Sophia Chen',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        xpTotal: 2750,
        streakDays: 19,
        certificatesEarned: 4,
        badgeTitle: 'Python Data Scientist',
      },
      {
        rank: 4,
        uid: 'demo-user',
        name: 'You (Alex Rivera)',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        xpTotal: currentUserXp,
        streakDays: 5,
        certificatesEarned: 2,
        badgeTitle: 'Rising Star',
        isCurrentUser: true,
      },
      {
        rank: 5,
        uid: 'user_4',
        name: 'David Kim',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        xpTotal: 1200,
        streakDays: 8,
        certificatesEarned: 1,
        badgeTitle: 'Analytics Apprentice',
      },
    ];
  }
}
