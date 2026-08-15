'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { LayoutDashboard, Bot, GraduationCap, BarChart3, TrendingUp } from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'AI Mentor', href: '/ai', icon: <Bot className="w-5 h-5" /> },
  { label: 'Learn', href: '/learning', icon: <GraduationCap className="w-5 h-5" /> },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Markets', href: '/markets', icon: <TrendingUp className="w-5 h-5" /> },
];

export function RevenueRiseMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#080C14]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-2 z-40"
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all duration-200',
              isActive ? 'text-[#00E5FF]' : 'text-slate-400 hover:text-white'
            )}
          >
            {item.icon}
            <span className="text-[10px] font-mono font-bold uppercase">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
