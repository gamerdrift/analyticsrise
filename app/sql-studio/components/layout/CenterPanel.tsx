"use client";

import React, { useState } from 'react';
import SqlEditor from '@/app/sql-studio/components/editor/SqlEditor';
import ResultsTable from '@/app/sql-studio/components/results/ResultsTable';
import SubmissionFeedbackModal from '@/app/sql-studio/components/feedback/SubmissionFeedbackModal';
import { useSqlStudio } from '@/app/sql-studio/contexts/SqlStudioContext';
import { executeSql } from '@/lib/sql/engine';
import { getDataset } from '@/lib/sql/datasets/registry';
import { useSqlChallenge } from '@/lib/hooks/useSqlChallenge';
import { getNextChallenge } from '@/lib/sql/challenges/public/registry';
import { Play, Send, RotateCcw, AlignLeft, Sparkles } from 'lucide-react';

export default function CenterPanel() {
  const { state, dispatch } = useSqlStudio();
  const [feedbackResult, setFeedbackResult] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize server-authoritative challenge submission hook
  const { submitQuery, isSubmitting, challenge } = useSqlChallenge(state.activeChallengeId, {
    onSuccess: (res) => {
      setFeedbackResult(res);
      setIsModalOpen(true);
    },
    onError: (err) => {
      setFeedbackResult({
        passed: false,
        score: 0,
        xpAwarded: 0,
        status: 'ERROR',
        feedback: err.message,
      });
      setIsModalOpen(true);
    },
  });

  // Action 1: Local In-Browser Run Query (Stage 2A engine + Stage 2B dataset)
  const handleRunQuery = () => {
    const rawSql = state.editor.query.trim();
    if (!rawSql) return;

    dispatch({ type: 'SET_EXECUTING', payload: true });
    dispatch({ type: 'SET_EXECUTION_ERROR', payload: null });

    const startTime = performance.now();

    try {
      const dataset = getDataset(state.activeDatasetId) || getDataset('ecommerce');
      if (!dataset) {
        throw new Error(`Dataset "${state.activeDatasetId}" not found.`);
      }

      // Execute SQL via pure in-browser Stage 2A engine
      const queryResult = executeSql(rawSql, dataset.database);
      const duration = performance.now() - startTime;

      dispatch({
        type: 'SET_RESULTS',
        payload: {
          rows: queryResult.rows,
          columns: queryResult.columns,
          rowCount: queryResult.rowCount,
          executionMs: duration,
          validation: { passed: false, hints: [] },
        },
      });

      dispatch({
        type: 'SET_STATUS',
        payload: {
          execTimeMs: duration,
          returnedRows: queryResult.rowCount,
        },
      });
    } catch (err: any) {
      dispatch({
        type: 'SET_EXECUTION_ERROR',
        payload: err?.message || 'Syntax or evaluation error in SQL query.',
      });
    } finally {
      dispatch({ type: 'SET_EXECUTING', payload: false });
    }
  };

  // Action 2: Server-Authoritative Challenge Submission
  const handleSubmitChallenge = async () => {
    const rawSql = state.editor.query.trim();
    if (!rawSql || isSubmitting) return;

    // Run local query first so learner sees results in table
    handleRunQuery();

    // Submit to Cloud Functions validation pipeline
    await submitQuery(rawSql, state.hintsUsed);
  };

  const handleResetQuery = () => {
    const defaultQuery = challenge?.starterQuery || '';
    dispatch({ type: 'SET_QUERY', payload: defaultQuery });
    dispatch({
      type: 'SET_RESULTS',
      payload: { rows: [], columns: [], validation: { passed: false, hints: [] } },
    });
    dispatch({ type: 'SET_EXECUTION_ERROR', payload: null });
  };

  const handleFormatQuery = () => {
    // Basic whitespace normalization
    const cleaned = state.editor.query.replace(/\s+/g, ' ').trim();
    dispatch({ type: 'SET_QUERY', payload: cleaned });
  };

  const handleNextChallenge = () => {
    const nextChal = getNextChallenge(state.activeChallengeId);
    if (nextChal) {
      dispatch({ type: 'SET_ACTIVE_CHALLENGE', payload: nextChal.id });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#05070B] overflow-hidden p-3 md:p-4 gap-3">
      {/* Workbench Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 shrink-0 bg-[#0C101A] border border-white/10 p-2 rounded-xl">
        <div className="flex items-center gap-2">
          {/* Run Query Button */}
          <button
            type="button"
            onClick={handleRunQuery}
            disabled={state.isExecuting}
            className="px-4 py-2 bg-[#00E5FF] hover:bg-[#00B8CC] disabled:opacity-50 text-black font-mono text-xs font-black rounded-lg transition-all shadow-md shadow-[#00E5FF]/20 flex items-center gap-1.5"
            title="Execute query locally in browser (Ctrl+Enter)"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>RUN QUERY</span>
          </button>

          {/* Submit Challenge Button */}
          <button
            type="button"
            onClick={handleSubmitChallenge}
            disabled={isSubmitting || state.isExecuting}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-mono text-xs font-bold rounded-lg transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5"
            title="Submit solution for official evaluation (Ctrl+Shift+Enter)"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>EVALUATING...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>SUBMIT</span>
                <span className="text-[10px] bg-purple-900/60 px-1.5 py-0.5 rounded text-purple-200 ml-1">
                  +{challenge?.xpReward || 50} XP
                </span>
              </>
            )}
          </button>
        </div>

        {/* Secondary Utility Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleFormatQuery}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg text-xs font-mono transition-colors"
            title="Format query"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetQuery}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg text-xs font-mono transition-colors"
            title="Reset to starter query"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SQL Editor Viewport */}
      <div className="shrink-0">
        <SqlEditor
          onRunQuery={handleRunQuery}
          onSubmitChallenge={handleSubmitChallenge}
        />
      </div>

      {/* Query Results Viewport */}
      <div className="flex-1 overflow-hidden min-h-[220px]">
        <ResultsTable />
      </div>

      {/* Submission Feedback Modal */}
      <SubmissionFeedbackModal
        isOpen={isModalOpen}
        result={feedbackResult}
        onClose={() => setIsModalOpen(false)}
        onNextChallenge={handleNextChallenge}
        onRetry={() => setIsModalOpen(false)}
      />
    </div>
  );
}
