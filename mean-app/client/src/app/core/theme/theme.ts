export interface Palette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  contrastDefaultColor: 'light' | 'dark';
}

export interface Theme {
  palette: {
    primary: Palette;
    accent: Palette;
    warn: Palette;
    background: {
      default: string;
      paper: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    fontWeightLight: number;
    fontWeightRegular: number;
    fontWeightMedium: number;
    fontWeightBold: number;
  };
  shape: {
    borderRadius: number;
  };
  shadows: string[];
}

export const theme: Theme = {
  palette: {
    primary: {
      50: '#E6F7F6',
      100: '#B3E6E2',
      200: '#80D6CE',
      300: '#4DC6BA',
      400: '#2FB6A8',
      500: '#2CA49D',
      600: '#239088',
      700: '#1C7B74',
      800: '#166660',
      900: '#0E4A44',
      contrastDefaultColor: 'light',
    },
    accent: {
      50: '#FEEFEF',
      100: '#FDCBCB',
      200: '#FA9B9B',
      300: '#F86B6B',
      400: '#F54747',
      500: '#EF4444',
      600: '#D63E3E',
      700: '#B83434',
      800: '#992B2B',
      900: '#6B1F1F',
      contrastDefaultColor: 'light',
    },
    warn: {
      50: '#FFF9E6',
      100: '#FEEFB3',
      200: '#FDE580',
      300: '#FDD94D',
      400: '#FCCC2F',
      500: '#F59E0B',
      600: '#DB8B0A',
      700: '#B97308',
      800: '#975C07',
      900: '#643E05',
      contrastDefaultColor: 'light',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F3F4F6',
    },
    text: {
      primary: '#000000',
      secondary: '#6B7280',
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
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 6px rgba(0,0,0,0.15)',
    '0px 4px 12px rgba(0,0,0,0.1)',
  ],
};