import { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Google, Apple, Facebook } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gap: { xs: 0, md: 4 },
            flexDirection: { xs: 'column', md: 'row' },
            maxWidth: 1200,
            mx: 'auto',
          }}
        >
          {/* Left Side - Login Form */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 2, sm: 4 },
              maxWidth: { xs: '100%', md: '50%' },
            }}
          >
            <Box sx={{ mb: 4, textAlign: 'left' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Welcome back!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Simplify your workflow and boost your productivity
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  Forgot Password?
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  textTransform: 'none',
                  backgroundColor: '#000',
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                }}
              >
                Login
              </Button>

              <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                <Typography color="text.secondary">or continue with</Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <IconButton sx={{ bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#333' } }}>
                  <Google />
                </IconButton>
                <IconButton sx={{ bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#333' } }}>
                  <Apple />
                </IconButton>
                <IconButton sx={{ bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#333' } }}>
                  <Facebook />
                </IconButton>
              </Box>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Not a member? {' '}
                  <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Register now
                  </Typography>
                </Typography>
              </Box>

              {/* Demo Credentials Box */}
              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: 'rgba(0,0,0,0.02)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '12px',
                }}
              >
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
                  Demo Credentials
                </Typography>
                <Typography variant="body2" color="primary" align="center">
                  Admin: admin@example.com / admin123
                </Typography>
                <Typography variant="body2" color="primary" align="center">
                  User: user@example.com / user123
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Right Side - Illustration */}
          <Box
            sx={{
              flex: 1,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f8f9fa',
              borderRadius: '24px',
              p: 4,
            }}
          >
            <Box sx={{ maxWidth: '100%', height: 'auto' }}>
              <img
                src="/illustration.svg"
                alt="Login Illustration"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '500px',
                }}
              />
              <Typography
                variant="h4"
                align="center"
                sx={{
                  mt: 4,
                  fontWeight: 700,
                  color: '#000',
                }}
              >
                Make your work easier and organized
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                with Tuga's App
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}; 