import NewLevelModalHeader from "../../../components/NewLevelModalHeader";
import NewLevelModal from "../../../components/NewLevelModal"
import { Box, Button, Input } from "@mui/material";
import { useState } from "react";
import { UserApi } from "../../../gen/api/src";
import ApiConfiguration from "../../../apiConfig";
import * as toastr from 'toastr';
import { useMobile } from "../../../MobileContext";

interface ResetPasswordProps {
    open: boolean;
    onClose: () => void;
}

const ModalPassword: React.FC<ResetPasswordProps> = ({ open, onClose }) => {
    const userService = new UserApi(ApiConfiguration)
    const { isMobile } = useMobile()
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
            width={isMobile ? '90%' : 500}
            height={isMobile ? 'auto' : '15%'}
        >
            <>
                <NewLevelModalHeader title="Confirme o email" closeModal={onClose} />
                <Box
                    height={isMobile ? 'auto' : '60%'}
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    p={2}
                >
                    <Input
                        sx={{ width: isMobile ? '90%' : '70%' }}
                        placeholder="Digite seu email"
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <Button
                        onClick={sendEmail}
                        sx={{
                            backgroundColor: "#b81414",
                            "&:hover": { backgroundColor: "white" },
                            color: "black",
                            width: isMobile ? '90%' : '70%',
                            mt: 2,
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
