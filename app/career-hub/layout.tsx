'use client';

import React from 'react';
import { Sidebar } from '@/app/components/navigation/NavControls';

const navigationItems = [
  { label: 'Dashboard', href: '/career-hub', icon: <span>📊</span> },
  { label: 'Resume Builder', href: '/career-hub/resume-builder', icon: <span>📝</span> },
  { label: 'Portfolio Builder', href: '/career-hub/portfolio-builder', icon: <span>📁</span> },
  { label: 'Job Explorer', href: '/career-hub/job-explorer', icon: <span>💼</span> },
  { label: 'Interview Preparation', href: '/career-hub/interview-prep', icon: <span>❓</span> },
  { label: 'Career Roadmap', href: '/career-hub/career-roadmap', icon: <span>🗺️</span> },
  { label: 'Skill Gap Analysis', href: '/career-hub/skill-gap-analysis', icon: <span>🔎</span> },
  { label: 'Application Tracker', href: '/career-hub/application-tracker', icon: <span>📅</span> },
];

export default function CareerHubLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div className="flex min-h-screen bg-[#05070B] text-[#F5F7FA]">
      <Sidebar items={navigationItems} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex-1 ml-0 md:ml-64 lg:ml-64 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
