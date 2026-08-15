'use client';

import React from 'react';
import Link from 'next/link';

export function RevenueRiseFooter() {
  return (
    <footer className="border-t border-white/5 py-8 px-6 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
      <div>
        <span>RevenueRiseAI &copy; {new Date().getFullYear()} AnalyticsRise. All rights reserved.</span>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="hover:text-slate-300 transition-colors">
          Status: Operational
        </Link>
        <Link href="/settings" className="hover:text-slate-300 transition-colors">
          Security & Privacy
        </Link>
        <Link href="/" className="hover:text-slate-300 transition-colors">
          AnalyticsRise Ecosystem
        </Link>
      </div>
    </footer>
  );
}
