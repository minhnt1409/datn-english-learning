import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {Typography, Grid, Card, CardContent, Box, Button, IconButton} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CardItem from '../../components/card/CardItem'
import Header from '../../components/Header';

function CourseDetail() {
  const [course, setCourse] = useState();
  const [isUser, setIsUser] = useState(false);
  const { courseId } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !userId) {
      alert("No token or userId found. Redirecting to login.");
      navigate("/login");
      return;
    }
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/courses/${courseId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
          setIsUser(userId === data.userId)
          localStorage.setItem(`cards_${courseId}`, JSON.stringify(data));
        } else {
          console.error("Failed to fetch cards");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCourse();
  }, [courseId, token]);

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
                    Course: {course?.title}
                    <IconButton title="Edit" size="large">
                      <EditIcon fontSize="large" onClick={() => navigate(`/update_course/${course._id}`)}/>
                    </IconButton>
                  </Typography>

                  <Typography>{course?.description}</Typography>
                </Box>
                <Button onClick={() => navigate(-1)}>Back</Button>
                <Button onClick={() => navigate(`/flash_card/${courseId}`)}>Go to Flash Cards</Button>
                <Button onClick={() => navigate(`/quiz/${courseId}`)}>Go to Quiz</Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <h2 className="cards-title">Cards Data</h2>
        <Grid container spacing={2} alignItems="stretch">
          {course?.cards?.map((card) => (
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
