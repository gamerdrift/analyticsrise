'use client';

import React from 'react';
import Link from 'next/link';
import {
  Target,
  Compass,
  Sparkles,
  Award,
  ShieldCheck,
  Mail,
  Users,
  Cpu,
  Quote,
  CheckCircle2,
  Code2,
  Brain,
  BarChart3,
  UserCheck,
} from 'lucide-react';

export default function AboutPage() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jafer Shaikh',
    jobTitle: 'Founder & Chief Executive Officer',
    worksFor: {
      '@type': 'Organization',
      name: 'AnalyticsRise',
      url: 'https://analyticsrise.com',
    },
    description:
      'Founder & CEO of AnalyticsRise. Expert in Data Science, Machine Learning, Data Analytics, Data Visualization, and Web Development.',
    knowsAbout: [
      'Data Science',
      'Machine Learning',
      'Data Analytics',
      'Business Intelligence',
      'Data Visualization',
      'Python',
      'R',
      'SQL',
      'Excel',
      'VBA',
      'Alteryx',
      'Tableau',
      'Web Development',
      'Lean Six Sigma Green Belt',
      'ISO 31000 Risk Management & Compliance',
    ],
  };

  const professionalCertifications = [
    'Certified Data Scientist',
    'Data Visualization Professional',
    'Lean Six Sigma Green Belt',
    'ISO 31000 Risk Management & Compliance',
  ];

  const technicalExpertise = [
    { name: 'Python', category: 'Programming' },
    { name: 'R', category: 'Statistical Computing' },
    { name: 'SQL', category: 'Database Systems' },
    { name: 'Excel', category: 'Spreadsheet Analytics' },
    { name: 'VBA', category: 'Automation' },
    { name: 'Alteryx', category: 'Data Prep & ETL' },
    { name: 'Tableau', category: 'Visual Analytics' },
    { name: 'Machine Learning', category: 'AI & Modeling' },
    { name: 'Data Science', category: 'Advanced Analytics' },
    { name: 'Data Analytics', category: 'Business Insights' },
    { name: 'Business Intelligence', category: 'Enterprise BI' },
    { name: 'Web Development', category: 'Platform Engineering' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-4 pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-mono font-bold tracking-widest uppercase mb-2">
              <Sparkles className="w-4 h-4" /> About AnalyticsRise
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-wider uppercase">
              The Command Center for <span className="text-[#00E5FF]">Data Literacy</span>
            </h1>
            <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
              AnalyticsRise is an enterprise-grade learning platform built to bridge the gap between theoretical knowledge and real-world analytical execution.
            </p>
          </section>

          {/* Core Values / Mission & Vision */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-[#0D1117] border border-[#00E5FF]/20 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Company Mission</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our mission is to empower professionals, students, and organizations worldwide with production-ready data analytical skills through interactive, in-browser software simulators.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0D1117] border border-[#00E5FF]/20 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Company Vision</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                We envision a world where anyone can master complex data software—from Excel Studio Pro to SQL, Python, Power BI, and Tableau—without installing local tools or watching endless passive video lectures.
              </p>
            </div>
          </section>

          {/* Our Story & Methodology */}
          <section className="p-8 rounded-2xl bg-[#0D1117] border border-white/10 space-y-6">
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-6 h-6 text-[#00E5FF]" /> Our Story & Methodology
            </h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                AnalyticsRise was founded by senior data architects, analytics directors, and engineering educators who recognized a critical disconnect in traditional online technical education: watching video lectures does not build real analytical intuition.
              </p>
              <p>
                To solve this, we engineered high-performance, browser-native simulators that replicate enterprise toolsets (Excel, SQL, Python, Power BI, Tableau). Learners write real formulas, build interactive dashboards, execute queries against simulated databases, and analyze 10,000+ row business datasets in real time.
              </p>
            </div>
          </section>

          {/* ─── MEET THE FOUNDER SECTION ────────────────────────────────────────────── */}
          <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0D1117] via-[#0A101D] to-[#070B14] border border-[#00E5FF]/30 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Founder Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div className="flex items-center gap-5">
                {/* Accessible Photo / Avatar Placeholder */}
                <div
                  className="w-20 h-20 rounded-2xl bg-[#05070B] border-2 border-[#00E5FF]/40 flex flex-col items-center justify-center text-[#00E5FF] shadow-lg shadow-[#00E5FF]/10 shrink-0 relative overflow-hidden group"
                  aria-label="Jafer Shaikh — Founder & Chief Executive Officer, AnalyticsRise"
                >
                  <UserCheck className="w-9 h-9 text-[#00E5FF]" />
                  <span className="text-[8px] font-mono font-bold tracking-widest text-slate-400 mt-1 uppercase">
                    JS
                  </span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5 border border-[#00E5FF]/20">
                    <Award className="w-3.5 h-3.5" /> Meet the Founder
                  </div>
                  <h2 className="text-3xl font-display font-black text-white uppercase tracking-wider">
                    Jafer Shaikh
                  </h2>
                  <p className="text-slate-400 text-xs font-mono font-bold mt-0.5">
                    Founder & Chief Executive Officer, AnalyticsRise
                  </p>
                </div>
              </div>

              {/* Quick Certification Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                  Lean Six Sigma Green Belt
                </span>
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
                  ISO 31000 Risk & Compliance
                </span>
              </div>
            </div>

            {/* Founder Story Body */}
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-sans">
              <p>
                AnalyticsRise was founded with a simple yet ambitious vision: to make world-class analytics education and business intelligence accessible to everyone.
              </p>
              <p>
                With a professional background spanning Data Science, Machine Learning, Data Analytics, Business Intelligence, Web Development, and Process Excellence, Jafer combines technical expertise with a passion for building products that simplify complex technologies and empower people to make better decisions with data.
              </p>
              <p>
                As a Certified Data Scientist and Data Visualization professional, he has hands-on experience working with Python, R, SQL, Excel, VBA, Alteryx, and Tableau to transform raw data into meaningful insights, interactive dashboards, and intelligent machine learning solutions.
              </p>
              <p>
                Beyond analytics, Jafer is also a modern web developer focused on creating fast, intuitive, and engaging digital experiences that make advanced technology approachable for learners, professionals, and organizations alike.
              </p>
              <p>
                His professional certifications include Lean Six Sigma Green Belt and ISO 31000 Risk Management/Compliance, reflecting a strong foundation in continuous improvement, operational excellence, governance, and risk-aware decision making.
              </p>
              <p>
                AnalyticsRise represents the intersection of these disciplines—a platform designed to help people learn analytics, build practical skills, create intelligent solutions, and unlock new career opportunities through technology.
              </p>
              <p>
                Jafer believes that data literacy should not be limited to specialists. His long-term vision is to build AnalyticsRise into a globally recognized ecosystem where artificial intelligence, analytics, education, and innovation come together to help millions of learners and businesses solve real-world problems.
              </p>
            </div>

            {/* Founder Quote Card */}
            <div className="p-6 rounded-2xl bg-[#05070B] border border-[#00E5FF]/30 relative overflow-hidden space-y-2">
              <Quote className="w-8 h-8 text-[#00E5FF]/20 absolute top-4 right-4" />
              <div className="text-[10px] font-mono text-[#00E5FF] font-bold uppercase tracking-widest">
                FOUNDER PHILOSOPHY
              </div>
              <blockquote className="text-slate-200 text-sm sm:text-base font-medium italic leading-relaxed">
                &ldquo;Technology is most powerful when it transforms complexity into clarity. AnalyticsRise exists to make that transformation accessible to everyone.&rdquo;
              </blockquote>
              <div className="text-xs font-mono text-slate-400 pt-1">— Jafer Shaikh</div>
            </div>

            {/* Credentials & Expertise Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
              {/* Professional Certifications */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Professional Certifications
                </h3>
                <div className="space-y-2.5">
                  {professionalCertifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#05070B] border border-white/10 flex items-center gap-3 hover:border-emerald-500/40 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold text-white font-mono">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Expertise Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-widest flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#00E5FF]" /> Technical Expertise
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {technicalExpertise.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#05070B] border border-white/10 flex flex-col justify-center hover:border-[#00E5FF]/40 transition-colors"
                    >
                      <span className="text-white font-semibold">{item.name}</span>
                      <span className="text-[9px] text-slate-500 uppercase">{item.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Key Platform Pillars */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider text-center">
              Why Professionals Choose <span className="text-[#00E5FF]">AnalyticsRise</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-[#0D1117] border border-white/10 space-y-3">
                <Cpu className="w-8 h-8 text-[#00E5FF]" />
                <h3 className="text-base font-bold text-white font-mono uppercase">Interactive Learning</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  In-browser replica interfaces for Excel Studio Pro, SQL, and Python with immediate formula and query feedback.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#0D1117] border border-white/10 space-y-3">
                <Sparkles className="w-8 h-8 text-amber-400" />
                <h3 className="text-base font-bold text-white font-mono uppercase">AI Mentor Guidance</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Context-aware AI mentor that translates natural language to formulas, explains errors, and suggests optimal query patterns.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#0D1117] border border-white/10 space-y-3">
                <Award className="w-8 h-8 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-mono uppercase">Career Development</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Skill assessment paths, verifiable digital certificates, portfolio builders, and interview challenge missions.
                </p>
              </div>
            </div>
          </section>

          {/* Official Contact & Support */}
          <section className="p-8 rounded-2xl bg-gradient-to-r from-[#0D1117] to-[#0A121E] border border-[#00E5FF]/30 text-center space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Need Support or Have Questions?</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Our support engineers and education team are here to help you navigate your data learning journey.
            </p>
            <div>
              <a
                href="mailto:support@analyticsrise.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00E5FF] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#4FC3F7] transition-all shadow-lg shadow-[#00E5FF]/20"
              >
                <Mail className="w-4 h-4" /> support@analyticsrise.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
