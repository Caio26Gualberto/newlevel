import { Avatar, Box, Divider, Grid, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material"
import CaioImg from "../../assets/Perfil.jpg"
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Constants
const socialLinks = [
  {
    label: 'Instagram pessoal',
    icon: <InstagramIcon />,
    href: 'https://www.instagram.com/caio_gualbertoo/'
  },
  {
    label: 'Instagram NewLevel',
    icon: <InstagramIcon />,
    href: 'https://www.instagram.com/newlevelmusic_/'
  },
  {
    label: 'Github',
    icon: <GitHubIcon />,
    href: 'https://github.com/Caio26Gualberto'
  },
  {
    label: 'Linkedin',
    icon: <LinkedInIcon />,
    href: 'https://www.linkedin.com/in/caio-faria-gualberto-50706019a/'
  }
];

const ABOUT_TEXT = `Sejam todos bem-vindos! Meu nome é Caio, e se há algo que posso garantir é que música corre em minhas veias. Desde pequeno, fui imerso em um mundo de riffs de guitarra, batidas pesadas e letras que transcendem o comum.

Cresci ouvindo Metal (Graças ao meu pai, Franco Gualberto). Bandas como Overkill, Slayer, Whiplash, Dark Angel, Exodus, Anthrax, e At War foram trilhas sonoras constantes da minha juventude. Mas, ao mesmo tempo, minha jornada musical foi enriquecida pelas influências do passado, graças ao meu avô. Paulo Sérgio, Vicente Celestino, Carlos Galhardo, Adoniran Barbosa, e muitos outros nomes ecoavam pelas paredes de nossa casa.

Para mim, a música não é apenas uma paixão; é uma necessidade. Ela é a batida do meu coração e a energia que me impulsiona. E quando se trata de expressar essa paixão, nada supera o Metal e o bom e velho Rock. Desde jovem, tive a sorte de estar imerso na cena musical, frequentando estúdios e shows com meu pai e seus amigos. Cresci rodeado pela energia pulsante dos palcos, sempre acompanhado pelos veteranos da cena, como Fabrízio (Devastor) e Adriano (o Primo do Bode).

À medida que amadureci, encontrei outra paixão: a programação. E pensei comigo mesmo, por que não unir minhas duas paixões em um único projeto? Foi assim que surgiu a ideia deste site, um espaço para compartilhar histórias, memórias e paixões musicais. Independentemente de ser um headbanger de carteirinha, um amante do Rock clássico, ou qualquer outra coisa, todos são bem-vindos para compartilhar suas experiências aqui.

E isso é apenas o começo. Estou animado para o futuro, onde espero expandir este espaço para incluir a divulgação de bandas emergentes e até mesmo produzir podcasts com alguns dos grandes nomes do cenário musical. Então, se você é um amante da música como eu, junte-se a nós nesta jornada.

Sejam bem-vindos ao nosso mundo sonoro!`;

// Components
const SocialLink = ({ label, icon, href }: { label: string; icon: React.ReactNode; href: string }) => (
  <Box 
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}
  >
    <Typography
      sx={{
        fontSize: {
          xs: "0.875rem",
          sm: "1rem"
        }
      }}
    >
      {label}
    </Typography>
    <IconButton 
      sx={{ 
        color: "red",
        '&:hover': {
          transform: 'scale(1.1)'
        }
      }} 
      target="_blank" 
      href={href}
    >
      {icon}
    </IconButton>
  </Box>
);

const AboutMe = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "92.5vh",
        bgcolor: "#F3F3F3",
        p: {
          xs: 2,
          sm: 3,
          md: 4
        }
      }}
    >
      <Grid 
        container 
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          height: {
            xs: "auto",
            md: "90%"
          },
          maxWidth: "1200px",
          width: "100%",
          overflow: "hidden"
        }}
      >
        {/* Profile Section */}
        <Grid 
          item 
          xs={12}
          md={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: {
              xs: 2,
              sm: 3
            }
          }}
        >
          <Box 
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2
            }}
          >
            <Avatar 
              src={CaioImg} 
              sx={{ 
                width: {
                  xs: "150px",
                  sm: "180px",
                  md: "200px"
                },
                height: {
                  xs: "150px",
                  sm: "180px",
                  md: "200px"
                }
              }} 
            />
          </Box>
          
          {/* Social Links */}
          <Box 
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
              alignItems: {
                xs: "center",
                md: "flex-start"
              }
            }}
          >
            {socialLinks.map((link, index) => (
              <SocialLink key={index} {...link} />
            ))}
          </Box>
        </Grid>

        {/* Divider */}
        <Grid item xs={12} md={1}>
          <Box 
            sx={{
              height: "100%",
              display: {
                xs: "none",
                md: "flex"
              },
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Divider orientation="vertical" />
          </Box>
        </Grid>

        {/* Content Section */}
        <Grid 
          item 
          xs={12}
          md={8}
          sx={{
            p: {
              xs: 2,
              sm: 3
            }
          }}
        >
          <Typography 
            sx={{
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
                md: "1.0625rem"
              },
              fontWeight: "bold",
              lineHeight: 1.7,
              textAlign: {
                xs: "justify",
                md: "left"
              }
            }}
          >
            {ABOUT_TEXT}
          </Typography>
          <Typography 
            sx={{
              mt: 2,
              fontSize: {
                xs: "0.75rem",
                sm: "0.875rem"
              },
              fontStyle: "italic",
              color: "text.secondary"
            }}
          >
            Texto gerado pelo GPT &#128514; Porem baseado na minha história
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutMe;
