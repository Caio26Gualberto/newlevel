import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Skeleton,
  Alert,
} from '@mui/material';
import { useInView } from 'react-intersection-observer';
import PostCreation from '../../components/feed/PostCreation';
import PostCard from '../../components/feed/PostCard';
import { PostApi, PostDto } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';

const Feed = () => {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const postService = new PostApi(ApiConfiguration);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });


  const loadPosts = useCallback(async (pageNum: number) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await postService.apiPostGetAllGet({
        page: pageNum,
        pageSize: 10
      });

      if (response.isSuccess && response.data?.items) {
        const apiPosts = response.data.items;

        if (pageNum === 1) {
          setPosts(apiPosts);
        } else {
          setPosts(prev => [...prev, ...apiPosts]);
        }

        // Check if there are more posts
        const totalPages = Math.ceil((response.data.totalCount || 0) / 10);
        setHasMore(pageNum < totalPages);
      } else {
        setError(response.message || 'Erro ao carregar posts');
      }
    } catch (err: any) {
      console.error('Error loading posts:', err);
      setError('Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  }, [loading, postService]);

  useEffect(() => {
    loadPosts(1);
  }, []);

  // useEffect(() => {
  //   if (inView && hasMore && !loading) {
  //     const nextPage = page + 1;
  //     setPage(nextPage);
  //     loadPosts(nextPage);
  //   }
  // }, [inView, hasMore, loading, page]);

  const handleNewPost = (newPost: PostDto) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.postId?.toString() === postId 
        ? { 
            ...post, 
            likesCount: (post.likesCount || 0) + 1
          }
        : post
    ));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: { xs: 2, sm: 3 }
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3}>

          {/* Post Creation */}
          <PostCreation onPostCreated={handleNewPost} />

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Posts Feed */}
          <Stack spacing={2}>
            {posts.map((post) => (
              <PostCard
                key={post.postId?.toString() || Math.random()}
                post={post}
                onLike={handleLikePost}
              />
            ))}

            {/* Loading Skeletons */}
            {loading && (
              <>
                {[...Array(3)].map((_, index) => (
                  <Box
                    key={`skeleton-${index}`}
                    sx={{
                      bgcolor: 'white',
                      borderRadius: 2,
                      p: 3,
                      boxShadow: 1
                    }}
                  >
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Skeleton variant="circular" width={48} height={48} />
                        <Box flex={1}>
                          <Skeleton variant="text" width="30%" height={24} />
                          <Skeleton variant="text" width="20%" height={20} />
                        </Box>
                      </Box>
                      <Skeleton variant="text" width="100%" height={20} />
                      <Skeleton variant="text" width="80%" height={20} />
                      <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 1 }} />
                      <Box display="flex" gap={2}>
                        <Skeleton variant="text" width={80} height={32} />
                        <Skeleton variant="text" width={80} height={32} />
                        <Skeleton variant="text" width={80} height={32} />
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </>
            )}

            {/* Infinite Scroll Trigger */}
            {hasMore && (
              <Box ref={ref} sx={{ height: 20 }} />
            )}

            {/* End of Feed Message */}
            {!hasMore && posts.length > 0 && (
              <Box textAlign="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Você chegou ao fim do feed
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Feed;
