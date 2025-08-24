import { Box, Dialog, DialogTitle, Link, Typography, useTheme, useMediaQuery } from "@mui/material";
import { IntegrantInfoDto } from "../../../gen/api/src";
import LinkIcon from '@mui/icons-material/Link';


interface SimpleDialogProps {
    title: string;
    data: { [key: string]: string };
    dataWithUrl?: IntegrantInfoDto[];
}

const IntegrantsDialog: React.FC<SimpleDialogProps> = ({ title, data, dataWithUrl }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            {!dataWithUrl ?
                (
                    <Box 
                        sx={{
                            mb: 3
                        }}
                    >
                        <Box 
                            sx={{
                                mb: 2,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Typography 
                                variant="h5"
                                sx={{
                                    fontSize: {
                                        xs: "1.25rem",
                                        sm: "1.5rem",
                                        md: "1.75rem"
                                    }
                                }}
                            >
                                {title}
                            </Typography>
                        </Box>
                        {data &&
                            Object.entries(data).map(([member, instrument], index) => (
                                <Box 
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        mb: 1
                                    }}
                                >
                                    <Typography 
                                        variant="body1"
                                        sx={{
                                            fontSize: {
                                                xs: "0.875rem",
                                                sm: "1rem"
                                            },
                                            textAlign: "center"
                                        }}
                                    >
                                        <strong>{member}</strong> {instrument}
                                    </Typography>
                                </Box>
                            ))
                        }

                    </Box>
                )
                :
                (
                    <Box 
                        sx={{
                            m: 1,
                            mb: 3
                        }}
                    >
                        <Box 
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <DialogTitle
                                sx={{
                                    fontSize: {
                                        xs: "1.25rem",
                                        sm: "1.5rem",
                                        md: "1.75rem"
                                    }
                                }}
                            >
                                {title}
                            </DialogTitle>
                        </Box>
                        {dataWithUrl &&
                            dataWithUrl.map((integrant, index) => (
                                <Box 
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        mb: 1
                                    }}
                                >
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            display: "flex", 
                                            alignItems: "center",
                                            fontSize: {
                                                xs: "0.875rem",
                                                sm: "1rem"
                                            },
                                            flexDirection: {
                                                xs: "column",
                                                sm: "row"
                                            },
                                            textAlign: "center"
                                        }}
                                    >
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
                                                    },
                                                    fontSize: {
                                                        xs: "0.875rem",
                                                        sm: "1rem"
                                                    }
                                                }}
                                            >
                                                {integrant.name}
                                                <LinkIcon 
                                                    sx={{ 
                                                        fontSize: {
                                                            xs: 14,
                                                            sm: 16
                                                        }
                                                    }} 
                                                />
                                            </Link>
                                        </strong>
                                        <span 
                                            style={{ 
                                                marginLeft: "8px",
                                                marginTop: isSmallMobile ? "4px" : "0"
                                            }}
                                        >
                                            {integrant.instrument}
                                        </span>
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
