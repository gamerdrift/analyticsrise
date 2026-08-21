'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { AiEvaQuotaState } from '@/lib/ai/eva/types';

interface AiEvaLimitNoticeProps {
  quota: AiEvaQuotaState;
  className?: string;
}

export function AiEvaLimitNotice({ quota, className = '' }: AiEvaLimitNoticeProps) {
  const isLow = quota.queriesRemaining <= 3;
  const isDepleted = quota.queriesRemaining === 0;

  return (
    <div
      className={`p-2.5 rounded-xl border text-[11px] font-mono flex items-center justify-between gap-3 ${
        isDepleted
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          : isLow
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          : 'bg-[#0D1117]/80 border-white/10 text-slate-400'
      } ${className}`}
    >
      <div className="flex items-center gap-2 truncate">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#00E5FF]" />
        <span className="truncate">
          <strong className="text-white">{quota.queriesRemaining}</strong> / {quota.dailyQuotaLimit} queries left today
          <span className="text-[10px] text-slate-500 ml-1.5">({quota.tier.toUpperCase()})</span>
        </span>
      </div>

      {quota.tier === 'free' && (
        <Link
          href="/pricing"
          className="px-2 py-0.5 rounded bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-bold tracking-wider uppercase transition-colors shrink-0 flex items-center gap-1"
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>Pro</span>
        </Link>
      )}
    </div>
  );
}

export default AiEvaLimitNotice;
