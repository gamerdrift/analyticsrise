'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ConversionTriggers() {
  const [showExitIntent, setShowExitIntent] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        const hasShown = sessionStorage.getItem('analyticsrise_exit_intent_shown');
        if (!hasShown) {
          setShowExitIntent(true);
          sessionStorage.setItem('analyticsrise_exit_intent_shown', 'true');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  return (
    <AnimatePresence>
      {showExitIntent && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExitIntent(false)}
            className="fixed inset-0 bg-[#05070B]/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0D1117] border-2 border-[#00E5FF] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#00E5FF]/20 z-10 text-center overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-2 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent rounded-full shadow-lg shadow-[#00E5FF]/50" />

            <button
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/20 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-black text-white mb-2">
              Wait! Unlock <span className="text-[#00E5FF]">20% Off Professional Pro</span>
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Don&apos;t lose your learning momentum. Upgrade today using coupon code <strong className="text-amber-300 font-mono">LAUNCH2026</strong> for unlimited AI Mentoring, SQL/Python Labs, and ATS Resume scans.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/pricing"
                onClick={() => setShowExitIntent(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center justify-center gap-2"
              >
                Claim 20% Discount <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setShowExitIntent(false)}
                className="w-full sm:w-auto px-4 py-3 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
