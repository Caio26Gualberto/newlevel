import { Box, Button, IconButton, Input, Paper, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    useEffect(() => {
        const rootElement = document.getElementById('root');
        if (rootElement) {
            if (window.location.pathname === '/security/resetPassword') {
                rootElement.classList.add('image-with-opacity-reset-password');
            }
            return () => {
                rootElement.classList.remove('image-with-opacity-reset-password');
            };
        }
    }
        , [])

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Paper elevation={4} sx={{ height: "20vh", width: "20%" }}>
                <Box p={2} display="flex" justifyContent="space-around" height="100%" flexDirection="column" alignItems="center">
                    <Box width="100%" display="flex" justifyContent="flex-end" onClick={handleShowPassword} sx={{ cursor: "pointer" }}>
                        <Tooltip title={<Typography fontSize={12} fontWeight="bold">Visualizar senha</Typography>}>
                            {showPassword ? (
                                <VisibilityOffIcon sx={{ marginTop: "8px", marginLeft: "8px" }} />
                            ) : (
                                <VisibilityIcon sx={{ marginTop: "8px", marginLeft: "8px" }} />
                            )}
                        </Tooltip>
                    </Box>
                    <Box display="flex" width="100%">
                        <Input type={showPassword ? "text" : "password"} fullWidth placeholder="Nova senha"></Input>
                    </Box>
                    <Box width="100%">
                        <Input type={showPassword ? "text" : "password"} fullWidth placeholder="Confirme a senha"></Input>
                    </Box>
                    <Box width="100%">
                        <Button fullWidth sx={{ backgroundColor: "#b81414", "&:hover": { backgroundColor: "white" }, color: "black" }}>Alterar a senha</Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default ResetPassword
