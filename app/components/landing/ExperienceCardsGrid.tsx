'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Bot,
  GraduationCap,
  FileCode2,
  Database,
  Table,
  LayoutGrid,
  Users,
  BookOpen,
  Building2,
  Newspaper,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export interface ExperienceCard {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  ctaText: string;
  icon: React.ReactNode;
  gradient: string;
  borderGlow: string;
  accentColor: string;
  tag: string;
  artPattern: 'studio' | 'assist' | 'academy' | 'resume' | 'sql' | 'excel' | 'gallery' | 'community' | 'book' | 'enterprise' | 'blog';
}

const CARDS: ExperienceCard[] = [
  {
    id: 'ar-studio',
    badge: 'FLAGSHIP PRODUCT',
    title: 'AR Studio',
    subtitle: 'AI Powered Business Intelligence Platform',
    description: 'Transform complex business datasets into automated interactive dashboards, holographic chart visualizations, and instant executive reports.',
    href: '/ar-studio',
    ctaText: 'Launch AR Studio',
    icon: <Sparkles className="w-6 h-6 text-[#00E5FF]" />,
    gradient: 'from-[#00E5FF]/20 via-purple-600/10 to-[#05070B]',
    borderGlow: 'hover:border-[#00E5FF]/60 hover:shadow-[0_0_35px_rgba(0,229,255,0.25)]',
    accentColor: '#00E5FF',
    tag: 'BI & Analytics',
    artPattern: 'studio',
  },
  {
    id: 'ar-assist',
    badge: 'AI ANALYTICS PARTNER',
    title: 'AR Assist',
    subtitle: 'Your 24/7 Intelligent Data Co-Pilot',
    description: 'Query data in plain conversational English, receive instant formula explanations, query optimizations, and predictive forecasting.',
    href: '/ar-assist',
    ctaText: 'Chat with AR Assist',
    icon: <Bot className="w-6 h-6 text-purple-400" />,
    gradient: 'from-purple-600/20 via-indigo-600/10 to-[#05070B]',
    borderGlow: 'hover:border-purple-500/60 hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]',
    accentColor: '#A855F7',
    tag: 'Conversational AI',
    artPattern: 'assist',
  },
  {
    id: 'building-analyticsrise',
    badge: 'FOUNDER JOURNEY',
    title: 'Building AnalyticsRise',
    subtitle: 'The Official Digital Book & Story',
    description: 'Follow the raw, unfiltered journey of building AnalyticsRise from initial idea to global AI software company. Available in Digital & Signed editions.',
    href: '/building-analyticsrise',
    ctaText: 'Read Book & Order',
    icon: <BookOpen className="w-6 h-6 text-amber-400" />,
    gradient: 'from-amber-500/20 via-orange-600/10 to-[#05070B]',
    borderGlow: 'hover:border-amber-400/60 hover:shadow-[0_0_35px_rgba(251,191,36,0.25)]',
    accentColor: '#FBBF24',
    tag: 'Digital & Hardcover Book',
    artPattern: 'book',
  },
  {
    id: 'ar-academy',
    badge: 'LEARNING & CERTIFICATIONS',
    title: 'AR Academy',
    subtitle: 'Courses, Certifications & Learning',
    description: 'Master data analysis, SQL, Power BI, and Python through interactive browser-native guided tracks and verified employer certificates.',
    href: '/ar-academy',
    ctaText: 'Explore Academy Tracks',
    icon: <GraduationCap className="w-6 h-6 text-emerald-400" />,
    gradient: 'from-emerald-500/20 via-teal-600/10 to-[#05070B]',
    borderGlow: 'hover:border-emerald-400/60 hover:shadow-[0_0_35px_rgba(52,211,153,0.25)]',
    accentColor: '#34D399',
    tag: 'Education',
    artPattern: 'academy',
  },
  {
    id: 'resume-builder',
    badge: 'CAREER TOOL',
    title: 'Resume Builder',
    subtitle: 'Create Professional Data Resumes',
    description: 'Tailor high-impact, ATS-optimized analytics resumes with built-in AI keyword scoring, project achievements, and instant PDF exports.',
    href: '/resume-builder',
    ctaText: 'Build Your Resume',
    icon: <FileCode2 className="w-6 h-6 text-blue-400" />,
    gradient: 'from-blue-500/20 via-cyan-600/10 to-[#05070B]',
    borderGlow: 'hover:border-blue-400/60 hover:shadow-[0_0_35px_rgba(96,165,250,0.25)]',
    accentColor: '#60A5FA',
    tag: 'Career Accelerator',
    artPattern: 'resume',
  },
  {
    id: 'sql-playground',
    badge: 'INTERACTIVE SIMULATOR',
    title: 'SQL Playground',
    subtitle: 'Practice SQL Online in Real Time',
    description: 'Execute complex SQL queries on multi-million row simulated databases. Instant feedback, execution plans, and query syntax assistance.',
    href: '/sql-playground',
    ctaText: 'Launch SQL Sandbox',
    icon: <Database className="w-6 h-6 text-[#00E5FF]" />,
    gradient: 'from-[#00E5FF]/20 via-blue-600/10 to-[#05070B]',
    borderGlow: 'hover:border-[#00E5FF]/60 hover:shadow-[0_0_35px_rgba(0,229,255,0.25)]',
    accentColor: '#00E5FF',
    tag: 'SQL Engine',
    artPattern: 'sql',
  },
  {
    id: 'excel-playground',
    badge: 'INTERACTIVE SIMULATOR',
    title: 'Excel Playground',
    subtitle: 'Interactive Excel & Formula Studio',
    description: 'Practice advanced formulas, VLOOKUP, INDEX/MATCH, XLOOKUP, and Pivot Tables inside a lightning-fast browser grid interface.',
    href: '/excel-playground',
    ctaText: 'Launch Excel Studio',
    icon: <Table className="w-6 h-6 text-emerald-400" />,
    gradient: 'from-emerald-600/20 via-green-600/10 to-[#05070B]',
    borderGlow: 'hover:border-emerald-500/60 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]',
    accentColor: '#10B981',
    tag: 'Spreadsheet Studio',
    artPattern: 'excel',
  },
  {
    id: 'dashboard-gallery',
    badge: 'TEMPLATE HUB',
    title: 'Dashboard Gallery',
    subtitle: 'Explore Beautiful Dashboard Templates',
    description: 'Browse production-grade BI dashboard designs for Sales, Finance, HR, and Marketing. Download template layouts or customize live.',
    href: '/dashboard-gallery',
    ctaText: 'View Gallery Templates',
    icon: <LayoutGrid className="w-6 h-6 text-pink-400" />,
    gradient: 'from-pink-500/20 via-rose-600/10 to-[#05070B]',
    borderGlow: 'hover:border-pink-400/60 hover:shadow-[0_0_35px_rgba(244,114,182,0.25)]',
    accentColor: '#F472B6',
    tag: 'Templates & UI',
    artPattern: 'gallery',
  },
  {
    id: 'community',
    badge: 'GLOBAL NETWORK',
    title: 'Community',
    subtitle: 'Join AnalyticsRise Users Worldwide',
    description: 'Connect with over 100,000+ data analysts, data engineers, and BI leaders. Share code snippets, participate in challenges, and network.',
    href: '/community',
    ctaText: 'Join the Community',
    icon: <Users className="w-6 h-6 text-indigo-400" />,
    gradient: 'from-indigo-500/20 via-purple-600/10 to-[#05070B]',
    borderGlow: 'hover:border-indigo-400/60 hover:shadow-[0_0_35px_rgba(129,140,248,0.25)]',
    accentColor: '#818CF8',
    tag: 'Peer Network',
    artPattern: 'community',
  },
  {
    id: 'enterprise',
    badge: 'B2B SOLUTIONS',
    title: 'Enterprise',
    subtitle: 'Business & Team Analytics Solutions',
    description: 'Scale AI analytics across your organization with SSO, custom VPC deployments, dedicated data connectors, and SOC-2 enterprise compliance.',
    href: '/enterprise',
    ctaText: 'Explore Enterprise',
    icon: <Building2 className="w-6 h-6 text-[#00E5FF]" />,
    gradient: 'from-[#00E5FF]/20 via-indigo-600/10 to-[#05070B]',
    borderGlow: 'hover:border-[#00E5FF]/60 hover:shadow-[0_0_35px_rgba(0,229,255,0.25)]',
    accentColor: '#00E5FF',
    tag: 'Enterprise Cloud',
    artPattern: 'enterprise',
  },
  {
    id: 'blog',
    badge: 'INSIGHTS & ARTICLES',
    title: 'Blog',
    subtitle: 'Technical Insights & Deep Dives',
    description: 'Read engineering breakdowns, AI analytics research, SQL optimization guides, and data architecture tutorials from the AnalyticsRise team.',
    href: '/blog',
    ctaText: 'Read Articles',
    icon: <Newspaper className="w-6 h-6 text-cyan-400" />,
    gradient: 'from-cyan-500/20 via-blue-600/10 to-[#05070B]',
    borderGlow: 'hover:border-cyan-400/60 hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]',
    accentColor: '#22D3EE',
    tag: 'Thought Leadership',
    artPattern: 'blog',
  },
];

