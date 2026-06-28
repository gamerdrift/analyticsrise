'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DashboardLayout from '@/app/components/layout/DashboardLayout';

const modules = [
  {
    title: 'Microsoft Excel',
    desc: 'Master practical formulas, data cleaning, VLOOKUP/XLOOKUP, pivot tables, and financial modeling.',
    progress: 75,
    level: 'Beginner to Advanced',
    lessons: '12 Lessons',
    color: '#107C41',
    link: '/simulators/excel'
  },
  {
    title: 'SQL Databases',
    desc: 'Write robust queries, aggregate metrics, run complex table joins, and optimize query indexes.',
    progress: 40,
    level: 'Intermediate',
    lessons: '18 Lessons',
    color: '#00E5FF',
    link: '/simulators/sql'
  },
  {
    title: 'Power BI Business Intelligence',
    desc: 'Build dynamic reports, set up star schemas, write DAX calculations, and publish dashboards.',
    progress: 10,
    level: 'Advanced',
    lessons: '15 Lessons',
    color: '#F2C811',
    link: '/simulators/powerbi'
  },
  {
    title: 'Tableau Visual Analytics',
    desc: 'Design beautiful visual representations, construct story points, and run LOD calculations.',
    progress: 0,
    level: 'Intermediate',
    lessons: '10 Lessons',
    color: '#E97627',
    link: '/simulators/tableau'
  },
  {
    title: 'Python for Data Science',
    desc: 'Load Pandas DataFrames, clean outliers, plot visual metrics with Seaborn, and construct ML models.',
    progress: 0,
    level: 'Advanced',
    lessons: '22 Lessons',
    color: '#3776AB',
    link: '/courses'
  }
];

const telemetryLogs = [
  { time: '15:28:12', type: 'SUCCESS', msg: 'SQL query test verified: Sales Attribution Lab' },
  { time: '14:02:45', type: 'COMPLETED', msg: 'Excel Workbook submitted: Quarterly Growth Model' },
  { time: '11:40:19', type: 'INFO', msg: 'System check: Firebase storage latency optimized' },
  { time: '09:12:04', type: 'XP_GAIN', msg: 'Earned +450 XP for daily study streak milestone' },
];

