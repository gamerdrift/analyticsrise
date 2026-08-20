'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Terminal, CheckCircle2, Play } from 'lucide-react';
import { ArTriangleIcon } from '@/app/components/brand';

export default function LandingHero() {
  const telemetryStats = [
    { label: 'ACTIVE LEARNERS', value: '45,000+' },
    { label: 'QUERIES & FORMULAS RUN', value: '1.4M+' },
    { label: 'PRACTICAL LABS', value: '120+' },
    { label: 'LOCAL SETUP REQUIRED', value: 'ZERO' },
  ];

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
      {/* Decorative Glows & Cyber-Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-25 z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#00E5FF]/15 via-[#4FC3F7]/5 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content Container */}
      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Learner Platform Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF] mb-6 shadow-lg shadow-[#00E5FF]/10"
        >
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest font-bold">
            The Interactive Data Analytics Platform
          </span>
        </motion.div>

        {/* Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-display tracking-tight uppercase leading-[1.08] mb-6"
        >
          LEARN DATA. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#00E5FF] via-[#4FC3F7] to-[#00E5FF] bg-clip-text text-transparent">
            PRACTICE REAL SKILLS.
          </span> <br className="hidden sm:inline" />
          RISE HIGHER.
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-10 font-sans"
        >
          Master data analytics through structured learning paths, interactive in-browser practice environments, real-world business challenges, and career-focused skill progression.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto items-center"
        >
          {/* Primary CTA */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Link
              href="/courses"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#4FC3F7] to-[#00E5FF] text-black font-mono font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300 shadow-xl shadow-[#00E5FF]/20 text-center flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <a
              href="#flagships"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-white/10 hover:border-white/40 transition-all duration-300 text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Studios</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Learner Metrics Stats Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl border border-white/10 bg-[#0D1117]/70 backdrop-blur-md relative"
        >
          {/* Neon Border Top Highlight */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent" />
          
          {telemetryStats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1 font-semibold">
                {stat.label}
              </span>
              <span className="text-xl md:text-2xl font-black text-white font-display">
                {stat.value}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
