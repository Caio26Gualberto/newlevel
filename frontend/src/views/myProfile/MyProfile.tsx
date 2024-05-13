import { Avatar, Box, Button, Divider, Grid, IconButton, Input, InputLabel, Paper, TextField, Typography } from "@mui/material"
import TestImage from "../../assets/slayer_86.jpg"
import { useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as toastr from 'toastr';

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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
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

    const handleEditProfile = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            toastr.info('Edição ativa', '', { timeOut: 3000, positionClass: "toast-bottom-right" });
        } else {
            toastr.info('Edição desativada', '', { timeOut: 3000, positionClass: "toast-bottom-right" });
        }
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
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

    return (
        <Box display="flex" alignItems="center" justifyContent="center" flex={1} height="92.5vh" bgcolor="#F3F3F3">
            <Paper elevation={4} sx={{ width: "85%", height: "50rem" }}>
                <Box height="100%">
                    <Grid container height="100%">
                        <Grid item xs={3}>
                            <Box mt={2} height="100%" display="flex" justifyContent="flex-start" flexDirection="column" alignItems="center">
                                {isEditing ?
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
                                    <TextField defaultValue="Caio" disabled={isEditing} size="small" sx={{ width: "60%" }} variant="outlined" />
                                </Box>
                                <Box width="100%" mt={2}>
                                    <InputLabel><Typography fontWeight="bold">Apelido:</Typography></InputLabel>
                                    <TextField defaultValue="Caio" disabled={isEditing} size="small" sx={{ width: "60%" }} variant="outlined" />
                                </Box>
                                <Box width="100%" mt={2}>
                                    <InputLabel><Typography fontWeight="bold">Senha:</Typography></InputLabel>
                                    <TextField defaultValue="******" disabled={isEditing} size="small" sx={{ width: "60%" }} variant="outlined" />
                                </Box>
                                <Box width="100%" mt={2}>
                                    <InputLabel><Typography fontWeight="bold">Cidade:</Typography></InputLabel>
                                    <TextField defaultValue="Caio" disabled={isEditing} size="small" sx={{ width: "60%" }} variant="outlined" />
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
