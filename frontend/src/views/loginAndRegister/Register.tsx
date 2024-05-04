import { useContext, useEffect, useState } from "react";
import ApiConfiguration from "../../apiConfig"
import { AuthenticateApi, CommonApi, DisplayActivityLocationDto, EActivityLocation } from "../../gen/api/src"
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, Zoom } from "@mui/material";
import { ApiContext } from "../../context/AlertContext";
import Swal from "sweetalert2";
import { redirect } from "react-router-dom";


interface IFormRegister {
    email: string,
    nickname: string,
    password: string,
    confirmPassword: string,
    birthPlace: DisplayActivityLocationDto,
}

const Register = () => {
    var toastr = require('toastr');
    const apiContext = useContext(ApiContext);
    const { setAlertMessage } = apiContext || {};
    const authenticateService = new AuthenticateApi(ApiConfiguration)
    const commonService = new CommonApi(ApiConfiguration)
    const [cities, setCities] = useState<DisplayActivityLocationDto[]>([])
    const [selectedCity, setSelectedCity] = useState<DisplayActivityLocationDto>({ name: '', value: -1 })
    const [formRegister, setFormRegister] = useState<IFormRegister>({
        email: '',
        nickname: '',
        password: '',
        confirmPassword: '',
        birthPlace: selectedCity
    });

    const registerAction = async () => {
        try {
            if (formRegister.email === '' || formRegister.nickname === '' || formRegister.password === '' || formRegister.confirmPassword === '' || selectedCity.value === -1) {
                setAlertMessage!({ message: 'Preencha todos os campos', severity: 'warning', title: 'Atenção' })
                return
            }
            if (formRegister.password.length < 6) {
                setAlertMessage!({ message: 'A senha deve ter no mínimo 6 caracteres', severity: 'warning', title: 'Atenção' })
                return
            }
            if (formRegister.password !== formRegister.confirmPassword) {
                setAlertMessage!({ message: 'As duas senhas estão diferentes', severity: 'warning', title: 'Atenção' })
                return
            }
            const result = await authenticateService.apiAuthenticateRegisterPost({
                registerInputDto: {
                    email: formRegister.email,
                    password: formRegister.password,
                    nickname: formRegister.nickname,
                    activityLocation: selectedCity.value as EActivityLocation
                }
            })

            if (result.isSuccess) {
                toastr.success(result.message, 'Sucesso!', { timeOut: 3000 , progressBar: true, positionClass: "toast-bottom-right"});
                setTimeout(function() {
                    window.location.href = '/';
                }, 2000);
            } else {
                Swal.fire({
                    title: 'Erro',
                    text: result.message,
                    icon: 'error'
                })               
            }
        } catch (error) {

        }
    }

    const handleCityChange = (event: any) => {
        const selectedCityValue = event.target.value as number;
        const selectedCity = cities.find(city => city.value === selectedCityValue);
        setSelectedCity(selectedCity!);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await commonService.apiCommonGetDisplayCitiesGet()
                result.push({ name: 'Selecione uma cidade', value: -1 })
                setCities(result)
            } catch (error) {

            } finally {

            }
        }

        fetchData()
    }, [])

    return (
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" bgcolor="#4F4F4F">
            <Box display="flex" flex={1} height="100vh">
                <Grid container m={10} bgcolor="white" borderRadius={2}>
                    <Grid item xs={8} overflow="hidden">
                        <img src={require('../../assets/slayer.gif')} alt="loading..." style={{ height: "100%" }} />
                    </Grid>
                    <Grid pr={2} item xs={4} display="flex" flexDirection="column" justifyContent="space-evenly">
                        <Box alignSelf="center" display="flex" justifyContent="center" flexDirection="column">
                            <Typography overflow="hidden" variant="h3">Registre-se</Typography>
                        </Box>
                        <Box>
                            <Typography>*Alguma dúvida sobre o preenchimento?</Typography>
                            <Typography>Repouse o mouse sobre qualquer título dos campos abaixo 😀</Typography>
                        </Box>
                        <Box>
                            <Tooltip TransitionComponent={Zoom} title={<Typography>Seu email será usado como forma de login, posteriormente será utilizado para entrar no site</Typography>}>
                                <InputLabel variant="standard"><Typography fontWeight="bold">Email:</Typography></InputLabel>
                            </Tooltip>
                            <TextField fullWidth type="email" placeholder="Email" onChange={(event) => setFormRegister({ ...formRegister, email: event.target.value })}></TextField>
                        </Box>
                        <Box>
                            <Tooltip TransitionComponent={Zoom} title={<Typography>Seu apelido como era conhecido na época, seja punk, cabeludo ou qualquer outra coisa</Typography>}>
                                <InputLabel variant="standard"><Typography fontWeight="bold">Apelido:</Typography></InputLabel>
                            </Tooltip>
                            <TextField fullWidth placeholder="Apelido" onChange={(event) => setFormRegister({ ...formRegister, nickname: event.target.value })}></TextField>
                        </Box>
                        <Box>
                            <InputLabel variant="standard"><Typography fontWeight="bold">Senha:</Typography></InputLabel>
                            <TextField fullWidth type="password" placeholder="Senha" onChange={(event) => setFormRegister({ ...formRegister, password: event.target.value })}></TextField>
                        </Box>
                        <Box>
                            <InputLabel variant="standard"><Typography fontWeight="bold">Confirme a senha:</Typography></InputLabel>
                            <TextField fullWidth type="password" placeholder="Confirme a senha" onChange={(event) => setFormRegister({ ...formRegister, confirmPassword: event.target.value })}></TextField>
                        </Box>
                        <Box>
                            <Tooltip TransitionComponent={Zoom} title={<Typography>De onde era, ou cidade que costumava ser reconhecido</Typography>}>
                                <InputLabel id="demo-simple-select-label"><Typography fontWeight="bold">Cidade:</Typography></InputLabel>
                            </Tooltip>
                            <FormControl fullWidth>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedCity.value}
                                    onChange={handleCityChange}
                                >
                                    {cities.map((city) => {
                                        return <MenuItem key={city.value} value={city.value}>{city.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Box>
                        <Button onClick={registerAction} sx={{ backgroundColor: "#b81414", "&:hover": { backgroundColor: "white" }, color: "black" }}><Typography fontWeight="bold" variant="overline">Cadastrar</Typography></Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default Register
