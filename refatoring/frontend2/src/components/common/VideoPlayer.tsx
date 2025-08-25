import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon
} from '@mui/icons-material';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnail?: string;
  width?: string | number;
  height?: string | number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  thumbnail,
  width = '100%',
  height = 315
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : '';
  const thumbnailUrl = thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '');

  const handlePlay = () => {
    setShowPlayer(true);
    setIsPlaying(true);
  };

  const handleStop = () => {
    setShowPlayer(false);
    setIsPlaying(false);
  };

  if (!videoId) {
    return (
      <Paper
        elevation={2}
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.200',
          borderRadius: 2
        }}
      >
        <Typography color="text.secondary">
          Vídeo não disponível
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        width,
        height,
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: showPlayer ? 'default' : 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: showPlayer ? 'none' : 'scale(1.02)',
          boxShadow: showPlayer ? theme.shadows[4] : theme.shadows[8]
        }
      }}
      onClick={!showPlayer ? handlePlay : undefined}
    >
      {!showPlayer ? (
        // Thumbnail with play button
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            backgroundImage: `url(${thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Dark overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.5)'
              }
            }}
          />
          
          {/* Play button */}
          <Fade in timeout={300}>
            <IconButton
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                color: 'primary.main',
                width: { xs: 60, sm: 80 },
                height: { xs: 60, sm: 80 },
                zIndex: 2,
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <PlayIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
            </IconButton>
          </Fade>

          {/* Title overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
              zIndex: 1
            }}
          >
            <Typography
              variant={isMobile ? 'body2' : 'subtitle1'}
              color="white"
              fontWeight="bold"
              sx={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
      ) : (
        // YouTube embed
        <Fade in timeout={500}>
          <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '8px' }}
            />
            
            {/* Close button */}
            <IconButton
              onClick={handleStop}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                width: 32,
                height: 32,
                zIndex: 10,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.9)'
                }
              }}
            >
              <PauseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Fade>
      )}
    </Paper>
  );
};

export default VideoPlayer;
