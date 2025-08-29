import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Container,
  Stack,
  InputAdornment,
  Fade,
  IconButton,
} from "@mui/material";
import {
  Lock,
  ArrowBack,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthApi } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authService = new AuthApi(ApiConfiguration);
    try {
      const response = await authService.apiAuthResetPasswordPost({
        resetPasswordRequestDto: {
          email: email || '',
          token: token || '',
          newPassword: password,
        }
      });
      if (response.isSuccess) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  React.useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement && window.location.pathname === '/security/resetPassword') {
      rootElement.classList.add('image-with-opacity-reset-password');
      return () => rootElement.classList.remove('image-with-opacity-reset-password');
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2c0e08 0%, #3c140c 100%)',
        backgroundImage: 'url("./assets/Slayer4.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 2, sm: 4 }
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={12}
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', sm: 450 },
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(60, 20, 12, 0.95) 0%, rgba(44, 14, 8, 0.95) 100%)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #d32f2f 0%, #ff6b6b 100%)',
              }
            }}
          >
            {!isSubmitted ? (
              <Stack spacing={4} component="form" onSubmit={handleSubmit}>
                {/* Back Button */}
                <Box>
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/')}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      textTransform: 'none'
                    }}
                  >
                    Voltar ao Login
                  </Button>
                </Box>

                {/* Header */}
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                      background: 'linear-gradient(45deg, #ff6b6b 30%, #d32f2f 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Recuperar Senha
                  </Typography>
                  <Typography
                    variant="body1"
                    color="rgba(255,255,255,0.8)"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    Digite sua nova senha
                  </Typography>
                </Box>

                {/* Password Field */}
                <TextField
                  fullWidth
                  label="Nova senha"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "rgba(255,255,255,0.7)" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "rgba(255,255,255,0.7)" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      "& fieldset": {
                        borderColor: "rgba(255,255,255,0.3)",
                        borderWidth: 2,
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b6b",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255,255,255,0.7)",
                      "&.Mui-focused": { color: "#ff6b6b" },
                    },
                  }}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
                    boxShadow: '0 4px 20px rgba(211, 47, 47, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
                      boxShadow: '0 6px 25px rgba(211, 47, 47, 0.6)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Alterar Senha
                </Button>
              </Stack>
            ) : (
              // Success State
              <Stack spacing={2} alignItems="center" textAlign="center">
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '1.75rem', sm: '2rem' },
                      background: 'linear-gradient(45deg, #ff6b6b 30%, #d32f2f 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Senha alterada!
                  </Typography>
                  <Typography
                    variant="body1"
                    color="rgba(255,255,255,0.8)"
                    sx={{
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      mb: 2
                    }}
                  >
                    Sua senha foi alterada com sucesso!
                  </Typography>
                </Box>

                <Stack spacing={2} width="100%">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    size="large"
                    sx={{
                      borderColor: '#ff6b6b',
                      color: '#ff6b6b',
                      '&:hover': {
                        borderColor: '#d32f2f',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)'
                      }
                    }}
                  >
                    Voltar ao Login
                  </Button>
                </Stack>
              </Stack>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ResetPassword;
