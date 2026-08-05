'use client';

import React from 'react';
import Link from 'next/link';
import LandingNavbar from '@/app/components/landing/LandingNavbar';
import { GraduationCap, Award, BookOpen, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function ARAcademyPage() {
  const tracks = [
    { title: 'Data Analyst Career Track', level: 'Beginner to Advanced', duration: '40 Hours', href: '/courses' },
    { title: 'SQL & Database Architecture', level: 'Intermediate', duration: '25 Hours', href: '/courses' },
    { title: 'Power BI & Tableau Dashboard Masterclass', level: 'Professional', duration: '30 Hours', href: '/courses' },
    { title: 'Python for Data Science & Automation', level: 'Advanced', duration: '35 Hours', href: '/courses' },
  ];

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans selection:bg-emerald-500/20 selection:text-emerald-400 flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-25" />
      <LandingNavbar />

      <main className="flex-1 relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
            <GraduationCap className="w-4 h-4" /> AR Academy
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black text-white uppercase tracking-tight">
            COURSES, CERTIFICATIONS & <span className="text-emerald-400">LEARNING</span>
          </h1>

          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Hands-on learning paths with in-browser simulators and employer-recognized certificates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.map((t, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-[#080C14] border border-white/10 space-y-4 hover:border-emerald-400/40 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{t.level} • {t.duration}</span>
                <h3 className="text-xl font-display font-bold text-white uppercase">{t.title}</h3>
              </div>

              <Link
                href={t.href}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300"
              >
                Enroll in Track <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
