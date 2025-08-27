import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Container,
  Stack,
  InputAdornment,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { AuthApi } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';
import Swal from 'sweetalert2';
import toastr from 'toastr';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';
import UserTypeChoiceModal from '../../components/UserTypeChoiceModal';
import { useAuth } from "../../contexts/AuthContext";

// Types
interface LoginForm {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

// Constants
const TOASTR_CONFIG = {
  timeOut: 3000,
  progressBar: true,
  positionClass: "toast-bottom-right"
} as const;

const INITIAL_FORM: LoginForm = {
  email: '',
  password: ''
};

const INITIAL_ERRORS: LoginFormErrors = {};

// Custom hook for form validation
const useFormValidation = () => {
  const [errors, setErrors] = useState<LoginFormErrors>(INITIAL_ERRORS);

  const validateForm = (form: LoginForm): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!form.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (form.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => setErrors(INITIAL_ERRORS);

  return { errors, validateForm, clearErrors };
};

// Custom hook for login logic
const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleLogin = async (form: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const api = new AuthApi(ApiConfiguration);
      const result = await api.apiAuthLoginPost({ 
        loginInputDto: { 
          email: form.email, 
          password: form.password 
        } 
      });

      if (result.isSuccess && result.data?.tokens) {
        window.localStorage.setItem('accessToken', result.data.tokens.token!);
        window.localStorage.setItem('refreshToken', result.data.tokens.refreshToken!);
        setToken(result.data.tokens.token!);

        toastr.success('Login efetuado com sucesso', 'Sucesso!', TOASTR_CONFIG);

        if (!result.data.tokens.skipIntroduction) {
          navigate(isMobile ? '/welcome' : '/newAvatar');
        } else {
          navigate('/videos');
        }
      } else {
        const errorMessage = result.message || 'Erro ao fazer login';
        setError(errorMessage);
        toastr.error(errorMessage, 'Erro!', TOASTR_CONFIG);
      }
    } catch (error) {
      const errorMessage = 'Erro de conexão. Tente novamente.';
      setError(errorMessage);
      toastr.error(errorMessage, 'Erro!', TOASTR_CONFIG);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, handleLogin };
};

// Main component
const Login = () => {
  const [form, setForm] = useState<LoginForm>(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [userTypeChoiceOpen, setUserTypeChoiceOpen] = useState(false);

  const { errors, validateForm, clearErrors } = useFormValidation();
  const { isLoading, error, handleLogin } = useLogin();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleInputChange = (field: keyof LoginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      clearErrors();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm(form)) {
      await handleLogin(form);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement && window.location.pathname === '/') {
      rootElement.classList.add('image-with-opacity');
      return () => rootElement.classList.remove('image-with-opacity');
    }
  }, []);

  return (
    <>
      <ForgotPasswordModal 
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />

      <UserTypeChoiceModal 
        open={userTypeChoiceOpen}
        onClose={() => setUserTypeChoiceOpen(false)}
      />

      <Container 
        maxWidth="sm" 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 2, sm: 4 }
        }}
      >
      <Fade in timeout={800}>
        <Paper
          elevation={12}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: 450 },
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            background: 'linear-gradient(135deg, #3c140c 0%, #2c0e08 100%)',
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
          <Stack spacing={4} component="form" onSubmit={handleSubmit}>
            {/* Header */}
            <Box textAlign="center">
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                gutterBottom
                className="gradient-text"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: 'linear-gradient(45deg, #ff6b6b 30%, #d32f2f 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Bem-vindo!
              </Typography>
              <Typography 
                variant="h6" 
                color="rgba(255,255,255,0.8)"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Entre com a sua conta
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  backgroundColor: 'rgba(211, 47, 47, 0.15)',
                  color: 'white',
                  '& .MuiAlert-icon': { color: '#ff6b6b' }
                }}
              >
                {error}
              </Alert>
            )}

            {/* Form Fields */}
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={form.email}
                onChange={handleInputChange('email')}
                onKeyPress={handleKeyPress}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
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
                  '& .MuiFormHelperText-root': { color: '#ff6b6b' }
                }}
              />

              <TextField
                fullWidth
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleInputChange('password')}
                onKeyPress={handleKeyPress}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
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
                  '& .MuiFormHelperText-root': { color: '#ff6b6b' }
                }}
              />
            </Stack>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
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
                '&:disabled': { 
                  background: 'rgba(255,255,255,0.12)',
                  boxShadow: 'none'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Entrar'
              )}
            </Button>

            {/* Links */}
            <Stack spacing={2} alignItems="center">
              <Typography 
                variant="body2"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Não tem uma conta?{' '}
                <Button
                  variant="text"
                  onClick={() => setUserTypeChoiceOpen(true)}
                  sx={{ 
                    color: '#ff6b6b',
                    fontWeight: 600,
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto'
                  }}
                >
                  Registre-se
                </Button>
              </Typography>
              
              <Typography 
                variant="body2"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Esqueceu sua senha?{' '}
                <Link 
                  to="#" 
                  onClick={() => setForgotPasswordOpen(true)}
                  style={{ 
                    color: '#ff6b6b', 
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'color 0.3s'
                  }}
                >
                  Clique aqui!
                </Link>
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Fade>
    </Container>
    </>
  );
};

export default Login;
