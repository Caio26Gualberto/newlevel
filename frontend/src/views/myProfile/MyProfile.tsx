import { Avatar, Box, Button, Divider, FormControl, Grid, IconButton, Input, InputLabel, MenuItem, Paper, Select, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as toastr from 'toastr';
import { CommonApi, DisplayActivityLocationDto, EActivityLocation, UserApi } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import { UserInfoResponseDto } from "../../gen/api/src/models/UserInfoResponseDto";
import Swal from "sweetalert2";
import NewLevelLoading from "../../components/NewLevelLoading";

const MyProfile = () => {
    const userService = new UserApi(ApiConfiguration);
    const commonService = new CommonApi(ApiConfiguration);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [userInfos, setUserInfos] = useState<UserInfoResponseDto>({ email: '', nickname: '', activityLocation: 1 });
    const [userLocation, setUserLocation] = useState<DisplayActivityLocationDto>({ name: '', value: 0 });
    const [locations, setLocation] = useState<DisplayActivityLocationDto[]>([]);
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
            {!isMobile &&
                (
                    <Box display="flex" alignItems="center" justifyContent="center" flex={1} height="92.5vh" bgcolor="#F3F3F3">
                        <Paper elevation={4} sx={{ width: "85%", height: "50rem" }}>
                            <Box height="100%">
                                <Grid container height="100%">
                                    <Grid item xs={3}>
                                        <Box mt={2} height="100%" display="flex" justifyContent="flex-start" flexDirection="column" alignItems="center">
                                            {!isEditing ?
                                                (<Avatar
                                                    src={selectedImage || userInfos.profilePicture}
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
                                                        src={selectedImage || userInfos.profilePicture}
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
                                                        >
                                                            <CloudUploadIcon />
                                                        </IconButton>
                                                    )}
                                                </Box>)}
                                            <Box mt={2} display="flex" flexDirection="column">
                                                <Button sx={{ color: "red" }} onClick={handleEditProfile}>{isEditing ? 'Cancelar edição' : 'Ativar edição de perfil'}</Button>
                                                {isEditing && <Button sx={{ color: "green" }} onClick={handleUpdateChanges}>Salvar</Button>}
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
                                                {isEditing ? (<TextField value={formUpdateRegister.email} onChange={(e) => setFormUpdateRegister({ ...formUpdateRegister, email: e.target.value })} size="small" sx={{ width: "60%" }} variant="outlined" />) : (<TextField value={userInfos.email} disabled size="small" sx={{ width: "60%" }} variant="outlined" />)}
                                            </Box>
                                            <Box width="100%" mt={2}>
                                                <InputLabel><Typography fontWeight="bold">Apelido:</Typography></InputLabel>
                                                {isEditing ? (<TextField value={formUpdateRegister.nickname} onChange={(e) => setFormUpdateRegister({ ...formUpdateRegister, nickname: e.target.value })} size="small" sx={{ width: "60%" }} variant="outlined" />) : (<TextField value={userInfos.nickname} disabled size="small" sx={{ width: "60%" }} variant="outlined" />)}
                                            </Box>
                                            <Box width="100%" mt={2}>
                                                <InputLabel><Typography fontWeight="bold">Senha:</Typography></InputLabel>
                                                <TextField value="******" disabled={!isEditing} size="small" sx={{ width: "60%" }} variant="outlined" />
                                                {isEditing && <Button onClick={editingPassword} size="small" sx={{ marginLeft: "8px", marginTop: "5px" }} variant="contained">Alteração de senha</Button>}
                                                {isEditing && <Typography><strong>*</strong>Sua senha possui um processo diferente de alteração para uma segurança maior</Typography>}
                                            </Box>
                                            <Box width="100%" mt={2}>
                                                <InputLabel><Typography fontWeight="bold">Cidade:</Typography></InputLabel>
                                                <FormControl size="small" sx={{ width: "60%" }}>
                                                    {isEditing ?
                                                        (<Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={formUpdateRegister.city}
                                                            onChange={handleCityChange}
                                                        >
                                                            {locations.map((city) => {
                                                                return <MenuItem key={city.value} value={city.value}>{city.name}</MenuItem>
                                                            })}
                                                        </Select>) :
                                                        (<Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={userInfos.activityLocation}
                                                            disabled
                                                        >
                                                            {locations.map((city) => {
                                                                return <MenuItem key={city.value} value={city.value}>{city.name}</MenuItem>
                                                            })}
                                                        </Select>)
                                                    }
                                                </FormControl>
                                            </Box>
                                            <Box>

                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper >
                    </Box>
                )
            }
            {isMobile && (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="auto" bgcolor="#F3F3F3" p={2}>
                    <Paper elevation={4} sx={{ width: "100%", maxWidth: "600px", padding: 2 }}>
                        <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                            <Avatar
                                src={selectedImage || userInfos.profilePicture}
                                sx={{
                                    width: 150,
                                    height: 150
                                }}
                            />
                            {isEditing && (
                                <Box
                                    sx={{ cursor: "pointer", position: "relative", mt: 2 }}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() => document.getElementById('upload-image-input')!.click()}
                                >
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
                            <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                                <Button sx={{ color: "red" }} onClick={handleEditProfile}>{isEditing ? 'Cancelar edição' : 'Ativar edição de perfil'}</Button>
                                {isEditing && <Button sx={{ color: "green" }} onClick={handleUpdateChanges}>Salvar</Button>}
                            </Box>
                        </Box>

                        <Box mt={3} display="flex" flexDirection="column">
                            <Box width="100%" mt={2}>
                                <InputLabel><Typography fontWeight="bold">Email:</Typography></InputLabel>
                                {isEditing ? (
                                    <TextField
                                        value={formUpdateRegister.email}
                                        onChange={(e) => setFormUpdateRegister({ ...formUpdateRegister, email: e.target.value })}
                                        size="small"
                                        sx={{ width: "100%" }}
                                        variant="outlined"
                                    />
                                ) : (
                                    <TextField
                                        value={userInfos.email}
                                        disabled
                                        size="small"
                                        sx={{ width: "100%" }}
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                            <Box width="100%" mt={2}>
                                <InputLabel><Typography fontWeight="bold">Apelido:</Typography></InputLabel>
                                {isEditing ? (
                                    <TextField
                                        value={formUpdateRegister.nickname}
                                        onChange={(e) => setFormUpdateRegister({ ...formUpdateRegister, nickname: e.target.value })}
                                        size="small"
                                        sx={{ width: "100%" }}
                                        variant="outlined"
                                    />
                                ) : (
                                    <TextField
                                        value={userInfos.nickname}
                                        disabled
                                        size="small"
                                        sx={{ width: "100%" }}
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                            <Box width="100%" mt={2}>
                                <InputLabel><Typography fontWeight="bold">Senha:</Typography></InputLabel>
                                <TextField
                                    value="******"
                                    disabled={!isEditing}
                                    size="small"
                                    sx={{ width: "100%" }}
                                    variant="outlined"
                                />
                                {isEditing && (
                                    <Button
                                        onClick={editingPassword}
                                        size="small"
                                        sx={{ marginLeft: '8px', marginTop: '5px' }}
                                        variant="contained"
                                    >
                                        Alteração de senha
                                    </Button>
                                )}
                                {isEditing && (
                                    <Typography>
                                        <strong>*</strong>Sua senha possui um processo diferente de alteração para uma segurança maior
                                    </Typography>
                                )}
                            </Box>
                            <Box width="100%" mt={2}>
                                <InputLabel><Typography fontWeight="bold">Cidade:</Typography></InputLabel>
                                <FormControl size="small" sx={{ width: "100%" }}>
                                    {isEditing ? (
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={formUpdateRegister.city}
                                            onChange={handleCityChange}
                                        >
                                            {locations.map((city) => (
                                                <MenuItem key={city.value} value={city.value}>{city.name}</MenuItem>
                                            ))}
                                        </Select>
                                    ) : (
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={userInfos.activityLocation}
                                            disabled
                                        >
                                            {locations.map((city) => (
                                                <MenuItem key={city.value} value={city.value}>{city.name}</MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                </FormControl>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            )}

        </>
    )
}

export default MyProfile
