/**
 * Firebase Configuration Constants
 * 
 * Central source of truth for Firestore collection names, Storage paths,
 * role options, and default telemetry states.
 */

export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  SUBMISSIONS: 'submissions',
  CERTIFICATES: 'certificates',
  DATASETS: 'datasets',
  MISSIONS: 'missions',
  COMPANIES: 'companies',
  JOBS: 'jobs',
} as const;

export const STORAGE_PATHS = {
  AVATARS: 'avatars',
  DATASETS: 'datasets',
  CERTIFICATES: 'certificates',
} as const;

export const DEFAULT_TELEMETRY = {
  XP: 0,
  POINTS: 0,
  LEVEL: 1,
  STREAK: 0,
  LAST_ACTIVE_DATE: '',
} as const;

export const USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  ENTERPRISE: 'enterprise',
} as const;
