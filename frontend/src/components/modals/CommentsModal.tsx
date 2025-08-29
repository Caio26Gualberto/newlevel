import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Stack,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { CommentApi, CommentsPhotoResponseDto, ReceiveCommentDto } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';
import * as toastr from 'toastr';

interface CommentsModalProps {
  open: boolean;
  onClose: () => void;
  photoId?: number;
  mediaId?: number;
  eventId?: number;
  title?: string;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ 
  open, 
  onClose, 
  photoId, 
  mediaId, 
  eventId,
  title 
}) => {
  const commentService = new CommentApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState<CommentsPhotoResponseDto>({ 
    comments: [], 
    title: "" 
  });
  const [newComment, setNewComment] = useState("");
  const [pagination] = useState({
    page: 1,
    pageCount: 50,
    pageSize: 50,
    search: ""
  });

  const getEventComments = async () => {
    try {
      setLoading(true);
      const result = await commentService.apiCommentGetCommentsByEventIdGet({
        eventId: eventId,
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: pagination.search
      });

      if (result.isSuccess) {
        setComments(result.data!);
      } else {
        toastr.error(result.message!, 'Erro!', { 
          timeOut: 3000, 
          progressBar: true, 
          positionClass: "toast-bottom-right" 
        });
      }
    } catch (error) {
      toastr.error('Erro ao carregar comentários', 'Erro!', { 
        timeOut: 3000, 
        progressBar: true, 
        positionClass: "toast-bottom-right" 
      });
    } finally {
      setLoading(false);
    }
  };

  const getPhotoComments = async () => {
    try {
      setLoading(true);
      const result = await commentService.apiCommentGetCommentsByPhotoIdGet({
        photoId: photoId,
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: pagination.search
      });

      if (result.isSuccess) {
        setComments(result.data!);
      } else {
        toastr.error(result.message!, 'Erro!', { 
          timeOut: 3000, 
          progressBar: true, 
          positionClass: "toast-bottom-right" 
        });
      }
    } catch (error) {
      toastr.error('Erro ao carregar comentários', 'Erro!', { 
        timeOut: 3000, 
        progressBar: true, 
        positionClass: "toast-bottom-right" 
      });
    } finally {
      setLoading(false);
    }
  };

  const getMediaComments = async () => {
    try {
      setLoading(true);
      const result = await commentService.apiCommentGetCommentsByMediaIdGet({
        mediaId: mediaId,
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: pagination.search
      });

      if (result.isSuccess) {
        setComments(result.data!);
      } else {
        toastr.error(result.message!, 'Erro!', { 
          timeOut: 3000, 
          progressBar: true, 
          positionClass: "toast-bottom-right" 
        });
      }
    } catch (error) {
      toastr.error('Erro ao carregar comentários', 'Erro!', { 
        timeOut: 3000, 
        progressBar: true, 
        positionClass: "toast-bottom-right" 
      });
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) {
      toastr.warning('Digite um comentário antes de enviar', 'Atenção!', { 
        timeOut: 3000, 
        progressBar: true, 
        positionClass: "toast-bottom-right" 
      });
      return;
    }

    try {
      setSubmitting(true);
      let payload: ReceiveCommentDto;
      switch (true) {
        case !!photoId:
          payload = { photoId, text: newComment.trim() };
          break;  
        case !!mediaId:
          payload = { mediaId, text: newComment.trim() };
          break;     
        case !!eventId:
          payload = { eventId, text: newComment.trim() };
          break; 
        default:
          toastr.error("Nenhum identificador válido foi fornecido. se o problema persistir entre em contato com o desenvolvedor", 'Erro!', { 
            timeOut: 3000, 
            progressBar: true, 
            positionClass: "toast-bottom-right" 
          });
          return;
      }

      const result = await commentService.apiCommentSaveCommentPost({
        receiveCommentDto: payload
      });

      if (result.isSuccess) {
        setNewComment("");
        toastr.success('Comentário adicionado com sucesso!', 'Sucesso!', { 
          timeOut: 3000, 
          progressBar: true, 
          positionClass: "toast-bottom-right" 
        });
        
        // Refresh comments
        if (photoId) {
          await getPhotoComments();
        } else if (mediaId) {
          await getMediaComments();
        } else if (eventId) {
          await getEventComments();
        }
      } else {
        toastr.error(result.message!, 'Erro!', { 
          timeOut: 3000, 
          progressBar: true, 
          positionClass: "toast-bottom-right" 
        });
      }
    } catch (error) {
      toastr.error('Erro ao adicionar comentário', 'Erro!', { 
        timeOut: 3000, 
        progressBar: true, 
        positionClass: "toast-bottom-right" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      addComment();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  useEffect(() => {
    if (open) {
      if (photoId) {
        getPhotoComments();
      } else if (mediaId) {
        getMediaComments();
      } else if (eventId) {
        getEventComments();
      }
    }
  }, [open, photoId, mediaId]);

  const renderCommentSkeleton = () => (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item>
          <CircularProgress size={40} />
        </Grid>
        <Grid item xs>
          <Box sx={{ width: '60%', height: 20, bgcolor: 'grey.300', borderRadius: 1, mb: 1 }} />
          <Box sx={{ width: '100%', height: 16, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
          <Box sx={{ width: '40%', height: 12, bgcolor: 'grey.200', borderRadius: 1 }} />
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          maxHeight: isMobile ? '100vh' : '80vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #ff6b6b 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <CommentIcon />
          <Typography variant="h6" fontWeight="bold">
            Comentários
          </Typography>
          {comments.comments && comments.comments.length > 0 && (
            <Chip 
              label={comments.comments.length} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
          )}
        </Stack>
        
        <IconButton
          onClick={onClose}
          sx={{ 
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Title Section */}
        {(title || comments.title) && (
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              {title || comments.title}
            </Typography>
          </Box>
        )}

        {/* Comments List */}
        <Box 
          sx={{ 
            p: 2, 
            maxHeight: isMobile ? 'calc(100vh - 200px)' : '400px',
            overflowY: 'auto'
          }}
        >
          {loading ? (
            <Box>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>{renderCommentSkeleton()}</div>
              ))}
            </Box>
          ) : comments.comments && comments.comments.length > 0 ? (
            <Stack spacing={2}>
              {comments.comments.map((comment, index) => (
                <Fade in timeout={300 + index * 100} key={index}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        elevation: 4,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item>
                        <Avatar 
                          src={comment.userAvatarSrc!} 
                          alt={comment.userName!}
                          sx={{ 
                            width: 48, 
                            height: 48,
                            border: '2px solid',
                            borderColor: 'primary.main'
                          }}
                        >
                          {!comment.userAvatarSrc && (
                            <PersonIcon />
                          )}
                        </Avatar>
                      </Grid>
                      <Grid item xs>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight="bold" 
                          color="primary.main"
                          gutterBottom
                        >
                          {comment.userName}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            mb: 1,
                            lineHeight: 1.6,
                            wordBreak: 'break-word'
                          }}
                        >
                          {comment.comment}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontStyle: 'italic' }}
                        >
                          {comment.dateOfComment && formatDate(comment.dateOfComment)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Fade>
              ))}
            </Stack>
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 6,
                color: 'text.secondary'
              }}
            >
              <CommentIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" gutterBottom>
                Nenhum comentário ainda
              </Typography>
              <Typography variant="body2">
                Seja o primeiro a comentar!
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          spacing={2} 
          sx={{ width: '100%' }}
        >
          <TextField
            fullWidth
            multiline
            rows={isMobile ? 2 : 1}
            placeholder="Escreva seu comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={submitting}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper'
              }
            }}
          />
          <Button
            variant="contained"
            onClick={addComment}
            disabled={submitting || !newComment.trim()}
            startIcon={submitting ? <CircularProgress size={16} /> : <SendIcon />}
            sx={{
              minWidth: isMobile ? '100%' : 120,
              height: isMobile ? 48 : 'auto',
              borderRadius: 2,
              background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
              },
              '&:disabled': {
                background: 'grey.300'
              }
            }}
          >
            {submitting ? 'Enviando...' : 'Publicar'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default CommentsModal;
