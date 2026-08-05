'use client';

import React from 'react';
import Link from 'next/link';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { Newspaper, Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogPortalPage() {
  const posts = [
    {
      title: 'How We Built Client-Side WebAssembly Data Engine for AR Studio',
      excerpt: 'Exploring low-latency columnar storage and Rust-to-Wasm compilation in modern browser analytics.',
      date: 'August 4, 2026',
      author: 'Chief Software Architect',
    },
    {
      title: 'The Death of Passive Video Tutorials in Tech Education',
      excerpt: 'Why active practice in in-browser replica environments results in 4x higher retention for SQL and BI learners.',
      date: 'July 28, 2026',
      author: 'Chief Product Officer',
    },
    {
      title: '10 Advanced Window Functions Every SQL Analyst Must Master',
      excerpt: 'Deep dive into ROW_NUMBER(), DENSE_RANK(), LAG(), LEAD(), and custom frame partitioning.',
      date: 'July 15, 2026',
      author: 'Senior Data Engineer',
    },
  ];

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans selection:bg-cyan-500/20 selection:text-cyan-400 flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-25" />
      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
            <Newspaper className="w-4 h-4" /> AnalyticsRise Insights
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black text-white uppercase tracking-tight">
            ENGINEERING & ANALYTICS <span className="text-cyan-400">BLOG</span>
          </h1>

          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            In-depth engineering articles, AI research, and data architecture guides.
          </p>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {posts.map((p, idx) => (
            <article key={idx} className="p-8 rounded-3xl bg-[#080C14] border border-white/10 space-y-4 hover:border-cyan-400/40 transition-all">
              <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-cyan-400" /> {p.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-cyan-400" /> {p.author}</span>
              </div>

              <h2 className="text-xl font-display font-bold text-white uppercase hover:text-cyan-400 transition-colors">
                {p.title}
              </h2>

              <p className="text-slate-400 text-xs font-sans leading-relaxed">{p.excerpt}</p>

              <div className="pt-2">
                <Link href="#" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
