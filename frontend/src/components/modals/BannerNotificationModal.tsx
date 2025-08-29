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
  Slide,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Close as CloseIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';
import { NotificationDto } from '../../gen/api/src';

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface BannerNotificationModalProps {
  open: boolean;
  notification: NotificationDto | undefined;
  onClose: () => void;
}

const BannerNotificationModal: React.FC<BannerNotificationModalProps> = ({ 
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
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          maxHeight: isMobile ? '100vh' : '85vh',
          background: 'linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%)'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          boxShadow: theme.shadows[4]
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CampaignIcon sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold">
            Aviso Importante
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
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3,
            '& .MuiAlert-icon': {
              fontSize: '2rem'
            }
          }}
        >
          <AlertTitle sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            {notification?.title}
          </AlertTitle>
        </Alert>

        <Box 
          sx={{ 
            p: 3, 
            bgcolor: 'background.paper', 
            borderRadius: 2,
            border: '2px solid',
            borderColor: 'warning.main',
            boxShadow: theme.shadows[2]
          }}
        >
          <Typography 
            variant="h6"
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.1rem"
              },
              lineHeight: 1.6,
              color: theme.palette.text.primary,
              fontWeight: 500,
              textAlign: 'center',
              mb: 2
            }}
          >
            {notification?.message}
          </Typography>
          
          {notification?.createdDate && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontStyle: 'italic',
                textAlign: 'center',
                mt: 2,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider'
              }}
            >
              Publicado em: {formatDate(notification.createdDate)}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 3, 
          bgcolor: 'warning.50',
          justifyContent: 'center'
        }}
      >
        <Button
          variant="contained"
          onClick={onClose}
          size="large"
          sx={{
            minWidth: 150,
            borderRadius: 3,
            background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': {
              background: 'linear-gradient(45deg, #f57c00 30%, #ff9800 90%)',
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[8]
            },
            transition: 'all 0.3s ease'
          }}
        >
          Entendi o Aviso
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BannerNotificationModal;
