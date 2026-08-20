'use client';

import React from 'react';

export interface ArLogoProps {
  /**
   * Width & height in pixels (if number) or Tailwind size class
   */
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Optional custom CSS class applied to the root container or SVG
   */
  className?: string;
  /**
   * Whether to display the text wordmark next to the logo
   */
  showWordmark?: boolean;
  /**
   * Custom styling for the wordmark text
   */
  wordmarkClassName?: string;
  /**
   * Accessible description for screen readers
   */
  alt?: string;
}

const SIZE_MAP: Record<string, number> = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 56,
  '2xl': 80,
};

/**
 * Official AnalyticsRise Triangular AR Logo Component
 * Encapsulates the canonical upward triangular growth/ascension brand identity
 * with 100% pure geometric vector 'AR' paths (zero <text> tag dependencies).
 */
export function ArTriangleIcon({
  size = 32,
  className = '',
  alt = 'AnalyticsRise Logo',
}: {
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  alt?: string;
}) {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 32;

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      role="img"
      aria-label={alt}
    >
      <title>{alt}</title>
      <defs>
        <linearGradient id="arGradSvg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="50%" stopColor="#4FC3F7" />
          <stop offset="100%" stopColor="#0070F3" />
        </linearGradient>
        <linearGradient id="arBorderGradSvg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="60%" stopColor="#4FC3F7" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
        <filter id="arGlowSvg" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#00E5FF" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Official Triangular Badge Silhouette (Rise / Ascension) */}
      <path
        d="M 50 7 C 52.2 7 54.2 8.3 55.3 10.3 L 92.3 78.7 C 93.8 81.5 91.8 85 88.6 85 L 11.4 85 C 8.2 85 6.2 81.5 7.7 78.7 L 44.7 10.3 C 45.8 8.3 47.8 7 50 7 Z"
        fill="url(#arGradSvg)"
        stroke="url(#arBorderGradSvg)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        filter="url(#arGlowSvg)"
      />

      {/* High-Precision Integrated Geometric 'AR' Vector Monogram */}
      <g fill="#05070B" fillRule="evenodd">
        {/* Letter 'A' Outer & Inner Counter Compound Path */}
        <path
          d="M 37.5 30 L 44.5 30 L 52.5 72 L 44.5 72 L 42.2 60 L 32.8 60 L 30.5 72 L 23 72 Z M 37.5 40 L 34.4 53.5 L 40.6 53.5 Z"
        />

        {/* Letter 'R' Outer & Inner Loop Counter Compound Path */}
        <path
          d="M 54.5 30 L 68 30 C 74.5 30 78 34 78 40.5 C 78 45.5 75 48.8 70.2 50.2 L 78.5 72 L 69.8 72 L 62.5 52 L 61.5 52 L 61.5 72 L 54.5 72 Z M 61.5 36.5 L 61.5 46.5 L 67.2 46.5 C 70.2 46.5 71.8 45 71.8 41.5 C 71.8 38 70.2 36.5 67.2 36.5 Z"
        />
      </g>
    </svg>
  );
}

/**
 * Full Brand Logo with Optional Wordmark
 */
export default function ArLogo({
  size = 32,
  className = '',
  showWordmark = false,
  wordmarkClassName = '',
  alt = 'AnalyticsRise',
}: ArLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <ArTriangleIcon size={size} alt={alt} />
      {showWordmark && (
        <span
          className={`font-display font-black tracking-wider uppercase text-white ${
            wordmarkClassName || 'text-lg'
          }`}
        >
          ANALYTICS<span className="text-[#00E5FF]">RISE</span>
        </span>
      )}
    </div>
  );
}
