'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Simulators', href: '#simulators' },
    { name: 'Learning Paths', href: '#paths' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#05070B]/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-gradient-to-br from-[#00E5FF] to-[#4FC3F7] flex items-center justify-center font-bold text-black text-xl font-display tracking-tighter shadow-lg shadow-[#00E5FF]/20">
            AR
          </div>
          <span className="font-display font-black text-white text-lg tracking-wider">
            ANALYTICS<span className="text-[#00E5FF]">RISE</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-xs uppercase tracking-widest text-slate-400 hover:text-[#00E5FF] font-medium transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Navigation Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-xs uppercase tracking-widest text-slate-400 hover:text-white font-bold transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded border border-[#00E5FF] text-[#00E5FF] text-[10px] font-bold tracking-widest uppercase hover:bg-[#00E5FF]/10 transition-all duration-300 shadow-md shadow-[#00E5FF]/10 hover:shadow-[#00E5FF]/20"
          >
            Launch Console
          </Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-slate-400 hover:text-white focus:outline-none p-2"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-[#0D1117]/95 border-b border-white/5 backdrop-blur-lg px-6 py-8 flex flex-col gap-6 md:hidden z-40"
          >
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm uppercase tracking-widest text-slate-300 hover:text-[#00E5FF] font-medium"
              >
                {item.name}
              </a>
            ))}
            <div className="h-px bg-white/5 my-2" />
            <div className="flex flex-col gap-4">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="text-center text-xs uppercase tracking-widest text-slate-400 hover:text-white font-bold py-2"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-3 rounded border border-[#00E5FF] text-[#00E5FF] text-xs font-bold tracking-widest uppercase bg-[#00E5FF]/5"
              >
                Launch Console
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
