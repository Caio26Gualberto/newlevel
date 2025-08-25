import { Box, Button, IconButton, Input, Paper, Tooltip, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { UserApi } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import Swal from "sweetalert2";

const ResetPassword = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
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
        <Box 
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                p: {
                    xs: 2,
                    sm: 3,
                    md: 4
                }
            }}
        >
            <Paper 
                elevation={4} 
                sx={{ 
                    height: {
                        xs: "auto",
                        sm: "25vh",
                        md: "20vh"
                    },
                    width: {
                        xs: "100%",
                        sm: "80%",
                        md: "60%",
                        lg: "40%",
                        xl: "20%"
                    },
                    maxWidth: "500px",
                    minHeight: {
                        xs: "300px",
                        sm: "250px"
                    }
                }}
            >
                <Box 
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3
                        },
                        display: "flex",
                        justifyContent: "space-around",
                        height: "100%",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Box 
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                            cursor: "pointer"
                        }}
                        onClick={handleShowPassword}
                    >
                        <Tooltip 
                            title={
                                <Typography 
                                    sx={{
                                        fontSize: {
                                            xs: "0.75rem",
                                            sm: "0.875rem"
                                        },
                                        fontWeight: "bold"
                                    }}
                                >
                                    Visualizar senha
                                </Typography>
                            }
                        >
                            {showPassword ? (
                                <VisibilityOffIcon 
                                    sx={{ 
                                        marginTop: "8px", 
                                        marginLeft: "8px",
                                        fontSize: {
                                            xs: "1.25rem",
                                            sm: "1.5rem"
                                        }
                                    }} 
                                />
                            ) : (
                                <VisibilityIcon 
                                    sx={{ 
                                        marginTop: "8px", 
                                        marginLeft: "8px",
                                        fontSize: {
                                            xs: "1.25rem",
                                            sm: "1.5rem"
                                        }
                                    }} 
                                />
                            )}
                        </Tooltip>
                    </Box>
                    <Box 
                        sx={{
                            display: "flex",
                            width: "100%"
                        }}
                    >
                        <Input 
                            onChange={(e) => setPasswords(prevState => ({ ...prevState, password: e.target.value }))} 
                            type={showPassword ? "text" : "password"} 
                            fullWidth 
                            placeholder="Nova senha"
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontSize: {
                                        xs: '0.875rem',
                                        sm: '1rem'
                                    }
                                }
                            }}
                        />
                    </Box>
                    <Box 
                        sx={{
                            width: "100%"
                        }}
                    >
                        <Input 
                            onChange={(e) => setPasswords(prevState => ({ ...prevState, confirmPassword: e.target.value }))} 
                            type={showPassword ? "text" : "password"} 
                            fullWidth 
                            placeholder="Confirme a senha"
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontSize: {
                                        xs: '0.875rem',
                                        sm: '1rem'
                                    }
                                }
                            }}
                        />
                    </Box>
                    <Box 
                        sx={{
                            width: "100%"
                        }}
                    >
                        <Button 
                            onClick={resetPassword} 
                            fullWidth 
                            sx={{ 
                                backgroundColor: "#b81414", 
                                "&:hover": { backgroundColor: "white" }, 
                                color: "black",
                                fontSize: {
                                    xs: "0.875rem",
                                    sm: "1rem"
                                },
                                py: {
                                    xs: 1,
                                    sm: 1.5
                                }
                            }}
                        >
                            Alterar a senha
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default ResetPassword
