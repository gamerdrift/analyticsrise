'use client';

import React from 'react';
import { Company } from '@/lib/services/careerService';
import { X, Building2, MapPin, Users, Globe, Star, CheckCircle2, ShieldCheck } from 'lucide-react';

interface EmployerProfileModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployerProfileModal({ company, isOpen, onClose }: EmployerProfileModalProps) {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 font-mono text-xs">
      <div className="bg-[#0D1117] border border-[#00E5FF]/40 rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {/* Company Header */}
        <div className="flex items-center gap-4">
          <img src={company.logo} alt={company.name} className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-display text-white">{company.name}</h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                {company.hiringStatus}
              </span>
            </div>
            <p className="text-slate-400 text-xs">{company.industry} • {company.headquarters}</p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="p-4 rounded-xl border border-white/10 bg-[#05070B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-xl font-bold text-white font-display">{company.rating || 4.6} / 5.0</span>
            <span className="text-[10px] text-slate-500 font-mono">(Glassdoor Verified Partner)</span>
          </div>
          <span className="text-xs text-[#00E5FF] font-bold">{company.totalOpenJobs} Active Jobs</span>
        </div>

        {/* Overview */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">
            Company Overview
          </h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            {company.overview || `${company.name} is a leading enterprise operating across ${company.industry}.`}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">
            Technologies & Data Stack
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {company.technologies.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-xs font-bold">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">
            Perks & Corporate Culture
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {company.benefits.map((b) => (
              <span key={b} className="px-2.5 py-1 rounded bg-white/5 text-slate-300 border border-white/5 text-xs">
                {b}
              </span>
            ))}
          </div>
        </div>

        <a
          href={company.website}
          target="_blank"
          rel="noreferrer"
          className="w-full py-3 rounded-xl bg-[#00E5FF] text-black font-bold uppercase tracking-wider hover:bg-[#4FC3F7] transition-all flex items-center justify-center gap-2 text-xs"
        >
          Visit Official Careers Site ↗
        </a>
      </div>
    </div>
  );
}
