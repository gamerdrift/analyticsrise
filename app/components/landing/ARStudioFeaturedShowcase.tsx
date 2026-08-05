'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  Cpu,
  Zap,
  ArrowRight,
  Database,
  LineChart,
  PieChart,
  Bot,
  Play,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Search,
} from 'lucide-react';

interface SampleDataset {
  id: string;
  name: string;
  rows: string;
  size: string;
  prompt: string;
  summary: string;
  metrics: { label: string; value: string; change: string; positive: boolean }[];
  chartType: 'area' | 'bar' | 'pie';
}

const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'sales',
    name: 'Global_Enterprise_Sales_2026.csv',
    rows: '148,250 rows',
    size: '14.2 MB',
    prompt: 'Analyze YoY ARR growth by region and detect high-churn risk accounts',
    summary: 'North America achieved 38% YoY growth driven by Cloud Enterprise plans. Identified 12 accounts needing immediate customer success outreach.',
    metrics: [
      { label: 'Total ARR', value: '$42.8M', change: '+28.4%', positive: true },
      { label: 'Net Retention', value: '118.2%', change: '+4.1%', positive: true },
      { label: 'Avg Deal Size', value: '$84,500', change: '+12.6%', positive: true },
      { label: 'Churn Risk', value: '3.1%', change: '-0.8%', positive: true },
    ],
    chartType: 'area',
  },
  {
    id: 'finance',
    name: 'Q3_Financial_Forecast_Model.xlsx',
    rows: '64,100 rows',
    size: '8.7 MB',
    prompt: 'Predict gross margin trends across Q3 and optimize OPEX allocation',
    summary: 'Gross Margin expanded to 74.2%. Reallocating R&D capital to AI infrastructure yields an estimated $2.4M additional quarterly profit.',
    metrics: [
      { label: 'Gross Margin', value: '74.2%', change: '+3.5%', positive: true },
      { label: 'OPEX Efficiency', value: '92.4/100', change: '+6.2%', positive: true },
      { label: 'Free Cash Flow', value: '$14.1M', change: '+19.8%', positive: true },
      { label: 'EBITDA Runrate', value: '$18.6M', change: '+15.2%', positive: true },
    ],
    chartType: 'bar',
  },
  {
    id: 'product',
    name: 'User_Engagement_Telemetry.parquet',
    rows: '1,250,000 events',
    size: '42.1 MB',
    prompt: 'Identify top conversion bottlenecks in onboarding funnels',
    summary: 'Step 3 (Database Connection Setup) accounts for 64% of drop-offs. Enabling 1-Click AI Auto-Connect increases activation by 41%.',
    metrics: [
      { label: 'Active Users', value: '342.9K', change: '+31.0%', positive: true },
      { label: 'Feature Adoption', value: '68.4%', change: '+14.2%', positive: true },
      { label: 'Funnel Dropoff', value: '12.3%', change: '-8.5%', positive: true },
      { label: 'NPS Score', value: '78', change: '+9 pts', positive: true },
    ],
    chartType: 'pie',
  },
];

