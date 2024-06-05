import React, { useEffect, useState } from "react";
import {Typography, Grid} from '@mui/material';
import CardFolder from "../../components/card_folder/CardFolder";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { showMessage } from "../../components/show_message/ShowMessage";

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
  const [popupEdit, setPopupEdit] = useState(false);
  const [popupAddCourse, setPopupAddCourse] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [newFolderTitle, setNewFolderTitle] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");

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

  const handleDelete = async (courseId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/folders/delete-course/${folderId}/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        showMessage("Error", "Deleted Failed", "danger");
      } else {
        showMessage("Success", "Delete Folder Successfully", "success")
        setRefetch(!refetch);
      }
    } catch (error) {
      showMessage("Error", "Deleted Failed", "danger");
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/folders/${folderId}`,
        { title: newFolderTitle, description: newFolderDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        showMessage("Error", "Updated Failed", "danger");
      } else {
        setNewFolderTitle("");
        setNewFolderDescription("");
        showMessage("Success", "Updated Folder Successfully", "success")
        setRefetch(!refetch);
      }
      setPopupEdit(false)
    } catch (error) {
      showMessage("Error", "Updated Failed", "danger");
    }
  };

  const fetchUserCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/courses/my/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userCourses = response.data

      const available = userCourses.filter(course => 
        !courses.some(folderCourse => folderCourse._id === course._id)
      );

      setAvailableCourses(available);
      setPopupAddCourse(true);
    } catch (error) {
      showMessage("Error", "Failed to fetch courses", "danger");
    }
  };

  const handleCourseSelection = (courseId) => {
    setSelectedCourses(prevSelected =>
      prevSelected.includes(courseId)
        ? prevSelected.filter(id => id !== courseId)
        : [...prevSelected, courseId]
    );
  };

  const handleAddCoursesToFolder = async () => {
    try {
      for (const courseId of selectedCourses) {
        await handleAddCourse(courseId);
      }
      setPopupAddCourse(false);
      setRefetch(!refetch);
      setSelectedCourses([]);
    } catch (error) {
      showMessage("Error", "Failed to add courses", "danger");
    }
  };

  const handleAddCourse = async (courseId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/folders/add-course/${folderId}/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
          },
        }
      );
      if (response.status !== 200) {
        showMessage("Error", "Adding Course Failed", "danger");
      } else {
        showMessage("Success", "Course Added Successfully", "success");
      }
    } catch (error) {
      showMessage("Error", "Adding Course Failed", "danger");
    }
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="cfirst">
        <div className="cfirst__heading">
          <div className="cfirst__title">

            <h1>Folder: {title}</h1>
          </div>
          <svg
            className="cfirst__back"
            onClick={() => navigate(-1)}
            xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12t.063-.375t.212-.325l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12t-.288.713T19 13z" /></svg>

        </div>
        <div className="cfirst__filter">
          <h2>{description}</h2>
        </div>
      </div>

      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5">Courses</Typography>
        </Grid>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardFolder
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
