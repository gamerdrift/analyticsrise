'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingHero() {
  const telemetryStats = [
    { label: 'QUERIES RUN', value: '1,428,290' },
    { label: 'VERIFIED ANALYSTS', value: '12,408' },
    { label: 'LABS PASSED', value: '84,103' },
    { label: 'LEDGER CERTIFICATES', value: '3,294' },
  ];

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
      {/* Decorative Glows & Cyber Grids */}
      <div className="absolute inset-0 grid-bg opacity-30 z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#00E5FF]/10 via-[#4FC3F7]/5 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-10 left-10 w-48 h-48 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content Container */}
      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Cyber Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF] mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
            Practice. Master. Get Certified.
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-display tracking-wide uppercase leading-[1.1] mb-6"
        >
          THE COMMAND CENTER FOR <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] bg-clip-text text-transparent">
            HANDS-ON DATA LITERACY
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10"
        >
          Build production-ready SQL queries, interactive dashboards, and spreadsheet models directly inside in-browser replica interfaces. Stop watching video tutorials. Start analytical problem-solving.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto"
        >
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded border border-[#00E5FF] text-black bg-[#00E5FF] text-xs font-bold tracking-widest uppercase hover:bg-transparent hover:text-[#00E5FF] transition-all duration-300 shadow-lg shadow-[#00E5FF]/20 text-center"
          >
            Launch Console
          </Link>
          <a
            href="#simulators"
            className="px-8 py-3.5 rounded border border-slate-700 text-slate-300 text-xs font-bold tracking-widest uppercase hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-300 text-center"
          >
            Explore Simulators
          </a>
        </motion.div>

        {/* Telemetry Stats Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-xl border border-white/5 bg-[#0D1117]/60 backdrop-blur-sm relative"
        >
          {/* Neon Border Highlight */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />
          
          {telemetryStats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">
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
