'use client';

export type SearchCategory =
  | 'course'
  | 'simulator'
  | 'certification'
  | 'job'
  | 'company'
  | 'ai_mentor'
  | 'community'
  | 'faq'
  | 'docs';

export interface SearchResultItem {
  id: string;
  category: SearchCategory;
  title: string;
  description: string;
  targetRoute: string;
  badge?: string;
}

export const SEARCH_INDEX: SearchResultItem[] = [
  {
    id: 's_1',
    category: 'simulator',
    title: 'SQL Relational Sandbox & Window Functions',
    description: 'Execute LEAD, LAG, and OVER clauses with real PostgreSQL dataset.',
    targetRoute: '/simulators/sql',
    badge: 'PRACTICE',
  },
  {
    id: 's_2',
    category: 'course',
    title: 'Power BI DAX & Star Schemas',
    description: 'Master time intelligence DAX functions and enterprise semantic models.',
    targetRoute: '/courses',
    badge: 'COURSE',
  },
  {
    id: 's_3',
    category: 'certification',
    title: 'Relational Database SQL Specialist',
    description: 'Verified SHA-256 cryptographic certificate.',
    targetRoute: '/certifications',
    badge: 'CERTIFICATE',
  },
  {
    id: 's_4',
    category: 'job',
    title: 'Senior Data Analyst at Snowflake',
    description: 'Remote $140k-$165k analytics role.',
    targetRoute: '/get-hired',
    badge: 'JOB',
  },
  {
    id: 's_5',
    category: 'company',
    title: 'Snowflake Enterprise Employer Page',
    description: 'View Snowflake tech stack, benefits, and open analytics jobs.',
    targetRoute: '/companies/snowflake',
    badge: 'COMPANY',
  },
  {
    id: 's_6',
    category: 'ai_mentor',
    title: '24/7 AI Career Copilot',
    description: 'Get personalized Career Readiness score and weekly action roadmap.',
    targetRoute: '/career-copilot',
    badge: 'AI COPILOT',
  },
];

export class GlobalSearchService {
  static search(query: string, categoryFilter: string = 'all'): SearchResultItem[] {
    if (!query.trim()) return SEARCH_INDEX.slice(0, 4);

    const q = query.toLowerCase();
    return SEARCH_INDEX.filter((item) => {
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesQuery =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }
}
