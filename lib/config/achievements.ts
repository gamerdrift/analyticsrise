export type AchievementCategory =
  | 'learning'
  | 'practice'
  | 'projects'
  | 'certifications'
  | 'community'
  | 'career'
  | 'ai_mentor'
  | 'job_applications';

export interface AchievementBadge {
  id: string;
  category: AchievementCategory;
  title: string;
  description: string;
  iconName: string;
  xpValue: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  requiredCount: number;
}

export const ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'ach_first_lesson',
    category: 'learning',
    title: 'First Steps',
    description: 'Complete your first AnalyticsRise course lesson.',
    iconName: 'BookOpen',
    xpValue: 25,
    rarity: 'Common',
    requiredCount: 1,
  },
  {
    id: 'ach_course_master',
    category: 'learning',
    title: 'Course Scholar',
    description: 'Complete 3 full analytics learning paths.',
    iconName: 'GraduationCap',
    xpValue: 150,
    rarity: 'Rare',
    requiredCount: 3,
  },
  {
    id: 'ach_excel_pro',
    category: 'practice',
    title: 'Excel Studio Wizard',
    description: 'Complete 5 interactive Excel Studio laboratory tasks.',
    iconName: 'FileSpreadsheet',
    xpValue: 100,
    rarity: 'Rare',
    requiredCount: 5,
  },
  {
    id: 'ach_sql_ninja',
    category: 'practice',
    title: 'SQL Query Ninja',
    description: 'Execute 25 valid SQL queries in SQL Lab.',
    iconName: 'Database',
    xpValue: 120,
    rarity: 'Rare',
    requiredCount: 25,
  },
  {
    id: 'ach_python_dev',
    category: 'practice',
    title: 'Pandas Data Wrangler',
    description: 'Execute 10 Python Jupyter notebooks in Python Lab.',
    iconName: 'Code2',
    xpValue: 150,
    rarity: 'Epic',
    requiredCount: 10,
  },
  {
    id: 'ach_cert_verified',
    category: 'certifications',
    title: 'Certified Analyst',
    description: 'Earn your first official verified certificate.',
    iconName: 'Award',
    xpValue: 200,
    rarity: 'Epic',
    requiredCount: 1,
  },
  {
    id: 'ach_ai_scholar',
    category: 'ai_mentor',
    title: 'AI Companion',
    description: 'Ask 10 questions to the AI Mentor.',
    iconName: 'Sparkles',
    xpValue: 50,
    rarity: 'Common',
    requiredCount: 10,
  },
  {
    id: 'ach_project_builder',
    category: 'projects',
    title: 'Portfolio Architect',
    description: 'Publish your first verified real-world analytics portfolio project.',
    iconName: 'LayoutDashboard',
    xpValue: 180,
    rarity: 'Epic',
    requiredCount: 1,
  },
  {
    id: 'ach_community_star',
    category: 'community',
    title: 'Community Leader',
    description: 'Reach top 5 in weekly global XP leaderboards.',
    iconName: 'Users',
    xpValue: 150,
    rarity: 'Rare',
    requiredCount: 1,
  },
  {
    id: 'ach_career_ready',
    category: 'career',
    title: 'Market Ready',
    description: 'Achieve 85%+ ATS resume score in Career Hub.',
    iconName: 'UserCheck',
    xpValue: 200,
    rarity: 'Legendary',
    requiredCount: 1,
  },
  {
    id: 'ach_job_applicant',
    category: 'job_applications',
    title: 'Career Launcher',
    description: 'Apply to 5 matched global analytics jobs via Get Hired.',
    iconName: 'Briefcase',
    xpValue: 175,
    rarity: 'Legendary',
    requiredCount: 5,
  },
];
