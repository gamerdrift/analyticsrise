'use client';

import React from 'react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import ExperienceCardsGrid from '@/app/components/landing/ExperienceCardsGrid';
import { Layers, Sparkles } from 'lucide-react';

export default function ProductsHubPage() {
  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF] flex flex-col relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-25" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-[#05070B]/50 to-[#05070B] opacity-90" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono font-bold tracking-widest uppercase">
            <Layers className="w-4 h-4" /> Full Product Suite
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black text-white uppercase tracking-tight">
            THE ANALYTICSRISE <span className="text-[#00E5FF]">ECOSYSTEM</span>
          </h1>

          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Discover our full line of AI Business Intelligence tools, interactive code sandboxes, career accelerator instruments, and community platforms.
          </p>
        </div>

        <ExperienceCardsGrid />
      </main>
    </div>
  );
}
