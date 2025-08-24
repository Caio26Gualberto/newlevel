import { TextField, Button, Box, useTheme, useMediaQuery } from "@mui/material";
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
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
            toastr.success(result.message!, 'Sucesso', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
        } else {
            toastr.error(result.message!, 'Erro', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
        }
        setTituloVideo('');
        setUrlVideo('');
        setDescricaoVideo('');
        onClose();
    };

    return (
        <NewLevelModal
            width={isMobile ? '100%' : 900}
            height={isMobile ? '100%' : '40%'}
            open={open}
            onClose={onClose}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    p: {
                        xs: 2,
                        sm: 2,
                        md: 3
                    }
                }}
            >
                <NewLevelModalHeader closeModal={onClose} title="Adicione um vídeo" />
                
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        gap: 2,
                        mt: 2
                    }}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        id="titulo"
                        label="Título do vídeo"
                        type="text"
                        fullWidth
                        value={tituloVideo}
                        onChange={handleTituloChange}
                        sx={{
                            '& .MuiInputLabel-root': {
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                }
                            },
                            '& .MuiInputBase-input': {
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                }
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="url"
                        label="URL do vídeo"
                        type="text"
                        fullWidth
                        value={urlVideo}
                        onChange={handleUrlChange}
                        sx={{
                            '& .MuiInputLabel-root': {
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                }
                            },
                            '& .MuiInputBase-input': {
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                }
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="descricao"
                        label="Descrição do vídeo"
                        type="text"
                        fullWidth
                        multiline
                        rows={isSmallMobile ? 3 : 4}
                        value={descricaoVideo}
                        onChange={handleDescricaoChange}
                        sx={{
                            '& .MuiInputLabel-root': {
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                }
                            },
                            '& .MuiInputBase-input': {
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                }
                            }
                        }}
                    />
                    
                    <Box 
                        sx={{
                            width: "100%",
                            mt: 'auto',
                            pt: 2
                        }}
                    >
                        <Button
                            fullWidth
                            sx={{
                                backgroundColor: '#b81414',
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                },
                                py: {
                                    xs: 1,
                                    sm: 1.5
                                },
                                '&:hover': {
                                    backgroundColor: 'white',
                                },
                                color: 'black',
                            }}
                            onClick={handleSubmit}
                        >
                            Enviar
                        </Button>
                    </Box>
                </Box>
            </Box>
        </NewLevelModal>
    );
}

export default AddVideoModal
