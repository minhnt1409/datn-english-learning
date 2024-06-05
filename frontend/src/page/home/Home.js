import React, { useEffect, useState } from "react";
import {Typography, Grid, Button, IconButton} from '@mui/material';
import CardFolder from "../../components/card_folder/CardFolder";
import CardCourse from "../../components/card_course/CardCourse";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import path from '../../api/Api'
import FolderPopup from '../folder/FolderPopup'
import Header from '../../components/Header';
import Light from '../../components/Light';

function Home() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectFolder, setSelectFolder] = useState();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('');

  const handleOpen = () => setOpen(true);

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
      <FolderPopup
        open={open}
        setOpen={setOpen}
        action={action}
      />
      <Header />
      <Grid container rowSpacing={4.5} columnSpacing={2.75} marginBottom={4}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Light
            title={"Folders"}
            icon={
              <IconButton title="Add Course" onClick={() => {
                setAction('add')
                handleOpen()
              }}>
                <AddCircleOutlineOutlinedIcon/>
              </IconButton>
            }
          />
        </Grid>
        {folders.map((folder) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardFolder
              folder={folder}
              action={() => navigate(`/folder/${folder._id}`)}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container rowSpacing={4.5} columnSpacing={2.75} marginBottom={4}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Light
            title="Courses"
            icon={
              <IconButton title="Add Course" onClick={() => navigate('/create_course')}>
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            }
          />
        </Grid>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardCourse
              course={course}
              action={() => navigate(`/course/${course._id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Home;
