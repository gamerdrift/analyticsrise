import {
  startAssessmentSession,
  submitAssessmentSession,
} from '../lib/services/assessmentService';
import {
  claimCertificate,
  verifyCertificateStatus,
  fetchUserCertificates,
} from '../lib/services/certificateService';
import { functions } from '../lib/firebase/config';
import { httpsCallable } from 'firebase/functions';

describe('Mission 01C: Frontend User Journey Workflows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Journey 1 — Complete Assessment Lifecycle', () => {
    test('Learner initiates exam, submits answers, and receives server-graded results', async () => {
      const mockStartCallable = jest.fn().mockResolvedValue({
        data: {
          attemptId: 'attempt_sql_7788',
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
            { id: 'sql-q1', text: 'JOIN query question', options: ['A', 'B', 'C', 'D'], points: 20 },
            { id: 'sql-q2', text: 'Execution phases', options: ['A', 'B', 'C', 'D'], points: 20 },
          ],
        },
      });

      const mockSubmitCallable = jest.fn().mockResolvedValue({
        data: {
          submissionId: 'sub_sql_7788',
          attemptId: 'attempt_sql_7788',
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

      (httpsCallable as jest.Mock).mockImplementation((_fns, name) => {
        if (name === 'startAssessment') return mockStartCallable;
        if (name === 'submitAssessment') return mockSubmitCallable;
        return jest.fn();
      });

      // 1. Start Session
      const session = await startAssessmentSession('exam-sql');
      expect(session.attemptId).toBe('attempt_sql_7788');
      expect(session.questions).toHaveLength(2);

      // 2. Submit Answers
      const answers = { 'sql-q1': 1, 'sql-q2': 1 };
      const submission = await submitAssessmentSession(session.attemptId, answers);

      expect(submission.submissionId).toBe('sub_sql_7788');
      expect(submission.passed).toBe(true);
      expect(submission.percentage).toBe(100);
      expect(submission.certificateEligible).toBe(true);
    });
  });

  describe('Journey 2 — Certificate Claim & Public Verification', () => {
    test('Learner claims certificate and public verifier confirms validity', async () => {
      const mockClaimCallable = jest.fn().mockResolvedValue({
        data: {
          certificateId: 'cert_learner_sql',
          recipientName: 'Alex Rivera',
          credentialTitle: 'SQL Relational Optimization Certification',
          assessmentId: 'exam-sql',
          courseId: 'course_sql_mastery',
          score: 100,
          issuedAt: '2026-08-19T06:10:00.000Z',
          verificationUrl: 'https://analyticsrise.com/verify/cert_learner_sql',
          status: 'valid',
          isDuplicate: false,
        },
      });

      const mockVerifyCallable = jest.fn().mockResolvedValue({
        data: {
          valid: true,
          certificateId: 'cert_learner_sql',
          recipientName: 'Alex Rivera',
          credentialTitle: 'SQL Relational Optimization Certification',
          score: 100,
          issuedAt: '2026-08-19T06:10:00.000Z',
          status: 'valid',
          verifiedAt: '2026-08-19T06:15:00.000Z',
        },
      });

      (httpsCallable as jest.Mock).mockImplementation((_fns, name) => {
        if (name === 'issueCertificate') return mockClaimCallable;
        if (name === 'verifyCertificate') return mockVerifyCallable;
        return jest.fn();
      });

      // 1. Claim Certificate
      const claimed = await claimCertificate('sub_sql_7788');
      expect(claimed.certificateId).toBe('cert_learner_sql');
      expect(claimed.status).toBe('valid');

      // 2. Public Verifier Check
      const verified = await verifyCertificateStatus(claimed.certificateId);
      expect(verified.valid).toBe(true);
      expect(verified.status).toBe('valid');
      expect(verified.recipientName).toBe('Alex Rivera');
    });
  });
});
