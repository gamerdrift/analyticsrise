'use client';

import React from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { Trophy, Target, Award, ShieldCheck } from 'lucide-react';

export default function ProgressFooter() {
  const { state } = useExcelStudio();
  const { missionProgress } = state;

  const completedMissions = Object.values(missionProgress).filter((m) => m.completed).length;
  const totalScore = Object.values(missionProgress).reduce((acc, m) => acc + (m.score || 0), 0);

  return (
    <div className="bg-[#0D1117] border-t border-[#00E5FF]/20 px-4 py-2 flex items-center justify-between font-mono text-xs text-white z-10">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Trophy className="w-4 h-4" /> Earned XP: +{totalScore}
        </span>
        <span className="text-slate-400 font-semibold hidden sm:inline">
          Missions Completed: <strong className="text-white">{completedMissions}/5</strong>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Certification Mode Active
        </span>
      </div>
    </div>
  );
}
