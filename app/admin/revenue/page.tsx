'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Users,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Briefcase,
  Layers,
} from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';

export default function AdminRevenuePage() {
  const metrics = {
    mrrUsd: 48950,
    arrUsd: 587400,
    totalUsers: 14250,
    paidUsers: 1840,
    freeUsers: 12410,
    conversionRate: '12.9%',
    monthlyGrowth: '+18.4%',
  };

  const planDistribution = [
    { name: 'Professional Pro ($29/mo)', count: 1120, percentage: 60.8, color: 'bg-[#00E5FF]' },
    { name: 'Student Pro ($12/mo)', count: 480, percentage: 26.1, color: 'bg-cyan-400' },
    { name: 'Recruiter Suite ($149/mo)', count: 180, percentage: 9.8, color: 'bg-amber-400' },
    { name: 'Enterprise Corporate', count: 60, percentage: 3.3, color: 'bg-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      {/* Navigation */}
      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-2">
              <TrendingUp className="w-3.5 h-3.5" /> Executive Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-[#00E5FF]" /> Revenue & Conversion Analytics
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time telemetry tracking Monthly Recurring Revenue (MRR), ARR projections, and plan conversion funnels.
            </p>
          </div>

          <Link
            href="/admin/monetization"
            className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/5 transition-all flex items-center gap-2"
          >
            Configure Pricing & Rules
          </Link>
        </div>

        {/* Top KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 rounded-3xl bg-[#0D1117]/90 border border-emerald-500/30 relative overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Monthly Recurring Revenue (MRR)
            </span>
            <div className="text-3xl font-display font-black text-white">
              ${metrics.mrrUsd.toLocaleString()}
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-2">
              <ArrowUpRight className="w-3 h-3" /> {metrics.monthlyGrowth} MoM
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117]/90 border border-purple-500/30 relative overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Annual Run Rate (ARR)
            </span>
            <div className="text-3xl font-display font-black text-white">
              ${metrics.arrUsd.toLocaleString()}
            </div>
            <span className="text-[10px] font-mono text-purple-300 block mt-2">
              Projected 12-Month Run Rate
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117]/90 border border-[#00E5FF]/30 relative overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Paid Subscribers
            </span>
            <div className="text-3xl font-display font-black text-white">
              {metrics.paidUsers.toLocaleString()}
            </div>
            <span className="text-[10px] font-mono text-[#00E5FF] block mt-2">
              Out of {metrics.totalUsers.toLocaleString()} Total Users
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117]/90 border border-amber-500/30 relative overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Free to Paid Conversion
            </span>
            <div className="text-3xl font-display font-black text-white">
              {metrics.conversionRate}
            </div>
            <span className="text-[10px] font-mono text-amber-300 block mt-2">
              Benchmark Target: &gt; 10%
            </span>
          </div>
        </div>

        {/* Section: Subscription Plan Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#00E5FF]" /> Active Subscription Distribution
            </h3>

            <div className="space-y-4">
              {planDistribution.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-200">{item.name}</span>
                    <span className="font-mono text-slate-400">
                      {item.count} users ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Funnel Breakdown */}
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00E5FF]" /> Conversion Funnel Telemetry
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                  <span className="text-slate-400">1. Free Tier Registrations</span>
                  <strong className="text-white font-mono">14,250</strong>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                  <span className="text-slate-400">2. Pricing Page Views</span>
                  <strong className="text-white font-mono">6,420 (45%)</strong>
                </div>
                <div className="p-3 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-between">
                  <span className="text-[#00E5FF] font-bold">3. Checkout Initiated</span>
                  <strong className="text-[#00E5FF] font-mono font-bold">2,150 (33.4%)</strong>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">4. Completed Paid Conversion</span>
                  <strong className="text-emerald-300 font-mono font-bold">1,840 (85.5%)</strong>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 mt-4">
              Funnel conversion health benchmark: Healthy (&gt; 80% checkout completion).
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
