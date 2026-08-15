'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ variant = 'rectangular', width, height, className, style, ...props }: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    rectangular: 'rounded-2xl',
    circular: 'rounded-full shrink-0',
  };

  const computedStyle: React.CSSProperties = {
    ...style,
    ...(width !== undefined && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height !== undefined && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  return (
    <div
      className={clsx(
        'bg-white/5 border border-white/5 animate-pulse',
        variantStyles[variant],
        className
      )}
      style={computedStyle}
      {...props}
    />
  );
}
