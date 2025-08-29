import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
import {
  VerifiedUser as VerifiedIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

interface VerificationRequestConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const VerificationRequestConfirmModal: React.FC<VerificationRequestConfirmModalProps> = ({ 
  open, 
  onConfirm, 
  onCancel 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          textAlign: 'center'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <VerifiedIcon sx={{ fontSize: 48 }} />
          <Typography variant="h5" fontWeight="bold">
            Verificação da Banda
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        <Fade in timeout={500}>
          <Box>
            <Typography 
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 500,
                color: theme.palette.text.primary
              }}
            >
              🎉 Parabéns! Sua banda foi registrada com sucesso!
            </Typography>
            
            <Typography 
              variant="body1"
              sx={{
                mb: 3,
                lineHeight: 1.6,
                color: theme.palette.text.secondary,
                fontSize: '1.1rem'
              }}
            >
              Deseja fazer um pedido de verificação da sua banda agora?
            </Typography>

            <Box 
              sx={{ 
                p: 3, 
                bgcolor: 'info.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'info.200',
                mb: 3
              }}
            >
              <Typography 
                variant="body2"
                sx={{
                  color: theme.palette.info.main,
                  fontStyle: 'italic'
                }}
              >
                💡 A verificação dá credibilidade à sua banda e destaque na plataforma!
              </Typography>
            </Box>
          </Box>
        </Fade>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 3, 
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <Button
          variant="outlined"
          onClick={onCancel}
          startIcon={<CancelIcon />}
          sx={{
            minWidth: { xs: '100%', sm: 150 },
            borderRadius: 2,
            borderColor: 'grey.400',
            color: 'grey.600',
            '&:hover': {
              borderColor: 'grey.600',
              bgcolor: 'grey.50'
            }
          }}
        >
          Agora Não
        </Button>
        
        <Button
          variant="contained"
          onClick={onConfirm}
          startIcon={<CheckIcon />}
          sx={{
            minWidth: { xs: '100%', sm: 150 },
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
          Sim, Verificar Agora!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerificationRequestConfirmModal;
