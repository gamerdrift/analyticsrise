'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WhyAnalyticsRiseSection() {
  const comparisons = [
    {
      traditional: 'Passive video lectures where you watch someone else write code',
      analyticsRise: 'Active, in-browser practice workbenches where you write real queries and formulas',
      feature: 'Learning Method',
    },
    {
      traditional: 'Isolated tutorials with synthetic data that don’t translate to real business problems',
      analyticsRise: 'Real-world business case studies (SaaS churn, marketing CAC, logistics schemas)',
      feature: 'Dataset Realism',
    },
    {
      traditional: 'Jumping between dozens of disconnected apps, YouTube tabs, and local installers',
      analyticsRise: 'One unified learning ecosystem with zero installation or configuration required',
      feature: 'Ecosystem',
    },
    {
      traditional: 'Guessing whether you actually understand the concepts without feedback',
      analyticsRise: 'Instant automated query validation, benchmark feedback, and structured unlocks',
      feature: 'Feedback Loop',
    },
    {
      traditional: 'Generic completion certificates that anyone can screenshot with zero proof',
      analyticsRise: 'Cryptographically verifiable completion certificates backed by simulator logs',
      feature: 'Proof of Skill',
    },
  ];

  return (
    <section id="why-analyticsrise" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
      {/* Section Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF] mb-4 text-xs font-mono uppercase tracking-widest font-bold">
          <span>🔺 THE ANALYTICSRISE ADVANTAGE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight uppercase mb-4">
          WHY <span className="text-[#00E5FF]">ANALYTICSRISE?</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          Most data courses stop at video tutorials. AnalyticsRise is built around practical capability — because skills become truly valuable only when you can demonstrate them.
        </p>
      </div>

      {/* Comparison Table / Matrix */}
      <div className="rounded-2xl border border-white/10 bg-[#0D1117]/80 backdrop-blur-md overflow-hidden shadow-2xl mb-16">
        {/* Table Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 bg-white/[0.03] border-b border-white/10 p-4 md:p-6 font-mono text-xs uppercase tracking-wider font-bold">
          <div className="md:col-span-3 text-slate-500 hidden md:block">Dimension</div>
          <div className="md:col-span-4 text-rose-400 flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>Traditional Video Courses</span>
          </div>
          <div className="md:col-span-5 text-[#00E5FF] flex items-center gap-2 mt-2 md:mt-0">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>The AnalyticsRise Platform</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5">
          {comparisons.map((row, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="grid grid-cols-1 md:grid-cols-12 p-5 md:p-6 gap-4 items-center hover:bg-white/[0.02] transition-colors"
            >
              {/* Feature Dimension */}
              <div className="md:col-span-3">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
                  {row.feature}
                </span>
              </div>

              {/* Traditional Approach */}
              <div className="md:col-span-4 flex items-start gap-2.5 text-xs text-slate-400 font-sans">
                <XCircle className="w-4 h-4 text-rose-500/70 shrink-0 mt-0.5" />
                <span>{row.traditional}</span>
              </div>

              {/* AnalyticsRise Approach */}
              <div className="md:col-span-5 flex items-start gap-2.5 text-xs sm:text-sm text-white font-medium font-sans">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <span>{row.analyticsRise}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Outcome & Proof Banner */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#080C14] via-[#0D1117] to-[#080C14] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>VERIFIABLE CAREER PROOF</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display uppercase tracking-wide">
            Don&apos;t Just Learn. Prove What You Can Do.
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Every solved challenge and passed assessment adds tangible, verifiable evidence to your personal analytics portfolio.
          </p>
        </div>

        <Link
          href="/pricing"
          className="shrink-0 px-8 py-4 rounded-xl bg-[#00E5FF] hover:bg-[#4FC3F7] text-black font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#00E5FF]/20 flex items-center gap-2"
        >
          <span>Explore Plans & Pricing</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
