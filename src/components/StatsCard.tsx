import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  isLoading: boolean;
}

/** Dashboard summary card with icon, title, and value */
const StatsCard = ({ title, value, icon, isLoading }: StatsCardProps) => {
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h4" fontWeight={700}>
                {value}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: 'primary.main', opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
