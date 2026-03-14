import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';

/** Minimal centered layout for customer-facing chat pages */
const ClientLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Outlet />
    </Box>
  );
};

export default ClientLayout;
