import { Box, Dialog, DialogTitle, Typography } from "@mui/material";


interface SimpleDialogProps {
    open: boolean;
    title: string;
    data: { [key: string]: string };
    onClose: (value: string) => void;
}

const IntegrantsDialog: React.FC<SimpleDialogProps> = ({ open, title, data, onClose }) => {

    const handleClose = () => {
        onClose('');
    };

    return (
        <Dialog fullWidth onClose={handleClose} open={open}>
            <Box m={1} mb={3}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <DialogTitle>{title}</DialogTitle>
                </Box>
                {data &&
                    Object.entries(data).map(([member, instrument], index) => (
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Typography key={index} variant="body1">
                                <strong>{member}</strong> {instrument}
                            </Typography>
                        </Box>
                    ))
                }

            </Box>
        </Dialog>
    )
}

export default IntegrantsDialog
