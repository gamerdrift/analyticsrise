'use client';

import React from 'react';
import { PlanTier } from '@/lib/config/plans';

interface PlanBadgeProps {
  planId: PlanTier;
  className?: string;
}

export default function PlanBadge({ planId, className = '' }: PlanBadgeProps) {
  switch (planId) {
    case 'pro':
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black shadow-md shadow-[#00E5FF]/20 ${className}`}>
          PRO
        </span>
      );
    case 'student_pro':
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 ${className}`}>
          STUDENT PRO
        </span>
      );
    case 'enterprise':
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/20 ${className}`}>
          ENTERPRISE
        </span>
      );
    case 'recruiter':
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30 ${className}`}>
          RECRUITER
        </span>
      );
    case 'free':
    default:
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-slate-400 border border-slate-700 ${className}`}>
          FREE TIER
        </span>
      );
  }
}
