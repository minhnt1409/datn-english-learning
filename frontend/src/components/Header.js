import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SvgIcon from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import axios from 'axios';
import { showMessage } from '../components/show_message/ShowMessage';
import path from '../api/Api';
import { ReactComponent as Logo } from '../assets/svg/logo.svg';
import Light from './Light';

function AppAppBar() {
  const token = localStorage.getItem('token');
  const avatar = localStorage.getItem('avatar');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
        showMessage('Success', 'Logout Successfully', 'success');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('avatar');
        navigate('/sign_in');
      } else {
        showMessage('Error', 'Logout Fail', 'danger');
      }
    } catch (error) {
      showMessage('Error', 'Logout Fail', 'danger');
    }
    setAnchorElUser(null);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    folders: [],
    courses: [],
    users: [],
  });

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      try {
        const response = await axios.get(path.utils.search({query}), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults({ folders: [], courses: [], users: [] });
    }
  };

  return (
    <div>
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
              <Box sx={{ flexGrow: 1 }}>
                <input
                  type="text"
                  placeholder="Search for folders, courses, users"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{
                    width: '50%',
                    marginLeft: '15%',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  }}
                />
                {searchQuery && (
                  <Card
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '51%',
                      border: '1px solid #ddd',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                      transform: 'translateX(-50%)',
                      maxWidth: '500px',
                      width: '100%',
                      zIndex: '1000',
                    }}
                  >
                    <CardContent>
                      {searchResults.folders.length > 0 && (
                        <div>
                          <Light title={`Folders (${searchResults.folders.length})`} />
                          <ul>
                            {searchResults.folders.map((folder) => (
                              <li
                                key={folder._id}
                                onClick={() => navigate(`/folder/${folder._id}`)}
                              >
                                {folder.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {searchResults.courses.length > 0 && (
                        <div>
                          <Light title={`Courses (${searchResults.courses.length})`} />
                          <ul>
                            {searchResults.courses.map((course) => (
                              <li
                                key={course._id}
                                onClick={() => navigate(`/course/${course._id}`)}
                              >
                                {course.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {searchResults.users.length > 0 && (
                        <div>
                          <Light title={`Users (${searchResults.users.length})`} />
                          <ul>
                            {searchResults.users.map((user) => (
                              <li
                                key={user._id}
                                onClick={() => navigate(`/profile/${user._id}`)}
                              >
                                {user.username}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {searchResults.folders.length === 0 &&
                        searchResults.courses.length === 0 &&
                        searchResults.users.length === 0 && (
                          <div>No results found.</div>
                        )}
                    </CardContent>
                  </Card>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              {!!token ? (
                <>
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
                    <MenuItem onClick={() => navigate(`/profile/${userId}`)}>
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="primary"
                    variant="text"
                    size="small"
                    component="a"
                    href="/sign_in/"
                    target="_blank"
                  >
                    Sign in
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    component="a"
                    href="/sign-up/"
                    target="_blank"
                  >
                    Sign up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default AppAppBar;
