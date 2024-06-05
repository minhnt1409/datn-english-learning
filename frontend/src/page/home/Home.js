import React, { useEffect, useState } from "react";
import {Typography, Grid} from '@mui/material';
import CardFolder from "../../components/card_folder/CardFolder";
import CardCourse from "../../components/card_course/CardCourse";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import path from '../../api/Api'

function Home() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!token || !userId) {
      alert("No token found. Redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchFolders = async () => {
      try {
        const response = await axios.get(
          path.folder.listRandom({userId,limit: 8}),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFolders(response.data);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          path.course.listRandom({userId,limit: 8}),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchFolders();
    fetchCourses();
  }, [token, userId, navigate]);

  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5">Folders</Typography>
        </Grid>
        {folders.map((folder) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardFolder
              title={folder.title}
              count={folder.courses.length}
              description={folder.description}
              action={() => navigate(`folder/${folder._id}`)}
            />
          </Grid>
        ))}
      </Grid>
      <br />
      <br />
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5">Courses</Typography>
        </Grid>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardCourse
              title={course.title}
              count={course.cards.length}
              description={course.description}
              color="secondary"
              action={() => navigate(`course/${course._id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Home;
