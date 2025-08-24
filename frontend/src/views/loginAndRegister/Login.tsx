import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthenticateApi } from "../../gen/api/src";
import { useEffect, useState } from "react";
import ApiConfiguration from "../../apiConfig";
import { Link, useNavigate } from "react-router-dom";
import * as toastr from 'toastr';
import ModalPassword from "./modalResetPassword/ModalPassword";
import { useAuth } from "../../AuthContext";
import ChoiceTypeUserModal from "./choiceTypeUserModal/ChoiceTypeUserModal";

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

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email inválido';
    }

    // Password validation
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
      const api = new AuthenticateApi(ApiConfiguration);
      const result = await api.apiAuthenticateLoginPost({ 
        loginInputDto: { 
          email: form.email, 
          password: form.password 
        } 
      });

      if (result.isSuccess && result.data?.tokens) {
        // Store tokens
        window.localStorage.setItem('accessToken', result.data.tokens.token!);
        window.localStorage.setItem('refreshToken', result.data.tokens.refreshToken!);
        setToken(result.data.tokens.token!);

        // Show success message
        toastr.success('Login efetuado com sucesso', 'Sucesso!', TOASTR_CONFIG);

        // Navigate based on user state
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
  const [openModal, setOpenModal] = useState(false);
  const [openChoiceModal, setOpenChoiceModal] = useState(false);

  const { errors, validateForm, clearErrors } = useFormValidation();
  const { isLoading, error, handleLogin } = useLogin();

  // Form handlers
  const handleInputChange = (field: keyof LoginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
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

  // Modal handlers
  const togglePasswordModal = () => setOpenModal(prev => !prev);
  const toggleChoiceModal = () => setOpenChoiceModal(prev => !prev);

  // Background effect
  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement && window.location.pathname === '/') {
      rootElement.classList.add('image-with-opacity');
      return () => rootElement.classList.remove('image-with-opacity');
    }
  }, []);

  return (
    <>
      <ChoiceTypeUserModal open={openChoiceModal} onClose={toggleChoiceModal} />
      <ModalPassword open={openModal} onClose={togglePasswordModal} />
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: {
            xs: 2,
            sm: 3,
            md: 4
          }
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: {
              xs: '100%',
              sm: '400px',
              md: '450px'
            },
            maxWidth: '90vw',
            p: {
              xs: 3,
              sm: 4,
              md: 5
            },
            borderRadius: 2,
            backgroundColor: '#3c140c',
            color: 'white'
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                gutterBottom
                sx={{
                  fontSize: {
                    xs: '1.75rem',
                    sm: '2rem',
                    md: '2.125rem'
                  }
                }}
              >
                Bem-vindo!
              </Typography>
              <Typography 
                variant="body1" 
                color="rgba(255,255,255,0.8)"
                sx={{
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem'
                  }
                }}
              >
                Entre com a sua conta
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(211, 47, 47, 0.1)' }}>
                {error}
              </Alert>
            )}

            {/* Form Fields */}
            <Box sx={{ mb: 3 }}>
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
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
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
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiFormHelperText-root': { color: '#ff6b6b' }
                }}
              />
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mb: 3,
                py: {
                  xs: 1.5,
                  sm: 1.75,
                  md: 2
                },
                fontSize: {
                  xs: '0.875rem',
                  sm: '1rem'
                },
                backgroundColor: '#d32f2f',
                '&:hover': { backgroundColor: '#b71c1c' },
                '&:disabled': { backgroundColor: 'rgba(255,255,255,0.12)' }
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Entrar'
              )}
            </Button>

            {/* Links */}
            <Box textAlign="center" sx={{ '& > *': { mb: 1 } }}>
              <Typography 
                variant="body2"
                sx={{
                  fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem'
                  }
                }}
              >
                Não tem uma conta?{' '}
                <Link 
                  to="#" 
                  onClick={toggleChoiceModal}
                  style={{ 
                    color: '#ff6b6b', 
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Registre-se
                </Link>
              </Typography>
              
              <Typography 
                variant="body2"
                sx={{
                  fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem'
                  }
                }}
              >
                Esqueceu sua senha?{' '}
                <Link 
                  to="#" 
                  onClick={togglePasswordModal}
                  style={{ 
                    color: '#ff6b6b', 
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Clique aqui!
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
