'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Terminal, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ThreePillarsSection() {
  const pillars = [
    {
      step: '01',
      pillar: 'LEARN',
      tagline: 'Learn the concepts',
      headline: 'Structured, Approachable Roadmaps',
      description:
        'Master foundational to advanced data analytics through guided, step-by-step learning modules designed for absolute clarity.',
      highlights: [
        'Curated pathways for SQL, Excel, and Power BI',
        'Intuitive breakdown of complex formulas and query logic',
        'Zero setup required — start in your browser immediately',
      ],
      icon: <BookOpen className="w-6 h-6 text-[#00E5FF]" />,
      accentColor: '#00E5FF',
      gradient: 'from-[#00E5FF]/15 via-[#00E5FF]/5 to-transparent',
      borderColor: 'border-[#00E5FF]/30 hover:border-[#00E5FF]/60',
      shadowColor: 'hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]',
      badgeBg: 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30',
      linkHref: '/courses',
      linkLabel: 'Explore Learning Paths',
    },
    {
      step: '02',
      pillar: 'PRACTICE',
      tagline: 'Practice real skills',
      headline: 'Interactive In-Browser Workbenches',
      description:
        'Stop watching passive videos. Write real SQL queries, build dynamic Excel models, and design business intelligence reports in real-time.',
      highlights: [
        'Live SQL Studio with instant schema evaluation',
        'Interactive Excel spreadsheet modeling environment',
        'Real business datasets from SaaS, e-commerce, and finance',
      ],
      icon: <Terminal className="w-6 h-6 text-[#4FC3F7]" />,
      accentColor: '#4FC3F7',
      gradient: 'from-[#4FC3F7]/15 via-[#4FC3F7]/5 to-transparent',
      borderColor: 'border-[#4FC3F7]/30 hover:border-[#4FC3F7]/60',
      shadowColor: 'hover:shadow-[0_0_30px_rgba(79,195,247,0.15)]',
      badgeBg: 'bg-[#4FC3F7]/10 text-[#4FC3F7] border-[#4FC3F7]/30',
      linkHref: '/sql-studio',
      linkLabel: 'Launch Practice Studio',
    },
    {
      step: '03',
      pillar: 'RISE',
      tagline: 'Prove your progress',
      headline: 'Verifiable Proof & Career Growth',
      description:
        'Complete skill challenges, pass authoritative assessments, and build a verified portfolio that proves you can do the work.',
      highlights: [
        'Automated challenge evaluation & progression tracking',
        'Cryptographically verifiable completion certificates',
        'Portfolio showcase demonstrating hands-on proficiency',
      ],
      icon: <Trophy className="w-6 h-6 text-emerald-400" />,
      accentColor: '#10B981',
      gradient: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
      shadowColor: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      linkHref: '/certifications',
      linkLabel: 'View Verified Credentials',
    },
  ];

  return (
    <section id="philosophy" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF] mb-4 text-xs font-mono uppercase tracking-widest font-bold">
          <span>🔺 THE ANALYTICSRISE SYSTEM</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight uppercase mb-4">
          LEARN. PRACTICE. <span className="text-[#00E5FF]">RISE.</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          AnalyticsRise isn&apos;t just a collection of software tools. It is an end-to-end learning architecture designed to transform curious beginners into confident, job-ready data professionals.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {pillars.map((pillar, idx) => (
          <motion.div
            key={pillar.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className={`rounded-2xl border ${pillar.borderColor} bg-[#0D1117]/80 backdrop-blur-md p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${pillar.shadowColor} group`}
          >
            {/* Top Gradient Accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${pillar.gradient}`} />

            <div>
              {/* Header Badge & Step Number */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    {pillar.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">
                      STEP {pillar.step}
                    </span>
                    <span className="text-sm font-black font-display text-white tracking-wider">
                      {pillar.pillar}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${pillar.badgeBg}`}>
                  {pillar.tagline}
                </span>
              </div>

              {/* Headline & Description */}
              <h3 className="text-xl font-bold text-white font-display uppercase tracking-wide mb-3 group-hover:text-[#00E5FF] transition-colors">
                {pillar.headline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 font-sans">
                {pillar.description}
              </p>

              {/* Highlights List */}
              <ul className="space-y-2.5 mb-8 border-t border-white/5 pt-6">
                {pillar.highlights.map((item, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pillar Action Link */}
            <Link
              href={pillar.linkHref}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#00E5FF] hover:text-white transition-colors group/link pt-4 border-t border-white/5"
            >
              <span>{pillar.linkLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
