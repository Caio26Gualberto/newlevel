import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box } from "@mui/material";
import NewLevelModal from "../../../../components/NewLevelModal";
import NewLevelModalHeader from "../../../../components/NewLevelModalHeader";
import { ChangeEvent, useState } from "react";
import { MediaApi } from "../../../../gen/api/src";
import * as toastr from 'toastr';
import ApiConfiguration from "../../../../apiConfig";

interface AddVideoModalProps {
    open: boolean;
    onClose: () => void;
}

const AddVideoModal: React.FC<AddVideoModalProps> = ({ open, onClose }) => {
    const mediaService = new MediaApi(ApiConfiguration);
    const [tituloVideo, setTituloVideo] = useState<string>('');
    const [urlVideo, setUrlVideo] = useState<string>('');
    const [descricaoVideo, setDescricaoVideo] = useState<string>('');

    const handleTituloChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTituloVideo(event.target.value);
    };

    const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUrlVideo(event.target.value);
    };

    const handleDescricaoChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDescricaoVideo(event.target.value);
    };

    const handleSubmit = async () => {
        const result = await mediaService.apiMediaRequestMediaPost({
            requestMediaDto: {
                src: urlVideo,
                title: tituloVideo,
                description: descricaoVideo,
            }
        })

        if (result.isSuccess) {
            toastr.success(result.message!, 'Sucesso', { timeOut: 3000 , progressBar: true, positionClass: "toast-bottom-right"});
        } else { 
            toastr.error(result.message!, 'Erro', { timeOut: 3000 , progressBar: true, positionClass: "toast-bottom-right"});    
        }
        setTituloVideo('');
        setUrlVideo('');
        setDescricaoVideo('');
        onClose();
    };

    return (
        <NewLevelModal width={900} height="40%" open={open} onClose={onClose}>
            <>
                <NewLevelModalHeader closeModal={onClose} title="Adicione um vídeo" />
                <Box>
                    <Box width="100%">
                        <DialogContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Título do vídeo"
                                type="text"
                                fullWidth
                                value={tituloVideo}
                                onChange={handleTituloChange}
                            ></TextField>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="URL do vídeo"
                                type="text"
                                fullWidth
                                value={urlVideo}
                                onChange={handleUrlChange}
                            ></TextField>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Descrição do vídeo"
                                type="text"
                                fullWidth
                                value={descricaoVideo}
                                onChange={handleDescricaoChange}
                            ></TextField>
                            <Box mt={1} width="100%">
                                <Button fullWidth sx={{ backgroundColor: "#b81414", "&:hover": { backgroundColor: "white" }, color: "black" }} onClick={() => handleSubmit()}>Enviar</Button>
                            </Box>
                        </DialogContent>
                    </Box>
                </Box>
            </>
        </NewLevelModal>
    );
}

export default AddVideoModal
