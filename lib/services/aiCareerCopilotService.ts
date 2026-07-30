'use client';

/**
 * AI Career Copilot Service (Sprint 10 Module 1)
 * Computes 12 key career operating dimensions:
 * 1. Career Readiness Score (0-100)
 * 2. Skill Gap Analysis
 * 3. Resume Analysis
 * 4. LinkedIn Optimization
 * 5. Portfolio Review
 * 6. Salary Estimation
 * 7. Interview Readiness
 * 8. Certification Recommendations
 * 9. Personalized Learning Paths
 * 10. Job Match Score
 * 11. Estimated Time to Employment
 * 12. Weekly Career Action Plan
 */

export interface SkillGapItem {
  skill: string;
  category: string;
  currentLevel: number; // 0 - 100
  targetLevel: number;  // 0 - 100
  recommendedAction: string;
}

export interface WeeklyActionItem {
  weekNumber: number;
  focusArea: string;
  taskTitle: string;
  description: string;
  targetRoute: string;
  completed: boolean;
}

export interface CareerCopilotState {
  readinessScore: number; // 0-100
  targetRole: string;
  estimatedSalary: string;
  estimatedTimeToEmploymentWeeks: number;
  jobMatchScore: number;
  resumeScore: number;
  linkedInOptimizedScore: number;
  portfolioRatingScore: number;
  interviewReadinessScore: number;
  skillGaps: SkillGapItem[];
  recommendedCertifications: string[];
  personalizedLearningPaths: string[];
  weeklyActionPlan: WeeklyActionItem[];
}

export class AICareerCopilotService {
  static getCopilotState(uid: string = 'demo-user', targetRole: string = 'Data Analyst'): CareerCopilotState {
    return {
      readinessScore: 88,
      targetRole,
      estimatedSalary: '$92,000 - $115,000 / year',
      estimatedTimeToEmploymentWeeks: 4,
      jobMatchScore: 92,
      resumeScore: 85,
      linkedInOptimizedScore: 78,
      portfolioRatingScore: 90,
      interviewReadinessScore: 82,
      skillGaps: [
        {
          skill: 'SQL Window Functions (LEAD/LAG)',
          category: 'Database',
          currentLevel: 75,
          targetLevel: 90,
          recommendedAction: 'Complete SQL Lab Module 4',
        },
        {
          skill: 'Power BI DAX Time Intelligence',
          category: 'BI',
          currentLevel: 65,
          targetLevel: 85,
          recommendedAction: 'Practice DAX Studio Simulator',
        },
        {
          skill: 'Python Pandas Data Wrangling',
          category: 'Programming',
          currentLevel: 70,
          targetLevel: 88,
          recommendedAction: 'Complete Python Lab Notebook 3',
        },
      ],
      recommendedCertifications: [
        'AnalyticsRise Relational SQL Specialist',
        'Microsoft Certified: Power BI Data Analyst (PL-300)',
      ],
      personalizedLearningPaths: [
        'Enterprise SQL Database & Performance Tuning Path',
        'Business Intelligence & Data Storytelling Mastery',
        'Python & Pandas Automation for Analysts',
      ],
      weeklyActionPlan: [
        {
          weekNumber: 1,
          focusArea: 'SQL & Database Optimization',
          taskTitle: 'Execute 20 Advanced SQL JOIN & Window Function Labs',
          description: 'Master LEAD, LAG, DENSE_RANK and window frames.',
          targetRoute: '/simulators/sql',
          completed: true,
        },
        {
          weekNumber: 2,
          focusArea: 'ATS Resume & LinkedIn Optimization',
          taskTitle: 'Scan and Optimize ATS Resume to 85%+ score',
          description: 'Inject quantified SQL metrics into job experience bullets.',
          targetRoute: '/resume-studio',
          completed: true,
        },
        {
          weekNumber: 3,
          focusArea: 'Public Candidate Portfolio',
          taskTitle: 'Publish Verified Portfolio Pro to /u/alex-rivera',
          description: 'Verify 2 SQL/Excel project builds with cryptographic proof.',
          targetRoute: '/portfolio',
          completed: false,
        },
        {
          weekNumber: 4,
          focusArea: 'AI Mock Interviews & Applications',
          taskTitle: 'Complete 3 Live AI SQL Technical Interview Simulations',
          description: 'Practice real-time technical questions with instant communication scoring.',
          targetRoute: '/interview-lab',
          completed: false,
        },
      ],
    };
  }
}
