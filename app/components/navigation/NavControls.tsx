'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronRight, Home, ChevronLeft, Menu, X } from 'lucide-react';
import Link from 'next/link';

// --- BREADCRUMB COMPONENT ---
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-[10px] font-mono uppercase tracking-widest text-slate-500 gap-2">
      <Link href="/dashboard" className="hover:text-white transition-colors inline-flex items-center gap-1.5" aria-label="Home page">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-700" aria-hidden="true" />
            {isLast || !item.href ? (
              <span className="text-white font-bold" aria-current="page">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// --- TABS COMPONENT ---
interface TabItem {
  id: string;
  label: string;
  content?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'outline' | 'pills';
}

export function Tabs({ items, activeId, onChange, variant = 'outline' }: TabsProps) {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Tab bar list */}
      <div
        role="tablist"
        aria-label="Tabs Selector"
        className={clsx(
          'flex gap-2 p-0.5',
          variant === 'outline' ? 'border-b border-slate-800' : 'rounded-lg border border-slate-850 bg-[#0D1117] inline-flex self-start'
        )}
      >
        {items.map((item) => {
          const isSelected = activeId === item.id;
          const tabStyles = variant === 'outline'
            ? (isSelected ? 'border-b-2 border-[#00E5FF] text-white' : 'text-slate-500 hover:text-slate-300')
            : (isSelected ? 'bg-[#00E5FF] text-black rounded' : 'text-slate-400 hover:text-white bg-transparent');

          return (
            <button
              key={item.id}
              id={`tab-${item.id}`}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${item.id}`}
              onClick={() => onChange(item.id)}
              className={twMerge(
                clsx(
                  'px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF]',
                  tabStyles
                )
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Tab panel content */}
      <div className="flex-1">
        {items.map((item) => {
          if (activeId !== item.id || !item.content) return null;
          return (
            <div
              key={item.id}
              id={`panel-${item.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${item.id}`}
              className="focus-visible:outline-none"
              tabIndex={0}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- PAGINATION COMPONENT ---
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <nav role="navigation" aria-label="Pagination" className="flex items-center justify-center gap-4 font-mono text-[10px] font-bold">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="p-2 border border-slate-800 rounded bg-[#0D1117]/80 text-slate-400 hover:text-white disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF]"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <span className="text-slate-500 uppercase tracking-widest">
        Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 border border-slate-800 rounded bg-[#0D1117]/80 text-slate-400 hover:text-white disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF]"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

// --- GENERIC NAVBAR COMPONENT ---
interface NavbarProps {
  logoText: string;
  links: Array<{ label: string; href: string }>;
  actions?: React.ReactNode;
}

export function Navbar({ logoText, links, actions }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#05070B]/70 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00E5FF] to-[#4FC3F7] flex items-center justify-center font-bold text-black text-lg font-display tracking-tighter">
            AR
          </div>
          <span className="font-display font-black text-white text-base tracking-wider uppercase">
            {logoText}
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-widest text-slate-400">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-[#00E5FF] transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action button slots */}
        <div className="hidden md:flex items-center gap-4">{actions}</div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Drawer */}
      {open && (
        <div className="absolute top-16 left-0 right-0 p-6 border-b border-white/5 bg-[#0D1117] backdrop-blur-lg flex flex-col gap-6 md:hidden z-40 text-center font-mono uppercase tracking-widest text-xs">
          {links.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setOpen(false)} className="text-slate-300 hover:text-[#00E5FF]">
              {link.label}
            </Link>
          ))}
          {actions && <div className="flex flex-col gap-2 pt-4 border-t border-white/5">{actions}</div>}
        </div>
      )}
    </header>
  );
}

// --- STANDALONE COLLAPSIBLE SIDEBAR ---
interface SidebarProps {
  items: Array<{ label: string; href: string; icon: React.ReactNode }>;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ items, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={clsx(
        'hidden lg:flex flex-col fixed top-0 bottom-0 left-0 bg-[#0D1117]/80 border-r border-white/5 backdrop-blur-md transition-all duration-300 z-40',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
        {!collapsed && <span className="font-display font-bold text-white text-xs uppercase tracking-widest">Navigation</span>}
        <button
          onClick={onToggle}
          className="text-slate-500 hover:text-[#00E5FF] transition-colors p-1"
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <Link key={item.label} href={item.href}>
            <div className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-400 hover:text-[#00E5FF] hover:bg-white/5 transition-all cursor-pointer group relative">
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="text-[10px] font-mono uppercase tracking-widest">{item.label}</span>}
              
              {collapsed && (
                <div className="absolute left-20 bg-[#0D1117] border border-slate-800 text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-all whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

// --- GENERIC FOOTER COMPONENT ---
export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#05070B] py-8 px-6 text-[10px] font-mono uppercase tracking-widest text-slate-600">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>&copy; {new Date().getFullYear()} ANALYTICSRISE. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-6">
          <Link href="/help" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/help" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/help" className="hover:text-white transition-colors">Security</Link>
        </div>
      </div>
    </footer>
  );
}
