import { RouterProvider } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import router from '@/router';
import { useThemeMode } from '@/ThemeContext';

const App = () => {
  const { isDark, toggleTheme } = useThemeMode();

  return (
    <>
      <RouterProvider router={router} />
      <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'} placement="left">
        <Fab
          size="medium"
          onClick={toggleTheme}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            color: isDark ? '#e8e2da' : '#2d2a26',
            backdropFilter: 'blur(12px)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
            boxShadow: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)',
              boxShadow: 'none',
            },
          }}
        >
          {isDark ? <LightModeRounded /> : <DarkModeRounded />}
        </Fab>
      </Tooltip>
    </>
  );
};

export default App;
