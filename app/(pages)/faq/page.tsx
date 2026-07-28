'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Sparkles, Mail, ShieldCheck } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: React.ReactNode;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-registration',
    category: 'Registration',
    question: 'How do I create a free AnalyticsRise account?',
    answer: (
      <span>
        Click the <strong>Register</strong> button in the top navigation bar or go to{' '}
        <Link href="/register" className="text-[#00E5FF] underline font-mono">
          /register
        </Link>
        . Provide your name, email, and password to immediately unlock access to free learning tracks and simulators.
      </span>
    ),
  },
  {
    id: 'faq-login',
    category: 'Login',
    question: 'How do I log into my existing account?',
    answer: (
      <span>
        Navigate to{' '}
        <Link href="/login" className="text-[#00E5FF] underline font-mono">
          /login
        </Link>
        . Enter your registered email address and password. You will be redirected to your personal learning dashboard.
      </span>
    ),
  },
  {
    id: 'faq-forgot-password',
    category: 'Forgot Password',
    question: 'What if I forget my password?',
    answer: (
      <span>
        Visit the{' '}
        <Link href="/forgot-password" className="text-[#00E5FF] underline font-mono">
          Forgot Password
        </Link>{' '}
        page. Enter your account email to receive a password reset link.
      </span>
    ),
  },
  {
    id: 'faq-certificates',
    category: 'Certificates',
    question: 'How do I earn verifiable analytics certificates?',
    answer: (
      <span>
        Complete all mission challenges and pass the skill assessment in any track (e.g. Excel Studio Pro or SQL Analytics). Once verified, your digital certificate badge is issued under{' '}
        <Link href="/certifications" className="text-[#00E5FF] underline font-mono">
          /certifications
        </Link>
        .
      </span>
    ),
  },
  {
    id: 'faq-courses',
    category: 'Courses',
    question: 'What courses and learning paths are available?',
    answer: (
      <span>
        AnalyticsRise offers structured tracks in Excel Studio Pro, SQL Analytics, Python Data Science, Power BI Dashboarding, and Tableau Visualizations. Explore full paths at{' '}
        <Link href="/courses" className="text-[#00E5FF] underline font-mono">
          /courses
        </Link>
        .
      </span>
    ),
  },
  {
    id: 'faq-ai-mentor',
    category: 'AI Mentor',
    question: 'How does the AI Excel Mentor assist my learning?',
    answer: (
      <span>
        The AI Mentor provides natural-language to formula translation, nested formula breakdowns, and formula error diagnosis in real time directly inside the Excel Studio Pro workspace.
      </span>
    ),
  },
  {
    id: 'faq-simulators',
    category: 'Simulators',
    question: 'Do I need to install Microsoft Excel or Python locally?',
    answer: (
      <span>
        No! All AnalyticsRise simulators run 100% inside your web browser. There is no software installation required.
      </span>
    ),
  },
  {
    id: 'faq-support',
    category: 'Support',
    question: 'How do I contact learner support?',
    answer: (
      <span>
        Reach our support desk anytime at{' '}
        <a href="mailto:support@analyticsrise.com" className="text-[#00E5FF] font-mono font-bold underline">
          support@analyticsrise.com
        </a>
        . Our technical team responds within 24 hours.
      </span>
    ),
  },
  {
    id: 'faq-billing',
    category: 'Billing (Coming Soon)',
    question: 'Is AnalyticsRise free or paid?',
    answer: (
      <span>
        AnalyticsRise baseline features are free during Release v1.0.0-beta. Pro tier subscription billing and premium career mentoring will launch in upcoming releases.
      </span>
    ),
  },
  {
    id: 'faq-enterprise',
    category: 'Enterprise (Coming Soon)',
    question: 'Can I purchase team licenses for my company or university?',
    answer: (
      <span>
        Yes! Enterprise team dashboards, custom dataset uploads, and LMS integration options are launching soon. Contact{' '}
        <a href="mailto:support@analyticsrise.com" className="text-[#00E5FF] font-mono font-bold underline">
          support@analyticsrise.com
        </a>{' '}
        for early access.
      </span>
    ),
  },
];

export default function FAQPage() {
  const [openIds, setOpenIds] = useState<string[]>(['faq-registration', 'faq-simulators']);

  const toggle = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-mono font-bold tracking-widest uppercase mb-2">
            <HelpCircle className="w-4 h-4" /> Help Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-wider uppercase">
            Frequently Asked <span className="text-[#00E5FF]">Questions</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Everything you need to know about AnalyticsRise accounts, simulators, certificates, AI mentorship, and support.
          </p>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="rounded-xl bg-[#0D1117] border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-mono hover:bg-white/5 transition-colors focus:outline-none"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest">
                      {faq.category}
                    </span>
                    <h3 className="text-base font-bold text-white">{faq.question}</h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#00E5FF]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-300 text-sm border-t border-white/5 leading-relaxed font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct Email Support Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0D1117] to-[#0A121E] border border-[#00E5FF]/30 text-center space-y-3">
          <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">Still Have Questions?</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            Our support engineers are available to help you. Send us an email directly:
          </p>
          <div>
            <a
              href="mailto:support@analyticsrise.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#4FC3F7] transition-all shadow-md shadow-[#00E5FF]/20"
            >
              <Mail className="w-4 h-4" /> support@analyticsrise.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
