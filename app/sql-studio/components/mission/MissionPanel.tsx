"use client";

import React, { useState } from 'react';
import { useSqlStudio } from '@/app/sql-studio/contexts/SqlStudioContext';
import { getPublicChallenge, getNextChallenge, getPreviousChallenge } from '@/lib/sql/challenges/public/registry';
import { SqlChallengeClientService } from '@/lib/services/sqlChallengeClientService';
import HintAccordion from './HintAccordion';
import {
  Target,
  Sparkles,
  RotateCcw,
  Tag,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export default function MissionPanel() {
  const { state, dispatch } = useSqlStudio();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const challenge = getPublicChallenge(state.activeChallengeId);

  if (!challenge) {
    return (
      <div className="p-4 text-slate-500 font-mono text-xs">
        No active challenge selected.
      </div>
    );
  }

  const prevChal = getPreviousChallenge(challenge.id);
  const nextChal = getNextChallenge(challenge.id);

  // Check if editor query is dirty (modified from default starter query)
  const isDirty = state.editor.query.trim() !== challenge.starterQuery.trim();

  const handleResetToStarter = () => {
    if (isDirty) {
      setShowConfirmReset(true);
    } else {
      dispatch({ type: 'SET_QUERY', payload: challenge.starterQuery });
    }
  };

  const confirmReset = () => {
    dispatch({ type: 'SET_QUERY', payload: challenge.starterQuery });
    setShowConfirmReset(false);
  };

  const handleNavigate = async (targetChallengeId: string) => {
    try {
      const unlockStatus = await SqlChallengeClientService.getChallengeUnlockStatus(targetChallengeId);
      if (unlockStatus && !unlockStatus.isUnlocked) {
        alert(unlockStatus.explanation || 'Complete prerequisite challenges to unlock this mission.');
        return;
      }
    } catch {}

    if (isDirty) {
      if (confirm('You have unsaved SQL changes. Do you want to discard them and load the selected challenge?')) {
        dispatch({ type: 'SET_ACTIVE_CHALLENGE', payload: targetChallengeId });
      }
    } else {
      dispatch({ type: 'SET_ACTIVE_CHALLENGE', payload: targetChallengeId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-mono font-bold uppercase">
              {challenge.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> +{challenge.xpReward} XP
            </span>
          </div>

          {/* Quick Prev / Next Navigator */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!prevChal}
              onClick={() => prevChal && handleNavigate(prevChal.id)}
              className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-400 hover:text-white transition-colors"
              title="Previous Challenge"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={!nextChal}
              onClick={() => nextChal && handleNavigate(nextChal.id)}
              className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-400 hover:text-white transition-colors"
              title="Next Challenge"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h2 className="text-base font-bold font-display text-white tracking-wide">
          {challenge.title}
        </h2>
      </div>

      {/* Scenario / Context */}
      <div className="p-3.5 bg-[#090D16] border border-white/5 rounded-xl space-y-2">
        <div className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-[#00E5FF]" /> Business Scenario
        </div>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {challenge.scenario}
        </p>
      </div>

      {/* Objective */}
      <div className="p-3.5 bg-[#090D16] border border-[#00E5FF]/20 rounded-xl space-y-2 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#00E5FF]" />
        <div className="text-[10px] font-mono font-bold uppercase text-[#00E5FF] tracking-wider flex items-center gap-1">
          <Target className="w-3 h-3 text-[#00E5FF]" /> Target Objective
        </div>
        <p className="text-xs text-slate-200 font-sans font-medium leading-relaxed">
          {challenge.objective}
        </p>
      </div>

      {/* Detailed Instructions */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          Instructions
        </h3>
        <p className="text-xs text-slate-400 font-sans leading-relaxed whitespace-pre-wrap">
          {challenge.instructions}
        </p>
      </div>

      {/* Starter Query Action */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleResetToStarter}
          className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Load Starter Query
        </button>
      </div>

      {/* Unsaved SQL Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200 font-sans">
              You have modified your query. Do you want to discard your work and reload the starter query?
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowConfirmReset(false)}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded font-mono"
            >
              Cancel
            </button>
            <button
              onClick={confirmReset}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-black text-xs rounded font-mono font-bold"
            >
              Discard & Load
            </button>
          </div>
        </div>
      )}

      {/* Progressive Hints */}
      <HintAccordion
        hints={challenge.hints}
        onHintRevealed={(count) => dispatch({ type: 'SET_HINTS_USED', payload: count })}
      />

      {/* Skill Tags */}
      {challenge.skillTags && challenge.skillTags.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1">
            <Tag className="w-3 h-3" /> Skill Tags
          </div>
          <div className="flex flex-wrap gap-1.5">
            {challenge.skillTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-white/5 border border-white/5 text-slate-400 rounded text-[10px] font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
