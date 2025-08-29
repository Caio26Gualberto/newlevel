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
  Zoom,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { NotificationDto } from '../../gen/api/src';

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>,
) {
  return <Zoom ref={ref} {...props} />;
});

interface PopupNotificationModalProps {
  open: boolean;
  notification: NotificationDto | undefined;
  onClose: () => void;
}

const PopupNotificationModal: React.FC<PopupNotificationModalProps> = ({ 
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
          borderRadius: isMobile ? 0 : 4,
          maxHeight: isMobile ? '100vh' : '90vh',
          background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
          boxShadow: theme.shadows[24]
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          boxShadow: theme.shadows[8]
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <NotificationsIcon sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight="bold">
            Notificação Especial
          </Typography>
        </Box>
        
        <IconButton
          onClick={onClose}
          sx={{ 
            color: 'white',
            '&:hover': { 
              bgcolor: 'rgba(255,255,255,0.1)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <CloseIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Card 
          elevation={8}
          sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
            border: '2px solid',
            borderColor: 'primary.main'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                mb: 3,
                textAlign: 'center'
              }}
            >
              {notification?.title}
            </Typography>

            <Divider sx={{ mb: 3, borderColor: 'primary.main' }} />

            <Box 
              sx={{ 
                p: 3, 
                bgcolor: 'grey.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Typography 
                variant="body1"
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.1rem"
                  },
                  lineHeight: 1.8,
                  color: theme.palette.text.primary,
                  textAlign: 'justify',
                  whiteSpace: 'pre-line'
                }}
              >
                {notification?.message}
              </Typography>
            </Box>
            
            {notification?.createdDate && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 1,
                  mt: 3,
                  p: 2,
                  bgcolor: 'primary.50',
                  borderRadius: 2
                }}
              >
                <ScheduleIcon color="primary" />
                <Typography 
                  variant="body2" 
                  color="primary.main"
                  sx={{ 
                    fontWeight: 500
                  }}
                >
                  Recebido em: {formatDate(notification.createdDate)}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 3, 
          bgcolor: 'primary.50',
          justifyContent: 'center'
        }}
      >
        <Button
          variant="contained"
          onClick={onClose}
          size="large"
          sx={{
            minWidth: 180,
            borderRadius: 3,
            background: 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            py: 2,
            px: 4,
            '&:hover': {
              background: 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)',
              transform: 'translateY(-3px)',
              boxShadow: theme.shadows[12]
            },
            transition: 'all 0.3s ease',
            boxShadow: theme.shadows[4]
          }}
        >
          Fechar Notificação
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupNotificationModal;
