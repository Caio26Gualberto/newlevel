import { Avatar, Box, Typography, useTheme, useMediaQuery } from "@mui/material"
import NewLevelButton from "../../components/NewLevelButton";
import React, { useRef, useState } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { UserApi } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import * as toastr from 'toastr';
import NewLevelLoading from "../../components/NewLevelLoading";


const ChooseUserAvatar = () => {
    const userService = new UserApi(ApiConfiguration);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const redirectToNextPageAndSaveAvatar = async () => {
        setLoading(true)
        if (selectedImage) {
            const result = await userService.apiUserUploadAvatarImagePost(
                {
                    file: selectedImage
                }
            )

            if (result.isSuccess) {
                toastr.success(result.message!, 'Sucesso!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
            } else {
                toastr.error(result.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
            }
        }
        setLoading(false)
        navigate('/welcome');
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImageSrc(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const randomColor = getRandomColor();

    return (
        <>
        <NewLevelLoading isLoading={loading} />
            <Box 
                sx={{
                    display: "flex",
                    bgcolor: "#F3F3F3",
                    minHeight: "100vh",
                    justifyContent: "flex-start",
                    flexDirection: "column",
                    alignItems: "center",
                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4
                    }
                }}
            >
                <Box 
                    sx={{
                        mt: {
                            xs: 3,
                            sm: 4,
                            md: 5
                        },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        textAlign: "center"
                    }}
                >
                    <Typography 
                        variant={isSmallMobile ? "h4" : "h3"}
                        sx={{
                            fontSize: {
                                xs: "2rem",
                                sm: "3rem",
                                md: "3.75rem"
                            },
                            fontWeight: "bold",
                            mb: 2
                        }}
                    >
                        Escolha seu avatar
                    </Typography>
                    <Typography 
                        variant={isSmallMobile ? "body1" : "h6"}
                        sx={{
                            fontSize: {
                                xs: "0.875rem",
                                sm: "1rem",
                                md: "1.25rem"
                            },
                            textAlign: "center",
                            maxWidth: {
                                xs: "100%",
                                sm: "600px"
                            }
                        }}
                    >
                        * Você poderá utilizar uma foto depois caso não queira selecionar uma agora &#129345;
                    </Typography>
                </Box>
                <Box
                    onClick={handleButtonClick}
                    sx={{
                        mt: {
                            xs: 3,
                            sm: 4,
                            md: 5
                        },
                        cursor: "pointer",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar
                        src={imageSrc || undefined}
                        sx={{
                            width: {
                                xs: "200px",
                                sm: "250px",
                                md: "300px"
                            },
                            height: {
                                xs: "200px",
                                sm: "250px",
                                md: "300px"
                            },
                            bgcolor: imageSrc ? 'transparent' : randomColor,
                            '&:hover': {
                                border: '2px dashed #000',
                                opacity: 0.7,
                            },
                            cursor: 'pointer',
                            transition: 'all 0.3s ease-in-out'
                        }}
                    >
                        {!imageSrc && (
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "4rem",
                                        sm: "5rem",
                                        md: "6rem"
                                    },
                                    fontWeight: "bold"
                                }}
                            >
                                C
                            </Typography>
                        )}
                    </Avatar>
                    <input
                        type="file"
                        id="imagem"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </Box>
                <Box 
                    sx={{
                        mt: {
                            xs: 4,
                            sm: 5,
                            md: 6
                        },
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        },
                        alignItems: "center",
                        gap: 2
                    }}
                >
                    {imageSrc && (
                        <Box
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: "auto"
                                }
                            }}
                        >
                            <NewLevelButton 
                                onClick={handleRemoveImage} 
                                icon={CloseIcon} 
                                title="Remover foto"
                            />
                        </Box>
                    )}
                    <Box
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "auto"
                            }
                        }}
                    >
                        <NewLevelButton 
                            onClick={redirectToNextPageAndSaveAvatar} 
                            icon={ArrowForwardIcon} 
                            title="Próximo"
                        />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default ChooseUserAvatar
