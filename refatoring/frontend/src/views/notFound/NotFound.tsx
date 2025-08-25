import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

const NotFound = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Box 
            sx={{
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                p: {
                    xs: 2,
                    sm: 3,
                    md: 4
                }
            }}
        >
            <Box
                sx={{
                    textAlign: "center",
                    maxWidth: "600px"
                }}
            >
                <Typography 
                    variant={isSmallMobile ? "h3" : "h2"}
                    sx={{
                        fontSize: {
                            xs: "2rem",
                            sm: "3rem",
                            md: "3.75rem"
                        },
                        fontWeight: "bold",
                        mb: 2,
                        color: "text.primary"
                    }}
                >
                    404 - Página não encontrada
                </Typography>
                <Typography 
                    variant={isSmallMobile ? "body1" : "h6"}
                    sx={{
                        fontSize: {
                            xs: "1rem",
                            sm: "1.25rem",
                            md: "1.5rem"
                        },
                        color: "text.secondary",
                        lineHeight: 1.5
                    }}
                >
                    Desculpe, a página que você está tentando acessar não existe.
                </Typography>
            </Box>
        </Box>
    );
};

export default NotFound;