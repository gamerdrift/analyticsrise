'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-display uppercase tracking-widest font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070B] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    const variantStyles = {
      primary: 'bg-[#00E5FF] text-[#05070B] border border-[#00E5FF] hover:bg-transparent hover:text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.15)] hover:shadow-[0_0_15px_rgba(0,229,255,0.25)]',
      secondary: 'bg-[#0D1117] text-[#F5F7FA] border border-slate-800 hover:border-[#00E5FF]/40 hover:text-white',
      ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5 border border-transparent',
      outline: 'bg-transparent text-[#00E5FF] border border-[#00E5FF]/30 hover:border-[#00E5FF] hover:bg-[#00E5FF]/5',
      danger: 'bg-[#FF1744] text-white border border-[#FF1744] hover:bg-transparent hover:text-[#FF1744]',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-[9px] rounded-sm gap-1.5',
      md: 'px-6 py-2.5 text-[10px] rounded-md gap-2',
      lg: 'px-8 py-3.5 text-xs rounded-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={twMerge(
          clsx(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            className
          )
        )}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />}
        {!loading && icon && iconPosition === 'left' && (
          <span className="shrink-0" aria-hidden="true">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === 'right' && (
          <span className="shrink-0" aria-hidden="true">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
