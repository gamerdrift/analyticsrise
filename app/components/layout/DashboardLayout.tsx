'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// SVG Icons for the Command Center sidebar
const Icons = {
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
    </svg>
  ),
  Courses: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Practice: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Datasets: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  Assessments: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  Certifications: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Leaderboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Community: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Admin: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Help: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

interface SidebarItem {
  name: string;
  href: string;
  icon: keyof typeof Icons;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/', icon: 'Dashboard' },
  { name: 'Courses', href: '/courses', icon: 'Courses' },
  { name: 'Practice Labs', href: '/practice', icon: 'Practice' },
  { name: 'Datasets', href: '/datasets', icon: 'Datasets' },
  { name: 'Assessments', href: '/assessments', icon: 'Assessments' },
  { name: 'Certifications', href: '/certifications', icon: 'Certifications' },
  { name: 'Leaderboard', href: '/leaderboard', icon: 'Leaderboard' },
  { name: 'Community', href: '/community', icon: 'Community' },
  { name: 'Admin Panel', href: '/admin', icon: 'Admin' },
  { name: 'Help & Docs', href: '/help', icon: 'Help' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [systemTime, setSystemTime] = useState('');

  // Clock telemetry
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setSystemTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      {/* Dynamic scanlines & background grid overlays */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-40" />
      <div className="fixed inset-0 pointer-events-none z-10 bg-gradient-to-t from-[#05070B] via-transparent to-transparent opacity-80" />

      {/* MOBILE HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 glass-panel rounded-none border-b border-white/5 flex items-center justify-between px-4 lg:hidden z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00E5FF] to-[#4FC3F7] flex items-center justify-center font-bold text-black text-lg font-display tracking-tighter">
            AR
          </div>
          <span className="font-display font-bold text-white text-lg tracking-wider">
            ANALYTICS<span className="text-[#00E5FF]">RISE</span>
          </span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-400 hover:text-[#00E5FF] transition-colors focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside 
        className={`hidden lg:flex flex-col fixed top-0 bottom-0 left-0 z-40 bg-[#0D1117]/80 border-r border-[#00E5FF]/10 backdrop-blur-md transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Logo header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 justify-between">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 min-w-[2.25rem] rounded bg-gradient-to-br from-[#00E5FF] to-[#4FC3F7] flex-center font-bold text-black text-xl font-display tracking-tighter shadow-lg shadow-[#00E5FF]/20">
              AR
            </div>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-display font-black text-white text-lg tracking-wider"
              >
                ANALYTICS<span className="text-[#00E5FF]">RISE</span>
              </motion.span>
            )}
          </Link>

          {!collapsed && (
            <button 
              onClick={() => setCollapsed(true)}
              className="text-slate-500 hover:text-[#00E5FF] transition-colors p-1"
              title="Collapse Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="flex justify-center py-4 border-b border-white/5">
            <button 
              onClick={() => setCollapsed(false)}
              className="text-slate-500 hover:text-[#00E5FF] transition-colors p-2 glass-panel border-white/5 rounded-lg"
              title="Expand Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Sidebar Nav items */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
          {sidebarItems.map((item) => {
            const Icon = Icons[item.icon];
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <div 
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all group relative cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#00E5FF]/10 to-[#4FC3F7]/5 text-white border-l-2 border-[#00E5FF]' 
                      : 'text-slate-400 hover:text-[#00E5FF] hover:bg-white/5'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <span className={`transition-colors ${isActive ? 'text-[#00E5FF]' : 'group-hover:text-[#00E5FF]'}`}>
                    <Icon />
                  </span>
                  
                  {!collapsed && (
                    <span className="text-sm font-display uppercase tracking-wider">{item.name}</span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {collapsed && (
                    <div className="absolute left-20 bg-[#0D1117] border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-display uppercase tracking-widest px-3 py-1.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                      {item.name}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer details */}
        {!collapsed && (
          <div className="p-6 border-t border-white/5 bg-[#0A0D12]/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#00E5FF]/30 bg-slate-800 flex-center text-sm font-bold font-mono text-[#00E5FF]">
                AN
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate text-white">Analyst Guest</p>
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Telemetry On
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-[#0D1117] border-r border-[#00E5FF]/10 z-50 flex flex-col lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[#00E5FF] flex-center font-bold text-black text-lg">
                    AR
                  </div>
                  <span className="font-display font-bold text-white text-lg tracking-wider">
                    ANALYTICS<span className="text-[#00E5FF]">RISE</span>
                  </span>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = Icons[item.icon];
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)}>
                      <div 
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all ${
                          isActive 
                            ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-l-2 border-[#00E5FF]' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon />
                        <span className="text-sm font-display uppercase tracking-wider">{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-white/5 bg-[#0A0D12]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-[#00E5FF]/30 bg-slate-800 flex-center text-sm font-bold font-mono text-[#00E5FF]">
                    AN
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Analyst Guest</p>
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Telemetry On
                    </span>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN VIEWPORT */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 z-10 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        } pt-16 lg:pt-0`}
      >
        {/* TELEMETRY TOP BAR */}
        <div className="h-20 border-b border-white/5 px-6 lg:px-8 flex items-center justify-between bg-[#05070B]/50 backdrop-blur-sm z-30">
          <div className="hidden sm:block">
            <span className="text-xs text-[#9AA5B1] font-mono tracking-widest uppercase">System Telemetry</span>
            <p className="text-sm text-[#00E5FF] font-mono font-bold glow-text mt-0.5">{systemTime}</p>
          </div>

          {/* User Status Telemetry readout */}
          <div className="flex items-center gap-6 font-mono text-xs">
            {/* Rank / Level */}
            <div className="flex flex-col items-end">
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">Rank Level</span>
              <span className="text-white font-bold text-sm tracking-wide">
                Lvl 04 <span className="text-[#00E5FF] text-xs">Jr. Architect</span>
              </span>
            </div>

            <div className="h-8 w-px bg-white/10" />

            {/* Platform Points */}
            <div className="flex flex-col items-end">
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">Data Score</span>
              <span className="text-[#00E5FF] font-bold text-sm tracking-wide font-mono">14,200 XP</span>
            </div>

            <div className="h-8 w-px bg-white/10" />

            {/* Active Streak */}
            <div className="flex flex-col items-end">
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">Active Streak</span>
              <span className="text-[#4FC3F7] font-bold text-sm flex items-center gap-1">
                <svg className="w-4 h-4 text-[#4FC3F7]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                12 Days
              </span>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-cyber-radial">
          {children}
        </main>
      </div>
    </div>
  );
}
