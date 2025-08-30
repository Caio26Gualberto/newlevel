import React, { useState } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  IconButton,
  Button,
  Stack,
  Grid,
  Collapse,
  TextField,
  Divider,
  Chip,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  MoreVert,
  Send,
  ExpandMore,
  ExpandLess,
  PlayArrow,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  photos: string[];
  videos: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const handleLike = () => {
    onLike(post.id);
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share post:', post.id);
  };

  const handleSendComment = () => {
    if (newComment.trim()) {
      // Implement comment submission
      console.log('New comment:', newComment);
      setNewComment('');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR
      });
    } catch {
      return 'agora';
    }
  };

  const renderMediaGrid = () => {
    const totalMedia = post.photos.length + post.videos.length;
    if (totalMedia === 0) return null;

    const displayPhotos = showAllPhotos ? post.photos : post.photos.slice(0, 4);
    const remainingCount = post.photos.length - 4;

    return (
      <Box sx={{ mt: 2 }}>
        {/* Photos Grid */}
        {post.photos.length > 0 && (
          <Grid container spacing={1} sx={{ mb: post.videos.length > 0 ? 2 : 0 }}>
            {displayPhotos.map((photo, index) => (
              <Grid 
                item 
                xs={post.photos.length === 1 ? 12 : 6} 
                sm={post.photos.length === 1 ? 12 : post.photos.length === 2 ? 6 : 4}
                key={index}
              >
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      transition: 'transform 0.2s'
                    }
                  }}
                >
                  <img
                    src={photo}
                    alt={`Post image ${index + 1}`}
                    style={{
                      width: '100%',
                      height: post.photos.length === 1 ? 400 : 200,
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* Show remaining count overlay on last visible photo */}
                  {!showAllPhotos && index === 3 && remainingCount > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                      onClick={() => setShowAllPhotos(true)}
                    >
                      <Typography variant="h4" fontWeight="bold">
                        +{remainingCount}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Show More/Less Photos Button */}
        {post.photos.length > 4 && (
          <Button
            size="small"
            onClick={() => setShowAllPhotos(!showAllPhotos)}
            sx={{ mb: 2, color: '#d32f2f' }}
          >
            {showAllPhotos ? (
              <>
                <ExpandLess sx={{ mr: 1 }} />
                Mostrar menos
              </>
            ) : (
              <>
                <ExpandMore sx={{ mr: 1 }} />
                Ver todas as {post.photos.length} fotos
              </>
            )}
          </Button>
        )}

        {/* Videos */}
        {post.videos.length > 0 && (
          <Grid container spacing={1}>
            {post.videos.map((video, index) => (
              <Grid item xs={12} sm={post.videos.length === 1 ? 12 : 6} key={index}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 1,
                    overflow: 'hidden',
                    bgcolor: 'black'
                  }}
                >
                  <video
                    src={video}
                    controls
                    style={{
                      width: '100%',
                      height: 300,
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'white'
      }}
    >
      {/* Post Header */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={post.userAvatar}
            sx={{ width: 48, height: 48 }}
          >
            {post.userName.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              {post.userName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatTimeAgo(post.createdAt)}
            </Typography>
          </Box>

          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Stack>
      </Box>

      {/* Post Content */}
      {post.content && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {post.content}
          </Typography>
        </Box>
      )}

      {/* Media Content */}
      <Box sx={{ px: 2 }}>
        {renderMediaGrid()}
      </Box>

      {/* Engagement Stats */}
      {(post.likesCount > 0 || post.commentsCount > 0) && (
        <Box sx={{ px: 2, py: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2}>
              {post.likesCount > 0 && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Favorite sx={{ fontSize: 16, color: '#d32f2f' }} />
                  <Typography variant="body2" color="text.secondary">
                    {post.likesCount}
                  </Typography>
                </Stack>
              )}
            </Stack>
            
            {post.commentsCount > 0 && (
              <Typography variant="body2" color="text.secondary">
                {post.commentsCount} comentário{post.commentsCount !== 1 ? 's' : ''}
              </Typography>
            )}
          </Stack>
        </Box>
      )}

      <Divider />

      {/* Action Buttons */}
      <Box sx={{ px: 2, py: 1 }}>
        <Stack direction="row" justifyContent="space-around">
          <Button
            startIcon={post.isLiked ? <Favorite /> : <FavoriteBorder />}
            onClick={handleLike}
            sx={{
              color: post.isLiked ? '#d32f2f' : 'text.secondary',
              textTransform: 'none',
              fontWeight: post.isLiked ? 'bold' : 'normal',
              '&:hover': {
                bgcolor: 'rgba(211, 47, 47, 0.1)'
              }
            }}
          >
            Curtir
          </Button>

          <Button
            startIcon={<ChatBubbleOutline />}
            onClick={handleComment}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Comentar
          </Button>

          <Button
            startIcon={<Share />}
            onClick={handleShare}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Compartilhar
          </Button>
        </Stack>
      </Box>

      {/* Comments Section */}
      <Collapse in={showComments}>
        <Divider />
        <Box sx={{ p: 2 }}>
          {/* Comment Input */}
          <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              U
            </Avatar>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Escreva um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: '#f5f5f5',
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
            <IconButton
              onClick={handleSendComment}
              disabled={!newComment.trim()}
              sx={{
                color: '#d32f2f',
                '&:disabled': {
                  color: 'rgba(0,0,0,0.26)'
                }
              }}
            >
              <Send />
            </IconButton>
          </Stack>

          {/* Sample Comments */}
          <Stack spacing={2}>
            {[1, 2].map((commentId) => (
              <Stack key={commentId} direction="row" spacing={2}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {commentId}
                </Avatar>
                <Box
                  sx={{
                    bgcolor: '#f5f5f5',
                    borderRadius: 2,
                    p: 1.5,
                    flex: 1
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    Usuário {commentId}
                  </Typography>
                  <Typography variant="body2">
                    Este é um comentário de exemplo para demonstrar a funcionalidade.
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    há 2 horas
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PostCard;
