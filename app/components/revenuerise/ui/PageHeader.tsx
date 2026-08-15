'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: React.ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  badge,
  title,
  subtitle,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={clsx(
        'flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10',
        className
      )}
      {...props}
    >
      <div className="space-y-2 max-w-3xl">
        {badge && <div className="inline-block">{badge}</div>}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-mono font-black text-white uppercase tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm font-mono font-bold text-[#00E5FF] uppercase tracking-wider">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
