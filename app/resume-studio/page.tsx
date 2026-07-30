'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Download,
  Copy,
  RefreshCw,
  Sliders,
  TrendingUp,
  FileSearch,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';
import { ResumeService } from '@/lib/services/resumeService';

export default function AIResumeStudioPage() {
  const [resumeText, setResumeText] = useState(
    `ALEX RIVERA
Data Analyst | SQL & Power BI Specialist
alex.rivera@example.com | github.com/alex-rivera

EXPERIENCE:
Data Analyst Intern - TechCorp (2025 - Present)
- Executed SQL queries to pull customer transaction data.
- Built Power BI dashboards for weekly sales meetings.
- Used Excel VLOOKUP to reconcile monthly invoices.

EDUCATION:
B.S. Information Systems - State University (2025)`
  );

  const [score, setScore] = useState(85);
  const [template, setTemplate] = useState<'modern' | 'executive' | 'minimal'>('modern');
  const [improvedBullets, setImprovedBullets] = useState<string[]>([
    'Architected PostgreSQL window function queries (LEAD, LAG, DENSE_RANK) processing 150K+ daily customer transactions, reducing reporting latency by 35%.',
    'Designed 12 interactive Power BI DAX dashboards adopted by senior executives for weekly revenue modeling across 4 business units.',
    'Formulated automated Excel INDEX/MATCH & XLOOKUP financial reconciliation models, processing $2.5M in monthly invoices with 99.8% precision.',
  ]);

  const handleImprove = () => {
    setScore((prev) => Math.min(98, prev + 5));
  };

  const handleExportPdf = () => {
    window.print();
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-widest mb-2">
              <FileText className="w-3.5 h-3.5" /> ENTERPRISE RESUME STUDIO v2.0
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
              AI Resume Studio & ATS Screener Optimizer
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Transform raw resume bullets into high-impact, quantified ATS keywords optimized for senior analytics recruiters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPdf}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black text-xs font-black tracking-wider uppercase hover:shadow-lg hover:shadow-[#00E5FF]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export PDF / Print
            </button>
          </div>
        </div>

        {/* ATS Score & Template Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-[#00E5FF]/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">ATS Optimization Score</span>
              <div className="text-3xl font-display font-black text-[#00E5FF] font-mono">{score} / 100</div>
              <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Passed Automated Screeners</span>
            </div>
            <button
              onClick={handleImprove}
              className="px-3.5 py-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-bold border border-[#00E5FF]/30 hover:bg-[#00E5FF]/20 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Auto-Improve
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 block">Select Layout Template</label>
            <div className="grid grid-cols-3 gap-2">
              {(['modern', 'executive', 'minimal'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`py-2 text-[10px] font-black uppercase rounded-xl border transition-all cursor-pointer ${
                    template === t
                      ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Industry Comparison</span>
              <strong className="text-sm font-bold text-white block">Top 10% Senior Data Analyst Profile</strong>
              <p className="text-[11px] text-slate-400 mt-1">High keyword density for SQL, Power BI DAX, and Pandas.</p>
            </div>
          </div>
        </div>

        {/* Editor & AI Bullet Improver Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Raw Text Editor */}
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00E5FF]" /> Resume Raw Text Editor
            </h3>
            <textarea
              rows={14}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          {/* AI Bullet Improvement Output */}
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Quantified Bullet Improvements
            </h3>

            <div className="space-y-3 text-xs">
              {improvedBullets.map((b, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold">
                    <span>SUGGESTED BULLET #{idx + 1}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(b)}
                      className="hover:underline flex items-center gap-1 cursor-pointer text-slate-300"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-sans">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
