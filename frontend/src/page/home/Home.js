import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import CardFolder from '../../components/card_folder/CardFolder';
import CardCourse from '../../components/card_course/CardCourse';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import path from '../../api/Api';
import Header from '../../components/Header';
import Light from '../../components/Light';

function Home() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!token || !userId) {
      alert('No token found. Redirecting to login.');
      navigate('/sign_in');
      return;
    }

    const fetchFolders = async () => {
      try {
        const response = await axios.get(path.folder.listRandom({ userId, limit: 8 }), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFolders(response.data);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get(path.course.listRandom({ userId, limit: 8 }), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchFolders();
    fetchCourses();
  }, [token, userId, navigate]);

  return (
    <>
      <Header />
      <Grid container spacing={4} marginBottom={4}>
        <Grid item xs={12}>
          <Light title="Folders" />
        </Grid>
        {folders.map((folder) => (
          <Grid item key={folder._id} xs={12} sm={6} md={4} lg={3}>
            <CardFolder
            folder={folder}
            action={() => navigate(`/folder/${folder._id}`)}
            avatar={`http://localhost:8000/other/image/${folder?.userId?.avatar}`}
          />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={4} marginBottom={4}>
        <Grid item xs={12}>
          <Light title="Courses" />
        </Grid>
        {courses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={4} lg={3}>
            <CardCourse
              course={course}
              action={() => navigate(`/course/${course._id}`)}
              avatar={`http://localhost:8000/other/image/${course?.userId?.avatar}`}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Home;
