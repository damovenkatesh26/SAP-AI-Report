import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMsg('');

      if (username === process.env.REACT_APP_USERNAME && password === process.env.REACT_APP_PASSWORD) {
       localStorage.setItem('username', process.env.REACT_APP_USERNAME);
        navigate('/dashbord');
      } else {
        setErrorMsg('Login failed. Invalid credentials.');
      }

  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Card sx={{ width: 400, padding: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            Login
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              label="Username"
              type="text"
              fullWidth
              margin="normal"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {errorMsg && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errorMsg}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
