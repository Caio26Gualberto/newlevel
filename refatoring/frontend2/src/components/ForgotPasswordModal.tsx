import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Close, Email } from '@mui/icons-material';
import { UserApi } from '../gen/api/src';
import ApiConfiguration from '../config/apiConfig';
import * as toastr from 'toastr';

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const userService = useMemo(() => new UserApi(ApiConfiguration), []);

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleSendEmail = async () => {
    if (!validateEmail(email)) return;

    setIsLoading(true);
    try {
      const result = await userService.apiUserGenerateTokenToResetPasswordByEmailPost({
        email: email.trim()
      });

      if (result.isSuccess) {
        toastr.success('Email enviado com sucesso! Verifique sua caixa de entrada.', 'Sucesso!', {
          timeOut: 5000,
          progressBar: true,
          positionClass: "toast-bottom-right"
        });
        handleClose();
      } else {
        toastr.error(result.message || 'Erro ao enviar email de recuperação', 'Erro!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: "toast-bottom-right"
        });
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toastr.error('Erro de conexão. Tente novamente.', 'Erro!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: "toast-bottom-right"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailError('');
    setIsLoading(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendEmail();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #3c140c 0%, #2c0e08 100%)',
          color: 'white',
          m: isMobile ? 1 : 2,
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
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          pt: 3
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          className="gradient-text"
          sx={{
            background: 'linear-gradient(45deg, #ff6b6b 30%, #d32f2f 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}
        >
          Recuperar Senha
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            color: 'rgba(255,255,255,0.7)',
            '&:hover': {
              color: '#ff6b6b',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Typography
          variant="body1"
          color="rgba(255,255,255,0.8)"
          sx={{
            mb: 3,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            lineHeight: 1.6
          }}
        >
          Digite seu email para receber as instruções de recuperação de senha.
        </Typography>

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          onKeyPress={handleKeyPress}
          error={!!emailError}
          helperText={emailError}
          disabled={isLoading}
          autoFocus
          InputProps={{
            startAdornment: (
              <Email sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
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
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            color: 'rgba(255,255,255,0.7)',
            '&:hover': {
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSendEmail}
          disabled={isLoading || !email.trim()}
          variant="contained"
          sx={{
            ml: 1,
            px: 3,
            py: 1,
            fontWeight: 600,
            background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
            boxShadow: '0 4px 15px rgba(211, 47, 47, 0.4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
              boxShadow: '0 6px 20px rgba(211, 47, 47, 0.6)',
              transform: 'translateY(-1px)'
            },
            '&:disabled': {
              background: 'rgba(255,255,255,0.12)',
              boxShadow: 'none'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              Enviando...
            </Box>
          ) : (
            'Enviar Email'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordModal;
