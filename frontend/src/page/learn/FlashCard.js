import React, { useState, useEffect } from "react";
import { useQuery } from 'react-query';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button, Box, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Header from "../../components/Header";
import rootApi from '../../api/rootApi';
import path from '../../api/Api';

function FlashCard() {
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data } = useQuery(['get-course-detail', courseId], () => {
    return rootApi.get(path.course.getDetail({ courseId }));
  });

  useEffect(() => {
    if (data) {
      setCards(data?.data.cards);
      setTitle(data?.data.title);
    }
  }, [data]);

  const handleNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCompletedCards([...completedCards, cards[currentIndex]]);
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    } else {
      alert("You have learned all cards!");
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div>
      <Header />

      <Container maxWidth="md">
        <Box sx={{ bgcolor: '#f5f5f5', p: 3, mt: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" gutterBottom>
            Course: {title}
          </Typography>

          {cards.length > 0 && currentIndex < cards.length && (
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
              <Card onClick={handleFlip} sx={{ cursor: 'pointer', position: 'relative', width: '400px', height: '200px', perspective: '1000px' }}>
                <CardContent sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  marginLeft: '-1rem',
                  marginTop: '-1rem',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transition: 'transform 0.6s',
                  background: 'linear-gradient(135deg, #b2fab4, #e6ffe7)'
                }}>
                  <Typography variant="h5">{cards[currentIndex].key}</Typography>
                </CardContent>
                <CardContent sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  marginLeft: '-1rem',
                  marginTop: '-1rem',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  transform: flipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                  transition: 'transform 0.6s',
                  background: 'linear-gradient(135deg, #e6ffe7, #b2fab4)'
                }}>
                  <Typography variant="h5">{cards[currentIndex].value}</Typography>
                </CardContent>
              </Card>

              <Box mt={2} display="flex" justifyContent="space-between" width="100%">
                <Button
                  onClick={handlePrevCard}
                  disabled={currentIndex === 0}
                  variant="contained"
                  startIcon={<ArrowBackIcon />}
                >
                  Prev
                </Button>
                {currentIndex >= cards.length - 1 ? (
                  <Button
                    onClick={() => navigate(`/course/${courseId}`)}
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Back to Course
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextCard}
                    disabled={currentIndex >= cards.length - 1}
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Next
                  </Button>
                )}
              </Box>

              <Typography mt={2} variant="body1">
                {currentIndex + 1}/{cards.length}
              </Typography>
            </Box>
          )}

          <Typography variant="h5" mt={4}>Cards List</Typography>
          <ul>
            {completedCards.map((card, index) => (
              <li key={index} style={{ listStyle: 'none' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" p={1} m={1} bgcolor="#ffc0cb" borderRadius={1}>
                  <Typography variant="body1">{card.key}</Typography>
                  <Typography variant="body1">{card.value}</Typography>
                </Box>
              </li>
            ))}
          </ul>
        </Box>
      </Container>
    </div>
  );
}

export default FlashCard;
