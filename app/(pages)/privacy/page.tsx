'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Mail, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#00E5FF] text-xs font-mono uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="border-b border-white/10 pb-6 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wider">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-xs font-mono">
            Effective Date: January 1, 2026 | SSL Secured
          </p>
        </div>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed font-sans">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-mono uppercase">1. Information We Collect</h2>
            <p>
              AnalyticsRise collects information you provide directly when registering (name, email address), learning progress telemetry (completed missions, simulator usage), and technical browser metadata necessary for security and localization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-mono uppercase">2. How We Use Information</h2>
            <p>
              Your data is used exclusively to deliver interactive simulator experiences, validate mission completions, issue skill certifications, provide AI mentor suggestions, and maintain platform security. We do NOT sell your personal data to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-mono uppercase">3. Data Security & Storage</h2>
            <p>
              All traffic between your client browser and AnalyticsRise is encrypted via SSL/TLS protocol. Simulator state and progress metrics are cached locally and securely transmitted.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-mono uppercase">4. Privacy Contact & Data Requests</h2>
            <p>
              To request data export or deletion under GDPR / CCPA, or if you have privacy concerns, please contact our Privacy Data Officer at:
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
