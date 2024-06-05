import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  IconButton,
  Avatar,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { showMessage } from "../../components/show_message/ShowMessage";
import ListFolders from "./ListFolder";
import ListCourses from "./ListCourse";
import axios from "axios";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Profile() {
  const [folders, setFolders] = useState([]);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState();
  const token = localStorage.getItem("token");
  const userIdmain = localStorage.getItem("userId");
  const avatar = localStorage.getItem("avatar");
  const { userId } = useParams();
  const isUser = userIdmain === userId
  const navigate = useNavigate();
  const [refetch, setRefetch] = useState(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (token && userId) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setFolders(response.data.folders);
          setCourses(response.data.courses);
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      fetchUser();
    } else {
      alert("No token found. Redirecting to login.");
      navigate("/login");
    }
  }, [token, userId, refetch]);

  return (
    <div>
      <Header />
      <Box mb={2} marginTop={2}>
        <Card elevation={1}>
          <CardContent style={{padding: 24}}>
            <Box display="flex" justifyContent="space-between">
              <Box style={{width: '80%'}}>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    alt="avatar"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 56, height: 56 }}
                  />
                  <Typography
                    variant="h2"
                    gutterBottom
                    style={{textOverflow: 'ellipsis', overflow: 'hidden'}}
                  >
                    {user?.username}
                  </Typography>
                </Stack>
              </Box>
              <Button onClick={() => navigate(-1)}>Back</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab {...a11yProps(0)} label="Folders" />
          <Tab {...a11yProps(1)} label="Courses" />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <ListFolders folders={folders}/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ListCourses courses={courses}/>
        </CustomTabPanel>
      </Box>
    </div>
  );
}

export default Profile;
