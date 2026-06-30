/**
 * Common type definitions used throughout the application
 */

export type UserRole = 'student' | 'instructor' | 'admin' | 'recruiter' | 'enterprise';

/**
 * User Profile Type
 * Represents a user in the system
 */
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
}

/**
 * User Achievement Type
 */
export interface UserAchievement {
  id: string;
  name: string;
  earnedAt: string;
}

/**
 * User Firestore Data Schema
 * Matches the structure stored in Firestore: /users/{userId}
 */
export interface UserFirestoreData {
  profile: {
    displayName: string;
    email: string;
    avatarUrl: string;
    role: UserRole;
  };
  telemetry: {
    xp: number;
    points: number;
    level: number;
    streak: number;
    lastActiveDate: string;
  };
  achievements: UserAchievement[];
}

/**
 * User Type (App Level)
 * Flattened structure for frontend convenience, combining auth and telemetry
 */
export interface User {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  xp: number;
  points: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  achievements: UserAchievement[];
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mission Type
 */
export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'excel' | 'sql' | 'powerbi' | 'tableau';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  pointsReward: number;
  isCompleted: boolean;
  order: number;
}

/**
 * Company Type
 */
export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  website: string;
  industry: string;
  location: string;
  createdAt: Date;
}

/**
 * Job Type
 */
export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl?: string;
  title: string;
  description: string;
  requirements: string[];
  salaryRange?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote' | 'internship';
  postedAt: Date;
  isActive: boolean;
}

/**
 * User Preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailUpdates: boolean;
  language: string;
}

/**
 * Course Type
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  thumbnail: string;
  duration: number; // in hours
  students: number;
  rating: number;
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Course Module
 */
export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

/**
 * Lesson
 */
export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number;
  videoUrl?: string;
  exercises: Exercise[];
}

/**
 * Exercise
 */
export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'project' | 'lab';
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * Assessment Type
 */
export interface Assessment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  questions: Question[];
  passingScore: number;
  duration: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Assessment Question
 */
export interface Question {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'essay';
  text: string;
  options?: Option[];
  correctAnswer?: string;
  points: number;
}

/**
 * Question Option
 */
export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

/**
 * Assessment Result
 */
export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentId: string;
  score: number;
  percentage: number;
  answers: Answer[];
  submittedAt: Date;
  passed: boolean;
}

/**
 * User Answer
 */
export interface Answer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  points: number;
}

/**
 * Certificate
 */
export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  title: string;
  issueDate: Date;
  expiryDate?: Date;
  certificateUrl: string;
  verificationUrl: string;
  isValid: boolean;
}

/**
 * Leaderboard Entry
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  coursesCompleted: number;
  certificatesEarned: number;
  lastActivityDate: Date;
}

/**
 * User Progress
 */
export interface UserProgress {
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedModules: number;
  totalModules: number;
  completedLessons: number;
  totalLessons: number;
  assessmentScores: AssessmentScore[];
  lastAccessedAt: Date;
}

/**
 * Assessment Score
 */
export interface AssessmentScore {
  assessmentId: string;
  score: number;
  percentage: number;
  attempts: number;
  firstAttemptDate: Date;
  lastAttemptDate: Date;
  passed: boolean;
}

/**
 * Dataset
 */
export interface Dataset {
  id: string;
  title: string;
  description: string;
  category: string;
  source: string;
  rows: number;
  columns: number;
  fileSize: string;
  downloadUrl: string;
  createdAt: Date;
  usedInCourses: string[];
}

/**
 * Community Post
 */
export interface CommunityPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

/**
 * API Response Type
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
