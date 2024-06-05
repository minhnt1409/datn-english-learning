import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from '../MainCard';

export default function CardFolder({ key_card, value }) {
  return (
    <MainCard
      contentSX={{
        p: 2.25,
        backgroundColor: 'background.paper',
        boxShadow: 1,
        borderRadius: '12px',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Key: {key_card}
        </Typography>
      </Stack>
      <Box sx={{ pt: 2.25, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Value: {value}
        </Typography>
      </Box>
    </MainCard>
  );
}

CardFolder.propTypes = {
  key_card: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
