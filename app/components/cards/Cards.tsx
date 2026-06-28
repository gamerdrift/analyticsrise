'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ShieldCheck, Award, MapPin, Building, Play, Download, ArrowUpRight } from 'lucide-react';

// --- STANDARD CARD ---
interface StandardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function StandardCard({ className, title, subtitle, children, ...props }: StandardCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'p-5 rounded-lg border border-slate-800 bg-[#0D1117]/60 text-slate-100 flex flex-col justify-between hover:border-slate-700 transition-colors',
          className
        )
      )}
      {...props}
    >
      <div>
        {title && <h4 className="text-sm font-bold font-display uppercase tracking-wider text-white mb-1">{title}</h4>}
        {subtitle && <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-4">{subtitle}</span>}
      </div>
      <div className="text-xs text-slate-400">{children}</div>
    </div>
  );
}

// --- GLASS CARD ---
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'cyan' | 'blue' | 'green';
  children: React.ReactNode;
}

export function GlassCard({ className, glowColor = 'cyan', children, ...props }: GlassCardProps) {
  const glowShadows = {
    cyan: 'hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] hover:border-[#00E5FF]/30',
    blue: 'hover:shadow-[0_0_20px_rgba(79,195,247,0.1)] hover:border-[#4FC3F7]/30',
    green: 'hover:shadow-[0_0_20px_rgba(0,230,118,0.1)] hover:border-[#00E676]/30',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'p-6 rounded-xl border border-white/5 bg-[#0D1117]/50 backdrop-blur-md transition-all duration-300',
          glowShadows[glowColor],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// --- MISSION CARD ---
interface MissionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  xpReward: number;
  objective: string;
  progress: number; // 0 to 100
}

export function MissionCard({ className, title, xpReward, objective, progress, ...props }: MissionCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'p-5 rounded-lg border border-slate-800 bg-[#0D1117]/80 flex flex-col justify-between hover:border-[#00E5FF]/20 transition-all relative overflow-hidden',
          className
        )
      )}
      {...props}
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00E5FF]" />
      
      <div className="pl-2">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-xs font-bold font-display uppercase tracking-widest text-white">{title}</h4>
          <span className="text-[9px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/20 font-black">
            +{xpReward} XP
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">{objective}</p>
      </div>

      <div className="pl-2">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1.5">
          <span>Objective Progress</span>
          <span className="text-white font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#00E5FF] h-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

// --- SIMULATOR CARD ---
interface SimulatorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  toolName: string;
  description: string;
  logoColor: string;
  link: string;
}

export function SimulatorCard({ className, toolName, description, logoColor, link, ...props }: SimulatorCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'p-5 rounded-xl border border-white/5 bg-[#0D1117]/60 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group',
          className
        )
      )}
      {...props}
    >
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: logoColor }} />

      <div>
        <span className="text-[9px] font-mono tracking-widest uppercase block mb-1 text-slate-500">Workspace Simulator</span>
        <h4 className="text-base font-bold font-display uppercase tracking-wider text-white mb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: logoColor }} />
          {toolName}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">{description}</p>
      </div>

      <a
        href={link}
        className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded border border-slate-700 hover:border-white text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all bg-[#05070B]"
      >
        <Play className="w-3.5 h-3.5 fill-current shrink-0" />
        Launch Sandbox
      </a>
    </div>
  );
}

// --- CERTIFICATION CARD ---
interface CertificationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  courseTitle: string;
  verifyHash: string;
  issueDate: string;
}

export function CertificationCard({ className, courseTitle, verifyHash, issueDate, ...props }: CertificationCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'p-6 rounded-xl border border-[#00E5FF]/20 bg-[#07090D]/90 backdrop-blur-md relative overflow-hidden shadow-2xl group hover:border-[#00E5FF]/50 transition-all duration-500',
          className
        )
      )}
      {...props}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7]" />
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#00E5FF]" />
          <span className="text-[10px] font-display font-black text-white uppercase tracking-wider">AnalyticsRise Verified</span>
        </div>
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
      </div>

      <div className="space-y-4 mb-6">
        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">CREDENTIAL HOLDER CERTIFICATE</span>
        <h4 className="text-lg font-bold text-white font-display tracking-wider uppercase leading-tight">{courseTitle}</h4>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-[9px] font-mono text-slate-500">
        <div>
          <span className="block uppercase text-[8px] text-slate-600 mb-1">VERIFICATION HASH</span>
          <span className="text-slate-300 font-bold block truncate">{verifyHash}</span>
        </div>
        <div className="text-right">
          <span className="block uppercase text-[8px] text-slate-600 mb-1">ISSUE TIMESTAMP</span>
          <span className="text-slate-300 font-bold block">{issueDate}</span>
        </div>
      </div>
    </div>
  );
}

