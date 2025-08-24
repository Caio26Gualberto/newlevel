import { Avatar, Box, Button, Divider, FormControl, Grid, IconButton, Input, InputLabel, MenuItem, Paper, Select, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as toastr from 'toastr';
import { CommonApi, EActivityLocation, SelectOptionDto, UserApi } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import { UserInfoResponseDto } from "../../gen/api/src/models/UserInfoResponseDto";
import Swal from "sweetalert2";
import NewLevelLoading from "../../components/NewLevelLoading";
import PanoramaHorizontalIcon from '@mui/icons-material/PanoramaHorizontal';
import BannerModal from "./bannerModal/BannerModal";

const MyProfile = () => {
    const userService = new UserApi(ApiConfiguration);
    const commonService = new CommonApi(ApiConfiguration);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [openBannerModal, setOpenModalBanner] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [userInfos, setUserInfos] = useState<UserInfoResponseDto>({ email: '', nickname: '', activityLocation: 1 });
    const [userLocation, setUserLocation] = useState<SelectOptionDto>({ name: '', value: 0 });
    const [locations, setLocation] = useState<SelectOptionDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [formUpdateRegister, setFormUpdateRegister] = useState({
        email: '',
        nickname: '',
        city: 0,
    });

    const handleCityChange = (event: any) => {
        const selectedCityValue = event.target.value as number;
        const selectedCity = locations.find(city => city.value === selectedCityValue);
        setFormUpdateRegister({ ...formUpdateRegister, city: selectedCity!.value! });
    }

    const handleEditProfile = () => {
        if (!isEditing) {
            setIsEditing(true);
            toastr.info('Edição ativa', '', { timeOut: 3000, positionClass: "toast-bottom-right" });
        } else {
            setIsEditing(false);
            setSelectedImage(null);
            setFormUpdateRegister({ email: userInfos.email!, nickname: userInfos.nickname!, city: userInfos.activityLocation! });
            toastr.info('Edição desativada', '', { timeOut: 3000, positionClass: "toast-bottom-right" });
        }
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleCloseModalBanner = () => {
        setOpenModalBanner(false);
    };

    const editingPassword = () => {
        editingPasswordModal();
    }

    const editingPasswordModal = async () => {
        const { value: formValues, dismiss } = await Swal.fire({
            title: 'Alterar Senha',
            html: '<p>Deseja enviar um email para a redefinição de senha?</p>',
            focusConfirm: false,
            confirmButtonColor: '#4caf50',
            showCancelButton: true,
            cancelButtonColor: '#f44336',
            preConfirm: () => {
                return true;
            }
        });

        if (formValues) {
            await userService.apiUserGenerateTokenToResetPasswordPost({});
            Swal.fire('E-mail de redefinição enviado com sucesso!', '', 'success');
        } else if (dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Operação cancelada', '', 'info');
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const reader = new FileReader();
            setFile(files[0]);
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setSelectedImage(reader.result);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleUpdateChanges = async () => {
        setLoading(false)
        const result = await userService.apiUserUpdateUserPost({
            email: formUpdateRegister.email,
            nickname: formUpdateRegister.nickname,
            activityLocation: formUpdateRegister.city as EActivityLocation,
            file: file ?? undefined
        });

        if (result.isSuccess) {
            window.location.reload();
        } else {
            toastr.error(result.message!, 'Erro!', { timeOut: 3000, positionClass: "toast-bottom-right" });
        }
    };

    useEffect(() => {
        const userInformations = async () => {
            const userInfos = await userService.apiUserGetUserInfoGet();
            const userLocation = await commonService.apiCommonGetDisplayCitiesGet();

            if (userInfos.isSuccess) {
                setUserInfos(userInfos.data!);
                setFormUpdateRegister({ email: userInfos.data!.email!, nickname: userInfos.data!.nickname!, city: userInfos.data!.activityLocation! });
            } else {
                toastr.error(userInfos.message!, '', { timeOut: 3000, positionClass: "toast-bottom-right" });
            }
            if (userLocation.isSuccess) {
                setLocation(userLocation.data!);
                setUserLocation(locations.find(x => x.value === userInfos.data!.activityLocation!)!);
            } else {
                toastr.error(userLocation.message!, '', { timeOut: 3000, positionClass: "toast-bottom-right" });
            }
        }

        userInformations();
    }
        , []);

    return (
        <>
            <NewLevelLoading isLoading={loading} />
            {openBannerModal && <BannerModal onClose={handleCloseModalBanner} open={openBannerModal} />}
            
            <Box 
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    minHeight: "92.5vh",
                    bgcolor: "#F3F3F3",
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
                        width: {
                            xs: "100%",
                            sm: "90%",
                            md: "85%"
                        },
                        maxWidth: "1200px",
                        height: {
                            xs: "auto",
                            md: "50rem"
                        }
                    }}
                >
                    <Box 
                        sx={{
                            height: "100%",
                            p: {
                                xs: 2,
                                sm: 3,
                                md: 4
                            }
                        }}
                    >
                        <Grid 
                            container 
                            height="100%"
                            spacing={{
                                xs: 2,
                                sm: 3,
                                md: 4
                            }}
                        >
                            {/* Avatar Section */}
                            <Grid 
                                item 
                                xs={12}
                                md={3}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}
                            >
                                <Box 
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 2
                                    }}
                                >
                                    {!isEditing ? (
                                        <Avatar
                                            src={selectedImage || userInfos.profilePicture}
                                            sx={{
                                                width: {
                                                    xs: "150px",
                                                    sm: "180px",
                                                    md: "200px"
                                                },
                                                height: {
                                                    xs: "150px",
                                                    sm: "180px",
                                                    md: "200px"
                                                }
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{ 
                                                cursor: "pointer", 
                                                position: "relative" 
                                            }}
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={() => document.getElementById('upload-image-input')!.click()}
                                        >
                                            <Avatar
                                                src={selectedImage || userInfos.profilePicture}
                                                sx={{
                                                    width: {
                                                        xs: "150px",
                                                        sm: "180px",
                                                        md: "200px"
                                                    },
                                                    height: {
                                                        xs: "150px",
                                                        sm: "180px",
                                                        md: "200px"
                                                    },
                                                    opacity: isHovered ? 0.5 : 1
                                                }}
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                style={{ display: 'none' }}
                                                id="upload-image-input"
                                            />
                                            {isHovered && (
                                                <IconButton
                                                    sx={{
                                                        position: "absolute",
                                                        bottom: 0,
                                                        right: 0,
                                                        backgroundColor: "rgba(255, 255, 255, 0.5)"
                                                    }}
                                                >
                                                    <CloudUploadIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    )}
                                    
                                    {/* Action Buttons */}
                                    <Box 
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                            width: "100%"
                                        }}
                                    >
                                        <Button 
                                            sx={{ 
                                                color: "red",
                                                fontSize: {
                                                    xs: "0.75rem",
                                                    sm: "0.875rem"
                                                }
                                            }} 
                                            onClick={handleEditProfile}
                                        >
                                            {isEditing ? 'Cancelar edição' : 'Ativar edição de perfil'}
                                        </Button>
                                        {isEditing && (
                                            <Button 
                                                sx={{ 
                                                    color: "green",
                                                    fontSize: {
                                                        xs: "0.75rem",
                                                        sm: "0.875rem"
                                                    }
                                                }} 
                                                onClick={handleUpdateChanges}
                                            >
                                                Salvar
                                            </Button>
                                        )}
                                    </Box>

                                    {/* Banner Button */}
                                    <Box 
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            width: "100%"
                                        }}
                                    >
                                        <Button 
                                            variant="contained" 
                                            endIcon={<PanoramaHorizontalIcon />} 
                                            onClick={() => { setOpenModalBanner(true) }} 
                                            color="success"
                                            sx={{
                                                fontSize: {
                                                    xs: "0.75rem",
                                                    sm: "0.875rem"
                                                }
                                            }}
                                        >
                                            {userInfos.profileBanner ? 'Editar Banner' : 'Adicionar Banner ao perfil'}
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Divider */}
                            <Grid item xs={12} md={1}>
                                <Box 
                                    sx={{
                                        height: "100%",
                                        display: {
                                            xs: "none",
                                            md: "flex"
                                        },
                                        justifyContent: "start",
                                        alignItems: "center"
                                    }}
                                >
                                    <Divider orientation="vertical" />
                                </Box>
                            </Grid>

                            {/* Form Section */}
                            <Grid 
                                item 
                                xs={12}
                                md={8}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-start"
                                }}
                            >
                                <Box 
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: {
                                            xs: 2,
                                            sm: 3
                                        }
                                    }}
                                >
                                    {/* Email Field */}
                                    <Box>
                                        <InputLabel>
                                            <Typography 
                                                fontWeight="bold"
                                                sx={{
                                                    fontSize: {
                                                        xs: "0.875rem",
                                                        sm: "1rem"
                                                    }
                                                }}
                                            >
                                                Email:
                                            </Typography>
                                        </InputLabel>
                                        {isEditing ? (
                                            <TextField 
                                                value={formUpdateRegister.email} 
                                                onChange={(e) => setFormUpdateRegister({ ...formUpdateRegister, email: e.target.value })} 
                                                size="small" 
                                                sx={{ 
                                                    width: {
                                                        xs: "100%",
                                                        md: "60%"
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        fontSize: {
                                                            xs: '0.875rem',
                                                            sm: '1rem'
                                                        }
                                                    }
                                                }} 
                                                variant="outlined"
                                            />
                                        ) : (
                                            <TextField 
                                                value={userInfos.email} 
                                                disabled 
                                                size="small" 
                                                sx={{ 
                                                    width: {
                                                        xs: "100%",
                                                        md: "60%"
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        fontSize: {
                                                            xs: '0.875rem',
                                                            sm: '1rem'
                                                        }
                                                    }
                                                }} 
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>

                                    {/* Nickname Field */}
                                    <Box>
                                        <InputLabel>
                                            <Typography 
                                                fontWeight="bold"
                                                sx={{
                                                    fontSize: {
                                                        xs: "0.875rem",
                                                        sm: "1rem"
                                                    }
                                                }}
                                            >
                                                Apelido:
                                            </Typography>
                                        </InputLabel>
                                        {isEditing ? (
                                            <TextField 
                                                value={formUpdateRegister.nickname} 
                                                onChange={(e) => setFormUpdateRegister({ ...formUpdateRegister, nickname: e.target.value })} 
                                                size="small" 
                                                sx={{ 
                                                    width: {
                                                        xs: "100%",
                                                        md: "60%"
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        fontSize: {
                                                            xs: '0.875rem',
                                                            sm: '1rem'
                                                        }
                                                    }
                                                }} 
                                                variant="outlined"
                                            />
                                        ) : (
                                            <TextField 
                                                value={userInfos.nickname} 
                                                disabled 
                                                size="small" 
                                                sx={{ 
                                                    width: {
                                                        xs: "100%",
                                                        md: "60%"
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        fontSize: {
                                                            xs: '0.875rem',
                                                            sm: '1rem'
                                                        }
                                                    }
                                                }} 
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>

                                    {/* Password Field */}
                                    <Box>
                                        <InputLabel>
                                            <Typography 
                                                fontWeight="bold"
                                                sx={{
                                                    fontSize: {
                                                        xs: "0.875rem",
                                                        sm: "1rem"
                                                    }
                                                }}
                                            >
                                                Senha:
                                            </Typography>
                                        </InputLabel>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: {
                                                    xs: "column",
                                                    sm: "row"
                                                },
                                                alignItems: {
                                                    xs: "flex-start",
                                                    sm: "center"
                                                },
                                                gap: 1
                                            }}
                                        >
                                            <TextField 
                                                value="******" 
                                                disabled={!isEditing} 
                                                size="small" 
                                                sx={{ 
                                                    width: {
                                                        xs: "100%",
                                                        sm: "60%"
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        fontSize: {
                                                            xs: '0.875rem',
                                                            sm: '1rem'
                                                        }
                                                    }
                                                }} 
                                                variant="outlined"
                                            />
                                            {isEditing && (
                                                <Button 
                                                    onClick={editingPassword} 
                                                    size="small" 
                                                    variant="contained"
                                                    sx={{
                                                        fontSize: {
                                                            xs: "0.75rem",
                                                            sm: "0.875rem"
                                                        }
                                                    }}
                                                >
                                                    Alteração de senha
                                                </Button>
                                            )}
                                        </Box>
                                        {isEditing && (
                                            <Typography
                                                sx={{
                                                    fontSize: {
                                                        xs: "0.75rem",
                                                        sm: "0.875rem"
                                                    },
                                                    mt: 1
                                                }}
                                            >
                                                <strong>*</strong>Sua senha possui um processo diferente de alteração para uma segurança maior
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* City Field */}
                                    <Box>
                                        <InputLabel>
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
                                        <FormControl 
                                            size="small" 
                                            sx={{ 
                                                width: {
                                                    xs: "100%",
                                                    md: "60%"
                                                }
                                            }}
                                        >
                                            {isEditing ? (
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={formUpdateRegister.city}
                                                    onChange={handleCityChange}
                                                    sx={{
                                                        '& .MuiSelect-select': {
                                                            fontSize: {
                                                                xs: '0.875rem',
                                                                sm: '1rem'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {locations.map((city) => (
                                                        <MenuItem key={city.value} value={city.value}>
                                                            {city.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={userInfos.activityLocation}
                                                    disabled
                                                    sx={{
                                                        '& .MuiSelect-select': {
                                                            fontSize: {
                                                                xs: '0.875rem',
                                                                sm: '1rem'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {locations.map((city) => (
                                                        <MenuItem key={city.value} value={city.value}>
                                                            {city.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        </FormControl>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default MyProfile
