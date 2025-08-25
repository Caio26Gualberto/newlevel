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
} from "@mui/material";
import { 
  Email, 
  ArrowBack 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    setIsSubmitted(true);
  };

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
                    Digite seu email para receber as instruções de recuperação
                  </Typography>
                </Box>

                {/* Email Field */}
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      '& fieldset': { 
                        borderColor: 'rgba(255,255,255,0.3)',
                        borderWidth: 2
                      },
                      '&:hover fieldset': { 
                        borderColor: 'rgba(255,255,255,0.5)' 
                      },
                      '&.Mui-focused fieldset': { 
                        borderColor: '#ff6b6b',
                        borderWidth: 2
                      }
                    },
                    '& .MuiInputLabel-root': { 
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-focused': { color: '#ff6b6b' }
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
                  Enviar Instruções
                </Button>
              </Stack>
            ) : (
              // Success State
              <Stack spacing={4} alignItems="center" textAlign="center">
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
                    Email Enviado!
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="rgba(255,255,255,0.8)"
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      mb: 2
                    }}
                  >
                    Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="rgba(255,255,255,0.6)"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Não recebeu o email? Verifique sua pasta de spam.
                  </Typography>
                </Box>

                <Stack spacing={2} width="100%">
                  <Button
                    variant="contained"
                    onClick={() => setIsSubmitted(false)}
                    size="large"
                    sx={{
                      background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
                      '&:hover': { 
                        background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
                      }
                    }}
                  >
                    Reenviar Email
                  </Button>
                  
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
