import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Slide
} from '@mui/material';
import { PlayArrow, Photo, Podcasts, Info } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Presentation = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <PlayArrow sx={{ fontSize: 40 }} />,
      title: 'Vídeos',
      description: 'Assista aos melhores vídeos de metal',
      path: '/videos',
      color: '#d32f2f'
    },
    {
      icon: <Photo sx={{ fontSize: 40 }} />,
      title: 'Fotos',
      description: 'Explore nossa galeria de fotos',
      path: '/photos',
      color: '#ff6b6b'
    },
    {
      icon: <Podcasts sx={{ fontSize: 40 }} />,
      title: 'Podcasts',
      description: 'Ouça nossos podcasts exclusivos',
      path: '/podcasts',
      color: '#d32f2f'
    },
    {
      icon: <Info sx={{ fontSize: 40 }} />,
      title: 'Sobre',
      description: 'Conheça mais sobre nós',
      path: '/aboutMe',
      color: '#ff6b6b'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #3c140c 50%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(211, 47, 47, 0.1) 0%, transparent 50%)',
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        <Stack spacing={6} alignItems="center">
          {/* Welcome Section */}
          <Fade in timeout={1000}>
            <Box textAlign="center">
              <Typography
                variant="h2"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  background: 'linear-gradient(45deg, #ff6b6b 30%, #d32f2f 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 2
                }}
              >
                Bem-vindo ao New Level
              </Typography>
              
              <Typography
                variant="h5"
                color="rgba(255,255,255,0.8)"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.4
                }}
              >
                Sua plataforma definitiva para música metal
              </Typography>
            </Box>
          </Fade>

          {/* Features Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                md: '1fr 1fr 1fr 1fr'
              },
              gap: { xs: 3, sm: 4 },
              width: '100%',
              mt: 4
            }}
          >
            {features.map((feature, index) => (
              <Slide
                key={feature.path}
                direction="up"
                in
                timeout={800 + index * 200}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    textAlign: 'center',
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 30px rgba(211, 47, 47, 0.3)`,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%)',
                    }
                  }}
                  onClick={() => navigate(feature.path)}
                >
                  <Box
                    sx={{
                      color: feature.color,
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
                  >
                    {feature.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="rgba(255,255,255,0.7)"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Slide>
            ))}
          </Box>

          {/* CTA Section */}
          <Fade in timeout={1500}>
            <Box textAlign="center" mt={4}>
              <Typography
                variant="h6"
                color="rgba(255,255,255,0.8)"
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Pronto para começar sua jornada?
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/videos')}
                sx={{
                  mt: 2,
                  px: { xs: 4, sm: 6 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  fontWeight: 600,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
                  boxShadow: '0 4px 20px rgba(211, 47, 47, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
                    boxShadow: '0 6px 25px rgba(211, 47, 47, 0.6)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Explorar Agora
              </Button>
            </Box>
          </Fade>
        </Stack>
      </Container>
    </Box>
  );
};

export default Presentation;
