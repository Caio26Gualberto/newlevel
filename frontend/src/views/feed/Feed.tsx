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

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // Mock data for demonstration
  const generateMockPosts = (pageNum: number): Post[] => {
    const mockPosts: Post[] = [];
    for (let i = 0; i < 5; i++) {
      const postId = `${pageNum}-${i}`;
      mockPosts.push({
        id: postId,
        userId: `user-${i}`,
        userName: `Usuário ${i + 1}`,
        userAvatar: `https://i.pravatar.cc/150?u=${i}`,
        content: `Este é um post de exemplo ${postId}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
        photos: i % 3 === 0 ? [`https://picsum.photos/600/400?random=${postId}-1`, `https://picsum.photos/600/400?random=${postId}-2`] : [],
        videos: i % 4 === 0 ? [`https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`] : [],
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        likesCount: Math.floor(Math.random() * 100),
        commentsCount: Math.floor(Math.random() * 50),
        isLiked: Math.random() > 0.5,
      });
    }
    return mockPosts;
  };

  const loadPosts = useCallback(async (pageNum: number) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPosts = generateMockPosts(pageNum);
      
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      // Simulate end of data after page 5
      if (pageNum >= 5) {
        setHasMore(false);
      }
    } catch (err) {
      setError('Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    loadPosts(1);
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1);
      loadPosts(page + 1);
    }
  }, [inView, hasMore, loading, page, loadPosts]);

  const handleNewPost = (newPost: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'isLiked'>) => {
    const post: Post = {
      ...newPost,
      id: `new-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
    };
    setPosts(prev => [post, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
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
                key={post.id}
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
