import React, { useEffect, useState } from "react";
import {Typography, Grid, Card, CardContent, Box, Button, IconButton} from '@mui/material';
import CardCourse from "../../components/card_course/CardCourse";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from 'react-router-dom';
import FolderPopup from './FolderPopup'
import Header from '../../components/Header';

function Folder() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const { folderId } = useParams();
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [isUser, setIsUser] = useState(false);
  const [description, setDescription] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('');

  const handleOpen = () => setOpen(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("No token or userId found. Redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/folders/${folderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
          },
        });
        setCourses(response.data.courses);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setIsUser(userId === response.data.userId)
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [folderId, refetch]);

  return (
    <div>
      <FolderPopup
        open={open}
        setOpen={setOpen}
        action={action}
        description={description}
        title={title}
        folderId={folderId}
        refetch={refetch}
        setRefetch={setRefetch}
      />
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
                  Folder: {title}
                  <IconButton title="Edit" size="large">
                    <EditIcon fontSize="large" onClick={() => {
                      setAction('edit')
                      handleOpen()
                    }}/>
                  </IconButton>
                  <IconButton title="Add Course" size="large" onClick={() => navigate(`create_course`)}>
                    <AddCircleOutlineOutlinedIcon fontSize="large" />
                  </IconButton>
                </Typography>

                <Typography>{description}</Typography>
              </Box>
              <Button onClick={() => navigate(-1)}>Back</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5">Courses (Total: {courses.length})</Typography>
        </Grid>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardCourse
              title={course.title}
              count={course.cards.length}
              description={course.description}
              action={() => navigate(`/course/${course._id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Folder;
