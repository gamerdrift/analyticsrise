'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Shield, Check, Trophy } from 'lucide-react';
import { StreakService, StreakState } from '@/lib/services/streakService';

export default function StreakWidget() {
  const [streak, setStreak] = useState<StreakState | null>(null);

  useEffect(() => {
    setStreak(StreakService.getStreak());
  }, []);

  if (!streak) return null;

  const handleUseShield = () => {
    const updated = StreakService.redeemStreakFreeze();
    setStreak(updated);
  };

  return (
    <div className="w-full rounded-3xl bg-[#0D1117] border border-amber-500/30 p-6 relative overflow-hidden shadow-xl shadow-amber-500/5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6 fill-amber-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-base font-display font-black text-white">
              {streak.currentDailyStreak} Day Streak! 🔥
            </h4>
            <p className="text-xs text-slate-400">Longest Streak: {streak.longestDailyStreak} Days</p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-2 text-xs font-mono">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-bold">{streak.streakFreezeCount} Shields</span>
        </div>
      </div>

      {/* Week Day Indicator Pills */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
          const isActive = idx < streak.currentDailyStreak % 7;
          return (
            <div
              key={idx}
              className={`p-2 rounded-xl text-center text-xs font-bold font-mono transition-all ${
                isActive
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-slate-500 border border-white/5'
              }`}
            >
              <div>{day}</div>
              {isActive && <Check className="w-3 h-3 stroke-[3] mx-auto mt-0.5" />}
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
        <span>Streak Freeze Active</span>
        <button
          onClick={handleUseShield}
          className="text-[#00E5FF] hover:underline font-bold cursor-pointer"
        >
          + Add Shield
        </button>
      </div>
    </div>
  );
}
