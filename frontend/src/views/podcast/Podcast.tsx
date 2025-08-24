import { Box, Typography, useTheme, useMediaQuery } from "@mui/material"

const Podcast = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box 
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        p: {
          xs: 2,
          sm: 3,
          md: 4
        }
      }}
    >
      <Typography 
        variant={isSmallMobile ? "h4" : "h3"}
        fontWeight="bold"
        sx={{
          fontSize: {
            xs: "2rem",
            sm: "3rem",
            md: "3.75rem"
          },
          textAlign: "center"
        }}
      >
        Em breve! &#128679;
      </Typography>
    </Box>
  )
}

export default Podcast
