import { Box, Dialog, DialogTitle, Typography } from "@mui/material";
import { IntegrantInfoDto } from "../../../gen/api/src";


interface SimpleDialogProps {
    title: string;
    data: { [key: string]: string };
    dataWithUrl?: IntegrantInfoDto[];
}

const IntegrantsDialog: React.FC<SimpleDialogProps> = ({ title, data, dataWithUrl }) => {

    return (
        <>
            {!dataWithUrl ?
                (
                    <Box mb={3}>
                        <Box mb={2} display="flex" justifyContent="center" alignItems="center">
                            <Typography variant="h5">{title}</Typography>
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

        </>
    )
}

export default IntegrantsDialog