export default function ARStudioFeaturedShowcase() {
  const [selectedDataset, setSelectedDataset] = useState<SampleDataset>(SAMPLE_DATASETS[0]);
  const [activePrompt, setActivePrompt] = useState(SAMPLE_DATASETS[0].prompt);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDatasetChange = (dataset: SampleDataset) => {
    setSelectedDataset(dataset);
    setActivePrompt(dataset.prompt);
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 500);
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 600);
  };

  return (
    <section className="relative py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#00E5FF]/15 via-purple-600/10 to-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Flagship Badge & Heading */}
      <div className="text-center space-y-4 mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00E5FF]/15 to-purple-500/15 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono font-bold tracking-widest uppercase shadow-lg shadow-[#00E5FF]/10">
          <Sparkles className="w-4 h-4 text-[#00E5FF] animate-pulse" /> Flagship Product Showcase
        </div>
        <h2 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight uppercase">
          AR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-purple-400 to-[#00E5FF]">STUDIO</span>
        </h2>
        <p className="text-lg sm:text-xl font-mono text-[#00E5FF]/90 font-medium tracking-wide">
          Upload. Analyze. Visualize. Understand.
        </p>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          The next-generation AI Business Intelligence platform. Transform complex datasets into actionable executive insights, holographic visual charts, and automated analytics in seconds.
        </p>
      </div>

      {/* Cinematic Showcase Card Interface */}
      <div className="relative rounded-3xl bg-[#080C14]/90 border border-[#00E5FF]/30 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,229,255,0.15)] overflow-hidden z-10">
        {/* Glow corner accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#00E5FF]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Top Control Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          {/* Dataset selector chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mr-2 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#00E5FF]" /> Dataset:
            </span>
            {SAMPLE_DATASETS.map((ds) => (
              <button
                key={ds.id}
                onClick={() => handleDatasetChange(ds)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                  selectedDataset.id === ds.id
                    ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50 shadow-md shadow-[#00E5FF]/20'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                {ds.name}
              </button>
            ))}
          </div>

          {/* Quick status pill */}
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI Engine Online</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">{selectedDataset.rows}</span>
          </div>
        </div>

        {/* AI Natural Language Query Bar */}
        <div className="my-8">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-[#00E5FF]">
              <Bot className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={activePrompt}
              onChange={(e) => setActivePrompt(e.target.value)}
              placeholder="Ask AR Studio anything about your data..."
              className="w-full pl-12 pr-36 py-4 rounded-2xl bg-[#0D1424] border border-[#00E5FF]/30 text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20 shadow-inner"
            />
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00A3FF] text-black font-mono font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-md shadow-[#00E5FF]/20 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black" /> Run Query
                </>
              )}
            </button>
          </div>
        </div>

        {/* Interactive Dashboard Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Key KPI Cards & AI Insight */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-4 rounded-2xl bg-[#0D1424] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" /> AI Executive Summary
                </span>
                <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/20">
                  Confidence 99.4%
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                {selectedDataset.summary}
              </p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 gap-3">
              {selectedDataset.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#0D1424] border border-white/10 hover:border-[#00E5FF]/30 transition-all group"
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    {m.label}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-display font-black text-white tracking-tight group-hover:text-[#00E5FF] transition-colors">
                      {m.value}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {m.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Visual Chart Preview */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0D1424] border border-white/10 flex flex-col justify-between relative overflow-hidden min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#00E5FF]" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                  Real-time Holographic Analytics Visualization
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">Auto-Cleaned</span>
                <span className="px-2 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">Predictive Mode</span>
              </div>
            </div>

            {/* Chart Graphic Representation */}
            <div className="flex-1 flex items-end justify-between gap-3 pt-6 pb-2 px-4 relative">
              {isAnalyzing && (
                <div className="absolute inset-0 bg-[#0D1424]/90 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="flex items-center gap-3 text-sm font-mono text-[#00E5FF]">
                    <Zap className="w-5 h-5 animate-spin" /> Synthesizing Data Vectors & Visual Graphs...
                  </div>
                </div>
              )}

              {/* Synthetic Visual Bars */}
              {[45, 62, 58, 75, 90, 84, 96, 110, 125, 140, 132, 160].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-purple-600/40 via-[#00E5FF]/70 to-[#00E5FF] transition-all duration-500 group-hover:brightness-125 group-hover:shadow-[0_0_15px_#00E5FF]"
                    style={{ height: `${(h / 160) * 180}px` }}
                  />
                  <span className="text-[9px] font-mono text-slate-500 group-hover:text-[#00E5FF]">
                    M{i + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom info strip */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Anomaly Detection Active
              </span>
              <span className="text-[#00E5FF]">Export ready: PDF, PNG, CSV, Live API</span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-white font-display font-bold text-base tracking-wider uppercase">
              Ready to Experience AR Studio?
            </h3>
            <p className="text-slate-400 text-xs font-sans">
              No software installation needed. Works directly in your browser with full local data privacy.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Link
              href="/ar-studio"
              className="flex-1 sm:flex-none px-8 py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#4FC3F7] to-[#00E5FF] text-black font-mono font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all text-center shadow-lg shadow-[#00E5FF]/20 flex items-center justify-center gap-2"
            >
              Explore AR Studio Features <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
