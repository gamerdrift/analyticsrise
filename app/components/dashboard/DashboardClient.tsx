'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/app/components/ThemeProvider';
import { SkeletonLoader } from '@/app/components/feedback/FeedbackControls';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import { useLanguage } from '@/lib/i18n';
import CareerRoadmap from '@/app/components/roadmap/CareerRoadmap';
import AIMentor from '@/src/components/AIMentor';
import { useGamification } from '@/lib/contexts/GamificationContext';

import {
  Flame,
  Trophy,
  Zap,
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  Play,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Database,
  Terminal,
  FileSpreadsheet,
  ChevronRight,
  Star,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardClient() {
  const { userProfile, loading } = useAuth();
  const { toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { xp, level, streak, badges } = useGamification();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('dashboard.welcomeMorning') || 'Good Morning');
    else if (hour < 18) setGreeting(t('dashboard.welcomeAfternoon') || 'Good Afternoon');
    else setGreeting(t('dashboard.welcomeEvening') || 'Good Evening');
  }, [t]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <SkeletonLoader variant="card" count={1} className="h-44" />
          <div className="grid md:grid-cols-4 gap-6">
            <SkeletonLoader variant="card" count={1} className="h-32" />
            <SkeletonLoader variant="card" count={1} className="h-32" />
            <SkeletonLoader variant="card" count={1} className="h-32" />
            <SkeletonLoader variant="card" count={1} className="h-32" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const displayName = userProfile?.displayName || 'Analyst';
  const xpForNextLevel = Math.pow(level, 2) * 100;
  const levelProgressPercent = Math.min(100, Math.round((xp / xpForNextLevel) * 100));

  // Mock Active Course Progress
  const activeCourse = {
    title: 'SQL Relational Multi-Table JOINs',
    subtitle: 'Module 2: Advanced Relational Query Optimization',
    progress: 68,
    lastLesson: 'Lesson 4: INNER vs LEFT JOIN Performance Benchmarks',
    simulatorHref: '/simulators/sql',
  };

  // Recommended Courses
  const recommendedCourses = [
    {
      id: 'course-1',
      title: 'Power BI DAX & Star Schemas',
      category: 'Power BI',
      level: 'Intermediate',
      duration: '12 Hours',
      icon: TrendingUp,
      color: 'text-amber-400',
      href: '/simulators/powerbi',
    },
    {
      id: 'course-2',
      title: 'Tableau Level of Detail (LOD) Formulations',
      category: 'Tableau',
      level: 'Advanced',
      duration: '15 Hours',
      icon: Star,
      color: 'text-orange-400',
      href: '/simulators/tableau',
    },
    {
      id: 'course-3',
      title: 'Pandas Data Wrangling & Cleaning',
      category: 'Python',
      level: 'Intermediate',
      duration: '10 Hours',
      icon: Terminal,
      color: 'text-[#00E5FF]',
      href: '/python-lab',
    },
  ];

  // Recent Activity Log
  const recentActivities = [
    { id: 1, type: 'lab', title: 'Executed 12 SQL JOIN queries in SQL Sandbox', xp: 150, time: '2 hours ago', icon: Database },
    { id: 2, type: 'quiz', title: 'Passed Excel XLOOKUP Assessment (95%)', xp: 100, time: 'Yesterday', icon: CheckCircle2 },
    { id: 3, type: 'streak', title: 'Verified 7-Day Consecutive Study Streak', xp: 50, time: '2 days ago', icon: Flame },
    { id: 4, type: 'cert', title: 'Earned SHA-256 SQL Certification Badge', xp: 300, time: '3 days ago', icon: Award },
  ];

  // Upcoming Assessments
  const upcomingAssessments = [
    { id: 'asm-1', title: 'Enterprise SQL Optimization Exam', duration: '45 mins', questions: 25, difficulty: 'Hard', dueDate: 'Tomorrow, 18:00 UTC' },
    { id: 'asm-2', title: 'Excel Financial Modeling Challenge', duration: '60 mins', questions: 15, difficulty: 'Medium', dueDate: 'In 3 Days' },
  ];

  // Verified Certificates
  const earnedCertificates = [
    { id: 'cert-1', name: 'Relational Database SQL Specialist', issueDate: '2026-07-20', hash: 'sha256-8a3b...9f1e', verifyUrl: '/certifications' },
    { id: 'cert-2', name: 'Excel Financial Spreadsheet Architect', issueDate: '2026-07-15', hash: 'sha256-3c2d...71ab', verifyUrl: '/certifications' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* ─── 1. GREETING & HERO HEADER ────────────────────────────────────────────── */}
        <section className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0D1117] to-slate-900 border border-[#00E5FF]/20 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-widest font-bold">
                  Telemetry Active • Session Online
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display uppercase tracking-wide">
                {greeting}, <span className="text-[#00E5FF]">{displayName}</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                Ready to continue your analytical problem-solving? Your 7-day streak is active!
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/simulators/sql">
                <button className="px-5 py-2.5 rounded-lg bg-[#00E5FF] text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#4FC3F7] transition-all shadow-lg shadow-[#00E5FF]/20 flex items-center gap-2">
                  <Play className="w-4 h-4" /> Resume Workstation
                </button>
              </Link>
              <Link href="/practice">
                <button className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 font-bold font-mono text-xs uppercase tracking-wider hover:bg-slate-800 transition-all">
                  Explore Labs
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── 2. GAMIFICATION TELEMETRY CARDS (XP, Level, Streak) ────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Level Card */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#0D1117]/80 flex flex-col justify-between hover:border-[#00E5FF]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Current Level</span>
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div className="my-3">
              <span className="text-3xl font-black font-display text-white">LEVEL {level}</span>
              <span className="text-xs text-[#00E5FF] font-mono block mt-0.5">Analyst Rank</span>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>Progress to Lvl {level + 1}</span>
                <span>{levelProgressPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-[#00E5FF] rounded-full" style={{ width: `${levelProgressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* XP Card */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#0D1117]/80 flex flex-col justify-between hover:border-[#00E5FF]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Total XP</span>
              <Zap className="w-5 h-5 text-[#00E5FF]" />
            </div>
            <div className="my-3">
              <span className="text-3xl font-black font-display text-white">{xp.toLocaleString()}</span>
              <span className="text-xs text-slate-400 font-mono block mt-0.5">+150 XP today</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Top 8% among active analysts
            </div>
          </div>

          {/* Streak Card */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#0D1117]/80 flex flex-col justify-between hover:border-orange-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Study Streak</span>
              <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            </div>
            <div className="my-3">
              <span className="text-3xl font-black font-display text-white">{streak} DAYS</span>
              <span className="text-xs text-orange-400 font-mono block mt-0.5">Streak Active 🔥</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Practice tomorrow to maintain!
            </div>
          </div>

          {/* Certificates Earned Card */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#0D1117]/80 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Certificates</span>
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="my-3">
              <span className="text-3xl font-black font-display text-white">{earnedCertificates.length} VERIFIED</span>
              <span className="text-xs text-emerald-400 font-mono block mt-0.5">Cryptographic Hashes</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              SHA-256 Ledger Authenticated
            </div>
          </div>
        </section>

        {/* ─── CAREER INTELLIGENCE DASHBOARD TELEMETRY (MODULE G) ────────────────── */}
        <section className="p-6 rounded-2xl border border-white/10 bg-[#0D1117]/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] font-mono font-bold text-[10px] uppercase border border-[#00E5FF]/20">
                MODULE G • CAREER INTELLIGENCE
              </span>
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                Career Growth & Job Readiness Telemetry
              </h3>
            </div>
            <Link href="/career-hub">
              <button className="text-xs font-mono text-[#00E5FF] font-bold hover:underline">
                Open Career Hub →
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#05070B] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">ATS Resume Score</span>
              <span className="text-2xl font-bold font-display text-[#00E5FF]">85 / 100</span>
              <span className="text-[9px] text-emerald-400 block">Enterprise Template</span>
            </div>
            <div className="p-4 rounded-xl bg-[#05070B] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Public Portfolio</span>
              <span className="text-2xl font-bold font-display text-white">92% COMPLETE</span>
              <span className="text-[9px] text-[#00E5FF] block">Live at /portfolio/alex-rivera</span>
            </div>
            <div className="p-4 rounded-xl bg-[#05070B] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Target Role Readiness</span>
              <span className="text-2xl font-bold font-display text-emerald-400">88% MATCH</span>
              <span className="text-[9px] text-slate-400 block">Target: Data Analyst</span>
            </div>
            <div className="p-4 rounded-xl bg-[#05070B] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Applications & Interviews</span>
              <span className="text-2xl font-bold font-display text-amber-400">3 APPLIED</span>
              <span className="text-[9px] text-amber-400 block">1 Technical Interview</span>
            </div>
          </div>
        </section>

        {/* ─── 3. CONTINUE LEARNING HERO CARD ────────────────────────────────────── */}
        <section className="glass-panel p-6 rounded-2xl border border-[#00E5FF]/30 bg-[#0D1117]/90 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-mono font-bold uppercase tracking-wider">
                  ACTIVE LESSON
                </span>
                <span className="text-xs text-slate-400 font-mono">{activeCourse.subtitle}</span>
              </div>
              <h2 className="text-xl font-bold font-display text-white uppercase tracking-wide">
                {activeCourse.title}
              </h2>
              <p className="text-xs text-slate-300 font-mono">{activeCourse.lastLesson}</p>

              {/* Progress Bar */}
              <div className="pt-2 max-w-md">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Module Completion</span>
                  <span className="text-[#00E5FF] font-bold">{activeCourse.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] rounded-full"
                    style={{ width: `${activeCourse.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <Link href={activeCourse.simulatorHref} className="shrink-0">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black font-bold font-mono text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-xl shadow-[#00E5FF]/20 flex items-center gap-2">
                <Play className="w-4 h-4 fill-black" /> Resume Lesson
              </button>
            </Link>
          </div>
        </section>

        {/* ─── 4. PERSONALIZED LEARNING ROADMAP COMPONENT ────────────────────────── */}
        <section>
          <CareerRoadmap />
        </section>

        {/* ─── 5. TWO-COLUMN GRID: Recommended Courses & Upcoming Assessments ─────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 cols): Recommended Courses */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00E5FF]" /> Recommended For You
              </h3>
              <Link href="/courses" className="text-xs font-mono text-[#00E5FF] hover:underline">
                View Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedCourses.map((c) => {
                const IconComp = c.icon;
                return (
                  <div
                    key={c.id}
                    className="glass-panel p-4 rounded-xl border border-white/10 bg-[#0D1117]/80 hover:border-[#00E5FF]/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-mono text-[#00E5FF] uppercase font-bold px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20">
                          {c.category}
                        </span>
                        <IconComp className={`w-4 h-4 ${c.color}`} />
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase font-display tracking-wider line-clamp-2">
                        {c.title}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{c.duration}</span>
                      <Link href={c.href}>
                        <button className="text-[#00E5FF] hover:underline font-bold flex items-center gap-0.5">
                          Start <ChevronRight className="w-3 h-3" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (1 col): Upcoming Assessments */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" /> Scheduled Assessments
            </h3>

            <div className="space-y-3">
              {upcomingAssessments.map((a) => (
                <div key={a.id} className="glass-panel p-4 rounded-xl border border-white/10 bg-[#0D1117]/80">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-amber-400 font-bold uppercase">{a.dueDate}</span>
                    <span className="text-slate-400">{a.questions} Questions</span>
                  </div>
                  <h4 className="text-xs font-bold text-white font-display uppercase tracking-wider">{a.title}</h4>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{a.duration} • {a.difficulty}</span>
                    <Link href="/assessments">
                      <button className="px-3 py-1 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-mono font-bold uppercase hover:bg-amber-400/20 transition-all">
                        Launch
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── 6. TWO-COLUMN GRID: Recent Activity Log & Certificates ────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 space-y-4">
            <h3 className="text-base font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00E5FF]" /> Telemetry Activity Feed
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {recentActivities.map((act) => {
                const IconComp = act.icon;
                return (
                  <div key={act.id} className="flex items-center justify-between p-3 rounded-lg bg-[#05070B] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-white/5 text-[#00E5FF]">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-slate-200 font-bold text-xs">{act.title}</p>
                        <span className="text-[10px] text-slate-500">{act.time}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                      +{act.xp} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cryptographic Certificates */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 space-y-4">
            <h3 className="text-base font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cryptographic Ledger Certs
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {earnedCertificates.map((cert) => (
                <div key={cert.id} className="p-4 rounded-xl bg-[#05070B] border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white uppercase tracking-wider text-xs">{cert.name}</h4>
                    <span className="text-[9px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Issued: {cert.issueDate} • Hash: {cert.hash}</p>
                  <div className="pt-1 flex justify-end">
                    <Link href={cert.verifyUrl}>
                      <button className="text-[10px] text-[#00E5FF] font-bold hover:underline flex items-center gap-1">
                        View Certificate Ledger <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Embedded AI Mentor Drawer at bottom of dashboard */}
        <AIMentor mode="floating" title="AI Analytics Mentor" />
      </div>
    </DashboardLayout>
  );
}
