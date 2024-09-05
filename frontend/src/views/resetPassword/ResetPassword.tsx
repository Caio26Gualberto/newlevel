import { Box, Button, IconButton, Input, Paper, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { UserApi } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import Swal from "sweetalert2";

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    async function resetPassword() {
        const parsedUrl = new URL(window.location.href);
        const userService = new UserApi(ApiConfiguration)
        const token = parsedUrl.searchParams.get('token');
        const userId = parsedUrl.searchParams.get('userId');

        const result = await userService.apiUserResetPasswordPost({
            resetPasswordInput: {
                token: token!,
                userId: userId!,
                password: passwords.password,
                passwordConfirmation: passwords.confirmPassword
            }
        })

        if (result.isSuccess) {
            Swal.fire({
                title: 'Sucesso!',
                text: result.message,
                icon: 'success',
                confirmButtonText: 'Fechar Janela'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.close();
                }
            });
        } else {
            Swal.fire({
                title: 'Erro',
                text: result.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
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
                        <Input onChange={(e) => setPasswords(prevState => ({ ...prevState, password: e.target.value }))} type={showPassword ? "text" : "password"} fullWidth placeholder="Nova senha"></Input>
                    </Box>
                    <Box width="100%">
                        <Input onChange={(e) => setPasswords(prevState => ({ ...prevState, confirmPassword: e.target.value }))} type={showPassword ? "text" : "password"} fullWidth placeholder="Confirme a senha"></Input>
                    </Box>
                    <Box width="100%">
                        <Button onClick={resetPassword} fullWidth sx={{ backgroundColor: "#b81414", "&:hover": { backgroundColor: "white" }, color: "black" }}>Alterar a senha</Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default ResetPassword