export default function ExperienceCardsGrid() {
  return (
    <section id="experiences" className="py-20 px-6 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold tracking-widest text-[#00E5FF] uppercase">
          <Zap className="w-4 h-4 text-[#00E5FF]" /> Ecosystem Architecture
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-wider">
          Explore <span className="text-[#00E5FF]">AnalyticsRise</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          An interconnected suite of AI products, interactive software simulators, community platforms, and educational experiences.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CARDS.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.3, delay: idx * 0.03, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="group"
          >
            <Link
              href={card.href}
              className={`h-full flex flex-col justify-between rounded-3xl bg-[#080C14] border border-white/10 p-6 sm:p-8 transition-all duration-300 relative overflow-hidden ${card.borderGlow}`}
            >
              {/* Background Gradient Artwork Layer */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`}
              />

              {/* Decorative Geometric Artwork Header */}
              <div className="relative z-10 w-full h-32 rounded-2xl bg-[#0D1424]/80 border border-white/5 mb-6 overflow-hidden flex items-center justify-center p-4 group-hover:border-white/20 transition-colors">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

                {/* Custom artwork illustration graphics depending on pattern */}
                {card.artPattern === 'studio' && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 rounded bg-gradient-to-t from-[#00E5FF]/40 to-[#00E5FF] animate-pulse" />
                    <div className="w-12 h-24 rounded bg-gradient-to-t from-purple-500/40 to-purple-400" />
                    <div className="w-12 h-20 rounded bg-gradient-to-t from-blue-500/40 to-blue-400" />
                  </div>
                )}

                {card.artPattern === 'assist' && (
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center animate-bounce">
                      <Bot className="w-8 h-8 text-purple-300" />
                    </div>
                  </div>
                )}

                {card.artPattern === 'book' && (
                  <div className="w-20 h-24 rounded-r-lg bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 p-2 shadow-xl border-l-4 border-amber-900 flex flex-col justify-between transform -rotate-6 group-hover:rotate-0 transition-transform">
                    <span className="text-[8px] font-mono font-bold text-black uppercase">AnalyticsRise</span>
                    <span className="text-[10px] font-display font-black text-black">FOUNDER</span>
                  </div>
                )}

                {card.artPattern === 'academy' && (
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono">
                      Certificate Verified
                    </div>
                  </div>
                )}

                {card.artPattern === 'resume' && (
                  <div className="w-28 h-24 rounded bg-slate-900 border border-blue-500/30 p-2 space-y-1.5 shadow-lg">
                    <div className="w-12 h-2 bg-blue-400/60 rounded" />
                    <div className="w-20 h-1.5 bg-slate-700 rounded" />
                    <div className="w-16 h-1.5 bg-slate-700 rounded" />
                    <div className="w-22 h-1.5 bg-blue-400/40 rounded" />
                  </div>
                )}

                {card.artPattern === 'sql' && (
                  <div className="font-mono text-xs text-[#00E5FF] space-y-1">
                    <div>SELECT * FROM analytics</div>
                    <div className="text-slate-400">WHERE conversion &gt; 90%</div>
                  </div>
                )}

                {card.artPattern === 'excel' && (
                  <div className="grid grid-cols-3 gap-1 w-32 font-mono text-[9px] text-emerald-400">
                    <div className="p-1 bg-emerald-950/60 rounded border border-emerald-800">SUM</div>
                    <div className="p-1 bg-emerald-950/60 rounded border border-emerald-800">XLOOKUP</div>
                    <div className="p-1 bg-emerald-950/60 rounded border border-emerald-800">PIVOT</div>
                  </div>
                )}

                {card.artPattern === 'gallery' && (
                  <div className="grid grid-cols-2 gap-2 w-32">
                    <div className="h-10 rounded bg-pink-500/20 border border-pink-400/30" />
                    <div className="h-10 rounded bg-rose-500/20 border border-rose-400/30" />
                  </div>
                )}

                {card.artPattern === 'community' && (
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-[#080C14] flex items-center justify-center font-bold text-xs text-white">
                      AR
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-[#080C14] flex items-center justify-center font-bold text-xs text-white">
                      DA
                    </div>
                    <div className="w-10 h-10 rounded-full bg-cyan-500 border-2 border-[#080C14] flex items-center justify-center font-bold text-xs text-white">
                      BI
                    </div>
                  </div>
                )}

                {card.artPattern === 'enterprise' && (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF]">
                    <ShieldCheck className="w-6 h-6 text-[#00E5FF]" /> SOC-2 COMPLIANT
                  </div>
                )}

                {card.artPattern === 'blog' && (
                  <div className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded border border-cyan-800">
                    Engineering Deep Dives
                  </div>
                )}
              </div>

              {/* Card Content Header */}
              <div className="relative z-10 space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {card.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{card.tag}</span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">{card.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide group-hover:text-[#00E5FF] transition-colors">
                    {card.title}
                  </h3>
                </div>

                <p className="text-xs font-mono text-[#00E5FF]/90 font-medium">{card.subtitle}</p>

                <p className="text-slate-400 text-xs font-sans leading-relaxed pt-1">
                  {card.description}
                </p>
              </div>

              {/* Card Footer CTA */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold tracking-wider text-white group-hover:text-[#00E5FF] transition-colors">
                <span>{card.ctaText}</span>
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#00E5FF] group-hover:text-black transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
