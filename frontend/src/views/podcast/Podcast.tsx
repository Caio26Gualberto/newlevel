import { 
  Box, 
  Container,
  Typography, 
  useTheme, 
  useMediaQuery,
  Paper,
  Fade,
  Button,
  Chip
} from "@mui/material";
import { useState, useEffect } from "react";
import PodcastsIcon from '@mui/icons-material/Podcasts';
import MicIcon from '@mui/icons-material/Mic';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ComingSoonIcon from '@mui/icons-material/Schedule';

const Podcast = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
      <Fade in={fadeIn} timeout={800}>
        <Box>
          {/* Header */}
          <Paper
            elevation={4}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #d32f2f 0%, #ff6b6b 100%)',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <PodcastsIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography 
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              New Level Podcast
            </Typography>
            <Typography 
              variant="h6"
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Conversas sobre música, cultura e a cena metal
            </Typography>
          </Paper>

          {/* Coming Soon Content */}
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              textAlign: 'center'
            }}
          >
            <Box sx={{ p: { xs: 4, sm: 6, md: 8 } }}>
              {/* Main Icon */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: 120, sm: 150, md: 180 },
                  height: { xs: 120, sm: 150, md: 180 },
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                  mb: 4,
                  boxShadow: '0 12px 40px rgba(211, 47, 47, 0.3)',
                  animation: 'pulse 2s infinite'
                }}
              >
                <MicIcon sx={{ fontSize: { xs: 60, sm: 80, md: 100 }, color: 'white' }} />
              </Box>

              {/* Coming Soon Badge */}
              <Chip
                icon={<ComingSoonIcon />}
                label="Em Breve"
                color="primary"
                variant="outlined"
                sx={{
                  mb: 3,
                  fontSize: '1.1rem',
                  py: 2,
                  px: 3,
                  height: 'auto',
                  '& .MuiChip-icon': {
                    fontSize: '1.5rem'
                  }
                }}
              />

              {/* Main Title */}
              <Typography 
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }
                }}
              >
                Em Breve! 🎙️
              </Typography>

              {/* Description */}
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '1.2rem', sm: '1.4rem' }
                }}
              >
                Estamos preparando algo especial para você! Em breve teremos conversas 
                incríveis sobre música, entrevistas com grandes nomes do metal e muito mais.
              </Typography>

              {/* Features Preview */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3,
                  justifyContent: 'center',
                  mb: 6,
                  maxWidth: 800,
                  mx: 'auto'
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(211, 47, 47, 0.05)',
                    border: '1px solid rgba(211, 47, 47, 0.2)'
                  }}
                >
                  <PodcastsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Entrevistas Exclusivas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversas com músicos, produtores e personalidades da cena metal
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 107, 107, 0.05)',
                    border: '1px solid rgba(255, 107, 107, 0.2)'
                  }}
                >
                  <MicIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Debates Musicais
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Discussões sobre álbuns, bandas e a evolução do metal
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(76, 175, 80, 0.05)',
                    border: '1px solid rgba(76, 175, 80, 0.2)'
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Novidades da Cena
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Últimas notícias e lançamentos do mundo do metal
                  </Typography>
                </Box>
              </Box>

              {/* Call to Action */}
              <Box
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  border: '2px dashed',
                  borderColor: 'primary.main'
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Fique por dentro!
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                  Cadastre-se para ser notificado quando o primeiro episódio for ao ar.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<NotificationsIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #b71c1c, #f44336)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(211, 47, 47, 0.4)'
                    }
                  }}
                >
                  Quero ser Notificado
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Fade>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 12px 40px rgba(211, 47, 47, 0.3);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 16px 50px rgba(211, 47, 47, 0.4);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 12px 40px rgba(211, 47, 47, 0.3);
            }
          }
        `}
      </style>
    </Container>
  );
};

export default Podcast;
