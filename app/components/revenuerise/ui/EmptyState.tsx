'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  secondaryAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'rounded-3xl bg-[#080C14] border border-white/10 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto',
        className
      )}
      {...props}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#0D1424] border border-white/10 flex items-center justify-center text-[#00E5FF] shadow-lg shadow-black/40">
        {icon || <Sparkles className="w-7 h-7" />}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-xs text-slate-400 font-sans max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      {(actionLabel || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {actionLabel && onAction && (
            <Button onClick={onAction} leftIcon={actionIcon} size="md">
              {actionLabel}
            </Button>
          )}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
