'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import ResumeStudio from '@/app/components/career/ResumeStudio';
import PortfolioStudio from '@/app/components/career/PortfolioStudio';
import CareerIntelligence from '@/app/components/career/CareerIntelligence';
import InterviewCenter from '@/app/components/career/InterviewCenter';
import JobHub from '@/app/components/career/JobHub';
import {
  Briefcase,
  FileText,
  UserCheck,
  Brain,
  MessageSquare,
  Search,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

type CareerTab = 'overview' | 'resume' | 'portfolio' | 'intelligence' | 'interview' | 'jobs';

export default function CareerHubPage() {
  const [activeTab, setActiveTab] = useState<CareerTab>('overview');

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto font-sans">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Career Overview
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'resume'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> AI Resume Studio
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'portfolio'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Portfolio Studio
          </button>
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'intelligence'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" /> Role Intelligence
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'interview'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Interview Center
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'jobs'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" /> Job Hub
          </button>
        </div>

        {/* ─── TAB: OVERVIEW ────────────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Header */}
            <div className="glass-panel p-8 rounded-2xl border border-[#00E5FF]/30 bg-gradient-to-r from-slate-900 via-[#0D1117] to-slate-900 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-[10px] font-mono font-bold uppercase tracking-widest">
                    CAREER PLATFORM ACTIVE
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black font-display text-white uppercase tracking-wide mt-2">
                    ANALYTICS CAREER INTELLIGENCE PLATFORM
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                    Build ATS-compliant resumes, publish verified portfolios, take mock AI interviews, and track job applications in one ecosystem.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('resume')}
                  className="px-6 py-3 rounded-xl bg-[#00E5FF] text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#4FC3F7] transition-all shadow-xl shadow-[#00E5FF]/20 flex items-center gap-2 shrink-0"
                >
                  Open AI Resume Studio <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#0D1117]/80">
                <span className="text-[10px] text-slate-500 font-mono uppercase">ATS Resume Score</span>
                <span className="text-3xl font-black font-display text-[#00E5FF] mt-2 block">85 / 100</span>
                <span className="text-[10px] text-emerald-400 font-mono">Enterprise Ready</span>
              </div>
              <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#0D1117]/80">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Portfolio Status</span>
                <span className="text-3xl font-black font-display text-white mt-2 block">92% COMPLETE</span>
                <span className="text-[10px] text-[#00E5FF] font-mono">Public URL Active</span>
              </div>
              <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#0D1117]/80">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Role Readiness</span>
                <span className="text-3xl font-black font-display text-emerald-400 mt-2 block">88% MATCH</span>
                <span className="text-[10px] text-slate-400 font-mono">Target: Data Analyst</span>
              </div>
              <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#0D1117]/80">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Active Applications</span>
                <span className="text-3xl font-black font-display text-amber-400 mt-2 block">3 TRACKED</span>
                <span className="text-[10px] text-slate-400 font-mono">1 Interview Scheduled</span>
              </div>
            </div>

            {/* Quick Navigation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div
                onClick={() => setActiveTab('resume')}
                className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 hover:border-[#00E5FF]/40 transition-all cursor-pointer space-y-3"
              >
                <FileText className="w-6 h-6 text-[#00E5FF]" />
                <h3 className="text-base font-bold font-display text-white uppercase">AI Resume Studio</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Generate ATS-compliant resumes with AI summary optimization and quantifiable bullet enhancer.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('portfolio')}
                className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 hover:border-[#00E5FF]/40 transition-all cursor-pointer space-y-3"
              >
                <UserCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="text-base font-bold font-display text-white uppercase">Public Portfolio Studio</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Publish your profile at analyticsrise.com/portfolio/{'{username}'} showcasing your SQL and Power BI projects.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('interview')}
                className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 hover:border-[#00E5FF]/40 transition-all cursor-pointer space-y-3"
              >
                <MessageSquare className="w-6 h-6 text-purple-400" />
                <h3 className="text-base font-bold font-display text-white uppercase">Interview Prep Center</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Take mock interviews across 9 analytics categories with instant AI answer evaluation and scoring.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: RESUME STUDIO ─────────────────────────────────────────────────── */}
        {activeTab === 'resume' && <ResumeStudio />}

        {/* ─── TAB: PORTFOLIO STUDIO ──────────────────────────────────────────────── */}
        {activeTab === 'portfolio' && <PortfolioStudio />}

        {/* ─── TAB: ROLE INTELLIGENCE ─────────────────────────────────────────────── */}
        {activeTab === 'intelligence' && <CareerIntelligence />}

        {/* ─── TAB: INTERVIEW CENTER ──────────────────────────────────────────────── */}
        {activeTab === 'interview' && <InterviewCenter />}

        {/* ─── TAB: JOB HUB ───────────────────────────────────────────────────────── */}
        {activeTab === 'jobs' && <JobHub />}
      </div>
    </DashboardLayout>
  );
}
