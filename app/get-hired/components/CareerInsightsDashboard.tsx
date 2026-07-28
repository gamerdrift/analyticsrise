'use client';

import React from 'react';
import { BarChart3, PieChart, Globe2, TrendingUp, DollarSign, Award } from 'lucide-react';

export default function CareerInsightsDashboard() {
  const jobsByCountry = [
    { country: 'United States', count: 6840, percentage: 48 },
    { country: 'United Kingdom', count: 2450, percentage: 17 },
    { country: 'India', count: 2120, percentage: 15 },
    { country: 'Germany / EU', count: 1540, percentage: 11 },
    { country: 'Canada / Other', count: 1330, percentage: 9 },
  ];

  const jobsBySkill = [
    { skill: 'SQL', demandScore: 98, avgSalary: '$135,000' },
    { skill: 'Excel Studio / Modeling', demandScore: 94, avgSalary: '$115,000' },
    { skill: 'Python / Pandas', demandScore: 92, avgSalary: '$140,000' },
    { skill: 'Power BI / DAX', demandScore: 89, avgSalary: '$125,000' },
    { skill: 'Tableau', demandScore: 86, avgSalary: '$120,000' },
    { skill: 'Snowflake / BigQuery', demandScore: 85, avgSalary: '$150,000' },
  ];

  const workTypeBreakdown = [
    { type: 'Remote (Worldwide / US)', percent: 45, color: '#00E5FF' },
    { type: 'Hybrid (2-3 Days Office)', percent: 38, color: '#10B981' },
    { type: 'Onsite / Headquarters', percent: 17, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold font-display text-white uppercase flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00E5FF]" /> Global Analytics Market Insights
          </h2>
          <p className="text-slate-400 text-xs">
            Real-time analytics hiring trends, salary benchmarks, and skill demand distributions.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-400 text-[10px]">
          Updated 2026 Q3 Data
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 1: Jobs by Country */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/90 space-y-4">
          <h3 className="text-xs font-bold font-display text-white uppercase flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#00E5FF]" /> Open Jobs by Country
          </h3>
          <div className="space-y-3">
            {jobsByCountry.map((item) => (
              <div key={item.country} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300">{item.country}</span>
                  <span className="text-[#00E5FF] font-bold">{item.count.toLocaleString()} jobs</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Highest Demand Skills & Salaries */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/90 space-y-4 md:col-span-2">
          <h3 className="text-xs font-bold font-display text-white uppercase flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Skill Demand & Salary Benchmarks
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {jobsBySkill.map((sk) => (
              <div key={sk.skill} className="p-3.5 rounded-xl border border-white/5 bg-[#05070B] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">{sk.skill}</span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                    <DollarSign className="w-3 h-3" /> {sk.avgSalary} Avg
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Demand Index</span>
                    <span>{sk.demandScore} / 100</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-[#00E5FF] rounded-full" style={{ width: `${sk.demandScore}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Work Type Distribution SVG Meter */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/90 space-y-4">
        <h3 className="text-xs font-bold font-display text-white uppercase flex items-center gap-2">
          <PieChart className="w-4 h-4 text-purple-400" /> Work Location Preference Breakdown
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden flex">
            {workTypeBreakdown.map((wt) => (
              <div
                key={wt.type}
                className="h-full transition-all"
                style={{ width: `${wt.percent}%`, backgroundColor: wt.color }}
                title={`${wt.type}: ${wt.percent}%`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6 flex-wrap text-[11px] pt-1">
          {workTypeBreakdown.map((wt) => (
            <div key={wt.type} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: wt.color }} />
              <span className="text-slate-300">{wt.type}:</span>
              <strong className="text-white">{wt.percent}%</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
