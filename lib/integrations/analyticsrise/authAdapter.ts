/**
 * RevenueRiseAI — Authentication Adapter
 * Consumes the authoritative identity from AnalyticsRise (Firebase Auth)
 * without duplicating auth instances or creating secondary identities.
 */

import { AuthUser, AuthSession } from './types';
import { AuthenticationError } from '@/lib/errors';
import { logger } from '@/lib/observability';

export interface IAuthAdapter {
  getCurrentUser(): Promise<AuthUser | null>;
  getSession(): Promise<AuthSession>;
  getIdToken(): Promise<string | null>;
  requireAuth(): Promise<AuthUser>;
}

export class AnalyticsRiseAuthAdapter implements IAuthAdapter {
  private mockUser: AuthUser | null = null;

  constructor(mockUser?: AuthUser | null) {
    if (mockUser) {
      this.mockUser = mockUser;
    }
  }

  public setMockUser(user: AuthUser | null) {
    this.mockUser = user;
  }

  public async getCurrentUser(): Promise<AuthUser | null> {
    if (this.mockUser !== null) {
      return this.mockUser;
    }

    try {
      // Dynamic resolution of Firebase Auth state
      if (typeof window !== 'undefined') {
        const { auth } = await import('@/lib/firebase/config');
        if (auth && auth.currentUser) {
          const u = auth.currentUser;
          return {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
            emailVerified: u.emailVerified,
          };
        }
      }
    } catch (err: any) {
      logger.warn('Could not resolve current Firebase Auth user:', { error: err?.message });
    }

    return null;
  }

  public async getSession(): Promise<AuthSession> {
    const user = await this.getCurrentUser();
    const token = await this.getIdToken();

    return {
      user,
      isAuthenticated: user !== null,
      isLoading: false,
      idToken: token || undefined,
    };
  }

  public async getIdToken(): Promise<string | null> {
    if (this.mockUser) {
      return `mock-jwt-token-for-${this.mockUser.uid}`;
    }

    try {
      if (typeof window !== 'undefined') {
        const { auth } = await import('@/lib/firebase/config');
        if (auth && auth.currentUser) {
          return await auth.currentUser.getIdToken();
        }
      }
    } catch (err: any) {
      logger.warn('Failed to retrieve Firebase ID token:', { error: err?.message });
    }

    return null;
  }

  public async requireAuth(): Promise<AuthUser> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new AuthenticationError('User authentication required.');
    }
    return user;
  }
}

export const authAdapter = new AnalyticsRiseAuthAdapter();
