import React, { useState, useEffect } from "react";
import { useQuery } from 'react-query';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography, TextField, Paper, Card, Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Header from "../../components/Header";
import rootApi from '../../api/rootApi';
import path from '../../api/Api';

function Quiz() {
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [isChoiceQuestion, setIsChoiceQuestion] = useState(true);
  const [choices, setChoices] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { courseId } = useParams();
  const navigate = useNavigate()

  const { data } = useQuery(['get-course-detail', courseId], () => {
    return rootApi.get(path.course.getDetail({ courseId }));
  });

  useEffect(() => {
    if (data) {
      setCards(data?.data.cards);
      setTitle(data?.data.title);
      setIsChoiceQuestion(Math.random() < 0.5);
    }
  }, [data]);

  useEffect(() => {
    if (cards.length > 0) {
      if (isChoiceQuestion) {
        generateChoices();
      }
    }
  }, [cards, currentIndex, isChoiceQuestion]);

  const generateChoices = () => {
    const correctAnswer = cards[currentIndex].value;
    const wrongAnswers = cards
      .filter((_, index) => index !== currentIndex)
      .map(card => card.value)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allChoices = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
    setChoices(allChoices);
  };

  const handleNextQuestion = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsChoiceQuestion(Math.random() < 0.5);
      setInputValue("");
    } else {
      setQuizCompleted(true);
    }
  };

  const handleChoiceAnswer = (answer) => {
    const isCorrect = answer === cards[currentIndex].value;
    setScore(score + (isCorrect ? 1 : 0));
    setResults([...results, { question: cards[currentIndex].key, answer, isCorrect, correctAnswer: cards[currentIndex].value }]);
    handleNextQuestion();
  };

  const handleInputAnswer = () => {
    const isCorrect = inputValue === cards[currentIndex].key;
    setScore(score + (isCorrect ? 1 : 0));
    setResults([...results, { question: cards[currentIndex].value, answer: inputValue, isCorrect, correctAnswer: cards[currentIndex].key }]);
    handleNextQuestion();
  };

  return (
    <div>
      <Header />

      <Container maxWidth="md">
        <Box sx={{ bgcolor: '#f5f5f5', p: 3, mt: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" gutterBottom>
            Course: {title}
            <IconButton title="Back to Course" onClick={() => navigate(`/course/${courseId}`)}>
              <ArrowBackIcon />
            </IconButton>
            <IconButton title="Learn Again" onClick={() => navigate(0)}>
              <AutorenewIcon />
            </IconButton>
          </Typography>

          {!quizCompleted ? (
            cards.length > 0 && currentIndex < cards.length && (
              <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                <Card sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  width: '760px',
                  height: '260px',
                  perspective: '1000px',
                  padding: '20px',
                  boxShadow: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  {isChoiceQuestion ? (
                    <>
                      <Typography variant="h5" mb={2} sx={{ alignSelf: 'flex-start' }}>
                        {cards[currentIndex].key}
                      </Typography>
                      <Grid container spacing={2} sx={{ mt: 'auto', mb: 2 }}>
                        {choices.map((choice, index) => (
                          <Grid item xs={6} key={index}>
                            <Button
                              onClick={() => handleChoiceAnswer(choice)}
                              variant="contained"
                              sx={{ width: '100%', padding: '10px', fontSize: '1rem' }}
                            >
                              {choice}
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Typography variant="h5" mb={2} sx={{ alignSelf: 'flex-start' }}>
                        {cards[currentIndex].value}
                      </Typography>
                      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mt="auto" mb={2}>
                        <TextField
                          label="Your Answer"
                          variant="outlined"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          sx={{ width: '75%', mr: 4 }}
                        />
                        <Button onClick={handleInputAnswer} variant="contained" sx={{ width: '20%', height: '56px', fontSize: '1rem' }}>
                          Submit
                        </Button>
                      </Box>
                    </>
                  )}
                </Card>
              </Box>
            )
          ) : (
            <>
              <Typography variant="h5" mt={4}>Quiz Completed!</Typography>
              <Typography variant="h5" mt={4}>Score: {score}/{cards?.length}</Typography>
              <Box component={Paper} p={2} mt={2}>
                {results.map((result, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center" p={1} mb={1} bgcolor={result.isCorrect ? '#e0ffe0' : '#ffe0e0'} borderRadius={1}>
                    <Grid container spacing={2} >
                    <Grid item xs={4}><Typography variant="body1">{result.question}</Typography></Grid>
                    <Grid item xs={4}><Typography variant="body1">{result.answer}</Typography></Grid>
                    <Grid item xs={4}>
                      <Typography variant="body1">{result.isCorrect ? 'Correct' : `Incorrect, The answer is: ${result.correctAnswer}`}</Typography>
                    </Grid>
                    </Grid>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Container>
    </div>
  );
}

export default Quiz;
