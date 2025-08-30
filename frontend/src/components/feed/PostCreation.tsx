import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Avatar,
    Typography,
    IconButton,
    Stack,
    Chip,
    Grid,
    Alert,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Collapse,
} from '@mui/material';
import {
    PhotoCamera,
    Videocam,
    Delete,
    Close,
    Send,
    AttachFile,
    CheckCircle,
} from '@mui/icons-material';
import { signalRService, UploadProgress } from '../../services/signalRService';

interface MediaFile {
    file: File;
    url: string;
    type: 'image' | 'video';
    uploadProgress?: number;
    isUploaded?: boolean;
}

interface PostCreationProps {
    onPostCreated: (post: {
        userId: string;
        userName: string;
        userAvatar?: string;
        content: string;
        photos: string[];
        videos: string[];
    }) => void;
}

const PostCreation: React.FC<PostCreationProps> = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);
    const [currentPostId, setCurrentPostId] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

    const photoInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const MAX_PHOTOS = 10;
    const MAX_VIDEOS = 3;
    const MAX_TOTAL_SIZE = 1 * 1024 * 1024 * 1024; // 1GB in bytes

    const getCurrentUser = () => ({
        id: 'current-user',
        name: 'Usuário Atual',
        avatar: 'https://i.pravatar.cc/150?u=current'
    });

    // Initialize SignalR connection
    useEffect(() => {
        const initSignalR = async () => {
            try {
                const user = getCurrentUser();
                await signalRService.connect(user.id);
            } catch (error) {
                console.error('Failed to connect to SignalR:', error);
            }
        };

        initSignalR();

        return () => {
            if (currentPostId) {
                signalRService.unsubscribeFromUploadProgress(currentPostId);
            }
        };
    }, []);

    // Handle upload progress updates
    const handleUploadProgress = (progress: UploadProgress) => {
        const progressPercentage = (progress.Index / progress.Total) * 100;

        setUploadProgress(prev => ({
            ...prev,
            [`${progress.Type}-${progress.Index}`]: progressPercentage
        }));

        // Update individual file progress
        setMediaFiles(prev => prev.map((file, index) => {
            const fileKey = `${file.type === 'image' ? 'photo' : 'video'}-${index}`;
            if (fileKey === `${progress.Type}-${progress.Index}`) {
                return {
                    ...file,
                    uploadProgress: progressPercentage,
                    isUploaded: progressPercentage === 100
                };
            }
            return file;
        }));
    };

    const validateFiles = (newFiles: File[], type: 'image' | 'video'): string | null => {
        const currentPhotos = mediaFiles.filter(f => f.type === 'image').length;
        const currentVideos = mediaFiles.filter(f => f.type === 'video').length;
        const currentTotalSize = mediaFiles.reduce((sum, f) => sum + f.file.size, 0);

        if (type === 'image' && currentPhotos + newFiles.length > MAX_PHOTOS) {
            return `Máximo de ${MAX_PHOTOS} fotos permitidas`;
        }

        if (type === 'video' && currentVideos + newFiles.length > MAX_VIDEOS) {
            return `Máximo de ${MAX_VIDEOS} vídeos permitidos`;
        }

        const newTotalSize = currentTotalSize + newFiles.reduce((sum, f) => sum + f.size, 0);
        if (newTotalSize > MAX_TOTAL_SIZE) {
            return 'Tamanho total dos arquivos excede 1GB';
        }

        return null;
    };

    const handleFileSelect = (files: FileList | null, type: 'image' | 'video') => {
        if (!files) return;

        const fileArray = Array.from(files);
        const validationError = validateFiles(fileArray, type);

        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);

        const newMediaFiles: MediaFile[] = fileArray.map(file => ({
            file,
            url: URL.createObjectURL(file),
            type
        }));

        setMediaFiles(prev => [...prev, ...newMediaFiles]);
    };

    const removeMedia = (index: number) => {
        setMediaFiles(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].url);
            updated.splice(index, 1);
            return updated;
        });
    };

    const openPreview = (media: MediaFile) => {
        setPreviewMedia(media);
        setPreviewOpen(true);
    };

    const closePreview = () => {
        setPreviewOpen(false);
        setPreviewMedia(null);
    };

    const getTotalSize = () => {
        return mediaFiles.reduce((sum, f) => sum + f.file.size, 0);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSubmit = async () => {
        if (!content.trim() && mediaFiles.length === 0) {
            setError('Adicione um texto ou mídia ao seu post');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const user = getCurrentUser();
            const postId = `post-${Date.now()}`;
            setCurrentPostId(postId);

            // Subscribe to upload progress for this post
            signalRService.subscribeToUploadProgress(postId, handleUploadProgress);

            // Reset progress for all files
            setUploadProgress({});
            setMediaFiles(prev => prev.map(file => ({
                ...file,
                uploadProgress: 0,
                isUploaded: false
            })));

            // Simulate API call with FormData
            const formData = new FormData();
            formData.append('content', content.trim());
            formData.append('userId', user.id);
            formData.append('postId', postId);

            mediaFiles.forEach((media, index) => {
                if (media.type === 'image') {
                    formData.append('photos', media.file);
                } else {
                    formData.append('videos', media.file);
                }
            });

            // Simulate upload with progress (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 3000));

            const photos = mediaFiles.filter(f => f.type === 'image').map(f => f.url);
            const videos = mediaFiles.filter(f => f.type === 'video').map(f => f.url);

            onPostCreated({
                userId: user.id,
                userName: user.name,
                userAvatar: user.avatar,
                content: content.trim(),
                photos,
                videos,
            });

            // Reset form
            setContent('');
            setMediaFiles([]);
            setUploadProgress({});

            // Clear file inputs
            if (photoInputRef.current) photoInputRef.current.value = '';
            if (videoInputRef.current) videoInputRef.current.value = '';

            // Unsubscribe from progress updates
            signalRService.unsubscribeFromUploadProgress(postId);
            setCurrentPostId(null);

        } catch (err) {
            setError('Erro ao publicar post. Tente novamente.');
            if (currentPostId) {
                signalRService.unsubscribeFromUploadProgress(currentPostId);
                setCurrentPostId(null);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const user = getCurrentUser();
    const totalSize = getTotalSize();
    const sizePercentage = (totalSize / MAX_TOTAL_SIZE) * 100;

    return (
        <>
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'white'
                }}
            >
                <Stack spacing={3}>
                    {/* Header */}
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            src={user.avatar}
                            sx={{ width: 48, height: 48 }}
                        />
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                {user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Criar novo post
                            </Typography>
                        </Box>
                    </Box>

                    {/* Content Input */}
                    <TextField
                        multiline
                        rows={4}
                        placeholder="No que você está pensando?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(0,0,0,0.1)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(0,0,0,0.2)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#d32f2f',
                                },
                            },
                        }}
                    />

                    {/* Media Preview */}
                    {mediaFiles.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Mídia Anexada ({mediaFiles.length})
                            </Typography>
                            <Grid container spacing={1}>
                                {mediaFiles.map((media, index) => (
                                    <Grid item xs={6} sm={4} md={3} key={index}>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                borderRadius: 1,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                '&:hover .delete-btn': {
                                                    opacity: 1
                                                }
                                            }}
                                            onClick={() => openPreview(media)}
                                        >
                                            {media.type === 'image' ? (
                                                <img
                                                    src={media.url}
                                                    alt="Preview"
                                                    style={{
                                                        width: '100%',
                                                        height: 120,
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        height: 120,
                                                        bgcolor: 'black',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        position: 'relative'
                                                    }}
                                                >
                                                    <video
                                                        src={media.url}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                    <Videocam
                                                        sx={{
                                                            position: 'absolute',
                                                            color: 'white',
                                                            fontSize: '2rem'
                                                        }}
                                                    />
                                                </Box>
                                            )}

                                            {/* Upload Progress Overlay */}
                                            {isSubmitting && media.uploadProgress !== undefined && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bgcolor: 'rgba(0,0,0,0.8)',
                                                        color: 'white',
                                                        p: 1
                                                    }}
                                                >
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        {media.isUploaded ? (
                                                            <>
                                                                <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                                                                <Typography variant="caption">Enviado</Typography>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Box flex={1}>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={media.uploadProgress}
                                                                        sx={{
                                                                            height: 4,
                                                                            borderRadius: 2,
                                                                            bgcolor: 'rgba(255,255,255,0.2)',
                                                                            '& .MuiLinearProgress-bar': {
                                                                                bgcolor: '#4caf50'
                                                                            }
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Typography variant="caption" sx={{ ml: 1, minWidth: 35 }}>
                                                                    {Math.round(media.uploadProgress)}%
                                                                </Typography>
                                                            </>
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}

                                            <IconButton
                                                className="delete-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeMedia(index);
                                                }}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 4,
                                                    right: 4,
                                                    bgcolor: 'rgba(0,0,0,0.7)',
                                                    color: 'white',
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(0,0,0,0.8)'
                                                    }
                                                }}
                                                size="small"
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {/* File Size Progress */}
                    {totalSize > 0 && (
                        <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="body2" color="text.secondary">
                                    Tamanho total: {formatFileSize(totalSize)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {formatFileSize(MAX_TOTAL_SIZE)}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(sizePercentage, 100)}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor: 'rgba(0,0,0,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: sizePercentage > 90 ? '#f44336' : sizePercentage > 70 ? '#ff9800' : '#4caf50'
                                    }
                                }}
                            />
                        </Box>
                    )}

                    {/* Media Limits Info */}
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip
                            label={`Fotos: ${mediaFiles.filter(f => f.type === 'image').length}/${MAX_PHOTOS}`}
                            size="small"
                            color={mediaFiles.filter(f => f.type === 'image').length >= MAX_PHOTOS ? 'error' : 'default'}
                        />
                        <Chip
                            label={`Vídeos: ${mediaFiles.filter(f => f.type === 'video').length}/${MAX_VIDEOS}`}
                            size="small"
                            color={mediaFiles.filter(f => f.type === 'video').length >= MAX_VIDEOS ? 'error' : 'default'}
                        />
                    </Stack>

                    {/* Error Message */}
                    {error && (
                        <Alert severity="error" sx={{ borderRadius: 1 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Actions */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1}>
                            {/* Photo Upload */}
                            <input
                                ref={photoInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileSelect(e.target.files, 'image')}
                            />
                            <IconButton
                                onClick={() => photoInputRef.current?.click()}
                                disabled={mediaFiles.filter(f => f.type === 'image').length >= MAX_PHOTOS}
                                sx={{
                                    color: '#d32f2f',
                                    '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' }
                                }}
                            >
                                <PhotoCamera />
                            </IconButton>

                            {/* Video Upload */}
                            <input
                                ref={videoInputRef}
                                type="file"
                                accept="video/*"
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileSelect(e.target.files, 'video')}
                            />
                            <IconButton
                                onClick={() => videoInputRef.current?.click()}
                                disabled={mediaFiles.filter(f => f.type === 'video').length >= MAX_VIDEOS}
                                sx={{
                                    color: '#d32f2f',
                                    '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' }
                                }}
                            >
                                <Videocam />
                            </IconButton>
                        </Stack>

                        <Button
                            variant="contained"
                            startIcon={<Send />}
                            onClick={handleSubmit}
                            disabled={isSubmitting || (!content.trim() && mediaFiles.length === 0)}
                            sx={{
                                background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
                                },
                                '&:disabled': {
                                    background: 'rgba(0,0,0,0.12)'
                                }
                            }}
                        >
                            {isSubmitting ? 'Publicando...' : 'Publicar'}
                        </Button>
                    </Box>

                    {/* Upload Progress Summary */}
                    <Collapse in={isSubmitting}>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Enviando arquivos...
                            </Typography>

                            {/* Overall Progress */}
                            <Box sx={{ mb: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="body2">
                                        Progresso geral
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {mediaFiles.filter(f => f.isUploaded).length} / {mediaFiles.length} arquivos
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={mediaFiles.length > 0 ? (mediaFiles.filter(f => f.isUploaded).length / mediaFiles.length) * 100 : 0}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'rgba(0,0,0,0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: '#4caf50',
                                            borderRadius: 4
                                        }
                                    }}
                                />
                            </Box>

                            {/* Individual File Progress */}
                            <Stack spacing={1}>
                                {mediaFiles.map((media, index) => (
                                    <Box key={index} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 1,
                                                    overflow: 'hidden',
                                                    bgcolor: 'grey.300'
                                                }}
                                            >
                                                {media.type === 'image' ? (
                                                    <img
                                                        src={media.url}
                                                        alt="Preview"
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            bgcolor: 'black'
                                                        }}
                                                    >
                                                        <Videocam sx={{ color: 'white', fontSize: 20 }} />
                                                    </Box>
                                                )}
                                            </Box>

                                            <Box flex={1}>
                                                <Typography variant="body2" noWrap>
                                                    {media.file.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatFileSize(media.file.size)}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ minWidth: 100 }}>
                                                {media.isUploaded ? (
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                                                        <Typography variant="caption" color="success.main">
                                                            Enviado
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Box>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={media.uploadProgress || 0}
                                                            sx={{
                                                                height: 4,
                                                                borderRadius: 2,
                                                                mb: 0.5,
                                                                '& .MuiLinearProgress-bar': {
                                                                    bgcolor: '#2196f3'
                                                                }
                                                            }}
                                                        />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {Math.round(media.uploadProgress || 0)}%
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Collapse>
                </Stack>
            </Paper>

            {/* Media Preview Dialog */}
            <Dialog
                open={previewOpen}
                onClose={closePreview}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            Preview da Mídia
                        </Typography>
                        <IconButton onClick={closePreview}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {previewMedia && (
                        <Box textAlign="center">
                            {previewMedia.type === 'image' ? (
                                <img
                                    src={previewMedia.url}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '70vh',
                                        objectFit: 'contain'
                                    }}
                                />
                            ) : (
                                <video
                                    src={previewMedia.url}
                                    controls
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '70vh'
                                    }}
                                />
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePreview}>Fechar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PostCreation;
