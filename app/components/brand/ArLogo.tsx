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
 * Encapsulates the official upward triangular growth/ascension brand identity.
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
          <stop offset="100%" stopColor="#4FC3F7" />
        </linearGradient>
        <linearGradient id="arBorderGradSvg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="50%" stopColor="#4FC3F7" />
          <stop offset="100%" stopColor="#0070F3" />
        </linearGradient>
        <filter id="arGlowSvg" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00E5FF" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Official Triangular Badge Silhouette */}
      <path
        d="M 50 8 L 93 84 C 94.8 87.2 92.5 91 88.8 91 L 11.2 91 C 7.5 91 5.2 87.2 7.0 84 Z"
        fill="url(#arGradSvg)"
        stroke="url(#arBorderGradSvg)"
        strokeWidth="2.5"
        filter="url(#arGlowSvg)"
      />

      {/* High-Contrast Bold AR Monogram */}
      <text
        x="50"
        y="70"
        fontFamily="'Orbitron', 'Inter', -apple-system, sans-serif"
        fontWeight="900"
        fontSize="38"
        fill="#05070B"
        textAnchor="middle"
        letterSpacing="-2.5"
      >
        AR
      </text>
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
