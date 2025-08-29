import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress, Paper, Divider, Button, TextField, Avatar, Grid, Card, CardMedia, Chip, Stack, Fade, useTheme, useMediaQuery } from '@mui/material';
import { LocationOn as LocationOnIcon, AttachMoney as AttachMoneyIcon, CalendarToday as CalendarTodayIcon, ArrowBack as ArrowBackIcon, Share as ShareIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import { EventApi, CommentApi, EventResponseDto, CommentsListDto, ReceiveCommentDto, CommonApi, SelectOptionDto, EMusicGenres } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';
import { useAuth } from '../../contexts/AuthContext';
import toastr from 'toastr';

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();
  const eventService = new EventApi(ApiConfiguration);
  const commentService = new CommentApi(ApiConfiguration);
  const commonService = new CommonApi(ApiConfiguration);

  const [event, setEvent] = useState<EventResponseDto | null>(null);
  const [comments, setComments] = useState<CommentsListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentPage, setCommentPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [genres, setGenres] = useState<SelectOptionDto[]>([]);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      fetchComments();
    }
    fetchGenres();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
            const response = await eventService.apiEventGet({ eventId: parseInt(eventId!) });
      if (response.isSuccess) {
        setEvent(response.data || null);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      toastr.error('Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await commonService.apiCommonGetDisplayMusicGenresGet();
      if (response.isSuccess) {
        setGenres(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
      toastr.error('Failed to load genres.');
    }
  };

  const fetchComments = async (page = 0) => {
    try {
            const response = await commentService.apiCommentGetCommentsByEventIdGet({ eventId: parseInt(eventId!), page: page, pageSize: 5 });
                  if (response.isSuccess && response.data?.comments) {
        const fetchedComments = response.data.comments || [];
        setComments(prev => page === 0 ? fetchedComments : [...prev, ...fetchedComments]);
        setHasMoreComments(fetchedComments.length === 5);
        setCommentPage(page);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLoadMoreComments = () => {
    fetchComments(commentPage + 1);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
                        const commentData: ReceiveCommentDto = {
        text: newComment,
        mediaId: null,
        photoId: null,
        eventId: parseInt(eventId!)
      };

      const response = await commentService.apiCommentSaveCommentPost({ 
        receiveCommentDto: commentData
      });
      if (response.isSuccess) {
        setNewComment('');
        fetchComments(); // Refresh comments
        toastr.success('Comment posted successfully!');
      } else {
        toastr.error(response.message || 'Failed to post comment.');
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toastr.error('An error occurred while posting the comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (!event) {
    return <Typography>Event not found.</Typography>;
  }

  return (
    <Fade in timeout={600}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        {/* Header with Back Button */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #d32f2f 0%, #ff6b6b 100%)',
            color: 'white',
            py: 2
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Voltar
              </Button>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Detalhes do Evento
              </Typography>
              <Button
                startIcon={<ShareIcon />}
                sx={{ 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Compartilhar
              </Button>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper 
            elevation={8} 
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }}
          >
                    {/* Hero Banner */}
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height={isMobile ? "300" : "500"}
                image={event.bannerUrl ? event.bannerUrl : undefined}
                alt={event.title ?? ''}
                sx={{ 
                  display: event.bannerUrl ? 'block' : 'none',
                  objectFit: 'cover'
                }}
              />
              {!event.bannerUrl && (
                <Box
                  sx={{
                    height: isMobile ? 300 : 500,
                    background: 'linear-gradient(135deg, #d32f2f 0%, #ff6b6b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h2" sx={{ color: 'white', opacity: 0.7 }}>
                    🎵
                  </Typography>
                </Box>
              )}
              
              {/* Gradient Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  display: 'flex',
                  alignItems: 'flex-end',
                  p: 4
                }}
              >
                <Box>
                  <Typography 
                    variant={isMobile ? "h4" : "h2"} 
                    sx={{ 
                      color: 'white',
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      mb: 1
                    }}
                  >
                    {event.title}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    Por: {event.organizerName}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* Content */}
            <Box sx={{ p: 4 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  color: 'text.primary',
                  mb: 4
                }}
              >
                {event.description}
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={4} 
              sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(211, 47, 47, 0.1)'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  pb: 1,
                  mb: 2
                }}
              >
                Detalhes
              </Typography>
              <Stack spacing={1.5}>
                {event.dateStart && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                    <Typography>
                      {new Date(event.dateStart).toLocaleDateString()} {event.dateEnd ? `- ${new Date(event.dateEnd).toLocaleDateString()}` : ''}
                    </Typography>
                  </Box>
                )}
                {event.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                    <Typography>{event.location}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoneyIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                  <Typography>{event.price != null ? `${event.price.toFixed(2)}` : 'Free'}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          {event.genre && event.genre.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    color: 'primary.main',
                    fontWeight: 'bold',
                    borderBottom: '2px solid',
                    borderColor: 'primary.main',
                    pb: 1,
                    mb: 2
                  }}
                >
                  Gêneros
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {genres.filter(g => event.genre?.includes(g.value as EMusicGenres)).map(g => (
                    <Chip 
                      key={g.value} 
                      label={g.name}
                      sx={{
                        background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
                        color: 'white',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
              
              <Divider 
                sx={{ 
                  my: 4,
                  borderColor: 'primary.main',
                  borderWidth: 1
                }} 
              />

              {/* Comments Section */}
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  borderBottom: '3px solid',
                  borderColor: 'primary.main',
                  pb: 1,
                  mb: 3
                }}
              >
                Comentários
              </Typography>
        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
            <Avatar src={currentUser.avatarUrl || ''} sx={{ mr: 2 }} />
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button 
              onClick={handlePostComment} 
              disabled={submittingComment} 
              variant="contained" 
              sx={{ 
                ml: 2,
                background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)'
                },
                '&:disabled': {
                  background: 'grey.400'
                }
              }}
            >
              {submittingComment ? 'Enviando...' : 'Comentar'}
            </Button>
          </Box>
        )}

        <Grid container spacing={2}>
          {comments.map(comment => (
                        <Grid item xs={12} key={`${comment.userName}-${comment.dateOfComment}`}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  width: '100%',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid rgba(211, 47, 47, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[6]
                  }
                }}
              >
                <Avatar src={comment.userAvatarSrc || ''} sx={{ mr: 2, mt: 0.5 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" component="strong">{comment.userName}</Typography>
                    {comment.dateOfComment && (
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.dateOfComment).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{comment.comment}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {hasMoreComments && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button 
              onClick={handleLoadMoreComments}
              variant="outlined"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  background: 'primary.main',
                  color: 'white'
                }
              }}
            >
              Carregar Mais Comentários
            </Button>
          </Box>
        )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Fade>
  );
};

export default EventDetail;
