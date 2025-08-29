import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  useTheme,
  useMediaQuery,
  Fade,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  VerifiedUser as VerifiedIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  Send as SendIcon
} from '@mui/icons-material';

interface BandVerificationRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VerificationRequestData) => void;
}

export interface VerificationRequestData {
  bandName: string;
  responsibleName: string;
  email: string;
  phone: string;
  message?: string;
}

const BandVerificationRequestModal: React.FC<BandVerificationRequestModalProps> = ({ 
  open, 
  onClose, 
  onSubmit 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState<VerificationRequestData>({
    bandName: '',
    responsibleName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: keyof VerificationRequestData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    
    // Format phone number
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 11 digits (2 for area code + 9 for number)
    const limitedDigits = digits.slice(0, 11);
    
    // Format as (XX) - XXXXX-XXXX
    if (limitedDigits.length <= 2) {
      return limitedDigits;
    } else if (limitedDigits.length <= 7) {
      return `(${limitedDigits.slice(0, 2)}) - ${limitedDigits.slice(2)}`;
    } else {
      return `(${limitedDigits.slice(0, 2)}) - ${limitedDigits.slice(2, 7)}-${limitedDigits.slice(7)}`;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.bandName.trim()) {
      newErrors.bandName = 'Nome da banda é obrigatório';
    }

    if (!formData.responsibleName.trim()) {
      newErrors.responsibleName = 'Nome do responsável é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Celular é obrigatório';
    } else if (!/^\(\d{2}\) - \d{5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Formato inválido. Use: (XX) - XXXXX-XXXX';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("submit", formData);
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      bandName: '',
      responsibleName: '',
      email: '',
      phone: '',
      message: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          maxHeight: isMobile ? '100vh' : '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <VerifiedIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Pedido de Verificação
          </Typography>
        </Box>
        
        <IconButton
          onClick={handleClose}
          sx={{ 
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Fade in timeout={300}>
          <Box>
            <Typography 
              variant="body1"
              sx={{
                mb: 3,
                color: theme.palette.text.secondary,
                textAlign: 'center'
              }}
            >
              Preencha as informações abaixo para solicitar a verificação da sua banda
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Nome da Banda"
                value={formData.bandName}
                onChange={handleInputChange('bandName')}
                error={!!errors.bandName}
                helperText={errors.bandName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <TextField
                fullWidth
                label="Nome do Responsável"
                value={formData.responsibleName}
                onChange={handleInputChange('responsibleName')}
                error={!!errors.responsibleName}
                helperText={errors.responsibleName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <TextField
                fullWidth
                label="Celular"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone || 'Formato: (XX) XXXXX-XXXX'}
                placeholder="(11) 99999-9999"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <TextField
                fullWidth
                label="Mensagem (Opcional)"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleInputChange('message')}
                placeholder="Conte um pouco mais sobre sua banda, conquistas, etc..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <MessageIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </Box>
        </Fade>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 3, 
          bgcolor: 'grey.50',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            minWidth: { xs: '100%', sm: 150 },
            borderRadius: 2
          }}
        >
          Cancelar
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSubmit}
          startIcon={<SendIcon />}
          sx={{
            minWidth: { xs: '100%', sm: 200 },
            borderRadius: 2,
            background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%)',
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[8]
            },
            transition: 'all 0.3s ease'
          }}
        >
          Enviar Pedido
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BandVerificationRequestModal;
