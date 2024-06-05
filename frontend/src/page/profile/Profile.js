import React from "react";
import { useQuery } from 'react-query';
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
import rootApi from '../../api/rootApi';
import path from '../../api/Api';

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
  const isUser = userIdmain === userId;
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { data, refetch } = useQuery(['profile', userId], () => {
    return rootApi.get(path.user.getUser({ userId }));
  });

  return (
    <div>
      <Header />
      <Box mb={2} mt={2}>
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ padding: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box sx={{ width: '80%' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    alt="avatar"
                    src={`http://localhost:8000/other/image/${data?.data?.avatar}`}
                    sx={{ width: 150, height: 150, border: '2px solid #3f51b5' }}
                  />
                  <Typography
                    variant="h4"
                    sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    {data?.data?.username}
                  </Typography>
                </Stack>
              </Box>
              <Button variant="contained" onClick={() => navigate(-1)}>
                Back
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab {...a11yProps(0)} label="Folders" />
          <Tab {...a11yProps(1)} label="Courses" />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <ListFolders folders={data?.data?.folders} refetch={refetch} isUser={isUser} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ListCourses courses={data?.data?.courses} refetch={refetch} isUser={isUser} />
        </CustomTabPanel>
        <br />
        <br />
      </Box>
    </div>
  );
}

export default Profile;
