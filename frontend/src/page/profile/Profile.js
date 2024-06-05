import React, { useEffect, useState } from "react";
import {useQuery, useMutation} from 'react-query'
import PropTypes from 'prop-types';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Avatar,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import ListFolders from "./ListFolder";
import ListCourses from "./ListCourse";
import rootApi from '../../api/rootApi'
import path from '../../api/Api'

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
  const userIdmain = localStorage.getItem("userId");
  const avatar = localStorage.getItem("avatar");
  const { userId } = useParams();
  const isUser = userIdmain === userId
  const navigate = useNavigate();
  // const [refetch, setRefetch] = useState(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const {data, refetch} = useQuery(['profile', userId], () => {
    return rootApi.get(path.user.getUser({userId}))
  })

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
                    {data?.data?.username}
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
          <ListFolders folders={data?.data?.folders} refetch={refetch}/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ListCourses courses={data?.data?.courses} refetch={refetch}/>
        </CustomTabPanel>
      </Box>
    </div>
  );
}

export default Profile;
