'use client';

import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle, CheckCircle2, Info, XCircle, Loader2, RefreshCw, Layers } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

// --- INLINE ALERT COMPONENT ---
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  description: string;
}

export function Alert({ className, variant = 'info', title, description, ...props }: AlertProps) {
  const icons = {
    info: <Info className="w-5 h-5 text-[#4FC3F7] shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-[#00E676] shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-[#FFD600] shrink-0" />,
    danger: <XCircle className="w-5 h-5 text-[#FF1744] shrink-0" />,
  };

  const borders = {
    info: 'border-[#4FC3F7]/20 bg-[#4FC3F7]/5 text-slate-300',
    success: 'border-[#00E676]/20 bg-[#00E676]/5 text-slate-300',
    warning: 'border-[#FFD600]/20 bg-[#FFD600]/5 text-slate-300',
    danger: 'border-[#FF1744]/20 bg-[#FF1744]/5 text-slate-300',
  };

  return (
    <div
      className={twMerge(
        clsx('p-4 rounded-lg border flex gap-3 text-xs leading-normal', borders[variant], className)
      )}
      role="alert"
      {...props}
    >
      {icons[variant]}
      <div>
        <h4 className="font-bold text-white uppercase tracking-wider mb-1 font-display">{title}</h4>
        <p className="text-slate-400">{description}</p>
      </div>
    </div>
  );
}

// --- FLOATING TOAST PROVIDER ---
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    info: <Info className="w-4 h-4 text-[#4FC3F7]" />,
    success: <CheckCircle2 className="w-4 h-4 text-[#00E676]" />,
    error: <XCircle className="w-4 h-4 text-[#FF1744]" />,
  };

  return (
    <div
      className="p-4 rounded-xl border border-slate-800 bg-[#0D1117]/95 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4 max-w-sm pointer-events-auto"
      role="status"
    >
      <div className="flex items-center gap-2.5">
        {icons[type]}
        <span className="text-xs font-mono text-slate-300">{message}</span>
      </div>
      <button onClick={onClose} className="text-slate-500 hover:text-white p-1" aria-label="Dismiss toast">
        <Loader2 className="w-3.5 h-3.5 transform rotate-45" />
      </button>
    </div>
  );
}

// --- STANDARD PROGRESS LOADER BAR ---
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: string;
}

export function Progress({ className, value, color = 'bg-[#00E5FF]', ...props }: ProgressProps) {
  return (
    <div className={twMerge('w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5', className)} {...props}>
      <div
        className={clsx('h-full transition-all duration-300', color)}
        style={{ width: `${value}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

// --- LOADING SPINNER ---
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={twMerge('flex items-center justify-center p-4', className)}>
      <Loader2 className="w-8 h-8 animate-spin text-[#00E5FF]" aria-label="Loading content" />
    </div>
  );
}

// --- SKELETON LOADER CELLS ---
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'line' | 'card' | 'avatar';
  count?: number;
}

export function SkeletonLoader({ className, variant = 'line', count = 1, ...props }: SkeletonProps) {
  const items = Array.from({ length: count });

  return (
    <div className="space-y-3 w-full" {...props}>
      {items.map((_, idx) => (
        <div
          key={idx}
          className={twMerge(
            clsx(
              'animate-pulse bg-slate-800/40 rounded',
              variant === 'line' && 'h-4 w-full',
              variant === 'avatar' && 'h-10 w-10 rounded-full',
              variant === 'card' && 'h-32 w-full border border-slate-800'
            ),
            className
          )}
        />
      ))}
    </div>
  );
}

// --- EMPTY STATE ---
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="p-8 rounded-xl border border-dashed border-slate-800 bg-[#0D1117]/30 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 mb-4 bg-slate-900/50">
        {icon || <RefreshCw className="w-5 h-5" />}
      </div>
      <h4 className="text-sm font-bold font-display uppercase tracking-wider text-white mb-2">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed mb-6">{description}</p>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// --- SUCCESS STATE ---
interface SuccessStateProps {
  title: string;
  description: string;
  xpEarned?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export function SuccessState({ title, description, xpEarned, actionLabel, onAction }: SuccessStateProps) {
  return (
    <div className="p-8 rounded-xl border border-[#00E676]/30 bg-[#00E676]/5 text-center max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#00E676]" />
      <div className="w-12 h-12 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center text-[#00E676] mx-auto mb-4">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold font-display uppercase tracking-wider text-white mb-2">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed mb-6">{description}</p>
      {xpEarned && (
        <div className="mb-6 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#00E676]/10 border border-[#00E676]/20 text-[10px] font-mono font-black text-[#00E676] uppercase tracking-widest">
          +{xpEarned} XP AWARDED
        </div>
      )}
      {onAction && actionLabel && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// --- CHARTS PLACEHOLDER GRID ---
export function ChartsPlaceholder({ title }: { title: string }) {
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-[#0D1117]/60 flex flex-col justify-between min-h-[250px] relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
          {title}
        </h4>
        <span className="text-[9px] font-mono text-slate-600 uppercase">Interactive Grid layout</span>
      </div>

      {/* Cyber Grid simulation graphic */}
      <div className="flex-1 border-l border-b border-slate-800 flex items-end justify-around h-36 px-4 pb-2 relative">
        {/* Y Axis Grid lines */}
        <div className="absolute left-0 right-0 border-t border-dashed border-slate-900/50 h-px top-1/4" />
        <div className="absolute left-0 right-0 border-t border-dashed border-slate-900/50 h-px top-2/4" />
        <div className="absolute left-0 right-0 border-t border-dashed border-slate-900/50 h-px top-3/4" />

        {/* Mock Chart line path overlay */}
        <svg className="absolute inset-x-0 bottom-2 h-24 w-full opacity-35" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0 80 Q 25 30 50 60 T 100 20" fill="none" stroke="#00E5FF" strokeWidth="2" />
        </svg>

        {/* Columns grid */}
        <div className="w-8 bg-slate-800/30 border border-slate-800 h-16 rounded-t-sm z-10 transition-all duration-300 hover:border-[#00E5FF]/40" />
        <div className="w-8 bg-slate-800/30 border border-slate-800 h-24 rounded-t-sm z-10 transition-all duration-300 hover:border-[#00E5FF]/40" />
        <div className="w-8 bg-[#00E5FF]/10 border border-[#00E5FF]/30 h-32 rounded-t-sm z-10 transition-all duration-300 hover:shadow-md hover:shadow-[#00E5FF]/10" />
        <div className="w-8 bg-slate-800/30 border border-slate-800 h-20 rounded-t-sm z-10 transition-all duration-300 hover:border-[#00E5FF]/40" />
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[8px] font-mono text-slate-600">
        <span>X AXIS: METRICS INDEX</span>
        <span>Y AXIS: AGGREGATIONS</span>
      </div>
    </div>
  );
}
