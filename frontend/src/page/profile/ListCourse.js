import React, { useEffect, useState } from "react";
import {Typography, Grid, Button, IconButton} from '@mui/material';
import CardCourse from "../../components/card_course/CardCourse";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import path from '../../api/Api'

function ListCourse({courses}) {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [selectCourse, setSelectCourse] = useState();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('');

  const handleOpen = () => setOpen(true);

  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <IconButton title="Add Course" size="large" onClick={() => navigate('/create_course')}>
            <AddCircleOutlineOutlinedIcon fontSize="large" />
          </IconButton>
        </Grid>
        {courses?.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardCourse
              title={course.title}
              count={course?.cards.length}
              description={course.description}
              action={() => navigate(`/course/${course._id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ListCourse;
