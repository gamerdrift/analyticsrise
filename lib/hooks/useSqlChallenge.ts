"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PublicChallenge,
  SubmitChallengeAttemptResponse,
  ChallengeProgressRecord,
  ChallengeAttemptRecord,
  UnlockDecision,
} from '../sql/challenges/types';
import {
  SqlChallengeClientService,
  ChallengeRequestStatus,
  ChallengeValidationOutcome,
  NormalizedError,
  generateSubmissionIdempotencyKey,
  normalizeChallengeError,
} from '../services/sqlChallengeClientService';

export interface UseSqlChallengeOptions {
  autoLoad?: boolean;
  onSuccess?: (response: SubmitChallengeAttemptResponse) => void;
  onError?: (error: NormalizedError) => void;
}

export interface UseSqlChallengeReturn {
  challenge: PublicChallenge | null;
  progress: ChallengeProgressRecord | null;
  unlockDecision: UnlockDecision | null;
  attempts: ChallengeAttemptRecord[];
  isLoading: boolean;
  isSubmitting: boolean;
  submissionOutcome: ChallengeValidationOutcome | null;
  submissionResult: SubmitChallengeAttemptResponse | null;
  error: NormalizedError | null;
  submitQuery: (sql: string, hintsUsed?: number) => Promise<SubmitChallengeAttemptResponse | null>;
  retryLastSubmission: () => Promise<SubmitChallengeAttemptResponse | null>;
  refresh: () => Promise<void>;
}

/**
 * Custom React hook for seamless, safe SQL Studio challenge integration in Phase C6
 */
export function useSqlChallenge(
  challengeId: string,
  options: UseSqlChallengeOptions = {}
): UseSqlChallengeReturn {
  const { autoLoad = true, onSuccess, onError } = options;

  const [challenge, setChallenge] = useState<PublicChallenge | null>(() =>
    SqlChallengeClientService.getChallenge(challengeId)
  );
  const [progress, setProgress] = useState<ChallengeProgressRecord | null>(null);
  const [unlockDecision, setUnlockDecision] = useState<UnlockDecision | null>(null);
  const [attempts, setAttempts] = useState<ChallengeAttemptRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionOutcome, setSubmissionOutcome] = useState<ChallengeValidationOutcome | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmitChallengeAttemptResponse | null>(null);
  const [error, setError] = useState<NormalizedError | null>(null);

  // Idempotency state management
  const lastLogicalQueryRef = useRef<{ sql: string; hintsUsed: number; key: string } | null>(null);
  const isSubmittingRef = useRef<boolean>(false);

  // Load challenge metadata & remote progress
  const refresh = useCallback(async () => {
    if (!challengeId) return;

    setIsLoading(true);
    setError(null);

    try {
      const chal = SqlChallengeClientService.getChallenge(challengeId);
      setChallenge(chal);

      // Concurrent fetch for progress, unlock status, and attempts
      const [progRes, unlockRes, attemptsRes] = await Promise.allSettled([
        SqlChallengeClientService.getChallengeProgress(challengeId),
        SqlChallengeClientService.getChallengeUnlockStatus(challengeId),
        SqlChallengeClientService.getChallengeAttempts(challengeId, 5),
      ]);

      if (progRes.status === 'fulfilled') setProgress(progRes.value);
      if (unlockRes.status === 'fulfilled') setUnlockDecision(unlockRes.value);
      if (attemptsRes.status === 'fulfilled') setAttempts(attemptsRes.value);
    } catch (err: any) {
      setError(normalizeChallengeError(err));
    } finally {
      setIsLoading(false);
    }
  }, [challengeId]);

  useEffect(() => {
    if (autoLoad && challengeId) {
      refresh();
    }
  }, [autoLoad, challengeId, refresh]);

  /**
   * Authoritative query submission with in-flight lock and idempotency protection
   */
  const submitQuery = useCallback(
    async (sql: string, hintsUsed: number = 0): Promise<SubmitChallengeAttemptResponse | null> => {
      if (!challengeId || !sql || sql.trim().length === 0) {
        return null;
      }

      // Concurrency protection: Ignore double clicks while already in flight
      if (isSubmittingRef.current) {
        return null;
      }

      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setError(null);
      setSubmissionOutcome(null);

      // Generate a new idempotency key for this distinct submission
      const idempotencyKey = generateSubmissionIdempotencyKey(challengeId);
      lastLogicalQueryRef.current = { sql, hintsUsed, key: idempotencyKey };

      try {
        const response = await SqlChallengeClientService.submitChallengeAttempt({
          challengeId,
          sql,
          hintsUsed,
          idempotencyKey,
        });

        setSubmissionResult(response);

        // Map status to clean outcome
        if (response.passed) {
          setSubmissionOutcome('PASS');
        } else if (response.status === 'INVALID') {
          setSubmissionOutcome('INVALID');
        } else if (response.status === 'ERROR') {
          setSubmissionOutcome('ERROR');
        } else if (response.score > 0) {
          setSubmissionOutcome('PARTIAL');
        } else {
          setSubmissionOutcome('FAIL');
        }

        // Refresh learner progress after mutation
        refresh();

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('ar-sql-progress-updated', { detail: { challengeId, response } }));
        }

        if (onSuccess) onSuccess(response);
        return response;
      } catch (err: any) {
        const normErr = normalizeChallengeError(err);
        setError(normErr);
        setSubmissionOutcome('ERROR');
        if (onError) onError(normErr);
        return null;
      } finally {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [challengeId, refresh, onSuccess, onError]
  );

  /**
   * Retries the last logical query submission using the same idempotency key
   */
  const retryLastSubmission = useCallback(async (): Promise<SubmitChallengeAttemptResponse | null> => {
    if (!lastLogicalQueryRef.current || !challengeId) {
      return null;
    }

    const { sql, hintsUsed, key } = lastLogicalQueryRef.current;

    if (isSubmittingRef.current) {
      return null;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await SqlChallengeClientService.submitChallengeAttempt({
        challengeId,
        sql,
        hintsUsed,
        idempotencyKey: key, // Preserve identical key for retry
      });

      setSubmissionResult(response);
      setSubmissionOutcome(response.passed ? 'PASS' : 'FAIL');
      refresh();
      if (onSuccess) onSuccess(response);
      return response;
    } catch (err: any) {
      const normErr = normalizeChallengeError(err);
      setError(normErr);
      setSubmissionOutcome('ERROR');
      if (onError) onError(normErr);
      return null;
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [challengeId, refresh, onSuccess, onError]);

  return {
    challenge,
    progress,
    unlockDecision,
    attempts,
    isLoading,
    isSubmitting,
    submissionOutcome,
    submissionResult,
    error,
    submitQuery,
    retryLastSubmission,
    refresh,
  };
}
