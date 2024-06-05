import React from "react";
import {Grid, IconButton} from '@mui/material';
import CardCourse from "../../components/card_course/CardCourse";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from "react-router-dom";
import Light from "../../components/Light";

function ListCourse({courses, refetch, isUser}) {
  const navigate = useNavigate();

  return (
    <>
      <Light
        title={"My Folders"}
        icon={isUser ? (
          <IconButton title="Add Course" onClick={() => navigate('/create_course')}>
            <AddCircleOutlineOutlinedIcon />
          </IconButton>
        ) : (<></>)}
      />
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
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
