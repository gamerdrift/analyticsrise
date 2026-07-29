'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Gift, Save, CheckCircle2, ShieldCheck, Settings } from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';

export default function AdminReferralControlsPage() {
  const [rules, setRules] = useState({
    referrerXp: 250,
    refereeXp: 100,
    upgradeProDays: 14,
    maxReferralsPerUser: 50,
    active: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-5xl mx-auto w-full">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-widest mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Administrative Controls
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-3">
              <Gift className="w-7 h-7 text-emerald-400" /> Referral Program Incentives
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure XP bonus amounts, Pro trial reward days, and referral limits across the platform.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4 fill-black" /> Save Settings
          </button>
        </div>

        {saved && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Referral rules updated successfully! Changes reflect on the referral portal immediately.
          </div>
        )}

        <div className="p-8 rounded-3xl bg-[#0D1117] border border-white/10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                Referrer XP Bonus (Per Signup)
              </label>
              <input
                type="number"
                value={rules.referrerXp}
                onChange={(e) => setRules({ ...rules, referrerXp: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white font-mono font-bold text-xs focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                Referee Welcome XP Bonus
              </label>
              <input
                type="number"
                value={rules.refereeXp}
                onChange={(e) => setRules({ ...rules, refereeXp: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white font-mono font-bold text-xs focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                Pro Membership Reward Days (Per Paid Upgrade)
              </label>
              <input
                type="number"
                value={rules.upgradeProDays}
                onChange={(e) => setRules({ ...rules, upgradeProDays: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white font-mono font-bold text-xs focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                Max Referrals Allowed Per User
              </label>
              <input
                type="number"
                value={rules.maxReferralsPerUser}
                onChange={(e) => setRules({ ...rules, maxReferralsPerUser: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white font-mono font-bold text-xs focus:outline-none focus:border-[#00E5FF]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">Referral Program Status</span>
            <select
              value={rules.active ? 'active' : 'disabled'}
              onChange={(e) => setRules({ ...rules, active: e.target.value === 'active' })}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold focus:outline-none"
            >
              <option value="active">Active & Broadcasting</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
