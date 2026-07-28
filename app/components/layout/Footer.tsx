'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, ShieldCheck, Lock, Sparkles, Code, Cpu, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#00E5FF]/20 bg-[#07090E] pt-12 pb-8 px-6 text-xs font-mono text-slate-400 relative overflow-hidden z-20">
      {/* Background Neon Accent Glow */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 relative z-10">
        {/* Column 1: Brand & Overview */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00E5FF] to-[#4FC3F7] flex items-center justify-center font-bold text-black text-lg font-display tracking-tighter shadow-md shadow-[#00E5FF]/20">
              AR
            </div>
            <span className="font-display font-black text-white text-base tracking-wider uppercase">
              Analytics<span className="text-[#00E5FF]">Rise</span>
            </span>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed">
            The premier enterprise-grade, browser-based data analytics simulator platform. Master SQL, Excel, Python, Power BI, and Tableau through hands-on practice.
          </p>
          <div className="flex items-center gap-2 text-[#00E5FF] text-[10px] font-bold uppercase tracking-widest pt-1">
            <ShieldCheck className="w-4 h-4" /> SSL Protection Verified
          </div>
        </div>

        {/* Column 2: Navigation & Simulators */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-[#00E5FF]/20 pb-2">
            Navigation & Simulators
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/about" className="hover:text-[#00E5FF] transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/courses" className="hover:text-[#00E5FF] transition-colors">
                Courses & Paths
              </Link>
            </li>
            <li>
              <Link href="/simulators" className="hover:text-[#00E5FF] transition-colors">
                All Simulators
              </Link>
            </li>
            <li>
              <Link href="/excel-studio" className="hover:text-[#00E5FF] transition-colors">
                Excel Studio Pro
              </Link>
            </li>
            <li>
              <Link href="/career-hub" className="hover:text-[#00E5FF] transition-colors">
                Career Hub
              </Link>
            </li>
            <li>
              <Link href="/assessments" className="hover:text-[#00E5FF] transition-colors">
                Skill Assessments
              </Link>
            </li>
            <li>
              <Link href="/certifications" className="hover:text-[#00E5FF] transition-colors">
                Certifications
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Trust & Platform */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-[#00E5FF]/20 pb-2">
            Support & Resources
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/contact" className="hover:text-[#00E5FF] transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-[#00E5FF] transition-colors">
                Help & Documentation
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-[#00E5FF] transition-colors">
                Frequently Asked Questions (FAQ)
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-[#00E5FF] transition-colors">
                Community Forum
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-[#00E5FF] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#00E5FF] transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-[#00E5FF] transition-colors">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Support Email */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-[#00E5FF]/20 pb-2">
            Official Support
          </h3>
          <div className="space-y-3">
            <p className="text-slate-400 text-xs">
              Have questions or need assistance? Reach out to our dedicated support team:
            </p>
            <a
              href="mailto:support@analyticsrise.com"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-bold hover:bg-[#00E5FF]/20 transition-all text-xs"
            >
              <Mail className="w-4 h-4" /> support@analyticsrise.com
            </a>
            <div className="text-[10px] text-slate-500 space-y-1 pt-2">
              <p>⚡ Typical response time: &lt; 24 hours</p>
              <p>🌐 Business hours: 9:00 AM – 6:00 PM EST</p>
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
            <Sparkles className="w-3 h-3 text-amber-400" /> AI Powered Mentorship
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Cpu className="w-3 h-3 text-emerald-400" /> Real Business Datasets
          </span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} ANALYTICSRISE. ALL RIGHTS RESERVED. RELEASE v1.0.0-BETA.
        </div>
      </div>
    </footer>
  );
}
