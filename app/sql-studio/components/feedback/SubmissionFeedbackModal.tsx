"use client";

import React from 'react';
import { SubmitChallengeAttemptResponse } from '@/lib/sql/challenges/types';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, ArrowRight, RotateCcw, X } from 'lucide-react';

interface SubmissionFeedbackModalProps {
  isOpen: boolean;
  result: SubmitChallengeAttemptResponse | null;
  onClose: () => void;
  onNextChallenge?: () => void;
  onRetry?: () => void;
}

export default function SubmissionFeedbackModal({
  isOpen,
  result,
  onClose,
  onNextChallenge,
  onRetry,
}: SubmissionFeedbackModalProps) {
  if (!isOpen || !result) return null;

  const isPassed = result.passed;
  const isPartial = !isPassed && result.score > 0;
  const isInvalid = result.status === 'INVALID';
  const isError = result.status === 'ERROR';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0C101A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Header Banner */}
        <div
          className={`p-6 text-center border-b ${
            isPassed
              ? 'bg-emerald-950/40 border-emerald-500/30'
              : isPartial
              ? 'bg-amber-950/40 border-amber-500/30'
              : 'bg-rose-950/40 border-rose-500/30'
          }`}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 bg-black/40 border">
            {isPassed ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            ) : isPartial ? (
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-400" />
            )}
          </div>

          <h3 className="text-xl font-bold font-display text-white uppercase tracking-wide">
            {isPassed
              ? 'Challenge Completed!'
              : isPartial
              ? 'Partial Solution'
              : isInvalid
              ? 'Syntax / Query Invalid'
              : isError
              ? 'Execution Error'
              : 'Submission Incomplete'}
          </h3>

          <p className="text-xs font-mono text-slate-300 mt-1">
            {isPassed
              ? 'All requirements and test cases validated successfully.'
              : 'Your query executed, but the result did not meet all challenge criteria.'}
          </p>
        </div>

        {/* Score & Telemetry Cards */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Score */}
            <div className="bg-[#07090E] border border-white/5 p-3 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Score</span>
              <span
                className={`text-2xl font-black font-mono ${
                  isPassed ? 'text-emerald-400' : isPartial ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                {result.score} / 100
              </span>
            </div>

            {/* XP Awarded */}
            <div className="bg-[#07090E] border border-white/5 p-3 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">XP Earned</span>
              <span className="text-2xl font-black font-mono text-[#00E5FF] flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#00E5FF]" /> +{result.xpAwarded} XP
              </span>
            </div>
          </div>

          {/* Validation Feedback */}
          {result.feedback && (
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs font-sans text-slate-300 leading-relaxed">
              <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block mb-1">
                Feedback
              </span>
              {result.feedback}
            </div>
          )}

          {/* Validation Checklist Items if present */}
          {result.validationSummary && (
            <div className="space-y-1.5 font-mono text-xs">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Validation Checks</span>
              <div className="flex items-center justify-between p-2 bg-[#07090E] rounded border border-white/5 text-slate-300">
                <span>Result Schema Match</span>
                <span className={result.validationSummary.schemaMatched ? 'text-emerald-400' : 'text-rose-400'}>
                  {result.validationSummary.schemaMatched ? 'PASSED' : 'MISMATCH'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#07090E] rounded border border-white/5 text-slate-300">
                <span>Data Equivalence</span>
                <span className={result.validationSummary.dataMatched ? 'text-emerald-400' : 'text-rose-400'}>
                  {result.validationSummary.dataMatched ? 'IDENTICAL' : 'DIFFERENT'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#07090E] rounded border border-white/5 text-slate-300">
                <span>Rule Verification</span>
                <span className={result.validationSummary.rulesMatched ? 'text-emerald-400' : 'text-rose-400'}>
                  {result.validationSummary.rulesMatched ? 'SATISFIED' : 'UNSATISFIED'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="p-4 bg-[#080B12] border-t border-white/10 flex items-center justify-end gap-3">
          {!isPassed && onRetry && (
            <button
              onClick={() => {
                onClose();
                onRetry();
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Modify & Retry
            </button>
          )}

          {isPassed && onNextChallenge && (
            <button
              onClick={() => {
                onClose();
                onNextChallenge();
              }}
              className="px-6 py-2 bg-[#00E5FF] hover:bg-[#00B8CC] text-black font-mono text-xs font-black rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#00E5FF]/20"
            >
              Next Challenge <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
