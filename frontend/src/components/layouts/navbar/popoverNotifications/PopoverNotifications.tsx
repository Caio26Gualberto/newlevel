import { Box, Button, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover, styled, Typography } from '@mui/material';
import { ESystemNotificationType, NotificationDto, SystemNotificationApi } from '../../../../gen/api/src';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import ApiConfiguration from '../../../../apiConfig';
import * as toastr from 'toastr';
import ViewInviteModal from './viewInviteModal/ViewInviteModal';

interface PopoverNotificationsProps {
    anchorEl: HTMLButtonElement | null;
    notificationList: NotificationDto[] | undefined;
    open: boolean;
    onClose: () => void;
    onOpenInviteModal: () => void;
    updateNotifications: () => void;
    getNotification: (notification: NotificationDto) => void;
}

const PopoverNotifications: React.FC<PopoverNotificationsProps> = ({ anchorEl, notificationList, open, onClose, onOpenInviteModal, getNotification, updateNotifications }) => {
    const systemNotificationService = new SystemNotificationApi(ApiConfiguration);
    const [isButtonHovered, setIsButtonHovered] = React.useState<boolean>(false);

    const handleOpenInviteMessage = (notificationId: number) => {
        getNotification(notificationList?.find(notification => notification.id === notificationId)!);
        onOpenInviteModal();
    }

    async function deleteMessage(notificationId: number) {
        try {
            const result = await systemNotificationService.apiSystemNotificationDeleteNotificationDelete({ notificationId: notificationId });
            if (result.isSuccess) {
                updateNotifications();
                toastr.warning(result.message!, '', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
            } else {
                toastr.error(result.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
            }
        } catch (error) {
            console.error('Error while marking notification as read', error);
        }
    }

    return (
        <Popover
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <Box width="400px" maxHeight="500px">
                <List>
                    {notificationList?.map((notification) => (
                        <ListItem key={notification.title} disablePadding>
                            <ListItemButton
                                disableRipple={isButtonHovered}
                                onClick={(event) => {
                                    handleOpenInviteMessage(notification.id!);
                                    onClose();
                                }}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: isButtonHovered ? 'transparent' : 'default',
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    {renderizeIconForMessageType(notification.notificationType as number)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={notification.message}
                                    secondary={
                                        <Box>
                                            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                                                <Typography variant="body2">{notification.createdDate?.toLocaleDateString()}</Typography>
                                                <Box>
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
                                                                backgroundColor: 'rgba(0, 0, 0, 0.08)'
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    {notificationList?.length === 0 &&
                        (
                            <Box height="100%">
                                <Typography variant="body2" align="center">Nenhuma notificação</Typography>
                            </Box>
                        )
                    }
                </List>
            </Box>
        </Popover>
    );
};

function renderizeIconForMessageType(notificationType: number): React.ReactNode {
    switch (notificationType) {
        case ESystemNotificationType.NUMBER_0:
            return <StickyNote2Icon />;

        case ESystemNotificationType.NUMBER_1:
            return <FiberNewIcon />;

        case ESystemNotificationType.NUMBER_2:
            return <FiberNewIcon />;

        case ESystemNotificationType.NUMBER_3:
            return <PlayCircleIcon color='secondary' />;

        default:
            return <StickyNote2Icon />;
    }
}

export default PopoverNotifications;
