/**
 * AnalyticsRise Design System (ARDS) Design Tokens
 * 
 * Centralized design tokens representing the premium "Data Intelligence Command Center"
 * visual palette, typography scale, spacing grid, and animation presets.
 */

export const ARDS_TOKENS = {
  // Theme Colors (represented in HSL CSS variables and Hex values)
  colors: {
    dark: {
      background: '#05070B', // Deep Navy Space
      surface: '#0D1117',    // Midnight Blue Surface
      border: 'rgba(255, 255, 255, 0.08)',
      primary: '#00E5FF',   // Electric Cyan Accent
      secondary: '#4FC3F7', // Azure Blue
      success: '#00E676',   // Emerald Green
      warning: '#FFD600',   // Amber Yellow
      danger: '#FF1744',    // Crimson Red
      neutral: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
        950: '#020617',
      }
    },
    light: {
      background: '#F8FAFC',
      surface: '#FFFFFF',
      border: 'rgba(15, 23, 42, 0.08)',
      primary: '#00B8CC',
      secondary: '#0288D1',
      success: '#2E7D32',
      warning: '#F57C00',
      danger: '#C62828',
      neutral: {
        50: '#020617',
        100: '#0F172A',
        200: '#1E293B',
        300: '#334155',
        400: '#475569',
        500: '#64748B',
        600: '#94A3B8',
        700: '#CBD5E1',
        800: '#E2E8F0',
        900: '#F1F5F9',
        950: '#F8FAFC',
      }
    }
  },

  // Typography scale (Orbitron headings, Inter copy, JetBrains Mono code)
  typography: {
    fonts: {
      heading: 'var(--font-display), Orbitron, sans-serif',
      body: 'var(--font-sans), Inter, sans-serif',
      code: 'var(--font-mono), JetBrains Mono, monospace',
    },
    sizes: {
      display: 'text-4xl font-black uppercase tracking-widest', // 36px
      h1: 'text-3xl font-bold uppercase tracking-wider',       // 30px
      h2: 'text-xl font-bold uppercase tracking-wider',        // 20px
      h3: 'text-lg font-semibold tracking-wide',                // 18px
      h4: 'text-base font-semibold tracking-wide',              // 16px
      bodyLarge: 'text-base leading-relaxed',
      body: 'text-sm leading-relaxed',
      bodySmall: 'text-xs leading-normal',
      caption: 'text-[10px] font-mono tracking-wider',
      label: 'text-xs font-mono uppercase tracking-widest font-bold',
    }
  },

  // Layout and grids
  spacing: {
    containerMax: 'max-w-7xl',
    paddingDefault: 'p-6 md:p-8',
    gridDefault: 'grid gap-6',
  },

  // Border formatting
  borderRadius: {
    none: 'rounded-none',
    sm: 'rounded-sm',     // 4px
    md: 'rounded-md',     // 6px
    lg: 'rounded-lg',     // 8px
    xl: 'rounded-xl',     // 12px
    full: 'rounded-full',
  },

  // Custom visual layers
  glass: {
    dark: 'bg-[#0D1117]/70 backdrop-blur-md border border-white/10',
    light: 'bg-white/70 backdrop-blur-md border border-slate-900/10 shadow-sm',
  },

  // Box Shadows
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    glowCyan: 'shadow-[0_0_15px_rgba(0,229,255,0.15)] hover:shadow-[0_0_20px_rgba(0,229,255,0.25)]',
    glowBlue: 'shadow-[0_0_15px_rgba(79,195,247,0.15)]',
  },

  // Keyboard navigation & accessibility outlines
  focus: {
    ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070B]',
  },

  // Framer Motion transition curves
  animation: {
    durations: {
      fast: 0.15,
      normal: 0.3,
      slow: 0.5,
    },
    ease: [0.16, 1, 0.3, 1], // Custom cubic bezier curve
  }
};
