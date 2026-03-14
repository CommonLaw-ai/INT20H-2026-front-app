import { createTheme } from '@mui/material/styles';

/** Claude-inspired light theme */
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#b3845a',
      light: '#c9a07a',
      dark: '#8a6340',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6b7280',
    },
    background: {
      default: '#f5f0ea',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d2a26',
      secondary: '#6b6560',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
      },
    },
  },
});

/** Claude-inspired dark theme */
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#c9a07a',
      light: '#dbb99a',
      dark: '#a07850',
      contrastText: '#1a1714',
    },
    secondary: {
      main: '#9ca3af',
    },
    background: {
      default: '#1a1714',
      paper: '#2d2a26',
    },
    text: {
      primary: '#e8e2da',
      secondary: '#a09890',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
      },
    },
  },
});
