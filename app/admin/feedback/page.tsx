'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, ThumbsUp, ShieldCheck, CheckCircle2, Sliders } from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';
import { FeedbackService, UserFeedbackItem } from '@/lib/services/feedbackService';

export default function AdminFeedbackRankingPage() {
  const [items] = useState<UserFeedbackItem[]>(FeedbackService.getFeedbackList());

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-widest mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> ADMIN FEEDBACK INTELLIGENCE
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
              Feature Requests & Bug Prioritization Board
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Admin dashboard ranking user feedback by upvote popularity, community impact, and release status.
            </p>
          </div>
        </div>

        {/* Feedback Ranking Table */}
        <div className="p-8 rounded-3xl bg-[#0D1117] border border-white/10 space-y-4">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#00E5FF]/20 text-[#00E5FF]">
                      {item.category}
                    </span>
                    <h3 className="text-xs font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-300">{item.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" /> {item.upvotesCount} votes
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold border border-emerald-500/30">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
