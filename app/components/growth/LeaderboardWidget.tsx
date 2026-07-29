'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, Zap, Award } from 'lucide-react';
import { LeaderboardService, LeaderboardEntry } from '@/lib/services/leaderboardService';

export default function LeaderboardWidget() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(LeaderboardService.getWeeklyLeaderboard());
  }, []);

  return (
    <div className="w-full rounded-3xl bg-[#0D1117] border border-white/10 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-widest mb-2">
            <Trophy className="w-3.5 h-3.5" /> GLOBAL WEEKLY RANKINGS
          </div>
          <h3 className="text-xl font-display font-black text-white">Top Analytics Earners</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase">Resets Sunday 00:00 UTC</span>
      </div>

      <div className="space-y-3">
        {entries.map((item) => (
          <div
            key={item.uid}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
              item.isCurrentUser
                ? 'bg-gradient-to-r from-[#00E5FF]/10 to-purple-950/20 border-[#00E5FF]/50 shadow-md shadow-[#00E5FF]/5'
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black font-mono ${
                  item.rank === 1
                    ? 'bg-amber-400 text-black'
                    : item.rank === 2
                    ? 'bg-slate-300 text-black'
                    : item.rank === 3
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                #{item.rank}
              </span>
              <img
                src={item.avatarUrl}
                alt={item.name}
                className="w-9 h-9 rounded-xl object-cover border border-white/10"
              />
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  {item.name}
                  {item.isCurrentUser && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-[#00E5FF] text-black">
                      YOU
                    </span>
                  )}
                </h4>
                <span className="text-[10px] text-slate-400">{item.badgeTitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-400" /> {item.streakDays}d
              </span>
              <span className="flex items-center gap-1 text-[#00E5FF] font-black">
                <Zap className="w-3.5 h-3.5 fill-[#00E5FF]" /> {item.xpTotal} XP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
