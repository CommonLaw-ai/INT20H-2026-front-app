import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import SupportAgentRounded from '@mui/icons-material/SupportAgentRounded';
import SidebarNav from '@/components/SidebarNav';

const DRAWER_WIDTH = 260;

/** Back office layout with permanent sidebar and content area */
const BackOfficeLayout = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: isDark ? '#1e1b18' : '#faf8f5',
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: 'background-color 0.3s ease',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2.5 }}>
          <SupportAgentRounded sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>
            Support BO
          </Typography>
        </Box>
        <Divider />
        <SidebarNav />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          bgcolor: 'background.default',
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default BackOfficeLayout;
