'use client';

import React from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';

const DISCUSSIONS = [
  { id: 1, title: 'How to optimize SQL window functions for giant subqueries?', author: 'SQL_Wizard', replies: 12, category: 'SQL Databases' },
  { id: 2, title: 'Help with Excel Sensitivity Data tables calculation error in Lab 2', author: 'Analyst_John', replies: 4, category: 'Spreadsheets' },
  { id: 3, title: 'Best practices for organizing star schema modeling in Power BI?', author: 'PowerUser', replies: 8, category: 'Business Intelligence' }
];

export default function CommunityPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Communication deck</span>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
          ANALYST NETWORK FORUM
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Connect with thousands of students, share optimization tricks, and debug simulator scripts.
        </p>
      </div>

      <div className="space-y-4">
        {DISCUSSIONS.map((post) => (
          <div key={post.id} className="glass-panel p-5 flex flex-between hover:border-[#00E5FF]/20 transition-all cursor-pointer">
            <div>
              <span className="text-[9px] font-mono bg-white/5 border border-white/5 text-[#00E5FF] px-2 py-0.5 rounded uppercase">
                {post.category}
              </span>
              <h3 className="text-sm font-semibold text-slate-200 mt-2 font-display uppercase tracking-wide">
                {post.title}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono mt-1">Logged by: {post.author}</p>
            </div>
            <div className="text-right text-xs font-mono text-slate-500">
              <span className="block font-bold text-white">{post.replies}</span>
              <span>replies</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
