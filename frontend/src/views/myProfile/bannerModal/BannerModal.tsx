import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Slider, Typography } from "@mui/material";
import { UserApi, UserInfoResponseDto } from "../../../gen/api/src";
import ApiConfiguration from "../../../apiConfig";

interface BannerModalProps {
    open: boolean;
    onClose: () => void;
}

const BannerModal: React.FC<BannerModalProps> = ({ open, onClose }) => {
    const [image, setImage] = useState<File | null>(null);
    const [position, setPosition] = useState(50);
    const [dragging, setDragging] = useState(false);
    const startYRef = React.useRef(0);
    const startPositionRef = React.useRef(50);
    const [selectedImage, setSelectedImage] = useState<string | null | undefined>();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        setImageState(files)
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
    }

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

    async function uploadBanner() {
        const userApi = new UserApi(ApiConfiguration)
        const result = await userApi.apiUserUploadBannerImagePost({
            file: image!,
            position: Math.floor(position)
        })

        if (result.isSuccess) {
            toastr.success(result.message!, 'Sucesso!', {
                timeOut: 3000,
                progressBar: true,
                positionClass: "toast-bottom-right"
            });
        } else {
            toastr.error(result.message!, 'Erro!', {
                timeOut: 3000,
                progressBar: true,
                positionClass: "toast-bottom-right"
            });
        }
    }

    const handleClose = () => {
        setImage(null)
        setSelectedImage(null)
        onClose()
    }

    React.useEffect(() => {
        const userInformations = async () => {
            const userApi = new UserApi(ApiConfiguration)
            const userInfos = await userApi.apiUserGetUserInfoGet();

            if (userInfos.isSuccess) {
                setSelectedImage(userInfos.data?.profileBanner)
            } else {
                toastr.error(userInfos.message!, '', { timeOut: 3000, positionClass: "toast-bottom-right" });
            }
             
        }

        userInformations();
    }
        , []);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            sx={{
                "& .MuiDialog-paper": { width: "1337px", maxWidth: "100%", borderRadius: 3 }
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <DialogTitle>Posicionar Banner</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Button variant="contained" component="label">
                        Selecionar Imagem
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </Button>

                    {selectedImage && (
                        <>
                            <Box
                                sx={{
                                    width: "100%",
                                    height: 417,
                                    backgroundImage: `url(${selectedImage})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: `center ${position}%`,
                                    borderRadius: 2,
                                    cursor: "grab",
                                }}
                                onMouseDown={handleMouseDown}
                            />
                            <Typography variant="body2">Ajustar posição com o cursor </Typography>
                        </>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error">Cancelar</Button>
                <Button disabled={selectedImage == null} onClick={() => { uploadBanner(); handleClose(); }} color="primary">
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BannerModal;
