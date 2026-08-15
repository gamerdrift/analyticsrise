/**
 * RevenueRiseAI — Centralized Design System Tokens
 * Defines semantic color palettes, typography scales, surface elevations,
 * border radiuses, and motion tokens for the professional intelligence OS.
 */

export const tokens = {
  colors: {
    // Brand & Intelligence Accents
    intelligence: {
      primary: '#00E5FF',       // Cyan highlight / active focus
      primaryHover: '#00B8CC',
      primaryGlow: 'rgba(0, 229, 255, 0.25)',
      secondary: '#4FC3F7',     // Sky secondary
      secondaryHover: '#29B6F6',
      neural: '#8B5CF6',        // Purple for AI reasoning / neural processing
      neuralGlow: 'rgba(139, 92, 246, 0.25)',
    },

    // Background & Surfaces
    background: {
      main: '#05070B',          // Deep void background
      elevated: '#080C14',      // Card / panel surface
      subtle: '#0D1424',        // Secondary surface / input fill
      glass: 'rgba(13, 20, 36, 0.75)',
      overlay: 'rgba(5, 7, 11, 0.85)',
    },

    // Borders & Dividers
    border: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      default: 'rgba(255, 255, 255, 0.14)',
      focus: 'rgba(0, 229, 255, 0.5)',
      intelligence: 'rgba(0, 229, 255, 0.3)',
      neural: 'rgba(139, 92, 246, 0.3)',
    },

    // Semantic Status Indicators
    status: {
      success: '#00E676',
      successBg: 'rgba(0, 230, 118, 0.12)',
      warning: '#FFC400',
      warningBg: 'rgba(255, 196, 0, 0.12)',
      danger: '#FF5252',
      dangerBg: 'rgba(255, 82, 82, 0.12)',
      info: '#00E5FF',
      infoBg: 'rgba(0, 229, 255, 0.12)',
    },

    // Text & Content Hierarchy
    text: {
      primary: '#F5F7FA',       // High contrast white
      secondary: '#9AA5B1',     // Slate description
      muted: '#616E7C',         // Low emphasis / metadata
      accent: '#00E5FF',
      neural: '#C4B5FD',
    },
  },

  // Typography Tokens
  typography: {
    fontFamily: {
      sans: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
      mono: 'var(--font-mono, "JetBrains Mono", monospace)',
      display: 'var(--font-display, var(--font-sans, sans-serif))',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
    },
  },

  // Radii Tokens
  radius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Elevation & Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.35)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.45), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.55), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
    intelligence: '0 0 20px rgba(0, 229, 255, 0.25)',
    neural: '0 0 20px rgba(139, 92, 246, 0.25)',
  },

  // Animation & Transition Timing
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type DesignTokens = typeof tokens;
