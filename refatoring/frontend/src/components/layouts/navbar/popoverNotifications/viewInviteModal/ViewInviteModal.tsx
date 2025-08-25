import { NotificationDto, SystemNotificationApi } from '../../../../../gen/api/src';
import NewLevelModal from '../../../../../components/NewLevelModal';
import NewLevelModalHeader from '../../../../../components/NewLevelModalHeader';
import React from 'react'
import { Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import ApiConfiguration from '../../../../../apiConfig';
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
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const bandName = notification?.message?.match(/banda\s+(.*?)\s+como/)?.[1];

    async function acceptInvite() {
        const result = await systemNotificationService.apiSystemNotificationRespondToInvitePut({ notificationId: notification?.id!, isAccept: true });

        if (result.isSuccess) {
            Swal.fire({
                title: 'Parábens!',
                text: `Agora você faz parte da banda ${bandName}`,
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                onClose();
            });
            onClose();
        } else {
            Swal.fire({
                title: 'Erro!',
                text: result.message,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }

    async function declineInvite() {
        const result = await systemNotificationService.apiSystemNotificationRespondToInvitePut({ notificationId: notification?.id!, isAccept: false });

        if (result.isSuccess) {
            Swal.fire({
                text: `Você recusou o convite da banda ${bandName}`,
                icon: 'error',
                confirmButtonText: 'Ok'
            }).then(() => {
                onClose();
            });
            onClose();
        } else {
            Swal.fire({
                title: 'Erro!',
                text: result.message,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }

    return (
        <NewLevelModal
            open={open}
            onClose={onClose}
            width={isSmallMobile ? 300 : isMobile ? 400 : 500}
            height="auto"
        >
            <>
                <NewLevelModalHeader closeModal={() => { onClose() }} title={notification?.title!} />
                <Box 
                    sx={{
                        p: {
                            xs: 1,
                            sm: 2
                        }
                    }}
                >
                    <Typography 
                        variant="body1"
                        sx={{
                            fontSize: {
                                xs: "0.875rem",
                                sm: "1rem"
                            }
                        }}
                    >
                        {notification?.message}
                    </Typography>
                </Box>
                <Box 
                    sx={{
                        p: {
                            xs: 1,
                            sm: 2
                        },
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
                        variant="text" 
                        color="error"
                        sx={{
                            fontSize: {
                                xs: "0.875rem",
                                sm: "1rem"
                            }
                        }}
                    >
                        Recusar
                        <ClearIcon 
                            sx={{
                                ml: 0.5,
                                fontSize: {
                                    xs: "1rem",
                                    sm: "1.25rem"
                                }
                            }}
                        />
                    </Button>
                    <Button 
                        onClick={acceptInvite} 
                        variant="text" 
                        color="success"
                        sx={{
                            fontSize: {
                                xs: "0.875rem",
                                sm: "1rem"
                            }
                        }}
                    >
                        Aceitar
                        <DoneIcon 
                            sx={{
                                ml: 0.5,
                                fontSize: {
                                    xs: "1rem",
                                    sm: "1.25rem"
                                }
                            }}
                        />
                    </Button>
                </Box>
            </>
        </NewLevelModal>
    )
}

export default ViewInviteModal