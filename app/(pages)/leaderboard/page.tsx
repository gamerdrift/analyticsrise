'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';

const LEADERBOARD_ROWS = [
  { rank: 1, name: 'Satoshi_Data', level: 12, courses: 8, xp: 48500, streak: 35, avatar: '🥇' },
  { rank: 2, name: 'SQL_Wizard', level: 10, courses: 6, xp: 39200, streak: 22, avatar: '🥈' },
  { rank: 3, name: 'PandaDataScientist', level: 9, courses: 5, xp: 35400, streak: 18, avatar: '🥉' },
  { rank: 4, name: 'ExcelLegend', level: 8, courses: 6, xp: 29800, streak: 14, avatar: '🤖' },
  { rank: 5, name: 'PivotQueen', level: 7, courses: 4, xp: 24500, streak: 28, avatar: '👾' },
  { rank: 6, name: 'QueryOptimizer', level: 6, courses: 3, xp: 19800, streak: 10, avatar: '👩‍💻' },
  { rank: 14, name: 'Analyst Guest (You)', level: 4, courses: 2, xp: 14200, streak: 12, avatar: 'AN' }
];

export default function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState('weekly');

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-between flex-wrap gap-4">
        <div>
          <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Rank Systems</span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
            GLOBAL ANALYST LEADERBOARD
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Compare data intelligence telemetry benchmarks against global operators.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 bg-slate-900 border border-white/5 p-1 rounded-lg font-mono text-[10px]">
          {['weekly', 'monthly', 'all-time'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 rounded uppercase font-bold transition-all ${
                timeFilter === filter 
                  ? 'bg-[#00E5FF] text-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="glass-panel overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs text-slate-300">
            <thead>
              <tr className="bg-[#0C0F16] border-b border-white/5 text-slate-500 uppercase text-[10px] font-bold">
                <th className="py-4 px-6 text-center w-16">Rank</th>
                <th className="py-4 px-6">User Telemetry</th>
                <th className="py-4 px-6 text-center">Level</th>
                <th className="py-4 px-6 text-center">Modules Passed</th>
                <th className="py-4 px-6 text-center">Activity Streak</th>
                <th className="py-4 px-6 text-right pr-8">Total XP</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD_ROWS.map((row) => {
                const isSelf = row.rank === 14;
                
                return (
                  <tr 
                    key={row.rank} 
                    className={`border-b border-white/5 transition-all ${
                      isSelf 
                        ? 'bg-[#00E5FF]/5 border-y border-[#00E5FF]/30 text-white font-bold' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block w-8 py-1 rounded text-[10px] font-bold ${
                        row.rank === 1 ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' :
                        row.rank === 2 ? 'bg-slate-300/10 text-slate-300 border border-slate-300/20' :
                        row.rank === 3 ? 'bg-[#CD7F32]/10 text-[#CD7F32] border border-[#CD7F32]/20' :
                        isSelf ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20' : 'text-slate-500'
                      }`}>
                        {row.rank.toString().padStart(2, '0')}
                      </span>
                    </td>

                    {/* Username & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-white/5 bg-slate-800 flex-center text-xs">
                          {row.avatar}
                        </div>
                        <span className={isSelf ? 'text-[#00E5FF] font-bold' : 'text-slate-200'}>
                          {row.name}
                        </span>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-4 px-6 text-center font-bold text-white">
                      Lvl {row.level.toString().padStart(2, '0')}
                    </td>

                    {/* Courses */}
                    <td className="py-4 px-6 text-center">
                      {row.courses} Completed
                    </td>

                    {/* Streak */}
                    <td className="py-4 px-6 text-center text-[#4FC3F7]">
                      🔥 {row.streak} Days
                    </td>

                    {/* XP */}
                    <td className="py-4 px-6 text-right pr-8 text-[#00E5FF] font-bold font-mono">
                      {row.xp.toLocaleString()} XP
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
