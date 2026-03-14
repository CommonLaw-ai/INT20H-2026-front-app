import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ConstructionRounded from '@mui/icons-material/ConstructionRounded';

interface PlaceholderPageProps {
  title: string;
}

/** Reusable "In Progress" placeholder page */
const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        gap: 2,
      }}
    >
      <ConstructionRounded sx={{ fontSize: 64, color: 'text.secondary' }} />
      <Typography variant="h4" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page is under construction
      </Typography>
    </Box>
  );
};

export default PlaceholderPage;
