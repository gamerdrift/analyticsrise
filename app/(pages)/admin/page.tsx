'use client';

import React from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';

export default function AdminPanel() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Console Mode</span>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
          ADMIN SECURITY PANEL
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Review overall platform enrollment, simulator uptime, and certification validations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6">
          <span className="text-[10px] text-slate-500 font-mono uppercase block">Active Systems</span>
          <span className="text-2xl font-bold font-display text-white mt-2 block">100% OPERATIONAL</span>
        </div>
        <div className="glass-panel p-6">
          <span className="text-[10px] text-slate-500 font-mono uppercase block">Simulator Sessions</span>
          <span className="text-2xl font-bold font-display text-[#00E5FF] mt-2 block">1,402 ACTIVE</span>
        </div>
        <div className="glass-panel p-6">
          <span className="text-[10px] text-slate-500 font-mono uppercase block">Certs Issued</span>
          <span className="text-2xl font-bold font-display text-emerald-400 mt-2 block">4,289 VERIFIED</span>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-sm font-bold text-white font-display uppercase tracking-widest mb-4">Verification Logs</h3>
        <div className="font-mono text-xs text-slate-500 space-y-2">
          <div>[15:30:19] Auth Token verified for UID: guest_98a3b8c2d1</div>
          <div>[15:28:44] SQL Simulator pass validated for user Satoshi_Data</div>
          <div>[15:25:12] Backup cluster synchronization complete: latency 1.4ms</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
