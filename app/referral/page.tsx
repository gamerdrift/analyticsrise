'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Share2, Copy, Check, Gift, Sparkles, Users, Trophy, ArrowRight } from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';
import { ReferralService, ReferralStats } from '@/lib/services/referralService';

export default function ReferralPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setStats(ReferralService.getReferralStats());
  }, []);

  if (!stats) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(stats.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto w-full">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-widest mb-4">
            <Gift className="w-4 h-4 text-emerald-400" /> Share AnalyticsRise & Earn Rewards
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight">
            Refer Friends, Earn <span className="text-[#00E5FF]">Pro Membership</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-4 leading-relaxed">
            Invite fellow learners, classmates, and analytics professionals. Earn +250 XP for every sign-up, plus 14 days of Professional Pro for every upgrade!
          </p>
        </div>

        {/* Unique Link Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#00E5FF]/10 via-[#0D1117] to-[#0D1117] border-2 border-[#00E5FF] shadow-2xl shadow-[#00E5FF]/10 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-3">
              Your Unique Referral Link
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                readOnly
                value={stats.referralLink}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white font-mono text-xs font-bold focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
              <span>Code: <strong className="text-white font-mono">{stats.referralCode}</strong></span>
              <span>•</span>
              <span>Unlimited Invites Allowed</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Referrals</span>
            <div className="text-3xl font-display font-black text-white">{stats.totalReferred}</div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Pro Upgrades</span>
            <div className="text-3xl font-display font-black text-emerald-400">{stats.totalUpgraded}</div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">XP Earned</span>
            <div className="text-3xl font-display font-black text-[#00E5FF]">+{stats.xpEarned}</div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Pro Trial Earned</span>
            <div className="text-3xl font-display font-black text-amber-400">{stats.proTrialDaysEarned} Days</div>
          </div>
        </div>

        {/* Referral History Table */}
        <div className="rounded-3xl bg-[#0D1117] border border-white/10 p-6 sm:p-8">
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00E5FF]" /> Your Referral Activity
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-4">Referred User</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Reward Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {stats.referrals.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{r.referredUserEmailMasked}</td>
                    <td className="p-4 text-slate-400">{new Date(r.dateIso).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                          r.status === 'upgraded_pro'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {r.status === 'upgraded_pro' ? 'Upgraded Pro' : 'Free Member'}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-[#00E5FF] font-mono">{r.rewardEarned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
