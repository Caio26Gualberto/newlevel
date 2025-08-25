import React from "react";
import ApiConfiguration from "../../../../apiConfig";
import { useState } from "react";
import NewLevelModal from "../../../../components/NewLevelModal"
import NewLevelModalHeader from "../../../../components/NewLevelModalHeader";
import { Box, Button, DialogContent, TextField, Typography, useTheme, useMediaQuery } from "@mui/material";
import NewLevelButton from "../../../../components/NewLevelButton";
import * as toastr from 'toastr';
import { PhotoApi } from "../../../../gen/api/src/apis/PhotoApi";
import NewLevelLoading from "../../../../components/NewLevelLoading";

interface AddNewPhotoModalProps {
    open: boolean;
    onClose: () => void;
}

const AddNewPhotoModal: React.FC<AddNewPhotoModalProps> = ({ open, onClose }) => {
    const photoService = new PhotoApi(ApiConfiguration);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [form, setForm] = useState({
        title: '',
        subtitle: '',
        description: '',
        date: ''
    });

    const handleButtonClick = () => {
        document.getElementById('fileInput')!.click();
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Remove caracteres não numéricos
        value = value.replace(/\D/g, '');

        // Limita o comprimento máximo do valor
        if (value.length > 8) {
            value = value.substr(0, 8);
        }

        // Insere a máscara dd/MM/yyyy
        if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d)/, '$1/$2');
        }
        if (value.length > 5) {
            value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
        }

        // Atualiza o estado
        setForm({ ...form, date: value });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedImage(files[0]);
        }
    };

    const resetForm = () => {
        setForm({
            title: '',
            subtitle: '',
            description: '',
            date: ''
        });
        setSelectedImage(null);
    }

    const handleUploadImage = async () => {
        if (selectedImage) {
            setLoading(true)
            const [day, month, year] = form.date.split('/').map(Number);
            const dateObject = new Date(year, month - 1, day)
            const resultPhoto = await photoService.apiPhotoUploadPhotoPost({
                title: form.title,
                subtitle: form.subtitle,
                description: form.description,
                takeAt: dateObject.toISOString(),
                file: selectedImage
            })

            if (resultPhoto.isSuccess) {
                toastr.success(resultPhoto.message!, 'Sucesso!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
                resetForm();
                setLoading(false);
                onClose();
            } else {
                toastr.error(resultPhoto.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
                resetForm();
                setLoading(false);
                onClose();
            }
        } else {
            toastr.warning('Selecione uma imagem para enviar!', 'Atenção!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
        }
    };
    return (
        <NewLevelModal
            open={open}
            onClose={onClose}
            width={isMobile ? '90%' : 1000}
            height="auto"
        >
            <>
                <NewLevelLoading isLoading={loading} />
                <NewLevelModalHeader closeModal={() => { setSelectedImage(null); onClose() }} title="Requisitar Nova Foto" />
                <Box width="100%" overflow="auto" maxHeight={isMobile ? '60vh' : '600px'} p={isMobile ? 1 : 3}>
                    <DialogContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: isMobile ? 1 : 2
                        }}
                    >
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Título da foto"
                            type="text"
                            fullWidth
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Subtítulo da foto"
                            type="text"
                            fullWidth
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                        />
                        <TextField
                            placeholder="Descrição da foto"
                            margin="dense"
                            autoFocus
                            fullWidth
                            multiline
                            rows={isMobile ? 4 : 6}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <TextField
                                margin="dense"
                                id="date"
                                label="Data da foto (Aproximadamente)"
                                type="text"
                                sx={{ width: isMobile ? '100%' : '30%' }}
                                value={form.date}
                                onChange={handleDateChange}
                            />
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Box mb={2}>
                                <Typography variant="h6" textAlign="center">Upload de Imagem</Typography>
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                                <Button onClick={handleButtonClick} sx={{ mt: 1 }}>
                                    Selecionar imagem
                                </Button>
                                <Typography fontWeight="bold" mt={1}>{selectedImage?.name}</Typography>
                            </Box>
                        </Box>
                        <Box mt={1} width="100%">
                            <NewLevelButton title="Enviar" onClick={handleUploadImage} maxWidth />
                        </Box>
                    </DialogContent>
                </Box>
            </>
        </NewLevelModal>
    );
}

export default AddNewPhotoModal
