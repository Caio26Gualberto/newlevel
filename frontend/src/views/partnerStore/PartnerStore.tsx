import { Box, Typography, useTheme, useMediaQuery } from '@mui/material'
import MetalLogo from '../../assets/MetalMusicLogoBranco.png'
import React from 'react'

const PartnerStore = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        mt: {
          xs: 8,
          md: 0
        },
        justifyContent: "center",
        alignItems: "center",
        p: {
          xs: 2,
          sm: 3,
          md: 4
        }
      }}
    >
      <Box
        sx={{
          width: {
            xs: "100%",
            sm: "90%",
            md: "80%"
          },
          maxWidth: "800px",
          textAlign: "center",
          p: {
            xs: 2,
            sm: 3,
            md: 4
          }
        }}
      >
        <Typography
          variant={isSmallMobile ? "h5" : "h4"}
          gutterBottom
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
              md: "2.125rem"
            },
            fontWeight: "bold",
            mb: 3
          }}
        >
          Fortalecendo a Cena Metal do ABC: Nossa Parceria com Loja Metal Music
        </Typography>
        
        <Typography
          variant="body1"
          paragraph
          sx={{ 
            fontSize: {
              xs: "0.875rem",
              sm: "1rem"
            },
            lineHeight: 1.6,
            mb: 2
          }}
        >
          É com grande orgulho que anunciamos nossa parceria com a lendária
          <strong> Loja Metal Music </strong>, um verdadeiro ícone da cena metal do ABC.
          Mais do que uma loja, ela é um ponto de encontro para os fãs da música pesada, colecionadores
          e entusiastas da cultura dos anos 80. Com décadas de história e um legado cultural que ressoa
          profundamente na nossa região, a loja continua sendo um símbolo de resistência e autenticidade
          no universo do metal.
        </Typography>
        
        <Typography
          variant="body1"
          paragraph
          sx={{ 
            fontSize: {
              xs: "0.875rem",
              sm: "1rem"
            },
            lineHeight: 1.6,
            mb: 2
          }}
        >
          Nosso objetivo conjunto é claro: <strong>fortalecer a cena metal no ABC</strong>. Sabemos da
          importância que essa cultura tem para nossa comunidade e, por isso, unimos forças para criar um
          espaço onde <strong>bandas consagradas</strong> e <strong>novos talentos</strong> possam se
          apresentar e ganhar visibilidade, <strong>sem burocracia, sem distinção, com espaço para todos</strong>.
        </Typography>
        
        <Typography
          variant="body1"
          paragraph
          sx={{ 
            fontSize: {
              xs: "0.875rem",
              sm: "1rem"
            },
            lineHeight: 1.6,
            mb: 2
          }}
        >
          Com essa parceria, queremos não só resgatar a energia dos anos dourados do metal, mas também abrir
          portas para as novas gerações, proporcionando um ambiente que celebre a música e a irmandade metal.
          Juntos, acreditamos que podemos manter viva a chama do metal e garantir que o ABC continue sendo um
          polo importante na cena musical underground.
        </Typography>
        
        <Typography
          variant="body1"
          sx={{ 
            fontSize: {
              xs: "0.875rem",
              sm: "1rem"
            },
            lineHeight: 1.6,
            mb: 4
          }}
        >
          Se você faz parte dessa história, seja como músico, fã ou entusiasta, essa parceria é para você.
          Venha fazer parte dessa jornada conosco e <strong>vamos fortalecer a cena metal juntos!</strong>
        </Typography>
        
        <a href="https://www.metalmusic.com.br/" target="_blank" rel="noopener noreferrer">
          <Box
            component="img"
            src={MetalLogo}
            sx={{
              cursor: "pointer",
              width: {
                xs: "100%",
                sm: "80%",
                md: "auto"
              },
              maxWidth: "100%",
              height: "auto",
              m: {
                xs: 2,
                sm: 3,
                md: 5
              },
              transition: "transform 0.3s ease-in-out",
              '&:hover': {
                transform: "scale(1.05)"
              }
            }}
          />
        </a>
      </Box>
    </Box>
  );
}

export default PartnerStore