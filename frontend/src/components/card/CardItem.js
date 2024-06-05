import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from '../MainCard';

export default function CardFolder({key_card, value}) {
  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6">
          Key: {key_card}
        </Typography>
      </Stack>
      <Box sx={{ pt: 2.25 }}>
        <Typography variant="caption">
          Value: {value}
        </Typography>
      </Box>
    </MainCard>
  );
}

CardFolder.propTypes = {
  key: PropTypes.string,
  value: PropTypes.string,
};