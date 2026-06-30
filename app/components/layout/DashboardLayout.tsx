'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/app/components/ThemeProvider';
import { LoadingOverlay } from '@/app/components/ui/Loading';
import LanguageSwitcher from '@/app/components/i18n/LanguageSwitcher';
import {
  LayoutDashboard,
  Target,
  BookOpen,
  Terminal,
  Cpu,
  Database,
  FileCheck,
  Award,
  Briefcase,
  Users,
  Trophy,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const iconsMap = {
  Dashboard: LayoutDashboard,
  Missions: Target,
  Courses: BookOpen,
  Practice: Terminal,
  Simulators: Cpu,
  Datasets: Database,
  Assessments: FileCheck,
  Certifications: Award,
  Career: Briefcase,
  Community: Users,
  Leaderboard: Trophy,
  Achievements: Star,
  Settings: Settings,
  Support: HelpCircle,
  Logout: LogOut
};

interface SidebarItem {
  name: string;
  href: string;
  iconName: keyof typeof iconsMap;
  isTab?: boolean;
  tabName?: string;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', iconName: 'Dashboard' },
  { name: 'Learning Missions', href: '/dashboard?tab=missions', iconName: 'Missions', isTab: true, tabName: 'missions' },
  { name: 'Courses', href: '/courses', iconName: 'Courses' },
  { name: 'Practice Labs', href: '/practice', iconName: 'Practice' },
  { name: 'Simulators', href: '/dashboard?tab=simulators', iconName: 'Simulators', isTab: true, tabName: 'simulators' },
  { name: 'Datasets', href: '/datasets', iconName: 'Datasets' },
  { name: 'Assessments', href: '/assessments', iconName: 'Assessments' },
  { name: 'Certifications', href: '/certifications', iconName: 'Certifications' },
  { name: 'Career Center', href: '/dashboard?tab=career', iconName: 'Career', isTab: true, tabName: 'career' },
  { name: 'Community', href: '/community', iconName: 'Community' },
  { name: 'Leaderboard', href: '/leaderboard', iconName: 'Leaderboard' },
  { name: 'Achievements', href: '/dashboard?tab=achievements', iconName: 'Achievements', isTab: true, tabName: 'achievements' },
  { name: 'Settings', href: '/dashboard?tab=settings', iconName: 'Settings', isTab: true, tabName: 'settings' },
  { name: 'Support', href: '/help', iconName: 'Support' }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, loading, isAuthenticated, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Responsive state
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Interactive topbar states
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [systemTime, setSystemTime] = useState('');

  // Refs for closing menus on outside clicks
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // UTC clock telemetry
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setSystemTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle outside clicks for dropdown menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Client-side route protection
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return <LoadingOverlay message="Synchronizing secure telemetry..." />;
  }

  // Get user role display label
  const getRoleLabel = (role: string = 'student') => {
    const roles: Record<string, string> = {
      student: 'Jr. Analyst',
      instructor: 'Lead Instructor',
      admin: 'System Admin',
      recruiter: 'Hiring Partner',
      enterprise: 'Enterprise User'
    };
    return roles[role] || 'Jr. Analyst';
  };

  // Mock Notification content
  const notificationsList = [
    { id: 1, title: 'SQL Practice Complete', message: 'You earned +150 XP in SQL Databases!', type: 'success' },
    { id: 2, title: 'Assessment Reminder', message: 'Ready to take Excel advanced assessment?', type: 'info' },
    { id: 3, title: 'Daily Study Active', message: 'Streak verified at 5 consecutive days!', type: 'xp' }
  ];

  // Mock global search data
  const searchDatabase = [
    { title: 'Excel Advanced Sandbox', category: 'Simulators', href: '/simulators/excel' },
    { title: 'SQL Database Console', category: 'Simulators', href: '/simulators/sql' },
    { title: 'Power BI Business Intelligence', category: 'Courses', href: '/simulators/powerbi' },
    { title: 'Tableau Visual Analytics', category: 'Courses', href: '/simulators/tableau' },
    { title: 'E-Commerce Transactions 2026', category: 'Datasets', href: '/datasets' },
    { title: 'Sales Attribution Lab', category: 'Practice Labs', href: '/practice' }
  ];

  const filteredSearchResults = searchQuery
    ? searchDatabase.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];



  return (
    <div className="flex min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      {/* Grid background overlays */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-20" />
      <div className="fixed inset-0 pointer-events-none z-10 bg-gradient-to-t from-[#05070B] via-transparent to-transparent opacity-90" />

      {/* TOP STICKY NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/85 backdrop-blur-md border-b border-[#00E5FF]/10 flex items-center justify-between px-4 lg:px-8 z-40">
        {/* Left: Brand Logo & Mobile Trigger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-slate-400 hover:text-[#00E5FF] transition-colors focus:outline-none lg:hidden"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00E5FF] to-[#4FC3F7] flex items-center justify-center font-bold text-black text-base font-display tracking-tighter">
              AR
            </div>
            <span className="font-display font-black text-white text-base tracking-wider hidden sm:inline">
              ANALYTICS<span className="text-[#00E5FF]">RISE</span>
            </span>
          </Link>
        </div>

        {/* Center: Global Search Bar Button (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <button
            onClick={() => setShowSearch(true)}
            className="w-full flex items-center gap-3 px-4 py-2 bg-slate-900/60 border border-slate-800 hover:border-[#00E5FF]/30 text-slate-500 hover:text-slate-300 rounded-lg text-xs font-mono transition-all text-left"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Search courses, datasets, simulators...</span>
            <span className="ml-auto bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-600">CTRL K</span>
          </button>
        </div>

        {/* Right: Sticky controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Search Icon Button */}
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 text-slate-400 hover:text-[#00E5FF] transition-colors md:hidden"
            aria-label="Open Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick Help */}
          <Link
            href="/help"
            className="p-2 text-slate-400 hover:text-[#00E5FF] transition-colors hidden sm:block"
            title="Get Help & Docs"
          >
            <HelpCircle className="w-5 h-5" />
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-[#00E5FF] transition-colors"
            aria-label="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Language Selector — powered by LanguageContext */}
          <LanguageSwitcher variant="compact" />

          {/* Notification Center */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-400 hover:text-[#00E5FF] relative transition-colors"
              aria-label="Notification Center"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF1744]" />
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 bg-[#0D1117] border border-slate-800 rounded-xl shadow-2xl p-4 w-72 z-50"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Telemetry Notifications</span>
                    <span className="text-[9px] text-[#00E5FF] font-mono cursor-pointer hover:underline">Clear all</span>
                  </div>
                  <div className="space-y-3">
                    {notificationsList.map(n => (
                      <div key={n.id} className="text-xs border-b border-white/5 pb-2 last:border-b-0">
                        <p className="font-bold text-slate-200">{n.title}</p>
                        <p className="text-slate-400 mt-0.5 leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-px bg-white/10" />

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 text-left focus:outline-none"
              aria-label="Open Profile Menu"
            >
              <div className="w-8 h-8 rounded-full border border-[#00E5FF]/30 bg-slate-800 flex items-center justify-center text-xs font-bold font-mono text-[#00E5FF] overflow-hidden">
                {userProfile?.displayName?.substring(0, 2).toUpperCase() || 'AN'}
              </div>
            </button>
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 bg-[#0D1117] border border-slate-800 rounded-xl shadow-2xl p-4 w-60 z-50 font-mono text-xs"
                >
                  <div className="pb-3 border-b border-white/5 mb-2">
                    <p className="font-bold text-white uppercase tracking-wide truncate">{userProfile?.displayName}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{userProfile?.email}</p>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[9px] text-[#00E5FF] border border-[#00E5FF]/20 font-bold uppercase mt-2">
                      {getRoleLabel(userProfile?.role)}
                    </span>
                  </div>
                  <Link href="/dashboard?tab=settings" className="flex items-center gap-2 py-2 text-slate-400 hover:text-white rounded transition-colors" onClick={() => setShowProfileMenu(false)}>
                    <Settings className="w-4 h-4" />
                    <span>Account Settings</span>
                  </Link>
                  <button onClick={() => { signOut(); setShowProfileMenu(false); }} className="w-full flex items-center gap-2 py-2 text-rose-400 hover:text-rose-300 rounded transition-colors text-left mt-2 border-t border-white/5 pt-2">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out Session</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* LEFT SIDEBAR (Desktop & Tablet) */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 bottom-0 left-0 pt-16 z-35 bg-[#0D1117]/90 border-r border-[#00E5FF]/10 backdrop-blur-md transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Toggle button */}
        <div className="flex justify-end p-4 border-b border-white/5">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-500 hover:text-[#00E5FF] transition-colors p-1.5 glass-panel border-white/5 rounded-lg focus-ring-cyber"
            title={collapsed ? "Expand Menu" : "Collapse Menu"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-1 scrollbar-thin">
          {sidebarItems.map((item) => {
            const Icon = iconsMap[item.iconName];
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all group relative cursor-pointer focus-ring-cyber ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00E5FF]/10 to-[#4FC3F7]/5 text-white border-l-2 border-[#00E5FF]'
                      : 'text-slate-400 hover:text-[#00E5FF] hover:bg-white/5'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <span className={`transition-colors ${isActive ? 'text-[#00E5FF]' : 'group-hover:text-[#00E5FF]'}`}>
                    <Icon className="w-5 h-5 shrink-0" />
                  </span>

                  {!collapsed && (
                    <span className="text-xs font-display uppercase tracking-wider">{item.name}</span>
                  )}

                  {/* Tooltip in collapsed mode */}
                  {collapsed && (
                    <div className="absolute left-20 bg-[#0D1117] border border-[#00E5FF]/20 text-[#00E5FF] text-[10px] font-display uppercase tracking-widest px-3 py-1.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                      {item.name}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-white/5 bg-[#0A0D12]/50 space-y-3">
            {/* Language quick-switch */}
            <LanguageSwitcher variant="compact" className="w-full" />
            {/* System telemetry clock */}
            <div className="font-mono text-[10px]">
              <span className="text-slate-500 uppercase tracking-widest block">Operational Core</span>
              <span className="text-[#00E5FF] font-bold block mt-0.5">{systemTime}</span>
            </div>
          </div>
        )}
      </aside>

      {/* MOBILE NAV DRAWER (Slide-out menu sheet) */}
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
              className="fixed top-0 bottom-0 left-0 w-72 bg-[#0D1117] border-r border-[#00E5FF]/10 z-50 flex flex-col pt-16 lg:hidden"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="font-display font-bold text-white text-sm uppercase tracking-widest">Navigation Center</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = iconsMap[item.iconName];
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                  return (
                    <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)}>
                      <div
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all ${
                          isActive
                            ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-l-2 border-[#00E5FF]'
                            : 'text-slate-400 hover:text-[#00E5FF] hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-xs font-display uppercase tracking-wider">{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/5 bg-[#0A0D12]/50 space-y-3">
                <LanguageSwitcher variant="compact" className="w-full" />
                <div className="text-center text-[10px] font-mono text-slate-500">
                  <span className="block uppercase tracking-wider">Telemetry Core Online</span>
                  <span className="text-[#00E5FF] mt-1 block font-bold">{systemTime}</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0D1117]/95 border-t border-slate-800 flex items-center justify-around px-2 z-40 lg:hidden backdrop-blur-md">
        <Link href="/dashboard" className="flex flex-col items-center justify-center text-slate-400 hover:text-[#00E5FF] transition-colors focus-ring-cyber">
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-widest mt-1">Dashboard</span>
        </Link>
        <Link href="/courses" className="flex flex-col items-center justify-center text-slate-400 hover:text-[#00E5FF] transition-colors focus-ring-cyber">
          <BookOpen className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-widest mt-1">Courses</span>
        </Link>
        <Link href="/practice" className="flex flex-col items-center justify-center text-slate-400 hover:text-[#00E5FF] transition-colors focus-ring-cyber">
          <Terminal className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-widest mt-1">Practice</span>
        </Link>
        <button onClick={() => setMobileOpen(true)} className="flex flex-col items-center justify-center text-slate-400 hover:text-[#00E5FF] transition-colors focus-ring-cyber">
          <Menu className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-widest mt-1">More</span>
        </button>
      </nav>

      {/* GLOBAL SEARCH MODAL */}
      <AnimatePresence>
        {showSearch && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-sm">
            {/* Backdrop click close */}
            <div className="fixed inset-0" onClick={() => setShowSearch(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-[#0D1117] border border-[#00E5FF]/20 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-50"
            >
              {/* Search Header */}
              <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                <Search className="w-5 h-5 text-[#00E5FF] shrink-0" />
                <input
                  type="text"
                  placeholder="Type to search classes, datasets, simulators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-white focus:outline-none text-sm w-full font-mono placeholder-slate-600"
                  autoFocus
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="text-slate-500 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Results */}
              <div className="p-4 max-h-[300px] overflow-y-auto font-mono text-xs text-slate-400 scrollbar-thin">
                {searchQuery ? (
                  filteredSearchResults.length > 0 ? (
                    <div className="space-y-1">
                      {filteredSearchResults.map((res, i) => (
                        <Link href={res.href} key={i} onClick={() => setShowSearch(false)}>
                          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-slate-800 transition-all cursor-pointer">
                            <span className="text-white uppercase font-bold">{res.title}</span>
                            <span className="px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[10px] text-[#00E5FF] border border-[#00E5FF]/20 font-black uppercase">
                              {res.category}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-600">
                      NO MATCHING TELEMETRY RECORDS FOUND FOR &quot;{searchQuery.toUpperCase()}&quot;
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Recents</span>
                      <div className="mt-2 space-y-1 text-slate-300">
                        <Link href="/simulators/excel" onClick={() => setShowSearch(false)} className="block p-2 rounded hover:bg-white/5">Excel Advanced Sandbox</Link>
                        <Link href="/simulators/sql" onClick={() => setShowSearch(false)} className="block p-2 rounded hover:bg-white/5">SQL Database Console</Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN VIEWPORT */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 z-10 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        } pt-16 pb-16 lg:pb-0`}
      >
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-cyber-radial">
          {children}
        </main>
      </div>
    </div>
  );
}
