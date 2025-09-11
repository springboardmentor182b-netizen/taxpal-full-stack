/**
 * TaxPal Theme Configuration
 * Complete theme system for the TaxPal Personal Finance & Tax Estimator application
 */

export const theme = {
  // Core Brand Colors - Blue Gradient Scheme
  brand: {
    primary: '#4682B4',      // Steel Blue
    secondary: '#ADD8E6',    // Light Blue
    tertiary: '#87CEEB',     // Sky Blue
    accent: '#5F9EA0',       // Cadet Blue
    highlight: '#6495ED',    // Cornflower Blue
  },

  // Light Theme Colors
  light: {
    background: '#f8fafc',
    foreground: '#1e293b',
    card: '#ffffff',
    cardForeground: '#1e293b',
    popover: '#ffffff',
    popoverForeground: '#1e293b',
    primary: '#4682B4',
    primaryForeground: '#ffffff',
    secondary: '#ADD8E6',
    secondaryForeground: '#1e293b',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#e2e8f0',
    accentForeground: '#1e293b',
    destructive: '#dc2626',
    destructiveForeground: '#ffffff',
    border: 'rgba(70, 130, 180, 0.2)',
    input: 'transparent',
    inputBackground: '#f8fafc',
    switchBackground: '#cbd5e1',
    ring: '#4682B4',
  },

  // Dark Theme Colors
  dark: {
    background: '#0f172a',
    foreground: '#f1f5f9',
    card: '#1e293b',
    cardForeground: '#f1f5f9',
    popover: '#1e293b',
    popoverForeground: '#f1f5f9',
    primary: '#87CEEB',
    primaryForeground: '#0f172a',
    secondary: '#334155',
    secondaryForeground: '#f1f5f9',
    muted: '#334155',
    mutedForeground: '#94a3b8',
    accent: '#475569',
    accentForeground: '#f1f5f9',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: 'rgba(135, 206, 235, 0.2)',
    input: '#334155',
    inputBackground: '#1e293b',
    switchBackground: '#475569',
    ring: '#87CEEB',
  },

  // Chart Colors (Data Visualization)
  charts: {
    primary: '#4682B4',
    secondary: '#87CEEB',
    tertiary: '#ADD8E6',
    quaternary: '#5F9EA0',
    quinary: '#6495ED',
  },

  // Sidebar Theme
  sidebar: {
    light: {
      background: '#f8fafc',
      foreground: '#1e293b',
      primary: '#4682B4',
      primaryForeground: '#ffffff',
      accent: '#f1f5f9',
      accentForeground: '#334155',
      border: '#e2e8f0',
      ring: '#4682B4',
    },
    dark: {
      background: '#1e293b',
      foreground: '#f1f5f9',
      primary: '#87CEEB',
      primaryForeground: '#0f172a',
      accent: '#334155',
      accentForeground: '#f1f5f9',
      border: '#475569',
      ring: '#87CEEB',
    },
  },

  // Typography System
  typography: {
    fontSize: {
      base: '16px',
      sm: '14px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      normal: 1.5,
      tight: 1.25,
      loose: 1.75,
    },
  },

  // Border Radius System
  radius: {
    sm: '0.225rem',     // --radius - 4px
    md: '0.425rem',     // --radius - 2px
    lg: '0.625rem',     // --radius (base)
    xl: '0.825rem',     // --radius + 4px
    full: '9999px',
  },

  // Gradient Definitions
  gradients: {
    // Primary Brand Gradients
    primaryToSecondary: 'linear-gradient(to right, #4682B4, #ADD8E6)',
    secondaryToPrimary: 'linear-gradient(to right, #ADD8E6, #4682B4)',
    
    // Radial Gradients
    radialPrimary: 'radial-gradient(circle, #4682B4, #ADD8E6)',
    radialSecondary: 'radial-gradient(circle, #ADD8E6, #87CEEB)',
    
    // Background Gradients
    backgroundLight: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    backgroundDark: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    
    // Glass Morphism
    glassmorphism: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    glassmorphismDark: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
    
    // Neon Effects
    neonBlue: 'linear-gradient(45deg, #4682B4, #87CEEB, #ADD8E6)',
    neonGlow: 'radial-gradient(circle, rgba(70,130,180,0.3) 0%, transparent 70%)',
  },

  // Animation System
  animations: {
    // Duration
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '800ms',
    },
    
    // Easing Functions
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      bounceIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      bounceOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    
    // Keyframes
    keyframes: {
      neonGlow: {
        '0%, 100%': {
          filter: 'drop-shadow(0 0 5px var(--primary)) drop-shadow(0 0 10px var(--primary)) drop-shadow(0 0 15px var(--primary))',
        },
        '50%': {
          filter: 'drop-shadow(0 0 10px var(--primary)) drop-shadow(0 0 20px var(--primary)) drop-shadow(0 0 30px var(--primary))',
        },
      },
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      slideInUp: {
        from: { transform: 'translateY(20px)', opacity: 0 },
        to: { transform: 'translateY(0)', opacity: 1 },
      },
      slideInRight: {
        from: { transform: 'translateX(20px)', opacity: 0 },
        to: { transform: 'translateX(0)', opacity: 1 },
      },
      scaleIn: {
        from: { transform: 'scale(0.95)', opacity: 0 },
        to: { transform: 'scale(1)', opacity: 1 },
      },
    },
  },

  // Spacing System (based on Tailwind defaults)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },

  // Shadow System
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
    // Neon shadows
    neonSm: '0 0 5px rgba(70, 130, 180, 0.5)',
    neonMd: '0 0 10px rgba(70, 130, 180, 0.5), 0 0 20px rgba(70, 130, 180, 0.3)',
    neonLg: '0 0 15px rgba(70, 130, 180, 0.5), 0 0 30px rgba(70, 130, 180, 0.3), 0 0 45px rgba(70, 130, 180, 0.1)',
  },

  // Component-Specific Themes
  components: {
    // Button variants
    button: {
      primary: {
        background: 'linear-gradient(to right, #4682B4, #ADD8E6)',
        color: '#ffffff',
        border: 'none',
        shadow: '0 4px 6px -1px rgba(70, 130, 180, 0.25)',
      },
      secondary: {
        background: 'transparent',
        color: '#4682B4',
        border: '1px solid #4682B4',
        shadow: 'none',
      },
      ghost: {
        background: 'transparent',
        color: '#64748b',
        border: 'none',
        shadow: 'none',
      },
    },
    
    // Card variants
    card: {
      default: {
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      elevated: {
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      glass: {
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(10px)',
      },
    },
    
    // Input variants
    input: {
      default: {
        background: 'var(--input-background)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        focusBorder: '1px solid var(--primary)',
        focusRing: '0 0 0 2px rgba(70, 130, 180, 0.2)',
      },
    },
  },

  // Responsive Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Status Colors
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Transaction Categories Colors
  categories: {
    income: {
      salary: '#22c55e',
      freelance: '#3b82f6',
      investment: '#8b5cf6',
      business: '#f59e0b',
      other: '#6b7280',
    },
    expense: {
      food: '#ef4444',
      transport: '#f97316',
      entertainment: '#ec4899',
      utilities: '#06b6d4',
      healthcare: '#84cc16',
      shopping: '#a855f7',
      other: '#6b7280',
    },
  },
} as const;

// Type definitions for theme
export type Theme = typeof theme;
export type ThemeColors = Theme['light'] | Theme['dark'];
export type BrandColors = Theme['brand'];
export type ChartColors = Theme['charts'];
export type GradientTypes = keyof Theme['gradients'];
export type AnimationDurations = keyof Theme['animations']['duration'];
export type SpacingValues = keyof Theme['spacing'];
export type ShadowTypes = keyof Theme['shadows'];

// Helper functions
export const getThemeColor = (colorPath: string, isDark = false) => {
  const themeMode = isDark ? theme.dark : theme.light;
  return (themeMode as any)[colorPath] || colorPath;
};

export const getGradient = (gradientName: GradientTypes) => {
  return theme.gradients[gradientName];
};

export const getAnimation = (duration: AnimationDurations, easing = 'easeInOut') => {
  return `${theme.animations.duration[duration]} ${theme.animations.easing[easing]}`;
};

// CSS Custom Properties Generator
export const generateCSSVariables = (isDark = false) => {
  const colors = isDark ? theme.dark : theme.light;
  const cssVars: Record<string, string> = {};
  
  Object.entries(colors).forEach(([key, value]) => {
    cssVars[`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = value;
  });
  
  return cssVars;
};

// Export default theme
export default theme;
