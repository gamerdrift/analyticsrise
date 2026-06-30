'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/app/components/ThemeProvider';
import { SkeletonLoader } from '@/app/components/feedback/FeedbackControls';
import UserService from '@/lib/services/user';
import {
  Flame,
  Trophy,
  TrendingUp,
  Award,
  BookOpen,
  Terminal,
  ExternalLink,
  Lock,
  Briefcase,
  Shield,
  Settings as SettingsIcon,
  CheckCircle2,
  Sparkles,
  FileText
} from 'lucide-react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import { useLanguage } from '@/lib/i18n';

// Default skills if none stored
const DEFAULT_SKILLS = {
  Excel: 70,
  SQL: 55,
  'Power BI': 40,
  Tableau: 20,
  Python: 10,
  R: 5,
  Alteryx: 0,
  Statistics: 30,
  'Business Analytics': 45
};

// Radar Chart Component for Skills DNA
const RadarChart = ({ skills }: { skills: Record<string, number> }) => {
  const categories = Object.keys(skills);
  const dataPoints = Object.values(skills);
  const numCategories = categories.length;

  const width = 320;
  const height = 320;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 100;

  // Levels for concentric circles
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPolygons = levels.map(level => {
    return categories.map((_, i) => {
      const angle = (i * 2 * Math.PI) / numCategories - Math.PI / 2;
      const x = cx + radius * level * Math.cos(angle);
      const y = cy + radius * level * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  });

  const dataPathPoints = categories.map((_, i) => {
    const value = (dataPoints[i] || 0) / 100;
    const angle = (i * 2 * Math.PI) / numCategories - Math.PI / 2;
    const x = cx + radius * value * Math.cos(angle);
    const y = cy + radius * value * Math.sin(angle);
    return { x, y };
  });
  const dataPathString = dataPathPoints.map(p => `${p.x},${p.y}`).join(' ');

  const labels = categories.map((cat, i) => {
    const angle = (i * 2 * Math.PI) / numCategories - Math.PI / 2;
    const labelRadius = radius + 22;
    const x = cx + labelRadius * Math.cos(angle);
    const y = cy + labelRadius * Math.sin(angle);

    let textAnchor: "middle" | "start" | "end" = 'middle';
    if (Math.cos(angle) > 0.1) textAnchor = 'start';
    if (Math.cos(angle) < -0.1) textAnchor = 'end';

    return { cat, x, y, textAnchor };
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="mx-auto font-mono text-[8px] text-slate-500">
      {gridPolygons.map((points, idx) => (
        <polygon
          key={idx}
          points={points}
          fill="none"
          stroke="rgba(0, 229, 255, 0.05)"
          strokeWidth="1"
        />
      ))}

      {categories.map((_, i) => {
        const angle = (i * 2 * Math.PI) / numCategories - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="rgba(0, 229, 255, 0.05)"
            strokeWidth="1"
          />
        );
      })}

      {dataPathPoints.length > 0 && (
        <>
          <polygon
            points={dataPathString}
            fill="rgba(0, 229, 255, 0.15)"
            stroke="#00E5FF"
            strokeWidth="1.5"
          />
          {dataPathPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#00E5FF"
              stroke="#05070B"
              strokeWidth="1"
            />
          ))}
        </>
      )}

      {labels.map((lbl, i) => (
        <text
          key={i}
          x={lbl.x}
          y={lbl.y + 3}
          textAnchor={lbl.textAnchor}
          fill="#9AA5B1"
          className="uppercase tracking-wider font-bold"
        >
          {lbl.cat}
        </text>
      ))}
    </svg>
  );
};

