/**
 * Detailed Theme Configuration (Pure TS, no MUI)
 * Light/Dark mode, glassmorphism, gradients, shadows, typography, spacing
 */

export const theme = {
  // Brand Colors
  brand: {
    primary: '#1976d2',   // Blue for buttons/highlights
    success: '#4caf50',   // Green for income
    error: '#f44336',     // Red for expense
    warning: '#ff9800',   // Orange for alerts
    info: '#29b6f6',      // Light blue info
  },

  // Light Theme
  light: {
    background: '#f5f7fa',
    foreground: '#212121',
    card: '#ffffff',
    cardForeground: '#212121',
    popover: '#ffffff',
    popoverForeground: '#212121',
    primary: '#1976d2',
    primaryForeground: '#ffffff',
    secondary: '#29b6f6',
    secondaryForeground: '#212121',
    muted: '#f1f5f9',
    mutedForeground: '#555555',
    accent: '#e2e8f0',
    accentForeground: '#212121',
    destructive: '#f44336',
    destructiveForeground: '#ffffff',
    border: 'rgba(25,118,210,0.2)',
    input: 'transparent',
    inputBackground: '#f5f7fa',
    switchBackground: '#cbd5e1',
    ring: '#1976d2',
  },

  // Dark Theme
  dark: {
    background: '#121212',
    foreground: '#e0e0e0',
    card: '#1e1e1e',
    cardForeground: '#e0e0e0',
    popover: '#1e1e1e',
    popoverForeground: '#e0e0e0',
    primary: '#1976d2',
    primaryForeground: '#121212',
    secondary: '#29b6f6',
    secondaryForeground: '#121212',
    muted: '#1e1e1e',
    mutedForeground: '#b0b0b0',
    accent: '#475569',
    accentForeground: '#e0e0e0',
    destructive: '#ef5350',
    destructiveForeground: '#ffffff',
    border: 'rgba(25,118,210,0.2)',
    input: '#1e1e1e',
    inputBackground: '#121212',
    switchBackground: '#475569',
    ring: '#1976d2',
  },

  // Typography
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
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

  // Border Radius
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.625rem',
    xl: '0.825rem',
    full: '9999px',
  },

  // Gradients
  gradients: {
    primaryToSecondary: 'linear-gradient(to right, #1976d2, #29b6f6)',
    secondaryToPrimary: 'linear-gradient(to right, #29b6f6, #1976d2)',
    glassLight: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
    glassDark: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    glass: '0 4px 30px rgba(0,0,0,0.1)',
  },

  // Components
  components: {
    button: {
      primary: {
        background: 'linear-gradient(to right, #1976d2, #29b6f6)',
        color: '#ffffff',
        border: 'none',
        shadow: '0 4px 6px rgba(25,118,210,0.25)',
      },
      secondary: {
        background: 'transparent',
        color: '#1976d2',
        border: '1px solid #1976d2',
        shadow: 'none',
      },
      ghost: {
        background: 'transparent',
        color: '#555555',
        border: 'none',
        shadow: 'none',
      },
    },
    card: {
      default: {
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        shadow: '0 4px 6px rgba(0,0,0,0.1)',
      },
      glass: {
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(10px)',
      },
    },
    input: {
      default: {
        background: 'var(--input-background)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        focusBorder: '1px solid var(--primary)',
        focusRing: '0 0 0 2px rgba(25,118,210,0.2)',
      },
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index
  zIndex: {
    modal: 1400,
    tooltip: 1800,
  },
};

// Types
export type ThemeType = typeof theme;
export type ThemeColors = ThemeType['light'] | ThemeType['dark'];

// Helper to get color
export const getThemeColor = (color: keyof ThemeColors, isDark = false) =>
  (isDark ? theme.dark[color] : theme.light[color]) || color;

// Export default
export default theme;
