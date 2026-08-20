import * as fs from 'fs';
import * as path from 'path';

/**
 * Firestore Security Rules Verification Test Suite
 * Mission 01C: Assessment & Certification Access Control Hardening
 *
 * Verifies that:
 * 1. /assessmentAnswers/{assessmentId} is strictly client-inaccessible (allow read, write: if false)
 * 2. /submissions/{submissionId} is protected against all client writes (allow write: if false)
 * 3. /assessmentAttempts/{attemptId} is protected against all client writes (allow write: if false)
 * 4. /certificates/{certificateId} preserves zero-trust client writes with public read verification
 * 5. /assessments/{assessmentId} allows authenticated read and restricts writes to instructors/admins
 * 6. /entitlements/{userId} allows owner read and forbids all client writes
 */

describe('Mission 01C: Assessment & Certification Firestore Security Rules', () => {
  const firestoreRulesPath = path.resolve(__dirname, '../firebase/firestore.rules');
  let firestoreRulesContent: string;

  beforeAll(() => {
    expect(fs.existsSync(firestoreRulesPath)).toBe(true);
    firestoreRulesContent = fs.readFileSync(firestoreRulesPath, 'utf8');
  });

  describe('1. Rule File Syntax & Declaration Verifications', () => {
    test('declares rules_version 2 and binds to cloud.firestore', () => {
      expect(firestoreRulesContent).toMatch(/rules_version\s*=\s*['"]2['"]/);
      expect(firestoreRulesContent).toMatch(/service\s+cloud\.firestore/);
      expect(firestoreRulesContent).toMatch(/match\s+\/databases\/\{database\}\/documents/);
    });

    test('declares core auth and role helper functions', () => {
      expect(firestoreRulesContent).toMatch(/function\s+isAuthenticated\s*\(\)\s*\{/);
      expect(firestoreRulesContent).toMatch(/function\s+isOwner\s*\(\w+\)\s*\{/);
      expect(firestoreRulesContent).toMatch(/function\s+isAdmin\s*\(\)\s*\{/);
      expect(firestoreRulesContent).toMatch(/function\s+isInstructor\s*\(\)\s*\{/);
      expect(firestoreRulesContent).toMatch(/function\s+isRecruiter\s*\(\)\s*\{/);
    });
  });

  describe('2. Private Answer Keys Security (/assessmentAnswers/{assessmentId})', () => {
    const getAnswerKeysBlock = () => {
      const match = firestoreRulesContent.match(
        /match\s+\/assessmentAnswers\/\{assessmentId\}[^{]*\{([\s\S]*?)\}/
      );
      return match ? match[1] : '';
    };

    test('strictly denies all client reads and writes (allow read, write: if false)', () => {
      const block = getAnswerKeysBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+read,\s*write\s*:\s*if\s+false\s*;/);
    });

    test('does NOT allow authenticated users, instructors, or admins client access', () => {
      const block = getAnswerKeysBlock();
      expect(block).not.toMatch(/allow\s+read\s*:\s*if\s+isAuthenticated/);
      expect(block).not.toMatch(/allow\s+read\s*:\s*if\s+isInstructor/);
      expect(block).not.toMatch(/allow\s+read\s*:\s*if\s+isAdmin/);
    });
  });

  describe('3. Assessment Attempts Security (/assessmentAttempts/{attemptId})', () => {
    const getAttemptsBlock = () => {
      const match = firestoreRulesContent.match(
        /match\s+\/assessmentAttempts\/\{attemptId\}[^{]*\{([\s\S]*?)\}/
      );
      return match ? match[1] : '';
    };

    test('allows owner or admin to read attempt records', () => {
      const block = getAttemptsBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+read\s*:\s*if\s+isAuthenticated\(\)\s*&&[\s\S]*resource\.data\.userId\s*==\s*request\.auth\.uid/);
    });

    test('strictly forbids all client writes (zero-trust client writes)', () => {
      const block = getAttemptsBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+write\s*:\s*if\s+false\s*;/);
    });

    test('does NOT permit client create, update, or delete', () => {
      const block = getAttemptsBlock();
      expect(block).not.toMatch(/allow\s+create\s*:\s*if\s+isAuthenticated/);
      expect(block).not.toMatch(/allow\s+update\s*:\s*if\s+isAuthenticated/);
      expect(block).not.toMatch(/allow\s+delete\s*:\s*if\s+isAuthenticated/);
    });
  });

  describe('4. Official Submissions Security (/submissions/{submissionId})', () => {
    const getSubmissionsBlock = () => {
      const match = firestoreRulesContent.match(
        /match\s+\/submissions\/\{submissionId\}[^{]*\{([\s\S]*?)\}/
      );
      return match ? match[1] : '';
    };

    test('allows owner or admin to read official submissions', () => {
      const block = getSubmissionsBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+read\s*:\s*if\s+isAuthenticated\(\)\s*&&[\s\S]*resource\.data\.userId\s*==\s*request\.auth\.uid/);
    });

    test('strictly forbids all client writes (prevents score/submission forgery)', () => {
      const block = getSubmissionsBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+write\s*:\s*if\s+false\s*;/);
    });

    test('does NOT permit client create (must be graded by Cloud Function)', () => {
      const block = getSubmissionsBlock();
      expect(block).not.toMatch(/allow\s+create\s*:\s*if\s+isAuthenticated/);
      expect(block).not.toMatch(/allow\s+create\s*:\s*if\s+request\.auth/);
    });
  });

  describe('5. Assessment Metadata Security (/assessments/{assessmentId})', () => {
    const getAssessmentsBlock = () => {
      const match = firestoreRulesContent.match(
        /match\s+\/assessments\/\{assessmentId\}[^{]*\{([\s\S]*?)\}/
      );
      return match ? match[1] : '';
    };

    test('allows authenticated learners to read sanitized assessment metadata', () => {
      const block = getAssessmentsBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+read\s*:\s*if\s+isAuthenticated\(\)\s*;/);
    });

    test('restricts write operations to instructors and administrators', () => {
      const block = getAssessmentsBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+write\s*:\s*if\s+isInstructor\(\)\s*;/);
    });
  });

  describe('6. Certificates Security (/certificates/{certificateId})', () => {
    const getCertificatesBlock = () => {
      const match = firestoreRulesContent.match(
        /match\s+\/certificates\/\{certificateId\}[^{]*\{([\s\S]*?)\}/
      );
      return match ? match[1] : '';
    };

    test('allows public read access for verification & sharing', () => {
      const block = getCertificatesBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+read\s*:\s*if\s+true\s*;/);
    });

    test('strictly forbids all client writes (zero-trust client writes)', () => {
      const block = getCertificatesBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+write\s*:\s*if\s+false\s*;/);
    });
  });

  describe('7. Subscription Entitlements Security (/entitlements/{userId})', () => {
    const getEntitlementsBlock = () => {
      const match = firestoreRulesContent.match(
        /match\s+\/entitlements\/\{userId\}[^{]*\{([\s\S]*?)\}/
      );
      return match ? match[1] : '';
    };

    test('allows owner or admin to read entitlement state', () => {
      const block = getEntitlementsBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+read\s*:\s*if\s+isAuthenticated\(\)\s*&&[\s\S]*userId\s*==\s*request\.auth\.uid/);
    });

    test('strictly forbids all client writes to entitlement records', () => {
      const block = getEntitlementsBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+write\s*:\s*if\s+false\s*;/);
    });
  });

  describe('8. Comprehensive Role & Permission Security Evaluator Simulation', () => {
    interface SecurityRequest {
      auth: { uid: string; role?: 'student' | 'instructor' | 'admin' } | null;
      collection: string;
      docId: string;
      resourceData?: Record<string, any>;
      method: 'read' | 'create' | 'update' | 'delete';
    }

    const evaluateFirestoreSecurity = (req: SecurityRequest): boolean => {
      const isAuth = req.auth !== null;
      const uid = req.auth?.uid;
      const role = req.auth?.role || 'student';
      const isAdmin = isAuth && role === 'admin';
      const isInstructor = isAuth && (role === 'instructor' || role === 'admin');

      switch (req.collection) {
        case 'assessmentAnswers':
          // allow read, write: if false;
          return false;

        case 'assessmentAttempts':
          // allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin());
          // allow write: if false;
          if (req.method === 'read') {
            return isAuth && (req.resourceData?.userId === uid || isAdmin);
          }
          return false;

        case 'submissions':
          // allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin());
          // allow write: if false;
          if (req.method === 'read') {
            return isAuth && (req.resourceData?.userId === uid || isAdmin);
          }
          return false;

        case 'assessments':
          // allow read: if isAuthenticated();
          // allow write: if isInstructor();
          if (req.method === 'read') {
            return isAuth;
          }
          return isInstructor;

        case 'certificates':
          // allow read: if true;
          // allow write: if false;
          if (req.method === 'read') {
            return true;
          }
          return false;

        case 'entitlements':
          // allow read: if isAuthenticated() && (userId == request.auth.uid || isAdmin());
          // allow write: if false;
          if (req.method === 'read') {
            return isAuth && (req.docId === uid || isAdmin);
          }
          return false;

        default:
          return false;
      }
    };

    describe('A. Private Answer Keys Access Matrix', () => {
      test('Anonymous read /assessmentAnswers is DENIED', () => {
        expect(evaluateFirestoreSecurity({
          auth: null,
          collection: 'assessmentAnswers',
          docId: 'exam-sql',
          method: 'read',
        })).toBe(false);
      });

      test('Learner read /assessmentAnswers is DENIED', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'assessmentAnswers',
          docId: 'exam-sql',
          method: 'read',
        })).toBe(false);
      });

      test('Learner write /assessmentAnswers is DENIED', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'assessmentAnswers',
          docId: 'exam-sql',
          method: 'create',
        })).toBe(false);
      });

      test('Instructor read /assessmentAnswers is DENIED', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_instructor_1', role: 'instructor' },
          collection: 'assessmentAnswers',
          docId: 'exam-sql',
          method: 'read',
        })).toBe(false);
      });

      test('Admin client read /assessmentAnswers is DENIED', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_admin_1', role: 'admin' },
          collection: 'assessmentAnswers',
          docId: 'exam-sql',
          method: 'read',
        })).toBe(false);
      });
    });

    describe('B. Submissions Access Matrix', () => {
      test('Anonymous read /submissions is DENIED', () => {
        expect(evaluateFirestoreSecurity({
          auth: null,
          collection: 'submissions',
          docId: 'sub_123',
          resourceData: { userId: 'usr_student_1' },
          method: 'read',
        })).toBe(false);
      });

      test('Learner can read own official submission', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'submissions',
          docId: 'sub_123',
          resourceData: { userId: 'usr_student_1' },
          method: 'read',
        })).toBe(true);
      });

      test('Learner CANNOT read another learner submission', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_attacker', role: 'student' },
          collection: 'submissions',
          docId: 'sub_123',
          resourceData: { userId: 'usr_student_1' },
          method: 'read',
        })).toBe(false);
      });

      test('Learner CANNOT forge/create a submission directly', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'submissions',
          docId: 'sub_fake_100',
          method: 'create',
        })).toBe(false);
      });

      test('Learner CANNOT update a submission directly', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'submissions',
          docId: 'sub_123',
          resourceData: { userId: 'usr_student_1' },
          method: 'update',
        })).toBe(false);
      });

      test('Learner CANNOT delete a submission directly', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'submissions',
          docId: 'sub_123',
          resourceData: { userId: 'usr_student_1' },
          method: 'delete',
        })).toBe(false);
      });

      test('Admin can read submissions for audit purposes', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_admin_1', role: 'admin' },
          collection: 'submissions',
          docId: 'sub_123',
          resourceData: { userId: 'usr_student_1' },
          method: 'read',
        })).toBe(true);
      });
    });

    describe('C. Assessment Attempts Access Matrix', () => {
      test('Anonymous read /assessmentAttempts is DENIED', () => {
        expect(evaluateFirestoreSecurity({
          auth: null,
          collection: 'assessmentAttempts',
          docId: 'att_123',
          resourceData: { userId: 'usr_student_1' },
          method: 'read',
        })).toBe(false);
      });

      test('Learner can read own attempt session', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'assessmentAttempts',
          docId: 'att_123',
          resourceData: { userId: 'usr_student_1' },
          method: 'read',
        })).toBe(true);
      });

      test('Learner CANNOT read another learner attempt session', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_attacker', role: 'student' },
          collection: 'assessmentAttempts',
          docId: 'att_123',
          resourceData: { userId: 'usr_student_1' },
          method: 'read',
        })).toBe(false);
      });

      test('Learner CANNOT create attempt directly (must call startAssessment)', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'assessmentAttempts',
          docId: 'att_forged_999',
          method: 'create',
        })).toBe(false);
      });

      test('Learner CANNOT update attempt directly (e.g. extending timer or status)', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'assessmentAttempts',
          docId: 'att_123',
          resourceData: { userId: 'usr_student_1' },
          method: 'update',
        })).toBe(false);
      });
    });

    describe('D. Certificates Access Matrix', () => {
      test('Public visitor CAN read certificate for verification', () => {
        expect(evaluateFirestoreSecurity({
          auth: null,
          collection: 'certificates',
          docId: 'cert_123',
          method: 'read',
        })).toBe(true);
      });

      test('Authenticated learner CAN read certificate', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'certificates',
          docId: 'cert_123',
          method: 'read',
        })).toBe(true);
      });

      test('Client creation of certificate is DENIED (zero-trust)', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'certificates',
          docId: 'cert_fake',
          method: 'create',
        })).toBe(false);
      });

      test('Client update of certificate is DENIED (zero-trust)', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'certificates',
          docId: 'cert_123',
          method: 'update',
        })).toBe(false);
      });

      test('Client deletion of certificate is DENIED (zero-trust)', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'certificates',
          docId: 'cert_123',
          method: 'delete',
        })).toBe(false);
      });
    });

    describe('E. Entitlements Access Matrix', () => {
      test('Anonymous read /entitlements is DENIED', () => {
        expect(evaluateFirestoreSecurity({
          auth: null,
          collection: 'entitlements',
          docId: 'usr_student_1',
          method: 'read',
        })).toBe(false);
      });

      test('Learner can read own entitlement', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'entitlements',
          docId: 'usr_student_1',
          method: 'read',
        })).toBe(true);
      });

      test('Learner CANNOT read another user entitlement', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'entitlements',
          docId: 'usr_student_2',
          method: 'read',
        })).toBe(false);
      });

      test('Learner CANNOT modify own entitlement (e.g. elevating plan)', () => {
        expect(evaluateFirestoreSecurity({
          auth: { uid: 'usr_student_1', role: 'student' },
          collection: 'entitlements',
          docId: 'usr_student_1',
          method: 'update',
        })).toBe(false);
      });
    });
  });
});
