import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
import {
  Close as CloseIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { NotificationDto } from '../../gen/api/src';

interface SimpleNotificationModalProps {
  open: boolean;
  notification: NotificationDto | undefined;
  onClose: () => void;
}

const SimpleNotificationModal: React.FC<SimpleNotificationModalProps> = ({ 
  open, 
  notification, 
  onClose 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          maxHeight: isMobile ? '100vh' : '80vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon />
          <Typography variant="h6" fontWeight="bold">
            {notification?.title || 'Notificação'}
          </Typography>
        </Box>
        
        <IconButton
          onClick={onClose}
          sx={{ 
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Fade in timeout={300}>
          <Box>
            <Typography 
              variant="body1"
              sx={{
                fontSize: {
                  xs: "0.875rem",
                  sm: "1rem"
                },
                lineHeight: 1.6,
                color: theme.palette.text.primary,
                mb: 2
              }}
            >
              {notification?.message}
            </Typography>
            
            {notification?.createdDate && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontStyle: 'italic',
                  display: 'block',
                  textAlign: 'right'
                }}
              >
                Recebido em: {formatDate(notification.createdDate)}
              </Typography>
            )}
          </Box>
        </Fade>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            minWidth: 100,
            borderRadius: 2,
            background: 'linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            }
          }}
        >
          Entendi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimpleNotificationModal;
