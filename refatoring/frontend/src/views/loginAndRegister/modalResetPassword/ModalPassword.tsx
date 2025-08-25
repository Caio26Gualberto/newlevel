import NewLevelModalHeader from "../../../components/NewLevelModalHeader";
import NewLevelModal from "../../../components/NewLevelModal"
import { Box, Button, Input, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { UserApi } from "../../../gen/api/src";
import ApiConfiguration from "../../../apiConfig";
import * as toastr from 'toastr';

interface ResetPasswordProps {
    open: boolean;
    onClose: () => void;
}

const ModalPassword: React.FC<ResetPasswordProps> = ({ open, onClose }) => {
    const userService = new UserApi(ApiConfiguration)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [email, setEmail] = useState<string>("")

    const sendEmail = async () => {
        const sendEmail = await userService.apiUserGenerateTokenToResetPasswordByEmailPost({
            email: email
        })

        if (sendEmail.isSuccess) {
            onClose()
            toastr.success('Email enviado', 'Sucesso!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
        } else {
            toastr.error('Algo deu errado com o envio de email', 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
        }
    }
    return (
        <NewLevelModal
            open={open}
            onClose={onClose}
            width={isSmallMobile ? '95%' : isMobile ? '90%' : 500}
            height={isSmallMobile ? 'auto' : isMobile ? 'auto' : '15%'}
        >
            <>
                <NewLevelModalHeader title="Confirme o email" closeModal={onClose} />
                <Box
                    sx={{
                        height: {
                            xs: 'auto',
                            sm: '60%'
                        },
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        p: {
                            xs: 1,
                            sm: 2
                        }
                    }}
                >
                    <Input
                        sx={{ 
                            width: {
                                xs: '90%',
                                sm: '70%'
                            },
                            '& .MuiInputBase-input': {
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                }
                            }
                        }}
                        placeholder="Digite seu email"
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <Button
                        onClick={sendEmail}
                        sx={{
                            backgroundColor: "#b81414",
                            "&:hover": { backgroundColor: "white" },
                            color: "black",
                            width: {
                                xs: '90%',
                                sm: '70%'
                            },
                            mt: 2,
                            fontSize: {
                                xs: "0.75rem",
                                sm: "0.875rem"
                            },
                            py: {
                                xs: 0.75,
                                sm: 1
                            }
                        }}
                    >
                        Enviar email com redefinição de senha
                    </Button>
                </Box>
            </>
        </NewLevelModal>
    );
}

export default ModalPassword
