'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  Target,
  FileText,
  Globe,
  UserCheck,
  DollarSign,
  Video,
  Award,
  BookOpen,
  Briefcase,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { AICareerCopilotService, CareerCopilotState } from '@/lib/services/aiCareerCopilotService';

export default function AICareerCopilot() {
  const [copilot, setCopilot] = useState<CareerCopilotState>(
    AICareerCopilotService.getCopilotState()
  );

  return (
    <div className="w-full space-y-8">
      {/* Hero Readiness & Target Role Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0D1117] to-slate-900 border border-[#00E5FF]/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-black uppercase tracking-widest">
              <Brain className="w-3.5 h-3.5" /> AI CAREER COPILOT v2.0
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
              Target Role: <span className="text-[#00E5FF]">{copilot.targetRole}</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Autonomous career intelligence optimizing your readiness, resume bullets, portfolio proof, and interview responses.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Career Readiness</span>
              <div className="text-3xl font-display font-black text-emerald-400 font-mono">
                {copilot.readinessScore}%
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Est. Time to Hire</span>
              <div className="text-xl font-display font-black text-amber-400 font-mono">
                {copilot.estimatedTimeToEmploymentWeeks} Weeks
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 12-Dimension Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#00E5FF]" /> ATS Resume Score
          </span>
          <div className="text-xl font-bold font-mono text-white">{copilot.resumeScore} / 100</div>
          <span className="text-[9px] text-emerald-400 block">Keyword Match High</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-400" /> LinkedIn Optimization
          </span>
          <div className="text-xl font-bold font-mono text-white">{copilot.linkedInOptimizedScore}%</div>
          <span className="text-[9px] text-blue-400 block">Recruiter Searchable</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-purple-400" /> Portfolio Rating
          </span>
          <div className="text-xl font-bold font-mono text-white">{copilot.portfolioRatingScore}%</div>
          <span className="text-[9px] text-purple-400 block">Verified Code Proof</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Estimated Salary
          </span>
          <div className="text-sm font-bold font-mono text-emerald-400 mt-1">{copilot.estimatedSalary}</div>
          <span className="text-[9px] text-slate-400 block">US Remote Market</span>
        </div>
      </div>

      {/* Skill Gaps & Weekly Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill Gap Analysis */}
        <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-[#00E5FF]" /> AI Skill Gap Telemetry
          </h3>

          <div className="space-y-4 text-xs">
            {copilot.skillGaps.map((sg, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{sg.skill}</span>
                  <span className="font-mono text-[#00E5FF] font-bold">
                    {sg.currentLevel}% → Target: {sg.targetLevel}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#00E5FF]" style={{ width: `${sg.currentLevel}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Action: {sg.recommendedAction}</span>
                  <Link href="/simulators/sql" className="text-[#00E5FF] font-bold hover:underline">
                    Bridge Gap →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Action Plan */}
        <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" /> Personalized Weekly Action Plan
          </h3>

          <div className="space-y-3 text-xs">
            {copilot.weeklyActionPlan.map((act) => (
              <div
                key={act.weekNumber}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  act.completed
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {act.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-mono font-bold uppercase text-amber-400">
                      WEEK {act.weekNumber} • {act.focusArea}
                    </span>
                    {act.completed && (
                      <span className="text-emerald-400 font-bold uppercase text-[9px]">COMPLETED</span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-xs mb-0.5">{act.taskTitle}</h4>
                  <p className="text-[11px] text-slate-400">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
