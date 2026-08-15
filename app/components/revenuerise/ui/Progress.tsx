'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'intelligence' | 'success' | 'neural' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Progress({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'intelligence',
  size = 'md',
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeStyles = {
    sm: 'h-1.5 rounded-full',
    md: 'h-2.5 rounded-full',
    lg: 'h-4 rounded-xl',
  };

  const variantStyles = {
    intelligence: 'bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7]',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    neural: 'bg-gradient-to-r from-purple-600 to-indigo-500',
    warning: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    danger: 'bg-gradient-to-r from-red-500 to-rose-400',
  };

  return (
    <div className={clsx('w-full space-y-1.5', className)} {...props}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-mono">
          {label && <span className="text-slate-300 font-semibold uppercase">{label}</span>}
          {showPercentage && <span className="text-slate-400 font-bold">{percentage}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className={clsx('w-full bg-[#0D1424] border border-white/10 overflow-hidden', sizeStyles[size])}
      >
        <div
          className={clsx('h-full transition-all duration-500 ease-out', variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
