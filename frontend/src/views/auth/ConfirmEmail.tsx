import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Stack,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  ArrowBack,
  Email,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthApi } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  useEffect(() => {
    const confirmEmail = async () => {
      if (!userId || !token) {
        setError("Parâmetros de confirmação inválidos");
        setIsLoading(false);
        return;
      }

      try {
        const authService = new AuthApi(ApiConfiguration);
        const result = await authService.apiAuthConfirmEmailGet({ userId: userId!, token: token! });
        
        if (result.isSuccess) {
          setIsConfirmed(true);
        } else {
          setError(result.message!);
        }
      } catch (error) {
        console.error('Error confirming email:', error);
        setError("Erro interno do servidor. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    confirmEmail();
  }, [userId, token]);

  React.useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement && window.location.pathname === '/confirm-email') {
      rootElement.classList.add('image-with-opacity-confirm-email');
      return () => rootElement.classList.remove('image-with-opacity-confirm-email');
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
            {isLoading ? (
              // Loading State
              <Stack spacing={4} alignItems="center" textAlign="center">
                <Box>
                  <Email 
                    sx={{ 
                      fontSize: { xs: '3rem', sm: '4rem' }, 
                      color: '#ff6b6b',
                      mb: 2 
                    }} 
                  />
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
                    Confirmando Email
                  </Typography>
                  <Typography
                    variant="body1"
                    color="rgba(255,255,255,0.8)"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, mb: 3 }}
                  >
                    Aguarde enquanto confirmamos seu email...
                  </Typography>
                </Box>

                <CircularProgress 
                  size={60} 
                  sx={{ 
                    color: '#ff6b6b',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    }
                  }} 
                />
              </Stack>
            ) : isConfirmed ? (
              // Success State
              <Stack spacing={4} alignItems="center" textAlign="center">
                <Box>
                  <CheckCircle 
                    sx={{ 
                      fontSize: { xs: '3rem', sm: '4rem' }, 
                      color: '#4caf50',
                      mb: 2 
                    }} 
                  />
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
                    Email Confirmado!
                  </Typography>
                  <Typography
                    variant="body1"
                    color="rgba(255,255,255,0.8)"
                    sx={{
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      mb: 2
                    }}
                  >
                    Seu email foi confirmado com sucesso! Agora você pode fazer login em sua conta.
                  </Typography>
                </Box>

                <Stack spacing={2} width="100%">
                  <Button
                    variant="contained"
                    onClick={() => navigate('/')}
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
                    Fazer Login
                  </Button>
                </Stack>
              </Stack>
            ) : (
              // Error State
              <Stack spacing={4} alignItems="center" textAlign="center">
                <Box>
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/')}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      textTransform: 'none',
                      alignSelf: 'flex-start',
                      mb: 2
                    }}
                  >
                    Voltar ao Login
                  </Button>
                  
                  <Error 
                    sx={{ 
                      fontSize: { xs: '3rem', sm: '4rem' }, 
                      color: '#f44336',
                      mb: 2 
                    }} 
                  />
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
                    Erro na Confirmação
                  </Typography>
                  <Typography
                    variant="body1"
                    color="rgba(255,255,255,0.8)"
                    sx={{
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      mb: 2
                    }}
                  >
                    {error}
                  </Typography>
                </Box>

                <Stack spacing={2} width="100%">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/register')}
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
                    Criar Nova Conta
                  </Button>
                  
                  <Button
                    variant="text"
                    onClick={() => navigate('/')}
                    size="large"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
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

export default ConfirmEmail;
