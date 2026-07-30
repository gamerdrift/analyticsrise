'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Users,
  Award,
  Download,
  Activity,
  Zap,
  Briefcase,
  ShieldCheck,
  Brain,
} from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';
import { ExecutiveAnalyticsService } from '@/lib/services/executiveAnalyticsService';

export default function ExecutiveKpiDashboardPage() {
  const [kpis] = useState(ExecutiveAnalyticsService.getExecutiveKpis());
  const [exported, setExported] = useState(false);

  const handleExportCsv = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(kpis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AnalyticsRise_Executive_KPIs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-black uppercase tracking-widest mb-2">
              <Activity className="w-3.5 h-3.5" /> EXECUTIVE ANALYTICS v2.0
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
              Executive Business, Learning & Growth KPI Telemetry
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time executive oversight across revenue metrics (MRR/ARR/LTV), active user retention, and job placement rates.
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" /> {exported ? 'Exported!' : 'Export KPI Telemetry (JSON/CSV)'}
          </button>
        </div>

        {/* Business KPIs */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Executive Business & Revenue Telemetry
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono">
            <div className="p-5 rounded-2xl bg-[#0D1117] border border-emerald-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Monthly Recurring (MRR)</span>
              <div className="text-2xl font-black text-emerald-400">{kpis.business.mrr}</div>
              <span className="text-[9px] text-slate-500 block mt-1">ARR: {kpis.business.arr}</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D1117] border border-[#00E5FF]/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Active Users (DAU / WAU)</span>
              <div className="text-2xl font-black text-[#00E5FF]">{kpis.business.dau.toLocaleString()}</div>
              <span className="text-[9px] text-slate-500 block mt-1">WAU: {kpis.business.wau.toLocaleString()}</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D1117] border border-amber-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Premium Conversion Rate</span>
              <div className="text-2xl font-black text-amber-400">{kpis.business.premiumConversionRate}</div>
              <span className="text-[9px] text-slate-500 block mt-1">ARPU: {kpis.business.arpu}</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D1117] border border-purple-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Enterprise Accounts</span>
              <div className="text-2xl font-black text-purple-300">{kpis.business.enterpriseAccounts}</div>
              <span className="text-[9px] text-slate-500 block mt-1">LTV: {kpis.business.ltv}</span>
            </div>
          </div>
        </div>

        {/* Learning & Growth KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#00E5FF]" /> Learning Telemetry & Outcomes
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-slate-300">Course Completion Rate</span>
                <strong className="text-white">{kpis.learning.courseCompletionRate}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-slate-300">Simulator Accuracy Rate</span>
                <strong className="text-white">{kpis.learning.simulatorCompletionRate}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-slate-300">AI Mock Interview Success</span>
                <strong className="text-white">{kpis.learning.interviewSuccessRate}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-slate-300">Job Placement Rate</span>
                <strong className="text-emerald-400 font-bold">{kpis.learning.jobPlacementRate}</strong>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-400" /> Platform Growth & AI Usage
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-slate-300">AI Mentor Queries Executed</span>
                <strong className="text-white">{kpis.growth.aiMentorQueriesTotal.toLocaleString()}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-slate-300">Candidate Portfolio Views</span>
                <strong className="text-white">{kpis.growth.portfolioViewsTotal.toLocaleString()}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-slate-300">Referral Viral Conversion</span>
                <strong className="text-white">{kpis.growth.referralConversionRate}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-slate-300">Recruiter Engagement Index</span>
                <strong className="text-[#00E5FF] font-bold">{kpis.growth.recruiterEngagementScore} / 100</strong>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
