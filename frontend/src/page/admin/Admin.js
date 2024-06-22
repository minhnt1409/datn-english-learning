import React, { useEffect, useState } from "react";
import axios from "axios";
import {useQuery} from 'react-query'
import PropTypes from 'prop-types';
import {
  Typography,
  SvgIcon,
  AppBar,
  Toolbar,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../components/show_message/ShowMessage";
import { ReactComponent as Logo } from '../../assets/svg/logo.svg';
import ConfirmModal from "../../components/confirm/ConfirmModal";
import ListFolders from "./ListFolder";
import ListUsers from "./ListUser";
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

const Admin = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const avatar = localStorage.getItem("avatar");
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const openModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmAction = () => {
    const { action, id, title } = modalContent;
    action(id, title);
    closeModal();
  };

  const handleDeleteUser = async (userId, username) => {
    openModal({
      message: `Are you sure you want to delete user ${username}?`,
      action: deleteUser,
      id: userId,
      title: username,
    });
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(path.user.delete({userId}), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status !== 200) {
        showMessage("Error", "Deleted Failed", "danger");
      } else {
        refetchUser()
        showMessage("Success", "Deleted Successfully", "success");
      }
    } catch {
      showMessage("Error", "Deleted Failed", "danger");
    }
  };

  const handleDeleteFolder = async (folderId, title) => {
    openModal({
      message: `Are you sure you want to delete folder ${title}?`,
      action: deleteFolder,
      id: folderId,
      title,
    });
  };

  const deleteFolder = async (folderId) => {
    try {
      const response = await axios.delete(path.folder.delete({folderId}), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status !== 200) {
        showMessage("Error", "Deleted Failed", "danger");
      } else {
        refetchFolder();
        showMessage("Success", "Deleted Successfully", "success");
      }
    } catch {
      showMessage("Error", "Deleted Failed", "danger");
    }
  };

  const handleDeleteCourse = async (courseId, title) => {
    openModal({
      message: `Are you sure you want to delete course ${title}?`,
      action: deleteCourse,
      id: courseId,
      title,
    });
  };

  const deleteCourse = async (courseId) => {
    try {
      const response = await axios.delete(path.course.delete({courseId}), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status !== 200) {
        showMessage("Error", "Deleted Failed", "danger");
      } else {
        refetchCourse();
        showMessage("Success", "Deleted Successfully", "success");
      }
    } catch {
      showMessage("Error", "Deleted Failed", "danger");
    }
  };

  useEffect(() => {
    if (!token || !userId) {
      showMessage("Error", "No token or userId found. Redirecting to login.", "danger");
      navigate("/sign_in");
      return;
    } else {
      if (role !== "admin") {
        showMessage("Warning", "You do not have permission to access the admin page, please log in with your admin account", "warning");
        navigate("/");
      }
    }
  });

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        path.auth.logOut(),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        showMessage("Success", "Logout Successfully", "success");
        navigate("/sign_in");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
      } else {
        showMessage("Error", "Logout Fail", "danger");
      }
    } catch (error) {
      showMessage("Error", "Logout Fail", "danger");
    }
  };

  const {data: dataUser, refetch: refetchUser} = useQuery(
    'user-list', () => rootApi.get(path.user.getAll())
  )
  const {data: dataFolder, refetch: refetchFolder} = useQuery(
    'folder-list', () => rootApi.get(path.folder.getAll())
  )
  const {data: dataCourse, refetch: refetchCourse} = useQuery(
    'course-list', () => rootApi.get(path.course.getAll())
  )

  return (
    <div className="admin">
      <AppBar
        position="static"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: '999px',
              bgcolor: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(24px)',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`,
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 0,
              }}
            >
              <SvgIcon
                component={Logo}
                style={{ fontSize: 40, margin: 10 }}
                viewBox="0 0 80 80"
                color="inherit"
                onClick={() => navigate('/')}
              />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Learning English
              </Typography>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="avatar" src={avatar} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* <MenuItem onClick={() => navigate(`/profile/${userId}`)}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem> */}
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
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
          <Tab {...a11yProps(0)} label="Users" />
          <Tab {...a11yProps(1)} label="Folders" />
          <Tab {...a11yProps(2)} label="Courses" />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <ListUsers users={dataUser?.data} handleDeleteUser={handleDeleteUser} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ListFolders folders={dataFolder?.data} handleDeleteFolder={handleDeleteFolder}/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
        <ListCourses courses={dataCourse?.data} handleDeleteCourse={handleDeleteCourse} />
        </CustomTabPanel>
        <br />
        <br />
      </Box>

      <ConfirmModal
        show={showModal}
        onClose={closeModal}
        onConfirm={confirmAction}
        message={modalContent.message}
      />
    </div>
  );
};

export default Admin;