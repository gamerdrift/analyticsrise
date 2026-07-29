'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Target } from 'lucide-react';
import { RecommendationItem } from '@/lib/services/aiRecommendationService';

interface AIRecommendationCardProps {
  item: RecommendationItem;
}

export default function AIRecommendationCard({ item }: AIRecommendationCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-[#0D1117] border border-cyan-500/30 relative overflow-hidden flex flex-col justify-between hover:border-cyan-500/60 transition-all">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
              AI MENTOR SUGGESTION
            </span>
          </div>
          {item.badgeLabel && (
            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30">
              {item.badgeLabel}
            </span>
          )}
        </div>

        <h4 className="text-base font-bold text-white mb-1">{item.title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.description}</p>
      </div>

      <Link
        href={item.targetRoute}
        className="w-full py-2.5 rounded-xl bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold text-center transition-all flex items-center justify-center gap-2"
      >
        {item.actionText} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
