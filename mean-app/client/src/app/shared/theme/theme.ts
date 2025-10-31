// src/app/core/theme/theme.ts

export const theme = {
  colors: {
    primary: {
      50: '#E6F7F6',
      100: '#B3E6E2',
      200: '#80D6CE',
      300: '#4DC6BA',
      400: '#2FB6A8',
      500: '#1FA293', // Main Sidebar + Buttons
      600: '#1B8B80',
      700: '#166C63',
      800: '#11554C',
      900: '#0B3D36',
      contrast: 'light',
    },
    accent: {
      50: '#FEEFEF',
      100: '#FDCBCB',
      200: '#FA9B9B',
      300: '#F86B6B',
      400: '#F54747',
      500: '#EF4444', // Red (Expenses, Errors)
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
      contrast: 'light',
    },
    warn: {
      50: '#FFF9E6',
      100: '#FEEFB3',
      200: '#FDE580',
      300: '#FDD94D',
      400: '#FCCC2F',
      500: '#F59E0B', // Orange (Utilities)
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      contrast: 'light',
    },
    background: {
      default: '#F9FAFB', // Light Gray background
      paper: '#FFFFFF',   // White cards/forms
    },
    text: {
      primary: '#111827', // Dark Gray/Black
      secondary: '#6B7280', // Muted Gray
    },
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 16, // Rounded corners
  },
  shadows: [
    'none',
    '0px 2px 6px rgba(0,0,0,0.1)',
    '0px 4px 12px rgba(0,0,0,0.08)',
  ],
};
