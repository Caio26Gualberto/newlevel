import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  IconButton, 
  Typography, 
  Skeleton,
  Alert 
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { PostApi } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';
import { PostDto } from '../../gen/api/src';
import PostCard from '../../components/feed/PostCard';

const PostDetail = () => {
  const postService = new PostApi(ApiConfiguration);
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) return;
        setLoading(true);
        const result = await postService.apiPostGetIdGet({ id: Number(postId) });
        if (result.isSuccess && result.data) {
          setPost(result.data);
        } else {
          setError('Post não encontrado');
        }
      } catch (err) {
        console.error("Erro ao carregar post:", err);
        setError('Erro ao carregar post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLikePost = (postId: string) => {
    if (!post) return;
    setPost(prev => prev ? {
      ...prev,
      likesCount: (prev.likesCount || 0) + 1
    } : null);
  };

  const handleGoBack = () => {
    navigate('/feed');
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          py: 3
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
          </Box>
          <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
        </Container>
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          py: 3
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <IconButton 
              onClick={handleGoBack}
              sx={{ 
                bgcolor: 'white',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              <ArrowBack />
            </IconButton>
          </Box>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error || 'Post não encontrado'}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: 3
      }}
    >
      <Container maxWidth="md">
        {/* Header com botão de voltar */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={handleGoBack}
            sx={{ 
              bgcolor: 'white',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" color="text.secondary">
            Detalhes do Post
          </Typography>
        </Box>

        {/* Post único */}
        <PostCard post={post} onLike={handleLikePost} />
      </Container>
    </Box>
  );
};

export default PostDetail;
