'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Zap,
  Calendar,
  Clock,
  ShieldCheck,
  Download,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';
import { MembershipService, UserSubscription } from '@/lib/services/membershipService';
import { UsageTracker, MonthlyUsage } from '@/lib/services/usageTracker';
import { EntitlementService } from '@/lib/services/entitlementService';
import { BillingService, InvoiceItem } from '@/lib/services/billingService';
import { auth } from '@/lib/firebase/config';
import PlanBadge from '@/app/components/membership/PlanBadge';
import UpgradeModal from '@/app/components/membership/UpgradeModal';

export default function SubscriptionSettingsPage() {
  const [sub, setSub] = useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState<MonthlyUsage | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  useEffect(() => {
    const targetUid = auth.currentUser?.uid || 'demo-user';
    const s = MembershipService.getSubscription(targetUid);
    const u = UsageTracker.getUsage();
    setSub(s);
    setUsage(u);

    // Subscribe to real-time Firestore entitlement updates
    const unsubscribe = MembershipService.subscribeToSubscription(targetUid, (updatedSub) => {
      setSub(updatedSub);
    });

    // Load async billing history
    BillingService.fetchBillingHistory(targetUid).then((inv) => {
      setInvoices(inv);
    });

    return () => unsubscribe();
  }, []);

  if (!sub || !usage) {
    return (
      <div className="min-h-screen bg-[#05070B] text-white flex items-center justify-center">
        <div className="text-xs font-mono text-[#00E5FF]">Loading Subscription Details...</div>
      </div>
    );
  }

  const planDef = MembershipService.getPlanDefinition(sub.planId);

  const aiMentorPercent =
    planDef.limits.aiMentorQuota === -1
      ? 0
      : Math.min(100, Math.round((usage.aiMentorQueries / planDef.limits.aiMentorQuota) * 100));

  const simulatorPercent =
    planDef.limits.simulatorHours === -1
      ? 0
      : Math.min(100, Math.round((usage.simulatorHoursUsed / planDef.limits.simulatorHours) * 100));

  const resumePercent =
    planDef.limits.resumeBuilderQuota === -1
      ? 0
      : Math.min(100, Math.round((usage.resumeScans / planDef.limits.resumeBuilderQuota) * 100));

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      {/* Navigation */}
      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-3">
              <CreditCard className="w-7 h-7 text-[#00E5FF]" /> Subscription & Billing
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your AnalyticsRise membership tier, monitor live feature quotas, and download tax invoices.
            </p>
          </div>
          <button
            onClick={() => setIsUpgradeOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-black" /> Upgrade Membership
          </button>
        </div>

        {/* Grid Section 1: Active Subscription Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Plan Card */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-[#0D1117]/90 border border-[#00E5FF]/30 relative overflow-hidden shadow-xl shadow-[#00E5FF]/5 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-display font-black text-white">{planDef.name}</h3>
                  <PlanBadge planId={sub.planId} />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase">
                  {sub.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6">{planDef.tagline}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] uppercase text-slate-500 block">Billing Cycle</span>
                  <strong className="text-white capitalize">{sub.billingCycle}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] uppercase text-slate-500 block">Next Renewal</span>
                  <strong className="text-white">
                    {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                  </strong>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase text-slate-500 block">Auto-Renew</span>
                  <strong className={sub.cancelAtPeriodEnd ? 'text-rose-400' : 'text-emerald-400'}>
                    {sub.cancelAtPeriodEnd ? 'Off (Expiring)' : 'Active'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                href="/pricing"
                className="text-xs text-[#00E5FF] hover:underline font-bold flex items-center gap-1"
              >
                View All Tier Benefits <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              {sub.planId !== 'free' && (
                <button
                  onClick={() => {
                    MembershipService.cancelSubscription(sub.uid);
                    setSub(MembershipService.getSubscription(sub.uid));
                  }}
                  className="text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Cancel Plan
                </button>
              )}
            </div>
          </div>

          {/* Quick Support / Guarantee Box */}
          <div className="p-6 rounded-3xl bg-[#0D1117]/80 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Need Billing Help?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contact our support desk for invoice updates, VAT receipts, or enterprise seat management.
              </p>
            </div>
            <a
              href="mailto:support@analyticsrise.com"
              className="mt-6 w-full py-2.5 rounded-xl border border-white/15 text-slate-300 text-xs font-bold text-center hover:bg-white/5 transition-all block"
            >
              Contact Billing Desk
            </a>
          </div>
        </div>

        {/* Grid Section 2: Live Monthly Usage Meters */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00E5FF]" /> Live Monthly Usage Quotas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* AI Mentor Usage */}
            <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/10">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-300">AI Mentor Queries</span>
                <span className="font-mono text-slate-400">
                  {usage.aiMentorQueries} /{' '}
                  {planDef.limits.aiMentorQuota === -1 ? '∞' : planDef.limits.aiMentorQuota}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] transition-all"
                  style={{ width: `${aiMentorPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500">Resets on next billing cycle</span>
            </div>

            {/* Simulator Hours Usage */}
            <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/10">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-300">Simulator Hours</span>
                <span className="font-mono text-slate-400">
                  {usage.simulatorHoursUsed}h /{' '}
                  {planDef.limits.simulatorHours === -1 ? '∞' : `${planDef.limits.simulatorHours}h`}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div
                  className="h-full bg-cyan-400 transition-all"
                  style={{ width: `${simulatorPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500">Excel, SQL, & Python Labs</span>
            </div>

            {/* ATS Resume Scans Usage */}
            <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/10">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-300">ATS Resume Scans</span>
                <span className="font-mono text-slate-400">
                  {usage.resumeScans} /{' '}
                  {planDef.limits.resumeBuilderQuota === -1 ? '∞' : planDef.limits.resumeBuilderQuota}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div
                  className="h-full bg-purple-400 transition-all"
                  style={{ width: `${resumePercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500">Career Hub Resume Scanner</span>
            </div>
          </div>
        </div>

        {/* Grid Section 3: Billing History & Invoices */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00E5FF]" /> Invoice & Payment History
          </h3>

          <div className="rounded-2xl bg-[#0D1117] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4">Invoice ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-white">{inv.id}</td>
                      <td className="p-4 text-slate-400">{inv.date}</td>
                      <td className="p-4">{inv.planName}</td>
                      <td className="p-4 font-bold text-white">${inv.amountUsd}.00</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={inv.pdfUrl}
                          className="inline-flex items-center gap-1 text-[#00E5FF] hover:underline font-bold"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        currentPlan={sub.planId}
      />

      <LandingFooter />
    </div>
  );
}
