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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF] mb-6 shadow-lg shadow-[#00E5FF]/10"
        >
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest font-bold">
            AnalyticsRise Ecosystem V1.0 • AI Business Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-display tracking-tight uppercase leading-[1.05] mb-4"
        >
          DEMOCRATIZE DATA ANALYTICS <br className="hidden sm:inline" />
          THROUGH <span className="bg-gradient-to-r from-[#00E5FF] via-purple-400 to-[#00E5FF] bg-clip-text text-transparent">ARTIFICIAL INTELLIGENCE</span>
        </motion.h1>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base sm:text-xl font-mono text-[#00E5FF] font-bold tracking-widest uppercase mb-6 flex items-center justify-center gap-2 flex-wrap"
        >
          <span>Upload.</span>
          <span className="text-slate-500">•</span>
          <span>Analyze.</span>
          <span className="text-slate-500">•</span>
          <span>Visualize.</span>
          <span className="text-slate-500">•</span>
          <span>Understand.</span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl leading-relaxed mb-10"
        >
          An immersive AI software ecosystem empowering individuals and enterprise organizations. From real-time Business Intelligence in AR Studio to conversational AI co-pilots and interactive simulators.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/ar-studio"
              className="block px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#4FC3F7] to-[#00E5FF] text-black font-mono font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300 shadow-xl shadow-[#00E5FF]/20 text-center cursor-pointer"
            >
              Launch AR Studio
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <a
              href="#experiences"
              className="block px-8 py-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-white/10 hover:border-white/40 transition-all duration-300 text-center cursor-pointer"
            >
              Explore Experience Cards
            </a>
          </motion.div>
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
