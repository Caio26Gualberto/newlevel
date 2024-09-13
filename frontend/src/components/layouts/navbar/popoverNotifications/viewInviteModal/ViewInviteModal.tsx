import { NotificationDto, SystemNotificationApi } from '../../../../../gen/api/src';
import NewLevelModal from '../../../../../components/NewLevelModal';
import NewLevelModalHeader from '../../../../../components/NewLevelModalHeader';
import React from 'react'
import { Box, Button, Typography } from '@mui/material';
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
            width={500}
            height="auto"
        >
            <>
                <NewLevelModalHeader closeModal={() => { onClose() }} title={notification?.title!} />
                <Box p={2}>
                    <Typography variant="body1">{notification?.message}</Typography>
                </Box>
                <Box p={2} display="flex" justifyContent="space-evenly">
                    <Button onClick={declineInvite} variant="text" color="error">Recusar<ClearIcon /></Button>
                    <Button onClick={acceptInvite} variant="text" color="success">Aceitar<DoneIcon /></Button>
                </Box>
            </>
        </NewLevelModal>
    )
}

export default ViewInviteModal