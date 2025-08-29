import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface UserTypeChoiceModalProps {
  open: boolean;
  onClose: () => void;
}

const UserTypeChoiceModal: React.FC<UserTypeChoiceModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [selected, setSelected] = useState<string>('');

  const handleChange = (checkboxName: string) => {
    setSelected(checkboxName);
  };

  const goNext = () => {
    if (selected === 'Banda/Artista') {
      onClose();
      navigate('/bandRegister');
    } else if (selected === 'Usuário') {
      onClose();
      navigate('/register');
    }
  };

  useEffect(() => {
    if (open) {
      setSelected('');
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          backgroundColor: '#1a1a1a',
          color: 'white',
          borderRadius: isMobile ? 0 : 2,
          minHeight: isMobile ? '100vh' : 'auto',
        }
      }}
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2a2a2a',
          color: 'white',
          p: 2
        }}
      >
        <Typography variant="h6" component="div">
          Banda ou Usuário?
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ backgroundColor: '#444' }} />

      <DialogContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }}
        >
          <Typography 
            variant="h6"
            sx={{
              textAlign: 'center',
              fontSize: {
                xs: '1rem',
                sm: '1.25rem'
              }
            }}
          >
            Escolha entre os tipos Banda/Artista ou Usuário
          </Typography>

          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: {
                xs: 'column',
                sm: 'row'
              },
              gap: 2,
              justifyContent: 'center'
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected === 'Banda/Artista'}
                  onChange={() => handleChange('Banda/Artista')}
                  sx={{
                    color: '#d32f2f',
                    '&.Mui-checked': {
                      color: '#d32f2f'
                    }
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: {
                      xs: '0.875rem',
                      sm: '1rem'
                    }
                  }}
                >
                  Banda/Artista
                </Typography>
              }
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected === 'Usuário'}
                  onChange={() => handleChange('Usuário')}
                  sx={{
                    color: '#d32f2f',
                    '&.Mui-checked': {
                      color: '#d32f2f'
                    }
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: {
                      xs: '0.875rem',
                      sm: '1rem'
                    }
                  }}
                >
                  Usuário
                </Typography>
              }
            />
          </Box>

          {selected === 'Banda/Artista' && (
            <Fade in timeout={300}>
              <Box>
                <Typography 
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    fontSize: {
                      xs: '0.75rem',
                      sm: '0.875rem'
                    },
                    lineHeight: 1.6,
                    mb: 2,
                    color: '#ccc'
                  }}
                >
                  Para o processo de criação de um usuário do tipo "banda", será implementado um sistema de verificação adicional. A banda precisará entrar em contato com o administrador da página para a confirmação de identidade. Esse processo garante a segurança dos usuários e das próprias bandas, evitando que pessoas não autorizadas criem contas em nome de uma banda, o que poderia levar a atividades fraudulentas ou prejudicar a reputação da banda.
                </Typography>
                
                <Typography 
                  variant="caption"
                  sx={{
                    textAlign: 'center',
                    fontSize: {
                      xs: '0.625rem',
                      sm: '0.75rem'
                    },
                    color: '#ff6b6b',
                    fontStyle: 'italic'
                  }}
                >
                  Não se preocupe, ao final do registro terá uma etapa de pedido de verificação
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>
      </DialogContent>

      {selected && (
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={goNext}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#d32f2f',
              color: 'white',
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            Continuar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default UserTypeChoiceModal;
