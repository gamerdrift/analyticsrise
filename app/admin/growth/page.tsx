'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  Award,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';

export default function AdminGrowthAnalyticsPage() {
  const metrics = {
    dau: 2840,
    wau: 8950,
    mau: 14250,
    dailyChallengeCompletionRate: '68.4%',
    streakRetentionRate: '42.1%',
    referralKFactor: '1.45',
  };

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
              <Activity className="w-3.5 h-3.5" /> PRODUCT TELEMETRY
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-3">
              Growth & Engagement Analytics
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Executive dashboard measuring DAU/WAU/MAU ratios, daily challenge adoption, and viral referral loops.
            </p>
          </div>

          <Link
            href="/admin/referrals"
            className="px-4 py-2.5 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/5 transition-all"
          >
            Configure Referral Rules
          </Link>
        </div>

        {/* Top Growth KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 rounded-3xl bg-[#0D1117]/90 border border-[#00E5FF]/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Daily Active Users (DAU)
            </span>
            <div className="text-3xl font-display font-black text-white">
              {metrics.dau.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#00E5FF] font-mono block mt-2">+12.4% vs last week</span>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117]/90 border border-purple-500/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Weekly Active Users (WAU)
            </span>
            <div className="text-3xl font-display font-black text-white">
              {metrics.wau.toLocaleString()}
            </div>
            <span className="text-[10px] text-purple-300 font-mono block mt-2">DAU/WAU Ratio: 31.7%</span>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117]/90 border border-amber-500/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Daily Challenge Completion
            </span>
            <div className="text-3xl font-display font-black text-white">
              {metrics.dailyChallengeCompletionRate}
            </div>
            <span className="text-[10px] text-amber-300 font-mono block mt-2">1,940 Challenges / day</span>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117]/90 border border-emerald-500/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Referral K-Factor
            </span>
            <div className="text-3xl font-display font-black text-white">
              {metrics.referralKFactor}
            </div>
            <span className="text-[10px] text-emerald-300 font-mono block mt-2">Viral Coefficient &gt; 1.0</span>
          </div>
        </div>

        {/* Feature Usage & Retention Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#00E5FF]" /> Engagement Tool Breakdown
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-slate-300">Excel Studio Simulator Sessions</span>
                <strong className="text-white font-mono">14,820 sessions/mo</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-slate-300">SQL Lab Queries Executed</span>
                <strong className="text-white font-mono">68,400 queries/mo</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-slate-300">AI Mentor Queries Submitted</span>
                <strong className="text-white font-mono">32,150 queries/mo</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-slate-300">ATS Resume Scans Run</span>
                <strong className="text-white font-mono">8,940 scans/mo</strong>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00E5FF]" /> Retention Cohort Health
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-emerald-300">Day 1 Retention</span>
                  <strong className="text-white font-mono">64.2%</strong>
                </div>
                <div className="p-3 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-between">
                  <span className="text-[#00E5FF]">Day 7 Retention</span>
                  <strong className="text-white font-mono">42.8%</strong>
                </div>
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                  <span className="text-purple-300">Day 30 Retention</span>
                  <strong className="text-white font-mono">28.5%</strong>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 mt-4">
              Retention benchmarks exceed enterprise SaaS industry standards.
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