export default function RootDashboardPage() {
  const { userProfile, loading } = useAuth();
  const { toggleTheme } = useTheme();
  const { t } = useLanguage();

  // Local state
  const [greeting, setGreeting] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [updatingGoal, setUpdatingGoal] = useState(false);
  const [preferences, setPreferences] = useState({
    notifications: true,
    privacy: true,
    security: true
  });

  // Dynamic greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('dashboard.welcomeMorning'));
    else if (hour < 18) setGreeting(t('dashboard.welcomeAfternoon'));
    else setGreeting(t('dashboard.welcomeEvening'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <SkeletonLoader variant="card" count={1} className="h-44" />
          <div className="grid md:grid-cols-3 gap-6">
            <SkeletonLoader variant="card" count={1} className="h-32" />
            <SkeletonLoader variant="card" count={1} className="h-32" />
            <SkeletonLoader variant="card" count={1} className="h-32" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Load default user stats or Firestore saved data
  const xp = userProfile?.xp ?? 0;
  const level = userProfile?.level ?? 1;
  const streak = userProfile?.streak ?? 0;
  const displayGoal = userProfile?.careerGoal ?? selectedGoal ?? '';
  const currentSkills = userProfile?.skills ?? DEFAULT_SKILLS;

  const practiceHours = userProfile?.practiceHours ?? 14.5;
  const coursesCompleted = userProfile?.coursesCompleted ?? 2;
  const assessmentsPassed = userProfile?.assessmentsPassed ?? 4;
  const certificatesEarned = userProfile?.certificatesEarned ?? 1;
  const careerReadinessScore = userProfile?.careerReadinessScore ?? 65;

  const handleCareerGoalSelect = async (goal: string) => {
    if (!userProfile?.uid) return;
    setUpdatingGoal(true);
    try {
      await UserService.updateUserProfile(userProfile.uid, {
        'profile.careerGoal': goal
      });
      setSelectedGoal(goal);
    } catch (e) {
      console.error('Error updating career goal:', e);
    } finally {
      setUpdatingGoal(false);
    }
  };

  // Roadmaps configuration
  const roadmapPaths: Record<string, string[]> = {
    'Data Analyst': ['Excel', 'SQL Databases', 'Power BI', 'Tableau', 'Python Basics', 'Capstone Analyst Project'],
    'Data Scientist': ['Python Core', 'SQL Databases', 'Statistics', 'Machine Learning', 'Data Pipelines', 'Capstone Research Project'],
    'Business Analyst': ['Excel formulas', 'Business Analytics', 'Tableau Desktop', 'Power BI Dashboarding', 'Visual Storytelling', 'Capstone Presentation']
  };

  const currentRoadmap = roadmapPaths[displayGoal] || [];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        
        {/* WELCOME SECTION / MOTIVATION */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-8 rounded-xl glass-panel relative overflow-hidden neon-glow-card"
        >
          {/* Cyber accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00E5FF]/10 via-[#4FC3F7]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="px-2 py-0.5 text-[9px] font-mono border border-[#00E5FF]/30 text-[#00E5FF] rounded bg-[#00E5FF]/5 uppercase tracking-widest">
                Terminal AR-CC active
              </span>
              <h1 className="text-2xl md:text-3xl font-black mt-3 text-white tracking-wide font-display">
                {greeting}, <span className="neon-text-primary uppercase">{userProfile?.displayName || 'LEARNER GUEST'}</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mt-1 text-xs md:text-sm leading-relaxed">
                &quot;Data is a precious thing and will last longer than the systems themselves.&quot; Track your skills metrics, load interactive sandboxes, and map your path to industry credentials.
              </p>
            </div>

            {/* Streak & Info panel */}
            <div className="flex gap-4 shrink-0 font-mono text-xs">
              <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-lg flex items-center gap-3">
                <Flame className="w-6 h-6 text-[#FFC400] animate-pulse" />
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase tracking-widest">{t('dashboard.streakLabel')}</span>
                  <span className="text-white font-bold block">{streak} {t('dashboard.streakUnit').toUpperCase()}</span>
                </div>
              </div>
              <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-lg flex items-center gap-3">
                <Award className="w-6 h-6 text-[#00E5FF]" />
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase tracking-widest">{t('dashboard.levelLabel')}</span>
                  <span className="text-white font-bold block">{t('common.level').toUpperCase()} {level}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* QUICK STATS PANELS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('dashboard.xpPoints'), value: `${xp} XP`, icon: Trophy, color: 'text-[#FFD600]' },
            { label: t('dashboard.learningStreak'), value: `${streak} ${t('common.days')}`, icon: Flame, color: 'text-[#FFC400]' },
            { label: t('dashboard.coursesCompleted'), value: coursesCompleted, icon: BookOpen, color: 'text-[#00E676]' },
            { label: t('dashboard.practiceHours'), value: `${practiceHours} hrs`, icon: Terminal, color: 'text-[#00E5FF]' },
            { label: t('dashboard.assessmentsPassed'), value: assessmentsPassed, icon: CheckCircle2, color: 'text-[#4FC3F7]' },
            { label: t('dashboard.certificatesEarned'), value: certificatesEarned, icon: Award, color: 'text-[#81C784]' },
            { label: t('dashboard.careerReadiness'), value: `${careerReadinessScore}%`, icon: Briefcase, color: 'text-[#E57373]' },
            { label: t('dashboard.currentRank'), value: level === 1 ? t('dashboard.ranks.junior') : level === 2 ? t('dashboard.ranks.mid') : t('dashboard.ranks.senior'), icon: Shield, color: 'text-[#BA68C8]' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border border-slate-800 bg-[#0D1117]/60 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-xl font-bold font-display text-white mt-4">{stat.value}</span>
            </motion.div>
          ))}
        </div>

        {/* DYNAMIC ROADMAP & CAREER GOAL SELECTOR */}
        <div className="p-6 rounded-xl border border-slate-800 bg-[#0D1117]/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent" />
          
          <h2 className="text-base font-bold text-white font-display mb-6 uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00E5FF]" />
            {t('dashboard.roadmap')}
          </h2>

          {!displayGoal ? (
            <div className="text-center py-6">
              <p className="text-xs text-slate-400 mb-6">{t('dashboard.roadmapPrompt')}</p>
              
              <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {[
                  { key: 'Data Analyst', label: t('dashboard.careerGoals.dataAnalyst'), sub: 'Spreadsheets, Databases & Dashboards' },
                  { key: 'Data Scientist', label: t('dashboard.careerGoals.dataScientist'), sub: 'Python, Stats & Machine Learning' },
                  { key: 'Business Analyst', label: t('dashboard.careerGoals.businessAnalyst'), sub: 'Strategy, Reporting & Metrics' },
                ].map(({ key, label, sub }) => (
                  <button
                    key={key}
                    onClick={() => handleCareerGoalSelect(key)}
                    disabled={updatingGoal}
                    className="p-4 rounded-lg border border-slate-800 hover:border-[#00E5FF]/50 bg-slate-900/30 hover:bg-[#00E5FF]/5 transition-all text-center focus:outline-none focus:ring-1 focus:ring-[#00E5FF]"
                  >
                    <span className="block text-xs font-mono font-bold text-white uppercase">{label}</span>
                    <span className="block text-[9px] text-slate-500 mt-2 font-sans">{sub}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Active Roadmap Timeline Flow */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
                {currentRoadmap.map((node, idx) => {
                  const isCompleted = idx < 2; // Simulated completion status
                  const isActive = idx === 2;
                  
                  return (
                    <div key={idx} className="relative flex flex-col items-center text-center group">
                      {/* Node circle */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-mono text-[10px] font-black z-10 transition-all ${
                        isCompleted
                          ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400'
                          : isActive
                          ? 'border-[#00E5FF] bg-slate-900 text-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                          : 'border-slate-800 bg-slate-900 text-slate-600'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      {/* Text */}
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300 mt-3 block leading-tight">
                        {node}
                      </span>
                      
                      <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase">
                        {isCompleted ? t('common.completed').toUpperCase() : isActive ? t('common.inProgress').toUpperCase() : t('common.locked').toUpperCase()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Reset Goal Link */}
              <button
                onClick={() => handleCareerGoalSelect('')}
                className="mt-6 text-[8px] font-mono text-slate-500 hover:text-[#00E5FF] uppercase tracking-widest focus:outline-none"
              >
                Change Career Goal
              </button>
            </div>
          )}
        </div>

        {/* TWO COLUMN INTERACTIVE GRID */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1 & 2: Main Telemetry details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Grid for Today's Featured Mission & Continue Learning */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Featured Today's Mission */}
              <div className="p-6 rounded-xl border border-slate-800 bg-[#0D1117]/60 flex flex-col justify-between hover:border-[#00E5FF]/20 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00E5FF]" />
                
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 text-[8px] font-mono bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 rounded font-black uppercase">
                      {t('dashboard.todaysMission')}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold">+250 XP REWARD</span>
                  </div>

                  <h3 className="text-base font-bold text-white font-display mt-2 uppercase tracking-wide leading-tight">
                    Sales Attribution Query Optimization
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Clean, optimize, and join tables in the interactive SQL terminal sandbox to analyze enterprise sales attribution.
                  </p>

                  <div className="flex gap-4 text-[9px] font-mono text-slate-500 uppercase mt-4">
                    <span>Duration: 30 Mins</span>
                    <span>Difficulty: Medium</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="w-1/2">
                    <div className="flex justify-between text-[8px] font-mono text-slate-500 mb-1">
                      <span>{t('dashboard.missionProgress')}</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                      <div className="bg-[#00E5FF] h-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                  
                  <Link href="/simulators/sql" className="px-4 py-2 text-[9px] font-bold font-mono uppercase tracking-widest cyber-button">
                    {t('dashboard.missionContinue')}
                  </Link>
                </div>
              </div>

              {/* Continue Learning */}
              <div className="p-6 rounded-xl border border-slate-800 bg-[#0D1117]/60 flex flex-col justify-between hover:border-[#00E5FF]/20 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#4FC3F7]" />
                
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 text-[8px] font-mono bg-[#4FC3F7]/10 text-[#4FC3F7] border border-[#4FC3F7]/20 rounded font-black uppercase">
                      Active Syllabus
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">2 lessons left</span>
                  </div>

                  <h3 className="text-base font-bold text-white font-display mt-2 uppercase tracking-wide leading-tight">
                    Relational SQL Query Optimization
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Master practical index generation, explain plans, and query speedups in enterprise relational engines.
                  </p>

                  <div className="flex gap-4 text-[9px] font-mono text-slate-500 uppercase mt-4">
                    <span>Progress: 60%</span>
                    <span>Time left: 20 mins</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="w-1/2">
                    <div className="flex justify-between text-[8px] font-mono text-slate-500 mb-1">
                      <span>Module Progress</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                      <div className="bg-[#4FC3F7] h-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                  
                  <Link href="/courses" className="px-4 py-2 text-[9px] font-bold font-mono uppercase tracking-widest cyber-button-secondary">
                    Resume
                  </Link>
                </div>
              </div>
            </div>

            {/* Achievements showcases badges */}
            <div className="p-6 rounded-xl border border-slate-800 bg-[#0D1117]/50">
                <h3 className="text-xs font-bold font-display uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#00E5FF]" />
                {t('dashboard.achievements')}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'First Login', desc: 'Secure connection established', earned: true },
                  { name: 'Excel Explorer', desc: 'Syllabus formulas mapped', earned: true },
                  { name: 'SQL Beginner', desc: 'Query database tables', earned: true },
                  { name: 'Power BI Builder', desc: 'Star schema mapped', earned: false }
                ].map((badge, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      badge.earned
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                        : 'border-slate-800 bg-slate-900/30 text-slate-600'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center mx-auto mb-2 text-xs font-black">
                      {badge.earned ? '✓' : '?'}
                    </div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">
                      {badge.name}
                    </span>
                    <span className="text-[8px] text-slate-500 mt-1 block">
                      {badge.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Log Feed */}
            <div className="p-6 rounded-xl border border-slate-800 bg-[#07090D] font-mono text-[10px] text-slate-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-[#00E5FF]" />
              
              <h3 className="text-xs font-bold font-display uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                Live Log Telemetry
              </h3>

              <div className="space-y-2">
                <p className="flex gap-2">
                  <span className="text-slate-500">[15:28:12]</span>
                  <span className="text-emerald-400">SUCCESS</span>
                  <span>SQL query test verified: Sales Attribution Lab</span>
                </p>
                <p className="flex gap-2">
                  <span className="text-slate-500">[14:02:45]</span>
                  <span className="text-[#00E5FF]">COMPLETED</span>
                  <span>Excel Workbook submitted: Quarterly Growth Model</span>
                </p>
                <p className="flex gap-2">
                  <span className="text-slate-500">[09:12:04]</span>
                  <span className="text-[#4FC3F7]">XP_GAIN</span>
                  <span>Earned +450 XP for daily study streak milestone</span>
                </p>
              </div>
            </div>

          </div>

          {/* COLUMN 3: Right Sidebar Dashboard widgets */}
          <div className="space-y-8">
            
            {/* Skills DNA radar chart */}
            <div className="p-6 rounded-xl border border-slate-800 bg-[#0D1117]/60">
              <h3 className="text-xs font-bold font-display uppercase tracking-widest text-white mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                {t('dashboard.learningDNA')}
              </h3>
              <span className="text-[8px] font-mono text-slate-500 uppercase block mb-4">Interactive skills map</span>

              <div className="w-full h-72 flex items-center justify-center">
                <RadarChart skills={currentSkills} />
              </div>
            </div>

            {/* Career Readiness circular card */}
            <div className="p-6 rounded-xl border border-slate-800 bg-[#0D1117]/50 relative overflow-hidden">
              <h3 className="text-xs font-bold font-display uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#00E5FF]" />
                {t('dashboard.careerReadiness')}
              </h3>

              <div className="flex items-center gap-4">
                {/* Circular indicator */}
                <div className="w-16 h-16 rounded-full border-4 border-[#00E5FF] border-t-transparent flex items-center justify-center font-mono text-sm font-black text-white shrink-0">
                  {careerReadinessScore}%
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-300 block uppercase">Operational score</span>
                  <span className="text-[8px] text-slate-500 leading-snug mt-1 block">
                    Complete 2 more assessments and finalize resume to boost score to 85% (Recruiter visibility benchmark).
                  </span>
                </div>
              </div>

              {/* Resume / Portfolio sections */}
              <div className="mt-4 pt-4 border-t border-white/5 space-y-3 font-mono text-[9px]">
                <div className="flex items-center justify-between p-2 bg-slate-900/30 rounded border border-slate-800 text-slate-400">
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Resume Builder</span>
                  <span className="text-[8px] text-[#00E5FF] uppercase font-bold">Coming Soon</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900/30 rounded border border-slate-800 text-slate-400">
                  <span className="flex items-center gap-1"><ExternalLink className="w-3.5 h-3.5" /> Portfolio Site</span>
                  <span className="text-[8px] text-[#00E5FF] uppercase font-bold">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Settings Quick Shortcuts */}
            <div className="p-6 rounded-xl border border-slate-800 bg-[#0D1117]/60 text-xs font-mono">
              <h3 className="text-xs font-bold font-display uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <SettingsIcon className="w-4 h-4 text-[#00E5FF]" />
                {t('dashboard.settingsShortcuts')}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Theme Mode</span>
                  <button
                    onClick={toggleTheme}
                    className="px-2.5 py-1 rounded border border-slate-800 hover:border-[#00E5FF] text-[10px] text-white transition-all focus:outline-none"
                  >
                    Toggle theme
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Notifications</span>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, notifications: !prev.notifications }))}
                    className={`px-2.5 py-1 rounded border text-[10px] transition-all focus:outline-none ${
                      preferences.notifications
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                        : 'border-slate-800 text-slate-500'
                    }`}
                  >
                    {preferences.notifications ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>

            {/* Premium Coming Soon widgets preview */}
            <div className="space-y-3">
              <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block">{t('dashboard.premiumPreview')}</span>

              {[
                { name: t('dashboard.aiMentor'), desc: t('dashboard.aiMentorDesc') },
                { name: t('dashboard.recruiterDashboard'), desc: t('dashboard.recruiterDashboardDesc') },
                { name: t('dashboard.atsScanner'), desc: t('dashboard.atsScannerDesc') }
              ].map((prev, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-800/40 bg-[#0D1117]/20 flex items-center justify-between opacity-50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-slate-950/20" />
                  <div>
                    <span className="block text-[10px] font-bold text-white uppercase font-display">{prev.name}</span>
                    <span className="block text-[8px] text-slate-500 font-mono mt-0.5">{prev.desc}</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
