import React, { useEffect } from "react";
import {useQuery} from 'react-query'
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {Typography, Grid, Card, CardContent, Box, Button, IconButton} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CardItem from '../../components/card/CardItem'
import Header from '../../components/Header';
import rootApi from '../../api/rootApi'
import path from '../../api/Api'

function CourseDetail() {
  const [isUser, setIsUser] = useState(false);
  const { courseId } = useParams();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const { data, refetch } = useQuery(['get-course-detail', courseId], () => {
    return rootApi.get(path.course.getDetail({ courseId }));
  });

  useEffect(() => {
    setIsUser(data?.data?.userId === userId);
  }, [data, userId]);

  return (
    <Box sx={{ minHeight: '100vh'}}>
      <Header />
      <Box mb={2} mt={2}>
        <Card elevation={3} sx={{ borderRadius: '12px', padding: '16px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  Course: {data?.data?.title}
                  {isUser && (
                    <IconButton title="Edit" size="large" onClick={() => navigate(`/update_course/${data?.data._id}`)}>
                      <EditIcon fontSize="large" />
                    </IconButton>
                  )}
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                  Description: {data?.data?.description}
                </Typography>
              </Box>
              <Button variant="contained" onClick={() => navigate(-1)}>
                Back
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          <b>Cards Data</b>
        </Typography>
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => navigate(`/flash_card/${courseId}`)}>Go to Flash Cards</Button>
          <Button variant="contained" color="secondary" onClick={() => navigate(`/quiz/${courseId}`)}>Go to Quiz</Button>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {data?.data?.cards?.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card._id}>
            <CardItem
              key_card={card?.key}
              value={card?.value}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CourseDetail;
