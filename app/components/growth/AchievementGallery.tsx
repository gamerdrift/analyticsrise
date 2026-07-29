'use client';

import React, { useState, useEffect } from 'react';
import { ACHIEVEMENTS, AchievementBadge } from '@/lib/config/achievements';
import { AchievementService, UserUnlockedAchievement } from '@/lib/services/achievementService';
import { Award, Lock, CheckCircle2, Sparkles } from 'lucide-react';

export default function AchievementGallery() {
  const [unlocked, setUnlocked] = useState<UserUnlockedAchievement[]>([]);
  const [stats, setStats] = useState({ unlockedCount: 0, totalCount: 0, percentage: 0, totalAchievementXp: 0 });

  useEffect(() => {
    setUnlocked(AchievementService.getUnlocked());
    setStats(AchievementService.getStats());
  }, []);

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black';
      case 'Epic':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      case 'Rare':
        return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
      case 'Common':
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  return (
    <div className="w-full rounded-3xl bg-[#0D1117] border border-white/10 p-6 sm:p-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-widest mb-2">
            <Award className="w-3.5 h-3.5" /> BADGES & TROPHIES
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-white">
            Achievement Showcase
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Unlock gamified achievements by completing courses, labs, and job applications.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] uppercase text-slate-500 block">UNLOCKED</span>
            <strong className="text-white">
              {stats.unlockedCount} / {stats.totalCount} ({stats.percentage}%)
            </strong>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] uppercase text-slate-500 block">BONUS XP</span>
            <strong className="text-[#00E5FF]">+{stats.totalAchievementXp} XP</strong>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {ACHIEVEMENTS.map((badge) => {
          const isUnlocked = unlocked.some((u) => u.achievementId === badge.id);

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative ${
                isUnlocked
                  ? 'bg-gradient-to-b from-[#00E5FF]/10 via-[#161B22] to-[#161B22] border-[#00E5FF]/40 shadow-lg shadow-[#00E5FF]/5'
                  : 'bg-slate-900/50 border-white/5 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase ${getRarityBadge(badge.rarity)}`}>
                    {badge.rarity}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{badge.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{badge.description}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                <span className="text-amber-400 font-bold">+{badge.xpValue} XP</span>
                <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
