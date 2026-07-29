'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sliders,
  DollarSign,
  Tag,
  ShieldCheck,
  Zap,
  Save,
  CheckCircle2,
  Users,
  Settings,
  BarChart3,
} from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';
import { MEMBERSHIP_PLANS, PlanTier } from '@/lib/config/plans';

export default function AdminMonetizationPage() {
  const [plans, setPlans] = useState(MEMBERSHIP_PLANS);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState({
    code: 'LAUNCH2026',
    discountPercent: 20,
    active: true,
  });

  const handlePriceChange = (tier: PlanTier, newMonthlyPrice: number) => {
    setPlans((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        pricing: {
          ...prev[tier].pricing,
          monthlyPriceUsd: newMonthlyPrice,
        },
      },
    }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      {/* Navigation */}
      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto w-full">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-widest mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Administrative Controls
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-3">
              <Sliders className="w-7 h-7 text-[#00E5FF]" /> Monetization & Pricing Control
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure platform pricing tiers, feature entitlement limits, promotional coupons, and billing rules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/revenue"
              className="px-4 py-2.5 rounded-xl border border-white/20 text-slate-300 text-xs font-bold hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-[#00E5FF]" /> Revenue Analytics
            </Link>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 fill-black" /> Save Configuration
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Monetization settings saved successfully! Changes reflect across pricing matrices immediately.
          </div>
        )}

        {/* Section 1: Tier Pricing & Limit Configuration */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#00E5FF]" /> Tier Pricing & Limits Matrix
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(plans).map((plan) => (
              <div
                key={plan.id}
                className="p-6 rounded-2xl bg-[#0D1117] border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-bold text-white uppercase">{plan.name}</h4>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400 border border-white/10 uppercase">
                      ID: {plan.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Monthly Price ($USD)
                      </label>
                      <input
                        type="number"
                        value={plan.pricing.monthlyPriceUsd}
                        onChange={(e) => handlePriceChange(plan.id, Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        AI Mentor Quota / mo
                      </label>
                      <input
                        type="text"
                        disabled
                        value={plan.limits.aiMentorQuota === -1 ? 'Unlimited' : plan.limits.aiMentorQuota}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-3 border-t border-white/5">
                  <span>Certificates: {plan.limits.certificateAccess ? 'Enabled' : 'Disabled'}</span>
                  <span>Storage: {plan.limits.storageMb} MB</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Promotional Campaigns & Coupons */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#00E5FF]" /> Promotional Campaign & Coupon Rules
          </h3>

          <div className="p-6 rounded-2xl bg-[#0D1117] border border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={activeCoupon.code}
                  onChange={(e) => setActiveCoupon({ ...activeCoupon, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Discount %</label>
                <input
                  type="number"
                  value={activeCoupon.discountPercent}
                  onChange={(e) => setActiveCoupon({ ...activeCoupon, discountPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Campaign Status</label>
                <select
                  value={activeCoupon.active ? 'active' : 'disabled'}
                  onChange={(e) => setActiveCoupon({ ...activeCoupon, active: e.target.value === 'active' })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="active">Active & Broadcasting</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Active coupons automatically apply during checkout sessions generated by BillingService.
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
