'use client';

import React from 'react';
import Link from 'next/link';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LayoutGrid, Download, ExternalLink, Sparkles } from 'lucide-react';

export default function DashboardGalleryPage() {
  const templates = [
    { title: 'Executive SaaS Metric Console', category: 'Finance & SaaS', color: 'from-[#00E5FF]/20 to-purple-600/20' },
    { title: 'Global E-Commerce Revenue Heatmap', category: 'Sales & Marketing', color: 'from-pink-500/20 to-rose-600/20' },
    { title: 'Customer Retention & Cohort Churn Matrix', category: 'Product Analytics', color: 'from-emerald-500/20 to-teal-600/20' },
    { title: 'HR Workforce Headcount & Attrition Model', category: 'Human Resources', color: 'from-amber-500/20 to-orange-600/20' },
  ];

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans selection:bg-pink-500/20 selection:text-pink-400 flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-25" />
      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/40 text-pink-400 text-xs font-mono font-bold tracking-widest uppercase">
            <LayoutGrid className="w-4 h-4" /> Template Gallery
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black text-white uppercase tracking-tight">
            EXPLORE BEAUTIFUL <span className="text-pink-400">DASHBOARDS</span>
          </h1>

          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Production-ready BI dashboard templates built for Power BI, Tableau, Excel, and AR Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {templates.map((t, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-[#080C14] border border-white/10 space-y-4 hover:border-pink-400/40 transition-all group">
              <div className={`h-48 rounded-2xl bg-gradient-to-br ${t.color} border border-white/10 flex items-center justify-center p-6 text-center`}>
                <span className="text-xs font-mono font-bold text-white uppercase group-hover:scale-105 transition-transform">{t.title}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">{t.category}</span>
                <Link href="/ar-studio" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-pink-400 hover:text-pink-300">
                  Open Template <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
