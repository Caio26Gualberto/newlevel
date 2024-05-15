import ApiConfiguration from "../../../../apiConfig";
import { PhotoApi } from "../../../../gen/api/src";
import { useState } from "react";
import NewLevelModal from "../../../../components/NewLevelModal"
import NewLevelModalHeader from "../../../../components/NewLevelModalHeader";
import { Box, Button, DialogContent, TextField, Typography } from "@mui/material";
import NewLevelButton from "../../../../components/NewLevelButton";
import * as toastr from 'toastr';

interface AddNewPhotoModalProps {
    open: boolean;
    onClose: () => void;
}

const AddNewPhotoModal: React.FC<AddNewPhotoModalProps> = ({ open, onClose }) => {
    const photoService = new PhotoApi(ApiConfiguration);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [form, setForm] = useState({
        title: '',
        subtitle: '',
        description: ''
    });

    const handleButtonClick = () => {
        document.getElementById('fileInput')!.click();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedImage(files[0]);
        }
    };

    const handleUploadImage = async () => {
        if (selectedImage) {
            const resultPhoto = await photoService.apiPhotoUploadPhotoPost({
                title: form.title,
                file: selectedImage,
                subtitle: form.subtitle,
                description: form.description
            })

            if (resultPhoto.isSuccess) {
                toastr.success(resultPhoto.message!, 'Sucesso!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
            } else {
                toastr.error(resultPhoto.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
            }
        } else {
            toastr.warning('Selecione uma imagem para enviar!', 'Atenção!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
        }
    };
    return (
        <NewLevelModal height="auto" open={open} width={1000}>
            <>
                <NewLevelModalHeader closeModal={() => { setSelectedImage(null); onClose() }} title="Requisitar Nova Foto" />
                <Box width="100%" overflow="auto" maxHeight="600px">
                    <DialogContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Título da foto"
                            type="text"
                            fullWidth
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        ></TextField>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Subtítulo da foto"
                            type="text"
                            fullWidth
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                        ></TextField>
                        <TextField
                            placeholder="Descrição da foto"
                            margin="dense"
                            autoFocus
                            fullWidth
                            multiline
                            rows={6}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        ></TextField>
                        <Box display="flex" justifyContent="center">
                            <Box mb={2}>
                                <Box display="flex" justifyContent="center" mb={2}>
                                    <h2>Upload de Imagem</h2>
                                </Box>
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                                <Box display="flex" ml={2.5}>
                                    <Button onClick={handleButtonClick}>Selecionar imagem</Button>
                                    {<Typography fontWeight="bold" mt={0.5}>{selectedImage?.name}</Typography>}
                                </Box>
                            </Box>
                        </Box>
                        <Box mt={1} width="100%">
                            <NewLevelButton title="Enviar" onClick={handleUploadImage} maxWidth />
                        </Box>
                    </DialogContent>

                </Box>

            </>
        </NewLevelModal>
    )
}

export default AddNewPhotoModal
