'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArTriangleIcon } from '@/app/components/brand';

// --- TECHNOLOGY SHOWCASE ---
export function TechnologyShowcase() {
  const tools = [
    { name: 'Microsoft Excel', desc: 'Spreadsheets, financial modeling, and forecast charts.', color: 'hover:border-[#107C41]/30 hover:bg-[#107C41]/5' },
    { name: 'SQL Databases', desc: 'Queries, aggregates, complex joins, and index tuning.', color: 'hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5' },
    { name: 'Power BI', desc: 'DAX modeling, star schemas, and dashboard layouts.', color: 'hover:border-[#F2C811]/30 hover:bg-[#F2C811]/5' },
    { name: 'Tableau', desc: 'LOD formulas, markings shelves, and distributions.', color: 'hover:border-[#E97627]/30 hover:bg-[#E97627]/5' },
    { name: 'Python', desc: 'Pandas DataFrames, data cleaning, and ML pipelines.', color: 'hover:border-[#3776AB]/30 hover:bg-[#3776AB]/5' },
    { name: 'Snowflake', desc: 'Cloud data warehousing and performance tuning.', color: 'hover:border-[#29B6F6]/30 hover:bg-[#29B6F6]/5' },
    { name: 'Databricks', desc: 'Delta Lake architectures and Spark pipelines.', color: 'hover:border-[#FF3621]/30 hover:bg-[#FF3621]/5' },
    { name: 'Microsoft Fabric', desc: 'SaaS analytical intelligence environments.', color: 'hover:border-[#0078D4]/30 hover:bg-[#0078D4]/5' },
  ];

  return (
    <section id="technology" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase tracking-widest text-[#00E5FF] font-mono font-bold mb-3">
          SaaS Technical Core
        </h2>
        <h3 className="text-2xl md:text-3xl font-bold text-white font-display uppercase tracking-wide">
          MASTER THE INDUSTRY STACK
        </h3>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-xl border border-white/5 bg-[#0D1117]/60 backdrop-blur-sm transition-all duration-300 ${tool.color} group`}
          >
            <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider mb-2 group-hover:text-white">
              {tool.name}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">{tool.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- LEARNING PATHS ---
export function LearningPaths() {
  const paths = [
    {
      title: 'Data Analyst Track',
      level: 'LEVEL 01 - CORE',
      desc: 'Master the fundamentals of analytical operations. Learn database structures, standard SQL syntax, spreadsheet aggregations, and data visualization best practices.',
      modules: '5 Modules',
      duration: '40 Hours'
    },
    {
      title: 'BI Solutions Architect',
      level: 'LEVEL 02 - SPECIALIST',
      desc: 'Formulate enterprise reporting intelligence. Implement Star schema topologies, construct advanced DAX formulas in Power BI, and design dashboard books in Tableau.',
      modules: '6 Modules',
      duration: '55 Hours'
    },
    {
      title: 'Data Intelligence Engineer',
      level: 'LEVEL 03 - EXPERT',
      desc: 'Build optimized pipeline layouts. Harness Cloud Data Warehouses in Snowflake, configure Lakehouses in Databricks, and run Spark SQL cleaning nodes.',
      modules: '8 Modules',
      duration: '72 Hours'
    }
  ];

  return (
    <section id="paths" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase tracking-widest text-[#00E5FF] font-mono font-bold mb-3">
          Syllabus Architecture
        </h2>
        <h3 className="text-2xl md:text-3xl font-bold text-white font-display uppercase tracking-wide">
          STRUCTURED LEARNING ROADMAPS
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {paths.map((path, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl border border-white/5 bg-[#0D1117]/60 backdrop-blur-sm flex flex-col justify-between hover:border-[#00E5FF]/20 transition-all duration-300 relative overflow-hidden"
          >
            {/* Top Indicator */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent" />
            
            <div>
              <span className="text-[9px] font-mono text-[#00E5FF] tracking-widest font-bold block mb-2">
                {path.level}
              </span>
              <h4 className="text-lg font-bold text-white font-display uppercase tracking-wider mb-4">
                {path.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{path.desc}</p>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-white/5 pt-4">
              <span>{path.modules}</span>
              <span>{path.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- BUSINESS PROJECTS ---
export function BusinessProjects() {
  const projects = [
    {
      title: 'Customer Churn Analysis',
      industry: 'SaaS / Operations',
      desc: 'Write SQL query aggregates to analyze active billing logs. Extract critical churn alerts based on user login frequency variables.',
      tags: ['SQL Joins', 'Aggregations', 'Pivot Charts']
    },
    {
      title: 'Sales Attribution Matrix',
      industry: 'Marketing / Finance',
      desc: 'Formulate an Excel workbook modeling Customer Acquisition Cost (CAC). Design regression charts charting ad spend vs revenue margins.',
      tags: ['Excel Formulas', 'Trend Lines', 'Data Cleaning']
    },
    {
      title: 'Logistics Resource Dashboard',
      industry: 'Supply Chain',
      desc: 'Build an interactive Power BI dashboard mapping logistics route coordinates. Track inventory flows and delay metrics.',
      tags: ['Power BI', 'Star Schema', 'DAX Measures']
    }
  ];

  return (
    <section id="projects" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase tracking-widest text-[#00E5FF] font-mono font-bold mb-3">
          Practical Labs
        </h2>
        <h3 className="text-2xl md:text-3xl font-bold text-white font-display uppercase tracking-wide">
          SOLVE REAL BUSINESS CHALLENGES
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl border border-white/5 bg-[#0D1117]/60 backdrop-blur-sm hover:border-[#4FC3F7]/30 transition-all duration-300"
          >
            <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase block mb-1">
              {project.industry}
            </span>
            <h4 className="text-base font-bold text-white font-display uppercase tracking-wider mb-3">
              {project.title}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">{project.desc}</p>
            
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- CERTIFICATIONS ---
export function Certifications() {
  return (
    <section id="certifications" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Texts */}
        <div className="space-y-6">
          <h2 className="text-xs uppercase tracking-widest text-[#00E5FF] font-mono font-bold">
            Verifiable Ledger
          </h2>
          <h3 className="text-3xl font-bold text-white font-display uppercase tracking-wide">
            CRYPTOGRAPHIC PROOF OF CAPABILITY
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every certification you earn on AnalyticsRise generates a unique SHA-256 ledger hash. Employers can verify your credentials instantly through our secure verification portal. 
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Unlike standard certificate templates, ours link directly to your verified simulator project history logs, showcasing the exact queries, spreadsheet designs, and dashboards you completed.
          </p>
          <div className="pt-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[#00E5FF]/20 bg-[#00E5FF]/5 text-[10px] font-mono text-[#00E5FF] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              Verified Ledger Node: Active
            </span>
          </div>
        </div>

        {/* Certificate Mock Card Wrapper */}
        <div className="flex justify-center">
          <div className="w-full max-w-lg p-6 rounded-xl border border-[#00E5FF]/30 bg-[#07090D]/90 backdrop-blur-md relative shadow-2xl relative overflow-hidden group hover:border-[#00E5FF]/50 transition-all duration-500">
            {/* Holographic scanning laser line */}
            <div className="absolute inset-0 scanline-laser pointer-events-none opacity-20" />
            
            {/* Top Border Gradient Banner */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7]" />

            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2">
                <ArTriangleIcon size={26} />
                <span className="text-[10px] font-display font-bold text-white uppercase tracking-wider">
                  Analytics<span className="text-[#00E5FF]">Rise</span>
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#00E5FF] uppercase tracking-widest bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/20">
                VERIFIED ID
              </span>
            </div>

            <div className="space-y-4 mb-8">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">
                THIS IS TO CERTIFY THAT THE ANALYST
              </span>
              <h4 className="text-xl font-bold text-white font-display tracking-wider uppercase">
                ANALYST GUEST
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                Has successfully passed the assessment criteria and completed verified simulation projects under the curriculum structure:
              </p>
              <div className="p-3 bg-white/5 border border-white/5 rounded font-mono text-white text-[11px] font-bold">
                ENTERPRISE SQL QUERY OPTIMIZATION LABS
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-[9px] font-mono text-slate-500">
              <div>
                <span className="block uppercase text-[8px] text-slate-600 mb-1">VERIFICATION HASH</span>
                <span className="text-slate-300 font-bold block truncate">sha256-9b83a218f26a117b9b7a38b55c689d12</span>
              </div>
              <div className="text-right">
                <span className="block uppercase text-[8px] text-slate-600 mb-1">ISSUE TIMESTAMP</span>
                <span className="text-slate-300 font-bold block">2026-06-28 18:24 UTC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- CAREER HUB ---
export function CareerHub() {
  const matches = [
    { skill: 'Enterprise SQL Joins', requirement: 'Database aggregation, indexing, performance tuning', status: 'VERIFIED' },
    { skill: 'Advanced Excel Formulas', requirement: 'Financial modeling, forecasting, custom cell matrices', status: 'VERIFIED' },
    { skill: 'Data Vis Dashboards', requirement: 'Star schemas, cross-filtering, LOD layouts', status: 'VERIFIED' },
  ];

  return (
    <section id="career" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Visual Map */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-[#00E5FF] font-mono font-bold mb-6">
            JOB MARKET ALIGNMENT
          </h4>
          <div className="space-y-3 font-mono text-xs">
            {matches.map((item, idx) => (
              <div key={idx} className="p-4 rounded border border-white/5 bg-[#05070B] flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block mb-1">{item.skill}</span>
                  <span className="text-[10px] text-slate-500 block leading-tight">{item.requirement}</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded font-bold border border-emerald-400/20">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Text details */}
        <div className="space-y-6">
          <h2 className="text-xs uppercase tracking-widest text-[#4FC3F7] font-mono font-bold">
            Career Integration Hub
          </h2>
          <h3 className="text-3xl font-bold text-white font-display uppercase tracking-wide">
            ALIGN YOUR CAPABILITIES WITH CORPORATE ROLES
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AnalyticsRise bridges the gap between learning and employment. We align every practice module and database layout with active job descriptions from top technology, financial, and logistics organizations.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our career module tracks your metrics and highlights where your technical SQL, Power BI, or Excel forecasting skills match open analyst position targets.
          </p>
        </div>
      </div>
    </section>
  );
}

// --- PRICING SECTION ---
export function PricingSection() {
  const [annualBilling, setAnnualBilling] = useState(false);

  const plans = [
    {
      name: 'Sandbox Free',
      price: '0',
      desc: 'Explore core fundamentals and run initial practice challenges.',
      features: [
        'SQL Studio Practice Challenges',
        'Excel & Power BI Workbenches',
        'Community access & public datasets',
        'Progress tracking & achievements',
      ],
      cta: 'Start Free Practice',
      href: '/register',
      highlighted: false,
    },
    {
      name: 'Pro Analyst',
      price: annualBilling ? '19' : '29',
      desc: 'Full access for serious learners seeking verified skills and certificates.',
      features: [
        'All Practice Studios & Interactive Labs',
        'Unlimited challenge progression tiers',
        'Timed exams & graded assessments',
        'Verifiable SHA-256 Certificates',
        'Career Hub & Portfolio Showcase',
      ],
      cta: 'Unlock Pro Access',
      href: '/pricing',
      highlighted: true,
    },
    {
      name: 'Enterprise Cohort',
      price: 'Custom',
      desc: 'Collaborative analytics portal for teams, bootcamps, and universities.',
      features: [
        'Cohort management dashboard',
        'Custom dataset file uploads',
        'SSO authentication (SAML/Okta)',
        'Learner progress & competency metrics',
        'Dedicated onboarding & support',
      ],
      cta: 'Contact Enterprise',
      href: '/enterprise',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF] mb-4 text-xs font-mono uppercase tracking-widest font-bold">
          <span>🔺 TRANSPARENT VALUE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight uppercase mb-4">
          SIMPLE, VALUE-DRIVEN <span className="text-[#00E5FF]">PRICING</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-6">
          Start for free, learn at your own pace, and upgrade whenever you are ready to prove your skills with verified certifications.
        </p>

        {/* Toggle Button */}
        <div className="inline-flex items-center gap-3 p-1 rounded-full border border-white/10 bg-[#0D1117] relative">
          <button
            onClick={() => setAnnualBilling(false)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-colors ${
              !annualBilling ? 'bg-[#00E5FF] text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnualBilling(true)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-colors ${
              annualBilling ? 'bg-[#00E5FF] text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Annual (-35%)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-2xl border flex flex-col justify-between backdrop-blur-sm relative transition-all duration-300 ${
              plan.highlighted
                ? 'border-[#00E5FF] bg-[#0D1117]/90 shadow-xl shadow-[#00E5FF]/10'
                : 'border-white/10 bg-[#0D1117]/60 hover:border-white/20'
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#00E5FF] text-black text-[9px] font-mono font-black uppercase tracking-widest shadow-md shadow-[#00E5FF]/30">
                RECOMMENDED
              </span>
            )}

            <div>
              <h4 className="text-lg font-bold text-white font-display uppercase tracking-wider mb-2">
                {plan.name}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 min-h-[36px] font-sans">{plan.desc}</p>
              
              <div className="mb-6 flex items-baseline font-mono">
                {plan.price !== 'Custom' && <span className="text-slate-400 text-lg">$</span>}
                <span className="text-4xl font-black text-white font-display">
                  {plan.price}
                </span>
                {plan.price !== 'Custom' && <span className="text-slate-500 text-xs font-mono">/mo</span>}
              </div>

              <div className="h-px bg-white/5 mb-6" />

              <ul className="space-y-3 text-xs text-slate-300 font-sans">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <Link
                href={plan.href}
                className={`w-full py-3.5 block text-center rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 border ${
                  plan.highlighted
                    ? 'bg-[#00E5FF] border-[#00E5FF] text-black hover:bg-transparent hover:text-[#00E5FF] shadow-lg shadow-[#00E5FF]/20'
                    : 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- TESTIMONIALS ---
export function Testimonials() {
  const reviews = [
    {
      name: 'Sarah Chen',
      role: 'Lead Business Analyst',
      comp: 'Enterprise SaaS Corp',
      text: 'Watching videos is the slowest way to learn. The in-browser SQL challenges and Power BI exercises on AnalyticsRise let me practice actual reporting on real business databases.',
      rating: 5,
    },
    {
      name: 'James Patel',
      role: 'Junior Data Analyst',
      comp: 'E-commerce Group',
      text: 'The spreadsheet modeling environments and SQL practice studios helped me escape tutorial hell. I built real confidence because I was writing queries from day one.',
      rating: 5,
    },
    {
      name: 'Elena Rostova',
      role: 'BI Developer',
      comp: 'DataScale Systems',
      text: 'Verifiable proof on certifications is a game-changer. My hiring manager verified my practical projects using the public registry link on my portfolio.',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF] mb-4 text-xs font-mono uppercase tracking-widest font-bold">
          <span>🔺 LEARNER STORIES</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight uppercase mb-4">
          WHAT LEARNERS <span className="text-[#00E5FF]">ACHIEVE</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="p-8 rounded-2xl border border-white/10 bg-[#0D1117]/80 backdrop-blur-md flex flex-col justify-between hover:border-[#00E5FF]/30 transition-all duration-300"
          >
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-8 font-sans">
              &ldquo;{rev.text}&rdquo;
            </p>
            
            <div className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center font-bold text-xs text-[#00E5FF] font-mono uppercase">
                {rev.name.substring(0, 2)}
              </div>
              <div>
                <span className="block text-xs font-bold text-white font-display uppercase">
                  {rev.name}
                </span>
                <span className="block text-[10px] text-slate-400 font-mono">
                  {rev.role} • {rev.comp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- FAQ ACCORDION ---
export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Do I need to install SQL, Excel, or Power BI on my computer?',
      a: 'No. Every learning workbench and practice challenge runs entirely inside your web browser. You do not need to install local databases, buy software licenses, or configure development environments.',
    },
    {
      q: 'I am a complete beginner. Where should I start?',
      a: 'We recommend starting with either the SQL Studio beginner track or Excel Studio Pro. Both feature progressive, step-by-step guidance designed specifically for first-time learners.',
    },
    {
      q: 'How do verifiable certificates work?',
      a: 'When you pass an official assessment or complete a certification track, a unique cryptographic record is registered. Employers can verify your exact completed labs and score through your public verification link.',
    },
    {
      q: 'Can I learn at my own pace?',
      a: 'Yes. Your progress, challenge attempts, and workbench states are saved automatically. You can practice whenever you have time, on your own schedule.',
    },
    {
      q: 'Are there team and university cohort options available?',
      a: 'Yes. Our Enterprise Cohort plan offers dedicated administration dashboards, cohort progress tracking, custom dataset uploads, and SSO integration for universities and corporate teams.',
    },
  ];

  return (
    <section id="faq" className="py-24 px-6 max-w-4xl mx-auto border-t border-white/5 relative z-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF] mb-4 text-xs font-mono uppercase tracking-widest font-bold">
          <span>🔺 QUESTIONS & ANSWERS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight uppercase mb-4">
          FREQUENTLY ASKED <span className="text-[#00E5FF]">QUESTIONS</span>
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-white/10 rounded-xl bg-[#0D1117]/80 backdrop-blur-md overflow-hidden transition-colors hover:border-white/20"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center text-white focus:outline-none cursor-pointer"
              >
                <span className="text-sm font-bold tracking-wide uppercase font-display">
                  {faq.q}
                </span>
                <span className="text-[#00E5FF] font-bold font-mono text-sm ml-4">
                  {isOpen ? '[-]' : '[+]'}
                </span>
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden bg-[#05070B]/60"
                  >
                    <p className="p-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 font-sans">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// --- LANDING FOOTER ---
export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#05070B] relative z-10 py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-3 group" aria-label="AnalyticsRise Home">
          <ArTriangleIcon size={32} className="transition-transform group-hover:scale-105" />
          <span className="font-display font-black text-white text-base tracking-wider uppercase">
            Analytics<span className="text-[#00E5FF]">Rise</span>
          </span>
        </Link>

        <div className="flex flex-wrap justify-center gap-8 text-xs font-mono uppercase tracking-widest text-slate-400">
          <Link href="/products" className="hover:text-[#00E5FF] transition-colors">Products</Link>
          <Link href="/courses" className="hover:text-[#00E5FF] transition-colors">Learning Paths</Link>
          <Link href="/pricing" className="hover:text-[#00E5FF] transition-colors">Pricing</Link>
          <Link href="/enterprise" className="hover:text-[#00E5FF] transition-colors">Enterprise</Link>
          <Link href="/about" className="hover:text-[#00E5FF] transition-colors">About</Link>
        </div>

        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ALL WORKBENCHES OPERATIONAL
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
        <span>&copy; {new Date().getFullYear()} AnalyticsRise. All rights reserved.</span>
        <span>Learn Data • Practice Real Skills • Rise Higher</span>
      </div>
    </footer>
  );
}

