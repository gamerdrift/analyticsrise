'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { LandingFooter } from '@/app/components/landing/LandingSections';
import {
  Sparkles,
  BarChart3,
  Bot,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  FileSpreadsheet,
  Download,
  Share2,
  HelpCircle,
  Play,
  TrendingUp,
} from 'lucide-react';

export default function ARStudioLandingPage() {
  const [activeTab, setActiveTab] = useState<'etl' | 'viz' | 'ai'>('viz');

  const faqs = [
    {
      q: 'What is AR Studio?',
      a: 'AR Studio is the flagship AI-powered Business Intelligence platform by AnalyticsRise. It allows users to upload raw tabular datasets (CSV, Excel, Parquet, JSON), generate instant automated dashboards, query data in natural language, and export executive-ready reports.',
    },
    {
      q: 'Is my data secure when uploading to AR Studio?',
      a: 'Yes. AR Studio uses client-side WebAssembly computation for data processing whenever possible. Your local files are processed in-browser or encrypted in transit with zero persistence on unsecured servers.',
    },
    {
      q: 'Can I export charts and dashboards?',
      a: 'Absolutely. AR Studio supports 1-click exports to high-res PNG, vector SVG, PDF executive decks, CSV transformed datasets, and live API endpoints.',
    },
    {
      q: 'Do I need prior SQL or coding experience?',
      a: 'No prior coding experience is required. AR Studio translates conversational English prompts into optimized analytics queries and visual charts automatically.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF] flex flex-col relative overflow-hidden">
      {/* Background Cyber Grids */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-25" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-[#05070B]/50 to-[#05070B] opacity-90" />

      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-24">
        {/* HERO SECTION */}
        <section className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00E5FF]/20 to-purple-500/20 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono font-bold tracking-widest uppercase shadow-lg shadow-[#00E5FF]/10">
            <Sparkles className="w-4 h-4 text-[#00E5FF] animate-pulse" /> Flagship BI Platform
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-white uppercase tracking-tight leading-[1.05]">
            THE FUTURE OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-purple-400 to-[#00E5FF]">
              AI BUSINESS INTELLIGENCE
            </span>
          </h1>

          <p className="text-base sm:text-xl font-mono text-[#00E5FF] tracking-wider uppercase font-bold">
            Upload. Analyze. Visualize. Understand.
          </p>

          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Eliminate traditional BI friction. AR Studio parses complex spreadsheets and databases, cleans anomaly records automatically, and generates interactive 3D visual dashboards through natural language.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/unified-workspace"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#4FC3F7] to-[#00E5FF] text-black font-mono font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all shadow-lg shadow-[#00E5FF]/20 flex items-center gap-2"
            >
              Launch AR Studio Workspace <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#preview"
              className="px-8 py-4 rounded-xl border border-white/20 text-white font-mono font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Watch Feature Preview
            </a>
          </div>
        </section>

        {/* DESIGN PREVIEW SHOWCASE */}
        <section id="preview" className="rounded-3xl bg-[#080C14] border border-[#00E5FF]/30 p-6 sm:p-10 shadow-2xl shadow-[#00E5FF]/10 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#00E5FF]" /> Interactive AR Studio Workspace Preview
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                [LIVE DESIGN PREVIEW] Real-time dataset processing and AI formula generation
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-2 bg-[#0D1424] p-1.5 rounded-xl border border-white/10 font-mono text-xs">
              <button
                onClick={() => setActiveTab('viz')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'viz' ? 'bg-[#00E5FF] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                1. Auto-Visualization
              </button>
              <button
                onClick={() => setActiveTab('etl')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'etl' ? 'bg-[#00E5FF] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                2. Automated ETL
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'ai' ? 'bg-[#00E5FF] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                3. AI Co-Pilot Query
              </button>
            </div>
          </div>

          {/* Interactive Screen Container */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-white/10 min-h-[380px] flex flex-col justify-between relative overflow-hidden">
            {activeTab === 'viz' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">ARR Growth Index</span>
                    <div className="text-2xl font-display font-black text-white">$142.8M</div>
                    <span className="text-[10px] font-mono text-emerald-400">+34.2% YoY</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Customer LTV</span>
                    <div className="text-2xl font-display font-black text-white">$18,450</div>
                    <span className="text-[10px] font-mono text-emerald-400">+12.8% YoY</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Forecast Accuracy</span>
                    <div className="text-2xl font-display font-black text-white">99.1%</div>
                    <span className="text-[10px] font-mono text-purple-400">AI Confidence</span>
                  </div>
                </div>

                <div className="h-44 flex items-end justify-between gap-3 pt-4 border-t border-white/10">
                  {[60, 85, 70, 95, 120, 140, 130, 160, 180].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-purple-600 via-[#00E5FF] to-[#00E5FF]"
                        style={{ height: `${val}px` }}
                      />
                      <span className="text-[9px] font-mono text-slate-500">Q{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'etl' && (
              <div className="space-y-4 font-mono text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> 148,250 records parsed in 180ms. Null values imputed automatically.
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="text-[#00E5FF] font-bold">[AUTOMATED ETL PIPELINE EXECUTION]</div>
                  <div>STEP 1: Schema Normalization &rarr; PASSED</div>
                  <div>STEP 2: Type Inference (Dates, Currency, Categoricals) &rarr; PASSED</div>
                  <div>STEP 3: Outlier & Anomaly Removal &rarr; 42 records flagged</div>
                  <div>STEP 4: WebAssembly Memory Cache &rarr; READY</div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-purple-300 font-bold">
                    <Bot className="w-4 h-4" /> User Prompt:
                  </div>
                  <p className="text-white text-sm">
                    &quot;Find the top 3 product lines driving highest gross margin and model next quarter forecast.&quot;
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[#00E5FF] font-bold">AI Analysis Result:</span>
                  <p className="text-slate-300 text-xs font-sans">
                    Cloud Subscriptions (78% margin), Enterprise Security Licenses (74% margin), and Data API Connectors (69% margin) represent 84% of total profit. Q4 projected growth is +18.4%.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Status: Ready for production deployment</span>
              <span className="text-[#00E5FF]">Client-Side WebAssembly Processing</span>
            </div>
          </div>
        </section>

        {/* CORE FEATURES GRID */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-wider">
              Engineered for <span className="text-[#00E5FF]">High-Performance Analytics</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Everything you need to turn raw data into executive clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#080C14] border border-white/10 space-y-4 hover:border-[#00E5FF]/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white uppercase">Automated ETL & Data Cleaning</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Automatically detect dirty data, missing columns, inconsistent date formats, and duplicates without writing complex scripts.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#080C14] border border-white/10 space-y-4 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white uppercase">Natural Language Queries</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Ask questions in plain English and let AR Studio translate your intent into optimized SQL and live interactive visual graphs.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#080C14] border border-white/10 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white uppercase">Holographic 3D Dashboards</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Build stunning executive dashboards with responsive layouts, smooth color palettes, dark-mode styling, and animated chart elements.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING PREVIEW */}
        <section className="p-10 rounded-3xl bg-[#080C14] border border-[#00E5FF]/30 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-400 text-sm">
              Start for free today. Upgrade as your analytics workflow scales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            <div className="p-6 rounded-2xl bg-[#0D1424] border border-white/10 space-y-4">
              <div className="text-xs font-mono font-bold text-[#00E5FF] uppercase">Starter</div>
              <div className="text-3xl font-display font-black text-white">$0 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
              <p className="text-xs text-slate-400">Perfect for individual analysts exploring AR Studio features.</p>
              <Link href="/unified-workspace" className="block text-center py-2.5 rounded-xl border border-white/20 text-white font-mono text-xs font-bold uppercase hover:bg-white/10">
                Start Free
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#00E5FF]/50 space-y-4 relative shadow-lg shadow-[#00E5FF]/10">
              <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#00E5FF] text-black text-[9px] font-mono font-bold uppercase">Popular</span>
              <div className="text-xs font-mono font-bold text-[#00E5FF] uppercase">Pro Studio</div>
              <div className="text-3xl font-display font-black text-white">$29 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
              <p className="text-xs text-slate-400">Unlimited data uploads, AI query engine, export tools, and priority processing.</p>
              <Link href="/pricing" className="block text-center py-2.5 rounded-xl bg-[#00E5FF] text-black font-mono text-xs font-bold uppercase hover:bg-[#4FC3F7]">
                Upgrade to Pro
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1424] border border-white/10 space-y-4">
              <div className="text-xs font-mono font-bold text-purple-400 uppercase">Enterprise</div>
              <div className="text-3xl font-display font-black text-white">Custom</div>
              <p className="text-xs text-slate-400">Dedicated VPC, SSO, custom database connectors, SOC-2, and SLA guarantees.</p>
              <Link href="/enterprise" className="block text-center py-2.5 rounded-xl border border-purple-500/40 text-purple-300 font-mono text-xs font-bold uppercase hover:bg-purple-500/10">
                Contact Enterprise
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="space-y-8 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase text-center tracking-wider">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#080C14] border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#00E5FF]" /> {faq.q}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* LAUNCH CTA */}
        <section className="p-12 rounded-3xl bg-gradient-to-r from-[#0D1424] via-[#080C14] to-[#0D1424] border border-[#00E5FF]/40 text-center space-y-6 shadow-2xl shadow-[#00E5FF]/20">
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-wider">
            Ready to Transform Your Analytics Workflow?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Experience the power of AR Studio today directly inside your browser. No download or setup required.
          </p>
          <Link
            href="/unified-workspace"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#00A3FF] text-black font-mono font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_40px_rgba(0,229,255,0.5)] transition-all shadow-xl shadow-[#00E5FF]/20"
          >
            Launch AR Studio Now <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
