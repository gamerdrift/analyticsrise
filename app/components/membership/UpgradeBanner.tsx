'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, ShieldAlert } from 'lucide-react';
import { PlanTier } from '@/lib/config/plans';

interface UpgradeBannerProps {
  currentPlan: PlanTier;
  featureName?: string;
  usagePercentage?: number;
  onUpgradeClick?: () => void;
  className?: string;
}

export default function UpgradeBanner({
  currentPlan,
  featureName,
  usagePercentage = 85,
  onUpgradeClick,
  className = '',
}: UpgradeBannerProps) {
  if (currentPlan === 'pro' || currentPlan === 'enterprise') {
    return null; // Unlimited plans don't show upgrade alerts
  }

  const isLimitReached = usagePercentage >= 100;

  return (
    <div
      className={`w-full rounded-2xl p-4 border backdrop-blur-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
        isLimitReached
          ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          : 'bg-gradient-to-r from-[#00E5FF]/10 via-[#07090E] to-purple-950/20 border-[#00E5FF]/30 text-white'
      } ${className}`}
    >
      {/* Accent Background Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isLimitReached
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 shadow-lg shadow-[#00E5FF]/10'
          }`}
        >
          {isLimitReached ? <ShieldAlert className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            {isLimitReached
              ? `${featureName || 'Feature'} Quota Reached`
              : `Unlock Unlimited ${featureName || 'Analytics Power'}`}
            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
              {usagePercentage}% USED
            </span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isLimitReached
              ? `You have reached your monthly limit on the ${currentPlan.toUpperCase()} tier. Upgrade to Pro for unlimited access.`
              : `Upgrade to Professional Pro for unlimited AI Mentoring, practice labs, and ATS resume optimizations.`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 relative z-10 shrink-0 w-full sm:w-auto">
        {onUpgradeClick ? (
          <button
            onClick={onUpgradeClick}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-bold tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-black" /> Upgrade Now <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href="/pricing"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-bold tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-black" /> Upgrade Now <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
