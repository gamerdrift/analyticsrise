import * as fs from 'fs';
import * as path from 'path';

/**
 * Storage Security Rules Verification Test Suite
 * Mission 01A: Firebase Storage Security Hardening
 *
 * Verifies that certificates and datasets are protected with a zero-trust write policy
 * where client writes/updates/deletes are strictly forbidden (allow write: if false).
 */

describe('Mission 01A: Firebase Storage Security Rules', () => {
  const rulesPath = path.resolve(__dirname, '../firebase/storage.rules');
  let rulesContent: string;

  beforeAll(() => {
    expect(fs.existsSync(rulesPath)).toBe(true);
    rulesContent = fs.readFileSync(rulesPath, 'utf8');
  });

  describe('Storage Rule File Syntax & Structure', () => {
    test('uses rules_version 2 and binds to firebase.storage', () => {
      expect(rulesContent).toMatch(/rules_version\s*=\s*['"]2['"]/);
      expect(rulesContent).toMatch(/service\s+firebase\.storage/);
      expect(rulesContent).toMatch(/match\s+\/b\/\{bucket\}\/o/);
    });

    test('defines isAuthenticated and isOwner helper functions', () => {
      expect(rulesContent).toMatch(/function\s+isAuthenticated\s*\(\)\s*\{/);
      expect(rulesContent).toMatch(/function\s+isOwner\s*\(\w+\)\s*\{/);
    });
  });

  describe('Certificates Security Policy (/certificates/**)', () => {
    const getCertificatesBlock = () => {
      const match = rulesContent.match(/match\s+\/certificates\/\{allPaths=\*\*\}[^{]*\{([\s\S]*?)\}/);
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

    test('3. Does NOT permit isAuthenticated() or arbitrary write for certificates', () => {
      const block = getCertificatesBlock();
      expect(block).not.toMatch(/allow\s+write\s*:\s*if\s+isAuthenticated\(\)/);
      expect(block).not.toMatch(/allow\s+write\s*:\s*if\s+request\.auth/);
    });
  });

  describe('Datasets Security Policy (/datasets/**)', () => {
    const getDatasetsBlock = () => {
      const match = rulesContent.match(/match\s+\/datasets\/\{allPaths=\*\*\}[^{]*\{([\s\S]*?)\}/);
      return match ? match[1] : '';
    };

    test('1. Allows authenticated read access for platform learners', () => {
      const block = getDatasetsBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+read\s*:\s*if\s+isAuthenticated\(\)\s*;/);
    });

    test('2. Strictly forbids all client writes (zero-trust)', () => {
      const block = getDatasetsBlock();
      expect(block).toBeTruthy();
      expect(block).toMatch(/allow\s+write\s*:\s*if\s+false\s*;/);
    });

    test('3. Does NOT permit isAuthenticated() or arbitrary write for datasets', () => {
      const block = getDatasetsBlock();
      expect(block).not.toMatch(/allow\s+write\s*:\s*if\s+isAuthenticated\(\)/);
      expect(block).not.toMatch(/allow\s+write\s*:\s*if\s+request\.auth/);
    });
  });

  describe('User-Owned Paths Policy (/avatars & /resumes)', () => {
    test('avatars requires owner UID match for write', () => {
      const avatarMatch = rulesContent.match(/match\s+\/avatars\/\{userId\}\/\{allPaths=\*\*\}[^{]*\{([\s\S]*?)\}/);
      expect(avatarMatch).toBeTruthy();
      const block = avatarMatch![1];
      expect(block).toMatch(/allow\s+read\s*:\s*if\s+isAuthenticated\(\)\s*;/);
      expect(block).toMatch(/allow\s+write\s*:\s*if\s+isOwner\(userId\)\s*;/);
    });

    test('resumes requires owner UID match for read and write', () => {
      const resumeMatch = rulesContent.match(/match\s+\/resumes\/\{userId\}\/\{allPaths=\*\*\}[^{]*\{([\s\S]*?)\}/);
      expect(resumeMatch).toBeTruthy();
      const block = resumeMatch![1];
      expect(block).toMatch(/allow\s+read\s*:\s*if\s+isOwner\(userId\)\s*;/);
      expect(block).toMatch(/allow\s+write\s*:\s*if\s+isOwner\(userId\)\s*;/);
    });
  });

  describe('Simulated Rule Evaluator: Client Request Scenarios', () => {
    interface SecurityRequest {
      auth: { uid: string } | null;
      path: string;
      method: 'read' | 'write' | 'delete';
    }

    const evaluateStorageSecurity = (req: SecurityRequest): boolean => {
      const isAuth = req.auth !== null;
      const uid = req.auth?.uid;

      // 1. /avatars/{userId}/...
      const avatarMatch = req.path.match(/^\/avatars\/([^/]+)/);
      if (avatarMatch) {
        const ownerId = avatarMatch[1];
        if (req.method === 'read') return isAuth;
        if (req.method === 'write' || req.method === 'delete') return isAuth && uid === ownerId;
      }

      // 2. /resumes/{userId}/...
      const resumeMatch = req.path.match(/^\/resumes\/([^/]+)/);
      if (resumeMatch) {
        const ownerId = resumeMatch[1];
        if (req.method === 'read') return isAuth && uid === ownerId;
        if (req.method === 'write' || req.method === 'delete') return isAuth && uid === ownerId;
      }

      // 3. /certificates/...
      if (req.path.startsWith('/certificates/')) {
        if (req.method === 'read') return true; // Public read
        if (req.method === 'write' || req.method === 'delete') return false; // Zero-trust
      }

      // 4. /datasets/...
      if (req.path.startsWith('/datasets/')) {
        if (req.method === 'read') return isAuth; // Authenticated read
        if (req.method === 'write' || req.method === 'delete') return false; // Zero-trust
      }

      return false;
    };

    test('1. Unauthenticated client cannot write certificates', () => {
      expect(evaluateStorageSecurity({ auth: null, path: '/certificates/cert_123.pdf', method: 'write' })).toBe(false);
    });

    test('2. Authenticated normal user cannot write certificates', () => {
      expect(evaluateStorageSecurity({ auth: { uid: 'usr_normal_1' }, path: '/certificates/cert_123.pdf', method: 'write' })).toBe(false);
    });

    test('3. Authenticated normal user cannot overwrite existing certificate', () => {
      expect(evaluateStorageSecurity({ auth: { uid: 'usr_malicious' }, path: '/certificates/cert_official.pdf', method: 'write' })).toBe(false);
    });

    test('4. Authenticated normal user cannot delete certificates', () => {
      expect(evaluateStorageSecurity({ auth: { uid: 'usr_normal_1' }, path: '/certificates/cert_123.pdf', method: 'delete' })).toBe(false);
    });

    test('5. Unauthenticated client cannot write datasets', () => {
      expect(evaluateStorageSecurity({ auth: null, path: '/datasets/ecommerce_2026.csv', method: 'write' })).toBe(false);
    });

    test('6. Authenticated normal user cannot write datasets', () => {
      expect(evaluateStorageSecurity({ auth: { uid: 'usr_normal_1' }, path: '/datasets/ecommerce_2026.csv', method: 'write' })).toBe(false);
    });

    test('7. Authenticated normal user cannot overwrite official datasets', () => {
      expect(evaluateStorageSecurity({ auth: { uid: 'usr_malicious' }, path: '/datasets/ecommerce_2026.csv', method: 'write' })).toBe(false);
    });

    test('8. Authenticated normal user cannot delete official datasets', () => {
      expect(evaluateStorageSecurity({ auth: { uid: 'usr_normal_1' }, path: '/datasets/ecommerce_2026.csv', method: 'delete' })).toBe(false);
    });

    test('9. Anonymous user CAN read certificates for public verification', () => {
      expect(evaluateStorageSecurity({ auth: null, path: '/certificates/cert_123.pdf', method: 'read' })).toBe(true);
    });

    test('10. Anonymous user CANNOT read official datasets', () => {
      expect(evaluateStorageSecurity({ auth: null, path: '/datasets/ecommerce_2026.csv', method: 'read' })).toBe(false);
    });

    test('11. Authenticated learner CAN read official datasets', () => {
      expect(evaluateStorageSecurity({ auth: { uid: 'usr_student_1' }, path: '/datasets/ecommerce_2026.csv', method: 'read' })).toBe(true);
    });

    test('12. User CANNOT modify another user avatar', () => {
      expect(evaluateStorageSecurity({ auth: { uid: 'usr_attacker' }, path: '/avatars/victim_user/avatar.png', method: 'write' })).toBe(false);
    });

    test('13. User CAN modify their own avatar', () => {
      expect(evaluateStorageSecurity({ auth: { uid: 'usr_legit' }, path: '/avatars/usr_legit/avatar.png', method: 'write' })).toBe(true);
    });
  });
});
