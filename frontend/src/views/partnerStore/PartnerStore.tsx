import { Box, Typography } from '@mui/material'
import MetalLogo from '../../assets/MetalMusicLogoBranco.png'
import React from 'react'
import { useMobile } from '../../MobileContext'

const PartnerStore = () => {
  const { isMobile } = useMobile()
  return (
    <Box
      height="100vh"
      display="flex"
      mt={ isMobile ? 30 : 0}
      justifyContent="center"
      alignItems="center"
      p={isMobile ? 2 : 4} // Ajusta o padding
    >
      <Box
        width={isMobile ? "100%" : "80%"}
        maxWidth="800px"
        textAlign="center"
        p={isMobile ? 2 : 4} // Adiciona padding extra em dispositivos móveis
      >
        <Typography
          variant={isMobile ? "h5" : "h4"} // Ajusta o tamanho da fonte
          gutterBottom
        >
          Fortalecendo a Cena Metal do ABC: Nossa Parceria com Loja Metal Music
        </Typography>
        <Typography
          variant="body1"
          paragraph
          sx={{ fontSize: isMobile ? 'body2.fontSize' : 'body1.fontSize' }} // Ajusta o tamanho da fonte
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
          sx={{ fontSize: isMobile ? 'body2.fontSize' : 'body1.fontSize' }} // Ajusta o tamanho da fonte
        >
          Nosso objetivo conjunto é claro: <strong>fortalecer a cena metal no ABC</strong>. Sabemos da
          importância que essa cultura tem para nossa comunidade e, por isso, unimos forças para criar um
          espaço onde <strong>bandas consagradas</strong> e <strong>novos talentos</strong> possam se
          apresentar e ganhar visibilidade, <strong>sem burocracia, sem distinção, com espaço para todos</strong>.
        </Typography>
        <Typography
          variant="body1"
          paragraph
          sx={{ fontSize: isMobile ? 'body2.fontSize' : 'body1.fontSize' }} // Ajusta o tamanho da fonte
        >
          Com essa parceria, queremos não só resgatar a energia dos anos dourados do metal, mas também abrir
          portas para as novas gerações, proporcionando um ambiente que celebre a música e a irmandade metal.
          Juntos, acreditamos que podemos manter viva a chama do metal e garantir que o ABC continue sendo um
          polo importante na cena musical underground.
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: isMobile ? 'body2.fontSize' : 'body1.fontSize' }} // Ajusta o tamanho da fonte
        >
          Se você faz parte dessa história, seja como músico, fã ou entusiasta, essa parceria é para você.
          Venha fazer parte dessa jornada conosco e <strong>vamos fortalecer a cena metal juntos!</strong>
        </Typography>
        <a href="https://www.metalmusic.com.br/" target="_blank" rel="noopener noreferrer">
          <Box
            m={isMobile ? 2 : 5}
            component="img"
            src={MetalLogo}
            sx={{
              cursor: "pointer",
              width: isMobile ? '100%' : 'auto', // Ajusta o tamanho da imagem
              maxWidth: '100%', // Garante que a imagem não ultrapasse o container
              height: isMobile ? 'auto' : 'auto', // Ajusta a altura da imagem
            }}
          />
        </a>
      </Box>
    </Box>
  );
}

export default PartnerStore