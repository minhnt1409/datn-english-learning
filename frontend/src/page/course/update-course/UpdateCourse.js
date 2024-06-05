import React, { useEffect, useState } from "react";
import {Typography, Card, CardContent, Box, Button, TextField, IconButton, Grid} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { showMessage } from "../../../components/show_message/ShowMessage";
import Header from '../../../components/Header';
import Light from "../../../components/Light";

const UpdateCourse = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(4);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [listCard, setListCard] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const { courseId } = useParams();

  useEffect(() => {
    if (token && userId) {
      const fetchCourses = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/courses/${courseId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // setCourses(response.data);
          setTitle(response.data.title)
          setDescription(response.data.description)
          console.log(response.data);
          setCount(response.data.cards.length)
          setListCard(response.data.cards)
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };
      fetchCourses();
    } else {
      alert("No token found. Redirecting to login.");
      navigate("/login");
    }
  }, [token, userId, navigate]);

  const handlePopupClick = () => {
    setCount(count + 1);
  };

  const handleDeleteClick = (index) => {
    if (count > 4) {
      console.log(index);
      const newCards = listCard.filter((_, i) => i !== index);
      setListCard(newCards);
      setCount(count - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.put(`http://localhost:8000/courses/${courseId}`, {
        title: data.get('title'),
        description: data.get('description'),
        listCards: listCard,
      }, config);

      if (response.status === 201 || response.status === 200) {
        showMessage("Success", "Updated Successfull", "success")
        navigate(`/course/${courseId}`);
      } else {
        showMessage("Error", "Updated Fail", "danger")
      }
    } catch (error) {
      showMessage("Error", "Updated Fail", "danger")
    }
  };

  const handleWordChange = (index, value) => {
    const newCards = [...listCard];
    newCards[index] = { ...newCards[index], key: value };
    setListCard(newCards);
  };

  const handleMeaningChange = (index, value) => {
    const newCards = [...listCard];
    newCards[index] = { ...newCards[index], value: value };
    setListCard(newCards);
  };

  return (
    <div>
      <Header />
      <Box mb={2} marginTop={2}>
        <Card elevation={3} sx={{ borderRadius: '12px', padding: '16px', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent style={{padding: 24}}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box style={{width: '80%'}}>
                <Typography variant="h2" gutterBottom>
                  Update Course
                </Typography>
                <Typography>Update course</Typography>
              </Box>
              <Button onClick={() => navigate(-1)} variant="contained">Back</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ borderRadius: '12px', padding: '16px', mt: 1, background: "#fff" }}>
        <Light title={"Information"} />
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Title"
          name="title"
          value={title}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="description"
          label="Description"
          type="description"
          id="description"
          value={description}
        />
        <Light title={"List Cards"} />
        {Array.from({ length: count }).map((_, i) => (
          <Grid container spacing={1} alignItems="stretch">
            <Grid item xs={0.5}>
              <Typography
                variant="h2"
                gutterBottom
              >{i + 1}</Typography>
            </Grid>
            <Grid item xs={5.5}>
              <TextField
                type="text"
                id={`quizzTitle${i + 1}`}
                value={listCard[i]?.key || ""}
                onChange={(e) => handleWordChange(i, e.target.value)}
                required
                fullWidth
                margin="normal"
                label="Word"
                name="word"
              />
            </Grid>
            <Grid item xs={5.5}>
              <TextField
                type="text"
                id={`quizzMeaning${i + 1}`}
                value={listCard[i]?.value || ""}
                onChange={(e) => handleMeaningChange(i, e.target.value)}
                margin="normal"
                fullWidth
                required
                label="Meaning"
                name="meaning"
              />
            </Grid>
            {count > 4 && (
              <Grid item xs={0.5}>
                <IconButton title="Delete Card" size="large">
                  <DeleteOutlineIcon fontSize="large" onClick={() => handleDeleteClick(i)}/>
                </IconButton>
              </Grid>
            )}
          </Grid>
        ))}
        <Grid container justifyContent="center" alignItems="center">
          <IconButton title="Add Card" size="large" onClick={handlePopupClick}>
            <AddCircleOutlineOutlinedIcon fontSize="large" />
          </IconButton>
        </Grid>
        <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
          <Grid item>
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, mr: 8 }}>
              Update
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default UpdateCourse;
