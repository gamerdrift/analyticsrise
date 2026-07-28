'use client';

import React from 'react';
import { Sparkles, Brain, Award, ArrowRight, CheckCircle2, Target } from 'lucide-react';
import Link from 'next/link';

interface AICareerMatchCardProps {
  score?: number;
  userName?: string;
}

export default function AICareerMatchCard({ score = 92, userName = 'Analytics Learner' }: AICareerMatchCardProps) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-[#00E5FF]/40 bg-gradient-to-br from-[#0D1117] via-slate-900 to-[#07090E] font-mono text-xs shadow-2xl relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Score Circle & Info */}
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 rounded-full border-4 border-[#00E5FF]/30 bg-[#05070B] flex flex-col items-center justify-center shadow-lg shadow-[#00E5FF]/20 shrink-0">
            <span className="text-2xl font-black font-display text-[#00E5FF]">{score}%</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">ROLE MATCH</span>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-bold uppercase border border-[#00E5FF]/20">
              <Sparkles className="w-3 h-3" /> AI Career Intelligence Match
            </div>
            <h3 className="text-lg font-bold font-display text-white uppercase">
              Target Role: Senior Data Analyst
            </h3>
            <p className="text-slate-400 text-xs max-w-lg leading-relaxed">
              Based on your completed SQL and Excel Studio Pro simulations, 1,250 XP, and verified skill badges.
            </p>
          </div>
        </div>

        {/* Right: Recommended Skills & CTAs */}
        <div className="space-y-3 w-full lg:w-auto">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Recommended Next Skills:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-emerald-400 font-bold text-[10px]">
                + Snowflake DW
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-purple-400 font-bold text-[10px]">
                + Databricks PySpark
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[#00E5FF] font-bold text-[10px]">
                + Power BI DAX
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/courses"
              className="px-4 py-2 rounded-xl bg-[#00E5FF] text-black font-bold hover:bg-[#4FC3F7] transition-all text-xs flex items-center gap-1.5 shadow-md shadow-[#00E5FF]/20"
            >
              Start Recommended Course <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/career-hub"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-[#00E5FF]/40 transition-all text-xs flex items-center gap-1.5"
            >
              <Brain className="w-3.5 h-3.5 text-[#00E5FF]" /> AI Resume Optimizer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
