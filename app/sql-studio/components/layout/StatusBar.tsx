"use client";

import React, { useEffect, useState } from 'react';
import { useSqlStudio } from '@/app/sql-studio/contexts/SqlStudioContext';
import { getPublicChallenge } from '@/lib/sql/challenges/public/registry';
import { getDataset } from '@/lib/sql/datasets/registry';
import { SqlChallengeClientService } from '@/lib/services/sqlChallengeClientService';
import { useAuth } from '@/lib/hooks/useAuth';
import { Clock, Database, CheckCircle, Sparkles, Terminal, Keyboard } from 'lucide-react';

export default function StatusBar() {
  const { state } = useSqlStudio();
  const { isAuthenticated } = useAuth();
  const [totalXp, setTotalXp] = useState<number | null>(null);

  const challenge = getPublicChallenge(state.activeChallengeId);
  const dataset = getDataset(state.activeDatasetId);
  const execTime = state.status.execTimeMs;
  const returnedRows = state.status.returnedRows;

  const fetchSummary = () => {
    SqlChallengeClientService.getUserChallengeSummary()
      .then((summary) => {
        if (summary) {
          setTotalXp(summary.totalXpEarned);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSummary();

    const handleProgressUpdate = () => {
      fetchSummary();
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

  return (
    <footer className="h-8 bg-[#06080E] border-t border-white/10 text-slate-400 font-mono text-[11px] flex items-center justify-between px-3 shrink-0 select-none">
      {/* Left Telemetry: Challenge & Dataset */}
      <div className="flex items-center gap-4 truncate">
        {challenge && (
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <Terminal className="w-3 h-3 text-[#00E5FF] shrink-0" />
            <span className="truncate">{challenge.title}</span>
          </div>
        )}

        {dataset && (
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <Database className="w-3 h-3 text-slate-500 shrink-0" />
            <span>{dataset.name}</span>
          </div>
        )}
      </div>

      {/* Center Shortcuts info */}
      <div className="hidden md:flex items-center gap-3 text-slate-500 text-[10px]">
        <span className="flex items-center gap-1">
          <Keyboard className="w-3 h-3 text-slate-600" />
          <kbd className="bg-white/10 px-1 py-0.5 rounded text-slate-300">Ctrl+Enter</kbd> Run
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-white/10 px-1 py-0.5 rounded text-slate-300">Ctrl+Shift+Enter</kbd> Submit
        </span>
      </div>

      {/* Right Telemetry: Execution stats & XP */}
      <div className="flex items-center gap-3 shrink-0">
        {execTime !== undefined && (
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-[#00E5FF]" />
            <span>{execTime.toFixed(1)} ms</span>
          </div>
        )}

        {returnedRows !== undefined && (
          <div className="flex items-center gap-1 text-slate-400">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>{returnedRows} rows</span>
          </div>
        )}

        {totalXp !== null && (
          <div className="flex items-center gap-1 text-purple-400 font-bold bg-purple-950/30 px-2 py-0.5 rounded border border-purple-500/30">
            <Sparkles className="w-3 h-3" />
            <span>{totalXp} XP</span>
          </div>
        )}
      </div>
    </footer>
  );
}
