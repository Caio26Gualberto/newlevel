import { 
    Box, 
    IconButton, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Popover, 
    Typography, 
    useTheme, 
    useMediaQuery 
} from '@mui/material';
import { ESystemNotificationType, NotificationDto, SystemNotificationApi } from '../../gen/api/src';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import ApiConfiguration from '../../config/apiConfig';
import * as toastr from 'toastr';
import { NotificationHandlerService } from '../../services/NotificationHandlerService';

interface PopoverNotificationsProps {
    anchorEl: HTMLButtonElement | null;
    notificationList: NotificationDto[] | undefined | null;
    open: boolean;
    onClose: () => void;
    onOpenInviteModal: (notification: NotificationDto) => void;
    onOpenSimpleModal: (notification: NotificationDto) => void;
    onOpenBannerModal: (notification: NotificationDto) => void;
    onOpenPopupModal: (notification: NotificationDto) => void;
    updateNotifications: () => void;
    getNotification: (notification: NotificationDto) => void;
}

const PopoverNotifications: React.FC<PopoverNotificationsProps> = ({ 
    anchorEl, 
    notificationList, 
    open, 
    onClose, 
    onOpenInviteModal,
    onOpenSimpleModal,
    onOpenBannerModal,
    onOpenPopupModal,
    getNotification, 
    updateNotifications 
}) => {
    const systemNotificationService = new SystemNotificationApi(ApiConfiguration);
    const [isButtonHovered, setIsButtonHovered] = React.useState<boolean>(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Initialize notification handler service
    const notificationHandler = React.useMemo(() => {
        return new NotificationHandlerService(
            (notification: NotificationDto) => {
                getNotification(notification);
                onOpenInviteModal(notification);
            },
            onOpenSimpleModal,
            onOpenBannerModal,
            onOpenPopupModal
        );
    }, [getNotification, onOpenInviteModal, onOpenSimpleModal, onOpenBannerModal, onOpenPopupModal]);

    const handleNotificationClick = (notification: NotificationDto) => {
        notificationHandler.handleNotificationClick(notification);
    }

    async function deleteMessage(notificationId: number) {
        try {
            const result = await systemNotificationService.apiSystemNotificationDeleteNotificationDelete({ 
                notificationId: notificationId 
            });
            if (result.isSuccess) {
                updateNotifications();
                toastr.warning(result.message!, '', { 
                    timeOut: 3000, 
                    progressBar: true, 
                    positionClass: "toast-bottom-right" 
                });
            } else {
                toastr.error(result.message!, 'Erro!', { 
                    timeOut: 3000, 
                    progressBar: true, 
                    positionClass: "toast-bottom-right" 
                });
            }
        } catch (error) {
            console.error('Error while deleting notification', error);
        }
    }

    const renderizeIconForMessageType = (notificationType: number): React.ReactNode => {
        switch (notificationType) {
            case ESystemNotificationType.NUMBER_0:
                return <StickyNote2Icon sx={{ color: theme.palette.info.main }} />;
            case ESystemNotificationType.NUMBER_1:
                return <FiberNewIcon sx={{ color: theme.palette.success.main }} />;
            case ESystemNotificationType.NUMBER_2:
                return <FiberNewIcon sx={{ color: theme.palette.warning.main }} />;
            case ESystemNotificationType.NUMBER_3:
                return <PlayCircleIcon sx={{ color: theme.palette.secondary.main }} />;
            default:
                return <StickyNote2Icon sx={{ color: theme.palette.info.main }} />;
        }
    }

    return (
        <Popover
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            sx={{
                '& .MuiPopover-paper': {
                    width: {
                        xs: '280px',
                        sm: '350px',
                        md: '400px'
                    },
                    maxHeight: {
                        xs: '400px',
                        sm: '450px',
                        md: '500px'
                    },
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: 2,
                    boxShadow: theme.shadows[8]
                }
            }}
        >
            <Box 
                sx={{
                    width: "100%",
                    maxHeight: "100%"
                }}
            >
                <List sx={{ py: 0 }}>
                    {notificationList && notificationList.length > 0 ? (
                        notificationList.map((notification) => (
                            <ListItem key={notification.id} disablePadding>
                                <ListItemButton
                                    disableRipple={isButtonHovered}
                                    onClick={() => {
                                        handleNotificationClick(notification);
                                        onClose();
                                    }}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: isButtonHovered ? 'transparent' : theme.palette.action.hover,
                                        },
                                        py: 1
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        {renderizeIconForMessageType(notification.notificationType as number)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                sx={{
                                                    fontSize: {
                                                        xs: "0.75rem",
                                                        sm: "0.875rem"
                                                    },
                                                    fontWeight: 500,
                                                    color: theme.palette.text.primary,
                                                    lineHeight: 1.4
                                                }}
                                            >
                                                {notification.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontSize: {
                                                            xs: "0.7rem",
                                                            sm: "0.8rem"
                                                        },
                                                        color: theme.palette.text.secondary,
                                                        lineHeight: 1.3,
                                                        mb: 0.5
                                                    }}
                                                >
                                                    {notification.message}
                                                </Typography>
                                                <Box 
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "space-between"
                                                    }}
                                                >
                                                    <Typography 
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: {
                                                                xs: "0.625rem",
                                                                sm: "0.75rem"
                                                            },
                                                            color: theme.palette.text.disabled
                                                        }}
                                                    >
                                                        {notification.createdDate ? new Date(notification.createdDate).toLocaleDateString('pt-BR') : ''}
                                                    </Typography>
                                                    <IconButton
                                                        color='error'
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            deleteMessage(notification.id!);
                                                        }}
                                                        onMouseEnter={() => setIsButtonHovered(true)}
                                                        onMouseLeave={() => setIsButtonHovered(false)}
                                                        sx={{
                                                            '&:hover': {
                                                                backgroundColor: theme.palette.error.main + '20'
                                                            },
                                                            width: {
                                                                xs: "28px",
                                                                sm: "32px"
                                                            },
                                                            height: {
                                                                xs: "28px",
                                                                sm: "32px"
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon 
                                                            sx={{
                                                                fontSize: {
                                                                    xs: "0.9rem",
                                                                    sm: "1rem"
                                                                }
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    ) : (
                        <Box 
                            sx={{
                                height: "120px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                p: 2
                            }}
                        >
                            <Typography 
                                variant="body2" 
                                align="center"
                                sx={{
                                    fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.875rem"
                                    },
                                    color: theme.palette.text.secondary
                                }}
                            >
                                Nenhuma notificação
                            </Typography>
                        </Box>
                    )}
                </List>
            </Box>
        </Popover>
    );
};

export default PopoverNotifications;
