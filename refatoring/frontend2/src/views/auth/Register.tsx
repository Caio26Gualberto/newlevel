import { useCallback, useEffect, useState, useMemo } from "react";
import ApiConfiguration from "../../config/apiConfig";
import { AuthenticateApi, CommonApi, EActivityLocation, SelectOptionDto } from "../../gen/api/src";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, Zoom, useTheme, useMediaQuery } from "@mui/material";
import Swal from "sweetalert2";
import * as toastr from 'toastr';
import { useNavigate } from "react-router-dom";
import slayerGif from '../../assets/slayer.gif';

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
    
    const authenticateService = useMemo(() => new AuthenticateApi(ApiConfiguration), []);
    const commonService = useMemo(() => new CommonApi(ApiConfiguration), []);
    
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
                title={tooltip ? <Typography variant="body2">{tooltip}</Typography> : ""}
                disableHoverListener={!tooltip}
                arrow
                placement="top"
            >
                <InputLabel variant="standard" sx={{ mb: 1 }}>
                    <Typography 
                        fontWeight="600"
                        color="text.primary"
                        sx={{
                            fontSize: {
                                xs: "0.9rem",
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
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                            borderColor: 'rgba(0,0,0,0.15)',
                            borderWidth: 2
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(211, 47, 47, 0.5)'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#d32f2f',
                            borderWidth: 2
                        }
                    },
                    '& .MuiInputBase-input': {
                        fontSize: {
                            xs: '0.9rem',
                            sm: '1rem'
                        },
                        py: 1.5
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
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                minHeight: "100vh",
                p: {
                    xs: 1,
                    sm: 2,
                    md: 4
                }
            }}
        >
            <Box 
                sx={{
                    display: "flex",
                    flex: 1,
                    maxWidth: '1400px',
                    height: {
                        xs: "auto",
                        md: "85vh"
                    }
                }}
            >
                <Grid 
                    container 
                    sx={{
                        bgcolor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: 4,
                        overflow: "hidden",
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    {/* Image Section */}
                    <Grid
                        item
                        xs={12}
                        md={7}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            position: 'relative',
                            background: 'linear-gradient(45deg, #000 0%, #1a1a1a 100%)',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(45deg, rgba(211, 47, 47, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%)',
                                zIndex: 1
                            }
                        }}
                    >
                        <img
                            src={slayerGif}
                            alt="Slayer GIF"
                            style={{
                                width: "100%",
                                height: isMobile ? "250px" : "100%",
                                objectFit: "cover",
                                filter: 'brightness(0.9) contrast(1.1)',
                                position: 'relative',
                                zIndex: 0
                            }}
                        />
                    </Grid>

                    {/* Form Section */}
                    <Grid
                        item
                        xs={12}
                        md={5}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            p: {
                                xs: 2,
                                sm: 3,
                                md: 3
                            },
                            gap: {
                                xs: 1.5,
                                sm: 2
                            },
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,248,248,0.95) 100%)',
                            position: 'relative',
                            maxHeight: {
                                xs: 'none',
                                md: '85vh'
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '4px',
                                height: '100%',
                                background: 'linear-gradient(180deg, #d32f2f 0%, #ff6b6b 100%)',
                            }
                        }}
                    >
                        {/* Title */}
                        <Box textAlign="center" mb={1}>
                            <Typography 
                                variant="h4"
                                fontWeight="bold"
                                className="gradient-text"
                                sx={{ 
                                    fontSize: {
                                        xs: "1.5rem",
                                        sm: "1.8rem",
                                        md: "2.2rem"
                                    },
                                    background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    mb: 0.5
                                }}
                            >
                                Registre-se
                            </Typography>
                            <Typography 
                                variant="body1" 
                                color="text.secondary"
                                sx={{ 
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    fontWeight: 500
                                }}
                            >
                                Junte-se à nossa comunidade
                            </Typography>
                        </Box>

                        {/* Help Text */}
                        <Box 
                            sx={{
                                p: 1.5,
                                bgcolor: 'rgba(211, 47, 47, 0.05)',
                                borderRadius: 2,
                                border: '1px solid rgba(211, 47, 47, 0.1)'
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.8rem"
                                    },
                                    fontWeight: 500
                                }}
                            >
                                💡 Passe o mouse sobre os campos para dicas
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
                                title={<Typography variant="body2">De onde era, ou cidade que costumava ser reconhecido</Typography>}
                                arrow
                                placement="top"
                            >
                                <InputLabel id="city-select-label" sx={{ mb: 1 }}>
                                    <Typography 
                                        fontWeight="600"
                                        color="text.primary"
                                        sx={{
                                            fontSize: {
                                                xs: "0.9rem",
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
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(0,0,0,0.15)',
                                            borderWidth: 2
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(211, 47, 47, 0.5)'
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#d32f2f',
                                            borderWidth: 2
                                        },
                                        '& .MuiSelect-select': {
                                            fontSize: {
                                                xs: '0.9rem',
                                                sm: '1rem'
                                            },
                                            py: 1.5
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
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 1,
                                py: 1.5,
                                fontSize: { xs: '0.95rem', sm: '1rem' },
                                fontWeight: 600,
                                borderRadius: 2,
                                backgroundColor: '#d32f2f',
                                color: 'white',
                                boxShadow: '0 4px 20px rgba(211, 47, 47, 0.4)',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                    backgroundColor: '#b71c1c',
                                    boxShadow: '0 6px 25px rgba(211, 47, 47, 0.6)',
                                    transform: 'translateY(-2px)'
                                },
                                '&:disabled': {
                                    backgroundColor: 'rgba(0,0,0,0.12)',
                                    color: 'rgba(0,0,0,0.26)',
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            {isLoading ? "Cadastrando..." : "Cadastrar"}
                        </Button>

                        {/* Login Link */}
                        <Box textAlign="center" mt={1}>
                            <Typography 
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                            >
                                Já tem uma conta?{' '}
                                <Button
                                    variant="text"
                                    onClick={() => navigate('/')}
                                    sx={{ 
                                        color: '#d32f2f',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        p: 0,
                                        minWidth: 'auto',
                                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                        '&:hover': {
                                            color: '#ff6b6b',
                                            backgroundColor: 'transparent'
                                        }
                                    }}
                                >
                                    Faça login
                                </Button>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Register;
