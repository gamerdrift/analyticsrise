import {
  startAssessmentSession,
  submitAssessmentSession,
  PUBLIC_ASSESSMENT_CATALOG,
} from '../lib/services/assessmentService';
import { functions } from '../lib/firebase/config';
import { httpsCallable } from 'firebase/functions';

describe('Assessment Frontend Service Contracts (Server Authority)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Public Catalog Data Sanitization', () => {
    test('Public catalog contains zero answer keys or private scoring formulas', () => {
      PUBLIC_ASSESSMENT_CATALOG.forEach((exam) => {
        expect(exam).toHaveProperty('id');
        expect(exam).toHaveProperty('title');
        expect(exam).toHaveProperty('category');
        expect(exam).toHaveProperty('durationMinutes');
        expect(exam).toHaveProperty('questionsCount');
        expect(exam).toHaveProperty('passingScore');

        // Verify zero answer leaks
        expect((exam as any).questions).toBeUndefined();
        expect((exam as any).answers).toBeUndefined();
        expect((exam as any).correctIndex).toBeUndefined();
        expect((exam as any).answerKey).toBeUndefined();
      });
    });
  });

  describe('2. Start Assessment Flow', () => {
    test('Calls startAssessment Cloud Function with assessmentId and receives sanitized session', async () => {
      const mockCallable = jest.fn().mockResolvedValue({
        data: {
          attemptId: 'attempt_sql_auth_123',
          assessmentId: 'exam-sql',
          title: 'SQL Relational Optimization Certification',
          category: 'SQL Databases',
          durationMinutes: 10,
          passingScore: 80,
          totalQuestions: 5,
          totalPoints: 100,
          startedAt: '2026-08-19T06:00:00.000Z',
          expiresAt: '2026-08-19T06:10:00.000Z',
          questions: [
            {
              id: 'q1',
              text: 'Which SQL JOIN returns all rows from left table?',
              options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
              points: 20,
            },
          ],
        },
      });
      (httpsCallable as jest.Mock).mockReturnValue(mockCallable);

      const session = await startAssessmentSession('exam-sql');

      expect(httpsCallable).toHaveBeenCalledWith(functions, 'startAssessment');
      expect(mockCallable).toHaveBeenCalledWith({ assessmentId: 'exam-sql' });

      expect(session.attemptId).toBe('attempt_sql_auth_123');
      expect(session.questions).toHaveLength(1);
      expect(session.questions[0].id).toBe('q1');
      expect((session.questions[0] as any).correct).toBeUndefined();
      expect((session.questions[0] as any).correctIndex).toBeUndefined();
    });

    test('Propagates server errors (e.g. unauthenticated, not found) cleanly', async () => {
      const mockCallable = jest.fn().mockRejectedValue(new Error('Authentication required.'));
      (httpsCallable as jest.Mock).mockReturnValue(mockCallable);

      await expect(startAssessmentSession('exam-unknown')).rejects.toThrow('Authentication required.');
    });
  });

  describe('3. Submit Assessment Flow', () => {
    test('Calls submitAssessment Cloud Function with attemptId and answers map only', async () => {
      const mockCallable = jest.fn().mockResolvedValue({
        data: {
          submissionId: 'sub_123456789',
          attemptId: 'attempt_sql_auth_123',
          assessmentId: 'exam-sql',
          score: 100,
          totalPoints: 100,
          percentage: 100,
          passingScore: 80,
          passed: true,
          gradedAt: '2026-08-19T06:05:00.000Z',
          certificateEligible: true,
        },
      });
      (httpsCallable as jest.Mock).mockReturnValue(mockCallable);

      const answers = { q1: 1, q2: 1, q3: 1, q4: 1, q5: 0 };
      const result = await submitAssessmentSession('attempt_sql_auth_123', answers);

      expect(httpsCallable).toHaveBeenCalledWith(functions, 'submitAssessment');
      expect(mockCallable).toHaveBeenCalledWith({
        attemptId: 'attempt_sql_auth_123',
        answers,
      });

      expect(result.submissionId).toBe('sub_123456789');
      expect(result.score).toBe(100);
      expect(result.passed).toBe(true);
    });

    test('Handles expired attempt or already graded attempt errors from server', async () => {
      const mockCallable = jest.fn().mockRejectedValue(new Error('Assessment attempt has expired.'));
      (httpsCallable as jest.Mock).mockReturnValue(mockCallable);

      await expect(
        submitAssessmentSession('attempt_expired', { q1: 1 })
      ).rejects.toThrow('Assessment attempt has expired.');
    });
  });
});
