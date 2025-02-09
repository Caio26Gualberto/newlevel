import { Avatar, Box, Typography } from "@mui/material"
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
            <Box display="flex" bgcolor="#F3F3F3" height="100vh" justifyContent="flex-start" flexDirection="column" alignItems="center">
                <Box mt={5} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    <Typography variant="h3">Escolha seu avatar</Typography>
                    <Typography variant="h6">* Você poderá utilizar uma foto depois caso não queira selecionar uma agora &#129345;</Typography>
                </Box>
                <Box
                    onClick={handleButtonClick}
                    mt={5}
                    sx={{
                        cursor: "pointer",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar
                        src={imageSrc || undefined}
                        sx={{
                            width: "300px",
                            height: "300px",
                            bgcolor: imageSrc ? 'transparent' : randomColor,
                            '&:hover': {
                                border: '2px dashed #000',
                                opacity: 0.7,
                            },
                            cursor: 'pointer'
                        }}
                    >
                        {!imageSrc && 'C'}
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
                <Box mt={6} width="100%" display="flex" justifyContent="center">
                    {imageSrc && <Box mr={2}><NewLevelButton onClick={handleRemoveImage} icon={CloseIcon} title="Remover foto" /></Box>}
                    <Box><NewLevelButton onClick={redirectToNextPageAndSaveAvatar} icon={ArrowForwardIcon} title="Próximo" /></Box>
                </Box>
            </Box>
        </>
    )
}

export default ChooseUserAvatar
