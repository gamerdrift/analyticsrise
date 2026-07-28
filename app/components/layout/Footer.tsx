'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, ShieldCheck, Lock, Sparkles, Cpu, Clock, CheckCircle2, Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#00E5FF]/20 bg-[#07090E] pt-12 pb-8 px-6 text-xs font-mono text-slate-400 relative overflow-hidden z-20">
      {/* Background Neon Accent Glow */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10 relative z-10">
        {/* Column 1: AnalyticsRise Brand */}
        <div className="space-y-4 sm:col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00E5FF] to-[#4FC3F7] flex items-center justify-center font-bold text-black text-base font-display tracking-tighter shadow-md shadow-[#00E5FF]/20">
              AR
            </div>
            <span className="font-display font-black text-white text-base tracking-wider uppercase">
              Analytics<span className="text-[#00E5FF]">Rise</span>
            </span>
          </Link>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            The premier enterprise-grade, browser-native software simulator and AI career intelligence platform.
          </p>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href="/about" className="hover:text-[#00E5FF] transition-colors">About AnalyticsRise</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#00E5FF] transition-colors">Contact Support</Link>
            </li>
            <li className="text-slate-500 flex items-center gap-1.5">
              <span>Careers</span> <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-amber-400 font-bold uppercase">Coming Soon</span>
            </li>
          </ul>
        </div>

        {/* Column 2: Learning & Career */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-[#00E5FF]/20 pb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#00E5FF]" /> Learning & Career
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/get-hired" className="text-[#00E5FF] font-bold hover:underline transition-all">
                🎯 Get Hired (Jobs Hub)
              </Link>
            </li>
            <li>
              <Link href="/courses" className="hover:text-[#00E5FF] transition-colors">All Courses</Link>
            </li>
            <li>
              <Link href="/practice" className="hover:text-[#00E5FF] transition-colors">Practice Labs</Link>
            </li>
            <li>
              <Link href="/simulators" className="hover:text-[#00E5FF] transition-colors">Software Simulators</Link>
            </li>
            <li>
              <Link href="/excel-studio" className="hover:text-[#00E5FF] transition-colors">Excel Studio Pro</Link>
            </li>
            <li>
              <Link href="/certifications" className="hover:text-[#00E5FF] transition-colors">Certifications</Link>
            </li>
            <li>
              <Link href="/career-hub" className="hover:text-[#00E5FF] transition-colors">Career Hub & AI Resume</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Learner Support */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-[#00E5FF]/20 pb-2">
            Support
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/help" className="hover:text-[#00E5FF] transition-colors">Help Center</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-[#00E5FF] transition-colors">FAQ & Solutions</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#00E5FF] transition-colors">Report a Bug</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#00E5FF] transition-colors">Beta Feedback</Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-[#00E5FF] transition-colors">Community Forum</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal & Compliance */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-[#00E5FF]/20 pb-2">
            Legal & Compliance
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/privacy" className="hover:text-[#00E5FF] transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#00E5FF] transition-colors">Terms of Service</Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-[#00E5FF] transition-colors">Cookie Policy</Link>
            </li>
            <li className="pt-2 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> SSL Encrypted
            </li>
          </ul>
        </div>

        {/* Column 5: Official Support Desk */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-[#00E5FF]/20 pb-2">
            Official Desk
          </h3>
          <div className="space-y-3">
            <p className="text-slate-400 text-xs leading-relaxed">
              Official Learner & Technical Support Email:
            </p>
            <a
              href="mailto:support@analyticsrise.com"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-bold hover:bg-[#00E5FF]/20 transition-all text-xs break-all"
            >
              <Mail className="w-4 h-4 shrink-0" /> support@analyticsrise.com
            </a>
            <div className="text-[10px] text-slate-500 space-y-1 pt-1">
              <p className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#00E5FF]" /> SLA: &lt; 24 Hours
              </p>
              <p>🌐 Mon – Fri: 9 AM – 6 PM EST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges & Copyright Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1 text-slate-400">
            <Lock className="w-3 h-3 text-[#00E5FF]" /> Secure Authentication
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3 h-3 text-amber-400" /> AI Career Match
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Cpu className="w-3 h-3 text-emerald-400" /> Real Business Datasets
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <CheckCircle2 className="w-3 h-3 text-[#00E5FF]" /> Enterprise Job Hub
          </span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} ANALYTICSRISE. ALL RIGHTS RESERVED. RELEASE v1.0.0-BETA.
        </div>
      </div>
    </footer>
  );
}
