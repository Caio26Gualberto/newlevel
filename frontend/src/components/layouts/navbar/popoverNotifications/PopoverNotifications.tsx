import { Box, Button, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover, styled, Typography } from '@mui/material';
import { ESystemNotificationType, NotificationDto } from '../../../../gen/api/src';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';

interface PopoverNotificationsProps {
    anchorEl: HTMLButtonElement | null;
    notificationList: NotificationDto[] | undefined;
    open: boolean;
    onClose: () => void;
}

const PopoverNotifications: React.FC<PopoverNotificationsProps> = ({ anchorEl, notificationList, open, onClose }) => {
    const [isButtonHovered, setIsButtonHovered] = React.useState(false);

    async function readMessage(notificationId: number) {
        console.log(notificationId);
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
                                sx={{
                                    '&:hover': {
                                        backgroundColor: isButtonHovered ? 'transparent' : 'default', // Use 'default' for the normal hover color
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
                                                <Box onClick={() => readMessage(notification.id!)}>
                                                    <IconButton
                                                        disableRipple
                                                        color='error'
                                                        onClick={onClose}
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
