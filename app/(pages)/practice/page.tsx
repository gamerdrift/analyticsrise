'use client';

import React from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import Link from 'next/link';

const LABS = [
  {
    id: 'lab-mrr',
    title: 'SaaS MRR Churn Analysis',
    tool: 'SQL',
    difficulty: 'Hard',
    xp: 600,
    status: 'Ready',
    desc: 'Plot monthly recurring revenue growth rates and find exact churn points using window functions.',
    link: '/simulators/sql'
  },
  {
    id: 'lab-growth',
    title: 'Quarterly Revenue Growth Model',
    tool: 'Excel',
    difficulty: 'Medium',
    xp: 400,
    status: 'In Progress',
    desc: 'Verify quarterly revenue growth percentages, subtract operating cost variables, and plot forecasting charts.',
    link: '/simulators/excel'
  },
  {
    id: 'lab-pbi',
    title: 'Executive Sales attribution KPI Card',
    tool: 'Power BI',
    difficulty: 'Advanced',
    xp: 500,
    status: 'Ready',
    desc: 'Load digital retail transaction records, map categories to charts, and construct revenue gauges.',
    link: '/simulators/powerbi'
  }
];

export default function PracticeLabs() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Sandboxes</span>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
          INTERACTIVE PRACTICE LABS
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Run realistic analytics case studies in isolated tool sandboxes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LABS.map((lab) => (
          <div key={lab.id} className="glass-panel p-6 flex flex-col justify-between h-60">
            <div>
              <div className="flex justify-between items-start mb-3 font-mono text-[9px]">
                <span className="px-2 py-0.5 bg-white/5 rounded border border-white/5 text-[#00E5FF] uppercase">
                  {lab.tool}
                </span>
                <span className="text-slate-500">{lab.difficulty}</span>
              </div>

              <h3 className="text-md font-bold text-white font-display uppercase tracking-wide">
                {lab.title}
              </h3>
              
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                {lab.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-mono">Award: {lab.xp} XP</span>
              <Link href={lab.link} className="px-4 py-2 cyber-button text-[9px] font-bold tracking-widest uppercase">
                LOAD LAB
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
