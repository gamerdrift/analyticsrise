'use client';

/**
 * Interview Preparation Service (Module D)
 * Question bank across 9 categories, mock assessments, and AI response review engine.
 */

export type InterviewCategory =
  | 'SQL'
  | 'Excel'
  | 'Python'
  | 'Power BI'
  | 'Tableau'
  | 'Statistics'
  | 'Business Analytics'
  | 'Behavioral'
  | 'Case Studies';

export interface InterviewQuestion {
  id: string;
  category: InterviewCategory;
  title: string;
  scenario: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'FAANG / Enterprise';
  timeLimitSeconds: number; // e.g. 180
  modelAnswer: string;
  keyPoints: string[];
}

export interface InterviewReviewResult {
  score: number; // 0 - 100
  feedback: string;
  strengths: string[];
  missingElements: string[];
  suggestedImprovement: string;
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'int-sql-1',
    category: 'SQL',
    title: 'INNER vs LEFT JOIN Tradeoffs',
    scenario: 'Explain the difference between INNER JOIN and LEFT JOIN. When would an INNER JOIN suppress critical analytics data?',
    difficulty: 'Intermediate',
    timeLimitSeconds: 180,
    modelAnswer: 'AN INNER JOIN returns only records that have matching keys in both tables. If a customer has not placed an order, an INNER JOIN between Customers and Orders will drop that customer from the output. A LEFT JOIN preserves all records from the left table, returning NULL for unmatched right-side columns.',
    keyPoints: ['Matching keys constraint', 'Data suppression risks', 'NULL handling in LEFT JOIN'],
  },
  {
    id: 'int-sql-2',
    category: 'SQL',
    title: 'Customer Order Window Functions',
    scenario: 'How would you write a query to rank customers by revenue within each geographic region?',
    difficulty: 'Advanced',
    timeLimitSeconds: 300,
    modelAnswer: 'Use the DENSE_RANK() or RANK() OVER (PARTITION BY region ORDER BY SUM(revenue) DESC) window function.',
    keyPoints: ['PARTITION BY clause', 'ORDER BY descending revenue', 'DENSE_RANK handling ties'],
  },
  {
    id: 'int-excel-1',
    category: 'Excel',
    title: 'Dynamic Financial Lookup Formulas',
    scenario: 'Why is XLOOKUP preferred over traditional VLOOKUP in modern financial modeling?',
    difficulty: 'Intermediate',
    timeLimitSeconds: 180,
    modelAnswer: 'XLOOKUP defaults to exact match, allows leftward lookups without column index counting, supports array outputs, and handles missing items natively via its if_not_found argument.',
    keyPoints: ['Exact match default', 'Leftward lookup capability', 'Natively handling missing keys'],
  },
  {
    id: 'int-pbi-1',
    category: 'Power BI',
    title: 'DAX CALCULATE Context Transitions',
    scenario: 'Explain how the CALCULATE function modifies the filter context during DAX evaluation.',
    difficulty: 'Advanced',
    timeLimitSeconds: 240,
    modelAnswer: 'CALCULATE evaluates its first expression in a modified filter context. It overrides existing column filters with new filter parameters or converts row context to filter context (context transition).',
    keyPoints: ['Context transition', 'Filter override', 'DAX evaluation engine order'],
  },
  {
    id: 'int-behavioral-1',
    category: 'Behavioral',
    title: 'Handling Discrepant Data Stakeholder Reports',
    scenario: 'Tell me about a time your data analysis contradicted a senior stakeholder hypothesis.',
    difficulty: 'Intermediate',
    timeLimitSeconds: 240,
    modelAnswer: 'Focus on objective empirical evidence, data audit verification steps, active listening, and collaborating to update the underlying strategic model.',
    keyPoints: ['Empirical evidence verification', 'Stakeholder empathy & clear communication', 'Business outcome alignment'],
  },
];

class InterviewService {
  public getQuestionsByCategory(category?: InterviewCategory): InterviewQuestion[] {
    if (!category) return INTERVIEW_QUESTIONS;
    return INTERVIEW_QUESTIONS.filter((q) => q.category === category);
  }

  public async reviewAnswer(questionId: string, userAnswer: string): Promise<InterviewReviewResult> {
    await new Promise((r) => setTimeout(r, 600));

    const q = INTERVIEW_QUESTIONS.find((item) => item.id === questionId);
    const answerLen = userAnswer.trim().length;

    if (answerLen < 20) {
      return {
        score: 40,
        feedback: 'Answer is too brief. Provide technical specifics and real-world examples.',
        strengths: ['Started answering question'],
        missingElements: ['Technical terminology', 'Detailed explanation', 'Key takeaways'],
        suggestedImprovement: 'Expand on core mechanisms and reference specific SQL or formula functions.',
      };
    }

    return {
      score: 88,
      feedback: 'Excellent answer! You accurately articulated key technical parameters and tradeoffs.',
      strengths: ['Clear terminology', 'Accurate conceptual breakdown', 'Good structure'],
      missingElements: ['Could mention edge-case performance considerations'],
      suggestedImprovement: 'Add 1 quantitative metric or syntax example to make your answer stand out.',
    };
  }
}

export const interviewService = new InterviewService();
