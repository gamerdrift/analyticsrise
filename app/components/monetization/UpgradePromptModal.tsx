'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UpgradeContext } from '@/lib/entitlements/types';
import { AnalyticsService } from '@/lib/services/analytics';
import { Sparkles, CheckCircle2, ArrowRight, X, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface UpgradePromptModalProps {
  isOpen: boolean;
  context: UpgradeContext | null;
  onClose: () => void;
  currency?: 'INR' | 'USD';
}

export default function UpgradePromptModal({
  isOpen,
  context,
  onClose,
  currency = 'USD',
}: UpgradePromptModalProps) {
  useEffect(() => {
    if (isOpen && context) {
      AnalyticsService.logUpgradePromptViewed(context.featureId, context.productId);
    }
  }, [isOpen, context]);

  if (!isOpen || !context) return null;

  const handleDismiss = () => {
    AnalyticsService.logUpgradePromptDismissed(context.featureId, context.productId);
    onClose();
  };

  const handleCtaClick = () => {
    AnalyticsService.logUpgradeInterest(context.featureId, context.recommendedPlan);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        {/* Modal Backdrop / Overlay click */}
        <div className="absolute inset-0" onClick={handleDismiss} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#0C101A] border border-[#00E5FF]/30 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Top Banner Accent */}
          <div className="h-1 bg-gradient-to-r from-[#00E5FF] via-[#4FC3F7] to-[#00E5FF]" />

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-mono font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3" />
              <span>{context.badge}</span>
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-2xl font-black font-display text-white uppercase tracking-tight mb-2">
              {context.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mb-6">
              {context.subtitle}
            </p>

            {/* Benefits Checklist */}
            {context.benefits && context.benefits.length > 0 && (
              <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl space-y-3 mb-6">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block tracking-wider">
                  What you unlock:
                </span>
                {context.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {benefit.title}
                      </span>
                      <span className="text-[11px] text-slate-400 block font-sans">
                        {benefit.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pricing Footnote & Value Guarantee */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-6 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Risk • Cancel Anytime</span>
              </div>
              <span className="text-[#00E5FF] font-bold">
                {currency === 'INR' ? '₹999/mo (Annual)' : '$19/mo (Annual)'}
              </span>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/pricing?product=${context.productId}&feature=${context.featureId}`}
                onClick={handleCtaClick}
                className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#4FC3F7] to-[#00E5FF] text-black font-mono font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] transition-all shadow-lg shadow-[#00E5FF]/20"
              >
                <span>{context.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs uppercase tracking-wider transition-colors text-center"
              >
                Continue Learning Free
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
