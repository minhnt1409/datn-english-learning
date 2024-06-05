import PropTypes from 'prop-types';

// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from '../MainCard';

export default function CardFolder({ color = 'primary', title, count, description, action }) {
  return (
    <MainCard contentSX={{ p: 2.25 }} onClick={action}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h4" color="inherit">
              {count}
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              variant="combined"
              color={color}
              label="Courses"
              sx={{ ml: 1.25, pl: 1 }}
              size="small"
            />
          </Grid>
        </Grid>
      </Stack>
      <Box sx={{ pt: 2.25 }}>
        <Typography variant="caption" color="text.secondary">
          Description: {description}
        </Typography>
      </Box>
    </MainCard>
  );
}

CardFolder.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  description: PropTypes.string
};