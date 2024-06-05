import React from "react";
import {Grid, IconButton} from '@mui/material';
import CardCourse from "../../components/card_course/CardCourse";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from "react-router-dom";

function ListCourse({courses, refetch, isUser}) {
  const navigate = useNavigate();

  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {isUser && (
          <Grid item xs={12} sx={{ mb: -2.25 }}>
            <IconButton title="Add Course" size="large" onClick={() => navigate('/create_course')}>
              <AddCircleOutlineOutlinedIcon fontSize="large" />
            </IconButton>
          </Grid>
        )}
        {courses?.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardCourse
              course={course}
              refetch={refetch}
              enableAction={isUser}
              action={() => navigate(`/course/${course._id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ListCourse;
