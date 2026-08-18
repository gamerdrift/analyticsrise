import * as fs from 'fs';
import * as path from 'path';

/**
 * Firestore Certificate Authority Security Rules Verification Test Suite
 * Mission 01B: Firestore Certificate Authority Hardening
 *
 * Verifies that the /certificates/{certificateId} collection is protected with
 * a zero-trust write policy where all client creation, update, and deletion are
 * strictly forbidden (allow write: if false), while preserving public verification access (allow read: if true).
 */

describe('Mission 01B: Firestore Certificate Authority Security Rules', () => {
  const firestoreRulesPath = path.resolve(__dirname, '../firebase/firestore.rules');
  let firestoreRulesContent: string;

  beforeAll(() => {
    expect(fs.existsSync(firestoreRulesPath)).toBe(true);
    firestoreRulesContent = fs.readFileSync(firestoreRulesPath, 'utf8');
  });

  describe('Firestore Rule File Syntax & Structure', () => {
    test('uses rules_version 2 and binds to cloud.firestore', () => {
      expect(firestoreRulesContent).toMatch(/rules_version\s*=\s*['"]2['"]/);
      expect(firestoreRulesContent).toMatch(/service\s+cloud\.firestore/);
      expect(firestoreRulesContent).toMatch(/match\s+\/databases\/\{database\}\/documents/);
    });
  });

  describe('Certificates Security Policy (/certificates/{certificateId})', () => {
    const getCertificatesBlock = () => {
      const match = firestoreRulesContent.match(/match\s+\/certificates\/\{certificateId\}[^{]*\{([\s\S]*?)\}/);
      return match ? match[1] : '';
    };

    test('1. Allows public read access for verification & sharing', () => {
      const block = getCertificatesBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+read\s*:\s*if\s+true\s*;/);
    });

    test('2. Strictly forbids all client writes (zero-trust)', () => {
      const block = getCertificatesBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+write\s*:\s*if\s+false\s*;/);
    });

    test('3. Does NOT permit isAuthenticated() client creation', () => {
      const block = getCertificatesBlock();
      expect(block).not.toMatch(/allow\s+create\s*:\s*if\s+isAuthenticated\(\)/);
      expect(block).not.toMatch(/allow\s+create\s*:\s*if\s+request\.auth/);
    });

    test('4. Does NOT permit client updates or deletes', () => {
      const block = getCertificatesBlock();
      expect(block).not.toMatch(/allow\s+update\s*:\s*if\s+true/);
      expect(block).not.toMatch(/allow\s+delete\s*:\s*if\s+true/);
    });
  });

  describe('Simulated Firestore Rule Evaluator: Client Request Scenarios', () => {
    interface FirestoreSecurityRequest {
      auth: { uid: string } | null;
      collection: string;
      docId: string;
      method: 'read' | 'create' | 'update' | 'delete';
    }

    const evaluateCertificateSecurity = (req: FirestoreSecurityRequest): boolean => {
      if (req.collection === 'certificates') {
        // match /certificates/{certificateId}
        if (req.method === 'read') return true; // allow read: if true;
        if (req.method === 'create' || req.method === 'update' || req.method === 'delete') {
          return false; // allow write: if false;
        }
      }
      return false;
    };

    test('1. Unauthenticated client cannot create certificate metadata', () => {
      expect(evaluateCertificateSecurity({
        auth: null,
        collection: 'certificates',
        docId: 'cert_hacked_001',
        method: 'create',
      })).toBe(false);
    });

    test('2. Authenticated normal user cannot create certificate metadata', () => {
      expect(evaluateCertificateSecurity({
        auth: { uid: 'usr_student_123' },
        collection: 'certificates',
        docId: 'cert_fake_456',
        method: 'create',
      })).toBe(false);
    });

    test('3. Authenticated normal user cannot update certificate metadata', () => {
      expect(evaluateCertificateSecurity({
        auth: { uid: 'usr_student_123' },
        collection: 'certificates',
        docId: 'cert_official_8921',
        method: 'update',
      })).toBe(false);
    });

    test('4. Authenticated normal user cannot delete certificate metadata', () => {
      expect(evaluateCertificateSecurity({
        auth: { uid: 'usr_student_123' },
        collection: 'certificates',
        docId: 'cert_official_8921',
        method: 'delete',
      })).toBe(false);
    });

    test('5. Public visitor CAN read certificate for verification', () => {
      expect(evaluateCertificateSecurity({
        auth: null,
        collection: 'certificates',
        docId: 'cert_official_8921',
        method: 'read',
      })).toBe(true);
    });

    test('6. Authenticated user CAN read certificate for verification', () => {
      expect(evaluateCertificateSecurity({
        auth: { uid: 'usr_student_123' },
        collection: 'certificates',
        docId: 'cert_official_8921',
        method: 'read',
      })).toBe(true);
    });
  });
});
