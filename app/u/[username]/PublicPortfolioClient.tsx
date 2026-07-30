'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Award,
  Database,
  Code2,
  FileSpreadsheet,
  Globe,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Flame,
  Zap,
  Briefcase,
} from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';

interface PublicPortfolioClientProps {
  username: string;
}

export default function PublicPortfolioClient({ username }: PublicPortfolioClientProps) {
  const [privacyMode, setPrivacyMode] = useState<'public' | 'recruiter' | 'private'>('public');
  const [contacted, setContacted] = useState(false);

  if (privacyMode === 'private') {
    return (
      <div className="min-h-screen bg-[#05070B] text-white flex flex-col items-center justify-center p-6 text-center">
        <Lock className="w-12 h-12 text-[#00E5FF] mb-4" />
        <h2 className="text-2xl font-bold font-display">Private Candidate Profile</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">
          This candidate portfolio has set their privacy to Private. Contact candidate directly or request access.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto w-full space-y-8">
        {/* Candidate Header */}
        <div className="p-8 rounded-3xl bg-[#0D1117] border border-[#00E5FF]/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-[#4FC3F7] p-1 shrink-0">
              <div className="w-full h-full bg-[#0D1117] rounded-xl flex items-center justify-center font-bold text-white font-mono text-xl">
                {username.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-display font-black text-white">Alex Rivera</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> VERIFIED CANDIDATE
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">Senior Data Analyst • @{username}</p>
              <p className="text-xs text-slate-400 mt-2 max-w-lg">
                Specializing in SQL database window functions, Excel financial modeling, and Power BI enterprise DAX semantic layers.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setContacted(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" /> {contacted ? 'Request Sent!' : 'Contact Candidate'}
            </button>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <Code2 className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-blue-400 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Stats & AI Readiness Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/10 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Career Readiness</span>
            <strong className="text-2xl font-display font-black text-emerald-400 font-mono">92 / 100</strong>
          </div>
          <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/10 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Verified XP</span>
            <strong className="text-2xl font-display font-black text-[#00E5FF] font-mono">1,450 XP</strong>
          </div>
          <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/10 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Study Streak</span>
            <strong className="text-2xl font-display font-black text-amber-400 font-mono">5 Days 🔥</strong>
          </div>
          <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/10 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Verified Certs</span>
            <strong className="text-2xl font-display font-black text-purple-400 font-mono">2 Badges</strong>
          </div>
        </div>

        {/* Verified Simulator Scores & Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#00E5FF]" /> Verified Simulator Scores
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>SQL Relational JOINs & Window Functions</span>
                </div>
                <strong className="text-white font-mono">94.8% Score</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Excel XLOOKUP & Financial Modeling</span>
                </div>
                <strong className="text-white font-mono">92.0% Score</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>Python Pandas Data Cleaning Pipelines</span>
                </div>
                <strong className="text-white font-mono">88.5% Score</strong>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" /> Real-World Analytics Projects
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-white/5 space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>E-Commerce Churn Retention SQL Pipeline</span>
                  <span className="text-[#00E5FF] font-mono">SHA-256 Verified</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Constructed SQL window function scripts calculating monthly cohort retention across 50,000 users.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>Healthcare Financial DCF Valuation Model</span>
                  <span className="text-[#00E5FF] font-mono">SHA-256 Verified</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Formulated dynamic Excel scenario manager evaluating 5-year revenue sensitivity metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
