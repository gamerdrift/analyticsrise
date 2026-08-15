'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string; // Required for a11y screen readers
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, variant = 'ghost', size = 'md', isLoading = false, disabled, className, ...props }, ref) => {
    const sizeStyles = {
      sm: 'w-8 h-8 rounded-lg text-xs',
      md: 'w-10 h-10 rounded-xl text-sm',
      lg: 'w-12 h-12 rounded-xl text-base',
    };

    const variantStyles = {
      primary: 'bg-[#00E5FF] text-black hover:bg-[#4FC3F7] shadow-sm',
      secondary: 'bg-[#0D1424] text-white border border-white/10 hover:border-white/20 hover:bg-white/5',
      outline: 'bg-transparent border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10',
      ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5',
      danger: 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30',
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-95',
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
