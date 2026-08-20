'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, FileSpreadsheet, LayoutGrid, Terminal, LineChart, Sparkles, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function FlagshipProductsSection() {
  const flagships = [
    {
      id: 'sql-studio',
      badge: 'FLAGSHIP • ACTIVE WORKBENCH',
      title: 'SQL Studio',
      subtitle: 'Relational Database & Query Mastery',
      description:
        'Learn SQL by writing real queries, solving interactive challenges, and verifying your results against real in-memory business databases.',
      pathway: 'Learn → Practice → Challenge → Progress',
      features: [
        'Interactive in-browser SQL workbench with zero local install',
        'Progressive challenge tiers from basic filters to complex multi-table joins',
        'Instant result comparison, execution benchmarks, and automated feedback',
        'Curated schemas: E-Commerce, SaaS Telemetry, Financial Ledger',
      ],
      icon: <Database className="w-7 h-7 text-[#00E5FF]" />,
      accentColor: '#00E5FF',
      gradient: 'from-[#00E5FF]/20 via-[#00E5FF]/5 to-transparent',
      borderColor: 'border-[#00E5FF]/40 hover:border-[#00E5FF]',
      shadow: 'hover:shadow-[0_0_35px_rgba(0,229,255,0.2)]',
      ctaHref: '/sql-studio',
      ctaLabel: 'Launch SQL Studio',
      isLive: true,
    },
    {
      id: 'excel-studio',
      badge: 'FLAGSHIP • ACTIVE WORKBENCH',
      title: 'Excel Studio Pro',
      subtitle: 'Spreadsheet Modeling & Business Analysis',
      description:
        'Build spreadsheet fluency through hands-on workbook exercises. Master formulas, pivot matrices, financial projections, and chart modeling.',
      pathway: 'Formulas → Aggregations → Pivot Tables → Forecasts',
      features: [
        'Full browser-native grid interface for instant formula calculation',
        'Hands-on practice with XLOOKUP, INDEX/MATCH, SUMIFS, and logic trees',
        'Real-world business case studies: CAC modeling, churn analysis, budgeting',
        'Dynamic chart rendering with interactive trend visualizations',
      ],
      icon: <FileSpreadsheet className="w-7 h-7 text-[#107C41]" />,
      accentColor: '#107C41',
      gradient: 'from-[#107C41]/20 via-[#107C41]/5 to-transparent',
      borderColor: 'border-[#107C41]/40 hover:border-[#107C41]',
      shadow: 'hover:shadow-[0_0_35px_rgba(16,124,65,0.2)]',
      ctaHref: '/excel-studio',
      ctaLabel: 'Launch Excel Studio',
      isLive: true,
    },
    {
      id: 'powerbi-studio',
      badge: 'FLAGSHIP • ACTIVE WORKBENCH',
      title: 'Power BI Studio',
      subtitle: 'Business Intelligence & Visual Reporting',
      description:
        'Learn how to turn raw operational data into interactive dashboards. Model star schemas, author DAX calculations, and craft executive reports.',
      pathway: 'Data Models → DAX Measures → Interactive Visuals',
      features: [
        'Star schema data topology and dimensional relationship builder',
        'DAX formula practice for custom metrics, YTD calculations, and margins',
        'Interactive cross-filtering dashboards, slicers, and executive KPI cards',
        'Enterprise scenario templates: Logistics, retail sales, SaaS operations',
      ],
      icon: <LayoutGrid className="w-7 h-7 text-[#F2C811]" />,
      accentColor: '#F2C811',
      gradient: 'from-[#F2C811]/20 via-[#F2C811]/5 to-transparent',
      borderColor: 'border-[#F2C811]/40 hover:border-[#F2C811]',
      shadow: 'hover:shadow-[0_0_35px_rgba(242,200,17,0.2)]',
      ctaHref: '/simulators/powerbi',
      ctaLabel: 'Launch Power BI Studio',
      isLive: true,
    },
  ];

  const comingSoon = [
    {
      title: 'Python Lab',
      category: 'Data Science & Automation',
      description: 'Pandas DataFrames, automated data cleaning pipelines, and introductory machine learning workflows.',
      icon: <Terminal className="w-5 h-5 text-[#3776AB]" />,
      status: 'Coming Soon',
    },
    {
      title: 'Tableau Studio',
      category: 'Advanced Visual Analytics',
      description: 'Level-of-Detail (LOD) calculations, custom parameter actions, and interactive storyboard presentations.',
      icon: <LineChart className="w-5 h-5 text-[#E97627]" />,
      status: 'Coming Soon',
    },
  ];

  return (
    <section id="flagships" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
      {/* Section Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF] mb-4 text-xs font-mono uppercase tracking-widest font-bold">
          <span>🔺 CORE PRACTICE ENVIRONMENTS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight uppercase mb-4">
          FLAGSHIP LEARNING <span className="text-[#00E5FF]">STUDIOS</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          Practice the three most in-demand data tools required by modern employers. Zero setup, zero installation — start practicing directly in your browser.
        </p>
      </div>

      {/* Flagship Product Cards Grid */}
      <div className="grid lg:grid-cols-3 gap-8 items-stretch mb-16">
        {flagships.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className={`rounded-2xl border ${product.borderColor} bg-[#0D1117]/80 backdrop-blur-md p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${product.shadow} group`}
          >
            {/* Top Gradient Banner */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${product.gradient}`} />

            <div>
              {/* Badge & Icon Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
                  {product.icon}
                </div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                  {product.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-2xl font-black text-white font-display uppercase tracking-wide mb-1 group-hover:text-[#00E5FF] transition-colors">
                {product.title}
              </h3>
              <p className="text-xs font-mono text-slate-400 font-semibold mb-4 uppercase tracking-wider">
                {product.subtitle}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-sans">
                {product.description}
              </p>

              {/* Learner Pathway Pill */}
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono text-[#00E5FF] mb-6 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="font-bold">{product.pathway}</span>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 mb-8 border-t border-white/5 pt-6">
                {product.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Launch Button CTA */}
            <Link
              href={product.ctaHref}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#4FC3F7] to-[#00E5FF] text-black font-mono font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all duration-300 text-center flex items-center justify-center gap-2 group/btn"
            >
              <span>{product.ctaLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Teaser Banner */}
      <div className="rounded-2xl border border-white/10 bg-[#080C14]/80 backdrop-blur-md p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
              <Clock className="w-4 h-4 text-[#4FC3F7]" />
              <span>EXPANDING CURRICULUM</span>
            </div>
            <h4 className="text-xl font-bold text-white font-display uppercase tracking-wide">
              More Ways To Rise Are Coming
            </h4>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Your data analytics journey doesn&apos;t stop at the core three. We are continuously adding specialized technical workbenches.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {comingSoon.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-white/5 bg-[#0D1117]/60 flex items-start gap-4"
            >
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h5 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                    {item.title}
                  </h5>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-amber-400 border border-amber-400/20">
                    {item.status}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#00E5FF] uppercase block mb-1">
                  {item.category}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
