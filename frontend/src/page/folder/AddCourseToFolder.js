import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import rootApi from '../../api/rootApi';
import path from '../../api/Api';
import { showMessage } from "../../components/show_message/ShowMessage";

function AddCoursePopup({ open, setOpen, folderCourses, refetchFolder, folderId }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [selectedCourses, setSelectedCourses] = useState([]);
  
  const { data: availableCourses, refetch: refetchAvailableCourses } = useQuery(['get-user-courses', userId], () => {
    return rootApi.get(path.user.getUser({ userId }));
  });

  useEffect(() => {
    if (open) {
      refetchAvailableCourses();
    }
  }, [open, refetchAvailableCourses]);

  const handleCourseSelection = (courseId) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.includes(courseId)
        ? prevSelected.filter((id) => id !== courseId)
        : [...prevSelected, courseId]
    );
  };

  const handleAddCoursesToFolder = async () => {
    try {
      for (const courseId of selectedCourses) {
        await rootApi.put(path.folder.addCourse({ folderId, courseId }));
      }
      showMessage("Success", "Add course Successfully", "success");
      refetchFolder();
      setSelectedCourses([]);
      setOpen(false);
    } catch (error) {
      showMessage("Error", "Failed to add courses", "danger");
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Select Courses to Add</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column">
          {availableCourses?.data?.courses?.filter(course => !folderCourses.includes(course._id)).map(course => (
            <FormControlLabel
              key={course._id}
              control={
                <Checkbox
                  checked={selectedCourses.includes(course._id)}
                  onChange={() => handleCourseSelection(course._id)}
                />
              }
              label={course.title}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddCoursesToFolder} variant="contained" color="primary">
          Add Selected Courses
        </Button>
        <Button onClick={() => navigate(`/folder/${folderId}/create_course`)} variant="contained" color="secondary">
          Create New Course
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddCoursePopup;
