'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, CreditCard, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';

// --- PROFILE AVATAR ---
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'busy';
}

export function Avatar({ className, name, src, size = 'md', status, ...props }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-sm',
  };

  const statusColors = {
    online: 'bg-emerald-400',
    busy: 'bg-rose-500',
    offline: 'bg-slate-500',
  };

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={twMerge(
          clsx(
            'rounded-full border border-slate-800 bg-slate-900/60 font-mono font-bold uppercase tracking-widest text-[#00E5FF] flex items-center justify-center overflow-hidden',
            sizeClasses[size]
          ),
          className
        )}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full border border-[#05070B] ring-0',
            size === 'sm' && 'h-2 w-2',
            size === 'md' && 'h-2.5 w-2.5',
            size === 'lg' && 'h-3.5 w-3.5',
            statusColors[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

// --- PROFILE POPUP MENU ---
interface ProfileMenuProps {
  name: string;
  email: string;
  avatarSrc?: string;
  onLogout?: () => void;
}

export function ProfileMenu({ name, email, avatarSrc, onLogout }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-lg border border-transparent hover:border-slate-800 hover:bg-[#0D1117]/60 transition-all focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Avatar name={name} src={avatarSrc} size="sm" status="online" />
        <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-[#0D1117] shadow-2xl z-40 overflow-hidden font-mono text-[10px]"
            >
              {/* Header profile data */}
              <div className="p-4 border-b border-slate-800 bg-[#0A0D12]/50">
                <span className="block font-bold text-white uppercase tracking-wider">{name}</span>
                <span className="block text-slate-500 mt-0.5 truncate">{email}</span>
              </div>

              {/* Items List */}
              <div className="p-2 space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-[#00E5FF] hover:bg-white/5 transition-all"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="uppercase tracking-widest">My Profile</span>
                </Link>
                
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-[#00E5FF] hover:bg-white/5 transition-all"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span className="uppercase tracking-widest">Settings</span>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-[#00E5FF] hover:bg-white/5 transition-all"
                >
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span className="uppercase tracking-widest">Billing</span>
                </Link>
              </div>

              {/* Logout button */}
              {onLogout && (
                <div className="p-2 border-t border-slate-800 bg-[#0A0D12]/30">
                  <button
                    onClick={() => {
                      setOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded text-rose-500 hover:bg-rose-500/10 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="uppercase tracking-widest font-bold">Sign Out</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