// --- STATISTIC CARD ---
interface StatisticCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function StatisticCard({ className, label, value, change, changeType = 'neutral', ...props }: StatisticCardProps) {
  const changeColors = {
    positive: 'text-emerald-400',
    negative: 'text-rose-500',
    neutral: 'text-slate-500',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'p-5 rounded-lg border border-slate-800 bg-[#0D1117]/60 flex flex-col justify-between',
          className
        )
      )}
      {...props}
    >
      <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block mb-1">{label}</span>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-black text-white font-display">{value}</span>
        {change && (
          <span className={clsx('text-[10px] font-mono font-bold leading-none', changeColors[changeType])}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

// --- USER CARD ---
interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role: string;
  xp: number;
  level: number;
}

export function UserCard({ className, name, role, xp, level, ...props }: UserCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'p-5 rounded-xl border border-slate-800 bg-[#0A0D12]/50 flex items-center justify-between',
          className
        )
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-[#00E5FF]/20 bg-slate-800 flex items-center justify-center font-bold font-mono text-[#00E5FF]">
          {name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <span className="block text-sm font-semibold text-white">{name}</span>
          <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">{role}</span>
        </div>
      </div>
      
      <div className="text-right font-mono text-xs">
        <span className="block text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">TELEMETRY SCORE</span>
        <span className="text-white font-bold block">LVL {level} <span className="text-[#00E5FF] ml-1">{xp.toLocaleString()} XP</span></span>
      </div>
    </div>
  );
}

// --- RESUME CARD ---
interface ResumeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  fileName: string;
  fileSize: string;
  uploadDate: string;
}

export function ResumeCard({ className, fileName, fileSize, uploadDate, ...props }: ResumeCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'p-4 rounded-lg border border-slate-800 bg-[#0D1117] flex items-center justify-between',
          className
        )
      )}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded bg-white/5 border border-white/5 flex items-center justify-center text-slate-400">
          <Download className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="block text-xs font-bold text-white truncate">{fileName}</span>
          <span className="block text-[9px] font-mono text-slate-500 mt-0.5">{fileSize} | Uploaded {uploadDate}</span>
        </div>
      </div>
      <button className="p-1.5 text-slate-400 hover:text-[#00E5FF] transition-colors focus:outline-none" aria-label="Download document">
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// --- JOB CARD ---
interface JobCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
}

export function JobCard({ className, title, company, location, salary, tags, ...props }: JobCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'p-5 rounded-xl border border-slate-800 bg-[#0D1117]/60 hover:border-[#4FC3F7]/30 transition-all flex flex-col justify-between',
          className
        )
      )}
      {...props}
    >
      <div>
        <div className="flex justify-between items-start gap-4 mb-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h4>
          <span className="text-[10px] font-mono font-bold text-[#00E5FF]">{salary}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500 font-mono mb-4">
          <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 shrink-0" /> {company}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 shrink-0" /> {location}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-slate-400 border border-white/5">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// --- COMPANY CARD ---
interface CompanyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  industry: string;
  openJobs: number;
}

export function CompanyCard({ className, name, industry, openJobs, ...props }: CompanyCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'p-5 rounded-lg border border-slate-800 bg-[#0D1117] flex items-center justify-between hover:border-[#00E5FF]/20 transition-all',
          className
        )
      )}
      {...props}
    >
      <div>
        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">{name}</h4>
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 block">{industry}</span>
      </div>

      <span className="text-[9px] font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-1 rounded border border-[#00E5FF]/20 uppercase">
        {openJobs} Open Positions
      </span>
    </div>
  );
}
