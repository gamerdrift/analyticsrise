'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  Clock,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';
import { ObservabilityService } from '@/lib/services/observabilityService';

export default function AdminObservabilityDashboardPage() {
  const [telemetry, setTelemetry] = useState(ObservabilityService.getHealthTelemetry());

  const handleRefresh = () => {
    setTelemetry(ObservabilityService.getHealthTelemetry());
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-2">
              <Activity className="w-3.5 h-3.5" /> ENTERPRISE OBSERVABILITY & DIAGNOSTICS
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
              Platform Health & Telemetry Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time API gateway health, AI inference response times, error trace logs, and build status diagnostics.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 rounded-xl border border-white/20 text-slate-300 text-xs font-bold hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#00E5FF]" /> Refresh Diagnostics
          </button>
        </div>

        {/* Top Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <div className="p-5 rounded-2xl bg-[#0D1117] border border-emerald-500/30">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">API Health Gateway</span>
            <div className="text-xl font-black text-emerald-400 uppercase flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {telemetry.apiStatus}
            </div>
            <span className="text-[9px] text-slate-500 block mt-1">Uptime: {telemetry.uptimePercentage}</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1117] border border-[#00E5FF]/30">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">AI Inference Latency</span>
            <div className="text-xl font-black text-[#00E5FF]">{telemetry.aiResponseTimeMs} ms</div>
            <span className="text-[9px] text-slate-500 block mt-1">Gemini / OpenAI Cluster</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1117] border border-amber-500/30">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Failed Requests (24h)</span>
            <div className="text-xl font-black text-amber-400">{telemetry.failedRequestsPercentage}</div>
            <span className="text-[9px] text-slate-500 block mt-1">Errors: {telemetry.errorLogCount24h}</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1117] border border-purple-500/30">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Active User Sessions</span>
            <div className="text-xl font-black text-purple-300">{telemetry.activeSessionsCount.toLocaleString()}</div>
            <span className="text-[9px] text-slate-500 block mt-1">Build: {telemetry.buildStatus.toUpperCase()}</span>
          </div>
        </div>

        {/* Microservices Log Stream */}
        <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-[#00E5FF]" /> Live Gateway Service Diagnostics Log
          </h3>

          <div className="p-4 rounded-2xl bg-[#05070B] border border-white/5 font-mono text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-emerald-400">
              <span>[2026-07-30T05:35:10.124Z] [SYS_OK] Auth Provider Firebase Initialized</span>
              <span>200 OK</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-emerald-400">
              <span>[2026-07-30T05:35:12.450Z] [SYS_OK] AI Copilot Inference Engine Warm</span>
              <span>200 OK</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#00E5FF]">
              <span>[2026-07-30T05:35:14.890Z] [SYS_OK] Firebase Hosting Bundle Certified</span>
              <span>200 OK</span>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
