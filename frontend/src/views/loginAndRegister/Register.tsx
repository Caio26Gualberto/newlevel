import { useContext, useEffect, useState, useCallback } from "react";
import ApiConfiguration from "../../apiConfig"
import { AuthenticateApi, CommonApi, EActivityLocation, SelectOptionDto } from "../../gen/api/src"
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, Zoom, useTheme, useMediaQuery } from "@mui/material";
import Swal from "sweetalert2";
import * as toastr from 'toastr';
import { useNavigate } from "react-router-dom";

interface IFormRegister {
    email: string;
    nickname: string;
    password: string;
    confirmPassword: string;
    birthPlace: SelectOptionDto;
}

interface IFormErrors {
    email: string;
    nickname: string;
    password: string;
    confirmPassword: string;
    city: string;
}

const Register = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const authenticateService = new AuthenticateApi(ApiConfiguration);
    const commonService = new CommonApi(ApiConfiguration);
    
    const [cities, setCities] = useState<SelectOptionDto[]>([]);
    const [selectedCity, setSelectedCity] = useState<SelectOptionDto>({ name: '', value: -1 });
    const [isLoading, setIsLoading] = useState(false);
    const [formRegister, setFormRegister] = useState<IFormRegister>({
        email: '',
        nickname: '',
        password: '',
        confirmPassword: '',
        birthPlace: { name: '', value: -1 }
    });

    // Form validation
    const validateForm = useCallback((): boolean => {
        const errors: Partial<IFormErrors> = {};

        if (!formRegister.email.trim()) {
            errors.email = 'Email é obrigatório';
        } else if (!formRegister.email.includes('@')) {
            errors.email = 'Email inválido';
        }

        if (!formRegister.nickname.trim()) {
            errors.nickname = 'Apelido é obrigatório';
        }

        if (!formRegister.password) {
            errors.password = 'Senha é obrigatória';
        } else if (formRegister.password.length < 6) {
            errors.password = 'A senha deve ter no mínimo 6 caracteres';
        }

        if (!formRegister.confirmPassword) {
            errors.confirmPassword = 'Confirmação de senha é obrigatória';
        } else if (formRegister.password !== formRegister.confirmPassword) {
            errors.confirmPassword = 'As senhas não coincidem';
        }

        if (selectedCity.value === -1) {
            errors.city = 'Cidade é obrigatória';
        }

        // Show first error found
        const firstError = Object.values(errors)[0];
        if (firstError) {
            toastr.warning(firstError, 'Atenção!', { 
                timeOut: 3000, 
                progressBar: true, 
                positionClass: "toast-bottom-right" 
            });
            return false;
        }

        return true;
    }, [formRegister, selectedCity.value]);

    const handleInputChange = useCallback((field: keyof IFormRegister, value: string) => {
        setFormRegister(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleCityChange = useCallback((event: any) => {
        const selectedCityValue = event.target.value as number;
        const city = cities.find(city => city.value === selectedCityValue);
        if (city) {
            setSelectedCity(city);
            setFormRegister(prev => ({
                ...prev,
                birthPlace: city
            }));
        }
    }, [cities]);

    const registerAction = useCallback(async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const result = await authenticateService.apiAuthenticateRegisterPost({
                registerInputDto: {
                    email: formRegister.email.trim(),
                    password: formRegister.password,
                    nickname: formRegister.nickname.trim(),
                    activityLocation: selectedCity.value as EActivityLocation
                }
            });

            if (result.isSuccess) {
                toastr.success(result.message!, 'Sucesso!', { 
                    timeOut: 3000, 
                    progressBar: true, 
                    positionClass: "toast-bottom-right" 
                });
                navigate('/');
            } else {
                Swal.fire({
                    title: 'Erro',
                    text: (result as any).message!,
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error('Erro no registro:', error);
            toastr.error('Erro ao realizar o cadastro. Tente novamente.', 'Erro!', { 
                timeOut: 3000, 
                progressBar: true, 
                positionClass: "toast-bottom-right" 
            });
        } finally {
            setIsLoading(false);
        }
    }, [validateForm, formRegister, selectedCity.value, authenticateService, navigate]);

    const fetchCities = useCallback(async () => {
        try {
            const result = await commonService.apiCommonGetDisplayCitiesGet();
            const citiesWithDefault = [
                { name: 'Selecione uma cidade', value: -1 },
                ...(result.data || [])
            ];
            setCities(citiesWithDefault);
        } catch (error) {
            console.error('Erro ao carregar cidades:', error);
            toastr.error('Erro ao carregar lista de cidades', 'Erro!', { 
                timeOut: 3000, 
                progressBar: true, 
                positionClass: "toast-bottom-right" 
            });
        }
    }, [commonService]);

    useEffect(() => {
        fetchCities();
    }, [fetchCities]);

    // Common form field component
    const FormField = useCallback(({ 
        label, 
        tooltip, 
        type = "text", 
        placeholder, 
        value, 
        onChange, 
        field 
    }: {
        label: string;
        tooltip?: string;
        type?: string;
        placeholder: string;
        value: string;
        onChange: (field: keyof IFormRegister, value: string) => void;
        field: keyof IFormRegister;
    }) => (
        <Box>
            <Tooltip 
                TransitionComponent={Zoom} 
                title={tooltip ? <Typography>{tooltip}</Typography> : ""}
                disableHoverListener={!tooltip}
            >
                <InputLabel variant="standard">
                    <Typography 
                        fontWeight="bold"
                        sx={{
                            fontSize: {
                                xs: "0.875rem",
                                sm: "1rem"
                            }
                        }}
                    >
                        {label}:
                    </Typography>
                </InputLabel>
            </Tooltip>
            <TextField
                fullWidth
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(field, event.target.value)}
                disabled={isLoading}
                variant="outlined"
                size="medium"
                sx={{
                    '& .MuiInputLabel-root': {
                        fontSize: {
                            xs: '0.875rem',
                            sm: '1rem'
                        }
                    },
                    '& .MuiInputBase-input': {
                        fontSize: {
                            xs: '0.875rem',
                            sm: '1rem'
                        }
                    }
                }}
            />
        </Box>
    ), [isLoading]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                bgcolor: "#4F4F4F",
                minHeight: "100vh",
                p: {
                    xs: 2,
                    sm: 3,
                    md: 0
                }
            }}
        >
            <Box 
                sx={{
                    display: "flex",
                    flex: 1,
                    height: {
                        xs: "auto",
                        md: "100vh"
                    }
                }}
            >
                <Grid 
                    container 
                    sx={{
                        m: {
                            xs: 0,
                            md: 10
                        },
                        bgcolor: "white",
                        borderRadius: 2,
                        overflow: "hidden"
                    }}
                >
                    {/* Image Section */}
                    <Grid
                        item
                        xs={12}
                        md={8}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            p: {
                                xs: 1,
                                md: 0
                            }
                        }}
                    >
                        <img
                            src={require('../../assets/slayer.gif')}
                            alt="Slayer GIF"
                            style={{
                                width: "100%",
                                height: isMobile ? "auto" : "100%",
                                objectFit: "cover"
                            }}
                        />
                    </Grid>

                    {/* Form Section */}
                    <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-evenly",
                            p: {
                                xs: 2,
                                sm: 3,
                                md: 2
                            },
                            gap: {
                                xs: 2,
                                sm: 3
                            }
                        }}
                    >
                        {/* Title */}
                        <Box display="flex" justifyContent="center">
                            <Typography 
                                variant={isMobile ? "h5" : "h3"}
                                sx={{ 
                                    overflow: "hidden",
                                    fontSize: {
                                        xs: "1.5rem",
                                        sm: "2rem",
                                        md: "3rem"
                                    }
                                }}
                            >
                                Registre-se
                            </Typography>
                        </Box>

                        {/* Help Text */}
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.875rem"
                                    }
                                }}
                            >
                                *Alguma dúvida sobre o preenchimento?
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.875rem"
                                    }
                                }}
                            >
                                Repouse o mouse sobre qualquer título dos campos abaixo 😀
                            </Typography>
                        </Box>

                        {/* Form Fields */}
                        <FormField
                            label="Email"
                            tooltip="Seu email será usado como forma de login, posteriormente será utilizado para entrar no site"
                            type="email"
                            placeholder="Email"
                            value={formRegister.email}
                            onChange={handleInputChange}
                            field="email"
                        />

                        <FormField
                            label="Apelido"
                            tooltip="Seu apelido como era conhecido na época, seja punk, cabeludo ou qualquer outra coisa"
                            placeholder="Apelido"
                            value={formRegister.nickname}
                            onChange={handleInputChange}
                            field="nickname"
                        />

                        <FormField
                            label="Senha"
                            type="password"
                            placeholder="Senha"
                            value={formRegister.password}
                            onChange={handleInputChange}
                            field="password"
                        />

                        <FormField
                            label="Confirme a senha"
                            type="password"
                            placeholder="Confirme a senha"
                            value={formRegister.confirmPassword}
                            onChange={handleInputChange}
                            field="confirmPassword"
                        />

                        {/* City Select */}
                        <Box>
                            <Tooltip 
                                TransitionComponent={Zoom} 
                                title={<Typography>De onde era, ou cidade que costumava ser reconhecido</Typography>}
                            >
                                <InputLabel id="city-select-label">
                                    <Typography 
                                        fontWeight="bold"
                                        sx={{
                                            fontSize: {
                                                xs: "0.875rem",
                                                sm: "1rem"
                                            }
                                        }}
                                    >
                                        Cidade:
                                    </Typography>
                                </InputLabel>
                            </Tooltip>
                            <FormControl fullWidth>
                                <Select
                                    labelId="city-select-label"
                                    id="city-select"
                                    value={selectedCity.value}
                                    onChange={handleCityChange}
                                    disabled={isLoading}
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        '& .MuiSelect-select': {
                                            fontSize: {
                                                xs: '0.875rem',
                                                sm: '1rem'
                                            }
                                        }
                                    }}
                                >
                                    {cities.map((city) => (
                                        <MenuItem key={city.value} value={city.value}>
                                            {city.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Submit Button */}
                        <Button
                            onClick={registerAction}
                            disabled={isLoading}
                            sx={{
                                backgroundColor: "#b81414",
                                "&:hover": { 
                                    backgroundColor: "white",
                                    color: "#b81414"
                                },
                                color: "black",
                                py: {
                                    xs: 1.5,
                                    sm: 2
                                },
                                fontSize: {
                                    xs: "0.875rem",
                                    sm: "1rem"
                                }
                            }}
                        >
                            <Typography fontWeight="bold" variant="overline">
                                {isLoading ? "Cadastrando..." : "Cadastrar"}
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Register;
