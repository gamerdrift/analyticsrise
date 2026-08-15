'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Bot,
  GraduationCap,
  BarChart3,
  TrendingUp,
  Briefcase,
  Award,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'intelligence' | 'neural' | 'success' | 'default';
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    label: 'Command Center',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'AI Mentor',
    href: '/ai',
    icon: <Bot className="w-5 h-5" />,
    badge: 'AI OS',
    badgeVariant: 'intelligence',
  },
  {
    label: 'Learning Path',
    href: '/learning',
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    label: 'Analytics Lab',
    href: '/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: 'Market Lab',
    href: '/markets',
    icon: <TrendingUp className="w-5 h-5" />,
    badge: 'Paper Sim',
    badgeVariant: 'neural',
  },
  {
    label: 'Career Copilot',
    href: '/career',
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    label: 'Certifications',
    href: '/certifications',
    icon: <Award className="w-5 h-5" />,
  },
];

export function RevenueRiseSidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Sidebar Navigation"
      className="hidden lg:flex flex-col w-64 bg-[#080C14] border-r border-white/10 shrink-0 select-none z-30"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-purple-600 p-0.5 shadow-lg shadow-[#00E5FF]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#05070B] rounded-[14px] flex items-center justify-center text-[#00E5FF]">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-mono font-black text-sm text-white tracking-widest uppercase block">
              REVENUE<span className="text-[#00E5FF]">RISE</span>
            </span>
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
              INTELLIGENCE OS
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
          Core Workspaces
        </div>
        {PRIMARY_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 group',
                isActive
                  ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40 shadow-sm shadow-[#00E5FF]/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={clsx(
                    'transition-colors',
                    isActive ? 'text-[#00E5FF]' : 'text-slate-400 group-hover:text-white'
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant={item.badgeVariant || 'default'}>
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Nav & Settings */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/settings"
          className={clsx(
            'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200',
            pathname === '/settings'
              ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          )}
        >
          <Settings className="w-5 h-5 text-slate-400" />
          <span>Settings & Usage</span>
        </Link>

        <div className="p-3 rounded-2xl bg-[#0D1424] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
            <span>AI Status</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Ready
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
