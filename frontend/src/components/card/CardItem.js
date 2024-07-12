import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from '../MainCard';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useState } from 'react';

export default function CardFolder({ key_card, value }) {
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [audioSrc, setAudioSrc] = useState('');

  const handleClickOpen = async () => {
    setOpen(true);
    // Fetch the explanation and pronunciation from DictionaryAPI
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${key_card}`);
    const data = await response.json();

    if (data && data.length > 0) {
      const entry = data[0];
      const definition = entry.meanings[0].definitions[0].definition;
      const pronunciationData = entry.phonetics[0]?.text || 'No pronunciation found';
      const audio = entry.phonetics[0]?.audio || '';

      setExplanation(definition);
      setPronunciation(pronunciationData);
      setAudioSrc(audio);
    } else {
      setExplanation('Không tìm thấy giải thích.');
      setPronunciation('Không tìm thấy phát âm.');
      setAudioSrc('');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePlayPronunciation = () => {
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.play();
    }
  };

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
      <Stack spacing={1} sx={{ textAlign: 'center', position: 'relative' }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Key: {key_card}
        </Typography>
        <IconButton
          sx={{ position: 'absolute', top: 0, right: 0 }}
          onClick={handleClickOpen}
        >
          <InfoIcon />
        </IconButton>
      </Stack>
      <Box sx={{ pt: 2.25, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Value: {value}
        </Typography>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Giải thích và Phát âm</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Giải thích: {explanation}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1">Phát âm: {pronunciation}</Typography>
            {audioSrc && (
              <IconButton onClick={handlePlayPronunciation}>
                <VolumeUpIcon />
              </IconButton>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}

CardFolder.propTypes = {
  key_card: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
