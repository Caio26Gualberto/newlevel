import { 
  Avatar, 
  Box, 
  Container, 
  Divider, 
  Grid, 
  IconButton, 
  Paper, 
  Typography, 
  useTheme, 
  useMediaQuery,
  Fade
} from "@mui/material";
import { useState, useEffect } from "react";
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ImagemLogo from "../../assets/Eu.jpg";

// Assets - usando placeholder por enquanto
const CaioImg = ImagemLogo;

// Constants
const socialLinks = [
  {
    label: 'Instagram pessoal',
    icon: <InstagramIcon />,
    href: 'https://www.instagram.com/caio_gualbertoo/',
    color: '#333'
  },
  {
    label: 'Instagram NewLevel',
    icon: <InstagramIcon />,
    href: 'https://www.instagram.com/newlevelmusic_/',
    color: '#333'
  },
  {
    label: 'Github',
    icon: <GitHubIcon />,
    href: 'https://github.com/Caio26Gualberto',
    color: '#333'
  },
  {
    label: 'Linkedin',
    icon: <LinkedInIcon />,
    href: 'https://www.linkedin.com/in/caio-faria-gualberto-50706019a/',
    color: '#333'
  }
];

const ABOUT_TEXT = `Sejam todos bem-vindos! Meu nome é Caio, e se há algo que posso garantir é que música corre em minhas veias. Desde pequeno, fui imerso em um mundo de riffs de guitarra, batidas pesadas e letras que transcendem o comum.

Cresci ouvindo Metal (Graças ao meu pai, Franco Gualberto). Bandas como Overkill, Slayer, Whiplash, Dark Angel, Exodus, Anthrax, e At War foram trilhas sonoras constantes da minha juventude. Mas, ao mesmo tempo, minha jornada musical foi enriquecida pelas influências do passado, graças ao meu avô. Paulo Sérgio, Vicente Celestino, Carlos Galhardo, Adoniran Barbosa, e muitos outros nomes ecoavam pelas paredes de nossa casa.

Para mim, a música não é apenas uma paixão; é uma necessidade. Ela é a batida do meu coração e a energia que me impulsiona. E quando se trata de expressar essa paixão, nada supera o Metal e o bom e velho Rock. Desde jovem, tive a sorte de estar imerso na cena musical, frequentando estúdios e shows com meu pai e seus amigos. Cresci rodeado pela energia pulsante dos palcos, sempre acompanhado pelos veteranos da cena, como Fabrízio (Devastor) e Adriano (o Primo do Bode).

À medida que amadureci, encontrei outra paixão: a programação. E pensei comigo mesmo, por que não unir minhas duas paixões em um único projeto? Foi assim que surgiu a ideia deste site, um espaço para compartilhar histórias, memórias e paixões musicais. Independentemente de ser um headbanger de carteirinha, um amante do Rock clássico, ou qualquer outra coisa, todos são bem-vindos para compartilhar suas experiências aqui.

E isso é apenas o começo. Estou animado para o futuro, onde espero expandir este espaço para incluir a divulgação de bandas emergentes e até mesmo produzir podcasts com alguns dos grandes nomes do cenário musical. Então, se você é um amante da música como eu, junte-se a nós nesta jornada.

Sejam bem-vindos ao nosso mundo sonoro!`;

// Components
const SocialLink = ({ 
  label, 
  icon, 
  href, 
  color 
}: { 
  label: string; 
  icon: React.ReactNode; 
  href: string;
  color: string;
}) => (
  <Box 
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      p: 1,
      borderRadius: 1,
      transition: 'all 0.3s ease',
      '&:hover': {
        bgcolor: 'rgba(211, 47, 47, 0.05)',
        transform: 'translateX(4px)'
      }
    }}
  >
    <Typography
      variant="body2"
      sx={{
        fontSize: {
          xs: "0.875rem",
          sm: "1rem"
        },
        fontWeight: 500
      }}
    >
      {label}
    </Typography>
    <IconButton 
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ 
        color: color,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.2)',
          color: 'primary.main'
        }
      }} 
    >
      {icon}
    </IconButton>
  </Box>
);

const AboutMe = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <Box className="main-content">
      <Container 
        maxWidth="xl" 
        sx={{ 
          minHeight: '100vh',
          py: { xs: 2, sm: 4 },
          display: 'flex',
          alignItems: 'center'
        }}
      >
      <Fade in={loaded} timeout={800}>
        <Paper
          elevation={8}
          sx={{
            width: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
          }}
        >
          <Grid container sx={{ minHeight: { md: '80vh' } }}>
            {/* Profile Section */}
            <Grid 
              item 
              xs={12}
              md={4}
              sx={{
                background: 'linear-gradient(135deg, #d32f2f 0%, #ff6b6b 100%)',
                color: 'white',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: 'center',
                p: { xs: 3, sm: 4 },
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.1)',
                  zIndex: 0
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                {/* Avatar */}
                <Box sx={{ mb: 3 }}>
                  <Avatar 
                    src={CaioImg} 
                    sx={{ 
                      width: {
                        xs: 120,
                        sm: 150,
                        md: 180
                      },
                      height: {
                        xs: 120,
                        sm: 150,
                        md: 180
                      },
                      border: '4px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }} 
                  />
                </Box>

                {/* Name */}
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    mb: 1,
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                  }}
                >
                  Caio Gualberto
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.9,
                    mb: 4,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  Desenvolvedor & Metalhead
                </Typography>

                {/* Social Links */}
                <Box 
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    width: "100%",
                    maxWidth: 300
                  }}
                >
                  {socialLinks.map((link, index) => (
                    <SocialLink key={index} {...link} />
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Content Section */}
            <Grid 
              item 
              xs={12}
              md={8}
              sx={{
                p: { xs: 3, sm: 4, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {/* Header */}
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                    fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
                  }}
                >
                  Sobre Mim
                </Typography>
                <Divider 
                  sx={{ 
                    width: 60, 
                    height: 4, 
                    bgcolor: 'primary.main',
                    borderRadius: 2
                  }} 
                />
              </Box>

              {/* Content */}
              <Typography 
                variant="body1"
                sx={{
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                  lineHeight: 1.8,
                  textAlign: 'justify',
                  color: 'text.primary',
                  whiteSpace: 'pre-line'
                }}
              >
                {ABOUT_TEXT}
              </Typography>

              {/* Footer Note */}
              <Box 
                sx={{ 
                  mt: 4, 
                  p: 2, 
                  bgcolor: 'rgba(211, 47, 47, 0.05)',
                  borderRadius: 2,
                  borderLeft: '4px solid',
                  borderColor: 'primary.main'
                }}
              >
                <Typography 
                  variant="caption"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    fontStyle: "italic",
                    color: "text.secondary",
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <span>🤖</span>
                  Texto gerado pelo GPT, porém baseado na minha história
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Fade>
      </Container>
    </Box>
  );
};

export default AboutMe;
