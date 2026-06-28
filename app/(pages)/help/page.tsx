'use client';

import React from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';

const FAQS = [
  { q: 'How do I submit my completed spreadsheets in Excel labs?', a: 'Write the validated formula inside the specified target cell (e.g. B6) and hit ENTER on your keyboard. If the parameters match corporate requirements, the telemetry system will automatically update progress.' },
  { q: 'Why did my SQL query return a schema error?', a: 'Make sure your query selects the exact columns required in the lab guidelines. Ensure you use lowercase column names and do not reference tables other than "orders".' },
  { q: 'How can I download my verified credentials?', a: 'Once an assessment is completed with an 80% score or higher, navigate to the Certifications page, click "View Credential", and share the cryptographic verify hash.' }
];

export default function HelpDocs() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Support Deck</span>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
          OPERATIONS USER MANUAL
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Read guides on configuring simulators, query rules, and profile settings.
        </p>
      </div>

      <div className="space-y-6">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="glass-panel p-6">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider mb-2">
              Q: {faq.q}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
