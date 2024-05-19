import { Alert, Box, Button, Dialog, Input, Modal, Typography } from "@mui/material"
import { AuthenticateApi } from "../../gen/api/src";
import { useContext, useEffect, useState } from "react";
import ApiConfiguration from "../../apiConfig";
import { Link, useNavigate } from "react-router-dom";
import * as toastr from 'toastr';
import ModalPassword from "./modalResetPassword/ModalPassword";
import { useAuth } from "../../AuthContext";

const style = {
  transform: 'translate(-50%, -50%)',
};

interface IFormLogin {
  login: string
  password: string
}

const Login = () => {
  const { setToken } = useAuth();
  const [formLogin, setFormLogin] = useState<IFormLogin>({
    login: '',
    password: ''
  });
  const [openModal, setOpenModal] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormLogin({ ...formLogin, login: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormLogin({ ...formLogin, password: e.target.value });
  };

  const handleSetModal = () => {
    setOpenModal(!openModal);
  }

  const login = async () => {
    try {
      const api = new AuthenticateApi(ApiConfiguration)

      if (formLogin.login === '' || formLogin.password === '') {
        toastr.warning('Preencha todos os campos', 'Atenção!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" })
        return
      }
      const result = await api.apiAuthenticateLoginPost({ loginInputDto: { email: formLogin.login, password: formLogin.password } })

      if (result.isSuccess) {
        window.localStorage.setItem('accessToken', result.data?.tokens?.token!)
        window.localStorage.setItem('refreshToken', result.data?.tokens?.refreshToken!)
        setToken(result.data?.tokens?.token!)
        toastr.success('Login efetuado com sucesso', 'Sucesso!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
        if (!result.data?.tokens?.skipIntroduction) {
          navigate('/newAvatar')
        } else {
          navigate('/videos')
        }
      } else {
        toastr.error(result.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      if (window.location.pathname === '/') {
        rootElement.classList.add('image-with-opacity');
      }
      return () => {
        rootElement.classList.remove('image-with-opacity');
      };
    }
  }
    , [])

  return (
    <>
      <ModalPassword open={openModal} onClose={handleSetModal} />
      <Box>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
          position="absolute" top="50%" left="50%" width="768px" minHeight="480px" borderRadius="10px"
          boxShadow="0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)" bgcolor="#3c140c" maxWidth="100%" sx={style}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography color="white" fontWeight="bold" variant="h4">Bem-vindo!</Typography>
            <Typography color="white" fontSize={15}>Entre com a sua conta</Typography>
          </Box>
          <Box display="flex" width="40%" flexDirection="column" alignItems="center">
            <Input fullWidth value={formLogin.login} onChange={handleLoginChange} placeholder="Login" sx={{ color: "white" }}></Input>
            <Input fullWidth value={formLogin.password} onChange={handlePasswordChange} placeholder="Senha" sx={{ color: "white" }}></Input>
          </Box>
          <Box display="flex" mt={1}>
            <Button onClick={login} sx={{ color: "white" }}>Entrar</Button>
          </Box>
          <Box>
            <Typography color="white" fontSize={15}>Não tem uma conta? <Link to="/register" style={{ color: "white" }}>Registre-se</Link></Typography>
          </Box>
          <Box>
            <Typography color="white" fontSize={15}>Esqueceu sua senha? <Link to="" onClick={handleSetModal} style={{ color: "white" }}>Clique aqui!</Link></Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Login
