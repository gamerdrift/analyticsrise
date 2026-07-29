'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Flame, Zap, ArrowRight, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import { StreakState } from '@/lib/services/streakService';

interface TodaysMissionWidgetProps {
  streak: StreakState;
  userXp?: number;
  dailyGoalProgress?: number; // 0 - 100
}

export default function TodaysMissionWidget({
  streak,
  userXp = 1450,
  dailyGoalProgress = 65,
}: TodaysMissionWidgetProps) {
  return (
    <div className="w-full rounded-3xl bg-gradient-to-r from-[#0D1117] via-[#161B22] to-[#0D1117] border border-[#00E5FF]/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl shadow-[#00E5FF]/5">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-black uppercase tracking-widest mb-3">
            <Target className="w-3.5 h-3.5" /> TODAY&apos;S MISSION
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Welcome Back, <span className="text-[#00E5FF]">Alex</span>! 👋
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete today&apos;s daily mission to maintain your streak and earn double XP bonuses.
          </p>
        </div>

        {/* Gamification Stats Row */}
        <div className="flex items-center gap-3">
          {/* Flame Streak Badge */}
          <div className="px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">STREAK</span>
              <strong className="text-sm font-black text-amber-300 font-mono">
                {streak.currentDailyStreak} Days
              </strong>
            </div>
          </div>

          {/* XP Progress Badge */}
          <div className="px-4 py-2.5 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-[#00E5FF] fill-[#00E5FF]" />
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">TOTAL XP</span>
              <strong className="text-sm font-black text-[#00E5FF] font-mono">
                {userXp.toLocaleString()} XP
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Quick Mission Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 relative z-10">
        {/* Daily Goal Meter */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" /> Daily Target
              </span>
              <span className="font-mono text-[#00E5FF] font-bold">{dailyGoalProgress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] transition-all"
                style={{ width: `${dailyGoalProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              1 challenge or 1 simulator session remaining to hit today&apos;s goal.
            </p>
          </div>
        </div>

        {/* Recommended Simulator */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-cyan-400 block mb-1">
              RECOMMENDED PRACTICE
            </span>
            <h4 className="text-sm font-bold text-white mb-1">SQL Window Functions Lab</h4>
            <p className="text-[11px] text-slate-400">
              Master LEAD, LAG, and OVER clauses with real PostgreSQL data.
            </p>
          </div>
          <Link
            href="/simulators/sql"
            className="mt-3 inline-flex items-center gap-1 text-xs text-[#00E5FF] font-bold hover:underline"
          >
            Launch SQL Lab <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Resume & Job Match Alert */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-purple-400 block mb-1">
              CAREER READINESS
            </span>
            <h4 className="text-sm font-bold text-white mb-1">ATS Resume Score: 85%</h4>
            <p className="text-[11px] text-slate-400">
              3 new Data Analyst openings match your verified portfolio skills.
            </p>
          </div>
          <Link
            href="/get-hired"
            className="mt-3 inline-flex items-center gap-1 text-xs text-purple-300 font-bold hover:underline"
          >
            View Matched Jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
