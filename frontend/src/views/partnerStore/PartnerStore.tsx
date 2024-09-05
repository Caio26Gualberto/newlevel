import { Box, Typography } from '@mui/material'
import MetalLogo from '../../assets/MetalMusicLogoBranco.png'
import React from 'react'

const PartnerStore = () => {
  return (
    <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
      <Box width="80%" maxWidth="800px" textAlign="center">
        <Typography variant="h4" gutterBottom>
          Fortalecendo a Cena Metal do ABC: Nossa Parceria com Loja Metal Music
        </Typography>
        <Typography variant="body1" paragraph>
          É com grande orgulho que anunciamos nossa parceria com a lendária
          <strong> Loja Metal Music </strong>, um verdadeiro ícone da cena metal do ABC.
          Mais do que uma loja, ela é um ponto de encontro para os fãs da música pesada, colecionadores
          e entusiastas da cultura dos anos 80. Com décadas de história e um legado cultural que ressoa
          profundamente na nossa região, a loja continua sendo um símbolo de resistência e autenticidade
          no universo do metal.
        </Typography>
        <Typography variant="body1" paragraph>
          Nosso objetivo conjunto é claro: <strong>fortalecer a cena metal no ABC</strong>. Sabemos da
          importância que essa cultura tem para nossa comunidade e, por isso, unimos forças para criar um
          espaço onde <strong>bandas consagradas</strong> e <strong>novos talentos</strong> possam se
          apresentar e ganhar visibilidade, <strong>sem burocracia, sem distinção, com espaço para todos</strong>.
        </Typography>
        <Typography variant="body1" paragraph>
          Com essa parceria, queremos não só resgatar a energia dos anos dourados do metal, mas também abrir
          portas para as novas gerações, proporcionando um ambiente que celebre a música e a irmandade metal.
          Juntos, acreditamos que podemos manter viva a chama do metal e garantir que o ABC continue sendo um
          polo importante na cena musical underground.
        </Typography>
        <Typography variant="body1">
          Se você faz parte dessa história, seja como músico, fã ou entusiasta, essa parceria é para você.
          Venha fazer parte dessa jornada conosco e <strong>vamos fortalecer a cena metal juntos!</strong>
        </Typography>
        <a href="https://www.metalmusic.com.br/" target="_blank">
          <Box m={5} component="img" src={MetalLogo} sx={{ cursor: "pointer" }} />
        </a>
      </Box>
    </Box>
  );
}

export default PartnerStore