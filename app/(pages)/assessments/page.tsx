'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  PUBLIC_ASSESSMENT_CATALOG,
  SanitizedAssessmentSummary,
  StartAssessmentResponse,
  SubmitAssessmentResponse,
  startAssessmentSession,
  submitAssessmentSession,
} from '@/lib/services/assessmentService';

export default function AssessmentsPage() {
  const { currentUser: user, loading: authLoading } = useAuth();

  // Active Session State
  const [activeExamSummary, setActiveExamSummary] = useState<SanitizedAssessmentSummary | null>(null);
  const [activeSession, setActiveSession] = useState<StartAssessmentResponse | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Quiz Progress State
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmitAssessmentResponse | null>(null);

  // Server-Authoritative Time Sync Hook
  useEffect(() => {
    if (!activeSession || submissionResult) return;

    const expiresTime = new Date(activeSession.expiresAt).getTime();

    const updateTimer = () => {
      const remainingMs = expiresTime - Date.now();
      const secondsLeft = Math.max(0, Math.floor(remainingMs / 1000));
      setTimeLeft(secondsLeft);

      if (secondsLeft <= 0 && !isSubmitting && !submissionResult) {
        handleAutoSubmit();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeSession, submissionResult, isSubmitting]);

  // Start Assessment via Server Cloud Function
  const handleStartExam = async (catalogItem: SanitizedAssessmentSummary) => {
    setInitError(null);
    setSubmitError(null);

    if (!user) {
      setInitError('Authentication required. Please sign in to initialize verified assessment attempts.');
      return;
    }

    setIsInitializing(true);
    setActiveExamSummary(catalogItem);

    try {
      const session = await startAssessmentSession(catalogItem.id);
      setActiveSession(session);
      setQuestionIdx(0);
      setSelectedOpt(null);
      setAnswers({});
      setSubmissionResult(null);

      const expiresTime = new Date(session.expiresAt).getTime();
      setTimeLeft(Math.max(0, Math.floor((expiresTime - Date.now()) / 1000)));
    } catch (err: any) {
      console.error('Failed to start assessment:', err);
      setInitError(err?.message || 'Failed to initialize examination session. Please try again.');
      setActiveExamSummary(null);
    } finally {
      setIsInitializing(false);
    }
  };

  // Record Answer & Progress Question
  const handleNextQuestion = () => {
    if (selectedOpt === null || !activeSession) return;

    const currentQ = activeSession.questions[questionIdx];
    const updatedAnswers = {
      ...answers,
      [currentQ.id]: selectedOpt,
    };
    setAnswers(updatedAnswers);
    setSelectedOpt(null);

    if (questionIdx + 1 < activeSession.questions.length) {
      setQuestionIdx(questionIdx + 1);
      // Pre-select if previously answered
      const nextQ = activeSession.questions[questionIdx + 1];
      setSelectedOpt(updatedAnswers[nextQ.id] ?? null);
    } else {
      executeSubmission(updatedAnswers);
    }
  };

  // Submit Assessment to Server Grading Engine
  const executeSubmission = async (finalAnswers: Record<string, number>) => {
    if (!activeSession || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitAssessmentSession(activeSession.attemptId, finalAnswers);
      setSubmissionResult(result);
    } catch (err: any) {
      console.error('Failed to grade assessment:', err);
      setSubmitError(
        err?.message || 'Failed to process official submission. Please check your network and retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-submit on timer expiration
  const handleAutoSubmit = useCallback(() => {
    if (activeSession && !submissionResult && !isSubmitting) {
      executeSubmission(answers);
    }
  }, [activeSession, submissionResult, isSubmitting, answers]);

  // Reset / Return to Catalog
  const handleExitExam = () => {
    setActiveExamSummary(null);
    setActiveSession(null);
    setSubmissionResult(null);
    setInitError(null);
    setSubmitError(null);
    setAnswers({});
    setSelectedOpt(null);
    setQuestionIdx(0);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Assessments Portal</span>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
          TESTING & CERTIFICATION CENTER
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Verify your competence parameters. Achieve 80% or higher to unlock server-verified professional credentials.
        </p>

        {initError && (
          <div className="mt-4 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center justify-between">
            <span>⚠️ {initError}</span>
            {!user && (
              <Link href="/login" className="px-3 py-1 bg-rose-500 text-white rounded font-bold uppercase tracking-wider text-[10px]">
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!activeSession ? (
          /* Catalog View */
          <motion.div
            key="catalog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {PUBLIC_ASSESSMENT_CATALOG.map((exam) => (
              <div key={exam.id} className="glass-panel p-6 flex flex-col justify-between h-56">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-0.5 text-[9px] font-mono bg-white/5 rounded border border-white/5 text-[#00E5FF]">
                      {exam.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{exam.difficulty}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-display uppercase tracking-wide leading-snug">
                    {exam.title}
                  </h3>

                  <div className="flex items-center gap-4 mt-4 text-[11px] text-slate-400 font-mono">
                    <span>⏱ {exam.durationMinutes} Minutes</span>
                    <span>•</span>
                    <span>📋 {exam.questionsCount} Questions</span>
                    <span>•</span>
                    <span>🎯 Passing: {exam.passingScore}%</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleStartExam(exam)}
                    disabled={isInitializing}
                    className="w-full py-2.5 cyber-button text-xs font-bold tracking-widest uppercase disabled:opacity-50"
                  >
                    {isInitializing && activeExamSummary?.id === exam.id
                      ? 'INITIALIZING SESSION...'
                      : 'INITIALIZE EXAMINATION'}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          /* Active Exam Session View */
          <motion.div
            key="active-session"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-8 bg-[#090D14] border border-[#00E5FF]/20 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E5FF] to-transparent" />

            {/* Session Header */}
            {!submissionResult ? (
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">
                    Session: {activeSession.attemptId.substring(0, 16)}...
                  </span>
                  <h3 className="text-sm font-bold text-white font-display">{activeSession.title}</h3>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs">
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block uppercase">Progress</span>
                    <span className="text-white">
                      Q {questionIdx + 1} of {activeSession.questions.length}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block uppercase">Time Left</span>
                    <span
                      className={`font-bold text-sm ${
                        timeLeft <= 60 ? 'text-rose-400 animate-pulse' : 'text-[#00E5FF]'
                      }`}
                    >
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Questions Interface */}
            {!submissionResult ? (
              <div className="space-y-6">
                {submitError && (
                  <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                    ⚠️ {submitError}
                  </div>
                )}

                {activeSession.questions[questionIdx] && (
                  <>
                    <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                      <span>QUESTION {questionIdx + 1}</span>
                      <span>{activeSession.questions[questionIdx].points} POINTS</span>
                    </div>

                    <h2 className="text-lg font-bold text-white leading-relaxed font-sans">
                      {activeSession.questions[questionIdx].text}
                    </h2>

                    {/* Options List */}
                    <div className="space-y-3">
                      {activeSession.questions[questionIdx].options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          onClick={() => setSelectedOpt(oIdx)}
                          className={`p-4 rounded-lg border transition-all cursor-pointer text-xs font-mono flex items-center justify-between ${
                            selectedOpt === oIdx
                              ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white font-bold'
                              : 'border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedOpt === oIdx && (
                            <span className="text-[10px] text-[#00E5FF]">SELECTED</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                      <button
                        onClick={handleExitExam}
                        className="text-xs text-slate-500 hover:text-slate-300 font-mono uppercase"
                      >
                        Cancel Session
                      </button>

                      <button
                        onClick={handleNextQuestion}
                        disabled={selectedOpt === null || isSubmitting}
                        className="px-8 py-3 bg-[#00E5FF] hover:bg-[#00B8CC] disabled:opacity-50 text-black font-display font-bold text-xs tracking-widest uppercase rounded flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          'SUBMITTING...'
                        ) : questionIdx + 1 === activeSession.questions.length ? (
                          'SUBMIT TEST'
                        ) : (
                          'NEXT QUESTION'
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Server Results Display */
              <div className="text-center space-y-6 max-w-md mx-auto py-10">
                <div
                  className="w-24 h-24 rounded-full border-2 mx-auto flex-center text-3xl font-mono font-bold border-glow bg-slate-900"
                  style={{
                    borderColor: submissionResult.passed ? '#00E676' : '#FF5252',
                    color: submissionResult.passed ? '#00E676' : '#FF5252',
                  }}
                >
                  {submissionResult.percentage}%
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">
                    Submission ID: {submissionResult.submissionId}
                  </span>
                  <h2 className="text-2xl font-black text-white font-display uppercase tracking-wider mt-1">
                    {submissionResult.passed ? 'EXAM PASSED!' : 'EXAM FAILED'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                    {submissionResult.passed
                      ? `Congratulations! You scored ${submissionResult.score} / ${submissionResult.totalPoints} points (${submissionResult.percentage}%), achieving the required threshold of ${submissionResult.passingScore}%.`
                      : `You scored ${submissionResult.score} / ${submissionResult.totalPoints} points (${submissionResult.percentage}%), which did not meet the ${submissionResult.passingScore}% requirement. Review curriculum modules and retake the exam.`}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {submissionResult.passed && (
                    <Link
                      href={`/certifications?submissionId=${submissionResult.submissionId}`}
                      className="w-full py-3 cyber-button text-xs font-bold tracking-widest uppercase text-center block"
                    >
                      CLAIM VERIFIED CERTIFICATE
                    </Link>
                  )}
                  <button
                    onClick={handleExitExam}
                    className="w-full py-3 border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold tracking-widest uppercase text-slate-400 rounded transition-colors"
                  >
                    RETURN TO ASSESSMENTS
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
