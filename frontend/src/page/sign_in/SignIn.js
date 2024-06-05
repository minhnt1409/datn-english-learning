import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to parse JWT:', error);
      return null;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email: data.get('email'),
        password: data.get('password'),
      });

      console.log('Login response:', response);

      const { token, userId, avatar } = response.data;

      if (!token || !userId) {
        throw new Error('Invalid login response: missing token or userId');
      }

      const decodedToken = jwtDecode(token);
      const { role } = decodedToken;

      // Store the token and userId in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
      localStorage.setItem('avatar', `http://localhost:8000/other/image/${avatar}`);

      // Parse and store the token payload
      const parsedToken = parseJwt(token);
      localStorage.setItem('userPayload', JSON.stringify(parsedToken));

      // Check if the token and userId are stored correctly
      const storedToken = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');
      const storedRole = localStorage.getItem('role');

      if (storedToken && storedUserId && storedRole) {
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alert('Failed to store user credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
    }
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#fff',
            padding: 2,
            borderRadius: 5
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}