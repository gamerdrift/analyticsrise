'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive' | 'intelligence';
  children: React.ReactNode;
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  const variantStyles = {
    default: 'bg-[#080C14] border border-white/10',
    elevated: 'bg-[#0D1424] border border-white/15 shadow-xl',
    glass: 'bg-[#080C14]/75 backdrop-blur-md border border-white/10 shadow-2xl',
    interactive:
      'bg-[#080C14] border border-white/10 hover:border-[#00E5FF]/40 hover:shadow-[0_0_25px_rgba(0,229,255,0.15)] transition-all duration-300 cursor-pointer',
    intelligence:
      'bg-gradient-to-b from-[#0D1424] to-[#080C14] border border-[#00E5FF]/30 shadow-[0_0_30px_rgba(0,229,255,0.08)]',
  };

  return (
    <div
      className={clsx('rounded-2xl p-6 transition-all duration-200', variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('flex items-center justify-between gap-4 pb-4 border-b border-white/5 mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={clsx('text-base font-mono font-bold text-white uppercase tracking-wider', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={clsx('text-xs text-slate-400 font-sans leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('space-y-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('pt-4 border-t border-white/5 mt-4 flex items-center justify-between gap-4', className)} {...props}>
      {children}
    </div>
  );
}
