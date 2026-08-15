'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, Sparkles, User, ExternalLink } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { IconButton } from '../ui/IconButton';

export interface RevenueRiseHeaderProps {
  onToggleMobileNav?: () => void;
}

export function RevenueRiseHeader({ onToggleMobileNav }: RevenueRiseHeaderProps) {
  return (
    <header className="h-16 bg-[#080C14]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-40">
      {/* Left: Mobile Trigger & Search Command */}
      <div className="flex items-center gap-3">
        {onToggleMobileNav && (
          <button
            type="button"
            onClick={onToggleMobileNav}
            aria-label="Open mobile navigation menu"
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white"
          >
            <Sparkles className="w-5 h-5 text-[#00E5FF]" />
          </button>
        )}

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0D1424] border border-white/10 text-xs font-mono text-slate-400 w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <span className="truncate">Search commands, skills, labs...</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400">⌘K</kbd>
        </div>
      </div>

      {/* Right: AI Quick Indicator, Parent Link, User Avatar */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span>AnalyticsRise Main</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        <Badge variant="intelligence" dot>
          AI Active
        </Badge>

        <IconButton icon={<Bell className="w-4 h-4" />} label="Notifications" size="sm" />

        <Link href="/settings" aria-label="User Profile and Settings">
          <Avatar size="sm" status="online" />
        </Link>
      </div>
    </header>
  );
}
