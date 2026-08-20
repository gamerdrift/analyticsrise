'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, BookOpen, Code2, Award, TrendingUp, ShieldCheck, HeartHandshake, Zap, Check } from 'lucide-react';
import Link from 'next/link';

export default function LearnerJourneySection() {
  const steps = [
    {
      num: '01',
      title: 'Choose Your Skill',
      subtitle: 'SQL • Excel • Power BI',
      description: 'Pick the specific tool or track that matches your goals. Start from absolute zero or jump straight to advanced techniques.',
      icon: <Compass className="w-5 h-5 text-[#00E5FF]" />,
    },
    {
      num: '02',
      title: 'Learn the Concepts',
      subtitle: 'Structured & Clear',
      description: 'Engage with approachable lessons that break down formulas, queries, and analytical logic into intuitive mental models.',
      icon: <BookOpen className="w-5 h-5 text-[#4FC3F7]" />,
    },
    {
      num: '03',
      title: 'Practice by Doing',
      subtitle: 'Interactive Workbenches',
      description: 'Immediately apply what you learn in real in-browser editors with simulated business datasets and live result feedback.',
      icon: <Code2 className="w-5 h-5 text-[#00E5FF]" />,
    },
    {
      num: '04',
      title: 'Test Yourself',
      subtitle: 'Challenges & Assessments',
      description: 'Solidify your knowledge by solving real business scenarios and passing formal assessment checkpoints.',
      icon: <Award className="w-5 h-5 text-amber-400" />,
    },
    {
      num: '05',
      title: 'Track Your Rise',
      subtitle: 'Verified Proof of Skill',
      description: 'Watch your progress climb, earn cryptographically verified completion certificates, and showcase real portfolio evidence.',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    },
  ];

  const reassuringPillars = [
    {
      title: 'No Confusing Starting Point',
      desc: 'Never wonder what to learn next. Every track provides a clear, linear roadmap from fundamental concepts to job-ready execution.',
    },
    {
      title: 'Escape Tutorial Hell',
      desc: 'Stop watching 10-hour videos with no retention. Practice with real data inside simulated studios from day one.',
    },
    {
      title: 'Learn at Your Own Pace',
      desc: 'Whether you have 20 minutes a day or 10 hours a week, progress is saved automatically across all workbenches.',
    },
    {
      title: 'Zero Local Setup Required',
      desc: 'No complicated database installs, license keys, or configuration errors. Everything runs securely in your web browser.',
    },
  ];

  return (
    <section id="journey" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 relative z-10">
      {/* Section Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF] mb-4 text-xs font-mono uppercase tracking-widest font-bold">
          <span>🔺 THE ASCENSION PATHWAY</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight uppercase mb-4">
          HOW YOU <span className="text-[#00E5FF]">RISE</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          A proven five-step learning cycle engineered to take you from foundational understanding to verifiable technical capability.
        </p>
      </div>

      {/* 5-Step Journey Horizontal Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-20 relative">
        {steps.map((step, idx) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 backdrop-blur-md flex flex-col justify-between hover:border-[#00E5FF]/40 transition-all duration-300 relative group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black font-display text-[#00E5FF]/40 group-hover:text-[#00E5FF] transition-colors">
                  {step.num}
                </span>
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-base font-bold text-white font-display uppercase tracking-wide mb-1 group-hover:text-white transition-colors">
                {step.title}
              </h3>
              <span className="text-[10px] font-mono text-[#00E5FF] uppercase block mb-3 font-semibold">
                {step.subtitle}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {step.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
              <span>Phase {step.num} of 05</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Beginner Reassurance Card */}
      <div className="rounded-3xl border border-[#00E5FF]/30 bg-gradient-to-br from-[#080C14] via-[#0D1117] to-[#080C14] p-8 md:p-12 relative overflow-hidden shadow-2xl">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mb-10">
          <span className="text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-widest mb-2 block">
            BUILT FOR ACCESSIBILITY & CONFIDENCE
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-display uppercase tracking-tight mb-3">
            Start Where You Are. <span className="text-[#00E5FF]">Rise At Your Pace.</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Whether you are a university student, a career changer, a non-technical manager, or a practicing analyst leveling up your abilities — AnalyticsRise removes the intimidation factor from data analytics.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reassuringPillars.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-3">
                <Check className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-sm font-bold text-white font-display uppercase tracking-wide mb-2">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <HeartHandshake className="w-5 h-5 text-[#00E5FF]" />
            <span className="text-xs font-mono text-slate-300">
              Join thousands of learners building real skills today.
            </span>
          </div>
          <Link
            href="/courses"
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono font-bold text-xs uppercase tracking-widest transition-all"
          >
            Browse All Learning Paths
          </Link>
        </div>
      </div>
    </section>
  );
}
