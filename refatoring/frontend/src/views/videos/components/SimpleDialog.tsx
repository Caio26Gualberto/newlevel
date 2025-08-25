import { Box, Dialog, DialogTitle, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";


interface SimpleDialogProps {
    open: boolean;
    displayData: string;
    title: string;
    onClose: (value: string) => void;
}

const SimpleDialog: React.FC<SimpleDialogProps> = ({ open, displayData, title, onClose }) => {

    const handleClose = () => {
        onClose(displayData);
    };

    return (
        <Dialog fullWidth onClose={handleClose} open={open}>
            <Box m={1} mb={3}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <DialogTitle>{title}</DialogTitle>
                </Box>
                <Typography pl={1}>{displayData}</Typography>
            </Box>
        </Dialog>
    )
}

export default SimpleDialog