export default function RootDashboardPage() {
  return (
    <DashboardLayout>
      {/* Welcome Banner / Overview telemetry */}
      <div className="mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-xl glass-panel relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#00E5FF]/10 via-[#4FC3F7]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#00E5FF]/5 rounded-full blur-2xl pointer-events-none" />
          
          <span className="px-3 py-1 text-[10px] font-mono border border-[#00E5FF]/30 text-[#00E5FF] rounded bg-[#00E5FF]/5 uppercase tracking-widest">
            Command Center Active
          </span>
          <h1 className="text-3xl md:text-4xl font-black mt-4 text-white tracking-wide font-display">
            WELCOME BACK, <span className="neon-text-primary">ANALYST GUEST</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mt-2 text-sm md:text-base leading-relaxed">
            Welcome to the AnalyticsRise Operations Center. Access your tools, load datasets, practice real-world business scenarios, and track your credentials from your console.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <Link href="/courses" className="px-6 py-2.5 cyber-button text-xs font-bold tracking-widest">
              Resume Active Course
            </Link>
            <Link href="/practice" className="px-6 py-2.5 cyber-button-secondary text-xs font-bold tracking-widest">
              Load Practice Labs
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Grid: Core telemetry panels */}
      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        
        {/* Core telemetry cards */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
          {/* Quick Simulators Launcher */}
          <div className="p-6 rounded-xl glass-panel relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-display mb-2 uppercase tracking-wider">
                Interactive Simulators
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Run professional software applications inside sandbox environments. Select your application core:
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/simulators/excel" className="p-3 bg-white/5 border border-white/5 hover:border-[#107C41]/50 hover:bg-[#107C41]/5 rounded text-center transition-all duration-300">
                <span className="block text-xs font-bold text-[#107C41] mb-1 font-mono uppercase">Excel</span>
                <span className="text-[10px] text-slate-400">Spreadsheets</span>
              </Link>
              <Link href="/simulators/sql" className="p-3 bg-white/5 border border-white/5 hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/5 rounded text-center transition-all duration-300">
                <span className="block text-xs font-bold text-[#00E5FF] mb-1 font-mono uppercase">SQL Console</span>
                <span className="text-[10px] text-slate-400">Database Queries</span>
              </Link>
              <Link href="/simulators/powerbi" className="p-3 bg-white/5 border border-white/5 hover:border-[#F2C811]/50 hover:bg-[#F2C811]/5 rounded text-center transition-all duration-300">
                <span className="block text-xs font-bold text-[#F2C811] mb-1 font-mono uppercase">Power BI</span>
                <span className="text-[10px] text-slate-400">Dashboard Builder</span>
              </Link>
              <Link href="/simulators/tableau" className="p-3 bg-white/5 border border-white/5 hover:border-[#E97627]/50 hover:bg-[#E97627]/5 rounded text-center transition-all duration-300">
                <span className="block text-xs font-bold text-[#E97627] mb-1 font-mono uppercase">Tableau</span>
                <span className="text-[10px] text-slate-400">Workbook Canvas</span>
              </Link>
            </div>
          </div>

          {/* Assessment metrics */}
          <div className="p-6 rounded-xl glass-panel relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-display mb-2 uppercase tracking-wider">
                System Stats
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Current metrics synced from verification servers:
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Certification Progress</span>
                  <span className="text-[#00E5FF]">2 / 5 Complete</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#00E5FF] h-full" style={{ width: '40%' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 border border-white/5 rounded">
                  <span className="text-[10px] text-slate-500 font-mono block uppercase">Labs Passed</span>
                  <span className="text-lg font-mono font-bold text-white">16</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded">
                  <span className="text-[10px] text-slate-500 font-mono block uppercase">Success Rate</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">92.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry log terminal */}
        <div className="p-6 rounded-xl glass-panel flex flex-col justify-between h-full bg-[#07090D]/90 border border-[#00E5FF]/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E5FF] to-transparent" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse" />
                Live Log Telemetry
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">AR-OS v1.0.4</span>
            </div>
            
            <div className="space-y-3 font-mono text-xs text-slate-300">
              {telemetryLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 leading-relaxed">
                  <span className="text-slate-500">[{log.time}]</span>
                  <span className={
                    log.type === 'SUCCESS' ? 'text-emerald-400' :
                    log.type === 'COMPLETED' ? 'text-[#00E5FF]' :
                    log.type === 'XP_GAIN' ? 'text-[#4FC3F7]' : 'text-slate-500'
                  }>
                    {log.type}
                  </span>
                  <span className="text-slate-300">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>RECEIVING CHANNELS [4/4]</span>
            <span className="animate-pulse text-[#00E5FF]">ON_STANDBY</span>
          </div>
        </div>

      </div>

      {/* Learning paths container */}
      <div>
        <h2 className="text-xl font-bold text-white font-display mb-6 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-5 h-5 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
          ACTIVE LEARNING MODULES
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, idx) => (
            <div 
              key={idx} 
              className="rounded-xl glass-panel glass-panel-hover p-6 flex flex-col justify-between border-t-2"
              style={{ borderTopColor: mod.color }}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-0.5 text-[9px] font-mono bg-white/5 rounded border border-white/5 text-slate-400 uppercase tracking-widest">
                    {mod.level}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{mod.lessons}</span>
                </div>

                <h3 className="text-lg font-bold text-white font-display mt-2 group-hover:text-[#00E5FF] transition-colors leading-tight">
                  {mod.title}
                </h3>
                
                <p className="text-xs text-slate-400 mt-3 leading-relaxed mb-6">
                  {mod.desc}
                </p>
              </div>

              <div>
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1">
                    <span>Syllabus Progress</span>
                    <span className="text-white">{mod.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500" 
                      style={{ 
                        width: `${mod.progress}%`,
                        backgroundColor: mod.color 
                      }} 
                    />
                  </div>
                </div>

                {mod.progress > 0 ? (
                  <Link href={mod.link} className="w-full py-2 flex-center cyber-button text-[10px] font-bold tracking-widest text-center">
                    Continue Module
                  </Link>
                ) : (
                  <Link href={mod.link} className="w-full py-2 flex-center cyber-button-secondary text-[10px] font-bold tracking-widest text-center">
                    Start Module
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
