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

  const {data, refetch} = useQuery(['get-course-detail', courseId], () => {
    return rootApi.get(path.course.getDetail({courseId}))
  })

  useEffect(() => {
    setIsUser(data?.data?.userId === userId)
  }, [data])

  return (
    <>
      <div>
        <Header />
        <Box mb={2} marginTop={2}>
          <Card elevation={1}>
            <CardContent style={{padding: 24}}>
              <Box display="flex" justifyContent="space-between">
                <Box style={{width: '80%'}}>
                  <Typography
                    variant="h2"
                    gutterBottom
                    style={{textOverflow: 'ellipsis', overflow: 'hidden'}}
                  >
                    Course: {data?.data?.title}
                    {isUser && (
                      <IconButton title="Edit" size="large">
                        <EditIcon fontSize="large" onClick={() => navigate(`/update_course/${data?.data._id}`)}/>
                      </IconButton>
                    )}
                  </Typography>

                  <Typography>{data?.data?.description}</Typography>
                </Box>
                <Button onClick={() => navigate(-1)}>Back</Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box display="flex" justifyContent="space-between" marginBottom={2}>
          <Box style={{width: '80%'}}>
            <Typography variant="h5" gutterBottom>
              <b>Cards Data</b>
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate(`/flash_card/${courseId}`)}>Go to Flash Cards</Button>
          <Button variant="contained" onClick={() => navigate(`/quiz/${courseId}`)}>Go to Quiz</Button>
        </Box>
        <Grid container spacing={2} alignItems="stretch">
          {data?.data?.cards?.map((card) => (
            <Grid item xs={2} key={card._id}>
              <CardItem
                key_card={card?.key}
                value={card?.value}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
}

export default CourseDetail;
