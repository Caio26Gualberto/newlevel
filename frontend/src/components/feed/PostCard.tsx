import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  IconButton,
  Button,
  Grid,
  TextField,
  Collapse,
  Divider,
  Dialog,
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
  Close,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CommentApi, CommentsListDto , PostDto, LikeApi, ETargetType } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';
import { useAuth } from '../../contexts/AuthContext';
import toastr from 'toastr';

interface PostCardProps {
  post: PostDto;
  onLike: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [comments, setComments] = useState<CommentsListDto[] | undefined | null>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const commentService = new CommentApi(ApiConfiguration);
  const likeService = new LikeApi(ApiConfiguration);
  const {currentUser} = useAuth();

  const handleLike = async () => {
    const like = await likeService.apiLikeTogglePost({
      likeInput: {
        targetId: post.postId || 0,
        targetType: ETargetType.NUMBER_3
      }
    })
    onLike(post.postId?.toString() || '');
  };

  const handleComment = async () => {
    const comments = await commentService.apiCommentGetCommentsByPostIdGet({postId: post.postId || 0})
    setComments(comments.data?.comments)
    setShowComments(!showComments);
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/feed/${post.postId}`;
    navigator.clipboard.writeText(postUrl);
    toastr.success('Link do post copiado para a área de transferência', '', {
      timeOut: 3000,
      progressBar: true,
      positionClass: "toast-bottom-right"
    });
  };

  const handleSendComment = async () => {
    if (newComment.trim()) {
      const comment = await commentService.apiCommentSaveCommentPost({
        receiveCommentDto: {
          postId: post.postId || 0,  
          text: newComment        
        }
      })
      setNewComment('');
    }
  };

  const formatTimeAgo = (dateString: Date) => {
    try {
      return formatDistanceToNow(dateString, {
        addSuffix: true,
        locale: ptBR
      });
    } catch {
      return 'agora';
    }
  };

  const openPhotoModal = (index: number) => {
    setCurrentPhotoIndex(index);
    setPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setPhotoModalOpen(false);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === (post.photos?.length || 0) - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? (post.photos?.length || 0) - 1 : prev - 1
    );
  };

  const renderMediaGrid = () => {
    const totalPhotos = post.photos?.length || 0;
    if (totalPhotos === 0) return null;

    const displayPhotos = post.photos!.slice(0, 3);
    const remainingCount = totalPhotos - 3;

    return (
      <Box sx={{ mt: 2 }}>
        {/* Photos Grid */}
        <Grid container spacing={1} sx={{ mb: post.medias!.length > 0 ? 2 : 0 }}>
          {displayPhotos.map((photo, index) => (
            <Grid 
              item 
              xs={totalPhotos === 1 ? 12 : 6} 
              sm={totalPhotos === 1 ? 12 : totalPhotos === 2 ? 6 : 4}
              key={index}
            >
              <Box
                onClick={() => openPhotoModal(index)}
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
                  src={photo!.src!}
                  alt={`Post image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: totalPhotos === 1 ? 400 : 200,
                    objectFit: 'cover'
                  }}
                />
                
                {/* Show remaining count overlay on third photo if more exist */}
                {index === 2 && remainingCount > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 7,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h3" fontWeight="bold">
                      +{remainingCount}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>


        {/* Videos */}
        {post.medias!.length > 0 && (
          <Grid container spacing={1}>
            {post.medias!.map((video, index) => (
              <Grid item xs={12} sm={post.medias!.length === 1 ? 12 : 6} key={index}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 1,
                    overflow: 'hidden',
                    bgcolor: 'black'
                  }}
                >
                  <video
                    src={video!.src!}
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
            src={post.userAvatar!}
            sx={{ width: 48, height: 48 }}
          >
            {post.userName!.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              {post.userName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatTimeAgo(post.createdAt!)}
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
      {(post.likesCount! > 0 || post.commentsCount! > 0) && (
        <Box sx={{ px: 2, py: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2}>
              {post.likesCount! > 0 && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Favorite sx={{ fontSize: 16, color: '#d32f2f' }} />
                  <Typography variant="body2" color="text.secondary">
                    {post.likesCount}
                  </Typography>
                </Stack>
              )}
            </Stack>
            
            {post.commentsCount! > 0 && (
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
            <Avatar src={currentUser?.avatarUrl} sx={{ width: 32, height: 32 }}></Avatar>
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
            { comments && comments?.map((comment, index) => (
              <Stack key={index} direction="row" spacing={2}>
                <Avatar src={comment.userAvatarSrc!} sx={{ width: 32, height: 32 }}></Avatar>
                <Box
                  sx={{
                    bgcolor: '#f5f5f5',
                    borderRadius: 2,
                    p: 1.5,
                    flex: 1
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {comment.userName}
                  </Typography>
                  <Typography variant="body2">
                    {comment.comment}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {formatTimeAgo(comment.dateOfComment!)}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Collapse>

      {/* Photo Modal - Facebook Style */}
      <Dialog
        open={photoModalOpen}
        onClose={closePhotoModal}
        maxWidth={false}
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: 'rgba(0,0,0,0.9)',
            maxWidth: '90vw',
            maxHeight: '90vh',
            m: 2
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            bgcolor: 'black'
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={closePhotoModal}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)'
              },
              zIndex: 1
            }}
          >
            <Close />
          </IconButton>

          {/* Previous Button */}
          {(post.photos?.length || 0) > 1 && (
            <IconButton
              onClick={prevPhoto}
              sx={{
                position: 'absolute',
                left: 16,
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)'
                },
                zIndex: 1
              }}
            >
              <ChevronLeft />
            </IconButton>
          )}

          {/* Next Button */}
          {(post.photos?.length || 0) > 1 && (
            <IconButton
              onClick={nextPhoto}
              sx={{
                position: 'absolute',
                right: 16,
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)'
                },
                zIndex: 1
              }}
            >
              <ChevronRight />
            </IconButton>
          )}

          {/* Current Photo */}
          {post.photos && post.photos[currentPhotoIndex] && (
            <img
              src={post.photos[currentPhotoIndex].src!}
              alt={`Foto ${currentPhotoIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
            />
          )}

          {/* Photo Counter */}
          {(post.photos?.length || 0) > 1 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 2
              }}
            >
              <Typography variant="body2">
                {currentPhotoIndex + 1} de {post.photos?.length}
              </Typography>
            </Box>
          )}

          {/* Photo Info */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              p: 2,
              borderRadius: 2,
              maxWidth: '300px'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={post.userAvatar!}
                sx={{ width: 32, height: 32 }}
              >
                {post.userName!.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {post.userName}
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                  {formatTimeAgo(post.createdAt!)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Dialog>
    </Paper>
  );
};

export default PostCard;
