import { Box, Dialog, DialogTitle, Typography } from "@mui/material";
import { IntegrantInfoDto } from "../../../gen/api/src";


interface SimpleDialogProps {
    open: boolean;
    title: string;
    data: { [key: string]: string };
    dataWithUrl?: IntegrantInfoDto[];
    onClose: (value: string) => void;
}

const IntegrantsDialog: React.FC<SimpleDialogProps> = ({ open, title, data, dataWithUrl, onClose }) => {

    const handleClose = () => {
        onClose('');
    };

    return (
        <Dialog fullWidth onClose={handleClose} open={open}>
            {!dataWithUrl ?
                (
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
                )
                :
                (
                    <Box m={1} mb={3}>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <DialogTitle>{title}</DialogTitle>
                        </Box>
                        {dataWithUrl &&
                            dataWithUrl.map((integrant, index) => (
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <Typography key={index} variant="body1">
                                        <strong><a href={integrant.profileUrl}>{integrant.name}</a></strong> {integrant.instrument}
                                    </Typography>
                                </Box>
                            ))
                        }

                    </Box>
                )
            }

        </Dialog>
    )
}

export default IntegrantsDialog
