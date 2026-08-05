'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import {
  Bot,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Zap,
  BarChart2,
  LineChart,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Send,
  Cpu,
} from 'lucide-react';

interface PromptDemo {
  question: string;
  category: string;
  response: string;
  metrics: { label: string; val: string }[];
}

const DEMOS: PromptDemo[] = [
  {
    category: 'Natural Language Analytics',
    question: 'What caused the revenue spike in March 2026?',
    response: 'The March 2026 revenue spike (+42.8% MoM) was primarily driven by the launch of the Enterprise Security Add-on, contributing $1.8M in net new ARR, alongside a 22% conversion increase from self-serve trialing teams.',
    metrics: [
      { label: 'MoM Growth', val: '+42.8%' },
      { label: 'Add-on ARR', val: '$1.8M' },
      { label: 'Trial Conv.', val: '+22.0%' },
    ],
  },
  {
    category: 'Future Forecasting',
    question: 'Predict Q4 customer churn under current adoption trends.',
    response: 'Based on time-series telemetry analysis, projected Q4 churn is estimated at 2.4% (Confidence Interval 95%: 2.1% - 2.7%). Proactive outreach to 18 flagged accounts can reduce churn further by 0.6%.',
    metrics: [
      { label: 'Projected Churn', val: '2.4%' },
      { label: 'Flagged Accounts', val: '18 accounts' },
      { label: 'Potential Savings', val: '$340K ARR' },
    ],
  },
  {
    category: 'Dashboard Assistance',
    question: 'Suggest the best chart layout for regional sales breakdown.',
    response: 'For regional sales breakdown across 12 territories, AR Assist recommends a stacked bar chart grouped by product category, paired with a choropleth geographical heatmap for immediate executive clarity.',
    metrics: [
      { label: 'Chart Type', val: 'Stacked Bar' },
      { label: 'Sub-dimension', val: 'Product Line' },
      { label: 'Map Layer', val: 'Choropleth' },
    ],
  },
];

export default function ARAssistLandingPage() {
  const [selectedDemo, setSelectedDemo] = useState<PromptDemo>(DEMOS[0]);
  const [customInput, setCustomInput] = useState('');

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans selection:bg-purple-500/20 selection:text-purple-400 flex flex-col relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-25" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none z-0" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-24">
        {/* HERO SECTION */}
        <section className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-400 text-xs font-mono font-bold tracking-widest uppercase shadow-lg shadow-purple-500/10">
            <Bot className="w-4 h-4 text-purple-400 animate-bounce" /> Your AI Analytics Co-Pilot
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-white uppercase tracking-tight leading-[1.05]">
            MEET <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-[#00E5FF]">AR ASSIST</span>
          </h1>

          <p className="text-base sm:text-xl font-mono text-purple-300 tracking-wider uppercase font-bold">
            Natural Language Analytics • Automated Data Explanations • Predictive Forecasting
          </p>

          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Never stare at blank spreadsheets or complex SQL errors again. AR Assist is your 24/7 AI analytics partner, translating natural language questions into instant data insights and chart visualizations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/career-copilot"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-mono font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-purple-500/20 flex items-center gap-2"
            >
              Start Chatting with AR Assist <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* INTERACTIVE DEMO TRIAL */}
        <section className="p-8 rounded-3xl bg-[#080C14] border border-purple-500/30 shadow-2xl shadow-purple-500/10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <h2 className="text-xl font-display font-bold text-white uppercase flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> Experience AR Assist in Action
              </h2>
              <p className="text-xs text-slate-400 font-mono">Select a natural language analytics query category below:</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {DEMOS.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDemo(d)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                    selectedDemo.category === d.category
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-md shadow-purple-500/20'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {d.category}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Console Window */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-white/10 space-y-6">
            {/* User Message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-white shrink-0">
                YOU
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-mono text-xs leading-relaxed max-w-2xl">
                {selectedDemo.question}
              </div>
            </div>

            {/* AI Assistant Message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="space-y-4 max-w-3xl">
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-100 font-sans text-xs leading-relaxed">
                  <div className="font-mono text-[10px] uppercase font-bold text-purple-400 mb-1 flex items-center gap-1.5">
                    <Zap className="w-3 h-3" /> AR Assist Insights:
                  </div>
                  {selectedDemo.response}
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-3">
                  {selectedDemo.metrics.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">{m.label}</span>
                      <span className="text-sm font-mono font-bold text-white">{m.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5 CORE PILLARS GRID */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-wider">
              5 Pillars of <span className="text-purple-400">AR Assist</span> Intelligence
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Supercharging data teams, business analysts, and executives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#080C14] border border-white/10 space-y-4 hover:border-purple-500/40 transition-all">
              <MessageSquare className="w-8 h-8 text-purple-400" />
              <h3 className="text-lg font-display font-bold text-white uppercase">1. Natural Language Analytics</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Query enterprise databases in plain language without knowing complex SQL JOIN syntax or DAX formulas.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#080C14] border border-white/10 space-y-4 hover:border-indigo-500/40 transition-all">
              <BarChart2 className="w-8 h-8 text-indigo-400" />
              <h3 className="text-lg font-display font-bold text-white uppercase">2. Dashboard Assistance</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Receive intelligent design recommendations for charts, colors, layout structures, and executive summary cards.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#080C14] border border-white/10 space-y-4 hover:border-blue-500/40 transition-all">
              <Lightbulb className="w-8 h-8 text-blue-400" />
              <h3 className="text-lg font-display font-bold text-white uppercase">3. Data Explanations</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Instant textual summaries explaining sudden metrics anomalies, revenue drops, or churn spikes in seconds.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#080C14] border border-white/10 space-y-4 hover:border-emerald-500/40 transition-all">
              <Sparkles className="w-8 h-8 text-emerald-400" />
              <h3 className="text-lg font-display font-bold text-white uppercase">4. AI Recommendations</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Proactive suggestions on data cleaning opportunities, index optimizations, and high-ROI business strategies.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#080C14] border border-white/10 space-y-4 hover:border-amber-500/40 transition-all">
              <LineChart className="w-8 h-8 text-amber-400" />
              <h3 className="text-lg font-display font-bold text-white uppercase">5. Future Forecasting</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Predictive machine learning models forecasting ARR growth, inventory demand, and retention trends.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
