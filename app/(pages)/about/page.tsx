'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Compass, Sparkles, Award, ShieldCheck, Mail, Users, Cpu, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
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

        {/* Our Story */}
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
  );
}
