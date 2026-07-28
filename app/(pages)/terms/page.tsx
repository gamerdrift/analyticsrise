'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#00E5FF] text-xs font-mono uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="border-b border-white/10 pb-6 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wider">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-xs font-mono">
            Effective Date: January 1, 2026 | Release Baseline v1.0.0-beta
          </p>
        </div>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed font-sans">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-mono uppercase">1. Acceptance of Terms</h2>
            <p>
              By accessing or using AnalyticsRise (&quot;Platform&quot;, &quot;Service&quot;, &quot;We&quot;), operated at analyticsrise.com and analyticsrise-56655.web.app, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-mono uppercase">2. Description of Service</h2>
            <p>
              AnalyticsRise provides browser-native software simulators, interactive data analytics courses, skill assessments, AI mentorship, and certification tracks for tools including Excel Studio Pro, SQL, Python, Power BI, and Tableau.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-mono uppercase">3. User Accounts & Responsibilities</h2>
            <p>
              When registering an account, you agree to provide accurate registration information and keep your credentials secure. You are responsible for all activities occurring under your account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-mono uppercase">4. Intellectual Property</h2>
            <p>
              All proprietary simulator code, course curriculum, interactive exercises, datasets, branding, and graphics are the exclusive property of AnalyticsRise. Unapproved reproduction or distribution is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-mono uppercase">5. Support & Inquiries</h2>
            <p>
              For legal or administrative inquiries regarding these terms, please contact our support team at:
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
