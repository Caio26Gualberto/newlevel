import React, { useState, useRef, useEffect, useContext } from 'react';
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
import { signalRService, UploadProgress, UploadCompleted } from '../../services/signalRService';
import { PostApi, PostDto } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';
import { useAuth } from '../../contexts/AuthContext';

interface MediaFile {
    file: File;
    url: string;
    type: 'image' | 'video';
    uploadProgress?: number;
    isUploaded?: boolean;
}

interface PostCreationProps {
    onPostCreated: (post: PostDto) => void;
}
//#TODO: ENTENDER PORQUE O SIGNALR NÃO ESTA ATUALIZANDO O PROGRESSO MESMO RECEBENDO OS EVENTOS
const PostCreation: React.FC<PostCreationProps> = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);
    const [currentPostId, setCurrentPostId] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const postService = new PostApi(ApiConfiguration);
    const { currentUser } = useAuth();

    const photoInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const MAX_PHOTOS = 10;
    const MAX_VIDEOS = 3;
    const MAX_TOTAL_SIZE = 1 * 1024 * 1024 * 1024; // 1GB in bytes

    useEffect(() => {
        const initSignalR = async () => {
            try {
                const user = currentUser;
                await signalRService.connect(user?.id);
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

const handleUploadProgress = (progress: UploadProgress) => {
        console.log('📊 Upload Progress received:', progress);

        // Ensure postId matches current operation
        if (currentPostId && progress.postId !== currentPostId) {
            console.warn('⚠️ Received progress for different postId:', progress.postId, 'Expected:', currentPostId);
            return;
        }

        const progressPercentage = (progress.index / progress.total) * 100;
        console.log(`📈 Progress: ${progress.type} ${progress.index}/${progress.total} (${progressPercentage}%) - File: ${progress.fileName}`);

        setUploadProgress(prev => ({
            ...prev,
            [`${progress.type}-${progress.index}`]: progressPercentage
        }));

        setMediaFiles(prev => {
            console.log('🔍 Updating mediaFiles. Progress event:', progress);
            console.log('📁 Current mediaFiles:', prev.map((f, i) => ({ index: i, type: f.type, name: f.file.name })));
            
            // Find file by name instead of relying on index
            const targetFileIndex = prev.findIndex(file => file.file.name === progress.fileName);
            
            if (targetFileIndex === -1) {
                console.warn(`⚠️ File not found: ${progress.fileName}`);
                return prev;
            }
            
            console.log(`🎯 Found file "${progress.fileName}" at index: ${targetFileIndex}`);
            
            return prev.map((file, index) => {
                if (index === targetFileIndex) {
                    console.log(`✅ Updating file ${index} (${file.file.name}) to ${progressPercentage}%`);
                        return {
                            ...file,
                            uploadProgress: progressPercentage,
                            isUploaded: progressPercentage === 100
                        };
                    }
                return file;
            });
        });
    };

    const handleUploadCompleted = (completed: UploadCompleted) => {
        console.log('✅ Upload completed for post:', completed.postId   , 'Success:', completed.success);
        
        if (completed.success) {
            // Mark all files as uploaded
            setMediaFiles(prev => prev.map(file => ({
                ...file,
                uploadProgress: 100,
                isUploaded: true
            })));
            
            const user = currentUser;
            
            onPostCreated({
                postId: parseInt(completed.postId) || Date.now(),
                content: content.trim(),
                photos: mediaFiles
                    .filter(f => f.type === 'image')
                    .map(f => ({ src: f.url })),
                medias: mediaFiles
                    .filter(f => f.type === 'video')
                    .map(f => ({ src: f.url })),
                createdAt: new Date(),
                likesCount: 0,
                commentsCount: 0,
                comments: null
            });
            
            setTimeout(() => {
                setContent('');
                setMediaFiles([]);
                setUploadProgress({});
                if (photoInputRef.current) photoInputRef.current.value = '';
                if (videoInputRef.current) videoInputRef.current.value = '';
                setIsSubmitting(false);
                
                // Cleanup all subscriptions
                signalRService.clearAllSubscriptions();
                setCurrentPostId(null);
            }, 2000);
        } else {
            setError('Erro durante o upload. Alguns arquivos podem não ter sido enviados.');
            setIsSubmitting(false);
        }
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
            type,
            uploadProgress: 0,
            isUploaded: false
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
            setUploadProgress({});
            setMediaFiles(prev => prev.map(file => ({
                ...file,
                uploadProgress: 0,
                isUploaded: false
            })));

            // Generate postId and set it immediately
            const postId = generateGuid();
            setCurrentPostId(postId);
            
            // Subscribe to SignalR events BEFORE API call
            console.log('🔗 Subscribing to SignalR events for postId:', postId);
            await signalRService.ensureConnected(currentUser?.id);
            await signalRService.subscribeToUploadProgress(postId, handleUploadProgress);
            await signalRService.subscribeToUploadCompleted(postId, handleUploadCompleted);
            
            console.log('✅ SignalR subscriptions ready');
            
            console.log('📤 Calling API to create post...');
            const result = await postService.apiPostCreatePostPost({
                guidSignalR: postId,
                text: content,
                photos: mediaFiles.filter(f => f.type === 'image').map(f => f.file) || [],
                videos: mediaFiles.filter(f => f.type === 'video').map(f => f.file) || []
            });

            console.log('📥 API Response:', result);

            if (!result.isSuccess) {
                console.error('❌ API call failed:', result.message);
                setError(result.message || 'Erro ao criar post');
                setIsSubmitting(false);
                setCurrentPostId(null);
                // Cleanup subscriptions on error
                signalRService.unsubscribeFromUploadProgress(postId);
                signalRService.unsubscribeFromUploadCompleted(postId);
            } else {
                console.log('✅ API call successful, waiting for SignalR events...');
            }
            // If success, the SignalR events will handle the rest

        } catch (err: any) {
            console.error('Error creating post:', err);
            setError(err.message || 'Erro ao publicar post. Tente novamente.');
            setIsSubmitting(false);
            setCurrentPostId(null);
            // Cleanup subscriptions on error
            signalRService.clearAllSubscriptions();
        }
    };

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
                            src={currentUser?.avatarUrl}
                            sx={{ width: 48, height: 48 }}
                        />
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                {currentUser?.name}
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
                                {currentPostId ? 'Enviando arquivos...' : 'Criando post...'}
                            </Typography>

                            {/* Show indeterminate progress if no SignalR events yet */}
                            {!currentPostId ? (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Preparando upload
                                    </Typography>
                                    <LinearProgress
                                        variant="indeterminate"
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: 'rgba(0,0,0,0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: '#2196f3',
                                                borderRadius: 4
                                            }
                                        }}
                                    />
                                </Box>
                            ) : (
                                /* Overall Progress */
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
                            )}

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

function generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  