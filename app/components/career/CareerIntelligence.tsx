'use client';

import React, { useState } from 'react';
import {
  careerIntelligenceService,
  SUPPORTED_ROLES,
  CareerRoleProfile,
} from '@/lib/services/careerIntelligenceService';
import {
  Brain,
  TrendingUp,
  Target,
  Award,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';

export default function CareerIntelligence() {
  const [selectedRoleProfile, setSelectedRoleProfile] = useState<CareerRoleProfile>(
    SUPPORTED_ROLES[0]
  );

  const readinessScore = careerIntelligenceService.calculateReadinessScore(selectedRoleProfile.id);

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              CAREER INTELLIGENCE ENGINE
            </span>
            <span className="text-xs text-slate-400 font-mono">10 Roles Supported</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white uppercase tracking-wide mt-1">
            AI ROLE ALIGNMENT & SKILL GAP ANALYSIS
          </h1>
        </div>
      </div>

      {/* Role Selection Grid */}
      <div>
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-3">
          Select Target Analytics Career Role:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {SUPPORTED_ROLES.map((role) => {
            const isSelected = role.id === selectedRoleProfile.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRoleProfile(role)}
                className={`p-3 rounded-xl border font-mono text-xs text-left transition-all ${
                  isSelected
                    ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-white shadow-lg shadow-[#00E5FF]/10'
                    : 'bg-[#0D1117]/80 border-white/5 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="block font-bold text-white font-display uppercase tracking-wider text-[11px] truncate">
                  {role.title}
                </span>
                <span className="text-[9px] text-[#00E5FF] block mt-0.5">{role.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Readiness Gauge & Salary Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Readiness Score & Salary Ranges */}
        <div className="lg:col-span-5 space-y-6">
          {/* Readiness Score Card */}
          <div className="glass-panel p-6 rounded-2xl border border-[#00E5FF]/30 bg-[#0D1117]/90 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Role Readiness Index
              </span>
              <Target className="w-5 h-5 text-[#00E5FF]" />
            </div>

            <div className="my-2">
              <span className="text-4xl font-black font-display text-white">{readinessScore}%</span>
              <span className="text-xs font-mono text-emerald-400 block mt-1">
                {readinessScore >= 80 ? '● High Candidate Match' : '● Skills Gap Identified'}
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00E5FF] to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              {selectedRoleProfile.description}
            </p>
          </div>

          {/* Salary Benchmark Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                Market Compensation Estimate
              </span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded bg-[#05070B] border border-white/5">
                <span className="text-[9px] text-slate-500 block uppercase">Entry Level</span>
                <span className="text-sm font-bold text-white mt-1 block">{selectedRoleProfile.salaryRange.entry}</span>
              </div>
              <div className="p-3 rounded bg-[#05070B] border border-[#00E5FF]/20 bg-[#00E5FF]/5">
                <span className="text-[9px] text-[#00E5FF] font-bold block uppercase">Mid Level</span>
                <span className="text-sm font-bold text-[#00E5FF] mt-1 block">{selectedRoleProfile.salaryRange.mid}</span>
              </div>
              <div className="p-3 rounded bg-[#05070B] border border-white/5">
                <span className="text-[9px] text-slate-500 block uppercase">Senior Level</span>
                <span className="text-sm font-bold text-white mt-1 block">{selectedRoleProfile.salaryRange.senior}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Skill Gap Breakdown & Recommended Certs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Skill Gap Analysis Table */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 space-y-4">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#00E5FF]" /> Skill Gap & Rating Analysis
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {selectedRoleProfile.skillsRequired.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#05070B] border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{s.skillName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        s.isGap
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {s.isGap ? 'Gap to Target' : 'Proficient'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>Current: {s.currentRating}%</span>
                        <span>Target: {s.requiredRating}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${s.currentRating}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Certifications & Action */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 space-y-4">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Recommended Certification Path
            </h3>

            <div className="space-y-2 font-mono text-xs">
              {selectedRoleProfile.suggestedCertifications.map((cert, idx) => (
                <div key={idx} className="p-3 rounded bg-[#05070B] border border-white/5 flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{cert}</span>
                  </div>
                  <Link href="/certifications">
                    <button className="text-[10px] text-[#00E5FF] font-bold uppercase hover:underline">
                      Enroll →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
