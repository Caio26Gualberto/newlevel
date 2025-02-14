import { Box, Dialog, DialogTitle, Link, Typography } from "@mui/material";
import { IntegrantInfoDto } from "../../../gen/api/src";
import LinkIcon from '@mui/icons-material/Link';


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
                                    <Typography key={index} variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                        <strong>
                                            <Link
                                                href={integrant.profileUrl}
                                                underline="none"
                                                color="primary"
                                                sx={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px", 
                                                    fontWeight: "bold",
                                                    transition: "color 0.3s ease, transform 0.3s ease",
                                                    "&:hover": {
                                                        color: "red",
                                                        textDecoration: "underline",
                                                        transform: "scale(1.05)"
                                                    }
                                                }}
                                            >
                                                {integrant.name}
                                                <LinkIcon sx={{ fontSize: 16 }} />
                                            </Link>
                                        </strong>
                                        <span style={{ marginLeft: "8px" }}>{integrant.instrument}</span>
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
