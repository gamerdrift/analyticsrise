'use client';

import React, { useState } from 'react';
import { RevenueRiseSidebar } from './RevenueRiseSidebar';
import { RevenueRiseHeader } from './RevenueRiseHeader';
import { RevenueRiseMobileNav } from './RevenueRiseMobileNav';
import { RevenueRiseFooter } from './RevenueRiseFooter';
import { Drawer } from '../ui/Drawer';
import { PRIMARY_NAV_ITEMS } from './RevenueRiseSidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Sparkles, Settings } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface RevenueRiseShellProps {
  children: React.ReactNode;
}

export function RevenueRiseShell({ children }: RevenueRiseShellProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans flex flex-col selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <RevenueRiseSidebar />

        {/* Mobile Slide-Out Drawer */}
        <Drawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          title="RevenueRiseAI Navigation"
          position="left"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <Sparkles className="w-6 h-6 text-[#00E5FF]" />
              <div>
                <div className="font-mono font-bold text-sm text-white">REVENUERISEAI</div>
                <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">Intelligence OS</div>
              </div>
            </div>

            <nav className="space-y-1">
              {PRIMARY_NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={clsx(
                      'flex items-center justify-between px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase transition-colors',
                      isActive ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40' : 'text-slate-300 hover:bg-white/5'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && <Badge variant="intelligence">{item.badge}</Badge>}
                  </Link>
                );
              })}
              <Link
                href="/settings"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase text-slate-300 hover:bg-white/5"
              >
                <Settings className="w-5 h-5 text-slate-400" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </Drawer>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
          <RevenueRiseHeader onToggleMobileNav={() => setIsMobileDrawerOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>
          <RevenueRiseFooter />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <RevenueRiseMobileNav />
    </div>
  );
}
