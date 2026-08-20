import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase/config';

export interface PublicQuestion {
  id: string;
  text: string;
  options: string[];
  points: number;
}

export interface SanitizedAssessmentSummary {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  questionsCount: number;
  passingScore: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface StartAssessmentResponse {
  attemptId: string;
  assessmentId: string;
  title: string;
  category: string;
  durationMinutes: number;
  passingScore: number;
  totalQuestions: number;
  totalPoints: number;
  startedAt: string;
  expiresAt: string;
  questions: PublicQuestion[];
}

export interface SubmitAssessmentResponse {
  submissionId: string;
  attemptId: string;
  assessmentId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passingScore: number;
  passed: boolean;
  gradedAt: string;
  certificateEligible: boolean;
}

/**
 * Public catalog metadata for assessment discovery (sanitized, zero answer keys)
 */
export const PUBLIC_ASSESSMENT_CATALOG: SanitizedAssessmentSummary[] = [
  {
    id: 'exam-sql',
    title: 'SQL Relational Optimization Certification',
    category: 'SQL Databases',
    durationMinutes: 10,
    questionsCount: 5,
    passingScore: 80,
    difficulty: 'Intermediate',
  },
  {
    id: 'exam-excel',
    title: 'Excel Financial Modeling & Auditing Assessment',
    category: 'Spreadsheets',
    durationMinutes: 8,
    questionsCount: 3,
    passingScore: 80,
    difficulty: 'Advanced',
  },
];

/**
 * Initialize a server-authoritative timed assessment attempt.
 */
export async function startAssessmentSession(assessmentId: string): Promise<StartAssessmentResponse> {
  const startFn = httpsCallable<{ assessmentId: string }, StartAssessmentResponse>(
    functions,
    'startAssessment'
  );
  const result = await startFn({ assessmentId });
  return result.data;
}

/**
 * Submit answers to the server-authoritative grading engine.
 */
export async function submitAssessmentSession(
  attemptId: string,
  answers: Record<string, number>
): Promise<SubmitAssessmentResponse> {
  const submitFn = httpsCallable<
    { attemptId: string; answers: Record<string, number> },
    SubmitAssessmentResponse
  >(functions, 'submitAssessment');

  const result = await submitFn({ attemptId, answers });
  return result.data;
}
