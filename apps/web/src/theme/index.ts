import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD166', // Gold/Accent
      contrastText: '#1B1B1B',
    },
    secondary: {
      main: '#1A5F7A', // Deep Blue
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1B1B1B',
    },
    text: {
      primary: '#F2F3F4', // Platinum
      secondary: '#9AA2A9',
    },
    grey: {
      50: '#F2F3F4',
      100: '#E1E4E7',
      800: '#1B1B1B',
      900: '#0A0A0A',
    },
  },
  typography: {
    fontFamily: '"Raleway", "Cairo", sans-serif',
    h1: {
      fontFamily: '"Bodoni Moda", serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Bodoni Moda", serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Bodoni Moda", serif',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 4px 12px rgba(0,0,0,0.1)',
    '0 8px 24px rgba(0,0,0,0.12)',
    '0 12px 32px rgba(0,0,0,0.15)',
    '0 16px 40px rgba(0,0,0,0.2)',
    '0 20px 48px rgba(0,0,0,0.25)',
    '0 24px 56px rgba(0,0,0,0.3)',
    '0 28px 64px rgba(0,0,0,0.35)',
    '0 32px 72px rgba(0,0,0,0.4)',
    '0 36px 80px rgba(0,0,0,0.45)',
    '0 40px 88px rgba(0,0,0,0.5)',
    '0 44px 96px rgba(0,0,0,0.55)',
    '0 48px 104px rgba(0,0,0,0.6)',
    '0 52px 112px rgba(0,0,0,0.65)',
    '0 56px 120px rgba(0,0,0,0.7)',
    '0 60px 128px rgba(0,0,0,0.75)',
    '0 64px 136px rgba(0,0,0,0.8)',
    '0 68px 144px rgba(0,0,0,0.85)',
    '0 72px 152px rgba(0,0,0,0.9)',
    '0 76px 160px rgba(0,0,0,0.95)',
    '0 80px 168px rgba(0,0,0,1)',
    '0 84px 176px rgba(0,0,0,1)',
    '0 88px 184px rgba(0,0,0,1)',
    '0 92px 192px rgba(0,0,0,1)',
    '0 96px 200px rgba(0,0,0,1)',
  ],
});

export default theme;