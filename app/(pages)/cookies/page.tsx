'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#00E5FF] text-xs font-mono uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="border-b border-white/10 pb-6 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wider">
            Cookie Policy
          </h1>
          <p className="text-slate-400 text-xs font-mono">
            Effective Date: January 1, 2026
          </p>
        </div>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed font-sans">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-mono uppercase">1. What Are Cookies?</h2>
            <p>
              Cookies and local browser storage (`localStorage`) are small data tokens stored on your device when visiting websites. They allow AnalyticsRise to remember your active session, language preferences, and simulator state.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-mono uppercase">2. Essential Cookies We Use</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li><strong>Authentication Tokens</strong>: Keep you securely logged in across simulator sessions.</li>
              <li><strong>Language Preferences</strong>: Store selected language (`en`, `es`, `fr`, `de`, `hi`).</li>
              <li><strong>Simulator AutoSave</strong>: Temporarily cache active workbook states in local storage.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-mono uppercase">3. Managing Cookie Preferences</h2>
            <p>
              You can manage or clear cookies through your browser settings at any time. For questions regarding cookie management, email us at:
            </p>
            <div className="pt-2">
              <a href="mailto:support@analyticsrise.com" className="inline-flex items-center gap-2 text-[#00E5FF] font-mono font-bold text-xs underline">
                <Mail className="w-4 h-4" /> support@analyticsrise.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
