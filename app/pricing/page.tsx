'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, ShieldCheck, Zap, HelpCircle, ChevronDown, Building2, Briefcase, ChevronRight } from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';
import { MEMBERSHIP_PLANS, PlanTier } from '@/lib/config/plans';
import { RECRUITER_PLANS } from '@/lib/config/recruiterPlans';
import { ENTERPRISE_PLANS } from '@/lib/config/enterprisePlans';
import PlanBadge from '@/app/components/membership/PlanBadge';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeTab, setActiveTab] = useState<'learners' | 'recruiters' | 'enterprise'>('learners');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can I cancel or switch my plan at any time?',
      a: 'Yes! You can upgrade, downgrade, or cancel your subscription at any time from your account settings. When canceling, you maintain full access until the end of your current billing period.',
    },
    {
      q: 'How does the 20% annual discount work?',
      a: 'When you choose Annual Billing, you pay upfront for 12 months at a 20% reduced rate compared to paying monthly.',
    },
    {
      q: 'Do Student Pro subscriptions require student verification?',
      a: 'Yes. Student Pro pricing is exclusively available to accredited university and college students. You will be prompted to verify your student email (.edu or accredited domain) during checkout.',
    },
    {
      q: 'What are practice simulator limits on the Free plan?',
      a: 'Free plans include 5 simulator practice hours per month across Excel Studio, SQL Lab, and Python Lab, plus 15 AI Mentor queries. Professional Pro offers unlimited hours and queries.',
    },
    {
      q: 'Can employers integrate AnalyticsRise with Greenhouse or Lever ATS?',
      a: 'Yes! Recruiter Business and Enterprise plans include direct API integration with major applicant tracking systems like Greenhouse, Lever, Workday, and Ashby.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF] flex flex-col relative overflow-hidden">
      {/* Background Cyber-Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-[#05070B]/50 to-[#05070B] opacity-90" />

      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Header */}
      <main className="flex-1 relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" /> Transparent Enterprise Pricing
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight">
            Invest in Your <span className="text-[#00E5FF]">Analytics Future</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
            Choose the perfect plan for your goals. From beginner practice labs to enterprise workforce training and global recruiter sourcing.
          </p>

          {/* Category Tabs (Learners / Recruiters / Enterprise) */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab('learners')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'learners'
                  ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              Learners & Professionals
            </button>
            <button
              onClick={() => setActiveTab('recruiters')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'recruiters'
                  ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              Recruiters & Employers
            </button>
            <button
              onClick={() => setActiveTab('enterprise')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'enterprise'
                  ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              Corporate & Teams
            </button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-2xl bg-slate-900 border border-white/10 mt-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white border border-white/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-[#00E5FF] text-black shadow-md shadow-[#00E5FF]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual Billing
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase border border-emerald-500/30">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: LEARNERS & PROFESSIONALS */}
        {activeTab === 'learners' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            {/* Free Tier */}
            <div className="p-6 rounded-3xl bg-[#0D1117]/80 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white uppercase">{MEMBERSHIP_PLANS.free.name}</h3>
                  <PlanBadge planId="free" />
                </div>
                <div className="text-3xl font-display font-black text-white mb-1">$0</div>
                <p className="text-xs text-slate-400 mb-6">{MEMBERSHIP_PLANS.free.tagline}</p>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  {MEMBERSHIP_PLANS.free.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full py-3 rounded-xl border border-white/20 text-white text-xs font-bold tracking-wider uppercase text-center hover:bg-white/5 transition-all"
              >
                Get Started Free
              </Link>
            </div>

            {/* Student Pro */}
            <div className="p-6 rounded-3xl bg-[#0D1117]/80 border border-cyan-500/30 flex flex-col justify-between hover:border-cyan-500/60 transition-all relative">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white uppercase">{MEMBERSHIP_PLANS.student_pro.name}</h3>
                  <PlanBadge planId="student_pro" />
                </div>
                <div className="text-3xl font-display font-black text-white mb-1">
                  ${billingCycle === 'annual' ? MEMBERSHIP_PLANS.student_pro.pricing.annualMonthlyEquivalentUsd : MEMBERSHIP_PLANS.student_pro.pricing.monthlyPriceUsd}
                  <span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">{MEMBERSHIP_PLANS.student_pro.tagline}</p>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  {MEMBERSHIP_PLANS.student_pro.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/register?plan=student_pro"
                className="w-full py-3 rounded-xl border border-cyan-500/50 text-cyan-400 text-xs font-bold tracking-wider uppercase text-center hover:bg-cyan-500/10 transition-all"
              >
                Enroll Student Pro
              </Link>
            </div>

            {/* Professional Pro (Featured) */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#00E5FF]/10 via-[#0D1117] to-[#0D1117] border-2 border-[#00E5FF] flex flex-col justify-between relative shadow-2xl shadow-[#00E5FF]/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#00E5FF] text-black text-[10px] font-black uppercase tracking-widest shadow-md">
                MOST POPULAR
              </div>
              <div>
                <div className="flex items-center justify-between mb-2 mt-2">
                  <h3 className="text-base font-bold text-white uppercase">{MEMBERSHIP_PLANS.pro.name}</h3>
                  <PlanBadge planId="pro" />
                </div>
                <div className="text-4xl font-display font-black text-white mb-1">
                  ${billingCycle === 'annual' ? MEMBERSHIP_PLANS.pro.pricing.annualMonthlyEquivalentUsd : MEMBERSHIP_PLANS.pro.pricing.monthlyPriceUsd}
                  <span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">{MEMBERSHIP_PLANS.pro.tagline}</p>
                <ul className="space-y-3 text-xs text-slate-200 mb-8">
                  {MEMBERSHIP_PLANS.pro.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                      <span className="font-medium">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/register?plan=pro"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black tracking-wider uppercase text-center hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-black" /> Get Professional Pro
              </Link>
            </div>

            {/* Enterprise Workforce */}
            <div className="p-6 rounded-3xl bg-[#0D1117]/80 border border-purple-500/30 flex flex-col justify-between hover:border-purple-500/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white uppercase">{MEMBERSHIP_PLANS.enterprise.name}</h3>
                  <PlanBadge planId="enterprise" />
                </div>
                <div className="text-3xl font-display font-black text-white mb-1">Custom</div>
                <p className="text-xs text-slate-400 mb-6">{MEMBERSHIP_PLANS.enterprise.tagline}</p>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  {MEMBERSHIP_PLANS.enterprise.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/contact?type=enterprise"
                className="w-full py-3 rounded-xl border border-purple-500/50 text-purple-300 text-xs font-bold tracking-wider uppercase text-center hover:bg-purple-500/10 transition-all"
              >
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: RECRUITERS & EMPLOYERS */}
        {activeTab === 'recruiters' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {Object.values(RECRUITER_PLANS).map((p) => (
              <div
                key={p.id}
                className="p-8 rounded-3xl bg-[#0D1117]/90 border border-amber-500/30 flex flex-col justify-between hover:border-amber-500/60 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white uppercase">{p.name}</h3>
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      RECRUITER
                    </span>
                  </div>
                  <div className="text-4xl font-display font-black text-white mb-2">
                    ${billingCycle === 'annual' ? Math.round(p.annualPriceUsd / 12) : p.monthlyPriceUsd}
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-300 my-6">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/recruiter?plan=${p.id}`}
                  className="w-full py-3.5 rounded-xl bg-amber-500 text-black text-xs font-black tracking-wider uppercase text-center hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
                >
                  Start Recruiter Trial
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: CORPORATE & TEAMS */}
        {activeTab === 'enterprise' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {Object.values(ENTERPRISE_PLANS).map((p) => (
              <div
                key={p.id}
                className="p-8 rounded-3xl bg-[#0D1117]/90 border border-purple-500/30 flex flex-col justify-between hover:border-purple-500/60 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white uppercase">{p.name}</h3>
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      TEAM PACK
                    </span>
                  </div>
                  <div className="text-3xl font-display font-black text-white mb-1">
                    ${billingCycle === 'annual' ? p.pricePerSeatAnnualUsd : p.pricePerSeatMonthlyUsd}
                    <span className="text-xs font-normal text-slate-400">/seat/mo</span>
                  </div>
                  <p className="text-xs text-purple-300 mb-4">
                    Seats: {p.minSeats} - {p.maxSeats === 10000 ? 'Unlimited' : p.maxSeats}
                  </p>
                  <ul className="space-y-3 text-xs text-slate-300 mb-6">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/contact?type=team"
                  className="w-full py-3.5 rounded-xl border border-purple-500/50 text-purple-300 text-xs font-bold tracking-wider uppercase text-center hover:bg-purple-500/10 transition-all"
                >
                  Request Team Quote
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#00E5FF]" /> Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-400 mt-2">Everything you need to know about AnalyticsRise subscriptions and billing.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#0D1117] border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white hover:text-[#00E5FF] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-[#00E5FF]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
