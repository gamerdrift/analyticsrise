'use client';

import React from 'react';
import { clsx } from 'clsx';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'intelligence' | 'neural' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', dot = false, children, className, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-white/10 text-slate-300 border-white/10',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    danger: 'bg-red-500/15 text-red-300 border-red-500/30',
    intelligence: 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/30',
    neural: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    outline: 'bg-transparent text-slate-300 border-white/20',
  };

  const dotStyles = {
    default: 'bg-slate-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
    intelligence: 'bg-[#00E5FF]',
    neural: 'bg-purple-400',
    outline: 'bg-white',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', dotStyles[variant])} />}
      {children}
    </span>
  );
}
