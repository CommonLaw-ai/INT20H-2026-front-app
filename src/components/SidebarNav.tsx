import { useLocation, useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import DashboardRounded from '@mui/icons-material/DashboardRounded';
import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import PeopleRounded from '@mui/icons-material/PeopleRounded';
import ConfirmationNumberRounded from '@mui/icons-material/ConfirmationNumberRounded';
import AssignmentRounded from '@mui/icons-material/AssignmentRounded';
import AccountCircleRounded from '@mui/icons-material/AccountCircleRounded';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/bo/dashboard', icon: <DashboardRounded /> },
  { label: 'Chats', path: '/bo/chats', icon: <ChatBubbleOutlineRounded /> },
  { label: 'Settings', path: '/bo/settings', icon: <SettingsRounded /> },
  { label: 'Users', path: '/bo/users', icon: <PeopleRounded /> },
  { label: 'Tickets', path: '/bo/tickets', icon: <ConfirmationNumberRounded /> },
  { label: 'Action Requests', path: '/bo/action-requests', icon: <AssignmentRounded /> },
  { label: 'User Profile', path: '/bo/user-profile', icon: <AccountCircleRounded /> },
];

/** Back office sidebar navigation with icons and active state */
const SidebarNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <List component="nav" sx={{ px: 1, pt: 1 }}>
      {NAV_ITEMS.map((item, index) => {
        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
        return (
          <ListItemButton
            key={item.path}
            onClick={() => navigate(item.path)}
            selected={isActive}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              transition: 'all 0.2s ease',
              opacity: 0,
              animation: 'navFadeIn 0.3s ease forwards',
              animationDelay: `${index * 40}ms`,
              '@keyframes navFadeIn': {
                from: { opacity: 0, transform: 'translateX(-8px)' },
                to: { opacity: 1, transform: 'translateX(0)' },
              },
              '&.Mui-selected': {
                bgcolor: isDark ? 'rgba(201,160,122,0.12)' : 'rgba(179,132,90,0.1)',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(201,160,122,0.18)' : 'rgba(179,132,90,0.15)',
                },
              },
              '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive ? 'primary.main' : 'text.secondary',
                minWidth: 40,
                transition: 'color 0.2s ease',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'text.primary' : 'text.secondary',
                  transition: 'color 0.2s ease',
                },
              }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
};

export default SidebarNav;
