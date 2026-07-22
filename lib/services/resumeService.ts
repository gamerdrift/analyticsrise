'use client';

/**
 * Resume Service (Module A)
 * ATS-compliant resume management, AI optimization, scoring, and exports.
 */

export interface ResumeSkill {
  name: string;
  category: 'technical' | 'soft' | 'tool';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface ResumeProject {
  id: string;
  title: string;
  tool: string;
  description: string;
  highlights: string[];
  link?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
}

export interface ResumeData {
  id: string;
  title: string;
  template: 'classic' | 'cyber-modern' | 'minimalist' | 'executive';
  themeColor: string; // hex
  profilePhoto?: string;
  targetRole: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  skills: ResumeSkill[];
  experience: WorkExperience[];
  projects: ResumeProject[];
  education: EducationItem[];
  certifications: string[];
  lastSaved: string;
  version: number;
}

export interface AtsScoreResult {
  score: number; // 0 - 100
  qualityRating: 'Needs Improvement' | 'Good' | 'Excellent' | 'Enterprise Ready';
  missingKeywords: string[];
  grammarSuggestions: string[];
  improvements: string[];
}

export const INITIAL_RESUME_DATA: ResumeData = {
  id: 'res-default-01',
  title: 'Data Analyst Core Resume',
  template: 'cyber-modern',
  themeColor: '#00E5FF',
  targetRole: 'Data Analyst',
  personalInfo: {
    fullName: 'Alex Rivera',
    email: 'alex.rivera@analyticsrise.com',
    phone: '+1 (555) 382-9102',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alex-rivera-data',
    github: 'github.com/alexrivera-data',
  },
  summary:
    'Results-driven Data Analyst with proven expertise in relational SQL database queries, advanced Excel financial modeling, and Power BI interactive dashboard architecture. Demonstrated track record of optimizing data query latency and identifying churn metrics.',
  skills: [
    { name: 'SQL (Multi-Table JOINs, Aggregates)', category: 'technical', level: 'Advanced' },
    { name: 'Microsoft Excel (XLOOKUP, Pivot Tables)', category: 'tool', level: 'Expert' },
    { name: 'Power BI (DAX, Star Schema)', category: 'tool', level: 'Intermediate' },
    { name: 'Python (Pandas, Data Cleaning)', category: 'technical', level: 'Intermediate' },
    { name: 'Tableau (Visual Analytics, LODs)', category: 'tool', level: 'Intermediate' },
    { name: 'Data Storytelling & Executive Presentation', category: 'soft', level: 'Advanced' },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Apex Financial Intelligence',
      role: 'Junior Data Analyst',
      location: 'San Francisco, CA',
      startDate: '2025-01',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Formulated multi-table SQL queries in Snowflake to extract transaction logs for 14,000+ active user accounts.',
        'Constructed automated Excel workbook models reducing monthly revenue reporting turnaround by 35%.',
        'Designed 4 interactive Power BI dashboards tracking customer acquisition cost (CAC) and retention margins.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'E-Commerce Customer Churn Analysis Lab',
      tool: 'SQL & Power BI',
      description: 'Analyzed 1.4M billing records to isolate churn alert indicators using SQL aggregates.',
      highlights: ['Wrote complex GROUP BY & HAVING queries', 'Built executive summary dashboard in Power BI'],
      link: 'https://analyticsrise.com/portfolio/alex-rivera',
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Statistics & Data Analytics',
      graduationYear: '2024',
    },
  ],
  certifications: [
    'AnalyticsRise Certified Relational SQL Specialist (SHA-256 Verified)',
    'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
  ],
  lastSaved: new Date().toISOString(),
  version: 1,
};

class ResumeService {
  /**
   * Calculates ATS Compatibility & Quality Score
   */
  public evaluateAtsScore(resume: ResumeData): AtsScoreResult {
    let score = 50; // base score

    if (resume.summary.length > 80) score += 10;
    if (resume.skills.length >= 5) score += 10;
    if (resume.experience.length >= 1) score += 10;
    if (resume.projects.length >= 1) score += 10;
    if (resume.certifications.length >= 1) score += 10;

    score = Math.min(100, score);

    let qualityRating: AtsScoreResult['qualityRating'] = 'Needs Improvement';
    if (score >= 85) qualityRating = 'Enterprise Ready';
    else if (score >= 75) qualityRating = 'Excellent';
    else if (score >= 60) qualityRating = 'Good';

    return {
      score,
      qualityRating,
      missingKeywords: ['Window Functions', 'DAX Measures', 'Spark Pipelines', 'Git Control'],
      grammarSuggestions: [
        'Use strong action verbs like "Formulated", "Constructed", or "Optimized".',
        'Quantify achievements with measurable percentages or numbers.',
      ],
      improvements: [
        'Add quantitative metrics to your bullet points (e.g. "Reduced query latency by 40%")',
        'Include target role keywords like "Star Schema" or "LOD Calculations"',
      ],
    };
  }

  /**
   * Generates AI Professional Summary based on target role
   */
  public async generateAiSummary(targetRole: string, skills: ResumeSkill[]): Promise<string> {
    await new Promise((r) => setTimeout(r, 500));
    const skillList = skills.map((s) => s.name).slice(0, 3).join(', ');
    return `Highly analytical ${targetRole} skilled in ${skillList || 'SQL, Excel, and Power BI'}. Proven track record of leveraging relational databases, quantitative analysis, and interactive dashboard architecture to deliver actionable business intelligence.`;
  }

  /**
   * AI Bullet Point Enhancer
   */
  public async enhanceBulletPoint(bullet: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 400));
    if (bullet.toLowerCase().includes('sql') || bullet.toLowerCase().includes('query')) {
      return 'Engineered optimized SQL relational queries across 1.4M+ transaction records, improving data extraction latency by 35%.';
    }
    if (bullet.toLowerCase().includes('excel') || bullet.toLowerCase().includes('sheet')) {
      return 'Constructed automated Excel spreadsheet models utilizing XLOOKUP and Pivot Tables, saving 12 hours of weekly manual reporting.';
    }
    return `Optimized ${bullet.toLowerCase().replace(/^(worked on|did|handled)\s*/i, '')} by implementing structured data analysis, achieving a 25% increase in operational reporting efficiency.`;
  }
}

export const resumeService = new ResumeService();
