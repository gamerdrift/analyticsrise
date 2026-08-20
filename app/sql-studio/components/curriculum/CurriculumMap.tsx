"use client";

import React, { useEffect, useState } from 'react';
import { useSqlStudio } from '@/app/sql-studio/contexts/SqlStudioContext';
import { SQL_TRACKS, SQL_MODULES } from '@/lib/sql/challenges/modules';
import { listPublicChallenges } from '@/lib/sql/challenges/public/registry';
import { SqlChallengeClientService } from '@/lib/services/sqlChallengeClientService';
import { UserProgressionMap } from '@/lib/sql/challenges/types';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Award,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface CurriculumMapProps {
  onSelectChallenge?: (challengeId: string) => void;
}

export default function CurriculumMap({ onSelectChallenge }: CurriculumMapProps) {
  const { state, dispatch } = useSqlStudio();
  const { isAuthenticated } = useAuth();
  const [progressionMap, setProgressionMap] = useState<UserProgressionMap | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>(['sql-select']);

  const allChallenges = listPublicChallenges();

  // Load progression map for learner (both authenticated and guest)
  const fetchMap = () => {
    SqlChallengeClientService.getUserProgressionMap()
      .then((map) => {
        if (map) {
          setProgressionMap(map);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchMap();

    const handleProgressUpdate = () => {
      fetchMap();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('ar-sql-progress-updated', handleProgressUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('ar-sql-progress-updated', handleProgressUpdate);
      }
    };
  }, [isAuthenticated, state.activeChallengeId]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleChallengeClick = (challengeId: string, isUnlocked: boolean) => {
    if (!isUnlocked) return;

    if (onSelectChallenge) {
      onSelectChallenge(challengeId);
    } else {
      dispatch({ type: 'SET_ACTIVE_CHALLENGE', payload: challengeId });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Summary */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#00E5FF]" />
          Curriculum Map
        </h3>
        {progressionMap && (
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {progressionMap.totalXpEarned} XP Earned
          </span>
        )}
      </div>

      {/* Tracks & Modules Tree */}
      <div className="space-y-3">
        {SQL_TRACKS.map((track) => {
          const trackModules = SQL_MODULES.filter((m) => m.trackId === track.id);

          return (
            <div key={track.id} className="space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
                {track.title}
              </div>

              {trackModules.map((module) => {
                const isExpanded = expandedModules.includes(module.id);
                const moduleChallenges = allChallenges.filter((c) => c.moduleId === module.id);

                return (
                  <div
                    key={module.id}
                    className="border border-white/5 bg-[#090D16] rounded-xl overflow-hidden"
                  >
                    {/* Module Header */}
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-[#00E5FF]" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <span className="font-bold text-slate-200">{module.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {moduleChallenges.length} challenges
                      </span>
                    </button>

                    {/* Challenges List */}
                    {isExpanded && (
                      <div className="p-2 pt-0 space-y-1">
                        {moduleChallenges.map((chal, index) => {
                          const isCurrent = state.activeChallengeId === chal.id;
                          const progressItem = progressionMap?.challenges.find((c) => c.id === chal.id);

                          // If authenticated with progression map, use authoritative unlock state.
                          // Otherwise, default first challenge to unlocked.
                          const isUnlocked = progressItem
                            ? progressItem.isUnlocked
                            : index === 0 || chal.id === 'sql.select.001';

                          const progressStatus = progressItem?.progressStatus;

                          return (
                            <button
                              key={chal.id}
                              type="button"
                              disabled={!isUnlocked}
                              onClick={() => handleChallengeClick(chal.id, isUnlocked)}
                              className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs font-mono transition-all ${
                                isCurrent
                                  ? 'bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-white shadow-sm'
                                  : isUnlocked
                                  ? 'hover:bg-white/5 text-slate-300'
                                  : 'opacity-40 cursor-not-allowed text-slate-600'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                {progressStatus === 'MASTERED' ? (
                                  <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                ) : progressStatus === 'COMPLETED' ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : isUnlocked ? (
                                  <Unlock className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                )}
                                <span className="truncate">{chal.title}</span>
                              </div>

                              <span className="text-[10px] text-slate-500 font-bold shrink-0">
                                {chal.xpReward} XP
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
