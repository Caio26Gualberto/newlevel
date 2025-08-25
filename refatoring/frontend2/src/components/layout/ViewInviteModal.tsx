import { NotificationDto, SystemNotificationApi } from '../../gen/api/src';
import React from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    useTheme, 
    useMediaQuery, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import ApiConfiguration from '../../config/apiConfig';
import Swal from 'sweetalert2';

interface ViewInviteModalProps {
    open: boolean;
    notification: NotificationDto | undefined;
    onClose: () => void;
}

const ViewInviteModal: React.FC<ViewInviteModalProps> = ({ open, notification, onClose }) => {
    const systemNotificationService = new SystemNotificationApi(ApiConfiguration);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const bandName = notification?.message?.match(/banda\s+(.*?)\s+como/)?.[1];

    async function acceptInvite() {
        const result = await systemNotificationService.apiSystemNotificationRespondToInvitePut({ 
            notificationId: notification?.id!, 
            isAccept: true 
        });

        if (result.isSuccess) {
            Swal.fire({
                title: 'Parabéns!',
                text: `Agora você faz parte da banda ${bandName}`,
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                onClose();
            });
        } else {
            Swal.fire({
                title: 'Erro!',
                text: result.message!,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }

    async function declineInvite() {
        const result = await systemNotificationService.apiSystemNotificationRespondToInvitePut({ 
            notificationId: notification?.id!, 
            isAccept: false 
        });

        if (result.isSuccess) {
            Swal.fire({
                text: `Você recusou o convite da banda ${bandName}`,
                icon: 'error',
                confirmButtonText: 'Ok'
            }).then(() => {
                onClose();
            });
        } else {
            Swal.fire({
                title: 'Erro!',
                text: result.message!,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: 2,
                    width: {
                        xs: '95%',
                        sm: '90%',
                        md: '500px'
                    }
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: {
                        xs: '1.1rem',
                        sm: '1.25rem'
                    },
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    pb: 1
                }}
            >
                {notification?.title}
                <IconButton
                    onClick={onClose}
                    sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    py: 2
                }}
            >
                <Typography 
                    variant="body1"
                    sx={{
                        fontSize: {
                            xs: "0.875rem",
                            sm: "1rem"
                        },
                        lineHeight: 1.6,
                        color: theme.palette.text.primary
                    }}
                >
                    {notification?.message}
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2,
                    pt: 1,
                    display: "flex",
                    justifyContent: "space-evenly",
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    gap: 1
                }}
            >
                <Button 
                    onClick={declineInvite} 
                    variant="outlined" 
                    color="error"
                    startIcon={<ClearIcon />}
                    sx={{
                        fontSize: {
                            xs: "0.875rem",
                            sm: "1rem"
                        },
                        minWidth: {
                            xs: "100%",
                            sm: "120px"
                        },
                        borderRadius: 2,
                        textTransform: 'none'
                    }}
                >
                    Recusar
                </Button>
                <Button 
                    onClick={acceptInvite} 
                    variant="contained" 
                    color="success"
                    startIcon={<DoneIcon />}
                    sx={{
                        fontSize: {
                            xs: "0.875rem",
                            sm: "1rem"
                        },
                        minWidth: {
                            xs: "100%",
                            sm: "120px"
                        },
                        borderRadius: 2,
                        textTransform: 'none'
                    }}
                >
                    Aceitar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ViewInviteModal
