import { Avatar, Box, Button, Divider, FormControl, Grid, IconButton, Input, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material"
import TestImage from "../../assets/slayer_86.jpg"
import { useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as toastr from 'toastr';
import { CommonApi, DisplayActivityLocationDto, UserApi } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import { UserInfoResponseDto } from "../../gen/api/src/models/UserInfoResponseDto";
import Swal from "sweetalert2";

interface IFormUpdateRegister {
    email: {
        value: string;
        error: boolean;
    };
    nickname: {
        value: string;
        error: boolean;
    }
    password: {
        value: string;
        error: boolean;
    }
    confirmPassword: {
        value: string;
        error: boolean;
    }
    birthPlace: {
        value: string;
        error: boolean;
    }

}

const MyProfile = () => {
    const userService = new UserApi(ApiConfiguration);
    const commonService = new CommonApi(ApiConfiguration);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [userInfos, setUserInfos] = useState<UserInfoResponseDto>({ email: '', nickname: '', activityLocation: 1 });
    const [userLocation, setUserLocation] = useState<DisplayActivityLocationDto>({ name: '', value: 0 });
    const [locations, setLocation] = useState<DisplayActivityLocationDto[]>([]);
    const [formUpdateRegister, setFormUpdateRegister] = useState<IFormUpdateRegister>({
        email: {
            value: '',
            error: false
        },
        nickname: {
            value: '',
            error: false
        },
        password: {
            value: '',
            error: false
        },
        confirmPassword: {
            value: '',
            error: false
        },
        birthPlace: {
            value: '',
            error: false
        }
    });

    const handleCityChange = (event: any) => {
        const selectedCityValue = event.target.value as number;
        const selectedCity = locations.find(city => city.value === selectedCityValue);
        setUserLocation(selectedCity!);
    }

    const handleEditProfile = () => {
        if (!isEditing) {
            setIsEditing(true);
            toastr.info('Edição ativa', '', { timeOut: 3000, positionClass: "toast-bottom-right" });
        } else {
            setIsEditing(false);
            toastr.info('Edição desativada', '', { timeOut: 3000, positionClass: "toast-bottom-right" });
        }
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
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
        debugger
        const files = event.target.files;
        if (files && files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setSelectedImage(reader.result);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleUploadImage = async () => {
        if (selectedImage) {
            try {
                debugger
                const response = await fetch('URL_PARA_O_SEU_BACKEND', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image: selectedImage }),
                });
                if (response.ok) {
                    console.log('Imagem enviada com sucesso!');
                } else {
                    console.error('Erro ao enviar imagem:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao enviar imagem:', error);
            }
        }
    };

    useEffect(() => {
        const userInformations = async () => {
            const userInfos = await userService.apiUserGetUserInfoGet();
            const userLocation = await commonService.apiCommonGetDisplayCitiesGet();

            if (userInfos.isSuccess) {
                setUserInfos(userInfos.data!);
            } else {
                toastr.error(userInfos.message!, '', { timeOut: 3000, positionClass: "toast-bottom-right" });
            }
            debugger
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
        <Box display="flex" alignItems="center" justifyContent="center" flex={1} height="92.5vh" bgcolor="#F3F3F3">
            <Paper elevation={4} sx={{ width: "85%", height: "50rem" }}>
                <Box height="100%">
                    <Grid container height="100%">
                        <Grid item xs={3}>
                            <Box mt={2} height="100%" display="flex" justifyContent="flex-start" flexDirection="column" alignItems="center">
                                {!isEditing ?
                                    (<Avatar
                                        src={selectedImage || TestImage}
                                        sx={{
                                            width: "200px",
                                            height: "200px"
                                        }}
                                    />)
                                    :
                                    (<Box
                                        sx={{ cursor: "pointer", position: "relative" }}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={() => document.getElementById('upload-image-input')!.click()}
                                    >
                                        <Avatar
                                            src={selectedImage || TestImage}
                                            sx={{
                                                width: "200px",
                                                height: "200px",
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
                                                onClick={handleUploadImage}
                                            >
                                                <CloudUploadIcon />
                                            </IconButton>
                                        )}
                                    </Box>)}
                                <Box mt={2}>
                                    <Button sx={{ color: "red" }} onClick={handleEditProfile}>Editar perfil</Button>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={1}>
                            <Box height="100%" display="flex" justifyContent="start" alignItems="center">
                                <Divider orientation="vertical" />
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <Box mt={3} height="100%" display="flex" flexDirection="column" justifyContent="flex-start">
                                <Box width="100%" mt={2}>
                                    <InputLabel><Typography fontWeight="bold">Email:</Typography></InputLabel>
                                    <TextField value={userInfos.email} disabled={!isEditing} size="small" sx={{ width: "60%" }} variant="outlined" />
                                </Box>
                                <Box width="100%" mt={2}>
                                    <InputLabel><Typography fontWeight="bold">Apelido:</Typography></InputLabel>
                                    <TextField value={userInfos.nickname} disabled={!isEditing} size="small" sx={{ width: "60%" }} variant="outlined" />
                                </Box>
                                <Box width="100%" mt={2}>
                                    <InputLabel><Typography fontWeight="bold">Senha:</Typography></InputLabel>
                                    <TextField value="******" disabled={!isEditing} size="small" sx={{ width: "60%" }} variant="outlined" />
                                    {isEditing && <Button onClick={editingPassword} size="small" sx={{ marginLeft: "8px", marginTop: "5px" }} variant="contained">Alteração de senha</Button>}
                                </Box>
                                <Box width="100%" mt={2}>
                                    <InputLabel><Typography fontWeight="bold">Cidade:</Typography></InputLabel>
                                    <FormControl size="small" sx={{ width: "60%" }}>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={1}
                                            onChange={handleCityChange}
                                            disabled={!isEditing}
                                        >
                                            {locations.map((city) => {
                                                return <MenuItem key={city.value} value={city.value}>{city.name}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box>

                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    )
}

export default MyProfile
