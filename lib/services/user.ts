import { FirestoreService } from './firestore';
import { FIREBASE_COLLECTIONS, DEFAULT_TELEMETRY } from '../constants/firebase';
import { UserFirestoreData, UserRole } from '../types';

/**
 * User Service
 * 
 * Manages user profile retrieval, registration profiles, and telemetry updates in Firestore.
 */
export const UserService = {
  /**
   * Fetch a user's profile and telemetry document by ID
   */
  async getUserProfile(userId: string): Promise<UserFirestoreData | null> {
    return FirestoreService.getDocument<UserFirestoreData>(FIREBASE_COLLECTIONS.USERS, userId);
  },

  /**
   * Initialize a default user profile document upon signup
   */
  async createUserProfile(
    userId: string, 
    email: string, 
    displayName: string, 
    role: UserRole = 'student'
  ): Promise<void> {
    const defaultData = {
      profile: {
        displayName,
        email,
        avatarUrl: '',
        role
      },
      telemetry: {
        xp: DEFAULT_TELEMETRY.XP,
        points: DEFAULT_TELEMETRY.POINTS,
        level: DEFAULT_TELEMETRY.LEVEL,
        streak: DEFAULT_TELEMETRY.STREAK,
        lastActiveDate: new Date().toISOString().split('T')[0]
      },
      achievements: []
    };
    await FirestoreService.setDocument(FIREBASE_COLLECTIONS.USERS, userId, defaultData);
  },

  /**
   * Update a user's role (Admin / Recruiter / Student / etc.)
   */
  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    await FirestoreService.updateDocument(FIREBASE_COLLECTIONS.USERS, userId, {
      'profile.role': role
    });
  },

  /**
   * Increment or update user telemetry parameters (XP, level, streak, etc.)
   */
  async updateUserTelemetry(
    userId: string, 
    updates: { xp: number; points: number; level: number; streak: number }
  ): Promise<void> {
    await FirestoreService.updateDocument(FIREBASE_COLLECTIONS.USERS, userId, {
      'telemetry.xp': updates.xp,
      'telemetry.points': updates.points,
      'telemetry.level': updates.level,
      'telemetry.streak': updates.streak,
      'telemetry.lastActiveDate': new Date().toISOString().split('T')[0]
    });
  },

  /**
   * Append an achievement to the user's earned achievements list
   */
  async awardAchievement(
    userId: string, 
    achievementId: string, 
    achievementName: string
  ): Promise<void> {
    const userProfile = await this.getUserProfile(userId);
    if (!userProfile) return;

    const existingAchievements = userProfile.achievements || [];
    if (existingAchievements.some(a => a.id === achievementId)) {
      return; // Already earned
    }

    const newAchievement = {
      id: achievementId,
      name: achievementName,
      earnedAt: new Date().toISOString()
    };

    await FirestoreService.updateDocument(FIREBASE_COLLECTIONS.USERS, userId, {
      achievements: [...existingAchievements, newAchievement]
    });
  },

  /**
   * Update arbitrary fields in the user profile (e.g., country, newsletter, etc.).
   * Accepts a partial object matching the Firestore schema.
   */
  async updateUserProfile(userId: string, updates: Partial<UserFirestoreData>): Promise<void> {
    await FirestoreService.updateDocument(FIREBASE_COLLECTIONS.USERS, userId, updates);
  },
};
export default UserService;
