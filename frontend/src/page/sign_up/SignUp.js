import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import path from '../../api/Api';

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = React.useState(null); // State để lưu trữ avatar xem trước

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result); // Cập nhật avatar xem trước
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const formData = new FormData();
    formData.append('email', data.get('email'));
    formData.append('username', data.get('username'));
    formData.append('password', data.get('password'));
    formData.append('avatar', data.get('avatar'));

    try {
      const response = await axios.post(path.auth.signUp(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Signup successful:', response.data);
      navigate('/sign_in');
    } catch (error) {
      console.error('Error during signup:', error.response.data);
      alert(`Signup failed: ${error.response.data.message}`);
    }
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar"
                  name="avatar"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar">
                  <Button
                    component="span"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    style={{marginTop: !!avatarPreview ? 30 : 0}}
                  >
                    Choose Avatar
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12} sm={4}>
                {avatarPreview && (
                  <Avatar
                    src={avatarPreview}
                    alt="Avatar Preview"
                    sx={{ width: 100, height: 100 }}
                  />
                )}
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirm-password"
                  label="Confirm Password"
                  type="confirm-password"
                  id="confirm-password"
                  autoComplete="new-confirm-password"
                />
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/sign_in" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}