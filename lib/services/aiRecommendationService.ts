export interface RecommendationItem {
  id: string;
  category: 'course' | 'simulator' | 'skill_gap' | 'resume' | 'interview' | 'job';
  title: string;
  description: string;
  actionText: string;
  targetRoute: string;
  priorityScore: number; // 1-100
  badgeLabel?: string;
}

export class AIRecommendationService {
  /**
   * Return adaptive recommendations for the learner
   */
  static getRecommendations(uid: string = 'demo-user'): RecommendationItem[] {
    return [
      {
        id: 'rec_sim_sql',
        category: 'simulator',
        title: 'Master SQL Window Functions',
        description: 'Your recent quiz identified a gap in window function aggregation (LEAD/LAG, DENSE_RANK).',
        actionText: 'Launch SQL Lab',
        targetRoute: '/simulators/sql',
        priorityScore: 95,
        badgeLabel: 'HIGH PRIORITY',
      },
      {
        id: 'rec_course_python',
        category: 'course',
        title: 'Advanced Pandas Data Cleansing',
        description: 'Complete Module 4 to boost your Python analytics skill score from 68% to 85%.',
        actionText: 'Resume Course',
        targetRoute: '/courses',
        priorityScore: 88,
        badgeLabel: 'RECOMMENDED',
      },
      {
        id: 'rec_job_match',
        category: 'job',
        title: 'Senior Data Analyst at Snowflake',
        description: 'Matched 92% with your profile. Snowflake is hiring remotely with $140k-$165k range.',
        actionText: 'View & Apply',
        targetRoute: '/get-hired',
        priorityScore: 84,
        badgeLabel: '92% MATCH',
      },
      {
        id: 'rec_resume_opt',
        category: 'resume',
        title: 'Optimize ATS Resume for SQL Skills',
        description: 'Scan your resume against "Senior Business Analyst" keywords to pass automated screeners.',
        actionText: 'Scan Resume',
        targetRoute: '/career-hub',
        priorityScore: 78,
      },
      {
        id: 'rec_interview_prep',
        category: 'interview',
        title: 'FAANG SQL Mock Interview Prep',
        description: 'Practice interactive live SQL technical interview questions with instant AI feedback.',
        actionText: 'Start Mock Interview',
        targetRoute: '/career-hub',
        priorityScore: 82,
        badgeLabel: 'POPULAR',
      },
      {
        id: 'rec_skill_gap_stat',
        category: 'skill_gap',
        title: 'Bridge Hypothesis Testing Skill Gap',
        description: 'Complete 3 statistical t-test scenarios to unlock Senior Analyst certification.',
        actionText: 'Bridge Skill Gap',
        targetRoute: '/simulators/sql',
        priorityScore: 75,
      },
    ];
  }
}
