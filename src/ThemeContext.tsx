import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from '@/theme';

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  toggleTheme: () => {},
});

/** Hook to access theme toggle */
export const useThemeMode = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

/** Theme provider with dark/light mode toggle */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const contextValue = useMemo(() => ({ isDark, toggleTheme }), [isDark, toggleTheme]);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
