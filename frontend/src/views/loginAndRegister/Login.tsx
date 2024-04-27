import { Box, Button, Input, Modal, Typography } from "@mui/material"
import { AuthenticateApi } from "../../gen/api/src";
import { useState } from "react";
import ApiConfiguration from "../../apiConfig";

const style = {
  transform: 'translate(-50%, -50%)',
};

interface IFormLogin {
  login: string
  password: string
}


const Login = () => {

  const [formLogin, setFormLogin] = useState<IFormLogin>({
    login: '',
    password: ''
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormLogin({ ...formLogin, login: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormLogin({ ...formLogin, password: e.target.value });
  };

  const login = async () => {
    try {
      const api = new AuthenticateApi(ApiConfiguration)
      const result = await api.apiAuthenticateLoginPost({loginAndRegisterInputDto: {email: formLogin.login, password: formLogin.password}})
      window.localStorage.setItem('accessToken', result.token!)
      window.localStorage.setItem('refreshToken', result.refreshToken!)
      window.location.href = "http://localhost:3000/welcome"
    } catch (error) {

    }
  }

  return (
    <>
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
          position="absolute" top="50%" left="50%" width="768px" minHeight="480px" borderRadius="10px"
          boxShadow="0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)" bgcolor="#3c140c" maxWidth="100%" sx={style}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography color="white" fontWeight="bold" variant="h4">Bem-vindo!</Typography>
            <Typography color="white" fontSize={15}>Entre com a sua conta</Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Input value={formLogin.login} onChange={handleLoginChange} placeholder="Login" sx={{ color: "white" }}></Input>
            <Input value={formLogin.password} onChange={handlePasswordChange} placeholder="Password" sx={{ color: "white" }}></Input>
          </Box>
          <Box display="flex" mt={1}>
            <Button onClick={login} sx={{ color: "white" }}>Entrar</Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default Login
