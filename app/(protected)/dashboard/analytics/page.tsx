'use client';

import React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Award,
  Zap,
  Target,
  CheckCircle2,
  Brain,
  FileSpreadsheet,
  Database,
  Code2,
  ArrowUpRight,
} from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';
import TodaysMissionWidget from '@/app/components/growth/TodaysMissionWidget';
import StreakWidget from '@/app/components/growth/StreakWidget';
import AchievementGallery from '@/app/components/growth/AchievementGallery';
import { StreakService } from '@/lib/services/streakService';

export default function LearningAnalyticsPage() {
  const streak = StreakService.getStreak();

  const skillScores = [
    { name: 'SQL Querying & Joins', score: 92, status: 'EXPERT', color: 'bg-[#00E5FF]' },
    { name: 'Excel Formulas & VLOOKUP', score: 88, status: 'ADVANCED', color: 'bg-[#00E5FF]' },
    { name: 'Python & Pandas Wrangling', score: 74, status: 'INTERMEDIATE', color: 'bg-purple-400' },
    { name: 'Tableau & Power BI Dashboards', score: 65, status: 'INTERMEDIATE', color: 'bg-amber-400' },
    { name: 'Statistical Hypothesis Testing', score: 80, status: 'ADVANCED', color: 'bg-emerald-400' },
  ];

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-black uppercase tracking-widest mb-2">
              <BarChart3 className="w-3.5 h-3.5" /> LEARNER ANALYTICS TELEMETRY
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-3">
              Skill Progression & Career Readiness
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time telemetry tracking course completions, simulator accuracy, and market readiness.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-4 py-2.5 rounded-xl border border-white/20 text-slate-300 text-xs font-bold hover:bg-white/5 transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Section 1: Today's Mission & Streak */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2">
            <TodaysMissionWidget streak={streak} userXp={1450} dailyGoalProgress={65} />
          </div>
          <div>
            <StreakWidget />
          </div>
        </div>

        {/* Section 2: Skill Breakdown Radar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#00E5FF]" /> Verified Skill Competency Scores
            </h3>

            <div className="space-y-4">
              {skillScores.map((sk, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-200">{sk.name}</span>
                    <span className="font-mono text-slate-400 font-bold">
                      {sk.score}% <span className="text-[9px] text-[#00E5FF] uppercase">({sk.status})</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${sk.color}`} style={{ width: `${sk.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulator Performance Breakdown */}
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#00E5FF]" /> Practice Lab Performance
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Excel Studio Accuracy</span>
                  </div>
                  <strong className="text-white font-mono">94.2% (18/19 Labs)</strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span>SQL Query Success Rate</span>
                  </div>
                  <strong className="text-white font-mono">91.0% (45/49 Queries)</strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    <span>Python Notebook Execution</span>
                  </div>
                  <strong className="text-white font-mono">88.5% (12/14 Scripts)</strong>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Overall Career Readiness Score</span>
              <strong className="text-sm font-black text-emerald-400 font-mono">88 / 100 (HIGH)</strong>
            </div>
          </div>
        </div>

        {/* Section 3: Achievement Showcase */}
        <AchievementGallery />
      </main>

      <LandingFooter />
    </div>
  );
}
