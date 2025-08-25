import React, { useState } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  useTheme, 
  useMediaQuery,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { UserApi } from "../../gen/api/src";
import ApiConfiguration from "../../config/apiConfig";
import Swal from 'sweetalert2';

interface BannerModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const BannerModal: React.FC<BannerModalProps> = ({ open, onClose, onSuccess }) => {
    const [image, setImage] = useState<File | null>(null);
    const [position, setPosition] = useState(50);
    const [dragging, setDragging] = useState(false);
    const startYRef = React.useRef(0);
    const startPositionRef = React.useRef(50);
    const [selectedImage, setSelectedImage] = useState<string | null | undefined>();
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const userService = React.useMemo(() => new UserApi(ApiConfiguration), []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        setImageState(files);
    };

    const setImageState = (files: FileList | null) => {
        if (files && files.length > 0) {
            const reader = new FileReader();
            setImage(files[0]);
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setSelectedImage(reader.result);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleMouseDown = (event: React.MouseEvent) => {
        setDragging(true);
        startYRef.current = event.clientY;
        startPositionRef.current = position;
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (!dragging) return;
        const deltaY = event.clientY - startYRef.current;
        const newPosition = Math.max(0, Math.min(100, startPositionRef.current + deltaY * 0.2));
        setPosition(newPosition);
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const uploadBanner = async () => {
        try {
            const result = await userService.apiUserUploadBannerImagePost({
                file: image!,
                position: Math.floor(position)
            });

            if (result.isSuccess) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Banner atualizado com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    handleClose();
                    onSuccess?.();
                });
            } else {
                Swal.fire({
                    title: 'Erro!',
                    text: result.message || 'Erro ao atualizar banner',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Erro inesperado ao atualizar banner',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    };

    const handleClose = () => {
        setImage(null);
        setSelectedImage(null);
        setPosition(50);
        onClose();
    };

    React.useEffect(() => {
        const getUserBanner = async () => {
            try {
                const userInfos = await userService.apiUserGetUserInfoGet();
                if (userInfos.isSuccess && userInfos.data?.profileBanner) {
                    setSelectedImage(userInfos.data.profileBanner);
                }
            } catch (error) {
                console.error('Erro ao carregar banner do usuário:', error);
            }
        };

        if (open) {
            getUserBanner();
        }
    }, [open, userService]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            sx={{
                "& .MuiDialog-paper": { 
                    width: {
                        xs: "95%",
                        sm: "90%",
                        md: "80%",
                        lg: "900px"
                    },
                    maxWidth: "100%", 
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper
                }
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: {
                        xs: "1.1rem",
                        sm: "1.25rem"
                    },
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    pb: 1
                }}
            >
                Posicionar Banner
                <IconButton
                    onClick={handleClose}
                    sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 2 }}>
                <Box 
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3
                    }}
                >
                    <Button 
                        variant="contained" 
                        component="label"
                        sx={{
                            fontSize: {
                                xs: "0.875rem",
                                sm: "1rem"
                            },
                            py: {
                                xs: 1,
                                sm: 1.5
                            },
                            px: {
                                xs: 2,
                                sm: 3
                            },
                            borderRadius: 2,
                            textTransform: 'none'
                        }}
                    >
                        Selecionar Imagem
                        <input 
                            type="file" 
                            hidden 
                            accept="image/*" 
                            onChange={handleFileChange} 
                        />
                    </Button>

                    {selectedImage && (
                        <>
                            <Box
                                sx={{
                                    width: "100%",
                                    height: {
                                        xs: 120,
                                        sm: 150,
                                        md: 180
                                    },
                                    backgroundImage: `url(${selectedImage})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: `center ${position}%`,
                                    borderRadius: 2,
                                    cursor: dragging ? "grabbing" : "grab",
                                    border: `2px solid ${theme.palette.primary.main}`,
                                    transition: 'background-position 0.1s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseDown={handleMouseDown}
                            />
                            <Typography 
                                variant="caption"
                                sx={{
                                    fontSize: {
                                        xs: "0.7rem",
                                        sm: "0.75rem"
                                    },
                                    textAlign: "center",
                                    color: theme.palette.primary.main,
                                    fontWeight: 'bold',
                                    mt: 0.5
                                }}
                            >
                                Preview: altura real do banner no perfil
                            </Typography>
                            <Typography 
                                variant="body2"
                                sx={{
                                    fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.875rem"
                                    },
                                    textAlign: "center",
                                    color: theme.palette.text.secondary,
                                    fontStyle: 'italic'
                                }}
                            >
                                Clique e arraste para ajustar a posição do banner
                            </Typography>
                        </>
                    )}
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2,
                    pt: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    gap: 1
                }}
            >
                <Button 
                    onClick={handleClose} 
                    color="error"
                    variant="outlined"
                    sx={{
                        fontSize: {
                            xs: "0.875rem",
                            sm: "1rem"
                        },
                        minWidth: {
                            xs: "100%",
                            sm: "120px"
                        },
                        borderRadius: 2,
                        textTransform: 'none'
                    }}
                >
                    Cancelar
                </Button>
                <Button 
                    disabled={!selectedImage} 
                    onClick={uploadBanner} 
                    color="primary"
                    variant="contained"
                    sx={{
                        fontSize: {
                            xs: "0.875rem",
                            sm: "1rem"
                        },
                        minWidth: {
                            xs: "100%",
                            sm: "120px"
                        },
                        borderRadius: 2,
                        textTransform: 'none'
                    }}
                >
                    Salvar Banner
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BannerModal;
