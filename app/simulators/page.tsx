'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, FileSpreadsheet, Database, BarChart3, PieChart, ArrowRight, Sparkles } from 'lucide-react';

export default function SimulatorsHubPage() {
  const simulators = [
    {
      title: 'Excel Studio Pro',
      desc: 'In-browser interactive spreadsheet engine with VLOOKUP, INDEX-MATCH, XLOOKUP, Pivot Tables, and dynamic formula evaluation.',
      href: '/excel-studio',
      icon: FileSpreadsheet,
      color: 'text-emerald-400',
      badge: 'Interactive Engine',
    },
    {
      title: 'SQL Studio',
      desc: 'Execute real ANSI SQL queries against in-memory SQLite database datasets with instant query syntax validation.',
      href: '/sql-studio',
      icon: Database,
      color: 'text-cyan-400',
      badge: 'Live Database',
    },
    {
      title: 'Power BI Simulator',
      desc: 'Build interactive reports, DAX measure calculation logic, and business dashboards right in your browser.',
      href: '/simulators/powerbi',
      icon: BarChart3,
      color: 'text-amber-400',
      badge: 'DAX & BI',
    },
    {
      title: 'Tableau Studio',
      desc: 'Drag-and-drop calculated fields, worksheet parameters, and enterprise chart visualizations.',
      href: '/tableau-studio',
      icon: PieChart,
      color: 'text-purple-400',
      badge: 'Visual Analytics',
    },
  ];

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-mono font-bold tracking-widest uppercase">
            <Cpu className="w-4 h-4" /> Browser-Native Software Suite
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-wider uppercase">
            Enterprise <span className="text-[#00E5FF]">Software Simulators</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Practice data analytics tools without downloading or setting up local software. Write formulas, run queries, and build dashboards directly in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {simulators.map((sim, i) => {
            const Icon = sim.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-2xl bg-[#0D1117] border border-white/10 space-y-6 hover:border-[#00E5FF]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-white/5 ${sim.color}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-[10px] font-mono font-bold uppercase tracking-widest">
                      {sim.badge}
                    </span>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wide">
                    {sim.title}
                  </h2>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {sim.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <Link
                    href={sim.href}
                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#00E5FF] hover:text-black transition-all"
                  >
                    Launch Simulator <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
