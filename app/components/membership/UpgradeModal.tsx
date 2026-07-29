'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, ShieldCheck, Zap, Lock } from 'lucide-react';
import { PlanTier, MEMBERSHIP_PLANS } from '@/lib/config/plans';
import { BillingService } from '@/lib/services/billingService';
import PlanBadge from './PlanBadge';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: PlanTier;
  recommendedPlan?: PlanTier;
  targetFeature?: string;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  currentPlan = 'free',
  recommendedPlan = 'pro',
  targetFeature = 'Unlimited AI & Labs',
}: UpgradeModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = async (planId: PlanTier) => {
    setLoadingPlan(planId);
    try {
      const res = await BillingService.createCheckoutSession({
        planId,
        billingCycle,
      });
      window.location.href = res.checkoutUrl;
    } catch (e) {
      console.error('Failed checkout:', e);
      setLoadingPlan(null);
    }
  };

  const proPlan = MEMBERSHIP_PLANS.pro;
  const studentPlan = MEMBERSHIP_PLANS.student_pro;
  const enterprisePlan = MEMBERSHIP_PLANS.enterprise;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#05070B]/80 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0D1117]/95 border border-[#00E5FF]/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#00E5FF]/10 z-10 overflow-hidden"
        >
          {/* Top Neon Accent Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-2 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent rounded-full shadow-lg shadow-[#00E5FF]/50" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-black uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Unlock Premium Access
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Upgrade to <span className="text-[#00E5FF]">Professional Pro</span>
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Accelerate your analytics career with unlimited AI Mentoring, real business simulators, ATS resume optimization, and priority recruiter matching.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-2xl bg-slate-900 border border-white/10 mt-6">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#00E5FF] text-black shadow-md shadow-[#00E5FF]/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-[#00E5FF] text-black shadow-md shadow-[#00E5FF]/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual Billing
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase border border-emerald-500/30">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Pro */}
            <div className="p-6 rounded-2xl bg-[#161B22]/50 border border-white/10 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white uppercase">{studentPlan.name}</h3>
                  <PlanBadge planId="student_pro" />
                </div>
                <div className="text-2xl font-display font-black text-white mb-1">
                  ${billingCycle === 'annual' ? studentPlan.pricing.annualMonthlyEquivalentUsd : studentPlan.pricing.monthlyPriceUsd}
                  <span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-4">{studentPlan.tagline}</p>
                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  {studentPlan.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleSelectPlan('student_pro')}
                disabled={loadingPlan === 'student_pro'}
                className="w-full py-2.5 rounded-xl border border-cyan-500/40 text-cyan-400 text-xs font-bold tracking-wider uppercase hover:bg-cyan-500/10 transition-all cursor-pointer"
              >
                {loadingPlan === 'student_pro' ? 'Processing...' : 'Get Student Pro'}
              </button>
            </div>

            {/* Pro (Featured) */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#00E5FF]/10 via-[#161B22] to-[#161B22] border-2 border-[#00E5FF] flex flex-col justify-between relative shadow-xl shadow-[#00E5FF]/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#00E5FF] text-black text-[9px] font-black uppercase tracking-widest shadow-md">
                RECOMMENDED
              </div>
              <div>
                <div className="flex items-center justify-between mb-2 mt-2">
                  <h3 className="text-sm font-bold text-white uppercase">{proPlan.name}</h3>
                  <PlanBadge planId="pro" />
                </div>
                <div className="text-3xl font-display font-black text-white mb-1">
                  ${billingCycle === 'annual' ? proPlan.pricing.annualMonthlyEquivalentUsd : proPlan.pricing.monthlyPriceUsd}
                  <span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-4">{proPlan.tagline}</p>
                <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                  {proPlan.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                      <span className="font-medium">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleSelectPlan('pro')}
                disabled={loadingPlan === 'pro'}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-black" />
                {loadingPlan === 'pro' ? 'Redirecting to Checkout...' : 'Upgrade to Pro Now'}
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-2xl bg-[#161B22]/50 border border-white/10 flex flex-col justify-between hover:border-purple-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white uppercase">{enterprisePlan.name}</h3>
                  <PlanBadge planId="enterprise" />
                </div>
                <div className="text-2xl font-display font-black text-white mb-1">
                  ${billingCycle === 'annual' ? enterprisePlan.pricing.annualMonthlyEquivalentUsd : enterprisePlan.pricing.monthlyPriceUsd}
                  <span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-4">{enterprisePlan.tagline}</p>
                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  {enterprisePlan.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleSelectPlan('enterprise')}
                disabled={loadingPlan === 'enterprise'}
                className="w-full py-2.5 rounded-xl border border-purple-500/40 text-purple-300 text-xs font-bold tracking-wider uppercase hover:bg-purple-500/10 transition-all cursor-pointer"
              >
                {loadingPlan === 'enterprise' ? 'Processing...' : 'Contact Enterprise Sales'}
              </button>
            </div>
          </div>

          {/* Footer Security Badges */}
          <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-bit SSL Encrypted
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-[#00E5FF]" /> Cancel Anytime
              </span>
            </div>
            <div>7-Day Money Back Guarantee • Instant Activation</div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
