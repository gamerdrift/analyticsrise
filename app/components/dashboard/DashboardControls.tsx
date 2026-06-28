'use client';

import React from 'react';
import { clsx } from 'clsx';
import { ShieldCheck, Flame, Trophy, TrendingUp } from 'lucide-react';

// --- METRIC CARD ---
interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
}

export function MetricCard({ label, value, subtext, icon, trend }: MetricCardProps) {
  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-[#0D1117]/80 hover:border-[#00E5FF]/20 transition-all flex justify-between relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent" />
      
      <div className="space-y-4">
        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block">{label}</span>
        <div>
          <span className="text-2xl font-black text-white font-display leading-none">{value}</span>
          {subtext && <p className="text-[10px] text-slate-500 mt-1 font-mono leading-none">{subtext}</p>}
        </div>
      </div>

      <div className="flex flex-col justify-between items-end">
        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[#00E5FF]">
          {icon || <TrendingUp className="w-4 h-4" />}
        </div>
        {trend && (
          <span className={clsx('text-[10px] font-mono font-bold flex items-center gap-0.5', trend.positive ? 'text-emerald-400' : 'text-rose-500')}>
            {trend.positive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

// --- CIRCULAR PROGRESS RADIAL WIDGET ---
interface ProgressWidgetProps {
  value: number; // 0 to 100
  label: string;
  size?: number; // width/height in px
  strokeWidth?: number;
}

export function ProgressWidget({ value, label, size = 120, strokeWidth = 10 }: ProgressWidgetProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-[#0D1117]/60 flex flex-col items-center justify-center text-center">
      <div className="relative mb-4" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Base track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth={strokeWidth}
          />
          {/* Active progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#00E5FF"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
          <span className="text-xl font-black text-white font-display">{value}%</span>
          <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-0.5">Progress</span>
        </div>
      </div>
      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">{label}</span>
    </div>
  );
}

// --- TELEMETRY LOG ACTIVITY FEED ---
interface ActivityItem {
  timestamp: string;
  type: 'success' | 'info' | 'xp';
  message: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  const itemColors = {
    success: 'text-emerald-400',
    info: 'text-[#00E5FF]',
    xp: 'text-[#4FC3F7]',
  };

  return (
    <div className="p-5 rounded-xl border border-[#00E5FF]/10 bg-[#07090D]/90 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-[#00E5FF]" />
      
      <div className="space-y-4">
        <h4 className="text-xs font-bold font-display uppercase tracking-widest text-white mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          SYSTEM ACTIVITY FEED
        </h4>

        <div className="space-y-3 font-mono text-[10px] text-slate-300">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2.5 leading-relaxed">
              <span className="text-slate-600">[{item.timestamp}]</span>
              <span className={itemColors[item.type]}>{item.type.toUpperCase()}</span>
              <span className="text-slate-400">{item.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- MISSION PROGRESS TRACKER ---
interface MissionProgressProps {
  currentLevel: number;
  currentXp: number;
  targetXp: number;
  streakDays: number;
}

export function MissionProgress({
  currentLevel,
  currentXp,
  targetXp,
  streakDays,
}: MissionProgressProps) {
  const percent = Math.min((currentXp / targetXp) * 100, 100);

  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-[#0D1117]/80 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden">
      {/* Telemetry outline highlight */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent" />

      {/* Level stats */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded bg-gradient-to-br from-[#00E5FF] to-[#4FC3F7] flex items-center justify-center font-bold font-display text-black text-xl tracking-tighter">
          {currentLevel}
        </div>
        <div>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Operational Rank</span>
          <span className="text-xs font-bold text-white uppercase tracking-wider font-display">Level {currentLevel} Analyst</span>
        </div>
      </div>

      {/* XP Bar */}
      <div className="flex-1 w-full space-y-2">
        <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase tracking-widest">
          <span>XP level progression</span>
          <span className="text-[#00E5FF]">{currentXp.toLocaleString()} / {targetXp.toLocaleString()} XP</span>
        </div>
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
          <div className="bg-[#00E5FF] h-full transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* Streak indicators */}
      <div className="flex items-center gap-2 border-l border-slate-800 pl-6 shrink-0 font-mono text-xs">
        <div className="text-right">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Telemetry Streak</span>
          <span className="text-[#4FC3F7] font-bold block">{streakDays} Consecutive Days</span>
        </div>
        <Flame className="w-8 h-8 text-[#4FC3F7]" />
      </div>
    </div>
  );
}

// --- LEADERBOARD CARD ---
interface LeaderboardUser {
  rank: number;
  name: string;
  score: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
}

export function LeaderboardCard({ users }: LeaderboardProps) {
  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-[#0D1117]/60 backdrop-blur-md">
      <h4 className="text-xs font-bold font-display uppercase tracking-widest text-white mb-4 flex items-center gap-1.5">
        <Trophy className="w-4 h-4 text-[#00E5FF]" />
        Cohort Leaderboard
      </h4>

      <div className="space-y-2 font-mono text-[10px]">
        {users.map((u) => (
          <div
            key={u.rank}
            className={clsx(
              'flex items-center justify-between p-2.5 rounded border transition-all',
              u.isCurrentUser
                ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-white'
                : 'bg-slate-900/30 border-transparent text-slate-400 hover:text-white hover:border-slate-850'
            )}
          >
            <div className="flex items-center gap-3">
              <span className={clsx('font-black w-4 text-center', u.rank === 1 ? 'text-[#FFD600]' : 'text-slate-500')}>
                {u.rank}
              </span>
              <span className="uppercase tracking-wider">{u.name}</span>
            </div>
            <span className="font-bold text-[#00E5FF]">{u.score.toLocaleString()} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- HOLOGRAPHIC CERTIFICATION BADGE ---
interface CertBadgeProps {
  code: string;
  label: string;
}

export function CertificationBadge({ code, label }: CertBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#00E5FF]/30 bg-[#07090D] shadow-md shadow-[#00E5FF]/5 font-mono text-[9px] uppercase font-bold text-slate-300">
      <ShieldCheck className="w-4 h-4 text-[#00E5FF] shrink-0" />
      <div>
        <span className="text-[#00E5FF] block font-black leading-none">{code}</span>
        <span className="text-[8px] text-slate-500 block mt-0.5 leading-none">{label}</span>
      </div>
    </div>
  );
}
