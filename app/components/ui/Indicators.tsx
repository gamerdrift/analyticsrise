'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

// --- BADGE COMPONENT ---
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

export function Badge({ className, variant = 'secondary', children, ...props }: BadgeProps) {
  const variantStyles = {
    primary: 'border-[#00E5FF]/30 text-[#00E5FF] bg-[#00E5FF]/5',
    secondary: 'border-slate-800 text-slate-400 bg-slate-900/30',
    success: 'border-[#00E676]/30 text-[#00E676] bg-[#00E676]/5',
    warning: 'border-[#FFD600]/30 text-[#FFD600] bg-[#FFD600]/5',
    danger: 'border-[#FF1744]/30 text-[#FF1744] bg-[#FF1744]/5',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-mono font-bold uppercase tracking-widest leading-none',
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// --- STATUS CHIP COMPONENT ---
interface StatusChipProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'success' | 'warning' | 'danger' | 'offline';
  label: string;
  pulse?: boolean;
}

export function StatusChip({ className, status = 'offline', label, pulse = true, ...props }: StatusChipProps) {
  const dotColors = {
    success: 'bg-[#00E676]',
    warning: 'bg-[#FFD600]',
    danger: 'bg-[#FF1744]',
    offline: 'bg-slate-600',
  };

  const chipBorders = {
    success: 'border-[#00E676]/20 text-[#00E676] bg-[#00E676]/5',
    warning: 'border-[#FFD600]/20 text-[#FFD600] bg-[#FFD600]/5',
    danger: 'border-[#FF1744]/20 text-[#FF1744] bg-[#FF1744]/5',
    offline: 'border-slate-800 text-slate-400 bg-slate-900/50',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-mono font-bold uppercase tracking-widest',
          chipBorders[status],
          className
        )
      )}
      {...props}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {pulse && status !== 'offline' && (
          <span className={clsx('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', dotColors[status])} />
        )}
        <span className={clsx('relative inline-flex rounded-full h-1.5 w-1.5', dotColors[status])} />
      </span>
      <span>{label}</span>
    </div>
  );
}

// --- NOTIFICATION BADGE COMPONENT ---
interface NotificationBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  count: number;
  max?: number;
  children: React.ReactNode;
}

export function NotificationBadge({ className, count, max = 99, children, ...props }: NotificationBadgeProps) {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <div className="relative inline-flex">
      {children}
      {count > 0 && (
        <span
          className={twMerge(
            clsx(
              'absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#FF1744] text-[8px] font-mono font-black text-white border border-[#05070B] leading-none transform translate-x-1/4 -translate-y-1/4 z-10',
              className
            )
          )}
          {...props}
        >
          {displayCount}
        </span>
      )}
    </div>
  );
}

// --- TOOLTIP COMPONENT ---
interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {React.cloneElement(children, {
        'aria-describedby': visible ? 'tooltip-content' : undefined,
      })}
      <AnimatePresence>
        {visible && (
          <motion.div
            id="tooltip-content"
            role="tooltip"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={twMerge(
              clsx(
                'absolute z-50 px-2 py-1 rounded bg-[#0D1117] border border-slate-800 text-[10px] font-mono text-slate-300 whitespace-nowrap shadow-lg pointer-events-none',
                positionStyles[position]
              )
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- POPOVER COMPONENT ---
interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export function Popover({ trigger, content, className }: PopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop close layer */}
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className={twMerge(
                clsx(
                  'absolute right-0 mt-2 p-4 rounded-xl border border-slate-800 bg-[#0D1117] backdrop-blur-md shadow-2xl z-40 min-w-[200px]',
                  className
                )
              )}
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
