import { 
  Box, 
  Container,
  Typography, 
  useTheme, 
  useMediaQuery,
  Paper,
  Fade,
  Button,
  Divider
} from '@mui/material';
import { useState, useEffect } from 'react';
import StoreIcon from '@mui/icons-material/Store';
import LaunchIcon from '@mui/icons-material/Launch';
import HandshakeIcon from '@mui/icons-material/Handshake';
import MetalLogo from "../../assets/MetalMusicLogoBranco.png";

const PartnerStore = () => {
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
            <HandshakeIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography 
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Parceria Estratégica
            </Typography>
            <Typography 
              variant="h6"
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Fortalecendo a cena metal do ABC
            </Typography>
          </Paper>

          {/* Content */}
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }}
          >
            <Box sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
              {/* Partnership Title */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                  }}
                >
                  Nossa Parceria com Loja Metal Music
                </Typography>
                <Divider 
                  sx={{ 
                    width: 80, 
                    height: 4, 
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                    mx: 'auto'
                  }} 
                />
              </Box>

              {/* Content Sections */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Section 1 */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(211, 47, 47, 0.05)',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}
                  >
                    🤘 Um Ícone da Cena Metal
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      lineHeight: 1.7,
                      textAlign: 'justify'
                    }}
                  >
                    É com grande orgulho que anunciamos nossa parceria com a lendária{' '}
                    <strong>Loja Metal Music</strong>, um verdadeiro ícone da cena metal do ABC.
                    Mais do que uma loja, ela é um ponto de encontro para os fãs da música pesada, 
                    colecionadores e entusiastas da cultura dos anos 80. Com décadas de história e 
                    um legado cultural que ressoa profundamente na nossa região, a loja continua 
                    sendo um símbolo de resistência e autenticidade no universo do metal.
                  </Typography>
                </Box>

                {/* Section 2 */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 107, 107, 0.05)',
                    borderLeft: '4px solid',
                    borderColor: 'secondary.main'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', mb: 2, color: 'secondary.main' }}
                  >
                    🎯 Nosso Objetivo
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      lineHeight: 1.7,
                      textAlign: 'justify'
                    }}
                  >
                    Nosso objetivo conjunto é claro: <strong>fortalecer a cena metal no ABC</strong>. 
                    Sabemos da importância que essa cultura tem para nossa comunidade e, por isso, 
                    unimos forças para criar um espaço onde <strong>bandas consagradas</strong> e{' '}
                    <strong>novos talentos</strong> possam se apresentar e ganhar visibilidade,{' '}
                    <strong>sem burocracia, sem distinção, com espaço para todos</strong>.
                  </Typography>
                </Box>

                {/* Section 3 */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(76, 175, 80, 0.05)',
                    borderLeft: '4px solid',
                    borderColor: 'success.main'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', mb: 2, color: 'success.main' }}
                  >
                    🚀 Visão de Futuro
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      lineHeight: 1.7,
                      textAlign: 'justify'
                    }}
                  >
                    Com essa parceria, queremos não só resgatar a energia dos anos dourados do metal, 
                    mas também abrir portas para as novas gerações, proporcionando um ambiente que 
                    celebre a música e a irmandade metal. Juntos, acreditamos que podemos manter viva 
                    a chama do metal e garantir que o ABC continue sendo um polo importante na cena 
                    musical underground.
                  </Typography>
                </Box>

                {/* Call to Action */}
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    border: '2px dashed',
                    borderColor: 'primary.main'
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 2,
                      color: 'primary.main'
                    }}
                  >
                    Faça Parte Dessa História!
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      lineHeight: 1.7,
                      mb: 3
                    }}
                  >
                    Se você faz parte dessa história, seja como músico, fã ou entusiasta, 
                    essa parceria é para você. Venha fazer parte dessa jornada conosco e{' '}
                    <strong>vamos fortalecer a cena metal juntos!</strong>
                  </Typography>
                </Box>
              </Box>

              {/* Logo and Link Section */}
              <Box sx={{ textAlign: 'center', mt: 6 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 3,
                    color: 'text.primary'
                  }}
                >
                  Conheça Nosso Parceiro
                </Typography>
                
                <Box
                  component="a"
                  href="https://www.metalmusic.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-block',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      maxWidth: 400,
                      mx: 'auto',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        elevation: 8,
                        boxShadow: '0 12px 40px rgba(211, 47, 47, 0.3)'
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={MetalLogo}
                      alt="Metal Music Logo"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 2,
                        mb: 2
                      }}
                    />
                    <Button
                      variant="contained"
                      endIcon={<LaunchIcon />}
                      fullWidth
                      sx={{
                        background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #b71c1c, #f44336)'
                        }
                      }}
                    >
                      Visitar Loja Metal Music
                    </Button>
                  </Paper>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default PartnerStore;
